"""1.0.11 (web): cartolina "La settimana con Germo" (9:16 e 1:1), cartolina del viaggio nello stesso formato, regole per eta',
link con UTM e #tanettoapp, scheda della domenica sera / lunedi' in Oggi, caratteri polacchi e turchi, statistiche di percorso.
Nessun dato personale: nomi di prova inventati."""
import base64, os, sys, struct
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import lib110 as T
SH = os.environ.get("T111_SHOTS", "/dev/shm/t111shots"); os.makedirs(SH, exist_ok=True)
LOC = {"it": "it-IT", "en": "en-GB", "de": "de-DE", "es": "es-ES", "fr": "fr-FR", "pt": "pt-BR", "ja": "ja-JP", "ko": "ko-KR", "zh": "zh-CN", "zht": "zh-TW", "ru": "ru-RU", "pl": "pl-PL", "nl": "nl-NL", "tr": "tr-TR"}
SHARE = "window.Capacitor.Plugins.TanettoShare = { share: async (o) => { window.__sh = o; return {}; }, saveImage: async () => ({}) };"
# registra ogni testo disegnato con la sua larghezza: si controlla che stia dentro l'immagine
FT = """window.__ft = []; const _ft = CanvasRenderingContext2D.prototype.fillText; CanvasRenderingContext2D.prototype.fillText = function (t, x, y, ...a) {
  try { const w = this.measureText(String(t)).width; const m = this.getTransform(); const al = this.textAlign; let x0 = al === 'center' ? x - w / 2 : al === 'right' || al === 'end' ? x - w : x;
    window.__ft.push({ t: String(t), x0: m.a * x0 + m.c * y + m.e, x1: m.a * (x0 + w) + m.c * y + m.e, y: m.b * x0 + m.d * y + m.f, W: this.canvas.width, H: this.canvas.height }); } catch (e) {}
  return _ft.call(this, t, x, y, ...a); };"""
def png_size(b64):
    raw = base64.b64decode(b64[:200] + "=" * (-len(b64[:200]) % 4)); return struct.unpack(">II", raw[16:24])
READY = "(() => { const im = layer.querySelector('.gr20box img.gr20img'); const b = document.getElementById('gr20Send'); return !!(im && im.complete && (!b || !b.disabled)); })()"
async def ready(pg):
    await pg.wait_for_timeout(300); await pg.wait_for_function(READY, timeout=90000); await pg.wait_for_timeout(200)
def days_full(start=10, end=16, done=3, total=5, **extra):
    d = {f"2026-11-{x:02d}": {"done": done, "total": total} for x in range(start, end + 1)}; d.update(extra); return d

async def main(b):
    # ---------- 1) logica della settimana (lunedi' come primo giorno, Italia) ----------
    st = T.base_state("it"); st["days"] = {"2026-11-09": {"done": 5, "total": 5}, "2026-11-10": {"done": 2, "total": 5}, "2026-11-11": {"done": 0, "total": 5, "rest": True},
                                          "2026-11-13": {"done": 1, "total": 4}, "2026-11-16": {"done": 2, "total": 5}}
    ctx, pg = await T.page(b, st, lang="it-IT", date=(2026, 11, 16, 9, 7))
    r = await T.ev(pg, "[dkey(w111WeekStart()), w111Week().map((x) => x.st).join(','), w111Count(w111Week()), dkey(w111WeekStart(new Date(2026, 10, 18))), dkey(w111WeekStart(new Date(2026, 10, 22)))]")
    T.check("lunedi': si racconta la settimana appena finita (9-15 novembre), mercoledi' e domenica quella in corso", r[0] == "2026-11-09" and r[3] == "2026-11-16" and r[4] == "2026-11-16", r)
    T.check("simboli dei giorni: tutto fatto / qualcosa / riposo / niente", r[1] == "all,some,rest,none,some,none,none" and r[2] == 3, r)
    r = await T.ev(pg, "(() => { const w = w111Week(new Date(2026, 10, 18, 10)); return w.map((x) => x.st).join(','); })()")
    T.check("nella settimana in corso: oggi senza obiettivi e' 'none', i giorni che devono arrivare sono 'next'", r == "some,none,none,next,next,next,next", r)
    r = await T.ev(pg, "(() => { const t = W111_T.it; const mk = (n) => Array.from({ length: 7 }, (_, i) => ({ d: new Date(2026, 10, 9 + i), st: i < n ? 'all' : 'none' })); return [0, 1, 3, 6].map((n) => { const x = w111Title(mk(n)); return [n >= 6 ? t.full : n >= 3 ? t.good : n >= 1 ? t.some : t.calm].flat().includes(x); }); })()")
    T.check("titolo affettuoso scelto dalla fascia giusta (0, 1-2, 3-5, 6-7 giorni)", r == [True, True, True, True], r)
    # finestra della scheda in Oggi: domenica dalle 18 e tutto il lunedi'
    r = await T.ev(pg, "[[2026,10,22,17],[2026,10,22,18],[2026,10,23,9],[2026,10,23,23],[2026,10,24,9],[2026,10,20,20]].map(([y,m,d,h]) => { S.w111wk = null; S.days['2026-11-17'] = { done: 1, total: 5 }; S.days['2026-11-20'] = { done: 1, total: 5 }; return w111WeekDue(new Date(y, m, d, h)); })")
    T.check("scheda della settimana: domenica 17 no, domenica 18 si', lunedi' si', martedi' no, venerdi' no", r == [False, True, True, True, False, False], r)
    await ctx.close()

    # scheda in Oggi: compare il lunedi', si apre, poi non torna; la X la chiude per la settimana
    st = T.base_state("it"); st["days"] = days_full(); st["firstDay"] = "2026-10-01"
    ctx, pg = await T.page(b, st, lang="it-IT", date=(2026, 11, 16, 9, 7))
    await T.close_layer(pg); await T.ev(pg, "tab='today'; render(); 1"); await pg.wait_for_timeout(500)
    has = await T.ev(pg, "!!document.getElementById('w111Wk')")
    T.check("lunedi' in Oggi c'e' la scheda 'La settimana con Germo e' pronta'", has)
    asks = await T.ev(pg, "document.querySelectorAll('#app .stack .iossafe, #app .stack .remcard, #app .stack .namecard, #app .stack .nudgecard').length")
    T.check("in Casa resta al massimo UNA scheda in piu' (la cartolina prende il posto di 'Come ti chiami?')", asks == 1 and not await T.ev(pg, "!!document.getElementById('nameCard')"), asks)
    if has:
        await T.ev(pg, "document.getElementById('w111Wk').scrollIntoView({block:'center'}); 1"); await pg.wait_for_timeout(300)
        await pg.screenshot(path=f"{SH}/oggi_scheda_it.png")
        await pg.click("#w111WkGo"); await ready(pg)
        r = await T.ev(pg, "[!!layer.querySelector('.w111ov img.gr20img'), document.querySelectorAll('[data-w111fmt]').length, !document.getElementById('gr20Send').disabled]")
        T.check("'Guarda' apre l'anteprima con i due formati e 'Condividi' attivo", r == [True, 2, True], r)
        await pg.screenshot(path=f"{SH}/dialog_week_it.png")
        await T.close_layer(pg); await T.ev(pg, "render(); 1"); await pg.wait_for_timeout(300)
        T.check("dopo averla aperta la scheda non torna", not await T.ev(pg, "!!document.getElementById('w111Wk')"))
    await ctx.close()
    st = T.base_state("it"); st["days"] = days_full(); st["firstDay"] = "2026-10-01"
    ctx, pg = await T.page(b, st, lang="it-IT", date=(2026, 11, 16, 9, 7))
    await T.close_layer(pg); await T.ev(pg, "tab='today'; render(); 1"); await pg.wait_for_timeout(400)
    await T.ev(pg, "document.getElementById('w111WkX').click(); 1"); await pg.wait_for_timeout(400)
    T.check("la X chiude la scheda per questa settimana", not await T.ev(pg, "!!document.getElementById('w111Wk')") and await T.ev(pg, "S.w111wk.wk") == "2026-11-09")
    # Diario: "Crea la cartolina" apre la cartolina nuova
    await T.ev(pg, "tab='diary'; render(); 1"); await pg.wait_for_timeout(400)
    await T.ev(pg, "document.getElementById('makeWeek').click(); 1"); await ready(pg)
    T.check("Diario: 'Crea la cartolina' apre 'La settimana con Germo'", await T.ev(pg, "!!layer.querySelector('.w111ov img.gr20img')"))
    T.check("nessun errore", not pg.errs, pg.errs[:3])
    await ctx.close()

    # ---------- 2) immagini in 14 lingue, 9:16 e 1:1, testi dentro l'immagine ----------
    for lang in T.LANGS:
        st = T.base_state(lang); st["days"] = days_full(); st["petName"] = "Pallino"
        ctx, pg = await T.page(b, st, lang=LOC[lang], native=True, extra_js=FT + SHARE)
        await T.close_layer(pg)
        out = {}
        for fmt in ("story", "square"):
            await T.ev(pg, "window.__ft = []; 1")
            u = await T.ev(pg, f"w111WeekMake('{fmt}').then((r) => r.url)")
            ft = await T.ev(pg, "window.__ft")
            out[fmt] = (png_size(u.split(",", 1)[1]), ft)
            open(f"{SH}/week_{fmt}_{lang}.png", "wb").write(base64.b64decode(u.split(",", 1)[1]))
        ok_sz = out["story"][0] == (1080, 1920) and out["square"][0] == (1080, 1080)
        T.check(f"{lang}: PNG 1080x1920 e 1080x1080", ok_sz, [out["story"][0], out["square"][0]])
        for fmt in ("story", "square"):
            ft = out[fmt][1]; texts = [x["t"] for x in ft]
            outside = [x["t"] for x in ft if x["x0"] < 30 or x["x1"] > x["W"] - 30 or x["y"] > x["H"] - 20]
            T.check(f"{lang} {fmt}: nessun testo tagliato o fuori dall'immagine", not outside, outside)
            T.check(f"{lang} {fmt}: 'Tanetto' e '#tanettoapp' una volta, 7 giorni, nome scelto (adulto)", texts.count("Tanetto") == 1 and texts.count("#tanettoapp") == 1 and any("Pallino" in x for x in texts) and len(texts) >= 11, texts)
            T.check(f"{lang} {fmt}: nessun testo vuoto o 'undefined'", all(x.strip() and "undefined" not in x and "NaN" not in x for x in texts), texts)
        await ctx.close()

    # ---------- 3) eta': condivisione e nome ----------
    for age, share, name in (("child", False, "Germo"), ("none", False, "Germo"), ("skip", False, "Germo"), ({"y": 2011, "m": 3}, True, "Germo"), ("adult", True, "Pallino")):
        st = T.base_state("it"); st["days"] = days_full(); st["petName"] = "Pallino"
        ctx, pg = await T.page(b, st, age=age, lang="it-IT", native=True, extra_js=FT + SHARE)
        await T.close_layer(pg); await T.ev(pg, "window.__ft = []; w111WeekOpen(); 1"); await ready(pg)
        r = await T.ev(pg, "[!!document.getElementById('gr20Send'), !!document.getElementById('gr20Save'), document.querySelectorAll('[data-w111fmt]').length, (document.getElementById('gr20Msg') || {}).textContent || '']")
        ft = [x["t"] for x in await T.ev(pg, "window.__ft")]
        lab = age if isinstance(age, str) else "15 anni"
        T.check(f"eta' {lab}: Condividi/Salva {'presenti' if share else 'assenti'}", (r[0] and r[1] and r[2] == 2) if share else (not r[0] and not r[1] and r[2] == 0), r)
        T.check(f"eta' {lab}: nel disegno il nome {name}", any(name in x for x in ft) and (name == "Pallino" or not any("Pallino" in x for x in ft)), ft)
        if not share:
            T.check(f"eta' {lab}: frase gentile al posto dell'invito a condividere", "tutta per te" in r[3], r[3])
            await pg.screenshot(path=f"{SH}/dialog_week_kid_{lab}.png")
            # cartolina del viaggio: niente "Condividi" al ritorno, e i pulsanti di album e livello nascosti
            await T.close_layer(pg); await T.ev(pg, "story = { card: 'f:forest:0', dest: 'f:forest' }; 1")
            h = await T.ev(pg, "storyCard()")
            T.check(f"eta' {lab}: al ritorno dal viaggio niente 'Condividi'", "gr20Story" not in h)
            T.check(f"eta' {lab}: classe che nasconde i 'Condividi' di album e livello", await T.ev(pg, "story = null; render(); document.documentElement.classList.contains('w111noshare')"))
        await ctx.close()

    # ---------- 4) testo condiviso: link con UTM e #tanettoapp (app e sito) ----------
    st = T.base_state("it"); st["days"] = days_full(); st["petName"] = "Pallino"
    ctx, pg = await T.page(b, st, lang="it-IT", native=True, extra_js=SHARE)
    await T.close_layer(pg); await T.ev(pg, "w111WeekOpen(); 1"); await ready(pg)
    await pg.click("#gr20Send"); await pg.wait_for_timeout(1200)
    sh = await T.ev(pg, "window.__sh ? { name: window.__sh.name, text: window.__sh.text, mime: window.__sh.mime } : null")
    T.check("app: condivisione con Google Play + utm_source=share, utm_medium=postcard, utm_campaign=week e #tanettoapp",
            sh and sh["name"] == "tanetto-settimana.png" and "play.google.com" in sh["text"] and "utm_source%3Dshare%26utm_medium%3Dpostcard%26utm_campaign%3Dweek" in sh["text"] and sh["text"].endswith("#tanettoapp") and "Pallino" in sh["text"], sh)
    await pg.click("[data-w111fmt=square]"); await ready(pg)
    r = await T.ev(pg, "(async () => { const im = layer.querySelector('.gr20img'); await im.decode().catch(() => {}); return [im.naturalWidth, im.naturalHeight, gr20Cur.name, layer.querySelector('#gr20Prev').classList.contains('sq')]; })()")
    T.check("formato quadrato: 1080x1080, file -1x1, anteprima quadrata", r == [1080, 1080, "tanetto-settimana-1x1.png", True], r)
    await pg.screenshot(path=f"{SH}/dialog_week_square_it.png")
    # viaggio: stesso formato, campagna trip
    await T.close_layer(pg); await T.ev(pg, "window.__sh = null; gr20Open('card', 'f:forest:0'); 1"); await ready(pg)
    r = await T.ev(pg, "[document.querySelectorAll('[data-w111fmt]').length, gr20Cur && gr20Cur.text]")
    T.check("cartolina del viaggio: due formati e testo con utm_campaign=trip e #tanettoapp", r[0] == 2 and "utm_campaign%3Dtrip" in r[1] and r[1].endswith("#tanettoapp"), r)
    await pg.click("[data-w111fmt=square]"); await ready(pg)
    r = await T.ev(pg, "(async () => { const im = layer.querySelector('.gr20img'); await im.decode().catch(() => {}); return [im.naturalWidth, im.naturalHeight, gr20Cur.name]; })()")
    T.check("cartolina del viaggio quadrata: 1080x1080 (tanetto-cartolina-1x1.png)", r == [1080, 1080, "tanetto-cartolina-1x1.png"], r)
    u = await T.ev(pg, "gr20Cur.url"); open(f"{SH}/trip_square_it.png", "wb").write(base64.b64decode(u.split(",", 1)[1]))
    await pg.click("[data-w111fmt=story]"); await ready(pg)
    u = await T.ev(pg, "gr20Cur.url"); open(f"{SH}/trip_story_it.png", "wb").write(base64.b64decode(u.split(",", 1)[1]))
    T.check("nessun errore (app)", not pg.errs, pg.errs[:3])
    await ctx.close()
    ctx, pg = await T.page(b, st, lang="it-IT", native=False)
    await T.close_layer(pg)
    r = await T.ev(pg, "w111ShareText('x', 'week')")
    T.check("sito: link ?src=postcard (resta la scheda verso Google Play) con le stesse UTM", r == "x https://tanetto.app/?src=postcard&utm_source=share&utm_medium=postcard&utm_campaign=week #tanettoapp", r)
    await ctx.close()

    # ---------- 5) evento sulla cartolina ----------
    for (y, m, d), want in (((2026, 11, 16), "Stagione delle Lanterne"), ((2026, 12, 10), "Natale"), ((2027, 1, 10), "Nuovo inizio"), ((2027, 2, 10), "Stagione delle Stelle"), ((2027, 4, 13), "Aquiloni")):
        st = T.base_state("it", day=f"{y}-{m:02d}-{d:02d}"); st["days"] = {f"{y}-{m:02d}-{d:02d}": {"done": 2, "total": 5}}
        ctx, pg = await T.page(b, st, lang="it-IT", date=(y, m, d, 10, 0), extra_js=FT)
        await T.close_layer(pg); await T.ev(pg, "window.__ft = []; 1")
        await T.ev(pg, "w111WeekMake('story').then(() => 1)")
        ft = [x["t"] for x in await T.ev(pg, "window.__ft")]
        T.check(f"{d:02d}/{m:02d}/{y}: sotto la foto '{want}'", any(want in x for x in ft), ft)
        if (m, d) == (12, 10):
            u = await T.ev(pg, "w111WeekMake('story').then((r) => r.url)"); open(f"{SH}/week_story_xmas_it.png", "wb").write(base64.b64decode(u.split(",", 1)[1]))
        await ctx.close()

    # ---------- 6) misure dello schermo e tema scuro ----------
    for w, h, scheme, tag in ((360, 740, "light", "360"), (412, 915, "dark", "412_scuro"), (800, 1280, "light", "tablet"), (360, 640, "dark", "360x640_scuro")):
        st = T.base_state("de"); st["days"] = days_full(); st["firstDay"] = "2026-10-01"; st["theme"] = "dark" if scheme == "dark" else "light"
        ctx, pg = await T.page(b, st, lang="de-DE", w=w, h=h, scheme=scheme)
        await T.close_layer(pg); await T.ev(pg, "tab='today'; render(); 1"); await pg.wait_for_timeout(400)
        r = await T.ev(pg, "(() => { const c = document.getElementById('w111Wk'); if (!c) return null; c.scrollIntoView({block:'center'}); const rc = c.getBoundingClientRect(); const over = [...c.querySelectorAll('b, p, .btn, .w111days')].filter((e) => { const q = e.getBoundingClientRect(); return q.right > rc.right + 1 || q.left < rc.left - 1 || e.scrollWidth > e.clientWidth + 1; }).length; return [Math.round(rc.width), over, document.documentElement.scrollWidth <= innerWidth]; })()")
        T.check(f"{tag}: scheda in Oggi dentro lo schermo, nessun testo che esce", r and r[1] == 0 and r[2], r)
        await pg.wait_for_timeout(300); await pg.screenshot(path=f"{SH}/oggi_{tag}.png")
        await T.ev(pg, "w111WeekOpen(); 1"); await ready(pg)
        r = await T.ev(pg, "(() => { const b = layer.querySelector('.gr20box'); const q = b.getBoundingClientRect(); const pv = layer.querySelector('#gr20Prev').getBoundingClientRect(); const bt = [...b.querySelectorAll('button')].map((x) => x.getBoundingClientRect()); return [q.top >= -1, q.bottom <= innerHeight + 1, q.right <= innerWidth + 1, pv.width > 120, bt.every((x) => x.height >= 44)]; })()")
        T.check(f"{tag}: finestra della cartolina dentro lo schermo, pulsanti alti almeno 44 px", r == [True] * 5, r)
        await pg.screenshot(path=f"{SH}/dialog_{tag}.png")
        await pg.click("[data-w111fmt=square]"); await ready(pg)
        await pg.screenshot(path=f"{SH}/dialog_sq_{tag}.png")
        T.check(f"{tag}: nessun errore", not pg.errs, pg.errs[:3])
        await ctx.close()

    # ---------- 7) caratteri: polacco e turco con Fredoka (file di riserva) ----------
    for lang, txt in (("pl", "Zażółć gęślą jaźń ĄĆĘŃŚŹŻ"), ("tr", "İstanbul ışığı şeker Ğ Ş")):
        ctx, pg = await T.page(b, T.base_state(lang), lang=LOC[lang])
        r = await T.ev(pg, f"(async () => {{ await document.fonts.load('600 20px Fredoka', {txt!r}); return [...document.fonts].filter((f) => f.family.replace(/\\W/g, '') === 'Fredoka' && /U\\+104-107/i.test(f.unicodeRange)).map((f) => f.weight + ':' + f.status); }})()")
        T.check(f"{lang}: Fredoka ha il file di riserva per {txt[:12]}... (caricato)", any(x.endswith("loaded") for x in r) and len(r) == 3, r)
        await ctx.close()
    from fontTools.ttLib import TTFont
    for w in (500, 600, 700):
        cm = TTFont(os.path.join(T.REPO, "fonts", f"t111-fredoka-fill-{w}.woff2")).getBestCmap()
        T.check(f"file di riserva {w}: tutte le 19 lettere", all(ord(c) in cm for c in "ąćęńśźżĄĆĘŃŚŹŻğĞşŞİ"))
    css = open(os.path.join(T.REPO, "fonts.css"), encoding="utf-8").read()
    T.check("fonts.css: il file di riserva e' dichiarato dopo tutti gli altri Fredoka", css.rfind("t111-fredoka-fill-700") > css.rfind("fredoka-latin-700") and css.count("t111-fredoka-fill") == 3)
    st = T.base_state("tr"); st["cards"] = ["r:tr:0"]
    ctx, pg = await T.page(b, st, lang="tr-TR", extra_js=FT)
    await T.close_layer(pg); await T.ev(pg, "window.__ft = []; gr20Fmt = 'story'; 1")
    await T.ev(pg, "gr20Make('card', 'r:tr:0').then(() => 1)")
    ft = [x["t"] for x in await T.ev(pg, "window.__ft")]
    T.check("turco: la cartolina scrive 'İstanbul' con la I puntata", "İstanbul" in ft, ft)
    ok = await T.ev(pg, "document.fonts.check('600 80px Fredoka', 'İ')")
    T.check("turco: la İ e' gia' pronta in Fredoka quando si disegna", ok)
    await ctx.close()

    # ---------- 8) statistiche di percorso ----------
    ctx, pg = await T.page(b, None, fresh=True, lang="it-IT", native=True, age="adult")
    r = await T.ev(pg, "[S.w111new, !!S.pet]")
    T.check("prima installazione: si segna che e' un'installazione nuova (1.0.11)", r == [1, False], r)
    import json
    full = T.base_state("it"); full.update({"log": [{"g": "water", "d": "2026-11-16"}], "tut": 99})
    await T.ev(pg, "(() => { const w = S.w111new; Object.assign(S, " + json.dumps(full) + "); S.w111new = w; S.away = { dest: 'f:forest', until: Date.now() + 9e5 }; render(); openPlus(); return 1; })()")
    await pg.wait_for_timeout(1500)
    gc = [u for u in pg.gc if "percorso-" in u]
    want = ["accoglienza-3-obiettivi", "accoglienza-4-guida", "primo-obiettivo", "primo-viaggio", "plus-aperto"]
    T.check("adulto: eventi di percorso inviati (una volta, senza dati personali)", all(any(f"percorso-{x}" in u for u in gc) for x in want) and not any("Germo" in u for u in gc), gc)
    n0 = len(gc); await T.ev(pg, "render(); render(); 1"); await pg.wait_for_timeout(600)
    T.check("ogni evento di percorso parte una volta sola", len([u for u in pg.gc if "percorso-" in u]) == n0)
    await ctx.close()
    ctx, pg = await T.page(b, None, fresh=True, lang="it-IT", native=True, age="child")
    await T.ev(pg, "(() => { const w = S.w111new; Object.assign(S, " + json.dumps(full) + "); S.w111new = w; render(); return 1; })()"); await pg.wait_for_timeout(1200)
    T.check("bambino: nessun evento di percorso inviato", not [u for u in pg.gc if "percorso-" in u], pg.gc)
    await ctx.close()
    st = T.base_state("it"); ctx, pg = await T.page(b, st, lang="it-IT", native=True)
    await T.ev(pg, "openPlus(); render(); 1"); await pg.wait_for_timeout(800)
    T.check("chi aveva gia' l'app: nessun evento di percorso (i conteggi restano puliti)", not [u for u in pg.gc if "percorso-" in u] and not await T.ev(pg, "!!S.w111new"))
    await ctx.close()
    st = T.base_state("it", firstDay="2026-11-15"); st["w111new"] = 1
    ctx, pg = await T.page(b, st, lang="it-IT", native=True)
    await pg.wait_for_timeout(500)
    T.check("ritorno nel giorno 2 contato", any("percorso-giorno-2" in u for u in pg.gc), pg.gc)
    await ctx.close()

    # ---------- 9) testi: 14 lingue complete ----------
    ctx, pg = await T.page(b, T.base_state("en"))
    r = await T.ev(pg, """(() => { const keys = Object.keys(W111_T.it); const bad = []; Object.entries(W111_T).forEach(([l, o]) => { keys.forEach((k) => { const v = o[k];
      if (v == null) bad.push(l + '.' + k); else if (Array.isArray(v) && v.length !== 3) bad.push(l + '.' + k + '[]'); else if (typeof v === 'function') { [1, 2, 3, 5, 7].forEach((n) => { const s = v(n === 1 ? 'Pallino' : n); if (typeof s !== 'string' || /undefined|NaN/.test(s)) bad.push(l + '.' + k + n); }); } }); });
      return [Object.keys(W111_T).length, bad]; })()""")
    T.check("cartolina della settimana: 14 lingue con tutti i testi", r[0] == 14 and not r[1], r)
    r = await T.ev(pg, "[1,2,3,4,5,6,7].map((n) => W111_T.ru.days(n)).concat([1,2,5].map((n) => W111_T.pl.days(n)))")
    T.check("plurali russi e polacchi dei giorni", r == ["1 день из 7 вместе", "2 дня из 7 вместе", "3 дня из 7 вместе", "4 дня из 7 вместе", "5 дней из 7 вместе", "6 дней из 7 вместе", "7 дней из 7 вместе", "1 dzień z 7 razem", "2 dni z 7 razem", "5 dni z 7 razem"], r)
    await ctx.close()

T.run(main)
