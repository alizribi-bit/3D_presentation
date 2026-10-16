import type { Note } from '../story/types.ts';
export interface CueGroup { kind: Note[0]; texts: string[]; }
/** Group consecutive cues only: spoken/read passages keep their validated order. */
export function cueGroups(notes: readonly Note[]): CueGroup[] {
  const groups: CueGroup[] = [];
  for (const [kind, text] of notes) {
    const last = groups.at(-1);
    if (last?.kind === kind) last.texts.push(text);
    else groups.push({ kind, texts: [text] });
  }
  return groups;
}
