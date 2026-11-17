"""1.0.10 (richiesta del proprietario 17/11/2026): Diario con la domanda del giorno da sola (40 domande, nessuna ripetuta per
40 giorni) e la pagina libera con i compagni in pose diverse; la pagina libera si salva, passa dal controllo delle frasi di crisi,
completa l'obiettivo "Scrivere nel diario" e non perde il testo se la pagina si ridisegna. Introvabili senza tempi e in fondo."""
import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import lib110 as T
async def main(b):
    r = None
    ctx, pg = await T.page(b, T.base_state("it"), age="adult", lang="it-IT", native=True)
    r = await T.ev(pg, "Object.keys(T).map((l) => [l, T[l].questions.length, new Set(T[l].questions).size])")
    T.check("40 domande diverse in ogni lingua", all(x[1] == 40 and x[2] == 40 for x in r), r)
    await T.close_layer(pg)
    await pg.click('#tabs .tab[data-tab="diary"]'); await pg.wait_for_timeout(900); await T.close_layer(pg)
    r = await T.ev(pg, """(() => { const f = document.getElementById('diaryForm'); const fr = document.getElementById('v110Free');
      return [!!f, f ? f.querySelectorAll('.mood').length : -1, f ? f.querySelectorAll('.question').length : -1, !!fr, fr ? fr.querySelectorAll('.mood').length : -1,
        fr ? fr.querySelectorAll('.v110stage img').length : -1, !!document.querySelector('#v110Free + #v110DiaryHelp'), document.documentElement.classList.contains('v110x')]; })()""")
    T.check("domanda del giorno da sola (nessun umore sotto), pagina libera con umore e due compagni, aiuto sotto la pagina libera, nuovo aspetto attivo", r == [True, 0, 1, True, 5, 2, True, True], r)
    await pg.fill("#v110FreeTx", "Oggi ho fatto una passeggiata lunga")
    await T.ev(pg, "render(); 1")
    r = await T.ev(pg, "document.getElementById('v110FreeTx').value")
    T.check("il testo scritto resta se la pagina si ridisegna", r == "Oggi ho fatto una passeggiata lunga", r)
    await pg.click('#v110Free .mood[data-mood="3"]')
    await pg.click('#v110Free button[type="submit"]'); await pg.wait_for_timeout(500)
    r = await T.ev(pg, "(() => { const d = S.diary[S.diary.length - 1]; return [d.text, d.mood, d.free, d.q === undefined, (document.getElementById('v110FreeTx') || {}).value || '']; })()")
    T.check("la pagina libera si salva come voce del diario con l'umore, senza domanda, e il campo si svuota", r == ["Oggi ho fatto una passeggiata lunga", 3, 1, True, ""], r)
    n0 = await T.ev(pg, "S.diary.length")
    await pg.fill("#line", "Mia nonna"); await pg.click('#diaryForm button[type="submit"]'); await pg.wait_for_timeout(500)
    r = await T.ev(pg, "(() => { const d = S.diary[S.diary.length - 1]; return [S.diary.length, d.text, !!d.q]; })()")
    T.check("la risposta alla domanda del giorno si salva con la domanda", r == [n0 + 1, "Mia nonna", True], r)
    await T.close_layer(pg)
    r = await T.ev(pg, "(() => { const q0 = L().questions; const k = (d) => q0[Math.floor(new Date(d + 'T12:00:00').getTime() / 86400000) % q0.length]; const s = new Set(); for (let i = 0; i < 40; i++) { const dt = new Date(2026, 10, 17 + i); s.add(k(dt.getFullYear() + '-' + String(dt.getMonth() + 1).padStart(2, '0') + '-' + String(dt.getDate()).padStart(2, '0'))); } return s.size; })()")
    T.check("40 giorni di fila, 40 domande diverse", r == 40, r)
    T.check("nessun errore", not pg.errs, pg.errs[:3])
    await ctx.close()
    # frase di crisi nella pagina libera -> scheda d'aiuto; obiettivo "Scrivere nel diario" completato
    st = T.base_state("it", goals=("water", "walk", "journal", "tidy", "sleep"))
    ctx, pg = await T.page(b, st, age="adult", lang="it-IT", native=True)
    await T.close_layer(pg)
    await pg.click('#tabs .tab[data-tab="diary"]'); await pg.wait_for_timeout(900); await T.close_layer(pg)
    await pg.fill("#v110FreeTx", "non ce la faccio più, voglio morire")
    await pg.click('#v110Free button[type="submit"]'); await pg.wait_for_timeout(1800)
    r = await T.ev(pg, "[S.done.includes('journal'), !!(layer.innerHTML.match(/112|Telefono Amico|aiuto/i))]")
    T.check("pagina libera: obiettivo del diario fatto e scheda d'aiuto per le frasi di crisi", r == [True, True], r)
    T.check("nessun errore (2)", not pg.errs, pg.errs[:3])
    await ctx.close()
    # scene diverse a ogni apertura del Diario
    ctx, pg = await T.page(b, T.base_state("it"), age="adult", lang="it-IT", native=True)
    await T.close_layer(pg); seen = set()
    for i in range(8):
        await pg.click('#tabs .tab[data-tab="diary"]'); await pg.wait_for_timeout(400); await T.close_layer(pg)
        seen.add(await T.ev(pg, "[...document.querySelectorAll('.v110stage img')].map((x) => x.getAttribute('src').slice(-40)).join('|')"))
        await pg.click('#tabs .tab[data-tab="today"]'); await pg.wait_for_timeout(300); await T.close_layer(pg)
    T.check("ogni volta che si apre il Diario i compagni fanno un'altra cosa", len(seen) >= 5, len(seen))
    # negozio: niente "circa N mesi", Introvabili dopo gli altri gruppi
    await pg.click('#tabs .tab[data-tab="home"]'); await pg.wait_for_timeout(900); await T.close_layer(pg)
    r = await T.ev(pg, "(() => { const st = document.querySelector('#app .stack'); const k = [...st.children]; const x = k.findIndex((e) => e.classList.contains('xvshow')); const g = k.map((e, i) => e.classList.contains('shopgrp') ? i : -1).filter((i) => i >= 0); return [x > Math.max(...g), /ritmo|mesi|giorni/.test(document.querySelector('.xvshow').innerText)]; })()")
    T.check("Introvabili in fondo al negozio e senza tempi", r == [True, False], r)
    T.check("nessun errore (3)", not pg.errs, pg.errs[:3])
    await ctx.close()
T.run(main)
