"""Transcribe the words of the take for timing only. It never calls a listening model.

  python productions/derzhis-lyod/song/time_final.py
"""
from pathlib import Path
import importlib.util, json

SONG = Path(__file__).resolve().parent
TAKE = SONG / 'takes' / 'suno-final'
# Hand fixes from the word times and the vocal energy of the stem. Scribe hears "По льду" for "Вода на льду" and
# "свернул" for "развернул". The choir's "Держись!" calls are single words. The long notes of "Ещё один рейс" end
# where the vocal energy drops.
FIX = {30: (121.9, 124.6), 34: (137.6, 139.7), 35: (140.2, 141.0), 36: (141.2, 147.5), 47: (199.8, 206.5),
       48: (224.0, 226.0), 49: (234.3, 239.4), 50: (240.4, 243.5)}


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
