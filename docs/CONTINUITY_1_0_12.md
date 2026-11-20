# Tanetto — checkpoint di continuità 1.0.12

Aggiornato: 21 novembre 2026  
Repository: `riccardosignorello/Tanetto`  
Ramo di lavoro: `work/tanetto-1.0.12-agegate-fix`  
Base tecnica: `baseline/rel-111`  
Commit applicativo al momento del checkpoint: `9c3c75910f6ebae8e78c4cac7c607674b6cf05a1`

Questo file serve a riprendere il lavoro in una nuova chat senza ricominciare l'audit e senza perdere decisioni o modifiche.

## Stato verificato

La revisione è in corso sul fork personale. Il repository originale `tanettoapp/Tanetto` non è stato modificato e non è stato eseguito alcun merge o rilascio.

Ultima CI: run **66**, commit `9c3c7591`, ancora in esecuzione al momento del checkpoint. Sono già risultati positivi:
- compilazione Java Android;
- test unitari di `AgePolicy`;
- controlli degli strumenti e build;
- sincronizzazione degli artefatti;
- controlli dei testi nelle 14 lingue;
- test delle regole Firestore con emulatore.

È in corso il blocco delle prove funzionali browser `Prove 1.0.11`; restano poi i test widget Android/Robolectric. Non dichiarare la release pronta finché l'intera CI non è verde.

## Modifiche applicate al ramo

1. **Età e minori**
   - La scelta dell'età Android è salvata nel deposito nativo `getNoBackupFilesDir()`, separato dai dati sottoposti a backup.
   - Aggiunta la regola `AgePolicy.canReplace`: una data già dichiarata è immutabile; la scelta esplicita «Preferisco non dirlo» può essere sostituita successivamente da una data.
   - La stessa protezione è applicata nel wrapper JavaScript e nel plugin nativo `AgeStorePlugin`.
   - Stato `pending` distinto da `skip`: finché la domanda non ha risposta, nessuna chiamata all'SDK pubblicitario; se l'utente sceglie esplicitamente `skip`, sono consentiti solo annunci teen non personalizzati. Sotto i 13 anni restano bloccati.
   - Aggiunti/aggiornati test per immutabilità, stato pending, scelta skip e deposito locale.

2. **Privacy e backup**
   - L'informativa è stata aggiornata al 21/11/2026.
   - Le 14 lingue chiariscono che mese e anno di nascita non sono inclusi nei nuovi backup Android.
   - È dichiarato che un backup creato con una versione precedente potrebbe ancora contenere la vecchia copia fino alla sostituzione/eliminazione del backup; l'app elimina la vecchia copia locale al primo avvio dopo l'aggiornamento.
   - È mantenuta l'indicazione su come disattivare il backup Android.
   - I test controllano le 14 traduzioni e la pagina privacy pubblica.

3. **Test e stabilità**
   - Il mock nativo dell'età nei test sopravvive ai reload del WebView usando una chiave di test separata.
   - I test snapshot nativi usano il fuso `Europe/Rome` per evitare differenze CET/UTC.
   - Aggiunto il test di regressione G-07 per scollegamento e ricreazione dell'`IntersectionObserver` quando la scena viene rimossa e ripristinata.
   - Migliorata la griglia delle icone su schermi fino a 380 px.
   - Ridotto il lavoro di animazione delle lanterne (tre lanterne mobili, senza deriva orizzontale) per contenere layout e ricalcoli.
   - La CI ora mostra il contesto completo degli errori dei test, invece di troncare il traceback.

## Allineamento con il ramo principale

Il ramo `main` del fork contiene **15 commit non ancora integrati** nel ramo di lavoro; il ramo di lavoro contiene invece molte modifiche applicative successive alla base comune.

I 15 commit di `main` sono principalmente sito, SEO, pagine in 14 lingue, press kit, social e comunicazioni Discord. Sono da preservare, non da sovrascrivere.

La nuova architettura del sito prevede:
- homepage e pagine marketing alla radice;
- applicazione web in `/app/`;
- pagine privacy, elimina-account e licenze alla radice;
- sito generato da `_site_src/build.py`.

Il `tools/build.py` del ramo applicativo supporta già `--out`, ma il workflow e `app-android/prep_www.py` sono ancora impostati sul vecchio output alla radice. **Non fare merge alla cieca**: dopo la QA della 1.0.12 va creata una fase/ramo d'integrazione che costruisca l'app in `/app/`, preservi il sito e aggiorni la versione del sito a 1.0.12.

## Decisioni di prodotto già prese

- Non rifare ora i personaggi. Prima vanno stabilizzati codice, privacy, flussi e sito.
- La revisione di personaggi, identità visiva, tono, onboarding e posizionamento va fatta in una fase dedicata di audit prodotto/brand, con decisione motivata tra evoluzione dei personaggi esistenti e sostituzione.
- Non pubblicare né fare merge sul repository originale senza QA completa e revisione dell'integrazione.

## Blocchi ancora aperti

1. Attendere e leggere l'esito completo della CI run 66; in particolare eventuali traceback di `t_110_story.py`, `t_111_week.py`, test performance/eventi, icone e nuovo test G-07.
2. Correggere ogni regressione emersa e ottenere una CI completamente verde sul commit finale.
3. Solo dopo la QA, aggiornare Android da `versionName 1.0.11 / versionCode 114` a `1.0.12 / 115`, verificando tutte le altre stringhe di versione.
4. Integrare il sito `main` con l'app 1.0.12, adattando build, output `/app/`, pagine legali, service worker e preparazione Android.
5. Eseguire un audit release Android completo e generare gli artefatti. Firma e pubblicazione richiedono le credenziali/azioni dell'utente se non sono già disponibili.
6. Dopo la base tecnica e il sito: audit completo prodotto, UX, onboarding, personaggi, brand, localizzazione, SEO, acquisizione, retention e monetizzazione.

## Avanzamento prudenziale

- Hardening tecnico della milestone 1.0.12: **circa 70%** (codice e test principali aggiornati; CI completa, version bump, integrazione sito e pacchetto release ancora aperti).
- Progetto Tanetto 360°: **circa 25%** (le fasi strategiche di prodotto/brand/personaggi e crescita non sono ancora state affrontate in modo completo).

Le percentuali sono stime di pianificazione, non metriche automatiche. Aggiornarle solo quando cambiano deliverable verificabili.
