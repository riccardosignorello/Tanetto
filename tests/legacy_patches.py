"""1.0.11: aggiorna le attese delle suite storiche (copia in /dev/shm/t110) dove la 1.0.11 cambia apposta il comportamento.
Ogni voce: file, testo vecchio, testo nuovo, motivo (decisione o correzione dell'audit). Se il testo vecchio non c'e' piu',
la voce viene segnalata (non si ignora in silenzio)."""
import os, sys
DST = sys.argv[1] if len(sys.argv) > 1 else "/dev/shm/t110"
P = [
    ("fix109/tfix_a.py", '''check("Android: versionCode 110 e versionName 1.0.10 (1.0.10)", "versionCode 110" in g and 'versionName "1.0.10"' in g)''',
     '''check("Android: versionCode 111 e versionName 1.0.11 (la 1.0.10 e' l'aggiornamento di sola sicurezza)", "versionCode 111" in g and 'versionName "1.0.11"' in g)''',
     "numerazione decisa dal coordinatore"),
    # P0 (1.0.10/1.0.11): nessuna offerta di Plus automatica a chi non ha detto l'eta' -> la prova dei tempi usa un adulto
    ('p1/t109.py', 'st = base_state("en"); st["firstDay"] = "2026-11-01"; st["done"] = ["water"]; st["v20nav"] = {"plus": {"n": 0}}', 'st = base_state("en"); st["firstDay"] = "2026-11-01"; st["done"] = ["water"]; st["v20nav"] = {"plus": {"n": 0}}; st["age"] = {"y": 1990, "m": 5, "at": "2026-11-01"}', 'P0: offerte automatiche solo agli adulti'),
    # 1.0.11: nella prima configurazione (eta' non ancora chiesta) i compagni Plus non si mostrano
    ('p3c/t7.py', 'r = await ev(pg, "(() => { const g = document.querySelector(\'.choose.four\'); return [', 'r = await ev(pg, "(() => { const g = document.querySelector(\'.choose.four\'); if (!g) return null; return [', "P0: niente compagni Plus prima dell'eta'"),
    ('p3c/t7.py', 'check(f"{w} px: Plus companions in {cols} columns, \'looks after\' >= 10.5 px, Plus portraits not bigger than the free ones", r[0] == cols and r[1] >= 10.5 and r[2] <= r[3] + 2, r)', 'check(f"{w} px: prima configurazione con eta\' non ancora detta: niente compagni Plus con la corona (1.0.11, P0)", r is None, r)', 'P0'),
]
bad = 0
for f, old, new, why in P:
    p = os.path.join(DST, f)
    if not os.path.exists(p): print("MANCA", f); bad += 1; continue
    s = open(p, encoding="utf-8").read()
    if old not in s: print("NON TROVATO", f, old[:60]); bad += 1; continue
    open(p, "w", encoding="utf-8").write(s.replace(old, new)); print("ok", f, "-", why)
sys.exit(1 if bad else 0)
