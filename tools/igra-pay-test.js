// Сценарий подписки игры против мока ЮKassa (запасной провайдер): node tools/igra-pay-test.js [postgres://…]
// Робокасса — tools/igra-pay-test-robokassa.js.
// Без аргумента — хранилище в памяти (IGRA_DB_URL=memory), с аргументом — настоящий PostgreSQL (таблицы igra_* очищаются!).
// start → hook succeeded → status с кодом → me → продление по коду → автопродление → отказ ×3 → autopay off/on → возврат.

const http = require('http');
const assert = require('assert/strict');
const path = require('path');
const createMock = require('./yookassa-mock');
const igraPay = require(path.join(__dirname, '..', 'web', 'igra-pay'));

const DB = process.argv[2] || 'memory';
const H = 3600000, DAY = 24 * H;

function send(res, status, body, type) {   // как send() в server.js
  res.writeHead(status, { 'Content-Type': type || 'application/json; charset=utf-8' });
  res.end(typeof body === 'string' ? body : JSON.stringify(body));
}
const listen = srv => new Promise(r => srv.listen(0, '127.0.0.1', () => r(srv.address().port)));

(async () => {
  const mock = createMock();
  const mport = await listen(mock.server);
  const MOCK = `http://127.0.0.1:${mport}`;

  if (DB !== 'memory') {          // чистый лист
    const { Client } = require(path.join(__dirname, '..', 'web', 'node_modules', 'pg'));
    const c = new Client({ connectionString: DB }); await c.connect();
    await c.query('DROP TABLE IF EXISTS igra_payments; DROP TABLE IF EXISTS igra_accounts;'); await c.end();
  }
  const pay = igraPay({ send, env: {
    IGRA_DB_URL: DB, YOOKASSA_SHOP_ID: mock.shopId, YOOKASSA_SECRET_KEY: mock.secretKey,
    YOOKASSA_API: MOCK + '/v3', IGRA_NO_TIMER: '1', IGRA_RETURN_URL: 'https://xn--80aa9aonp.xn--p1acf/igra/',
  } });
  const app = http.createServer(async (req, res) => {
    const url = new URL(req.url, 'http://x');
    if (!await pay.handle(req, res, url.pathname, url)) send(res, 404, { error: 'not found' });
  });
  const port = await listen(app);
  const call = async (method, p, body, headers = {}) => {
    const r = await fetch(`http://127.0.0.1:${port}${p}`, { method, headers: { 'Content-Type': 'application/json', ...headers }, body: body === undefined ? undefined : typeof body === 'string' ? body : JSON.stringify(body) });
    return { status: r.status, json: await r.json().catch(() => null) };
  };
  const ctl = (p, body) => fetch(MOCK + p, { method: 'POST', body: body ? JSON.stringify(body) : undefined }).then(r => r.json());
  const hook = (event, id, extra = {}) => call('POST', '/igra/api/pay/hook', { type: 'notification', event, object: Object.assign({ id }, extra) });
  const acc = async code => (await pay.store.accountByCode(code.replace('-', '')));
  const setAcc = (id, f) => pay.store.tx(t => t.setAccount(id, f));
  const lastReq = () => mock.log[mock.log.length - 1];
  const ok = (name) => console.log('  ok —', name);

  console.log(`store: ${pay.store.kind}`);

  // ---- 1. неверный ввод
  assert.equal((await call('POST', '/igra/api/pay/start', { plan: 'week' })).status, 400);
  assert.equal((await call('POST', '/igra/api/pay/start', 'not json')).status, 400);
  assert.equal((await call('POST', '/igra/api/pay/start', { plan: 'month', code: 'AAAA-AAAA' })).status, 404);
  assert.equal((await call('GET', '/igra/api/pay/status?paid=../../etc')).status, 400);
  assert.equal((await call('POST', '/igra/api/pay/hook', { event: 'payment.succeeded' })).status, 400);
  ok('валидация ввода');

  // ---- 2. start: поля запроса в ЮKassa
  const s = await call('POST', '/igra/api/pay/start', { plan: 'month' });
  assert.equal(s.status, 200);
  assert.match(s.json.confirmation_url, /^https:\/\/yoomoney\.ru\//);
  const token = s.json.paid, req1 = lastReq();
  assert.match(token, /^[\w-]{22}$/);
  assert.deepEqual(req1.body.amount, { value: '349.00', currency: 'RUB' });
  assert.equal(req1.body.capture, true);
  assert.equal(req1.body.save_payment_method, true);
  assert.deepEqual(req1.body.confirmation, { type: 'redirect', return_url: 'https://xn--80aa9aonp.xn--p1acf/igra/?paid=' + token });
  assert.equal(req1.body.description, 'Аяты вокруг нас: подписка на месяц');
  assert.deepEqual(req1.body.metadata, { app: 'igra', plan: 'month', account: '', kind: 'first', t: token });
  assert.equal(req1.body.receipt, undefined);
  assert.match(req1.key, /^[0-9a-f-]{36}$/);
  const p1 = [...mock.payments.values()].pop().id;
  ok('pay/start → confirmation_url, поля запроса');

  // ---- 3. до оплаты: статус pending, поддельное уведомление ничего не даёт
  assert.equal((await call('GET', '/igra/api/pay/status?paid=' + token)).json.status, 'pending');
  const forged = await hook('payment.succeeded', p1, { status: 'succeeded', paid: true, metadata: { app: 'igra', plan: 'year', account: '' } });
  assert.equal(forged.status, 200);
  const st0 = await call('GET', '/igra/api/pay/status?paid=' + token);
  assert.equal(st0.json.status, 'pending'); assert.equal(st0.json.code, undefined);
  ok('поддельное тело уведомления не засчитано (перепроверка GET)');

  // ---- 4. оплата + уведомление (дважды — идемпотентно)
  await ctl('/__pay/' + p1);
  const hs = await Promise.all([1, 2, 3, 4, 5].map(() => hook('payment.succeeded', p1)));   // параллельные повторы
  assert.deepEqual(hs.map(h => h.status), [200, 200, 200, 200, 200]);
  const st = await call('GET', '/igra/api/pay/status?paid=' + token);
  assert.equal(st.json.status, 'succeeded');
  assert.match(st.json.code, /^[ACDEFHJKMNPRTUVWXY34679]{4}-[ACDEFHJKMNPRTUVWXY34679]{4}$/);
  const code = st.json.code;
  let a = await acc(code);
  const until1 = +a.paid_until;
  assert.ok(Math.abs(until1 - (Date.now() + 28 * DAY)) < 4 * DAY, 'paid_until ≈ +1 месяц');
  assert.equal(a.autopay, true); assert.ok(a.payment_method_id);
  ok(`hook succeeded ×2 → один аккаунт, код ${code}, до ${new Date(until1).toISOString().slice(0, 10)}`);

  // ---- 5. me: код в любом регистре/раскладке, неверный — 404
  const me = await call('GET', '/igra/api/me?code=' + encodeURIComponent(code.toLowerCase()));
  assert.deepEqual(me.json, { active: true, until: new Date(until1).toISOString(), plan: 'month', autopay: true });
  assert.equal((await call('GET', '/igra/api/me?code=' + code.replace('-', ' '))).status, 200);
  assert.equal((await call('GET', '/igra/api/me?code=XXXX-XXXX')).status, 404);
  assert.equal((await call('GET', '/igra/api/me?code=<script>')).status, 404);
  ok('me → {active, until, plan, autopay}');

  // ---- 6. продление по коду на год: тот же аккаунт, срок прибавляется к оставшемуся
  const s2 = await call('POST', '/igra/api/pay/start', { plan: 'year', code });
  assert.equal(lastReq().body.metadata.account, String(a.id));
  assert.equal(lastReq().body.amount.value, '2490.00');
  assert.equal(lastReq().body.description, 'Аяты вокруг нас: подписка на год');
  const p2 = [...mock.payments.values()].pop().id;
  await ctl('/__pay/' + p2);
  await hook('payment.succeeded', p2);
  a = await acc(code);
  const exp = new Date(until1); exp.setUTCFullYear(exp.getUTCFullYear() + 1);
  assert.equal(+a.paid_until, +exp); assert.equal(a.plan, 'year');
  assert.equal((await call('GET', '/igra/api/pay/status?paid=' + s2.json.paid)).json.code, code);
  ok('pay/start с кодом → тот же аккаунт, +1 год к сроку');

  // ---- 7. отменённый первый платёж
  const s3 = await call('POST', '/igra/api/pay/start', { plan: 'month' });
  const p3 = [...mock.payments.values()].pop().id;
  await ctl('/__cancel/' + p3);
  await hook('payment.canceled', p3);
  const st3 = await call('GET', '/igra/api/pay/status?paid=' + s3.json.paid);
  assert.equal(st3.json.status, 'canceled'); assert.equal(st3.json.code, undefined);
  ok('payment.canceled → статус canceled, кода нет');

  // ---- 8. автопродление (успех)
  const soon = new Date(Date.now() + 12 * H);
  await setAcc(a.id, { paid_until: soon });
  await pay.tick();
  let r = lastReq();
  assert.equal(r.body.payment_method_id, a.payment_method_id);
  assert.equal(r.body.confirmation, undefined); assert.equal(r.body.save_payment_method, undefined);
  assert.equal(r.body.capture, true);
  assert.deepEqual(r.body.amount, { value: '2490.00', currency: 'RUB' });
  assert.equal(r.key, `igra-renew-${a.id}-${+soon}-0`);  // первая попытка: retry_at пуст
  a = await acc(code);
  const exp2 = new Date(soon); exp2.setUTCFullYear(exp2.getUTCFullYear() + 1);
  assert.equal(+a.paid_until, +exp2);
  const n = mock.log.length;
  await pay.tick();
  assert.equal(mock.log.length, n, 'после продления не списываем снова');
  ok('автопродление: payment_method_id без confirmation, ключ на (аккаунт, период), срок +1 год');

  // ---- 9. продление в pending → ждём, не дублируем; потом уведомление
  const soon2 = new Date(Date.now() + 2 * H);
  await setAcc(a.id, { paid_until: soon2, plan: 'month' });
  await ctl('/__autopay', { status: 'pending' });
  await pay.tick();
  const pp = [...mock.payments.values()].pop().id;
  const m2 = mock.log.length;
  await pay.tick();
  assert.equal(mock.log.length, m2, 'pending-продление не дублируется');
  await ctl('/__pay/' + pp);
  await hook('payment.succeeded', pp);
  a = await acc(code);
  assert.equal(+a.paid_until, +(() => { const d = new Date(soon2); d.setUTCMonth(d.getUTCMonth() + 1); return d; })());
  ok('pending-продление не дублируется, проводится по уведомлению');

  // ---- 10. отказ ×3 → autopay=false
  await ctl('/__autopay', { status: 'canceled', reason: 'insufficient_funds' });
  const soon3 = new Date(Date.now() + 5 * H);
  await setAcc(a.id, { paid_until: soon3 });
  let prevRetry = null;
  for (let i = 1; i <= 3; i++) {
    await pay.tick();
    a = await acc(code);
    assert.equal(a.fails, i);
    assert.equal(lastReq().key, `igra-renew-${a.id}-${+soon3}-${prevRetry ? +prevRetry : 0}`);
    assert.ok(+a.retry_at > Date.now() + 23 * H);
    const before = mock.log.length;
    await pay.tick();
    assert.equal(mock.log.length, before, 'до retry_at не повторяем');
    prevRetry = new Date(Date.now() - 1000);
    await setAcc(a.id, { retry_at: prevRetry });   // «прошли сутки»
  }
  assert.equal(a.autopay, false);
  const before = mock.log.length;
  await pay.tick();
  assert.equal(mock.log.length, before, 'после трёх отказов не списываем');
  assert.equal(+a.paid_until, +soon3, 'срок не тронут');
  ok('отказ ×3 (раз в сутки) → autopay=false');

  // ---- 11. autopay on/off
  let on = await call('POST', '/igra/api/autopay/on', { code });
  assert.equal(on.json.autopay, true); a = await acc(code); assert.equal(a.fails, 0); assert.ok(+a.retry_at <= Date.now());
  let off = await call('POST', '/igra/api/autopay/off', { code });
  assert.deepEqual([off.status, off.json.autopay, off.json.active], [200, false, true]);
  assert.equal((await call('GET', '/igra/api/me?code=' + code)).json.autopay, false);
  const b2 = mock.log.length; await pay.tick(); assert.equal(mock.log.length, b2);
  assert.equal((await call('POST', '/igra/api/autopay/off', { code: 'nope' })).status, 404);
  ok('autopay/off → доступ до paid_until, без списаний; autopay/on');

  // ---- 12. 400 от ЮKassa = неудачная попытка; permission_revoked → сразу off и метод стёрт
  await call('POST', '/igra/api/autopay/on', { code });
  await ctl('/__autopay', { status: 'http400' });
  await pay.tick();
  a = await acc(code); assert.equal(a.fails, 1); assert.equal(a.autopay, true);
  await setAcc(a.id, { retry_at: new Date(Date.now() - 1000) });
  await ctl('/__autopay', { status: 'canceled', reason: 'permission_revoked' });
  await pay.tick();
  a = await acc(code); assert.equal(a.autopay, false); assert.equal(a.payment_method_id, null);
  assert.equal((await call('POST', '/igra/api/autopay/on', { code })).status, 409);
  ok('HTTP 400 считается отказом; permission_revoked → autopay off, способ оплаты стёрт');

  // ---- 13. возврат первого платежа (полный) → минус месяц, autopay off; повтор уведомления — без эффекта
  const u0 = new Date(Date.now() + 60 * DAY);
  await setAcc(a.id, { paid_until: u0, autopay: true });
  const rf = await ctl('/__refund/' + p1);
  assert.equal((await hook('refund.succeeded', rf.id)).status, 200);
  assert.equal((await hook('refund.succeeded', rf.id)).status, 200);
  a = await acc(code);
  const exp3 = new Date(u0); exp3.setUTCMonth(exp3.getUTCMonth() - 1);
  assert.equal(+a.paid_until, +exp3, 'снят ровно один месяц, один раз');
  assert.equal(a.autopay, false);
  assert.equal((await call('GET', '/igra/api/pay/status?paid=' + token)).json.status, 'refunded');
  ok('refund.succeeded → период снят, повтор идемпотентен');

  // ---- 14. чужие и несуществующие платежи
  const foreign = await fetch(MOCK + '/v3/payments', { method: 'POST', headers: { Authorization: 'Basic ' + Buffer.from(mock.shopId + ':' + mock.secretKey).toString('base64'), 'Idempotence-Key': 'x1', 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount: { value: '10.00', currency: 'RUB' }, confirmation: { type: 'redirect', return_url: 'https://umra.ru/' }, metadata: { order: '1' } }) }).then(r => r.json());
  await ctl('/__pay/' + foreign.id);
  assert.equal((await hook('payment.succeeded', foreign.id)).status, 200);
  assert.equal((await hook('payment.succeeded', '00000000-000f-5000-8000-000000000000')).status, 200);
  assert.equal((await hook('something.else', p1)).status, 200);
  ok('чужой платёж магазина и неизвестный id — 200 без эффекта');

  // ---- 15. ЮKassa недоступна → hook 502 (ЮKassa повторит), status отдаёт то, что есть
  const s4 = await call('POST', '/igra/api/pay/start', { plan: 'month' });
  const p4 = [...mock.payments.values()].pop().id;
  assert.ok((await pay.store.stale(new Date(Date.now() + 11 * 60000))).some(x => x.id === p4), 'висящий pending попадёт в перепроверку');
  assert.ok(!(await pay.store.stale(new Date())).some(x => x.id === p4), 'свежий pending не трогаем');
  mock.server.close(); mock.server.closeAllConnections();
  assert.equal((await hook('payment.succeeded', p4)).status, 502);
  assert.equal((await call('GET', '/igra/api/pay/status?paid=' + s4.json.paid)).json.status, 'pending');
  ok('ЮKassa недоступна → hook 502 (повтор доставки), status = pending');

  // ---- 16. лимит частоты проверок кода
  let last;
  for (let i = 0; i < 70; i++) last = await call('GET', '/igra/api/me?code=' + code);
  assert.equal(last.status, 429);
  ok('лимит частоты на me');

  await pay.stop(); app.close();
  console.log('ВСЁ ПРОШЛО');
})().catch(e => { console.error('FAIL:', e); process.exit(1); });
