"use strict";
/* Мир 3: во что верит мусульманин — шесть столпов веры.
   Главы: iman (вера в Аллаха), angels (ангелы), books (книги), prophets (пророки), lastday (Судный день), qadar (предопределение).
   Людей, ангелов и животных не рисуем: только природа, предметы, таблички с именами и свет. */

/* ============ АЯТЫ: текст quran-simple и перевод Кулиева из api.alquran.cloud ============ */
Object.assign(window.AYAT, {
  "42:11": {
    ref: "Сура аш-Шура, 42:11",
    tr: "tr_42_11",
    parts: [
      { n: 4283, ar: "فَاطِرُ السَّمَاوَاتِ وَالْأَرْضِ ۚ جَعَلَ لَكُمْ مِنْ أَنْفُسِكُمْ أَزْوَاجًا وَمِنَ الْأَنْعَامِ أَزْوَاجًا ۖ يَذْرَؤُكُمْ فِيهِ ۚ لَيْسَ كَمِثْلِهِ شَيْءٌ ۖ وَهُوَ السَّمِيعُ الْبَصِيرُ" }
    ]
  },
  "82:10-12": {
    ref: "Сура аль-Инфитар, 82:10-12",
    tr: "tr_82_10",
    parts: [
      { n: 5839, ar: "وَإِنَّ عَلَيْكُمْ لَحَافِظِينَ" },
      { n: 5840, ar: "كِرَامًا كَاتِبِينَ" },
      { n: 5841, ar: "يَعْلَمُونَ مَا تَفْعَلُونَ" }
    ]
  },
  "3:3": {
    ref: "Сура Аль Имран, 3:3",
    tr: "tr_3_3",
    parts: [
      { n: 296, ar: "نَزَّلَ عَلَيْكَ الْكِتَابَ بِالْحَقِّ مُصَدِّقًا لِمَا بَيْنَ يَدَيْهِ وَأَنْزَلَ التَّوْرَاةَ وَالْإِنْجِيلَ" }
    ]
  },
  "33:40": {
    ref: "Сура аль-Ахзаб, 33:40",
    tr: "tr_33_40",
    parts: [
      { n: 3573, ar: "مَا كَانَ مُحَمَّدٌ أَبَا أَحَدٍ مِنْ رِجَالِكُمْ وَلَٰكِنْ رَسُولَ اللَّهِ وَخَاتَمَ النَّبِيِّينَ ۗ وَكَانَ اللَّهُ بِكُلِّ شَيْءٍ عَلِيمًا" }
    ]
  },
  "99:7-8": {
    ref: "Сура аз-Зальзаля, 99:7-8",
    tr: "tr_99_7",
    parts: [
      { n: 6145, ar: "فَمَنْ يَعْمَلْ مِثْقَالَ ذَرَّةٍ خَيْرًا يَرَهُ" },
      { n: 6146, ar: "وَمَنْ يَعْمَلْ مِثْقَالَ ذَرَّةٍ شَرًّا يَرَهُ" }
    ]
  },
  "54:49": {
    ref: "Сура аль-Камар, 54:49",
    tr: "tr_54_49",
    parts: [
      { n: 4895, ar: "إِنَّا كُلَّ شَيْءٍ خَلَقْنَاهُ بِقَدَرٍ" }
    ]
  },
  "18:23-24": {
    ref: "Сура аль-Кахф, 18:23-24",
    tr: "tr_18_23",
    parts: [
      { n: 2163, ar: "وَلَا تَقُولَنَّ لِشَيْءٍ إِنِّي فَاعِلٌ ذَٰلِكَ غَدًا" },
      { n: 2164, ar: "إِلَّا أَنْ يَشَاءَ اللَّهُ ۚ وَاذْكُرْ رَبَّكَ إِذَا نَسِيتَ وَقُلْ عَسَىٰ أَنْ يَهْدِيَنِ رَبِّي لِأَقْرَبَ مِنْ هَٰذَا رَشَدًا" }
    ]
  }
});

/* ============ РИСУНКИ ============ */
/* листья большого дерева: раскладываем «подсолнухом» внутри кроны */
const W3_LEAVES = Array.from({ length: 26 }, (_, i) => {
  const a = i * 2.39996, r = Math.sqrt((i + 0.5) / 26);
  return [80 + 60 * r * Math.cos(a), 66 + 44 * r * Math.sin(a)];
});
Object.assign(ART, {
  w3_mount: `<svg viewBox="0 0 200 150" aria-hidden="true"><defs><linearGradient id="w3gMt" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9AAAB4"/><stop offset="1" stop-color="#5F7381"/></linearGradient></defs>
    <g class="w3-mbody"><path d="M6 150 L78 34 L98 52 L124 14 L194 150Z" fill="url(#w3gMt)"/><path d="M124 14 L194 150 L124 150 L112 92Z" fill="#000" opacity=".12"/>
    <path d="M124 14 L110 40 L119 35 L126 44 L135 33Z M78 34 L68 50 L77 46 L83 53 L90 45Z" fill="#fff"/>
    <g class="w3-cr" stroke="#3E4E58" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round" opacity="0"><path d="M118 42 L110 62 L118 78 L108 102"/><path d="M84 62 L93 80 L86 98"/><path d="M142 92 L152 110 L145 128"/><path d="M58 112 L70 126"/></g></g>
    <g class="w3-pile" transform="translate(100 150) scale(0.2) translate(-100 -150)"><ellipse cx="62" cy="146" rx="16" ry="7" fill="#7E8E96"/><ellipse cx="96" cy="145" rx="22" ry="9" fill="#8C9CA4"/><ellipse cx="134" cy="146" rx="18" ry="7" fill="#76868E"/><ellipse cx="80" cy="140" rx="10" ry="5" fill="#9AAAB2"/><ellipse cx="116" cy="139" rx="12" ry="6" fill="#A3B1B8"/></g></svg>`,
  w3_fire: `<svg viewBox="0 0 120 130" aria-hidden="true"><defs><radialGradient id="w3gGlow" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#FFC861" stop-opacity=".8"/><stop offset="1" stop-color="#FFC861" stop-opacity="0"/></radialGradient></defs>
    <circle class="w3-glow" cx="60" cy="78" r="60" fill="url(#w3gGlow)"/>
    <g class="w3-flw"><g class="w3-fl"><path d="M60 16 Q86 50 81 78 Q77 104 60 106 Q43 104 39 78 Q36 52 60 16Z" fill="#F07A3A"/><path d="M60 40 Q75 64 73 84 Q71 102 60 102 Q49 102 47 84 Q46 64 60 40Z" fill="#FFB238"/><path d="M60 64 Q68 78 67 90 Q65 100 60 100 Q55 100 53 90 Q53 78 60 64Z" fill="#FFF0B0"/></g></g>
    <g class="w3-logs"><rect x="16" y="98" width="88" height="14" rx="7" fill="#8E5A2E" transform="rotate(13 60 105)"/><rect x="16" y="98" width="88" height="14" rx="7" fill="#7A4A24" transform="rotate(-13 60 105)"/></g>
    <ellipse cx="60" cy="122" rx="48" ry="6" fill="#000" opacity=".14"/></svg>`,
  w3_tree: `<svg viewBox="0 0 160 180" aria-hidden="true">
    <path d="M72 180 Q70 132 74 100 L86 100 Q90 132 88 180Z" fill="#7A4A24"/>
    <path d="M79 112 Q60 94 42 84 M81 106 Q100 88 120 80 M80 104 Q80 78 80 50 M62 94 Q50 74 40 62 M98 94 Q112 72 124 62 M80 70 Q66 56 58 40 M80 66 Q94 52 102 38" stroke="#7A4A24" stroke-width="6" fill="none" stroke-linecap="round"/>
    ${W3_LEAVES.map(([x, y]) => `<circle class="w3-lf" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="14" fill="#5DAE4F"/>`).join("")}</svg>`,
  /* небольшое дерево, кустик, вертушка и флажок для главы про ветер */
  w3_treeS: `<svg viewBox="0 0 100 140" aria-hidden="true"><g class="w3-sway"><path d="M45 140 Q44 104 47 80 L55 80 Q58 104 57 140Z" fill="#8E5A2E"/>
    <circle cx="50" cy="48" r="32" fill="#6DBE59"/><circle cx="28" cy="64" r="20" fill="#5DAE4F"/><circle cx="72" cy="62" r="20" fill="#5DAE4F"/><circle cx="50" cy="70" r="20" fill="#62B553"/><circle cx="40" cy="38" r="9" fill="#8ED07A" opacity=".7"/></g></svg>`,
  w3_bush: `<svg viewBox="0 0 120 80" aria-hidden="true"><g class="w3-sway"><circle cx="34" cy="50" r="26" fill="#5DAE4F"/><circle cx="62" cy="38" r="30" fill="#6DBE59"/><circle cx="90" cy="52" r="24" fill="#5DAE4F"/><rect x="10" y="62" width="100" height="18" rx="9" fill="#4E9D45"/><circle cx="54" cy="28" r="8" fill="#8ED07A" opacity=".7"/></g></svg>`,
  w3_pin: `<svg viewBox="0 0 80 140" aria-hidden="true"><rect x="37" y="40" width="6" height="100" rx="3" fill="#A26A3A"/>
    <g class="w3-spin"><path d="M40 40 L40 6 Q60 12 40 40Z" fill="#E8584C"/><path d="M40 40 L74 40 Q68 60 40 40Z" fill="#F5C451"/><path d="M40 40 L40 74 Q20 68 40 40Z" fill="#5BA9C9"/><path d="M40 40 L6 40 Q12 20 40 40Z" fill="#7DC46D"/><circle cx="40" cy="40" r="5" fill="#FFF8EA"/></g></svg>`,
  w3_flag: `<svg viewBox="0 0 80 140" aria-hidden="true"><rect x="14" y="8" width="6" height="132" rx="3" fill="#6E8691"/><circle cx="17" cy="8" r="5" fill="#F5C451"/>
    <path class="w3-wave" d="M20 14 Q46 8 74 22 Q48 30 20 46Z" fill="#E8754F"/></svg>`,
  /* открытая книга дел: строки появляются по одной */
  w3_book: `<svg viewBox="0 0 300 190" aria-hidden="true"><path d="M150 20 Q100 2 12 12 V180 Q100 170 150 188 Q200 170 288 180 V12 Q200 2 150 20Z" fill="#2D6A57"/>
    <path d="M150 26 Q100 10 22 18 V170 Q100 162 150 178Z" fill="#FFF8EA"/><path d="M150 26 Q200 10 278 18 V170 Q200 162 150 178Z" fill="#FBF0D8"/>
    <path d="M150 26 V178" stroke="#D9C59A" stroke-width="2"/>
    <g stroke="#E9DDC2" stroke-width="3" stroke-linecap="round" fill="none">${[64, 110, 150].map(y => `<path d="M40 ${y} H132"/><path d="M168 ${y} H260"/>`).join("")}</g>
    <g fill="none" stroke-linecap="round">${[[40, 64], [40, 110], [168, 64], [168, 110]].map(([x, y]) => `<path class="w3-ln" pathLength="1" d="M${x} ${y} q11.5 -9 23 0 t23 0 t23 0 t23 0"/>`).join("")}</g></svg>`,
  w3_beacon: `<svg viewBox="0 0 60 90" aria-hidden="true"><path d="M18 86 L22 34 H38 L42 86Z" fill="#CDBB98"/><path d="M38 34 L42 86 H34 L33 34Z" fill="#000" opacity=".12"/>
    <path d="M21 52 H39 M20 70 H40" stroke="#B5A27E" stroke-width="2"/><rect x="15" y="28" width="30" height="8" rx="2" fill="#8E7A5A"/>
    <path d="M17 28 L19 19 H41 L43 28Z" fill="#6E5C44"/>
    <g class="w3-flame"><path d="M30 0 Q43 11 39 19 H21 Q17 11 30 0Z" fill="#FFB238"/><path d="M30 6 Q36 13 34 19 H26 Q24 13 30 6Z" fill="#FFF0B0"/></g>
    <rect x="12" y="84" width="36" height="6" rx="2" fill="#7E6A4A"/></svg>`,
  w3_basket: `<svg viewBox="0 0 120 90" aria-hidden="true"><path d="M24 40 Q60 -6 96 40" fill="none" stroke="#9A6534" stroke-width="7" stroke-linecap="round"/>
    <path d="M8 38 H112 L100 86 H20Z" fill="#D9A15C"/><path d="M8 38 H112 L110 48 H10Z" fill="#B97F3D"/>
    <g stroke="#B97F3D" stroke-width="2.5">${[30, 48, 66, 84, 102].map(x => `<path d="M${x - 8} 50 L${x - 12} 84"/>`).join("")}<path d="M14 62 H106 M17 74 H103"/></g></svg>`,
  w3_apple: `<svg viewBox="0 0 60 60" aria-hidden="true"><circle cx="30" cy="34" r="20" fill="#E8463C"/><path d="M30 16 Q31 8 36 5" stroke="#6A3E1C" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M32 12 Q42 6 47 13 Q39 18 32 12Z" fill="#5DAE4F"/><circle cx="23" cy="27" r="5" fill="#fff" opacity=".45"/></svg>`,
  w3_water: `<svg viewBox="0 0 40 70" aria-hidden="true"><rect x="13" y="2" width="14" height="9" rx="2" fill="#3C93C2"/><path d="M13 11 H27 V18 Q35 23 35 34 V62 Q35 68 29 68 H11 Q5 68 5 62 V34 Q5 23 13 18Z" fill="rgba(190,230,250,.75)" stroke="#5BA9C9" stroke-width="2.5"/><path d="M7 40 H33 V62 Q33 66 29 66 H11 Q7 66 7 62Z" fill="#7CC4E8"/></svg>`,
  w3_ball: `<svg viewBox="0 0 60 60" aria-hidden="true"><circle cx="30" cy="30" r="24" fill="#F5C451"/><path d="M6 30 A24 24 0 0 1 54 30Z" fill="#E8584C"/><path d="M30 6 A24 24 0 0 1 30 54" fill="none" stroke="#fff" stroke-width="4"/><circle cx="30" cy="30" r="24" fill="none" stroke="#B9802A" stroke-width="2"/></svg>`,
  w3_win: `<svg viewBox="0 0 180 150" aria-hidden="true"><defs><linearGradient id="w3gWin" x1="0" y1="0" x2="0" y2="1"><stop class="w3-ws1" offset="0" stop-color="#E9895A"/><stop class="w3-ws2" offset="1" stop-color="#F9D9A6"/></linearGradient>
    <clipPath id="w3cWin"><rect x="14" y="14" width="152" height="122" rx="4"/></clipPath></defs>
    <rect x="4" y="4" width="172" height="142" rx="8" fill="#8E5A2E"/><rect x="14" y="14" width="152" height="122" rx="4" fill="url(#w3gWin)"/>
    <path class="w3-wland" d="M14 104 Q60 84 100 98 T166 92 V136 H14Z" fill="#7DC46D"/>
    <g clip-path="url(#w3cWin)"><g class="w3-wfl"></g><g class="w3-wrain" opacity="0" stroke="#E6F1F7" stroke-width="2" stroke-linecap="round">${Array.from({ length: 9 }, (_, i) => Array.from({ length: 9 }, (_, j) => `<path d="M${12 + i * 20 + (j % 2) * 10} ${-10 + j * 20} l-4 10"/>`).join("")).join("")}</g></g>
    <path d="M90 14 V136 M14 75 H166" stroke="#8E5A2E" stroke-width="6"/></svg>`,
  w3_globe: `<svg viewBox="0 0 200 200" aria-hidden="true"><defs><radialGradient id="w3gGlobe" cx=".4" cy=".35" r=".7"><stop offset="0" stop-color="#5DB5DE"/><stop offset="1" stop-color="#22648C"/></radialGradient></defs>
    <circle cx="100" cy="100" r="98" fill="url(#w3gGlobe)"/><g fill="#6DB85A" opacity=".9"><path d="M40 50 Q70 30 92 48 Q100 70 78 80 Q60 96 44 84 Q28 70 40 50Z"/><path d="M112 40 Q150 34 168 60 Q160 84 136 82 Q118 70 112 40Z"/><path d="M96 104 Q130 98 150 120 Q146 150 120 166 Q98 150 96 104Z"/><path d="M30 112 Q52 108 60 128 Q50 146 34 138Z"/></g>
    <circle cx="100" cy="100" r="98" fill="none" stroke="#FFF3C4" stroke-width="2" opacity=".5"/></svg>`,
  w3_house: `<svg viewBox="0 0 120 110" aria-hidden="true"><path d="M8 50 L60 8 L112 50Z" fill="#8C5C4A"/><rect x="18" y="50" width="84" height="58" fill="#D9C7AE"/><rect x="50" y="72" width="20" height="36" rx="3" fill="#6E4428"/><rect x="26" y="62" width="18" height="16" rx="2" fill="#9FB4C0"/><rect x="76" y="62" width="18" height="16" rx="2" fill="#9FB4C0"/></svg>`
});

/* ============ ИКОНКИ 48×48 ============ */
const W3_STAR8 = (cx, cy, r, fill, stroke, sw) => {
  const sq = rot => `<rect x="${cx - r}" y="${cy - r}" width="${2 * r}" height="${2 * r}" rx="${r * 0.12}" transform="rotate(${rot} ${cx} ${cy})"`;
  return `${sq(0)} fill="none" stroke="${stroke}" stroke-width="${sw}"/>${sq(45)} fill="none" stroke="${stroke}" stroke-width="${sw}"/>${sq(0)} fill="${fill}"/>${sq(45)} fill="${fill}"/>`;
};
Object.assign(ICON, {
  w3_iman: W3_STAR8(24, 24, 14, "#F5C451", "#B9802A", 3) + '<circle cx="24" cy="24" r="7" fill="#1F5B74"/><circle cx="24" cy="24" r="3" fill="#FFE7A0"/>',
  w3_angels: '<g stroke="#F5C451" stroke-width="2.5" stroke-linecap="round"><path d="M24 4 V10 M10 9 L14 14 M38 9 L34 14 M4 20 H10 M44 20 H38"/></g><path d="M24 20 Q16 15 6 17 V40 Q16 38 24 42 Q32 38 42 40 V17 Q32 15 24 20Z" fill="#FFF8EA" stroke="#2D6A57" stroke-width="2.5"/><path d="M24 20 V42" stroke="#2D6A57" stroke-width="2"/><path d="M10 26 q3 -2.5 6 0 t6 0 M27 26 q3 -2.5 6 0 t6 0 M10 32 q3 -2.5 6 0 t6 0" stroke="#E6A93A" stroke-width="2.2" fill="none" stroke-linecap="round"/>',
  w3_books: '<rect x="8" y="34" width="32" height="8" rx="2" fill="#8E5A2E"/><rect x="11" y="26" width="28" height="8" rx="2" fill="#2F6E8E"/><rect x="7" y="18" width="30" height="8" rx="2" fill="#6A4C93"/><rect x="10" y="9" width="30" height="9" rx="2" fill="#1F6E58"/><path d="M14 13.5 H36" stroke="#F5C451" stroke-width="2"/>',
  w3_prophets: '<path d="M17 44 L19 22 H29 L31 44Z" fill="#CDBB98"/><rect x="15" y="18" width="18" height="5" rx="1.5" fill="#8E7A5A"/><path d="M24 2 Q32 9 30 15 H18 Q16 9 24 2Z" fill="#FFB238"/><path d="M24 7 Q28 11 27 15 H21 Q20 11 24 7Z" fill="#FFF0B0"/><path d="M33 12 L44 8 M33 16 L45 16" stroke="#F5C451" stroke-width="2.2" stroke-linecap="round"/>',
  w3_lastday: '<path d="M24 8 V40" stroke="#B9802A" stroke-width="3"/><path d="M14 44 H34" stroke="#B9802A" stroke-width="4" stroke-linecap="round"/><path d="M6 14 L42 10" stroke="#E6A93A" stroke-width="3.5" stroke-linecap="round"/><path d="M6 14 L1 28 H13Z M42 10 L37 24 H47Z" fill="none" stroke="#B9802A" stroke-width="1.5"/><path d="M0 28 Q7 35 14 28Z M36 24 Q42 31 48 24Z" fill="#F5C451"/><circle cx="24" cy="8" r="3.5" fill="#F5C451"/>',
  w3_qadar: '<path d="M24 8 Q6 8 4 26 Q9 22 14 26 Q19 22 24 26 Q29 22 34 26 Q39 22 44 26 Q42 8 24 8Z" fill="#5BA9C9"/><path d="M24 8 Q16 14 14 26 M24 8 Q32 14 34 26" stroke="#3C88AE" stroke-width="1.5" fill="none"/><path d="M24 26 V40 Q24 44 20 44 Q16 44 16 40" stroke="#4F6F7C" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M8 34 l-2 5 M40 32 l-2 5 M34 40 l-2 5" stroke="#6BC0E6" stroke-width="2.5" stroke-linecap="round"/>',
  w3_fire: '<path d="M24 6 Q36 20 34 30 Q32 40 24 40 Q16 40 14 30 Q12 20 24 6Z" fill="#F07A3A"/><path d="M24 18 Q30 26 29 33 Q28 38 24 38 Q20 38 19 33 Q18 26 24 18Z" fill="#FFB238"/><rect x="8" y="38" width="32" height="6" rx="3" fill="#8E5A2E" transform="rotate(8 24 41)"/><rect x="8" y="38" width="32" height="6" rx="3" fill="#7A4A24" transform="rotate(-8 24 41)"/>',
  w3_taurat: '<rect x="9" y="8" width="30" height="34" rx="3" fill="#8E5A2E"/><rect x="9" y="8" width="6" height="34" rx="2" fill="#6E4428"/><rect x="19" y="14" width="15" height="8" rx="1.5" fill="none" stroke="#F5C451" stroke-width="1.8"/>',
  w3_injil: '<rect x="9" y="8" width="30" height="34" rx="3" fill="#6A4C93"/><rect x="9" y="8" width="6" height="34" rx="2" fill="#523A75"/><rect x="19" y="14" width="15" height="8" rx="1.5" fill="none" stroke="#F5C451" stroke-width="1.8"/>',
  w3_quran: '<rect x="9" y="8" width="30" height="34" rx="3" fill="#1F6E58"/><rect x="9" y="8" width="6" height="34" rx="2" fill="#16503F"/>' + W3_STAR8(27, 25, 6, "#F5C451", "#F5C451", 0.1) + '<circle cx="27" cy="25" r="2.6" fill="#1F6E58"/>',
  w3_dust: '<circle cx="24" cy="24" r="17" fill="none" stroke="#C9D8DF" stroke-width="2" stroke-dasharray="3 4"/><circle cx="24" cy="24" r="3" fill="#E6A93A"/>',
  w3_night: '<rect x="4" y="4" width="40" height="40" rx="10" fill="#1F3A55"/><path d="M28 12 a11 11 0 1 0 8 18 a9 9 0 1 1 -8 -18z" fill="#FFE29A"/><circle cx="13" cy="14" r="1.5" fill="#fff"/><circle cx="16" cy="34" r="1.2" fill="#fff"/>',
  w3_check: '<circle cx="24" cy="24" r="18" fill="#E7F3F8" stroke="#8FA9B4" stroke-width="2"/><path d="M15 25 L22 32 L34 17" stroke="#1F5B74" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>',
  w3_dots: '<circle cx="12" cy="24" r="4" fill="#8FA9B4"/><circle cx="24" cy="24" r="4" fill="#8FA9B4"/><circle cx="36" cy="24" r="4" fill="#8FA9B4"/>',
  w3_globe: '<circle cx="24" cy="24" r="17" fill="#5BA9C9"/><path d="M12 17 Q19 12 24 18 Q22 25 16 25 Q11 23 12 17Z M27 26 Q34 22 38 28 Q35 37 29 36 Q25 32 27 26Z M26 10 Q31 9 33 13 Q29 15 26 10Z" fill="#7DC46D"/>',
  w3_kaaba: '<path d="M8 16 L24 10 L40 16 V38 L24 44 L8 38Z" fill="#23272B"/><path d="M8 16 L24 22 L40 16 M24 22 V44" stroke="#3E454C" stroke-width="1.5" fill="none"/><path d="M8 22 L24 28 L40 22" stroke="#F5C451" stroke-width="3" fill="none"/>',
  w3_tablets: '<path d="M7 40 V18 a7 7 0 0 1 14 0 V40Z M27 40 V18 a7 7 0 0 1 14 0 V40Z" fill="#C3CCD1" stroke="#7E8E96" stroke-width="2"/><path d="M11 22 H17 M11 27 H17 M11 32 H17 M31 22 H37 M31 27 H37 M31 32 H37" stroke="#7E8E96" stroke-width="1.8"/>',
  w3_palm: '<path d="M24 45 Q22 33 25 20" stroke="#8E5A2E" stroke-width="3.5" fill="none" stroke-linecap="round"/><path d="M25 20 q-11 -2 -17 6 M25 20 q11 -3 17 5 M25 20 q-5 -10 -14 -10 M25 20 q6 -10 15 -8" stroke="#4E9D45" stroke-width="4" fill="none" stroke-linecap="round"/><circle cx="22.5" cy="23.5" r="2.2" fill="#8A4B1F"/><circle cx="27.5" cy="23.5" r="2.2" fill="#8A4B1F"/>',
  w3_openbook: '<path d="M24 15 Q16 9 5 11 V31 Q16 29 24 34 Q32 29 43 31 V11 Q32 9 24 15Z" fill="#1F7A5E"/><path d="M24 15 V34" stroke="#F5C451" stroke-width="2"/><path d="M9 17 H19 M9 22 H19 M29 17 H39 M29 22 H39" stroke="#BFE3D2" stroke-width="1.6"/><path d="M11 43 L37 33 M11 33 L37 43" stroke="#8E5A2E" stroke-width="3.5" stroke-linecap="round"/>'
});

/* ============ СОКРОВИЩА ============ */
ITEMS.push(
  { id: "w3_star", name: "Звезда-узор", svg: W3_STAR8(50, 50, 30, "#F5C451", "#B9802A", 4) + '<circle cx="50" cy="50" r="15" fill="#1F5B74"/><circle cx="50" cy="50" r="7" fill="#FFE7A0"/>' },
  { id: "w3_book", name: "Книга добрых дел", svg: '<g stroke="#F5C451" stroke-width="4" stroke-linecap="round"><path d="M50 4 V14 M22 12 L28 20 M78 12 L72 20"/></g><path d="M50 30 Q32 20 8 24 V82 Q32 78 50 88 Q68 78 92 82 V24 Q68 20 50 30Z" fill="#FFF8EA" stroke="#2D6A57" stroke-width="4"/><path d="M50 30 V88" stroke="#2D6A57" stroke-width="3"/><path d="M16 44 q5 -4 10 0 t10 0 M58 44 q5 -4 10 0 t10 0 M16 58 q5 -4 10 0 t10 0 M58 58 q5 -4 10 0 t10 0" stroke="#E6A93A" stroke-width="3.5" fill="none" stroke-linecap="round"/>' },
  { id: "w3_bookmark", name: "Закладка", svg: '<path d="M34 4 H66 V80 L50 68 L34 80Z" fill="#1F6E58"/><path d="M38 12 H62" stroke="#F5C451" stroke-width="3"/>' + W3_STAR8(50, 36, 9, "#F5C451", "#F5C451", 0.1) + '<path d="M50 74 V90" stroke="#E6A93A" stroke-width="3"/><circle cx="50" cy="93" r="5" fill="#E6A93A"/>' },
  { id: "w3_beacon", name: "Маячок", svg: '<circle cx="50" cy="20" r="20" fill="#FFE7A0" opacity=".45"/><path d="M34 94 L38 40 H62 L66 94Z" fill="#CDBB98"/><path d="M37 60 H63 M36 78 H64" stroke="#B5A27E" stroke-width="3"/><rect x="30" y="32" width="40" height="10" rx="3" fill="#8E7A5A"/><path d="M50 4 Q64 18 60 30 H40 Q36 18 50 4Z" fill="#FFB238"/><path d="M50 13 Q56 21 54 30 H46 Q44 21 50 13Z" fill="#FFF0B0"/>' },
  { id: "w3_scales", name: "Весы", svg: '<path d="M50 16 V84" stroke="#B9802A" stroke-width="5"/><path d="M30 90 H70" stroke="#B9802A" stroke-width="7" stroke-linecap="round"/><path d="M12 30 L88 22" stroke="#E6A93A" stroke-width="6" stroke-linecap="round"/><path d="M12 30 L2 58 H22Z M88 22 L78 50 H98Z" fill="none" stroke="#B9802A" stroke-width="2.5"/><path d="M0 58 Q12 72 24 58Z M76 50 Q88 64 100 50Z" fill="#F5C451"/><circle cx="50" cy="16" r="7" fill="#F5C451"/><circle cx="88" cy="47" r="3" fill="#FFF3C4"/>' },
  { id: "w3_umbrella", name: "Зонтик", svg: '<path d="M50 10 Q12 10 6 50 Q14 44 22 50 Q30 44 38 50 Q44 44 50 50 Q56 44 62 50 Q70 44 78 50 Q86 44 94 50 Q88 10 50 10Z" fill="#5BA9C9"/><path d="M50 10 Q34 22 30 50 M50 10 Q66 22 70 50" stroke="#3C88AE" stroke-width="2.5" fill="none"/><path d="M50 50 V82 Q50 92 40 92 Q32 92 32 84" stroke="#4F6F7C" stroke-width="5" fill="none" stroke-linecap="round"/><circle cx="50" cy="8" r="4" fill="#F5C451"/>' }
);

/* ============ СТИЛИ ============ */
addCSS(`
.w3-orbit { position: absolute; pointer-events: none; z-index: 8; }
.w3-orbit svg { width: 100%; height: 100%; display: block; overflow: visible; }
.w3-orbit .bg { fill: none; stroke: rgba(255,255,255,.85); stroke-width: 5; stroke-dasharray: 2 12; stroke-linecap: round; }
.w3-orbit .pr { fill: none; stroke: #F5C451; stroke-width: 9; stroke-linecap: round; filter: drop-shadow(0 0 6px rgba(245,196,81,.9)); }
.w3-orbspin { position: absolute; inset: 0; animation: spin 2.6s linear infinite; }
.w3-orbspin i { position: absolute; left: 50%; top: 8px; width: 24px; height: 24px; translate: -50% -50%; border-radius: 50%; background: #FFF3C4; box-shadow: 0 0 16px #FFD978, 0 0 0 5px rgba(255,231,160,.45); }
.w3-cand { filter: drop-shadow(0 10px 14px rgba(20,40,50,.18)); transition: transform .9s ease; }
.w3-fl { transform-box: fill-box; transform-origin: 50% 100%; animation: w3flick .32s ease-in-out infinite alternate; }
@keyframes w3flick { from { transform: scale(1, .92) skewX(-2deg); } to { transform: scale(.96, 1.05) skewX(2deg); } }
.w3-rock { position: absolute; width: 16px; height: 12px; border-radius: 45% 55% 40% 50%; background: #7E8E96; translate: -50% -50%; pointer-events: none; z-index: 6; }
.w3-leaf { position: absolute; width: 14px; height: 14px; border-radius: 0 70% 0 70%; translate: -50% -50%; pointer-events: none; z-index: 6; }
.w3-smoke { position: absolute; width: 34px; height: 34px; border-radius: 50%; translate: -50% -50%; pointer-events: none; z-index: 6; background: radial-gradient(circle, rgba(120,130,140,.65), rgba(120,130,140,0) 70%); }

.w3-sway, .w3-wave { transform-box: fill-box; }
.w3-sway { transform-origin: 50% 100%; }
.w3-wave { transform-origin: 0% 50%; }
.w3-spin { transform-box: fill-box; transform-origin: 50% 50%; }
.w3-wthing { touch-action: none; cursor: pointer; }
.w3-wthing.w3-windy .w3-sway { animation: w3sway .42s ease-in-out infinite alternate; }
.w3-wthing.w3-windy .w3-spin { animation: spin .32s linear infinite; }
.w3-wthing.w3-windy .w3-wave { animation: w3wave .22s ease-in-out infinite alternate; }
@keyframes w3sway { from { transform: rotate(-7deg); } to { transform: rotate(7deg); } }
@keyframes w3wave { from { transform: skewY(-12deg) scaleX(.9); } to { transform: skewY(10deg) scaleX(1.05); } }
.w3-flyleaf { position: absolute; width: 10px; height: 10px; border-radius: 0 70% 0 70%; background: #6DBE59; pointer-events: none; z-index: 7; }

.w3-ln { stroke: #E6A93A; stroke-width: 4.5; stroke-dasharray: 1; stroke-dashoffset: 1; opacity: 0; transition: stroke-dashoffset 1s ease, opacity .2s; }
.w3-ln.on { stroke-dashoffset: 0; opacity: 1; filter: drop-shadow(0 0 4px rgba(255,200,80,.95)); }
.w3-bookobj { filter: drop-shadow(0 14px 20px rgba(10,20,40,.35)); }
.obj.w3-card { display: flex; align-items: center; justify-content: center; text-align: center; padding: 8px 12px; border-radius: 20px; background: var(--cream);
  color: var(--ink); font-weight: 900; font-size: 17px; line-height: 1.2; box-shadow: 0 5px 0 #E3D3AE, 0 12px 20px -10px rgba(0,0,0,.45); touch-action: none; cursor: pointer; transition: opacity .3s, box-shadow .25s; }
.obj.w3-card.w3-reading { box-shadow: 0 5px 0 #E3D3AE, 0 0 0 4px var(--gold), 0 12px 20px -10px rgba(0,0,0,.45); }
.obj.w3-card.w3-off { opacity: .45; background: #F1E3DF; }

.w3-wallbg { position: absolute; inset: 0; background: linear-gradient(180deg, #EAD8B6 0%, #E2CCA2 70%, #B98A58 70.2%, #A2744A 100%); }
.obj.w3-bk { display: flex; align-items: center; justify-content: center; border-radius: 6px 14px 14px 6px; color: #FFF3D6; font-weight: 900; font-size: 18px; letter-spacing: .3px;
  box-shadow: inset 12px 0 0 rgba(0,0,0,.22), inset 0 0 0 3px rgba(255,231,160,.45), 0 8px 14px -6px rgba(0,0,0,.45); touch-action: none; cursor: pointer; padding-left: 12px; transition: box-shadow .25s, opacity .4s, transform .5s; }
.obj.w3-bk.w3-sel { box-shadow: inset 12px 0 0 rgba(0,0,0,.22), inset 0 0 0 3px rgba(255,231,160,.45), 0 0 0 4px #FFE07A, 0 0 22px rgba(255,214,110,.9); }
.obj.w3-bk.w3-done { box-shadow: inset 12px 0 0 rgba(0,0,0,.22), inset 0 0 0 3px #F5C451, 0 0 16px rgba(255,214,110,.7); }
.obj.w3-pl { display: flex; flex-direction: column; align-items: center; justify-content: center; border-radius: 16px; background: var(--parch); color: var(--night-2);
  box-shadow: 0 4px 0 #D9C59A, 0 10px 16px -8px rgba(0,0,0,.4); touch-action: none; cursor: pointer; transition: box-shadow .25s, opacity .4s; }
.obj.w3-pl small { font-size: 12px; font-weight: 800; color: var(--muted); line-height: 1; }
.obj.w3-pl b { font-size: 19px; font-weight: 900; line-height: 1.15; white-space: nowrap; }
@media (max-width: 360px) { .obj.w3-pl b { font-size: 16px; } .w3-plate { font-size: 13px; padding: 3px 7px; } .w3-plate .w3-saw { font-size: .85em; } .obj.w3-bk { font-size: 16px; } }
.obj.w3-pl.w3-done { box-shadow: 0 4px 0 #D9C59A, 0 0 0 3px var(--gold); }
.w3-saw { font-family: "Amiri", serif; font-weight: 700; color: var(--gold-3); }
.w3-lines line { stroke-linecap: round; }
.w3-lines .w3-tmp { stroke: rgba(255,255,255,.95); stroke-width: 5; stroke-dasharray: 2 9; }
.w3-lines .w3-lk { stroke: #F5C451; stroke-width: 6; filter: drop-shadow(0 0 5px rgba(245,196,81,.9)); }
.w3-lines .w3-demo { stroke: #F5C451; stroke-width: 5; stroke-dasharray: 1; stroke-dashoffset: 1; opacity: 0; transition: stroke-dashoffset .9s ease, opacity .3s; }
.w3-lines .w3-demo.on { stroke-dashoffset: 0; opacity: 1; }
.w3-dotlight { position: absolute; width: 10px; height: 10px; border-radius: 50%; translate: -50% -50%; background: #FFF3C4; box-shadow: 0 0 10px 3px rgba(255,214,110,.9); pointer-events: none; z-index: 7; }

.obj.w3-bc { touch-action: none; cursor: pointer; }
.obj.w3-bc .w3-flame { opacity: 0; transition: opacity .5s; }
.obj.w3-bc.lit .w3-flame { opacity: 1; }
.obj.w3-bc.lit > svg { filter: drop-shadow(0 0 10px rgba(255,200,90,.85)); }
.w3-badge { position: absolute; left: 50%; top: 66%; width: 32px; height: 32px; translate: -50% -50%; border-radius: 50%; background: var(--parch); display: grid; place-items: center; box-shadow: 0 2px 6px rgba(0,0,0,.35); }
.w3-badge svg { width: 26px; height: 26px; }
.w3-plate { position: absolute; left: 50%; top: 100%; translate: -50% 6px; padding: 4px 10px; border-radius: 12px; background: var(--parch); color: var(--night-2); font-weight: 900; font-size: 15px; line-height: 1.2; white-space: nowrap; box-shadow: 0 3px 0 #C9B58C; }
.obj.w3-bc.lit .w3-plate { box-shadow: 0 3px 0 #C9B58C, 0 0 0 2.5px var(--gold); }
.w3-road path { fill: none; stroke-linecap: round; }
.w3-road .w3-rd { stroke: #FFE07A; stroke-width: 5; stroke-dasharray: 1; stroke-dashoffset: 1; opacity: 0; transition: stroke-dashoffset 1.1s ease, opacity .3s; filter: drop-shadow(0 0 6px rgba(255,214,110,.95)); }
.w3-road .w3-rd.on { stroke-dashoffset: 0; opacity: 1; }
.w3-road .w3-rdx { stroke: rgba(255,243,196,.5); stroke-width: 3; stroke-dasharray: 3 9; }

.w3-pillar { position: absolute; width: 14px; translate: -50% 0; border-radius: 7px; background: linear-gradient(90deg, #B9802A, #F5C451, #B9802A); z-index: 4; }
.w3-base { position: absolute; width: 130px; height: 24px; translate: -50% -50%; border-radius: 50%; background: linear-gradient(180deg, #E6A93A, #B9802A); z-index: 4; box-shadow: 0 8px 14px -6px rgba(0,0,0,.35); }
.w3-beam { position: absolute; height: 12px; border-radius: 6px; background: linear-gradient(180deg, #FFE08A, #E6A93A 60%, #B9802A); z-index: 5; box-shadow: 0 4px 8px -2px rgba(0,0,0,.25); }
.w3-knob { position: absolute; width: 26px; height: 26px; translate: -50% -50%; border-radius: 50%; background: radial-gradient(circle at 35% 35%, #FFF3C4, #E6A93A 60%, #B9802A); z-index: 6; }
.obj.w3-pan { z-index: 5; }
.obj.w3-gauge { z-index: 5; }
.obj.w3-bub { display: grid; place-items: center; text-align: center; padding: 12px; border-radius: 50%; color: #12425A; font-weight: 900; font-size: 14px; line-height: 1.15; touch-action: none; cursor: pointer;
  background: radial-gradient(circle at 30% 26%, rgba(255,255,255,.98) 0 7%, rgba(255,255,255,.35) 8%, rgba(214,238,252,.55) 55%, rgba(150,205,240,.7) 100%);
  box-shadow: inset 0 0 0 2.5px rgba(255,255,255,.85), inset -6px -8px 14px rgba(120,180,230,.35), 0 8px 16px -8px rgba(0,0,0,.25); }
.w3-mote { position: absolute; width: 14px; height: 14px; border-radius: 50%; translate: -50% -50%; background: #FFE07A; box-shadow: 0 0 12px 4px rgba(255,210,90,.85); pointer-events: none; z-index: 13; }
.obj.w3-dust { touch-action: none; cursor: pointer; }
.obj.w3-dust i { position: absolute; left: 50%; top: 50%; width: 9px; height: 9px; translate: -50% -50%; border-radius: 50%; background: #FFE07A; box-shadow: 0 0 10px 4px rgba(255,210,90,.9); }
.w3-loupe { position: absolute; border-radius: 50%; translate: -50% -50%; border: 5px solid #4F6F7C; background: rgba(255,255,255,.18); box-shadow: 0 0 0 3px rgba(255,255,255,.6), 0 8px 18px rgba(0,0,0,.25); pointer-events: none; z-index: 14; }
.w3-loupe::after { content: ""; position: absolute; right: -26px; bottom: -22px; width: 34px; height: 10px; border-radius: 5px; background: #4F6F7C; rotate: 40deg; }

.obj.w3-fc { display: flex; align-items: center; gap: 8px; padding: 6px 12px 6px 8px; border-radius: 16px; font-weight: 900; font-size: 15px; line-height: 1.15; pointer-events: none; box-shadow: 0 8px 16px -8px rgba(0,0,0,.45); }
.obj.w3-fc svg { flex: none; width: 30px; height: 30px; }
.obj.w3-fc.good { background: var(--cream); color: var(--ink); box-shadow: 0 0 0 3px var(--gold), 0 8px 16px -8px rgba(0,0,0,.45); }
.obj.w3-fc.bad { background: #8296A3; color: #F2F6F8; }
.obj.w3-item { touch-action: none; cursor: pointer; }
.w3-wrain { animation: w3rain .45s linear infinite; }
@keyframes w3rain { from { transform: translate(0, 0); } to { transform: translate(-8px, 20px); } }
.w3-grow { transform-box: fill-box; transform-origin: 50% 100%; animation: w3grow .9s cubic-bezier(.2,1.5,.4,1) both; }
@keyframes w3grow { from { transform: scale(0); } }
`);

/* ============ ОБЩИЕ ПОМОЩНИКИ ============ */
function w3Mix(a, b, t) {
  t = Math.max(0, Math.min(1, t));
  const p = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
  const A = p(a), B = p(b);
  return "#" + A.map((v, i) => Math.round(v + (B[i] - v) * t).toString(16).padStart(2, "0")).join("");
}
/* точка внутри SVG-элемента в координатах сцены */
function w3Pt(e) { const r = e.getBoundingClientRect(), s = stage.getBoundingClientRect(); return { x: r.left + r.width / 2 - s.left, y: r.top + r.height / 2 - s.top }; }
function w3Sparks(x, y, n = 10, d = 60) {
  for (let i = 0; i < n; i++) {
    const s = el("i", "spark"); s.style.zIndex = 15; s.style.left = x + "px"; s.style.top = y + "px";
    s.style.background = ["#FFE07A", "#FFFFFF", "#F5C451"][i % 3];
    const a = Math.random() * Math.PI * 2, r = rnd(0.4, 1) * d;
    s.animate([{ transform: "translate(-50%,-50%) scale(1)", opacity: 1 }, { transform: `translate(calc(-50% + ${Math.cos(a) * r}px), calc(-50% + ${Math.sin(a) * r}px)) scale(.3)`, opacity: 0 }],
      { duration: rnd(500, 900), easing: "cubic-bezier(.2,.8,.3,1)" }).onfinish = () => s.remove();
  }
}
function w3Stars(n, bottom = "40%") {
  const s = el("div", "layer", stage, `<svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><g class="twinkle" fill="#FFF6DD">${Array.from({ length: n }, () => `<circle cx="${rnd(0, 400).toFixed(0)}" cy="${rnd(0, 290).toFixed(0)}" r="${rnd(0.5, 1.5).toFixed(1)}"/>`).join("")}</g></svg>`);
  s.style.inset = `0 0 ${bottom} 0`; return s;
}
/* прыжок предмета по дуге в точку (x, y) */
async function w3Hop(e, x, y, ms = 650, lift = 110) {
  const x0 = e._x, y0 = e._y, top = Math.min(y0, y) - lift;
  const a = e.animate([{ left: x0 + "px", top: y0 + "px" }, { left: (x0 + x) / 2 + "px", top: top + "px", offset: 0.5 }, { left: x + "px", top: y + "px" }], { duration: ms, easing: "ease-in-out", fill: "forwards" });
  try { await a.finished; } catch (err) {}
  put(e, x, y); a.cancel();
}

/* ============ МЕХАНИКА 1: КРУГОВОЙ ЖЕСТ ============ */
/* Водить пальцем по кругу вокруг точки (cx, cy): turns оборотов. Нажатие без движения — маленький шажок.
   onP(p) получает прогресс 0..1. Если ребёнок ничего не делает, через timeout круг докрутится сам */
function w3Circle(cx, cy, R, turns, onP, timeout = 16000) {
  return new Promise(res => {
    const r = R - 8, C = 2 * Math.PI * r;
    const ring = el("div", "w3-orbit", stage, `<svg viewBox="0 0 ${2 * R} ${2 * R}" aria-hidden="true"><circle class="bg" cx="${R}" cy="${R}" r="${r}"/><circle class="pr" cx="${R}" cy="${R}" r="${r}" stroke-dasharray="${C.toFixed(1)}" stroke-dashoffset="${C.toFixed(1)}" transform="rotate(-90 ${R} ${R})"/></svg><div class="w3-orbspin"><i></i></div>`);
    Object.assign(ring.style, { left: (cx - R) + "px", top: (cy - R) + "px", width: 2 * R + "px", height: 2 * R + "px" });
    fadeIn(ring, 500);
    const pr = ring.querySelector(".pr"), need = turns * Math.PI * 2;
    const field = el("div", "tapfield"); field.style.zIndex = 9;
    let acc = 0, last = null, active = false, moved = false, fin = false, swoosh = 0;
    const ang = ev => { const p = local(ev), dx = p.x - cx, dy = p.y - cy; return Math.hypot(dx, dy) < 16 ? null : Math.atan2(dy, dx); };
    const upd = () => { if (fin) return; const p = Math.min(1, acc / need); pr.setAttribute("stroke-dashoffset", (C * (1 - p)).toFixed(1)); onP(p); if (p >= 1) end(); };
    const dn = ev => { ev.preventDefault(); active = true; moved = false; last = ang(ev); };
    const mv = ev => {
      if (!active || fin) return;
      const a = ang(ev); if (a == null) { last = null; return; }
      if (last == null) { last = a; return; }
      let d = a - last; if (d > Math.PI) d -= 2 * Math.PI; if (d < -Math.PI) d += 2 * Math.PI;
      last = a; if (Math.abs(d) < 0.004) return;
      moved = true; d = Math.min(Math.abs(d), 0.6); acc += d; swoosh += d;
      if (swoosh > 1.2) { swoosh = 0; Snd.noise({ kind: "pink", f: 500, f2: 1200, q: 0.8, dur: 0.35, gain: 0.08, attack: 0.08 }); }
      upd();
    };
    const up = () => { if (active && !moved && !fin) { acc += need / 16; Snd.tap(); upd(); } active = false; };
    function end() {
      fin = true; field.remove();
      window.removeEventListener("pointermove", mv); window.removeEventListener("pointerup", up); window.removeEventListener("pointercancel", up);
      fadeOut(ring, 400); setTimeout(res, 350);
    }
    field.addEventListener("pointerdown", dn);
    window.addEventListener("pointermove", mv); window.addEventListener("pointerup", up); window.addEventListener("pointercancel", up);
    setTimeout(async () => { while (!fin) { acc += need / 70; upd(); await sleep(45); } }, timeout);
  });
}
/* камешек катится с горы */
function w3Rock(m, S) {
  const r = el("div", "w3-rock"); const x0 = m._x + rnd(-0.15, 0.2) * S, y0 = m._y - rnd(0, 0.2) * S;
  const x1 = x0 + rnd(-0.35, 0.35) * S, y1 = m._y + S * 0.34;
  r.style.background = ["#7E8E96", "#94A3AA", "#6F7F87"][Math.floor(rnd(0, 3))];
  r.animate([{ left: x0 + "px", top: y0 + "px", rotate: "0deg" }, { left: x1 + "px", top: y1 + "px", rotate: rnd(-400, 400) + "deg" }], { duration: rnd(600, 900), easing: "cubic-bezier(.5,0,.9,.6)", fill: "forwards" })
    .onfinish = () => { Snd.thud(0.12); setTimeout(() => fadeOut(r, 600), 900); };
}
/* лист отрывается от дерева и падает на землю */
function w3LeafFall(leaf, groundY) {
  const p = w3Pt(leaf), d = el("div", "w3-leaf"); d.style.background = leaf.getAttribute("fill");
  leaf.setAttribute("opacity", "0");
  const x1 = p.x + rnd(-70, 70), y1 = groundY + rnd(-8, 8), mid = (p.x + x1) / 2 + rnd(-30, 30);
  d.animate([{ left: p.x + "px", top: p.y + "px", rotate: "0deg" }, { left: mid + "px", top: (p.y + y1) / 2 + "px", rotate: rnd(-200, 200) + "deg", offset: 0.5 }, { left: x1 + "px", top: y1 + "px", rotate: rnd(-360, 360) + "deg" }],
    { duration: rnd(1300, 1900), easing: "ease-in", fill: "forwards" }).onfinish = () => setTimeout(() => fadeOut(d, 800), 1600);
}

/* ============ ГЛАВА 1: ВЕРА В АЛЛАХА ============ */
async function chIman() {
  await toDark(); clearStage();
  sky("linear-gradient(180deg,#5FB0E2 0%,#A8DBF3 55%,#F2E6C6 100%)");
  const { W, H } = size(); clouds(2, 0.26, 0.36); hills(0.3, ["#B9D98F", "#94C46E", "#73AE57"]); vignette();
  Snd.amb("wind", 0.6); fromDark(); await sleep(300);
  await chapterTitle(null, "Вера в Аллаха", "iman_0");
  await say("iman_1");
  const S = Math.min(W * 0.62, 260), cx = W / 2, cy = H * (H < 640 ? 0.63 : 0.6), R = S * 0.62;
  const shrink = async (e, x, y) => { e.style.transform = "scale(.42)"; await move(e, x, y, 900, "ease-in-out"); };

  /* гора: тысячи лет — и она рассыпается */
  const mt = obj("w3-cand", ART.w3_mount, cx, cy, S, S * 0.75); mt.style.zIndex = 5; fadeIn(mt, 700);
  const body = mt.querySelector(".w3-mbody"), cracks = mt.querySelector(".w3-cr"), pile = mt.querySelector(".w3-pile");
  await sleep(500);
  cue("iman_2");
  let lastRock = 0;
  await w3Circle(cx, cy, R, 2, p => {
    const s = 1 - 0.62 * p;
    body.setAttribute("transform", `translate(0 ${(150 * (1 - s)).toFixed(1)}) scale(1 ${s.toFixed(3)})`);
    cracks.setAttribute("opacity", Math.min(1, p * 2.5).toFixed(2));
    pile.setAttribute("transform", `translate(100 150) scale(${(0.2 + 0.8 * p).toFixed(3)}) translate(-100 -150)`);
    if (p - lastRock > 0.06) { lastRock = p; w3Rock(mt, S); }
  });
  Snd.noise({ kind: "brown", type: "lowpass", f: 500, dur: 1.2, gain: 0.3, attack: 0.1 });
  puffs(mt._x - S * 0.2, mt._y + S * 0.3, 5, -50); puffs(mt._x + S * 0.2, mt._y + S * 0.3, 5, 50);
  await sleep(700);
  await say("iman_3");
  shrink(mt, W * 0.2, H * 0.8);

  /* костёр: дрова сгорают — огонь гаснет */
  const fw = S * 0.8, fire = obj("w3-cand", ART.w3_fire, cx, cy, fw, fw * 130 / 120); fire.style.zIndex = 5; fadeIn(fire, 700);
  const flw = fire.querySelector(".w3-flw"), glow = fire.querySelector(".w3-glow"), logs = [...fire.querySelectorAll(".w3-logs rect")];
  const crackle = setInterval(() => Snd.noise({ type: "highpass", f: 2500, dur: 0.03, gain: 0.12, attack: 0.002 }), 260);
  await sleep(500);
  cue("iman_4");
  await w3Circle(cx, cy, R * 0.92, 2, p => {
    const s = Math.max(0.001, 1 - p);
    flw.setAttribute("transform", `translate(60 104) scale(${s.toFixed(3)}) translate(-60 -104)`);
    glow.setAttribute("opacity", (1 - p).toFixed(2));
    logs.forEach((r, i) => r.setAttribute("fill", w3Mix(i ? "#7A4A24" : "#8E5A2E", "#56514D", p)));
  });
  clearInterval(crackle);
  Snd.noise({ kind: "pink", type: "highpass", f: 1800, dur: 0.9, gain: 0.12, attack: 0.05 });
  for (let i = 0; i < 6; i++) {
    const sm = el("div", "w3-smoke"); const x = fire._x + rnd(-10, 10), y = fire._y + fw * 0.2;
    sm.animate([{ left: x + "px", top: y + "px", transform: "scale(.6)", opacity: .9 }, { left: (x + rnd(-30, 30)) + "px", top: (y - fw * 0.9) + "px", transform: "scale(2.2)", opacity: 0 }], { duration: 2200, delay: i * 260, easing: "ease-out", fill: "backwards" }).onfinish = () => sm.remove();
  }
  await sleep(900);
  await say("iman_5");
  shrink(fire, W * 0.8, H * 0.8);

  /* дерево: осень — листья опадают */
  const tw = S * 0.89, tree = obj("w3-cand", ART.w3_tree, cx, cy - S * 0.05, tw, S); tree.style.zIndex = 5; fadeIn(tree, 700);
  const groundY = tree._y + S * 0.48;
  const leaves = [...tree.querySelectorAll(".w3-lf")]; leaves.forEach(l => { l._t = rnd(0, 0.72); });
  await sleep(500);
  cue("iman_6");
  await w3Circle(cx, cy, R, 2, p => {
    leaves.forEach(l => {
      if (l._gone) return;
      const k = (p - l._t) / 0.2;
      if (k <= 0) return;
      if (k < 1) l.setAttribute("fill", k < 0.5 ? w3Mix("#5DAE4F", "#E8C547", k * 2) : w3Mix("#E8C547", "#E0893C", k * 2 - 1));
      else { l._gone = true; w3LeafFall(l, groundY); }
    });
    if (Math.random() < 0.08) Snd.noise({ kind: "pink", type: "highpass", f: 3000, dur: 0.25, gain: 0.06 });
  });
  leaves.forEach(l => { if (!l._gone) { l._gone = true; w3LeafFall(l, groundY); } });
  await sleep(1400);
  await say("iman_7");
  shrink(tree, W * 0.5, H * 0.78);
  await sleep(600);

  await say("iman_8");
  await say("iman_9");
  const misses = await choice("iman_q", [{ id: "iman_qa", icon: ICON.mountain }, { id: "iman_qb", icon: ICON.w3_fire }, { id: "iman_qc", ar: true, ok: true }], "iman_q_ok");
  await say("iman_quran");
  await ayahCard("42:11");
  await say("iman_end", { btn: "Аллаху Акбар" });
  hideCap(); await award("w3_star");
  return misses;
}

/* ============ ГЛАВА 2: АНГЕЛЫ ============ */
/* Поймать невидимый ветер: он перебегает от предмета к предмету, нажать туда, где сейчас качается */
function w3CatchWind(things, need, timeout = 26000) {
  const { H } = size();
  return new Promise(res => {
    let k = 0, fin = false, cur = null, prev = null, timer = null;
    const note = () => { capNote.textContent = `Ветер пойман: ${k} из ${need}`; };
    const go = () => {
      if (fin) return;
      if (cur) cur.classList.remove("w3-windy");
      const opts = things.filter(t => t !== cur && t !== prev);
      cur = opts[Math.floor(Math.random() * opts.length)]; prev = null;
      cur.classList.add("w3-windy");
      Snd.noise({ kind: "pink", f: 380, f2: 900, q: 0.6, dur: 1.5, gain: 0.16, attack: 0.4 });
      windLines(3, Math.max(0.3, cur._y / H - 0.08), cur._y / H + 0.02);
      for (let i = 0; i < 3; i++) {
        const lf = el("div", "w3-flyleaf"); const x = cur._x + rnd(-20, 20), y = cur._y - rnd(0, 30);
        lf.animate([{ left: x + "px", top: y + "px", rotate: "0deg", opacity: 1 }, { left: (x + rnd(80, 160)) + "px", top: (y + rnd(-40, 20)) + "px", rotate: rnd(200, 500) + "deg", opacity: 0 }], { duration: 1300, delay: i * 200, easing: "ease-out", fill: "backwards" }).onfinish = () => lf.remove();
      }
      timer = setTimeout(go, k < 2 ? 2700 : 2100);
    };
    const end = () => { fin = true; clearTimeout(timer); things.forEach(t => { t.onpointerdown = null; t.classList.remove("w3-windy"); }); setTimeout(res, 700); };
    things.forEach(t => {
      t.onpointerdown = ev => {
        ev.preventDefault(); if (fin) return;
        if (t === cur) {
          k++; clearTimeout(timer); t.classList.remove("w3-windy"); prev = t; cur = null;
          Snd.sparkle(); w3Sparks(t._x, t._y - 20, 12, 70); note();
          const g = glowSpot(t._x, t._y, 80); g.style.zIndex = 4; setTimeout(() => fadeOut(g, 500), 600);
          if (k >= need) end(); else timer = setTimeout(go, 800);
        } else { Snd.tap(); t.classList.remove("wob"); void t.offsetWidth; t.classList.add("wob"); }
      };
    });
    note(); go();
    setTimeout(async () => { while (!fin) { if (cur) cur.onpointerdown({ preventDefault() {} }); await sleep(900); } }, timeout);
  });
}
/* Выбрать доброе дело из двух карточек: доброе улетает в книгу, и там загорается строка */
async function w3PickDeeds(pairs, lines, badId) {
  const { W, H } = size();
  const cw = Math.min((W - 40) / 2, 190), chh = 92, y = H * 0.85;
  for (let i = 0; i < pairs.length; i++) {
    const [g, b] = pairs[i], gl = Math.random() < 0.5;
    const xs = [W / 2 - cw / 2 - 6, W / 2 + cw / 2 + 6];
    const mk = (id, x) => { const c = obj("w3-card", `<span>${L(id).replace(/\.$/, "")}</span>`, x, y, cw, chh); c.style.zIndex = 9; fadeIn(c, 400); return c; };
    const cg = mk(g, xs[gl ? 0 : 1]), cb = mk(b, xs[gl ? 1 : 0]);
    cg.dataset.good = "1";
    let picked = false, stopRead = false;
    (async () => {
      await sleep(350);
      for (const [c, id] of gl ? [[cg, g], [cb, b]] : [[cb, b], [cg, g]]) {
        if (stopRead) return;
        c.classList.add("w3-reading"); await Voice.speak(id); c.classList.remove("w3-reading");
      }
    })();
    await new Promise(r => {
      const pick = () => { if (picked) return; picked = true; cg.onpointerdown = cb.onpointerdown = null; r(); };
      cg.onpointerdown = ev => { ev.preventDefault(); pick(); };
      cb.onpointerdown = ev => {
        ev.preventDefault(); if (picked || cb._off) return;
        cb._off = true; stopRead = true; cb.classList.remove("w3-reading"); cb.classList.add("w3-off", "wob");
        Snd.thud(0.3); capNote.textContent = L(badId); Voice.speak(badId); cg.classList.add("hint");
      };
      setTimeout(pick, 22000);
    });
    stopRead = true;
    [cg, cb].forEach(c => c.classList.remove("w3-reading", "hint"));
    capNote.textContent = ""; Snd.tap(); Voice.speak(g);
    fadeOut(cb, 300);
    const t = w3Pt(lines[i]);
    cg.animate([{ transform: "scale(1)", opacity: 1 }, { transform: "scale(.25)", opacity: 0.2 }], { duration: 650, easing: "ease-in", fill: "forwards" });
    await move(cg, t.x, t.y, 650, "ease-in");
    cg.remove();
    lines[i].classList.add("on"); Snd.sparkle(); w3Sparks(t.x, t.y, 12, 50);
    await sleep(1200);
  }
}
async function chAngels() {
  await toDark(); clearStage();
  sky("linear-gradient(180deg,#6CBBE8 0%,#B4E0F5 60%,#EEF7E6 100%)");
  const { W, H } = size(); clouds(3, 0.26, 0.38); hills(0.34, ["#B5DE98", "#8CCB72", "#69B65E"]); vignette();
  const things = [
    [ART.w3_treeS, 0.18, 0.6, 110, 154], [ART.w3_pin, 0.5, 0.62, 70, 122], [ART.w3_treeS, 0.82, 0.58, 110, 154],
    [ART.w3_flag, 0.3, 0.84, 64, 112], [ART.w3_bush, 0.72, 0.87, 110, 74]
  ].map(([svg, fx, fy, w, h]) => { const o = obj("w3-wthing", svg, W * fx, H * fy, w, h); o.style.zIndex = 5; return o; });
  Snd.amb("wind", 0.9); fromDark(); await sleep(300);
  await chapterTitle(null, "Ангелы", "angels_0");
  things[2].classList.add("w3-windy"); Snd.gust(2.5); windLines(6, 0.4, 0.7);
  await say("angels_1");
  things[2].classList.remove("w3-windy");

  /* поймать ветер, которого не видно */
  cue("angels_2");
  await w3CatchWind(things, 5);
  capNote.textContent = "";
  await say("angels_3");
  await say("angels_4");

  /* книга дел */
  hideCap(); await toDark(); clearStage();
  sky("linear-gradient(180deg,#22385E 0%,#46628F 55%,#B9A6C9 100%)");
  w3Stars(50, "35%");
  const glow = glowSpot(W / 2, H * 0.52, Math.min(W, H) * 0.55, "255,236,190"); glow.style.zIndex = 1; glow.style.opacity = ".5";
  const bw = Math.min(W * 0.9, 400), bh = bw * 190 / 300;
  const book = obj("w3-bookobj", ART.w3_book, W / 2, H * (H < 640 ? 0.56 : 0.53), bw, bh); book.style.zIndex = 5;
  vignette();
  Snd.amb("wind", 0.3); fromDark(); await sleep(400);
  await say("angels_5");
  cue("angels_6");
  await w3PickDeeds([["angels_g1", "angels_b1"], ["angels_g2", "angels_b2"], ["angels_g3", "angels_b3"], ["angels_g4", "angels_b4"]], [...book.querySelectorAll(".w3-ln")], "angels_bad");
  book.animate([{ filter: "drop-shadow(0 14px 20px rgba(10,20,40,.35))" }, { filter: "drop-shadow(0 0 26px rgba(255,214,110,.95))" }, { filter: "drop-shadow(0 14px 20px rgba(10,20,40,.35))" }], { duration: 1600 });
  Snd.sparkle();
  await say("angels_7");
  const misses = await choice("angels_q", [{ id: "angels_qa", icon: ICON.wind }, { id: "angels_qc", icon: ICON.w3_angels, ok: true }, { id: "angels_qb", icon: ICON.cloud }], "angels_q_ok");
  await say("angels_quran");
  await ayahCard("82:10-12");
  await say("angels_end", { btn: "Ин ша Аллах" });
  hideCap(); await award("w3_book");
  return misses;
}

/* ============ ГЛАВА 3: КНИГИ ============ */
/* Соединить пары линией: вести пальцем от книги к табличке (или нажать книгу, потом табличку) */
function w3Match(books, plates, g, noId, timeout = 40000) {
  return new Promise(res => {
    let left = books.length, fin = false, drag = null, sel = null, tmp = null;
    const NS = "http://www.w3.org/2000/svg";
    const bA = b => ({ x: b._x + b.offsetWidth / 2 - 6, y: b._y });
    const pA = p => ({ x: p._x - p.offsetWidth / 2 + 6, y: p._y });
    const line = (a, c, cls) => { const l = document.createElementNS(NS, "line"); l.setAttribute("x1", a.x); l.setAttribute("y1", a.y); l.setAttribute("x2", c.x); l.setAttribute("y2", c.y); l.setAttribute("class", cls); g.appendChild(l); return l; };
    const setSel = b => { sel = b; books.forEach(x => x.classList.toggle("w3-sel", x === b)); };
    const hit = q => plates.find(p => !p._done && Math.abs(q.x - p._x) < p.offsetWidth / 2 + 18 && Math.abs(q.y - p._y) < p.offsetHeight / 2 + 18);
    const link = (b, p) => {
      b._done = p._done = true; left--; b.classList.add("w3-done"); p.classList.add("w3-done"); p.classList.remove("hint");
      line(bA(b), pA(p), "w3-lk"); Snd.sparkle(); w3Sparks(p._x, p._y, 10, 50); Voice.speak(b._say); capNote.textContent = "";
      if (left === 0) end();
    };
    const tryLink = (b, p) => {
      if (fin || b._done || p._done) return;
      if (b._k === p._k) return link(b, p);
      b._miss = (b._miss || 0) + 1; Snd.thud(0.3); p.classList.remove("wob"); void p.offsetWidth; p.classList.add("wob");
      capNote.textContent = L(noId); Voice.speak(noId);
      if (b._miss >= 2) { const ok = plates.find(x => x._k === b._k); ok.classList.add("hint"); setTimeout(() => ok.classList.remove("hint"), 3000); }
    };
    books.forEach(b => b.onpointerdown = ev => { ev.preventDefault(); if (fin || b._done) return; Snd.tap(); drag = b; tmp = line(bA(b), local(ev), "w3-tmp"); setSel(b); });
    plates.forEach(p => p.onpointerdown = ev => { ev.preventDefault(); if (fin || p._done || !sel || drag) return; const b = sel; setSel(null); tryLink(b, p); });
    const mv = ev => { if (!drag || !tmp) return; const q = local(ev); tmp.setAttribute("x2", q.x); tmp.setAttribute("y2", q.y); };
    const up = ev => {
      if (!drag) return; const b = drag; drag = null; if (tmp) { tmp.remove(); tmp = null; }
      const p = hit(local(ev));
      if (p) { setSel(null); tryLink(b, p); }
    };
    function end() {
      fin = true; setSel(null);
      window.removeEventListener("pointermove", mv); window.removeEventListener("pointerup", up); window.removeEventListener("pointercancel", up);
      books.forEach(b => b.onpointerdown = null); plates.forEach(p => p.onpointerdown = null);
      setTimeout(res, 1400);
    }
    window.addEventListener("pointermove", mv); window.addEventListener("pointerup", up); window.addEventListener("pointercancel", up);
    setTimeout(async () => {
      while (!fin) { const b = books.find(x => !x._done); if (drag) { drag = null; if (tmp) { tmp.remove(); tmp = null; } } link(b, plates.find(p => p._k === b._k)); await sleep(900); }
    }, timeout);
  });
}
async function chBooks() {
  await toDark(); clearStage();
  el("div", "w3-wallbg");
  const { W, H } = size();
  const arches = el("div", "layer", stage, `<svg viewBox="0 0 300 120" preserveAspectRatio="xMidYMax meet" aria-hidden="true"><g fill="#D8C094" opacity=".7">${[40, 150, 260].map(x => `<path d="M${x - 26} 120 V60 Q${x - 26} 30 ${x} 22 Q${x + 26} 30 ${x + 26} 60 V120Z"/>`).join("")}</g><g fill="#F7E9CC" opacity=".8">${[40, 150, 260].map(x => `<path d="M${x - 18} 120 V64 Q${x - 18} 40 ${x} 34 Q${x + 18} 40 ${x + 18} 64 V120Z"/>`).join("")}</g></svg>`);
  arches.style.top = "8%"; arches.style.height = "22%";
  const lay = el("div", "layer w3-lines", stage, `<svg viewBox="0 0 ${W} ${H}" aria-hidden="true"><g></g></svg>`); lay.style.inset = "0"; lay.style.zIndex = 3;
  const g = lay.querySelector("g");
  vignette();
  const bw = Math.min(W * 0.36, 150), bh = 60, pw = Math.min(W * 0.38, 160), ph = 62;
  /* на низких экранах подпись выше: ряды начинаются ниже и стоят теснее */
  const top0 = H * (H < 640 ? 0.5 : 0.43), step = Math.min(H * 0.13, (H - 44 - top0) / 3);
  const rows = [0, 1, 2, 3].map(i => top0 + i * step), bx = W * 0.25, px = W * 0.75;
  const BK = [["Таурат", "#8E5A2E", "books_m1"], ["Забур", "#2F6E8E", "books_m2"], ["Инджиль", "#6A4C93", "books_m3"], ["Коран", "#1F6E58", "books_m4"]];
  const PR = ["Муса", "Дауд", "Иса", `Мухаммад <span class="w3-saw">ﷺ</span>`];
  const books = BK.map(([name, col, s], k) => { const b = obj("w3-bk", `<span>${name}</span>`, bx, rows[k], bw, bh); b.style.background = col; b.style.zIndex = 6; b._k = k; b._say = s; b.dataset.k = k; b.style.opacity = "0"; return b; });
  const plates = PR.map((n, k) => { const p = obj("w3-pl", `<small>пророк</small><b>${n}</b>`, px, rows[k], pw, ph); p.style.zIndex = 6; p._k = k; p.dataset.k = k; p.style.opacity = "0"; return p; });
  Snd.amb("wind", 0.25); fromDark(); await sleep(300);
  await chapterTitle(null, "Книги", "books_0");
  books.forEach((b, i) => setTimeout(() => { b.style.opacity = "1"; fadeIn(b); Snd.tap(); }, i * 220));
  await say("books_1");

  /* показать пары: книга — пророк */
  plates.forEach((p, i) => setTimeout(() => { p.style.opacity = "1"; fadeIn(p); }, i * 200));
  const NS = "http://www.w3.org/2000/svg", demo = [];
  const showPair = k => {
    const b = books[k], p = plates[k], l = document.createElementNS(NS, "path");
    l.setAttribute("d", `M${b._x + bw / 2 - 6} ${b._y} L${p._x - pw / 2 + 6} ${p._y}`); l.setAttribute("pathLength", "1"); l.setAttribute("class", "w3-demo");
    g.appendChild(l); demo.push(l); requestAnimationFrame(() => requestAnimationFrame(() => l.classList.add("on")));
    b.classList.add("w3-done"); p.classList.add("w3-done"); Snd.sparkle();
  };
  const timers = [1400, 4000, 6600].map((ms, k) => setTimeout(() => showPair(k), ms));
  await say("books_2");
  timers.forEach(clearTimeout); [0, 1, 2].forEach(k => { if (!books[k].classList.contains("w3-done")) showPair(k); });
  setTimeout(() => showPair(3), 900);
  await say("books_3");
  if (!books[3].classList.contains("w3-done")) showPair(3);
  await sleep(500);

  /* книги перепутались */
  hideCap();
  demo.forEach(l => { l.style.opacity = "0"; setTimeout(() => l.remove(), 600); });
  [...books, ...plates].forEach(e => e.classList.remove("w3-done"));
  await sleep(500);
  const order = [1, 3, 0, 2];   // ни одна книга не остаётся напротив своего пророка
  Snd.whoosh(0.3);
  await Promise.all(books.map((b, k) => move(b, bx, rows[order[k]], 700, "ease-in-out")));
  cue("books_4");
  await w3Match(books, plates, g, "books_no");
  await say("books_5");

  /* Коран — последняя книга, Аллах его хранит */
  hideCap();
  [...plates, ...books.slice(0, 3)].forEach(e => { e.style.opacity = "0"; });
  g.querySelectorAll("line").forEach(l => { l.style.transition = "opacity .5s"; l.style.opacity = "0"; });
  const q = books[3]; q.style.transition = "transform .9s, opacity .4s"; q.style.transform = "scale(1.35)";
  await move(q, W / 2, H * 0.47, 900, "ease-in-out");
  const qg = glowSpot(W / 2, H * 0.47, 120); qg.style.zIndex = 5; Snd.sparkle();
  await say("books_6");
  const gs = Math.min(W * 1.4, 620);
  const globe = obj("w3-globe", ART.w3_globe, W / 2, H + gs * 0.18, gs, gs); globe.style.zIndex = 2; fadeIn(globe, 900);
  cue("books_7");
  for (let i = 0; i < 40; i++) {
    const a = rnd(-Math.PI * 0.95, -Math.PI * 0.05), r = rnd(0.1, 0.47) * gs;
    const x = globe._x + Math.cos(a) * r, y = globe._y + Math.sin(a) * r;
    if (y > H - 6 || y < H * 0.62) continue;
    const d = el("div", "w3-dotlight"); d.style.left = x + "px"; d.style.top = y + "px"; fadeIn(d, 500);
    if (i % 4 === 0) Snd.noise({ f: 3000 + rnd(0, 1500), q: 12, dur: 0.15, gain: 0.05 });
    await sleep(110);
  }
  await sleep(1800);
  const misses = await choice("books_q", [{ id: "books_qa", icon: ICON.w3_taurat }, { id: "books_qb", icon: ICON.w3_injil }, { id: "books_qc", icon: ICON.w3_quran, ok: true }], "books_q_ok");
  await say("books_quran");
  await ayahCard("3:3");
  await say("books_end", { btn: "Ин ша Аллах" });
  hideCap(); await award("w3_bookmark");
  return misses;
}

/* ============ ГЛАВА 4: ПРОРОКИ ============ */
/* Ждём нажатия на нужный маяк. Неверный — объяснение; через 9 с нужный маяк подсвечивается сам */
function w3FindTap(target, all, onWrong, timeout = 24000) {
  return new Promise(res => {
    let fin = false;
    const hintT = setTimeout(() => target.classList.add("hint"), 9000);
    const end = () => { if (fin) return; fin = true; clearTimeout(hintT); all.forEach(b => b.onpointerdown = null); target.classList.remove("hint"); res(); };
    all.forEach(b => { if (!b._lit) b.onpointerdown = ev => { ev.preventDefault(); if (fin) return; if (b === target) end(); else onWrong(b); }; });
    setTimeout(end, timeout);
  });
}
async function chProphets() {
  await toDark(); clearStage();
  sky("linear-gradient(180deg,#0E2338 0%,#1C4462 55%,#3D6A80 100%)");
  const { W, H } = size(); w3Stars(55, "45%"); hills(0.4, ["#3C5E5E", "#2F4F50", "#233F42"]);
  const road = el("div", "layer w3-road", stage, `<svg viewBox="0 0 ${W} ${H}" aria-hidden="true"></svg>`); road.style.inset = "0"; road.style.zIndex = 3;
  const rsvg = road.querySelector("svg");
  vignette();
  const P = [["Адам", ICON.w3_globe], ["Нух", ICON.ship], ["Ибрахим", ICON.w3_kaaba], ["Муса", ICON.w3_tablets], ["Иса", ICON.w3_palm], [`Мухаммад <span class="w3-saw">ﷺ</span>`, ICON.w3_openbook]];
  const small = H < 640, r1 = small ? 0.55 : 0.47, r2 = small ? 0.8 : 0.75, c1 = W < 360 ? 0.16 : 0.18;
  const slots = [[c1, r1], [0.5, r1], [1 - c1, r1], [c1, r2], [0.5, r2], [1 - c1, r2]];
  let perm = [0, 1, 2, 3, 4, 5];
  /* порядок на карте случайный, но последний маяк — в нижнем ряду: под ним пустой кружок «в конце дороги» */
  do { perm = perm.sort(() => Math.random() - 0.5); } while (perm.slice(0, 3).every((v, i) => v === i) || perm[5] < 3);
  const bw = small ? 48 : 56, bh = small ? 72 : 84;
  const beacons = P.map(([name, icon], k) => {
    const [fx, fy] = slots[perm[k]];
    const b = obj("w3-bc", `${ART.w3_beacon}<span class="w3-badge"><svg viewBox="0 0 48 48" aria-hidden="true">${icon}</svg></span><span class="w3-plate">${name}</span>`, W * fx, H * fy - 16, bw, bh);
    b.style.zIndex = 5; b._k = k; b.dataset.ord = k;
    /* табличка у края экрана сдвигается внутрь, чтобы имя не обрезалось */
    const pl = b.querySelector(".w3-plate"), half = pl.offsetWidth / 2;
    const shift = Math.min(0, W - 6 - (b._x + half)) || Math.max(0, 6 - (b._x - half));
    if (shift) pl.style.translate = `calc(-50% + ${shift.toFixed(0)}px) 6px`;
    return b;
  });
  Snd.amb("wind", 0.35); fromDark(); await sleep(300);
  await chapterTitle(null, "Пророки", "prophets_0");
  await say("prophets_1");
  await say("prophets_2");
  const NS = "http://www.w3.org/2000/svg";
  const flameAt = b => ({ x: b._x, y: b._y - bh / 2 + 10 });
  const beam = (a, c, cls) => {
    /* дуга выгибается вбок от прямой: так луч не проходит через таблички */
    const p = document.createElementNS(NS, "path"), dx = c.x - a.x, dy = c.y - a.y, d = Math.hypot(dx, dy) || 1;
    let nx = dy / d, ny = -dx / d; if (ny > 0 || (ny === 0 && nx < 0)) { nx = -nx; ny = -ny; }
    const k = Math.abs(dx) < 30 ? 0.42 : 0.25, mx = (a.x + c.x) / 2 + nx * d * k, my = (a.y + c.y) / 2 + ny * d * k;
    p.setAttribute("d", `M${a.x.toFixed(0)} ${a.y.toFixed(0)} Q${mx.toFixed(0)} ${my.toFixed(0)} ${c.x.toFixed(0)} ${c.y.toFixed(0)}`);
    p.setAttribute("pathLength", "1"); p.setAttribute("class", cls); rsvg.appendChild(p);
    requestAnimationFrame(() => requestAnimationFrame(() => p.classList.add("on")));
  };
  for (let k = 0; k < 6; k++) {
    const b = beacons[k];
    cue("prophets_p" + (k + 1));
    await w3FindTap(b, beacons, w => {
      Snd.thud(0.3); w.classList.remove("wob"); void w.offsetWidth; w.classList.add("wob");
      capNote.textContent = L("prophets_no"); Voice.speak("prophets_no");
    });
    capNote.textContent = "";
    b._lit = true; b.classList.add("lit");
    Snd.noise({ type: "highpass", f: 2200, dur: 0.12, gain: 0.3, attack: 0.002 }); Snd.sparkle();
    const f = flameAt(b), gl = glowSpot(f.x, f.y, 70); gl.style.zIndex = 4;
    if (k > 0) beam(flameAt(beacons[k - 1]), f, "w3-rd");
    w3Sparks(f.x, f.y, 10, 50);
    await sleep(1000);
  }
  await say("prophets_3");

  /* после печати пророков маяков больше нет */
  const last = flameAt(beacons[5]);
  const es = small ? 48 : 60, ex = last.x, ey = Math.min(H - es / 2 - 6, beacons[5]._y + bh / 2 + 80);
  const empty = obj("w3-empty", `<svg viewBox="0 0 60 60" aria-hidden="true"><circle cx="30" cy="30" r="24" fill="rgba(255,243,196,.08)" stroke="rgba(255,243,196,.7)" stroke-width="3" stroke-dasharray="5 6"/><text x="30" y="40" text-anchor="middle" font-family="Nunito, sans-serif" font-size="28" font-weight="900" fill="rgba(255,243,196,.75)">?</text></svg>`, ex, ey, es, es);
  empty.style.zIndex = 5; fadeIn(empty, 600);
  const ln = document.createElementNS(NS, "path"); ln.setAttribute("d", `M${last.x} ${beacons[5]._y + bh / 2 + 40} L${ex} ${ey - 30}`); ln.setAttribute("class", "w3-rdx"); rsvg.appendChild(ln);
  cue("prophets_4");
  await tapOnce(empty, null, 15000);
  Snd.thud(0.25);
  empty.animate([{ opacity: 1 }, { opacity: 0.3 }, { opacity: 1 }, { opacity: 0.3 }, { opacity: 0.8 }], { duration: 1200 });
  await sleep(800);
  await say("prophets_5");
  const misses = await choice("prophets_q", [{ id: "prophets_qa", icon: ICON.ship }, { id: "prophets_qb", icon: ICON.w3_palm }, { id: "prophets_qc", icon: ICON.w3_openbook, ok: true }], "prophets_q_ok");
  await say("prophets_quran");
  await ayahCard("33:40");
  await say("prophets_end");
  hideCap(); await award("w3_beacon");
  return misses;
}

/* ============ ГЛАВА 5: СУДНЫЙ ДЕНЬ ============ */
/* Весы: коромысло наклоняется плавно, стрелка на шкале показывает даже маленький сдвиг */
function w3Scales(cx, py, groundY, L) {
  const { H } = size();
  const pillar = el("div", "w3-pillar"); Object.assign(pillar.style, { left: cx + "px", top: (py - 14) + "px", height: (groundY - py + 14) + "px" });
  const base = el("div", "w3-base"); Object.assign(base.style, { left: cx + "px", top: groundY + "px" });
  const beamEl = el("div", "w3-beam"); Object.assign(beamEl.style, { left: (cx - L) + "px", top: (py - 6) + "px", width: 2 * L + "px" });
  const knob = el("div", "w3-knob"); Object.assign(knob.style, { left: cx + "px", top: py + "px" });
  const panSvg = `<svg viewBox="0 0 120 90" aria-hidden="true"><path d="M60 3 L12 62 M60 3 L108 62" stroke="#8E6A2E" stroke-width="2.5"/><circle cx="60" cy="4" r="4" fill="#B9802A"/>
    <g class="w3-pg"></g><path d="M4 60 H116 Q106 88 60 88 Q14 88 4 60Z" fill="#F5C451" stroke="#B9802A" stroke-width="2.5"/><path d="M14 66 Q60 74 106 66" stroke="#FFE7A0" stroke-width="3" fill="none"/></svg>`;
  const pans = [0, 1].map(() => { const p = obj("w3-pan", panSvg, cx, py, 120, 90); return p; });
  const gauge = obj("w3-gauge", `<svg viewBox="0 0 120 70" aria-hidden="true"><path d="M8 64 A52 52 0 0 1 112 64Z" fill="#FFF8EA" stroke="#B9802A" stroke-width="3"/>
    <g stroke="#B9802A" stroke-width="2">${[-60, -40, -20, 0, 20, 40, 60].map(a => `<path d="M60 20 V28" transform="rotate(${a} 60 64)"/>`).join("")}</g>
    <path d="M60 64 L82 30" stroke="none"/><g class="w3-needle"><path d="M60 64 L60 22" stroke="#C0392B" stroke-width="3.5" stroke-linecap="round"/></g><circle cx="60" cy="64" r="5" fill="#B9802A"/></svg>`, cx, py - 46, 104, 61);
  const needle = gauge.querySelector(".w3-needle");
  let cur = 0, target = 0, alive = true;
  const apply = () => {
    const r = cur * Math.PI / 180, dx = L * Math.cos(r), dy = L * Math.sin(r);
    beamEl.style.transform = `rotate(${cur.toFixed(2)}deg)`;
    put(pans[0], cx - dx, py - dy + 43); put(pans[1], cx + dx, py + dy + 43);
    needle.setAttribute("transform", `rotate(${(cur * 3.4).toFixed(2)} 60 64)`);
  };
  const loop = () => { if (!alive) return; cur += (target - cur) * 0.08; apply(); requestAnimationFrame(loop); };
  apply(); requestAnimationFrame(loop);
  const spots = [[44, 58], [60, 56], [76, 58], [52, 49], [68, 49], [60, 42]];
  let n = 0;
  return {
    right: pans[1], gauge,
    add(deg, tiny) {
      target = Math.min(18, target + deg);
      const g = pans[1].querySelector(".w3-pg");
      if (tiny) g.insertAdjacentHTML("beforeend", `<circle cx="88" cy="58" r="3" fill="#FFF3C4"/>`);
      else { const [x, y] = spots[n % spots.length]; n++; g.insertAdjacentHTML("beforeend", `<circle cx="${x}" cy="${y}" r="7.5" fill="#FFE07A" stroke="#FFF8E0" stroke-width="2"/>`); }
    },
    stop() { alive = false; }
  };
}
/* Пузыри с добрыми делами поднимаются снизу. Лопнуть — дело летит на весы */
function w3Bubbles(deeds, onPop, timeout = 32000) {
  const { W, H } = size();
  return new Promise(res => {
    const queue = deeds.slice(), live = [];
    let fin = false, popped = 0, spawnT = 0.2, last = performance.now(), auto = false, autoT = 0;
    const spawn = () => {
      const id = queue.shift(), d = rnd(96, 108);
      const b = obj("w3-bub", `<span>${L(id).replace(/\.$/, "")}</span>`, rnd(W * 0.2, W * 0.8), H + d / 2, d, d);
      b.style.zIndex = 12; b._id = id; b._vy = H * rnd(0.075, 0.095); b._ph = rnd(0, 6); b._x0 = b._x; b.dataset.deed = id;
      fadeIn(b, 400); live.push(b);
      b.onpointerdown = ev => { ev.preventDefault(); pop(b); };
    };
    const pop = b => {
      if (b._gone || fin) return; b._gone = true; live.splice(live.indexOf(b), 1); popped++;
      b.onpointerdown = null; Snd.pop();
      b.animate([{ transform: "scale(1)", opacity: 1 }, { transform: "scale(1.35)", opacity: 0 }], { duration: 220, fill: "forwards" }).onfinish = () => b.remove();
      onPop(b._id, b._x, b._y);
      if (popped >= deeds.length) { fin = true; setTimeout(res, 1500); }
    };
    const loop = t => {
      if (fin) return;
      const dt = Math.min(0.05, (t - last) / 1000); last = t;
      spawnT -= dt;
      if (spawnT <= 0 && queue.length && live.length < 3) { spawn(); spawnT = auto ? 0.6 : 1.6; }
      live.slice().forEach(b => {
        b._y -= b._vy * dt; put(b, b._x0 + Math.sin(t / 700 + b._ph) * 14, b._y);
        if (b._y < H * 0.36) { b._gone = true; b.onpointerdown = null; live.splice(live.indexOf(b), 1); queue.push(b._id); fadeOut(b, 300); }
      });
      if (auto) { autoT -= dt; if (autoT <= 0 && live.length && live[0]._y < H * 0.9) { autoT = 0.7; pop(live[0]); } }
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
    setTimeout(() => { auto = true; }, timeout);
  });
}
async function chLastday() {
  await toDark(); clearStage();
  sky("linear-gradient(180deg,#7DB6E0 0%,#C9D9EC 45%,#F7D6B8 75%,#FCEBD0 100%)");
  const { W, H } = size(); clouds(2, 0.26, 0.34); hills(0.22, ["#C9DEA6", "#A9CF8A", "#8BBE73"]); vignette();
  const L0 = Math.min(W * 0.34, 150), cx = W / 2, py = H * (H < 640 ? 0.6 : 0.5), groundY = H * (H < 640 ? 0.9 : 0.87);
  const sc = w3Scales(cx, py, groundY, L0);
  Snd.amb("meadow", 0.6); fromDark(); await sleep(300);
  await chapterTitle(null, "Судный день", "lastday_0");
  await say("lastday_1");

  /* лопать пузыри с добрыми делами */
  cue("lastday_2");
  let onPan = 0;
  await w3Bubbles(["lastday_d1", "lastday_d2", "lastday_d3", "lastday_d4", "lastday_d5", "lastday_d6"], (id, x, y) => {
    Voice.speak(id);
    const m = el("div", "w3-mote"), t = sc.right;
    m.animate([{ left: x + "px", top: y + "px" }, { left: t._x + "px", top: (t._y + 6) + "px" }], { duration: 700, easing: "ease-in", fill: "forwards" }).onfinish = () => {
      m.remove(); sc.add(2.5); onPan++; Snd.thud(0.2); Snd.sparkle(); w3Sparks(t._x, t._y + 10, 8, 40);
      capNote.textContent = `Добрых дел на весах: ${onPan}`;
    };
  });
  capNote.textContent = "";
  await say("lastday_3");

  /* пылинка: самое маленькое доброе дело */
  const dust = obj("w3-dust", "<i></i>", W * 0.5, H * 0.79, 70, 70); dust.style.zIndex = 12; fadeIn(dust, 500);
  cue("lastday_4");
  await tapOnce(dust, null, 15000);
  hideCap(); Snd.sparkle();
  const t = sc.right;
  await move(dust, t._x, t._y + 6, 900, "ease-in");
  dust.remove(); sc.add(1.6, true); Snd.tap();
  const loupe = el("div", "w3-loupe"); Object.assign(loupe.style, { left: sc.gauge._x + "px", top: (sc.gauge._y + 4) + "px", width: "120px", height: "120px" }); fadeIn(loupe, 500);
  w3Sparks(sc.gauge._x, sc.gauge._y, 10, 50);
  await sleep(1400);
  await say("lastday_5");
  fadeOut(loupe, 500);
  await say("lastday_6");
  const misses = await choice("lastday_q", [{ id: "lastday_qa", icon: ICON.w3_dust }, { id: "lastday_qb", icon: ICON.w3_night }, { id: "lastday_qc", icon: ICON.w3_lastday, ok: true }], "lastday_q_ok");
  await say("lastday_quran");
  await ayahCard("99:7-8");
  await say("lastday_end", { btn: "Ин ша Аллах" });
  hideCap(); sc.stop(); await award("w3_scales");
  return misses;
}

/* ============ ГЛАВА 6: ПРЕДОПРЕДЕЛЕНИЕ ============ */
/* Ловить корзинкой падающие карточки: корзинка едет за пальцем */
function w3Catch(basket, goods, bads, need, timeout = 36000) {
  const { W, H } = size();
  return new Promise(res => {
    let fin = false, got = 0, tx = basket._x, last = performance.now(), spawnT = 0.3, k = 0, auto = false, down = false;
    const cards = [], gq = goods.slice(), bq = bads.slice(), cw = Math.min(W * 0.44, 176);
    const pattern = [1, 0, 1, 1, 0, 1, 0, 1];
    const field = el("div", "tapfield"); field.style.zIndex = 9;
    const aim = ev => { tx = Math.max(60, Math.min(W - 60, local(ev).x)); };
    field.addEventListener("pointerdown", ev => { down = true; aim(ev); });
    field.addEventListener("pointermove", ev => { if (down || ev.pointerType === "mouse") aim(ev); });
    const up = () => { down = false; }; window.addEventListener("pointerup", up); window.addEventListener("pointercancel", up);
    const note = () => { capNote.textContent = `Поймано: ${got} из ${need}`; };
    const sun = '<svg viewBox="0 0 48 48" aria-hidden="true">' + ICON.sunc + '</svg>';
    const storm = '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M12 30 Q4 30 5 23 Q6 17 13 18 Q14 9 24 9 Q33 8 36 16 Q44 16 43 24 Q43 30 35 30Z" fill="#5E7180"/><path d="M24 30 L19 39 H25 L21 46" stroke="#F5C451" stroke-width="2.5" fill="none" stroke-linejoin="round"/></svg>';
    const spawn = () => {
      const good = pattern[k % pattern.length] === 1; k++;
      const q = good ? gq : bq, id = q.shift(); q.push(id);
      const c = obj("w3-fc " + (good ? "good" : "bad"), `${good ? sun : storm}<span>${L(id).replace(/\.$/, "")}</span>`, rnd(W * 0.22, W * 0.78), H * (H < 640 ? 0.42 : 0.33), cw, 56);
      c._good = good; c._id = id; c._vy = H * rnd(0.14, 0.17); c.style.zIndex = 8; c.dataset.good = good ? "1" : "0"; fadeIn(c, 300); cards.push(c);
    };
    const catchIt = c => {
      c._hit = true; cards.splice(cards.indexOf(c), 1);
      c.animate([{ transform: "scale(1)", opacity: 1 }, { transform: "scale(.3)", opacity: 0 }], { duration: 250, fill: "forwards" }).onfinish = () => c.remove();
      if (c._good) {
        got++; note(); Snd.sparkle(); w3Sparks(basket._x, basket._y - 30, 10, 50); Voice.speak(c._id);
        basket.animate([{ transform: "translateY(0)" }, { transform: "translateY(-10px)" }, { transform: "translateY(0)" }], { duration: 300 });
        if (got >= need) finish();
      } else {
        Snd.thud(0.3); basket.classList.remove("wob"); void basket.offsetWidth; basket.classList.add("wob");
        capNote.textContent = L("qadar_bad"); Voice.speak("qadar_bad"); setTimeout(() => { if (!fin) note(); }, 2200);
      }
    };
    function finish() {
      fin = true; field.remove(); window.removeEventListener("pointerup", up); window.removeEventListener("pointercancel", up);
      cards.forEach(c => fadeOut(c, 300)); setTimeout(res, 900);
    }
    const loop = t => {
      if (fin) return;
      const dt = Math.min(0.05, (t - last) / 1000); last = t;
      spawnT -= dt; if (spawnT <= 0) { spawn(); spawnT = rnd(1.2, 1.6); }
      if (auto) { const g = cards.filter(c => c._good && !c._hit).sort((a, b) => b._y - a._y)[0]; if (g) tx = g._x; }
      put(basket, basket._x + (tx - basket._x) * Math.min(1, dt * 9), basket._y);
      cards.slice().forEach(c => {
        put(c, c._x, c._y + c._vy * dt);
        if (!c._hit && c._y > basket._y - 56 && c._y < basket._y + 6 && Math.abs(c._x - basket._x) < 72) catchIt(c);
        else if (c._y > H + 40) { cards.splice(cards.indexOf(c), 1); c.remove(); }
      });
      requestAnimationFrame(loop);
    };
    note(); requestAnimationFrame(loop);
    setTimeout(() => { auto = true; }, timeout);
    setTimeout(() => { if (!fin) finish(); }, timeout + 25000);
  });
}
async function chQadar() {
  await toDark(); clearStage();
  const { W, H } = size();
  el("div", "room", stage, `<div class="wall"></div><div class="floor"></div>`);
  const ww = Math.min(W * 0.5, 220), win = obj("w3-window", ART.w3_win, W / 2, H * 0.42, ww, ww * 150 / 180); win.style.zIndex = 2;
  const basket = obj("w3-basket", ART.w3_basket, W / 2, H * 0.64, 130, 98); basket.style.zIndex = 6;
  const items = [[ART.blanket, 0.15, 84, 42], [ART.w3_apple, 0.38, 58, 58], [ART.w3_water, 0.62, 40, 70], [ART.w3_ball, 0.85, 58, 58]]
    .map(([svg, fx, w, h]) => { const o = obj("w3-item", svg, W * fx, H * 0.86, w, h); o.style.zIndex = 7; return o; });
  vignette();
  Snd.amb("wind", 0.2); fromDark(); await sleep(300);
  await chapterTitle(null, "Предопределение", "qadar_0");

  /* собрать корзинку для пикника */
  cue("qadar_1");
  await new Promise(r => {
    let left = items.length, fin = false;
    const done = o => {
      if (o._in || fin) return; o._in = true; o.classList.remove("hint", "tapme"); o.onpointerdown = null; Snd.tap();
      o.style.transition = "transform .6s"; o.style.transform = "scale(.45)";
      w3Hop(o, basket._x + rnd(-24, 24), basket._y - 22).then(() => { Snd.thud(0.2); o.style.zIndex = 5; basket.animate([{ transform: "scale(1)" }, { transform: "scale(1.06)" }, { transform: "scale(1)" }], { duration: 260 }); });
      if (--left === 0) { fin = true; setTimeout(r, 900); }
    };
    items.forEach(o => { o.classList.add("hint", "tapme"); o.onpointerdown = ev => { ev.preventDefault(); done(o); }; });
    setTimeout(async () => { for (const o of items) { if (fin) break; done(o); await sleep(400); } }, 18000);
  });
  await say("qadar_2", { btn: "Ин ша Аллах" });
  Snd.sparkle();

  /* ночь, а утром — дождь */
  hideCap();
  const veil = el("div", "nightveil"); veil.style.opacity = "0"; veil.style.transition = "opacity 1.5s"; veil.style.zIndex = 8;
  requestAnimationFrame(() => { veil.style.opacity = "1"; });
  win.querySelector(".w3-ws1").setAttribute("stop-color", "#0E2238"); win.querySelector(".w3-ws2").setAttribute("stop-color", "#2A4A6A");
  await sleep(2000);
  await toDark(); clearStage();
  const sk = sky("linear-gradient(180deg,#6F7F8C 0%,#9AA8B2 60%,#C2CBD0 100%)");
  hills(0.3, ["#8FA88A", "#7A9877", "#668766"]);
  const house = obj("w3-house", ART.w3_house, W * 0.18, H * 0.66, 120, 110); house.style.zIndex = 2;
  const dark = [0.15, 0.5, 0.82].map((fx, i) => { const c = el("div", "cloud dark", stage, ART.cloud); Object.assign(c.style, { left: (W * fx - 110) + "px", top: (H * (0.24 + i * 0.03)) + "px", width: "220px", height: "110px", animation: "none", zIndex: 3 }); return c; });
  const rain = el("div", "layer rain", stage, Array.from({ length: 46 }, () => `<i style="left:${rnd(0, 104).toFixed(1)}%;animation-delay:${(-rnd(0, 1)).toFixed(2)}s;animation-duration:${rnd(0.55, 0.9).toFixed(2)}s"></i>`).join(""));
  rain.style.inset = "0"; rain.style.zIndex = 4;
  vignette();
  Snd.amb("sea", 0.5); fromDark(); await sleep(500);
  await say("qadar_3");
  await say("qadar_4");

  /* поймать хорошие поступки */
  const bk = obj("w3-basket", ART.w3_basket, W / 2, H * 0.87, 120, 90); bk.style.zIndex = 9; fadeIn(bk, 400);
  cue("qadar_5");
  await w3Catch(bk, ["qadar_g1", "qadar_g2", "qadar_g3", "qadar_g4"], ["qadar_b1", "qadar_b2", "qadar_b3"], 4);
  capNote.textContent = "";
  await say("qadar_6");

  /* пикник дома, а дождь поливает сад */
  hideCap(); await toDark(); clearStage();
  el("div", "room", stage, `<div class="wall"></div><div class="floor"></div>`);
  const ww2 = Math.min(W * 0.7, 300), win2 = obj("w3-window", ART.w3_win, W / 2, H * 0.55, ww2, ww2 * 150 / 180); win2.style.zIndex = 2;
  win2.querySelector(".w3-ws1").setAttribute("stop-color", "#8A99A4"); win2.querySelector(".w3-ws2").setAttribute("stop-color", "#C3CDD3");
  win2.querySelector(".w3-wland").setAttribute("fill", "#8DB07E");
  const wr = win2.querySelector(".w3-wrain"); wr.setAttribute("opacity", "1");
  const blw = Math.min(W * 0.78, 320);
  const bl = obj("w3-blanket", ART.blanket, W / 2, H * 0.83, blw, blw / 2); bl.style.zIndex = 4;
  [[ART.w3_basket, -0.3, -0.05, 96, 72], [ART.w3_apple, 0.02, 0.0, 46, 46], [ART.w3_water, 0.2, -0.04, 32, 56], [ART.w3_ball, 0.36, 0.02, 46, 46]]
    .forEach(([svg, dx, dy, w, h]) => { const o = obj("w3-thing", svg, W / 2 + dx * blw, H * (0.8 + dy), w, h); o.style.zIndex = 5; });
  vignette();
  Snd.amb("sea", 0.3); fromDark(); await sleep(500);
  const fl = win2.querySelector(".w3-wfl");
  const flowers = [[30, 108, "#E8584C"], [104, 102, "#E8754F"], [52, 100, "#F5C451"], [128, 98, "#F5C451"], [76, 104, "#B98AD8"], [150, 100, "#E8584C"], [64, 112, "#E8754F"], [116, 110, "#B98AD8"]];
  /* сначала просто смотрим в окно: под дождём вырастают цветы */
  await sleep(600);
  for (const [x, y, c] of flowers) {
    fl.insertAdjacentHTML("beforeend", `<g class="w3-grow"><path d="M${x} ${y + 26} V${y}" stroke="#4E9D45" stroke-width="2.5"/><path d="M${x} ${y + 16} q-7 -2 -9 -8 q7 0 9 8" fill="#5DAE4F"/><circle cx="${x}" cy="${y}" r="6" fill="${c}"/><circle cx="${x}" cy="${y}" r="2.4" fill="#FFF3C4"/></g>`);
    Snd.noise({ f: 2600, q: 10, dur: 0.12, gain: 0.06 }); await sleep(450);
  }
  await sleep(700);
  await say("qadar_7");

  /* на следующий день — солнце и парк */
  hideCap(); await toDark(); clearStage();
  sky("linear-gradient(180deg,#5AB2E4 0%,#A9DCF3 60%,#F3E8C4 100%)");
  sunAt(W * 0.8, H * 0.34, 120); clouds(2, 0.26, 0.38); hills(0.34, ["#B5DE98", "#8CCB72", "#69B65E"]);
  [[ART.apple, 0.14, 0.62], [ART.palm, 0.86, 0.6]].forEach(([svg, fx, fy]) => { const t = obj("tree", svg, W * fx, H * fy, 100, 142); t.style.zIndex = 3; t.classList.add("grown"); });
  const bl2 = obj("w3-blanket", ART.blanket, W / 2, H * 0.84, blw, blw / 2); bl2.style.zIndex = 4;
  const bk2 = obj("w3-basket", ART.w3_basket, W / 2 - blw * 0.22, H * 0.8, 96, 72); bk2.style.zIndex = 5;
  const um = obj("w3-um", `<svg viewBox="0 0 100 100" aria-hidden="true">${ITEMS.find(i => i.id === "w3_umbrella").svg}</svg>`, W / 2 + blw * 0.26, H * 0.79, 64, 64); um.style.zIndex = 5;
  vignette();
  Snd.amb("meadow", 0.8); fromDark(); await sleep(400);
  celebrate();
  await say("qadar_8");
  const misses = await choice("qadar_q", [{ id: "qadar_qc", icon: ICON.w3_qadar, ok: true }, { id: "qadar_qa", icon: ICON.w3_check }, { id: "qadar_qb", icon: ICON.w3_dots }], "qadar_q_ok");
  await say("qadar_quran");
  await ayahCard("54:49");
  await say("qadar_quran2");
  await ayahCard("18:23-24");
  await say("qadar_end", { btn: "Альхамдулиллях" });
  hideCap(); await award("w3_umbrella");
  return misses;
}

/* ============ РЕГИСТРАЦИЯ ГЛАВ: мир 3 ============ */
regChapter(2, { id: "iman", name: "Вера в Аллаха", icon: ICON.w3_iman, fn: chIman, lines: "iman_" });
regChapter(2, { id: "angels", name: "Ангелы", icon: ICON.w3_angels, fn: chAngels, lines: "angels_" });
regChapter(2, { id: "books", name: "Книги", icon: ICON.w3_books, fn: chBooks, lines: "books_" });
regChapter(2, { id: "prophets", name: "Пророки", icon: ICON.w3_prophets, fn: chProphets, lines: "prophets_" });
regChapter(2, { id: "lastday", name: "Судный день", icon: ICON.w3_lastday, fn: chLastday, lines: "lastday_" });
regChapter(2, { id: "qadar", name: "Предопределение", icon: ICON.w3_qadar, fn: chQadar, lines: "qadar_" });
