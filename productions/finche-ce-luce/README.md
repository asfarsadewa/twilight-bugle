# Finché c'è luce

As Long as There Is Light · Selama Masih Ada Cahaya · 只要还有光

Show XIII of the Twilight Bugle. A fishing village on a rocky southern coast builds a lighthouse. Its beam brings the boats home for twenty years. On the night of the great storm the clockwork breaks. Matteo turns the lens by hand, and Lucia carries the oil up the stair. The beam brings every boat home except their son Nino's. At dawn the sea returns his boat, empty. The next evening Lucia says: "Accendi, Matteo. È sera." They light it again.

The show follows the [standing production brief](../../docs/production-brief.md). Nino does not come back. The light at the end is their work: the wheel turned and the stair climbed for the sons of other mothers.

The surtitles show the Italian line and the Indonesian line. A button on the programme adds English.

## Song

The producer supplied `Finché c’è luce.mp3` on 18 November 2026: 4:18.0, Suno id `b79c8538-dc06-42c5-9c0c-d3a40f5f39a1`. `song/master.mp3` is an unchanged copy. `song/master-source.json` holds its hash and the embedded words. All 57 sung lines match the handoff. Scribe gives word times only. No listening model reviewed the music. The producer gives the final musical earcheck. `song/timing-notes.md` lists the gaps the staging uses.

The Suno handoff is in `song/suno-style.txt`, `song/suno-exclude.txt` and `song/suno-lyrics.txt`. The chorus was rewritten once around a short hook after the first two takes.

## Art

The style is the Italian maritime ex-voto of the 1800s, without its holy figures or its lettering. `art/bible.md` locks the style. Every image uses `gpt-image-2.6-sunburst` through the bundled imagegen CLI: the key art, 23 piece sheets and the poster. `art/receipts/` records the model, settings and hashes of each one. `art/prepare.py` cuts the tower painting into four drums.

## Puppetry

| Figure | Rig |
|---|---|
| Matteo and Lucia | Marionettes. Strings run from the head and both hands to the fly loft. He hauls, winds and turns the great wheel. She carries water and oil, climbs the stair and kneels. |
| The tower | Four drums rise from the trap, one course per line of verse 1. The lantern room flies down onto them. |
| The beam | The theatre's real spot, placed in the lantern and swept through the haze across the sea and the house |
| The stone, the weight, the baby's basket, the wheel and the moon | Strings from the fly loft. The weight drops through the trap when the chain snaps. |
| The sea | A wave machine: three rows that rock against each other, harder in the storm |
| The boats, the haulers, the boy and the empty boat | Cards on slide wires. The boats pitch on the swell. |
| The cliff, the quay and the women with lanterns | Rods from the trap |
| The rain | The stage rain effect, from the second chorus to the grey dawn |

## Files

| File | Content |
|---|---|
| `story/bible.md` | The story, the check against the brief, the cast and the scene plan |
| `song/import_final.py`, `song/time_final.py` | Import the recording unchanged and time its words |
| `song/lyrics.json`, `song/master.json` | Italian lines with Indonesian and English, and the song facts the cue sheet reads |
| `art/bible.md`, `art/make_prompts.py`, `art/gen_art.sh`, `art/receipt.py` | Locked style, prompts, generation and receipts |
| `art/cut/` | Cut pieces: textures, relief maps and outlines |
| `production.ts` | Pieces, rigs and the cue sheet |

## Render

Run this command in `theatre/`.

```bash
node tools/render.mjs --p finche-ce-luce --video
```
