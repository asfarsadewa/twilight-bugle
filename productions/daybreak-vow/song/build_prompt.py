#!/usr/bin/env python3
"""Build the Lyria prompt and the lyric sheet from lyrics.json.

  python productions/daybreak-vow/song/build_prompt.py

Writes prompt.txt (brief + tagged lyrics), lyrics.md (zh, pinyin, en, id) and lines.json
(one entry per sung line in song order, for subtitle timing).
"""
import json, os
from pypinyin import pinyin, Style, load_phrases_dict

# Readings that pypinyin gets wrong in this song: 系 "to tie" is jì, 落下 "fall" is luò xià.
load_phrases_dict({"系在": [["jì"], ["zài"]], "落下": [["luò"], ["xià"]]})

HERE = os.path.dirname(os.path.abspath(__file__))
song = json.load(open(os.path.join(HERE, "lyrics.json"), encoding="utf-8"))
voices = song["voices"]
by_id = {s["id"]: s for s in song["sections"]}


def lines_of(s):
    base = by_id[s["repeat"]]["lines"] if "repeat" in s else s.get("lines", [])
    return base + s.get("extra", [])


def py(zh):
    return " ".join(p[0] for p in pinyin(zh.replace(" ", "，"), style=Style.TONE)).replace(" ，", " ·").replace("，", "·")


prompt, sheet, flat = [], [f"# {song['title']['zh']} · {song['title']['en']} · {song['title']['id']}", ""], []
for s in song["sections"]:
    label = s["label"] + (f" - {s['note']}" if s.get("note") and not lines_of(s) else "")
    if s.get("note") and lines_of(s):
        label += f" - {s['note']}"
    prompt.append(f"[{label}]")
    sheet += [f"## {s['label']}" + (f" ({s['note']})" if s.get("note") else ""), ""]
    who = None
    for ln in lines_of(s):
        if ln["who"] != who:
            who = ln["who"]
            prompt.append(f"[{voices[who]['tag']}]")
        prompt.append(ln["zh"])
        sheet += [f"**{voices[ln['who']]['name']}** · {ln['zh']}  ", f"*{py(ln['zh'])}*  ",
                  f"EN: {ln['en']}  ", f"ID: {ln['id']}", ""]
        flat.append({"section": s["id"], "who": ln["who"], "zh": ln["zh"], "py": py(ln["zh"]),
                     "en": ln["en"], "id": ln["id"]})
    prompt.append("")

brief = open(os.path.join(HERE, "brief.txt"), encoding="utf-8").read().strip()
with open(os.path.join(HERE, "prompt.txt"), "w", encoding="utf-8") as f:
    f.write(brief + "\n\nLyrics:\n\n" + "\n".join(prompt).strip() + "\n")
with open(os.path.join(HERE, "lyrics.md"), "w", encoding="utf-8") as f:
    f.write("\n".join(sheet).strip() + "\n")
with open(os.path.join(HERE, "lines.json"), "w", encoding="utf-8") as f:
    json.dump(flat, f, ensure_ascii=False, indent=1)
print(f"{len(flat)} sung lines, prompt {len(brief) + sum(len(p) for p in prompt)} chars")
