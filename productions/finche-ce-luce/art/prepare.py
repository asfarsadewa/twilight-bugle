#!/usr/bin/env python3
"""Cut the tower painting into four drums, so the tower can rise on stage one course at a time.

  python productions/finche-ce-luce/art/prepare.py

Writes src/tower-1.png (the base) to src/tower-4.png (the top with its railing) and cuts each into art/cut/.
It prints the height of each drum as a share of the whole tower, which production.ts uses to stack them.
"""
import json, os, subprocess, sys
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
CUTOUT = os.path.join(HERE, '..', '..', '..', 'tools', 'cutout.py')


def main():
    im = Image.open(os.path.join(HERE, 'src', 'flat-tower.png')).convert('RGBA')
    box = im.getchannel('A').point(lambda a: 255 if a > 110 else 0).getbbox()
    tower = im.crop(box)
    W, H = tower.size
    # Cut at the stone bands, so each drum ends on a course. Shares are of the painted height, top to bottom.
    cuts = [0, 0.27, 0.5, 0.74, 1.0]
    shares = []
    for k in range(4):
        y0, y1 = int(H * cuts[k]), int(H * cuts[k + 1])
        drum = Image.new('RGBA', (W, y1 - y0), (0, 0, 0, 0))
        drum.alpha_composite(tower.crop((0, y0, W, y1)))
        n = 4 - k
        drum.save(os.path.join(HERE, 'src', f'tower-{n}.png'))
        subprocess.run([sys.executable, CUTOUT, os.path.join(HERE, 'src', f'tower-{n}.png'), os.path.join(HERE, 'cut'), '--name', f'tower-{n}'], check=True, capture_output=True)
        shares.append({'drum': n, 'share': round((y1 - y0) / H, 4), 'width_share': 1.0})
    json.dump({'tower_px': [W, H], 'drums': shares[::-1]}, open(os.path.join(HERE, 'cut', 'tower-drums.json'), 'w'), indent=1)
    print(json.dumps(shares[::-1]))


if __name__ == '__main__':
    main()
