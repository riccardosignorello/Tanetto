/* ===== 1.0.10 — NUOVO ASPETTO (proposta 2): spostamenti e pezzi in piu' nella pagina (attivi solo con html.v110x) ===== */
const V2_T = {
  it: { next: "Verso il", goals: "obiettivi", cards: "cartoline", streak: "giorni di fila", troph: "trofei", invT: "Invita un amico", invP: "Prendersi cura di sé è più bello in due." },
  en: { next: "Next:", goals: "goals", cards: "postcards", streak: "days in a row", troph: "trophies", invT: "Invite a friend", invP: "Looking after yourself is nicer with two." },
  de: { next: "Nächstes:", goals: "Ziele", cards: "Postkarten", streak: "Tage in Folge", troph: "Trophäen", invT: "Freunde einladen", invP: "Zu zweit macht Selbstfürsorge mehr Freude." },
  es: { next: "Hacia el", goals: "objetivos", cards: "postales", streak: "días seguidos", troph: "trofeos", invT: "Invita a un amigo", invP: "Cuidarse es más bonito entre dos." },
  fr: { next: "Vers le", goals: "objectifs", cards: "cartes", streak: "jours d'affilée", troph: "trophées", invT: "Inviter un ami", invP: "Prendre soin de soi, c'est plus doux à deux." },
  pt: { next: "Rumo ao", goals: "metas", cards: "cartões", streak: "dias seguidos", troph: "troféus", invT: "Convide um amigo", invP: "Cuidar de si é mais gostoso a dois." },
  ja: { next: "次は", goals: "目標", cards: "ポストカード", streak: "日連続", troph: "トロフィー", invT: "友だちを招待", invP: "自分をいたわるのは、ふたりならもっと楽しい。" },
  ko: { next: "다음", goals: "목표", cards: "엽서", streak: "일 연속", troph: "트로피", invT: "친구 초대하기", invP: "나를 돌보는 일, 둘이 하면 더 즐거워요." },
  zh: { next: "下一级", goals: "目标", cards: "明信片", streak: "天连续", troph: "奖杯", invT: "邀请朋友", invP: "照顾自己，两个人一起更开心。" },
  zht: { next: "下一級", goals: "目標", cards: "明信片", streak: "天連續", troph: "獎盃", invT: "邀請朋友", invP: "照顧自己，兩個人一起更開心。" },
  ru: { next: "Дальше:", goals: "цели", cards: "открытки", streak: "дней подряд", troph: "трофеи", invT: "Пригласить друга", invP: "Заботиться о себе вдвоём приятнее." },
  pl: { next: "Dalej:", goals: "cele", cards: "pocztówki", streak: "dni z rzędu", troph: "trofea", invT: "Zaproś znajomego", invP: "Dbać o siebie we dwoje jest milej." },
  nl: { next: "Op weg naar", goals: "doelen", cards: "kaarten", streak: "dagen op rij", troph: "trofeeën", invT: "Nodig een vriend uit", invP: "Goed voor jezelf zorgen is leuker met z'n tweeën." },
  tr: { next: "Sıradaki:", goals: "hedef", cards: "kartpostal", streak: "gün üst üste", troph: "kupa", invT: "Arkadaşını davet et", invP: "Kendine iyi bakmak iki kişiyle daha güzel." }
};
const v2t = () => V2_T[S.lang] || V2_T.en;
const V2_GIFT = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 11h16v9H4Z"/><path d="M3 7h18v4H3Z"/><path d="M12 7v13"/><path d="M12 7C10.5 4 7 3.5 7 5.5S10 7 12 7Zm0 0c1.5-3 5-3.5 5-1.5S14 7 12 7Z"/></svg>';
function v110Redesign() {
  if (!document.documentElement.classList.contains("v110x")) return;
  const app = document.getElementById("app"); if (!app) return; const w = v2t();
  if (tab === "today") {
    /* la scena con il saluto dentro */
    const rw = app.querySelector(".stack > .roomwrap"); const gr = app.querySelector(".stack > h1.greet");
    if (rw && !rw.classList.contains("full")) { rw.classList.add("v110hero"); if (gr) rw.insertBefore(gr, rw.firstChild); }
    /* riepilogo del giorno: anello con gli obiettivi fatti */
    const ne = app.querySelector("#nvEnergy");
    if (ne && !ne.querySelector(".v2r")) {
      let dn = 0, n = 0; try { const st = nav20energyInfo(); dn = st.why === "used" ? 0 : st.dn || 0; n = st.n || 0; } catch (e) { /* niente */ }
      const tg = todayGoals(); const done = tg.filter((g) => S.done.includes(g)).length; const tot = tg.length || n;
      ne.classList.add("v2ring"); ne.insertAdjacentHTML("afterbegin", `<div class="v2r" style="--p:${tot ? Math.round((done / tot) * 100) : 0}" aria-hidden="true"><span><b>${done}/${tot}</b><small>${esc(w.goals)}</small></span></div>`);
    }
    const h2 = app.querySelector(".sec h2"); const g = app.querySelectorAll(".goals .goal");
    if (h2 && g.length && !h2.querySelector(".v110cnt")) { const d = app.querySelectorAll('.goals .goal[aria-pressed="true"]').length; h2.insertAdjacentHTML("beforeend", `<span class="v110cnt">${d}/${g.length}</span>`); }
  }
  /* Viaggi: album di cartoline */
  app.querySelectorAll(".stack-s").forEach((s) => { if (s.querySelector(":scope > .dest")) s.classList.add("v110grid"); });
  /* Profilo: il compagno sul palco, livello e numeri; "Invita un amico" in vista (solo se l'invito esiste per questa eta') */
  const pc = app.querySelector(".profcard");
  if (pc && !pc.classList.contains("v2stage")) {
    pc.classList.add("v2stage");
    const need = typeof xpNeed === "function" ? xpNeed(S.level) : 100; const xp = Math.max(0, Math.min(need, S.xp || 0)); const t = L();
    const lvT = `${t.level || "Lv"} ${S.level + 1}`; const xpT = typeof t.xpTo === "function" ? t.xpTo(xp, need) : `${xp}/${need}`;
    const cardsTxt = (pc.querySelector(".pftx p") || {}).textContent || ""; const cm = cardsTxt.match(/(\d+)\s*\/\s*(\d+)/);
    const st = typeof streak === "function" ? streak() : 0; const tr = Object.values(S.trophies || {}).filter((x) => x && x.at).length;
    const row = pc.querySelector(".pfrow");
    if (row) row.insertAdjacentHTML("afterend", `<div class="v2lv"><div class="v2lvh"><b>${esc(w.next)} ${esc(lvT)}</b><span>${Math.round((xp / need) * 100)}%</span></div><div class="v2bar" style="--p:${Math.round((xp / need) * 100)}"><i></i></div></div>
      <div class="v2stats"><div><b>${cm ? `${cm[1]}/${cm[2]}` : "0"}</b><small>${esc(w.cards)}</small></div><div><b>${st}</b><small>${esc(w.streak)}</small></div><div><b>${tr}</b><small>${esc(w.troph)}</small></div></div>`);
  }
  const inv = app.querySelector("#invite"); const plus = app.querySelector('#plusCard[data-pg="main"]') || app.querySelector("#plusCard");
  if (inv && plus && !app.querySelector(".v2invite")) plus.insertAdjacentHTML("afterend", `<button class="card v2invite" type="button" id="v2Invite" data-pg="main"${(moreSub && moreSub !== "main") ? " hidden" : ""}><span class="v2ii">${V2_GIFT}</span><span><b>${esc(w.invT)}</b><small>${esc(w.invP)}</small></span></button>`);
}
document.addEventListener("click", (ev) => { const b = ev.target.closest && ev.target.closest("#v2Invite"); if (!b) return; ev.stopImmediatePropagation(); const i = document.getElementById("invite"); if (i) i.click(); }, true);
const _renderV110x = render;
render = function (...a) { const r = _renderV110x.apply(this, a); try { v110Redesign(); } catch (e) { /* niente */ } return r; };
