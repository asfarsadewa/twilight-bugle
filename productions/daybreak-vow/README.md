# The Daybreak Vow

天明之约 · Janji Fajar

A prince and a princess sing a Mandarin duet. A war keeps them apart. The video is a cardboard puppet theatre. Subtitles show the Mandarin line and the Indonesian line by default. English is on demand.

## Status

Take 6 is the master. The theatre renders the first full cut from the cue sheet.

## Files

| File | Content |
|---|---|
| `story/bible.md` | Premise, world, characters, motifs and the story by song section |
| `song/lyrics.json` | Lyric source: Mandarin, English, Indonesian and the singer of each line |
| `song/brief.txt` | Musical brief for Lyria |
| `song/build_prompt.py` | Builds `prompt.txt`, `lyrics.md` and `lines.json` |
| `song/takes/<take>/` | One folder per take: audio, returned text, request, checks |
| `song/build_master.py` | Locks the master take: line times, singers, sections, beats, vocal loudness |
| `song/master.json` | The song facts that the cue sheet reads |
| `art/bible.md` | Locked style text, cast and places |
| `art/make_prompts.py`, `art/gen_art.sh` | Prompts and generation for every art piece |
| `art/cut/` | Cut pieces: textures, relief maps and outlines |
| `art/cut/poster.webp` | The poster on the house wall. `tools/poster_prompt.py` writes its prompt. |
| `production.ts` | Pieces, homes, routes and the cue sheet |

The repository leaves out the takes, the listening page and the raw art in `art/src/`. The theatre plays `song/master.mp3` and `art/cut/`.

## Render

Run these commands in `theatre/`.

```bash
node tools/render.mjs --p daybreak-vow --video
```

## Make a take

Run these commands from the repository root.

```bash
python productions/daybreak-vow/song/build_prompt.py
```

```bash
python tools/lyria_song.py --prompt-file productions/daybreak-vow/song/prompt.txt --out productions/daybreak-vow/song/takes --take t9
```

```bash
python tools/listen.py productions/daybreak-vow/song t9
```
