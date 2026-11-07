#!/usr/bin/env python3
"""Write the song sheets of Urip Maneh from the film's brief in the sibling repository mini-mv-studio.

  python productions/urip-maneh/song/import_take.py

The take is ready, so no Lyria step runs. The brief's hand-timed lines become check.json and fix.json for
tools/master.py. Its "id" field holds the Chinese subtitle of the film.
"""
import json, os

HERE = os.path.dirname(os.path.abspath(__file__))
TAKE = os.path.join(HERE, "takes", "take_a")
BRIEF = os.path.join(HERE, "..", "..", "..", "..", "mini-mv-studio", "mvs", "urip_maneh", "brief.json")

EN = [
    "At the old temple, I carve your face", "Stone and time bear witness to love",
    "You pass by, in one blink of an eye", "This life is not enough to stand beside you",
    "On the night river, the keroncong softly weeps", "The ship departs, I run to the quay",
    "My hand reaches out, the sea already parts us", "This life again, I lose to time",
    "If this is not the time", "I will wait again",
    "Someday, when we live again, look for me", "Among a thousand faces, I will know you",
    "Even if the stars have changed their places", "My love will not forget the way home",
    "Three times now I have been born", "Three times now I have lost",
    "The kayon is planted, the story is not over",
    "Now I live again, and I see you", "Before the temple, smiling as you did",
    "Though you forget, my heart remembers", "This is the time, do not go away again",
]
SECTIONS = [("intro", "Intro", 0), ("v1", "Verse 1", 4), ("v2", "Verse 2", 4), ("pre", "Pre-chorus", 2), ("ch1", "Chorus", 4),
            ("bridge", "Bridge", 3), ("ch2", "Final chorus", 4), ("outro", "Outro", 0)]
NOTES = {"intro": "instrumental: solo piano and strings", "outro": "instrumental: quiet piano, one long held chord"}


def write(path, obj):
    json.dump(obj, open(path, "w", encoding="utf-8", newline="\n"), ensure_ascii=False, indent=1)


def main():
    brief = json.load(open(BRIEF, encoding="utf-8"))
    src = brief["lines"]
    lines, sections, i = [], [], 0
    for sid, label, n in SECTIONS:
        sec = {"id": sid, "label": label}
        if n == 0:
            sec["note"] = NOTES[sid]
        else:
            sec["lines"] = []
            for _ in range(n):
                row = {"who": "bayu", "jv": src[i]["ja"], "zh": src[i]["id"], "en": EN[i]}
                sec["lines"].append(row)
                lines.append({"section": sid, **row, "sung": row["jv"]})
                i += 1
        sections.append(sec)
    write(os.path.join(HERE, "lyrics.json"), {
        "title": {"jv": "Urip Maneh", "zh": "再世相逢", "id": "Hidup Kembali", "en": "Alive Again"},
        "sung": "jv",
        "voices": {"bayu": {"name": "Bayu", "voice": "a mature, warm heroic male tenor", "heard": "male", "glyph": "g-moon", "cls": "star", "part": "the man who keeps being born"}},
        "sections": sections,
        "subs": ["zh", "en"],
        "about": brief["idea"],
    })
    write(os.path.join(HERE, "lines.json"), lines)
    write(os.path.join(TAKE, "lines.json"), lines)
    write(os.path.join(TAKE, "check.json"), {"lines": [{"n": n, "who": "bayu", "text": l["ja"], "match": 1.0, "start": l["from"], "end": l["to"]} for n, l in enumerate(src)]})
    write(os.path.join(TAKE, "fix.json"), {str(n): [l["from"], l["to"]] for n, l in enumerate(src)})
    write(os.path.join(TAKE, "request.json"), {"take": "take_a", "duration_seconds": 121.313})
    print(len(lines), "lines")


if __name__ == "__main__":
    main()
