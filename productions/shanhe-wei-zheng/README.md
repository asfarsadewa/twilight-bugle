# 山河为证

Biar Tanah Air Menjadi Saksi · Let the Land Bear Witness

A boy of sixteen joins the Long March of 1934 to 1935. He walks from the rivers of Jiangxi to the loess hills of the north. He loses his comrades on the way. Shitou sings the song in Mandarin. The music is a solemn orchestral anthem with erhu, dizi and suona.

Subtitles show the Indonesian line and the English line.

## Status

Take 3 is the master. The theatre renders the first full cut from the cue sheet.

The first two takes had a marching snare. The brief for takes 3 to 6 asks for firm chord progressions, timpani and a broad half-time pulse. Take 3 keeps every line. It ends on a full orchestral chord.

The art direction is a Chinese woodcut print of the 1930s. `art/bible.md` locks the style. The pieces show no political emblem except the plain red star on a cap. Flags are plain red.

## Puppetry

| Figure | Rig |
|---|---|
| Shitou | Strings run from his cap and both hands to the fly loft. He comes down on them. |
| The moon, the geese, the lanterns | Strings from the fly loft |
| His mother, Old Zhao, the villagers, the column, the climbers on the chains | Slide wires from the wings |
| The village, the floating bridge, the loess hills | Slide wires from the wings |
| The mountains, the chain bridge | Flown in from the loft |
| The snow peak, the grassland, the fallen, the sun | Rods from the trap |
| The river | A wave machine: two rows that rock against each other |

## Files

| File | Content |
|---|---|
| `story/bible.md` | Premise, the real places and dates, characters, motifs and the story by section |
| `song/lyrics.json` | Lyric source: Mandarin sung lines, Indonesian and English translations |
| `song/brief.txt` | Musical brief for Lyria |
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
node tools/render.mjs --p shanhe-wei-zheng --video
```

## Make a take

Run these commands from the repository root.

```bash
python tools/song_prompt.py productions/shanhe-wei-zheng/song
```

```bash
python tools/lyria_song.py --prompt-file productions/shanhe-wei-zheng/song/prompt.txt --out productions/shanhe-wei-zheng/song/takes --take t7
```

```bash
python tools/listen.py productions/shanhe-wei-zheng/song t7
```

## Lock the master

Run these commands from the repository root. The first command separates the vocal track.

```bash
python -m demucs --two-stems=vocals -n htdemucs -o productions/shanhe-wei-zheng/song/takes/t3/stems productions/shanhe-wei-zheng/song/takes/t3/original.wav
```

```bash
python tools/master.py productions/shanhe-wei-zheng/song t3 --bpm 70
```
