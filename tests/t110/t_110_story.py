"""1.0.10: "Condividi il tuo Germo" - nella finestra Foto si sceglie tra la foto e la storia 9:16 (1080x1920)."""
import json, sys, os, base64
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import lib110 as T
SH = "/dev/shm/t110shots"; os.makedirs(SH, exist_ok=True)

async def main(b):
    for lang, loc, name in (("it", "it-IT", "Germo"), ("ja", "ja-JP", "ゲルモ"), ("ru", "ru-RU", "Гермо"), ("de", "de-DE", "Wunderbarerkleinerfreund")):
        st = T.base_state(lang); st["petName"] = name
        ctx, pg = await T.page(b, st, age="child", lang=loc)
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

T.run(main)
