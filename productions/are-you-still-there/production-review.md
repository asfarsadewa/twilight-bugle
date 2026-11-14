# Production delivery · 14 November 2026

The corrected production and full film are complete. The user approved the result and requested a push and deployment on 14 November 2026. The show link is https://twilightbugle.asfarlab.fun/show/are-you-still-there.

## Delivered

- Full film: `render/are-you-still-there.mp4`, 1920×1080, 30 fps, 4:18.800 including the 7-second preroll and 9-second curtain call; 244,078,676 bytes.
- Theatre show X: `production.ts` and `cues.ts`, registered automatically as `are-you-still-there`.
- Final Suno master: 4:02.800, unchanged from the user's download. SHA-256 `45bb5f2ec175d3de8b3180446f031dcee249191573a2dd8abe36be474bcb00fd`.
- Revised poster, key art, developed bank, sparse far shore, locked observation promenade and open-water row; saved prompts, native-generation receipts and cut-card assets.
- Site/show share cards and Worker metadata regenerated for ten shows.

## Corrected dramatic reading

War is enacted as the cause: refugees flee against a marching column, opposing troops close in, Chol crosses, Min cuts the bridge and the two military lines remain around the separated brothers. The older man's developed LEFT bank and the sparse RIGHT shore retain the wartime geography. Visible set changes carry the landscape from war into a divided and materially unequal peace. The closed gate and severed crossing remain. Min is only shown in memory and never answers from the present.

The first village-only look test is superseded. Original Hyeong art and the mini-mv film/review notes govern the military continuity. The user decides the emotional effect on viewing; the source audio is left intact for their earcheck.

## Verification

- TypeScript check and production build passed.
- Rendered stills reviewed for the two armies, marching/refugee directions, bridge fall, rice handoff, old/young substitution, unequal shores, locked gate, coda and solo bow.
- The rice and both hands were checked at their actual rig coordinates.
- Arbitrary seeking gave identical visible stage state. Hyeong → companion, companion → Hyeong and an encore loaded without page errors. The new smoke effect stays off in Hyeong.
- The actual programme, ten-poster wall, Korean/Indonesian surtitles, optional English, pause/resume and 390×844 phone programme passed. A long cast label was shortened after visual review; no cast row overflows.
- The completed MP4 decoded fully without errors. Its H.264 video is exactly 258.800 seconds; stereo AAC is 258.794 seconds. Waveform alignment at song seconds 20, 110, 200 and 235 confirms the 7-second film offset, with correlation above 0.9998. This is a technical timing check, not an automated listening review.
- Final source and browser master hashes match byte for byte. No listening model reviewed the final recording.

Detailed local evidence is retained in ignored `render/qa/`: runtime, UI, build and export reports, screenshots and the verification script. Development stills stay in `render/stills-v2/` and `render/blocking-check/`; final present-day stills are in `render/final-stills/`.
