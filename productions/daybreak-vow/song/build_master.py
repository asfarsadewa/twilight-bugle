#!/usr/bin/env python3
"""Lock the selected take as the production master and write master.json.

  python productions/daybreak-vow/song/build_master.py

master.json holds every sung line in take order with the singer heard in the take, start and end times,
the sections, and a beat grid. The theatre reads only this file and master.mp3.

Line order comes from the take's own sheet. Pinyin and translations come from the current lines.json.
The singer of each line is the one heard in the take. The story follows the take.
"""
import json, os, shutil
import numpy as np
import librosa

HERE = os.path.dirname(os.path.abspath(__file__))
TAKE = "t6"

# Singers come from takes/t6/vote.json: pitch (double weight when clear) plus three Gemini answers per line.
# A split vote stays "both". The staging lights both puppets for those lines.
# Line 38 (天亮了) is a split vote. Gemini hears a soft female outro on the whole song, so it goes to the princess.
SUNG_BY_OVERRIDE = {38: "princess"}
# Translations that change because the singer changes.
RETRANSLATE = {39: {"en": "I'm back", "id": "Aku kembali"}}


def load(p):
    return json.load(open(p, encoding="utf-8"))


def main():
    d = os.path.join(HERE, "takes", TAKE)
    master = {l["zh"]: l for l in load(os.path.join(HERE, "lines.json"))}
    sheet = load(os.path.join(d, "lines.json"))
    chk = load(os.path.join(d, "check.json"))["lines"]
    vote = load(os.path.join(d, "vote.json"))
    dur = load(os.path.join(d, "request.json"))["duration_seconds"]

    lines = []
    for i, (s, c) in enumerate(zip(sheet, chk)):
        l = {**s, **{k: master[s["zh"]][k] for k in ("py", "en", "id")}, **RETRANSLATE.get(i, {})}
        l["written_for"] = s["who"]
        l["who"] = SUNG_BY_OVERRIDE.get(i, vote[str(i)]["who"])
        l["who_sure"] = i in SUNG_BY_OVERRIDE or vote[str(i)]["sure"]
        l["start"], l["end"] = c["start"], c["end"]
        lines.append(l)
    # Scribe sometimes packs a phrase into one instant. Clamp each line inside its neighbours.
    for i, l in enumerate(lines):
        nxt = lines[i + 1]["start"] if i + 1 < len(lines) else dur
        l["end"] = round(min(max(l["end"], l["start"] + 1.2), nxt - 0.05), 2)

    sections, cur = [], None
    for l in lines:
        if l["section"] != (cur and cur["id"]):
            cur = {"id": l["section"], "start": l["start"], "end": l["end"]}
            sections.append(cur)
        cur["end"] = l["end"]
    sections.insert(0, {"id": "intro", "start": 0.0, "end": sections[0]["start"]})
    b, ch3 = next(s for s in sections if s["id"] == "bridge"), next(s for s in sections if s["id"] == "ch3")
    sections.insert(sections.index(ch3), {"id": "solo", "start": b["end"], "end": ch3["start"]})
    sections.append({"id": "end", "start": sections[-1]["end"], "end": dur})

    y, sr = librosa.load(os.path.join(d, "stems", "htdemucs", "original", "no_vocals.wav"), sr=22050)
    onset = librosa.onset.onset_strength(y=y, sr=sr)
    tempo, beats = librosa.beat.beat_track(onset_envelope=onset, sr=sr, start_bpm=138, tightness=200)
    bt = librosa.frames_to_time(beats, sr=sr)
    # Downbeat phase: the beat offset (0-3) whose beats carry the most onset energy.
    phase = int(np.argmax([onset[beats[k::4]].mean() for k in range(4)]))

    # Vocal loudness at 30 fps from the vocal stem, split by singer, so each puppet moves with its own voice.
    fps = 30
    voc, vsr = librosa.load(os.path.join(d, "stems", "htdemucs", "original", "vocals.wav"), sr=22050)
    hop = vsr // fps
    rms = librosa.feature.rms(y=voc, frame_length=hop * 2, hop_length=hop)[0]
    rms = np.convolve(rms, np.ones(3) / 3, mode="same")
    rms = np.clip(rms / (np.percentile(rms, 97) + 1e-9), 0, 1)
    vox = {"fps": fps, "prince": np.zeros_like(rms), "princess": np.zeros_like(rms)}
    for l in lines:
        a, b = int(l["start"] * fps), int((l["end"] + 0.3) * fps)
        for who in (["prince", "princess"] if l["who"] == "both" else [l["who"]]):
            vox[who][a:b] = rms[a:b]
    vox = {"fps": fps, **{k: [round(float(x), 2) for x in vox[k]] for k in ("prince", "princess")}}

    out = {"take": TAKE, "duration": dur, "bpm": round(float(np.atleast_1d(tempo)[0]), 2), "vox": vox,
           "beats": [round(float(t), 3) for t in bt], "downbeat_phase": phase,
           "sections": [{**s, "start": round(s["start"], 2), "end": round(s["end"], 2)} for s in sections],
           "lines": lines}
    json.dump(out, open(os.path.join(HERE, "master.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    shutil.copyfile(os.path.join(d, "take.mp3"), os.path.join(HERE, "master.mp3"))
    print(f"master {TAKE}: {dur:.1f}s, {out['bpm']} BPM, {len(bt)} beats, downbeat phase {phase}")
    for s in out["sections"]:
        print(f"  {s['id']:<7} {s['start']:7.2f} - {s['end']:7.2f}")


if __name__ == "__main__":
    main()
