# TANETTO — MASTER CONTROL CENTER

Versione: 1.0  
Creato: 21 novembre 2026  
Repository operativo: `riccardosignorello/Tanetto`  
Branch applicativo attuale: `work/tanetto-1.0.12-agegate-fix`  
Branch audit storico: `audit/tanetto-full-review`  
Repository originale: `tanettoapp/Tanetto` — da preservare, nessuna modifica diretta.

> **Questo documento è la fonte ufficiale di verità per stato, piano, avanzamento e ripartenza.** In caso di conflitto con vecchie chat, riepiloghi o checkpoint, prevale questo documento insieme alle evidenze Git/CI più recenti. Le chat non sono un registro di progetto.

## 1. Correzione esplicita della continuità precedente

Le percentuali `70% hardening 1.0.12`, `25%` o `40%` riportate in checkpoint/chat precedenti **non sono metriche validate**: derivavano da stime non calcolate su un inventario completo e con denominatore stabile. Sono quindi ritirate come misure ufficiali. Non vanno ripetute né mediate.

Anche uno stato di CI riportato in un checkpoint è solo una fotografia temporale. Prima di affermare che una prova è passata o che il ramo è pronto, verificare il run e il commit correnti.

Il checkpoint `docs/CONTINUITY_1_0_12.md`, `docs/CONTINUITY_SESSION_2026-11-21.md`, `AUDIT/CONTINUATION.md` e `AUDIT/MASTER-REGISTER.md` restano fonti di evidenze e storia; **non sono fonti concorrenti per la percentuale o lo stato corrente**.

## 2. Regole non negoziabili

1. Mai modificare direttamente `tanettoapp/Tanetto`. Lavoro sul fork personale.
2. Prima di ogni blocco: leggere questo file, verificare branch, HEAD, working tree/ultimi commit e CI. Non fidarsi del solo testo di una chat.
3. Nessuna attività si considera completata perché discussa, pianificata, codificata o committata: servono criterio di accettazione ed evidenza di verifica.
4. Ogni attività ha un ID stabile, area, priorità, dipendenze, stato, criterio di completamento, evidenza (commit/file/test/CI o decisione) e data dell'ultima verifica.
5. Non cancellare o riscrivere la storia. Correggere lo stato con una nuova voce datata e mantenere traccia della decisione precedente.
6. Nessuna percentuale soggettiva. Le percentuali si calcolano solo da deliverable inventariati e pesati, con pesi e denominatore congelati per la milestone.
7. Non confondere audit, implementazione, test, rilascio e progetto complessivo: hanno avanzamenti distinti.
8. Procedere autonomamente in blocchi grandi. Niente messaggi intermedi inutili e niente richieste di “vai avanti” quando si può proseguire.
9. Fermarsi e chiedere l'utente soltanto per credenziali, autorizzazioni, decisioni irreversibili/strategiche o attività che richiedono davvero la sua presenza.
10. Prima di una possibile fine sessione: commit/checkpoint del lavoro reale, aggiornamento di questo file, stato CI e istruzioni esatte per ripartire.
11. Non dichiarare che il lavoro continua in background dopo la fine della chat. Si lavora nella sessione attiva; la continuità fra sessioni è garantita dal repository.
12. Prima di integrare branch divergenti, creare un piano di merge esplicito, controllare antenati/diff e preservare tutti i contenuti. Mai merge alla cieca.

## 3. Metodo per stato e avanzamento

### Stati ammessi
- `NOT_STARTED`: non iniziata.
- `IN_PROGRESS`: lavoro avviato, non concluso.
- `BLOCKED_USER`: serve una specifica azione/decisione dell'utente; indicarla chiaramente.
- `BLOCKED_EXTERNAL`: dipendenza esterna non controllabile; indicare prova e alternativa.
- `DONE_UNVERIFIED`: implementata/documentata ma verifica indipendente mancante.
- `VERIFIED`: criterio di completamento soddisfatto con evidenza riproducibile.
- `ACCEPTED`: verifica superata e decisione di prodotto/legale/utente acquisita quando necessaria.
- `DEFERRED`: rinviata con motivazione e dipendenze esplicite.
- `NOT_APPLICABLE`: esclusa con motivazione documentata.

### Regola di completamento
Un task può essere `VERIFIED` solo se:
- il perimetro è definito;
- la modifica o l'analisi è tracciata;
- il test/controllo corrispondente è passato;
- non restano regressioni note collegate;
- l'evidenza punta a commit, file, run CI, report o decisione riproducibile.

Un test verde isolato non chiude un'area. Un audit senza correzione non chiude un finding. Un commit non equivale a un rilascio.

### Percentuali
Non pubblicare una percentuale globale finché non è completato l'inventario WBS (work breakdown structure) e non sono assegnati pesi approvati a tutti i deliverable.

Quando pronto:
- ogni deliverable riceve un peso da 1 a 5 motivato per impatto/complessità;
- avanzamento task: 0 per NOT_STARTED/BLOCKED; 0.25 per IN_PROGRESS; 0.5 per DONE_UNVERIFIED; 1 solo per VERIFIED/ACCEPTED; DEFERRED e NOT_APPLICABLE escono dal denominatore solo con motivazione e approvazione registrata;
- percentuale area = somma(peso × avanzamento) / somma(pesi inclusi);
- percentuale progetto = stessa formula sull'intero inventario, non media semplice delle percentuali delle aree;
- pubblicare sempre data, commit di riferimento, denominatore, numero di task e distribuzione stati.
Le percentuali di audit, hardening 1.0.12, release e ecosistema 360° restano separate.

## 4. Stato tecnico verificato all'apertura del Control Center

**Verifica GitHub eseguita il 21/11/2026 durante la sessione:**
- Repository personale raggiungibile e scrivibile tramite GitHub connector.
- Branch `work/tanetto-1.0.12-agegate-fix` HEAD dopo il commit di questo Control Center: `<HEAD_TO_FILL>`.
- Branch `audit/tanetto-full-review` HEAD osservato: `f55e7cdeee217b75a19c4d52ad7ec725ae25e6b6`.
- Il documento di checkpoint sessione è `docs/CONTINUITY_SESSION_2026-11-21.md`.
- Nessun merge verso originale o rilascio è stato effettuato in questa sessione.

### CI run 66
- Run: https://github.com/riccardosignorello/Tanetto/actions/runs/44836465630
- Run number: 66; commit testato: `9c3c75910f6ebae8e78c4cac7c607674b6cf05a1`.
- Ultima lettura API: `in_progress`; job `test` in corso; step `Prove 1.0.11` in corso.
- Passati in quel run: toolchain, sincronizzazione Capacitor, compilazione Java Android, test unitari AgePolicy, build e sincronizzazione artefatti, controlli 14 lingue, regole Firestore emulator.
- In coda al momento della lettura: test widget Android/Robolectric.
- Non ci sono prove che il run sia concluso. Ricontrollare lo stato prima di procedere o dichiarare esiti.
- Il tentativo di scaricare il log del job tramite il connettore ha restituito 404 BlobNotFound; non dedurre da ciò che il job sia fallito. Cercare una modalità alternativa di conservazione log/artifact nel workflow.

## 5. Piano generale — work breakdown structure

Questa è la struttura di primo livello. Ogni area deve essere scomposta in task atomici con ID nel registro operativo prima di assegnare percentuali.

| Area | ID | Deliverable di uscita |
|---|---|---|
| Governance e baseline | GOV | repository/branch canonici, inventario file e dipendenze, piano versionato, checkpoint affidabili |
| Audit funzionale | AUD-F | mappa completa di feature, flussi, edge case, bug e criteri di accettazione |
| Architettura e codice | ENG | architettura coerente, qualità, modularità, error handling, manutenibilità |
| Sicurezza | SEC | threat model, segreti, auth/authz, Firebase, App Check, anti-abuso, supply chain, test |
| Privacy e minori | PRIV | data map, GDPR/mercati, età/consenso, backup, retention, cancellazione, store disclosures |
| Economia e monetizzazione | ECON | Tanì, acquisti, abbonamenti, reward, referral, contabilità atomica/idempotente e anti-frode |
| UX e accessibilità | UX | onboarding, navigazione, accessibilità, responsive, localizzazione, usabilità validata |
| Gameplay e contenuti | GAME | giochi, mondi, progressi, eventi, personaggi, animazioni, audio, contenuti |
| Android e piattaforme | PLAT | build debug/release, device matrix, widget, notifiche, share, PWA, compatibilità |
| Test e CI/CD | QA | test unit/integration/e2e, emulatori, device reali, artifact, scanning, pipeline riproducibile |
| Sito e SEO | WEB | sito/app separati correttamente, SEO tecnico/editoriale, performance, privacy, conversione |
| Brand e prodotto | BRAND | ricerca utenti/mercato, posizionamento, identità, personaggi e design system |
| Marketing e crescita | GROW | store listing, ASO, funnel, analytics, contenuti, community, PR, retention |
| Release e operations | REL | signing sicuro, release checklist, rollback, monitoraggio, supporto, costi e manutenzione |

## 6. Registro operativo — attività note non chiuse

Questi elementi sono già presenti nelle note storiche e vanno mantenuti visibili. La classificazione è prudenziale: non implica che ogni sospetto sia bug confermato.

| ID | Area | Attività | Stato iniziale |
|---|---|---|---|
| GOV-001 | Governance | Consolidare branch canonico, baseline, merge strategy e inventario unico | IN_PROGRESS |
| GOV-002 | Governance | Trasformare tutti i finding AUD esistenti in task con criteri/evidenze e deduplicare | NOT_STARTED |
| QA-001 | CI | Chiudere run 66, diagnosticare ogni fallimento e salvare log/artifact riproducibili | IN_PROGRESS |
| QA-002 | CI | Separare test PR read-only da commit/push di artefatti; minimo privilegio token | NOT_STARTED |
| QA-003 | QA | Completare matrice test automatizzati, emulatori e device reali | NOT_STARTED |
| SEC-001 | Firebase | Verificare App Check e copertura effettiva endpoint/backend | NOT_STARTED |
| SEC-002 | Supply chain | Audit segreti, keystore, dipendenze, licenze, SAST e configurazioni release | NOT_STARTED |
| PRIV-001 | Backup | Mappare dati locali/Android Auto Backup/Firebase e correggere policy/informative | NOT_STARTED |
| PRIV-002 | Dati sensibili | Risolvere la decisione su diario/umore nel backup Firebase e GDPR art. 9 | BLOCKED_USER |
| PRIV-003 | Età | Revisione legale matrice AGE_CONSENT e copertura mercati | IN_PROGRESS |
| ECON-001 | Economia | Correggere e testare contabilità atomica/idempotente Tanì, spentN e bucket | NOT_STARTED |
| ECON-002 | Billing | Verificare acquisti, abbonamenti, restore e gestione token Google Play end-to-end | NOT_STARTED |
| SEC-003 | Anti-abuso | Verificare inviti, premi, referral, clock e segnali client manipolabili | NOT_STARTED |
| PLAT-001 | Android | Verificare plugin nativi Share/Growth/Widget/Review e notifiche | NOT_STARTED |
| PLAT-002 | Android | Test release R8/App Check on, signing e compatibilità device | NOT_STARTED |
| UX-001 | UX | Audit accessibilità, onboarding, responsive e localizzazione madrelingua | NOT_STARTED |
| GAME-001 | Prodotto | Audit completo giochi, mondi, progressi, eventi e contenuti | NOT_STARTED |
| BRAND-001 | Brand | Audit personaggi e identità solo dopo consolidamento funzionale/UX | DEFERRED |
| WEB-001 | Sito | Integrare i 15 commit di main senza perdere app e sito; output app in /app/ | NOT_STARTED |
| GROW-001 | Crescita | Audit SEO, ASO, analytics, funnel, contenuti e community | NOT_STARTED |
| REL-001 | Release | Version bump 1.0.12/115 solo dopo QA e integrazione | DEFERRED |

**Nota:** `BLOCKED_USER` su PRIV-002 significa che il trade-off architetturale/privacy non va deciso arbitrariamente: preparare prima opzioni e conseguenze concrete, poi chiedere una decisione informata. Non blocca l'audit delle altre aree.

## 7. Registro decisioni

- DEC-001: originale `tanettoapp/Tanetto` preservato; fork `riccardosignorello/Tanetto` è il repository di lavoro.
- DEC-002: non unire alla cieca `main` (+15 commit storici di sito/SEO/contenuti) e `rel-111` (+117 commit rispetto alla base comune); prima analisi diff e piano d'integrazione.
- DEC-003: non ridisegnare i personaggi prima dell'audit prodotto/UX/brand; scelta da fare con evidenze.
- DEC-004: non eseguire release/merge sull'originale senza audit, piano, test indipendenti e autorizzazione necessaria.
- DEC-005: le vecchie percentuali 70%/25%/40% sono ritirate come non verificabili.

## 8. Registro sessioni

| Data | Sessione | Cosa è cambiato | Evidenza |
|---|---|---|---|
| 2026-11-21 | Ripresa continuità | Verificati checkpoint, registro audit, run 66; aggiunto checkpoint sessione | `docs/CONTINUITY_SESSION_2026-11-21.md` |
| 2026-11-21 | Control Center | Istituita fonte unica, regole percentuali e WBS; ritirate stime non dimostrate | Questo documento; commit da registrare dopo creazione |

## 9. Protocollo di inizio/fine sessione

### Inizio
1. Aprire questo Control Center.
2. Verificare HEAD del branch applicativo e branch audit; controllare working tree/commit recenti.
3. Verificare run CI attivi e ultimi esiti, riferiti al commit esatto.
4. Leggere solo i documenti di dettaglio pertinenti all'attività successiva.
5. Riprendere dal primo task non chiuso per priorità/dipendenze; non chiedere all'utente di ripetere informazioni già nel repository.

### Durante
- Lavorare per blocchi coerenti, non per messaggi frammentari.
- Fare commit tracciabili e descrittivi; non mischiare audit, refactor e correzioni indipendenti.
- Aggiornare task appena esiste un'evidenza; non aspettare la fine della chat.
- Se un finding è smentito, registrare la prova e chiuderlo come non-bug, non cancellarlo.

### Fine
1. Salvare ogni lavoro reale in Git.
2. Aggiornare stato task, decisioni, session log, branch HEAD, CI e prossima azione.
3. Scrivere checkpoint breve con file e linee/ID da leggere.
4. Ricontrollare che il Control Center sia raggiungibile sul branch canonico.
5. Nel messaggio all'utente riportare solo: cosa è stato effettivamente fatto, cosa è stato verificato, blocchi che richiedono lui, e prossimo blocco. Nessuna percentuale non calcolata.

## 10. Istruzione di ripartenza per ogni nuova chat

`Riprendi Tanetto dal MASTER CONTROL CENTER: leggi docs/MASTER_CONTROL_CENTER.md nel branch work/tanetto-1.0.12-agegate-fix, verifica HEAD/CI e riprendi il primo task aperto. Non usare stime delle chat precedenti e non chiedermi di ripetere informazioni già registrate. Lavora in blocchi ampi, aggiorna il Control Center e salva un checkpoint prima di fermarti.`
