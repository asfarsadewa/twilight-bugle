#!/usr/bin/env python3
"""Turn generated art into stage pieces: trimmed textures plus traced outlines.

  python tools/cutout.py <src.png> <out_dir> [--name N] [--max PX] [--parts] [--opaque]

A cutout is cropped to its paint, scaled so its longest side is at most --max pixels, and saved as WebP with alpha.
Its outline is traced from the alpha at 512 px, simplified, and stored in normalized coordinates (x right, y down,
0..1 of the crop). The theatre extrudes that outline into a cardboard solid, so the cut edge has real thickness.
--parts splits a sheet into its separate pieces (one per connected blob). --opaque keeps a backcloth as a plain
rectangle. Writes <out_dir>/<name>[-<k>].webp, a relief normal map <name>[-<k>]-n.webp and <out_dir>/<name>.json.
"""
import argparse, json, os
import cv2
import numpy as np
from PIL import Image

TRACE = 512


def trace(alpha):
    """Outer outlines with their holes, from an alpha crop. Small specks are dropped."""
    h, w = alpha.shape
    s = TRACE / max(h, w)
    small = cv2.resize(alpha, (max(1, round(w * s)), max(1, round(h * s))), interpolation=cv2.INTER_AREA)
    # Dilate one pixel so the solid sits just outside the paint. The alpha test trims the face to the paint.
    mask = cv2.dilate((small > 110).astype(np.uint8), np.ones((3, 3), np.uint8))
    contours, hier = cv2.findContours(mask, cv2.RETR_CCOMP, cv2.CHAIN_APPROX_NONE)
    if hier is None:
        return []
    hier = hier[0]
    sh, sw = mask.shape
    norm = lambda c: [[round(float(p[0][0]) / sw, 4), round(float(p[0][1]) / sh, 4)] for p in c]
    minimum = 0.0015 * sw * sh
    shapes = []
    for i, c in enumerate(contours):
        if hier[i][3] != -1 or cv2.contourArea(c) < minimum:
            continue
        outer = cv2.approxPolyDP(c, 0.9, True)
        holes = []
        k = hier[i][2]
        while k != -1:
            if cv2.contourArea(contours[k]) > minimum * 0.5:
                holes.append(norm(cv2.approxPolyDP(contours[k], 0.9, True)))
            k = hier[k][0]
        if len(outer) >= 3:
            shapes.append({"outer": norm(outer), "holes": holes})
    return shapes


def relief(rgb):
    """A normal map from the brushwork: bright paint reads as raised. Gentle, so the paint keeps its own shading."""
    lum = cv2.cvtColor(rgb, cv2.COLOR_RGB2GRAY).astype(np.float32) / 255.0
    lum = lum - cv2.GaussianBlur(lum, (0, 0), 6) * 0.85  # keep strokes, drop large shading
    lum = cv2.GaussianBlur(lum, (0, 0), 0.8)
    gx = cv2.Sobel(lum, cv2.CV_32F, 1, 0, ksize=3)
    gy = cv2.Sobel(lum, cv2.CV_32F, 0, 1, ksize=3)
    k = 2.2
    n = np.dstack([-gx * k, gy * k, np.ones_like(lum)])
    n /= np.linalg.norm(n, axis=2, keepdims=True)
    return ((n * 0.5 + 0.5) * 255).astype(np.uint8)


def save(rgba, path, max_px):
    im = Image.fromarray(rgba, "RGBA")
    if max(im.size) > max_px:
        im.thumbnail((max_px, max_px), Image.LANCZOS)
    im.save(path, "WEBP", quality=90, method=6)
    Image.fromarray(relief(np.array(im.convert("RGB")))).save(path.replace(".webp", "-n.webp"), "WEBP", quality=88)
    return im.size


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("src")
    ap.add_argument("out")
    ap.add_argument("--name")
    ap.add_argument("--max", type=int, default=2048)
    ap.add_argument("--parts", action="store_true")
    ap.add_argument("--opaque", action="store_true")
    a = ap.parse_args()
    name = a.name or os.path.splitext(os.path.basename(a.src))[0]
    os.makedirs(a.out, exist_ok=True)
    rgba = np.array(Image.open(a.src).convert("RGBA"))
    H, W = rgba.shape[:2]

    if a.opaque:
        rgba[..., 3] = 255
        w, h = save(rgba, os.path.join(a.out, f"{name}.webp"), a.max)
        meta = {"name": name, "file": f"{name}.webp", "normal": f"{name}-n.webp", "w": w, "h": h, "aspect": round(W / H, 4), "opaque": True}
        json.dump(meta, open(os.path.join(a.out, f"{name}.json"), "w"), indent=1)
        print(name, "backcloth", w, h)
        return

    alpha = rgba[..., 3]
    solid = (alpha > 32).astype(np.uint8)
    if a.parts:
        n, labels, stats, cent = cv2.connectedComponentsWithStats(solid, connectivity=8)
        blobs = [k for k in range(1, n) if stats[k, cv2.CC_STAT_AREA] > 0.004 * W * H]
    else:
        labels, blobs = solid, [1]

    parts = []
    for idx, k in enumerate(blobs):
        m = labels == k
        ys, xs = np.where(m)
        pad = 6
        y0, y1, x0, x1 = max(0, ys.min() - pad), min(H, ys.max() + pad + 1), max(0, xs.min() - pad), min(W, xs.max() + pad + 1)
        crop = rgba[y0:y1, x0:x1].copy()
        if a.parts:
            crop[..., 3] = np.where(m[y0:y1, x0:x1], crop[..., 3], 0)
        fname = f"{name}-{idx}.webp" if a.parts else f"{name}.webp"
        w, h = save(crop, os.path.join(a.out, fname), a.max)
        parts.append({"file": fname, "normal": fname.replace(".webp", "-n.webp"), "w": w, "h": h, "aspect": round((x1 - x0) / (y1 - y0), 4),
                      "box": [round(x0 / W, 4), round(y0 / H, 4), round(x1 / W, 4), round(y1 / H, 4)],
                      "shapes": trace(crop[..., 3])})
    meta = {"name": name, "parts": parts} if a.parts else {"name": name, **parts[0]}
    json.dump(meta, open(os.path.join(a.out, f"{name}.json"), "w"), separators=(",", ":"))
    for p in parts:
        print(name, p["file"], p["w"], p["h"], "shapes", len(p["shapes"]), "points",
              sum(len(s["outer"]) + sum(len(h) for h in s["holes"]) for s in p["shapes"]), "box", p["box"])


if __name__ == "__main__":
    main()
