import * as THREE from 'three';
import type { Production } from '../core/types.ts';

// The house wall beside the arch: one framed poster for each show in the repertoire. Every poster has the same
// size, frame and lamp. They hang in show order, left to right, half on each side of the arch. Up to two shows a
// side hang in one row of large posters. More shows hang in two rows of smaller posters, and the wall grows
// outward column by column. An empty frame keeps the two sides even.

const W = 1.6;
const H = 2.4;
const GAP = 0.32;
/** Just in front of the proscenium wall. */
const Z = -0.2;

type Lang = 'zh' | 'en' | 'id' | 'fr' | 'jv' | 'ko';
/** The two titles under the lead, by the lead language. */
const UNDER: Record<Lang, [Lang, Lang]> = { zh: ['en', 'id'], id: ['en', 'zh'], en: ['id', 'zh'], fr: ['zh', 'id'], jv: ['zh', 'en'], ko: ['id', 'en'] };

interface Slot {
  id: string | null;
  group: THREE.Group;
  paper: THREE.MeshStandardMaterial;
  pool: THREE.MeshBasicMaterial;
  lit: number;
}

export class PosterWall {
  readonly group = new THREE.Group();
  private slots: Slot[] = [];
  /** Half the width of the wall the posters take, from the centre line. The lobby camera frames it. */
  reach = 0;
  /** Height of the poster centres. Two rows hang higher. */
  y: number;
  readonly z = Z;
  hovered: string | null = null;
  chosen: string | null = null;
  private last = performance.now();

  constructor(private archHalf: number, centreY: number) {
    this.y = centreY;
  }

  /** Hangs the posters. `onProgress` gets the share of posters printed, 0..1. All of them print at once. */
  async build(shows: Production[], onProgress?: (k: number) => void) {
    const order = [...shows].sort((a, b) => a.no - b.no);
    const ids: (Production | null)[] = order.length % 2 ? [...order, null] : order;
    let printed = 0;
    const prints = ids.map((p) =>
      (p ? printPoster(p) : blankPoster()).then((canvas) => {
        onProgress?.(++printed / ids.length);
        return canvas;
      }),
    );
    const half = ids.length / 2;
    const rows = half > 2 ? 2 : 1;
    const s = rows === 1 ? 1 : 0.62;
    const cols = Math.ceil(half / rows);
    // Two rows reach low on the wall, where the front railing would cut the lower row. The wall hangs them higher.
    if (rows === 2) this.y += 0.34;
    const frame = new THREE.MeshStandardMaterial({ color: 0xb98a3e, metalness: 0.85, roughness: 0.36 });
    const board = new THREE.MeshStandardMaterial({ color: 0x24140c, roughness: 0.7 });
    const brass = new THREE.MeshStandardMaterial({ color: 0xc8963e, metalness: 0.9, roughness: 0.3 });
    const poolMap = lightPool();
    for (let i = 0; i < ids.length; i++) {
      const p = ids[i]!;
      // Read left to right, top row first. Left side: show 1 hangs outermost. Right side: the next show innermost.
      const side = i < half ? -1 : 1;
      const j = side < 0 ? i : i - half;
      const row = rows === 1 ? 0 : Math.floor(j / cols);
      const col = j % cols;
      const k = side < 0 ? cols - 1 - col : col;
      const x = side * (this.archHalf + GAP + (W * s) / 2 + k * (W * s + GAP));
      const y = this.y + (rows === 1 ? 0 : (row === 0 ? 1 : -1) * ((H * s) / 2 + 0.16));
      const g = new THREE.Group();
      g.position.set(x, y, Z);
      g.scale.setScalar(s);

      const back = new THREE.Mesh(new THREE.BoxGeometry(W + 0.16, H + 0.16, 0.03), board);
      back.position.z = -0.015;
      g.add(back);
      for (const [w, h, fx, fy] of [[W + 0.16, 0.06, 0, (H + 0.1) / 2], [W + 0.16, 0.06, 0, -(H + 0.1) / 2], [0.06, H + 0.16, (W + 0.1) / 2, 0], [0.06, H + 0.16, -(W + 0.1) / 2, 0]] as const) {
        const bar = new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.045), frame);
        bar.position.set(fx, fy, 0.012);
        g.add(bar);
      }

      const tex = new THREE.CanvasTexture(await prints[i]!);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = 8;
      const paper = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.85, emissive: 0xffffff, emissiveMap: tex, emissiveIntensity: 0.06 });
      // The paper bows a little between the frame edges.
      const geo = new THREE.PlaneGeometry(W, H, 6, 9);
      const pos = geo.getAttribute('position') as THREE.BufferAttribute;
      for (let v = 0; v < pos.count; v++) pos.setZ(v, 0.006 * Math.cos((pos.getX(v) / W) * Math.PI) * Math.cos((pos.getY(v) / H) * Math.PI));
      geo.computeVertexNormals();
      const sheet = new THREE.Mesh(geo, paper);
      sheet.position.z = 0.008;
      g.add(sheet);

      // The picture lamp: a brass hood on an arm above the frame, and the pool of light it throws.
      const hood = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, W * 0.5, 16), brass);
      hood.rotation.z = Math.PI / 2;
      hood.position.set(0, H / 2 + 0.14, 0.16);
      const arm = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.02, 0.16), brass);
      arm.position.set(0, H / 2 + 0.14, 0.08);
      g.add(hood, arm);
      const pool = new THREE.MeshBasicMaterial({ map: poolMap, transparent: true, opacity: 0.3, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false });
      const poolMesh = new THREE.Mesh(new THREE.PlaneGeometry(W + 0.7, H + 0.6), pool);
      poolMesh.position.set(0, 0.12, 0.03);
      poolMesh.userData.noAO = true;
      g.add(poolMesh);

      this.group.add(g);
      this.slots.push({ id: p?.id ?? null, group: g, paper, pool, lit: 0 });
      this.reach = Math.max(this.reach, Math.abs(x) + (W * s) / 2 + 0.1);
    }
  }

  /**
   * Eases each lamp toward its level: brighter for the poster under the pointer or the one picked.
   * `house` is the house light level. The picture lamps are on the house circuit, so they go dark during a show.
   */
  update(house: number) {
    const now = performance.now();
    const dt = Math.min(0.1, (now - this.last) / 1000);
    this.last = now;
    const on = Math.min(1, house / 0.85);
    for (const s of this.slots) {
      const want = s.id && (s.id === this.hovered || s.id === this.chosen) ? 1 : 0;
      s.lit += (want - s.lit) * Math.min(1, dt * 7);
      s.pool.opacity = (0.3 + s.lit * 0.45) * on;
      s.paper.emissiveIntensity = (0.06 + s.lit * 0.16) * on;
      s.group.position.z = Z + s.lit * 0.04;
    }
  }

  /** Each poster's outline on screen, as fractions of the frame (0..1 from the top left). */
  rects(camera: THREE.Camera): { id: string; x: number; y: number; w: number; h: number }[] {
    const out: { id: string; x: number; y: number; w: number; h: number }[] = [];
    const v = new THREE.Vector3();
    for (const s of this.slots) {
      if (!s.id) continue;
      let x0 = 1, y0 = 1, x1 = 0, y1 = 0;
      for (const [cx, cy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
        v.set((cx! * W) / 2, (cy! * H) / 2, 0);
        s.group.localToWorld(v).project(camera);
        const sx = (v.x + 1) / 2, sy = (1 - v.y) / 2;
        x0 = Math.min(x0, sx);
        x1 = Math.max(x1, sx);
        y0 = Math.min(y0, sy);
        y1 = Math.max(y1, sy);
      }
      out.push({ id: s.id, x: x0, y: y0, w: x1 - x0, h: y1 - y0 });
    }
    return out;
  }
}

/** A soft oval pool of warm light, brightest under the lamp at the top. It fades to nothing before its edges. */
function lightPool(): THREE.Texture {
  const c = document.createElement('canvas');
  c.width = 256;
  c.height = 384;
  const g = c.getContext('2d')!;
  // Drawn in a circle space stretched to the oval: 128 across, 192 down.
  g.setTransform(1, 0, 0, 1.5, 0, 0);
  const grd = g.createRadialGradient(128, 40, 4, 128, 118, 126);
  grd.addColorStop(0, 'rgba(255,214,150,0.6)');
  grd.addColorStop(0.4, 'rgba(255,190,120,0.22)');
  grd.addColorStop(1, 'rgba(255,170,100,0)');
  g.fillStyle = grd;
  g.fillRect(0, 0, 256, 256);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

const INK = '#1e1611';
const RED = '#8e1c1a';

/** Show numbers print in Roman numerals, as on an old programme. */
export function roman(n: number): string {
  let out = '';
  for (const [v, s] of [[1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'], [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'], [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']] as const) {
    while (n >= v) {
      out += s;
      n -= v;
    }
  }
  return out;
}

/** Prints the titles on the poster art: the sung title in the top band, the other two and the house in the bottom band. */
export async function printPoster(p: Production): Promise<HTMLCanvasElement> {
  const img = new Image();
  img.src = p.poster;
  await img.decode();
  const c = document.createElement('canvas');
  c.width = 1024;
  c.height = 1536;
  const g = c.getContext('2d')!;
  g.drawImage(img, 0, 0, 1024, 1536);

  const lead = (p.master.sung ?? 'zh') as Lang;
  const rest = UNDER[lead];
  const title = (l: Lang) => p.title[l] ?? p.title.en;
  const all = `${p.title.zh}${p.title.en}${p.title.id}${p.title.fr ?? ''}${p.title.jv ?? ''}${p.title.ko ?? ''}`;
  await Promise.all([
    document.fonts.load('900 80px "Noto Serif SC"', all),
    document.fonts.load('900 80px "Noto Serif KR"', all),
    document.fonts.load('400 80px "Abril Fatface"', all),
    document.fonts.load('italic 40px "IM Fell English"', all),
    document.fonts.load('700 24px "Playfair Display SC"', 'THE TWILIGHT BUGLE'),
  ]);
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  const fit = (text: string, font: (px: number) => string, px: number, max: number) => {
    g.font = font(px);
    while (g.measureText(text).width > max && px > 12) g.font = font(--px);
  };
  const ink = (text: string, x: number, y: number, color: string, spacing = '0px') => {
    g.fillStyle = color;
    g.globalAlpha = 0.92;
    (g as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = spacing;
    g.fillText(text, x, y);
    g.globalAlpha = 1;
  };
  const face = (l: Lang, big: boolean) =>
    l === 'zh' ? (px: number) => `900 ${px}px "Noto Serif SC", serif` : l === 'ko' ? (px: number) => `900 ${px}px "Noto Serif KR", serif` : big ? (px: number) => `400 ${px}px "Abril Fatface", serif` : (px: number) => `italic ${px}px "IM Fell English", serif`;

  // Top band: the title in the sung language.
  const cjk = lead === 'zh' || lead === 'ko';
  const top = cjk ? title(lead) : title(lead).toUpperCase();
  fit(top, face(lead, true), cjk ? 88 : 76, 820);
  ink(top, 512, 74, INK, cjk ? '14px' : '2px');

  // Bottom band: the other two titles and the house.
  const second = rest[0]!, third = rest[1]!;
  const t2 = second === 'zh' ? p.title.zh : title(second).toUpperCase();
  fit(t2, second === 'zh' ? face('zh', true) : face(second, true), second === 'zh' ? 54 : 44, 820);
  ink(t2, 512, 1392, INK, second === 'zh' ? '8px' : '1px');
  fit(title(third), face(third, false), third === 'zh' ? 40 : 38, 820);
  ink(title(third), 512, 1446, RED);
  g.font = '700 22px "Playfair Display SC", serif';
  ink(`The Twilight Bugle  ·  ${roman(p.no)}`, 512, 1494, INK, '6px');

  wear(g, p.no);
  return c;
}

/** The empty frame: plain paper that waits for the next show. */
async function blankPoster(): Promise<HTMLCanvasElement> {
  const c = document.createElement('canvas');
  c.width = 1024;
  c.height = 1536;
  const g = c.getContext('2d')!;
  g.fillStyle = '#e4d1aa';
  g.fillRect(0, 0, 1024, 1536);
  await document.fonts.load('700 40px "Playfair Display SC"', 'In Rehearsal');
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  g.fillStyle = INK;
  g.globalAlpha = 0.75;
  g.font = '700 40px "Playfair Display SC", serif';
  (g as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = '10px';
  g.fillText('In Rehearsal', 512, 768);
  g.globalAlpha = 1;
  wear(g, 99);
  return c;
}

/** Paper age: browned edges, a few foxing spots and a soft fade. */
function wear(g: CanvasRenderingContext2D, seed: number) {
  let s = seed * 9301 + 49297;
  const r = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  g.globalCompositeOperation = 'multiply';
  const edge = g.createRadialGradient(512, 768, 420, 512, 768, 980);
  edge.addColorStop(0, 'rgba(255,255,255,0)');
  edge.addColorStop(1, 'rgba(150,100,50,0.55)');
  g.fillStyle = edge;
  g.fillRect(0, 0, 1024, 1536);
  for (let i = 0; i < 14; i++) {
    const x = r() * 1024, y = r() * 1536, rad = 3 + r() * 10;
    const spot = g.createRadialGradient(x, y, 0, x, y, rad);
    spot.addColorStop(0, 'rgba(140,90,40,0.45)');
    spot.addColorStop(1, 'rgba(140,90,40,0)');
    g.fillStyle = spot;
    g.fillRect(x - rad, y - rad, rad * 2, rad * 2);
  }
  g.globalCompositeOperation = 'source-over';
  g.fillStyle = 'rgba(236,222,190,0.07)';
  g.fillRect(0, 0, 1024, 1536);
}
