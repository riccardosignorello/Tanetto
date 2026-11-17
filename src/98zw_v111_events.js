/* =================== 1.0.11: gli eventi trasformano la stanza ===================
   La 1.0.11 resta in uso per mesi: ogni evento cambia la stanza in modo evidente ma delicato, nello stile di Tanetto
   (carta, legno, luce calda, colori morbidi). Tutto e' disegnato nella stanza (SVG, coordinate 360x300 + TOP/BOT dello
   schermo intero); il resto dell'app ha solo un piccolo ornamento accanto al titolo (11zn_v111_events.css).
   - Lanterne (fino al 31/12): tre lanterne di carta appese al soffitto che oscillano piano, luce ambrata in tutta la
     stanza, cielo dorato/viola alla finestra con lanterne che salgono, lucine del villaggio sulle colline, lanternina
     sul davanzale. Dall'8/12 lascia il posto al Natale.
   - Natale (08/12-06/01): neve che cade fuori dalla finestra, colline e abeti innevati, neve sul vetro e brina agli
     angoli, fiocchi di carta appesi, e l'albero c'e' sempre: alla tappa 0 e' un alberello nel vaso con il fiocco
     (toccandolo si aprono le tappe), poi cresce con le tappe come prima (98d).
   - Nuovo inizio (07/01-31/01, mattina e giorno): alba fresca alla finestra con un germoglio sulla collina e un
     calendarietto sulla parete con la pagina nuova (il giorno di oggi e un germoglio). Di sera e di notte: le Stelle.
   - Stelle (gennaio-febbraio): cielo stellato alla finestra (di giorno l'ora blu, di sera e di notte la Via Lattea e
     una stella cadente), stelle di carta appese, barattolo di stelle sul davanzale, luce fredda e soffusa.
   - Aquiloni (marzo-maggio): cielo di primavera con aquiloni (uno resta, uno passa), colline in fiore, tralcio fiorito
     sul bastone della tenda, aquilone appeso alla parete, vaso di tulipani e petali che scendono piano nella stanza.
   Movimento: solo con le animazioni attive e senza la modalita' leggera/calma; tutto gira sul "motore lento"
   dell'ambiente (97s: 16-24 fotogrammi al secondo, fermo quando la stanza non si vede). Con "riduci movimento" la
   stanza e' la stessa ma ferma. Nessun testo: va bene in tutte le lingue. */

const E111_ROD = '<circle cx="156" cy="28" r="5" fill="#8E6440"/>';
const E111_HILL = '<path d="M34 108 C56 100 76 106 96 101';
/* quale evento si vede nella stanza adesso */
function e111Now(d = new Date()) {
  let xm = false, fresh = false, kind = null;
  try { xm = typeof xmOn === "function" && xmOn(d); } catch (e) { xm = false; }
  try { fresh = typeof fs20On === "function" && fs20On(d); } catch (e) { fresh = false; }
  try { const se = curSeason(); kind = se ? seaKind(se) : null; } catch (e) { kind = null; }
  const k = xm ? "xmas" : kind; return k ? { k, fresh } : null;
}
const e111Lite = () => { try { return typeof liteOn === "function" ? liteOn() : typeof isLite === "function" ? isLite() : false; } catch (e) { return false; } };
const e111R = (i, k) => { const v = Math.sin((i + 1) * 12.9898 + k * 78.233) * 43758.5453; return v - Math.floor(v); };
const f1 = (v) => (Math.round(v * 10) / 10).toString();

/* ---------- Disegni ---------- */
/* lanterna di carta (stanza): x,y = centro, s = scala, c = [colore, ombra, luce] */
function e111Lantern(x, y, s, c, lit, halo) {
  return `<g transform="translate(${x} ${y}) scale(${s})">`
    + (halo ? `<circle r="30" fill="url(#${halo})" opacity="${lit ? 1 : 0.5}"/>` : "")
    + `<rect x="-7" y="-17.5" width="14" height="4.5" rx="1.6" fill="#5A3E2B"/>`
    + `<ellipse rx="14" ry="14.5" fill="${c[0]}"/>`
    + `<ellipse rx="8.5" ry="11.5" fill="${c[2]}" opacity="${lit ? 0.75 : 0.45}"/>`
    + `<path d="M0 -14.5 A14 14.5 0 0 1 0 14.5 A6 14.5 0 0 0 0 -14.5 Z" fill="${c[1]}" opacity=".28"/>`
    + `<path d="M-12.6 -7 Q0 -10.4 12.6 -7 M-14 0 Q0 -3 14 0 M-12.6 7 Q0 4 12.6 7" stroke="${c[1]}" stroke-width=".9" fill="none" opacity=".5"/>`
    + `<ellipse cx="-5.4" cy="-5" rx="2.6" ry="4.6" fill="#fff" opacity=".38"/>`
    + `<rect x="-6" y="13" width="12" height="4" rx="1.6" fill="#5A3E2B"/>`
    + `<path d="M0 17 V22" stroke="#C9861F" stroke-width="1.4"/><path d="M-1.8 21.5 H1.8 L2.6 28.5 Q0 29.6 -2.6 28.5 Z" fill="#E2454A"/></g>`;
}
/* lanterna volante piccola (cielo alla finestra) */
const e111SkyLan = (x, y, s, glow) => `<g transform="translate(${f1(x)} ${f1(y)}) scale(${s})">${glow ? `<circle cy="1" r="7" fill="#FFC56B" opacity=".35"/>` : ""}<path d="M-3 -4 L3 -4 L3.8 3.6 Q0 4.8 -3.8 3.6 Z" fill="#F59A3C"/><path d="M-1.6 -4 L-2 3.9 M1.6 -4 L2 3.9" stroke="#C2572A" stroke-width=".5" opacity=".6"/><ellipse cy="2.6" rx="2.2" ry="1.2" fill="#FFE7A0"/></g>`;
/* stella di carta appesa */
function e111PaperStar(x, y, s, c, lit, halo) {
  let d = ""; for (let i = 0; i < 10; i++) { const r = i % 2 ? 5.6 : 13, a = -Math.PI / 2 + (i * Math.PI) / 5; d += `${i ? "L" : "M"}${f1(r * Math.cos(a))} ${f1(r * Math.sin(a))}`; }
  return `<g transform="translate(${x} ${y}) scale(${s})">` + (halo ? `<circle r="28" fill="url(#${halo})" opacity="${lit ? 1 : 0.45}"/>` : "")
    + `<path d="${d}Z" fill="${c[0]}" stroke="${c[1]}" stroke-width="1.4" stroke-linejoin="round"/>`
    + `<path d="M0 -13 L0 0 M12.4 -4 L0 0 M7.6 10.5 L0 0 M-7.6 10.5 L0 0 M-12.4 -4 L0 0" stroke="${c[1]}" stroke-width=".8" opacity=".45"/>`
    + `<path d="M-2.2 -7 L0 -11 L1 -6.6 Z" fill="#fff" opacity=".6"/><circle r="1.6" fill="${c[1]}" opacity=".6"/></g>`;
}
/* fiocco di neve di carta appeso */
function e111Flake(x, y, s) {
  let a = ""; for (let i = 0; i < 6; i++) a += `<g transform="rotate(${i * 60})"><path d="M0 0 V-12 M0 -6.5 L-3.4 -9.6 M0 -6.5 L3.4 -9.6" /></g>`;
  return `<g transform="translate(${x} ${y}) scale(${s})"><g stroke="#B9CDE0" stroke-width="3.6" stroke-linecap="round" fill="none">${a}</g><g stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" fill="none">${a}</g><circle r="2.6" fill="#fff" stroke="#B9CDE0" stroke-width=".8"/></g>`;
}
/* scintilla a quattro punte */
const e111Spark = (x, y, r, c, cls) => `<path${cls ? ` class="${cls}"` : ""} d="M${f1(x)} ${f1(y - r)} Q${f1(x)} ${f1(y)} ${f1(x + r)} ${f1(y)} Q${f1(x)} ${f1(y)} ${f1(x)} ${f1(y + r)} Q${f1(x)} ${f1(y)} ${f1(x - r)} ${f1(y)} Q${f1(x)} ${f1(y)} ${f1(x)} ${f1(y - r)} Z" fill="${c}"/>`;
/* aquilone a rombo con coda di fiocchi (x,y = centro) */
function e111Kite(x, y, s, c, c2, rot) {
  const bows = [10, 17, 24].map((k, i) => { const bx = Math.sin(k / 5) * 3.2, by = 12 + k * 1.15; return `<path d="M${f1(bx - 3)} ${f1(by - 1.6)} L${f1(bx)} ${f1(by)} L${f1(bx - 3)} ${f1(by + 1.6)} Z M${f1(bx + 3)} ${f1(by - 1.6)} L${f1(bx)} ${f1(by)} L${f1(bx + 3)} ${f1(by + 1.6)} Z" fill="${i % 2 ? c : c2}"/>`; }).join("");
  return `<g transform="translate(${x} ${y}) rotate(${rot || 0}) scale(${s})"><path d="M0 12 C-4 17 4 22 0 27 C-4 32 4 37 0 42" stroke="#6B5A47" stroke-width=".9" fill="none" stroke-linecap="round"/>${bows}`
    + `<path d="M0 -13 L9.5 -1 L0 12 L-9.5 -1 Z" fill="${c}"/><path d="M0 -13 L9.5 -1 L0 -1 Z" fill="#fff" opacity=".32"/><path d="M0 -1 L-9.5 -1 L0 12 Z" fill="${c2}" opacity=".85"/>`
    + `<path d="M0 -13 V12 M-9.5 -1 H9.5" stroke="#fff" stroke-opacity=".75" stroke-width=".9"/><path d="M0 -13 L9.5 -1 L0 12 L-9.5 -1 Z" fill="none" stroke="#3A2510" stroke-opacity=".22" stroke-width=".8"/></g>`;
}
/* tulipano */
const e111Tulip = (x, y, h, c, lean) => `<path d="M${x} ${y} Q${x + lean * 0.4} ${y - h * 0.5} ${x + lean} ${y - h}" stroke="#5FA35C" stroke-width="1.5" fill="none"/><path d="M${x + lean - 3.2} ${y - h - 1} Q${x + lean - 3.6} ${y - h - 6.5} ${x + lean - 1.6} ${y - h - 8} L${x + lean} ${y - h - 5.6} L${x + lean + 1.6} ${y - h - 8} Q${x + lean + 3.6} ${y - h - 6.5} ${x + lean + 3.2} ${y - h - 1} Q${x + lean} ${y - h + 1.6} ${x + lean - 3.2} ${y - h - 1} Z" fill="${c}"/>`;
/* gradiente radiale di luce */
const e111Glow = (id, c, op) => `<radialGradient id="${id}" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="${c}" stop-opacity="${op}"/><stop offset=".55" stop-color="${c}" stop-opacity="${op * 0.35}"/><stop offset="1" stop-color="${c}" stop-opacity="0"/></radialGradient>`;
const e111Lin = (id, stops) => `<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1">${stops.map(([o, c, a]) => `<stop offset="${o}" stop-color="${c}"${a != null ? ` stop-opacity="${a}"` : ""}/>`).join("")}</linearGradient>`;
/* cordino + oggetto appeso che oscilla attorno al punto in alto */
const e111Hang = (x, top, y, inner, i) => `<g class="e1sw" data-o="${x} ${top}" data-i="${i}"><path d="M${x} ${top} V${f1(y)}" stroke="#6B5A47" stroke-width="1.1" opacity=".85"/>${inner}</g>`;

/* ---------- Cieli della finestra (prima delle colline: coprono sole e nuvole del cielo normale) ---------- */
function e111Sky(ev, ph) {
  const night = ph === "night", eve = ph === "evening", morn = ph === "morning"; const gid = nid("e1s");
  const rect = (stops) => `<defs>${e111Lin(gid, stops)}</defs><rect x="34" y="42" width="104" height="86" fill="url(#${gid})"/>`;
  let o = "";
  if (ev.k === "lanterns") {
    o += night ? rect([[0, "#272350"], [0.6, "#4A3A70"], [1, "#9A5A6A"]]) : eve ? rect([[0, "#4E4688"], [0.5, "#B86A86"], [1, "#F4A25C"]]) : rect([[0, "#F2B98A"], [0.55, "#F8D3A0"], [1, "#FCE6C0"]]);
    if (night || eve) for (let i = 0; i < 6; i++) o += `<circle cx="${f1(40 + e111R(i, 3) * 92)}" cy="${f1(46 + e111R(i, 5) * 28)}" r="${i % 2 ? 0.8 : 1.1}" fill="#FFF1D0" opacity=".8"/>`;
    else o += `<circle cx="112" cy="94" r="20" fill="#FFE0A0" opacity=".35"/><circle cx="112" cy="94" r="11" fill="#FFD27A"/>`;
  } else if (ev.k === "xmas") {
    o += night ? rect([[0, "#18213F"], [1, "#3A4B78"]]) : eve ? rect([[0, "#3F4A7C"], [0.6, "#9C8BB4"], [1, "#E6B9B8"]]) : morn ? rect([[0, "#C6D6EC"], [1, "#F4E1DE"]]) : rect([[0, "#B9CFE6"], [1, "#E9F0F6"]]);
    if (night) o += `<circle cx="116" cy="60" r="16" fill="#F8F1D4" opacity=".1"/><circle cx="116" cy="60" r="8" fill="#F6EFD6"/><circle cx="119.5" cy="57.5" r="7" fill="#26305A"/>`;
  } else if (ev.k === "kites") {
    if (night) return "";
    o += eve ? rect([[0, "#F0A487"], [0.6, "#F8C9A0"], [1, "#FCE2B8"]]) : morn ? rect([[0, "#A7D7F1"], [1, "#FBE5D4"]]) : rect([[0, "#86C6EE"], [0.7, "#C4E6F7"], [1, "#E4F4FA"]]);
    o += `<circle cx="${eve ? 112 : 126}" cy="${eve ? 98 : 52}" r="13" fill="#FFF3C0" opacity=".45"/><circle cx="${eve ? 112 : 126}" cy="${eve ? 98 : 52}" r="7" fill="${eve ? "#FFC27A" : "#FFE48A"}"/>`;
    o += `<g class="cloud"><path d="M44 72 a7 7 0 0 1 12 -5 a9 9 0 0 1 16 3 a6 6 0 0 1 3 10 h-28 a5 5 0 0 1 -3 -8 Z" fill="#fff" opacity=".92"/></g><g class="cloud2"><path d="M96 92 a5 5 0 0 1 9 -3 a6.5 6.5 0 0 1 11 2 a4.4 4.4 0 0 1 2 7 h-20 a3.6 3.6 0 0 1 -2 -6 Z" fill="#fff" opacity=".8"/></g>`;
  } else if (ev.k === "fresh") {
    o += rect([[0, "#9CD2E8"], [0.5, "#FFE3CC"], [1, "#FFB98A"]]);
    o += `<g opacity=".5">${[[48, 52, 1], [70, 47, 0.8], [128, 50, 0.9]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff"/>`).join("")}</g>`;
    o += `<g stroke="#FFF6E0" stroke-width="2.2" stroke-linecap="round" opacity=".55">${[-62, -38, -14, 10, 34].map((a) => { const r = (a * Math.PI) / 180; return `<path d="M${f1(104 + Math.sin(r) * 20)} ${f1(104 - Math.cos(r) * 20)} L${f1(104 + Math.sin(r) * 34)} ${f1(104 - Math.cos(r) * 34)}"/>`; }).join("")}</g>`;
    o += `<circle cx="104" cy="104" r="24" fill="#FFE6B8" opacity=".55"/><circle cx="104" cy="104" r="14" fill="#FFB660"/><circle cx="104" cy="104" r="10" fill="#FFC97E"/>`;
    o += `<path d="M56 66 q3 -3 6 0 q3 -3 6 0 M74 74 q2.4 -2.4 4.8 0 q2.4 -2.4 4.8 0" stroke="#7A6A78" stroke-width="1.2" fill="none" stroke-linecap="round"/>`;
  } else if (ev.k === "stars") {
    o += night ? rect([[0, "#111737"], [0.55, "#212B62"], [1, "#3F4588"]]) : eve ? rect([[0, "#252B66"], [0.55, "#6D64AA"], [1, "#E2A3A2"]]) : rect([[0, "#5862B4"], [0.55, "#9EA3DE"], [1, "#DCDDF4"]]);
    /* Via Lattea */
    o += `<g opacity="${night ? 0.5 : eve ? 0.36 : 0.22}"><ellipse cx="86" cy="76" rx="70" ry="9" fill="#C9C6FF" opacity=".35" transform="rotate(-28 86 76)"/><ellipse cx="86" cy="76" rx="60" ry="4.5" fill="#EDEBFF" opacity=".45" transform="rotate(-28 86 76)"/></g>`;
    for (let i = 0; i < 16; i++) { const x = 38 + e111R(i, 11) * 96, y = 46 + e111R(i, 17) * (night ? 56 : 44); o += i % 3 ? `<circle class="star" cx="${f1(x)}" cy="${f1(y)}" r="${night ? (i % 2 ? 0.8 : 1.15) : (i % 2 ? 1 : 1.4)}" fill="#FFF8E0"/>` : e111Spark(x, y, night ? 2.6 : 3.2, "#FFF4C8", "star"); }
    o += `<circle cx="118" cy="60" r="15" fill="#FFF3C8" opacity=".14"/><path d="M113 51 a10 10 0 1 0 12 15 a8 8 0 1 1 -12 -15 Z" fill="#FFEFB8"/>`;
    o += `<g class="e1shoot" opacity="0"><path d="M100 50 L124 41" stroke="#FFF6D6" stroke-width="1.2" stroke-linecap="round" opacity=".9"/><circle cx="100" cy="50" r="1.4" fill="#fff"/></g>`;
  }
  return o;
}
/* ---------- Davanti alle colline (dentro la finestra) ---------- */
function e111Win(ev, ph, lit) {
  const night = ph === "night", eve = ph === "evening"; let o = "";
  if (ev.k === "lanterns") {
    /* lucine del villaggio sulle colline e lanterne che salgono */
    if (night || eve) [[50, 114], [64, 118], [98, 110], [118, 116], [130, 112]].forEach(([x, y]) => { o += `<circle cx="${x}" cy="${y}" r="2.6" fill="#FFC56B" opacity=".35"/><rect x="${x - 1}" y="${y - 1}" width="2" height="2" rx=".4" fill="#FFE2A0"/>`; });
    [[48, 96, 1.5], [72, 76, 1.2], [96, 104, 1.6], [114, 66, 1.1], [128, 90, 1.35], [58, 56, 1]].forEach(([x, y, s], i) => { o += `<g class="e1rise" data-y="${y}" data-i="${i}">${e111SkyLan(x, y, s, night || eve)}</g>`; });
  } else if (ev.k === "xmas") {
    const sn = night ? ["#B9C6DE", "#9FB0CE"] : ["#FBFDFF", "#E1EAF3"];
    o += `<path d="M34 110 C52 102 70 108 92 103 C112 99 126 104 138 102 L138 128 L34 128 Z" fill="${sn[1]}"/><path d="M34 118 C58 108 82 116 106 110 C120 107 132 111 138 113 L138 128 L34 128 Z" fill="${sn[0]}"/>`;
    /* abeti innevati e una casetta con la finestra accesa */
    [[48, 112, 1], [58, 108, 0.75], [126, 108, 0.9]].forEach(([x, y, s]) => { o += `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 -14 L7 -2 L4 -2 L9 6 L-9 6 L-4 -2 L-7 -2 Z" fill="${night ? "#2E4A52" : "#3F7A5A"}"/><path d="M0 -14 L3.6 -8 Q0 -6.6 -3.6 -8 Z M-4 -2 Q0 -0.4 4 -2 L5.6 0.6 Q0 2.4 -5.6 0.6 Z" fill="#fff" opacity=".92"/><rect x="-1" y="6" width="2" height="3" fill="#6B4A2E"/></g>`; });
    o += `<g transform="translate(104 104)"><rect x="-8" y="-6" width="16" height="12" fill="${night ? "#7A5A58" : "#B9776A"}"/><path d="M-10.5 -5 L0 -13 L10.5 -5 Z" fill="#fff"/><rect x="-3" y="-2" width="5" height="4.5" fill="${lit ? "#FFD27A" : "#F4E6C8"}"/>${lit ? `<circle cx="-.5" cy=".2" r="7" fill="#FFD27A" opacity=".22"/>` : ""}<rect x="3.6" y="-12" width="2.6" height="5" fill="#8C5A4A"/></g>`;
    /* neve che cade */
    for (let i = 0; i < 14; i++) { const x = 37 + e111R(i, 7) * 98, y = 46 + e111R(i, 13) * 76; o += `<g class="e1snow" data-y="${f1(y)}" data-i="${i}"><circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(1 + e111R(i, 19) * 1.3)}" fill="#fff" opacity="${f1(0.75 + e111R(i, 23) * 0.25)}"/></g>`; }
    /* brina agli angoli e neve sul davanzale esterno */
    const fr = nid("e1f"); o += `<defs><radialGradient id="${fr}" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#fff" stop-opacity=".75"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient></defs>`;
    [[34, 42], [138, 42], [34, 128], [138, 128], [86, 85]].forEach(([x, y], i) => { o += `<circle cx="${x}" cy="${y}" r="${i === 4 ? 9 : 15}" fill="url(#${fr})" opacity="${i === 4 ? 0.45 : 0.7}"/>`; });
    o += `<path d="M34 128 L34 123 Q40 119 46 122 Q53 118 60 122 Q66 120 72 123 Q80 119 86 122 Q93 118 100 122 Q108 119 114 122 Q122 118 128 122 Q134 120 138 122 L138 128 Z" fill="#fff"/>`;
  } else if (ev.k === "kites") {
    if (night) { for (let i = 0; i < 7; i++) o += `<circle class="star" cx="${f1(40 + e111R(i, 29) * 92)}" cy="${f1(84 + e111R(i, 31) * 36)}" r="1.2" fill="#E9F59A"/>`; return o; }
    o += `<path d="M34 112 C54 104 74 110 96 104 C114 100 126 105 138 103 L138 128 L34 128 Z" fill="#8CCB7A"/><path d="M34 119 C58 110 82 118 106 112 C120 109 132 113 138 115 L138 128 L34 128 Z" fill="#A6DA8C"/>`;
    for (let i = 0; i < 14; i++) o += `<circle cx="${f1(38 + e111R(i, 37) * 98)}" cy="${f1(115 + e111R(i, 41) * 11)}" r="1.3" fill="${["#FFFFFF", "#FFC2D4", "#FFE27A", "#F7A9C0"][i % 4]}"/>`;
    /* un aquilone resta (si dondola), uno passa piano attraverso il vetro */
    o += `<g class="e1kite" data-o="62 66"><path d="M62 78 Q52 104 40 132" stroke="#fff" stroke-width=".7" fill="none" opacity=".8"/>${e111Kite(62, 66, 0.82, "#E8603C", "#F2B140", -8)}</g>`;
    if (!eve) o += `<g class="e1pass" data-x="110"><path d="M110 77 Q118 104 132 132" stroke="#fff" stroke-width=".7" fill="none" opacity=".8"/>${e111Kite(110, 74, 0.66, "#5DA9E0", "#F29BB8", 10)}</g>`;
  } else if (ev.k === "fresh") {
    o += `<path d="M34 112 C56 104 76 110 98 105 C116 101 128 106 138 104 L138 128 L34 128 Z" fill="#BFE0C8"/><path d="M34 119 C58 110 82 118 106 112 C120 109 132 113 138 115 L138 128 L34 128 Z" fill="#E3F2E6"/>`;
    o += `<g transform="translate(70 115)"><path d="M0 0 C0 -4 .4 -7 0 -9" stroke="#5FA35C" stroke-width="1.4" fill="none" stroke-linecap="round"/><path d="M0 -8 C-4 -11 -7 -9 -7 -7 C-4 -6 -2 -7 0 -8 Z M0 -8 C4 -12 7 -10 7 -8 C4 -6.6 2 -7.2 0 -8 Z" fill="#7FC27B"/></g>`;
  } else if (ev.k === "stars") {
    if (!night && !eve) return o;
    o += `<path d="M34 116 C58 108 82 115 106 110 C120 107 132 111 138 112 L138 128 L34 128 Z" fill="${night ? "#2A3266" : "#4A4A86"}" opacity=".55"/>`;
  }
  return o;
}
/* ---------- Davanzale ---------- */
function e111Sill(ev, lit, fresh) {
  /* Nuovo inizio (mattina e giorno): calendarietto da tavolo con la pagina nuova, il giorno di oggi e un germoglio */
  if (fresh) return `<g transform="translate(71 130)"><path d="M-11.5 0 L-9.6 -20 L9.6 -20 L11.5 0 Z" fill="#CDB896"/><rect x="-11" y="-23" width="22" height="21.4" rx="2" fill="#FFFDF7" stroke="#E2D6C0" stroke-width=".6"/>`
    + `<path d="M-11 -21 q0 -2 2 -2 h18 q2 0 2 2 v3.6 h-22 Z" fill="#7FB07A"/><circle cx="-5.5" cy="-23" r="1.1" fill="#5A3E2B"/><circle cx="5.5" cy="-23" r="1.1" fill="#5A3E2B"/>`
    + `<g transform="translate(0 -17.9)"><path d="M0 0 V-2.6" stroke="#fff" stroke-width=".8"/><path d="M0 -2.3 C-1.6 -3.6 -2.7 -3 -2.7 -2.2 C-1.6 -1.9 -.8 -2 0 -2.3 Z M0 -2.3 C1.6 -3.8 2.7 -3.2 2.7 -2.4 C1.6 -1.9 .8 -2.1 0 -2.3 Z" fill="#fff"/></g>`
    + `<text x="0" y="-4.6" text-anchor="middle" font-family="Fredoka, 'Trebuchet MS', sans-serif" font-weight="600" font-size="10.5" fill="#4E6B4A">${new Date().getDate()}</text>`
    + `<path d="M5.6 -1.6 L11 -6.6 L11 -3.6 Q11 -1.6 9 -1.6 Z" fill="#EADFCB"/><path d="M5.6 -1.6 L11 -6.6 L6.4 -6.2 Z" fill="#F6EFE2"/></g>`;
  if (ev.k === "lanterns") return `<g transform="translate(70 120.5) scale(.62)">${lit ? `<circle r="16" fill="#FFD27A" opacity=".3"/>` : ""}<rect x="-6" y="-13" width="12" height="3" rx="1" fill="#5A3E2B"/><path d="M-8 -10 L8 -10 L9 13 L-9 13 Z" fill="#F2B33D"/><path d="M-4.5 -10 L-5 13 M4.5 -10 L5 13" stroke="#C9861F" stroke-width="1"/><ellipse cy="3" rx="4.2" ry="5.6" fill="#FFF1C2" opacity="${lit ? 0.95 : 0.6}"/><rect x="-10" y="13" width="20" height="3" rx="1" fill="#5A3E2B"/><path d="M-4 -13 Q0 -21 4 -13" stroke="#5A3E2B" stroke-width="1.4" fill="none"/></g>`;
  if (ev.k === "stars") return `<g transform="translate(72 118)">${lit ? `<circle cy="2" r="13" fill="#FFE7A0" opacity=".28"/>` : ""}<rect x="-5.5" y="-10.4" width="11" height="3" rx="1" fill="#C79A6B"/><path d="M-6.5 -7.6 h13 q2 0 2 2 v15.6 q0 2 -2 2 h-13 q-2 0 -2 -2 v-15.6 q0 -2 2 -2 Z" fill="#DCEAF6" opacity=".55" stroke="#A9C3DA" stroke-width=".8"/>${[[-3, 6], [2.6, 3.6], [-1, 0], [3, 8.4], [-3.6, -3]].map(([x, y], i) => e111Spark(x, y, i % 2 ? 1.8 : 2.3, i % 2 ? "#FFF3C8" : "#FFD25E", "star")).join("")}<path d="M-5 -6 v14" stroke="#fff" stroke-width="1" opacity=".55" stroke-linecap="round"/></g>`;
  if (ev.k === "kites") return `<g transform="translate(72 130)">${e111Tulip(-3, -9, 7, "#F2789B", -2.4)}${e111Tulip(0, -9, 10, "#FFC94D", 0.6)}${e111Tulip(3, -9, 6.5, "#E8603C", 3)}<path d="M-6 -10 L6 -10 L4.6 0 L-4.6 0 Z" fill="#D98A63"/><rect x="-7" y="-11.4" width="14" height="3" rx="1.2" fill="#C77650"/></g>`;
  return "";
}
/* ---------- Stanza: soffitto, parete, bastone della tenda ---------- */
function e111Deco(ev, top, lit, dark, opts) {
  let o = ""; const halo = nid("e1h"); const night = opts.ph === "night";
  const T = -top; /* soffitto (nello schermo intero sale) */
  if (ev.k === "lanterns") {
    o += `<defs>${e111Glow(halo, "#FFC46A", lit ? 0.75 : 0.42)}</defs>`;
    const C = [["#F08A3C", "#B5531F", "#FFD9A0"], ["#E2654F", "#A63A2C", "#FFC9A8"], ["#F2B33D", "#B97A14", "#FFF0C4"]];
    [[166, 40, 0.74, 0], [252, 50, 0.9, 1], [336, 68, 0.7, 2]].forEach(([x, y, s, c], i) => { o += e111Hang(x, T, y - 17.5 * s, e111Lantern(x, y, s, C[c], lit, halo), i); });
  } else if (ev.k === "xmas") {
    [[242, 44, 0.9], [336, 70, 0.75], [168, 56, 0.6]].forEach(([x, y, s], i) => { o += e111Hang(x, T, y - 12 * s, e111Flake(x, y, s), i); });
  } else if (ev.k === "stars" || ev.k === "fresh") {
    o += `<defs>${e111Glow(halo, "#FFE7A0", lit ? 0.6 : 0.3)}</defs>`;
    [[166, 38, 0.74, 0], [252, 48, 0.92, 1], [336, 68, 0.72, 0]].forEach(([x, y, s, c], i) => { o += e111Hang(x, T, y - 13 * s, e111PaperStar(x, y, s, c ? ["#FFE7A0", "#D8A73A"] : ["#F2C14E", "#C9962E"], lit, halo), i); });
    if (lit || dark) for (let i = 0; i < 7; i++) o += e111Spark(176 + e111R(i, 43) * 170, 10 + e111R(i, 47) * 70 - (i % 2 ? 0 : 6), 1.6 + (i % 3) * 0.5, "#FFF1C8", "star");
  } else if (ev.k === "kites") {
    /* tralcio fiorito sul bastone della tenda */
    o += `<path d="M14 30 Q40 37 66 31 Q94 25 120 32 Q140 37 158 30" stroke="#5FA35C" stroke-width="1.6" fill="none" stroke-linecap="round"/>`;
    [[22, 32], [40, 34.5], [58, 32], [76, 29.5], [100, 28.4], [118, 31.4], [136, 34], [150, 31.4]].forEach(([x, y], i) => {
      o += `<ellipse cx="${x + 4}" cy="${y + 2.4}" rx="3.4" ry="1.6" fill="#7FC27B" transform="rotate(${i % 2 ? 24 : -18} ${x + 4} ${y + 2.4})"/>`;
      const c = ["#F7A9C0", "#FFFFFF", "#FFD25E", "#F2789B"][i % 4]; o += [0, 72, 144, 216, 288].map((a) => { const r = (a * Math.PI) / 180; return `<circle cx="${f1(x + Math.cos(r) * 2.2)}" cy="${f1(y + Math.sin(r) * 2.2)}" r="1.9" fill="${c}"/>`; }).join("") + `<circle cx="${x}" cy="${y}" r="1.2" fill="#F2B33D"/>`;
    });
    /* aquilone appeso alla parete, con la coda che scende */
    o += `<g class="e1sw" data-o="255 34" data-i="1"><path d="M255 34 V36" stroke="#6B5A47" stroke-width="1.2"/><circle cx="255" cy="34" r="1.6" fill="#8E6440"/>${e111Kite(255, 50, 1.05, "#5DA9E0", "#F2B140", 6)}</g>`;
    /* petali che scendono piano nella stanza */
    for (let i = 0; i < 6; i++) o += `<g class="e1petal" data-i="${i}"><ellipse cx="${f1(100 + i * 44)}" cy="${f1(66 + (i % 3) * 22)}" rx="3.4" ry="2" fill="${i % 2 ? "#FFC2D4" : "#F7A9C0"}" transform="rotate(${i * 40} ${f1(100 + i * 44)} ${f1(66 + (i % 3) * 22)})"/></g>`;
  }
  return o;
}
/* ---------- Schermo intero: festone sulla parete alta (prima restava vuota) ---------- */
function e111Garland(ev, top, lit) {
  if (top < 150) return "";
  const y0 = -top + 104, A = [124, y0], C = [198, y0 + 40], B = [272, y0]; const q = (t) => { const u = 1 - t; return [u * u * A[0] + 2 * u * t * C[0] + t * t * B[0], u * u * A[1] + 2 * u * t * C[1] + t * t * B[1]]; };
  let o = `<path d="M${A[0]} ${A[1]} Q${C[0]} ${C[1]} ${B[0]} ${B[1]}" stroke="#6B5A47" stroke-width="1.1" fill="none" opacity=".85"/><circle cx="${A[0]}" cy="${A[1]}" r="1.8" fill="#8E6440"/><circle cx="${B[0]}" cy="${B[1]}" r="1.8" fill="#8E6440"/>`;
  const n = ev.k === "kites" ? 9 : 5;
  for (let i = 0; i < n; i++) {
    const t = (i + 0.5) / n; const [x, y] = q(t); const X = f1(x), Y = f1(y);
    if (ev.k === "kites") { const c = ["#F2789B", "#FFD25E", "#7FC27B", "#5DA9E0", "#F2B140"][i % 5]; o += `<path d="M${f1(x - 6)} ${f1(y - 0.6)} L${f1(x + 6)} ${f1(y + 0.6)} L${X} ${f1(y + 11)} Z" fill="${c}"/><path d="M${f1(x - 6)} ${f1(y - 0.6)} L${f1(x + 6)} ${f1(y + 0.6)} L${f1(x + 3)} ${f1(y + 4)} L${f1(x - 3)} ${f1(y + 3.4)} Z" fill="#fff" opacity=".22"/>`; }
    else if (ev.k === "lanterns") o += `<path d="M${X} ${Y} V${f1(y + 4)}" stroke="#6B5A47" stroke-width=".8"/>` + e111Lantern(+X, +f1(y + 13), 0.5, [["#F08A3C", "#B5531F", "#FFD9A0"], ["#E2654F", "#A63A2C", "#FFC9A8"], ["#F2B33D", "#B97A14", "#FFF0C4"]][i % 3], lit, "");
    else if (ev.k === "xmas") o += `<path d="M${X} ${Y} V${f1(y + 4)}" stroke="#6B5A47" stroke-width=".8"/>` + (i % 2 ? xmBauble(+X, +f1(y + 9), 4.4, i % 4 === 1 ? "#C8343C" : "#E2B04A") : e111Flake(+X, +f1(y + 12), 0.62));
    else o += `<path d="M${X} ${Y} V${f1(y + 3)}" stroke="#6B5A47" stroke-width=".8"/>` + e111PaperStar(+X, +f1(y + 11), 0.6, i % 2 ? ["#FFE7A0", "#D8A73A"] : ["#F2C14E", "#C9962E"], lit, "");
  }
  return `<g class="e1gar">${o}</g>`;
}
/* ---------- Luce in tutta la stanza (sopra a tutto, sotto la vignettatura) ---------- */
function e111Light(ev, ph, dark, top, H) {
  const lit = ph === "night" || ph === "evening" || dark; const FR = `x="0" y="${-top}" width="360" height="${H}"`; let o = "";
  if (ev.k === "lanterns") {
    const g = nid("e1l"); o += `<defs>${e111Glow(g, "#FFB25A", 1)}</defs><rect ${FR} fill="#FF9A40" opacity="${dark ? 0.1 : lit ? 0.09 : 0.05}"/>`;
    if (lit) [[166, 40, 46], [252, 50, 58], [336, 68, 44], [70, 120, 30]].forEach(([x, y, r]) => { o += `<circle cx="${x}" cy="${y}" r="${r}" fill="url(#${g})" opacity="${dark ? 0.5 : 0.32}"/>`; });
  } else if (ev.k === "stars" || (ev.k === "fresh" && lit)) {
    const g = nid("e1c"); o += `<defs>${e111Lin(g, [[0, "#6C7BD0", lit ? 0.16 : 0.1], [0.6, "#6C7BD0", 0]])}</defs><rect ${FR} fill="url(#${g})"/>`;
    if (lit) { const w = nid("e1w"); o += `<defs>${e111Glow(w, "#FFE7A0", 1)}</defs>` + [[166, 38, 30], [252, 48, 36], [336, 68, 28], [72, 116, 22]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="url(#${w})" opacity="${dark ? 0.45 : 0.25}"/>`).join(""); }
  } else if (ev.k === "fresh") {
    const g = nid("e1d"); o += `<defs>${e111Glow(g, "#FFD9B0", 1)}</defs><circle cx="86" cy="96" r="120" fill="url(#${g})" opacity=".35"/>`;
  } else if (ev.k === "kites" && !lit) o += `<rect ${FR} fill="#FFF3B8" opacity=".05"/>`;
  else if (ev.k === "xmas" && lit) o += `<rect ${FR} fill="#FFB765" opacity=".05"/>`;
  return o;
}

/* l'alberello della tappa 0 (stesso vaso dell'albero: alla tappa 1 diventa grande) */
function e111Sapling() {
  const cx = 276; let s = `<g class="xmtree"><g class="e1sap"><ellipse cx="${cx + 2}" cy="255" rx="22" ry="4.5" fill="#3A2510" opacity=".16"/>`;
  s += `<rect x="${cx - 2}" y="218" width="4" height="18" rx="1.5" fill="#6B4A2E"/>`;
  [[198, 214, 9], [190, 206, 13], [202, 222, 17]].sort((a, b) => a[2] - b[2]).reverse().forEach(([t, b, hw]) => { s += `<path d="M${cx} ${t} L${cx + hw} ${b} Q${cx} ${b + 3} ${cx - hw} ${b} Z" fill="#2E6A47" stroke="#2E6A47" stroke-width="2" stroke-linejoin="round"/><path d="M${cx} ${t + 1} L${cx + hw} ${b} Q${cx + hw / 2} ${b + 2.4} ${cx} ${b + 1.4} Z" fill="#1E4A32" opacity=".35"/>`; });
  s += `<path d="M259 236 L293 236 L289 254 Q276 257 263 254 Z" fill="#A63D3A"/><rect x="256" y="232" width="40" height="6" rx="3" fill="#8C3330"/><rect x="260" y="244" width="32" height="2.4" rx="1.2" fill="#E2B24E" opacity=".9"/>`;
  s += `<path d="M276 245 C268 239 266 249 276 245 C286 249 284 239 276 245 Z" fill="#E2B24E"/><circle cx="276" cy="245" r="1.8" fill="#C9962E"/>`;
  s += `<circle cx="${cx}" cy="187" r="1.8" fill="#F2C14E"/>`;
  return s + `</g></g>`;
}

/* ---------- Composizione ---------- */
function e111Room(o, opts) {
  const ri = o.indexOf(E111_ROD); if (ri < 0) return o; /* non e' la stanza (giardino, terrazza, festa...) */
  const evx = e111Now(); if (!evx) return o;
  const ph = opts.ph || "day"; const night = ph === "night", eve = ph === "evening"; const dark = !!opts.dark; const lit = night || eve || dark;
  const top = opts.top || 0, H = 300 + top + (opts.bot || 0);
  /* Nuovo inizio: alba alla finestra di mattina e di giorno; di sera e di notte resta il cielo della stagione */
  const win = evx.fresh && !night && !eve ? { k: "fresh", fresh: true } : evx;
  const room = Object.assign({}, evx.k === "xmas" ? evx : { k: evx.k === "lanterns" || evx.k === "kites" ? evx.k : "stars", fresh: evx.fresh });
  /* le vecchie decorazioni piccole della finestra (97c) lasciano il posto alle nuove */
  o = o.replace(/<g class="slant"><g [^>]*>[\s\S]*?<\/g><\/g>/g, "");
  const sky = e111Sky(win, ph); const hi = o.indexOf(E111_HILL);
  if (sky && hi > 0) o = o.slice(0, hi) + `<g class="e1sky" pointer-events="none">${sky}</g>` + o.slice(hi);
  const wf = e111Win(win, ph, lit); const wi = o.indexOf('<g class="wpg">');
  if (wf && wi > 0) o = o.slice(0, wi) + `<g class="e1win" pointer-events="none">${wf}</g>` + o.slice(wi);
  /* davanzale e soffitto: subito dopo il bastone della tenda (dietro a lucine, quadri e mobili) */
  const r2 = o.indexOf(E111_ROD); const deco = (opts.friend ? "" : e111Sill(room, lit, win.k === "fresh")) + e111Garland(room, top, lit) + e111Deco(room, top, lit, dark, opts);
  if (deco && r2 > 0) o = o.slice(0, r2 + E111_ROD.length) + `<g class="e1deco" pointer-events="none">${deco}</g>` + o.slice(r2 + E111_ROD.length);
  /* Natale, tappa 0: l'alberello nel vaso (sta dove crescera' l'albero) */
  if (evx.k === "xmas" && S.pet && o.indexOf('class="xmtree') < 0) {
    let st = 0; try { st = xmStage(); } catch (e) { st = 0; }
    if (st < 1) {
      const anc = o.indexOf('<g class="mvanchor">'); let at = -1;
      const m = /<g class="mv" data-mv="[^"]*" data-slot="(?:floorR|plant)"/.exec(o); if (m && (anc < 0 || m.index < anc)) at = m.index;
      if (at < 0) { const p = o.indexOf('<ellipse cx="322" cy="250"'); at = p >= 0 ? p : o.indexOf('<g id="petWrap"'); }
      if (at > 0) o = o.slice(0, at) + e111Sapling() + o.slice(at);
    }
  }
  const lg = e111Light(win.k === "fresh" ? win : room, ph, dark, top, H);
  if (lg) { const vi = o.lastIndexOf('fill="url(#vg'); const ri2 = vi > 0 ? o.lastIndexOf("<rect", vi) : -1; const at = ri2 > 0 ? ri2 : o.lastIndexOf("</svg>"); if (at > 0) o = o.slice(0, at) + `<g class="e1light" pointer-events="none">${lg}</g>` + o.slice(at); }
  return o;
}
const _roomSVG111 = roomSVG;
roomSVG = function (opts) {
  const o = _roomSVG111(opts);
  if (!opts || typeof o !== "string" || window.__E111_OFF) return o;
  try { return e111Room(o, opts); } catch (e) { return o; }
};

/* ---------- Movimento (sul motore lento dell'ambiente, 97s) ---------- */
/* ciclo continuo da a -> b che parte gia' a meta' strada (cosi' gli elementi non si muovono tutti insieme) */
function e111Loop(el, from, to, dur, f, extra) {
  const tl = G.timeline(); const mid = {}; Object.keys(from).forEach((k) => { mid[k] = from[k] + (to[k] - from[k]) * f; });
  tl.fromTo(el, mid, Object.assign({ duration: dur * (1 - f), ease: "none" }, to));
  tl.add(G.fromTo(el, Object.assign({}, from), Object.assign({ duration: dur, ease: "none", repeat: -1, immediateRender: false }, to, extra || {})));
  return tl;
}
const _ambientE111 = ambientExtra;
ambientExtra = function (root, q) {
  _ambientE111(root, q);
  if (!anim || !root || !root.querySelector(".e1deco, .e1win, .e1sky")) return;
  if (e111Lite()) {
    /* modalita' leggera: anche le stelline degli eventi (animate dall'ambiente di base) restano ferme */
    try { const dead = new Set(); root.querySelectorAll(".e1sky .star, .e1win .star, .e1deco .star").forEach((el) => G.getTweensOf(el).forEach((t) => { t.kill(); dead.add(t); }));
      for (let i = ambient.length - 1; i >= 0; i--) if (dead.has(ambient[i])) ambient.splice(i, 1); } catch (e) { /* niente */ }
    return;
  }
  try {
    q(".e1sw").forEach((g) => { const i = +g.dataset.i || 0; const a = 2.2 + (i % 2) * 0.8; ambient.push(G.fromTo(g, { rotation: -a }, { rotation: a, svgOrigin: g.dataset.o, duration: 2.6 + i * 0.45, repeat: -1, yoyo: true, ease: "sine.inOut" })); });
    q(".e1rise").forEach((g) => { const i = +g.dataset.i || 0, y = +g.dataset.y || 90; ambient.push(e111Loop(g, { y: 138 - y }, { y: 34 - y }, 15 + (i % 3) * 3.5, ((i * 0.37) % 1))); ambient.push(G.to(g, { x: i % 2 ? 4 : -4, duration: 3 + (i % 3), repeat: -1, yoyo: true, ease: "sine.inOut" })); });
    q(".e1snow").forEach((g) => { const i = +g.dataset.i || 0, y = +g.dataset.y || 80; ambient.push(e111Loop(g, { y: 38 - y }, { y: 132 - y }, 7 + (i % 4) * 1.4, ((i * 0.29) % 1))); ambient.push(G.to(g, { x: i % 2 ? 5 : -5, duration: 1.8 + (i % 3) * 0.6, repeat: -1, yoyo: true, ease: "sine.inOut" })); });
    q(".e1kite").forEach((g) => { ambient.push(G.to(g, { y: -4, x: 3, duration: 2.6, repeat: -1, yoyo: true, ease: "sine.inOut" })); ambient.push(G.fromTo(g, { rotation: -3 }, { rotation: 4, svgOrigin: g.dataset.o, duration: 1.9, repeat: -1, yoyo: true, ease: "sine.inOut" })); });
    q(".e1pass").forEach((g) => { const x = +g.dataset.x || 110; ambient.push(e111Loop(g, { x: 18 - x }, { x: 160 - x }, 26, 0.62)); ambient.push(G.to(g, { y: -5, duration: 2.2, repeat: -1, yoyo: true, ease: "sine.inOut" })); });
    q(".e1shoot").forEach((g) => { const tl = G.timeline({ repeat: -1, repeatDelay: 7 }); tl.fromTo(g, { x: 0, y: 0, opacity: 0 }, { x: -22, y: 8, opacity: 1, duration: 0.45, ease: "none" }).to(g, { x: -44, y: 16, opacity: 0, duration: 0.45, ease: "none" }); ambient.push(tl); });
    q(".e1petal").forEach((g) => { const i = +g.dataset.i || 0, D = 13 + i * 1.7; const tl = G.timeline({ repeat: -1, delay: i * 3.1 });
      tl.fromTo(g, { y: -20, x: 0, rotation: 0 }, { y: 150, x: i % 2 ? 26 : -26, rotation: i % 2 ? 220 : -220, transformOrigin: "50% 50%", duration: D, ease: "none" }, 0)
        .fromTo(g, { opacity: 0 }, { opacity: 0.9, duration: D * 0.2, ease: "none" }, 0).to(g, { opacity: 0, duration: D * 0.25, ease: "none" }, D * 0.75); ambient.push(tl); });
  } catch (e) { /* la stanza resta ferma */ }
};
