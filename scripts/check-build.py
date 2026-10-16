"""Check both the prepared build and its current source. No writes or dependencies."""
from pathlib import Path
import hashlib
import json
import sys

root = Path(sys.argv[1]).resolve()
identity = json.loads((root / 'dist/build-info.json').read_text())
failed = []
for folder, entries in [(root, identity['sourceFiles']), (root / 'dist', identity['files'])]:
    for relative, expected in entries.items():
        file = folder / relative
        if not file.is_file() or hashlib.sha256(file.read_bytes()).hexdigest() != expected:
            failed.append(relative)
if failed:
    print('Build périmé ou incomplet : ' + ', '.join(failed[:12]))
    sys.exit(1)
print('Build actuel vérifié : ' + identity['buildId'][:16])
