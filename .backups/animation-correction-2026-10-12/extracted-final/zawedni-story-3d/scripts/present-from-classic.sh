#!/usr/bin/env bash
# Compatibility entry for ~/Desktop/zawedni-video-pfe/zawedni-story-3d.
# Only the independent, maintained 3D project supplies the build and server.
set -euo pipefail
ENTRY_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT="$(cd "$ENTRY_DIR/../.." && pwd)/zawedni-story-3d"
if [ ! -x "$PROJECT/present.sh" ]; then
  echo "Projet 3D actuel introuvable : $PROJECT/present.sh" >&2
  exit 1
fi
exec "$PROJECT/present.sh" "$@"
