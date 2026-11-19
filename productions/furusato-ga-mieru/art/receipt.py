#!/usr/bin/env python3
"""Write the receipt of one generated piece: model, settings and hashes.

  python receipt.py <name> <model> <size> <background> <seconds>    (gen_art.sh runs it)
"""
import hashlib, json, os, sys
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))


def sha(path):
    return hashlib.sha256(open(os.path.join(HERE, path), "rb").read()).hexdigest()


def main():
    name, model, size, bg, seconds = sys.argv[1:6]
    raw = f"src/{name}.png"
    im = Image.open(os.path.join(HERE, raw)).convert("RGBA")
    clear = sum(1 for a in im.getchannel("A").getdata() if a < 8) / (im.width * im.height)
    out = {
        "model": model, "mode": "edit", "reference": "key-art.png", "size": size, "quality": "high", "background": bg,
        "raw_output": raw, "generator": "bundled imagegen CLI", "status": "complete",
        "prompt": f"prompts/{name}.prompt", "prompt_sha256": sha(f"prompts/{name}.prompt"),
        "reference_sha256": sha("key-art.png"), "raw_sha256": sha(raw), "image_size": [im.width, im.height],
        "alpha_transparent_fraction": round(clear, 4), "generation_seconds": float(seconds),
    }
    json.dump(out, open(os.path.join(HERE, "receipts", f"{name}.json"), "w", encoding="utf-8"), indent=2)


if __name__ == "__main__":
    main()
