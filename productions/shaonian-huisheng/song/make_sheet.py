#!/usr/bin/env python3
"""Write the song sheets of 少年回声: lyrics.json and lines.json, with pinyin, Indonesian and English lines.

  python productions/shaonian-huisheng/song/make_sheet.py

The song came ready as an MP3. No Lyria step runs. tools/listen.py times the lines on the take.
"""
import json, os
from pypinyin import Style, pinyin

HERE = os.path.dirname(os.path.abspath(__file__))
WHO = "xiaoyu"

CHORUS = [
    ("啊　少年的回声在胸口翻腾", "Ah, gema masa muda bergolak di dada", "Ah, the echo of our boyhood surges in my chest"),
    ("一喊你的名字　天空都变得更深", "Saat kupanggil namamu, langit pun makin dalam", "When I call your name, the whole sky grows deeper"),
    ("啊　奔跑的我们从不问远近", "Ah, kita berlari tanpa bertanya jauh dekat", "Ah, we ran and never asked how near or far"),
    ("摔伤了膝盖　却笑着说不疼", "Lutut terluka, tapi tertawa bilang tak sakit", "We scraped our knees, and laughed, and said it did not hurt"),
    ("啊　那些没有答案的清晨黄昏", "Ah, pagi dan senja yang tak berjawab", "Ah, all those mornings and dusks without answers"),
    ("原来是给未来的自己一封信", "Ternyata sepucuk surat untuk diriku kelak", "Were a letter to the self I would become"),
    ("（喔）少年的回声", "(Oh) gema masa muda", "(Oh) the echo of our boyhood"),
    ("还在心里合唱不停", "Masih bernyanyi bersama di dalam hati", "Still singing together in my heart"),
]
SECTIONS = [
    ("intro", "Intro", None),
    ("v1", "Verse 1", [
        ("木头课桌", "Meja kayu sekolah", "The wooden school desk"),
        ("刻满我们乱写的名字", "Penuh nama kita yang tergores asal", "Carved all over with the names we scrawled"),
        ("放学以后", "Sepulang sekolah", "After school"),
        ("球场尘土飞成一片金色", "Debu lapangan beterbangan jadi emas", "The dust of the court flew up in a cloud of gold"),
        ("口袋破了", "Saku yang robek", "A pocket tore open"),
        ("糖纸和小小的梦掉了一地", "Bungkus permen dan mimpi kecil berserakan", "Candy wrappers and little dreams spilled on the ground"),
        ("那时以为", "Dulu kukira", "Back then we thought"),
        ("长大就在明天的习题里", "Dewasa ada di soal latihan esok hari", "Growing up was waiting in tomorrow's homework"),
    ]),
    ("ch1", "Chorus", CHORUS),
    ("v2", "Verse 2", [
        ("老旧走廊", "Lorong tua", "The old corridor"),
        ("脚步踏出回荡的节奏", "Langkah kaki jadi irama yang menggema", "Our footsteps beat out an echoing rhythm"),
        ("黑板粉尘", "Debu kapur papan tulis", "Chalk dust from the blackboard"),
        ("飞在窗外柔软的云后", "Terbang ke balik awan lembut di luar jendela", "Flew behind the soft clouds outside the window"),
        ("偷偷喜欢", "Diam-diam menyukai", "A secret liking"),
        ("连信封都不敢写完整", "Bahkan amplop pun tak berani kutulis lengkap", "I did not even dare to finish the envelope"),
        ("一句“加油”", "Satu kata “semangat”", "One word: “jiayou”, keep going"),
        ("就当成永远的约定", "Kita anggap janji untuk selamanya", "We took it as a promise for ever"),
    ]),
    ("ch2", "Chorus", CHORUS),
    ("bridge", "Bridge", [
        ("是谁先学会　不再轻易流泪", "Siapa yang lebih dulu belajar tak mudah menangis", "Who was the first to learn not to cry so easily"),
        ("是谁先走远　连背影都追不回", "Siapa yang lebih dulu pergi jauh, punggungnya pun tak terkejar", "Who was the first to go so far that I could not catch even their back"),
        ("但你看　每当夜太黑", "Tapi lihatlah, setiap malam terlalu gelap", "But look, whenever the night is too dark"),
        ("心里却亮起　一整片操场的光辉", "Di hati menyala cahaya seluas lapangan", "A whole playground of light shines in my heart"),
    ]),
    ("ch3", "Final chorus", [
        ("啊　少年的回声此刻被唤醒", "Ah, gema masa muda kini terbangun", "Ah, the echo of our boyhood wakes this moment"),
        ("一路上的伤疤都盛开成风景", "Setiap bekas luka di jalan mekar jadi pemandangan", "Every scar along the road has bloomed into a view"),
        ("啊　跌跌撞撞唱成一首歌", "Ah, jatuh bangun menjadi sebuah lagu", "Ah, all the stumbling became a song"),
        ("唱给那个倔强又莽撞的自己", "Kunyanyikan untuk diriku yang keras kepala dan nekat", "I sing it to my stubborn, reckless self"),
        ("啊　就算世界再喧哗忧郁", "Ah, meski dunia riuh dan murung", "Ah, however loud and gloomy the world becomes"),
        ("我仍听见最初那一声回应", "Aku masih mendengar jawaban yang pertama", "I still hear that very first answer"),
        ("（喔）少年的回声", "(Oh) gema masa muda", "(Oh) the echo of our boyhood"),
        ("带我向前　一步又一步前行", "Membawaku maju, selangkah demi selangkah", "Carrying me on, step after step"),
    ]),
    ("outro", "Outro", None),
]


def py(text):
    """Tone-marked pinyin, with a dot where the lyric has a pause."""
    parts = [p for p in text.replace("（喔）", "").replace("“", "").replace("”", "").split("　")]
    return " · ".join(" ".join(s[0] for s in pinyin(p, style=Style.TONE)) for p in parts if p)


def write(path, obj):
    json.dump(obj, open(path, "w", encoding="utf-8", newline="\n"), ensure_ascii=False, indent=1)


def main():
    sections, lines = [], []
    for sid, label, rows in SECTIONS:
        sec = {"id": sid, "label": label}
        if rows is None:
            sec["note"] = "instrumental"
        else:
            sec["lines"] = [{"who": WHO, "zh": a, "py": py(a), "id": b, "en": c} for a, b, c in rows]
            lines += [{"section": sid, **l, "sung": l["zh"]} for l in sec["lines"]]
        sections.append(sec)
    write(os.path.join(HERE, "lyrics.json"), {
        "title": {"zh": "少年回声", "id": "Gema Masa Remaja", "en": "Echoes of Youth"},
        "sung": "zh",
        "voices": {WHO: {"name": "Xiaoyu", "voice": "the grown singer who remembers", "heard": "male", "part": "the one who remembers"}},
        "sections": sections,
        "subs": ["zh", "id"],
        "about": "A grown man remembers the friends of his school days, and what became of them.",
    })
    write(os.path.join(HERE, "lines.json"), lines)
    print(len(lines), "lines")


if __name__ == "__main__":
    main()
