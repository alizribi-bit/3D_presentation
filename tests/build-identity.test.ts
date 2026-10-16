import test from 'node:test';
import assert from 'node:assert/strict';
import { copyFileSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { spawnSync } from 'node:child_process';

interface BuildIdentity {
  buildId: string;
  files: Record<string, string>;
  sourceFiles: Record<string, string>;
  projectRoot?: string;
}

test('a portable build excludes the protected snapshot and detects changed or missing files', async () => {
  const root = mkdtempSync(path.join(tmpdir(), 'zawedni-build-'));
  const put = (relative: string, text: string): void => {
    const target = path.join(root, relative);
    mkdirSync(path.dirname(target), { recursive: true });
    writeFileSync(target, text);
  };
  try {
    put('src/main.js', 'export const ready = true;');
    put('content/source/sequences.json', '[]');
    put('content/reference/manifest.json', '{"files":{}}');
    put('public/content/example.json', '{}');
    put('dist/index.html', '<!doctype html><title>Example</title>');
    for (const relative of ['index.html', 'presenter.html', 'vite.config.js', 'package.json', 'package-lock.json', 'present.sh', 'scripts/check-build.py', 'scripts/serve.py']) put(relative, 'fixture');
    copyFileSync(new URL('../scripts/build-identity.mjs', import.meta.url), path.join(root, 'scripts/build-identity.mjs'));
    const pluginModule: typeof import('../scripts/build-identity.mjs') = await import(pathToFileURL(path.join(root, 'scripts/build-identity.mjs')).href);
    const plugin = pluginModule.buildIdentity();
    // A public checkout has no classic-final directory.
    await plugin.closeBundle();
    const identityFile = path.join(root, 'dist/build-info.json');
    const identity = JSON.parse(readFileSync(identityFile, 'utf8')) as BuildIdentity;
    assert.match(identity.buildId, /^[a-f0-9]{64}$/);
    assert.equal(identity.projectRoot, undefined);
    assert.ok(Object.keys(identity.sourceFiles).every(relative => !path.isAbsolute(relative)));

    put('content/reference/classic-final/private-note.txt', 'local-only snapshot');
    await plugin.closeBundle();
    assert.equal(readFileSync(identityFile, 'utf8'), JSON.stringify(identity, null, 2) + '\n');
    assert.equal(readFileSync(path.join(root, 'content/reference/classic-final/private-note.txt'), 'utf8'), 'local-only snapshot');

    const check = (): number | null => spawnSync('python3', ['-B', new URL('../scripts/check-build.py', import.meta.url).pathname, root], { encoding: 'utf8' }).status;
    assert.equal(check(), 0);
    put('src/main.js', 'changed source');
    assert.equal(check(), 1);
    put('src/main.js', 'export const ready = true;');
    put('dist/index.html', 'changed build');
    assert.equal(check(), 1);
    put('dist/index.html', '<!doctype html><title>Example</title>');
    assert.equal(check(), 0);
    rmSync(path.join(root, 'public/content/example.json'));
    assert.equal(check(), 1);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
