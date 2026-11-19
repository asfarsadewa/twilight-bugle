# ふるさとが見える

I Can See Home · Kampung Halaman Terlihat · 看得见故乡

Show XIV of the Twilight Bugle. The story takes place in Meiji Japan. At twelve, Hana crosses a snowy mountain pass to reel silk in a valley mill. She sends her wages home. At sixteen the cough comes. Her thread turns red. The mill puts her out at the gate. Porters carry her to the foot of the pass on a door board. Her brother Kichi runs down through the blizzard and carries her up the pass on his back. At dawn on the summit she sees their valley and the lamp of their farmhouse. She dies there. He carries her down. In spring their youngest sister, Yuki, ties her straw sandals. Kichi walks her up to the summit. She goes on to the mill.

The show follows the [standing production brief](../../docs/production-brief.md). Hana does not come back. The light at the end is what the family does for each other: Hana sends her wages, Kichi carries her through the night, and he walks the next sister to the top.

The surtitles show the Japanese line and the Indonesian line. A button on the programme adds English.

## Song

The producer supplied `ふるさとが見える.mp3` on 19 November 2026: 4:57.6, Suno id `9702ee12-06b6-4d55-a1bb-cefda1b092da`. `song/master.mp3` is an unchanged copy. `song/master-source.json` holds its hash and the embedded words.

The words embedded in the MP3 repeat some lines under extra section tags. The embedded words also put "妹は そこで 眠った" at the end of chorus 1. The Scribe transcript shows the sung order. The singers follow the handoff. Hana sings the first line of verse 3 twice. The sheet follows the recording, with 49 lines. Scribe gives word times only. No listening model reviewed the music. The producer gives the final musical earcheck. `song/timing-notes.md` lists the gaps the staging uses.

The Suno handoff is in `song/suno-style.txt`, `song/suno-exclude.txt` and `song/suno-lyrics.txt`.

## Art

The style is the Meiji colour woodblock print, nishiki-e, without its cartouches, seals or lettering. `art/bible.md` locks the style. Every image uses `gpt-image-2.6-sunburst` through the bundled imagegen CLI: the key art, 21 piece sheets and the poster. `art/receipts/` records the model, settings and hashes of each one.

## Puppetry

| Figure | Rig |
|---|---|
| Hana and Kichi | Marionettes. Strings run from the head and both hands to the fly loft. She ties her sandals, draws the thread, writes her letter, coughs and reaches for the lamp. He runs, kneels, reaches for her and waves. |
| Kichi carrying Hana | One marionette with two heads on brass pins. He turns his head back to her. Her head lifts on his shoulder. The pair climbs the zigzag path, slips and gets up. |
| Hana's reel and the thread | Her reel turns on its pin. A white thread runs from its hub to her hand. In verse 3 a red thread takes its place and goes slack. |
| The reels, the mill and the gate | The reels hang from the fly loft and turn on the beat. The mill and the gate fly in. |
| The reeling floor | A row on a rod from the trap. The girls bend on the beat of the mill song. It sinks into the steam for Hana's dream. |
| The slope, the range, the valley, the farmhouse and the cedars | Rods from the trap |
| The roped line of girls, Mother, the porters, Yuki, the bell and the paper lamp | Cards on slide wires |
| Hana in the snow and the clouds | Strings from the fly loft |
| The snow | The stage snow effect, from a light fall to the blizzard |
| The farmhouse lamp | The theatre's warm practical light. It burns in the dream, on the climb and in the valley below the summit. |

## Files

| File | Content |
|---|---|
| `story/bible.md` | The story, the check against the brief, the cast and the scene plan |
| `song/import_final.py`, `song/time_final.py` | Import the recording unchanged and time its words |
| `song/lyrics.json`, `song/master.json` | Japanese lines with Indonesian and English, and the song facts the cue sheet reads |
| `art/bible.md`, `art/make_prompts.py`, `art/gen_art.sh`, `art/receipt.py` | Locked style, prompts, generation and receipts |
| `art/cut/` | Cut pieces: textures, relief maps and outlines |
| `production.ts` | Pieces, rigs and the cue sheet |

## Render

Run this command in `theatre/`.

```bash
node tools/render.mjs --p furusato-ga-mieru --video
```
