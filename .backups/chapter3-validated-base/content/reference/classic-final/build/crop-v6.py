# v6 assets: the real BMC (report annex B, fig. B.1) and the extra captures of the merged web/mobile journey.
# python3 build/crop-v6.py   (sources are read, never modified)
from PIL import Image
import os
os.chdir(os.path.dirname(os.path.abspath(__file__)) + '/..')
BMC = os.path.expanduser('~/Desktop/New Project/figures/annexeB_business-model-canvas.png')
AUD = os.path.expanduser('~/Desktop/zawedniPFEproject/design/audit/008/after/')
def save(im, name, fmt='jpg', w=None):
    im = im.convert('RGB')
    if w and im.width != w: im = im.resize((w, round(im.height * w / im.width)), Image.LANCZOS)
    path = f'assets/v6-{name}.{fmt}'
    im.save(path, quality=90, optimize=True) if fmt == 'jpg' else im.save(path, optimize=True)
    print(path, im.size)
# BMC: whole canvas (1326x905) + three zooms, enlarged x1.5 over their slide size so the text stays sharp.
# Boxes measured on the image lines: segments x1069-1308 y20-609, propositions x536-806, revenus x661-1308 y613-884.
b = Image.open(BMC)
save(b, 'bmc', 'png')
ZOOM = {'bmc-segments': ((1072, 22, 1306, 340), 2.15), 'bmc-valeur': ((539, 22, 804, 470), 1.54), 'bmc-revenus': ((664, 616, 1160, 760), 1.37)}  # inside the box lines
for name, (box, k) in ZOOM.items():
    c = b.crop(box); f = k * 1.5
    save(c.resize((round(c.width * f), round(c.height * f)), Image.LANCZOS), name, 'png')
# web: the grid's pillars only (the top card of this page already shows the final score), and the review follow-up page
w = Image.open('assets/originals-v3/sup-evaluation.png')            # 2160x1350, local develop stack, 07/10
save(w.crop((690, 545, 1866, 1085)), 'sup-piliers', w=1600)
s = Image.open(AUD + 'shots/sup-1440-light-fr_evaluation_status.png') # 1440x1017, sidebar cut
save(s.crop((264, 60, 1440, 760)), 'sup-revue', w=1600)
# mobile: the review in progress (Flutter, same series as v3-mob-*)
save(Image.open(AUD + 'mobile/M2/status_submitted_fr_light.png'), 'mob-status_submitted', w=520)
