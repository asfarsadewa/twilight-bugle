# Держись, лёд

Hold, Ice · Bertahanlah, Es · 冰啊，撑住

Show XVI of the Twilight Bugle. The story takes place in the siege of Leningrad, from the winter of 1941 to the spring of 1942. A road of lanterns crosses the frozen lake. Trucks carry flour into the city on it. They carry children out. Alyosha is nineteen and drives one of the trucks. His mother gives her bread ration to his little sister, Masha. He comes home and finds his mother dead in her chair. Her bread lies untouched. He carries Masha out and drives her over the ice to the train on the far shore. Then he turns the truck back onto the thawing ice. In April the ice does not hold. Years later, Masha stands at the open water.

The show follows the [standing production brief](../../docs/production-brief.md). The mother and Alyosha do not come back. The light comes from what they do. The mother gives her bread. Alyosha turns back for one more run. Masha keeps waiting at the water.

The surtitles show the Russian line and the Indonesian line. A button on the programme adds English.

## Song

The producer supplied `Держись, лёд (1).mp3` on 20 November 2026: 4:04.9, Suno id `bd628c3c-efe0-4033-8e5d-6f26d242b989`. It replaces the take of 19 November, which was the wrong file. `song/master.mp3` is an unchanged copy. `song/master-source.json` holds its hash and the embedded words.

The embedded words repeat some lines under doubled section tags. The Scribe transcript of the vocal stem shows the sung order. The sheet follows the recording, with 51 lines. Scribe gives word times only. No listening model reviewed the music. The producer gives the final musical earcheck. `song/timing-notes.md` lists the gaps the staging uses.

The Suno handoff is in `song/suno-style.txt`, `song/suno-exclude.txt` and `song/suno-lyrics.txt`.

## Art

The style is the Russian lacquer miniature in the Palekh manner: egg tempera on black lacquer, with fine gold hatching. `art/bible.md` locks the style. Every image uses `gpt-image-2.6-sunburst` through the bundled imagegen CLI: the key art, 21 piece sheets and the poster. `art/receipts/` records the model, settings and hashes of each one. No piece shows a star, a flag, a badge, an insignia, a portrait, a church dome, a cross or a weapon. The first key art had a small badge on Alyosha's cap. The image was made again without it.

## Puppetry

| Figure | Rig |
|---|---|
| Alyosha and Masha grown | Marionettes. Strings run from the head and both hands to the fly loft. He kneels to Masha, bends his head and waves from the truck. She lifts her hand to the far light on the water. |
| The truck | A card on a slide wire. It bucks over the ice ridges on the beat. It turns to drive back. It tips and sinks behind the thawing ice. Its cab light is the theatre's warm practical light. |
| Mother at the table and Mother still | Rods from the trap. The card dips on each cut of the bread. |
| The bread scale | A card on a string from the fly loft. Its pans settle. |
| Little Masha, the children, the lantern girl, the convoy and the train | Cards on slide wires |
| Alyosha carrying Masha | A card on a slide wire |
| The room | A flat from the fly loft |
| The lake, the city, the lantern posts, the far shore, the ice, the thaw and the open water | Rods from the trap |
| The clouds | Strings from the fly loft |
| The snow | The stage snow effect, from a light fall to the blizzard |

## Files

| File | Content |
|---|---|
| `story/bible.md` | The story, the check against the brief, the cast and the motifs |
| `song/import_final.py`, `song/time_final.py` | Import the recording unchanged and time its words |
| `song/lyrics.json`, `song/master.json` | Russian lines with Indonesian and English, and the song facts the cue sheet reads |
| `art/bible.md`, `art/make_prompts.py`, `art/gen_art.sh`, `art/receipt.py` | Locked style, prompts, generation and receipts |
| `art/cut/` | Cut pieces: textures, relief maps and outlines |
| `production.ts` | Pieces, rigs and the cue sheet |

## Render

Run this command in `theatre/`.

```bash
node tools/render.mjs --p derzhis-lyod --video
```
