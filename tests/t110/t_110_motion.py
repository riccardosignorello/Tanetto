"""1.0.10: menu sospeso con colore per scheda, primo avvio con luce morbida, guida iniziale fluida (un solo velo)."""
import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import lib110 as T
SH = "/dev/shm/t110shots"; os.makedirs(SH, exist_ok=True)

def lum(c):
    def ch(v):
        v = v / 255
        return v / 12.92 if v <= 0.03928 else ((v + 0.055) / 1.055) ** 2.4
    return 0.2126 * ch(c[0]) + 0.7152 * ch(c[1]) + 0.0722 * ch(c[2])
def ratio(a, b):
    la, lb = lum(a), lum(b); return (max(la, lb) + 0.05) / (min(la, lb) + 0.05)

# colore del testo della scheda attiva e fondo della barca (il fondo e' paper al 93% sopra il fondo pagina: si usa paper)
PROBE = """(() => { const rgb = (s) => (s.match(/[\\d.]+/g) || []).slice(0, 3).map(Number);
  const n = document.getElementById('tabsIn'); const cur = n.querySelector('.tab[aria-current="page"]');
  const lab = cur.querySelector('span:last-child'); const r = n.getBoundingClientRect();
  const tabs = [...n.querySelectorAll('.tab')].map((x) => { const b = x.getBoundingClientRect(); return [Math.round(b.width), Math.round(b.height)]; });
  const paper = getComputedStyle(document.documentElement).getPropertyValue('--paper').trim();
  return { cur: n.dataset.cur, color: rgb(getComputedStyle(lab).color), paper, left: r.left, right: r.right, bottom: r.bottom, vw: innerWidth, vh: innerHeight,
    sw: document.documentElement.scrollWidth, fills: n.querySelectorAll('[data-v110f]').length, tabs }; })()"""
def hexrgb(h):
    h = h.lstrip("#"); return [int(h[i:i + 2], 16) for i in (0, 2, 4)]

async def main(b):
    # 1) menu: colore per scheda, contrasto, misure, dentro lo schermo
    for scheme in ("light", "dark"):
        for w, h in ((412, 915), (320, 640), (1280, 800)):
            ctx, pg = await T.page(b, T.base_state("it"), age="adult", lang="it-IT", native=True, scheme=scheme, w=w, h=h, mobile=w < 1000)
            await T.close_layer(pg)
            for tb in ("today", "trips", "home", "diary", "more"):
                if tb != "today":
                    await pg.click(f'#tabs .tab[data-tab="{tb}"]'); await pg.wait_for_timeout(700)
                    await T.close_layer(pg)
                p = await T.ev(pg, PROBE)
                cr = ratio(p["color"], hexrgb(p["paper"]))
                ok = p["cur"] == tb and cr >= 4.5 and p["left"] >= 0 and p["right"] <= p["vw"] and p["bottom"] <= p["vh"] and p["sw"] <= p["vw"] and p["fills"] >= 5 and all(x[1] >= 48 and x[0] >= 48 for x in p["tabs"])
                T.check(f"{scheme} {w}px {tb}: scheda giusta, contrasto {cr:.2f}, menu dentro lo schermo, tocchi da 48, icone piene", ok, p)
            if w == 412: await pg.screenshot(path=f"{SH}/motion_dock_{scheme}.png")
            T.check(f"{scheme} {w}px: nessun errore", not pg.errs, pg.errs[:3])
            await ctx.close()

    # 2) l'ultimo elemento della pagina non resta nascosto sotto il menu
    ctx, pg = await T.page(b, T.base_state("it"), age="adult", lang="it-IT", native=True)
    await T.close_layer(pg)
    for tb in ("today", "more"):
        await T.ev(pg, f"tab = '{tb}'; render(); 1"); await pg.wait_for_timeout(500)
        r = await T.ev(pg, "(async () => { scrollTo(0, document.documentElement.scrollHeight); await new Promise((z) => setTimeout(z, 400)); const els = [...document.querySelectorAll('#app button, #app a, #app .goal')].filter((e) => e.offsetParent && !e.closest('#tabs')); const last = els[els.length - 1]; const lb = last.getBoundingClientRect(); const tb = document.getElementById('tabsIn').getBoundingClientRect(); return [Math.round(lb.bottom), Math.round(tb.top), last.textContent.trim().slice(0, 30)]; })()")
        T.check(f"{tb}: l'ultimo pulsante si vede sopra il menu", r[0] <= r[1], r)
    await ctx.close()

    # 3) Natale: il menu tiene i colori di Natale (niente colore per scheda)
    ctx, pg = await T.page(b, T.base_state("it", day="2026-12-15"), date=(2026, 12, 15, 9, 7), age="adult", lang="it-IT", native=True)
    await T.close_layer(pg)
    r = await T.ev(pg, "[document.documentElement.hasAttribute('data-xmas'), getComputedStyle(document.querySelector('.tab[aria-current=\"page\"]')).color]")
    T.check("Natale: la scheda attiva usa il rosso di Natale, non il verde della scheda", (not r[0]) or r[1] != "rgb(47, 107, 44)", r)
    await ctx.close()

    # 4) primo avvio: luce morbida solo nei passi iniziali
    ctx, pg = await T.page(b, None, age="none", lang="it-IT", native=True, fresh=True, noage_gate=False, wait=1500)
    r = await T.ev(pg, "[document.documentElement.classList.contains('v110onb'), getComputedStyle(document.documentElement, '::before').backgroundImage.includes('radial-gradient')]")
    T.check("primo avvio: sfondo con luce morbida", r == [True, True], r)
    for i in range(2):
        await pg.locator("button.btn:visible").first.click(); await pg.wait_for_timeout(1200)
    await pg.locator("button.btn:visible").first.click(); await pg.wait_for_timeout(2500)
    r = await T.ev(pg, "[document.documentElement.classList.contains('v110onb'), !!S.pet]")
    T.check("dopo il primo avvio la luce si spegne", r == [False, True], r)
    T.check("primo avvio: nessun errore", not pg.errs, pg.errs[:3])
    await ctx.close()

    # 5) guida: un solo velo per tutti i passi, il cerchio va sul punto giusto, alla fine S.tut = 99
    for lang, loc in (("it", "it-IT"), ("ja", "ja-JP")):
        st = T.base_state(lang); st["tut"] = 0
        ctx, pg = await T.page(b, st, age="adult", lang=loc, native=True)
        await T.close_layer(pg); await T.ev(pg, "tab = 'today'; render(); maybeTutorial(); 1"); await pg.wait_for_timeout(1600)
        ids = []
        for k in range(3):
            r = await T.ev(pg, "(() => { const w = document.querySelectorAll('.tutwrap'); const ring = document.querySelector('.tutring').getBoundingClientRect(); const sel = TUT_TARGETS[S.tut]; const t = (sel === '#tabs' ? document.getElementById('tabsIn') : document.querySelector(sel)).getBoundingClientRect(); const box = document.querySelector('.tutbox').getBoundingClientRect(); return [w.length, Math.abs(ring.left - t.left) < 14 && Math.abs(ring.top - t.top) < 14, box.top >= 0 && box.bottom <= innerHeight, document.getElementById('tutTx').textContent.length > 10, document.activeElement && document.activeElement.id]; })()")
            ids.append(await T.ev(pg, "document.querySelector('.tutwrap') ? (document.querySelector('.tutwrap').dataset.k = document.querySelector('.tutwrap').dataset.k || String(Math.random())) : ''"))
            T.check(f"{lang} guida passo {k + 1}: un solo velo, cerchio sul punto, riquadro nello schermo, testo, Avanti col focus", r[0] == 1 and r[1] and r[2] and r[3] and r[4] == "tutNext", r)
            if k == 2 and lang == "it": await pg.screenshot(path=f"{SH}/motion_tut_it.png")
            await pg.click("#tutNext"); await pg.wait_for_timeout(1000)
        T.check(f"{lang} guida: lo stesso velo resta dall'inizio alla fine (niente spegni e riaccendi)", len(set(ids)) == 1, ids)
        r = await T.ev(pg, "[S.tut, document.querySelectorAll('.tutwrap').length, tutOn]")
        T.check(f"{lang} guida finita: S.tut 99, velo tolto", r == [99, 0, False], r)
        T.check(f"{lang} guida: nessun errore", not pg.errs, pg.errs[:3])
        await ctx.close()
    # "Salta" chiude tutto
    st = T.base_state("it"); st["tut"] = 0
    ctx, pg = await T.page(b, st, age="adult", lang="it-IT", native=True)
    await T.close_layer(pg); await T.ev(pg, "tab = 'today'; render(); maybeTutorial(); 1"); await pg.wait_for_timeout(1600)
    await pg.click("#tutSkip"); await pg.wait_for_timeout(400)
    r = await T.ev(pg, "[S.tut, document.querySelectorAll('.tutwrap').length]")
    T.check("guida: Salta chiude e non torna", r == [99, 0], r)
    await ctx.close()

    # 6) tutte le sezioni: colore della sezione, icona accanto al titolo, selettori e umore leggibili, niente scorrimento laterale
    for scheme in ("light", "dark"):
        for w in (412, 320):
            ctx, pg = await T.page(b, T.base_state("it"), age="adult", lang="it-IT", native=True, scheme=scheme, w=w, h=800)
            await T.close_layer(pg)
            for tb in ("today", "trips", "home", "diary", "more"):
                await T.ev(pg, f"tab = '{tb}'; render(); 1"); await pg.wait_for_timeout(500); await T.close_layer(pg)
                r = await T.ev(pg, """(() => { const h = document.querySelector('#app .v110hic'); const hb = h ? h.parentElement.getBoundingClientRect() : null;
                  return [document.documentElement.dataset.v110tab, !!h, hb ? hb.right <= innerWidth + 1 : true, document.documentElement.scrollWidth <= innerWidth]; })()""")
                T.check(f"{scheme} {w}px {tb}: colore della sezione, icona al titolo {'no' if tb == 'today' else 'si'}, niente fuori schermo", r[0] == tb and r[1] == (tb != "today") and r[2] and r[3], r)
            await T.ev(pg, "tab = 'diary'; render(); 1"); await pg.wait_for_timeout(400)
            moods = await T.ev(pg, """(() => { const rgb = (s) => { const v = (s.match(/[\\d.]+/g) || []).slice(0, 3).map(Number); return s.startsWith('color(') ? v.map((x) => Math.round(x * 255)) : v; }; return [...document.querySelectorAll('.moods .mood[data-mood]')].map((m) => { m.style.transition = 'none'; m.setAttribute('aria-pressed', 'true'); const c = getComputedStyle(m); const o = [rgb(c.color), rgb(c.backgroundColor)]; m.setAttribute('aria-pressed', 'false'); const c2 = getComputedStyle(m); o.push(rgb(c2.color), rgb(c2.backgroundColor)); return o; }); })()""")
            bad = [i for i, m in enumerate(moods) if ratio(m[0], m[1]) < 4.5 or ratio(m[2], m[3]) < 4.5]
            T.check(f"{scheme} {w}px: faccine dell'umore leggibili scelte e non scelte (contrasto 4,5)", len(moods) == 5 and not bad, [bad, moods[:2]])
            await T.ev(pg, "tab = 'home'; render(); 1"); await pg.wait_for_timeout(400)
            sx = await T.ev(pg, """(() => { const rgb = (s) => { const v = (s.match(/[\\d.]+/g) || []).slice(0, 3).map(Number); return s.startsWith('color(') ? v.map((x) => Math.round(x * 255)) : v; }; const b = document.querySelector('.tabsx button[aria-selected="true"]'); if (!b) return null; b.style.transition = 'none'; const c = getComputedStyle(b); return [rgb(c.color), rgb(c.backgroundColor)]; })()""")
            T.check(f"{scheme} {w}px: selettore del Negozio leggibile", sx is None or ratio(sx[0], sx[1]) >= 4.5, sx)
            T.check(f"{scheme} {w}px sezioni: nessun errore", not pg.errs, pg.errs[:3])
            await ctx.close()

T.run(main)
