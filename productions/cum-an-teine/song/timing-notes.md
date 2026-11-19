# Recording and text timing

The producer supplied `Cùm an Teine.mp3` on 19 November 2026. `master-source.json` holds its source path, hash, Suno id and embedded words. `master.mp3` is an unchanged copy, 273.2 seconds.

The embedded words follow the handoff. The Scribe transcript of the Demucs vocal stem shows a different end. The choir does not answer "Cùm an teine" in the first half of the final chorus. After the last "Cùm an teine", the choir sings "The fire she gave us is gone". The outro sings "Cùm an teine, a ghràidh" twice. The sheet follows the recording, with 48 lines.

Scribe v2 supplies English word times. It hears the Gaelic as "Cumha n'téinne" and "Clementina". `time_final.py` imports the alignment functions of `tools/listen.py` and never calls its listening model. The aligned text score is 0.741. The Gaelic answers, the waulking vocables and the last four lines have hand fixes from the word times and the vocal energy of the stem. Singer roles follow the lyric sheet. A listening model did not audit them. The producer gives the final musical earcheck.

The beat finder measures 68 BPM.

## The gaps the staging uses

| Gap | Seconds | Stage use |
|---|---|---|
| Intro | 0.0 to 18.7 | Mist on the glen. The croft rises. One chimney smokes. |
| After chorus 1 | 81.4 to 96.2 | Dusk on the shore. Seonag lies down by the pot. |
| After verse 3 | 120.7 to 124.1 | The cairn rises. Ewan takes up the pot. |
| Inside the bridge | 157.5 to 161.4 | The great wave breaks over Ewan. |
| The break | 162.8 to 184.2 | The sea goes quiet. He looks into the dark pot. The new shore comes up in snow. |
| Between the outro calls | 243.0 to 256.0 | The far glen in the mist. |
