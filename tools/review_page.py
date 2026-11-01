#!/usr/bin/env python3
"""Build a listening page for the takes of a production's song.

  python tools/review_page.py productions/<id>/song t1 *t2

A star marks the recommended take. Writes <song>/review.html from tools/review_template.html. The page plays
takes/<take>/take.mp3 by relative path, so it works from disk and as a published page.

Reads <song>/lyrics.json (title, sung language, voices, optional "subs") and per take lines.json, request.json,
check.json and, when present, voices.json (pitch) and <song>/review_notes.json (review notes, one sentence each).
The sung line leads. The translations in "subs" follow it, by default every other language in the sheet.
"""
import json, os, sys

HERE = os.path.dirname(os.path.abspath(__file__))
LANG_KEYS = ["zh", "py", "id", "en", "fr"]


def load(p):
    return json.load(open(p, encoding="utf-8")) if os.path.exists(p) else None


def fill_starts(starts, total):
    known = [(i, s) for i, s in enumerate(starts) if s is not None]
    out = list(starts)
    for i, s in enumerate(starts):
        if s is None:
            prev = max((k for k in known if k[0] < i), default=(-1, 0.0), key=lambda k: k[0])
            nxt = min((k for k in known if k[0] > i), default=(len(starts), total), key=lambda k: k[0])
            out[i] = round(prev[1] + (nxt[1] - prev[1]) * (i - prev[0]) / (nxt[0] - prev[0]), 2)
    return out


def take_data(song, t, expect, master):
    d = os.path.join(song, "takes", t)
    sheet = load(os.path.join(d, "lines.json"))
    lines = [{**l, **{k: master[l.get("sung", l.get("zh"))][k] for k in LANG_KEYS if k in master.get(l.get("sung", l.get("zh")), {})}} for l in sheet]
    req, chk, voc = load(os.path.join(d, "request.json")), load(os.path.join(d, "check.json")), load(os.path.join(d, "voices.json"))
    dur = req["duration_seconds"]
    starts = fill_starts([r["start"] for r in chk["lines"]], dur)
    pitch = {v["n"]: v for v in (voc or {}).get("lines", [])}
    rows = []
    for i, r in enumerate(chk["lines"]):
        g = r.get("voice_heard")
        p = pitch.get(i, {}).get("pitch_voice")
        want = expect.get(r["who"])
        # A voice flag needs two listeners to disagree with the sheet in the same way. A solo song has one.
        wrong = g is not None and p is not None and g != want and p != want and g == p
        rows.append({**lines[i], "t": starts[i], "e": r["end"], "match": r["match"], "gemini": g, "pitch": p,
                     "wrong": wrong, "missing": r["match"] < 0.3})
    review = chk["summary"].get("review") or {}
    return {"id": t, "duration": dur, "lyric_match": chk["summary"]["lyric_match"],
            "voice_ok": sum(not r["wrong"] for r in rows), "lines": rows, "intro": review.get("intro_seconds")}


def main():
    song = sys.argv[1]
    args = sys.argv[2:]
    lyr = load(os.path.join(song, "lyrics.json"))
    sung = lyr.get("sung", "zh")
    master = {l.get("sung", l.get("zh")): l for l in load(os.path.join(song, "lines.json"))}
    voices = lyr["voices"]
    expect = {"prince": "male", "princess": "female", "both": "both", **{k: v["heard"] for k, v in voices.items() if "heard" in v}}
    present = [k for k in LANG_KEYS if any(k in l for l in master.values())]
    subs = lyr.get("subs") or [k for k in present if k != sung and k != "py"]
    solo = len([k for k in voices if k != "both"]) == 1
    method = ["Scribe v2 transcribes each take.",
              "The page matches the transcript to the lyric sheet by pinyin." if sung == "zh" else "The page matches the transcript to the lyric sheet word by word."]
    if not solo:
        method += ["Gemini names the voice on each line. A pitch check on the separated vocal track names the voice again.",
                   "The page flags a line if both checks hear the same wrong voice."]
    method += ["The page flags a line if Scribe does not hear it.",
               "Line times come from the transcript. A line with no match gets an estimated time."]
    data = {"title": lyr["title"], "sung": sung, "subs": subs, "voices": voices, "about": lyr.get("about", ""), "method": method,
            "labels": {s["id"]: s["label"] for s in lyr["sections"]},
            "pick": next((t[1:] for t in args if t.startswith("*")), None),
            "notes": load(os.path.join(song, "review_notes.json")) or {},
            "takes": [take_data(song, t.lstrip("*"), expect, master) for t in args]}
    page = open(os.path.join(HERE, "review_template.html"), encoding="utf-8").read()
    page = page.replace("/*DATA*/null", json.dumps(data, ensure_ascii=False))
    page = page.replace("<title>Daybreak Vow Takes</title>", f"<title>{lyr['title'][sung]} Takes</title>", 1)
    open(os.path.join(song, "review.html"), "w", encoding="utf-8").write(page)
    for t in data["takes"]:
        print(t["id"], f'{t["duration"]:.0f}s', "lyrics", t["lyric_match"], "missing", sum(r["missing"] for r in t["lines"]))


if __name__ == "__main__":
    main()
