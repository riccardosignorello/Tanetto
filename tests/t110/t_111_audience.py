"""1.0.11 (18/11/2026): pubblico dai 13 anni in su (Play Console: 13-15, 16-17, 18+), modalita' protetta per chi risulta
bambino (ageAds() === "child": sotto i 13 anni, "Preferisco non dirlo", eta' mai chiesta).
1) Modalita' protetta completa, provata per child / skip / mai chiesta (telefono finto, moduli finti che contano le chiamate):
   niente video e niente modulo degli annunci (quindi niente SDK e niente ID pubblicita'), niente statistiche (nessuna
   richiesta a GoatCounter), niente account ne' backup online, niente condivisione fuori dall'app (foto, cartoline, record,
   invito, condivisione del sistema), niente offerte (prova gratuita di Plus, "primo acquisto", "conviene di piu'", Plus che si
   apre da solo, richiesta di recensione).
2) Ragazzi e adulti: tutto come prima (condivisione, invito, prova gratuita): cosi' la prova non e' cieca.
3) Eta' non detta e poi detta da adulto: tutto torna.
4) Testi in 14 lingue: informativa (app e pagina pubblica), condizioni d'uso, testo breve della privacy, schermata dell'eta'
   neutra (nessuna eta' richiesta scritta), nessun "per tutte le eta'", data 18/11/2026.
Nessun dato personale: nomi e testi di prova inventati."""
import json, sys, os, re, html as H
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import lib110 as T

SPY = """(() => { const C = window.Capacitor && window.Capacitor.Plugins; if (!C) return;
  const A = C.TanettoAds; window.__adc = { init: 0, load: 0, show: 0, privacy: 0 };
  ["init", "load", "show", "privacy"].forEach((k) => { const f = A[k]; A[k] = async (o) => { __adc[k]++; return f(o); }; });
  window.__sh = { share: 0, save: 0, file: 0, nav: 0 };
  C.TanettoShare = { share: async () => { __sh.share++; return {}; }, saveImage: async () => { __sh.save++; return {}; }, saveFile: async () => { __sh.file++; return {}; } };
  const ns = async () => { __sh.nav++; }; try { Object.defineProperty(navigator, "share", { configurable: true, writable: true, value: ns }); navigator.canShare = () => true; } catch (e) {} })();"""
IMG = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=="
OLD_ALL = ["all ages", "tutte le età", "alle Altersgruppen", "todas las edades", "tous les âges", "todas as idades", "すべての年齢", "모든 연령", "所有年龄", "所有年齡", "любого возраста", "każdym wieku", "alle leeftijden", "her yaş"]

def st0(lang="en", **kw):
    d = dict(done=["water"], giftDay="2026-11-16", visit={"n": 5, "last": "2026-11-16"}, adsOk=1, log=[{"d": "2026-11-16", "g": "water"}], seeds=100)
    d.update(kw); return T.base_state(lang, **d)

PROBE = """(async () => {
  /* le finestre aperte e chiuse a mano dalla prova lasciano voci nella cronologia (tasto indietro, 97k/98f): qualche voce in piu'
     evita che un "indietro" dell'app esca dalla pagina della prova (non succede nell'uso vero, dove le finestre si chiudono dall'app) */
  for (let i = 0; i < 40; i++) history.pushState(history.state, '', location.href);
  const o = {}; const sh0 = Object.assign({}, __sh);
  o.kidClass = document.documentElement.classList.contains('a111kid'); o.ads = ageAds();
  /* annunci */
  o.adsOn = adsOn(); o.adOffer = adOffer(); o.adBtn = adBtn('x', 'y');
  /* statistiche */
  o.stats = v26StatsOn(); track('t111-prova'); trackOnce('t111-prova2');
  /* account */
  o.cloud = ageCloudOk();
  /* condivisione: tutte le strade */
  o.shImg = await shareImage(%(img)r, 'tanetto-foto.png');
  o.gr20 = await gr20Send({ kind: 'card', url: %(img)r, name: 'tanetto-cartolina.png', text: 'prova' });
  const full = !!window.__kidProbe; /* le finestre (invito, record, tutto fatto) si aprono solo nel giro del bambino */
  if (full) { layer.innerHTML = ''; inviteFlow(); await new Promise((r) => setTimeout(r, 900)); }
  o.inviteDlg = !!layer.querySelector('.weekimg, [data-shareimg]') && getComputedStyle(layer.querySelector('[data-shareimg]') || document.body).display !== 'none';
  layer.innerHTML = ''; inviteMode = false;
  let navErr = ''; try { await navigator.share({ text: 'x' }); } catch (e) { navErr = e && e.name; } o.navErr = navErr;
  o.imgBtns = imgButtons('x.png');
  if (full) { shareRecordCard(42); await new Promise((r) => setTimeout(r, 1200)); }
  const sb = layer.querySelector('[data-shareimg]'); o.recShareVisible = !!(sb && getComputedStyle(sb).display !== 'none');
  o.recSave = !!layer.querySelector('[data-saveimg]'); o.recTitle = (layer.querySelector('#shT') || {}).textContent || '';
  layer.innerHTML = '';
  tab = 'more'; moreSub = null; render(); await new Promise((r) => setTimeout(r, 300));
  const vis = (q) => [...document.querySelectorAll(q)].some((x) => x.getClientRects().length > 0 && getComputedStyle(x).display !== 'none');
  o.invite = vis('#invite, #v2Invite, .invcard');
  if (full) { layer.innerHTML = ''; openAllDone(); await new Promise((r) => setTimeout(r, 600)); } o.allDoneInvite = vis('.alldone #invite'); layer.innerHTML = '';
  o.sh = { share: __sh.share - sh0.share, nav: __sh.nav - sh0.nav };
  /* offerte */
  await loadProducts(true).catch(() => null);
  layer.innerHTML = ''; openPlus('t111'); await new Promise((r) => setTimeout(r, 700));
  o.plusGo = (document.getElementById('plusGo') || {}).textContent || ''; o.trialTxt = BT().trial(7);
  o.trialTok = billProducts && billProducts.plans && billProducts.plans.year ? billProducts.plans.year.trialToken : 'nobill';
  o.plusText = layer.innerText;
  layer.innerHTML = ''; openTaniShop('t111'); await new Promise((r) => setTimeout(r, 700));
  o.shopNudge = document.querySelectorAll('.tshop .firstpk, .tshop .pbadge, .tshop .pack.best').length;
  layer.innerHTML = '';
  o.plusAuto = nav20plusDue('t111'); o.review = typeof rev20Allowed === 'function' ? rev20Allowed() : false;
  return JSON.stringify(o); })()""" % {"img": IMG}

async def kid_case(b, age, label, lang="en"):
    ctx, pg = await T.page(b, st0(lang), native=True, age=age, lang="en-US", wait=3000, extra_js=SPY)
    await T.close_layer(pg); await pg.wait_for_timeout(6500); await T.ev(pg, "window.__kidProbe = 1; 1")
    o = json.loads(await T.ev(pg, PROBE)); await pg.wait_for_timeout(600)
    adc = json.loads(await T.ev(pg, "JSON.stringify(window.__adc)"))
    T.check(f"{label}: ageAds() = child e modalita' protetta attiva (classe a111kid)", o["ads"] == "child" and o["kidClass"], o)
    T.check(f"  {label}: niente pubblicita' e niente video (adsOn/adOffer spenti, nessun pulsante)", o["adsOn"] is False and o["adOffer"] is False and o["adBtn"] == "")
    T.check(f"  {label}: niente ID pubblicita': il modulo degli annunci (e quindi l'SDK) non viene mai chiamato", all(adc[k] == 0 for k in ("init", "load", "show", "privacy")), adc)
    T.check(f"  {label}: niente statistiche (spente e nessuna richiesta a GoatCounter)", o["stats"] is False and not pg.gc, pg.gc[:3])
    T.check(f"  {label}: niente account ne' backup online", o["cloud"] is False)
    T.check(f"  {label}: niente condivisione: nessuna chiamata al sistema (modulo nativo e navigator.share)", o["sh"] == {"share": 0, "nav": 0} and o["navErr"] == "AbortError", (o["sh"], o["navErr"]))
    T.check(f"  {label}: niente pulsante 'Condividi' (immagini, record) ma 'Salva' resta, titolo 'Salva'", "data-shareimg" not in o["imgBtns"] and "data-saveimg" in o["imgBtns"] and not o["recShareVisible"] and o["recSave"] and o["recTitle"] == await T.ev(pg, "L().saveImg"), (o["recShareVisible"], o["recTitle"]))
    T.check(f"  {label}: niente invito (Profilo, 'tutto fatto', finestra dell'invito)", not o["invite"] and not o["allDoneInvite"] and not o["inviteDlg"], (o["invite"], o["allDoneInvite"], o["inviteDlg"]))
    T.check(f"  {label}: niente prova gratuita di Plus (offerta di Google Play non proposta)", o["trialTok"] is None and o["trialTxt"] not in o["plusGo"] and o["trialTxt"] not in o["plusText"], (o["trialTok"], o["plusGo"]))
    T.check(f"  {label}: niente spinte all'acquisto (negozio, Plus automatico, recensione)", o["shopNudge"] == 0 and o["plusAuto"] is False and o["review"] is False, (o["shopNudge"], o["plusAuto"], o["review"]))
    T.check(f"  nessun errore ({label})", not pg.errs, pg.errs[:2])
    await ctx.close()

async def grown_case(b, age):
    ctx, pg = await T.page(b, st0("en"), native=True, age=age, lang="en-US", wait=3000, extra_js=SPY)
    await T.close_layer(pg); await pg.wait_for_timeout(3000)
    o = json.loads(await T.ev(pg, PROBE))
    T.check(f"{age}: nessuna modalita' protetta (classe assente)", not o["kidClass"] and o["ads"] == age, o["ads"])
    T.check(f"  {age}: la condivisione funziona come prima (foto e cartolina arrivano al modulo nativo)", o["sh"]["share"] >= 2 and "data-shareimg" in o["imgBtns"], o["sh"])
    T.check(f"  {age}: 'Invita un amico' in Profilo come prima", o["invite"])
    T.check(f"  {age}: la prova gratuita di Plus c'e' come prima", o["trialTok"] == "t1" and o["trialTxt"] in o["plusGo"], (o["trialTok"], o["plusGo"]))
    T.check(f"  nessun errore ({age})", not pg.errs, pg.errs[:2])
    await ctx.close()

async def main(b):
    # 1) modalita' protetta
    await kid_case(b, "child", "sotto i 13 anni")
    await kid_case(b, "skip", "preferisco non dirlo")
    await kid_case(b, "none", "eta' mai chiesta")
    await kid_case(b, {"y": 2014, "m": 1}, "12 anni")
    await kid_case(b, "child", "sotto i 13 anni (it)", lang="it")
    # 2) ragazzi e adulti come prima
    await grown_case(b, "teen")
    await grown_case(b, "adult")
    # 3) eta' non detta, poi detta da adulto: torna tutto
    ctx, pg = await T.page(b, st0("en"), native=True, age="skip", lang="en-US", wait=3000, extra_js=SPY)
    await T.close_layer(pg); await T.ev(pg, "loadProducts(true).catch(() => null)"); await pg.wait_for_timeout(1500)
    a = json.loads(await T.ev(pg, "JSON.stringify({ c: document.documentElement.classList.contains('a111kid'), t: billProducts && billProducts.plans.year.trialToken })"))
    await T.ev(pg, f"ageSet({json.dumps(dict(T.AGE['adult'], at='2026-11-16'))}); 1"); await pg.wait_for_timeout(800)
    r = json.loads(await T.ev(pg, "JSON.stringify({ c: document.documentElement.classList.contains('a111kid'), t: billProducts && billProducts.plans.year.trialToken, ib: imgButtons('x.png') })"))
    T.check("eta' non detta poi detta da adulto: modalita' protetta tolta, prova gratuita e 'Condividi' tornano", a["c"] and a["t"] is None and not r["c"] and r["t"] == "t1" and "data-shareimg" in r["ib"], (a, r["c"], r["t"]))
    T.check("  nessun errore", not pg.errs, pg.errs[:2])
    await ctx.close()
    # sito (niente Google Play): anche li' il bambino non vede la prova gratuita sul pulsante di Plus
    ctx, pg = await T.page(b, st0("en"), age="child", wait=3000)
    await T.close_layer(pg); await T.ev(pg, "openPlus('t111'); 1"); await pg.wait_for_timeout(700)
    r = json.loads(await T.ev(pg, "JSON.stringify({ t: layer.innerText, a: L().v13.afterY('X'), p: L().plus.trial, go: (document.getElementById('plusGo') || {}).textContent || '' })"))
    T.check("sito, bambino: Plus senza prova gratuita (pulsante 'Subscribe', niente '7 days free')", r["a"][:12] not in r["t"] and r["p"] not in r["t"] and r["go"] == "Subscribe", (r["go"], r["t"][-200:]))
    await ctx.close()
    # 4) testi in 14 lingue
    ctx, pg = await T.page(b, T.base_state("en"), age="adult")
    pp = open(os.path.join(T.REPO, "privacy.html"), encoding="utf-8").read()
    T.check("data dell'informativa 18/11/2026", await T.ev(pg, "PRIVACY_DATE") == "2026-11-18")
    for lang in T.LANGS:
        r = json.loads(await T.ev(pg, f"""JSON.stringify((() => {{ const t = T['{lang}'], x = A111['{lang}'];
          return {{ x, P: t.privDoc, C: t.terms, p: t.privP, note: AGE_T['{lang}'].note, ageP: AGE_T['{lang}'].P, skip: AGE_T['{lang}'].skip }}; }})())"""))
        x, P, C = r["x"], r["P"], r["C"]
        T.check(f"testi {lang}: informativa con il paragrafo nuovo (una volta, al posto di quello vecchio), riassunto e contatto per i genitori",
                P.count(x["kids"]) == 1 and len(P) >= 16 and x["sum"] in P[0] and "{email}" in x["kids"] and "13" in x["kids"] and r["skip"] in x["kids"], (len(P), P.count(x["kids"])))
        mi = [i for i, s in enumerate(C) if s == x["terms"]]
        T.check(f"  {lang}: condizioni d'uso con la riga sull'eta' (una volta, prima della riga sugli acquisti dei minorenni)", len(mi) == 1 and len(C) == 10 and mi[0] == 4 and C[3] != x["terms"], (len(C), mi))
        T.check(f"  {lang}: testo breve della privacy: 'pensata dai 13 anni in su'", x["privP"][1] in r["p"] and x["privP"][0] not in r["p"])
        T.check(f"  {lang}: schermata dell'eta' neutra (nota senza eta' richiesta, niente numeri)", r["note"] == x["note"] and not re.search(r"\d", r["note"] + r["ageP"]), r["note"])
        allt = " ".join(P) + " ".join(C) + r["p"] + r["note"]
        T.check(f"  {lang}: nessun 'per tutte le eta''", not [o for o in OLD_ALL if o in allt], [o for o in OLD_ALL if o in allt])
        em = await T.ev(pg, "OWNER_EMAIL")
        enc = lambda v: json.dumps(v.replace("{email}", em), ensure_ascii=False)[1:-1]
        T.check(f"  {lang}: pagina pubblica privacy.html con il paragrafo nuovo, il riassunto e la riga delle condizioni", enc(x["kids"]) in pp and enc(x["sum"]) in pp and enc(x["terms"]) in pp, lang)
    T.check("pagina pubblica: nessun 'for all ages' / 'per tutte le eta''", not [o for o in OLD_ALL if o in pp], [o for o in OLD_ALL if o in pp])
    T.check("pagina pubblica: data 18/11/2026 (inglese e italiano)", "18/11/2026" in pp and "17/11/2026" not in pp)
    T.check("nessun errore (testi)", not pg.errs, pg.errs[:2])
    await ctx.close()
    # schermata dell'eta' vera (primo avvio): nota neutra, niente "13", "Preferisco non dirlo" presente
    for lang in ("it", "en", "ja"):
        ctx, pg = await T.page(b, st0(lang), age="none", wait=3000)
        await T.close_layer(pg); await T.ev(pg, "openAge(); 1"); await pg.wait_for_timeout(500)
        r = json.loads(await T.ev(pg, "JSON.stringify({ b: !!document.querySelector('.agebox'), t: (document.querySelector('.agebox') || {}).innerText || '', s: !!document.getElementById('ageSkip'), m: (document.getElementById('ageM') || {}).value, y: (document.getElementById('ageY') || {}).value })"))
        T.check(f"schermata dell'eta' ({lang}): neutra (nessuna eta' scritta, menu vuoti, 'Preferisco non dirlo')", r["b"] and r["s"] and r["m"] == "" and r["y"] == "" and not re.search(r"\b13\b|13歳|all ages|tutte le età", r["t"]), r)
        await ctx.close()

if __name__ == "__main__": T.run(main)
