/* ===== 1.0.11: posti veri dell'America Latina per lo spagnolo =====
   Chi usa l'app in spagnolo vive soprattutto in Messico, Colombia, Argentina (dove va la pubblicita'): ai 4 posti della
   Spagna se ne aggiungono 4 dell'America Latina, nello stesso formato (titolo, testo vero, cartolina 3D in plastilina e
   disegno vettoriale di riserva). Sblocco e premi identici: il posto n. 4+k usa livello e ore del posto n. k
   (REAL_LVL / REAL_H in 45_state.js), e nella lista si alternano Spagna e America Latina per livello.
   Fatti verificati il 17/11/2026: equinozi di Chichen Itza (INAH, Meteored); palma de cera albero nazionale (Ley 61 de 1985),
   oltre 40 m; isole dei uros fatte di totora, lago a circa 3810 m (Puno, Peru'); Cerro de los Siete Colores (Jujuy),
   Quebrada de Humahuaca patrimonio UNESCO 2003. Le chiavi esistenti r:es:0..3 non cambiano (album e diario restano validi). */
REAL.es.push(
  { art: "chichenitza", name: "Chichén Itzá", t: "La serpiente de luz", s: "{n} visitó la gran pirámide de Chichén Itzá, en México. En los equinoccios, la luz y la sombra dibujan en su escalinata una serpiente que parece bajar hasta el suelo." },
  { art: "cocora", name: "Valle de Cocora", t: "Palmeras hasta las nubes", s: "En el Valle de Cocora, en Colombia, {n} caminó entre palmas de cera, el árbol nacional del país. Algunas miden más de 40 metros: ¡había que mirar muy, muy arriba!" },
  { art: "titicaca", name: "Lago Titicaca", t: "Islas de totora", s: "En el lago Titicaca, en Perú, {n} pisó una isla flotante de los uros. Está hecha de totora, una planta del lago, y el suelo se hunde un poquito a cada paso." },
  { art: "purmamarca", name: "Purmamarca", t: "El cerro de los siete colores", s: "En Purmamarca, en el norte de Argentina, {n} contó los colores del cerro: rojo, rosa, morado, ocre, verde… Cada franja es una roca distinta, formada hace millones de años." }
);
Object.assign(IMG3D_PC, { "r:chichenitza": ["r_chichenitza", 960, 640], "r:cocora": ["r_cocora", 960, 640], "r:titicaca": ["r_titicaca", 960, 640], "r:purmamarca": ["r_purmamarca", 960, 640] });
Object.assign(REAL_SKY2, { chichenitza: ["#BFE0F7", "#FBEBD2"], cocora: ["#CFE4F2", "#EEF3EA"], titicaca: ["#7FB6EC", "#E2EFF8"], purmamarca: ["#9FCBF0", "#EAF3FA"] });
Object.assign(REAL_ART2, {
  chichenitza: (h) => {
    let o = h.sun(128, 20, 7) + `<rect x="0" y="80" width="160" height="20" fill="#8DB25E"/><path d="M0 80 Q20 70 40 78 T80 76 T120 78 T160 74 V82 H0 Z" fill="#4E8A44"/>`;
    for (let k = 0; k < 9; k++) { const w = 104 - k * 9, y = 80 - (k + 1) * 4.6; o += `<rect x="${80 - w / 2}" y="${y}" width="${w}" height="4.8" fill="${k % 2 ? "#CBBC9C" : "#DCCFB4"}"/>`; }
    o += `<path d="M72 80 L76 38.6 H84 L88 80 Z" fill="#B8AA8E"/>`;
    for (let k = 0; k < 10; k++) o += `<rect x="${72.6 + k * 0.4}" y="${76 - k * 4}" width="${14.8 - k * 0.8}" height="1.2" fill="#9C8E78" opacity=".7"/>`;
    for (let k = 0; k < 6; k++) { const x = 72 - k * 0.66, y = 74 - k * 6.4; o += `<path d="M${x - 1.6} ${y + 2} L${x + 1.6} ${y + 2} L${x} ${y - 2.4} Z" fill="#FFE2A8"/>`; }
    o += `<rect x="70" y="25" width="20" height="14" fill="#DCCFB4"/><rect x="69" y="24" width="22" height="3" fill="#CBBC9C"/>`;
    [74, 80, 86].forEach((x) => { o += `<rect x="${x - 1.6}" y="${30}" width="3.2" height="9" fill="#3E3530"/>`; });
    o += `<ellipse cx="71" cy="81" rx="2.6" ry="1.8" fill="#CBBC9C"/><ellipse cx="89" cy="81" rx="2.6" ry="1.8" fill="#CBBC9C"/>`;
    return o;
  },
  cocora: (h) => {
    let o = h.sun(30, 22, 6, "#FFF2C8") + `<path d="M0 60 Q30 40 60 54 T120 46 T160 52 V100 H0 Z" fill="#4E8A4E"/><path d="M0 72 Q40 58 80 70 T160 64 V100 H0 Z" fill="#6FA752"/>`;
    o += `<path d="M0 84 Q50 74 100 82 T160 80 V100 H0 Z" fill="#7DB25A"/><rect x="0" y="56" width="160" height="5" fill="#F4F7F2" opacity=".55"/>`;
    [[24, 88, 62], [46, 84, 70], [70, 86, 58], [96, 82, 68], [122, 86, 60], [140, 80, 50], [12, 78, 44]].forEach(([x, y, hh]) => {
      o += `<path d="M${x} ${y} L${x + 0.6} ${y - hh}" stroke="#D8D2C2" stroke-width="1.6"/>`;
      o += `<path d="M${x + 0.6} ${y - hh} q-7 -1 -9 5 M${x + 0.6} ${y - hh} q7 -2 9 4 M${x + 0.6} ${y - hh} q-3 -6 -8 -6 M${x + 0.6} ${y - hh} q4 -6 8 -5" stroke="#4E8C4A" stroke-width="2.2" fill="none" stroke-linecap="round"/>`;
    });
    for (let k = 0; k < 6; k++) o += `<rect x="${8 + k * 9}" y="${88 + k * 0.3}" width="1.4" height="7" fill="#8A6646"/>`;
    o += `<path d="M8 90 L58 91.6 M8 93.4 L58 95" stroke="#8A6646" stroke-width="1"/>`;
    return o;
  },
  titicaca: (h) => {
    let o = h.sun(132, 18, 6, "#FFF8E0") + `<path d="M0 58 L18 40 L30 50 L48 30 L64 48 L84 26 L104 46 L122 34 L142 50 L160 42 V62 H0 Z" fill="#8C8AA6"/>`;
    o += `<path d="M44 34 L48 30 L52 35 Z M80 31 L84 26 L88 31 Z M119 37 L122 34 L125 38 Z" fill="#FAFCFF"/><rect x="0" y="60" width="160" height="40" fill="${h.water}"/>` + h.waves(68, 5) + h.waves(90, 4);
    o += `<ellipse cx="62" cy="80" rx="46" ry="8" fill="#C9AC62"/><ellipse cx="62" cy="78.5" rx="44" ry="6.6" fill="#E2C77E"/>`;
    [[34, 76, "#D8423A"], [58, 74, "#2F86C8"], [82, 76, "#F2B140"]].forEach(([x, y, c]) => {
      o += `<rect x="${x - 7}" y="${y - 8}" width="14" height="8" fill="#D9BC72"/><path d="M${x - 8} ${y - 8} L${x} ${y - 15} L${x + 8} ${y - 8} Z" fill="#CDAE62"/><rect x="${x + 1}" y="${y - 6}" width="3.4" height="6" fill="#5A4632"/><rect x="${x - 5}" y="${y - 6}" width="3.4" height="3.4" fill="${c}"/>`;
    });
    o += `<path d="M98 78 V58 M106 78 V58" stroke="#D6B868" stroke-width="2.4"/><rect x="96" y="56" width="12" height="3" fill="#D6B868"/><path d="M96 56 Q102 46 108 56" stroke="#D6B868" stroke-width="2.2" fill="none"/>`;
    o += `<path d="M112 90 Q126 96 144 90 Q146 84 150 82 Q148 88 144 92 L114 92 Z" fill="#D6B868"/><circle cx="150" cy="81" r="3" fill="#D6B868"/><circle cx="151" cy="80.4" r=".7" fill="#2E2622"/>`;
    for (let k = 0; k < 14; k++) o += `<path d="M${6 + k * 1.6} 72 v-${5 + (k % 4) * 2}" stroke="${k % 2 ? "#7FA04E" : "#9AB45A"}" stroke-width="1"/>`;
    return o;
  },
  purmamarca: (h) => {
    const cols = ["#C24E3A", "#E39A86", "#8C5C86", "#D9A64C", "#8FA27C", "#E8D6B4", "#9A5A3C"];
    const id = nid("pm");
    let o = `<path d="M0 64 L22 40 L40 52 L60 36 L78 50 L100 30 L120 46 L140 38 L160 52 V70 H0 Z" fill="#B0563E"/>`;
    o += `<defs><clipPath id="${id}"><path d="M26 76 L52 34 Q80 22 104 36 L134 76 Z"/></clipPath></defs><g clip-path="url(#${id})">`;
    cols.concat(cols).forEach((c, k) => { o += `<path d="M10 ${86 - k * 5.5} L150 ${60 - k * 5.5} L150 ${66 - k * 5.5} L10 ${92 - k * 5.5} Z" fill="${c}"/>`; });
    o += `</g><rect x="0" y="76" width="160" height="24" fill="#C9A27A"/>`;
    [[20, 74, 16, 9], [40, 76, 14, 8], [104, 75, 16, 9], [124, 77, 14, 8], [140, 74, 14, 9]].forEach(([x, y, w, hh]) => { o += `<rect x="${x}" y="${y - hh}" width="${w}" height="${hh}" fill="#C89A6C"/><rect x="${x - 1}" y="${y - hh - 1.4}" width="${w + 2}" height="1.6" fill="#9C7350"/><rect x="${x + w * 0.6}" y="${y - 5}" width="2.6" height="5" fill="#3E6E9A"/>`; });
    o += `<rect x="64" y="62" width="16" height="14" fill="#F2EBDD"/><path d="M62 62 L72 55 L82 62 Z" fill="#8E6A4C"/><rect x="56" y="54" width="8" height="22" fill="#F2EBDD"/><path d="M55 54 L60 48 L65 54 Z" fill="#F2EBDD"/><path d="M58.5 59 a1.5 1.5 0 0 1 3 0 V62 h-3 Z" fill="#3A2E28"/><path d="M60 48 V44 M58.6 45.4 H61.4" stroke="#6A4A32" stroke-width=".8"/>`;
    [[12, 96, 22], [148, 94, 20], [92, 92, 14]].forEach(([x, y, hh]) => { o += `<rect x="${x - 1.8}" y="${y - hh}" width="3.6" height="${hh}" rx="1.8" fill="#5E8A52"/><path d="M${x - 1.8} ${y - hh * 0.5} h-4 v-${hh * 0.3}" stroke="#5E8A52" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M${x + 1.8} ${y - hh * 0.6} h4 v-${hh * 0.25}" stroke="#5E8A52" stroke-width="3" fill="none" stroke-linecap="round"/>`; });
    return o;
  }
});
