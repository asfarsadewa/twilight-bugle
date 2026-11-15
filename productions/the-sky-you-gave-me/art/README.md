# Art provenance and preparation

Every selected image was generated with an explicit `--model gpt-image-2.6-sunburst` request through the bundled imagegen CLI. There are **18 selected images**: one opaque key art, 16 transparent piece sheets, and one opaque poster. Each piece and poster uses `key-art.png` as its only style/character reference.

`receipts/key-art-sunburst.json` identifies the key request and identical raw/selected hashes. `receipts/<name>.json` records the model, settings, prompt hash, key-reference hash, raw output hash, alpha statistics and cut metadata for each sheet. Native RGBA transparency succeeded with the named model; no chroma-key substitution or different model was used for the selected pieces.

An earlier native-tool draft has an unexposed backend id. It is **unselected**, is not a reference, and is archived in ignored `src/unselected/key-art-native-draft.png`. Its receipt explicitly records that status.

The raw CLI outputs and generation logs remain under ignored `src/output/imagegen/` and `_work/`. The theatre imports `cut/`: WebP paint, relief normals and traced contours. `calibrate.py` measures actual sheet/crop pins into `rig.json`; `production.ts` uses these pins and preserves the head/arm scale across the daughter's two body poses.

The daughter neck correction is a rig change. The head already includes its own painted neck; the standing and seated body mounts are lowered behind the collar by about 0.042 world units, to source points `[551,95]` and `[508,108]`. Preserve these intentional mount offsets when rebuilding the rig. The head paint, dimensions and all generation receipts stay unchanged.

`make_prompts.py` writes prompts and the 17-entry `prompts/jobs.json`. It does not call an image service. A single image can be regenerated using the bundled CLI with the model and parameters in its job; for example, from the repository root:

```powershell
python C:/Users/asfar/.codex/skills/.system/imagegen/scripts/image_gen.py edit --model gpt-image-2.6-sunburst --image productions/the-sky-you-gave-me/art/key-art.png --prompt-file productions/the-sky-you-gave-me/art/prompts/prop-hands.prompt --size 1536x1024 --quality high --background transparent --output-format png --no-augment --out productions/the-sky-you-gave-me/art/src/output/imagegen/prop-hands.png
```

`prepare.py <names...>` validates the completed CLI log and genuine alpha, runs the repository cutout tool, and writes receipts. Four connected islands are required for each puppet sheet. `calibrate.py` then rebuilds the measured rig data. Both helpers are local image preparation; neither calls a generation provider. Keep the existing source and receipts when creating a new revision.
