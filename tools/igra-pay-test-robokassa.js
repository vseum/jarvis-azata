// Сценарий подписки игры против мока Робокассы: node tools/igra-pay-test-robokassa.js [postgres://…] [md5|sha256]
// Без адреса базы — хранилище в памяти; с адресом — настоящий PostgreSQL (таблицы igra_* и последовательность очищаются!).
// start → ResultURL с неверной и верной подписью → status → me → return → продление по коду (через OpStateExt) →
// автопродление дочерним платежом → отказ ×3 → autopay off/on.

const http = require('http');
const assert = require('assert/strict');
const path = require('path');
const crypto = require('crypto');
const createMock = require('./robokassa-mock');
const igraPay = require(path.join(__dirname, '..', 'web', 'igra-pay'));

const args = process.argv.slice(2);
const DB = args.find(a => a.startsWith('postgres')) || 'memory';
const ALG = args.find(a => /^(md5|sha\d+)$/.test(a)) || 'md5';
const H = 3600000;

function send(res, status, body, type) {   // как send() в server.js
  res.writeHead(status, { 'Content-Type': type || 'application/json; charset=utf-8' });
  res.end(typeof body === 'string' ? body : JSON.stringify(body));
}
const listen = srv => new Promise(r => srv.listen(0, '127.0.0.1', () => r(srv.address().port)));

(async () => {
  const mock = createMock({ alg: ALG });
  const MOCK = `http://127.0.0.1:${await listen(mock.server)}`;
  if (DB !== 'memory') {
    const { Client } = require(path.join(__dirname, '..', 'web', 'node_modules', 'pg'));
    const c = new Client({ connectionString: DB }); await c.connect();
    await c.query('DROP TABLE IF EXISTS igra_payments; DROP TABLE IF EXISTS igra_accounts; DROP SEQUENCE IF EXISTS igra_inv_seq;'); await c.end();
  }
  const baseEnv = {
    IGRA_DB_URL: DB, IGRA_NO_TIMER: '1', IGRA_STALE_MS: '0',
    ROBOKASSA_LOGIN: mock.login, ROBOKASSA_PASS1: mock.pass1, ROBOKASSA_PASS2: mock.pass2, ROBOKASSA_HASH: ALG, ROBOKASSA_URL: MOCK,
    YOOKASSA_SHOP_ID: 'shop', YOOKASSA_SECRET_KEY: 'secret',     // заданы оба — по умолчанию должна быть выбрана Робокасса
  };
  const pay = igraPay({ send, env: baseEnv });
  const app = http.createServer(async (req, res) => {
    const url = new URL(req.url, 'http://x');
    if (!await pay.handle(req, res, url.pathname, url)) send(res, 404, { error: 'not found' });
  });
  const port = await listen(app);
  const B = `http://127.0.0.1:${port}`;
  mock.resultUrl = B + '/igra/api/pay/hook/robokassa';
  const call = async (method, p, body) => {
    const r = await fetch(B + p, { method, headers: { 'Content-Type': 'application/json' }, body: body === undefined ? undefined : JSON.stringify(body), redirect: 'manual' });
    const text = await r.text();
    let json = null; try { json = JSON.parse(text); } catch (e) {}
    return { status: r.status, json, text, location: r.headers.get('location') };
  };
  const ctl = (p, body) => fetch(MOCK + p, { method: 'POST', body: body ? JSON.stringify(body) : undefined }).then(r => r.json());
  const acc = code => pay.store.accountByCode(code.replace('-', ''));
  const setAcc = (id, f) => pay.store.tx(t => t.setAccount(id, f));
  const recurring = () => mock.log.filter(x => x.op === 'recurring');
  const ok = name => console.log('  ok —', name);
  const H_ = s => crypto.createHash(ALG).update(s, 'utf8').digest('hex').toUpperCase();

  console.log(`store: ${pay.store.kind}, hash: ${ALG}`);
  assert.equal(pay.provider, 'robokassa');
  assert.equal(igraPay({ send, env: Object.assign({}, baseEnv, { IGRA_PAY: 'yookassa', IGRA_DB_URL: 'memory' }) }).provider, 'yookassa');
  assert.equal(igraPay({ send, env: { IGRA_DB_URL: 'memory', ROBOKASSA_LOGIN: 'x', ROBOKASSA_PASS1: 'y' } }).provider, null);  // без Пароля#2 — выключено
  ok('выбор провайдера: Робокасса по умолчанию, IGRA_PAY=yookassa, без ключей — выкл.');

  // ---- 1. start: ссылка на оплату и подпись
  const s = await call('POST', '/igra/api/pay/start', { plan: 'month' });
  assert.equal(s.status, 200);
  const token = s.json.paid, u1 = new URL(s.json.confirmation_url), q1 = u1.searchParams;
  assert.equal(u1.origin + u1.pathname, MOCK + '/Merchant/Index.aspx');
  assert.equal(q1.get('MerchantLogin'), mock.login);
  assert.equal(q1.get('OutSum'), '349.00');
  assert.equal(q1.get('Recurring'), 'true');
  assert.equal(q1.get('IsTest'), null);
  assert.equal(q1.get('Description'), 'Аяты вокруг нас - подписка на месяц');
  assert.deepEqual([q1.get('Shp_account'), q1.get('Shp_kind'), q1.get('Shp_paid'), q1.get('Shp_plan')], ['0', 'first', token, 'month']);
  const rc = JSON.parse(decodeURIComponent(q1.get('Receipt')));
  assert.deepEqual(rc, { items: [{ name: 'Доступ к полной версии игры «Аяты вокруг нас» на месяц', quantity: 1, sum: 349, tax: 'none', payment_method: 'full_payment', payment_object: 'service' }] });
  const inv1 = +q1.get('InvId');
  assert.equal(q1.get('SignatureValue'), H_(`${mock.login}:349.00:${inv1}:${q1.get('Receipt')}:${mock.pass1}:Shp_account=0:Shp_kind=first:Shp_paid=${token}:Shp_plan=month`));
  const page = await (await fetch(s.json.confirmation_url)).text();
  assert.ok(!page.includes('error.code'), 'мок принял подпись: ' + page);
  ok(`pay/start → ссылка Merchant/Index.aspx, InvId ${inv1}, Recurring, Receipt, Shp_*, подпись ${ALG}`);

  // ---- 2. до оплаты и с неверной подписью — ничего
  assert.equal((await call('GET', '/igra/api/pay/status?paid=' + token)).json.status, 'pending');
  const bad = await ctl('/__result/' + inv1, { badSig: true });
  assert.equal(bad.status, 400);
  const forged = await fetch(mock.resultUrl, { method: 'POST', body: new URLSearchParams({ OutSum: '349.000000', InvId: String(inv1), SignatureValue: 'A'.repeat(32), Shp_plan: 'year' }) });
  assert.equal(forged.status, 400);
  assert.equal((await call('GET', '/igra/api/pay/status?paid=' + token)).json.code, undefined);
  ok('ResultURL с неверной подписью → 400, доступа нет');

  // ---- 3. оплата → ResultURL → OK<InvId>; повторная доставка идемпотентна
  const r1 = await ctl('/__pay/' + inv1);
  assert.deepEqual(r1, { status: 200, text: 'OK' + inv1 });
  const r1b = await ctl('/__result/' + inv1);
  assert.deepEqual(r1b, { status: 200, text: 'OK' + inv1 });
  const st = await call('GET', '/igra/api/pay/status?paid=' + token);
  assert.equal(st.json.status, 'succeeded');
  const code = st.json.code;
  let a = await acc(code);
  const until1 = +a.paid_until;
  assert.ok(Math.abs(until1 - (Date.now() + 30.5 * 24 * H)) < 3 * 24 * H);
  assert.equal(a.payment_method_id, 'rk:' + inv1);
  assert.equal(a.autopay, true);
  ok(`ResultURL → «OK${inv1}» (дважды, без двойного продления), код ${code}`);

  // ---- 4. me и возврат со страницы Робокассы
  assert.deepEqual((await call('GET', '/igra/api/me?code=' + code)).json, { active: true, until: new Date(until1).toISOString(), plan: 'month', autopay: true });
  const ret = await call('GET', `/igra/api/pay/return?OutSum=349.00&InvId=${inv1}&SignatureValue=X&Culture=ru&Shp_account=0&Shp_kind=first&Shp_paid=${token}&Shp_plan=month`);
  assert.deepEqual([ret.status, ret.location], [302, '/igra/?paid=' + token]);
  assert.equal((await call('GET', '/igra/api/pay/return?InvId=' + inv1)).location, '/igra/');
  ok('me; SuccessURL/FailURL → 302 /igra/?paid=<ключ>');

  // ---- 5. продление по коду на год; ResultURL задержался — статус узнаём через OpStateExt
  const s2 = await call('POST', '/igra/api/pay/start', { plan: 'year', code });
  const q2 = new URL(s2.json.confirmation_url).searchParams, inv2 = +q2.get('InvId');
  assert.equal(q2.get('Shp_account'), String(a.id)); assert.equal(q2.get('OutSum'), '2490.00');
  await fetch(s2.json.confirmation_url);
  await ctl('/__pay/' + inv2, { callback: false });
  const st2 = await call('GET', '/igra/api/pay/status?paid=' + s2.json.paid);
  assert.equal(st2.json.status, 'succeeded'); assert.equal(st2.json.code, code);
  assert.ok(mock.log.some(x => x.op === 'state' && x.params.InvoiceID === String(inv2)));
  assert.equal((await ctl('/__result/' + inv2)).text, 'OK' + inv2);        // запоздалый ResultURL — без второго начисления
  a = await acc(code);
  const exp = new Date(until1); exp.setUTCFullYear(exp.getUTCFullYear() + 1);
  assert.equal(+a.paid_until, +exp); assert.equal(a.plan, 'year'); assert.equal(a.payment_method_id, 'rk:' + inv2);
  ok('pay/start с кодом → тот же аккаунт, +1 год; статус через OpStateExt, поздний ResultURL идемпотентен');

  // ---- 6. брошенная оплата: OpStateExt state 10 → canceled
  const s3 = await call('POST', '/igra/api/pay/start', { plan: 'month' });
  const inv3 = +new URL(s3.json.confirmation_url).searchParams.get('InvId');
  await fetch(s3.json.confirmation_url); await ctl('/__fail/' + inv3);
  const st3 = await call('GET', '/igra/api/pay/status?paid=' + s3.json.paid);
  assert.equal(st3.json.status, 'canceled'); assert.equal(st3.json.code, undefined);
  ok('отменённый счёт → canceled, кода нет');

  // ---- 7. автопродление дочерним платежом
  const soon = new Date(Date.now() + 12 * H);
  await setAcc(a.id, { paid_until: soon });
  await ctl('/__recurring', { mode: 'ok' });
  await pay.tick();
  let rq = recurring().pop().params;
  assert.equal(rq.PreviousInvoiceID, String(inv2));
  assert.equal(rq.OutSum, '2490.00');
  assert.equal(rq.Description, 'Аяты вокруг нас - подписка на год (продление)');
  assert.deepEqual([rq.Shp_account, rq.Shp_kind, rq.Shp_plan], [String(a.id), 'renew', 'year']);
  assert.equal(rq.SignatureValue, H_(`${mock.login}:2490.00:${rq.InvoiceID}:${rq.Receipt}:${mock.pass1}:Shp_account=${a.id}:Shp_kind=renew:Shp_plan=year`));
  assert.ok(!('Recurring' in rq) && !('IncCurrLabel' in rq));
  assert.equal(+(await acc(code)).paid_until, +soon, 'до ResultURL срок не меняется');
  const n1 = recurring().length;
  await pay.tick();
  assert.equal(recurring().length, n1, 'пока продление в pending — второго списания нет');
  const fl = await ctl('/__flush');
  assert.deepEqual(fl, [{ status: 200, text: 'OK' + rq.InvoiceID }]);
  a = await acc(code);
  const exp2 = new Date(soon); exp2.setUTCFullYear(exp2.getUTCFullYear() + 1);
  assert.equal(+a.paid_until, +exp2); assert.equal(a.payment_method_id, 'rk:' + inv2, 'материнский счёт не меняется');
  await pay.tick();
  assert.equal(recurring().length, n1, 'после продления не списываем');
  ok(`автопродление: Merchant/Recurring, PreviousInvoiceID=${inv2}, подпись без него, ResultURL → +1 год`);

  // ---- 8. отказ ×3 → autopay=false (отказ узнаём через OpStateExt: на ResultURL приходят только успехи)
  await ctl('/__recurring', { mode: 'fail' });
  const soon3 = new Date(Date.now() + 5 * H);
  await setAcc(a.id, { paid_until: soon3, plan: 'month' });
  for (let i = 1; i <= 3; i++) {
    await pay.tick();                                   // создаём дочерний счёт
    rq = recurring().pop().params;
    assert.equal(rq.OutSum, '349.00');
    await pay.tick();                                   // перепроверка: state 10 → отказ
    a = await acc(code);
    assert.equal(a.fails, i);
    const before = recurring().length;
    await pay.tick();
    assert.equal(recurring().length, before, 'до retry_at не повторяем');
    await setAcc(a.id, { retry_at: new Date(Date.now() - 1000) });   // «прошли сутки»
  }
  assert.equal(a.autopay, false);
  const b3 = recurring().length; await pay.tick(); assert.equal(recurring().length, b3);
  assert.equal(+a.paid_until, +soon3);
  ok('отказ ×3 (раз в сутки) → autopay=false, срок не тронут');

  // ---- 9. autopay on/off; ошибка Merchant/Recurring сразу считается отказом
  assert.equal((await call('POST', '/igra/api/autopay/on', { code })).json.autopay, true);
  await ctl('/__recurring', { mode: 'error500' });
  await pay.tick();
  a = await acc(code); assert.equal(a.fails, 1); assert.equal(a.autopay, true);
  const off = await call('POST', '/igra/api/autopay/off', { code });
  assert.deepEqual([off.json.autopay, off.json.active], [false, true]);
  await setAcc(a.id, { retry_at: new Date(Date.now() - 1000) });
  const b4 = recurring().length; await pay.tick(); assert.equal(recurring().length, b4);
  ok('autopay/off → без списаний; HTTP 500 от Recurring = отказ');

  // ---- 10. тестовый режим добавляет IsTest=1
  const t = igraPay({ send, env: Object.assign({}, baseEnv, { IGRA_DB_URL: 'memory', ROBOKASSA_TEST: '1' }) });
  const tapp = http.createServer(async (req, res) => { const url = new URL(req.url, 'http://x'); await t.handle(req, res, url.pathname, url); });
  const tport = await listen(tapp);
  const ts = await (await fetch(`http://127.0.0.1:${tport}/igra/api/pay/start`, { method: 'POST', body: JSON.stringify({ plan: 'month' }) })).json();
  assert.equal(new URL(ts.confirmation_url).searchParams.get('IsTest'), '1');
  tapp.close(); await t.stop();
  ok('ROBOKASSA_TEST=1 → IsTest=1');

  await pay.stop(); app.close(); mock.server.close();
  console.log('ВСЁ ПРОШЛО');
})().catch(e => { console.error('FAIL:', e); process.exit(1); });
