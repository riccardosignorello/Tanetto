"""1.0.10: aggiorna le attese delle suite storiche (copia in /dev/shm/t110) dove la 1.0.10 cambia apposta il comportamento.
Ogni voce: file, testo vecchio, testo nuovo, motivo (decisione o correzione dell'audit). Se il testo vecchio non c'e' piu',
la voce viene segnalata (non si ignora in silenzio)."""
import os, sys
DST = sys.argv[1] if len(sys.argv) > 1 else "/dev/shm/t110"
P = [
    # P0 (1.0.10/1.0.11): nessuna offerta di Plus automatica a chi non ha detto l'eta' -> la prova dei tempi usa un adulto
    ('p1/t109.py', 'st = base_state("en"); st["firstDay"] = "2026-11-01"; st["done"] = ["water"]; st["v20nav"] = {"plus": {"n": 0}}', 'st = base_state("en"); st["firstDay"] = "2026-11-01"; st["done"] = ["water"]; st["v20nav"] = {"plus": {"n": 0}}; st["age"] = {"y": 1990, "m": 5, "at": "2026-11-01"}', 'P0: offerte automatiche solo agli adulti'),
    # 1.0.11: nella prima configurazione (eta' non ancora chiesta) i compagni Plus non si mostrano
    ('p3c/t7.py', 'r = await ev(pg, "(() => { const g = document.querySelector(\'.choose.four\'); return [', 'r = await ev(pg, "(() => { const g = document.querySelector(\'.choose.four\'); if (!g) return null; return [', "P0: niente compagni Plus prima dell'eta'"),
    ('p3c/t7.py', 'check(f"{w} px: Plus companions in {cols} columns, \'looks after\' >= 10.5 px, Plus portraits not bigger than the free ones", r[0] == cols and r[1] >= 10.5 and r[2] <= r[3] + 2, r)', 'check(f"{w} px: prima configurazione con eta\' non ancora detta: niente compagni Plus con la corona (1.0.11, P0)", r is None, r)', 'P0'),
    # 1.0.10 (M-13, decisione 16/11/2026): titolare = Snugbloom Studio – nome dello sviluppatore, Paese, e-mail
    ("fix109/tfix_a.py", '''"Data controller: Snugbloom Studio, Italy." in pv and "About the developer" not in pv and "Titolare del trattamento: Snugbloom Studio, Italia." in pv''',
     '''"Data controller: Snugbloom Studio – " in pv and ", Italy. Contact:" in pv and "About the developer" not in pv and "Titolare del trattamento: Snugbloom Studio – " in pv''',
     "titolare con il nome (M-13)"),
    ("fix109/tfix_b.py", 'await pg.click("#ageGo");', 'await pg.click("#ageGo"); await pg.wait_for_timeout(250); await pg.evaluate("(() => { const b = document.getElementById(`ageOk`); if (b) b.click(); })()");', "eta\' con conferma (G2-10, 16/11/2026)"),
    ("p2b/t4.py", 'await pg.click("#ageGo");', 'await pg.click("#ageGo"); await pg.wait_for_timeout(250); await pg.evaluate("(() => { const b = document.getElementById(`ageOk`); if (b) b.click(); })()");', "eta\' con conferma (G2-10, 16/11/2026)"),
    ("fix109/suites/p2b/t4.py", 'await pg.click("#ageGo");', 'await pg.click("#ageGo"); await pg.wait_for_timeout(250); await pg.evaluate("(() => { const b = document.getElementById(`ageOk`); if (b) b.click(); })()");', "eta\' con conferma (G2-10, 16/11/2026)"),
    ("p2c/t5.py", 'await pg.click("#ageGo");', 'await pg.click("#ageGo"); await pg.wait_for_timeout(250); await pg.evaluate("(() => { const b = document.getElementById(`ageOk`); if (b) b.click(); })()");', "eta\' con conferma (G2-10, 16/11/2026)"),
    # 1.0.10 (critica 1.0.10, punto 10): il paragrafo dei bambini nomina solo AdMob (statistiche sempre spente per loro)
    ("fix109/tfix_a.py", 'pv.count("GoatCounter") >= 28 and', 'pv.count("GoatCounter") >= 14 and', "bambini: solo AdMob"),
]
bad = 0
for f, old, new, why in P:
    p = os.path.join(DST, f)
    if not os.path.exists(p): print("MANCA", f); bad += 1; continue
    s = open(p, encoding="utf-8").read()
    if old not in s: print("NON TROVATO", f, old[:60]); bad += 1; continue
    open(p, "w", encoding="utf-8").write(s.replace(old, new)); print("ok", f, "-", why)
sys.exit(1 if bad else 0)
