/* ===== 1.0.10 — Profilo con meno voci (richiesta del proprietario, 17/11/2026) =====
   Prima: 8 voci nel menu del Profilo. Ora 4, chiare, ognuna con le sue sottosezioni:
   1) I tuoi progressi (trofei, serie, scudi) 2) Tu e il compagno (nome, obiettivi, promemoria)
   3) Impostazioni e account -> Impostazioni, Account e dati, Privacy ed eta', Acquisti e Plus
   4) Aiuto e informazioni -> Aiuto e idee, Informazioni.
   Le pagine sono le stesse di prima (stessi pulsanti e id): cambia solo il menu. "Indietro" da una sottosezione riporta al
   suo gruppo, dal gruppo al menu. psGo('acct') e simili continuano ad aprire direttamente la pagina. */
const V110_PG = {
  it: { g_set: ["Impostazioni e account", "Lingua, suoni, aspetto, account, privacy, acquisti"], g_help: ["Aiuto e informazioni", "Domande, idee, invita un amico, licenze"] },
  en: { g_set: ["Settings and account", "Language, sounds, look, account, privacy, purchases"], g_help: ["Help and info", "Questions, ideas, invite a friend, licences"] },
  de: { g_set: ["Einstellungen und Konto", "Sprache, Töne, Aussehen, Konto, Datenschutz, Käufe"], g_help: ["Hilfe und Infos", "Fragen, Ideen, Freunde einladen, Lizenzen"] },
  es: { g_set: ["Ajustes y cuenta", "Idioma, sonidos, aspecto, cuenta, privacidad, compras"], g_help: ["Ayuda e información", "Preguntas, ideas, invitar a un amigo, licencias"] },
  fr: { g_set: ["Réglages et compte", "Langue, sons, apparence, compte, confidentialité, achats"], g_help: ["Aide et infos", "Questions, idées, inviter un ami, licences"] },
  pt: { g_set: ["Configurações e conta", "Idioma, sons, aparência, conta, privacidade, compras"], g_help: ["Ajuda e informações", "Dúvidas, ideias, convidar um amigo, licenças"] },
  ja: { g_set: ["設定とアカウント", "言語・音・見た目・アカウント・プライバシー・購入"], g_help: ["ヘルプと情報", "よくある質問・アイデア・友だち招待・ライセンス"] },
  ko: { g_set: ["설정 및 계정", "언어, 소리, 화면, 계정, 개인정보, 구매"], g_help: ["도움말 및 정보", "자주 묻는 질문, 아이디어, 친구 초대, 라이선스"] },
  zh: { g_set: ["设置与账户", "语言、声音、外观、账户、隐私、购买"], g_help: ["帮助与信息", "常见问题、建议、邀请朋友、许可"] },
  zht: { g_set: ["設定與帳戶", "語言、聲音、外觀、帳戶、隱私、購買"], g_help: ["說明與資訊", "常見問題、建議、邀請朋友、授權"] },
  ru: { g_set: ["Настройки и аккаунт", "Язык, звуки, вид, аккаунт, конфиденциальность, покупки"], g_help: ["Помощь и информация", "Вопросы, идеи, пригласить друга, лицензии"] },
  pl: { g_set: ["Ustawienia i konto", "Język, dźwięki, wygląd, konto, prywatność, zakupy"], g_help: ["Pomoc i informacje", "Pytania, pomysły, zaproś znajomego, licencje"] },
  nl: { g_set: ["Instellingen en account", "Taal, geluid, uiterlijk, account, privacy, aankopen"], g_help: ["Hulp en info", "Vragen, ideeën, een vriend uitnodigen, licenties"] },
  tr: { g_set: ["Ayarlar ve hesap", "Dil, sesler, görünüm, hesap, gizlilik, satın alımlar"], g_help: ["Yardım ve bilgi", "Sorular, fikirler, arkadaş davet et, lisanslar"] }
};
const V110_GRP = { g_set: ["set", "acct", "priv", "buy"], g_help: ["help", "about"] };
const V110_PARENT = { set: "g_set", acct: "g_set", priv: "g_set", buy: "g_set", help: "g_help", about: "g_help" };
PSUB.push("g_set", "g_help");
const _viewMoreV110g = viewMore;
viewMore = function (...a) {
  const h = _viewMoreV110g.apply(this, a);
  try {
    if (!S.pet) return h;
    const tpl = document.createElement("template"); tpl.innerHTML = h;
    const st = tpl.content.querySelector(".stack.psplit"); const menu = st && st.querySelector('nav.pmenu[data-pg="main"]'); if (!menu) return h;
    const w = V110_PG[S.lang] || V110_PG.en; const want = moreSub || "main";
    const firstSub = st.querySelector(".psubhd");
    Object.keys(V110_GRP).forEach((g) => {
      const rows = V110_GRP[g].map((k) => menu.querySelector(`.prow[data-psub="${k}"]`)).filter(Boolean); if (!rows.length) return;
      const ic = g === "g_set" ? "set" : "help";
      rows[0].insertAdjacentHTML("beforebegin", `<button class="prow" type="button" data-psub="${g}"><span class="prico pi-${ic}">${psIcon(ic)}</span><span class="prtx"><b>${esc(w[g][0])}</b><small>${esc(w[g][1])}</small></span><span class="pchev" aria-hidden="true">›</span></button>`);
      const hd = document.createElement("template");
      hd.innerHTML = `<div class="psubhd" data-pg="${g}"><button class="iconbtn psback" type="button" data-psback="1" aria-label="${esc(L().back)}">${PS_BACK}</button><h1 class="psubt" tabindex="-1">${esc(w[g][0])}</h1></div><nav class="pmenu card" data-pg="${g}" aria-label="${esc(w[g][0])}"></nav>`;
      const nav = hd.content.querySelector("nav"); rows.forEach((r) => nav.appendChild(r));
      [...hd.content.children].forEach((el) => { if (want !== g) el.setAttribute("hidden", ""); else el.removeAttribute("hidden"); st.insertBefore(el, firstSub); });
    });
    /* la freccia ">" delle righe nuove uguale a quella delle altre */
    const chev = menu.querySelector(".prow:not([data-psub^='g_']) .pchev");
    if (chev) st.querySelectorAll(".prow[data-psub^='g_'] .pchev").forEach((c) => { c.outerHTML = chev.outerHTML; });
    return tpl.innerHTML;
  } catch (e) { return h; }
};
/* "indietro" (freccia o telefono) da una sottosezione: torna al suo gruppo */
const _psGoV110g = psGo;
psGo = function (k, from) {
  if (!k && from && V110_PARENT[from] && moreSub === from && !psDeep) return _psGoV110g.call(this, V110_PARENT[from]);
  return _psGoV110g.apply(this, arguments);
};
const _backPressV110g = backPress;
backPress = function () {
  if (moreSub && V110_PARENT[moreSub] && tab === "more" && !psDeep && !layer.innerHTML.trim() && !document.getElementById("exitAsk") && !document.querySelector(".tutwrap")) { psGo(V110_PARENT[moreSub]); return "profile"; }
  return _backPressV110g.apply(this, arguments);
};
