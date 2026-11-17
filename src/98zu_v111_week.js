/* =================== 1.0.11: "La settimana con Germo" + cartoline nello stesso formato + statistiche di percorso ===================
   1) CARTOLINA SETTIMANALE (modello Wordle / Spotify Wrapped / Locket Rollcall: formato fisso e riconoscibile, nessun dato privato)
      - Immagine 9:16 (1080x1920, storie) e 1:1 (1080x1080, post), stessa famiglia della cartolina del viaggio: sopra chi la manda
        e un titolo affettuoso che cambia; al centro la stanza com'e' adesso dentro una cartolina con il francobollo della
        stagione e sotto il nome dell'evento (Natale, Nuovo inizio, Stagione delle Lanterne / delle Stelle / degli Aquiloni);
        poi i 7 giorni come piccoli simboli (germoglio = fatto, germoglio con spunta = tutto fatto, luna = riposo, cerchio = niente,
        puntini = deve ancora arrivare), quanti giorni su 7, il marchio "Tanetto" e #tanettoapp.
      - Niente obiettivi, niente umore, niente diario, niente numeri di Tanì o livelli: solo i giorni e la stagione.
      - La settimana e' quella del calendario del telefono (lunedi'-domenica in Italia, domenica-sabato dove si usa cosi'):
        l'ultimo giorno della settimana dalle 18 e tutto il primo giorno della settimana dopo, in Oggi compare una scheda
        discreta "La settimana con Germo e' pronta" (si chiude con la X, una volta a settimana). Dal Diario ("Crea la
        cartolina") si apre quando si vuole: il primo giorno della settimana mostra la settimana appena finita.
   2) REGOLE PER ETA' (come la storia della 1.0.10): sotto i 13 anni e con l'eta' non detta la cartolina si guarda nell'app ma
      non c'e' "Condividi" ne' "Salva"; il nome scelto per il compagno compare nell'immagine e nel testo solo dai 18 anni
      (prima il nome normale: Germo, Ondi...). Le stesse regole valgono ora anche per la cartolina del viaggio e del livello.
   3) TESTO CONDIVISO: frase breve + link con l'origine (app: Google Play con referrer utm_source=share&utm_medium=postcard&
      utm_campaign=week|trip|level; sito: ?src=postcard&utm_... cosi' resta la scheda verso Google Play) + #tanettoapp.
   4) STATISTICHE DI PERCORSO (anonime, con lo stesso interruttore e le stesse regole per eta' di v26TrackGate: spente per i
      minori, niente prima della domanda sull'eta'): "percorso-..." una volta sola per installazione, solo per chi installa
      con la 1.0.11 (chi aveva gia' l'app non altera i conteggi). Nessun identificativo, nessun testo scritto dall'utente. */

const W111_T = {
  it: { kick: (p) => `La settimana con ${p}`, full: ["Una settimana piena di luce", "Sette giorni, sempre insieme", "Che bella settimana, davvero"],
    good: ["Un passo alla volta, insieme", "Una settimana di cose buone", "Piano piano, ma insieme"], some: ["Anche un giorno conta", "Un piccolo passo è già tanto", "Ci siamo presi un momento"],
    calm: ["Una settimana tranquilla", "Ci si riposa, poi si riparte", "Ci rivediamo con calma"], days: (n) => (n === 1 ? "1 giorno su 7 insieme" : `${n} giorni su 7 insieme`),
    sq: "Quadrata", ready: (p) => `La settimana con ${p} è pronta`, readyP: "Una cartolina dei vostri ultimi sette giorni.", open: "Guarda",
    txt: (p) => `La mia settimana con ${p} su Tanetto`, kid: (p) => `Una cartolina tutta per te, con i tuoi giorni insieme a ${p}.`, xmas: "Natale" },
  en: { kick: (p) => `A week with ${p}`, full: ["A week full of light", "Seven days, side by side", "What a lovely week"],
    good: ["One step at a time, together", "A week of good things", "Slowly, but together"], some: ["Every day counts", "A small step is still a step", "We took a moment for us"],
    calm: ["A quiet week", "Rest now, then off we go", "See you soon, no rush"], days: (n) => (n === 1 ? "1 day out of 7 together" : `${n} days out of 7 together`),
    sq: "Square", ready: (p) => `Your week with ${p} is ready`, readyP: "A postcard of your last seven days.", open: "Take a look",
    txt: (p) => `My week with ${p} on Tanetto`, kid: (p) => `A postcard just for you, with your days together with ${p}.`, xmas: "Christmas" },
  de: { kick: (p) => `Eine Woche mit ${p}`, full: ["Eine Woche voller Licht", "Sieben Tage, immer zusammen", "Was für eine schöne Woche"],
    good: ["Schritt für Schritt, zusammen", "Eine Woche voller guter Dinge", "Langsam, aber gemeinsam"], some: ["Jeder Tag zählt", "Ein kleiner Schritt ist auch ein Schritt", "Wir haben uns Zeit genommen"],
    calm: ["Eine ruhige Woche", "Erst ausruhen, dann weiter", "Bis bald, ganz in Ruhe"], days: (n) => (n === 1 ? "1 von 7 Tagen zusammen" : `${n} von 7 Tagen zusammen`),
    sq: "Quadratisch", ready: (p) => `Deine Woche mit ${p} ist fertig`, readyP: "Eine Postkarte von euren letzten sieben Tagen.", open: "Ansehen",
    txt: (p) => `Meine Woche mit ${p} in Tanetto`, kid: (p) => `Eine Postkarte nur für dich, mit deinen Tagen mit ${p}.`, xmas: "Weihnachten" },
  es: { kick: (p) => `Una semana con ${p}`, full: ["Una semana llena de luz", "Siete días, siempre juntos", "Qué semana tan bonita"],
    good: ["Paso a paso, juntos", "Una semana de cosas buenas", "Despacito, pero juntos"], some: ["Cada día cuenta", "Un pasito también es un paso", "Nos tomamos un momento"],
    calm: ["Una semana tranquila", "Ahora a descansar, luego seguimos", "Hasta pronto, sin prisas"], days: (n) => (n === 1 ? "1 día de 7 juntos" : `${n} días de 7 juntos`),
    sq: "Cuadrada", ready: (p) => `Tu semana con ${p} ya está lista`, readyP: "Una postal de tus últimos siete días.", open: "Ver",
    txt: (p) => `Mi semana con ${p} en Tanetto`, kid: (p) => `Una postal solo para ti, con tus días junto a ${p}.`, xmas: "Navidad" },
  fr: { kick: (p) => `Une semaine avec ${p}`, full: ["Une semaine pleine de lumière", "Sept jours, toujours ensemble", "Quelle jolie semaine"],
    good: ["Un pas après l'autre, ensemble", "Une semaine de belles choses", "Doucement, mais ensemble"], some: ["Chaque jour compte", "Un petit pas, c'est déjà un pas", "On s'est accordé un moment"],
    calm: ["Une semaine tranquille", "On se repose, puis on repart", "À bientôt, sans se presser"], days: (n) => (n === 1 ? "1 jour sur 7 ensemble" : `${n} jours sur 7 ensemble`),
    sq: "Carrée", ready: (p) => `Ta semaine avec ${p} est prête`, readyP: "Une carte postale de tes sept derniers jours.", open: "Voir",
    txt: (p) => `Ma semaine avec ${p} dans Tanetto`, kid: (p) => `Une carte rien que pour toi, avec tes jours aux côtés de ${p}.`, xmas: "Noël" },
  pt: { kick: (p) => `Uma semana com ${p}`, full: ["Uma semana cheia de luz", "Sete dias, sempre juntos", "Que semana bonita"],
    good: ["Um passo de cada vez, juntos", "Uma semana de coisas boas", "Devagar, mas juntos"], some: ["Cada dia conta", "Um passinho também é um passo", "A gente tirou um momento pra nós"],
    calm: ["Uma semana tranquila", "Agora descansar, depois seguir", "Até logo, sem pressa"], days: (n) => (n === 1 ? "1 dia de 7 juntos" : `${n} dias de 7 juntos`),
    sq: "Quadrada", ready: (p) => `Sua semana com ${p} está pronta`, readyP: "Um cartão-postal dos seus últimos sete dias.", open: "Ver",
    txt: (p) => `Minha semana com ${p} no Tanetto`, kid: (p) => `Um cartão-postal só seu, com os seus dias junto com ${p}.`, xmas: "Natal" },
  ja: { kick: (p) => `${p}との1週間`, full: ["光いっぱいの1週間", "7日間、ずっといっしょ", "すてきな1週間だったね"],
    good: ["一歩ずつ、いっしょに", "いいことがたくさんの1週間", "ゆっくり、でもいっしょに"], some: ["どの日も大切な1日", "小さな一歩も、一歩だよ", "ふたりでひと息ついたね"],
    calm: ["のんびりした1週間", "休んだら、また歩きだそう", "またね、あせらずに"], days: (n) => `7日のうち${n}日いっしょ`,
    sq: "スクエア", ready: (p) => `${p}との1週間ができあがりました`, readyP: "この7日間のポストカードです。", open: "見てみる",
    txt: (p) => `Tanettoで${p}と過ごした1週間`, kid: (p) => `${p}との毎日をまとめた、あなただけのポストカード。`, xmas: "クリスマス" },
  ko: { kick: (p) => `${p} · 함께한 일주일`, full: ["빛으로 가득한 일주일", "7일 내내 함께했어요", "정말 멋진 일주일이었어요"],
    good: ["한 걸음씩, 함께", "좋은 일이 가득한 일주일", "천천히, 그래도 함께"], some: ["하루하루가 소중해요", "작은 걸음도 걸음이에요", "잠깐 쉬어 가는 시간"],
    calm: ["조용한 일주일", "푹 쉬고 다시 출발해요", "천천히, 또 만나요"], days: (n) => `7일 중 ${n}일 함께`,
    sq: "정사각형", ready: () => "일주일 엽서가 준비됐어요", readyP: "지난 7일을 담은 엽서예요.", open: "보기",
    txt: (p) => `Tanetto에서 보낸 나의 일주일 · ${p}`, kid: (p) => `${p}, 함께한 날들을 담은 나만의 엽서예요.`, xmas: "크리스마스" },
  zh: { kick: (p) => `和${p}一起的一周`, full: ["满满阳光的一周", "七天，一直在一起", "真是美好的一周"],
    good: ["一步一步，一起走", "好事满满的一周", "慢慢来，我们一起"], some: ["每一天都算数", "小小一步也是一步", "我们给自己留了点时间"],
    calm: ["安静的一周", "先休息，再出发", "不着急，下次见"], days: (n) => `7天中有${n}天在一起`,
    sq: "方形", ready: (p) => `和${p}一起的一周已经准备好了`, readyP: "一张记录你过去七天的明信片。", open: "看看",
    txt: (p) => `我在 Tanetto 和${p}一起的一周`, kid: (p) => `一张只属于你的明信片，记录你和${p}的每一天。`, xmas: "圣诞节" },
  zht: { kick: (p) => `和${p}一起的一週`, full: ["滿滿陽光的一週", "七天，一直在一起", "真是美好的一週"],
    good: ["一步一步，一起走", "好事滿滿的一週", "慢慢來，我們一起"], some: ["每一天都算數", "小小一步也是一步", "我們給自己留了點時間"],
    calm: ["安靜的一週", "先休息，再出發", "不急，下次見"], days: (n) => `7天中有${n}天在一起`,
    sq: "方形", ready: (p) => `和${p}一起的一週準備好了`, readyP: "一張記錄你過去七天的明信片。", open: "看看",
    txt: (p) => `我在 Tanetto 和${p}一起的一週`, kid: (p) => `一張只屬於你的明信片，記錄你和${p}的每一天。`, xmas: "聖誕節" },
  ru: { kick: (p) => `${p}: наша неделя`, full: ["Неделя, полная света", "Семь дней — всегда вместе", "Какая чудесная неделя"],
    good: ["Шаг за шагом, вместе", "Неделя хороших дел", "Потихоньку, но вместе"], some: ["Каждый день важен", "Маленький шаг — тоже шаг", "Мы нашли минутку для себя"],
    calm: ["Спокойная неделя", "Отдохнём — и снова в путь", "До встречи, без спешки"],
    days: (n) => `${n} ${n % 10 === 1 && n % 100 !== 11 ? "день" : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 12 || n % 100 > 14) ? "дня" : "дней"} из 7 вместе`,
    sq: "Квадрат", ready: (p) => `${p}: ваша неделя готова`, readyP: "Открытка о последних семи днях.", open: "Посмотреть",
    txt: (p) => `${p} и я: наша неделя в Tanetto`, kid: (p) => `Открытка только для тебя: твои дни, где рядом ${p}.`, xmas: "Новый год" },
  pl: { kick: (p) => `${p}: nasz tydzień`, full: ["Tydzień pełen światła", "Siedem dni zawsze razem", "Jaki piękny tydzień"],
    good: ["Krok po kroku, razem", "Tydzień pełen dobrych chwil", "Powoli, ale razem"], some: ["Każdy dzień się liczy", "Mały krok to też krok", "Chwila tylko dla nas"],
    calm: ["Spokojny tydzień", "Odpoczniemy i ruszamy dalej", "Do zobaczenia, bez pośpiechu"], days: (n) => (n === 1 ? "1 dzień z 7 razem" : `${n} dni z 7 razem`),
    sq: "Kwadrat", ready: (p) => `${p}: wasz tydzień jest gotowy`, readyP: "Pocztówka z ostatnich siedmiu dni.", open: "Zobacz",
    txt: (p) => `${p} i ja: nasz tydzień w Tanetto`, kid: (p) => `Pocztówka tylko dla ciebie, z twoimi dniami. ${p} też tam jest!`, xmas: "Boże Narodzenie" },
  nl: { kick: (p) => `Een week met ${p}`, full: ["Een week vol licht", "Zeven dagen, altijd samen", "Wat een fijne week"],
    good: ["Stapje voor stapje, samen", "Een week vol goede dingen", "Rustig aan, maar samen"], some: ["Elke dag telt", "Een klein stapje is ook een stap", "We namen even tijd voor onszelf"],
    calm: ["Een rustige week", "Eerst uitrusten, dan weer verder", "Tot gauw, zonder haast"], days: (n) => (n === 1 ? "1 van de 7 dagen samen" : `${n} van de 7 dagen samen`),
    sq: "Vierkant", ready: (p) => `Je week met ${p} is klaar`, readyP: "Een kaartje van je afgelopen zeven dagen.", open: "Bekijken",
    txt: (p) => `Mijn week met ${p} in Tanetto`, kid: (p) => `Een kaartje alleen voor jou, met je dagen samen met ${p}.`, xmas: "Kerst" },
  tr: { kick: (p) => `${p} ile bir hafta`, full: ["Işık dolu bir hafta", "Yedi gün, hep birlikte", "Ne güzel bir hafta"],
    good: ["Adım adım, birlikte", "Güzel şeylerle dolu bir hafta", "Yavaş yavaş ama birlikte"], some: ["Her gün önemli", "Küçük bir adım da bir adımdır", "Kendimize bir an ayırdık"],
    calm: ["Sakin bir hafta", "Önce dinlen, sonra devam", "Acele yok, yakında görüşürüz"], days: (n) => `7 günün ${n} günü birlikte`,
    sq: "Kare", ready: (p) => `${p} ile haftan hazır`, readyP: "Son yedi gününün kartpostalı.", open: "Bak",
    txt: (p) => `Tanetto'da ${p} ile haftam`, kid: (p) => `Sadece senin için bir kartpostal: ${p} ile geçen günlerin.`, xmas: "Yılbaşı" }
};
const w111t = () => W111_T[S.lang] || W111_T.en;

/* ---------- regole comuni (eta', nome, link, caratteri) ---------- */
/* condividere fuori dall'app: dai 13 anni (come la storia 1.0.10); sotto i 13 e con l'eta' non detta no */
function w111ShareOk() { try { const b = typeof ageBand === "function" ? ageBand() : "unknown"; return b === "adult" || b === "teen"; } catch (e) { return false; } }
/* nome nell'immagine e nel testo: quello scelto solo dai 18 anni, prima il nome normale del compagno */
function w111Name() {
  const def = ((L().pets || {})[S.pet] || [])[0] || "Germo";
  let young = true; try { young = typeof v26Young === "function" ? v26Young() : true; } catch (e) { young = true; }
  return String((!young && S.petName) || def);
}
const W111_UTM = (c) => `utm_source=share&utm_medium=postcard&utm_campaign=${c}`;
function w111Link(campaign) {
  let native = false; try { native = typeof isNativeApp === "function" && isNativeApp(); } catch (e) { /* niente */ }
  return native ? PLAY_URL + "&referrer=" + encodeURIComponent(W111_UTM(campaign)) : SITE_URL + "?src=postcard&" + W111_UTM(campaign);
}
const w111ShareText = (msg, campaign) => `${msg} ${w111Link(campaign)} #tanettoapp`;
/* caratteri per il disegno: si caricano anche i pezzi che servono al testo (polacco/turco: il file di riserva di Fredoka) */
const W111_FILL = "ąćęńśźżĄĆĘŃŚŹŻğĞşŞİ";
function w111Fonts(texts) {
  const s = (texts || []).join(" ") + " Tanetto #tanettoapp " + W111_FILL;
  const want = ['600 80px "Fredoka"', '500 40px "Figtree"', '600 40px "Figtree"', 'italic 500 40px "Figtree"', '700 40px "Fredoka"'];
  return Promise.race([Promise.all(want.map((f) => document.fonts.load(f, s).catch(() => null))), new Promise((r) => setTimeout(r, 1800))]);
}
/* nelle lingue con il file di riserva il carattere si prepara subito (anche per l'interfaccia) */
if (S.lang === "pl" || S.lang === "tr") setTimeout(() => { try { w111Fonts([]); } catch (e) { /* niente */ } }, 1200);

/* ---------- la settimana del calendario ---------- */
function w111WeekOrder() { try { return typeof v26WeekOrder === "function" ? v26WeekOrder() : [0, 1, 2, 3, 4, 5, 6]; } catch (e) { return [0, 1, 2, 3, 4, 5, 6]; } }
/* inizio della settimana da mostrare: quella in corso, ma il primo giorno della settimana quella appena finita */
function w111WeekStart(now) {
  now = now || new Date(); const first = w111WeekOrder()[0]; const d = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  let back = (wdIdx(d) - first + 7) % 7; if (back === 0) back = 7;
  d.setDate(d.getDate() - back); return d;
}
function w111Week(now) {
  now = now || new Date(); const s = w111WeekStart(now); const tk = dkey(now); const out = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(s.getFullYear(), s.getMonth(), s.getDate() + i); const k = dkey(d); const r = (S.days || {})[k];
    let st = k > tk ? "next" : "none";
    if (r && k <= tk) { if (r.done > 0) st = r.total && r.done >= r.total ? "all" : "some"; else if (r.rest || r.free) st = "rest"; }
    out.push({ d, k, st });
  }
  return out;
}
function w111Count(wk) { return wk.filter((x) => x.st === "all" || x.st === "some").length; }
function w111Title(wk) {
  const n = w111Count(wk); const t = w111t(); const pool = n >= 6 ? t.full : n >= 3 ? t.good : n >= 1 ? t.some : t.calm;
  const wn = Math.floor(new Date(dkey(wk[0].d) + "T12:00:00").getTime() / (7 * 86400000));
  return pool[((wn % pool.length) + pool.length) % pool.length];
}
/* l'evento di adesso: Natale, Nuovo inizio, oppure la stagione del sentiero */
function w111Event() {
  try { if (typeof xmOn === "function" && xmOn()) return { kind: "xmas", name: w111t().xmas }; } catch (e) { /* niente */ }
  try { if (typeof fs20On === "function" && fs20On()) return { kind: "fresh", name: (GR20_T[S.lang] || GR20_T.en).fsPill }; } catch (e) { /* niente */ }
  try { const se = curSeason(); if (se) return { kind: seaKind(se), name: seaName(se) }; } catch (e) { /* niente */ }
  return { kind: "lanterns", name: "" };
}

/* ---------- disegno ---------- */
const W111_EVPAL = { lanterns: ["#E2654F", "#F2B140", "#3E3866"], stars: ["#FFD25E", "#AEB3F0", "#283260"], kites: ["#E8603C", "#7B6FD0", "#CFE7F3"], xmas: ["#C8503B", "#3E7A4A", "#F2B33D"], fresh: ["#F2B140", "#F29BB8", "#9FD3E8"] };
/* francobollo e piccoli segni dell'evento (gli stessi disegni che l'app usa nella stanza) */
function w111EvShape(kind, x, y, s, i) {
  const c = W111_EVPAL[kind] || W111_EVPAL.lanterns;
  try {
    if (kind === "stars") return starShape(x, y, s, i % 2 ? "#FFE7A0" : "#FFD25E", false);
    if (kind === "kites") return kiteShape(x, y, s * 0.9, c[i % 2], i % 2 === 0, "#F2B140");
    if (kind === "lanterns") return lanternShape(x, y, s, i % 2 ? "#F2B140" : "#E2654F", true);
  } catch (e) { /* forme non disponibili: puntini */ }
  if (kind === "xmas") {
    const r = 10 * s;
    if (i % 2) return `<g transform="translate(${x} ${y})" stroke="#8DB8DE" stroke-width="${2.6 * s}" stroke-linecap="round" fill="none"><path d="M0 ${-r}V${r}M${-r * 0.87} ${-r / 2}L${r * 0.87} ${r / 2}M${-r * 0.87} ${r / 2}L${r * 0.87} ${-r / 2}"/><path d="M${-r * 0.3} ${-r * 0.75}L0 ${-r * 0.5}L${r * 0.3} ${-r * 0.75}M${-r * 0.3} ${r * 0.75}L0 ${r * 0.5}L${r * 0.3} ${r * 0.75}" stroke-width="${1.8 * s}"/></g>`;
    /* pallina dell'albero: rossa o verde, con il cappuccio dorato e un riflesso */
    const col = i % 4 === 0 ? "#C8503B" : "#3E7A4A";
    return `<g transform="translate(${x} ${y})"><path d="M0 ${-r * 1.9}V${-r * 1.15}" stroke="#B89A6A" stroke-width="${1.2 * s}"/><rect x="${-r * 0.32}" y="${-r * 1.22}" width="${r * 0.64}" height="${r * 0.36}" rx="${r * 0.1}" fill="#F2B33D"/><circle r="${r * 0.95}" fill="${col}"/><circle cx="${-r * 0.32}" cy="${-r * 0.3}" r="${r * 0.24}" fill="#fff" opacity=".45"/></g>`;
  }
  const r = 9 * s; return `<g transform="translate(${x} ${y})"><circle r="${r * 0.55}" fill="${c[i % 3]}"/>${[0, 60, 120, 180, 240, 300].map((a) => `<path d="M0 ${-r * 0.85}V${-r * 1.35}" stroke="${c[i % 3]}" stroke-width="${2 * s}" stroke-linecap="round" transform="rotate(${a})"/>`).join("")}</g>`;
}
/* simbolo di un giorno (in un quadrato 100x100) */
function w111DaySym(st, pal) {
  const sprout = (col) => `<path d="M50 74V52" stroke="${col}" stroke-width="7" stroke-linecap="round"/><path d="M50 56C50 40 38 32 24 32C24 47 34 56 50 56Z" fill="${col}"/><path d="M50 52C50 36 62 27 77 27C77 43 66 52 50 52Z" fill="${col}"/>`;
  if (st === "all") return `<rect x="4" y="4" width="92" height="92" rx="28" fill="${pal[2]}"/>${sprout("#fff")}<circle cx="78" cy="78" r="17" fill="#fff"/><path d="M70 78l6 6 10-11" stroke="${pal[2]}" stroke-width="5.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
  if (st === "some") return `<rect x="4" y="4" width="92" height="92" rx="28" fill="${pal[1]}"/>${sprout("#fff")}`;
  if (st === "rest") return `<rect x="4" y="4" width="92" height="92" rx="28" fill="#EFE6F7"/><path d="M60 26a26 26 0 1 0 16 44A22 22 0 0 1 60 26Z" fill="#9C8BC9"/><circle cx="30" cy="30" r="3" fill="#B9ABDD"/><circle cx="74" cy="26" r="2.4" fill="#B9ABDD"/>`;
  if (st === "next") return `<rect x="7" y="7" width="86" height="86" rx="26" fill="none" stroke="#C9BBA6" stroke-width="4" stroke-dasharray="3 10" stroke-linecap="round"/>`;
  return `<rect x="4" y="4" width="92" height="92" rx="28" fill="#FFFDF8"/><rect x="5.5" y="5.5" width="89" height="89" rx="26.5" fill="none" stroke="#E2D6C3" stroke-width="3"/><circle cx="50" cy="50" r="9" fill="#E8DDCB"/>`;
}
/* marchio in basso, uguale su tutte le cartoline: Germo dell'icona + "Tanetto" e sotto #tanettoapp */
function w111Brand(c, logo, cx, y, pal, FD, FB, size) {
  size = size || 46;
  c.font = `600 ${size}px ${FD}`; const tw = c.measureText("Tanetto").width; const lw = logo ? Math.round(size * 1.3) : 0; const gx = cx - (tw + lw + 14) / 2;
  if (logo) {
    c.fillStyle = "rgba(255,253,248,.9)"; c.beginPath(); c.arc(gx + lw / 2, y - size * 0.35, lw / 2 + 6, 0, Math.PI * 2); c.fill();
    c.save(); c.beginPath(); c.arc(gx + lw / 2, y - size * 0.35, lw / 2, 0, Math.PI * 2); c.clip(); c.drawImage(logo, gx, y - size * 0.35 - lw / 2, lw, lw); c.restore();
  }
  c.textAlign = "left"; c.fillStyle = pal[2]; c.fillText("Tanetto", gx + lw + 14, y);
  c.textAlign = "center"; c.font = `600 ${Math.round(size * 0.62)}px ${FB}`; c.fillStyle = "#6E655D"; c.fillText("#tanettoapp", cx, y + size * 1.02);
}
const W111_FD = '"Fredoka", "Trebuchet MS", "Hiragino Maru Gothic ProN", "Noto Sans CJK JP", Arial, sans-serif';
const W111_FB = '"Figtree", "Segoe UI", "Noto Sans CJK JP", Arial, sans-serif';
let w111Memo = { key: "", url: "" };
async function w111WeekMake(fmt) {
  const sq = fmt === "square"; const W = 1080, H = sq ? 1080 : 1920;
  const wk = w111Week(); const ev = w111Event(); const t = w111t(); const name = w111Name();
  const title = w111Title(wk); const kick = t.kick(name); const n = w111Count(wk); const dline = n ? t.days(n) : "";
  const key = [fmt, S.lang, S.pet, S.hat, S.wall, (S.furn || []).join(","), name, wk.map((x) => x.st).join(""), dkey(wk[0].d), ev.kind, ev.name, title].join("|");
  if (w111Memo.key === key && w111Memo.url) return { url: w111Memo.url, title, kick, dline, n };
  const pal = (typeof WEEK_PAL !== "undefined" && (WEEK_PAL[S.pet] || WEEK_PAL.germo)) || ["#DCEFD3", "#A8D79D", "#4E8A4A"];
  const si = (() => { try { return season(); } catch (e) { return { id: "autumn" }; } })();
  /* misure: storia 9:16 (tutto nella fascia centrale, sopra e sotto TikTok e Instagram mettono i loro pulsanti) e quadrata */
  const L1 = sq ? { kickY: 92, titleY: 168, tMax: 900, tSize: 66, tMin: 44, FX: 196, FY: 212, FW: 688, AW: 640, AH: 380, capH: 64, rot: -1.4, tileY: 720, tile: 96, gap: 16, labY: 852, cntY: 922, brandY: 1004, brand: 38 }
    : { kickY: 236, titleY: 330, tMax: 920, tSize: 84, tMin: 54, FX: 90, FY: 470, FW: 900, AW: 852, AH: 560, capH: 84, rot: -1.6, tileY: 1222, tile: 112, gap: 16, labY: 1384, cntY: 1470, brandY: 1606, brand: 46 };
  const FH = 24 + L1.AH + L1.capH; const cx = L1.FX + L1.FW / 2, cy = L1.FY + FH / 2;
  let room = roomSVG({ ph: "day", pet: S.pet, e: "felice", hat: S.hat, st: stage(), furn: S.furn, wall: S.wall, away: false, glow: 0.95, label: "", season: si.id });
  const ra = stripSvg(room);
  const deco = [];
  const spots = sq ? [[70, 110, 1.6], [1010, 120, 1.9], [80, 660, 1.4], [1012, 640, 1.7], [60, 960, 1.3], [1020, 980, 1.5]]
    : [[96, 150, 2.1], [985, 132, 2.5], [70, 760, 1.8], [1010, 820, 2.2], [92, 1130, 1.7], [996, 1150, 1.9], [120, 1760, 2.2], [960, 1780, 2.4]];
  spots.forEach(([x, y, s], i) => deco.push(`<g opacity="${i % 3 === 0 ? 0.9 : 0.75}">${w111EvShape(ev.kind, x, y, s, i)}</g>`));
  const tw = 7 * L1.tile + 6 * L1.gap; const tx0 = (W - tw) / 2;
  const tiles = wk.map((x, i) => `<svg x="${tx0 + i * (L1.tile + L1.gap)}" y="${L1.tileY}" width="${L1.tile}" height="${L1.tile}" viewBox="0 0 100 100">${w111DaySym(x.st, pal)}</svg>`).join("");
  /* striscia dei giorni: un cartoncino chiaro dietro i simboli (come un biglietto) */
  const strip = `<rect x="${tx0 - 26}" y="${L1.tileY - 22}" width="${tw + 52}" height="${L1.labY - L1.tileY + 44}" rx="40" fill="#FFFDF8" opacity=".78"/>`;
  const stamp = `<g transform="translate(${L1.FX + L1.FW - (sq ? 96 : 128)} ${L1.FY - (sq ? 26 : 34)}) rotate(6) scale(${sq ? 0.78 : 1})"><rect x="-6" y="-6" width="124" height="148" rx="6" fill="#FFFDF8" stroke="${pal[1]}" stroke-width="3" stroke-dasharray="7 6"/><rect x="6" y="6" width="100" height="124" rx="4" fill="${ev.kind === "stars" ? "#283260" : ev.kind === "lanterns" ? "#3E3866" : pal[0]}"/><g transform="translate(56 64)">${w111EvShape(ev.kind, 0, 0, 2.2, 0)}</g><rect x="30" y="112" width="52" height="7" rx="3.5" fill="${pal[2]}" opacity=".45"/></g>`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><defs>`
    + `<linearGradient id="w111bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFBF4"/><stop offset=".45" stop-color="${pal[0]}"/><stop offset="1" stop-color="${pal[1]}"/></linearGradient>`
    + `<clipPath id="w111cl"><rect x="${L1.FX + 24}" y="${L1.FY + 24}" width="${L1.AW}" height="${L1.AH}" rx="14"/></clipPath></defs>`
    + `<rect width="${W}" height="${H}" fill="url(#w111bg)"/>`
    + `<circle cx="70" cy="${sq ? 120 : 210}" r="${sq ? 170 : 220}" fill="#fff" opacity=".32"/><circle cx="${W - 60}" cy="${H - 90}" r="${sq ? 200 : 280}" fill="#fff" opacity=".22"/>`
    + deco.join("")
    + `<g transform="rotate(${L1.rot} ${cx} ${cy})">`
    + `<rect x="${L1.FX + 6}" y="${L1.FY + 20}" width="${L1.FW}" height="${FH}" rx="22" fill="#3A2510" opacity=".08"/><rect x="${L1.FX + 3}" y="${L1.FY + 10}" width="${L1.FW}" height="${FH}" rx="22" fill="#3A2510" opacity=".07"/>`
    + `<rect x="${L1.FX}" y="${L1.FY}" width="${L1.FW}" height="${FH}" rx="22" fill="#FFFDF8"/>`
    + `<g clip-path="url(#w111cl)"><svg x="${L1.FX + 24}" y="${L1.FY + 24}" width="${L1.AW}" height="${L1.AH}" viewBox="${ra.vb}" preserveAspectRatio="xMidYMid slice">${ra.inner}</svg></g>`
    + `<rect x="${L1.FX + 24}" y="${L1.FY + 24}" width="${L1.AW}" height="${L1.AH}" rx="14" fill="none" stroke="#000" stroke-opacity=".06" stroke-width="2"/>`
    + stamp + `</g>` + strip + tiles + `</svg>`;
  const img = await loadImg("data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg));
  const logo = await loadImg(typeof BOOT_IMG === "string" ? BOOT_IMG : "").catch(() => null);
  await w111Fonts([kick, title, dline, ev.name]);
  const cv = document.createElement("canvas"); cv.width = W; cv.height = H; const c = cv.getContext("2d"); c.drawImage(img, 0, 0);
  const FD = W111_FD, FB = W111_FB; c.textAlign = "center"; c.textBaseline = "alphabetic";
  /* in alto: con chi (piccolo) e il titolo affettuoso (grande, al massimo due righe) */
  const kk = gr20Lines(c, kick, L1.tMax - 40, sq ? 38 : 46, 28, `600 {s}px ${FB}`);
  c.font = `600 ${kk.size}px ${FB}`; c.fillStyle = pal[2]; c.fillText(kk.lines[0], W / 2, L1.kickY);
  const tt = gr20Lines(c, title, L1.tMax, L1.tSize, L1.tMin, `600 {s}px ${FD}`);
  c.font = `600 ${tt.size}px ${FD}`; c.fillStyle = "#2F2A26";
  if (tt.lines.length > 1) { const y0 = L1.titleY - (sq ? 10 : 18); tt.lines.forEach((ln, i) => c.fillText(ln, W / 2, y0 + i * tt.size * 1.06)); } else c.fillText(tt.lines[0], W / 2, L1.titleY);
  /* sotto la foto, sul bordo bianco: il nome dell'evento */
  if (ev.name) {
    c.save(); c.translate(cx, cy); c.rotate((L1.rot * Math.PI) / 180);
    const cp = gr20Lines(c, ev.name, L1.FW - 120, sq ? 34 : 42, 24, `italic 500 {s}px ${FB}`);
    c.font = `italic 500 ${cp.size}px ${FB}`; c.fillStyle = "#6E655D"; c.fillText(cp.lines[0], 0, L1.FY + 24 + L1.AH + (sq ? 46 : 58) - cy); c.restore();
  }
  /* iniziali dei giorni sotto i simboli */
  const tw2 = 7 * L1.tile + 6 * L1.gap; const x0 = (W - tw2) / 2;
  wk.forEach((x, i) => {
    const lab = wdName(wdIdx(x.d)); c.font = `600 ${sq ? 26 : 30}px ${FB}`;
    let fs = sq ? 26 : 30; while (c.measureText(lab).width > L1.tile + L1.gap - 4 && fs > 16) { fs -= 1; c.font = `600 ${fs}px ${FB}`; }
    c.fillStyle = x.st === "next" ? "#A79C8E" : "#5E564F"; c.fillText(lab, x0 + i * (L1.tile + L1.gap) + L1.tile / 2, L1.labY - (sq ? 2 : 8));
  });
  if (dline) { const dl = gr20Lines(c, dline, 900, sq ? 40 : 50, 28, `600 {s}px ${FD}`); c.font = `600 ${dl.size}px ${FD}`; c.fillStyle = pal[2]; c.fillText(dl.lines[0], W / 2, L1.cntY); }
  w111Brand(c, logo, W / 2, L1.brandY, pal, FD, FB, L1.brand);
  const url = cv.toDataURL("image/png"); w111Memo = { key, url };
  return { url, title, kick, dline, n };
}

/* ---------- finestra: anteprima, formato, condividi / salva ---------- */
const W111_FMT = () => [(typeof V110_PH !== "undefined" && (V110_PH[S.lang] || V110_PH.en)[1]) || "Story", w111t().sq];
function w111FmtTabs() {
  const f = W111_FMT(); const cur = typeof gr20Fmt !== "undefined" ? gr20Fmt : "story";
  return `<div class="tabsx w111fmt" role="tablist">${[["story", f[0] + " 9:16"], ["square", f[1] + " 1:1"]].map(([k, l]) => `<button role="tab" type="button" data-w111fmt="${k}" aria-selected="${cur === k}">${esc(l)}</button>`).join("")}</div>`;
}
async function w111WeekOpen() {
  if (!S.pet) return;
  const t = w111t(), L0 = L(); const share = w111ShareOk();
  gr20Cur = null; gr20Fmt = "story";
  try { S.w111wk = { wk: dkey(w111WeekStart()), seen: 1 }; save(); } catch (e) { /* niente */ }
  layer.innerHTML = `<div class="overlay gr20ov w111ov" role="dialog" aria-modal="true" aria-labelledby="gr20T"><div class="box gr20box"><h2 id="gr20T">${esc(t.kick(S.petName || w111Name()))}</h2>
    ${share ? w111FmtTabs() : ""}<div class="gr20prev" id="gr20Prev"><span class="gr20wait" aria-hidden="true"></span></div><p class="small muted gr20msg" id="gr20Msg" aria-live="polite">${esc(L0.shareMaking || "")}</p>
    ${share ? `<div class="gr20btns"><button class="btn" id="gr20Send" type="button" disabled>${icon("share")}<span>${esc(L0.share)}</span></button><button class="btn ghost" id="gr20Save" type="button" disabled>${icon("download")}<span>${esc(L0.saveImg)}</span></button></div>` : ""}
    <button class="link" id="closeLayer" type="button">${esc(L0.close)}</button></div></div>`;
  const cl = layer.querySelector("#closeLayer"); if (cl) cl.focus();
  if (gr20anim()) G.from(".gr20box", { y: 24, opacity: 0, duration: 0.35, ease: "power3.out" });
  try { SND.play("pop"); } catch (e) { /* niente */ }
  trackOnce("settimana-anteprima");
  return w111WeekFill();
}
async function w111WeekFill() {
  const box = layer.querySelector(".w111ov .gr20box"); if (!box) return;
  const t = w111t(); const share = w111ShareOk(); const pv = box.querySelector("#gr20Prev");
  pv.classList.toggle("sq", gr20Fmt === "square");
  try {
    const r = await w111WeekMake(gr20Fmt); if (!box.isConnected) return;
    const name = w111Name();
    gr20Cur = { kind: "week", ck: "", url: r.url, name: gr20Fmt === "square" ? "tanetto-settimana-1x1.png" : "tanetto-settimana.png", text: w111ShareText(t.txt(name), "week") };
    pv.innerHTML = `<img class="gr20img" src="${r.url}" alt="${esc(r.kick + ": " + r.title + (r.dline ? ". " + r.dline : ""))}">`;
    if (gr20anim()) G.from(pv.firstChild, { scale: 0.96, opacity: 0, duration: 0.3, ease: "power2.out" });
    box.querySelector("#gr20Msg").textContent = share ? gr20t().hint : t.kid(name);
    box.querySelectorAll("#gr20Send, #gr20Save").forEach((b) => { b.disabled = false; });
  } catch (e) {
    const m = box.querySelector("#gr20Msg"); if (m) m.textContent = L().weekErr || ""; if (pv) pv.classList.add("err");
  }
}
document.addEventListener("click", (ev) => {
  const b = ev.target.closest && ev.target.closest("[data-w111fmt]"); if (!b) return; ev.stopImmediatePropagation(); ev.preventDefault();
  const f = b.dataset.w111fmt === "square" ? "square" : "story"; if (f === gr20Fmt) return; gr20Fmt = f;
  document.querySelectorAll("[data-w111fmt]").forEach((x) => x.setAttribute("aria-selected", String(x === b)));
  document.querySelectorAll("#gr20Send, #gr20Save").forEach((x) => { x.disabled = true; });
  if (layer.querySelector(".w111ov")) w111WeekFill(); else if (gr20Cur || gr20Last) gr20Refill();
}, true);
/* il pulsante del Diario ("Crea la cartolina") apre la cartolina nuova */
makeWeekCard = function () { return w111WeekOpen(); };

/* ---------- la scheda in Oggi: ultimo giorno della settimana dalle 18, e tutto il primo giorno della settimana dopo ---------- */
function w111WeekDue(now) {
  now = now || new Date(); if (!S.pet || !S.firstDay) return false;
  const ord = w111WeekOrder(); const wd = wdIdx(now); const last = ord[6], first = ord[0];
  const inWin = (wd === last && now.getHours() >= 18) || wd === first; if (!inWin) return false;
  const ws = dkey(w111WeekStart(now)); if (S.w111wk && S.w111wk.wk === ws) return false; /* gia' vista o chiusa */
  if (dkey(now) === S.firstDay) return false; /* installata oggi: niente da raccontare */
  return w111Count(w111Week(now)) > 0 || Object.keys(S.days || {}).some((k) => k >= ws && k <= dkey(now) && S.days[k] && (S.days[k].rest || S.days[k].free));
}
function w111WeekCard() {
  if (!w111WeekDue()) return ""; const t = w111t(); const nm = S.petName || w111Name();
  return `<div class="card namecard w111wk" id="w111Wk"><button class="iconbtn ncx" id="w111WkX" type="button" aria-label="${esc(L().close)}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg></button>`
    + `<div class="nchead"><span class="ncpet" aria-hidden="true">${petSVG(S.pet, "felice", S.hat, stage(), "")}</span><div><b>${esc(t.ready(nm))}</b><p class="small muted">${esc(t.readyP)}</p></div></div>`
    + `<div class="w111days" aria-hidden="true">${w111Week().map((x) => `<i class="w111d ${x.st}"></i>`).join("")}</div>`
    + `<button class="btn block" id="w111WkGo" type="button">${icon("card")}<span>${esc(t.open)}</span></button></div>`;
}
const _viewTodayW111 = viewToday;
viewToday = function (...a) {
  const h = _viewTodayW111.apply(this, a);
  try {
    if (!S.pet || typeof h !== "string") return h; const c = w111WeekCard(); if (!c) return h;
    for (const k of ['<button class="nvpass', '<p class="note"']) { const i = h.indexOf(k); if (i >= 0) return h.slice(0, i) + c + h.slice(i); }
    const j = h.lastIndexOf("</div>"); return j > 0 ? h.slice(0, j) + c + h.slice(j) : h + c;
  } catch (e) { return h; }
};
document.addEventListener("click", (ev) => {
  const b = ev.target.closest && ev.target.closest("#w111WkGo, #w111WkX"); if (!b) return; ev.stopImmediatePropagation(); ev.preventDefault();
  if (b.id === "w111WkX") { S.w111wk = { wk: dkey(w111WeekStart()), seen: 0 }; save(); try { SND.play("click"); } catch (e) { /* niente */ } const y = window.scrollY; render(); window.scrollTo(0, y); return; }
  w111WeekOpen();
}, true);

/* ---------- statistiche di percorso (una volta per installazione, solo chi installa dalla 1.0.11) ---------- */
if (!S.pet && !S.w111new) { S.w111new = 1; try { save(); } catch (e) { /* niente */ } }
function w111Path(name) {
  try { if (!S.w111new) return; S.w111f = S.w111f || {}; if (S.w111f[name]) return; S.w111f[name] = 1; save(); track("percorso-" + name); } catch (e) { /* niente */ }
}
/* passi dell'accoglienza: compagno scelto, nome, obiettivi (= compagno arrivato), guida finita */
document.addEventListener("click", (ev) => {
  const b = ev.target.closest && ev.target.closest("button"); if (!b) return;
  if (b.id === "toName") w111Path("accoglienza-1-compagno");
  if (b.id === "toGoals") w111Path("accoglienza-2-nome");
}, true);
const _renderW111p = render;
render = function (...a) {
  const r = _renderW111p.apply(this, a);
  try { document.documentElement.classList.toggle("w111noshare", !w111ShareOk()); } catch (e) { /* niente */ }
  try {
    if (S.w111new && S.pet) {
      w111Path("accoglienza-3-obiettivi");
      if (S.tut === 99) w111Path("accoglienza-4-guida");
      if ((S.log || []).length || Object.values(S.days || {}).some((d) => d && d.done > 0)) w111Path("primo-obiettivo");
      if (S.away || (S.cards || []).length) w111Path("primo-viaggio");
      const di = typeof dayIndex === "function" ? dayIndex() : 0; if (di === 1) w111Path("giorno-2"); if (di === 6) w111Path("giorno-7");
    }
  } catch (e) { /* niente */ }
  return r;
};
if (typeof openPlus === "function") { const _openPlusW111 = openPlus; openPlus = function (...a) { w111Path("plus-aperto"); return _openPlusW111.apply(this, a); }; }
/* widget sulla schermata Home: l'app nativa dice quanti ce ne sono (TanettoWidget.info) */
function w111WidgetCheck() { try { if (typeof widgetInfo !== "undefined" && widgetInfo && widgetInfo.count > 0) w111Path("widget-aggiunto"); } catch (e) { /* niente */ } }
setTimeout(w111WidgetCheck, 6000);
document.addEventListener("visibilitychange", () => { if (document.visibilityState === "visible") setTimeout(w111WidgetCheck, 4500); });
