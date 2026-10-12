"""Bundle the prepared offline presentation and sources, excluding old backups and local agent state."""
from pathlib import Path
import hashlib
import json
import zipfile

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'release'
OUT.mkdir(exist_ok=True)
ARCHIVE = OUT / 'zawedni-story-3d-44.zip'
sha = lambda data: hashlib.sha256(data).hexdigest()
files = set()
for folder in ['src', 'scripts', 'tests', 'content', 'public', 'dist', 'docs']:
    files.update(path for path in (ROOT / folder).rglob('*') if path.is_file() and not path.is_symlink())
for filename in ['README.md', 'HANDOFF.md', 'PRESENTER.md', 'DESIGN.md', 'AGENTS.md',
                 'package.json', 'package-lock.json', 'tsconfig.json', 'vite.config.js',
                 'index.html', 'presenter.html', 'present.sh']:
    files.add(ROOT / filename)
review = ROOT / 'review/revision'
files.update(path for path in review.glob('*') if path.is_file() and path.suffix in ['.png', '.json', '.html', '.webm', '.diff'])
for resolution in ['1920x1080', '1366x768']:
    folder = review / resolution
    files.update(path for path in folder.glob('*') if path.is_file())
    report = ROOT / f'review/full/verify/{resolution}/report.json'
    if report.exists():
        files.add(report)
performance = ROOT / 'review/full/performance.json'
if performance.exists():
    files.add(performance)
files = {path for path in files if '__pycache__' not in path.parts and path.suffix not in ['.pyc', '.log', '.zip']}
manifest = {str(path.relative_to(ROOT)): sha(path.read_bytes()) for path in sorted(files)}
manifest_path = OUT / 'DELIVERY-MANIFEST.json'
manifest_path.write_text(json.dumps({'revision': '44', 'files': manifest}, indent=2) + '\n')
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
