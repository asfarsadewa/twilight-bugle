# Recording and text timing

The producer supplied `Держись, лёд.mp3` on 19 November 2026. `master-source.json` holds its source path, hash, Suno id and embedded words. `master.mp3` is an unchanged copy, 243.2 seconds.

The words embedded in the MP3 repeat some lines under doubled section tags. The Scribe transcript of the Demucs vocal stem shows the sung order. The singers follow the handoff. Chorus 2 opens with the hook twice. The outro sings "Ещё один рейс" twice, with the choir on "Держись". The sheet follows the recording, with 52 lines.

Scribe v2 supplies Russian word times. `time_final.py` imports the alignment functions of `tools/listen.py` and never calls its listening model. The aligned text score is 1.0. The long held hook of chorus 2 and the single-word choir calls have hand fixes from the word times. Singer roles follow the lyric sheet. A listening model did not audit them. The producer gives the final musical earcheck.

The beat finder measures 71.8 BPM.

## The gaps the staging uses

| Gap | Seconds | Stage use |
|---|---|---|
| Intro | 0.0 to 20.1 | Night on the frozen lake. The lantern posts rise. A far convoy crosses. |
| After verse 1 | 33.2 to 36.8 | Alyosha kneels to Masha. He goes out to the ice. |
| After chorus 1 | 77.4 to 90.6 | The truck goes back. The city at night. He walks home. |
| The break | 146.9 to 160.8 | The train goes. The truck sinks into the thawing ice. |
| After the final chorus | 190.5 to 202.2 | Alyosha goes. Masha stays at the water. |
