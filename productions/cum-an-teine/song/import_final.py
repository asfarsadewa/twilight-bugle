"""Import the producer's supplied Suno recording of Cùm an Teine. No music generation and no listening model.

  python productions/cum-an-teine/song/import_final.py [--source <mp3>]

The embedded words follow the handoff. The Scribe transcript of the vocal stem shows the sung order. The choir does not
answer "Cùm an teine" in the first half of the final chorus. After the last "Cùm an teine", the choir sings "The fire she
gave us is gone". The outro sings "Cùm an teine, a ghràidh" twice. The sheet follows the recording. The script refuses a
file whose embedded words do not hold every sheet line. It copies the file unchanged into takes/suno-final and writes lyrics.json,
lines.json, lyrics.md and master-source.json.
"""
from pathlib import Path
import argparse, hashlib, json, shutil, subprocess, unicodedata

SONG = Path(__file__).resolve().parent
TAKE = SONG / 'takes' / 'suno-final'

# Each sung line once: (Indonesian, Chinese). The Gaelic lines keep their Gaelic text as the sung line.
T = {
    'Two hundred winters on this stone': ('Dua ratus musim dingin di atas batu ini', '这块石头上，两百个冬天'),
    'The fire was never let to die': ('Api itu tak pernah dibiarkan padam', '炉火从未让它熄灭'),
    'My mother banked it every night': ('Ibuku menimbunnya setiap malam', '母亲每夜都把它封好'),
    'And the smoke went up to the sky': ('Dan asapnya naik ke langit', '炊烟升上天空'),
    'Hò rò, beat the cloth': ('Hò rò, pukullah kain', '嚯啰，捶打布匹'),
    'Hò rò, hò rò': ('Hò rò, hò rò', '嚯啰，嚯啰'),
    'The wool is wet, the hands are raw': ('Wolnya basah, tangan pun lecet', '羊毛湿透，双手磨破'),
    'They nailed the paper to the door': ('Mereka memaku surat di pintu', '他们把告示钉在门上'),
    'They pulled the rooftree to the floor': ('Mereka merobohkan tiang atap ke lantai', '他们把房梁拉倒在地'),
    'The thatch came down upon the bed': ('Atap jerami runtuh menimpa ranjang', '茅草塌落在床上'),
    '"Take the fire," my mother said': ('"Bawalah api itu," kata ibuku', '"带上炉火，"母亲说'),
    'Keep the fire, keep the fire burning': ('Jagalah api, jagalah agar tetap menyala', '守住炉火，让炉火燃烧'),
    'Cùm an teine': ('Jagalah api', '守住炉火'),
    'Over the water, over the sea': ('Menyeberangi air, menyeberangi laut', '越过水面，越过大海'),
    'Carry the glen away with thee': ('Bawalah lembah ini bersamamu', '把山谷带在你身边'),
    'She slept the last night by the shore': ('Malam terakhir ia tidur di tepi pantai', '最后一夜，她睡在海岸边'),
    'Her hand upon the iron pot': ('Tangannya di atas periuk besi', '她的手搭在铁罐上'),
    'She did not wake to see the sail': ('Ia tak bangun untuk melihat layar', '她没有醒来看见船帆'),
    'We laid the hearthstone where she lay': ('Kami letakkan batu tungku di tempat ia berbaring', '我们把炉石放在她安息的地方'),
    'Mother, I carry it over the sea': ('Ibu, kubawa api ini menyeberangi laut', '母亲，我带着它越过大海'),
    'Carry the glen away with me': ('Kubawa lembah ini bersamaku', '把山谷带在我身边'),
    'The sea came over, the sea came in': ('Laut menerjang, laut pun masuk', '海浪扑来，海水涌入'),
    'Cùm an teine! Cùm an teine!': ('Jagalah api! Jagalah api!', '守住炉火！守住炉火！'),
    'I held it high above the wave': ('Kuangkat tinggi di atas ombak', '我把它高举过浪头'),
    'I held it high, I held it high': ('Kuangkat tinggi, kuangkat tinggi', '我高高举起，高高举起'),
    'Cùm an teine!': ('Jagalah api!', '守住炉火！'),
    'And the fire went out': ('Dan api itu pun padam', '炉火还是熄灭了'),
    'Snow on a shore that has no name': ('Salju di pantai tanpa nama', '无名的海岸上落着雪'),
    'No roof, no wall, no hearth, no flame': ('Tanpa atap, tanpa dinding, tanpa tungku, tanpa nyala', '没有屋顶，没有墙，没有炉，没有火'),
    'I struck the flint, I struck again': ('Kupukul batu api, kupukul lagi', '我敲打火石，一次又一次'),
    'He cupped his hands around the spark': ('Ia menangkupkan tangan melindungi percikan', '他双手拢住那点火星'),
    'It is not her fire, but it is ours to keep': ('Ini bukan apinya, tapi milik kita untuk dijaga', '这不是她的火，却是我们要守的火'),
    'Mother, the glen is beyond the sea': ('Ibu, lembah itu di seberang laut', '母亲，山谷在大海那边'),
    'Cùm an teine, a ghràidh': ('Jagalah api, sayangku', '守住炉火，我的爱'),
    'The fire she gave us is gone': ('Api yang ia berikan telah tiada', '她给我们的火已经熄灭'),
}

E, M, C, B = 'ewan', 'morag', 'choir', 'both'
KEEP, CUM = 'Keep the fire, keep the fire burning', 'Cùm an teine'
SECTIONS = [
    ('intro', 'Intro', []),
    ('v1', 'Verse 1', [('Two hundred winters on this stone', E), ('The fire was never let to die', E), ('My mother banked it every night', E), ('And the smoke went up to the sky', E)]),
    ('pre', 'The waulking song', [('Hò rò, beat the cloth', M), ('Hò rò, hò rò', C), ('The wool is wet, the hands are raw', M), ('Hò rò, hò rò', C)]),
    ('v2', 'Verse 2', [('They nailed the paper to the door', M), ('They pulled the rooftree to the floor', M), ('The thatch came down upon the bed', M), ('"Take the fire," my mother said', M)]),
    ('ch1', 'Chorus', [(KEEP, B), (CUM, C), ('Over the water, over the sea', B), (KEEP, B), (CUM, C), ('Carry the glen away with thee', B)]),
    ('v3', 'Verse 3', [('She slept the last night by the shore', E), ('Her hand upon the iron pot', E), ('She did not wake to see the sail', E), ('We laid the hearthstone where she lay', E)]),
    ('ch2', 'Chorus', [(KEEP, B), (CUM, C), ('Mother, I carry it over the sea', E), (KEEP, B), (CUM, C), ('Carry the glen away with me', B)]),
    ('storm', 'Bridge: the storm', [('The sea came over, the sea came in', E), ('Cùm an teine! Cùm an teine!', C), ('I held it high above the wave', E), ('I held it high, I held it high', E), ('Cùm an teine!', C), ('And the fire went out', E)]),
    ('break', 'Break', []),
    ('v4', 'Verse 4', [('Snow on a shore that has no name', M), ('No roof, no wall, no hearth, no flame', M), ('I struck the flint, I struck again', M), ('He cupped his hands around the spark', M)]),
    ('ch3', 'Final chorus', [(KEEP, B), ('It is not her fire, but it is ours to keep', B), (KEEP, B), ('Mother, the glen is beyond the sea', B),
                             (KEEP, B), (CUM, C), ('The fire she gave us is gone', C), (KEEP, B)]),
    ('outro', 'Outro', [('Cùm an teine, a ghràidh', B), ('Cùm an teine, a ghràidh', B)]),
]


def norm(s):
    return ''.join(c for c in unicodedata.normalize('NFKC', s).lower() if c.isalnum())


def write(p, x):
    p.write_text(json.dumps(x, ensure_ascii=False, indent=1) + '\n', encoding='utf-8')


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--source', type=Path, default=Path('C:/Users/asfar/Downloads/Cùm an Teine.mp3'))
    a = ap.parse_args()
    info = json.loads(subprocess.check_output(['ffprobe', '-v', 'error', '-show_format', '-of', 'json', str(a.source)], encoding='utf-8'))
    tags = info['format']['tags']
    embedded = tags.get('lyrics-eng', '')
    sung_embedded = [norm(s) for s in embedded.splitlines() if s.strip() and not s.strip().startswith('[')]

    rows, sections = [], []
    for sid, label, items in SECTIONS:
        sec = {'id': sid, 'label': label}
        if not items:
            sec['note'] = 'instrumental'
        else:
            sec['lines'] = [{'who': w, 'en': en, 'id': T[en][0], 'zh': T[en][1]} for en, w in items]
            rows += [{'section': sid, **l, 'sung': l['en']} for l in sec['lines']]
        sections.append(sec)
    assert {norm(r['sung']) for r in rows} <= set(sung_embedded), 'A sheet line is not in the embedded words.'

    TAKE.mkdir(parents=True, exist_ok=True)
    digest = hashlib.sha256(a.source.read_bytes()).hexdigest()
    shutil.copy2(a.source, TAKE / 'take.mp3')
    if not (TAKE / 'original.wav').exists():
        subprocess.run(['ffmpeg', '-v', 'error', '-i', str(a.source), '-ar', '44100', str(TAKE / 'original.wav')], check=True)
    voices = {
        'ewan': {'name': 'Ewan', 'voice': 'a warm young male tenor', 'heard': 'male'},
        'morag': {'name': 'Morag', 'voice': 'a clear female alto', 'heard': 'female'},
        'choir': {'name': 'The women of the glen', 'voice': 'the Gaelic women\'s choir', 'heard': 'female'},
        'both': {'name': 'Ewan · Morag', 'heard': 'both'},
    }
    write(SONG / 'lyrics.json', {'title': {'en': 'Keep the Fire', 'gd': 'Cùm an Teine', 'id': 'Jagalah Api', 'zh': '守住炉火'},
                                 'sung': 'en', 'voices': voices, 'sections': sections, 'subs': ['id', 'zh']})
    for p in [SONG / 'lines.json', TAKE / 'lines.json']:
        write(p, rows)
    write(TAKE / 'request.json', {'duration_seconds': float(info['format']['duration']), 'source': 'producer-supplied Suno recording', 'model': None, 'musical_earcheck': 'human producer'})
    write(SONG / 'master-source.json', {
        'take': 'suno-final', 'source_path': str(a.source), 'sha256': digest, 'bytes': a.source.stat().st_size,
        'duration_seconds': float(info['format']['duration']), 'suno_comment': tags.get('comment'), 'embedded_lyrics': embedded,
        'arrangement_note': 'The sheet follows the Scribe transcript of the vocal stem. The final chorus drops two choir answers. The closing line moves into the final chorus. The outro sings its Gaelic line twice.',
        'voice_assignment': 'Intended roles from the lyric sheet. No automatic voice audit.',
    })
    (SONG / 'lyrics.md').write_text('# Cùm an Teine\n\nThe words as embedded in the recording. Indonesian and Chinese lines are in lines.json.\n\n' + embedded + '\n', encoding='utf-8')
    print(json.dumps({'sha256': digest, 'seconds': info['format']['duration'], 'lines': len(rows)}))


if __name__ == '__main__':
    main()
