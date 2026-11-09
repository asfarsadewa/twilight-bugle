# 少年回声

Echoes of Youth · Gema Masa Remaja

A grown man comes back to the basketball court of his old school. He opens the tin box of letters he and his friends buried at fourteen. Xiaoyu sings the song in Mandarin.

The surtitles show the Chinese line and the Indonesian line. Buttons on the programme add English and pinyin.

## Status

The song came ready as an MP3. `tools/listen.py` timed its 44 lines, and `tools/master.py` locked it as the master.

The art direction is a schoolboy's drawing in ballpoint and coloured pencil on a page of a Chinese exercise book of the 1990s. `art/bible.md` locks the style. The school uniform is the plain blue-and-white tracksuit, with no badges, scarves or slogans.

## Puppetry

| Figure | Rig |
|---|---|
| Xiaoyu and the boy he was | Strings run from the head and both hands to the fly loft. |
| The running boys, Lin Na, the bicycles, the green train and the grown friends | Cards on slide wires from the wings |
| The court, the plane tree, the tin box, the desk, the floodlight and the fallen boy | Rods from the trap |
| The city, the school, the corridor, the station and the clouds | Flown in from the loft |

## Files

| File | Content |
|---|---|
| `story/bible.md` | Cast, motifs and the story by section |
| `song/make_sheet.py` | Writes the lyric sheet with the pinyin, Indonesian and English lines |
| `song/lyrics.json`, `song/master.json` | Lyric source and the song facts that the cue sheet reads |
| `art/bible.md`, `art/make_prompts.py`, `art/gen_art.sh` | Locked style text, prompts and generation |
| `art/cut/` | Cut pieces: textures, relief maps and outlines |
| `production.ts` | Pieces, rigs and the cue sheet |

## Render

Run this command in `theatre/`.

```bash
node tools/render.mjs --p shaonian-huisheng --video
```
