#!/usr/bin/env python3
"""1.0.11: immagini del widget della Home (res/drawable-nodpi/wpet_<compagno>_<stato>.webp) dalle pose 3D gia' nell'app
(img/m/<posa>.webp per Germo, img/m/<compagno>/<posa>.webp per gli altri). Stato del giorno -> posa:
todo = wave (saluta: oggi si comincia), part = love (qualcosa e' fatto), done = celebrate (tutto fatto),
free = reading (giorno libero, si riposa), away = depart (in gita). 320 px: basta per un widget 2x2 anche sui telefoni xxxhdpi
(la zona del compagno e' al massimo ~100 dp) e tiene l'APK leggero. Uso: python3 tools/make_widget_art.py"""
import os
from PIL import Image
REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(REPO, "app-android/android/app/src/main/res/drawable-nodpi")
PETS = ["germo", "ondi", "lumi", "miko", "rufi", "pingo", "dori"]
POSE = {"todo": "wave", "part": "love", "done": "celebrate", "free": "reading", "away": "depart"}
os.makedirs(OUT, exist_ok=True)
tot = 0
for p in PETS:
    for st, pose in POSE.items():
        src = os.path.join(REPO, "img/m", f"{pose}.webp" if p == "germo" else f"{p}/{pose}.webp")
        im = Image.open(src).convert("RGBA").resize((320, 320), Image.LANCZOS)
        dst = os.path.join(OUT, f"wpet_{p}_{st}.webp")
        im.save(dst, "WEBP", quality=86, method=6)
        tot += os.path.getsize(dst)
print(f"{len(PETS) * len(POSE)} immagini, {tot // 1024} KB")
