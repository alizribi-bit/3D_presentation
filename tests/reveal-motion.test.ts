import test from 'node:test';
import assert from 'node:assert/strict';
import { LocalRevealMotion, revealEntrance, revealMotion } from '../src/story/reveal-motion.ts';

test('diagram reveals preserve SVG coordinates and muted final opacity', () => {
  const entrance = revealEntrance('diagram', 0, .3);
  assert.deepEqual(entrance.keyframes, [{ opacity: 0 }, { opacity: .3 }]);
  assert.equal(entrance.options.fill, 'backwards'); // No final inline style replaces the canonical frame.
});

test('proof entrances use individual translation without replacing existing crop transforms', () => {
  const entrance = revealEntrance('proof', 1);
  assert.equal(entrance.keyframes[0]!.translate, '0 8px');
  assert.equal(entrance.keyframes[1]!.translate, '0 0');
  assert.ok(entrance.keyframes.every(frame => !('transform' in frame)));
});

test('large batches finish under half a second with bounded stagger', () => {
  for (const kind of ['diagram', 'proof', 'content'] as const) {
    let previous = 0;
    for (let i = 0; i < 200; i++) {
      const { options } = revealEntrance(kind, i);
      const delay = Number(options.delay), duration = Number(options.duration);
      assert.ok(delay >= previous && delay <= revealMotion.maxDelay);
      assert.ok(delay + duration < 500);
      previous = delay;
    }
  }
});

test('interruptions cancel only owned animations and release completed references', async () => {
  const original = globalThis.getComputedStyle;
  globalThis.getComputedStyle = (() => ({ opacity: '1', translate: 'none' })) as unknown as typeof getComputedStyle;
  const calls: { canceled: boolean; complete: () => void }[] = [];
  const node = {
    namespaceURI: 'http://www.w3.org/1999/xhtml', tagName: 'IMG', querySelector: () => null,
    animate: () => {
      let complete!: () => void;
      const finished = new Promise<void>(resolve => { complete = resolve; });
      const call = { canceled: false, complete }; calls.push(call);
      return { finished, cancel: () => { call.canceled = true; complete(); } };
    },
  } as unknown as Element;
  try {
    const controller = new LocalRevealMotion();
    controller.play([node]); controller.play([node]);
    assert.equal(calls[0]!.canceled, true);
    assert.equal(calls[1]!.canceled, false);
    calls[1]!.complete(); await Promise.resolve();
    controller.stop(); assert.equal(calls[1]!.canceled, false);
    controller.play([node]); controller.stop(); controller.stop();
    assert.equal(calls[2]!.canceled, true);
  } finally {
    if (original) globalThis.getComputedStyle = original;
    else Reflect.deleteProperty(globalThis, 'getComputedStyle');
  }
});
