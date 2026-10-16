#!/usr/bin/env bash
# Check immutable provenance independently from the authorized local content revision.
set -eu
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
node "$PROJECT_DIR/scripts/check-provenance.mjs"
