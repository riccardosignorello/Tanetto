"""1.0.11: contrasto MISURATO di ogni scritta visibile (WCAG 2.1 AA): colore calcolato del testo contro il colore di fondo
reale (pixel della schermata, il colore piu' frequente dentro il riquadro dell'elemento). Testo normale 4,5:1, testo grande
(>= 24 px, o >= 18,66 px in grassetto) 3:1. Usato da t_111_polish.py; da solo stampa tutte le scritte sotto soglia."""
import io
from PIL import Image

JS = r"""(() => {
  const out = [], seen = new Set();
  const W = innerWidth, H = innerHeight;
  const tw = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let n;
  while ((n = tw.nextNode())) {
    const t = n.textContent.replace(/\s+/g, " ").trim(); if (!t || t.length < 2 || !/[\p{L}\p{N}]/u.test(t)) continue;
    const e = n.parentElement; if (!e || seen.has(e)) continue; seen.add(e);
    if (e.closest("svg, [aria-hidden='true'], .sr-only, .vh, script, style, noscript")) continue;
    const cs = getComputedStyle(e); if (cs.visibility === "hidden" || cs.display === "none") continue;
    let op = 1, a = e; while (a && a !== document.documentElement) { op *= +getComputedStyle(a).opacity; a = a.parentElement; } if (op < 0.98) continue;
    const rg = document.createRange(); rg.selectNodeContents(n); const r = rg.getBoundingClientRect();
    if (r.width < 3 || r.height < 6 || r.top < 0 || r.left < 0 || r.bottom > H || r.right > W) continue;
    const top = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2); if (!top || !(top === e || e.contains(top) || top.contains(e))) continue;
    const fill = cs.webkitTextFillColor && !/rgba\(0, 0, 0, 0\)/.test(cs.webkitTextFillColor) ? cs.webkitTextFillColor : cs.color; let c = fill.match(/[\d.]+/g).map(Number); if (/^color\(srgb/.test(fill)) c = c.map((v, i) => (i < 3 ? v * 255 : v));
    if (c.length > 3 && c[3] === 0) continue;   /* testo a gradiente (background-clip: text): si controlla a parte */
    const fs = parseFloat(cs.fontSize), fw = +cs.fontWeight || 400;
    const btn = !!e.closest("button, .btn, a, [role=button], .tab, .chip, .pill");
    out.push({ t: t.slice(0, 40), x: r.left, y: r.top, w: r.width, h: r.height, c, fs, fw, btn, cls: (e.className && e.className.baseVal === undefined ? e.className : "") + " <" + e.tagName.toLowerCase() + ">" + (e.closest("button,.btn") ? " in:" + (e.closest("button,.btn").id || e.closest("button,.btn").className) : "") });
  }
  return out;
})()"""

def lum(c):
    def ch(x):
        x = x / 255; return x / 12.92 if x <= 0.03928 else ((x + 0.055) / 1.055) ** 2.4
    r, g, b = c[:3]; return 0.2126 * ch(r) + 0.7152 * ch(g) + 0.0722 * ch(b)
def ratio(a, b):
    la, lb = lum(a), lum(b); hi, lo = max(la, lb), min(la, lb); return (hi + 0.05) / (lo + 0.05)

async def measure(pg, only_buttons=False):
    """lista di (rapporto, minimo, elemento) per ogni scritta visibile"""
    items = await pg.evaluate(JS)
    png = await pg.screenshot(scale="css"); im = Image.open(io.BytesIO(png)).convert("RGB"); sx = im.size[0] / (await pg.evaluate("innerWidth"))  # px CSS: meno memoria
    res = []
    for it in items:
        if only_buttons and not it["btn"]: continue
        x0, y0, x1, y1 = int(it["x"] * sx), int(it["y"] * sx), int((it["x"] + it["w"]) * sx), int((it["y"] + it["h"]) * sx)
        if x1 - x0 < 2 or y1 - y0 < 2: continue
        crop = im.crop((x0, y0, x1, y1)); cnt = {}
        c = it["c"]; al = c[3] if len(c) > 3 else 1.0
        for px in crop.getdata():
            if sum(abs(px[k] - c[k]) for k in range(3)) > 40: cnt[px] = cnt.get(px, 0) + 1   # i pixel del testo non sono il fondo
        if not cnt:
            for px in crop.getdata(): cnt[px] = cnt.get(px, 0) + 1
        bg = max(cnt.items(), key=lambda kv: kv[1])[0]
        fg = tuple(round(c[k] * al + bg[k] * (1 - al)) for k in range(3))
        big = it["fs"] >= 24 or (it["fs"] >= 18.66 and it["fw"] >= 700)
        need = 3.0 if big else 4.5
        r = ratio(fg, bg)
        res.append((round(r, 2), need, it, fg, bg))
    return res
