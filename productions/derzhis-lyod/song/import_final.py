"""Import the producer's supplied Suno recording of Держись, лёд. No music generation and no listening model.

  python productions/derzhis-lyod/song/import_final.py [--source <mp3>]

The words embedded in the MP3 repeat some lines under doubled section tags. The Scribe transcript of the vocal stem
shows the sung order. The choir calls "Держись! Держись!" in the bridge. The outro sings "Ещё один рейс" twice, with
the choir on "Держись". This sheet follows the recording. The script refuses a file whose embedded words do not hold every sheet
line. It copies the file unchanged into takes/suno-final and writes lyrics.json, lines.json, lyrics.md and
master-source.json.
"""
from pathlib import Path
import argparse, hashlib, json, shutil, subprocess, unicodedata

SONG = Path(__file__).resolve().parent
TAKE = SONG / 'takes' / 'suno-final'

# Each Russian line once: (Indonesian, English).
T = {
    'Сто двадцать пять граммов хлеба': ('Seratus dua puluh lima gram roti', 'A hundred and twenty-five grams of bread'),
    'Мама делит на троих': ('Ibu membaginya untuk bertiga', 'Mother divides it among three'),
    'Свой кусок кладёт Машутке': ('Bagiannya sendiri ia berikan pada Masha kecil', 'She gives her own piece to little Masha'),
    '«Я не голодна», — говорит': ('"Aku tidak lapar," katanya', '"I am not hungry," she says'),
    'По озеру, по белой ночи': ('Melintasi danau, menembus malam putih', 'Across the lake, through the white night'),
    'Идёт колонна без огней': ('Konvoi berjalan tanpa lampu', 'The convoy moves with no lights'),
    'Мешки муки — туда, в блокаду': ('Karung tepung ke sana, ke kota yang terkepung', 'Sacks of flour go in, to the besieged city'),
    'Обратно — лица детей': ('Kembalinya, wajah anak-anak', 'Coming back, the faces of children'),
    'Дверь открыта, руки на руле': ('Pintu terbuka, tangan di kemudi', 'The door open, hands on the wheel'),
    'Дверь открыта': ('Pintu terbuka', 'The door open'),
    'Фонари горят на льду': ('Lentera menyala di atas es', 'Lanterns burn on the ice'),
    'Горят, горят': ('Menyala, menyala', 'Burning, burning'),
    'Держись, лёд, держись': ('Bertahanlah, es, bertahanlah', 'Hold, ice, hold'),
    'Держись, держись': ('Bertahanlah, bertahanlah', 'Hold on, hold on'),
    'Ещё один рейс, ещё одна жизнь': ('Satu perjalanan lagi, satu nyawa lagi', 'One more run, one more life'),
    'Я вернусь за тобой, только дождись': ('Aku akan kembali menjemputmu, tunggulah', 'I will come back for you, just wait'),
    'Я вернулся в нашу комнату': ('Aku kembali ke kamar kami', 'I came back to our room'),
    'Лампа больше не горит': ('Lampu tak lagi menyala', 'The lamp burns no more'),
    'Мама спит под старой шалью': ('Ibu tertidur di bawah selendang tuanya', 'Mother sleeps under her old shawl'),
    'Хлеб нетронутый лежит': ('Rotinya tergeletak tak tersentuh', 'Her bread lies untouched'),
    'Я закутал Машу в одеяло': ('Kubungkus Masha dengan selimut', 'I wrapped Masha in a blanket'),
    'И повёз по льду, по льду': ('Dan kubawa melintasi es, melintasi es', 'And drove her over the ice, over the ice'),
    'Маша, не смотри назад, держись': ('Masha, jangan menoleh ke belakang, bertahanlah', 'Masha, do not look back, hold on'),
    'Вода на льду, весна идёт': ('Air di atas es, musim semi datang', 'Water on the ice, spring is coming'),
    'Держись!': ('Bertahanlah!', 'Hold!'),
    'Держись! Держись!': ('Bertahanlah! Bertahanlah!', 'Hold! Hold!'),
    'Лёд трещит, а город ждёт': ('Es berderak, dan kota menunggu', 'The ice cracks, and the city waits'),
    'Я довёз её до берега': ('Kuantar dia sampai ke tepi', 'I brought her to the shore'),
    'И развернул машину назад': ('Lalu kuputar truk itu kembali', 'And turned the truck back'),
    'Ещё один рейс': ('Satu perjalanan lagi', 'One more run'),
    'Я помню свет твоей кабины': ('Aku ingat cahaya kabinmu', 'I remember the light of your cab'),
    'Ты махал мне рукой с той стороны': ('Kau melambai padaku dari seberang', 'You waved to me from the far side'),
    'В апреле лёд не выдержал': ('Di bulan April es tak bertahan', 'In April the ice did not hold'),
    'И не пустил тебя домой': ('Dan tak membiarkanmu pulang', 'And did not let you come home'),
    'Держись, брат, держись': ('Bertahanlah, kakak, bertahanlah', 'Hold on, brother, hold on'),
    'Ты вернулся за мной, а я жду тебя всю жизнь': ('Kau kembali menjemputku, dan aku menantimu seumur hidup', 'You came back for me, and I wait for you all my life'),
}

A, M, C, B = 'alyosha', 'masha', 'choir', 'both'
HOOK, ANS, RUN = 'Держись, лёд, держись', 'Держись, держись', 'Ещё один рейс, ещё одна жизнь'
SECTIONS = [
    ('intro', 'Intro', []),
    ('v1', 'Verse 1', [('Сто двадцать пять граммов хлеба', A), ('Мама делит на троих', A), ('Свой кусок кладёт Машутке', A), ('«Я не голодна», — говорит', A)]),
    ('v2', 'Verse 2', [('По озеру, по белой ночи', A), ('Идёт колонна без огней', A), ('Мешки муки — туда, в блокаду', A), ('Обратно — лица детей', A)]),
    ('pre', 'The convoy', [('Дверь открыта, руки на руле', A), ('Дверь открыта', C), ('Фонари горят на льду', A), ('Горят, горят', C)]),
    ('ch1', 'Chorus', [(HOOK, A), (ANS, C), (RUN, A), (HOOK, A), (ANS, C), ('Я вернусь за тобой, только дождись', A)]),
    ('v3', 'Verse 3', [('Я вернулся в нашу комнату', A), ('Лампа больше не горит', A), ('Мама спит под старой шалью', A), ('Хлеб нетронутый лежит', A),
                       ('Я закутал Машу в одеяло', A), ('И повёз по льду, по льду', A)]),
    ('ch2', 'Chorus', [(HOOK, A), (ANS, C), (RUN, A), (HOOK, A), (ANS, C), ('Маша, не смотри назад, держись', A)]),
    ('thaw', 'Bridge: the thaw', [('Вода на льду, весна идёт', A), ('Держись! Держись!', C), ('Лёд трещит, а город ждёт', A), ('Я довёз её до берега', A),
                                  ('И развернул машину назад', A), ('Держись!', C), ('Ещё один рейс', A)]),
    ('break', 'Break', []),
    ('v4', 'Verse 4', [('Я помню свет твоей кабины', M), ('Ты махал мне рукой с той стороны', M), ('В апреле лёд не выдержал', M), ('И не пустил тебя домой', M)]),
    ('ch3', 'Final chorus', [(HOOK, B), (ANS, C), (RUN, B), ('Держись, брат, держись', B), (ANS, C), ('Ты вернулся за мной, а я жду тебя всю жизнь', M)]),
    ('outro', 'Outro', [('Ещё один рейс', M), ('Держись!', C), ('Ещё один рейс', M), ('Держись!', C)]),
]


def norm(s):
    return ''.join(c for c in unicodedata.normalize('NFKC', s).lower() if c.isalnum())


def write(p, x):
    p.write_text(json.dumps(x, ensure_ascii=False, indent=1) + '\n', encoding='utf-8')


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--source', type=Path, default=Path('C:/Users/asfar/Downloads/Держись, лёд (1).mp3'))
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
            sec['lines'] = [{'who': w, 'ru': ru, 'id': T[ru][0], 'en': T[ru][1]} for ru, w in items]
            rows += [{'section': sid, **l, 'sung': l['ru']} for l in sec['lines']]
        sections.append(sec)
    assert {norm(r['sung']) for r in rows} <= set(sung_embedded), 'A sheet line is not in the embedded words.'

    TAKE.mkdir(parents=True, exist_ok=True)
    digest = hashlib.sha256(a.source.read_bytes()).hexdigest()
    shutil.copy2(a.source, TAKE / 'take.mp3')
    if not (TAKE / 'original.wav').exists():
        subprocess.run(['ffmpeg', '-v', 'error', '-i', str(a.source), '-ar', '44100', str(TAKE / 'original.wav')], check=True)
    voices = {
        'alyosha': {'name': 'Алёша', 'voice': 'a warm young male baritone', 'heard': 'male'},
        'masha': {'name': 'Маша', 'voice': 'a clear grown female soprano', 'heard': 'female'},
        'choir': {'name': 'Хор', 'voice': 'the men\'s and women\'s choirs', 'heard': 'both'},
        'both': {'name': 'Маша · Алёша', 'heard': 'both'},
    }
    write(SONG / 'lyrics.json', {'title': {'ru': 'Держись, лёд', 'en': 'Hold, Ice', 'id': 'Bertahanlah, Es', 'zh': '冰啊，撑住'},
                                 'sung': 'ru', 'voices': voices, 'sections': sections, 'subs': ['ru', 'id']})
    for p in [SONG / 'lines.json', TAKE / 'lines.json']:
        write(p, rows)
    write(TAKE / 'request.json', {'duration_seconds': float(info['format']['duration']), 'source': 'producer-supplied Suno recording', 'model': None, 'musical_earcheck': 'human producer'})
    write(SONG / 'master-source.json', {
        'take': 'suno-final', 'source_path': str(a.source), 'sha256': digest, 'bytes': a.source.stat().st_size,
        'duration_seconds': float(info['format']['duration']), 'suno_comment': tags.get('comment'), 'embedded_lyrics': embedded,
        'arrangement_note': 'The embedded words repeat lines under doubled section tags. The Scribe transcript of the vocal stem confirms the sung order. The bridge has a double choir call. The outro sings its last line twice.',
        'voice_assignment': 'Intended roles from the lyric sheet. No automatic voice audit.',
    })
    (SONG / 'lyrics.md').write_text('# Держись, лёд\n\nRussian lyrics as embedded in the recording. Indonesian and English lines are in lines.json.\n\n' + embedded + '\n', encoding='utf-8')
    print(json.dumps({'sha256': digest, 'seconds': info['format']['duration'], 'lines': len(rows)}))


if __name__ == '__main__':
    main()
