/* =================== 1.0.11: suoni dell'interfaccia subito (Android) =================== */
/* Su Android (WebView) il suono del cambio di sezione arrivava circa 1 secondo dopo il tocco. Le cause:
   1) il motore dei suoni si addormenta dopo 20 s di silenzio (G-05, 98zk) e su Android il risveglio riapre l'uscita audio,
      che costa centinaia di millisecondi; il risveglio partiva solo dentro il suono, cioe' al click;
   2) il suono partiva al "click" (dopo il rilascio del dito) e veniva costruito sul momento (60_sound.js);
   3) il "tap" generico (85_v4) partiva in un setTimeout, dopo che la pagina nuova era gia' stata disegnata.
   Ora: a) il motore si risveglia al primo contatto (pointerdown/touchstart/tasto, prima che arrivi il click) e dorme solo
   dopo 20 s di silenzio E 45 s senza tocchi (98zk); b) le schede in basso e quelle della Casa suonano gia' al pointerdown,
   in modo sincrono, con il suono preparato una volta sola (AudioBuffer, 60_sound.js), e il click non lo ripete;
   c) il "tap" generico parte alla fine del click, senza setTimeout (il setTimeout resta solo come riserva se un gestore
   ferma la propagazione). Interruttore dei suoni, musica, modalita' calma/leggera e protetta: invariati (SND.play
   controlla sempre S.sfx; nessuna animazione o pagina cambia). */
let sfxPre = null, sfxHit = null, sfxTapT = 0;
const SFX_SEL = "#tabs .tab, button[data-hometab]";
function sfxWake() { try { SND.resume(); } catch (e) { /* niente */ } }
["pointerdown", "touchstart", "keydown"].forEach((n) => document.addEventListener(n, sfxWake, { capture: true, passive: true }));
document.addEventListener("pointerdown", (ev) => {
  if (ev.button !== 0 || ev.isPrimary === false) return;
  const b = ev.target && ev.target.closest && ev.target.closest(SFX_SEL); if (!b || b.disabled) return;
  const name = b.dataset.hometab !== undefined || (b.dataset.tab && b.dataset.tab !== tab) ? "click" : "tap";
  SND.play(name);
  /* nel browser, prima del primo tocco "vero" il suono non puo' partire: allora lo rifa' il click, come prima */
  let ok = false; try { ok = SND.state() === "running" || !navigator.userActivation || navigator.userActivation.hasBeenActive; } catch (e) { ok = true; }
  sfxPre = { b, at: performance.now(), ok: ok || !S.sfx };
}, { capture: true, passive: true });
/* dopo clickT0 (85_v4, registrato prima): il click della stessa scheda non ripete il suono, e il "tap" generico nemmeno */
document.addEventListener("click", (ev) => {
  sfxHit = null; const p = sfxPre; sfxPre = null;
  if (!p || !p.ok || performance.now() - p.at > 2500) return;
  const b = ev.target && ev.target.closest && ev.target.closest(SFX_SEL); if (b !== p.b) return;
  sfxHit = b; SND.mark();
}, true);
function sfxPreUsed(b) { return !!b && sfxHit === b; }
/* "tap" generico: alla fine del click (window, ultimo della propagazione), senza setTimeout */
function sfxTapNow() { if (!sfxTapT) return; const t0 = sfxTapT; sfxTapT = 0; if (SND.lastAt() < t0) SND.play("tap"); }
window.addEventListener("click", sfxTapNow);
