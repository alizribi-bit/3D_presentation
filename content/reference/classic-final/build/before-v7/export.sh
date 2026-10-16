#!/usr/bin/env bash
# Exports: code highlighting cache -> offline bundle (fonts, scripts, images inlined) -> PDF -> PPTX.
set -euo pipefail
cd "$(dirname "$0")"
K=~/.claude/skills/deck-kit
# code highlighting cache: only needed when a slide has data-code (none in v3)
if grep -q 'data-code=' deck.html; then node $K/scripts/sync-runtime.mjs --code-cache deck.html; fi
node $K/export/deck.mjs check deck.html | tail -1
node $K/export/deck.mjs bundle deck.html deck.offline.html
python3 build/inline-assets.py deck.offline.html
# PDF not part of v4 (not requested): node $K/export/deck.mjs pdf deck.html deck.pdf
# PPTX dropped (static)
