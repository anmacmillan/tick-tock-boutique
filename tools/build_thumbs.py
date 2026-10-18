"""Wardrobe thumbnails and colour swatches for a shrunk pack (run after build_art.py).

    python3 tools/build_thumbs.py princess
"""
import json, sys
from pathlib import Path
from PIL import Image

pack = sys.argv[1]
d = Path(__file__).resolve().parent.parent / 'art' / pack
info = json.loads((d / 'parts.json').read_text())
(d / 'thumbs').mkdir(exist_ok=True)
FACE = {'eyes', 'irises', 'eyebrows', 'lips', 'cheeks'}
img = lambda n: Image.open(d / f'{n}.webp').convert('RGBA')

def layers(part, style, colour):
    L = info['parts'][part][str(style)]['layers']
    return [f'{part}-{style}_{colour}' + ('' if l == 'single' else f'_{l}') for l in (['back', 'front'] if 'back' in L else L)]

def face_base():
    base = img('body-1_2')
    for n in ['eyes-1_1_back', 'irises-1_4', 'eyes-1_1_front', 'eyebrows-1_1', 'lips-1_1']: base.alpha_composite(img(n))
    return base
fb = img('eyes-1_1_back').getbbox(); lb = img('lips-1_1').getbbox()
FBOX = (fb[0] - 20, fb[1] - 30, fb[2] + 20, lb[3] + 20)

sw = {}
for part, styles in info['parts'].items():
    for style, s in styles.items():
        c1 = s['colours'][len(s['colours']) // 2]
        if part in FACE:
            t = face_base()
            for n in layers(part, style, c1): t.alpha_composite(img(n))
            t = t.crop(FBOX)
        else:
            t = Image.new('RGBA', img(layers(part, style, c1)[0]).size)
            for n in layers(part, style, c1): t.alpha_composite(img(n))
            t = t.crop(t.getbbox())
        t.thumbnail((170, 170), Image.LANCZOS)
        t.save(d / 'thumbs' / f'{part}-{style}.webp', 'WEBP', quality=85)
        # a swatch per colour: the average of the visible pixels
        out = []
        for c in s['colours']:
            im = img(layers(part, style, c)[0 if part == 'eyes' else -1]); bb = im.getbbox()   # eyes: the shadow layer, not the lashes
            im = im.crop(bb) if bb else im
            if im.width * im.height > 40000: im = im.resize((max(1, im.width // 3), max(1, im.height // 3)))
            px = [p for p in im.getdata() if p[3] > 200] or [p for p in im.getdata() if p[3] > 25]   # blush is see-through
            if part == 'eyes': px = [p for p in px if not (p[0] > 190 and p[1] > 190 and p[2] > 190)] or px   # skip the whites of the eyes
            avg = [sum(p[i] for p in px) // max(1, len(px)) for i in range(3)] if px else [200, 200, 200]
            out.append('#%02x%02x%02x' % tuple(avg))
        s['swatches'] = out
(d / 'parts.json').write_text(json.dumps(info, indent=1))
# contact sheet, for naming things
ts = sorted((d / 'thumbs').glob('*.webp'))
cols = 10; sheet = Image.new('RGB', (cols * 180, ((len(ts) + cols - 1) // cols) * 200), 'white')
from PIL import ImageDraw
dr = ImageDraw.Draw(sheet)
for i, f in enumerate(ts):
    t = Image.open(f).convert('RGBA'); x, y = (i % cols) * 180, (i // cols) * 200
    sheet.paste(t, (x + 5, y + 5), t); dr.text((x + 5, y + 180), f.stem, fill='black')
sheet.save(Path(sys.argv[2]) if len(sys.argv) > 2 else d / 'sheet.png')
print(len(ts), 'thumbs')
