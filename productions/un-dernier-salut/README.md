# Un dernier salut · One Last Bow

**Show XII, released 16 November 2026.** French and Indonesian surtitles; English on demand. This follows the [standing production brief](../../docs/production-brief.md). Their theatre remains ruined and closes. After the shared bow they fold the sash, gather the broom, lift the case and leave. Both survive; no happy future or restored theatre is supplied.

The producer supplied and confirmed `C:\Users\asfar\Downloads\Un dernier salut.mp3`, 327.920 seconds, Suno ID `64d0fd3a-d7af-47b5-a8b9-fe771aba9e07`, SHA-256 `a8e3b9195ba29797a34097e4530d53acfea4a82390409f1753fd11a5bc2df6e8`. The embedded text still carries the earlier instrumental tags; after this discrepancy was identified the producer explicitly replied **“Yes, use this recording.”** All 61 sung lines match the handoff. The MP3 is unchanged. Scribe supplies text times and Demucs the technical vocal envelope. No Lyria or listening-model review ran. Final musical earcheck belongs to the producer.

Two ten-part marionettes perform with hinged elbows and knees, planted steps, turns, a kneel, a jump onto the step, catches, palm grips, counterbalance and a forward bow. The red cloth joins their actual post-pose palms. The three refrains change from rivalry through rescue to chosen partnership. The coda belongs to closing work, with no extra celebratory curtain call.

All eighteen selected images use **gpt-image-2.6-sunburst**: one key image and seventeen reference edits, including the six cast sheets and all scenery, prop and poster artwork. The six sheets make twenty cast cards. Eighteen receipts retain the exact model, settings and hashes. Head bases overlap the collars to avoid doubling their necks.

- `story/bible.md`: story, character arcs and the commitment to physical puppet acting.
- `production.ts`, `choreography.ts`: stage and deterministic full-body performance score.
- `production-notes.md`: staging and validation record.
- `song/master.mp3`, `master.json`, `master-source.json`: selected recording, timing and provenance.
- `song/import_final.py`, `time_final.py`, `fix_times.py`: import and text-only timestamp helpers.
- `art/bible.md`, `prompts/`, `receipts/`, `rig.json`, `cut/`: art direction, measured joints and runtime cards.
- `song/suno-style.txt`: replacement tragic musical direction, ready for the next Suno generation.
- `song/suno-lyrics.txt`: the same French words with the revised musical section tags.
- `song/chorus-meaning.txt`: meaning of the three chorus variations and the last exchange.
- `song/revisions/v1-happy/`: the rejected first handoff and its story reference.

From `theatre/`, open `http://localhost:5199/?p=un-dernier-salut` after `bun run dev`, or render the full review film:

```powershell
node tools/render.mjs --p un-dernier-salut --video
```

The current review master is `render/neck-corrected/un-dernier-salut.mp4`, including all hand, grip and head-mount corrections in [hand-correction.md](hand-correction.md). The standard render command writes `render/un-dernier-salut.mp4`; `render/delivery.json` identifies the current retained master and its source snapshot. The film has seven seconds of preroll and nine seconds of postroll.

The producer-requested channel export is `D:\un-dernier-salut-ashthepeasant.mp4`: 1920×1080, 30 fps, 343.933 seconds, 331,165,158 bytes. It uses the established floating `@ashthepeasant` watermark and copies the rendered audio unchanged. Full decode, audio identity and fast-start checks pass. `render/youtube/encode_youtube.py` retains the export procedure; `render/youtube/export.json` holds the hashes, format and verification receipt. Raw generations, transcription/stems and rendered media remain in ignored working directories. Runtime cuts, selected key art, receipts and master are retained with the source. The live production is available at https://twilightbugle.asfarlab.fun/show/un-dernier-salut.
