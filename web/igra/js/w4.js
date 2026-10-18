"use strict";
/* Мир 4: как живёт мусульманин. Шахада, омовение, намаз, пост, закят, хадж */

/* ============ АЯТЫ (текст quran-simple и перевод Кулиева из api.alquran.cloud) ============ */
Object.assign(window.AYAT, {
  "47:19": { ref: "Сура Мухаммад, 47:19", tr: "tr_47_19", parts: [{ n: 4564, ar: "فَاعْلَمْ أَنَّهُ لَا إِلَٰهَ إِلَّا اللَّهُ وَاسْتَغْفِرْ لِذَنْبِكَ وَلِلْمُؤْمِنِينَ وَالْمُؤْمِنَاتِ ۗ وَاللَّهُ يَعْلَمُ مُتَقَلَّبَكُمْ وَمَثْوَاكُمْ" }] },
  "5:6": { ref: "Сура аль-Маида, 5:6", tr: "tr_5_6", parts: [{ n: 675, ar: "يَا أَيُّهَا الَّذِينَ آمَنُوا إِذَا قُمْتُمْ إِلَى الصَّلَاةِ فَاغْسِلُوا وُجُوهَكُمْ وَأَيْدِيَكُمْ إِلَى الْمَرَافِقِ وَامْسَحُوا بِرُءُوسِكُمْ وَأَرْجُلَكُمْ إِلَى الْكَعْبَيْنِ ۚ وَإِنْ كُنْتُمْ جُنُبًا فَاطَّهَّرُوا ۚ وَإِنْ كُنْتُمْ مَرْضَىٰ أَوْ عَلَىٰ سَفَرٍ أَوْ جَاءَ أَحَدٌ مِنْكُمْ مِنَ الْغَائِطِ أَوْ لَامَسْتُمُ النِّسَاءَ فَلَمْ تَجِدُوا مَاءً فَتَيَمَّمُوا صَعِيدًا طَيِّبًا فَامْسَحُوا بِوُجُوهِكُمْ وَأَيْدِيكُمْ مِنْهُ ۚ مَا يُرِيدُ اللَّهُ لِيَجْعَلَ عَلَيْكُمْ مِنْ حَرَجٍ وَلَٰكِنْ يُرِيدُ لِيُطَهِّرَكُمْ وَلِيُتِمَّ نِعْمَتَهُ عَلَيْكُمْ لَعَلَّكُمْ تَشْكُرُونَ" }] },
  "4:103": { ref: "Сура ан-Ниса, 4:103", tr: "tr_4_103", parts: [{ n: 596, ar: "فَإِذَا قَضَيْتُمُ الصَّلَاةَ فَاذْكُرُوا اللَّهَ قِيَامًا وَقُعُودًا وَعَلَىٰ جُنُوبِكُمْ ۚ فَإِذَا اطْمَأْنَنْتُمْ فَأَقِيمُوا الصَّلَاةَ ۚ إِنَّ الصَّلَاةَ كَانَتْ عَلَى الْمُؤْمِنِينَ كِتَابًا مَوْقُوتًا" }] },
  "2:183": { ref: "Сура аль-Бакара, 2:183", tr: "tr_2_183", parts: [{ n: 190, ar: "يَا أَيُّهَا الَّذِينَ آمَنُوا كُتِبَ عَلَيْكُمُ الصِّيَامُ كَمَا كُتِبَ عَلَى الَّذِينَ مِنْ قَبْلِكُمْ لَعَلَّكُمْ تَتَّقُونَ" }] },
  "2:261": { ref: "Сура аль-Бакара, 2:261", tr: "tr_2_261", parts: [{ n: 268, ar: "مَثَلُ الَّذِينَ يُنْفِقُونَ أَمْوَالَهُمْ فِي سَبِيلِ اللَّهِ كَمَثَلِ حَبَّةٍ أَنْبَتَتْ سَبْعَ سَنَابِلَ فِي كُلِّ سُنْبُلَةٍ مِائَةُ حَبَّةٍ ۗ وَاللَّهُ يُضَاعِفُ لِمَنْ يَشَاءُ ۗ وَاللَّهُ وَاسِعٌ عَلِيمٌ" }] },
  "22:27": { ref: "Сура аль-Хадж, 22:27", tr: "tr_22_27", parts: [{ n: 2622, ar: "وَأَذِّنْ فِي النَّاسِ بِالْحَجِّ يَأْتُوكَ رِجَالًا وَعَلَىٰ كُلِّ ضَامِرٍ يَأْتِينَ مِنْ كُلِّ فَجٍّ عَمِيقٍ" }] }
});

/* ============ РИСУНКИ (без живых существ) ============ */
Object.assign(ART, {
  w4_skyline: `<svg viewBox="0 0 400 100" preserveAspectRatio="xMidYMax slice" aria-hidden="true"><g fill="#0B2236">
    <rect x="40" y="26" width="9" height="74" rx="2"/><path d="M38 28 L44.5 6 L51 28Z"/><rect x="36" y="44" width="17" height="4" rx="2"/>
    <rect x="350" y="20" width="9" height="80" rx="2"/><path d="M348 22 L354.5 0 L361 22Z"/><rect x="346" y="40" width="17" height="4" rx="2"/>
    <path d="M120 100 V70 Q120 40 160 30 Q200 40 200 70 V100Z"/><rect x="158.6" y="16" width="2.8" height="15" rx="1"/>
    <path d="M190 100 V78 Q190 60 214 54 Q238 60 238 78 V100Z"/><path d="M0 100 V84 H400 V100Z"/><path d="M250 100 V74 H330 V100Z"/><path d="M258 74 Q290 50 322 74Z"/></g>
    <g fill="#FFD98A" opacity=".75"><rect x="153" y="74" width="14" height="18" rx="7"/><rect x="208" y="80" width="12" height="12" rx="6"/><rect x="270" y="82" width="8" height="10" rx="4"/><rect x="300" y="82" width="8" height="10" rx="4"/></g></svg>`,
  w4_faucet: `<svg viewBox="0 0 120 90" aria-hidden="true"><defs><linearGradient id="w4gMetal" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E9F0F3"/><stop offset=".5" stop-color="#A9BAC2"/><stop offset="1" stop-color="#7C929C"/></linearGradient></defs>
    <rect x="96" y="28" width="26" height="26" rx="4" fill="#8FA4AD"/><rect x="34" y="32" width="70" height="18" rx="9" fill="url(#w4gMetal)"/>
    <path d="M42 41 Q22 41 22 60 V66 H40 V60 Q40 52 46 50Z" fill="url(#w4gMetal)"/><rect x="20" y="64" width="22" height="6" rx="2" fill="#7C929C"/>
    <rect x="66" y="18" width="8" height="16" rx="2" fill="#7C929C"/>
    <g class="w4-valve"><rect x="50" y="10" width="40" height="9" rx="4.5" fill="#E35D52"/><circle cx="70" cy="14.5" r="7" fill="#C8473D"/><circle cx="70" cy="14.5" r="3" fill="#F7C2BC"/></g></svg>`,
  w4_basin: `<svg viewBox="0 0 160 70" aria-hidden="true"><defs><linearGradient id="w4gCopper" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#B8733F"/><stop offset=".45" stop-color="#E7A86B"/><stop offset="1" stop-color="#9A5A2C"/></linearGradient></defs>
    <path d="M6 16 Q14 66 80 66 Q146 66 154 16Z" fill="url(#w4gCopper)"/><ellipse cx="80" cy="16" rx="76" ry="12" fill="#C98552"/><ellipse class="w4-bw" cx="80" cy="18" rx="66" ry="8" fill="#7CC4E8" opacity=".25"/>
    <path d="M24 34 Q80 48 136 34" stroke="#F5C451" stroke-width="3" fill="none" opacity=".8"/></svg>`,
  w4_lamp: `<svg viewBox="0 0 50 80" aria-hidden="true"><path d="M25 0 V8" stroke="#6A5A44" stroke-width="2"/><path d="M14 16 Q25 4 36 16Z" fill="#C9A24E"/>
    <path class="w4-gl" d="M12 16 H38 L42 46 Q25 60 8 46Z" fill="rgba(255,236,190,.22)" stroke="#C9A24E" stroke-width="2.5" stroke-linejoin="round"/>
    <path d="M25 16 V54 M12 32 H38" stroke="#C9A24E" stroke-width="1.5" opacity=".7"/>
    <path class="w4-fl" d="M25 26 Q33 37 28 45 Q25 49 22 45 Q17 37 25 26Z" fill="#FFC94A" opacity=".15"/>
    <path d="M10 48 Q25 62 40 48 L34 60 H16Z" fill="#C9A24E"/><circle cx="25" cy="66" r="4" fill="#C9A24E"/></svg>`,
  w4_mosque: `<svg viewBox="0 0 240 150" aria-hidden="true"><g fill="#2B4A5C">
    <rect x="36" y="44" width="12" height="106" rx="2"/><rect x="32" y="72" width="20" height="5" rx="2"/><rect x="33" y="40" width="18" height="5" rx="2"/><path d="M35 41 L42 14 L49 41Z"/><rect x="41" y="6" width="2" height="9"/>
    <rect x="192" y="44" width="12" height="106" rx="2"/><rect x="188" y="72" width="20" height="5" rx="2"/><rect x="189" y="40" width="18" height="5" rx="2"/><path d="M191 41 L198 14 L205 41Z"/><rect x="197" y="6" width="2" height="9"/>
    <rect x="62" y="96" width="116" height="54" rx="2"/><path d="M78 98 C78 72 96 60 120 50 C144 60 162 72 162 98Z"/>
    <rect x="118.6" y="34" width="2.8" height="17" rx="1"/><circle cx="120" cy="32" r="3.4"/>
    <path d="M62 98 C62 86 70 80 76 78 C82 80 90 86 90 98Z"/><path d="M150 98 C150 86 158 80 164 78 C170 80 178 86 178 98Z"/></g>
    <g class="w4-win" fill="#FFD98A" opacity=".35"><path d="M108 150 V128 a12 12 0 0 1 24 0 V150Z"/><path d="M80 140 V122 a6 6 0 0 1 12 0 V140Z"/><path d="M148 140 V122 a6 6 0 0 1 12 0 V140Z"/></g>
    <circle class="w4-mlamp" cx="198" cy="56" r="4" fill="#FFE29A" opacity=".2"/><circle class="w4-mlamp" cx="42" cy="56" r="4" fill="#FFE29A" opacity=".2"/></svg>`,
  w4_box: `<svg viewBox="0 0 130 110" aria-hidden="true"><defs><linearGradient id="w4gBox" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C98B52"/><stop offset="1" stop-color="#8E5A2E"/></linearGradient></defs>
    <path d="M10 26 H120 L114 108 H16Z" fill="url(#w4gBox)"/><rect x="4" y="16" width="122" height="16" rx="5" fill="#A26A3A"/><rect x="38" y="20" width="54" height="7" rx="3.5" fill="#3A2412"/>
    <path d="M26 46 H104 M24 66 H106 M22 86 H108" stroke="#7A4A24" stroke-width="2" opacity=".5"/>
    <circle cx="65" cy="68" r="17" fill="#F5C451" stroke="#B9802A" stroke-width="2"/><path d="M65 78 C52 69 56 58 65 64 C74 58 78 69 65 78Z" fill="#E8584C"/></svg>`,
  w4_purse: `<svg viewBox="0 0 120 90" aria-hidden="true"><path d="M20 30 Q8 86 60 86 Q112 86 100 30Z" fill="#5B8F6E"/><path d="M20 30 Q60 42 100 30 Q90 20 60 22 Q30 20 20 30Z" fill="#3F6F52"/>
    ${[[40, 26], [56, 22], [72, 24], [48, 18], [64, 16], [82, 28]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="9" ry="5" fill="#F5C451" stroke="#B9802A" stroke-width="1.5"/>`).join("")}
    <path d="M30 56 Q60 66 90 56" stroke="#F5C451" stroke-width="3" fill="none" opacity=".7"/></svg>`,
  w4_coin: `<svg viewBox="0 0 50 50" aria-hidden="true"><circle cx="25" cy="25" r="22" fill="#F5C451" stroke="#B9802A" stroke-width="3"/><circle cx="25" cy="25" r="15" fill="none" stroke="#E6A93A" stroke-width="2"/><path d="M19 17 L25 13 L31 17 V33 L25 37 L19 33Z" fill="#FFE8A3" opacity=".8"/></svg>`,
  w4_ear: `<svg viewBox="0 0 40 90" aria-hidden="true"><path d="M20 90 V60" stroke="#B8923E" stroke-width="3"/>
    ${Array.from({ length: 7 }, (_, i) => `<ellipse cx="13" cy="${62 - i * 8}" rx="6" ry="8" fill="#E9C25A" transform="rotate(-25 13 ${62 - i * 8})"/><ellipse cx="27" cy="${62 - i * 8}" rx="6" ry="8" fill="#DDB04A" transform="rotate(25 27 ${62 - i * 8})"/>`).join("")}
    <ellipse cx="20" cy="8" rx="5" ry="8" fill="#E9C25A"/><path d="M20 6 L18 -10 M14 12 L6 -2 M26 12 L34 -2" stroke="#D9B34E" stroke-width="1.5"/></svg>`,
  w4_seed: `<svg viewBox="0 0 30 30" aria-hidden="true"><ellipse cx="15" cy="15" rx="7" ry="11" fill="#D9A84A" stroke="#A9782A" stroke-width="2" transform="rotate(20 15 15)"/><path d="M13 9 Q16 15 14 21" stroke="#A9782A" stroke-width="1.5" fill="none"/></svg>`,
  w4_kaaba: `<svg viewBox="0 0 160 150" aria-hidden="true">
    <path d="M18 40 L100 40 L140 22 L58 22Z" fill="#3A3A3E"/>
    <path d="M18 40 H100 V140 H18Z" fill="#141416"/><path d="M100 40 L140 22 V118 L100 140Z" fill="#232326"/>
    <path d="M18 58 H100 V70 H18Z" fill="#C9A24E"/><path d="M100 58 L140 40 V52 L100 70Z" fill="#A98738"/>
    <path d="M24 64 h8 m4 0 h10 m4 0 h6 m4 0 h12 m4 0 h8 m4 0 h6" stroke="#7A5E1E" stroke-width="2" stroke-linecap="round"/>
    <path d="M70 84 H90 V136 H70Z" fill="#C9A24E"/><path d="M73 88 H87 V132 H73Z" fill="#A98738"/><path d="M80 90 V130" stroke="#E6C46E" stroke-width="1.5"/>
    <path d="M18 140 H100 L140 118" stroke="#C9B48A" stroke-width="3" fill="none"/></svg>`,
  w4_plane: `<svg viewBox="0 0 60 60" aria-hidden="true"><path d="M8 30 Q8 26 14 26 H46 Q56 26 58 30 Q56 34 46 34 H14 Q8 34 8 30Z" fill="#FFFFFF" stroke="#7F98A3" stroke-width="1.6"/>
    <path d="M28 27 L22 6 H28 L40 27Z M28 33 L22 54 H28 L40 33Z" fill="#E4EDF1" stroke="#7F98A3" stroke-width="1.6" stroke-linejoin="round"/>
    <path d="M10 27 L6 18 H11 L17 27Z M10 33 L6 42 H11 L17 33Z" fill="#E4EDF1" stroke="#7F98A3" stroke-width="1.4" stroke-linejoin="round"/><circle cx="50" cy="30" r="2" fill="#5BA9C9"/></svg>`,
  w4_ihram: `<svg viewBox="0 0 80 60" aria-hidden="true"><path d="M8 14 Q40 4 72 14 L66 54 Q40 60 14 54Z" fill="#FFFFFF" stroke="#C9D3D8" stroke-width="2.5"/><path d="M14 24 Q40 16 66 24 M16 38 Q40 30 64 38" stroke="#E3E9EC" stroke-width="3" fill="none"/></svg>`
});

/* Иконки 48×48 */
const W4N = (n, bg = "#1F5B74", fg = "#FFF3C4") => `<circle cx="24" cy="24" r="19" fill="${bg}"/><text x="24" y="${n > 9 ? 31 : 32}" text-anchor="middle" font-family="Nunito, sans-serif" font-weight="900" font-size="${n > 9 ? 19 : 23}" fill="${fg}">${n}</text>`;
Object.assign(ICON, {
  w4_shahada: '<circle cx="24" cy="24" r="20" fill="#1F5B74"/><circle cx="24" cy="24" r="16" fill="none" stroke="#F5C451" stroke-width="2" stroke-dasharray="3.5 3"/><path d="M33 14 V31 M28 17 V31 M18 31 Q14 31 14 26 M14 31 H34" stroke="#F5C451" stroke-width="3" stroke-linecap="round" fill="none"/>',
  w4_wudu: '<rect x="20" y="8" width="24" height="9" rx="4.5" fill="#A9BAC2"/><path d="M22 12 Q10 12 10 24 V27 H18 V24 Q18 19 24 17Z" fill="#8FA4AD"/><rect x="28" y="3" width="10" height="5" rx="2.5" fill="#E35D52"/><path d="M14 31 Q20 39 20 42 A6 6 0 0 1 8 42 Q8 39 14 31Z" fill="#5BB8E8"/><path d="M30 36 Q34 41 34 43 A4 4 0 0 1 26 43 Q26 41 30 36Z" fill="#7CC4E8"/>',
  w4_salah: '<rect x="20" y="16" width="8" height="30" rx="1.5" fill="#4F6F7C"/><rect x="17" y="22" width="14" height="4" rx="2" fill="#4F6F7C"/><path d="M19 17 L24 4 L29 17Z" fill="#4F6F7C"/><circle cx="24" cy="31" r="4.5" fill="#FFD54F"/><circle cx="24" cy="31" r="8" fill="#FFD54F" opacity=".3"/>',
  w4_sawm: '<path d="M30 6 A16 16 0 1 0 42 32 A13 13 0 1 1 30 6Z" fill="#F5C451"/><path d="M14 22 Q18 16 22 22 V34 Q18 38 14 34Z" fill="#E8754F"/><path d="M18 14 V18" stroke="#C9A24E" stroke-width="2"/><circle cx="18" cy="28" r="2.2" fill="#FFE7A0"/>',
  w4_zakat: '<path d="M18 44 V18" stroke="#B8923E" stroke-width="2.5"/>' + Array.from({ length: 4 }, (_, i) => `<ellipse cx="14" cy="${30 - i * 6}" rx="3.5" ry="5" fill="#E9C25A" transform="rotate(-25 14 ${30 - i * 6})"/><ellipse cx="22" cy="${30 - i * 6}" rx="3.5" ry="5" fill="#DDB04A" transform="rotate(25 22 ${30 - i * 6})"/>`).join("") + '<circle cx="34" cy="34" r="9" fill="#F5C451" stroke="#B9802A" stroke-width="2"/><circle cx="34" cy="34" r="5" fill="none" stroke="#E6A93A" stroke-width="1.5"/>',
  w4_hajj: '<path d="M8 16 L30 16 L42 10 L20 10Z" fill="#4A4A50"/><path d="M8 16 H30 V42 H8Z" fill="#17171A"/><path d="M30 16 L42 10 V36 L30 42Z" fill="#2A2A2E"/><path d="M8 21 H30 V25 H8Z" fill="#D9B04A"/><path d="M30 21 L42 15 V19 L30 25Z" fill="#B8923E"/><rect x="21" y="29" width="6" height="12" fill="#D9B04A"/>',
  w4_fire: '<path d="M24 4 Q34 16 32 24 Q38 20 37 14 Q44 24 40 34 Q36 44 24 44 Q12 44 9 34 Q6 24 14 16 Q14 24 18 26 Q14 14 24 4Z" fill="#F07A55"/><path d="M24 22 Q31 30 29 36 Q27 41 24 41 Q20 41 19 36 Q18 30 24 22Z" fill="#FFD54F"/>',
  w4_bism: '<rect x="3" y="9" width="42" height="30" rx="9" fill="#1F5B74"/><text x="24" y="30" text-anchor="middle" font-family="Amiri, serif" font-weight="700" font-size="15" fill="#F5C451">بسم الله</text>',
  w4_n1: W4N(1), w4_n4: W4N(4, "#8FA3AE"), w4_n5: W4N(5, "#8FA3AE"), w4_n5g: W4N(5, "#3FA66A"), w4_n10: W4N(10, "#8FA3AE"),
  w4_sunrise: '<path d="M4 34 H44" stroke="#7DA36A" stroke-width="3"/><path d="M14 34 A10 10 0 0 1 34 34Z" fill="#F7B32B"/><path d="M24 14 V19 M11 21 L14.5 24.5 M37 21 L33.5 24.5" stroke="#F7B32B" stroke-width="3" stroke-linecap="round"/><path d="M8 40 H40" stroke="#BFE3F5" stroke-width="3"/>',
  w4_noon: '<circle cx="24" cy="18" r="8" fill="#F7B32B"/>' + [0, 60, 120, 180, 240, 300].map(a => `<path d="M24 4 V7" stroke="#F7B32B" stroke-width="3" stroke-linecap="round" transform="rotate(${a} 24 18)"/>`).join("") + '<path d="M4 40 H44" stroke="#7DA36A" stroke-width="3"/>',
  w4_sunset: '<rect x="4" y="6" width="40" height="34" rx="8" fill="#F2A07A"/><path d="M14 36 A10 10 0 0 1 34 36Z" fill="#FFD54F"/><path d="M4 36 H44" stroke="#5E6A8A" stroke-width="4"/>',
  w4_jar: '<rect x="14" y="6" width="20" height="6" rx="2" fill="#8E9DA4"/><path d="M12 14 H36 Q40 18 40 24 V40 Q40 44 36 44 H12 Q8 44 8 40 V24 Q8 18 12 14Z" fill="rgba(200,230,240,.7)" stroke="#8FB7C8" stroke-width="2"/><ellipse cx="18" cy="38" rx="6" ry="3" fill="#F5C451"/><ellipse cx="30" cy="38" rx="6" ry="3" fill="#F5C451"/><ellipse cx="24" cy="33" rx="6" ry="3" fill="#F5C451"/>',
  w4_chest: '<path d="M6 20 Q6 8 24 8 Q42 8 42 20Z" fill="#A26A3A"/><rect x="6" y="20" width="36" height="22" rx="2" fill="#8E5A2E"/><path d="M6 20 H42 M24 8 V42" stroke="#F5C451" stroke-width="3"/><rect x="20" y="22" width="8" height="8" rx="2" fill="#F5C451"/>',
  w4_crown: '<path d="M6 36 L8 14 L17 24 L24 8 L31 24 L40 14 L42 36Z" fill="#F5C451" stroke="#B9802A" stroke-width="2" stroke-linejoin="round"/><rect x="6" y="36" width="36" height="6" rx="2" fill="#E6A93A"/><circle cx="24" cy="29" r="3" fill="#E8584C"/>',
  /* для поста: еда и добрые дела */
  w4_dates: '<path d="M4 28 Q24 46 44 28Z" fill="#E8DDC8" stroke="#C9BBA0" stroke-width="2"/><ellipse cx="16" cy="22" rx="5" ry="8" fill="#8A4B1F" transform="rotate(-15 16 22)"/><ellipse cx="25" cy="20" rx="5" ry="8" fill="#9A5626"/><ellipse cx="34" cy="22" rx="5" ry="8" fill="#8A4B1F" transform="rotate(15 34 22)"/>',
  w4_water: '<path d="M12 8 H36 L33 44 H15Z" fill="rgba(255,255,255,.6)" stroke="#8FB7C8" stroke-width="2.5" stroke-linejoin="round"/><path d="M13.6 20 H34.4 L33 42 H15Z" fill="#7CC4E8"/>',
  w4_bread: '<ellipse cx="24" cy="28" rx="20" ry="11" fill="#D9984E"/><ellipse cx="24" cy="25" rx="17" ry="8" fill="#E9B26A"/><path d="M14 23 Q17 20 20 23 M22 22 Q25 19 28 22 M30 23 Q33 20 36 23" stroke="#B87532" stroke-width="2" fill="none" stroke-linecap="round"/>',
  w4_sweet: '<circle cx="24" cy="24" r="11" fill="#F27BA0"/><path d="M13 24 L4 17 V31Z M35 24 L44 17 V31Z" fill="#F7A9C2"/><path d="M18 20 Q24 16 30 20" stroke="#fff" stroke-width="2.5" fill="none" stroke-linecap="round" opacity=".7"/>',
  w4_book: '<path d="M24 12 Q14 6 4 9 V40 Q14 37 24 42Z" fill="#1F6E58"/><path d="M24 12 Q34 6 44 9 V40 Q34 37 24 42Z" fill="#257D64"/><path d="M24 12 V42" stroke="#F5C451" stroke-width="2"/><path d="M9 18 Q14 16 19 18 M29 18 Q34 16 39 18 M9 24 Q14 22 19 24 M29 24 Q34 22 39 24" stroke="#F5C451" stroke-width="1.6" fill="none"/>',
  w4_beads: Array.from({ length: 11 }, (_, i) => { const a = Math.PI * 2 * i / 11 - Math.PI / 2; return `<circle cx="${(24 + 14 * Math.cos(a)).toFixed(1)}" cy="${(20 + 14 * Math.sin(a)).toFixed(1)}" r="3.6" fill="#3FA2CF"/>`; }).join("") + '<path d="M24 34 V42" stroke="#F5C451" stroke-width="2.5"/><circle cx="24" cy="44" r="3" fill="#F5C451"/>',
  w4_kind: '<path d="M6 10 H42 Q44 10 44 12 V32 Q44 34 42 34 H20 L12 42 V34 H6 Q4 34 4 32 V12 Q4 10 6 10Z" fill="#FFF8EA" stroke="#C9BBA0" stroke-width="2"/><path d="M24 30 C14 24 17 15 24 19.5 C31 15 34 24 24 30Z" fill="#E8584C"/>',
  w4_give: '<path d="M8 20 H40 L37 44 H11Z" fill="#A26A3A"/><rect x="6" y="15" width="36" height="7" rx="3" fill="#8E5A2E"/><rect x="18" y="17" width="12" height="3" rx="1.5" fill="#3A2412"/><circle cx="24" cy="9" r="7" fill="#F5C451" stroke="#B9802A" stroke-width="1.6"/>',
  w4_broom: '<path d="M30 4 L22 26" stroke="#A26A3A" stroke-width="4" stroke-linecap="round"/><path d="M16 24 H30 L36 44 H8Z" fill="#E7C76A"/><path d="M14 30 L12 44 M20 30 L19 44 M26 30 L27 44 M31 30 L34 44" stroke="#C9A24E" stroke-width="1.6"/><rect x="15" y="22" width="16" height="5" rx="2" fill="#C0533A"/>'
});

/* Сокровища */
ITEMS.push(
  { id: "w4_scroll", name: "Свиток шахады", svg: '<rect x="18" y="16" width="64" height="68" rx="4" fill="#FBF1DC" stroke="#C9A55A" stroke-width="3"/><rect x="12" y="10" width="76" height="12" rx="6" fill="#C9A55A"/><rect x="12" y="78" width="76" height="12" rx="6" fill="#C9A55A"/><text x="50" y="56" text-anchor="middle" font-family="Amiri, serif" font-weight="700" font-size="17" fill="#B9802A">لا إله إلا الله</text>' },
  { id: "w4_jug", name: "Кувшин для омовения", svg: '<path d="M30 30 Q22 30 22 40 Q22 50 30 52" fill="none" stroke="#9A5A2C" stroke-width="6" stroke-linecap="round"/><path d="M40 10 H60 L58 22 Q78 32 76 60 Q74 90 50 90 Q26 90 24 60 Q22 32 42 22Z" fill="#D98552"/><path d="M58 24 Q74 22 90 8 L86 18 Q76 32 64 34" fill="#C26F3E"/><path d="M28 56 Q50 64 72 56" stroke="#F5C451" stroke-width="3" fill="none"/><path d="M92 14 Q94 22 92 28 M96 18 Q98 24 96 30" stroke="#7CC4E8" stroke-width="3" stroke-linecap="round" fill="none"/>' },
  { id: "w4_rug", name: "Коврик для намаза", svg: '<rect x="20" y="8" width="60" height="84" rx="4" fill="#1F6E58"/><rect x="26" y="14" width="48" height="72" rx="2" fill="none" stroke="#F5C451" stroke-width="2.5"/><path d="M34 80 V40 Q34 24 50 20 Q66 24 66 40 V80Z" fill="#257D64" stroke="#F5C451" stroke-width="2.5"/><circle cx="50" cy="46" r="5" fill="#F5C451"/><path d="M20 92 v6 M28 92 v6 M36 92 v6 M44 92 v6 M52 92 v6 M60 92 v6 M68 92 v6 M76 92 v6 M20 2 v6 M28 2 v6 M36 2 v6 M44 2 v6 M52 2 v6 M60 2 v6 M68 2 v6 M76 2 v6" stroke="#F5C451" stroke-width="2"/>' },
  { id: "w4_fanous", name: "Фонарь Рамадана", svg: '<path d="M50 2 V12" stroke="#B9802A" stroke-width="3"/><path d="M32 22 Q50 4 68 22Z" fill="#E6A93A"/><path d="M28 22 H72 L78 66 Q50 86 22 66Z" fill="#FFE7A0" stroke="#E6A93A" stroke-width="4" stroke-linejoin="round"/><path d="M50 22 V78 M26 44 H74" stroke="#E6A93A" stroke-width="2.5"/><path d="M50 34 Q60 48 54 58 Q50 62 46 58 Q40 48 50 34Z" fill="#F07A55"/><path d="M22 68 Q50 88 78 68 L70 86 H30Z" fill="#E6A93A"/><path d="M84 18 A12 12 0 1 0 94 34 A10 10 0 1 1 84 18Z" fill="#F5C451"/>' },
  { id: "w4_wheat", name: "Колос", svg: '<path d="M50 98 V40" stroke="#B8923E" stroke-width="4"/>' + Array.from({ length: 6 }, (_, i) => `<ellipse cx="41" cy="${72 - i * 9}" rx="8" ry="11" fill="#E9C25A" transform="rotate(-25 41 ${72 - i * 9})"/><ellipse cx="59" cy="${72 - i * 9}" rx="8" ry="11" fill="#DDB04A" transform="rotate(25 59 ${72 - i * 9})"/>`).join("") + '<ellipse cx="50" cy="20" rx="7" ry="11" fill="#E9C25A"/><path d="M50 16 V2 M42 22 L32 6 M58 22 L68 6" stroke="#D9B34E" stroke-width="2"/>' },
  { id: "w4_zamzam", name: "Вода Замзам", svg: '<rect x="38" y="6" width="24" height="12" rx="3" fill="#5BA9C9"/><path d="M38 18 H62 V26 Q76 32 76 46 V86 Q76 94 68 94 H32 Q24 94 24 86 V46 Q24 32 38 26Z" fill="rgba(200,235,250,.8)" stroke="#5BA9C9" stroke-width="3"/><path d="M26 52 H74 V86 Q74 92 68 92 H32 Q26 92 26 86Z" fill="#6BC0E6"/><rect x="34" y="58" width="32" height="20" rx="4" fill="#FFF8EA"/><path d="M40 68 H60" stroke="#1F5B74" stroke-width="3" stroke-linecap="round"/>' }
);

/* ============ СТИЛИ ============ */
addCSS(`
.w4-stars { position: absolute; left: 0; right: 0; top: 0; pointer-events: none; transition: opacity .6s; }
.w4-stars svg { width: 100%; height: 100%; display: block; }
.w4-tablet { border-radius: 22px; background: linear-gradient(160deg, rgba(24,66,88,.94), rgba(10,34,48,.94)); border: 2px solid rgba(245,196,81,.55);
  box-shadow: 0 18px 40px -12px rgba(0,0,0,.6), inset 0 0 30px rgba(245,196,81,.08); }
.w4-tin { position: absolute; inset: 0; border-radius: 20px; overflow: visible; }
.w4-tin canvas { touch-action: none; }
.w4-tin.w4-shine canvas { filter: drop-shadow(0 0 10px rgba(255,214,120,.85)); transition: filter 1s; }
.w4-start { position: absolute; width: 26px; height: 26px; translate: -50% -50%; border-radius: 50%; background: #FFE7A0; box-shadow: 0 0 16px #FFD54F; pointer-events: none; animation: w4pulse 1.1s ease-in-out infinite; }
@keyframes w4pulse { 50% { transform: scale(1.5); opacity: .55; } }
.w4-prog { position: absolute; height: 10px; border-radius: 5px; background: rgba(255,255,255,.18); overflow: hidden; translate: -50% 0; z-index: 6; }
.w4-prog i { display: block; height: 100%; width: 0; border-radius: 5px; background: linear-gradient(90deg, #F5C451, #FFE7A0); transition: width .2s; }
.w4-sub { position: absolute; translate: -50% 0; text-align: center; color: #FFF3D6; font-weight: 800; font-size: 16px; line-height: 1.35; text-shadow: 0 2px 8px rgba(0,0,0,.6); z-index: 6; }
.w4-sub b { display: block; font-family: "Amiri", serif; font-size: 34px; line-height: 1.5; color: #FFD54F; font-weight: 700; }
.w4-wall { position: absolute; inset: 0; background-color: #E9F1F2;
  background-image: linear-gradient(rgba(120,160,170,.18) 2px, transparent 2px), linear-gradient(90deg, rgba(120,160,170,.18) 2px, transparent 2px);
  background-size: 46px 46px; }
.w4-floor { position: absolute; left: 0; right: 0; bottom: 0; height: 22%; background: linear-gradient(180deg, #B9CFD4, #93AFB6); border-top: 6px solid #7FA0A8; }
.w4-arch { position: absolute; border-radius: 999px 999px 8px 8px; background: linear-gradient(180deg, #CFE9F5, #9FD6F2); border: 6px solid #C8B590; }
.w4-stream { position: absolute; width: 12px; translate: -50% 0; border-radius: 6px; pointer-events: none; z-index: 6;
  background: repeating-linear-gradient(180deg, rgba(120,200,240,.95) 0 14px, rgba(190,232,255,.95) 14px 26px); animation: w4flow .35s linear infinite; transition: opacity .3s; }
@keyframes w4flow { to { background-position: 0 26px; } }
.w4-card { border-radius: 16px; background: #FFF8EA; box-shadow: 0 6px 0 #E3D3AE, 0 12px 20px -8px rgba(0,0,0,.35); display: flex; align-items: center; gap: 8px; padding: 6px 10px 6px 6px; pointer-events: none; }
.w4-card b { flex: none; width: 40px; height: 40px; border-radius: 50%; background: #1F5B74; color: #FFF3C4; display: grid; place-items: center; font-size: 22px; font-weight: 900; }
.w4-card span { font-size: 14px; line-height: 1.15; font-weight: 900; color: #12313F; }
.w4-strip { position: absolute; z-index: 25; left: 50%; translate: -50% 0; bottom: calc(env(safe-area-inset-bottom, 0px) + 14px); display: flex; gap: 8px;
  padding: 7px 10px; border-radius: 22px; background: rgba(12,38,52,.78); box-shadow: 0 8px 20px rgba(0,0,0,.3); }
.w4-strip i { width: 36px; height: 36px; border-radius: 50%; display: grid; place-items: center; font-style: normal; font-weight: 900; font-size: 18px; color: rgba(255,255,255,.55); border: 2px dashed rgba(255,255,255,.35); transition: background .3s, color .3s; }
.w4-strip i.on { background: #F5C451; color: #12313F; border: 2px solid #FFE7A0; animation: bump .4s; }
.w4-lbl { position: absolute; translate: -50% 0; color: #fff; font-weight: 900; font-size: 13px; text-shadow: 0 2px 6px rgba(0,0,0,.7); pointer-events: none; z-index: 9; white-space: nowrap; }
.w4-lamp.on .w4-fl { opacity: 1; }
.w4-lamp.on .w4-gl { fill: rgba(255,226,140,.75); }
.w4-lamp.on { filter: drop-shadow(0 0 12px rgba(255,210,110,.95)); }
.w4-lamp.blink { animation: w4blink .8s ease-in-out infinite; }
@keyframes w4blink { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.22); filter: drop-shadow(0 0 14px #FFD54F) drop-shadow(0 0 6px #fff) brightness(1.35); } }
.w4-ring { position: absolute; border-radius: 50%; border: 3px solid rgba(255,236,170,.9); translate: -50% -50%; pointer-events: none; z-index: 5; }
.w4-veil { position: absolute; inset: 0; background: #06101F; pointer-events: none; }
.w4-moon { position: absolute; width: 60px; height: 60px; translate: -50% -50%; transition: opacity 1s; pointer-events: none; }
.w4-bub { border-radius: 50%; background: radial-gradient(circle at 35% 30%, rgba(255,255,255,.95), rgba(235,245,250,.85) 60%, rgba(200,225,235,.85)); box-shadow: 0 8px 18px -6px rgba(0,0,0,.35); display: grid; place-items: center; cursor: pointer; }
.w4-bub.w4-good { background: radial-gradient(circle at 35% 30%, #FFFBEA, #FFF1C4 60%, #F7DC8A); box-shadow: 0 0 0 4px rgba(245,196,81,.8), 0 0 18px rgba(255,214,110,.7); }
.w4-bub .w4-bi { display: flex; flex-direction: column; align-items: center; pointer-events: none; }
.w4-bub svg { width: 44px; height: 44px; }
.w4-bub small { font-size: 11.5px; line-height: 1.05; font-weight: 900; color: #12313F; text-align: center; max-width: 76px; }
.w4-bub.w4-no { animation: shake .4s; opacity: .5; transition: opacity .4s; }
.w4-daybar { position: absolute; z-index: 25; left: 50%; translate: -50% 0; bottom: calc(env(safe-area-inset-bottom, 0px) + 16px); width: min(88vw, 380px);
  display: grid; grid-template-columns: auto 1fr auto; align-items: center; gap: 10px; padding: 9px 14px; border-radius: 20px; background: rgba(12,38,52,.78); color: #fff; font-weight: 900; font-size: 13px; }
.w4-daybar i { position: relative; height: 10px; border-radius: 5px; background: rgba(255,255,255,.18); }
.w4-daybar i b { position: absolute; left: 0; top: 0; bottom: 0; width: 0; border-radius: 5px; background: linear-gradient(90deg, #F5C451, #F07A55); }
.w4-daybar i em { position: absolute; top: 50%; left: 0; width: 30px; height: 30px; translate: -50% -50%; }
.w4-cnt { position: absolute; z-index: 26; padding: 8px 14px; border-radius: 16px; background: rgba(12,38,52,.8); color: #fff; font-weight: 900; font-size: 15px; white-space: nowrap; }
.w4-cnt b { color: #F5C451; font-size: 20px; }
.w4-cnt.bump { animation: bump .4s; }
.w4-ground { position: absolute; left: 0; right: 0; bottom: 0; }
.w4-map { position: absolute; left: 3%; right: 3%; border-radius: 22px; overflow: hidden; box-shadow: 0 16px 30px -12px rgba(0,0,0,.45); border: 3px solid #C9A55A; }
.w4-map svg { width: 100%; height: 100%; display: block; }
.w4-tag { position: absolute; translate: -50% -50%; padding: 4px 9px; border-radius: 10px; background: rgba(255,248,234,.92); color: #6A4A1E; font-weight: 900; font-size: 12.5px; pointer-events: none; white-space: nowrap; box-shadow: 0 3px 8px rgba(0,0,0,.2); }
.w4-mataf { position: absolute; left: 0; right: 0; bottom: 0; background: radial-gradient(ellipse at 50% 30%, #FFFFFF 0%, #EDE8DF 55%, #D9D1C2 100%); }
.w4-laps { display: flex; gap: 6px; justify-content: center; margin-top: 6px; }
.w4-laps i { width: 12px; height: 12px; border-radius: 50%; background: rgba(255,255,255,.25); }
.w4-laps i.on { background: #F5C451; box-shadow: 0 0 8px #F5C451; }
.w4-grain { position: absolute; width: 7px; height: 10px; border-radius: 50%; background: #E9C25A; pointer-events: none; z-index: 9; }
`);

/* ============ ОБЩЕЕ ============ */
/* Таймер бездействия: poke() откладывает срабатывание */
/* Таймер бездействия: касание откладывает подсказку-автоход, но не дольше чем на ms·4 —
   иначе ребёнок, который трогает экран, но не может сделать жест, застрянет навсегда */
function w4Idle(ms, fn) {
  const end = Date.now() + ms * 4; let t = setTimeout(fn, ms);
  return { poke() { clearTimeout(t); t = setTimeout(fn, Math.max(0, Math.min(ms, end - Date.now()))); }, stop() { clearTimeout(t); } };
}
const w4Hex = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
function w4Mix(a, b, k) { const A = w4Hex(a), B = w4Hex(b); return "#" + A.map((v, i) => Math.round(v + (B[i] - v) * k).toString(16).padStart(2, "0")).join(""); }
/* Цвет неба по ключевым точкам: stops = [[t, верх, низ], ...] */
function w4SkyAt(stops, t) {
  let i = 0; while (i < stops.length - 2 && t > stops[i + 1][0]) i++;
  const a = stops[i], b = stops[i + 1], k = Math.max(0, Math.min(1, (t - a[0]) / (b[0] - a[0] || 1)));
  return `linear-gradient(180deg, ${w4Mix(a[1], b[1], k)} 0%, ${w4Mix(a[2], b[2], k)} 100%)`;
}
function w4Stars(n, inset) {
  const s = el("div", "w4-stars", stage, `<svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><g class="twinkle" fill="#FFF6DD">${Array.from({ length: n }, () => `<circle cx="${rnd(0, 400).toFixed(0)}" cy="${rnd(0, 290).toFixed(0)}" r="${rnd(0.5, 1.5).toFixed(1)}"/>`).join("")}</g></svg>`);
  s.style.inset = inset; return s;
}
/* Нижний край подписи (0, если скрыта): игровые объекты ставим ниже */
function w4CapBottom() { if (cap.classList.contains("hidden")) return 0; return cap.getBoundingClientRect().bottom - stage.getBoundingClientRect().top; }
function w4Counter(html, css) { const c = el("div", "w4-cnt", app, html); Object.assign(c.style, css); return c; }
function w4Bump(e) { e.classList.remove("bump"); void e.offsetWidth; e.classList.add("bump"); }
/* Расходящиеся кольца (азан, всплеск) */
function w4Rings(x, y, n = 3, size = 30, grow = 4) {
  for (let i = 0; i < n; i++) {
    const r = el("div", "w4-ring"); Object.assign(r.style, { left: x + "px", top: y + "px", width: size + "px", height: size + "px" });
    r.animate([{ transform: "scale(.5)", opacity: 1 }, { transform: `scale(${grow})`, opacity: 0 }], { duration: 1400, delay: i * 300, easing: "ease-out" }).onfinish = () => r.remove();
  }
}

/* ============ ГЛАВА 1: ШАХАДА ============ */
/* Обвести надпись по пунктиру: палец «прокрашивает» буквы золотом. Готово, когда закрашено 75% букв */
function w4Trace(host, text, onP, idleMs = 20000) {
  return new Promise(async res => {
    try { await Promise.race([document.fonts.load('700 60px "Amiri"', text), sleep(2500)]); } catch (e) {}
    const w = host.clientWidth, h = host.clientHeight, dpr = Math.min(2, window.devicePixelRatio || 1);
    const mk = () => { const c = document.createElement("canvas"); c.width = Math.round(w * dpr); c.height = Math.round(h * dpr); const x = c.getContext("2d"); x.scale(dpr, dpr); return [c, x]; };
    const [cv, ctx] = mk(); cv.style.cssText = `width:${w}px;height:${h}px;display:block`; host.appendChild(cv);
    const [gold, gx] = mk();
    let fs = h * 0.56;
    const setF = x => { x.font = `700 ${fs}px Amiri, "Times New Roman", serif`; x.direction = "rtl"; x.textAlign = "center"; x.textBaseline = "alphabetic"; };
    setF(gx); const tw = gx.measureText(text).width; if (tw > w * 0.86) { fs *= w * 0.86 / tw; setF(gx); }
    setF(gx);
    const m = gx.measureText(text), asc = m.actualBoundingBoxAscent || fs * 0.7, desc = m.actualBoundingBoxDescent || fs * 0.25;
    const by = h / 2 + (asc - desc) / 2;
    const gr = gx.createLinearGradient(0, by - asc, 0, by + desc); gr.addColorStop(0, "#FFF4C2"); gr.addColorStop(1, "#F0B43C");
    gx.fillStyle = gr; gx.fillText(text, w / 2, by);
    setF(ctx); ctx.fillStyle = "rgba(255,240,200,.12)"; ctx.fillText(text, w / 2, by);
    ctx.setLineDash([5, 4]); ctx.lineWidth = 1.8; ctx.strokeStyle = "rgba(255,236,180,.95)"; ctx.strokeText(text, w / 2, by); ctx.setLineDash([]);
    const data = gx.getImageData(0, 0, gold.width, gold.height).data;
    let left = [];
    for (let y = 2; y < h; y += 4) for (let x = 2; x < w; x += 4) { const i = (Math.round(y * dpr) * gold.width + Math.round(x * dpr)) * 4 + 3; if (data[i] > 120) left.push({ x, y }); }
    const total = left.length || 1; let done = 0, fin = false, down = false, last = null;
    const R = Math.max(14, fs * 0.13);
    const st = left.reduce((a, p) => (p.x > a.x ? p : a), left[0] || { x: w * 0.9, y: h / 2 });
    const dot = el("div", "w4-start", host); dot.style.left = st.x + "px"; dot.style.top = st.y + "px";
    const paintAt = (x, y) => {
      ctx.save(); ctx.beginPath(); ctx.arc(x, y, R, 0, Math.PI * 2); ctx.clip(); ctx.drawImage(gold, 0, 0, w, h); ctx.restore();
      const r2 = R * R, before = left.length;
      left = left.filter(p => (p.x - x) ** 2 + (p.y - y) ** 2 > r2);
      const n = before - left.length;
      if (n) { done += n; onP && onP(Math.min(1, done / total / 0.75)); if (Math.random() < 0.3) Snd.noise({ f: rnd(2200, 3200), q: 8, dur: 0.08, gain: 0.05 }); }
      if (done / total >= 0.75) finish();
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
    const auto = async () => {
      if (fin) return; dot.style.display = "none";
      left.sort((a, b) => b.x - a.x);
      while (!fin && left.length) { const p = left[0]; paintAt(p.x, p.y); await sleep(25); }
    };
    const idle = w4Idle(idleMs, auto);
    const capT = setTimeout(auto, 60000);
    function finish() {
      if (fin) return; fin = true; idle.stop(); clearTimeout(capT);
      cv.removeEventListener("pointerdown", dn); window.removeEventListener("pointermove", mv); window.removeEventListener("pointerup", up); window.removeEventListener("pointercancel", up);
      dot.remove(); onP && onP(1);
      const a0 = performance.now();
      const fill = t => { const k = Math.min(1, (t - a0) / 700); ctx.globalAlpha = 0.25; ctx.drawImage(gold, 0, 0, w, h); ctx.globalAlpha = 1; if (k < 1) requestAnimationFrame(fill); else ctx.drawImage(gold, 0, 0, w, h); };
      requestAnimationFrame(fill);
      host.classList.add("w4-shine"); Snd.sparkle(); setTimeout(res, 900);
    }
  });
}
async function chShahada() {
  await toDark(); clearStage();
  sky("linear-gradient(180deg,#0A1A30 0%,#15345A 55%,#2A5680 100%)");
  const { W, H } = size();
  w4Stars(60, "0 0 35% 0");
  const moon = el("div", "w4-moon", stage, '<svg viewBox="0 0 60 60" aria-hidden="true"><path d="M34 6 A24 24 0 1 0 54 42 A20 20 0 1 1 34 6Z" fill="#FFE29A"/></svg>'); moon.style.left = (W * 0.84) + "px"; moon.style.top = (H * 0.33) + "px";
  const town = el("div", "layer", stage, ART.w4_skyline); town.style.bottom = "0"; town.style.height = "24%";
  vignette();
  Snd.amb("wind", 0.4); fromDark(); await sleep(300);
  await chapterTitle(null, "Шахада", "shahada_0");
  await say("shahada_1");
  const pw = Math.min(W * 0.92, 440), ph = Math.round(Math.min(pw * 0.46, H * 0.24)); let ty = H * 0.405 + ph / 2;
  const tab = obj("w4-tablet", '<div class="w4-tin"></div>', W / 2, ty, pw, ph); tab.style.zIndex = 6; fadeIn(tab, 700);
  await say("shahada_2");
  cue("shahada_3"); await sleep(80);
  const cb = w4CapBottom();
  if (cb + 12 > ty - ph / 2) { ty = Math.min(H - ph / 2 - 150, cb + 12 + ph / 2); await move(tab, W / 2, ty, 350, "ease-out"); }
  const bar = el("div", "w4-prog", stage, "<i></i>"); Object.assign(bar.style, { left: W / 2 + "px", top: (ty + ph / 2 + 14) + "px", width: (pw * 0.7) + "px" });
  await w4Trace(tab.querySelector(".w4-tin"), "لا إله إلا الله", p => { bar.firstChild.style.width = (p * 100).toFixed(1) + "%"; });
  fadeOut(bar, 400);
  const sub1 = el("div", "w4-sub", stage, "Ля иляха илля Ллах<br>Нет божества, кроме Аллаха"); Object.assign(sub1.style, { left: W / 2 + "px", top: (ty + ph / 2 + 12) + "px", width: (W - 32) + "px" }); fadeIn(sub1, 600);
  await say("shahada_4");
  const sub2 = el("div", "w4-sub", stage, '<b lang="ar" dir="rtl">مُحَمَّدٌ رَسُولُ اللَّهِ</b>Мухаммад - посланник Аллаха'); Object.assign(sub2.style, { left: W / 2 + "px", top: (ty + ph / 2 + 70) + "px", width: (W - 32) + "px" });
  fadeIn(sub2, 800); Snd.sparkle();
  await say("shahada_5");
  await say("shahada_6", { btn: "Ля иляха илля Ллах" });
  celebrate();
  const misses = await choice("shahada_q", [{ id: "shahada_qa", icon: ICON.sunc }, { id: "shahada_qb", icon: ICON.w4_fire }, { id: "shahada_qc", ar: true, ok: true }], "shahada_q_ok");
  await say("shahada_quran");
  await ayahCard("47:19");
  await say("shahada_end", { btn: "Ля иляха илля Ллах" });
  hideCap(); await award("w4_scroll");
  return misses;
}

/* ============ ГЛАВА 2: ОМОВЕНИЕ ============ */
/* Ловить падающие карточки тазиком по порядку */
function w4CatchSteps(ids, basin, basinY, bw, strip, onGood, onBad) {
  const { W, H } = size();
  return new Promise(res => {
    const cw = Math.min(W * 0.42, 168), ch = 58, vy = H * 0.15;
    const cards = []; let next = 0, fin = false, spawnT = 0.3, last = performance.now(), targetX = basin._x, autoMode = false, noted = 0;
    const field = el("div", "tapfield"); field.style.zIndex = 8;
    const aim = ev => { targetX = Math.max(bw / 2, Math.min(W - bw / 2, local(ev).x)); idle.poke(); autoMode = false; };
    let down = false;
    field.addEventListener("pointerdown", ev => { down = true; aim(ev); });
    field.addEventListener("pointermove", ev => { if (down) aim(ev); });
    const up = () => { down = false; };
    window.addEventListener("pointerup", up); window.addEventListener("pointercancel", up);
    const idle = w4Idle(20000, () => { autoMode = true; });
    const capT = setTimeout(() => { autoMode = true; }, 75000);
    const spawn = () => {
      const onScreen = cards.some(c => c.k === next);
      let k = next;
      if (onScreen || Math.random() < 0.45) { const others = ids.map((_, i) => i).filter(i => i !== next); k = others[Math.floor(Math.random() * others.length)]; }
      const x = rnd(cw / 2 + 8, W - cw / 2 - 8);
      const topY = Math.min(basinY - 150, Math.max(H * 0.35, w4CapBottom() + ch / 2 + 6));
      const c = obj("w4-card", `<b>${k + 1}</b><span>${L(ids[k]).replace(/\.$/, "")}</span>`, x, topY, cw, ch); c.style.zIndex = 7; c.k = k; fadeIn(c, 300);
      cards.push(c);
    };
    const loop = t => {
      if (fin) return;
      const dt = Math.min(0.05, (t - last) / 1000); last = t;
      if (autoMode) { const tgt = cards.filter(c => c.k === next).sort((a, b) => b._y - a._y)[0]; if (tgt) targetX = Math.max(bw / 2, Math.min(W - bw / 2, tgt._x)); }
      put(basin, basin._x + (targetX - basin._x) * Math.min(1, dt * 9), basinY);
      spawnT -= dt;
      if (spawnT <= 0 && cards.length < 3) { spawnT = rnd(1.1, 1.6); spawn(); }
      for (let i = cards.length - 1; i >= 0; i--) {
        const c = cards[i]; if (c.out) continue;
        put(c, c._x, c._y + vy * dt);
        if (c._y + ch / 2 >= basinY - 18 && c._y < basinY && Math.abs(c._x - basin._x) < bw * 0.48) {
          c.out = true; cards.splice(i, 1);
          if (c.k === next) {
            next++; onGood(c, next);
            if (next >= ids.length) { fin = true; cleanup(); setTimeout(res, 900); return; }
          } else {
            onBad(c, next, noted++);
            c.animate([{ translate: "-50% -50%", rotate: "0deg", opacity: 1 }, { translate: `calc(-50% + ${c._x > W / 2 ? -90 : 90}px) calc(-50% - 120px)`, rotate: "40deg", opacity: 0 }], { duration: 700, easing: "ease-out", fill: "forwards" }).onfinish = () => c.remove();
          }
        } else if (c._y > basinY + 30) { c.out = true; cards.splice(i, 1); fadeOut(c, 250); }
      }
      requestAnimationFrame(loop);
    };
    const cleanup = () => { idle.stop(); clearTimeout(capT); field.remove(); window.removeEventListener("pointerup", up); window.removeEventListener("pointercancel", up); cards.forEach(c => fadeOut(c, 300)); };
    requestAnimationFrame(loop);
  });
}
async function chWudu() {
  await toDark(); clearStage();
  const { W, H } = size();
  el("div", "w4-wall");
  el("div", "w4-floor");
  vignette();
  const fw = 130, fh = fw * 0.75, fx = W * 0.64, fy = H * 0.42;
  const tap = obj("w4-faucet", ART.w4_faucet, fx, fy, fw, fh); tap.style.zIndex = 6;
  const spX = fx - fw / 2 + 31 * fw / 120, spY = fy - fh / 2 + 70 * fh / 90;
  const bw = Math.min(W * 0.4, 170), bh = bw * 70 / 160, basinY = H - 130;
  const basin = obj("w4-basin", ART.w4_basin, spX, basinY, bw, bh); basin.style.zIndex = 7;
  const stream = el("div", "w4-stream"); Object.assign(stream.style, { left: spX + "px", top: spY + "px", height: (basinY - bh * 0.25 - spY) + "px" });
  const pour = on => { stream.style.left = spX + "px"; stream.style.opacity = on ? "1" : "0"; };
  Snd.amb(null); fromDark(); await sleep(300);
  await chapterTitle(null, "Омовение", "wudu_0");
  await say("wudu_1");
  /* кран течёт зря: закрыть */
  const gauge = meters([{ label: "Вода", color: "#5BB8E8" }])[0]; gauge.set(1);
  let v = 1; const drain = setInterval(() => { v = Math.max(0.05, v - 0.006); gauge.set(v); if (Math.random() < 0.5) Snd.splash(); }, 120);
  const hit = obj("w4-hit", "", fx - fw / 2 + 70 * fw / 120, fy - fh / 2 + 14 * fh / 90, 60, 60); hit.style.zIndex = 9;
  cue("wudu_2");
  await tapOnce(hit, null, 16000);
  clearInterval(drain); hit.remove();
  const valve = tap.querySelector(".w4-valve"); valve.style.transformBox = "fill-box"; valve.style.transformOrigin = "50% 50%";
  valve.animate([{ transform: "rotate(0deg)" }, { transform: "rotate(90deg)" }, { transform: "rotate(0deg)" }], { duration: 500 });
  Snd.tap(); pour(false); Snd.thud(0.2);
  await say("wudu_3");
  document.querySelectorAll(".meters").forEach(m => fadeOut(m, 300));
  /* ловим шаги омовения */
  const ids = ["wudu_s1", "wudu_s2", "wudu_s3", "wudu_s4", "wudu_s5"];
  const strip = el("div", "w4-strip", app, ids.map((_, i) => `<i>${i + 1}</i>`).join(""));
  const water = basin.querySelector(".w4-bw");
  cue("wudu_4");
  await w4CatchSteps(ids, basin, basinY, bw, strip, async (c, n) => {
    Snd.sparkle(); strip.children[n - 1].classList.add("on");
    water.setAttribute("opacity", (0.25 + n * 0.13).toFixed(2));
    capNote.textContent = (n) + ". " + L(ids[n - 1]);
    Voice.speak(ids[n - 1]);
    await move(c, c._x, basinY - 30, 200, "ease-in"); fadeOut(c, 300);
    for (let i = 0; i < 5; i++) { const d = el("div", "drop"); d.style.zIndex = 8; d.animate([{ left: basin._x + "px", top: (basinY - 20) + "px" }, { left: (basin._x + rnd(-60, 60)) + "px", top: (basinY - rnd(40, 80)) + "px", opacity: 0 }], { duration: 500, easing: "ease-out", fill: "forwards" }).onfinish = () => d.remove(); }
    Snd.splash();
  }, (c, n, k) => {
    Snd.thud(0.35); capNote.textContent = "Сначала карточка " + (n + 1);
    if (k === 0) Voice.speak("wudu_no");
  });
  capNote.textContent = "";
  Snd.sparkle(); celebrate();
  await say("wudu_5");
  fadeOut(strip, 400);
  await say("wudu_6");
  const misses = await choice("wudu_q", [{ id: "wudu_qb", icon: ICON.w4_n5 }, { id: "wudu_qa", icon: ICON.w4_bism, ok: true }, { id: "wudu_qc", icon: ICON.w4_n4 }], "wudu_q_ok");
  await say("wudu_quran");
  await ayahCard("5:6");
  await say("wudu_end", { btn: "Иншаллах" });
  hideCap(); await award("w4_jug");
  return misses;
}

/* ============ ГЛАВА 3: НАМАЗ ============ */
async function chSalah() {
  await toDark(); clearStage();
  const SKY = [[0, "#07142A", "#13294A"], [0.1, "#0D2142", "#2A3E68"], [0.15, "#2C4A7E", "#E79E7E"], [0.21, "#6FB2E2", "#FFD9A0"], [0.3, "#4FA8E0", "#BFE6F7"],
    [0.68, "#5CA6DA", "#D7ECF2"], [0.76, "#6E8FC4", "#F4C98A"], [0.8, "#3D4F7A", "#F08A5D"], [0.86, "#1C2A50", "#6E4E72"], [0.92, "#0B1A33", "#1E2F52"], [1, "#07142A", "#13294A"]];
  const sk = sky(w4SkyAt(SKY, 0)); sk.style.transition = "none";
  const { W, H } = size();
  const stars = w4Stars(60, "0 0 30% 0");
  const sun = sunAt(-200, -200, 110);
  const moon = el("div", "w4-moon", stage, '<svg viewBox="0 0 60 60" aria-hidden="true"><path d="M34 6 A24 24 0 1 0 54 42 A20 20 0 1 1 34 6Z" fill="#FFE29A"/></svg>');
  const horizon = H * 0.74;
  hills(0.27, ["#9FC98A", "#7BB46A", "#5E9E57"]);
  const mw = Math.min(W * 0.72, 300), mh = mw * 150 / 240;
  const mosque = obj("w4-mosqueo", ART.w4_mosque, W / 2, horizon - mh / 2 + 10, mw, mh);
  const mlamps = mosque.querySelectorAll(".w4-mlamp"), wins = mosque.querySelector(".w4-win");
  const veil = el("div", "w4-veil");
  const names = ["Фаджр", "Зухр", "Аср", "Магриб", "Иша"], lines = ["salah_f", "salah_z", "salah_a", "salah_m", "salah_i"], times = [0.125, 0.52, 0.66, 0.815, 0.93];
  const lw = Math.min(W * 0.13, 54), ly = H * 0.85;
  const lamps = names.map((n, i) => {
    const x = W * (0.12 + 0.19 * i);
    const l = obj("w4-lamp", ART.w4_lamp, x, ly, lw, lw * 1.6); l.style.zIndex = 8;
    const t = el("div", "w4-lbl", stage, n); t.style.left = x + "px"; t.style.top = (ly + lw * 0.85) + "px";
    return l;
  });
  vignette();
  let T = 0.02;
  const render = () => {
    sk.style.background = w4SkyAt(SKY, T);
    const u = (T - 0.2) / 0.6;
    if (u > -0.05 && u < 1.05) put(sun, W * (0.08 + 0.84 * u), horizon + 40 - (horizon + 40 - H * 0.37) * Math.sin(Math.PI * Math.max(0, Math.min(1, u)))); else put(sun, -200, -200);
    sun.style.left = sun._x + "px"; sun.style.top = sun._y + "px";
    const night = T < 0.12 ? 1 : T < 0.2 ? 1 - (T - 0.12) / 0.08 : T < 0.8 ? 0 : T < 0.9 ? (T - 0.8) / 0.1 : 1;
    stars.style.opacity = night.toFixed(2); veil.style.opacity = (night * 0.45).toFixed(2);
    moon.style.opacity = (night > 0.6 ? 1 : 0).toString();
    const mx = T < 0.5 ? W * 0.8 : W * 0.2; moon.style.left = mx + "px"; moon.style.top = (H * 0.38) + "px";
    wins.setAttribute("opacity", (0.25 + night * 0.6).toFixed(2));
  };
  render();
  Snd.amb("wind", 0.4); fromDark(); await sleep(300);
  await chapterTitle(null, "Намаз", "salah_0");
  await say("salah_1");
  /* ночью фонарики не зажигаются */
  cue("salah_2");
  await new Promise(r => {
    let n = 0, fin = false;
    const end = () => { if (fin) return; fin = true; lamps.forEach(l => { l.onpointerdown = null; l.classList.remove("hint", "tapme"); }); r(); };
    lamps.forEach(l => { l.classList.add("hint", "tapme"); l.onpointerdown = ev => { ev.preventDefault(); Snd.thud(0.3); l.classList.remove("wob"); void l.offsetWidth; l.classList.add("wob"); l.classList.remove("hint"); if (++n >= 2) setTimeout(end, 500); }; });
    setTimeout(end, 15000);
  });
  await say("salah_3");
  await say("salah_4", { btn: "Начать день" });
  hideCap();
  /* день идёт сам; в своё время фонарик мигает — нажать */
  let k = 0, pending = false, lit = 0, last = performance.now(), fin = false, waitT = 0;
  const light = i => {
    const l = lamps[i]; if (l.classList.contains("on")) return;
    l.classList.remove("blink", "hint"); l.classList.add("on"); l.onpointerdown = null;
    glowSpot(l._x, l._y, 60).style.zIndex = 7; Snd.sparkle();
    mlamps.forEach(m => m.setAttribute("opacity", "1"));
    const mr = mosque.getBoundingClientRect(), sr = stage.getBoundingClientRect();
    [42, 198].forEach(px => w4Rings(mr.left - sr.left + px / 240 * mw, mr.top - sr.top + 56 / 150 * mh, 3, 26, 5));
    Snd.noise({ kind: "pink", f: 600, q: 0.8, dur: 1.4, gain: 0.08, attack: 0.4 });
    setTimeout(() => mlamps.forEach(m => m.setAttribute("opacity", ".2")), 2500);
    lit++; pending = false; k++;
  };
  lamps.forEach((l, i) => { l.onpointerdown = ev => { ev.preventDefault(); if (pending && i === k) light(i); else if (!l.classList.contains("on")) { Snd.thud(0.25); capNote.textContent = L("salah_wait"); l.classList.remove("wob"); void l.offsetWidth; l.classList.add("wob"); } }; });
  await new Promise(r => {
    const loop = t => {
      if (fin) return;
      const dt = Math.min(0.05, (t - last) / 1000); last = t;
      if (k < 5 && !pending && T >= times[k]) {
        pending = true; waitT = 0; lamps[k].classList.add("blink", "hint"); cue(lines[k]); Snd.sparkle();
      }
      if (pending) { waitT += dt; if (waitT > 12) light(k); }
      T = Math.min(1, T + dt * (pending ? 0.0015 : 1 / 34));
      render();
      if (k >= 5 && T >= 0.97) { fin = true; return r(); }
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  });
  lamps.forEach(l => { l.onpointerdown = null; });
  capNote.textContent = "";
  celebrate();
  await say("salah_5");
  const misses = await choice("salah_q", [{ id: "salah_qa", icon: ICON.w4_n1 }, { id: "salah_qb", icon: ICON.w4_n5g, ok: true }, { id: "salah_qc", icon: ICON.w4_n10 }], "salah_q_ok");
  await say("salah_quran");
  await ayahCard("4:103");
  await say("salah_end", { btn: "Иншаллах" });
  hideCap(); await award("w4_rug");
  return misses;
}

/* ============ ГЛАВА 4: ПОСТ ============ */
async function chSawm() {
  await toDark(); clearStage();
  const SKY = [[0, "#2C4A7E", "#E79E7E"], [0.12, "#6FB2E2", "#FFD9A0"], [0.3, "#4FA8E0", "#BFE6F7"], [0.75, "#5CA6DA", "#D7ECF2"], [0.9, "#6E8FC4", "#F4C98A"], [1, "#3D4F7A", "#F08A5D"]];
  const sk = sky(w4SkyAt(SKY, 0)); sk.style.transition = "none";
  const { W, H } = size();
  const horizon = H * 0.76;
  const sun = sunAt(W * 0.08, horizon, 100);
  hills(0.25, ["#E8CF98", "#D9B677", "#C49B5A"]);
  const palm = obj("tree", ART.palm, W * 0.88, horizon + 10, 70, 100); palm.classList.add("grown"); palm.style.zIndex = 2;
  vignette();
  const setT = T => {
    sk.style.background = w4SkyAt(SKY, T);
    put(sun, W * (0.08 + 0.84 * T), horizon + 10 - (horizon + 10 - H * 0.37) * Math.sin(Math.PI * T));
  };
  setT(0);
  Snd.amb("wind", 0.5); fromDark(); await sleep(300);
  await chapterTitle(null, "Пост", "sawm_0");
  await say("sawm_1");
  await say("sawm_2", { btn: "Начать пост" });
  const bar = el("div", "w4-daybar", app, `<span>Рассвет</span><i><b></b><em><svg viewBox="0 0 48 48" aria-hidden="true">${ICON.sunc}</svg></em></i><span>Закат</span>`);
  const fillB = bar.querySelector("i b"), knob = bar.querySelector("i em");
  const cnt = w4Counter("Добрых дел: <b>0</b>", { right: "14px", bottom: "calc(env(safe-area-inset-bottom, 0px) + 74px)" });
  cue("sawm_3");
  const FOOD = [["w4_dates", "Финики"], ["w4_water", "Вода"], ["w4_bread", "Хлеб"], ["fruitc", "Яблоко"], ["w4_sweet", "Конфета"]];
  const GOOD = [["w4_book", "Читать Коран"], ["w4_beads", "Поминать Аллаха"], ["w4_kind", "Доброе слово"], ["w4_give", "Садака"], ["w4_broom", "Помочь дома"]];
  const bs = Math.min(W * 0.24, 96), y0 = H * 0.47, y1 = H - 195;
  const bubs = []; let noteT = null, good = 0, slips = 0, fi = 0, gi = 0, T = 0, last = performance.now(), spawnT = 0.2, fin = false, toldOnce = false;
  const DAY = 34;
  const spawn = () => {
    const isGood = Math.random() < 0.5;
    const [ic, label] = isGood ? GOOD[gi++ % GOOD.length] : FOOD[fi++ % FOOD.length];
    const lane = bubs.length ? bubs[bubs.length - 1].lane : -1;
    let ln = Math.floor(Math.random() * 3); if (ln === lane) ln = (ln + 1) % 3;
    const b = obj("w4-bub" + (isGood ? " w4-good" : " w4-food"), `<div class="w4-bi"><svg viewBox="0 0 48 48" aria-hidden="true">${ICON[ic]}</svg><small>${label}</small></div>`, W + bs, (yt => yt + (y1 - yt) * (ln / 2))(Math.min(y1 - 40, Math.max(y0, w4CapBottom() + bs / 2 + 8))), bs, bs);
    b.style.zIndex = 8; b.lane = ln; b.good = isGood; b.ph = rnd(0, 6); b.vx = W / rnd(6.5, 8);
    b.onpointerdown = ev => {
      ev.preventDefault(); if (b.used) return; b.used = true;
      if (b.good) {
        good++; cnt.querySelector("b").textContent = good; w4Bump(cnt); Snd.pop(); Snd.sparkle();
        b.animate([{ transform: "scale(1)", opacity: 1 }, { transform: "scale(1.5)", opacity: 0 }], { duration: 350, fill: "forwards" }).onfinish = () => b.remove();
        b.gone = true;
      } else {
        slips++; Snd.thud(0.3); b.classList.add("w4-no"); b.vx *= 2.2;
        capNote.textContent = L("sawm_4"); clearTimeout(noteT); noteT = setTimeout(() => { capNote.textContent = ""; }, 2600); if (!toldOnce) { toldOnce = true; Voice.speak("sawm_4"); }
      }
    };
    bubs.push(b);
  };
  await new Promise(r => {
    const loop = t => {
      if (fin) return;
      const dt = Math.min(0.05, (t - last) / 1000); last = t;
      T = Math.min(1, T + dt / DAY); setT(T);
      fillB.style.width = (T * 100) + "%"; knob.style.left = (T * 100) + "%";
      spawnT -= dt; if (T < 0.93 && spawnT <= 0) { spawnT = rnd(1.0, 1.35); spawn(); }
      for (let i = bubs.length - 1; i >= 0; i--) {
        const b = bubs[i];
        if (b.gone) { bubs.splice(i, 1); continue; }
        b.ph += dt * 2; put(b, b._x - b.vx * dt, b._y + Math.sin(b.ph) * 0.4);
        if (b._x < -bs) { b.remove(); bubs.splice(i, 1); }
      }
      if (T >= 1 && !bubs.length) { fin = true; return r(); }
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  });
  capNote.textContent = "";
  fadeOut(bar, 400); fadeOut(cnt, 400);
  /* ифтар */
  Snd.sparkle();
  await say("sawm_5");
  const cloth = el("div", "layer", stage, `<svg viewBox="0 0 200 40" preserveAspectRatio="none" aria-hidden="true"><path d="M10 6 H190 L200 40 H0Z" fill="#C0533A"/><path d="M14 12 H186" stroke="#F5C451" stroke-width="2" stroke-dasharray="6 4"/></svg>`);
  Object.assign(cloth.style, { left: "6%", right: "6%", bottom: "4%", height: "16%", zIndex: 6 });
  const dates = obj("w4-dts", ART.dates, W * 0.36, H * 0.85, 110, 70); dates.style.zIndex = 8; fadeIn(dates);
  const glass = obj("w4-gls", ART.glass, W * 0.66, H * 0.83, 60, 82); glass.style.zIndex = 8; glass.querySelector(".spoon")?.remove(); fadeIn(glass);
  await say("sawm_6", { btn: "Бисмиллях" });
  cue("sawm_7");
  await tapOnce(dates, () => { Snd.tap(); dates.querySelectorAll("ellipse").forEach((e, i) => { if (i < 2) e.remove(); }); Snd.sparkle(); }, 15000);
  await tapOnce(glass, () => { Snd.splash(); const w = glass.querySelector(".water"); if (w) w.setAttribute("d", "M17 80 L63 80 L62 101 L18 101 Z"); }, 15000);
  celebrate();
  await say("sawm_8");
  const misses = await choice("sawm_q", [{ id: "sawm_qa", icon: ICON.w4_sunrise }, { id: "sawm_qb", icon: ICON.w4_noon }, { id: "sawm_qc", icon: ICON.w4_sunset, ok: true }], "sawm_q_ok");
  await say("sawm_quran");
  await ayahCard("2:183");
  await say("sawm_end", { btn: "Иншаллах" });
  hideCap(); await award("w4_fanous");
  return misses;
}

/* ============ ГЛАВА 5: ЗАКЯТ ============ */
/* Смахнуть монетку вверх: она летит по дуге и должна упасть в ящик */
function w4Fling(box, home, need, onIn, onTap) {
  const { W, H } = size();
  return new Promise(res => {
    let given = 0, fin = false, coin = null, track = [], flying = false, taps = 0;
    const g = H * 1.7, cs = 46;
    const boxTop = box._y - box.offsetHeight * 0.36, boxHalf = box.offsetWidth * 0.42;
    const newCoin = () => { coin = obj("w4-coin", ART.w4_coin, home.x, home.y, cs, cs); coin.style.zIndex = 9; coin.classList.add("hint", "tapme"); fadeIn(coin, 300); coin.onpointerdown = dn; };
    const dn = ev => { ev.preventDefault(); if (flying || fin) return; track = [{ ...local(ev), t: performance.now() }]; coin.classList.remove("hint"); idle.poke(); Snd.tap(); };
    const mv = ev => { if (!track.length || flying) return; const p = local(ev); track.push({ ...p, t: performance.now() }); if (track.length > 8) track.shift(); put(coin, home.x + (p.x - track[0].x) * 0.3, home.y + Math.min(0, p.y - track[0].y) * 0.3); };
    const up = () => {
      if (!track.length || flying) return;
      const a = track[0], b = track[track.length - 1], dtt = Math.max(16, b.t - a.t) / 1000;
      let vx = (b.x - a.x) / dtt, vy = (b.y - a.y) / dtt; track = [];
      if (vy > -250) {   /* просто нажали: подсказываем смахнуть, а с третьего раза монетка летит и от нажатия — иначе малыш застрянет */
        put(coin, home.x, home.y);
        if (++taps >= 3) return autoThrow();
        coin.classList.add("hint"); onTap && onTap(); return;
      }
      launch(vx * 0.6, vy);
    };
    const launch = (vx, vy) => {
      const vmax = Math.sqrt(2 * g * (home.y - H * 0.3)), sp = Math.hypot(vx, vy);
      if (sp > vmax) { vx *= vmax / sp; vy *= vmax / sp; }
      flying = true; Snd.whoosh(0.15);
      let x = coin._x, y = coin._y, lt = performance.now(), py = y; const c = coin;
      const step = t => {
        const dt = Math.min(0.04, (t - lt) / 1000); lt = t;
        vy += g * dt; x += vx * dt; y += vy * dt;
        if (x < cs / 2 || x > W - cs / 2) { vx = -vx * 0.6; x = Math.max(cs / 2, Math.min(W - cs / 2, x)); }
        put(c, x, y); c.style.transform = `rotate(${(x * 2) % 360}deg)`;
        if (vy > 0 && py < boxTop && y >= boxTop && Math.abs(x - box._x) < boxHalf) {
          flying = false; given++; Snd.noise({ f: 3200, q: 12, dur: 0.25, gain: 0.25, attack: 0.002 }); Snd.tap();
          move(c, box._x, box._y - 10, 200, "ease-in").then(() => c.remove());
          box.classList.remove("wob"); void box.offsetWidth; box.classList.add("wob");
          onIn(given);
          if (given >= need) { fin = true; cleanup(); setTimeout(res, 700); } else setTimeout(newCoin, 350);
          return;
        }
        py = y;
        if (y > H + 40) { flying = false; c.remove(); Snd.thud(0.2); setTimeout(newCoin, 200); return; }
        requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    /* сам бросок точно в ящик (если ребёнок долго ничего не делает) */
    const autoThrow = () => {
      if (fin || flying || !coin) return;
      const peak = boxTop - H * 0.08, vy = -Math.sqrt(2 * g * (home.y - peak)), tUp = -vy / g, tDown = Math.sqrt(2 * (boxTop + 6 - peak) / g);
      coin.classList.remove("hint"); launch((box._x - home.x) / (tUp + tDown), vy);
    };
    let autoLoop = null;
    const idle = w4Idle(16000, () => { autoLoop = setInterval(autoThrow, 1300); autoThrow(); });
    const cleanup = () => { idle.stop(); clearInterval(autoLoop); window.removeEventListener("pointermove", mv); window.removeEventListener("pointerup", up); window.removeEventListener("pointercancel", up); };
    window.addEventListener("pointermove", mv); window.addEventListener("pointerup", up); window.addEventListener("pointercancel", up);
    newCoin();
  });
}
async function chZakat() {
  await toDark(); clearStage();
  sky("linear-gradient(180deg,#7CC3EA 0%,#BFE5F6 60%,#F6EBD0 100%)");
  const { W, H } = size(); sunAt(W * 0.84, H * 0.34, 100); clouds(2, 0.3, 0.4); hills(0.3, ["#E8D7A8", "#D9C08A", "#C9A86C"]); vignette();
  Snd.amb("wind", 0.5); fromDark(); await sleep(300);
  await chapterTitle(null, "Закят", "zakat_0");
  await say("zakat_1");
  await say("zakat_2");
  const bxw = Math.min(W * 0.36, 140);
  const box = obj("w4-box", ART.w4_box, W / 2, H * 0.47, bxw, bxw * 110 / 130); box.style.zIndex = 7; fadeIn(box);
  const home = { x: W / 2, y: H * 0.8 };
  const purse = obj("w4-purse", ART.w4_purse, W / 2, H * 0.87, 120, 90); purse.style.zIndex = 6; fadeIn(purse);
  const cnt = w4Counter("Монеток: <b>40</b>", { left: "14px", bottom: "calc(env(safe-area-inset-bottom, 0px) + 18px)" });
  const cnt2 = w4Counter("В ящике: <b>0</b>", { right: "14px", bottom: "calc(env(safe-area-inset-bottom, 0px) + 18px)" });
  cue("zakat_3");
  let toldTap = false;
  await w4Fling(box, home, 5, n => {
    cnt.querySelector("b").textContent = 40 - n; cnt2.querySelector("b").textContent = n; w4Bump(cnt2); Snd.sparkle();
    capNote.textContent = n === 1 ? "Это закят!" : "Это садака!";
  }, () => { if (!toldTap) { toldTap = true; cue("zakat_tap"); } });
  capNote.textContent = "";
  celebrate();
  await say("zakat_4");
  /* зерно и семь колосьев */
  await toDark();
  [box, purse, cnt, cnt2].forEach(e => e.remove());
  stage.querySelectorAll(".sunwrap,.cloud").forEach(e => e.remove());
  sunAt(W * 0.16, H * 0.34, 100);
  const groundY = H * 0.84;
  const soil = el("div", "w4-ground", stage, `<svg viewBox="0 0 200 40" preserveAspectRatio="none" aria-hidden="true" style="width:100%;height:100%;display:block"><path d="M0 8 Q100 -4 200 8 V40 H0Z" fill="#9C6B3F"/><path d="M0 14 Q100 4 200 14" stroke="#7A4F2B" stroke-width="2" fill="none"/></svg>`);
  soil.style.height = (H - groundY + 6) + "px"; soil.style.zIndex = 4;
  const counter = w4Counter("Зёрен: <b>1</b>", { left: "50%", translate: "-50% 0", bottom: "calc(env(safe-area-inset-bottom, 0px) + 18px)" });
  const seed = obj("w4-seed", ART.w4_seed, W / 2, groundY - 4, 30, 30); seed.style.zIndex = 6;
  fromDark(); await sleep(400);
  await say("zakat_5", { btn: "Смотреть" });
  hideCap();
  const R = Math.min(W * 0.4, H * 0.3), angs = Array.from({ length: 7 }, (_, i) => (-160 + i * 140 / 6) * Math.PI / 180);
  const tips = angs.map(a => ({ x: W / 2 + R * Math.cos(a), y: groundY - 10 + R * 0.95 * Math.sin(a) - R * 0.15 }));
  const stems = el("div", "layer", stage, `<svg viewBox="0 0 ${W} ${H}" aria-hidden="true">${tips.map(p => `<path d="M${W / 2} ${groundY} Q${W / 2 + (p.x - W / 2) * 0.15} ${(groundY + p.y) / 2} ${p.x} ${p.y + 30}" stroke="#8DB14A" stroke-width="5" fill="none" stroke-linecap="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1"/>`).join("")}<path d="M${W / 2 - 30} ${groundY - 8} Q${W / 2 - 50} ${groundY - 40} ${W / 2 - 64} ${groundY - 30} M${W / 2 + 26} ${groundY - 10} Q${W / 2 + 50} ${groundY - 46} ${W / 2 + 70} ${groundY - 34}" stroke="#7FA642" stroke-width="5" fill="none" stroke-linecap="round" opacity="0" class="w4-lv"/></svg>`);
  stems.style.inset = "0"; stems.style.zIndex = 5;
  Snd.sparkle();
  seed.animate([{ transform: "scale(1)" }, { transform: "scale(1.4)" }, { transform: "scale(0)" }], { duration: 900, fill: "forwards" });
  await sleep(600);
  stems.querySelectorAll("path[pathLength]").forEach((p, i) => p.animate([{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], { duration: 1600, delay: i * 120, easing: "ease-out", fill: "forwards" }));
  stems.querySelector(".w4-lv").animate([{ opacity: 0 }, { opacity: 1 }], { duration: 1200, delay: 800, fill: "forwards" });
  Snd.noise({ kind: "pink", f: 500, f2: 1400, q: 0.6, dur: 2.2, gain: 0.12, attack: 0.6 });
  await sleep(1900);
  const ew = Math.min(W * 0.1, 40), eh = ew * 2.25;
  const ears = tips.map((p, i) => {
    const e = obj("w4-ear", ART.w4_ear, p.x, p.y, ew, eh); e.style.zIndex = 7;
    e.style.rotate = ((angs[i] * 180 / Math.PI) + 90) * 0.55 + "deg";
    e.animate([{ transform: "scale(0)" }, { transform: "scale(1)" }], { duration: 500, delay: i * 120, easing: "cubic-bezier(.2,1.5,.4,1)", fill: "backwards" });
    return e;
  });
  await sleep(1300);
  const cb = counter.querySelector("b");
  counter.firstChild.textContent = "В колосьях зёрен: "; cb.textContent = "0";
  await say("zakat_6", { btn: "Считать" });
  hideCap();
  let total = 0, opened = 0;
  await new Promise(r => {
    let fin = false;
    const open = async e => {
      if (e.open || fin) return; e.open = true; e.classList.remove("hint", "tapme"); opened++;
      e.style.filter = "drop-shadow(0 0 10px #FFE08A)"; Snd.sparkle(); idle.poke();
      const cr = counter.getBoundingClientRect(), sr = stage.getBoundingClientRect(), cx = cr.left - sr.left + cr.width / 2, cy = cr.top - sr.top;
      for (let i = 0; i < 12; i++) { const gr = el("div", "w4-grain"); gr.animate([{ left: (e._x + rnd(-10, 10)) + "px", top: (e._y + rnd(-20, 20)) + "px" }, { left: cx + "px", top: cy + "px", opacity: .2 }], { duration: rnd(500, 800), delay: i * 30, easing: "ease-in", fill: "forwards" }).onfinish = () => gr.remove(); }
      const from = total; total += 100;
      for (let s = 1; s <= 10; s++) setTimeout(() => { cb.textContent = from + 10 * s; w4Bump(counter); }, s * 50);
      if (opened >= 7) { fin = true; idle.stop(); setTimeout(() => { cb.textContent = "700"; r(); }, 900); }
    };
    ears.forEach(e => { e.classList.add("hint", "tapme"); e.onpointerdown = ev => { ev.preventDefault(); open(e); }; });
    const idle = w4Idle(15000, async () => { for (const e of ears) { if (fin) break; await open(e); await sleep(450); } });
  });
  ears.forEach(e => { e.onpointerdown = null; });
  cb.textContent = "700";
  counter.style.fontSize = "18px";
  celebrate();
  await say("zakat_7");
  const misses = await choice("zakat_q", [{ id: "zakat_qa", icon: ICON.w4_jar }, { id: "zakat_qb", ar: true, ok: true }, { id: "zakat_qc", icon: ICON.w4_chest }], "zakat_q_ok");
  fadeOut(counter, 300);
  await say("zakat_quran");
  await ayahCard("2:261");
  await say("zakat_end", { btn: "Иншаллах" });
  hideCap(); await award("w4_wheat");
  return misses;
}

/* ============ ГЛАВА 6: ХАДЖ ============ */
/* Вести самолётик пальцем по дороге на карте. stops — доли пути, где путь останавливается (onStop) */
function w4Route(pts, plane, stopAt, onStop) {
  return new Promise(res => {
    /* равномерные точки пути */
    const P = []; for (let i = 0; i < pts.length - 1; i++) { const a = pts[i], b = pts[i + 1], n = Math.ceil(Math.hypot(b.x - a.x, b.y - a.y) / 4); for (let j = 0; j < n; j++) P.push({ x: a.x + (b.x - a.x) * j / n, y: a.y + (b.y - a.y) * j / n }); }
    P.push(pts[pts.length - 1]);
    const stopI = Math.round(P.length * stopAt);
    let i = 0, fin = false, paused = false, stopped = false, down = false;
    const place = () => { const a = P[Math.max(0, i - 3)], b = P[Math.min(P.length - 1, i + 3)]; put(plane, P[i].x, P[i].y); plane.style.rotate = (Math.atan2(b.y - a.y, b.x - a.x) * 180 / Math.PI).toFixed(0) + "deg"; trail(); };
    const trailEl = el("div", "layer", stage, `<svg viewBox="0 0 ${size().W} ${size().H}" aria-hidden="true"><polyline fill="none" stroke="#E8584C" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" points=""/></svg>`);
    trailEl.style.inset = "0"; trailEl.style.zIndex = 6; const pl = trailEl.querySelector("polyline");
    const trail = () => pl.setAttribute("points", P.slice(0, i + 1).filter((_, j) => j % 3 === 0 || j === i).map(p => p.x.toFixed(0) + "," + p.y.toFixed(0)).join(" "));
    const advanceTo = async j => {
      if (fin || paused) return;
      if (!stopped && j >= stopI) { i = stopI; place(); stopped = true; paused = true; down = false; await onStop(); paused = false; idle.poke(); return; }
      i = Math.min(P.length - 1, j); place();
      if (i >= P.length - 1) { fin = true; cleanup(); res(); }
    };
    const near = ev => {
      if (!down || fin || paused) return; idle.poke();
      const p = local(ev); let best = -1, bd = 70;
      for (let j = i; j < Math.min(P.length, i + 60); j++) { const d = Math.hypot(P[j].x - p.x, P[j].y - p.y); if (d < bd) { bd = d; best = j; } }
      if (best > i) { if (Math.random() < 0.15) Snd.noise({ kind: "pink", f: 900, q: 1, dur: 0.15, gain: 0.05 }); advanceTo(best); }
    };
    const field = el("div", "tapfield"); field.style.zIndex = 8;
    const dn = ev => { const p = local(ev); if (Math.hypot(p.x - P[i].x, p.y - P[i].y) < 80) { down = true; plane.classList.remove("hint"); near(ev); } };
    const up = () => { down = false; };
    field.addEventListener("pointerdown", dn); field.addEventListener("pointermove", near);
    window.addEventListener("pointerup", up); window.addEventListener("pointercancel", up);
    plane.classList.add("hint");
    const auto = async () => { while (!fin) { if (!paused) await advanceTo(i + 3); await sleep(30); } };
    const idle = w4Idle(18000, auto);
    const cleanup = () => { idle.stop(); field.remove(); window.removeEventListener("pointerup", up); window.removeEventListener("pointercancel", up); plane.classList.remove("hint"); };
    place();
  });
}
/* Круговой жест вокруг центра (cx, cy) против часовой стрелки, laps кругов */
function w4Circle(cx, cy, rx, ry, laps, marker, onLap, onWrong) {
  return new Promise(res => {
    let acc = 0, wrong = 0, lastA = null, down = false, fin = false, done = 0, autoOn = false;
    const field = el("div", "tapfield"); field.style.zIndex = 8;
    const angOf = p => Math.atan2((p.y - cy) / ry, (p.x - cx) / rx);
    const showAt = a => put(marker, cx + rx * Math.cos(a), cy + ry * Math.sin(a));
    let shownA = Math.PI / 2; showAt(shownA);
    const addTurn = d => {   /* d > 0: против часовой стрелки на экране */
      if (d > 0) { acc += d; wrong = 0; } else { wrong += -d; if (wrong > Math.PI * 0.6) { wrong = 0; onWrong(); } }
      shownA -= Math.max(0, d); showAt(shownA);
      while (acc >= Math.PI * 2 * (done + 1) && done < laps) { done++; onLap(done); }
      if (done >= laps && !fin) { fin = true; cleanup(); setTimeout(res, 700); }
    };
    const handle = ev => {
      const p = local(ev), rn = Math.hypot((p.x - cx) / rx, (p.y - cy) / ry);
      if (rn < 0.3) { lastA = null; return; }
      const a = angOf(p);
      if (lastA != null) { let d = a - lastA; if (d > Math.PI) d -= 2 * Math.PI; if (d < -Math.PI) d += 2 * Math.PI; addTurn(-d); }
      lastA = a;
    };
    field.addEventListener("pointerdown", ev => { down = true; lastA = null; autoOn = false; idle.poke(); marker.classList.remove("hint"); handle(ev); });
    field.addEventListener("pointermove", ev => { if (!down || fin) return; idle.poke(); handle(ev); });
    const up = () => { down = false; lastA = null; };
    window.addEventListener("pointerup", up); window.addEventListener("pointercancel", up);
    marker.classList.add("hint");
    const idle = w4Idle(15000, async () => { autoOn = true; while (!fin && autoOn) { addTurn(0.09); await sleep(16); } });
    const cleanup = () => { idle.stop(); field.remove(); window.removeEventListener("pointerup", up); window.removeEventListener("pointercancel", up); marker.classList.remove("hint"); };
  });
}
async function chHajj() {
  await toDark(); clearStage();
  sky("linear-gradient(180deg,#5AB2E4 0%,#A9DCF3 60%,#F3E8C4 100%)");
  const { W, H } = size();
  /* карта */
  const mt = H * 0.33, mb = H * 0.97, mapH = mb - mt, mapW = W * 0.94, mx0 = W * 0.03;
  const map = el("div", "w4-map", stage, `<svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
    <rect width="100" height="100" fill="#F1DFB4"/>
    <path d="M0 0 H34 Q30 20 18 26 Q6 32 0 44Z" fill="#8FCBE6"/><path d="M100 64 Q86 70 84 84 Q82 96 72 100 H100Z" fill="#8FCBE6"/>
    <path d="M44 30 L52 18 L60 30Z M56 34 L64 22 L72 34Z M12 70 L20 58 L28 70Z" fill="#C9A86C"/><path d="M52 18 L49 22.5 L55 22.5Z M64 22 L61 26.5 L67 26.5Z" fill="#fff" opacity=".8"/>
    ${Array.from({ length: 18 }, () => `<circle cx="${rnd(4, 96).toFixed(1)}" cy="${rnd(4, 96).toFixed(1)}" r="${rnd(0.4, 0.9).toFixed(1)}" fill="#D2B47A"/>`).join("")}
    <path d="M2 2 H98 V98 H2Z" fill="none" stroke="#C9A55A" stroke-width=".8" stroke-dasharray="2 1.5"/></svg>`);
  Object.assign(map.style, { top: mt + "px", height: mapH + "px", zIndex: 3 });
  const mp = (fx, fy) => ({ x: mx0 + mapW * fx, y: mt + mapH * fy });
  const route = [[0.12, 0.88], [0.3, 0.86], [0.42, 0.74], [0.3, 0.6], [0.36, 0.47], [0.56, 0.5], [0.76, 0.6], [0.88, 0.46], [0.78, 0.3], [0.62, 0.22], [0.8, 0.12]].map(([a, b]) => mp(a, b));
  const road = el("div", "layer", stage, `<svg viewBox="0 0 ${W} ${H}" aria-hidden="true"><polyline points="${route.map(p => p.x.toFixed(0) + "," + p.y.toFixed(0)).join(" ")}" fill="none" stroke="#8E6A43" stroke-width="4" stroke-dasharray="9 8" stroke-linecap="round" stroke-linejoin="round"/></svg>`);
  road.style.inset = "0"; road.style.zIndex = 4;
  const homeP = route[0], mecca = route[route.length - 1];
  const house = obj("w4-home", ART.house, homeP.x, homeP.y - 6, 46, 46); house.style.zIndex = 5;
  const kmini = obj("w4-km", ART.w4_kaaba, mecca.x, mecca.y - 4, 44, 41); kmini.style.zIndex = 5;
  const tg = el("div", "w4-tag", stage, "Мекка"); tg.style.left = mecca.x + "px"; tg.style.top = (mecca.y + 30) + "px"; tg.style.zIndex = 5;
  const stopAt = 0.78;
  const plane = obj("w4-pl", ART.w4_plane, homeP.x, homeP.y, 50, 50); plane.style.zIndex = 9;
  vignette();
  Snd.amb("wind", 0.5); fromDark(); await sleep(300);
  await chapterTitle(null, "Хадж", "hajj_0");
  await say("hajj_1");
  cue("hajj_2");
  await w4Route(route.map(p => ({ x: p.x, y: p.y })), plane, stopAt, async () => {
    Snd.sparkle();
    const ih = obj("w4-ih", ART.w4_ihram, plane._x + (plane._x > W / 2 ? -60 : 60), plane._y - 30, 64, 48); ih.style.zIndex = 9; fadeIn(ih);
    const t2 = el("div", "w4-tag", stage, "Микат"); t2.style.left = ih._x + "px"; t2.style.top = (ih._y + 34) + "px"; t2.style.zIndex = 9;
    await say("hajj_3");
    cue("hajj_3b");
  });
  Snd.sparkle(); celebrate();
  await sleep(800);
  hideCap();
  /* Кааба и таваф */
  await toDark();
  [map, road, house, kmini, tg, plane].forEach(e => e.remove()); stage.querySelectorAll(".w4-tag,.w4-ih,.layer").forEach(e => e.remove());
  const sk = stage.querySelector(".sky"); sk.style.transition = "none"; sk.style.background = "linear-gradient(180deg,#14335A 0%,#2D5C8A 55%,#6E93B5 100%)";
  w4Stars(40, "0 0 60% 0");
  const ground = el("div", "w4-mataf"); ground.style.top = (H * 0.42) + "px";
  const cx = W / 2, cy = H * 0.64, rx = Math.min(W * 0.42, 190), ry = rx * 0.5;
  const ring = el("div", "layer", stage, `<svg viewBox="0 0 ${W} ${H}" aria-hidden="true"><defs><marker id="w4arr" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0 L10 5 L0 10Z" fill="#C9A24E"/></marker></defs>
    <ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="none" stroke="#C9B48A" stroke-width="3" stroke-dasharray="10 8"/>
    ${[0.25, 0.75, 1.25, 1.75].map(f => { const a1 = Math.PI * f, a2 = a1 - 0.35; return `<path d="M${(cx + rx * Math.cos(a1)).toFixed(1)} ${(cy + ry * Math.sin(a1)).toFixed(1)} A${rx} ${ry} 0 0 0 ${(cx + rx * Math.cos(a2)).toFixed(1)} ${(cy + ry * Math.sin(a2)).toFixed(1)}" fill="none" stroke="#C9A24E" stroke-width="4" marker-end="url(#w4arr)"/>`; }).join("")}</svg>`);
  ring.style.inset = "0"; ring.style.zIndex = 4;
  const kw = Math.min(W * 0.36, 150), kaaba = obj("w4-kaaba", ART.w4_kaaba, cx, cy - kw * 0.32, kw, kw * 150 / 160); kaaba.style.zIndex = 6;
  const marker = obj("w4-mk", '<svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="16" fill="rgba(255,226,140,.45)"/><circle cx="20" cy="20" r="9" fill="#FFF3C4" stroke="#E6A93A" stroke-width="3"/></svg>', cx, cy + ry, 40, 40);
  marker.style.zIndex = 7;
  const lapBox = w4Counter(`Круг: <b>0</b> из 7<div class="w4-laps">${"<i></i>".repeat(7)}</div>`, { left: "50%", translate: "-50% 0", bottom: "calc(env(safe-area-inset-bottom, 0px) + 16px)", textAlign: "center" });
  vignette();
  Snd.amb("wind", 0.3); fromDark(); await sleep(400);
  await say("hajj_4");
  cue("hajj_5");
  let told = 0;
  await w4Circle(cx, cy, rx, ry, 7, marker, n => {
    lapBox.querySelector("b").textContent = n; lapBox.querySelectorAll(".w4-laps i")[n - 1].classList.add("on"); w4Bump(lapBox); Snd.sparkle();
    w4Rings(kaaba._x, kaaba._y, 1, kw * 0.8, 1.8);
  }, () => { capNote.textContent = L("hajj_cw"); Snd.thud(0.25); if (told++ === 0) Voice.speak("hajj_cw"); });
  capNote.textContent = "";
  celebrate();
  await say("hajj_6");
  await say("hajj_7");
  fadeOut(lapBox, 300);
  const misses = await choice("hajj_q", [{ id: "hajj_qb", icon: ICON.w4_hajj }, { id: "hajj_qa", ar: true, ok: true }, { id: "hajj_qc", icon: ICON.w4_crown }], "hajj_q_ok");
  await say("hajj_quran");
  await ayahCard("22:27");
  await say("hajj_end", { btn: "Амин" });
  hideCap(); await award("w4_zamzam");
  return misses;
}

/* ============ РЕГИСТРАЦИЯ ============ */
regChapter(3, { id: "shahada", name: "Шахада", icon: ICON.w4_shahada, fn: chShahada, lines: "shahada_" });
regChapter(3, { id: "wudu", name: "Омовение", icon: ICON.w4_wudu, fn: chWudu, lines: "wudu_" });
regChapter(3, { id: "salah", name: "Намаз", icon: ICON.w4_salah, fn: chSalah, lines: "salah_" });
regChapter(3, { id: "sawm", name: "Пост", icon: ICON.w4_sawm, fn: chSawm, lines: "sawm_" });
regChapter(3, { id: "zakat", name: "Закят", icon: ICON.w4_zakat, fn: chZakat, lines: "zakat_" });
regChapter(3, { id: "hajj", name: "Хадж", icon: ICON.w4_hajj, fn: chHajj, lines: "hajj_" });
