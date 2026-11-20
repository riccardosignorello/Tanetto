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


## Sessione di audit — 2026-11-20, coerenza tra pacchetti e ripristino acquisti

### Importazione dei pacchetti: limite obsoleto sul ramo non firmato
- `98zd_v22_prices.js` definisce i pacchetti attuali: 1.000 / 5.500 / 12.000 / 25.000 Tanì e aggiorna `EC.IMPORT_PER_PACK` a `2 × 25.000 + 5.000 = 55.000`, così il controllo economico generale segue il pacchetto massimo.
- `98x_v20_secure.js` mantiene invece `SEC_PACK_NEW = 4.000`, usato da `secStrict()` per ogni token nuovo trovato in una copia non firmata o non verificabile su un nuovo dispositivo. Questo valore non viene aggiornato da `98zd`.
- **Incoerenza concreta:** su un nuovo dispositivo, un backup non firmato con un acquisto legittimo da 25.000 Tanì può aumentare il tetto di importazione di soli 4.000 Tanì per token (più la quota per i giorni), non di 25.000. Con pochi giorni di attività il saldo importato può essere tagliato in modo significativo. Il limite di 10 token non risolve la perdita: 10 × 4.000 è molto inferiore a 10 pacchetti massimi.
- I backup firmati passano invece per un percorso diverso e il limite economico generale è 55.000 per token. Quindi il risultato dipende dalla presenza/validità della firma e dalla versione che ha creato la copia. Va testata anche la migrazione di copie precedenti alla 1.0.8.
- Non basta aumentare `SEC_PACK_NEW` senza controllo: il token importato è una stringa non verificata e il client non consulta il backend Google Play. La soluzione corretta è verificare i token con Play Developer API o un meccanismo attendibile e applicare il valore esatto del prodotto acquistato; per i backup storici senza token, definire un recupero assistito e non punitivo.
- La suite economica deve includere tutti e quattro i pacchetti, copie firmate/non firmate, nuovo dispositivo, più acquisti, token duplicati, refund e storage pieno.

### Nuovo elemento nel registro
| ID | Area | Osservazione | Stato | Gravità provvisoria | Prossimo controllo |
|---|---|---|---|---|---|
| AUD-040 | Acquisti/backup/migrazione | `SEC_PACK_NEW=4.000` non segue i pacchetti aggiornati fino a 25.000; un restore non firmato su nuovo device può tagliare Tanì legittimi | Incoerenza confermata, perdita da quantificare | Molto alta | Testare i 4 pacchetti su backup legacy/non firmato e progettare verifica Play server-side |

### Punto di ripartenza
Audit in sola lettura. Prossimo blocco: completare le regole di importazione e i test economici; controllare il ciclo di acquisto, riconciliazione, rimborsi e recupero account; poi continuare su tutte le funzioni core. Non correggere il limite isolatamente prima di decidere la strategia di verifica dei token.


## Sessione di audit — 2026-11-20, account facoltativo e coerenza con il gate età

### Invito account e pulsanti di accesso
- `nudgeShow()` in `97p_store.js` mostra un invito a creare un account dopo tre giorni di uso, se i promemoria sono attivi, l'utente non ha già un account e non ha rifiutato l'invito. Non controlla `ageCloudOk()` e non verifica che l'account sia effettivamente disponibile per la fascia dichiarata.
- `acctCard()` in `97n_account.js`, quando non c'è un account attivo, mostra i pulsanti Google/e-mail. Il gate effettivo è dentro `fbLoad()`, che blocca la connessione se l'età non consente il cloud; quindi il pulsante può essere visibile anche a chi non può completare l'accesso.
- `98zk_v26_fix.js` aggiunge un collegamento alla pagina di cancellazione per chi ha già risposto all'età e risulta non idoneo al cloud; la versione sul ramo applicativo usa però ancora il vecchio controllo `S.age`, già incluso in AUD-012/AUD-029. La patch isolata age-gate lo sposta su `AGE_VALUE`.
- **Incoerenza UX confermata:** un utente child o con età non dichiarata può ricevere un invito a creare un account e vedere pulsanti di accesso che il gate poi rifiuta. L'invito dovrebbe essere condizionato a `ageCloudOk() === true`; per chi non è idoneo, la scheda dovrebbe spiegare con chiarezza che account e backup online non sono disponibili e, se c'è un account preesistente, mostrare solo il percorso di cancellazione.
- La regola deve usare la soglia locale di consenso digitale (`ageCloudOk`), non `v26Young()`: in alcuni Paesi una persona di 16–17 anni può avere diritto a un account anche se resta minorenne per acquisti, offerte o personalizzazione.
- I test attuali verificano account/cloud e link di cancellazione in alcuni casi, ma non coprono l'invito account dopo tre giorni per tutte le fasce child/teen/skip/unknown né il click sui pulsanti quando il cloud è bloccato.

### Nuovo elemento nel registro
| ID | Area | Osservazione | Stato | Gravità provvisoria | Prossimo controllo |
|---|---|---|---|---|---|
| AUD-041 | Account/età/UX | Invito e pulsanti di accesso possono apparire anche quando `ageCloudOk()` blocca account e backup | Incoerenza di comportamento confermata | Media/Alta | Testare child/teen/skip/unknown per UI, click e messaggi; mostrare solo le azioni disponibili |

### Punto di ripartenza
Audit in sola lettura. Prossimo blocco: completare account, acquisti e protezione dei dati; poi continuare su giochi, obiettivi, viaggi, diario, capsule, album, notifiche e widget. Tutti i gate devono essere valutati separatamente per età digitale, minore età, pubblicità, cloud, offerte e condivisione.


## Sessione di audit — 2026-11-20, Data Safety, TTL, telemetria e licenze

### Data Safety e trattamento dati
- `GC_CODE` è attivo sul dominio `tanetto.app` e nell'app Android; gli eventi non sono quindi soltanto predisposti: vengono inviati a `tanettoapp.goatcounter.com`. Il payload include il nome evento/percorso e un parametro casuale, non un ID stabile dell'utente.
- `reportErr()` invia anche eventi di diagnostica JavaScript (tipo di errore, versione, piattaforma e numero di riga) tramite lo stesso endpoint. `98x_v20_secure.js` rimuove stringhe tra virgolette e sequenze numeriche lunghe prima dell'invio, ma il flusso resta raccolta di diagnostica e va dichiarato/valutato separatamente dalle sole “interazioni con l'app”.
- Le note Play Data Safety 1.0.11 parlano di eventi anonimi e interazioni; non menzionano chiaramente la diagnostica errori. Va verificata la classificazione corretta nella scheda Play Console e aggiornata l'informativa, se necessario.
- `GrowthPlugin.device()` restituisce SHA-256 di Android ID con prefisso fisso dell'app. È un hash pseudonimo stabile, non cifratura: la frase `impronta cifrata` nei documenti è tecnicamente errata. Un hash deterministico di un identificatore di dispositivo resta un dato pseudonimo/identificativo ai fini privacy, non va descritto come dato anonimo o irreversibilmente non personale senza valutazione.
- I documenti di Data Safety separano correttamente i dati dell'invito da analytics, ma devono essere verificati contro tutti gli SDK effettivi: Google Mobile Ads/UMP, Firebase Auth/Firestore, Play Billing, Play Integrity, GoatCounter e telemetria errori. L'assenza di dati personali digitati dall'app non significa assenza di dati raccolti dagli SDK.
- La regola analytics effettiva usa la fascia adulta (<18 disabilitata), mentre il documento interno parla di età del consenso digitale del Paese. La differenza è più protettiva, ma le descrizioni devono corrispondere alla logica reale.

### Retention degli inviti: configurazione esterna non verificabile dal repository
- `firestore.rules` richiede il campo `exp` a circa 330–400 giorni e i commenti dichiarano cancellazione automatica dopo 12 mesi tramite TTL Firestore.
- Nel repository non sono presenti `firebase.json`, `firestore.indexes.json` o una configurazione TTL. La TTL Firestore si configura nel progetto cloud, non viene attivata dalle regole di sicurezza.
- Il campo `exp` è presente su più collection group: `invites`, `p`, `c` e `devs`. Va verificato che la TTL policy sia attiva per ciascun collection group interessato, non soltanto sul documento principale. Se la policy manca, i documenti possono restare oltre i 12 mesi dichiarati.
- Questo controllo richiede accesso alla console Firebase/Google Cloud del progetto; non è verificabile dal solo repository. Sarà una delle poche attività da chiedere all'utente quando l'audit sarà completo.

### Licenze e provenienza degli asset
- Il repository contiene 280 WebP, 47 PNG, 9 JPG e 240 WOFF2; non risultano file audio/video. Le immagini includono personaggi, scene, luoghi reali, cartoline, oggetti, splash screen, icone e press kit.
- `licenses.html` elenca Fredoka, Figtree, Caveat, Lucide, GSAP, Capacitor, Firebase, AndroidX, Kotlin e SDK Google, ma non descrive la provenienza/licenza delle immagini WebP/JPG/PNG né i diritti d'uso delle illustrazioni dei personaggi e dei luoghi.
- Le immagini potrebbero essere originali o generate, ma il repository non contiene una prova di provenienza, licenza, prompt/autore o release dei diritti. Non attribuire una violazione senza verificare: è un gap di documentazione e due diligence che va chiuso prima di campagne e distribuzione internazionale.
- Il titolo “Open-source licences” include anche componenti proprietari/SDK Google e licenze commerciali; valutare una pagina più corretta “Componenti di terze parti e licenze”. La licenza GSAP deve essere verificata rispetto alla versione effettivamente distribuita e ai termini aggiornati.

### Documentazione e release
- `README.md` contiene solo il titolo. Mancano guide per build riproducibile, setup Firebase, release, firma, rollback, test locali, incident response, privacy/data map, supporto e manutenzione.
- I due documenti Data Safety sono separati e riferiti alla 1.0.11; devono essere unificati in una matrice unica delle categorie di dati/SDK, con proprietario, finalità, retention, base giuridica, disclosure Play e versione.
- Il repository non contiene una configurazione TTL verificabile né un registro di provenienza degli asset. La release checklist deve richiedere evidenze esterne per entrambi.

### Nuovi elementi nel registro
| ID | Area | Osservazione | Stato | Gravità provvisoria | Prossimo controllo |
|---|---|---|---|---|---|
| AUD-042 | Firebase/retention/privacy | TTL 12 mesi dichiarata nei commenti, ma policy non versionata nel repository e da verificare per tutti i collection group | Non verificabile senza Console | Alta | Verificare TTL su invites/p/c/devs in Firebase/Google Cloud |
| AUD-043 | Privacy/Data Safety | Hash SHA-256 dell'Android ID descritto come “cifrato”; è un identificatore pseudonimo | Incoerenza terminologica confermata | Media/Alta | Correggere definizioni e verificare Data Safety/GDPR |
| AUD-044 | Analytics/diagnostica | Eventi errori JS inviati a GoatCounter non esplicitati chiaramente nelle note Data Safety | Raccolta confermata; disclosure da verificare | Media/Alta | Verificare policy GoatCounter e classificazione Play “Diagnostics” |
| AUD-045 | Licenze/asset | Provenienza e licenze delle immagini non documentate nel repository | Gap documentale confermato | Alta | Inventario asset, autore/fonte/licenza/diritti per ogni gruppo |

### Punto di ripartenza
Audit in sola lettura. Prossimo blocco: completare inventario privacy/SDK e asset; verificare le funzioni rimanenti, poi fare ricerca esterna sulle policy aggiornate e preparare il piano completo. Le attività che richiedono la Console Firebase, Play Console o account pubblicitari verranno raccolte in un'unica richiesta, non una domanda alla volta.


## Sessione di audit — 2026-11-20, sito, bundle e peso degli asset

### Dimensioni misurate dal Git tree
- Il repository contiene circa 25,04 MB di file (dimensioni Git blob, non APK né trasferimento compresso).
- `index.html` generato pesa 4.946.377 byte (4,72 MiB) ed è il file più grande. Il build concatena i moduli JavaScript e CSS nell'HTML: circa 4,69 MiB di sorgenti JS e 0,46 MiB CSS sono distribuiti con un bundle molto grande e senza code splitting/lazy loading per area funzionale.
- Altri gruppi: WebP 4,39 MiB, PNG 7,00 MiB, WOFF2 1,75 MiB, JPG 0,86 MiB. Le PNG includono anche risorse sorgenti per icone/splash e press kit, quindi non tutte vengono scaricate nell'app.
- `og.png` pesa circa 0,96 MiB; l'icona 1024 del press kit circa 1 MiB. Da ottimizzare mantenendo i formati richiesti dalle piattaforme.
- `privacy.html` pesa circa 0,18 MiB e contiene tutte le lingue nello script; il file `index.html` è il vero collo di bottiglia per il primo caricamento.
- La dimensione del bundle è coerente con il precedente audit PageSpeed mobile 39/100 e LCP circa 10,6 s. Il dato va aggiornato su produzione, ma non è un problema teorico: il file HTML è effettivamente molto grande.

### Implicazioni
- Il codice di tutte le aree viene scaricato/analizzato prima che la pagina possa diventare interattiva, anche se l'utente usa soltanto una parte delle funzioni. Il bundle unico aumenta parsing, memoria, costo CPU e rischio di rallentare telefoni economici.
- Le 14 lingue sono caricate insieme; valutare dizionari separati e caricamento della lingua selezionata, con fallback offline.
- Le illustrazioni WebP sono relativamente contenute come gruppo; le fonti PNG/JPG più pesanti appartengono soprattutto a press kit e icone. Separare gli asset web/app/press e applicare compressione adeguata.
- Il service worker e la modalità offline devono essere preservati durante qualsiasi ottimizzazione: non basta dividere i file se poi l'app perde l'avvio offline o mostra schermate vuote.
- Obiettivo di performance da definire con metriche reali: Core Web Vitals (LCP/INP/CLS), TTI/first interaction su Android di fascia bassa, consumo memoria, dimensione trasferita compressa, avvio freddo/caldo e modalità offline. Non fissare una soglia arbitraria prima di misurare i dispositivi target.

### Build Firebase separato
- `tools/firebase/fb_entry.js` è la sorgente del bundle pubblico `fb.js`; `tools/firebase/package.json` documenta il comando esbuild.
- `.github/workflows/tests.yml` esegue `npm ci` in `app-android` e `tools/build.py`, ma non esegue il comando esbuild in `tools/firebase`. Il build principale copia `fb.js` già esistente; non garantisce che sia sincronizzato con `fb_entry.js`.
- Questo può produrre una pagina di cancellazione account che usa una versione Firebase diversa dal sorgente aggiornato. Il bundle attuale contiene ancora lo stesso ordine di cancellazione già analizzato in AUD-017.
- La pipeline deve costruire `fb.js` da `fb_entry.js` con versioni bloccate e verificare che il bundle sia aggiornato (diff/hash), prima di generare le pagine web e il pacchetto Android.

### Nuovi elementi nel registro
| ID | Area | Osservazione | Stato | Gravità provvisoria | Prossimo controllo |
|---|---|---|---|---|---|
| AUD-046 | Build/Firebase | Il workflow non ricostruisce `fb.js` da `fb_entry.js`; può distribuire bundle obsoleto | Gap di processo confermato | Alta | Ricostruire in CI, verificare hash/diff e sincronizzare sito/app |
| AUD-047 | Performance/web | `index.html` pesa 4,72 MiB e contiene il bundle JS/CSS concatenato | Problema misurato | Molto alta | Profilare Lighthouse/CrUX e progettare split, minify, lazy load e cache |
| AUD-048 | Asset/performance | PNG/OG/press asset pesanti; separazione e ottimizzazione da completare | Problema misurato, impatto runtime da misurare | Media | Inventario per pagina/app, compressione e immagini responsive |

### Punto di ripartenza
Audit in sola lettura. Prossimo blocco: verificare service worker, manifest, CSP, SEO e build completo; poi misurare il sito live e confrontare le dichiarazioni privacy con SDK e produzione. Nessuna modifica applicativa prima del piano generale.


## Sessione di audit — 2026-11-20, PWA, SEO, press kit e sicurezza delle pagine

### PWA e cache offline
- `sw.js` usa una cache versionata, elimina le cache precedenti all'attivazione, aggiorna la pagina principale solo con risposte valide e conserva la pagina app corretta per l'uso offline. È un impianto ragionato; va preservato.
- Il service worker precarica il bundle, Firebase, GSAP, font CSS, icone e immagini principali di personaggi/oggetti; le cartoline dei luoghi vengono memorizzate quando vengono viste per la prima volta. L'installazione può fallire se anche una sola risorsa del `cache.addAll()` manca o non è disponibile. Da automatizzare il controllo che ogni URL precaricato esista e risponda correttamente.
- Le pagine secondarie non sono precaricate come pagine offline: se si apre Privacy/Press senza rete e non sono già in cache, il fallback può portare alla pagina principale dell'app. Verificare che sia un comportamento voluto e non mostri la schermata sbagliata.
- `prep_www.py` separa lo script da oltre 1 MiB in `app.js` per Android, usa GSAP/font locali e copia le immagini necessarie. È un miglioramento rispetto al bundle inline web, ma l'app Android continua a dover analizzare un file JS molto grande.

### SEO e metadati
- `robots.txt` consente l'indicizzazione e dichiara `sitemap.xml`; la sitemap include homepage/app, privacy e press kit. La pagina di cancellazione è correttamente `noindex`.
- `licenses.html` non è nella sitemap; valutare se includerla. Privacy e Press hanno canonical, ma la privacy è multilingua via JavaScript sullo stesso URL e non mostra alternate `hreflang`: verificare resa Google, lingua predefinita, snippet e indicizzazione internazionale.
- Il manifest PWA ha nome, descrizione, icone, scope, start URL e orientamento; non sono presenti shortcut/categorie, opzionali. Il dominio ha `app-ads.txt` con publisher ID, elemento corretto per AdMob.
- Il sito usa molte informazioni in una sola pagina e un bundle molto grande; oltre a SEO serve ottimizzazione di performance, accessibilità, contenuti e collegamenti interni.

### Press kit — dati da aggiornare
- `press/index.html` dichiara come versione corrente la 1.0.10, mentre sul Play Store è stata pubblicata la 1.0.11 il 19/11/2026. Il press kit è quindi già obsoleto.
- Il press kit descrive un trial annuale di 7 giorni come caratteristica generale; verificare l'effettiva eleggibilità dell'offerta Play (nuovi abbonati, Paesi, account e condizioni) e usare una formulazione che non prometta una prova a tutti.
- Il press kit afferma “no offers” per chi è giovane/non dichiara l'età; nel prodotto le offerte automatiche sono bloccate, ma Plus resta raggiungibile volontariamente da Profilo e Negozio. La frase va resa precisa, senza creare una promessa più ampia del comportamento reale.
- La pagina consente l'uso delle immagini per parlare di Tanetto e chiede di non modificare i personaggi. Manca una pagina/nota chiara su diritti, licenze e uso commerciale degli asset; collegare la due diligence AUD-045.
- Il press kit elenca prezzi, stagioni, lingue, target, annunci e funzioni: va mantenuto da una fonte unica/versionata, altrimenti ogni release crea incoerenze tra Play, sito, privacy e media.

### CSP e pagine pubbliche
- `tools/build.py` inserisce una Content Security Policy meta nella pagina app; la CSP consente script e stili inline perché il bundle è incorporato. La pagina pubblica di cancellazione `elimina-account.html` e la privacy non presentano la stessa CSP. La pagina di cancellazione carica `fb.js` e contiene JavaScript inline, quindi merita una policy dedicata e rigorosa.
- Una CSP via meta non sostituisce tutte le intestazioni HTTP: in particolare alcune direttive di sicurezza richiedono header server. GitHub Pages limita gli header personalizzabili; valutare Cloudflare o un hosting che consenta HSTS, Referrer-Policy, Permissions-Policy, X-Content-Type-Options e CSP con nonce/hash.
- Verificare che la pagina di cancellazione abbia protezione da clickjacking, script consentiti minimi, validazione input e messaggi di errore che non rivelino dettagli sensibili. La pagina è critica perché consente l'eliminazione dell'account.

### Nuovi elementi nel registro
| ID | Area | Osservazione | Stato | Gravità provvisoria | Prossimo controllo |
|---|---|---|---|---|---|
| AUD-049 | Marketing/press kit | Versione corrente dichiarata 1.0.10, ma Play ha 1.0.11; trial e offerte da formulare con eleggibilità corretta | Incoerenza confermata | Media/Alta | Aggiornare al rilascio e usare fonte unica |
| AUD-050 | SEO/internazionalizzazione | Privacy multilingua su URL unico senza alternate hreflang; sitemap non include licenze | Gap SEO da misurare | Media | Search Console, test render e strategia URL lingua |
| AUD-051 | Sicurezza web | Pagina di cancellazione e privacy non hanno la stessa CSP dell'app; la cancellazione gestisce Firebase Auth | Hardening mancante | Alta | CSP dedicata, header HTTP, test XSS/clickjacking e security headers |

### Punto di ripartenza
Audit in sola lettura. Prossimo blocco: completare SEO e sito live, controllare i flussi di installazione/aggiornamento/offline, quindi passare alle aree ancora non analizzate e alla ricerca esterna delle policy correnti. Le correzioni di press kit, bundle e pagine web saranno incluse nel piano unico.


## Sessione di audit — 2026-11-20, plugin nativi e regole di backup Android

### Plugin nativi: controlli effettivi
- `AdsPlugin.java` è una buona difesa in profondità: rilegge l'età dal file nativo no-backup a ogni inizializzazione/caricamento/visualizzazione, blocca bambini e scelta mancante, imposta trattamento CHILD/TEEN, TFUA, rating G/PG e UMP prima dell'SDK. Usa ID pubblicitari di test solo in build debug. La scelta skip viene classificata teen, mentre una scelta ancora assente resta pending e non avvia gli annunci.
- `BillingPlugin.java` gestisce prodotti, acquisti, query degli acquisti posseduti, acknowledge degli abbonamenti e consume dei pacchetti. Non effettua verifica server-side dei token né ha un ledger remoto; questo resta collegato ad AUD-032/AUD-035/AUD-040. Non risulta un timeout esplicito per le callback di connessione/query, da testare in condizioni di rete anomala.
- `GoogleSignInPlugin.java` usa Android Credential Manager e restituisce ID token/email al JavaScript; Firebase Auth esegue poi la verifica. Il controllo di età è nel flusso JavaScript/Firebase, non nel plugin nativo.
- `GrowthPlugin.java` legge Install Referrer e calcola SHA-256 di ANDROID_ID con prefisso dell'app. Il commento dice che viene invocato solo da adulti, ma i metodi nativi `referrer()` e `device()` non controllano autonomamente il deposito età. Il gate è quindi solo JavaScript; un errore o un percorso alternativo potrebbe ottenere referrer/hash anche senza età adulta. Da rafforzare con un controllo nativo prima di esporre identificatori.
- `AgeStorePlugin.set()` valida e scrive atomicamente, ma non rifiuta una seconda scrittura quando esiste già una scelta valida. L'interfaccia JavaScript la tratta come one-time; il plugin nativo, fonte di verità, non impone la stessa regola. È un hardening da valutare: consentire sovrascrittura solo in caso di file corrotto e recovery esplicito.
- `SharePlugin.java` limita il FileProvider alla cartella `cache/condivisi` e usa URI temporanei con grant; bene. I file di condivisione possono accumularsi se il nome cambia e non c'è una pulizia/limite esplicito; le scritture MediaStore non eliminano la riga pending in ogni ramo di errore. Da testare con molte condivisioni e spazio insufficiente.
- `WidgetPlugin.java` limita il payload a 4.000 caratteri; `WidgetSnap.java` filtra campi e stringhe prima di renderizzare. I widget hanno descrizioni accessibili e aggiornamenti su ora/lingua; test Robolectric presenti. Va verificato il comportamento dopo backup/restore, reboot, cambio fuso e rimozione del widget.

### Backup Android: una correzione importante alla valutazione dell'orologio
- `backup_rules.xml` e `data_extraction_rules.xml` includono esplicitamente l'intera directory WebView Local Storage, oltre a `tanetto_widget.xml`. Il file nativo dell'età è escluso perché si trova in `noBackupFilesDir`.
- Di conseguenza, `tanetto-clock` è incluso nel backup Android: non è escluso come lo sono le copie manuali. Questo rende AUD-039 un rischio concreto, non soltanto teorico.
- Il valore salvato contiene anche `bootCount` e `elapsedRealtime` del vecchio telefono. Il codice considera valida l'ancora se il boot count coincide e il tempo monotono corrente è maggiore: il solo numero di avvii non identifica univocamente un dispositivo. Su un nuovo telefono con lo stesso BOOT_COUNT e un elapsedRealtime maggiore, l'ancora del vecchio telefono potrebbe essere trattata come valida e spostare l'orologio interno. La soluzione più semplice da valutare è escludere `tanetto-clock` dal backup o associare l'ancora a un identificatore casuale conservato in `noBackupFilesDir`.
- La copia Android include anche tutto lo stato applicativo in localStorage, compresi i registri giornalieri/economici. Il ripristino del sistema operativo non passa dal parser di importazione manuale; occorre verificare che il bootstrap convalidi e riconcili i registri dopo Auto Backup e device-to-device transfer.

### Nuovi elementi nel registro
| ID | Area | Osservazione | Stato | Gravità provvisoria | Prossimo controllo |
|---|---|---|---|---|---|
| AUD-052 | Privacy/inviti/plugin nativi | `GrowthPlugin.device/referrer` non verifica l'età nel codice nativo; dipende interamente dal gate JS | Gap defense-in-depth confermato | Media/Alta | Test chiamata diretta con child/teen/skip/unknown e blocco nativo |
| AUD-053 | Età/plugin nativi | `AgeStorePlugin.set()` consente di sovrascrivere una scelta già valida | Gap di enforcement nativo confermato | Media | Rendere immutabile salvo recovery di store corrotto e testare retry |
| AUD-054 | Backup/orologio | Backup Android include `tanetto-clock`; boot count non è un identificatore univoco tra device | Rischio cross-device concreto | Alta | Escludere clock dal backup o legarlo a UUID no-backup; test device-to-device |

### Punto di ripartenza
Audit in sola lettura. Prossimo blocco: completare review delle classi native, build variants, dipendenze, manifest merge, SDK privacy e prove su device; poi completare le funzioni core rimanenti. La configurazione Play/Firebase e la verifica dei dati di produzione resteranno in una sola checklist finale per l'utente.


## Sessione di audit — 2026-11-20, release Android e infrastruttura Firebase

### Build Android — configurazione osservata
- Il progetto usa compile/target SDK 36, min SDK definito in `variables.gradle`, Gradle Plugin 8.13.0 e Capacitor 7.4.3. Le dipendenze dichiarate includono Billing 8.3.0, Google Mobile Ads 25.5.0, UMP 4.0.0, Credential Manager 1.5.0, Google ID 1.1.1 e Play Review 2.0.2.
- R8 e resource shrinking sono attivi in release; le regole tengono i plugin Capacitor e i componenti creati dal manifest. Da testare l'AAB release reale, perché la CI ordinaria compila soprattutto il percorso di prova.
- La firma di produzione è cercata in `TANETTO_KEYS` o nel percorso storico `/home/claude/chiavi`; la chiave non è nel repository e non deve esserlo. Il percorso predefinito è specifico della macchina e va sostituito con una procedura portabile e sicura per la release. Senza chiave il build release non viene firmato; il keystore `prova.keystore` è usato soltanto per debug/test.
- La versione Android è ancora 1.0.11 / code 114; il bump 1.0.12 va fatto solo nel pacchetto di release dopo audit e test.
- `android:allowBackup=true` con include espliciti salva Local Storage WebView e SharedPreferences del widget, non il file età nativo, non la sessione Firebase e non il referrer. Il backup include però `tanetto-clock`, come già precisato in AUD-054.
- Il manifest include `com.google.android.gms.permission.AD_ID`; rimuove permessi AdServices e exact alarm. Il codice non inizializza AdMob per child/age pending, ma la presenza del permesso va confrontata con target audience, policy Families e dichiarazioni Play correnti.
- `SCHEDULE_EXACT_ALARM` viene rimosso intenzionalmente; i promemoria devono funzionare con orari non esatti. Verificare il manifest unito finale e il receiver di boot del plugin Local Notifications, perché i permessi del plugin arrivano anche dai manifest delle dipendenze.

### Firebase: codice, regole e produzione
- Il repository non contiene `firebase.json` né un alias di progetto Firebase. Le regole Firestore sono testate con Emulator Suite in CI, ma il deployment delle regole in produzione è manuale (commenti indicano copia/incolla nella Console).
- Non è possibile dedurre dal repository se le regole attualmente attive in produzione coincidano con `tools/firebase/firestore.rules`. Una modifica committata e testata nell'emulatore non protegge il backend finché non viene pubblicata.
- L'assenza di un deploy tracciato crea rischio di drift: codice client nuovo può aspettarsi regole diverse da quelle attive, o regole vecchie possono rimanere permissive. La release checklist dovrà richiedere export/commit delle regole attive, diff rispetto al repository, test emulator e deploy esplicito al progetto corretto.
- App Check è configurabile solo quando entrambe le proprietà Gradle `tanettoAppCheckAppId` e `tanettoAppCheckApiKey` sono valorizzate; al momento sono vuote, quindi viene compilato il plugin stub off e nessun token viene richiesto. Le regole Firestore non hanno enforcement App Check. L'accensione richiederà registrazione dell'app Android e attivazione graduale dell'enforcement nella Console Firebase.
- Il flavor App Check acceso (debug provider e Play Integrity release) non viene compilato dalla CI attuale; occorre aggiungere almeno un job di compilazione/test del flavor on con valori fittizi di formato valido, e poi prova reale su device con token debug/Play Integrity.
- La TTL Firestore è anch'essa una configurazione esterna non versionata; verificare tutte le collection group in Console, come AUD-042.

### Nuovi elementi nel registro
| ID | Area | Osservazione | Stato | Gravità provvisoria | Prossimo controllo |
|---|---|---|---|---|---|
| AUD-055 | Firebase/operazioni | Regole testate in emulator ma deployment produzione manuale e non tracciato; manca alias/config Firebase nel repo | Gap operativo confermato | Alta | Esportare regole attive, diff, deploy controllato e verifica post-deploy |
| AUD-056 | Android/App Check/CI | Flavor App Check on non viene compilato dalla CI ordinaria; produzione resta off | Gap di test/config confermato | Alta | Compilare flavor on in CI e provare Play Integrity su device |

### Punto di ripartenza
Audit in sola lettura. Prossimo blocco: verificare dipendenze/SDK aggiornati e policy correnti, completare la mappa Android e la review delle funzioni core rimanenti. Le attività esterne (Firebase Console, Play Console, firma release) saranno raccolte in una sola checklist finale per l'utente.


## Sessione di audit — 2026-11-20, moderazione nomi e interpretazione delle CI

### Filtro dei nomi scelti
- `97za_v18_name.js` normalizza i nomi e confronta parole vietate per evitare insulti/volgarità; il nome resta locale e viene mostrato in alcuni contenuti condivisibili per adulti.
- Il controllo usa anche `includes()` su parole normalizzate senza confini lessicali. Questo può bloccare nomi innocui che contengono una sequenza vietata all'interno (classico falso positivo tipo “Essex”, “Cassandra”, “Dickens” o parole equivalenti in altre lingue). Va testato con nomi reali e non solo con parolacce.
- Le liste coprono varie lingue latine e cirilliche, ma non risultano liste native per giapponese, coreano, cinese semplificato e tradizionale, nonostante l'app supporti queste lingue. Il filtro può quindi essere aggirato con termini offensivi nelle lingue CJK.
- Non esiste un test dedicato nel set `tests/t110` per il filtro nomi, i falsi positivi e le lingue CJK. Serve una matrice di test madrelingua, con attenzione a non bloccare nomi propri o parole innocue.
- Soluzione da valutare: tokenizzazione/boundary matching e regole contestuali, normalizzazione di omoglifi/varianti, liste curate per lingua e un percorso di segnalazione/recupero. Non basta aggiungere indiscriminatamente parole: si rischia di peggiorare i falsi positivi.

### Interpretazione corretta dei test falliti
- `t_110_decisions.py` contiene ancora asserzioni su `S.age` e su `localStorage.tanetto-eta` come fonte di verità. Dopo la migrazione dell'età a `AGE_VALUE` e al plugin nativo, queste asserzioni sono obsolete: i fallimenti collegati alla presenza/assenza di `S.age` sono test da aggiornare, non prova automatica di regressione applicativa.
- `t_111_audience.py`, `t_b1_minors.py`, `t_110_story.py` e `t_111_week.py` coprono comportamenti collegati a `v26Young()`. Sul ramo applicativo la lettura legacy di `S.age` fa risultare giovani anche gli adulti; la patch isolata aggiorna la sorgente a `AGE_VALUE`. La CI del commit precedente alla patch non può essere usata per giudicare la patch attuale.
- `t_111_icons.py` ha cinque lingue con nomi che ancora non entrano nel selettore a 360 px senza overflow/spezzatura: problema UI reale da riprodurre e correggere.
- `t_111_events.py` misura CPU/layout/style in un runner condiviso. Il superamento del budget va riprodotto su device reali e su runner stabile prima di classificarlo come regressione; la decorazione deve comunque fermarsi con reduce motion e modalità leggera.
- `t_b2_money.py` ha un controllo che fallisce sul ripristino del dialogo, mentre il caso di spesa economica provato non supera il residuo pagato: non copre il caso limite AUD-030.
- La suite `t_b5_a11y.py` usa l'albero accessibilità Chromium, ma misura contrasto solo su alcuni selettori e dimensioni di tocco su un sottoinsieme; non sostituisce TalkBack/VoiceOver, switch access, zoom 200%, testo dinamico e test su device.
- La suite `t_b7_perf.py` usa Chromium/CDP e brevi finestre di misura; non sostituisce Lighthouse/CrUX, WebPageTest, Android low-end, avvio freddo/caldo e rete lenta. La pagina pubblica di cancellazione non viene testata end-to-end con un account Firebase reale.
- Non ci sono test reali di AdMob/UMP, Play Billing con acquisti/rimborsi, Play Integrity/App Check in enforcement, Auto Backup/device transfer, TTL Firestore, né deploy delle regole. I mock verificano la logica client, non il comportamento dei servizi reali.

### Nuovi elementi nel registro
| ID | Area | Osservazione | Stato | Gravità provvisoria | Prossimo controllo |
|---|---|---|---|---|---|
| AUD-057 | Moderazione/lingue | Filtro nomi basato su sottostringhe può produrre falsi positivi e non copre adeguatamente CJK | Gap di copertura confermato; falsi positivi da quantificare | Media/Alta | Test madrelingua, boundary matching e set di nomi innocui/offensivi |
| AUD-058 | Test/qualità | CI non copre ancora device reali, servizi Google/Firebase, backup Android e accessibilità assistiva completa | Gap di copertura confermato | Alta | Piano E2E su device e ambienti reali dopo il fix dei test obsoleti |

### Punto di ripartenza
Audit in sola lettura. Prossimo blocco: completare i moduli di gioco, negozio, mondi e contenuti; rivedere le traduzioni e i flussi di backup; poi fare la matrice dei test e il piano unico. Non considerare verde una CI finché tutte le suite, incluse quelle nuove, non passano o hanno un'eccezione documentata e accettata.


### Integrazione AUD-017 — cancellazione account e documenti residui
- `TanFB.remove()` elimina `backups/{uid}` e poi chiama `deleteUser()`. Se Google/Firebase richiede una riautenticazione, il backup è già stato cancellato e l'account resta temporaneamente attivo; l'utente deve autenticarsi di nuovo e ripetere la cancellazione. Il commento sorgente dice “senza perdere nulla”, ma non è letteralmente vero: il backup è già eliminato. La pagina deve spiegare lo stato parziale in modo esplicito.
- Esiste anche `reviewers/{uid}`, creato solo manualmente dallo sviluppatore per gli account di revisione Play; le regole impediscono al client di cancellarlo e `TanFB.remove()` non lo rimuove. È un documento interno di entitlement, non il backup dell'utente, ma resta associato all'UID cancellato e va incluso nella procedura amministrativa di pulizia.
- Non risultano altri documenti Firestore legati all'UID ordinario: gli inviti usano codice e hash dispositivo, non Firebase Auth. La retention degli inviti resta separata e dipende dalla TTL esterna.
- Azione futura: distinguere chiaramente “backup già eliminato” da “account ancora da eliminare”, permettere reautenticazione e completamento, e avere una procedura amministrativa per eliminare anche eventuali record `reviewers/{uid}` quando appropriato.


## Sessione di audit — 2026-11-20, acquisto effettivo degli Introvabili

### AUD-059 — verifica corretta del vincolo sui Tanì pagati
- Il gestore base in `96_v7.js` usa il saldo totale in `tryBar/#tryBuy`, ma la lettura del solo saldo totale non basta a concludere che il vincolo sia aggirabile.
- In `98ze_v22_introvabili.js` esiste una protezione aggiuntiva che era sfuggita alla prima lettura:
  - `tryBar()` viene avvolta con `xvWithUsable()`, quindi il pulsante viene renderizzato usando il saldo effettivamente spendibile;
  - un listener `document.addEventListener("click", ..., true)` intercetta in capture il pulsante `#tryBuy`, controlla che `tryId` identifichi un oggetto `xv` e, se `xvUsable() < s.price`, chiama `stopImmediatePropagation()` e `preventDefault()`. Il gestore base non riceve quindi il click.
- **Conclusione corretta:** il normale percorso di acquisto tramite interfaccia è protetto dal codice presente. Il precedente rilievo di bypass completo era errato perché non considerava il listener capture. È stato corretto anche il checkpoint di continuità.
- Resta una debolezza di architettura/test: il vincolo è applicato da un listener DOM globale anziché direttamente nella funzione atomica che esegue la spesa. Un eventuale percorso programmatico futuro potrebbe non passare da quel listener. Il test `t_b2_money.py` verifica il saldo utilizzabile, ma non esercita in modo esplicito il percorso completo `data-shop → tryBar → #tryBuy`.
- Soluzione di hardening da pianificare: spostare il controllo dentro un'unica funzione di acquisto/spesa, mantenendo il listener solo come protezione UI; aggiungere test E2E per vetrina, negozio, tap ripetuto e saldo misto.

### Nuovo elemento nel registro
| ID | Area | Osservazione | Stato | Gravità provvisoria | Prossimo controllo |
|---|---|---|---|---|---|
| AUD-059 | Economia/Introvabili | Il click normale è protetto da `xvWithUsable` e dal listener capture; il controllo non è ancora centralizzato nel gestore atomico e manca un E2E sul percorso completo | Hardening/test gap, non bypass confermato | Media | E2E sul click reale e controllo centralizzato in `spendTani` |

### Punto di ripartenza
Audit in sola lettura. Il problema economico confermato è invece il conteggio `spentN` (AUD-030) e la coerenza atomica dei crediti pagati (AUD-070); non correggere il presunto bypass AUD-059 perché il normale percorso UI è già protetto.

## Sessione di audit — 2026-11-20, supporto nei momenti difficili e audio

### Sistema di supporto e rilevamento locale
- `98zl_v110_safety.js` contiene un sistema euristico in 14 lingue: frasi esplicite, negazioni, contesti innocui, varianti ortografiche, separazione delle frasi e alcuni segnali di imminenza/mezzi. Il livello 2 apre la scheda di aiuto; il livello 1 propone un controllo gentile. Il testo viene analizzato localmente e non viene inviato al server.
- Il rilevamento è richiamato nei flussi di diario, “Lascia andare” e capsula. Dopo una frase difficile, `sf110Hush()` sospende le promozioni Plus e le richieste di recensione per la sessione e le celebrazioni automatiche per 10 minuti; non blocca la scheda di aiuto.
- La scheda di aiuto offre numeri cliccabili e `findahelpline.com`; le risorse sono selezionate tramite fuso orario e codice Paese, senza chiedere GPS. Se il fuso non è mappato, il testo indica il numero di emergenza locale e offre il sito globale.
- Il codice non è un sistema clinico di valutazione del rischio e non può garantire di riconoscere ogni frase, slang, contesto o intenzione. La qualità delle liste e delle risorse deve essere verificata da professionisti della salute mentale e madrelingua per ciascuna lingua/Paese, con test di falsi positivi e falsi negativi. Il prodotto deve evitare qualsiasi promessa di diagnosi o rilevamento completo.
- La selezione delle linee in base al fuso può essere sbagliata se l'utente viaggia, usa un fuso manuale o vive in un'area con più numeri regionali. Il fallback globale è utile ma non sostituisce una scelta manuale di Paese/area, soprattutto in un momento di crisi.
- Le fonti delle linee sono in `docs/HELPLINES_FONTI.md` e il codice dichiara verifica al 14/11/2026. Va fatta verifica periodica con fonti ufficiali, copertura 24/7, lingue disponibili, costo, SMS/chat e disponibilità territoriale. I numeri di emergenza non sono universali.
- Da verificare se l'informativa e la scheda di aiuto chiariscano che Tanetto non è un servizio di emergenza, non sostituisce assistenza professionale e che, in pericolo immediato, occorre contattare i servizi di emergenza locali. Non trasformare questo in un disclaimer freddo: deve restare comprensibile e umano.

### Audio e avvio
- `97j_sound.js` avvia la musica dopo circa 300 ms quando non c'è la schermata iniziale; `MainActivity` imposta `setMediaPlaybackRequiresUserGesture(false)` per consentire la riproduzione automatica in WebView. Il motore audio è procedurale/Web Audio: non risultano file musicali o effetti audio esterni nel repository.
- `98zv_v111_music.js` gestisce mute, volume e visibilità della pagina, sospendendo/riattivando il loop quando l'app passa in background. I test verificano parte del motore, ma non la percezione su dispositivi reali e in modalità silenziosa.
- Da valutare: primo avvio con audio automatico può sorprendere o disturbare chi apre l'app in pubblico, in modalità silenziosa o con sensibilità sensoriali. Verificare audio focus/interazione con musica di altre app, rispetto di Do Not Disturb, volume iniziale, accessibilità e possibilità di scegliere prima di attivare la musica.

### Nuovi elementi nel registro
| ID | Area | Osservazione | Stato | Gravità provvisoria | Prossimo controllo |
|---|---|---|---|---|---|
| AUD-060 | Safety/benessere | Rilevamento crisi euristico in 14 lingue e linee telefoniche via fuso: non risulta validazione clinica/linguistica indipendente | Gap di validazione da chiudere | Alta | Revisione professionale, madrelingua, test di falsi positivi/negativi e verifica ufficiale delle linee |
| AUD-061 | UX/audio/accessibilità | Musica avviata automaticamente dopo 300 ms, consentita nativamente senza gesto | Comportamento confermato; scelta UX da validare | Media | Test primo avvio, audio focus, silenzioso/DND e preferenza esplicita |

### Punto di ripartenza
Audit in sola lettura. Prossimo blocco: completare tutti i moduli di gioco, mondi, negozio e interfaccia; verificare tutte le traduzioni e le linee di aiuto; poi completare la matrice di test e il piano unico. Nessun intervento applicativo prima del completamento dell'inventario.


## Sessione di audit — 2026-11-20, qualità delle 14 lingue

### Copertura tecnica e qualità linguistica
- L'app e le principali risorse di sicurezza sono localizzate in 14 lingue: italiano, inglese, tedesco, spagnolo, francese, portoghese, giapponese, coreano, cinese semplificato/tradizionale, russo, polacco, olandese e turco.
- La presenza di chiavi e fallback non dimostra qualità madrelingua. I test automatizzati verificano soprattutto completezza, overflow, rendering, formattazione e alcune stringhe; non possono certificare tono, naturalezza, sensibilità culturale, correttezza legale o precisione dei messaggi di crisi.
- Le aree da sottoporre a revisione madrelingua prioritaria sono: consenso/età, pubblicità e acquisti, privacy e cancellazione, notifiche, supporto nei momenti difficili, numeri di aiuto, contenuti Plus, prezzi/bonus, onboarding e messaggi di errore.
- Le lingue CJK hanno regole di spaziatura, lunghezza, punteggiatura e tipografia differenti; i test di word-wrap pensati per lingue latine non sono sufficienti. Anche turco, russo e polacco richiedono verifica di declinazioni e forme grammaticali.
- Serve una fonte unica delle stringhe e un flusso di revisione: traduttore madrelingua, revisore indipendente, screenshot contestuali, controllo in-app su device e registro della versione approvata. Le stringhe ad alto rischio devono avere owner e data di ultima verifica.
- La localizzazione deve includere anche sito, privacy, press kit, Play Store, supporto, email e contenuti social; non basta che l'app abbia 14 lingue se le promesse pubbliche restano in una sola lingua o divergono tra canali.

### Nuovo elemento nel registro
| ID | Area | Osservazione | Stato | Gravità provvisoria | Prossimo controllo |
|---|---|---|---|---|---|
| AUD-062 | Localizzazione/brand/compliance | 14 lingue presenti, ma i test tecnici non dimostrano revisione madrelingua e accuratezza culturale/legale | Gap di garanzia qualità | Alta | Audit madrelingua per aree ad alto rischio e workflow di approvazione versionato |

### Punto di ripartenza
Audit in sola lettura. Prossimo blocco: completare i moduli rimanenti, poi ricerca pubblica su policy e concorrenti e matrice finale di qualità. Nessuna traduzione va riscritta automaticamente senza revisione contestuale e senza una fonte approvata.


## Sessione di audit — 2026-11-20, workflow GitHub Actions

### Workflow `tests.yml`
- Il workflow dichiara `permissions: contents: write` a livello globale e include un passaggio che committa e pusha gli artefatti generati. La scrittura è necessaria solo per il push su branch normali; test e PR dovrebbero avere `contents: read`.
- Il passaggio usa `GITHUB_REF_NAME` anche su eventi `pull_request`. In quel caso GitHub usa un riferimento del tipo `123/merge`, non un branch scrivibile; se la build genera differenze, `git fetch origin "$GITHUB_REF_NAME"`/push falliscono. Le PR che richiedono aggiornamento di artefatti possono quindi fallire per il workflow, non per il codice.
- La pipeline modifica i branch con un commit del bot, nonostante il commento dica “non pubblica niente”. Non crea una release, ma modifica il codice/artefatti del branch. Va separato il job di test read-only dal job esplicito di build/sync su push.
- I log di ogni test vengono scritti in `/tmp/tanetto-test.log` e stampati solo con le prime 20 righe rilevanti; screenshot e log completi non vengono caricati come artefatti. La diagnosi di errori e snapshot è quindi più lenta e alcuni traceback non sono recuperabili.
- Il job esegue le suite in sequenza; se il passaggio generale fallisce, il successivo test Robolectric viene saltato. I test Android vanno separati in job indipendenti, così un errore browser non impedisce di sapere se i widget/native sono verdi.
- Le dipendenze Python `playwright` e `pillow` sono installate senza versioni bloccate; la pipeline può cambiare comportamento senza modifiche del repository. Non esiste un job dedicato a vulnerabilità dipendenze/SAST/secret scanning.
- Il workflow ricostruisce l'app web ma non ricostruisce `fb.js` da `fb_entry.js` (AUD-046). Il controllo delle lingue è presente; i test Firebase Emulator sono pinned, ma non verificano le impostazioni TTL o App Check di produzione.

### Workflow `android.yml`
- Pubblica automaticamente un APK di prova come GitHub prerelease con tag statico `android-prova`, solo quando cambia il branch `main` in certi percorsi o su dispatch manuale. È chiaramente marcato “non per lo store”, ma resta un download pubblico.
- In caso di errore pubblica una seconda prerelease statica `android-diagnostica` con le ultime righe del log. Verificare che il log non contenga dati sensibili o variabili d'ambiente; mantenere una redazione esplicita.
- Il workflow compila un APK di prova, non un AAB release firmato; non è prova della build Play definitiva. Non esegue automaticamente l'intera suite prima della pubblicazione del file di prova.
- Le GitHub Actions sono referenziate tramite tag major/minor (`@v5`, `@v4`, `@v3`, `@v2`) e non commit SHA. Per una pipeline di release ad alta affidabilità, fissare le action a SHA verificati e aggiornare con bot/review.
- Le due pipeline non hanno un unico gate di release: test, APK prova, firma AAB, Play Console, regole Firebase, App Check, Data Safety e sito sono ancora processi separati.

### Nuovi elementi nel registro
| ID | Area | Osservazione | Stato | Gravità provvisoria | Prossimo controllo |
|---|---|---|---|---|---|
| AUD-063 | CI/CD/GitHub | Il push artefatti usa `GITHUB_REF_NAME` anche su PR (`123/merge`), con rischio di fallimento e permessi write non necessari | Difetto workflow confermato | Alta | Separare job read-only e sync su branch; testare PR da fork e interne |
| AUD-064 | CI/CD/supply chain | Log/screenshot non archiviati, dipendenze Python non bloccate, nessun job dedicato SAST/dependency/secret scan | Gap di qualità e sicurezza confermato | Media/Alta | Artifact retention, lock, scansioni e test paralleli |

### Punto di ripartenza
Audit in sola lettura. Prossimo blocco: completare le restanti aree di prodotto e sito, poi analizzare le dipendenze e le policy esterne. Nessuna modifica ai workflow fino al piano generale, perché vanno rivisti insieme a build, release, branch protection e permessi.


## Sessione di audit — 2026-11-20, verifica approfondita dell'informativa privacy

### Incoerenze tra informativa e backup Android
- L'informativa afferma che Android Backup include l'età; l'età attuale è invece salvata in `getNoBackupFilesDir()` e non è inclusa nelle regole di backup. Questa frase è falsa.
- Le regole Android includono esplicitamente tutto il WebView Local Storage e `tanetto_widget.xml` per tutti gli utenti, senza distinzione per fascia d'età. Il Local Storage contiene lo stato, i progressi e il diario. Quindi, anche quando l'app blocca l'account e il backup Firebase per bambini/minori, Android Auto Backup può trasferire una copia dei dati locali a Google se il backup di sistema è attivo.
- Questo non equivale al backup cloud gestito da Tanetto, ma la distinzione deve essere chiarissima: “nessun account/backup Tanetto” non significa “nessun backup di sistema”. La promessa del press kit “no online backup” per la modalità protetta va qualificata o il backup Android va riprogettato.
- Anche il nome facoltativo viene salvato in Local Storage e quindi può essere incluso nel backup Android senza account; la frase che lo collega al backup online soltanto in presenza di account è incompleta.
- Il file `tanetto-clock` è incluso, come AUD-054; l'età no. I dati di backup Android e i dati cloud Firebase sono due flussi distinti e vanno descritti separatamente.

### Backup Firebase e cifratura
- `fb_entry.js` serializza/comprime il backup e lo invia a Firestore; la codifica Base64/compressione non è cifratura end-to-end. Il trasporto usa TLS e Google cifra i dati a riposo, ma l'operatore del progetto Firebase può tecnicamente accedere ai documenti tramite Console/API amministrative.
- La frase “sent encrypted and accessible only with your account” può essere interpretata come esclusione dell'accesso da parte del gestore. Va riscritta distinguendo: TLS in transito, cifratura a riposo del provider, regole di accesso utente e possibilità di accesso amministrativo. Non dichiarare cifratura end-to-end se non esiste.
- L'informativa dice che i dati senza account “are not sent to anyone” e subito dopo menziona il backup Android su Google: formulazione contraddittoria. Specificare “non inviati ai servizi Tanetto; il backup di sistema Android/Google può includerli se attivo”.
- L'informativa afferma che account e backup sono cancellati immediatamente. Questo riguarda il documento Firebase e l'account Auth dopo completamento della procedura; non elimina automaticamente i dati locali sul dispositivo né le copie del backup Android già gestite da Google. Chiarire l'ambito della cancellazione e i tempi/controlli del backup di sistema.

### Diagnostica, analytics e categorie di dati
- L'informativa descrive error report come anonimi e “solo tipo di errore”; il codice invia anche versione, piattaforma e numero di riga, con sanitizzazione del messaggio. La descrizione deve corrispondere esattamente al payload.
- GoatCounter riceve la richiesta e quindi l'IP a livello di rete, anche se dichiara di non conservarlo in modo identificabile. “Non conserviamo l'IP” è diverso da “non viene trattato alcun dato personale”; va usata una formulazione giuridicamente precisa e verificata rispetto al contratto/ruolo del provider.
- La mappa privacy deve elencare per ciascun SDK: dati tecnici, identificatori, finalità, base giuridica, destinatari/processor, localizzazione, retention e possibilità di opt-out. Includere Firebase Auth/Firestore, AdMob, UMP, Play Billing, Play Integrity, GoatCounter e diagnostica.
- Il testo pubblico deve distinguere dati che Tanetto riceve, dati che Google tratta direttamente per il proprio servizio e dati trattati dal sistema operativo. “Non riceviamo l'Advertising ID” non significa che AdMob non lo possa trattare.

### Nuovi elementi nel registro
| ID | Area | Osservazione | Stato | Gravità provvisoria | Prossimo controllo |
|---|---|---|---|---|---|
| AUD-065 | Privacy/minori/backup | Android Auto Backup include Local Storage e diario per tutte le età, mentre il prodotto comunica “no backup” in modalità protetta; età invece esclusa dal backup | Incoerenza tecnica e comunicativa confermata | Critica | Decidere se disabilitare/segregare backup o chiarire esplicitamente il backup di sistema per ogni fascia |
| AUD-066 | Privacy/cifratura | Backup Firebase codificato/compresso ma non E2E; frase “accessible only with your account” ambigua rispetto all'accesso amministrativo | Incoerenza terminologica da correggere | Alta | Data map, access control, cifratura reale e testo trasparente |
| AUD-067 | Privacy/retention | Cancellazione account elimina Firebase backup/Auth, non le copie Android Auto Backup già gestite da Google né i dati locali | Ambito della cancellazione incompleto | Alta | Spiegare cosa viene cancellato, cosa resta locale e come gestire backup Android |

### Punto di ripartenza
Audit in sola lettura. La decisione su backup dei minori è bloccante: va presa nel piano generale dopo valutazione tecnica e legale, non con una correzione isolata. Proseguire con le altre aree prima di scegliere l'architettura definitiva.


### Ulteriore punto legale — possibile trattamento di dati particolari
- Il backup Firebase contiene l'intero stato serializzato, compresi diario, check-in, umore e progressi. Gli utenti possono inserire liberamente informazioni su salute mentale, ansia, depressione, autolesionismo o altre condizioni.
- Anche se Tanetto non usa il testo per profilazione/analytics e il rilevamento di crisi avviene localmente, il backup cloud può trasferire contenuti che, per il loro contenuto, rientrano nelle categorie particolari di dati sulla salute (GDPR art. 9). L'eventuale trattamento va valutato da un legale privacy: base giuridica art. 6 e condizione art. 9, consenso esplicito quando necessario, minimizzazione, retention, accesso, DPIA e misure tecniche.
- La sola scelta “crea account” potrebbe non essere una manifestazione sufficientemente specifica/esplicita per il trattamento di eventuali dati sulla salute contenuti nel diario. Non dare per scontato che il backup generico equivalga al consenso esplicito.
- Opzioni architetturali da valutare nel piano: diario escluso dal backup cloud; cifratura end-to-end client-side con gestione chiavi/recupero; backup separato con consenso specifico; oppure nessun backup di contenuti liberi. Ogni opzione ha impatti su UX, recupero account e supporto.
- Non raccogliere né inviare il contenuto del diario a analytics o diagnostica; verificare anche export, crash logs e screenshot di supporto.

| ID | Area | Osservazione | Stato | Gravità provvisoria | Prossimo controllo |
|---|---|---|---|---|---|
| AUD-068 | GDPR/dati particolari | Backup cloud dell'intero stato può includere diario e umore con dati relativi alla salute; base art. 9 e consenso specifico non dimostrati dal solo codice | Rischio legale da valutare | Critica | Parere privacy legale e scelta architetturale prima di mantenere il diario nel backup Firebase |


### Correzione di precisione AUD-044 — diagnostica JavaScript non ancora confermata
- Nel ramo `work/tanetto-1.0.12` è presente in `98x_v20_secure.js` un wrapper che sanifica `reportErr(msg,line)` *se* la funzione esiste già, ma nel giro di ricerca effettuato non è stata trovata la funzione emissora originale né un listener `window.onerror/unhandledrejection` che la richiami. Non va quindi dichiarato come fatto che Tanetto invii errori JavaScript a GoatCounter finché non si individua il punto di definizione nel bundle generato o in un altro branch.
- La privacy source `3zzg_v21_privacy.js` dichiara invece in modo esplicito che Google AdMob può trattare diagnostica del servizio pubblicitario (crash/performance) e posizione approssimativa derivata dall'IP. Questa raccolta SDK va distinta da eventuali errori JavaScript raccolti direttamente da Tanetto.
- Le note `DATA_SAFETY_111.md` e `PLAY_DATA_SAFETY_111.md` sono documenti incrementali (“il resto resta come 1.0.10”), non una dichiarazione completa e autosufficiente. La frase “nessun dato viene usato per la pubblicità” va riferita esplicitamente ai dati invito/analytics gestiti da Tanetto, perché AdMob tratta dati per fornire annunci.
- Azione: nel piano generale cercare il simbolo `reportErr` nel bundle effettivamente distribuito e nei branch; se non esiste, eliminare il wrapper morto e non dichiarare una raccolta inesistente. Se esiste, documentare payload, gate età, opt-out e categoria Play corretti.


## Sessione di audit — 2026-11-20, soglie d'età e determinazione del Paese

### Modello effettivo delle soglie (chiarimento importante)
- L'età non ha una sola soglia. Il codice distingue:
  1. **Sotto 13:** modalità child; nessun annuncio rewarded, account/backup, inviti, statistiche o condivisione esterna.
  2. **Da 13 anni ma sotto l'età digitale del Paese:** modalità protetta; niente account/backup Firebase, analytics o condivisione esterna; annunci trattati come teen (TFUA/PG/non personalizzati) se l'utente ha scelto “preferisco non dirlo” o ha un'età teen dichiarata; il caso ancora pending viene bloccato dal plugin nativo.
  3. **Sopra l'età digitale del Paese ma sotto 18:** account/backup e analytics possono essere consentiti; annunci restano teen/non personalizzati; niente inviti, richieste di recensione e offerte automatiche; le cartoline possono essere condivise, ma il nome personale scelto non viene mostrato.
  4. **18+:** trattamento adulto completo, salvo le preferenze e i consensi.
- `ageCloudOk()` usa `ageBand() === "adult"`, e `ageBand()` usa la soglia digitale locale, non necessariamente 18 anni. La soglia 18 è invece usata da `v26Young()` per inviti, pressioni commerciali, recensioni e nome nelle cartoline, e da `AgePolicy.java` per il trattamento pubblicitario.
- La condivisione delle cartoline usa `w111ShareOk()`: consente la condivisione dai 13 anni *e* sopra l'età digitale locale; non è riservata ai soli maggiorenni. Il nome scelto viene mostrato soltanto dai 18 anni. Gli inviti a un amico restano 18+.
- La descrizione “nessun backup/condivisione nella modalità protetta” è corretta soltanto se “modalità protetta” significa sotto l'età digitale del Paese o scelta non dichiarata, non tutti gli utenti sotto 18. Il press kit e l'informativa devono mantenere questa distinzione.
- La percentuale di utenti minori non va confusa con la soglia di consenso digitale. Non descrivere `ageCloudOk()` come “solo maggiorenni”: per esempio, in Italia il codice consente account/backup a partire da 14 anni, mentre per le offerte/inviti il limite resta 18.

### Determinazione della soglia legale: rischio da chiudere
- `AGE_CONSENT` contiene valori espliciti per alcuni Paesi (ad esempio IT 14, FR 15, UK/US 13) e usa 16 come fallback per Paesi non presenti. La tabella non copre in modo esplicito numerosi Paesi in cui l'età o le regole di consenso possono essere diverse, e il fallback 16 può essere troppo permissivo dove serve 18.
- `ageRegions()` combina regione di locale, lingue del dispositivo, fuso orario e lingua dell'app, scegliendo il valore più alto tra quelli riconosciuti. È prudente rispetto a segnali discordanti, ma non determina il luogo fisico dell'utente e può essere modificato cambiando lingua/fuso; non è una verifica legale della residenza.
- Esempio da verificare con consulente: un utente in India/Turchia o in un Paese non mappato con locale/fuso impostati su US può ricevere soglia 13/16 invece della soglia locale eventualmente più alta. In India, in particolare, il regime per i minori sotto 18 richiede una verifica legale specifica; non assumere che fallback 16 sia sufficiente.
- Per i Paesi non mappati, 16 non è sempre il fallback più protettivo. Occorre un inventario legale per tutti i mercati effettivamente distribuiti, non soltanto per le 14 lingue; definire fallback e blocchi coerenti con la normativa, valutando se chiedere il Paese, usare segnali di store/IP con informativa adeguata o limitare il cloud ai 18+ nei mercati non verificati.
- La scelta dell'utente è autodichiarata (mese/anno, senza giorno) e non verifica l'identità o la data di nascita. Il prodotto non deve presentarla come age verification certificata. Va valutato il requisito di age assurance nei mercati in cui l'app viene distribuita.

### Nuovo elemento nel registro
| ID | Area | Osservazione | Stato | Gravità provvisoria | Prossimo controllo |
|---|---|---|---|---|---|
| AUD-069 | Età/GDPR/mercati | Tabella soglie incompleta e fallback 16; locale/fuso non dimostrano il Paese fisico e possono essere modificati | Rischio di soglia troppo permissiva in alcuni mercati | Critica | Matrice legale Paese per Paese, fallback sicuro e scelta di age assurance/mercati supportati |

### Nota sulla base di audit
- Il ramo `work/tanetto-1.0.12` contiene ancora alcuni lettori legacy di `S.age` in `98zk_v26_fix.js`; il ramo isolato `work/tanetto-1.0.12-agegate-fix` li ha spostati su `AGE_VALUE`. Le verifiche sui comportamenti d'età devono essere eseguite sul ramo candidato più aggiornato e non confondere il bug del ramo base con il risultato della patch.


### Correzione AUD-069 — verifica puntuale della tabella già presente
- Rileggendo l'intero oggetto `AGE_CONSENT`, la tabella **include già** India (`IN:18`) e Turchia (`TR:18`), oltre a Singapore (`SG:18`), Sudafrica (`ZA:18`), Hong Kong (`HK:18`) e Taiwan (`TW:20`). Gli esempi precedenti India/Turchia come Paesi non mappati erano errati e non vanno usati come prova del difetto.
- Il rischio da verificare resta: accuratezza legale di ciascun valore, copertura di Paesi non elencati, granularità subnazionale (in particolare Canada e Stati USA), e possibilità di modificare contemporaneamente lingua e fuso orario. La funzione sceglie il valore massimo fra segnali riconosciuti, ma non conosce la residenza fisica e non costituisce age assurance.
- La tabella appare più ampia di quanto inizialmente stimato; non va riscritta senza una revisione legale Paese per Paese e fonti aggiornate. Gli esempi di Paesi non coperti andranno definiti solo dopo la verifica normativa.


## Sessione di audit — 2026-11-20, coerenza atomica dei crediti Tanì

### AUD-070 — consegna e classificazione dei crediti non atomiche
- **Correzione di branch:** il ramo base `work/tanetto-1.0.12` non mostra il wrapper di classificazione del regalo Plus mensile; il ramo candidato `work/tanetto-1.0.12-agegate-fix` aggiunge invece in `98zk_v26_fix.js` un wrapper `plusMonthly()` che incrementa `econ().paid`. Il test M-06 in `t_b2_money.py` risulta verde nel run storico del branch candidato. Non classificare quindi il regalo Plus mensile come bug non corretto nel candidato.
- **Resta un problema di atomicità:** nel candidato, `plusMonthly()` originale (in `98e_v20_econ.js`) salva saldo e mese, poi il wrapper in `98zk` incrementa `e.paid` e salva di nuovo. Se il processo si chiude fra i due salvataggi, i 750 Tanì possono restare non classificati.
- La parte extra del regalo giornaliero Plus viene aggiunta a `econ().paid` in `98zm_v110_decisions.js`, ma solo dopo che la funzione originale `openGift()` ha già salvato saldo e giorno del regalo. Anche qui esiste una finestra di crash fra saldo e classificazione.
- `creditPack()` in `97o_billing.js` aumenta `S.seeds`, registra `S.paidTokens` e chiama `save()`, ma non verifica l'esito del salvataggio prima di consumare il token Google Play. Se il salvataggio fallisce, il token può essere consumato e il credito non essere persistito: rischio di perdita definitiva dell'acquisto.
- Il wrapper `creditPack()` in `98ze_v22_introvabili.js` aggiorna `econ().paid` soltanto dopo aver atteso il completamento della funzione originale, che a sua volta attende `p.consume()`. Se l'app viene terminata dopo il consumo del token e prima del salvataggio del bucket `paid`, i Tanì possono restare nel saldo senza la relativa classificazione.
- `S.paidTokens` viene limitato agli ultimi 200 token. Poiché il codice prova a consumare un token anche quando è già stato accreditato, il limite è normalmente innocuo; se però il consumo fallisce ripetutamente e un token non consumato viene espulso dalla lista, un successivo ripristino potrebbe riaccreditarlo. Da verificare e rendere impossibile con un registro idempotente.
- I premi invito sono classificati con `n111Paid()` prima del `save()` che persiste anche il saldo; il loro ordine è più coerente, ma va uniformato alla stessa API.
- Il listener che aggiorna `spentN` aggiunge l'intera spesa `d` se esiste un residuo pagato, senza limitarla a `min(d, paid - spentN)`. Quando una spesa supera il residuo pagato, può quindi conteggiare anche Tanì guadagnati come se fossero pagati, riducendo ingiustamente il saldo spendibile per gli Introvabili. Il test attuale non dimostra di coprire questo caso limite.

**Conseguenze:** in caso di crash/storage failure si può ottenere saldo spendibile per errore oppure perdere un acquisto; il conteggio delle spese può inoltre restringere ingiustamente i Tanì guadagnati. È un problema di integrità economica e affidabilità della consegna, non soltanto di UI.

**Soluzione definitiva da pianificare:** un unico servizio di transazione `grantTani(amount, source, idempotencyKey)` che aggiorna in una sola mutazione `S.seeds`, `econ().paid`, i contatori sorgente e il token, esegue un solo salvataggio verificato e soltanto dopo consuma/acknowledgia l'acquisto. In caso di salvataggio fallito non consumare il token e mostrare un errore chiaro; al riavvio ripetere la consegna idempotente. La stessa API deve gestire Plus mensile, extra giornaliero, pacchetti, referral e bonus. Per le spese usare `spentN += Math.min(d, paidLeft)`.

**Test obbligatori:** Plus mensile; extra giornaliero Plus; acquisto pack con salvataggio riuscito/fallito; crash simulato prima/dopo consumo; token già registrato; consumo fallito; token vecchio oltre il limite; ripristino da backup prima/dopo acquisto; saldo misto con spesa inferiore/uguale/superiore al residuo pagato; acquisto Introvabile; doppio callback Google Play.

### Nuovo elemento nel registro
| ID | Area | Osservazione | Stato | Gravità provvisoria | Prossimo controllo |
|---|---|---|---|---|---|
| AUD-070 | Economia/Billing/affidabilità | Bucket Plus/pacchetti aggiornato in salvataggi successivi al saldo; token consumato anche se il salvataggio non è verificato; possibile doppio accredito se token non consumato viene espulso; `spentN` può sovracontare | Rischio transazionale confermato da codice | Critica | Verificare failure windows e progettare grantTani idempotente con persistenza prima del consumo |

### Punto di ripartenza
Audit in sola lettura. Trattare AUD-030 e AUD-070 come un unico intervento di integrità economica: non correggere singole righe senza riprogettare la transazione e la matrice di provenienza/spesa dei Tanì.


## Sessione di audit — 2026-11-20, diagnosi dei fallimenti CI del candidato agegate-fix

I dati seguenti provengono dal job storico `136454007442`, eseguito sul branch `work/tanetto-1.0.12-agegate-fix` a un commit precedente all'ultimo build artefatti. Non equivalgono a un risultato CI dell'HEAD attuale.

### Classificazione puntuale dei fallimenti

| Test | Evidenza nel log | Diagnosi provvisoria | Tipo |
|---|---|---|---|
| `t_110_decisions.py` | 6 controlli: salvataggio età adulta, trasferimento con età inventata, prevalenza della scelta locale, scelta skip | Diverse asserzioni sembrano ancora basate sul vecchio campo `S.age`; confrontare ciascuna con `AGE_VALUE` e il plugin nativo. Non aggiornare i test alla cieca: prima verificare il comportamento reale del deposito nativo | Probabile test legacy da riallineare, con verifica funzionale necessaria |
| `t_110_story.py` | Traceback, ma il wrapper CI non conserva lo stack completo | Causa non determinabile dai log pubblicati; recuperare traceback integrale e riprodurre | Non classificato |
| `t_111_audience.py` | Un solo NO: “età mai chiesta” si aspetta rewarded video e adsOn attivo, ma il plugin non inizializza/carica/mostra | L'età pending deve restare fail-closed; è diverso dalla scelta esplicita “Preferisco non dirlo”, che viene salvata come `skip` e trattata come teen per gli annunci non personalizzati. Il test sta confondendo pending e skip | Aspettativa test da correggere, non regressione di sicurezza |
| `t_111_events.py` | Con evento: 24 fps, 26,4 style/s, 26,2 layout/s, 41,4 CPU ms/s; senza: 24 fps, 15 style/s, 15 layout/s, 28,8 CPU ms/s | Le decorazioni stagionali aggiungono circa 11,4 operazioni stile e 11,2 layout al secondo nel benchmark. Ottimizzare i tween/letture e ridurre il lavoro a riposo; ripetere su device reali | Problema prestazionale da riprodurre/ottimizzare |
| `t_111_icons.py` | 5 lingue falliscono a 360 px: IT (Quadrifoglio, Arcobaleno, Mongolfiera); DE (Christbaumkugel); ES (Globo aerostático); FR (Champignon, Montgolfière); NL (Paddenstoel, Regenboog, Luchtballon, Sneeuwvlok) | Le etichette si spezzano o non rispettano la soglia minima di 9,5 px. Correggere layout/etichette in contesto, non ridurre indiscriminatamente il font | Difetto UX/localizzazione confermato |
| `t_111_week.py` | Traceback senza stack completo | Causa non determinabile; recuperare log completo e riprodurre | Non classificato |
| `t_113_kids_noads.py` | Quattro NO soltanto per `age="none"`; lo stato pending non mostra i video | Come `t_111_audience`: il test interpreta “nessuna scelta ancora” come skip. Il plugin nativo blocca correttamente lo stato pending. Mantenere la protezione e correggere il test | Aspettativa test da correggere |
| `t_b1_minors.py` | La scheda Privacy non spiega che la scelta età non può essere cambiata per teen e adult | Il testo `v110AgeT()[6]` non viene inserito in `psAgeCard()`; la scelta è persistente ma l'utente non riceve una spiegazione chiara | Lacuna UX confermata |
| `t_b2_money.py` | Il test vede ancora “A launch gift!” quando si aspetta la finestra di ripristino | `askRestore()` è asincrona; il test avvia la Promise ma aspetta solo 1,5 secondi fissi. Il backup Firebase può richiedere più tempo. Attendere il selettore della finestra o la conclusione della Promise. Verificare comunque che il prompt di ripristino non venga perso dietro il regalo iniziale | Probabile test flaky/race da distinguere da problema UX |

### Nuovi elementi nel registro
| ID | Area | Osservazione | Stato | Gravità provvisoria | Prossimo controllo |
|---|---|---|---|---|---|
| AUD-071 | UX/privacy/età | La scheda profilo non mostra il testo localizzato che spiega che la scelta dell'età non è modificabile | Lacuna confermata | Media | Inserire testo in tutte le lingue e verificare accessibilità |
| AUD-072 | UI/localizzazione | Etichette icone spezzate a 360 px in IT/DE/ES/FR/NL | Difetto visuale confermato dal test | Media | Revisione layout e traduzioni su 320/360/390 px |
| AUD-073 | Performance/animazioni | Gli eventi stagionali aumentano in modo sensibile le operazioni stile/layout a riposo | Benchmark fallito | Media/Alta | Profiling e riduzione lavoro per frame; test su device Android lenti e medi |
| AUD-074 | Test età/ads | Due test confondono età pending con scelta esplicita skip e si aspettano annunci quando il plugin deve bloccare | Aspettativa test errata | Media | Separare casi pending, skip, child, teen, adult |
| AUD-075 | Test backup/restore | Test di ripristino usa attesa fissa 1,5 s su funzione asincrona e legge ancora il regalo iniziale | Flaky test probabile; UX da verificare | Media | Attendere stato/selector e verificare che il restore prompt sia sempre mostrato |
| AUD-076 | CI/diagnostica | Traceback di `t_110_story` e `t_111_week` non disponibili nel log recuperato | Gap di osservabilità | Media | Salvare log integrali e riprodurre prima di classificare |

### Nota importante
- I 190 controlli della suite browser/nativa risultano verdi; ciò non cancella i fallimenti delle suite Python generali.
- Non tutti i test falliti indicano bug del prodotto: alcuni hanno aspettative obsolete dopo la migrazione del deposito età, altri sono difetti reali di UI/performance, altri ancora sono test asincroni fragili. La correzione deve rispettare il comportamento sicuro del prodotto, non forzare il codice per far passare un test sbagliato.
- Il test `t_b2_money` che fallisce non dimostra che il Plus mensile non sia classificato: nel candidato il wrapper in `98zk` esiste e M-06 risulta verde. Il NO osservato è quello del dialogo di ripristino.


## Sessione di audit — 2026-11-20, plugin Android: condivisione, referral e widget

### SharePlugin
- `SharePlugin.share()` scrive ogni file condiviso nella cartella cache `condivisi/` e non elimina esplicitamente il file dopo la chiusura del chooser. Il sistema può svuotare la cache, ma condivisioni ripetute possono accumulare file fino alla pulizia del sistema.
- `share()`, `saveImage()` e `saveFile()` decodificano Base64 senza un limite esplicito di dimensione. Una chiamata errata o un payload enorme può causare pressione di memoria, crash o riempimento della cache/download.
- `saveImage()` e `saveFile()` inseriscono prima un record MediaStore con `IS_PENDING=1`; se il flusso si interrompe, lo stream è nullo o la decodifica/scrittura fallisce, il catch rifiuta la chiamata ma non elimina l'URI temporaneo. Possono restare elementi incompleti pendenti.
- `safeName()` rimuove slash e caratteri non ammessi; non emerge un percorso diretto di path traversal nel normale uso. Il MIME type è fornito dal chiamante interno e andrà comunque validato.
- Soluzione: limite dimensione per tipo di file, gestione streaming dove possibile, cleanup in `finally` dei file cache e `ContentResolver.delete(uri)` su ogni errore prima di togliere `IS_PENDING`. Testare share/cancel/failure e storage pieno.

### GrowthPlugin
- `referrer()` prova al massimo tre volte. Al raggiungimento del limite imposta `done=true` anche se il servizio Install Referrer non è mai riuscito a rispondere; un utente che apre l'app offline o con Play temporaneamente non disponibile può perdere definitivamente l'attribuzione dell'invito.
- Il referrer viene salvato in SharedPreferences non incluse nel backup, coerentemente con il comportamento “nuova installazione = nuovo referrer”. Il valore è limitato a 600 caratteri ma resta una stringa grezza locale; il parser JS deve accettare solo il formato previsto e ignorare parametri non riconosciuti.
- `device()` espone l'hash stabile di ANDROID_ID senza un controllo d'età nativo: la protezione “solo adulti” dipende dal chiamante JS. La funzione è un plugin interno, non un endpoint pubblico, ma un controllo nativo sarebbe una difesa aggiuntiva. Il server, inoltre, non può dimostrare che l'hash sia stato generato dal dispositivo dichiarato (AUD-052).

### Widget e recensioni
- `WidgetPlugin.pin()` restituisce `asked`, cioè se Android ha accettato la richiesta di mostrare il prompt; non significa che l'utente abbia effettivamente aggiunto il widget. La UI deve dire “Android ti chiederà di aggiungerlo”, non “widget aggiunto”, e attendere l'eventuale aggiornamento del conteggio.
- `ReviewPlugin.requestReview()` risolve la chiamata anche quando Google non mostra la finestra o il flusso fallisce. La UI non deve affermare che l'utente ha lasciato una recensione; il codice può registrare soltanto un tentativo di richiesta, mai l'esito della recensione.
- Entrambi i plugin si affidano al gate JS per età e frequenza; il controllo deve essere testato end-to-end. La richiesta di recensione non deve essere mostrata dopo frasi di crisi, momenti negativi o a minori.

### Nuovi elementi nel registro
| ID | Area | Osservazione | Stato | Gravità provvisoria | Prossimo controllo |
|---|---|---|---|---|---|
| AUD-077 | Android/condivisione/storage | SharePlugin non limita la dimensione Base64, non pulisce i file cache e non elimina i record MediaStore pendenti in caso di errore | Gap di robustezza confermato da codice | Media | Limiti, cleanup garantito e test storage pieno/stream nullo |
| AUD-078 | Growth/referral | Dopo tre tentativi falliti il referrer viene marcato definitivamente come completato; attribuzione invito può andare persa | Rischio funzionale confermato | Media | Retry con backoff/tempo e stato “non disponibile” separato da “completato” |
| AUD-079 | Widget/UX | Il risultato `asked` non prova che il widget sia stato aggiunto | Semantica API da rispettare | Bassa/Media | Verificare copy e aggiornamento stato dopo il prompt |
| AUD-080 | Recensioni/UX | ReviewPlugin risolve anche quando Google non mostra la finestra; non si può sapere se l'utente ha recensito | Limite API da rispettare | Bassa/Media | Registrare solo tentativo, mai recensione completata |

### Punto di ripartenza
Audit in sola lettura. Restano da esaminare i provider widget, i flussi JS che invocano share/pin/review, il manifest merged e le autorizzazioni Play; nessuna modifica ai plugin prima del piano generale.
