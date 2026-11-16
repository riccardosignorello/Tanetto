"""1.0.10: "Condividi il tuo Germo" - nella finestra Foto si sceglie tra la foto e la storia 9:16 (1080x1920)."""
import json, sys, os, base64
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import lib110 as T
SH = "/dev/shm/t110shots"; os.makedirs(SH, exist_ok=True)

async def main(b):
    for lang, loc, name in (("it", "it-IT", "Germo"), ("ja", "ja-JP", "ゲルモ"), ("ru", "ru-RU", "Гермо"), ("de", "de-DE", "Wunderbarerkleinerfreund")):
        st = T.base_state(lang); st["petName"] = name
        ctx, pg = await T.page(b, st, age="adult", lang=loc, native=True)
        await T.close_layer(pg)
        await T.ev(pg, "layer.innerHTML=''; takePhoto(); 1"); await pg.wait_for_timeout(2500)
        tabs = await T.ev(pg, "[...document.querySelectorAll('[data-v110ph]')].map((x) => [x.textContent, x.getAttribute('aria-selected')])")
        T.check(f"{lang}: nella finestra Foto si sceglie Foto / Storia", len(tabs) == 2 and tabs[0][1] == "true", tabs)
        await pg.click("[data-v110ph=story]"); await pg.wait_for_timeout(2500)
        r = await T.ev(pg, "(async () => { const im = document.getElementById('photoImg'); await im.decode().catch(() => {}); return [im.naturalWidth, im.naturalHeight, im.src.slice(0, 22), document.querySelector('[data-shareimg]').dataset.shareimg, Math.round(im.getBoundingClientRect().height), innerHeight]; })()")
        T.check(f"{lang}: storia 1080x1920 PNG, condivisa come tanetto-storia.png, non piu' alta dello schermo", r[0] == 1080 and r[1] == 1920 and r[2] == "data:image/png;base64," and r[3] == "tanetto-storia.png" and r[4] <= r[5] * 0.7, r)
        png = await T.ev(pg, "document.getElementById('photoImg').src")
        open(f"{SH}/story_{lang}.png", "wb").write(base64.b64decode(png.split(",", 1)[1]))
        await pg.screenshot(path=f"{SH}/story_dialog_{lang}.png")
        await pg.click("[data-v110ph=photo]"); await pg.wait_for_timeout(800)
        r2 = await T.ev(pg, "[document.getElementById('photoImg').naturalHeight, document.querySelector('[data-shareimg]').dataset.shareimg]")
        T.check(f"{lang}: si torna alla foto di prima", r2 == [1200, "tanetto-foto.png"], r2)
        T.check(f"{lang}: nessun errore", not pg.errs, pg.errs[:3])
        await ctx.close()

    # condivisione: testo con link di origine share_germo e hashtag (app Android, plugin finto)
    st = T.base_state("it"); st["petName"] = "Biscotto"
    ctx, pg = await T.page(b, st, age="adult", lang="it-IT", native=True, extra_js="window.Capacitor.Plugins.TanettoShare = { share: async (o) => { window.__sh = o; return {}; } };")
    await T.close_layer(pg); await T.ev(pg, "layer.innerHTML=''; takePhoto(); 1"); await pg.wait_for_timeout(2500)
    await pg.click("[data-v110ph=story]"); await pg.wait_for_timeout(2500); await pg.click("[data-shareimg]"); await pg.wait_for_timeout(1500)
    sh = await T.ev(pg, "window.__sh ? { name: window.__sh.name, text: window.__sh.text } : null")
    T.check("condivisione della storia: link Google Play con share_germo, campagna 'storia' e solo #tanettoapp", sh and sh["name"] == "tanetto-storia.png" and "utm_source%3Dshare_germo" in sh["text"] and "utm_campaign%3Dstoria" in sh["text"] and "#tanettoapp" in sh["text"] and "#germo" not in sh["text"], sh)
    await ctx.close()
    # bambini ed eta' non detta: niente storia; ragazzi si'; nome personale solo per gli adulti
    for age, want in (("child", False), ("none", False), ("teen", True)):
        st = T.base_state("it"); st["petName"] = "Biscotto"
        ctx, pg = await T.page(b, st, age=age, lang="it-IT")
        await T.close_layer(pg); await T.ev(pg, "layer.innerHTML=''; takePhoto(); 1"); await pg.wait_for_timeout(2500)
        has = await T.ev(pg, "!!document.querySelector('[data-v110ph]')")
        T.check(f"eta' {age}: scelta della storia {'presente' if want else 'assente'}", has == want, has)
        if want:
            await pg.click("[data-v110ph=story]"); await pg.wait_for_timeout(2500)
            png = await T.ev(pg, "document.getElementById('photoImg').src"); open(f"{SH}/story_teen.png", "wb").write(base64.b64decode(png.split(",", 1)[1]))
        await ctx.close()

    # ragazzo di 15 anni (in Italia ageBand lo considera gia' "adult"): storia si', ma nel disegno il nome normale, mai quello scelto
    FT = "window.__ft = []; const _ft = CanvasRenderingContext2D.prototype.fillText; CanvasRenderingContext2D.prototype.fillText = function (t, ...a) { window.__ft.push(String(t)); return _ft.call(this, t, ...a); };"
    for age, nm_ok in (({"y": 2011, "m": 3}, "Germo"), ("adult", "Biscotto")):
        st = T.base_state("it"); st["petName"] = "Biscotto"
        ctx, pg = await T.page(b, st, age=age, lang="it-IT", extra_js=FT)
        await T.close_layer(pg); await T.ev(pg, "layer.innerHTML=''; takePhoto(); 1"); await pg.wait_for_timeout(2500)
        await T.ev(pg, "window.__ft = []; 1"); await pg.click("[data-v110ph=story]"); await pg.wait_for_timeout(2500)
        ft = await T.ev(pg, "window.__ft")
        T.check(f"storia ({'15 anni' if nm_ok == 'Germo' else 'adulto'}): nel disegno il nome {nm_ok}, 'Tanetto' una volta e dove trovarlo", nm_ok in ft and ("Biscotto" in ft) == (nm_ok == "Biscotto") and ft.count("Tanetto") == 1 and "su Google Play" in ft, ft)
        await ctx.close()
    # bambino ed eta' non detta: la foto si condivide come prima, senza link di origine ne' hashtag
    for age in ("child", "none"):
        st = T.base_state("it"); st["petName"] = "Biscotto"
        ctx, pg = await T.page(b, st, age=age, lang="it-IT", native=True, extra_js="window.Capacitor.Plugins.TanettoShare = { share: async (o) => { window.__sh = o; return {}; } };")
        await T.close_layer(pg); await T.ev(pg, "layer.innerHTML=''; takePhoto(); 1"); await pg.wait_for_timeout(2500)
        btn = await T.ev(pg, "!!document.querySelector('[data-shareimg]')")
        if btn:
            await pg.click("[data-shareimg]"); await pg.wait_for_timeout(1500)
        sh = await T.ev(pg, "window.__sh ? (window.__sh.text || '') : ''")
        T.check(f"eta' {age}: condivisione senza share_germo e senza hashtag", "share_germo" not in sh and "#tanettoapp" not in sh, [btn, sh])
        await ctx.close()

    # "Valuta Tanetto su Google Play": solo adulti, solo nell'app
    for age, nat, want in (("adult", True, True), ("child", True, False), ({"y": 2011, "m": 3}, True, False), ("adult", False, False)):
        ctx, pg = await T.page(b, T.base_state("it"), age=age, lang="it-IT", native=nat)
        await T.close_layer(pg); await T.ev(pg, "tab = 'more'; render(); 1")
        r = await T.ev(pg, "(() => { const a = document.getElementById('v110Rate'); return a ? [a.getAttribute('href'), a.getAttribute('target')] : null; })()")
        T.check(f"Valuta Tanetto ({age}, {'app' if nat else 'sito'}): {'presente, apre la scheda di Google Play' if want else 'assente'}", (r is not None and "id=com.tanettoapp.tanetto" in r[0] and r[1] == "_blank") if want else r is None, r)
        await ctx.close()

T.run(main)
