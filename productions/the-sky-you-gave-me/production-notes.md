# Production notes: 你给我的星空

Show XI · The Sky You Gave Me · Langit yang Kauberikan.

## Locked recording and language

The user corrected the selected source on 15 November 2026 to **`你给我的星空 (1).mp3`** from Downloads. This MP3 is **325.200 seconds**, Suno id `4adbaac7-d385-41a8-a9a1-bdb2ba109250`, SHA-256 `e8a63b88bd672c415884d0b86df44ea39b4ede2595ea7cdd6d8e800a8d342c1d`. The master is copied unchanged from this exact file. All 52 embedded lyric lines match the handoff. The daughter alone sings in Mandarin. Chinese and Indonesian surtitles lead, with English and pinyin available on demand.

Scribe timestamps are for stage timing only. A fresh transcript aligns all 52 lines of the corrected recording, without the excerpt repair that was needed for the earlier file. Demucs recomputes the singing amplitude from this recording. No musical listening model or new music generation is used. The user remains the final earchecker. The estimated 123.05 BPM grid is not claimed as a verified pulse or meter and is unused by this score; principal actions use lyric boundaries.

The unsuffixed file supplied earlier was the wrong recording. Its original take, timing and score snapshot remain in ignored `song/takes/suno-final/`, and the former film/reports are in `render/superseded-wrong-recording/`. They are superseded and must not be published. The current take is `suno-final-corrected`.

## Dramatic contract

The mine accident explicitly causes the father's loss of sight. Show him entering the working mine, then show the support beam collapse and the working lamp go out. The household light stays on while the next lyric says he can no longer see her face. Do not substitute ordinary ageing for the accident.

The father's agency survives: he puts her acceptance letter back into her hands, learns the cane, listens to the star names and asks how brightly the planetarium stars shine. Her first telescope and his cane are presented at the same time. The certificate's embossed seal must be visible as something his fingers can feel.

Both are alive at the end. The star projector and star cloth turn off when she says she switches them off, then stay off. The final intimate scene takes place in one warm light; the stars return as traced knowledge in his palm, not magically restored vision. No death, hospital tragedy montage or supernatural reunion.

## Art and machinery

The user specifically requires `gpt-image-2.6-sunburst`. All 18 selected images are generated through the bundled imagegen CLI with that exact model id and a saved prompt/receipt. `art/key-art.png` is the selected model-specific key; `art/src/unselected/key-art-native-draft.png` is an unselected earlier draft with an unexposed backend id. Charcoal, graphite and luminous chalk pastel on blue-grey cotton paper distinguish the industrial town from the warm household lamp and enormous indigo planetarium.

Physical card pieces: the adult daughter is a four-part string marionette, with an alternate seated body for the last scene; the elderly father is a seated four-part string marionette so he can listen, nod and offer his palm. A rod card shows the young miner; another shows him learning the cane after the accident. The childhood table scene is a connected memory card. The town, mine and skeletal dome are scenery flats. A fallen support beam is a moving prop; the telescope, admission letter, certificate, projector and magnified paired hands are rod props. Low audience rows slide away when the applause ends.

Pins must be measured from the actual images. Seated and standing daughter poses reuse the same head/arms and preserve their physical scale. Calibrate their hand meeting against the real world-space rig endpoints. The magnified two-hands card is a theatrical close view of that same gesture, never a replacement for showing both people.

The user flagged the daughter's elongated neck. The head art carries its own neck, so the body mounts are lowered behind the collar: standing source coordinate `[551,95]`, seated `[508,108]`. This lowers her head about 0.042 stage units in either pose while preserving her face, head size, arms and hand meeting. The corrected head pins sit 0.022/0.033 units above the shoulder line. The singing, lifted-head, bowed-head, seated and pose-swap stills are checked; `render/qa/neck-comparison.png` preserves the before/after view. No new paint or image generation is needed.

## Action on the song clock

| Song time | Action |
|---|---|
| 0–22.58 | A cold mining town and one amber kitchen lamp. Father and child are revealed at their little table. The adult daughter enters as narrator. |
| 22.58–66.14 | Coal-blackened hands, her open palm, his first constellation story. The lamp and the tiny imagined sky answer one another. |
| 69.56–81.42 | His road descends into the mountain; hers points towards light. The mine is introduced with the young working father and helmet lamp. |
| 86.86–116.94 | The first title refrain. His underground labour supports her growing sky. The title motif is a visual refrain of the offered hand. |
| 116.94–139.32 | The instrumental passage enacts the cause: he enters the adit; the support shudders and falls, the mine lamp goes out, dust catches the cold light. The following lyric enters the aftermath. |
| 139.32–153.26 | The same household light remains. The father with an eye bandage and cane appears. She puts down the acceptance letter; he returns it. |
| 154.22–160.82 | Her first telescope on one side; his first careful cane steps on the other. Keep both visible in one frame. |
| 161.82–168.28 | She offers the certificate; his hand meets its embossed seal. |
| 169.46–216.22 | The stars she learns grow. He listens. Years pass and the narrator's study expands towards a planetarium. Their hand motif returns in the second chorus. |
| 219.42–233.40 | The magnificent planetarium lights. Its best seat reveals the older father. An audience applauds. He turns his listening face towards her and asks about the brightness. |
| 234.94–247.02 | The audience leaves; the projector and pinlight stars go out. She sits beside him. |
| 247.02–257.04 | The shorter orchestral interlude holds hands and faces. The childhood card returns further left so both young faces are visible, without relighting the projected sky. |
| 257.04–286.28 | The same chorus returns at full scale in the music, against the small warm scene. Her finger brings the constellations into his open palm. |
| 289.56–307.70 | The old hands, one star at a time, and the story they can tell slowly. |
| 307.70–325.20 | Quiet coda. Both remain together; the light holds. |
| After song | Warm curtain call: daughter bows and the seated father gives a gentle nod. |

Use a 7-second preroll and 9-second postroll. Look-test stills precede the full 1080p render. Verify the mine causality, unbroken telescope/cane contrast, document handoffs, age/pose substitutions, projection switching off, two visible living people and the final tactile gesture. Check programme, translations, optional English/pinyin, mobile fit, arbitrary seeking, Hyeong/companion changeovers and an encore. The user approved commit, push and public deployment on 15 November 2026.

## Local verification

Typecheck and the Vite production build pass. The worker show metadata and 1200×630 share card are generated for Programme XI.

The source MP3 hash matches the user's recording. All 52 lines have increasing nonoverlapping timestamps and Chinese, pinyin, English and Indonesian text. A provenance audit verifies all 17 piece/poster receipts against the selected key hash, prompt hashes, source output hashes and runtime files. With the selected key, this is 18 explicit Sunburst images.

Fresh stills verify the corrected recording's childhood gesture, young father entering the adit, the fallen support, eye bandage and cane, acceptance-letter return, simultaneous telescope/cane, his fingers over the embossed seal, best seat and audience, seated pose swap, dark planetarium, and two living performers at the close. The end gesture remains calibrated from world-space string ties; at song second 258.04 the daughter's fingertip is about 0.014 stage units from his palm, including breathing. The large paired-hands card magnifies the contact below their visible faces.

Runtime checks pass arbitrary seeking, changes from Hyeong and Your Brother Is Here, and an encore, with equivalent piece states after each change. The miner is behind the mine flat by 132.32 seconds; at 136.52 the support has fallen and only the work lamp is extinguished. At 158.86 the telescope and cane are both visible. At every sampled time from 247.12 onward the projected stars, ray and projector glow are zero; the projector then descends through its trap. The daughter swaps poses between 244.64 and 244.70, with exactly one pose visible. No mine dust carries into Hyeong.

The actual desktop programme and 390×844 phone programme pass. The phone bill fits at 343×793 pixels with no cast overflow. Playback loads the corrected 325.2-second audio. Chinese/Indonesian surtitles, optional English and pinyin, pause, return to the wall and Resume the Play pass without browser errors. All 52 lines render the correct text in all four language fields. Detailed local reports and screenshots are in ignored `render/qa/`.

## Review delivery

The approved local film is `render/the-sky-you-gave-me-corrected.mp4`: **341.200 seconds**, **10,236 frames**, **1920×1080 at 30 fps**, including the source correction and both neck mounts. The user removed the unsuffixed render. The retained review copy is 248,389,456 bytes, H.264 4:2:0 full range with stereo 48 kHz AAC, and has faststart metadata. SHA-256: `be6f2f32301e324e296442a806b9f7659e6efb727908729a363c5ebec7713f3e`.

The complete film decodes without errors. Technical waveform comparisons against the correct MP3 at song seconds 24, 144, 260 and 300 all measure zero additional offset after the 7-second preroll, with correlations above 0.9999. The preroll is silent. These are clock/delivery checks; no musical listening model is used.

`render/delivery.json` records the selected file, Suno id, source/cue/rig hashes and technical results. The cue hash is `b2c0e6344efca82e5dea87d3d9a7c1bf1eb3da7b953ee619735bee68b46a451b`; the rig hash is `7a722d86dcc1f236aaf98a6ba16a515b4669c8f89b10ae21294bc48a901d8cb1`. The development preview is available at `http://127.0.0.1:5199/?p=the-sky-you-gave-me` while the local server is running. Public release is approved; the deployment record follows publication.
