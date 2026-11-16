/* ===== 1.0.10 — PROPOSTA di nuovo aspetto: piccoli spostamenti nella pagina (attivi solo con html.v110x) ===== */
function v110Redesign() {
  if (!document.documentElement.classList.contains("v110x")) return;
  const app = document.getElementById("app"); if (!app) return;
  /* Casa: il saluto entra nella copertina della stanza */
  const rw = app.querySelector(".stack > .roomwrap"); const gr = app.querySelector(".stack > h1.greet");
  if (rw && tab === "today" && !rw.classList.contains("full")) { rw.classList.add("v110hero"); if (gr) rw.insertBefore(gr, rw.firstChild); }
  /* Casa: quanti obiettivi mancano accanto al titolo */
  const h2 = app.querySelector(".sec h2"); const g = app.querySelectorAll(".goals .goal");
  if (h2 && g.length && tab === "today" && !h2.querySelector(".v110cnt")) { const d = app.querySelectorAll(".goals .goal.done, .goals .goal[aria-pressed='true']").length; h2.insertAdjacentHTML("beforeend", `<span class="v110cnt">${d}/${g.length}</span>`); }
  /* Viaggi: le mete come album a due colonne */
  app.querySelectorAll(".stack-s").forEach((s) => { if (s.querySelector(":scope > .dest")) s.classList.add("v110grid"); });
}
const _renderV110x = render;
render = function (...a) { const r = _renderV110x.apply(this, a); try { v110Redesign(); } catch (e) { /* niente */ } return r; };
