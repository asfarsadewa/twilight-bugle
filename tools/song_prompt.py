#!/usr/bin/env python3
"""Build the Lyria prompt and the line sheet of a production's song.

  python tools/song_prompt.py productions/<id>/song

Reads <song>/lyrics.json and <song>/brief.txt. lyrics.json names the sung language in "sung" and holds every
line in that language plus its translations. Writes:
  prompt.txt   the brief and the lyrics with section headers. Voice tags appear only when the song has
               more than one voice: a solo song has none, so the singer cannot sing a tag by mistake.
  lines.json   one entry per sung line in song order, with "sung" set to the sung text
"""
import json, os, sys


def main():
    song = sys.argv[1]
    lyr = json.load(open(os.path.join(song, "lyrics.json"), encoding="utf-8"))
    sung = lyr.get("sung", "zh")
    voices = lyr["voices"]
    tagged = len(voices) > 1
    by_id = {s["id"]: s for s in lyr["sections"]}
    out, flat = [], []
    for s in lyr["sections"]:
        lines = (by_id[s["repeat"]]["lines"] if "repeat" in s else s.get("lines", [])) + s.get("extra", [])
        out.append(f"[{s['label']}" + (f" - {s['note']}" if s.get("note") else "") + "]")
        who = None
        for ln in lines:
            if tagged and ln["who"] != who:
                who = ln["who"]
                out.append(f"[{voices[who]['tag']}]")
            out.append(ln[sung])
            flat.append({"section": s["id"], **ln, "sung": ln[sung]})
        out.append("")
    brief = open(os.path.join(song, "brief.txt"), encoding="utf-8").read().strip()
    open(os.path.join(song, "prompt.txt"), "w", encoding="utf-8").write(brief + "\n\nLyrics:\n\n" + "\n".join(out).strip() + "\n")
    json.dump(flat, open(os.path.join(song, "lines.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print(f"{len(flat)} sung lines in {sung}")


if __name__ == "__main__":
    main()
