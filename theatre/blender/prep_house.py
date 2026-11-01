#!/usr/bin/env python3
"""Prepare the proscenium painting for the Blender house build.

  python theatre/blender/prep_house.py

Reads theatre/art/src/proscenium-2.png. Writes theatre/blender/work/:
  albedo.png   the painting, RGBA
  height.png   16-bit relief height: gilt and highlights stand out, recesses sink, broad forms swell gently
  meta.json    aspect and the stage opening (left, top, right, bottom as fractions, y down)
"""
import json, os
import cv2
import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, "..", "art", "src", "proscenium-2.png")
OUT = os.path.join(HERE, "work")


def main():
    os.makedirs(OUT, exist_ok=True)
    bgra = cv2.imread(SRC, cv2.IMREAD_UNCHANGED)
    h, w = bgra.shape[:2]
    alpha = bgra[..., 3]
    rgb = cv2.cvtColor(bgra[..., :3], cv2.COLOR_BGR2RGB).astype(np.float32) / 255.0

    # The opening: transparent pixels that the outside cannot reach.
    clear = (alpha < 128).astype(np.uint8)
    n, labels, stats, _ = cv2.connectedComponentsWithStats(clear, connectivity=4)
    border = set(np.unique(np.concatenate([labels[0], labels[-1], labels[:, 0], labels[:, -1]]))) - {0}
    holes = [k for k in range(1, n) if k not in border]
    k = max(holes, key=lambda k: stats[k, cv2.CC_STAT_AREA])
    x, y, bw, bh = stats[k, :4]
    hole = [x / w, y / h, (x + bw) / w, (y + bh) / h]

    # Relief height. Gilt (saturated yellow) carving stands proud. Fine light and shade becomes fine relief.
    lum = rgb @ np.array([0.299, 0.587, 0.114], np.float32)
    mx, mn = rgb.max(2), rgb.min(2)
    sat = (mx - mn) / np.maximum(mx, 1e-3)
    gold = np.clip((sat - 0.35) * 2.5, 0, 1) * np.clip((rgb[..., 0] - rgb[..., 2]) * 3, 0, 1) * np.clip(lum * 2, 0, 1)
    fine = cv2.GaussianBlur(lum, (0, 0), 1.2) - cv2.GaussianBlur(lum, (0, 0), 14)
    broad = cv2.GaussianBlur(lum, (0, 0), 30)
    goldb = cv2.GaussianBlur(gold, (0, 0), 2.0)
    height = 0.55 * goldb + 0.9 * fine + 0.35 * broad
    height = cv2.GaussianBlur(height, (0, 0), 0.8)
    solid = alpha > 128
    lo, hi = np.percentile(height[solid], [1, 99.5])
    height = np.clip((height - lo) / (hi - lo), 0, 1)
    height[~solid] = 0
    cv2.imwrite(os.path.join(OUT, "height.png"), (height * 65535).astype(np.uint16))
    cv2.imwrite(os.path.join(OUT, "albedo.png"), bgra)
    json.dump({"aspect": w / h, "w": w, "h": h, "hole": hole}, open(os.path.join(OUT, "meta.json"), "w"), indent=1)
    print("hole", [round(v, 4) for v in hole], "gold share", round(float((gold > 0.3)[solid].mean()), 3))


if __name__ == "__main__":
    main()
