import { readFileSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import path from 'node:path';
const ROOT = path.resolve(import.meta.dirname, '..');
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const provenance = JSON.parse(readFileSync(`${ROOT}/content/history/v7/provenance.json`));
const assets = JSON.parse(readFileSync(`${ROOT}/content/source/assets-manifest.json`));
let failed = 0;
function checkFile(file, expected) {
  const absolute = path.resolve(ROOT, file);
  const valid = existsSync(absolute) && sha(readFileSync(absolute)) === expected;
  if (!valid) { failed++; console.error(`FAIL provenance ${file}`); }
}
for (const [file, hash] of Object.entries(provenance.files)) checkFile(`content/history/v7/${file}`, hash);
for (const asset of assets.assets) checkFile(`public/${asset.file}`, asset.sha256);
const revisionAssets = JSON.parse(readFileSync(`${ROOT}/content/revision-assets.json`));
for (const asset of revisionAssets.assets) checkFile(`public/${asset.file}`, asset.sha256);
if (process.argv.includes('--classic-readonly')) {
  const snapshot = JSON.parse(readFileSync(`${ROOT}/content/history/classic-readonly-snapshot.json`));
  for (const [file, hash] of Object.entries(snapshot.files)) checkFile(path.join(snapshot.root, file), hash);
}
console.log(failed ? `${failed} provenance failure(s)` : `PASS historical provenance, ${assets.assets.length} original assets and ${revisionAssets.assets.length} real new capture.`);
process.exitCode = failed ? 1 : 0;
