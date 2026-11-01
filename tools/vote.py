#!/usr/bin/env python3
"""Decide the singer of each line by vote.

  python tools/vote.py <project>/song <take>

Voters: every model answer in who.json (one vote each) and the pitch from voices.json. The pitch votes twice when
it is unambiguous: a median under 240 Hz with most frames low is the tenor, a median over 380 Hz with almost no
low frames is the soprano. A line is sure when the winner leads by two votes or more. A line that is not sure
becomes "both", and the staging lights both puppets for it. Writes vote.json in the take folder.
"""
import json, os, sys

MAP = {"man": "prince", "woman": "princess", "both": "both"}


def main():
    song, take = sys.argv[1], sys.argv[2]
    d = os.path.join(song, "takes", take)
    lines = json.load(open(os.path.join(d, "check.json"), encoding="utf-8"))["lines"]
    who = json.load(open(os.path.join(d, "who.json"), encoding="utf-8"))
    pitch = {o["n"]: o for o in json.load(open(os.path.join(d, "voices.json"), encoding="utf-8"))["lines"]}
    out = {}
    for r in lines:
        n, votes = r["n"], {"prince": 0, "princess": 0, "both": 0}
        p = pitch.get(n, {})
        hz, low = p.get("pitch_hz"), p.get("low_share")
        if hz and low is not None and hz < 240 and low > 0.8:
            votes["prince"] += 2
        elif hz and low is not None and hz > 380 and low < 0.2:
            votes["princess"] += 2
        for answer in who.get(str(n), {}).values():
            if answer in MAP:
                votes[MAP[answer]] += 1
        ranked = sorted(votes.items(), key=lambda kv: kv[1], reverse=True)
        sure = ranked[0][1] - ranked[1][1] >= 2
        out[n] = {"who": ranked[0][0] if sure else "both", "sure": sure, "votes": votes}
        print(f'{n:<3}{r["who"]:<9}-> {out[n]["who"]:<9}{"sure " if sure else "split"} {votes}  {r["zh"]}')
    json.dump(out, open(os.path.join(d, "vote.json"), "w", encoding="utf-8"), indent=1)


if __name__ == "__main__":
    main()
