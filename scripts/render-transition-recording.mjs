// Cuts between independently verified cases; preserves every selected transition's wall-clock speed.
import { readFileSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
const out = 'review/transitions';
const report = JSON.parse(readFileSync(`${out}/report.json`, 'utf8'));
if (report.failure || !report.clips.length) throw new Error('A successful verification recording is required');
function duration(file) {
  const result = spawnSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'default=nw=1:nk=1', file], { encoding: 'utf8' });
  if (result.status !== 0 || !Number.isFinite(Number(result.stdout))) throw new Error(result.stderr);
  return Number(result.stdout);
}
// The popup begins recording after the jury. Both stop together when their context closes;
// their duration difference aligns the simultaneously recorded commands in the excerpts.
const notesDelay = duration(`${out}/jury-normal.webm`) - duration(`${out}/notes-normal.webm`);
for (const name of ['jury', 'notes']) {
  const delay = name === 'notes' ? notesDelay : 0;
  const graph = report.clips.map((clip, i) =>
    `[0:v]trim=start=${Math.max(0, clip.start - delay)}:end=${clip.end - delay},setpts=PTS-STARTPTS[c${i}]`).join(';')
    + ';' + report.clips.map((_, i) => `[c${i}]`).join('') + `concat=n=${report.clips.length}:v=1:a=0,fps=25[v]`;
  const result = spawnSync('ffmpeg', ['-y', '-i', `${out}/${name}-normal.webm`, '-filter_complex', graph,
    '-map', '[v]', '-c:v', 'libx264', '-preset', 'fast', '-crf', '20', '-pix_fmt', 'yuv420p',
    '-movflags', '+faststart', `${out}/${name}-transitions.mp4`], { encoding: 'utf8' });
  if (result.status !== 0) throw new Error(result.stderr);
}
// Show the notes alongside the jury recording without changing either video's speed.
const result = spawnSync('ffmpeg', ['-y', '-i', `${out}/jury-transitions.mp4`, '-i', `${out}/notes-transitions.mp4`,
  '-filter_complex', '[1:v]scale=640:360,pad=640:540:0:0:color=0xf4f7f2[n];[0:v][n]hstack=inputs=2[v]',
  '-map', '[v]', '-c:v', 'libx264', '-preset', 'fast', '-crf', '20', '-pix_fmt', 'yuv420p',
  '-movflags', '+faststart', `${out}/transitions-avec-notes.mp4`], { encoding: 'utf8' });
if (result.status !== 0) throw new Error(result.stderr);
let offset = 0;
const shortClips = report.clips.flatMap(clip => {
  const length = clip.end - Math.max(0, clip.start);
  const start = offset; offset += length;
  return (clip.from === 'methodologie-1' || clip.to === 'outils-dev-0' || clip.from === 'outils-dev-0')
    ? [{ ...clip, start, end: offset }] : [];
});
const shortGraph = shortClips.map((clip, i) =>
  `[0:v]trim=start=${clip.start}:end=${clip.end},setpts=PTS-STARTPTS[s${i}]`).join(';')
  + ';' + shortClips.map((_, i) => `[s${i}]`).join('') + `concat=n=${shortClips.length}:v=1:a=0[v]`;
const shortResult = spawnSync('ffmpeg', ['-y', '-i', `${out}/transitions-avec-notes.mp4`,
  '-filter_complex', shortGraph, '-map', '[v]', '-c:v', 'libx264', '-preset', 'fast', '-crf', '20',
  '-pix_fmt', 'yuv420p', '-movflags', '+faststart', `${out}/transitions-courtes.mp4`], { encoding: 'utf8' });
if (shortResult.status !== 0) throw new Error(shortResult.stderr);
writeFileSync(`${out}/recording.json`, JSON.stringify({ normalSpeed: true, audioRecorded: false, notesDelay,
  editing: 'Cuts between cases only; no acceleration, no slowed playback, no reconstructed 3D frames.',
  clips: report.clips, shortClips, shortDuration: shortClips.reduce((sum, clip) => sum + clip.end - clip.start, 0),
  duration: report.clips.reduce((sum, clip) => sum + clip.end - Math.max(0, clip.start), 0) }, null, 2) + '\n');
console.log('Saved normal-speed jury and simultaneous notes transition excerpts.');
