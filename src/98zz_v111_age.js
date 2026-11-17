/* =================== 1.0.11 (18/11/2026): pubblico dai 13 anni in su, modalita' protetta completa ===================
   Decisione del proprietario: pubblico dichiarato su Play Console 13-15, 16-17, 18+. Chi indica meno di 13 anni, chi preferisce
   non dirlo e chi non ha ancora risposto (ageKid(), 98zf) usa l'app in modalita' protetta. Gia' presenti prima di questo
   file: niente video con premio e niente modulo degli annunci (97zn adsKid, AdsPlugin.java: niente SDK, niente ID pubblicita'),
   dal 18/11/2026 solo per chi dichiara meno di 13 anni (chi non dice l'eta' ha i video, mai personalizzati: 98zf ageAds),
   niente statistiche (98zk v26StatsOn), niente account ne' backup online (98zf ageCloudOk), niente spinte all'acquisto
   (98zf, 98zi, 98zj, 98zk), niente richiesta di recensione (98zk), niente "Invita un amico" nel momento "tutto fatto" (98zk).
   Mancava (verifica 1.0.11, punto 3):
   1) CONDIVISIONE FUORI DALL'APP: l'invito in Profilo, "Condividi" di foto, cartoline, livello, record, giardino, trofei e della
      scheda del ritorno funzionavano anche per i bambini (con il link a Google Play). Ora per loro nessuna condivisione: le
      immagini si possono solo salvare sul telefono. Controllo su tutte le strade (shareImage, gr20Send, inviteFlow,
      navigator.share) e i pulsanti di condivisione non si vedono (classe a111kid su <html>, 11zq_v111_age.css).
   2) PROVA GRATUITA DI PLUS: e' un'offerta di Google Play; per loro non si propone (Plus resta acquistabile al prezzo normale,
      con "Chiedi sempre a un adulto"). Se l'eta' poi risulta da ragazzo o adulto, la prova torna.
   3) Schermata dell'eta': nota neutra (A111.note in 3zzn_v111_audience.js), senza "per tutte le eta'" e senza dire che serve
      una certa eta' (Play Console Help, "Neutral age screen"). */
/* 1.0.11 (18/11/2026): ageKid() e non piu' ageAds() === "child": da quando chi non dice l'eta' ha i video con premio (98zf, uscita da
   Families), ageAds() per lui vale "teen", ma la modalita' protetta per lui resta (sotto i 13 anni dichiarati o eta' non detta) */
function a111Kid() { try { return typeof ageKid !== "function" || ageKid(); } catch (e) { return true; } }
function a111Mark() { try { document.documentElement.classList.toggle("a111kid", a111Kid()); } catch (e) { /* niente */ } }

/* ---------- schermata dell'eta': nota neutra ---------- */
try { Object.keys(A111).forEach((l) => { if (AGE_T[l] && A111[l].note) AGE_T[l].note = A111[l].note; }); } catch (e) { /* niente */ }

/* ---------- 1) niente condivisione fuori dall'app ---------- */
if (typeof shareImage === "function") { const _a = shareImage; shareImage = async function (...a) { if (a111Kid()) return true; return _a.apply(this, a); }; }
if (typeof gr20Send === "function") { const _a = gr20Send; gr20Send = async function (...a) { if (a111Kid()) return "none"; return _a.apply(this, a); }; }
if (typeof inviteFlow === "function") { const _a = inviteFlow; inviteFlow = function (...a) { if (a111Kid()) { inviteMode = false; return; } return _a.apply(this, a); }; }
if (typeof inviteCard === "function") { const _a = inviteCard; inviteCard = function (...a) { if (a111Kid()) return ""; return _a.apply(this, a); }; }
if (typeof imgButtons === "function") {
  const _a = imgButtons;
  imgButtons = function (...a) { const h = _a.apply(this, a); if (!a111Kid() || typeof h !== "string") return h; return h.replace(/<button[^>]*data-shareimg=[^>]*>[\s\S]*?<\/button>/, ""); };
}
/* ultima rete: qualsiasi altra strada che usi la condivisione del sistema (anche di versioni future) per loro si ferma qui */
try {
  if (navigator.share) {
    const _s = navigator.share.bind(navigator);
    const f = function (...a) { if (a111Kid()) return Promise.reject(new DOMException("protected", "AbortError")); return _s(...a); };
    Object.defineProperty(navigator, "share", { configurable: true, writable: true, value: f });
  }
} catch (e) { /* niente */ }
/* finestre che restano (record, giardino, trofei): il pulsante d'ingresso dice "Salva", la finestra pure, senza "Condividi" nel testo */
const A111_SAVE_IDS = ["shareRecord", "shareGarden", "trShare"];
function a111Labels(root) {
  if (!a111Kid() || !root || !root.querySelectorAll) return;
  const s = L().saveImg; if (!s) return;
  A111_SAVE_IDS.forEach((id) => root.querySelectorAll("#" + id).forEach((b) => {
    if (b.dataset.a111) return; b.dataset.a111 = "1";
    const sp = b.querySelector("span"); if (sp) sp.textContent = s; else if (!b.children.length) b.textContent = s;
    else { const tn = [...b.childNodes].reverse().find((n) => n.nodeType === 3 && n.textContent.trim()); if (tn) tn.textContent = s; }
  }));
  const sh = root.querySelector && root.querySelector("#shT"); if (sh && !sh.dataset.a111) { sh.dataset.a111 = "1"; sh.textContent = s; }
  /* foglio delle cartoline (98i): resta solo "Salva", il titolo lo dice */
  const g = root.querySelector && root.querySelector(".gr20box #gr20T"); if (g && !g.dataset.a111 && g.closest(".gr20box").querySelector("#gr20Save")) { g.dataset.a111 = "1"; g.textContent = s; }
  const m = root.querySelector && root.querySelector("#shMsg"); if (m && m.textContent === L().saveHint) m.textContent = "";
}
try { new MutationObserver(() => { if (document.documentElement.classList.contains("a111kid")) a111Labels(document.body); }).observe(document.body, { childList: true, subtree: true }); } catch (e) { /* niente */ }

/* ---------- 2) niente prova gratuita di Plus ---------- */
function a111Trial() {
  try {
    const p = typeof billProducts !== "undefined" && billProducts && billProducts.plans; if (!p) return; const kid = a111Kid();
    Object.values(p).forEach((pl) => {
      if (!pl || typeof pl !== "object") return;
      if (!Object.prototype.hasOwnProperty.call(pl, "a111t")) { pl.a111t = pl.trialToken; pl.a111d = pl.trialDays; }
      pl.trialToken = kid ? null : pl.a111t; pl.trialDays = kid ? 0 : pl.a111d;
    });
  } catch (e) { /* niente */ }
}
if (typeof loadProducts === "function") { const _a = loadProducts; loadProducts = function (...a) { const r = _a.apply(this, a); a111Trial(); return r && r.then ? r.then((o) => { a111Trial(); return o; }) : r; }; }

/* sito (niente prezzi di Google Play): il pulsante di Plus scritto in partenza diceva la prova gratuita; per loro solo "Abbonati" */
function a111PlusWeb() {
  try {
    if (!a111Kid() || (typeof billProducts !== "undefined" && billProducts)) return;
    const go = document.getElementById("plusGo"), a = document.getElementById("plusAfterTxt"), v = L().v13; if (!go || !v) return;
    go.textContent = v.subscribe; if (a) a.textContent = "";
  } catch (e) { /* niente */ }
}
if (typeof openPlus === "function") { const _a = openPlus; openPlus = function (...a) { const r = _a.apply(this, a); a111PlusWeb(); return r; }; }
document.addEventListener("click", (ev) => { const b = ev.target.closest && ev.target.closest("[data-plan]"); if (b) setTimeout(a111PlusWeb, 0); });

/* ---------- 3) niente inviti a Plus (1.0.11, 10/10) ----------
   In modalita' protetta spariscono la scheda "Scopri Tanetto Plus" in cima al profilo, la proposta di Plus che si apre da sola
   (98f) e il pulsante di Plus dell'albero di Natale (98d). Tanetto Plus resta raggiungibile da Profilo > Acquisti e Plus, con un
   pulsante neutro ("Tanetto Plus") e il suo avviso per gli adulti; i contenuti di Plus restano segnati col lucchetto come prima. */
const A111_PROMO = "button#plusCard, #xmPlusGo, .nvplus";
function a111NoPromo(root) {
  if (!a111Kid() || !root || !root.querySelectorAll) return;
  root.querySelectorAll(A111_PROMO).forEach((el) => { const o = el.classList.contains("nvplus") && el.closest(".overlay"); (o || el).remove(); });
}
if (typeof viewMore === "function") { const _a = viewMore; viewMore = function (...a) { const h = _a.apply(this, a); if (!a111Kid() || typeof h !== "string") return h; return h.replace(/<button class="pluscard" id="plusCard">[\s\S]*?<\/button>/g, ""); }; }
if (typeof psBuyCards === "function") { const _a = psBuyCards; psBuyCards = function (...a) { if (!a111Kid()) return _a.apply(this, a); const h = _a.call(this, null); return typeof h === "string" ? h.replace(/<p class="small muted"><\/p>/, "").replace('btn block gold" id="psPlus"', 'btn block ghost" id="psPlus"') : h; }; }
if (typeof nav20plusDue === "function") { const _a = nav20plusDue; nav20plusDue = function (...a) { if (a111Kid()) return false; return _a.apply(this, a); }; }
if (typeof nav20plusOffer === "function") { const _a = nav20plusOffer; nav20plusOffer = function (...a) { if (a111Kid()) return; return _a.apply(this, a); }; }
try { new MutationObserver(() => { if (document.documentElement.classList.contains("a111kid")) a111NoPromo(document.body); }).observe(document.body, { childList: true, subtree: true }); } catch (e) { /* niente */ }

/* ---------- l'eta' cambia (risposta data, "Preferisco non dirlo" poi detta): tutto si riallinea ---------- */
if (typeof ageSet === "function") { const _a = ageSet; ageSet = function (...a) { const r = _a.apply(this, a); a111Mark(); a111Trial(); return r; }; }
if (typeof render === "function") { const _a = render; render = function (...a) { a111Mark(); a111Trial(); return _a.apply(this, a); }; }
/* dopo ogni disegno: via subito gli inviti a Plus (anche dove il profilo li ricompone, 98zh) */
if (typeof render === "function") { const _a = render; render = function (...a) { const r = _a.apply(this, a); try { a111NoPromo(document.body); } catch (e) { /* niente */ } return r; }; }
a111Mark();
