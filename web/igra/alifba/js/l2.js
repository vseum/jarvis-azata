"use strict";
/* «Алиф-Ба», уровень 2 «Буквы в слове»: соединение букв, гордые буквы, вид буквы в начале/середине/конце,
   буквы-хамелеоны и поиск буквы в слове из Корана.
   Слово, в котором можно нажать на букву, собирается из отдельных span (inline-block): у каждой буквы невидимая
   связка ZWJ с той стороны, где она соединяется с соседом, — поэтому слово выглядит связно, а буквы нажимаются по одной. */

/* ============ ОБЩЕЕ ДЛЯ УРОВНЯ ============ */
const L2_MARK = /[ً-ْٰ]/;          // огласовки, шадда, сукун, малый алиф
const L2_NOJOIN = "اأإآدذرزوؤءة";                   // не соединяются со следующей буквой
const L2_BYCH = Object.assign(Object.fromEntries(LETTERS.map(l => [l.ch, l])), { "أ": LET.alif, "إ": LET.alif });
const L2_TT = "ـ";                                  // татвиль: только для показа отдельной формы на карточке
const L2_POS = { iso: "одна", init: "в начале", mid: "в середине", fin: "в конце" };
const l2Mix = a => a.map(x => [Math.random(), x]).sort((p, q) => p[0] - q[0]).map(p => p[1]);
const l2Fonts = () => Promise.race([document.fonts.load('700 80px "Amiri"', "بَيْت"), sleep(2500)]).catch(() => {});

/* Слово → [{c: буква, m: огласовки}] */
function l2Parts(s) { const a = []; for (const c of s) { if (L2_MARK.test(c) && a.length) a[a.length - 1].m += c; else a.push({ c, m: "" }); } return a; }
const l2Joins = (a, b) => !!a && !!b && !L2_NOJOIN.includes(a.c) && b.c !== "ء";
function l2Piece(ps, i, cls = "") {
  const p = ps[i];
  return `<span data-i="${i}"${cls ? ` class="${cls}"` : ""}>${l2Joins(ps[i - 1], p) ? ZWJ : ""}${p.c}${p.m}${l2Joins(p, ps[i + 1]) ? ZWJ : ""}</span>`;
}
/* Слово из отдельных букв; gap — номер буквы, вместо которой пустое окошко */
function l2Html(ps, gap = -1) { return ps.map((p, i) => i === gap ? `<span class="l2-slot" data-i="${i}"></span>` : l2Piece(ps, i)).join(""); }
/* Вид буквы для карточки: с чёрточкой-татвилем, чтобы было видно, с какой стороны буква держится */
function l2Form(l, pos) {
  const c = l.ch;
  if (pos === "init") return l.join ? c + L2_TT : c;
  if (pos === "mid") return L2_TT + c + (l.join ? L2_TT : "");
  if (pos === "fin") return L2_TT + c;
  return c;
}
/* Карточка-слово на сцене; слишком широкое — уменьшаем */
function l2Word(html, x, y, fs) {
  const e = el("div", "l2-w", stage, html); e.style.fontSize = fs + "px"; e.style.zIndex = 7; put(e, x, y);
  l2Fit(e, fs); return e;
}
function l2Fit(e, fs) { const { W } = size(); e.style.fontSize = fs + "px"; const w = e.offsetWidth; if (w > W * 0.92) e.style.fontSize = (fs * W * 0.92 / w) + "px"; }
function l2Center(e) { const r = e.getBoundingClientRect(), s = stage.getBoundingClientRect(); return { x: r.left + r.width / 2 - s.left, y: r.top + r.height / 2 - s.top }; }

/* Ожидание действия: через ms — подсказка, ещё через ms — игра делает сама. Касания откладывают, но не дольше потолка 5·ms */
function l2Wait(ms, hint, auto) {
  let stage2 = 0, t = null, dead = false; const end = Date.now() + ms * 5;
  const fire = () => { if (dead) return; stage2++; if (stage2 === 1) { hint(); arm(); } else { dead = true; auto(); } };
  const arm = () => { clearTimeout(t); t = setTimeout(fire, Math.max(0, Math.min(ms, end - Date.now()))); };
  arm();
  return { poke() { if (!dead) arm(); }, stop() { dead = true; clearTimeout(t); } };
}
/* Перетаскивание пальцем. drop(item, tap) → true, если принято; иначе предмет едет домой. Короткое нажатие = попытка */
function l2Drag(item, drop) {
  let st = null; item.style.touchAction = "none";
  const dn = ev => { ev.preventDefault(); if (item._lock || st) return; const p = local(ev); st = { ox: item._x - p.x, oy: item._y - p.y, sx: p.x, sy: p.y, hx: item._x, hy: item._y }; item.classList.add("l2-up"); Snd.tap(); };
  const mv = ev => { if (!st || item._lock) return; const p = local(ev); put(item, p.x + st.ox, p.y + st.oy); };
  const up = async ev => {
    if (!st) return; const s = st; st = null; item.classList.remove("l2-up");
    const cancel = ev.type === "pointercancel", p = cancel ? { x: s.sx, y: s.sy } : local(ev);
    const ok = !cancel && !item._lock && await drop(item, Math.hypot(p.x - s.sx, p.y - s.sy) < 12);
    if (!ok && item.isConnected && !item._lock) move(item, s.hx, s.hy, 300, "ease-out");
  };
  item.addEventListener("pointerdown", dn); window.addEventListener("pointermove", mv); window.addEventListener("pointerup", up); window.addEventListener("pointercancel", up);
  return () => { item.removeEventListener("pointerdown", dn); window.removeEventListener("pointermove", mv); window.removeEventListener("pointerup", up); window.removeEventListener("pointercancel", up); };
}
/* Чтец читает аят (сквозной номер); без звука — короткая пауза */
async function l2Qari(n) {
  if (!Voice.on || !Snd.ac) return sleep(800);
  Voice.stop(); const my = Voice.seq;
  try {
    const b = await Voice.buffer("qari", n); if (my !== Voice.seq) return;
    cap.classList.add("talk");
    await Promise.race([new Promise(r => Voice.play(b, r)), sleep(b.duration * 1000 + 1500)]);
    if (my === Voice.seq) cap.classList.remove("talk");
  } catch (e) {}
}
const l2Score = m => m <= 1 ? 0 : m <= 3 ? 1 : 2;

const L2_CROWN = '<svg viewBox="0 0 40 26" aria-hidden="true"><path d="M3 23 L6 6 L14 14 L20 3 L26 14 L34 6 L37 23Z" fill="#F5C451" stroke="#B9802A" stroke-width="2" stroke-linejoin="round"/><circle cx="20" cy="4" r="2.6" fill="#E8584C"/><circle cx="6" cy="6" r="2" fill="#E8584C"/><circle cx="34" cy="6" r="2" fill="#E8584C"/></svg>';
const L2_ARROW = '<svg viewBox="0 0 140 30" aria-hidden="true"><path d="M130 15 H16" stroke="#FFE7A0" stroke-width="5" stroke-linecap="round"/><path d="M30 4 L12 15 L30 26" stroke="#FFE7A0" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/><circle cx="130" cy="15" r="6" fill="#FFD66B"/></svg>';
/* Паровоз смотрит вправо: везёт слово с правого края, как мы читаем */
const L2_LOCO = '<svg viewBox="0 0 120 90" aria-hidden="true"><g transform="translate(120 0) scale(-1 1)">' +
  '<rect x="70" y="10" width="44" height="54" rx="6" fill="#C0533A"/><rect x="64" y="3" width="56" height="10" rx="4" fill="#8E3A28"/><rect x="78" y="19" width="28" height="20" rx="4" fill="#FFE7A0"/>' +
  '<rect x="10" y="30" width="66" height="34" rx="14" fill="#2B6E8A"/><rect x="10" y="44" width="66" height="5" fill="#F5C451"/><rect x="22" y="12" width="14" height="22" rx="3" fill="#1C5169"/><rect x="18" y="7" width="22" height="8" rx="3" fill="#123B4D"/>' +
  '<circle cx="9" cy="40" r="6" fill="#FFD66B"/><rect x="4" y="62" width="112" height="8" rx="3" fill="#4F3A2A"/><path d="M0 70 L10 58 L10 70Z" fill="#4F3A2A"/>' +
  [26, 58, 94].map(x => `<circle cx="${x}" cy="76" r="12" fill="#33363A"/><circle cx="${x}" cy="76" r="5" fill="#C9A35A"/>`).join("") + '</g></svg>';
const L2_COL = ["#E8754F", "#5BA9C9", "#6DBB63", "#B98AD0"];
/* Вагон: справа крючок есть всегда, слева — только у букв, которые держат следующую */
const l2WagonSvg = (col, joins) => `<svg viewBox="0 0 100 90" aria-hidden="true">${joins ? '<rect x="0" y="55" width="12" height="7" rx="3" fill="#4F3A2A"/>' : ""}<rect x="88" y="55" width="12" height="7" rx="3" fill="#4F3A2A"/>` +
  `<rect x="8" y="6" width="84" height="60" rx="10" fill="${col}"/><rect x="8" y="50" width="84" height="8" fill="rgba(0,0,0,.15)"/><rect x="6" y="62" width="88" height="8" rx="3" fill="#4F3A2A"/>` +
  `<circle cx="28" cy="78" r="10" fill="#33363A"/><circle cx="28" cy="78" r="4" fill="#C9A35A"/><circle cx="72" cy="78" r="10" fill="#33363A"/><circle cx="72" cy="78" r="4" fill="#C9A35A"/></svg>`;

addCSS(`
.l2-w { position: absolute; translate: -50% -50%; direction: rtl; white-space: nowrap; font-family: "Amiri", serif; font-weight: 700; line-height: 1.95; color: #1F5B74;
  background: linear-gradient(180deg, #FFFDF5, #FFF1CF); border-radius: 26px; padding: 0 .3em; box-shadow: 0 6px 0 #E2C77E, 0 18px 30px -14px rgba(0,0,0,.45);
  user-select: none; -webkit-user-select: none; transition: box-shadow .3s; }
.l2-w:empty { display: none; }
.l2-w span { display: inline-block; transition: color .3s; }
.l2-w span.on { color: #E39A1E; }
.l2-w span.new { animation: l2-new .9s ease-out; }
@keyframes l2-new { from { color: #E39A1E; } }
.l2-w span.no { color: #D9665B; }
.l2-w span.hl { animation: l2-hl 1s ease-in-out infinite; }
@keyframes l2-hl { 50% { color: #E39A1E; } }
.l2-w.glow { box-shadow: 0 6px 0 #E2C77E, 0 0 0 5px rgba(245,196,81,.9), 0 18px 30px -14px rgba(0,0,0,.45); }
.l2-w.tap { cursor: pointer; touch-action: manipulation; }
.l2-slot { display: inline-block; width: .62em; height: .95em; vertical-align: -.1em; border: 3px dashed #E2B65A; border-radius: 12px; background: rgba(245,196,81,.16); margin: 0 .04em; animation: l2-slot 1.2s ease-in-out infinite; }
@keyframes l2-slot { 50% { background: rgba(245,196,81,.4); } }
.l2-rail { position: absolute; left: 0; right: 0; height: 14px; z-index: 5; pointer-events: none;
  background: linear-gradient(#7A5A3C, #7A5A3C) 0 2px / 100% 4px no-repeat, repeating-linear-gradient(90deg, #5E4430 0 9px, transparent 9px 24px) 0 6px / 100% 8px no-repeat; }
.l2-loco { z-index: 8; pointer-events: none; }
.l2-wag { z-index: 8; cursor: grab; }
.l2-wag b { position: absolute; left: 17%; right: 17%; top: 12%; bottom: 36%; display: grid; place-items: center; border-radius: 9px; background: #FFF6DA;
  font-family: "Amiri", serif; color: #1F5B74; line-height: 1; pointer-events: none; }
.l2-wag b span { transform: translateY(2%); }
.l2-up { z-index: 12 !important; filter: drop-shadow(0 12px 12px rgba(0,0,0,.35)); }
.l2-wslot { border: 3px dashed rgba(255,236,180,.95); border-radius: 14px; background: rgba(255,255,255,.18); z-index: 6; pointer-events: none; }
.l2-wslot.hl { animation: l2-ws 1s ease-in-out infinite; }
@keyframes l2-ws { 50% { background: rgba(255,214,107,.5); } }
.l2-cpl { z-index: 9; border-radius: 4px; background: #F5C451; box-shadow: 0 0 10px rgba(245,196,81,.9); pointer-events: none; }
.l2-crown { z-index: 9; pointer-events: none; }
.l2-arrow { z-index: 7; pointer-events: none; }
.l2-lab { position: absolute; translate: -50% -50%; color: #fff; font-weight: 900; font-size: 15px; text-align: center; line-height: 1.1; text-shadow: 0 2px 8px rgba(0,0,0,.5); z-index: 7; pointer-events: none; }
.l2-opt { z-index: 8; cursor: grab; }
.l2-fslot { border: 3px dashed rgba(255,236,180,.95); border-radius: 22px; background: rgba(255,255,255,.16); z-index: 5; pointer-events: none; }
.l2-ayah { position: absolute; translate: -50% -50%; width: min(92%, 520px); text-align: center; direction: rtl; font-family: "Amiri", serif; font-weight: 700; color: #fff;
  font-size: clamp(22px, 6.4vw, 32px); line-height: 1.75; z-index: 6; padding: 4px 12px 8px; border-radius: 20px; background: rgba(12,38,52,.55); pointer-events: none; }
.l2-ayah span.on { color: #FFD66B; }
.l2-ayah.play { box-shadow: 0 0 0 3px rgba(245,196,81,.7); }
.l2-ayah small { display: block; direction: ltr; font-family: Nunito, sans-serif; font-size: 13px; line-height: 1.2; color: rgba(255,255,255,.75); font-weight: 800; }
@media (max-width: 380px) { .l2-lab { font-size: 13px; } }
`);

/* Сокровища уровня */
ITEMS.push(
  { id: "l2_train", name: "Поезд букв", svg: glyphSvg("بيت") },
  { id: "l2_forms", name: "Вид буквы", svg: glyphSvg("بـ") },
  { id: "l2_cham", name: "Хамелеоны", svg: glyphSvg("ع") },
  { id: "l2_quran", name: "Слово из Корана", svg: glyphSvg("قُلْ") }
);

/* ============ ГЛАВА 1: БУКВЫ ДЕРЖАТСЯ ЗА РУКИ ============ */
const L2_TRAIN = [["بَيْت", "ar_w_ba", "дом"], ["كِتَاب", "ar_w_kaf", "книга"], ["نُور", "ar_l2_nur", "свет"], ["وَرَق", "ar_w_waw", "листья"]];
const L2_PROUD = ["alif", "dal", "dhal", "ra", "zay", "waw"];

/* Поезд: вагоны-буквы цепляются справа налево; за гордой буквой сцепка не держится */
async function l2TrainRound(word, arId, tr, seen, first) {
  const { W, H } = size(), ps = l2Parts(word), n = ps.length;
  const railY = H * 0.78, locoW = Math.min(92, W * 0.21), locoH = locoW * 0.75;
  const slotW = Math.min(98, (W - 28 - locoW) / Math.max(n, 3)), ww = slotW - 12, wh = ww * 0.9;
  const x0 = (W + locoW + slotW * n) / 2;                     // правый край поезда: поезд по центру
  const sx = i => x0 - locoW - slotW * (i + 0.5), wy = railY - wh / 2 - 2, hookY = wy - wh / 2 + wh * 0.65;
  const parts = [];
  const rail = el("div", "l2-rail", stage); rail.style.top = (railY - 4) + "px";
  const loco = obj("l2-loco", L2_LOCO, x0 - locoW / 2, railY - locoH / 2 - 2, locoW, locoH); parts.push(loco);
  const fs = Math.min(66, W * 0.17), strip = l2Word("", W / 2, H * 0.56, fs);
  const show = k => { strip.innerHTML = l2Html(ps.slice(0, k)); const s = strip.querySelector(`[data-i="${k - 1}"]`); if (s) s.classList.add("new"); l2Fit(strip, fs); };
  const mkWag = (i, x, y) => {
    const l = L2_BYCH[ps[i].c], w = obj("l2-wag", l2WagonSvg(L2_COL[i % 4], l.join) + `<b style="font-size:${ww * 0.42}px"><span>${l.ch}</span></b>`, x, y, ww, wh);
    w._l = l; parts.push(w); return w;
  };
  const couple = (xr, xl) => { const c = obj("l2-cpl", "", (xr + xl) / 2, hookY, Math.max(8, xr - xl + 8), 7); parts.push(c); fadeIn(c, 250); };
  const wags = [mkWag(0, sx(0), wy)];
  couple(x0 - locoW + 4, sx(0) + ww / 2);
  [loco, wags[0]].forEach(e => fadeIn(e, 500)); show(1);
  if (first) await say("l2_1_3");
  let gapShift = 0;
  for (let i = 1; i < n; i++) {
    const x = sx(i) - gapShift, slot = obj("l2-wslot", "", x, wy, ww, wh);
    const w = mkWag(i, W / 2, H * 0.9); fadeIn(w, 400); w.classList.add("hint");
    if (first && i === 1) cue("l2_1_drag"); else if (cap.classList.contains("hidden") || capLine?.id !== "l2_1_drag") showCap("l2_1_drag");
    await new Promise(res => {
      let done = false;
      const finish = async () => { if (done) return; done = true; w._lock = true; wait.stop(); off(); w.classList.remove("hint"); slot.classList.remove("hl"); await move(w, x, wy, 320, "ease-out"); res(); };
      const off = l2Drag(w, async (it, tap) => { wait.poke(); if (tap || Math.hypot(it._x - x, it._y - wy) < Math.max(70, ww)) { finish(); return true; } return false; });
      const wait = l2Wait(15000, () => { slot.classList.add("hl"); Voice.speak("l2_1_drag"); }, finish);
    });
    slot.remove(); wags.push(w);
    const prev = wags[i - 1];
    if (prev._l.join) {
      Snd.tap(); Snd.tone({ f: 1300, dur: 0.06, gain: 0.08 }); couple(prev._x - ww / 2 + 2, w._x + ww / 2 - 2); show(i + 1); Snd.sparkle();
    } else {
      /* гордая буква: сцепка не держится — вагон откатывается, остаётся щель */
      Snd.thud(0.45); gapShift += Math.min(14, slotW * 0.18);
      await move(w, x - Math.min(14, slotW * 0.18), wy, 260, "ease-out");
      if (!prev._crown) { prev._crown = obj("l2-crown", L2_CROWN, prev._x, prev._y - wh / 2 - ww * 0.16, ww * 0.5, ww * 0.33); parts.push(prev._crown); fadeIn(prev._crown, 400); }
      show(i + 1);
      const id = prev._l.id;
      if (!seen.has(id) && window.LINES["l2_1_pr_" + id]) { seen.add(id); await sayAr("l2_1_pr_" + id, "ar_name_" + id, { once: true }); }
      else { capNote.textContent = LET[id].ru + " не даёт руку"; AR.say("ar_name_" + id); await sleep(900); capNote.textContent = ""; }
    }
    await sleep(250);
  }
  /* слово готово: звучит, поезд уезжает вправо */
  strip.classList.add("glow"); capNote.textContent = word + " — " + tr;
  await AR.say(arId); await sleep(400);
  Snd.whoosh(0.35); Snd.tone({ f: 520, f2: 620, dur: 0.35, gain: 0.07 });
  parts.forEach(e => e.animate([{ transform: "translateX(0)" }, { transform: `translateX(${W + 40}px)` }], { duration: 1500, easing: "cubic-bezier(.5,0,.8,.6)", fill: "forwards" }));
  fadeOut(strip, 600); await sleep(1550);
  parts.forEach(e => e.remove()); rail.remove(); capNote.textContent = "";
}
/* Найди гордые буквы: каждой — корона. Возвращает число ошибок */
function l2ProudBoard() {
  return new Promise(res => {
    const { W, H } = size();
    const proud = l2Mix(L2_PROUD).slice(0, 4).map(id => LET[id]);
    const others = l2Mix(LETTERS.filter(l => l.join)).slice(0, 6);
    const all = l2Mix([...proud, ...others]);
    const s = Math.min((W - 32) / 5 - 10, 78, H * 0.11), y0 = H * 0.58;
    let left = proud.length, misses = 0, fin = false, told = false;
    const cards = all.map((l, i) => {
      const g = bigGlyph(l, W / 2 + (2 - (i % 5)) * (s + 10), y0 + Math.floor(i / 5) * (s + 30), s); g.style.zIndex = 7; fadeIn(g, 300 + i * 60);
      g.onclick = null; g._l = l;
      g.onpointerdown = ev => {
        ev.preventDefault(); if (fin || g._done) return; wait.poke();
        if (L2_PROUD.includes(l.id)) {
          g._done = true; g.classList.remove("hl"); g.classList.add("ok"); Snd.pop(); AR.say("ar_name_" + l.id);
          const c = obj("l2-crown", L2_CROWN, g._x, g._y - s / 2 - s * 0.12, s * 0.55, s * 0.36); fadeIn(c, 300); g._c = c;
          if (--left === 0) { fin = true; wait.stop(); celebrate(); setTimeout(end, 1200); }
        } else {
          misses++; g._done = true; g.classList.add("no"); Snd.thud(0.3); capNote.textContent = L("l2_1_join");
          if (!told) { told = true; Voice.speak("l2_1_join").then(() => AR.say("ar_name_" + l.id)); } else AR.say("ar_name_" + l.id);
        }
      };
      return g;
    });
    const end = () => { cards.forEach(g => { fadeOut(g, 400); if (g._c) fadeOut(g._c, 400); }); capNote.textContent = ""; setTimeout(() => res(misses), 450); };
    const isP = g => !g._done && proud.includes(g._l);
    const wait = l2Wait(15000, () => { cards.forEach(g => { if (isP(g)) g.classList.add("hl"); }); Voice.speak("l2_1_find"); },
      async () => { for (const g of cards) { if (fin) break; if (isP(g)) { g.onpointerdown({ preventDefault() {} }); await sleep(600); } } });
    cue("l2_1_find");
  });
}
async function l2Join() {
  await toDark(); clearStage(); let { W, H } = alScene(0); Snd.amb("wind", 0.4); fromDark(); await l2Fonts(); await sleep(300);
  await chapterTitle(null, "Буквы держатся за руки", "l2_1_0");
  /* три буквы отдельно → слово */
  const sz = Math.min(W * 0.26, H * 0.15, 110);
  const cards = ["ba", "ya", "ta"].map((id, i) => { const g = bigGlyph(LET[id], W / 2 + (1 - i) * (sz + 14), H * 0.6, sz); fadeIn(g, 400 + i * 150); return g; });
  await say("l2_1_1");
  hideCap(); cards.forEach(c => move(c, W / 2, H * 0.6, 500)); await sleep(480); cards.forEach(c => fadeOut(c, 200));
  const word = l2Word(l2Html(l2Parts("بَيْت")), W / 2, H * 0.6, Math.min(120, W * 0.28)); fadeIn(word, 500); Snd.sparkle();
  const aw = Math.min(W * 0.5, 200), arrow = obj("l2-arrow", L2_ARROW, W / 2, H * 0.6 + word.offsetHeight / 2 + 26, aw, aw * 30 / 140); fadeIn(arrow, 600);
  await sayAr("l2_1_2", "ar_w_ba");
  fadeOut(word, 400); fadeOut(arrow, 400); await sleep(450);
  /* поезд букв */
  const seen = new Set();
  for (let k = 0; k < L2_TRAIN.length; k++) { const [w, ar, tr] = L2_TRAIN[k]; await l2TrainRound(w, ar, tr, seen, k === 0); }
  /* шесть гордых букв */
  hideCap(); clearStage(); ({ W, H } = alScene(1));
  const s = Math.min((W - 40) / 6 - 8, 66);
  const six = L2_PROUD.map((id, i) => {
    const g = bigGlyph(LET[id], W / 2 + (2.5 - i) * (s + 8), H * 0.66, s); fadeIn(g, 300 + i * 120);
    const c = obj("l2-crown", L2_CROWN, g._x, g._y - s / 2 - s * 0.14, s * 0.6, s * 0.39); fadeIn(c, 500 + i * 120);
    return [g, c];
  });
  await say("l2_1_six");
  six.flat().forEach(e => fadeOut(e, 400)); await sleep(450);
  const misses = await l2ProudBoard();
  await say("l2_1_end", { named: true });
  hideCap(); await award("l2_train");
  return l2Score(misses);
}

/* ============ ГЛАВА 2: НАЧАЛО, СЕРЕДИНА, КОНЕЦ ============ */
const L2_FORMR = [
  { w: "بَيْت", i: 0, ar: "ar_w_ba", pic: "house", line: "l2_2_r1" },
  { w: "جَبَل", i: 1, ar: "ar_w_jim", pic: "mountain", line: "l2_2_r2" },
  { w: "ذَهَب", i: 2, ar: "ar_w_dhal", pic: "gold", line: "l2_2_r3" },
  { w: "ثَمَر", i: 0, ar: "ar_w_tha", pic: "fruit", line: "l2_2_r4" },
  { w: "كِتَاب", i: 1, ar: "ar_w_kaf", pic: "book", line: "l2_2_r5" },
  { w: "طِين", i: 2, ar: "ar_w_tta", pic: "clay", line: "l2_2_r6" },
  { w: "يَوْم", i: 0, ar: "ar_w_ya", pic: "day", line: "l2_2_r7" }
];
/* Слово с окошком: перетащи нужный вид буквы. Возвращает число ошибок */
function l2FormRound(r, firstRound) {
  return new Promise(async res => {
    const { W, H } = size(), ps = l2Parts(r.w), n = ps.length, l = L2_BYCH[ps[r.i].c];
    const pos = r.i === 0 ? "init" : r.i === n - 1 ? "fin" : "mid";
    const ph = Math.min(W * 0.3, H * 0.14, 120);
    const pic = obj("al-pic", `<svg viewBox="0 0 100 100" aria-hidden="true">${PIC[r.pic] || ""}</svg>`, W / 2, H * 0.43, ph, ph); pic.style.zIndex = 6; fadeIn(pic);
    const word = l2Word(l2Html(ps, r.i), W / 2, H * 0.63, Math.min(88, W * 0.21)); fadeIn(word, 500);
    const slot = word.querySelector(".l2-slot");
    const s = Math.min((W - 60) / 3 - 8, 92, H * 0.13);
    const opts = l2Mix(["init", "mid", "fin"]).map((p, i) => {
      const o = obj("al-glyph l2-opt", `<span>${l2Form(l, p)}</span>`, W / 2 + (1 - i) * (s + 18), H * 0.86, s, s); o.style.fontSize = (s * 0.5) + "px"; o._pos = p; fadeIn(o, 400 + i * 120);
      return o;
    });
    let misses = 0, fin = false, wait = { poke() {}, stop() {} };
    const offs = [];
    const accept = async o => {
      if (fin) return; fin = true; wait.stop(); offs.forEach(f => f()); o._lock = true; o.classList.remove("hint");
      const c = l2Center(slot); await move(o, c.x, c.y, 240, "ease-out"); o.remove();
      slot.outerHTML = l2Piece(ps, r.i, "on"); l2Fit(word, Math.min(88, W * 0.21)); word.classList.add("glow");
      Snd.sparkle(); celebrate(); capNote.textContent = L("a_right");
      opts.forEach(x => x !== o && fadeOut(x, 300));
      await AR.say(r.ar); await sleep(700);
      [pic, word].forEach(e => fadeOut(e, 400)); capNote.textContent = ""; await sleep(450); res(misses);
    };
    const drop = async (o, tap) => {
      if (fin) return false; wait.poke();
      const c = l2Center(slot);
      if (!tap && Math.hypot(o._x - c.x, o._y - c.y) > Math.max(70, s * 0.9)) return false;
      if (o._pos === pos) { accept(o); return true; }
      misses++; Snd.thud(0.3); o.classList.add("no"); setTimeout(() => o.classList.remove("no"), 500);
      capNote.textContent = L("l2_2_no_" + o._pos); Voice.speak("l2_2_no_" + o._pos);
      return false;
    };
    opts.forEach(o => offs.push(l2Drag(o, drop)));
    if (firstRound) await say("l2_2_game");
    if (fin) return;
    showCap(r.line); capLine.ar = r.ar;
    Voice.speak(r.line).then(() => { if (!fin) AR.say(r.ar); });
    const right = opts.find(o => o._pos === pos);
    wait = l2Wait(15000, () => { right.classList.add("hint"); Voice.speak(r.line); }, () => accept(right));
  });
}
async function l2Forms() {
  await toDark(); clearStage(); let { W, H } = alScene(2); Snd.amb("wind", 0.4); fromDark(); await l2Fonts(); await sleep(300);
  await chapterTitle(null, "Начало, середина, конец", "l2_2_0");
  const ba = LET.ba;
  const big = bigGlyph(ba, W / 2, H * 0.62, Math.min(W * 0.42, H * 0.25, 180)); fadeIn(big, 600); Snd.sparkle();
  await sayAr("l2_2_1", "ar_name_ba", { once: true });
  fadeOut(big, 300); await sleep(320);
  /* три вида Ба: справа налево — начало, середина, конец */
  const s = Math.min((W - 48) / 3 - 12, 110, H * 0.15);
  const row = ["init", "mid", "fin"].map((pos, i) => {
    const g = bigGlyph(ba, W / 2 + (1 - i) * (s + 18), H * 0.6, s, l2Form(ba, pos)); fadeIn(g, 400 + i * 200);
    const lab = el("div", "l2-lab", stage, L2_POS[pos]); put(lab, g._x, H * 0.6 + s / 2 + 22);
    return [g, lab, pos];
  });
  for (const [g, , pos] of row) { g.classList.add("hl"); await say("l2_2_" + pos); g.classList.remove("hl"); }
  row.forEach(([g, lab]) => { fadeOut(g, 300); fadeOut(lab, 300); }); await sleep(350);
  /* семья с одинаковым началом */
  const fam = ["ba", "ta", "tha", "nun", "ya"], s2 = Math.min((W - 40) / 5 - 10, 84, H * 0.12);
  const fc = fam.map((id, i) => { const g = bigGlyph(LET[id], W / 2 + (2 - i) * (s2 + 10), H * 0.64, s2, l2Form(LET[id], "init")); fadeIn(g, 300 + i * 150); return g; });
  await say("l2_2_fam");
  fc.forEach(g => fadeOut(g, 300)); await sleep(350);
  /* игра: подбери вид буквы */
  hideCap(); clearStage(); alScene(1);
  let misses = 0;
  for (let k = 0; k < L2_FORMR.length; k++) misses += await l2FormRound(L2_FORMR[k], k === 0);
  await say("l2_2_end", { named: true });
  hideCap(); await award("l2_forms");
  return l2Score(misses);
}

/* ============ ГЛАВА 3: БУКВЫ-ХАМЕЛЕОНЫ ============ */
const L2_CHAM = ["ya", "kaf", "ain", "ha"];
/* Четыре вида буквы в ряд; подсветка идёт по ним, пока звучит объяснение */
async function l2ChamShow(id) {
  const { W, H } = size(), l = LET[id], P = ["iso", "init", "mid", "fin"];
  const s = Math.min((W - 40) / 4 - 10, 92, H * 0.13), y = H * 0.6;
  const row = (lt, yy, lab) => P.map((pos, i) => {
    const g = bigGlyph(lt, W / 2 + (1.5 - i) * (s + 10), yy, s, l2Form(lt, pos)); fadeIn(g, 300 + i * 120);
    const t = lab ? el("div", "l2-lab", stage, L2_POS[pos]) : null; if (t) { t.style.width = (s + 8) + "px"; put(t, g._x, yy + s / 2 + 20); }
    return [g, t];
  });
  const r1 = row(l, y, true), all = [...r1];
  let k = 0; const tick = () => { r1.forEach(([g], i) => g.classList.toggle("hl", i === k % 4)); k++; };
  tick(); const iv = setInterval(tick, 2600);
  await sayAr("l2_3_" + id, "ar_name_" + id, { once: true });
  clearInterval(iv); r1.forEach(([g]) => g.classList.remove("hl"));
  if (id === "ain") { const r2 = row(LET.ghain, y + s + 46, false); all.push(...r2); await sayAr("l2_3_ghain", "ar_name_ghain", { once: true }); }
  all.forEach(([g, t]) => { fadeOut(g, 300); if (t) fadeOut(t, 300); }); await sleep(350);
}
const L2_FIND = [
  { id: "ha", dis: [["mim", "init"], ["mim", "fin"], ["fa", "mid"], ["qaf", "fin"], ["sad", "mid"]] },
  { id: "ain", dis: [["ghain", "init"], ["ghain", "fin"], ["hha", "init"], ["fa", "mid"], ["mim", "mid"]] },
  { id: "kaf", dis: [["lam", "init"], ["lam", "fin"], ["tta", "mid"], ["dal", "fin"], ["ba", "init"]] }
];
/* Найди букву во всех её видах: нажатый вид встаёт рядом с буквой. Возвращает число ошибок */
function l2ChamFind(f) {
  return new Promise(res => {
    const { W, H } = size(), l = LET[f.id], P = ["init", "mid", "fin"];
    const s1 = Math.min((W - 40) / 4 - 10, 84, H * 0.12), y1 = H * 0.45, x1 = i => W / 2 + (1.5 - i) * (s1 + 10);
    const head = bigGlyph(l, x1(0), y1, s1); head.classList.add("ok"); fadeIn(head, 400);
    const slots = P.map((p, i) => obj("l2-fslot", "", x1(i + 1), y1, s1, s1));
    const s2 = Math.min((W - 40) / 4 - 10, 80, H * 0.115), y2 = H * 0.66;
    const deck = l2Mix([...P.map(p => [f.id, p]), ...f.dis]);
    let found = 0, misses = 0, fin = false;
    const cards = deck.map(([id, p], i) => {
      const lt = LET[id], g = bigGlyph(lt, W / 2 + (1.5 - (i % 4)) * (s2 + 10), y2 + Math.floor(i / 4) * (s2 + 14), s2, l2Form(lt, p)); fadeIn(g, 300 + i * 60);
      g._ok = id === f.id; g._p = p; g.onclick = null;
      g.onpointerdown = async ev => {
        ev.preventDefault(); if (fin || g._done) return; wait.poke();
        if (g._ok) {
          g._done = true; g.classList.remove("hl"); g.classList.add("ok"); Snd.pop(); AR.say("ar_name_" + f.id);
          g.style.transition = "width .3s, height .3s, font-size .3s"; g.style.width = g.style.height = s1 + "px"; g.style.fontSize = (s1 * 0.62) + "px";
          await move(g, x1(P.indexOf(p) + 1), y1, 350, "ease-out");
          if (++found === 3) { fin = true; wait.stop(); celebrate(); await sleep(1100); end(); }
        } else {
          misses++; g.classList.add("no"); setTimeout(() => g.classList.remove("no"), 500); Snd.thud(0.3);
          capNote.textContent = "Это " + lt.ru + "."; AR.say("ar_name_" + id);
        }
      };
      return g;
    });
    const end = () => { [head, ...slots, ...cards].forEach(e => fadeOut(e, 400)); capNote.textContent = ""; setTimeout(() => res(misses), 450); };
    const wait = l2Wait(15000, () => { cards.forEach(g => { if (g._ok && !g._done) g.classList.add("hl"); }); Voice.speak("l2_3_find_" + f.id); },
      async () => { for (const g of cards) { if (g._ok && !g._done) { await g.onpointerdown({ preventDefault() {} }); await sleep(250); } } });
    showCap("l2_3_find_" + f.id); capLine.ar = "ar_name_" + f.id;
    Voice.speak("l2_3_find_" + f.id).then(() => { if (!fin) AR.say("ar_name_" + f.id); });
  });
}
/* Пары: буква одна ↔ она же в начале слова. Возвращает число ошибок */
function l2Pairs(ids) {
  return new Promise(res => {
    const { W, H } = size();
    const deck = l2Mix(ids.flatMap(id => [{ id, p: "iso" }, { id, p: "init" }]));
    const cols = 4, rows = Math.ceil(deck.length / cols), cw = Math.min((W - 40) / cols - 10, 84, H * 0.11), chh = cw * 1.2;
    const gridH = rows * (chh + 12) - 12, top = H * 0.64 - gridH / 2;
    let open = [], pairs = 0, misses = 0, fin = false, busy = false;
    const cards = deck.map((d, i) => {
      const c = el("div", "al-card", stage, `<i class="bk"></i><i class="fr" style="font-size:${cw * 0.5}px"><span style="transform:translateY(8%)">${l2Form(LET[d.id], d.p)}</span></i>`);
      Object.assign(c.style, { width: cw + "px", height: chh + "px", zIndex: 8 });
      put(c, W / 2 + ((i % cols) - (cols - 1) / 2) * (cw + 10), top + Math.floor(i / cols) * (chh + 12) + chh / 2);
      c._d = d;
      c.onclick = async () => {
        if (fin || busy || c.classList.contains("open")) return;
        wait.poke(); Snd.tap(); c.classList.add("open"); open.push(c); AR.say("ar_name_" + d.id);
        if (open.length === 2) {
          busy = true; await sleep(800);
          const [a, b] = open; open = [];
          if (a._d.id === b._d.id) { a.classList.add("done"); b.classList.add("done"); Snd.sparkle(); if (++pairs === ids.length) { fin = true; wait.stop(); celebrate(); setTimeout(end, 800); } }
          else { misses++; a.classList.remove("open"); b.classList.remove("open"); }
          busy = false;
        }
      };
      return c;
    });
    const end = () => { cards.forEach(c => fadeOut(c, 400)); setTimeout(() => res(misses), 450); };
    const wait = l2Wait(20000, () => Voice.speak("l2_3_mem"), async () => {
      fin = true;
      for (const id of ids) { const cs = cards.filter(c => c._d.id === id && !c.classList.contains("done")); if (cs.length === 2) { cs.forEach(c => c.classList.add("open", "done")); Snd.sparkle(); AR.say("ar_name_" + id); await sleep(700); } }
      end();
    });
    cue("l2_3_mem");
  });
}
async function l2Cham() {
  await toDark(); clearStage(); let { W, H } = alScene(3); Snd.amb("wind", 0.4); fromDark(); await l2Fonts(); await sleep(300);
  await chapterTitle(null, "Буквы-хамелеоны", "l2_3_0");
  await say("l2_3_1");
  for (const id of L2_CHAM) await l2ChamShow(id);
  hideCap(); clearStage(); alScene(0);
  let misses = 0;
  for (const f of L2_FIND) { misses += await l2ChamFind(f); await sleep(200); }
  hideCap(); clearStage(); alScene(2);
  misses += await l2Pairs(["ain", "ha", "kaf", "ya"]);
  await say("l2_3_end", { named: true });
  hideCap(); await award("l2_cham");
  return l2Score(misses);
}

/* ============ ГЛАВА 4: НАЙДИ БУКВУ В СЛОВЕ ИЗ КОРАНА ============ */
/* Слова сверены с api.alquran.cloud (quran-simple); n — сквозной номер аята для чтеца */
const L2_QW = [
  { k: "qul", w: "قُلْ", t: "qaf", ay: "قُلْ هُوَ اللَّهُ أَحَدٌ", wi: 0, n: 6222, ref: "Сура Аль-Ихлас, 112:1" },
  { k: "rabb", w: "رَبِّ", t: "ba", ay: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ", wi: 2, n: 2, ref: "Сура Аль-Фатиха, 1:2" },
  { k: "falaq", w: "الْفَلَقِ", t: "fa", ay: "قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ", wi: 3, n: 6226, ref: "Сура Аль-Фаляк, 113:1" },
  { k: "allah", w: "اللَّهُ", t: "ha", ay: "قُلْ هُوَ اللَّهُ أَحَدٌ", wi: 2, n: 6222, ref: "Сура Аль-Ихлас, 112:1" },
  { k: "nas", w: "النَّاسِ", t: "sin", ay: "قُلْ أَعُوذُ بِرَبِّ النَّاسِ", wi: 3, n: 6231, ref: "Сура Ан-Нас, 114:1" },
  { k: "malik", w: "مَلِكِ", t: "kaf", ay: "مَلِكِ النَّاسِ", wi: 0, n: 6232, ref: "Сура Ан-Нас, 114:2" }
];
/* Нажми на букву внутри слова. Возвращает число ошибок */
function l2FindRound(q, first) {
  return new Promise(res => {
    const { W, H } = size(), ps = l2Parts(q.w), tl = LET[q.t];
    const fs = Math.min(124, W * 0.3, H * 0.14);
    const card = l2Word(l2Html(ps), W / 2, H * 0.58, fs); card.classList.add("tap"); fadeIn(card, 500);
    const ayah = el("div", "l2-ayah", stage, q.ay.split(" ").map((x, i) => `<span${i === q.wi ? ' class="on"' : ""}>${x}</span>`).join(" ") + `<small>${q.ref}</small>`);
    put(ayah, W / 2, H * 0.58 + card.offsetHeight / 2 + 22 + ayah.offsetHeight / 2); fadeIn(ayah, 700);
    const spans = [...card.querySelectorAll("span")];
    const tIdx = ps.findIndex(p => L2_BYCH[p.c] === tl);
    let misses = 0, fin = false;
    const ok = async sp => {
      if (fin) return; fin = true; wait.stop(); card.onpointerdown = null;
      spans.forEach(x => x.classList.remove("hl", "no")); sp.classList.add("on"); card.classList.add("glow");
      Snd.sparkle(); celebrate(); capNote.textContent = L("a_right");
      await AR.say("ar_name_" + q.t); await sleep(250); await AR.say("ar_l2_" + q.k); await sleep(300);
      if (first) await cue("l2_4_qari"); else showCap("l2_4_qari");
      ayah.classList.add("play"); await l2Qari(q.n); ayah.classList.remove("play");
      await sleep(500); [card, ayah].forEach(e => fadeOut(e, 400)); capNote.textContent = ""; await sleep(450); res(misses);
    };
    card.onpointerdown = ev => {
      ev.preventDefault(); if (fin) return; wait.poke();
      /* ближайшая буква по горизонтали — пальцу малыша не нужно попадать точно */
      let best = 0, bd = 1e9; spans.forEach((sp, i) => { const r = sp.getBoundingClientRect(), d = Math.abs(r.left + r.width / 2 - ev.clientX); if (d < bd) { bd = d; best = i; } });
      const sp = spans[best], l = L2_BYCH[ps[best].c];
      if (l === tl) return ok(sp);
      misses++; Snd.thud(0.3); sp.classList.add("no"); setTimeout(() => sp.classList.remove("no"), 700);
      capNote.textContent = `Это ${l ? l.ru : "другая буква"}. А мы ищем ${tl.ru}.`;
      (l ? AR.say("ar_name_" + l.id) : sleep(300)).then(() => sleep(250)).then(() => { if (!fin) AR.say("ar_name_" + q.t); });
    };
    const wait = l2Wait(15000, () => { spans[tIdx].classList.add("hl"); AR.say("ar_name_" + q.t); }, () => ok(spans[tIdx]));
    showCap("l2_4_" + q.k); capLine.ar = "ar_name_" + q.t;
    Voice.speak("l2_4_" + q.k).then(() => { if (!fin) AR.say("ar_name_" + q.t); });
  });
}
async function l2Quran() {
  await toDark(); clearStage(); let { W, H } = alScene(1); Snd.amb("wind", 0.4); fromDark(); await l2Fonts(); await sleep(300);
  await chapterTitle(null, "Найди букву в слове из Корана", "l2_4_0");
  const book = obj("al-pic", ART.book, W / 2, H * 0.66, Math.min(W * 0.4, 150)); fadeIn(book, 600);
  await say("l2_4_1");
  fadeOut(book, 300); hideCap(); await sleep(350);
  let misses = 0;
  for (let k = 0; k < L2_QW.length; k++) misses += await l2FindRound(L2_QW[k], k === 0);
  await say("l2_4_end", { named: true });
  hideCap(); await award("l2_quran");
  return l2Score(misses);
}

/* ============ РЕГИСТРАЦИЯ ============ */
regChapter(1, { id: "l2_join", name: "Буквы держатся за руки", icon: chIcon("بيت"), fn: l2Join, lines: "l2_1_" });
regChapter(1, { id: "l2_forms", name: "Начало, середина, конец", icon: chIcon("بـ"), fn: l2Forms, lines: "l2_2_" });
regChapter(1, { id: "l2_cham", name: "Буквы-хамелеоны", icon: chIcon("ع"), fn: l2Cham, lines: "l2_3_" });
regChapter(1, { id: "l2_quran", name: "Найди букву в слове из Корана", icon: chIcon("قل"), fn: l2Quran, lines: "l2_4_" });
