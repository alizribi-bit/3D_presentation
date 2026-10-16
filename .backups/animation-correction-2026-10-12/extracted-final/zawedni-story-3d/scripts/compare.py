# Compare review/verify/<id>-{forward,back,reload}.png: same state must give the same image (small tolerance for
# antialiasing and idle breathing, which ?still freezes anyway).  python3 scripts/compare.py DIR A0 A1 …
import sys
from PIL import Image, ImageChops
d, ids = sys.argv[1], sys.argv[2:]
for i in ids:
    ref = Image.open(f'{d}{i}-forward.png').convert('RGB')
    for how in ('back', 'reload'):
        im = Image.open(f'{d}{i}-{how}.png').convert('RGB')
        diff = ImageChops.difference(ref, im).convert('L').point(lambda v: 255 if v > 40 else 0)
        share = sum(diff.histogram()[255:]) / (ref.width * ref.height)
        print(f"{'DIFF' if share > .004 else 'same'} {i} {how} {share * 100:.3f}% px")
