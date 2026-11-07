# Urip Maneh

再世相逢 · Alive Again · Hidup Kembali

Two souls miss each other across four lives in Java. A kayon ends each life. In the last life, she finds her own face on an old temple wall. Bayu sings the song in Javanese.

The surtitles show the Javanese line and the Chinese line. A button on the programme adds English.

## Status

The song is take A of the film *Urip Maneh* in the sibling repository mini-mv-studio. The theatre renders its own version from the cue sheet.

The art direction is wayang beber, the old Javanese painted scroll. `art/bible.md` locks the style.

## Puppetry

| Figure | Rig |
|---|---|
| The carver, the clerk, the man and the woman of today | Strings run from the head and both hands to the fly loft. |
| The noblewoman, the young couple of the 1990s, the ship and the crowd | Cards on slide wires from the wings |
| The two souls | Wayang kulit figures on rods against the lit screen |
| The kayon | A rod. It crosses the stage at each change of life. |
| The blank stone | It sinks through the trap a step at each mallet blow. The carved face shows above it. |
| The river | A wave machine: two rows that rock against each other |

## Files

| File | Content |
|---|---|
| `story/bible.md` | Premise, cast, motifs and the story by section |
| `song/import_take.py` | Writes the song sheets from the film's brief |
| `song/lyrics.json` | Javanese sung lines, Chinese and English translations |
| `song/master.json` | The song facts that the cue sheet reads |
| `art/bible.md`, `art/make_prompts.py`, `art/gen_art.sh` | Locked style text, prompts and generation |
| `art/cut/` | Cut pieces: textures, relief maps and outlines |
| `production.ts` | Pieces, rigs and the cue sheet |

## Render

Run this command in `theatre/`.

```bash
node tools/render.mjs --p urip-maneh --video
```
