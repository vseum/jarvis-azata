"use strict";
/* «Алиф-Ба», уровень 5 «Читаем Коран»: шадда, аль- (солнечные и лунные буквы), первые слова из Корана, первый аят (112:1).
   Слова — как в мусхафе в упрощённой орфографии (quran-simple, api.alquran.cloud). Звуки слов — ar_l5_* (alifba/ar_extra_l5.json),
   чтец — voice/qari (1 — Бисмилля, 6222 — 112:1). Реплики — js/lines_l5.js (префикс l5_). */

addCSS(`
.l5-card { position: absolute; translate: -50% -50%; z-index: 7; display: grid; place-items: center; box-sizing: border-box;
  padding: 0 .4em; border-radius: 24px; background: linear-gradient(180deg, #FFFDF5, #FFF1CF);
  box-shadow: 0 6px 0 #E2C77E, 0 18px 30px -14px rgba(0,0,0,.45);
  font-family: "Amiri", serif; font-weight: 700; color: #1F5B74; line-height: 1.75; direction: rtl; white-space: nowrap;
  cursor: pointer; user-select: none; -webkit-user-select: none; transition: scale .15s, opacity .3s, box-shadow .25s, background .25s; }
.l5-card:active { scale: .95; }
.l5-card > span { display: inline-block; }
.l5-card b { color: #D9822B; font-weight: 700; transition: color .4s, text-shadow .4s; }
.l5-card b.lit { color: #E0601A; text-shadow: 0 0 16px rgba(255,196,70,.95); }
.l5-card .l5-lam { transition: opacity 1s; }
.l5-card .l5-lam.hide { opacity: .16; }
.l5-card.hl { box-shadow: 0 6px 0 #E2C77E, 0 0 0 5px rgba(245,196,81,.95), 0 18px 30px -14px rgba(0,0,0,.45); }
.l5-card.ok { background: linear-gradient(180deg, #F2FFF6, #D6F2E1); box-shadow: 0 6px 0 #A9D9BC, 0 0 0 4px rgba(70,185,122,.7); }
.l5-card.no { animation: shake .42s; }
.l5-card.off { opacity: .45; pointer-events: none; }
.l5-card.set { box-shadow: 0 4px 0 #E2C77E; cursor: default; }
.l5-card .l5-pic { display: block; margin: 0 auto; }
.l5-card .l5-col { display: flex; flex-direction: column; align-items: center; line-height: 1.5; }
.l5-twins { position: absolute; translate: -50% 0; display: flex; gap: 16px; direction: rtl; z-index: 7; pointer-events: none; }
.l5-twins i { width: 54px; height: 54px; border-radius: 50%; display: grid; place-items: center; font-style: normal;
  font-family: "Amiri", serif; font-size: 30px; font-weight: 700; line-height: 1; color: rgba(31,91,116,.3);
  background: rgba(255,255,255,.4); box-shadow: inset 0 0 0 3px rgba(255,255,255,.7); transition: background .25s, color .25s, scale .25s; }
.l5-twins i.on { background: #FFD66B; color: #1F5B74; scale: 1.12; box-shadow: 0 0 0 5px rgba(255,214,107,.45); }
.l5-slot { position: absolute; translate: -50% -50%; box-sizing: border-box; border-radius: 18px; border: 3px dashed rgba(255,255,255,.8);
  background: rgba(255,255,255,.18); z-index: 6; }
.l5-slot.on { border-color: #FFD66B; background: rgba(255,214,107,.3); animation: l5-pulse 1.1s ease-in-out infinite; }
@keyframes l5-pulse { 50% { scale: 1.07; } }
.l5-orb { z-index: 6; cursor: pointer; transition: filter .8s; }
.l5-orb.lit { filter: drop-shadow(0 0 24px rgba(255,226,140,1)); }
.l5-orb.rays { animation: l5-rays 1.2s ease-out; }
@keyframes l5-rays { 30% { scale: 1.25; } }
.l5-bin { z-index: 6; cursor: pointer; }
.l5-bin.bump { animation: l5-bump .45s; }
@keyframes l5-bump { 40% { scale: 1.2; } }
.l5-binl { position: absolute; translate: -50% 0; z-index: 6; white-space: nowrap; font-weight: 900; font-size: 17px; color: #fff;
  text-shadow: 0 2px 8px rgba(0,0,0,.5); pointer-events: none; }
.l5-binl b { display: inline-block; min-width: 1.4em; margin-right: 4px; padding: 0 6px; border-radius: 10px; background: rgba(255,255,255,.3); }
.l5-ayah { position: absolute; left: 50%; translate: -50% -50%; z-index: 7; display: flex; align-items: center; gap: .14em; direction: rtl;
  padding: .22em .3em .12em; border-radius: 26px; background: linear-gradient(180deg, #FFFDF5, #FFF1CF);
  box-shadow: 0 6px 0 #E2C77E, 0 18px 30px -14px rgba(0,0,0,.45);
  font-family: "Amiri", serif; font-weight: 700; color: #1F5B74; line-height: 1.9; white-space: nowrap; user-select: none; -webkit-user-select: none; }
.l5-aw { display: inline-block; padding: 0 .13em; border-radius: 14px; cursor: pointer; transition: background .25s, color .25s, box-shadow .25s; }
.l5-aw.on { background: rgba(255,214,107,.55); box-shadow: 0 0 0 3px rgba(245,196,81,.95); animation: l5-pulse 1.1s ease-in-out infinite; }
.l5-aw.hl { background: rgba(255,214,107,.8); }
.l5-aw.done { color: #C0601A; }
.l5-aw.no { animation: shake .42s; }
.l5-aw.known { color: #D9822B; }
.l5-an { font-size: .72em; color: #B9802A; }
.l5-ref { position: absolute; left: 50%; translate: -50% 0; z-index: 7; white-space: nowrap; font-weight: 900; font-size: 17px; color: #fff;
  text-shadow: 0 2px 8px rgba(0,0,0,.5); pointer-events: none; }
`);

/* Сокровища уровня */
ITEMS.push(
  { id: "l5_shadda", name: "Шадда", svg: glyphSvg("بّ") },
  { id: "l5_al", name: "Аль-", svg: glyphSvg("ال") },
  { id: "l5_words", name: "Первые слова", svg: glyphSvg("رَبّ") },
  { id: "l5_ayah", name: "Первый аят", svg: glyphSvg("قُلْ") }
);
/* Карточка аята 112:1 для ayahCard (в «Алиф-Ба» своих AYAT нет) */
window.AYAT = window.AYAT || {};
if (!window.AYAT["112:1"]) window.AYAT["112:1"] = { ref: "Сура аль-Ихлас, 112:1", tr: "l5_4_tr", parts: [{ n: 6222, ar: "قُلْ هُوَ اللَّهُ أَحَدٌ" }] };

/* ============ ОБЩЕЕ ============ */
const l5Shuffle = a => { const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
/* Карточка со словом (центр в x, y). w, h — размер; без них карточка по тексту */
function l5Card(html, x, y, fs, w, h) {
  const e = el("div", "l5-card", stage, `<span>${html}</span>`);
  e.style.fontSize = fs + "px"; if (w) e.style.width = w + "px"; if (h) e.style.height = h + "px";
  put(e, x, y); return e;
}
/* Текст карточки не шире maxW: уменьшаем шрифт */
function l5Fit(e, maxW) { const s = e.firstElementChild, w = s ? s.offsetWidth : e.offsetWidth; if (w > maxW) e.style.fontSize = (parseFloat(e.style.fontSize) * maxW / w) + "px"; }
/* Верх свободной зоны: подпись на узком экране бывает высокой, важные объекты — ниже неё */
const l5T = () => Math.max(size().H * 0.36, 262);
const l5Jump = (e, hgt = 40) => e.animate([{ transform: "translateY(0)" }, { transform: `translateY(${-hgt}px)`, offset: 0.4 }, { transform: "translateY(0)" }], { duration: 380, easing: "ease-out" });
async function l5Begin(pal, name, line) {
  await toDark(); clearStage(); alScene(pal); Snd.amb("wind", 0.4); fromDark(); await sleep(300);
  try { await Promise.race([document.fonts.load('700 60px "Amiri"', "بِسْمِ اللَّهِ"), sleep(2000)]); } catch (e) {}
  await chapterTitle(null, name, line);
}
/* Чтец читает аят n; слова spans подсвечиваются по очереди (onsets — начало слов, в секундах, на слух) */
async function l5Qari(n, onsets, spans) {
  const hl = i => spans.forEach((s, k) => s.classList.toggle("hl", k === i));
  if (!Voice.on || !Snd.ac) { for (let i = 0; i < spans.length; i++) { hl(i); await sleep(700); } hl(-1); return; }
  Voice.stop(); const my = Voice.seq;
  let b; try { b = await Voice.buffer("qari", n); } catch (e) { hl(-1); return; }
  if (my !== Voice.seq) return;
  cap.classList.add("talk");
  const ts = onsets.map((t, i) => setTimeout(() => { if (my === Voice.seq) hl(i); }, t * 1000));
  await new Promise(r => { Voice.play(b, r); setTimeout(r, b.duration * 1000 + 1500); });
  ts.forEach(clearTimeout); hl(-1); if (my === Voice.seq) cap.classList.remove("talk");
}
/* Звучит слово — нажми на карточку с ним. items: [{ ar, id }]. Подсказка через 15 с, сам выбор через 28 с. Возвращает ошибки */
function l5Pick(lineId, items, target, noLine) {
  return new Promise(async res => {
    const { W, H } = size(), n = items.length;
    const cw = Math.min((W - 32) / n - 12, n > 2 ? 120 : 160), ch = Math.min(cw * 0.8, 110), y = Math.max(l5T() + ch / 2 + 30, H * 0.56);
    const order = l5Shuffle(items);
    let misses = 0, fin = false;
    const cards = order.map((it, i) => {
      const c = l5Card(it.ar, W / 2 + ((n - 1) / 2 - i) * (cw + 12), y, ch * 0.42, cw, ch); l5Fit(c, cw * 0.86);
      c._it = it; c._pick = true; fadeIn(c, 400);
      c.onclick = async () => {
        if (fin || c.classList.contains("off")) return;
        if (it === target) {
          fin = true; clearTimeout(t1); clearTimeout(t2);
          c.classList.remove("hl"); c.classList.add("ok"); Snd.tap(); celebrate(); capNote.textContent = L("a_right");
          await AR.say(it.id); await sleep(500);
          cards.forEach(x => fadeOut(x, 300)); capNote.textContent = ""; await sleep(320); res(misses);
        } else {
          misses++; c.classList.add("no", "off"); Snd.thud(0.3); capNote.textContent = L(noLine);
          await AR.say(it.id); await sleep(300); if (!fin) AR.say(target.id);
        }
      };
      return c;
    });
    const tc = cards[order.indexOf(target)];
    const t1 = setTimeout(() => { if (!fin) tc.classList.add("hl"); }, 15000);
    const t2 = setTimeout(() => { if (!fin) tc.onclick(); }, 28000);
    showCap(lineId); capLine.ar = target.id;
    await Voice.speak(lineId); if (!fin) await AR.say(target.id);
  });
}
/* Собери по порядку справа налево: pieces [{ t, s? }] — кусочки (s — звук кусочка). Клетки сверху, кусочки вперемешку снизу.
   Нет верного нажатия 10 с — подсказка, 20 с — кусочки встают сами. Возвращает ошибки */
function l5Build(pieces, opt = {}) {
  return new Promise(res => {
    const { W, H } = size(), n = pieces.length;
    const s = opt.w || Math.min((W - 32) / n - 10, 86, H * 0.12), sh = opt.h || s;
    const xs = i => W / 2 + ((n - 1) / 2 - i) * (s + 10);   // 0 — справа
    const y1 = l5T() + sh / 2 + 22, y2 = y1 + sh + 48;
    const slots = pieces.map((p, i) => { const e = el("div", "l5-slot", stage); e.style.width = s + "px"; e.style.height = sh + "px"; put(e, xs(i), y1); return e; });
    let pos = l5Shuffle(pieces.map((_, i) => i));
    if (n > 1) while (pos.every((p, i) => p === i)) pos = l5Shuffle(pos);
    const cards = pieces.map((p, i) => { const c = l5Card(p.t, xs(pos[i]), y2, opt.fs || s * 0.72, s, sh); c._i = i; l5Fit(c, s * 0.9); fadeIn(c, 400); return c; });
    let k = 0, fin = false, last = Date.now(), auto = false, misses = 0;
    slots[0].classList.add("on");
    const place = c => {
      c.classList.remove("hl"); c.classList.add("set"); Snd.pop();
      move(c, slots[k]._x, slots[k]._y, 300, "ease-out");
      if (pieces[c._i].s) AR.say(pieces[c._i].s);
      slots[k].classList.remove("on"); k++; last = Date.now(); capNote.textContent = "";
      if (k < n) slots[k].classList.add("on"); else finish();
    };
    cards.forEach(c => c.onclick = () => {
      if (fin || c.classList.contains("set")) return;
      if (c._i === k) return place(c);
      misses++; Snd.thud(0.25); c.classList.remove("no"); void c.offsetWidth; c.classList.add("no");
      capNote.textContent = L(opt.no || "l5_3_no");
      cards.find(x => x._i === k).classList.add("hl");
    });
    const iv = setInterval(() => {
      if (fin) return;
      const d = Date.now() - last, nx = cards.find(x => x._i === k);
      if (d > 10000) nx.classList.add("hl");
      if (d > 20000) auto = true;
      if (auto && d > 900) place(nx);
    }, 300);
    async function finish() {
      fin = true; clearInterval(iv);
      await sleep(650); Snd.sparkle();
      slots.forEach(e => fadeOut(e, 300)); cards.forEach(e => fadeOut(e, 300)); await sleep(320);
      res(misses);
    }
  });
}

/* ============ ГЛАВА 1: ШАДДА ============ */
const L5_TWINS = [
  { ar: "رَ<b>بّ</b>", id: "ar_l5_rabb", sh: "بّ", ch: "ب", line: "l5_1_w1", note: "рабб — Господь" },
  { ar: "أُ<b>مّ</b>", id: "ar_l5_umm", sh: "مّ", ch: "م", line: "l5_1_w2", note: "умм — мама" },
  { ar: "جَ<b>نَّ</b>ة", id: "ar_l5_janna", sh: "نّ", ch: "ن", line: "l5_1_w3", note: "джанна — Рай, сад" }
];
const L5_PAIRS = [
  [{ ar: "دَرَسَ", id: "ar_l5_darasa" }, { ar: "دَ<b>رَّ</b>سَ", id: "ar_l5_darrasa" }],
  [{ ar: "كَسَرَ", id: "ar_l5_kasara" }, { ar: "كَ<b>سَّ</b>رَ", id: "ar_l5_kassara" }]
];
const L5_FIND = [
  { ar: "ظِلّ", id: "ar_w_zza", sh: true }, { ar: "رُمَّان", id: "ar_w_ra", sh: true }, { ar: "رَبّ", id: "ar_l5_rabb", sh: true },
  { ar: "بَيْت", id: "ar_w_ba", sh: false }, { ar: "قَمَر", id: "ar_w_qaf", sh: false }, { ar: "شَمْس", id: "ar_w_shin", sh: false }
];
/* Буква-двойняшка: нажми на неё два раза — она прыгает, загораются две буквы-близняшки, потом звучит слово */
async function l5Twin(w) {
  const { W, H } = size();
  const ls = Math.min(W * 0.3, H * 0.15, 116);
  const ly = l5T() + ls / 2 + 10;
  const letter = l5Card(w.sh, W / 2, ly, ls * 0.62, ls, ls); fadeIn(letter, 400);
  const tw = el("div", "l5-twins", stage, `<i>${w.ch}</i><i>${w.ch}</i>`); put(tw, W / 2, ly + ls / 2 + 14);
  const word = l5Card(w.ar, W / 2, 0, Math.min(72, W * 0.17)); put(word, W / 2, ly + ls / 2 + 14 + 54 + 16 + word.offsetHeight / 2); fadeIn(word, 400);
  cue(w.line);
  const hop = k => { if (k > 2) return; l5Jump(letter, 46); Snd.tone({ f: k === 1 ? 520 : 780, dur: 0.14, gain: 0.12 }); tw.children[k - 1].classList.add("on"); };
  const k = await taps(letter, 2, hop, 15000);
  for (let i = k + 1; i <= 2; i++) { await sleep(450); hop(i); }
  await sleep(450); word.classList.add("ok"); Snd.sparkle(); fadeOut(letter, 300);   // буква отпрыгала — место под подпись
  await sayAr("l5_1_wok", w.id, { note: w.note });
  [tw, word].forEach(e => fadeOut(e, 300)); await sleep(330);
}
/* Найди все слова с шаддой: сетка 3×2 */
function l5FindShadda(items) {
  return new Promise(res => {
    const { W, H } = size();
    const cw = Math.min((W - 40) / 3 - 10, 130), ch = Math.min(cw * 0.78, H * 0.13), need = items.filter(i => i.sh).length;
    let found = 0, misses = 0, fin = false;
    const cards = l5Shuffle(items).map((it, i) => {
      const c = l5Card(it.ar, W / 2 + (1 - (i % 3)) * (cw + 10), l5T() + ch / 2 + 14 + Math.floor(i / 3) * (ch + 22), ch * 0.42, cw, ch); l5Fit(c, cw * 0.86);
      c._it = it; fadeIn(c, 400);
      c.onclick = () => {
        if (fin || c.classList.contains("ok") || c.classList.contains("off")) return;
        AR.say(it.id);
        if (it.sh) { c.classList.remove("hl"); c.classList.add("ok"); Snd.pop(); found++; capNote.textContent = ""; if (found >= need) end(); }
        else { misses++; Snd.thud(0.25); c.classList.add("no", "off"); capNote.textContent = L("l5_1_nosh"); }
      };
      return c;
    });
    const left = () => cards.filter(c => c._it.sh && !c.classList.contains("ok"));
    const t1 = setTimeout(() => { if (!fin && left()[0]) left()[0].classList.add("hl"); }, 16000);
    const t2 = setTimeout(async () => { for (const c of left()) { if (fin) return; c.classList.add("ok"); Snd.pop(); await sleep(600); } end(); }, 32000);
    async function end() {
      if (fin) return; fin = true; clearTimeout(t1); clearTimeout(t2);
      celebrate(); await sleep(1200); cards.forEach(c => fadeOut(c, 300)); capNote.textContent = ""; await sleep(330);
      res(misses);
    }
    cue("l5_1_10");
  });
}
async function l5Shadda() {
  await l5Begin(0, "Шадда", "l5_1_0");
  const { W, H } = size();
  /* значок */
  const T = l5T(), sz = Math.min(W * 0.5, (H * 0.9 - T) * 0.7, 200);
  const sign = l5Card("ـّـ", W / 2, T + sz / 2 + 16, sz * 0.8, sz, sz); fadeIn(sign, 600); Snd.sparkle();   // шадда на чёрточке-татвиле: значок виден целиком
  await say("l5_1_1"); await say("l5_1_2"); await say("l5_1_2b");
  fadeOut(sign, 300); await sleep(320);
  /* две Ба сливаются в одну с шаддой */
  const cs = Math.min(W * 0.34, H * 0.19, 140), cy = T + cs / 2 + 40;
  const a = l5Card(syl(LET.ba, "sk"), W * 0.72, cy, cs * 0.5, cs, cs), b = l5Card(syl(LET.ba, "a"), W * 0.28, cy, cs * 0.5, cs, cs);
  fadeIn(a, 400); fadeIn(b, 400);
  a.classList.add("hl"); await sayAr("l5_1_3", "ar_ba_sk", { once: true }); a.classList.remove("hl");
  b.classList.add("hl"); await sayAr("l5_1_4", "ar_ba_a", { once: true }); b.classList.remove("hl");
  cue("l5_1_5");
  await dragTo(b, a, 20000);
  Snd.pop(); fadeOut(a, 250); fadeOut(b, 250);
  const m = l5Card("أَ<b>بَّ</b>", W / 2, cy, cs * 0.55, cs * 1.4, cs); m.classList.add("ok"); fadeIn(m, 500); celebrate();
  await sayAr("l5_1_6", "ar_l5_abba", { note: "аб + ба = абба" });
  fadeOut(m, 300); await sleep(320);
  /* двойняшка */
  await say("l5_1_7");
  for (const w of L5_TWINS) await l5Twin(w);
  hideCap(); await sleep(300);
  /* одна или две: одно слово с шаддой, другое — без */
  let pm = 0;
  const first = Math.random() < 0.5 ? 1 : 0;
  for (let i = 0; i < L5_PAIRS.length; i++) {
    const p = L5_PAIRS[i], t = p[i === 0 ? first : 1 - first];
    pm += await l5Pick(i ? "l5_1_8b" : "l5_1_8", p, t, "l5_1_no"); hideCap(); await sleep(300);
  }
  /* найди шадду */
  const fm = await l5FindShadda(L5_FIND);
  await say("l5_1_end", { named: true });
  hideCap(); await award("l5_shadda");
  return Math.min(2, pm) + (fm > 1 ? 1 : 0);
}

/* ============ ГЛАВА 2: АЛЬ- И СОЛНЕЧНЫЕ / ЛУННЫЕ БУКВЫ ============ */
/* first — буква после аль- (по ней data.js знает, солнечная ли она); html — слово, буква после «ал» выделена */
const L5_AL = [
  { first: "shin", html: "ال<b>شَّ</b>مْس", id: "ar_l5_ashshams", pic: "sun" },
  { first: "qaf", html: "الْ<b>قَ</b>مَر", id: "ar_l5_alqamar", pic: "moon" },
  { first: "nun", html: "ال<b>نُّ</b>ور", id: "ar_l5_annur", pic: "light" },
  { first: "kaf", html: "الْ<b>كِ</b>تَاب", id: "ar_l5_alkitab", pic: "book" },
  { first: "ta", html: "ال<b>تِّ</b>ين", id: "ar_l5_attin", pic: "fig" },
  { first: "ba", html: "الْ<b>بَ</b>يْت", id: "ar_l5_albayt", pic: "house" },
  { first: "ra", html: "ال<b>رَّ</b>حِيم", id: "ar_l5_arrahim", pic: null },
  { first: "hha", html: "الْ<b>حَ</b>مْدُ", id: "ar_l5_alhamdu", pic: null }
].map(w => Object.assign(w, { sun: LET[w.first].sun }));
const L5_ORN = '<svg viewBox="0 0 40 40" aria-hidden="true">' + STAR8 + '</svg>';
/* Карточка слова с картинкой (у имён Аллаха и слова «хвала» вместо картинки — узор) */
function l5AlCard(w, x, y, cw, ch) {
  const ps = ch * 0.32, pic = w.pic ? `<svg class="l5-pic" viewBox="0 0 100 100" style="width:${ps}px;height:${ps}px" aria-hidden="true">${PIC[w.pic]}</svg>` : L5_ORN.replace("<svg ", `<svg class="l5-pic" style="width:${ps * 0.8}px;height:${ps}px" `);
  const c = el("div", "l5-card", stage, `<div class="l5-col">${pic}<span class="l5-w">${w.html}</span></div>`);
  Object.assign(c.style, { width: cw + "px", height: ch + "px", fontSize: ch * 0.36 + "px" }); put(c, x, y);
  const s = c.querySelector(".l5-w"); if (s.offsetWidth > cw * 0.86) c.style.fontSize = ch * 0.36 * cw * 0.86 / s.offsetWidth + "px";
  return c;
}
/* Разложи слова: перетащи (или нажми на солнце/луну). Каждое слово ждёт 18 с, потом уходит на место само */
function l5Sort(words) {
  return new Promise(res => {
    const { W, H } = size();
    const bs = Math.min(W * 0.28, H * 0.15, 116), cw = Math.min(W * 0.6, 240), ch = Math.min(cw * 0.7, H * 0.22), cy = l5T() + ch / 2 + 14;
    const by = Math.max(H * 0.8, cy + ch / 2 + bs / 2 + 22);
    const sun = obj("l5-bin", ART.sun, W * 0.76, by, bs, bs), moon = obj("l5-bin", `<svg viewBox="0 0 100 100" aria-hidden="true">${PIC.moon}</svg>`, W * 0.24, by, bs * 0.9, bs * 0.9);
    const lab = (x, t) => { const e = el("div", "l5-binl", stage, `${t} <b>0</b>`); put(e, x, by + bs / 2 + 2); return e; };
    const sunL = lab(W * 0.76, "Солнце"), moonL = lab(W * 0.24, "Луна");
    let i = 0, misses = 0, fin = false, cur = null, drag = null, busy = false, timer = null, hint = null, nSun = 0, nMoon = 0;
    const next = () => {
      if (i >= words.length) return end();
      const w = words[i++];
      cur = l5AlCard(w, W / 2, cy, cw, ch); cur._w = w; fadeIn(cur, 400);
      AR.say(w.id);
      const hb = w.sun ? sun : moon;
      hint = setTimeout(() => { if (cur && cur._w === w) hb.classList.add("hint"); }, 9000);   // подсказка: где место этому слову
      timer = setTimeout(() => judge(w.sun, true), 18000);
    };
    const judge = async (toSun, auto) => {
      if (busy || !cur || fin) return;
      const c = cur, w = c._w;
      if (toSun === w.sun) {
        busy = true; clearTimeout(timer); clearTimeout(hint); sun.classList.remove("hint"); moon.classList.remove("hint"); cur = null;
        const b = w.sun ? sun : moon; Snd.pop();
        capNote.textContent = L(w.sun ? "l5_2_sun" : "l5_2_moon");
        await move(c, b._x, b._y, 380, "ease-in"); fadeOut(c, 200);
        b.classList.remove("bump"); void b.offsetWidth; b.classList.add("bump"); Snd.chirp();
        if (w.sun) sunL.querySelector("b").textContent = ++nSun; else moonL.querySelector("b").textContent = ++nMoon;
        await sleep(700); busy = false; capNote.textContent = ""; next();
      } else {
        misses++; Snd.thud(0.3); c.classList.remove("no"); void c.offsetWidth; c.classList.add("no");
        move(c, W / 2, cy, 300, "ease-out");
        const nl = w.sun ? "l5_2_no_sun" : "l5_2_no_moon"; capNote.textContent = L(nl);
        Voice.speak(nl).then(() => { if (cur === c) AR.say(w.id); });
      }
    };
    const dn = ev => { if (!cur || busy || fin || !cur.contains(ev.target)) return; ev.preventDefault(); const p = local(ev); drag = { dx: cur._x - p.x, dy: cur._y - p.y, sx: p.x, sy: p.y, moved: false }; cur.style.zIndex = 9; };
    const mv = ev => { if (!drag || !cur) return; const p = local(ev); if (Math.hypot(p.x - drag.sx, p.y - drag.sy) > 10) drag.moved = true; put(cur, p.x + drag.dx, p.y + drag.dy); };
    const up = () => {
      if (!drag || !cur) { drag = null; return; }
      const d = drag; drag = null;
      if (!d.moved) { AR.say(cur._w.id); return; }
      const ds = Math.hypot(cur._x - sun._x, cur._y - sun._y), dm = Math.hypot(cur._x - moon._x, cur._y - moon._y);
      if (Math.min(ds, dm) < bs + 40 || cur._y > by - bs) judge(ds < dm);
      else move(cur, W / 2, cy, 300, "ease-out");
    };
    stage.addEventListener("pointerdown", dn); window.addEventListener("pointermove", mv); window.addEventListener("pointerup", up); window.addEventListener("pointercancel", up);
    sun.onclick = () => { if (!drag) judge(true); };
    moon.onclick = () => { if (!drag) judge(false); };
    async function end() {
      fin = true; clearTimeout(timer); clearTimeout(hint);
      stage.removeEventListener("pointerdown", dn); window.removeEventListener("pointermove", mv); window.removeEventListener("pointerup", up); window.removeEventListener("pointercancel", up);
      celebrate(); await sleep(900);
      [sun, moon, sunL, moonL].forEach(e => fadeOut(e, 400)); await sleep(420);
      res(misses);
    }
    next();
  });
}
async function l5Sun() {
  await l5Begin(1, "Солнечные и лунные буквы", "l5_2_0");
  const { W, H } = size();
  const fs = Math.min(90, W * 0.2);
  /* аль */
  const T = l5T(), al = l5Card("ال", W / 2, T + fs, fs * 1.2); fadeIn(al, 500); Snd.sparkle();
  await say("l5_2_1"); await say("l5_2_1b"); fadeOut(al, 300); await sleep(320);
  /* луна подсвечивает лям */
  const os = Math.min(W * 0.3, H * 0.15, 120), oy = T + os / 2 + 8, wy = oy + os / 2 + 12 + fs * 0.9;
  const moon = obj("l5-orb", `<svg viewBox="0 0 100 100" aria-hidden="true">${PIC.moon}</svg>`, W / 2, oy, os, os); fadeIn(moon, 500);
  const wq = l5Card(`ا<b class="l5-lam">لْ</b>قَمَر`, W / 2, wy, fs); fadeIn(wq, 500);
  wq.querySelector("b").style.color = "inherit";
  cue("l5_2_2");
  await taps(moon, 1, () => { Snd.sparkle(); moon.classList.add("lit"); }, 14000);
  moon.classList.add("lit"); const lam = wq.querySelector("b"); lam.style.color = ""; lam.classList.add("lit");
  await sleep(600); fadeOut(moon, 400);
  await sayAr("l5_2_3", "ar_l5_alqamar", { note: "аль-камар — луна" });
  fadeOut(wq, 300); await sleep(320);
  /* солнце прячет лям, Шин удваивается */
  const sn = obj("l5-orb", ART.sun, W / 2, oy, os, os); fadeIn(sn, 500);
  const ws = l5Card(`ا<span class="l5-lam">ل</span><b>شَّ</b>مْس`, W / 2, wy, fs); fadeIn(ws, 500);
  const shin = ws.querySelector("b"); shin.style.color = "inherit";
  cue("l5_2_4");
  await taps(sn, 1, () => { Snd.whoosh(0.2); }, 14000);
  sn.classList.add("lit", "rays"); Snd.sparkle();
  ws.querySelector(".l5-lam").classList.add("hide"); await sleep(700);
  shin.style.color = ""; shin.classList.add("lit"); l5Jump(ws, 18); await sleep(400); l5Jump(ws, 18); fadeOut(sn, 400);
  await sayAr("l5_2_5", "ar_l5_ashshams", { note: "аш-шамс — солнце" });
  await say("l5_2_5b");
  fadeOut(ws, 300); await sleep(320);
  /* сортировка */
  await say("l5_2_6");
  const first = L5_AL.slice(0, 2), rest = l5Shuffle(L5_AL.slice(2));
  const misses = await l5Sort([...l5Shuffle(first), ...rest]);
  await say("l5_2_end", { named: true });
  hideCap(); await award("l5_al");
  return misses === 0 ? 0 : misses <= 2 ? 1 : 2;
}

/* ============ ГЛАВА 3: ПЕРВЫЕ СЛОВА ИЗ КОРАНА ============ */
/* Слова по буквам; в кусочке — вид буквы в слове (ZWJ держит соединение), s — звук слога, если он есть */
const L5_WORDS = [
  { ar: "بِسْمِ", id: "ar_l5_bismi", line: "l5_3_bismi", note: "бисми — с именем",
    pieces: [{ t: "بِ" + ZWJ, s: "ar_ba_i" }, { t: ZWJ + "سْ" + ZWJ }, { t: ZWJ + "مِ", s: "ar_mim_i" }] },
  { ar: "الْحَمْدُ", id: "ar_l5_alhamdu", line: "l5_3_hamd", note: "аль-хамду — хвала",
    pieces: [{ t: "الْ" + ZWJ }, { t: ZWJ + "حَ" + ZWJ, s: "ar_hha_a" }, { t: ZWJ + "مْ" + ZWJ }, { t: ZWJ + "دُ", s: "ar_dal_u" }] },
  { ar: "رَبّ", id: "ar_l5_rabb", line: "l5_3_rabb", note: "рабб — Господь",
    pieces: [{ t: "رَ", s: "ar_ra_a" }, { t: "بّ" }] },
  { ar: "قُلْ", id: "ar_l5_qul", line: "l5_3_qul", note: "куль — скажи",
    pieces: [{ t: "قُ" + ZWJ, s: "ar_qaf_u" }, { t: ZWJ + "لْ" }] },
  { ar: "هُوَ", id: "ar_l5_huwa", line: "l5_3_huwa", note: "хува — Он",
    pieces: [{ t: "هُ" + ZWJ, s: "ar_ha_u" }, { t: ZWJ + "وَ", s: "ar_waw_a" }] },
  { ar: "أَحَد", id: "ar_l5_ahad", line: "l5_3_ahad", note: "ахад — Единый",
    pieces: [{ t: "أَ", s: "ar_alif_a" }, { t: "حَ" + ZWJ, s: "ar_hha_a" }, { t: ZWJ + "د" }] }
];
async function l5BuildWord(w) {
  const { W, H } = size();
  cue(w.line);
  const m = await l5Build(w.pieces);
  const card = l5Card(w.ar, W / 2, 0, Math.min(96, W * 0.22)); put(card, W / 2, l5T() + card.offsetHeight / 2 + 30); card.classList.add("ok"); fadeIn(card, 500);
  card.onclick = () => { Snd.tap(); AR.say(w.id); };
  await sayAr("l5_3_read", w.id, { note: w.note });
  fadeOut(card, 300); await sleep(320);
  return m;
}
async function l5Words() {
  await l5Begin(2, "Первые слова из Корана", "l5_3_0");
  const { W, H } = size();
  await say("l5_3_1");
  let misses = 0;
  misses += await l5BuildWord(L5_WORDS[0]);
  /* Аллах: шадда на ляме */
  const al = l5Card("اللَّه", W / 2, 0, Math.min(110, W * 0.26)); put(al, W / 2, l5T() + al.offsetHeight / 2 + 30); fadeIn(al, 600); Snd.sparkle();
  al.onclick = () => { Snd.tap(); AR.say("ar_l5_allah"); };
  await sayAr("l5_3_allah", "ar_l5_allah", { note: "Аллах" });
  fadeOut(al, 300); await sleep(320);
  for (const w of L5_WORDS.slice(1)) misses += await l5BuildWord(w);
  hideCap(); await sleep(300);
  /* проверка: найди слово на слух */
  let qm = 0;
  const pool = l5Shuffle(L5_WORDS);
  for (let r = 0; r < 2; r++) {
    const t = pool[r], opts = l5Shuffle([t, ...l5Shuffle(L5_WORDS.filter(x => x !== t)).slice(0, 2)]);
    qm += await l5Pick("l5_3_find", opts, t, "l5_3_qno"); hideCap(); await sleep(300);
  }
  /* чтец: Бисмилля — знакомые слова выделены */
  const words = ["بِسْمِ", "اللَّهِ", "الرَّحْمَٰنِ", "الرَّحِيمِ"];
  const line = el("div", "l5-ayah", stage, words.map((t, i) => `<span class="l5-aw${i < 2 ? " known" : ""}">${t}</span>`).join(""));
  line.style.top = l5T() + 70 + "px"; line.style.fontSize = Math.min(52, W * 0.12) + "px";
  for (let f = parseFloat(line.style.fontSize); line.offsetWidth > W - 24 && f > 16; f *= 0.92) line.style.fontSize = f + "px";
  fadeIn(line, 500);
  showCap("l5_3_qari"); await Voice.speak("l5_3_qari"); await sleep(200);
  await l5Qari(1, [0, 0.6, 1.8, 3.2], [...line.children]);
  await sleep(400); fadeOut(line, 300);
  await say("l5_3_end", { named: true });
  hideCap(); await award("l5_words");
  return Math.min(2, qm) + (misses > 4 ? 1 : 0);
}

/* ============ ГЛАВА 4: ЧИТАЕМ АЯТ 112:1 ============ */
const L5_AYAH = [
  { ar: "قُلْ", id: "ar_l5_qul" }, { ar: "هُوَ", id: "ar_l5_huwa" }, { ar: "اللَّهُ", id: "ar_l5_allahu" }, { ar: "أَحَدٌ", id: "ar_l5_ahad" }
];
const L5_ONSETS = [0, 0.45, 1.0, 1.85];   // 6222.mp3: куль · хува · ллаху · ахад
/* Аят на карточке: слова по отдельности, справа налево, в конце номер ﴿١﴾ */
function l5AyahLine(y) {
  const { W } = size();
  const p = el("div", "l5-ayah", stage, L5_AYAH.map(w => `<span class="l5-aw">${w.ar}</span>`).join("") + `<span class="l5-an">﴿١﴾</span>`);
  p.style.fontSize = Math.min(64, W * 0.15) + "px";
  for (let f = parseFloat(p.style.fontSize); p.offsetWidth > W - 24 && f > 16; f *= 0.93) p.style.fontSize = f + "px";
  p.style.top = (y || l5T() + 52 + p.offsetHeight / 2) + "px";
  return p;
}
/* Читаем по словам: нажимай слова по порядку справа налево. guided — следующее слово светится.
   Нет верного нажатия 12 с — подсказка, 22 с — слово читается само */
function l5Read(spans, guided) {
  return new Promise(res => {
    let k = 0, misses = 0, fin = false, busy = false, last = Date.now();
    spans.forEach(s => s.classList.remove("done", "on", "hl"));
    const mark = () => spans.forEach((s, i) => s.classList.toggle("on", guided && i === k));
    mark();
    const hit = async i => {
      if (fin || busy) return;
      if (i !== k) {
        misses++; Snd.thud(0.25); spans[i].classList.remove("no"); void spans[i].offsetWidth; spans[i].classList.add("no");
        capNote.textContent = L("l5_4_no"); spans[k].classList.add("on"); return;
      }
      busy = true; spans[i].classList.remove("on"); spans[i].classList.add("done"); Snd.tap(); capNote.textContent = "";
      await AR.say(L5_AYAH[i].id);
      k++; last = Date.now(); busy = false;
      if (k >= spans.length) { fin = true; clearInterval(iv); await sleep(300); res(misses); } else mark();
    };
    spans.forEach((s, i) => s.onclick = () => hit(i));
    const iv = setInterval(() => {
      if (fin || busy) return;
      const d = Date.now() - last;
      if (d > 12000) spans[k].classList.add("on");
      if (d > 22000) hit(k);
    }, 400);
  });
}
async function l5Ayah() {
  await l5Begin(3, "Читаем аят", "l5_4_0");
  const { W, H } = size();
  let line = l5AyahLine(), spans = [...line.querySelectorAll(".l5-aw")];
  const y = parseFloat(line.style.top);
  const ref = el("div", "l5-ref", stage, "Сура аль-Ихлас, 112:1"); put(ref, W / 2, y - line.offsetHeight / 2 - 30);
  fadeIn(line, 600); Snd.sparkle();
  await say("l5_4_1"); await say("l5_4_1b");
  /* чтец */
  showCap("l5_4_2"); await Voice.speak("l5_4_2"); await sleep(200);
  await l5Qari(6222, L5_ONSETS, spans);
  /* читаем с подсказками */
  cue("l5_4_3");
  let misses = await l5Read(spans, true);
  spans[3].classList.add("hl"); await say("l5_4_stop"); spans[3].classList.remove("hl");
  /* слова рассыпались: собери аят */
  fadeOut(line, 300); fadeOut(ref, 300); await sleep(320);
  cue("l5_4_mix");
  const s = Math.min((W - 32) / 4 - 8, 96);
  misses += Math.min(1, await l5Build(L5_AYAH.map(w => ({ t: w.ar, s: w.id })), { w: s, h: s * 0.8, fs: s * 0.46, no: "l5_4_mixno" }));
  line = l5AyahLine(y); spans = [...line.querySelectorAll(".l5-aw")]; fadeIn(line, 400);
  const ref2 = el("div", "l5-ref", stage, "Сура аль-Ихлас, 112:1"); put(ref2, W / 2, y - line.offsetHeight / 2 - 30);
  /* сам, без подсказок */
  cue("l5_4_4");
  misses += await l5Read(spans, false);
  /* чтец ещё раз */
  showCap("l5_4_5"); await Voice.speak("l5_4_5"); await sleep(200);
  await l5Qari(6222, L5_ONSETS, spans);
  hideCap(); await sleep(400);
  /* карточка аята с переводом смысла; сама закрывается, когда всё прочитано */
  let auto = null;
  const close = () => { const b = document.querySelector(".ayah .btn.next"); if (b) b.click(); };
  const watch = setInterval(() => {
    const b = document.querySelector(".ayah .btn.next.glow");
    if (b && !auto) auto = setTimeout(function chk() { if (!Voice.cur && !Voice.qari) close(); else auto = setTimeout(chk, 1000); }, 6000);
  }, 500);
  const cap40 = setTimeout(close, 45000);
  await ayahCard("112:1");
  clearInterval(watch); clearTimeout(auto); clearTimeout(cap40);
  celebrate();
  await say("l5_4_end", { named: true });
  hideCap(); await award("l5_ayah");
  return misses === 0 ? 0 : misses <= 2 ? 1 : 2;
}

regChapter(4, { id: "l5_shadda", name: "Шадда", icon: chIcon("بّ"), fn: l5Shadda, lines: "l5_1_" });
regChapter(4, { id: "l5_al", name: "Солнечные и лунные буквы", icon: chIcon("ال"), fn: l5Sun, lines: "l5_2_" });
regChapter(4, { id: "l5_words", name: "Первые слова из Корана", icon: chIcon("رَبّ"), fn: l5Words, lines: "l5_3_" });
regChapter(4, { id: "l5_ayah", name: "Читаем аят", icon: chIcon("قُلْ"), fn: l5Ayah, lines: "l5_4_" });
