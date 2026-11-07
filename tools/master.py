#!/usr/bin/env python3
"""Lock a take as a production's master and write master.json, the song facts its cue sheet reads.

  python -m demucs --two-stems=vocals -n htdemucs -o <song>/takes/<take>/stems <song>/takes/<take>/original.wav
  python tools/master.py productions/<id>/song <take> [--bpm 92] [--vote]

master.json holds every sung line in take order (text, translations, singer, start, end), the sections, a beat
grid and the vocal loudness of each singer at 30 fps. A line Scribe did not hear gets times between its
neighbours. An instrumental section in lyrics.json (a solo, an intro) gets the gap between the lines around it.
<take>/fix.json holds line times checked by hand. They win over the transcript.
--vote takes the singer of each line from vote.json (tools/vote.py), for songs where the take swaps singers.
Copies take.mp3 to <song>/master.mp3.
"""
import argparse, json, os, shutil
import numpy as np
import librosa


def load(p):
    return json.load(open(p, encoding="utf-8"))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("song")
    ap.add_argument("take")
    ap.add_argument("--bpm", type=float, default=110)
    ap.add_argument("--vote", action="store_true")
    a = ap.parse_args()
    song, d = a.song, os.path.join(a.song, "takes", a.take)
    lyr = load(os.path.join(song, "lyrics.json"))
    order = load(os.path.join(song, "lines.json"))
    current = {l.get("sung", l.get("zh")): l for l in order}
    sheet = load(os.path.join(d, "lines.json"))
    chk = load(os.path.join(d, "check.json"))["lines"]
    vote = load(os.path.join(d, "vote.json")) if a.vote else None
    dur = load(os.path.join(d, "request.json"))["duration_seconds"]

    sung = lyr.get("sung", "zh")
    lines = []
    for i, (s, c) in enumerate(zip(sheet, chk)):
        key = s.get("sung", s.get("zh"))
        # A take can skip lines. If the take did not sing a line and the current sheet no longer has it, it goes.
        if key not in current and not c["match"] and len(order) != len(sheet):
            continue
        # Only the words and translations come from the current sheet. Section and singer stay as the take sang them.
        # If the sheet was corrected to the words a take sang, the old words find no match. Such a line takes the
        # current line at the same place, when both sheets have the same number of lines.
        cur = current.get(key) or (order[i] if len(order) == len(sheet) else {})
        l = {**s, **{k: v for k, v in cur.items() if k in ("zh", "py", "en", "id", "fr", "jv")}}
        l["sung"] = l.get(sung, l.get("sung"))
        l["written_for"] = s["who"]
        if vote:
            l["who"], l["who_sure"] = vote[str(i)]["who"], vote[str(i)]["sure"]
        else:
            l["who_sure"] = True
        l["start"], l["end"], l["heard"] = c["start"], c["end"], c["match"]
        lines.append(l)

    # A repeated chorus has the same words as the first one, so the aligner can pin a later line to an earlier
    # repeat. Song order is fixed: keep the longest run of lines whose times rise, and re-time the rest.
    starts = [l["start"] for l in lines]
    best, prev = [], []
    for i, s in enumerate(starts):
        if s is None:
            continue
        cand = max((best[j] for j in range(len(best)) if starts[prev[j]] < s), key=len, default=[]) + [i]
        best.append(cand)
        prev.append(i)
    keep = set(max(best, key=len, default=[]))
    for i, l in enumerate(lines):
        if i not in keep:
            l["start"] = l["end"] = None

    # Lines Scribe missed or the order check dropped: spread them evenly between the nearest kept lines.
    known = [i for i, l in enumerate(lines) if l["start"] is not None]
    for i, l in enumerate(lines):
        if l["start"] is None:
            p = max((k for k in known if k < i), default=None)
            n = min((k for k in known if k > i), default=None)
            t0 = lines[p]["end"] if p is not None else 0.0
            t1 = lines[n]["start"] if n is not None else dur
            gap_lines = (n if n is not None else len(lines)) - (p if p is not None else -1) - 1
            pos = i - (p if p is not None else -1)
            l["start"] = round(t0 + (t1 - t0) * (pos - 1) / gap_lines, 2)
            l["end"] = round(t0 + (t1 - t0) * pos / gap_lines, 2)
    # Times checked by hand win: <take>/fix.json maps a line number of the master to [start, end]. Use it where the
    # transcript has no gaps to align on, as in a legato final chorus with a choir.
    fix = load(os.path.join(d, "fix.json")) if os.path.exists(os.path.join(d, "fix.json")) else {}
    for n, (t0, t1) in fix.items():
        lines[int(n)]["start"], lines[int(n)]["end"], lines[int(n)]["heard"] = t0, t1, "fixed"
    for i, l in enumerate(lines):
        nxt = lines[i + 1]["start"] if i + 1 < len(lines) else dur
        l["end"] = round(min(max(l["end"] or l["start"] + 1.2, l["start"] + 1.2), nxt - 0.05), 2)

    # Sections: sung ones from their lines, instrumental ones from the gaps, in the order of lyrics.json.
    spans = {}
    for l in lines:
        sp = spans.setdefault(l["section"], [l["start"], l["end"]])
        sp[0], sp[1] = min(sp[0], l["start"]), max(sp[1], l["end"])
    order = [s["id"] for s in lyr["sections"]]
    sections = []
    for k, sid in enumerate(order):
        if sid in spans:
            sections.append({"id": sid, "start": spans[sid][0], "end": spans[sid][1]})
        else:
            before = next((spans[o][1] for o in reversed(order[:k]) if o in spans), 0.0)
            after = next((spans[o][0] for o in order[k + 1:] if o in spans), dur)
            sections.append({"id": sid, "start": before, "end": after})
    sections.append({"id": "end", "start": sections[-1]["end"], "end": dur})

    band, sr = librosa.load(os.path.join(d, "stems", "htdemucs", "original", "no_vocals.wav"), sr=22050)
    onset = librosa.onset.onset_strength(y=band, sr=sr)
    tempo, beats = librosa.beat.beat_track(onset_envelope=onset, sr=sr, start_bpm=a.bpm, tightness=200)
    bt = librosa.frames_to_time(beats, sr=sr)
    phase = int(np.argmax([onset[beats[k::4]].mean() for k in range(4)]))

    fps = 30
    voc, vsr = librosa.load(os.path.join(d, "stems", "htdemucs", "original", "vocals.wav"), sr=22050)
    hop = vsr // fps
    rms = librosa.feature.rms(y=voc, frame_length=hop * 2, hop_length=hop)[0]
    rms = np.clip(np.convolve(rms, np.ones(3) / 3, mode="same") / (np.percentile(rms, 97) + 1e-9), 0, 1)
    singers = [k for k in lyr["voices"] if k != "both"]
    vox = {k: np.zeros_like(rms) for k in singers}
    for l in lines:
        s0, s1 = int(l["start"] * fps), int((l["end"] + 0.3) * fps)
        for k in singers if l["who"] == "both" else [l["who"]]:
            vox[k][s0:s1] = rms[s0:s1]

    out = {"take": a.take, "duration": dur, "bpm": round(float(np.atleast_1d(tempo)[0]), 2), "sung": lyr.get("sung", "zh"),
           "vox": {"fps": fps, **{k: [round(float(x), 2) for x in v] for k, v in vox.items()}},
           "beats": [round(float(t), 3) for t in bt], "downbeat_phase": phase,
           "sections": [{**s, "start": round(s["start"], 2), "end": round(s["end"], 2)} for s in sections],
           "lines": lines}
    json.dump(out, open(os.path.join(song, "master.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    shutil.copyfile(os.path.join(d, "take.mp3"), os.path.join(song, "master.mp3"))
    print(f"master {a.take}: {dur:.1f}s, {out['bpm']} BPM, {len(bt)} beats")
    for s in out["sections"]:
        print(f"  {s['id']:<7} {s['start']:7.2f} - {s['end']:7.2f}")


if __name__ == "__main__":
    main()
