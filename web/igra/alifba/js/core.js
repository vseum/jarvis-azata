"use strict";
/* «Алиф-Ба»: уровни, арабский звук, общие механики и уровень 1 (знакомство с буквами).
   Подключается после ../js/chapters.js — оттуда декорации (sky, hills, clouds, ART…) и levelDone/certificate.
   Свои WORLDS/ITEMS/chIntro/chFinal заменяют «Аяты вокруг нас». Главы уровней 2–5 — в l2.js…l5.js. */

/* ============ УРОВНИ ============ */
WORLDS.length = 0;
[
  { t: "Буквы", s: "Знакомимся со всем алфавитом", ch: [] },
  { t: "Буквы в слове", s: "Как буквы соединяются и меняются", ch: [] },
  { t: "Огласовки", s: "Фатха, кясра, дамма: звуки а, и, у", ch: [] },
  { t: "Сукун, танвин, долгие звуки", s: "Закрытые, двойные и длинные слоги", ch: [] },
  { t: "Читаем Коран", s: "Шадда, аль- и первые слова", ch: [] }
].forEach(w => WORLDS.push(w));
for (const k in REG) delete REG[k];

/* Копилка букв вместо сокровищ: каждая буква — карточка */
const glyphSvg = (ch, fill = "#1F5B74") => `<rect x="6" y="6" width="88" height="88" rx="22" fill="#FFF6DA" stroke="#E2C77E" stroke-width="3"/><text x="50" y="68" text-anchor="middle" font-family="Amiri, serif" font-size="58" font-weight="700" fill="${fill}">${ch}</text>`;
ITEMS.length = 0;
LETTERS.forEach(l => ITEMS.push({ id: "L_" + l.id, name: l.ru, svg: glyphSvg(l.ch) }));
/* Значок главы: буква в кружке (svg 48×48 без тега svg) */
const chIcon = ch => `<circle cx="24" cy="24" r="21" fill="#FFF6DA" stroke="#E2C77E" stroke-width="2"/><text x="24" y="33" text-anchor="middle" font-family="Amiri, serif" font-size="28" font-weight="700" fill="#1F5B74">${ch}</text>`;

/* Несколько букв в копилку разом, одной всплывашкой */
async function awardLetters(ids) {
  const fresh = ids.filter(id => !Save.d.items.includes("L_" + id));
  fresh.forEach(id => Save.d.items.push("L_" + id)); Save.save(); updateBag(true);
  if (!fresh.length) return;
  Snd.chirp && Snd.chirp(); celebrate();
  await toast(`<div class="al-tl">${fresh.map(id => `<span>${LET[id].ch}</span>`).join("")}</div><b>${fresh.length > 1 ? "Новые буквы" : "Новая буква"}</b><i>${GAME.award}</i>`, 2400);
}

/* ============ АРАБСКИЙ ЗВУК ============ */
/* voice/ar/<id>.mp3: названия букв, слоги, слова. Сейчас синтез-заглушка, перед запуском — живые записи с теми же id */
const AR = {
  have: new Set(), ready: null,
  load() { return this.ready || (this.ready = fetch(ROOT + "voice/ar/manifest.json", { cache: "no-cache" }).then(r => r.ok ? r.json() : []).catch(() => []).then(a => { this.have = new Set(a); })); },
  /* Промис — когда звук договорён (или его нет/звук выключен) */
  say(id) {
    return new Promise(async res => {
      Voice.stop(); const my = Voice.seq;
      await this.load();
      if (!Voice.on || !Snd.ac || !this.have.has(id)) return setTimeout(res, 350);
      try {
        const b = await Voice.buffer("ar", id);
        if (my !== Voice.seq) return res();
        cap.classList.add("talk");
        Voice.play(b, () => { if (my === Voice.seq) cap.classList.remove("talk"); res(); });
      } catch (e) { res(); }
    });
  }
};
AR.load();

/* Буква Йа с точками. Шрифт мусхафа рисует одиночную и конечную ي без точек (так в Коране), в азбуке это путает.
   Короткие надписи (буква, слог) с такой Йа переводим на Amiri; слова и аяты остаются шрифтом мусхафа */
const YA_ISO = /ي[\u064B-\u0652\u0670]*(?![\u064B-\u0652\u0670]*[\u0620-\u064A\u200D\u0640])/;
function yaFix(root) {
  const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  for (let n = w.nextNode(); n; n = w.nextNode()) {
    const t = n.nodeValue, base = t.replace(/[^\u0620-\u064A]/g, "");
    if (base.length && base.length <= 3 && YA_ISO.test(t) && n.parentElement) n.parentElement.style.fontFamily = '"Amiri Letters", "Amiri", serif';
  }
}
new MutationObserver(ms => ms.forEach(m => m.addedNodes.forEach(nd => nd.nodeType === 1 ? yaFix(nd) : nd.nodeType === 3 && nd.parentElement && yaFix(nd.parentElement)))).observe(document.body, { childList: true, subtree: true });

/* Реплика рассказчика, а за ней арабский звук (дважды — лучше запоминается). Кнопка «Дальше», автонажатие как у say */
async function sayAr(id, arId, opt = {}) {
  showCap(id, opt.note, opt.named); capLine.ar = arId;
  const p = Voice.speak(id, opt.named).then(() => sleep(200)).then(() => AR.say(arId)).then(() => opt.once ? null : sleep(350).then(() => AR.say(arId)));
  await sleep(500);
  const b = button(opt.btn || "Дальше");
  p.then(() => b.classList.add("glow"));
  autoNext(b, p, L(id));
  await clicked(b);
  Voice.stop(); capBtns.innerHTML = "";
}

/* ============ СЦЕНА ============ */
addCSS(`
.al-glyph { display: grid; place-items: center; border-radius: 28px; background: linear-gradient(180deg, #FFFDF5, #FFF1CF);
  box-shadow: 0 6px 0 #E2C77E, 0 18px 30px -14px rgba(0,0,0,.45); font-family: "Amiri", serif; font-weight: 700; color: #1F5B74;
  line-height: 1; cursor: pointer; transition: transform .15s; user-select: none; -webkit-user-select: none; }
.al-glyph span { display: block; transform: translateY(6%); }
.al-glyph:active { transform: scale(.94); }
.al-glyph.hl { box-shadow: 0 6px 0 #E2C77E, 0 0 0 5px rgba(245,196,81,.9), 0 18px 30px -14px rgba(0,0,0,.45); }
.al-glyph.ok { background: linear-gradient(180deg, #F2FFF6, #D6F2E1); box-shadow: 0 6px 0 #A9D9BC, 0 0 0 4px rgba(70,185,122,.7); }
.al-glyph.no { animation: shake .42s; opacity: .55; }
.al-pic { display: grid; place-items: center; border-radius: 22px; background: rgba(255,255,255,.88); box-shadow: 0 10px 22px -12px rgba(0,0,0,.4); }
.al-pic svg { width: 78%; height: 78%; }
.al-word { position: absolute; transform: translate(-50%, -50%); font-family: "Amiri", serif; font-weight: 700; color: #fff; text-shadow: 0 3px 12px rgba(0,0,0,.4); direction: rtl; white-space: nowrap; }
.al-word b { color: #FFD66B; }
.al-wcap { position: absolute; transform: translate(-50%, 0); font-weight: 900; font-size: 18px; color: #fff; text-shadow: 0 2px 8px rgba(0,0,0,.4); }
.al-trace { position: absolute; transform: translate(-50%, -50%); border-radius: 28px; background: rgba(10,30,45,.35); box-shadow: inset 0 0 0 2px rgba(255,236,180,.35); }
.al-start { position: absolute; width: 26px; height: 26px; margin: -13px 0 0 -13px; border-radius: 50%; background: #FFD66B; box-shadow: 0 0 0 6px rgba(255,214,107,.35); animation: al-pulse 1.1s ease-in-out infinite; pointer-events: none; }
@keyframes al-pulse { 50% { transform: scale(1.35); } }
.al-shine { animation: al-shine 1s ease-out; }
@keyframes al-shine { 30% { box-shadow: 0 0 0 10px rgba(255,214,107,.5); } }
.al-bub { position: absolute; display: grid; place-items: center; border-radius: 50%; font-family: "Amiri", serif; font-weight: 700; color: #1F5B74;
  background: radial-gradient(circle at 32% 28%, #fff 0 12%, rgba(255,255,255,.85) 13%, rgba(190,230,250,.75) 60%, rgba(120,190,230,.7));
  box-shadow: inset 0 -6px 14px rgba(40,110,160,.25), 0 8px 16px -10px rgba(0,0,0,.4); cursor: pointer; user-select: none; -webkit-user-select: none; }
.al-bub span { transform: translateY(6%); }
.al-basket { position: absolute; transform: translate(-50%, -50%); pointer-events: none; }
.al-fall { position: absolute; transform: translate(-50%, -50%); display: grid; place-items: center; border-radius: 18px; background: #FFF6DA; box-shadow: 0 4px 0 #E2C77E;
  font-family: "Amiri", serif; font-weight: 700; color: #1F5B74; pointer-events: none; }
.al-fall span { transform: translateY(6%); }
.al-card { position: absolute; transform: translate(-50%, -50%); perspective: 600px; cursor: pointer; }
.al-card i { position: absolute; inset: 0; border-radius: 18px; backface-visibility: hidden; -webkit-backface-visibility: hidden; transition: transform .35s; display: grid; place-items: center; }
.al-card .bk { background: linear-gradient(160deg, #2B6E8A, #1C5169); box-shadow: 0 4px 0 #123B4D; }
.al-card .bk::after { content: "؟"; font-family: "Amiri", serif; font-size: 34px; color: rgba(255,255,255,.35); }
.al-card .fr { transform: rotateY(180deg); background: #FFF6DA; box-shadow: 0 4px 0 #E2C77E; font-family: "Amiri", serif; font-weight: 700; color: #1F5B74; }
.al-card.open .bk { transform: rotateY(180deg); } .al-card.open .fr { transform: none; }
.al-card.done .fr { background: #DCF2E3; box-shadow: 0 4px 0 #A9D9BC; }
.al-tl { display: flex; gap: 8px; justify-content: center; direction: rtl; font-family: "Amiri", serif; font-size: 40px; font-weight: 700; color: #1F5B74; margin-bottom: 4px; }
.al-board { position: absolute; left: 50%; transform: translateX(-50%); display: grid; grid-template-columns: repeat(6, 1fr); gap: 8px; direction: rtl; width: min(94%, 480px); }
.al-board .al-glyph { position: static; height: 54px; font-size: 32px; border-radius: 14px; box-shadow: 0 4px 0 #E2C77E; }
@media (max-width: 380px) { .al-board { grid-template-columns: repeat(5, 1fr); } .al-board .al-glyph { height: 48px; font-size: 28px; } }
`);

/* Небо уроков: тёплый рассвет над холмами */
function alScene(pal = 0) {
  const skies = ["linear-gradient(180deg,#5FB4E6 0%,#A9DDF4 55%,#F6E7C4 100%)", "linear-gradient(180deg,#2C5D8C 0%,#7FA9CF 50%,#F2D9B0 100%)",
    "linear-gradient(180deg,#6BA8D8 0%,#BFE0F2 60%,#F8EFD8 100%)", "linear-gradient(180deg,#24557A 0%,#C98A6B 60%,#F6D79A 100%)"];
  sky(skies[pal % skies.length]);
  const { W, H } = size(); clouds(2, 0.2, 0.32); hills(0.22); vignette();
  return { W, H };
}
/* Большая буква-карточка; нажали — звучит её название */
function bigGlyph(l, x, y, sz, text) {
  const e = obj("al-glyph", `<span>${text || l.ch}</span>`, x, y, sz, sz); e.style.fontSize = (sz * 0.62) + "px"; e.style.zIndex = 6;
  e.onclick = () => { Snd.tap(); AR.say("ar_name_" + l.id); };
  return e;
}

/* Картинки к словам-примерам: только предметы и природа */
const PIC = {
  earth: '<circle cx="50" cy="50" r="40" fill="#5EB1E6"/><path d="M28 30 Q40 22 48 32 Q44 44 32 46 Q22 42 28 30Z M56 52 Q70 46 76 58 Q70 72 58 70 Q52 62 56 52Z M40 66 Q48 62 50 72 Q44 80 38 74Z" fill="#6DBB63"/>',
  house: ART.house, book: ART.book, bread: ART.bread, stone: ART.rock, rock: ART.rock, sun: ART.sun, cloud: ART.cloud, bucket: ART.bucket, light: ART.lantern, grapes: ART.vine,
  fruit: '<circle cx="36" cy="58" r="20" fill="#E8584C"/><circle cx="64" cy="58" r="20" fill="#F5A623"/><circle cx="50" cy="38" r="18" fill="#9CCB5A"/><path d="M50 20 V12" stroke="#7A5230" stroke-width="4" stroke-linecap="round"/>',
  fig: '<path d="M50 14 Q56 14 56 22 Q80 34 78 60 Q74 86 50 88 Q26 86 22 60 Q20 34 44 22 Q44 14 50 14Z" fill="#8E5A9E"/><path d="M50 14 V22" stroke="#5E8A3A" stroke-width="5" stroke-linecap="round"/><path d="M38 52 Q50 62 62 52" stroke="#C99AD6" stroke-width="3" fill="none"/>',
  mountain: '<path d="M6 86 L38 30 L52 50 L64 34 L94 86Z" fill="#7F93A3"/><path d="M38 30 L30 44 L38 40 L44 46Z M64 34 L58 44 L64 41 L70 45Z" fill="#fff"/>',
  gold: '<path d="M18 70 L30 48 H70 L82 70Z" fill="#F0B43C"/><path d="M30 48 L38 34 H62 L70 48Z" fill="#FFD66B"/><path d="M36 40 H48" stroke="#fff" stroke-width="4" stroke-linecap="round"/>',
  pomegranate: '<circle cx="50" cy="56" r="32" fill="#C83A3A"/><path d="M40 26 L44 16 L50 24 L56 16 L60 26Z" fill="#9C2B2B"/><circle cx="40" cy="48" r="6" fill="#E46A6A"/>',
  olive: '<path d="M14 80 Q50 50 88 20" stroke="#7A5230" stroke-width="4" fill="none"/><ellipse cx="34" cy="58" rx="7" ry="10" fill="#6B8E23" transform="rotate(-40 34 58)"/><ellipse cx="58" cy="40" rx="7" ry="10" fill="#556B2F" transform="rotate(-40 58 40)"/><path d="M44 54 Q36 40 46 36 Q52 46 44 54Z M70 34 Q66 22 76 20 Q80 30 70 34Z" fill="#8FBF5A"/>',
  sky: '<rect x="8" y="12" width="84" height="76" rx="14" fill="#7EC3EC"/><circle cx="70" cy="34" r="10" fill="#FFD66B"/>' + '<path d="M22 64 Q24 52 36 54 Q40 44 52 48 Q62 46 62 58 Q72 58 70 68 H24Z" fill="#fff"/>',
  clay: '<path d="M30 30 H70 L66 42 Q82 56 74 76 Q66 88 50 88 Q34 88 26 76 Q18 56 34 42Z" fill="#C67B4E"/><path d="M30 30 H70" stroke="#9E5A33" stroke-width="5" stroke-linecap="round"/>',
  shade: ART.palm,
  dawn: '<rect x="6" y="56" width="88" height="32" rx="6" fill="#E9C38A"/><path d="M22 56 A28 28 0 0 1 78 56Z" fill="#F5A623"/><path d="M50 14 V24 M24 26 L30 34 M76 26 L70 34 M10 46 H20 M80 46 H90" stroke="#F5A623" stroke-width="4" stroke-linecap="round"/>',
  moon: '<path d="M60 14 A36 36 0 1 0 86 70 A30 30 0 1 1 60 14Z" fill="#FFE29A"/>',
  night: '<rect x="8" y="12" width="84" height="76" rx="14" fill="#1B3556"/><path d="M60 26 A16 16 0 1 0 74 50 A13 13 0 1 1 60 26Z" fill="#FFE29A"/><circle cx="26" cy="30" r="2.5" fill="#fff"/><circle cx="36" cy="60" r="2" fill="#fff"/><circle cx="58" cy="72" r="2.5" fill="#fff"/>',
  water: '<path d="M50 10 Q78 46 78 62 A28 28 0 0 1 22 62 Q22 46 50 10Z" fill="#6BC0E6"/><path d="M36 62 a14 14 0 0 0 12 14" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round"/>',
  star: '<path d="M50 10 L60 38 L90 38 L66 56 L75 86 L50 68 L25 86 L34 56 L10 38 L40 38Z" fill="#FFD66B" stroke="#E6A93A" stroke-width="3" stroke-linejoin="round"/>',
  crescent: '<path d="M58 12 A38 38 0 1 0 88 66 A32 32 0 1 1 58 12Z" fill="#FFD66B"/>',
  leaf: '<path d="M20 80 Q16 30 80 18 Q86 70 30 82Z" fill="#6DBB63"/><path d="M24 76 Q46 50 74 26" stroke="#3F8E46" stroke-width="3" fill="none"/>',
  day: '<circle cx="50" cy="50" r="18" fill="#FFD66B"/><path d="M50 14 V24 M50 76 V86 M14 50 H24 M76 50 H86 M24 24 L31 31 M69 69 L76 76 M76 24 L69 31 M31 69 L24 76" stroke="#F5A623" stroke-width="5" stroke-linecap="round"/>'
};

/* ============ МЕХАНИКИ ============ */
/* Таймер бездействия с потолком (касания не могут откладывать автоход бесконечно) */
function alIdle(ms, fn) {
  const end = Date.now() + ms * 4; let t = setTimeout(fn, ms);
  return { poke() { clearTimeout(t); t = setTimeout(fn, Math.max(0, Math.min(ms, end - Date.now()))); }, stop() { clearTimeout(t); } };
}

/* Обвести букву: палец «прокрашивает» её золотом; готово на 70%. host — элемент-холст */
function alTrace(host, text, idleMs = 18000) {
  return new Promise(async res => {
    try { await Promise.race([Promise.all([document.fonts.load('700 120px "Amiri"', text), document.fonts.load('700 120px "Amiri Letters"', text)]), sleep(2500)]); } catch (e) {}
    const w = host.clientWidth, h = host.clientHeight, dpr = Math.min(2, window.devicePixelRatio || 1);
    const mk = () => { const c = document.createElement("canvas"); c.width = Math.round(w * dpr); c.height = Math.round(h * dpr); const x = c.getContext("2d"); x.scale(dpr, dpr); return [c, x]; };
    const [cv, ctx] = mk(); cv.style.cssText = `width:${w}px;height:${h}px;display:block;touch-action:none`; host.appendChild(cv);
    const [gold, gx] = mk();
    let fs = h * 0.72;
    const fam = YA_ISO.test(text) ? '"Amiri Letters"' : "Amiri";
    const setF = x => { x.font = `700 ${fs}px ${fam}, "Times New Roman", serif`; x.direction = "rtl"; x.textAlign = "center"; x.textBaseline = "alphabetic"; };
    setF(gx); const tw = gx.measureText(text).width; if (tw > w * 0.8) { fs *= w * 0.8 / tw; setF(gx); }
    const m = gx.measureText(text), asc = m.actualBoundingBoxAscent || fs * 0.7, desc = m.actualBoundingBoxDescent || fs * 0.25;
    const by = h / 2 + (asc - desc) / 2;
    const gr = gx.createLinearGradient(0, by - asc, 0, by + desc); gr.addColorStop(0, "#FFF4C2"); gr.addColorStop(1, "#F0B43C");
    gx.fillStyle = gr; gx.fillText(text, w / 2, by);
    setF(ctx); ctx.fillStyle = "rgba(255,240,200,.14)"; ctx.fillText(text, w / 2, by);
    ctx.setLineDash([7, 6]); ctx.lineWidth = 2.4; ctx.strokeStyle = "rgba(255,236,180,.95)"; ctx.strokeText(text, w / 2, by); ctx.setLineDash([]);
    const data = gx.getImageData(0, 0, gold.width, gold.height).data;
    let left = [];
    for (let y = 2; y < h; y += 4) for (let x = 2; x < w; x += 4) { const i = (Math.round(y * dpr) * gold.width + Math.round(x * dpr)) * 4 + 3; if (data[i] > 120) left.push({ x, y }); }
    const total = left.length || 1; let done = 0, fin = false, down = false, last = null;
    const R = Math.max(16, fs * 0.09);
    const sc = p => p.x - p.y * 0.6;   // начало — сверху справа: так начинают писать арабские буквы (у Алифа — верх)
    const st = left.reduce((a, p) => (sc(p) > sc(a) ? p : a), left[0] || { x: w * 0.8, y: h / 2 });
    const dot = el("div", "al-start", host); dot.style.left = st.x + "px"; dot.style.top = st.y + "px";
    const paintAt = (x, y) => {
      ctx.save(); ctx.beginPath(); ctx.arc(x, y, R, 0, Math.PI * 2); ctx.clip(); ctx.drawImage(gold, 0, 0, w, h); ctx.restore();
      const r2 = R * R, before = left.length;
      left = left.filter(p => (p.x - x) ** 2 + (p.y - y) ** 2 > r2);
      const n = before - left.length;
      if (n) { done += n; if (Math.random() < 0.3) Snd.noise({ f: rnd(2200, 3200), q: 8, dur: 0.08, gain: 0.05 }); }
      if (done / total >= 0.7) finish();
    };
    const pos = ev => { const r = cv.getBoundingClientRect(); return { x: ev.clientX - r.left, y: ev.clientY - r.top }; };
    const stroke = p => {
      if (last) { const d = Math.hypot(p.x - last.x, p.y - last.y), n = Math.max(1, Math.ceil(d / (R * 0.5))); for (let i = 1; i <= n && !fin; i++) paintAt(last.x + (p.x - last.x) * i / n, last.y + (p.y - last.y) * i / n); }
      else paintAt(p.x, p.y);
      last = p;
    };
    const dn = ev => { ev.preventDefault(); if (fin) return; down = true; last = null; dot.style.display = "none"; idle.poke(); stroke(pos(ev)); };
    const mv = ev => { if (!down || fin) return; idle.poke(); stroke(pos(ev)); };
    const up = () => { down = false; last = null; };
    cv.addEventListener("pointerdown", dn); window.addEventListener("pointermove", mv); window.addEventListener("pointerup", up); window.addEventListener("pointercancel", up);
    const auto = async () => { if (fin) return; dot.style.display = "none"; left.sort((a, b) => sc(b) - sc(a)); while (!fin && left.length) { const p = left[0]; paintAt(p.x, p.y); await sleep(20); } };
    const idle = alIdle(idleMs, auto);
    function finish() {
      if (fin) return; fin = true; idle.stop();
      cv.removeEventListener("pointerdown", dn); window.removeEventListener("pointermove", mv); window.removeEventListener("pointerup", up); window.removeEventListener("pointercancel", up);
      dot.remove(); ctx.drawImage(gold, 0, 0, w, h);
      host.classList.add("al-shine"); Snd.sparkle(); setTimeout(res, 800);
    }
  });
}
/* Обвести букву на сцене (рамка по центру) */
async function traceLetter(text, line = "a_trace") {
  const { W, H } = size();
  const s = Math.min(W * 0.78, H * 0.4, 340);
  const host = el("div", "al-trace", stage); Object.assign(host.style, { left: W / 2 + "px", top: H * 0.58 + "px", width: s + "px", height: s + "px", zIndex: 7 });
  cue(line);
  await alTrace(host, text);
  Snd.chirp && Snd.chirp(); capNote.textContent = L("a_trace_ok");
  await sleep(700); capNote.textContent = ""; fadeOut(host, 400);
}

/* Звук слога/названия для буквы: что звучит, когда «буква зовёт» */
const sndOf = (l, kind = "name") => kind === "name" ? "ar_name_" + l.id : `ar_${l.id}_${kind}`;

/* Шарики: звучит буква — лопни шарик с ней. Раунд за раундом по targets. Возвращает число ошибок */
function bubbles(targets, pool, kind = "name", timeout = 45000) {
  return new Promise(res => {
    const { W, H } = size();
    let r = 0, misses = 0, fin = false, cur = targets[0], spawnT = null, live = [];
    const end = () => { if (fin) return; fin = true; clearInterval(spawnT); clearTimeout(capT); live.forEach(b => b.remove()); res(misses); };
    const capT = setTimeout(end, timeout);
    const ask = async () => { if (fin) return; cur = targets[r]; capNote.textContent = "Ищем: " + cur.ru; await AR.say(sndOf(cur, kind)); };
    const spawn = () => {
      if (fin || live.length > 7) return;
      const want = live.filter(b => b._l === cur).length < 2 && Math.random() < 0.5;
      const l = want || !pool.length ? cur : pool[Math.floor(Math.random() * pool.length)];
      const sz = Math.min(W * 0.2, 92), b = el("div", "al-bub", stage, `<span>${kind === "name" ? l.ch : (typeof syl === "function" ? syl(l, kind) : l.ch)}</span>`);
      b.style.width = b.style.height = sz + "px"; b.style.fontSize = (sz * 0.5) + "px"; b.style.zIndex = 8; b._l = l;
      const x = rnd(sz / 2 + 8, W - sz / 2 - 8);
      b.style.left = (x - sz / 2) + "px"; b.style.top = H + "px"; live.push(b);
      const a = b.animate([{ transform: "translateY(0)" }, { transform: `translateY(${-(H * 0.72 + sz)}px)` }], { duration: rnd(6500, 8500), easing: "linear" });
      a.onfinish = () => { b.remove(); live = live.filter(x => x !== b); };
      b.onpointerdown = async ev => {
        ev.preventDefault(); if (fin || b._pop) return;
        if (b._l === cur) {
          b._pop = true; Snd.pop(); a.pause(); b.animate([{ transform: getComputedStyle(b).transform + " scale(1)", opacity: 1 }, { transform: getComputedStyle(b).transform + " scale(1.6)", opacity: 0 }], { duration: 250 }).onfinish = () => { b.remove(); live = live.filter(x => x !== b); };
          celebrate(); r++;
          if (r >= targets.length) { await sleep(500); end(); } else { await sleep(500); ask(); }
        } else { misses++; Snd.thud(0.25); b.animate([{ transform: getComputedStyle(b).transform }, { transform: getComputedStyle(b).transform + " translateX(8px)" }, { transform: getComputedStyle(b).transform }], { duration: 250 }); AR.say(sndOf(b._l, kind)); }
      };
    };
    cue("a_bub").then(() => ask());
    spawnT = setInterval(spawn, 900); spawn(); spawn();
  });
}

/* Поймай букву: буквы падают, корзинка ловит только нужную. need — сколько поймать */
function catchGame(target, pool, need = 4, kind = "name", timeout = 40000) {
  return new Promise(res => {
    const { W, H } = size();
    const bw = Math.min(W * 0.34, 150), by = H * 0.86;
    const basket = obj("al-basket", ART.bowl, W / 2, by, bw, bw * 0.6); basket.style.zIndex = 9;
    let got = 0, misses = 0, fin = false, items = [], bx = W / 2, moved = false;
    const mv = ev => { if (fin) return; moved = true; const p = local(ev); bx = Math.max(bw / 2, Math.min(W - bw / 2, p.x)); put(basket, bx, by); };
    window.addEventListener("pointermove", mv); window.addEventListener("pointerdown", mv);
    const capT = setTimeout(() => end(), timeout);
    function end() { if (fin) return; fin = true; clearInterval(sp); clearTimeout(capT); window.removeEventListener("pointermove", mv); window.removeEventListener("pointerdown", mv); items.forEach(i => i.remove()); fadeOut(basket, 300); res(misses); }
    const sp = setInterval(() => {
      if (fin) return;
      const l = Math.random() < 0.45 ? target : pool[Math.floor(Math.random() * pool.length)];
      const sz = Math.min(W * 0.16, 70), e = el("div", "al-fall", stage, `<span>${kind === "name" ? l.ch : syl(l, kind)}</span>`);
      e.style.width = e.style.height = sz + "px"; e.style.fontSize = (sz * 0.6) + "px"; e.style.zIndex = 8; e._l = l;
      const cb = cap.classList.contains("hidden") ? 0 : cap.getBoundingClientRect().bottom - stage.getBoundingClientRect().top;
      let x = rnd(sz, W - sz), y = Math.max(H * 0.12, cb + sz / 2); put(e, x, y); items.push(e);   // падают из-под подписи
      const sp2 = rnd(H * 0.16, H * 0.24); let lt = performance.now();
      const step = t => {
        if (fin || !e.isConnected) return;
        y += sp2 * (t - lt) / 1000; lt = t; put(e, x, y);
        if (y > by - bw * 0.2 && y < by + 10 && Math.abs(x - bx) < bw * 0.45) {
          e.remove(); items = items.filter(i => i !== e);
          if (e._l === target) { got++; Snd.pop(); capNote.textContent = `Поймано: ${got} из ${need}`; if (got >= need) { celebrate(); setTimeout(end, 400); } }
          else { if (moved) misses++; Snd.thud(0.2); AR.say(sndOf(e._l)); }   // корзинку не трогали — не ошибка
          return;
        }
        if (y > H + 40) { e.remove(); items = items.filter(i => i !== e); return; }
        requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, 1100);
    cue("a_catch").then(() => { capNote.textContent = "Ловим: " + target.ru; return AR.say(sndOf(target, kind)); });
  });
}

/* Найди пары: карточки с буквами, открываются по две; при открытии звучит название */
function memory(ls, timeout = 70000) {
  return new Promise(res => {
    const { W, H } = size();
    const deck = [...ls, ...ls].sort(() => Math.random() - 0.5);
    const cols = deck.length > 8 ? 4 : deck.length > 6 ? 4 : 3, rows = Math.ceil(deck.length / cols);
    const cw = Math.min((W - 40) / cols - 10, 86), chh = cw * 1.15, top = H * 0.36;
    const gridH = rows * (chh + 12), y0 = top + Math.max(0, (H * 0.6 - gridH) / 2);
    let open = [], pairs = 0, misses = 0, fin = false, busy = false;
    const cards = deck.map((l, i) => {
      const c = el("div", "al-card", stage, `<i class="bk"></i><i class="fr" style="font-size:${cw * 0.55}px"><span style="transform:translateY(6%)">${l.ch}</span></i>`);
      Object.assign(c.style, { width: cw + "px", height: chh + "px", zIndex: 8 });
      put(c, W / 2 + ((i % cols) - (cols - 1) / 2) * (cw + 10), y0 + Math.floor(i / cols) * (chh + 12) + chh / 2);
      c._l = l;
      c.onclick = async () => {
        if (fin || busy || c.classList.contains("open")) return;
        idle.poke(); Snd.tap(); c.classList.add("open"); open.push(c); AR.say("ar_name_" + l.id);
        if (open.length === 2) {
          busy = true; await sleep(700);
          const [a, b] = open; open = [];
          if (a._l === b._l) { a.classList.add("done"); b.classList.add("done"); Snd.sparkle(); pairs++; if (pairs === ls.length) { celebrate(); setTimeout(end, 700); } }
          else { misses++; a.classList.remove("open"); b.classList.remove("open"); }
          busy = false;
        }
      };
      return c;
    });
    /* долго ничего — открываем по паре сами */
    const idle = alIdle(20000, async () => {
      for (const l of ls) { if (fin) return; const cs = cards.filter(c => c._l === l && !c.classList.contains("done")); if (cs.length === 2) { cs.forEach(c => c.classList.add("open", "done")); pairs++; Snd.sparkle(); await sleep(500); } }
      end();
    });
    function end() { if (fin) return; fin = true; idle.stop(); cards.forEach(c => fadeOut(c, 400)); setTimeout(() => res(misses), 450); }
    cue("a_mem");
  });
}

/* Проверка: звучит буква/слог — нажми нужную из 3–4 больших карточек. Возвращает число ошибок */
function pickLetter(lineId, target, opts, kind = "name") {
  return new Promise(async res => {
    const { W, H } = size();
    const all = [target, ...opts.filter(o => o !== target)].slice(0, 4).sort(() => Math.random() - 0.5);
    const sz = Math.min((W - 40) / all.length - 12, 110);
    let misses = 0, fin = false;
    const cards = all.map((l, i) => {
      const e = bigGlyph(l, W / 2 + (i - (all.length - 1) / 2) * (sz + 12), H * 0.56, sz, kind === "name" ? l.ch : syl(l, kind));
      e.onclick = async () => {
        if (fin || e.classList.contains("no")) return;
        if (l === target) {
          fin = true; e.classList.add("ok"); Snd.tap(); celebrate(); capNote.textContent = L("a_right");
          await AR.say(sndOf(l, kind)); await sleep(500);
          cards.forEach(c => fadeOut(c, 300)); capNote.textContent = ""; res(misses);
        } else {
          misses++; e.classList.add("no"); Snd.thud(0.3); capNote.textContent = L("a_wrong");
          await AR.say(sndOf(l, kind)); await sleep(300); AR.say(sndOf(target, kind));
        }
      };
      return e;
    });
    showCap(lineId); capLine.ar = sndOf(target, kind);
    await Voice.speak(lineId); if (!fin) await AR.say(sndOf(target, kind));
    /* долго не выбирают — подсвечиваем верную, а ещё позже выбираем её сами (как будто подсказали) */
    const right = cards[all.indexOf(target)];
    setTimeout(() => { if (!fin) right.classList.add("hl"); }, 15000);
    setTimeout(() => { if (!fin) { misses++; right.onclick(); } }, 30000);
  });
}

/* ============ УРОВЕНЬ 1: ЗНАКОМСТВО С БУКВАМИ ============ */
async function meetLetter(l, i) {
  clearStage(); const { W, H } = alScene(i);
  const g = bigGlyph(l, W / 2, H * 0.5, Math.min(W * 0.56, H * 0.34, 240)); fadeIn(g, 600); Snd.sparkle();
  await sayAr(`a_${l.id}_name`, `ar_name_${l.id}`);
  g.classList.add("hl"); await say(`a_${l.id}_pic`); g.classList.remove("hl");
  if (l.id === "alif" || l.id === "hamza") await say(`a_${l.id}_snd`);
  else await sayAr(`a_${l.id}_snd`, `ar_${l.id}_a`);
  /* слово-пример: картинка и слово, буква в нём выделена */
  await move(g, W * 0.73, H * 0.42, 500); g.style.transition = "width .4s, height .4s, font-size .4s";
  const ps = Math.min(W * 0.36, 150), pic = obj("al-pic", `<svg viewBox="0 0 100 100" aria-hidden="true">${PIC[l.word[2]] || ""}</svg>`, W * 0.3, H * 0.42, ps, ps); pic.style.zIndex = 6; fadeIn(pic);
  const word = el("div", "al-word", stage, l.word[0].replace(l.ch, `<b>${l.ch}</b>`)); Object.assign(word.style, { left: W / 2 + "px", top: H * 0.63 + "px", fontSize: Math.min(64, W * 0.15) + "px", zIndex: 6 });
  const wc = el("div", "al-wcap", stage, l.word[1]); Object.assign(wc.style, { left: W / 2 + "px", top: (H * 0.63 + Math.min(44, W * 0.1)) + "px", zIndex: 6 });
  await sayAr(`a_${l.id}_word`, `ar_w_${l.id}`);
  [g, pic, word, wc].forEach(e => fadeOut(e, 400)); await sleep(450);
  await traceLetter(l.ch);
}
async function chLetters(gi) {
  const ids = LETTER_GROUPS[gi], ls = ids.map(id => LET[id]);
  await toDark(); clearStage(); alScene(gi); Snd.amb("wind", 0.5); fromDark(); await sleep(300);
  await chapterTitle(null, ls.map(l => l.ru).join(", "), `a_g${gi + 1}_0`);
  await say(`a_g${gi + 1}_1`);
  for (let i = 0; i < ls.length; i++) await meetLetter(ls[i], i + gi);
  /* закрепление: две разные игры, по кругу от главы к главе */
  clearStage(); alScene(gi + 1);
  const prev = LETTERS.filter(l => !ids.includes(l.id) && LETTER_GROUPS.slice(0, gi).flat().includes(l.id));
  const pool = [...ls, ...prev.sort(() => Math.random() - 0.5).slice(0, 3)];
  let misses = 0;
  const games = [
    () => bubbles(ls.slice().sort(() => Math.random() - 0.5).slice(0, 3), pool),
    () => catchGame(ls[Math.floor(Math.random() * ls.length)], pool),
    () => memory(ls.slice(0, 4))
  ];
  for (const k of [gi % 3, (gi + 1) % 3]) { misses += Math.min(2, await games[k]()); hideCap(); await sleep(400); clearStage(); alScene(gi + k); }
  await say("a_quiz");
  const q = ls.slice().sort(() => Math.random() - 0.5).slice(0, 2);
  let qm = 0;
  for (const t of q) { qm += await pickLetter(`a_${t.id}_find`, t, [...ls, ...prev].filter(x => x !== t).sort(() => Math.random() - 0.5).slice(0, 2)); hideCap(); await sleep(300); }
  await say("a_g_end", { named: true });
  hideCap(); await awardLetters(ids);
  return qm + (misses > 3 ? 1 : 0);
}
/* Повторение всего алфавита: свободная доска + пары + проверка */
async function chAlphabet() {
  await toDark(); clearStage(); const { W, H } = alScene(3); fromDark(); await sleep(300);
  await chapterTitle(null, "Весь алфавит", "a_g8_0");
  await say("a_g8_1");
  const board = el("div", "al-board", stage); board.style.top = (H * 0.3) + "px"; board.style.zIndex = 7;
  LETTERS.forEach(l => { const b = el("button", "al-glyph", board, `<span>${l.ch}</span>`); b.onclick = () => { Snd.tap(); b.classList.add("hl"); setTimeout(() => b.classList.remove("hl"), 600); AR.say("ar_name_" + l.id); }; });
  const pb = say("a_board", { noAuto: 60000 });
  const fit = () => {   // доска — под подписью (она растёт, когда появляется «Дальше»), клетки ужимаются, чтобы влезли все ряды
    const top = cap.getBoundingClientRect().bottom - stage.getBoundingClientRect().top + 8, cols = getComputedStyle(board).gridTemplateColumns.split(" ").length, rows = Math.ceil(LETTERS.length / cols);
    const h = Math.max(34, Math.min(54, (H - top - 14 - (rows - 1) * 8) / rows));
    board.style.top = top + "px"; board.querySelectorAll(".al-glyph").forEach(b => { b.style.height = h + "px"; b.style.fontSize = (h * 0.58) + "px"; });
  };
  const fitT = setInterval(fit, 250); await sleep(60); fit();
  await pb; clearInterval(fitT);
  fadeOut(board, 400); await sleep(450);
  const pick = LETTERS.slice().sort(() => Math.random() - 0.5);
  let misses = await memory(pick.slice(0, 4)); hideCap(); clearStage(); alScene(1);
  misses += await bubbles(pick.slice(4, 7), pick.slice(4, 12)); hideCap(); clearStage(); alScene(2);
  await say("a_quiz");
  let qm = 0;
  for (const t of pick.slice(7, 10)) { qm += await pickLetter(`a_${t.id}_find`, t, pick.slice(10, 20).filter(x => x !== t).slice(0, 3)); hideCap(); await sleep(300); }
  await say("a_g_end", { named: true }); hideCap();
  return qm;
}
LETTER_GROUPS.forEach((g, gi) => regChapter(0, { id: "g" + (gi + 1), name: g.map(id => LET[id].ru).join(", "), icon: chIcon(LET[g[0] === "alif" ? "ba" : g[0]].ch), fn: () => chLetters(gi), lines: `a_g${gi + 1}_` }));
regChapter(0, { id: "abc", name: "Весь алфавит", icon: chIcon("أ"), fn: chAlphabet, lines: "a_g8_" });

/* ============ ВСТУПЛЕНИЕ И ФИНАЛ ============ */
async function chIntro() {
  await toDark(); clearStage(); const { W, H } = alScene(0); Snd.amb("wind", 0.6); fromDark(); await sleep(500);
  const g = obj("al-glyph", `<span>ا ب ت</span>`, W / 2, H * 0.5, Math.min(W * 0.8, 320), Math.min(H * 0.22, 150)); g.style.fontSize = Math.min(72, W * 0.16) + "px"; g.style.direction = "rtl"; fadeIn(g, 700);
  await say("a_intro1", { named: true });
  await say("a_intro2");
  await say("a_intro3", { btn: "Бисмиллях" });
}
async function chFinal() {
  await toDark(); clearStage(); const { W, H } = alScene(3); fromDark(); await sleep(400);
  const row = el("div", "items-row many", stage, ITEMS.filter(i => Save.d.items.includes(i.id)).map(i => `<svg viewBox="0 0 100 100" aria-hidden="true">${i.svg}</svg>`).join(""));
  celebrate();
  await say("a_fin1", { named: true });
  await say("a_fin2");
  hideCap(); await certificate();
  await say("a_fin3", { btn: "В меню" });
  hideCap();
}
