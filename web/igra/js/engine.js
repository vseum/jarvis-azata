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
    this.ambNodes.forEach(n => { n.g.gain.setTargetAtTime(0.0001, t, 0.5); setTimeout(() => { try { n.s.stop(); } catch (e) {} }, 2500); });
    this.ambNodes = []; clearTimeout(this.ambTimer);
    if (!kind) return;
    const layer = (bk, type, f, q, gain, lfoF, lfoG) => {
      const s = ac.createBufferSource(), fl = ac.createBiquadFilter(), g = ac.createGain();
      s.buffer = this.bufs[bk]; s.loop = true; fl.type = type; fl.frequency.value = f; fl.Q.value = q;
      g.gain.value = 0.0001; g.gain.setTargetAtTime(gain * level, t, 1);
      s.connect(fl); fl.connect(g); g.connect(this.master); s.start(0, Math.random() * 2);
      if (lfoF) { const l = ac.createOscillator(), lg = ac.createGain(); l.frequency.value = lfoF; lg.gain.value = lfoG * level; l.connect(lg); lg.connect(g.gain); l.start(); }
      this.ambNodes.push({ s, g });
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
}
["pointerup", "touchend", "click", "keydown"].forEach(ev => document.addEventListener(ev, unlockAudio, true));
document.addEventListener("visibilitychange", () => { if (Snd.ac && !document.hidden) Snd.ac.resume(); });

/* ============ ГОЛОС: записи из папки voice/, а если их нет - голос телефона ============ */
/* Голоса озвучки: файлы лежат в voice/<id>/ */
const VOICES = [
  { id: "xenia", name: "Ксения", g: "женский" },
  { id: "baya", name: "Бая", g: "женский" },
  { id: "kseniya", name: "Ксюша", g: "женский" },
  { id: "aidar", name: "Айдар", g: "мужской" },
  { id: "eugene", name: "Евгений", g: "мужской" }
];
const Voice = {
  on: true, sp: "xenia", have: new Set(), cache: {}, cur: null, ru: null,
  async load() {
    let saved = null;
    try { saved = new URLSearchParams(location.search).get("golos") || localStorage.getItem("ayaty_voice"); } catch (e) {}
    if (VOICES.some(v => v.id === saved)) this.sp = saved;
    await this.manifest();
    this.pick(); if ("speechSynthesis" in window) speechSynthesis.onvoiceschanged = () => this.pick();
  },
  async manifest() {
    this.have = new Set();
    try { const r = await fetch("voice/" + this.sp + "/manifest.json", { cache: "no-cache" }); if (r.ok) this.have = new Set(await r.json()); } catch (e) {}
  },
  /* Послушать реплику другим голосом, не меняя выбранный */
  async preview(sp, id) {
    this.stop();
    try {
      const r = await fetch("voice/" + sp + "/" + id + ".mp3"); if (!r.ok) return;
      const b = await Snd.ac.decodeAudioData(await r.arrayBuffer());
      this.stop(); const s = Snd.ac.createBufferSource(); s.buffer = b; s.connect(Snd.ac.destination); s.start(); this.cur = s;
    } catch (e) {}
  },
  async setSpeaker(sp) {
    this.sp = sp; try { localStorage.setItem("ayaty_voice", sp); } catch (e) {}
    await this.manifest();
  },
  pick() {
    if (!("speechSynthesis" in window)) return;
    const vs = speechSynthesis.getVoices().filter(v => /^ru/i.test(v.lang));
    this.ru = vs.find(v => /milena|милена|yandex|google/i.test(v.name)) || vs[0] || null;
  },
  stop() {
    if ("speechSynthesis" in window && (speechSynthesis.speaking || speechSynthesis.pending)) speechSynthesis.cancel();
    if (this.cur) { try { this.cur.stop(); } catch (e) {} this.cur = null; }
  },
  async file(id) {
    const key = this.sp + "/" + id;
    if (!this.cache[key]) { const r = await fetch("voice/" + key + ".mp3"); if (!r.ok) throw new Error("нет файла"); this.cache[key] = await Snd.ac.decodeAudioData(await r.arrayBuffer()); }
    return this.cache[key];
  },
  /* Промис завершается, когда реплика договорена */
  speak(id) {
    return new Promise(res => {
      let done = false; const fin = () => { if (!done) { done = true; cap.classList.remove("talk"); res(); } };
      this.stop();
      if (this.on) cap.classList.add("talk");
      if (!this.on) return setTimeout(fin, 500);
      if (this.have.has(id) && Snd.ac) {
        this.file(id).then(b => {
          const s = Snd.ac.createBufferSource(); s.buffer = b; s.connect(Snd.ac.destination); s.onended = fin; s.start(); this.cur = s;
        }).catch(() => this.tts(id, fin));
        setTimeout(fin, 60000); return;
      }
      this.tts(id, fin);
    });
  },
  tts(id, fin) {
    const text = L(id).replace(/[؀-ۿﭐ-﷿ﹰ-﻿]+/g, "").replace(/["«»]/g, "").replace(/\s-\s/g, ", ").trim();
    if (!text || !("speechSynthesis" in window)) return setTimeout(fin, 900);
    if (!this.ru) this.pick();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "ru-RU"; if (this.ru) u.voice = this.ru; u.rate = 0.92;
    u.onend = fin; u.onerror = fin;
    setTimeout(fin, 2500 + text.length * 90);
    setTimeout(() => speechSynthesis.speak(u), 50);
  }
};

/* ============ ПОДПИСИ И КНОПКИ ============ */
function showCap(id, note) {
  cap.classList.remove("hidden");
  capText.textContent = L(id); capText.classList.remove("pop"); void capText.offsetWidth; capText.classList.add("pop");
  capNote.textContent = note || ""; capBtns.innerHTML = "";
}
function hideCap() { cap.classList.add("hidden"); Voice.stop(); }
function button(label, cls = "btn", parent = capBtns) { return el("button", cls, parent, label); }
function clicked(b) { return new Promise(r => { b.onclick = () => { Snd.tap(); r(); }; }); }
/* Сказать реплику и дождаться кнопки. Кнопка начинает светиться, когда голос замолк */
async function say(id, opt = {}) {
  showCap(id, opt.note);
  const p = Voice.speak(id);
  await sleep(500);
  const b = button(opt.btn || "Дальше");
  p.then(() => b.classList.add("glow"));
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
    let picked = false, misses = 0;
    const btns = opts.map(o => {
      const ic = o.ar ? "الله" : `<svg viewBox="0 0 48 48" aria-hidden="true">${o.icon || ""}</svg>`;
      const b = button(`<span class="oi${o.ar ? " ar" : ""}">${ic}</span><span>${L(o.id).replace(/\.$/, "")}</span>`, "opt");
      b.onclick = async () => {
        picked = true; btns.forEach(x => x.classList.remove("reading"));
        if (o.ok) {
          Snd.tap(); celebrate(); b.classList.add("yes"); b.disabled = true;
          btns.forEach(x => { x.onclick = null; if (x !== b) x.remove(); });
          capNote.textContent = L(okId);
          const p = Voice.speak(okId); await sleep(500);
          const nb = button("Дальше"); p.then(() => nb.classList.add("glow")); await clicked(nb);
          Voice.stop(); capBtns.innerHTML = ""; capNote.textContent = ""; res(misses);
        } else {
          misses++; Snd.thud(0.3); b.classList.add("no"); b.disabled = true;
          const nid = window.LINES[o.id + "_no"] ? o.id + "_no" : "wrong";
          capNote.textContent = L(nid); Voice.speak(nid);
        }
      };
      return b;
    });
    await Voice.speak(qid);
    for (let i = 0; i < btns.length && !picked; i++) {
      btns[i].classList.add("reading"); await Voice.speak(opts[i].id); btns[i].classList.remove("reading");
    }
  });
}

/* ============ КАРТОЧКА АЯТА ============ */
const STAR8 = '<path d="M20 2l5 8 9-2-2 9 8 5-8 5 2 9-9-2-5 8-5-8-9 2 2-9-8-5 8-5-2-9 9 2z" fill="none" stroke="#E6A93A" stroke-width="1.6"/><circle cx="20" cy="20" r="4" fill="#E6A93A"/>';
const STAR = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.5l2.8 6 6.5.7-4.9 4.4 1.4 6.4L12 16.7 6.2 20l1.4-6.4L2.7 9.2l6.5-.7z" fill="#F5C451" stroke="#B9802A" stroke-width="1.2" stroke-linejoin="round"/></svg>';
const STAR_OFF = STAR.replace('fill="#F5C451" stroke="#B9802A"', 'fill="#E9DFC8" stroke="#CDBF9F"');
const AR_DIGITS = n => String(n).replace(/\d/g, d => "٠١٢٣٤٥٦٧٨٩"[d]);
function ayahCard(key) {
  return new Promise(res => {
    hideCap();
    const a = window.AYAT[key];
    const firstNum = +key.split(":")[1].split("-")[0];
    const ar = a.parts.map((p, i) => `${p.ar} <span class="num">﴿${AR_DIGITS(firstNum + i)}﴾</span>`).join(" ");
    const ov = el("div", "ayah", app,
      `<div class="acard">${["tl", "tr", "bl", "br"].map(c => `<svg class="star8 ${c}" viewBox="0 0 40 40" aria-hidden="true">${STAR8}</svg>`).join("")}<p class="lbl">Аят из Корана</p><p class="ref">${a.ref}</p><p class="ar" dir="rtl" lang="ar">${ar}</p>` +
      `<p class="tr"></p><p class="src">Перевод смыслов: Эльмир Кулиев</p>` +
      `<div class="abtns"><button class="btn teal" data-a="qari">▶ Чтец</button><button class="btn teal" data-a="tr">▶ Перевод</button><button class="btn" data-a="next">Дальше</button></div></div>`);
    ov.querySelector(".tr").textContent = L(a.tr);
    requestAnimationFrame(() => requestAnimationFrame(() => ov.classList.add("on")));
    Snd.sparkle();
    let qari = null;
    const stopAll = () => { Voice.stop(); if (qari) { qari.pause(); qari = null; } };
    const playQari = (i = 0) => {
      if (i >= a.parts.length) { qari = null; return; }
      qari = new Audio("https://cdn.islamic.network/quran/audio/128/ar.alafasy/" + a.parts[i].n + ".mp3");
      qari.onended = () => playQari(i + 1); qari.play().catch(() => {});
    };
    ov.querySelectorAll("button").forEach(b => b.onclick = () => {
      Snd.tap(); const act = b.dataset.a;
      if (act === "qari") { stopAll(); playQari(0); }
      else if (act === "tr") { stopAll(); Voice.speak(a.tr); }
      else { stopAll(); ov.classList.remove("on"); setTimeout(() => ov.remove(), 400); res(); }
    });
  });
}

/* ============ ЗАСТАВКА ГЛАВЫ ============ */
async function chapterTitle(num, name, lineId) {
  hideCap();
  const t = el("div", "chtitle", app, `<div><small>Глава ${num}</small><b>${name}</b><svg class="orn" viewBox="0 0 120 16" aria-hidden="true"><path d="M0 8h44M76 8h44" stroke="#F5C451" stroke-width="1.5"/><path d="M60 1l4 7-4 7-4-7z" fill="#F5C451"/><circle cx="50" cy="8" r="2" fill="#F5C451"/><circle cx="70" cy="8" r="2" fill="#F5C451"/></svg></div>`);
  requestAnimationFrame(() => requestAnimationFrame(() => t.classList.add("on")));
  Snd.sparkle();
  await Promise.all([Voice.speak(lineId), sleep(2200)]);
  t.classList.remove("on"); await sleep(600); t.remove();
}

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
  reset() { this.d = { done: {}, items: [] }; this.save(); }
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
  return ov;
}
function chaptersSheet() {
  return new Promise(res => {
    const html = WORLDS.map((w, wi) => {
      const ready = w.ch.filter(c => CHAPTERS.some(x => x.id === c)), done = ready.filter(c => Save.d.done[c]).length;
      return `<div class="world"><div class="whead"><span class="wnum">${wi + 1}</span><div><b>${w.t}</b><small>${w.s}</small>` +
        `${ready.length ? `<div class="wbar"><i style="width:${Math.round(done / w.ch.length * 100)}%"></i></div>` : ""}</div></div><div class="chlist">` +
        w.ch.map(c => {
          const ch = CHAPTERS.find(x => x.id === c);
          if (!ch) return `<div class="ch soon"><span class="ci">${LOCK}</span><span>${c}<span class="stars">скоро</span></span></div>`;
          const st = Save.d.done[c] || 0;
          return `<button class="ch" data-id="${c}"><span class="ci"><svg viewBox="0 0 48 48" aria-hidden="true">${ch.icon}</svg></span><span>${ch.name}<span class="stars">${st ? "★".repeat(st) + "☆".repeat(3 - st) : "играть"}</span></span></button>`;
        }).join("") + `</div></div>`;
    }).join("");
    const ov = sheet(`<h2>Главы</h2>${html}<div class="row"><button class="btn line" id="shClose">Закрыть</button></div>`);
    ov.querySelectorAll("button.ch").forEach(b => b.onclick = () => { Snd.tap(); ov.close(); res(CHAPTERS.findIndex(c => c.id === b.dataset.id)); });
    ov.querySelector("#shClose").onclick = () => { Snd.tap(); ov.close(); res(null); };
  });
}
const LOCK = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2.5" fill="#B7C6CC"/><path d="M8 11V8a4 4 0 0 1 8 0v3" fill="none" stroke="#B7C6CC" stroke-width="2.2"/></svg>';
/* Выбор голоса: каждый можно послушать */
function voiceSheet() {
  return new Promise(res => {
    const rows = VOICES.map(v => `<div class="vrow${v.id === Voice.sp ? " on" : ""}" data-id="${v.id}"><button class="vplay" aria-label="Послушать">▶</button>` +
      `<span><b>${v.name}</b><small>${v.g} голос</small></span><button class="btn vpick">${v.id === Voice.sp ? "Выбран" : "Выбрать"}</button></div>`).join("");
    const ov = sheet(`<h2>Голос</h2><div class="vlist">${rows}</div><p class="small">Нажми ▶, чтобы послушать</p><div class="row"><button class="btn line" id="vClose">Готово</button></div>`);
    ov.querySelectorAll(".vrow").forEach(r => {
      const id = r.dataset.id;
      r.querySelector(".vplay").onclick = () => { Snd.tap(); unlockAudio(); Voice.preview(id, "intro1"); };
      r.querySelector(".vpick").onclick = async () => {
        Snd.tap(); Voice.stop(); await Voice.setSpeaker(id);
        ov.querySelectorAll(".vrow").forEach(x => { const on = x.dataset.id === id; x.classList.toggle("on", on); x.querySelector(".vpick").textContent = on ? "Выбран" : "Выбрать"; });
      };
    });
    ov.querySelector("#vClose").onclick = () => { Snd.tap(); Voice.stop(); ov.close(); res(); };
  });
}
function voiceName() { return (VOICES.find(v => v.id === Voice.sp) || VOICES[0]).name; }
function bagSheet() {
  const html = ITEMS.map(i => `<div class="${Save.d.items.includes(i.id) ? "" : "lk"}"><svg viewBox="0 0 100 100" aria-hidden="true">${i.svg}</svg>${i.name}</div>`).join("");
  const ov = sheet(`<h2>Мои сокровища</h2><div class="bag">${html}</div><p class="small">Сокровища даются за пройденные главы</p><div class="row"><button class="btn line">Закрыть</button></div>`);
  ov.querySelector("button").onclick = () => { Snd.tap(); ov.close(); };
}

/* ============ TELEGRAM ============ */
const TG = window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.initData ? window.Telegram.WebApp : null;
if (TG) {
  try { TG.ready(); TG.expand(); } catch (e) {}
  try { TG.disableVerticalSwipes(); } catch (e) {}
  try { TG.setHeaderColor("#143F4E"); TG.setBackgroundColor("#143F4E"); } catch (e) {}
}
