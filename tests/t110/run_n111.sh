#!/bin/bash
# 1.0.11 parte nativa: prove nel browser divise in pezzi (processi separati, ognuno ritentato fino a 3 volte se il
# browser si chiude per mancanza di memoria del computer). Uso: bash tests/t110/run_n111.sh [porta]
cd "$(dirname "$0")"; P=${1:-8995}; LOG=${N111_LOG:-/tmp/n111_prove.log}; : > "$LOG"
run() { for i in 1 2 3; do echo "=== $1 ${2:-} (tentativo $i)" >> "$LOG"; T110_PORT=$P N111_PART=$1 N111_LANGS="${2:-}" timeout 1500 python3 -u t_n111_native.py > "$LOG.part" 2>&1
  if grep -aqE "^(TUTTO OK|CI SONO)" "$LOG.part"; then grep -aE "^(OK|NO|TUTTO|CI SONO)" "$LOG.part" >> "$LOG"; return; fi; sleep 10; done
  echo "NO  pezzo $1 ${2:-}: il browser si e' chiuso 3 volte" >> "$LOG"; }
run A; run B; for l in it en de es fr pt ja ko zh zht ru pl nl tr; do run S "$l"; done; run C; run D; run P
echo "NO: $(grep -c '^NO' "$LOG")  OK: $(grep -c '^OK' "$LOG")" >> "$LOG"; tail -1 "$LOG"
