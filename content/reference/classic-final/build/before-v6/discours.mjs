// SCRIPT.md (table) -> DISCOURS.md (speech to read and rehearse)
import { readFileSync, writeFileSync } from 'node:fs';
const rows = readFileSync('SCRIPT.md', 'utf8').split('\n').filter(l => /^\| \d+ \|/.test(l));
let out = '# Discours de soutenance\n\n`[clic]` = appuyer sur → . Parlez lentement : une phrase, une respiration.\n';
for (const r of rows) {
  const c = r.split('|').slice(1, -1).map(s => s.trim());
  if (c[1].startsWith('R ·')) out += '\n---\n\n# Réserve : réponses aux questions (après la conclusion)\n';
  out += `\n---\n\n## ${c[0]}. ${c[2]}\n\n${c[7].replace(/ \[clic\] /g, '\n\n**[clic]** ')}\n`;
}
writeFileSync('DISCOURS.md', out);
