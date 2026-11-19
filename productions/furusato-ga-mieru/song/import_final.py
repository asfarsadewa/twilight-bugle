"""Import the producer's supplied Suno recording of ふるさとが見える. No music generation and no listening model.

  python productions/furusato-ga-mieru/song/import_final.py [--source <mp3>]

The words embedded in the MP3 repeat some lines under extra section tags. The Scribe transcript shows that the singers do
not sing those repeats. The recording follows the handoff, and Hana sings the first line of verse 3 twice. This sheet
follows the recording. The embedded words also end chorus 1 with "妹は そこで 眠った". The singers sing "帰ろう 帰ろう" there. The script refuses a
file whose embedded words do not hold every sheet line. It copies the file unchanged into takes/suno-final and writes lyrics.json, lines.json,
lyrics.md and master-source.json.
"""
from pathlib import Path
import argparse, hashlib, json, shutil, subprocess, unicodedata

SONG = Path(__file__).resolve().parent
TAKE = SONG / 'takes' / 'suno-final'

# Each Japanese line once: (Indonesian, English).
T = {
    '十二の春に 峠を越えた': ('Musim semi usia dua belas, kuseberangi celah gunung', 'The spring I was twelve, I crossed the pass'),
    'わらじの紐を きつく結んで': ('Kuikat tali sandal jeramiku erat-erat', 'Tying my straw sandals tight'),
    '糸を引く手は まだ小さくて': ('Tangan penarik benang masih begitu kecil', 'The hands that would draw the thread were still small'),
    'ふるさとの山を 何度も振り返った': ('Berkali-kali kutoleh gunung kampung halaman', 'Again and again I looked back at the mountains of home'),
    '湯気の中で 繭が踊る': ('Di tengah uap, kepompong menari', 'In the steam, the cocoons dance'),
    '指が割れても 糸は切らない': ('Meski jariku pecah, benang tak kuputus', 'Even when my fingers split, I never break the thread'),
    '月に一度の 手紙に書いた': ('Dalam surat sebulan sekali kutulis', 'In my letter, once a month, I wrote'),
    '「お米を買って 弟たちに」': ('"Belilah beras untuk adik-adikku"', '"Buy rice for my little brothers"'),
    '引け 引け 白い糸': ('Tarik, tarik, benang putih', 'Pull, pull, the white thread'),
    'ああ ふるさとが見える': ('Ah, kampung halaman terlihat', 'Ah, I can see home'),
    '見える 見える': ('Terlihat, terlihat', 'I see it, I see it'),
    '雪の向こうに 母さんの灯': ('Di balik salju, pelita ibu', 'Beyond the snow, Mother\'s lamp'),
    '妹は そこで 眠った': ('Di sana adikku tertidur', 'There, my sister fell asleep'),
    '咳が止まらず 糸が赤く染まる': ('Batuk tak berhenti, benang memerah', 'The cough will not stop, and the thread turns red'),
    '工場の門で 名前を消された': ('Di gerbang pabrik, namaku dicoret', 'At the mill gate, my name was struck out'),
    '戸板に乗せられ 峠の下へ': ('Dibaringkan di papan pintu, dibawa ke kaki celah', 'Laid on a door board, carried to the foot of the pass'),
    '兄さんの声が 雪の中で聞こえた': ('Kudengar suara kakak di tengah salju', 'I heard my brother\'s voice in the snow'),
    '知らせを受けて 峠を走った': ('Begitu kabar tiba, aku berlari melintasi celah', 'When word came, I ran over the pass'),
    '吹雪の中で 妹を背負った': ('Di tengah badai salju kugendong adikku', 'In the blizzard I took my sister on my back'),
    '「軽くなったな」 笑ってみせた': ('"Kau jadi ringan," kataku sambil tersenyum', '"You\'ve grown light," I said, and made myself smile'),
    '泣いたら足が 止まりそうだった': ('Kalau aku menangis, kakiku akan berhenti', 'If I had cried, my feet would have stopped'),
    '登れ 登れ 白い峠': ('Daki, daki, celah yang putih', 'Climb, climb, the white pass'),
    '帰ろう 帰ろう': ('Ayo pulang, ayo pulang', 'Let\'s go home, let\'s go home'),
    '吹雪よ止まれ 夜よ明けろ': ('Badai, berhentilah; malam, segeralah fajar', 'Blizzard, stop; night, give way to dawn'),
    '登れ 登れ': ('Daki, daki', 'Climb, climb'),
    '背中の妹が 小さく笑う': ('Di punggungku adikku tersenyum kecil', 'On my back, my sister smiles a little'),
    '一歩 また一歩 峠の上へ': ('Selangkah, selangkah lagi, ke puncak celah', 'One step, and one more, to the top of the pass'),
    '東の空が 白くなる': ('Langit timur memutih', 'The eastern sky turns white'),
    '兄さん 降ろして': ('Kakak, turunkan aku', 'Brother, put me down'),
    'ああ… 見える': ('Ah... terlihat', 'Ah... I can see it'),
    '軽い体を 背負って 降りた': ('Kugendong tubuhnya yang ringan, turun gunung', 'I carried her light body down'),
    '春が来て 末の妹が わらじを結ぶ': ('Musim semi tiba, adik bungsu mengikat sandal jeraminya', 'Spring came, and my youngest sister ties her straw sandals'),
    '峠の雪は まだ白い': ('Salju di celah masih putih', 'The snow on the pass is still white'),
}

H, K, C, B = 'hana', 'kichi', 'choir', 'both'
# The sung order, as embedded in the MP3: (section, label, [(Japanese, singer), ...]).
SECTIONS = [
    ('intro', 'Intro', []),
    ('v1', 'Verse 1', [('十二の春に 峠を越えた', H), ('わらじの紐を きつく結んで', H), ('糸を引く手は まだ小さくて', H), ('ふるさとの山を 何度も振り返った', H)]),
    ('v2', 'Verse 2', [('湯気の中で 繭が踊る', H), ('指が割れても 糸は切らない', H), ('月に一度の 手紙に書いた', H), ('「お米を買って 弟たちに」', H)]),
    ('pre1', 'The mill song', [('引け 引け 白い糸', C), ('引け 引け 白い糸', C)]),
    ('ch1', 'Chorus', [('ああ ふるさとが見える', H), ('見える 見える', C), ('雪の向こうに 母さんの灯', H), ('ああ ふるさとが見える', H), ('帰ろう 帰ろう', C)]),
    ('v3', 'Verse 3', [('咳が止まらず 糸が赤く染まる', H), ('咳が止まらず 糸が赤く染まる', H), ('工場の門で 名前を消された', H), ('戸板に乗せられ 峠の下へ', H), ('兄さんの声が 雪の中で聞こえた', H)]),
    ('v4', 'Verse 4', [('知らせを受けて 峠を走った', K), ('吹雪の中で 妹を背負った', K), ('「軽くなったな」 笑ってみせた', K), ('泣いたら足が 止まりそうだった', K)]),
    ('pre2', 'The climbing song', [('登れ 登れ 白い峠', C), ('登れ 登れ 白い峠', C)]),
    ('ch2', 'Chorus', [('ああ ふるさとが見える', B), ('見える 見える', C), ('雪の向こうに 母さんの灯', B), ('ああ ふるさとが見える', B), ('帰ろう 帰ろう', C)]),
    ('storm', 'Bridge: the blizzard climb', [('吹雪よ止まれ 夜よ明けろ', K), ('登れ 登れ', C), ('背中の妹が 小さく笑う', K), ('登れ 登れ', C), ('一歩 また一歩 峠の上へ', K), ('東の空が 白くなる', K)]),
    ('break', 'Break', [('兄さん 降ろして', H), ('ああ… 見える', H)]),
    ('ch3', 'Final chorus', [('ああ ふるさとが見える', H), ('見える 見える', C), ('雪の向こうに 母さんの灯', H), ('ああ ふるさとが見える', K), ('妹は そこで 眠った', K)]),
    ('ch4', 'Final chorus repeat', [('ああ ふるさとが見える', K), ('帰ろう 帰ろう', C), ('軽い体を 背負って 降りた', K)]),
    ('outro', 'Outro', [('春が来て 末の妹が わらじを結ぶ', K), ('峠の雪は まだ白い', K)]),
]


def norm(s):
    return ''.join(c for c in unicodedata.normalize('NFKC', s) if c.isalnum())


def write(p, x):
    p.write_text(json.dumps(x, ensure_ascii=False, indent=1) + '\n', encoding='utf-8')


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--source', type=Path, default=Path('C:/Users/asfar/Downloads/ふるさとが見える.mp3'))
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
            sec['lines'] = [{'who': w, 'ja': ja, 'id': T[ja][0], 'en': T[ja][1]} for ja, w in items]
            rows += [{'section': sid, **l, 'sung': l['ja']} for l in sec['lines']]
        sections.append(sec)
    assert {norm(r['sung']) for r in rows} <= set(sung_embedded), 'A sheet line is not in the embedded words.'

    TAKE.mkdir(parents=True, exist_ok=True)
    digest = hashlib.sha256(a.source.read_bytes()).hexdigest()
    shutil.copy2(a.source, TAKE / 'take.mp3')
    if not (TAKE / 'original.wav').exists():
        subprocess.run(['ffmpeg', '-v', 'error', '-i', str(a.source), '-ar', '44100', str(TAKE / 'original.wav')], check=True)
    voices = {
        'hana': {'name': 'Hana', 'voice': 'a clear, fragile young female voice', 'heard': 'female'},
        'kichi': {'name': 'Kichi', 'voice': 'a deep, warm male voice', 'heard': 'male'},
        'choir': {'name': '女工たち', 'voice': 'the women\'s choir of the mill', 'heard': 'female'},
        'both': {'name': 'Hana · Kichi', 'heard': 'both'},
    }
    write(SONG / 'lyrics.json', {'title': {'ja': 'ふるさとが見える', 'en': 'I Can See Home', 'id': 'Kampung Halaman Terlihat', 'zh': '看得见故乡'},
                                 'sung': 'ja', 'voices': voices, 'sections': sections, 'subs': ['ja', 'id']})
    for p in [SONG / 'lines.json', TAKE / 'lines.json']:
        write(p, rows)
    write(TAKE / 'request.json', {'duration_seconds': float(info['format']['duration']), 'source': 'producer-supplied Suno recording', 'model': None, 'musical_earcheck': 'human producer'})
    write(SONG / 'master-source.json', {
        'take': 'suno-final', 'source_path': str(a.source), 'sha256': digest, 'bytes': a.source.stat().st_size,
        'duration_seconds': float(info['format']['duration']), 'suno_comment': tags.get('comment'), 'embedded_lyrics': embedded,
        'arrangement_note': 'The embedded words repeat lines under extra section tags. The recording follows the handoff. Hana sings the first line of verse 3 twice. The Scribe transcript confirms the sung order.',
        'voice_assignment': 'Intended roles from the lyric sheet. No automatic voice audit.',
    })
    (SONG / 'lyrics.md').write_text('# ふるさとが見える\n\nJapanese lyrics as embedded in the recording. Indonesian and English lines are in lines.json.\n\n' + embedded + '\n', encoding='utf-8')
    print(json.dumps({'sha256': digest, 'seconds': info['format']['duration'], 'lines': len(rows)}))


if __name__ == '__main__':
    main()
