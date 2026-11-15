# Timing the Suno master

The user corrected the source selection to **`你给我的星空 (1).mp3`**, **325.200 seconds**, Suno id `4adbaac7-d385-41a8-a9a1-bdb2ba109250`. The imported MP3 is copied unchanged, with source hash and identity in `master-source.json`. Its embedded 52 lyric lines match the supplied sheet after punctuation is removed. The selected take is `suno-final-corrected`.

ElevenLabs Scribe supplies word times only. No musical listening model is used. A fresh full transcript of the corrected recording aligns all 52 lines; no excerpt repair is needed. `fix_times.py` snaps each line to its matched word boundaries. It reads the selected take from `master-source.json` and applies only that take's optional `timing-patches.json`, so corrections from another recording cannot leak into this one.

The transcriber makes small homophone/particle omissions, including the sustained 啊 after 爸爸. The approved lyric text remains authoritative. The corrections affect timing, not lyrics or sound.

Demucs supplies the corrected recording's own amplitude envelope and instrumental onset grid. The estimated 123.05 BPM is not a human-verified tempo or meter and is not used by this cue sheet. Principal actions follow lyric boundaries. The user remains the final earchecker.

The first refrain begins at 86.86 seconds. The mine sequence occupies the 22.38-second gap from 116.94 to 139.32; the collapse completes before the aftermath lyric. The planetarium bridge begins at 219.42, and the switch-off line runs from 242.20 to 247.02. The shorter orchestral lift is 247.02–257.04. The last refrain begins at 257.04 and the last lyric ends at 307.70. Scene transitions, the pose swap and the coda are bound to these phrases/gaps rather than the former recording's absolute timestamps.

The earlier unsuffixed source (321.960 seconds, Suno id `7274e2f7-2825-460c-85c2-c0bd2d80b256`) was identified by the user as the wrong file. Its transcript, excerpt repair, original audio and old score snapshot remain in `takes/suno-final/`. Its finished film and reports are in `../render/superseded-wrong-recording/`; they are not the current delivery.
