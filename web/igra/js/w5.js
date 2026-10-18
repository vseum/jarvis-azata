"use strict";
/* Мир 5: сокровища Корана. Смысл коротких сур: каждый аят суры — маленькая сцена-игра,
   после всех аятов — вопрос и карточка суры (весь текст суры, чтец читает аяты по очереди). */

Object.assign(window.AYAT, {
  "1:1-7": { ref: "Сура аль-Фатиха, 1:1-7", tr: "tr_1_1", parts: [
    { n: 1, ar: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ" },
    { n: 2, ar: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ" },
    { n: 3, ar: "الرَّحْمَٰنِ الرَّحِيمِ" },
    { n: 4, ar: "مَالِكِ يَوْمِ الدِّينِ" },
    { n: 5, ar: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ" },
    { n: 6, ar: "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ" },
    { n: 7, ar: "صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ" }
  ] },
  "112:1-4": { ref: "Сура аль-Ихлас, 112:1-4", tr: "tr_112_1", parts: [
    { n: 6222, ar: "قُلْ هُوَ اللَّهُ أَحَدٌ" },
    { n: 6223, ar: "اللَّهُ الصَّمَدُ" },
    { n: 6224, ar: "لَمْ يَلِدْ وَلَمْ يُولَدْ" },
    { n: 6225, ar: "وَلَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ" }
  ] },
  "113:1-5": { ref: "Сура аль-Фаляк, 113:1-5", tr: "tr_113_1", parts: [
    { n: 6226, ar: "قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ" },
    { n: 6227, ar: "مِنْ شَرِّ مَا خَلَقَ" },
    { n: 6228, ar: "وَمِنْ شَرِّ غَاسِقٍ إِذَا وَقَبَ" },
    { n: 6229, ar: "وَمِنْ شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ" },
    { n: 6230, ar: "وَمِنْ شَرِّ حَاسِدٍ إِذَا حَسَدَ" }
  ] },
  "114:1-6": { ref: "Сура ан-Нас, 114:1-6", tr: "tr_114_1", parts: [
    { n: 6231, ar: "قُلْ أَعُوذُ بِرَبِّ النَّاسِ" },
    { n: 6232, ar: "مَلِكِ النَّاسِ" },
    { n: 6233, ar: "إِلَٰهِ النَّاسِ" },
    { n: 6234, ar: "مِنْ شَرِّ الْوَسْوَاسِ الْخَنَّاسِ" },
    { n: 6235, ar: "الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ" },
    { n: 6236, ar: "مِنَ الْجِنَّةِ وَالنَّاسِ" }
  ] }
});
const W5_NAMES = {"1": "سُورَةُ ٱلْفَاتِحَةِ", "112": "سُورَةُ الإِخۡلَاصِ", "113": "سُورَةُ الفَلَقِ", "114": "سُورَةُ النَّاسِ"};

/* ============ ОБЩИЕ ПОМОЩНИКИ МИРА 5 ============ */
const W5 = { bot: 0 };
const w5C = (v, a, b) => Math.max(a, Math.min(b, v));
const w5Dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
const w5D = (a, b) => Math.hypot(a._x - b._x, a._y - b._y);
const w5Svg = (vb, body, extra = "") => `<svg viewBox="${vb}" aria-hidden="true"${extra}>${body}</svg>`;
const w5Shuffle = a => { const r = a.slice(); for (let i = r.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [r[i], r[j]] = [r[j], r[i]]; } return r; };
const w5Dots = (n, h = 200) => Array.from({ length: n }, () => `<circle cx="${rnd(0, 200).toFixed(0)}" cy="${rnd(0, h).toFixed(0)}" r="${rnd(0.4, 1.3).toFixed(1)}" fill="#FFF6DD" opacity="${rnd(0.4, 1).toFixed(2)}"/>`).join("");
const w5Flower = (x, y, c) => `<path d="M${x} ${y} V${y - 14}" stroke="#3F8A3B" stroke-width="2"/>${[0, 72, 144, 216, 288].map(a => `<ellipse cx="${x}" cy="${y - 18}" rx="2.6" ry="4" fill="${c}" transform="rotate(${a} ${x} ${y - 14})"/>`).join("")}<circle cx="${x}" cy="${y - 14}" r="2.2" fill="#F5C451"/>`;

/* Рабочая зона сцены: под подписью (top) и над лентой аятов (bot) */
function w5A() { const { W, H } = size(); const top = H * 0.36, bot = W5.bot || H - 70; return { W, H, top, bot, cx: W / 2, mid: (top + bot) / 2 }; }
/* Сменить сцену: затемнение, новая картинка, проявление */
async function w5Go(draw) { await toDark(); clearStage(); const r = draw ? draw(w5A()) : null; vignette(); fromDark(); await sleep(350); return r; }

/* Ожидание действия ребёнка с автотаймаутом. setup(done, isFin) возвращает { off, auto } */
function w5Task(ms, setup) {
  return new Promise(res => {
    let fin = false, api = {};
    const isFin = () => fin;
    const done = v => { if (fin) return; fin = true; clearTimeout(tm); try { api.off && api.off(); } catch (e) {} res(v); };
    const tm = setTimeout(async () => { if (fin) return; if (api.auto) { try { await api.auto(); } catch (e) {} } done(); }, ms);
    api = setup(done, isFin) || {};
  });
}
/* Поле на всю сцену для жестов; все слушатели window снимаются в off() */
function w5Field(h, z = 12) {
  const f = el("div", "tapfield"); f.style.zIndex = z;
  let down = false, sx = 0, sy = 0, moved = false;
  const dn = ev => { ev.preventDefault(); down = true; moved = false; const p = local(ev); sx = p.x; sy = p.y; h.down && h.down(p); };
  const mv = ev => { const p = local(ev); if (down && Math.hypot(p.x - sx, p.y - sy) > 10) moved = true; if (down || h.hover) h.move && h.move(p, down); };
  const up = ev => { if (!down) return; down = false; h.up && h.up(local(ev), moved); };
  f.addEventListener("pointerdown", dn);
  window.addEventListener("pointermove", mv); window.addEventListener("pointerup", up); window.addEventListener("pointercancel", up);
  return { el: f, off() { f.remove(); window.removeEventListener("pointermove", mv); window.removeEventListener("pointerup", up); window.removeEventListener("pointercancel", up); } };
}
/* Перетаскивание нескольких предметов. onDrop(item) → true, если предмет принят (иначе он вернётся на место) */
function w5Drags(items, onDrop) {
  let drag = null, off = null;
  const mv = ev => { if (!drag) return; const p = local(ev); put(drag, p.x + off.x, p.y + off.y); };
  const up = () => {
    if (!drag) return; const it = drag; drag = null; it.style.zIndex = it._z;
    if (!onDrop(it)) move(it, it._hx, it._hy, 300, "ease-out");
  };
  items.forEach(it => {
    it._hx = it._x; it._hy = it._y; it._z = it.style.zIndex || 9; it.classList.add("tapme");
    it.onpointerdown = ev => { ev.preventDefault(); if (it.locked || drag) return; const p = local(ev); drag = it; off = { x: it._x - p.x, y: it._y - p.y }; it.style.zIndex = 14; it.classList.remove("hint"); Snd.tap(); };
  });
  window.addEventListener("pointermove", mv); window.addEventListener("pointerup", up); window.addEventListener("pointercancel", up);
  return () => { items.forEach(it => { it.onpointerdown = null; }); window.removeEventListener("pointermove", mv); window.removeEventListener("pointerup", up); window.removeEventListener("pointercancel", up); };
}
function w5Burst(x, y, n = 14, spread = 70) {
  for (let i = 0; i < n; i++) {
    const s = el("i", "spark"); s.style.zIndex = 15; s.style.left = x + "px"; s.style.top = y + "px";
    s.style.background = ["#FFD54F", "#FFFFFF", "#F5C451", "#FFE7A0"][i % 4];
    const a = Math.random() * Math.PI * 2, d = rnd(0.4, 1) * spread;
    s.animate([{ transform: "translate(-50%,-50%) scale(1)", opacity: 1 }, { transform: `translate(calc(-50% + ${(Math.cos(a) * d).toFixed(0)}px), calc(-50% + ${(Math.sin(a) * d).toFixed(0)}px)) scale(.3)`, opacity: 0 }],
      { duration: rnd(500, 900), easing: "cubic-bezier(.2,.8,.3,1)" }).onfinish = () => s.remove();
  }
}
function w5Label(x, y, html, cls = "") { const t = el("div", "w5lbl " + cls, stage, html); t.style.left = x + "px"; t.style.top = y + "px"; return t; }
function w5Pop(x, y, text) {
  const t = w5Label(x, y, text, "pop"); t.style.zIndex = 16;
  t.animate([{ transform: "translateY(0) scale(.8)", opacity: 0 }, { transform: "translateY(-20px) scale(1)", opacity: 1, offset: 0.25 }, { transform: "translateY(-60px)", opacity: 0 }], { duration: 1500, easing: "ease-out" }).onfinish = () => t.remove();
}
function w5Arrow(x, y, deg) {
  const a = el("div", "w5arrow", stage, w5Svg("0 0 56 56", '<path d="M12 14 L26 28 L12 42 M28 14 L42 28 L28 42" fill="none" stroke="#FFE7A0" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>'));
  a.style.left = x + "px"; a.style.top = y + "px"; a.style.rotate = deg + "deg"; return a;
}
function w5Stars(n, h = "60%") {
  const s = el("div", "layer", stage, `<svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><g class="twinkle" fill="#FFF6DD">${Array.from({ length: n }, () => `<circle cx="${rnd(0, 400).toFixed(0)}" cy="${rnd(0, 300).toFixed(0)}" r="${rnd(0.6, 1.5).toFixed(1)}"/>`).join("")}</g></svg>`);
  s.style.top = "0"; s.style.height = h; return s;
}
/* Свет поднимается вверх: дуа поднимается к Аллаху */
async function w5Beam(x, y) {
  const b = el("div", "w5beam"); b.style.left = x + "px"; b.style.height = y + "px";
  b.animate([{ transform: "scaleY(0)", opacity: 0 }, { transform: "scaleY(1)", opacity: 1 }], { duration: 1200, easing: "ease-out", fill: "forwards" });
  Snd.sparkle();
  for (let i = 0; i < 16; i++) {
    const s = el("i", "spark"); s.style.zIndex = 15; s.style.background = ["#FFE7A0", "#FFFFFF", "#F5C451"][i % 3];
    s.animate([{ left: (x + rnd(-20, 20)) + "px", top: y + "px", opacity: 1 }, { left: (x + rnd(-50, 50)) + "px", top: (y * 0.2) + "px", opacity: 0 }], { duration: rnd(1300, 2000), delay: i * 70, easing: "ease-out" }).onfinish = () => s.remove();
  }
  await sleep(1800);
}

/* Лента аятов внизу: номера аятов и арабский текст текущего аята, кнопка чтеца */
function w5Ribbon(key) {
  const a = window.AYAT[key];
  const rb = el("div", "w5rb mini off", app, `<div class="w5beads">${a.parts.map((_, i) => `<i>${AR_DIGITS(i + 1)}</i>`).join("")}</div>` +
    `<div class="w5ayl"><button class="w5play" aria-label="Послушать чтеца">▶</button><p class="w5ar" dir="rtl" lang="ar"></p></div>`);
  const beads = [...rb.querySelectorAll(".w5beads i")], arP = rb.querySelector(".w5ar");
  W5.bot = rb.getBoundingClientRect().top - app.getBoundingClientRect().top - 10;
  let cur = 0;
  rb.querySelector(".w5play").onclick = () => {
    Snd.tap(); Voice.stop(); const my = Voice.seq;
    Voice.buffer("qari", a.parts[cur].n).then(b => { if (my === Voice.seq) Voice.play(b); }).catch(() => {});
  };
  const api = {
    show() { rb.classList.remove("off"); },
    at(i) { cur = i - 1; beads.forEach((b, j) => b.classList.toggle("cur", j === cur)); arP.textContent = `${a.parts[cur].ar} ﴿${AR_DIGITS(i)}﴾`; },
    full(on) { rb.classList.toggle("mini", !on); },
    done(i) { beads[i - 1].classList.remove("cur"); beads[i - 1].classList.add("done"); Snd.sparkle(); },
    async intro(i, id) { api.at(i); api.full(true); await say(id); api.full(false); },
    async outro(i, id) { api.full(true); await say(id); api.done(i); },
    remove() { rb.style.pointerEvents = "none"; fadeOut(rb, 400); W5.bot = 0; }
  };
  return api;
}

/* ============ РИСУНКИ МИРА 5 (без живых существ) ============ */
Object.assign(ART, {
  w5_cover: w5Svg("0 0 120 160", `<rect x="2" y="2" width="116" height="156" rx="8" fill="#1F6E58"/><rect x="9" y="9" width="100" height="142" rx="5" fill="none" stroke="#F5C451" stroke-width="2.5"/>
    <rect x="14" y="14" width="90" height="132" rx="3" fill="none" stroke="#F5C451" stroke-width="1" opacity=".7"/>
    <g transform="translate(59 80)"><path d="M0 -30 L9 -21 L21 -21 L21 -9 L30 0 L21 9 L21 21 L9 21 L0 30 L-9 21 L-21 21 L-21 9 L-30 0 L-21 -9 L-21 -21 L-9 -21Z" fill="#F5C451"/><circle r="15" fill="#1F6E58"/><circle r="9" fill="none" stroke="#F5C451" stroke-width="2"/></g>
    ${[[22, 22], [96, 22], [22, 138], [96, 138]].map(([x, y]) => `<path d="M${x} ${y - 6} L${x + 6} ${y} L${x} ${y + 6} L${x - 6} ${y}Z" fill="#F5C451"/>`).join("")}
    <rect x="110" y="2" width="8" height="156" rx="3" fill="#16503F"/>`),
  w5_stand: w5Svg("0 0 160 86", '<path d="M14 4 H146 L124 38 H36Z" fill="#9A6334"/><path d="M14 4 H146" stroke="#C98B52" stroke-width="4" stroke-linecap="round"/><rect x="70" y="38" width="20" height="38" fill="#7A4A24"/><rect x="36" y="74" width="88" height="10" rx="4" fill="#6A3E1C"/>'),
  w5_basket: w5Svg("0 0 100 64", '<path d="M8 20 H92 L82 59 Q81 63 77 63 H23 Q19 63 18 59Z" fill="#C98B52"/><path d="M14 32 H86 M17 44 H83 M20 54 H80" stroke="#A26A3A" stroke-width="3"/><path d="M30 20 L34 63 M50 20 V63 M70 20 L66 63" stroke="#A26A3A" stroke-width="3"/><rect x="3" y="14" width="94" height="10" rx="5" fill="#8E5A2E"/>'),
  w5_jar: w5Svg("0 0 80 100", `<defs><clipPath id="w5jarc"><path d="M14 26 Q8 30 8 40 V86 Q8 94 18 94 H62 Q72 94 72 86 V40 Q72 30 66 26Z"/></clipPath><linearGradient id="w5jl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF3B0"/><stop offset="1" stop-color="#F5C451"/></linearGradient></defs>
    <rect class="w5jfill" x="0" y="94" width="80" height="0" fill="url(#w5jl)" clip-path="url(#w5jarc)"/>
    <path d="M14 26 Q8 30 8 40 V86 Q8 94 18 94 H62 Q72 94 72 86 V40 Q72 30 66 26Z" fill="rgba(255,255,255,.28)" stroke="#9EC3D2" stroke-width="3"/>
    <rect x="16" y="14" width="48" height="14" rx="4" fill="#C98B52"/><path d="M18 40 V80" stroke="#fff" stroke-width="4" opacity=".55" stroke-linecap="round"/>`),
  w5_rug: w5Svg("0 0 60 100", `<path d="M10 6 V0 M18 6 V0 M26 6 V0 M34 6 V0 M42 6 V0 M50 6 V0 M10 100 V94 M18 100 V94 M26 100 V94 M34 100 V94 M42 100 V94 M50 100 V94" stroke="#E9D3A0" stroke-width="2"/>
    <rect x="4" y="6" width="52" height="88" rx="3" fill="#B03A3A"/><rect x="9" y="11" width="42" height="78" rx="2" fill="none" stroke="#F5C451" stroke-width="2.5"/>
    <path d="M16 84 V38 Q16 22 30 16 Q44 22 44 38 V84Z" fill="#7A2626"/><path d="M30 26 L34 32 L30 38 L26 32Z" fill="#F5C451"/><path d="M20 84 H40" stroke="#F5C451" stroke-width="2"/>`),
  w5_kaaba: w5Svg("0 0 100 100", `<ellipse cx="50" cy="91" rx="46" ry="7" fill="#F4EFE4" opacity=".8"/><path d="M18 32 L62 32 L82 22 L38 22Z" fill="#2E2E33"/><rect x="18" y="32" width="44" height="58" fill="#141416"/>
    <path d="M62 32 L82 22 L82 80 L62 90Z" fill="#232327"/><rect x="18" y="42" width="44" height="7" fill="#D9A93A"/><path d="M62 42 L82 32 L82 39 L62 49Z" fill="#B98A2A"/><rect x="44" y="60" width="11" height="26" rx="1" fill="#D9A93A"/>`),
  w5_gate: w5Svg("0 0 120 90", `<circle cx="26" cy="46" r="20" fill="#5DAE4F"/><circle cx="94" cy="46" r="20" fill="#5DAE4F"/><circle cx="60" cy="30" r="26" fill="#6DBE59"/><circle cx="42" cy="22" r="14" fill="#7FC86A"/><circle cx="80" cy="24" r="14" fill="#7FC86A"/>
    <path d="M36 90 V50 Q36 26 60 20 Q84 26 84 50 V90Z" fill="#FFF3C4" opacity=".85"/><path d="M30 90 V48 Q30 18 60 10 Q90 18 90 48 V90" fill="none" stroke="#F5C451" stroke-width="8"/>
    <circle cx="60" cy="10" r="5" fill="#F5C451"/><rect x="22" y="84" width="76" height="6" rx="3" fill="#E6A93A"/>`),
  w5_thorn: w5Svg("0 0 48 40", '<path d="M4 38 Q6 18 24 14 Q42 18 44 38Z" fill="#6E7F5A"/><path d="M10 26 L4 20 M18 18 L14 8 M30 18 L34 8 M38 26 L45 20 M24 15 V5" stroke="#4E5C40" stroke-width="2.5" stroke-linecap="round"/>'),
  w5_sock: '<path d="M22 6 H40 V34 Q40 44 32 48 L18 54 Q8 56 8 48 Q8 42 16 39 L22 36Z" fill="#5BA9C9"/><rect x="22" y="6" width="18" height="8" fill="#F5C451"/><path d="M22 21 H40 M22 28 H40" stroke="#fff" stroke-width="3"/>',
  w5_boot: '<path d="M14 8 H32 V36 L48 40 Q54 42 54 48 V50 H10 V8Z" fill="#8E5A2E"/><rect x="10" y="48" width="44" height="7" rx="2" fill="#5D3B22"/><path d="M14 16 H32" stroke="#C98B52" stroke-width="3"/><circle cx="26" cy="26" r="2" fill="#F5C451"/><circle cx="26" cy="34" r="2" fill="#F5C451"/>',
  w5_day: '<rect x="3" y="3" width="54" height="54" rx="8" fill="#BFE6F7"/><circle cx="30" cy="30" r="11" fill="#F7B32B"/>' + [0, 45, 90, 135, 180, 225, 270, 315].map(a => `<path d="M30 9 V14" stroke="#F7B32B" stroke-width="3" stroke-linecap="round" transform="rotate(${a} 30 30)"/>`).join(""),
  w5_night: '<rect x="3" y="3" width="54" height="54" rx="8" fill="#1B3358"/><path d="M33 13 A17 17 0 1 0 47 38 A13 13 0 1 1 33 13Z" fill="#F5D77A"/><circle cx="16" cy="16" r="1.6" fill="#fff"/><circle cx="44" cy="18" r="1.3" fill="#fff"/><circle cx="18" cy="46" r="1.2" fill="#fff"/>',
  w5_leaf: '<path d="M10 50 Q10 14 50 10 Q48 48 10 50Z" fill="#6DBE59"/><path d="M12 48 Q28 30 46 12" stroke="#3F8A3B" stroke-width="2.5" fill="none"/>',
  w5_pot: w5Svg("0 0 80 90", `<path d="M22 62 H58 L54 88 H26Z" fill="#C0653A"/><rect x="18" y="56" width="44" height="9" rx="3" fill="#A9542F"/>
    <g class="w5head"><path d="M40 58 V30" stroke="#4E9D45" stroke-width="4"/><path d="M40 46 Q28 40 26 32 Q36 34 40 44Z M40 50 Q52 44 54 36 Q44 38 40 48Z" fill="#5DAE4F"/>
    <g transform="translate(40 22)">${[0, 72, 144, 216, 288].map(a => `<ellipse cx="0" cy="-9" rx="6" ry="9" fill="#F28AB0" transform="rotate(${a})"/>`).join("")}<circle r="6" fill="#F5C451"/></g></g>`),
  w5_phone: w5Svg("0 0 60 90", '<rect x="8" y="4" width="44" height="82" rx="8" fill="#2E3A44"/><rect class="w5scr" x="12" y="12" width="36" height="62" rx="3" fill="#7FD3F5"/><circle cx="30" cy="80" r="3" fill="#56636D"/><rect x="20" y="36" width="18" height="11" rx="2" fill="none" stroke="#fff" stroke-width="2"/><rect x="38" y="39" width="3" height="5" fill="#fff"/><rect class="w5bat" x="22" y="38" width="14" height="7" fill="#fff"/>'),
  w5_car: w5Svg("0 0 100 60", '<path d="M8 40 Q8 30 18 30 L30 30 L40 16 H66 L78 30 H88 Q94 30 94 38 V44 H8Z" fill="#E8584C"/><path d="M44 20 H64 L72 30 H40Z" fill="#BFE6F7"/><circle cx="28" cy="46" r="9" fill="#2E3A44"/><circle cx="28" cy="46" r="4" fill="#B7C6CC"/><circle cx="76" cy="46" r="9" fill="#2E3A44"/><circle cx="76" cy="46" r="4" fill="#B7C6CC"/><rect x="86" y="33" width="6" height="4" rx="1" fill="#FFE29A"/>'),
  w5_wheat: w5Svg("0 0 70 100", [[20, -12], [35, 0], [50, 12]].map(([x, a]) => `<g transform="rotate(${a} ${x} 98)"><path d="M${x} 98 V28" stroke="#C9A04A" stroke-width="3"/>${[0, 1, 2, 3, 4].map(i => `<ellipse cx="${x - 4}" cy="${34 + i * 8}" rx="3.5" ry="6" fill="#E7C76A" transform="rotate(-25 ${x - 4} ${34 + i * 8})"/><ellipse cx="${x + 4}" cy="${34 + i * 8}" rx="3.5" ry="6" fill="#E7C76A" transform="rotate(25 ${x + 4} ${34 + i * 8})"/>`).join("")}<ellipse cx="${x}" cy="26" rx="3" ry="6" fill="#E7C76A"/></g>`).join("")),
  w5_bush: w5Svg("0 0 90 80", `<path d="M42 78 V60 M48 78 V62" stroke="#7A4A24" stroke-width="4"/><circle cx="26" cy="48" r="20" fill="#4E9D45"/><circle cx="64" cy="48" r="20" fill="#4E9D45"/><circle cx="45" cy="32" r="24" fill="#5DAE4F"/>
    ${[[24, 44], [34, 54], [56, 30], [66, 50], [46, 44], [36, 26], [58, 58], [16, 54]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="4.2" fill="#D63B5A"/><circle cx="${x - 1.3}" cy="${y - 1.3}" r="1.2" fill="#fff" opacity=".6"/>`).join("")}`),
  w5_jam: w5Svg("0 0 60 70", '<rect x="10" y="20" width="40" height="46" rx="8" fill="#C23B4E"/><rect x="14" y="26" width="7" height="30" rx="3.5" fill="#fff" opacity=".3"/><path d="M6 16 Q30 6 54 16 L50 24 H10Z" fill="#F3E3C4"/><path d="M10 22 Q14 28 18 22 Q22 28 26 22 Q30 28 34 22 Q38 28 42 22 Q46 28 50 22" fill="none" stroke="#E2C9A0" stroke-width="2"/><rect x="18" y="38" width="24" height="15" rx="3" fill="#FFF8EA"/><circle cx="30" cy="45" r="4" fill="#D63B5A"/>'),
  w5_melon: w5Svg("0 0 70 50", '<ellipse cx="35" cy="26" rx="32" ry="22" fill="#3F8E46"/><path d="M14 11 Q22 26 14 41 M27 5 Q33 26 27 47 M43 5 Q37 26 43 47 M56 11 Q48 26 56 41" stroke="#2E6B35" stroke-width="4" fill="none"/><ellipse cx="24" cy="16" rx="8" ry="4" fill="#fff" opacity=".2"/>'),
  w5_cherry: w5Svg("0 0 48 48", '<path d="M24 6 Q20 20 14 30 M24 6 Q28 20 34 32" stroke="#4E9D45" stroke-width="2.5" fill="none"/><path d="M24 6 Q32 4 36 8 Q30 10 24 6Z" fill="#5DAE4F"/><circle cx="14" cy="34" r="8" fill="#C62F3E"/><circle cx="34" cy="36" r="8" fill="#C62F3E"/><circle cx="11" cy="31" r="2.5" fill="#fff" opacity=".6"/><circle cx="31" cy="33" r="2.5" fill="#fff" opacity=".6"/>'),
  w5_cube: w5Svg("0 0 50 50", '<path d="M8 18 L25 10 L42 18 L25 26Z" fill="#E9B26A"/><path d="M8 18 L25 26 V44 L8 36Z" fill="#C98B52"/><path d="M42 18 L25 26 V44 L42 36Z" fill="#A26A3A"/>'),
  w5_pebble: w5Svg("0 0 40 26", '<ellipse cx="20" cy="15" rx="15" ry="10" fill="#9AA8AF"/><ellipse cx="15" cy="11" rx="5" ry="3" fill="#C7D1D5"/>'),
  w5_umb: w5Svg("0 0 120 96", '<path d="M60 40 V84 Q60 92 52 92 Q44 92 44 84" fill="none" stroke="#5D3B22" stroke-width="5" stroke-linecap="round"/><path d="M4 44 Q8 6 60 4 Q112 6 116 44 Q102 36 88 44 Q74 36 60 44 Q46 36 32 44 Q18 36 4 44Z" fill="#2B8FB8"/><path d="M60 4 Q40 20 32 44 M60 4 Q80 20 88 44 M60 4 V44" stroke="#1C6E90" stroke-width="2" fill="none"/><circle cx="60" cy="4" r="3" fill="#1C6E90"/>'),
  w5_window: w5Svg("0 0 90 90", '<rect x="2" y="2" width="86" height="86" rx="6" fill="#8E5A2E"/><rect x="9" y="9" width="72" height="72" rx="3" fill="#13284A"/><path d="M54 20 A12 12 0 1 0 66 40 A10 10 0 1 1 54 20Z" fill="#FFE29A"/><circle cx="22" cy="22" r="1.5" fill="#fff"/><circle cx="30" cy="60" r="1.2" fill="#fff"/><circle cx="66" cy="66" r="1.4" fill="#fff"/><path d="M45 9 V81 M9 45 H81" stroke="#8E5A2E" stroke-width="5"/>'),
  w5_bed: w5Svg("0 0 170 90", '<rect x="4" y="10" width="14" height="76" rx="4" fill="#8E5A2E"/><rect x="152" y="40" width="14" height="46" rx="4" fill="#8E5A2E"/><rect x="14" y="52" width="146" height="20" rx="4" fill="#A26A3A"/><rect x="16" y="40" width="142" height="16" rx="6" fill="#F3F0E8"/><rect x="22" y="28" width="40" height="18" rx="8" fill="#FFFFFF"/><path d="M58 38 H156 V62 Q110 70 58 62Z" fill="#5BA9C9"/><path d="M66 46 H150" stroke="#F5C451" stroke-width="3"/>'),
  w5_ball: w5Svg("0 0 50 50", '<circle cx="25" cy="25" r="22" fill="#E8584C"/><path d="M3 25 H47" stroke="#fff" stroke-width="4"/><path d="M25 3 Q36 25 25 47" stroke="#F5C451" stroke-width="4" fill="none"/>'),
  w5_slippers: w5Svg("0 0 70 44", '<ellipse cx="20" cy="24" rx="13" ry="18" fill="#B98AD8" transform="rotate(-10 20 24)"/><path d="M9 18 Q20 10 31 16" stroke="#7E5AA6" stroke-width="7" fill="none" stroke-linecap="round"/><ellipse cx="50" cy="22" rx="13" ry="18" fill="#B98AD8" transform="rotate(10 50 22)"/><path d="M39 14 Q50 8 61 16" stroke="#7E5AA6" stroke-width="7" fill="none" stroke-linecap="round"/>'),
  w5_knot: w5Svg("0 0 60 60", '<path d="M2 30 C16 30 20 12 31 14 C44 16 41 35 30 37 C19 39 17 22 30 20 C41 18 44 30 58 30" fill="none" stroke="#7A4A24" stroke-width="9" stroke-linecap="round"/><path d="M2 30 C16 30 20 12 31 14 C44 16 41 35 30 37 C19 39 17 22 30 20 C41 18 44 30 58 30" fill="none" stroke="#C98B52" stroke-width="5" stroke-linecap="round"/>'),
  w5_kring: w5Svg("0 0 100 100", '<circle cx="50" cy="50" r="44" fill="none" stroke="rgba(255,255,255,.25)" stroke-width="6"/><circle class="w5kr" cx="50" cy="50" r="44" fill="none" stroke="#FFD54F" stroke-width="6" stroke-linecap="round" stroke-dasharray="276.5" stroke-dashoffset="276.5" transform="rotate(-90 50 50)"/>'),
  w5_bike: w5Svg("0 0 100 64", '<circle cx="22" cy="44" r="16" fill="none" stroke="#2E3A44" stroke-width="4"/><circle cx="78" cy="44" r="16" fill="none" stroke="#2E3A44" stroke-width="4"/><path d="M22 44 L40 22 H66 L78 44 M40 22 L50 44 L66 22 M50 44 H22" stroke="#E8584C" stroke-width="4" fill="none" stroke-linejoin="round"/><path d="M34 16 H46" stroke="#2E3A44" stroke-width="4" stroke-linecap="round"/><path d="M66 22 L62 12 H72" stroke="#2E3A44" stroke-width="3.5" fill="none" stroke-linecap="round"/>'),
  w5_pic: w5Svg("0 0 90 70", '<rect x="3" y="3" width="84" height="64" rx="4" fill="#C98B52"/><rect x="10" y="10" width="70" height="50" fill="#BFE6F7"/><path d="M10 48 Q30 34 46 44 Q62 32 80 42 V60 H10Z" fill="#7DC46D"/><circle cx="64" cy="22" r="6" fill="#F7B32B"/><path d="M20 30 L28 18 L36 30Z" fill="#8FA6B5"/>'),
  w5_garden: w5Svg("0 0 90 70", `<path d="M0 58 Q45 50 90 58 V70 H0Z" fill="#7DC46D"/><rect x="62" y="28" width="5" height="30" fill="#8E5A2E"/><circle cx="64" cy="22" r="14" fill="#5DAE4F"/><circle cx="58" cy="20" r="2.5" fill="#E8463C"/><circle cx="70" cy="26" r="2.5" fill="#E8463C"/>
    ${[[10, 60, "#F28AB0"], [22, 62, "#F5C451"], [34, 60, "#E8584C"], [46, 62, "#B98AD8"], [82, 62, "#F28AB0"]].map(([x, y, c]) => w5Flower(x, y, c)).join("")}`),
  w5_heart: w5Svg("0 0 100 90", '<defs><linearGradient id="w5hg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FF9DB0"/><stop offset="1" stop-color="#E8455E"/></linearGradient></defs><path d="M50 84 C18 62 4 46 6 28 C8 12 22 4 34 6 C42 7 47 12 50 18 C53 12 58 7 66 6 C78 4 92 12 94 28 C96 46 82 62 50 84Z" fill="url(#w5hg)"/><ellipse cx="28" cy="24" rx="8" ry="5" fill="#fff" opacity=".45" transform="rotate(-30 28 24)"/>'),
  w5_heartfill: w5Svg("0 0 100 90", '<defs><clipPath id="w5hc"><path d="M50 84 C18 62 4 46 6 28 C8 12 22 4 34 6 C42 7 47 12 50 18 C53 12 58 7 66 6 C78 4 92 12 94 28 C96 46 82 62 50 84Z"/></clipPath><linearGradient id="w5hfg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF3B0"/><stop offset="1" stop-color="#F5C451"/></linearGradient></defs><path d="M50 84 C18 62 4 46 6 28 C8 12 22 4 34 6 C42 7 47 12 50 18 C53 12 58 7 66 6 C78 4 92 12 94 28 C96 46 82 62 50 84Z" fill="rgba(255,255,255,.18)"/><rect class="w5hf" x="0" y="90" width="100" height="0" fill="url(#w5hfg)" clip-path="url(#w5hc)"/><path d="M50 84 C18 62 4 46 6 28 C8 12 22 4 34 6 C42 7 47 12 50 18 C53 12 58 7 66 6 C78 4 92 12 94 28 C96 46 82 62 50 84Z" fill="none" stroke="#FFE7A0" stroke-width="4"/>'),
  w5_mosq: w5Svg("0 0 40 40", '<path d="M8 37 V23 Q8 13 20 9 Q32 13 32 23 V37Z" fill="currentColor"/><rect x="33" y="11" width="4" height="26" fill="currentColor"/><path d="M33 11 L35 4 L37 11Z" fill="currentColor"/><path d="M20 9 V3" stroke="currentColor" stroke-width="2"/><path d="M16 37 V29 a4 4 0 0 1 8 0 V37Z" fill="#0B1A33" opacity=".5"/>'),
  w5_world: w5Svg("0 0 400 200", `<g fill="#79C46A" stroke="#5DA650" stroke-width="2">
    <path d="M40 40 Q70 28 92 48 Q98 68 82 82 Q74 94 84 108 Q96 128 88 158 Q80 176 70 168 Q62 140 56 120 Q44 100 50 84 Q32 66 40 40Z"/>
    <path d="M118 22 Q136 16 142 28 Q134 40 120 34Z"/>
    <path d="M180 44 Q204 34 222 46 Q226 60 214 66 Q228 80 230 100 Q234 128 216 150 Q204 162 198 146 Q190 120 184 104 Q170 92 176 76 Q166 60 180 44Z"/>
    <path d="M232 40 Q270 24 320 36 Q352 44 348 70 Q338 88 314 86 Q300 100 284 96 Q264 104 252 90 Q238 80 242 64 Q228 56 232 40Z"/>
    <path d="M308 128 Q330 118 348 128 Q358 146 340 154 Q320 158 308 146Z"/><path d="M290 108 Q300 104 306 112 Q300 118 290 114Z"/></g>
    <path d="M0 192 Q100 184 200 192 T400 192 V200 H0Z" fill="#EEF6FA"/><path d="M0 6 Q100 12 200 6 T400 6 V0 H0Z" fill="#EEF6FA"/>`)
});
/* Пять «миров» для аята «Господь миров»: от сада до звёзд */
const W5_WORLDS = [
  w5Svg("0 0 200 200", `<defs><linearGradient id="w5v1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7EC8EE"/><stop offset="1" stop-color="#DDF2FA"/></linearGradient></defs>
    <rect width="200" height="200" fill="url(#w5v1)"/><circle cx="150" cy="50" r="15" fill="#FFD66B"/>
    <path d="M0 128 Q60 104 120 120 T200 116 V200 H0Z" fill="#8CCB72"/><path d="M0 150 Q90 132 200 150 V200 H0Z" fill="#6BB65E"/>
    <rect x="42" y="96" width="8" height="40" fill="#8E5A2E"/><circle cx="46" cy="88" r="20" fill="#4E9D45"/><circle cx="33" cy="98" r="12" fill="#5DAE4F"/><circle cx="59" cy="98" r="12" fill="#5DAE4F"/>
    <circle cx="40" cy="84" r="3" fill="#E8463C"/><circle cx="54" cy="94" r="3" fill="#E8463C"/><circle cx="46" cy="76" r="3" fill="#E8463C"/>
    <path d="M118 116 L138 98 L158 116Z" fill="#C0533A"/><rect x="122" y="116" width="32" height="24" fill="#F3E3C4"/><rect x="134" y="126" width="8" height="14" fill="#8E5A2E"/><rect x="125" y="120" width="7" height="6" fill="#FFD98A"/>
    ${[[20, 172, "#F28AB0"], [38, 180, "#F5C451"], [70, 170, "#E8584C"], [96, 178, "#B98AD8"], [128, 172, "#F28AB0"], [156, 180, "#F5C451"], [182, 170, "#E8584C"]].map(([x, y, c]) => w5Flower(x, y, c)).join("")}`),
  w5Svg("0 0 200 200", `<defs><linearGradient id="w5v2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8FD0F2"/><stop offset="1" stop-color="#E6F6FC"/></linearGradient></defs>
    <rect width="200" height="200" fill="url(#w5v2)"/><circle cx="40" cy="40" r="13" fill="#FFD66B"/>
    <path d="M0 118 L34 70 L58 96 L96 44 L136 100 L166 72 L200 96 V126 H0Z" fill="#8FA6B5"/>
    <path d="M96 44 L84 62 L94 58 L100 66 L108 57Z M34 70 L26 82 L34 79 L40 84Z M166 72 L158 83 L166 80 L172 85Z" fill="#fff"/>
    <rect y="122" width="200" height="78" fill="#3C9CC8"/>
    <path d="M0 136 Q12 130 24 136 T48 136 T72 136 T96 136 T120 136 T144 136 T168 136 T192 136 M0 156 Q12 150 24 156 T48 156 T72 156 T96 156 T120 156 T144 156 T168 156 T192 156" stroke="#8ED0EE" stroke-width="2.5" fill="none"/>
    <g transform="translate(118 112) scale(.55)">${ICON.sail}</g><path d="M0 178 Q60 160 120 172 T200 168 V200 H0Z" fill="#EBD3A0"/>`),
  w5Svg("0 0 200 200", `<defs><radialGradient id="w5v3" cx=".4" cy=".35" r=".7"><stop offset="0" stop-color="#5FBDF0"/><stop offset="1" stop-color="#1F6FAE"/></radialGradient><clipPath id="w5v3c"><circle cx="100" cy="100" r="62"/></clipPath>
    <radialGradient id="w5v3s" cx=".35" cy=".3" r=".75"><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#001020" stop-opacity=".55"/></radialGradient></defs>
    <rect width="200" height="200" fill="#0B1A33"/>${w5Dots(40)}<circle cx="100" cy="100" r="69" fill="#7FC4F0" opacity=".18"/><circle cx="100" cy="100" r="62" fill="url(#w5v3)"/>
    <g clip-path="url(#w5v3c)" fill="#6DBE59"><path d="M58 64 Q72 50 92 56 Q104 62 100 78 Q96 92 80 90 Q72 104 60 98 Q48 84 58 64Z"/><path d="M108 108 Q124 98 140 110 Q150 124 138 140 Q124 150 112 138 Q100 124 108 108Z"/><path d="M118 58 Q134 50 152 62 Q158 76 146 84 Q132 86 122 78Z"/><path d="M62 116 Q76 110 84 124 Q88 140 76 152 Q64 146 62 132Z"/></g>
    <g clip-path="url(#w5v3c)" stroke="#fff" stroke-width="4" fill="none" opacity=".55" stroke-linecap="round"><path d="M44 86 Q80 76 112 88"/><path d="M92 128 Q120 120 152 132"/><path d="M58 142 Q78 138 94 144"/></g>
    <circle cx="100" cy="100" r="62" fill="url(#w5v3s)"/><circle cx="168" cy="44" r="7" fill="#E9E5D8"/>`),
  w5Svg("0 0 200 200", `<defs><radialGradient id="w5v4" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#FFF6C9"/><stop offset=".6" stop-color="#FFC94A"/><stop offset="1" stop-color="#F59A2B"/></radialGradient></defs>
    <rect width="200" height="200" fill="#0B1A33"/>${w5Dots(50)}
    <g fill="none" stroke="#6F86A8" stroke-width="1" opacity=".6"><circle cx="100" cy="100" r="30"/><circle cx="100" cy="100" r="46"/><circle cx="100" cy="100" r="62"/><circle cx="100" cy="100" r="80"/></g>
    <circle cx="100" cy="100" r="24" fill="#FFC94A" opacity=".25"/><circle cx="100" cy="100" r="15" fill="url(#w5v4)"/>
    <circle cx="128" cy="110" r="3" fill="#B9A88E"/><circle cx="57" cy="84" r="4.5" fill="#E8B86A"/><circle cx="131" cy="46" r="5" fill="#4DA3E0"/><circle cx="129" cy="45" r="1.8" fill="#6DBE59"/><circle cx="60" cy="169" r="4" fill="#D9665B"/>`),
  w5Svg("0 0 200 200", `<defs><radialGradient id="w5v5" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#FFF6DD" stop-opacity=".95"/><stop offset=".4" stop-color="#C9B8F0" stop-opacity=".35"/><stop offset="1" stop-color="#0B1A33" stop-opacity="0"/></radialGradient></defs>
    <rect width="200" height="200" fill="#070F22"/>${w5Dots(60)}<ellipse cx="100" cy="100" rx="70" ry="50" fill="url(#w5v5)"/>
    <g fill="#FFF6DD">${(() => { let d = ""; for (let arm = 0; arm < 2; arm++) for (let i = 0; i < 80; i++) { const t = i / 80 * 3.4 * Math.PI, r = 6 + t * 7.4, a = t + arm * Math.PI; d += `<circle cx="${(100 + r * Math.cos(a) + rnd(-4, 4)).toFixed(1)}" cy="${(100 + r * Math.sin(a) * 0.7 + rnd(-3, 3)).toFixed(1)}" r="${rnd(0.6, 1.8).toFixed(1)}" opacity="${rnd(0.5, 1).toFixed(2)}"/>`; } return d; })()}</g>`)
];

Object.assign(ICON, {
  w5_fatiha: '<path d="M24 12 Q14 6 4 9 V36 Q14 33 24 38Z" fill="#1F6E58"/><path d="M24 12 Q34 6 44 9 V36 Q34 33 24 38Z" fill="#257D64"/><path d="M24 12 V38" stroke="#F5C451" stroke-width="2"/><path d="M8 17 Q14 15 20 17 M8 22 Q14 20 20 22 M8 27 Q14 25 20 27 M28 17 Q34 15 40 17 M28 22 Q34 20 40 22 M28 27 Q34 25 40 27" stroke="#F5C451" stroke-width="1.6" fill="none"/><path d="M10 45 L24 37 L38 45" stroke="#8E5A2E" stroke-width="3.5" fill="none" stroke-linecap="round"/>',
  w5_ikhlas: '<path d="M24 4 L38 16 L33 44 H15 L10 16Z" fill="#BFE6F7" stroke="#4E9FC4" stroke-width="2"/><path d="M10 16 H38 M24 4 L18 16 L24 44 L30 16Z" fill="none" stroke="#4E9FC4" stroke-width="1.5"/><path d="M15 19 L18 36" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/>',
  w5_falaq: '<path d="M2 34 H46" stroke="#5DAE4F" stroke-width="5"/><path d="M11 32 A13 13 0 0 1 37 32Z" fill="#F7B32B"/>' + [-60, -30, 0, 30, 60].map(a => `<path d="M24 14 V8" stroke="#F7B32B" stroke-width="3" stroke-linecap="round" transform="rotate(${a} 24 32)"/>`).join("") + '<path d="M6 42 H42" stroke="#7DC46D" stroke-width="3"/>',
  w5_nas: '<path d="M24 4 L41 10 V23 Q41 37 24 45 Q7 37 7 23 V10Z" fill="#1F5B74" stroke="#F5C451" stroke-width="3"/><path d="M24 14 L26.6 20.4 L33.5 21 L28.2 25.4 L29.8 32 L24 28.4 L18.2 32 L19.8 25.4 L14.5 21 L21.4 20.4Z" fill="#F5C451"/>',
  w5_map: '<path d="M4 12 L16 7 L32 13 L44 8 V36 L32 41 L16 35 L4 40Z" fill="#F3E3C4" stroke="#C9A86A" stroke-width="2" stroke-linejoin="round"/><path d="M16 7 V35 M32 13 V41" stroke="#C9A86A" stroke-width="1.5"/><path d="M9 30 Q16 20 24 26 T38 18" stroke="#E8584C" stroke-width="2.5" fill="none" stroke-dasharray="3 3"/>',
  w5_umb: '<path d="M24 22 V40 Q24 44 20 44 Q16 44 16 40" fill="none" stroke="#5D3B22" stroke-width="3" stroke-linecap="round"/><path d="M4 24 Q6 6 24 5 Q42 6 44 24 Q38 20 34 24 Q29 20 24 24 Q19 20 14 24 Q9 20 4 24Z" fill="#2B8FB8"/>',
  w5_torch: '<path d="M28 18 L46 8 V40 L28 30Z" fill="#FFE7A0" opacity=".9"/><rect x="4" y="19" width="16" height="10" rx="3" fill="#4F6F7C"/><path d="M20 16 H26 Q29 16 29 19 V29 Q29 32 26 32 H20Z" fill="#2E3A44"/><rect x="9" y="21" width="5" height="3" rx="1" fill="#E8584C"/>',
  w5_blanket: '<rect x="4" y="12" width="40" height="26" rx="6" fill="#5BA9C9"/><path d="M4 22 H44 M4 30 H44" stroke="#F5C451" stroke-width="3"/><rect x="8" y="8" width="14" height="10" rx="5" fill="#FFF8EA"/>',
  w5_run: '<path d="M14 44 L22 6 M34 44 L26 6" stroke="#9AA8AF" stroke-width="3"/><path d="M24 40 V32 M24 26 V20 M24 14 V10" stroke="#F5C451" stroke-width="3"/><path d="M36 22 H46 M41 17 L46 22 L41 27" stroke="#E8584C" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>',
  w5_salam: '<path d="M8 8 H40 Q45 8 45 13 V29 Q45 34 40 34 H20 L12 42 V34 H8 Q3 34 3 29 V13 Q3 8 8 8Z" fill="#5BA9C9"/><text x="24" y="25" text-anchor="middle" font-size="10.5" font-weight="900" fill="#fff" font-family="Nunito, sans-serif">салям</text>',
  w5_heart: '<path d="M24 41 C8 29 4 21 7 14 C10 7 20 7 24 14 C28 7 38 7 41 14 C44 21 40 29 24 41Z" fill="#E8584C"/>',
  w5_bread: '<ellipse cx="24" cy="28" rx="19" ry="11" fill="#D9984E"/><ellipse cx="24" cy="25" rx="15" ry="8" fill="#E9B26A"/><path d="M15 23 q3-3 6 0 M22 21 q3-3 6 0 M29 23 q3-3 6 0" stroke="#B87532" stroke-width="2" fill="none" stroke-linecap="round"/>',
  w5_dates: '<ellipse cx="16" cy="26" rx="6" ry="10" fill="#8A4B1F" transform="rotate(-20 16 26)"/><ellipse cx="26" cy="24" rx="6" ry="10" fill="#9A5626"/><ellipse cx="35" cy="27" rx="6" ry="10" fill="#8A4B1F" transform="rotate(18 35 27)"/>',
  w5_toys: '<rect x="8" y="22" width="32" height="20" rx="3" fill="#C98B52"/><rect x="6" y="17" width="36" height="7" rx="2" fill="#A26A3A"/><circle cx="18" cy="13" r="6" fill="#E8584C"/><rect x="26" y="6" width="10" height="10" rx="1" fill="#5BA9C9"/>',
  w5_fuel: '<rect x="12" y="13" width="24" height="30" rx="3" fill="#3FA66A"/><path d="M16 13 V8 H28 L32 13" fill="none" stroke="#3FA66A" stroke-width="3"/><path d="M18 24 H30" stroke="#fff" stroke-width="3"/>'
});

/* Сокровища мира 5 */
ITEMS.push(
  { id: "w5key", name: "Золотой ключ", svg: '<circle cx="28" cy="50" r="19" fill="none" stroke="#E6A93A" stroke-width="9"/><circle cx="28" cy="50" r="7" fill="#F5C451"/><rect x="45" y="45" width="47" height="10" rx="4" fill="#E6A93A"/><rect x="74" y="54" width="7" height="15" rx="2" fill="#E6A93A"/><rect x="85" y="54" width="7" height="10" rx="2" fill="#E6A93A"/><path d="M50 47 H88" stroke="#FFE7A0" stroke-width="2.5" stroke-linecap="round"/>' },
  { id: "w5crystal", name: "Чистый кристалл", svg: '<path d="M50 6 L82 32 L70 92 H30 L18 32Z" fill="#BFE6F7" stroke="#4E9FC4" stroke-width="3" stroke-linejoin="round"/><path d="M18 32 H82 M50 6 L37 32 L50 92 L63 32Z" fill="none" stroke="#4E9FC4" stroke-width="2"/><path d="M29 36 L35 72" stroke="#fff" stroke-width="5" opacity=".75" stroke-linecap="round"/>' },
  { id: "w5dawn", name: "Рассвет", svg: '<defs><clipPath id="w5dawnc"><rect x="0" y="0" width="100" height="64"/></clipPath></defs><circle cx="50" cy="64" r="46" fill="#FFE7B0" opacity=".65"/><circle cx="50" cy="64" r="25" fill="#F7B32B" clip-path="url(#w5dawnc)"/>' + [-60, -30, 0, 30, 60].map(a => `<path d="M50 30 V18" stroke="#F7B32B" stroke-width="6" stroke-linecap="round" transform="rotate(${a} 50 64)"/>`).join("") + '<path d="M4 64 H96" stroke="#5DAE4F" stroke-width="6" stroke-linecap="round"/><path d="M14 76 H86" stroke="#7DC46D" stroke-width="5" stroke-linecap="round"/>' },
  { id: "w5shield", name: "Щит", svg: '<path d="M50 6 L86 18 V46 Q86 76 50 94 Q14 76 14 46 V18Z" fill="#1F5B74" stroke="#F5C451" stroke-width="5" stroke-linejoin="round"/><path d="M50 28 L55.5 41.5 L70 42.5 L59 52 L62.5 66 L50 58.5 L37.5 66 L41 52 L30 42.5 L44.5 41.5Z" fill="#F5C451"/>' }
);

/* ============ СТИЛИ МИРА 5 ============ */
addCSS(`
.w5rb{position:absolute;z-index:26;left:10px;right:10px;bottom:calc(env(safe-area-inset-bottom,0px) + 8px);max-width:560px;margin:0 auto;padding:7px 10px;border-radius:20px;background:rgba(251,241,220,.95);box-shadow:0 8px 20px -8px rgba(0,0,0,.4);border:1.5px solid rgba(245,196,81,.7);transition:opacity .4s}
.w5rb.off{opacity:0;pointer-events:none}
.w5beads{display:flex;justify-content:center;gap:6px;flex-wrap:wrap}
.w5beads i{width:28px;height:28px;border-radius:50%;display:grid;place-items:center;font-style:normal;font-family:"Amiri",serif;font-size:17px;line-height:1;padding-top:3px;background:#E9DFC8;color:#8A7A58;transition:background .3s,transform .3s,color .3s}
.w5beads i.cur{background:#1F5B74;color:#F5C451;transform:scale(1.15)}
.w5beads i.done{background:linear-gradient(180deg,#FFD978,#E6A93A);color:#3B2A0C}
.w5ayl{display:flex;align-items:center;gap:8px;margin-top:6px}
.w5rb.mini .w5ayl{display:none}
.w5ar{margin:0;flex:1;font-family:"Amiri",serif;font-size:clamp(19px,5vw,24px);line-height:1.75;color:#12313F;text-align:center}
.w5play{flex:none;width:40px;height:40px;border-radius:50%;background:linear-gradient(180deg,#2B6E8A,#1C5169);color:#fff;font-size:14px}
.w5lbl{position:absolute;translate:-50% -50%;pointer-events:none;font-weight:900;color:#fff;font-size:18px;text-shadow:0 2px 8px rgba(0,0,0,.5);white-space:nowrap;z-index:14;text-align:center}
.w5lbl.pop{font-size:24px;color:#FFE7A0}
.w5lbl.big{font-size:clamp(32px,9.5vw,44px);color:#FFE7A0;line-height:1.1;padding:10px 18px;border-radius:20px;background:rgba(14,42,58,.72)}
.w5lbl.big small{display:block;font-size:17px;color:#fff}
.w5lbl.tag{font-size:14px;line-height:1.15;padding:5px 10px;border-radius:12px;background:rgba(14,42,58,.72);text-shadow:none}
.w5lbl.tag small{display:block;font-size:11.5px;color:#FFE7A0;font-weight:800}
.w5arrow{position:absolute;width:56px;height:56px;translate:-50% -50%;pointer-events:none;z-index:13}
.w5arrow svg{width:100%;height:100%;animation:w5nudge 1.1s ease-in-out infinite;filter:drop-shadow(0 2px 4px rgba(0,0,0,.4))}
@keyframes w5nudge{0%{transform:translateX(-12px);opacity:0}30%{opacity:1}100%{transform:translateX(14px);opacity:0}}
.obj.w5book{perspective:1100px}
.w5page{position:absolute;inset:0;border-radius:6px;background:linear-gradient(90deg,#FFF8E8,#FFF8E8 75%,#EFE2C4);box-shadow:inset 0 0 0 3px #E2C98F,inset 0 0 0 7px #FFF8E8,inset 0 0 0 8.5px #D9B86A,0 10px 20px -8px rgba(0,0,0,.5);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;padding:14px;text-align:center}
.w5page b{font-family:"Amiri",serif;font-size:clamp(15px,4.4vw,20px);color:#1F6E58;line-height:1.3;padding:2px 10px;border:1.5px solid #D9B86A;border-radius:10px}
.w5page p{margin:0;font-family:"Amiri",serif;font-size:clamp(17px,5vw,23px);line-height:1.6;color:#12313F}
.w5cover{position:absolute;inset:0;transform-origin:100% 50%;transform-style:preserve-3d}
.w5cover>svg{position:absolute;inset:0;width:100%;height:100%;backface-visibility:hidden;-webkit-backface-visibility:hidden;filter:drop-shadow(0 10px 12px rgba(0,0,0,.35))}
.w5cover>i{position:absolute;inset:0;border-radius:8px;background:linear-gradient(90deg,#1F6E58,#175A47);transform:rotateY(180deg);backface-visibility:hidden;-webkit-backface-visibility:hidden}
.obj.w5lens{border-radius:50%;box-shadow:0 0 0 5px #F5C451,0 0 34px rgba(245,196,81,.55)}
.w5lensin{position:absolute;inset:0;clip-path:circle(50%);overflow:hidden;border-radius:50%}
.w5view{position:absolute;inset:0;opacity:0}
.w5view svg{width:100%;height:100%;display:block}
.obj.w5fall svg{filter:drop-shadow(0 3px 4px rgba(0,0,0,.25))}
.obj.w5deed{display:flex;align-items:center;gap:6px;padding:0 10px 0 5px;border-radius:26px;background:#FFF8EA;box-shadow:0 4px 0 #E3D3AE,0 10px 16px -8px rgba(0,0,0,.35);font-weight:900;font-size:15px;color:#12313F;cursor:pointer;animation:w5float 2.8s ease-in-out infinite}
.obj.w5deed svg{width:36px;height:36px;flex:none}
.obj.w5deed span{line-height:1.1}
@media (max-width:400px){.obj.w5deed{font-size:14px;gap:4px}.obj.w5deed svg{width:30px;height:30px}}
@keyframes w5float{50%{transform:translateY(-5px)}}
.w5beam{position:absolute;top:0;width:70px;translate:-50% 0;transform-origin:50% 100%;background:linear-gradient(0deg,rgba(255,236,170,.95),rgba(255,236,170,0));pointer-events:none;z-index:7;filter:blur(3px);border-radius:35px}
.obj.w5ball i{position:absolute;inset:0;border-radius:50%;background:radial-gradient(circle at 40% 35%,#FFFBE6,#FFD54F 55%,#E6A93A);box-shadow:0 0 16px 6px rgba(255,214,90,.7)}
.obj.w5fog svg{filter:grayscale(1) brightness(.92);opacity:.88}
.obj.w5lan{display:grid;place-items:center;cursor:pointer}
.obj.w5lan svg{width:34px;height:50px}
.obj.w5lan.lit svg{filter:drop-shadow(0 0 10px rgba(255,214,90,.95))}
.obj.w5card{perspective:700px;cursor:pointer}
.w5cin{position:absolute;inset:0;transition:transform .45s;transform-style:preserve-3d}
.w5card.open .w5cin{transform:rotateY(180deg)}
.w5back,.w5face{position:absolute;inset:0;border-radius:14px;backface-visibility:hidden;-webkit-backface-visibility:hidden;display:grid;place-items:center;box-shadow:0 5px 0 rgba(0,0,0,.18)}
.w5back{background:linear-gradient(160deg,#2B6E8A,#1C5169);border:3px solid #F5C451}
.w5back svg{width:55%;height:55%}
.w5face{background:#FFF8EA;transform:rotateY(180deg);border:3px solid #E3D3AE}
.w5face svg{width:80%;height:80%}
.w5card.ok .w5face{border-color:#3FA66A;box-shadow:0 0 0 3px rgba(63,166,106,.45),0 0 18px rgba(245,196,81,.75)}
.obj.w5one{display:grid;place-items:center;border-radius:24px;background:rgba(14,42,58,.6);box-shadow:0 0 0 2px rgba(245,196,81,.75),0 0 40px rgba(245,196,81,.45)}
.w5one p{margin:0;font-family:"Amiri",serif;font-size:clamp(30px,9vw,44px);color:#FFE7A0;text-shadow:0 0 18px rgba(255,214,120,.8)}
.w5bar{position:absolute;translate:-50% 0;height:12px;border-radius:6px;background:rgba(18,49,63,.25);overflow:hidden;z-index:8;box-shadow:inset 0 0 0 1.5px rgba(255,255,255,.5)}
.w5bar i{position:absolute;left:0;top:0;bottom:0;border-radius:6px;background:#3FA66A;transition:background .3s}
.w5bar.low i{background:#D9665B}
.obj.w5need{cursor:pointer;transition:filter .4s}
.obj.w5need.low{filter:grayscale(.85) brightness(.9)}
.w5need .w5head{transform-box:fill-box;transform-origin:50% 100%;transition:transform .5s}
.w5need.low .w5head{transform:rotate(38deg)}
.w5need.low .w5scr{fill:#3A4650}
.w5need.low .w5bat{width:3px}
.obj.w5drag{cursor:grab;touch-action:none}
.obj.w5drag svg{filter:drop-shadow(0 4px 5px rgba(0,0,0,.25))}
.w5hail{position:absolute;width:12px;height:12px;translate:-50% -50%;border-radius:50%;background:radial-gradient(circle at 35% 35%,#fff,#CFE8F5 60%,#9CC7DD);pointer-events:none}
.w5fl{transform-box:fill-box;transform-origin:50% 100%}
.w5dark{position:absolute;inset:0;z-index:8;pointer-events:none}
.obj.w5found{z-index:9 !important;filter:drop-shadow(0 0 10px rgba(255,231,160,.95))}
.w5night{position:absolute;left:0;top:0;width:100%;height:100%;z-index:6;pointer-events:none}
.obj.w5env{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;border-radius:24px;background:#FFF8EA;box-shadow:0 6px 0 #E3D3AE,0 14px 24px -10px rgba(0,0,0,.4);padding:12px 16px;font-weight:900;font-size:17px;line-height:1.3;color:#12313F;text-align:center;touch-action:none}
.obj.w5env svg{width:120px;height:78px;flex:none}
.obj.w5env.gold{background:#FFF3CC;box-shadow:0 0 0 4px #F5C451,0 0 30px rgba(245,196,81,.8)}
.obj.w5globe{border-radius:50%;box-shadow:0 0 0 4px rgba(159,211,245,.35),0 0 44px rgba(120,190,240,.45)}
.w5globein{position:absolute;inset:0;clip-path:circle(50%);overflow:hidden;border-radius:50%;background:radial-gradient(circle at 40% 35%,#4DB0E0,#1F6FAE)}
.w5strip{position:absolute;left:0;top:0;height:100%;display:flex;will-change:transform}
.w5strip svg{height:100%;flex:none;display:block}
.w5shade{position:absolute;inset:0;background:radial-gradient(circle at 35% 30%,rgba(255,255,255,.28),rgba(255,255,255,0) 40%,rgba(0,20,40,.5) 88%)}
.w5mosq{position:absolute;width:30px;height:30px;translate:-50% -50%;color:#2B3A4A;transition:color .4s,filter .4s}
.w5mosq svg{width:100%;height:100%;display:block}
.w5mosq.lit{color:#FFD54F;filter:drop-shadow(0 0 8px #FFE7A0)}
.obj.w5bub{display:grid;place-items:center;border-radius:50%;text-align:center;padding:10px;font-weight:900;font-size:13px;line-height:1.15;color:#3E4660;background:radial-gradient(circle at 35% 30%,rgba(255,255,255,.88),rgba(206,200,226,.78) 45%,rgba(150,144,180,.72));box-shadow:inset 0 0 0 2px rgba(255,255,255,.6),0 6px 16px rgba(0,0,0,.25);cursor:pointer}
.obj.w5bub.sm{font-size:12px;color:#5E6680}
.obj.w5shbtn{display:flex;align-items:center;justify-content:center;gap:8px;border-radius:30px;background:linear-gradient(180deg,#FFD978,#F5C451 45%,#E6A93A);box-shadow:0 5px 0 #B9802A,0 12px 20px -8px rgba(185,128,42,.7);font-weight:900;font-size:18px;color:#3B2A0C;cursor:pointer;white-space:nowrap}
.obj.w5shbtn svg{width:34px;height:34px;flex:none}
.obj.w5shbtn.press{translate:-50% calc(-50% + 4px);box-shadow:0 1px 0 #B9802A}
.w5ring{position:absolute;translate:-50% -50%;border-radius:50%;border:5px solid rgba(255,224,140,.95);box-shadow:0 0 24px rgba(255,213,79,.7);pointer-events:none;z-index:12}
.obj.w5good{display:grid;place-items:center;border-radius:20px;background:#FFF3CC;box-shadow:0 4px 0 #E3C27A,0 10px 16px -8px rgba(0,0,0,.35);font-weight:900;font-size:16px;color:#5A3D0C;text-align:center;padding:0 8px}
.obj.w5adv{display:flex;align-items:center;justify-content:center;text-align:center;padding:14px;border-radius:22px;background:#FFF8EA;box-shadow:0 6px 0 #E3D3AE,0 14px 24px -10px rgba(0,0,0,.4);font-weight:900;font-size:17px;line-height:1.3;color:#12313F;touch-action:none}
.w5zone{position:absolute;display:grid;place-items:center;border-radius:20px;pointer-events:none;z-index:4}
.w5zone.no{background:rgba(217,102,91,.22);box-shadow:inset 0 0 0 3px rgba(217,102,91,.55)}
.w5zone.yes{background:rgba(63,166,106,.22);box-shadow:inset 0 0 0 3px rgba(63,166,106,.55)}
.w5zone svg{width:44px;height:44px}
`);

/* ============ ГЛАВА 1: АЛЬ-ФАТИХА (1:1-7) ============ */
/* 1:1 — закрытый Коран на подставке */
function w5BookScene(A) {
  const { W, H } = A;
  sky("linear-gradient(180deg,#173A4F 0%,#235069 55%,#3B6C82 100%)");
  const arch = el("div", "layer", stage, w5Svg("0 0 200 220", '<path d="M14 220 V100 Q14 30 100 8 Q186 30 186 100 V220Z" fill="#2C6680" opacity=".6"/><path d="M36 220 V108 Q36 50 100 30 Q164 50 164 108 V220Z" fill="#3A7A94" opacity=".45"/><path d="M100 30 V22" stroke="#F5C451" stroke-width="2"/><circle cx="100" cy="18" r="4" fill="#F5C451"/>', ' preserveAspectRatio="xMidYMax meet"'));
  arch.style.top = (H * 0.28) + "px"; arch.style.bottom = "0";
  const rug = el("div", "layer"); rug.style.bottom = "0"; rug.style.height = "15%";
  rug.style.background = "repeating-linear-gradient(90deg,#8E2F2F 0 26px,#A43A3A 26px 52px)"; rug.style.borderTop = "6px solid #F5C451";
  const bw = Math.min(W * 0.46, 180, (A.bot - A.top) * 0.5), bh = bw * 1.33, cy = A.mid - 18;
  const sw = bw * 1.1;
  const stand = obj("w5stand", ART.w5_stand, W / 2, cy + bh / 2 + sw / 1.86 / 2 - 6, sw, sw / 1.86); stand.style.zIndex = 4;
  const book = obj("w5book", `<div class="w5page"><b lang="ar" dir="rtl">${W5_NAMES["1"]}</b><p lang="ar" dir="rtl">${AYAT["1:1-7"].parts[0].ar}</p></div><div class="w5cover">${ART.w5_cover}<i></i></div>`, W / 2, cy, bw, bh);
  book.style.zIndex = 5;
  Snd.amb("wind", 0.3);
  return { book, stand };
}
function w5OpenBook(o, A) {
  const { book, stand } = o, cover = book.querySelector(".w5cover"), bw = book.offsetWidth, x0 = book._x;
  const arrow = w5Arrow(x0, book._y + 20, 0);
  return w5Task(16000, (done, isFin) => {
    let sx = null, p = 0, going = false;
    const set = v => { p = w5C(v, 0, 1); cover.style.transform = `rotateY(${(p * 178).toFixed(1)}deg)`; put(book, x0 - p * bw / 2, book._y); put(stand, x0 - p * bw / 2, stand._y); };
    const finish = async () => {
      if (going) return; going = true; arrow.remove();
      const p0 = p; for (let i = 1; i <= 16; i++) { set(p0 + (1 - p0) * i / 16); await sleep(28); }
      Snd.whoosh(0.2); Snd.sparkle(); w5Burst(book._x, book._y, 18, 110);
      await sleep(400); done();
    };
    const f = w5Field({
      down(pt) { if (!going) sx = pt.x; },
      move(pt) { if (sx != null && !going) set((pt.x - sx) / (A.W * 0.35)); },
      up(pt, moved) { if (going || sx == null) return; sx = null; if (p > 0.3 || !moved) finish(); else set(0); }
    });
    return { off() { f.off(); arrow.remove(); }, auto: finish };
  });
}
/* 1:2 — «Господь миров»: свайп вверх, и мы поднимаемся всё выше — от сада до звёзд */
function w5WorldsScene(A) {
  const { W } = A;
  sky("linear-gradient(180deg,#0B1A33 0%,#1B355C 60%,#2C4F7A 100%)"); w5Stars(50, "100%");
  const S = Math.min(W * 0.78, A.bot - A.top - 60, 320);
  const lens = obj("w5lens", `<div class="w5lensin">${W5_WORLDS.map((v, i) => `<div class="w5view"${i ? "" : ' style="opacity:1"'}>${v}</div>`).join("")}</div>`, W / 2, A.top + S / 2 + 4, S, S);
  lens.style.zIndex = 5;
  const lbl = w5Label(W / 2, A.top + S + 30, L("fatiha_w1").replace(/\.$/, ""));
  Snd.amb("wind", 0.3);
  return { lens, lbl, S };
}
function w5Worlds(o, A) {
  const views = [...o.lens.querySelectorAll(".w5view")];
  const arrow = w5Arrow(o.lens._x, o.lens._y + o.S * 0.28, -90);
  let k = 0;
  return w5Task(60000, (done, isFin) => {
    let sy = null, used = false, busy = false, idle = null;
    const kick = () => { clearTimeout(idle); idle = setTimeout(next, 9000); };
    const next = async () => {
      if (busy || isFin() || k >= views.length - 1) return; busy = true; clearTimeout(idle);
      const a = views[k], b = views[k + 1]; k++;
      a.animate([{ transform: "scale(1)", opacity: 1 }, { transform: "scale(.1)", opacity: 0 }], { duration: 750, easing: "ease-in", fill: "forwards" });
      b.animate([{ transform: "scale(2.8)", opacity: 0 }, { transform: "scale(1)", opacity: 1 }], { duration: 850, easing: "ease-out", fill: "forwards" });
      Snd.whoosh(0.22); o.lbl.textContent = L("fatiha_w" + (k + 1)).replace(/\.$/, ""); Voice.speak("fatiha_w" + (k + 1));
      await sleep(900); busy = false;
      if (k >= views.length - 1) { arrow.remove(); Snd.sparkle(); await sleep(1500); done(); } else kick();
    };
    const f = w5Field({
      down(p) { sy = p.y; used = false; },
      move(p) { if (sy != null && !used && sy - p.y > 45) { used = true; next(); } },
      up(p, moved) { if (sy != null && !used && !moved) next(); sy = null; }
    });
    kick();
    return { off() { f.off(); clearTimeout(idle); arrow.remove(); }, async auto() { while (!isFin() && k < views.length - 1) { await next(); await sleep(400); } } };
  });
}
/* 1:3 — «Милостивый, Милосердный»: ловить корзинкой милости, которые падают с неба */
function w5CatchScene(A) {
  const { W, H } = A;
  sky("linear-gradient(180deg,#5FB4E6 0%,#A9DDF4 55%,#EAF6E0 100%)"); sunAt(W * 0.82, H * 0.38, 100); clouds(2, 0.3, 0.4); hills(0.3);
  Snd.amb("meadow", 0.6);
  const b = obj("w5basket", ART.w5_basket, W / 2, A.bot - 30, 100, 64); b.style.zIndex = 9;
  return b;
}
function w5Catch(basket, A) {
  const kinds = [ICON.drop, ICON.fruitc, ICON.sunc, ICON.w5_bread, ICON.w5_dates];
  return w5Task(20000, (done, isFin) => {
    let bx = basket._x, tx = bx, caught = 0, spawn = 0;
    const t0 = performance.now(); let last = t0; const items = [];
    capNote.textContent = "Поймано: 0";
    const f = w5Field({ down(p) { tx = p.x; }, move(p) { tx = p.x; } });
    const loop = t => {
      if (isFin()) return;
      const dt = Math.min(0.05, (t - last) / 1000), e = (t - t0) / 1000; last = t;
      bx += (tx - bx) * Math.min(1, dt * 12); bx = w5C(bx, 50, A.W - 50); put(basket, bx, basket._y);
      spawn -= dt;
      if (e < 13 && spawn <= 0) {
        spawn = e > 9 ? 0.16 : rnd(0.55, 0.85);
        const it = obj("w5fall", w5Svg("0 0 48 48", kinds[Math.floor(Math.random() * kinds.length)]), rnd(28, A.W - 28), A.H * 0.28, 42, 42);
        it.vy = rnd(150, 200) + e * 8; it.style.zIndex = 8; items.push(it);
      }
      for (const it of items) {
        put(it, it._x, it._y + it.vy * dt);
        if (!it.gone && it._y >= basket._y - 26 && it._y <= basket._y + 4 && Math.abs(it._x - bx) < 48) {
          it.gone = true; caught++; capNote.textContent = "Поймано: " + caught; Snd.tap(); if (caught % 3 === 0) Snd.sparkle();
          w5Burst(bx, basket._y - 20, 6, 30); it.remove();
          basket.classList.remove("wob"); void basket.offsetWidth; basket.classList.add("wob");
        } else if (!it.gone && it._y > A.bot + 10) { it.gone = true; fadeOut(it, 300); }
      }
      for (let i = items.length - 1; i >= 0; i--) if (items[i].gone) items.splice(i, 1);
      if (e > 13 && !items.length) return done(caught);
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
    return { off() { f.off(); items.forEach(i => i.remove()); } };
  });
}
/* 1:4 — «Властелин Дня воздаяния»: собрать добрые дела в копилку */
function w5DeedsScene(A) {
  sky("linear-gradient(180deg,#FCE9C8 0%,#F7DDB4 60%,#EFCB98 100%)");
  const fl = el("div", "layer"); fl.style.bottom = "0"; fl.style.height = "18%"; fl.style.background = "linear-gradient(180deg,#D9B27A,#C69A60)";
  Snd.amb("wind", 0.2);
  const jar = obj("w5jar", ART.w5_jar, A.W / 2, A.bot - 56, 84, 105); jar.style.zIndex = 6;
  return jar;
}
function w5Deeds(jar, A) {
  const icons = [ICON.w5_salam, ICON.w5_heart, ICON.w5_bread, ICON.star, ICON.w5_toys, ICON.drop];
  const fill = jar.querySelector(".w5jfill");
  const cw = Math.min(A.W * 0.44, 180), y0 = A.top + 28, rowH = Math.max(52, (jar._y - 80 - y0) / 2);
  const cards = icons.map((ic, i) => {
    const c = obj("w5deed", `${w5Svg("0 0 48 48", ic)}<span>${L("fatiha_d" + (i + 1)).replace(/\.$/, "")}</span>`, A.W * (i % 2 ? 0.74 : 0.26), y0 + Math.floor(i / 2) * rowH, cw, 54);
    c.style.zIndex = 8; c.style.animationDelay = (-i * 0.45) + "s"; fadeIn(c, 500); return c;
  });
  return w5Task(26000, (done, isFin) => {
    let n = 0;
    const take = c => {
      if (c.taken || isFin()) return; c.taken = true; c.style.animation = "none"; c.classList.remove("hint");
      Voice.speak("fatiha_d" + (cards.indexOf(c) + 1)); Snd.tap();
      c.animate([{ transform: "scale(1)" }, { transform: "scale(.2)" }], { duration: 520, easing: "ease-in", fill: "forwards" });
      move(c, jar._x, jar._y - 20, 520, "ease-in").then(() => {
        c.remove(); n++; const f = n / cards.length;
        fill.setAttribute("y", (94 - f * 68).toFixed(1)); fill.setAttribute("height", (f * 68).toFixed(1));
        Snd.sparkle(); w5Burst(jar._x, jar._y - 30, 10, 50); capNote.textContent = "Добрых дел: " + n;
        if (n >= cards.length) setTimeout(() => done(), 700);
      });
    };
    cards.forEach(c => { c.onpointerdown = ev => { ev.preventDefault(); take(c); }; });
    cards[0].classList.add("hint");
    return { off() { cards.forEach(c => { c.onpointerdown = null; }); }, async auto() { for (const c of cards) { if (isFin()) break; if (!c.taken) { take(c); await sleep(450); } } await sleep(900); } };
  });
}
/* 1:5 — «Тебе одному поклоняемся»: повернуть коврик к Каабе */
function w5RugScene(A) {
  const { W, H } = A;
  sky("linear-gradient(180deg,#F2C48D 0%,#F7DDB0 45%,#EBCB98 100%)");
  const dunes = el("div", "layer", stage, w5Svg("0 0 400 100", '<path d="M0 40 Q100 10 200 34 T400 26 V100 H0Z" fill="#E2B97E"/><path d="M0 66 Q140 44 260 62 T400 58 V100 H0Z" fill="#D6A96A"/>', ' preserveAspectRatio="none"'));
  dunes.style.bottom = "0"; dunes.style.height = "40%";
  const kaaba = obj("w5kaaba", ART.w5_kaaba, W * 0.76, A.top + 46, 86, 86); kaaba.style.zIndex = 4;
  const rug = obj("w5rug", ART.w5_rug, W * 0.42, A.mid + 34, 66, 110); rug.style.zIndex = 6;
  Snd.amb("wind", 0.3);
  return { kaaba, rug };
}
function w5Rug(o, A) {
  const { rug, kaaba } = o;
  const target = Math.atan2(kaaba._y - rug._y, kaaba._x - rug._x) * 180 / Math.PI + 90;
  let rot = target + 150;
  const setR = r => { rot = r; rug.style.transform = `rotate(${r.toFixed(1)}deg)`; };
  const diff = () => { let d = (rot - target) % 360; if (d > 180) d -= 360; if (d < -180) d += 360; return d; };
  setR(rot); rug.classList.add("hint");
  return w5Task(22000, (done, isFin) => {
    let a0 = null, r0 = 0, going = false;
    const ang = p => Math.atan2(p.y - rug._y, p.x - rug._x) * 180 / Math.PI;
    const turn = async to => { const from = rot; for (let i = 1; i <= 14; i++) { setR(from + (to - from) * (1 - Math.pow(1 - i / 14, 3))); await sleep(24); } };
    const win = async () => {
      if (going) return; going = true; rug.classList.remove("hint");
      await turn(rot - diff());
      const line = el("div", "layer", stage, `<svg viewBox="0 0 ${A.W} ${A.H}" aria-hidden="true"><path d="M${rug._x} ${rug._y} L${kaaba._x} ${kaaba._y + 20}" stroke="#E6A93A" stroke-width="4" stroke-dasharray="3 10" stroke-linecap="round" fill="none"/></svg>`);
      line.style.inset = "0"; line.style.zIndex = 5; fadeIn(line, 600);
      Snd.sparkle(); w5Burst(rug._x, rug._y, 16, 80); glowSpot(kaaba._x, kaaba._y, 70).style.zIndex = 3;
      await sleep(800); done();
    };
    const f = w5Field({
      down(p) { if (going) return; a0 = ang(p); r0 = rot; rug.classList.remove("hint"); },
      move(p) { if (a0 == null || going) return; let da = ang(p) - a0; if (da > 180) da -= 360; if (da < -180) da += 360; setR(r0 + da); if (Math.abs(diff()) < 9) win(); },
      up(p, moved) {
        if (a0 == null || going) return; a0 = null;
        if (Math.abs(diff()) < 22) return win();
        if (!moved) { const d = diff(); turn(rot - Math.sign(d) * Math.min(40, Math.abs(d))).then(() => { if (Math.abs(diff()) < 22) win(); }); Snd.tap(); }
      }
    });
    return { off: () => f.off(), auto: win };
  });
}
/* 1:6–1:7 — дорожки: прямой путь к воротам сада и кривые тропинки в тупик */
function w5MazeGeo(A) {
  const mw = Math.min(A.W * 0.9, 380), left = (A.W - mw) / 2, y0 = A.top + 76, y1 = A.bot - 22;
  const P = (u, v) => ({ x: left + u * mw, y: y0 + v * (y1 - y0) });
  const lines = [
    [[0.5, 1], [0.5, 0]],
    [[0.5, 0.84], [0.17, 0.84], [0.17, 0.62], [0.06, 0.62]],
    [[0.5, 0.68], [0.83, 0.68], [0.83, 0.9], [0.94, 0.9]],
    [[0.5, 0.5], [0.24, 0.5], [0.24, 0.28], [0.08, 0.28]],
    [[0.5, 0.33], [0.8, 0.33], [0.8, 0.12], [0.92, 0.12]]
  ].map(l => l.map(([u, v]) => P(u, v)));
  return { lines, P, mw };
}
function w5MazeScene(A, foggy) {
  const { W, H } = A, g = w5MazeGeo(A);
  sky(`linear-gradient(180deg,#9AD5F2 0%,#CDEBF7 ${(A.top / H * 100 - 4).toFixed(0)}%,#9CCF7E ${(A.top / H * 100).toFixed(0)}%,#7DBE63 100%)`);
  const pl = l => l.map(p => p.x.toFixed(0) + "," + p.y.toFixed(0)).join(" ");
  const road = el("div", "layer", stage, `<svg viewBox="0 0 ${W} ${H}" aria-hidden="true">${g.lines.map((l, i) => `<polyline points="${pl(l)}" fill="none" stroke="#C9A86A" stroke-width="28" stroke-linecap="round" stroke-linejoin="round"${foggy && i ? ' opacity=".55"' : ""}/>`).join("")}${g.lines.map((l, i) => `<polyline points="${pl(l)}" fill="none" stroke="#F1DFB0" stroke-width="20" stroke-linecap="round" stroke-linejoin="round"${foggy && i ? ' opacity=".55"' : ""}/>`).join("")}</svg>`);
  road.style.inset = "0"; road.style.zIndex = 3;
  g.lines.slice(1).forEach(l => {
    const e = l[l.length - 1];
    const th = obj("w5thorn", ART.w5_thorn, e.x, e.y + 2, 40, 34); th.style.zIndex = 4;
    const fg = obj("w5fog", ART.cloud, e.x, e.y - 10, foggy ? 100 : 70, foggy ? 50 : 35); fg.style.zIndex = 5;
    if (foggy) { const m = l[1]; const f2 = obj("w5fog", ART.cloud, (m.x + l[2].x) / 2, (m.y + l[2].y) / 2, 110, 55); f2.style.zIndex = 5; }
  });
  const top = g.lines[0][1];
  const gate = obj("w5gate", ART.w5_gate, top.x, top.y - 36, 104, 78); gate.style.zIndex = 4;
  Snd.amb("meadow", 0.5);
  return { g, gate };
}
function w5Graph(lines) {
  const pts = [], adj = [], chains = [];
  const add = (x, y) => { pts.push({ x, y }); adj.push([]); return pts.length - 1; };
  const link = (a, b) => { adj[a].push(b); adj[b].push(a); };
  lines.forEach(ln => {
    const ids = [];
    for (let s = 0; s < ln.length - 1; s++) {
      const a = ln[s], b = ln[s + 1], n = Math.max(1, Math.round(Math.hypot(b.x - a.x, b.y - a.y) / 5));
      for (let k = s === 0 ? 0 : 1; k <= n; k++) ids.push(add(a.x + (b.x - a.x) * k / n, a.y + (b.y - a.y) * k / n));
    }
    for (let k = 1; k < ids.length; k++) link(ids[k - 1], ids[k]);
    chains.push(ids);
  });
  chains.slice(1).forEach(ids => { let best = chains[0][0], bd = 1e9; chains[0].forEach(j => { const d = w5Dist(pts[j], pts[ids[0]]); if (d < bd) { bd = d; best = j; } }); link(ids[0], best); });
  return { pts, adj, chains };
}
function w5Maze(o, A) {
  const G = w5Graph(o.g.lines), main = G.chains[0], goal = main[main.length - 1];
  const ends = G.chains.slice(1).map(c => c[c.length - 1]);
  let cur = main[0];
  const ball = obj("w5ball", "<i></i>", G.pts[cur].x, G.pts[cur].y, 30, 30); ball.style.zIndex = 9; ball.classList.add("hint");
  /* ближайшая к пальцу точка дорожки, до которой можно дойти от огонька не больше чем за max шагов */
  const reach = (from, tgt, max) => {
    const seen = new Set([from]); let q = [from], best = from, bd = w5Dist(G.pts[from], tgt);
    for (let d = 0; d < max && q.length; d++) {
      const nq = [];
      q.forEach(i => G.adj[i].forEach(j => { if (seen.has(j)) return; seen.add(j); nq.push(j); const dd = w5Dist(G.pts[j], tgt); if (dd < bd) { bd = dd; best = j; } }));
      q = nq;
    }
    return best;
  };
  const path = (from, to) => {
    const par = new Map([[from, -1]]); const q = [from];
    while (q.length) { const i = q.shift(); if (i === to) break; G.adj[i].forEach(j => { if (!par.has(j)) { par.set(j, i); q.push(j); } }); }
    const r = []; for (let i = to; i !== -1 && i !== undefined; i = par.get(i)) r.unshift(i); return r;
  };
  return w5Task(30000, (done, isFin) => {
    let going = false; const seenEnd = new Set();
    const win = async () => { if (going) return; going = true; ball.classList.remove("hint"); capNote.textContent = ""; Snd.sparkle(); w5Burst(o.gate._x, o.gate._y, 20, 90); glowSpot(o.gate._x, o.gate._y, 80).style.zIndex = 3; await sleep(900); done(); };
    const setCur = i => {
      cur = i; put(ball, G.pts[i].x, G.pts[i].y);
      ends.forEach((e, k) => { if (w5Dist(G.pts[i], G.pts[e]) < 8 && !seenEnd.has(k)) { seenEnd.add(k); Snd.thud(0.3); capNote.textContent = L("fatiha_a6_dead"); ball.classList.remove("wob"); void ball.offsetWidth; ball.classList.add("wob"); } });
      if (w5Dist(G.pts[i], G.pts[goal]) < 10) win();
    };
    const f = w5Field({ down(p) { if (!going) { ball.classList.remove("hint"); setCur(reach(cur, p, 26)); } }, move(p) { if (!going) setCur(reach(cur, p, 26)); } });
    return { off() { f.off(); }, async auto() { for (const i of path(cur, goal)) { if (isFin() || going) break; setCur(i); await sleep(14); } await win(); } };
  });
}
function w5Lanterns(o, A) {
  const names = ["Нух", "Ибрахим", "Муса", "Иса", "Мухаммад ﷺ"], vs = [0.93, 0.76, 0.58, 0.41, 0.2], side = [1, -1, 1, -1, 1];
  const lamps = names.map((nm, i) => {
    const p = o.g.P(0.5 + side[i] * 0.11, vs[i]);
    const l = obj("w5lan", ART.lantern, p.x, p.y, 56, 64); l.style.zIndex = 8;
    const t = w5Label(p.x + side[i] * (o.g.mw * 0.09 + 30), p.y, nm + (i < 4 ? "<small>мир ему</small>" : ""), "tag"); t.style.zIndex = 9; t.style.opacity = ".7";
    l._t = t; return l;
  });
  return w5Task(28000, (done, isFin) => {
    let k = 0;
    const light = i => {
      const l = lamps[i]; l.classList.remove("hint"); l.classList.add("lit"); l.querySelector(".flamel").setAttribute("opacity", "1"); l._t.style.opacity = "1";
      glowSpot(l._x, l._y, 85).style.zIndex = 7; l.style.transform = "scale(1.15)"; Snd.sparkle(); w5Burst(l._x, l._y, 8, 40);
      k++; if (k < lamps.length) lamps[k].classList.add("hint"); else { setTimeout(() => done(), 900); }
    };
    lamps.forEach((l, i) => { l.onpointerdown = ev => { ev.preventDefault(); if (isFin()) return; if (i === k) light(i); else if (i > k) { Snd.thud(0.2); lamps[k].classList.remove("wob"); void lamps[k].offsetWidth; lamps[k].classList.add("wob"); } }; });
    lamps[0].classList.add("hint");
    return { off() { lamps.forEach(l => { l.onpointerdown = null; }); }, async auto() { while (!isFin() && k < lamps.length) { light(k); await sleep(450); } await sleep(900); } };
  });
}
async function chFatiha() {
  const rb = w5Ribbon("1:1-7");
  const bk = await w5Go(w5BookScene);
  await chapterTitle(null, "Аль-Фатиха", "fatiha_0");
  await say("fatiha_1");
  rb.show(); rb.at(1);
  cue("fatiha_a1_do");
  await w5OpenBook(bk, w5A());
  rb.full(true); await say("fatiha_a1"); rb.done(1);

  const wl = await w5Go(w5WorldsScene);
  await rb.intro(2, "fatiha_a2");
  cue("fatiha_a2_do"); await w5Worlds(wl, w5A());
  await rb.outro(2, "fatiha_a2_ok");

  const basket = await w5Go(w5CatchScene);
  await rb.intro(3, "fatiha_a3");
  cue("fatiha_a3_do"); await w5Catch(basket, w5A());
  await rb.outro(3, "fatiha_a3_ok");

  const jar = await w5Go(w5DeedsScene);
  await rb.intro(4, "fatiha_a4");
  cue("fatiha_a4_do"); await w5Deeds(jar, w5A());
  await rb.outro(4, "fatiha_a4_ok");

  const rg = await w5Go(w5RugScene);
  await rb.intro(5, "fatiha_a5");
  cue("fatiha_a5_do"); await w5Rug(rg, w5A());
  rb.full(true); await say("fatiha_a5_ok");
  await say("fatiha_a5_dua", { btn: "О Аллах, помоги мне!" });
  hideCap(); await w5Beam(rg.rug._x, rg.rug._y); rb.done(5);

  const mz = await w5Go(A => w5MazeScene(A, false));
  await rb.intro(6, "fatiha_a6");
  cue("fatiha_a6_do"); await w5Maze(mz, w5A());
  await rb.outro(6, "fatiha_a6_ok");

  const lz = await w5Go(A => w5MazeScene(A, true));
  await rb.intro(7, "fatiha_a7");
  cue("fatiha_a7_do"); await w5Lanterns(lz, w5A());
  await rb.outro(7, "fatiha_a7_ok");
  rb.remove();
  await say("fatiha_amin", { btn: "Амин" });
  await say("fatiha_salah");
  const misses = await choice("fatiha_q", [{ id: "fatiha_qa", icon: ICON.w5_map }, { id: "fatiha_qb", icon: ICON.lantern }, { id: "fatiha_qc", ar: true, ok: true }], "fatiha_q_ok");
  await say("fatiha_quran");
  await ayahCard("1:1-7");
  await say("fatiha_end", { btn: "Иншаллах" });
  hideCap(); await award("w5key");
  return misses;
}

/* ============ ГЛАВА 2: АЛЬ-ИХЛАС (112:1-4) ============ */
function w5SoftSky() {
  sky("linear-gradient(180deg,#BFE3F2 0%,#E3F2F7 55%,#F5EBD8 100%)");
  const fl = el("div", "layer"); fl.style.bottom = "0"; fl.style.height = "16%"; fl.style.background = "linear-gradient(180deg,#E9D6B4,#D9C097)";
  Snd.amb("wind", 0.2);
}
/* 112:1 — карточки-пары: у всего есть пара */
function w5MemoryScene(A) {
  w5SoftSky();
  const faces = { s: ART.w5_sock, b: ART.w5_boot, d: ART.w5_day, n: ART.w5_night, l: ART.w5_leaf };
  const deck = w5Shuffle([["s", "s"], ["s", "s"], ["b", "b"], ["b", "b"], ["d", "dn"], ["n", "dn"], ["l", "l"], ["l", "l"]]);
  const cw = Math.min((A.W - 24 - 30) / 4, 88), ch = cw * 1.25, gx = (A.W - (cw * 4 + 30)) / 2, cy = A.mid;
  return deck.map(([f, pair], i) => {
    const c = obj("w5card", `<div class="w5cin"><div class="w5back">${w5Svg("0 0 40 40", STAR8)}</div><div class="w5face">${w5Svg("0 0 60 60", faces[f])}</div></div>`,
      gx + cw / 2 + (i % 4) * (cw + 10), cy + (i < 4 ? -1 : 1) * (ch / 2 + 6), cw, ch);
    c.style.zIndex = 6; c._pair = pair; return c;
  });
}
function w5Memory(cards, A) {
  return w5Task(45000, (done, isFin) => {
    let first = null, lock = false, matched = 0;
    const open = c => { c.classList.add("open"); Snd.tap(); };
    const close = c => c.classList.remove("open");
    const good = (a, b) => { a.done = b.done = true; a.classList.add("ok"); b.classList.add("ok"); matched++; Snd.sparkle(); w5Burst((a._x + b._x) / 2, (a._y + b._y) / 2, 10, 60); if (matched >= cards.length / 2) setTimeout(() => done(), 900); };
    const tap = async c => {
      if (lock || isFin() || c.done || c === first) return;
      open(c);
      if (!first) { first = c; return; }
      const a = first; first = null;
      if (a._pair === c._pair) good(a, c);
      else { lock = true; await sleep(850); close(a); close(c); Snd.thud(0.15); lock = false; }
    };
    cards.forEach(c => { c.onpointerdown = ev => { ev.preventDefault(); tap(c); }; });
    return {
      off() { cards.forEach(c => { c.onpointerdown = null; }); },
      async auto() {
        while (lock) await sleep(100);
        if (first) { close(first); first = null; }
        const rest = cards.filter(c => !c.done);
        while (rest.length && !isFin()) { const a = rest.shift(), j = rest.findIndex(x => x._pair === a._pair), b = rest.splice(j, 1)[0]; open(a); open(b); good(a, b); await sleep(500); }
        await sleep(900);
      }
    };
  });
}
/* 112:2 — «Самодостаточный»: всем что-то нужно, а Аллаху — никто и ничто */
function w5NeedsScene(A) {
  w5SoftSky();
  const sz = Math.min(A.W * 0.26, 104);
  const defs = [[ART.w5_pot, ICON.drop, 80, 90], [ART.w5_phone, ICON.bolt, 60, 90], [ART.w5_car, ICON.w5_fuel, 100, 60]];
  const items = [], bars = [];
  defs.forEach(([svg, need, w, h], i) => {
    const x = A.W * (0.2 + i * 0.3), k = sz / Math.max(w, h);
    const it = obj("w5need", svg, x, A.mid, w * k, h * k); it.style.zIndex = 6; it._need = need; items.push(it);
    const b = el("div", "w5bar", stage, "<i></i>"); b.style.left = x + "px"; b.style.top = (A.mid + sz / 2 + 12) + "px"; b.style.width = (sz * 0.9) + "px"; bars.push(b);
  });
  return { items, bars };
}
function w5Needs(o, A) {
  return w5Task(18000, (done, isFin) => {
    const lv = [1, 0.8, 0.6]; const t0 = performance.now(); let last = t0;
    o.items.forEach((it, i) => {
      it.classList.add("hint");
      it.onpointerdown = ev => {
        ev.preventDefault(); if (isFin()) return; it.classList.remove("hint"); lv[i] = 1; Snd.tap(); i === 0 ? Snd.splash() : Snd.sparkle();
        const p = obj("w5part", w5Svg("0 0 48 48", it._need), it._x, it._y - it.offsetHeight / 2 - 26, 34, 34); p.style.zIndex = 9;
        p.animate([{ transform: "translateY(0)", opacity: 1 }, { transform: "translateY(40px)", opacity: 0 }], { duration: 500, easing: "ease-in" }).onfinish = () => p.remove();
        it.classList.remove("wob"); void it.offsetWidth; it.classList.add("wob");
      };
    });
    const loop = t => {
      if (isFin()) return;
      const dt = Math.min(0.05, (t - last) / 1000), e = (t - t0) / 1000; last = t;
      const rate = 0.1 + e * 0.017;
      o.items.forEach((it, i) => {
        lv[i] = Math.max(0, lv[i] - rate * dt * (0.85 + i * 0.12));
        o.bars[i].firstChild.style.width = (lv[i] * 100).toFixed(1) + "%";
        const low = lv[i] < 0.3; it.classList.toggle("low", low); o.bars[i].classList.toggle("low", low);
      });
      if (e > 14) return done();
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
    return { off() { o.items.forEach(it => { it.onpointerdown = null; it.classList.remove("hint"); }); } };
  });
}
/* 112:3 — «Не родил и не был рождён»: откуда что появилось */
function w5OriginsScene(A) {
  w5SoftSky();
  const k = w5C((A.bot - A.top) / 300, 1, 1.4), oy = A.top + 60 * k;
  const origins = [[ART.apple, 76, 108], [ART.w5_wheat, 70, 100], [ART.w5_bush, 96, 86]].map(([svg, w, h], i) => { const o = obj("w5orig", svg, A.W * (0.18 + i * 0.32), oy, w * k, h * k); o.style.zIndex = 4; return o; });
  origins[0].classList.add("grown");
  const kinds = [[w5Svg("0 0 48 48", ICON.fruitc), 0, 50, 50], [ART.bread, 1, 72, 40], [ART.w5_jam, 2, 50, 58]];
  const xs = w5Shuffle([0.2, 0.5, 0.8]);
  const items = kinds.map(([svg, n, w, h], i) => { const it = obj("w5drag", svg, A.W * xs[i], A.bot - 50, w * 1.25, h * 1.25); it.style.zIndex = 8; it._k = n; return it; });
  return { origins, items };
}
function w5Origins(o, A) {
  const inside = (it, g) => { const r = { x: g._x, y: g._y, w: g.offsetWidth / 2 + 24, h: g.offsetHeight / 2 + 24 }; return Math.abs(it._x - r.x) < r.w && Math.abs(it._y - r.y) < r.h; };
  return w5Task(32000, (done, isFin) => {
    let left = o.items.length;
    const accept = it => {
      const g = o.origins[it._k]; it.locked = true; it.classList.remove("hint", "tapme");
      Snd.sparkle(); w5Burst(g._x, g._y, 12, 60);
      move(it, g._x + (it._k === 1 ? 0 : g.offsetWidth * 0.3), g._y + g.offsetHeight / 2 + 4, 300, "ease-out");
      if (--left === 0) setTimeout(() => done(), 900);
      return true;
    };
    const offD = w5Drags(o.items, it => {
      const g = o.origins.find(x => inside(it, x));
      if (!g) return false;
      if (o.origins.indexOf(g) === it._k) return accept(it);
      Snd.thud(0.25); g.classList.remove("wob"); void g.offsetWidth; g.classList.add("wob"); return false;
    });
    o.items[0].classList.add("hint");
    return { off: offD, async auto() { for (const it of o.items) { if (isFin()) break; if (!it.locked) { const g = o.origins[it._k]; await move(it, g._x, g._y, 500); accept(it); await sleep(300); } } await sleep(900); } };
  });
}
/* 112:4 — «Нет никого равного Ему»: весы */
function w5ScaleScene(A) {
  w5SoftSky();
  const lay = el("div", "layer", stage, `<svg viewBox="0 0 ${A.W} ${A.H}" aria-hidden="true"><g></g></svg>`); lay.style.inset = "0"; lay.style.zIndex = 5;
  const S = { g: lay.querySelector("g"), cx: A.W / 2, py: A.top + 34, hl: Math.min(A.W * 0.33, 140), a: 0, onR: null };
  w5ScaleDraw(S, 0);
  return S;
}
function w5ScaleDraw(S, a) {
  const r = a * Math.PI / 180, c = Math.cos(r), s = Math.sin(r);
  const L1 = { x: S.cx - S.hl * c, y: S.py - S.hl * s }, R1 = { x: S.cx + S.hl * c, y: S.py + S.hl * s }, ph = 62, pw = 46;
  const pan = e => `<path d="M${e.x} ${e.y} L${e.x - pw + 6} ${e.y + ph} M${e.x} ${e.y} L${e.x + pw - 6} ${e.y + ph}" stroke="#8C7350" stroke-width="2"/><path d="M${e.x - pw} ${e.y + ph} Q${e.x} ${e.y + ph + 22} ${e.x + pw} ${e.y + ph}Z" fill="#E6A93A" stroke="#B9802A" stroke-width="2"/>`;
  S.g.innerHTML = `<path d="M${S.cx} ${S.py} V${S.py + 150}" stroke="#8E5A2E" stroke-width="10" stroke-linecap="round"/><rect x="${S.cx - 50}" y="${S.py + 146}" width="100" height="14" rx="6" fill="#7A4A24"/>` +
    `<line x1="${L1.x}" y1="${L1.y}" x2="${R1.x}" y2="${R1.y}" stroke="#B9802A" stroke-width="9" stroke-linecap="round"/><circle cx="${S.cx}" cy="${S.py}" r="9" fill="#F5C451"/>` + pan(L1) + pan(R1);
  S.L = { x: L1.x, y: L1.y + ph + 4 }; S.R = { x: R1.x, y: R1.y + ph + 4 }; S.a = a;
}
function w5ScaleRound(S, left, opts, A) {
  const target = wr => w5C((wr - left._wt) * 5, -16, 16);
  const place = () => { put(left, S.L.x, S.L.y - left.offsetHeight / 2); if (S.onR) put(S.onR, S.R.x, S.R.y - S.onR.offsetHeight / 2); };
  const tween = async to => { const from = S.a; for (let i = 1; i <= 18; i++) { w5ScaleDraw(S, from + (to - from) * (1 - Math.pow(1 - i / 18, 3))); place(); await sleep(22); } };
  w5ScaleDraw(S, target(0)); place();
  return w5Task(24000, (done, isFin) => {
    let busy = false;
    const handle = async it => {
      busy = true; S.onR = it; it.locked = true; it.classList.remove("hint"); place(); Snd.thud(0.3);
      await tween(target(it._wt));
      if (it._wt === left._wt) { Snd.sparkle(); w5Burst(S.cx, S.py, 16, 80); await sleep(1000); done(); return; }
      Snd.noise({ kind: "brown", type: "lowpass", f: 300, dur: 0.2, gain: 0.3 });
      await sleep(900); S.onR = null; await move(it, it._hx, it._hy, 350, "ease-out"); it.locked = false;
      await tween(target(0)); busy = false;
    };
    const offD = w5Drags(opts, it => { if (busy || isFin() || w5Dist({ x: it._x, y: it._y }, S.R) > 95) return false; handle(it); return true; });
    return { off: offD, async auto() { while (busy) await sleep(100); if (isFin()) return; const ok = opts.find(x => x._wt === left._wt); await move(ok, S.R.x, S.R.y - 30, 600); await handle(ok); } };
  });
}
async function w5Scales(S, A) {
  const mk = (svg, w, h, wt, x, y) => { const e = obj("w5drag", svg, x, y, w, h); e.style.zIndex = 8; e._wt = wt; return e; };
  const ty = A.bot - 40, xs = () => w5Shuffle([0.2, 0.5, 0.8]).map(f => A.W * f);
  let x = xs();
  const apple = mk(w5Svg("0 0 48 48", ICON.fruitc), 50, 50, 2, S.cx, S.py);
  const o1 = [mk(ART.w5_melon, 80, 57, 6, x[0], ty), mk(w5Svg("0 0 48 48", ICON.fruitc), 50, 50, 2, x[1], ty), mk(ART.w5_cherry, 44, 44, 0.5, x[2], ty)];
  await w5ScaleRound(S, apple, o1, A);
  [apple, ...o1].forEach(e => fadeOut(e, 300)); S.onR = null; await sleep(350);
  x = xs();
  const cube = mk(ART.w5_cube, 54, 54, 3, S.cx, S.py);
  const o2 = [mk(ART.rock, 84, 60, 7, x[0], ty), mk(ART.w5_cube, 54, 54, 3, x[1], ty), mk(ART.w5_pebble, 40, 26, 1, x[2], ty)];
  cue("ikhlas_a4_r2");
  await w5ScaleRound(S, cube, o2, A);
  o2.filter(e => e !== S.onR).forEach(e => fadeOut(e, 400));
}
async function chIkhlas() {
  const rb = w5Ribbon("112:1-4");
  const cards = await w5Go(w5MemoryScene);
  await chapterTitle(null, "Аль-Ихлас", "ikhlas_0");
  await say("ikhlas_1");
  rb.show();
  await rb.intro(1, "ikhlas_a1");
  cue("ikhlas_a1_do"); await w5Memory(cards, w5A());
  rb.full(true); await say("ikhlas_a1_ok");
  cards.forEach(c => fadeOut(c, 600)); await sleep(500);
  const A1 = w5A(), one = obj("w5one", `<p lang="ar" dir="rtl">${AYAT["112:1-4"].parts[0].ar}</p>`, A1.W / 2, A1.mid, Math.min(A1.W * 0.86, 380), 130);
  one.style.zIndex = 7; fadeIn(one, 800); Snd.sparkle();
  await say("ikhlas_a1_one"); rb.done(1);

  const nd = await w5Go(w5NeedsScene);
  await rb.intro(2, "ikhlas_a2");
  cue("ikhlas_a2_do"); await w5Needs(nd, w5A());
  rb.full(true); await say("ikhlas_a2_ok");
  await say("ikhlas_a2_ok2"); rb.done(2);

  const og = await w5Go(w5OriginsScene);
  await rb.intro(3, "ikhlas_a3");
  cue("ikhlas_a3_do"); await w5Origins(og, w5A());
  rb.full(true); await say("ikhlas_a3_ok");
  await say("ikhlas_a3_ok2"); rb.done(3);

  const sc = await w5Go(w5ScaleScene);
  await rb.intro(4, "ikhlas_a4");
  cue("ikhlas_a4_do"); await w5Scales(sc, w5A());
  await rb.outro(4, "ikhlas_a4_ok");
  rb.remove();
  const misses = await choice("ikhlas_q", [{ id: "ikhlas_qa", icon: ICON.sunc }, { id: "ikhlas_qc", ar: true, ok: true }, { id: "ikhlas_qb", icon: ICON.mountain }], "ikhlas_q_ok");
  await say("ikhlas_quran");
  await ayahCard("112:1-4");
  await say("ikhlas_end", { btn: "Ля иляха илляЛлах" });
  hideCap(); await award("w5crystal");
  return misses;
}

/* ============ ГЛАВА 3: АЛЬ-ФАЛЯК (113:1-5) ============ */
/* 113:1 — «Господь рассвета»: стереть ночь пальцем можно лишь чуть-чуть, а рассвет приходит сразу везде */
function w5DawnScene(A) {
  const { W, H } = A;
  const sk = sky("linear-gradient(180deg,#F59E7A 0%,#F9C98F 45%,#FCE7B8 75%,#E3F2F7 100%)");
  const sun = sunAt(W * 0.5, H * 0.74, 160);
  hills(0.3, ["#9BC98A", "#7DB86E", "#5FA25A"]);
  const cv = el("canvas", "w5night"); cv.width = Math.round(W); cv.height = Math.round(H);
  const ctx = cv.getContext("2d"), g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, "#08122A"); g.addColorStop(1, "#1C2D52"); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = "#FFF6DD"; for (let i = 0; i < 80; i++) { ctx.globalAlpha = rnd(0.4, 1); ctx.beginPath(); ctx.arc(rnd(0, W), rnd(0, H * 0.75), rnd(0.6, 1.6), 0, 7); ctx.fill(); }
  ctx.globalAlpha = 1;
  Snd.amb("wind", 0.4);
  return { cv, sun, sk };
}
function w5Rub(o, A) {
  const ctx = o.cv.getContext("2d");
  return w5Task(15000, (done, isFin) => {
    let last = null, checkT = 0;
    ctx.globalCompositeOperation = "destination-out"; ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.lineWidth = 60;
    const rub = p => {
      ctx.beginPath();
      if (last) { ctx.moveTo(last.x, last.y); ctx.lineTo(p.x, p.y); ctx.stroke(); } else { ctx.arc(p.x, p.y, 30, 0, 7); ctx.fill(); }
      last = p; if (Math.random() < 0.08) Snd.noise({ kind: "pink", type: "highpass", f: 2500, dur: 0.18, gain: 0.06 });
    };
    const cleared = () => {
      const y0 = Math.round(A.top), h = Math.max(1, Math.round(A.bot - A.top)), d = ctx.getImageData(0, y0, o.cv.width, h).data;
      let n = 0, c = 0; for (let i = 3; i < d.length; i += 36) { n++; if (d[i] < 60) c++; } return c / n;
    };
    const f = w5Field({
      down(p) { last = null; rub(p); },
      move(p) { rub(p); const t = performance.now(); if (t - checkT > 300) { checkT = t; if (cleared() > 0.3) done(); } },
      up() { last = null; }
    });
    return { off() { f.off(); ctx.globalCompositeOperation = "source-over"; } };
  });
}
async function w5Sunrise(o, A) {
  o.cv.style.transition = "opacity 3s"; o.cv.style.opacity = "0";
  o.sun.animate([{ top: (A.H * 0.74) + "px" }, { top: (A.H * 0.5) + "px" }], { duration: 3500, easing: "ease-out", fill: "forwards" });
  Snd.amb("meadow", 0.7); Snd.sparkle();
  await sleep(3300);
}
/* 113:2 — «От зла того, что Он сотворил»: зонтик и град */
function w5HailScene(A) {
  sky("linear-gradient(180deg,#7E93A8 0%,#AFC0CE 55%,#D7E2EA 100%)"); hills(0.26, ["#9CC98A", "#7DB86E", "#5FA25A"]);
  const cols = ["#F28AB0", "#F5C451", "#B98AD8"];
  const flowers = [0.2, 0.5, 0.8].map((fx, i) => {
    const f = obj("w5flower", w5Svg("0 0 50 90", `<g class="w5fl"><path d="M25 90 V34" stroke="#3F8A3B" stroke-width="4"/><path d="M25 64 Q12 58 10 48 Q22 50 25 60Z M25 70 Q38 64 40 54 Q28 56 25 66Z" fill="#5DAE4F"/>${[0, 60, 120, 180, 240, 300].map(a => `<ellipse cx="25" cy="16" rx="7" ry="11" fill="${cols[i]}" transform="rotate(${a} 25 26)"/>`).join("")}<circle cx="25" cy="26" r="7" fill="#F5C451"/></g>`), A.W * fx, A.bot - 46, 50, 90);
    f.style.zIndex = 6; return f;
  });
  const umb = obj("w5umbr", ART.w5_umb, A.W / 2, A.bot - 150, 120, 96); umb.style.zIndex = 9;
  Snd.amb("wind", 0.8);
  return { flowers, umb };
}
function w5Hail(o, A) {
  return w5Task(18000, (done, isFin) => {
    let ux = o.umb._x, tx = ux, spawn = 0, saved = 0; const t0 = performance.now(); let last = t0; const hs = [];
    capNote.textContent = "Закрыто: 0";
    const f = w5Field({ down(p) { tx = p.x; }, move(p) { tx = p.x; } });
    const hit = fl => { const g = fl.querySelector(".w5fl"); g.animate([{ transform: "rotate(0)" }, { transform: `rotate(${rnd(-24, 24).toFixed(0)}deg)` }, { transform: "rotate(0)" }], { duration: 700, easing: "ease-out" }); Snd.noise({ kind: "brown", type: "lowpass", f: 500, dur: 0.1, gain: 0.25 }); };
    const loop = t => {
      if (isFin()) return;
      const dt = Math.min(0.05, (t - last) / 1000), e = (t - t0) / 1000; last = t;
      ux += (tx - ux) * Math.min(1, dt * 14); ux = w5C(ux, 50, A.W - 50); put(o.umb, ux, o.umb._y);
      spawn -= dt;
      if (e < 12 && spawn <= 0) {
        spawn = rnd(0.08, 0.15);
        const fl = o.flowers[Math.floor(Math.random() * 3)], x = Math.random() < 0.8 ? fl._x + rnd(-24, 24) : rnd(20, A.W - 20);
        const h = el("i", "w5hail"); h._x = x; h._y = A.H * 0.3; h.vx = 0; h.vy = rnd(330, 420); h.style.zIndex = 8; hs.push(h);
      }
      const uy = o.umb._y - 44;
      for (const h of hs) {
        if (h.bounce) h.vy += 900 * dt;
        h._x += h.vx * dt; h._y += h.vy * dt; h.style.left = h._x.toFixed(1) + "px"; h.style.top = h._y.toFixed(1) + "px";
        if (!h.bounce && h._y >= uy && h._y < uy + 34 && Math.abs(h._x - ux) < 58) {
          h.bounce = true; h.vy = -rnd(140, 220); h.vx = (h._x < ux ? -1 : 1) * rnd(100, 200); saved++; capNote.textContent = "Закрыто: " + saved;
          if (Math.random() < 0.5) Snd.noise({ type: "highpass", f: 3000, dur: 0.05, gain: 0.12, attack: 0.002 });
        }
        if (!h.bounce && !h.dead) { const fl = o.flowers.find(q => Math.abs(q._x - h._x) < 22 && h._y >= q._y - 30); if (fl) { h.dead = true; hit(fl); } }
        if (h._y > A.H + 20) h.dead = true;
      }
      for (let i = hs.length - 1; i >= 0; i--) if (hs[i].dead) { hs[i].remove(); hs.splice(i, 1); }
      if (e > 12.5 && !hs.length) return done(saved);
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
    return { off() { f.off(); hs.forEach(h => h.remove()); } };
  });
}
/* 113:3 — «От зла мрака»: фонарик в тёмной комнате */
function w5RoomScene(A) {
  const { W, H } = A;
  sky("linear-gradient(180deg,#4A6585 0%,#3D5574 100%)");
  const fl = el("div", "layer"); fl.style.bottom = "0"; fl.style.height = ((H - A.bot + 70) / H * 100).toFixed(1) + "%";
  fl.style.background = "repeating-linear-gradient(90deg,#6B5139 0 40px,#5E4630 40px 42px)";
  const win = obj("w5win", ART.w5_window, W * 0.74, A.top + 50, 86, 86); win.style.zIndex = 3;
  const shelf = el("div", "layer"); Object.assign(shelf.style, { left: "8%", right: "auto", width: "38%", top: (A.top + 70) + "px", height: "10px", background: "#8E5A2E", borderRadius: "4px", zIndex: 3 });
  const bw = Math.min(W * 0.48, 200);
  const bed = obj("w5bedo", ART.w5_bed, W * 0.3, A.bot - bw * 0.53 / 2 - 6, bw, bw * 0.53); bed.style.zIndex = 4;
  const items = [
    obj("w5it", ART.book, W * 0.22, A.top + 70 - 18, 46, 36),
    obj("w5it", ART.w5_ball, W * 0.78, A.bot - 30, 42, 42),
    obj("w5it", ART.w5_slippers, W * 0.56, A.bot - 18, 56, 35)
  ];
  items.forEach(it => { it.style.zIndex = 6; });
  const dark = el("div", "w5dark");
  Snd.amb("wind", 0.25);
  return { items, dark };
}
function w5Torch(o, A) {
  const R = Math.min(68, A.W * 0.17);
  return w5Task(26000, (done, isFin) => {
    let lx = A.W / 2, ly = A.mid, found = 0; const acc = o.items.map(() => 0);
    const paint = () => { o.dark.style.background = `radial-gradient(circle at ${lx.toFixed(0)}px ${ly.toFixed(0)}px, rgba(4,8,22,0) 0, rgba(4,8,22,0) ${R}px, rgba(4,8,22,.95) ${R + 34}px)`; };
    paint();
    capNote.textContent = `Найдено: 0 из ${o.items.length}`;
    const reveal = it => { it.found = true; found++; it.classList.add("w5found"); Snd.sparkle(); w5Burst(it._x, it._y, 10, 50); capNote.textContent = `Найдено: ${found} из ${o.items.length}`; if (found >= o.items.length) setTimeout(() => done(), 1000); };
    let last = performance.now();
    const loop = t => {
      if (isFin()) return; const dt = t - last; last = t;
      o.items.forEach((it, i) => { if (!it.found && Math.hypot(it._x - lx, it._y - ly) < R * 0.8) { acc[i] += dt; if (acc[i] > 250) reveal(it); } });
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
    const f = w5Field({ hover: true, down(p) { lx = p.x; ly = p.y - 50; paint(); }, move(p) { lx = p.x; ly = p.y - 50; paint(); } });
    return {
      off() { f.off(); },
      async auto() {
        for (const it of o.items) {
          if (isFin()) break; if (it.found) continue;
          const sx = lx, sy = ly; for (let i = 1; i <= 20; i++) { lx = sx + (it._x - sx) * i / 20; ly = sy + (it._y - sy) * i / 20; paint(); await sleep(25); }
          if (!it.found) reveal(it); await sleep(400);
        }
        await sleep(1000);
      }
    };
  });
}
/* 113:4 — «От зла колдуний, поплёвывающих на узлы»: узелки развязываются (без изображения колдуний) */
function w5KnotScene(A) {
  const { W } = A;
  sky("linear-gradient(180deg,#3E4C7A 0%,#6A6FA0 55%,#C9A6B8 100%)"); w5Stars(30, "50%");
  const y = A.mid, x0 = W * 0.04, x1 = W * 0.96;
  const ropeL = el("div", "layer", stage, `<svg viewBox="0 0 ${W} ${A.H}" aria-hidden="true"><path class="w5rope" d="M${x0} ${y} Q${W * 0.25} ${y + 18} ${W * 0.5} ${y} T${x1} ${y}" fill="none" stroke="#7A4A24" stroke-width="9" stroke-linecap="round"/><path class="w5rope2" d="M${x0} ${y} Q${W * 0.25} ${y + 18} ${W * 0.5} ${y} T${x1} ${y}" fill="none" stroke="#C98B52" stroke-width="5" stroke-linecap="round"/></svg>`);
  ropeL.style.inset = "0"; ropeL.style.zIndex = 4;
  const ks = Math.min(W * 0.2, 80);
  const knots = [0.2, 0.5, 0.8].map(fx => {
    const kx = W * fx, ky = y + (fx === 0.5 ? 0 : 9);
    const e = obj("w5knot", ART.w5_knot, kx, ky, ks, ks); e.style.zIndex = 6;
    const rw = obj("w5kring", ART.w5_kring, kx, ky, ks * 1.5, ks * 1.5); rw.style.zIndex = 5;
    return { el: e, rw, ring: rw.querySelector(".w5kr"), x: kx, y: ky, p: 0, done: false };
  });
  Snd.amb("wind", 0.3);
  return { knots, rope: ropeL };
}
function w5Knots(o, A) {
  const C = 276.5;
  o.knots[0].el.classList.add("hint");
  return w5Task(26000, (done, isFin) => {
    let cur = null, la = 0, left = o.knots.length;
    const untie = k => {
      k.done = true; left--; k.el.classList.remove("hint"); Snd.whoosh(0.2); Snd.sparkle();
      k.el.animate([{ transform: "rotate(0deg) scale(1)", opacity: 1 }, { transform: "rotate(320deg) scale(.2)", opacity: 0 }], { duration: 700, fill: "forwards" });
      fadeOut(k.rw, 500); w5Burst(k.x, k.y, 12, 50);
      const nx = o.knots.find(q => !q.done); if (nx) nx.el.classList.add("hint");
      if (!left) { o.rope.querySelector(".w5rope2").setAttribute("stroke", "#FFD54F"); setTimeout(() => done(), 1000); }
    };
    const setP = (k, v) => { if (k.done) return; k.p = Math.min(1, v); k.ring.style.strokeDashoffset = ((1 - k.p) * C).toFixed(1); if (k.p >= 1) untie(k); };
    const f = w5Field({
      down(p) { cur = o.knots.filter(k => !k.done).sort((a, b) => w5Dist(a, p) - w5Dist(b, p))[0] || null; if (cur) la = Math.atan2(p.y - cur.y, p.x - cur.x); },
      move(p) {
        if (!cur || cur.done) return;
        const a = Math.atan2(p.y - cur.y, p.x - cur.x); let d = a - la; if (d > Math.PI) d -= 2 * Math.PI; if (d < -Math.PI) d += 2 * Math.PI; la = a;
        if (w5Dist(cur, p) > 14) setP(cur, cur.p + Math.abs(d) / (Math.PI * 2.4));
      },
      up(p, moved) { if (cur && !moved) setP(cur, cur.p + 0.2); cur = null; }
    });
    return { off: () => f.off(), async auto() { for (const k of o.knots) { if (isFin()) break; while (!k.done && !isFin()) { setP(k, k.p + 0.12); await sleep(70); } await sleep(300); } await sleep(1000); } };
  });
}
/* 113:5 — «От зла завистника»: порадоваться за другого и сказать «Ма ша Аллах» */
function w5EnvyScene(A) {
  sky("linear-gradient(180deg,#6CBBE8 0%,#B4E0F5 60%,#EAF6FB 100%)"); sunAt(A.W * 0.84, A.H * 0.36, 100); clouds(2, 0.3, 0.42); hills(0.26);
  Snd.amb("meadow", 0.5);
}
function w5Envy(A) {
  const ids = ["falaq_c1", "falaq_c2", "falaq_c3"], icons = [ART.w5_bike, ART.w5_pic, ART.w5_garden];
  return w5Task(50000, (done, isFin) => {
    let k = -1, card = null, sy = null, dy = 0, busy = false, idle = null, arrow = null;
    const kick = () => { clearTimeout(idle); idle = setTimeout(fly, 13000); };
    const show = () => {
      k++; if (k >= ids.length) { setTimeout(() => done(), 300); return; }
      const cw = Math.min(A.W * 0.74, 300);
      card = obj("w5env", `${icons[k]}<span>${L(ids[k]).replace(/\.$/, "")}</span>`, A.W / 2, A.mid + 10, cw, 190); card.style.zIndex = 9; fadeIn(card, 450);
      Voice.speak(ids[k]); if (!arrow) arrow = w5Arrow(A.W / 2, A.mid - 120, -90); kick();
    };
    const fly = async () => {
      if (busy || !card || isFin()) return; busy = true; clearTimeout(idle);
      const c = card; card = null; c.classList.add("gold"); Snd.sparkle(); w5Burst(c._x, c._y - 40, 16, 90); w5Pop(c._x, c._y - 120, L("falaq_masha").replace(/!$/, ""));
      Voice.speak("falaq_masha");
      await move(c, c._x, -160, 700, "ease-in"); c.remove(); busy = false; show();
    };
    const f = w5Field({
      down(p) { if (card && !busy) { sy = p.y; dy = 0; } },
      move(p) { if (sy == null || !card) return; dy = Math.min(20, p.y - sy); put(card, card._x, A.mid + 10 + dy); },
      up(p, moved) { if (sy == null || !card) return; sy = null; if (dy < -60 || !moved) fly(); else move(card, card._x, A.mid + 10, 250, "ease-out"); }
    });
    show();
    return { off() { f.off(); clearTimeout(idle); if (arrow) arrow.remove(); }, async auto() { while (!isFin() && k < ids.length) { await fly(); await sleep(900); } } };
  });
}
async function chFalaq() {
  const rb = w5Ribbon("113:1-5");
  const dn = await w5Go(w5DawnScene);
  await chapterTitle(null, "Аль-Фаляк", "falaq_0");
  await say("falaq_1");
  rb.show();
  await rb.intro(1, "falaq_a1");
  cue("falaq_a1_do"); await w5Rub(dn, w5A());
  rb.full(true); await say("falaq_a1_try", { btn: "Смотрю" });
  hideCap(); await w5Sunrise(dn, w5A());
  await say("falaq_a1_ok"); rb.done(1);

  const hl = await w5Go(w5HailScene);
  await rb.intro(2, "falaq_a2");
  cue("falaq_a2_do"); await w5Hail(hl, w5A());
  hl.flowers.forEach(f => w5Burst(f._x, f._y - 20, 6, 30));
  await rb.outro(2, "falaq_a2_ok");

  const rm = await w5Go(w5RoomScene);
  await rb.intro(3, "falaq_a3");
  cue("falaq_a3_do"); await w5Torch(rm, w5A());
  rm.dark.style.transition = "opacity 1.2s"; rm.dark.style.opacity = "0.35";
  await rb.outro(3, "falaq_a3_ok");

  const kn = await w5Go(w5KnotScene);
  await rb.intro(4, "falaq_a4");
  cue("falaq_a4_do"); await w5Knots(kn, w5A());
  await rb.outro(4, "falaq_a4_ok");

  await w5Go(w5EnvyScene);
  await rb.intro(5, "falaq_a5");
  cue("falaq_a5_do"); await w5Envy(w5A());
  await rb.outro(5, "falaq_a5_ok");
  rb.remove();
  const misses = await choice("falaq_q", [{ id: "falaq_qa", icon: ICON.w5_umb }, { id: "falaq_qb", icon: ICON.w5_torch }, { id: "falaq_qc", ar: true, ok: true }], "falaq_q_ok");
  await say("falaq_quran");
  await ayahCard("113:1-5");
  await say("falaq_end", { btn: "Буду читать" });
  hideCap(); await award("w5dawn");
  return misses;
}

/* ============ ГЛАВА 4: АН-НАС (114:1-6) ============ */
function w5NightSky(A) {
  sky("linear-gradient(180deg,#0E2238 0%,#1D3D5C 60%,#35577A 100%)"); w5Stars(60, "65%");
  const moon = obj("w5moon", w5Svg("0 0 60 60", '<path d="M36 8 A22 22 0 1 0 54 40 A17 17 0 1 1 36 8Z" fill="#FFE29A"/>'), A.W * 0.84, A.H * 0.34, 50, 50); moon.style.zIndex = 2;
}
/* 114:1 — «Господь людей»: окна города, в каждом доме — люди */
function w5CityScene(A) {
  const { W, H } = A; w5NightSky(A);
  const n = 5, gw = W / n, houses = [], wins = []; let svg = "";
  const cols = ["#2C4A63", "#34536E", "#28445C", "#3A5A76", "#2F4F68"];
  for (let i = 0; i < n; i++) {
    const hw = gw * rnd(0.74, 0.88), hx = i * gw + (gw - hw) / 2, hh = rnd(0.5, 0.88) * (A.bot - A.top - 30), hy = A.bot - hh;
    svg += `<path d="M${hx - 5} ${hy} L${hx + hw / 2} ${hy - 22} L${hx + hw + 5} ${hy}Z" fill="#203A50"/><rect x="${hx}" y="${hy}" width="${hw}" height="${hh + 4}" fill="${cols[i]}"/>`;
    const ww = hw * 0.26, wh = ww * 1.2, rows = Math.min(4, Math.max(2, Math.floor((hh - 16) / (wh + 14)))), mine = [];
    for (let r = 0; r < rows; r++) for (let c = 0; c < 2; c++) {
      const x = hx + hw * (c ? 0.6 : 0.14), y = hy + 14 + r * (wh + 14);
      mine.push(wins.length); wins.push({ x, y }); svg += `<rect class="w5win" x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${ww.toFixed(1)}" height="${wh.toFixed(1)}" rx="2" fill="#16283A"/>`;
    }
    houses.push({ x: hx, y: hy - 22, w: hw, h: hh + 22, wins: mine });
  }
  svg += `<rect x="0" y="${A.bot}" width="${W}" height="${H - A.bot}" fill="#1A2E40"/>`;
  const lay = el("div", "layer", stage, `<svg viewBox="0 0 ${W} ${H}" aria-hidden="true">${svg}</svg>`); lay.style.inset = "0"; lay.style.zIndex = 4;
  Snd.amb("wind", 0.3);
  return { houses, rects: [...lay.querySelectorAll(".w5win")] };
}
function w5Windows(o, A) {
  return w5Task(16000, (done, isFin) => {
    let lit = 0; const total = o.rects.length; const t0 = performance.now();
    capNote.textContent = "Окон: 0";
    const f = w5Field({
      down(p) {
        const h = o.houses.find(q => p.x >= q.x - 6 && p.x <= q.x + q.w + 6 && p.y >= q.y - 10); if (!h) return;
        const dark = h.wins.filter(i => !o.rects[i].lit); if (!dark.length) { Snd.tap(); return; }
        const r = o.rects[dark[Math.floor(Math.random() * dark.length)]]; r.lit = true; r.setAttribute("fill", "#FFD98A"); r.style.filter = "drop-shadow(0 0 6px rgba(255,217,138,.9))";
        lit++; capNote.textContent = "Окон: " + lit; Snd.tap(); if (lit % 4 === 0) Snd.sparkle();
        if (lit >= total) setTimeout(() => done(), 600);
      }
    });
    const tm = setInterval(() => { if (performance.now() - t0 > 14000 && lit >= 6) done(); }, 300);
    return { off() { f.off(); clearInterval(tm); }, async auto() { for (const r of o.rects) { if (isFin() || lit >= 8) break; if (!r.lit) { r.lit = true; r.setAttribute("fill", "#FFD98A"); lit++; capNote.textContent = "Окон: " + lit; Snd.tap(); await sleep(120); } } await sleep(500); } };
  });
}
/* 114:2 — «Царь людей»: нарисовать своё царство на карте */
function w5MapScene(A) {
  const { W, H } = A;
  sky("linear-gradient(180deg,#E9D8B4 0%,#F3E7CC 100%)");
  const mx = W * 0.05, my = A.top + 4, mw = W * 0.9, mh = A.bot - A.top - 12;
  const lands = [[0.27, 0.33, 0.19, 0.2], [0.65, 0.28, 0.24, 0.17], [0.56, 0.68, 0.18, 0.19], [0.2, 0.74, 0.11, 0.12], [0.87, 0.74, 0.08, 0.1]];
  const isLand = (x, y) => lands.some(([cx, cy, rx, ry]) => ((x - mx) / mw - cx) ** 2 / rx ** 2 + ((y - my) / mh - cy) ** 2 / ry ** 2 <= 1);
  const X = u => mx + u * mw, Y = v => my + v * mh;
  let deco = "";
  [[0.24, 0.3], [0.32, 0.38], [0.58, 0.66], [0.7, 0.26], [0.2, 0.74]].forEach(([u, v]) => { deco += `<path d="M${X(u)} ${Y(v) - 12} L${X(u) + 10} ${Y(v) + 6} L${X(u) - 10} ${Y(v) + 6}Z" fill="#8FA6B5"/><path d="M${X(u)} ${Y(v) - 12} L${X(u) + 4} ${Y(v) - 5} L${X(u) - 4} ${Y(v) - 5}Z" fill="#fff"/>`; });
  [[0.3, 0.26], [0.6, 0.3], [0.52, 0.74], [0.62, 0.62], [0.86, 0.74], [0.76, 0.32]].forEach(([u, v]) => { deco += `<circle cx="${X(u)}" cy="${Y(v)}" r="5" fill="#4E9D45"/><rect x="${X(u) - 1}" y="${Y(v) + 4}" width="2" height="5" fill="#7A4A24"/>`; });
  const lay = el("div", "layer", stage, `<svg viewBox="0 0 ${W} ${H}" aria-hidden="true"><rect x="${mx}" y="${my}" width="${mw}" height="${mh}" rx="16" fill="#7CC0E0" stroke="#C9A86A" stroke-width="5"/>
    ${lands.map(([cx, cy, rx, ry]) => `<ellipse cx="${X(cx)}" cy="${Y(cy)}" rx="${rx * mw}" ry="${ry * mh}" fill="#A9D48A" stroke="#7DB86E" stroke-width="3"/>`).join("")}${deco}
    <path d="M${X(0.08)} ${Y(0.12)} q6 -4 12 0 t12 0 M${X(0.82)} ${Y(0.5)} q6 -4 12 0 t12 0 M${X(0.36)} ${Y(0.9)} q6 -4 12 0 t12 0" stroke="#fff" stroke-width="2" fill="none" opacity=".7"/></svg>`);
  lay.style.inset = "0"; lay.style.zIndex = 3;
  Snd.amb("wind", 0.2);
  return { isLand, mx, my, mw, mh };
}
function w5Kingdom(m, A) {
  const inPoly = (x, y, pts) => { let c = false; for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) { const a = pts[i], b = pts[j]; if ((a.y > y) !== (b.y > y) && x < (b.x - a.x) * (y - a.y) / (b.y - a.y) + a.x) c = !c; } return c; };
  return w5Task(22000, (done, isFin) => {
    const lay = el("div", "layer", stage, `<svg viewBox="0 0 ${A.W} ${A.H}" aria-hidden="true"><polygon points="" fill="rgba(245,196,81,.4)"/><polyline points="" fill="none" stroke="#E6A93A" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></svg>`);
    lay.style.inset = "0"; lay.style.zIndex = 6;
    const poly = lay.querySelector("polygon"), line = lay.querySelector("polyline");
    let pts = [], len = 0, going = false;
    const str = a => a.map(p => p.x.toFixed(0) + "," + p.y.toFixed(0)).join(" ");
    const add = p => { const q = { x: w5C(p.x, m.mx, m.mx + m.mw), y: w5C(p.y, m.my, m.my + m.mh) }, l = pts[pts.length - 1]; if (l && w5Dist(q, l) < 4) return; if (l) len += w5Dist(q, l); pts.push(q); line.setAttribute("points", str(pts)); };
    const finish = async () => {
      if (going) return; going = true; f.off();
      line.setAttribute("points", str([...pts, pts[0]])); poly.setAttribute("points", str(pts));
      let land = 0, mine = 0, cx = 0, cy = 0;
      for (let i = 0; i < 60; i++) for (let j = 0; j < 60; j++) { const x = m.mx + m.mw * (i + 0.5) / 60, y = m.my + m.mh * (j + 0.5) / 60; if (m.isLand(x, y)) { land++; if (inPoly(x, y, pts)) mine++; } }
      pts.forEach(p => { cx += p.x / pts.length; cy += p.y / pts.length; });
      const pct = Math.max(1, Math.round(100 * mine / Math.max(1, land)));
      const flag = obj("w5flag", w5Svg("0 0 40 50", '<path d="M8 48 V4" stroke="#5D3B22" stroke-width="3"/><path d="M9 5 H34 L28 13 L34 21 H9Z" fill="#E8584C"/>'), cx, cy - 18, 34, 42); flag.style.zIndex = 7; fadeIn(flag, 400);
      const t = w5Label(A.W / 2, m.my + 26, `Твоё царство: ${pct}% земли`, "tag"); t.style.fontSize = "17px";
      Snd.sparkle(); w5Burst(cx, cy, 14, 60);
      await sleep(1300); done(pct);
    };
    const f = w5Field({ down(p) { if (going) return; pts = []; len = 0; add(p); }, move(p) { if (!going) add(p); }, up() { if (going) return; if (len > 140 && pts.length > 5) finish(); else { pts = []; line.setAttribute("points", ""); } } });
    return {
      off: () => f.off(),
      async auto() {
        if (going) { while (!isFin()) await sleep(100); return; }
        const cx = m.mx + m.mw * 0.27, cy = m.my + m.mh * 0.33, r = Math.min(m.mw, m.mh) * 0.12; pts = []; len = 0;
        for (let i = 0; i <= 24; i++) { const a = i / 24 * Math.PI * 2; add({ x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) }); await sleep(30); }
        await finish();
      }
    };
  });
}
/* 114:3 — «Бог людей»: крутить Землю и находить мечети по всему миру */
const W5_MOSQ = [[0.16, 0.33], [0.2, 0.68], [0.49, 0.29], [0.52, 0.56], [0.7, 0.32], [0.82, 0.7]];
function w5GlobeScene(A) {
  sky("linear-gradient(180deg,#081A2C 0%,#12304A 60%,#1D4462 100%)"); w5Stars(70, "100%");
  const D = Math.min(A.W * 0.74, A.bot - A.top - 30, 300);
  const g = obj("w5globe", `<div class="w5globein"><div class="w5strip">${ART.w5_world}${ART.w5_world}</div><div class="w5shade"></div></div>`, A.W / 2, A.mid, D, D);
  g.style.zIndex = 5;
  const inn = g.querySelector(".w5globein"), strip = g.querySelector(".w5strip");
  strip.querySelectorAll("svg").forEach(s => { s.style.width = (2 * D) + "px"; });
  const marks = W5_MOSQ.map(([u, v]) => ({ u, v, el: el("div", "w5mosq", inn, ART.w5_mosq), lit: false }));
  Snd.amb("wind", 0.2);
  return { g, strip, marks, D };
}
function w5Spin(o, A) {
  const SW = o.D * 2;
  return w5Task(26000, (done, isFin) => {
    let off = 0, v = 0, auto = false, lit = 0, lastX = null, lastT = 0, last = performance.now();
    capNote.textContent = `Мечетей: 0 из ${o.marks.length}`;
    const frame = t => {
      if (isFin()) return;
      const dt = Math.min(0.05, (t - last) / 1000); last = t;
      if (auto) v = 300;
      if (lastX == null) { off += v * dt; if (!auto) v *= Math.pow(0.25, dt); }
      off = ((off % SW) + SW) % SW;
      o.strip.style.transform = `translateX(${(-off).toFixed(1)}px)`;
      o.marks.forEach(m => {
        const x = ((m.u * SW - off) % SW + SW) % SW;
        if (x < o.D) { m.el.style.display = ""; m.el.style.left = x.toFixed(1) + "px"; m.el.style.top = (m.v * o.D).toFixed(1) + "px"; }
        else m.el.style.display = "none";
        if (x < o.D && !m.lit && Math.abs(x - o.D / 2) < o.D * 0.12) {
          m.lit = true; lit++; m.el.classList.add("lit"); Snd.sparkle(); w5Burst(o.g._x - o.D / 2 + x, o.g._y - o.D / 2 + m.v * o.D, 8, 36);
          capNote.textContent = `Мечетей: ${lit} из ${o.marks.length}`;
          if (lit >= o.marks.length) setTimeout(() => done(), 1100);
        }
      });
      requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
    const f = w5Field({
      down(p) { lastX = p.x; lastT = performance.now(); v = 0; o.g.classList.remove("hint"); },
      move(p) { if (lastX == null) return; const now = performance.now(), dx = p.x - lastX; off -= dx; v = -dx / Math.max(0.016, (now - lastT) / 1000); lastX = p.x; lastT = now; },
      up() { lastX = null; v = w5C(v, -900, 900); }
    });
    o.g.classList.add("hint");
    return { off() { f.off(); o.g.classList.remove("hint"); }, async auto() { auto = true; lastX = null; while (!isFin()) await sleep(200); } };
  });
}
/* 114:4 — «Искуситель отступающий»: пузыри с плохими подсказками и щит «А'узу би-Ллях» (шайтана не рисуем) */
const W5_WHISPERS = ["Не делай уроки", "Возьми чужое", "Не помогай", "Скажи неправду", "Не делись", "Не убирай игрушки", "Не слушай маму", "Потом помолишься"];
function w5BubbleScene(A) {
  sky("linear-gradient(180deg,#2E3F63 0%,#4C5F8A 60%,#7D8DB3 100%)"); w5Stars(30, "60%");
  const hy = A.top + (A.bot - A.top) * 0.4;
  const heart = obj("w5heart", ART.w5_heart, A.W / 2, hy, 92, 83); heart.style.zIndex = 6; glowSpot(A.W / 2, hy, 80, "255,170,190").style.zIndex = 5;
  const btn = obj("w5shbtn", `${w5Svg("0 0 48 48", ICON.w5_nas)}<span>А'узу би-Ллях</span>`, A.W / 2, A.bot - 34, Math.min(A.W * 0.8, 280), 58); btn.style.zIndex = 10;
  Snd.amb("wind", 0.3);
  return { heart, btn };
}
function w5Bubbles(o, A) {
  const sched = [0.3, 1.3, 2.6, 5.5, 6.5, 7.6, 10.5, 11.6], sz = Math.min(96, A.W * 0.25);
  return w5Task(30000, (done, isFin) => {
    let spawned = 0, popped = 0; const t0 = performance.now(); let last = t0; const bs = [];
    const pop = b => {
      if (b.dead) return; b.dead = true; popped++; Snd.pop(); w5Burst(b._x, b._y, 10, 60);
      b.animate([{ transform: "scale(1)", opacity: 1 }, { transform: "scale(1.4)", opacity: 0 }], { duration: 260, fill: "forwards" }).onfinish = () => b.remove();
      if (popped >= sched.length) setTimeout(() => done(), 900);
    };
    const shield = () => {
      if (isFin()) return; Snd.whoosh(0.3); o.btn.classList.add("press"); setTimeout(() => o.btn.classList.remove("press"), 150);
      const r = el("div", "w5ring"); r.style.left = o.heart._x + "px"; r.style.top = o.heart._y + "px";
      r.animate([{ width: "60px", height: "60px", opacity: 1 }, { width: (A.W * 2) + "px", height: (A.W * 2) + "px", opacity: 0 }], { duration: 900, easing: "ease-out" }).onfinish = () => r.remove();
      bs.filter(b => !b.dead).forEach((b, i) => setTimeout(() => pop(b), 150 + i * 90));
    };
    o.btn.classList.add("hint");
    o.btn.onpointerdown = ev => { ev.preventDefault(); o.btn.classList.remove("hint"); shield(); };
    const spawn = i => {
      const side = i % 2 ? 1 : -1;
      const b = obj("w5bub", `<span>${W5_WHISPERS[i]}</span>`, side > 0 ? A.W + sz / 2 : -sz / 2, rnd(A.top + 10, A.bot - 130), sz, sz);
      b.style.zIndex = 8; b.sp = rnd(45, 65); b.R = rnd(sz * 0.85, sz * 1.0); b.ph = rnd(0, 6);
      b.onpointerdown = ev => { ev.preventDefault(); pop(b); }; bs.push(b);
    };
    const loop = t => {
      if (isFin()) return;
      const dt = Math.min(0.05, (t - last) / 1000), e = (t - t0) / 1000; last = t;
      while (spawned < sched.length && e >= sched[spawned]) spawn(spawned++);
      bs.forEach(b => {
        if (b.dead) return;
        const dx = o.heart._x - b._x, dy = o.heart._y - b._y, d = Math.hypot(dx, dy);
        if (!b.orb && d > b.R) { b._x += dx / d * b.sp * dt; b._y += dy / d * b.sp * dt; }
        else { if (!b.orb) { b.orb = true; b.ang = Math.atan2(-dy, -dx); } b.ang += dt * 0.5; b._x = o.heart._x + Math.cos(b.ang) * b.R; b._y = o.heart._y + Math.sin(b.ang) * b.R * 0.8; }
        b.style.left = b._x.toFixed(1) + "px"; b.style.top = (b._y + Math.sin(e * 2 + b.ph) * 4).toFixed(1) + "px";
      });
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
    return { off() { o.btn.onpointerdown = null; o.btn.classList.remove("hint"); bs.forEach(b => { if (!b.dead) b.remove(); }); }, async auto() { while (!isFin()) { while (spawned < sched.length) await sleep(200); shield(); await sleep(1500); } } };
  });
}
/* 114:5 — «Наущает в груди людей»: наполнить сердце добрыми мыслями */
function w5HeartScene(A) {
  sky("linear-gradient(180deg,#2E3F63 0%,#4C5F8A 60%,#7D8DB3 100%)"); w5Stars(30, "60%");
  const heart = obj("w5heartf", ART.w5_heartfill, A.W / 2, A.top + 70, 130, 117); heart.style.zIndex = 6;
  const ws = [0, 1, 2].map(i => { const b = obj("w5bub sm", "<span>шш...</span>", heart._x, heart._y, 54, 54); b.style.zIndex = 5; b._a = i * 2.1; b.style.pointerEvents = "none"; return b; });
  const cw = Math.min(A.W * 0.42, 170), gy = A.bot - 40;
  const cards = [1, 2, 3, 4].map(i => { const c = obj("w5good", L("nas_g" + i).replace(/\.$/, ""), A.W * (i % 2 ? 0.27 : 0.73), gy - (i <= 2 ? 64 : 0), cw, 52); c.style.zIndex = 8; c._id = "nas_g" + i; return c; });
  Snd.amb("wind", 0.3);
  return { heart, ws, cards };
}
function w5FillHeart(o, A) {
  const fill = o.heart.querySelector(".w5hf");
  return w5Task(30000, (done, isFin) => {
    let n = 0; const t0 = performance.now();
    const loop = t => {
      if (isFin()) return; const e = (t - t0) / 1000;
      o.ws.forEach(b => { if (b.gone) return; const a = b._a + e * 0.7; put(b, o.heart._x + Math.cos(a) * 95, o.heart._y + Math.sin(a) * 52); });
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
    const accept = c => {
      c.locked = true; c.classList.remove("hint"); n++; Voice.speak(c._id);
      c.animate([{ transform: "scale(1)", opacity: 1 }, { transform: "scale(.2)", opacity: 0 }], { duration: 380, fill: "forwards" });
      move(c, o.heart._x, o.heart._y, 380, "ease-in").then(() => c.remove());
      const f = n / o.cards.length; fill.setAttribute("y", (90 - f * 86).toFixed(1)); fill.setAttribute("height", (f * 86).toFixed(1));
      Snd.sparkle(); w5Burst(o.heart._x, o.heart._y, 12, 60);
      const w = o.ws.find(b => !b.gone);
      if (w) { w.gone = true; Snd.pop(); w.animate([{ transform: "scale(1)", opacity: 1 }, { transform: "scale(1.5)", opacity: 0 }], { duration: 300, fill: "forwards" }).onfinish = () => w.remove(); }
      if (n >= o.cards.length) { o.ws.forEach(b => { if (!b.gone) { b.gone = true; fadeOut(b, 300); } }); setTimeout(() => done(), 1300); }
      return true;
    };
    const offD = w5Drags(o.cards, c => w5D(c, o.heart) < 95 ? accept(c) : false);
    o.cards[0].classList.add("hint");
    return { off: offD, async auto() { for (const c of o.cards) { if (isFin()) break; if (!c.locked) { await move(c, o.heart._x, o.heart._y + 30, 450); accept(c); await sleep(500); } } await sleep(1300); } };
  });
}
/* 114:6 — «Из джиннов и людей»: хороший совет — вправо, плохой — влево */
function w5AdviceScene(A) {
  sky("linear-gradient(180deg,#9FD3E6 0%,#CFEAF3 60%,#EEF6F2 100%)"); hills(0.2, ["#B9DCA8", "#9CCB88", "#7FB86E"]);
  const zw = Math.max(64, A.W * 0.2), h = A.bot - A.top;
  const no = el("div", "w5zone no", stage, w5Svg("0 0 48 48", '<path d="M12 12 L36 36 M36 12 L12 36" stroke="#D9665B" stroke-width="7" stroke-linecap="round"/>'));
  Object.assign(no.style, { left: "8px", top: A.top + "px", width: zw + "px", height: h + "px" });
  const yes = el("div", "w5zone yes", stage, w5Svg("0 0 48 48", '<path d="M10 25 L20 35 L38 13" stroke="#3FA66A" stroke-width="7" fill="none" stroke-linecap="round" stroke-linejoin="round"/>'));
  Object.assign(yes.style, { right: "8px", top: A.top + "px", width: zw + "px", height: h + "px" });
  Snd.amb("meadow", 0.4);
}
function w5Advice(A) {
  const cards = [["nas_c1", true], ["nas_c2", false], ["nas_c3", true], ["nas_c4", false]];
  const cw = Math.min(A.W * 0.56, 240);
  return w5Task(70000, (done, isFin) => {
    let k = -1, card = null, off = null, busy = false, idle = null;
    const kick = () => { clearTimeout(idle); idle = setTimeout(autoOne, 15000); };
    const show = () => {
      k++; if (k >= cards.length) { setTimeout(() => done(), 300); return; }
      card = obj("w5adv", L(cards[k][0]).replace(/\.$/, ""), A.W / 2, A.mid, cw, 150); card.style.zIndex = 9; fadeIn(card, 400);
      Voice.speak(cards[k][0]); kick();
    };
    const send = async yes => {
      if (busy || !card) return;
      if (yes === cards[k][1]) {
        busy = true; clearTimeout(idle); const c = card; card = null; capNote.textContent = "";
        Snd.sparkle(); w5Burst(c._x, c._y, 14, 70); await move(c, yes ? A.W + 200 : -200, c._y, 450, "ease-in"); c.remove(); busy = false; show();
      } else {
        Snd.thud(0.3); capNote.textContent = L("nas_c_wrong"); Voice.speak("nas_c_wrong");
        card.style.transform = ""; card.classList.remove("wob"); void card.offsetWidth; card.classList.add("wob");
        await move(card, A.W / 2, A.mid, 300, "ease-out"); kick();
      }
    };
    const autoOne = async () => { if (!card || busy || isFin()) return; const g = cards[k][1]; await move(card, A.W * (g ? 0.8 : 0.2), A.mid, 500); if (card) send(g); };
    const f = w5Field({
      down(p) { if (card && !busy) off = p.x - card._x; },
      move(p) { if (off == null || !card || busy) return; const x = p.x - off; put(card, x, A.mid); card.style.transform = `rotate(${((x - A.W / 2) * 0.06).toFixed(1)}deg)`; },
      up() {
        if (off == null || !card) return; off = null; const x = card._x; card.style.transform = "";
        if (x < A.W * 0.32) send(false); else if (x > A.W * 0.68) send(true); else move(card, A.W / 2, A.mid, 250, "ease-out");
      }
    });
    show();
    return { off() { f.off(); clearTimeout(idle); }, async auto() { while (!isFin() && k < cards.length) { while (busy) await sleep(100); await autoOne(); await sleep(700); } } };
  });
}
async function chNas() {
  const rb = w5Ribbon("114:1-6");
  const ct = await w5Go(w5CityScene);
  await chapterTitle(null, "Ан-Нас", "nas_0");
  await say("nas_1");
  rb.show();
  await rb.intro(1, "nas_a1");
  cue("nas_a1_do"); await w5Windows(ct, w5A());
  const A1 = w5A(), big = w5Label(A1.W / 2, A1.top + (A1.bot - A1.top) * 0.22, "8 000 000 000<small>людей на Земле</small>", "big"); big.style.zIndex = 9; fadeIn(big, 600); Snd.sparkle();
  await rb.outro(1, "nas_a1_ok");

  const mp = await w5Go(w5MapScene);
  await rb.intro(2, "nas_a2");
  cue("nas_a2_do"); await w5Kingdom(mp, w5A());
  await rb.outro(2, "nas_a2_ok");

  const gl = await w5Go(w5GlobeScene);
  await rb.intro(3, "nas_a3");
  cue("nas_a3_do"); await w5Spin(gl, w5A());
  await rb.outro(3, "nas_a3_ok");

  const bb = await w5Go(w5BubbleScene);
  await rb.intro(4, "nas_a4");
  cue("nas_a4_do"); await w5Bubbles(bb, w5A());
  await rb.outro(4, "nas_a4_ok");

  const ht = await w5Go(w5HeartScene);
  await rb.intro(5, "nas_a5");
  cue("nas_a5_do"); await w5FillHeart(ht, w5A());
  await rb.outro(5, "nas_a5_ok");

  await w5Go(w5AdviceScene);
  await rb.intro(6, "nas_a6");
  cue("nas_a6_do"); await w5Advice(w5A());
  await rb.outro(6, "nas_a6_ok");
  rb.remove();
  const misses = await choice("nas_q", [{ id: "nas_qa", icon: ICON.w5_blanket }, { id: "nas_qc", ar: true, ok: true }, { id: "nas_qb", icon: ICON.w5_run }], "nas_q_ok");
  await say("nas_quran");
  await ayahCard("114:1-6");
  await say("nas_end", { btn: "А'узу би-Ллях" });
  hideCap(); await award("w5shield");
  return misses;
}

regChapter(4, { id: "fatiha", name: "Аль-Фатиха", icon: ICON.w5_fatiha, fn: chFatiha, lines: "fatiha_" });
regChapter(4, { id: "ikhlas", name: "Аль-Ихлас", icon: ICON.w5_ikhlas, fn: chIkhlas, lines: "ikhlas_" });
regChapter(4, { id: "falaq", name: "Аль-Фаляк", icon: ICON.w5_falaq, fn: chFalaq, lines: "falaq_" });
regChapter(4, { id: "nas", name: "Ан-Нас", icon: ICON.w5_nas, fn: chNas, lines: "nas_" });
