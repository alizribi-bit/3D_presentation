// Execute the real launcher against the real built server, with simulated screen geometry and no physical GUI.
import { mkdtempSync, writeFileSync, readFileSync, mkdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import assert from 'node:assert/strict';
const temp = mkdtempSync(path.join(tmpdir(), 'zs3d-launch-'));
const launcher = new URL('../present.sh', import.meta.url).pathname;
const build = JSON.parse(readFileSync(new URL('../dist/build-info.json', import.meta.url), 'utf8')).buildId;
mkdirSync(`${temp}/bin`);
const executable = (name, body) => writeFileSync(`${temp}/bin/${name}`, '#!/usr/bin/env bash\n' + body, { mode: 0o755 });
executable('google-chrome', 'printf "%s\\n" "$@" > "$ZS3D_LAUNCH_LOG"\n');
executable('pkill', 'exit 1\n');
executable('xrandr', 'printf "%s\\n" "eDP-1 connected primary 1920x1080+0+0"\nif [ "${ZS3D_TEST_LAYOUT:-dual}" = dual ]; then printf "%s\\n" "HDMI-1 connected 1366x768+1920+0"; fi\n');
const cases = [
  { args: [], layout: 'dual', position: '1920,0', presenter: 'pv=0,0,1920,1080' },
  { args: ['--swap'], layout: 'dual', position: '0,0', presenter: 'pv=1920,0,1366,768' },
  { args: [], layout: 'single', position: null, presenter: 'pv=auto' },
];
try {
  for (const [i, item] of cases.entries()) {
    const log = `${temp}/call-${i}`;
    execFileSync('/bin/bash', [launcher, ...item.args], { cwd: tmpdir(), env: { ...process.env,
      PATH: `${temp}/bin:${process.env.PATH}`, ZS3D_TEST_LAYOUT: item.layout,
      ZS3D_CHROME_PROFILE: `${temp}/profile`, ZS3D_LAUNCH_LOG: log }, stdio: 'pipe' });
    let flags;
    for (let tries = 0; tries < 20; tries++) {
      try { flags = readFileSync(log, 'utf8'); break; } catch { await new Promise(resolve => setTimeout(resolve, 50)); }
    }
    assert.ok(flags?.includes(item.presenter));
    assert.ok(flags.includes(`/?build=${build}&${item.presenter}`), 'launcher opens the verified build URL');
    if (item.position) assert.ok(flags.includes(`--window-position=${item.position}`));
    else assert.ok(flags.includes('--start-maximized'));
  }
  assert.throws(() => execFileSync('/bin/bash', [launcher, '--invalid'], { cwd: tmpdir(), stdio: 'pipe' }));
  assert.throws(() => execFileSync('/bin/bash', [launcher, '--prototype'], { cwd: tmpdir(), stdio: 'pipe' }));
  console.log('PASS launcher from /tmp: current build URL, dual screens, swap, single screen and invalid flags; geometry simulated.');
} finally { rmSync(temp, { recursive: true, force: true }); }
