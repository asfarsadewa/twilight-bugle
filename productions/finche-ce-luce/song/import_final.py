"""Import the producer's supplied Suno recording of Finché c'è luce. No music generation and no listening model.

  python productions/finche-ce-luce/song/import_final.py [--source <mp3>]

Checks that the words embedded in the MP3 match suno-lyrics.txt, copies the file unchanged into takes/suno-final,
and writes lyrics.json, lines.json, lyrics.md and master-source.json. Indonesian and English lines are below.
"""
from pathlib import Path
import argparse, hashlib, json, shutil, subprocess, unicodedata

SONG = Path(__file__).resolve().parent
TAKE = SONG / 'takes' / 'suno-final'

CHORUS = [
    ('Stone', 'Finché c\'è luce', 'matteo', 'Selama masih ada cahaya', 'As long as there is light'),
    ('', 'torna a casa!', 'choir', 'pulanglah!', 'come home!'),
    ('', 'finché c\'è luce', 'matteo', 'selama masih ada cahaya', 'as long as there is light'),
    ('', 'io resto qui', 'matteo', 'aku tetap di sini', 'I stay here'),
    ('', 'Sopra il mare nero', 'matteo', 'Di atas laut yang hitam', 'Above the black sea'),
    ('', 'giro la ruota', 'matteo', 'kuputar rodanya', 'I turn the wheel'),
    ('', 'finché c\'è luce...', 'matteo', 'selama masih ada cahaya...', 'as long as there is light...'),
    ('', 'torna a casa!', 'choir', 'pulanglah!', 'come home!'),
]
PRE = [
    ('', 'Gira la lanterna', 'both', 'Putarlah lentera', 'Turn the lantern'),
    ('', 'guarda il mare...', 'both', 'tataplah laut...', 'watch the sea...'),
]
# (section, label, rows). A row is (unused, Italian as sung, singer, Indonesian, English).
SECTIONS = [
    ('intro', 'Intro', []),
    ('v1', 'Verse 1', [
        ('', 'Pietra su pietra, mani nel vento,', 'matteo', 'Batu demi batu, tangan di tengah angin,', 'Stone upon stone, our hands in the wind,'),
        ('', 'alzammo la torre sopra lo scoglio.', 'matteo', 'kami dirikan menara di atas karang.', 'we raised the tower on the rock.'),
        ('', 'Ogni inverno il mare prendeva un figlio,', 'matteo', 'Setiap musim dingin laut mengambil seorang anak,', 'Every winter the sea took a son,'),
        ('', 'e noi giurammo: mai più nel buio.', 'matteo', 'dan kami bersumpah: tak lagi dalam gelap.', 'and we swore: never again in the dark.'),
    ]),
    ('v2', 'Verse 2', [
        ('', 'Io portavo l\'acqua, il pane, la calce,', 'lucia', 'Aku membawa air, roti, dan kapur,', 'I carried the water, the bread, the lime,'),
        ('', 'tu cantavi piano contro il freddo.', 'lucia', 'kau bernyanyi pelan melawan dingin.', 'you sang softly against the cold.'),
        ('', 'Nostro figlio dormiva in una cesta di corda', 'lucia', 'Anak kita tidur dalam keranjang tali', 'Our son slept in a basket of rope'),
        ('', 'sotto la prima fiamma accesa.', 'lucia', 'di bawah nyala api yang pertama.', 'beneath the first flame we lit.'),
    ]),
    ('pre1', 'Pre-chorus', PRE),
    ('ch1', 'Chorus', CHORUS),
    ('v3', 'Verse 3', [
        ('', 'Nino è cresciuto, ha le tue spalle,', 'lucia', 'Nino sudah besar, bahunya seperti bahumu,', 'Nino has grown, he has your shoulders,'),
        ('', 'ha il sale negli occhi e il mare nel petto.', 'lucia', 'garam di matanya, laut di dadanya.', 'salt in his eyes and the sea in his chest.'),
        ('', 'Ogni alba lo guardo partire con gli altri', 'lucia', 'Setiap fajar kulihat ia berangkat bersama yang lain', 'Every dawn I watch him leave with the others'),
        ('', 'e conto le vele, una per una.', 'lucia', 'dan kuhitung layarnya, satu demi satu.', 'and I count the sails, one by one.'),
    ]),
    ('v4', 'Verse 4', [
        ('', 'Pulisco il vetro, carico i pesi,', 'matteo', 'Kubersihkan kaca, kuisi pemberatnya,', 'I clean the glass, I wind the weights,'),
        ('', 'la catena scende tutta la notte.', 'matteo', 'rantainya turun sepanjang malam.', 'the chain goes down the whole night long.'),
        ('', 'Se la luce si ferma, il mare non perdona,', 'matteo', 'Jika cahaya berhenti, laut tak memaafkan,', 'If the light stops, the sea does not forgive,'),
        ('', 'lo so da quando ero bambino.', 'matteo', 'aku tahu sejak aku masih kecil.', 'I have known it since I was a boy.'),
    ]),
    ('pre2', 'Pre-chorus', PRE),
    ('ch2', 'Chorus', CHORUS),
    ('storm', 'Bridge: the storm', [
        ('', 'Notte di tempesta, la catena si spezza!', 'both', 'Malam badai, rantainya putus!', 'A night of storm, the chain snaps!'),
        ('', 'Gira, gira, gira!', 'choir', 'Putar, putar, putar!', 'Turn, turn, turn!'),
        ('', 'Le mani sulla ruota, Lucia porta l\'olio!', 'both', 'Tangan di roda, Lucia membawa minyak!', 'Hands on the wheel, Lucia brings the oil!'),
        ('', 'Gira, gira, gira!', 'choir', 'Putar, putar, putar!', 'Turn, turn, turn!'),
        ('', 'Una vela, due vele, dieci vele tornano,', 'both', 'Satu layar, dua layar, sepuluh layar kembali,', 'One sail, two sails, ten sails come home,'),
        ('', 'ma la vela di Nino non si vede.', 'both', 'tapi layar Nino tak terlihat.', 'but Nino\'s sail is nowhere to be seen.'),
    ]),
    ('break', 'Break', [
        ('', 'All\'alba il mare ha riportato la sua barca,', 'lucia', 'Saat fajar laut mengembalikan perahunya,', 'At dawn the sea brought back his boat,'),
        ('', 'vuota, leggera, sulla sabbia.', 'lucia', 'kosong, ringan, di atas pasir.', 'empty and light upon the sand.'),
    ]),
    ('ch3', 'Final chorus', [
        ('', 'Finché c\'è luce,', 'both', 'Selama masih ada cahaya,', 'As long as there is light,'),
        ('', 'torna a casa!', 'choir', 'pulanglah!', 'come home!'),
        ('', 'figlio di un\'altra,', 'both', 'anak ibu yang lain,', 'someone else\'s son,'),
        ('', 'io resto qui.', 'both', 'aku tetap di sini.', 'I stay here.'),
        ('', 'Anche se il mio', 'both', 'Meski anakku', 'Even though mine'),
        ('', 'non torna più,', 'both', 'tak akan pulang lagi,', 'will never come home,'),
        ('', 'finché c\'è luce...', 'both', 'selama masih ada cahaya...', 'as long as there is light...'),
        ('', 'torna a casa!', 'choir', 'pulanglah!', 'come home!'),
    ]),
    ('ch4', 'Final chorus repeat', [
        ('', 'Finché c\'è luce,', 'both', 'Selama masih ada cahaya,', 'As long as there is light,'),
        ('', 'torna a casa!', 'choir', 'pulanglah!', 'come home!'),
        ('', 'finché c\'è luce,', 'both', 'selama masih ada cahaya,', 'as long as there is light,'),
        ('', 'io resto qui...', 'both', 'aku tetap di sini...', 'I stay here...'),
    ]),
    ('outro', 'Outro', [
        ('', 'Accendi, Matteo. È sera.', 'lucia', 'Nyalakan, Matteo. Sudah malam.', 'Light it, Matteo. It is evening.'),
    ]),
]


def norm(s):
    s = s.replace('Choir:', '').replace('Lucia, whispered', '')
    return ''.join(c for c in unicodedata.normalize('NFKD', s.lower()) if c.isalpha())


def write(p, x):
    p.write_text(json.dumps(x, ensure_ascii=False, indent=1) + '\n', encoding='utf-8')


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--source', type=Path, default=Path('C:/Users/asfar/Downloads/Finch\u00e9 c\u2019\u00e8 luce.mp3'))
    a = ap.parse_args()
    info = json.loads(subprocess.check_output(['ffprobe', '-v', 'error', '-show_format', '-of', 'json', str(a.source)], encoding='utf-8'))
    tags = info['format']['tags']
    embedded = tags.get('lyrics-eng', '')
    canonical = (SONG / 'suno-lyrics.txt').read_text(encoding='utf-8')
    clean = lambda t: [norm(s) for s in t.splitlines() if s.strip() and not s.strip().startswith('[')]
    assert clean(embedded) == clean(canonical), 'The recording embeds other words. Inspect it before importing.'

    rows, sections = [], []
    for sid, label, items in SECTIONS:
        sec = {'id': sid, 'label': label}
        if not items:
            sec['note'] = 'instrumental'
        else:
            sec['lines'] = [{'who': w, 'it': it, 'id': idn, 'en': en} for _, it, w, idn, en in items]
            rows += [{'section': sid, **l, 'sung': l['it']} for l in sec['lines']]
        sections.append(sec)
    sung = [norm(r['sung']) for r in rows]
    assert sung == clean(canonical), 'The sheet does not follow the handoff line for line.'

    TAKE.mkdir(parents=True, exist_ok=True)
    digest = hashlib.sha256(a.source.read_bytes()).hexdigest()
    shutil.copy2(a.source, TAKE / 'take.mp3')
    if not (TAKE / 'original.wav').exists():
        subprocess.run(['ffmpeg', '-v', 'error', '-i', str(a.source), '-ar', '44100', str(TAKE / 'original.wav')], check=True)
    voices = {
        'matteo': {'name': 'Matteo', 'voice': 'a warm, dark baritone', 'heard': 'male'},
        'lucia': {'name': 'Lucia', 'voice': 'a clear, aching mezzo-soprano', 'heard': 'female'},
        'choir': {'name': 'Il paese', 'voice': 'the mixed choir of the village', 'heard': 'both'},
        'both': {'name': 'Matteo · Lucia', 'heard': 'both'},
    }
    write(SONG / 'lyrics.json', {'title': {'it': 'Finché c\'è luce', 'en': 'As Long as There Is Light', 'id': 'Selama Masih Ada Cahaya', 'zh': '只要还有光'},
                                 'sung': 'it', 'voices': voices, 'sections': sections, 'subs': ['it', 'id']})
    for p in [SONG / 'lines.json', TAKE / 'lines.json']:
        write(p, rows)
    write(TAKE / 'request.json', {'duration_seconds': float(info['format']['duration']), 'source': 'producer-supplied Suno recording', 'model': None, 'musical_earcheck': 'human producer'})
    write(SONG / 'master-source.json', {
        'take': 'suno-final', 'source_path': str(a.source), 'sha256': digest, 'bytes': a.source.stat().st_size,
        'duration_seconds': float(info['format']['duration']), 'suno_comment': tags.get('comment'), 'embedded_lyrics': embedded,
        'voice_assignment': 'Intended roles from the lyric sheet. No automatic voice audit.',
    })
    (SONG / 'lyrics.md').write_text('# Finché c\'è luce\n\nItalian source lyrics. Indonesian and English lines are in lines.json.\n\n' + canonical, encoding='utf-8')
    print(json.dumps({'sha256': digest, 'seconds': info['format']['duration'], 'lines': len(rows)}))


if __name__ == '__main__':
    main()
