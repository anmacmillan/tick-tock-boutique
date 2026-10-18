"""Shrink an Igor Galochkin dress-up pack into web-sized images for the game.

    python3 tools/build_art.py ~/Downloads/PrincessCharacter.zip princess

Reads the PNGs straight out of the zip (no unpacking), crops every sprite to the
same box around the character, scales to 800 px tall and saves WebP to art/<pack>/.
Also writes art/<pack>/parts.json: { part: { style: [colours...] } } with
front/back layers marked.
"""
import io, json, re, sys, zipfile
from pathlib import Path
from PIL import Image

BOX = (300, 206, 1755, 1817)          # the area every sprite in the pack fits inside
HEIGHT = 800
src, pack = Path(sys.argv[1]).expanduser(), sys.argv[2]
out = Path(__file__).resolve().parent.parent / 'art' / pack
out.mkdir(parents=True, exist_ok=True)
z = zipfile.ZipFile(src)
scale = HEIGHT / (BOX[3] - BOX[1])
size = (round((BOX[2] - BOX[0]) * scale), HEIGHT)
parts, total = {}, 0
for path in z.namelist():
    nm = path.split('/')[-1]
    m = re.match(r'(.+?)-(\d+)_(\d+)(?:[_-](front|back))?\.png$', nm, re.I)
    if not m: continue
    part, style, colour, side = m.group(1), int(m.group(2)), int(m.group(3)), (m.group(4) or '').lower()
    im = Image.open(io.BytesIO(z.read(path))).convert('RGBA').crop(BOX).resize(size, Image.LANCZOS)
    key = f'{part}-{style}_{colour}' + (f'_{side}' if side else '')
    f = out / f'{key}.webp'
    im.save(f, 'WEBP', quality=82, method=6)
    total += f.stat().st_size
    p = parts.setdefault(part, {}).setdefault(str(style), {'colours': set(), 'layers': set()})
    p['colours'].add(colour); p['layers'].add(side or 'single')
for part in parts.values():
    for s in part.values(): s['colours'] = sorted(s['colours']); s['layers'] = sorted(s['layers'])
(out / 'parts.json').write_text(json.dumps({'size': size, 'parts': parts}, indent=1))
print(f'{pack}: {sum(len(s["colours"]) for p in parts.values() for s in p.values())} sprites, {total / 1e6:.1f} MB, image size {size}')
