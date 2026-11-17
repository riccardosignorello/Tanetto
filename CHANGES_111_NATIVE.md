# Tanetto 1.0.11, parte Android: widget, recensione, Invita un amico

Preparata il 17/11/2026 sul ramo `feat-111-native` (da unire a `wip-111`). **Non è stata inviata a Google.**
versionCode 114 e versionName 1.0.11 su questo ramo (il numero finale si decide all'unione).


## 1) Il widget di Tanetto sulla schermata Home

1) **Due misure** nell'elenco dei widget: **piccolo (2x2)** e **largo (4x2)**. Tutte e due si possono allargare o
stringere, e cambiano forma da sole.

2) Si vede il **compagno scelto in 3D** (le pose dell'app), con la posa del giorno:
saluta (da fare), cuoricini (in corso), festa (tutto fatto), legge (giorno libero), valigia (in gita).
Sotto: il **nome**, la pillola **"2/5"** con gli obiettivi fatti oggi e, nel largo, la barra e una frase calma
(niente pressione, niente compagno "disperato" come quello di Duolingo).

3) **Stile Tanetto, non Material:** scheda crema con il bordo in basso come gli obiettivi dell'app, cerchio del colore del
compagno, stelline. **Tema chiaro e scuro** automatici. **14 lingue** (la lingua scelta in Tanetto). Nessun dato personale.

4) Si aggiorna quando cambia qualcosa nell'app, **a mezzanotte** (il giorno nuovo è già pronto) e **quando finisce una gita**
anche ad app chiusa. Se l'app non si apre da giorni non mostra numeri vecchi: il compagno saluta e "Apri Tanetto".
Tocco sul widget = si apre Tanetto.

5) **"Metti Germo sulla tua Home"**: scheda con l'anteprima del widget, scelta della misura e il pulsante
**"Aggiungi alla Home"** (finestra ufficiale di Android 8 e successivi). Dove Android non lo permette, un'**animazione** che
mostra come si fa (dito che tiene premuto, menu "Widget", il widget che arriva) e i 3 passi scritti.
Si propone **una volta sola**, mai all'avvio: dopo **3 giorni d'uso**, dopo un obiettivo fatto, in coda alle altre finestre.
Poi resta sempre nel **Profilo** (riga con il widget in miniatura, sotto "Invita un amico").


## 2) Richiesta di recensione (finestra ufficiale di Google Play)

1) Solo nei **momenti felici**: ritorno da un viaggio, **7 e 30 giorni di fila**, livello **5, 10, 15...**

2) **Mai prima del 3° giorno d'uso**, **al massimo una volta ogni 60 giorni**, mai subito dopo la scheda del widget,
mai dopo una frase difficile.

3) Come chiede Google: **nessuna domanda prima** ("ti piace l'app?"), **nessun pulsante** che la apre, nessuna modifica
alla finestra. Google decide da solo se mostrarla.

4) **Età:** le regole Famiglie di Google non ne parlano. Resta la tua regola della 1.0.10 ("sotto i 18 anni nessuna
pressione"): **solo adulti**. Se un giorno vorrai aprirla anche ai ragazzi (13-17) è una modifica piccola.


## 3) Invita un amico (solo adulti, 18+)

1) Nel Profilo e dopo "tutto fatto": scheda con i due regali, **"Invia l'invito"** apre la condivisione di Android
(WhatsApp, SMS...) con un testo pronto e il **link di Google Play** con il codice dentro (formato verificato sulla
documentazione ufficiale di Google: referrer codificato, massimo 512 caratteri).

2) **All'amico 50 Tanì** (come il regalo di benvenuto). **A chi invita 100 Tanì** quando l'amico ha usato l'app in
**3 giorni diversi**. Premi per **al massimo 3 amici** (300 Tanì in tutto). Economia lenta rispettata: questi Tanì contano
come "pagati", quindi **non accorciano gli Introvabili** (come i Tanì di Plus).

3) Il codice si legge **una volta sola** al primo avvio (Play Install Referrer API, come consiglia Google).

4) **Contro gli abusi** (controllati dal server, non dall'app): stesso telefono che invita sé stesso = niente;
lo stesso telefono può ricevere il regalo **una volta sola** (anche reinstallando); i 3 giorni valgono solo se sono passate
almeno **36 ore** sul server; un amico conta una volta sola; codice inventato = niente; tempi del link sospetti = niente.

5) **Bambini, ragazzi e chi non ha detto l'età:** niente premi, niente server, niente impronta del telefono.
"Invita un amico" per loro resta la condivisione semplice di prima.

6) **Informativa privacy aggiornata nelle 14 lingue** (paragrafo nuovo, data 17/11/2026) e
**Sicurezza dei dati** pronta in `docs/DATA_SAFETY_111.md`.


## Cosa serve da te (circa 15 minuti, nessun account nuovo, nessuna carta)

Passi esatti anche in `/mnt/user-data/outputs/v111_preview/native/INVITO_SERVER.md`. **Interruttore automatico:** finché le regole
non sono pubblicate, "Invita un amico" resta la condivisione semplice di prima (nessun premio promesso) e chi arriva con
un link aspetta senza perdere il regalo; appena sono pubblicate l'app se ne accorge da sola, senza aggiornamento.

1) **Pubblicare le regole di Firestore**:
console.firebase.google.com > progetto **tanettoapp-pet** > Firestore Database > **Regole** > incolla **tutto** il file
`tools/firebase/firestore.rules` > **Pubblica**. La parte del backup (`backups`, `reviewers`) è quella usata per le prove
della 1.0.10: prima di pubblicare dai un'occhiata che sia uguale a quella che vedi oggi nella console (se è diversa, dimmelo).

2) **Cancellazione automatica dopo 12 mesi** (promessa nell'informativa): console.cloud.google.com > progetto
tanettoapp-pet > Firestore > **Time-to-live** > **Crea criterio** 4 volte, campo **`exp`**, gruppi di raccolte:
**`invites`**, **`p`**, **`c`**, **`devs`**.

3) **Play Console > Sicurezza dei dati:** aggiungere le due voci scritte in `docs/DATA_SAFETY_111.md`.

4) Facoltativo, consigliato quando vorrai: **accendere App Check** (già preparato nella 1.0.10). Senza App Check un
esperto potrebbe falsificare inviti con un programma; il danno massimo resta piccolo (300 Tanì per codice).


## Prove fatte

1) Prove nel browser (telefono finto): `tests/t110/t_n111_native.py` (widget in 14 lingue, scheda, misure 360/412/tablet,
tema scuro, recensione, invito e età). Screenshot in `/mnt/user-data/outputs/v111_preview/native/`.

2) Widget disegnato davvero con la grafica di Android (Robolectric): `WidgetRenderTest` e `WidgetSnapTest`
(14 lingue, 2 misure, 3 griglie, chiaro e scuro, niente testo tagliato).

3) Regole di Firestore con l'emulatore: `bash tests/t110/run_n111_rules.sh` (25 casi, abusi compresi).

4) Build APK e AAB firmato che compilano.

**Nota per l'unione:** `index.html`, `sw.js`, `privacy.html` e `fb.js` sono file costruiti: in caso di conflitto basta
rilanciare `python3 tools/build.py --android`. Il sorgente di `fb.js` è ora anche in `tools/firebase/fb_entry.js`.
