#!/usr/bin/env python3
"""Import the user-approved Suno file without changing its audio. No model calls."""
import hashlib
import json
from pathlib import Path
import re
import shutil
import subprocess

SONG = Path(__file__).resolve().parent
SOURCE = Path(r"C:\Users\asfar\Downloads\형은 여기 있다.mp3")
TAKE = SONG / "takes" / "suno-final"
TITLE = {"ko": "형은 여기 있다", "en": "Your Brother Is Here", "id": "Kakak Ada di Sini", "zh": "哥在这里"}


def main():
    TAKE.mkdir(parents=True, exist_ok=True)
    info = json.loads(subprocess.run(["ffprobe", "-v", "error", "-show_format", "-show_streams", "-of", "json", str(SOURCE)], capture_output=True, text=True, encoding="utf-8", check=True).stdout)
    digest = hashlib.sha256(SOURCE.read_bytes()).hexdigest()
    destination = TAKE / "original.mp3"
    if destination.exists() and hashlib.sha256(destination.read_bytes()).hexdigest() != digest:
        raise ValueError("A different final file already exists; preserve it before importing a revision")
    shutil.copyfile(SOURCE, destination)
    shutil.copyfile(SOURCE, TAKE / "take.mp3")
    if not (TAKE / "original.wav").exists():
        subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", str(destination), "-map", "0:a:0", "-c:a", "pcm_s16le", str(TAKE / "original.wav")], check=True)
    duration = float(info["format"]["duration"])
    tags = info["format"].get("tags", {})
    receipt = {"take": "suno-final", "provider": "Suno", "source_name": SOURCE.name, "title": TITLE, "duration_seconds": duration, "sha256": digest, "audio_approved_by": "user", "source_suno_id": re.search(r"id=([0-9a-f-]+)", tags.get("comment", "")).group(1)}
    (TAKE / "request.json").write_text(json.dumps(receipt, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    (SONG / "master-source.json").write_text(json.dumps(receipt, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    (TAKE / "embedded-lyrics.txt").write_text(tags.get("lyrics-eng", ""), encoding="utf-8")
    sheet = json.loads((SONG / "lyrics.json").read_text(encoding="utf-8"))
    sheet["title"] = TITLE
    sheet["about"] = "At dusk, Cheol looks across the river towards home and calls the little brother he has not seen since the war."
    (SONG / "lyrics.json").write_text(json.dumps(sheet, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    shutil.copyfile(SONG / "lines.json", TAKE / "lines.json")
    manifest_path = SONG / "auditions.json"
    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    manifest.update(selected_take="suno-final", selection_status="user_approved_final", final_source="master-source.json")
    manifest_path.write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")
    print(f"Imported {SOURCE.name}: {duration:.3f}s, SHA-256 {digest}")


if __name__ == "__main__":
    main()
