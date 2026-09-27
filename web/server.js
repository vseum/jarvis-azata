// рахмат.рус — трекер «От Фаджра до Витра».
// Без зависимостей: node server.js. Контейнер Timeweb стирается при каждом деплое,
// поэтому отметки дублируются в ветку `data` репозитория (habits/days.json) через GitHub API.

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = +process.env.PORT || 8080;
const KEY = process.env.TRACKER_KEY || '';
const GH_TOKEN = process.env.GITHUB_TOKEN || '';
const GH_REPO = process.env.GITHUB_REPO || 'vseum/jarvis-azata';
const GH_BRANCH = process.env.DATA_BRANCH || 'data';
const GH_PATH = 'habits/days.json';
const LOCAL = path.join(process.env.DATA_DIR || '/tmp', 'days.json');

let days = {};       // 'YYYY-MM-DD' -> { v, score, pct, updatedAt }
let sha = null;      // sha of GH_PATH on GH_BRANCH
let changed = new Set();
let flushTimer = null;
let firstDirtyAt = 0;
let syncing = Promise.resolve();
let lastSync = null, lastError = null;

// ---------- GitHub storage
async function gh(method, url, body) {
  const r = await fetch('https://api.github.com' + url, {
    method,
    headers: {
      Authorization: 'Bearer ' + GH_TOKEN,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'rahmat-tracker',
      ...(body ? { 'Content-Type': 'application/json' } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  let json = null;
  try { json = await r.json(); } catch (e) {}
  return { status: r.status, json };
}

function merge(remote) {
  for (const k in remote) {
    const a = days[k], b = remote[k];
    if (!a || (b.updatedAt || '') > (a.updatedAt || '')) days[k] = b;
  }
}

async function readRemote() {
  const r = await gh('GET', `/repos/${GH_REPO}/contents/${GH_PATH}?ref=${GH_BRANCH}`);
  if (r.status !== 200) return r.status;
  sha = r.json.sha;
  let b64 = r.json.content;
  if (!b64) { // files over 1 MB come without content — read the blob instead
    const blob = await gh('GET', `/repos/${GH_REPO}/git/blobs/${sha}`);
    if (blob.status !== 200) return blob.status;
    b64 = blob.json.content;
  }
  const doc = JSON.parse(Buffer.from(b64, 'base64').toString('utf8'));
  merge(doc.days || {});
  return 200;
}

async function writeRemote(message) {
  const content = JSON.stringify({ updatedAt: new Date().toISOString(), days }, null, 1) + '\n';
  if (!sha) {
    const ref = await gh('GET', `/repos/${GH_REPO}/git/ref/heads/${GH_BRANCH}`);
    if (ref.status === 404) {
      // orphan branch holding only the data file
      const tree = await gh('POST', `/repos/${GH_REPO}/git/trees`, { tree: [{ path: GH_PATH, mode: '100644', type: 'blob', content }] });
      const commit = await gh('POST', `/repos/${GH_REPO}/git/commits`, { message, tree: tree.json && tree.json.sha, parents: [] });
      const made = await gh('POST', `/repos/${GH_REPO}/git/refs`, { ref: 'refs/heads/' + GH_BRANCH, sha: commit.json && commit.json.sha });
      if (made.status !== 201) throw new Error('create branch: HTTP ' + made.status);
      await readRemote();
      return;
    }
  }
  const put = () => gh('PUT', `/repos/${GH_REPO}/contents/${GH_PATH}`, {
    message, branch: GH_BRANCH,
    content: Buffer.from(content).toString('base64'),
    ...(sha ? { sha } : {}),
  });
  let r = await put();
  if (r.status === 409 || r.status === 422) { // someone else wrote the file: merge and retry once
    await readRemote();
    r = await gh('PUT', `/repos/${GH_REPO}/contents/${GH_PATH}`, {
      message, branch: GH_BRANCH,
      content: Buffer.from(JSON.stringify({ updatedAt: new Date().toISOString(), days }, null, 1) + '\n').toString('base64'),
      ...(sha ? { sha } : {}),
    });
  }
  if (r.status !== 200 && r.status !== 201) throw new Error('write: HTTP ' + r.status + ' ' + (r.json && r.json.message));
  sha = r.json.content.sha;
}

function saveLocal() {
  try { fs.writeFileSync(LOCAL, JSON.stringify(days)); } catch (e) {}
}

function scheduleSync() {
  if (!GH_TOKEN) return;
  if (!firstDirtyAt) firstDirtyAt = Date.now();
  clearTimeout(flushTimer);
  // wait for a pause in tapping, but never hold changes longer than a minute
  const wait = Math.max(0, Math.min(15000, firstDirtyAt + 60000 - Date.now()));
  flushTimer = setTimeout(sync, wait);
}

function sync() {
  if (!GH_TOKEN || !changed.size) return syncing;
  const list = [...changed].sort();
  changed = new Set();
  firstDirtyAt = 0;
  const msg = 'habits: ' + list.map(d => `${d} ${days[d] ? days[d].pct : 0}%`).join(', ');
  syncing = syncing.then(() => writeRemote(msg)).then(() => {
    lastSync = new Date().toISOString(); lastError = null;
  }).catch(e => {
    lastError = String(e.message || e);
    console.error('github sync failed:', lastError);
    for (const d of list) changed.add(d);
    scheduleSync();
  });
  return syncing;
}

// ---------- слияние: телефон и Mac не перетирают заметки, цели, дела и прогресс друг друга
const ARR = ['_notes', '_goals', '_tasks', '_fun'];
const byId = a => { const m = new Map(); for (const x of a || []) if (x && x.id) m.set(x.id, x); return m; };
const stamp = x => x.up || x.at || '';
function mergeV(key, old, inc) {
  if (!old) return inc;
  if (key === 'learn' && inc._v && !old._v) return inc;           // старый формат словаря не смешиваем
  const out = Object.assign({}, inc);
  const gone = new Set([...(old._gone || []), ...(inc._gone || [])]);
  if (gone.size) out._gone = [...gone].slice(-500);
  for (const f of ARR) {
    if (!Array.isArray(old[f]) && !Array.isArray(inc[f])) continue;
    const o = byId(old[f]), n = byId(inc[f]), res = [];
    for (const x of inc[f] || []) {
      if (!x || !x.id) { res.push(x); continue; }
      if (gone.has(x.id)) continue;
      const y = o.get(x.id);
      res.push(y && stamp(y) > stamp(x) ? y : x);
    }
    for (const x of old[f] || []) if (x && x.id && !n.has(x.id) && !gone.has(x.id)) res.push(x);
    out[f] = res;
  }
  if (key === 'learn') {
    out._w = Object.assign({}, old._w);
    for (const k in inc._w || {}) { const a = out._w[k], b = inc._w[k]; out._w[k] = !a || (b.ok || 0) + (b.bad || 0) >= (a.ok || 0) + (a.bad || 0) ? b : a; }
    out._done = [...new Set([...(old._done || []), ...(inc._done || [])])];
    for (const f of ['_exams', '_xp']) { out[f] = Object.assign({}, old[f]); for (const k in inc[f] || {}) out[f][k] = Math.max(out[f][k] || 0, inc[f][k]); }
    if (old._v || inc._v) out._v = Math.max(old._v || 0, inc._v || 0);
  }
  return out;
}

// ---------- HTTP
const STATIC = {
  '/': ['index.html', 'text/html; charset=utf-8'],
  '/index.html': ['index.html', 'text/html; charset=utf-8'],
  '/icon.svg': ['icon.svg', 'image/svg+xml'],
  '/apple-touch-icon.png': ['apple-touch-icon.png', 'image/png'],
  '/favicon-32.png': ['favicon-32.png', 'image/png'],
  '/favicon.ico': ['favicon-32.png', 'image/png'],
  '/manifest.webmanifest': ['manifest.webmanifest', 'application/manifest+json; charset=utf-8'],
  '/sw.js': ['sw.js', 'text/javascript; charset=utf-8'],
  '/data.js': ['data.js', 'text/javascript; charset=utf-8'],
};

function send(res, status, body, type) {
  res.writeHead(status, {
    'Content-Type': type || 'application/json; charset=utf-8',
    'Cache-Control': 'no-cache',
    'X-Content-Type-Options': 'nosniff',
  });
  res.end(typeof body === 'string' || Buffer.isBuffer(body) ? body : JSON.stringify(body));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let size = 0; const parts = [];
    req.on('data', c => { size += c.length; if (size > 1048576) { reject(new Error('too large')); req.destroy(); } else parts.push(c); });
    req.on('end', () => resolve(Buffer.concat(parts).toString('utf8')));
    req.on('error', reject);
  });
}

const server = http.createServer((req, res) => {
  handle(req, res).catch(e => {
    console.error('request failed:', e && e.message);
    try { if (!res.headersSent) send(res, 400, { error: 'bad request' }); else res.end(); } catch (x) {}
  });
});

async function handle(req, res) {
  const url = new URL(req.url, 'http://x');
  const p = url.pathname;

  if (p === '/healthz') return send(res, 200, { ok: true });
  if (p === '/robots.txt') return send(res, 200, 'User-agent: *\nDisallow: /\n', 'text/plain; charset=utf-8');

  if (p === '/fonts/quran/KFGQPC-EULA.txt') return send(res, 200, fs.readFileSync(path.join(__dirname, 'fonts', 'quran', 'KFGQPC-EULA.txt')), 'text/plain; charset=utf-8');
  const font = p.match(/^\/fonts\/(montserrat-(?:cyrillic|latin)-\d00-normal\.woff2|quran\/UthmanicHafs1Ver18\.woff2)$/);
  if (font && req.method === 'GET') {
    try {
      const buf = fs.readFileSync(path.join(__dirname, 'fonts', font[1]));
      res.writeHead(200, { 'Content-Type': 'font/woff2', 'Cache-Control': 'public, max-age=31536000, immutable' });
      return res.end(buf);
    } catch (e) { return send(res, 404, 'Not found', 'text/plain; charset=utf-8'); }
  }

  if (STATIC[p] && req.method === 'GET') {
    const [file, type] = STATIC[p];
    return send(res, 200, fs.readFileSync(path.join(__dirname, file)), type);
  }

  if (p.startsWith('/api/')) {
    const given = req.headers['x-key'] || url.searchParams.get('k') || '';
    if (KEY && given !== KEY) return send(res, 401, { error: 'key required' });

    if (p === '/api/days' && req.method === 'GET') return send(res, 200, { days });

    if (p === '/api/status' && req.method === 'GET') {
      return send(res, 200, { days: Object.keys(days).length, github: !!GH_TOKEN, branch: GH_BRANCH, pending: changed.size, lastSync, lastError });
    }

    // day YYYY-MM-DD, week plan YYYY-Www, month plan + notes YYYY-MM, word-learning progress `learn`
    const m = p.match(/^\/api\/days\/(\d{4}-\d{2}-\d{2}|\d{4}-W\d{2}|\d{4}-\d{2}|learn)$/); // + learn: progress in words
    if (m && req.method === 'PUT') {
      let body;
      try { body = JSON.parse(await readBody(req)); } catch (e) { return send(res, 400, { error: 'bad json' }); }
      if (!body || typeof body.v !== 'object' || Array.isArray(body.v)) return send(res, 400, { error: 'v must be an object' });
      const merged = mergeV(m[1], days[m[1]] && days[m[1]].v, body.v);
      days[m[1]] = { v: merged, score: +body.score || 0, pct: +body.pct || 0, updatedAt: new Date().toISOString() };
      changed.add(m[1]);
      saveLocal();
      scheduleSync();
      return send(res, 200, { ok: true, v: merged });
    }
    return send(res, 404, { error: 'not found' });
  }

  send(res, 404, 'Not found', 'text/plain; charset=utf-8');
}
process.on('unhandledRejection', e => console.error('unhandled:', e && e.message));
process.on('uncaughtException', e => console.error('uncaught:', e && e.message));

async function start() {
  try { days = JSON.parse(fs.readFileSync(LOCAL, 'utf8')); } catch (e) {}
  if (GH_TOKEN) {
    try {
      const s = await readRemote();
      console.log(s === 200 ? `loaded ${Object.keys(days).length} days from ${GH_BRANCH}:${GH_PATH}` : `no data yet on ${GH_BRANCH} (HTTP ${s})`);
    } catch (e) { lastError = String(e.message || e); console.error('github load failed:', lastError); }
  } else {
    console.warn('GITHUB_TOKEN not set: data lives only in this container and is lost on redeploy');
  }
  if (!KEY) console.warn('TRACKER_KEY not set: anyone with the address can read and write');
  server.listen(PORT, '0.0.0.0', () => console.log('listening on ' + PORT));
  // при деплое старый контейнер может досохранить последние отметки уже после нашего старта — перечитываем
  if (GH_TOKEN) for (const t of [30000, 120000]) setTimeout(() => { syncing = syncing.then(() => readRemote()).catch(e => console.error('re-read failed:', e.message)); }, t).unref();
}

function shutdown() {
  server.close();
  clearTimeout(flushTimer);
  const done = () => process.exit(0);
  sync().then(done, done);
  setTimeout(done, 8000).unref();
}
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

start();
