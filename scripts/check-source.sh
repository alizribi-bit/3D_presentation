#!/usr/bin/env bash
# The accepted presentation must stay byte-identical (constitution, principle I).
set -u
S="$HOME/Desktop/zawedni-video-pfe"
fail=0
check() { local got; got=$(md5sum "$1" 2>/dev/null | cut -d' ' -f1); if [ "$got" = "$2" ]; then echo "ok    $1"; else echo "DIFF  $1 ($got)"; fail=1; fi; }
check "$S/soutenance/deck.html"                 b4484a6001d7307e9e463c85864a7dce
check "$S/soutenance/build/script_rows.py"      de8730144fad3e645d211dc7bf2355f4
check "$S/soutenance/media/zawedni-devsecops.mp4" 4d3093eaafb0ba2ea9f80e062cf12985
z=$(unzip -p "$S/soutenance.zip" soutenance/deck.html 2>/dev/null | md5sum | cut -d' ' -f1)
[ "$z" = b4484a6001d7307e9e463c85864a7dce ] && echo "ok    soutenance.zip (deck.html inside)" || { echo "DIFF  soutenance.zip"; fail=1; }
exit $fail
