# TANETTO — PROPOSTA DI COMPLETAMENTO TEORICO-OPERATIVO PER CLAUDE
Data: 21 novembre 2026
Repository: riccardosignorello/Tanetto
Branch applicativo di riferimento: work/tanetto-1.0.12-agegate-fix
Branch audit storico: audit/tanetto-full-review
Stato documento: proposta strategica dell'assistente, da verificare criticamente prima dell'esecuzione

> Questo documento non sostituisce il MASTER CONTROL CENTER né il registro AUDIT. Li organizza in una proposta unitaria di esecuzione. Le evidenze originali, gli stati e le decisioni registrate restano nelle fonti canoniche.

## 1. Perché esiste questa proposta

L'obiettivo è evitare che il progetto rimanga intrappolato in un ciclo di audit, riepiloghi, micro-correzioni e nuove ripartenze. La proposta è separare chiaramente:

1. **Completamento teorico-operativo:** conoscere il perimetro, avere inventario deduplicato, architettura target, decisioni esplicite, priorità, dipendenze, piano di implementazione, test e criteri di accettazione per ogni area.
2. **Completamento pratico:** applicare le modifiche, eseguire test, correggere regressioni, validare su ambienti reali e preparare il rilascio.
3. **Accettazione esterna/proprietario:** decisioni personali, credenziali, servizi di terzi, verifiche legali/professionali e operazioni irreversibili.

L'assistente propone di completare ora il più possibile il punto 1, per consegnare a Claude un mandato pratico molto più maturo. Claude deve però **contestare e verificare** questa proposta: non deve assumerla corretta per autorità, né ripetere da zero quanto è già dimostrato.

### Cosa significa davvero “100% teorico”

Il 100% teorico non significa conoscere in anticipo ogni difetto che emergerà a runtime. Significa che ogni area ha:
- perimetro e inventario delle funzionalità;
- evidenze attuali e livello di certezza;
- rischi/finding collegati, senza duplicati;
- soluzione target o alternative tecniche comparate;
- dipendenze e decisioni richieste;
- task atomici, priorità e ordine;
- criteri di accettazione e piano di test;
- limiti che richiedono device, account, dati o professionisti esterni.

Un test che non è stato eseguito resta un test da eseguire; un parere legale non può essere sostituito da un'ipotesi dell'assistente o di Claude.

## 2. Istruzioni a Claude: prima riflettere, poi eseguire

Leggi integralmente:
- `docs/MASTER_CONTROL_CENTER.md` sul branch applicativo;
- `docs/PROGRESS_AND_ESTIMATE_2026-11-21.md`;
- `docs/GROWTH_AND_UNIT_ECONOMICS.md`;
- `AUDIT/MASTER-REGISTER.md` e `AUDIT/CONTINUATION.md` sul branch audit;
- il checkpoint applicativo e i workflow CI pertinenti.

Poi fai una verifica indipendente del repository e produci una risposta strutturata a queste domande:

1. Quali parti della proposta sono corrette e quali sono deboli, incomplete, obsolete o troppo costose?
2. Quali finding sono già risolti nel branch applicativo più recente, quali sono ancora aperti e quali sono falsi positivi/duplicati?
3. Quali interventi possono essere accorpati in una singola soluzione architetturale senza perdere tracciabilità?
4. Qual è l'ordine più efficiente che riduce il rischio di dover rifare il lavoro?
5. Quali decisioni appartengono al proprietario e quali possono essere prese autonomamente in sicurezza?
6. Quali sono le opzioni tecniche con minor costo operativo e di manutenzione che raggiungono un livello di sicurezza adeguato?
7. Quali verifiche sono impossibili senza Play Console, AdMob, Firebase/Google Cloud, dispositivi reali, dati di produzione o professionisti?

Dopo questa revisione critica, **non fermarti a un altro documento di analisi**: completa l'inventario teorico e poi avvia le attività pratiche autonome, a blocchi ampi, rispettando i gate indicati.

## 3. Baseline e governance obbligatorie

- Repository operativo: `riccardosignorello/Tanetto`.
- Repository originale `tanettoapp/Tanetto`: preservarlo, non modificarlo.
- Branch `work/tanetto-1.0.12-agegate-fix`: candidato applicativo di lavoro; verificare HEAD e stato effettivi.
- Branch `audit/tanetto-full-review`: registro storico e finding; non usarlo come branch applicativo.
- Non unire alla cieca `main`, `rel-111` o il branch age-gate. Ricostruire antenati, diff, file sovrapposti, contenuti sito/app e strategia d'integrazione.
- Prima di ogni blocco leggere il Control Center, verificare branch/HEAD, commit recenti, CI e working tree.
- Non fidarsi di SHA, CI o stato riportati in vecchie chat/documenti senza ricontrollo.
- Nessun reset distruttivo, force push, riscrittura della storia, merge indiscriminato o rilascio senza autorizzazione.
- Prima di ogni commit esaminare il diff completo; commit piccoli, coerenti e reversibili.
- Ogni task mantiene ID stabile, priorità, stato, dipendenze, criterio, evidenza e commit.
- Non contare documentazione, numero di commit o test non eseguiti come avanzamento tecnico.
- Se un task è bloccato, passare a quelli indipendenti. Chiedere al proprietario soltanto quando serve una decisione reale, una credenziale, una spesa o un'azione fisica/esterna.

### Stati e misurazione

Usare esclusivamente gli stati definiti nel MASTER CONTROL CENTER. Non pubblicare percentuali globali finché WBS atomica, pesi, deduplicazione e denominatore non sono congelati. Calcolare separatamente:
- completezza teorica/audit;
- implementazione/hardening;
- verifica QA;
- release readiness;
- ecosistema post-lancio e crescita continua.

Il “100%” di una milestone va definito come 100% dei deliverable inclusi in quella milestone, non come fine assoluta del prodotto o della crescita futura.

## 4. Piano architetturale e ordine proposto

L'ordine seguente è una proposta di dipendenze, non un ordine rigido se il codice dimostra che un'attività indipendente può essere anticipata.

### Fase 0 — Baseline e inventario unico
**Aree:** GOV, AUD-F, ENG.

- Verificare i due branch, le relazioni con main/rel-111 e il commit esatto su cui si lavorerà.
- Inventariare file sorgente, build, dipendenze, moduli nativi, Firebase, asset, pagine pubbliche, test, workflow e configurazioni.
- Deduplicare AUD-001–AUD-090 e i task GOV/SEC/PRIV/ECON/UX/GAME/PLAT/QA/WEB/BRAND/GROW/REL.
- Distinguere bug confermati, rischi architetturali, ipotesi, gap di test, policy decision e limiti di API.
- Costruire una WBS atomica completa con pesi e acceptance criteria.

**Uscita:** inventario unico con ogni finding originale collegato a uno o più task, senza perdere gli ID storici.

### Fase 1 — Fiducia, privacy, età, sicurezza e integrità economica
**Aree:** SEC, PRIV, ECON, ENG. Priorità massima.

Raggruppare in epic coerenti:

1. **Età, consenso e minori:** AUD-012, 014, 023, 041, 052, 053, 069, 071, 074, 089. Verificare la migrazione AGE_VALUE su tutti i moduli e branch; distinguere child/teen/adult/skip/unknown; controllare enforcement JS e nativo, pubblicità, cloud, condivisione, account e funzioni riservate. La soglia 13+ delle cartoline non va cambiata per deduzione: verificare contenuti e policy dei mercati.
2. **Backup, import/export, privacy e cancellazione:** AUD-001, 006, 016–019, 029, 035–037, 039–040, 042–044, 065–068, 085. Mappare ogni dato da origine a destinazione, backup Android, WebView, Firebase, export, restore, retention e cancellazione. Risolvere la contraddizione fra informativa e comportamento effettivo. Introdurre limiti di dimensione prima di decompressione/parsing, parser robusto, import atomico e test di corruzione/race. La firma client con chiave nel bundle non va trattata come autenticazione crittografica.
3. **Ledger Tanì e Google Play Billing:** AUD-011, 030–032, 034–036, 040, 059, 070, 090. Trattare saldo, bucket pagato/gratuito, spentN, token, pacchetti, regalo Plus, bonus primo acquisto, premi giochi/mondi/album e restore come un unico dominio di integrità. Progettare accredito idempotente e durevole, protezione da callback duplicate/concorrenza/crash, refund/revoca, token non consumato, oltre 200 acquisti, cambio account/device e import non attendibile. Non usare stringhe importate come prova di acquisto.
4. **Referral e anti-abuso:** AUD-003, 013, 021, 022. Distinguere dati dichiarati dal client da fatti attestati dal server. Valutare App Check/Play Integrity e ledger server, misurando rischio massimo economico e costi; non aggiungere infrastruttura senza confronto costi/benefici.
5. **Firebase, sicurezza applicativa e supply chain:** AUD-002, 004, 005, 015, 037, 051, 055, 056, 063, 064, 082, 083. Least privilege, separazione workflow read-only/write, secrets, keystore, App Check, regole, deployment tracciato, CSP e scansioni dipendenze/secret/SAST. Verificare configurazioni reali e non soltanto i file.

**Decisioni da non inventare:** scelta sul backup cloud di diario/umore (PRIV-002), mercati supportati e matrice legale dell'età, livello di protezione anti-frode accettabile e disponibilità a usare backend/servizi con costo. Preparare opzioni, costi, conseguenze e raccomandazione; chiedere solo quando la scelta è realmente necessaria. L'audit e le correzioni indipendenti devono continuare nel frattempo.

### Fase 2 — Stabilità, test, Android e piattaforme
**Aree:** QA, PLAT, ENG.

- CI e osservabilità: AUD-007, 020, 024, 046, 058, 063, 064, 074–076. Diagnosticare il run 66 e i test storici, conservare log/artifact, separare test PR read-only da operazioni di scrittura, rendere i test deterministici e non correggere le aspettative soltanto per ottenere verde.
- Plugin e device: AUD-052, 053, 077–080, 082–083. Verificare Share, Growth/Referrer, Widget, Review, Billing, AgeStore, Ads; gestire cleanup, limiti, retry e semantica corretta degli esiti.
- Tempo, viaggi e notifiche: AUD-038–039, 054, 081, 084–088. Distinguere tempo UI da tempo autorevole per premi/abusi; testare API Android, reboot, offline, cambio ora/fuso e restore cross-device. Evitare promesse di anti-cheat dove il client non può attestare il tempo.
- Build: compilare debug e release con R8/shrinkResources e App Check on; verificare manifest merged, permessi, package ID, firma, mapping e installazione. La release non è pronta finché non esiste una build riproducibile sul commit finale.
- Matrice test: unit, integrazione, emulatori, E2E browser, plugin nativi, Firebase emulator, Play sandbox e device fisici. Ogni test deve indicare cosa prova e cosa non prova.

### Fase 3 — Prodotto, gameplay, UX e contenuti
**Aree:** AUD-F, GAME, UX, PLAT.

- Inventariare ogni flusso: onboarding, obiettivi, diario, giochi, viaggi, mondi, album, collezioni, shop, premi, eventi, cartoline, progressi, notifiche, account, backup, Plus, ads e modalità offline.
- Mappare stati vuoti, errori, retry, dati mancanti, reinstallazione, cambio lingua, cambio fascia d'età, restore e uso senza rete.
- Verificare coerenza tra ricompense, difficoltà, progressione, cap giornalieri, motivazione e comportamento non punitivo.
- Risolvere UX/accessibilità: AUD-025, 057, 061–062, 071–072, 079–081. Testare touch target, contrasto, screen reader, font scaling, reduced motion, audio focus, layout 320/360/390 px e lingue RTL/CJK ove supportate.
- Performance: AUD-026, 047–048, 073. Misurare profili reali, non ottimizzare alla cieca.
- Safety/benessere: AUD-028 e AUD-060 richiedono revisione indipendente di professionisti qualificati e madrelingua, verifica delle linee ufficiali e test di falsi positivi/negativi. Non presentare euristiche come diagnosi o sistema di rilevamento completo.
- Le 14 lingue richiedono revisione madrelingua per testi sensibili, legali, di sicurezza e store; i test tecnici non equivalgono a qualità linguistica.

**Personaggi e identità:** nessun redesign anticipato. Prima chiudere audit prodotto/UX, definire pubblico e posizionamento, poi fare un audit dedicato di personaggi, stile, animazione, voce, accessibilità e riconoscibilità. Solo dopo proporre varianti e test di concept.

### Fase 4 — Web, SEO, brand e crescita
**Aree:** WEB, BRAND, GROW, ECON, PRIV.

- Sito e app: AUD-009–010, 045–050, 051. Distinguere pagine pubbliche, app e output build; verificare integrazione dei commit di main preservando sito, SEO, 14 lingue, press kit, social e contenuti. Verificare sitemap, canonical, hreflang/URL lingua, robots, CSP, header, performance, link store e pagine legali.
- Asset e licenze: AUD-045, 048. Inventario autore/fonte/licenza/diritti, file sorgente e uso commerciale; nessun asset di provenienza incerta nella release.
- Growth: completare GROW-002–008 e il documento `docs/GROWTH_AND_UNIT_ECONOMICS.md`. Mappare evento→codice→destinazione→dato→consenso/base→retention; verificare attribuzione paid/organic/referral e funnel end-to-end. Non dedurre l'attribuzione paid dal solo Play Install Referrer degli inviti.
- Metriche: activation, D1/D7/D30, utenti significativi, conversione Plus, ricavi netti per coorte, CAC, LTV e payback. La North Star dei 3 giorni significativi è una candidata, non approvata.
- Monetizzazione: mantenere come ipotesi attuale Free + Plus, rewarded opt-in e non interstitial automatici; validare il valore del prodotto prima di aumentare pressione pubblicitaria o introdurre nuove monetizzazioni.
- Campagne: budget discusso 0–100 € è un tetto ipotetico, non autorizzazione di spesa. Nessun paid finché tracking, retention, ricavi e privacy non superano i gate. Non usare diario, umore, obiettivi, età o dati sensibili per targeting.
- Proteggere i contenuti social già programmati per le due settimane successive al checkpoint; nessuna modifica senza autorizzazione.

### Fase 5 — Release readiness e operations
**Aree:** REL, QA, SEC, PRIV, PLAT.

- Build AAB release riproducibile, signing corretto, Play App Signing, secrets fuori repo, mapping R8 e rollback.
- Checklist store: target audience, age/content declarations, Data Safety, privacy policy, ads, billing, account deletion, permessi, screenshot e listing per lingua.
- Firebase rules/config/Functions/App Check/deployment allineati e verificati.
- Smoke test su dispositivi reali e matrice versioni Android; install/upgrade/restore/offline/notification/billing/share/account deletion.
- Monitoraggio errori, supporto, procedure incidenti, backup/restore e costi.
- No release, rollout, merge su originale o spese senza esplicita autorizzazione.

## 5. Registro completo dei finding: raggruppamento senza perdita di ID

Questa è una mappa di lavoro, non una riclassificazione automatica dei finding. Il registro audit resta fonte di verità per descrizione, severità, evidenza e correzioni già apportate.

| Epic | Finding collegati |
|---|---|
| Governance, CI, supply chain, release | AUD-002, AUD-004, AUD-005, AUD-007, AUD-008, AUD-009, AUD-015, AUD-020, AUD-024, AUD-046, AUD-051, AUD-055, AUD-056, AUD-063, AUD-064, AUD-076, AUD-082, AUD-083 |
| Età, ads, minori, consenso e condivisione | AUD-001, AUD-006, AUD-012, AUD-014, AUD-023, AUD-041, AUD-052, AUD-053, AUD-069, AUD-071, AUD-074, AUD-089 |
| Privacy, backup, import/export, account deletion | AUD-016, AUD-017, AUD-018, AUD-019, AUD-029, AUD-035, AUD-036, AUD-037, AUD-039, AUD-040, AUD-042, AUD-043, AUD-044, AUD-065, AUD-066, AUD-067, AUD-068, AUD-085 |
| Economia, Billing, premi e restore | AUD-011, AUD-030, AUD-031, AUD-032, AUD-034, AUD-035, AUD-036, AUD-040, AUD-059, AUD-070, AUD-090 |
| Referral, clock e anti-abuso | AUD-003, AUD-013, AUD-021, AUD-022, AUD-038, AUD-039, AUD-054, AUD-078, AUD-081, AUD-084, AUD-085 |
| Android plugin, notifiche e UX nativa | AUD-034, AUD-052, AUD-053, AUD-054, AUD-077, AUD-078, AUD-079, AUD-080, AUD-081, AUD-086, AUD-087, AUD-088 |
| UX, accessibilità, localizzazione, performance, safety | AUD-025, AUD-026, AUD-027, AUD-028, AUD-057, AUD-058, AUD-060, AUD-061, AUD-062, AUD-072, AUD-073, AUD-075 |
| Web, SEO, contenuti, brand e growth | AUD-010, AUD-045, AUD-047, AUD-048, AUD-049, AUD-050, AUD-061, AUD-062 |

Controllo di copertura obbligatorio: ogni ID da AUD-001 a AUD-090, inclusa l'assenza storica di AUD-033 e il nuovo AUD-090, deve essere esplicitamente classificato come aperto, risolto e verificato, smentito, duplicato/accorpato, deferred o bloccato. Nessun ID scompare dal registro.

## 6. Decisioni e dipendenze da presentare al proprietario

Preparare una scheda breve per ogni decisione con: opzioni, pro/contro, costo iniziale e ricorrente, impatto privacy/sicurezza/UX, reversibilità, raccomandazione e momento ultimo utile per decidere.

Decisioni già note o da confermare:
1. **PRIV-002:** diario/umore nel backup Firebase. Comparare esclusione, cifratura end-to-end e consenso specifico; spiegare conseguenze su sync/restore e accesso amministrativo. Non scegliere in autonomia.
2. **Mercati e soglie d'età:** definire mercati effettivamente supportati e ottenere revisione legale; il codice da solo non determina la soglia corretta.
3. **Ledger acquisti:** comparare soluzione server-verificata con alternative offline-first, costi Firebase/Google Play Developer API, manutenzione e rischio di perdita/duplicazione. Non introdurre un backend nuovo senza motivazione e stima.
4. **Referral/attestazione:** scegliere livello di anti-abuso coerente con valore economico e budget; quantificare il rischio residuo.
5. **Safety/benessere:** revisione professionale obbligatoria per claim, copy, linee e flussi sensibili.
6. **Growth:** nessuna spesa pubblicitaria automatica; approvazione separata del proprietario dopo gate misurabili.
7. **Brand/personaggi:** decisione dopo audit prodotto/UX/brand, non prima.

Non chiedere al proprietario di scegliere dettagli tecnici che possono essere determinati con analisi, test o confronto costi/benefici. Non trasformare preferenze provvisorie in decisioni già approvate.

## 7. Definition of Done per ogni epic

Un epic è completato soltanto quando:
- tutti i task figli sono elencati e tracciabili;
- il comportamento atteso è descritto;
- i finding originali sono collegati e classificati;
- la soluzione è implementata o la decisione/limitazione è accettata;
- i test automatici pertinenti passano sul commit corrente;
- i casi negativi, edge case e regressioni sono testati;
- le prove runtime/device/servizi reali richieste sono allegate oppure esplicitamente bloccate da una dipendenza esterna;
- documentazione, informativa e UI corrispondono al comportamento reale;
- una revisione critica indipendente non trova difetti aperti ad alta gravità;
- rollback e impatto operativo sono documentati.

Per privacy, legale, sicurezza minori e safety, il solo superamento di test software non è sufficiente.

## 8. Strategia di esecuzione pratica per evitare settimane di lavoro frammentato

- Dopo la baseline, iniziare subito gli interventi autonomi e indipendenti che hanno già specifica sufficiente.
- Non attendere la chiusura di tutto l'audit per correggere un problema critico già dimostrato, ma non fare refactor trasversali senza mappa delle dipendenze.
- Accorpare finding con la stessa causa: ledger economico, backup/restore, age gate, CI/supply chain, data map/cancellazione, tempo/notifiche.
- Per ogni epic: analisi mirata → design breve → implementazione coordinata → test → regressione → review → checkpoint.
- Eseguire suite per area durante il lavoro e suite completa alla fine; evitare una sola enorme integrazione finale.
- Se una verifica richiede accesso esterno, lasciare un task preciso e continuare il resto.
- Non fare commit per ogni singola riga; commit per unità logiche verificabili.
- Nessun aggiornamento all'utente a ogni passaggio: comunicare milestone sostanziali e decisioni davvero necessarie.

## 9. Deliverable che Claude deve produrre

1. `docs/CLAUDE_REVIEW_OF_PROPOSAL.md`: valutazione critica della proposta, correzioni motivate e decisioni.
2. Inventario WBS atomico e deduplicato collegato a tutti gli AUD e ai task GOV/SEC/PRIV/ECON/UX/GAME/PLAT/QA/WEB/BRAND/GROW/REL.
3. `docs/IMPLEMENTATION_BLUEPRINT.md`: architettura target, epic, ordine, dipendenze, opzioni, test e acceptance criteria.
4. `docs/OWNER_DECISIONS.md`: solo decisioni realmente bloccanti, con opzioni e raccomandazione.
5. Aggiornamento del MASTER CONTROL CENTER come unica fonte di stato e ripartenza.
6. Registro audit aggiornato senza cancellare storia o ID.
7. Implementazioni e test in branch dedicati, con checkpoint e diff revisionati.
8. Report finale comprensibile in italiano semplice: cosa è stato risolto, cosa è provato, cosa resta, cosa serve dal proprietario e cosa impedisce il rilascio.

## 10. Primo incarico operativo a Claude

Non iniziare con una lunga relazione generica. Entro la prima fase:
1. verifica HEAD, branch, CI, tree e stato del repository;
2. controlla quali correzioni candidate esistono già nel branch age-gate e quali sono state effettivamente validate;
3. produce la matrice AUD-001–AUD-090 con stato attuale e riferimenti a commit/test;
4. completa la WBS e le dipendenze;
5. individua i primi blocchi implementabili senza decisioni del proprietario;
6. presenta la critica alla presente proposta;
7. inizia il primo blocco pratico indipendente ad alta priorità, dopo aver salvato la baseline.

## 11. Principio finale

La proposta dell'assistente è di usare Claude non come semplice revisore che produce altri elenchi, ma come responsabile tecnico operativo che verifica il piano, lo migliora e porta a termine il maggior numero possibile di attività in modo dimostrabile.

La velocità si ottiene eliminando ripetizioni, accorpando cause comuni e lavorando in blocchi coerenti; **non** abbassando la qualità dei test, saltando le verifiche esterne o dichiarando risolto ciò che non è stato provato.

Il risultato atteso non è “molti commit” né “100% dichiarato”: è un prodotto coerente, affidabile, sicuro, comprensibile, sostenibile e realmente pronto per la milestone di rilascio autorizzata.


## 12. Baseline repository enumerata — 21/11/2026

Enumerazione GitHub del branch applicativo dopo il checkpoint documentale di questa proposta:
- `src/`: 217 elementi (sorgenti HTML/CSS/JS, localizzazioni e moduli applicativi).
- `tests/t110/`: 34 file tra suite Python/JS, helper e script di esecuzione.
- Plugin nativi Android: 15 file Java.
- `.github/workflows/`: 2 workflow (`android.yml`, `tests.yml`).
- `tools/`: 11 elementi di tooling e sottocartelle.
- Il conteggio è una fotografia del tree, non prova che tutti i file siano stati letti o verificati.
- La suite contiene aree esplicite per safety/crisi, minori, denaro, accessibilità, prodotto, performance, legal/native, sito, plugin e regole; Claude deve mappare ogni test al requisito che copre e identificare i gap senza duplicare test esistenti.
- File e dimensioni possono cambiare: rifare l'enumerazione sul commit esatto di lavoro.

Questa enumerazione rende più chiaro il perimetro, ma **non autorizza a dichiarare completato l'audit teorico**: restano da completare la lettura mirata dei moduli non coperti, la matrice feature→test→finding, la validazione delle fonti esterne e le decisioni del proprietario.
