# 형은 여기 있다 · Your Brother Is Here

Kakak Ada di Sini · 哥在这里

A companion to *형 먼저 가*, from Chol's side, decades after war forced the brothers apart. At dusk he looks from a developed observation bank towards the sparse rural shore where Min may still live. The crossing remains barred.

For this song they are blood brothers, as requested by the user. Cheol alone sings; Min's fate is unknown.

## Production

The corrected production is complete and approved by the user. The full 1080p film is `render/are-you-still-there.mp4` (4:18.800 with preroll and curtain call). [production-review.md](production-review.md) records the delivered assets and checks. The show link is https://twilightbugle.asfarlab.fun/show/are-you-still-there.

Show X of the Twilight Bugle. The user-approved Suno recording is the master source: `형은 여기 있다.mp3`, 4:02.800, imported without changing its audio. It grew from Lyria take 8. The earlier working title, *아직 거기 있니 · Are You Still There?*, remains in the folder id and audition history.

The show is a charcoal-and-ink toy theatre on hanji paper. Cold June rain, fleeing refugees, marching soldiers and opposing lines visibly force the crossing; Min severs the bridge. The same banks then enter a materially unequal peace: apartment blocks and paved infrastructure on Chol's side, sparse dim rural houses across the river. Older Chol is a new jointed marionette; the young brothers, Mother and military pieces retain Hyeong's original art. Min never answers from the present-day far bank. Chol bows alone.

The surtitles show Korean and Indonesian. English is available from the programme. All 36 lines use word times from the final recording. The original audio has been approved by the user; transcription is used for timing only.

The story, set and rigging plan are in [production-notes.md](production-notes.md). New image prompts are in `art/prompts/`; `art/receipts/` records built-in image generation and reused continuity pieces. The theatre plays `song/master.mp3`, `song/master.json`, `art/cut/` and `production.ts`.

## Run and render

Run in `theatre/`:

```powershell
bun run dev
node tools/render.mjs --p are-you-still-there --stills 7,26,51,84,93,102,108,118,128,141,161,172,190,228,246
node tools/render.mjs --p are-you-still-there --video
```

The dev programme is `http://localhost:5199/?p=are-you-still-there`. The production video is written to `render/are-you-still-there.mp4`. Both video and browser use the same cue sheet.

## Final song pipeline

`song/master-source.json` holds the source title, Suno id, duration and SHA-256. The original download and the nine Lyria auditions remain in ignored `song/takes/` folders. Importing never overwrites a different final source.

```powershell
python productions/are-you-still-there/song/import_final.py
python productions/are-you-still-there/song/time_final.py
python -m demucs --two-stems=vocals -n htdemucs -d cuda -o productions/are-you-still-there/song/takes/suno-final/stems productions/are-you-still-there/song/takes/suno-final/original.wav
python tools/master.py productions/are-you-still-there/song suno-final --bpm 150
```

`time_final.py` obtains Scribe word timestamps and caches them; it does not run the listening model. The take's `fix.json` snaps the lyric spans to complete word boundaries, including the proper name Min, which the transcriber spells phonetically. The timing notes explain these corrections. The supplied lyric text and translations remain authoritative. The beat grid is an estimated subdivision grid; the dramatic cues follow the lyric times.

## Song development history

Song development. Nine Lyria 3.5 auditions have been generated in three rounds. The user accepts the original Korean lyrics but rejected the first round musically: weak choruses, insufficient melodic tragedy and harmony that did not support the lament.

The second round specified an original recurring tragic theme, a four-bar vocal hook and distinct minor-key harmonic roadmaps. The user heard stronger sadness but still weak choruses, and **provisionally keeps take 6**.

The third round explicitly names **Epilogue** from *Taegukgi* as the emotional reference. These briefs ask for the chorus to be composed first, with a distinct title hook introduced instrumentally and repeated recognizably in every refrain. Takes 7 and 8 supply original eight-note melodic guides; take 9 tests a warmer memory-of-home colour with a minor resolution. The user remains the final earchecker and may develop a chosen take further in Suno before theatre production.

| Take | Musical brief | Duration |
|---|---|---|
| t1 | The River at Dusk: a broad 4/4 orchestral drama ballad | 3:03 |
| t2 | A Brother's Evening Prayer: a swaying 6/8 lament | 3:02 |
| t3 | The Promise Across the Water: the most expansive symphonic brief | 2:58 |
| t4 | The Uncrossed River: D minor, descending bass and a suspended question | 3:02 |
| t5 | The Promise I Could Not Keep: G minor, chromatic lament bass | 3:01 |
| t6 | Your Brother Is Here: C minor, a lyrical 6/8 theme | 3:02 |
| t7 | A Name Across the River: D minor, a pleading leap and falling answer | 3:04 |
| t8 | The Evening Call: C minor, a new chorus over a swaying 6/8 feel | 3:04 |
| t9 | The Home We Remember: warm F-major memory with a D-minor shadow | 3:03 |

The names describe the requested treatments. Takes 1 to 3 are preserved but rejected; takes 4 and 5 were not selected. The user hears **take 8 as almost the desired composition, but its chorus vocals go out of tune**. It was the leading musical candidate for vocal refinement, with take 6 as the earlier provisional fallback. The approved final Suno master now supersedes both. The Korean wording received a text-only language review. The audio receives local decode and non-silence checks; no automated listening review is requested.

The final Suno delivery supersedes these provisional auditions and is the source for the theatre master.

## Files

- `story/bible.md`: premise, continuity and emotional arc.
- `song/make_sheet.py`: lyric, translation and musical-brief source.
- `song/lyrics.json`, `song/lines.json`, `song/lyrics.md`: Korean lyrics with English and Indonesian translations.
- `song/variants.json`, `song/prompts/t1.txt` through `t9.txt`: the audition directions and exact prompts. The default `brief.txt` and `prompt.txt` now use take 7's Epilogue audition direction; the provisional selection stays take 6.
- `song/round-2.md`: the user's first-round feedback, the reference and the second round's harmonic plans.
- `song/round-3.md`: take 6's provisional selection, the Epilogue reference and the new chorus plans.
- `song/takes/<take>/`: local audio originals, review MP3s and provider receipts; ignored by Git.
- `song/auditions.json`: the measured durations, local file paths and pending human earcheck.
- `song/suno-lyrics.txt`, `song/suno-style.txt`: Korean-only lyrics and a compact musical brief for the possible Suno handoff.
- `song/suno-t8-handoff.md`, `song/suno-t8-style.txt`: the current take 8 source files and a brief aimed at preserving the composition while improving the chorus intonation in the user's planned Suno pass.

## Reproduce the sheets

Run from the repository root:

```powershell
python productions/are-you-still-there/song/make_sheet.py
```

## Generate an audition

Each command makes one new billable take. Use a new take name for a deliberate new generation. Do not replay an uncertain request.

```powershell
python tools/lyria_song.py --prompt-file productions/are-you-still-there/song/prompts/t7.txt --out productions/are-you-still-there/song/takes --take t10
```

The example uses take 7's brief with a new output name, `t10`; do not overwrite an existing audition. `GEMINI_API_KEY` (or `GOOGLE_API_KEY`) and FFmpeg are required. Each take should retain a copy of `song/lines.json` before any later lyric revision.
