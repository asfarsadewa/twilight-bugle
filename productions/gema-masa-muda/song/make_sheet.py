#!/usr/bin/env python3
"""Write the song sheets of Gema Masa Muda: lyrics.json and lines.json, with Chinese and English translations.

  python productions/gema-masa-muda/song/make_sheet.py

The song came ready as an MP3, so no Lyria step runs. tools/listen.py times the lines on the take.
"""
import json, os

HERE = os.path.dirname(os.path.abspath(__file__))
WHO = "dimas"

CHORUS1 = [
    ("Ah gema masa muda bergulung di dada", "啊 青春的回声在胸口翻涌", "Ah, the echo of our youth rolls in my chest"),
    ("Saat kupanggil namamu langit pun makin dalam", "我一喊你的名字 天空便更深远", "When I call your name, the sky grows deeper"),
    ("Ah kita berlari tak bertanya jarak", "啊 我们奔跑 从不问路有多远", "Ah, we ran and never asked how far"),
    ("Lutut pun terluka tetap tertawa bilang tak sakit", "膝盖擦破了 还笑着说不疼", "Our knees were scraped, and we laughed and said it did not hurt"),
    ("Ah semua pagi dan senja penuh tanda tanya", "啊 每个清晨与黄昏 都写满了问号", "Ah, every morning and every dusk full of questions"),
    ("Ternyata surat untuk diriku di masa depan", "原来都是 写给未来自己的信", "Turned out to be letters to my future self"),
    ("(Oh) gema masa muda", "（哦）青春的回声", "(Oh) the echo of our youth"),
    ("Masih bernyanyi dalam hati", "仍在心里歌唱", "Still singing in my heart"),
]
SECTIONS = [
    ("intro", "Intro", None),
    ("v1", "Verse 1", [
        ("Meja kayu tua", "那张旧木课桌", "The old wooden desk"),
        ("Penuh coretan nama kita berdua", "刻满了我们俩的名字", "Covered with our two names, scratched in"),
        ("Pulang sekolah", "放学回家", "After school"),
        ("Lapangan berdebu keemasan di mata", "尘土飞扬的操场 在眼里镀上金光", "The dusty field turned gold in our eyes"),
        ("Saku yang sobek", "磨破的衣兜", "From a torn pocket"),
        ("Bungkus permen dan mimpi kecil berjatuhan", "糖纸和小小的梦 一路散落", "Candy wrappers and small dreams fell out"),
        ("Saat itu kira", "那时总以为", "Back then we thought"),
        ("Dewasa tersimpan di soal esok hari", "长大 就藏在明天的考卷里", "Growing up was hidden in tomorrow's test"),
    ]),
    ("ch1", "Chorus", CHORUS1),
    ("v2", "Verse 2", [
        ("Lorong yang usang", "斑驳的走廊", "The worn corridor"),
        ("Jejak langkah jadi irama menggema", "脚步声 成了回荡的节拍", "Our footsteps became an echoing rhythm"),
        ("Debu kapur putih", "白色的粉笔灰", "White chalk dust"),
        ("Tersapu ke balik awan yang begitu lembut", "被拂进那样柔软的云里", "Swept away behind clouds so soft"),
        ("Diam menyimpan rasa", "沉默里藏着心事", "Silently keeping a feeling"),
        ("Sampul surat pun tak berani kutulis lengkap", "信封上的字 都不敢写完", "I did not dare to finish the envelope"),
        ("Satu kata “semangat”", "一句“加油”", "One word: “semangat”, keep going"),
        ("Kita anggap janji yang tak akan berakhir", "我们当成了永不落幕的约定", "We took it as a promise that would never end"),
    ]),
    ("ch2", "Chorus", CHORUS1),
    ("bridge", "Bridge", [
        ("Siapa lebih dulu", "是谁先", "Who was the first"),
        ("Belajar menahan air mata yang jatuh", "学会了忍住眼泪", "To learn to hold back falling tears"),
        ("Siapa yang pergi jauh", "是谁走得那么远", "Who went so far away"),
        ("Bahkan bayangannya pun tak dapat kukejar", "远得连影子都追不上", "That I could not catch even their shadow"),
        ("Namun lihatlah saat malam pekat", "可是你看 在最深的夜里", "But look, when the night is darkest"),
        ("Di dalam hati terang satu lapangan bersinar", "心里有一片操场 依然闪亮", "In my heart one field still shines bright"),
    ]),
    ("ch3", "Final chorus", [
        ("Ah gema masa muda kini pun terbangun", "啊 青春的回声 此刻苏醒", "Ah, the echo of our youth wakes now"),
        ("Setiap luka di jalan bermekaran jadi pemandang", "路上的每道伤 都开成了风景", "Every wound along the road blooms into a view"),
        ("Ah jatuh dan terbentur jadi sebuah lagu", "啊 跌跌撞撞 都成了一首歌", "Ah, every fall and every bruise became a song"),
        ("Kunyanyikan untuk diriku yang keras kepala dan ceroboh", "唱给那个倔强又莽撞的自己", "I sing it to my stubborn, careless self"),
        ("Ah meski dunia riuh sendu kelam", "啊 纵然世界喧嚣 忧伤又昏暗", "Ah, though the world is loud and sad and dark"),
        ("Tetap kudengar jawaban pertama yang memanggil", "我仍听见 最初那声呼唤的回应", "I still hear the first answer calling"),
        ("(Oh) gema masa muda", "（哦）青春的回声", "(Oh) the echo of our youth"),
        ("Menuntunku maju satu demi satu langkah", "领着我 一步一步向前", "Leading me forward, one step at a time"),
    ]),
    ("outro", "Outro", None),
]


def write(path, obj):
    json.dump(obj, open(path, "w", encoding="utf-8", newline="\n"), ensure_ascii=False, indent=1)


def main():
    sections, lines = [], []
    for sid, label, rows in SECTIONS:
        sec = {"id": sid, "label": label}
        if rows is None:
            sec["note"] = "instrumental"
        else:
            sec["lines"] = [{"who": WHO, "id": a, "zh": b, "en": c} for a, b, c in rows]
            lines += [{"section": sid, "who": WHO, "id": a, "zh": b, "en": c, "sung": a} for a, b, c in rows]
        sections.append(sec)
    write(os.path.join(HERE, "lyrics.json"), {
        "title": {"id": "Gema Masa Muda", "zh": "青春回声", "en": "Echo of Our Youth"},
        "sung": "id",
        "voices": {WHO: {"name": "Dimas", "voice": "the grown man who remembers", "heard": "male", "glyph": "g-moon", "cls": "star", "part": "the one who remembers"}},
        "sections": sections,
        "subs": ["id", "zh"],
        "about": "A grown man remembers his school friends. Their youth still echoes in him.",
    })
    write(os.path.join(HERE, "lines.json"), lines)
    print(len(lines), "lines")


if __name__ == "__main__":
    main()
