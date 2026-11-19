"""Transcribe the words of the take for timing only. It never calls a listening model.

  python productions/cum-an-teine/song/time_final.py
"""
from pathlib import Path
import importlib.util, json

SONG = Path(__file__).resolve().parent
TAKE = SONG / 'takes' / 'suno-final'
# Hand fixes from the Scribe word times of the full mix and the vocal stem. Scribe hears the Gaelic as "Cumha n'téinne".
# Vocal energy of the stem places the long final lines.
FIX = {4: (43.8, 45.3), 5: (45.6, 46.6), 7: (48.7, 49.9), 13: (70.9, 72.4), 16: (78.0, 79.3), 23: (127.4, 128.7),
       26: (134.5, 135.8), 29: (141.5, 145.2), 32: (154.2, 157.5), 43: (219.1, 221.0), 44: (221.2, 223.2),
       45: (223.8, 229.0), 46: (234.0, 243.0), 47: (256.0, 264.0)}


def main():
    spec = importlib.util.spec_from_file_location('theatre_listen', SONG.parents[2] / 'tools' / 'listen.py')
    m = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(m)
    p = TAKE / 'scribe.json'
    if not p.exists():
        p.write_text(json.dumps(m.scribe(str(TAKE / 'take.mp3'), 'en'), ensure_ascii=False, indent=1), encoding='utf-8')
    data = json.loads(p.read_text(encoding='utf-8'))
    rows = json.loads((TAKE / 'lines.json').read_text(encoding='utf-8'))
    lines = m.align(rows, m.sung_tokens(data['words'], 'en'), 'en')
    for n, (a, b) in FIX.items():
        if a is not None: lines[n]['start'] = a
        if b is not None: lines[n]['end'] = b
        lines[n]['fixed'] = True
    summary = {'lyric_match': round(sum(l['match'] for l in lines) / len(lines), 3), 'musical_earcheck': 'human producer', 'review': None}
    (TAKE / 'check.json').write_text(json.dumps({'summary': summary, 'lines': lines}, ensure_ascii=False, indent=1), encoding='utf-8')
    for l in lines:
        print(f"{l['n']:2} {l['who']:6} {l['start']}..{l['end']} {l['match']:.2f} {l['text']}")
    print(summary)


if __name__ == '__main__':
    main()
