"""1.0.11: la tua icona accanto al nome (98zv + 11zn).
1) Predefinita: il germoglio, subito dopo l'ultima parola del saluto (con o senza nome), stessa riga, dentro lo schermo,
   pulsante con nome per i lettori di schermo nella lingua giusta, area da toccare >= 44 px: 14 lingue, 360 / 412 / 820,
   chiaro e scuro.
2) Toccando l'icona (o il saluto) si apre il selettore: 12 icone per tutti + 12 con Plus, tutte le immagini caricate,
   pillola "Con Plus" solo senza Plus, la scelta si vede subito in Casa e resta salvata.
3) Senza Plus un'icona Plus apre Tanetto Plus (ragazzi e bambini: con "chiedi a un adulto"), non cambia l'icona.
4) Con Plus si sceglie; se Plus finisce si vede il germoglio ma la scelta resta e torna con Plus.
5) Valori strani nel salvataggio: germoglio, nessun errore. Foto in T110_SHOTS/111i."""
import json, sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import lib110 as T
SH = os.path.join(T.SHOTS, "111i"); os.makedirs(SH, exist_ok=True)
FREE = ["germoglio", "cuore", "stella", "sole", "luna", "fiore", "goccia", "nuvola", "quadrifoglio", "fungo", "sasso", "tazza"]
PLUS = ["corona", "gemma", "arcobaleno", "lanterna", "pallina", "stella_cadente", "aquilone", "pianeta", "mongolfiera", "fiocco", "germoglio_fiore", "razzo"]
GI = """JSON.stringify((() => { const h = document.querySelector('#app h1.greet'); if (!h) return null; const gw = h.querySelector('.gw');
  const o = gw.querySelector('.gwi'); const l = gw.querySelector('.gwl'); if (!o || !l) return { o: !!o, l: !!l };
  const or = o.getBoundingClientRect(); const im = o.querySelector('img');
  const rg = document.createRange(); rg.selectNodeContents(l.firstChild); const tr = [...rg.getClientRects()]; const t = tr[tr.length - 1];
  const hit = getComputedStyle(o, '::after');
  return { id: o.dataset.v111, ow: or.width, oh: or.height, right: or.right, vw: innerWidth, top: or.top, sameLine: or.left >= t.right - 0.5 && or.left - t.right <= 12 && or.top < t.bottom && or.bottom > t.top,
    dy: Math.abs((or.top + or.bottom) / 2 - (t.top + t.bottom) / 2), aria: o.getAttribute('aria-label') || '', tag: o.tagName, loaded: !!im && im.complete && im.naturalWidth > 0,
    hitW: parseFloat(hit.width), fs: parseFloat(getComputedStyle(h.querySelector('.gw')).fontSize) }; })())"""
LANGS = [x for x in os.environ.get("T111_LANGS", "").split(",") if x] or T.LANGS   # per riprovare solo alcune lingue
NAMES = ["", "Luca", "Maria Alessandra Ro", "Wwwwwwwwwwwwwwwwwwww"]

async def page(b, st, **kw):
    """macchina molto carica: si riprova l'apertura (la pagina e' grande e il primo caricamento puo' superare 30 s)"""
    if st is not None and "h_launch" not in st.get("owned", []): st = dict(st, owned=list(st.get("owned", [])) + ["h_launch"])   # niente regalo del lancio sopra
    for i in range(3):
        try: return await T.page(b, st, **kw)
        except Exception as e:
            if i == 2: raise
            print("  (riprovo l'apertura della pagina:", str(e)[:60], ")", flush=True)

async def greeting(b):
    for lang in LANGS:
        for w in ((360, 412, 820) if lang in ("it", "de", "ja") else (360,)):
            for scheme in (("light", "dark") if w == 360 and lang in ("it", "ja", "ru") else ("light",)):
                ctx, pg = await page(b, T.base_state(lang), age="adult", w=w, h=900 if w < 600 else 1180, lang="en-US", wait=1800, scheme=scheme)
                await T.close_layer(pg); bad = []
                for nm in NAMES:
                    await T.ev(pg, f"S.uname = {json.dumps(nm)}; layer.innerHTML = ''; tab = 'today'; render(); 1"); await pg.wait_for_timeout(150)
                    r = json.loads(await T.ev(pg, GI))
                    ok = r and r.get("id") == "germoglio" and r["tag"] == "BUTTON" and r["sameLine"] and r["dy"] <= 3 and r["right"] <= r["vw"] - 8 and 24 <= r["ow"] <= 34 and r["hitW"] >= 44 and len(r["aria"]) > 4 and r["loaded"]
                    if not ok: bad.append((nm, r))
                    if nm in ("", "Wwwwwwwwwwwwwwwwwwww") and w == 360:
                        el = await pg.query_selector("#app h1.greet")
                        if el: await el.screenshot(path=f"{SH}/saluto_{lang}_{scheme}_{len(nm)}.png")
                T.check(f"saluto {lang} {w}px {scheme}: germoglio subito dopo l'ultima parola (anche senza nome e con nomi lunghi), dentro lo schermo, pulsante con nome, immagine caricata", not bad, bad[:2])
                lbl = await T.ev(pg, "document.querySelector('#app h1.greet .gwi').getAttribute('aria-label')")
                T.check(f"  {lang}: etichetta per lettori di schermo nella lingua ({lbl})", lbl == await T.ev(pg, "v111T().btn(v111Label('germoglio'))") and (lang == "en" or "Your icon" not in lbl), lbl)
                T.check(f"  nessun errore ({lang} {w} {scheme})", not pg.errs, pg.errs[:2])
                await ctx.close()

PICK = """JSON.stringify((() => { const b = document.querySelector('.nibox'); if (!b) return null; const ts = [...b.querySelectorAll('.nit')];
  const br = b.getBoundingClientRect();
  return { n: ts.length, ids: ts.map((t) => t.dataset.nic), locked: ts.filter((t) => t.classList.contains('lock')).map((t) => t.dataset.nic),
    pills: ts.filter((t) => t.querySelector('.nipl')).length, on: ts.filter((t) => t.classList.contains('on')).map((t) => t.dataset.nic),
    pressed: ts.filter((t) => t.getAttribute('aria-pressed') === 'true').map((t) => t.dataset.nic), loaded: [...b.querySelectorAll('img')].every((i) => i.complete && i.naturalWidth > 0),
    small: ts.filter((t) => t.getBoundingClientRect().width < 48 || t.getBoundingClientRect().height < 48).length,
    over: ts.filter((t) => { const r = t.getBoundingClientRect(); const p = t.querySelector('.nipl'); const q = p ? p.getBoundingClientRect() : r; return r.left < br.left - 0.5 || r.right > br.right + 0.5 || q.left < br.left || q.right > br.right; }).length,
    clip: ts.filter((t) => { const n = t.querySelector('.nin'); return n.scrollWidth > n.clientWidth + 1 || !n.classList.contains('fit') || parseFloat(getComputedStyle(n).fontSize) < 9.5; }).map((t) => t.querySelector('.nin').textContent),
    labels: ts.map((t) => t.getAttribute('aria-label')), focus: document.activeElement && document.activeElement.dataset ? document.activeElement.dataset.nic : null,
    dialog: !!b.closest('[role=dialog][aria-modal=true]'), title: b.querySelector('h2').textContent }; })())"""

async def picker(b):
    for lang in LANGS:
        for w in ((360, 412, 820) if lang in ("it", "en", "ru") else (360,)):
            ctx, pg = await page(b, T.base_state(lang, uname="Luca"), age="adult", w=w, h=800 if w < 600 else 1180, lang="en-US", wait=1800, native=True)
            await T.close_layer(pg); await pg.wait_for_timeout(700); await T.close_layer(pg)
            await pg.click("#app h1.greet .gwi"); await pg.wait_for_timeout(500)
            r = json.loads(await T.ev(pg, PICK))
            ok = r and r["n"] == 24 and r["ids"] == FREE + PLUS and r["locked"] == PLUS and r["pills"] == 12 and r["on"] == ["germoglio"] and r["pressed"] == ["germoglio"] and r["loaded"] and r["small"] == 0 and r["over"] == 0 and r["dialog"] and r["focus"] == "germoglio"
            T.check(f"selettore {lang} {w}px: 12 per tutti + 12 Plus con 'Con Plus', immagini caricate, germoglio scelto e con il fuoco, dentro la finestra", ok, r)
            T.check(f"  {lang} {w}px: nomi delle icone interi, mai spezzati a meta' parola, carattere >= 9,5 px", r and r["clip"] == [], r and r["clip"])
            if w in (360, 820) and lang in ("it", "en", "de", "ja", "ru"):
                await pg.screenshot(path=f"{SH}/selettore_{lang}_{w}.png")
            # una gratuita: si vede subito in Casa e resta salvata
            await pg.click('.nibox .nit[data-nic="luna"]'); await pg.wait_for_timeout(300)
            r2 = json.loads(await T.ev(pg, "JSON.stringify({ s: S.v111ic, home: document.querySelector('#app h1.greet .gwi').dataset.v111, on: [...document.querySelectorAll('.nibox .nit.on')].map((t) => t.dataset.nic), open: !!document.querySelector('.nibox'), prev: document.querySelector('.niprev img').getAttribute('src'), saved: JSON.parse(localStorage.getItem('tanetto-prova-v3')).v111ic })"))
            T.check(f"  {lang}: 'Luna' scelta: subito in Casa e nell'anteprima, salvata, selettore ancora aperto", r2["s"] == "luna" and r2["home"] == "luna" and r2["on"] == ["luna"] and r2["open"] and "luna" in r2["prev"] and r2["saved"] == "luna", r2)
            # una Plus senza Plus: si apre Tanetto Plus, l'icona non cambia
            await pg.click('.nibox .nit[data-nic="corona"]'); await pg.wait_for_timeout(400)
            r3 = json.loads(await T.ev(pg, "JSON.stringify({ plus: !!document.querySelector('.plusbox'), s: S.v111ic })"))
            T.check(f"  {lang}: senza Plus, 'Corona' apre Tanetto Plus e l'icona resta 'Luna'", r3["plus"] and r3["s"] == "luna", r3)
            T.check(f"  nessun errore (selettore {lang} {w})", not pg.errs, pg.errs[:2])
            await ctx.close()
    # tocco sul saluto (non solo sull'icona) e tastiera
    ctx, pg = await page(b, T.base_state("it", uname="Luca"), age="adult", w=412, h=900, lang="it-IT", wait=1800)
    await T.close_layer(pg)
    await pg.click("#app h1.greet .gw .gwl", position={"x": 3, "y": 8}); await pg.wait_for_timeout(400)
    T.check("toccando il saluto si apre il selettore", await T.ev(pg, "!!document.querySelector('.nibox')"))
    await T.ev(pg, "closeLayer(); 1"); await pg.wait_for_timeout(500)
    await T.ev(pg, "document.querySelector('#app h1.greet .gwi').focus(); 1"); await pg.keyboard.press("Enter"); await pg.wait_for_timeout(400)
    T.check("con la tastiera (Invio sull'icona) si apre il selettore", await T.ev(pg, "!!document.querySelector('.nibox')"))
    await pg.keyboard.press("Tab"); fid = await T.ev(pg, "document.activeElement.dataset.nic || document.activeElement.id")
    T.check("  Tab passa all'icona successiva", fid == "cuore", fid)
    await ctx.close()

async def plus_and_age(b):
    # con Plus: si sceglie; se Plus finisce: germoglio, scelta salvata, riga gentile; torna con Plus
    ctx, pg = await page(b, T.base_state("it", uname="Luca", plusOn=True), age="adult", w=412, h=900, lang="it-IT", wait=1800, native=True)
    await T.close_layer(pg)
    # Plus vero = abbonamento confermato da Google Play da poco (S.plusCheck, 98x): senza la data, sulla macchina carica la prima
    # verifica degli acquisti poteva non essere ancora arrivata e plusActive() restava falso
    for _ in range(60):  # aspetta la prima verifica degli acquisti (simulata: nessun acquisto), che altrimenti spegnerebbe Plus dopo
        if await T.ev(pg, "typeof S.plusCheck === 'number'"): break
        await pg.wait_for_timeout(500)
    await T.ev(pg, "S.plusOn = true; S.plusCheck = Date.now(); render(); 1")
    pa = await T.ev(pg, "plusActive()")
    if pa:
        await pg.click("#app h1.greet .gwi"); await pg.wait_for_timeout(400)
        r = json.loads(await T.ev(pg, PICK))
        T.check("con Plus: nessuna pillola 'Con Plus', nessuna icona bloccata", r["pills"] == 0 and r["locked"] == [], r)
        await pg.click('.nibox .nit[data-nic="arcobaleno"]'); await pg.wait_for_timeout(300)
        T.check("con Plus: 'Arcobaleno' scelto e in Casa", await T.ev(pg, "S.v111ic === 'arcobaleno' && document.querySelector('#app h1.greet .gwi').dataset.v111 === 'arcobaleno' && !document.querySelector('.plusbox')"))
        await pg.screenshot(path=f"{SH}/selettore_plus_it.png")
        await T.ev(pg, "closeLayer(); S.plusOn = false; render(); 1"); await pg.wait_for_timeout(300)
        r = json.loads(await T.ev(pg, "JSON.stringify({ pa: plusActive(), home: document.querySelector('#app h1.greet .gwi').dataset.v111, s: S.v111ic })"))
        T.check("Plus finito: in Casa il germoglio, la scelta resta salvata", not r["pa"] and r["home"] == "germoglio" and r["s"] == "arcobaleno", r)
        await pg.click("#app h1.greet .gwi"); await pg.wait_for_timeout(400)
        kept = await T.ev(pg, "(document.querySelector('.nibox .nikept') || {}).textContent || ''")
        T.check("  nel selettore una riga gentile (la scelta resta salvata)", "salvata" in kept, kept)
        await T.ev(pg, "closeLayer(); S.plusOn = true; S.plusCheck = Date.now(); render(); 1"); await pg.wait_for_timeout(300)
        T.check("  Plus di nuovo attivo: torna l'Arcobaleno", await T.ev(pg, "document.querySelector('#app h1.greet .gwi').dataset.v111") == "arcobaleno")
    else:
        T.check("prova con Plus attivo (S.plusOn) possibile", False, "plusActive() falso con S.plusOn")
    await ctx.close()
    # ragazzi e bambini: Plus si apre con "chiedi a un adulto"
    for age in ("teen", "child"):
        ctx, pg = await page(b, T.base_state("it", uname="Luca"), age=age, w=360, h=800, lang="it-IT", wait=1800, native=True)
        await T.close_layer(pg)
        await pg.click("#app h1.greet .gwi"); await pg.wait_for_timeout(400)
        await pg.click('.nibox .nit[data-nic="razzo"]'); await pg.wait_for_timeout(400)
        r = json.loads(await T.ev(pg, "JSON.stringify({ plus: !!document.querySelector('.plusbox'), adult: !!document.querySelector('.plusbox .ageadult'), s: S.v111ic || null, home: document.querySelector('#app h1.greet .gwi').dataset.v111 })"))
        # "chiedi a un adulto" dipende dall'eta' del consenso del Paese (98zf ageBand): a 14 anni in Italia non c'e', sotto i 13 si'
        T.check(f"{age}: icona Plus -> Tanetto Plus{' con chiedi a un adulto' if age == 'child' else ''}, l'icona resta il germoglio", r["plus"] and (r["adult"] or age == "teen") and r["s"] is None and r["home"] == "germoglio", r)
        T.check(f"  nessun errore ({age})", not pg.errs, pg.errs[:2])
        await ctx.close()
    # valori strani nel salvataggio (anche un'icona Plus senza Plus)
    ctx, pg = await page(b, T.base_state("en"), age="adult", w=360, h=800, wait=1800)
    await T.close_layer(pg)
    for v in ("razzo", "xxx", 7, None, {"a": 1}, ["luna"]):
        home = await T.ev(pg, f"S.v111ic = {json.dumps(v)}; layer.innerHTML = ''; render(); (document.querySelector('#app h1.greet .gwi') || {{dataset: {{}}}}).dataset.v111")
        T.check(f"salvataggio con v111ic={json.dumps(v)}: germoglio", home == "germoglio", home)
    T.check("  nessun errore (valori strani)", not pg.errs, pg.errs[:2])
    await ctx.close()

async def main(b):
    _nc = b.new_context
    async def nc(**o):   # macchina carica: pagina grande, attese piu' lunghe
        ctx = await _nc(**o); ctx.set_default_navigation_timeout(120000); ctx.set_default_timeout(60000); return ctx
    b.new_context = nc
    if "plus" in (sys.argv[1:] or ["plus"]): await plus_and_age(b)
    parts = sys.argv[1:] or ["plus", "greeting", "picker"]
    if "greeting" in parts: await greeting(b)
    if "picker" in parts: await picker(b)

T.run(main)
