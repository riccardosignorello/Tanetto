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

/* ---------- 4) tutte le sezioni: colore della sezione, icona accanto al titolo, riquadri che entrano in fila ---------- */
let v110LastTab = "";
function v110Sections() {
  const de = document.documentElement;
  if (!S.pet || document.querySelector("#app .onbtop")) { delete de.dataset.v110tab; return; }
  de.dataset.v110tab = tab;
  /* icona della sezione accanto al titolo (Viaggi, Negozio, Diario, Profilo): la stessa del menu, con il fondo colorato */
  if (tab !== "today") {
    const h = document.querySelector("#app .stack > h1:not(.greet), #app .stack h1:not(.greet):not(.psubt)");
    const src = document.querySelector(`#tabsIn .tab[data-tab="${tab}"] svg`);
    if (h && src && !h.querySelector(".v110hic")) { const sv = src.cloneNode(true); sv.setAttribute("aria-hidden", "true"); h.insertAdjacentHTML("afterbegin", `<span class="v110hic" aria-hidden="true"></span>`); h.firstChild.appendChild(sv); }
  }
  /* cambiando sezione (non a ogni aggiornamento della pagina) i primi riquadri entrano uno dopo l'altro */
  if (tab !== v110LastTab) {
    const app = document.getElementById("app");
    if (app && anim && v110LastTab) {
      [...app.querySelectorAll(".stack > *")].slice(0, 7).forEach((x, i) => x.style.setProperty("--v110i", String(i)));
      app.classList.remove("v110in"); void app.offsetWidth; app.classList.add("v110in");
      clearTimeout(v110Sections.t); v110Sections.t = setTimeout(() => app.classList.remove("v110in"), 800);
    }
    v110LastTab = tab;
  }
}
/* chi torna dopo 1, 7 e 30 giorni (conteggio anonimo, con le stesse regole delle altre statistiche: mai per i minori) */
function v110Return() { try { if (!S.pet || typeof dayIndex !== "function") return; const d = dayIndex(); if (d === 1 || d === 7 || d === 30) trackOnce(`ritorno-g${d}`); } catch (e) { /* niente */ } }
const _renderV110s = render;
render = function (...a) { const r = _renderV110s.apply(this, a); try { v110Sections(); v110Return(); } catch (e) { /* niente */ } return r; };

/* ---------- 5) (M-36) i disegni su canvas (cartoline, riassunti, storia, foto) usano lo stesso carattere della lingua ---------- */
const V110_CFONT = { ru: ['"Tanetto RU", "Nunito"', '"Tanetto RU", "Nunito"'], ja: ['"Tanetto JA", "Noto Sans JP"', '"Noto Sans JP"'], ko: ['"Tanetto KO", "Noto Sans KR"', '"Noto Sans KR"'],
  zh: ['"Noto Sans SC"', '"Noto Sans SC"'], zht: ['"Noto Sans TC"', '"Noto Sans TC"'] };
try {
  const d = Object.getOwnPropertyDescriptor(CanvasRenderingContext2D.prototype, "font");
  if (d && d.set && d.get) Object.defineProperty(CanvasRenderingContext2D.prototype, "font", { configurable: true, get: d.get, set(v) {
    const f = V110_CFONT[S && S.lang]; let s = String(v);
    if (f) s = s.replace(/"Fredoka"/g, f[0]).replace(/"Figtree"/g, f[1]);
    d.set.call(this, s);
  } });
} catch (e) { /* niente */ }
/* i caratteri della lingua si caricano subito, cosi' anche il primo disegno su canvas li usa */
function v110FontsWarm() {
  try { const f = V110_CFONT[S.lang]; if (!f || !document.fonts || !document.fonts.load) return; const fam = f[0].split(",")[0];
    ["500", "600", "700"].forEach((w) => document.fonts.load(`${w} 20px ${fam}`, "Aあ가Я").catch(() => {})); } catch (e) { /* niente */ }
}
v110FontsWarm();
const _setLangV110f = setLang;
setLang = function (...a) { const r = _setLangV110f.apply(this, a); v110FontsWarm(); return r; };
/* licenze: i tre caratteri nuovi (stessa licenza SIL OFL 1.1) */
Object.keys(T).forEach((l) => { const c = T[l] && T[l].credits; if (!Array.isArray(c)) return; const i = c.findIndex((x) => typeof x === "string" && /Fredoka.*Figtree/.test(x)); if (i < 0 || /Nunito/.test(c[i])) return;
  c[i] = c[i].replace(/Fredoka(\s*\S{0,4}\s*)Figtree/, (m, conj) => `Fredoka, Figtree, Nunito, M PLUS Rounded 1c${conj}Jua`); });
