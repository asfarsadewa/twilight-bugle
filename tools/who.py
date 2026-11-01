#!/usr/bin/env python3
"""Name the singer of each line from one short clip per line.

  python tools/who.py <project>/song <take> [model ...]

A whole section confuses the listener model: it called the same chorus line "man" in one chorus and "woman" in
the next. One line at a time is a simpler question. For each line in check.json, FFmpeg cuts the vocal stem from
the line start to its end plus 0.3 s. Each model answers man, woman or both. Writes who.json in the take folder.
Default models: gemini-3.8-flash, gemini-3.1-pro-preview and gpt-audio-1.5. Name models to run only those.

Model choice, tested 2026-11-01 on take 6 against 10 lines where the pitch alone settles the singer:
gemini-3.8-flash 10/10, gpt-audio-1.5 10/10, gemini-3.1-pro-preview 9/10, gemini-pro-latest 8/10,
gemini-4-argon 7/10. gemini-omni-1.1-flash does not accept audio input. The gpt-6.x models do not either.
"-latest" aliases are not used: they move, and a rerun would then use a different listener.
"""
import base64, concurrent.futures as cf, json, os, subprocess, sys, tempfile, urllib.request

API = "https://generativelanguage.googleapis.com/v1beta/models/{}:generateContent"
Q = ("This is a short clip of the separated vocal track of a duet between a man (a tenor who sometimes sings high) "
     "and a woman (a soprano). Who sings in this clip? Judge by the voice timbre, not by the pitch alone. "
     'Answer only with JSON: {"voice": "man"|"woman"|"both"|"none"}.')


def clip(src, a, b):
    with tempfile.TemporaryDirectory() as d:
        p = os.path.join(d, "c.mp3")
        subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-ss", f"{a:.2f}", "-to", f"{b:.2f}", "-i", src,
                        "-c:a", "libmp3lame", "-b:a", "192k", p], check=True)
        return base64.b64encode(open(p, "rb").read()).decode()


def ask(model, data):
    body = {"contents": [{"parts": [{"inline_data": {"mime_type": "audio/mp3", "data": data}}, {"text": Q}]}],
            "generationConfig": {"responseMimeType": "application/json", "temperature": 0}}
    req = urllib.request.Request(API.format(model), data=json.dumps(body).encode(), headers={
        "x-goog-api-key": os.environ["GEMINI_API_KEY"], "Content-Type": "application/json"})
    for _ in range(3):
        try:
            r = json.load(urllib.request.urlopen(req, timeout=300))
            return json.loads(r["candidates"][0]["content"]["parts"][0]["text"]).get("voice")
        except Exception as e:  # noqa: BLE001 - a failed answer counts as no answer
            err = e
    return f"error: {err}"


# OpenAI: gpt-audio-1.5 is the only model on this account that takes audio input (the gpt-6.x flagships take
# text and images only, checked 2026-11-01). It declines to judge a speaker's gender, so it gets the musical
# question instead: which voice part sings. Tenor maps to man, soprano to woman.
OPENAI_Q = ('This is an AI-generated song. The vocal track of a duet has two voice parts: a tenor part and a '
            'soprano part. Which voice part sings in this clip? Answer only JSON {"part":"tenor"|"soprano"|"both"}.')
PART = {"tenor": "man", "soprano": "woman", "both": "both"}


def ask_openai(model, wav_b64):
    body = {"model": model, "modalities": ["text"], "messages": [{"role": "user", "content": [
        {"type": "text", "text": OPENAI_Q}, {"type": "input_audio", "input_audio": {"data": wav_b64, "format": "wav"}}]}]}
    req = urllib.request.Request("https://api.openai.com/v1/chat/completions", data=json.dumps(body).encode(), headers={
        "Authorization": "Bearer " + os.environ["OPENAI_API_KEY"], "Content-Type": "application/json"})
    for _ in range(3):
        try:
            text = json.load(urllib.request.urlopen(req, timeout=300))["choices"][0]["message"]["content"]
            return PART.get(json.loads(text.strip().strip("`").removeprefix("json")).get("part"), "none")
        except Exception as e:  # noqa: BLE001 - a failed answer counts as no answer
            err = e
    return f"error: {err}"


def clip_wav(src, a, b):
    with tempfile.TemporaryDirectory() as d:
        p = os.path.join(d, "c.wav")
        subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-ss", f"{a:.2f}", "-to", f"{b:.2f}", "-i", src,
                        "-ac", "1", "-ar", "24000", p], check=True)
        return base64.b64encode(open(p, "rb").read()).decode()


def main():
    song, take = sys.argv[1], sys.argv[2]
    models = sys.argv[3:] or ["gemini-3.8-flash", "gemini-3.1-pro-preview", "gpt-audio-1.5"]
    d = os.path.join(song, "takes", take)
    stem = os.path.join(d, "stems", "htdemucs", "original", "vocals.wav")
    lines = json.load(open(os.path.join(d, "check.json"), encoding="utf-8"))["lines"]
    jobs = []
    for r in lines:
        if r["start"] is None:
            continue
        a, b = r["start"] - 0.15, max(r["end"], r["start"] + 1.0) + 0.3
        mp3, wav = clip(stem, a, b), clip_wav(stem, a, b)
        jobs += [(r["n"], m, wav if m.startswith("gpt-") else mp3) for m in models]
    with cf.ThreadPoolExecutor(8) as ex:
        answers = list(ex.map(lambda j: (j[0], j[1], (ask_openai if j[1].startswith("gpt-") else ask)(j[1], j[2])), jobs))
    # Answers from earlier runs stay, so one new model can join without paying for the others again.
    wp = os.path.join(d, "who.json")
    out = json.load(open(wp, encoding="utf-8")) if os.path.exists(wp) else {}
    out = {int(k): v for k, v in out.items()}
    for n, m, v in answers:
        out.setdefault(n, {})[m] = v
    json.dump(out, open(os.path.join(d, "who.json"), "w", encoding="utf-8"), indent=1)
    for r in lines:
        print(r["n"], r["who"], out.get(r["n"]), r["zh"])


if __name__ == "__main__":
    main()
