#!/usr/bin/env python3
"""Build review.html: a listening page for the song takes.

  python productions/daybreak-vow/song/build_review.py t1 t2 *t3 t4

A star marks the recommended take. review_notes.json holds the review notes per take, one sentence per item.

Reads section labels from lyrics.json and, per take, lines.json, request.json, check.json and voices.json.
Line starts come from the Scribe alignment. A line with no match gets a start between its neighbours.
The page plays takes/<take>/take.mp3 by relative path, so it works from disk and as a published page.
"""
import json, os, sys

HERE = os.path.dirname(os.path.abspath(__file__))
EXPECT = {"prince": "male", "princess": "female", "both": "both"}


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


def take_data(t):
    d = os.path.join(HERE, "takes", t)
    # The take's own sheet fixes the line order. Pinyin and translations come from the current sheet.
    master = {l["zh"]: l for l in load(os.path.join(HERE, "lines.json"))}
    lines = [{**l, **{k: master[l["zh"]][k] for k in ("py", "en", "id")}} if l["zh"] in master else l
             for l in load(os.path.join(d, "lines.json"))]
    req, chk, voc = load(os.path.join(d, "request.json")), load(os.path.join(d, "check.json")), load(os.path.join(d, "voices.json"))
    dur = req["duration_seconds"]
    starts = fill_starts([r["start"] for r in chk["lines"]], dur)
    pitch = {v["n"]: v for v in (voc or {}).get("lines", [])}
    rows, notes = [], []
    for i, r in enumerate(chk["lines"]):
        g = r.get("voice_heard")
        p = pitch.get(i, {}).get("pitch_voice")
        want = EXPECT[r["who"]]
        # A voice flag needs both listeners to disagree with the sheet in the same way.
        wrong = g is not None and p is not None and g != want and p != want and g == p
        rows.append({**lines[i], "t": starts[i], "e": r["end"], "match": r["match"], "gemini": g, "pitch": p, "wrong": wrong,
                     "missing": r["match"] < 0.3})
        if r["match"] < 0.3:
            notes.append({"n": i, "kind": "missing", "heard": None})
        elif wrong:
            notes.append({"n": i, "kind": "voice", "heard": g})
    review = chk["summary"].get("review") or {}
    return {"id": t, "duration": dur, "lyric_match": chk["summary"]["lyric_match"],
            "voice_ok": sum(not r["wrong"] for r in rows), "lines": rows, "notes": notes,
            "intro": review.get("intro_seconds"), "ending": review.get("ending"),
            "glitches": review.get("glitches_or_artifacts", []), "summary": review.get("summary")}


def main():
    song = load(os.path.join(HERE, "lyrics.json"))
    labels = {s["id"]: s["label"] for s in song["sections"]}
    data = {"title": song["title"], "voices": song["voices"], "labels": labels,
            "pick": next((t[1:] for t in sys.argv[1:] if t.startswith("*")), None),
            "notes": load(os.path.join(HERE, "review_notes.json")) or {},
            "takes": [take_data(t.lstrip("*")) for t in sys.argv[1:]]}
    page = open(os.path.join(HERE, "review.template.html"), encoding="utf-8").read()
    page = page.replace("/*DATA*/null", json.dumps(data, ensure_ascii=False))
    open(os.path.join(HERE, "review.html"), "w", encoding="utf-8").write(page)
    for t in data["takes"]:
        print(t["id"], f'{t["duration"]:.0f}s', "lyrics", t["lyric_match"], "voice", f'{t["voice_ok"]}/{len(t["lines"])}',
              "notes", [(n["n"], n["kind"], n["heard"]) for n in t["notes"]])


if __name__ == "__main__":
    main()
