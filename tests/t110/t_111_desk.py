"""1.0.11 sito su PC (28_desk.js): l'app dentro una cornice da telefono, tutta visibile senza scorrere la pagina
(1366x768, 1366x657 come Chrome vero su un portatile, 1920x1080, 1920x947); telefoni, tablet touch e app Android come prima."""
import sys, json; sys.path.insert(0, __import__("os").path.dirname(__import__("os").path.abspath(__file__))); import lib110 as T

FIT = """() => { const f = document.querySelector('.deskfr iframe'), b = document.querySelector('.deskfr');
  if (!f) return null; const r = b.getBoundingClientRect(), w = f.contentWindow;
  return { l: r.left, t: r.top, r: r.right, btm: r.bottom, W: innerWidth, H: innerHeight, sw: document.documentElement.scrollWidth,
    sh: document.documentElement.scrollHeight, iw: w.innerWidth, ih: w.innerHeight, app: !!w.document.getElementById('app'), v10: !!w.__v10 }; }"""

async def main(b):
    for (w, h) in ((1366, 768), (1366, 657), (1920, 1080), (1920, 947)):
        ctx, pg = await T.page(b, T.base_state("en"), age="adult", w=w, h=h, mobile=False, frame=True, wait=4500)
        r = await pg.evaluate(FIT)
        ok = bool(r) and r["sw"] <= r["W"] and r["sh"] <= r["H"] and r["t"] >= 0 and r["btm"] <= r["H"] + 0.5 and abs((r["l"] + r["r"]) / 2 - r["W"] / 2) <= 1
        T.check(f"PC {w}x{h}: cornice al centro, tutta nello schermo, pagina senza scorrimento {r and [round(r['l']), round(r['t']), round(r['r']), round(r['btm'])]}", ok, r)
        T.check(f"PC {w}x{h}: dentro la cornice lo schermo e' da telefono (390 px) e l'app parte {r and (r['iw'], r['ih'])}",
                bool(r) and r["iw"] == 390 and 640 <= r["ih"] <= 900 and r["app"] and r["v10"], r)
        fr = pg.frames[1] if len(pg.frames) > 1 else None
        tabs = fr and await fr.evaluate("(() => { const t = document.getElementById('tabs'); if (!t || t.hidden) return null; const q = t.getBoundingClientRect(); return [q.bottom, innerHeight, q.width, innerWidth]; })()")
        T.check(f"PC {w}x{h}: barra delle schede in fondo alla cornice e larga come lei {tabs}", bool(tabs) and abs(tabs[0] - tabs[1]) <= 1 and abs(tabs[2] - tabs[3]) <= 1, tabs)
        T.check(f"PC {w}x{h}: nessun errore", not pg.errs, pg.errs[:3])
        await pg.screenshot(path=f"{T.SHOTS}/desk_{w}x{h}.png")
        await ctx.close()
    # niente cornice: telefono, tablet touch, app Android (Capacitor) anche su schermo largo, ?frame=0
    for name, kw in (("telefono 390x844", dict(w=390, h=844)), ("tablet touch 1280x800", dict(w=1280, h=800)),
                     ("app Android su schermo largo 1366x768", dict(w=1366, h=768, mobile=False, native=True))):
        ctx, pg = await T.page(b, T.base_state("en"), age="adult", frame=True, wait=3000, **kw)
        r = await pg.evaluate("[!!document.querySelector('.deskfr'), !!document.getElementById('app'), !!window.__v10]")
        T.check(f"{name}: nessuna cornice, l'app come prima {r}", r == [False, True, True], r)
        await ctx.close()
    ctx, pg = await T.page(b, T.base_state("en"), age="adult", w=1366, h=768, mobile=False, frame=True, wait=3000)
    await pg.goto(T.URL + "?frame=0"); await pg.wait_for_timeout(3000)
    r = await pg.evaluate("[!!document.querySelector('.deskfr'), !!window.__v10]")
    T.check(f"PC con ?frame=0: l'app a tutta finestra {r}", r == [False, True], r)
    await ctx.close()

T.run(main)
