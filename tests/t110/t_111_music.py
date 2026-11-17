"""1.0.11 (web): musiche a tema per ogni evento (60_sound.js, EVS). Date degli eventi, partenza automatica solo con la musica
accesa, scelta di un altro brano, brano dell'evento in Profilo > Suoni, partitura valida, suono pulito (niente valori non
numerici, niente salti di campione, volume sotto la soglia), giro che ricomincia senza buchi."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import lib110 as T

RENDER = """(async (id, a, len) => {
  const inf = SND.evInfo(id); const sr = 22050; const c = new OfflineAudioContext(2, Math.ceil(sr * len), sr);
  const bus = SND.evChain(c); bus.gain.value = inf.K * inf.g; let t = 0.05; let p = a;
  while (t < len - 0.5) { t += inf.step; SND.evRenderFrom(c, bus, id, p, 1, t - inf.step); p++; }
  const b = await c.startRendering(); const x = b.getChannelData(0); let pk = 0, nan = 0, jump = 0, rms = 0;
  for (let i = 1; i < x.length; i++) { const v = x[i]; if (!Number.isFinite(v)) { nan++; continue; } pk = Math.max(pk, Math.abs(v)); rms += v * v; if (Math.abs(v - x[i - 1]) > 0.25) jump++; }
  return { pk, nan, jump, rms: Math.sqrt(rms / x.length) };
})"""

async def main(b):
    # ---------- date: quale musica in quale giorno ----------
    ctx, pg = await T.page(b, T.base_state("it"), lang="it-IT")
    cases = [((2026, 11, 20), "lanterns"), ((2026, 12, 7), "lanterns"), ((2026, 12, 8), "xmas"), ((2027, 1, 6), "xmas"), ((2027, 1, 7), "fresh"), ((2027, 1, 31), "fresh"),
             ((2027, 2, 1), "stars"), ((2027, 3, 10), "kites"), ((2027, 7, 1), "kites"), ((2027, 12, 3), "stars"), ((2027, 12, 10), "xmas")]
    got = await T.ev(pg, "[" + ",".join(f"w111MusicEvent(new Date({y}, {m - 1}, {d}, 12))" for (y, m, d), _ in cases) + "]")
    T.check("musica dell'evento giusta per data (Lanterne, Natale 8/12-6/1, Nuovo inizio 7-31/1, Stelle, Aquiloni, repliche)", got == [w for _, w in cases], list(zip([c[0] for c in cases], got)))
    r = await T.ev(pg, "SND.EV_IDS.slice().sort()")
    T.check("cinque brani degli eventi", r == ["fresh", "kites", "lanterns", "stars", "xmas"], r)
    # partitura: ogni battuta piena, giro di 32 battute, ultima battuta dominante che risolve sulla prima
    r = await T.ev(pg, """SND.EV_IDS.map((id) => { const i = SND.evInfo(id); const okM = i.M.every((b) => b.len === i.per) && i.C.every((b) => b.len === i.per);
      return [id, okM, i.M.length, i.bars, i.pass === i.bars * i.per]; })""")
    T.check("partiture: 16 battute di melodia e controcanto, tutte complete; giro di 32 battute", all(x[1] and x[2] == 16 and x[3] == 32 and x[4] for x in r), r)
    r = await T.ev(pg, "SND.EV_IDS.map((id) => { const i = SND.evInfo(id); return [id, i.ch[15], i.ch[0]]; })")
    T.check("ultima battuta = dominante (V o V7) che porta alla prima", all(x[1].startswith(("A7", "D7", "G7", "C7")) for x in r), r)
    # durata del giro: tra 60 e 120 secondi (non troppo corto: non stanca)
    r = await T.ev(pg, "SND.EV_IDS.map((id) => { const i = SND.evInfo(id); return [id, Math.round(i.pass * i.step)]; })")
    T.check("ogni giro dura tra 60 e 120 secondi", all(60 <= x[1] <= 120 for x in r), r)
    await ctx.close()

    # ---------- suono pulito: 6 s all'inizio e 6 s a cavallo della fine del giro ----------
    ctx, pg = await T.page(b, T.base_state("it"), lang="it-IT")
    for id in ("lanterns", "xmas", "fresh", "stars", "kites"):
        inf = await T.ev(pg, f"SND.evInfo('{id}')")
        start = inf["introSteps"]; seam = inf["introSteps"] + inf["pass"] - int(3 / inf["step"])
        for lab, a in (("inizio", start), ("cucitura", seam)):
            r = await T.ev(pg, RENDER + f"('{id}', {a}, 6)")
            T.check(f"{id} ({lab}): nessun valore non numerico, nessun salto di campione, picco sotto 0,5, mai muto", r["nan"] == 0 and r["jump"] == 0 and 0.01 < r["pk"] < 0.5 and r["rms"] > 0.004, r)
    await ctx.close()

    # ---------- comportamento nell'app ----------
    # musica spenta: durante l'evento non suona niente
    st = T.base_state("it"); st["music"] = False
    ctx, pg = await T.page(b, st, lang="it-IT", date=(2026, 12, 10, 10, 0))
    await pg.mouse.click(200, 200); await pg.wait_for_timeout(2500)
    r = await T.ev(pg, "[SND.eventId(), SND.playing(), SND.eventPlaying()]")
    T.check("musica spenta: l'evento e' noto (Natale) ma non suona niente", r == ["xmas", False, False], r)
    await ctx.close()
    # musica accesa: parte la musica dell'evento; scegliendo un brano resta quello; il brano dell'evento si riprende dalla lista
    st = T.base_state("it"); st["music"] = True; st["musicDef"] = 2
    ctx, pg = await T.page(b, st, lang="it-IT", date=(2027, 2, 10, 10, 0))
    await T.close_layer(pg); await pg.mouse.click(200, 300); await pg.wait_for_timeout(2500)
    r = await T.ev(pg, "[SND.eventId(), SND.playing(), SND.eventPlaying(), SND.track()]")
    T.check("musica accesa durante la Stagione delle Stelle: parte il suo brano", r[:3] == ["stars", True, True] and r[3] == -1, r)
    await T.close_layer(pg); await T.ev(pg, "tab = 'more'; render(); psGo('set'); 1"); await pg.wait_for_timeout(500)
    r = await T.ev(pg, "(() => { const b = document.querySelector('[data-evtrack]'); return b ? [b.textContent, b.getAttribute('aria-pressed'), b.parentElement.firstElementChild === b] : null; })()")
    T.check("Profilo > Suoni: primo brano con il nome dell'evento, segnato come in riproduzione", r and "Stagione delle Stelle" in r[0] and r[1] == "true" and r[2], r)
    await T.ev(pg, "(() => { const b = document.querySelector('[data-track=\"4\"]'); if (b) b.click(); return 1; })()"); await pg.wait_for_timeout(800)
    r = await T.ev(pg, "[SND.eventPlaying(), SND.track(), SND.playing()]")
    T.check("scelto un altro brano: suona quello (l'evento non lo sovrascrive)", r == [False, 4, True], r)
    await T.ev(pg, "w111MusicSync(); 1"); await pg.wait_for_timeout(300)
    T.check("ricontrollando l'evento il brano scelto resta", await T.ev(pg, "SND.track()") == 4)
    await T.ev(pg, "document.querySelector('[data-evtrack]').click(); 1"); await pg.wait_for_timeout(800)
    T.check("toccando il brano dell'evento si torna alla sua musica", await T.ev(pg, "SND.eventPlaying()"))
    await T.close_layer(pg); await T.ev(pg, "document.querySelector('[data-evtrack]').scrollIntoView({ block: 'center' }); 1"); await pg.wait_for_timeout(400)
    T.check("il brano dell'evento si vede in Impostazioni (Suoni)", await T.ev(pg, "(() => { const r = document.querySelector('[data-evtrack]').getBoundingClientRect(); return r.width > 40 && r.top > 0 && r.bottom < innerHeight; })()"))
    await pg.screenshot(path=os.path.join(os.environ.get("T111_SHOTS", "/dev/shm/t111shots"), "suoni_stelle_it.png"))
    await T.ev(pg, "document.getElementById('musSw').click(); 1"); await pg.wait_for_timeout(800)
    T.check("spegnendo la musica si ferma anche quella dell'evento", await T.ev(pg, "[SND.playing(), SND.eventPlaying()]") == [False, False])
    T.check("nessun errore", not pg.errs, pg.errs[:3])
    await ctx.close()
    # cambio di evento a musica accesa (6 -> 7 gennaio): si passa da Natale a Nuovo inizio senza fermarsi
    st = T.base_state("it", day="2027-01-06"); st["music"] = True; st["musicDef"] = 2
    ctx, pg = await T.page(b, st, lang="it-IT", date=(2027, 1, 6, 23, 59))
    await T.close_layer(pg); await pg.mouse.click(200, 300); await pg.wait_for_timeout(2000)
    a = await T.ev(pg, "SND.eventId()")
    await T.ev(pg, "window.__shift(2 * 60000); w111MusicSync(); 1"); await pg.wait_for_timeout(800)
    r = await T.ev(pg, "[SND.eventId(), SND.eventPlaying(), SND.playing()]")
    T.check("a mezzanotte del 7 gennaio la musica passa da Natale a Nuovo inizio", a == "xmas" and r == ["fresh", True, True], [a, r])
    await ctx.close()
    # spegnere le luci (nanna) mette la ninna nanna anche durante un evento
    st = T.base_state("it"); st["music"] = True; st["musicDef"] = 2
    ctx, pg = await T.page(b, st, lang="it-IT", date=(2026, 11, 20, 21, 0))
    await T.close_layer(pg); await pg.mouse.click(200, 300); await pg.wait_for_timeout(1500)
    await T.ev(pg, "SND.skip(3); 1"); await pg.wait_for_timeout(500)
    T.check("ninna nanna con le luci spente (anche durante le Lanterne)", await T.ev(pg, "[SND.eventPlaying(), SND.track()]") == [False, 3])
    await ctx.close()

T.run(main)
