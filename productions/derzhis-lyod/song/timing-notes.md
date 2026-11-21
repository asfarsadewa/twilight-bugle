# Recording and text timing

The producer supplied `Держись, лёд (1).mp3` on 20 November 2026. It replaces the take of 19 November, which was the wrong file. `master-source.json` holds its source path, hash, Suno id and embedded words. `master.mp3` is an unchanged copy, 244.9 seconds.

The words embedded in the MP3 repeat some lines under doubled section tags. The Scribe transcript of the Demucs vocal stem shows the sung order. The singers follow the handoff. The choir calls "Держись! Держись!" in the bridge. The outro sings "Ещё один рейс" twice, with the choir on "Держись". A choir hum fills the outro from 206 to 224 seconds. The sheet follows the recording, with 51 lines.

Scribe v2 supplies Russian word times. `time_final.py` imports the alignment functions of `tools/listen.py` and never calls its listening model. The aligned text score is 0.972. Scribe hears "По льду" for "Вода на льду" and "свернул" for "развернул". Those lines, the single-word choir calls and the long notes of the outro have hand fixes from the word times and the vocal energy of the stem. Singer roles follow the lyric sheet. A listening model did not audit them. The producer gives the final musical earcheck.

The beat finder measures 71.8 BPM.

## The gaps the staging uses

| Gap | Seconds | Stage use |
|---|---|---|
| Intro | 0.0 to 18.7 | Night on the frozen lake. The lantern posts rise. A far convoy crosses. |
| After verse 1 | 31.6 to 34.8 | Alyosha kneels to Masha. He goes out to the ice. |
| After chorus 1 | 77.5 to 81.3 | The truck goes back. The city rises. He walks home. |
| The break | 147.5 to 162.6 | The train goes. The truck sinks into the thawing ice. |
| The outro hum | 206.5 to 224.0 | Masha walks slowly along the lantern road. |
