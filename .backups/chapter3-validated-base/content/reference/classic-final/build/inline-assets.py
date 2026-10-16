# Inline the local assets/ images of a bundled deck as data URIs (deck.mjs bundle only inlines http(s) images).
import re, base64, os, sys
p = sys.argv[1]; s = open(p).read()
mime = {'.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.svg': 'image/svg+xml'}
n = 0
def rep(m):
    global n
    path = m.group(2)
    if not os.path.exists(path): sys.exit(f'missing {path}')
    n += 1
    return f'{m.group(1)}data:{mime[os.path.splitext(path)[1].lower()]};base64,{base64.b64encode(open(path, "rb").read()).decode()}{m.group(3)}'
s = re.sub(r'''((?:src|href|poster)=["'])(assets/[^"']+)(["'])''', rep, s)
s = re.sub(r'''(url\(["']?)(assets/[^"')]+)(["']?\))''', rep, s)
left = len(re.findall(r'assets/', s))
open(p, 'w').write(s)
print(f'inline-assets: {n} images inlined, {os.path.getsize(p) // 1024} KB, {left} assets/ references left')
if left: sys.exit(1)
