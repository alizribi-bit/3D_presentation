# Contact sheet of review PNGs: python3 scripts/sheet.py out.png a.png b.png …  (3 columns, 640×360 each, labelled)
import sys
from PIL import Image, ImageDraw
out, files = sys.argv[1], sys.argv[2:]
W, H, C = 640, 360, 3
R = (len(files) + C - 1) // C
sheet = Image.new('RGB', (C * W + (C - 1) * 8, R * (H + 26)), 'white')
d = ImageDraw.Draw(sheet)
for i, f in enumerate(files):
    x, y = (i % C) * (W + 8), (i // C) * (H + 26)
    sheet.paste(Image.open(f).convert('RGB').resize((W, H)), (x, y + 24))
    d.text((x + 4, y + 6), f.split('/')[-1], fill='black')
sheet.save(out)
