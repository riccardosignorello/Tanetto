/* =================== 1.0.10 (110): decisioni del proprietario del 16/11/2026 ===================
   1) M-09 (scelta b): i primi due video del giorno danno il regalo di oggi (6-18 Tanì), dal terzo in poi 6 Tanì.
      Il pulsante "+N Tanì" mostra sempre quanto da' il prossimo video. I prezzi degli Introvabili sono in 98zd (XV_PRICE).
   2) D-05: con Plus il regalo del giorno vale il triplo; la parte in piu' (2 volte il regalo) conta come "pagata",
      come i 750 Tanì al mese: Plus non accorcia mai gli Introvabili. */
const V110_AD_FULL = 2, V110_AD_SMALL = 6;
/* video gia' visti oggi (stesso contatore del limite giornaliero: S.adsDay e il registro econ().ads) */
function v110AdsSeen() { const d = dkey(); let n = S.adsDay && S.adsDay.d === d ? S.adsDay.n || 0 : 0; try { n = Math.max(n, econ().ads[d] || 0); } catch (e) { /* niente */ } return n; }
const _adAmountV110 = adAmount;
/* quanto da' il PROSSIMO video (si legge prima di mostrarlo, come fanno tutti i pulsanti) */
adAmount = function (...a) { const full = _adAmountV110.apply(this, a); return v110AdsSeen() >= V110_AD_FULL ? Math.min(full, V110_AD_SMALL) : full; };
/* stima "in circa N giorni": i video degli ultimi 7 giorni contati con la stessa regola (2 pieni, gli altri 6) */
const _dailyTaniGuessV110 = dailyTaniGuess;
dailyTaniGuess = function (...a) {
  const d0 = _dailyTaniGuessV110.apply(this, a);
  try {
    if (typeof adsOn === "function" && adsOn()) {
      const e = econ(); const now = adAmount(), full = _adAmountV110(); let n = 0, v = 0;
      for (let i = 1; i <= 7; i++) { const x = new Date(); x.setDate(x.getDate() - i); const k = Math.min(AD_DOUBLE_MAX, e.ads[dkey(x)] || 0); n += k; v += Math.min(k, V110_AD_FULL) * full + Math.max(0, k - V110_AD_FULL) * Math.min(full, V110_AD_SMALL); }
      return Math.max(1, Math.round(d0 - (n / 7) * now + v / 7));
    }
  } catch (err) { /* la stima resta quella di prima */ }
  return d0;
};
const _openGiftV110 = openGift;
openGift = function (...a) {
  const had = S.giftDay === S.day; const before = S.seeds; const r = _openGiftV110.apply(this, a);
  try {
    if (!had && S.giftDay === S.day && plusActive()) {
      const got = S.seeds - before; const base = econGift(S.visit && S.visit.n); const extra = Math.min(Math.max(0, got - base), got);
      if (extra > 0) { const e = econ(); e.paid = (+e.paid || 0) + extra; save(); }
    }
  } catch (err) { /* niente */ }
  return r;
};

/* 3) G2-10 (decisione del 16/11/2026): l'eta' si inserisce una volta sola, con una conferma, e poi non si cambia piu'.
       Android la conserva nel deposito nativo no-backup, anche dopo "Ricomincia da capo"; il Web usa AGE_KEY locale.
       Prima di salvarla l'app mostra mese, anno ed eta' e chiede conferma. "Preferisco non dirlo" puo' essere sostituito
       in seguito da una risposta, una sola volta; una data di nascita gia' salvata resta immutabile. */
const V110_AGEC = {
  it: ["È giusto?", "Nascita", "Età", "Controlla bene: dopo non si potrà più cambiare.", "Sì, è giusto", "Correggi", "Non si può più cambiare."],
  en: ["Is this right?", "Born", "Age", "Please check: you won't be able to change it later.", "Yes, that's right", "Change it", "It can't be changed."],
  de: ["Stimmt das?", "Geboren", "Alter", "Prüf es gut: Später kannst du es nicht mehr ändern.", "Ja, stimmt", "Korrigieren", "Das lässt sich nicht mehr ändern."],
  es: ["¿Es correcto?", "Nacimiento", "Edad", "Revísalo bien: después no se podrá cambiar.", "Sí, es correcto", "Corregir", "Ya no se puede cambiar."],
  fr: ["C'est bien ça ?", "Naissance", "Âge", "Vérifie bien : tu ne pourras plus le changer ensuite.", "Oui, c'est ça", "Corriger", "Ça ne peut plus être changé."],
  pt: ["Está certo?", "Nascimento", "Idade", "Confira bem: depois não vai dar para mudar.", "Sim, está certo", "Corrigir", "Não dá mais para mudar."],
  ja: ["これで合っていますか？", "生まれ", "年齢", "よく確認してね。あとから変更はできません。", "はい、合っています", "直す", "あとから変更はできません。"],
  ko: ["맞나요?", "출생", "나이", "잘 확인해 주세요. 나중에는 바꿀 수 없어요.", "네, 맞아요", "고치기", "나중에 바꿀 수 없어요."],
  zh: ["这样对吗？", "出生", "年龄", "请仔细确认：之后就不能再修改了。", "对，没错", "修改", "之后不能再修改。"],
  zht: ["這樣對嗎？", "出生", "年齡", "請仔細確認：之後就不能再修改了。", "對，沒錯", "修改", "之後不能再修改。"],
  ru: ["Всё верно?", "Дата рождения", "Возраст", "Проверь внимательно: потом изменить будет нельзя.", "Да, всё верно", "Исправить", "Изменить больше нельзя."],
  pl: ["Czy to się zgadza?", "Data urodzenia", "Wiek", "Sprawdź dokładnie: potem nie będzie można tego zmienić.", "Tak, zgadza się", "Popraw", "Nie można już tego zmienić."],
  nl: ["Klopt dit?", "Geboren", "Leeftijd", "Controleer het goed: later kun je het niet meer veranderen.", "Ja, dat klopt", "Aanpassen", "Dit kan niet meer worden veranderd."],
  tr: ["Doğru mu?", "Doğum", "Yaş", "İyi kontrol et: sonra değiştiremezsin.", "Evet, doğru", "Düzelt", "Artık değiştirilemez."]
};
const v110AgeT = () => V110_AGEC[S.lang] || V110_AGEC.en;
let v110AgeOk = false, v110AgeWant = null;
function v110AgeConfirm(a) {
  const box = document.querySelector(".agebox"); if (!box) return false; const x = v110AgeT(); v110AgeWant = a;
  let d = `${a.m}/${a.y}`; try { d = new Intl.DateTimeFormat(loc(), { month: "long", year: "numeric" }).format(new Date(a.y, a.m - 1, 15)); } catch (e) { /* niente */ }
  const n = ageYears(a); const pet = box.querySelector(".agepet");
  box.innerHTML = `${pet ? pet.outerHTML : ""}<h2 id="agT" tabindex="-1">${esc(x[0])}</h2>
    <p class="v110agec"><b>${esc(x[1])}:</b> ${esc(d)}<br><b>${esc(x[2])}:</b> ${esc(String(n == null ? "?" : Math.max(0, n)))}</p>
    <p class="small">${esc(x[3])}</p>
    <button class="btn block" id="ageOk" type="button">${esc(x[4])}</button><button class="link" id="ageFix" type="button">${esc(x[5])}</button>`;
  try { const h = document.getElementById("agT"); if (h) h.focus({ preventScroll: true }); } catch (e) { /* niente */ }
  return true;
}
const _ageSetV110 = ageSet;
ageSet = function (a, ...r) {
  const current = typeof AGE_VALUE !== "undefined" ? AGE_VALUE : null;
  if (current && !current.skip && current.y &&
      (!a || a.skip || a.y !== current.y || a.m !== current.m)) {
    try { toast(v110AgeT()[6]); } catch (e) { /* niente */ }
    return;
  }
  const sameSavedChoice = current && !current.skip && a && !a.skip && a.y === current.y && a.m === current.m;
  if (a && !a.skip && a.y && !v110AgeOk && !sameSavedChoice && v110AgeConfirm(a)) return;
  v110AgeOk = false; v110AgeWant = null; return _ageSetV110.call(this, a, ...r);
};
document.addEventListener("click", (ev) => {
  const b = ev.target.closest && ev.target.closest("#ageOk, #ageFix"); if (!b) return;
  ev.stopImmediatePropagation(); const a = v110AgeWant; if (!a) return;
  if (b.id === "ageOk") { v110AgeOk = true; ageSet(a); return; }
  const f = ageAfter; openAge(f); v110AgeWant = null;
  try { const m = document.getElementById("ageM"), y = document.getElementById("ageY"), g = document.getElementById("ageGo"); m.value = String(a.m); y.value = String(a.y); if (g) g.disabled = false; } catch (e) { /* niente */ }
}, true);
/* ripristino da file, codice o backup online: subito l'eta' di questo telefono (non si aspetta il controllo ogni 1,2 s) */
function v110AgeKeep() { try { return typeof ageInit === "function" ? ageInit() : Promise.resolve(false); } catch (e) { return Promise.resolve(false); } }
/* L'eta' resta nel deposito locale del telefono: ripristinare i progressi non la modifica. */
if (typeof restoreFrom === "function") { const _a = restoreFrom; restoreFrom = function (...a) { const r = _a.apply(this, a); v110AgeKeep(); return r; }; }
if (typeof applyCloud === "function") { const _a = applyCloud; applyCloud = function (...a) { const r = _a.apply(this, a); v110AgeKeep(); return r; }; }
/* =================== 4) Controllo finale 1.0.10: piccole cose ===================
   a) "Memoria del telefono piena" (M-08): l'avviso arriva dopo quello dell'azione, resta 7 secondi senza essere coperto
      e si ripete al massimo ogni 10 minuti finche' il salvataggio non riesce di nuovo. */
let v110StickyUntil = 0, v110FullAt = 0;
const _toastV110 = toast;
toast = function (msg, ...a) {
  /* i messaggi aspettano la fine del respiro (la regola di 98f era stata scavalcata dall'avviso per i lettori di schermo, 98zk) */
  try { if (document.querySelector(".nvbreath.running")) { const iv = setInterval(() => { if (!document.querySelector(".nvbreath.running")) { clearInterval(iv); toast(msg, ...a); } }, 400); return; } } catch (e) { /* niente */ }
  const w = v110StickyUntil - Date.now(); if (w > 0) { setTimeout(() => toast(msg, ...a), w + 200); return; }
  return _toastV110.call(this, msg, ...a);
};
function v110FullWarn() {
  try {
    const el = document.getElementById("toast"); if (!el) return;
    el.textContent = L().v26.full; el.hidden = false; v110StickyUntil = Date.now() + 7000;
    clearTimeout(toastTimer); toastTimer = setTimeout(() => { el.hidden = true; }, 7000);
  } catch (e) { /* niente */ }
}
const _saveV110 = save;
save = function (...a) {
  const r = _saveV110.apply(this, a);
  try { if (!secSaveOk && Date.now() - v110FullAt > 600000) { v110FullAt = Date.now(); setTimeout(v110FullWarn, 1500); } } catch (e) { /* niente */ }
  return r;
};
/* b) lettore di schermo: la barra in basso si chiama "Menu" nella lingua dell'app; Tanì e livello cominciano con il testo
      che si vede (WCAG 2.5.3, chi usa i comandi vocali dice quello che legge) */
const V110_MENU = { it: "Menu", en: "Menu", de: "Menü", es: "Menú", fr: "Menu", pt: "Menu", ja: "メニュー", ko: "메뉴", zh: "菜单", zht: "選單", ru: "Меню", pl: "Menu", nl: "Menu", tr: "Menü" };
function v110Labels() {
  try {
    const tb = document.getElementById("tabs"); if (tb) tb.setAttribute("aria-label", V110_MENU[S.lang] || "Menu");
    const sp = document.getElementById("seedPill"), sn = document.getElementById("seedN"), t = L();
    if (sp && sn && sp.tagName === "BUTTON") sp.setAttribute("aria-label", `${sn.textContent} Tanì: ${(t.tani && t.tani.shopT) || ""}`.replace(/:\s*$/, ""));
    const lv = document.getElementById("lvBtn");
    if (lv) { const v = (lv.textContent || "").replace(/\s+/g, " ").trim(); const base = lv.getAttribute("aria-label") || ""; if (v && !base.startsWith(v)) lv.setAttribute("aria-label", base ? `${v}, ${base}` : v); }
  } catch (e) { /* niente */ }
}
const _renderV110 = render;
render = function (...a) { const r = _renderV110.apply(this, a); v110Labels(); return r; };
/* c) licenze: le due frasi iniziali nella lingua dell'app (i testi delle licenze restano quelli originali, in inglese) */
const V110_LIC = {
  it: "Tanetto è costruito con questi componenti open source. Grazie a tutte le persone che li hanno creati.",
  en: "Tanetto is built with these open-source components. Thank you to everyone who made them.",
  de: "Tanetto ist mit diesen Open-Source-Komponenten gebaut. Danke an alle, die sie geschaffen haben.",
  es: "Tanetto está hecho con estos componentes de código abierto. Gracias a todas las personas que los crearon.",
  fr: "Tanetto est construit avec ces composants open source. Merci à toutes les personnes qui les ont créés.",
  pt: "O Tanetto é feito com estes componentes de código aberto. Obrigado a todas as pessoas que os criaram.",
  ja: "Tanettoは、次のオープンソースのコンポーネントで作られています。作ってくださったすべての方に感謝します。",
  ko: "Tanetto는 다음 오픈 소스 구성 요소로 만들어졌어요. 만들어 주신 모든 분께 감사드려요.",
  zh: "Tanetto 使用了以下开源组件。感谢所有创造它们的人。",
  zht: "Tanetto 使用了以下開放原始碼元件。感謝所有創造它們的人。",
  ru: "Tanetto создано с помощью этих компонентов с открытым исходным кодом. Спасибо всем, кто их создал.",
  pl: "Tanetto powstało z użyciem tych komponentów open source. Dziękujemy wszystkim, którzy je stworzyli.",
  nl: "Tanetto is gemaakt met deze opensourceonderdelen. Dank aan iedereen die ze heeft gemaakt.",
  tr: "Tanetto bu açık kaynak bileşenlerle yapıldı. Onları yapan herkese teşekkürler."
};
try { new MutationObserver(() => { const b = layer.querySelector(".v26lic"); if (!b || b.dataset.v110) return; b.dataset.v110 = "1";
  const p = [...b.querySelectorAll("p.muted")].find((x) => /open-source components/.test(x.textContent)); if (p) p.textContent = V110_LIC[S.lang] || V110_LIC.en; }).observe(layer, { childList: true, subtree: true }); } catch (e) { /* niente */ }
/* d) eta': "resta su questo telefono" dice anche del backup di Android (come l'informativa) */
const V110_AGEBK = {
  it: [" (e nel backup di Android, se è attivo)", " Se il backup di Android è attivo, sono salvati anche lì."],
  en: [" (and in your Android backup, if it's on)", " If Android backup is on, they're saved there too."],
  de: [" (und in der Android-Sicherung, wenn sie eingeschaltet ist)", " Wenn die Android-Sicherung eingeschaltet ist, werden sie auch dort gespeichert."],
  es: [" (y en la copia de seguridad de Android, si está activada)", " Si la copia de seguridad de Android está activada, también se guardan allí."],
  fr: [" (et dans la sauvegarde Android, si elle est activée)", " Si la sauvegarde Android est activée, ils y sont aussi enregistrés."],
  pt: [" (e no backup do Android, se estiver ativado)", " Se o backup do Android estiver ativado, eles também ficam salvos lá."],
  ja: ["（Androidのバックアップがオンなら、そこにも保存されます）", "Androidのバックアップがオンなら、そこにも保存されます。"],
  ko: [" (Android 백업이 켜져 있으면 백업에도 저장돼요)", " Android 백업이 켜져 있으면 백업에도 저장돼요."],
  zh: ["（如果开启了 Android 备份，也会保存在备份中）", "如果开启了 Android 备份，也会保存在备份中。"],
  zht: ["（如果開啟了 Android 備份，也會儲存在備份中）", "如果開啟了 Android 備份，也會儲存在備份中。"],
  ru: [" (и в резервной копии Android, если она включена)", " Если включено резервное копирование Android, они сохраняются и там."],
  pl: [" (i w kopii zapasowej Androida, jeśli jest włączona)", " Jeśli kopia zapasowa Androida jest włączona, są zapisywane także tam."],
  nl: [" (en in je Android-back-up, als die aanstaat)", " Als Android-back-up aanstaat, worden ze daar ook bewaard."],
  tr: [" (Android yedeklemesi açıksa yedekte de)", " Android yedeklemesi açıksa orada da saklanır."]
};
Object.keys(V110_AGEBK).forEach((l) => {
  try {
    const a = AGE_T[l]; const [paren, sent] = V110_AGEBK[l];
    if (a && typeof a.P === "string" && !a.P.includes(paren.trim())) { const m = /[.。]\s*$/.exec(a.P); a.P = m ? a.P.slice(0, m.index) + paren + a.P.slice(m.index) : a.P + paren; }
    const v = V23[l]; if (v && typeof v.ageYes === "string" && !v.ageYes.includes(sent.trim())) v.ageYes = v.ageYes + sent;
  } catch (e) { /* niente */ }
});

/* =================== 5) Chat e diario: mai allegri "a caso" e aiuto sempre a un tocco ===================
   Nessun elenco di frasi riconosce tutto. Per questo:
   a) quando Germo non capisce una frase risponde solo con calma ("Ti ascolto. Me ne racconti di piu'?" / "non sono sicuro
      di aver capito, ma sono qui con te"), mai con "Capito! Sai che..." o "Mi piace quando mi scrivi";
   b) in chat e nel diario c'e' sempre "Hai bisogno di aiuto?": apre la scheda con i numeri del Paese (si toccano per
      chiamare), senza dover scrivere niente. */
Object.keys(T).forEach((l) => { try { const d = T[l].chat && T[l].chat.R && T[l].chat.R.default; if (Array.isArray(d) && d.length === 4) T[l].chat.R.default = [d[0], d[3]]; } catch (e) { /* niente */ } });
function v110HelpBtn(id) { const t = L(); return `<button class="link v110help" id="${id}" type="button">${esc(t.helpT)}</button>`; }
if (typeof openChat === "function") {
  const _a = openChat;
  openChat = function (...a) { const r = _a.apply(this, a); try { const n = layer.querySelector(".chatbox .chnote"); if (n && !layer.querySelector("#v110ChatHelp")) n.insertAdjacentHTML("afterend", v110HelpBtn("v110ChatHelp")); } catch (e) { /* niente */ } return r; };
}
try { new MutationObserver(() => { try { const f = document.getElementById("v110Free") || document.getElementById("diaryForm"); if (f && !document.getElementById("v110DiaryHelp")) f.insertAdjacentHTML("afterend", v110HelpBtn("v110DiaryHelp")); } catch (e) { /* niente */ } }).observe(document.getElementById("app"), { childList: true, subtree: true }); } catch (e) { /* niente */ }
document.addEventListener("click", (ev) => {
  const b = ev.target.closest && ev.target.closest("#v110ChatHelp, #v110DiaryHelp"); if (!b) return; ev.stopImmediatePropagation();
  try { if (b.id === "v110ChatHelp") { const box = layer.querySelector(".chatbox .v26sos"); if (box) { box.scrollIntoView({ block: "nearest" }); return; } } v26HelpSheet(1); } catch (e) { /* niente */ }
}, true);

/* =================== 6) Testo grande (caratteri di sistema 130-200%): parole intere ===================
   Nella barra in basso e sulle etichette "INTROVABILE" una parola non si spezza a meta' e non esce dal pulsante: se non ci
   sta, il carattere si rimpicciolisce un poco (mai sotto 9 px), solo per quella parola. */
function v110FitOne(el, box, minPx) {
  try {
    el.style.fontSize = ""; let fs = parseFloat(getComputedStyle(el).fontSize) || 12; let n = 0;
    const fits = () => { if (box === el) return el.scrollWidth <= el.clientWidth + 1; const bw = box.clientWidth - 4; return el.scrollWidth <= bw + 1 && el.getBoundingClientRect().width <= box.getBoundingClientRect().width - 2 && new Set([...el.getClientRects()].map((q) => Math.round(q.top))).size <= Math.max(1, el.textContent.trim().split(/\s+/).length); };
    while (!fits() && fs > minPx && n < 40) { fs -= 0.5; el.style.fontSize = fs + "px"; n++; }
  } catch (e) { /* niente */ }
}
function v110Fit() {
  try {
    document.querySelectorAll("#tabsIn .tab > span:not(.ic)").forEach((s) => { s.style.wordBreak = "keep-all"; s.style.overflowWrap = "normal"; s.style.hyphens = "none"; v110FitOne(s, s.closest(".tab"), 9); });
    document.querySelectorAll("#app .rar").forEach((r) => { if (r.scrollWidth > r.clientWidth + 1) v110FitOne(r, r, 8); });
  } catch (e) { /* niente */ }
}
const _renderV110f = render;
render = function (...a) { const r = _renderV110f.apply(this, a); requestAnimationFrame(() => { try { v110Fit(); } catch (e) { /* niente */ } }); return r; }; /* 1.0.10: dopo il primo disegno, non prima */
window.addEventListener("resize", () => { clearTimeout(window.__v110ft); window.__v110ft = setTimeout(v110Fit, 120); });

/* =================== 7) "Condividi il tuo Germo": la foto anche in formato storia (9:16) ===================
   Crescita come Finch: chi usa l'app mostra il proprio compagno. Nella finestra "Foto" si sceglie tra la foto (come prima)
   e la storia 1080x1920, pronta per TikTok, Instagram e WhatsApp: nome del compagno grande, la stanza com'e' adesso,
   il nome Tanetto. Il testo condiviso porta gia' il link alla scheda di Google Play (shareImage, 97l). Niente dati personali:
   solo il nome scelto per il compagno; tutto avviene sul telefono e si condivide solo se lo si sceglie. I contenuti importanti
   stanno nella fascia centrale (in alto e in basso TikTok e Instagram mettono i loro pulsanti). */
const V110_PH = {
  it: ["Foto", "Storia"], en: ["Photo", "Story"], de: ["Foto", "Story"], es: ["Foto", "Historia"], fr: ["Photo", "Story"], pt: ["Foto", "Story"],
  ja: ["写真", "ストーリー"], ko: ["사진", "스토리"], zh: ["照片", "竖屏"], zht: ["照片", "直式"], ru: ["Фото", "Сторис"], pl: ["Zdjęcie", "Relacja"],
  nl: ["Foto", "Story"], tr: ["Fotoğraf", "Hikâye"]
};
let v110PhotoUrl = null;
async function v110StoryUrl() {
  const t = L();
  let roomS = roomSVG({ ph: phase(), pet: S.pet, e: S.lightsOff ? "assonnato" : "felice", hat: S.hat, st: stage(), furn: S.furn, wall: S.wall, away: false, glow: 0.95, label: "", season: season().id, dark: S.lightsOff });
  roomS = roomS.replace('<svg viewBox="0 0 360 300"', '<svg x="72" y="560" width="936" height="780" viewBox="0 0 360 300"');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920" viewBox="0 0 1080 1920"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F7F1E6"/><stop offset="1" stop-color="#E7DAC3"/></linearGradient><clipPath id="r"><rect x="72" y="560" width="936" height="780" rx="56"/></clipPath></defs><rect width="1080" height="1920" fill="url(#g)"/><rect x="62" y="566" width="956" height="790" rx="60" fill="#000" opacity=".10"/><g clip-path="url(#r)">${roomS}</g></svg>`;
  const img = await loadImg("data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg));
  try { await document.fonts.load('600 96px "Fredoka"'); await document.fonts.load('500 40px "Figtree"'); } catch (e) { /* niente */ }
  const cv = document.createElement("canvas"); cv.width = 1080; cv.height = 1920; const c = cv.getContext("2d"); c.drawImage(img, 0, 0);
  c.textAlign = "center";
  const fit = (txt, font, max, start) => { let s = start; c.font = font.replace("{s}", s); while (c.measureText(txt).width > max && s > 28) { s -= 2; c.font = font.replace("{s}", s); } };
  /* nome nell'immagine: per i non adulti sempre il nome normale del compagno (nessuno mette per sbaglio il proprio nome) */
  const def = ((t.pets || {})[S.pet] || [])[0] || ""; const name = String((!v26Young() ? S.petName : def) || def || S.petName || "");
  c.fillStyle = "#2F2A26"; fit(name, '600 {s}px "Fredoka", "Trebuchet MS", Arial, sans-serif', 900, 104); c.fillText(name, 540, 470);
  /* una sola volta "Tanetto" e sotto dove trovarlo: Instagram e TikTok spesso non tengono il testo condiviso */
  c.fillStyle = "#2F7A3D"; c.font = '600 92px "Fredoka", "Trebuchet MS", Arial, sans-serif'; c.fillText("Tanetto", 540, 1500);
  const gp = V110_GP[S.lang] || V110_GP.en; c.fillStyle = "#5E564F"; fit(gp, '500 {s}px "Figtree", "Segoe UI", Arial, sans-serif', 900, 46); c.fillText(gp, 540, 1580);
  return cv.toDataURL("image/png");
}
const V110_GP = { it: "su Google Play", en: "on Google Play", de: "bei Google Play", es: "en Google Play", fr: "sur Google Play", pt: "no Google Play", ja: "Google Playで配信中",
  ko: "Google Play에서 만나요", zh: "在 Google Play 下载", zht: "在 Google Play 下載", ru: "в Google Play", pl: "w Google Play", nl: "op Google Play", tr: "Google Play'de" };
/* la storia per i social: dai 13 anni in su (sotto i 13 e con l'eta' non detta niente pulsante, come "Invita un amico") */
const v110StoryOk = () => { try { return typeof ageBand === "function" && (ageBand() === "adult" || ageBand() === "teen"); } catch (e) { return false; } };
function v110PhotoChips() {
  const out = document.getElementById("phOut"); const im = document.getElementById("photoImg"); if (!out || !im || out.querySelector(".v110ph") || !v110StoryOk()) return;
  v110PhotoUrl = im.src; const x = V110_PH[S.lang] || V110_PH.en;
  out.insertAdjacentHTML("afterbegin", `<div class="tabsx v110ph" role="tablist"><button role="tab" type="button" data-v110ph="photo" aria-selected="true">${esc(x[0])}</button><button role="tab" type="button" data-v110ph="story" aria-selected="false">${esc(x[1])}</button></div>`);
}
if (typeof takePhoto === "function") {
  const _a = takePhoto;
  takePhoto = async function (...a) { const r = await _a.apply(this, a); try { v110PhotoChips(); } catch (e) { /* niente */ } return r; };
}
document.addEventListener("click", async (ev) => {
  const b = ev.target.closest && ev.target.closest("[data-v110ph]"); if (!b) return; ev.stopImmediatePropagation();
  const out = document.getElementById("phOut"); const im = document.getElementById("photoImg"); if (!out || !im) return;
  const story = b.dataset.v110ph === "story"; out.querySelectorAll("[data-v110ph]").forEach((x) => x.setAttribute("aria-selected", String(x === b)));
  try {
    im.src = story ? await v110StoryUrl() : v110PhotoUrl || im.src; im.classList.toggle("v110story", story);
    const nm = story ? "tanetto-storia.png" : "tanetto-foto.png"; out.querySelectorAll("[data-saveimg], [data-shareimg]").forEach((x) => { if (x.dataset.saveimg) x.dataset.saveimg = nm; if (x.dataset.shareimg) x.dataset.shareimg = nm; });
    trackOnce(story ? "foto-storia" : "foto-classica");
  } catch (e) { /* resta la foto di prima */ }
}, true);
/* testo che accompagna foto e storia: link a Google Play con l'origine (utm_source=share_germo, si legge in Play Console)
   e l'hashtag #tanettoapp, cosi' chi pubblica e chi guarda ritrova Tanetto */
let v110ShareName = "";
document.addEventListener("click", (ev) => { const b = ev.target.closest && ev.target.closest("[data-shareimg]"); v110ShareName = b ? b.dataset.shareimg || "" : ""; }, true);
if (typeof shareImage === "function") {
  const _a = shareImage;
  shareImage = async function (url, name, ...r) {
    if (!v110StoryOk()) return _a.call(this, url, name, ...r); /* bambini ed eta' non detta: condivisione di prima, senza link ne' hashtag */
    const nm = name || v110ShareName;
    if (!/^tanetto-(storia|foto)\.png$/.test(nm)) return _a.call(this, url, name, ...r);
    const t = L();
    try {
      const blob = await (await fetch(url)).blob(); const file = new File([blob], nm, { type: blob.type || "image/png" });
      const link = (typeof isNativeApp === "function" && isNativeApp()) ? PLAY_URL + "&referrer=utm_source%3Dshare_germo%26utm_campaign%3D" + (nm.includes("storia") ? "storia" : "foto") : SITE_URL + "?src=share_germo";
      const text = `${t.shareText} · ${link} #tanettoapp`;
      const p = typeof sharePlugin === "function" ? sharePlugin() : null;
      if (p && typeof isNativeApp === "function" && isNativeApp()) { const data = await blobB64(blob); await p.share({ data, name: nm, mime: blob.type || "image/png", text, title: "Tanetto" }); trackOnce(nm.includes("storia") ? "condivisione-storia" : "condivisione-foto"); return true; }
      if (navigator.canShare && navigator.canShare({ files: [file] })) { await navigator.share({ files: [file], title: "Tanetto", text }); trackOnce(nm.includes("storia") ? "condivisione-storia" : "condivisione-foto"); return true; }
    } catch (e) { if (e && e.name === "AbortError") return true; }
    return _a.call(this, url, name, ...r);
  };
}

/* =================== 8) "Valuta Tanetto" nella scheda Informazioni (solo adulti) ===================
   Google chiede di non mettere un pulsante che apre la finestra di recensione (potrebbe non comparire): questo apre la pagina
   di Tanetto su Google Play, dove si lascia il voto. Nessuna domanda prima ("Ti piace l'app?"), vietata da Google. */
const V110_RATE = { it: "Valuta Tanetto su Google Play", en: "Rate Tanetto on Google Play", de: "Tanetto bei Google Play bewerten", es: "Valora Tanetto en Google Play",
  fr: "Noter Tanetto sur Google Play", pt: "Avalie o Tanetto no Google Play", ja: "Google PlayでTanettoを評価する", ko: "Google Play에서 Tanetto 평가하기",
  zh: "在 Google Play 上为 Tanetto 评分", zht: "在 Google Play 上為 Tanetto 評分", ru: "Оценить Tanetto в Google Play", pl: "Oceń Tanetto w Google Play",
  nl: "Beoordeel Tanetto op Google Play", tr: "Tanetto'yu Google Play'de değerlendir" };
const _viewMoreV110r = viewMore;
viewMore = function (...a) {
  const h = _viewMoreV110r.apply(this, a);
  try {
    if (!S.pet || h.indexOf('id="v110Rate"') >= 0 || v26Young() || !(typeof isNativeApp === "function" && isNativeApp())) return h;
    const tpl = document.createElement("template"); tpl.innerHTML = h; const lic = tpl.content.querySelector("#v26Lic"); if (!lic) return h;
    lic.insertAdjacentHTML("beforebegin", `<a class="btn ghost block" id="v110Rate" href="${PLAY_URL}" target="_blank" rel="noopener">${esc(V110_RATE[S.lang] || V110_RATE.en)}</a>`);
    return tpl.innerHTML;
  } catch (e) { return h; }
};
document.addEventListener("click", (ev) => { const b = ev.target.closest && ev.target.closest("#v110Rate"); if (b) { try { trackOnce("valuta-da-profilo"); } catch (e) { /* niente */ } } }, true);
