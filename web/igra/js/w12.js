"use strict";
/* Мир 1 и 2: дополнительные главы.
   Мир 1: «Солёная и пресная вода» (25:53), «Каждый по своей орбите» (36:40).
   Мир 2: «Он никогда не спит» (2:255), «Довольно нам Аллаха» (65:3). */

/* ============ АЯТЫ (api.alquran.cloud: quran-simple + ru.kuliev) ============ */
Object.assign(window.AYAT, {
  "25:53": {
    ref: "Сура аль-Фуркан, 25:53",
    tr: "tr_25_53",
    parts: [
      { n: 2908, ar: "وَهُوَ الَّذِي مَرَجَ الْبَحْرَيْنِ هَٰذَا عَذْبٌ فُرَاتٌ وَهَٰذَا مِلْحٌ أُجَاجٌ وَجَعَلَ بَيْنَهُمَا بَرْزَخًا وَحِجْرًا مَحْجُورًا" }
    ]
  },
  "36:40": {
    ref: "Сура Ясин, 36:40",
    tr: "tr_36_40",
    parts: [
      { n: 3745, ar: "لَا الشَّمْسُ يَنْبَغِي لَهَا أَنْ تُدْرِكَ الْقَمَرَ وَلَا اللَّيْلُ سَابِقُ النَّهَارِ ۚ وَكُلٌّ فِي فَلَكٍ يَسْبَحُونَ" }
    ]
  },
  "2:255": {
    ref: "Сура аль-Бакара, 2:255 (аят аль-Курси)",
    tr: "tr_2_255",
    parts: [
      { n: 262, ar: "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَنْ ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ" }
    ]
  },
  "65:3": {
    ref: "Сура ат-Талак, 65:3",
    tr: "tr_65_3",
    parts: [
      { n: 5220, ar: "وَيَرْزُقْهُ مِنْ حَيْثُ لَا يَحْتَسِبُ ۚ وَمَنْ يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ ۚ إِنَّ اللَّهَ بَالِغُ أَمْرِهِ ۚ قَدْ جَعَلَ اللَّهُ لِكُلِّ شَيْءٍ قَدْرًا" }
    ]
  }
});
/* слова из 3:173 (api.alquran.cloud, quran-simple) для карточки «Хасбуна-Ллах» */
const W12_HASBUNA = "حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ";

/* ============ ОБЩЕЕ ============ */
const W12C = { salt: "#1E7F95", fresh: "#A9E3F8", mix: "#5DB3C8" };
function w12mixC(a, b, t) {
  const p = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16)), A = p(a), B = p(b);
  t = Math.max(0, Math.min(1, t));
  return "#" + A.map((v, i) => Math.round(v + (B[i] - v) * t).toString(16).padStart(2, "0")).join("");
}
/* полумесяц (рожками вправо) */
const w12cres = (cx, cy, r, fill) => `<path d="M${cx} ${cy - r} A${r} ${r} 0 0 0 ${cx} ${cy + r} A${(r * 0.55).toFixed(1)} ${r} 0 0 1 ${cx} ${cy - r}Z" fill="${fill}"/>`;
const w12stars = (n, h = 280) => `<svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><g class="twinkle" fill="#FFF6DD">${Array.from({ length: n }, () => `<circle cx="${rnd(0, 400).toFixed(0)}" cy="${rnd(0, h).toFixed(0)}" r="${rnd(0.6, 1.5).toFixed(1)}"/>`).join("")}</g></svg>`;
/* Ждать, пока cond() станет истинным; не дождались за timeout — auto() и дальше */
function w12until(cond, timeout, auto) {
  return new Promise(res => {
    let fin = false;
    const t = setTimeout(async () => { if (fin) return; fin = true; clearInterval(iv); if (auto) await auto(); res(false); }, timeout);
    const iv = setInterval(() => { if (!fin && cond()) { fin = true; clearInterval(iv); clearTimeout(t); res(true); } }, 80);
  });
}
const w12dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);

/* ============ РИСУНКИ ============ */
function w12jug(col, mark) {
  return `<svg viewBox="0 0 80 90" aria-hidden="true">
    <path d="M17 30 Q2 32 4 48 Q6 62 18 60" fill="none" stroke="#8FAAB6" stroke-width="5" stroke-linecap="round"/>
    <path d="M18 12 H58 L74 5 L66 19 Q72 32 70 52 Q68 84 42 84 Q16 84 14 52 Q12 32 18 20 Z" fill="rgba(255,255,255,.5)" stroke="#8FAAB6" stroke-width="3" stroke-linejoin="round"/>
    <path class="w12-jl" d="M15 40 Q42 46 69 40 Q68 82 42 82 Q16 82 15 40Z" fill="${col}"/>
    <path d="M22 24 L24 74" stroke="#fff" stroke-width="4" opacity=".55" stroke-linecap="round"/>${mark}</svg>`;
}
Object.assign(ART, {
  w12_jugSalt: w12jug(W12C.salt, '<g fill="#fff" opacity=".95"><rect x="34" y="56" width="8" height="8" rx="1.5" transform="rotate(15 38 60)"/><rect x="45" y="60" width="7" height="7" rx="1.5" transform="rotate(-10 48 63)"/><rect x="40" y="67" width="6" height="6" rx="1.5"/></g>'),
  w12_jugFresh: w12jug(W12C.fresh, '<path d="M44 52 Q52 62 52 67 A8 8 0 0 1 36 67 Q36 62 44 52Z" fill="#fff" opacity=".9"/>'),
  w12_tube: `<svg viewBox="0 0 34 100" aria-hidden="true"><rect x="5" y="2" width="24" height="7" rx="3" fill="#8FAAB6"/>
    <path d="M8 9 V82 A9 9 0 0 0 26 82 V9" fill="rgba(255,255,255,.6)" stroke="#8FAAB6" stroke-width="3"/>
    <path class="w12-pl" d="M9.5 52 H24.5 V82 A7.5 7.5 0 0 1 9.5 82Z" fill="#fff" opacity="0"/>
    <path d="M12 14 V78" stroke="#fff" stroke-width="3" opacity=".7" stroke-linecap="round"/></svg>`,
  w12_moon: `<svg viewBox="0 0 80 80" aria-hidden="true"><defs><radialGradient id="w12gMoonH"><stop offset=".3" stop-color="#FFF0BE" stop-opacity=".45"/><stop offset="1" stop-color="#FFF0BE" stop-opacity="0"/></radialGradient></defs><circle cx="40" cy="40" r="40" fill="url(#w12gMoonH)"/>${w12cres(44, 40, 26, "#FFE7A0")}</svg>`,
  w12_candle: `<svg viewBox="0 0 50 130" aria-hidden="true"><defs><linearGradient id="w12gWax" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#F3E3C4"/><stop offset=".5" stop-color="#FFF8EA"/><stop offset="1" stop-color="#E2CDA6"/></linearGradient></defs>
    <rect class="w12-wax" x="15" y="40" width="20" height="78" rx="3" fill="url(#w12gWax)"/>
    <path class="w12-wick" d="M25 40 V33" stroke="#4A3524" stroke-width="2.4" stroke-linecap="round"/>
    <g class="w12-flame"><ellipse cx="0" cy="-10" rx="9" ry="16" fill="#FFC94A" opacity=".55"/><path d="M0 -26 Q8 -12 5 -4 Q0 2 -5 -4 Q-8 -12 0 -26Z" fill="#FFB23A"/><path d="M0 -17 Q4 -9 2 -5 Q0 -2 -2 -5 Q-4 -9 0 -17Z" fill="#FFF3C4"/></g>
    <path d="M4 118 H46 Q46 126 25 126 Q4 126 4 118Z" fill="#B98A4E"/><ellipse cx="25" cy="118" rx="21" ry="4" fill="#D2A764"/></svg>`,
  w12_clock: `<svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="52" r="44" fill="#8E5A2E"/><circle cx="50" cy="52" r="37" fill="#FFF8EA"/>
    ${Array.from({ length: 12 }, (_, i) => `<path d="M50 ${i % 3 ? 19 : 17} V${i % 3 ? 23 : 26}" stroke="#5F4630" stroke-width="${i % 3 ? 2 : 3.4}" stroke-linecap="round" transform="rotate(${i * 30} 50 52)"/>`).join("")}
    <g class="w12-hh"><path d="M50 52 V34" stroke="#2C2018" stroke-width="5" stroke-linecap="round"/></g>
    <g class="w12-mh"><path d="M50 52 V24" stroke="#2C2018" stroke-width="3.4" stroke-linecap="round"/></g>
    <g class="w12-sh"><path d="M50 58 V20" stroke="#D9534A" stroke-width="1.8" stroke-linecap="round"/></g>
    <circle cx="50" cy="52" r="4" fill="#2C2018"/><path d="M30 10 l-8 -4 M70 10 l8 -4" stroke="#8E5A2E" stroke-width="5" stroke-linecap="round"/>
    <path d="M86 46 h9 v12 h-9z" fill="#B98A4E"/></svg>`,
  w12_torch: `<svg viewBox="0 0 100 50" aria-hidden="true"><defs><linearGradient id="w12gTorch" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5BA9C9"/><stop offset="1" stop-color="#2F7FAA"/></linearGradient></defs>
    <rect x="34" y="14" width="62" height="22" rx="7" fill="url(#w12gTorch)"/><path d="M8 6 H30 L38 14 V36 L30 44 H8 Z" fill="#4F6F7C"/>
    <ellipse class="w12-lens" cx="8" cy="25" rx="5" ry="18" fill="#FFF3C4"/><rect x="58" y="20" width="14" height="10" rx="3" fill="#F5C451"/><path d="M42 18 H90" stroke="#fff" stroke-width="2.5" opacity=".35" stroke-linecap="round"/></svg>`,
  w12_beam: `<svg viewBox="0 0 160 120" aria-hidden="true"><defs><linearGradient id="w12gBeam" x1="1" y1="0" x2="0" y2="0"><stop offset="0" stop-color="#FFF3C4" stop-opacity=".95"/><stop offset="1" stop-color="#FFF3C4" stop-opacity="0"/></linearGradient></defs>
    <path d="M160 52 L0 0 L0 120 L160 68Z" fill="url(#w12gBeam)"/></svg>`,
  w12_battery: `<svg viewBox="0 0 30 56" aria-hidden="true"><rect x="10" y="1" width="10" height="6" rx="2" fill="#B9C6CC"/><rect x="3" y="6" width="24" height="48" rx="5" fill="#3E4A52"/><rect x="3" y="6" width="24" height="18" rx="5" fill="#F5C451"/><rect x="3" y="18" width="24" height="6" fill="#F5C451"/>
    <path d="M15 32 v12 M9 38 h12" stroke="#fff" stroke-width="3" stroke-linecap="round"/></svg>`,
  w12_shutter: `<svg viewBox="0 0 100 200" preserveAspectRatio="none" aria-hidden="true"><defs><linearGradient id="w12gSh" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#8E5A2E"/><stop offset=".5" stop-color="#B07A45"/><stop offset="1" stop-color="#8E5A2E"/></linearGradient></defs>
    <rect x="2" y="2" width="96" height="196" rx="6" fill="url(#w12gSh)" stroke="#6A3E1C" stroke-width="4"/>
    ${Array.from({ length: 11 }, (_, i) => `<path d="M12 ${22 + i * 15} H88" stroke="#6A3E1C" stroke-width="4" stroke-linecap="round" opacity=".7"/>`).join("")}<circle cx="86" cy="100" r="5" fill="#F5C451"/></svg>`,
  w12_lamp: `<svg viewBox="0 0 80 110" aria-hidden="true"><path d="M18 10 H62 L74 46 H6 Z" fill="#F2D49A" stroke="#C99A4E" stroke-width="3" stroke-linejoin="round"/>
    <path class="w12-shade" d="M18 10 H62 L74 46 H6 Z" fill="#FFE7A0" opacity="0"/><rect x="36" y="46" width="8" height="46" fill="#8E5A2E"/><path d="M16 104 Q40 88 64 104 Z" fill="#6A3E1C"/></svg>`,
  w12_switch: `<svg viewBox="0 0 50 50" aria-hidden="true"><rect x="4" y="4" width="42" height="42" rx="12" fill="#EFE6D6" stroke="#B9A47E" stroke-width="3"/><rect class="w12-sw" x="16" y="10" width="18" height="18" rx="6" fill="#D9665B"/></svg>`,
  w12_rainbow: `<svg viewBox="0 0 200 110" aria-hidden="true">${["#E8584C", "#F59A3B", "#F5C451", "#6BBF59", "#4FA8D8", "#7B6FC6"].map((c, i) => `<path d="M${10 + i * 9} 108 A${90 - i * 9} ${90 - i * 9} 0 0 1 ${190 - i * 9} 108" fill="none" stroke="${c}" stroke-width="9" opacity=".85"/>`).join("")}</svg>`
});
Object.assign(ICON, {
  w12_water: '<path d="M24 5 Q37 22 37 30 A13 13 0 0 1 11 30 Q11 22 24 5Z" fill="#A9E3F8"/><path d="M24 5 Q11 22 11 30 A13 13 0 0 0 24 43Z" fill="#1E7F95"/><path d="M24 9 V42" stroke="#fff" stroke-width="2" stroke-dasharray="3 3"/>',
  w12_orbit: '<path d="M3 42 A21 21 0 0 1 45 42" fill="none" stroke="#E6A93A" stroke-width="2.2" stroke-dasharray="3 3"/><path d="M12 42 A12 12 0 0 1 36 42" fill="none" stroke="#7E95B8" stroke-width="2.2" stroke-dasharray="3 3"/><circle cx="38" cy="25" r="6" fill="#F7B32B"/>' + w12cres(19, 28, 7, "#E6C25A"),
  w12_clock: '<circle cx="24" cy="26" r="17" fill="#FFF8EA" stroke="#8E5A2E" stroke-width="3.5"/><path d="M24 26 V15 M24 26 L31 30" stroke="#2C2018" stroke-width="2.8" stroke-linecap="round"/><circle cx="24" cy="26" r="2.2" fill="#2C2018"/><path d="M13 7 l5 4 M35 7 l-5 4" stroke="#8E5A2E" stroke-width="3" stroke-linecap="round"/>',
  w12_torch: '<rect x="18" y="19" width="26" height="11" rx="3.5" fill="#3C93C2"/><path d="M8 15 H17 L21 19 V30 L17 34 H8Z" fill="#4F6F7C"/><path d="M8 17 L1 10 M8 24.5 H1 M8 32 L1 39" stroke="#F5C451" stroke-width="2.5" stroke-linecap="round"/>',
  w12_jug: '<path d="M14 18 Q5 20 6 28 Q7 35 14 34" fill="none" stroke="#8FAAB6" stroke-width="3" stroke-linecap="round"/><path d="M15 8 H33 L41 5 L37 12 Q41 20 40 30 Q39 43 25 43 Q11 43 10 30 Q9 20 15 13Z" fill="#E7F3F8" stroke="#8FAAB6" stroke-width="2.5" stroke-linejoin="round"/><path d="M11 25 Q25 29 39 25 Q38 41 25 41 Q12 41 11 25Z" fill="#5DB3C8"/>',
  w12_brush: '<path d="M30 6 L40 12 L24 32 L18 28Z" fill="#C98B52"/><path d="M18 28 L24 32 L22 36 L15 32Z" fill="#B9C6CC"/><path d="M15 32 L22 36 Q20 44 8 44 Q12 38 15 32Z" fill="#1B2D55"/>',
  w12_shutters: '<rect x="6" y="6" width="36" height="36" rx="3" fill="#8E5A2E"/><rect x="9" y="9" width="14" height="30" fill="#B07A45"/><rect x="25" y="9" width="14" height="30" fill="#B07A45"/><path d="M11 14 H21 M11 19 H21 M11 24 H21 M11 29 H21 M11 34 H21 M27 14 H37 M27 19 H37 M27 24 H37 M27 29 H37 M27 34 H37" stroke="#6A3E1C" stroke-width="1.8"/>',
  w12_pause: '<circle cx="24" cy="24" r="18" fill="#E9E2D3" stroke="#B9A47E" stroke-width="2.5"/><rect x="17" y="15" width="5" height="18" rx="2" fill="#8B7A5E"/><rect x="26" y="15" width="5" height="18" rx="2" fill="#8B7A5E"/>'
});
ITEMS.push(
  { id: "w12_shell", name: "Морская ракушка", svg: '<path d="M50 88 L14 42 Q26 12 50 10 Q74 12 86 42 Z" fill="#F7C9A8" stroke="#D98F6A" stroke-width="3" stroke-linejoin="round"/>' + [22, 32, 42, 50, 58, 68, 78].map((x, i) => `<path d="M50 86 L${x} ${[36, 22, 14, 11, 14, 22, 36][i]}" stroke="#E2A07C" stroke-width="2.5"/>`).join("") + '<path d="M38 86 H62 L58 94 H42Z" fill="#E8A884"/><circle cx="40" cy="30" r="5" fill="#fff" opacity=".5"/>' },
  { id: "w12_crescent", name: "Месяц", svg: w12cres(54, 50, 38, "#F5C451") + '<path d="M76 22 l3 7 7 1 -5 5 1 7 -6 -3 -6 3 1 -7 -5 -5 7 -1z" fill="#FFE7A0"/>' },
  { id: "w12_clock", name: "Часики", svg: '<circle cx="50" cy="54" r="36" fill="#FFF8EA" stroke="#8E5A2E" stroke-width="7"/>' + Array.from({ length: 12 }, (_, i) => `<path d="M50 24 V29" stroke="#5F4630" stroke-width="3" stroke-linecap="round" transform="rotate(${i * 30} 50 54)"/>`).join("") + '<path d="M50 54 V34 M50 54 L64 62" stroke="#2C2018" stroke-width="5" stroke-linecap="round"/><circle cx="50" cy="54" r="4" fill="#2C2018"/><path d="M24 14 l12 8 M76 14 l-12 8" stroke="#8E5A2E" stroke-width="7" stroke-linecap="round"/>' },
  { id: "w12_rainbow", name: "Радуга", svg: ["#E8584C", "#F59A3B", "#F5C451", "#6BBF59", "#4FA8D8", "#7B6FC6"].map((c, i) => `<path d="M${8 + i * 7} 80 A${42 - i * 7} ${42 - i * 7} 0 0 1 ${92 - i * 7} 80" fill="none" stroke="${c}" stroke-width="7"/>`).join("") + '<path d="M2 84 Q8 70 20 76 Q30 70 34 82Z M66 82 Q70 70 80 76 Q92 70 98 84Z" fill="#fff"/>' }
);

addCSS(`
.w12-tag { position: absolute; z-index: 12; translate: -50% -100%; padding: 5px 12px; border-radius: 14px; background: rgba(255,255,255,.95); color: var(--ink); font-weight: 900; font-size: 16px; white-space: nowrap; pointer-events: none; box-shadow: 0 4px 12px rgba(0,0,0,.2); transition: opacity .3s; }
.w12-tag.salt { background: #1E7F95; color: #fff; }
.w12-tag.fresh { background: #DDF5FE; color: #12506A; }
.w12-tag.mix { background: #5DB3C8; color: #fff; }
.w12-tag:empty { opacity: 0; }
.w12-bz { animation: w12bz 1.2s linear infinite; }
@keyframes w12bz { to { stroke-dashoffset: -36; } }
.w12-room { position: absolute; inset: 0; }
.w12-room .wall { position: absolute; inset: 0 0 24% 0; background: linear-gradient(180deg, #1C2B49, #2A3D60); }
.w12-room .floor { position: absolute; left: 0; right: 0; bottom: 0; height: 24%; background: linear-gradient(180deg, #4B3A2C, #3A2C21); }
.w12-win { position: absolute; translate: -50% -50%; border: 8px solid #8E5A2E; border-radius: 10px; overflow: hidden; box-shadow: inset 0 0 0 3px #6A3E1C, 0 6px 16px rgba(0,0,0,.3); }
.w12-win .wsky { position: absolute; inset: 0; transition: background 3s; }
.w12-win .wbar { position: absolute; background: #8E5A2E; }
.w12-table { position: absolute; height: 16px; border-radius: 6px; background: linear-gradient(180deg, #A26A3A, #7A4A24); box-shadow: 0 6px 10px rgba(0,0,0,.3); }
.w12-bar { position: absolute; translate: -50% 0; width: 66px; height: 10px; border-radius: 5px; background: rgba(255,255,255,.18); overflow: hidden; z-index: 9; }
.w12-bar i { display: block; height: 100%; width: 100%; border-radius: 5px; background: #7FD99A; transition: background .3s; }
.w12-bar.low i { background: #E8754F; }
.w12-box { position: absolute; translate: -50% -50%; border-radius: 14px; background: linear-gradient(180deg, #6E8691, #4F6F7C); box-shadow: inset 0 3px 0 rgba(255,255,255,.2), 0 6px 12px rgba(0,0,0,.3); }
.w12-dark { position: absolute; inset: 0; background: #050B18; pointer-events: none; transition: opacity .6s; z-index: 8; }
.w12-wind { position: absolute; translate: -50% -50%; border-radius: 50%; border: 4px dashed rgba(255,224,140,.9); pointer-events: none; animation: spin 3s linear infinite; z-index: 7; }
.w12-wind.off { display: none; }
.w12-fear { position: absolute; z-index: 25; left: 12px; bottom: calc(env(safe-area-inset-bottom, 0px) + 12px); width: min(44vw, 180px); padding: 8px 12px 10px; border-radius: 16px; background: var(--glass); color: #fff; font-weight: 800; font-size: 14px; box-shadow: var(--shadow); transition: opacity .4s; }
.w12-fear p { margin: 0 0 6px; display: flex; justify-content: space-between; }
.w12-fear i { display: block; height: 12px; border-radius: 6px; background: rgba(255,255,255,.15); overflow: hidden; }
.w12-fear b { display: block; height: 100%; border-radius: 6px; transition: width .6s, background .6s; }
.w12-blanket { position: absolute; border-radius: 14px 14px 8px 8px; background: repeating-linear-gradient(90deg, #5BA9C9 0 22px, #6FB8D6 22px 44px); box-shadow: inset 0 6px 0 rgba(255,255,255,.35); cursor: grab; touch-action: none; }
.w12-blanket::after { content: ""; position: absolute; left: 0; right: 0; top: 10px; height: 6px; background: #F5C451; opacity: .9; }
.w12-flash { position: absolute; inset: 0; background: #E8F1FF; opacity: 0; pointer-events: none; }
.w12-flash.on { animation: w12fl .7s ease-out; }
@keyframes w12fl { 10% { opacity: .8; } 30% { opacity: .15; } 45% { opacity: .5; } 100% { opacity: 0; } }
.obj.w12-dua { padding: 16px 12px; text-align: center; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; border-radius: 22px; background: var(--parch); box-shadow: 0 0 0 3px var(--gold), 0 10px 26px rgba(0,0,0,.35); cursor: pointer; z-index: 12; }
.obj.w12-dua b { font-family: "Amiri", serif; font-size: clamp(22px, 7.4vw, 30px); white-space: nowrap; line-height: 1.3; color: var(--ink); }
.obj.w12-dua small { font-size: 15px; font-weight: 800; color: var(--muted); }
.obj.w12-dua.pulse { animation: w12pulse 1.3s ease-in-out infinite; }
@keyframes w12pulse { 50% { box-shadow: 0 0 0 3px var(--gold), 0 0 26px 6px rgba(255,214,120,.75); scale: 1.03; } }
.obj.w12-dua.on { box-shadow: 0 0 0 3px var(--gold), 0 0 40px 10px rgba(255,214,120,.8); }
.w12-warm { position: absolute; inset: 0; pointer-events: none; background: radial-gradient(ellipse at 30% 60%, rgba(255,200,110,.35), rgba(255,200,110,0) 70%); opacity: 0; transition: opacity 1.5s; z-index: 6; }
`);

/* ============ МЕХАНИКИ ============ */
/* Наклонить кувшин: тянуть пальцем вниз. Наклонился больше чем на 55° — течёт вода.
   dir: +1 кувшин слева (носик вправо), -1 справа. onPour(доля, точка носика) */
function w12pour(jug, dir, onPour, timeout = 16000) {
  return new Promise(res => {
    let ang = 0, target = 0, down = false, y0 = 0, fin = false, poured = 0, last = 0, auto = false, sndT = 0;
    const s = jug.offsetWidth / 80;
    jug.classList.add("hint", "tapme"); jug.style.zIndex = 9;
    const dn = ev => { ev.preventDefault(); down = true; y0 = local(ev).y - target / 0.9; jug.classList.remove("hint"); Snd.tap(); };
    const mv = ev => { if (down) target = Math.max(0, Math.min(110, (local(ev).y - y0) * 0.9)); };
    const up = () => { down = false; if (!auto) target = 0; };
    jug.addEventListener("pointerdown", dn); window.addEventListener("pointermove", mv); window.addEventListener("pointerup", up);
    const tmr = setTimeout(() => { auto = true; target = 100; jug.classList.remove("hint"); }, timeout);
    const spout = () => {
      const a = dir * ang * Math.PI / 180, ox = dir * 34 * s, oy = -40 * s;
      return { x: jug._x + ox * Math.cos(a) - oy * Math.sin(a), y: jug._y + ox * Math.sin(a) + oy * Math.cos(a) };
    };
    const step = t => {
      const dt = Math.min(0.05, (t - (last || t)) / 1000); last = t;
      ang += (target - ang) * Math.min(1, dt * 9);
      jug.style.transform = `rotate(${(dir * ang).toFixed(1)}deg)`;
      if (!fin && ang > 55) {
        const k = Math.min(1, (ang - 55) / 40), a = k * dt * 0.3;
        poured += a; onPour(a, spout());
        sndT -= dt; if (sndT <= 0) { sndT = 0.12; Snd.noise({ kind: "pink", f: rnd(700, 1100), q: 1.2, dur: 0.18, gain: 0.08 }); }
        jug.querySelector(".w12-jl").setAttribute("opacity", Math.max(0.15, 1 - poured * 1.7).toFixed(2));
        if (poured >= 0.5) {
          fin = true; clearTimeout(tmr); target = 0; onPour(0, null);
          jug.classList.remove("hint", "tapme"); jug.removeEventListener("pointerdown", dn);
          window.removeEventListener("pointermove", mv); window.removeEventListener("pointerup", up);
        }
      } else if (!fin) onPour(0, null);
      if (fin && ang < 2) { jug.style.transform = ""; return res(); }
      requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  });
}
/* Пробирка: таскать пальцем по воде, она показывает, какая там вода.
   read(x,y) → { zone, label, cls, col } или null. Нужно побывать во всех зонах need. */
function w12probe(probe, read, need, autoPts, timeout = 18000) {
  return new Promise(res => {
    const tag = el("div", "w12-tag"); const liq = probe.querySelector(".w12-pl");
    const seen = new Set(); let off = null, fin = false;
    probe.classList.add("hint", "tapme"); probe.style.zIndex = 11;
    const tip = () => ({ x: probe._x, y: probe._y + probe.offsetHeight * 0.36 });
    const check = () => {
      const p = tip(), r = read(p.x, p.y);
      put(tag, probe._x, probe._y - probe.offsetHeight / 2 - 6);
      if (!r) { tag.textContent = ""; liq.setAttribute("opacity", "0"); return; }
      tag.textContent = r.label; tag.className = "w12-tag " + r.cls;
      liq.setAttribute("fill", r.col); liq.setAttribute("opacity", "1");
      if (!seen.has(r.zone)) { seen.add(r.zone); Snd.splash(); }
      if (need.every(z => seen.has(z)) && !fin) { fin = true; setTimeout(end, 1200); }
    };
    const dn = ev => { ev.preventDefault(); const p = local(ev); off = { x: probe._x - p.x, y: probe._y - p.y }; probe.classList.remove("hint"); Snd.tap(); };
    const mv = ev => { if (!off) return; const p = local(ev); put(probe, p.x + off.x, p.y + off.y); check(); };
    const up = () => { off = null; };
    const end = () => {
      clearTimeout(tmr); probe.classList.remove("hint", "tapme"); probe.removeEventListener("pointerdown", dn);
      window.removeEventListener("pointermove", mv); window.removeEventListener("pointerup", up);
      fadeOut(tag, 400); res();
    };
    probe.addEventListener("pointerdown", dn); window.addEventListener("pointermove", mv); window.addEventListener("pointerup", up);
    const tmr = setTimeout(async () => {
      if (fin) return; off = null; probe.classList.remove("hint");
      for (const q of autoPts) { if (fin) break; await move(probe, q.x, q.y - probe.offsetHeight * 0.36, 900); check(); await sleep(900); }
      if (!fin) { fin = true; end(); }
    }, timeout);
  });
}

/* ============ ГЛАВА: СОЛЁНАЯ И ПРЕСНАЯ ВОДА (25:53) ============ */
function w12estuary(W, H) {
  const mY = H * 0.64, cx = W * 0.5, rx = W * 0.27, ry = H * 0.1;
  const rX = y => cx + W * 0.16 * Math.sin((y / mY) * Math.PI * 1.4) * (1 - y / mY);
  const hw = y => W * (0.06 + 0.075 * Math.pow(Math.max(0, y) / mY, 2));
  const L = [], R = [];
  for (let i = 0; i <= 26; i++) { const y = -10 + (mY + 12) * i / 26; L.push(`${(rX(y) - hw(y)).toFixed(1)} ${y.toFixed(1)}`); R.unshift(`${(rX(y) + hw(y)).toFixed(1)} ${y.toFixed(1)}`); }
  const shore = Array.from({ length: 9 }, (_, i) => `${(W * i / 8).toFixed(1)} ${(mY - 4 + (i % 2 ? 5 : -3)).toFixed(1)}`);
  const tree = (x, y, r) => `<rect x="${x - 2.5}" y="${y}" width="5" height="${r * 1.2}" fill="#7A4A24"/><circle cx="${x}" cy="${y}" r="${r}" fill="#4E9D45"/><circle cx="${x - r * 0.35}" cy="${y - r * 0.3}" r="${r * 0.45}" fill="#7DC46D"/>`;
  const svg = `<svg viewBox="0 0 ${W} ${H}" aria-hidden="true"><defs>
    <linearGradient id="w12gLand" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9ED48A"/><stop offset="1" stop-color="#6DB65E"/></linearGradient>
    <linearGradient id="w12gSea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1E7F95"/><stop offset="1" stop-color="#135A78"/></linearGradient>
    <linearGradient id="w12gRiv" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C6EEFB"/><stop offset="1" stop-color="#A9E3F8"/></linearGradient></defs>
    <rect width="${W}" height="${H}" fill="url(#w12gLand)"/>
    <path d="M0 ${mY - 14} ${shore.map(p => "L" + p).join(" ")} L${W} ${mY + 8} H0Z" fill="#EBD3A0"/>
    <path d="M0 ${mY} ${shore.map(p => "L" + p.replace(/ ([\d.]+)$/, (m, y) => " " + (+y + 10).toFixed(1))).join(" ")} L${W} ${H} H0Z" fill="url(#w12gSea)"/>
    ${[0.2, 0.75, 0.88, 0.1].map((fx, i) => `<path d="M${W * fx} ${H * (0.8 + i * 0.04)} q12 -7 24 0 t24 0" stroke="#5FB3CF" stroke-width="3" fill="none" stroke-linecap="round" opacity=".7"/>`).join("")}
    <path d="M${cx - rx} ${mY} A${rx} ${ry} 0 0 0 ${cx + rx} ${mY} Z" fill="#A9E3F8"/>
    <path d="M${L.join(" L")} L${R.join(" L")} Z" fill="url(#w12gRiv)"/>
    <path d="M${rX(H * 0.36) - 10} ${H * 0.36} q10 -5 20 0 M${rX(H * 0.5) + 4} ${H * 0.5} q10 -5 20 0" stroke="#fff" stroke-width="2.5" fill="none" opacity=".8" stroke-linecap="round"/>
    <path d="M${cx - rx} ${mY} A${rx} ${ry} 0 0 0 ${cx + rx} ${mY}" fill="none" stroke="#fff" stroke-width="12" opacity=".25"/>
    <path class="w12-bz" d="M${cx - rx} ${mY} A${rx} ${ry} 0 0 0 ${cx + rx} ${mY}" fill="none" stroke="#F4FDFF" stroke-width="4" stroke-dasharray="12 6" stroke-linecap="round"/>
    ${tree(W * 0.12, H * 0.4, 16)}${tree(W * 0.2, H * 0.55, 13)}${tree(W * 0.85, H * 0.42, 15)}${tree(W * 0.9, H * 0.56, 12)}${tree(W * 0.08, H * 0.2, 14)}${tree(W * 0.86, H * 0.18, 14)}
  </svg>`;
  const read = (x, y) => {
    if (y > mY - 2) {
      const inLobe = ((x - cx) / rx) ** 2 + ((y - mY) / ry) ** 2 <= 1;
      return inLobe ? { zone: "fresh", label: "Пресная", cls: "fresh", col: W12C.fresh } : { zone: "salt", label: "Солёная", cls: "salt", col: W12C.salt };
    }
    if (Math.abs(x - rX(y)) < hw(y)) return { zone: "fresh", label: "Пресная", cls: "fresh", col: W12C.fresh };
    return null;
  };
  return { svg, read, mY, cx, rx, ry, rX };
}
async function chWater() {
  await toDark(); clearStage();
  sky("linear-gradient(180deg,#63B8E6 0%,#AEE0F5 50%,#E6F5FB 100%)");
  const { W, H } = size(); sunAt(W * 0.82, H * 0.34, 110); clouds(2, 0.28, 0.38);
  seaLayer(H * 0.46, ["#4DB0D8", "#3C9CC8", "#2C80AE"]);
  const beach = el("div", "layer", stage, `<svg viewBox="0 0 200 100" preserveAspectRatio="none" aria-hidden="true"><path d="M0 14 Q60 0 120 10 Q170 18 200 8 V100 H0Z" fill="#EBD3A0"/><path d="M0 22 Q70 10 140 20" stroke="#D9BC85" stroke-width="2" fill="none"/></svg>`);
  beach.style.bottom = "0"; beach.style.height = "40%";
  vignette();
  /* банка */
  const tw = Math.round(Math.min(W * 0.64, 280)), th = Math.round(tw * 0.62), tankTop = H * 0.6, ty0 = th - 6, maxH = th * 0.82;
  const tank = obj("w12-tank", `<svg viewBox="0 0 ${tw} ${th}" aria-hidden="true"><defs><linearGradient id="w12gTank" x1="0" y1="1" x2="0" y2="0">
      <stop class="s0" offset="0" stop-color="${W12C.salt}"/><stop class="s1" offset=".5" stop-color="${W12C.salt}"/><stop class="s2" offset=".5" stop-color="${W12C.fresh}"/><stop class="s3" offset="1" stop-color="${W12C.fresh}"/></linearGradient></defs>
    <rect class="wat" x="6" y="${ty0}" width="${tw - 12}" height="0" fill="url(#w12gTank)"/>
    <path d="M3 0 V${th - 12} Q3 ${th - 3} 12 ${th - 3} H${tw - 12} Q${tw - 3} ${th - 3} ${tw - 3} ${th - 12} V0" fill="rgba(255,255,255,.22)" stroke="#D5EBF2" stroke-width="5"/>
    <path d="M16 12 V${th - 22}" stroke="#fff" stroke-width="6" opacity=".45" stroke-linecap="round"/></svg>`, W / 2, tankTop + th / 2, tw, th);
  tank.style.zIndex = 5;
  const wat = tank.querySelector(".wat"), stops = [...tank.querySelectorAll("stop")];
  const st = { salt: 0, fresh: 0, m: 0 };
  const drawTank = () => {
    const lvl = (st.salt + st.fresh) * maxH, fs = st.salt + st.fresh > 0 ? st.salt / (st.salt + st.fresh) : 1, b = 0.05 + 0.9 * st.m;
    wat.setAttribute("y", (ty0 - lvl).toFixed(1)); wat.setAttribute("height", lvl.toFixed(1));
    const cS = w12mixC(W12C.salt, W12C.mix, st.m), cF = w12mixC(W12C.fresh, W12C.mix, st.m);
    const o = [0, Math.max(0, fs - b / 2), Math.min(1, fs + b / 2), 1], c = [cS, cS, cF, cF];
    stops.forEach((s, i) => { s.setAttribute("offset", o[i].toFixed(3)); s.setAttribute("stop-color", c[i]); });
  };
  const surfaceY = () => tankTop + ty0 - (st.salt + st.fresh) * maxH;
  /* струя воды */
  const sl = el("div", "layer", stage, `<svg viewBox="0 0 ${W} ${H}" aria-hidden="true"><path fill="none" stroke-width="7" stroke-linecap="round" opacity=".9"/></svg>`);
  sl.style.inset = "0"; sl.style.zIndex = 8; const stream = sl.querySelector("path");
  const pourTo = (key, col) => (a, sp) => {
    if (!sp) { stream.setAttribute("d", ""); return; }
    st[key] = Math.min(0.5, st[key] + a);
    if (key === "fresh") st.m = Math.min(1, st.m + a * 2.4);
    const sy = surfaceY();
    stream.setAttribute("stroke", col); stream.setAttribute("d", `M${sp.x.toFixed(1)} ${sp.y.toFixed(1)} Q${(sp.x + 6).toFixed(1)} ${((sp.y + sy) / 2).toFixed(1)} ${(sp.x + 2).toFixed(1)} ${sy.toFixed(1)}`);
    drawTank();
  };
  const jugY = tankTop - 66;
  const jugL = obj("w12-jug", ART.w12_jugSalt, W / 2 - tw * 0.36, jugY, 84, 94);
  const jugR = obj("w12-jug", `<div style="width:100%;height:100%;transform:scaleX(-1)">${ART.w12_jugFresh}</div>`, W / 2 + tw * 0.36, jugY, 84, 94);
  Snd.amb("sea", 0.6); fromDark(); await sleep(300);
  await chapterTitle(null, "Солёная и пресная вода", "water_0");
  await say("water_1");

  cue("water_2");
  await w12pour(jugL, 1, pourTo("salt", W12C.salt));
  fadeOut(jugL, 500);
  cue("water_3");
  await w12pour(jugR, -1, pourTo("fresh", W12C.fresh));
  fadeOut(jugR, 500);
  /* перемешалось до конца */
  const m0 = st.m;
  for (let i = 1; i <= 20; i++) { st.m = m0 + (1 - m0) * i / 20; drawTank(); await sleep(60); }
  tank.animate([{ rotate: "0deg" }, { rotate: "-1.5deg" }, { rotate: "1.5deg" }, { rotate: "0deg" }], { duration: 600 });
  await say("water_4");

  const probe = obj("w12-probe", ART.w12_tube, W * 0.5, Math.min(H - 56, tankTop + th + 60), 34, 100); fadeIn(probe);
  cue("water_5");
  const tL = W / 2 - tw / 2 + 10, tR = W / 2 + tw / 2 - 10, tB = tankTop + th - 8;
  await w12probe(probe, (x, y) => (x > tL && x < tR && y > surfaceY() + 4 && y < tB) ? { zone: x < W / 2 ? "L" : "R", label: "Смешалась", cls: "mix", col: W12C.mix } : null,
    ["L", "R"], [{ x: W / 2 - tw * 0.25, y: tankTop + th * 0.7 }, { x: W / 2 + tw * 0.25, y: tankTop + th * 0.7 }]);
  await say("water_6");

  /* река впадает в море */
  hideCap(); await toDark(); clearStage(); sl.remove();
  const es = w12estuary(W, H);
  const map = el("div", "layer", stage, es.svg); map.style.inset = "0";
  const boat = obj("ship", `<div class="bob" style="width:100%;height:100%">${ART.ship}</div>`, W * 0.84, H * 0.84, 80, 80); boat.style.zIndex = 3;
  vignette();
  Snd.amb("sea", 0.8); fromDark(); await sleep(500);
  await say("water_7");
  const probe2 = obj("w12-probe", ART.w12_tube, W * 0.15, H * 0.5, 34, 100); fadeIn(probe2);
  cue("water_8");
  await w12probe(probe2, es.read, ["fresh", "salt"], [{ x: es.rX(H * 0.5), y: H * 0.5 }, { x: W * 0.2, y: H * 0.86 }]);
  fadeOut(probe2);
  const bz = map.querySelector(".w12-bz");
  bz.animate([{ strokeWidth: 4 }, { strokeWidth: 9 }, { strokeWidth: 4 }], { duration: 900, iterations: 3 }); Snd.sparkle();
  await say("water_9");
  await say("water_10");
  const misses = await choice("water_q", [{ id: "water_qa", icon: ICON.w12_jug }, { id: "water_qb", icon: ICON.wind }, { id: "water_qc", ar: true, ok: true }], "water_q_ok");
  await say("water_quran");
  await ayahCard("25:53");
  await say("water_end", { btn: "Альхамдулиллях" });
  hideCap(); await award("w12_shell");
  return misses;
}

/* ============ ГЛАВА: КАЖДЫЙ ПО СВОЕЙ ОРБИТЕ (36:40) ============ */
/* Закрасить небо ночной краской: краска сразу тает */
function w12paint(minY, maxY, need = 900, timeout = 14000) {
  const { W, H } = size();
  return new Promise(res => {
    const lay = el("div", "layer", stage, `<svg viewBox="0 0 ${W} ${H}" aria-hidden="true"><defs><radialGradient id="w12gInk"><stop offset="0" stop-color="#0B1A3A" stop-opacity=".95"/><stop offset=".6" stop-color="#132A55" stop-opacity=".8"/><stop offset="1" stop-color="#132A55" stop-opacity="0"/></radialGradient></defs><g></g></svg>`);
    lay.style.inset = "0"; lay.style.zIndex = 5;
    const g = lay.querySelector("g"), field = el("div", "tapfield"); field.style.zIndex = 6;
    let len = 0, last = null, down = false, fin = false, sndT = 0;
    const blot = p => {
      const ns = "http://www.w3.org/2000/svg", grp = document.createElementNS(ns, "g");
      grp.innerHTML = `<circle cx="${p.x.toFixed(0)}" cy="${p.y.toFixed(0)}" r="44" fill="url(#w12gInk)"/>` + (Math.random() < 0.4 ? `<circle cx="${(p.x + rnd(-18, 18)).toFixed(0)}" cy="${(p.y + rnd(-18, 18)).toFixed(0)}" r="1.6" fill="#FFF6DD"/>` : "");
      g.appendChild(grp);
      grp.animate([{ opacity: 1 }, { opacity: 1, offset: 0.35 }, { opacity: 0 }], { duration: 1500, fill: "forwards" }).onfinish = () => grp.remove();
      const t = performance.now(); if (t - sndT > 120) { sndT = t; Snd.noise({ kind: "pink", type: "lowpass", f: 900, dur: 0.15, gain: 0.06 }); }
    };
    const inside = p => p.y > minY && p.y < maxY;
    const end = () => { if (fin) return; fin = true; clearTimeout(tmr); field.remove(); window.removeEventListener("pointerup", up); setTimeout(() => lay.remove(), 1600); res(); };
    const up = () => { down = false; last = null; if (len >= need) end(); };
    field.addEventListener("pointerdown", ev => { const p = local(ev); if (!inside(p)) return; down = true; last = p; blot(p); });
    field.addEventListener("pointermove", ev => {
      if (!down || fin) return; const p = local(ev); if (!inside(p)) return;
      const d = last ? w12dist(p, last) : 0; if (d < 16) return; len += d; last = p; blot(p);
    });
    window.addEventListener("pointerup", up);
    const tmr = setTimeout(async () => {
      for (let i = 0; i < 26 && !fin; i++) { blot({ x: W * (0.15 + 0.7 * (i % 13) / 12), y: minY + (maxY - minY) * (i < 13 ? 0.35 : 0.65) + Math.sin(i) * 20 }); await sleep(70); }
      end();
    }, timeout);
  });
}
async function chDayNight() {
  await toDark(); clearStage();
  const sk = sky("linear-gradient(180deg,#4FA8E0 0%,#9AD5F2 60%,#E6F6FC 100%)");
  const { W, H } = size();
  const hy = H * 0.8, cx = W / 2;
  const SA = { rx: W * 0.46, ry: H * 0.5 }, MA = { rx: W * 0.3, ry: H * 0.26 };
  const pt = (A, t) => ({ x: cx - A.rx * Math.cos(Math.PI * t), y: hy - A.ry * Math.sin(Math.PI * t) });
  const stars = el("div", "layer", stage, w12stars(60)); stars.style.inset = "0 0 22% 0"; stars.style.opacity = "0"; stars.style.transition = "opacity 3s";
  const tracks = el("div", "layer", stage, `<svg viewBox="0 0 ${W} ${H}" aria-hidden="true">
    <path class="ts" d="M${cx - SA.rx} ${hy} A${SA.rx} ${SA.ry} 0 0 1 ${cx + SA.rx} ${hy}" fill="none" stroke="#FFE08A" stroke-width="3" stroke-dasharray="8 9" opacity=".55"/>
    <path class="tm" d="M${cx - MA.rx} ${hy} A${MA.rx} ${MA.ry} 0 0 1 ${cx + MA.rx} ${hy}" fill="none" stroke="#E4ECFF" stroke-width="3" stroke-dasharray="8 9" opacity="0"/>
    <line class="rub" x1="0" y1="0" x2="0" y2="0" stroke="#FFF3C4" stroke-width="3" stroke-dasharray="4 5" opacity="0"/></svg>`);
  tracks.style.inset = "0"; tracks.style.zIndex = 1;
  const tm = tracks.querySelector(".tm"), rub = tracks.querySelector(".rub");
  const sun = obj("w12-sun", ART.sun, 0, 0, 110, 110); sun.style.zIndex = 2;
  const moon = obj("w12-moon", ART.w12_moon, 0, 0, 74, 74); moon.style.zIndex = 2; moon.style.opacity = "0";
  let sunT = 0.33, moonT = 0.06, orbitRun = true;
  const place = () => { const a = pt(SA, sunT), b = pt(MA, moonT); put(sun, a.x, a.y); put(moon, b.x, b.y); };
  place();
  const hl = hills(0.24, ["#A8D99A", "#7DC46D", "#5AAE57"]); hl.style.zIndex = 3;
  const veil = el("div", "nightveil"); veil.style.opacity = "0"; veil.style.transition = "opacity 3s"; veil.style.zIndex = 4;
  vignette();
  Snd.amb("meadow", 0.7); fromDark(); await sleep(300);
  await chapterTitle(null, "Каждый по своей орбите", "daynight_0");
  await say("daynight_1");

  /* закрасить небо ночью — краска тает */
  cue("daynight_2");
  await w12paint(H * 0.34, hy - 10);
  await say("daynight_3");

  /* солнце само идёт к закату, луна поднимается */
  cue("daynight_4");
  sk.style.transition = "background 4s"; sk.style.background = "linear-gradient(180deg,#3E6FA8 0%,#E9A27A 62%,#F6D79A 100%)";
  moon.style.transition = "opacity 2s"; moon.style.opacity = "1"; tm.style.transition = "opacity 2s"; tm.setAttribute("opacity", ".6");
  Snd.amb("wind", 0.5);
  const s0 = sunT, m0 = moonT;
  for (let i = 1; i <= 60; i++) { sunT = s0 + (0.8 - s0) * i / 60; moonT = m0 + (0.16 - m0) * i / 60; place(); await sleep(60); }
  await sleep(1200);

  /* тянуть луну к солнцу: она едет только по своей дорожке */
  cue("daynight_5");
  await new Promise(res => {
    let drag = false, fin = false, tries = 0, maxPull = 0, own = moonT, last = performance.now();
    moon.classList.add("hint", "tapme"); moon.style.zIndex = 9;
    const field = el("div", "tapfield"); field.style.zIndex = 10;
    const tOf = p => {
      let th = Math.atan2((hy - p.y) / MA.ry, (cx - p.x) / MA.rx);
      if (th < 0) th = Math.cos(th) > 0 ? 0 : Math.PI;
      return Math.max(0.04, Math.min(0.96, th / Math.PI));
    };
    const dn = ev => { const p = local(ev); if (w12dist(p, { x: moon._x, y: moon._y }) > 60) return; drag = true; maxPull = 0; moon.classList.remove("hint"); Snd.tap(); };
    const mv = ev => {
      if (!drag || fin) return; const p = local(ev);
      moonT = tOf(p); place();
      const d = w12dist(p, { x: moon._x, y: moon._y }); maxPull = Math.max(maxPull, Math.abs(moonT - own) * 400 + d);
      rub.setAttribute("x1", moon._x); rub.setAttribute("y1", moon._y); rub.setAttribute("x2", p.x); rub.setAttribute("y2", p.y); rub.setAttribute("opacity", d > 30 ? "0.8" : "0");
      tm.setAttribute("opacity", d > 30 ? "1" : ".6"); tm.setAttribute("stroke-width", d > 30 ? "5" : "3");
      if (d > 30 && Math.random() < 0.15) Snd.noise({ f: 2400, q: 6, dur: 0.06, gain: 0.04 });
    };
    const up = () => {
      if (!drag) return; drag = false; rub.setAttribute("opacity", "0"); tm.setAttribute("stroke-width", "3"); tm.setAttribute("opacity", ".6");
      if (maxPull > 40) { tries++; Snd.whoosh(0.12); }
      if (tries >= 2 && !fin) finish();
    };
    const finish = () => { fin = true; clearTimeout(tmr); moon.classList.remove("hint", "tapme"); field.remove(); window.removeEventListener("pointerup", up); setTimeout(res, 900); };
    field.addEventListener("pointerdown", dn); field.addEventListener("pointermove", mv); window.addEventListener("pointerup", up);
    /* пока не держат — луна плавно возвращается на своё место, солнце идёт дальше */
    const loop = t => {
      const dt = Math.min(0.05, (t - last) / 1000); last = t;
      own += dt * 0.004; sunT = Math.min(0.9, sunT + dt * 0.004);
      if (!drag) moonT += (own - moonT) * Math.min(1, dt * 2.5);
      place();
      if (orbitRun) requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
    const tmr = setTimeout(async () => {
      if (fin) return; moon.classList.remove("hint");
      for (let i = 0; i <= 30; i++) { moonT = own + (0.7 - own) * Math.sin(Math.PI * i / 30); place(); tm.setAttribute("opacity", "1"); await sleep(50); }
      if (!fin) finish();
    }, 16000);
  });
  await say("daynight_6");
  orbitRun = false;

  /* закат и ночь */
  hideCap();
  sk.style.transition = "background 3.5s"; sk.style.background = "linear-gradient(180deg,#0C1D33 0%,#183A5C 60%,#2B5276 100%)";
  veil.style.opacity = ".2"; stars.style.opacity = "1"; hl.style.transition = "filter 3.5s"; hl.style.filter = "brightness(.5) saturate(.8)"; tracks.querySelector(".ts").style.transition = "opacity 2s"; tracks.querySelector(".ts").setAttribute("opacity", ".25");
  Snd.amb("wind", 0.3);
  const s1 = sunT, m1 = moonT;
  for (let i = 1; i <= 70; i++) { sunT = s1 + (1.12 - s1) * i / 70; moonT = m1 + (0.45 - m1) * i / 70; place(); await sleep(50); }
  Snd.sparkle();
  await say("daynight_7");
  await say("daynight_8");
  const misses = await choice("daynight_q", [{ id: "daynight_qa", icon: ICON.w12_brush }, { id: "daynight_qc", ar: true, ok: true }, { id: "daynight_qb", icon: ICON.cloud }], "daynight_q_ok");
  await say("daynight_quran");
  await ayahCard("36:40");
  await say("daynight_end", { btn: "Субханаллах" });
  hideCap(); await award("w12_crescent");
  return misses;
}

/* ============ ГЛАВА: ОН НИКОГДА НЕ СПИТ (2:255) ============ */
function w12window(x, y, w, h, inner) {
  const win = el("div", "w12-win", stage, `<div class="wsky"></div>${inner || ""}<div class="wbar" style="left:calc(50% - 3px);top:0;height:100%;width:6px"></div><div class="wbar" style="top:calc(50% - 3px);left:0;width:100%;height:6px"></div>`);
  Object.assign(win.style, { left: x + "px", top: y + "px", width: w + "px", height: h + "px" });
  return win;
}
async function chNoSleep() {
  await toDark(); clearStage();
  const { W, H } = size();
  el("div", "w12-room", stage, `<div class="wall"></div><div class="floor"></div>`);
  const ww = Math.min(W * 0.44, 190), wh = ww * 0.8;
  const win = w12window(W / 2, H * 0.4, ww, wh, `<div class="layer" style="inset:0">${w12stars(26, 300)}</div><svg style="position:absolute;right:10%;top:12%;width:26%;height:auto" viewBox="0 0 60 60" aria-hidden="true">${w12cres(32, 30, 22, "#FFE7A0")}</svg>`);
  const wsky = win.querySelector(".wsky"); wsky.style.background = "linear-gradient(180deg,#0B1830,#1B3358)";
  const tableY = H * 0.7;
  const table = el("div", "w12-table", stage); Object.assign(table.style, { left: "4%", right: "4%", top: tableY + "px" });
  /* дежурные */
  const candle = obj("w12-candle", ART.w12_candle, W * 0.17, tableY - 62, 50, 130); candle.style.zIndex = 5;
  const cs = Math.min(W * 0.3, 120);
  const clock = obj("w12-clock", ART.w12_clock, W * 0.5, tableY - cs / 2 - 2, cs, cs); clock.style.zIndex = 5;
  const torch = obj("w12-torch", `<div style="width:100%;height:100%;transform:scaleX(-1)">${ART.w12_torch}</div>`, W * 0.8, tableY - 24, 96, 48); torch.style.zIndex = 5;
  const beam = obj("w12-beam", `<div style="width:100%;height:100%;transform:scaleX(-1)">${ART.w12_beam}</div>`, torch._x + 42 + 65, torch._y, 130, 98); beam.style.zIndex = 6; beam.style.transform = "rotate(-50deg)"; beam.style.transformOrigin = "0% 50%"; beam.style.mixBlendMode = "screen";
  const cGlow = glowSpot(candle._x, candle._y - 42, 90); cGlow.style.zIndex = 6;
  const wring = obj("w12-wind off", "", clock._x, clock._y, cs * 1.45, cs * 1.45);
  const bars = [candle, clock, torch].map(o => { const b = el("div", "w12-bar", stage, "<i></i>"); b.style.left = o._x + "px"; b.style.top = (tableY + 26) + "px"; return b; });
  const box = el("div", "w12-box", stage); const by = Math.min(H * 0.87, H - 56);
  Object.assign(box.style, { left: W / 2 + "px", top: by + "px", width: Math.min(W * 0.62, 250) + "px", height: "70px", zIndex: 4 });
  const bats = [0, 1, 2, 3].map(i => { const b = obj("w12-bat", ART.w12_battery, W / 2 + (i - 1.5) * Math.min(W * 0.13, 54), by, 28, 52); b.style.zIndex = 9; b.home = { x: b._x, y: b._y }; return b; });
  const dark = el("div", "w12-dark"); dark.style.opacity = "0.3"; dark.style.zIndex = 3;
  vignette();
  /* состояние */
  const S = { candle: { e: 1, wax: 1 }, clock: { e: 1, cap: 1 }, torch: { e: 1 }, act: { candle: false, clock: false, torch: false }, phase2: false };
  const wax = candle.querySelector(".w12-wax"), wick = candle.querySelector(".w12-wick"), flame = candle.querySelector(".w12-flame");
  const hands = [".w12-sh", ".w12-mh", ".w12-hh"].map(s => clock.querySelector(s)), hAng = [0, 60, 300];
  const lens = torch.querySelector(".w12-lens");
  let last = performance.now(), tickA = 0, run = true, ph2t = 0, outFor = 0;
  const draw = () => {
    const c = S.candle, top = 118 - 78 * Math.max(0.08, c.wax);
    wax.setAttribute("y", top.toFixed(1)); wax.setAttribute("height", (118 - top).toFixed(1)); wick.setAttribute("d", `M25 ${top} V${top - 7}`);
    const fl = c.e > 0.02 ? 0.35 + 0.65 * c.e : 0;
    flame.setAttribute("transform", `translate(25 ${top - 5}) scale(${(fl * (0.92 + Math.random() * 0.12)).toFixed(3)} ${fl.toFixed(3)})`);
    cGlow.style.opacity = (c.e * 0.9).toFixed(2); cGlow.style.top = (candle._y - 65 + top - 15 - 90) + "px";
    beam.style.opacity = (S.torch.e * 0.8).toFixed(2); lens.setAttribute("fill", S.torch.e > 0.05 ? "#FFF3C4" : "#7E9099");
    hands.forEach((h, i) => h.setAttribute("transform", `rotate(${hAng[i].toFixed(1)} 50 52)`));
    [S.candle.e, S.clock.e, S.torch.e].forEach((e, i) => { bars[i].firstChild.style.width = Math.round(e * 100) + "%"; bars[i].classList.toggle("low", e < 0.3); });
    dark.style.opacity = (0.72 - 0.42 * (S.candle.e + S.torch.e + S.clock.e * 0.4) / 2.4).toFixed(2);
  };
  const drains = { candle: 0, clock: 0, torch: 0 };
  const loop = t => {
    if (!run) return;
    const dt = Math.min(0.05, (t - last) / 1000); last = t;
    if (S.phase2) { ph2t += dt; outFor = S.candle.e + S.clock.e + S.torch.e === 0 ? outFor + dt : 0; }
    const k = S.phase2 ? 1 + ph2t / 14 : 1;
    for (const key of ["candle", "clock", "torch"]) { const d = S[key]; d.e = Math.max(0, d.e - drains[key] * k * dt); }
    if (S.candle.e > 0) S.candle.wax = Math.max(0, S.candle.wax - dt * (S.phase2 ? 0.02 : 0.004));
    if (S.candle.wax <= 0.02) S.candle.e = 0;
    const sp = S.clock.e; hAng[0] += sp * 240 * dt; hAng[1] += sp * 24 * dt; hAng[2] += sp * 2 * dt;
    tickA += sp * 240 * dt; if (tickA > 60) { tickA = 0; Snd.noise({ f: 3200, q: 8, dur: 0.03, gain: 0.06, attack: 0.002 }); }
    draw(); requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
  /* касания: одна общая "сетка" решает, что трогают */
  const field = el("div", "tapfield"); field.style.zIndex = 12;
  let dragB = null, off = null, wind = null;
  const relight = () => {
    if (S.candle.wax <= 0.08) { Snd.thud(0.2); return; }
    S.candle.e = 1; if (S.phase2) S.candle.wax = Math.max(0, S.candle.wax - 0.22);
    Snd.noise({ type: "highpass", f: 2500, dur: 0.08, gain: 0.3, attack: 0.002 }); Snd.sparkle();
    candle.classList.remove("wob"); void candle.offsetWidth; candle.classList.add("wob");
  };
  const insertBat = async b => {
    b.used = true; Snd.tap(); await move(b, torch._x + 12, torch._y, 200, "ease-in"); fadeOut(b, 300);
    S.torch.e = 1; Snd.noise({ f: 1800, q: 4, dur: 0.06, gain: 0.25, attack: 0.002 }); Snd.sparkle();
  };
  const fdn = ev => {
    const p = local(ev);
    if (S.act.torch) { const b = bats.find(x => !x.used && w12dist(p, { x: x._x, y: x._y }) < 36); if (b) { dragB = b; off = { x: b._x - p.x, y: b._y - p.y }; b.classList.remove("hint"); Snd.tap(); return; } }
    if (S.act.candle && Math.abs(p.x - candle._x) < 44 && p.y > candle._y - 80 && p.y < candle._y + 66) { relight(); return; }
    if (S.act.clock && w12dist(p, { x: clock._x, y: clock._y }) < cs * 0.95) wind = { a: Math.atan2(p.y - clock._y, p.x - clock._x), acc: 0 };
  };
  const fmv = ev => {
    const p = local(ev);
    if (dragB) { put(dragB, p.x + off.x, p.y + off.y); return; }
    if (wind) {
      const a = Math.atan2(p.y - clock._y, p.x - clock._x); let d = a - wind.a; if (d > Math.PI) d -= 2 * Math.PI; if (d < -Math.PI) d += 2 * Math.PI;
      wind.a = a; if (Math.abs(d) > 1) return;
      const c = S.clock, g = Math.abs(d) / (2 * Math.PI);
      c.e = Math.min(c.cap, c.e + g * 0.55); if (S.phase2) c.cap = Math.max(0, c.cap - g * 0.2);
      hAng[1] += d * 57; wind.acc += Math.abs(d); if (wind.acc > 0.8) { wind.acc = 0; Snd.noise({ f: 2600, q: 5, dur: 0.05, gain: 0.12, attack: 0.002 }); }
    }
  };
  const fup = () => {
    if (dragB) { const b = dragB; dragB = null; if (w12dist({ x: b._x, y: b._y }, { x: torch._x, y: torch._y }) < 70) insertBat(b); else { move(b, b.home.x, b.home.y, 300, "ease-out"); if (S.act.torch && !S.phase2) b.classList.add("hint"); } }
    wind = null;
  };
  field.addEventListener("pointerdown", fdn); window.addEventListener("pointermove", fmv); window.addEventListener("pointerup", fup);
  const cleanup = () => { run = false; field.remove(); window.removeEventListener("pointermove", fmv); window.removeEventListener("pointerup", fup); };
  Snd.amb("wind", 0.25); fromDark(); await sleep(300);
  await chapterTitle(null, "Он никогда не спит", "nosleep_0");
  await say("nosleep_1");

  /* 1. свеча */
  drains.candle = 0.45; await w12until(() => S.candle.e < 0.12, 4000);
  drains.candle = 0; S.act.candle = true; candle.classList.add("hint");
  cue("nosleep_2");
  await w12until(() => S.candle.e > 0.9, 14000, async () => relight());
  candle.classList.remove("hint"); S.act.candle = false;
  /* 2. часы */
  drains.clock = 0.4; await w12until(() => S.clock.e < 0.12, 4000);
  drains.clock = 0; S.act.clock = true; wring.classList.remove("off");
  cue("nosleep_3");
  await w12until(() => S.clock.e > 0.95, 16000, async () => { for (let i = 0; i < 20; i++) { S.clock.e = Math.min(1, S.clock.e + 0.05); hAng[1] += 18; await sleep(50); } });
  wring.classList.add("off"); S.act.clock = false; Snd.sparkle();
  /* 3. фонарик */
  drains.torch = 0.4; await w12until(() => S.torch.e < 0.12, 4000);
  drains.torch = 0; S.act.torch = true; bats[0].classList.add("hint");
  cue("nosleep_4");
  await w12until(() => S.torch.e > 0.9, 16000, async () => { bats[0].classList.remove("hint"); await insertBat(bats[0]); });
  bats.forEach(b => b.classList.remove("hint")); S.act.torch = false;

  /* 4. все сразу: силы кончаются */
  await say("nosleep_5", { btn: "Начать" });
  hideCap();
  Object.assign(S.act, { candle: true, clock: true, torch: true }); S.phase2 = true; wring.classList.remove("off");
  Object.assign(drains, { candle: 0.2, clock: 0.17, torch: 0.14 });
  capNote.textContent = "";
  const allOut = () => S.candle.e === 0 && S.clock.e === 0 && S.torch.e === 0;
  await w12until(() => outFor > 2.5, 32000);
  /* время вышло: всё гаснет само */
  Object.assign(S.act, { candle: false, clock: false, torch: false }); wring.classList.add("off");
  Object.assign(drains, { candle: 0.6, clock: 0.6, torch: 0.6 }); S.candle.wax = Math.min(S.candle.wax, 0.07); S.clock.cap = 0;
  await w12until(allOut, 4000);
  cleanup(); bats.forEach(b => { if (!b.used) fadeOut(b, 400); }); fadeOut(box, 400); bars.forEach(b => fadeOut(b, 400));
  Snd.amb(null); await sleep(800);
  await say("nosleep_6");
  await say("nosleep_7");

  /* весь мир спит, а Аллах заботится о нём */
  hideCap(); await toDark(); clearStage();
  const sk = sky("linear-gradient(180deg,#081A2C 0%,#12304A 60%,#1D4462 100%)");
  const st2 = el("div", "layer", stage, w12stars(70)); st2.style.inset = "0 0 30% 0"; st2.style.transition = "opacity 4s";
  const mn = obj("w12-moon", ART.w12_moon, W * 0.78, H * 0.4, 80, 80); mn.style.transition = "opacity 4s";
  const hl2 = hills(0.3); hl2.style.filter = "brightness(.4) saturate(.7)";
  [[0.18, 0.78, 46], [0.34, 0.8, 40], [0.66, 0.79, 44], [0.84, 0.81, 38]].forEach(([fx, fy, s]) => { const h = obj("house", ART.house, W * fx, H * fy, s, s); h.style.zIndex = 3; h.style.filter = "brightness(.45)"; });
  const veil = el("div", "nightveil"); veil.style.opacity = ".3"; veil.style.transition = "opacity 4s";
  vignette();
  Snd.amb("wind", 0.25); fromDark(); await sleep(600);
  await say("nosleep_8");
  /* наступает утро */
  sk.style.transition = "background 4s"; sk.style.background = "linear-gradient(180deg,#5AB2E4 0%,#A9DCF3 60%,#F3E8C4 100%)";
  st2.style.opacity = "0"; mn.style.opacity = "0"; veil.style.opacity = "0";
  const sun = sunAt(W * 0.3, H * 0.85, 140); stage.insertBefore(sun, sk.nextSibling);
  sun.animate([{ top: (H * 0.85) + "px" }, { top: (H * 0.45) + "px" }], { duration: 4000, easing: "ease-out", fill: "forwards" });
  [hl2, ...stage.querySelectorAll(".obj.house")].forEach(h => { h.style.transition = "filter 4s"; h.style.filter = "brightness(1)"; });
  Snd.amb("meadow", 0.7); await sleep(2500);
  await say("nosleep_9");
  const misses = await choice("nosleep_q", [{ id: "nosleep_qa", icon: ICON.w12_clock }, { id: "nosleep_qb", icon: ICON.w12_torch }, { id: "nosleep_qc", ar: true, ok: true }], "nosleep_q_ok");
  await say("nosleep_quran");
  await ayahCard("2:255");
  await say("nosleep_end", { btn: "Аллаху Акбар" });
  hideCap(); await award("w12_clock");
  return misses;
}

/* ============ ГЛАВА: ДОВОЛЬНО НАМ АЛЛАХА (65:3) ============ */
async function chEnough() {
  await toDark(); clearStage();
  const { W, H } = size();
  const room = el("div", "w12-room", stage, `<div class="wall"></div><div class="floor"></div>`);
  const ww = Math.min(W * 0.5, 230, H * 0.25), wh = ww * 0.86, wx = W / 2, wy = H * 0.5;
  const win = w12window(wx, wy, ww, wh, `<div class="layer rain" style="inset:0">${Array.from({ length: 26 }, () => `<i style="left:${rnd(0, 100).toFixed(1)}%;animation-delay:${(-rnd(0, 1)).toFixed(2)}s;animation-duration:${rnd(0.5, 0.8).toFixed(2)}s"></i>`).join("")}</div>
    <div class="wrb" style="position:absolute;left:5%;right:5%;bottom:4%;opacity:0;transition:opacity 2.5s">${ART.w12_rainbow}</div><div class="w12-flash"></div>`);
  const wsky = win.querySelector(".wsky"); wsky.style.background = "linear-gradient(180deg,#26324A,#3E4F6C)";
  const rain = win.querySelector(".rain"), wflash = win.querySelector(".w12-flash"), rbow = win.querySelector(".wrb");
  /* ставни */
  const sw = ww / 2 + 4, sh = wh + 10, wl = wx - ww / 2, wr = wx + ww / 2;
  const shut = [{ open: wl - sw / 2 + 2, shut: wx - sw / 2 + 2 }, { open: wr + sw / 2 - 2, shut: wx + sw / 2 - 2 }].map((o, i) => {
    const s = obj("w12-sh", `<div style="width:100%;height:100%;${i ? "transform:scaleX(-1)" : ""}">${ART.w12_shutter}</div>`, o.open, wy, sw, sh);
    s.style.zIndex = 6; Object.assign(s, o); s.closed = false; return s;
  });
  /* лампа и кнопка */
  const tY = H * 0.76, lx = W * 0.2;
  const side = el("div", "w12-table", stage); Object.assign(side.style, { left: (lx - 46) + "px", width: "92px", top: tY + "px" });
  const legs = el("div", "", stage); Object.assign(legs.style, { position: "absolute", left: (lx - 36) + "px", width: "72px", top: (tY + 14) + "px", height: (H * 0.1) + "px", borderLeft: "8px solid #6A3E1C", borderRight: "8px solid #6A3E1C" });
  const lamp = obj("w12-lamp", ART.w12_lamp, lx, tY - 46, 72, 99); lamp.style.zIndex = 5;
  const swb = obj("w12-switch", ART.w12_switch, lx + 34, tY - 14, 38, 38); swb.style.zIndex = 7;
  const warm = el("div", "w12-warm");
  /* кровать и одеяло */
  const bL = W * 0.5, bR = W * 0.97, bT = H * 0.78, bB = Math.min(H * 0.95, H - 30);
  const bed = el("div", "", stage); Object.assign(bed.style, { position: "absolute", left: bL + "px", width: (bR - bL) + "px", top: bT + "px", height: (bB - bT) + "px", borderRadius: "12px", background: "#F3EDE0", boxShadow: "0 0 0 6px #8E5A2E, 0 10px 16px rgba(0,0,0,.35)" });
  const pillow = el("div", "", stage); Object.assign(pillow.style, { position: "absolute", left: (bL + 10) + "px", width: Math.min(90, (bR - bL) * 0.4) + "px", top: (bT + 8) + "px", height: "30px", borderRadius: "14px", background: "#FFF8EA", boxShadow: "0 2px 4px rgba(0,0,0,.2)" });
  const blanket = el("div", "w12-blanket", stage); const bMin = (bB - bT) * 0.22, bMax = (bB - bT) - 34;
  Object.assign(blanket.style, { left: (bL + 4) + "px", width: (bR - bL - 8) + "px", top: (bB - bMin) + "px", height: bMin + "px", zIndex: 7 });
  const flash = el("div", "w12-flash"); flash.style.zIndex = 14;
  const veil = el("div", "nightveil"); veil.style.opacity = ".45"; veil.style.transition = "opacity 1.5s"; veil.style.zIndex = 8;
  vignette();
  /* шкала «Страшно» */
  const fear = el("div", "w12-fear", app, `<p><span>Страшно</span><em>90%</em></p><i><b></b></i>`); fear.style.opacity = "0";
  let fv = 0.9;
  const setFear = v => {
    fv = Math.max(0, Math.min(1, v));
    fear.querySelector("b").style.width = Math.round(fv * 100) + "%";
    fear.querySelector("b").style.background = fv > 0.6 ? "#E8754F" : fv > 0.25 ? "#F5C451" : "#7FD99A";
    fear.querySelector("span").textContent = fv > 0.05 ? "Страшно" : "Спокойно";
    fear.querySelector("em").textContent = Math.round(fv * 100) + "%";
  };
  setFear(0.9);
  /* гроза */
  let storm = true;
  const thunder = (big = true) => {
    const closed = shut.every(s => s.closed);
    wflash.classList.remove("on"); void wflash.offsetWidth; wflash.classList.add("on");
    if (!closed) { flash.classList.remove("on"); void flash.offsetWidth; flash.classList.add("on"); flash.style.opacity = ""; }
    Snd.noise({ kind: "brown", type: "lowpass", f: 160, dur: big ? 1.8 : 1.2, gain: big ? 0.4 : 0.2, attack: 0.15, at: 0.3 });
  };
  const rainT = setInterval(() => { if (storm) Snd.noise({ kind: "pink", type: "highpass", f: 2500, dur: 1.3, gain: 0.05, attack: 0.4 }); }, 1100);
  const thT = setInterval(() => { if (storm) thunder(); }, 7000);
  Snd.amb("wind", 0.6); fromDark(); await sleep(300);
  await chapterTitle(null, "Довольно нам Аллаха", "enough_0");
  thunder();
  fear.style.opacity = "1";
  await say("enough_1");

  /* 1. ставни: тянуть к середине */
  cue("enough_2");
  await new Promise(res => {
    let drag = null, ox = 0, fin = false;
    shut.forEach(s => s.classList.add("hint", "tapme"));
    const closeS = s => {
      if (s.closed) return; s.closed = true; s.classList.remove("hint", "tapme"); put(s, s.shut, wy); Snd.thud(0.5); setFear(fv - 0.12);
      if (shut.every(x => x.closed) && !fin) { fin = true; clearTimeout(tmr); window.removeEventListener("pointermove", mv); window.removeEventListener("pointerup", up); shut.forEach(x => { x.onpointerdown = null; }); setTimeout(res, 500); }
    };
    shut.forEach(s => { s.onpointerdown = ev => { ev.preventDefault(); if (s.closed) return; drag = s; ox = s._x - local(ev).x; s.classList.remove("hint"); Snd.tap(); }; });
    const mv = ev => {
      if (!drag) return; const s = drag, x = local(ev).x + ox, lo = Math.min(s.open, s.shut), hi = Math.max(s.open, s.shut);
      put(s, Math.max(lo, Math.min(hi, x)), wy);
      if (Math.abs(s._x - s.shut) < 14) { drag = null; closeS(s); }
    };
    const up = () => { if (!drag) return; const s = drag; drag = null; if (Math.abs(s._x - s.shut) < Math.abs(s.shut - s.open) * 0.35) closeS(s); else { move(s, s.open, wy, 300, "ease-out"); s.classList.add("hint"); } };
    window.addEventListener("pointermove", mv); window.addEventListener("pointerup", up);
    const tmr = setTimeout(async () => { for (const s of shut) { if (!s.closed) { drag = null; await move(s, s.shut, wy, 600); closeS(s); } } }, 20000);
  });
  rain.style.opacity = ".4";

  /* 2. свет */
  cue("enough_3");
  await tapOnce(swb, null, 15000);
  swb.querySelector(".w12-sw").setAttribute("fill", "#6BBF59"); swb.querySelector(".w12-sw").setAttribute("y", "22");
  lamp.querySelector(".w12-shade").setAttribute("opacity", "1");
  glowSpot(lamp._x, lamp._y - 10, 120).style.zIndex = 5; warm.style.opacity = "1"; veil.style.opacity = ".2";
  Snd.noise({ f: 1800, q: 4, dur: 0.06, gain: 0.3, attack: 0.002 }); setFear(fv - 0.12);
  await sleep(500);

  /* 3. одеяло: тянуть вверх */
  cue("enough_4");
  await new Promise(res => {
    let drag = false, oy = 0, fin = false; blanket.classList.add("tapme");
    const hintEl = obj("hint", "", (bL + bR) / 2, bB - bMin / 2, 60, 60); hintEl.style.zIndex = 8; hintEl.style.pointerEvents = "none";
    const setH = h => { h = Math.max(bMin, Math.min(bMax, h)); blanket.style.height = h + "px"; blanket.style.top = (bB - h) + "px"; return h; };
    blanket.onpointerdown = ev => { ev.preventDefault(); drag = true; oy = local(ev).y - (bB - blanket.offsetHeight); hintEl.remove(); Snd.tap(); };
    const mv = ev => { if (!drag || fin) return; const h = setH(bB - (local(ev).y - oy)); if (h >= bMax - 4) done(); };
    const up = () => { drag = false; };
    const done = () => {
      if (fin) return; fin = true; clearTimeout(tmr); setH(bMax); hintEl.remove(); blanket.onpointerdown = null; blanket.classList.remove("tapme");
      window.removeEventListener("pointermove", mv); window.removeEventListener("pointerup", up);
      Snd.whoosh(0.15); setFear(fv - 0.12); setTimeout(res, 600);
    };
    window.addEventListener("pointermove", mv); window.addEventListener("pointerup", up);
    const tmr = setTimeout(async () => { for (let h = blanket.offsetHeight; h < bMax; h += 6) { setH(h); await sleep(30); } done(); }, 16000);
  });
  await sleep(400);
  thunder(); setFear(fv + 0.08);
  await say("enough_5");

  /* 4. довериться Аллаху */
  cue("enough_6");
  const dw = Math.min(W * 0.84, 340);
  const dua = obj("w12-dua", `<b lang="ar" dir="rtl">${W12_HASBUNA}</b><small>Хасбуна-Ллаху ва ниъмаль-вакиль</small>`, W / 2, H * 0.62, dw, 0); dua.style.height = "auto"; fadeIn(dua);
  dua.classList.add("pulse");
  await new Promise(r => { const t = setTimeout(r, 18000); dua.onpointerdown = ev => { ev.preventDefault(); clearTimeout(t); r(); }; });
  dua.onpointerdown = null; dua.classList.remove("pulse"); dua.classList.add("on"); Snd.sparkle(); celebrate();
  storm = false; clearInterval(thT);
  for (let i = 1; i <= 20; i++) { setFear(fv * (1 - i / 20)); await sleep(60); }
  setFear(0); rain.style.opacity = ".25"; Snd.amb("wind", 0.2);
  await say("enough_7");
  await say("enough_8");
  fadeOut(dua, 500); fadeOut(fear, 500);

  /* утро и радуга */
  hideCap(); clearInterval(rainT);
  await Promise.all(shut.map(s => move(s, s.open, wy, 900, "ease-in-out")));
  wsky.style.background = "linear-gradient(180deg,#6CC0EA,#CDEBF7)"; rain.style.transition = "opacity 2s"; rain.style.opacity = "0";
  veil.style.opacity = "0"; warm.style.opacity = ".3"; rbow.style.opacity = "1";
  const wall = room.querySelector(".wall"), floor = room.querySelector(".floor");
  wall.style.transition = floor.style.transition = "filter 2.5s"; wall.style.filter = "brightness(2.1) saturate(.8)"; floor.style.filter = "brightness(1.7)";
  Snd.amb("meadow", 0.7); Snd.sparkle(); await sleep(2200);
  await say("enough_9");
  const misses = await choice("enough_q", [{ id: "enough_qa", icon: ICON.w12_shutters }, { id: "enough_qb", icon: ICON.w12_pause }, { id: "enough_qc", ar: true, ok: true }], "enough_q_ok");
  fear.remove();
  await say("enough_quran");
  await ayahCard("65:3");
  await say("enough_end", { btn: "Хасбуна-Ллах" });
  hideCap(); await award("w12_rainbow");
  return misses;
}

/* ============ РЕГИСТРАЦИЯ ============ */
regChapter(0, { id: "water", name: "Солёная и пресная вода", icon: ICON.w12_water, fn: chWater, lines: "water_" });
regChapter(0, { id: "daynight", name: "Каждый по своей орбите", icon: ICON.w12_orbit, fn: chDayNight, lines: "daynight_" });
regChapter(1, { id: "nosleep", name: "Он никогда не спит", icon: ICON.w12_clock, fn: chNoSleep, lines: "nosleep_" });
regChapter(1, { id: "enough", name: "Довольно нам Аллаха", icon: ICON.w12_shutters, fn: chEnough, lines: "enough_" });
