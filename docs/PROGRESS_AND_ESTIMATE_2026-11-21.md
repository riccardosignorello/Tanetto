# Tanetto — stato, stima e checkpoint operativo
Data: 21 novembre 2026
Commit applicativo di riferimento: `d0616d8a00e76c6919834306e41e120ad301e823`
Commit audit di riferimento: `3f68bfe7bdf194aa5bc05bad87ec32c2e983c20c`

## Risposta sull'avanzamento complessivo

**Percentuale globale attuale: NON CALCOLABILE in modo attendibile.** Non è un modo per nascondere il lavoro fatto: il Control Center definisce correttamente che il denominatore non è ancora completo. Le 14 aree WBS esistono, ma non sono ancora state scomposte tutte in deliverable atomici, deduplicati, pesati e associati a criteri di accettazione. Dare ora un numero preciso sarebbe falsa precisione.

Stato misurabile oggi:
- WBS di primo livello: 14 aree definite.
- Registro audit: AUD-001–AUD-089, con AUD-033 assente per ragioni storiche; AUD-089 qualificato e non promosso a bug tecnico confermato.
- Registro operativo: task GOV/AUD/ENG/SEC/PRIV/ECON/UX/GAME/PLAT/QA/WEB/BRAND/GROW/REL ancora da normalizzare in un unico inventario deduplicato.
- Codice applicativo: l'audit ha coperto diverse aree importanti, ma non è concluso; nessun finding viene chiuso per sola lettura.
- Verifica runtime: incompleta; il run CI 66 è stagnante e non concluso.
- Release: non autorizzata e non pronta da dichiarare.

Non usare 70%, 40% o altre percentuali storiche: sono state ritirate nel Control Center.

## Verifica repository e CI del 21/11/2026

- Fork operativo: `riccardosignorello/Tanetto`; originale `tanettoapp/Tanetto` non modificato.
- Branch app `work/tanetto-1.0.12-agegate-fix`: HEAD `d0616d8a00e76c6919834306e41e120ad301e823`.
- Branch audit `audit/tanetto-full-review`: HEAD `3f68bfe7bdf194aa5bc05bad87ec32c2e983c20c`.
- CI run 66: [GitHub Actions](https://github.com/riccardosignorello/Tanetto/actions/runs/44836465630), commit testato `9c3c75910f6ebae8e78c4cac7c607674b6cf05a1), stato API ancora `in_progress`, job `test` fermo allo step `Prove 1.0.11`; step iniziato il 20/11/2026 alle 23:26:33Z. Non è né verde né prova di fallimento. Il run non verifica il più recente HEAD `d0616d8`.
- Step già conclusi con successo nel run 66: toolchain/SDK, sync Capacitor, compilazione Java Android, test AgePolicy, build/sync artefatti, 14 lingue, Firestore emulator. Robolectric è ancora pending.
- Serve una nuova run pulita sul commit finale, dopo diagnosi della run stagnante e correzione del workflow/logging.

## Nuovo blocco di audit: Billing e advertising

### Evidenze statiche su `src/97o_billing.js`
- Catalogo codificato: abbonamento `tanetto_plus`, base plan `mensile` e `annuale`, pacchetti consumabili `tani_200`, `tani_1100`, `tani_2400`, `tani_5000`.
- Prezzi e offerte sono richiesti a Google Play; l'app seleziona l'offerta base e cerca l'offerta di prova gratuita tra quelle restituite.
- Il ripristino interroga gli acquisti posseduti, riconosce gli abbonamenti in stato `purchased`, tenta acknowledge e passa i pacchetti a `creditPack()`.
- `creditPack()` accredita i Tanì se il purchase token non è in `S.paidTokens`, salva il token localmente e conserva al massimo 200 elementi; poi tenta `consume()`, ignorando l'errore per riprovare al successivo sync.
- Questo conferma il perimetro di rischio già presente in AUD-011, ma **non dimostra ancora una doppia erogazione**. Mancano test su restore di backup obsoleto, più di 200 acquisti, cambio account/dispositivo, consumo fallito, pending, refund/revoca, rete intermittente e concorrenza.
- `plusMonthly()` registra il regalo mensile in `S.plusMonth` e accredita 300 Tanì + 2 scudi localmente. Va incluso nella stessa analisi di integrità/restore: non assumere che il marker locale sia un ledger antifrode.
- `S.plusOn` viene aggiornato dalla sincronizzazione Play e influenza ads e vantaggi. Vanno provati scadenza, revoca, cambio account, reinstallazione e stato offline.
- Il modulo nativo BillingPlugin.java non è stato ancora identificato e letto in questo blocco: non attribuire alla parte Java comportamenti non verificati. Il controllo nativo resta aperto.
- Nessun acquisto reale o transazione Play Console è stata eseguita.

### Evidenze statiche su `src/97zn_v19_ads.js`
- Il modello osservato è opt-in rewarded, non interstitial automatico: massimo 5 video al giorno, dopo almeno un obiettivo completato; Plus non vede annunci.
- Il codice dichiara trattamento teen/TFUA e annunci non personalizzati per età non dichiarata; la correttezza normativa e la coerenza fra commenti, age gate, plugin nativo e policy dei mercati resta da verificare.
- `adsOn()` richiede `AGE_READY` e `AGE_VALUE !== undefined`; questo è un punto di coerenza da confrontare con il comportamento deciso per unknown/skip, non una conclusione di non conformità.
- L'aggiornamento UMP, privacy options, revoca, callback reward, contatore giornaliero, cambio età e passaggio Plus↔ads richiedono test di flusso.
- Il file contiene un timer ricorrente a 5 secondi che coordina sync acquisti e caricamento annunci. Non è classificato come bug; va misurato per evitare polling superfluo, consumo e gare fra sync.
- Nessun dato live AdMob, ricavo, fill rate, impression, eCPM o consenso reale è stato fornito/letto.

## Dipendenze informative reali (non impediscono l'audit statico)

Sono disponibili il fork, i branch, il codice e la documentazione Git. Non sono invece presenti in questo contesto:
- dati Play Console su prodotti, offerte, prezzi per paese, ordini, refund, stato release e dichiarazioni;
- dashboard AdMob e dati reali di impression/ricavi/consenso;
- spesa campagne e dati attribuiti di installazione, retention e ricavi per coorte;
- accesso a un parco di dispositivi Android reali per test fisici;
- conferma legale per ogni paese in cui l'app è distribuita;
- decisione del proprietario su PRIV-002 (diario/umore nel backup cloud).

Queste dipendenze saranno raccolte in un elenco di verifiche esterne e non devono bloccare la prosecuzione dell'analisi del repository. Le attività che le richiedono resteranno esplicitamente non verificate o in attesa.

## Stima temporale — provvisoria, non promessa

La stima è espressa in **ore di lavoro tecnico concentrato equivalenti**, non in tempo di calendario e non in ore garantite del modello. Va aggiornata quando l'inventario atomico è completo.

| Fase residua | Stima |
|---|---:|
| Chiudere inventario, deduplicazione, dipendenze e criteri WBS | 20–35 h |
| Completare audit 360° delle aree non ancora coperte (funzioni, UX, accessibilità, piattaforme, sito, brand, growth, sicurezza/privacy) | 35–65 h |
| Piano di correzione coordinato e implementazione prioritaria, inclusi hardening, billing/economia, backup, sicurezza e UX | 55–100 h |
| QA riproducibile, CI, regressione, emulatori e preparazione matrice device | 30–55 h |
| Revisione indipendente, documentazione, release readiness e rollback | 20–35 h |
| **Totale provvisorio** | **160–290 h** |

Questa forchetta assume che non emerga una riscrittura architetturale estesa e che le dipendenze esterne siano disponibili quando servono. Non include tempi di attesa di Google Play, revisione legale professionale, accesso/risposta di terzi, né attività continuative di marketing e community.

Traduzione prudente: **circa 4–8 settimane di lavoro equivalente full-time** per una milestone di qualità/release-readiness, non una promessa di calendario. Se i test reali rivelano difetti strutturali o serve una revisione ampia di prodotto/brand, la stima aumenta. La crescita post-lancio è un ciclo continuo e non ha un 100% definitivo.

## Regole di reporting da questo checkpoint

1. Non assegnare percentuali globali finché inventario, pesi e stati non sono congelati.
2. Quando il denominatore sarà completo, calcolare separatamente: audit, correzioni, QA, release-readiness ed ecosistema.
3. Fornire il conteggio task per stato, somma pesi e formula, non un numero isolato.
4. Tenere separati i blocchi esterni da quelli che possiamo continuare autonomamente.
5. Nessuna patch applicativa o release è stata fatta in questo blocco.

## Prossima sequenza operativa
1. Identificare e analizzare il vero percorso del plugin nativo Billing e completare il ciclo di acquisto/restore.
2. Mappare `S.paidTokens`, `S.plusMonth`, `S.plusOn`, `S.seeds`, `S.shields`, `spentN` e ledger economico su save/backup/import/restore.
3. Verificare flusso età/consenso/rewarded tra JS e Java.
4. Chiudere account, backup, cancellazione, import/export e referral.
5. Completare inventario delle feature e deduplicare tutti gli AUD nel WBS operativo.
