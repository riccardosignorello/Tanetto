#!/bin/bash
# 1.0.11 parte nativa: prove nel browser divise in pezzi, per contenere la memoria.
# Uso: bash tests/t110/run_n111.sh [porta]
set -u
cd "$(dirname "$0")"
P=${1:-8995}
LOG=${N111_LOG:-/tmp/n111_prove.log}
: > "$LOG"
bad=0
run() {
  for i in 1 2 3; do
    echo "=== $1 ${2:-} (tentativo $i)" >> "$LOG"
    rc=0
    T110_PORT=$P N111_PART=$1 N111_LANGS="${2:-}" timeout 1500 python3 -u t_n111_native.py > "$LOG.part" 2>&1 || rc=$?
    if grep -aq "^TUTTO OK" "$LOG.part"; then
      grep -aE "^(OK|NO|TUTTO|CI SONO)" "$LOG.part" >> "$LOG" || true
      return 0
    fi
    if grep -aq "^CI SONO" "$LOG.part"; then
      grep -aE "^(OK|NO|TUTTO|CI SONO)" "$LOG.part" >> "$LOG" || true
      bad=1
      return 0
    fi
    sleep 10
  done
  echo "NO  pezzo $1 ${2:-}: il browser non ha completato le prove (ultimo exit $rc)" >> "$LOG"
  bad=1
}
run A
run B
for l in it en de es fr pt ja ko zh zht ru pl nl tr; do run S "$l"; done
run C
run D
run P
NO_COUNT=$(grep -c '^NO' "$LOG" || true)
OK_COUNT=$(grep -c '^OK' "$LOG" || true)
echo "NO: $NO_COUNT  OK: $OK_COUNT" >> "$LOG"
tail -1 "$LOG"
[ "$bad" -eq 0 ] && [ "$NO_COUNT" -eq 0 ]
