"""Cut live examples at their original speed; no frame interpolation or clock changes."""
from pathlib import Path
import json
import subprocess

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'review/animation-correction-2026-10-12'
report = json.loads((OUT / 'report.json').read_text())
assert not report['errors'] and not report['external'] and not report['failures']
config = report.get('recordings', [])[ -1 ] if report.get('recordings') else next(c for c in report['configurations'] if c['width'] == 1920 and c['quality'] == 'normal')
file_prefix = 'recording-' if report.get('recordings') else ''
selected = config['cases'][:9] + [c for c in config['cases'] if c['label'] in ['Rafale au même lieu', 'Interruption par retour']]
clips = []
filters = []
position = 0.0
for i, case in enumerate(selected):
    source = OUT / f"{file_prefix}normal-{config['width']}-{config['cases'].index(case) + 1:02}.json"
    data = json.loads(source.read_text())
    first, last = case['commands'][0], case['commands'][-1]
    landed = next(s for s in data['samples'] if s['t'] >= last['time'] and s['id'] == case['to'] and s['phase'] == 'done')
    start = max(0, first['time'] - .5)
    end = data['end']  # Include native local entrances and their final visible frame.
    label = f"{case['label']} : {case['from']} → {case['to']}"
    caption = Path(f'/tmp/zawedni-animation-caption-{i}.txt')
    caption.write_text(label)
    filters.append(f"[0:v]trim=start={start}:end={end},setpts=PTS-STARTPTS,drawtext=fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf:textfile={caption}:fontsize=16:fontcolor=white:box=1:boxcolor=black@0.75:boxborderw=5:x=12:y=h-th-9[s{i}]")
    clips.append(dict(label=label, sourceStart=start, sourceEnd=end, start=position, end=position+end-start))
    position += end-start
filters.append(''.join(f'[s{i}]' for i in range(len(clips)))+f'concat=n={len(clips)}:v=1:a=0[v]')
subprocess.run(['ffmpeg','-y','-v','error','-i',str(OUT/'jury-normal.webm'),'-filter_complex',';'.join(filters),
    '-map','[v]','-c:v','libx264','-preset','fast','-crf','20','-pix_fmt','yuv420p','-movflags','+faststart',str(OUT/'animations-normal.mp4')],check=True)
def stamp(seconds):
    ms=round(seconds*1000)
    return f'{ms//3600000:02}:{ms//60000%60:02}:{ms//1000%60:02}.{ms%1000:03}'
(OUT/'animations-normal.vtt').write_text('WEBVTT\n\n'+'\n\n'.join(f'{stamp(c["start"])} --> {stamp(c["end"])}\n{c["label"]}' for c in clips)+'\n')
(OUT/'recording.json').write_text(json.dumps(dict(normalSpeed=True,clockManipulated=False,audioRecorded=False,
    viewport=[config['width'],config['height']],videoSize=[960,540],renderer=config['environment']['renderer'],
    editing='Cuts and captions only; original speed; no frame interpolation',duration=position,clips=clips),ensure_ascii=False,indent=2)+'\n')
print(f'PASS normal-speed excerpts: {position:.2f} seconds, {len(clips)} cases.')
