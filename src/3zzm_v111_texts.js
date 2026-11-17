/* ===== 1.0.11: voce della marca, niente colpa (VOCE.md, regola 4: "mai colpa, mai fretta") =====
   Frasi che facevano sentire in colpa o "in debito" riscritte in modo caldo, in tutte le 14 lingue:
   - bentornato: niente piu' "i giorni che hai saltato" (si dice solo che e' bello rivedersi e si va avanti insieme);
   - il compagno non "ti aspettava" (notte, chat, sorpresa di domani): e' contento di vederti;
   - scudo e guida: "un giorno senza obiettivi" / "una pausa" invece di "salti / perdi un giorno";
   - battitina mancata: la colpa e' del pupazzo, mai della persona (regola 5); giardino vuoto senza "aspetta";
   - "Torna domani!" diventa un saluto ("A domani!").
   La finestra di uscita, il premio dell'album e il primo accessorio sono in 98zw_v111_polish.js (tabelle definite dopo). */
const V111_TX = {
  it: { night: "Sono un po' assonnato, ma che bello vederti.", greet: "Ehi, eccoti! Che bello vederti.", bye: "A presto! Io resto qui.", tomorrow: "Domani ti preparo una sorpresa. A domani!",
    shield: "Se un giorno passa senza obiettivi, uno scudo protegge la tua serie in automatico.", high: "Ops, ho mancato il cinque! Riproviamo?", garden: "Al giardino farebbe piacere un primo fiore.",
    teaser: "A domani!", gq: "E se mi prendo un giorno di pausa?", ga: "Va benissimo. Puoi segnare un giorno di riposo e la serie non si interrompe. Il regalo del giorno ricomincia semplicemente dal primo.",
    back: (n) => `${n} è felicissimo di rivederti! Ripartiamo da qui, insieme.` },
  en: { night: "I'm a little sleepy, but so happy to see you.", greet: "Hey, there you are! So good to see you.", bye: null, tomorrow: "Tomorrow I'll have a surprise for you. See you then!",
    shield: "If a day goes by without goals, a shield keeps your streak safe automatically.", high: "Oops, I missed the high five! One more?", garden: "The garden would love its first flower.",
    teaser: "See you tomorrow!", gq: "What if I take a day off?", ga: "That's completely fine. You can mark a rest day and your streak stays safe. The daily gift simply starts again from the beginning.",
    back: (n) => `${n} is so happy to see you again! Let's carry on from here, together.` },
  de: { night: "Ich bin etwas müde, aber ich freu mich so, dich zu sehen.", greet: "Hey, da bist du ja! Schön, dich zu sehen.", bye: "Bis bald! Ich bin hier.", tomorrow: "Morgen habe ich eine Überraschung für dich. Bis morgen!",
    shield: "Vergeht ein Tag ohne Ziele, schützt ein Schild automatisch deine Serie.", high: "Hoppla, daneben! Noch mal abklatschen?", garden: "Der Garten freut sich auf die erste Blume.",
    teaser: "Bis morgen!", gq: "Und wenn ich mal einen Tag Pause mache?", ga: "Das ist völlig in Ordnung. Du kannst einen Ruhetag eintragen, und deine Serie bleibt bestehen. Das Tagesgeschenk fängt einfach wieder von vorne an.",
    back: (n) => `${n} freut sich riesig, dich wiederzusehen! Wir machen einfach hier weiter, zusammen.` },
  es: { night: "Tengo un poco de sueño, pero qué alegría verte.", greet: "¡Ey, aquí estás! Qué alegría verte.", bye: "¡Hasta pronto! Aquí estaré.", tomorrow: "Mañana te preparo una sorpresa. ¡Hasta mañana!",
    shield: "Si un día pasa sin objetivos, un escudo protege tu racha automáticamente.", high: "¡Uy, no atiné! ¿Otra vez?", garden: "Al jardín le encantaría tener su primera flor.",
    teaser: "¡Hasta mañana!", gq: "¿Y si me tomo un día libre?", ga: "No pasa nada. Puedes marcar un día de descanso y tu racha no se rompe. El regalo del día simplemente vuelve a empezar.",
    back: (n) => `¡${n} está feliz de volver a verte! Seguimos desde aquí, juntos.` },
  fr: { night: "J'ai un peu sommeil, mais quelle joie de te voir.", greet: "Hé, te voilà ! Ça me fait plaisir de te voir.", bye: "À bientôt ! Je reste par ici.", tomorrow: "Demain, je te prépare une surprise. À demain !",
    shield: "Si une journée passe sans objectifs, un bouclier protège ta série automatiquement.", high: "Oups, raté ! On refait un tope-là ?", garden: "Le jardin aimerait bien une première fleur.",
    teaser: "À demain !", gq: "Et si je fais une pause d'un jour ?", ga: "Aucun souci. Tu peux noter un jour de repos et ta série continue. Le cadeau du jour recommence simplement au début.",
    back: (n) => `Quelle joie pour ${n} de te revoir ! On repart d'ici, ensemble.` },
  pt: { night: "Estou com um pouco de sono, mas que bom te ver.", greet: "Ei, você chegou! Que bom te ver.", bye: "Até logo! Vou estar por aqui.", tomorrow: "Amanhã vou te preparar uma surpresa. Até amanhã!",
    shield: "Se um dia passar sem metas, um escudo protege sua sequência automaticamente.", high: "Opa, errei o toca aqui! De novo?", garden: "O jardim adoraria ganhar a primeira flor.",
    teaser: "Até amanhã!", gq: "E se eu tirar um dia de folga?", ga: "Tudo bem. Você pode marcar um dia de descanso e sua sequência continua. O presente do dia simplesmente recomeça do início.",
    back: (n) => `${n} está muito feliz em te ver de novo! A gente segue daqui, juntos.` },
  ja: { night: "ちょっと眠いけど、会えてうれしいな。", greet: "あ、来てくれた！うれしいな。", bye: null, tomorrow: "明日はサプライズがあるよ。またね！",
    shield: "目標のない日があっても、シールドが自動で連続記録を守ってくれます。", high: null, garden: "お庭は最初のお花を楽しみにしています。",
    teaser: "また明日ね！", gq: "一日お休みしたら？", ga: null,
    back: (n) => `${n}はまた会えてとってもうれしそう! ここからまた、いっしょに始めよう。` },
  ko: { night: "조금 졸리지만 만나서 정말 기뻐요.", greet: "앗, 왔다! 정말 반가워요.", bye: "또 만나요! 저는 여기 있을게요.", tomorrow: "내일 깜짝 선물이 있어요. 내일 만나요!",
    shield: "목표 없이 지나간 날이 있어도 방패가 자동으로 연속 기록을 지켜 줘요.", high: null, garden: "정원이 첫 꽃을 기대하고 있어요.",
    teaser: "내일 만나요!", gq: "하루 쉬면 어떻게 돼요?", ga: null,
    back: (n) => `다시 만나서 ${n}도 정말 기뻐해요! 여기서부터 다시 함께 시작해요.` },
  zh: { night: "我有点困了，但见到你真开心。", greet: "嘿，你来啦！见到你真好。", bye: null, tomorrow: "明天我会给你一个惊喜。明天见哦！",
    shield: "如果某一天没有完成目标，护盾会自动保护你的连续记录。", high: "哎呀，我没击中！再来一次？", garden: "花园很期待第一朵花。",
    teaser: "明天见哦！", gq: "如果我想休息一天呢？", ga: null,
    back: (n) => `再次见到你，${n} 开心极了！我们从这里一起出发吧。` },
  zht: { night: "我有點睏了，但見到你好開心。", greet: "嘿，你來啦！見到你真好。", bye: null, tomorrow: "明天我會給你一個驚喜。明天見喔！",
    shield: "如果某一天沒有完成目標，護盾會自動保護你的連續紀錄。", high: "哎呀，我沒拍到！再來一次？", garden: "花園很期待第一朵花。",
    teaser: "明天見喔！", gq: "如果我想休息一天呢？", ga: null,
    back: (n) => `又見到你了，${n} 超開心！我們從這裡一起出發吧。` },
  ru: { night: "Глазки слипаются, но как хорошо, что ты здесь.", greet: "Эй, вот и ты! Как здорово тебя видеть.", bye: null, tomorrow: "Завтра у меня будет для тебя сюрприз. До завтра!",
    shield: "Если день пройдёт без целей, щит автоматически защитит твою серию.", high: "Ой, мимо! Давай ещё разок?", garden: "Сад будет рад первому цветку.",
    teaser: "До завтра!", gq: "А если я возьму выходной?", ga: "Всё в порядке. Можно отметить день отдыха, и серия останется в безопасности. Ежедневный подарок просто начнётся сначала.",
    back: (n) => `${n} так радуется новой встрече! Продолжим отсюда, вместе.` },
  pl: { night: "Trochę chce mi się spać, ale tak się cieszę, że jesteś.", greet: "Hej, jesteś! Fajnie cię widzieć.", bye: null, tomorrow: "Jutro będę mieć dla ciebie niespodziankę. Do jutra!",
    shield: "Jeśli jakiś dzień minie bez celów, tarcza automatycznie ochroni twoją serię.", high: "Ups, pudło! Jeszcze raz?", garden: "Ogród ucieszy się z pierwszego kwiatu.",
    teaser: "Do jutra!", gq: "A jeśli zrobię sobie dzień przerwy?", ga: "Wszystko w porządku. Możesz oznaczyć dzień odpoczynku, a twoja seria pozostanie bezpieczna. Codzienny prezent po prostu zacznie się od początku.",
    back: (n) => `${n} bardzo się cieszy, że znów cię widzi! Ruszamy stąd dalej, razem.` },
  nl: { night: "Ik ben een beetje slaperig, maar wat fijn om je te zien.", greet: "Hé, daar ben je! Fijn je te zien.", bye: null, tomorrow: "Morgen heb ik een verrassing voor je. Tot morgen!",
    shield: "Gaat er een dag voorbij zonder doelen? Dan beschermt een schild automatisch je reeks.", high: "Oeps, mis! Nog een keer?", garden: "De tuin kijkt uit naar zijn eerste bloem.",
    teaser: "Tot morgen!", gq: "En als ik een dagje vrij neem?", ga: null,
    back: (n) => `${n} is superblij je weer te zien! We gaan vanaf hier verder, samen.` },
  tr: { night: "Biraz uykum var ama seni gördüğüme çok sevindim.", greet: "Hey, geldin! Seni görmek çok güzel.", bye: null, tomorrow: "Yarın sana bir sürprizim olacak. Yarın görüşürüz!",
    shield: "Bir gün hedefsiz geçerse bir kalkan serini otomatik olarak korur.", high: "Hay aksi, ıskaladım! Bir daha?", garden: "Bahçe ilk çiçeğine çok sevinecek.",
    teaser: "Yarın görüşürüz!", gq: "Bir gün ara verirsem ne olur?", ga: null,
    back: (n) => `${n} seni yeniden gördüğü için çok mutlu! Buradan birlikte devam ediyoruz.` }
};
Object.keys(V111_TX).forEach((l) => {
  const t = T[l], x = V111_TX[l]; if (!t) return;
  const set = (o, k, v) => { if (o && v != null && k in o) o[k] = v; };
  if (t.talk && Array.isArray(t.talk.night) && t.talk.night.length > 2) t.talk.night[2] = x.night;
  if (t.chat && t.chat.R) { if (t.chat.R.greet && t.chat.R.greet.length > 1) t.chat.R.greet[1] = x.greet; if (x.bye && t.chat.R.bye && t.chat.R.bye.length) t.chat.R.bye[0] = x.bye; }
  set(t, "tomorrow", x.tomorrow); set(t, "gardenEmpty", x.garden); set(t, "teaserT", x.teaser);
  set(t.shield, "P", x.shield); set(t.play, "highMiss", x.high);
  if (Array.isArray(t.guide) && Array.isArray(t.guide[3])) { if (x.gq) t.guide[3][0] = x.gq; if (x.ga) t.guide[3][1] = x.ga; }
  if (t.v12 && Array.isArray(t.v12.backP) && t.v12.backP.length) t.v12.backP[0] = x.back;
});
