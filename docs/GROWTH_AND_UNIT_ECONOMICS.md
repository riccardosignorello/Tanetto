# Tanetto — crescita, acquisizione e unit economics

Stato: strategia di lavoro proposta, da validare con dati reali  
Data: 21 novembre 2026  
Ambito: GROW / ECON / PRIV / BRAND  
Principio: crescita sostenibile e coerente con il prodotto, non massimizzazione dei download.

## 1. Decisione strategica

Il modello hypercasual descritto nei commenti contiene un'intuizione utile: acquisizione, monetizzazione e reinvestimento possono formare un ciclo di crescita. Non è però il modello da copiare per Tanetto.

Tanetto non va trasformato in un gioco ad alto ricambio, costruito per comprare installazioni a basso CPI e monetizzare rapidamente con interstitial ripetuti. La sua ipotesi di valore è diversa: un universo narrativo riconoscibile, un compagno, obiettivi gentili, viaggi, collezioni e progressi che acquistano significato nel tempo. La crescita deve amplificare questo valore, non sostituirlo.

**Da prendere dal modello:**
- misurare il costo marginale per acquisire utenti;
- calcolare il valore economico netto generato dalle coorti;
- reinvestire soltanto quando i dati dimostrano che l'acquisizione è sostenibile;
- testare creatività e canali in modo disciplinato;
- distinguere installazioni da utenti attivati, trattenuti e paganti.

**Da non copiare:**
- ottimizzare per download o CPI isolati;
- usare interstitial invasivi o aumentare la pressione pubblicitaria;
- accettare churn elevato come costo normale del modello;
- usare dati di diario, umore, obiettivi personali, età o altri dati sensibili per targeting o ottimizzazione pubblicitaria;
- spingere campagne prima di poter misurare retention e ricavi per coorte.

## 2. Compatibilità con il prodotto esistente — evidenza preliminare

Lettura statica eseguita sul branch `work/tanetto-1.0.12`; non equivale a test runtime o revisione legale.

- `src/98i_v20_growth.js` implementa cartoline condivisibili, anteprima prima della condivisione, salvataggio locale, link `?src=postcard` e un percorso Android verso Google Play con referrer `utm_source=postcard`. Sono presenti eventi come `cartolina-anteprima`, `cartolina-android-play-mostrato` e `cartolina-verso-play`.
- `src/97zn_v19_ads.js` e `AdsPlugin.java` implementano video rewarded su scelta esplicita, non annunci interstitial automatici. Il flusso è subordinato a consenso/età, con limiti giornalieri; l'informativa attuale dichiara massimo cinque video al giorno e nessun annuncio per Plus.
- `GrowthPlugin.java` legge il Play Install Referrer e fornisce un identificatore derivato da Android ID per i controlli antiabuso degli inviti. Questo non dimostra l'esistenza di attribuzione completa per campagne paid.
- `src/3zzg_v21_privacy.js` descrive statistiche aggregate via GoatCounter, senza cookie né profili, e dichiara che i dati di diario/obiettivi restano sul dispositivo quando non si usa un account.

**Limite di ciò che è stato verificato:** non è stata dimostrata una pipeline end-to-end che colleghi spesa di una campagna, installazione attribuita, attivazione, retention per coorte, acquisti e ricavi pubblicitari netti. Non si presume che tali dati siano disponibili solo perché esistono eventi di tracking o il Play Install Referrer per gli inviti.

## 3. Modello economico corretto

Non usare il CPI come obiettivo autonomo.

- **CPI** = spesa di acquisizione / nuove installazioni attribuibili e valide della stessa campagna e finestra.
- **CAC attivato** = spesa di acquisizione / nuovi utenti attribuibili che raggiungono la definizione di attivazione concordata.
- **Retention D1/D7/D30** = quota della coorte che torna rispettivamente dopo 1, 7 e 30 giorni, con definizione coerente e documentata.
- **LTV netto di contribuzione** = ricavi netti attribuibili alla coorte (Plus, acquisti e quota pubblicitaria effettivamente incassata) meno commissioni, rimborsi, imposte applicabili e costi variabili pertinenti.
- **Payback** = tempo necessario perché il margine netto cumulato della coorte recuperi il CAC.
- **ROAS di coorte** = ricavi attribuibili maturati dalla coorte / spesa pubblicitaria della coorte. Va sempre indicata la finestra temporale e se i ricavi sono lordi o netti.

Il confronto decisivo è tra CAC e LTV netto, non tra CPI e ricavo pubblicitario lordo. Non assumere che ogni installazione sia incrementale: separare traffico organico, paid e referral e dichiarare i limiti di attribuzione.

## 4. Sequenza di crescita

### Fase A — misurabilità e qualità del prodotto
1. Definire activation event che rappresenti il primo valore reale, non la semplice apertura.
2. Definire la metrica guida candidata: utenti settimanali con attività significativa in almeno 3 giorni distinti. È un'ipotesi da validare, non una metrica già approvata.
3. Misurare retention D1/D7/D30, completamento onboarding, uso delle funzioni principali, ritorni ai viaggi/obiettivi, conversione Plus e ricavi per coorte.
4. Verificare che ogni evento sia necessario, minimizzato, documentato e conforme alle regole su minori e mercati.
5. Prima di usare i dati per campagne, completare data map, basi giuridiche, consenso ove necessario, retention e configurazione dei fornitori.

### Fase B — crescita organica
- ASO e schede store per mercato/lingua;
- contenuti social autentici e coerenti con il brand, senza estetica artificiale;
- community e creator con affinità reale;
- cartoline e referral volontari, misurando il funnel senza trasformare la condivisione in pressione;
- landing page e sito con messaggio e percorso di installazione chiari.

### Fase C — test paid molto piccoli
Il budget iniziale discusso è **0–100 €**. Non va speso automaticamente: prima devono esistere misurazione, evento di attivazione, controllo dei consensi e baseline organica.

Quando i prerequisiti sono soddisfatti:
- testare un solo mercato/canale/creatività per volta, con tetto di spesa definito prima;
- usare creatività già validate organicamente quando possibile;
- misurare costo per installazione, costo per attivato, qualità e retention della coorte;
- interrompere se arrivano installazioni economiche ma utenti non attivati o non trattenuti;
- non aumentare il budget sulla base di risultati D1 soltanto: attendere finestre D7/D30 e ricavi sufficientemente maturi.

### Fase D — reinvestimento
Scalare solo dopo più coorti ripetibili e non anomale. Prima di fissare soglie numeriche di LTV:CAC o payback, raccogliere dati reali e approvare una policy economica. Come controllo di prudenza, il target 3:1 LTV netto/CAC può essere valutato come benchmark gestionale, non come legge universale né come soglia già raggiunta. Nessuna crescita del budget deve compromettere cassa, qualità del prodotto o supporto.

## 5. Privacy, minori e integrità del brand

- Nessun targeting o profilazione basato su diario, umore, obiettivi, nome, dati di benessere, età o inferenze sensibili.
- Non creare pubblici pubblicitari di bambini o utenti di età sconosciuta; rispettare le policy delle piattaforme e i gate di Tanetto.
- Distinguere analisi aggregate di prodotto da attribuzione pubblicitaria e da dati raccolti autonomamente dai network pubblicitari.
- Non aggiungere SDK o strumenti di tracking prima di una valutazione privacy, tecnica, costi e necessità.
- Conservare la scelta di Tanetto: annunci solo facoltativi e rewarded, mai interstitial automatici come scorciatoia di monetizzazione; Plus senza annunci, secondo la policy attuale.
- Le cartoline devono condividere solo contenuti intenzionalmente selezionati dall'utente e non dati personali/sensibili non necessari.

## 6. Gate prima di investire in paid acquisition

Nessun test paid parte finché non sono verificati tutti questi punti:
1. activation event e funnel definiti;
2. eventi e attribuzione testati end-to-end su Android e web, con limiti documentati;
3. retention D1/D7/D30 e baseline organica disponibili;
4. ricavi netti Plus/pack e ricavi pubblicitari riconciliabili almeno a livello di coorte/campagna con le limitazioni tecniche esplicitate;
5. privacy/data map, consenso, minori e disclosure approvati;
6. creatività, store listing e landing page coerenti e testati;
7. tetto di spesa, ipotesi, metrica di successo e stop-loss scritti prima del test.

## 7. Task da portare nel registro GROW

| ID | Attività | Stato | Criterio di completamento |
|---|---|---|---|
| GROW-002 | Inventariare gli eventi attuali, GoatCounter e punti di tracking per ogni piattaforma | IN_PROGRESS | Mappa evento→codice→destinazione→dati→base/consenso→retention |
| GROW-003 | Verificare attribuzione installazioni e separazione paid/organic/referral | NOT_STARTED | Test end-to-end documentato; limiti e fonti di verità espliciti |
| GROW-004 | Definire activation, retention e North Star con dati disponibili | NOT_STARTED | Metriche formalizzate, query/test riproducibili, nessun dato sensibile |
| GROW-005 | Costruire modello LTV/CAC/payback e riconciliazione ricavi | NOT_STARTED | Formule, fonti, finestre coorte, commissioni/rimborsi e incertezza documentati |
| GROW-006 | Audit ASO, store listing, sito, social, creator e referral | NOT_STARTED | Piano per mercato/canale con priorità e criteri di misurazione |
| GROW-007 | Definire protocollo esperimenti paid con budget massimo iniziale 0–100 € | NOT_STARTED | Gate superati, test preregistrato, tetto/stop-loss e report coorte |
| GROW-008 | Verificare privacy e policy pubblicitarie per minori e mercati | NOT_STARTED | Revisione integrata PRIV/legale e disclosure coerenti |

## 8. Decisioni non prese

- Non è deciso di aumentare la frequenza o il numero di annunci.
- Non è deciso di investire subito il budget 0–100 €.
- Non è approvata una soglia universale di CPI, LTV:CAC o payback.
- La North Star dei 3 giorni significativi è ancora una candidata.
- Non è stata scelta una nuova piattaforma analytics/attribution. Ogni eventuale strumento dovrà dimostrare necessità e compatibilità privacy prima dell'adozione.

## 9. Prossimo lavoro tecnico

1. Mappare tutte le chiamate `track`, `trackOnce`, eventi GoatCounter e referrer nel repository.
2. Confrontare tracking dichiarato nell'informativa con comportamento effettivo e codice per tutte le piattaforme.
3. Verificare gli eventi di cartolina e il funnel `?src=postcard` fino all'installazione, senza presumere attribuzione già funzionante.
4. Esaminare dati Play Console/AdMob/ricavi solo se l'accesso e le esportazioni sono disponibili; in loro assenza segnare esplicitamente il limite.
5. Aggiornare il Control Center e completare l'audit prima di proporre nuove SDK o modifiche al codice.
