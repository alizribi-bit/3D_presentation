import test from 'node:test';
import assert from 'node:assert/strict';
import { shouldAutoplayFilm } from '../src/media/transition.ts';

test('only the forward film reveal can start playback automatically', () => {
  assert.equal(shouldAutoplayFilm({ step: 0 }, { step: 1 }, true), true);
  for (const [previous, current, forward] of [
    [null, { step: 1 }, false], [null, { step: 1 }, true],
    [{ step: 1 }, { step: 1 }, false], [{ step: 1 }, { step: 0 }, false],
    [{ step: 0 }, { step: 1 }, false], [{ step: 1 }, null, true],
  ] as const) assert.equal(shouldAutoplayFilm(previous, current, forward), false);
});

import { VideoLifecycle } from '../src/media/lifecycle.ts';
test('leaving and rewinding restores the native poster, while presenter synchronization preserves playback', async () => {
  let loads=0, plays=0;
  const video={currentTime:0,muted:false,pause(){},load(){loads++;},async play(){plays++;}};
  const lifecycle=new VideoLifecycle(video);
  await lifecycle.enter(0,false);
  await lifecycle.enter(1,true);
  await lifecycle.enter(1,false);
  assert.equal(plays,1); assert.equal(loads,1);
  await lifecycle.enter(null,false);
  await lifecycle.enter(1,false);
  assert.equal(loads,2); assert.equal(plays,1); assert.equal(video.currentTime,0);
});
