// Мок ЮKassa API v3 для локальной проверки подписки игры (web/igra-pay.js). Не для продакшена.
// Запуск отдельно: node tools/yookassa-mock.js [порт]  → YOOKASSA_API=http://127.0.0.1:<порт>/v3
// Умеет: POST /v3/payments (с Idempotence-Key), GET /v3/payments/:id, GET /v3/refunds/:id.
// Управление для тестов: POST /__pay/:id (оплатить, сохранить карту), /__cancel/:id, /__refund/:id,
// POST /__autopay {status:'succeeded'|'canceled'|'pending'|'http400', reason?} — исход следующих автоплатежей.

const http = require('http');
const crypto = require('crypto');

function createMock({ shopId = 'test-shop', secretKey = 'test_secret' } = {}) {
  const payments = new Map(), refunds = new Map(), byKey = new Map();
  const log = [];
  let autopay = { status: 'succeeded' };
  const auth = 'Basic ' + Buffer.from(shopId + ':' + secretKey).toString('base64');
  const id = () => crypto.randomUUID().replace(/^(.{8})-(.{4})-(.{4})/, '$1-000f-5000');

  const server = http.createServer((req, res) => {
    let body = '';
    req.on('data', c => body += c);
    req.on('end', () => {
      const json = (st, obj) => { res.writeHead(st, { 'Content-Type': 'application/json' }); res.end(JSON.stringify(obj)); };
      const u = new URL(req.url, 'http://x'), p = u.pathname;
      let b = null; try { b = body ? JSON.parse(body) : null; } catch (e) { return json(400, { type: 'error', code: 'invalid_request', description: 'bad json' }); }

      // ---- управление
      let m;
      if ((m = p.match(/^\/__(pay|cancel|refund)\/(.+)$/)) && req.method === 'POST') {
        const pay = payments.get(m[2]);
        if (!pay) return json(404, {});
        if (m[1] === 'pay') {
          Object.assign(pay, { status: 'succeeded', paid: true, captured_at: new Date().toISOString() });
          if (pay._save) Object.assign(pay.payment_method, { saved: true, title: 'Bank card *4444', card: { last4: '4444' } });
        } else if (m[1] === 'cancel') {
          Object.assign(pay, { status: 'canceled', paid: false, cancellation_details: { party: 'yoo_money', reason: (b && b.reason) || 'expired_on_confirmation' } });
        } else {
          const r = { id: id(), payment_id: pay.id, status: 'succeeded', amount: Object.assign({}, (b && b.amount) || pay.amount), created_at: new Date().toISOString() };
          refunds.set(r.id, r);
          return json(200, r);
        }
        return json(200, out(pay));
      }
      if (p === '/__autopay' && req.method === 'POST') { autopay = b; return json(200, { ok: true }); }
      if (p === '/__log') return json(200, log);

      // ---- API v3
      if (req.headers.authorization !== auth) return json(401, { type: 'error', code: 'invalid_credentials', description: 'bad auth' });
      if (p === '/v3/payments' && req.method === 'POST') {
        const key = req.headers['idempotence-key'];
        if (!key || key.length > 64) return json(400, { type: 'error', code: 'invalid_request', description: 'Idempotence-Key required' });
        log.push({ key, body: b });
        if (byKey.has(key)) { const c = byKey.get(key); return json(c[0], c[0] === 200 ? out(payments.get(c[1])) : c[1]); }
        if (!b || !b.amount || !/^\d+\.\d{2}$/.test(b.amount.value) || b.amount.currency !== 'RUB') return json(400, { type: 'error', code: 'invalid_request', description: 'amount' });
        if (b.metadata && Object.values(b.metadata).some(v => typeof v !== 'string' || v.length > 512)) return json(400, { type: 'error', code: 'invalid_request', description: 'metadata' });
        const pay = {
          id: id(), status: 'pending', paid: false, amount: b.amount, description: b.description, metadata: b.metadata || {},
          created_at: new Date().toISOString(), test: true, refundable: false, recipient: { account_id: shopId, gateway_id: '1' },
        };
        if (b.payment_method_id) {
          const known = [...payments.values()].find(x => x.payment_method && x.payment_method.id === b.payment_method_id && x.payment_method.saved);
          if (!known) { const e = { type: 'error', code: 'invalid_request', parameter: 'payment_method_id', description: 'not saved' }; byKey.set(key, [400, e]); return json(400, e); }
          if (autopay.status === 'http400') { const e = { type: 'error', code: 'invalid_request', description: 'mock 400' }; byKey.set(key, [400, e]); return json(400, e); }
          pay.payment_method = Object.assign({}, known.payment_method);
          pay.status = autopay.status;
          pay.paid = autopay.status === 'succeeded';
          if (autopay.status === 'canceled') pay.cancellation_details = { party: 'payment_network', reason: autopay.reason || 'insufficient_funds' };
        } else {
          if (!b.confirmation || b.confirmation.type !== 'redirect' || !b.confirmation.return_url) return json(400, { type: 'error', code: 'invalid_request', description: 'confirmation' });
          pay.payment_method = { type: 'bank_card', id: id(), saved: false };
          pay._save = !!b.save_payment_method;
          pay.confirmation = { type: 'redirect', confirmation_url: `https://yoomoney.ru/checkout/payments/v2/contract?orderId=${pay.id}`, return_url: b.confirmation.return_url };
        }
        payments.set(pay.id, pay);
        byKey.set(key, [200, pay.id]);
        return json(200, out(pay));
      }
      if ((m = p.match(/^\/v3\/payments\/([\w-]+)$/)) && req.method === 'GET') {
        const pay = payments.get(m[1]);
        return pay ? json(200, out(pay)) : json(404, { type: 'error', code: 'not_found', description: 'payment not found' });
      }
      if ((m = p.match(/^\/v3\/refunds\/([\w-]+)$/)) && req.method === 'GET') {
        const r = refunds.get(m[1]);
        return r ? json(200, r) : json(404, { type: 'error', code: 'not_found' });
      }
      json(404, { type: 'error', code: 'not_found' });
    });
  });
  const out = pay => { const o = Object.assign({}, pay); delete o._save; return o; };
  return { server, payments, refunds, log, shopId, secretKey };
}

module.exports = createMock;

if (require.main === module) {
  const m = createMock();
  m.server.listen(+process.argv[2] || 8099, '127.0.0.1', () => console.log('yookassa mock on http://127.0.0.1:' + m.server.address().port + '/v3 (shop test-shop / test_secret)'));
}
