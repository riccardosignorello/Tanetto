/* ===== 1.0.10 — menu sospeso, primo avvio vivo e guida iniziale fluida (stile in 11zi_v110_motion.css) ===== */

/* ---------- 1) menu: colore della scheda attiva, icone piene a due toni, rimbalzo al tocco ---------- */
const V110_FILL = {
  today: '<path data-v110f="" d="M5.5 10.4 12 4.9l6.5 5.5V20h-13Z"/>',
  more: '<circle data-v110f="" cx="12" cy="8" r="4"/><path data-v110f="" d="M4.6 20.5a7.4 7.4 0 0 1 14.8 0Z"/>'
};
let v110PopTab = "";
function v110Dock() {
  const n = document.getElementById("tabsIn"); if (!n) return;
  const cur = n.querySelector('.tab[aria-current="page"]'); n.dataset.cur = cur ? cur.dataset.tab || "" : "";
  n.querySelectorAll(".tab svg").forEach((sv) => {
    if (sv.querySelector("[data-v110f]")) return;
    const k = (sv.closest(".tab") || {}).dataset ? sv.closest(".tab").dataset.tab : "";
    if (V110_FILL[k]) { sv.insertAdjacentHTML("afterbegin", V110_FILL[k]); return; }
    /* le forme chiuse dell'icona diventano il fondo colorato */
    const shapes = [...sv.querySelectorAll("path, rect, circle, ellipse")].filter((x) => x.tagName.toLowerCase() !== "path" || /z\s*$/i.test(x.getAttribute("d") || ""));
    shapes.reverse().forEach((x) => { const c = x.cloneNode(false); c.setAttribute("data-v110f", ""); sv.insertBefore(c, sv.firstChild); });
  });
  if (v110PopTab && anim) { const ic = n.querySelector(`.tab[data-tab="${v110PopTab}"] .ic`); if (ic) { ic.classList.remove("v110pop"); void ic.offsetWidth; ic.classList.add("v110pop"); setTimeout(() => ic.classList.remove("v110pop"), 600); } }
  v110PopTab = "";
}
document.addEventListener("click", (ev) => { const b = ev.target.closest && ev.target.closest("#tabs .tab"); if (b && b.dataset.tab) v110PopTab = b.dataset.tab; }, true);

/* ---------- 2) primo avvio: sfondo con luce morbida (classe sul body solo nei passi iniziali) ---------- */
function v110Onb() { try { const on = !!document.querySelector("#app .onbtop"); document.body.classList.toggle("v110onb", on); document.documentElement.classList.toggle("v110onb", on); } catch (e) { /* niente */ } }

const _renderV110m = render;
render = function (...a) { const r = _renderV110m.apply(this, a); try { v110Dock(); v110Onb(); } catch (e) { /* niente */ } return r; };

/* ---------- 3) guida iniziale: un solo velo che resta, il cerchio scivola sul punto successivo ---------- */
showTutStep = function () {
  if (S.tut >= 99 || tab !== "today" || !S.pet) return;
  let i = S.tut; let el = null;
  while (i < TUT_TARGETS.length && !(el = document.querySelector(TUT_TARGETS[i]))) i++;
  if (i >= TUT_TARGETS.length) { S.tut = 99; save(); tutClose(true); return; }
  S.tut = i; save(); tutOn = true;
  const t = L(); const last = i === TUT_TARGETS.length - 1 || !TUT_TARGETS.slice(i + 1).some((s) => document.querySelector(s));
  const gen = ++tutGen; const sel = TUT_TARGETS[i];
  document.querySelectorAll(".tutwrap:not(.v110tut)").forEach((x) => x.remove());
  let w = document.querySelector(".tutwrap.v110tut"); const fresh = !w;
  if (fresh) {
    w = document.createElement("div"); w.className = "tutwrap v110tut";
    w.innerHTML = `<div class="tutblock"></div><div class="tutring" style="left:-9999px;top:0;width:0;height:0"></div><div class="tutbox card" role="dialog" aria-modal="true" aria-labelledby="tutTx" style="visibility:hidden"><p id="tutTx"></p><div class="row"><button class="link" id="tutSkip">${t.tutSkip}</button><span class="spacer"></span><span class="small muted v110cnt"></span><button class="btn small" id="tutNext"></button></div></div>`;
    document.body.appendChild(w);
  }
  if (sel !== "#tabs") { const r0 = el.getBoundingClientRect(); if (r0.top < 70 || r0.bottom > innerHeight - 120) el.scrollIntoView({ block: "center", behavior: anim ? "smooth" : "auto" }); }
  /* si misura quando la pagina ha finito di scorrere (due misure uguali di fila, al massimo 700 ms) */
  let prev = "", same = 0; const t0 = performance.now();
  const place = () => {
    if (gen !== tutGen || !tutOn || !w.isConnected) return;
    if (!el.isConnected) { el = document.querySelector(sel); if (!el) { tutClose(true); return; } }
    const tgt = sel === "#tabs" ? document.getElementById("tabsIn") || el : el; /* il menu sospeso: il cerchio va sulla barca, non sulla sfumatura */
    const r = tgt.getBoundingClientRect(); const pad = sel === "#tabs" ? 4 : 8;
    const g = { left: r.left - pad, top: r.top - pad, width: r.width + pad * 2, height: r.height + pad * 2 };
    const ring = w.querySelector(".tutring"); const box = w.querySelector(".tutbox"); const tx = w.querySelector("#tutTx");
    const text = t.tut[i].split("{n}").join(S.petName);
    const fill = () => { tx.textContent = text; w.querySelector(".v110cnt").textContent = `${i + 1}/${TUT_TARGETS.length}`; w.querySelector("#tutNext").textContent = last ? t.tutDone : t.tutNext; };
    const putBox = () => { const bh = box.offsetHeight; const vh = innerHeight; const below = r.bottom + pad + 14; box.style.top = `${below + bh < vh - 10 ? below : Math.max(10, r.top - pad - 14 - bh)}px`; box.style.visibility = ""; };
    if (fresh || !anim || !G) {
      Object.assign(ring.style, { left: g.left + "px", top: g.top + "px", width: g.width + "px", height: g.height + "px" });
      fill(); putBox();
      if (fresh && anim && G) { G.from(ring, { scale: 1.12, opacity: 0, duration: 0.35, ease: "power2.out" }); G.from(box, { y: 12, opacity: 0, duration: 0.3, delay: 0.08 }); }
    } else {
      G.to(ring, { left: g.left, top: g.top, width: g.width, height: g.height, duration: 0.45, ease: "power3.inOut", overwrite: true });
      tx.style.opacity = "0";
      setTimeout(() => { if (gen !== tutGen) return; fill(); putBox(); tx.style.opacity = ""; }, 180);
    }
    const nb = w.querySelector("#tutNext"); if (nb) nb.focus({ preventScroll: true });
  };
  const tick = () => {
    if (gen !== tutGen || !tutOn) return;
    const r = (el.isConnected ? el : document.querySelector(sel) || el).getBoundingClientRect(); const k = `${Math.round(r.top)},${Math.round(r.left)},${Math.round(r.height)}`;
    same = k === prev ? same + 1 : 0; prev = k;
    if (same >= 2 || performance.now() - t0 > 700 || !anim) place(); else requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
};
