"""Tanetto site: builds the optimized images and fonts in /site (run again only when the Store images change).

Sources: the 1.0.10 Store images (phone, 1080x1920, one folder per language), the app's 3D companions (img/pet,
img/m), the app's postcards (img/pc), the feature graphic (press/files), the official Google Play badges and
Nunito (Russian). Japanese and Korean title fonts are cut to the page text by build.py.
Usage: python3 _site_src/assets.py STORE_DIR BADGE_DIR FONTSOURCE_DIR
"""
import os
import sys

from PIL import Image, ImageDraw

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "site")
CODES = ["en", "it", "de", "es", "fr", "pt", "ja", "ko", "zh", "zht", "ru", "pl", "nl", "tr"]
BADGE = {"en": "en", "it": "it", "de": "de", "es": "es", "fr": "fr", "pt": "pt-br", "ja": "ja", "ko": "ko",
         "zh": "zh-cn", "zht": "zh-tw", "ru": "ru", "pl": "pl", "nl": "nl", "tr": "tr"}
PETS = ["germo", "ondi", "lumi", "miko", "rufi", "pingo", "dori"]


def webp(im, path, w, q=80):
    im = im.resize((w, round(im.height * w / im.width)), Image.LANCZOS)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    im.save(path, "WEBP", quality=q, method=6)


def phone_only(im):
    """The phone of Store image 01, without its caption and background, with transparent rounded corners."""
    crop = im.crop((176, 299, 905, 1844)).convert("RGBA")
    mask = Image.new("L", (crop.width * 4, crop.height * 4), 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, mask.width - 1, mask.height - 1), radius=4 * 70, fill=255)
    crop.putalpha(mask.resize(crop.size, Image.LANCZOS))
    return crop


def main(store, badges, fonts):
    import build
    for c in CODES:
        for n in range(1, 9):
            im = Image.open(f"{store}/{c}/phone/{n:02d}.png").convert("RGB")
            webp(im, f"{OUT}/img/{c}/s{n}-400.webp", 400, 78)
            webp(im, f"{OUT}/img/{c}/s{n}-600.webp", 600, 76)
            if n == 1:
                ph = phone_only(im)
                for w in (320, 480, 640):
                    webp(ph, f"{OUT}/img/{c}/hero-{w}.webp", w, 80)
        webp(Image.open(f"{badges}/badge_{BADGE[c]}.png").convert("RGBA"), f"{OUT}/img/badge-{c}.webp", 400, 90)
    for p in PETS:
        webp(Image.open(f"{ROOT}/img/pet/{p}.webp").convert("RGBA"), f"{OUT}/img/pet-{p}.webp", 240, 82)
    webp(Image.open(f"{ROOT}/img/m/love.webp").convert("RGBA"), f"{OUT}/img/germo-love.webp", 240, 82)
    webp(Image.open(f"{ROOT}/icon-192.png").convert("RGBA"), f"{OUT}/img/icon-80.webp", 80, 85)
    for trips in build.TRIPS.values():
        for k, _n in trips:
            pc = Image.open(f"{ROOT}/img/pc/r_{k}.webp").convert("RGB")
            webp(pc, f"{OUT}/img/pc-{k}.webp", 480, 78)
            webp(pc, f"{OUT}/img/pc-{k}-300.webp", 300, 78)
    scene = Image.open(f"{ROOT}/press/files/tanetto-feature-graphic-no-text.jpg").convert("RGB")
    webp(scene, f"{OUT}/img/scene-1024.webp", 1024, 76)
    webp(scene, f"{OUT}/img/scene-640.webp", 640, 76)
    os.makedirs(f"{OUT}/fonts", exist_ok=True)
    for sub in ("cyrillic", "latin"):
        for w in ("400", "700"):
            with open(f"{fonts}/nunito/files/nunito-{sub}-{w}-normal.woff2", "rb") as a, \
                    open(f"{OUT}/fonts/nunito-{sub}-{w}.woff2", "wb") as b:
                b.write(a.read())


if __name__ == "__main__":
    main(*sys.argv[1:4])
