# Tanetto 1.0.11: cosa cambia nella "Sicurezza dei dati" di Play Console

Riguarda solo **Invita un amico** (solo adulti, 18+). Il widget e la richiesta di recensione **non raccolgono dati**:
il widget mostra quello che è già sul telefono, la recensione è la finestra di Google Play (l'app non riceve niente).

Tutto il resto della scheda resta come per la 1.0.10.

## Da aggiungere (Play Console > Contenuti dell'app > Sicurezza dei dati > Modifica)

1) **Dispositivo o altri ID** (Device or other IDs)
   - Raccolto: **Sì**. Condiviso: **No**.
   - Trattato solo temporaneamente: **No**.
   - Obbligatorio o facoltativo: **Facoltativo** (solo se si usa un invito).
   - Scopi: **Funzionalità dell'app** e **Prevenzione delle frodi, sicurezza e conformità**.
   - Cos'è: un'impronta cifrata (SHA-256) dell'ID Android dell'app, non l'ID stesso. Serve a non dare lo stesso regalo
     due volte allo stesso telefono e a impedire che un telefono inviti sé stesso.

2) **Attività nelle app > Interazioni con l'app** (App activity > App interactions)
   - Raccolto: **Sì**. Condiviso: **No**.
   - Trattato solo temporaneamente: **No**.
   - Facoltativo: **Sì** (solo con un invito).
   - Scopi: **Funzionalità dell'app** e **Prevenzione delle frodi, sicurezza e conformità**.
   - Cos'è: il codice casuale dell'invito, la data di arrivo dell'amico e il fatto che ha usato l'app in 3 giorni
     diversi (per dare il premio a chi ha invitato).

## Domande generali (restano uguali)

- I dati sono criptati in transito: **Sì** (Firebase usa HTTPS).
- Si può chiedere la cancellazione: **Sì** (e-mail dell'informativa; in più questi dati si cancellano da soli dopo 12 mesi).
- Nessun dato viene venduto o usato per la pubblicità.

## Cosa NON viene raccolto

- Nessun nome, e-mail, numero di telefono, contatto o rubrica.
- Il "referrer" di Google Play si legge sul telefono una volta sola; al server va solo il codice dell'invito.
- Bambini, ragazzi sotto i 18 anni e chi non ha detto l'età: **nessun dato**, l'invito con i premi non esiste per loro
  (l'app non chiede nemmeno l'impronta del telefono).
