"""1.0.10 (M-22c): ogni compagno ha la sua voce (tifo, promemoria, chat di ascolto) in 14 lingue; le frasi di aiuto e quelle di
sola compagnia restano quelle di prima."""
import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import lib110 as T
PETS = ("germo", "ondi", "lumi", "miko", "rufi", "pingo", "dori")
async def main(b):
    ctx, pg = await T.page(b, T.base_state("it"), age="adult", lang="it-IT", native=True)
    r = await T.ev(pg, "(() => { const bad = []; Object.keys(V110_VOICE).forEach((p) => ['cheer', 'notif', 'chat'].forEach((k) => Object.keys(T).forEach((l) => { const a = V110_VOICE[p][k][l]; if (!Array.isArray(a) || a.length !== { cheer: 5, notif: 3, chat: 2 }[k] || a.some((x) => !x || (k === 'notif' && !x.includes('{n}')))) bad.push(p + '/' + k + '/' + l); }))); return [Object.keys(V110_VOICE).length, bad]; })()")
    T.check("7 compagni, 14 lingue, 5 frasi di tifo, 3 promemoria con il nome, 2 risposte di chat", r[0] == 7 and not r[1], r)
    await ctx.close()
    for i, pet in enumerate(PETS):
        lang, loc = (("it", "it-IT"), ("en", "en-US"), ("ja", "ja-JP"), ("de", "de-DE"), ("ru", "ru-RU"), ("ko", "ko-KR"), ("tr", "tr-TR"))[i]
        st = T.base_state(lang, pet=pet); st["notif"] = True
        ctx, pg = await T.page(b, st, age="adult", lang=loc, native=True)
        r = await T.ev(pg, """(async () => { const ch = L().talk.cheer; const own = V110_VOICE[S.pet].cheer[S.lang]; await notifSchedule();
          const ns = (window.__notifs || []).filter((x) => x.id >= 100 && x.id < 116).map((x) => x.body); const vo = V110_VOICE[S.pet].notif[S.lang].map((x) => x.split('{n}').join(S.petName));
          let chat = 0; for (let i = 0; i < 60; i++) { const r = chatReply('qwerty zxcv'); if (V110_VOICE[S.pet].chat[S.lang].includes(r.text)) chat++; }
          const soft = V110_SOFT.map((i) => v110VoiceMsgs(V19N[S.lang].msgs)[i]); const soft0 = V110_SOFT.map((i) => V19N[S.lang].msgs[i]);
          return [own.every((x) => ch.includes(x)), ns.filter((x) => vo.includes(x)).length, chat, JSON.stringify(soft) === JSON.stringify(soft0)]; })()""")
        T.check(f"{pet} ({lang}): tifo con le sue frasi, promemoria suoi nella rotazione, chat di ascolto a volte sua, frasi di sola compagnia invariate", r[0] and r[1] >= 2 and 10 <= r[2] <= 50 and r[3], r)
        r = await T.ev(pg, "(() => { const r = chatReply('qwerty'); sf110Hush(10); return [typeof r.text]; })()")
        T.check(f"{pet}: nessun errore", not pg.errs, pg.errs[:3])
        await ctx.close()
T.run(main)
