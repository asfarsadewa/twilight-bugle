#!/usr/bin/env python3
"""Remove short unwanted vocal sounds from a song, and keep the band.

  python tools/scrub.py <original.wav> <vocals.wav> <no_vocals.wav> <windows.json> <out.wav>

windows.json is a list of {"start", "end", "next"}: a rough span from a transcript, and the start of the lyric
that follows it. Each edge moves to the quietest 20 ms of the vocal stem near it, so a cut lands in the breath
between words. Inside a window the output plays the Demucs band stem. Outside it plays the untouched original.
25 ms crossfades join the two. Writes <out.wav> and <out.wav>.json with the final windows.
"""
import json, sys
import numpy as np
import soundfile as sf

FADE = 0.025


def envelope(v, sr, hop):
    mono = v.mean(axis=1) if v.ndim > 1 else v
    n = len(mono) // hop
    return np.sqrt((mono[: n * hop].reshape(n, hop) ** 2).mean(axis=1) + 1e-12)


def quietest(env, hop, sr, a, b):
    i0, i1 = max(0, int(a * sr / hop)), max(int(a * sr / hop) + 1, int(b * sr / hop))
    seg = env[i0:i1]
    k = int(np.argmin(np.convolve(seg, np.ones(2) / 2, mode="same"))) if len(seg) else 0
    return (i0 + k) * hop / sr


def main():
    orig_p, voc_p, band_p, win_p, out_p = sys.argv[1:6]
    orig, sr = sf.read(orig_p, always_2d=True)
    voc, sr2 = sf.read(voc_p, always_2d=True)
    band, sr3 = sf.read(band_p, always_2d=True)
    assert sr == sr2 == sr3, "sample rates differ"
    n = min(len(orig), len(voc), len(band))
    orig, voc, band = orig[:n], voc[:n], band[:n]
    hop = int(sr * 0.01)
    env = envelope(voc, sr, hop)

    final = []
    for w in json.load(open(win_p, encoding="utf-8")):
        left = quietest(env, hop, sr, w["start"] - 0.35, w["start"] + 0.05)
        right = quietest(env, hop, sr, max(w["end"] - 0.05, left + 0.1), w["next"] + 0.12)
        final.append({"start": round(left, 3), "end": round(right, 3), "label": w.get("label", "")})

    # Mix weight: 1 plays the original, 0 plays the band stem.
    keep = np.ones(n)
    f = int(FADE * sr)
    ramp = np.linspace(1, 0, f)
    for w in final:
        a, b = int(w["start"] * sr), int(w["end"] * sr)
        keep[a:b] = 0
        keep[max(0, a - f):a] = np.minimum(keep[max(0, a - f):a], ramp[-(a - max(0, a - f)):] if a else 1)
        keep[b:b + f] = np.minimum(keep[b:b + f], ramp[::-1][: len(keep[b:b + f])])
    out = orig * keep[:, None] + band * (1 - keep[:, None])
    sf.write(out_p, out, sr, subtype="PCM_24")
    json.dump(final, open(out_p + ".json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print(f"{len(final)} windows scrubbed, {sum(w['end'] - w['start'] for w in final):.2f} s in total")


if __name__ == "__main__":
    main()
