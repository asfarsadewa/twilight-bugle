#!/usr/bin/env python3
"""Ask Gemini one question about a stretch of audio.

  python tools/ask.py <audio> <start> <end> "<question>"

FFmpeg cuts the stretch to a temporary MP3. Gemini hears only that clip. Needs GEMINI_API_KEY.
"""
import base64, json, os, subprocess, sys, tempfile, urllib.request

GEMINI = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent"


def main():
    src, start, end, q = sys.argv[1], float(sys.argv[2]), float(sys.argv[3]), sys.argv[4]
    with tempfile.TemporaryDirectory() as d:
        clip = os.path.join(d, "clip.mp3")
        subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-ss", str(start), "-to", str(end), "-i", src,
                        "-c:a", "libmp3lame", "-b:a", "192k", clip], check=True)
        data = base64.b64encode(open(clip, "rb").read()).decode()
    body = {"contents": [{"parts": [{"inline_data": {"mime_type": "audio/mp3", "data": data}}, {"text": q}]}],
            "generationConfig": {"temperature": 0.1}}
    req = urllib.request.Request(GEMINI, data=json.dumps(body).encode(), headers={
        "x-goog-api-key": os.environ["GEMINI_API_KEY"], "Content-Type": "application/json"})
    r = json.load(urllib.request.urlopen(req, timeout=300))
    print(r["candidates"][0]["content"]["parts"][0]["text"])


if __name__ == "__main__":
    main()
