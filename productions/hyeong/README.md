# 형 먼저 가

Kak, Pergilah Dulu · Brother, Go First

June 1950, in the monsoon rain. Two friends walk south with the refugees. At a bridge, the younger one stays to hold it. Min sings the song in Korean. Cheol answers him in the final chorus.

The surtitles show the Korean line and the Indonesian line. A button on the programme adds English.

## Status

The song is the theme of the film Hyeong in mini-mv-studio, extended with Suno. The user gave the 3:47 cut as an MP3. `tools/listen.py` timed its 26 lines, and `tools/master.py` locked it as the master.

The art direction is a Korean painter's field sketchbook of 1950: charcoal and ink wash on hanji paper. `art/bible.md` locks the style. As in the film, the two sides are told apart only by their clothes, and each line carries one plain banner. No piece shows an insignia, an emblem or any violence.

## Puppetry

| Figure | Rig |
|---|---|
| Min and Cheol | Strings run from the head and both hands to the fly loft. |
| Mother, the refugees, the marching columns and the two boys | Cards on slide wires from the wings |
| The village, the hills, the bridge and the gate | Flown in from the loft. The bridge falls into the river. |
| The river | A wave machine: two rows that rock against each other |
| The fire, the sun, the two lines of soldiers and Cheol on the far bank | Rods from the trap |
| The rain | Streaks of light that fall through the whole show and stop on the last line |

## Files

| File | Content |
|---|---|
| `story/bible.md` | Premise, cast, motifs and the story by section |
| `song/make_sheet.py` | Writes the lyric sheet with the Indonesian and English lines |
| `song/lyrics.json`, `song/master.json` | Lyric source and the song facts that the cue sheet reads |
| `art/bible.md`, `art/make_prompts.py`, `art/gen_art.sh` | Locked style text, prompts and generation |
| `art/cut/` | Cut pieces: textures, relief maps and outlines |
| `production.ts` | Pieces, rigs and the cue sheet |

## Render

Run this command in `theatre/`.

```bash
node tools/render.mjs --p hyeong --video
```
