"use strict";
/* ============ РИСУНКИ (в игре нет изображений живых существ) ============ */
const ART = {
  sun: `<svg viewBox="0 0 120 120" aria-hidden="true"><defs><radialGradient id="gSun" cx=".45" cy=".4" r=".6"><stop offset="0" stop-color="#FFF8D2"/><stop offset=".55" stop-color="#FFD66B"/><stop offset="1" stop-color="#F7B32B"/></radialGradient>
    <radialGradient id="gSunHalo" cx=".5" cy=".5" r=".5"><stop offset=".45" stop-color="#FFE7A0" stop-opacity=".7"/><stop offset="1" stop-color="#FFE7A0" stop-opacity="0"/></radialGradient></defs>
    <circle cx="60" cy="60" r="60" fill="url(#gSunHalo)"/>
    <g class="rays" stroke="#FFE08A" stroke-width="4" stroke-linecap="round" opacity=".8">${Array.from({ length: 12 }, (_, i) => { const a = i * Math.PI / 6; return `<line x1="${(60 + 36 * Math.cos(a)).toFixed(1)}" y1="${(60 + 36 * Math.sin(a)).toFixed(1)}" x2="${(60 + 46 * Math.cos(a)).toFixed(1)}" y2="${(60 + 46 * Math.sin(a)).toFixed(1)}"/>`; }).join("")}</g>
    <circle cx="60" cy="60" r="28" fill="url(#gSun)"/></svg>`,
  cloud: `<svg viewBox="0 0 160 80" aria-hidden="true"><defs><linearGradient id="gCloud" x1="0" y1="0" x2="0" y2="1"><stop offset=".45" stop-color="#FFFFFF"/><stop offset="1" stop-color="#DCEAF2"/></linearGradient></defs>
    <path d="M30 72 Q8 72 10 54 Q12 38 32 40 Q34 18 58 16 Q78 4 96 20 Q118 12 128 34 Q152 34 150 54 Q150 72 128 72 Z" fill="url(#gCloud)"/></svg>`,
  plane: `<svg viewBox="0 0 100 60" aria-hidden="true">
    <path d="M4 30 L96 8 L40 40 Z" fill="#FFFFFF" stroke="#B6C7CF" stroke-width="1.5" stroke-linejoin="round"/>
    <path d="M40 40 L96 8 L52 52 Z" fill="#E4EDF1" stroke="#B6C7CF" stroke-width="1.5" stroke-linejoin="round"/>
    <path d="M40 40 L46 56 L52 52 Z" fill="#C9D8DF" stroke="#B6C7CF" stroke-width="1.5" stroke-linejoin="round"/></svg>`,
  pillar: `<svg viewBox="0 0 40 140" aria-hidden="true"><defs><linearGradient id="gStone" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#E9DCC2"/><stop offset=".5" stop-color="#FFF6E3"/><stop offset="1" stop-color="#CDBB98"/></linearGradient></defs>
    <rect x="2" y="0" width="36" height="12" rx="3" fill="#D8C7A4"/><rect x="7" y="12" width="26" height="114" fill="url(#gStone)"/>
    <path d="M14 14 V124 M20 14 V124 M26 14 V124" stroke="#D8C7A4" stroke-width="1.5"/><rect x="0" y="126" width="40" height="14" rx="3" fill="#C8B590"/></svg>`,
  roof: `<svg viewBox="0 0 200 30" preserveAspectRatio="none" aria-hidden="true"><defs><linearGradient id="gWood" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C98B52"/><stop offset="1" stop-color="#8E5A2E"/></linearGradient></defs>
    <rect x="0" y="4" width="200" height="22" rx="6" fill="url(#gWood)"/><path d="M8 12 H120 M60 19 H192" stroke="#7A4A24" stroke-width="2" opacity=".5"/></svg>`,
  balloon: `<svg viewBox="0 0 60 130" aria-hidden="true"><defs><radialGradient id="gBal" cx=".35" cy=".3" r=".75"><stop offset="0" stop-color="#FF9C8F"/><stop offset=".6" stop-color="#F25C4F"/><stop offset="1" stop-color="#C73E33"/></radialGradient></defs>
    <path d="M30 66 Q22 86 30 100 Q38 114 30 130" stroke="#48606B" stroke-width="1.6" fill="none"/>
    <ellipse cx="30" cy="32" rx="25" ry="31" fill="url(#gBal)"/><ellipse cx="21" cy="19" rx="6" ry="10" fill="#fff" opacity=".5"/><path d="M26 62 L34 62 L30 68Z" fill="#C73E33"/></svg>`,
  fan: `<svg viewBox="0 0 100 80" aria-hidden="true"><defs><linearGradient id="gFan" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFB38F"/><stop offset="1" stop-color="#F07A55"/></linearGradient></defs>
    <path d="M50 76 L4 32 A64 64 0 0 1 96 32 Z" fill="url(#gFan)"/>
    <g stroke="#D9603F" stroke-width="2">${[-60, -40, -20, 0, 20, 40, 60].map(a => { const r = Math.PI * (a - 90) / 180; return `<line x1="50" y1="76" x2="${(50 + 64 * Math.cos(r)).toFixed(1)}" y2="${(76 + 64 * Math.sin(r)).toFixed(1)}"/>`; }).join("")}</g>
    <path d="M14 26 A60 60 0 0 1 86 26" stroke="#F5C451" stroke-width="5" fill="none"/><circle cx="50" cy="74" r="6" fill="#7A4A24"/></svg>`,
  jug: `<svg viewBox="0 0 90 100" aria-hidden="true"><defs><linearGradient id="gClay" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#A9542F"/><stop offset=".45" stop-color="#D98552"/><stop offset="1" stop-color="#8C3F20"/></linearGradient></defs>
    <path d="M24 34 Q10 36 12 52 Q14 64 26 64" fill="none" stroke="#9A4A28" stroke-width="7" stroke-linecap="round"/>
    <path d="M34 10 H58 L56 22 Q80 34 78 62 Q76 94 46 94 Q16 94 14 62 Q12 34 36 22 Z" fill="url(#gClay)"/>
    <path d="M58 12 L76 4 L72 14 Z" fill="#B9603A"/><path d="M20 58 Q46 66 72 58" stroke="#F5C451" stroke-width="3" fill="none" opacity=".8"/>
    <ellipse cx="34" cy="48" rx="5" ry="12" fill="#fff" opacity=".18"/></svg>`,
  glass: `<svg viewBox="0 0 80 110" aria-hidden="true"><defs><linearGradient id="gWater" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#BFE6F7" stop-opacity=".9"/><stop offset="1" stop-color="#6BC0E6" stop-opacity=".9"/></linearGradient></defs>
    <g class="spoon"><path d="M58 0 L40 76" stroke="#A9B6BC" stroke-width="4" stroke-linecap="round"/><ellipse cx="39" cy="80" rx="6" ry="9" fill="#A9B6BC"/></g>
    <path d="M12 20 L68 20 L62 104 L18 104 Z" fill="rgba(255,255,255,.35)" stroke="#9EB4BE" stroke-width="3" stroke-linejoin="round"/>
    <path class="water" d="M15 46 L65 46 L62 101 L18 101 Z" fill="url(#gWater)"/>
    <path d="M20 28 L24 96" stroke="#fff" stroke-width="4" opacity=".55" stroke-linecap="round"/></svg>`,
  apple: `<svg viewBox="0 0 120 170" aria-hidden="true"><defs><linearGradient id="gTrunk" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#7A4A24"/><stop offset=".5" stop-color="#A26A3A"/><stop offset="1" stop-color="#6A3E1C"/></linearGradient>
    <radialGradient id="gLeaf" cx=".4" cy=".35" r=".7"><stop offset="0" stop-color="#9BDB7E"/><stop offset="1" stop-color="#4E9D45"/></radialGradient></defs>
    <path d="M54 170 Q52 120 56 92 L64 92 Q68 120 66 170 Z" fill="url(#gTrunk)"/><path d="M58 108 Q44 98 38 84 M62 104 Q76 96 80 84" stroke="#7A4A24" stroke-width="6" fill="none" stroke-linecap="round"/>
    <circle cx="60" cy="52" r="40" fill="url(#gLeaf)"/><circle cx="30" cy="70" r="26" fill="url(#gLeaf)"/><circle cx="90" cy="68" r="26" fill="url(#gLeaf)"/><circle cx="60" cy="80" r="26" fill="url(#gLeaf)"/>
    <g class="fruit">${[[38, 58], [64, 40], [84, 64], [52, 80], [74, 86], [28, 80]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="7.5" fill="#E8463C"/><circle cx="${x - 2.5}" cy="${y - 2.5}" r="2.2" fill="#fff" opacity=".6"/>`).join("")}</g></svg>`,
  palm: `<svg viewBox="0 0 120 170" aria-hidden="true">
    <path d="M56 170 Q50 120 58 60 L66 60 Q60 120 66 170 Z" fill="#A87A4A"/>${Array.from({ length: 9 }, (_, i) => `<path d="M${55 + i * 0.3} ${160 - i * 11} Q62 ${156 - i * 11} ${68 - i * 0.2} ${160 - i * 11}" stroke="#7E5630" stroke-width="2" fill="none"/>`).join("")}
    <g class="fruit">${[[50, 66], [56, 72], [62, 68], [68, 74], [74, 66], [46, 74], [60, 78]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="4" ry="6" fill="#8A4B1F"/>`).join("")}</g>
    <g fill="#5DAE4F" stroke="#3F8A3B" stroke-width="1.5">${[[-160, 52], [-130, 58], [-95, 50], [-60, 58], [-25, 52], [-178, 40], [-2, 40]].map(([a, l]) => { const r = a * Math.PI / 180, x2 = 62 + l * Math.cos(r), y2 = 58 + l * Math.sin(r) + 14; return `<path d="M62 58 Q${(62 + l * 0.5 * Math.cos(r)).toFixed(1)} ${(58 + l * 0.5 * Math.sin(r) - 12).toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)} Q${(62 + l * 0.55 * Math.cos(r)).toFixed(1)} ${(58 + l * 0.55 * Math.sin(r)).toFixed(1)} 62 62Z"/>`; }).join("")}</g></svg>`,
  vine: `<svg viewBox="0 0 120 170" aria-hidden="true">
    <rect x="16" y="50" width="8" height="120" rx="3" fill="#8E5A2E"/><rect x="96" y="50" width="8" height="120" rx="3" fill="#8E5A2E"/><rect x="8" y="46" width="104" height="10" rx="4" fill="#A26A3A"/>
    <path d="M60 170 Q54 130 62 100 Q70 76 52 56" stroke="#6A3E1C" stroke-width="6" fill="none" stroke-linecap="round"/>
    <g fill="#6DBE59" stroke="#418C3C" stroke-width="1.5">${[[22, 44], [42, 38], [62, 42], [84, 38], [102, 46], [34, 62], [76, 60], [56, 70]].map(([x, y]) => `<path d="M${x} ${y} q-10 -6 -6 -14 q6 2 6 -6 q4 6 10 2 q0 10 -10 18z"/>`).join("")}</g>
    <g class="fruit">${[[36, 66], [86, 66]].map(([x, y]) => [[0, 0], [8, 0], [16, 0], [4, 7], [12, 7], [8, 14], [-4, 7]].map(([dx, dy]) => `<circle cx="${x + dx - 6}" cy="${y + dy}" r="4.6" fill="#7B4FA0"/><circle cx="${x + dx - 7.5}" cy="${y + dy - 1.5}" r="1.3" fill="#fff" opacity=".5"/>`).join("")).join("")}</g></svg>`,
  ship: `<svg viewBox="0 0 160 160" aria-hidden="true"><defs><linearGradient id="gHull" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#A86A3C"/><stop offset="1" stop-color="#6A3E1F"/></linearGradient>
    <linearGradient id="gSail" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#FFFDF5"/><stop offset="1" stop-color="#EADFC4"/></linearGradient></defs>
    <path d="M83 14 L106 8 L83 2Z" fill="#F5C451"/><rect x="79" y="2" width="5" height="110" rx="2" fill="#5D3B22"/>
    <path class="sail-full" d="M84 16 Q152 58 84 104 Z" fill="url(#gSail)" stroke="#D9CBA8" stroke-width="2"/>
    <path class="sail-full" d="M78 24 Q38 66 78 100 Z" fill="url(#gSail)" stroke="#D9CBA8" stroke-width="2"/>
    <path class="sail-slack" d="M84 16 Q94 60 87 104 L84 104 Z" fill="url(#gSail)" stroke="#D9CBA8" stroke-width="2"/>
    <path class="sail-slack" d="M78 24 Q71 66 78 100 Z" fill="url(#gSail)" stroke="#D9CBA8" stroke-width="2"/>
    <path d="M10 108 L150 108 L130 142 L30 142 Z" fill="url(#gHull)"/><path d="M14 115 L146 115" stroke="#F5C451" stroke-width="4"/>
    ${[52, 80, 108].map(x => `<circle cx="${x}" cy="128" r="5" fill="#2C1A0E"/><circle cx="${x}" cy="128" r="5" fill="none" stroke="#F5C451" stroke-width="1.5"/>`).join("")}</svg>`,
  efan: `<svg viewBox="0 0 100 140" aria-hidden="true">
    <rect x="46" y="70" width="8" height="52" fill="#9FB7C0"/><rect x="20" y="116" width="60" height="18" rx="9" fill="#4F6F7C"/><circle cx="66" cy="125" r="5" fill="#E35D52"/>
    <circle cx="50" cy="46" r="40" fill="rgba(255,255,255,.35)" stroke="#8FA9B4" stroke-width="4"/>
    <g class="fanblades">${[0, 120, 240].map(a => `<ellipse cx="50" cy="26" rx="10" ry="19" fill="#3FA2CF" transform="rotate(${a} 50 46)"/>`).join("")}</g><circle cx="50" cy="46" r="7" fill="#4F6F7C"/></svg>`,
  sand: `<svg viewBox="0 0 120 70" aria-hidden="true"><defs><radialGradient id="gSand" cx=".45" cy=".3" r=".8"><stop offset="0" stop-color="#F3D9A4"/><stop offset="1" stop-color="#C9A064"/></radialGradient></defs>
    <path d="M4 68 Q30 20 60 10 Q90 20 116 68Z" fill="url(#gSand)"/>${[[40, 50], [62, 34], [80, 54], [54, 58], [30, 62], [92, 62]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.6" fill="#B08852"/>`).join("")}</svg>`,
  tent: `<svg viewBox="0 0 160 120" aria-hidden="true"><defs><linearGradient id="gTent" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#E8754F"/><stop offset=".5" stop-color="#F59A6B"/><stop offset="1" stop-color="#D2603D"/></linearGradient></defs>
    <path d="M14 118 L80 10 L146 118Z" fill="url(#gTent)"/><path d="M80 10 L64 118 H96Z" fill="#9C4128"/><path d="M80 10 V118" stroke="#7E3320" stroke-width="2"/>
    <path d="M80 10 L2 118 M80 10 L158 118" stroke="#8E6A43" stroke-width="1.6" stroke-dasharray="4 3" fill="none"/></svg>`,
  stake: `<svg viewBox="0 0 24 50" aria-hidden="true"><rect x="8" y="2" width="8" height="34" rx="2" fill="#A26A3A"/><path d="M8 36 L12 48 L16 36Z" fill="#8E5A2E"/><rect x="5" y="2" width="14" height="5" rx="2" fill="#7A4A24"/></svg>`,
  lantern: `<svg viewBox="0 0 50 74" aria-hidden="true"><path d="M15 12 Q25 0 35 12" fill="none" stroke="#4F6F7C" stroke-width="3"/>
    <rect x="12" y="12" width="26" height="6" rx="2" fill="#4F6F7C"/><rect x="14" y="18" width="22" height="40" rx="5" fill="rgba(255,240,200,.35)" stroke="#4F6F7C" stroke-width="3"/>
    <path class="flamel" d="M25 26 Q32 36 28 44 Q25 48 22 44 Q18 36 25 26Z" fill="#FFC94A" opacity=".25"/><rect x="10" y="58" width="30" height="8" rx="3" fill="#4F6F7C"/></svg>`,
  heater: `<svg viewBox="0 0 90 80" aria-hidden="true"><rect x="6" y="10" width="78" height="56" rx="10" fill="#E7EEF1" stroke="#9FB2BA" stroke-width="3"/>
    <g class="coils" stroke="#B9C6CC" stroke-width="5" stroke-linecap="round">${[22, 36, 50, 64].map(x => `<path d="M${x} 20 V56"/>`).join("")}</g>
    <rect x="16" y="66" width="10" height="10" rx="2" fill="#7E9099"/><rect x="64" y="66" width="10" height="10" rx="2" fill="#7E9099"/><circle cx="76" cy="18" r="3" fill="#E35D52"/></svg>`,
  lighthouse: `<svg viewBox="0 0 120 120" aria-hidden="true"><path d="M0 110 Q40 86 70 94 Q100 86 120 110Z" fill="#2E4B4F"/>
    <path d="M50 96 L56 30 H72 L78 96Z" fill="#F3EDE0"/><path d="M52 74 H76 L77 84 H51Z M54 50 H74 L75 60 H53Z" fill="#E35D52"/>
    <rect x="54" y="20" width="20" height="12" rx="2" fill="#FFE29A" class="lhlamp"/><path d="M52 20 L64 10 L76 20Z" fill="#4F6F7C"/></svg>`,
  can: `<svg viewBox="0 0 100 76" aria-hidden="true"><defs><linearGradient id="gCan" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6FC0E6"/><stop offset="1" stop-color="#3C93C2"/></linearGradient></defs>
    <path d="M30 22 Q50 2 70 22" fill="none" stroke="#2F7FAA" stroke-width="6" stroke-linecap="round"/>
    <path d="M26 24 H74 L70 70 H30Z" fill="url(#gCan)"/><path d="M28 36 L4 18 L8 12 L32 30Z" fill="#3C93C2"/><ellipse cx="6" cy="15" rx="5" ry="7" fill="#2F7FAA" transform="rotate(-35 6 15)"/>
    <path d="M34 30 V64" stroke="#fff" stroke-width="4" opacity=".35" stroke-linecap="round"/></svg>`,
  bowl: `<svg viewBox="0 0 150 84" aria-hidden="true"><ellipse cx="75" cy="22" rx="70" ry="16" fill="#E8DDC8"/><ellipse class="liq" cx="75" cy="24" rx="62" ry="12" fill="#F3ECDD" opacity=".9"/>
    <path d="M5 22 Q10 78 75 80 Q140 78 145 22 Q120 40 75 40 Q30 40 5 22Z" fill="#F5F0E6" stroke="#D8CBB0" stroke-width="2"/><path d="M30 52 Q75 62 120 52" stroke="#5BA9C9" stroke-width="4" fill="none" opacity=".7"/></svg>`,
  jugw: `<svg viewBox="0 0 70 70" aria-hidden="true"><path d="M20 8 H44 L42 16 Q58 24 56 44 Q54 64 34 64 Q14 64 12 44 Q10 24 26 16Z" fill="rgba(255,255,255,.55)" stroke="#8FB7C8" stroke-width="3"/><path d="M15 38 Q34 46 53 38 Q54 62 34 62 Q14 62 15 38Z" fill="#7CC4E8"/></svg>`,
  sugar: `<svg viewBox="0 0 70 70" aria-hidden="true"><path d="M14 18 Q35 8 56 18 L60 62 H10Z" fill="#F7F3EA" stroke="#C9BBA0" stroke-width="3"/><path d="M14 18 Q35 26 56 18" fill="none" stroke="#C9BBA0" stroke-width="3"/>
    <rect x="20" y="34" width="30" height="16" rx="4" fill="#5BA9C9"/><circle cx="28" cy="42" r="2" fill="#fff"/><circle cx="35" cy="42" r="2" fill="#fff"/><circle cx="42" cy="42" r="2" fill="#fff"/></svg>`,
  paint: `<svg viewBox="0 0 70 70" aria-hidden="true"><rect x="14" y="20" width="36" height="40" rx="8" fill="#E8584C"/><rect x="20" y="10" width="24" height="12" rx="3" fill="#8E9DA4"/><path d="M50 30 Q62 34 58 50" stroke="#E8584C" stroke-width="5" fill="none" stroke-linecap="round"/><rect x="20" y="30" width="12" height="22" rx="4" fill="#fff" opacity=".3"/></svg>`,
  bucket: `<svg viewBox="0 0 74 74" aria-hidden="true"><path d="M14 22 Q37 0 60 22" fill="none" stroke="#2F7FAA" stroke-width="4"/><path d="M10 22 H64 L58 68 H16Z" fill="#F5C451"/><ellipse cx="37" cy="22" rx="27" ry="7" fill="#E2BF84"/><path d="M16 36 H58" stroke="#E6A93A" stroke-width="3"/></svg>`,
  hammer: `<svg viewBox="0 0 60 60" aria-hidden="true"><rect x="26" y="20" width="8" height="38" rx="3" fill="#A26A3A"/><rect x="10" y="6" width="40" height="16" rx="4" fill="#6E8691"/><rect x="10" y="6" width="8" height="16" rx="3" fill="#56707C"/></svg>`,
  rock: `<svg viewBox="0 0 70 50" aria-hidden="true"><path d="M6 44 Q4 26 18 18 Q30 6 46 12 Q64 18 64 36 Q64 46 54 46 H12Z" fill="#7E8E96"/><path d="M18 22 Q30 12 44 16" stroke="#A9B6BC" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M0 44 Q35 38 70 44" stroke="#fff" stroke-width="3" opacity=".7" fill="none"/></svg>`,
  house: `<svg viewBox="0 0 60 60" aria-hidden="true"><path d="M8 28 L30 8 L52 28Z" fill="#C0533A"/><rect x="12" y="28" width="36" height="28" fill="#F3E3C4"/><rect x="26" y="40" width="9" height="16" rx="2" fill="#8E5A2E"/><rect x="15" y="34" width="8" height="8" rx="1" fill="#FFD98A"/><rect x="37" y="34" width="8" height="8" rx="1" fill="#FFD98A"/></svg>`,
  horn: `<svg viewBox="0 0 80 60" aria-hidden="true"><path d="M10 22 L46 8 V52 L10 38Z" fill="#E8754F"/><ellipse cx="46" cy="30" rx="8" ry="22" fill="#F59A6B"/><ellipse cx="46" cy="30" rx="4" ry="15" fill="#B9472F"/><rect x="2" y="22" width="10" height="16" rx="3" fill="#4F6F7C"/><path d="M18 40 L24 56" stroke="#4F6F7C" stroke-width="5" stroke-linecap="round"/></svg>`,
  bottle: `<svg viewBox="0 0 40 70" aria-hidden="true"><rect x="14" y="2" width="12" height="10" rx="2" fill="#A26A3A"/><path d="M14 12 H26 V20 Q36 26 36 38 V62 Q36 68 30 68 H10 Q4 68 4 62 V38 Q4 26 14 20Z" fill="rgba(140,200,170,.55)" stroke="#5E9C82" stroke-width="2.5"/><rect x="11" y="34" width="18" height="22" rx="2" fill="#FFF8EA" transform="rotate(-6 20 45)"/><path d="M14 40 H26 M14 45 H24 M14 50 H25" stroke="#B9A47E" stroke-width="1.5" transform="rotate(-6 20 45)"/></svg>`,
  bread: `<svg viewBox="0 0 80 44" aria-hidden="true"><ellipse cx="40" cy="26" rx="36" ry="16" fill="#D9984E"/><ellipse cx="40" cy="22" rx="30" ry="11" fill="#E9B26A"/><path d="M22 20 Q26 16 30 20 M36 18 Q40 14 44 18 M50 20 Q54 16 58 20" stroke="#B87532" stroke-width="2.5" fill="none" stroke-linecap="round"/></svg>`,
  dates: `<svg viewBox="0 0 70 44" aria-hidden="true"><path d="M4 22 Q35 52 66 22Z" fill="#E8DDC8" stroke="#C9BBA0" stroke-width="2"/>${[[20, 18], [32, 14], [44, 16], [56, 20], [26, 24], [40, 24]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="6" ry="9" fill="#8A4B1F" transform="rotate(${x % 3 * 15 - 15} ${x} ${y})"/>`).join("")}</svg>`,
  blanket: `<svg viewBox="0 0 120 60" aria-hidden="true"><rect x="4" y="10" width="112" height="46" rx="10" fill="#5BA9C9"/><path d="M4 26 H116 M4 40 H116" stroke="#F5C451" stroke-width="5"/><rect x="10" y="4" width="34" height="16" rx="8" fill="#FFF8EA"/></svg>`,
  book: `<svg viewBox="0 0 70 54" aria-hidden="true"><path d="M35 10 Q20 2 4 6 V48 Q20 44 35 52Z" fill="#1F6E58"/><path d="M35 10 Q50 2 66 6 V48 Q50 44 35 52Z" fill="#257D64"/><path d="M35 10 V52" stroke="#F5C451" stroke-width="2.5"/><path d="M14 18 Q20 16 28 18 M42 18 Q50 16 56 18" stroke="#F5C451" stroke-width="2" fill="none"/></svg>`,
  window: `<svg viewBox="0 0 180 150" aria-hidden="true"><rect x="4" y="4" width="172" height="142" rx="8" fill="#8E5A2E"/><rect x="14" y="14" width="152" height="122" rx="4" fill="#9FD6F2"/><path d="M14 104 Q60 80 100 98 T166 92 V136 H14Z" fill="#7DC46D"/><path d="M90 14 V136 M14 75 H166" stroke="#8E5A2E" stroke-width="6"/></svg>`,
  island: `<svg viewBox="0 0 200 80" aria-hidden="true"><path d="M0 70 Q60 40 110 52 Q160 40 200 70Z" fill="#7FAF7A"/>
    <rect x="140" y="18" width="12" height="38" fill="#F3EDE0"/><rect x="140" y="28" width="12" height="6" fill="#E35D52"/><rect x="140" y="42" width="12" height="6" fill="#E35D52"/><path d="M136 18 L146 8 L156 18Z" fill="#4F6F7C"/>
    <path d="M60 52 Q58 34 64 22" stroke="#7E5630" stroke-width="3" fill="none"/><path d="M64 22 q-14 -2 -20 6 M64 22 q14 -4 20 4 M64 22 q-6 -10 -16 -10 M64 22 q8 -10 16 -8" stroke="#4E9D45" stroke-width="4" fill="none" stroke-linecap="round"/></svg>`
};
/* Иконки для вариантов ответа и глав (viewBox 48×48) */
const ICON = {
  pillar: '<rect x="15" y="6" width="18" height="5" rx="2" fill="#C8B590"/><rect x="18" y="11" width="12" height="27" fill="#F1E6CF"/><path d="M22 12v25M26 12v25" stroke="#D8C7A4" stroke-width="1.4"/><rect x="13" y="38" width="22" height="5" rx="2" fill="#C8B590"/>',
  cloud: '<path d="M12 36 Q4 36 5 28 Q6 21 13 22 Q14 12 25 12 Q34 10 37 19 Q45 19 44 28 Q44 36 36 36Z" fill="#fff" stroke="#9FC3D4" stroke-width="2"/>',
  drop: '<path d="M24 6 Q36 22 36 30 A12 12 0 0 1 12 30 Q12 22 24 6Z" fill="#6BC0E6"/><path d="M18 30 a6 6 0 0 0 5 6" stroke="#fff" stroke-width="2.5" fill="none" stroke-linecap="round"/>',
  soil: '<path d="M4 38 Q24 20 44 38Z" fill="#9C6B3F"/><path d="M4 38 H44 V42 H4Z" fill="#7A4F2B"/><circle cx="18" cy="32" r="1.6" fill="#7A4F2B"/><circle cx="28" cy="29" r="1.6" fill="#7A4F2B"/><circle cx="32" cy="35" r="1.4" fill="#7A4F2B"/>',
  sail: '<path d="M24 6 V40" stroke="#5D3B22" stroke-width="2.5"/><path d="M25 8 Q42 22 25 36Z" fill="#FFFDF5" stroke="#CDBF9F" stroke-width="1.5"/><path d="M8 40 H40 L35 45 H13Z" fill="#8E5A2E"/>',
  fan: '<circle cx="24" cy="20" r="14" fill="#E7F3F8" stroke="#8FA9B4" stroke-width="2"/><g fill="#3FA2CF"><ellipse cx="24" cy="12" rx="4" ry="7"/><ellipse cx="24" cy="12" rx="4" ry="7" transform="rotate(120 24 20)"/><ellipse cx="24" cy="12" rx="4" ry="7" transform="rotate(240 24 20)"/></g><rect x="22" y="33" width="4" height="8" fill="#8FA9B4"/><rect x="14" y="40" width="20" height="5" rx="2.5" fill="#4F6F7C"/>',
  sky: '<circle cx="31" cy="17" r="8" fill="#F7B32B"/><path d="M10 36 Q4 36 5 30 Q6 25 11 26 Q12 18 21 18 Q28 17 30 24 Q37 24 37 30 Q37 36 31 36Z" fill="#fff" stroke="#9FC3D4" stroke-width="2"/>',
  fruitc: '<circle cx="24" cy="27" r="14" fill="#E8463C"/><path d="M24 14 Q25 8 29 6" stroke="#6A3E1C" stroke-width="2.5" fill="none" stroke-linecap="round"/><path d="M26 11 Q33 7 37 12 Q31 15 26 11Z" fill="#5DAE4F"/><circle cx="19" cy="22" r="3.5" fill="#fff" opacity=".5"/>',
  sand: '<path d="M6 40 Q24 10 42 40Z" fill="#E2BF84"/><path d="M30 10 L36 22 M33 9 L39 21" stroke="#8E5A2E" stroke-width="2.5" stroke-linecap="round"/><path d="M28 22 H44 L42 30 H30Z" fill="#4F9BC7"/>',
  wind: '<path d="M6 18 H30 a6 6 0 1 0 -6 -6 M6 28 H38 a6 6 0 1 1 -6 6 M6 38 H24" stroke="#5FA7C9" stroke-width="3.5" fill="none" stroke-linecap="round"/>',
  lantern: '<path d="M18 10 Q24 3 30 10" fill="none" stroke="#4F6F7C" stroke-width="2.5"/><rect x="15" y="10" width="18" height="4" rx="1.5" fill="#4F6F7C"/><rect x="16" y="14" width="16" height="22" rx="3" fill="#FFE7A0" stroke="#4F6F7C" stroke-width="2.5"/><path d="M24 19 Q28 25 25 30 Q24 32 23 30 Q20 25 24 19Z" fill="#F5A623"/><rect x="14" y="36" width="20" height="5" rx="2" fill="#4F6F7C"/>',
  heater: '<rect x="6" y="10" width="36" height="26" rx="6" fill="#E7EEF1" stroke="#9FB2BA" stroke-width="2.5"/><path d="M15 15 V31 M22 15 V31 M29 15 V31 M36 15 V31" stroke="#F07A55" stroke-width="3" stroke-linecap="round"/><rect x="11" y="36" width="5" height="6" fill="#7E9099"/><rect x="32" y="36" width="5" height="6" fill="#7E9099"/>',
  wheel: '<circle cx="24" cy="24" r="12" fill="none" stroke="#8E5A2E" stroke-width="4"/><circle cx="24" cy="24" r="4" fill="#8E5A2E"/>' + [0, 45, 90, 135].map(a => `<path d="M24 4 V44" stroke="#8E5A2E" stroke-width="3.5" stroke-linecap="round" transform="rotate(${a} 24 24)"/>`).join(""),
  mountain: '<path d="M2 42 L18 14 L26 26 L32 18 L46 42Z" fill="#7B93A3"/><path d="M18 14 L13 23 L17 21 L20 24 L23 21Z M32 18 L29 23 L32 22 L35 24Z" fill="#fff"/>',
  sunc: '<circle cx="24" cy="24" r="9" fill="#F7B32B"/>' + [0, 45, 90, 135, 180, 225, 270, 315].map(a => `<path d="M24 6 V10" stroke="#F7B32B" stroke-width="3" stroke-linecap="round" transform="rotate(${a} 24 24)"/>`).join(""),
  star: '<path d="M24 5 L29 18 L43 19 L32 28 L36 42 L24 34 L12 42 L16 28 L5 19 L19 18Z" fill="#F5C451" stroke="#B9802A" stroke-width="1.5" stroke-linejoin="round"/>',
  echo: '<path d="M6 40 L18 16 L26 28 L34 18 L44 40Z" fill="#8FA3AE"/><path d="M14 10 a8 8 0 0 1 0 12 M10 6 a14 14 0 0 1 0 20" stroke="#5FA7C9" stroke-width="2.5" fill="none" stroke-linecap="round"/>',
  bottle: '<path d="M20 4 H28 V12 Q36 16 36 26 V42 H12 V26 Q12 16 20 12Z" fill="#9FD1BA" stroke="#5E9C82" stroke-width="2"/><rect x="17" y="24" width="14" height="12" rx="1.5" fill="#FFF8EA"/>',
  wave: '<path d="M4 30 Q12 18 20 30 T36 30 T48 30" stroke="#3FA2CF" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M4 40 Q12 30 20 40 T36 40 T48 40" stroke="#5FBBE0" stroke-width="3.5" fill="none" stroke-linecap="round"/>',
  hundred: '<text x="24" y="32" text-anchor="middle" font-family="Nunito, sans-serif" font-weight="900" font-size="20" fill="#1F5B74">100</text>',
  infinity: '<path d="M24 24 C18 14 6 14 6 24 C6 34 18 34 24 24 C30 14 42 14 42 24 C42 34 30 34 24 24Z" fill="none" stroke="#E6A93A" stroke-width="5" stroke-linecap="round"/>',
  bolt: '<path d="M28 4 L12 28 H22 L18 44 L36 18 H26Z" fill="#F5C451" stroke="#B9802A" stroke-width="1.5" stroke-linejoin="round"/>',
  pearl: '<path d="M6 30 Q24 8 42 30 Q24 44 6 30Z" fill="#8FA3AE"/><circle cx="24" cy="26" r="9" fill="#F3EEF8" stroke="#C9C0D8" stroke-width="1.5"/><circle cx="21" cy="23" r="3" fill="#fff"/>',
  dropc: '<path d="M24 6 Q36 22 36 30 A12 12 0 0 1 12 30 Q12 22 24 6Z" fill="#6BC0E6"/><path d="M18 30 a6 6 0 0 0 5 6" stroke="#fff" stroke-width="2.5" fill="none" stroke-linecap="round"/><path d="M38 8 l2 4 4 1 -4 1 -2 4 -2-4 -4-1 4-1z" fill="#F5C451"/>',
  ship: '<path d="M24 5 V34" stroke="#5D3B22" stroke-width="2.5"/><path d="M25 7 Q40 20 25 32Z" fill="#FFFDF5" stroke="#CDBF9F" stroke-width="1.5"/><path d="M23 10 Q12 21 23 31Z" fill="#F4EEDD" stroke="#CDBF9F" stroke-width="1.5"/><path d="M6 34 H42 L36 42 H12Z" fill="#8E5A2E"/><path d="M4 45 q5 -3 10 0 t10 0 t10 0 t10 0" stroke="#3FA2CF" stroke-width="2.5" fill="none"/>'
};

/* Сокровища за главы */
const ITEMS = [
  { id: "cloud", name: "Облачко", svg: '<path d="M22 76 Q4 76 6 60 Q8 46 24 48 Q26 28 48 26 Q66 18 76 34 Q94 32 96 52 Q98 76 78 76Z" fill="#fff" stroke="#9FC3D4" stroke-width="3"/><path d="M24 66 Q50 72 80 64" stroke="#DCEAF2" stroke-width="4" fill="none" stroke-linecap="round"/>' },
  { id: "date", name: "Финик", svg: '<path d="M50 12 Q50 6 56 4" stroke="#6A3E1C" stroke-width="4" fill="none" stroke-linecap="round"/><ellipse cx="50" cy="54" rx="22" ry="38" fill="#8A4B1F"/><ellipse cx="42" cy="40" rx="6" ry="14" fill="#C27A45" opacity=".6"/><path d="M38 22 Q50 14 62 22" stroke="#5E3112" stroke-width="3" fill="none"/>' },
  { id: "stone", name: "Горный камень", svg: '<path d="M14 78 Q8 50 30 36 Q50 20 72 32 Q94 44 88 70 Q80 90 50 88 Q22 88 14 78Z" fill="#8FA3AE"/><path d="M30 44 Q50 32 70 40" stroke="#B9C7CE" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M40 66 L52 58 L62 70" stroke="#71848E" stroke-width="3" fill="none"/>' },
  { id: "sunray", name: "Солнечный лучик", svg: '<circle cx="50" cy="50" r="20" fill="#F7B32B"/><circle cx="44" cy="44" r="7" fill="#FFE8A3"/>' + [0, 45, 90, 135, 180, 225, 270, 315].map(a => `<path d="M50 10 V22" stroke="#F7B32B" stroke-width="6" stroke-linecap="round" transform="rotate(${a} 50 50)"/>`).join("") },
  { id: "star", name: "Путеводная звезда", svg: '<path d="M50 8 L61 36 L91 38 L68 57 L76 87 L50 70 L24 87 L32 57 L9 38 L39 36Z" fill="#F5C451" stroke="#B9802A" stroke-width="3" stroke-linejoin="round"/><circle cx="42" cy="40" r="5" fill="#FFF3CC"/>' },
  { id: "letter", name: "Письмо", svg: '<rect x="10" y="22" width="80" height="56" rx="6" fill="#FFF8EA" stroke="#C9BBA0" stroke-width="3"/><path d="M10 26 L50 54 L90 26" fill="none" stroke="#C9BBA0" stroke-width="3"/><circle cx="50" cy="56" r="8" fill="#E8584C"/>' },
  { id: "pearl", name: "Жемчужина", svg: '<path d="M8 62 Q50 10 92 62 Q50 92 8 62Z" fill="#8FA3AE"/><circle cx="50" cy="52" r="20" fill="#F3EEF8" stroke="#C9C0D8" stroke-width="2"/><circle cx="43" cy="45" r="6" fill="#fff"/>' },
  { id: "drop", name: "Капля воды", svg: '<path d="M50 10 Q78 46 78 62 A28 28 0 0 1 22 62 Q22 46 50 10Z" fill="#6BC0E6"/><path d="M36 62 a14 14 0 0 0 12 14" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round"/>' },
  { id: "anchor", name: "Якорь", svg: '<circle cx="50" cy="18" r="9" fill="none" stroke="#4F6F7C" stroke-width="6"/><path d="M50 27 V86" stroke="#4F6F7C" stroke-width="8" stroke-linecap="round"/><path d="M34 42 H66" stroke="#4F6F7C" stroke-width="7" stroke-linecap="round"/><path d="M16 60 Q20 88 50 88 Q80 88 84 60" stroke="#4F6F7C" stroke-width="8" fill="none" stroke-linecap="round"/><path d="M10 64 L16 54 L24 64Z M76 64 L84 54 L90 64Z" fill="#4F6F7C"/>' }
];

/* ============ ДЕКОРАЦИИ ============ */
function sky(bg) { const s = el("div", "sky"); s.style.background = bg; return s; }
function sunAt(x, y, sz = 120) { const s = el("div", "sunwrap", stage, ART.sun); s.style.width = s.style.height = sz + "px"; s.style.left = x + "px"; s.style.top = y + "px"; return s; }
function clouds(n, top = 0.2, bottom = 0.46) {
  const { H } = size();
  for (let i = 0; i < n; i++) {
    const c = el("div", "cloud", stage, ART.cloud); const w = rnd(110, 170);
    c.style.width = w + "px"; c.style.height = (w / 2) + "px"; c.style.top = (H * rnd(top, bottom)) + "px";
    c.style.opacity = rnd(.75, .95).toFixed(2); c.style.animationDuration = rnd(50, 80) + "s"; c.style.animationDelay = (-rnd(0, 70)) + "s";
  }
}
/* Три слоя холмов с градиентами: дальний, средний, ближний */
function hills(h = 0.3, pal = ["#A8D99A", "#7DC46D", "#5AAE57"]) {
  const g = el("div", "layer", stage, `<svg viewBox="0 0 400 160" preserveAspectRatio="none" aria-hidden="true"><defs>
    <linearGradient id="gH1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${pal[0]}"/><stop offset="1" stop-color="${pal[1]}"/></linearGradient>
    <linearGradient id="gH2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${pal[1]}"/><stop offset="1" stop-color="${pal[2]}"/></linearGradient>
    <linearGradient id="gH3" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${pal[2]}"/><stop offset="1" stop-color="#3F8E46"/></linearGradient></defs>
    <path d="M0 40 Q70 8 150 30 T300 22 T400 30 V160 H0Z" fill="url(#gH1)" opacity=".85"/>
    <path d="M0 70 Q110 36 210 62 T400 56 V160 H0Z" fill="url(#gH2)"/>
    <path d="M0 100 Q130 76 250 96 T400 92 V160 H0Z" fill="url(#gH3)"/></svg>`);
  g.style.bottom = "0"; g.style.height = (h * 100) + "%";
  return g;
}
function vignette() { el("div", "vignette"); }
function puffs(x, y, n = 5, dx = 60) {
  for (let i = 0; i < n; i++) {
    const p = el("div", "puff"); p.style.left = x + "px"; p.style.top = y + "px";
    p.animate([{ transform: "translate(0,0) scale(.6)", opacity: .9 }, { transform: `translate(${dx + rnd(-15, 25)}px, ${rnd(-25, 25)}px) scale(1.6)`, opacity: 0 }], { duration: rnd(500, 900), easing: "ease-out" }).onfinish = () => p.remove();
  }
}
const fadeOut = (e, ms = 500) => e.animate([{ opacity: getComputedStyle(e).opacity }, { opacity: 0 }], { duration: ms, fill: "forwards" }).finished.then(() => e.remove()).catch(() => {});
const fadeIn = (e, ms = 500) => e.animate([{ opacity: 0, transform: "scale(.85)" }, { opacity: 1, transform: "scale(1)" }], { duration: ms, easing: "cubic-bezier(.2,1.4,.4,1)" });

/* Полёт по простой физике: подброс вверх с силой k (0..1) или падение с места, если k = 0 */
function flight(e, groundY, k) {
  const { W, H } = size();
  return new Promise(res => {
    const g = H * 2.0, top = e._y - k * (groundY - H * 0.3);
    let x = e._x, y = e._y, vy = k ? -Math.sqrt(2 * g * Math.max(10, e._y - top)) : 0, vx = rnd(-70, 70), t0 = performance.now(), last = t0, fell = false;
    if (k) Snd.whoosh(0.15 + 0.2 * k);
    const step = t => {
      const dt = Math.min(0.04, (t - last) / 1000); last = t;
      vy += g * dt * (vy > 0 ? 0.55 : 1);
      x = Math.max(50, Math.min(W - 50, x + vx * dt)); y += vy * dt;
      if (vy > 0 && !fell) { fell = true; Snd.fall(); }
      const wob = vy > 0 ? Math.sin((t - t0) / 90) * 14 : 0;
      e.style.transform = `rotate(${(vy * 0.03 + wob).toFixed(1)}deg)`;
      put(e, x + (vy > 0 ? Math.sin((t - t0) / 160) * 10 : 0), y);
      if (y >= groundY && vy > 0) { put(e, x, groundY); e.style.transform = "rotate(6deg)"; Snd.thud(0.35); return res(); }
      requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  });
}
/* ============ ВСТУПЛЕНИЕ ============ */
async function chIntro() {
  await toDark(); clearStage();
  sky("linear-gradient(180deg,#5FB4E6 0%,#A9DDF4 55%,#F6E7C4 100%)");
  const { W, H } = size(); sunAt(W * 0.74, H * 0.42, 150); clouds(3, 0.28, 0.46); hills(0.32); vignette();
  Snd.amb("wind", 0.7); fromDark(); await sleep(500);
  await say("intro1");
  await say("intro2");
  await say("intro3", { btn: "Бисмиллях" });
}

/* ============ МЕХАНИКИ ============ */
/* Держать палец на предмете: вокруг заполняется кольцо. ms — сколько всего держать */
function hold(e, ms, onTick, timeout = 20000) {
  return new Promise(res => {
    const r = Math.max(e.offsetWidth, e.offsetHeight) + 34;
    const ring = el("div", "holdring"); Object.assign(ring.style, { width: r + "px", height: r + "px", left: e._x + "px", top: e._y + "px" });
    let acc = 0, down = false, last = 0, fin = false, auto = false;
    e.classList.add("hint", "tapme");
    const dn = ev => { ev.preventDefault(); down = true; e.classList.remove("hint"); };
    const up = () => { down = false; };
    e.addEventListener("pointerdown", dn); window.addEventListener("pointerup", up); window.addEventListener("pointercancel", up);
    const step = t => {
      if (fin) return;
      const dt = Math.min(50, t - (last || t)); last = t;
      if (down || auto) { acc += dt; onTick && onTick(Math.min(1, acc / ms), dt); }
      ring.style.setProperty("--p", Math.min(1, acc / ms).toFixed(3));
      if (acc >= ms) {
        fin = true; e.classList.remove("hint", "tapme");
        e.removeEventListener("pointerdown", dn); window.removeEventListener("pointerup", up); window.removeEventListener("pointercancel", up);
        fadeOut(ring, 400); return res();
      }
      requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
    setTimeout(() => { auto = true; }, timeout);
  });
}
/* Перетащить предмет к цели. Не справился за timeout — предмет доедет сам */
function dragTo(item, target, timeout = 20000) {
  return new Promise(res => {
    let fin = false, off = null; const home = { x: item._x, y: item._y };
    item.classList.add("hint", "tapme"); item.style.zIndex = 9;
    const mv = ev => { if (!off || fin) return; const p = local(ev); put(item, p.x + off.x, p.y + off.y); };
    const upf = () => {
      if (!off || fin) return; off = null;
      if (Math.hypot(item._x - target._x, item._y - target._y) < 80) done();
      else { move(item, home.x, home.y, 350, "ease-out"); item.classList.add("hint"); }
    };
    const done = async () => {
      if (fin) return; fin = true; item.classList.remove("hint", "tapme"); item.onpointerdown = null;
      window.removeEventListener("pointermove", mv); window.removeEventListener("pointerup", upf);
      await move(item, target._x, target._y - 10, 300, "ease-in"); res();
    };
    item.onpointerdown = ev => { ev.preventDefault(); const p = local(ev); off = { x: item._x - p.x, y: item._y - p.y }; item.classList.remove("hint"); Snd.tap(); };
    window.addEventListener("pointermove", mv); window.addEventListener("pointerup", upf);
    setTimeout(done, timeout);
  });
}
/* Водить пальцем по предмету туда-сюда: n взмахов (нажатие без движения тоже считается взмахом) */
function strokes(e, n, onStroke, timeout = 15000) {
  return new Promise(res => {
    let k = 0, lastX = 0, dir = 0, fin = false, active = false, moved = false;
    e.classList.add("hint", "tapme");
    const count = () => { k++; onStroke && onStroke(k); if (k >= n) setTimeout(end, 300); };
    const end = () => { if (fin) return; fin = true; e.classList.remove("hint", "tapme"); e.removeEventListener("pointerdown", dn); window.removeEventListener("pointermove", mv); window.removeEventListener("pointerup", up); res(); };
    const dn = ev => { ev.preventDefault(); active = true; moved = false; lastX = local(ev).x; e.classList.remove("hint"); };
    const mv = ev => {
      if (!active || fin) return; const x = local(ev).x; if (Math.abs(x - lastX) < 14) return;
      const d = Math.sign(x - lastX); moved = true; if (d !== dir) { dir = d; count(); } lastX = x;
    };
    const up = () => { if (active && !moved && !fin) count(); active = false; };
    e.addEventListener("pointerdown", dn); window.addEventListener("pointermove", mv); window.addEventListener("pointerup", up);
    setTimeout(end, timeout);
  });
}
/* Ритм: жёлтая палочка ходит по полоске, нажатие над зелёной зоной — попадание */
function timingGame(hits, onHit, timeout = 30000) {
  return new Promise(res => {
    const bar = el("div", "tbar", app, '<i class="tzone"></i><b class="tmark"></b>');
    const zone = bar.querySelector(".tzone"), mark = bar.querySelector(".tmark");
    let k = 0, fin = false, zx = 0.5, pos = 0;
    const t0 = performance.now();
    const placeZone = () => { zx = rnd(0.25, 0.75); zone.style.left = (zx * 100 - 12) + "%"; };
    placeZone();
    const step = t => { if (fin) return; pos = 0.5 + 0.47 * Math.sin((t - t0) / 420); mark.style.left = (pos * 100) + "%"; requestAnimationFrame(step); };
    requestAnimationFrame(step);
    const field = el("div", "tapfield"); field.style.zIndex = 20;
    const end = () => { if (fin) return; fin = true; field.remove(); fadeOut(bar, 300); res(); };
    field.addEventListener("pointerdown", () => {
      if (fin) return;
      if (Math.abs(pos - zx) < 0.13) { k++; onHit(k); placeZone(); if (k >= hits) setTimeout(end, 300); }
      else { Snd.noise({ kind: "brown", type: "lowpass", f: 300, dur: 0.12, gain: 0.3 }); bar.classList.remove("miss"); void bar.offsetWidth; bar.classList.add("miss"); }
    });
    setTimeout(async () => { while (!fin && k < hits) { k++; onHit(k); await sleep(450); } end(); }, timeout);
  });
}
/* Ползунок времени: тянуть солнышко слева направо */
function timeSlider(onChange, timeout = 20000) {
  return new Promise(res => {
    const tr = el("div", "tslider", app, `<i class="tfill"></i><b class="tknob"><svg viewBox="0 0 48 48" aria-hidden="true">${ICON.sunc}</svg></b><span class="tlabel">День 1</span>`);
    const knob = tr.querySelector(".tknob"), fill = tr.querySelector(".tfill"), label = tr.querySelector(".tlabel");
    let p = 0, drag = false, fin = false;
    knob.classList.add("hint");
    const set = v => { p = Math.max(p, Math.min(1, v)); knob.style.left = (p * 100) + "%"; fill.style.width = (p * 100) + "%"; label.textContent = "День " + (1 + Math.round(p * 99)); onChange(p); };
    const fromEv = ev => { const r = tr.getBoundingClientRect(); return (ev.clientX - r.left) / r.width; };
    const end = () => { if (fin) return; fin = true; window.removeEventListener("pointermove", mv); window.removeEventListener("pointerup", up); setTimeout(() => fadeOut(tr, 400), 600); res(); };
    const mv = ev => { if (drag) set(fromEv(ev)); };
    const up = () => { drag = false; if (p >= 0.96) { set(1); end(); } };
    tr.addEventListener("pointerdown", ev => { ev.preventDefault(); drag = true; knob.classList.remove("hint"); set(fromEv(ev)); });
    window.addEventListener("pointermove", mv); window.addEventListener("pointerup", up);
    setTimeout(async () => { while (!fin && p < 1) { set(p + 0.02); await sleep(40); } end(); }, timeout);
  });
}
/* Шкалы внизу экрана, например «Свет» и «Тепло» */
function meters(defs) {
  const box = el("div", "meters", app, defs.map(d => `<div class="mrow"><span>${d.label}</span><i><b style="background:${d.color}"></b></i><em>0%</em></div>`).join(""));
  const rows = [...box.querySelectorAll(".mrow")];
  const api = rows.map(r => ({ v: 0, set(v) { this.v = v; r.querySelector("b").style.width = Math.round(v * 100) + "%"; r.querySelector("em").textContent = Math.round(v * 100) + "%"; } }));
  api.remove = () => fadeOut(box, 400);
  return api;
}
/* Соединить точки по порядку: следующая мигает; можно вести пальцем или нажимать */
function connectDots(pts, timeout = 30000) {
  const { W, H } = size();
  return new Promise(res => {
    const lay = el("div", "layer", stage, `<svg viewBox="0 0 ${W} ${H}" aria-hidden="true"><g stroke="#FFF3C4" stroke-width="3" stroke-linecap="round"></g></svg>`);
    lay.style.inset = "0"; lay.style.zIndex = 4;
    const g = lay.querySelector("g");
    const dots = pts.map(p => { const d = obj("dot", '<svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="6" fill="#FFF6DD"/></svg>', p.x, p.y, 40, 40); d.style.zIndex = 5; return d; });
    let k = 0, fin = false, down = false;
    dots[0].classList.add("hint");
    const field = el("div", "tapfield"); field.style.zIndex = 6;
    const upd = () => { down = false; };
    const link = () => {
      const d = dots[k]; d.classList.remove("hint"); d.classList.add("lit"); Snd.sparkle();
      if (k > 0) { const a = pts[k - 1], b = pts[k]; g.insertAdjacentHTML("beforeend", `<line x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}"/>`); }
      k++; if (k < dots.length) dots[k].classList.add("hint"); else { fin = true; field.remove(); window.removeEventListener("pointerup", upd); res(); }
    };
    const near = ev => { if (fin) return; const p = local(ev), d = dots[k]; if (Math.hypot(p.x - d._x, p.y - d._y) < 36) link(); };
    field.addEventListener("pointerdown", ev => { down = true; near(ev); });
    field.addEventListener("pointermove", ev => { if (down) near(ev); });
    window.addEventListener("pointerup", upd);
    setTimeout(async () => { while (!fin) { link(); await sleep(350); } }, timeout);
  });
}
/* Нарисовать пальцем линию в области выше maxY */
function drawStroke(maxY, minLen = 220, timeout = 15000) {
  const { W, H } = size();
  return new Promise(res => {
    const lay = el("div", "layer", stage, `<svg viewBox="0 0 ${W} ${H}" aria-hidden="true"><polyline class="drawn" points="" fill="none" stroke="#FFE7A0" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></svg>`);
    lay.style.inset = "0"; lay.style.zIndex = 5;
    const line = lay.querySelector("polyline"), pts = [];
    let len = 0, down = false, fin = false;
    const field = el("div", "tapfield"); field.style.zIndex = 6;
    const add = p => { const q = pts[pts.length - 1]; if (q) len += Math.hypot(p.x - q.x, p.y - q.y); pts.push(p); line.setAttribute("points", pts.map(o => o.x.toFixed(0) + "," + o.y.toFixed(0)).join(" ")); };
    const up = () => { if (down && len >= minLen) end(); down = false; };
    const end = () => { if (fin) return; fin = true; field.remove(); window.removeEventListener("pointerup", up); res(lay); };
    field.addEventListener("pointerdown", ev => { const p = local(ev); if (p.y < maxY) { down = true; add(p); } });
    field.addEventListener("pointermove", ev => { if (!down) return; const p = local(ev); if (p.y < maxY) add(p); });
    window.addEventListener("pointerup", up);
    setTimeout(async () => {
      if (fin) return;
      const cx = W * 0.5, cy = maxY * 0.62, R = 50;
      for (let i = 0; i <= 10; i++) { const a = -Math.PI / 2 + i * Math.PI * 0.8, r = R; add({ x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) }); await sleep(60); }
      end();
    }, timeout);
  });
}
function glowSpot(x, y, r, color = "255,214,130") {
  const g = el("div", "glowspot");
  Object.assign(g.style, { left: (x - r) + "px", top: (y - r) + "px", width: 2 * r + "px", height: 2 * r + "px", background: `radial-gradient(circle, rgba(${color},.75) 0%, rgba(${color},.3) 45%, rgba(${color},0) 70%)` });
  g.animate([{ opacity: 0, transform: "scale(.6)" }, { opacity: 1, transform: "scale(1)" }], { duration: 600, easing: "ease-out" });
  return g;
}
function windLines(n, top, bottom) {
  const { H } = size();
  for (let i = 0; i < n; i++) {
    const w = el("div", "windline"); w.style.top = (H * rnd(top, bottom)) + "px"; w.style.left = "0px"; w.style.width = rnd(50, 120) + "px"; w.style.zIndex = 6;
    w.style.animationDelay = (i * rnd(0.08, 0.2)) + "s"; w.style.animationDuration = rnd(0.9, 1.4) + "s";
    setTimeout(() => w.remove(), 2500 + i * 200);
  }
}
function seaLayer(seaTop, pal) {
  const wave = (cls, top, fill, flip) => `<svg class="wave ${cls}" viewBox="0 0 800 44" preserveAspectRatio="none" style="top:${top}"><path d="M0 22 ${Array.from({ length: 16 }, (_, i) => `Q${i * 50 + 25} ${(i % 2) ^ flip ? 38 : 6} ${i * 50 + 50} 22`).join(" ")} V44 H0Z" fill="${fill}"/></svg>`;
  const sea = el("div", "sea", stage, wave("", "-22px", pal[0], 0) + wave("w2", "18%", pal[1], 1) + wave("w3", "52%", pal[2], 0));
  sea.style.top = seaTop + "px";
  return sea;
}

/* ============ ГЛАВА 1: НЕБО БЕЗ ОПОР ============ */
/* Башня из кубиков: кран раскачивает кубик, нажатие — кубик падает на башню. Башня шатается и рушится */
function towerGame(groundY) {
  const { W, H } = size();
  const bw = Math.min(W * 0.3, 120), bh = Math.round(bw * 0.36), craneY = H * 0.47;
  const rail = el("div", "rail"); rail.style.top = (craneY - bh / 2 - 34) + "px";
  const rope = el("div", "crope"); rope.style.top = (craneY - bh / 2 - 30) + "px";
  const colors = ["#F5C451", "#E8754F", "#5BA9C9", "#7DC46D", "#B98AD8", "#F59A6B", "#5BC3B0"];
  const placed = []; let cur = null, topX = W / 2, topY = groundY, drops = 0, busy = false, stop = false, amp = 1;
  const t0 = performance.now();
  const newBlock = () => { cur = obj("block", `<div class="blk" style="background:${colors[drops % colors.length]}"></div>`, W / 2, craneY, bw, bh); cur.style.zIndex = 6; };
  newBlock();
  const loop = t => {
    if (stop) return;
    if (cur && !busy) { const x = W / 2 + W * 0.3 * Math.sin((t - t0) / 700); put(cur, x, craneY); rope.style.left = x + "px"; }
    placed.forEach((b, i) => { const k = (i + 1) / placed.length, s = Math.sin(t / 240); b.style.transform = `translateX(${(amp * k * s).toFixed(1)}px) rotate(${(amp * 0.12 * k * s).toFixed(2)}deg)`; });
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
  const field = el("div", "tapfield"); field.style.zIndex = 7;
  return new Promise(res => {
    let autoT = null;
    const arm = () => { clearTimeout(autoT); autoT = setTimeout(drop, 5000); };
    async function drop() {
      if (busy || !cur) return; busy = true; clearTimeout(autoT);
      const b = cur; cur = null; const landY = topY - bh / 2;
      Snd.whoosh(0.1);
      await move(b, b._x, landY, 380, "ease-in");
      const dx = b._x - topX;
      if (placed.length && Math.abs(dx) > bw * 0.75) {
        Snd.thud(0.3);
        b.animate([{ rotate: "0deg" }, { rotate: (dx > 0 ? 70 : -70) + "deg" }], { duration: 450, fill: "forwards" });
        await move(b, b._x + Math.sign(dx) * 50, groundY - bh / 2, 450, "ease-in"); fadeOut(b, 600);
      } else {
        Snd.thud(0.6); placed.push(b); topX = b._x; topY = landY - bh / 2;
        amp = 1 + placed.length * 1.6 + Math.abs(dx) * 0.08;
      }
      drops++;
      if (placed.length >= 6 || drops >= 9) return collapse();
      newBlock(); busy = false; arm();
    }
    async function collapse() {
      clearTimeout(autoT); field.remove(); fadeOut(rope); fadeOut(rail);
      amp *= 2.2; Snd.noise({ kind: "brown", type: "lowpass", f: 400, dur: 1.2, gain: 0.35, attack: 0.3 });
      await sleep(1300); stop = true;
      const n = placed.length, dir = Math.random() < 0.5 ? -1 : 1;
      placed.slice().reverse().forEach((b, j) => {
        const i = n - 1 - j;
        b.animate([{ rotate: "0deg" }, { rotate: (dir * rnd(40, 110)) + "deg" }], { duration: 650 + j * 60, fill: "forwards", easing: "ease-in" });
        move(b, b._x + dir * (i * bw * 0.45 + rnd(0, 20)), groundY - bh / 2, 650 + j * 60, "ease-in").then(() => Snd.thud(0.4));
      });
      await sleep(1300); res(placed);
    }
    field.addEventListener("pointerdown", drop); arm();
  });
}
/* Доска: поднять пальцем и отпустить в воздухе — падает */
function plankDrop(groundY) {
  const { W, H } = size();
  const pl = obj("roof", ART.roof, W * 0.5, groundY - 16, W * 0.45, 28); pl.style.zIndex = 8; fadeIn(pl);
  return new Promise(res => {
    let off = null, fin = false;
    pl.classList.add("hint", "tapme");
    const mv = ev => { if (!off || fin) return; const p = local(ev); put(pl, p.x + off.x, Math.min(groundY - 16, p.y + off.y)); };
    const finish = async () => { fin = true; window.removeEventListener("pointermove", mv); window.removeEventListener("pointerup", up); pl.classList.remove("hint", "tapme"); await flight(pl, groundY - 16, 0); pl.style.transform = "rotate(0deg)"; res(pl); };
    const up = () => { if (!off || fin) return; off = null; if (pl._y < groundY - 90) finish(); else pl.classList.add("hint"); };
    pl.onpointerdown = ev => { ev.preventDefault(); const p = local(ev); off = { x: pl._x - p.x, y: pl._y - p.y }; pl.classList.remove("hint"); Snd.tap(); };
    window.addEventListener("pointermove", mv); window.addEventListener("pointerup", up);
    setTimeout(async () => { if (fin) return; fin = true; await move(pl, pl._x, H * 0.5, 900, "ease-out"); await sleep(300); fin = false; finish(); }, 18000);
  });
}
async function chSky() {
  await toDark(); clearStage();
  const sk = sky("linear-gradient(180deg,#4FA8E0 0%,#9AD5F2 55%,#E6F6FC 100%)");
  const { W, H } = size(); sunAt(W * 0.84, H * 0.38, 120); clouds(2, 0.3, 0.4); hills(0.22); vignette();
  const groundY = H * 0.9;
  const goal = obj("bigcloud", ART.cloud, W * 0.5, H * 0.3, 160, 80); goal.style.zIndex = 3; goal.style.opacity = ".95";
  Snd.amb("wind"); fromDark(); await sleep(300);
  await chapterTitle(1, "Небо без опор", "k0");
  await say("k1");

  cue("k2");
  const blocks = await towerGame(groundY);
  await say("k3");
  blocks.forEach(b => fadeOut(b, 500));

  cue("k4");
  const plank = await plankDrop(groundY);
  await say("k5");
  fadeOut(plank);

  /* огромное небо без опор */
  sk.style.transition = "background 2s"; sk.style.background = "linear-gradient(180deg,#2E86C9 0%,#7CC6EE 55%,#E6F6FC 100%)";
  goal.animate([{ transform: "translateY(0)" }, { transform: "translateY(-30px)" }], { duration: 2000, fill: "forwards", easing: "ease-out" });
  Snd.gust(3);
  await say("k6");
  const misses = await choice("kq", [{ id: "kqa", icon: ICON.pillar }, { id: "kqc", ar: true, ok: true }, { id: "kqb", icon: ICON.cloud }], "kq_ok");
  await say("k_quran");
  await ayahCard("35:41");
  await say("k_end", { btn: "Субханаллах" });
  hideCap(); await award("cloud");
  return misses;
}

/* ============ ГЛАВА 2: РАЗНЫЕ ПЛОДЫ ============ */
async function chFruit() {
  await toDark(); clearStage();
  sky("linear-gradient(180deg,#6CC0EA 0%,#B7E3F6 55%,#F4F0D8 100%)");
  const { W, H } = size(); sunAt(W * 0.82, H * 0.36, 120); clouds(2, 0.3, 0.42); hills(0.34, ["#B5DE98", "#8CCB72", "#69B65E"]);
  const night = el("div", "nightveil"); night.style.opacity = "0"; vignette();
  const groundY = H * 0.8;
  Snd.amb("wind", 0.8); fromDark(); await sleep(300);
  await chapterTitle(2, "Разные плоды", "f0");

  const tw = Math.min(W * 0.32, 160), th = tw * 1.42;
  const trees = [["apple", 0.2], ["palm", 0.5], ["vine", 0.8]].map(([k, fx]) => { const t = obj("tree", ART[k], W * fx, groundY - th / 2, tw, th); t.style.zIndex = 3; t.style.transformOrigin = "50% 100%"; return t; });
  const grow = p => trees.forEach(t => { t.style.transform = `scale(${(0.18 + 0.82 * p).toFixed(3)})`; t.classList.toggle("grown", p > 0.85); });
  grow(0);
  await say("f1");

  /* лейка: держать палец */
  const can = obj("can", ART.can, W * 0.5, H * 0.5, 96, 72); can.style.zIndex = 8; fadeIn(can);
  cue("f2");
  let lastDrop = 0;
  await hold(can, 2000, (p, dt) => {
    can.style.transform = `rotate(${(-28 * Math.min(1, p * 5)).toFixed(1)}deg)`;
    lastDrop += dt;
    if (lastDrop > 90) {
      lastDrop = 0; const t = trees[Math.floor(Math.random() * 3)];
      const d = el("div", "drop"); d.style.zIndex = 7;
      d.animate([{ left: (can._x - 40) + "px", top: (can._y + 4) + "px" }, { left: (t._x + rnd(-12, 12)) + "px", top: (groundY - 4) + "px" }], { duration: 600, easing: "ease-in", fill: "forwards" }).onfinish = () => d.remove();
      if (Math.random() < 0.3) Snd.splash();
    }
  });
  can.style.transform = "rotate(0deg)"; fadeOut(can);
  grow(0.1);

  /* ползунок времени: сад растёт */
  cue("f3");
  let fruitsShown = false;
  await timeSlider(p => {
    grow(p);
    night.style.opacity = (0.5 * Math.max(0, Math.sin(p * Math.PI * 10))).toFixed(2);
    if (p > 0.85 && !fruitsShown) { fruitsShown = true; Snd.sparkle(); }
  });
  night.style.opacity = "0";
  await say("f4");

  /* лаборатория: вода + сахар + краска = не яблоко */
  const bowl = obj("bowl", ART.bowl, W * 0.5, H * 0.62, 150, 84); bowl.style.zIndex = 8; fadeIn(bowl);
  const liq = bowl.querySelector(".liq");
  const parts = [
    { svg: ART.jugw, fx: 0.18, apply: () => { liq.setAttribute("fill", "#9FD3EA"); liq.setAttribute("opacity", ".9"); Snd.splash(); } },
    { svg: ART.sugar, fx: 0.5, apply: () => { Snd.sparkle(); } },
    { svg: ART.paint, fx: 0.82, apply: () => { liq.setAttribute("fill", "#E8584C"); liq.setAttribute("opacity", ".85"); Snd.splash(); } }
  ].map(o => ({ ...o, el: obj("ingr", o.svg, W * o.fx, H * 0.88, 70, 70) }));
  parts.forEach(o => { o.el.style.zIndex = 9; fadeIn(o.el); });
  cue("f5");
  await Promise.all(parts.map(o => dragTo(o.el, bowl).then(() => { fadeOut(o.el, 300); o.apply(); })));
  for (let i = 0; i < 3; i++) { bowl.animate([{ rotate: "0deg" }, { rotate: "-4deg" }, { rotate: "4deg" }, { rotate: "0deg" }], { duration: 400 }); Snd.splash(); await sleep(420); }
  await say("f6");
  await say("f7");
  fadeOut(bowl);
  const misses = await choice("fq", [{ id: "fqc", ar: true, ok: true }, { id: "fqa", icon: ICON.drop }, { id: "fqb", icon: ICON.soil }], "fq_ok");
  await say("f_quran");
  await ayahCard("13:4");
  await say("f_end", { btn: "Альхамдулиллях" });
  hideCap(); await award("date");
  return misses;
}

/* ============ ГЛАВА 3: КОРАБЛЬ И ВЕТЕР ============ */
/* Вести корабль пальцем вверх-вниз между камнями до гавани */
function steerGame(ship, seaTop, sz, ms = 14000) {
  const { W, H } = size();
  const minY = seaTop - sz * 0.12, maxY = H - sz * 0.45;
  return new Promise(res => {
    let targetY = ship._y, down = false, fin = false, spawnT = 0, last = performance.now();
    const t0 = last, rocks = [];
    const field = el("div", "tapfield"); field.style.zIndex = 7;
    const aim = ev => { targetY = Math.max(minY, Math.min(maxY, local(ev).y - sz * 0.15)); };
    field.addEventListener("pointerdown", ev => { down = true; aim(ev); });
    field.addEventListener("pointermove", ev => { if (down) aim(ev); });
    const up = () => { down = false; };
    window.addEventListener("pointerup", up);
    const loop = t => {
      if (fin) return;
      const dt = Math.min(0.05, (t - last) / 1000); last = t;
      put(ship, ship._x, ship._y + (targetY - ship._y) * Math.min(1, dt * 7));
      spawnT -= dt;
      if (t - t0 < ms && spawnT <= 0) {
        spawnT = rnd(1.1, 1.6);
        const r = obj("rock", ART.rock, W + 60, rnd(minY, maxY) + sz * 0.32, 70, 50); r.style.zIndex = 5; rocks.push(r);
      }
      if (Math.random() < 0.02) windLines(2, 0.3, 0.55);
      rocks.forEach(r => {
        put(r, r._x - W * 0.32 * dt, r._y);
        if (!r.hit && Math.abs(r._x - ship._x) < sz * 0.38 && Math.abs(r._y - (ship._y + sz * 0.32)) < 34) {
          r.hit = true; Snd.thud(0.5); ship.animate([{ rotate: "0deg" }, { rotate: "-5deg" }, { rotate: "4deg" }, { rotate: "0deg" }], { duration: 450 });
        }
      });
      for (let i = rocks.length - 1; i >= 0; i--) if (rocks[i]._x < -80) { rocks[i].remove(); rocks.splice(i, 1); }
      if (t - t0 > ms + 2500 && !rocks.length) { fin = true; field.remove(); window.removeEventListener("pointerup", up); return res(); }
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  });
}
async function chShip() {
  await toDark(); clearStage();
  sky("linear-gradient(180deg,#5AB2E4 0%,#A9DCF3 60%,#E9F6FB 100%)");
  const { W, H } = size(); sunAt(W * 0.8, H * 0.36, 140); clouds(3, 0.26, 0.42);
  const seaTop = H * 0.58;
  const isl = obj("island", ART.island, W * 0.2, seaTop - 18, 180, 72); isl.style.opacity = .85;
  const sea = seaLayer(seaTop, ["#4DB0D8", "#3C9CC8", "#2C80AE"]);
  for (let i = 0; i < 9; i++) { const g = el("div", "glint", sea); g.style.left = rnd(5, 92) + "%"; g.style.top = rnd(12, 80) + "%"; g.style.animationDelay = rnd(0, 3) + "s"; }
  const sz = Math.min(W * 0.5, 220);
  const ship = obj("ship", `<div class="bob" style="width:100%;height:100%">${ART.ship}</div>`, -sz, seaTop - sz * 0.2, sz, sz);
  ship.style.zIndex = 6; vignette();
  Snd.amb("sea"); fromDark(); await sleep(300);
  await chapterTitle(3, "Корабль и ветер", "s0");

  Snd.gust(4); windLines(10, 0.25, 0.55);
  const sail = move(ship, W * 0.6, ship._y, 4200, "ease-out");
  await say("s1"); await sail;
  ship.classList.add("slack");
  await say("s2");

  /* дуть: держать палец, пока не кончится воздух */
  cue("s3");
  let puffT = 0;
  await hold(ship, 2400, (p, dt) => {
    puffT += dt; if (puffT > 160) { puffT = 0; puffs(ship._x - sz * 0.45, ship._y - sz * 0.1, 2, sz * 0.3); Snd.noise({ kind: "pink", f: 700, dur: 0.25, gain: 0.08 }); }
    put(ship, ship._x + dt * 0.004, ship._y);
  });
  await say("s4");

  /* веер: водить пальцем туда-сюда */
  const fan = obj("fan", ART.fan, W * 0.2, seaTop - 80, 96, 78);
  fan.style.zIndex = 7; fadeIn(fan);
  cue("s5");
  await strokes(fan, 6, k => {
    Snd.whoosh(0.18); puffs(fan._x + 30, fan._y, 3, ship._x - fan._x - 60);
    fan.animate([{ rotate: "0deg" }, { rotate: (k % 2 ? 18 : -18) + "deg" }, { rotate: "0deg" }], { duration: 260 });
  });
  ship.animate([{ rotate: "0deg" }, { rotate: "1.5deg" }, { rotate: "0deg" }], { duration: 600 });
  await say("s6");
  fadeOut(fan);

  const efan = obj("efan", ART.efan, W * 0.18, seaTop - 46, 92, 129);
  efan.style.zIndex = 7; fadeIn(efan);
  const blades = efan.querySelector(".fanblades");
  cue("s7"); await tapOnce(efan);
  blades.classList.add("spin"); Snd.hum(4.5);
  const blow = setInterval(() => puffs(efan._x + 40, efan._y - 18, 2, ship._x - efan._x - 70), 300);
  ship.animate([{ translate: "-50% -50%" }, { translate: "calc(-50% + 4px) -50%" }, { translate: "-50% -50%" }], { duration: 900, iterations: 2 });
  await sleep(2600); blades.classList.replace("spin", "slow"); await sleep(1600);
  clearInterval(blow); blades.classList.remove("slow");
  await say("s8");
  fadeOut(efan);

  await say("s9", { btn: "Попросить Аллаха" });
  hideCap(); await sleep(500);
  Snd.gust(5); windLines(18, 0.2, 0.6);
  await sleep(500); ship.classList.remove("slack");
  fadeOut(isl, 1500);
  await move(ship, W * 0.3, ship._y, 1500, "ease-in-out");

  /* ветер от Аллаха: вести корабль домой между камнями */
  cue("s10");
  await steerGame(ship, seaTop, sz);
  const lh = obj("lighthouse", ART.lighthouse, W + 70, seaTop - 40, 110, 110); lh.style.zIndex = 4;
  await move(lh, W * 0.84, lh._y, 1800, "ease-out");
  await move(ship, W * 0.84 - sz * 0.9, seaTop - sz * 0.2, 1600, "ease-in-out");
  await say("s11");

  const misses = await choice("sq", [{ id: "sqa", icon: ICON.sail }, { id: "sqb", icon: ICON.fan }, { id: "sqc", ar: true, ok: true }], "sq_ok");
  await say("s_quran");
  await ayahCard("42:32-33");
  await say("s_end");
  hideCap(); await award("anchor");
  return misses;
}

/* ============ ГЛАВА 4: ГОРЫ ============ */
function mountainsLayer(h = 0.42) {
  const g = el("div", "layer", stage, `<svg viewBox="0 0 400 200" preserveAspectRatio="xMidYMax slice" aria-hidden="true"><defs>
    <linearGradient id="gMt1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9DB4C2"/><stop offset="1" stop-color="#7F98A8"/></linearGradient>
    <linearGradient id="gMt2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7D93A2"/><stop offset="1" stop-color="#5F7889"/></linearGradient></defs>
    <path d="M-20 200 L60 70 L110 120 L170 40 L240 130 L300 60 L420 200Z" fill="url(#gMt1)" opacity=".8"/>
    <path d="M60 70 L46 93 L58 88 L66 98 L74 86Z M170 40 L152 70 L166 63 L176 74 L186 62Z M300 60 L284 86 L298 80 L306 90 L316 79Z" fill="#fff" opacity=".9"/>
    <path d="M-20 200 L90 110 L150 150 L230 90 L330 160 L420 120 L420 200Z" fill="url(#gMt2)"/>
    <path d="M230 90 L216 106 L228 102 L236 110 L245 101Z" fill="#fff" opacity=".85"/></svg>`);
  g.style.bottom = "18%"; g.style.height = (h * 100) + "%";
  return g;
}
async function chMountain() {
  await toDark(); clearStage();
  sky("linear-gradient(180deg,#5AAEE0 0%,#A6D8F2 60%,#E6F5FB 100%)");
  const { W, H } = size(); sunAt(W * 0.2, H * 0.36, 120); clouds(2, 0.28, 0.4); mountainsLayer(); hills(0.26, ["#B9D98F", "#94C46E", "#73AE57"]); vignette();
  const groundY = H * 0.86;
  Snd.amb("wind"); fromDark(); await sleep(300);
  await chapterTitle(4, "Горы", "m0");
  await say("m1");

  /* ведёрко: держать палец, песок сыплется, гора растёт */
  const pile = obj("pile", ART.sand, W * 0.5, groundY - 20, 120, 70); pile.style.zIndex = 5; pile.style.transformOrigin = "50% 100%";
  let k = 0.15; pile.style.transform = `scale(${k})`;
  const bucket = obj("bucket", ART.bucket, W * 0.62, groundY - 150, 74, 74); bucket.style.zIndex = 7; fadeIn(bucket);
  cue("m2");
  let grain = 0;
  await hold(bucket, 2600, (p, dt) => {
    bucket.style.transform = `rotate(${(-40 * Math.min(1, p * 5)).toFixed(1)}deg)`;
    k = 0.15 + 1.25 * p; pile.style.transform = `scale(${k.toFixed(3)})`;
    grain += dt; if (grain > 70) { grain = 0; const s = el("div", "grain"); s.style.zIndex = 6; s.animate([{ left: (bucket._x - 30) + "px", top: (bucket._y + 10) + "px" }, { left: (pile._x + rnd(-10, 10)) + "px", top: (groundY - 30 * k) + "px" }], { duration: 450, easing: "ease-in", fill: "forwards" }).onfinish = () => s.remove(); }
    if (Math.random() < 0.08) Snd.noise({ kind: "pink", type: "highpass", f: 2500, dur: 0.25, gain: 0.12 });
  });
  bucket.style.transform = "rotate(0deg)"; fadeOut(bucket);
  await sleep(400);
  Snd.gust(2.5);
  for (let i = 0; i < 4; i++) { puffs(pile._x + rnd(-30, 30), pile._y - 20 * k, 6, 140); await sleep(250); }
  pile.style.transition = "transform 1.2s ease-in, opacity 1.2s"; pile.style.transform = "scale(1.4, .25)"; pile.style.opacity = ".5";
  await sleep(900);
  await say("m3");
  fadeOut(pile);

  /* палатка: забить колышки в ритм */
  const tw = Math.min(W * 0.52, 220);
  const tent = obj("tent", ART.tent, W * 0.5, groundY - tw * 0.36, tw, tw * 0.75); tent.style.zIndex = 5; tent.style.transformOrigin = "50% 100%";
  fadeIn(tent);
  const sway = tent.animate([{ rotate: "-5deg" }, { rotate: "6deg" }, { rotate: "-5deg" }], { duration: 900, iterations: Infinity, easing: "ease-in-out" });
  Snd.gust(3);
  const stakes = [-1, 1].map(d => { const st = obj("stake", ART.stake, W * 0.5 + d * tw * 0.56, groundY - 40, 26, 54); st.style.zIndex = 6; fadeIn(st); return st; });
  const hammer = obj("hammer", ART.hammer, stakes[0]._x + 26, stakes[0]._y - 56, 60, 60); hammer.style.zIndex = 8;
  cue("m4");
  await timingGame(6, n => {
    const st = stakes[n <= 3 ? 0 : 1];
    put(hammer, st._x + 26, st._y - 56);
    hammer.animate([{ rotate: "0deg" }, { rotate: "-50deg" }, { rotate: "0deg" }], { duration: 220 });
    Snd.thud(0.6); Snd.noise({ f: 1600, q: 3, dur: 0.05, gain: 0.25, attack: 0.002 });
    move(st, st._x, st._y + 7, 120, "ease-in");
    sway.playbackRate = Math.max(0.2, 1 - n * 0.15);
    if (n === 3) setTimeout(() => put(hammer, stakes[1]._x + 26, stakes[1]._y - 56), 300);
  });
  fadeOut(hammer);
  sway.cancel(); tent.animate([{ rotate: "2deg" }, { rotate: "0deg" }], { duration: 400 });
  await say("m5");
  await say("m6");
  const misses = await choice("mq", [{ id: "mqa", icon: ICON.sand }, { id: "mqb", icon: ICON.wind }, { id: "mqc", ar: true, ok: true }], "mq_ok");
  await say("m_quran");
  await ayahCard("78:6-7");
  await say("m_end", { btn: "Аллаху Акбар" });
  hideCap(); await award("stone");
  return misses;
}

/* ============ ГЛАВА 5: СОЛНЦЕ-СВЕТИЛЬНИК ============ */
/* Доля долины, освещённая источниками: считаем по сетке точек */
function coverage(spots, W, H) {
  let hit = 0, all = 0;
  for (let i = 0; i < 20; i++) for (let j = 0; j < 8; j++) {
    const x = W * (i + 0.5) / 20, y = H * (0.5 + 0.48 * (j + 0.5) / 8); all++;
    if (spots.some(s => Math.hypot(s.x - x, s.y - y) < s.r)) hit++;
  }
  return hit / all;
}
async function chSunLamp() {
  await toDark(); clearStage();
  const sk = sky("linear-gradient(180deg,#0E2238 0%,#1D3D5C 60%,#35577A 100%)");
  const { W, H } = size(); hills(0.34, ["#5D7F6A", "#4C6E5A", "#3B5C4A"]);
  const stars = el("div", "layer", stage, `<svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><g class="twinkle" fill="#FFF6DD">${Array.from({ length: 40 }, () => `<circle cx="${rnd(0, 400).toFixed(0)}" cy="${rnd(0, 260).toFixed(0)}" r="${rnd(0.6, 1.6).toFixed(1)}"/>`).join("")}</g></svg>`);
  stars.style.inset = "0 0 40% 0";
  const frost = el("div", "layer", stage, Array.from({ length: 26 }, () => `<i class="frost" style="left:${rnd(2, 98).toFixed(1)}%;top:${rnd(10, 90).toFixed(1)}%"></i>`).join(""));
  frost.style.bottom = "0"; frost.style.height = "30%";
  const night = el("div", "nightveil"); vignette();
  const groundY = H * 0.8;
  Snd.amb("wind", 0.6); fromDark(); await sleep(300);
  await chapterTitle(5, "Солнце-светильник", "l0");
  await say("l1");

  const gauges = meters([{ label: "Свет", color: "#F5C451" }, { label: "Тепло", color: "#F07A55" }]), [mLight, mHeat] = gauges;
  const lights = [], heats = [];
  const lamp = obj("lamp", ART.lantern, W * 0.28, groundY - 30, 50, 74); lamp.style.zIndex = 8; fadeIn(lamp);
  cue("l2"); await tapOnce(lamp);
  lamp.querySelector(".flamel").setAttribute("opacity", "1"); Snd.noise({ type: "highpass", f: 2500, dur: 0.08, gain: 0.3, attack: 0.002 });
  glowSpot(lamp._x, lamp._y, 110).style.zIndex = 7; lights.push({ x: lamp._x, y: lamp._y, r: 80 });
  mLight.set(coverage(lights, W, H)); mHeat.set(0.02);
  await say("l3");

  const heat = obj("heater", ART.heater, W * 0.72, groundY - 24, 80, 72); heat.style.zIndex = 8; fadeIn(heat);
  cue("l4"); await tapOnce(heat);
  heat.querySelectorAll(".coils path").forEach(c => c.setAttribute("stroke", "#F07A55")); Snd.hum(1.2);
  glowSpot(heat._x, heat._y, 100, "255,150,90").style.zIndex = 7; heats.push({ x: heat._x, y: heat._y, r: 70 });
  mHeat.set(coverage(heats, W, H));
  await say("l5");

  cue("l6");
  let batteries = 5; capNote.textContent = "Батареек: 5";
  const field = el("div", "tapfield"); field.style.zIndex = 6;
  await new Promise(r => {
    let fin = false; const end = () => { if (fin) return; fin = true; field.remove(); r(); };
    const place = (x, y) => {
      batteries--; Snd.tap(); capNote.textContent = "Батареек: " + batteries;
      const l = obj("lamp", ART.lantern, x, y, 34, 50); l.style.zIndex = 8; l.querySelector(".flamel").setAttribute("opacity", "1"); fadeIn(l);
      glowSpot(x, y, 70).style.zIndex = 7; lights.push({ x, y, r: 52 }); mLight.set(coverage(lights, W, H));
      if (batteries <= 0) setTimeout(end, 700);
    };
    field.addEventListener("pointerdown", ev => { const p = local(ev); if (p.y < H * 0.55 || batteries <= 0) return; place(p.x, p.y); });
    setTimeout(async () => { while (!fin && batteries > 0) { place(rnd(W * 0.1, W * 0.9), rnd(H * 0.62, H * 0.9)); await sleep(400); } end(); }, 15000);
  });
  capNote.textContent = "";
  await say("l7");
  await say("l8", { btn: "Смотрю" });
  hideCap();

  /* восход: светло и тепло сразу везде */
  const sun = sunAt(W * 0.5, H * 0.75, 170); stage.insertBefore(sun, sk.nextSibling);   // за холмами
  sun.animate([{ top: (H * 0.75) + "px" }, { top: (H * 0.32) + "px" }], { duration: 3500, easing: "ease-out", fill: "forwards" });
  sk.style.transition = "background 3s"; sk.style.background = "linear-gradient(180deg,#5AB2E4 0%,#A9DCF3 60%,#F3E8C4 100%)";
  [night, stars, frost].forEach(e => { e.style.transition = "opacity 3s"; e.style.opacity = "0"; });
  stage.querySelectorAll(".glowspot").forEach(g => { g.style.transition = "opacity 2s"; g.style.opacity = "0"; });
  Snd.amb("meadow", 0.8);
  const l0 = mLight.v, h0 = mHeat.v;
  for (let i = 1; i <= 30; i++) { mLight.set(l0 + (1 - l0) * i / 30); mHeat.set(h0 + (1 - h0) * i / 30); await sleep(100); }
  Snd.sparkle();
  await say("l9");
  gauges.remove();
  const misses = await choice("lq", [{ id: "lqa", icon: ICON.lantern }, { id: "lqc", ar: true, ok: true }, { id: "lqb", icon: ICON.heater }], "lq_ok");
  await say("l_quran");
  await ayahCard("71:15-16");
  await say("l_end", { btn: "Альхамдулиллях" });
  hideCap(); await award("sunray");
  return misses;
}

/* ============ ГЛАВА 6: ЗВЁЗДЫ ============ */
async function chStars() {
  await toDark(); clearStage();
  sky("linear-gradient(180deg,#081A2C 0%,#12304A 60%,#1D4462 100%)");
  const { W, H } = size();
  const seaTop = H * 0.6;
  const stars = el("div", "layer", stage, `<svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><g class="twinkle" fill="#FFF6DD">${Array.from({ length: 60 }, () => `<circle cx="${rnd(0, 400).toFixed(0)}" cy="${rnd(0, 280).toFixed(0)}" r="${rnd(0.5, 1.3).toFixed(1)}"/>`).join("")}</g></svg>`);
  stars.style.inset = "0 0 40% 0"; stars.style.opacity = "0";
  /* ковш Большой Медведицы и Полярная звезда: две крайние звезды ковша смотрят на Полярную */
  const P = { x: W * 0.8, y: H * 0.31 }, D = { x: W * 0.47, y: H * 0.4 };
  const M = { x: D.x - (P.x - D.x) * 0.3, y: D.y - (P.y - D.y) * 0.3 };
  const dipper = [{ x: W * 0.08, y: H * 0.33 }, { x: W * 0.17, y: H * 0.325 }, { x: W * 0.26, y: H * 0.345 }, { x: W * 0.35, y: H * 0.37 }, { x: W * 0.29, y: H * 0.405 }, M, D];
  const polaris = obj("guide", '<svg viewBox="0 0 60 60" aria-hidden="true"><circle cx="30" cy="30" r="28" fill="rgba(255,236,170,.25)"/><path d="M30 6 L34 26 L54 30 L34 34 L30 54 L26 34 L6 30 L26 26Z" fill="#FFF3C4"/></svg>', P.x, P.y, 56, 56);
  polaris.style.opacity = "0"; polaris.style.zIndex = 4;
  const lh = obj("lighthouse", ART.lighthouse, W * 0.86, seaTop - 40, 110, 110); lh.style.zIndex = 2;
  const sea = seaLayer(seaTop, ["#1F4E6E", "#183F5A", "#123349"]); sea.classList.add("night");
  const cl = [0.15, 0.45, 0.78].map((fx, i) => { const c = el("div", "cloud dark", stage, ART.cloud); Object.assign(c.style, { left: (W * fx - 120) + "px", top: (H * (0.26 + i * 0.04)) + "px", width: "250px", height: "125px", animation: "none", zIndex: 3 }); return c; });
  const sz = Math.min(W * 0.42, 190);
  const ship = obj("ship", `<div class="bob" style="width:100%;height:100%">${ART.ship}</div>`, W * 0.3, seaTop - sz * 0.2, sz, sz); ship.style.zIndex = 5;
  vignette();
  Snd.amb("sea", 0.7); fromDark(); await sleep(300);
  await chapterTitle(6, "Звёзды", "z0");
  await say("z1");

  const lamp = obj("lamp", ART.lantern, ship._x + sz * 0.42, ship._y + sz * 0.05, 34, 50); lamp.style.zIndex = 6;
  cue("z2"); await tapOnce(lamp);
  lamp.querySelector(".flamel").setAttribute("opacity", "1");
  glowSpot(lamp._x, lamp._y + 20, 90).style.zIndex = 5;
  await say("z3");

  /* нарисованная звезда гаснет */
  cue("z4");
  const drawn = await drawStroke(seaTop - 30);
  Snd.sparkle();
  drawn.animate([{ opacity: 1, filter: "drop-shadow(0 0 8px #FFE7A0)" }, { opacity: 1, offset: 0.4 }, { opacity: 0 }], { duration: 2200, fill: "forwards" });
  await sleep(2200); drawn.remove();
  await say("z5");
  await say("z6", { btn: "Смотрю" });
  hideCap();
  cl.forEach((c, i) => c.animate([{ transform: "translateX(0)", opacity: 1 }, { transform: `translateX(${(i % 2 ? 1 : -1) * W * 0.9}px)`, opacity: 0 }], { duration: 3000, easing: "ease-in", fill: "forwards" }));
  Snd.gust(3);
  stars.style.transition = "opacity 3s"; stars.style.opacity = "1";
  await sleep(2400);

  /* соединить звёзды ковша по порядку */
  cue("z7");
  await connectDots(dipper);
  polaris.style.transition = "opacity 1.2s"; polaris.style.opacity = "1"; Snd.sparkle();
  const arrow = el("div", "layer", stage, `<svg viewBox="0 0 ${W} ${H}" aria-hidden="true"><path d="M${M.x} ${M.y} L${P.x} ${P.y}" stroke="#FFF3C4" stroke-width="2.5" stroke-dasharray="6 7" fill="none" opacity=".85"/><path d="M${P.x} ${P.y + 30} L${lh._x} ${lh._y - 40}" stroke="#FFF3C4" stroke-width="2" stroke-dasharray="4 8" fill="none" opacity=".6"/></svg>`);
  arrow.style.inset = "0"; arrow.style.zIndex = 3; fadeIn(arrow, 900);
  await say("z7b");
  cue("z8"); await tapOnce(ship);
  Snd.gust(3);
  await move(ship, lh._x - sz * 0.95, ship._y, 4200, "ease-in-out");
  lh.querySelector(".lhlamp").setAttribute("fill", "#FFF6C9"); glowSpot(lh._x, lh._y - 38, 70).style.zIndex = 3;
  await say("z9");
  const misses = await choice("zq", [{ id: "zqa", icon: ICON.lantern }, { id: "zqb", icon: ICON.wheel }, { id: "zqc", ar: true, ok: true }], "zq_ok");
  await say("z_quran");
  await ayahCard("16:16");
  await say("z_end");
  hideCap(); await award("star");
  return misses;
}

/* ============ МИР 2. ГЛАВА 7: КТО УСЛЫШИТ? ============ */
/* Звуковые волны: дуги расходятся от точки (x,y) в сторону dir */
function soundWaves(x, y, n = 3, dist = 160, dir = 1, size = 40) {
  for (let i = 0; i < n; i++) {
    const w = el("div", "swave"); w.style.left = x + "px"; w.style.top = y + "px"; w.style.width = w.style.height = size + "px"; w.style.zIndex = 6;
    w.animate([{ transform: `translate(-50%,-50%) translateX(0) scale(.6)`, opacity: .9 }, { transform: `translate(-50%,-50%) translateX(${dir * dist}px) scale(1.8)`, opacity: 0 }],
      { duration: 1100, delay: i * 180, easing: "ease-out" }).onfinish = () => w.remove();
  }
}
async function chHear() {
  await toDark(); clearStage();
  sky("linear-gradient(180deg,#6CBBE8 0%,#B4E0F5 60%,#EAF6FB 100%)");
  const { W, H } = size(); sunAt(W * 0.8, H * 0.36, 110); clouds(2, 0.3, 0.42);
  mountainsLayer(0.36);
  const house = obj("house", ART.house, W * 0.86, H * 0.6, 54, 54); house.style.zIndex = 2; house.style.opacity = ".9";
  const seaTop = H * 0.74;
  const sea = seaLayer(seaTop, ["#4DB0D8", "#3C9CC8", "#2C80AE"]);
  const shore = el("div", "layer", stage, `<svg viewBox="0 0 200 60" preserveAspectRatio="none" aria-hidden="true"><path d="M0 14 Q70 4 130 22 Q170 34 200 60 H0Z" fill="#E7CF9C"/><path d="M0 22 Q60 12 120 28" stroke="#D2B47A" stroke-width="2.5" fill="none"/></svg>`);
  shore.style.left = "0"; shore.style.right = "auto"; shore.style.width = "70%"; shore.style.bottom = "0"; shore.style.height = "20%"; shore.style.zIndex = 3;
  vignette();
  Snd.amb("sea", 0.6); fromDark(); await sleep(300);
  await chapterTitle(7, "Кто услышит?", "h0");
  await say("h1");

  /* рупор: держать палец — кричим, горы возвращают эхо */
  const horn = obj("horn", ART.horn, W * 0.24, H * 0.86, 80, 60); horn.style.zIndex = 6; fadeIn(horn);
  cue("h2");
  let waveT = 0;
  await hold(horn, 2000, (p, dt) => { waveT += dt; if (waveT > 280) { waveT = 0; soundWaves(horn._x + 36, horn._y - 6, 1, W * 0.5, 1, 46); Snd.noise({ kind: "pink", f: 800, q: 1.4, dur: 0.3, gain: 0.18 }); } });
  await sleep(500);
  for (let i = 0; i < 3; i++) { soundWaves(W * 0.62, H * 0.55, 1, W * 0.35, -1, 40 - i * 8); Snd.noise({ kind: "pink", f: 800, q: 1.4, dur: 0.35, gain: 0.12 / (i + 1), at: 0 }); await sleep(450); }
  await say("h3");
  fadeOut(horn);

  /* бутылка: перетащить в море — волна уносит */
  const bottle = obj("bottle", ART.bottle, W * 0.3, H * 0.9, 40, 70); bottle.style.zIndex = 7; fadeIn(bottle);
  const target = { _x: W * 0.78, _y: seaTop + (H - seaTop) * 0.35 };
  cue("h4");
  await dragTo(bottle, target);
  Snd.splash();
  bottle.style.transition = "none";
  bottle.animate([{ rotate: "-12deg" }, { rotate: "12deg" }, { rotate: "-12deg" }], { duration: 1400, iterations: 3 });
  await Promise.all([move(bottle, W * 0.62, seaTop + 4, 4200, "ease-in-out"), bottle.animate([{ transform: "scale(1)", opacity: 1 }, { transform: "scale(.35)", opacity: 0 }], { duration: 4200, fill: "forwards" }).finished]);
  bottle.remove();
  await say("h5");

  /* шёпот: волна совсем крошечная и сразу гаснет */
  await say("h6", { btn: "Шепнуть" });
  soundWaves(W * 0.3, H * 0.66, 2, 30, 1, 18); Snd.noise({ kind: "pink", type: "highpass", f: 3500, dur: 0.6, gain: 0.04, attack: 0.2 });
  await sleep(900);
  await say("h7");
  await say("h8", { btn: "Попросить Аллаха" });
  hideCap();
  for (let i = 0; i < 18; i++) {
    const s = el("div", "spark"); s.style.zIndex = 8; s.style.background = ["#FFE7A0", "#FFFFFF", "#F5C451"][i % 3];
    s.animate([{ left: (W * 0.5 + rnd(-40, 40)) + "px", top: (H * 0.8) + "px", opacity: 1 }, { left: (W * 0.5 + rnd(-120, 120)) + "px", top: (H * 0.1) + "px", opacity: 0 }], { duration: rnd(1600, 2400), delay: i * 70, easing: "ease-out" }).onfinish = () => s.remove();
  }
  Snd.sparkle(); await sleep(2200);
  const misses = await choice("hq", [{ id: "hqa", icon: ICON.echo }, { id: "hqb", icon: ICON.bottle }, { id: "hqc", ar: true, ok: true }], "hq_ok");
  await say("h_quran");
  await ayahCard("2:186");
  await say("h_end");
  hideCap(); await award("letter");
  return misses;
}

/* ============ МИР 2. ГЛАВА 8: ДУА ЮНУСА ============ */
/* Собрать слова по порядку: карточки перетаскиваются в пустые места */
function wordPuzzle(words, timeout = 40000) {
  const { W, H } = size();
  return new Promise(res => {
    const slotsY = H * 0.42, cardsY = H * 0.74, sw = Math.min(W * 0.84, 360);
    const slots = words.map((w, i) => { const s = obj("wslot", `<span>${i + 1}</span>`, W / 2, slotsY + i * 64, sw, 54); s.style.zIndex = 8; return s; });
    const order = words.map((_, i) => i).sort(() => Math.random() - 0.5);
    if (order.every((v, i) => v === i)) order.reverse();
    const cards = order.map((wi, j) => {
      const c = obj("wcard", `<b lang="ar" dir="rtl">${words[wi].ar}</b><small>${L(words[wi].id)}</small>`, W / 2, cardsY + j * 66 - 40, sw * 0.92, 58);
      c.style.zIndex = 9; c.dataset.wi = wi; return c;
    });
    let next = 0, fin = false, drag = null, off = null, home = null;
    const hintNext = () => cards.forEach(c => c.classList.toggle("hint", !fin && +c.dataset.wi === next));
    const accept = async c => {
      c.onpointerdown = null; c.classList.remove("hint"); const s = slots[next];
      await move(c, s._x, s._y, 260, "ease-out"); c.classList.add("placed"); s.classList.add("filled");
      Snd.sparkle(); Voice.speak(words[next].id);
      next++; if (next >= words.length) { fin = true; cleanup(); await sleep(1600); res([...slots, ...cards]); } else hintNext();
    };
    const mv = ev => { if (!drag) return; const p = local(ev); put(drag, p.x + off.x, p.y + off.y); };
    const up = () => {
      if (!drag) return; const c = drag; drag = null;
      const s = slots[next];
      if (Math.hypot(c._x - s._x, c._y - s._y) < 70 && +c.dataset.wi === next) accept(c);
      else { if (Math.hypot(c._x - s._x, c._y - s._y) < 70) { Snd.thud(0.25); c.classList.remove("wob"); void c.offsetWidth; c.classList.add("wob"); } move(c, home.x, home.y, 300, "ease-out"); }
    };
    const cleanup = () => { window.removeEventListener("pointermove", mv); window.removeEventListener("pointerup", up); };
    cards.forEach(c => { c.onpointerdown = ev => { ev.preventDefault(); if (fin) return; const p = local(ev); drag = c; off = { x: c._x - p.x, y: c._y - p.y }; home = { x: c._x, y: c._y }; Snd.tap(); }; });
    window.addEventListener("pointermove", mv); window.addEventListener("pointerup", up);
    hintNext();
    setTimeout(async () => { while (!fin) { const c = cards.find(x => +x.dataset.wi === next); drag = null; await accept(c); await sleep(500); } }, timeout);
  });
}
async function chYunus() {
  await toDark(); clearStage();
  const sk = sky("linear-gradient(180deg,#2B3A4A 0%,#4A5C6C 60%,#6D8090 100%)");
  const { W, H } = size();
  const seaTop = H * 0.6;
  const sea = seaLayer(seaTop, ["#34607A", "#2A4F66", "#1F3E52"]);
  const rain = el("div", "layer rain", stage, Array.from({ length: 40 }, () => `<i style="left:${rnd(0, 100).toFixed(1)}%;animation-delay:${(-rnd(0, 1)).toFixed(2)}s;animation-duration:${rnd(0.5, 0.9).toFixed(2)}s"></i>`).join(""));
  rain.style.inset = "0"; rain.style.zIndex = 4;
  const sz = Math.min(W * 0.42, 190);
  const ship = obj("ship", `<div class="storm" style="width:100%;height:100%">${ART.ship}</div>`, W * 0.5, seaTop - sz * 0.2, sz, sz); ship.style.zIndex = 5;
  const flash = el("div", "flash");
  vignette();
  Snd.amb("sea", 1.2); fromDark(); await sleep(300);
  await chapterTitle(8, "Дуа Юнуса", "y0");
  const thunder = setInterval(() => { flash.classList.remove("on"); void flash.offsetWidth; flash.classList.add("on"); Snd.noise({ kind: "brown", type: "lowpass", f: 200, dur: 1.4, gain: 0.5, attack: 0.05 }); }, 3800);
  await say("y1");
  clearInterval(thunder);

  /* три темноты сгущаются одна за другой */
  const veils = ["rgba(10,20,40,.55)", "rgba(6,30,40,.6)", "rgba(2,6,10,.75)"].map(c => { const v = el("div", "veil"); v.style.background = c; return v; });
  cue("y2");
  fadeOut(ship, 1200); fadeOut(rain, 1200);
  await sleep(1400); veils[0].classList.add("on"); Snd.amb("sea", 0.3);
  await sleep(1600);
  cue("y3");
  for (const v of veils.slice(1)) { await sleep(1800); v.classList.add("on"); Snd.noise({ kind: "brown", type: "lowpass", f: 120, dur: 1.5, gain: 0.25, attack: 0.5 }); }
  await sleep(1800);
  await say("y4");

  /* мольба Юнуса: собрать слова по порядку */
  cue("y5");
  const parts = await wordPuzzle([{ id: "y_w1", ar: "لَا إِلَٰهَ إِلَّا أَنْتَ" }, { id: "y_w2", ar: "سُبْحَانَكَ" }, { id: "y_w3", ar: "إِنِّي كُنْتُ مِنَ الظَّالِمِينَ" }]);
  parts.forEach(e => fadeOut(e, 600));
  hideCap();

  /* свет: темноты расходятся, утренний берег */
  veils.forEach((v, i) => setTimeout(() => v.classList.remove("on"), i * 500));
  sk.style.transition = "background 2.5s"; sk.style.background = "linear-gradient(180deg,#F2B880 0%,#F9D9A6 50%,#FFF3DC 100%)";
  sea.querySelectorAll(".wave path").forEach((p, i) => p.setAttribute("fill", ["#5DB8D8", "#4AA6CC", "#3A8FBA"][i]));
  sea.style.background = "linear-gradient(180deg, #5DB8D8 0%, #3A8FBA 100%)";
  const sun = sunAt(W * 0.5, H * 0.62, 150); stage.insertBefore(sun, sk.nextSibling);
  sun.animate([{ top: (H * 0.66) + "px" }, { top: (H * 0.42) + "px" }], { duration: 3000, easing: "ease-out", fill: "forwards" });
  const beach = el("div", "layer", stage, `<svg viewBox="0 0 200 60" preserveAspectRatio="none" aria-hidden="true"><path d="M0 30 Q70 10 140 26 Q180 34 200 30 V60 H0Z" fill="#EBD3A0"/></svg>`);
  beach.style.bottom = "0"; beach.style.height = "16%"; beach.style.zIndex = 4; fadeIn(beach, 1500);
  const palm = obj("tree", ART.palm, W * 0.16, H * 0.8, 100, 140); palm.style.zIndex = 5; palm.classList.add("grown"); fadeIn(palm, 1500);
  Snd.amb("meadow", 0.8); Snd.sparkle();
  await sleep(2500);
  await say("y6");
  const misses = await choice("yq", [{ id: "yqa", icon: ICON.wheel }, { id: "yqc", ar: true, ok: true }, { id: "yqb", icon: ICON.wave }], "yq_ok");
  await say("y_quran");
  await ayahCard("21:87-88");
  await say("y_end");
  hideCap(); await award("pearl");
  return misses;
}

/* ============ МИР 2. ГЛАВА 9: МИЛОСТИ АЛЛАХА ============ */
async function chBless() {
  await toDark(); clearStage();
  const { W, H } = size();
  const room = el("div", "room", stage, `<div class="wall"></div><div class="floor"></div>`);
  const win = obj("window", ART.window, W * 0.5, H * 0.42, Math.min(W * 0.42, 180), Math.min(W * 0.42, 180) * 0.85); win.style.zIndex = 2;
  const table = el("div", "table", stage); Object.assign(table.style, { left: "12%", right: "12%", top: (H * 0.66) + "px" });
  const counter = el("div", "counter2", app, `<span>Милостей:</span> <b>0</b>`);
  let n = 0;
  const bump = (x, y, label) => {
    n++; counter.querySelector("b").textContent = n; counter.classList.remove("bump"); void counter.offsetWidth; counter.classList.add("bump");
    if (label) { const t = el("div", "plus", stage, label); t.style.left = x + "px"; t.style.top = y + "px"; t.style.zIndex = 9; t.animate([{ transform: "translate(-50%,0)", opacity: 1 }, { transform: "translate(-50%,-50px)", opacity: 0 }], { duration: 1100 }).onfinish = () => t.remove(); }
  };
  const things = [
    ["Вода", ART.glass, 0.2, 0.62, 56, 76], ["Хлеб", ART.bread, 0.4, 0.635, 80, 44], ["Финики", ART.dates, 0.62, 0.64, 70, 44], ["Свет", ART.lantern, 0.82, 0.6, 40, 60],
    ["Солнце", null, 0.5, 0.36, 60, 60], ["Дом", ART.house, 0.14, 0.86, 70, 70], ["Тёплое одеяло", ART.blanket, 0.5, 0.86, 120, 60], ["Книга", ART.book, 0.84, 0.86, 70, 54]
  ].map(([label, svg, fx, fy, w, h]) => {
    const o = svg ? obj("thing", svg, W * fx, H * fy, w, h) : obj("thing sunthing", `<svg viewBox="0 0 48 48" aria-hidden="true">${ICON.sunc}</svg>`, W * fx, H * fy, w, h);
    o.style.zIndex = 5; o.dataset.label = label; return o;
  });
  vignette();
  Snd.amb("wind", 0.3); fromDark(); await sleep(300);
  await chapterTitle(9, "Милости Аллаха", "n0");
  cue("n1");
  await new Promise(r => {
    let left = things.length, fin = false;
    things.forEach(o => { o.classList.add("hint", "tapme"); o.onpointerdown = ev => { ev.preventDefault(); if (o.done) return; o.done = true; o.classList.remove("hint"); o.classList.add("got"); Snd.sparkle(); bump(o._x, o._y - 40, o.dataset.label); if (--left === 0 && !fin) { fin = true; setTimeout(r, 600); } }; });
    setTimeout(async () => { for (const o of things) { if (fin) break; if (!o.done) { o.onpointerdown({ preventDefault() {} }); await sleep(300); } } }, 25000);
  });
  await say("n2");

  /* за окном: милостей всё больше и больше */
  hideCap();
  await toDark();
  things.forEach(o => o.remove()); room.remove(); win.remove(); table.remove();
  sky("linear-gradient(180deg,#5AB2E4 0%,#A9DCF3 60%,#F3E8C4 100%)");
  sunAt(W * 0.8, H * 0.32, 120); clouds(3, 0.26, 0.4); mountainsLayer(0.34); hills(0.36, ["#B5DE98", "#8CCB72", "#69B65E"]);
  const river = el("div", "layer", stage, `<svg viewBox="0 0 200 100" preserveAspectRatio="none" aria-hidden="true"><path d="M120 0 Q80 30 110 55 Q140 80 90 100" stroke="#5BB8E0" stroke-width="10" fill="none" stroke-linecap="round"/></svg>`);
  river.style.bottom = "0"; river.style.height = "30%"; river.style.zIndex = 3;
  [0.15, 0.35, 0.7, 0.88].forEach((fx, i) => { const t = obj("tree", i % 2 ? ART.palm : ART.apple, W * fx, H * (0.78 + (i % 2) * 0.04), 70, 100); t.style.zIndex = 4; t.classList.add("grown"); });
  const field = el("div", "layer", stage, `<svg viewBox="0 0 200 40" preserveAspectRatio="none" aria-hidden="true">${Array.from({ length: 8 }, (_, i) => `<path d="M${i * 26} 40 L${i * 26 + 12} 0" stroke="#E7C76A" stroke-width="5"/>`).join("")}</svg>`);
  field.style.left = "50%"; field.style.right = "8%"; field.style.bottom = "4%"; field.style.height = "8%"; field.style.zIndex = 4;
  fromDark(); Snd.amb("meadow", 0.8);
  const fieldTap = el("div", "tapfield"); fieldTap.style.zIndex = 6;
  fieldTap.addEventListener("pointerdown", ev => { const p = local(ev); Snd.sparkle(); bump(p.x, p.y, "+1"); });
  cue("n3");
  let auto = true;
  (async () => {
    let delay = 260;
    while (auto) {
      const x = rnd(W * 0.08, W * 0.92), y = rnd(H * 0.3, H * 0.95);
      const s = el("div", "spark"); s.style.zIndex = 7; s.style.left = x + "px"; s.style.top = y + "px"; s.style.background = "#FFE7A0";
      s.animate([{ transform: "scale(.4)", opacity: 1 }, { transform: "scale(1.6)", opacity: 0 }], { duration: 800 }).onfinish = () => s.remove();
      bump(); if (n % 6 === 0) Snd.noise({ f: 3200, q: 10, dur: 0.1, gain: 0.05 });
      await sleep(delay); delay = Math.max(25, delay * 0.95);
    }
  })();
  await sleep(6000);
  await say("n4");
  auto = false; fieldTap.remove();
  counter.querySelector("span").textContent = "Милостей:"; counter.querySelector("b").textContent = "не сосчитать!"; counter.classList.add("big");
  Snd.sparkle(); await sleep(1200);
  const misses = await choice("nq", [{ id: "nqa", icon: ICON.hundred }, { id: "nqc", icon: ICON.infinity, ok: true }, { id: "nqb", icon: ICON.bolt }], "nq_ok");
  fadeOut(counter);
  await say("n_quran");
  await ayahCard("14:34");
  await say("n_end", { btn: "Альхамдулиллях" });
  hideCap(); await award("drop");
  return misses;
}

/* ============ ФИНАЛ ============ */
async function chFinal() {
  await toDark(); clearStage();
  sky("linear-gradient(180deg,#24557A 0%,#C98A6B 55%,#F6D79A 100%)");
  const { W, H } = size(); sunAt(W * 0.5, H * 0.44, 170); hills(0.3, ["#7E9E78", "#5E8A64", "#3F6E52"]); vignette();
  el("div", "items-row", stage, ITEMS.filter(i => Save.d.items.includes(i.id)).map(i => `<svg viewBox="0 0 100 100" aria-hidden="true">${i.svg}</svg>`).join(""));
  Snd.amb("wind", 0.6); fromDark(); await sleep(500);
  celebrate();
  await say("fin1");
  await say("fin2");
  await say("fin3", { btn: "В меню" });
  hideCap();
}

/* ============ ГЛАВЫ И МИРЫ ============ */
const CHAPTERS = [
  { id: "sky", name: "Небо без опор", icon: ICON.sky, fn: chSky, lines: "k" },
  { id: "fruit", name: "Разные плоды", icon: ICON.fruitc, fn: chFruit, lines: "f" },
  { id: "ship", name: "Корабль и ветер", icon: ICON.ship, fn: chShip, lines: "s" },
  { id: "mountain", name: "Горы", icon: ICON.mountain, fn: chMountain, lines: "m" },
  { id: "sunlamp", name: "Солнце-светильник", icon: ICON.sunc, fn: chSunLamp, lines: "l" },
  { id: "stars", name: "Звёзды", icon: ICON.star, fn: chStars, lines: "z" },
  { id: "hear", name: "Кто услышит?", icon: ICON.echo, fn: chHear, lines: "h" },
  { id: "yunus", name: "Дуа Юнуса", icon: ICON.pearl, fn: chYunus, lines: "y" },
  { id: "bless", name: "Милости Аллаха", icon: ICON.dropc, fn: chBless, lines: "n" }
];
/* Главы, которых ещё нет, записаны просто названием и показываются как "скоро" */
const WORLDS = [
  { t: "Кто всё создал?", s: "Знамения Аллаха вокруг нас", ch: ["sky", "fruit", "ship", "mountain", "sunlamp", "stars", "Сладкая и солёная вода", "День и ночь"] },
  { t: "Только Аллаху", s: "Кому поклоняться и у кого просить помощи", ch: ["hear", "yunus", "bless", "Никто, кроме Аллаха", "Защита у Аллаха"] },
  { t: "Во что верит мусульманин", s: "Шесть столпов веры", ch: ["Вера в Аллаха", "Ангелы", "Книги", "Пророки", "Судный день", "Предопределение"] },
  { t: "Как живёт мусульманин", s: "Пять столпов ислама", ch: ["Шахада", "Омовение", "Намаз", "Пост", "Закят", "Хадж"] },
  { t: "Сокровища Корана", s: "Смысл коротких сур", ch: ["Аль-Фатиха", "Аль-Ихлас", "Аль-Фаляк", "Ан-Нас"] }
];

/* ============ ЗАПУСК ============ */
let running = false;
function nextUndone() { const k = CHAPTERS.findIndex(c => !Save.d.done[c.id]); return k < 0 ? null : k; }
async function play(from, withIntro) {
  running = true; unlockAudio();
  await Voice.load();
  $("#start").classList.add("off");
  if (withIntro) await chIntro();
  for (let k = from; k < CHAPTERS.length; k++) {
    const c = CHAPTERS[k];
    Voice.prefetch(c.lines);
    const misses = await c.fn();
    const st = misses === 0 ? 3 : misses === 1 ? 2 : 1;
    Save.d.done[c.id] = Math.max(Save.d.done[c.id] || 0, st); Save.save();
    await starsToast(st);
  }
  await chFinal();
  showStart();
}
function showStart() {
  running = false; hideCap(); clearStage(); fromDark();
  const any = Object.keys(Save.d.done).length > 0, next = nextUndone();
  $("#goCont").hidden = !any || next == null;
  $("#go").textContent = any ? "Начать сначала" : "Начать";
  $("#go").classList.toggle("glass", any && next != null);
  $("#start").classList.remove("off");
}
async function pickChapter() {
  const k = await chaptersSheet();
  if (k == null) return;
  if (running) { try { sessionStorage.setItem("ayaty_jump", k); } catch (e) {} location.reload(); return; }
  play(k, false);
}

Save.load(); Save.d.items = Save.d.items.filter(i => ITEMS.some(x => x.id === i)); updateBag(false);
Voice.load().then(() => { $("#goVoice b").textContent = voiceName(); });
showStart();
$("#go").onclick = () => { Snd.tap(); play(0, true); };
$("#goCont").onclick = () => { Snd.tap(); const k = nextUndone(); if (k != null) play(k, false); };
$("#goCh").onclick = () => { Snd.tap(); pickChapter(); };
$("#goVoice").onclick = async () => { Snd.tap(); await voiceSheet(); $("#goVoice b").textContent = voiceName(); };
$("#tHome").onclick = () => { Snd.tap(); pickChapter(); };
$("#tBag").onclick = () => { Snd.tap(); bagSheet(); };
$("#tVoice").onclick = e => { Voice.on = !Voice.on; e.currentTarget.setAttribute("aria-pressed", Voice.on); if (!Voice.on) Voice.stop(); };
$("#tSfx").onclick = e => { Snd.setOn(!Snd.on); e.currentTarget.setAttribute("aria-pressed", Snd.on); };
/* После выбора главы во время игры страница перезагружается: предлагаем сразу сыграть выбранную главу */
(() => {
  let j = null; try { j = sessionStorage.getItem("ayaty_jump"); sessionStorage.removeItem("ayaty_jump"); } catch (e) {}
  if (j == null || !CHAPTERS[+j]) return;
  const b = el("button", "btn big", null, "Играть: " + CHAPTERS[+j].name);
  $(".sbtns").prepend(b);
  b.onclick = () => { Snd.tap(); play(+j, false); };
})();
