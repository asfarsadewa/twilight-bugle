#!/usr/bin/env python3
"""Get transcript word times for the approved song. No musical listening review."""
import importlib.util
import json
from pathlib import Path

SONG = Path(__file__).resolve().parent
ROOT = SONG.parents[2]
TAKE = SONG / "takes" / "suno-final"


def main():
    spec = importlib.util.spec_from_file_location("theatre_listen", ROOT / "tools" / "listen.py")
    listen = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(listen)
    transcript_path = TAKE / "scribe.json"
    state_path = TAKE / "scribe-submission.json"
    if not transcript_path.exists():
        if state_path.exists():
            raise RuntimeError("A transcription was already submitted; inspect its state before resubmitting")
        state_path.write_text(json.dumps({"status": "submitted", "purpose": "Korean lyric timestamps only", "provider": "ElevenLabs Scribe v2"}), encoding="utf-8")
        result = listen.scribe(str(TAKE / "take.mp3"), "ko")
        transcript_path.write_text(json.dumps(result, ensure_ascii=False, indent=1), encoding="utf-8")
        state_path.write_text(json.dumps({"status": "complete", "purpose": "Korean lyric timestamps only", "provider": "ElevenLabs Scribe v2"}), encoding="utf-8")
    transcript = json.loads(transcript_path.read_text(encoding="utf-8"))
    lines = json.loads((TAKE / "lines.json").read_text(encoding="utf-8"))
    aligned = listen.align(lines, listen.sung_tokens(transcript["words"], "ko"), "ko")
    summary = {"take": "suno-final", "lyric_match": round(sum(x["match"] for x in aligned) / len(aligned), 3), "review": None, "musical_earcheck": "user_approved", "purpose": "transcription for staging and surtitles"}
    (TAKE / "check.json").write_text(json.dumps({"summary": summary, "lines": aligned}, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    for row in aligned:
        print(f"{row['n']:2d} {row['start']}..{row['end']} {row['match']:.2f} {row['text']}")


if __name__ == "__main__":
    main()
