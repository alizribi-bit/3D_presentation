# v3 crops: originals stay in assets/originals-v3/, deck copies go to assets/v3-*.jpg
# python3 build/crop-v3.py
from PIL import Image, ImageDraw, ImageFont
import os
os.chdir(os.path.dirname(os.path.abspath(__file__)) + '/..')
O = 'assets/originals-v3/'
def save(im, name, w=1600):
    im = im.convert('RGB')
    if im.width > w: im = im.resize((w, round(im.height * w / im.width)), Image.LANCZOS)
    im.save(f'assets/v3-{name}.jpg', quality=86, optimize=True); print(name, im.size)
def mask(im, box, text=''):
    d = ImageDraw.Draw(im); d.rectangle(box, fill='#e4e9e5')
    if text:
        f = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf', max(12, (box[3] - box[1]) * 6 // 10))
        d.text((box[0] + 6, box[1] + (box[3] - box[1]) // 6), text, fill='#536459', font=f)
    return im
# web captures (1440x900 at 1.5x = 2160x1350), local develop stack, 07/10
for n in ['pub-home', 'sup-evaluation', 'sup-certification', 'buy-marketplace']:
    save(Image.open(O + n + '.png'), n)
a = Image.open(O + 'adm-submissions.png')           # header holds the admin e-mail: cut it
save(a.crop((0, 110, a.width, a.height)), 'adm-submissions')
# Loki proof: hide the marker address, keep the two log lines
g = Image.open(O + '04-grafana-journaux-login-test.png').copy()
mask(g, (771, 482, 1040, 504), '<adresse test>'); mask(g, (771, 554, 1125, 576), '<adresse test>')
mask(g, (1027, 105, 1146, 135), '')
save(g.crop((320, 60, 1440, 600)), 'grafana-journaux', 1400)
# mobile screens (Flutter, 390x844 at 2x), from design/audit/008/after/mobile, 06/10
for n in ['home-supplier', 'evaluation', 'status_approved', 'marketplace_companies']:
    save(Image.open(O + f'mob-{n}_fr_light.png'), 'mob-' + n, 520)
# Gmail inbox: keep only the subject start and the time of the two alert e-mails, stacked (sender and the rest cut)
gm = Image.open(O + 'Screenshot from 2026-10-07 14-24-13.png').convert('RGB')
rows = [(186, 229), (229, 272)]
out = Image.new('RGB', (560 + 80, 2 * 43), 'white')
for k, (y0, y1) in enumerate(rows):
    out.paste(gm.crop((576, y0, 1136, y1)), (0, k * 43)); out.paste(gm.crop((1758, y0, 1838, y1)), (560, k * 43))
out = out.resize((out.width * 2, out.height * 2), Image.LANCZOS); save(out, 'gmail-rows', 1280)
# Prometheus: just the rule name, its FIRING badge and the expression, readable at full width
p = Image.open(O + '02-prometheus-alert-firing.png'); save(p.crop((40, 342, 1400, 474)), 'prom-firing-rule', 1360)
