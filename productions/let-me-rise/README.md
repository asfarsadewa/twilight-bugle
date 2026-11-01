# Let Me Rise

Biar Aku Terbit · 如日初升

A young scribe in an ancient Egyptian river town paints the heroes of the temple wall. She wants a story of her own. Meret sings the song in English. The music is a grand orchestral ballad.

Subtitles show the Indonesian line and the Mandarin line by default. English is on demand.

## Status

Take 2 is the master. The lyric sheet follows the words that take 2 sings. The theatre renders the first full cut from the cue sheet.

The art direction is Art Nouveau with Egyptian Revival motifs. `art/bible.md` locks the style.

## Puppetry

| Figure | Rig |
|---|---|
| Meret | A marionette. Strings run from her head and both hands to the fly loft. She comes down on them. |
| The Sky Mother, the ibises | Strings from the fly loft |
| The sun, the wall heroes, the barge, the sailboat, the jars, the town | Rods from below |
| The temple, her mother | Slide wires from the left wing |
| The river | A wave machine: three ground rows that rock against each other |

## Files

| File | Content |
|---|---|
| `story/bible.md` | Premise, world, characters, motifs, art direction and the story by section |
| `song/lyrics.json` | Lyric source: English sung lines, Indonesian and Mandarin translations |
| `song/brief.txt` | Musical brief for Lyria |
| `song/takes/<take>/` | One folder per take: audio, returned text, request, checks |
| `song/review.html` | Listening page for the takes |
| `song/master.json` | The song facts that the cue sheet reads: line times, sections, beats, vocal loudness |
| `art/bible.md` | Locked style text, cast and places |
| `art/make_prompts.py`, `art/gen_art.sh` | Prompts and generation for every art piece |
| `art/cut/` | Cut pieces: textures, relief maps and outlines |
| `art/cut/poster.webp` | The poster on the house wall. `tools/poster_prompt.py` writes its prompt. |
| `production.ts` | Pieces, homes, routes, rigs and the cue sheet |

The repository leaves out the takes, the listening page and the raw art in `art/src/`. The theatre plays `song/master.mp3` and `art/cut/`.

## Render

Run this command in `theatre/`.

```bash
node tools/render.mjs --p let-me-rise --video
```

## Make a take

Run these commands from the repository root.

```bash
python tools/song_prompt.py productions/let-me-rise/song
```

```bash
python tools/lyria_song.py --prompt-file productions/let-me-rise/song/prompt.txt --out productions/let-me-rise/song/takes --take t3
```

```bash
python tools/listen.py productions/let-me-rise/song t3
```

```bash
python tools/review_page.py productions/let-me-rise/song t1 t2 t3
```

## Lock the master

Run these commands from the repository root. The first command separates the vocal track.

```bash
python -m demucs --two-stems=vocals -n htdemucs -o productions/let-me-rise/song/takes/t2/stems productions/let-me-rise/song/takes/t2/original.wav
```

```bash
python tools/master.py productions/let-me-rise/song t2 --bpm 80
```
