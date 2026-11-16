# Show XII: local production record

16 November 2026. **Un dernier salut · One Last Bow · 最后的谢幕 · Salam Terakhir.** Local review; final musical earcheck belongs to the producer.

The standing tragedy brief governs the ending. The travelling theatre closes permanently. Its canopy, supporting frame, ladder and boards remain damaged. Both characters survive. The bow is care within the loss, followed by folding the sash, collecting the broom, lifting the case and leaving. No new venue, rescue audience, romantic resolution or happy future is supplied. There is no extra celebratory curtain call.

## Performance

Two ten-part marionettes use nested elbows and knees, short overlapping neck mounts and independent palm/sole targets. Soles remain planted as weight shifts; the body lowers when a stride needs more reach. Feet follow the tilted board tops after the collapse. Authored poses are sampled at 60 Hz, with no accumulated simulation or walking-hop channel.

The overture rehearses a turn and bow while he sweeps and picks up the hat. The sung exchanges include a caught hem, counting, a carried stool and interrupted steps. Refrain one approaches, reserves space, turns, gives way, extends and recovers. In the storm she jumps onto the step and pulls him clear of the support; the step then breaks beneath her. The sash turns counting and reciprocal weight into rescue. Her bridge kneels before rising to his offered hands. Refrain three releases for a turn, then rejoins. A forward bow tips towards the audience while preserving sole and palm contacts.

Props pin to actual painted palms. Contacts resolve after all actors pose, avoiding frame lag. Red cloth uses the same contacts. Outgoing pieces resolve their own old cast during a changeover, rather than attaching to incoming performers. The same time gives the same joints, objects and scene after a seek or encore.

Camera width and sparse scenery leave the acting readable. No still tableaux replace the cast, and no particle storm hides them. Native cloth and cardboard depth supply the mechanics; generated paint supplies all image assets.

## Source

Original confirmed Suno MP3: 327.920 seconds, SHA-256 `a8e3b9195ba29797a34097e4530d53acfea4a82390409f1753fd11a5bc2df6e8`. The producer confirmed the source despite its older embedded directions. All 61 lyric lines have Scribe word times. Roles follow the lyric sheet. No listening-model musical review ran.

Eighteen selected images use `gpt-image-2.6-sunburst`: one key image and seventeen reference edits. Six cast sheets produce twenty cards. Real alpha, measured pins, short collar mounts and exact hashes/settings are retained in `art/receipts/` and `art/rig.json`.

## Validation

- TypeScript and production build.
- RTX 5070 Ti browser stills reviewed for feet, collars, reach, fall, sash rescue, kneel, duet, bow and closing work.
- Runtime checks: all 61 French/Indonesian/English lines; arbitrary seek; entrance from Show XI; return to Show XI; encore; physical palm/sole errors; held prop contacts; persistent scenery damage. Show XI's sampled pose remains unchanged.
- Real desktop controls: programme, selected MP3, English, pause, wall return and resume. Phone programme fits 390×844 without cast overflow. Twelve posters; no browser page errors.
- Share cards and twelve-show Worker manifest prepared locally. Publication is a separate release step.

The ignored `render/qa/` holds reports, screenshots and build logs. `render/delivery.json` records final film properties and technical decode/audio checks. Review film: seven seconds of preroll, full uncut source, nine seconds of postroll. User musical approval remains separate from these technical checks.

Repeat the browser checks from `theatre/` with `node tools/check-un-dernier-salut.mjs` and `node tools/check-un-dernier-salut-ui.mjs`. The stage check also measures the hand relative to the body while the outgoing puppet travels into the wing; the carried pose remains stable through the strike.

## First review film (superseded)

`render/hand-review/un-dernier-salut-before-hands.mp4`: 343.933 seconds, 1920×1080 at 30 fps, 10,318 frames, H.264/AAC stereo, 289,168,008 bytes. SHA-256 `a4b9799cc4542e01795a94b7c3e05a851a237b32d8d3fd1fda4d26a48efcb7bf`.

Complete audio/video decode passes. Six waveform comparisons, from the first verse through the coda, find 0 ms offset after the seven-second preroll; minimum correlation 0.999724. The master MP3 matches both the imported source hash and the Downloads file. Final encoded frames of the rescue, bow and packing sequence were visually inspected. Runtime, desktop/phone and build checks pass; musical earcheck remains with the producer.

## Hand and collar correction

The producer identified abnormal hand directions, then warned against burying heads in collars. See [hand-correction.md](hand-correction.md) for the before/after evidence and root cause. Contacts now turn with the mirrored figures, outside elbows open away from the torso, and prop grips sit at comfortable heights. The dancer carries the folded sash and broom on their respective sides. Her head mount rises 0.0149 units with no scale change; the jaw clears the neckline through the bow while the neck base remains overlapped with the chest.

Retained film before the male collar correction: `render/un-dernier-salut-hands-corrected.mp4`, 343.933 seconds, 1920×1080 at 30 fps, 10,318 frames, 289,816,388 bytes. SHA-256 `954defd93dc2e792e0947da31b6ca08d97b05807404f0c1ac6f0440a3fcce15a`.

Full decode passes. All fifteen partial/completed turn checks keep the hands on their own sides; fourteen outside-elbow samples point outwards. Minimum measured chin clearance is 0.0113 units and the neck base remains at least 0.0198 units overlapped. The six audio checks again find 0 ms offset, with minimum correlation 0.999724. Actual encoded turn, rescue, bow and packing frames were inspected. The same source MP3 and all eighteen original Sunburst images are retained.

The producer's subsequent browser annotation showed that the clown's head was still buried in his shirt. His attachment rises from source `[708,225]` to `[708,125]`, a 0.0624-unit lift with no head scaling. The check now measures each actor's own painted jaw, neckline and neck base throughout the score. The clown's clearance is 0.0068–0.0306 units with at least 0.0150 units of neck-base overlap. Close-ups at 20, 130, 214.5 and 295 seconds cover standing, both tilt extremes and the bow. Runtime regression, typecheck and production build pass.

The current full master is `render/neck-corrected/un-dernier-salut.mp4`: 293,926,430 bytes, SHA-256 `efbb86ffdfd0eb2a3e69f85fc0916f9dbd54e9c3d0f579af44a7d78222dfe0b6`. It includes both corrected head mounts and the hand/grip revisions. Sources match the snapshot taken before rendering. Complete decode passes; all six audio checks find 0 ms offset, with minimum correlation 0.999724.

The requested channel export is `D:\un-dernier-salut-ashthepeasant.mp4`: 343.933 seconds, 1920×1080 at 30 fps, 10,318 frames, H.264 High/AAC stereo, 331,165,158 bytes. SHA-256 `214462e0752ef4d676dbc21fc4f8fc3f89db461d054ba7295b0a698dfcd1c847`. The same Georgia italic `@ashthepeasant` watermark drifts along the right of the stage above the surtitles at 35% opacity. The export signals limited-range BT.709, retains identical audio packets, has no dropped/duplicated frames and passes complete decoding. The MP4 index precedes the media data for fast start. Actual encoded frames at 27, 137 and 302 seconds were inspected for corrected head placement, watermark movement and subtitle clearance. Receipts remain in `render/delivery.json` and `render/youtube/export.json`. Musical earcheck remains with the producer.
