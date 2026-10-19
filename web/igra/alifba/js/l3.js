"use strict";
/* «Алиф-Ба», уровень 3 «Огласовки»: фатха (а), кясра (и), дамма (у) и чтение слогов.
   Всё своё — с префиксом l3 (общая глобальная область с l2/l4/l5). */

/* ============ ЗНАЧКИ, СЛОГИ, КАРТОЧКИ ============ */
const L3 = {
  col: { a: "#E0503F", i: "#2C7CC0", u: "#2E9A57" },
  marks: "َُِ"
};
/* Значок огласовки крупно (viewBox 100×100): фатха и кясра — косая чёрточка, дамма — маленькая уау */
function l3MarkSvg(h) {
  const c = L3.col[h];
  if (h === "u") return `<text x="50" y="66" text-anchor="middle" font-family="Amiri, serif" font-weight="700" font-size="92" fill="${c}">و</text>`;
  return `<path d="M76 30 C82 32 83 38 77 42 L28 70 C22 73 19 68 24 64 Z" fill="${c}" stroke="${c}" stroke-width="5" stroke-linejoin="round"/>`;
}
/* Слово/слог с цветными огласовками: снизу слои со значками своего цвета, сверху — буквы без значков */
function l3Word(w) {
  const keep = k => [...w].filter(c => !L3.marks.includes(c) || c === k).join("");
  const layers = ["a", "i", "u"].filter(h => w.includes(HARAKA[h])).map(h => `<i style="color:${L3.col[h]}">${keep(HARAKA[h])}</i>`);
  return `<b class="l3-st">${layers.join("")}<i>${keep(null)}</i></b>`;
}
const l3Syl = (l, h) => l3Word(syl(l, h));
const l3Snd = (l, h) => `ar_${l.id}_${h}`;
const l3Mix = a => a.slice().sort(() => Math.random() - 0.5);

addCSS(`
.l3-st { display: inline-grid; direction: rtl; font-weight: inherit; }
.l3-st > i { grid-area: 1 / 1; font-style: normal; white-space: nowrap; }
.l3-st > i:last-child { color: #1F5B74; -webkit-text-stroke: 1px #1F5B74; }
.l3-card.l3-pop { animation: l3-pop .45s cubic-bezier(.3,1.6,.5,1); }
@keyframes l3-pop { 40% { transform: scale(1.12); } }
.l3-mark { touch-action: none; cursor: grab; filter: drop-shadow(0 3px 4px rgba(0,0,0,.3)); }
.l3-mark.l3-up { filter: drop-shadow(0 10px 10px rgba(0,0,0,.35)); }
.l3-mark.l3-float { animation: l3-float 1.6s ease-in-out infinite; }
@keyframes l3-float { 50% { transform: translateY(-8px); } }
.l3-tray { border-radius: 24px; background: rgba(255,246,218,.92); box-shadow: 0 5px 0 #E2C77E, 0 14px 24px -12px rgba(0,0,0,.45); }
.l3-zone { border: 3px dashed rgba(255,246,218,.95); border-radius: 18px; background: rgba(255,255,255,.2); touch-action: none; cursor: crosshair; }
.l3-zone svg { width: 100%; height: 100%; display: block; pointer-events: none; }
.l3-pulse { animation: l3-pulse 1.2s ease-in-out infinite; }
@keyframes l3-pulse { 50% { box-shadow: 0 0 0 8px rgba(255,214,107,.55); background: rgba(255,236,170,.4); } }
.l3-waw { display: grid; place-items: center; border-radius: 50%; font-family: "Amiri", serif; font-weight: 700; line-height: 1; color: #2E9A57;
  background: radial-gradient(circle at 35% 30%, #fff, #E3F5EA); box-shadow: 0 6px 0 #A9D9BC, 0 16px 26px -12px rgba(0,0,0,.45); touch-action: none; cursor: pointer; }
.l3-waw span { transform: translateY(-4%); }
.l3-chip { border-radius: 50%; background: #FFF6DA; box-shadow: 0 5px 0 #E2C77E, 0 12px 20px -12px rgba(0,0,0,.45); touch-action: none; cursor: grab; transition: opacity .3s; }
.obj.l3-chip > svg { width: 74%; height: 74%; margin: 13%; }
.l3-chip.no { opacity: .4; }
.l3-chip.l3-up { box-shadow: 0 5px 0 #E2C77E, 0 18px 24px -10px rgba(0,0,0,.45); }
.l3-wordc { display: grid; place-items: center; border-radius: 28px; background: linear-gradient(180deg, #FFFDF5, #FFF1CF); box-shadow: 0 6px 0 #E2C77E, 0 18px 30px -14px rgba(0,0,0,.45);
  font-family: "Amiri", serif; font-weight: 700; color: #1F5B74; line-height: 1; }
.l3-wordc > span { transform: translateY(4%); }
.l3-legend { position: absolute; transform: translate(-50%, 0); font-weight: 900; font-size: 17px; color: #fff; text-shadow: 0 2px 8px rgba(0,0,0,.45); white-space: nowrap; }
`);

/* Карточка буквы (h — огласовка или null). Нажатие — звучит слог или название */
function l3Card(l, x, y, sz, h) {
  const e = obj("al-glyph l3-card", `<span></span>`, x, y, sz, sz);
  e.style.fontSize = (sz * 0.52) + "px"; e.style.zIndex = 6; e._l = l; e._sz = sz;
  l3Set(e, h || null, true);
  e.onclick = () => { if (e._lock) return; Snd.tap(); AR.say(e._h ? l3Snd(l, e._h) : "ar_name_" + l.id); };
  return e;
}
function l3Set(e, h, quiet) {
  e._h = h; e.querySelector("span").innerHTML = h ? l3Syl(e._l, h) : e._l.ch;
  if (!quiet) { e.classList.remove("l3-pop"); void e.offsetWidth; e.classList.add("l3-pop"); }
}
/* Где значок встаёт на карточке: фатха и дамма сверху, кясра снизу */
const l3Spot = (c, h) => ({ x: c._x, y: c._y + (h === "i" ? 0.33 : -0.33) * c._sz });
function l3MarkEl(h, x, y, s) {
  const e = obj("l3-mark", `<svg viewBox="0 0 100 100" aria-hidden="true">${l3MarkSvg(h)}</svg>`, x, y, s, s);
  e.style.zIndex = 9; e._h = h; return e;
}
/* Значок долетает до места и «впитывается» в букву: карточка показывает слог */
async function l3Place(m, c, h) {
  const p = l3Spot(c, h);
  await move(m, p.x, p.y, 260, "ease-out");
  Snd.pop(); l3Set(c, h);
  m.animate([{ opacity: 1, transform: "scale(1)" }, { opacity: 0, transform: "scale(.4)" }], { duration: 220, fill: "forwards" }).onfinish = () => m.remove();
}
/* Перетаскивание: onRelease(moved) после отпускания. Возвращает функцию «отцепить» (снимает слушатели window) */
function l3Grab(e, onRelease, onDown) {
  let off = null, start = null, moved = false;
  const dn = ev => { ev.preventDefault(); if (e._lock) return; const p = local(ev); off = { x: e._x - p.x, y: e._y - p.y }; start = p; moved = false; e.classList.add("l3-up"); e.classList.remove("hint"); Snd.tap(); onDown && onDown(); };
  const mv = ev => { if (!off) return; const p = local(ev); if (Math.hypot(p.x - start.x, p.y - start.y) > 10) moved = true; put(e, p.x + off.x, p.y + off.y); };
  const up = () => { if (!off) return; off = null; e.classList.remove("l3-up"); onRelease(moved); };
  e.addEventListener("pointerdown", dn); window.addEventListener("pointermove", mv); window.addEventListener("pointerup", up); window.addEventListener("pointercancel", up);
  return () => { off = null; e.removeEventListener("pointerdown", dn); window.removeEventListener("pointermove", mv); window.removeEventListener("pointerup", up); window.removeEventListener("pointercancel", up); };
}
/* Ряд карточек справа налево */
function l3Row(ls, y, hs, maxSz = 104) {
  const { W, H } = size(), n = ls.length;
  const sz = Math.min((W - 32) / n - 12, maxSz, H * 0.2);
  return ls.map((l, i) => { const c = l3Card(l, W / 2 + ((n - 1) / 2 - i) * (sz + 12), y, sz, hs ? hs[i] : null); fadeIn(c, 400); return c; });
}
/* Прочитать ряд: карточки подсвечиваются справа налево и звучат */
async function l3ReadRow(cards) {
  for (const c of cards) { c.classList.add("hl"); await AR.say(l3Snd(c._l, c._h)); c.classList.remove("hl"); await sleep(150); }
}

/* ============ МЕХАНИКИ УРОВНЯ ============ */
/* Шапочка-огласовка: из коробочки внизу перетащить значок h на каждую карточку. Ничего не делает — значки встают сами */
function l3DragFill(cards, h) {
  return new Promise(res => {
    const { W, H } = size();
    const ms = Math.min(W * 0.22, 92), sx = W / 2, sy = H * 0.84;
    const tray = obj("l3-tray", "", sx, sy, ms * 1.35, ms * 1.1); tray.style.zIndex = 7; fadeIn(tray, 300);
    let mark = null, left = cards.slice(), fin = false, unGrab = null;
    const spawn = () => {
      if (fin) return;
      const m = mark = l3MarkEl(h, sx, sy, ms); m.classList.add("hint"); fadeIn(m, 300);
      unGrab = l3Grab(m, moved => {
        const c = left.find(c => Math.abs(m._x - c._x) < c._sz * 0.75 && m._y > c._y - c._sz * 1.3 && m._y < c._y + c._sz * 0.75);
        if (c) drop(c); else { move(m, sx, sy, 300, "ease-out"); m.classList.add("hint"); }
      }, () => idle.poke());
    };
    const drop = async c => {
      const m = mark; mark = null; unGrab && unGrab(); unGrab = null; left = left.filter(x => x !== c);
      c._lock = true; await l3Place(m, c, h); c._lock = false;
      await AR.say(l3Snd(c._l, h));
      if (!left.length) end(); else { await sleep(200); spawn(); }
    };
    const auto = async () => {
      while (!fin && left.length) {
        if (!mark) { await sleep(200); continue; }
        const m = mark, c = left[0], p = l3Spot(c, h); m.classList.remove("hint");
        await move(m, p.x, p.y, 650); if (mark === m) await drop(c);
      }
    };
    const idle = alIdle(15000, auto);
    function end() { if (fin) return; fin = true; idle.stop(); unGrab && unGrab(); if (mark) mark.remove(); fadeOut(tray, 300); setTimeout(res, 350); }
    spawn();
  });
}

/* Слушай и нажимай: варианты-слоги в ряд, звучит верный. 11 с — подсказка, 22 с — игра выбирает сама */
function l3EarRound(opts, ok, note) {
  return new Promise(res => {
    const { H } = size(), t = opts[ok], snd = l3Snd(t.l, t.h);
    let fin = false, m = 0;
    const cards = l3Row(opts.map(o => o.l), H * 0.56, opts.map(o => o.h), 116);
    capLine.ar = snd; capNote.textContent = note || "";
    const pick = async (i, auto) => {
      if (fin) return; const c = cards[i];
      if (i === ok) {
        fin = true; idle.stop(); clearTimeout(hl); c.classList.add("ok"); Snd.tap(); if (!auto) celebrate();
        await AR.say(snd); await sleep(350); cards.forEach(x => fadeOut(x, 300)); await sleep(330); res(m);
      } else if (!c.classList.contains("no")) {
        m++; c.classList.add("no"); Snd.thud(0.3); idle.poke();
        await AR.say(l3Snd(opts[i].l, opts[i].h)); await sleep(250); if (!fin) AR.say(snd);
      }
    };
    cards.forEach((c, i) => { c.onclick = () => pick(i); });
    const hl = setTimeout(() => { if (!fin) { cards[ok].classList.add("hl"); AR.say(snd); } }, 11000);
    const idle = alIdle(22000, () => pick(ok, true));
    sleep(350).then(() => { if (!fin) AR.say(snd); });
  });
}
async function l3Ear(lineId, rounds) {
  showCap(lineId); capLine.ar = l3Snd(rounds[0].opts[rounds[0].ok].l, rounds[0].opts[rounds[0].ok].h);
  await Voice.speak(lineId);
  let misses = 0;
  for (let r = 0; r < rounds.length; r++) misses += await l3EarRound(rounds[r].opts, rounds[r].ok, `${r + 1} из ${rounds.length}`);
  capNote.textContent = "";
  return misses;
}
/* Раунды «тот же слог с разными огласовками» по списку букв */
const l3SameLetter = (ls, hs) => ls.map(l => { const opts = l3Mix(hs).map(h => ({ l, h })); return { opts, ok: Math.floor(Math.random() * opts.length) }; });

/* Нарисуй кясру: рамочка под буквой (и, если both, над ней). Палец проводит чёрточку — значок встаёт на место */
function l3Draw(l, both) {
  return new Promise(res => {
    const { W, H } = size();
    const sz = Math.min(W * 0.42, H * 0.2, 170), cy = H * 0.62;
    const c = l3Card(l, W / 2, cy, sz); c._lock = true; fadeIn(c, 400);
    const zw = sz * 0.95, zh = sz * 0.4, gap = 10;
    const guide = `<svg viewBox="0 0 100 40" preserveAspectRatio="xMidYMid meet" aria-hidden="true"><path d="M64 11 L36 29" stroke="rgba(255,246,218,.85)" stroke-width="4" stroke-dasharray="5 5" stroke-linecap="round"/></svg>`;
    const mk = top => { const z = obj("l3-zone", guide, W / 2, top ? cy - sz / 2 - gap - zh / 2 : cy + sz / 2 + gap + zh / 2, zw, zh); z.style.zIndex = 7; z._top = top; fadeIn(z, 400); return z; };
    const bot = mk(false), zones = both ? [mk(true), bot] : [bot];
    if (!both) bot.classList.add("l3-pulse");
    const lay = el("div", "layer", stage, `<svg viewBox="0 0 ${W} ${H}" aria-hidden="true"><polyline points="" fill="none" stroke="#FFF6DA" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/></svg>`);
    lay.style.inset = "0"; lay.style.zIndex = 8;
    const line = lay.querySelector("polyline");
    let fin = false, busy = false, cur = null, pts = [], misses = 0;
    const draw = () => line.setAttribute("points", pts.map(p => p.x.toFixed(0) + "," + p.y.toFixed(0)).join(" "));
    const dn = (z, ev) => { ev.preventDefault(); if (fin || busy) return; cur = z; pts = [local(ev)]; draw(); idle.poke(); Snd.noise({ f: 2600, q: 6, dur: 0.06, gain: 0.05 }); };
    const mv = ev => { if (!cur) return; const p = local(ev), q = pts[pts.length - 1]; if (Math.hypot(p.x - q.x, p.y - q.y) < 4) return; pts.push(p); draw(); if (Math.random() < 0.3) Snd.noise({ f: rnd(2200, 3200), q: 8, dur: 0.06, gain: 0.04 }); };
    const up = () => { if (!cur) return; const z = cur; cur = null; commit(z); };
    zones.forEach(z => { z._dn = ev => dn(z, ev); z.addEventListener("pointerdown", z._dn); });
    window.addEventListener("pointermove", mv); window.addEventListener("pointerup", up); window.addEventListener("pointercancel", up);
    const commit = async z => {
      if (fin || busy) return; busy = true;
      const h = z._top ? "a" : "i";
      const m = l3MarkEl(h, z._x, z._y, sz * 0.42); m.style.pointerEvents = "none"; fadeIn(m, 250);
      pts = []; draw(); Snd.sparkle();
      await sleep(350); await l3Place(m, c, h);
      await AR.say(l3Snd(l, h));
      if (h === "i") return finish();
      misses++; capNote.textContent = L("l3_2_no"); await Voice.speak("l3_2_no");
      l3Set(c, null); bot.classList.add("l3-pulse"); busy = false; idle.poke();
    };
    const idle = alIdle(16000, () => { if (!busy) commit(bot); else idle.poke(); });
    const hint = setTimeout(() => bot.classList.add("l3-pulse"), 8000);
    async function finish() {
      fin = true; idle.stop(); clearTimeout(hint); capNote.textContent = "";
      zones.forEach(z => z.removeEventListener("pointerdown", z._dn));
      window.removeEventListener("pointermove", mv); window.removeEventListener("pointerup", up); window.removeEventListener("pointercancel", up);
      c.classList.add("ok"); celebrate(); await sleep(700);
      [c, lay, ...zones].forEach(e => fadeOut(e, 300)); await sleep(330); res(misses);
    }
  });
}

/* Поймай слоги с огласовкой h: падают слоги с разными значками, корзинка внизу */
function l3Catch(h, pool, need = 4, timeout = 40000) {
  return new Promise(res => {
    const { W, H } = size();
    const bw = Math.min(W * 0.34, 150), by = H * 0.86;
    const basket = obj("al-basket", ART.bowl, W / 2, by, bw, bw * 0.6); basket.style.zIndex = 9;
    let got = 0, misses = 0, fin = false, items = [], bx = W / 2, touched = false;
    const mv = ev => { if (fin) return; touched = true; const p = local(ev); bx = Math.max(bw / 2, Math.min(W - bw / 2, p.x)); put(basket, bx, by); };
    window.addEventListener("pointermove", mv); window.addEventListener("pointerdown", mv);
    const capT = setTimeout(end, timeout);
    function end() { if (fin) return; fin = true; clearInterval(sp); clearTimeout(capT); window.removeEventListener("pointermove", mv); window.removeEventListener("pointerdown", mv); items.forEach(i => i.remove()); fadeOut(basket, 300); setTimeout(() => res(misses), 320); }
    const others = ["a", "i", "u"].filter(x => x !== h);
    const sp = setInterval(() => {
      if (fin) return;
      const l = pool[Math.floor(Math.random() * pool.length)], hh = Math.random() < 0.45 ? h : others[Math.floor(Math.random() * others.length)];
      const sz = Math.min(W * 0.18, 76), e = el("div", "al-fall", stage, `<span>${l3Syl(l, hh)}</span>`);
      e.style.width = e.style.height = sz + "px"; e.style.fontSize = (sz * 0.5) + "px"; e.style.zIndex = 8;
      let x = rnd(sz, W - sz), y = H * 0.3; put(e, x, y); items.push(e);
      const v = rnd(H * 0.13, H * 0.19); let lt = performance.now();
      const step = t => {
        if (fin || !e.isConnected) return;
        y += v * (t - lt) / 1000; lt = t; put(e, x, y);
        if (y > by - bw * 0.2 && y < by + 10 && Math.abs(x - bx) < bw * 0.45) {
          e.remove(); items = items.filter(i => i !== e);
          if (hh === h) { got++; Snd.pop(); AR.say(l3Snd(l, hh)); capNote.textContent = `Поймано: ${got} из ${need}`; if (got >= need) { celebrate(); setTimeout(end, 500); } }
          else { if (touched) misses++; Snd.thud(0.2); AR.say(l3Snd(l, hh)); }   // корзинку не трогали — не ошибка
          return;
        }
        if (y > H + 40) { e.remove(); items = items.filter(i => i !== e); return; }
        requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, 1250);
    cue("l3_3_catch");
  });
}

/* Собери слог: звучит слог, к букве нужно приложить нужный значок из трёх (перетащить или нажать) */
function l3Build(l, h, note) {
  return new Promise(res => {
    const { W, H } = size();
    const sz = Math.min(W * 0.4, H * 0.2, 160), c = l3Card(l, W / 2, H * 0.56, sz); c._lock = true; fadeIn(c, 400);
    const cs = Math.min(W * 0.21, 84), cy = H * 0.84, snd = l3Snd(l, h);
    let fin = false, busy = false, misses = 0;
    capLine.ar = snd; capNote.textContent = note || "";
    const chips = ["a", "i", "u"].map((hh, k) => {
      const x = W / 2 + (1 - k) * (cs + 22);            // справа налево: фатха, кясра, дамма
      const e = obj("l3-chip", `<svg viewBox="0 0 100 100" aria-hidden="true">${l3MarkSvg(hh)}</svg>`, x, cy, cs, cs);
      e.style.zIndex = 9; e._h = hh; e._home = { x, y: cy }; fadeIn(e, 300);
      e._un = l3Grab(e, moved => {
        const near = Math.abs(e._x - c._x) < sz * 0.8 && Math.abs(e._y - c._y) < sz * 0.95;
        if (!moved || near) choose(e); else move(e, x, cy, 300, "ease-out");
      }, () => idle.poke());
      return e;
    });
    const choose = async (e, auto) => {
      if (fin || busy) return; busy = true; e._lock = true;
      const p = l3Spot(c, e._h);
      await move(e, p.x, p.y, 260, "ease-out"); e.style.opacity = "0"; Snd.pop(); l3Set(c, e._h);
      if (e._h === h) {
        fin = true; idle.stop(); clearTimeout(hl); chips.forEach(x => x._un());
        c.classList.add("ok"); if (!auto) celebrate();
        await AR.say(snd); await sleep(450);
        [c, ...chips].forEach(x => fadeOut(x, 300)); await sleep(330); return res(misses);
      }
      misses++; Snd.thud(0.3);
      await AR.say(l3Snd(l, e._h));
      capNote.textContent = L("l3_4_no"); await Voice.speak("l3_4_no");
      l3Set(c, null); put(e, e._home.x, e._home.y); e.style.opacity = ""; e.classList.add("no"); e._lock = false;
      busy = false; idle.poke(); capNote.textContent = note || ""; AR.say(snd);
    };
    const right = chips.find(x => x._h === h);
    const hl = setTimeout(() => { if (!fin) { right.classList.add("hint"); AR.say(snd); } }, 10000);
    const idle = alIdle(20000, () => { if (!busy) choose(right, true); else idle.poke(); });
    sleep(350).then(() => { if (!fin && !busy) AR.say(snd); });
  });
}

/* Читаем слово по слогам: слоги справа налево, нажимаешь по очереди — потом они сливаются в слово */
const L3PIC = {
  write: '<rect x="14" y="12" width="56" height="76" rx="6" fill="#FFF8EA" stroke="#C9BBA0" stroke-width="3"/><path d="M24 30 H60 M24 42 H60 M24 54 H46" stroke="#9FB2BA" stroke-width="4" stroke-linecap="round"/><path d="M88 16 L58 66 L54 78 L63 70 L93 20 Z" fill="#C98B52" stroke="#7A4A24" stroke-width="2" stroke-linejoin="round"/>',
  open: '<rect x="20" y="10" width="52" height="82" rx="4" fill="#7A4A24"/><rect x="26" y="16" width="40" height="76" fill="#FFE7A0"/><path d="M26 16 L54 24 V96 L26 92 Z" fill="#C98B52" stroke="#8E5A2E" stroke-width="2" stroke-linejoin="round"/><circle cx="48" cy="58" r="3" fill="#F5C451"/><path d="M4 92 H96" stroke="#8E5A2E" stroke-width="4" stroke-linecap="round"/>',
  hear: '<path d="M30 70 Q30 30 50 26 Q70 30 70 70 Z" fill="#F5C451" stroke="#B9802A" stroke-width="3" stroke-linejoin="round"/><rect x="24" y="68" width="52" height="8" rx="4" fill="#E6A93A"/><circle cx="50" cy="82" r="6" fill="#B9802A"/><rect x="47" y="16" width="6" height="11" rx="3" fill="#B9802A"/><path d="M80 36 Q88 48 80 60 M86 28 Q98 48 86 68 M20 36 Q12 48 20 60 M14 28 Q2 48 14 68" stroke="#5FA7C9" stroke-width="3.5" fill="none" stroke-linecap="round"/>',
  book: '<path d="M50 24 Q32 14 10 18 V80 Q32 76 50 86 Z" fill="#1F6E58"/><path d="M50 24 Q68 14 90 18 V80 Q68 76 50 86 Z" fill="#257D64"/><path d="M50 24 V86" stroke="#F5C451" stroke-width="3"/><path d="M18 34 Q30 31 42 35 M18 46 Q30 43 42 47 M58 35 Q70 31 82 34 M58 47 Q70 43 82 46" stroke="#F5C451" stroke-width="3" fill="none" stroke-linecap="round"/>'
};
async function l3ReadWord(w) {
  const { W, H } = size();
  const ls = w.sy.map(s => LET[s[0]]), hs = w.sy.map(s => s[1]);
  const cards = l3Row(ls, H * 0.56, hs, 100);
  for (const c of cards) {
    c._lock = true;
    await taps(c, 1, null, 9000);
    c.classList.add("hl"); await AR.say(l3Snd(c._l, c._h)); c.classList.remove("hl");
  }
  /* слоги съезжаются и становятся словом */
  await Promise.all(cards.map(c => move(c, W / 2, c._y, 450)));
  cards.forEach(c => fadeOut(c, 250));
  const ww = Math.min(W * 0.78, 320), wh = Math.min(H * 0.18, 150);
  const card = obj("l3-wordc", `<span>${l3Word(w.ar)}</span>`, W / 2, H * 0.56, ww, wh); card.style.fontSize = Math.min(wh * 0.55, ww * 0.26) + "px"; card.style.zIndex = 7;
  fadeIn(card, 500); Snd.sparkle();
  const ps = Math.min(W * 0.28, H * 0.15, 110);
  const pic = obj("al-pic", `<svg viewBox="0 0 100 100" aria-hidden="true">${L3PIC[w.pic]}</svg>`, W / 2, H * 0.56 + wh / 2 + ps / 2 + 20, ps, ps); pic.style.zIndex = 6; fadeIn(pic, 500);
  card.onclick = () => { Snd.tap(); AR.say("ar_l3_" + w.id); };
  await sayAr("l3_4_" + w.id, "ar_l3_" + w.id);
  fadeOut(card, 350); fadeOut(pic, 350); await sleep(380);
}

/* Сокровища уровня */
const l3WordSvg = t => `<rect x="6" y="6" width="88" height="88" rx="22" fill="#FFF6DA" stroke="#E2C77E" stroke-width="3"/><text x="50" y="62" text-anchor="middle" font-family="Amiri, serif" font-size="34" font-weight="700" fill="#1F5B74">${t}</text>`;
ITEMS.push({ id: "l3_fatha", name: "Фатха", svg: glyphSvg("بَ", L3.col.a) }, { id: "l3_kasra", name: "Кясра", svg: glyphSvg("بِ", L3.col.i) },
  { id: "l3_damma", name: "Дамма", svg: glyphSvg("بُ", L3.col.u) }, { id: "l3_read", name: "Первые слова", svg: l3WordSvg("كَتَبَ") });

/* ============ ГЛАВА 1: ФАТХА ============ */
async function l3Fatha() {
  await toDark(); clearStage(); let { W, H } = alScene(0); Snd.amb("wind", 0.5); fromDark(); await sleep(300);
  await chapterTitle(null, "Фатха", "l3_1_0");
  /* три огласовки на примере: значки над и под буквой */
  const sz = Math.min(W * 0.46, H * 0.24, 200);
  const c = l3Card(LET.ba, W / 2, H * 0.6, sz); fadeIn(c, 600); Snd.sparkle();
  await say("l3_1_1");
  await say("l3_1_2");
  const m = l3MarkEl("a", W / 2 + sz * 0.62, H * 0.6 - sz * 0.62, sz * 0.42); m.classList.add("l3-float"); fadeIn(m, 500); Snd.sparkle();
  await say("l3_1_3");
  fadeOut(m, 300);
  /* первая шапочка — сам ребёнок */
  cue("l3_1_drag");
  await l3DragFill([c], "a");
  await sayAr("l3_1_4", "ar_ba_a", { once: true });
  fadeOut(c, 300); await sleep(320);
  /* ряд букв */
  const row = l3Row([LET.ta, LET.mim, LET.nun, LET.ra], H * 0.52);
  cue("l3_1_row");
  await l3DragFill(row, "a");
  showCap("l3_1_read"); await Voice.speak("l3_1_read");
  await l3ReadRow(row); await sleep(400);
  row.forEach(x => fadeOut(x, 300)); await sleep(330);
  hideCap(); clearStage(); ({ W, H } = alScene(1));
  /* шарики-слоги с фатхой */
  const pool = [LET.ba, LET.ta, LET.mim, LET.nun, LET.ra, LET.dal, LET.kaf];
  const misses = Math.min(2, await bubbles(l3Mix(pool).slice(0, 3), pool, "a"));
  hideCap(); await sleep(300);
  await say("l3_1_end", { named: true });
  hideCap(); await award("l3_fatha");
  return misses;
}

/* ============ ГЛАВА 2: КЯСРА ============ */
async function l3Kasra() {
  await toDark(); clearStage(); const { W, H } = alScene(2); Snd.amb("wind", 0.5); fromDark(); await sleep(300);
  await chapterTitle(null, "Кясра", "l3_2_0");
  const sz = Math.min(W * 0.46, H * 0.22, 200), cy = H * 0.62;
  const c = l3Card(LET.ba, W / 2, cy, sz, "a"); fadeIn(c, 600);
  await sayAr("l3_2_1", "ar_ba_a", { once: true });
  /* кясра падает: сверху вниз, под букву */
  l3Set(c, null);
  const m = l3MarkEl("i", W / 2, cy - sz * 0.75, sz * 0.42); fadeIn(m, 400);
  showCap("l3_2_2"); const p = Voice.speak("l3_2_2");
  await sleep(1800); Snd.fall();
  await move(m, W / 2, cy + sz * 0.33, 1100, "cubic-bezier(.55,0,.9,.6)"); Snd.thud(0.3);
  m.animate([{ transform: "translateY(0)" }, { transform: "translateY(-10px)" }, { transform: "translateY(0)" }], { duration: 300 });
  await p; await sleep(300);
  m.remove(); l3Set(c, "i");
  await sayAr("l3_2_3", "ar_ba_i");
  fadeOut(c, 300); await sleep(320);
  /* нарисуй кясру: сначала одна рамочка, потом две */
  let misses = 0;
  cue("l3_2_draw1");
  misses += await l3Draw(LET.mim, false);
  showCap("l3_2_draw2"); const p2 = Voice.speak("l3_2_draw2");
  await Promise.race([p2, sleep(4000)]);
  for (const l of [LET.dal, LET.sin, LET.kaf]) { capLine = { id: "l3_2_draw2" }; misses += await l3Draw(l, true); }
  hideCap(); await sleep(300);
  /* ба или би — на слух */
  const ls = l3Mix([LET.ta, LET.nun, LET.ra, LET.fa]);
  const rounds = ls.map((l, k) => { const opts = [{ l, h: "a" }, { l, h: "i" }]; return { opts, ok: k % 2 === 0 ? 1 : 0 }; });
  rounds.sort(() => Math.random() - 0.5);
  misses += await l3Ear("l3_2_ear", rounds);
  hideCap(); await sleep(300);
  await say("l3_2_end", { named: true });
  hideCap(); await award("l3_kasra");
  return misses;
}

/* ============ ГЛАВА 3: ДАММА ============ */
/* Большая Уау: держи палец — она уменьшается в дамму и прыгает на букву */
async function l3HoldWaw(l, first) {
  const { W, H } = size();
  const sz = Math.min(W * 0.4, H * 0.2, 170), c = l3Card(l, W / 2, H * 0.54, sz); c._lock = true; fadeIn(c, 400);
  const ws = Math.min(W * 0.3, H * 0.17, 120);
  const w = obj("l3-waw", `<span>و</span>`, W / 2, H * 0.8, ws, ws); w.style.fontSize = (ws * 0.62) + "px"; w.style.zIndex = 8; fadeIn(w, 400);
  if (first) cue("l3_3_hold");
  await hold(w, 1100, p => { w.style.transform = `scale(${1 - 0.45 * p})`; }, first ? 20000 : 14000);
  Snd.whoosh(0.2);
  const s = l3Spot(c, "u");
  w.animate([{ transform: "scale(.55)" }, { transform: "scale(.22)" }], { duration: 450, fill: "forwards", easing: "ease-in" });
  await move(w, s.x, s.y, 450, "ease-in"); w.remove(); Snd.pop(); l3Set(c, "u");
  await AR.say(l3Snd(l, "u")); await sleep(300);
  fadeOut(c, 300); await sleep(320);
}
async function l3Damma() {
  await toDark(); clearStage(); let { W, H } = alScene(1); Snd.amb("wind", 0.5); fromDark(); await sleep(300);
  await chapterTitle(null, "Дамма", "l3_3_0");
  const sz = Math.min(W * 0.4, H * 0.22, 180);
  const c = l3Card(LET.ba, W / 2 + sz * 0.62, H * 0.62, sz); fadeIn(c, 600);
  const ws = sz * 0.7, w = obj("l3-waw", `<span>و</span>`, W / 2 - sz * 0.62, H * 0.62, ws, ws); w.style.fontSize = (ws * 0.62) + "px"; w.style.zIndex = 7; fadeIn(w, 600);
  await say("l3_3_1");
  /* показываем: уау уменьшается и садится на букву */
  const s = l3Spot(c, "u"); Snd.whoosh(0.2);
  w.animate([{ transform: "scale(1)" }, { transform: "scale(.25)" }], { duration: 900, fill: "forwards", easing: "ease-in-out" });
  await move(w, s.x, s.y, 900); w.remove(); Snd.pop(); l3Set(c, "u");
  await sayAr("l3_3_2", "ar_ba_u");
  fadeOut(c, 300); await sleep(320);
  /* сам: держи Уау */
  const ls = [LET.nun, LET.dal, LET.kaf];
  for (let i = 0; i < ls.length; i++) await l3HoldWaw(ls[i], i === 0);
  hideCap(); clearStage(); ({ W, H } = alScene(2));
  /* лови только дамму */
  let misses = Math.min(2, await l3Catch("u", [LET.ba, LET.ta, LET.mim, LET.nun, LET.ra, LET.dal, LET.sin, LET.lam, LET.fa]));
  hideCap(); clearStage(); alScene(3);
  /* а, и или у — на слух */
  misses += await l3Ear("l3_3_ear", l3SameLetter(l3Mix([LET.mim, LET.sin, LET.ta, LET.qaf]).slice(0, 3), ["a", "i", "u"]));
  hideCap(); await sleep(300);
  await say("l3_3_end", { named: true });
  hideCap(); await award("l3_damma");
  return misses;
}

/* ============ ГЛАВА 4: ЧИТАЕМ СЛОГИ ============ */
async function l3Read() {
  await toDark(); clearStage(); let { W, H } = alScene(3); Snd.amb("wind", 0.5); fromDark(); await sleep(300);
  await chapterTitle(null, "Читаем слоги", "l3_4_0");
  /* повтор: ба, би, бу */
  const row = l3Row([LET.ba, LET.ba, LET.ba], H * 0.58, ["a", "i", "u"], 110);
  showCap("l3_4_1"); await Voice.speak("l3_4_1");
  await l3ReadRow(row);
  const b = button("Дальше"); b.classList.add("glow"); autoNext(b, Promise.resolve(), ""); await clicked(b); capBtns.innerHTML = "";
  row.forEach(x => fadeOut(x, 300)); await sleep(330);
  /* собери слог */
  let misses = 0;
  showCap("l3_4_build"); await Voice.speak("l3_4_build");
  const hs = l3Mix(["a", "i", "u", ["a", "i", "u"][Math.floor(Math.random() * 3)]]);
  const bl = l3Mix([LET.lam, LET.sin, LET.qaf, LET.jim, LET.zay, LET.dal]).slice(0, 4);
  for (let k = 0; k < 4; k++) { capLine = { id: "l3_4_build" }; misses += await l3Build(bl[k], hs[k], `${k + 1} из 4`); }
  hideCap(); clearStage(); ({ W, H } = alScene(0));
  /* найди слог: разные буквы и разные значки */
  const fl = l3Mix([LET.ba, LET.ta, LET.mim, LET.nun, LET.ra, LET.fa, LET.kaf]);
  const rounds = [0, 1, 2].map(k => {
    const l = fl[k], h = ["a", "i", "u"][Math.floor(Math.random() * 3)], other = fl[k + 3];
    const opts = l3Mix([{ l, h }, ...["a", "i", "u"].filter(x => x !== h).map(x => ({ l, h: x })), { l: other, h }]);
    return { opts, ok: opts.findIndex(o => o.l === l && o.h === h) };
  });
  misses += await l3Ear("l3_4_find", rounds);
  hideCap(); await sleep(300);
  /* настоящие слова из Корана */
  await say("l3_4_words");
  hideCap();
  const words = [
    { id: "kataba", ar: "كَتَبَ", sy: [["kaf", "a"], ["ta", "a"], ["ba", "a"]], pic: "write" },
    { id: "fataha", ar: "فَتَحَ", sy: [["fa", "a"], ["ta", "a"], ["hha", "a"]], pic: "open" },
    { id: "samia", ar: "سَمِعَ", sy: [["sin", "a"], ["mim", "i"], ["ain", "a"]], pic: "hear" },
    { id: "kutiba", ar: "كُتِبَ", sy: [["kaf", "u"], ["ta", "i"], ["ba", "a"]], pic: "book" }
  ];
  for (const w of words) await l3ReadWord(w);
  hideCap(); await sleep(200);
  await say("l3_4_end", { named: true });
  hideCap(); await award("l3_read");
  return misses;
}

regChapter(2, { id: "l3_fatha", name: "Фатха", icon: chIcon("بَ"), fn: l3Fatha, lines: "l3_1_" });
regChapter(2, { id: "l3_kasra", name: "Кясра", icon: chIcon("بِ"), fn: l3Kasra, lines: "l3_2_" });
regChapter(2, { id: "l3_damma", name: "Дамма", icon: chIcon("بُ"), fn: l3Damma, lines: "l3_3_" });
regChapter(2, { id: "l3_read", name: "Читаем слоги", icon: chIcon("كَ"), fn: l3Read, lines: "l3_4_" });
