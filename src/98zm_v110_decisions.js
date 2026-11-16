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

/* 3) G2-10 (decisione del 16/11/2026): l'eta' si inserisce una volta sola, con una conferma, e poi non si cambia piu'
      (nemmeno con "Ricomincia da capo": la copia locale AGE_KEY la riporta). Prima di salvarla l'app mostra mese, anno ed
      eta' e chiede "E' giusto?": "Si', e' giusto" salva, "Correggi" torna alla scelta con i valori di prima.
      "Preferisco non dirlo" resta com'e' (protezioni da bambino; si puo' dire piu' tardi, una volta sola). */
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
  if (a && !a.skip && a.y && !v110AgeOk && v110AgeConfirm(a)) return;
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
function v110AgeKeep() { try { ageFromMirror(); } catch (e) { /* niente */ } }
/* il "Si'" della domanda "Sostituire i progressi?" assegna lo stato dopo: si rilegge l'eta' subito dopo ogni tocco */
document.addEventListener("click", () => { setTimeout(() => { try { if (S.age === undefined) ageFromMirror(); } catch (e) { /* niente */ } }, 0); });
if (typeof restoreFrom === "function") { const _a = restoreFrom; restoreFrom = function (...a) { const r = _a.apply(this, a); v110AgeKeep(); return r; }; }
if (typeof applyCloud === "function") { const _a = applyCloud; applyCloud = function (...a) { const r = _a.apply(this, a); v110AgeKeep(); return r; }; }
/* scheda "La tua eta'" nel Profilo: chi l'ha detta legge anche che non si cambia piu' */
if (typeof psAgeCard === "function") {
  const _psAgeCardV110 = psAgeCard;
  psAgeCard = function (...a) {
    const h = _psAgeCardV110.apply(this, a); if (!h || !S.age || S.age.skip || !S.age.y) return h;
    return h.replace(/(<div class="card stack-s psage">[\s\S]*?)(<\/div>)/, `$1<p class="small muted v110agelock">${esc(v110AgeT()[6])}</p>$2`);
  };
}
