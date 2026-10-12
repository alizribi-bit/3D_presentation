import test from 'node:test';
import assert from 'node:assert/strict';
import { FULL_STATES, CHAPTERS, makeItinerary, speechNotes } from '../src/story/itinerary.ts';
import rows from '../content/source/sequences.json';
import { parseCommand, isMessage } from '../src/nav/commands.ts';
import { TravelPath, routePath } from '../src/characters/path.ts';
import { CatmullRomCurve3, Vector3 } from 'three';
import { VideoLifecycle, type VideoPort } from '../src/media/lifecycle.ts';

test('all accepted source steps and speech are present once, in order', () => {
  assert.equal(rows.length, 44);
  assert.equal(FULL_STATES.length, rows.reduce((total, row) => total + row.steps + 1, 0));
  for (const row of rows) {
    const states = FULL_STATES.filter(s => s.source.seq === row.id);
    assert.deepEqual(states.map(s => s.source.step), Array.from({ length: row.steps + 1 }, (_, i) => i));
    states.forEach((s, i) => assert.deepEqual(s.notes.script, row.id === 'video' && i === 1 ? [] : speechNotes(row.speech[i]!)));
  }
  assert.equal(FULL_STATES.at(-1)!.id, 'retour-1');
});
test('read instructions preserve the full accepted quote and surrounding speech', () => {
  assert.deepEqual(speechNotes('On explique. [lire] « Une grille. » Puis on avance.'), [['say','On explique.'],['read','Une grille.'],['say','Puis on avance.']]);
});
test('invalid or duplicate source content is rejected', () => {
  assert.throws(() => makeItinerary([{ ...rows[0]!, chapter: 8 }]));
  assert.throws(() => makeItinerary([rows[0]!, rows[0]!]));
});
test('chapter entries follow the six locations without skipping chapter 2', () => {
  assert.equal(FULL_STATES[CHAPTERS['2']!]!.source.seq, 'ch2');
  assert.equal(FULL_STATES[CHAPTERS['6']!]!.source.seq, 'ch6');
  assert.deepEqual(FULL_STATES[CHAPTERS['1']!]!.actors.guide.walk, ['guideA2', 'guideSpot01']);
  const travel = FULL_STATES.filter(s => s.actors.guide.route);
  assert.deepEqual(travel.map(s => s.actors.guide.route), [ ['01','02'],['02','03'],['03','04'],['04','05'],['05','06'] ].map(([from,to]) => ({from,to})));
});
test('untrusted channel commands cannot crash navigation or address nonexistent states', () => {
  for (const cmd of [null, {}, 'go:NaN', 'go:-1', 'go:1.5', 'go:106', 'scene:9', 'scene:undefined', 'go:Infinity']) assert.equal(parseCommand(cmd,106,CHAPTERS),null);
  assert.deepEqual(parseCommand('go:105',106,CHAPTERS),{kind:'index',index:105});
  assert.deepEqual(parseCommand('end',106,CHAPTERS),{kind:'index',index:105});
  assert.equal(isMessage(null),false); assert.equal(isMessage({t:'cmd',cmd:{}}),false);
});
test('travel uses arc distance, clamps progress and follows the road between places', () => {
  const p = new TravelPath([new Vector3(0,0,0),new Vector3(3,0,0),new Vector3(3,0,4)]);
  assert.equal(p.length,7); assert.deepEqual(p.sample(3/7).position.toArray(),[3,0,0]);
  assert.deepEqual(p.sample(-1).position.toArray(),[0,0,0]); assert.deepEqual(p.sample(2).position.toArray(),[3,0,4]);
  const road = new CatmullRomCurve3([new Vector3(0,0,0),new Vector3(5,0,4),new Vector3(10,0,0)]);
  const curved = routePath(road,new Vector3(-1,.34,0),new Vector3(11,.34,0),0,1);
  assert.ok(curved.sample(.5).position.z > 3.5); assert.equal(curved.sample(1).position.x,11);
  assert.throws(() => new TravelPath([]));
});
test('leaving or rewinding the film stops audio and resets playback; rejections are handled', async () => {
  let playing=false;
  const video: VideoPort={currentTime:12,muted:true,pause(){playing=false;},async play(){playing=true;}};
  const m = new VideoLifecycle(video);
  await m.enter(0); assert.equal(video.currentTime,0);
  await m.enter(1); assert.equal(playing,true); assert.equal(video.muted,false);
  video.currentTime=42; await m.enter(null); assert.equal(playing,false); assert.equal(video.currentTime,0);
  video.play=async()=>{throw new Error('User activation required');}; assert.equal(await m.enter(1),false);
  await m.enter(0); assert.equal(video.currentTime,0);
});

test('late video play resolution cannot restart audio after leaving the scene', async () => {
  let resolvePlay!: () => void, playing=false;
  const video: VideoPort={currentTime:8,muted:false,pause(){playing=false;},play(){return new Promise<void>(resolve=>{resolvePlay=()=>{playing=true;resolve();};});}};
  const m=new VideoLifecycle(video);const playingPromise=m.enter(1);await m.enter(null);resolvePlay();
  assert.equal(await playingPromise,false);assert.equal(playing,false);assert.equal(video.currentTime,0);
});


test('the same version moves through gates, stops on failure and resumes after correction', async () => {
  const { deliveryFrame } = await import('../src/story/delivery.ts');
  const find = (id: string) => FULL_STATES.find(s => s.id === id)!;
  const start = find('chaine-0'), finish = find('chaine-3');
  assert.equal(deliveryFrame(start,start,1).x,-5.8);
  assert.ok(deliveryFrame(finish,start,.5).x > -5.8);
  assert.ok(deliveryFrame(finish,start,1).x > 5.7);
  const failed=find('log4j-1');
  assert.deepEqual(deliveryFrame(failed,find('log4j-0'),1),{visible:true,blocked:true,x:0});
  assert.equal(deliveryFrame(failed,failed,1).x,0);
  assert.deepEqual(deliveryFrame(find('log4j-2'),failed,1),{visible:true,blocked:false,x:5.8});
  assert.equal(deliveryFrame(finish,start,2).x,deliveryFrame(finish,start,1).x);
  assert.equal(deliveryFrame(find('ch5-0'),finish,1).visible,false);
});
test('manual native playback also rejects a late start after scene exit', async () => {
  let resolvePlay!: () => void, playing=false;
  const video: VideoPort={currentTime:0,muted:true,pause(){playing=false;},play(){return new Promise<void>(resolve=>{resolvePlay=()=>{playing=true;resolve();};});}};
  const m=new VideoLifecycle(video);await m.enter(0);const promise=m.play();await m.enter(null);resolvePlay();
  assert.equal(await promise,false);assert.equal(playing,false);assert.equal(video.currentTime,0);assert.equal(await m.play(),false);
});
