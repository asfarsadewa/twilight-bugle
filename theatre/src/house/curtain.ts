import * as THREE from 'three';
import type { CurtainStyle } from '../core/types.ts';

// The house curtain: two halves of crimson velvet with a gold fringe. The folds are real geometry, moved on the
// CPU each frame, so the velvet sheen rolls across them as they bunch.
//   traveller  the halves draw apart to the sides and the folds gather
//   tableau    a cord lifts each half up and out on a diagonal into a swag
//   fly        the whole curtain rises into the fly tower

export const CURTAIN_STYLES: CurtainStyle[] = ['traveller', 'tableau', 'fly'];
export const curtainStyleIndex = (s: CurtainStyle) => CURTAIN_STYLES.indexOf(s);

const SEG_X = 96;
const SEG_Y = 40;

export class Curtain {
  readonly group = new THREE.Group();
  private halves: { mesh: THREE.Mesh; base: Float32Array; side: number }[] = [];

  constructor(private width: number, private height: number, z: number, bottom: number) {
    const mat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      vertexColors: true,
      roughness: 0.66,
      sheen: 1,
      sheenRoughness: 0.32,
      sheenColor: new THREE.Color(0xff5a64),
      side: THREE.DoubleSide,
    });
    const half = width / 2 + 0.18;
    for (const side of [-1, 1]) {
      const geo = new THREE.PlaneGeometry(half, height, SEG_X, SEG_Y);
      // Local x runs from 0 at the centre line to `half` at the outer edge. y runs from 0 at the hem up.
      geo.translate(half / 2, height / 2, 0);
      if (side < 0) {
        // Mirroring reverses the winding. Turn each triangle back, so passes that cull back faces
        // (occlusion, depth of field) still see this half of the curtain.
        geo.scale(-1, 1, 1);
        const idx = geo.getIndex()!;
        for (let i = 0; i < idx.count; i += 3) {
          const a = idx.getX(i + 1);
          idx.setX(i + 1, idx.getX(i + 2));
          idx.setX(i + 2, a);
        }
      }
      const position = geo.getAttribute('position') as THREE.BufferAttribute;
      const colors = new Float32Array(position.count * 3);
      const crimson = new THREE.Color(0x7a0e1c), gold = new THREE.Color(0xc89a3c);
      for (let i = 0; i < position.count; i++) {
        const y = position.getY(i);
        const c = y < height * 0.035 ? gold : crimson;
        colors.set([c.r, c.g, c.b], i * 3);
      }
      geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      const mesh = new THREE.Mesh(geo, mat);
      mesh.receiveShadow = true;
      mesh.position.set(0, bottom, z);
      this.group.add(mesh);
      this.halves.push({ mesh, base: Float32Array.from(position.array), side });
    }
  }

  /** open: 0 closed, 1 fully open. sway: a small breath in the cloth. */
  update(open: number, style: CurtainStyle, t: number, sway = 1) {
    const H = this.height;
    const half = this.width / 2 + 0.18;
    for (const { mesh, base, side } of this.halves) {
      const pos = mesh.geometry.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < pos.count; i++) {
        const bx = base[i * 3]!, by = base[i * 3 + 1]!;
        // Clamped: rounding can put an edge vertex a hair past 1, and a fractional power of a negative is NaN.
        const u = Math.min(1, Math.abs(bx) / half); // 0 at centre line, 1 at outer edge
        const v = Math.min(1, Math.max(0, by / H)); // 0 at hem, 1 at top
        let x = bx, y = by, gather = 0;
        if (style === 'traveller') {
          const k = open * (0.86 - 0.06 * v); // the hem lags the rail a little
          x = side * (half - (half - Math.abs(bx)) * (1 - k));
          gather = k;
        } else if (style === 'tableau') {
          // The cord pulls the lower inner corner toward a point high on the outer side.
          const w = Math.pow(1 - u, 0.7) * Math.pow(1 - v, 0.55) * open;
          const gx = side * half * 1.02, gy = H * 0.9;
          x = bx + (gx - bx) * w;
          y = by + (gy - by) * w;
          gather = Math.min(1, w * 1.6 + open * 0.3 * (1 - u));
        } else {
          y = by + open * (H + 0.8);
          gather = 0;
        }
        const folds = 10 + gather * 8;
        const amp = 0.028 + gather * 0.075;
        const breathe = sway * 0.006 * Math.sin(t * 0.9 + u * 7 + v * 2);
        const z = amp * Math.sin(u * Math.PI * 2 * folds + v * 0.6) + breathe + gather * 0.04 * Math.sin(v * Math.PI);
        pos.setXYZ(i, x, y, z);
      }
      pos.needsUpdate = true;
      mesh.geometry.computeVertexNormals();
      mesh.visible = !(style === 'fly' && open > 0.999);
    }
  }
}
