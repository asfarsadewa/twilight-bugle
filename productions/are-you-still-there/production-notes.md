# Production notes: 형은 여기 있다

## The final source

The user delivered `형은 여기 있다.mp3` from Suno and supplied the 36 Korean lines. The master is that unchanged MP3, 242.800 seconds. The titles are 형은 여기 있다 · Your Brother Is Here · Kakak Ada di Sini · 哥在这里. Keep the folder id `are-you-still-there` for the earlier listening links and development history. The source hash and receipt are in `song/master-source.json`.

## Dramatic contract

**The war must visibly cause the separation.** Refugees escape against marching troops. Chol crosses to safety. Min stays to hold the crossing as the opposing line closes behind him, then cuts the bridge. Both armies and the broken crossing remain in view through the second chorus. This must never read as an ordinary farewell on a bridge.

The two banks remain fixed through time: Chol LEFT, Min RIGHT. The new viewpoint reverses the original theatre's view so the developed near bank belongs to the older man. In the present, apartment blocks, lit windows, concrete paving, metal rails and a streetlamp surround Chol's side. Sparse worn houses, fields, an unpaved track and few dim lights mark the far shore. The closed gate and the old broken crossing prevent the landscape from implying that he could simply walk over. Neither side is named. Plain blue and red wartime cloths distinguish the opposing lines; they have no national markings. The uniforms, refugees and troop movements carry the military meaning.

Min and Chol are blood brothers, as the user established. Their mother and the rice bundle make the military separation personal. Chol has aged; Min remains nineteen only in his memories. Min's present fate is unknown. There is no reply, actual reunion, grave, death scene or present-day puppet on the far bank. Chol bows alone.

## Source continuity

The original theatre's `productions/hyeong/production.ts` and the sibling `C:/Users/asfar/repo/mini-mv-studio/mvs/hyeong/` were reviewed: `brief.json`, `film.py`, `plates/generate.py`, and `review/notes.json`. At 113.02 seconds the original review expressly asks for military presence and marching soldiers because the emotional delivery depends on them. The original film shows refugees crossing, soldiers marching against them, Min cutting the bridge, and opposing uniforms with plain cloth banners behind the brothers. These are principal story events here, not optional background decoration. The user's later blood-brother decision supersedes the earliest brief's friend description.

The first local look test omitted that causal sequence and showed a traditional village on both sides. The user rejected that framing. It is retained locally as a development record only. `art/bible.md`, revision-2 prompts, the new set and `cues.ts` implement the corrected direction.

## Story on the locked master

| Song time | Section | Stage |
|---|---|---|
| 0–10 | Intro | The traveller opens on the original wound: two opposing lines, the brothers on separate banks and a severed crossing in cold rain. |
| 10–19 | Passage of decades | Soldiers withdraw; young uniformed Chol is replaced at the same left mark by the white-haired man. Apartments, the observation rail and closed gate arrive. Sparse rural houses appear on the right. The river and bridge remains stay. |
| 19–37 | Verse 1 | The unequal banks share one wide frame. A far window lights; Chol sees Min at nineteen in cold memory, then the memory is flown away. |
| 39–47 | Pre-chorus | Reeds sway; the remembered call returns in the wind. |
| 48–75 | Chorus 1 | Chol reaches from the developed bank towards the dim far shore. The gate remains closed and no person answers. |
| 75–95 | June memory | Modern infrastructure leaves in view. Rain, the full crossing, Mother and the young brothers return. Refugees flee LEFT while an olive column marches RIGHT. Min passes the rice. Chol crosses; Min stays. Opposing troops close in. |
| 96–105 | Pre-chorus 2 | Chol looks back from the escape bank. Min cuts the rope and the full bridge visibly tilts and falls. Broken ends emerge with a gap between them. |
| 106–125 | Chorus 2 | Hold the military division at full scale through four lines. Min stands before the khaki/red line; Chol before the olive/blue line. The bridge is gone. |
| 125–133 | War becomes divided peace | On “A house without you is no home,” Chol ages on the same mark. Troops recede; modern infrastructure grows on his bank. Min withdraws into the past. The far shore remains sparse, the crossing still barred. |
| 135–153 | Bridge | Old Chol stands by the life his brother asked him to keep. The barrier stays in the frame. |
| 153–176 | Orchestral lift | The war tableau returns at full scale, with the broken crossing and both military lines. Decades pass in view again, leaving the unequal present ready for the final call. |
| 176–203 | Final chorus | Chol takes one small step along his own observation rail. The gate stays locked through “let us go home together.” |
| 205–215 | Sung outro | He says his name and waits. The river gives no reply. |
| 215–243 | Instrumental coda | Dusk drains into blue night. The camera draws back; unequal lights, closed crossing and the wave machine remain. |
| 243–252 | Curtain call | The performer bows alone behind a half-open traveller. House lights return. |

Exact cues use `song/master.json`. Song zero is the first audio sample; preroll is 7 seconds and postroll 9 seconds. The estimated beat grid is not treated as a verified musical pulse. Dramatic actions use the approved lyric times.

## Pieces and rigs

| Piece | Mechanism |
|---|---|
| Older Chol | Four generated card parts; calibrated head and hand strings, cane reaching the floor |
| Young Chol and Min | Hyeong's original marionettes and pin calibration |
| Uniformed Chol | Hyeong's original rod card, at the older man's mark |
| Opposing lines, marching column and refugees | Original Hyeong pieces on slide wires, fixed directions and distinct uniforms |
| Modern city and sparse far bank | Separate new flown flats; transparent sky |
| Observation promenade | New slide card: paving, open metal railing, streetlamp, closed padlocked gate |
| Village and full bridge | Original flown memory flats; the bridge falls visibly before being struck |
| Broken crossing | Two paired card remnants with a gap |
| Rice bundle | Small rod prop between the brothers |
| Mother | Original slide card |
| River and reeds | Two counter-moving storm wave rows, an indigo open-water row for the present, and low scenery on rods/slide wires |
| Rain, haze and smoke | Time-driven theatre effects; one small far-shore chimney plume |

The revised key art is `art/key-art-v2.png`; the canonical `key-art.png` points to it. Original style art remains as `key-art-v1.png`. Every new image uses the locked charcoal, ink and hanji style and has a saved prompt and receipt. Raw generations stay in ignored `art/src/`. Cut WebPs, relief maps, traced contours and puppet calibration are runtime assets. The first promenade generation included an unwanted background; a separate native edit removes it.

## Checks and delivery

Review stills before the full video. Verify opposing armies, troop/refugee directions, rice handoff, actual bridge fall, stable bank geography, three passages from war to unequal peace, closed present gate, absence of an answering Min, title/surtitle layout, cane and puppet joints, coda and solo curtain call.

Run typecheck and build, check the programme and English toggle, change over from Hyeong and run an encore. Regenerate share cards. Decode the finished video and verify duration and audio timing against the unchanged master. Audio performance is approved by the user; Scribe is used for timestamps only, with no automated musical earcheck.
