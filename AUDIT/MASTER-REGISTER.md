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


## Sessione di audit — 2026-11-20, checkpoint inviti e integrità dei premi

### Inviti: threat model approfondito
- `n111Qualify()` registra nel client i giorni d'uso in `S.n111.from.days` e invia `invQualify(code,cid,k)` dopo tre date distinte. Le regole Firestore non ricevono la lista dei tre giorni: verificano solo che la chiave `k` corrisponda all'hash `kh` e che siano trascorse almeno 36 ore dal primo arrivo.
- **Bypass riproducibile a livello di protocollo:** un client modificato può invocare direttamente `invQualify()` dopo 36 ore senza attendere tre giorni distinti. Il vincolo dei tre giorni è quindi applicato dal client ufficiale, non dal server. Non è una garanzia antifrode server-side.
- **Rischio duplicazione premi dell'invitante:** `n111CheckRewards()` legge il contatore server `q`, ma la posizione già pagata `got` è conservata solo in `S.n111.own.got`. Il server non registra in modo autorevole quanti premi sono già stati consegnati all'invitante. Un ripristino di un backup/copia firmata più vecchia, o un client che ripristina `got`, può ricalcolare `q - got` e accreditare nuovamente premi già ricevuti. Il limite `N111_MAX=3` è anch'esso lato client. Da verificare con una riproduzione controllata prima di quantificare l'impatto, ma la mancanza del contatore server di payout è strutturale.
- Il premio di 50 Tanì all'amico è registrato dopo la creazione server della claim; il documento `devs/{dev}` limita il riutilizzo della stessa impronta, ma l'impronta è derivata da Android ID e non è attestata dal server. Emulazione/root/client modificato possono simulare altri ID.
- Il server non autentica gli utenti per gli inviti; questo è coerente con la promessa “senza account”, ma rende ancora più importante un ledger server-side non manipolabile per limiti, idempotenza e premi.
- Soluzione da valutare: backend fidato (Cloud Functions/Run con Admin SDK) per validare install referrer/attestazione quando disponibile, registrare eventi d'uso attendibili e consegnare i premi con transazione idempotente e contatore payout server-side. Non introdurre account obbligatorio senza valutazione prodotto/privacy.

### Nuovo elemento nel registro
| ID | Area | Osservazione | Stato | Gravità provvisoria | Prossimo controllo |
|---|---|---|---|---|---|
| AUD-021 | Inviti/economia | Payout invitante dedotto da `q - got`, ma `got` è solo locale; il server non memorizza il payout già eseguito | Rischio strutturale di doppio accredito | Alta | Riprodurre con backup firmato obsoleto e restore ripetuto; progettare ledger server idempotente |
| AUD-022 | Inviti/anti-abuso | Le 3 date d'uso sono verificate dal client; le regole server impongono soltanto 36 ore | Bypass di protocollo confermato | Media/Alta | Simulare chiamata diretta dopo 36 ore; decidere una verifica server attendibile |

### Punto di ripartenza
Audit in sola lettura. Prossimo blocco: continuare il threat model di economia e premi, poi esaminare in profondità obiettivi, serie, stagioni, viaggi, diario, chat, crisi, giochi, negozio, oggetti, capsule, notifiche e widget. Ogni rischio resta separato tra difetto dimostrato, limite architetturale e ipotesi da riprodurre.


## Sessione di audit — 2026-11-20, diagnosi comparata delle CI

### Risultati riletti direttamente dai log integrali
- Ramo applicativo: run `44780309613`, job `136440981358`, commit `07c55c6d8d5613c6a18760308df10d5d9a75a570`, conclusione failure.
- Ramo age-gate: run `44784026945`, job `136454007442`, commit testato `7818484ba68fcad21e3e892973fed9043a48697d`, conclusione failure. Il branch è poi avanzato a `76b6a4fd801378ae07a5e7e92ab06dcf2441159a`: quella CI **non certifica il suo HEAD attuale**.
- In entrambi i log il test `t_110_decisions.py` fallisce soprattutto su vecchi controlli che cercano `S.age` o si aspettano che `ageSet()` sia sincrona; dopo la migrazione la scelta è in `AGE_VALUE` e la scrittura è asincrona. Sono test probabilmente da aggiornare, ma va verificato che non nascondano regressioni reali.
- Il test `t_111_audience.py` fallisce sul caso “età mai chiesta”: si aspetta video premio e inizializzazione ads, ma il codice `adsOn()` richiede anche `AGE_VALUE !== undefined`. La contraddizione tra commenti/policy di prodotto e condizione effettiva è confermata; non è soltanto un test obsoleto.
- `t_113_kids_noads.py` fallisce anch'esso sul caso `none` (età non ancora scelta) e non trova pulsanti video. Conferma indipendente del punto precedente. Gli altri fallimenti del test includono etichette/aspettative da verificare rispetto ai testi effettivi.
- `t_111_icons.py`: in italiano, tedesco, spagnolo, francese e olandese, a 360 px alcuni nomi delle icone risultano spezzati o troppo lunghi. È un problema di presentazione/accessibilità localizzato e riproducibile, non un problema di logica.
- `t_111_events.py`: il confronto prestazionale con evento attivo supera la soglia di lavoro per frame nel run feature; va riprodotto su runner stabile e dispositivo reale prima di decidere se è regressione o rumore del runner.
- `t_111_polish.py`: due controlli sull'attivazione settimanale della stella/evento non rilevano il comportamento atteso nel run applicativo; da confrontare con le modifiche del ramo e con la data simulata.
- `t_111_week.py` e `t_110_story.py`: terminano con eccezione. Il workflow stampa solo la riga “Traceback” e non le righe successive, quindi la causa non è diagnosticabile dai log pubblicati.
- `t_b1_minors.py`: sul ramo applicativo gli adulti risultano trattati come giovani (offerta Plus, invito, onboarding Plus, promemoria, statistiche e fascia età). Questo è coerente con il riferimento obsoleto a `S.age` in `v26Young()`; sul ramo age-gate restano due controlli della scheda Privacy da verificare.
- `t_b2_money.py`: un controllo non trova la finestra di scelta del ripristino; va diagnosticato separando timing UI, fixture e logica del backup.
- `t_b8_legal_native.py` e `t_113_sfx.py`: fallisce il controllo del link per cancellazione account nella scheda protetta. Il testo della scheda mostra il messaggio “backup online non disponibile” ma non il link atteso: verificare il requisito prodotto e la funzione effettiva della pagina di cancellazione per chi non può usare account.
- `t_b9_site.py` sul ramo applicativo: 5 NO / 157 OK; sul run del ramo age-gate: 0 NO / 190 OK. Il test ha più parti; il ramo age-gate supera la parte finale del sito, ma la CI generale resta fallita.

### Problema di osservabilità della CI
- Lo step di test salva l'output completo in `/tmp/tanetto-test.log`, ma poi stampa solo `grep ... | head -20`; in caso di eccezione il log completo viene perso al termine del runner. Non viene caricato un artifact diagnostico per ogni test fallito. Questo ha impedito di diagnosticare i traceback di `t_110_story.py` e `t_111_week.py`.
- Correzione da inserire nel piano generale: conservare un log distinto per ogni test e caricare un artifact sempre disponibile quando il job fallisce; stampare un riassunto compatto senza cancellare il traceback completo. Non aumentare timeout o allargare soglie senza una causa dimostrata.

### Nuovi elementi nel registro
| ID | Area | Osservazione | Stato | Gravità provvisoria | Prossimo controllo |
|---|---|---|---|---|---|
| AUD-023 | Ads/età | `adsOn()` esclude `AGE_VALUE === undefined`, quindi chi non ha ancora risposto non riceve video, nonostante commenti e test dicano trattamento teen | Incoerenza di comportamento confermata | Media/Alta | Decidere comportamento voluto e verificare policy AdMob/Play prima di correggere |
| AUD-024 | CI/osservabilità | Traceback e log completi dei test falliti vengono scartati dal runner | Gap diagnostico confermato | Media | Artifact per test, log integrali e riproduzione locale/CI |
| AUD-025 | UX/localizzazione | Nomi delle icone si spezzano a 360 px in cinque lingue | Difetto UI confermato dai test | Media | Correggere layout senza ridurre leggibilità/accessibilità |
| AUD-026 | Prestazioni | Animazioni evento superano la soglia del test nel run feature | Da riprodurre | Media | Profilare su runner stabile e Android fisico |
| AUD-027 | Contenuti/UX | Test settimana/story hanno eccezioni o mismatch di contenuto; causa nascosta dal logging | Non diagnosticato | Media | Recuperare stack trace e riprodurre ogni caso |

### Punto di ripartenza
Audit in sola lettura. Prima di correggere qualsiasi test, stabilire se è obsoleto o se segnala un comportamento reale; nessun “verde” ottenuto modificando aspettative senza motivazione. Prossimo blocco: continuare su funzioni core e mappa di dipendenze; mantenere distinti i risultati del ramo applicativo e del ramo age-gate e non considerare testata la HEAD del feature branch finché non parte una nuova CI su quel commit.


## Sessione di audit — 2026-11-20, sicurezza del benessere e accesso alla cancellazione

### Funzione di rilevamento delle crisi — revisione iniziale
- `src/98zk_v26_fix.js` contiene il motore base; `src/98zl_v110_safety.js` aggiunge normalizzazione multilingue, varianti con/senza apostrofi e accenti, parole forti/deboli, negazioni, contesto, frasi spezzate e livello di risposta. Le risposte sono locali e statiche: il testo non viene inviato a un servizio IA remoto.
- Il riconoscimento è collegato a chat, diario, “Lascia andare” e capsule; il testo non viene salvato come etichetta di crisi. Dopo una frase rilevata si sospendono per un periodo le offerte commerciali, le richieste di recensione e alcune feste automatiche.
- I test includono frasi positive, negazioni, falsi positivi idiomatici e frasi nuove in più lingue; le liste di test sono separate dal codice. Questo è un buon punto di partenza, ma non dimostra copertura clinica o linguistica completa.
- `docs/HELPLINES_FONTI.md` documenta fonti e data di verifica (14/11/2026) per linee di aiuto e numeri di emergenza in vari Paesi. Il codice usa il fuso orario del dispositivo per selezionare il Paese; se il fuso è sconosciuto mostra il numero di emergenza locale generico e `findahelpline.com`.
- **Revisione necessaria ad alto impatto:** revisione indipendente da professionisti qualificati in salute mentale e revisori madrelingua; misurazione separata di falsi negativi/falsi positivi; verifica periodica delle linee telefoniche e copertura territoriale; messaggi chiari che l'app non è un servizio di emergenza, terapia o assistenza umana in tempo reale. Un rilevatore a parole chiave non deve essere presentato come garanzia di protezione.

### Accesso alla cancellazione per chi ha già un account ma ora è minorenne
- `tests/t110/t_b8_legal_native.py` contiene un controllo esplicito: utente child con account preesistente deve poter raggiungere `elimina-account.html` dalla scheda Account.
- Nel ramo applicativo esaminato, `acctCard()` in `src/97n_account.js` mostra, se non autenticato, solo i pulsanti per accedere/registrarsi; non espone un collegamento alla pagina di cancellazione. Se la scelta età porta `ageCloudStop()` a uscire dall'account e cancellare lo stato locale dell'account, un utente minorenne con account già esistente non ha un percorso evidente nell'app per eliminare il profilo e il backup remoto.
- **Lacuna di accessibilità alla cancellazione confermata sul ramo applicativo:** il requisito del test non è soddisfatto. È anche un problema di privacy/compliance da valutare, non soltanto un controllo UI: l'utente deve poter esercitare la cancellazione senza poter continuare a usare il backup cloud. Va predisposto un percorso sicuro di eliminazione e riautenticazione, con istruzioni comprensibili e senza consentire l'uso ordinario dell'account.
- La pagina pubblica di cancellazione usa Firebase Auth direttamente e non dipende dal gate client dell'app; verificare che sia raggiungibile da un link persistente, anche quando l'app ha effettuato il logout automatico.

### Nuovi elementi nel registro
| ID | Area | Osservazione | Stato | Gravità provvisoria | Prossimo controllo |
|---|---|---|---|---|---|
| AUD-028 | Benessere/sicurezza | Rilevamento crisi basato su parole chiave e linee di aiuto locali; necessita validazione professionale, linguistica e territoriale | Gap di validazione confermato | Molto alta | Revisione clinica/linguistica indipendente, test di falsi negativi e verifica fonti/claim |
| AUD-029 | Privacy/account/minori | La scheda account non mostra il collegamento di cancellazione a chi è già disconnesso; il test dedicato fallisce | Lacuna UI confermata | Alta | Progettare percorso cancellazione per account preesistenti/minori e provarlo end-to-end |

### Punto di ripartenza
Audit in sola lettura. Prossimo blocco: verificare il percorso account/minori e le pagine pubbliche; completare la revisione del motore di crisi e dei testi; poi proseguire su obiettivi, serie, regali, viaggi, diario, giochi, negozio, capsule, notifiche, widget e tutti i moduli restanti. Nessuna modifica applicativa prima dell'inventario completo.


## Sessione di audit — 2026-11-20, economia virtuale e acquisti

### Regole economiche — ulteriori rischi rilevati
- `xvUsable()` riserva per gli Introvabili i Tanì classificati come pagati: saldo meno `max(0, paid - spentN)`. Il codice di `98ze` e la nuova logica di `98zk` aggiornano `spentN` aggiungendo l'intera spesa `d`, purché `paid > spentN`; non limitano l'incremento a `min(d, paid - spentN)`.
- **Caso limite dimostrabile dal calcolo:** se restano 50 Tanì classificati come pagati e si spendono 100 Tanì in un acquisto normale, `spentN` aumenta di 100 invece che di 50. I successivi 50 Tanì acquistati possono quindi risultare già “spesi” nel conteggio e diventare utilizzabili per gli Introvabili senza essere stati spesi davvero. Il test attuale controlla un caso in cui la spesa è inferiore al residuo pagato, non il superamento del residuo.
- Il regalo mensile Plus e i premi del sentiero d'oro sono marcati intenzionalmente come “pagati” nel bucket economico per non accorciare il percorso degli Introvabili; questa è una regola di prodotto esplicita, non un errore da correggere senza decisione.
- `n111Paid()` applica la stessa classificazione ai premi invito: anche questi non accorciano gli Introvabili. La distinzione economica reale è quindi “Tanì utilizzabili per Introvabili” e non semplicemente “acquistati con denaro”; documentazione e testi devono essere coerenti.

### Plus: rischio di riaccredito del regalo mensile
- `plusMonthly()` concede 750 Tanì e 2 scudi una volta al mese usando `S.plusMonth` come cursore locale. `98zk` registra il valore nel bucket `econ().paid`, ma il cursore mensile resta nello stato locale.
- `secSanitizeImport()` rimuove `plusOn`, `plusCheck`, `plusSince`, ma non `plusMonth`; il backup può quindi riportare un cursore mensile precedente. Non risulta un registro server-side del mese già pagato.
- **Rischio da riprodurre:** ripristinando una copia firmata precedente al regalo mensile, dopo che Play ha riconfermato Plus, il client potrebbe vedere `S.plusMonth` diverso dal mese corrente e concedere nuovamente i 750 Tanì e gli scudi. Da testare con backup prima/dopo regalo, cambio dispositivo e riapertura.
- Soluzione da valutare: mantenere localmente il cursore più recente durante il restore e/o usare un ledger server idempotente del beneficio mensile, senza perdere la possibilità di uso offline.

### Consegna degli acquisti: transazione non completamente atomica
- `98x_v20_secure.js` esegue un controllo preliminare che `save()` riesca prima di delegare a `creditPack()`. Il flusso di `97o_billing.js` aggiunge poi il token a `S.paidTokens`, accredita i Tanì, chiama `save()` e tenta il consumo Google Play anche se il salvataggio successivo non ha esito positivo. Il controllo preliminare dimostra che lo storage era scrivibile prima dell'accredito, non che il token sia stato salvato in modo durevole dopo l'accredito.
- **Rischio di perdita dell'acquisto:** se il secondo salvataggio fallisce per quota/storage o crash, il token può essere consumato da Google Play senza che il marker di deduplicazione sia persistito; alla riapertura il credito non è più ricostruibile dal token consumato. Va verificato con storage pieno, crash tra accredito/salvataggio/consumo e test del plugin.
- Il ciclo di acquisto si basa sulla risposta locale di Google Play Billing e sullo stato locale; non risulta una verifica server-side del token tramite Google Play Developer API né un ledger server di consegna/rimborso. È un limite antifrode e di riconciliazione, da valutare in proporzione al valore economico reale dei Tanì e al modello offline.

### Nuovi elementi nel registro
| ID | Area | Osservazione | Stato | Gravità provvisoria | Prossimo controllo |
|---|---|---|---|---|---|
| AUD-030 | Economia/Introvabili | `spentN` cresce dell'intera spesa invece che del solo residuo pagato; può sbloccare Tanì acquistati successivamente | Difetto logico nel caso limite | Alta | Testare spesa oltre residuo pagato, nuovi pacchetti e tutte le categorie di spesa |
| AUD-031 | Plus/backup | `plusMonth` resta importabile e il beneficio mensile non ha ledger server; un backup precedente può ripetere il regalo | Rischio da riprodurre | Alta | Test restore pre/post regalo, dispositivo nuovo e retry billing |
| AUD-032 | Acquisti/persistenza | Il consumo Google Play può seguire un salvataggio del token non riuscito; manca conferma durevole post-accredito | Rischio di perdita acquisto | Alta | Fault injection su storage pieno/crash e rendere consegna/consumo idempotenti |

### Punto di ripartenza
Audit in sola lettura. Prossimo blocco: completare la mappa delle fonti di guadagno/spesa, ricompense, scudi, sentiero stagionale e acquisti; poi analizzare in profondità obiettivi, diario, viaggi, giochi, capsule, widget e notifiche. Il piano finale dovrà includere una riconciliazione economica completa e test di rollback/restore.


## Sessione di audit — 2026-11-20, diario, social e notifiche

### Dipendenze del difetto di età — impatto oltre al Profilo
- `w111Name()` in `src/98zu_v111_week.js` usa `v26Young()` per decidere se mostrare il nome personale del compagno. Nel ramo applicativo, il riferimento legacy a `S.age` fa risultare giovani anche gli adulti: le cartoline settimanali mostrano quindi il nome predefinito invece del nome scelto, in story e formato quadrato, in tutte le lingue. Questo spiega i controlli di contenuto falliti in `t_111_week.py` e parte delle anomalie di `t_110_story.py`.
- La stessa funzione `v26Young()` è un punto centrale: influisce su offerta Plus, inviti, statistiche, contenuti di condivisione, uso del nome scelto e funzioni riservate agli adulti. La correzione deve essere verificata con una matrice unica di tutte le dipendenze, non solo con il test minori.
- `98zu_v111_week.js` genera PNG 1080×1920 e 1080×1080, prepara i font e crea il testo di condivisione con UTM. Le regole correnti consentono la condivisione ai teen ma mostrano il nome standard; il nome personale è riservato agli adulti. Da verificare in tutte le 14 lingue, anche con nomi lunghi, caratteri polacchi/turchi, font non caricati e dispositivo lento.
- `98zt_v110_diary.js` separa domanda del giorno e diario libero; le risposte restano nel modello locale e passano dal controllo delle frasi di crisi. La sincronizzazione cloud, se scelta da un adulto, può includere testi personali del diario: informativa, backup, cancellazione ed esportazione devono descriverlo senza ambiguità.
- `98zv_v111_icons.js` prova a ridurre i nomi delle icone fino a 9,5 px e poi permette il ritorno a capo; il test a 360 px rileva ancora parole spezzate/overflow in cinque lingue. La correzione deve mantenere leggibilità e dimensioni accessibili, non risolvere semplicemente rimpicciolendo tutto.
- `98zw_v111_events.js` usa SVG/GSAP per le decorazioni stagionali; il test prestazionale misura fotogrammi, ricalcoli di stile, layout e CPU. Va valutato su dispositivi di fascia bassa e con animazioni ridotte, non solo sul runner CI.

### Promemoria e prova Plus
- `98zn_v110_care.js` memorizza localmente la data di fine della prova Plus, ricavata dall'acquisto Play e dalla durata dell'offerta; programma una notifica due giorni prima e una scheda in Oggi. La cancellazione in Google Play viene rilevata al successivo aggiornamento acquisti e annulla la notifica locale.
- **Rischio UX da verificare:** se l'utente annulla la prova in Google Play mentre Tanetto è chiuso, la notifica già programmata può restare sul dispositivo e partire comunque; il codice può cancellarla soltanto quando l'app torna a sincronizzare gli acquisti. Il testo potrebbe quindi invitare a disdire una prova già disdetta. Testare annullamento a app chiusa, riapertura prima/dopo la data, offline e permessi notifiche negati.
- La prova è legata a un acquisto avviato dall'app (`plusTrialPend`) e viene associata al token Play per ricostruire la data di scadenza. Verificare offerte/base plan reali in Play Console, fusi orari, cambio dispositivo, reinstallazione, rinnovo, rimborso e passaggio a Plus pagato.
- I promemoria ordinari sono programmati in anticipo; dopo una frase difficile vengono riscritti con testi di sola compagnia per la sessione/periodo di quiete. Va testato il caso crash/chiusura immediata dopo il rilevamento, per assicurare che non restino notifiche inappropriate già programmate.

### Nuovo elemento nel registro
| ID | Area | Osservazione | Stato | Gravità provvisoria | Prossimo controllo |
|---|---|---|---|---|---|
| AUD-034 | Abbonamenti/notifiche | Notifica locale di fine prova può restare programmata se la prova viene annullata mentre l'app è chiusa | Rischio UX da riprodurre | Media | Testare annullamento Play con app chiusa e sincronizzazione successiva |

### Punto di ripartenza
Audit in sola lettura. Prossimo blocco: esaminare viaggi, stagioni, obiettivi, regali, album, giochi e interazioni; poi verificare il comportamento di tutte le notifiche e i permessi Android. Integrare le dipendenze del gate età nel piano generale.


## Sessione di audit — 2026-11-20, integrità dei backup ed economia anti-manomissione

### Difetti strutturali nella validazione dei backup — gravità alta
- `secSig()` usa una chiave costante incorporata nel JavaScript distribuito. Il codice documenta correttamente che non è una protezione assoluta: chi analizza il bundle può ricostruire la firma. Va trattata solo come rilevamento di modifiche casuali/elementari, mai come prova di autenticità o come confine di sicurezza.
- `secStrict()`, usato quando una copia non ha firma valida, calcola una quota di Tanì che può includere fino a 10 token presenti nella copia ma non sul dispositivo corrente, attribuendo a ciascuno il valore di un pacchetto massimo. I token importati sono contati se sono semplici stringhe non vuote; non viene verificato che siano acquisti autentici con Google Play Developer API. Quindi un backup modificato può inserire token fittizi e aumentare la quota consentita.
- La quota usa anche il numero di giorni in `log` e le chiavi di `days` comprese tra `firstDay` e oggi; queste strutture provengono dal backup e non sono prove server-side di attività reale. Possono essere manipolate per aumentare il limite di importazione.
- `econSanitize()` in `98e_v20_econ.js` calcola a sua volta la quota in base al numero di stringhe in `paidTokens`, senza verificare i token con Play e senza applicare il limite di 10 usato da `secStrict()`. Quando la copia risulta “trusted” (firma riproducibile dal bundle) questo è un secondo percorso di fiducia non verificata.
- `secSanitizeImport()` non valida né azzera i campi economici interni di `v20econ`; `econSanitize()` si limita a verificare che `v20econ` sia un oggetto. Campi come `paid`, `spentN`, `rw`, `gifts`, `trips`, `games`, `pass` e `maxDay` possono quindi arrivare da un backup non verificato senza una convalida semantica completa.
- **Conseguenza:** un backup alterato può manipolare la classificazione dei Tanì, il limite di valuta importabile e i registri locali che impediscono di ottenere più volte premi giornalieri/obiettivi/viaggi. Un backup firmato vecchio può inoltre riportare indietro i registri economici, perché non c'è un ledger server monotono.
- Il rischio non va confuso con la frode su acquisti reali: la verifica server-side dei token Play e un ledger server sono la soluzione robusta per i pacchetti pagati; per i premi offline servono regole di merge monotono e limiti di restore che non cancellino i progressi legittimi.

### Nuovi elementi nel registro
| ID | Area | Osservazione | Stato | Gravità provvisoria | Prossimo controllo |
|---|---|---|---|---|---|
| AUD-035 | Backup/economia/acquisti | Token importati contati come pacchetti senza verifica Play; quota può essere gonfiata con token fittizi | Debolezza anti-manomissione confermata | Alta | Test import alterato; validazione server dei token e limiti non controllabili dal client |
| AUD-036 | Backup/economia | `v20econ` e i suoi registri monotoni non vengono validati/mergiati; backup vecchi o alterati possono ripristinare premi e contatori | Gap di integrità confermato | Alta | Test restore di `rw/gifts/trips/paid/spentN`, merge monotono e ledger server |
| AUD-037 | Sicurezza dati | Firma locale basata su chiave statica nel bundle è riproducibile e non autentica la provenienza della copia | Limite crittografico confermato e già ammesso dal codice | Alta | Non usarla come controllo di sicurezza; definire threat model e protezioni server |

### Punto di ripartenza
Audit in sola lettura. Prossimo blocco: completare il threat model dei dati e dell'economia; esaminare il codice dei viaggi, obiettivi, regali, album e stagioni; poi pianificare test di restore/rollback, validazione acquisti e riconciliazione server. Le debolezze di import/export e acquisti sono ora priorità alta nell'inventario, ma non si applicano ancora patch isolate.


## Sessione di audit — 2026-11-20, orologio, viaggi e backup Android

### Orologio anti-manomissione — modello e limiti
- `45z_v20_secboot.js` mantiene un pavimento temporale in `localStorage` (`tanetto-clock`) separato dai backup creati dall'utente; `98x_v20_secure.js` su Android lo confronta con `TanettoClock` ogni 30 secondi e al ritorno in primo piano.
- `ClockPlugin.java` restituisce ora di sistema, tempo monotono dall'avvio e BOOT_COUNT; su Android 13+ aggiunge `SystemClock.currentNetworkTimeClock()`. Se l'ora di rete è disponibile, l'app la usa; altrimenti, se il boot non è cambiato, ricostruisce l'ora con elapsedRealtime. Se il dispositivo è stato riavviato e non c'è ora di rete, ricade sul pavimento e sull'orologio del telefono.
- **Limite da testare:** su Android 12 e precedenti, dopo un riavvio senza una nuova ancora attendibile, `secFloorFor()` abbandona il pavimento quando l'orologio è indietro di oltre 30 giorni (`SEC_DROP_BIG`) per recuperare un anno impostato male. Questo consente anche, in teoria, un rollback intenzionale superiore a 30 giorni e la riapertura di finestre giornaliere. È un compromesso dichiarato dal codice, non una protezione assoluta; misurare il rischio su device API 26–32 e decidere se introdurre una fonte di tempo attendibile o un recupero più sicuro.
- Nel browser non esiste una fonte indipendente di tempo; il controllo protegge soprattutto dai rollback brevi e non può impedire una manipolazione volontaria dell'orologio del sistema.
- **Backup Android da verificare:** `tanetto-clock` è salvato in localStorage/WebView e non compare tra le esclusioni delle backup rules viste finora. `AgeStorePlugin` usa esplicitamente `noBackupFilesDir`, ma il clock no. Se i dati WebView vengono inclusi in Auto Backup, il pavimento di un vecchio telefono può essere trasferito a uno nuovo. L'ancora BOOT_COUNT/elapsed del vecchio device non sarà valida; il valore `max` potrebbe però influenzare il nuovo dispositivo. Serve una prova reale di backup/restore su telefono diverso e una decisione esplicita se escludere `tanetto-clock` dalle copie Android.
- Il clock aggiorna le finestre di viaggio e gli eventi; i viaggi registrano gli ultimi 60 giorni in `S.v20trip.days`, mentre l'economia conserva registri giornalieri per 45 giorni. La protezione effettiva dipende quindi anche dall'affidabilità del clock e dal merge dei backup.

### Viaggi — comportamento osservato
- `98c_v20_trips.js` consente un viaggio completo a energia piena o con tutti gli obiettivi, oppure una gita breve (50% tempo/premi) dopo almeno metà degli obiettivi, solo verso mete vicine. Un viaggio al giorno; dopo la partenza l'energia resta spesa.
- Le mete sono controllate da livello e Plus; il ritorno calcola il giorno di partenza dal timestamp `t0`, per non attribuire il viaggio al giorno sbagliato. Gli obiettivi possono essere completati durante il viaggio e il wrapper preserva l'assenza di premi duplicati.
- Da testare: app chiusa/riaperta, cambio fuso orario, ora manipolata, viaggio che scade mentre l'app è chiusa, viaggio partito ieri e tornato oggi, backup durante il viaggio, cambio device, doppio tocco su partenza/ritorno e crash durante la transizione.

### Nuovi elementi nel registro
| ID | Area | Osservazione | Stato | Gravità provvisoria | Prossimo controllo |
|---|---|---|---|---|---|
| AUD-038 | Orologio/anti-abuso | Su Android pre-13, dopo reboot senza ora rete, rollback oltre 30 giorni abbandona il pavimento temporale | Limite architetturale confermato; rischio da quantificare | Media/Alta | Matrice API 26–32, reboot, offline e data spostata |
| AUD-039 | Backup Android/orologio | `tanetto-clock` non è escluso esplicitamente dalle regole di backup; possibile trasferimento del pavimento su nuovo device | Da verificare su dispositivo reale | Media | Backup/restore Android su due device e ispezione dei dati ripristinati |

### Punto di ripartenza
Audit in sola lettura. Prossimo blocco: completare i moduli di viaggio, energia, Natale, guardaroba, crescita e statistiche; verificare tutte le transizioni temporali e il ripristino Android. Nessuna modifica applicativa prima del piano generale.


## Sessione di audit — 2026-11-20, accesso Plus per minori e decisioni di prodotto

### Separare le protezioni automatiche dagli accessi volontari
- Nel codice age-gate, `v26Young()` blocca le offerte Plus automatiche, gli inviti, la richiesta di recensione e alcune statistiche per chi è minorenne o non ha dichiarato l'età. Sul ramo applicativo il controllo è compromesso dalle letture legacy di `S.age`; il branch age-gate le sostituisce con `AGE_VALUE`.
- Il commento del codice specifica però che Plus resta raggiungibile volontariamente da Profilo e Negozio anche per utenti giovani. `openPlus()` e il negozio pacchetti non mostrano un gate d'età autonomo evidente in `97o_billing.js`. Questo è un comportamento di prodotto esplicito nel commento, non va corretto automaticamente come bug.
- **Decisione da prendere nel piano generale:** chiarire se i minorenni (in particolare under-13) possono acquistare Plus e pacchetti, se serve un blocco o un consenso del genitore e come si concilia con la classificazione Play, il target dell'app e le regole Google Play per acquisti di minori. Fino a questa decisione non modificare i punti di accesso volontari; bloccare invece le promozioni automatiche come previsto.
- La prima configurazione nasconde i compagni Plus agli utenti che non risultano adulti, ma li lascia visibili nella scelta del compagno da Profilo con etichetta Plus. Verificare che la distinzione sia chiara e non diventi una promozione indiretta per minori.
- Le cartoline settimanali possono essere condivise dai teen, ma il nome personale è riservato agli adulti. La regressione del nome deriva dalla stessa funzione `v26Young()`, quindi la patch età deve essere validata anche sulle immagini social.

### Punto di ripartenza
Audit in sola lettura. Il piano finale dovrà distinguere: blocchi obbligatori per sicurezza/legge, promozioni automatiche, acquisti volontari, contenuti condivisibili e funzionalità che richiedono account. Nessuna decisione sui personaggi o sul rebranding finché non è completata la valutazione di prodotto, identità e direzione creativa.
