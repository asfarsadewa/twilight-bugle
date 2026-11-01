#!/usr/bin/env python3
"""Second opinion on who sings each line: pitch of the separated vocal stem.

  python -m demucs --two-stems=vocals -n htdemucs -o <take>/stems <take>/original.wav
  python tools/voices.py <project>/song t1 t2 ...

Reads check.json (line times from listen.py) and the Demucs vocal stem. For each line, pYIN tracks
the sung pitch. The tenor sits about an octave under the soprano, so the line medians form two groups.
A two-means split on log pitch labels the low group male and the high group female. A line with a
large share of frames on both sides of the split is "both". Writes voices.json next to check.json.
"""
import glob, json, os, sys
import numpy as np
import librosa

EXPECT = {"prince": "male", "princess": "female", "both": "both"}


def split(values):
    lo, hi = np.percentile(values, 20), np.percentile(values, 80)
    for _ in range(50):
        cut = (lo + hi) / 2
        lo, hi = values[values < cut].mean(), values[values >= cut].mean()
    return (lo + hi) / 2


def main():
    song, takes = sys.argv[1], sys.argv[2:]
    for t in takes:
        d = os.path.join(song, "takes", t)
        stem = glob.glob(os.path.join(d, "stems", "*", "*", "vocals.wav"))[0]
        y, sr = librosa.load(stem, sr=22050, mono=True)
        lines = json.load(open(os.path.join(d, "check.json"), encoding="utf-8"))["lines"]
        tracks = []
        for r in lines:
            if r["start"] is None:
                tracks.append(None)
                continue
            seg = y[int(max(0, r["start"] - 0.3) * sr):int((r["end"] + 0.6) * sr)]
            f0, voiced, _ = librosa.pyin(seg, fmin=80, fmax=1100, sr=sr, frame_length=2048)
            f0 = f0[voiced & ~np.isnan(f0)]
            tracks.append(np.log2(f0) if len(f0) > 5 else None)
        cut = split(np.array([np.median(x) for x in tracks if x is not None]))
        out = []
        for r, x in zip(lines, tracks):
            if x is None:
                out.append({**r, "pitch_hz": None, "pitch_voice": "none"})
                continue
            low = float(np.mean(x < cut))
            voice = "both" if 0.3 <= low <= 0.7 else ("male" if low > 0.7 else "female")
            out.append({"n": r["n"], "who": r["who"], "zh": r["zh"], "start": r["start"],
                        "pitch_hz": round(float(2 ** np.median(x)), 1), "low_share": round(low, 2),
                        "pitch_voice": voice, "gemini_voice": r.get("voice_heard")})
        ok = sum(o["pitch_voice"] == EXPECT[o["who"]] for o in out)
        json.dump({"split_hz": round(float(2 ** cut), 1), "pitch_ok": f"{ok}/{len(out)}", "lines": out},
                  open(os.path.join(d, "voices.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
        print(f"{t}: split {2 ** cut:.0f} Hz, pitch agrees with the sheet on {ok}/{len(out)} lines")


if __name__ == "__main__":
    main()
