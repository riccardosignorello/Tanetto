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
    # 1.0.10 (E-02): a chi non ha detto l'eta' mai "raddoppia"; la prova del testo per gli adulti usa un adulto
    ("fix109/suites/p3b/t6.py", 'r = await ev(pg, """(() => { const o = {}; S.adsDay = { d: dkey(), n: 0 }; o.g0', 'r = await ev(pg, """(() => { const o = {}; S.age = { y: 1990, m: 5 }; S.adsDay = { d: dkey(), n: 0 }; o.g0', "testo del video per gli adulti"),
    ("fix109/suites/p2b/t3.py", 'txt = await ev(pg, "(() => { const d = document.creat', 'txt = await ev(pg, "(() => { S.age = { y: 1990, m: 5 }; const d = document.creat', "testo del video per gli adulti"),
    # 98zk (D-05/M-06): le tappe d'oro del sentiero hanno il segno v26g (Tanì di Plus contati come pagati)
    ("p2/t2.py", 'r[2] == {"tani": 5} and r[3] == {"tani": 10}', 'r[2] == {"tani": 5} and r[3].get("tani") == 10', "segno v26g delle tappe d'oro"),
    # 1.0.10 (M-09, decisione 16/11/2026): Introvabili 54.000-63.000
    ("fix109/suites/p2b/t3.py", 'min(r["xv"]) == 68000 and max(r["xv"]) == 80000', 'min(r["xv"]) == 54000 and max(r["xv"]) == 63000', "prezzi Introvabili 1.0.10"),
    ("fix109/suites/p2b/t3.py", '"Hai 120 di 68.000 Tanì" in r["furn"][1]', '"Hai 120 di 54.000 Tanì" in r["furn"][1]', "prezzi Introvabili 1.0.10"),
    ("fix109/suites/p2b/t3.py", 'r3["own"] and r3["s"] == 7000 and', 'r3["own"] and r3["s"] == 21000 and', "prezzi Introvabili 1.0.10"),
    # la prima pagina della galleria (it 320) arriva prima che la pubblicita' sia pronta (avvio a freddo): si aspetta il pulsante
    ("fix109/tfix_d.py", 'await pg.wait_for_timeout(900); await shot(pg, f"d/{t}_adgift")', 'await pg.wait_for_timeout(900); await pg.wait_for_function("!!document.querySelector(\\".adbtn\\")", timeout=8000); await ev(pg, "const g = document.getElementById(\\\'adGift\\\'); g && g.scrollIntoView({block:\\\'center\\\'}); 1"); await pg.wait_for_timeout(400); await shot(pg, f"d/{t}_adgift")', "attesa del pulsante del video"),
    # P0 (1.0.10): niente offerta di Plus automatica a chi non ha detto l'eta' -> la prova della finestra usa un adulto
    ("crit/tcrit.py", 'st = base_state(lang); st["firstDay"] = "2026-11-01"\n        ctx, pg = await cpage(b, lang, st, (2026, 11, 12), w=320, h=640, scheme=scheme)', 'st = base_state(lang); st["firstDay"] = "2026-11-01"; st["age"] = {"y": 1990, "m": 5}\n        ctx, pg = await cpage(b, lang, st, (2026, 11, 12), w=320, h=640, scheme=scheme)', "offerta Plus provata con un adulto"),
    # la festa del desiderio arriva 700 ms dopo l'ultimo disegno: con la macchina carica 1,1 s non bastano sempre
    ("fix109/suites/p2b/t3.py", '''36000; save(); layer.innerHTML=''; tab='today'; render(); 1"); await pg.wait_for_timeout(1100)''', '''36000; save(); layer.innerHTML=''; tab='today'; render(); 1"); await pg.wait_for_timeout(2200)''', "attesa della festa"),
    ("p2c/t5.py", '''S.seeds = 18000; save(); tab='today'; render(); 1"); await pg.wait_for_timeout(1100)''', '''S.seeds = 18000; save(); tab='today'; render(); 1"); await pg.wait_for_timeout(2200)''', "attesa della festa"),
    # 1.0.10 (blocco 6, bentornato a livelli): chi torna dopo giorni riceve la scheda del bentornato con la figura del regalo
    ("fix109/suites/p3b/t6.py", 'all(x.startswith("ban/") for x in r[1]), r[1])', 'all(x.startswith("ban/") or x.startswith("m/gift.") for x in r[1]), r[1])', "bentornato con la figura del regalo"),
    ("fix109/t38run5/t38_growth.py", 'await pg.add_init_script("window.__TEST_NOAGE=1;" + js)', 'await pg.add_init_script("window.__TEST_NOAGE=1;" + js + "localStorage.setItem(`tanetto-eta`, JSON.stringify({y: 1990, m: 5}));")', "P0 1.0.10: recensioni e offerte di Plus solo agli adulti, la suite usa un adulto"),
    ("fix109/t38run5/t38_nav.py", 'await pg.add_init_script("window.__TEST_NOAGE=1;" + js)', 'await pg.add_init_script("window.__TEST_NOAGE=1;" + js + "localStorage.setItem(`tanetto-eta`, JSON.stringify({y: 1990, m: 5}));")', "P0 1.0.10: recensioni e offerte di Plus solo agli adulti, la suite usa un adulto"),
    # russo e turco: auguri di Capodanno anche il 31 (adattamento culturale, 4 voci invece di 3)
    ("fix109/t38run5/t38_xmas.py", "Object.keys(x.gr).length !== 3", "Object.keys(x.gr).length < 3", "auguri di Capodanno in ru e tr"),
    # 1.0.10 (M-09): dal terzo video del giorno 6 Tanì: il premio si legge prima, non dopo due video
    ("fix109/t38run5/t38_secure.py", "hit and r == [2, 100 + amt] and amt == 12", "hit and r == [2, 112]", "premio del video letto prima"),
    # 1.0.10 (C-22): un solo nome per "scegli un viaggio"
    ("fix109/t38run5/t38_trips.py", '"Germo può fare una gita breve!" in cta and "Scegli la gita" in cta', '"Germo può fare una gita breve!" in cta and "Scegli il viaggio" in cta', "un solo nome per scegli un viaggio (C-22)"),
    # 1.0.10 (E-04): dopo "Non ora" 5 giorni di pausa (prima 2): al secondo giorno ancora niente offerta
    ("fix109/t38run5/t38_nav.py", 'check("Dopo \'Non ora\' almeno 2 giorni di pausa", due == [False, True], due)', 'check("Dopo \'Non ora\' almeno 5 giorni di pausa (E-04)", due == [False, False], due)', "pausa di 5 giorni tra le offerte di Plus"),
    # 1.0.10 (recensioni, 16/11/2026 sera): su Plus la riga "Plus only adds extras: everything that's free without Plus stays free"
    ("p1/t109.py", 'check("monthly plan (no offer): no trial text at all", "free" not in t.lower() and', 'check("monthly plan (no offer): no trial text at all", "free" not in t.lower().replace("everything that\'s free without plus stays free", "") and', "riga di fiducia su Plus"),
    ("p1/t109.py", 'check("no trial offer from Play (e.g. already used): every trial text hidden", "free" not in t.lower() and', 'check("no trial offer from Play (e.g. already used): every trial text hidden", "free" not in t.lower().replace("everything that\'s free without plus stays free", "") and', "riga di fiducia su Plus"),
    # 1.0.10 (17/11/2026, richiesta del proprietario): Profilo con 4 voci; Impostazioni, Account, Privacy e Acquisti dentro
    # "Impostazioni e account", Aiuto e Informazioni dentro "Aiuto e informazioni". Le 8 pagine sono le stesse: si aprono con psGo.
    ("fix109/tfix_b.py", "await ev(pg, \"document.querySelectorAll('.pmenu .prow')[3].click(); 1\")", "await ev(pg, \"psGo('acct'); 1\")", "profilo a 4 voci"),
    ("fix109/tfix_b.py", "await ev(pg, f\"document.querySelectorAll('.pmenu .prow')[{i}] && document.querySelectorAll('.pmenu .prow')[{i}].click(); 1\")", "await ev(pg, f\"psGo(['prog','comp','set','acct','priv','buy','help','about'][{i}]); 1\")", "profilo a 4 voci"),
    ("fix109/tfix_d.py", "n = await ev(pg, \"document.querySelectorAll('.pmenu .prow').length\")", "n = 8", "profilo a 4 voci"),
    ("fix109/tfix_d.py", "await ev(pg, f\"tab='more'; render(); document.querySelectorAll('.pmenu .prow')[{i}].click(); 1\")", "await ev(pg, f\"tab='more'; render(); psGo(['prog','comp','set','acct','priv','buy','help','about'][{i}]); 1\")", "profilo a 4 voci"),
    ("fix109/tfix_f.py", "n = await ev(pg, \"document.querySelectorAll('.pmenu .prow').length\"); check(f\"Profilo {tag}: 8 pagine\", n == 8, n)", "n = await ev(pg, \"document.querySelectorAll('.pmenu .prow').length\"); check(f\"Profilo {tag}: 8 pagine e 2 gruppi\", n == 10, n); n = 8", "profilo a 4 voci"),
    ("fix109/tfix_f.py", "await pg.locator(\".pmenu .prow\").nth(i).click(); await pg.wait_for_timeout(600)", "await ev(pg, f\"psGo(['prog','comp','set','acct','priv','buy','help','about'][{i}]); 1\"); await pg.wait_for_timeout(600)", "profilo a 4 voci"),
    ("fix109/suites/p3b/t6.py", "check(f\"{l}: Profile menu with 8 pages, titles and subtitles in the language\", len(rows) == 8 and", "check(f\"{l}: Profile menu with 8 pages in 2 groups, titles and subtitles in the language\", len(rows) == 10 and", "profilo a 4 voci"),
    ("fix109/suites/p3b/t6.py", "await pg.locator(f'.prow[data-psub=\"{k}\"]').click(); await pg.wait_for_timeout(450)", "await ev(pg, f\"(V110_PARENT['{k}'] ? psGo(V110_PARENT['{k}']) : 1)\"); await pg.wait_for_timeout(300); await pg.locator(f'.prow[data-psub=\"{k}\"]').click(); await pg.wait_for_timeout(450)", "profilo a 4 voci"),
    ("fix109/suites/p3b/t6.py", "check(f\"{l}: phone Back from '{k}' returns to the Profile menu\", r == [None, \"more\", True], r)", "check(f\"{l}: phone Back from '{k}' returns to its group or to the Profile menu\", r[1] == \"more\" and r[0] in (None, \"g_set\", \"g_help\"), r); await ev(pg, \"psGo(null); 1\"); await pg.wait_for_timeout(250)", "profilo a 4 voci"),
    ("fix109/suites/p3b/t6.py", "await pg.locator('.prow[data-psub=\"set\"]').click(); await pg.wait_for_timeout(300)\n    await pg.locator(\".psback:visible\").click(); await pg.wait_for_timeout(300)\n    check(\"on-screen back arrow returns to the menu, focus back on the row\", await ev(pg, \"moreSub === null && document.activeElement && document.activeElement.dataset.psub === 'set'\"))\n    await pg.locator('.prow[data-psub=\"acct\"]').click(); await pg.wait_for_timeout(300)",
     "await pg.locator('.prow[data-psub=\"g_set\"]').click(); await pg.wait_for_timeout(300)\n    await pg.locator(\".psback:visible\").click(); await pg.wait_for_timeout(300)\n    check(\"on-screen back arrow returns to the menu, focus back on the row\", await ev(pg, \"moreSub === null && document.activeElement && document.activeElement.dataset.psub === 'g_set'\"))\n    await pg.locator('.prow[data-psub=\"g_set\"]').click(); await pg.wait_for_timeout(300); await pg.locator('.prow[data-psub=\"acct\"]').click(); await pg.wait_for_timeout(300)", "profilo a 4 voci"),
]
bad = 0
for f, old, new, why in P:
    p = os.path.join(DST, f)
    if not os.path.exists(p): print("MANCA", f); bad += 1; continue
    s = open(p, encoding="utf-8").read()
    if old not in s: print("NON TROVATO", f, old[:60]); bad += 1; continue
    open(p, "w", encoding="utf-8").write(s.replace(old, new)); print("ok", f, "-", why)
sys.exit(1 if bad else 0)
