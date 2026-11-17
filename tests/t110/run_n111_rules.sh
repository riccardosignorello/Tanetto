#!/bin/bash
# 1.0.11: regole di Firestore di "Invita un amico" provate con l'emulatore (progetto finto demo-tanetto, niente rete).
# Le regole provate sono quelle vere con le 36 ore minime portate a 4 secondi.
REPO=$(cd "$(dirname "$0")/../.." && pwd); FBEMU=${FBEMU:-/home/claude/fbemu}
D=$(mktemp -d); sed "s/duration.value(36, 'h')/duration.value(4, 's')/" "$REPO/tools/firebase/firestore.rules" > "$D/firestore.rules"
grep -q "duration.value(4, 's')" "$D/firestore.rules" || { echo "NO  regola delle 36 ore non trovata"; exit 1; }
echo '{ "firestore": { "rules": "firestore.rules" }, "emulators": { "firestore": { "port": 8080, "host": "127.0.0.1" }, "ui": { "enabled": false }, "singleProjectMode": true } }' > "$D/firebase.json"
cd "$D" && "$FBEMU/node_modules/.bin/firebase" emulators:exec --only firestore --project demo-tanetto "node $REPO/tests/t110/t_n111_rules.mjs" 2>&1 | grep -E "^(OK|NO|TUTTO|CI SONO)" ; rm -rf "$D"
