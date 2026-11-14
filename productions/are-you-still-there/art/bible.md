# Art bible: 형은 여기 있다 · Your Brother Is Here

Version 2, revised after the user's correction. The cause of the separation must remain visible: the war, opposing troops, refugees, Min holding the crossing and the bridge being severed. The present is a country still divided by that war, with Chol on the relatively more developed bank and a poorer rural shore across the water. Neither side is named. Version 1 is retained in `bible-v1.md`; its key art is `key-art-v1.png`.

Every new image request starts with the locked text below. The charcoal, ink and hanji material stays consistent. `make_revision_prompts.py` writes the current prompts. The old `make_prompts.py` reproduces version 1 only.

The sky is always the theatre's lit cyclorama. Generated scenery has transparent sky above its cut edge. Light, rain, haze and smoke belong to the stage.

## Locked text

<!-- locked:start -->
STYLE: A grand hand-made toy theatre production built from printed card. Every piece is a flat cutout of thick card about 4 mm thick, cut by hand with a craft knife, with raw brown card at the edges. The face is painted in soft charcoal line and grey ink wash with thin watercolour on warm Korean hanji mulberry paper, its long fibres visible. Loose expressive charcoal strokes and quiet, tender faces. Broad, calm shapes readable from the back row. Puppet joints are round brass split pins. Korea, many years after a war divided two brothers: the older one's near bank has concrete embankments, metal railings, streetlights and densely built apartment blocks; the far bank has sparse, worn rural houses, fields, dirt roads and a few dim lights. The river and the closed crossing still divide them. The present is dusk amber against indigo; the June 1950 memory is cold rain, refugees and opposing troops. Palette: hanji cream #EDE6D6, charcoal #2B2A28, slate #5E6670, mist #C9CDD0, earth #6E5A44, indigo #3B4A66, pine #4E5E48, persimmon #B4553A, dusk amber #D6A365, raw card #A57E52. Muted olive and mustard khaki distinguish the wartime uniforms; plain blue and plain red cloth banners carry no marks. Family love and the lasting wound of war, with equal humanity on both banks.
CONSTRAINTS: No text, writing, lettering, numbers, country names, logos, signature or watermark. No national flags, insignia, emblems, armbands or badges. Plain unmarked red or blue cloth banners are allowed in the war memory. Rifles remain slung and no weapon is fired. No gore or graphic violence. No real persons. No photographic people, plastic, glossy finish, anime style or sculpted 3D characters. Everything remains painted flat card. No triumphant propaganda or caricatures. Rods, strings, light and sky are supplied by the theatre.
<!-- locked:end -->

## Cast and continuity

- **Older Cheol:** the same strong, kind face as the young Cheol in Hyeong, now lined, with short white hair. A worn grey-brown coat over a cream shirt, faded indigo scarf, dark trousers and worn shoes. He stands slightly stooped. One hand rests on a plain wooden cane; the other can reach across the river. No medals or uniform.
- **Young Cheol and Min:** Hyeong's original jointed card marionettes, with their existing rig calibration. They are memories, never an answering presence in the present-day village.
- **Mother:** Hyeong's original slide card at the rice handoff. The original boys and gate assets are retained in the continuity archive; the finished cue sheet concentrates on the military crossing and the divided present.

## Set

The present is viewed from Chol's side. A paved embankment, metal rail, streetlamp and closed crossing are downstage; a modern apartment skyline rises behind that near shore. The sparse rural settlement belongs to the far bank. Their contrast must be readable in the same wide frame. No new bridge joins them.

The June memory shows a refugee crossing under military pressure, the two opposing lines and the severed bridge. Troops are principal story pieces. The river stays while the country around it changes from war to a materially unequal peace. The closed access gate and broken crossing keep the cause visible in the present.

Keep the calibrated elder, rice, reeds and continuity cast. New revision art: a modern near-bank skyline, a paved observation embankment and closed access gate, a poorer rural far bank, a low indigo open-water row, revised key art and a revised poster. Use `key-art-v2.png` as the style and geography reference. Generate each separately with the built-in image tool and retain prompts and receipts.

The poster leaves plain bands above and below for the theatre's printed titles. No generated lettering.

## Physical rules

Puppets hang from head and hand strings. Flats fly, scenery slides on visible wires, props rise on rods. Transparent cutouts receive traced solid outlines and paint relief through `tools/cutout.py`. Puppet pin coordinates are calibrated against the actual generated parts, never guessed from a prompt. New set pieces are checked as rendered stills before the full video.
