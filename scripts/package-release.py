"""Bundle the prepared offline presentation and sources, excluding old backups and local agent state."""
from pathlib import Path
import hashlib
import json
import zipfile

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'release'
OUT.mkdir(exist_ok=True)
REVISION = 'animations-corrigees'
ARCHIVE = OUT / f'zawedni-story-3d-{REVISION}.zip'
sha = lambda data: hashlib.sha256(data).hexdigest()
files = set()
for folder in ['src', 'scripts', 'tests', 'content', 'public', 'dist', 'docs']:
    files.update(path for path in (ROOT / folder).rglob('*') if path.is_file() and not path.is_symlink())
for filename in ['README.md', 'HANDOFF.md', 'PRESENTER.md', 'DESIGN.md', 'AGENTS.md',
                 'package.json', 'package-lock.json', 'tsconfig.json', 'vite.config.js',
                 'index.html', 'presenter.html', 'present.sh']:
    files.add(ROOT / filename)
review = ROOT / 'review/animation-correction-2026-10-12'
files.update(path for path in review.iterdir() if path.is_file() and path.suffix in ['.png', '.json', '.mp4', '.md', '.vtt'])
# Historical v7 provenance is required by check-provenance; local backup copies are not.
files = {path for path in files if not ('content/history' in str(path.relative_to(ROOT)) and 'v7' not in path.parts)}
files = {path for path in files if '__pycache__' not in path.parts and path.suffix not in ['.pyc', '.log', '.zip']}
manifest = {str(path.relative_to(ROOT)): sha(path.read_bytes()) for path in sorted(files)}
manifest_path = OUT / 'DELIVERY-MANIFEST.json'
reference = json.loads((ROOT / 'content/reference/manifest.json').read_text())
manifest_path.write_text(json.dumps({'revision': REVISION, 'reference': reference['files'], 'counts': reference['counts'], 'files': manifest}, indent=2) + '\n')
with zipfile.ZipFile(ARCHIVE, 'w', compression=zipfile.ZIP_DEFLATED, compresslevel=6) as archive:
    for path in sorted(files):
        archive.write(path, 'zawedni-story-3d/' + str(path.relative_to(ROOT)))
    archive.write(manifest_path, 'zawedni-story-3d/DELIVERY-MANIFEST.json')
digest = sha(ARCHIVE.read_bytes())
(OUT / (ARCHIVE.name + '.sha256')).write_text(f'{digest}  {ARCHIVE.name}\n')
with zipfile.ZipFile(ARCHIVE) as archive:
    assert archive.testzip() is None
print(json.dumps({'archive': str(ARCHIVE), 'bytes': ARCHIVE.stat().st_size,
                  'sha256': digest, 'files': len(files), 'crcVerified': True}))
