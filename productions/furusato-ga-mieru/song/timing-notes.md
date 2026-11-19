# Recording and text timing

The producer supplied `ふるさとが見える.mp3` on 19 November 2026 and judged it good. `master-source.json` holds its source path, hash, Suno id and embedded words. `master.mp3` is an unchanged copy, 297.6 seconds.

The words embedded in the MP3 repeat some lines under extra section tags. The embedded words also end chorus 1 with "妹は そこで 眠った". The Scribe transcript shows a different sung order. The singers follow the handoff. They sing "帰ろう 帰ろう" at the end of chorus 1. Hana sings the first line of verse 3 twice. The sheet follows the recording, with 49 lines.

Scribe v2 supplies only Japanese word times. `time_final.py` imports the alignment functions of `tools/listen.py` and never calls its listening model. The aligned text score is 0.871. The hook scores 0.50 because Scribe writes "故郷" for "ふるさと". The short choir answers "登れ 登れ" and the last line have hand fixes from the word times. Singer roles follow the lyric sheet. A listening model did not audit them. The producer gives the final musical earcheck.

Demucs supplies the vocal envelopes. The beat finder estimates 70 BPM.

## The gaps the staging uses

| Gap | Seconds | Stage use |
|---|---|---|
| Intro | 0.0 to 18.2 | Wind and snow on the pass. The roped line of girls climbs. |
| After verse 1 | 44.0 to 47.4 | The mill flies in. |
| After chorus 1 | 103.3 to 104.9 | The dream ends. Hana coughs. |
| Inside verse 3 | 112.0 to 118.6 | A red thread runs off her reel. |
| After verse 3 | 146.2 to 149.2 | Kichi runs into the blizzard. |
| After the bridge | 214.3 to 218.3 | The dawn comes up on the summit. |
| The break | 220.0 to 230.4 | He sets her down. The valley appears below. |
| After the last line | 277.0 to 297.6 | A wordless vocal and shakuhachi. Yuki goes down to the mill. |
