"""Transcribe the words of the take for timing only. It never calls a listening model.

  python productions/derzhis-lyod/song/time_final.py
"""
from pathlib import Path
import importlib.util, json

SONG = Path(__file__).resolve().parent
TAKE = SONG / 'takes' / 'suno-final'
# Hand fixes from the word times of the vocal stem. The hook of chorus 2 starts on a long held note at 110.7.
# The choir's "Держись!" calls are single words. The outro holds the second one from 204.1 to 216.8.
FIX = {24: (110.7, None), 32: (133.5, 134.3), 36: (144.9, 145.6), 49: (204.1, 216.8), 51: (226.96, 228.96)}


def main():
    spec = importlib.util.spec_from_file_location('theatre_listen', SONG.parents[2] / 'tools' / 'listen.py')
    m = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(m)
    p = TAKE / 'scribe.json'
    if not p.exists():
        p.write_text(json.dumps(m.scribe(str(TAKE / 'take.mp3'), 'ru'), ensure_ascii=False, indent=1), encoding='utf-8')
    data = json.loads(p.read_text(encoding='utf-8'))
    rows = json.loads((TAKE / 'lines.json').read_text(encoding='utf-8'))
    lines = m.align(rows, m.sung_tokens(data['words'], 'ru'), 'ru')
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
