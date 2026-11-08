# Gema Masa Muda

青春回声 · Echo of Our Youth

A grown man remembers his school friends. The old school field still shines in his heart. Dimas sings the song in Indonesian.

The surtitles show the Indonesian line and the Chinese line. A button on the programme adds English.

## Status

The song came ready as an MP3. `tools/listen.py` timed its 46 lines, and `tools/master.py` locked it as the master.

The art direction is an old Indonesian school textbook of the 1980s. `art/bible.md` locks the style.

## Puppetry

| Figure | Rig |
|---|---|
| Dimas and the boy he was | Strings run from the head and both hands to the fly loft. |
| Sari, Ardi, the running children and the night bus | Cards on slide wires from the wings |
| The field, the flame tree, the class and the old desk | Rods from the trap |
| The school, the corridor, the blackboard, the clouds, the lamp and the paper planes | Flown in from the loft |

## Files

| File | Content |
|---|---|
| `story/bible.md` | Cast, motifs and the story by section |
| `song/make_sheet.py` | Writes the lyric sheet with the Chinese and English lines |
| `song/lyrics.json` | Lyric source |
| `song/master.json` | The song facts that the cue sheet reads |
| `art/bible.md`, `art/make_prompts.py`, `art/gen_art.sh` | Locked style text, prompts and generation |
| `art/cut/` | Cut pieces: textures, relief maps and outlines |
| `production.ts` | Pieces, rigs and the cue sheet |

## Render

Run this command in `theatre/`.

```bash
node tools/render.mjs --p gema-masa-muda --video
```
