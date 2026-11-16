"""1.0.10: l'app senza internet (richiesta del proprietario 16/11/2026).
A) App Android (pagine nel telefono) con internet spento dall'avvio: Google Play, pubblicita' e qualsiasi altro sito non
   rispondono. Tutto il gioco deve andare: regalo, obiettivi, diario, chat, viaggio, negozio con i Tanì, stanza, album,
   Profilo; Plus e video devono dire con calma che serve la connessione, senza errori.
B) Sito: il service worker mette in cache tutto quello che serve per riaprire l'app senza internet."""
import json, sys, os, re
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import lib110 as T
REPO = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
OFF = """(() => { const P = window.Capacitor.Plugins; const fail = async () => { throw { code: 'network', message: 'offline' }; };
  P.Billing.products = fail; P.Billing.owned = fail; P.Billing.buy = fail;
  P.TanettoAds.init = async () => ({ canRequestAds: true, privacyRequired: false, loaded: false }); P.TanettoAds.load = fail;
  try { Object.defineProperty(navigator, 'onLine', { get: () => false }); } catch (e) {} })();"""

async def main(b):
    st = T.base_state("it", seeds=5000, visit={"n": 3, "last": "2026-11-15"}, giftDay="2026-11-15")
    ctx, pg = await T.page(b, st, age="adult", native=True, lang="it-IT", tz="Europe/Rome", extra_js=OFF, wait=1)
    blocked = []
    async def _net(r):
        u = r.request.url
        if u.startswith("http://127.0.0.1"): await r.continue_()
        else: blocked.append(u); await r.abort("internetdisconnected")
    await ctx.route("**/*", _net)
    await pg.reload(); await pg.wait_for_timeout(4000)
    await T.close_layer(pg)
    T.check("si apre senza internet (Oggi, compagno, obiettivi)", await T.ev(pg, "!!document.querySelector('.goal, [data-done]') && !!S.pet"))
    r = await T.ev(pg, "(() => { const s = S.seeds; openGift(document.getElementById('gift') || document.body); return S.seeds - s; })()")
    T.check("regalo del giorno", r > 0, r)
    r = await T.ev(pg, "(() => { layer.innerHTML=''; const g = todayGoals(); g.forEach((x) => completeGoal(x)); return [S.done.length, g.length]; })()")
    T.check("obiettivi spuntati", r[0] == r[1] and r[0] > 0, r)
    await T.ev(pg, "layer.innerHTML = ''; tab = 'diary'; render(); 1"); await pg.wait_for_timeout(400)
    await pg.fill("#line", "Giornata tranquilla"); await T.ev(pg, "document.getElementById('diaryForm').requestSubmit(); 1"); await pg.wait_for_timeout(800)
    T.check("diario salvato", await T.ev(pg, "S.diary.some((d) => d.text === 'Giornata tranquilla')"))
    c = await T.ev(pg, "(() => { const r = chatReply('ciao, come stai?'); return !!(r && r.text); })()")
    T.check("chat risponde (tutto sul telefono)", c)
    await T.ev(pg, "layer.innerHTML = ''; tab = 'today'; render(); 1"); await pg.wait_for_timeout(300)
    t = await T.ev(pg, "(() => { const st = tr20Info(); if (st.kind !== 'full' || S.away) return 'skip'; const { fant, real } = destList(); const d = fant.concat(real).filter((x) => x.lvl <= S.level)[0]; pickedDest = d.key; tr20Depart(); return !!S.away; })()")
    T.check("viaggio parte", t in (True, "skip"), t)
    it = await T.ev(pg, "(() => { const it = SHOP.find((s) => !s.xv && !s.event && !s.found && !s.coll && !s.reward && !s.special && s.price <= S.seeds && !S.owned.includes(s.id) && s.kind === 'furn' && !(typeof lockedItem === 'function' && lockedItem(s))); return it ? [it.id, it.price] : null; })()")
    if it:
        await T.ev(pg, "layer.innerHTML = ''; tab = 'shop'; render(); 1"); await pg.wait_for_timeout(400)
        s0 = await T.ev(pg, "S.seeds")
        await T.ev(pg, f"layer.innerHTML=''; tab = 'home'; homeTab = 'furn'; tryId = '{it[0]}'; render(); 1"); await pg.wait_for_timeout(500)
        await T.ev(pg, "document.getElementById('tryBuy').click(); 1"); await pg.wait_for_timeout(500)
        sh = await T.ev(pg, f"[S.owned.includes('{it[0]}'), {s0} - S.seeds]")
        T.check("negozio: si compra con i Tanì", sh == [True, it[1]], [it, sh])
    else: T.check("negozio: oggetto da comprare trovato", False)
    for name, js in [("Oggi", "tab = 'today'; render();"), ("viaggi e album", "tab = 'trips'; render();"), ("casa e negozio", "tab = 'home'; render();"), ("diario", "tab = 'diary'; render();"), ("Profilo", "tab = 'more'; render();")]:
        ok = await T.ev(pg, f"(() => {{ layer.innerHTML = ''; try {{ {js} return document.getElementById('app').textContent.length > 50; }} catch (e) {{ return 'err ' + e.message; }} }})()")
        T.check(f"schermata {name}", ok is True, ok)
    await T.ev(pg, "layer.innerHTML=''; openPlus('test'); 1"); await pg.wait_for_timeout(1500)
    p = await T.ev(pg, "(document.querySelector('.plusbox') || {}).textContent || ''")
    print("   Plus senza internet (fine):", p[-260:]); T.check("Plus senza internet: si apre e non mostra prezzi inventati", len(p) > 30 and "44,99" not in p and "44.99" not in p, p[:200])
    await T.ev(pg, "layer.innerHTML=''; openTaniShop('test'); 1"); await pg.wait_for_timeout(1000)
    q = await T.ev(pg, "(document.querySelector('.tshop') || {}).textContent || ''")
    T.check("negozio dei Tanì senza internet: si apre", len(q) > 30, q[:150])
    await T.ev(pg, "layer.innerHTML=''; 1")
    a = await T.ev(pg, "(async () => { const s = S.seeds; try { await adShow(() => adGrant(6), 'test'); } catch (e) { return 'err ' + e.message; } return S.seeds - s; })()")
    T.check("video senza internet: nessun Tanì regalato per sbaglio, nessun errore", a == 0, a)
    await pg.wait_for_timeout(500)
    T.check("salvataggio sul telefono", await T.ev(pg, "JSON.parse(localStorage.getItem('tanetto-prova-v3')).diary.length > 0"))
    errs = [e for e in pg.errs if not re.search(r"net::|internetdisconnected|offline|Failed to fetch|NetworkError|ERR_", e)]
    T.check("nessun errore dell'app senza internet", not errs, errs[:5])
    print("   richieste bloccate (rete spenta):", sorted(set(re.sub(r"\?.*", "", u)[:60] for u in blocked))[:8])
    await ctx.close()
    # B) sito: cosa salva il service worker
    sw = open(os.path.join(REPO, "sw.js"), encoding="utf-8").read()
    need = ["index.html", "fb.js", "gsap.min.js", "caveat-700.woff2", "manifest.webmanifest", "fonts.css", "icon-192.png"]
    T.check("service worker: salva pagina, script, caratteri e icone", all(f'"{n}"' in sw for n in need), [n for n in need if f'"{n}"' not in sw])
    html = open(os.path.join(REPO, "index.html"), encoding="utf-8").read()
    imgs = sorted(set(x for x in re.findall(r'["\'(](img/(?:m|ban|3d)/[^"\'?)]+\.webp)', html) if '*' not in x and '<' not in x and '$' not in x))
    miss = [i for i in imgs if i not in sw]
    T.check("service worker: le figure 3D usate dalla pagina sono tutte in cache", not miss, miss[:8])
    T.check("service worker: serve dalla cache senza rete", "caches.match" in sw and "fetch" in sw)

T.run(main)
