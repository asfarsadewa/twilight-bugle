#!/usr/bin/env python3
"""Check sung takes against the lyric sheet. A transcriber and a listening model check each take.

  python tools/listen.py <project>/song t1 t2 ...

For each take in <song>/takes/<take>/:
  1. ElevenLabs Scribe v2 transcribes take.mp3 with word times (scribe.json), in the sung language of lyrics.json.
  2. The transcript is aligned to lines.json: Mandarin by toneless pinyin, so homophones still match; other
     languages word by word.
     Each line gets start, end and a match ratio (sounds sung / sounds written).
  3. Gemini listens to the take with those times. It reports the voice on each line
     (male, female, both, none) and a short musical review (gemini.json).
Writes check.json with the merged result. Needs ELEVENLABS_API_KEY and GEMINI_API_KEY.
"""
import base64, difflib, json, os, re, sys, unicodedata, urllib.request, uuid
from pypinyin import lazy_pinyin

GEMINI = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent"
WORD = re.compile(r"[a-z]+")
LANGS = {"zh": "Mandarin Chinese", "id": "Indonesian", "en": "English", "ja": "Japanese", "fr": "French"}
# The voice a listener should hear for each singer, when lyrics.json does not say.
EXPECT = {"prince": "male", "princess": "female", "both": "both"}
HAN = re.compile(r"[㐀-鿿]")


def scribe(path, lang):
    b = uuid.uuid4().hex
    body = b""
    for k, v in (("model_id", "scribe_v2"), ("language_code", lang), ("tag_audio_events", "false"),
                 ("timestamps_granularity", "word")):
        body += f'--{b}\r\nContent-Disposition: form-data; name="{k}"\r\n\r\n{v}\r\n'.encode()
    body += (f'--{b}\r\nContent-Disposition: form-data; name="file"; filename="take.mp3"\r\n'
             f'Content-Type: audio/mpeg\r\n\r\n').encode() + open(path, "rb").read() + f"\r\n--{b}--\r\n".encode()
    req = urllib.request.Request("https://api.elevenlabs.io/v1/speech-to-text", data=body, headers={
        "xi-api-key": os.environ["ELEVENLABS_API_KEY"], "Content-Type": f"multipart/form-data; boundary={b}"})
    return json.load(urllib.request.urlopen(req, timeout=600))


def tokens(text, lang):
    """Units to align on. Mandarin: toneless pinyin per Han character, so homophones still match.
    Other languages: lower-case words without punctuation or accents, so "été" and "ete" match."""
    if lang == "zh":
        return [lazy_pinyin(ch)[0] for ch in HAN.findall(text)]
    plain = "".join(c for c in unicodedata.normalize("NFKD", text.lower()) if not unicodedata.combining(c))
    return WORD.findall(plain.replace("œ", "oe").replace("æ", "ae"))


def sung_tokens(words, lang):
    """One (token, time) per unit sung. A token with several units spreads its span evenly."""
    out = []
    for w in words:
        if w.get("type") != "word":
            continue
        units = tokens(w["text"], lang)
        for i, u in enumerate(units):
            out.append((u, w["start"] + (w["end"] - w["start"]) * (i + 0.5) / len(units)))
    return out


def align(lines, sung, lang):
    written, owner = [], []
    for i, ln in enumerate(lines):
        for u in tokens(ln.get("sung", ln.get("zh", "")), lang):
            written.append(u)
            owner.append(i)
    sm = difflib.SequenceMatcher(None, written, [s for s, _ in sung], autojunk=False)
    hit = {}
    for a, b, n in sm.get_matching_blocks():
        for k in range(n):
            hit[a + k] = sung[b + k][1]
    res = []
    for i, ln in enumerate(lines):
        idx = [k for k, o in enumerate(owner) if o == i]
        times = [hit[k] for k in idx if k in hit]
        res.append({"n": i, "who": ln["who"], "zh": ln.get("zh"), "text": ln.get("sung", ln.get("zh")), "match": round(len(times) / max(1, len(idx)), 2),
                    "start": round(min(times), 2) if times else None, "end": round(max(times), 2) if times else None})
    return res


def gemini(path, aligned, lang, singers, brief):
    listing = "\n".join(f'{r["n"]}. [{r["start"] if r["start"] is not None else "?"}s] {r["text"]}' for r in aligned)
    q = (f"This is a song sung in {LANGS.get(lang, lang)} by {singers}. The brief it was made from:\n{brief}\n\n"
         "Below is each lyric line with an approximate start time from a speech recognizer (? means unknown).\n\n" + listing +
         "\n\nListen to the whole track. Return JSON with two keys.\n"
         '"lines": one object per line {"n": int, "voice": "male"|"female"|"both"|"none", "start": seconds}. '
         "Voice is the voice you actually hear sing that line.\n"
         '"review": {"genre": string, "matches_brief": 1-10, "chorus_catchiness": 1-10, "lead_vocals": string, '
         '"diction_clarity": 1-10, "intro_seconds": number, "has_instrumental_solo": bool, "solo_instrument": string, '
         '"has_final_key_change": bool, "ending": string, "glitches_or_artifacts": [string], "summary": string}.')
    body = {"contents": [{"parts": [{"inline_data": {"mime_type": "audio/mp3",
                                                      "data": base64.b64encode(open(path, "rb").read()).decode()}},
                                     {"text": q}]}],
            "generationConfig": {"responseMimeType": "application/json", "temperature": 0.2}}
    req = urllib.request.Request(GEMINI, data=json.dumps(body).encode(), headers={
        "x-goog-api-key": os.environ["GEMINI_API_KEY"], "Content-Type": "application/json"})
    r = json.load(urllib.request.urlopen(req, timeout=600))
    return json.loads(r["candidates"][0]["content"]["parts"][0]["text"])


def main():
    song, takes = sys.argv[1], sys.argv[2:]
    lyr = json.load(open(os.path.join(song, "lyrics.json"), encoding="utf-8"))
    lang = lyr.get("sung", "zh")
    voices = lyr.get("voices", {})
    singers = " and ".join(v.get("voice", k) for k, v in voices.items() if k != "both")
    brief = open(os.path.join(song, "brief.txt"), encoding="utf-8").read().strip()
    expect = {**EXPECT, **{k: v["heard"] for k, v in voices.items() if "heard" in v}}
    for t in takes:
        d = os.path.join(song, "takes", t)
        # Each take keeps the line sheet it was made with, so a later lyric change cannot shift its checks.
        lp = os.path.join(d, "lines.json")
        if not os.path.exists(lp):
            json.dump(json.load(open(os.path.join(song, "lines.json"), encoding="utf-8")),
                      open(lp, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
        lines = json.load(open(lp, encoding="utf-8"))
        mp3 = os.path.join(d, "take.mp3")
        sp = os.path.join(d, "scribe.json")
        if not os.path.exists(sp):
            json.dump(scribe(mp3, lang), open(sp, "w", encoding="utf-8"), ensure_ascii=False)
        aligned = align(lines, sung_tokens(json.load(open(sp, encoding="utf-8"))["words"], lang), lang)
        gp = os.path.join(d, "gemini.json")
        if not os.path.exists(gp):
            json.dump(gemini(mp3, aligned, lang, singers, brief), open(gp, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
        g = json.load(open(gp, encoding="utf-8"))
        heard = {x["n"]: x for x in g.get("lines", [])}
        for r in aligned:
            h = heard.get(r["n"], {})
            r["voice_heard"] = h.get("voice")
            r["voice_ok"] = h.get("voice") == expect.get(r["who"])
        summary = {"take": t, "lyric_match": round(sum(r["match"] for r in aligned) / len(aligned), 3),
                   "lines_missing": sum(r["match"] < 0.3 for r in aligned),
                   "voice_ok": f'{sum(r["voice_ok"] for r in aligned)}/{len(aligned)}', "review": g.get("review")}
        json.dump({"summary": summary, "lines": aligned}, open(os.path.join(d, "check.json"), "w", encoding="utf-8"),
                  ensure_ascii=False, indent=1)
        print(json.dumps(summary, ensure_ascii=False))


if __name__ == "__main__":
    main()
