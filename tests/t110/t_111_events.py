"""1.0.11: gli eventi trasformano la stanza (98zw_v111_events.js, 11zn_v111_events.css).
Per ogni evento (Lanterne, Natale tappa 0 e 3, Nuovo inizio, Stelle, Aquiloni): decorazioni presenti nella scheda e nello
schermo intero, SVG valido (serve anche a foto e cartoline), nessun errore, nessuno scorrimento orizzontale a 360/412/800,
fermo con "riduci movimento" e con la modalita' leggera, animato altrimenti, prestazioni a riposo, ornamento del saluto sulla
stessa riga, niente decorazioni fuori stagione o nelle altre scene. Nessun dato personale."""
import asyncio, sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import lib110 as T

EV = [("Lanterne", (2026, 11, 20, 18, 30), None, ["e1deco", "e1sky", "e1win", "e1rise"]),
      ("Natale tappa 0", (2026, 12, 9, 10, 0), 0, ["e1deco", "e1sky", "e1snow", "e1sap"]),
      ("Natale tappa 3", (2026, 12, 20, 21, 30), 3, ["e1deco", "e1snow", 'class="xmtree"']),
      ("Nuovo inizio", (2027, 1, 10, 9, 30), None, ["e1deco", "e1sky", ">10</text>"]),
      ("Stelle", (2027, 2, 10, 21, 30), None, ["e1deco", "e1sky", "e1shoot"]),
      ("Aquiloni", (2027, 3, 12, 10, 0), None, ["e1deco", "e1kite", "e1pass", "e1petal"])]

def st_for(dt, stg, **kw):
    day = f"{dt[0]:04d}-{dt[1]:02d}-{dt[2]:02d}"
    st = T.base_state("it", day=day, furn=["rug", "lamp", "plant", "shelf", "frame", "lights", "pouf", "clock"], owned=["w_cream", "rug", "lamp", "plant", "shelf", "frame", "lights", "pouf", "clock"], **kw)
    if stg is not None: st["v20xmas"] = {"year": 2026, "stage": stg, "done": [], "ann": 2026}
    st["v20fresh"] = {"year": dt[0], "seen": True}; st["chap"] = {"lanterns": 9, "stars27": 9, "kites27": 9}
    st["season"] = {"key": None, "n": 0, "claimed": False}; st["seaSt"] = None
    return st

SVG_OK = """(() => { const s = document.querySelector('#room svg'); if (!s) return 'nessuna stanza';
  const x = new XMLSerializer().serializeToString(s); const d = new DOMParser().parseFromString(x, 'image/svg+xml');
  return d.getElementsByTagName('parsererror').length ? 'errore' : 'ok'; })()"""
TWEENS = "(() => { let n = 0; document.querySelectorAll('#room .e1sw, #room .e1rise, #room .e1snow, #room .e1kite, #room .e1pass, #room .e1petal, #room .e1shoot, #room .e1sky .star, #room .e1win .star, #room .e1deco .star').forEach((e) => { n += G.getTweensOf(e).length; }); return n; })()"

_page = T.page
async def _retry(*a, **kw):
    for k in range(3):
        try: return await _page(*a, **kw)
        except Exception as e:
            if k == 2: raise
            print("(riprovo: macchina occupata)", str(e)[:60], flush=True)
T.page = _retry

async def guard(fn, *a):
    """la macchina di prova e' condivisa: se il browser cade per memoria si riprova la sezione (fino a 3 volte)"""
    for k in range(3):
        try: return await fn(*a)
        except Exception as e:
            if k == 2: raise
            print("(riprovo la sezione: macchina occupata)", str(e)[:60], flush=True); await asyncio.sleep(8)

async def main(b):
    for row in (EV if not os.environ.get("E111_ONLY") else []): await guard(one_event, b, *row)
    if os.environ.get("E111_ONLY") == "motion": return await guard(motion, b)
    await guard(sizes, b); await guard(motion, b); await guard(misc, b)

async def one_event(b, name, dt, stg, need):
    if True:
        ctx, pg = await T.page(b, st_for(dt, stg), date=dt, lang="it-IT", wait=3500)
        await T.close_layer(pg); await T.ev(pg, "tab = 'today'; render(); 1"); await pg.wait_for_timeout(600)
        h = await pg.evaluate("(document.getElementById('room') || {}).innerHTML || ''")
        miss = [k for k in need if k not in h]
        T.check(f"{name}: la stanza si trasforma ({', '.join(need)})", not miss, miss)
        T.check(f"{name}: SVG della stanza valido (foto e cartoline)", await pg.evaluate(SVG_OK) == "ok")
        if stg == 0: T.check(f"{name}: l'alberello si tocca e apre le tappe", await pg.evaluate("!!document.getElementById('xmTreeHit')"))
        # schermo intero: decorazioni presenti, cordini dal soffitto (cima della scena)
        await T.ev(pg, "openFull(); 1"); await pg.wait_for_timeout(1400)
        r = await pg.evaluate("""(() => { const s = document.querySelector('#room svg'); if (!s) return null; const vb = s.getAttribute('viewBox').split(' ').map(Number);
          const hang = [...s.querySelectorAll('.e1sw')].filter((g) => Math.abs(+g.dataset.o.split(' ')[1] - vb[1]) < 0.01).length;
          return { deco: !!s.querySelector('.e1deco'), top: vb[1], hang, gar: !!s.querySelector('.e1gar') }; })()""")
        T.check(f"{name}: schermo intero con le decorazioni (appese al soffitto)", r and r["deco"] and (r["hang"] >= 2 or (name == "Aquiloni" and r["hang"] == 0)) and (r["gar"] or r["top"] > -150), r)
        await T.ev(pg, "closeFull(); 1"); await pg.wait_for_timeout(300)
        T.check(f"{name}: nessun errore", not pg.errs, pg.errs[:2])
        await ctx.close()

async def idle(pg):
    await pg.mouse.click(5, 5); await pg.wait_for_timeout(5000)
    ticks = await T.ev(pg, "new Promise((r) => { let n = 0; const f = () => n++; G.ticker.add(f); setTimeout(() => { G.ticker.remove(f); r(n); }, 2000); })")
    c = await pg.context.new_cdp_session(pg); await c.send("Performance.enable")
    m0 = {x["name"]: x["value"] for x in (await c.send("Performance.getMetrics"))["metrics"]}; await pg.wait_for_timeout(5000)
    m1 = {x["name"]: x["value"] for x in (await c.send("Performance.getMetrics"))["metrics"]}
    return (round(ticks / 2), round((m1["RecalcStyleCount"] - m0["RecalcStyleCount"]) / 5, 1), round((m1["LayoutCount"] - m0["LayoutCount"]) / 5, 1), round((m1["TaskDuration"] - m0["TaskDuration"]) * 200, 1))

async def sizes(b):
    # misure: 360, 412, tablet; tema scuro
    for w, h, scheme in [(360, 780, "light"), (412, 915, "dark"), (800, 1280, "light")]:
        ctx, pg = await T.page(b, st_for((2027, 3, 12, 10, 0), None, theme=scheme), date=(2027, 3, 12, 10, 0), lang="it-IT", w=w, h=h, scheme=scheme)
        await T.close_layer(pg); await T.ev(pg, "tab = 'today'; render(); 1"); await pg.wait_for_timeout(500)
        o = await pg.evaluate("({ sw: document.scrollingElement.scrollWidth, iw: innerWidth, deco: !!document.querySelector('#room .e1deco') })")
        T.check(f"{w}px {scheme}: stanza decorata, niente scorrimento orizzontale", o["deco"] and o["sw"] <= o["iw"], o)
        await ctx.close()

async def motion(b):
    # movimento: fermo con riduci movimento e con la modalita' leggera, animato altrimenti
    dt = (2026, 11, 20, 18, 30)
    for label, kw, extra, want in [("animazioni attive", {"lite": False, "calm": False}, "", True),
                                   ("modalita' leggera", {"lite": True, "calm": False}, "", False),
                                   ("riduci movimento", {"lite": False, "calm": False}, "window.matchMedia = ((m) => (q) => q.includes('reduce') ? { matches: true, media: q, addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {} } : m(q))(window.matchMedia.bind(window));", False)]:
        ctx, pg = await T.page(b, st_for(dt, None, **kw), date=dt, lang="it-IT", extra_js=extra)
        await T.close_layer(pg); await T.ev(pg, "tab = 'today'; render(); 1"); await pg.wait_for_timeout(1800)
        n = await T.ev(pg, TWEENS); deco = await pg.evaluate("!!document.querySelector('#room .e1deco')")
        T.check(f"{label}: decorazioni {'animate' if want else 'ferme'} ({n} animazioni)", deco and ((n > 0) if want else (n == 0)), n)
        if want:
            t0 = await T.ev(pg, "(() => { const o = { ph: 'evening', pet: S.pet, e: 'felice', hat: null, st: 1, furn: S.furn, wall: S.wall, away: false, glow: 1, label: '', season: 'autumn' }; const a = performance.now(); for (let i = 0; i < 30; i++) roomSVG(o); return (performance.now() - a) / 30; })()")
            T.check(f"  disegno della stanza con l'evento: {t0:.1f} ms (meno di 12)", t0 < 12, t0)
            ev_idle = await idle(pg)
            ctx2, pg2 = await T.page(b, st_for(dt, None, **kw), date=dt, lang="it-IT", extra_js="window.__E111_OFF = true;")
            await T.close_layer(pg2); await T.ev(pg2, "tab = 'today'; render(); 1"); await pg2.wait_for_timeout(1800)
            base = await idle(pg2); await ctx2.close()
            pf = lambda r: (r[1] / max(r[0], 1), r[2] / max(r[0], 1))
            T.check(f"  a riposo con l'evento {ev_idle} e senza {base} (fotogrammi/s, stile/s, layout/s, CPU ms/s): stesso lavoro per fotogramma, al massimo 30/s", ev_idle[0] <= 30 and ev_idle[1] <= 30 and pf(ev_idle)[0] <= pf(base)[0] + 0.25 and pf(ev_idle)[1] <= pf(base)[1] + 0.25, (ev_idle, base))
        T.check(f"{label}: nessun errore", not pg.errs, pg.errs[:2])
        await ctx.close()

async def misc(b):
    # ornamento del saluto sulla stessa riga; fuori stagione e nelle altre scene niente decorazioni
    ctx, pg = await T.page(b, st_for((2027, 2, 10, 11, 0), None), date=(2027, 2, 10, 11, 0), lang="it-IT")
    await T.close_layer(pg); await T.ev(pg, "tab = 'today'; render(); 1"); await pg.wait_for_timeout(500)
    o = await pg.evaluate("""(() => { const h = document.querySelector('h1.greet'), w = h && h.querySelector('.gw'); if (!w) return null;
      return { h1: getComputedStyle(h, '::after').content, gw: getComputedStyle(w, '::after').content, lines: Math.round(w.getBoundingClientRect().height / parseFloat(getComputedStyle(w).lineHeight || 24)) }; })()""")
    T.check("Saluto: l'ornamento della stagione sta accanto alla parola, non su una riga a parte", o and o["h1"] in ("none", "normal") and o["gw"] not in ("none", "normal"), o)
    fest = await T.ev(pg, "(() => { const f0 = full, s0 = sceneId; full = true; sceneId = 'festival'; let s = ''; try { s = roomSVG({ ph: 'day', pet: S.pet, e: 'felice', hat: null, st: 1, furn: S.furn, wall: S.wall, away: false, glow: 1, label: '', season: 'winter', top: 120, bot: 140 }); } finally { full = f0; sceneId = s0; } return s.indexOf('e1deco'); })()")
    T.check("Scena della festa (schermo intero): nessuna decorazione della stanza", fest == -1, fest)
    T.check("  nessun errore", not pg.errs, pg.errs[:2])
    await ctx.close()
    ctx, pg = await T.page(b, st_for((2026, 9, 20, 11, 0), None), date=(2026, 9, 20, 11, 0), lang="it-IT")
    await T.close_layer(pg); await T.ev(pg, "tab = 'today'; render(); 1"); await pg.wait_for_timeout(500)
    T.check("Prima delle Lanterne (20/09/2026): stanza normale", await pg.evaluate("!document.querySelector('#room .e1deco') && !!document.querySelector('#room svg')"))
    T.check("  nessun errore", not pg.errs, pg.errs[:2])
    await ctx.close()

T.run(main)
