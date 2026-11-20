# Tanetto — checkpoint di continuità audit

**Ultimo aggiornamento:** 20 novembre 2026  
**Repository:** `riccardosignorello/Tanetto`  
**Branch documentale audit:** `audit/tanetto-full-review`  
**Ultimo commit del registro prima di questo checkpoint:** aggiornato dopo `f936e99d5a80200755d4f359cc5a7de114886d26`; verificare l'HEAD corrente del branch audit.  
**Registro master:** [AUDIT/MASTER-REGISTER.md](MASTER-REGISTER.md)

## Regola di lavoro non negoziabile
1. L'originale resta intatto. Tutto il lavoro applicativo è sul fork dell'utente.
2. **Nessuna modifica al codice dell'app, ai workflow o alla configurazione di produzione prima di aver completato l'audit integrale, l'inventario unico e il piano generale con dipendenze.**
3. Le sole modifiche attuali sono documentazione di audit su questo branch dedicato. Non fare merge o PR.
4. Prima leggere integralmente il registro master e questo checkpoint. Non chiedere nuovamente ZIP o informazioni già disponibili.
5. Procedere autonomamente per blocchi ampi; non inviare aggiornamenti di stato a ogni passaggio. Scrivere un nuovo checkpoint nel repository dopo ogni blocco consistente e prima di una possibile interruzione.
6. Non dichiarare 100% finché tutte le aree non sono state analizzate, le correzioni non sono state applicate, le verifiche indipendenti non sono passate e la checklist di rilascio/marketing non è completa.

## Branch applicativi
- `work/tanetto-1.0.12`: branch di lavoro di base; ultimo SHA noto `07c55c6d8d5613c6a18760308df10d5d9a75a570`.
- `work/tanetto-1.0.12-agegate-fix`: branch isolato con la correzione trasversale AGE_VALUE; ultimo SHA noto `76b6a4fd801378ae07a5e7e92ab06dcf2441159a`. Non integrato.
- `baseline/rel-111`: baseline di confronto.
- `audit/tanetto-full-review`: solo registro e checkpoint audit; mai usare come branch applicativo.
- Verificare gli SHA prima di fare riferimento a essi; quelli sopra sono gli ultimi noti dalla sessione precedente.

## Metodo e avanzamento
- L'utente ha chiesto di arrivare autonomamente al 100%, fermandosi soltanto quando è davvero necessaria un'azione sua.
- L'utente non vuole essere costretto a scrivere “vai avanti” continuamente e non vuole messaggi di stato frequenti.
- L'assistente non può creare autonomamente una nuova chat né continuare a lavorare in background dopo la chiusura della sessione. La continuità si ottiene salvando tutto qui e riprendendo in una nuova chat leggendo questo file e il registro master.
- Ultima percentuale complessiva convalidata prima di questo audit: **40%** del percorso ecosistema completo. Non aumentarla per il solo fatto di aver scritto il registro: aggiornare solo a milestone realmente completate e validate.
- Il report finale deve essere comprensibile in italiano semplice, prima per gravità e poi per area, spiegando problema, causa, conseguenza, soluzione, verifica e decisioni richieste all'utente.

## Risultati audit registrati finora
Il registro master contiene i dettagli e le prove; questa sezione è solo un indice:
- CI, build Android, dipendenze, firma release, App Check, Firebase e Firestore rules.
- Età, plugin nativo, pubblicità, consenso digitale, soglie per Paese e modalità protetta.
- Backup Android, backup Firebase, privacy policy, cancellazione account, dati sensibili del diario.
- Economia Tanì, premi, acquisti, referral, album e Introvabili.
- Giochi, mondi, localizzazione, accessibilità, performance e audio.
- Safety/crisis support e linee di aiuto.
- Sito, SEO, press kit, distribuzione e contenuti pubblici.

### Finding prioritari da non perdere
- **AUD-059 — Media (hardening):** il normale click degli Introvabili è già protetto da `xvWithUsable()` e da un listener `document` in capture che blocca `#tryBuy` quando `xvUsable() < prezzo`. Il precedente sospetto di bypass completo era errato. Resta da centralizzare il controllo nella funzione atomica di spesa e aggiungere un test E2E del percorso reale.
- **AUD-065 — Critico:** Android Auto Backup include WebView Local Storage e dati del widget per tutte le fasce d'età; il diario/progressi locali possono essere trasferiti a Google anche nella modalità protetta, se il backup di sistema è attivo. Il backup Tanetto/Firebase è distinto. L'informativa dice erroneamente che l'età è inclusa; l'età nativa è in `noBackupFilesDir` e viene esclusa.
- **AUD-068 — Critico:** il backup Firebase può contenere diario e umore, quindi contenuti potenzialmente relativi alla salute. Serve valutazione legale GDPR art. 9 e scelta architetturale (escludere diario, cifratura E2E o consenso specifico).
- **AUD-069 — Critico da verificare:** la tabella `AGE_CONSENT` è più ampia di quanto inizialmente stimato e include già India/Turchia a 18; non riscriverla senza revisione legale. Restano da verificare valori, copertura di tutti i mercati, granularità subnazionale e limiti dei segnali locale/fuso modificabili.
- **AUD-063 — Alta:** `tests.yml` prova a fare push usando `GITHUB_REF_NAME` anche per PR (`123/merge`), con permessi write globali; separare test read-only e sync artefatti.
- **AUD-055/056 — Alta:** deploy delle regole Firestore non tracciato; App Check production off e flavor on non testato in CI.
- **AUD-030 — Alta:** la contabilità dei Tanì pagati incrementa `spentN` dell'intera spesa, anche quando la quota pagata residua è inferiore; serve `min(spesa, residuo pagato)` e un test esplicito del caso limite.
- **AUD-057 — Media/Alta:** filtro nomi basato su sottostringhe può creare falsi positivi e non ha copertura madrelingua CJK.
- **AUD-060 — Alta:** sistema di supporto euristico in 14 lingue e linee telefoniche devono essere validati da professionisti e madrelingua; non presentarlo come diagnosi o rilevamento completo.
- **AUD-070 — Critica:** nel branch candidato il Plus mensile viene classificato, ma il bucket è salvato dopo il saldo; anche pacchetti e bonus hanno finestre fra salvataggio e classificazione. `creditPack` consuma il token Google Play senza verificare l'esito del salvataggio. Il conteggio `spentN` può sovracontare. Serve una transazione idempotente unica.
- **AUD-058/064 — Alta:** test reali su device, servizi Google/Firebase, accessibilità assistiva, log/artifact, SAST e dependency scanning ancora mancanti.

## Correzioni d'interpretazione da mantenere
- Le soglie d'età sono distinte: sotto13 child; sotto l'età digitale del Paese modalità protetta; sopra l'età digitale ma sotto18 alcune funzioni cloud/analytics/share possono essere consentite, ma ads restano teen e offerte/inviti/review sono bloccati; 18+ trattamento adulto. Non descrivere `ageCloudOk()` come “solo maggiorenni”.
- `work/tanetto-1.0.12` ha ancora lettori legacy `S.age`; il branch agegate-fix li porta a `AGE_VALUE`. Non confondere il difetto del ramo base con il risultato della patch.
- Il run CI storico del branch agegate-fix ha avuto 190 controlli nativi/browser verdi, ma 9 file di test generali falliti e snapshot widget con differenza di un'ora; Robolectric saltato. Non dichiarare CI verde. Alcuni fallimenti sono test obsoleti dopo la migrazione dell'età, altri sono problemi reali o ambientali da diagnosticare.
- Il filtro nomi, il bypass Introvabili e la copertura legale non sono ancora stati corretti: siamo in fase di audit.
- Il redesign dei personaggi non va anticipato: prima consolidare prodotto, UX, economia, sicurezza e strategia di brand; poi audit artistico e scelta informata.
- I contenuti social già programmati per le prossime due settimane non vanno modificati. La nuova strategia partirà dopo l'ultimo contenuto già programmato.
- Budget IA massimo noto: €200/mese. Windsor.ai collegato a `sc-domain:tanetto.app`.

## Prossime attività da completare (in ordine)
1. Proseguire audit di tutti i moduli sorgente non ancora coperti: shop/billing e restore, backup, account, notifiche, widget, sharing, PWA/offline, iOS/web, accessibilità, performance, localizzazione, eventi, mondi, personaggi e contenuti.
2. Completare mappa di tutti i flussi dati: sorgente → dispositivo → SDK/backend → retention → cancellazione; verificare privacy policy, Data Safety, Play Console e UMP.
3. Analizzare integralmente tutti i test e riprodurre i fallimenti CI; classificare ciascuno come bug, test obsoleto, ambiente o falso positivo.
4. Analizzare dipendenze e vulnerabilità correnti, licenze, supply chain, permessi Android, manifest merged e build R8.
5. Fare ricerca pubblica aggiornata su normative Google Play/AdMob/Firebase, GDPR/mercati, helplines, SEO, concorrenti e posizionamento. Citare fonti.
6. Audit del sito live, Core Web Vitals, SEO tecnico, contenuti, analytics, dominio/marchio, app listing, press kit, funnel e conversioni.
7. Audit completo di brand, personaggi, stile, animazione, voce, accessibilità e piano social/marketing; rispettare i post già programmati.
8. Produrre un unico inventario finale con priorità, dipendenze, owner, soluzione e test; chiedere all'utente solo le decisioni/credenziali/azioni esterne realmente indispensabili.
9. Solo dopo il piano approvato, applicare in modo coordinato tutte le modifiche sul fork, con commit piccoli e tracciabili.
10. Doppia verifica indipendente, test su device/servizi reali, build AAB firmata e checklist di release; nessuna pubblicazione senza esito positivo.

## Regola per la prossima chat
Aprire una nuova chat nello stesso progetto e scrivere semplicemente: **“Riprendi Tanetto dal checkpoint AUDIT/CONTINUATION.md e prosegui senza chiedermi aggiornamenti.”** La nuova sessione deve prima leggere il checkpoint e `AUDIT/MASTER-REGISTER.md`, verificare branch/SHA, poi riprendere dal punto 1 senza ripetere l'audit già documentato.
