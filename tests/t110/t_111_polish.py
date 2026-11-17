"""1.0.11 rifiniture della marca (98zw_v111_polish.js, 3zzm_v111_texts.js, 41za_real_latam.js, 11zo_v111_polish.css):
A) voce senza colpa nelle 14 lingue (finestra di uscita, bentornato, frasi del compagno), testi che non escono dai riquadri a 360 px;
B) posti veri dell'America Latina per lo spagnolo (8 posti: 4 Spagna + 4 America Latina, stessi livelli/ore/premi), cartoline
   3D e disegni di riserva, lista a 360 / 412 / tablet e tema scuro; il portoghese resta tutto Brasile, le altre lingue 4 posti;
C) stella polare "compagno-curato-settimana": una volta a settimana al terzo giorno curato, mai per minori o statistiche spente;
D) contrasto MISURATO (pixel veri) di ogni scritta nelle schermate principali, tema chiaro e scuro, tutti i compagni.
Nessun dato personale: nomi e testi di prova inventati."""
import json, sys, os, re
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import lib110 as T
import contrast111 as C

BAN = {"it": r"aspett|saltat|mancat", "en": r"waiting|wait for|missed|skip", "de": r"wartet|gewartet|verpasst|auslass",
       "es": r"esper|saltaste|me salto|perdiste", "fr": r"attend|manqu|saut", "pt": r"esper|pular|perdeu", "ja": r"待って|休んだ日",
       "ko": r"기다리|빠지|놓쳐", "zh": r"等你|错过", "zht": r"等你|錯過", "ru": r"жд[её]т|ждать|пропус|не хватало",
       "pl": r"czeka|opuś", "nl": r"wacht|gemist|oversla", "tr": r"bekl|kaçır|atlar"}
LIVE = """(() => { const t = L(), l = S.lang, n = 'Germo';
  return [V18B[l].t, V18B[l].p(n), ...t.v12.backP.map((f) => f(n)), V19A[l].ready, W20T[l].gP(n, 'X', 'Y'), t.talk.night[2], t.chat.R.greet[1],
    t.chat.R.bye[0], t.tomorrow, t.gardenEmpty, t.teaserT, t.shield.P, t.guide[3][0], t.guide[3][1]]; })()"""
OVER = """(sel) => [...document.querySelectorAll(sel)].filter((e) => [...e.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())).filter((e) => e.offsetParent && (e.scrollWidth > e.clientWidth + 1 || e.getBoundingClientRect().right > innerWidth + 0.5 || e.getBoundingClientRect().left < -0.5)).map((e) => (e.id || e.className) + ':' + e.textContent.slice(0, 30))"""

PARTS = os.environ.get("T111_PARTS", "ABCD")
LANGS = os.environ.get("T111_LANGS", ",".join(T.LANGS)).split(",")

async def main(b):
    # ---------------- A) voce, 14 lingue, 360 px ----------------
    for l in (LANGS if "A" in PARTS else []):
        for tent in range(4):   # macchina condivisa: se la scheda viene chiusa per memoria si riprova la lingua
            try: await part_a(b, l); break
            except Exception as e:
                print(f"(riprovo {l}: {str(e)[:80]})", flush=True)
                if tent == 3: T.check(f"A {l}: prova completata", False, str(e)[:120])
    if "B" in PARTS: await part_b(b)
    if "C" in PARTS: await part_c(b)
    if "D" in PARTS: await part_d(b)

async def part_a(b, l):
        ctx, pg = await T.page(b, T.base_state(l), w=360, h=740, wait=3000)
        try: await _part_a(pg, l)
        finally:
            try: await ctx.close()
            except Exception: pass

async def _part_a(pg, l):
        live = await T.ev(pg, LIVE)
        bad = [s for s in live if re.search(BAN[l], s, re.I)]
        T.check(f"A {l}: nessuna frase di colpa ('ti aspetta', 'hai saltato'...) nei testi toccati", not bad, bad)
        T.check(f"A {l}: finestra di uscita nuova", await T.ev(pg, "V18B[S.lang].t === V111_EXIT[S.lang].t && V18B[S.lang].exit === V111_EXIT[S.lang].exit"))
        await T.close_layer(pg); await T.ev(pg, "exitAsk(); 1"); await pg.wait_for_timeout(700)
        ov = await pg.evaluate(OVER, "#exitAsk h2, #exitAsk p, #exitAsk button")
        T.check(f"A {l}: finestra di uscita a 360 px senza tagli", not ov, ov)
        hb = await T.ev(pg, "[...document.querySelectorAll('#exitAsk button')].map((e) => Math.round(e.getBoundingClientRect().height))")
        T.check(f"A {l}: i due pulsanti dell'uscita alti uguali e >= 48 px", len(hb) == 2 and hb[0] == hb[1] and hb[0] >= 48, hb)
        if l in ("it", "de", "ru", "ja"): await pg.screenshot(path=f"{T.SHOTS}/p111_exit_{l}.png")
        await T.ev(pg, "exitClose(); layer.innerHTML=''; S.backDay = null; const bp = L().v12.backP, keep = bp.slice(); bp.splice(1); try { _openWelcomeBackV13h(); } finally { bp.push(...keep.slice(1)); } 1"); await pg.wait_for_timeout(900)
        txt = await T.ev(pg, "(document.querySelector('.wgbox p') || {}).textContent || ''")
        T.check(f"A {l}: bentornato senza 'giorni saltati'", txt and not re.search(BAN[l], txt, re.I), txt)
        ov = await pg.evaluate(OVER, ".wgbox h2, .wgbox p, .wgbox button")
        fit = await T.ev(pg, "(() => { const r = document.querySelector('.wgbox').getBoundingClientRect(); return r.top >= 0 && r.bottom <= innerHeight && r.left >= 0 && r.right <= innerWidth; })()")
        T.check(f"A {l}: bentornato a 360 px dentro lo schermo, senza tagli", not ov and fit, [ov, fit])
        if l in ("it", "de", "ru"): await pg.screenshot(path=f"{T.SHOTS}/p111_back_{l}.png")
        T.check(f"A {l}: nessun errore", not pg.errs, pg.errs[:3])

# ---------------- B) posti veri ----------------

async def part_b(b):
    ctx, pg = await T.page(b, T.base_state("es", level=7), wait=3000)
    r = await T.ev(pg, "destList().real.map((d) => [d.key, d.lvl, d.h, d.name])")
    T.check("B es: 8 posti veri", len(r) == 8, r)
    T.check("B es: livelli 2,2,3,3,5,5,7,7 e ore 2,2,3,3,3,3,4,4", [x[1] for x in r] == [2, 2, 3, 3, 5, 5, 7, 7] and [x[2] for x in r] == [2, 2, 3, 3, 3, 3, 4, 4], r)
    T.check("B es: Spagna e America Latina si alternano", [x[0] for x in r] == ["r:es:0", "r:es:4", "r:es:1", "r:es:5", "r:es:2", "r:es:6", "r:es:3", "r:es:7"], r)
    T.check("B es: chiavi vecchie invariate (Sevilla..Tenerife = r:es:0..3)", await T.ev(pg, "REAL.es.slice(0, 4).map((p) => p.art).join() === 'sevilla,granada,barcelona,tenerife'"))
    T.check("B es: destByKey dei posti nuovi", await T.ev(pg, "JSON.stringify(['r:es:4','r:es:5','r:es:6','r:es:7'].map((k) => [destByKey(k).lvl, destByKey(k).h]))") == "[[2,2],[3,3],[5,3],[7,4]]")
    ci = await T.ev(pg, "['r:es:4','r:es:5','r:es:6','r:es:7'].map((k) => { const c = cardInfo(k); return [c.title, c.place, c.text.includes('{n}'), /<svg|<img|image/.test(c.art())]; })")
    T.check("B es: cartoline nuove con titolo, posto, testo e immagine", all(x[0] and x[1] and x[2] and x[3] for x in ci), ci)
    T.check("B es: pagina dell'album con 8 cartoline e lo stesso premio (EC.PAGE_REAL)", await T.ev(pg, "(() => { const p = albumPages().find((x) => x.key === 'real:es'); return p.cards.length === 8 && econPageTani(p) === EC.PAGE_REAL; })()"))
    imgs = await pg.evaluate("""async () => { const out = []; for (const a of ['chichenitza','cocora','titicaca','purmamarca']) { const im = new Image(); im.src = window.__v10.ev("IMG3D('pc/r_" + a + ".webp')");
        await new Promise((res) => { im.onload = res; im.onerror = res; }); out.push([a, im.naturalWidth, im.naturalHeight]); } return out; }""")
    T.check("B cartoline 3D 960x640 presenti", all(x[1] == 960 and x[2] == 640 for x in imgs), imgs)
    vec = await T.ev(pg, "['chichenitza','cocora','titicaca','purmamarca'].map((a) => { const s = _realArtP3(a, 'x'); return s.length > 1500 && s.startsWith('<svg') && !s.includes('undefined') && !s.includes('NaN'); })")
    T.check("B disegni vettoriali di riserva validi", all(vec), vec)
    T.check("B portoghese: 4 posti, tutti in Brasile", await T.ev(pg, "REAL.pt.map((p) => p.art).join() === 'rio,amazonia,lencois,iguacu'"))
    T.check("B altre lingue: sempre 4 posti", await T.ev(pg, "Object.keys(REAL).filter((l) => l !== 'es').every((l) => REAL[l].length === 4)"))
    T.check("B titolo della sezione", await T.ev(pg, "L().realT") == "Viajes por España y Latinoamérica")
    await ctx.close()
    ctx, pg = await T.page(b, T.base_state("es", level=2), w=360, h=740, wait=3000)
    await T.close_layer(pg); await T.ev(pg, "S.level = 2; showLevelUp(1); 1"); await pg.wait_for_timeout(1500)
    txt = await T.ev(pg, "(layer.querySelector('.levelup') || {}).textContent || ''")
    T.check("B es livello 2: annuncia Sevilla e Chichén Itzá", "Sevilla" in txt and "Chichén Itzá" in txt, txt[:200])
    ov = await pg.evaluate(OVER, ".levelup *")
    fit = await T.ev(pg, "(() => { const r = layer.querySelector('.levelup .box').getBoundingClientRect(); return r.left >= 0 && r.right <= innerWidth && (r.bottom <= innerHeight || layer.querySelector('.levelup').scrollHeight > layer.querySelector('.levelup').clientHeight); })()")
    T.check("B es livello 2 a 360 px: finestra del livello senza tagli", not ov and fit, [ov, fit])
    await pg.screenshot(path=f"{T.SHOTS}/p111_levelup_es_360.png")
    await ctx.close()
    for (w, h, sch, nm) in [(360, 740, "light", "360"), (412, 915, "light", "412"), (800, 1280, "light", "tablet"), (412, 915, "dark", "412dark")]:
        ctx, pg = await T.page(b, T.base_state("es", level=7), w=w, h=h, scheme=sch, wait=3000)
        await T.close_layer(pg); await T.ev(pg, "tab = 'trips'; render(); 1"); await pg.wait_for_timeout(1200)
        keys = await T.ev(pg, "[...document.querySelectorAll('[data-dest^=\"r:es:\"]')].map((e) => e.dataset.dest)")
        T.check(f"B viaggi {nm}: gli 8 posti veri nella lista", sorted(set(keys)) == [f"r:es:{i}" for i in range(8)], keys)
        ov = await pg.evaluate(OVER, "[data-dest^='r:es:'], [data-dest^='r:es:'] *")
        T.check(f"B viaggi {nm}: nessun testo tagliato o fuori schermo", not ov, ov[:5])
        hw = await T.ev(pg, "document.documentElement.scrollWidth <= innerWidth")
        T.check(f"B viaggi {nm}: niente scorrimento orizzontale", hw)
        await T.ev(pg, "document.querySelector('[data-dest=\"r:es:4\"]').scrollIntoView({ block: 'start' }); window.scrollBy(0, -80); 1"); await pg.wait_for_timeout(1500)
        await pg.screenshot(path=f"{T.SHOTS}/p111_trips_es_{nm}.png")
        await ctx.close()


async def part_c(b):
    async def gc_hits(st, age="adult", extra="", days=(), later=None):
        ctx, pg = await T.page(b, st, native=True, age=age, wait=3000, extra_js=extra)
        await T.ev(pg, "S.days = S.days || {}; " + "".join(f"S.days['{d}'] = {{ done: 1, total: 5 }}; " for d in days) + "render(); render(); 1"); await pg.wait_for_timeout(600)
        n1 = sum("compagno-curato-settimana" in u for u in pg.gc)
        n2 = None
        if later:
            await T.ev(pg, f"__setDay({later[0]}, {later[1]}, {later[2]}, 10); S.days['{later[3]}'] = {{ done: 2, total: 5 }}; S.days['{later[4]}'] = {{ done: 1, total: 5 }}; S.days['{later[5]}'] = {{ done: 3, total: 5 }}; render(); render(); 1")
            await pg.wait_for_timeout(600); n2 = sum("compagno-curato-settimana" in u for u in pg.gc)
        await ctx.close(); return n1, n2
    st = T.base_state("en")
    n1, _ = await gc_hits(st, days=("2026-11-16", "2026-11-17"))
    T.check("C 2 giorni curati: nessun evento", n1 == 0, n1)
    n1, n2 = await gc_hits(st, days=("2026-11-16", "2026-11-17", "2026-11-18"), later=(2026, 11, 25, "2026-11-23", "2026-11-24", "2026-11-25"))
    T.check("C 3 giorni nella settimana: un evento solo, anche dopo altri disegni", n1 == 1, n1)
    T.check("C settimana dopo, di nuovo 3 giorni: un secondo evento", n2 == 2, n2)
    n1, _ = await gc_hits(st, days=("2026-11-13", "2026-11-14", "2026-11-16"))
    T.check("C giorni a cavallo di due settimane (ven, sab, lun): nessun evento", n1 == 0, n1)
    n1, _ = await gc_hits(st, age="child", days=("2026-11-16", "2026-11-17", "2026-11-18"))
    T.check("C sotto l'eta' del consenso digitale (bambino): nessun evento", n1 == 0, n1)
    n1, _ = await gc_hits(st, extra="localStorage.setItem('tanetto-statistiche','0');", days=("2026-11-16", "2026-11-17", "2026-11-18"))
    T.check("C statistiche spente: nessun evento", n1 == 0, n1)


async def part_d(b):
    plus_title_check()
    cfg = [("germo", "light"), ("germo", "dark"), ("ondi", "light"), ("ondi", "dark"), ("lumi", "light"), ("miko", "light"), ("rufi", "light"), ("pingo", "light"), ("dori", "light"), ("dori", "dark")]
    if os.environ.get("T111_D"): cfg = [tuple(x.split(":")) for x in os.environ["T111_D"].split(",")]
    for (pet, sch) in cfg:
        if True:
            for tent in range(4):
                try: fails = await _part_d(b, pet, sch); break
                except Exception as e:
                    print(f"(riprovo {pet} {sch}: {str(e)[:80]})", flush=True); fails = None
            if fails is None: T.check(f"D contrasto {pet} {sch}: prova completata", False); continue
            T.check(f"D contrasto {pet} {sch}: ogni scritta >= 4,5:1 (3:1 se grande)", not fails, fails[:12])

def plus_title_check():
    """titolo "Tanetto Plus" a gradiente (testo grande, 26 px): ogni colore del gradiente >= 3:1 sul fondo della finestra Plus"""
    h = lambda x: tuple(int(x[i:i + 2], 16) for i in (1, 3, 5))
    lt = min(C.ratio(h(c), h("#FFF4DD")) for c in ("#A9661A", "#C2502E")); dk = min(C.ratio(h(c), h("#25211C")) for c in ("#FFD27A", "#F59A6B"))
    T.check(f"D titolo Plus a gradiente: chiaro {lt:.2f}, scuro {dk:.2f} (min 3:1, testo grande)", lt >= 3 and dk >= 3)

async def _part_d(b, pet, sch):
    ctx, pg = await T.page(b, T.base_state("en", pet=pet), scheme=sch, w=360, h=740, wait=3000)
    try:
        fails = []
        for scr in ("today", "trips", "home", "diary", "more", "plus", "exit"):
            await T.close_layer(pg)
            if scr == "plus": await T.ev(pg, "tab='today'; render(); openPlus('test'); 1")
            elif scr == "exit": await T.ev(pg, "exitAsk(); 1")
            else: await T.ev(pg, f"tab='{scr}'; render(); window.scrollTo(0,0); 1")
            await pg.wait_for_timeout(900)
            for y in ((0,) if scr in ("plus", "exit") else (0, 800, 1600)):
                if y: await pg.evaluate(f"window.scrollTo(0,{y})"); await pg.wait_for_timeout(300)
                for (r, need, it, fg, bg) in await C.measure(pg):
                    if r < need: fails.append(f"{scr}: {r}<{need} '{it['t']}' {it['cls'][:50]} fg={fg} bg={bg}")
            if scr == "exit": await T.ev(pg, "exitClose(); 1")
        return sorted(set(fails))
    finally:
        try: await ctx.close()
        except Exception: pass

T.run(main)
