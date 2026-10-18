// Мок Робокассы для локальной проверки подписки игры (web/igra-pay.js). Не для продакшена.
// Формулы — по docs.robokassa.ru (OpenAPI robokassa.yaml):
//   оплата  Merchant/Index.aspx  SignatureValue = H(MerchantLogin:OutSum:InvId[:Receipt]:Пароль#1[:Shp_*])
//   ResultURL                    SignatureValue = H(OutSum:InvId:Пароль#2[:Shp_*])  → магазин отвечает OK<InvId>
//   Merchant/Recurring (POST)    SignatureValue = H(MerchantLogin:OutSum:InvoiceID[:Receipt]:Пароль#1[:Shp_*]), PreviousInvoiceID не входит → OK<InvoiceID>
//   OpStateExt                   Signature      = H(MerchantLogin:InvoiceID:Пароль#2)  → XML, State.Code 5/10/50/60/80/100
// Управление: POST /__pay/:inv {callback?:false} (оплачено + ResultURL), /__fail/:inv, /__result/:inv {badSig?},
//   /__recurring {mode:'ok'|'fail'|'pending'|'error500'}, /__flush (отправить отложенные ResultURL продлений), GET /__log.

const http = require('http');
const crypto = require('crypto');

function createRobokassaMock({ login = 'igra-test', pass1 = 'pass_one', pass2 = 'pass_two', alg = 'md5', resultUrl = '' } = {}) {
  const inv = new Map(), log = [], queue = [];
  let recurringMode = 'ok';
  const H = s => crypto.createHash(alg).update(s, 'utf8').digest('hex').toUpperCase();
  const shpTail = p => [...p.keys()].filter(k => k.startsWith('Shp_')).sort().map(k => `:${k}=${p.get(k)}`).join('');
  const shpObj = p => Object.fromEntries([...p].filter(([k]) => k.startsWith('Shp_')));

  async function callback(n, badSig) {
    const o = inv.get(n);
    const out = o.outSum.toFixed(6);                       // боевой формат суммы — шесть знаков
    const body = new URLSearchParams({ OutSum: out, InvId: String(n), Fee: '10.470000', EMail: 'parent@example.com', PaymentMethod: 'BankCard', IncCurrLabel: 'BankCardPSR' });
    for (const [k, v] of Object.entries(o.shp)) body.set(k, v);
    let sig = H(`${out}:${n}:${pass2}` + shpTail(new URLSearchParams(o.shp)));
    if (badSig) sig = sig.slice(0, -1) + (sig.endsWith('0') ? '1' : '0');
    body.set('SignatureValue', sig);
    const r = await fetch(mock.resultUrl, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body });
    return { status: r.status, text: await r.text() };
  }

  const server = http.createServer((req, res) => {
    let raw = '';
    req.on('data', c => raw += c);
    req.on('end', async () => {
      const u = new URL(req.url, 'http://x'), p = u.pathname;
      const reply = (st, body, type = 'text/plain; charset=utf-8') => { res.writeHead(st, { 'Content-Type': type }); res.end(typeof body === 'string' ? body : JSON.stringify(body)); };
      try {
        let m;
        // ---------- управление
        if ((m = p.match(/^\/__(pay|fail|result)\/(\d+)$/)) && req.method === 'POST') {
          const n = +m[2], o = inv.get(n), b = raw ? JSON.parse(raw) : {};
          if (!o) return reply(404, 'no invoice');
          if (m[1] === 'fail') { o.state = 10; return reply(200, { ok: true }, 'application/json'); }
          if (m[1] === 'pay') { o.state = 100; if (b.callback === false) return reply(200, { ok: true }, 'application/json'); }
          return reply(200, await callback(n, b.badSig), 'application/json');
        }
        if (p === '/__recurring' && req.method === 'POST') { recurringMode = JSON.parse(raw).mode; return reply(200, { ok: true }, 'application/json'); }
        if (p === '/__flush' && req.method === 'POST') { const out = []; while (queue.length) out.push(await callback(queue.shift())); return reply(200, out, 'application/json'); }
        if (p === '/__log') return reply(200, log, 'application/json');

        // ---------- платёжная страница
        if (p === '/Merchant/Index.aspx') {
          const q = req.method === 'POST' ? new URLSearchParams(raw) : u.searchParams;
          const n = +q.get('InvId'), out = q.get('OutSum'), rc = q.get('Receipt');
          log.push({ op: 'index', params: Object.fromEntries(q) });
          const sig = H([q.get('MerchantLogin'), out, q.get('InvId'), ...(rc ? [rc] : []), pass1].join(':') + shpTail(q));
          const bad = q.get('MerchantLogin') !== login ? 'login' : !/^\d+(\.\d{1,2})?$/.test(out || '') ? 'OutSum' : !(n >= 1) ? 'InvId'
            : (q.get('Description') || '').length > 100 ? 'Description' : sig !== String(q.get('SignatureValue')).toUpperCase() ? 'signature' : inv.has(n) && inv.get(n).state === 100 ? 'InvId used' : null;
          if (bad) return reply(200, `<html><script>RoboxContext.error.code=29 /* ${bad} */</script></html>`, 'text/html; charset=utf-8');
          if (!inv.has(n)) inv.set(n, { inv: n, outSum: Number(out), shp: shpObj(q), receipt: rc, recurring: q.get('Recurring') === 'true', state: null });
          return reply(200, '<html>Оплата заказа (мок)</html>', 'text/html; charset=utf-8');
        }

        // ---------- повторное списание
        if (p === '/Merchant/Recurring' && req.method === 'POST') {
          const q = new URLSearchParams(raw), n = +q.get('InvoiceID'), parent = inv.get(+q.get('PreviousInvoiceID')), rc = q.get('Receipt');
          log.push({ op: 'recurring', params: Object.fromEntries(q) });
          const sig = H([q.get('MerchantLogin'), q.get('OutSum'), q.get('InvoiceID'), ...(rc ? [rc] : []), pass1].join(':') + shpTail(q));
          const bad = q.get('MerchantLogin') !== login ? 'login' : !(n >= 1) || inv.has(n) ? 'InvoiceID' : !parent || parent.state !== 100 || !parent.recurring ? 'PreviousInvoiceID'
            : ['IncCurrLabel', 'ExpirationDate', 'Recurring'].some(k => q.has(k)) ? 'forbidden param' : sig !== String(q.get('SignatureValue')).toUpperCase() ? 'signature' : null;
          if (bad || recurringMode === 'error500') return reply(500, { title: 'Internal error', status: 500, detail: 'Recurring: ' + (bad || 'Internal ERROR occurred') }, 'application/problem+json');
          inv.set(n, { inv: n, outSum: Number(q.get('OutSum')), shp: shpObj(q), receipt: rc, recurring: false, parent: parent.inv,
            state: recurringMode === 'ok' ? 100 : recurringMode === 'fail' ? 10 : 5 });
          if (recurringMode === 'ok') queue.push(n);
          return reply(200, 'OK' + n);
        }

        // ---------- состояние счёта
        if (p === '/Merchant/WebService/Service.asmx/OpStateExt') {
          const q = u.searchParams, n = +q.get('InvoiceID'), o = inv.get(n);
          log.push({ op: 'state', params: Object.fromEntries(q) });
          const xml = s => reply(200, `<?xml version="1.0" encoding="utf-8"?><OperationStateResponse xmlns="http://merchant.roboxchange.com/WebService/">${s}</OperationStateResponse>`, 'text/xml; charset=utf-8');
          if (q.get('MerchantLogin') !== login || H(`${login}:${q.get('InvoiceID')}:${pass2}`) !== String(q.get('Signature')).toUpperCase()) return xml('<Result><Code>1</Code><Description>Неверная подпись</Description></Result>');
          if (!o || o.state === null) return xml('<Result><Code>3</Code><Description>Не удалось найти операцию</Description></Result>');
          return xml(`<Result><Code>0</Code></Result><State><Code>${o.state}</Code><RequestDate>2026-10-18T10:00:00+03:00</RequestDate><StateDate>2026-10-18T09:59:00+03:00</StateDate></State><Info><IncCurrLabel>BankCardPSR</IncCurrLabel><IncSum>${o.outSum.toFixed(6)}</IncSum><OutCurrLabel>BankCardPSR</OutCurrLabel><OutSum>${o.outSum.toFixed(6)}</OutSum></Info>`);
        }
        reply(404, 'not found');
      } catch (e) { reply(500, String(e.message)); }
    });
  });
  const mock = { server, inv, log, login, pass1, pass2, alg, resultUrl };
  return mock;
}

module.exports = createRobokassaMock;
