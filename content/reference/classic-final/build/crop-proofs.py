# Crop the 03/10 and 06/10 proof captures for the deck: no browser bars, no avatar, no shell prompt.
# Originals are read only (Trash files are copied, never moved). Output: assets/p<date>-<name>.jpg
from PIL import Image
import os
S, T = os.path.expanduser('~/Pictures/Screenshots/'), os.path.expanduser('~/.local/share/Trash/files/')
JOBS = {  # out: (source, box)
  'p0610-client-home':    (T + 'Screenshot from 2026-10-06 13-59-19.png', (0, 84, 1917, 1007)),
  'p0610-argocd-apps':    (T + 'Screenshot from 2026-10-06 14-10-55.png', (235, 84, 1490, 615)),
  'p0610-admin-entreprises': (S + 'B1-admin-parcours.png', (0, 84, 1917, 600)),
  'p0610-admin-apercu':   (S + 'B1-admin-login.png', (0, 84, 1917, 1007)),
  'p0610-prometheus-targets': (S + 'B4-prometheus-targets.png', (0, 135, 1920, 735)),
  'p0610-grafana':        (S + 'B5-grafana-backend.png.png', (355, 55, 1855, 1077)),
  'p0610-pr19-actions':   (S + 'Screenshot from 2026-10-06 17-13-02.png', (365, 330, 1645, 781)),
  'p0310-ci-run':         (S + 'A1-ci-backend-run.png', (0, 115, 1870, 300)),
  'p0310-ci-steps':       (S + 'A1-ci-backend-steps.png', (270, 160, 1890, 1060)),
  'p0310-acr-tags':       (S + 'A4-acr-tag-backend.png', (0, 38, 700, 170)),
  'p0310-manifest-commit': (S + 'B3-manifest-commit.png', (20, 120, 1880, 625)),
  'p0610-pod-image':      (S + 'B3-running-image.png', (0, 52, 1300, 97)),
  'p0310-apk-run':        (S + 'A3-apk-run.png.png', (320, 25, 1890, 1060)),
  'p0310-actions-staging': (S + 'A2-actions-overview.png', (300, 70, 1530, 1072)),
}
os.chdir(os.path.dirname(os.path.abspath(__file__)) + '/..')
def save(im, name):
    im = im.convert('RGB')
    if im.width > 1600: im = im.resize((1600, round(im.height * 1600 / im.width)), Image.LANCZOS)
    im.save(f'assets/{name}.jpg', quality=86); print(name, im.size)
for name, (src, box) in JOBS.items(): save(Image.open(src).crop(box), name)
# curl /uploads -> 404: keep the command and the answer, drop the user@host prompt
src = Image.open(S + 'Screenshot from 2026-10-06 17-13-02.png').convert('RGB')
cmd, ans = src.crop((428, 50, 1440, 73)), src.crop((100, 73, 200, 95))
bg = src.getpixel((1500, 200))
out = Image.new('RGB', (cmd.width + 40, 70), bg); out.paste(cmd, (20, 8)); out.paste(ans, (20, 38))
from PIL import ImageDraw, ImageFont
# hide the public IP inside the host name: stage.<adresse>.nip.io
d = ImageDraw.Draw(out); x0 = 20 + 612 - 20; d.rectangle((x0, 8, x0 + 112, 31), fill=bg)
f = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf', 17)
d.text((x0 + 2, 10), '<adresse>', fill=(220, 220, 220), font=f)
save(out, 'p0610-uploads-404')
