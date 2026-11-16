"""1.0.10: controllo finale (piccole cose): avviso di memoria piena leggibile, nomi per il lettore di schermo, licenze
nella lingua dell'app, eta' e backup di Android, umore del diario a 320 px, aree di tocco."""
import json, sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import lib110 as T
SH = "/dev/shm/t110shots"; os.makedirs(SH, exist_ok=True)

async def main(b):
    # memoria piena
    ctx, pg = await T.page(b, T.base_state("it"), age="adult", lang="it-IT")
    await T.close_layer(pg)
    await T.ev(pg, "(() => { const o = Storage.prototype.setItem; Storage.prototype.setItem = function (k, v) { if (k === 'tanetto-prova-v3') { const e = new Error('full'); e.name = 'QuotaExceededError'; throw e; } return o.call(this, k, v); }; return 1; })()")
    await T.ev(pg, "(() => { const g = todayGoals().find((x) => !S.done.includes(x)); completeGoal(g); return 1; })()")
    seen = []
    for i in range(20):
        await pg.wait_for_timeout(500)
        seen.append(await T.ev(pg, "(() => { const t = document.getElementById('toast'); return t && !t.hidden ? t.textContent : ''; })()"))
    full = L_full = await T.ev(pg, "L().v26.full")
    n = sum(1 for x in seen if x == full)
    T.check("memoria piena: l'avviso resta leggibile almeno 6 secondi", n >= 12, [n, seen[:6]])
    await ctx.close()
    # lettore di schermo
    for lang, loc, menu in (("ru", "ru-RU", "Меню"), ("ja", "ja-JP", "メニュー"), ("it", "it-IT", "Menu")):
        ctx, pg = await T.page(b, T.base_state(lang, seeds=12345), age="adult", lang=loc)
        await T.close_layer(pg); await T.ev(pg, "render(); 1")
        r = await T.ev(pg, "[document.getElementById('tabs').getAttribute('aria-label'), (document.getElementById('seedPill') || {getAttribute(){return ''}}).getAttribute('aria-label'), document.getElementById('seedN').textContent, (document.getElementById('lvBtn') || {getAttribute(){return ''}}).getAttribute('aria-label'), (document.getElementById('lvBtn') || {textContent:''}).textContent.trim()]")
        T.check(f"{lang}: barra in basso '{menu}', Tanì e livello cominciano con il testo visibile", r[0] == menu and r[1].startswith(r[2]) and (not r[3] or r[3].startswith(r[4])), r)
        await ctx.close()
    # licenze e testo dell'eta'
    ctx, pg = await T.page(b, T.base_state("it"), age="adult", lang="it-IT")
    await T.close_layer(pg)
    T.check("eta': la schermata dice anche del backup di Android", await T.ev(pg, "AGE_T.it.P.includes('backup di Android') && v23().ageYes.includes('backup di Android')"))
    await T.ev(pg, "layer.innerHTML=''; tab='more'; render(); 1"); await pg.wait_for_timeout(300)
    await T.ev(pg, "(() => { const b = document.createElement('button'); b.id = 'v26Lic'; document.body.appendChild(b); b.click(); b.remove(); return 1; })()"); await pg.wait_for_timeout(1500)
    lic = await T.ev(pg, "(layer.querySelector('.v26lic') || {textContent: ''}).textContent")
    T.check("licenze: frase iniziale in italiano", "componenti open source" in lic and "open-source components" not in lic, lic[:160])
    T.check("nessun errore", not pg.errs, pg.errs[:3])
    await ctx.close()
    # umore del diario a 320 px
    for lang, loc in (("ru", "ru-RU"), ("it", "it-IT"), ("de", "de-DE")):
        ctx, pg = await T.page(b, T.base_state(lang), age="adult", lang=loc, w=320, h=640)
        await T.close_layer(pg); await T.ev(pg, "layer.innerHTML=''; tab='diary'; render(); 1"); await pg.wait_for_timeout(400)
        r = await T.ev(pg, "(() => { const ms = [...document.querySelectorAll('.mood')]; const card = ms[0] && ms[0].closest('.card'); const cr = card ? card.getBoundingClientRect() : null; return ms.map((m) => { const q = m.getBoundingClientRect(), s = m.querySelector('span'); const sr = s ? s.getBoundingClientRect() : q; return [Math.round(q.height), sr.left >= q.left - 1 && sr.right <= q.right + 1, !cr || (q.left >= cr.left - 1 && q.right <= cr.right + 1)]; }); })()")
        T.check(f"diario {lang} 320 px: parole dell'umore dentro i pulsanti, nessun pulsante tagliato, alti >= 48", r and all(x[0] >= 48 and x[1] and x[2] for x in r), r)
        await pg.screenshot(path=f"{SH}/mood_{lang}_320.png")
        await ctx.close()
    # aree di tocco degli interruttori
    ctx, pg = await T.page(b, T.base_state("it"), age="adult", lang="it-IT")
    await T.close_layer(pg); await T.ev(pg, "layer.innerHTML=''; tab='more'; render(); 1"); await pg.wait_for_timeout(300)
    await T.ev(pg, "moreSub = 'priv'; render(); 1"); await pg.wait_for_timeout(300)
    r = await T.ev(pg, "(() => { const s = [...document.querySelectorAll('.switch')].find((x) => x.getClientRects().length && x.getBoundingClientRect().height > 0); if (!s) return null; s.scrollIntoView({ block: 'center' }); const q = s.getBoundingClientRect(); const e = document.elementFromPoint(q.left + q.width / 2, q.top - 6); return e === s || s.contains(e); })()")
    T.check("interruttori: si toccano anche 6 px sopra il disegno (area 48 px)", r is True, r)
    await ctx.close()

    # chat e diario: aiuto sempre a un tocco, risposte "di riserva" solo calme
    for lang, loc in (("it", "it-IT"), ("ja", "ja-JP")):
        ctx, pg = await T.page(b, T.base_state(lang), age="child", lang=loc, tz="Europe/Rome" if lang == "it" else "Asia/Tokyo")
        await T.close_layer(pg)
        d = await T.ev(pg, "L().chat.R.default")
        T.check(f"{lang}: risposte quando Germo non capisce: solo le 2 calme", len(d) == 2, d)
        await T.ev(pg, "layer.innerHTML=''; openChat(); 1"); await pg.wait_for_timeout(400)
        await pg.click("#v110ChatHelp"); await pg.wait_for_timeout(500)
        r = await T.ev(pg, "[!!layer.querySelector('.chatbox .v26sos'), layer.querySelectorAll('.v26sos a[href^=\"tel:\"]').length]")
        T.check(f"{lang}: in chat 'Hai bisogno di aiuto?' mostra i numeri da toccare", r[0] and r[1] >= 2, r)
        await T.ev(pg, "layer.innerHTML=''; tab='diary'; render(); 1"); await pg.wait_for_timeout(500)
        await pg.click("#v110DiaryHelp"); await pg.wait_for_timeout(500)
        r = await T.ev(pg, "[!!layer.querySelector('.v26sheet'), layer.querySelectorAll('.v26sos a[href^=\"tel:\"]').length]")
        T.check(f"{lang}: nel diario 'Hai bisogno di aiuto?' apre la scheda con i numeri", r[0] and r[1] >= 1, r)
        await pg.screenshot(path=f"{SH}/diary_help_{lang}.png")
        T.check(f"{lang}: nessun errore", not pg.errs, pg.errs[:3])
        await ctx.close()

T.run(main)
