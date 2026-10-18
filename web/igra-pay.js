// Подписка игры «Аяты вокруг нас» (рахмат.рус/igra). Два провайдера:
//   Робокасса (основной: «Робочеки СМЗ» — чек НПД в «Мой налог» на каждый платёж, включая продления) и ЮKassa (запасной).
// Выбор для новых оплат: IGRA_PAY=robokassa|yookassa; по умолчанию Робокасса, если заданы её ключи, иначе ЮKassa.
// Продления идут через того провайдера, у которого сохранён способ оплаты семьи (оба могут работать одновременно).
// Подключение в server.js: const igraPay = require('./igra-pay')({ send }); и в handle():
//   if (p.startsWith('/igra/api/') && await igraPay.handle(req, res, p, url)) return;
// Эндпоинты (все под /igra/api/), одинаковые для обоих провайдеров:
//   POST pay/start {plan:'month'|'year', code?}  → {confirmation_url, paid}
//   GET  pay/status?paid=<ключ>                   → {status, plan, until, code?}
//   GET  me?code=…                                → {active, until, plan, autopay}
//   POST autopay/off {code}, autopay/on {code}    → {ok, active, until, plan, autopay}
// Служебные:
//   POST pay/hook                — HTTP-уведомления ЮKassa (тело не доверяем: перепроверяем GET-запросом)
//   POST pay/hook/robokassa      — ResultURL Робокассы (подпись Паролем#2, ответ OK<InvId>)
//   GET|POST pay/return          — SuccessURL/FailURL Робокассы: переадресация на /igra/?paid=<ключ>
// Ежечасно — безакцептное продление тем, у кого срок кончается в ближайшие сутки (3 неудачные попытки раз в сутки → autopay выкл.).
// Без IGRA_DB_URL или ключей провайдера — 503 {error:'payments off'}, остальной сайт работает как раньше.
// Персональных данных не храним: email для чека покупатель вводит на странице оплаты, у нас — код доступа и id способа оплаты.

const crypto = require('crypto');
const makeStore = require('./igra-store');

const PLANS = {
  month: { price: 349, label: 'месяц', months: 1 },
  year: { price: 2490, label: 'год', months: 12 },
};
// код доступа: 8 знаков без похожих (нет 0/O/Q, 1/I/L, 2/Z, 5/S, 6/G, 8/B), показываем как ABCD-EFGH
const ALPHABET = 'ACDEFHJKMNPRTUVWXY34679';
// родитель может набрать код русской раскладкой — похожие кириллические буквы считаем латинскими
const CYR = { А: 'A', В: 'B', Е: 'E', К: 'K', М: 'M', Н: 'H', О: 'O', Р: 'P', С: 'C', Т: 'T', У: 'Y', Х: 'X' };
const H = 3600000, DAY = 24 * H;
const TOKEN = /^[\w-]{22}$/;
const RK_PM = 'rk:';   // способ оплаты Робокассы = номер материнского счёта: payment_method_id = 'rk:<InvId>'

function addMonths(d, n) {
  const x = new Date(d), day = x.getUTCDate();
  x.setUTCDate(1);
  x.setUTCMonth(x.getUTCMonth() + n);
  const last = new Date(Date.UTC(x.getUTCFullYear(), x.getUTCMonth() + 1, 0)).getUTCDate();
  x.setUTCDate(Math.min(day, last));          // 31 января + 1 мес = 28/29 февраля
  return x;
}
function newCode() {
  let s = '';
  for (const b of crypto.randomBytes(8)) s += ALPHABET[b % ALPHABET.length];  // 256 % 23 — смещение < 1 %, для кода не важно
  return s;
}
function normCode(v) {
  const s = String(v || '').toUpperCase().replace(/[А-ЯЁ]/g, c => CYR[c] || c).replace(/[\s-]/g, '');
  return new RegExp(`^[${ALPHABET}]{8}$`).test(s) ? s : null;
}
const showCode = c => c.slice(0, 4) + '-' + c.slice(4);
const rub = n => n.toFixed(2);

function limiter(max, windowMs) {
  const hits = new Map();
  return key => {
    const now = Date.now(), h = hits.get(key), fresh = h && now - h[1] < windowMs;
    if (fresh && h[0] >= max) return false;
    if (hits.size > 20000) hits.clear();
    hits.set(key, fresh ? [h[0] + 1, h[1]] : [1, now]);
    return true;
  };
}
function readRaw(req, max) {
  return new Promise(resolve => {
    let size = 0; const parts = [];
    req.on('data', c => { size += c.length; if (size > max) { resolve(null); req.destroy(); } else parts.push(c); });
    req.on('end', () => resolve(Buffer.concat(parts).toString('utf8')));
    req.on('error', () => resolve(null));
  });
}
async function readJson(req, max) {
  const s = await readRaw(req, max);
  try { const v = JSON.parse(s); return v && typeof v === 'object' && !Array.isArray(v) ? v : null; } catch (e) { return null; }
}

module.exports = function igraPay({ send, env = process.env, store: givenStore } = {}) {
  const RETURN = env.IGRA_RETURN_URL || 'https://xn--80aa9aonp.xn--p1acf/igra/';

  // ---------- хранилище
  let store = givenStore || null;
  if (!store && env.IGRA_DB_URL) {
    try { store = makeStore(env.IGRA_DB_URL); }
    catch (e) { console.error('igra pay: store failed:', e.message); }
  }
  if (store && store.kind === 'memory' && !givenStore) console.warn('igra pay: IGRA_DB_URL=memory — подписки живут только в памяти (для тестов)');
  // таблицы создаём при старте; если база недоступна — пробуем снова не чаще раза в 30 с
  let readyP = null, readyAt = 0;
  function ready() {
    if (!store) return Promise.resolve(false);
    if (readyP && (readyP.ok || Date.now() - readyAt < 30000)) return readyP.then(() => readyP.ok);
    readyAt = Date.now();
    const p = store.init().then(() => { p.ok = true; }, e => { console.error('igra db init:', e.message); });
    readyP = p;
    return p.then(() => !!p.ok);
  }
  ready();

  // ---------- общее проведение статусов (атомарно, одинаково для обоих провайдеров)
  async function createAccount(t) {
    for (let i = 0; i < 8; i++) { const a = await t.createAccount(newCode()); if (a) return a; }
    throw new Error('no free code');
  }

  async function failRenew(t, accountId, revoked) {
    const a = await t.account(accountId, true);
    if (!a) return null;
    const fails = a.fails + 1, off = revoked || fails >= 3;
    const f = { fails, retry_at: new Date(Date.now() + DAY) };
    if (off) f.autopay = false;
    if (revoked) f.payment_method_id = null;   // пользователь отозвал разрешение — способ оплаты больше не годится
    await t.setAccount(a.id, f);
    console.log(`igra pay: renewal failed for account ${a.id} (${fails}/3)${off ? ', autopay off' : ''}`);
    return Object.assign(a, f);
  }

  // ev — проверенные нами данные платежа: {id, provider, inv_id?, parent_inv_id?, token?, account_id?, kind, plan, amount,
  //   status: 'pending'|'succeeded'|'canceled', valid (сумма/валюта сошлись), pm? (сохранённый способ оплаты), revoked?}
  function settle(ev) {
    return store.tx(async t => {
      await t.addPayment({ id: ev.id, provider: ev.provider, inv_id: ev.inv_id, parent_inv_id: ev.parent_inv_id, token: ev.token,
        account_id: ev.account_id, amount: ev.amount, status: 'pending', kind: ev.kind, plan: ev.plan });
      const row = await t.payment(ev.id, true);
      if (row.status !== 'pending' || (ev.status !== 'succeeded' && ev.status !== 'canceled')) {
        return { payment: row, account: row.account_id ? await t.account(row.account_id) : null };
      }
      if (ev.status === 'canceled') {
        await t.setPayment(row.id, { status: 'canceled' });
        const account = row.kind === 'renew' && row.account_id ? await failRenew(t, row.account_id, !!ev.revoked) : null;
        return { payment: Object.assign(row, { status: 'canceled' }), account, changed: true };
      }
      const plan = row.plan;
      if (!PLANS[plan] || !ev.valid || !(ev.amount >= PLANS[plan].price)) {
        console.error(`igra pay: payment ${row.id} succeeded but does not match plan (${plan}, ${ev.amount}) — check by hand`);
        await t.setPayment(row.id, { status: 'mismatch' });
        return { payment: Object.assign(row, { status: 'mismatch' }) };
      }
      let a = row.account_id ? await t.account(row.account_id, true) : null;
      if (!a) a = await createAccount(t);
      const now = new Date(), base = a.paid_until && a.paid_until > now ? a.paid_until : now;
      const f = { plan, paid_until: addMonths(base, PLANS[plan].months), fails: 0, retry_at: null };
      if (ev.pm && row.kind === 'first') { f.payment_method_id = ev.pm; f.autopay = true; }
      await t.setAccount(a.id, f);
      await t.setPayment(row.id, { status: 'succeeded', account_id: a.id, ...(ev.token && !row.token ? { token: ev.token } : {}) });
      console.log(`igra pay: ${row.provider} ${row.kind} payment ok, account ${a.id}, ${plan}, until ${f.paid_until.toISOString()}`);
      return { payment: Object.assign(row, { status: 'succeeded', account_id: a.id }), account: Object.assign(a, f), changed: true };
    });
  }

  // ======================================================================= ЮKassa (запасной)
  const yk = (() => {
    const API = (env.YOOKASSA_API || 'https://api.yookassa.ru/v3').replace(/\/$/, '');
    const SHOP = env.YOOKASSA_SHOP_ID || '', SECRET = env.YOOKASSA_SECRET_KEY || '';
    const TIMEOUT = +env.YOOKASSA_TIMEOUT_MS || 15000;
    const AUTH = 'Basic ' + Buffer.from(SHOP + ':' + SECRET).toString('base64');

    async function kassa(method, path, body, key) {
      const headers = { Authorization: AUTH, Accept: 'application/json' };
      if (body) headers['Content-Type'] = 'application/json';
      if (key) headers['Idempotence-Key'] = key;
      const r = await fetch(API + path, { method, headers, body: body ? JSON.stringify(body) : undefined, signal: AbortSignal.timeout(TIMEOUT) });
      let json = null;
      try { json = await r.json(); } catch (e) {}
      return { status: r.status, json };
    }
    const kErr = r => `HTTP ${r.status}${r.json && r.json.code ? ' ' + r.json.code : ''}${r.json && r.json.description ? ': ' + String(r.json.description).slice(0, 200) : ''}`;

    // obj — платёж, полученный НАМИ из ЮKassa (GET или ответ на создание), не из тела уведомления
    function apply(obj) {
      const md = obj.metadata || {};
      if (md.app !== 'igra') return { ignored: true };       // чужой платёж того же магазина
      const pm = obj.payment_method && obj.payment_method.saved && obj.payment_method.id ? String(obj.payment_method.id) : null;
      return settle({
        id: obj.id, provider: 'yookassa', token: TOKEN.test(md.t || '') ? md.t : null, account_id: +md.account || null,
        kind: md.kind === 'renew' ? 'renew' : 'first', plan: PLANS[md.plan] ? md.plan : null,
        amount: Number(obj.amount && obj.amount.value), status: obj.status,
        valid: !!obj.paid && !!obj.amount && obj.amount.currency === 'RUB', pm,
        revoked: !!(obj.cancellation_details && obj.cancellation_details.reason === 'permission_revoked'),
      });
    }
    async function sync(id) {
      const r = await kassa('GET', '/payments/' + encodeURIComponent(id));
      if (r.status === 404) return { ignored: true };
      if (r.status !== 200 || !r.json || r.json.id !== id) throw new Error('get payment: ' + kErr(r));
      return apply(r.json);
    }
    // полный возврат снимает оплаченный период и выключает автопродление; частичный — только записываем
    async function syncRefund(id) {
      const r = await kassa('GET', '/refunds/' + encodeURIComponent(id));
      if (r.status === 404) return { ignored: true };
      if (r.status !== 200 || !r.json || r.json.id !== id) throw new Error('get refund: ' + kErr(r));
      const rf = r.json;
      if (rf.status !== 'succeeded') return { ignored: true };
      return store.tx(async t => {
        const pay = await t.payment(rf.payment_id, true);
        if (!pay || pay.kind === 'refund') return { ignored: true };   // не наш платёж
        if (!await t.addPayment({ id: rf.id, account_id: pay.account_id, amount: Number(rf.amount.value), status: 'succeeded', kind: 'refund', ref: pay.id })) return { already: true };
        if (pay.status !== 'succeeded' || !pay.account_id || await t.refundedSum(pay.id) < pay.amount) return { partial: true };
        await t.setPayment(pay.id, { status: 'refunded' });
        const a = await t.account(pay.account_id, true), now = new Date();
        let until = a.paid_until;
        if (until && PLANS[pay.plan]) {
          until = addMonths(until, -PLANS[pay.plan].months);
          if (until < now) until = now;
        }
        await t.setAccount(a.id, { paid_until: until, autopay: false });
        console.log(`igra pay: payment refunded, account ${a.id} until ${until && until.toISOString()}`);
        return { refunded: true };
      });
    }

    return {
      name: 'yookassa',
      on: !!(SHOP && SECRET),
      async start(planId, account, token) {
        const plan = PLANS[planId];
        const r = await kassa('POST', '/payments', {
          amount: { value: rub(plan.price), currency: 'RUB' },
          capture: true,
          save_payment_method: true,
          confirmation: { type: 'redirect', return_url: RETURN + '?paid=' + token },
          description: `Аяты вокруг нас: подписка на ${plan.label}`,
          metadata: { app: 'igra', plan: planId, account: account ? String(account.id) : '', kind: 'first', t: token },
        }, crypto.randomUUID());
        if (r.status !== 200 || !r.json || !r.json.confirmation || !r.json.confirmation.confirmation_url) throw new Error('create payment: ' + kErr(r));
        await store.tx(t => t.addPayment({ id: r.json.id, provider: 'yookassa', token, account_id: account && account.id, amount: plan.price, status: 'pending', kind: 'first', plan: planId }));
        return r.json.confirmation.confirmation_url;
      },
      recheck: row => sync(row.id),
      async renew(a) {
        const plan = PLANS[a.plan];
        // один ключ на (аккаунт, оплаченный период, попытка): повтор в тот же час или второй контейнер при деплое получат
        // тот же платёж, а не второе списание. Попытку различает retry_at — он меняется после каждого отказа и при autopay/on
        const key = `igra-renew-${a.id}-${+a.paid_until}-${a.retry_at ? +a.retry_at : 0}`;
        const r = await kassa('POST', '/payments', {
          amount: { value: rub(plan.price), currency: 'RUB' },
          capture: true,
          payment_method_id: a.payment_method_id,
          description: `Аяты вокруг нас: подписка на ${plan.label} (продление)`,
          metadata: { app: 'igra', plan: a.plan, account: String(a.id), kind: 'renew' },
        }, key);
        if (r.status === 200 && r.json && r.json.id) return apply(r.json);
        // 400 — ЮKassa отклонила запрос (например, способ оплаты больше недействителен): считаем неудачной попыткой.
        // 401/403/429/5xx и сеть — ошибка настройки или временная: попробуем через час с тем же ключом
        if (r.status === 400) return store.tx(t => failRenew(t, a.id, false));
        throw new Error('renew: ' + kErr(r));
      },
      async hook(req, res) {
        const b = await readJson(req, 65536);
        const id = b && b.object && typeof b.object.id === 'string' && /^[\w-]{1,64}$/.test(b.object.id) ? b.object.id : null;
        if (!b || b.type !== 'notification' || typeof b.event !== 'string' || !id) return send(res, 400, { error: 'bad notification' });
        // ответ 200 — только когда событие проведено (или уже было проведено); иначе ЮKassa повторит доставку в течение суток
        if (b.event === 'payment.succeeded' || b.event === 'payment.canceled' || b.event === 'payment.waiting_for_capture') await sync(id);
        else if (b.event === 'refund.succeeded') await syncRefund(id);
        return send(res, 200, { ok: true });
      },
    };
  })();

  // ======================================================================= Робокасса (основной)
  // Документация: docs.robokassa.ru/ru/pay-interface, /ru/notifications-and-redirects, /ru/recurring-payments,
  // /ru/xml-interfaces (OpStateExt), /ru/fiscalization; OpenAPI: docs.robokassa.ru/openapi/robokassa.yaml
  const rk = (() => {
    const LOGIN = env.ROBOKASSA_LOGIN || '', P1 = env.ROBOKASSA_PASS1 || '', P2 = env.ROBOKASSA_PASS2 || '';
    const ALG = (env.ROBOKASSA_HASH || 'md5').toLowerCase();
    const TEST = env.ROBOKASSA_TEST === '1';
    const BASE = (env.ROBOKASSA_URL || 'https://auth.robokassa.ru').replace(/\/$/, '');
    const RECEIPT = env.ROBOKASSA_RECEIPT !== '0';
    const TIMEOUT = +env.ROBOKASSA_TIMEOUT_MS || 15000;
    const algOk = ['md5', 'sha1', 'sha256', 'sha384', 'sha512'].includes(ALG);
    if (LOGIN && !algOk) console.error('igra pay: ROBOKASSA_HASH must be md5|sha1|sha256|sha384|sha512 — Робокасса выключена');

    const sign = s => crypto.createHash(ALG).update(s, 'utf8').digest('hex').toUpperCase();
    const sameSign = (a, b) => { const x = Buffer.from(String(a).toUpperCase()), y = Buffer.from(b); return x.length === y.length && crypto.timingSafeEqual(x, y); };
    // Shp_* входят в подпись после пароля, по алфавиту, как «Shp_имя=значение»
    const shpTail = shp => Object.keys(shp).sort().map(k => `:${k}=${shp[k]}`).join('');
    // чек: одна позиция; в подпись и в запрос идёт URL-кодированный JSON (как в официальном модуле Робокассы)
    const receipt = plan => RECEIPT ? encodeURIComponent(JSON.stringify({ items: [{
      name: `Доступ к полной версии игры «Аяты вокруг нас» на ${plan.label}`,
      quantity: 1, sum: plan.price, tax: 'none', payment_method: 'full_payment', payment_object: 'service',
    }] })) : null;
    // Description: до 100 символов, без спецсимволов
    const descr = (plan, renew) => `Аяты вокруг нас - подписка на ${plan.label}${renew ? ' (продление)' : ''}`;

    // OpStateExt: состояние счёта. Только боевой режим — тестовые счета метод не видит
    async function state(inv) {
      if (TEST) return null;
      const q = new URLSearchParams({ MerchantLogin: LOGIN, InvoiceID: String(inv), Signature: sign(`${LOGIN}:${inv}:${P2}`) });
      const r = await fetch(`${BASE}/Merchant/WebService/Service.asmx/OpStateExt?${q}`, { signal: AbortSignal.timeout(TIMEOUT) });
      const xml = await r.text();
      const result = xml.match(/<Result>\s*<Code>(\d+)<\/Code>/), st = xml.match(/<State>\s*<Code>(\d+)<\/Code>/), sum = xml.match(/<OutSum>([\d.]+)<\/OutSum>/);
      if (r.status !== 200 || !result) throw new Error('OpStateExt: HTTP ' + r.status);
      return { result: +result[1], state: st ? +st[1] : null, outSum: sum ? Number(sum[1]) : null };
    }

    function evFor(row, extra) {
      return Object.assign({ id: row.id, provider: 'robokassa', inv_id: row.inv_id, parent_inv_id: row.parent_inv_id, token: row.token,
        account_id: row.account_id, kind: row.kind, plan: row.plan, amount: row.amount, valid: true,
        pm: row.kind === 'first' ? RK_PM + row.inv_id : null }, extra);
    }

    async function recheck(row) {
      const s = await state(row.inv_id);
      if (!s) return { unknown: true };
      if (s.result === 3) {                         // счёта нет: покупатель не дошёл до оплаты или запрос продления не дошёл
        if (row.kind === 'renew' && Date.now() - row.created_at > H) return settle(evFor(row, { status: 'canceled' }));
        return { pending: true };
      }
      if (s.result !== 0) throw new Error('OpStateExt result ' + s.result);
      if (s.state === 100) return settle(evFor(row, { status: 'succeeded', amount: s.outSum || row.amount }));
      if (s.state === 10 || s.state === 60) return settle(evFor(row, { status: 'canceled' }));
      return { pending: true };                     // 5 — создан, 20 — hold, 50 — в обработке, 80 — приостановлен
    }

    return {
      name: 'robokassa',
      on: !!(LOGIN && P1 && P2 && algOk),
      async start(planId, account, token) {
        const plan = PLANS[planId], inv = await store.nextInvId(), out = rub(plan.price), rc = receipt(plan);
        const shp = { Shp_account: account ? String(account.id) : '0', Shp_kind: 'first', Shp_paid: token, Shp_plan: planId };
        const q = new URLSearchParams({ MerchantLogin: LOGIN, OutSum: out, InvId: String(inv), Description: descr(plan), Recurring: 'true', Culture: 'ru', Encoding: 'utf-8' });
        if (rc) q.set('Receipt', rc);
        if (TEST) q.set('IsTest', '1');
        for (const k in shp) q.set(k, shp[k]);
        q.set('SignatureValue', sign([LOGIN, out, inv, ...(rc ? [rc] : []), P1].join(':') + shpTail(shp)));
        await store.tx(t => t.addPayment({ id: 'rk-' + inv, provider: 'robokassa', inv_id: inv, token, account_id: account && account.id,
          amount: plan.price, status: 'pending', kind: 'first', plan: planId }));
        return `${BASE}/Merchant/Index.aspx?${q}`;
      },
      recheck,
      // дочернее списание: счёт с нашим InvId и PreviousInvoiceID материнского. Строку платежа с детерминированным id
      // (аккаунт, период, попытка) пишем ДО запроса — второй процесс (деплой) или повтор после обрыва не спишет дважды
      async renew(a) {
        const plan = PLANS[a.plan], parent = +a.payment_method_id.slice(RK_PM.length);
        const id = `rk-r-${a.id}-${+a.paid_until}-${a.retry_at ? +a.retry_at : 0}`;
        const inv = await store.nextInvId();
        const claimed = await store.tx(t => t.addPayment({ id, provider: 'robokassa', inv_id: inv, parent_inv_id: parent, account_id: a.id,
          amount: plan.price, status: 'pending', kind: 'renew', plan: a.plan }));
        if (!claimed) return { already: true };
        const out = rub(plan.price), rc = receipt(plan);
        const shp = { Shp_account: String(a.id), Shp_kind: 'renew', Shp_plan: a.plan };
        const body = new URLSearchParams({ MerchantLogin: LOGIN, InvoiceID: String(inv), PreviousInvoiceID: String(parent), OutSum: out, Description: descr(plan, true) });
        if (rc) body.set('Receipt', rc);
        for (const k in shp) body.set(k, shp[k]);
        body.set('SignatureValue', sign([LOGIN, out, inv, ...(rc ? [rc] : []), P1].join(':') + shpTail(shp)));   // PreviousInvoiceID в подпись не входит
        const row = { id, inv_id: inv, parent_inv_id: parent, account_id: a.id, kind: 'renew', plan: a.plan, amount: plan.price, token: null };
        let r, text;
        try {
          r = await fetch(`${BASE}/Merchant/Recurring`, { method: 'POST', body, signal: AbortSignal.timeout(TIMEOUT) });
          text = (await r.text()).trim();
        } catch (e) {
          // ответа нет — неизвестно, создан ли счёт; выясним через OpStateExt при следующей перепроверке
          console.error(`igra pay: robokassa recurring for account ${a.id}: ${e.message}`);
          return { pending: true };
        }
        // «OK<InvId>» — счёт создан, но списание не гарантировано: итог придёт на ResultURL (успех) или увидим в OpStateExt
        if (r.status === 200 && text === 'OK' + inv) return { pending: true };
        console.error(`igra pay: robokassa recurring refused for account ${a.id}: HTTP ${r.status} ${text.slice(0, 200)}`);
        return settle(evFor(row, { status: 'canceled' }));
      },
      // ResultURL: Робокасса присылает только успешные оплаты. Подпись OutSum:InvId:Пароль#2[:Shp_*]
      async hook(req, res, url) {
        const raw = req.method === 'POST' ? await readRaw(req, 16384) : url.search.slice(1);
        if (raw === null) return send(res, 400, 'bad request', 'text/plain; charset=utf-8');
        const f = new URLSearchParams(raw), shp = {};
        for (const [k, v] of f) if (k.startsWith('Shp_')) shp[k] = v;
        const out = f.get('OutSum') || '', inv = f.get('InvId') || '', sig = f.get('SignatureValue') || '';
        if (!/^\d+(\.\d+)?$/.test(out) || !/^\d{1,18}$/.test(inv) || !/^[0-9A-Fa-f]{32,128}$/.test(sig)
          || !sameSign(sig, sign(`${out}:${inv}:${P2}` + shpTail(shp)))) {
          console.error('igra pay: robokassa ResultURL with bad signature, InvId', inv.slice(0, 20));
          return send(res, 400, 'bad sign', 'text/plain; charset=utf-8');
        }
        const n = Number(inv);
        let row = await store.paymentByInv(n);
        if (!row) {   // строки нет (не должно быть) — восстанавливаем из подписанных Shp_*
          if (!PLANS[shp.Shp_plan]) return send(res, 200, 'OK' + inv, 'text/plain; charset=utf-8');   // не наш счёт
          row = { id: 'rk-' + n, inv_id: n, parent_inv_id: null, token: TOKEN.test(shp.Shp_paid || '') ? shp.Shp_paid : null,
            account_id: +shp.Shp_account || null, kind: shp.Shp_kind === 'renew' ? 'renew' : 'first', plan: shp.Shp_plan, amount: Number(out) };
        }
        await settle(evFor(row, { status: 'succeeded', amount: Number(out) }));
        return send(res, 200, 'OK' + inv, 'text/plain; charset=utf-8');   // и на повторную доставку — тоже OK
      },
    };
  })();

  const providers = { robokassa: rk, yookassa: yk };
  const choice = env.IGRA_PAY ? providers[env.IGRA_PAY] : (rk.on ? rk : yk);
  const active = choice && choice.on ? choice : null;            // через кого принимаем новые оплаты
  const anyOn = rk.on || yk.on;
  const pmProvider = pm => String(pm || '').startsWith(RK_PM) ? rk : yk;
  if (env.IGRA_PAY && !providers[env.IGRA_PAY]) console.error('igra pay: IGRA_PAY must be robokassa|yookassa');
  if (!store || !active) {
    console.warn('igra pay: payments off (' + [!store && 'IGRA_DB_URL', !active && `keys for ${env.IGRA_PAY || 'robokassa/yookassa'}`].filter(Boolean).join(', ') + ' not set)');
  } else console.log(`igra pay: new payments via ${active.name}${rk.on && active === rk && env.ROBOKASSA_TEST === '1' ? ' (TEST mode)' : ''}`);

  // ---------- автопродление и перепроверка зависших платежей
  let ticking = false;
  async function tick() {
    if (ticking || !store || !anyOn || !await ready()) return;
    ticking = true;
    try {
      const now = new Date();
      for (const p of await store.stale(now, env.IGRA_STALE_MS ? +env.IGRA_STALE_MS : 600000)) {
        const pr = providers[p.provider];
        if (pr && pr.on) await pr.recheck(p).catch(e => console.error('igra pay: recheck', p.id, e.message));
      }
      for (const a of await store.due(now)) {
        const pr = pmProvider(a.payment_method_id);
        if (pr.on) await pr.renew(a).catch(e => console.error('igra pay: account', a.id, e.message));
      }
    } catch (e) { console.error('igra pay: tick', e.message); }
    finally { ticking = false; }
  }
  const timers = [];
  if (store && anyOn && !env.IGRA_NO_TIMER) {
    timers.push(setTimeout(tick, 60000), setInterval(tick, +env.IGRA_TICK_MS || H));
    for (const x of timers) x.unref();
  }

  // ---------- HTTP
  const ipOf = req => String(req.headers['x-forwarded-for'] || req.socket.remoteAddress || '').split(',')[0].trim();
  const lim = {
    start: limiter(20, H),         // создание платежей с одного IP
    status: limiter(120, H),       // страница возврата опрашивает статус
    code: limiter(60, H),          // проверки кода (me, autopay) с одного IP
    hook: limiter(600, H),
  };
  const codeMiss = limiter(1000, H); // общий потолок неверных кодов в час: перебор через смену IP упирается сюда

  const view = a => {
    const active = !!(a.paid_until && a.paid_until > new Date());
    return { active, until: a.paid_until ? a.paid_until.toISOString() : null, plan: a.plan, autopay: !!(a.autopay && a.payment_method_id) };
  };
  async function byCode(req, res, raw) {
    if (!lim.code(ipOf(req))) { send(res, 429, { error: 'too many requests' }); return null; }
    const code = normCode(raw);
    const a = code && await store.accountByCode(code);
    if (!a) {
      send(res, codeMiss('all') ? 404 : 429, { error: code ? 'code not found' : 'bad code' });
      return null;
    }
    return a;
  }

  async function handle(req, res, p, url) {
    const routes = {
      'POST /igra/api/pay/start': 'active', 'GET /igra/api/pay/status': 'any',
      'POST /igra/api/pay/hook': 'yookassa', 'POST /igra/api/pay/hook/robokassa': 'robokassa', 'GET /igra/api/pay/hook/robokassa': 'robokassa',
      'GET /igra/api/pay/return': 'none', 'POST /igra/api/pay/return': 'none',
      'GET /igra/api/me': 'db', 'POST /igra/api/autopay/off': 'db', 'POST /igra/api/autopay/on': 'db',
    };
    const need = routes[req.method + ' ' + p];
    if (!need) return false;
    if (need === 'none') { await route(req, res, p, url); return true; }
    const off = !store || (need === 'active' && !active) || (need === 'any' && !anyOn) || (providers[need] && !providers[need].on);
    if (off) { send(res, 503, { error: 'payments off' }); return true; }
    if (!await ready()) { send(res, 503, { error: 'db unavailable' }); return true; }
    try { await route(req, res, p, url); }
    catch (e) {
      console.error('igra pay:', p, e && e.message);
      if (!res.headersSent) send(res, 502, { error: 'temporarily unavailable' });
    }
    return true;
  }

  async function route(req, res, p, url) {
    if (p === '/igra/api/pay/start') {
      if (!lim.start(ipOf(req))) return send(res, 429, { error: 'too many requests' });
      const b = await readJson(req, 4096);
      if (!b || !PLANS[b.plan]) return send(res, 400, { error: 'bad plan' });
      let account = null;
      if (b.code !== undefined && b.code !== null && b.code !== '') {
        account = await byCode(req, res, b.code);
        if (!account) return;
      }
      const token = crypto.randomBytes(16).toString('base64url');
      let confirmation_url;
      try { confirmation_url = await active.start(b.plan, account, token); }
      catch (e) { console.error('igra pay: start', e.message); return send(res, 502, { error: 'payment not created' }); }
      return send(res, 200, { confirmation_url, paid: token });
    }

    if (p === '/igra/api/pay/hook' || p === '/igra/api/pay/hook/robokassa') {
      if (!lim.hook(ipOf(req))) return send(res, 429, { error: 'too many requests' });
      return (p === '/igra/api/pay/hook' ? yk : rk).hook(req, res, url);
    }

    // SuccessURL / FailURL Робокассы (GET или POST — как выбрано в кабинете): Shp_paid возвращается как был — уводим в игру.
    // Ничего не ищем в базе: по номеру счёта ключ не выдаём
    if (p === '/igra/api/pay/return') {
      const raw = req.method === 'POST' ? await readRaw(req, 16384) : url.search.slice(1);
      const t = new URLSearchParams(raw || '').get('Shp_paid') || '';
      res.writeHead(302, { Location: '/igra/' + (TOKEN.test(t) ? '?paid=' + t : ''), 'Cache-Control': 'no-store' });
      return res.end();
    }

    if (p === '/igra/api/pay/status') {
      if (!lim.status(ipOf(req))) return send(res, 429, { error: 'too many requests' });
      const token = url.searchParams.get('paid') || '';
      if (!TOKEN.test(token)) return send(res, 400, { error: 'bad id' });
      let pay = await store.paymentByToken(token);
      if (!pay) return send(res, 404, { error: 'not found' });
      const pr = providers[pay.provider];
      if (pay.status === 'pending' && pr && pr.on) {   // уведомление ещё не дошло — спросим провайдера сами
        try { await pr.recheck(pay); pay = await store.paymentByToken(token); }
        catch (e) { console.error('igra pay: status recheck', e.message); }
      }
      const out = { status: pay.status === 'refunded' ? 'refunded' : pay.status === 'mismatch' ? 'pending' : pay.status, plan: pay.plan };
      if (pay.status === 'succeeded' && pay.account_id) {
        const a = await store.tx(t => t.account(pay.account_id));
        // код — только по ключу своего платежа и не дольше 30 дней после оплаты
        if (a) Object.assign(out, view(a), Date.now() - pay.created_at < 30 * DAY ? { code: showCode(a.code) } : {});
      }
      return send(res, 200, out);
    }

    if (p === '/igra/api/me') {
      const a = await byCode(req, res, url.searchParams.get('code'));
      if (a) send(res, 200, view(a));
      return;
    }

    if (p === '/igra/api/autopay/off' || p === '/igra/api/autopay/on') {
      const b = await readJson(req, 4096);
      if (!b) return send(res, 400, { error: 'bad json' });
      const a = await byCode(req, res, b.code);
      if (!a) return;
      const on = p.endsWith('/on');
      if (on && !a.payment_method_id) return send(res, 409, { error: 'no saved payment method' });
      const f = on ? { autopay: true, fails: 0, retry_at: new Date() } : { autopay: false };
      await store.tx(t => t.setAccount(a.id, f));
      return send(res, 200, Object.assign({ ok: true }, view(Object.assign(a, f))));
    }
  }

  return {
    handle,
    tick,
    provider: active && active.name,
    stop() { for (const x of timers) clearTimeout(x), clearInterval(x); return store ? store.close().catch(() => {}) : Promise.resolve(); },
    store,          // для тестов
    _util: { normCode, newCode, addMonths },
  };
};
