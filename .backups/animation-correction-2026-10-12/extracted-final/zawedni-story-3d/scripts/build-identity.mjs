import { readdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
async function files(root) {
  const result = [];
  for (const entry of await readdir(root, { withFileTypes: true })) {
    const name = path.join(root, entry.name);
    if (entry.isDirectory()) result.push(...await files(name));
    else if (entry.isFile()) result.push(name);
  }
  return result.sort();
}
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
/** Independent identity for static files: an unchanged index must never accept stale content JSON. */
export function buildIdentity() {
  return { name: 'build-identity', async closeBundle() {
    const root = path.resolve(import.meta.dirname, '..'), build = path.join(root, 'dist');
    const builtFiles = {}, sourceFiles = {};
    for (const file of await files(build)) if (!file.endsWith('/build-info.json')) builtFiles[path.relative(build, file)] = hash(await readFile(file));
    for (const dir of ['src', 'content/source', 'content/reference', 'public']) for (const file of await files(path.join(root, dir))) sourceFiles[path.relative(root, file)] = hash(await readFile(file));
    for (const file of ['index.html', 'presenter.html', 'vite.config.js', 'package.json', 'package-lock.json', 'present.sh', 'scripts/check-build.py', 'scripts/build-identity.mjs']) sourceFiles[file] = hash(await readFile(path.join(root, file)));
    const buildId = hash(JSON.stringify(builtFiles));
    await writeFile(path.join(build, 'build-info.json'), JSON.stringify({ project: 'zawedni-story-3d', projectRoot: root, buildId, reference: JSON.parse(await readFile(path.join(root, 'content/reference/manifest.json'))).files, files: builtFiles, sourceFiles }, null, 2) + '\n');
  } };
}
