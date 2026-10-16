import rows from '../../content/source/sequences.json';
import type { Chapter, Note, PlaceId, Sequence, StoryState } from './types.ts';

export function speechNotes(chunk: string): Note[] {
  // Preserve the exact ordered speech; quoted [lire] passages remain separate read instructions.
  return chunk.split(/(\[lire\]\s*«[\s\S]*?»)/g).flatMap((part): Note[] => {
    const text = part.trim(); if (!text) return [];
    const read = /^\[lire\]\s*«([\s\S]*?)»$/.exec(text);
    return [[read ? 'read' : 'say', read ? read[1]!.trim() : text]];
  });
}
const labels = ['l01', 'l02', 'l03', 'l04', 'l05', 'l06'];
const shotFor: Record<PlaceId, string> = { '01': 'market', '02': 'workshop', '03': 'cloud', '04': 'delivery', '05': 'monitoring', '06': 'belvedere' };
const places = ['01', '02', '03', '04', '05', '06'] as const;
export function makeItinerary(sequences: readonly Sequence[]): StoryState[] {
  const states: StoryState[] = [];
  let previousPlace: PlaceId | null = null;
  for (const row of sequences) {
    if (!Number.isInteger(row.chapter) || row.chapter < 0 || row.chapter > 6 || row.speech.length !== row.steps + 1) throw new Error(`Invalid source sequence ${row.id}`);
    const chapter = row.chapter as Chapter;
    const place = chapter ? places[chapter - 1]! : null;
    for (let step = 0; step <= row.steps; step++) {
      const entry = step === 0, opener = /^ch[2-6]$/.test(row.id), travel = entry && place !== previousPlace && place !== null;
      const guide = { at: place ? `guideSpot${place}` : 'guideA2', face: 'camera' } as StoryState['actors']['guide'];
      if (travel && previousPlace) guide.route = { from: previousPlace, to: place };
      else if (travel) guide.walk = ['guideA2', 'guideSpot01'];
      let shot = place ? shotFor[place] : 'overview';
      const panels: string[] = [];
      const extras: Partial<StoryState> = {};
      if (row.id === 'couverture') { panels.push('cover'); extras.cover = step ? 'full' : 'basmala'; }
      else if (row.id === 'sommaire') { panels.push('sommaire'); if (step) panels.push(...labels); }
      else if (opener) { shot = `chapter${place}`; panels.push('evidence'); extras.evidence = { seq: row.id, step }; }
      else if (row.id === 'devsecops') {
        shot = step ? 'crossing' : 'cloud';
        panels.push('cycle-title', 'side-dev', 'side-ops', 'secu', 'stage0', 'stage1', 'stage2', 'stage3', 'stage4', 'stage5');
        if (step) panels.push('fb', 'secline');
        extras.feedback = !!step; extras.hot = ['stage2']; guide.face = step ? 'crossing' : 'stage2'; guide.point = guide.face;
      } else if (row.id === 'video') {
        shot = 'theater'; panels.push('film-title'); extras.media = { step: step as 0 | 1 };
      } else {
        panels.push('evidence'); extras.evidence = { seq: row.id, step };
        guide.face = 'evidence'; guide.point = 'evidence';
      }
      if (row.id === 'architecture' && step === 0) {
        shot = 'architecture';
      }
      if (row.id === 'sequence' || row.id === 'parcours-app') shot = 'workshopProof';
      if (row.id === 'chaine') {
        guide.face = 'gateTag1'; guide.point = 'gateTag1';
      }
      if (row.id === 'log4j' && step === 1) { guide.face='gateTag1'; guide.point='gateTag1'; }
      if (row.id === 'retour' && step === 1) shot = 'overview';
      const chunk = row.speech[step]!;
      const notes: StoryState['notes'] = { script: speechNotes(chunk), next: '' };
      if (row.id === 'video' && step === 1) { notes.script = []; notes.silent = chunk.trim().replace(/^\(|\)$/g, ''); }
      states.push({ id: `${row.id}-${step}`, scene: String(chapter), chapter, place, title: row.title,
        source: { seq: row.id, step }, move: row.id === 'couverture' ? 'cut' : travel ? 'travel' : 'reveal', shot,
        panels, duration: travel ? 5.2 : opener ? 1.5 : .65,
        actors: { guide, rep: { at: 'repSpot', face: row.id === 'acteurs' ? 'camera' : 'easel' } },
        notes, visited: places.filter((_, i) => i < chapter - 1), ...extras });
      previousPlace = place;
    }
  }
  for (const [i, state] of states.entries()) {
    const next = states[i + 1];
    state.notes.next = next ? `${next.title}${next.source.seq === state.source.seq ? ` · étape ${next.source.step}` : ''}` : 'Fin de la présentation.';
  }
  const ids = new Set(states.map(s => s.id));
  if (ids.size !== states.length) throw new Error('Duplicate presentation state');
  return states;
}
export const FULL_STATES = makeItinerary(rows);
export const CHAPTERS: Record<string, number> = Object.fromEntries([...new Set(FULL_STATES.map(s => s.scene))].map(c => [c, FULL_STATES.findIndex(s => s.scene === c)]));
