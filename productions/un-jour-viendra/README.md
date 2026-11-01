# Un jour viendra

终有一天 · Suatu Hari Nanti · A Day Will Come

A village boy joins the imperial army as its lowest servant. He sweeps the courtyards and carries the water. His spirit never goes out. Shan sings the song in French. The music is a cinematic anthem with erhu, dizi, guzheng and war drums.

Subtitles show the Indonesian line and the Mandarin line by default. English is on demand.

## Status

Take 2 is the master. The theatre renders the first full cut from the cue sheet. This show closes the repertoire with fireworks.

Take 2 skips the two extra lines of the final chorus. The lyric sheet follows the take. `song/takes/t2/fix.json` holds the times of the final chorus and the outro, read from the vocal track by hand.

The art direction is a solemn Chinese ink painting. `art/bible.md` locks the style.

## Puppetry

| Figure | Rig |
|---|---|
| Shan | A marionette. Strings run from his topknot and both hands to the fly loft. He comes down on them. |
| Shan with the yoke | A second figure that slides in for one line, as toy theatres swap figures |
| The ink dragon | Four strings from the fly loft |
| The crane, the moon, the lanterns, the clouds, the plum branch | Strings from the fly loft |
| Mei, the officer, the soldiers | Slide wires from the wings |
| The village, the camp, the wall | Slide wires from the wings |
| The army of the dream, the dragon banner | Rods from the trap |
| Fireworks | Sixteen shells in the final chorus and the curtain call |

## Files

| File | Content |
|---|---|
| `story/bible.md` | Premise, world, characters, motifs, art direction and the story by section |
| `song/lyrics.json` | Lyric source: French sung lines, Indonesian, Mandarin and English translations |
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
node tools/render.mjs --p un-jour-viendra --video
```

## Make a take

Run these commands from the repository root.

```bash
python tools/song_prompt.py productions/un-jour-viendra/song
```

```bash
python tools/lyria_song.py --prompt-file productions/un-jour-viendra/song/prompt.txt --out productions/un-jour-viendra/song/takes --take t3
```

```bash
python tools/listen.py productions/un-jour-viendra/song t3
```

```bash
python tools/review_page.py productions/un-jour-viendra/song t1 t2 t3
```

## Lock the master

Run these commands from the repository root. The first command separates the vocal track.

```bash
python -m demucs --two-stems=vocals -n htdemucs -o productions/un-jour-viendra/song/takes/t2/stems productions/un-jour-viendra/song/takes/t2/original.wav
```

```bash
python tools/master.py productions/un-jour-viendra/song t2 --bpm 84
```
