"""1.0.10: decisioni del proprietario del 16/11/2026.
M-09 b) Introvabili 54.000-63.000 e dal terzo video del giorno 6 Tanì; D-05) con Plus la parte in piu' del regalo
del giorno conta come "pagata"; M-13) titolare con il nome dello sviluppatore; G2-10) eta' con conferma e poi bloccata."""
import json, sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import lib110 as T
SH = "/dev/shm/t110shots"; os.makedirs(SH, exist_ok=True)

async def main(b):
    # --- prezzi e video
    ctx, pg = await T.page(b, T.base_state("en", seeds=100), age="adult", native=True)
    await T.close_layer(pg)
    pr = await T.ev(pg, "XV_IDS.map((id) => SHOP.find((s) => s.id === id).price)")
    T.check("Introvabili 54.000 / 54.000 / 56.000 / 58.000 / 60.000 / 63.000", sorted(pr) == [54000, 54000, 56000, 58000, 60000, 63000], pr)
    seq = await T.ev(pg, "(() => { const d = dkey(); S.visit = { n: 7, last: d }; const o = []; for (let n = 0; n <= 4; n++) { S.adsDay = { d, n }; econ().ads[d] = n; o.push(adAmount()); } return o; })()")
    T.check("video del giorno: 18, 18, poi 6, 6, 6 (serie piena)", seq == [18, 18, 6, 6, 6], seq)
    seq1 = await T.ev(pg, "(() => { const d = dkey(); S.visit = { n: 1, last: d }; const o = []; for (let n = 0; n <= 4; n++) { S.adsDay = { d, n }; econ().ads[d] = n; o.push(adAmount()); } return o; })()")
    T.check("video del giorno con la serie al primo giorno: sempre 6", seq1 == [6, 6, 6, 6, 6], seq1)
    est = await T.ev(pg, "(() => { const e = econ(); for (let i = 1; i <= 7; i++) { const x = new Date(); x.setDate(x.getDate() - i); e.ads[dkey(x)] = 5; } S.visit = { n: 7, last: dkey() }; S.adsDay = { d: dkey(), n: 0 }; e.ads[dkey()] = 0; return dailyTaniGuess(); })()")
    base = await T.ev(pg, "(() => { const e = econ(); for (let i = 1; i <= 7; i++) { const x = new Date(); x.setDate(x.getDate() - i); e.ads[dkey(x)] = 0; } return dailyTaniGuess(); })()")
    T.check("stima giornaliera: 5 video al giorno valgono 2x18 + 3x6 = 54 (non 90)", abs((est - base) - 54) <= 1, [est, base])
    await ctx.close()
    # --- Plus: regalo triplo, la parte in piu' e' "pagata"
    st = T.base_state("en", seeds=100, plusOn=True, plusSince="2026-11-01", plusCheck=0, plusMonth="2026-11", v20econ={"paid": 0, "spentN": 0}, giftDay="2026-11-15", visit={"n": 7, "last": "2026-11-16"})
    ctx, pg = await T.page(b, st, age="adult", native=True)
    await T.close_layer(pg)
    r = await T.ev(pg, "(() => { S.plusOn = true; S.giftDay = '2026-11-15'; const u = xvUsable(), s = S.seeds, p = +econ().paid || 0; openGift(document.getElementById('gift') || document.body); return { pa: plusActive(), got: S.seeds - s, du: xvUsable() - u, dp: (+econ().paid || 0) - p }; })()")
    T.check("Plus: il regalo vale il triplo (54) ma per gli Introvabili conta solo 18", r.get("pa") and r.get("got") == 54 and r.get("du") == 18 and r.get("dp") == 36, r)
    r2 = await T.ev(pg, "(() => { const s = S.seeds, p = +econ().paid || 0; openGift(document.body); return [S.seeds - s, (+econ().paid || 0) - p]; })()")
    T.check("regalo gia' aperto oggi: niente di nuovo, niente 'pagato' in piu'", r2 == [0, 0], r2)
    await ctx.close()
    # --- titolare
    ctx, pg = await T.page(b, T.base_state("it"), age="adult")
    c = await T.ev(pg, "Object.keys(V24).map((l) => V24[l].pCtrl)")
    T.check("titolare in 14 lingue: Snugbloom Studio – nome, Paese, e-mail", len(c) == 14 and all("Snugbloom Studio – " in x and "{email}" in x for x in c), c[:2])
    await ctx.close()
    # --- eta' con conferma
    for lang, loc in (("it", "it-IT"), ("en", "en-US"), ("ja", "ja-JP")):
        ctx, pg = await T.page(b, T.base_state(lang), age="none", lang=loc)
        await T.close_layer(pg)
        await T.ev(pg, "openAge(); 1"); await pg.wait_for_timeout(300)
        await pg.select_option("#ageM", "5"); await pg.select_option("#ageY", "1990"); await pg.click("#ageGo"); await pg.wait_for_timeout(300)
        st1 = await T.ev(pg, "[S.age === undefined, !!document.getElementById('ageOk'), !!document.getElementById('ageFix'), (document.querySelector('.v110agec') || {}).textContent || '']")
        T.check(f"eta' {lang}: prima di salvare chiede conferma (mese, anno ed eta')", st1[0] and st1[1] and st1[2] and "1990" in st1[3] and "36" in st1[3], st1)
        await pg.screenshot(path=f"{SH}/age_confirm_{lang}.png")
        await pg.click("#ageFix"); await pg.wait_for_timeout(300)
        st2 = await T.ev(pg, "[S.age === undefined, document.getElementById('ageM').value, document.getElementById('ageY').value, !document.getElementById('ageGo').disabled]")
        T.check(f"eta' {lang}: 'Correggi' torna alla scelta con i valori di prima", st2 == [True, "5", "1990", True], st2)
        await pg.select_option("#ageY", "1991"); await pg.click("#ageGo"); await pg.wait_for_timeout(300); await pg.click("#ageOk"); await pg.wait_for_timeout(500)
        st3 = await T.ev(pg, "[S.age && S.age.y, S.age && S.age.m, ageBand(), !!document.querySelector('.agebox'), JSON.parse(localStorage.getItem('tanetto-eta')).y]")
        T.check(f"eta' {lang}: 'Si'' salva e chiude", st3 == [1991, 5, "adult", False, 1991], st3)
        h = await T.ev(pg, "psAgeCard()")
        loc_ = await T.ev(pg, "(() => { const d = document.createElement('div'); d.innerHTML = psAgeCard(); return [!!d.querySelector('.psage .v110agelock'), !!d.querySelector('.psstats .v110agelock'), d.querySelectorAll('.v110agelock').length]; })()")
        T.check(f"eta' {lang}: nel Profilo niente pulsante per cambiarla e la frase 'non si cambia piu'' dentro la scheda dell'eta'", "psAge\"" not in h and loc_ == [True, False, 1], [loc_, h[:200]])
        T.check(f"eta' {lang}: nessun errore", not pg.errs, pg.errs[:3])
        await ctx.close()
    # l'eta' non arriva mai da un codice di trasferimento o da un file modificato (critica 1.0.10, punto 2)
    ctx, pg = await T.page(b, T.base_state("it"), age="child", lang="it-IT")
    await T.close_layer(pg)
    r = await T.ev(pg, """(async () => { const st = JSON.parse(JSON.stringify(S)); st.age = { y: 1990, m: 1 }; st.v26q = ['/x'];
      const code = 'TANETTO0:' + btoa(unescape(encodeURIComponent(JSON.stringify({ app: 'tanetto', v: 1, state: st }))));
      const got = await unpackState(code); const had = got && ('age' in got); restoreFrom(got);
      const y = document.querySelector('#rsYes, [data-restore], .box .btn'); if (y) y.click();
      await new Promise((r) => setTimeout(r, 300)); return [had, S.age && S.age.y, ageBand(), JSON.parse(localStorage.getItem('tanetto-eta')).y, !!S.v26q]; })()""")
    T.check("codice di trasferimento con un'eta' inventata: l'eta' resta quella del telefono (bambino)", r[0] is False and r[1] == 2017 and r[2] == "child" and r[3] == 2017 and r[4] is False, r)
    await ctx.close()
    ctx, pg = await T.page(b, T.base_state("it", age={"y": 1990, "m": 1}), age="child", lang="it-IT")
    await T.close_layer(pg)
    r = await T.ev(pg, "[S.age && S.age.y, ageBand()]")
    T.check("stato salvato con un'eta' diversa dalla copia locale: vince la copia locale", r == [2017, "child"], r)
    await ctx.close()
    # "Preferisco non dirlo": nessuna conferma, protezioni da bambino
    ctx, pg = await T.page(b, T.base_state("it"), age="none", lang="it-IT")
    await T.close_layer(pg); await T.ev(pg, "openAge(); 1"); await pg.wait_for_timeout(300); await pg.click("#ageSkip"); await pg.wait_for_timeout(400)
    T.check("'Preferisco non dirlo': salvato subito, eta' non detta", await T.ev(pg, "[!!(S.age && S.age.skip), ageBand(), !!document.querySelector('.agebox')]") == [True, "unknown", False])
    await ctx.close()

T.run(main)
