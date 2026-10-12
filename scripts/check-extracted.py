"""Verify every delivered byte after extraction, using only Python's standard library."""
from pathlib import Path
import hashlib
import json
import sys

root = Path(sys.argv[1]).resolve()
manifest = json.loads((root / 'DELIVERY-MANIFEST.json').read_text())
failed = []
for relative, expected in manifest['files'].items():
    path = root / relative
    if not path.is_file() or hashlib.sha256(path.read_bytes()).hexdigest() != expected:
        failed.append(relative)
assert not failed, '\n'.join(failed)
assert (root / 'dist/index.html').is_file()
assert (root / 'dist/presenter.html').is_file()
assert (root / 'dist/media/zawedni-devsecops.mp4').is_file()
print(f"PASS extracted archive: {len(manifest['files'])} file hashes, jury/presenter build and final film.")
