import { readFileSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import path from 'node:path';
const ROOT = path.resolve(import.meta.dirname, '..');
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const assets = JSON.parse(readFileSync(`${ROOT}/content/source/assets-manifest.json`));
let failed = 0;
function checkFile(file, expected) {
  const absolute = path.resolve(ROOT, file);
  const valid = existsSync(absolute) && sha(readFileSync(absolute)) === expected;
  if (!valid) { failed++; console.error(`FAIL provenance ${file}`); }
}
for (const asset of assets.assets) checkFile(`public/${asset.file}`, asset.sha256);
console.log(failed ? `${failed} provenance failure(s)` : `PASS ${assets.assets.length} validated local assets.`);
process.exitCode = failed ? 1 : 0;
