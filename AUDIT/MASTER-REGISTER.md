# Tanetto — audit integrale e registro di continuità

Ultimo aggiornamento: 2026-11-20 22:10 UTC

## Scopo e regole non negoziabili

Questo ramo contiene esclusivamente documentazione di audit e continuità fino alla chiusura dell'audit. Non modificare codice applicativo, configurazioni operative, contenuti o release durante la fase di inventario, salvo autorizzazione esplicita successiva e piano completo approvato.

- Repository originale intatto: lavorare solo sul fork `riccardosignorello/Tanetto`.
- Ramo di lavoro applicativo di riferimento: `work/tanetto-1.0.12`.
- Baseline verificata al momento dell'apertura del registro: commit `07c55c6d8d5613c6a18760308df10d5d9a75a570`.
- Ramo isolato già esistente per il lavoro age-gate: `work/tanetto-1.0.12-agegate-fix`. Non integrarlo prima dell'audit completo.
- Questo registro è su `audit/tanetto-full-review`; non è una modifica al prodotto.
- Prima fase: audit completo senza patch. Seconda: inventario unico dei problemi e piano con dipendenze. Terza: correzioni coordinate. Quarta: due verifiche complete indipendenti. Quinta: release solo dopo esito positivo.
- Ogni affermazione deve essere classificata come verificata, probabile, da verificare o non applicabile. Non trasformare un sospetto in bug confermato.
- Ogni sessione deve aggiornare questo registro e salvare il punto di ripartenza prima di fermarsi.
- L'assistente deve proseguire autonomamente finché può; chiedere l'intervento dell'utente solo per decisioni, autorizzazioni, credenziali o azioni realmente eseguibili soltanto dall'utente.
- Non promettere esecuzione in background dopo la fine di una sessione. La continuità è garantita dal registro Git e dai checkpoint.
- L'utente vuole aggiornamenti solo a traguardi concreti, niente messaggi di stato ripetitivi.

## Ambito dell'audit (copertura richiesta)

1. Cronologia Git, baseline, contributi precedenti e modifiche introdotte dal lavoro precedente (non attribuire responsabilità senza evidenze).
2. Architettura e qualità del codice; moduli, dipendenze, build, generazione artefatti.
3. Funzionalità complete dell'app e flussi end-to-end.
4. Esperienza utente, accessibilità, onboarding, localizzazione e coerenza visiva.
5. Età, minori, consenso, protezione, parental safeguards e policy store.
6. Sicurezza client/server, autenticazione, autorizzazione, Firestore, Firebase, App Check, segreti, backup, anti-abuso.
7. Privacy, dati, retention, esportazione, cancellazione, informative e dichiarazioni store.
8. Ads, rewarded ads, acquisti, abbonamenti, Tanì/economia, premi, ricompense e anti-frode.
9. Account, sincronizzazione, backup/ripristino, notifiche, widget, analytics e telemetria.
10. Prestazioni, stabilità, accessibilità, compatibilità Android e dispositivi.
11. Test automatici/manuali, CI/CD, qualità delle prove, flaky test e copertura.
12. Distribuzione, signing, Play Console, release process e rollback.
13. Sito, landing/app page, performance, SEO, analytics, conversione e contenuti.
14. Brand, personaggi, direzione artistica, social, video, animazione, PR, campagne, lancio e crescita.
15. Documentazione, manutenzione, osservabilità, costi, sostenibilità e roadmap.

## Stato verificato all'apertura del registro

### Dati repository
- Fork: `riccardosignorello/Tanetto`.
- Ramo applicativo: `work/tanetto-1.0.12`.
- Commit di riferimento: `07c55c6d8d5613c6a18760308df10d5d9a75a570`.
- Il repository è stato enumerato via GitHub API: circa 981 file nel tree ricorsivo (conteggio della scansione precedente; da riconfermare se cambia la baseline).
- L'originale non deve essere modificato.
- Il file ZIP allegato dall'utente è stato indicato come la copia corretta `Tanetto-work-tanetto-1.0.12-agegate-fix.zip`; non risulta montato nel runtime attuale. I controlli in corso usano il repository GitHub, non si deve affermare che lo ZIP sia stato estratto localmente.

### Correzioni CI già presenti sul ramo applicativo (da verificare nell'audit, non da considerare automaticamente definitive)
- Mock del plugin età in `tests/t110/lib110.py`.
- Gestione robusta exit code/log in `tests/t110/run_n111_rules.sh`.
- Test Firestore emulator in workflow.
- Suddivisione suite nativa/browser in parti A/B/S/C/D/P.
- Controllo che gli snapshot widget non siano modificati implicitamente.
- Test Robolectric per widget.

### Stato CI storico noto (da aggiornare con run attuali)
- 190 controlli nativi/browser risultavano passati.
- Nove file di test della suite generale risultavano falliti: `t_110_decisions.py`, `t_110_story.py`, `t_111_audience.py`, `t_111_events.py`, `t_111_icons.py`, `t_111_week.py`, `t_113_kids_noads.py`, `t_b1_minors.py`, `t_b2_money.py`.
- Snapshot widget con differenza di un'ora; test Robolectric saltati in conseguenza del fallimento.
- Compilazione Android, AgePolicy, strumenti, build, 14 lingue e Firestore emulator risultavano passati.
- Questi sono risultati storici, non lo stato attuale. Ogni causa deve essere riprodotta e diagnosticata prima di classificarla.

### Rischi e anomalie preliminari da verificare (non ancora inventario completo)
- Informativa privacy dichiara che il backup Google include l'età, mentre l'implementazione Android la salva in `getNoBackupFilesDir()` ed esclude la directory dai backup. Verificare tutte le copie e i flussi.
- Workflow CI dichiara `contents: write` e committa/pusha artefatti anche in contesti da valutare, inclusi eventi pull request. Riesaminare minimo privilegio e sicurezza.
- Invito amici: regole server sembrano verificare un intervallo temporale minimo di 36 ore, mentre il client richiede tre giorni distinti di utilizzo; impronta dispositivo fornita dal client. Valutare integrità e anti-abuso.
- App Check predisposto per Play Integrity ma disattivato senza Firebase Android app ID/config; verificare protezione effettiva di ogni endpoint.
- `prova.keystore` è presente nel repository ed è una chiave di prova con credenziali standard; non è prova di esposizione della chiave release. Verificare che non possa essere usata per release distribuite.
- `README.md` quasi vuoto; `app-android/package.json` contiene script test placeholder (da valutare nel contesto).
- Configurazione di signing Gradle contiene un percorso locale `/home/claude/chiavi`; verificare portabilità e segreti senza chiedere credenziali.
- `sitemap.xml` non include `/app/`; verificare struttura e strategia SEO.
- `privacy.html` parte con `lang="en"` e contiene possibili contraddizioni su dati locali, backup e video premio per utenti senza età dichiarata.
- Non sono state ancora esaminate tutte le funzionalità né tutte le aree. Le note sopra sono solo indicatori preliminari.

### Modifiche age-gate già preparate su ramo isolato (da sottoporre ad audit)
- Correzioni in `98zk_v26_fix.js`, `98zl_v110_safety.js`, `98zh_v23_profile.js`, `98zi_v24_fix.js`, `98zm_v110_decisions.js`.
- Test regressione minori in `tests/t110/t_b1_minors.py`.
- Branch `work/tanetto-1.0.12-agegate-fix`; non integrato nel ramo principale al checkpoint.
- CI storica del branch feature non verde come sopra.

## Registro problemi

| ID | Area | Osservazione | Stato | Gravità provvisoria | Prossimo controllo |
|---|---|---|---|---|---|
| AUD-001 | Privacy/backup età | Possibile incoerenza tra informativa e implementazione backup | Da verificare | Alta | Cercare tutte le copie dell'età e confrontare ogni piattaforma/flusso |
| AUD-002 | CI/sicurezza supply chain | Permessi write e push artefatti nel workflow | Configurazione osservata; impatto da valutare | Alta | Analizzare trigger, token, fork PR, branch protection e permessi effettivi |
| AUD-003 | Firebase/anti-abuso | Differenza tra requisito client 3 giorni e controllo server 36 ore | Da verificare | Alta | Tracciare intero flusso, callable/function, regole, premi e attaccante |
| AUD-004 | Backend/App Check | App Check disattivato in assenza configurazione app | Configurazione osservata | Alta | Inventariare endpoint e controlli server effettivi |
| AUD-005 | Signing | Keystore di prova presente nel repository | Presenza segnalata, uso da verificare | Alta | Tracciare build variant, signing config, workflow e artefatti pubblicabili |
| AUD-006 | Privacy | Contraddizioni su dati locali/backup e rewarded video senza età | Da verificare | Alta | Confrontare informative, codice, SDK, Play Data Safety e consenso |
| AUD-007 | Test | Nove file suite generale falliti e snapshot orario differente | Risultato CI storico | Alta | Riprodurre ciascun fallimento e classificare causa |
| AUD-008 | Build/release | Percorso signing locale non portabile | Configurazione osservata | Media | Verificare configurazioni debug/release e pipeline |
| AUD-009 | Documentazione | README quasi vuoto e script npm placeholder | Presenza segnalata | Bassa | Valutare documentazione minima e comandi reali |
| AUD-010 | SEO | Sitemap senza /app/ | Da verificare | Media | Confrontare pagine canoniche, robots, sitemap, indexabilità |

## Percentuale e criteri di avanzamento

Ultima stima complessiva comunicata: 40%. È una stima del percorso verso l'ecosistema completo, non una misura delle righe di codice o della sola release. Non aumentarla per semplice lettura o per modifiche non testate. Aggiornare soltanto dopo milestone dimostrabili. Il 100% richiede:
- inventario e piano completi;
- correzioni implementate e revisionate;
- due cicli indipendenti di verifica completi;
- release e documentazione coerenti;
- piano di crescita/brand/social definito e attività eseguite o chiaramente separate come operative continuative;
- nessun blocco critico o rischio non accettato e documentato.

## Punto di ripartenza preciso

**Fase attuale: AUDIT COMPLETO — sola lettura, nessuna patch applicativa.**

Prossima attività: verificare stato aggiornato dei branch e delle workflow run; quindi continuare l'esame integrale delle funzionalità e dei relativi flussi end-to-end, partendo da account, backup/sincronizzazione, acquisti/economia Tanì e interazioni età/ads/minori. Registrare ogni evidenza con percorso file, funzione/righe, prova, conseguenza, livello di certezza e controlli collegati. Poi coprire tutte le altre aree elencate. Non fermarsi ai primi problemi.

Prima di terminare una sessione:
1. aggiornare questo file con risultati e nuove evidenze;
2. aggiornare stato e prossima attività precisa;
3. registrare commit SHA e run CI consultati;
4. distinguere attività completate da quelle solo avviate;
5. non dichiarare l'audit concluso finché ogni area dell'ambito non è coperta.

## Registro sessioni

### 2026-11-20 — apertura
- Creato il ramo documentale `audit/tanetto-full-review` dal ramo applicativo `work/tanetto-1.0.12`.
- Verificato HEAD del ramo applicativo: `07c55c6d8d5613c6a18760308df10d5d9a75a570`.
- Nessuna modifica al codice applicativo.
- Creato questo registro come fonte persistente per la ripresa tra conversazioni.
