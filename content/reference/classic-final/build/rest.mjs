// Last step of each slide (all builds done) -> grid PNGs of 12 slides each. Usage: node rest.mjs deck.html outprefix [from to]
import { chromium } from '/home/ali/.claude/skills/deck-kit/export/node_modules/playwright-core/index.mjs';
import { execSync } from 'child_process';
const [deck, out, from = 1, to = 48] = process.argv.slice(2);
const b = await chromium.launch({ channel: 'chrome' }); const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
const files = [];
for (let n = +from; n <= +to; n++) {
  await p.goto(`file://${process.cwd()}/${deck}?render&n=${n}#${n}.99`); await p.waitForTimeout(n === +from ? 1500 : 400);
  const f = `${out}-${String(n).padStart(2, '0')}.png`; await p.screenshot({ path: f }); files.push(f);
}
await b.close();
const py = `from PIL import Image, ImageDraw
fs=${JSON.stringify(files)}
for g in range(0, len(fs), 12):
  sh=Image.new('RGB',(3*960,4*540),'white')
  for k,f in enumerate(fs[g:g+12]):
    im=Image.open(f).resize((950,534)); sh.paste(im,((k%3)*960,(k//3)*540)); d=ImageDraw.Draw(sh); d.rectangle(((k%3)*960,(k//3)*540,(k%3)*960+70,(k//3)*540+40),fill='black'); d.text(((k%3)*960+8,(k//3)*540+8), f[-6:-4], fill='white')
  sh.save('${out}-grid%d.png' % (g//12))`;
execSync(`python3 -c "${py.replace(/"/g, '\\"')}"`);
