# Bintang Senja

暮星 · The Evening Star

A star falls at twilight. A young bugler carries her back to the sky. He loses her to save her. The star sings the song in Indonesian. The trumpet is the bugler's voice.

Subtitles show the Indonesian sung line and the Mandarin line by default. English is on demand.

## Status

Take 2 is the master. The theatre renders the first full cut from the cue sheet.

## Puppetry

| Figure | Rig |
|---|---|
| Kirana | A marionette. Strings run from her crown and both hands to the fly loft. She comes down on them into the reeds, and she rises on them into the sky. |
| Bayu | A rod puppet |
| The star, the cloud border | Strings from the fly loft |
| The fort, the reeds, the pines | Slide wires from their wings |
| The Hollow Hounds | Slide wires from both wings |

## Files

| File | Content |
|---|---|
| `story/bible.md` | Premise, world, characters, motifs and the story by section |
| `song/lyrics.json` | Lyric source: Indonesian sung lines, Mandarin and English translations |
| `song/brief.txt` | Musical brief for Lyria |
| `song/takes/<take>/` | One folder per take: audio, returned text, request, checks |
| `song/review.html` | Listening page for the takes |
| `song/master.json` | The song facts that the cue sheet reads: line times, sections, beats, vocal loudness |
| `art/bible.md` | Locked style text, cast and places |
| `art/make_prompts.py`, `art/gen_art.sh` | Prompts and generation for every art piece |
| `art/cut/` | Cut pieces: textures, relief maps and outlines |
| `art/cut/poster.webp` | The poster on the house wall. `tools/poster_prompt.py` writes its prompt. |
| `production.ts` | Pieces, homes, routes and the cue sheet |

The repository leaves out the takes, the listening page and the raw art in `art/src/`. The theatre plays `song/master.mp3` and `art/cut/`.

## Render

Run this command in `theatre/`.

```bash
node tools/render.mjs --p bintang-senja --video
```

## Make a take

Run these commands from the repository root.

```bash
python tools/song_prompt.py productions/bintang-senja/song
```

```bash
python tools/lyria_song.py --prompt-file productions/bintang-senja/song/prompt.txt --out productions/bintang-senja/song/takes --take t3
```

```bash
python tools/listen.py productions/bintang-senja/song t3
```

```bash
python tools/review_page.py productions/bintang-senja/song t1 t2 t3
```

## Lock the master

Run these commands from the repository root. The first command separates the vocal track.

```bash
python -m demucs --two-stems=vocals -n htdemucs -o productions/bintang-senja/song/takes/t2/stems productions/bintang-senja/song/takes/t2/original.wav
```

```bash
python tools/master.py productions/bintang-senja/song t2 --bpm 92
```
