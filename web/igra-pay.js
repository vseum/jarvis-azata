// Подписка игры «Аяты вокруг нас» (рахмат.рус/igra) через ЮKassa API v3.
// Подключение в server.js: const igraPay = require('./igra-pay')({ send }); и в handle():
//   if (p.startsWith('/igra/api/') && await igraPay.handle(req, res, p, url)) return;
// Эндпоинты (все под /igra/api/):
//   POST pay/start {plan:'month'|'year', code?}  → {confirmation_url, paid}   — платёж с сохранением способа оплаты
//   POST pay/hook                                 — HTTP-уведомления ЮKassa (тело не доверяем: перепроверяем GET-запросом)
//   GET  pay/status?paid=<ключ из return_url>     → {status, plan, until, code?}
//   GET  me?code=…                                → {active, until, plan, autopay}
//   POST autopay/off {code}, autopay/on {code}    → {ok, autopay, until}
// Ежечасно — безакцептное продление тем, у кого срок кончается в ближайшие сутки (3 неудачные попытки раз в сутки → autopay выкл.).
// Без IGRA_DB_URL или ключей ЮKassa — 503 {error:'payments off'}, остальной сайт работает как раньше.
// Персональных данных не храним: email для чека покупатель вводит на странице ЮKassa, у нас — только код доступа и id способа оплаты.

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

module.exports = function igraPay({ send, env = process.env, store: givenStore } = {}) {
  const API = (env.YOOKASSA_API || 'https://api.yookassa.ru/v3').replace(/\/$/, '');
  const SHOP = env.YOOKASSA_SHOP_ID || '', SECRET = env.YOOKASSA_SECRET_KEY || '';
  const RETURN = env.IGRA_RETURN_URL || 'https://xn--80aa9aonp.xn--p1acf/igra/';
  const TIMEOUT = +env.YOOKASSA_TIMEOUT_MS || 15000;
  const AUTH = 'Basic ' + Buffer.from(SHOP + ':' + SECRET).toString('base64');
  const kassaOn = !!(SHOP && SECRET);

  let store = givenStore || null;
  if (!store && env.IGRA_DB_URL) {
    try { store = makeStore(env.IGRA_DB_URL); }
    catch (e) { console.error('igra pay: store failed:', e.message); }
  }
  if (store && store.kind === 'memory' && !givenStore) console.warn('igra pay: IGRA_DB_URL=memory — подписки живут только в памяти (для тестов)');
  if (!store || !kassaOn) console.warn('igra pay: payments off (' + [!store && 'IGRA_DB_URL', !kassaOn && 'YOOKASSA_SHOP_ID/YOOKASSA_SECRET_KEY'].filter(Boolean).join(', ') + ' not set)');

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

  // ---------- ЮKassa
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

  // ---------- проведение статусов (вся логика начисления — здесь, атомарно)
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

  // obj — платёж, полученный НАМИ из ЮKassa (GET или ответ на создание), не из тела уведомления
  async function applyPayment(obj) {
    const md = obj.metadata || {};
    if (md.app !== 'igra') return { ignored: true };       // чужой платёж того же магазина
    const plan = PLANS[md.plan] ? md.plan : null, kind = md.kind === 'renew' ? 'renew' : 'first';
    const amount = Number(obj.amount && obj.amount.value), accId = +md.account || null;
    const token = /^[\w-]{22}$/.test(md.t || '') ? md.t : null;
    return store.tx(async t => {
      await t.addPayment({ id: obj.id, token, account_id: accId, amount, status: 'pending', kind, plan });
      const row = await t.payment(obj.id, true);
      if (row.status !== 'pending' || (obj.status !== 'succeeded' && obj.status !== 'canceled')) {
        return { payment: row, account: row.account_id ? await t.account(row.account_id) : null };
      }
      if (obj.status === 'canceled') {
        await t.setPayment(row.id, { status: 'canceled' });
        const reason = obj.cancellation_details && obj.cancellation_details.reason;
        const account = kind === 'renew' && row.account_id ? await failRenew(t, row.account_id, reason === 'permission_revoked') : null;
        return { payment: Object.assign(row, { status: 'canceled' }), account, changed: true };
      }
      // succeeded
      if (!plan || !obj.paid || obj.amount.currency !== 'RUB' || !(amount >= PLANS[plan].price)) {
        console.error(`igra pay: payment ${obj.id} succeeded but does not match plan (${md.plan}, ${obj.amount && obj.amount.value} ${obj.amount && obj.amount.currency}) — check by hand`);
        await t.setPayment(row.id, { status: 'mismatch' });
        return { payment: Object.assign(row, { status: 'mismatch' }) };
      }
      let a = row.account_id ? await t.account(row.account_id, true) : null;
      if (!a) a = await createAccount(t);
      const now = new Date(), base = a.paid_until && a.paid_until > now ? a.paid_until : now;
      const pm = obj.payment_method && obj.payment_method.saved && obj.payment_method.id ? String(obj.payment_method.id) : null;
      const f = { plan, paid_until: addMonths(base, PLANS[plan].months), fails: 0, retry_at: null };
      if (pm) { f.payment_method_id = pm; f.autopay = true; }
      await t.setAccount(a.id, f);
      await t.setPayment(row.id, { status: 'succeeded', account_id: a.id, ...(token && !row.token ? { token } : {}) });
      console.log(`igra pay: ${kind} payment ok, account ${a.id}, ${plan}, until ${f.paid_until.toISOString()}`);
      return { payment: Object.assign(row, { status: 'succeeded', account_id: a.id }), account: Object.assign(a, f), changed: true };
    });
  }

  async function syncPayment(id) {
    const r = await kassa('GET', '/payments/' + encodeURIComponent(id));
    if (r.status === 404) return { ignored: true };
    if (r.status !== 200 || !r.json || r.json.id !== id) throw new Error('get payment: ' + kErr(r));
    return applyPayment(r.json);
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

  // ---------- автопродление
  async function renew(a) {
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
    if (r.status === 200 && r.json && r.json.id) return applyPayment(r.json);
    // 400 — ЮKassa отклонила запрос (например, способ оплаты больше недействителен): считаем неудачной попыткой.
    // 401/403/429/5xx и сеть — ошибка настройки или временная: попробуем через час с тем же ключом
    if (r.status === 400) return store.tx(t => failRenew(t, a.id, false));
    throw new Error('renew: ' + kErr(r));
  }

  let ticking = false;
  async function tick() {
    if (ticking || !store || !kassaOn || !await ready()) return;
    ticking = true;
    try {
      const now = new Date();
      for (const p of await store.stale(now)) await syncPayment(p.id).catch(e => console.error('igra pay: recheck', p.id, e.message));
      for (const a of await store.due(now)) await renew(a).catch(e => console.error('igra pay: account', a.id, e.message));
    } catch (e) { console.error('igra pay: tick', e.message); }
    finally { ticking = false; }
  }
  const timers = [];
  if (store && kassaOn && !env.IGRA_NO_TIMER) {
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

  function readJson(req, max) {
    return new Promise(resolve => {
      let size = 0; const parts = [];
      req.on('data', c => { size += c.length; if (size > max) { resolve(null); req.destroy(); } else parts.push(c); });
      req.on('end', () => { try { const v = JSON.parse(Buffer.concat(parts).toString('utf8')); resolve(v && typeof v === 'object' && !Array.isArray(v) ? v : null); } catch (e) { resolve(null); } });
      req.on('error', () => resolve(null));
    });
  }
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
      'POST /igra/api/pay/start': 'kassa', 'POST /igra/api/pay/hook': 'kassa', 'GET /igra/api/pay/status': 'kassa',
      'GET /igra/api/me': 'db', 'POST /igra/api/autopay/off': 'db', 'POST /igra/api/autopay/on': 'db',
    };
    const need = routes[req.method + ' ' + p];
    if (!need) return false;
    if (!store || (need === 'kassa' && !kassaOn)) { send(res, 503, { error: 'payments off' }); return true; }
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
      const plan = PLANS[b.plan], token = crypto.randomBytes(16).toString('base64url');
      const r = await kassa('POST', '/payments', {
        amount: { value: rub(plan.price), currency: 'RUB' },
        capture: true,
        save_payment_method: true,
        confirmation: { type: 'redirect', return_url: RETURN + '?paid=' + token },
        description: `Аяты вокруг нас: подписка на ${plan.label}`,
        metadata: { app: 'igra', plan: b.plan, account: account ? String(account.id) : '', kind: 'first', t: token },
      }, crypto.randomUUID());
      if (r.status !== 200 || !r.json || !r.json.confirmation || !r.json.confirmation.confirmation_url) {
        console.error('igra pay: create payment', kErr(r));
        return send(res, 502, { error: 'payment not created' });
      }
      await store.tx(t => t.addPayment({ id: r.json.id, token, account_id: account && account.id, amount: plan.price, status: 'pending', kind: 'first', plan: b.plan }));
      return send(res, 200, { confirmation_url: r.json.confirmation.confirmation_url, paid: token });
    }

    if (p === '/igra/api/pay/hook') {
      if (!lim.hook(ipOf(req))) return send(res, 429, { error: 'too many requests' });
      const b = await readJson(req, 65536);
      const id = b && b.object && typeof b.object.id === 'string' && /^[\w-]{1,64}$/.test(b.object.id) ? b.object.id : null;
      if (!b || b.type !== 'notification' || typeof b.event !== 'string' || !id) return send(res, 400, { error: 'bad notification' });
      // ответ 200 — только когда событие проведено (или уже было проведено); иначе ЮKassa повторит доставку в течение суток
      if (b.event === 'payment.succeeded' || b.event === 'payment.canceled' || b.event === 'payment.waiting_for_capture') await syncPayment(id);
      else if (b.event === 'refund.succeeded') await syncRefund(id);
      return send(res, 200, { ok: true });
    }

    if (p === '/igra/api/pay/status') {
      if (!lim.status(ipOf(req))) return send(res, 429, { error: 'too many requests' });
      const token = url.searchParams.get('paid') || '';
      if (!/^[\w-]{22}$/.test(token)) return send(res, 400, { error: 'bad id' });
      let pay = await store.paymentByToken(token);
      if (!pay) return send(res, 404, { error: 'not found' });
      if (pay.status === 'pending') {                 // уведомление ещё не дошло — спросим ЮKassa сами
        try { await syncPayment(pay.id); pay = await store.paymentByToken(token); }
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
    stop() { for (const x of timers) clearTimeout(x), clearInterval(x); return store ? store.close().catch(() => {}) : Promise.resolve(); },
    store,          // для тестов
    _util: { normCode, newCode, addMonths },
  };
};
