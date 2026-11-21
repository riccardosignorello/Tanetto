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
- Branch `work/tanetto-1.0.12-agegate-fix` HEAD verificato il 21/11/2026: `849396b9874166ce2d3dd69df63e6eff72f2a2b9` (prima del commit di aggiornamento di questa voce).
- Branch `audit/tanetto-full-review` HEAD aggiornato il 21/11/2026: `92873a575c5b35c3cd5dd07ea3117f71142e0dce` (registro AUD-089 corretto e checkpoint).
- Il documento di checkpoint sessione è `docs/CONTINUITY_SESSION_2026-11-21.md`.
- Nessun merge verso originale o rilascio è stato effettuato in questa sessione.

### CI run 66
- Run: https://github.com/riccardosignorello/Tanetto/actions/runs/44836465630
- Run number: 66; commit testato: `9c3c75910f6ebae8e78c4cac7c607674b6cf05a1`.
- Verifica aggiornata il 21/11/2026: API ancora `in_progress`, job `test` ancora fermo nello step `Prove 1.0.11` iniziato alle 23:26:33Z del 20/11; nessun aggiornamento del run dal 20/11 23:23:44Z. È un run anormalmente lungo/stagnante, non un esito positivo né una prova di errore. Va diagnosticato/chiuso e sostituito da una run pulita sul commit applicativo finale.
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
| GROW-001 | Crescita | Audit SEO, ASO, analytics, funnel, contenuti e community | IN_PROGRESS |\n| GROW-002 | Crescita/analytics | Inventariare eventi, GoatCounter e punti tracking per piattaforma | IN_PROGRESS |\n| GROW-003 | Crescita/attribution | Verificare attribuzione paid/organic/referral end-to-end | NOT_STARTED |\n| GROW-004 | Prodotto/analytics | Definire activation, retention e North Star con dati disponibili | NOT_STARTED |\n| GROW-005 | Economia | Modello LTV netto, CAC, payback e ricavi per coorte | NOT_STARTED |\n| GROW-006 | Growth | Audit ASO, store listing, sito, social, creator e referral | NOT_STARTED |\n| GROW-007 | Growth/finance | Protocollo esperimenti paid con tetto iniziale 0–100 € | NOT_STARTED |\n| GROW-008 | Privacy/ads | Verificare policy advertising per minori e mercati | NOT_STARTED |
| REL-001 | Release | Version bump 1.0.12/115 solo dopo QA e integrazione | DEFERRED |

**Nota:** `BLOCKED_USER` su PRIV-002 significa che il trade-off architetturale/privacy non va deciso arbitrariamente: preparare prima opzioni e conseguenze concrete, poi chiedere una decisione informata. Non blocca l'audit delle altre aree.

## 7. Registro decisioni

- DEC-001: originale `tanettoapp/Tanetto` preservato; fork `riccardosignorello/Tanetto` è il repository di lavoro.
- DEC-002: non unire alla cieca `main` (+15 commit storici di sito/SEO/contenuti) e `rel-111` (+117 commit rispetto alla base comune); prima analisi diff e piano d'integrazione.
- DEC-003: non ridisegnare i personaggi prima dell'audit prodotto/UX/brand; scelta da fare con evidenze.
- DEC-004: non eseguire release/merge sull'originale senza audit, piano, test indipendenti e autorizzazione necessaria.
- DEC-005: le vecchie percentuali 70%/25%/40% sono ritirate come non verificabili.\n- DEC-006: Tanetto non copia il modello hypercasual basato su CPI basso e interstitial ad alta frequenza. Si prende il principio di unit economics e reinvestimento disciplinato; paid acquisition solo dopo retention, LTV netto, attribuzione e privacy verificabili. Budget test iniziale discusso: 0–100 €, non spesa automatica. Dettagli in `docs/GROWTH_AND_UNIT_ECONOMICS.md`.

## 8. Registro sessioni

| Data | Sessione | Cosa è cambiato | Evidenza |
|---|---|---|---|
| 2026-11-21 | Ripresa continuità | Verificati checkpoint, registro audit, run 66; aggiunto checkpoint sessione | `docs/CONTINUITY_SESSION_2026-11-21.md` |
| 2026-11-21 | Control Center | Istituita fonte unica, regole percentuali e WBS; ritirate stime non dimostrate | Commit `3d7a3dd439f84bef8f8a6abdf3a5aaa4c8ef8ef7` |\n| 2026-11-21 | Growth strategy | Aggiunto modello di crescita sostenibile, unit economics, gate paid, privacy e task GROW-002–008 | `docs/GROWTH_AND_UNIT_ECONOMICS.md`; commit `b052d628e12fbd23f560be8f8a95a5c7b969aa03` |

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


## 11. Sincronizzazione inventario audit — 21/11/2026

Il registro specialistico si trova su `audit/tanetto-full-review` (HEAD verificato: `f55e7cdeee217b75a19c4d52ad7ec725ae25e6b6`). È stato riletto e sincronizzato come backlog nel Control Center. Le righe sottostanti sono l'indice dei finding originali, non una promozione automatica a bug confermato: per dettagli, evidenze e qualificazioni fa fede la voce corrispondente nel registro audit. Gli ID sono mantenuti per evitare duplicazioni e perdita di storia.

**Regola:** ogni finding diventa task di verifica/risoluzione; non si chiude senza prova. Quando più finding condividono una causa (es. backup/clock/privacy o transazioni Tanì), potranno essere raggruppati in epic, ma i riferimenti originali resteranno tracciabili.

| ID | Finding registrato (sintesi originale) |
|---|---|
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
| AUD-011 | Acquisti/Tanì | Deduplicazione locale dei token limitata agli ultimi 200; consumo fallito ritentato al successivo restore | Rischio da riprodurre, non bug confermato | Alta | Simulare consumo fallito, oltre 200 acquisti, restore da backup vecchio, secondo dispositivo, pending/refund e concorrenza |
| AUD-012 | Età/analytics/funzioni adulti | Letture residue di `S.age` in `98zk_v26_fix.js` dopo la migrazione a `AGE_VALUE` | Difetto confermato sul ramo applicativo | Alta | Confrontare patch del branch age-gate, cercare ogni riferimento legacy in tutti i moduli e testare tutti i flussi |
| AUD-013 | Inviti/anti-abuso | Impronta device e giorni d'uso arrivano dal client; Firestore controlla forma e tempo ma non attesta il dispositivo | Limite architetturale confermato; impatto da valutare | Media/Alta | Threat model e simulazioni abuso; valutare App Check/attestazione/server trusted |
| AUD-014 | Pubblicità/minori | Trattamento teen per età non dichiarata consente video premio non personalizzati | Comportamento confermato nel codice; conformità da verificare | Alta | Confronto aggiornato con policy Play/AdMob, UMP e leggi dei mercati |
| AUD-015 | CI/CD/supply chain | Workflow di test con permesso globale `contents: write` e commit/push generati nello stesso job che gestisce pull request | Configurazione confermata; rischio operativo concreto | Alta | Separare workflow, ridurre permessi, testare PR interne/esterne e proteggere branch |
| AUD-016 | Privacy/backup | Informativa dice che età è inclusa nel backup Google; implementazione Android la esclude dal backup | Contraddizione confermata per Android | Alta | Verificare browser, export/import, migrazione, backup e riscrivere informativa in 14 lingue |
| AUD-017 | Account/cancellazione | `remove()` cancella il backup Firestore prima di `deleteUser()`; la riautenticazione può fallire dopo che il backup è già sparito | Difetto confermato nel flusso | Alta | Riprodurre su app e pagina web; progettare cancellazione idempotente senza perdita anticipata |
| AUD-018 | Import/export/sicurezza | Nessun limite preventivo evidente a dimensione file/codice o output decompresso prima del parsing JSON | Rischio concreto da testare | Alta | Test file grandi, decompression bomb, JSON profondo, memoria limitata e fallback |
| AUD-019 | Import/export/integrità | Verifica firma file asincrona separata da FileReader e usa stato globale `secLastTrust` | Possibile race condition | Media/Alta | Testare file piccoli/grandi, letture concorrenti e conferma immediata |
| AUD-020 | Qualità/test | Ampia suite automatizzata, ma molte integrazioni sono mock e mancano verifiche reali su Play/Firebase/AdMob/device | Gap di copertura confermato | Media/Alta | Definire matrice test reali, test plugin nativi e criteri di release |
| AUD-021 | Inviti/economia | Payout invitante dedotto da `q - got`, ma `got` è solo locale; il server non memorizza il payout già eseguito | Rischio strutturale di doppio accredito | Alta | Riprodurre con backup firmato obsoleto e restore ripetuto; progettare ledger server idempotente |
| AUD-022 | Inviti/anti-abuso | Le 3 date d'uso sono verificate dal client; le regole server impongono soltanto 36 ore | Bypass di protocollo confermato | Media/Alta | Simulare chiamata diretta dopo 36 ore; decidere una verifica server attendibile |
| AUD-023 | Ads/età | `adsOn()` esclude `AGE_VALUE === undefined`, quindi chi non ha ancora risposto non riceve video, nonostante commenti e test dicano trattamento teen | Incoerenza di comportamento confermata | Media/Alta | Decidere comportamento voluto e verificare policy AdMob/Play prima di correggere |
| AUD-024 | CI/osservabilità | Traceback e log completi dei test falliti vengono scartati dal runner | Gap diagnostico confermato | Media | Artifact per test, log integrali e riproduzione locale/CI |
| AUD-025 | UX/localizzazione | Nomi delle icone si spezzano a 360 px in cinque lingue | Difetto UI confermato dai test | Media | Correggere layout senza ridurre leggibilità/accessibilità |
| AUD-026 | Prestazioni | Animazioni evento superano la soglia del test nel run feature | Da riprodurre | Media | Profilare su runner stabile e Android fisico |
| AUD-027 | Contenuti/UX | Test settimana/story hanno eccezioni o mismatch di contenuto; causa nascosta dal logging | Non diagnosticato | Media | Recuperare stack trace e riprodurre ogni caso |
| AUD-028 | Benessere/sicurezza | Rilevamento crisi basato su parole chiave e linee di aiuto locali; necessita validazione professionale, linguistica e territoriale | Gap di validazione confermato | Molto alta | Revisione clinica/linguistica indipendente, test di falsi negativi e verifica fonti/claim |
| AUD-029 | Privacy/account/minori | La scheda account non mostra il collegamento di cancellazione a chi è già disconnesso; il test dedicato fallisce | Lacuna UI confermata | Alta | Progettare percorso cancellazione per account preesistenti/minori e provarlo end-to-end |
| AUD-030 | Economia/Introvabili | `spentN` cresce dell'intera spesa invece che del solo residuo pagato; può sbloccare Tanì acquistati successivamente | Difetto logico nel caso limite | Alta | Testare spesa oltre residuo pagato, nuovi pacchetti e tutte le categorie di spesa |
| AUD-031 | Plus/backup | `plusMonth` resta importabile e il beneficio mensile non ha ledger server; un backup precedente può ripetere il regalo | Rischio da riprodurre | Alta | Test restore pre/post regalo, dispositivo nuovo e retry billing |
| AUD-032 | Acquisti/persistenza | Il consumo Google Play può seguire un salvataggio del token non riuscito; manca conferma durevole post-accredito | Rischio di perdita acquisto | Alta | Fault injection su storage pieno/crash e rendere consegna/consumo idempotenti |
| AUD-034 | Abbonamenti/notifiche | Notifica locale di fine prova può restare programmata se la prova viene annullata mentre l'app è chiusa | Rischio UX da riprodurre | Media | Testare annullamento Play con app chiusa e sincronizzazione successiva |
| AUD-035 | Backup/economia/acquisti | Token importati contati come pacchetti senza verifica Play; quota può essere gonfiata con token fittizi | Debolezza anti-manomissione confermata | Alta | Test import alterato; validazione server dei token e limiti non controllabili dal client |
| AUD-036 | Backup/economia | `v20econ` e i suoi registri monotoni non vengono validati/mergiati; backup vecchi o alterati possono ripristinare premi e contatori | Gap di integrità confermato | Alta | Test restore di `rw/gifts/trips/paid/spentN`, merge monotono e ledger server |
| AUD-037 | Sicurezza dati | Firma locale basata su chiave statica nel bundle è riproducibile e non autentica la provenienza della copia | Limite crittografico confermato e già ammesso dal codice | Alta | Non usarla come controllo di sicurezza; definire threat model e protezioni server |
| AUD-038 | Orologio/anti-abuso | Su Android pre-13, dopo reboot senza ora rete, rollback oltre 30 giorni abbandona il pavimento temporale | Limite architetturale confermato; rischio da quantificare | Media/Alta | Matrice API 26–32, reboot, offline e data spostata |
| AUD-039 | Backup Android/orologio | `tanetto-clock` non è escluso esplicitamente dalle regole di backup; possibile trasferimento del pavimento su nuovo device | Da verificare su dispositivo reale | Media | Backup/restore Android su due device e ispezione dei dati ripristinati |
| AUD-040 | Acquisti/backup/migrazione | `SEC_PACK_NEW=4.000` non segue i pacchetti aggiornati fino a 25.000; un restore non firmato su nuovo device può tagliare Tanì legittimi | Incoerenza confermata, perdita da quantificare | Molto alta | Testare i 4 pacchetti su backup legacy/non firmato e progettare verifica Play server-side |
| AUD-041 | Account/età/UX | Invito e pulsanti di accesso possono apparire anche quando `ageCloudOk()` blocca account e backup | Incoerenza di comportamento confermata | Media/Alta | Testare child/teen/skip/unknown per UI, click e messaggi; mostrare solo le azioni disponibili |
| AUD-042 | Firebase/retention/privacy | TTL 12 mesi dichiarata nei commenti, ma policy non versionata nel repository e da verificare per tutti i collection group | Non verificabile senza Console | Alta | Verificare TTL su invites/p/c/devs in Firebase/Google Cloud |
| AUD-043 | Privacy/Data Safety | Hash SHA-256 dell'Android ID descritto come “cifrato”; è un identificatore pseudonimo | Incoerenza terminologica confermata | Media/Alta | Correggere definizioni e verificare Data Safety/GDPR |
| AUD-044 | Analytics/diagnostica | Eventi errori JS inviati a GoatCounter non esplicitati chiaramente nelle note Data Safety | Raccolta confermata; disclosure da verificare | Media/Alta | Verificare policy GoatCounter e classificazione Play “Diagnostics” |
| AUD-045 | Licenze/asset | Provenienza e licenze delle immagini non documentate nel repository | Gap documentale confermato | Alta | Inventario asset, autore/fonte/licenza/diritti per ogni gruppo |
| AUD-046 | Build/Firebase | Il workflow non ricostruisce `fb.js` da `fb_entry.js`; può distribuire bundle obsoleto | Gap di processo confermato | Alta | Ricostruire in CI, verificare hash/diff e sincronizzare sito/app |
| AUD-047 | Performance/web | `index.html` pesa 4,72 MiB e contiene il bundle JS/CSS concatenato | Problema misurato | Molto alta | Profilare Lighthouse/CrUX e progettare split, minify, lazy load e cache |
| AUD-048 | Asset/performance | PNG/OG/press asset pesanti; separazione e ottimizzazione da completare | Problema misurato, impatto runtime da misurare | Media | Inventario per pagina/app, compressione e immagini responsive |
| AUD-049 | Marketing/press kit | Versione corrente dichiarata 1.0.10, ma Play ha 1.0.11; trial e offerte da formulare con eleggibilità corretta | Incoerenza confermata | Media/Alta | Aggiornare al rilascio e usare fonte unica |
| AUD-050 | SEO/internazionalizzazione | Privacy multilingua su URL unico senza alternate hreflang; sitemap non include licenze | Gap SEO da misurare | Media | Search Console, test render e strategia URL lingua |
| AUD-051 | Sicurezza web | Pagina di cancellazione e privacy non hanno la stessa CSP dell'app; la cancellazione gestisce Firebase Auth | Hardening mancante | Alta | CSP dedicata, header HTTP, test XSS/clickjacking e security headers |
| AUD-052 | Privacy/inviti/plugin nativi | `GrowthPlugin.device/referrer` non verifica l'età nel codice nativo; dipende interamente dal gate JS | Gap defense-in-depth confermato | Media/Alta | Test chiamata diretta con child/teen/skip/unknown e blocco nativo |
| AUD-053 | Età/plugin nativi | `AgeStorePlugin.set()` consente di sovrascrivere una scelta già valida | Gap di enforcement nativo confermato | Media | Rendere immutabile salvo recovery di store corrotto e testare retry |
| AUD-054 | Backup/orologio | Backup Android include `tanetto-clock`; boot count non è un identificatore univoco tra device | Rischio cross-device concreto | Alta | Escludere clock dal backup o legarlo a UUID no-backup; test device-to-device |
| AUD-055 | Firebase/operazioni | Regole testate in emulator ma deployment produzione manuale e non tracciato; manca alias/config Firebase nel repo | Gap operativo confermato | Alta | Esportare regole attive, diff, deploy controllato e verifica post-deploy |
| AUD-056 | Android/App Check/CI | Flavor App Check on non viene compilato dalla CI ordinaria; produzione resta off | Gap di test/config confermato | Alta | Compilare flavor on in CI e provare Play Integrity su device |
| AUD-057 | Moderazione/lingue | Filtro nomi basato su sottostringhe può produrre falsi positivi e non copre adeguatamente CJK | Gap di copertura confermato; falsi positivi da quantificare | Media/Alta | Test madrelingua, boundary matching e set di nomi innocui/offensivi |
| AUD-058 | Test/qualità | CI non copre ancora device reali, servizi Google/Firebase, backup Android e accessibilità assistiva completa | Gap di copertura confermato | Alta | Piano E2E su device e ambienti reali dopo il fix dei test obsoleti |
| AUD-059 | Economia/Introvabili | Il click normale è protetto da `xvWithUsable` e dal listener capture; il controllo non è ancora centralizzato nel gestore atomico e manca un E2E sul percorso completo | Hardening/test gap, non bypass confermato | Media | E2E sul click reale e controllo centralizzato in `spendTani` |
| AUD-060 | Safety/benessere | Rilevamento crisi euristico in 14 lingue e linee telefoniche via fuso: non risulta validazione clinica/linguistica indipendente | Gap di validazione da chiudere | Alta | Revisione professionale, madrelingua, test di falsi positivi/negativi e verifica ufficiale delle linee |
| AUD-061 | UX/audio/accessibilità | Musica avviata automaticamente dopo 300 ms, consentita nativamente senza gesto | Comportamento confermato; scelta UX da validare | Media | Test primo avvio, audio focus, silenzioso/DND e preferenza esplicita |
| AUD-062 | Localizzazione/brand/compliance | 14 lingue presenti, ma i test tecnici non dimostrano revisione madrelingua e accuratezza culturale/legale | Gap di garanzia qualità | Alta | Audit madrelingua per aree ad alto rischio e workflow di approvazione versionato |
| AUD-063 | CI/CD/GitHub | Il push artefatti usa `GITHUB_REF_NAME` anche su PR (`123/merge`), con rischio di fallimento e permessi write non necessari | Difetto workflow confermato | Alta | Separare job read-only e sync su branch; testare PR da fork e interne |
| AUD-064 | CI/CD/supply chain | Log/screenshot non archiviati, dipendenze Python non bloccate, nessun job dedicato SAST/dependency/secret scan | Gap di qualità e sicurezza confermato | Media/Alta | Artifact retention, lock, scansioni e test paralleli |
| AUD-065 | Privacy/minori/backup | Android Auto Backup include Local Storage e diario per tutte le età, mentre il prodotto comunica “no backup” in modalità protetta; età invece esclusa dal backup | Incoerenza tecnica e comunicativa confermata | Critica | Decidere se disabilitare/segregare backup o chiarire esplicitamente il backup di sistema per ogni fascia |
| AUD-066 | Privacy/cifratura | Backup Firebase codificato/compresso ma non E2E; frase “accessible only with your account” ambigua rispetto all'accesso amministrativo | Incoerenza terminologica da correggere | Alta | Data map, access control, cifratura reale e testo trasparente |
| AUD-067 | Privacy/retention | Cancellazione account elimina Firebase backup/Auth, non le copie Android Auto Backup già gestite da Google né i dati locali | Ambito della cancellazione incompleto | Alta | Spiegare cosa viene cancellato, cosa resta locale e come gestire backup Android |
| AUD-068 | GDPR/dati particolari | Backup cloud dell'intero stato può includere diario e umore con dati relativi alla salute; base art. 9 e consenso specifico non dimostrati dal solo codice | Rischio legale da valutare | Critica | Parere privacy legale e scelta architetturale prima di mantenere il diario nel backup Firebase |
| AUD-069 | Età/GDPR/mercati | Tabella soglie incompleta e fallback 16; locale/fuso non dimostrano il Paese fisico e possono essere modificati | Rischio di soglia troppo permissiva in alcuni mercati | Critica | Matrice legale Paese per Paese, fallback sicuro e scelta di age assurance/mercati supportati |
| AUD-070 | Economia/Billing/affidabilità | Bucket Plus/pacchetti aggiornato in salvataggi successivi al saldo; token consumato anche se il salvataggio non è verificato; possibile doppio accredito se token non consumato viene espulso; `spentN` può sovracontare | Rischio transazionale confermato da codice | Critica | Verificare failure windows e progettare grantTani idempotente con persistenza prima del consumo |
| AUD-071 | UX/privacy/età | La scheda profilo non mostra il testo localizzato che spiega che la scelta dell'età non è modificabile | Lacuna confermata | Media | Inserire testo in tutte le lingue e verificare accessibilità |
| AUD-072 | UI/localizzazione | Etichette icone spezzate a 360 px in IT/DE/ES/FR/NL | Difetto visuale confermato dal test | Media | Revisione layout e traduzioni su 320/360/390 px |
| AUD-073 | Performance/animazioni | Gli eventi stagionali aumentano in modo sensibile le operazioni stile/layout a riposo | Benchmark fallito | Media/Alta | Profiling e riduzione lavoro per frame; test su device Android lenti e medi |
| AUD-074 | Test età/ads | Due test confondono età pending con scelta esplicita skip e si aspettano annunci quando il plugin deve bloccare | Aspettativa test errata | Media | Separare casi pending, skip, child, teen, adult |
| AUD-075 | Test backup/restore | Test di ripristino usa attesa fissa 1,5 s su funzione asincrona e legge ancora il regalo iniziale | Flaky test probabile; UX da verificare | Media | Attendere stato/selector e verificare che il restore prompt sia sempre mostrato |
| AUD-076 | CI/diagnostica | Traceback di `t_110_story` e `t_111_week` non disponibili nel log recuperato | Gap di osservabilità | Media | Salvare log integrali e riprodurre prima di classificare |
| AUD-077 | Android/condivisione/storage | SharePlugin non limita la dimensione Base64, non pulisce i file cache e non elimina i record MediaStore pendenti in caso di errore | Gap di robustezza confermato da codice | Media | Limiti, cleanup garantito e test storage pieno/stream nullo |
| AUD-078 | Growth/referral | Dopo tre tentativi falliti il referrer viene marcato definitivamente come completato; attribuzione invito può andare persa | Rischio funzionale confermato | Media | Retry con backoff/tempo e stato “non disponibile” separato da “completato” |
| AUD-079 | Widget/UX | Il risultato `asked` non prova che il widget sia stato aggiunto | Semantica API da rispettare | Bassa/Media | Verificare copy e aggiornamento stato dopo il prompt |
| AUD-080 | Recensioni/UX | ReviewPlugin risolve anche quando Google non mostra la finestra; non si può sapere se l'utente ha recensito | Limite API da rispettare | Bassa/Media | Registrare solo tentativo, mai recensione completata |
| AUD-081 | Widget/tempo | Il widget usa l'orologio di sistema invece del clock sicuro dell'app; può mostrare un giorno/gita non coerente dopo modifica manuale di data o fuso | Disallineamento UX, non bypass premi | Bassa/Media | Test cambio data/fuso e fotografia con timestamp sicuro |
| AUD-082 | Android/CI/release | La CI non prova il build release con R8/shrinkResources e non compila il flavor App Check on | Gap di verifica release confermato | Alta | Build AAB release, test installazione, smoke test e verifica mapping |
| AUD-083 | Android/firma/supply chain | `prova.keystore` con credenziali standard è nel repository; APK di prova usa stesso applicationId ma certificato diverso dalla release | Rischio test-channel e UX confermato | Media/Alta | Keystore test via secret o package suffix; tenere separata la firma Play |
| AUD-084 | Tempo/progressione/anti-cheat | Android <13 dopo riavvio e PWA/browser non dispongono sempre di tempo di rete affidabile; i salti in avanti possono essere accettati | Limite tecnico confermato | Alta | Test device API 24/29/32/33+, offline, reboot, cambio data e ripristino |
| AUD-085 | Backup/tempo | Android Auto Backup include `tanetto-clock` in Local Storage, mentre il commento afferma che il clock non viene trasferito | Incoerenza documentazione/backup confermata | Media/Alta | Verificare restore cross-device e decidere esclusione o clock server |
| AUD-086 | Notifiche/UX | Revoca permesso o fallimento schedule non aggiorna `S.notif`; la UI può dichiarare attive notifiche non programmate | Difetto di stato/feedback da codice | Media | Check permission ad ogni apertura, rollback dello stato se schedule fallisce |
| AUD-087 | Notifiche/tempo | La data JS sicura può differire dall'orologio usato da AlarmManager; consegna può slittare dopo manipolazione clock | Rischio di sincronizzazione | Media | Test cambio data/fuso e API Android 24–36 |
| AUD-088 | Notifiche/canali | `v26OldChannel` segna il vecchio canale eliminato prima del completamento asincrono | Rischio di migrazione incompleta | Bassa/Media | Salvare il flag solo dopo esito positivo e riprovare in caso di errore |
| AUD-089 | Minori/privacy/condivisione | Gate 13+ intenzionale e coerente con pubblico Play dichiarato; child/unknown bloccati. Verificare dati condivisi e conformità, non applicare automaticamente `ageCloudOk()` | Policy intenzionale; validazione contenuti/legale aperta | Media | Verificare tutte le cartoline e le regole dei mercati |

## 12. Checkpoint operativo — 21/11/2026, ripresa integrale

### Stato effettivamente verificato
- Il branch applicativo candidato è ora a `639d8df1d76c49410a3af33de1244112e8311905`; il commit è documentazione, non codice app.
- Il registro specialistico è stato riletto sul branch audit e sincronizzato qui: 87 righe di finding univoche (AUD-001–088, senza una voce tabellare AUD-033) e nuovo finding AUD-089.
- Branch audit HEAD dopo aggiornamento: `f13afda5f95146495b8a087c5e07c0b77b224a65`.
- CI run 66 è ancora stagnante nello step `Prove 1.0.11`, avviato il 20/11 alle 23:26:33Z; API non mostra completamento. Non è verde e non è una prova di fallimento del codice.
- Tree del branch base `work/tanetto-1.0.12` enumerato integralmente: 981 file, 0 troncamento. `src/` contiene i moduli core e le aggiunte 1.0.11/1.0.12; test automatici in `tests/t110/`.
- Sono stati esaminati in lettura i nuovi giochi (`src/97x_games.js`), economia premi giochi (`src/98e_v20_econ.js`), viaggi (`src/98c_v20_trips.js`), cartolina settimanale (`src/98zu_v111_week.js`) e animazioni stagionali (`src/98zw_v111_events.js`).
- AUD-089: la condivisione 13+ è intenzionale e coerente con il pubblico Play dichiarato; `a111Kid()` blocca child/unknown. Non applicare automaticamente la soglia `ageCloudOk()`; resta da validare che tutte le cartoline condividano soltanto dati non sensibili e che la policy sia conforme nei mercati serviti.
- Il flusso dei giochi limita i premi giornalieri tramite `EC.GAME_CAP`, memorizza `S.game.seeds` e sincronizza `e.games`; restano da verificare import/restore e manipolazioni dei registri insieme ad AUD-035/036/070. Nessun test end-to-end su device è stato eseguito in questo blocco.
- Viaggi usano `Date.now()` per inizio/scadenza e registrano fino a 60 giorni in `S.v20trip.days`; i limiti del clock e del backup restano collegati ad AUD-038/039/054/084/085.
- Le animazioni eventi sono create tramite GSAP e condizionate da `anim`/modalità leggera; non è stata eseguita una misura prestazionale nuova, quindi AUD-073 resta aperto.
- La cartolina settimanale contiene status giornaliero aggregato; il codice esclude diario e umore dall'immagine, come dichiarato nel commento. La condivisione esterna e i relativi UTM vanno ancora controllati end-to-end.

### Metodo da rispettare
L'audit master storico stabilisce che prima si completa l'inventario e il piano dipendenze e solo dopo si applicano patch applicative. Il branch age-gate resta candidato isolato; non integrarlo durante questa fase. Le modifiche documentali al Control Center non incrementano l'avanzamento tecnico.

### Prossimo blocco
1. Verificare i flussi di viaggio/cartoline livello e viaggio, album, mondi, collezioni e shop; tracciare tutti i premi e i dati esportati.
2. Esaminare tutti i test correlati e confrontare il candidato age-gate con il branch base senza integrare.
3. Proseguire con PWA/offline, iOS/web, accessibilità, performance e asset/licenze.
4. Completare inventario e dipendenze prima di pianificare le correzioni.

## 13. Checkpoint crescita e stato verificato — 21/11/2026

### Branch e CI verificati in questa sessione
- Branch applicativo: `work/tanetto-1.0.12-agegate-fix`, HEAD prima di questo aggiornamento Control Center: `b052d628e12fbd23f560be8f8a95a5c7b969aa03`.
- Branch audit: `audit/tanetto-full-review`, HEAD: `92873a575c5b35c3cd5dd07ea3117f71142e0dce`.
- CI run 66: ancora `in_progress`, ultimo aggiornamento API `2026-11-20T23:23:44Z`, commit testato `9c3c75910f6ebae8e78c4cac7c607674b6cf05a1`. Il run è stagnante e non può essere considerato superato.
- Tree del branch di audit di base: 1.113 elementi, non troncato. Questo conferma la dimensione del repository, non che ogni file o area sia già stato auditato.

### Crescita — conclusioni provvisorie basate sul codice
- `src/98i_v20_growth.js`: cartoline condivisibili con anteprima, link `?src=postcard`, percorso Android a Google Play e alcuni eventi di funnel.
- `src/97zn_v19_ads.js` e `AdsPlugin.java`: video rewarded su scelta esplicita, con gate età/consenso; l'informativa dichiara massimo cinque video al giorno e nessuna pubblicità con Plus. Nessuna scelta di aumentare la pressione pubblicitaria.
- `GrowthPlugin.java`: Play Install Referrer e identificatore derivato da Android ID sono usati nel contesto inviti/antiabuso; non costituiscono prova di attribuzione paid end-to-end.
- `src/3zzg_v21_privacy.js`: l'informativa descrive statistiche aggregate via GoatCounter senza cookie/profili. Va verificata l'implementazione effettiva e la copertura delle metriche di coorte.
- Non è stato verificato alcun collegamento completo tra spesa campagne, installazione attribuita, activation, D1/D7/D30, conversione Plus e ricavi netti. Non abbiamo quindi dati sufficienti per stimare CPI sostenibile, LTV o payback.

### Strategia registrata
- Non adottare il modello hypercasual come modello prodotto: niente interstitial automatici o churn accettato come obiettivo economico.
- Adottare la disciplina di unit economics: distinguere download da utenti attivati/ritenuti, misurare LTV netto e CAC, reinvestire solo su coorti validate.
- Il budget iniziale 0–100 € resta un tetto sperimentale discusso, non un'autorizzazione a spenderlo subito.
- Paid acquisition bloccata da gate di misurabilità, retention, ricavi e privacy. North Star candidata: attività significativa in almeno 3 giorni distinti alla settimana; non ancora approvata.
- Documento di dettaglio: `docs/GROWTH_AND_UNIT_ECONOMICS.md`.

### Avanzamento e limiti
- Non esiste ancora una percentuale globale valida: l'inventario WBS completo, la deduplicazione e i pesi per deliverable non sono terminati.
- Il repository è accessibile e scrivibile; ciò non significa che tutti i materiali esterni siano disponibili. In particolare non sono stati consultati dati reali di Play Console, AdMob, spesa campagne, ricavi e retention di utenti.
- Nessun blocco operativo del connettore GitHub è emerso in questo blocco. Restano dipendenze informative esterne per la futura validazione commerciale e una decisione dell'utente su PRIV-002, che non blocca il resto dell'audit.
- In questo blocco sono state create/aggiornate solo documentazioni; nessuna modifica applicativa, test runtime o rilascio.

### Prossimo blocco operativo
1. Audit approfondito dei flussi album, mondi, collezioni, shop e cartoline.
2. Inventario delle chiamate tracking/eventi e confronto con privacy notice.
3. Ricostruzione del funnel invito/cartolina e limiti reali di attribuzione.
4. Verifica delle fonti di ricavo e test di billing; preparare la lista precisa di dati esterni mancanti, senza bloccare le attività sul repository.
5. Completare WBS e dipendenze prima di calcolare qualsiasi percentuale.


## 14. Checkpoint audit album/mondi/shop — 21/11/2026

- Branch applicativo HEAD prima di questo aggiornamento: `6bb4af9b9ba3d95adfe7a1f090f95d84d1bdd36a`.
- Branch audit HEAD verificato: `3f68bfe7bdf194aa5bc05bad87ec32c2e983c20c`; dettaglio in `AUDIT/CONTINUATION.md`.
- Lettura statica eseguita su `work/tanetto-1.0.12`: `97zk_v19_worlds.js`, `97zj_v19_shop.js`, `97zm_v19_goals.js`, `98zi_v24_fix.js`, `98i_v20_growth.js`.
- Mondi e album assegnano premi lato client direttamente a `S.seeds`/`S.owned`; i claim pagina sono protetti dal registro locale `S.pages`. Non è un finding nuovo: rafforza il collegamento con AUD-030/035/036/070 e conferma che l'integrità economica va progettata come un unico intervento.
- Il raddoppio del primo acquisto usa `S.firstPack`, marker `localStorage` `tanetto-first-pack` e `S.paidTokens`. Reinstallazione, cambio device, restore e retry non sono stati testati; l'unicità del bonus resta non verificata.
- I prezzi reali Play guidano il confronto dei pacchetti quando disponibili; il fallback usa dati statici e un indice predefinito. Va verificato che non appaia un claim di convenienza non dimostrato quando i prezzi non sono disponibili.
- Nessun test runtime/device è stato eseguito. Nessun finding precedente è stato chiuso.
- Non è stata fatta alcuna modifica applicativa.

### Correzione esplicita sulla disponibilità dei materiali
- L'accesso GitHub al fork è operativo e scrivibile: non è emerso un blocco tecnico del connettore.
- Non è corretto affermare che tutto il materiale sia già disponibile. Non sono stati consultati dati reali Play Console, AdMob, campagne/spesa, ricavi e retention; non sono state eseguite prove su device reali; per alcune verifiche serviranno esportazioni o accessi esterni.
- La decisione PRIV-002 (diario/umore nel backup) resta una decisione strategica da preparare con opzioni e conseguenze, non un blocco all'audit.
- L'inventario WBS e i pesi non sono completi. Quindi **la percentuale globale complessiva non è ancora calcolabile**. Non equivale a zero avanzamento: significa che il denominatore non è ancora affidabile.

### Ripartenza
Primo task: tracciare Billing base e restore/import, verificare `creditPack`, `paidTokens`, `firstPack` e registri monotoni; costruire test riproducibili per reinstallazione, cambio device, restore e retry. In parallelo completare inventario tracking/privacy e i flussi cartolina/Play.


## 12. Checkpoint stato e stima — 21/11/2026

- HEAD applicativo verificato: `d0616d8a00e76c6919834306e41e120ad301e823`.
- HEAD audit verificato: `3f68bfe7bdf194aa5bc05bad87ec32c2e983c20c`.
- CI run 66 ricontrollata via API: ancora `in_progress`, commit testato `9c3c75910f6ebae8e78c4cac7c607674b6cf05a1`, bloccata allo step `Prove 1.0.11`; non è verde né fallita e non copre l'HEAD corrente.
- `src/97o_billing.js` letto: confermato il perimetro AUD-011 (dedupe locale max 200 token, consume retry, Plus e regalo mensile locali); nessuna doppia erogazione è stata riprodotta. Plugin Java nativo e test Play reali ancora aperti.
- `src/97zn_v19_ads.js` letto: rewarded opt-in max 5/die e gate obiettivo; coerenza età/UMP/revoca/plugin nativo da verificare. Timer ricorrente 5s da misurare, non classificato come bug.
- Percentuale globale ancora **NON CALCOLABILE**: WBS atomica completa, deduplicazione, pesi e stati non sono ancora pronti. Non usare stime storiche ritirate.
- Stima provvisoria registrata: 160–290 ore equivalenti concentrate (4–8 settimane full-time) per audit, correzioni, QA e release-readiness, esclusi tempi esterni e crescita continuativa. Non è una promessa di calendario; aggiornare dopo WBS completa.
- Report dettagliato: `docs/PROGRESS_AND_ESTIMATE_2026-11-21.md`.
- Nessuna modifica applicativa, merge o release in questo blocco.



## 13. Integrazione audit Billing/import — 21/11/2026

- Individuato e letto il plugin nativo corretto: `app-android/android/app/src/main/java/com/tanettoapp/tanetto/BillingPlugin.java` (BillingClient, owned queries, acknowledge, consume, pending/tardivi). La deduplicazione e il ledger non sono server-side nel plugin; la logica resta in JS e nello stato locale/backup. AUD-011 resta aperto.
- Letti `src/98x_v20_secure.js` e `src/98e_v20_econ.js`: aggiunto AUD-090 nel registro audit. Il sanitizzatore di import non firmati concede fino a 10 × 4.000 Tanì di tetto aggiuntivo contando stringhe arbitrarie in `paidTokens`; comportamento statico confermato, riproduzione runtime/impatti da verificare. Gravità provvisoria Media; non è prova di frode Play.
- Il registro specialistico è aggiornato sul branch audit; report applicativo aggiornato in `docs/PROGRESS_AND_ESTIMATE_2026-11-21.md`.
- Prossimo controllo: testare il caso AUD-090, poi analizzare migrazione/ledger completo e i flussi account/import/export. Nessuna patch applicativa.



## 14. Verifica test economici — 21/11/2026

- Letto `tests/t110/t_b2_money.py`: copre già uno scenario mock di due telefoni e restore dopo acquisto; non duplicare questo caso. Restano da cercare/testare casi token arbitrari importati, oltre 200 token, consume fallito, refund/revoca e concorrenza.
- Il test non è stato eseguito in questo blocco. La lettura non lo rende VERIFIED.
- HEAD app verificato prima dell'aggiornamento: `10a8b6871f057767a1be6cde52aa40e5bfc14552`; HEAD audit: `60c9e260e4b258544e56e68382082e7c6a97fbb9`. Report aggiornato in `docs/PROGRESS_AND_ESTIMATE_2026-11-21.md`.



## 15. Proposta strategica per handoff Claude — 21/11/2026

È stata aggiunta la proposta ragionata dell'assistente in `docs/CLAUDE_EXECUTION_BLUEPRINT_2026-11-21.md` (branch applicativo). Il documento:
- distingue completamento teorico, pratico e dipendenze esterne/proprietario;
- raggruppa AUD-001–AUD-090 in epic senza cancellare gli ID;
- propone priorità, dipendenze, architetture da valutare, criteri di accettazione e deliverable per Claude;
- chiede a Claude di criticare indipendentemente la proposta prima di applicarla;
- non autorizza release, merge sull'originale, spese o decisioni riservate al proprietario.

Il documento è una proposta supplementare, non modifica automaticamente lo stato dei task e non certifica alcun avanzamento tecnico. Il MASTER CONTROL CENTER resta la fonte unica per stati e percentuali; il registro audit resta la fonte delle evidenze storiche. Claude deve verificare HEAD e CI correnti prima di usare qualunque SHA o stato riportato nei checkpoint.
