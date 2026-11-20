# Tanetto — checkpoint sessione 21/11/2026

Repository: `riccardosignorello/Tanetto`
Branch applicativo: `work/tanetto-1.0.12-agegate-fix`
Branch audit: `audit/tanetto-full-review`
Originale `tanettoapp/Tanetto`: da lasciare intatto.

## Stato Git verificato in questa sessione

- Fork personale accessibile con permessi admin/push.
- Branch applicativo HEAD al momento del controllo: `efe9e0964f815d3824fb2ccece20da32b88aa73d`.
- Il commit applicativo sottoposto a CI è `9c3c75910f6ebae8e78c4cac7c607674b6cf05a1`.
- Dopo quel commit: commit automatico di build artefatti `df9f54e978cad95b47f709a377ec0baacd35aee7`, poi checkpoint `efe9e0964f815d3824fb2ccece20da32b88aa73d`.
- Il checkpoint tecnico completo resta in `docs/CONTINUITY_1_0_12.md`.
- Il registro dell'audit resta in `AUDIT/MASTER-REGISTER.md`, branch `audit/tanetto-full-review`; istruzioni di ripresa in `AUDIT/CONTINUATION.md`.
- Non è stato eseguito merge verso main/originale né rilascio.

## CI: run 66

- Run GitHub Actions: https://github.com/riccardosignorello/Tanetto/actions/runs/44836465630
- Run number 66, commit `9c3c7591`, workflow `Prove dell'app`.
- Ultimo controllo: `in_progress`.
- Passati: setup/toolchain, sincronizzazione Capacitor, compilazione Java Android, test unitari AgePolicy, strumenti/build, controlli 14 lingue e regole Firestore emulator.
- In corso: step seriale `Prove 1.0.11`.
- In coda: test widget Android Robolectric.
- Non dichiarare CI verde o release pronta fino a conclusione di tutti gli step.
- Il tentativo di recuperare i log del job via endpoint GitHub ha restituito 404; al momento non c'è un log integrale disponibile tramite il connettore.

## Verifiche svolte in questa sessione

- Riletto il checkpoint applicativo `docs/CONTINUITY_1_0_12.md`.
- Riletto `AUDIT/CONTINUATION.md` e le sezioni iniziali/centrali del registro master, fino ai finding AUD-045 e alle sessioni correlate.
- Ricontrollato `.github/workflows/tests.yml`: il job ha timeout complessivo 90 minuti; esegue in sequenza i test `tests/t110/t_*.py`, con timeout individuale 1500 secondi, poi le prove native e Robolectric.
- I log dei test sono scritti in `/tmp/tanetto-test.log`; in caso di errore viene stampato il tail, ma non viene caricato un artifact persistente per ciascun test. Il gap di osservabilità AUD-024 resta da risolvere nel piano.
- Nessuna modifica applicativa effettuata in questa sessione.

## Prossime attività obbligatorie

1. Ricontrollare run 66 e ottenere il risultato di `Prove 1.0.11` e Robolectric. Se fallisce, recuperare il log completo in modo riproducibile e classificare ogni errore come bug reale, test obsoleto, ambiente o falso positivo.
2. Se necessario, riprodurre localmente/CI i test falliti; non modificare le aspettative per ottenere un verde artificiale.
3. Aggiornare il registro master con gli esiti e le prove, mantenendo separate le evidenze del branch applicativo e del branch age-gate.
4. Ottenere CI completamente verde sul commit finale prima del bump versione.
5. Solo dopo QA: portare Android a versionName 1.0.12 / versionCode 115 e controllare ogni altra stringa/versione.
6. Integrare i 15 commit di `main` (sito, SEO, 14 lingue, press kit, social/Discord) senza sovrascriverli: creare una fase/branch d'integrazione con app in `/app/`, preservando sito, pagine legali, service worker e preparazione Android.
7. Proseguire l'audit 360° delle aree ancora non coperte e chiudere l'inventario unico prima di ulteriori correzioni non strettamente necessarie alla milestone.
8. Dopo la base tecnica: audit prodotto/UX/brand/personaggi, marketing, SEO, acquisizione, retention e monetizzazione. Non ridisegnare ora i personaggi; è una fase successiva deliberata.

## Avanzamento da comunicare con cautela

Il checkpoint applicativo precedente stimava hardening 1.0.12 circa 70% e progetto Tanetto 360° circa 25%. Sono stime di pianificazione, non test automatici. Non incrementarle per la sola lettura o per la presenza di commit di documentazione. Aggiornarle solo dopo deliverable e verifiche reali.
