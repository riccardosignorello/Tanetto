"""1.0.11 (10/10): suoni dell'interfaccia subito e nuovo indirizzo del sito.
1) Suoni: su Android il suono del cambio di sezione arrivava circa 1 s dopo il tocco. Ora i suoni brevi sono pronti una
   volta sola (AudioBuffer) e quello della scheda parte DENTRO il pointerdown (sincrono: window.event e' ancora il
   pointerdown quando si chiama start), una sola volta per tocco; il "tap" generico parte dentro il click (non in un
   timer); il motore addormentato si risveglia al contatto. Interruttore dei suoni, musica, calma/leggera, protetta e
   app Android come prima.
2) Indirizzo: tutto cio' che si vede, si condivide o si apre usa https://tanetto.app (14 lingue); il service worker e le
   statistiche funzionano sia su tanetto.app sia sul vecchio indirizzo github.io (scope dal percorso).
Nessun dato personale."""
import json, os, re, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import lib110 as T

SPY = """window.__au = []; (() => {
  const mk = (P, k) => { const s0 = P.start; P.start = function (...a) { const e = window.event; let off = false; try { off = this.context instanceof OfflineAudioContext; } catch (x) { /* niente */ }
    if (!off) window.__au.push({ k, ev: e ? e.type : '', t: performance.now(), st: this.context.state }); return s0.apply(this, a); }; };
  mk(AudioBufferSourceNode.prototype, 'buf'); mk(OscillatorNode.prototype, 'osc');
  window.addEventListener('pointerdown', () => { window.__pd = performance.now(); }, true); })();"""
TAB = '#tabs .tab[data-tab="%s"]'


def st(**kw):
    s = T.base_state("en", sfx=True, calm=False, lite=False); s.update(kw); return s


async def ready(pg):
    """primo tocco (sblocca l'audio nel browser) e attesa dei suoni pronti"""
    await pg.mouse.click(5, 5)
    return await T.ev(pg, "new Promise((r) => { const t0 = Date.now(); const f = () => (SND.sfxReady() >= 22 || Date.now() - t0 > 8000) ? r(SND.sfxReady()) : setTimeout(f, 50); f(); })")


async def press(pg, sel, how="tap"):
    await T.ev(pg, "window.__au.length = 0; window.__t0 = performance.now(); 1")
    if how == "tap": await pg.tap(sel)
    elif how == "click": await pg.click(sel)
    else: await pg.focus(sel); await pg.keyboard.press("Enter")
    await pg.wait_for_timeout(600)
    return json.loads(await T.ev(pg, """JSON.stringify({ au: window.__au.filter((x) => x.ev === 'pointerdown' || x.ev === 'click' || x.ev === 'keydown'),
      tr: SND.trace().filter((x) => x.at >= window.__t0).map((x) => x.n + ':' + x.via), tab, pd: window.__pd, st: SND.state() })"""))


def one_sync(r, ev="pointerdown", name="click"):
    return len(r["au"]) == 1 and r["au"][0]["ev"] == ev and r["au"][0]["k"] == "buf" and len(r["tr"]) == 1 and (name is None or r["tr"] == [name + ":buf"])


async def sound_part(b):
    # ---------- a) suoni pronti una volta sola, interi (coda silenziosa: durata giusta) ----------
    ctx, pg = await T.page(b, st(), extra_js=SPY)
    await T.close_layer(pg)
    n = await ready(pg)
    T.check("22 suoni brevi pronti come AudioBuffer (18 dell'interfaccia + 4 note del logo)", n == 22, n)
    r = json.loads(await T.ev(pg, """JSON.stringify(SND.sfxNames().map((n) => { const b = SND.sfxBuf(n); if (!b) return [n, null];
      let pk = 0, tail = 0; const tl = Math.floor(b.sampleRate * 0.01);
      for (let c = 0; c < b.numberOfChannels; c++) { const d = b.getChannelData(c); for (let i = 0; i < d.length; i++) { const a = Math.abs(d[i]); if (a > pk) pk = a; if (i >= d.length - tl && a > tail) tail = a; } }
      return [n, +pk.toFixed(4), +tail.toFixed(5), b.sampleRate === SND.unlock().sampleRate]; }))"""))
    bad = [x for x in r if x[1] is None or not (x[1] > 0.01 and x[2] <= x[1] * 0.02 and x[3])]
    T.check("  ogni suono si sente (picco > 0,01), finisce dentro il buffer (ultimi 10 ms sotto il 2% del picco), stessa frequenza del motore", not bad, bad or r[:3])
    # ---------- b) cambio di scheda: suono dentro il pointerdown, una volta sola ----------
    await T.ev(pg, "tab = 'today'; render(); 1"); await pg.wait_for_timeout(300)
    r = await press(pg, TAB % "trips")
    T.check("tocco su Avventure: il suono parte DENTRO il pointerdown (sincrono), dal buffer pronto, una sola volta", one_sync(r), r)
    T.check("  la scheda cambia (Avventure)", r["tab"] == "trips", r["tab"])
    d = r["au"][0]["t"] - r["pd"] if r["au"] else 99
    T.check(f"  tra il dito e start() {d:.1f} ms (meno di 5 ms)", 0 <= d < 5, d)
    r = await press(pg, TAB % "home", "click")
    T.check("click (mouse) su Casa: suono dentro il pointerdown, una volta sola, scheda cambiata", one_sync(r) and r["tab"] == "home", r)
    r = await press(pg, TAB % "home")
    T.check("di nuovo Casa (stessa scheda): un solo 'tap', dentro il pointerdown", one_sync(r, name="tap") and r["tab"] == "home", r)
    r = await press(pg, TAB % "diary", "key")
    T.check("da tastiera (Invio) su Diario: suono dentro il click, una volta sola, scheda cambiata", one_sync(r, ev="click") and r["tab"] == "diary", r)
    # schede della Casa (negozio)
    await T.ev(pg, "tab = 'home'; render(); 1"); await pg.wait_for_timeout(400)
    hs = await T.ev(pg, "(() => { const b = [...document.querySelectorAll('button[data-hometab]')].find((x) => x.getAttribute('aria-selected') !== 'true' && x.offsetParent); if (!b) return ''; b.id = b.id || 'sfxHt'; return '#' + b.id; })()")
    if hs:
        k = await T.ev(pg, f"document.querySelector('{hs}').dataset.hometab")
        r = await press(pg, hs)
        T.check("scheda della Casa: suono dentro il pointerdown, una volta sola", one_sync(r) and await T.ev(pg, "homeTab") == k, r)
    else:
        T.check("scheda della Casa: pulsanti presenti", False, "nessun data-hometab visibile")
    # tap generico: dentro il click, non in un timer
    await T.ev(pg, "tab = 'more'; moreSub = null; render(); 1"); await pg.wait_for_timeout(400)
    r = await press(pg, "[data-psub]")
    T.check("riga del Profilo: il suo suono parte dentro il click (non in un timer), una volta sola", one_sync(r, ev="click", name=None), r)
    await T.ev(pg, "tab = 'more'; moreSub = null; render(); layer.innerHTML = '<div class=overlay><div class=box><button id=sfxPlain type=button>x</button></div></div>'; 1"); await pg.wait_for_timeout(200)
    r = await press(pg, "#sfxPlain", "click")
    T.check("pulsante senza suono suo: il 'tap' generico parte dentro il click (non in un timer), una volta sola", one_sync(r, ev="click", name="tap"), r)
    await T.close_layer(pg)
    # nota del logo (spunta)
    await T.ev(pg, "window.__t0 = performance.now(); SND.logoTick(2); 1")
    T.check("nota del logo della spunta: dal buffer pronto", await T.ev(pg, "SND.trace().filter((x) => x.at >= window.__t0).map((x) => x.n + ':' + x.via).join()") == "tick1:buf")
    # motore addormentato: si risveglia al contatto, il suono parte comunque dentro il pointerdown
    await T.ev(pg, "tab = 'today'; render(); SND.suspend(); 1"); await pg.wait_for_timeout(400)
    s0 = await T.ev(pg, "SND.state()")
    r = await press(pg, TAB % "trips")
    T.check("motore addormentato: al tocco si risveglia e il suono parte dentro il pointerdown", s0 == "suspended" and one_sync(r) and r["st"] == "running", [s0, r])
    T.check("  nessun errore", not pg.errs, pg.errs[:3])
    await ctx.close()
    # ---------- c) impostazioni e modalita' come prima ----------
    cases = [("suoni spenti", st(sfx=False), "adult", False, 0), ("calma e leggera", st(calm=True, lite=True), "adult", False, 1),
             ("modalita' protetta", st(), "child", False, 1), ("app Android", st(), "adult", True, 1), ("musica accesa", st(music=True), "adult", False, 1)]
    for name, s, age, nat, want in cases:
        ctx, pg = await T.page(b, s, age=age, native=nat, extra_js=SPY)
        await T.close_layer(pg); await ready(pg)
        await T.ev(pg, "tab = 'today'; render(); 1"); await pg.wait_for_timeout(300)
        mus0 = await T.ev(pg, "SND.playing()")
        r = await press(pg, TAB % "trips")
        if want:
            T.check(f"{name}: suono della scheda dentro il pointerdown, una volta sola, scheda cambiata", one_sync(r) and r["tab"] == "trips", r)
        else:
            T.check(f"{name}: nessun suono, la scheda cambia", not r["au"] and not r["tr"] and r["tab"] == "trips", r)
        if s.get("music"):
            T.check("  la musica continua", mus0 and await T.ev(pg, "SND.playing()"), mus0)
        if age == "child":
            T.check("  resta la modalita' protetta", await T.ev(pg, "document.documentElement.classList.contains('a111kid')"))
        T.check(f"  nessun errore ({name})", not pg.errs, pg.errs[:3])
        await ctx.close()


async def domain_part(b):
    # ---------- d) file costruiti: nessun vecchio indirizzo visibile ----------
    R = T.REPO
    for f in ["index.html", "privacy.html", "elimina-account.html", "licenses.html", "sw.js", "press/index.html", "get/index.html", "test/index.html", "sitemap.xml", "robots.txt"]:
        s = open(os.path.join(R, f), encoding="utf-8").read()
        left = [m for m in re.findall(r".{0,40}github\.io.{0,20}", s) if "SITE_HOST" not in m and "localhost|github" not in m and "vecchio indirizzo github.io" not in m]
        T.check(f"{f}: nessun 'tanettoapp.github.io' (resta github.io solo nel riconoscimento dell'indirizzo)", "tanettoapp.github.io" not in s and not left, left[:2])
    pv = open(os.path.join(R, "privacy.html"), encoding="utf-8").read()
    n = pv.count('tanetto.app/elimina-account.html')
    T.check(f"privacy.html: pagina di cancellazione su tanetto.app in tutte le lingue ({n}), con il link", n >= 14 and '<a href="elimina-account.html">tanetto.app/elimina-account.html</a>' in pv, n)
    T.check("privacy.html e elimina-account.html: indirizzo canonico su tanetto.app",
            '<link rel="canonical" href="https://tanetto.app/privacy.html">' in pv and '<link rel="canonical" href="https://tanetto.app/elimina-account.html">' in open(os.path.join(R, "elimina-account.html"), encoding="utf-8").read())
    # ---------- e) nell'app, 14 lingue ----------
    CHK = """JSON.stringify((() => { const o = {};
      o.site = SITE_URL; o.post = GR20_LINK; o.share = shareUrl(); o.week = w111ShareText('x', 'week');
      openDoc('privDoc'); const a = document.querySelector('.overlay a[href*="privacy.html"]'); o.priv = a ? [a.getAttribute('href'), a.textContent] : null;
      o.txt = JSON.stringify(L()).includes('github.io'); o.del = JSON.stringify(L()).includes('tanetto.app/elimina-account.html'); layer.innerHTML = ''; return o; })())"""
    for lang in T.LANGS:
        ctx, pg = await T.page(b, T.base_state(lang), lang="en-US", wait=2500)
        await T.close_layer(pg)
        r = json.loads(await T.ev(pg, CHK))
        await T.ev(pg, "window.__sub = null; const _mc = makeCard; makeCard = function (o) { window.__sub = o && o.sub; return _mc.apply(this, arguments); }; inviteFlow(); 1")
        await pg.wait_for_timeout(1500); r["sub"] = await T.ev(pg, "window.__sub"); await T.close_layer(pg)
        T.check(f"{lang}: sito, cartolina, invito e testo della settimana su https://tanetto.app",
                r["site"] == "https://tanetto.app/" and r["post"] == "https://tanetto.app/?src=postcard" and r["share"] == "https://tanetto.app/?src=amico"
                and "https://tanetto.app/?src=postcard&utm_source=share" in r["week"], r)
        T.check(f"  {lang}: scheda 'Ti presento...' con tanetto.app sotto il titolo", r["sub"] == "tanetto.app", r["sub"])
        T.check(f"  {lang}: privacy -> https://tanetto.app/privacy.html?lang={lang}, testi senza github.io, cancellazione su tanetto.app",
                r["priv"] == [f"https://tanetto.app/privacy.html?lang={lang}", "tanetto.app/privacy.html"] and not r["txt"] and r["del"], r)
        T.check(f"  nessun errore ({lang})", not pg.errs, pg.errs[:2])
        await ctx.close()
    # cancellazione dell'account per chi risulta minore dopo un account (I-08)
    ctx, pg = await T.page(b, T.base_state("it"), age="child", wait=2500)
    await T.close_layer(pg)
    h = await T.ev(pg, "acctCard()")
    T.check("protetta: il link per cancellare l'account va a https://tanetto.app/elimina-account.html?lang=it", 'href="https://tanetto.app/elimina-account.html?lang=it"' in h, h[-300:])
    await ctx.close()
    # riconoscimento dell'indirizzo del sito (service worker, statistiche, installazione, iPhone): solo i due indirizzi veri
    ctx, pg = await T.page(b, T.base_state("en"), wait=2500)
    r = json.loads(await T.ev(pg, "JSON.stringify(['tanetto.app', 'www.tanetto.app', 'tanettoapp.github.io', 'eviltanetto.app', 'tanetto.app.evil.com', 'localhost', '127.0.0.1'].map((h) => SITE_HOST.test(h)))"))
    T.check("SITE_HOST: tanetto.app, www.tanetto.app e tanettoapp.github.io si', altri indirizzi no", r == [True, True, True, False, False, False, False], r)
    await ctx.close()
    # ---------- f) il sito sui due indirizzi: service worker (scope dal percorso) e statistiche ----------
    for base in ["https://tanetto.app/", "https://tanettoapp.github.io/Tanetto/"]:
        ctx = await b.new_context(viewport={"width": 412, "height": 915}, is_mobile=True, has_touch=True)
        gc = []
        def mk(base):
          async def site(r):
            path = r.request.url[len(base):].split("?")[0].split("#")[0] or "index.html"; f = os.path.join(R, path)
            if os.path.isfile(f): await r.fulfill(path=f)
            else: await r.fulfill(status=404, body="not found")
          return site
        site = mk(base)
        async def gcr(r): gc.append(r.request.url); await r.fulfill(body="", status=204)
        await ctx.route(base + "**", site); await ctx.route("**/*goatcounter.com/**", gcr); await ctx.route("**/fonts.googleapis.com/**", lambda r: r.abort())
        pg = await ctx.new_page(); errs = []; pg.on("pageerror", lambda e: errs.append(str(e)))
        await pg.add_init_script("sessionStorage.setItem('splash','1');")
        await pg.goto(base, timeout=180000); await pg.wait_for_timeout(4000)
        sc = await pg.evaluate("Promise.race([navigator.serviceWorker.ready.then((r) => r.scope), new Promise((r) => setTimeout(() => r(''), 15000))])")
        T.check(f"{base}: il service worker si registra con scope {base}", sc == base, sc)
        app = await pg.evaluate("document.querySelectorAll('#app *').length")
        T.check(f"  {base}: l'app si apre", app > 20, app)
        T.check(f"  nessun errore ({base})", not errs, errs[:2])
        await ctx.close()


async def main(b):
    await sound_part(b)
    await domain_part(b)

T.run(main)
