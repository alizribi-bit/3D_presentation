import test from 'node:test';
import assert from 'node:assert/strict';
import rows from '../content/source/sequences.json';
import { FULL_STATES } from '../src/story/itinerary.ts';
import { slideMarkers } from '../src/ui/slide-chrome.ts';

test('all slides have consecutive numbers, independent of reveal count and retained IDs', () => {
  const markers = slideMarkers(rows);
  assert.equal(markers.size, 35);
  for (const [index, row] of rows.entries()) {
    assert.deepEqual(markers.get(row.id), { number: index + 1, total: 35, chapter: row.chapter });
  }
  assert.deepEqual(markers.get('ch3'), { number: 9, total: 35, chapter: 2 });
  assert.deepEqual(markers.get('ch4'), { number: 17, total: 35, chapter: 3 });
});

test('every reveal keeps its parent slide number and exact editorial chapter', () => {
  const markers = slideMarkers(rows);
  for (const state of FULL_STATES) {
    const marker = markers.get(state.source.seq);
    assert.ok(marker, state.id);
    assert.equal(marker.chapter, state.chapter, state.id);
    assert.equal(marker.number, rows.find(row => row.id === state.source.seq)!.seq, state.id);
  }
  assert.equal(markers.get('couverture')!.chapter, 0);
  assert.equal(markers.get('sommaire')!.chapter, 0);
  assert.deepEqual(markers.get('video'), { number: 34, total: 35, chapter: 5 });
  assert.deepEqual(markers.get('retour'), { number: 35, total: 35, chapter: 5 });
});
