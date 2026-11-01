import * as THREE from 'three';
import type { Art, Shape } from '../core/types.ts';

// Cardboard: a traced outline extruded to a thin solid. The face carries the paint. The cut edge shows the
// corrugated flutes. The back is raw kraft board. A piece that turns shows all three.

const loader = new THREE.TextureLoader();
const textures = new Map<string, Promise<THREE.Texture>>();

export function loadTexture(url: string, renderer?: THREE.WebGLRenderer): Promise<THREE.Texture> {
  let p = textures.get(url);
  if (!p) {
    const loading = loader.loadAsync(url).then((t) => {
      t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = renderer?.capabilities.getMaxAnisotropy() ?? 8;
      return t;
    });
    // A failed load leaves the cache, so the next attempt asks the network again.
    loading.catch(() => {
      if (textures.get(url) === loading) textures.delete(url);
    });
    textures.set(url, loading);
    p = loading;
  }
  return p;
}

function canvasTexture(w: number, h: number, draw: (g: CanvasRenderingContext2D) => void): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  draw(c.getContext('2d')!);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  return t;
}

/** The cut edge: two liners with the wavy flute between them, repeated along the edge. */
const edgeTexture = canvasTexture(128, 64, (g) => {
  g.fillStyle = '#8a6440';
  g.fillRect(0, 0, 128, 64);
  g.fillStyle = '#b48a5c';
  g.fillRect(0, 0, 128, 9);
  g.fillRect(0, 55, 128, 9);
  g.strokeStyle = '#c99d6c';
  g.lineWidth = 5;
  g.beginPath();
  for (let x = 0; x <= 128; x += 2) {
    const y = 32 + Math.sin((x / 128) * Math.PI * 4) * 20;
    x === 0 ? g.moveTo(x, y) : g.lineTo(x, y);
  }
  g.stroke();
});

/** The back: kraft board with a few fibres. */
const backTexture = canvasTexture(256, 256, (g) => {
  g.fillStyle = '#9c7650';
  g.fillRect(0, 0, 256, 256);
  let s = 7;
  const r = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  for (let i = 0; i < 900; i++) {
    g.strokeStyle = r() < 0.5 ? 'rgba(70,45,20,0.10)' : 'rgba(230,200,150,0.10)';
    g.lineWidth = 1;
    const x = r() * 256, y = r() * 256, a = r() * Math.PI;
    g.beginPath();
    g.moveTo(x, y);
    g.lineTo(x + Math.cos(a) * 6, y + Math.sin(a) * 6);
    g.stroke();
  }
});

export const edgeMaterial = new THREE.MeshStandardMaterial({ map: edgeTexture, roughness: 0.95, metalness: 0 });
export const backMaterial = new THREE.MeshStandardMaterial({ map: backTexture, roughness: 0.95, metalness: 0 });

/**
 * Painted face. Gold leaf is found by colour: saturated yellow paint becomes metallic and smoother, so it
 * glints as a light moves across it. `glow` lets the paint itself shine (lamps, flames, windows).
 */
export function faceMaterial(
  map: THREE.Texture,
  glow = 0,
  opaque = false,
  normalMap: THREE.Texture | null = null,
  silhouette?: { color: number; windows?: number },
): THREE.MeshStandardMaterial {
  const m = new THREE.MeshStandardMaterial({
    map,
    normalMap: silhouette ? null : normalMap,
    normalScale: new THREE.Vector2(0.55, 0.55),
    color: silhouette ? silhouette.color : 0xffffff,
    roughness: silhouette ? 0.95 : 0.84,
    metalness: 0,
    alphaTest: opaque ? 0 : 0.5,
    // Every face carries its glow map from the start. Adding it later would recompile the shader mid-show.
    emissive: silhouette ? new THREE.Color(1, 0.7, 0.36) : new THREE.Color(1, 1, 1),
    emissiveMap: map,
    emissiveIntensity: silhouette ? (silhouette.windows ?? 0) + glow : glow,
  });
  m.userData.silhouette = !!silhouette;
  gilt(m);
  return m;
}

/**
 * Gold leaf, found by colour: saturated yellow paint becomes metallic and smoother, so it glints as a light
 * moves across it. Colours are linear here. Gold leaf sits near g/r = 0.55 with almost no blue and a very high
 * saturation. Skin (saturation about 0.6) and crimson (g/r about 0.12) stay plain paint.
 */
export function gilt(m: THREE.MeshStandardMaterial) {
  m.onBeforeCompile = (shader) => {
    shader.fragmentShader = shader.fragmentShader
      .replace(
        '#include <roughnessmap_fragment>',
        `#include <roughnessmap_fragment>
        {
          vec3 c = diffuseColor.rgb;
          float mx = max(c.r, max(c.g, c.b)), mn = min(c.r, min(c.g, c.b));
          float sat = (mx - mn) / max(mx, 1e-3);
          float hue = smoothstep(0.17, 0.05, abs(c.g / max(c.r, 1e-3) - 0.55)) * step(c.b * 2.0, c.g);
          gold = hue * smoothstep(0.70, 0.85, sat) * smoothstep(0.18, 0.40, mx);
          roughnessFactor = mix(roughnessFactor, 0.3, gold);
        }`,
      )
      .replace(
        '#include <metalnessmap_fragment>',
        `#include <metalnessmap_fragment>
        metalnessFactor = mix(metalnessFactor, 0.85, gold);`,
      )
      .replace('void main() {', 'float gold = 0.0;\nfloat win = 0.0;\nvoid main() {');
    if (m.userData.silhouette) {
      // A silhouette keeps only the cut of the art: one flat tone with paper grain. Warm lit windows in the
      // art become panes of light, scaled by the glow.
      shader.fragmentShader = shader.fragmentShader
        .replace(
          '#include <map_fragment>',
          `#ifdef USE_MAP
            vec4 texel = texture2D(map, vMapUv);
            diffuseColor.a *= texel.a;
            float grain = fract(sin(dot(floor(vMapUv * 900.0), vec2(12.9898, 78.233))) * 43758.5453);
            diffuseColor.rgb *= 0.93 + 0.07 * grain;
            win = smoothstep(0.5, 0.75, texel.r) * smoothstep(0.3, 0.55, texel.g) * (1.0 - smoothstep(0.25, 0.5, texel.b)) * step(texel.g, texel.r);
          #endif`,
        )
        .replace('#include <emissivemap_fragment>', 'totalEmissiveRadiance *= win;');
    }
  };
}

/**
 * Builds the solid of one cutout. Width w and height h are world units. The origin is the anchor:
 * 'bottom' puts it at the bottom centre, 'center' at the middle, a point puts it at that spot (0..1, y down).
 * Groups: 0 back, 1 face, 2 edge.
 */
export function cardboardGeometry(
  shapes: Shape[] | undefined,
  w: number,
  h: number,
  thick: number,
  anchor: 'bottom' | 'center' | [number, number] = 'bottom',
): THREE.BufferGeometry {
  const [ax, ay] = anchor === 'bottom' ? [0.5, 1] : anchor === 'center' ? [0.5, 0.5] : anchor;
  const toV = (p: [number, number]) => new THREE.Vector2((p[0] - ax) * w, (ay - p[1]) * h);
  const list: THREE.Shape[] = [];
  const src = shapes?.length ? shapes : [{ outer: [[0, 0], [1, 0], [1, 1], [0, 1]] as [number, number][], holes: [] }];
  for (const s of src) {
    const shape = new THREE.Shape(s.outer.map(toV));
    for (const hole of s.holes) shape.holes.push(new THREE.Path(hole.map(toV)));
    list.push(shape);
  }
  const geo = new THREE.ExtrudeGeometry(list, { depth: thick, bevelEnabled: false, curveSegments: 1 });
  geo.translate(0, 0, -thick / 2);

  // ExtrudeGeometry puts both lids in group 0: the back lid first, then the front. Split them.
  const lids = geo.groups.find((g) => g.materialIndex === 0)!;
  const sides = geo.groups.find((g) => g.materialIndex === 1)!;
  geo.clearGroups();
  geo.addGroup(lids.start, lids.count / 2, 0);
  geo.addGroup(lids.start + lids.count / 2, lids.count / 2, 1);
  geo.addGroup(sides.start, sides.count, 2);

  // Lid UVs map the art: u across the width, v up the height.
  const pos = geo.attributes.position as THREE.BufferAttribute;
  const uv = geo.attributes.uv as THREE.BufferAttribute;
  for (let i = lids.start; i < lids.start + lids.count; i++) {
    uv.setXY(i, pos.getX(i) / w + ax, pos.getY(i) / h + (1 - ay));
  }
  // Edge UVs: u along the outline in units of about 2 cm, v across the thickness.
  for (let i = sides.start; i < sides.start + sides.count; i++) {
    uv.setXY(i, uv.getX(i) * 40, (pos.getZ(i) + thick / 2) / thick);
  }
  uv.needsUpdate = true;
  geo.computeVertexNormals();
  return geo;
}

/** A finished cutout mesh: back, painted face and corrugated edge. */
export async function cardboardMesh(
  art: Art,
  w: number,
  h: number,
  opts: { thick?: number; anchor?: 'bottom' | 'center' | [number, number]; glow?: number; renderer?: THREE.WebGLRenderer; silhouette?: { color: number } } = {},
): Promise<THREE.Mesh> {
  const map = await loadTexture(art.url, opts.renderer);
  const normal = art.normalUrl ? await loadTexture(art.normalUrl, opts.renderer) : null;
  if (normal) normal.colorSpace = THREE.NoColorSpace;
  const geo = cardboardGeometry(art.shapes, w, h, opts.thick ?? 0.02, opts.anchor ?? 'bottom');
  const face = faceMaterial(map, opts.glow ?? 0, !!art.opaque, normal, opts.silhouette);
  const mesh = new THREE.Mesh(geo, [backMaterial, face, edgeMaterial]);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  mesh.customDepthMaterial = new THREE.MeshDepthMaterial({ depthPacking: THREE.RGBADepthPacking, map, alphaTest: 0.5 });
  return mesh;
}
