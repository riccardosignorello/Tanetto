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


## Sessione di audit — 2026-11-20, checkpoint successivo

### Stato Git e CI ricontrollato
- Ramo documentale: `audit/tanetto-full-review`, HEAD `c5332ae8a410662f28438587d0b4eeaa029fad80`; contiene solo il registro documentale aggiunto rispetto al ramo applicativo.
- Ramo applicativo di riferimento ancora a `07c55c6d8d5613c6a18760308df10d5d9a75a570`.
- Ramo age-gate ancora a `76b6a4fd801378ae07a5e7e92ab06dcf2441159a`; confronto aggiornato: 13 commit avanti e 0 indietro rispetto al ramo applicativo. Non integrato.
- Albero ricorsivo del ramo applicativo enumerato senza troncamento: 1.115 voci, 982 file e 133 directory. Ripartizione significativa: 217 file in `src/`, 37 in `tests/`, 16 in `tools/`, 15 plugin Java Android e 5 file di test Android. Le risorse grafiche/font sono numerose (280 WebP, 240 WOFF2): richiedono controllo dedicato di licenze, dimensioni, duplicati e uso.
- Ultime run CI disponibili: ramo applicativo run `44780309613` conclusa `failure`; ramo age-gate run `44784026945` conclusa `failure`. Le run più recenti sono quelle già registrate sopra; non risultano run successive sui due branch nella lista aggiornata. Non considerare i 190 controlli verdi come esito complessivo positivo.

### Area account, backup e autenticazione — esame preliminare
- `src/97n_account.js`: account facoltativo; configurazione Firebase; accesso Google/e-mail; backup automatico/manuale; scelta esplicita tra backup cloud e dati locali; uscita con tentativo di backup; eliminazione account con riautenticazione se richiesta. L'esame dei flussi non è ancora completo.
- `tools/firebase/fb_entry.js`: Firebase Auth + Firestore Lite; il backup è il documento `backups/{uid}`; App Check viene inizializzato solo se il client fornisce il provider nativo. Il codice documenta che, se il token manca o scade, la richiesta può proseguire senza token finché il progetto Firebase non impone App Check.
- `tools/firebase/firestore.rules`: accesso ai backup vincolato all'UID autenticato; documento con soli campi previsti, dimensione massima 800.000 caratteri; aggiornamento non più frequente di 10 secondi. Regole di proprietà e forma non equivalgono a verifica dell'età: il vincolo età resta lato client.
- `afterLogin()` legge il backup prima di completare la sessione e presenta una scelta quando esiste già uno stato locale; `backupNow()` usa un hash locale per evitare scritture inutili e attende la finestra minima. Da verificare ancora: collisioni/concorrenza tra dispositivi, backup obsoleto, cancellazione effettiva dei dati remoti, logout offline, migrazioni di schema, import/export e contenuto esatto di `packState()/unpackState()`.
- La chiave Firebase Web presente nel sorgente è una configurazione client pubblica, non va automaticamente classificata come segreto compromesso. La sicurezza dipende da regole, autenticazione, App Check e controlli server.

### Area acquisti e Tanì — esame preliminare
- `src/97o_billing.js` interroga Google Play per piani e pacchetti, legge gli acquisti posseduti, riconosce abbonamenti attivi, esegue acknowledge e accredita i pacchetti consumabili. Il plugin nativo `BillingPlugin.java` delega le operazioni a Google Play Billing.
- L'accredito dei pacchetti usa `S.paidTokens` come deduplicazione locale e conserva al massimo 200 token, eliminando i più vecchi; il consumo del token viene tentato dopo l'accredito e l'errore viene ignorato per consentire un nuovo tentativo. **Rischio da riprodurre, non bug confermato:** verificare se un token rimasto non consumato possa essere riaccreditato dopo l'evizione dalla lista, dopo un ripristino di backup, su un secondo dispositivo o in presenza di scritture concorrenti. Verificare anche acquisti in stato pending, restore, cancellazione/rimborso, abbonamento scaduto e indisponibilità rete.
- Lo stato Plus viene memorizzato in `S.plusOn` dopo interrogazione locale di Google Play; i vantaggi e i regali mensili dipendono anche da stato locale. Verificare coerenza dopo restore, clock manipulation, cambio account Play e periodi senza rete.
- Non è ancora stata completata la revisione del catalogo prodotti, dei prezzi effettivi Play Console, dei piani/base plan/offerte, dei messaggi legali e dei flussi di acquisto.

### Nuovo elemento da inventariare
| ID | Area | Osservazione | Stato | Gravità provvisoria | Prossimo controllo |
|---|---|---|---|---|---|
| AUD-011 | Acquisti/Tanì | Deduplicazione locale dei token limitata agli ultimi 200; consumo fallito ritentato al successivo restore | Rischio da riprodurre, non bug confermato | Alta | Simulare consumo fallito, oltre 200 acquisti, restore da backup vecchio, secondo dispositivo, pending/refund e concorrenza |

### Punto di ripartenza aggiornato
Fase invariata: **audit completo in sola lettura; nessuna modifica applicativa**.
Prossimo blocco: completare la lettura dei flussi account (inclusi `packState/unpackState`, cancellazione Firebase, limiti età) e acquisti (intero ciclo Google Play e Tanì); poi verificare inviti e premi, ads/consenso, backup e sicurezza server. Proseguire poi sulle funzionalità core, UX/accessibilità/localizzazione, performance, sito/SEO, release e strategia brand/social. Salvare le evidenze nel registro, senza promuovere ipotesi a bug confermati.


## Sessione di audit — 2026-11-20, checkpoint sicurezza età, ads e inviti

### Età e modalità protette — evidenza concreta sul ramo applicativo
- `src/98zf_v22_age.js` separa la scelta dell'età dallo stato generale: in Android la fonte è il plugin nativo `TanettoAge`; in browser è una chiave locale. Il modulo elimina il vecchio campo `S.age` da stato, copie e backup e mantiene `AGE_VALUE/AGE_READY` separati.
- Le fasce sono distinte: `ageBand()` per child/teen/adult/unknown; `ageAds()` converte unknown e under-18 in trattamento teen per gli annunci; `ageKid()` considera protetti i minori di 13 anni dichiarati e chi non dichiara l'età; `ageCloudOk()` consente account/backup solo alla fascia adult definita dalla soglia locale di consenso digitale.
- **Difetto confermato sul ramo `work/tanetto-1.0.12`:** `src/98zk_v26_fix.js` contiene ancora letture del vecchio `S.age`. In particolare `v26Young()` usa `ageYears(S.age)`; poiché `98zf` rimuove quel campo, anche un adulto correttamente riconosciuto da `ageBand()` può essere trattato come giovane. `v26TrackGate()` e `v26TrackFlush()` attendono a loro volta `S.age`, quindi la coda di statistiche può non essere mai scaricata. Questo spiega una parte dei fallimenti/minori e può sopprimere funzioni riservate agli adulti e analytics.
- Il ramo isolato `work/tanetto-1.0.12-agegate-fix` contiene correzioni candidate in più moduli e test di regressione; non sono ancora integrate né considerate definitive. L'audit deve confrontare ogni modifica con l'intero sistema e validare tutti i casi child/teen/adult/skip/unknown prima dell'eventuale integrazione.
- `AgeStorePlugin.java` salva in `noBackupFilesDir`, scrive in modo atomico e verifica la rilettura. La protezione one-time è implementata soprattutto nel flusso JavaScript: verificare esplicitamente se la chiamata nativa `set()` debba imporre anch'essa immutabilità e quali minacce locali si intendano coprire.
- Il modello resta di autodichiarazione locale: le regole Firestore non ricevono né verificano la fascia d'età. Non presentare questo come controllo server-side.

### Pubblicità — modello osservato, revisione ancora aperta
- `src/97zn_v19_ads.js` avvia gli annunci solo su Android, se l'età è pronta, non è child, non è attivo Plus e il prodotto è configurato. Usa `ageAds()`; il plugin nativo `AdsPlugin.java` rilegge autonomamente la scelta dal deposito locale nativo prima di inizializzare SDK/consenso.
- Per unknown/skip la scelta corrente è trattamento teen (TFUA, contenuti PG, non personalizzati) e video premio disponibili; per child dichiarato il plugin non avvia SDK, UMP o video. Questa è una scelta di prodotto/policy che va verificata contro le policy correnti di Google Play e AdMob, la dichiarazione di pubblico e la normativa dei mercati effettivamente serviti.
- Da completare: consenso UMP e revoca, privacy options, identificatori/telemetria, limiti giornalieri, premi dopo callback, passaggio Plus↔ads, cambio età, errori/retry, modalità offline e dichiarazioni Play Data Safety.

### Invita un amico — rischio di integrità da approfondire
- `src/98zx_n111_native.js` limita il flusso premi agli adulti e chiama il plugin nativo per ottenere un hash del dispositivo; l'amico riceve il premio dopo la registrazione server e chi invita interroga il contatore server.
- Le regole Firestore vincolano struttura, unicità del documento device, sequenza delle scritture e intervallo server di 36 ore; non possono però provare che l'hash inviato provenga da un dispositivo Android autentico né che corrisponda a tre giorni reali d'uso. Il client segnala i giorni e presenta la chiave di verifica.
- Il modello è quindi resistente a errori e abusi elementari, ma non è una prova antifrode forte contro un client modificato. Da valutare rischio economico massimo, costi Firebase, App Check, callable backend/attestazione e coerenza tra i 3 giorni richiesti dal prodotto e il minimo server di 36 ore. Non cambiare la logica prima della valutazione completa.

### Nuovi elementi nel registro
| ID | Area | Osservazione | Stato | Gravità provvisoria | Prossimo controllo |
|---|---|---|---|---|---|
| AUD-012 | Età/analytics/funzioni adulti | Letture residue di `S.age` in `98zk_v26_fix.js` dopo la migrazione a `AGE_VALUE` | Difetto confermato sul ramo applicativo | Alta | Confrontare patch del branch age-gate, cercare ogni riferimento legacy in tutti i moduli e testare tutti i flussi |
| AUD-013 | Inviti/anti-abuso | Impronta device e giorni d'uso arrivano dal client; Firestore controlla forma e tempo ma non attesta il dispositivo | Limite architetturale confermato; impatto da valutare | Media/Alta | Threat model e simulazioni abuso; valutare App Check/attestazione/server trusted |
| AUD-014 | Pubblicità/minori | Trattamento teen per età non dichiarata consente video premio non personalizzati | Comportamento confermato nel codice; conformità da verificare | Alta | Confronto aggiornato con policy Play/AdMob, UMP e leggi dei mercati |

### Punto di ripartenza
Audit sempre in sola lettura. Prossimo blocco: ricostruire integralmente la serializzazione e il ripristino dei progressi (incluse monete acquistate, età esclusa, migrazioni e trasferimenti), completare l'analisi di inviti e acquisti, poi proseguire su tutte le funzionalità principali e le relative prove. Non integrare il branch age-gate e non correggere ancora il codice.


## Sessione di audit — 2026-11-20, checkpoint CI/CD, build e informativa

### CI/CD e dipendenze — configurazione verificata
- `.github/workflows/tests.yml` si attiva sia su `push` sia su `pull_request`, dichiara `permissions: contents: write` a livello workflow e include uno step che ricostruisce file generati, esegue `git commit` e tenta `git push origin "$GITHUB_REF_NAME"`. Questo è un problema concreto di separazione dei privilegi: i test di una pull request non dovrebbero avere permessi di scrittura né pubblicare artefatti sul branch. Per PR da fork GitHub normalmente limita il token, ma ciò non rende sicuro il disegno per PR interne o per eventi futuri. La soluzione va pianificata come workflow separati: test read-only su push/PR; generazione e commit artefatti solo su push autorizzato al branch previsto, con permessi minimi e condizioni esplicite.
- Lo stesso workflow usa action esterne tramite tag di versione (`checkout@v5`, `setup-node@v5`, `setup-java@v4`, `setup-android@v3`) e installa tool npm con versioni fissate in parte. Da valutare pinning a SHA, aggiornamento controllato e dipendenze riproducibili.
- `.github/workflows/android.yml` ha anch'esso `contents: write`, usa un'azione release di terze parti per pubblicare un APK di prova su un tag fisso e pubblica diagnostica in caso di errore. Va verificato il rischio di sovrascrittura/tag, l'integrità dell'APK di prova, la provenienza dei workflow e i permessi strettamente necessari.
- `app-android/package.json` espone uno script `test` placeholder che fallisce intenzionalmente; i test reali sono eseguiti da Gradle e da Python, ma i comandi devono essere documentati e lo script placeholder non deve essere scambiato per una suite funzionante.
- `tools/build.py` concatena sorgenti JS/CSS ordinati e genera artefatti del sito e dell'app. `index.html`, `privacy.html`, `elimina-account.html` e altri file generati non vanno modificati manualmente: verificare sorgenti, determinismo, hash, build ripetibili e differenze tra build web/Android.
- `app-android/android/app/build.gradle` mantiene versionCode 114 / versionName 1.0.11, nonostante il ramo sia 1.0.12; non effettuare bump fino alla release. La chiave release è cercata fuori dal repository (default storico `/home/claude/chiavi`, sovrascrivibile con `TANETTO_KEYS`): va resa portabile e documentata senza introdurre chiavi o password nel repository. App Check è attualmente disattivato quando mancano entrambe le proprietà Firebase Android richieste.
- `AndroidManifest.xml` mantiene `allowBackup=true` per progressi/widget e usa regole esplicite; la scelta età nativa è separata in `noBackupFilesDir`. Va verificato ogni dato incluso/escluso, anche nelle copie del WebView e nei trasferimenti Android.

### Privacy e cancellazione — incoerenza verificata
- Il file generato `privacy.html` dichiara che il backup Google include anche l'età. Questo contraddice l'implementazione Android esaminata: l'età è in `getNoBackupFilesDir()`, esclusa dal backup, e le vecchie copie locali vengono ripulite. La dichiarazione deve essere riscritta in modo preciso e distinto per Android e browser, dopo avere verificato tutti i percorsi di esportazione/ripristino.
- La stessa informativa afferma che i dati restano solo sul telefono senza account, ma più avanti descrive backup Google automatico e backup Firebase facoltativo. Occorre spiegare chiaramente la differenza tra backup Android, memoria locale, backup Firebase e file esportato.
- `elimina-account.html` dichiara che l'account e il backup online vengono eliminati definitivamente. Va verificato end-to-end che il pulsante in app rimuova il documento Firestore, l'utente Firebase Auth, eventuali sottodocumenti/registrazioni e dati derivati, e che la pagina web di cancellazione faccia la stessa cosa. Controllare anche la gestione dell'abbonamento Google Play, che non viene necessariamente annullato eliminando l'account.
- La dichiarazione iniziale di `privacy.html` presenta Tanetto come progettato dai 13 anni in su e protetto per chi è più giovane o non dichiara l'età. Va confrontata con la configurazione reale Play Console, le fasce, gli annunci e l'accessibilità effettiva delle funzioni.

### Nuovi elementi nel registro
| ID | Area | Osservazione | Stato | Gravità provvisoria | Prossimo controllo |
|---|---|---|---|---|---|
| AUD-015 | CI/CD/supply chain | Workflow di test con permesso globale `contents: write` e commit/push generati nello stesso job che gestisce pull request | Configurazione confermata; rischio operativo concreto | Alta | Separare workflow, ridurre permessi, testare PR interne/esterne e proteggere branch |
| AUD-016 | Privacy/backup | Informativa dice che età è inclusa nel backup Google; implementazione Android la esclude dal backup | Contraddizione confermata per Android | Alta | Verificare browser, export/import, migrazione, backup e riscrivere informativa in 14 lingue |

### Punto di ripartenza
Audit in sola lettura. Prossimo blocco: esaminare completamente i flussi di esportazione/importazione, firma e ripristino (inclusi i controlli di `98x_v20_secure.js` e i campi economici), poi completare cancellazione account e backup. Proseguire con sito, SEO, performance, accessibilità, distribuzione, release e tutte le altre aree. Non applicare ancora correzioni.


## Sessione di audit — 2026-11-20, checkpoint import/export e cancellazione account

### Copie, trasferimenti e ripristino — flussi esaminati
- `src/97h_ios.js` implementa `packState()/unpackState()`: serializza JSON dello stato, usa `CompressionStream('deflate-raw')` quando disponibile e codifica in Base64 URL-safe; altrimenti usa JSON non compresso. L'importazione cerca il prefisso `TANETTO0/1`, decodifica/decomprime e fa `JSON.parse`.
- `src/97v8.js` esporta file JSON e importa tramite `FileReader`; dopo il controllo superficiale di `app/state/pet`, apre la conferma di ripristino.
- `src/98x_v20_secure.js` aggiunge sanificazione dei dati, controlli di tipo, limiti sui campi e una firma di integrità client-side; rimuove da importazioni `age`, `plusOn`, `plusCheck`, `plusSince`, `dev` e la coda analytics, poi conserva Plus solo se confermato sul dispositivo. Il codice stesso riconosce che la firma non è una protezione assoluta, perché la chiave è incorporata nel client: va considerata un controllo anti-manomissione di base, non una firma crittografica verificabile da un server.
- `src/98zf_v22_age.js` elimina il vecchio campo età da stato, copie e backup; il modulo Android legge la scelta solo dal deposito nativo no-backup, mentre il browser la conserva localmente. La scelta non dovrebbe viaggiare nei file o nei codici.

### Rischi da riprodurre su importazione
- **Limiti di dimensione assenti prima del parsing:** `unpackState()` non impone un tetto alla lunghezza del codice, alla dimensione dei byte compressi o alla dimensione massima del testo decompresso prima di `JSON.parse`. `readBackup()` non controlla `file.size` prima di leggere il file. La sanificazione successiva limita profondità/numero di elementi ma arriva dopo decompressione e parsing. Rischio: file malevolo o accidentalmente enorme può saturare memoria o bloccare il WebView. Classificazione provvisoria: rischio concreto, gravità alta; da testare con file sovradimensionati e compressione anomala.
- **Possibile gara nella verifica della firma del file:** il wrapper di `readBackup()` in `98x_v20_secure.js` avvia `file.text().then(...secVerify...)` ma chiama subito il vecchio `readBackup()`, che usa un altro lettore asincrono (`FileReader`). Il pulsante di conferma usa il valore globale `secLastTrust`; non c'è una garanzia esplicita che la verifica `file.text()` sia terminata prima che l'utente possa confermare. Da riprodurre con file grandi/lenti e verificare se copie legittime possono essere trattate come non firmate e quindi avere Tanì/oggetti/livello ridotti.
- `unpackState()` accetta un match non ancorato e non verifica esplicitamente che il contenuto finisca subito dopo il payload; da valutare come robustezza del parser, non ancora classificato come vulnerabilità.
- La copia Android passa dal plugin nativo di condivisione; il wrapper età rimuove `S.age` prima di esportare. Va completata una prova su backup Android automatico, copia manuale, codice di trasferimento, backup Firebase, ripristino su stesso telefono e telefono nuovo.
- La logica anti-frode delle copie usa la firma client e limiti economici; non equivale a validazione server di acquisti Google Play. Valutare esplicitamente il confine tra protezione dei progressi e protezione di valore monetario.

### Cancellazione account — difetto concreto
- `tools/firebase/fb_entry.js` implementa `remove()` nell'ordine: prima `deleteDoc(ref())` (backup Firestore), poi `deleteUser(auth.currentUser)`.
- La cancellazione Firebase Auth può richiedere una riautenticazione recente. Nell'app `src/97n_account.js` la prima chiamata può quindi cancellare il backup e poi fallire con `requires-recent-login`; la riautenticazione viene proposta solo dopo il fallimento. La pagina pubblica `elimina-account.html` chiama direttamente `remove()` e, in caso di riautenticazione richiesta, esce dall'account e invita a rientrare. In entrambi i casi il backup può essere già stato cancellato mentre l'account resta attivo.
- **Difetto confermato nel flusso di cancellazione:** la cancellazione del backup precede la verifica che l'account possa essere eliminato. Rischio di perdita irreversibile del backup se la riautenticazione viene annullata, fallisce o l'utente non completa il secondo accesso. Soluzione da progettare: riautenticare prima di qualsiasi cancellazione, poi cancellare in modo coordinato account e dati; valutare una Cloud Function/Admin SDK o un protocollo ripetibile e idempotente che non lasci account orfani o backup cancellati a metà.
- Il testo pubblico promette eliminazione definitiva: occorre verificare anche gli eventuali dati di autenticazione, log, TTL degli inviti, retention dei provider e annullamento separato dell'abbonamento Google Play.

### Nuovi elementi nel registro
| ID | Area | Osservazione | Stato | Gravità provvisoria | Prossimo controllo |
|---|---|---|---|---|---|
| AUD-017 | Account/cancellazione | `remove()` cancella il backup Firestore prima di `deleteUser()`; la riautenticazione può fallire dopo che il backup è già sparito | Difetto confermato nel flusso | Alta | Riprodurre su app e pagina web; progettare cancellazione idempotente senza perdita anticipata |
| AUD-018 | Import/export/sicurezza | Nessun limite preventivo evidente a dimensione file/codice o output decompresso prima del parsing JSON | Rischio concreto da testare | Alta | Test file grandi, decompression bomb, JSON profondo, memoria limitata e fallback |
| AUD-019 | Import/export/integrità | Verifica firma file asincrona separata da FileReader e usa stato globale `secLastTrust` | Possibile race condition | Media/Alta | Testare file piccoli/grandi, letture concorrenti e conferma immediata |

### Punto di ripartenza
Audit ancora in sola lettura. Prossimo blocco: completare i test statici e funzionali di import/export e serializzazione, approfondire acquisti e backup, quindi passare alle funzioni core (obiettivi, diario, chat, viaggi, stagioni, giochi, negozio, notifiche e widget) con mappa dipendenze e copertura dei test. Salvare ogni nuova evidenza nel registro; nessuna patch applicativa prima del piano completo.


## Sessione di audit — 2026-11-20, mappa delle prove automatiche

### Copertura test esistente — inventario completato per `tests/t110/`
Sono stati letti intestazioni, obiettivi e funzioni principali dei 32 file della suite:
- Prodotto e cura: calma, cura, diario, storie, voci, momenti, animazioni, giochi, eventi, musica, settimana, icone, UI e rifiniture.
- Età, sicurezza e benessere: pubblico/minori, annunci senza pubblicità per child, frasi di crisi e falsi positivi, numeri di aiuto, statistiche, modalità protetta.
- Economia e dati: monete, obiettivi, import/export, backup, ripristino, stato economico, acquisti simulati, inviti e premi.
- Qualità tecnica: offline, accessibilità, contrasto, performance, sito, licenze, condizioni, plugin Android, backup Android, widget, notifiche, suoni.
- Infrastruttura: helper Playwright, test Firestore Emulator, test nativi e snapshot widget.

### Limiti della copertura da considerare
- La maggior parte dei test app usa Chromium/Playwright e plugin Capacitor/Firebase/Ads simulati. Sono essenziali per regressioni ma non provano da soli i comportamenti reali di Google Play Billing, Play Integrity, AdMob/UMP, Firebase Auth/Firestore in produzione o hardware Android reale.
- I test inviti provano le regole Firestore con emulator e un tempo abbreviato; non provano l'autenticità dell'impronta device né un threat model di client modificato.
- Esistono test di policy età Android, ma non risulta ancora una suite diretta completa per tutte le condizioni di persistenza, corruzione, scrittura atomica, backup/restore e race del plugin `AgeStorePlugin`.
- La copertura acquisti va rafforzata per errori di consume/acknowledge, token ripetuti, restore su dispositivo nuovo, più di 200 token, rimborso, cancellazione e account Play diversi.
- I test del sito e delle 14 lingue sono in gran parte statici/simulati; vanno aggiunti controlli live di canonical, sitemap, robots, structured data, Core Web Vitals, link rotti, accessibilità reale e indicizzazione.
- Mancano prove end-to-end affidabili con device Android fisico e account di test Play per widget, notifiche, share sheet, acquisti, App Check e comportamento di ripresa da background. Va pianificata una matrice di dispositivi/versioni Android.
- La suite non è verde: i 9 file falliti e il test snapshot con differenza di un'ora già elencati restano aperti; non vanno chiusi aggiornando semplicemente gli snapshot o allargando le soglie.

### Nuovo elemento nel registro
| ID | Area | Osservazione | Stato | Gravità provvisoria | Prossimo controllo |
|---|---|---|---|---|---|
| AUD-020 | Qualità/test | Ampia suite automatizzata, ma molte integrazioni sono mock e mancano verifiche reali su Play/Firebase/AdMob/device | Gap di copertura confermato | Media/Alta | Definire matrice test reali, test plugin nativi e criteri di release |

### Punto di ripartenza
Audit in sola lettura. Prossimo blocco: esaminare sicurezza del boot/salvataggio e gestione dell'orologio, poi completare la mappa delle funzioni core e verificare i fallimenti CI uno per uno solo dopo aver raccolto tutte le dipendenze. Continuare a salvare il registro documentale nel branch dedicato; il codice applicativo resta immutato.
