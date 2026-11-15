# 你给我的星空 · The Sky You Gave Me

Pinyin: **Nǐ gěi wǒ de xīngkōng**.

Show XI of The Twilight Bugle. A coal miner draws constellations in his little daughter's palm. A mine collapse takes his sight. Years later, after her first planetarium show, she turns its projected stars off and traces their stories into his hand. Both are alive and together at the end.

The user selected the corrected Mandarin Suno recording **`你给我的星空 (1).mp3`** on 15 November 2026: **5:25.200**, Suno id `4adbaac7-d385-41a8-a9a1-bdb2ba109250`. `song/master.mp3` is an unchanged copy. All 52 embedded lyric lines match the handoff. The previously supplied unsuffixed file was the wrong recording; its take and film are preserved in ignored superseded archives. Chinese and Indonesian surtitles lead; English and pinyin are available on demand. The user performs the final musical earcheck. Scribe is used only for timing; no Lyria generation or listening-model review was used for this show.

All selected artwork uses the explicit **`gpt-image-2.6-sunburst`** model through the bundled imagegen CLI: the key art and 17 image sheets, including the poster. The earlier native key-art draft is unselected and is never a reference. `art/prompts/`, `art/receipts/` and `art/rig.json` preserve the generation requests and measured joint pins. Charcoal, graphite and chalk pastel on blue-grey paper run from the coal town to the indigo planetarium and a single warm light on two hands.

The three marionette rigs are the standing daughter, her seated pose, and her elderly father in his chair. The daughter reuses the same head and arms at the same physical scale when she sits. Her head mounts sit lower behind the collar in both poses, shortening the exposed neck without changing her face or head size. Young father and recovering father are rod/slide cards. A separate support falls across the mine after he enters; the work lamp goes out while the town light stays on. The telescope and cane share a wide shot. His fingers meet the certificate's raised seal. A foreground paired-hands card magnifies the last gesture while both faces remain visible. After the audience leaves, the projected stars turn off and remain off through the ending and their curtain call.

- `story/bible.md`: approved story and continuity.
- `production-notes.md`: dramatic constraints, staging and verification.
- `song/master-source.json`: source identity and SHA-256.
- `song/master.json`: 52 line cues, sections and daughter vocal amplitude.
- `song/lyrics.md`: Chinese, pinyin, English and Indonesian text.
- `song/timing-notes.md`: Scribe timing repair and transcription limits.
- `song/suno-style.txt`, `song/suno-lyrics.txt`: the original Suno handoff.
- `art/bible.md`, `art/prompts/`, `art/receipts/`: style and explicit model provenance.
- `art/calibrate.py`, `art/rig.json`: measured puppet pins and seated scale.
- `production.ts`, `cues.ts`: the complete physical show.

The approved local review film is `render/the-sky-you-gave-me-corrected.mp4`, 1920×1080 at 30 fps, **5:41.200** including 7 seconds of preroll and 9 seconds of postroll. The user removed the unsuffixed render. Renders and raw source generations are ignored by Git. The user approved commit, push and public deployment on 15 November 2026.

From `theatre/`:

```sh
node tools/render.mjs --p the-sky-you-gave-me --stills 24,130,136.5,152.8,158.9,166.8,231.8,247.2,252,258,290.6,328.2
node tools/render.mjs --p the-sky-you-gave-me --video
```
