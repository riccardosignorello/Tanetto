/* 1.0.11 (sito su PC): sul computer l'app si vede dentro una cornice grande come un telefono, al centro dello schermo e
   adattata all'altezza della finestra, cosi' tutta la schermata si vede senza scorrere la pagina (prima su PC era larga fino
   a 700-1180 px e bisognava scorrere per vedere tutto).
   Come: la pagina che si apre sul PC fa solo da cornice e carica la stessa pagina in un riquadro (iframe) largo 390 px.
   Dentro il riquadro l'app vede uno schermo da telefono, quindi valgono esattamente le regole del telefono (le regole
   per tablet e schermi orizzontali guardano la larghezza della finestra e con il solo CSS si sarebbero attivate lo stesso).
   Solo con mouse o touchpad (hover + puntatore preciso) e finestra di almeno 700 x 480: telefoni e tablet touch restano
   come prima. Mai nell'app Android (Capacitor), mai dentro un riquadro (niente cornice nella cornice).
   window.__TNOFRAME = 1 (solo prove automatiche) o ?frame=0 nell'indirizzo: l'app a tutta finestra come prima. */
const DESK_FRAME = (() => {
  try {
    if (window.top !== window.self || window.Capacitor || window.__TNOFRAME || /[?&]frame=0(&|$)/.test(location.search)) return false;
    return matchMedia("(hover: hover) and (pointer: fine) and (min-width: 700px) and (min-height: 480px)").matches;
  } catch (e) { return false; }
})();
if (DESK_FRAME) {
  const d = document, PW = 390, PH = 844, PAD = 16;
  try { const th = (JSON.parse(localStorage.getItem("tanetto-prova-v3") || "{}") || {}).theme; if (th === "dark" || th === "light") d.documentElement.setAttribute("data-theme", th); } catch (e) { /* tema del sistema */ }
  [...d.body.children].forEach((n) => n.remove());
  d.documentElement.classList.add("deskhost");
  const st = d.createElement("style");
  st.textContent = "html.deskhost,html.deskhost body{height:100%;overflow:hidden;margin:0}" +
    "html.deskhost body{display:flex;align-items:center;justify-content:center;background:linear-gradient(160deg,#EFE8DC,#E3D9CA)}" +
    "@media (prefers-color-scheme:dark){html.deskhost:not([data-theme=light]) body{background:linear-gradient(160deg,#1F1B17,#14110F)}}" +
    "html.deskhost[data-theme=dark] body{background:linear-gradient(160deg,#1F1B17,#14110F)}" +
    ".deskfr{position:relative;flex:none;overflow:hidden;background:var(--bg);box-shadow:0 0 0 1px rgba(60,45,30,.10),0 28px 70px -28px rgba(60,45,30,.55)}" +
    ".deskfr iframe{position:absolute;left:0;top:0;border:0;display:block;transform-origin:0 0;background:var(--bg)}";
  d.head.appendChild(st);
  const box = d.createElement("div"); box.className = "deskfr";
  const f = d.createElement("iframe");
  f.title = "Tanetto"; f.src = location.href; f.allow = "fullscreen; clipboard-write; autoplay";
  box.appendChild(f); d.body.appendChild(box);
  /* scala: l'altezza disponibile diviso l'altezza di un telefono (844), tra 0,8 (schermi bassi) e 1,1 (schermi alti);
     sotto 844 x 0,8 il telefono diventa un po' piu' corto (come un telefono piu' basso), mai la pagina che scorre */
  const fit = () => {
    const H = Math.max(300, innerHeight - PAD * 2), W = Math.max(300, innerWidth - PAD * 2);
    const s = Math.max(0.8, Math.min(1.1, H / PH, W / PW));
    const lh = Math.min(PH + 56, Math.round(H / s));
    f.style.width = PW + "px"; f.style.height = lh + "px"; f.style.transform = `scale(${s})`;
    box.style.width = Math.round(PW * s) + "px"; box.style.height = Math.round(lh * s) + "px"; box.style.borderRadius = Math.round(30 * s) + "px";
  };
  fit(); addEventListener("resize", fit);
  f.addEventListener("load", () => { try { f.contentWindow.focus(); } catch (e) { /* niente */ } });
  return;
}
