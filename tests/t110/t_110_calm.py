"""1.0.10 (98zl): dopo una frase difficile niente "Prova Plus", niente recensione, niente feste per 10 minuti;
nella scheda di aiuto i numeri si toccano per chiamare (tel:)."""
import json, sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import lib110 as T

async def main(b):
    ctx, pg = await T.page(b, T.base_state("it"), age="adult", lang="it-IT", tz="Europe/Rome")
    before = await T.ev(pg, "[sf110Quiet, sf110Calm()]")
    T.check("prima: nessuna calma attiva", before == [False, False], before)
    await T.ev(pg, "chatReply('ciao!'); 1")
    T.check("frase normale: nessuna calma", await T.ev(pg, "sf110Quiet") is False)
    await T.ev(pg, "chatReply('mi voglio ammazzare'); 1")
    T.check("dopo la frase difficile: calma attiva", await T.ev(pg, "[sf110Quiet, sf110Calm()]") == [True, True])
    T.check("niente 'Prova Plus' automatica", await T.ev(pg, "nav20plusDue('test') === false"))
    T.check("niente richiesta di recensione", await T.ev(pg, "reviewEligible() === false && rev20Allowed(S, Date.now()) === false"))
    T.check("finestre automatiche in attesa", await T.ev(pg, "nq20busy() === true"))
    await T.close_layer(pg)
    await T.ev(pg, "layer.innerHTML = ''; tab = 'diary'; render(); 1"); await pg.wait_for_timeout(500)
    await pg.fill("#line", "mi ammazzo"); await T.ev(pg, "document.getElementById('diaryForm').requestSubmit(); 1"); await pg.wait_for_timeout(1500)
    tels = await T.ev(pg, "[...document.querySelectorAll('.v26sos a[href^=\"tel:\"]')].map((a) => a.getAttribute('href'))")
    T.check("scheda di aiuto: numeri da toccare (19696, 112, Telefono Amico)", "tel:19696" in tels and "tel:112" in tels and "tel:0223272327" in tels, tels)
    T.check("findahelpline resta testo", await T.ev(pg, "(document.querySelector('.v26sos') || {}).textContent.includes('findahelpline.com')"))
    T.check("nessun errore", not pg.errs, pg.errs[:3])
    await ctx.close()

T.run(main)
