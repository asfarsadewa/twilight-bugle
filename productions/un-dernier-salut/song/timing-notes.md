# Recording and text timing

The producer supplied and explicitly confirmed `Un dernier salut.mp3` on 16 November 2026. `master-source.json` owns its source path, hash, Suno identifier and embedded text. `master.mp3` is byte-identical, 327.920 seconds, 48 kHz stereo.

All 61 sung lines match the handoff after removing punctuation and musical tags. The file embeds the older playful/triumphant tags; after this discrepancy was raised the producer replied **“Yes, use this recording.”** Tags are not an audio analysis and do not authorize replacing this file.

Scribe v2 supplies only French lyric timestamps. Full-word boundaries replace matched token midpoints through `fix.json`; the aligned text score is 0.990. Elisions and homophonic ballet/balai transcriptions account for the small discrepancies. No sung section is missing. Singer roles follow the intended lyric sheet and have not been independently audited by a listening model.

`time_final.py` imports only transcription/alignment functions, bypassing the shared helper's musical-review main. Demucs supplies a technical vocal envelope. No Gemini/OpenAI musical listening, Lyria or automatic preference review ran. The producer remains the final earchecker.

The shared beat finder estimates 95.7 BPM; its default four-beat phase is unused. D minor, slow triple meter and 82 BPM are brief directions, not verified facts about this recording. Movement follows actual word times and a separately authored score.

The recording provides 23.6 seconds of overture, an 8.7-second first dance interlude, 3.4 seconds between refrain two and bridge, a 15.8-second farewell interlude and 30.1 seconds after the last sung line. The staging uses these actual gaps. The long coda contains the closing work.
