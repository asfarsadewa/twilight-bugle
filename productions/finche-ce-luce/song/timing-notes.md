# Recording and text timing

The producer supplied `Finché c’è luce.mp3` on 18 November 2026 and judged it good. `master-source.json` holds its source path, hash, Suno id and embedded words. `master.mp3` is an unchanged copy, 258.0 seconds.

All 57 sung lines match the handoff after removing punctuation, section tags and the choir and whisper cues. `import_final.py` refuses a file whose embedded words differ.

Scribe v2 supplies only Italian word times. `time_final.py` imports the alignment functions of `tools/listen.py` and never calls its listening model. The aligned text score is 0.981. Two lines score lower: "giro la ruota" (0.67) and "Nino è cresciuto" (0.71), where the transcript splits the words differently. No sung line is missing. Singer roles follow the lyric sheet. A listening model did not audit them. The producer gives the final musical earcheck.

Demucs supplies the vocal envelopes for Matteo, Lucia and the choir. The beat finder estimates 68 BPM.

## The gaps the staging uses

| Gap | Seconds | Stage use |
|---|---|---|
| Intro | 0.0 to 19.6 | The black sea, the lost boat, the lanterns on the rock |
| After chorus 1 | 88.2 to 103.3 | Twenty years pass. Nino grows. The fleet sails at dawn. |
| Storm bridge | 155.4 to 172.8 | The storm is short and dense. The chain snaps on the first line. |
| After the storm | 172.8 to 177.3 | The last sails come in. One mooring stays empty. |
| After the break | 187.0 to 194.1 | Grey dawn turns back to night. |
| After "io resto qui" | 215.0 to 221.2 | The hook is held. The beam sweeps the house. |
| After the whisper | 234.9 to 258.0 | The lamp is lit again. The traveller closes and the beam turns on behind it. |
