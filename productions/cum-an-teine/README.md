# Cùm an Teine

Keep the Fire · Jagalah Api · 守住炉火

Show XV of the Twilight Bugle. The story takes place in the Scottish Highlands in 1845, in the Clearances. A peat fire has burned in one family's hearth for two hundred years. The estate clears the glen for sheep. Men pull the roof down. Seonag gives her son Ewan the last ember in an iron pot. The glen walks to the shore. Seonag dies there in her sleep. Ewan lays the hearthstone on her cairn. In the storm at sea, Ewan holds the pot high above the waves. A wave breaks over him, and the ember goes out. On a cold new shore in the snow, Morag strikes the flint again and again. Ewan cups his hands round the spark. They light a new fire.

The show follows the [standing production brief](../../docs/production-brief.md). Seonag, the glen and the old fire do not come back. The new fire is not the old fire. The light at the end is what Ewan and Morag still do with their hands.

The surtitles show the English line and the Indonesian line. The Gaelic lines keep their Gaelic.

## Song

The producer supplied `Cùm an Teine.mp3` on 19 November 2026: 4:33.2, Suno id `ba686702-6c99-422a-b549-cda958deae8f`. `song/master.mp3` is an unchanged copy. `song/master-source.json` holds its hash and the embedded words.

The embedded words follow the handoff. The Scribe transcript of the vocal stem shows a different end. The sheet follows the recording, with 48 lines. Scribe gives word times only. No listening model reviewed the music. The producer gives the final musical earcheck. `song/timing-notes.md` lists the gaps the staging uses.

The Suno handoff is in `song/suno-style.txt`, `song/suno-exclude.txt` and `song/suno-lyrics.txt`.

## Art

The style is the Victorian wood engraving of the 1840s illustrated newspapers, tinted by hand with thin watercolour. `art/bible.md` locks the style. Every image uses `gpt-image-2.6-sunburst` through the bundled imagegen CLI: the key art, 23 piece sheets and the poster. `art/receipts/` records the model, settings and hashes of each one. No piece shows a clan tartan, a crest, a flag, a thistle or a saltire.

## Puppetry

| Figure | Rig |
|---|---|
| Ewan, Morag and Seonag | Marionettes. Strings run from the head and both hands to the fly loft. Ewan cuts peat and carries the pot. Morag beats the cloth and strikes the flint. Seonag banks the fire and gives the ember. |
| The ember pot | A card held in Ewan's near hand. The engine pins its handle to his palm. Its glow and the theatre's warm practical light go out when the wave breaks. |
| The croft and its thatch | Rods from the trap. The thatch sits on the walls. The men's pulls tip it. It falls into the walls. |
| The waulking women | A row on a rod from the trap. They beat the cloth on the beat. |
| The men, the folk on the road, Morag with the baby and the ship | Cards on slide wires |
| The glen, the shore, the deck, the waves, the new shore, the hearth, the cairn, Seonag asleep and the kneeling pair | Rods from the trap |
| The great wave | A card on a slide wire. It rears over Ewan and breaks. |
| The clouds and the notice | Strings from the fly loft |
| The snow, the spray and the dust | The stage effects |

## Files

| File | Content |
|---|---|
| `story/bible.md` | The story, the check against the brief, the cast and the scene plan |
| `song/import_final.py`, `song/time_final.py` | Import the recording unchanged and time its words |
| `song/lyrics.json`, `song/master.json` | English and Gaelic lines with Indonesian and Chinese, and the song facts the cue sheet reads |
| `art/bible.md`, `art/make_prompts.py`, `art/gen_art.sh`, `art/receipt.py` | Locked style, prompts, generation and receipts |
| `art/cut/` | Cut pieces: textures, relief maps and outlines |
| `production.ts` | Pieces, rigs and the cue sheet |

## Render

Run this command in `theatre/`.

```bash
node tools/render.mjs --p cum-an-teine --video
```
