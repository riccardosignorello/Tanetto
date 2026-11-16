/* ===== 1.0.10 — fiducia e cura (dalle recensioni di altre app del genere, 16/11/2026) =====
   1) Plus: una riga chiara "quello che usi gratis resta gratis" e, con la prova gratuita, la promessa (mantenuta) di
      ricordare la fine della prova 2 giorni prima: notifica (se le notifiche sono permesse) e riquadro in Oggi con il
      collegamento all'abbonamento in Google Play. Le recensioni peggiori del genere sono addebiti a sorpresa.
   2) Promemoria: dopo il messaggio gentile del giorno 14 ne arrivano solo altri due, al giorno 30 e al giorno 60
      ("ti tiene il posto"), poi basta. Dopo una frase difficile, i promemoria programmati non parlano di obiettivi
      (solo frasi di compagnia) fino alla prossima apertura dell'app.
   Niente dati nuovi fuori dal telefono: S.plusTrialEnd e' solo una data. */

const V110_CARE = {
  it: { trust: "Plus aggiunge solo cose in più: tutto quello che usi gratis resta gratis.", trialNote: "Ti ricordiamo la fine della prova 2 giorni prima: qui nell'app e con una notifica, se le notifiche sono attive.", cardT: "La tua prova gratuita di Plus", card: (d) => `Finisce il ${d}. Se vuoi continuare non devi fare niente; se no, disdici in Google Play prima di quella data. Se l'hai già disdetta, va tutto bene.`, manage: "Gestisci in Google Play", notif: (d) => `La prova gratuita di Plus finisce il ${d}. Per continuare non devi fare niente; per non pagare, disdici in Google Play › Abbonamenti.`, far: (n) => `${n} sta bene e ti tiene il posto sul cuscino. Quando vuoi, anche solo per un saluto 🌱` },
  en: { trust: "Plus only adds extras: everything you use for free stays free.", trialNote: "We'll remind you 2 days before the trial ends: here in the app, and with a notification if notifications are on.", cardT: "Your free Plus trial", card: (d) => `It ends on ${d}. To keep Plus you don't need to do anything. If you'd rather not, cancel in Google Play before that date. Already cancelled? Then you're all set.`, manage: "Manage in Google Play", notif: (d) => `Your free Plus trial ends on ${d}. To keep it, do nothing; to avoid paying, cancel in Google Play › Subscriptions.`, far: (n) => `${n} is doing well and saving you a spot on the cushion. Whenever you like, even just to say hi 🌱` },
  de: { trust: "Plus bringt nur Extras: Alles, was du kostenlos nutzt, bleibt kostenlos.", trialNote: "Wir erinnern dich 2 Tage vor Ende der Testphase: hier in der App und mit einer Benachrichtigung, wenn sie aktiviert sind.", cardT: "Deine kostenlose Plus-Testphase", card: (d) => `Sie endet am ${d}. Wenn du Plus behalten willst, musst du nichts tun; sonst kündige vor diesem Datum in Google Play. Wenn du schon gekündigt hast, ist alles in Ordnung.`, manage: "In Google Play verwalten", notif: (d) => `Deine kostenlose Plus-Testphase endet am ${d}. Zum Behalten nichts tun; damit nichts berechnet wird, in Google Play › Abos kündigen.`, far: (n) => `${n} geht es gut und hält dir einen Platz auf dem Kissen frei. Wann immer du magst, auch nur für ein Hallo 🌱` },
  es: { trust: "Plus solo añade extras: todo lo que usas gratis sigue siendo gratis.", trialNote: "Te recordamos el final de la prueba 2 días antes: aquí en la app y con una notificación, si las tienes activadas.", cardT: "Tu prueba gratuita de Plus", card: (d) => `Termina el ${d}. Si quieres seguir, no tienes que hacer nada; si no, cancela en Google Play antes de esa fecha. Si ya la has cancelado, todo está en orden.`, manage: "Gestionar en Google Play", notif: (d) => `Tu prueba gratuita de Plus termina el ${d}. Para seguir, no hagas nada; para no pagar, cancela en Google Play › Suscripciones.`, far: (n) => `${n} está bien y te guarda un sitio en el cojín. Cuando quieras, aunque sea solo para saludar 🌱` },
  fr: { trust: "Plus ajoute seulement des extras : tout ce que tu utilises gratuitement reste gratuit.", trialNote: "On te rappelle la fin de l'essai 2 jours avant : ici dans l'appli, et par une notification si elles sont activées.", cardT: "Ton essai gratuit de Plus", card: (d) => `Il se termine le ${d}. Pour garder Plus, tu n'as rien à faire ; sinon, résilie dans Google Play avant cette date. Si tu as déjà résilié, tout va bien.`, manage: "Gérer dans Google Play", notif: (d) => `Ton essai gratuit de Plus se termine le ${d}. Pour continuer, ne fais rien ; pour ne pas payer, résilie dans Google Play › Abonnements.`, far: (n) => `${n} va bien et te garde une place sur le coussin. Quand tu veux, même juste pour dire bonjour 🌱` },
  pt: { trust: "O Plus só acrescenta extras: tudo o que você usa de graça continua grátis.", trialNote: "A gente te lembra do fim do teste 2 dias antes: aqui no app e com uma notificação, se elas estiverem ativas.", cardT: "Seu teste grátis do Plus", card: (d) => `Ele termina em ${d}. Para continuar, você não precisa fazer nada; se não quiser, cancele no Google Play antes dessa data. Se já cancelou, está tudo certo.`, manage: "Gerenciar no Google Play", notif: (d) => `Seu teste grátis do Plus termina em ${d}. Para continuar, não faça nada; para não pagar, cancele no Google Play › Assinaturas.`, far: (n) => `${n} está bem e guarda um lugar para você na almofada. Quando quiser, nem que seja só para dar um oi 🌱` },
  ja: { trust: "Plusは追加の楽しみだけ。無料で使っているものは、ずっと無料のままです。", trialNote: "無料体験が終わる2日前にお知らせします（アプリ内で。通知がオンなら通知でも）。", cardT: "Plusの無料体験", card: (d) => `${d}に終わります。続けるなら何もしなくて大丈夫。続けない場合は、その日までにGoogle Playで解約してください。もう解約していれば、それで大丈夫です。`, manage: "Google Playで管理", notif: (d) => `Plusの無料体験は${d}に終わります。続けるなら何もしなくて大丈夫。支払いたくない場合は、Google Play › 定期購入で解約してください。`, far: (n) => `${n}は元気で、クッションにあなたの席をとってあります。いつでも、あいさつだけでもどうぞ 🌱` },
  ko: { trust: "Plus는 추가 혜택만 더해요. 무료로 쓰던 건 계속 무료예요.", trialNote: "무료 체험이 끝나기 2일 전에 알려 드려요. 앱 안에서, 알림이 켜져 있다면 알림으로도요.", cardT: "Plus 무료 체험", card: (d) => `${d}에 끝나요. 계속 쓰려면 아무것도 하지 않아도 돼요. 원하지 않으면 그 전에 Google Play에서 해지하세요. 이미 해지했다면 괜찮아요.`, manage: "Google Play에서 관리", notif: (d) => `Plus 무료 체험이 ${d}에 끝나요. 계속하려면 그대로 두고, 결제를 원하지 않으면 Google Play › 정기 결제에서 해지하세요.`, far: (n) => `${n}은(는) 잘 지내고 있고, 쿠션에 당신 자리를 맡아 두었어요. 언제든, 인사만 하러 와도 좋아요 🌱` },
  zh: { trust: "Plus 只增加额外内容：你免费使用的一切仍然免费。", trialNote: "试用结束前 2 天我们会提醒你：在应用内提醒；如果开启了通知，也会发通知。", cardT: "你的 Plus 免费试用", card: (d) => `将于 ${d} 结束。想继续使用什么都不用做；如果不想继续，请在这天之前到 Google Play 取消。如果已经取消了，就没问题。`, manage: "在 Google Play 中管理", notif: (d) => `你的 Plus 免费试用将于 ${d} 结束。想继续就什么都不用做；不想付费，请在 Google Play › 订阅 中取消。`, far: (n) => `${n}一切都好，还在垫子上给你留了位置。随时来看看，哪怕只是打个招呼 🌱` },
  zht: { trust: "Plus 只會增加額外內容：你免費使用的一切仍然免費。", trialNote: "試用結束前 2 天我們會提醒你：在 App 內提醒；如果開啟了通知，也會發送通知。", cardT: "你的 Plus 免費試用", card: (d) => `將於 ${d} 結束。想繼續使用什麼都不用做；如果不想繼續，請在這天之前到 Google Play 取消。如果已經取消了，就沒問題。`, manage: "在 Google Play 中管理", notif: (d) => `你的 Plus 免費試用將於 ${d} 結束。想繼續就什麼都不用做；不想付費，請在 Google Play › 訂閱 中取消。`, far: (n) => `${n}一切都好，還在墊子上幫你留了位子。隨時來看看，就算只是打聲招呼也好 🌱` },
  ru: { trust: "Plus только добавляет новое: всё, чем ты пользуешься бесплатно, остаётся бесплатным.", trialNote: "Мы напомним о конце пробного периода за 2 дня: здесь, в приложении, и уведомлением, если они включены.", cardT: "Твой бесплатный пробный период Plus", card: (d) => `Он заканчивается ${d}. Чтобы продолжить, ничего делать не нужно; если не хочешь, отмени подписку в Google Play до этой даты. Если уже отменил(а), всё в порядке.`, manage: "Управлять в Google Play", notif: (d) => `Бесплатный пробный период Plus заканчивается ${d}. Чтобы продолжить, ничего не делай; чтобы не платить, отмени в Google Play › Подписки.`, far: (n) => `У ${n} всё хорошо, и место на подушке ждёт тебя. Заходи когда захочешь, хотя бы просто поздороваться 🌱` },
  pl: { trust: "Plus dodaje tylko dodatki: wszystko, czego używasz za darmo, zostaje za darmo.", trialNote: "Przypomnimy ci o końcu okresu próbnego 2 dni wcześniej: tutaj w aplikacji i powiadomieniem, jeśli są włączone.", cardT: "Twój darmowy okres próbny Plus", card: (d) => `Kończy się ${d}. Jeśli chcesz zostać, nic nie musisz robić; jeśli nie, anuluj w Google Play przed tą datą. Jeśli okres próbny jest już anulowany, wszystko w porządku.`, manage: "Zarządzaj w Google Play", notif: (d) => `Darmowy okres próbny Plus kończy się ${d}. Aby zostać, nic nie rób; aby nie płacić, anuluj w Google Play › Subskrypcje.`, far: (n) => `${n} ma się dobrze i trzyma dla ciebie miejsce na poduszce. Kiedy zechcesz, choćby tylko na chwilę 🌱` },
  nl: { trust: "Plus voegt alleen extra's toe: alles wat je gratis gebruikt, blijft gratis.", trialNote: "We herinneren je 2 dagen voor het einde van de proefperiode: hier in de app en met een melding als meldingen aanstaan.", cardT: "Je gratis proefperiode van Plus", card: (d) => `Die eindigt op ${d}. Wil je doorgaan, dan hoef je niets te doen; zo niet, zeg dan vóór die datum op in Google Play. Heb je al opgezegd, dan is alles goed.`, manage: "Beheren in Google Play", notif: (d) => `Je gratis proefperiode van Plus eindigt op ${d}. Doorgaan: niets doen; niet betalen: opzeggen in Google Play › Abonnementen.`, far: (n) => `Met ${n} gaat het goed en er is een plekje op het kussen voor je vrij. Wanneer je maar wilt, al is het maar om even hoi te zeggen 🌱` },
  tr: { trust: "Plus yalnızca ekstralar ekler: ücretsiz kullandığın her şey ücretsiz kalır.", trialNote: "Deneme bitmeden 2 gün önce sana hatırlatırız: burada uygulamada ve bildirimler açıksa bildirimle.", cardT: "Ücretsiz Plus denemen", card: (d) => `${d} tarihinde bitiyor. Devam etmek istersen hiçbir şey yapmana gerek yok; istemezsen o tarihten önce Google Play'den iptal et. Zaten iptal ettiysen her şey yolunda.`, manage: "Google Play'de yönet", notif: (d) => `Ücretsiz Plus denemen ${d} tarihinde bitiyor. Devam etmek için bir şey yapmana gerek yok; ödeme yapmamak için Google Play › Abonelikler'den iptal et.`, far: (n) => `${n} iyi ve minderde sana yer ayırıyor. Ne zaman istersen gel, sadece bir merhaba için bile 🌱` }
};
/* testi rivisti dopo il controllo indipendente: promessa senza ambiguita' (gratis senza Plus, non "durante la prova"),
   saluti lontani nel tono confidenziale di ogni lingua, e nella notifica la frase per chi ha gia' disdetto */
const V110_TRUST = { it: "Plus aggiunge solo extra: tutto ciò che è gratis senza Plus resta gratis.", en: "Plus only adds extras: everything that's free without Plus stays free.",
  de: "Plus bringt nur Extras: Alles, was ohne Plus kostenlos ist, bleibt kostenlos.", es: "Plus solo añade extras: todo lo que es gratis sin Plus sigue siendo gratis.",
  fr: "Plus ajoute seulement des extras : tout ce qui est gratuit sans Plus reste gratuit.", pt: "O Plus só acrescenta extras: tudo o que é grátis sem o Plus continua grátis.",
  ja: "Plusは追加の楽しみだけ。Plusなしで無料のものは、これからも無料です。", ko: "Plus는 추가 혜택만 더해요. Plus 없이 무료인 건 앞으로도 무료예요.",
  zh: "Plus 只增加额外内容：不用 Plus 就免费的一切，以后仍然免费。", zht: "Plus 只會增加額外內容：不用 Plus 就免費的一切，以後仍然免費。",
  ru: "Plus только добавляет новое: всё, что бесплатно без Plus, останется бесплатным.", pl: "Plus to tylko dodatki: wszystko, co jest darmowe bez Plus, zostaje darmowe.",
  nl: "Plus voegt alleen extra's toe: alles wat zonder Plus gratis is, blijft gratis.", tr: "Plus yalnızca ekstralar ekler: Plus olmadan ücretsiz olan her şey ücretsiz kalır." };
const V110_NOTIFX = { it: " Se l'hai già disdetta, non devi fare niente.", en: " Already cancelled? Nothing to do.", de: " Schon gekündigt? Dann musst du nichts tun.",
  es: " Si ya la has cancelado, no tienes que hacer nada.", fr: " Si tu as déjà résilié, tu n'as rien à faire.", pt: " Se já cancelou, não precisa fazer nada.",
  ja: " すでに解約していれば、何もしなくて大丈夫です。", ko: " 이미 해지했다면 아무것도 하지 않아도 돼요.", zh: " 如果已经取消，就什么都不用做。", zht: " 如果已經取消，就什麼都不用做。",
  ru: " Если уже отменил(а), ничего делать не нужно.", pl: " Jeśli okres próbny jest już anulowany, nic nie musisz robić.", nl: " Al opgezegd? Dan hoef je niets te doen.",
  tr: " Zaten iptal ettiysen bir şey yapmana gerek yok." };
const V110_FAR2 = { de: (n) => `${n} geht es gut, und auf dem Kissen ist ein Platz für dich frei. Wann immer du magst, auch nur für ein kurzes Hallo 🌱`,
  ru: (n) => `У ${n} всё хорошо, и место на подушке ждёт тебя. Заходи, когда захочешь, хотя бы просто поздороваться 🌱`,
  ja: (n) => `${n}は元気だよ。クッションの席、ちゃんととってあるからね。いつでも、あいさつだけでも来てね 🌱`,
  ko: (n) => `쿠션 위 ${n}의 옆자리는 늘 네 자리예요. 언제든, 인사만 하러 와도 좋아요 🌱`,
  zh: (n) => `${n} 一切都好，还在垫子上给你留了位置。随时来看看，哪怕只是打个招呼 🌱`,
  zht: (n) => `${n} 一切都好，還在墊子上幫你留了位子。隨時來看看，就算只是打聲招呼也好 🌱` };
Object.keys(V110_CARE).forEach((l) => { const c = V110_CARE[l]; c.trust = V110_TRUST[l]; const n0 = c.notif; c.notif = (d) => n0(d) + V110_NOTIFX[l]; if (V110_FAR2[l]) c.far = V110_FAR2[l]; });
const v110Care = () => V110_CARE[S.lang] || V110_CARE.en;
const V110_TRIAL_NID = 210;
const V110_SUBS_URL = "https://play.google.com/store/account/subscriptions?sku=tanetto_plus&package=com.tanettoapp.tanetto";

/* ---------- 1) Plus: fiducia e promemoria della prova ---------- */
const _openPlusV110c = openPlus;
openPlus = function (...a) {
  const r = _openPlusV110c.apply(this, a);
  try {
    const box = document.querySelector(".plusbox");
    if (box && !box.querySelector(".v110trust")) {
      const c = v110Care(); const sub = box.querySelector("h2 + p, h3 + p") || box.querySelector("p");
      const html = `<p class="small v110trust">${esc(c.trust)}</p>`;
      if (sub) sub.insertAdjacentHTML("afterend", html); else box.insertAdjacentHTML("afterbegin", html);
    }
    v110TrialNote();
  } catch (e) { /* niente */ }
  return r;
};
/* la riga sul promemoria compare solo quando il pulsante offre davvero la prova gratuita */
function v110TrialNote() {
  const box = document.querySelector(".plusbox"); if (!box) return;
  const pl = billProducts && billProducts.plans && billProducts.plans[plusPlan];
  const has = !!(isNativeApp() && pl && pl.trialToken && pl.trialDays);
  let n = box.querySelector(".v110trialnote");
  if (!has) { if (n) n.remove(); return; }
  if (!n) { const a = document.getElementById("plusAfterTxt") || box.querySelector("#plusFoot p"); if (!a) return; a.insertAdjacentHTML("afterend", `<p class="small muted v110trialnote">${esc(v110Care().trialNote)}</p>`); }
}
try { new MutationObserver(() => { if (document.querySelector(".plusbox")) v110TrialNote(); }).observe(layer, { childList: true, subtree: true }); } catch (e) { /* niente */ }

/* La prova si riconosce cosi': al tocco su "Prova gratis" si annota che e' partita una prova (giorni e ora); quando Google
   conferma l'abbonamento (subito, al ritorno nell'app o piu' tardi per un pagamento in attesa) la fine prova si calcola
   dall'ora d'acquisto data da Google. Se il rinnovo automatico e' spento (prova disdetta) o Plus non e' piu' attivo,
   niente notifica e niente riquadro. */
document.addEventListener("click", (ev) => {
  const b = ev.target && ev.target.closest && ev.target.closest("#plusGo"); if (!b) return;
  try { const pl = billProducts && billProducts.plans && billProducts.plans[plusPlan]; if (pl && pl.trialToken && pl.trialDays && !S.plusTrialEnd) { S.plusTrialPend = { d: pl.trialDays, at: Date.now() }; save(); } } catch (e) { /* niente */ }
}, true);
function v110TrialFrom(list) {
  let changed = false;
  const subs = (list || []).filter((x) => x && (x.products || []).includes(BILL.SUB) && x.state === "purchased");
  const pend = S.plusTrialPend;
  for (const x of subs) {
    const t = +x.time || 0;
    if (pend && !S.plusTrialEnd && t && Math.abs(t - pend.at) < 864e5) { S.plusTrialEnd = t + pend.d * 864e5; delete S.plusTrialPend; changed = true; }
    if (typeof x.autoRenewing === "boolean" && S.plusAutoRenew !== x.autoRenewing) { S.plusAutoRenew = x.autoRenewing; changed = true; }
  }
  if (pend && !S.plusTrialEnd && Date.now() - pend.at > 864e5) { delete S.plusTrialPend; changed = true; }
  if (S.plusTrialEnd && Date.now() > S.plusTrialEnd + 864e5) { delete S.plusTrialEnd; changed = true; }
  if (changed) save();
  v110TrialSchedule();
  return changed;
}
const _handlePurchasesV110 = handlePurchases;
handlePurchases = async function (list, ...a) {
  const k = await _handlePurchasesV110.call(this, list, ...a);
  try { v110TrialFrom(list); } catch (e) { /* niente */ }
  return k;
};
const _syncPurchasesV110 = syncPurchases;
syncPurchases = async function (...a) {
  const r = await _syncPurchasesV110.apply(this, a);
  try { const p = billPlugin(); if (isNativeApp() && p && (S.plusTrialPend || S.plusTrialEnd)) { const subs = (await p.owned({ type: "subs" })).purchases || []; if (v110TrialFrom(subs) && tab === "today") render(); } } catch (e) { /* niente */ }
  return r;
};
function v110TrialDate() { return S.plusTrialEnd ? fmtDate(dkey(new Date(S.plusTrialEnd))) : ""; }
function v110TrialLive() { return !!(S.plusTrialEnd && S.plusOn && S.plusAutoRenew !== false && isNativeApp()); }
function v110TrialSoon(now = Date.now()) { const e = S.plusTrialEnd; return v110TrialLive() && now >= e - 2 * 864e5 && now < e; }
async function v110TrialSchedule() {
  const p = LN(); if (!isNativeApp() || !p) return;
  try { await p.cancel({ notifications: [{ id: V110_TRIAL_NID }] }); } catch (e) { /* niente */ }
  if (!v110TrialLive()) return;
  const at = new Date(S.plusTrialEnd - 2 * 864e5); at.setHours(10, 0, 0, 0);
  if (at.getTime() < Date.now() + 60000) return;
  const n = { id: V110_TRIAL_NID, title: "Tanetto Plus", body: v110Care().notif(v110TrialDate()), schedule: { at, allowWhileIdle: true }, isExactNotification: false, smallIcon: "ic_stat_tanetto", iconColor: "#4E8A4A" };
  try { if (p.createChannel) { await p.createChannel({ id: NOTIF_CH2, name: L().v12.remT || "Tanetto", importance: 3, visibility: 0, vibration: true }); n.channelId = NOTIF_CH2; } } catch (e) { /* niente */ }
  try { await p.schedule({ notifications: [n] }); } catch (e) { /* notifiche non permesse: resta il riquadro in Oggi */ }
}
function v110TrialCard() {
  if (!v110TrialSoon()) return ""; const c = v110Care();
  return `<div class="card v110trial" role="note"><b>${esc(c.cardT)}</b><p class="small">${esc(c.card(v110TrialDate()))}</p><a class="btn ghost block" id="v110Subs" href="${V110_SUBS_URL}" target="_blank" rel="noopener">${esc(c.manage)}</a></div>`;
}
const _viewTodayV110c = viewToday;
viewToday = function (...a) { const h = _viewTodayV110c.apply(this, a); try { const c = v110TrialCard(); if (c) { trackOnce("prova-plus-promemoria"); return c + h; } } catch (e) { /* niente */ } return h; };

/* ---------- 2) Promemoria: due ultimi saluti lontani e frasi di sola compagnia dopo una frase difficile ---------- */
const V110_PLAN = [0, 1, 2, 3, 5, 7, 9, 13, 29, 59];
const V110_SOFT = [4, 6, 7]; /* frasi della rotazione che non chiedono obiettivi */
notifSchedule = function () {
  if (!isNativeApp()) return Promise.resolve();
  const p = LN(); if (!p) return Promise.resolve();
  const run = async () => {
    const ids = []; for (let i = 0; i < 16; i++) ids.push({ id: NOTIF_ID0 + i }); ids.push({ id: NOTIF_TRIP });
    try { await p.cancel({ notifications: ids }); } catch (e) { /* niente da cancellare */ }
    if (!S.notif || !S.pet) return;
    const t = L(), x = v19n(), c = v110Care(), n = S.petName || ""; const { h, m } = remTimes(); const now = Date.now(); const list = [];
    const tg = todayGoals(); const allDone = tg.length > 0 && tg.every((g) => S.done.includes(g));
    const day0 = Math.floor(new Date(dkey() + "T12:00:00").getTime() / 86400000);
    let msgs = (x && x.msgs) || t.notif.msgs; if (typeof v110VoiceMsgs === "function") msgs = v110VoiceMsgs(msgs); const st = typeof streak === "function" ? streak() : 0;
    const soft = typeof sf110Quiet !== "undefined" && sf110Quiet && msgs.length >= 8;
    V110_PLAN.forEach((off, k) => {
      const d = new Date(); d.setDate(d.getDate() + off); d.setHours(h, m, 0, 0);
      if (d.getTime() < now + 60000) return; if (off === 0 && allDone) return;
      let body = soft ? msgs[V110_SOFT[(day0 + off) % V110_SOFT.length]] : msgs[(day0 + off) % msgs.length];
      body = body.split("{n}").join(n);
      if (off === 0 && st >= 3 && x && !soft) body = x.streak(n, st);
      if (off === 13 && x) body = x.last(n);
      if (off > 13) body = c.far(n);
      list.push({ id: NOTIF_ID0 + k, title: t.v12.remTitle(n), body, schedule: { at: d, allowWhileIdle: true }, isExactNotification: false, smallIcon: "ic_stat_tanetto", iconColor: "#4E8A4A" });
    });
    if (S.away && S.away.until > now + 60000) {
      let place = ""; try { place = destByKey(S.away.dest).name || ""; } catch (e) { place = ""; }
      const title = x && place ? x.trip(n, place) : t.notif.trip(n); const body = x ? x.tripB : t.notif.tripB;
      list.push({ id: NOTIF_TRIP, title, body, schedule: { at: quietShift(S.away.until), allowWhileIdle: true }, isExactNotification: false, smallIcon: "ic_stat_tanetto", iconColor: "#4E8A4A" });
    }
    if (!list.length) return;
    let ch = false; if (p.createChannel) { try { await p.createChannel({ id: NOTIF_CH2, name: t.v12.remT || "Tanetto", importance: 3, visibility: 0, vibration: true }); ch = true; v26OldChannel(p); } catch (e) { ch = false; } }
    if (ch) list.forEach((y) => { y.channelId = NOTIF_CH2; });
    try { await p.schedule({ notifications: list }); } catch (e) { trackOnce("notifiche-errore"); }
  };
  notifBusy = (notifBusy || Promise.resolve()).then(run, run);
  return notifBusy;
};
/* dopo una frase difficile i promemoria gia' programmati vengono riscritti con frasi di sola compagnia */
let v110SoftT = 0;
const _sf110HushV110 = sf110Hush;
sf110Hush = function (...a) {
  const r = _sf110HushV110.apply(this, a);
  try { clearTimeout(v110SoftT); v110SoftT = setTimeout(() => { if (S.notif && typeof notifSchedule === "function") notifSchedule(); }, 1500); } catch (e) { /* niente */ }
  return r;
};
