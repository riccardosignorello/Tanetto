/* =================== SUONI E MUSICA (sintetizzati, nessun file esterno) =================== */
const SND = (() => {
  let an = null, ctx = null, master = null, fxBus = null, musicBus = null, verb = null, musicTimer = null, nextT = 0, step = 0, pad = null, lastAt = 0;
  let cur = 0, song = null, onTrack = null;
  function impulse(c, secs, decay) {
    const len = Math.floor(c.sampleRate * secs), buf = c.createBuffer(2, len, c.sampleRate);
    for (let ch = 0; ch < 2; ch++) { const d = buf.getChannelData(ch); for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay); }
    return buf;
  }
  /* v17: l'eco della musica si prepara a pezzetti, senza bloccare il primo tocco (prima costava ~100 ms sui telefoni lenti) */
  function impulseLater(c, secs, decay, done) {
    const len = Math.floor(c.sampleRate * secs), buf = c.createBuffer(2, len, c.sampleRate);
    const d0 = buf.getChannelData(0), d1 = buf.getChannelData(1); let i = 0;
    const step = () => { const end = Math.min(len, i + 8000); for (; i < end; i++) { const k = Math.pow(1 - i / len, decay); d0[i] = (Math.random() * 2 - 1) * k; d1[i] = (Math.random() * 2 - 1) * k; } if (i < len) setTimeout(step, 0); else done(buf); };
    setTimeout(step, 30);
  }
  function ensure() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      try {
        ctx = new AC();
        master = ctx.createGain(); master.gain.value = 1; master.connect(ctx.destination);
        an = ctx.createAnalyser(); an.fftSize = 2048; master.connect(an);
        const comp = ctx.createDynamicsCompressor(); comp.threshold.value = -14; comp.ratio.value = 3; comp.connect(master);
        fxBus = ctx.createGain(); fxBus.gain.value = 0.7; fxBus.connect(comp);
        musicBus = ctx.createGain(); musicBus.gain.value = 0; const warm = ctx.createBiquadFilter(); warm.type = "lowpass"; warm.frequency.value = 2600; warm.Q.value = 0.5; musicBus.connect(warm); warm.connect(comp);
        verb = ctx.createConvolver(); impulseLater(ctx, 2.2, 2.6, (bf) => { try { verb.buffer = bf; } catch (e) { /* niente */ } });
        const wet = ctx.createGain(); wet.gain.value = 0.38; musicBus.connect(verb); verb.connect(wet); wet.connect(comp);
      } catch (e) { ctx = null; return null; }
      prime();
    }
    if (ctx.state === "suspended") { try { ctx.resume(); } catch (e) { /* niente */ } }
    return ctx;
  }
  function tone(f, t0, dur, o = {}) {
    const { type = "sine", vol = 0.2, attack = 0.006, dest = fxBus, glide = null, filter = null } = o;
    if (![f, t0, dur, vol].every(Number.isFinite)) return;
    const osc = ctx.createOscillator(), g = ctx.createGain();
    osc.type = type; osc.frequency.setValueAtTime(f, t0);
    if (glide) osc.frequency.exponentialRampToValueAtTime(glide, t0 + dur * 0.8);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(vol, t0 + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    if (filter) { const lp = ctx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = filter; osc.connect(lp); lp.connect(g); } else osc.connect(g);
    g.connect(dest); osc.start(t0); osc.stop(t0 + dur + 0.05);
  }
  function noise(t0, dur, vol, freq, dest = fxBus) {
    const len = Math.floor(ctx.sampleRate * dur), buf = ctx.createBuffer(1, len, ctx.sampleRate), d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    const src = ctx.createBufferSource(); src.buffer = buf;
    const bp = ctx.createBiquadFilter(); bp.type = "bandpass"; bp.frequency.value = freq; bp.Q.value = 1.2;
    const g = ctx.createGain(); g.gain.setValueAtTime(vol, t0); g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    src.connect(bp); bp.connect(g); g.connect(dest); src.start(t0); src.stop(t0 + dur + 0.02);
  }
  function bell(f, t0, vol = 0.18, dest = fxBus, len = 1.2) {
    tone(f, t0, len, { type: "sine", vol, dest });
    tone(f * 2, t0, len * 0.6, { type: "sine", vol: vol * 0.35, dest });
    tone(f * 3.01, t0, len * 0.3, { type: "triangle", vol: vol * 0.12, dest });
  }
  const INST = {
    bell: (f, t, v, d) => bell(f, t, v, d, 1.6),
    box: (f, t, v, d) => { tone(f, t, 1.1, { vol: v, dest: d }); tone(f * 2, t, 0.5, { vol: v * 0.45, dest: d }); tone(f * 4, t, 0.12, { vol: v * 0.12, dest: d }); },
    marimba: (f, t, v, d) => { tone(f, t, 0.45, { vol: v * 1.2, dest: d, attack: 0.003 }); tone(f * 3.9, t, 0.06, { vol: v * 0.25, dest: d, attack: 0.002 }); },
    keys: (f, t, v, d) => { tone(f, t, 1.2, { type: "triangle", vol: v, dest: d, attack: 0.012, filter: 1600 }); tone(f / 2, t, 1.0, { vol: v * 0.3, dest: d, attack: 0.02 }); },
    kalimba: (f, t, v, d) => { tone(f, t, 0.9, { vol: v * 1.1, dest: d, attack: 0.002 }); tone(f * 5.4, t, 0.08, { vol: v * 0.12, dest: d, attack: 0.002 }); tone(f * 2.01, t, 0.3, { vol: v * 0.2, dest: d }); },
    harp: (f, t, v, d) => { tone(f, t, 1.4, { type: "triangle", vol: v * 0.9, dest: d, attack: 0.004, filter: 2400 }); tone(f * 2, t, 0.6, { vol: v * 0.2, dest: d }); },
    flute: (f, t, v, d) => { const o = ctx.createOscillator(), g = ctx.createGain(), lfo = ctx.createOscillator(), lg = ctx.createGain(); o.type = "sine"; o.frequency.value = f; lfo.frequency.value = 5; lg.gain.value = f * 0.006; lfo.connect(lg); lg.connect(o.frequency); g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(v * 0.7, t + 0.12); g.gain.exponentialRampToValueAtTime(0.0001, t + 1.1); o.connect(g); g.connect(d); o.start(t); lfo.start(t); o.stop(t + 1.2); lfo.stop(t + 1.2); }
  };
  const FX = {
    tap: (t) => { tone(740, t, 0.07, { vol: 0.3, glide: 980 }); },
    pop: (t) => { tone(520, t, 0.16, { type: "sine", vol: 0.3, glide: 980 }); tone(1040, t + 0.05, 0.12, { vol: 0.1 }); },
    chime: (t) => { [784, 988, 1319].forEach((f, i) => bell(f, t + i * 0.075, 0.2, fxBus, 0.9)); },
    coin: (t) => { tone(988, t, 0.09, { type: "triangle", vol: 0.2 }); tone(1319, t + 0.08, 0.32, { type: "triangle", vol: 0.2 }); },
    fanfare: (t) => { [523, 659, 784].forEach((f, i) => bell(f, t + i * 0.12, 0.2, fxBus, 0.7)); bell(1047, t + 0.38, 0.25, fxBus, 1.6); tone(523, t + 0.38, 1.4, { type: "triangle", vol: 0.08 }); },
    logo: (t) => { tone(392, t, 0.32, { vol: 0.09, glide: 784 }); [784, 988, 1175, 1568].forEach((f, i) => bell(f, t + 0.16 + i * 0.085, 0.13, fxBus, 0.9)); [523, 659, 784].forEach((f) => tone(f, t + 0.5, 0.95, { type: "triangle", vol: 0.05, attack: 0.06, filter: 1800 })); [2093, 2637].forEach((f, i) => bell(f, t + 0.62 + i * 0.06, 0.06, fxBus, 0.6)); },
    jingle: (t) => { [1319, 1568, 1760, 2093, 1760].forEach((f, i) => bell(f, t + i * 0.07, 0.13, fxBus, 0.6)); },
    depart: (t) => { tone(330, t, 0.6, { type: "triangle", vol: 0.18, glide: 990 }); noise(t, 0.5, 0.12, 1800); },
    back: (t) => { [659, 784, 988, 1175].forEach((f, i) => bell(f, t + i * 0.09, 0.16, fxBus, 0.8)); },
    click: (t) => { tone(1200, t, 0.05, { vol: 0.2, glide: 1600 }); },
    buy: (t) => { tone(784, t, 0.1, { type: "triangle", vol: 0.18 }); bell(1175, t + 0.08, 0.18, fxBus, 0.7); },
    chomp: (t) => { [0, 0.16, 0.32].forEach((d) => { noise(t + d, 0.07, 0.35, 900); tone(220, t + d, 0.08, { vol: 0.12, glide: 140 }); }); },
    purr: (t) => { tone(160, t, 0.18, { vol: 0.3, glide: 120 }); },
    giggle: (t) => { [880, 990, 880, 1040, 920].forEach((f, i) => tone(f, t + i * 0.07, 0.07, { vol: 0.12, glide: f * 1.15 })); },
    shutter: (t) => { noise(t, 0.05, 0.5, 3000); noise(t + 0.08, 0.06, 0.35, 2000); },
    paper: (t) => { noise(t, 0.25, 0.18, 4200); noise(t + 0.15, 0.2, 0.12, 3200); },
    sparkle: (t) => { [1568, 2093, 2637].forEach((f, i) => bell(f, t + i * 0.05, 0.08, fxBus, 0.5)); },
    lightoff: (t) => { tone(660, t, 0.3, { vol: 0.12, glide: 330 }); },
    lighton: (t) => { tone(440, t, 0.3, { vol: 0.12, glide: 880 }); bell(1319, t + 0.15, 0.1, fxBus, 0.6); },
    beep: (t) => { tone(880, t, 0.12, { type: "triangle", vol: 0.32 }); },
    go: (t) => { tone(1319, t, 0.3, { type: "triangle", vol: 0.16 }); },
    miss: (t) => { tone(300, t, 0.15, { vol: 0.2, glide: 200 }); }
  };
  /* 1.0.11 (suono subito su Android): i suoni brevi dell'interfaccia si preparano UNA volta come AudioBuffer, resi con un
     OfflineAudioContext dalle stesse funzioni FX e logoTickTo (quindi suonano uguali), e al tocco partono con start(0):
     nessun grafo da costruire e nessun orario nel futuro. Finche' non sono pronti (o senza OfflineAudioContext) si
     sintetizzano come prima. Durate = coda reale del suono (ultimo inviluppo + stop), controllate dalla prova t_113_sfx. */
  const PRE = { tap: 0.15, click: 0.12, pop: 0.3, coin: 0.48, buy: 0.85, beep: 0.2, go: 0.38, miss: 0.23, purr: 0.26, lightoff: 0.38, lighton: 0.8, shutter: 0.18, sparkle: 0.65, giggle: 0.5, chime: 1.15, jingle: 0.95, back: 1.12, paper: 0.42 };
  const BUF = {}; const trace = []; let priming = false;
  function renderOff(len, ch, draw, done) {
    const OAC = window.OfflineAudioContext || window.webkitOfflineAudioContext; if (!OAC || !ctx) { done(null); return; }
    let oc = null; try { oc = new OAC(ch, Math.ceil(ctx.sampleRate * len), ctx.sampleRate); } catch (e) { done(null); return; }
    /* le funzioni FX usano il contesto e l'uscita "di casa": per un attimo (sincrono) puntano a quelli offline */
    const keepC = ctx, keepB = fxBus; let ok = true;
    try { ctx = oc; fxBus = oc.destination; draw(oc); } catch (e) { ok = false; } finally { ctx = keepC; fxBus = keepB; }
    if (!ok) { done(null); return; }
    let fin = false; const end = (b) => { if (!fin) { fin = true; done(b || null); } };
    oc.oncomplete = (e) => end(e && e.renderedBuffer);
    try { const pr = oc.startRendering(); if (pr && pr.then) pr.then(end, () => end(null)); } catch (e) { end(null); }
  }
  function prime() {
    if (priming || !ctx) return; priming = true;
    const jobs = Object.keys(PRE).map((n) => [n, PRE[n], 1, () => FX[n](0)])
      .concat([0, 1, 2, 3].map((i) => ["tick" + i, 1.45, 2, (oc) => logoTickTo(oc, oc.destination, i + 1, 0)]));
    /* senza togliere tempo all'interfaccia: si comincia 1,2 s dopo il primo tocco (le animazioni di quel tocco non si fermano)
       e ogni suono si prepara in un momento libero; finche' non e' pronto suona sintetizzato come prima */
    const idle = (f) => { try { if (window.requestIdleCallback) { requestIdleCallback(f, { timeout: 1500 }); return; } } catch (e) { /* niente */ } setTimeout(f, 40); };
    const next = () => { const j = jobs.shift(); if (!j) return; renderOff(j[1], j[2], j[3], (b) => { if (b) BUF[j[0]] = b; idle(next); }); };
    setTimeout(() => idle(next), 1200);
  }
  function fire(name) {
    const b = BUF[name]; if (!b) return false;
    const src = ctx.createBufferSource(); src.buffer = b; src.connect(fxBus); src.start(0); return true;
  }
  function note1(n, via) { trace.push({ n, via, at: performance.now(), st: ctx ? ctx.state : "" }); if (trace.length > 40) trace.shift(); }
  /* 1.0.9: LOGO SONORO di Tanetto (come nel video): ogni obiettivo spuntato suona la nota successiva di
     Sol5-La5-Si5-Re6 (gradi 1-2-3-5 di Sol maggiore), la giornata completa suona il "chime" Sol-Si-Re che finisce
     sulla dominante. Kalimba a modello fisico leggero (lamella incastrata: parziali 1 : 6.27 : 17.55, ronzio di 2a
     armonica, colpo di cassa in legno, tocco di unghia) + celesta un'ottava sopra a -9 dB. Nessun file audio.
     Funzioni pure (contesto e uscita come argomenti): le usano anche i test con un OfflineAudioContext. */
  const LOGO_HZ = [783.99, 880.0, 987.77, 1174.66];          /* G5 A5 B5 D6 */
  const CHIME_HZ = [783.99, 987.77, 1174.66];                /* G5 B5 D6 */
  const S16 = 60 / 112.5 / 4;                                /* sedicesimo a 112,5 BPM (tempo del video) */
  let noiseBuf = null;
  function logoPart(c, d, f, t, amp, tau, type) {
    if (!(f > 20 && f < c.sampleRate * 0.45) || !(amp > 0)) return;
    const o = c.createOscillator(), g = c.createGain(); o.type = type || "sine"; o.frequency.setValueAtTime(f, t);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(amp, t + 0.0012); g.gain.setTargetAtTime(0, t + 0.0012, tau);
    o.connect(g); g.connect(d); o.start(t); o.stop(t + 0.0012 + tau * 7);
  }
  function logoKal(c, d, f, t, a, pan, tail, knock) {
    let out = d;
    if (pan && c.createStereoPanner) { const p = c.createStereoPanner(); p.pan.value = pan; p.connect(d); out = p; }
    const T0 = tail || 1;
    logoPart(c, out, f, t, a, 0.19 * T0);                     /* lamella */
    logoPart(c, out, f * 2, t, a * 0.06, 0.11 * T0);          /* 2a armonica (ronzio) */
    logoPart(c, out, f * 6.27, t, a * 0.75, 0.05);            /* modo della lamella incastrata */
    logoPart(c, out, f * 17.55, t, a * 0.06, 0.009);          /* modo alto, solo se sotto Nyquist */
    logoPart(c, out, 238 + (f % 24), t, a * 0.9 * (knock == null ? 1 : knock), 0.03);       /* colpo della cassa di legno */
    logoPart(c, out, f * 2, t, a * 0.05, 0.24 * T0);           /* celesta all'ottava (-9 dB circa con il ronzio) */
    logoPart(c, out, f * 8, t, a * 0.018, 0.05);              /* luccichio della celesta */
    /* tocco del pollice: 4 ms di rumore filtrato 1,2-6 kHz */
    try {
      if (!noiseBuf || noiseBuf.sampleRate !== c.sampleRate) { const n = Math.floor(c.sampleRate * 0.006); noiseBuf = c.createBuffer(1, n, c.sampleRate); const x = noiseBuf.getChannelData(0); let r = 7; for (let i = 0; i < n; i++) { r = (r * 16807) % 2147483647; x[i] = (r / 1073741823.5 - 1) * Math.exp(-i / (0.0008 * c.sampleRate)); } }
      const src = c.createBufferSource(), bp = c.createBiquadFilter(), g = c.createGain(); src.buffer = noiseBuf; bp.type = "bandpass"; bp.frequency.value = 2700; bp.Q.value = 0.8; g.gain.value = a * 0.4;
      src.connect(bp); bp.connect(g); g.connect(out); src.start(t); src.stop(t + 0.008);
    } catch (e) { /* niente */ }
  }
  /* k = quanti obiettivi sono fatti oggi (1, 2, 3...): la nota gira G A B D G A... */
  function logoTickTo(c, d, k, t) { const i = (Math.max(1, k | 0) - 1) % 4; logoKal(c, d, LOGO_HZ[i], t, 0.26, i % 2 ? 0.18 : -0.18); return LOGO_HZ[i]; }
  function logoChimeTo(c, d, t) {
    const vel = [1, 0.86, 0.92];
    CHIME_HZ.forEach((f, i) => { const ti = t + i * S16; logoKal(c, d, f, ti, 0.24 * vel[i], (i - 1) * 0.16, i === 2 ? 1.25 : 1, 0.3); logoPart(c, d, f * 2, ti, 0.012 * vel[i], i === 2 ? 0.4 : 0.22); });
    return CHIME_HZ.slice();
  }
  /* rispettano le impostazioni: niente suono con "Suoni" spento */
  function logoTick(k) { lastAt = performance.now(); if (!S.sfx) return null; const c = ensure(); if (!c) return null; try { const i = (Math.max(1, k | 0) - 1) % 4; if (fire("tick" + i)) { note1("tick" + i, "buf"); return LOGO_HZ[i]; } note1("tick" + i, "syn"); return logoTickTo(c, fxBus, k, c.currentTime + 0.005); } catch (e) { return null; } }
  function logoChime(delay) { lastAt = performance.now(); if (!S.sfx) return null; const c = ensure(); if (!c) return null; try { return logoChimeTo(c, fxBus, c.currentTime + 0.005 + (delay || 0)); } catch (e) { return null; } }
  let combo = 0, comboAt = 0;
  function catchSound(gold) {
    if (!S.sfx) return; const c = ensure(); if (!c) return; lastAt = performance.now();
    const now = performance.now(); combo = now - comboAt < 900 ? Math.min(combo + 1, 7) : 0; comboAt = now;
    const PENT = [784, 880, 988, 1175, 1319, 1568, 1760, 2093];
    try { bell(PENT[combo], c.currentTime + 0.005, gold ? 0.22 : 0.15, fxBus, 0.5); if (gold) FX.sparkle(c.currentTime + 0.05); } catch (e) { /* niente */ }
  }
  function play(name) {
    lastAt = performance.now();
    if (!S.sfx || !FX[name]) return;
    const c = ensure(); if (!c) return;
    try { if (fire(name)) note1(name, "buf"); else { FX[name](c.currentTime + 0.01); note1(name, "syn"); } } catch (e) { /* niente */ }
    /* 1.0.10 (A-02): con la musica accesa, la musica si abbassa un attimo sotto il suono (si sente sempre il tocco) */
    try { if (musicTimer && musicBus) { const t0 = c.currentTime, g = MUSIC_K * curGain(); musicBus.gain.cancelScheduledValues(t0); musicBus.gain.setTargetAtTime(g * 0.5, t0, 0.03); musicBus.gain.setTargetAtTime(g, t0 + 0.6, 0.25); } } catch (e) { /* niente */ }
  }
  /* 1.0.9 (fase 3): il motivo di ogni compagno (scratchpad/gpu/characters.md), tutti in Sol maggiore pentatonico come il
     logo, con la stessa kalimba/celesta; brevi (sotto 1,2 s), piano, mai insistenti. Germo = il logo stesso. */
  const E8 = S16 * 2;
  const MOTIF = {
    germo: (c, d, t) => { LOGO_HZ.forEach((f, i) => logoKal(c, d, f, t + i * S16, 0.2, i % 2 ? 0.15 : -0.15)); },
    ondi: (c, d, t) => { [587.33, 493.88, 392.0].forEach((f, i) => logoKal(c, d, f, t + i * E8 * 1.5, 0.2 - i * 0.03, -0.1, 1.5)); /* goccia */ tone(1400, t + E8 * 4.4, 0.12, { vol: 0.05, glide: 700, dest: d }); },
    lumi: (c, d, t) => { [987.77, 1174.66, 1567.98].forEach((f, i) => { bell(f, t + i * E8 * 1.4, 0.11, d, 1.6); tone(f * 2, t + i * E8 * 1.4, 0.9, { vol: 0.012, dest: d }); }); },
    miko: (c, d, t) => { logoKal(c, d, 987.77, t, 0.18, -0.1); tone(1108.73, t + E8, 0.45, { vol: 0.11, glide: 1174.66, dest: d, attack: 0.01 }); /* fusa */ tone(70, t + E8, 0.5, { type: "triangle", vol: 0.048, dest: d, filter: 300 }); },
    rufi: (c, d, t) => { [880.0, 987.77, 1174.66, 1318.51].forEach((f, i) => logoKal(c, d, f, t + i * S16 * 0.8, 0.16, (i - 1.5) * 0.1, 0.5)); },
    pingo: (c, d, t) => { [[783.99, 0, 0.6], [783.99, E8, 0.6], [1174.66, E8 * 2, 1.3]].forEach(([f, dt, tl]) => { tone(f, t + dt, 0.2 * tl, { type: "sine", vol: 0.25, dest: d, attack: 0.003 }); tone(f * 4, t + dt, 0.05, { vol: 0.075, dest: d, attack: 0.002 }); }); },
    dori: (c, d, t) => { tone(392.0, t, 0.7, { type: "triangle", vol: 0.175, dest: d, filter: 1200, attack: 0.03 }); tone(493.88, t, 0.7, { type: "triangle", vol: 0.15, dest: d, filter: 1200, attack: 0.03 }); noise(t + 0.45, 0.12, 0.075, 900, d); bell(1975.53, t + 0.62, 0.175, d, 0.9); }
  };
  function petMotif(pet) {
    lastAt = performance.now(); if (!S.sfx) return false; const f = MOTIF[pet] || MOTIF.germo; const c = ensure(); if (!c) return false;
    try { f(c, fxBus, c.currentTime + 0.02); return true; } catch (e) { return false; }
  }
  function haptic(p = 8) { try { if (S.haptic && navigator.vibrate && (!navigator.userActivation || navigator.userActivation.hasBeenActive)) navigator.vibrate(p); } catch (e) { /* niente */ } } /* 1.0.9: prima di un tocco il sistema la blocca comunque (e scrive un errore): una finestra che si apre da sola non vibra */

  /* --- Musica: 12 brani, ognuno con stile, strumenti, tempo e ritmo diversi --- */
  const N = (s) => 440 * Math.pow(2, s / 12);
  const MODES = { major: [0, 2, 4, 5, 7, 9, 11], dorian: [0, 2, 3, 5, 7, 9, 10], lydian: [0, 2, 4, 6, 7, 9, 11], penta: [0, 2, 4, 7, 9], mixo: [0, 2, 4, 5, 7, 9, 10] };
  const VOL = { bell: 0.08, box: 0.09, marimba: 0.09, keys: 0.1, kalimba: 0.1, harp: 0.09, flute: 0.08, chip: 0.05, guitar: 0.1, celesta: 0.08, epiano: 0.11 };
  Object.assign(INST, {
    chip: (f, t, v, d) => { tone(f, t, 0.28, { type: "square", vol: v * 0.7, dest: d, attack: 0.004, filter: 1500 }); },
    guitar: (f, t, v, d) => { tone(f, t, 0.9, { type: "triangle", vol: v, dest: d, attack: 0.003, filter: 1800 }); tone(f * 2, t, 0.25, { type: "sawtooth", vol: v * 0.06, dest: d, attack: 0.003, filter: 2500 }); },
    epiano: (f, t, v, d) => { tone(f, t, 1.8, { vol: v, dest: d, attack: 0.012, filter: 1800 }); tone(f * 2, t, 0.7, { vol: v * 0.16, dest: d, attack: 0.01 }); tone(f / 2, t, 1.2, { vol: v * 0.18, dest: d, attack: 0.03 }); },
    celesta: (f, t, v, d) => { tone(f, t, 1.8, { vol: v, dest: d, attack: 0.003 }); tone(f * 4, t, 0.25, { vol: v * 0.18, dest: d }); }
  });
  const MUSIC_K = 0.64; /* 1.0.10 (A-02): prima 1,6 (musica 10-25 LU sopra i suoni dei tocchi) */
  const TRACKS = [
    { root: 3, mode: "major", beat: 0.4, per: 8, prog: [0, 4, 5, 3], mel: "epiano", dens: 0.42, acc: "broken", accI: "harp", bass: "root", drums: null, g: 0.95, seed: 11 },
    { root: -2, mode: "mixo", beat: 0.27, per: 8, prog: [0, 3, 6, 4], mel: "marimba", dens: 0.55, acc: "hits", accI: "epiano", bass: "walk", drums: "tick", g: 1.2, seed: 23 },
    { root: -4, mode: "dorian", beat: 0.33, per: 8, prog: [0, 3, 1, 4], mel: "keys", dens: 0.38, acc: "block", accI: "keys", bass: "root", drums: "lofi", swing: 0.12, seventh: true, g: 1.02, seed: 37 },
    { root: 3, mode: "major", beat: 0.5, per: 6, prog: [0, 3, 4, 0], mel: "epiano", dens: 0.42, acc: "waltz", accI: "epiano", bass: "root", drums: null, g: 1.0, seed: 5 },
    { root: 0, mode: "penta", beat: 0.3, per: 8, prog: [0, 0, 3, 2], mel: "kalimba", dens: 0.32, acc: "ostinato", accI: "kalimba", bass: "drone", drums: null, g: 1.05, seed: 41 },
    { root: 5, mode: "lydian", beat: 0.5, per: 8, prog: [0, 1, 0, 4], mel: "celesta", dens: 0.28, acc: "pad", accI: "keys", bass: "drone", drums: null, bed: "rain", g: 1.06, seed: 52 },
    { root: 2, mode: "major", beat: 0.5, per: 8, prog: [0, 5, 3, 4], mel: "flute", dens: 0.3, long: true, acc: "pad", accI: "keys", bass: "root", drums: null, g: 1.42, seed: 63 },
    { root: -1, mode: "major", beat: 0.3, per: 8, prog: [1, 4, 0, 5], mel: "flute", dens: 0.38, acc: "bossa", accI: "guitar", bass: "bossa", drums: "shaker", seventh: true, g: 1.3, seed: 74 },
    { root: 1, mode: "major", beat: 0.36, per: 6, prog: [0, 5, 3, 4], mel: "epiano", dens: 0.32, acc: "arp6", accI: "harp", bass: "root", drums: null, g: 0.85, seed: 85 },
    { root: -5, mode: "dorian", beat: 0.32, per: 8, prog: [0, 6, 3, 0], mel: "flute", dens: 0.42, acc: "strum", accI: "guitar", bass: "root", drums: "tick", g: 1.32, seed: 96 },
    { root: 0, mode: "major", beat: 0.36, per: 8, prog: [0, 2, 3, 4], mel: "keys", dens: 0.42, long: true, acc: "broken", accI: "keys", bass: "root", drums: null, g: 1.01, seed: 107 },
    { root: 7, mode: "lydian", beat: 0.55, per: 6, prog: [0, 4, 1, 0], mel: "celesta", dens: 0.32, acc: "pad", accI: "keys", bass: "drone", drums: null, g: 1.42, seed: 118 }
  ];
  /* Brani con melodie composte (ritornelli che si ripetono) */
  const TUNES = [
    { root: 0, mode: "major", beat: 0.3, per: 8, prog: [0, 3, 0, 4], mel: "epiano", acc: "broken", accI: "harp", bass: "root", drums: null, g: 0.7,
      A: [9, -1, 11, -1, 12, 11, 9, -1, 10, -1, 12, -1, 11, -1, -1, -1, 9, -1, 11, -1, 14, 12, 11, -1, 10, 9, 8, -1, 7, -1, -1, -1], B: [12, -1, 12, 13, 14, -1, 12, -1, 11, -1, 11, 12, 13, -1, 11, -1, 10, -1, 10, 11, 12, -1, 10, -1, 9, -1, 8, -1, 7, -1, -1, -1] },
    { root: 2, mode: "major", beat: 0.27, per: 8, prog: [0, 1, 0, 4], mel: "marimba", acc: "hits", accI: "epiano", bass: "walk", drums: "tick", g: 1.15,
      A: [7, 9, 11, 9, 14, -1, 11, -1, 8, 10, 12, 10, 13, -1, 12, -1, 7, 9, 11, 9, 14, -1, 16, -1, 15, 14, 13, 12, 11, -1, -1, -1], B: [14, -1, 13, -1, 12, -1, 11, -1, 12, -1, 11, -1, 10, -1, 9, -1, 10, -1, 11, -1, 12, -1, 13, -1, 14, -1, -1, -1, -1, -1, -1, -1] },
    { root: -3, mode: "major", beat: 0.38, per: 8, prog: [0, 3, 1, 4], mel: "epiano", acc: "block", accI: "keys", bass: "root", drums: "lofi", swing: 0.12, seventh: true, g: 0.8,
      A: [11, -1, -1, 12, 11, -1, 9, -1, 10, -1, -1, 11, 10, -1, 8, -1, 9, -1, -1, 10, 9, -1, 7, -1, 8, -1, 9, -1, 7, -1, -1, -1], B: [12, -1, -1, 13, 12, -1, 11, -1, 11, -1, -1, 12, 11, -1, 9, -1, 10, -1, 11, -1, 12, -1, 13, -1, 14, -1, -1, -1, -1, -1, -1, -1] },
    { root: 4, mode: "penta", beat: 0.28, per: 8, prog: [0, 0, 3, 2], mel: "kalimba", acc: "ostinato", accI: "kalimba", bass: "drone", drums: null, g: 1.05,
      A: [5, 7, 8, -1, 10, -1, 8, -1, 9, 8, 7, -1, 6, -1, -1, -1, 5, 7, 8, -1, 10, -1, 11, -1, 10, 9, 8, -1, 7, -1, -1, -1], B: [10, -1, 9, -1, 8, -1, 9, -1, 8, -1, 7, -1, 6, -1, 7, -1, 8, -1, 8, 9, 10, -1, 8, -1, 7, 6, 5, -1, 5, -1, -1, -1] },
    { root: 5, mode: "major", beat: 0.4, per: 6, prog: [0, 3, 4, 0], mel: "epiano", acc: "waltz", accI: "harp", bass: "root", drums: null, g: 1.0,
      A: [7, -1, 9, 11, -1, 9, 10, -1, 12, 11, -1, -1, 9, -1, 11, 14, -1, 12, 11, -1, 10, 9, -1, -1], B: [12, -1, 11, 10, -1, 9, 11, -1, 10, 9, -1, 8, 10, -1, 9, 8, -1, 9, 7, -1, -1, -1, -1, -1] },
    { root: 7, mode: "lydian", beat: 0.45, per: 8, prog: [0, 1, 0, 4], mel: "celesta", acc: "pad", accI: "keys", bass: "drone", drums: null, g: 1.35,
      A: [11, -1, 13, -1, 15, -1, 14, -1, 13, -1, 11, -1, 10, -1, -1, -1, 11, -1, 13, -1, 16, -1, 15, -1, 14, -1, -1, -1, -1, -1, -1, -1], B: [14, -1, 13, -1, 11, -1, 13, -1, 12, -1, 10, -1, 9, -1, -1, -1, 10, -1, 11, -1, 13, -1, 12, -1, 11, -1, -1, -1, -1, -1, -1, -1] },
    { root: 0, mode: "major", beat: 0.25, per: 8, prog: [0, 1, 2, 4], mel: "marimba", acc: "arp", accI: "epiano", bass: "walk", drums: "shaker", g: 0.66,
      A: [7, 7, 9, 11, 12, 11, 9, 7, 8, 8, 10, 12, 13, 12, 10, 8, 9, 9, 11, 13, 14, 13, 11, 9, 10, 9, 8, 9, 7, -1, -1, -1], B: [14, -1, 12, -1, 11, -1, 9, -1, 13, -1, 11, -1, 10, -1, 8, -1, 12, -1, 10, -1, 9, -1, 8, -1, 7, -1, 9, -1, 7, -1, -1, -1] },
    { root: -2, mode: "dorian", beat: 0.3, per: 8, prog: [0, 3, 0, 4], mel: "flute", acc: "bossa", accI: "guitar", bass: "bossa", drums: "shaker", seventh: true, g: 1.25,
      A: [7, -1, 10, -1, 9, 10, 11, -1, 10, -1, 9, -1, 7, -1, -1, -1, 8, -1, 11, -1, 10, 11, 12, -1, 11, -1, 10, -1, 8, -1, -1, -1], B: [12, -1, 11, -1, 10, -1, 9, -1, 11, -1, 10, -1, 9, -1, 8, -1, 9, -1, 10, -1, 11, -1, 12, -1, 10, -1, -1, -1, -1, -1, -1, -1] },
    { root: 3, mode: "major", beat: 0.42, per: 8, prog: [0, 5, 3, 4], mel: "epiano", acc: "arp", accI: "harp", bass: "root", drums: null, bed: "rain", g: 0.75,
      A: [9, -1, -1, 11, 12, -1, 11, -1, 9, -1, -1, 8, 7, -1, -1, -1, 8, -1, -1, 9, 10, -1, 12, -1, 11, -1, -1, -1, -1, -1, -1, -1], B: [12, -1, -1, 14, 13, -1, 12, -1, 11, -1, -1, 10, 9, -1, -1, -1, 10, -1, 12, -1, 11, -1, 8, -1, 7, -1, -1, -1, -1, -1, -1, -1] }
  ];
  TUNES.forEach((x, i) => { x.seed = 200 + i; x.dens = 0.4; TRACKS.push(x); });
  let bed = null;
  function rng(seed) { let a = seed; return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function noteF(tr, k, oct = 0) { const m = MODES[tr.mode]; const L = m.length; const o = Math.floor(k / L); return N(tr.root + m[((k % L) + L) % L] + 12 * (o + oct)); }
  function chordIdx(tr, d) { const L = MODES[tr.mode].length; if (L === 5) return [d, d + 2, d + 3]; return tr.seventh ? [d, d + 2, d + 4, d + 6] : [d, d + 2, d + 4]; }
  function buildSong(i) {
    const tr = TRACKS[i], r = rng(tr.seed); const L = MODES[tr.mode].length;
    if (tr.A) { const cut = (a) => [0, 1, 2, 3].map((k) => a.slice(k * tr.per, (k + 1) * tr.per)); const A = cut(tr.A), B = cut(tr.B); const end = A[3].map(() => -1); end[0] = chordIdx(tr, tr.prog[0])[0] + L; return { tr, bars: [...A, ...A, ...B, ...A, ...B, ...A.slice(0, 3), end] }; }
    const phrase = () => tr.prog.map((d) => {
      const ch = chordIdx(tr, d); const bar = []; let last = ch[0] + L;
      for (let s = 0; s < tr.per; s++) {
        if (tr.long && s % 4 !== 0) { bar.push(-1); continue; }
        const strong = s % 2 === 0;
        if (r() < (strong ? tr.dens + 0.18 : tr.dens - 0.3)) {
          let idx = r() < 0.65 ? ch[Math.floor(r() * ch.length)] + L : last + (r() < 0.5 ? -1 : 1);
          idx = Math.max(L - 2, Math.min(L * 2 + 2, idx)); last = idx; bar.push(idx);
        } else bar.push(-1);
      }
      return bar;
    });
    const A = phrase(), B = phrase(), C = phrase();
    const end = A[3].map(() => -1); end[0] = chordIdx(tr, tr.prog[0])[0] + L;
    return { tr, bars: [...A, ...B, ...A, ...C, ...A, ...B, ...A.slice(0, 3), end] };
  }
  function drum(kind, t, s, per) {
    if (kind === "lofi") {
      if (s === 0 || s === 5) { tone(120, t, 0.22, { vol: 0.22, glide: 45, dest: musicBus }); }
      if (s === 4) noise(t, 0.16, 0.09, 1800, musicBus);
      if (s % 2 === 0) noise(t, 0.04, 0.035, 8000, musicBus);
    } else if (kind === "shaker") { noise(t, 0.05, s % 2 ? 0.05 : 0.025, 6500, musicBus); if (s === 0) tone(90, t, 0.2, { vol: 0.12, glide: 50, dest: musicBus }); }
    else if (kind === "tick") { if (s % 2 === 0) tone(s === 0 ? 1400 : 1100, t, 0.04, { vol: 0.035, dest: musicBus }); }
  }
  function startBed(kind) {
    stopBed(); if (kind !== "rain" || !ctx) return;
    const len = ctx.sampleRate * 2, buf = ctx.createBuffer(1, len, ctx.sampleRate), d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    const src = ctx.createBufferSource(); src.buffer = buf; src.loop = true;
    const lp = ctx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 2200; const hp = ctx.createBiquadFilter(); hp.type = "highpass"; hp.frequency.value = 400;
    const g = ctx.createGain(); g.gain.value = 0.0001; g.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 2);
    src.connect(lp); lp.connect(hp); hp.connect(g); g.connect(musicBus); src.start(); bed = { src, g };
  }
  function stopBed() { if (!bed || !ctx) return; const b = bed; bed = null; b.g.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + 1); setTimeout(() => { try { b.src.stop(); } catch (e) { /* niente */ } }, 1200); }
  function schedule() {
    if (ctx && evCur) { evTick(); return; }
    if (!ctx || !song) return;
    const { tr, bars } = song; const L = MODES[tr.mode].length; const I = INST[tr.mel], A = INST[tr.accI];
    while (nextT < (fakeNow != null ? fakeNow : ctx.currentTime + 0.5)) {
      const bi = Math.floor(step / tr.per), si = step % tr.per;
      if (bi >= bars.length) { next(); return; }
      const d = tr.prog[bi % 4]; const ch = chordIdx(tr, d); const t = nextT + (tr.swing && si % 2 ? tr.beat * tr.swing : 0);
      const barLen = tr.beat * tr.per; const av = VOL[tr.accI] * 0.55;
      /* basso */
      if (tr.bass === "root" && si === 0) tone(noteF(tr, d, -2), t, barLen * 0.9, { vol: 0.15, dest: musicBus, attack: 0.03 });
      if (tr.bass === "drone" && si === 0 && bi % 2 === 0) tone(noteF(tr, 0, -2), t, barLen * 2, { vol: 0.09, dest: musicBus, attack: 0.6 });
      if (tr.bass === "walk" && si % 2 === 0) tone(noteF(tr, d + [0, 2, 4, 2][si / 2], -2), t, tr.beat * 1.6, { type: "triangle", vol: 0.13, dest: musicBus, attack: 0.005 });
      if (tr.bass === "bossa" && (si === 0 || si === 3 || si === 4 || si === 7)) tone(noteF(tr, si < 4 ? d : d + 4, -2), t, tr.beat * 1.4, { vol: 0.14, dest: musicBus, attack: 0.005 });
      /* accompagnamento */
      const up = (k, o = 0) => noteF(tr, k, o);
      if (tr.acc === "arp") A(up(ch[[0, 1, 2, 1][si % 4]], si < 4 ? 0 : 0) * (si >= 4 ? 2 : 1), t, av, musicBus);
      if (tr.acc === "arp6") A(up(ch[[0, 1, 2, 0, 2, 1][si]], si === 3 ? 1 : 0), t, av, musicBus);
      if (tr.acc === "hits" && (si === 2 || si === 6)) ch.slice(0, 3).forEach((k) => A(up(k), t, av * 0.6, musicBus));
      if (tr.acc === "block" && (si === 0 || si === 3 || si === 6)) ch.forEach((k) => A(up(k), t, av * 0.55, musicBus));
      if (tr.acc === "waltz" && (si === 2 || si === 4)) ch.slice(1).forEach((k) => A(up(k), t, av * 0.6, musicBus));
      if (tr.acc === "ostinato") A(up([0, 2, 4, 2, 1, 3, 4, 2][si] + d), t, av * 0.8, musicBus);
      if (tr.acc === "pad" && si === 0) ch.forEach((k) => tone(up(k), t, barLen * 1.05, { vol: 0.03, dest: musicBus, attack: barLen * 0.35, filter: 1300 }));
      if (tr.acc === "bossa" && [0, 3, 6].includes(si)) ch.forEach((k, j) => A(up(k), t + j * 0.018, av * 0.6, musicBus));
      if (tr.acc === "strum" && (si === 0 || si === 4)) ch.forEach((k, j) => A(up(k), t + j * 0.03, av * 0.7, musicBus));
      if (tr.acc === "broken") A(up(ch[[0, 2, 1, 2][si % 4]] + (si % 4 === 1 ? 0 : 0)), t, av * 0.7, musicBus);
      if (tr.drums) drum(tr.drums, t, si, tr.per);
      /* melodia */
      const n = bars[bi][si];
      if (n >= 0) I(noteF(tr, n), t, VOL[tr.mel] * (si % 2 === 0 ? 1 : 0.8), musicBus);
      nextT += tr.beat; step++;
    }
  }
  /* =================== 1.0.11: MUSICHE DEGLI EVENTI ===================
     Cinque brani composti apposta (melodia, armonia e arrangiamento scritti nota per nota, non generati a caso), con timbri
     che gli altri 21 brani non usano: Lanterne (6/8, chitarra pizzicata, ocarina, campanellini), Natale (swing leggero,
     celesta, pizzicato, sonagli), Nuovo inizio (alba: arpeggi di piano e il motivo del logo sulla kalimba), Stelle (notturno,
     celesta, arpa, tappeto di vetro), Aquiloni (arioso, flauto, marimba, folate di vento).
     - Forma: introduzione breve (solo la prima volta), poi 16 battute (A+B) due volte, la seconda con un arrangiamento diverso
       (contromelodia, raddoppi); l'ultima battuta e' una dominante che risolve sulla prima: il giro ricomincia senza stacchi,
       con lo stesso tempo e la coda dell'eco che continua.
     - Ogni nota ha un attacco e una chiusura morbidi (nessun clic); funzioni pure (contesto e uscita come argomenti), usate sia
       dal vivo sia dai test con un OfflineAudioContext per farne i file di ascolto. */
  const MID = (s) => { const m = /^([A-G])([#b]?)(-?\d)$/.exec(s); if (!m) return null; return { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 }[m[1]] + (m[2] === "#" ? 1 : m[2] === "b" ? -1 : 0) + 12 * (+m[3] + 1); };
  const HZ = (m) => 440 * Math.pow(2, (m - 69) / 12);
  const CHQ = { "": [0, 4, 7], m: [0, 3, 7], maj7: [0, 4, 7, 11], maj9: [0, 4, 7, 11, 14], m7: [0, 3, 7, 10], m9: [0, 3, 7, 10, 14], m6: [0, 3, 7, 9], 7: [0, 4, 7, 10], 9: [0, 4, 7, 10, 14], 6: [0, 4, 7, 9], sus4: [0, 5, 7], sus2: [0, 2, 7], "7sus4": [0, 5, 7, 10], add9: [0, 4, 7, 14] };
  const PC = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
  const pcOf = (s) => PC[s[0]] + (s[1] === "#" ? 1 : s[1] === "b" ? -1 : 0);
  /* accordo: { root: classe della fondamentale, bass: classe del basso, iv: intervalli } */
  function chordOf(sym) {
    const m = /^([A-G][#b]?)(maj9|maj7|m9|m7|m6|7sus4|sus4|sus2|add9|m|7|9|6)?(?:\/([A-G][#b]?))?$/.exec(sym); if (!m) return { root: 0, bass: 0, iv: [0, 4, 7] };
    const r = pcOf(m[1]); return { root: r, bass: m[3] ? pcOf(m[3]) : r, iv: CHQ[m[2] || ""] };
  }
  /* note dell'accordo vicine a un'ottava (midi >= lo) */
  const near = (pc, lo) => { let x = lo - ((lo - pc) % 12 + 12) % 12; if (x < lo) x += 12; return x; };
  const chordNotes = (ch, lo, n) => { const out = []; const base = near(ch.root, lo); for (let k = 0; out.length < n; k++) { const iv = ch.iv[k % ch.iv.length] + 12 * Math.floor(k / ch.iv.length); out.push(base + iv); } return out; };
  /* melodia scritta "NOTA:durata" (durata in passi), battute separate da | */
  function parseMel(str, per) {
    return str.split("|").map((bar) => { const ev = []; let p = 0; bar.trim().split(/\s+/).filter(Boolean).forEach((tk) => { const [n, d] = tk.split(":"); const len = +d || 1; if (n !== "r") ev.push([p, MID(n), len]); p += len; }); ev.len = p; return ev; });
  }
  /* --- strumenti (contesto c, uscita d) --- */
  let evNoise = null, evHum = 7;
  function evNoiseBuf(c) { if (evNoise && evNoise.sampleRate === c.sampleRate) return evNoise; const n = c.sampleRate; const b = c.createBuffer(1, n, c.sampleRate); const x = b.getChannelData(0); let r = 12345; for (let i = 0; i < n; i++) { r = (r * 16807) % 2147483647; x[i] = r / 1073741823.5 - 1; } evNoise = b; return b; }
  function evPan(c, d, p) { if (!p || !c.createStereoPanner) return d; const s = c.createStereoPanner(); s.pan.value = p; s.connect(d); return s; }
  /* oscillatore con inviluppo: attacco lineare da 0, decadimento esponenziale verso 0, stop solo a volume nullo */
  function evOsc(c, d, f, t, o) {
    const { type = "sine", vol = 0.1, a = 0.006, dur = 1, rel = 0.25, lp = 0, det = 0, sus = 0 } = o;
    if (!(f > 20 && f < c.sampleRate * 0.45) || !(vol > 0)) return;
    evHum = (evHum * 1103515245 + 12345) & 0x7fffffff; const hv = vol * (0.94 + (evHum % 1000) / 1000 * 0.12); /* piccole differenze di tocco */
    const os = c.createOscillator(), g = c.createGain(); os.type = type; os.frequency.setValueAtTime(f, t); if (det) os.detune.setValueAtTime(det, t);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(hv, t + a);
    if (sus) { g.gain.setTargetAtTime(hv * sus, t + a, dur * 0.35); g.gain.setTargetAtTime(0, t + dur, rel / 4); }
    else g.gain.setTargetAtTime(0, t + a, Math.max(0.02, dur / 4));
    let src = os; if (lp) { const f1 = c.createBiquadFilter(); f1.type = "lowpass"; f1.frequency.setValueAtTime(lp, t); f1.Q.value = 0.4; os.connect(f1); src = f1; }
    src.connect(g); g.connect(d); os.start(t); os.stop(t + (sus ? dur + rel * 1.6 : dur * 1.6) + a + 0.05);
    return os;
  }
  function evNoiseHit(c, d, t, o) {
    const { vol = 0.05, a = 0.003, dur = 0.06, f = 6000, q = 1, type = "bandpass", f2 = 0, off = 0 } = o;
    const s = c.createBufferSource(), bp = c.createBiquadFilter(), g = c.createGain(); s.buffer = evNoiseBuf(c);
    bp.type = type; bp.frequency.setValueAtTime(f, t); if (f2) bp.frequency.exponentialRampToValueAtTime(f2, t + dur * 0.8); bp.Q.value = q;
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + a); g.gain.setTargetAtTime(0, t + a, dur / 3.5);
    s.connect(bp); bp.connect(g); g.connect(d); s.start(t, (off * 0.37) % 0.6, Math.min(0.39, dur * 2.2 + a)); /* il rumore dura al massimo 0,4 s */
  }
  const EVI = {
    /* chitarra di nylon pizzicata: triangolo + armoniche, filtro che si chiude */
    pluck: (c, d, f, t, v, len, pan) => { const o = evPan(c, d, pan); evOsc(c, o, f, t, { type: "triangle", vol: v, a: 0.004, dur: 1.1, lp: 2400 }); evOsc(c, o, f * 2, t, { vol: v * 0.22, a: 0.003, dur: 0.35 }); evOsc(c, o, f * 3, t, { vol: v * 0.08, a: 0.002, dur: 0.12 }); },
    /* ocarina / flauto dolce: sinusoide con vibrato che arriva piano e un filo di fiato all'attacco */
    ocarina: (c, d, f, t, v, len, pan) => {
      const o = evPan(c, d, pan); const os = evOsc(c, o, f, t, { vol: v, a: 0.07, dur: len, rel: 0.22, sus: 0.82 });
      if (os) { const l = c.createOscillator(), lg = c.createGain(); l.frequency.value = 5.2; lg.gain.setValueAtTime(0, t); lg.gain.linearRampToValueAtTime(f * 0.005, t + Math.min(0.5, len * 0.6)); l.connect(lg); lg.connect(os.frequency); l.start(t); l.stop(t + len + 0.6); }
      evOsc(c, o, f * 2, t, { vol: v * 0.06, a: 0.08, dur: len, rel: 0.2, sus: 0.8 });
      evNoiseHit(c, o, t, { vol: v * 0.12, a: 0.02, dur: 0.09, f: 1800 + f * 0.5, q: 2, off: f });
    },
    celesta: (c, d, f, t, v, len, pan) => { const o = evPan(c, d, pan); evOsc(c, o, f, t, { vol: v, a: 0.003, dur: 1.5 }); evOsc(c, o, f * 4, t, { vol: v * 0.16, a: 0.002, dur: 0.22 }); evOsc(c, o, f * 2, t, { vol: v * 0.1, a: 0.003, dur: 0.5 }); },
    glock: (c, d, f, t, v, len, pan) => { const o = evPan(c, d, pan); evOsc(c, o, f, t, { vol: v, a: 0.002, dur: 1.2 }); evOsc(c, o, f * 2.76, t, { vol: v * 0.25, a: 0.002, dur: 0.3 }); evOsc(c, o, f * 5.4, t, { vol: v * 0.08, a: 0.002, dur: 0.1 }); },
    /* tappeto: due denti di sega appena stonati, filtrati, attacco e chiusura lenti */
    pad: (c, d, f, t, v, len, pan, bright) => { const o = evPan(c, d, pan); const lp = bright || 1100; evOsc(c, o, f, t, { type: "sawtooth", vol: v * 0.5, a: Math.min(0.9, len * 0.4), dur: len, rel: 1.2, sus: 0.9, lp, det: -6 }); evOsc(c, o, f, t, { type: "sawtooth", vol: v * 0.5, a: Math.min(0.9, len * 0.4), dur: len, rel: 1.2, sus: 0.9, lp, det: 6 }); },
    /* vetro: sinusoidi e triangolo con attacco lento (Stelle) */
    glass: (c, d, f, t, v, len, pan) => { const o = evPan(c, d, pan); evOsc(c, o, f, t, { vol: v, a: Math.min(1.2, len * 0.45), dur: len, rel: 1.4, sus: 0.85, det: -4 }); evOsc(c, o, f * 2, t, { type: "triangle", vol: v * 0.25, a: Math.min(1.4, len * 0.5), dur: len, rel: 1.4, sus: 0.8, det: 5, lp: 2600 }); },
    harp: (c, d, f, t, v, len, pan) => { const o = evPan(c, d, pan); evOsc(c, o, f, t, { type: "triangle", vol: v, a: 0.004, dur: 1.6, lp: 2600 }); evOsc(c, o, f * 2, t, { vol: v * 0.15, a: 0.003, dur: 0.5 }); },
    bass: (c, d, f, t, v, len) => { evOsc(c, d, f, t, { vol: v, a: 0.012, dur: Math.max(0.3, len), rel: 0.18, sus: 0.6, lp: 700 }); evOsc(c, d, f * 2, t, { type: "triangle", vol: v * 0.18, a: 0.01, dur: Math.max(0.2, len * 0.6), rel: 0.12, sus: 0.4, lp: 900 }); },
    pizz: (c, d, f, t, v) => { evOsc(c, d, f, t, { type: "triangle", vol: v, a: 0.004, dur: 0.32, lp: 1300 }); evOsc(c, d, f * 2, t, { vol: v * 0.2, a: 0.003, dur: 0.12 }); },
    marimba: (c, d, f, t, v, len, pan) => { const o = evPan(c, d, pan); evOsc(c, o, f, t, { vol: v, a: 0.003, dur: 0.5 }); evOsc(c, o, f * 3.98, t, { vol: v * 0.2, a: 0.002, dur: 0.06 }); },
    epiano: (c, d, f, t, v, len, pan) => { const o = evPan(c, d, pan); evOsc(c, o, f, t, { vol: v, a: 0.008, dur: 1.8, lp: 2200 }); evOsc(c, o, f * 2, t, { vol: v * 0.14, a: 0.006, dur: 0.6 }); evOsc(c, o, f * 3, t, { vol: v * 0.05, a: 0.004, dur: 0.2 }); },
    flute: (c, d, f, t, v, len, pan) => {
      const o = evPan(c, d, pan); const os = evOsc(c, o, f, t, { vol: v, a: 0.05, dur: len, rel: 0.2, sus: 0.85, lp: 3200 });
      if (os) { const l = c.createOscillator(), lg = c.createGain(); l.frequency.value = 5.6; lg.gain.setValueAtTime(0, t); lg.gain.linearRampToValueAtTime(f * 0.006, t + Math.min(0.4, len * 0.5)); l.connect(lg); lg.connect(os.frequency); l.start(t); l.stop(t + len + 0.5); }
      evOsc(c, o, f * 2, t, { vol: v * 0.12, a: 0.05, dur: len, rel: 0.2, sus: 0.8 }); evOsc(c, o, f * 3, t, { vol: v * 0.03, a: 0.05, dur: len, rel: 0.2, sus: 0.8 });
      evNoiseHit(c, o, t, { vol: v * 0.1, a: 0.015, dur: 0.07, f: 2600, q: 1.4, off: f });
    },
    kal: (c, d, f, t, v, len, pan) => { logoKal(c, d, f, t, v, pan || 0, 0.9, 0.5); },
    sleigh: (c, d, t, v, k) => { evNoiseHit(c, d, t, { vol: v, a: 0.002, dur: 0.11, f: 7800, q: 1.6, off: k }); [6340, 7120, 8460].forEach((f, i) => evOsc(c, d, f * (1 + 0.01 * ((k + i) % 3)), t + 0.004 * i, { vol: v * 0.12, a: 0.002, dur: 0.09 })); },
    shaker: (c, d, t, v, k) => { evNoiseHit(c, d, t, { vol: v, a: 0.006, dur: 0.07, f: 6400, q: 1.1, off: k }); },
    brush: (c, d, t, v, k) => { evNoiseHit(c, d, t, { vol: v, a: 0.01, dur: 0.16, f: 3200, q: 0.6, off: k }); },
    kick: (c, d, t, v) => { const os = c.createOscillator(), g = c.createGain(); os.frequency.setValueAtTime(105, t); os.frequency.exponentialRampToValueAtTime(48, t + 0.16); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(v, t + 0.004); g.gain.setTargetAtTime(0, t + 0.004, 0.06); os.connect(g); g.connect(d); os.start(t); os.stop(t + 0.45); },
    wind: (c, d, t, v, k) => { const len = 2.6; const s = c.createBufferSource(), bp = c.createBiquadFilter(), g = c.createGain(); s.buffer = evNoiseBuf(c); s.loop = true; bp.type = "bandpass"; bp.Q.value = 2.2; bp.frequency.setValueAtTime(420, t); bp.frequency.exponentialRampToValueAtTime(1500, t + len * 0.55); bp.frequency.exponentialRampToValueAtTime(600, t + len); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(v, t + len * 0.5); g.gain.linearRampToValueAtTime(0, t + len); s.connect(bp); bp.connect(g); g.connect(d); s.start(t, (k * 0.13) % 0.5); s.stop(t + len + 0.05); }
  };
  /* --- i brani --- (g: volume tarato perche' ogni brano suoni come la media dei 21 brani normali, circa -28 LUFS) */
  const EVS = {
    lanterns: { step: 60 / 168, per: 6, g: 0.6,
      intro: ["Dm9", "Bbmaj7"],
      ch: ["Dm9", "Bbmaj7", "F", "C/E", "Dm9", "Bbmaj7", "Gm7", "A7", "Bbmaj7", "C", "Am7", "Dm", "Gm7", "C", "Bbmaj7", "A7"],
      mel: "A4:3 C5:1 D5:2 | F5:3 E5:1 D5:2 | C5:3 A4:1 C5:2 | G4:6 | A4:3 C5:1 D5:2 | F5:2 G5:1 A5:3 | G5:2 F5:1 E5:2 D5:1 | E5:3 C#5:3 | D5:2 F5:1 A5:3 | G5:2 E5:1 C5:3 | E5:2 G5:1 C6:2 A5:1 | A5:6 | Bb5:2 A5:1 G5:3 | G5:2 F5:1 E5:3 | F5:2 E5:1 D5:2 C5:1 | C#5:3 E5:3",
      cnt: "r:6 | D5:3 C5:3 | A4:3 C5:3 | E5:3 D5:3 | r:6 | D5:3 F5:3 | Bb4:3 D5:3 | A4:6 | F4:3 A4:3 | E4:3 G4:3 | C5:3 E5:3 | D5:3 F5:3 | D5:3 Bb4:3 | G4:3 C5:3 | D5:3 Bb4:3 | E5:3 A4:3" },
    xmas: { step: 60 / 200, per: 8, swing: 0.16, g: 1.52,
      intro: ["G", "D7"],
      ch: ["G", "Em7", "Am7", "D7", "G", "B7/F#", "Em", "G7/D", "C", "Cm6", "G/B", "E7", "Am7", "D7", "G", "D7"],
      mel: "D5:2 G5:2 F#5:1 G5:1 A5:2 | B5:3 A5:1 G5:4 | E5:2 A5:2 G5:1 F#5:1 E5:2 | F#5:6 r:2 | D5:2 G5:2 F#5:1 G5:1 B5:2 | A5:2 F#5:2 D#5:4 | E5:2 G5:2 B5:2 E6:2 | D6:4 B5:2 F5:2 | E6:3 D6:1 C6:2 G5:2 | Eb6:3 D6:1 C6:2 A5:2 | B5:2 D6:2 G5:2 B5:2 | G#5:4 E5:2 D5:2 | C6:3 B5:1 A5:2 E5:2 | F#5:2 A5:2 C6:2 A5:2 | B5:4 A5:2 G5:2 | A5:3 G5:1 F#5:2 E5:2",
      cnt: "B4:4 D5:4 | G4:4 B4:4 | C5:4 E5:4 | D5:4 C5:4 | B4:4 D5:4 | D#5:4 F#5:4 | G5:4 E5:4 | F5:4 D5:4 | G5:4 E5:4 | G5:4 Eb5:4 | D5:4 G5:4 | E5:4 D5:4 | E5:4 C5:4 | C5:4 D5:4 | D5:4 B4:4 | C5:4 A4:4" },
    fresh: { step: 60 / 184, per: 8, g: 0.64,
      intro: ["Cmaj7", "D/C"],
      ch: ["Cmaj7", "D/C", "Em7", "Fmaj7", "Am7", "G/B", "Fmaj7", "Gsus4", "Fmaj7", "G", "Em7", "Am7", "Dm7", "G", "Csus2", "G7"],
      mel: "E5:2 G5:2 B5:3 r:1 | A5:2 F#5:2 D5:4 | G5:2 B5:2 D6:3 B5:1 | C6:6 A5:2 | E5:2 A5:2 C6:3 B5:1 | D6:2 B5:2 G5:4 | A5:2 C6:2 E6:2 D6:2 | C6:4 B5:4 | A5:3 G5:1 F5:2 A5:2 | B5:3 A5:1 G5:2 B5:2 | D6:3 C6:1 B5:2 G5:2 | C6:6 r:2 | F5:2 A5:2 D6:2 C6:2 | B5:2 D6:2 B5:2 G5:2 | D6:4 C6:2 G5:2 | F5:4 D5:4",
      cnt: "G4:8 | F#4:8 | B4:8 | A4:8 | C5:8 | B4:8 | A4:8 | G4:4 D5:4 | C5:8 | D5:8 | G4:8 | E5:8 | D5:8 | D5:8 | G4:8 | C5:8" },
    stars: { step: 60 / 144, per: 8, g: 0.93,
      intro: ["Dmaj7", "Gmaj7"],
      ch: ["Dmaj7", "E/D", "Bm7", "Gmaj7", "Em7", "A", "F#m7", "Bm7", "Gmaj7", "A/G", "F#m7", "Bm7", "Em9", "A", "Dmaj7", "A7sus4"],
      mel: "F#5:3 A5:1 C#6:4 | B5:3 G#5:1 E5:4 | D6:3 C#6:1 A5:2 F#5:2 | F#5:8 | G5:3 B5:1 D6:4 | C#6:3 B5:1 A5:4 | A5:2 C#6:2 E6:2 C#6:2 | B5:8 | D6:3 C#6:1 B5:2 F#5:2 | E6:3 D6:1 C#6:2 A5:2 | C#6:3 B5:1 A5:2 F#5:2 | D6:6 C#6:2 | B5:3 A5:1 G5:2 F#5:2 | E5:2 A5:2 D6:2 C#6:2 | A5:4 F#5:4 | E5:6 r:2",
      cnt: "D5:8 | B4:8 | F#4:8 | B4:4 D5:4 | B4:8 | E5:4 C#5:4 | C#5:8 | D5:4 F#5:4 | B4:8 | A4:8 | A4:8 | F#4:8 | G4:8 | G4:4 A4:4 | D5:8 | C#5:8" },
    kites: { step: 60 / 224, per: 8, g: 1.11,
      intro: ["F", "C/E"],
      ch: ["F", "C/E", "Dm7", "Bb", "F/A", "Gm7", "C", "C7", "Bb", "C", "Am7", "Dm7", "Gm7", "C", "F", "C7"],
      mel: "C5:1 F5:1 A5:2 G5:1 A5:1 C6:2 | G5:2 E5:2 C5:4 | D5:1 F5:1 A5:2 C6:1 A5:1 F5:2 | D5:2 F5:2 Bb5:4 | A5:2 C6:2 F6:3 E6:1 | D6:2 Bb5:2 G5:4 | E5:1 G5:1 C6:2 Bb5:1 A5:1 G5:2 | E5:6 r:2 | F5:2 Bb5:2 D6:3 C6:1 | C6:2 G5:2 E5:4 | E5:1 A5:1 C6:2 E6:2 C6:2 | D6:6 r:2 | Bb5:2 G5:1 A5:1 Bb5:2 D6:2 | C6:2 E5:2 G5:2 Bb5:2 | A5:4 C6:2 A5:2 | Bb5:2 G5:2 E5:2 G5:2",
      cnt: "A4:4 C5:4 | C5:4 G4:4 | F4:4 A4:4 | F4:4 D4:4 | C5:4 A4:4 | Bb4:4 D5:4 | G4:4 C5:4 | Bb4:4 G4:4 | D5:4 F5:4 | E5:4 C5:4 | C5:4 E5:4 | F5:4 A4:4 | D5:4 Bb4:4 | E5:4 C5:4 | F5:4 C5:4 | E5:4 Bb4:4" }
  };
  Object.values(EVS).forEach((s) => { s.M = parseMel(s.mel, s.per); s.C = parseMel(s.cnt, s.per); s.CH = s.ch.map(chordOf); s.IN = s.intro.map(chordOf); s.bars = s.CH.length * 2; s.pass = s.bars * s.per; s.introSteps = s.IN.length * s.per; });
  const barLen0 = (s) => s.step * s.per;
  /* un passo del brano: pos = passi dall'inizio (introduzione compresa). Restituisce la durata del passo. */
  const evDyn = new WeakMap();
  /* dinamica della forma: introduzione piano, A piu' raccolta, B piu' piena, il secondo giro un po' piu' ricco */
  function evBus(c, d) { let g = evDyn.get(d); if (!g || g.context !== c) { g = c.createGain(); g.gain.value = 0.85; g.connect(d); evDyn.set(d, g); } return g; }
  function evStep(c, d0, id, pos, t0) {
    const s = EVS[id]; const per = s.per, st = s.step; const d = evBus(c, d0); evHum = (pos * 7919 + 13) & 0x7fffffff; /* tocco diverso a ogni nota ma sempre uguale per lo stesso passo */
    const intro = pos < s.introSteps; const q = intro ? pos : pos - s.introSteps;
    const bar = Math.floor(q / per) % (intro ? s.IN.length : s.bars), si = q % per; const pass = intro ? -1 : Math.floor(q / s.pass);
    const half = !intro && bar >= s.CH.length ? 1 : 0; /* 0 = prima volta, 1 = seconda volta (arrangiamento diverso) */
    const b16 = intro ? -1 : bar % s.CH.length; const ch = intro ? s.IN[bar] : s.CH[b16];
    const k = pos; const t = t0 + (s.swing && si % 2 ? st * s.swing : 0) + (si ? ((k * 7919) % 9 - 4) * 0.0015 : 0); /* tempo un po' umano, il primo della battuta sempre preciso */
    if (si === 0) { const sec = intro ? 0.8 : (b16 < 8 ? 0.86 : 1) + half * 0.08; try { d.gain.setTargetAtTime(sec, t0, barLen0(s) * 0.5); } catch (e) { /* niente */ } }
    const breath = !intro && bar === s.bars - 1 && si >= per - 2; /* ultima battuta del giro: un respiro prima di ricominciare */
    const mel = !intro && s.M[b16].filter((e) => e[0] === si);
    const cnt = !intro && s.C[b16].filter((e) => e[0] === si);
    const bassF = HZ(near(ch.bass, 36)); const barLen = st * per;
    const notes = chordNotes(ch, 55, 5);
    if (id === "lanterns") {
      /* 6/8: basso sul 1 e sul 4, chitarra in arpeggio, tappeto caldo, ocarina; seconda volta: campanellini e controcanto */
      if (si === 0) { EVI.bass(c, d, bassF, t, 0.15, st * 2.6); EVI.pad(c, d, HZ(notes[1]), t, 0.026, barLen * 1.02, -0.2, 900); EVI.pad(c, d, HZ(notes[2]), t, 0.022, barLen * 1.02, 0.2, 900); }
      if (si === 3) EVI.bass(c, d, HZ(near(ch.bass, 36) + 7), t, 0.1, st * 2.4);
      const arp = [0, 1, 2, 3, 2, 1][si]; const gn = chordNotes(ch, 50, 4)[arp];
      if (!breath) EVI.pluck(c, d, HZ(gn), t, si === 0 ? 0.075 : 0.055, st, si % 2 ? 0.25 : -0.15);
      if (si === 3 && !intro) EVI.brush(c, d, t, 0.018, k);
      (mel || []).forEach(([, m, l]) => EVI.ocarina(c, d, HZ(m), t, 0.105, l * st * 0.95, 0.05));
      if (half) { (cnt || []).forEach(([, m, l]) => EVI.pluck(c, d, HZ(m + 12), t, 0.04, l * st, 0.35)); if (si === 0 && b16 % 4 === 3) EVI.celesta(c, d, HZ(notes[3] + 12), t + st * 0.5, 0.035, 1, -0.3); }
      else if (si === 0 && (b16 === 3 || b16 === 11)) EVI.celesta(c, d, HZ(notes[2] + 24), t + st * 2, 0.03, 1, 0.3);
    } else if (id === "xmas") {
      /* swing leggero: pizzicato "bum-cia", accordi morbidi sui tempi deboli, sonagli, celesta; seconda volta: glockenspiel e controcanto */
      if (si === 0) EVI.pizz(c, d, bassF, t, 0.16);
      if (si === 4) EVI.pizz(c, d, HZ(near(ch.bass, 36) + 7), t, 0.12);
      if (si === 2 || si === 6) chordNotes(ch, 55, 4).slice(1).forEach((m, j) => EVI.epiano(c, d, HZ(m), t + j * 0.012, 0.022, 0.5, (j - 1) * 0.25));
      if (si === 0) EVI.pad(c, d, HZ(notes[0]), t, 0.014, barLen, 0, 1000);
      if (!breath) EVI.sleigh(c, d, t, si % 2 ? 0.032 : si === 0 ? 0.022 : 0.012, k);
      if (si === 4) EVI.brush(c, d, t, 0.015, k);
      (mel || []).forEach(([, m, l]) => EVI.celesta(c, d, HZ(m), t, 0.085, l * st, 0.08));
      if (half) { (mel || []).forEach(([, m]) => EVI.glock(c, d, HZ(m + 12), t + 0.01, 0.018, 1, -0.2)); (cnt || []).forEach(([, m, l]) => EVI.flute(c, d, HZ(m), t, 0.045, l * st * 0.9, -0.3)); }
      if (intro && si === 0) EVI.glock(c, d, HZ(notes[2] + 24), t, 0.04, 1, 0.2);
    } else if (id === "fresh") {
      /* alba: piano a crome che sale, basso lungo, archi morbidi; il motivo del logo sulla kalimba alla fine delle frasi */
      if (si === 0) { EVI.bass(c, d, bassF, t, 0.13, barLen * 0.95); EVI.pad(c, d, HZ(notes[1]), t, 0.018, barLen, -0.25, 1300); EVI.pad(c, d, HZ(notes[3] || notes[2]), t, 0.016, barLen, 0.25, 1300); }
      const ep = chordNotes(ch, 48, 6); const order = [0, 2, 4, 5, 3, 4, 2, 1];
      if (!breath) EVI.epiano(c, d, HZ(ep[order[si]] + 12), t, si === 0 ? 0.045 : 0.032, 1, si % 2 ? 0.2 : -0.2);
      if (!intro && half && si % 2 === 1) EVI.shaker(c, d, t, 0.016, k);
      if (!intro && half && si === 0) EVI.kick(c, d, t, 0.07);
      (mel || []).forEach(([, m, l]) => EVI.flute(c, d, HZ(m), t, 0.07, l * st * 0.95, 0.05));
      if (half) (cnt || []).forEach(([, m, l]) => EVI.glass(c, d, HZ(m), t, 0.03, l * st, -0.3));
      if (!intro && si === 4 && (b16 === 3 || b16 === 11 || b16 === 15)) LOGO_HZ.forEach((f, j) => EVI.kal(c, d, f, t + j * st * 0.5, 0.11, j % 2 ? 0.2 : -0.2));
    } else if (id === "stars") {
      /* notturno: arpa in crome su due ottave, tappeto di vetro, celesta; scintille alte ogni tanto; seconda volta: melodia anche all'ottava */
      if (si === 0) { EVI.bass(c, d, bassF, t, 0.09, barLen * 1.05); chordNotes(ch, 57, 4).slice(0, 3).forEach((m, j) => EVI.glass(c, d, HZ(m), t, 0.02, barLen * 1.05, (j - 1) * 0.35)); }
      const hp = chordNotes(ch, 45, 7); const ord = [0, 1, 2, 3, 4, 3, 2, 1];
      if (!breath) EVI.harp(c, d, HZ(hp[ord[si]] + 12), t, si === 0 ? 0.045 : 0.03, 1, (si - 3.5) * 0.1);
      (mel || []).forEach(([, m, l]) => { EVI.celesta(c, d, HZ(m), t, 0.09, l * st, 0.05); if (half) EVI.glock(c, d, HZ(m + 12), t + 0.02, 0.016, 1, 0.3); });
      if (half) (cnt || []).forEach(([, m, l]) => EVI.flute(c, d, HZ(m - 12), t, 0.035, l * st * 0.95, -0.35));
      const tw = (k * 7919) % 23; if (si === 5 && tw < 6 && !intro) EVI.celesta(c, d, HZ(near(ch.root, 86) + [0, 7, 12, 4][tw % 4]), t + st * 0.5, 0.022, 1, tw % 2 ? 0.5 : -0.5);
    } else if (id === "kites") {
      /* arioso: marimba sui tempi deboli, pizzicato, shaker leggero, flauto; folate di vento all'inizio delle frasi; seconda volta: kalimba */
      if (si === 0 || si === 4) EVI.pizz(c, d, si === 0 ? bassF : HZ(near(ch.bass, 36) + 7), t, 0.14);
      if (!breath && (si === 2 || si === 6)) chordNotes(ch, 60, 3).forEach((m, j) => EVI.marimba(c, d, HZ(m), t + j * 0.008, 0.035, 0.4, (j - 1) * 0.3));
      /* un tappeto d'aria leggero sotto tutto (niente buchi tra una frase e l'altra) e, dove la melodia respira, un piccolo
         riempimento di marimba che sale */
      if (si === 0) { EVI.pad(c, d, HZ(notes[1]), t, intro ? 0.03 : 0.022, barLen * 1.02, 0.3, 1600); EVI.pad(c, d, HZ(notes[2]), t, intro ? 0.026 : 0.018, barLen * 1.02, -0.3, 1600); }
      if (!breath && !intro && si === 6 && (b16 === 7 || b16 === 11)) chordNotes(ch, 72, 3).forEach((m, j) => EVI.marimba(c, d, HZ(m), t + j * st * 0.5, 0.045, 0.4, 0.2 + j * 0.15));
      if (intro && (si === 3 || si === 7)) EVI.kal(c, d, HZ(chordNotes(ch, 76, 3)[si === 3 ? 1 : 2]), t, 0.06, 0, 0.3);
      if (!breath) EVI.shaker(c, d, t, si % 2 ? 0.02 : 0.011, k);
      if (si === 0 && (bar === 0 || (!intro && b16 === 8))) EVI.wind(c, d, t, 0.045, k);
      (mel || []).forEach(([, m, l]) => EVI.flute(c, d, HZ(m), t, 0.075, l * st * 0.9, 0.05));
      if (half) (cnt || []).forEach(([, m, l]) => { const nn = chordNotes(ch, m, 3); nn.forEach((x, j) => EVI.kal(c, d, HZ(x + 12), t + j * st * 0.5, 0.05, 0.3)); });
    }
    return st;
  }
  const EV_IDS = Object.keys(EVS);
  /* per i test: "n" passi a partire dal passo "from" (per ascoltare la cucitura del giro) */
  function evRenderFrom(c, d, id, from, n, t0) { const s = EVS[id]; let t = t0; for (let p = from; p < from + n; p++) t += evStep(c, d, id, p, t); return t; }
  /* catena dell'uscita uguale a quella della musica (filtro caldo + eco + compressore), per i test e i file di ascolto */
  function evChain(c) {
    const comp = c.createDynamicsCompressor(); comp.threshold.value = -14; comp.ratio.value = 3; comp.connect(c.destination);
    const bus = c.createGain(); const warm = c.createBiquadFilter(); warm.type = "lowpass"; warm.frequency.value = 2600; warm.Q.value = 0.5; bus.connect(warm); warm.connect(comp);
    const vb = c.createConvolver(); { const len = Math.floor(c.sampleRate * 2.2), bf = c.createBuffer(2, len, c.sampleRate); let r = 99; for (let ch = 0; ch < 2; ch++) { const x = bf.getChannelData(ch); for (let i = 0; i < len; i++) { r = (r * 16807) % 2147483647; x[i] = (r / 1073741823.5 - 1) * Math.pow(1 - i / len, 2.6); } } vb.buffer = bf; } const wet = c.createGain(); wet.gain.value = 0.38; bus.connect(vb); vb.connect(wet); wet.connect(comp);
    return bus;
  }
  /* tutto il brano in un contesto (anche offline): introduzione + "passes" giri. Restituisce [inizio del giro, fine] in secondi */
  function evRender(c, d, id, passes, t0) {
    const s = EVS[id]; if (!s) return null; let t = t0 || 0.05; const n = s.introSteps + s.pass * (passes || 1); let loopAt = 0;
    for (let p = 0; p < n; p++) { if (p === s.introSteps) loopAt = t; t += evStep(c, d, id, p, t); }
    return [loopAt, t];
  }
  /* --- musica dell'evento dal vivo: un passo dopo l'altro, il giro ricomincia senza azzerare il tempo (nessuno stacco) --- */
  let evId = null, evSkip = false, evCur = null, fakeNow = null;
  /* per i test: un brano normale in un contesto offline (per confrontare il volume con le musiche degli eventi) */
  function trRender(c, d, i, secs) {
    const sv = [ctx, musicBus, song, step, nextT, cur, evCur];
    try { ctx = c; musicBus = d; evCur = null; cur = i; song = buildSong(i); step = 0; nextT = 0.1; fakeNow = secs; schedule(); }
    finally { [ctx, musicBus, song, step, nextT, cur, evCur] = sv; fakeNow = null; }
    return TRACKS[i].g;
  }
  const curGain = () => (evCur ? EVS[evCur.id].g : TRACKS[cur].g);
  function evTick() {
    const s = EVS[evCur.id];
    while (nextT < ctx.currentTime + 0.5) {
      try { evStep(ctx, musicBus, evCur.id, evCur.pos, nextT); } catch (e) { /* niente */ }
      nextT += s.step; evCur.pos++;
      if (evCur.pos >= s.introSteps + s.pass * 64) evCur.pos = s.introSteps; /* dopo molti giri si riparte dal giro (stesso punto musicale) */
    }
  }
  function startEvent() {
    if (!ctx || !evId || !EVS[evId]) return false;
    stopBed(); song = null; evCur = { id: evId, pos: 0 }; nextT = ctx.currentTime + 0.15;
    if (musicTimer) { musicBus.gain.cancelScheduledValues(ctx.currentTime); musicBus.gain.setValueAtTime(musicBus.gain.value, ctx.currentTime); musicBus.gain.linearRampToValueAtTime(MUSIC_K * EVS[evId].g, ctx.currentTime + 1.5); }
    return true; /* niente onTrack: S.track resta il brano scelto dall'utente */
  }
  function startSong(i) { evCur = null; cur = (i + TRACKS.length) % TRACKS.length; song = buildSong(cur); step = 0; nextT = ctx.currentTime + 0.15; startBed(TRACKS[cur].bed); if (musicTimer) { musicBus.gain.cancelScheduledValues(ctx.currentTime); musicBus.gain.setValueAtTime(musicBus.gain.value, ctx.currentTime); musicBus.gain.linearRampToValueAtTime(MUSIC_K * TRACKS[cur].g, ctx.currentTime + 1.5); } if (onTrack) onTrack(cur); }
  function next() { startSong(cur + 1); }
  function musicOn(first) {
    const c = ensure(); if (!c || musicTimer) return;
    /* 1.0.11: durante un evento parte la sua musica (se non si e' scelto un altro brano in questa sessione) */
    if (!(evId && !evSkip && startEvent())) startSong(first != null ? first : cur);
    musicBus.gain.cancelScheduledValues(c.currentTime);
    musicBus.gain.setValueAtTime(musicBus.gain.value, c.currentTime);
    musicBus.gain.linearRampToValueAtTime(MUSIC_K * curGain(), c.currentTime + 3.5); /* 1.0.10 (A-02): -8 dB */
    musicTimer = setInterval(schedule, 120); schedule();
  }
  function musicOff() {
    if (!ctx || !musicTimer) return;
    clearInterval(musicTimer); musicTimer = null; song = null; evCur = null; stopBed();
    musicBus.gain.cancelScheduledValues(ctx.currentTime);
    musicBus.gain.setValueAtTime(musicBus.gain.value, ctx.currentTime);
    musicBus.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.6);
  }
  function skip(i) { evSkip = true; if (!musicTimer) { cur = i; return; } startSong(i); }
  /* evento attuale (null = nessuno): se cambia mentre suona, si passa alla musica giusta */
  function setEvent(id) {
    id = id && EVS[id] ? id : null; if (id === evId) return; evId = id; evSkip = false;
    if (!musicTimer || !ctx) return;
    if (id) startEvent(); else if (evCur) startSong(cur);
  }
  function playEvent() { evSkip = false; if (musicTimer && evId) startEvent(); }
  function holdEvent() { evSkip = true; } /* scelto un altro brano: in questa sessione resta quello */
  /* Accordo morbido per la respirazione */
  function breath(dir, secs) {
    if (!S.sfx) return;
    const c = ensure(); if (!c) return;
    if (!pad) {
      const g = c.createGain(); g.gain.value = 0.0001; g.connect(master);
      const oscs = [261.63, 329.63, 392, 523.25].map((f, i) => { const o = c.createOscillator(); o.type = i === 3 ? "triangle" : "sine"; o.frequency.value = f; o.detune.value = (i - 1.5) * 4; o.connect(g); o.start(); return o; });
      pad = { g, oscs };
    }
    const t = c.currentTime;
    pad.g.gain.cancelScheduledValues(t);
    pad.g.gain.setValueAtTime(Math.max(0.0001, pad.g.gain.value), t);
    pad.g.gain.linearRampToValueAtTime(dir === "in" ? 0.12 : 0.015, t + secs);
  }
  function breathStop() {
    if (!pad || !ctx) return;
    const p = pad; pad = null; const t = ctx.currentTime;
    p.g.gain.cancelScheduledValues(t); p.g.gain.setValueAtTime(p.g.gain.value, t); p.g.gain.linearRampToValueAtTime(0.0001, t + 0.5);
    setTimeout(() => { p.oscs.forEach((o) => { try { o.stop(); } catch (e) { /* niente */ } }); }, 700);
  }
  function suspend() { if (ctx && ctx.state === "running") { try { ctx.suspend(); } catch (e) { /* niente */ } } }
  function resume() { if (ctx && ctx.state === "suspended") { try { ctx.resume(); } catch (e) { /* niente */ } } }
  function note(f, len = 0.7) { lastAt = performance.now(); if (!S.sfx) return; const c = ensure(); if (!c) return; try { bell(f, c.currentTime + 0.005, 0.2, fxBus, len); } catch (e) { /* niente */ } }
  function level() { if (!an) return 0; const d = new Float32Array(an.fftSize); an.getFloatTimeDomainData(d); let q = 0; for (const x of d) q += x * x; return Math.sqrt(q / d.length); }
  return { petMotif, MOTIF_PETS: Object.keys(MOTIF), logoTick, logoChime, logoTickTo, logoChimeTo, LOGO_HZ, CHIME_HZ, S16, level, play, note, catchSound, haptic, musicOn, musicOff, skip, breath, breathStop, suspend, resume, playing: () => !!musicTimer, unlock: ensure, lastAt: () => lastAt, mark: () => { lastAt = performance.now(); }, state: () => (ctx ? ctx.state : ""), sfxReady: () => Object.keys(BUF).length, sfxBuf: (n) => BUF[n] || null, sfxNames: () => Object.keys(PRE).concat(["tick0", "tick1", "tick2", "tick3"]), trace: () => trace.slice(), track: () => (evCur ? -1 : cur),
    setEvent, playEvent, holdEvent, eventId: () => evId, eventPlaying: () => !!evCur, EV_IDS, evRender, evRenderFrom, evChain, trRender, evInfo: (id) => (EVS[id] ? { g: EVS[id].g, K: MUSIC_K, step: EVS[id].step, per: EVS[id].per, bars: EVS[id].bars, introSteps: EVS[id].introSteps, pass: EVS[id].pass, M: EVS[id].M, C: EVS[id].C, ch: EVS[id].ch } : null), setOnTrack: (f) => { onTrack = f; }, count: TRACKS.length };
})();
