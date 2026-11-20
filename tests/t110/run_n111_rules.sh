#!/bin/bash
# 1.0.11: regole Firestore di "Invita un amico" provate con l'emulatore (progetto finto demo-tanetto, niente rete).
# Le regole provate sono quelle vere con le 36 ore minime portate a 4 secondi.
set -euo pipefail
REPO=$(cd "$(dirname "$0")/../.." && pwd)
FBEMU=${FBEMU:-/home/claude/fbemu}
D=$(mktemp -d)
trap 'rm -rf "$D"' EXIT
sed "s/duration.value(36, 'h')/duration.value(4, 's')/" "$REPO/tools/firebase/firestore.rules" > "$D/firestore.rules"
grep -q "duration.value(4, 's')" "$D/firestore.rules" || { echo "NO  regola delle 36 ore non trovata"; exit 1; }
echo '{ "firestore": { "rules": "firestore.rules" }, "emulators": { "firestore": { "port": 8080, "host": "127.0.0.1" }, "ui": { "enabled": false }, "singleProjectMode": true } }' > "$D/firebase.json"
LOG="$D/emulator.log"
if (cd "$D" && "$FBEMU/node_modules/.bin/firebase" emulators:exec --only firestore --project demo-tanetto "node $REPO/tests/t110/t_n111_rules.mjs") >"$LOG" 2>&1; then
  rc=0
else
  rc=$?
fi
grep -E "^(OK|NO|TUTTO|CI SONO)" "$LOG" || true
if [ "$rc" -ne 0 ]; then
  echo "Regole Firestore: emulatore o test non riusciti (exit $rc)"
  tail -80 "$LOG"
fi
exit "$rc"
