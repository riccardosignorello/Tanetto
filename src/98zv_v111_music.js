/* =================== 1.0.11: musiche a tema per ogni evento (motore in 60_sound.js, brani EVS) ===================
   Con la musica accesa, durante un evento parte da sola la sua musica: Natale (8 dicembre - 6 gennaio), Nuovo inizio
   (7-31 gennaio), altrimenti la stagione del sentiero (Lanterne, Stelle, Aquiloni). Con la musica spenta non suona niente.
   In Profilo > Suoni il brano dell'evento e' il primo della lista (con il nome dell'evento); scegliendo un altro brano resta
   quello per il resto della sessione. */
function w111MusicEvent(d) {
  d = d || new Date();
  try { if (typeof xmOn === "function" && xmOn(d)) return "xmas"; } catch (e) { /* niente */ }
  try { if (typeof fs20On === "function" && fs20On(d)) return "fresh"; } catch (e) { /* niente */ }
  try { const se = seasonAt(dkey(d)); if (se) return seaKind(se); } catch (e) { /* niente */ }
  return null;
}
function w111MusicName(id) {
  try {
    if (id === "xmas") return w111t().xmas;
    if (id === "fresh") return (GR20_T[S.lang] || GR20_T.en).fsPill;
    const se = curSeason(); if (se) return seaName(se);
  } catch (e) { /* niente */ }
  return "";
}
function w111MusicSync() { try { SND.setEvent(w111MusicEvent()); } catch (e) { /* niente */ } }
w111MusicSync();
document.addEventListener("visibilitychange", () => { if (document.visibilityState === "visible") w111MusicSync(); });
setInterval(() => { if (!document.hidden) w111MusicSync(); }, 60000);
/* scegliere un brano normale: l'evento non riparte da solo in questa sessione */
document.addEventListener("click", (ev) => { const b = ev.target.closest && ev.target.closest("[data-track]"); if (b) { try { SND.holdEvent(); } catch (e) { /* niente */ } } }, true);
/* il brano dell'evento in cima alla lista dei brani */
const _viewMoreW111m = viewMore;
viewMore = function (...a) {
  const h = _viewMoreW111m.apply(this, a);
  try {
    const id = SND.eventId(); if (!id || typeof h !== "string") return h; const k = h.indexOf('<div class="tracks'); if (k < 0) return h;
    const j = h.indexOf(">", k) + 1; const on = S.music && SND.eventPlaying(); const nm = w111MusicName(id); if (!nm) return h;
    return h.slice(0, j) + `<button class="chip w111ev ${on ? "playing" : ""}" aria-pressed="${on}" data-evtrack="1" type="button">${on ? "♪ " : ""}${esc(nm)}</button>` + h.slice(j);
  } catch (e) { return h; }
};
document.addEventListener("click", (ev) => {
  const b = ev.target.closest && ev.target.closest("[data-evtrack]"); if (!b) return; ev.stopImmediatePropagation(); ev.preventDefault();
  w111MusicSync();
  if (!S.music) { S.music = true; save(); SND.playEvent(); SND.musicOn(); } else SND.playEvent();
  const y = window.scrollY; render(); window.scrollTo(0, y);
}, true);
