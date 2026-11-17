/* =================== 1.0.11: rifiniture della marca (voce, contrasto, stella polare) ===================
   1) VOCE (VOCE.md, regola 4 "mai colpa, mai fretta"): la finestra di uscita non dice piu' "Vuoi davvero uscire? ... ti aspetta"
      ma "Vuoi chiudere Tanetto? A presto! {n} ti tiene il posto bello caldo."; il premio dell'album "e' pronto" (non "ti aspetta");
      il primo accessorio dice dove trovare gli altri, senza "ti aspettano". Le frasi in T sono in 3zzm_v111_texts.js.
   2) STELLA POLARE (MISURA.md, punto 1): "compagni curati nella settimana". Quando un telefono arriva al terzo giorno diverso
      della settimana con almeno un obiettivo spuntato, l'app segna UNA volta per quella settimana l'evento anonimo
      "compagno-curato-settimana" (GoatCounter, stesso track() di tutti gli altri: spento per i minori e per l'eta' non detta,
      spento con l'interruttore in Profilo, niente prima della domanda sull'eta'; in attesa al massimo 20 eventi, come oggi).
      Settimana = lunedi'-domenica del calendario del telefono (ISO 8601), uguale per tutti cosi' i conteggi si sommano per
      settimana. Vale per chiunque (non solo per le installazioni nuove come gli eventi "percorso-..."), perche' la stella
      polare misura tutte le persone attive. Nessun identificativo, nessun dato scritto dall'utente, nessun numero di giorni.
   Il contrasto dei pulsanti (testo bianco su verde) e' in 11zo_v111_polish.css. */

/* ---------- 1) voce ---------- */
const V111_EXIT = {
  it: { t: "Vuoi chiudere Tanetto?", p: (n) => `A presto! ${n} ti tiene il posto bello caldo.`, exit: "Chiudi" },
  en: { t: "Close Tanetto?", p: (n) => `See you soon! ${n} will keep your spot nice and cosy.`, exit: "Close" },
  de: { t: "Tanetto schließen?", p: (n) => `Bis bald! ${n} hält dir dein Plätzchen schön warm.`, exit: "Schließen" },
  es: { t: "¿Quieres cerrar Tanetto?", p: (n) => `¡Hasta pronto! ${n} te guarda tu lugar calentito.`, exit: "Cerrar" },
  fr: { t: "Fermer Tanetto ?", p: (n) => `À bientôt ! ${n} te garde ta place bien au chaud.`, exit: "Fermer" },
  pt: { t: "Quer fechar o Tanetto?", p: (n) => `Até logo! ${n} guarda seu lugarzinho bem quentinho.`, exit: "Fechar" },
  ja: { t: "Tanettoを閉じますか？", p: (n) => `またね！${n}があなたの場所をぽかぽかにしておくよ。`, exit: "閉じる" },
  ko: { t: "Tanetto를 닫을까요?", p: () => "또 만나요! 따뜻한 자리를 그대로 남겨 둘게요.", exit: "닫기" },
  zh: { t: "要关闭 Tanetto 吗？", p: (n) => `下次见！${n} 会帮你把位置捂得暖暖的。`, exit: "关闭" },
  zht: { t: "要關閉 Tanetto 嗎？", p: (n) => `下次見！${n} 會幫你把位子留得暖呼呼的。`, exit: "關閉" },
  ru: { t: "Закрыть Tanetto?", p: (n) => `До скорой встречи! ${n} сбережёт для тебя тёплое местечко.`, exit: "Закрыть" },
  pl: { t: "Zamknąć Tanetto?", p: (n) => `Do zobaczenia! ${n} zachowa dla ciebie cieplutkie miejsce.`, exit: "Zamknij" },
  nl: { t: "Tanetto sluiten?", p: (n) => `Tot snel! ${n} houdt je plekje lekker warm.`, exit: "Sluiten" },
  tr: { t: "Tanetto kapatılsın mı?", p: (n) => `Görüşmek üzere! ${n} yerini sıcacık tutacak.`, exit: "Kapat" }
};
Object.keys(V111_EXIT).forEach((l) => { if (V18B[l]) Object.assign(V18B[l], V111_EXIT[l]); });
const V111_READY = {
  it: "Pagina completata: il premio è pronto nell'album.", en: "Page complete: your reward is ready in the album.",
  de: "Seite komplett: Deine Belohnung liegt im Album bereit.", es: "Página completa: tu premio está listo en el álbum.",
  fr: "Page complète : ta récompense est prête dans l'album.", pt: "Página completa: seu prêmio está pronto no álbum.",
  ja: "ページ完成：アルバムでごほうびを受け取れます。", ko: "페이지 완성: 앨범에서 보상을 받을 수 있어요.",
  zh: "本页集满：去相册领取奖励吧。", zht: "本頁集滿：去相簿領取獎勵吧。", ru: "Страница собрана: награда уже в альбоме.",
  pl: "Strona pełna: nagroda jest gotowa w albumie.", nl: "Pagina vol: je beloning staat klaar in het album.", tr: "Sayfa tamam: ödülün albümde hazır."
};
if (typeof V19A !== "undefined") Object.keys(V111_READY).forEach((l) => { if (V19A[l] && "ready" in V19A[l]) V19A[l].ready = V111_READY[l]; });
const V111_GP = {
  it: (n, h, w) => `Un papillon a pois, il primo accessorio di ${n}. Altri vestiti e accessori li trovi in ${h}, alla voce ${w}.`,
  en: (n, h, w) => `A polka-dot bow tie, ${n}'s very first accessory. You'll find more clothes and accessories in ${h}, under ${w}.`,
  de: (n, h, w) => `Eine gepunktete Fliege – das allererste Accessoire für ${n}. Weitere Kleidung und Accessoires findest du unter ${h} › ${w}.`,
  es: (n, h, w) => `Una pajarita de lunares, el primer accesorio de ${n}. Encontrarás más ropa y accesorios en ${h}, en ${w}.`,
  fr: (n, h, w) => `Un nœud papillon à pois, le tout premier accessoire de ${n}. Tu trouveras d'autres vêtements et accessoires dans ${h}, rubrique ${w}.`,
  pt: (n, h, w) => `Uma gravata-borboleta de bolinhas, o primeiro acessório de ${n}. Você encontra mais roupas e acessórios em ${h}, na aba ${w}.`,
  ja: (n, h, w) => `水玉の蝶ネクタイ。${n}のはじめてのアクセサリーです。ほかの服やアクセサリーは「${h}」の「${w}」にありますよ。`,
  ko: (n, h, w) => `물방울무늬 나비넥타이예요. ${n}의 첫 액세서리랍니다. 다른 옷과 액세서리는 ${h}의 ${w}에서 찾을 수 있어요.`,
  zh: (n, h, w) => `一个波点领结，是${n}的第一件配饰。更多衣服和配饰可以在「${h}」的「${w}」里找到。`,
  zht: (n, h, w) => `一個點點領結，是${n}的第一件配件。更多衣服和配件可以在「${h}」的「${w}」裡找到。`,
  ru: (n, h, w) => `${n} получает свой самый первый аксессуар — бабочку в горошек. Другую одежду и аксессуары ты найдёшь в разделе «${h}» › «${w}».`,
  pl: (n, h, w) => `${n} dostaje swój pierwszy dodatek: muszkę w kropki. Więcej ubrań i dodatków znajdziesz w zakładce ${h} › ${w}.`,
  tr: (n, h, w) => `Puantiyeli bir papyon: ${n} için ilk aksesuar. Daha fazla kıyafet ve aksesuarı ${h} › ${w} bölümünde bulabilirsin.`
};
if (typeof W20T !== "undefined") Object.keys(V111_GP).forEach((l) => { if (W20T[l] && typeof W20T[l].gP === "function") W20T[l].gP = V111_GP[l]; });

/* inglese semplice (VOCE.md, regola 1: niente modi di dire britannici come "Fancy ...?", che chi ha studiato l'inglese a scuola
   puo' non capire): "How about ...?" / "Would you like to ...?" */
try {
  const vx = (p, i, t) => { const a = V110_VOICE[p] && V110_VOICE[p].notif && V110_VOICE[p].notif.en; if (Array.isArray(a) && /^\{n\}.*Fancy/.test(a[i] || "")) a[i] = t; };
  vx("germo", 0, "{n} opened a new little leaf in the sun. How about one tiny goal, if you feel like it?");
  vx("miko", 2, "{n} made the nest even fluffier. How about one small step, nice and slow?");
  vx("pingo", 0, "{n} just did a funny slide on the ice. How about a tiny step of your own, if you like?");
  if (V19N.en && /Fancy/.test(V19N.en.msgs[9] || "")) V19N.en.msgs[9] = "{n} tidied up the room. How about one small goal together?";
  if (T.en.v26 && T.en.v26.notif && /Fancy/.test(T.en.v26.notif.m9 || "")) T.en.v26.notif.m9 = "{n} tidied up the room. How about one small goal together?";
  if (typeof NAV20_T !== "undefined" && NAV20_T.en && /Fancy/.test(NAV20_T.en.plusT || "")) NAV20_T.en.plusT = "Would you like to try Tanetto Plus?";
} catch (e) { /* niente */ }

/* ---------- 2) stella polare: "compagno-curato-settimana" ---------- */
function v111WeekStart(d) { const x = d ? new Date(d) : new Date(); x.setHours(12, 0, 0, 0); x.setDate(x.getDate() - ((x.getDay() + 6) % 7)); return x; }
function v111CaredDays(d) {
  const s = v111WeekStart(d); let n = 0;
  for (let i = 0; i < 7; i++) { const x = new Date(s); x.setDate(s.getDate() + i); const r = S.days && S.days[dkey(x)]; if (r && r.done > 0) n++; }
  return n;
}
function v111NorthStar() {
  try {
    if (!S || !S.pet) return;
    const wk = dkey(v111WeekStart()); if (S.v111cw === wk) return;
    if (v111CaredDays() < 3) return;
    S.v111cw = wk; save(); track("compagno-curato-settimana");
  } catch (e) { /* niente: le statistiche non devono mai disturbare l'app */ }
}
const _renderV111ns = render;
render = function (...a) { const r = _renderV111ns.apply(this, a); v111NorthStar(); return r; };
