#!/usr/bin/env python3
"""Write the song sheets of 형 먼저 가: lyrics.json and lines.json, with Indonesian and English translations.

  python productions/hyeong/song/make_sheet.py

The song came ready as an MP3: the song of the film Hyeong in mini-mv-studio, extended with Suno. No Lyria step
runs. tools/listen.py times the lines on the take.
"""
import json, os

HERE = os.path.dirname(os.path.abspath(__file__))
YOUNG, OLD = "min", "cheol"

CHORUS = [
    ("형 먼저 가", "Kak, pergilah dulu", "Hyung, go first"),
    ("이 다리는 내가 지키게", "Jembatan ini biar aku yang jaga", "Let me hold this bridge"),
    ("뒤돌아보지 말고 가", "Pergilah, jangan menoleh", "Go, and do not look back"),
    ("꼭 살아서 집에 가", "Kau harus hidup, pulanglah", "Stay alive, and get home"),
]
MEET = ("우린 다시 고향에서 만나", "Kita bertemu lagi di kampung halaman", "We will meet again at home")
SECTIONS = [
    ("intro", "Intro", None),
    ("v1", "Verse 1", [(YOUNG, *r) for r in [
        ("장마비 내리던 6월의 아침", "Pagi bulan Juni, hujan tak henti", "A June morning in the monsoon rain"),
        ("우린 같은 길을 걸어 나서지", "Kita melangkah di jalan yang sama", "We set out on the same road"),
        ("누가 친구고 누가 남인지", "Siapa kawan, siapa orang asing", "Who was a friend, who was a stranger"),
        ("아무도 모르는 안개 속에서", "Tak ada yang tahu, di dalam kabut", "No one could tell, in the fog"),
        ("떨리는 내 손을 네가 잡아줬지", "Kau genggam tanganku yang gemetar", "You took my trembling hand"),
        ("괜찮아 우린 형제니까", "Tak apa, kita bersaudara", "It is all right, we are brothers"),
    ]]),
    ("ch1", "Chorus", [(YOUNG, *r) for r in CHORUS]),
    ("v2", "Verse 2", [(YOUNG, *r) for r in [
        ("엄마가 싸 준 주먹밥 한쪽", "Sekepal nasi bekal dari ibu", "The rice ball Mother packed for us"),
        ("너에게 건네던 그 밤을 기억해", "Kuingat malam saat kuberikan padamu", "I remember the night I gave it to you"),
        ("누군가는 남아야 한다면", "Jika harus ada yang tinggal", "If someone has to stay behind"),
        ("그게 나라서 다행이야", "Syukurlah, itu aku", "I am glad that it is me"),
    ]]),
    ("bridge", "Bridge", [(YOUNG, *r) for r in [
        ("비에 젖은 이름을 가슴에 품고", "Kudekap namamu yang basah oleh hujan", "I hold your rain-soaked name to my heart"),
        ("한 걸음씩 새벽을 건너가", "Selangkah demi selangkah, seberangi fajar", "Step by step, cross into the dawn"),
        ("네가 돌아올 길을 남겨둘게", "Kusisakan jalan untukmu kembali", "I will leave you a road back"),
        ("고향의 문은 열려 있으니", "Pintu kampung halaman tetap terbuka", "The door of home stays open"),
    ]]),
    ("ch2", "Final chorus", [(YOUNG, *r) for r in CHORUS] + [
        (OLD, "비가 그치면 날 찾아줘", "Saat hujan reda, carilah aku", "When the rain stops, come and find me"),
        (OLD, *MEET),
        ("both", *MEET),
    ]),
    ("outro", "Outro", [("both", *MEET)]),
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
            sec["lines"] = [{"who": w, "ko": a, "id": b, "en": c} for w, a, b, c in rows]
            lines += [{"section": sid, "who": w, "ko": a, "id": b, "en": c, "sung": a} for w, a, b, c in rows]
        sections.append(sec)
    write(os.path.join(HERE, "lyrics.json"), {
        "title": {"ko": "형 먼저 가", "id": "Kak, Pergilah Dulu", "en": "Brother, Go First", "zh": "哥，你先走"},
        "sung": "ko",
        "voices": {
            YOUNG: {"name": "Min", "voice": "a young male tenor, clear and slightly husky", "heard": "male", "part": "the younger one, who stays"},
            OLD: {"name": "Cheol", "voice": "a deeper, older male voice", "heard": "male", "part": "his hyung, who crosses"},
            "both": {"name": "Min and Cheol", "heard": "both"},
        },
        "sections": sections,
        "subs": ["ko", "id"],
        "about": "June 1950. Two friends walk south in the rain. At a bridge, the younger one stays to hold it.",
    })
    write(os.path.join(HERE, "lines.json"), lines)
    print(len(lines), "lines")


if __name__ == "__main__":
    main()
