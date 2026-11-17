# Tanetto 1.0.11 (versionCode 114): cosa cambia e perché

Preparata il 17/11/2026 sul ramo `rel-111`. **Non è stata inviata a Google.**
È la versione che **sostituisce la 1.0.10 in revisione** (niente build 113: tutto è dentro la 1.0.11).

**Prezzi mai toccati.** Una sola moneta (Tanì). Massimo 5 video al giorno, solo da 13 anni in su.


## 1) Novità che si vedono

1) **Widget della schermata Home** (solo Android), in due misure: **piccolo (2x2)** e **largo (4x2)**.
Si vede il compagno in 3D con la posa del giorno, il nome e quanti obiettivi sono fatti oggi ("2/5").
Tema chiaro e scuro, 14 lingue, si aggiorna anche a mezzanotte. La scheda **"Metti Germo sulla tua Home"**
si propone una volta sola dopo 3 giorni d'uso e poi resta nel Profilo.

2) **La tua icona accanto al nome** ("Buongiorno, NOME" in Casa): 12 icone per tutti e 12 con Tanetto Plus.
Si tocca l'icona (o il saluto) e si sceglie. Il **simbolo della stagione** accanto al saluto e ai titoli **non c'è più**.

3) **Eventi nella stanza:** per Lanterne, Natale, Nuovo inizio, Stelle e Aquiloni la stanza si trasforma
(cielo alla finestra, decorazioni appese, luce, neve a Natale, alberello nel vaso). Ogni evento ha **la sua musica**
(solo con la musica accesa).

4) **La cartolina della settimana:** l'ultimo giorno della settimana dalle 18 compare in Oggi una scheda discreta;
la cartolina mostra solo i 7 giorni e la stagione (niente obiettivi, umore o diario). Formati 9:16 e quadrato.

5) **Invita un amico** (solo adulti): 50 Tanì all'amico, 100 a chi invita quando l'amico usa l'app in 3 giorni diversi
(massimo 3 amici). **Finché non pubblichi le regole di Firestore** resta la condivisione semplice di prima (nessun premio
promesso): i passi sono in `CHANGES_111_NATIVE.md`, sezione "Cosa serve da te".

6) **Richiesta di recensione** (finestra ufficiale di Google Play) solo nei momenti felici, solo adulti, al massimo una volta
ogni 60 giorni.

7) **Nuova icona dell'app** (Germo centrato, sfondo caldo, icona a tema con la sua sagoma).

8) **Spagnolo:** 4 mete nuove dell'America Latina (Chichén Itzá, Valle de Cocora, Lago Titicaca, Purmamarca).

9) **Voce più gentile** nelle 14 lingue (niente "ti aspetta", niente sensi di colpa); contrasto migliore su alcuni pulsanti.


## 2) Bambini e pubblico (decisione del 17/11/2026)

1) Su Play Console il pubblico è **13-15, 16-17, 18+**. Chi indica **meno di 13 anni, "Preferisco non dirlo" o non ha ancora
risposto** usa l'app in **modalità protetta**: niente video con premio, niente pubblicità, niente statistiche, niente account
online, niente prova gratuita di Plus, **nessuna condivisione fuori dall'app** (le immagini si possono solo salvare),
niente richiesta di recensione, niente "Invita un amico".

2) Informativa privacy aggiornata nelle 14 lingue (data **18/11/2026**).


## 3) Correzioni fatte nell'unione (oggi)

1) **Lettere polacche e turche nell'app Android:** il carattere di riserva per "ą ę ś ż ğ ş İ" c'era sul sito ma **non veniva
copiato nell'app** (per questo nelle schermate dello Store "Cześć", "Şekerleme", "İstanbul" uscivano con un carattere diverso).
Ora c'è, e la preparazione dell'app si ferma da sola se manca un carattere.

2) **Negozio dei Tanì, Plus e fogli dal basso 28 px più in basso:** con le animazioni accese l'animazione della 1.0.10 e quella
del foglio si sommavano e il foglio restava **28 px più in basso per sempre** (nel negozio la striscia "Chiudi" stava a metà
schermo con la pagina visibile sopra; nei fogli dal basso si perdevano 28 px sotto il bordo). Ora il foglio arriva al posto giusto.

3) **Zaino:** sotto le caselle "Gita breve" e **"Viaggio"** (prima "Viaggio completo", che andava su due righe).
Anche in spagnolo, francese, portoghese, russo, polacco e turco la scritta corta ora sta su una riga a 360 e 412 px
(Viaje, Voyage, Viagem, Поездка, Podróż, Yolculuk). Negli altri punti resta la forma lunga.

4) **Senza internet (sito):** la copia salvata dell'app si aggiorna solo dalla pagina principale (prima anche da altre pagine
del sito che finivano con "/").

5) **Immagini:** le 24 icone nuove ricompresse senza differenze visibili (da 124 a 83 KB). Totale immagini 3,84 MB
(soglia della prova portata da 3,8 a 3,9 MB, motivata: icone e cartoline nuove).


## 4) Da fare su Play Console (con il caricamento)

1) **Sicurezza dei dati:** aggiungere (o completare, se ci sono già per la pubblicità) "Dispositivo o altri ID" e
"Interazioni con l'app" per Invita un amico (raccolti, non condivisi, facoltativi; scopi: funzionalità e prevenzione delle frodi). Dettagli in `docs/DATA_SAFETY_111.md`.
Le statistiche anonime nuove (passi del primo avvio, cartolina della settimana) sono interazioni già dichiarate:
dettagli in `docs/PLAY_DATA_SAFETY_111.md`.

2) **Pubblico:** 13-15, 16-17, 18+ (come deciso).

3) **Facoltativo:** pubblicare le regole di Firestore per accendere i premi di Invita un amico (`CHANGES_111_NATIVE.md`).


## 5) Prove

(vedi il resoconto dell'unione: numeri di ogni suite)
