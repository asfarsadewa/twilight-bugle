#!/usr/bin/env python3
"""Generate one sung song take with Google Lyria 3.5 (Gemini Interactions API).

Usage:
  python tools/lyria_song.py --prompt-file <project>/song/prompt.txt --out <project>/song/takes --take t1

Writes <out>/<take>/:
  original.wav    untouched API audio (git ignores it)
  take.mp3        192k stereo copy for review
  returned.txt    text from the model: section markers and lyrics, often with [start:] times
  request.json    model, prompt, time, interaction id, usage

Needs GEMINI_API_KEY and ffmpeg. One POST per take. A failed take is not retried.
"""
import argparse, base64, hashlib, json, os, subprocess, sys, time, urllib.error, urllib.request

API = "https://generativelanguage.googleapis.com/v1beta/interactions"


def call(model, prompt):
    body = {"model": model, "input": prompt,
            "response_format": {"type": "audio", "mime_type": "audio/wav"}}
    req = urllib.request.Request(API, data=json.dumps(body).encode(), method="POST", headers={
        "Content-Type": "application/json",
        "x-goog-api-key": os.environ.get("GOOGLE_API_KEY") or os.environ["GEMINI_API_KEY"],
    })
    try:
        with urllib.request.urlopen(req, timeout=900) as r:
            return json.load(r)
    except urllib.error.HTTPError as e:
        sys.exit(f"HTTP {e.code}: {e.read().decode(errors='replace')[:800]}")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--prompt-file", required=True)
    ap.add_argument("--out", required=True)
    ap.add_argument("--take", required=True)
    ap.add_argument("--model", default="lyria-3.5")
    a = ap.parse_args()

    prompt = open(a.prompt_file, encoding="utf-8").read().strip()
    d = os.path.join(a.out, a.take)
    os.makedirs(d, exist_ok=True)
    t0 = time.time()
    resp = call(a.model, prompt)

    texts, audio, mime = [], [], []
    for step in resp.get("steps", []) + resp.get("outputs", []):
        for c in step.get("content", [step]):
            if c.get("type") == "text":
                texts.append(c.get("text", ""))
            elif c.get("type") == "audio" and c.get("data"):
                audio.append(base64.b64decode(c["data"]))
                mime.append(c.get("mime_type", ""))
    if not audio:
        sys.exit("no audio in response: " + json.dumps(resp)[:800])

    raw = os.path.join(d, "original.wav" if "wav" in mime[0] else "original.mp3")
    with open(raw, "wb") as f:
        f.write(audio[0])
    with open(os.path.join(d, "returned.txt"), "w", encoding="utf-8") as f:
        f.write("\n".join(texts).strip() + "\n")
    mp3 = os.path.join(d, "take.mp3")
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", raw, "-ac", "2",
                    "-c:a", "libmp3lame", "-b:a", "192k", mp3], check=True)
    dur = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration",
                                "-of", "csv=p=0", raw], capture_output=True, text=True).stdout or 0)
    meta = {"take": a.take, "model": a.model, "endpoint": API, "mime": mime[0],
            "audio_blocks": len(audio), "duration_seconds": round(dur, 3),
            "sha256": hashlib.sha256(audio[0]).hexdigest(), "interaction_id": resp.get("id"),
            "generated": time.strftime("%Y-%m-%dT%H:%M:%S"), "seconds_taken": round(time.time() - t0, 1),
            "usage": resp.get("usage", {}), "prompt": prompt}
    with open(os.path.join(d, "request.json"), "w", encoding="utf-8") as f:
        json.dump(meta, f, ensure_ascii=False, indent=1)
    print(json.dumps({k: meta[k] for k in ("take", "mime", "duration_seconds", "seconds_taken")}))


if __name__ == "__main__":
    main()
