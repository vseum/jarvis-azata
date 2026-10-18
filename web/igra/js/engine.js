"use strict";
/* ============ ОСНОВА ИГРЫ: сцена, голос, звуки, подписи, вопросы, аяты, награды ============ */
const $ = s => document.querySelector(s);
const sleep = ms => new Promise(r => setTimeout(r, ms));
const rnd = (a, b) => a + Math.random() * (b - a);
const app = $("#app"), stage = $("#stage"), cap = $("#cap"), capText = $("#capText"), capNote = $("#capNote"), capBtns = $("#capBtns"), fadeEl = $("#fade");
const L = id => (window.LINES[id] || "");

function el(tag, cls, parent, html) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (html) e.innerHTML = html;
  (parent === undefined ? stage : parent)?.appendChild(e);
  return e;
}
function size() { const r = stage.getBoundingClientRect(); return { W: r.width, H: r.height }; }
/* Объект с классом .obj: координаты задают центр, размер в пикселях */
function obj(cls, svg, x, y, w, h, parent) {
  const e = el("div", "obj " + cls, parent, svg);
  e.style.width = w + "px"; e.style.height = (h || w) + "px"; put(e, x, y);
  return e;
}
function put(e, x, y) { e.style.left = x + "px"; e.style.top = y + "px"; e._x = x; e._y = y; }
async function move(e, x, y, ms, easing = "ease-in-out") {
  const a = e.animate([{ left: e._x + "px", top: e._y + "px" }, { left: x + "px", top: y + "px" }], { duration: ms, easing, fill: "forwards" });
  try { await a.finished; } catch (err) {}
  put(e, x, y); a.cancel();
}
function local(ev) { const r = stage.getBoundingClientRect(); return { x: ev.clientX - r.left, y: ev.clientY - r.top }; }
function clearStage() { stage.innerHTML = ""; Snd.amb(null); }
async function toDark() { fadeEl.classList.add("on"); await sleep(480); }
function fromDark() { fadeEl.classList.remove("on"); }

/* ============ ЗВУКИ: всё синтезируется кодом, без музыки и без файлов ============ */
const Snd = {
  ac: null, master: null, bufs: {}, on: true, ambNodes: [], ambTimer: null,
  init() {
    if (this.ac) { if (this.ac.state !== "running") this.ac.resume(); return; }
    const C = window.AudioContext || window.webkitAudioContext; if (!C) return;
    this.ac = new C();
    this.master = this.ac.createGain(); this.master.gain.value = this.on ? 1 : 0;
    const comp = this.ac.createDynamicsCompressor(); comp.threshold.value = -14; comp.ratio.value = 5;
    this.master.connect(comp); comp.connect(this.ac.destination);
    ["white", "pink", "brown"].forEach(k => { this.bufs[k] = this.noiseBuf(k, 3); });
  },
  noiseBuf(kind, sec) {
    const ac = this.ac, n = ac.sampleRate * sec, b = ac.createBuffer(1, n, ac.sampleRate), d = b.getChannelData(0);
    let last = 0, b0 = 0, b1 = 0, b2 = 0;
    for (let i = 0; i < n; i++) {
      const w = Math.random() * 2 - 1;
      if (kind === "brown") { last = (last + 0.02 * w) / 1.02; d[i] = last * 3.5; }
      else if (kind === "pink") { b0 = 0.997 * b0 + w * 0.099; b1 = 0.963 * b1 + w * 0.296; b2 = 0.57 * b2 + w * 1.05; d[i] = (b0 + b1 + b2 + w * 0.18) * 0.2; }
      else d[i] = w * 0.5;
    }
    return b;
  },
  /* короткий отфильтрованный шум: основа почти всех звуков */
  noise({ kind = "white", dur = 0.3, type = "bandpass", f = 900, f2 = 0, q = 1, gain = 0.3, attack = 0.01, at = 0 } = {}) {
    if (!this.ac) return;
    const ac = this.ac, t = ac.currentTime + at;
    const s = ac.createBufferSource(), fl = ac.createBiquadFilter(), g = ac.createGain();
    s.buffer = this.bufs[kind]; s.loop = true;
    fl.type = type; fl.frequency.setValueAtTime(f, t); if (f2) fl.frequency.exponentialRampToValueAtTime(f2, t + dur); fl.Q.value = q;
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(gain, t + attack); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    s.connect(fl); fl.connect(g); g.connect(this.master); s.start(t, Math.random() * 2); s.stop(t + dur + 0.05);
  },
  tone({ type = "sine", f = 600, f2 = 0, dur = 0.15, gain = 0.15, at = 0 } = {}) {
    if (!this.ac) return;
    const ac = this.ac, t = ac.currentTime + at, o = ac.createOscillator(), g = ac.createGain();
    o.type = type; o.frequency.setValueAtTime(f, t); if (f2) o.frequency.exponentialRampToValueAtTime(f2, t + dur);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(gain, t + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(this.master); o.start(t); o.stop(t + dur + 0.05);
  },
  tap() { this.noise({ kind: "brown", type: "lowpass", f: 900, dur: 0.07, gain: 0.25, attack: 0.004 }); },
  whoosh(g = 0.3) { this.noise({ kind: "pink", f: 300, f2: 1800, q: 0.7, dur: 0.6, gain: g, attack: 0.2 }); },
  fall() { this.noise({ kind: "pink", f: 1400, f2: 250, q: 0.7, dur: 1.0, gain: 0.18, attack: 0.2 }); },
  thud(g = 0.6) { this.noise({ kind: "brown", type: "lowpass", f: 180, dur: 0.3, gain: g, attack: 0.006 }); },
  pop() { this.noise({ type: "highpass", f: 1200, dur: 0.12, gain: 0.9, attack: 0.002 }); this.noise({ f: 700, f2: 200, dur: 0.3, gain: 0.3, attack: 0.004, at: 0.02 }); },
  splash() { for (let i = 0; i < 14; i++) this.tone({ f: rnd(500, 1800), f2: rnd(900, 3000), dur: rnd(0.02, 0.06), gain: rnd(0.05, 0.14), at: i * rnd(0.01, 0.04) }); },
  sparkle() { for (let i = 0; i < 7; i++) this.noise({ f: 3000 + i * 600, q: 14, dur: 0.18, gain: 0.08, attack: 0.005, at: i * 0.05 }); },
  chirp(at = 0) { for (let i = 0; i < 3; i++) this.tone({ f: rnd(2600, 3400), f2: rnd(3800, 4600), dur: 0.07, gain: 0.05, at: at + i * 0.11 }); },
  buzz(sec = 1, g = 0.06) {
    if (!this.ac) return;
    const ac = this.ac, t = ac.currentTime, o = ac.createOscillator(), f = ac.createBiquadFilter(), gn = ac.createGain(), l = ac.createOscillator(), lg = ac.createGain();
    o.type = "sawtooth"; o.frequency.value = 210; l.frequency.value = 7; lg.gain.value = 12; l.connect(lg); lg.connect(o.frequency);
    f.type = "bandpass"; f.frequency.value = 900; f.Q.value = 1.2;
    gn.gain.setValueAtTime(0.0001, t); gn.gain.exponentialRampToValueAtTime(g, t + 0.15); gn.gain.setValueAtTime(g, t + sec - 0.2); gn.gain.exponentialRampToValueAtTime(0.0001, t + sec);
    o.connect(f); f.connect(gn); gn.connect(this.master); o.start(t); l.start(t); o.stop(t + sec + 0.05); l.stop(t + sec + 0.05);
  },
  hum(sec = 3) {
    if (!this.ac) return;
    const ac = this.ac, t = ac.currentTime, o = ac.createOscillator(), g = ac.createGain();
    o.type = "triangle"; o.frequency.setValueAtTime(90, t); o.frequency.setValueAtTime(90, t + sec * 0.6); o.frequency.exponentialRampToValueAtTime(30, t + sec);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.12, t + 0.2); g.gain.setValueAtTime(0.12, t + sec * 0.6); g.gain.exponentialRampToValueAtTime(0.0001, t + sec);
    o.connect(g); g.connect(this.master); o.start(t); o.stop(t + sec + 0.05);
    this.noise({ kind: "pink", f: 600, q: 0.6, dur: sec, gain: 0.12, attack: 0.3 });
  },
  /* фон сцены: "wind" ветер, "sea" волны, "meadow" ветерок и птицы; null - тишина */
  amb(kind, level = 1) {
    if (!this.ac) return;
    const ac = this.ac, t = ac.currentTime;
    this.ambNodes.forEach(n => { n.g.gain.setTargetAtTime(0.0001, t, 0.5); setTimeout(() => { try { n.s.stop(); if (n.l) n.l.stop(); } catch (e) {} }, 2500); });
    this.ambNodes = []; clearTimeout(this.ambTimer);
    if (!kind) return;
    const layer = (bk, type, f, q, gain, lfoF, lfoG) => {
      const s = ac.createBufferSource(), fl = ac.createBiquadFilter(), g = ac.createGain();
      s.buffer = this.bufs[bk]; s.loop = true; fl.type = type; fl.frequency.value = f; fl.Q.value = q;
      g.gain.value = 0.0001; g.gain.setTargetAtTime(gain * level, t, 1);
      s.connect(fl); fl.connect(g); g.connect(this.master); s.start(0, Math.random() * 2);
      const node = { s, g };
      if (lfoF) { const l = ac.createOscillator(), lg = ac.createGain(); l.frequency.value = lfoF; lg.gain.value = lfoG * level; l.connect(lg); lg.connect(g.gain); l.start(); node.l = l; }
      this.ambNodes.push(node);
    };
    if (kind === "wind" || kind === "meadow") layer("brown", "lowpass", 400, 0.7, 0.18, 0.07, 0.08);
    if (kind === "sea") { layer("pink", "lowpass", 700, 0.5, 0.16, 0.13, 0.12); layer("brown", "lowpass", 250, 0.7, 0.2, 0.09, 0.1); }
    if (kind === "meadow") { const tw = () => { this.chirp(); this.ambTimer = setTimeout(tw, rnd(2500, 6000)); }; this.ambTimer = setTimeout(tw, 1500); }
  },
  /* сильный порыв ветра */
  gust(sec = 3) { this.noise({ kind: "pink", f: 300, f2: 1100, q: 0.5, dur: sec, gain: 0.35, attack: sec * 0.35 }); },
  setOn(v) { this.on = v; if (this.master) this.master.gain.setTargetAtTime(v ? 1 : 0, this.ac.currentTime, 0.1); }
};
/* iPhone: звук игры должен идти и в беззвучном режиме, а AudioContext "будится" касанием */
let silentEl = null;
function silentWavUrl() {
  const n = 800, buf = new ArrayBuffer(44 + n), v = new DataView(buf), w = (o, s) => [...s].forEach((c, i) => v.setUint8(o + i, c.charCodeAt(0)));
  w(0, "RIFF"); v.setUint32(4, 36 + n, true); w(8, "WAVE"); w(12, "fmt "); v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true);
  v.setUint32(24, 8000, true); v.setUint32(28, 8000, true); v.setUint16(32, 1, true); v.setUint16(34, 8, true); w(36, "data"); v.setUint32(40, n, true);
  for (let i = 0; i < n; i++) v.setUint8(44 + i, 128);
  return URL.createObjectURL(new Blob([buf], { type: "audio/wav" }));
}
function unlockAudio() {
  try { if (navigator.audioSession) navigator.audioSession.type = "playback"; } catch (e) {}
  Snd.init();
  if (!silentEl) { try { silentEl = new Audio(silentWavUrl()); silentEl.loop = true; silentEl.setAttribute("playsinline", ""); silentEl.play().catch(() => { silentEl = null; }); } catch (e) { silentEl = null; } }
  else if (silentEl.paused) silentEl.play().catch(() => {});
}
["pointerup", "touchend", "click", "keydown"].forEach(ev => document.addEventListener(ev, unlockAudio, true));
/* игру свернули (другое приложение, свёрнутый Telegram) — звук и голос на паузу, вернулись — продолжаем */
document.addEventListener("visibilitychange", () => {
  const hid = document.hidden;
  if (Snd.ac) { if (hid) Snd.ac.suspend(); else Snd.ac.resume(); }
  if ("speechSynthesis" in window) { try { hid ? speechSynthesis.pause() : speechSynthesis.resume(); } catch (e) {} }
  if (Voice.qari) { if (hid) Voice.qari.pause(); else Voice.qari.play().catch(() => {}); }
});

/* ============ ГОЛОС: записи из папки voice/, а если их нет - голос телефона ============ */
/* Голоса озвучки: файлы лежат в voice/<id>/ */
const VOICES = [   /* новый голос — строка сюда и папка voice/<id>/; при двух и больше голосах на старте появится выбор */
  { id: "eugene", name: "Евгений", g: "мужской" },
  { id: "azat", name: "Азат", g: "мужской" }
];
const BASE_VOICE = "eugene";   // озвучен полностью: им договариваются реплики, которых у выбранного голоса ещё нет
const Voice = {
  on: true, sp: VOICES[0].id, have: new Set(), base: new Set(), cache: new Map(), cur: null, ru: null, seq: 0, qari: null, ready: null,
  load() { return this.ready || (this.ready = this.init()); },
  async init() {
    let saved = null;
    try { saved = new URLSearchParams(location.search).get("golos") || localStorage.getItem("ayaty_voice"); } catch (e) {}
    if (VOICES.some(v => v.id === saved)) this.sp = saved;
    await this.manifest();
    this.pick(); if ("speechSynthesis" in window) speechSynthesis.onvoiceschanged = () => this.pick();
  },
  async manifest() {
    const sp = this.sp;
    const get = async s => { try { const r = await fetch("voice/" + s + "/manifest.json", { cache: "no-cache" }); if (r.ok) return new Set(await r.json()); } catch (e) {} return new Set(); };
    const [have, base] = await Promise.all([get(sp), sp === BASE_VOICE ? null : get(BASE_VOICE)]);
    if (sp === this.sp) { this.have = have; this.base = base || have; }      // пока грузилось, голос могли сменить
  },
  /* Каким голосом есть файл реплики: выбранным, иначе основным */
  src(id) { return this.have.has(id) ? this.sp : this.base.has(id) ? BASE_VOICE : null; },
  /* Послушать реплику другим голосом, не меняя выбранный */
  async preview(sp, id) {
    this.stop(); const my = this.seq;
    try {
      const b = await this.buffer(sp, id);
      if (my !== this.seq) return;
      this.play(b);
    } catch (e) {}
  },
  async setSpeaker(sp) {
    this.sp = sp; try { localStorage.setItem("ayaty_voice", sp); } catch (e) {}
    Me.load();
    await this.manifest();
  },
  pick() {
    if (!("speechSynthesis" in window)) return;
    const vs = speechSynthesis.getVoices().filter(v => /^ru/i.test(v.lang));
    this.ru = vs.find(v => /milena|милена|yandex|google/i.test(v.name)) || vs[0] || null;
  },
  /* Остановить всё: и то, что звучит, и то, что ещё загружается (жетон seq меняется) */
  stop() {
    this.seq++; cap.classList.remove("talk");
    if (this.qari) { this.qari.onended = null; this.qari.pause(); this.qari = null; }
    if ("speechSynthesis" in window && (speechSynthesis.speaking || speechSynthesis.pending)) speechSynthesis.cancel();
    if (this.cur) { const c = this.cur; this.cur = null; try { c.stop(); } catch (e) {} }
  },
  play(b, onEnd) {
    if (this.cur) { const c = this.cur; this.cur = null; try { c.stop(); } catch (e) {} }
    const s = Snd.ac.createBufferSource(); s.buffer = b; s.connect(Snd.ac.destination);
    s.onended = () => { if (this.cur === s) this.cur = null; onEnd && onEnd(); };
    s.start(); this.cur = s;
  },
  /* Декодированные реплики: держим в памяти только последние 16, иначе на телефоне кончается память */
  async buffer(sp, id) {
    const key = sp + "/" + id;
    if (this.cache.has(key)) { const b = this.cache.get(key); this.cache.delete(key); this.cache.set(key, b); return b; }
    const r = await fetch("voice/" + key + ".mp3"); if (!r.ok) throw new Error("нет файла");
    const b = await Snd.ac.decodeAudioData(await r.arrayBuffer());
    this.cache.set(key, b);
    while (this.cache.size > 16) this.cache.delete(this.cache.keys().next().value);
    return b;
  },
  /* Заранее скачать реплики главы, чтобы голос начинался сразу (браузер сохранит файлы в кэше) */
  prefetch(prefix) {
    Object.keys(window.LINES).filter(k => k.startsWith(prefix) && this.src(k)).forEach(k => { fetch("voice/" + this.src(k) + "/" + k + ".mp3").catch(() => {}); });
  },
  /* Промис завершается, когда реплика договорена. named: сначала позвать ребёнка по имени */
  speak(id, named) {
    return new Promise(res => {
      this.stop(); const my = this.seq;
      let done = false; const fin = () => { if (!done) { done = true; if (my === this.seq) cap.classList.remove("talk"); res(); } };
      if (!this.on) return setTimeout(fin, 500);
      cap.classList.add("talk");
      const nm = named ? Me.clip() : null, from = this.src(id);
      if (from && Snd.ac) {
        Promise.all([nm ? this.buffer(this.sp, "names/" + nm).catch(() => null) : null, this.buffer(from, id)]).then(([nb, b]) => {
          if (my !== this.seq) return fin();      // пока грузилось, реплику уже отменили
          if (!nb) return this.play(b, fin);
          this.play(nb, () => my === this.seq ? setTimeout(() => my === this.seq ? this.play(b, fin) : fin(), 120) : fin());
        }).catch(() => { if (my === this.seq) this.tts(id, fin, my); else fin(); });
        setTimeout(fin, 60000); return;
      }
      this.tts(id, fin, my);
    });
  },
  tts(id, fin, my) {
    const text = L(id).replace(/[؀-ۿﭐ-﷿ﹰ-﻿]+/g, "").replace(/["«»]/g, "").replace(/\s-\s/g, ", ").trim();
    if (!text || !("speechSynthesis" in window)) return setTimeout(fin, 900);
    if (!this.ru) this.pick();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "ru-RU"; if (this.ru) u.voice = this.ru; u.rate = 0.92;
    u.onend = fin; u.onerror = fin;
    setTimeout(fin, 2500 + text.length * 90);
    setTimeout(() => { if (my === this.seq) speechSynthesis.speak(u); else fin(); }, 50);
  }
};

/* ============ ИМЯ РЕБЁНКА ============ */
/* Главный герой — сам ребёнок: игра зовёт его по имени. Имена озвучены заранее:
   voice/<голос>/names.json — [["Амина", "n0001"], …], файлы voice/<голос>/names/<id>.mp3 */
const normName = s => s.trim().toLowerCase().replace(/ё/g, "е").replace(/\s+/g, " ");
const Me = {
  list: null, idx: new Map(),
  get name() { return Save.d.name || ""; },
  /* Подсказки — из полного списка основного голоса; звучат имена только голосом, который выбран
     (у нового голоса имён может быть меньше — тогда имя только в подписи, голоса не смешиваются) */
  voiced: new Map(), vsp: null,
  load() {
    const get = s => fetch("voice/" + s + "/names.json").then(r => r.ok ? r.json() : null).catch(() => null);
    if (this.vsp !== Voice.sp) {
      this.vsp = Voice.sp; const sp = Voice.sp;
      this.voicedReady = get(sp).then(a => { if (this.vsp === sp) this.voiced = new Map((a || []).map(([n, id]) => [normName(n), id])); });
    }
    return this.list || (this.list = get(BASE_VOICE).then(a => a || []).then(a => { this.idx = new Map(a.map(([n, id]) => [normName(n), id])); return a; }));
  },
  clip(n = this.name) { return n ? this.voiced.get(normName(n)) || null : null; },   // имя озвучено выбранным голосом?
  known(n) { return !!n && this.idx.has(normName(n)); },
  /* Подсказки при вводе: имена, которые начинаются с набранного */
  async suggest(q, max = 6) {
    q = normName(q); if (!q) return [];
    const a = await this.load(), out = [];
    for (const [n] of a) { if (normName(n).startsWith(q)) { out.push(n); if (out.length >= max) break; } }
    return out;
  },
  async set(n) {
    Save.d.name = n; Save.save(); await this.load();
    /* имени нет среди озвученных — сообщаем серверу, его озвучат в следующий раз (передаётся только имя) */
    if (n && !this.known(n)) fetch("api/name", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: n }) }).catch(() => {});
  },
  /* Произнести одно имя (ребёнок слышит, что игра его узнала) */
  async hello(n) {
    const id = this.clip(n); if (!id || !Voice.on || !Snd.ac) return;
    Voice.stop(); const my = Voice.seq;
    try { const b = await Voice.buffer(Voice.sp, "names/" + id); if (my === Voice.seq) Voice.play(b); } catch (e) {}
  }
};
/* Обращение в начале реплики: «Амина! » */
const callName = named => named && Me.name ? Me.name + "! " : "";

/* ============ ПОДПИСИ И КНОПКИ ============ */
/* Реплика в подписи: её можно переслушать кнопкой — для детей, которые ещё не читают */
let capLine = null;
function replayCap() {
  if (!capLine || cap.classList.contains("hidden")) return;
  unlockAudio(); const p = Voice.speak(capLine.id, capLine.named);
  if (autoNext.rearm) autoNext.rearm(p);
}
/* Ребёнок не нажал «Дальше»: через 3 с после конца реплики игра идёт дальше сама — на кнопке заполняется полоска.
   Повтор реплики начинает отсчёт заново; пока открыто окно (пауза и т.п.) — ждём. Без звука даём время прочитать */
const AUTO_MS = 3000;
function autoNext(b, p, text) {
  let t = null, gen = 0, live = true;
  const arm = async g => {
    if (!live || g !== gen) return;
    if (!Voice.on || !Snd.ac) { await sleep(Math.min(9000, 1200 + text.length * 60)); if (!live || g !== gen) return; }
    b.classList.remove("auto"); void b.offsetWidth; b.classList.add("auto");
    const fire = () => { if (!live || g !== gen) return; if (document.querySelector(".sheet")) { b.classList.remove("auto"); t = setTimeout(() => arm(g), 800); return; } b.click(); };
    t = setTimeout(fire, AUTO_MS);
  };
  const stop = () => { clearTimeout(t); b.classList.remove("auto"); };
  p.then(() => arm(gen));
  autoNext.rearm = pp => { gen++; stop(); const g = gen; pp.then(() => arm(g)); };
  b.addEventListener("click", () => { live = false; stop(); autoNext.rearm = null; }, { once: true });
}
function showCap(id, note, named) {
  capLine = { id, named };
  cap.classList.remove("hidden");
  capText.textContent = callName(named) + L(id); capText.classList.remove("pop"); void capText.offsetWidth; capText.classList.add("pop");
  capNote.textContent = note || ""; capBtns.innerHTML = "";
}
function hideCap() { cap.classList.add("hidden"); Voice.stop(); }
function button(label, cls = "btn", parent = capBtns) { return el("button", cls, parent, label); }
function clicked(b) { return new Promise(r => { b.onclick = () => { Snd.tap(); r(); }; }); }
/* Сказать реплику и дождаться кнопки. Кнопка начинает светиться, когда голос замолк */
async function say(id, opt = {}) {
  showCap(id, opt.note, opt.named);
  const p = Voice.speak(id, opt.named);
  await sleep(500);
  const b = button(opt.btn || "Дальше");
  p.then(() => b.classList.add("glow"));
  autoNext(b, p, L(id));
  await clicked(b);
  Voice.stop(); capBtns.innerHTML = "";
}
/* Показать задание и не ждать: ребёнок в это время действует на сцене */
function cue(id) { showCap(id); return Voice.speak(id); }

/* Вопрос с вариантами. Варианты зачитываются по очереди и подсвечиваются.
   opts: [{ id, icon, ok }]. Возвращает число ошибок. */
function choice(qid, opts, okId) {
  return new Promise(async res => {
    showCap(qid);
    let picked = false, misses = 0, pending = null;
    const btns = opts.map(o => {
      const ic = o.ar ? "الله" : `<svg viewBox="0 0 48 48" aria-hidden="true">${o.icon || ""}</svg>`;
      const b = button(`<span class="oi${o.ar ? " ar" : ""}">${ic}</span><span>${L(o.id).replace(/\.$/, "")}</span>`, "opt");
      b.onclick = async () => {
        if (b.disabled || picked) return;
        btns.forEach(x => x.classList.remove("reading"));
        if (o.ok) {
          picked = true;
          Snd.tap(); celebrate(); b.classList.add("yes"); b.disabled = true;
          btns.forEach(x => { x.onclick = null; if (x !== b) x.remove(); });
          capNote.textContent = callName(true) + L(okId); capLine = { id: okId, named: true };
          const p = Voice.speak(okId, true); await sleep(500);
          const nb = button("Дальше"); p.then(() => nb.classList.add("glow")); autoNext(nb, p, L(okId)); await clicked(nb);
          Voice.stop(); capBtns.innerHTML = ""; capNote.textContent = ""; res(misses);
        } else {
          misses++; Snd.thud(0.3); b.classList.add("no"); b.disabled = true;
          const nid = window.LINES[o.id + "_no"] ? o.id + "_no" : "wrong";
          capNote.textContent = L(nid); capLine = { id: nid }; pending = Voice.speak(nid);
        }
      };
      return b;
    });
    await Voice.speak(qid);
    for (let i = 0; i < btns.length && !picked; i++) {
      while (pending) { const p = pending; await p; if (pending === p) pending = null; }
      if (picked) break;
      if (btns[i].disabled) continue;
      btns[i].classList.add("reading"); await Voice.speak(opts[i].id); btns[i].classList.remove("reading");
    }
  });
}

/* ============ КАРТОЧКА АЯТА ============ */
const STAR8 = '<path d="M20 2l5 8 9-2-2 9 8 5-8 5 2 9-9-2-5 8-5-8-9 2 2-9-8-5 8-5-2-9 9 2z" fill="none" stroke="#E6A93A" stroke-width="1.6"/><circle cx="20" cy="20" r="4" fill="#E6A93A"/>';
const STAR = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.5l2.8 6 6.5.7-4.9 4.4 1.4 6.4L12 16.7 6.2 20l1.4-6.4L2.7 9.2l6.5-.7z" fill="#F5C451" stroke="#B9802A" stroke-width="1.2" stroke-linejoin="round"/></svg>';
const STAR_OFF = STAR.replace('fill="#F5C451" stroke="#B9802A"', 'fill="#E9DFC8" stroke="#CDBF9F"');
const AR_DIGITS = n => String(n).replace(/\d/g, d => "٠١٢٣٤٥٦٧٨٩"[d]);
/* Карточка аята для ребёнка, который ещё не читает: сначала чтец читает по-арабски (звучащий аят подсвечен золотом),
   потом голос читает перевод (подсвечен бирюзой). Кнопки — значки тех же цветов: книга = чтец, облачко «Аа» = перевод */
const ICO_QARI = '<svg viewBox="0 0 28 28" aria-hidden="true"><path d="M14 8.2C11 6.3 7.4 5.8 3.5 6.6v14.2c3.9-.8 7.5-.3 10.5 1.6 3-1.9 6.6-2.4 10.5-1.6V6.6c-3.9-.8-7.5-.3-10.5 1.6z" fill="#fff"/><path d="M14 8.2v14.2" stroke="#B9802A" stroke-width="1.6"/><path d="M6.5 11h4.5M6.5 14h4.5M17 11h4.5M17 14h4.5" stroke="#E2B65A" stroke-width="1.4" stroke-linecap="round"/></svg>';
const ICO_TR = '<svg viewBox="0 0 28 28" aria-hidden="true"><path d="M5 4.5h18a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3h-9.5l-6 4.5v-4.5H5a3 3 0 0 1-3-3v-10a3 3 0 0 1 3-3z" fill="#fff"/><text x="14" y="17.2" text-anchor="middle" font-family="Nunito, sans-serif" font-weight="900" font-size="10.5" fill="#1F6F80">Аа</text></svg>';
const ICO_NEXT = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13M13 6l6 6-6 6" stroke="currentColor" stroke-width="2.8" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>';
function ayahCard(key) {
  return new Promise(res => {
    hideCap();
    const a = window.AYAT[key];
    const firstNum = +key.split(":")[1].split("-")[0];
    const ar = a.parts.map((p, i) => `<span class="ap">${p.ar} <span class="num">﴿${AR_DIGITS(firstNum + i)}﴾</span></span>`).join(" ");
    const ov = el("div", "ayah", app,
      `<div class="acard">${["tl", "tr", "bl", "br"].map(c => `<svg class="star8 ${c}" viewBox="0 0 40 40" aria-hidden="true">${STAR8}</svg>`).join("")}<p class="ref">${a.ref}</p><div class="abody"><p class="ar" dir="rtl" lang="ar">${ar}</p>` +
      `<p class="tr"></p><p class="src">Перевод смыслов: Эльмир Кулиев · чтец Мишари аль-Афаси</p></div>` +
      `<div class="abtns"><button class="ibtn qari" data-a="qari" aria-label="Послушать чтеца">${ICO_QARI}<small>Чтец</small></button>` +
      `<button class="ibtn trn" data-a="tr" aria-label="Послушать перевод">${ICO_TR}<small>Перевод</small></button>` +
      `<button class="btn next" data-a="next">Дальше ${ICO_NEXT}</button></div></div>`);
    const trP = ov.querySelector("p.tr"), aps = [...ov.querySelectorAll(".ap")], bQ = ov.querySelector(".qari"), bT = ov.querySelector(".trn"), bN = ov.querySelector(".next");
    trP.textContent = L(a.tr);
    /* длинный аят: арабский мельче, текст прокручивается внутри карточки, кнопки всегда на экране */
    const arLen = a.parts.reduce((n, p) => n + p.ar.length, 0);
    if (arLen > 260) ov.classList.add(arLen > 520 ? "xlong" : "long");
    const body = ov.querySelector(".abody");
    const fade = () => body.classList.toggle("more", body.scrollTop + body.clientHeight < body.scrollHeight - 4);
    body.addEventListener("scroll", fade, { passive: true }); requestAnimationFrame(fade);
    requestAnimationFrame(() => requestAnimationFrame(() => ov.classList.add("on")));
    Snd.sparkle();
    let closed = false;
    /* что сейчас звучит: подсветка текста и кнопки */
    const mark = (what, i) => {
      aps.forEach((e, k) => e.classList.toggle("on", what === "ar" && k === i)); trP.classList.toggle("on", what === "tr");
      bQ.classList.toggle("play", what === "ar"); bT.classList.toggle("play", what === "tr");
      const e = what === "ar" ? aps[i] : what === "tr" ? trP : null;
      if (e) { const r = e.getBoundingClientRect(), br = body.getBoundingClientRect(); if (r.top < br.top || r.bottom > br.bottom) body.scrollTo({ top: body.scrollTop + r.top - br.top - 8, behavior: "smooth" }); }
    };
    const qariBuf = i => Voice.buffer("qari", a.parts[i].n);
    a.parts.forEach((_, i) => qariBuf(i).catch(() => {}));   // скачиваем заранее, чтобы аяты шли без пауз
    const run = async what => {
      Voice.stop(); const my = Voice.seq, live = () => my === Voice.seq && !closed;
      if (what !== "tr") {
        for (let i = 0; i < a.parts.length; i++) {
          let b; try { b = await qariBuf(i); } catch (e) { break; }
          if (!live()) return;
          mark("ar", i); await new Promise(r => Voice.play(b, r));
          if (!live()) return;
        }
        mark(null);
        if (what === "qari") return;
        await sleep(450); if (!live()) return;
      }
      mark("tr"); const s0 = Voice.seq; await Voice.speak(a.tr);
      if (Voice.seq !== s0 + 1 || closed) return;
      mark(null); bN.classList.add("glow");
    };
    ov.querySelectorAll("button").forEach(b => b.onclick = () => {
      if (closed) return;
      Snd.tap(); const act = b.dataset.a;
      if (act === "qari") run("qari");
      else if (act === "tr") run("tr");
      else { closed = true; ov.style.pointerEvents = "none"; Voice.stop(); mark(null); ov.classList.remove("on"); setTimeout(() => ov.remove(), 400); res(); }
    });
    if (Voice.on && Snd.ac) setTimeout(() => { if (!closed) run("all"); }, 700); else bN.classList.add("glow");
  });
}

/* ============ ЗАСТАВКА ГЛАВЫ ============ */
/* Текущая глава (id): по ней заставка сама считает «Уровень N · Глава M» */
let CUR = null;
function chapterPlace(id = CUR) {
  const wi = WORLDS.findIndex(w => w.ch.includes(id));
  return wi < 0 ? "" : `Уровень ${wi + 1} · Глава ${WORLDS[wi].ch.indexOf(id) + 1}`;
}
/* Заставка главы. Первый параметр оставлен для совместимости и не используется */
async function chapterTitle(_, name, lineId) {
  hideCap();
  const t = el("div", "chtitle", app, `<div><small>${chapterPlace()}</small><b>${name}</b><svg class="orn" viewBox="0 0 120 16" aria-hidden="true"><path d="M0 8h44M76 8h44" stroke="#F5C451" stroke-width="1.5"/><path d="M60 1l4 7-4 7-4-7z" fill="#F5C451"/><circle cx="50" cy="8" r="2" fill="#F5C451"/><circle cx="70" cy="8" r="2" fill="#F5C451"/></svg></div>`);
  requestAnimationFrame(() => requestAnimationFrame(() => t.classList.add("on")));
  Snd.sparkle();
  await Promise.all([Voice.speak(lineId), sleep(2200)]);
  t.classList.remove("on"); await sleep(600); t.remove();
}

/* Стили главы прямо из её файла (чтобы миры не правили общий style.css) */
function addCSS(text) { const st = document.createElement("style"); st.textContent = text; document.head.appendChild(st); }

/* ============ ВЗАИМОДЕЙСТВИЯ ============ */
/* Ждём n нажатий на элемент. Если ребёнок не нажимает, через timeout игра идёт дальше сама */
function taps(e, n, onTap, timeout = 15000) {
  return new Promise(r => {
    let k = 0, fin = false; e.classList.add("hint", "tapme");
    const end = () => { if (fin) return; fin = true; e.classList.remove("hint", "tapme"); e.removeEventListener("pointerdown", h); r(k); };
    const h = ev => { ev.preventDefault(); k++; e.classList.remove("wob"); void e.offsetWidth; e.classList.add("wob"); onTap && onTap(k, ev); if (k >= n) setTimeout(end, 300); };
    e.addEventListener("pointerdown", h);
    if (timeout) setTimeout(end, timeout);
  });
}
const tapOnce = (e, onTap, timeout) => taps(e, 1, onTap, timeout);

/* ============ ПРАЗДНИК, НАГРАДЫ, СОХРАНЕНИЕ ============ */
function celebrate() {
  const { W, H } = size(); Snd.sparkle();
  for (let i = 0; i < 26; i++) {
    const s = el("i", "spark", app); s.style.left = W / 2 + "px"; s.style.top = H * 0.45 + "px";
    s.style.background = ["#FFD54F", "#FF8A65", "#FFFFFF", "#6BBF59"][i % 4];
    const a = Math.random() * Math.PI * 2, d = rnd(0.15, 0.4) * Math.min(W, H);
    s.animate([{ transform: "translate(-50%,-50%) scale(1)", opacity: 1 }, { transform: `translate(calc(-50% + ${Math.cos(a) * d}px), calc(-50% + ${Math.sin(a) * d}px)) scale(.3)`, opacity: 0 }],
      { duration: rnd(700, 1200), easing: "cubic-bezier(.2,.8,.3,1)" }).onfinish = () => s.remove();
  }
}
async function toast(html, ms = 2200) {
  const t = el("div", "toast", app, html);
  requestAnimationFrame(() => requestAnimationFrame(() => t.classList.add("on")));
  await sleep(ms); t.classList.remove("on"); await sleep(350); t.remove();
}
const Save = {
  key: "ayaty_vokrug_nas_v1",
  d: { done: {}, items: [] },
  load() { try { const x = JSON.parse(localStorage.getItem(this.key) || "null"); if (x) this.d = Object.assign(this.d, x); } catch (e) {} },
  save() { try { localStorage.setItem(this.key, JSON.stringify(this.d)); } catch (e) {} },
  reset() { this.d = { done: {}, items: [], name: this.d.name }; this.save(); }
};
function updateBag(bump) {
  $("#bagN").textContent = Save.d.items.length;
  if (bump) { const b = $("#tBag"); b.classList.remove("bump"); void b.offsetWidth; b.classList.add("bump"); }
}
async function award(itemId) {
  const it = ITEMS.find(i => i.id === itemId);
  if (!Save.d.items.includes(itemId)) { Save.d.items.push(itemId); Save.save(); }
  celebrate(); updateBag(true);
  await toast(`<svg class="item" viewBox="0 0 100 100" aria-hidden="true">${it.svg}</svg><b>${it.name}</b><i>Новое сокровище в сумке</i>`, 2400);
}
async function starsToast(n) {
  if (n === 3) celebrate(); else Snd.sparkle();
  await toast(`<b>Глава пройдена!</b><div class="st">${STAR.repeat(n)}${STAR_OFF.repeat(3 - n)}</div>${n < 3 ? "<i>Сыграй ещё раз, чтобы собрать три звезды</i>" : ""}`, n < 3 ? 2800 : 2300);
}

/* ============ ЛИСТЫ: главы и сокровища ============ */
function sheet(html) {
  const ov = el("div", "sheet", app, `<div class="sheet-in">${html}</div>`);
  requestAnimationFrame(() => requestAnimationFrame(() => ov.classList.add("on")));
  ov.close = () => { ov.classList.remove("on"); setTimeout(() => ov.remove(), 300); };
  /* Крестик сверху, закреплён при прокрутке, и нажатие на тёмный фон — закрыть.
     Ребёнок не станет искать «Закрыть» в самом низу длинного списка */
  ov.withX = fn => {
    const w = el("div", "sxwrap"); ov.firstChild.prepend(w);
    const x = el("button", "sx", w, '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2.8" stroke-linecap="round"/></svg>');
    x.setAttribute("aria-label", "Закрыть");
    const go = () => { Snd.tap(); fn(); };
    x.onclick = go; ov.addEventListener("click", e => { if (e.target === ov) go(); });
    return ov;
  };
  return ov;
}
function chaptersSheet() {
  return new Promise(res => {
    const next = CHAPTERS.find(c => !Save.d.done[c.id]);   // следующая непройденная — подсвечена
    const html = WORLDS.map((w, wi) => {
      const ready = w.ch.filter(c => CHAPTERS.some(x => x.id === c)), done = ready.filter(c => Save.d.done[c]).length;
      return `<div class="world"><div class="whead"><span class="wnum">${wi + 1}</span><div><b>${w.t}</b><small>${w.s}</small>` +
        `${ready.length ? `<div class="wbar"><i style="width:${Math.round(done / w.ch.length * 100)}%"></i></div>` : ""}</div></div><div class="chlist">` +
        w.ch.map(c => {
          const ch = CHAPTERS.find(x => x.id === c);
          if (!ch) return `<div class="ch soon"><span class="ci">${LOCK}</span><span>${c}<span class="stars">скоро</span></span></div>`;
          const st = Save.d.done[c] || 0, nx = next && next.id === c, lk = !Pay.canPlay(c);
          return `<button class="ch${nx ? " next" : ""}${lk ? " lock" : ""}" data-id="${c}"><span class="ci"><svg viewBox="0 0 48 48" aria-hidden="true">${ch.icon}</svg></span><span>${ch.name.replace(/^(Аль|Ан|Ас|Ад)-(\S+)/, '<span class="nw">$1-$2</span>')}<span class="stars">${st ? "★".repeat(st) + "☆".repeat(3 - st) : lk ? "полная версия" : nx ? "дальше ▶" : "играть"}</span>${lk ? `<i class="chlock">${LOCK}</i>` : ""}</span></button>`;
        }).join("") + `</div></div>`;
    }).join("");
    const ov = sheet(`<h2>Главы</h2>${html}`).withX(() => { ov.close(); res(null); });
    const nb = ov.querySelector(".ch.next"); if (nb) setTimeout(() => nb.scrollIntoView({ block: "center", behavior: "smooth" }), 350);
    ov.querySelectorAll("button.ch").forEach(b => b.onclick = () => { Snd.tap(); ov.close(); res(CHAPTERS.findIndex(c => c.id === b.dataset.id)); });
  });
}
const LOCK = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2.5" fill="#B7C6CC"/><path d="M8 11V8a4 4 0 0 1 8 0v3" fill="none" stroke="#B7C6CC" stroke-width="2.2"/></svg>';
/* Пауза во время главы: главное действие — «Играть дальше» (выделено), остальное спокойнее */
const PICO = {
  go: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l10.5-6.5z" fill="currentColor"/></svg>',
  again: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12a7 7 0 1 0 2.1-5" stroke="currentColor" stroke-width="2.4" fill="none" stroke-linecap="round"/><path d="M6.5 3.5V7.4h3.9" stroke="currentColor" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  list: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="4" width="7" height="7" rx="2" fill="currentColor"/><rect x="13.5" y="4" width="7" height="7" rx="2" fill="currentColor"/><rect x="3.5" y="13" width="7" height="7" rx="2" fill="currentColor"/><rect x="13.5" y="13" width="7" height="7" rx="2" fill="currentColor"/></svg>',
  home: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3.5 11.2L12 4l8.5 7.2" stroke="currentColor" stroke-width="2.3" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M6 10v9.2h4.2v-5.4h3.6v5.4H18V10" fill="currentColor"/></svg>'
};
function pauseSheet() {
  return new Promise(res => {
    Voice.stop();
    const row = (a, t, cls = "") => `<button class="pbtn ${cls}" data-a="${a}"><span class="pi">${PICO[a]}</span><span>${t}</span></button>`;
    const ov = sheet(`<h2>Пауза</h2><p class="small psub">${chapterPlace()}</p><div class="pmenu">${row("go", "Играть дальше", "main")}${row("again", "Начать главу заново")}${row("list", "Все главы")}${row("home", "На главную")}</div>`);
    ov.classList.add("psheet");
    ov.querySelectorAll(".pbtn").forEach(b => b.onclick = () => { Snd.tap(); ov.close(); res(b.dataset.a); });
    ov.withX(() => { ov.close(); res("go"); });   // закрыли паузу — играем дальше
  });
}
/* Выбор голоса: каждый можно послушать */
function voiceSheet() {
  return new Promise(res => {
    const rows = VOICES.map(v => `<div class="vrow${v.id === Voice.sp ? " on" : ""}" data-id="${v.id}"><button class="vplay" aria-label="Послушать">▶</button>` +
      `<span><b>${v.name}</b><small>${v.g} голос</small></span><button class="btn vpick">${v.id === Voice.sp ? "Выбран" : "Выбрать"}</button></div>`).join("");
    const ov = sheet(`<h2>Голос</h2><div class="vlist">${rows}</div><p class="small">Нажми ▶, чтобы послушать</p>`).withX(() => { Voice.stop(); ov.close(); res(); });
    ov.querySelectorAll(".vrow").forEach(r => {
      const id = r.dataset.id;
      r.querySelector(".vplay").onclick = () => { Snd.tap(); unlockAudio(); Voice.preview(id, "intro1"); };
      r.querySelector(".vpick").onclick = async () => {
        Snd.tap(); Voice.stop(); await Voice.setSpeaker(id);
        ov.querySelectorAll(".vrow").forEach(x => { const on = x.dataset.id === id; x.classList.toggle("on", on); x.querySelector(".vpick").textContent = on ? "Выбран" : "Выбрать"; });
      };
    });
  });
}
/* Как тебя зовут? Пока ребёнок печатает, подсказываем озвученные имена — нажал, и игра произносит имя */
function nameSheet() {
  return new Promise(res => {
    const ov = sheet(`<h2>Как тебя зовут?</h2><p class="small nmhint">Игра будет звать тебя по имени</p>
      <input id="nmIn" class="nmin" maxlength="24" autocomplete="off" autocorrect="off" spellcheck="false" autocapitalize="words" enterkeyhint="done" placeholder="Имя">
      <div class="nmsug"></div>
      <div class="row"><button class="btn" id="nmOk">Готово</button></div>
      <div class="row"><button class="btn line" id="nmSkip">Без имени</button></div>`);
    ov.classList.add("nmsheet");
    const inp = ov.querySelector("#nmIn"), sug = ov.querySelector(".nmsug");
    const tidy = v => v.replace(/[^A-Za-zА-Яа-яЁё\s'-]/g, "").replace(/\s+/g, " ").trim().slice(0, 24)
      .split(/([\s-])/).map(w => w && /\S/.test(w) && w !== "-" ? w[0].toUpperCase() + w.slice(1).toLowerCase() : w).join("");
    let ask = 0;
    const update = async () => {
      const my = ++ask, list = await Me.suggest(inp.value);
      if (my !== ask) return;
      const cur = normName(inp.value);
      sug.innerHTML = list.map(n => `<button class="nmchip${normName(n) === cur ? " on" : ""}">${n}</button>`).join("");
      sug.querySelectorAll(".nmchip").forEach(b => b.onclick = () => { Snd.tap(); unlockAudio(); inp.value = b.textContent; Me.hello(b.textContent); update(); });
    };
    inp.value = Me.name; inp.oninput = update; update();
    inp.onblur = () => { const t = tidy(inp.value); if (t !== inp.value) { inp.value = t; update(); } };
    const done = async name => { inp.blur(); ov.close(); await Me.set(name); res(name); };
    ov.querySelector("#nmOk").onclick = () => {
      const n = tidy(inp.value);
      if (!n) { Snd.thud(0.25); inp.classList.remove("shake"); void inp.offsetWidth; inp.classList.add("shake"); inp.focus(); return; }
      Snd.tap(); unlockAudio(); Me.hello(n); done(n);
    };
    inp.onkeydown = e => { if (e.key === "Enter") ov.querySelector("#nmOk").click(); };
    ov.querySelector("#nmSkip").onclick = () => { Snd.tap(); done(""); };
    setTimeout(() => inp.focus(), 350);
  });
}
function voiceName() { return (VOICES.find(v => v.id === Voice.sp) || VOICES[0]).name; }
function bagSheet() {
  const html = ITEMS.map(i => `<div class="${Save.d.items.includes(i.id) ? "" : "lk"}"><svg viewBox="0 0 100 100" aria-hidden="true">${i.svg}</svg>${i.name}</div>`).join("");
  const ov = sheet(`<h2>Мои сокровища</h2><div class="bag">${html}</div><p class="small">Сокровища даются за пройденные главы</p>`).withX(() => ov.close());
}

/* ============ TELEGRAM ============ */
const TG = window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.initData ? window.Telegram.WebApp : null;
if (TG) {
  try { TG.ready(); TG.expand(); } catch (e) {}
  try { TG.disableVerticalSwipes(); } catch (e) {}
  try { TG.setHeaderColor("#143F4E"); TG.setBackgroundColor("#143F4E"); } catch (e) {}
}
