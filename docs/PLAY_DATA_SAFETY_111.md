# Tanetto 1.0.11 – cosa dichiarare in Play Console (Sicurezza dei dati)

Data: 17/11/2026. Riguarda solo le statistiche anonime (GoatCounter). Nient'altro cambia rispetto alla 1.0.10.

## 1) Cosa c'è di nuovo

Nella 1.0.11 si contano in forma anonima alcuni passi del percorso, per capire dove le persone lasciano
l'app nei primi giorni. Ogni passo si conta al massimo una volta per installazione, e solo per chi
installa dalla 1.0.11 in poi:

1) percorso-accoglienza-1-compagno (compagno scelto)
2) percorso-accoglienza-2-nome (nome scelto)
3) percorso-accoglienza-3-obiettivi (obiettivi scelti, il compagno arriva)
4) percorso-accoglienza-4-guida (guida iniziale finita)
5) percorso-primo-obiettivo (primo obiettivo spuntato)
6) percorso-giorno-2 e percorso-giorno-7 (l'app aperta il 2° e il 7° giorno)
7) percorso-primo-viaggio (primo viaggio del compagno)
8) percorso-plus-aperto (prima apertura della pagina di Tanetto Plus)
9) percorso-cartolina-condivisa (prima cartolina condivisa: settimana o viaggio)
10) percorso-widget-aggiunto (il telefono dice che c'è un widget di Tanetto sulla schermata Home)

Si aggiungono anche i conteggi giornalieri: settimana-anteprima, settimana-condivisa.

Ogni conteggio è solo un nome fisso (come "percorso-giorno-2"): nessun identificativo del telefono o della
persona, nessun testo scritto dall'utente, nessun nome del compagno, nessuna età, nessun dato di salute.
GoatCounter non usa cookie e non crea profili.

## 2) Regole che restano uguali

1) Spente sempre per chi è sotto l'età del consenso digitale del suo Paese e per chi non ha detto l'età
(regole Famiglie: per i minori non parte niente).
2) Prima della domanda sull'età non si invia niente.
3) Si possono spegnere in Profilo › Privacy ed età (interruttore delle statistiche anonime).

## 3) Cosa fare in Play Console

1) Sicurezza dei dati › Attività nelle app › **Interazioni con l'app**: resta "raccolti", scopo
**Analisi**, **non condivisi**, trattati in modo **anonimo/aggregato**, **facoltativi** (l'utente può
disattivarli). Non serve aggiungere nuovi tipi di dati: questi eventi sono interazioni con l'app, già
dichiarate nella 1.0.10.
2) Se nel modulo è scritto l'elenco degli eventi contati (DA FARE della 1.0.10, punto 2), aggiungere in coda:
"passi del primo avvio, primo obiettivo, ritorno il 2° e il 7° giorno, primo viaggio, prima apertura di
Plus, prima cartolina condivisa, widget aggiunto, cartolina della settimana vista/condivisa".
3) Domande "Famiglie": nessuna risposta cambia (per i minori le statistiche restano spente).

## 4) Informativa privacy

Non serve cambiarla: in tutte le 14 lingue dice già che si contano "in forma aggregata alcune azioni,
per esempio quante volte l'app viene aperta o se viene usata nei giorni successivi", con GoatCounter,
senza cookie e senza profili, con l'interruttore e spente per i minori. I nuovi eventi sono azioni
dello stesso tipo.
