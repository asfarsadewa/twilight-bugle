"""Transcribe the words of the take for timing only. It never calls a listening model.

  python productions/furusato-ga-mieru/song/time_final.py
"""
from pathlib import Path
import importlib.util, json

SONG = Path(__file__).resolve().parent
TAKE = SONG / 'takes' / 'suno-final'
# Hand fixes from the transcript word times. The hook "ああ" starts before "故郷". The choir "登れ 登れ" is short.
# The last line ends at 277.0. A wordless vocal continues from 278 to 291.
FIX = {10: (83.9, None), 32: (196.3, 197.0), 34: (200.2, 201.5), 48: (None, 277.0)}


def main():
    spec = importlib.util.spec_from_file_location('theatre_listen', SONG.parents[2] / 'tools' / 'listen.py')
    m = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(m)
    p = TAKE / 'scribe.json'
    if not p.exists():
        p.write_text(json.dumps(m.scribe(str(TAKE / 'take.mp3'), 'ja'), ensure_ascii=False, indent=1), encoding='utf-8')
    data = json.loads(p.read_text(encoding='utf-8'))
    rows = json.loads((TAKE / 'lines.json').read_text(encoding='utf-8'))
    lines = m.align(rows, m.sung_tokens(data['words'], 'ja'), 'ja')
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
