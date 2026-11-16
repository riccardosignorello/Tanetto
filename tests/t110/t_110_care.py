"""1.0.10: fiducia su Plus (riga "resta gratis", promemoria della fine della prova) e promemoria piu' umani
(saluti al giorno 30 e 60, frasi di sola compagnia dopo una frase difficile)."""
import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import lib110 as T
SH = "/dev/shm/t110shots"; os.makedirs(SH, exist_ok=True)
LANGS = (("it", "it-IT"), ("en", "en-US"), ("de", "de-DE"), ("es", "es-ES"), ("fr", "fr-FR"), ("pt", "pt-BR"), ("ja", "ja-JP"), ("ko", "ko-KR"),
         ("zh", "zh-CN"), ("zht", "zh-TW"), ("ru", "ru-RU"), ("pl", "pl-PL"), ("nl", "nl-NL"), ("tr", "tr-TR"))
PRODS = "billProducts = { plans: { year: { token: 'y', trialToken: 'yt', trialDays: 7, price: '€44.99', micros: 44990000, currency: 'EUR' }, month: { token: 'm', trialToken: null, trialDays: 0, price: '€4.99', micros: 4990000, currency: 'EUR' } }, packs: {} };"

async def main(b):
    # 1) testi completi in 14 lingue
    st = T.base_state("it")
    ctx, pg = await T.page(b, st, age="adult", lang="it-IT", native=True)
    r = await T.ev(pg, "Object.keys(V110_CARE).filter((l) => { const c = V110_CARE[l]; return c.trust && c.trialNote && c.cardT && c.manage && c.card('01/01/2027').includes('01/01/2027') && c.notif('01/01/2027').includes('01/01/2027') && c.far('Germo').includes('Germo'); }).length")
    T.check("testi di fiducia e saluti lontani completi in 14 lingue", r == 14, r)
    await ctx.close()

    # 2) Plus: riga "resta gratis" sempre; riga sul promemoria solo con la prova gratuita
    for lang, loc in LANGS[:3] + (("ja", "ja-JP"),):
        ctx, pg = await T.page(b, T.base_state(lang), age="adult", lang=loc, native=True)
        await T.close_layer(pg)
        await T.ev(pg, PRODS + " plusPlan = 'year'; openPlus('prova'); 1"); await pg.wait_for_timeout(1500)
        await T.ev(pg, PRODS + " v110TrialNote(); 1"); await pg.wait_for_timeout(300)
        r = await T.ev(pg, "[!!document.querySelector('.plusbox .v110trust'), document.querySelectorAll('.plusbox .v110trust').length, !!document.querySelector('.plusbox .v110trialnote'), (document.querySelector('.plusbox .v110trust') || {}).textContent]")
        T.check(f"{lang}: Plus mostra 'resta gratis' una volta e la riga sul promemoria della prova", r[0] and r[1] == 1 and r[2], r)
        if lang == "it": await pg.screenshot(path=f"{SH}/care_plus_it.png")
        await T.ev(pg, "plusPlan = 'month'; v110TrialNote(); 1")
        r = await T.ev(pg, "!!document.querySelector('.plusbox .v110trialnote')")
        T.check(f"{lang}: senza prova gratuita (mensile) la riga sul promemoria sparisce", r is False, r)
        T.check(f"{lang}: nessun errore", not pg.errs, pg.errs[:3])
        await ctx.close()

    # 3) acquisto con prova: data salvata e notifica 2 giorni prima alle 10
    ctx, pg = await T.page(b, T.base_state("it"), age="adult", lang="it-IT", native=True)
    await T.close_layer(pg)
    r = await T.ev(pg, "(async () => { " + PRODS + " plusPlan = 'year'; S.plusOn = false; v110TrialDays = 7; const k = await handlePurchases([{ state: 'purchased', products: ['tanetto_plus'], acknowledged: true, token: 'x' }], false); await new Promise((z) => setTimeout(z, 600)); const n = (window.__notifs || []).find((x) => x.id === 210); return [k, Math.round((S.plusTrialEnd - Date.now()) / 864e5), n ? n.body : null, n ? new Date(n.schedule.at).getHours() : null, n ? Math.round((S.plusTrialEnd - new Date(n.schedule.at).getTime()) / 864e5) : null, v110TrialDays]; })()")
    T.check("acquisto con prova: fine prova fra 7 giorni, notifica 2 giorni prima alle 10 con la data", r[0] == "plus" and r[1] == 7 and r[2] and "Google Play" in r[2] and r[3] == 10 and r[4] == 2 and r[5] == 0, r)
    r = await T.ev(pg, "(async () => { S.plusTrialEnd = 0; S.plusOn = false; v110TrialDays = 0; await handlePurchases([{ state: 'purchased', products: ['tanetto_plus'], acknowledged: true, token: 'x' }], false); return S.plusTrialEnd; })()")
    T.check("acquisto senza prova: nessuna data di fine prova", not r, r)
    await ctx.close()

    # 4) riquadro in Oggi solo negli ultimi 2 giorni della prova
    for days, want in ((1.5, True), (5, False), (-1, False)):
        st = T.base_state("it"); st["plusOn"] = True
        ctx, pg = await T.page(b, st, age="adult", lang="it-IT", native=True)
        await T.close_layer(pg)
        await T.ev(pg, f"S.plusOn = true; S.plusTrialEnd = Date.now() + {days} * 864e5; tab = 'today'; render(); 1"); await pg.wait_for_timeout(600)
        r = await T.ev(pg, "(() => { const c = document.querySelector('.v110trial'); if (!c) return null; const a = c.querySelector('#v110Subs'); const bx = a.getBoundingClientRect(); return [c.textContent, a.getAttribute('href'), Math.round(bx.height), document.documentElement.scrollWidth <= innerWidth]; })()")
        if want:
            T.check(f"prova che finisce fra {days} giorni: riquadro con data e link all'abbonamento, tocco 48, niente scorrimento laterale", r and "Gestisci in Google Play" in r[0] and "sku=tanetto_plus" in r[1] and r[2] >= 48 and r[3], r)
            await pg.screenshot(path=f"{SH}/care_trial_today_it.png")
        else:
            T.check(f"prova che finisce fra {days} giorni: nessun riquadro", r is None, r)
        T.check(f"riquadro prova {days}: nessun errore", not pg.errs, pg.errs[:3])
        await ctx.close()
    # a 320 px e in tema scuro il riquadro sta dentro lo schermo
    st = T.base_state("de"); st["plusOn"] = True
    ctx, pg = await T.page(b, st, age="adult", lang="de-DE", native=True, w=320, h=640, scheme="dark")
    await T.close_layer(pg); await T.ev(pg, "S.plusOn = true; S.plusTrialEnd = Date.now() + 864e5; tab = 'today'; render(); 1"); await pg.wait_for_timeout(600)
    r = await T.ev(pg, "(() => { const c = document.querySelector('.v110trial'); const x = c.getBoundingClientRect(); return [Math.round(x.left), Math.round(x.right), innerWidth, document.documentElement.scrollWidth]; })()")
    T.check("de 320 px scuro: riquadro della prova dentro lo schermo", r[0] >= 0 and r[1] <= r[2] and r[3] <= r[2], r)
    await pg.screenshot(path=f"{SH}/care_trial_today_de320_dark.png")
    await ctx.close()

    # 5) promemoria: 10 date (fino al giorno 59), saluti lontani al 29 e al 59, ultimo gentile al 13
    for lang, loc in LANGS:
        st = T.base_state(lang); st["notif"] = True; st["petName"] = "Biscotto"; st["remTime"] = "20:00"
        ctx, pg = await T.page(b, st, age="adult", lang=loc, native=True)
        r = await T.ev(pg, "(async () => { await notifSchedule(); const n = (window.__notifs || []).filter((x) => x.id >= 100 && x.id < 116); const d0 = new Date(); d0.setHours(12, 0, 0, 0); const off = n.map((x) => Math.round((new Date(x.schedule.at).setHours(12, 0, 0, 0) - d0) / 864e5)); return [off, n.map((x) => x.body), v110Care().far('Biscotto'), V19N[S.lang].last('Biscotto'), n.every((x) => new Date(x.schedule.at).getHours() === 20)]; })()")
        offs, bodies, far, last, at20 = r
        ok = offs[-3:] == [13, 29, 59] and bodies[-1] == far and bodies[-2] == far and bodies[-3] == last and at20 and len(offs) in (9, 10)
        T.check(f"{lang}: promemoria fino al giorno 59, saluti lontani al 29 e 59, tutti alle 20", ok, [offs, bodies[-3:]])
        await ctx.close()

    # 6) dopo una frase difficile: i promemoria non parlano di obiettivi (solo compagnia), poi tornano normali alla riapertura
    st = T.base_state("it"); st["notif"] = True; st["petName"] = "Biscotto"; st["remTime"] = "20:00"
    ctx, pg = await T.page(b, st, age="adult", lang="it-IT", native=True)
    r = await T.ev(pg, "(async () => { await notifSchedule(); const before = (window.__notifs || []).filter((x) => x.id >= 100 && x.id < 108).map((x) => x.body); sf110Hush(10); await new Promise((z) => setTimeout(z, 2600)); await notifBusy; const after = (window.__notifs || []).filter((x) => x.id >= 100 && x.id < 108).map((x) => x.body); const soft = V110_SOFT.map((i) => V19N.it.msgs[i].split('{n}').join('Biscotto')); return [before, after, soft]; })()")
    before, after, soft = r
    T.check("prima: la rotazione normale non e' fatta solo di frasi di compagnia", any(x not in soft for x in before[:7]), before)
    T.check("dopo una frase difficile: i promemoria dei primi giorni sono solo frasi di compagnia, senza obiettivi", after and all(x in soft for x in after[:7]) and not any("obiettiv" in x for x in after[:7]), after)
    T.check("frasi di sola compagnia: nessun errore", not pg.errs, pg.errs[:3])
    await ctx.close()

T.run(main)
