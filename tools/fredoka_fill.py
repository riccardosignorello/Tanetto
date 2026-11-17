#!/usr/bin/env python3
"""1.0.11: Fredoka non ha alcune lettere del polacco e del turco (ą ć ę ń ś ź ż Ą Ć Ę Ń Ś Ź Ż ğ Ğ ş Ş İ): il telefono le
prendeva da un carattere di sistema, diverso dal resto della parola. Questo strumento costruisce un piccolo font di riserva
per ognuno dei 3 pesi usati (500, 600, 700) con SOLO quelle lettere, fatte con le lettere e gli accenti di Fredoka stessa
(acuto, cediglia, puntino della i); solo l'ogonek e la breve, che Fredoka non ha, vengono da Nunito (gia' nel progetto,
anch'esso a terminazioni tonde) e sono ingrossati per il peso di Fredoka. In fonts.css il font entra nella famiglia
'Fredoka' con un unicode-range limitato a quelle lettere, dichiarato dopo gli altri: tutto il resto non cambia.

Uso: python3 tools/fredoka_fill.py   (scrive fonts/t111-fredoka-fill-{500,600,700}.woff2)"""
import os
from fontTools.ttLib import TTFont, newTable
from fontTools.pens.ttGlyphPen import TTGlyphPen
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.recordingPen import RecordingPen, DecomposingRecordingPen
from fontTools.pens.boundsPen import BoundsPen
from fontTools.fontBuilder import FontBuilder

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
F = lambda n: os.path.join(REPO, "fonts", n)
FILL = "ąćęńśźżĄĆĘŃŚŹŻğĞşŞİ"


def rec(font, name):
    gs = font.getGlyphSet(); p = DecomposingRecordingPen(gs); gs[name].draw(p); return p


def bounds(font, r):
    bp = BoundsPen(font.getGlyphSet()); r.replay(bp); return bp.bounds


def contours(r):
    """divide un RecordingPen nei suoi contorni"""
    out, cur = [], []
    for op, args in r.value:
        cur.append((op, args))
        if op in ("closePath", "endPath"): out.append(cur); cur = []
    return out


def sub(r, keep):
    p = RecordingPen(); p.value = [x for c in keep for x in c]; return p


def bbox_of(cs):
    xs, ys = [], []
    for op, args in cs:
        for pt in args:
            if pt is not None: xs.append(pt[0]); ys.append(pt[1])
    return min(xs), min(ys), max(xs), max(ys)


def build(w):
    fr = TTFont(F(f"fredoka-latin-{w}-normal.woff2"))
    nu = TTFont(F(f"t110-nunito-latin-ext-{700 if w >= 600 else 600}-normal.woff2"))
    cm = fr.getBestCmap(); g = lambda ch: cm[ord(ch)]
    # accenti di Fredoka
    acute = rec(fr, "acutecomb"); ced = rec(fr, "uni0327")
    ab = bounds(fr, acute)
    # puntino: il contorno piu' alto della "i"
    ics = contours(rec(fr, "i")); dot = max(ics, key=lambda c: bbox_of(c)[3]); dotr = sub(None, [dot]); db = bbox_of(dot)
    # accento acuto sulle maiuscole: come in Eacute (A con acuto non e' in questo sottoinsieme)
    eac = fr["glyf"]["Eacute"]; ecomp = [c for c in eac.components if c.glyphName != "E"] if eac.isComposite() else []
    capdy = ecomp[0].y if ecomp else 180
    lowac = fr["glyf"]["eacute"]; lcomp = [c for c in lowac.components if c.glyphName != "e"] if lowac.isComposite() else []
    lowdy = lcomp[0].y if lcomp else 0
    # ogonek e breve da Nunito, ingrossati: si disegnano con un piccolo contorno in piu' (offset) tramite scala orizzontale
    ncm = nu.getBestCmap()
    ne = nu["glyf"][ncm[ord("ę")]]; og_c = [c for c in ne.components if c.glyphName != "e"][0]
    ogon = rec(nu, og_c.glyphName); eb_n = bounds(nu, rec(nu, "e"))
    og_dx_rel = og_c.x  # posizione rispetto alla e di Nunito
    gbr = nu["glyf"][ncm[ord("ğ")]]; br_c = [c for c in gbr.components if c.glyphName != "g"][0]; breve = rec(nu, br_c.glyphName)
    Gbr = nu["glyf"][ncm[ord("Ğ")]]; brC = [c for c in Gbr.components if c.glyphName != "G"][0]; breveC = rec(nu, brC.glyphName)
    thick = {500: 1.10, 600: 1.22, 700: 1.34}[w]

    glyphs, adv = {}, {}

    def make(ch, base, parts):
        pen = TTGlyphPen(None)
        rec(fr, base).replay(pen)
        for r, m in parts: r.replay(TransformPen(pen, m))
        glyphs[ch] = pen.glyph(); adv[ch] = fr["hmtx"][base][0]

    def center_dx(base, mb):
        bb = bounds(fr, rec(fr, base)); return (bb[0] + bb[2]) / 2 - (mb[0] + mb[2]) / 2, bb

    for ch, base in (("ć", "c"), ("ń", "n"), ("ś", "s"), ("ź", "z")):
        dx, _ = center_dx(g(base), ab); make(ch, g(base), [(acute, (1, 0, 0, 1, dx, lowdy))])
    for ch, base in (("Ć", "C"), ("Ń", "N"), ("Ś", "S"), ("Ź", "Z")):
        dx, _ = center_dx(g(base), ab); make(ch, g(base), [(acute, (1, 0, 0, 1, dx, capdy))])
    # puntino: sopra la z alla stessa altezza di quello della i; sopra le maiuscole alzato come l'acuto
    for ch, base, up in (("ż", "z", 0), ("Ż", "Z", 1), ("İ", "I", 1)):
        dx, bb = center_dx(g(base), db)
        dy = 0 if not up else ab[1] + capdy - db[1] + 10  # sulle maiuscole: dove comincia l'acuto delle maiuscole
        make(ch, g(base), [(dotr, (1, 0, 0, 1, dx, dy))])
    # cediglia sotto la s (come la ç di Fredoka)
    cc = fr["glyf"]["ccedilla"]; cco = [c for c in cc.components if c.glyphName == "uni0327"][0]
    cb = bounds(fr, rec(fr, "c")); cedb = bounds(fr, ced); ced_rel = (cedb[0] + cedb[2]) / 2 + cco.x - (cb[0] + cb[2]) / 2
    for ch, base in (("ş", "s"), ("Ş", "S")):
        bb = bounds(fr, rec(fr, g(base))); dx = (bb[0] + bb[2]) / 2 + ced_rel - (cedb[0] + cedb[2]) / 2
        make(ch, g(base), [(ced, (1, 0, 0, 1, dx, 0))])
    # ogonek: in basso a destra, come in Nunito (rispetto al bordo destro della lettera)
    ogb = bounds(nu, ogon)
    rel = (ogb[0] + og_dx_rel) - eb_n[2]
    for ch, base in (("ą", "a"), ("ę", "e"), ("Ą", "A"), ("Ę", "E")):
        bb = bounds(fr, rec(fr, g(base))); x0 = bb[2] + rel * thick - ogb[0] * thick
        if ch in "ĄĘ": x0 -= 40
        make(ch, g(base), [(ogon, (thick, 0, 0, thick, x0, (1 - thick) * ogb[3]))])
    # breve: sopra la g e la G, centrata, un po' piu' spessa
    for ch, base, br in (("ğ", "g", breve), ("Ğ", "G", breveC)):
        bb_br = bounds(nu, br); dx, bb = center_dx(g(base), (bb_br[0] * thick, 0, bb_br[2] * thick, 0))
        top_ref = bounds(fr, rec(fr, "acutecomb"))[1] + (lowdy if ch == "ğ" else capdy)
        dy = top_ref - bb_br[1] * thick
        make(ch, g(base), [(br, (thick, 0, 0, thick, dx, dy))])

    order = [".notdef"] + [f"u{ord(c):04X}" for c in FILL]
    fb = FontBuilder(1000, isTTF=True); fb.setupGlyphOrder(order)
    fb.setupCharacterMap({ord(c): f"u{ord(c):04X}" for c in FILL})
    nd = TTGlyphPen(None); nd.moveTo((0, 0)); nd.lineTo((0, 1)); nd.lineTo((1, 1)); nd.closePath()
    gl = {".notdef": nd.glyph()}; gl.update({f"u{ord(c):04X}": glyphs[c] for c in FILL})
    fb.setupGlyf(gl)
    mt = {".notdef": (500, 0)}
    for c in FILL:
        n = f"u{ord(c):04X}"; gl[n].recalcBounds(fb.font["glyf"]) if hasattr(gl[n], "recalcBounds") else None
        mt[n] = (adv[c], getattr(gl[n], "xMin", 0))
    fb.setupHorizontalMetrics(mt)
    hh = fr["hhea"]; fb.setupHorizontalHeader(ascent=hh.ascent, descent=hh.descent)
    os2 = fr["OS/2"]
    fb.setupOS2(sTypoAscender=os2.sTypoAscender, sTypoDescender=os2.sTypoDescender, sTypoLineGap=os2.sTypoLineGap,
                usWinAscent=os2.usWinAscent, usWinDescent=os2.usWinDescent, usWeightClass=w, fsSelection=0x40, version=4)
    fb.setupNameTable({"familyName": "Tanetto Fredoka Fill", "styleName": str(w)})
    fb.setupPost(); fb.setupHead(unitsPerEm=1000, created=fr["head"].created, modified=fr["head"].modified)
    fb.font.flavor = "woff2"
    out = F(f"t111-fredoka-fill-{w}.woff2"); fb.save(out); return out


if __name__ == "__main__":
    for w in (500, 600, 700): print(build(w), os.path.getsize(F(f"t111-fredoka-fill-{w}.woff2")))
