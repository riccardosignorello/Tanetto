/* =================== 1.0.11 (parte nativa Android): widget della Home, recensione nei momenti felici, Invita un amico ===================
   Testi in 3zzm_n111_texts.js (L().n111). Parte Android: TanettoWidget/TanettoWidgetWide/WidgetSnap/WidgetPlugin (widget),
   ReviewPlugin (recensione), GrowthPlugin (referrer di Google Play e impronta del dispositivo). Regole Firestore dell'invito:
   tools/firebase/firestore.rules. Tutto solo nell'app Android (isNativeApp()); sul sito non cambia niente.

   A) WIDGET. L'app manda al widget una "fotografia" del giorno (compagno, nome, obiettivi fatti/da fare, frasi gia' tradotte,
      il giorno dopo gia' pronto per la mezzanotte, fine della gita). Il widget sceglie da solo la parte giusta (WidgetSnap.java).
      Nessun dato personale: niente obiettivi scritti, niente diario.
   B) "METTI {n} SULLA TUA HOME": scheda con animazione che mostra come si aggiunge (modello Duolingo) e, dove Android lo
      permette (8.0+), il pulsante che chiede ad Android di aggiungerlo (requestPinAppWidget). Proposta UNA volta sola, mai
      all'avvio: dopo 3 giorni d'uso, dopo un obiettivo fatto, in coda alle altre finestre (nq20). Sempre raggiungibile dal Profilo.
   C) RECENSIONE (Google Play In-App Review): solo nei momenti felici (ritorno dal viaggio, 7 e 30 giorni di fila, livello 5, 10,
      15...), mai prima del 3° giorno d'uso, al massimo una volta ogni 60 giorni, nessuna domanda prima, nessun pulsante.
      Solo adulti (regola della 1.0.10 "sotto i 18 anni nessuna pressione", 98zk_v26_fix.js punto b2).
   D) INVITA UN AMICO (solo adulti, 18+): link di Google Play con il codice nel referrer; all'amico 50 Tanì (dopo il controllo
      del telefono sul server), a chi invita 100 Tanì quando l'amico ha usato l'app in 3 giorni diversi, al massimo 3 amici.
      I Tanì dell'invito contano come "pagati" (econ().paid): non accorciano gli Introvabili, come i Tanì di Plus. */
/* INTERRUTTORE dell'invito con premi. Doppio: N111_INVITE (nel codice, true) E server pronto (le regole di Firestore
   pubblicate: l'app lo controlla da sola una volta al giorno). Finche' il server non risponde, "Invita un amico" resta la
   condivisione semplice di prima, nessun premio promesso, e gli amici arrivati con un link aspettano (regalo non perso). */
const N111_INVITE = true;
const N111_GIFT = 50, N111_REWARD = 100, N111_MAX = 3, N111_REVIEW_GAP = 60 * 864e5;
const N111_CODE_ABC = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const N111 = { sent: "", timer: 0, promoAt: 0, t0: Date.now(), busy: false };
const n1 = () => (L().n111 || T.en.n111);
const n111Name = () => S.petName || ((L().pets || {})[S.pet] || [""])[0] || "Tanetto";
const n111Ko = (s) => (S.lang === "ko" && typeof koJ === "function" ? koJ(s) : s);
const n111Young = () => { try { return typeof v26Young !== "function" || v26Young(); } catch (e) { return true; } };
const n111Adult = () => { try { return isNativeApp() && !n111Young() && typeof ageBand === "function" && ageBand() === "adult"; } catch (e) { return false; } };
const n111Quiet = () => { try { return (typeof sf110Quiet !== "undefined" && sf110Quiet) || (typeof sf110Calm === "function" && sf110Calm()); } catch (e) { return false; } };
const growthPlugin = () => { try { const C = window.Capacitor; return (C.Plugins && C.Plugins.TanettoGrowth) || (C.registerPlugin ? C.registerPlugin("TanettoGrowth") : null); } catch (e) { return null; } };
/* giorni d'uso: giorni con qualcosa nel registro o nel calendario (S.days), piu' oggi */
function n111UseDays(st) {
  st = st || S; const d = new Set((st.log || []).map((x) => x.d)); Object.keys(st.days || {}).forEach((k) => d.add(k)); return d.size;
}
function n111St() { if (!S.n111 || typeof S.n111 !== "object") S.n111 = {}; return S.n111; }

/* =================== A) WIDGET: fotografia del giorno =================== */
function n111DayGoals(date) { const i = wdIdx(date); return (S.goals || []).filter((g) => (g.days || []).includes(i)).length; }
function n111Snap(now) {
  now = now || new Date();
  const t = n1(), w = L().widget, nm = n111Name(), day = dkey(now);
  const tg = todayGoals(); const tot = tg.length; const d = Math.min(tot, (S.done || []).filter((g) => tg.includes(g)).length);
  const st = S.away ? "away" : !tot ? "free" : d >= tot ? "done" : d > 0 ? "part" : "todo";
  const line = st === "away" ? w.away(nm) : st === "free" ? w.free : st === "done" ? w.done : st === "part" ? t.w.part(nm) : t.w.todo(nm);
  const badge = st === "away" || st === "free" ? "" : `${d}/${tot}`;
  const snap = { v: 1, pet: S.pet, name: nm, day, st, d, t: tot, badge, label: badge ? t.w.label : "", line: n111Ko(line),
    a11y: n111Ko(badge ? `${nm}. ${w.goals(d, tot)}. ${line}` : `${nm}. ${line}`), open: w.open };
  /* gita: quando finisce il widget dice che e' tornato a casa (anche se l'app non viene aperta) */
  if (S.away && +S.away.until > now.getTime()) { snap.until = +S.away.until; snap.back = n111Ko(t.w.back(nm)); }
  /* domani, pronto per la mezzanotte */
  const tm = new Date(now); tm.setDate(tm.getDate() + 1); tm.setHours(0, 0, 30, 0);
  const tt = n111DayGoals(tm); const awayTom = !!(S.away && +S.away.until > tm.getTime());
  const ts = awayTom ? "away" : tt ? "todo" : "free";
  const tl = ts === "away" ? w.away(nm) : ts === "free" ? w.free : t.w.newday(nm);
  const tb = ts === "todo" ? `0/${tt}` : "";
  snap.tom = { day: dkey(tm), st: ts, d: 0, t: tt, badge: tb, label: tb ? t.w.label : "", line: n111Ko(tl), a11y: n111Ko(tb ? `${nm}. ${w.goals(0, tt)}. ${tl}` : `${nm}. ${tl}`) };
  return snap;
}
function n111WidgetFlush() {
  const p = widgetPlugin(); if (!p || !p.update || !N111.pending) return;
  const { key, snap } = N111.pending; N111.pending = null; clearTimeout(N111.timer); N111.timer = 0; N111.sent = key;
  try { Promise.resolve(p.update({ snap })).catch(() => { N111.sent = ""; }); } catch (e) { N111.sent = ""; }
}
widgetSync = function () {
  if (!isNativeApp() || !S.pet) return; const p = widgetPlugin(); if (!p || !p.update) return;
  let snap; try { snap = n111Snap(); } catch (e) { return; }
  const key = JSON.stringify(snap); if (key === N111.sent) return;
  N111.pending = { key, snap }; clearTimeout(N111.timer); N111.timer = setTimeout(n111WidgetFlush, 400);
};
/* uscendo dall'app la fotografia parte subito (Android puo' fermare il JavaScript poco dopo) */
document.addEventListener("visibilitychange", () => { if (document.visibilityState === "hidden") { try { widgetSync(); n111WidgetFlush(); } catch (e) { /* niente */ } } });
/* la scheda di prima (pagina Aiuto) e' sostituita dalla scheda nel Profilo qui sotto */
widgetCard = function () { return ""; };

/* =================== B) "METTI {n} SULLA TUA HOME" =================== */
function n111PetImg(pose) { const p = S.pet || "germo"; return IMG3D(`m/${p === "germo" ? "" : p + "/"}${pose}.webp`); }
/* il widget disegnato in HTML (stessi colori e forme del widget vero) */
function n111Mini(wide) {
  const t = n1(), nm = n111Name(); const tg = todayGoals(); const tot = tg.length || 4; const d = Math.min(tot, (S.done || []).filter((g) => tg.includes(g)).length) || Math.min(2, tot);
  const pill = `<span class="n1pill">${d}/${tot}</span>`;
  return `<div class="n1w ${wide ? "wide" : ""}" data-pet="${esc(S.pet || "germo")}" aria-hidden="true"><i class="n1deco"></i><span class="n1art"><i class="n1blob"></i><img src="${n111PetImg(d >= tot ? "celebrate" : "love")}" alt="" width="160" height="160" decoding="async"></span>`
    + (wide ? `<span class="n1tx"><b>${esc(nm)}</b><span class="n1row">${pill}<small>${esc(t.w.label)}</small></span><i class="n1bar"><i style="width:${Math.round((d / tot) * 100)}%"></i></i></span>`
      : `<span class="n1foot"><b>${esc(nm)}</b>${pill}</span>`) + `</div>`;
}
/* animazione "come si aggiunge": la Home di un telefono, il dito che tiene premuto, il menu "Widget", il widget che arriva */
function n111Demo() {
  const p = n1().p;
  return `<div class="n1demo" aria-hidden="true"><div class="n1ph"><div class="n1apps">${"<i></i>".repeat(8)}</div><span class="n1drop">${n111Mini(false)}</span>`
    + `<span class="n1menu"><span>${esc(((/[«“„‘「『"]\s*([^»”“’」』"]+?)\s*[»”“’」』"]/.exec(p.s2) || [])[1]) || "Widget")}</span></span><span class="n1finger"></span></div></div>`;
}
let n111Size = "small";
function openWidgetPromo(from) {
  if (!isNativeApp() || !S.pet) return;
  const t = n1(), p = t.p, nm = n111Name(); const info = widgetInfo || {}; const can = !!info.canPin; const has = (info.count || 0) > 0;
  N111.promoAt = Date.now(); n111St().wp = n111St().wp || dkey(); save(); trackOnce("widget-scheda-" + (from || "profilo"));
  const steps = `<ol class="n1steps"><li>${esc(p.s1)}</li><li>${esc(p.s2)}</li><li>${esc(p.s3)}</li></ol>`;
  const sizes = `<div class="chips n1sizes" role="radiogroup" aria-label="${esc(p.how)}"><button class="chip" type="button" role="radio" data-n1size="small" aria-checked="${n111Size === "small"}">${esc(p.small)}</button><button class="chip" type="button" role="radio" data-n1size="wide" aria-checked="${n111Size === "wide"}">${esc(p.wide)}</button></div>`;
  layer.innerHTML = `<div class="overlay" role="dialog" aria-modal="true" aria-labelledby="n1T"><div class="box card n1box">
    <h2 id="n1T">${esc(p.t(nm))}</h2><p class="small n1lead">${esc(has ? `${p.have(nm)} ${p.more}` : p.p(nm))}</p>
    ${can ? `<div class="n1pick">${sizes}<div class="n1prev">${n111Mini(n111Size === "wide")}</div></div>` : n111Demo()}
    ${can ? `<button class="btn block" id="n1Pin" type="button">${esc(p.add)}</button><details class="n1how"><summary>${esc(p.how)}</summary>${n111Demo()}${steps}</details>` : steps}
    <button class="btn ghost block" id="closeLayer" type="button">${esc(can ? p.later : p.got)}</button></div></div>`;
  try { if (anim) G.from(".n1box .n1w", { y: 18, scale: 0.9, opacity: 0, duration: 0.45, ease: "back.out(1.8)" }); } catch (e) { /* niente */ }
}
let n111PinAt = 0, n111Before = 0;
document.addEventListener("click", (ev) => {
  const b = ev.target.closest && ev.target.closest("button"); if (!b) return;
  if (b.dataset && b.dataset.n1size) { n111Size = b.dataset.n1size; layer.querySelectorAll("[data-n1size]").forEach((x) => x.setAttribute("aria-checked", String(x === b))); const pv = layer.querySelector(".n1prev"); if (pv) pv.innerHTML = n111Mini(n111Size === "wide"); return; }
  if (b.id === "n1Pin") {
    const p = widgetPlugin(); if (!p || !p.pin) return; n111Before = (widgetInfo && widgetInfo.count) || 0; n111PinAt = Date.now();
    trackOnce("widget-richiesto"); widgetSync(); n111WidgetFlush();
    Promise.resolve(p.pin({ size: n111Size })).then((o) => { closeLayer(); toast(o && o.asked === false ? L().widget.hint : n1().p.confirm); }).catch(() => { toast(L().widget.hint); });
    return;
  }
  if (b.id === "n111W") { ev.stopImmediatePropagation(); widgetRefreshInfo(); openWidgetPromo("profilo"); }
}, true);
/* tornati dalla finestra di Android: se il widget c'e', lo si dice */
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState !== "visible" || !n111PinAt || Date.now() - n111PinAt > 120000) return;
  setTimeout(() => { const p = widgetPlugin(); if (!p || !p.info) return; p.info().then((o) => { widgetInfo = o; if ((o.count || 0) > n111Before) { n111PinAt = 0; toast(n1().p.ok(n111Name())); trackOnce("widget-aggiunto"); } }).catch(() => {}); }, 700);
});
/* proposta una volta sola: dopo 3 giorni d'uso, dopo un obiettivo fatto, mai nei primi 30 secondi, mai nei momenti delicati */
function n111PromoDue() {
  if (!isNativeApp() || !S.pet || (S.tut || 0) < 99 || n111St().wp || n111Quiet()) return false;
  if (!widgetInfo || widgetInfo.count > 0) return false;
  if (n111UseDays() < 3 || (S.firstDay && S.firstDay === dkey())) return false;
  if (Date.now() - N111.t0 < 30000) return false;
  try { if (S.v20rev && Date.now() - (+S.v20rev.last || 0) < 3600e3) return false; } catch (e) { /* niente */ }
  return true;
}
const _completeGoalN111 = completeGoal;
completeGoal = function (...a) {
  let s0 = -1, l0 = S.level; try { s0 = streak(); } catch (e) { /* niente */ }
  const r = _completeGoalN111.apply(this, a);
  try {
    if (n111PromoDue()) nq20("n111widget", "ask", () => { if (n111PromoDue()) openWidgetPromo("proposta"); });
    /* C) momenti felici in piu' per la recensione */
    if (typeof rev20Want === "function") {
      if (s0 !== 30 && streak() === 30) rev20Want("serie-30");
      if (S.level > l0 && Math.floor(S.level / 5) > Math.floor(l0 / 5)) rev20Want("livello-" + S.level);
    }
  } catch (e) { /* niente */ }
  return r;
};
/* scheda nel Profilo (pagina principale, sotto "Invita un amico") */
function n111ProfileCard() {
  try {
    if (!isNativeApp() || !S.pet || tab !== "more") return;
    const app = document.getElementById("app"); if (!app || app.querySelector("#n111W")) return;
    const anchor = app.querySelector('.v2invite[data-pg="main"]') || app.querySelector('#plusCard[data-pg="main"]') || app.querySelector("#plusCard"); if (!anchor) return;
    const p = n1().p, nm = n111Name(); const has = widgetInfo && widgetInfo.count > 0;
    anchor.insertAdjacentHTML("afterend", `<button class="card n1card" type="button" id="n111W" data-pg="main"${(typeof moreSub !== "undefined" && moreSub && moreSub !== "main") ? " hidden" : ""}><span class="n1cart">${n111Mini(false)}</span><span class="n1ctx"><b>${esc(p.t(nm))}</b><small>${esc(has ? p.have(nm) : p.profP(nm))}</small></span><span class="pchev" aria-hidden="true">›</span></button>`);
  } catch (e) { /* niente */ }
}
const _renderN111 = render;
render = function (...a) { const r = _renderN111.apply(this, a); n111ProfileCard(); return r; };
try { new MutationObserver(() => { if (tab === "more" && !document.getElementById("n111W")) n111ProfileCard(); }).observe(document.getElementById("app"), { childList: true }); } catch (e) { /* niente */ }

/* =================== C) RECENSIONE: 3 giorni d'uso, 60 giorni, solo adulti =================== */
if (typeof rev20Allowed === "function") {
  const _rev20AllowedN111 = rev20Allowed;
  rev20Allowed = function (st, now) {
    st = st || S; now = now == null ? Date.now() : now;
    if (!_rev20AllowedN111.call(this, st, now)) return false;
    if (n111UseDays(st) < 3) return false;
    const last = typeof rev20Last === "function" ? rev20Last(st) : 0; if (last && now - last < N111_REVIEW_GAP) return false;
    if (N111.promoAt && now - N111.promoAt < 3600e3) return false;   /* niente recensione subito dopo la scheda del widget */
    return true;
  };
}

/* =================== D) INVITA UN AMICO =================== */
function n111Inv() { const s = n111St(); if (!s.inv || typeof s.inv !== "object") s.inv = {}; return s.inv; }
const n111Rand = (n, abc) => { const a = new Uint8Array(n); crypto.getRandomValues(a); return Array.from(a, (x) => abc[x % abc.length]).join(""); };
const n111Code = () => n111Rand(8, N111_CODE_ABC); /* 32 simboli: x % 32 senza sbilanciamenti */
const n111Hex = (n) => { const a = new Uint8Array(n); crypto.getRandomValues(a); return Array.from(a, (x) => x.toString(16).padStart(2, "0")).join(""); };
async function n111Sha(s) { const h = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s)); return Array.from(new Uint8Array(h), (x) => x.toString(16).padStart(2, "0")).join(""); }
const N111_CODE_RE = /^[A-HJ-NP-Z2-9]{8}$/;
/* referrer di Google Play: "utm_source=invito&utm_medium=amico&tan=CODICE" (Google lo consegna gia' decodificato; per
   sicurezza si decodifica ancora una volta se arriva codificato) */
function n111ParseRef(ref) {
  let s = String(ref || ""); if (/%3D/i.test(s) && !/=/.test(s)) { try { s = decodeURIComponent(s); } catch (e) { /* resta com'e' */ } }
  const m = /(?:^|&)tan=([A-Za-z0-9]{8})(?:&|$)/.exec(s); const c = m ? m[1].toUpperCase() : ""; return N111_CODE_RE.test(c) ? c : "";
}
function n111Link(code) { return PLAY_URL + "&referrer=" + encodeURIComponent(`utm_source=invito&utm_medium=amico&tan=${code}`); }
/* una chiamata al codice nativo che non risponde (servizio di Google Play bloccato) non deve fermare il resto */
const n111Wait = (p, ms) => Promise.race([Promise.resolve(p), new Promise((res) => setTimeout(() => res(null), ms || 10000))]);
const n111Paid = (n) => { try { const e = econ(); e.paid = (+e.paid || 0) + n; } catch (e) { /* niente */ } };
const n111Err = (e) => String((e && e.code) || "");
const n111Denied = (e) => /permission-denied|not-found|already-exists|invalid-argument/.test(n111Err(e));

/* 1) primo avvio: il codice dell'invito, letto una volta sola */
async function n111ReadRef() {
  const s = n111St(); if (s.ref) return; const g = growthPlugin(); if (!g || !g.referrer) return;
  let r; try { r = await n111Wait(g.referrer(), 12000); } catch (e) { return; }
  if (!r || !r.done) return; s.ref = 1;
  const code = n111ParseRef(r.ref); const click = +r.click || 0, inst = +r.install || 0;
  /* controllo dei tempi: il clic sul link viene prima dell'installazione (2 minuti di tolleranza), entro 90 giorni */
  if (code && click > 0 && inst > 0 && inst + 120 >= click && inst - click < 90 * 86400) { n111Inv().from = { code, st: "new", days: [], tries: 0 }; trackOnce("invito-arrivato"); }
  else if (code) trackOnce("invito-scartato");
  save();
}
/* 2) l'amico (solo adulto): si registra sul server con l'impronta del telefono; il regalo arriva solo se il server dice si' */
async function n111Claim() {
  const f = n111Inv().from; if (!N111_INVITE || !f || f.st !== "new" || !n111Adult() || !S.pet || (S.tut || 0) < 99) return;
  if ((n111Inv().own || {}).code === f.code) { f.st = "bad"; save(); return; }  /* il proprio codice */
  const g = growthPlugin(); if (!g || !g.device) return;
  /* senza rete si riprova: al massimo 3 volte al giorno, per 30 giorni diversi (il referrer vale 90 giorni) */
  const day = dkey(); if (f.td !== day) { f.td = day; f.tn = 0; f.tries = (f.tries || 0) + 1; }
  if (f.tries > 30) { f.st = "bad"; save(); return; }
  if ((f.tn || 0) >= 3) return; f.tn = (f.tn || 0) + 1; save();
  try {
    const dev = ((await n111Wait(g.device(), 5000)) || {}).dev; if (!/^[0-9a-f]{64}$/.test(dev || "")) return;
    const cid = n111Rand(20, "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"), k = n111Hex(16), kh = await n111Sha(k);
    await fbLoad();
    /* prima si guarda che il codice esista: se il server non risponde (regole non ancora pubblicate, niente rete) si riprova
       piu' tardi senza perdere il regalo; se il codice non esiste l'invito non vale */
    let ex; try { ex = await window.TanFB.invGet(f.code); } catch (e) { return; }
    if (!ex) { f.st = "bad"; save(); trackOnce("invito-rifiutato"); return; }
    await window.TanFB.invClaim(f.code, cid, kh, dev);
    Object.assign(f, { st: "sent", cid, k, day: dkey(), days: [dkey()] }); S.seeds += N111_GIFT; n111Paid(N111_GIFT); save(); trackOnce("invito-regalo-amico");
    nq20("n111gift", "gift", n111GiftSheet);
  } catch (e) { if (n111Denied(e)) { f.st = "bad"; save(); trackOnce("invito-rifiutato"); } }
}
/* 3) l'amico usa l'app in 3 giorni diversi (dal giorno dell'arrivo): si segna sul server, poi niente piu' */
async function n111Qualify() {
  const f = n111Inv().from; if (!f || f.st !== "sent" || !S.pet) return;
  const d = dkey(); if (!Array.isArray(f.days)) f.days = []; if (!f.days.includes(d) && d >= (f.day || d)) { f.days.push(d); f.days = f.days.slice(-5); save(); }
  if (f.days.length < 3 || f.qd === d && (f.qn || 0) >= 2) return;
  f.qn = f.qd === d ? (f.qn || 0) + 1 : 1; f.qd = d; save();
  try { await fbLoad(); await window.TanFB.invQualify(f.code, f.cid, f.k); f.st = "ok"; save(); trackOnce("invito-3-giorni"); }
  catch (e) { if (/not-found/.test(n111Err(e))) { f.st = "bad"; save(); } /* troppo presto o niente rete: si riprova al prossimo avvio */ }
}
/* 4) chi invita: una volta al giorno (o aprendo la scheda) controlla quanti amici sono arrivati al 3° giorno */
async function n111CheckRewards(force) {
  const o = n111Inv().own; if (!o || !o.code || !n111Adult() || (o.got || 0) >= N111_MAX) return;
  if (!force && o.chk === dkey()) return;
  try {
    await fbLoad(); const r = await window.TanFB.invGet(o.code); o.chk = dkey(); if (!r) { save(); return; }
    o.q = Math.max(+o.q || 0, +r.q || 0); const n = Math.min(o.q, N111_MAX) - (o.got || 0);
    if (n > 0) { o.got = (o.got || 0) + n; S.seeds += n * N111_REWARD; n111Paid(n * N111_REWARD); save(); trackOnce("invito-premio"); nq20("n111rew", "gift", () => n111RewardSheet(n)); }
    else save();
  } catch (e) { /* niente rete: domani */ }
}
async function n111EnsureCode() {
  const inv = n111Inv(); if (inv.own && inv.own.code) return inv.own.code;
  const g = growthPlugin(); if (!g || !g.device) throw new Error("no");
  const dev = ((await n111Wait(g.device(), 5000)) || {}).dev; if (!/^[0-9a-f]{64}$/.test(dev || "")) throw new Error("no"); await fbLoad();
  for (let i = 0; i < 3; i++) {
    const code = n111Code();
    /* codice gia' usato da qualcun altro (rarissimo): se ne prova un altro. Se il server non risponde, errore di rete. */
    if (await window.TanFB.invGet(code)) continue;
    try { await window.TanFB.invCreate(code, dev); inv.own = { code, at: dkey(), got: 0, q: 0, chk: dkey() }; save(); trackOnce("invito-codice"); return code; }
    catch (e) { if (!n111Denied(e)) throw e; } /* codice gia' usato da qualcun altro: se ne prova un altro */
  }
  throw new Error("no");
}

/* finestre */
function n111GiftSheet() {
  const i = n1().i;
  layer.innerHTML = `<div class="overlay" role="dialog" aria-modal="true" aria-labelledby="n1gT"><div class="box card n1gift"><div class="n1gart">${moment3d("gift", "n1gimg")}</div><h2 id="n1gT">${esc(i.gT)}</h2><p>${esc(i.gP(N111_GIFT))}</p><p class="svgift">${SEED}<b>+${N111_GIFT}</b></p><button class="btn" id="closeLayer" type="button">${esc(i.gB)}</button></div></div>`;
  try { SND.play("fanfare"); if (!n111Quiet()) burst("confetti", 18); } catch (e) { /* niente */ }
}
function n111RewardSheet(n) {
  const i = n1().i;
  layer.innerHTML = `<div class="overlay" role="dialog" aria-modal="true" aria-labelledby="n1rT"><div class="box card n1gift"><div class="n1gart">${moment3d("love", "n1gimg")}</div><h2 id="n1rT">${esc(i.rT)}</h2><p>${esc(i.rP(n))}</p><p class="svgift">${SEED}<b>+${n * N111_REWARD}</b></p><button class="btn" id="closeLayer" type="button">${esc(i.rB)}</button></div></div>`;
  try { SND.play("fanfare"); if (!n111Quiet()) burst("confetti", 18); } catch (e) { /* niente */ }
}
function openInviteSheet() {
  const i = n1().i, inv = n111Inv(), o = inv.own || {}; const got = o.got || 0;
  const status = o.code ? `<p class="small n1st">${esc(got >= N111_MAX ? i.all : i.st(Math.min(+o.q || 0, N111_MAX), N111_MAX))}</p>` : "";
  layer.innerHTML = `<div class="overlay" role="dialog" aria-modal="true" aria-labelledby="n1iT"><div class="box card n1inv"><div class="n1gart">${moment3d("gift", "n1gimg")}</div>
    <h2 id="n1iT">${esc(L().v12.invT)}</h2><div class="n1gifts"><span>${SEED}<b>+${N111_GIFT}</b></span><span>${SEED}<b>+${N111_REWARD}</b></span></div>
    <p>${esc(i.p(N111_GIFT, N111_REWARD))}</p><p class="small muted">${esc(i.max(N111_MAX))}</p>${status}
    <button class="btn block" id="n1Send" type="button">${icon("share")}<span>${esc(i.b)}</span></button><button class="btn ghost block" id="closeLayer" type="button">${esc(n1().p.later)}</button></div></div>`;
  trackOnce("invito-aperto");
  if (o.code) n111CheckRewards(true).then(() => { const el = layer.querySelector(".n1st"); const x = n111Inv().own || {}; if (el) el.textContent = (x.got || 0) >= N111_MAX ? i.all : i.st(Math.min(+x.q || 0, N111_MAX), N111_MAX); });
}
document.addEventListener("click", (ev) => {
  const b = ev.target.closest && ev.target.closest("#n1Send"); if (!b || N111.busy) return;
  const i = n1().i; N111.busy = true; b.disabled = true; b.setAttribute("aria-busy", "true");
  n111EnsureCode().then(async (code) => {
    const text = `${i.text(N111_GIFT)} ${n111Link(code)}`; const p = typeof sharePlugin === "function" ? sharePlugin() : null;
    if (p && p.share) await p.share({ text, title: "Tanetto" }); else if (navigator.share) await navigator.share({ title: "Tanetto", text });
    trackOnce("invito-inviato");
  }).catch((e) => { if (!(e && e.name === "AbortError")) toast(i.net); })
    .finally(() => { N111.busy = false; b.disabled = false; b.removeAttribute("aria-busy"); });
}, true);
/* il server dell'invito e' pronto? (regole pubblicate). Una lettura di prova al giorno: "permesso negato" = non ancora. */
const n111SrvOn = () => { const v = n111St().srv; return !!(N111_INVITE && v && v.on); };
async function n111Probe(force) {
  if (!N111_INVITE || !n111Adult()) return false; const s = n111St(); const d = dkey();
  if (!force && s.srv && s.srv.d === d) return !!s.srv.on;
  try { await fbLoad(); await window.TanFB.invGet("AAAAAAAA"); s.srv = { d, on: true }; }
  catch (e) { if (/permission-denied/.test(n111Err(e))) s.srv = { d, on: false }; else return n111SrvOn(); } /* senza rete: come prima */
  save(); return !!s.srv.on;
}
/* "Invita un amico" (Profilo e "tutto fatto"): agli adulti nell'app, con il server pronto, la scheda con i regali;
   altrimenti la condivisione di prima (senza premi) */
const _inviteFlowN111 = inviteFlow;
inviteFlow = function (...a) {
  if (!n111Adult() || !N111_INVITE) return _inviteFlowN111.apply(this, a);
  const s = n111St(); if (s.srv && s.srv.d === dkey()) { if (s.srv.on) { openInviteSheet(); return; } return _inviteFlowN111.apply(this, a); }
  /* una lettura di prova al giorno, solo quando si tocca "Invita un amico" (al massimo 4 secondi di attesa) */
  const self = this; n111Wait(n111Probe(false), 4000).then((on) => { if (on) openInviteSheet(); else _inviteFlowN111.apply(self, a); });
};

/* avvio: referrer (una volta), poi le parti dell'invito, senza fretta (mai nei primi secondi) */
async function n111Boot() {
  if (!isNativeApp()) return;
  try { await n111ReadRef(); } catch (e) { /* niente */ }
  if (!N111_INVITE) return;
  try { await n111Claim(); } catch (e) { /* niente */ }
  try { await n111Qualify(); } catch (e) { /* niente */ }
  try { await n111CheckRewards(false); } catch (e) { /* niente */ }
}
setTimeout(n111Boot, 6000);
document.addEventListener("visibilitychange", () => { if (document.visibilityState === "visible" && isNativeApp() && Date.now() - N111.t0 > 60000) setTimeout(n111Boot, 2500); });
/* per le prove (tests/t110/t_n111_native.py) */
window.__n111 = { probe: n111Probe, srvOn: n111SrvOn, snap: n111Snap, parse: n111ParseRef, link: n111Link, promoDue: n111PromoDue, openPromo: openWidgetPromo, openInvite: openInviteSheet, boot: n111Boot, claim: n111Claim, qualify: n111Qualify, rewards: n111CheckRewards, useDays: n111UseDays, gift: n111GiftSheet, reward: n111RewardSheet, adult: n111Adult, st: () => n111St(), N: N111 };
