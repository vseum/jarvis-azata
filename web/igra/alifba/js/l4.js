"use strict";
/* «Алиф-Ба», уровень 4: сукун, танвин, долгие звуки (мадд) и чтение коротких слов.
   Всё внутри функции — имена не пересекаются с другими уровнями. Наружу выходят только главы (regChapter) и сокровища (ITEMS).
   Механики уровня: «стоп-кружок» (перетащить сукун на букву), «дорожка-стоп» (останови буквы с сукуном),
   «удвой шапочку» (танвин), «корзинки» (сортировка перетаскиванием), «тянем звук» (держать палец — звук бежит по дорожке),
   «коротко или долго» (на слух), «читаем пальцем» (ползунок под словом справа налево). */
(() => {
const ZJ = "‍";                                            // невидимая связка: буквы в разных <span> остаются соединёнными
const sk1 = id => LET[id].ch + HARAKA.sk;                         // бْ — буква с сукуном
const syk = id => syl(LET[id], "sk");                             // أَبْ — слог с сукуном, как звучит ar_<id>_sk
const SY = (id, h) => ({ t: h === "sk" ? syk(id) : syl(LET[id], h), snd: `ar_${id}_${h}`, id, h });
const shuffle = a => { const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
const pickOne = a => a[Math.floor(Math.random() * a.length)];
/* Подпись с кнопкой «Дальше» занимает сверху до ~370 px на любом телефоне: то, что показываем во время реплики, ставим ниже */
const below = (y, h) => Math.max(y, 372 + h / 2);

/* Сокровища уровня */
const wordSvg = (t, fs) => `<rect x="6" y="6" width="88" height="88" rx="22" fill="#FFF6DA" stroke="#E2C77E" stroke-width="3"/><text x="50" y="${50 + fs * 0.3}" text-anchor="middle" direction="rtl" font-family="Amiri, serif" font-size="${fs}" font-weight="700" fill="#1F5B74">${t}</text>`;
ITEMS.push(
  { id: "l4_sk", name: "Сукун", svg: wordSvg(syk("ba"), 46) },
  { id: "l4_tn", name: "Танвин", svg: wordSvg(syl(LET.ba, "un"), 56) },
  { id: "l4_md", name: "Мадд", svg: wordSvg(syl(LET.ba, "aa"), 54) },
  { id: "l4_rd", name: "Китаб", svg: wordSvg("كِتَابٌ", 34) }
);

addCSS(`
.l4-card { direction: rtl; white-space: nowrap; touch-action: none; }
.l4-card span { transform: translateY(2%); }
.l4-card b { color: #D9822B; font-weight: 700; }
.l4-ring { border-radius: 50%; border: 8px solid #F5C451; background: rgba(255,248,234,.2); box-shadow: 0 0 0 3px rgba(255,255,255,.55), 0 8px 16px rgba(0,0,0,.3); cursor: grab; touch-action: none; }
.l4-belt { position: absolute; left: -12px; right: -12px; height: 22px; border-radius: 11px; z-index: 5; pointer-events: none;
  background: repeating-linear-gradient(90deg, #4F6F7C 0 18px, #648A98 18px 36px); box-shadow: inset 0 3px 0 rgba(255,255,255,.25), 0 8px 14px rgba(0,0,0,.25); animation: l4-belt .6s linear infinite; }
@keyframes l4-belt { to { background-position: -36px 0; } }
.l4-hello { position: absolute; translate: -50% -50%; font-family: "Amiri", serif; font-weight: 700; color: #fff; text-shadow: 0 2px 8px rgba(0,0,0,.4); pointer-events: none; z-index: 8; }
.l4-bin { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0; border-radius: 18px 18px 28px 28px; z-index: 6;
  background: linear-gradient(180deg, #FFF8E6, #F3DEA6); border-top: 5px solid #E2B65A; box-shadow: 0 5px 0 #C9A55A, 0 16px 24px -12px rgba(0,0,0,.5); cursor: pointer; transition: box-shadow .2s; }
.l4-bin b { font-family: "Amiri", serif; font-weight: 700; color: #1F5B74; line-height: 1.8; padding-bottom: 4px; direction: rtl; white-space: nowrap; }
.l4-bin small { font-weight: 900; font-size: 15px; color: #8A5A1E; line-height: 1.1; margin-top: -2px; }
.l4-bin .l4-got { display: flex; gap: 3px; direction: rtl; font-family: "Amiri", serif; font-weight: 700; font-size: 15px; color: #3FA66A; min-height: 18px; line-height: 1.6; margin-top: 2px; }
.l4-bin.hl { box-shadow: 0 5px 0 #C9A55A, 0 0 0 5px rgba(245,196,81,.95), 0 16px 24px -12px rgba(0,0,0,.5); }
.l4-bin.no { animation: shake .42s; }
.l4-bin.yes { animation: l4-jump .45s; }
@keyframes l4-jump { 40% { transform: translateY(-9px) scale(1.06); } }
.l4-track { border-radius: 15px; background: rgba(12,38,52,.5); box-shadow: inset 0 0 0 2px rgba(255,236,180,.5); z-index: 6; }
.l4-track i { position: absolute; right: 0; top: 0; bottom: 0; width: 0; border-radius: 15px; background: linear-gradient(90deg, #FFE7A0, #F0B43C); box-shadow: 0 0 12px rgba(255,214,107,.7); }
.l4-track em { position: absolute; top: 50%; width: 26px; height: 26px; translate: -50% -50%; border-radius: 50%; background: rgba(255,255,255,.55);
  font-style: normal; font-weight: 900; font-size: 14px; display: grid; place-items: center; color: #1F5B74; transition: background .2s, box-shadow .2s, scale .2s; }
.l4-track em.on { background: #fff; box-shadow: 0 0 0 4px rgba(245,196,81,.9); scale: 1.15; }
.l4-ear { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; border-radius: 22px; z-index: 7; cursor: pointer;
  background: rgba(255,248,234,.95); box-shadow: 0 5px 0 #E2C77E, 0 14px 22px -12px rgba(0,0,0,.45); transition: transform .12s, box-shadow .2s; }
.l4-ear:active { transform: scale(.95); }
.l4-ear svg { width: 86%; height: 34px; }
.l4-ear small { font-weight: 900; font-size: 17px; color: #1F5B74; }
.l4-ear.hl { box-shadow: 0 5px 0 #E2C77E, 0 0 0 5px rgba(245,196,81,.95); }
.l4-ear.ok { background: #DCF2E3; box-shadow: 0 5px 0 #A9D9BC, 0 0 0 4px rgba(70,185,122,.7); }
.l4-ear.no { animation: shake .42s; }
.l4-spk { display: grid; place-items: center; border-radius: 50%; z-index: 7; cursor: pointer; color: #FFE7A0;
  background: radial-gradient(circle at 35% 30%, #3A86A6, #1C5169 70%); box-shadow: 0 6px 0 #123B4D, 0 16px 26px -12px rgba(0,0,0,.5); }
.l4-spk svg { width: 54%; height: 54%; }
.l4-spk span { font-family: "Amiri", serif; font-weight: 700; color: #FFE7A0; direction: rtl; transform: translateY(6%); }
.l4-spk.hl { animation: l4-pulse 1s ease-in-out infinite; }
@keyframes l4-pulse { 50% { box-shadow: 0 6px 0 #123B4D, 0 0 0 12px rgba(255,231,160,.35); } }
.l4-word { position: absolute; translate: -50% -50%; direction: rtl; white-space: nowrap; font-family: "Amiri", serif; font-weight: 700; color: #1F5B74; line-height: 1.85;
  padding: 0 .4em; border-radius: 24px; background: rgba(255,248,234,.94); box-shadow: 0 6px 0 #E2C77E, 0 18px 30px -14px rgba(0,0,0,.45); z-index: 6; }
.l4-word span { transition: color .25s; cursor: pointer; }
.l4-word span.on { color: #D9822B; }
.l4-word.all span { color: #2E8C57; }
.l4-rail { position: absolute; height: 12px; translate: 0 -50%; border-radius: 6px; background: rgba(12,38,52,.45); z-index: 6; }
.l4-seg { position: absolute; height: 12px; translate: 0 -50%; border-radius: 6px; background: rgba(255,255,255,.55); z-index: 6; transition: background .2s, box-shadow .2s; }
.l4-seg.on { background: #FFD66B; box-shadow: 0 0 12px rgba(255,214,107,.9); }
.l4-knob { display: grid; place-items: center; border-radius: 50%; z-index: 8; cursor: grab; touch-action: none;
  background: radial-gradient(circle at 35% 30%, #FFF4C2, #F5C451 60%, #E6A93A); box-shadow: 0 6px 14px rgba(0,0,0,.35); }
.l4-knob svg { width: 58%; height: 58%; }
`);

/* ============ ОБЩИЕ ПОМОЩНИКИ ============ */
/* Карточка с арабским текстом (не озвучивает название буквы, как bigGlyph) */
function card(text, x, y, w, h, fs) {
  h = h || w;
  const e = obj("al-glyph l4-card", `<span>${text}</span>`, x, y, w, h);
  e.style.fontSize = (fs || h * 0.45) + "px"; e.style.zIndex = 6;
  return e;
}
const setText = (e, t) => { e.firstChild.innerHTML = t; };
/* Реплика, а после неё действие (звук, анимация); кнопка «Дальше» с автонажатием, как say/sayAr */
async function sayDo(id, fn, opt = {}) {
  showCap(id, opt.note, opt.named); if (opt.ar) capLine.ar = opt.ar;
  const p = Voice.speak(id, opt.named).then(() => sleep(200)).then(() => fn && fn());
  await sleep(500);
  const b = button(opt.btn || "Дальше");
  p.then(() => b.classList.add("glow"));
  autoNext(b, p, L(id));
  await clicked(b);
  Voice.stop(); capBtns.innerHTML = "";
}
/* Дорожка звука: заполняется справа налево; бусины — счёты (1 или 1–2) */
function track(x, y, w, beats) {
  const beads = beats === 1 ? `<em style="left:15px">1</em>` : `<em style="left:50%">1</em><em style="left:15px">2</em>`;
  const t = obj("l4-track", `<i></i>${beads}`, x, y, w, 30);
  t._fill = t.querySelector("i"); t._beads = [...t.querySelectorAll("em")];
  t.set = p => {
    t._fill.style.width = (p * 100) + "%";
    t._beads.forEach((b, k) => b.classList.toggle("on", p >= (t._beads.length === 1 ? 1 : (k + 1) / 2) - 0.001));
  };
  /* показать, как звук бежит: за ms от пустой до полной */
  t.run = ms => new Promise(r => {
    const t0 = performance.now(); let lit = 0;
    const st = now => {
      const p = Math.min(1, (now - t0) / ms); t.set(p);
      const on = t._beads.filter(b => b.classList.contains("on")).length;
      if (on > lit) { lit = on; Snd.tone({ f: 600 + on * 160, dur: 0.12, gain: 0.1 }); }
      if (p < 1 && t.isConnected) requestAnimationFrame(st); else r();
    };
    requestAnimationFrame(st);
  });
  return t;
}

/* Проверка: звучит слог/слово — нажми, где так написано. opts: [{t, snd}], ti — номер верного.
   15 с — подсветка верного, 28 с — игра отвечает сама (и это считается ошибкой). onRight(e) — что показать после верного */
function pick(lineId, opts, ti, onRight) {
  return new Promise(async res => {
    const { W, H } = size();
    const n = opts.length, order = shuffle(opts.map((_, i) => i));
    const long = opts.some(o => o.t.replace(/[ً-ْ‍ٰ]/g, "").length > 2);
    let misses = 0, fin = false, cards;
    if (!long) {
      const sz = Math.min((W - 40) / n - 12, 112);
      cards = order.map((k, j) => { const e = card(opts[k].t, W / 2 + ((n - 1) / 2 - j) * (sz + 12), H * 0.62, sz); e._k = k; return e; });
    } else {
      const cw = Math.min(W * 0.66, 270), ch = Math.min(H * 0.12, 86), gap = 14, y0 = H * 0.64 - (n - 1) * (ch + gap) / 2;
      cards = order.map((k, j) => { const e = card(opts[k].t, W / 2, y0 + j * (ch + gap), cw, ch, ch * 0.6); e._k = k; return e; });
    }
    cards.forEach(c => fadeIn(c, 400));
    const tsnd = opts[ti].snd, tc = cards.find(c => c._k === ti);
    const right = async auto => {
      if (fin) return; fin = true; clearTimeout(hlT); clearTimeout(autoT);
      if (auto) misses++;
      tc.classList.remove("hl"); tc.classList.add("ok"); Snd.tap(); celebrate(); capNote.textContent = L("a_right");
      await AR.say(tsnd);
      cards.forEach(c => { if (c !== tc) fadeOut(c, 300); });
      if (onRight) await onRight(tc);
      await sleep(500); fadeOut(tc, 300); capNote.textContent = ""; await sleep(300); res(misses);
    };
    cards.forEach(e => e.onclick = async () => {
      if (fin || e.classList.contains("no")) return;
      if (e === tc) return right(false);
      misses++; e.classList.add("no"); Snd.thud(0.3); capNote.textContent = L("l4_all_no");
      await AR.say(opts[e._k].snd); await sleep(300); if (!fin) AR.say(tsnd);
    });
    const hlT = setTimeout(() => { if (!fin) { tc.classList.add("hl"); AR.say(tsnd); } }, 15000);
    const autoT = setTimeout(() => right(true), 28000);
    showCap(lineId); capLine.ar = tsnd;
    await Voice.speak(lineId); if (!fin) await AR.say(tsnd);
  });
}

/* Корзинки: карточка в центре, перетащи её в нужную корзинку. bins: [{key, html, ru, tap}], items: [{t, snd, key}].
   Нажатие на карточку — снова звук; на корзинку — её подсказка. 16 с без дела — карточка сама едет в нужную корзинку */
function sortGame(bins, items, noLine) {
  return new Promise(res => {
    const { W, H } = size();
    const n = bins.length, bw = Math.min((W - 32) / n - 10, 126), bh = Math.min(bw * 1.02, H * 0.2), by = Math.min(H * 0.86, H - bh / 2 - 18);
    const fs = Math.min(bw * 0.3, bh * 0.3, 36);
    bins.forEach((b, i) => {
      b.e = obj("l4-bin", `<b style="font-size:${fs}px">${b.html}</b><small>${b.ru}</small><div class="l4-got"></div>`, W / 2 + ((n - 1) / 2 - i) * (bw + 10), by, bw, bh);
      b.got = b.e.querySelector(".l4-got");
      b.e.onclick = () => { if (fin) return; Snd.tap(); b.tap && b.tap(); };
      fadeIn(b.e, 400);
    });
    const cs = Math.min(W * 0.3, H * 0.17, 118), hx = W / 2, hy = Math.min(H * 0.56, by - bh / 2 - cs * 0.75);
    let i = 0, misses = 0, fin = false, cur = null, drag = null, idle = null;
    const next = () => {
      if (fin) return;
      if (i >= items.length) return end();
      const it = items[i];
      cur = card(it.t, hx, hy, cs * (it.t.length > 4 ? 1.3 : 1), cs); cur._it = it; cur.style.zIndex = 9;
      cur.classList.add("hint"); fadeIn(cur, 350);
      cur.onpointerdown = dn;
      idle && idle.stop(); idle = alIdle(16000, auto);
      AR.say(it.snd);
    };
    const dn = ev => {
      ev.preventDefault(); if (fin || !cur || cur._busy) return;
      idle.poke(); const p = local(ev); drag = { dx: cur._x - p.x, dy: cur._y - p.y, sx: p.x, sy: p.y, moved: false };
      cur.classList.remove("hint"); cur.style.zIndex = 12;
    };
    const mv = ev => {
      if (!drag || fin || !cur) return; const p = local(ev);
      if (Math.hypot(p.x - drag.sx, p.y - drag.sy) > 10) drag.moved = true;
      put(cur, p.x + drag.dx, p.y + drag.dy);
      bins.forEach(b => b.e.classList.toggle("hl", near(b)));
    };
    const near = b => cur && Math.abs(cur._x - b.e._x) < bw * 0.62 && Math.abs(cur._y - b.e._y) < bh * 0.95;
    const up = () => {
      if (!drag || fin || !cur) return; const d = drag; drag = null; idle.poke();
      bins.forEach(b => b.e.classList.remove("hl"));
      if (!d.moved) { put(cur, hx, hy); Snd.tap(); AR.say(cur._it.snd); return; }
      const b = bins.find(near);
      if (!b) { move(cur, hx, hy, 300, "ease-out"); return; }
      drop(b);
    };
    const drop = async b => {
      const c = cur; if (!c || c._busy) return; c._busy = true;
      if (b.key === c._it.key) {
        Snd.pop(); cur = null; idle.stop();
        await move(c, b.e._x, b.e._y - bh * 0.15, 220);
        c.animate([{ transform: "scale(1)", opacity: 1 }, { transform: "scale(.3)", opacity: 0 }], { duration: 300, fill: "forwards" });
        b.e.classList.remove("yes"); void b.e.offsetWidth; b.e.classList.add("yes");
        if (b.got.children.length < 4) el("span", "", b.got, c._it.t);
        capNote.textContent = ""; await AR.say(c._it.snd); c.remove();
        i++; await sleep(250); next();
      } else {
        misses++; Snd.thud(0.3); b.e.classList.remove("no"); void b.e.offsetWidth; b.e.classList.add("no");
        capNote.textContent = L(noLine);
        await move(c, hx, hy, 350, "ease-out"); c._busy = false; AR.say(c._it.snd);
      }
    };
    /* подсказка: карточка сама едет в свою корзинку (это засчитывается как ошибка) */
    const auto = async () => {
      if (fin || !cur || cur._busy || drag) return;
      const b = bins.find(x => x.key === cur._it.key), c = cur; misses++;
      b.e.classList.add("hl"); c._busy = true; await move(c, b.e._x, b.e._y - bh * 0.3, 1100); c._busy = false; b.e.classList.remove("hl");
      if (cur === c) drop(b);
    };
    window.addEventListener("pointermove", mv); window.addEventListener("pointerup", up); window.addEventListener("pointercancel", up);
    function end() {
      if (fin) return; fin = true; idle && idle.stop();
      window.removeEventListener("pointermove", mv); window.removeEventListener("pointerup", up); window.removeEventListener("pointercancel", up);
      celebrate(); setTimeout(() => { bins.forEach(b => fadeOut(b.e, 400)); res(misses); }, 900);
    }
    setTimeout(next, 400);
  });
}

/* ============ ГЛАВА 1: СУКУН ============ */
/* Стоп-кружок: перетащи сукун на букву — она «прилипает» к Алифу с фатхой: أَ + بْ = أَبْ */
async function dropSukun(id, line) {
  const { W, H } = size();
  const cs = Math.min(W * 0.3, H * 0.17, 120), y = H * 0.56;
  const a = card("أَ", W / 2 + cs * 0.62, y, cs), b = card(LET[id].ch, W / 2 - cs * 0.62, y, cs);
  fadeIn(a, 400); fadeIn(b, 400);
  a.onclick = () => { Snd.tap(); AR.say("ar_alif_a"); };
  const ring = obj("l4-ring", "", W / 2, Math.min(H * 0.82, y + cs * 1.4), 58, 58); ring.style.zIndex = 9; fadeIn(ring, 400);
  cue(line);
  await dragTo(ring, { _x: b._x, _y: b._y - cs * 0.18 }, 20000);
  fadeOut(ring, 200); setText(b, sk1(id)); Snd.sparkle(); b.classList.add("hl");
  await sleep(450);
  Snd.whoosh(0.15);
  await Promise.all([move(a, W / 2 + cs * 0.38, y, 380), move(b, W / 2 - cs * 0.38, y, 380)]);
  a.remove(); b.remove();
  const m = card(syk(id), W / 2, y, cs * 1.55, cs); m.classList.add("ok"); Snd.pop();
  await AR.say(`ar_${id}_sk`); await sleep(350); await AR.say(`ar_${id}_sk`);
  await sleep(500); fadeOut(m, 350); await sleep(380);
}
/* Дорожка-стоп: буквы едут справа налево; нажми на букву с сукуном — она останавливается и прилипает к «а» */
function belt(need = 4, timeout = 50000) {
  return new Promise(res => {
    const { W, H } = size();
    const sz = Math.min(W * 0.22, H * 0.13, 96), by = H * 0.64, speed = Math.max(55, W / 6.5);
    const rail = el("div", "l4-belt", stage); rail.style.top = (by + sz / 2 + 6) + "px"; rail.style.animationDuration = (36 / speed).toFixed(2) + "s";
    const pool = ["ba", "ta", "mim", "dal", "sin", "lam", "kaf", "ra", "fa", "qaf"];
    let got = 0, misses = 0, fin = false, items = [], last = performance.now(), plain = 0;
    const spawn = () => {
      if (fin) return;
      const isSk = plain >= 2 || Math.random() < 0.45; plain = isSk ? 0 : plain + 1;
      const id = pickOne(pool), h = isSk ? "sk" : pickOne(["a", "i", "u"]);
      const e = card(LET[id].ch + HARAKA[h], W + sz / 2 + 6, by, sz); e._id = id; e._h = h; e.style.zIndex = 7;
      e.onpointerdown = ev => { ev.preventDefault(); hit(e); };
      items.push(e);
    };
    const step = t => {
      if (fin) return;
      const dt = Math.min(0.05, (t - last) / 1000); last = t;
      items.forEach(e => { if (!e._stop) { put(e, e._x - speed * dt, e._y); if (e._h === "sk" && e._x < W * 0.42) e.classList.add("hl"); } });
      items = items.filter(e => { if (e._x < -sz) { e.remove(); return false; } return true; });
      requestAnimationFrame(step);
    };
    const hit = async (e, auto) => {
      if (fin || e._stop) return;
      if (!auto) idle.poke();
      if (e._h === "sk") {
        e._stop = true; e.classList.remove("hl"); Snd.thud(0.45);                       // «стоп!»
        e.style.width = (sz * 1.5) + "px"; setText(e, syk(e._id)); e.classList.add("ok");
        got++; capNote.textContent = `Остановлено: ${got} из ${need}`;
        await AR.say(`ar_${e._id}_sk`);
        if (got >= need) { capNote.textContent = L("l4_sk_belt_end"); celebrate(); setTimeout(end, 700); }
        await sleep(250); fadeOut(e, 300); items = items.filter(x => x !== e);
      } else {
        misses++; Snd.thud(0.2); e.classList.remove("no"); void e.offsetWidth; e.classList.add("no");
        setTimeout(() => e.classList.remove("no"), 600);
        capNote.textContent = L("l4_sk_belt_no"); AR.say(`ar_${e._id}_${e._h}`);
      }
    };
    /* малыш не нажимает — игра сама останавливает букву с сукуном (показывает, как надо) */
    const autoHit = () => {
      if (fin) return;
      const e = items.find(x => x._h === "sk" && !x._stop && x._x < W - sz * 0.6 && x._x > sz * 0.6);
      if (e) { hit(e, true); idle.poke(); } else setTimeout(autoHit, 700);
    };
    const idle = alIdle(14000, autoHit);
    const sp = setInterval(spawn, 1700); spawn();
    requestAnimationFrame(step);
    const capT = setTimeout(end, timeout);
    function end() {
      if (fin) return; fin = true; clearInterval(sp); clearTimeout(capT); idle.stop();
      items.forEach(e => fadeOut(e, 300)); fadeOut(rail, 400); setTimeout(() => res(misses), 450);
    }
  });
}
async function chSukun() {
  await toDark(); clearStage(); let { W, H } = alScene(0); Snd.amb("wind", 0.5); fromDark(); await sleep(300);
  await chapterTitle(null, "Сукун", "l4_sk_0");
  const cs = Math.min(W * 0.32, H * 0.19, 130), y = below(H * 0.58, cs * 1.3);
  const big = card(sk1("ba"), W / 2, y, cs * 1.3); fadeIn(big, 600); Snd.sparkle();
  big.onclick = () => { Snd.thud(0.3); big.classList.remove("wob"); void big.offsetWidth; big.classList.add("wob"); };
  await say("l4_sk_1");
  /* знакомство: أَ звучит, بْ молчит, вместе — أَبْ */
  fadeOut(big, 300); await sleep(320);
  const a = card("أَ", W / 2 + cs * 0.62, y, cs), b = card(sk1("ba"), W / 2 - cs * 0.62, y, cs);
  fadeIn(a, 400); fadeIn(b, 400);
  a.onclick = () => { Snd.tap(); AR.say("ar_alif_a"); };
  a.classList.add("hl"); await sayAr("l4_sk_2", "ar_alif_a"); a.classList.remove("hl");
  cue("l4_sk_3");
  await tapOnce(b, () => { Snd.thud(0.4); capNote.textContent = "…"; }, 16000);
  await sleep(700); capNote.textContent = "";
  Snd.whoosh(0.15);
  await Promise.all([move(a, W / 2 + cs * 0.38, y, 400), move(b, W / 2 - cs * 0.38, y, 400)]);
  a.remove(); b.remove();
  const m = card(syk("ba"), W / 2, y, cs * 1.55, cs); m.classList.add("ok"); Snd.pop();
  m.onclick = () => { Snd.tap(); AR.say("ar_ba_sk"); };
  await sayAr("l4_sk_4", "ar_ba_sk");
  fadeOut(m, 300); await sleep(350);
  /* стоп-кружок: три буквы */
  hideCap();
  const ids = ["ba", "mim", "sin"];
  for (let k = 0; k < ids.length; k++) await dropSukun(ids[k], k ? "l4_sk_6" : "l4_sk_5");
  /* дорожка-стоп */
  hideCap(); clearStage(); ({ W, H } = alScene(1)); await sleep(300);
  cue("l4_sk_belt");
  let misses = Math.min(2, await belt(4));
  await sleep(300);
  /* проверка на слух: «ам», а не «ма» */
  clearStage(); alScene(2);
  await say("l4_sk_q");
  let qm = 0;
  qm += await pick("l4_sk_pick", [SY("mim", "sk"), SY("mim", "a"), SY("mim", "u")], 0); hideCap(); await sleep(300);
  qm += await pick("l4_sk_pick", [SY("lam", "sk"), SY("lam", "a"), SY("lam", "i")], 0); hideCap(); await sleep(300);
  await say("l4_sk_end", { named: true });
  hideCap(); await award("l4_sk");
  return qm + (misses > 1 ? 1 : 0);
}

/* ============ ГЛАВА 2: ТАНВИН ============ */
/* Удвой шапочку: нажми на букву — огласовка становится двойной: بَ → بًا */
async function doubleHat(h, tapLine, sayLine, x, y, cs) {
  const short = { an: "a", in: "i", un: "u" }[h];
  const c = card(syl(LET.ba, short), x, y, cs * 1.2, cs); fadeIn(c, 400);
  let tapped = false;
  cue(tapLine).then(() => { if (!tapped) AR.say(`ar_ba_${short}`); });
  await tapOnce(c, () => { tapped = true; }, 18000);
  tapped = true; Voice.stop();
  setText(c, syl(LET.ba, h)); Snd.sparkle(); c.classList.add("hl");
  c.animate([{ transform: "scale(1)" }, { transform: "scale(1.15)" }, { transform: "scale(1)" }], { duration: 450 });
  await sayAr(sayLine, `ar_ba_${h}`);
  c.classList.remove("hl");
  c.onclick = () => { Snd.tap(); AR.say(`ar_ba_${h}`); };
  return c;
}
async function chTanwin() {
  await toDark(); clearStage(); let { W, H } = alScene(1); Snd.amb("wind", 0.5); fromDark(); await sleep(300);
  await chapterTitle(null, "Танвин", "l4_tn_0");
  const cs = Math.min(W * 0.28, H * 0.17, 120), y = below(H * 0.58, cs);
  /* три пары: одна шапочка → две (показываем «было — стало») */
  const pair = obj("al-glyph l4-card", `<span>${syl(LET.ba, "u")} ${syl(LET.ba, "un")}</span>`, W / 2, y, cs * 2.3, cs);
  pair.style.fontSize = (cs * 0.56) + "px"; pair.style.zIndex = 6; fadeIn(pair, 600);
  await say("l4_tn_1");
  fadeOut(pair, 300); await sleep(320);
  const done = [];
  const steps = [["an", "l4_tn_2", "l4_tn_an"], ["in", "l4_tn_3", "l4_tn_in"], ["un", "l4_tn_4", "l4_tn_un"]];
  const rw = Math.min(cs * 1.2, (W - 36) / 3 - 10), rowX = k => W / 2 + (1 - k) * (rw + 10);
  for (let k = 0; k < 3; k++) {
    const c = await doubleHat(steps[k][0], steps[k][1], steps[k][2], W / 2, y, cs);
    Object.assign(c.style, { width: rw + "px", height: (rw / 1.2) + "px", fontSize: (rw / 1.2 * 0.56) + "px" });
    await move(c, rowX(k), Math.min(H - rw / 2.4 - 16, y + cs * 1.5), 450); done.push(c);
  }
  /* бан, бин, бун рядом — нажимай и слушай */
  await Promise.all(done.map((c, k) => move(c, rowX(k), y, 400)));
  await sayDo("l4_tn_row", async () => { for (let k = 0; k < 3; k++) { done[k].classList.add("hl"); await AR.say(`ar_ba_${steps[k][0]}`); done[k].classList.remove("hl"); await sleep(250); } });
  done.forEach(c => fadeOut(c, 300)); await sleep(350);
  /* корзинки ан / ин / ун */
  hideCap(); clearStage(); ({ W, H } = alScene(2)); await sleep(200);
  cue("l4_tn_sort");
  const bins = ["an", "in", "un"].map(h => ({ key: h, html: syl(LET.ba, h), ru: h === "an" ? "ан" : h === "in" ? "ин" : "ун", tap: () => AR.say(`ar_ba_${h}`) }));
  const cards = shuffle([SY("ta", "un"), SY("mim", "an"), SY("dal", "in"), SY("kaf", "un"), SY("sin", "an"), SY("nun", "in")]).map(s => ({ ...s, key: s.h }));
  let misses = Math.min(2, await sortGame(bins, cards, "l4_tn_sort_no"));
  capNote.textContent = L("l4_tn_sort_end"); await sleep(900);
  /* проверка на слух: та же буква, разный танвин */
  clearStage(); alScene(3);
  let qm = 0;
  qm += await pick("l4_tn_pick", [SY("nun", "un"), SY("nun", "an"), SY("nun", "in")], 0); hideCap(); await sleep(300);
  qm += await pick("l4_tn_pick", [SY("qaf", "in"), SY("qaf", "un"), SY("qaf", "an")], 0); hideCap(); await sleep(300);
  await say("l4_tn_end", { named: true });
  hideCap(); await award("l4_tn");
  return qm + (misses > 1 ? 1 : 0);
}

/* ============ ГЛАВА 3: ДОЛГИЕ ЗВУКИ (МАДД) ============ */
/* Тянем звук: держи палец на букве — золото бежит по дорожке на два счёта. Отпустил — ждёт. 15 с без дела — тянется само */
function stretch(s, line, dur = 1500) {
  return new Promise(res => {
    const { W, H } = size();
    const cs = Math.min(W * 0.36, H * 0.2, 140), cy = Math.max(H * 0.52, 262 + cs / 2);
    const c = card(s.t, W / 2, cy, cs * 1.3, cs); c.classList.add("hint"); fadeIn(c, 400);
    const tw = Math.min(W - 48, 420), tr = track(W / 2, cy + cs / 2 + 48, tw, 2); fadeIn(tr, 400);
    let acc = 0, down = false, auto = false, fin = false, last = 0, lit = 0, playing = false, told = false;
    const play = () => { if (playing) return; playing = true; AR.say(s.snd).then(() => { playing = false; }); };
    const dn = ev => { ev.preventDefault(); if (fin) return; down = true; c.classList.remove("hint"); c.classList.add("hl"); idle.poke(); play(); };
    const up = () => {
      if (!down) return; down = false; c.classList.remove("hl");
      if (!fin && acc > 0 && !told) { told = true; capNote.textContent = L("l4_md_more"); }
    };
    c.addEventListener("pointerdown", dn); window.addEventListener("pointerup", up); window.addEventListener("pointercancel", up);
    const idle = alIdle(15000, () => { auto = true; play(); });
    const step = t => {
      if (fin) return;
      const dt = Math.min(50, t - (last || t)); last = t;
      if (down || auto) acc += dt;
      const p = Math.min(1, acc / dur); tr.set(p);
      const on = tr._beads.filter(b => b.classList.contains("on")).length;
      if (on > lit) { lit = on; Snd.tone({ f: 600 + on * 160, dur: 0.14, gain: 0.12 }); }
      if (p >= 1) return finish();
      requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
    cue(line);
    async function finish() {
      fin = true; idle.stop(); capNote.textContent = "";
      c.removeEventListener("pointerdown", dn); window.removeEventListener("pointerup", up); window.removeEventListener("pointercancel", up);
      c.classList.remove("hl", "hint"); c.classList.add("ok"); Snd.sparkle();
      await sleep(400); while (playing) await sleep(100);
      await AR.say(s.snd); await sleep(400);
      fadeOut(c, 350); fadeOut(tr, 350); await sleep(380); res(auto ? 1 : 0);
    }
  });
}
/* Коротко или долго? Звучит слог — нажми точку (коротко) или длинную дорожку (долго). Ответ открывает, как слог написан */
function earGame(rounds) {
  return new Promise(async res => {
    const { W, H } = size();
    const ss = Math.min(W * 0.3, H * 0.17, 120), sy = Math.max(H * 0.5, 270 + ss / 2);
    const spk = obj("l4-spk", `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9.5v5h3.5L12 18.5v-13L7.5 9.5z" fill="currentColor"/><path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/></svg>`, W / 2, sy, ss, ss);
    fadeIn(spk, 400);
    const bw = Math.min((W - 44) / 2, 190), bh = Math.min(H * 0.14, 104), ey = Math.min(H * 0.8, H - bh / 2 - 24);
    const shortSvg = `<svg viewBox="0 0 120 30" aria-hidden="true"><circle cx="96" cy="15" r="11" fill="#F0B43C"/></svg>`;
    const longSvg = `<svg viewBox="0 0 120 30" aria-hidden="true"><rect x="8" y="7" width="104" height="16" rx="8" fill="#F0B43C"/><circle cx="60" cy="15" r="5" fill="#fff"/><circle cx="18" cy="15" r="5" fill="#fff"/></svg>`;
    const bS = obj("l4-ear", `${shortSvg}<small>коротко</small>`, W / 2 + bw / 2 + 6, ey, bw, bh);
    const bL = obj("l4-ear", `${longSvg}<small>долго</small>`, W / 2 - bw / 2 - 6, ey, bw, bh);
    fadeIn(bS, 400); fadeIn(bL, 400);
    let r = 0, misses = 0, fin = false, cur = null, wait = null, hlT = null, autoT = null, busy = false;
    const playCur = async () => { spk.classList.add("hl"); await AR.say(cur.snd); spk.classList.remove("hl"); };
    spk.onclick = () => { if (fin || !cur || busy) return; Snd.tap(); playCur(); };
    const answer = async (isLong, auto) => {
      if (fin || !cur) return;
      if (busy) { if (auto) autoT = setTimeout(() => answer(cur.long, true), 1000); return; }
      busy = true; clearTimeout(hlT); clearTimeout(autoT);
      const ok = isLong === cur.long, btn = isLong ? bL : bS, good = cur.long ? bL : bS;
      if (ok) {
        if (auto) misses++;
        btn.classList.remove("hl"); btn.classList.add("ok"); Snd.tap(); celebrate();
        spk.innerHTML = `<span style="font-size:${ss * 0.42}px">${cur.t}</span>`;
        await AR.say(cur.snd); await sleep(700);
        btn.classList.remove("ok"); spk.innerHTML = spk._svg; busy = false; wait && wait();
      } else {
        misses++; Snd.thud(0.3); btn.classList.remove("no"); void btn.offsetWidth; btn.classList.add("no");
        capNote.textContent = L("l4_md_ear_no"); await playCur(); busy = false;
        hlT = setTimeout(() => good.classList.add("hl"), 3000);
        autoT = setTimeout(() => answer(cur.long, true), 15000);
      }
    };
    spk._svg = spk.innerHTML;
    bS.onclick = () => answer(false); bL.onclick = () => answer(true);
    cue("l4_md_ear"); capLine.ar = null;
    await Voice.speak("l4_md_ear");
    for (r = 0; r < rounds.length; r++) {
      cur = rounds[r]; capLine.ar = cur.snd; capNote.textContent = `${r + 1} из ${rounds.length}`;
      await sleep(400); await playCur();
      hlT = setTimeout(() => { if (cur) (cur.long ? bL : bS).classList.add("hl"); }, 15000);
      autoT = setTimeout(() => answer(cur.long, true), 25000);
      await new Promise(w => { wait = w; });
      wait = null;
    }
    fin = true; cur = null;
    [spk, bS, bL].forEach(e => fadeOut(e, 350)); capNote.textContent = ""; await sleep(400);
    res(misses);
  });
}
async function chMadd() {
  await toDark(); clearStage(); let { W, H } = alScene(2); Snd.amb("wind", 0.5); fromDark(); await sleep(300);
  await chapterTitle(null, "Долгие звуки", "l4_md_0");
  /* коротко и долго: бَ — одна бусина, بَا — две */
  const cs = Math.min(W * 0.24, H * 0.12, 100), cx = W - 16 - cs * 0.6, y1 = below(H * 0.5, cs), y2 = Math.min(H - cs / 2 - 14, y1 + cs * 1.45);
  const tl = cx - cs * 0.6 - 14, full = tl - 18;           // дорожки идут влево от карточки
  const c1 = card(syl(LET.ba, "a"), cx, y1, cs * 1.2, cs), c2 = card(syl(LET.ba, "aa"), cx, y2, cs * 1.2, cs);
  const t1 = track(tl - full * 0.2, y1, full * 0.4, 1), t2 = track(tl - full / 2, y2, full, 2);
  [c1, t1].forEach(e => fadeIn(e, 500)); c2.style.opacity = t2.style.opacity = "0";
  c1.onclick = () => { Snd.tap(); AR.say("ar_ba_a"); t1.run(450); };
  c2.onclick = () => { Snd.tap(); AR.say("ar_ba_aa"); t2.run(1300); };
  await say("l4_md_1");
  c1.classList.add("hl");
  await sayDo("l4_md_2", () => Promise.all([AR.say("ar_ba_a"), t1.run(450)]), { ar: "ar_ba_a" });
  c1.classList.remove("hl");
  c2.style.opacity = t2.style.opacity = ""; fadeIn(c2, 400); fadeIn(t2, 400); c2.classList.add("hl");
  await sayDo("l4_md_3", async () => { t1.set(0); await Promise.all([AR.say("ar_ba_aa"), t2.run(1300)]); }, { ar: "ar_ba_aa" });
  c2.classList.remove("hl");
  [c1, c2, t1, t2].forEach(e => fadeOut(e, 300)); await sleep(350);
  /* три помощника: Алиф, Йа, Уау */
  const hs = ["aa", "ii", "uu"], hw = Math.min((W - 40) / 3 - 12, 112);
  const help = hs.map((h, k) => {
    const base = syl(LET.ba, h.slice(1)), tail = syl(LET.ba, h).slice(base.length);
    const e = card(`${base}${ZJ}<b>${ZJ}${tail}</b>`, W / 2 + (1 - k) * (hw + 12), below(H * 0.6, hw), hw);
    e.onclick = () => { Snd.tap(); AR.say(`ar_ba_${h}`); };
    fadeIn(e, 400); return e;
  });
  await sayDo("l4_md_4", async () => { for (let k = 0; k < 3; k++) { help[k].classList.add("hl"); await AR.say(`ar_ba_${hs[k]}`); help[k].classList.remove("hl"); await sleep(250); } });
  help.forEach(e => fadeOut(e, 300)); await sleep(350);
  /* тянем звук сами */
  hideCap(); clearStage(); ({ W, H } = alScene(3)); await sleep(200);
  let misses = 0;
  const hold = [SY("sin", "aa"), SY("nun", "uu"), SY("mim", "ii")];
  for (let k = 0; k < hold.length; k++) misses += await stretch(hold[k], k ? "l4_md_hold2" : "l4_md_hold");
  /* на слух: коротко или долго */
  hideCap(); clearStage(); alScene(0); await sleep(200);
  const ls = shuffle(["ba", "ta", "nun", "mim", "lam", "ra", "kaf", "fa"]);
  const kinds = shuffle([["a", false], ["aa", true], ["i", false], ["ii", true], ["u", false], ["uu", true]]);
  const rounds = kinds.map(([h, long], k) => ({ ...SY(ls[k], h), long }));
  misses += Math.min(2, await earGame(rounds));
  /* проверка: что написано */
  hideCap(); clearStage(); alScene(1); await sleep(200);
  let qm = 0;
  qm += await pick("l4_md_pick", [SY("ta", "uu"), SY("ta", "u"), SY("ta", "aa")], 0); hideCap(); await sleep(300);
  qm += await pick("l4_md_pick", [SY("kaf", "ii"), SY("kaf", "i"), SY("kaf", "uu")], 0); hideCap(); await sleep(300);
  await say("l4_md_end", { named: true });
  hideCap(); await award("l4_md");
  return qm + (misses > 2 ? 1 : 0);
}

/* ============ ГЛАВА 4: ЧИТАЕМ КОРОТКО И ДОЛГО ============ */
const DOOR = '<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M20 92 V42 A30 30 0 0 1 80 42 V92Z" fill="#8E5A2E"/><path d="M28 92 V44 A22 22 0 0 1 72 44 V92Z" fill="#C98A4E"/><path d="M50 22 V92" stroke="#8E5A2E" stroke-width="3"/><path d="M34 52 H46 M54 52 H66 M34 72 H46 M54 72 H66" stroke="#A86D38" stroke-width="3" stroke-linecap="round"/><circle cx="45" cy="62" r="3.5" fill="#F5C451"/><circle cx="55" cy="62" r="3.5" fill="#F5C451"/><rect x="12" y="90" width="76" height="7" rx="3" fill="#8A7B6A"/></svg>';
const SPEECH = '<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M16 16 H84 a10 10 0 0 1 10 10 V60 a10 10 0 0 1 -10 10 H46 L28 88 V70 H16 a10 10 0 0 1 -10 -10 V26 a10 10 0 0 1 10 -10Z" fill="#fff" stroke="#9FC3D4" stroke-width="3"/><text x="50" y="54" text-anchor="middle" font-family="Amiri, serif" font-weight="700" font-size="30" fill="#1F5B74">قَالَ</text></svg>';
const picSvg = k => ({ door: DOOR, speech: SPEECH })[k] || `<svg viewBox="0 0 100 100" aria-hidden="true">${PIC[k] || ""}</svg>`;
const WORDS = {
  bab: { t: "بَابٌ", snd: "ar_l4_bab", pic: "door", ru: "бабун: дверь", line: "l4_rd_bab", parts: [SY("ba", "aa"), SY("ba", "un")] },
  qala: { t: "قَالَ", snd: "ar_l4_qala", pic: "speech", ru: "каля: сказал", line: "l4_rd_qala", parts: [SY("qaf", "aa"), SY("lam", "a")] },
  kitab: { t: "كِتَابٌ", snd: "ar_l4_kitab", pic: "book", ru: "китабун: книга", line: "l4_rd_kitab", parts: [{ ...SY("kaf", "i"), t: syl(LET.kaf, "i") + ZJ }, { ...SY("ta", "aa"), t: ZJ + syl(LET.ta, "aa") }, SY("ba", "un")] },
  nur: { t: "نُور", snd: "ar_l4_nur", pic: "light", ru: "нур: свет" },
  shams: { t: LET.shin.word[0], snd: "ar_w_shin", pic: "sun", ru: "шамс: солнце" },
  najm: { t: LET.nun.word[0], snd: "ar_w_nun", pic: "star", ru: "наджм: звезда" }
};
/* Картинка слова рядом с карточкой */
async function showPic(w, x, y, s) {
  const p = obj("al-pic", picSvg(w.pic), x, y, s, s); p.style.zIndex = 6; fadeIn(p, 400);
  return p;
}
/* Читаем пальцем: тяни золотой кружок по дорожке под словом справа налево — каждый слог загорается и звучит, в конце — всё слово */
function readWord(w, line) {
  return new Promise(async res => {
    const { W, H } = size();
    try { await Promise.race([document.fonts.load('700 80px "Amiri"', w.t), sleep(1500)]); } catch (e) {}
    const fs = Math.min(W * 0.2, H * 0.11, 92), wy = Math.max(H * 0.5, 290);
    const box = el("div", "l4-word", stage, w.parts.map(p => `<span>${p.t}</span>`).join(""));
    box.style.fontSize = fs + "px"; put(box, W / 2, wy);
    try { await fadeIn(box, 400).finished; } catch (e) {}
    const sr = stage.getBoundingClientRect(), spans = [...box.children];
    const rs = spans.map(s => { const r = s.getBoundingClientRect(); return { l: r.left - sr.left, r: r.right - sr.left, c: (r.left + r.right) / 2 - sr.left }; });
    const R = Math.min(W - 32, Math.max(...rs.map(x => x.r)) + 56), Lx = Math.max(22, Math.min(...rs.map(x => x.l)) - 36), ty = wy + box.offsetHeight / 2 + 46;
    const rail = el("div", "l4-rail", stage); Object.assign(rail.style, { left: Lx + "px", width: (R - Lx) + "px", top: ty + "px" });
    const segs = rs.map(x => { const s = el("div", "l4-seg", stage); Object.assign(s.style, { left: (x.l + 4) + "px", width: Math.max(10, x.r - x.l - 8) + "px", top: ty + "px" }); return s; });
    const ks = 58, knob = obj("l4-knob", `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12H6M11 6l-6 6 6 6" stroke="#7A4A14" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`, R, ty, ks, ks);
    knob.classList.add("hint"); fadeIn(knob, 400);
    let read = rs.map(() => false), q = Promise.resolve(), fin = false, drag = false, sweeping = false;
    const check = x => {
      rs.forEach((r, i) => {
        if (read[i] || x > r.c || (i && !read[i - 1])) return;
        read[i] = true; spans[i].classList.add("on"); segs[i].classList.add("on"); Snd.tap();
        q = q.then(() => AR.say(w.parts[i].snd));
      });
      if (read.every(Boolean)) finish();
    };
    const setX = x => { x = Math.max(Lx, Math.min(R, x)); put(knob, x, ty); check(x); };
    const dn = ev => { ev.preventDefault(); if (fin || sweeping) return; drag = true; knob.classList.remove("hint"); idle.poke(); };
    const mv = ev => { if (!drag || fin) return; setX(local(ev).x); };
    const up = () => { drag = false; };
    knob.addEventListener("pointerdown", dn); window.addEventListener("pointermove", mv); window.addEventListener("pointerup", up); window.addEventListener("pointercancel", up);
    spans.forEach((s, i) => s.onclick = () => { if (!fin) { Snd.tap(); AR.say(w.parts[i].snd); } });
    /* 15 с ничего — кружок едет сам */
    const idle = alIdle(15000, async () => {
      if (fin) return; sweeping = true; knob.classList.remove("hint");
      while (!fin) { setX(knob._x - 4); await sleep(30); }
    });
    cue(line);
    async function finish() {
      if (fin) return; fin = true; idle.stop(); drag = false;
      knob.removeEventListener("pointerdown", dn); window.removeEventListener("pointermove", mv); window.removeEventListener("pointerup", up); window.removeEventListener("pointercancel", up);
      move(knob, Lx, ty, 250);
      await q; await sleep(300);
      box.classList.add("all"); Snd.sparkle(); await AR.say(w.snd);
      [knob, rail, ...segs].forEach(e => fadeOut(e, 300));
      res(box);
    }
  });
}
async function chRead() {
  await toDark(); clearStage(); let { W, H } = alScene(3); Snd.amb("wind", 0.5); fromDark(); await sleep(300);
  await chapterTitle(null, "Читаем слова", "l4_rd_0");
  /* три знака уровня рядом */
  const hw = Math.min((W - 40) / 3 - 12, 112);
  const three = [SY("ba", "sk"), SY("ba", "un"), SY("ba", "aa")].map((s, k) => {
    const e = card(s.t, W / 2 + (1 - k) * (hw + 12), below(H * 0.6, hw), hw); e.onclick = () => { Snd.tap(); AR.say(s.snd); }; fadeIn(e, 400); return e;
  });
  await sayDo("l4_rd_1", async () => { for (const [k, s] of [SY("ba", "sk"), SY("ba", "un"), SY("ba", "aa")].entries()) { three[k].classList.add("hl"); await AR.say(s.snd); three[k].classList.remove("hl"); await sleep(200); } });
  three.forEach(e => fadeOut(e, 300)); await sleep(350);
  /* домики: сукун / танвин / мадд */
  cue("l4_rd_sort");
  const bins = [
    { key: "sk", html: syk("ba"), ru: "сукун", tap: () => Voice.speak("l4_rd_b_sk") },
    { key: "tn", html: syl(LET.ba, "un"), ru: "танвин", tap: () => Voice.speak("l4_rd_b_tn") },
    { key: "md", html: syl(LET.ba, "aa"), ru: "мадд", tap: () => Voice.speak("l4_rd_b_md") }
  ];
  const cards = shuffle([[SY("mim", "sk"), "sk"], [SY("dal", "sk"), "sk"], [SY("ta", "un"), "tn"], [SY("sin", "in"), "tn"], [SY("nun", "aa"), "md"], [SY("kaf", "uu"), "md"]]).map(([s, key]) => ({ ...s, key }));
  let misses = Math.min(2, await sortGame(bins, cards, "l4_rd_sort_no"));
  await sleep(300);
  /* читаем пальцем три слова из Корана */
  hideCap(); clearStage(); ({ W, H } = alScene(0)); await sleep(200);
  const list = ["bab", "qala", "kitab"];
  for (let k = 0; k < list.length; k++) {
    const w = WORDS[list[k]];
    const box = await readWord(w, k ? "l4_rd_read2" : "l4_rd_read");
    let ps = Math.min(W * 0.3, H * 0.16, 120);
    const bh = box.offsetHeight, bwid = box.offsetWidth, by = below(H * 0.47, bh);
    let p;
    if (by + bh / 2 + ps + 34 <= H) { await move(box, W / 2, by, 300); p = await showPic(w, W / 2, by + bh / 2 + ps / 2 + 20, ps); }
    else {                                                   /* низкий экран: картинка слева от слова */
      ps = Math.min(ps, W - bwid - 44); const bx = W - 14 - bwid / 2;
      await move(box, bx, by, 300); p = await showPic(w, (bx - bwid / 2) / 2, by, ps);
    }
    box.style.cursor = "pointer"; box.onclick = () => { Snd.tap(); AR.say(w.snd); };
    await sayDo(w.line, () => AR.say(w.snd), { note: w.ru, ar: w.snd });
    fadeOut(box, 300); fadeOut(p, 300); await sleep(350);
  }
  /* нур: свет — долгий звук и остановка на последней букве */
  const nur = WORDS.nur, ncs = Math.min(W * 0.5, 210), nh = Math.min(H * 0.13, 100);
  const ny = below(H * 0.5, nh), nps = Math.min(W * 0.3, H * 0.16, 120);
  const nc = card(nur.t, W / 2, ny, ncs, nh, nh * 0.62); fadeIn(nc, 400);
  nc.onclick = () => { Snd.tap(); AR.say(nur.snd); };
  const np = await showPic(nur, W / 2, Math.min(ny + nh / 2 + nps / 2 + 12, H - nps / 2 - 8), nps);
  await sayAr("l4_rd_nur", nur.snd, { note: nur.ru });
  fadeOut(nc, 300); fadeOut(np, 300); await sleep(350);
  /* слушай слово — найди, где оно написано */
  hideCap(); clearStage(); ({ W, H } = alScene(1)); await sleep(200);
  const Wd = WORDS, rounds = [[Wd.nur, Wd.bab, Wd.shams], [Wd.shams, Wd.najm, Wd.qala], [Wd.kitab, Wd.nur, Wd.bab]];
  let qm = 0;
  for (const r of rounds) {
    qm += await pick("l4_rd_pick", r, 0, async c => {
      capNote.textContent = r[0].ru;
      const s = Math.min(W * 0.26, H * 0.14, 104);
      await move(c, W / 2, H * 0.5, 300);
      const p = await showPic(r[0], W / 2, Math.min(H * 0.5 + c.offsetHeight / 2 + s / 2 + 16, H - s / 2 - 12), s);
      await sleep(1400); fadeOut(p, 300);
    });
    hideCap(); await sleep(300);
  }
  await say("l4_rd_end", { named: true });
  hideCap(); await award("l4_rd");
  return Math.min(2, qm) + (misses > 1 ? 1 : 0);
}

regChapter(3, { id: "l4_sukun", name: "Сукун", icon: chIcon(sk1("ba")), fn: chSukun, lines: "l4_sk_" });
regChapter(3, { id: "l4_tanwin", name: "Танвин", icon: chIcon(syl(LET.ba, "un")), fn: chTanwin, lines: "l4_tn_" });
regChapter(3, { id: "l4_madd", name: "Долгие звуки", icon: chIcon(syl(LET.ba, "aa")), fn: chMadd, lines: "l4_md_" });
regChapter(3, { id: "l4_read", name: "Читаем: коротко и долго", icon: chIcon("نُور"), fn: chRead, lines: "l4_rd_" });
})();
