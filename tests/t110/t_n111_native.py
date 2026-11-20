"""1.0.11 parte nativa (src/98zx_n111_native.js, 3zzm_n111_texts.js): widget (fotografia del giorno in 14 lingue), scheda
"Metti {n} sulla tua Home" (tempi, Profilo, pulsante di Android, misure 360/412/tablet, tema scuro), recensione (momenti,
3 giorni d'uso, 60 giorni, solo adulti), Invita un amico (referrer, regalo, 3 giorni, premi, tetto, eta').
Telefono finto: plugin TanettoWidget, TanettoGrowth, TanettoShare, Review e Firebase (window.TanFB) finti. Nessun dato personale.
Scrive anche app-android/android/app/src/test/resources/n111_snaps.json (fotografie vere per le prove Robolectric del widget)."""
import json, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import lib110 as T
OUT = os.environ.get("N111_SHOTS", "/mnt/user-data/outputs/v111_preview/native"); os.makedirs(OUT, exist_ok=True)
SNAPS = os.path.join(T.REPO, "app-android/android/app/src/test/resources/n111_snaps.json")

def mocks(count=0, canPin=True, ref=None, click=1763280000, install=1763280100, dev="a" * 64, q=0, fail=None):
    return """
window.__n = { upd: [], pin: [], share: [], rev: 0, fb: [], dev: 0 };
Object.assign(window.Capacitor.Plugins, {
  TanettoWidget: { info: async () => ({ count: %d, small: %d, wide: 0, canPin: %s }), update: async (o) => { __n.upd.push(JSON.parse(JSON.stringify(o))); return { count: %d }; }, pin: async (o) => { __n.pin.push(o); return { asked: true }; } },
  TanettoGrowth: { referrer: async () => ({ done: true, ref: %s, click: %d, install: %d }), device: async () => { __n.dev++; return { dev: %s }; } },
  TanettoShare: { share: async (o) => { __n.share.push(o); }, saveImage: async () => {}, saveFile: async () => {} },
  Review: { requestReview: async () => { __n.rev++; } } });
window.TanFB = { init: async () => null, current: () => null, setLang() {},
  invCreate: async (c, d) => { __n.fb.push(['create', c, d]); %s window.__codes.push(c); return true; },
  invGet: async (c) => { __n.fb.push(['get', c]); %s return window.__codes.includes(c) ? { q: window.__q } : null; },
  invClaim: async (c, id, kh, d) => { __n.fb.push(['claim', c, id, kh, d]); %s return true; },
  invQualify: async (c, id, k) => { __n.fb.push(['qualify', c, id, k]); %s return true; } };
window.__q = %d; window.__codes = ["QRST6789"];
""" % (count, count, "true" if canPin else "false", count, json.dumps(ref or ""), click, install, json.dumps(dev),
       fail.get("create", "") if fail else "", fail.get("get", "") if fail else "", fail.get("claim", "") if fail else "", fail.get("qualify", "") if fail else "", q)

async def page(b, *a, **k):
    """T.page con un secondo tentativo: con il computer molto carico il primo caricamento puo' scadere."""
    import asyncio
    for i in range(4):
        n0 = len(b.contexts)
        try: return await T.page(b, *a, **k)
        except Exception as e:
            for c in b.contexts[n0:]:
                try: await c.close()
                except Exception: pass
            if i == 3: raise
            print("  (nuovo tentativo di caricamento:", str(e)[:40].replace("\n", " "), ")", flush=True)
            await asyncio.sleep(8)

PART = os.environ.get("N111_PART", "")   # vuoto = tutto; altrimenti lettere: A B S C D P (S = misure e lingue)
SLANGS = [x for x in os.environ.get("N111_LANGS", " ".join(T.LANGS)).split() if x]
def want(k): return not PART or k in PART

LOG3 = [{"d": d, "g": "water"} for d in ("2026-11-13", "2026-11-14", "2026-11-15")]

async def main(b):
    if want("A"):
        # ---------------- A) fotografia del widget in 14 lingue ----------------
        all_snaps = {}
        for lang in T.LANGS:
            ctx, pg = await page(b, T.base_state(lang, pet="germo" if lang != "ko" else "lumi"), native=True, age="adult", tz="Europe/Rome", extra_js=mocks(), wait=2500)
            await T.close_layer(pg)
            r = json.loads(await T.ev(pg, """JSON.stringify((() => { const out = {};
              const sn = () => window.__n111.snap(new Date(2026, 10, 16, 15, 0));
              S.done = []; out.todo = sn();
              S.done = todayGoals().slice(0, 2); out.part = sn();
              S.done = todayGoals().slice(); out.done = sn();
              const g = S.goals; S.goals = S.goals.map((x) => ({ ...x, days: [] })); S.done = []; out.free = sn(); S.goals = g;
              S.away = { dest: 'x', until: new Date(2026, 10, 16, 18, 0).getTime() }; out.away = sn(); S.away = null;
              return out; })())"""))
            all_snaps[lang] = r
            t = r["todo"]; p = r["part"]; d = r["done"]; f = r["free"]; a = r["away"]
            nm = t["name"]
            ok = (t["st"] == "todo" and t["badge"] == "0/5" and p["st"] == "part" and p["badge"] == "2/5" and d["st"] == "done" and d["badge"] == "5/5"
                  and f["st"] == "free" and f["badge"] == "" and a["st"] == "away" and a["badge"] == "" and a.get("until") and a.get("back"))
            T.check(f"A {lang}: stati da fare / in corso / tutto fatto / libero / in gita", ok, {k: (v["st"], v["badge"]) for k, v in r.items()})
            T.check(f"A {lang}: giorno di domani pronto (17/11, 0/5, frase nuova)", t["tom"]["day"] == "2026-11-17" and t["tom"]["badge"] == "0/5" and t["tom"]["st"] == "todo" and t["tom"]["line"], t["tom"])
            texts = [x for s in r.values() for x in (s["line"], s["a11y"], s["label"], s["tom"]["line"], s.get("back", ""))]
            T.check(f"A {lang}: niente segnaposto, niente 'undefined', particelle coreane risolte", all("undefined" not in x and "{" not in x and "(가)" not in x and "(과)" not in x and "(는)" not in x for x in texts), [x for x in texts if "undefined" in x or "(" in x][:3])
            T.check(f"A {lang}: frasi corte per il widget (riga <= 48, etichetta <= 28)", max(len(s["line"]) for s in r.values()) <= 48 and len(t["label"]) <= 28, [(s["line"], len(s["line"])) for s in r.values() if len(s["line"]) > 48] + [t["label"]])
            T.check(f"A {lang}: nessun dato personale (niente testi degli obiettivi, niente diario)", all(g not in json.dumps(r) for g in ("water", "walk", "read", "tidy")))
            if lang == "it":
                await T.ev(pg, "S.done = []; render(); widgetSync(); 1"); await pg.wait_for_timeout(900)
                n1 = await T.ev(pg, "__n.upd.length"); await T.ev(pg, "render(); widgetSync(); 1"); await pg.wait_for_timeout(900)
                n2 = await T.ev(pg, "__n.upd.length")
                T.check("A il widget riceve la fotografia; se non cambia niente non si rimanda", n1 >= 1 and n2 == n1, (n1, n2))
                await T.ev(pg, "S.done = todayGoals().slice(0, 1); widgetSync(); document.dispatchEvent(new Event('visibilitychange')); 1")
                await T.ev(pg, "Object.defineProperty(document, 'visibilityState', { configurable: true, get: () => 'hidden' }); document.dispatchEvent(new Event('visibilitychange')); 1"); await pg.wait_for_timeout(60)
                last = json.loads(await T.ev(pg, "JSON.stringify(__n.upd[__n.upd.length - 1])"))
                T.check("A uscendo dall'app la fotografia parte subito (senza aspettare)", last.get("snap", {}).get("badge") == "1/5", last)
                T.check("  nessun errore", not pg.errs, pg.errs[:2])
            await ctx.close()
        os.makedirs(os.path.dirname(SNAPS), exist_ok=True)
        json.dump(all_snaps, open(SNAPS, "w", encoding="utf-8"), ensure_ascii=False, indent=1)

    if want("B"):
        # ---------------- B) scheda "Metti Germo sulla tua Home" ----------------
        st = T.base_state("it", log=LOG3)
        ctx, pg = await page(b, T.base_state("it", log=[{"d": "2026-11-16", "g": "water"}]), native=True, age="adult", extra_js=mocks(), lang="it-IT")
        await T.close_layer(pg); await T.ev(pg, "window.__n111.N.t0 = 0; 1")
        T.check("B mai prima di 3 giorni d'uso", not await T.ev(pg, "window.__n111.promoDue()"))
        await ctx.close()
        ctx, pg = await page(b, st, native=True, age="adult", extra_js=mocks(), lang="it-IT", wait=4000)
        T.check("B mai all'avvio (nessuna scheda del widget aperta)", "n1box" not in await T.ev(pg, "layer.innerHTML"))
        await T.close_layer(pg); await T.ev(pg, "window.__n111.N.t0 = 0; 1")
        T.check("B dopo 3 giorni d'uso e' il momento", await T.ev(pg, "window.__n111.promoDue()"))
        await T.ev(pg, "completeGoal(todayGoals()[0]); 1"); await pg.wait_for_timeout(9000)
        for _ in range(6):
            h = await T.ev(pg, "layer.innerHTML")
            if "n1box" in h: break
            await T.close_layer(pg); await pg.wait_for_timeout(2500)
        T.check("B dopo un obiettivo fatto la scheda arriva (in coda alle altre finestre)", "n1box" in await T.ev(pg, "layer.innerHTML"))
        T.check("  una volta sola (segnata)", bool(await T.ev(pg, "window.__n111.st().wp")) and not await T.ev(pg, "window.__n111.promoDue()"))
        await pg.click("#n1Pin"); await pg.wait_for_timeout(500)
        T.check("B 'Aggiungi alla Home' chiede ad Android (requestPinAppWidget) la misura scelta", json.loads(await T.ev(pg, "JSON.stringify(__n.pin)")) == [{"size": "small"}])
        await T.ev(pg, "tab = 'more'; moreSub = 'main'; render(); 1"); await pg.wait_for_timeout(800)
        T.check("B nel Profilo c'e' sempre 'Metti Germo sulla tua Home'", await T.ev(pg, "!!document.querySelector('#n111W:not([hidden])')"))
        T.check("B la vecchia scheda nella pagina Aiuto non c'e' piu'", not await T.ev(pg, "!!document.querySelector('.wdgcard')"))
        await pg.click("#n111W"); await pg.wait_for_timeout(600)
        T.check("B dal Profilo si riapre la scheda", "n1box" in await T.ev(pg, "layer.innerHTML"))
        await pg.click('[data-n1size="wide"]'); await pg.wait_for_timeout(200)
        T.check("B si puo' scegliere il widget largo (anteprima larga)", await T.ev(pg, "!!layer.querySelector('.n1prev .n1w.wide')"))
        T.check("  nessun errore", not pg.errs, pg.errs[:2])
        await ctx.close()
        # senza pulsante di Android (Android 7 o launcher che non lo permette): animazione + 3 passi, niente pulsante
        ctx, pg = await page(b, st, native=True, age="adult", extra_js=mocks(canPin=False), lang="it-IT")
        await T.close_layer(pg); await T.ev(pg, "openWidgetPromo('prova'); 1"); await pg.wait_for_timeout(500)
        T.check("B senza requestPinAppWidget: animazione e 3 passi, nessun pulsante finto", await T.ev(pg, "!!layer.querySelector('.n1demo .n1ph') && layer.querySelectorAll('.n1steps li').length === 3 && !layer.querySelector('#n1Pin')"))
        await ctx.close()

    if want("S"):
        # misure, tema scuro, 14 lingue: niente esce dallo schermo, niente testo tagliato a meta'
        sizes = [(360, 760, "360"), (412, 915, "412"), (800, 1280, "tablet")]
        for lang in SLANGS:
            for (w, h, nmz) in sizes:
                for scheme in (("light", "dark") if lang in ("it", "en", "de", "ja") else ("light",)):
                    if nmz != "412" and lang not in ("it", "de", "ru", "ja"): continue
                    ctx, pg = await page(b, T.base_state(lang, log=LOG3), native=True, age="adult", extra_js=mocks(canPin=True), w=w, h=h, scheme=scheme, wait=2500)
                    await T.close_layer(pg)
                    res = {}
                    for kind, code in (("widget", "openWidgetPromo('prova')"), ("widget-nopin", "widgetInfo.canPin = false; openWidgetPromo('prova')"), ("invito", "window.__n111.openInvite()"), ("regalo", "window.__n111.gift()"), ("premio", "window.__n111.reward(2)")):
                        await T.ev(pg, f"widgetInfo = widgetInfo || {{ count: 0, canPin: true }}; widgetInfo.canPin = true; {code}; 1"); await pg.wait_for_timeout(700)
                        over = json.loads(await T.ev(pg, """JSON.stringify((() => { const box = layer.querySelector('.box'); if (!box) return ['no box']; const bad = [];
                          const r = box.getBoundingClientRect(); if (r.left < -0.5 || r.right > innerWidth + 0.5) bad.push('box ' + Math.round(r.left) + '-' + Math.round(r.right));
                          box.querySelectorAll('h2, p, b, small, button, li, span, summary').forEach((e) => { const q = e.getBoundingClientRect(); if (q.width && (q.right > r.right + 1 || q.left < r.left - 1)) bad.push(e.tagName + ':' + e.textContent.slice(0, 20));
                            if (e.scrollWidth > e.clientWidth + 2 && getComputedStyle(e).overflow !== 'visible' && !e.closest('.n1w')) bad.push('taglio ' + e.textContent.slice(0, 20)); });
                          box.querySelectorAll('button').forEach((x) => { const q = x.getBoundingClientRect(); if (q.width && q.height < 47.5) bad.push('tocco ' + x.textContent.slice(0, 12) + ' ' + Math.round(q.height)); });
                          return bad; })())"""))
                        res[kind] = over
                        if (lang in ("it", "en", "ja", "de") and nmz == "412") or (lang == "it") or (lang in ("de", "ru") and nmz == "360"):
                            await pg.screenshot(path=f"{OUT}/{kind}_{lang}_{nmz}_{scheme}.png", scale="css" if nmz == "tablet" else "device")
                        await T.close_layer(pg)
                    await T.ev(pg, "tab = 'more'; moreSub = 'main'; render(); 1"); await pg.wait_for_timeout(700)
                    card = json.loads(await T.ev(pg, "JSON.stringify((() => { const c = document.getElementById('n111W'); if (!c) return ['manca']; const r = c.getBoundingClientRect(); const bad = []; if (r.right > innerWidth + .5) bad.push('fuori'); c.querySelectorAll('.n1ctx b, .n1ctx small').forEach((e) => { const q = e.getBoundingClientRect(); if (q.right > r.right + 1) bad.push('testo fuori'); }); if (r.height < 48) bad.push('basso'); const a = c.querySelector('.n1cart').getBoundingClientRect(), tx = c.querySelector('.n1ctx').getBoundingClientRect(), w = c.querySelector('.n1w').getBoundingClientRect(); if (tx.left < a.right - 1) bad.push('testo sopra il disegno'); if (w.left < r.left - 1 || w.right > a.right + 1 || w.top < r.top - 1 || w.bottom > r.bottom + 1) bad.push('widget fuori dal suo posto'); if (getComputedStyle(c.querySelector('.n1ctx b')).textAlign === 'center') bad.push('titolo centrato'); return bad; })())"))
                    res["profilo"] = card
                    if lang in ("it", "en", "ru", "ja") and nmz in ("412", "360"):
                        await T.ev(pg, "document.getElementById('n111W').scrollIntoView({ block: 'center' }); 1"); await pg.wait_for_timeout(300)
                        await pg.screenshot(path=f"{OUT}/profilo_{lang}_{nmz}_{scheme}.png")
                    T.check(f"B {lang} {nmz} {scheme}: schede dentro lo schermo, testo intero, tocchi >= 48", all(not v for v in res.values()), {k: v for k, v in res.items() if v})
                    T.check(f"  {lang} {nmz} {scheme}: nessun errore", not pg.errs, pg.errs[:2])
                    await ctx.close()

    if want("C"):
        # ---------------- C) recensione ----------------
        ctx, pg = await page(b, T.base_state("en", log=LOG3), native=True, age="adult", extra_js=mocks())
        await T.close_layer(pg)
        T.check("C adulto, 3 giorni d'uso, mai chiesta: si puo'", await T.ev(pg, "rev20Allowed()"))
        T.check("C con 2 giorni d'uso no", not await T.ev(pg, "rev20Allowed({ ...S, log: S.log.slice(1), days: {} })"))
        T.check("C chiesta 45 giorni fa: no (minimo 60)", not await T.ev(pg, "rev20Allowed({ ...S, v20rev: { last: Date.now() - 45 * 864e5 } })"))
        T.check("C chiesta 61 giorni fa: si'", await T.ev(pg, "rev20Allowed({ ...S, v20rev: { last: Date.now() - 61 * 864e5 } })"))
        await T.ev(pg, "rev20Want('viaggio'); 1")
        for _ in range(12):   # chiusa ogni altra finestra (consigli del primo giorno, regali), arriva la richiesta
            if await T.ev(pg, "__n.rev"): break
            await T.close_layer(pg); await pg.wait_for_timeout(1600)
        T.check("C momento felice (ritorno dal viaggio): finestra ufficiale di Google, una volta", await T.ev(pg, "__n.rev") == 1)
        await T.ev(pg, "rev20Want('serie-30'); 1")
        for _ in range(4): await T.close_layer(pg); await pg.wait_for_timeout(1600)
        T.check("C subito dopo: niente seconda richiesta", await T.ev(pg, "__n.rev") == 1)
        src = open(os.path.join(T.REPO, "src/98zx_n111_native.js"), encoding="utf-8").read()
        T.check("C nessun pulsante apre la recensione; nessuna domanda prima", "requestReview" not in src)
        await ctx.close()
        for age in ("teen", "child", "skip"):
            ctx, pg = await page(b, T.base_state("en", log=LOG3), native=True, age=age, extra_js=mocks())
            T.check(f"C {age}: mai la richiesta di recensione", not await T.ev(pg, "rev20Allowed()"))
            await ctx.close()

    if want("D"):
        # ---------------- D) invita un amico ----------------
        ctx, pg = await page(b, T.base_state("en"), native=True, age="adult", extra_js=mocks())
        T.check("D link di Google Play con il codice nel referrer codificato (come chiede Google)", await T.ev(pg, "window.__n111.link('ABCD2345')") == "https://play.google.com/store/apps/details?id=com.tanettoapp.tanetto&referrer=utm_source%3Dinvito%26utm_medium%3Damico%26tan%3DABCD2345")
        T.check("D referrer letto: decodificato, codificato, senza codice, codice rovinato", await T.ev(pg, "[__n111.parse('utm_source=invito&utm_medium=amico&tan=ABCD2345'), __n111.parse('utm_source%3Dinvito%26tan%3DABCD2345'), __n111.parse('utm_source=google-play&utm_medium=organic'), __n111.parse('tan=ABCD0345'), __n111.parse('tan=abcd2345')].join(',')") == "ABCD2345,ABCD2345,,,ABCD2345")
        await ctx.close()
        REF = "utm_source=invito&utm_medium=amico&tan=QRST6789"
        # amico adulto: regalo dopo il si' del server
        ctx, pg = await page(b, T.base_state("en", seeds=300), native=True, age="adult", extra_js=mocks(ref=REF), wait=8000)
        fb = json.loads(await T.ev(pg, "JSON.stringify(__n.fb)"))
        cl = [x for x in fb if x[0] == "claim"]
        T.check("D amico adulto: registrato sul server con codice, impronta e chiave cifrata", len(cl) == 1 and cl[0][1] == "QRST6789" and len(cl[0][2]) == 20 and len(cl[0][3]) == 64 and cl[0][4] == "a" * 64, fb)
        T.check("D amico: +50 Tanì, contati come 'pagati' (non accorciano gli Introvabili)", await T.ev(pg, "S.seeds") == 350 and await T.ev(pg, "econ().paid >= 50"))
        T.check("D amico: finestra del regalo", "n1gift" in await T.ev(pg, "layer.innerHTML") or "n111gift" in await T.ev(pg, "JSON.stringify(NQ20.q.map(x => x.key))"))
        await T.ev(pg, "window.__n111.boot(); 1"); await pg.wait_for_timeout(1500)
        T.check("D il regalo arriva una volta sola", await T.ev(pg, "S.seeds") == 350 and len([x for x in json.loads(await T.ev(pg, "JSON.stringify(__n.fb)")) if x[0] == "claim"]) == 1)
        inv = json.loads(await T.ev(pg, "JSON.stringify(window.__n111.st().inv.from)"))
        await T.ev(pg, "window.__setDay(2026, 11, 17, 10); window.__n111.qualify(); 1"); await pg.wait_for_timeout(400)
        T.check("D 2 giorni: non ancora", not [x for x in json.loads(await T.ev(pg, "JSON.stringify(__n.fb)")) if x[0] == "qualify"])
        await T.ev(pg, "window.__setDay(2026, 11, 18, 10); window.__n111.qualify(); 1"); await pg.wait_for_timeout(600)
        q = [x for x in json.loads(await T.ev(pg, "JSON.stringify(__n.fb)")) if x[0] == "qualify"]
        T.check("D 3 giorni diversi: segnato sul server con la chiave giusta", len(q) == 1 and q[0][2] == inv["cid"] and q[0][3] == inv["k"], q)
        T.check("  poi niente piu'", await T.ev(pg, "window.__n111.st().inv.from.st") == "ok")
        await ctx.close()
        # server dice no (stesso telefono, telefono gia' usato): niente regalo, niente nuovi tentativi
        ctx, pg = await page(b, T.base_state("en", seeds=300), native=True, age="adult", extra_js=mocks(ref=REF, fail={"claim": "const e = new Error('x'); e.code = 'permission-denied'; throw e;"}), wait=8000)
        T.check("D server rifiuta (stesso telefono o telefono gia' usato): niente regalo", await T.ev(pg, "S.seeds") == 300 and await T.ev(pg, "window.__n111.st().inv.from.st") == "bad")
        await ctx.close()
        # regole di Firestore non ancora pubblicate (il server dice "permesso negato" anche alla lettura): si aspetta, regalo tenuto
        ctx, pg = await page(b, T.base_state("en", seeds=300), native=True, age="adult", extra_js=mocks(ref=REF, fail={"get": "const e = new Error('x'); e.code = 'permission-denied'; throw e;"}), wait=8000)
        T.check("D server non ancora pronto: l'invito resta in attesa (niente regalo perso)", await T.ev(pg, "window.__n111.st().inv.from.st") == "new" and await T.ev(pg, "S.seeds") == 300 and not [x for x in json.loads(await T.ev(pg, "JSON.stringify(__n.fb)")) if x[0] == "claim"])
        await ctx.close()
        ctx, pg = await page(b, T.base_state("en", seeds=300), native=True, age="adult", extra_js=mocks(ref="utm_source=invito&tan=ZZZZ2222"), wait=8000)
        T.check("D codice che non esiste: invito non valido, niente regalo", await T.ev(pg, "window.__n111.st().inv.from.st") == "bad" and await T.ev(pg, "S.seeds") == 300)
        await ctx.close()
        # clic dopo l'installazione (referrer sospetto) / senza rete
        ctx, pg = await page(b, T.base_state("en", seeds=300), native=True, age="adult", extra_js=mocks(ref=REF, click=1763290000, install=1763280000), wait=8000)
        T.check("D tempi sbagliati (clic dopo l'installazione): invito ignorato", await T.ev(pg, "!(window.__n111.st().inv || {}).from") and await T.ev(pg, "S.seeds") == 300)
        await ctx.close()
        ctx, pg = await page(b, T.base_state("en", seeds=300), native=True, age="adult", extra_js=mocks(ref=REF, fail={"claim": "const e = new Error('x'); e.code = 'unavailable'; throw e;"}), wait=8000)
        T.check("D senza rete: si riprova al prossimo avvio (nessun regalo, invito tenuto)", await T.ev(pg, "window.__n111.st().inv.from.st") == "new" and await T.ev(pg, "S.seeds") == 300)
        await ctx.close()
        for age in ("teen", "child", "skip"):
            ctx, pg = await page(b, T.base_state("en", seeds=300), native=True, age=age, extra_js=mocks(ref=REF), wait=8000)
            T.check(f"D amico {age}: niente server, niente impronta del telefono, niente regalo", not [x for x in json.loads(await T.ev(pg, "JSON.stringify(__n.fb)")) if x[0] == "claim"] and await T.ev(pg, "__n.dev") == 0 and await T.ev(pg, "S.seeds") == 300)
            await T.close_layer(pg); await T.ev(pg, "inviteFlow(); 1"); await pg.wait_for_timeout(600)
            T.check(f"  {age}: 'Invita un amico' resta la condivisione di prima, senza premi", "n1inv" not in await T.ev(pg, "layer.innerHTML"))
            await ctx.close()
        # server dell'invito non ancora pronto (regole non pubblicate): "Invita un amico" resta la condivisione semplice
        ctx, pg = await page(b, T.base_state("it", seeds=300), native=True, age="adult", extra_js=mocks(fail={"get": "const e = new Error('x'); e.code = 'permission-denied'; throw e;"}), lang="it-IT")
        await T.close_layer(pg); await T.ev(pg, "inviteFlow(); 1"); await pg.wait_for_timeout(1500)
        T.check("D server non pronto: niente scheda con premi (interruttore automatico spento), nessun codice creato", "n1inv" not in await T.ev(pg, "layer.innerHTML") and not [x for x in json.loads(await T.ev(pg, "JSON.stringify(__n.fb)")) if x[0] == "create"] and await T.ev(pg, "window.__n111.srvOn()") is False)
        await ctx.close()
        # chi invita (adulto)
        ctx, pg = await page(b, T.base_state("it", seeds=300), native=True, age="adult", extra_js=mocks(q=0), lang="it-IT")
        await T.close_layer(pg); await T.ev(pg, "inviteFlow(); 1"); await pg.wait_for_timeout(600)
        h = await T.ev(pg, "layer.innerText")
        T.check("D adulto: scheda con i due regali (50 all'amico, 100 a te), al massimo 3, solo 18+", "n1inv" in await T.ev(pg, "layer.innerHTML") and "50" in h and "100" in h and "3" in h and "18" in h, h[:200])
        await pg.click("#n1Send"); await pg.wait_for_timeout(1200)
        fb = json.loads(await T.ev(pg, "JSON.stringify(__n.fb)")); sh = json.loads(await T.ev(pg, "JSON.stringify(__n.share)"))
        code = [x for x in fb if x[0] == "create"]
        T.check("D 'Invia l'invito': codice creato sul server (8 caratteri senza 0/O/1/I)", len(code) == 1 and len(code[0][1]) == 8 and not set(code[0][1]) & set("01OI"), fb)
        T.check("D si apre la condivisione di Android con testo e link (WhatsApp, SMS...)", len(sh) == 1 and "tan%3D" + code[0][1] in sh[0]["text"] and "50 Tanì" in sh[0]["text"], sh)
        await T.close_layer(pg); await T.ev(pg, "inviteFlow(); 1"); await pg.wait_for_timeout(400); await pg.click("#n1Send"); await pg.wait_for_timeout(800)
        T.check("D secondo invio: stesso codice, nessun codice nuovo", len([x for x in json.loads(await T.ev(pg, "JSON.stringify(__n.fb)")) if x[0] == "create"]) == 1)
        await T.close_layer(pg)
        await T.ev(pg, "window.__q = 2; window.__n111.rewards(true); 1"); await pg.wait_for_timeout(800)
        T.check("D 2 amici al 3° giorno: +200 Tanì (pagati) e finestra del premio", await T.ev(pg, "S.seeds") == 500 and await T.ev(pg, "window.__n111.st().inv.own.got") == 2)
        await T.close_layer(pg); await T.ev(pg, "window.__q = 7; window.__n111.rewards(true); 1"); await pg.wait_for_timeout(800)
        T.check("D tetto: al massimo 3 premi (+100, non +500)", await T.ev(pg, "S.seeds") == 600 and await T.ev(pg, "window.__n111.st().inv.own.got") == 3)
        await T.ev(pg, "window.__q = 9; window.__n111.rewards(true); 1"); await pg.wait_for_timeout(500)
        T.check("  poi il server non si interroga piu'", await T.ev(pg, "S.seeds") == 600)
        T.check("  nessun errore", not pg.errs, pg.errs[:2])
        await ctx.close()
    if want("P"):
        # ---------------- informativa ----------------
        pp = open(os.path.join(T.REPO, "privacy.html"), encoding="utf-8").read()
        T.check("informativa pubblica: paragrafo 'Invite a friend' (Firebase, impronta cifrata, 12 mesi)", "Invite a friend (only for people aged 18 or over)" in pp and "12 months" in pp)
        gr = open(os.path.join(T.REPO, "app-android/android/app/build.gradle")).read()
        T.check("versione 1.0.11 (versionCode 114 su questo ramo)", "versionCode 114" in gr and 'versionName "1.0.11"' in gr)

T.run(main)
