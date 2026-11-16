# STATO 1.0.10 (versionCode 110) - per riprendere il lavoro

Ultimo aggiornamento: 16/11/2026 sera. Ramo wip-110 = la 1.0.10 DEFINITIVA (un solo aggiornamento con tutto: sicurezza
+ audit completo della 1.0.9 + decisioni del proprietario del 16/11/2026). Il ramo safety-110 e' stato assorbito (98zl).

File pronti: /mnt/user-data/outputs/upload110/ (AAB, APK universale, mapping, note di rilascio, CHANGES_110.md, SHA256SUMS).
Firmata con la chiave di caricamento della 1.0.9 (SHA-256 76:0E:D4...:17:DA). Da inviare SOLO dopo la pubblicazione della 1.0.9.
Foto 06 dello Store rifatta (14 lingue x telefono, tablet 7 e 10): /mnt/user-data/outputs/store110_foto06/.

Come si lavora: sorgenti in src/, `python3 tools/build.py` (sito) / `--android` (www), poi in app-android: `npx cap sync android`,
android/: `./gradlew bundleRelease assembleRelease` (local.properties: sdk.dir=/home/claude/asdk/sdk, chiavi in /home/claude/chiavi).
Prove: `bash tests/run.sh TAG [suite...]` (t110 = prove nuove; legacy = storiche, attese cambiate apposta in tests/legacy_patches.py).
Una corsa completa supera le 2 ore: dividerla (t110 / fix109 e p* / t38 e lang).

Strati nuovi: 98zl_v110_safety.js (riconoscimento frasi difficili, numeri d'aiuto per Paese, calma, tel:), 98zm_v110_decisions.js
(decisioni 16/11, eta' con conferma e bloccata, avviso memoria piena, etichette, licenze, aiuto sempre a un tocco, testo grande),
11zh_v110.css, 3zzl_v110_privacy.js (backup Android nell'informativa).

Prove finali 16/11/2026: tutte verdi (t110 15 file, storiche fix109/p1/p2/p2b/p2c/p3b/p3c/crit, axe 36 schermate, t38, lingue).
Controlli indipendenti: critico release, controllo finale completo, 3 prove cieche frasi difficili (ultime corrette).
Resta per le prossime versioni: CHANGES_110.md sezione 11.
