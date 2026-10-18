"""Record the game's voice clips with ElevenLabs, once.

    python3 make_voice.py voices              list the voices on your account
    python3 make_voice.py sample VOICE_ID     record 3 sample lines to voice_samples/
    python3 make_voice.py all VOICE_ID        record every line to voice/ (skips ones already done)

The API key is read from ~/.elevenlabs_key and never printed.
The lines come from the game itself (window.__ttbLines), so they always match.
"""
import json, os, ssl, sys, time, urllib.request
from pathlib import Path

HERE = Path(__file__).resolve().parent
KEY = (Path.home() / '.elevenlabs_key').read_text().strip()
if not KEY.startswith('sk_') and ' ' in KEY:
    sys.exit("~/.elevenlabs_key doesn't hold an API key (it holds some other text). Copy the key again and re-save it.")
try:
    import certifi; CTX = ssl.create_default_context(cafile=certifi.where())   # this Mac's Python lacks the system certificates
except ImportError:
    CTX = ssl.create_default_context()
API = 'https://api.elevenlabs.io/v1'
MODEL = 'eleven_multilingual_v2'
SETTINGS = {'stability': 0.45, 'similarity_boost': 0.8, 'style': 0.35, 'use_speaker_boost': True}


def call(path, body=None):
    req = urllib.request.Request(API + path, data=json.dumps(body).encode() if body else None,
                                 headers={'xi-api-key': KEY, 'Content-Type': 'application/json'})
    with urllib.request.urlopen(req, timeout=240, context=CTX) as r:
        return r.read()


def lines():
    """Ask the game for every line, by loading it in a headless browser."""
    import subprocess, threading, http.server, functools
    from playwright.sync_api import sync_playwright
    handler = functools.partial(http.server.SimpleHTTPRequestHandler, directory=str(HERE))
    srv = http.server.ThreadingHTTPServer(('127.0.0.1', 0), handler)
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    with sync_playwright() as pw:
        b = pw.chromium.launch(); p = b.new_page()
        p.goto(f'http://127.0.0.1:{srv.server_port}/'); p.wait_for_timeout(500)
        out = p.evaluate('window.__ttbLines()'); b.close()
    srv.shutdown()
    return out


def tts(voice_id, text, dest):
    audio = call(f'/text-to-speech/{voice_id}?output_format=mp3_44100_128', {'text': text, 'model_id': MODEL, 'voice_settings': SETTINGS})
    dest.write_bytes(audio)


if __name__ == '__main__':
    cmd = sys.argv[1] if len(sys.argv) > 1 else 'voices'
    if cmd == 'voices':
        for v in json.loads(call('/voices'))['voices']:
            lab = v.get('labels', {})
            print(f"{v['voice_id']}  {v['name']:<22} {lab.get('gender', ''):<7} {lab.get('accent', ''):<12} {lab.get('age', ''):<12} {lab.get('description', '')}")
    elif cmd == 'sample':
        out = HERE / 'voice_samples'; out.mkdir(exist_ok=True)
        L = lines()
        for k in ['hello', 't-4-45', 'got-gown']:
            tts(sys.argv[2], L[k], out / f'{sys.argv[2][:6]}-{k}.mp3'); print('recorded', k, ':', L[k])
    elif cmd == 'fx':
        out = HERE / 'voice'; out.mkdir(exist_ok=True)
        FX = {
            'fx-correct': ('a magical harp glissando with sparkling chimes, happy and bright', 1.6),
            'fx-wrong': ('a soft, cute cartoon descending boop, gentle and friendly, not scary', 1.0),
            'fx-star': ('a short bright fairy dust twinkle sparkle', 0.8),
            'fx-buy': ('a cash register cha-ching with magical sparkles', 1.4),
            'fx-wear': ('a quick fabric swish of a twirling dress with a soft sparkle', 0.9),
            'fx-level': ('a short triumphant magical fanfare with sparkles and a little crowd cheering', 3.0),
            'fx-yay': ('a happy little girl cheering yay, short and joyful', 1.0),
        }
        for k, (prompt, secs) in FX.items():
            f = out / f'{k}.mp3'
            if f.exists(): continue
            f.write_bytes(call('/sound-generation', {'text': prompt, 'duration_seconds': secs, 'prompt_influence': 0.5})); print('fx', k)
        f = out / 'music.mp3'
        if not f.exists():
            f.write_bytes(call('/music', {'prompt': "A seamless looping instrumental for a children's princess dress-up game: gentle, sparkly and magical, music box, celesta, harp, glockenspiel and soft strings, happy and dreamy, moderate tempo, no vocals", 'music_length_ms': 60000}))
            print('music')
        (out / 'manifest.json').write_text(json.dumps(sorted(p.stem for p in out.glob('*.mp3') if p.stat().st_size > 1000)))
    elif cmd == 'all':
        out = HERE / 'voice'; out.mkdir(exist_ok=True)
        L = lines()
        total = sum(len(t) for t in L.values())
        print(f'{len(L)} lines, {total} characters')
        for i, (k, t) in enumerate(L.items()):
            f = out / f'{k}.mp3'
            if f.exists() and f.stat().st_size > 1000: continue
            vid = json.loads((HERE / 'voice_nl.json').read_text())['nl'] if k.startswith('nl-') else sys.argv[2]   # Klokkenland: the Flemish voice
            for attempt in range(3):
                try: tts(vid, t, f); break
                except Exception as e: print('retry', k, e); time.sleep(3)
            print(f'{i + 1}/{len(L)}', k)
        (out / 'manifest.json').write_text(json.dumps(sorted(p.stem for p in out.glob('*.mp3') if p.stat().st_size > 1000)))
        print('done:', len(list(out.glob('*.mp3'))), 'clips')
