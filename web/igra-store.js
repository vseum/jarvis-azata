// Хранилище подписки игры: PostgreSQL (IGRA_DB_URL=postgres://…) или память (IGRA_DB_URL=memory — только для тестов).
// Оба варианта дают один интерфейс:
//   init()                         — создать таблицы
//   tx(async t => …)               — атомарная операция; t: payment, addPayment, setPayment, account, accountByCode,
//                                    createAccount, setAccount, refundedSum (account/payment с lock=true блокируют строку)
//   accountByCode(code), paymentByToken(token), due(now), stale(now), close()
// Персональных данных нет: аккаунт — это код доступа, срок и технический id способа оплаты в ЮKassa.

const ACC_FIELDS = ['plan', 'paid_until', 'autopay', 'payment_method_id', 'fails', 'retry_at'];
const PAY_FIELDS = ['token', 'account_id', 'status'];
const H = 3600000;

const SCHEMA = `
CREATE TABLE IF NOT EXISTS igra_accounts (
  id serial PRIMARY KEY,
  code text NOT NULL UNIQUE,
  plan text,
  paid_until timestamptz,
  autopay boolean NOT NULL DEFAULT false,
  payment_method_id text,
  created_at timestamptz NOT NULL DEFAULT now(),
  fails integer NOT NULL DEFAULT 0,
  retry_at timestamptz
);
CREATE TABLE IF NOT EXISTS igra_payments (
  id text PRIMARY KEY,                      -- id платежа (или возврата) в ЮKassa
  token text UNIQUE,                        -- случайный ключ страницы возврата (?paid=…), только у первых платежей
  account_id integer REFERENCES igra_accounts(id),
  amount numeric(10,2) NOT NULL,
  status text NOT NULL,                     -- pending | succeeded | canceled | refunded | mismatch
  kind text NOT NULL,                       -- first | renew | refund
  plan text,
  ref text,                                 -- для возврата: id исходного платежа
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS igra_payments_pending ON igra_payments (created_at) WHERE status = 'pending';
CREATE INDEX IF NOT EXISTS igra_payments_ref ON igra_payments (ref) WHERE ref IS NOT NULL;
`;

const accRow = r => r && {
  id: r.id, code: r.code, plan: r.plan, paid_until: r.paid_until, autopay: r.autopay,
  payment_method_id: r.payment_method_id, created_at: r.created_at, fails: r.fails, retry_at: r.retry_at,
};
const payRow = r => r && {
  id: r.id, token: r.token, account_id: r.account_id, amount: Number(r.amount), status: r.status,
  kind: r.kind, plan: r.plan, ref: r.ref, created_at: r.created_at,
};

function pgStore(url) {
  const { Pool } = require('pg');
  const pool = new Pool({
    connectionString: url, max: 5, connectionTimeoutMillis: 5000, idleTimeoutMillis: 30000,
    statement_timeout: 10000, query_timeout: 15000,
  });
  pool.on('error', e => console.error('igra db:', e.message));

  const set = (table, allowed, id, f) => {
    const keys = Object.keys(f).filter(k => allowed.includes(k));
    if (!keys.length) return null;
    return [`UPDATE ${table} SET ${keys.map((k, i) => `${k}=$${i + 2}`).join(', ')} WHERE id=$1`, [id, ...keys.map(k => f[k])]];
  };
  const ops = q => ({
    payment: async (id, lock) => payRow((await q(`SELECT * FROM igra_payments WHERE id=$1${lock ? ' FOR UPDATE' : ''}`, [id])).rows[0]),
    addPayment: async p => (await q(
      `INSERT INTO igra_payments (id, token, account_id, amount, status, kind, plan, ref) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) ON CONFLICT (id) DO NOTHING`,
      [p.id, p.token || null, p.account_id || null, p.amount, p.status, p.kind, p.plan || null, p.ref || null])).rowCount === 1,
    setPayment: async (id, f) => { const s = set('igra_payments', PAY_FIELDS, id, f); if (s) await q(...s); },
    account: async (id, lock) => accRow((await q(`SELECT * FROM igra_accounts WHERE id=$1${lock ? ' FOR UPDATE' : ''}`, [id])).rows[0]),
    accountByCode: async code => accRow((await q('SELECT * FROM igra_accounts WHERE code=$1', [code])).rows[0]),
    createAccount: async code => accRow((await q('INSERT INTO igra_accounts (code) VALUES ($1) ON CONFLICT (code) DO NOTHING RETURNING *', [code])).rows[0]),
    setAccount: async (id, f) => { const s = set('igra_accounts', ACC_FIELDS, id, f); if (s) await q(...s); },
    refundedSum: async ref => Number((await q(`SELECT coalesce(sum(amount),0) AS s FROM igra_payments WHERE ref=$1 AND kind='refund'`, [ref])).rows[0].s),
  });
  const base = ops((sql, args) => pool.query(sql, args));

  return {
    kind: 'pg',
    init: () => pool.query(SCHEMA),
    async tx(fn) {
      const c = await pool.connect();
      try {
        await c.query('BEGIN');
        const out = await fn(ops((sql, args) => c.query(sql, args)));
        await c.query('COMMIT');
        return out;
      } catch (e) {
        try { await c.query('ROLLBACK'); } catch (x) {}
        throw e;
      } finally { c.release(); }
    },
    accountByCode: base.accountByCode,
    paymentByToken: async token => payRow((await pool.query('SELECT * FROM igra_payments WHERE token=$1', [token])).rows[0]),
    // кого продлевать: автоплатёж включён, способ оплаты сохранён, срок кончается в ближайшие сутки (или кончился не больше
    // трёх суток назад — окно повторов), очередная попытка уже пора и нет незавершённого платежа-продления за последние сутки
    due: async now => (await pool.query(`
      SELECT a.* FROM igra_accounts a
      WHERE a.autopay AND a.payment_method_id IS NOT NULL AND a.plan IS NOT NULL
        AND a.paid_until <= $1::timestamptz + interval '24 hours' AND a.paid_until > $1::timestamptz - interval '72 hours'
        AND (a.retry_at IS NULL OR a.retry_at <= $1)
        AND NOT EXISTS (SELECT 1 FROM igra_payments p WHERE p.account_id = a.id AND p.kind = 'renew' AND p.status = 'pending'
                        AND p.created_at > $1::timestamptz - interval '24 hours')
      ORDER BY a.paid_until LIMIT 100`, [now])).rows.map(accRow),
    // платежи, которые давно висят в pending (уведомление потерялось) — перепроверить в ЮKassa
    stale: async now => (await pool.query(`
      SELECT * FROM igra_payments WHERE status = 'pending' AND kind IN ('first','renew')
        AND created_at < $1::timestamptz - interval '10 minutes' AND created_at > $1::timestamptz - interval '48 hours'
      ORDER BY created_at LIMIT 50`, [now])).rows.map(payRow),
    close: () => pool.end(),
  };
}

function memoryStore() {
  const accounts = new Map(), payments = new Map();
  let seq = 0, chain = Promise.resolve();
  const copy = x => x && Object.assign({}, x);
  const t = {
    payment: async id => copy(payments.get(id)),
    addPayment: async p => {
      if (payments.has(p.id)) return false;
      if (p.token && [...payments.values()].some(x => x.token === p.token)) throw new Error('duplicate token');
      payments.set(p.id, { id: p.id, token: p.token || null, account_id: p.account_id || null, amount: Number(p.amount), status: p.status,
        kind: p.kind, plan: p.plan || null, ref: p.ref || null, created_at: p.created_at || new Date() });
      return true;
    },
    setPayment: async (id, f) => { const r = payments.get(id); if (r) for (const k of PAY_FIELDS) if (k in f) r[k] = f[k]; },
    account: async id => copy(accounts.get(id)),
    accountByCode: async code => copy([...accounts.values()].find(a => a.code === code)),
    createAccount: async code => {
      if ([...accounts.values()].some(a => a.code === code)) return null;
      const a = { id: ++seq, code, plan: null, paid_until: null, autopay: false, payment_method_id: null, created_at: new Date(), fails: 0, retry_at: null };
      accounts.set(a.id, a);
      return copy(a);
    },
    setAccount: async (id, f) => { const a = accounts.get(id); if (a) for (const k of ACC_FIELDS) if (k in f) a[k] = f[k]; },
    refundedSum: async ref => [...payments.values()].filter(p => p.ref === ref && p.kind === 'refund').reduce((s, p) => s + p.amount, 0),
  };
  return {
    kind: 'memory',
    init: async () => {},
    // транзакции выполняются строго по очереди — этого достаточно для атомарности в одном процессе
    tx(fn) { const run = chain.then(() => fn(t)); chain = run.catch(() => {}); return run; },
    accountByCode: t.accountByCode,
    paymentByToken: async token => copy([...payments.values()].find(p => p.token === token)),
    due: async now => {
      const n = +now;
      return [...accounts.values()].filter(a => a.autopay && a.payment_method_id && a.plan && a.paid_until
        && +a.paid_until <= n + 24 * H && +a.paid_until > n - 72 * H && (!a.retry_at || +a.retry_at <= n)
        && ![...payments.values()].some(p => p.account_id === a.id && p.kind === 'renew' && p.status === 'pending' && +p.created_at > n - 24 * H))
        .sort((x, y) => x.paid_until - y.paid_until).slice(0, 100).map(copy);
    },
    stale: async now => [...payments.values()].filter(p => p.status === 'pending' && (p.kind === 'first' || p.kind === 'renew')
      && +p.created_at < +now - 600000 && +p.created_at > +now - 48 * H).slice(0, 50).map(copy),
    close: async () => {},
    _raw: { accounts, payments },   // для тестов
  };
}

module.exports = url => url === 'memory' ? memoryStore() : pgStore(url);
