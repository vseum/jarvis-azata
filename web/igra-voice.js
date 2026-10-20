// Живая озвучка из суфлёра: запись попадает в игру сразу, без деплоя.
// Суфлёр присылает запись → она ложится в ветку data (igra/rec/<id>.<ext>, это делает server.js) → здесь
// ffmpeg делает mp3 → igra/voice/<голос>/<id>.mp3 в той же ветке + копия на диске контейнера.
// Голос: реплики игр — «azat», арабские звуки (id ar_…) — «ar» (живая запись заменяет синтез).
// Игра берёт voice/azat/manifest.json и mp3 отсюда; чего нет — договаривает основной голос из образа.
const fs = require('fs');
const os = require('os');
const path = require('path');
const crypto = require('crypto');
const { execFile } = require('child_process');

module.exports = function igraVoice({ gh, GH_REPO, GH_BRANCH, GH_TOKEN }) {
  const CACHE = path.join(os.tmpdir(), 'igra-voice');
  const have = { azat: new Set(), ar: new Set() };   // id, у которых есть mp3 в ветке data
  const recs = new Map();                            // id → расширение записи в igra/rec
  const shas = new Map();                            // путь в ветке data → sha (для перезаписи)
  let ready = false;
  const spOf = id => (id.startsWith('ar_') ? 'ar' : 'azat');

  async function raw(fp) {
    const r = await fetch(`https://api.github.com/repos/${GH_REPO}/contents/${fp}?ref=${GH_BRANCH}`, {
      headers: { Authorization: 'Bearer ' + GH_TOKEN, Accept: 'application/vnd.github.raw', 'X-GitHub-Api-Version': '2022-11-28', 'User-Agent': 'rahmat-tracker' },
    });
    if (!r.ok) throw new Error('HTTP ' + r.status + ' ' + fp);
    return Buffer.from(await r.arrayBuffer());
  }

  // wav из суфлёра уже обработан (фильтр, компрессор, обрезка); старые m4a/webm — чистим здесь.
  // loudnorm для всех — чтобы громкость совпадала с основным голосом (-16 LUFS).
  function toMp3(buf, ext) {
    return new Promise((ok, no) => {
      const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'rec-')), inp = path.join(dir, 'in.' + ext), out = path.join(dir, 'out.mp3');
      fs.writeFileSync(inp, buf);
      const trim = 'silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.15';
      const af = (ext === 'wav' ? [] : ['highpass=f=80', trim, 'areverse', trim, 'areverse']).concat('loudnorm=I=-16:TP=-1.5:LRA=11').join(',');
      execFile('ffmpeg', ['-v', 'error', '-y', '-i', inp, '-af', af, '-ar', '44100', '-ac', '1', '-b:a', '64k', out], { timeout: 60000 }, err => {
        let res = null; try { if (!err) res = fs.readFileSync(out); } catch (e) {}
        fs.rmSync(dir, { recursive: true, force: true });
        err || !res ? no(err || new Error('ffmpeg: пусто')) : ok(res);
      });
    });
  }

  const cacheFile = (sp, id) => path.join(CACHE, sp, id + '.mp3');
  function keep(sp, id, mp3) { fs.mkdirSync(path.join(CACHE, sp), { recursive: true }); fs.writeFileSync(cacheFile(sp, id), mp3); }

  // запись → mp3 → ветка data. Вызывать из очереди записи в ветку (параллельные коммиты конфликтуют)
  async function publish(id, ext, buf) {
    recs.set(id, ext);
    const sp = spOf(id), fp = `igra/voice/${sp}/${id}.mp3`;
    const mp3 = await toMp3(buf, ext);
    keep(sp, id, mp3); have[sp].add(id);                                  // в игре — уже сейчас
    let sha = shas.get(fp);
    if (!sha) { const cur = await gh('GET', `/repos/${GH_REPO}/contents/${fp}?ref=${GH_BRANCH}`); if (cur.status === 200) sha = cur.json.sha; }
    const put = await gh('PUT', `/repos/${GH_REPO}/contents/${fp}`, { message: 'озвучка: ' + id, branch: GH_BRANCH, content: mp3.toString('base64'), ...(sha ? { sha } : {}) });
    if (put.status === 200 || put.status === 201) shas.set(fp, put.json.content.sha);
    else console.error('voice put', id, put.status);
  }

  // при старте: что уже есть в ветке data; записи без mp3 (до этой версии или если контейнер упал) — доделываем
  async function init(queue) {
    if (!GH_TOKEN) return;
    try {
      const t = await gh('GET', `/repos/${GH_REPO}/git/trees/${GH_BRANCH}?recursive=1`);
      if (t.status !== 200) { console.error('voice tree', t.status); return; }
      for (const f of t.json.tree) {
        let m = f.path.match(/^igra\/rec\/([\w-]+)\.(\w+)$/);
        if (m) recs.set(m[1], m[2]);
        m = f.path.match(/^igra\/voice\/(azat|ar)\/([\w-]+)\.mp3$/);
        if (m) { have[m[1]].add(m[2]); shas.set(f.path, f.sha); }
      }
      ready = true;
      const todo = [...recs].filter(([id]) => !have[spOf(id)].has(id));
      console.log(`voice: ${have.azat.size} azat, ${have.ar.size} ar, записей ${recs.size}, доделать ${todo.length}`);
      for (const [id, ext] of todo) queue(async () => { try { await publish(id, ext, await raw(`igra/rec/${id}.${ext}`)); } catch (e) { console.error('voice backfill', id, e.message); } });
    } catch (e) { console.error('voice init:', e.message); }
  }

  // GET /igra/voice/azat/manifest.json и /igra/voice/(azat|ar)/<id>.mp3. false — пусть отдаёт статика образа
  async function serve(req, res, p) {
    if (req.method !== 'GET') return false;
    if (p === '/igra/voice/azat/manifest.json' && ready) {
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-cache' });
      res.end(JSON.stringify([...have.azat].sort()));
      return true;
    }
    const m = p.match(/^\/igra\/voice\/(azat|ar)\/([\w-]+)\.mp3$/);
    if (!m || !have[m[1]].has(m[2])) return false;
    let buf = null;
    try { buf = fs.readFileSync(cacheFile(m[1], m[2])); }
    catch (e) { try { buf = await raw(`igra/voice/${m[1]}/${m[2]}.mp3`); keep(m[1], m[2], buf); } catch (e2) { return false; } }
    const etag = '"' + crypto.createHash('sha1').update(buf).digest('base64url').slice(0, 20) + '"';   // перезаписал — игра получит новую
    const head = { 'Content-Type': 'audio/mpeg', 'Cache-Control': 'no-cache', ETag: etag };
    if (req.headers['if-none-match'] === etag) { res.writeHead(304, head); res.end(); return true; }
    res.writeHead(200, head); res.end(buf);
    return true;
  }

  return { init, publish, serve, recorded: () => (ready ? [...recs.keys()] : null) };
};
