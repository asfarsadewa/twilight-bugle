import * as THREE from 'three';
import type { Timeline } from '../core/timeline.ts';
import { rng } from '../core/timeline.ts';
import { loadTexture } from './cardboard.ts';
import { STAGE } from './piece.ts';

// Stage effects. Each particle's place is a pure function of time and its seed, so any frame can be drawn alone.
//   snow.rate  0..1 share of flakes falling     snow.x0 .x1   the span of stage it falls on
//   rain.rate  0..1 share of drops falling      rain.x0 .x1
//   fire.rate  0..1 share of flames falling     fire.x0 .x1
//   dust.i     0..1 motes in the light
//   glints.rate 0..1 share of gold sparks falling, glints.x0 .x1
//   meteor.i .x .y .z   a falling star: its head and a tail that follows its own recent path
//   portal.i .x .y .s   a door of light in the sky: a soft radiant disc in front of the cyclorama
//   smoke.i .x .y .z   a small chimney plume; y is height above the stage floor

/** A small practical smoke plume. Its phase comes from show time, so seeking is deterministic. */
class ChimneySmoke {
  readonly group = new THREE.Group();
  private puffs: THREE.Sprite[] = [];

  constructor() {
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 64;
    const ctx = canvas.getContext('2d')!;
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, 'rgba(205,205,210,0.8)');
    gradient.addColorStop(0.45, 'rgba(185,190,200,0.35)');
    gradient.addColorStop(1, 'rgba(185,190,200,0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);
    const map = new THREE.CanvasTexture(canvas);
    map.colorSpace = THREE.SRGBColorSpace;
    for (let i = 0; i < 18; i++) {
      const puff = new THREE.Sprite(new THREE.SpriteMaterial({ map, transparent: true, depthWrite: false, opacity: 0 }));
      this.puffs.push(puff);
      this.group.add(puff);
    }
  }

  update(tl: Timeline, t: number) {
    const level = tl.value('smoke.i', t, 0);
    this.group.visible = level > 0.002;
    if (!this.group.visible) return;
    const x = tl.value('smoke.x', t, 1.3), y = STAGE.floor + tl.value('smoke.y', t, 1.4), z = tl.value('smoke.z', t, -3.2);
    this.puffs.forEach((puff, i) => {
      const age = ((t * 0.12 + i * 0.61803398875) % 1 + 1) % 1;
      const size = 0.07 + age * 0.24;
      puff.position.set(x + age * 0.19 + Math.sin(t * 0.3 + i * 2.1) * 0.018, y + age * 0.72, z);
      puff.scale.set(size, size * 1.35, 1);
      (puff.material as THREE.SpriteMaterial).opacity = level * 0.13 * Math.sin(age * Math.PI) ** 2;
    });
  }
}

interface FallOpts {
  name: string;
  count: number;
  size: [number, number];
  speed: [number, number];
  spin: number;
  z: [number, number];
  /** Rain: each streak falls straight and faces the house. It does not drift or turn. */
  straight?: boolean;
}

class Fall {
  readonly mesh: THREE.InstancedMesh;
  private seeds: { a: number; b: number; c: number; d: number; e: number }[] = [];
  private m = new THREE.Matrix4();
  private q = new THREE.Quaternion();
  private v = new THREE.Vector3();
  private s = new THREE.Vector3();
  private e = new THREE.Euler();

  constructor(private o: FallOpts, material: THREE.Material, aspect = 1) {
    const geo = new THREE.PlaneGeometry(1, 1 / aspect);
    this.mesh = new THREE.InstancedMesh(geo, material, o.count);
    this.mesh.frustumCulled = false;
    const r = rng(o.name.length * 977 + o.count);
    for (let i = 0; i < o.count; i++) this.seeds.push({ a: r(), b: r(), c: r(), d: r(), e: r() });
  }

  update(tl: Timeline, t: number) {
    const o = this.o;
    const rate = tl.value(`${o.name}.rate`, t, 0);
    const x0 = tl.value(`${o.name}.x0`, t, -STAGE.openW / 2), x1 = tl.value(`${o.name}.x1`, t, STAGE.openW / 2);
    const top = STAGE.floor + STAGE.openH + 0.2, height = STAGE.openH + 0.3;
    let shown = 0;
    this.seeds.forEach((sd, i) => {
      if (sd.a > rate) return;
      const speed = o.speed[0] + (o.speed[1] - o.speed[0]) * sd.b;
      const y = top - ((t * speed + sd.c * height) % height);
      const x = x0 + (x1 - x0) * sd.d + (o.straight ? 0 : Math.sin(t * 0.8 + sd.e * 20) * 0.08);
      const z = o.z[0] + (o.z[1] - o.z[0]) * sd.e;
      const size = o.size[0] + (o.size[1] - o.size[0]) * sd.c;
      if (o.straight) this.e.set(0, 0, 0.06);
      else this.e.set(Math.sin(t + sd.a * 9) * 0.6, t * o.spin * (sd.b - 0.5), Math.sin(t * 0.7 + sd.d * 9) * o.spin);
      this.q.setFromEuler(this.e);
      this.m.compose(this.v.set(x, y, z), this.q, this.s.set(size, size, size));
      this.mesh.setMatrixAt(shown++, this.m);
    });
    this.mesh.count = shown;
    this.mesh.visible = shown > 0;
    this.mesh.instanceMatrix.needsUpdate = true;
  }
}

function flakeTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const g = c.getContext('2d')!;
  g.fillStyle = '#efe9dc';
  g.beginPath();
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2, r = i % 2 ? 18 : 30;
    g.lineTo(32 + Math.cos(a) * r, 32 + Math.sin(a) * r);
  }
  g.fill();
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

/** A rain streak: a thin line, brightest in the middle and soft at both ends. */
function streakTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 8;
  c.height = 128;
  const g = c.getContext('2d')!;
  const grd = g.createLinearGradient(0, 0, 0, 128);
  grd.addColorStop(0, 'rgba(220,230,240,0)');
  grd.addColorStop(0.6, 'rgba(230,238,246,0.9)');
  grd.addColorStop(1, 'rgba(230,238,246,0)');
  g.fillStyle = grd;
  g.fillRect(2, 0, 4, 128);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function glowTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const g = c.getContext('2d')!;
  const grd = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  grd.addColorStop(0, 'rgba(255,252,236,1)');
  grd.addColorStop(0.15, 'rgba(255,236,190,0.9)');
  grd.addColorStop(0.45, 'rgba(255,200,120,0.25)');
  grd.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = grd;
  g.fillRect(0, 0, 128, 128);
  // Four soft rays, like a star seen through tears.
  g.globalCompositeOperation = 'lighter';
  for (const a of [0, Math.PI / 2]) {
    g.save();
    g.translate(64, 64);
    g.rotate(a);
    const ray = g.createLinearGradient(-64, 0, 64, 0);
    ray.addColorStop(0, 'rgba(255,240,200,0)');
    ray.addColorStop(0.5, 'rgba(255,240,200,0.5)');
    ray.addColorStop(1, 'rgba(255,240,200,0)');
    g.fillStyle = ray;
    g.fillRect(-64, -1.5, 128, 3);
    g.restore();
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

/** A falling star. Its tail is the head's own path, sampled back in time, so any frame can be drawn alone. */
class Trail {
  readonly mesh: THREE.InstancedMesh;
  private m = new THREE.Matrix4();
  private c = new THREE.Color();
  private static N = 56;

  constructor(map: THREE.Texture) {
    const mat = new THREE.MeshBasicMaterial({ map, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, color: 0xffe2a0, fog: false });
    this.mesh = new THREE.InstancedMesh(new THREE.PlaneGeometry(1, 1), mat, Trail.N);
    this.mesh.frustumCulled = false;
    for (let k = 0; k < Trail.N; k++) this.mesh.setColorAt(k, this.c.setRGB(0, 0, 0));
  }

  update(tl: Timeline, t: number) {
    const lvl = tl.value('meteor.i', t, 0);
    this.mesh.visible = lvl > 0.01;
    if (!this.mesh.visible) return;
    for (let k = 0; k < Trail.N; k++) {
      const tk = t - k * 0.022;
      const x = tl.value('meteor.x', tk, 0), y = STAGE.floor + tl.value('meteor.y', tk, 2), z = tl.value('meteor.z', tk, -3.2);
      const fade = Math.pow(1 - k / Trail.N, 1.6);
      const size = k === 0 ? 0.42 : 0.16 * fade + 0.02;
      this.m.makeScale(size, size, 1).setPosition(x, y, z);
      this.mesh.setMatrixAt(k, this.m);
      this.mesh.setColorAt(k, this.c.setRGB(lvl * fade, lvl * fade, lvl * fade));
    }
    this.mesh.instanceMatrix.needsUpdate = true;
    this.mesh.instanceColor!.needsUpdate = true;
  }
}

/**
 * Fireworks. A shell rises from below the stage as one bright spark, bursts into a ring of sparks, and the sparks
 * fall and fade. A cue sets `fw<k>.at` (launch time), `fw<k>.x`, `fw<k>.y` (burst height above the floor), `fw<k>.z`
 * and `fw<k>.hue` (0 gold, 1 vermilion, 2 plum, 3 white) for up to 16 shells. Every spark follows a path from the
 * shell's seed, so any frame can be drawn alone.
 */
class Fireworks {
  readonly mesh: THREE.InstancedMesh;
  private m = new THREE.Matrix4();
  private c = new THREE.Color();
  private seeds: number[][] = [];
  static SHELLS = 16;
  static SPARKS = 72;
  static RISE = 0.75;
  static LIFE = 2.6;
  static HUES = [new THREE.Color(1, 0.78, 0.38), new THREE.Color(1, 0.36, 0.22), new THREE.Color(1, 0.62, 0.7), new THREE.Color(1, 0.96, 0.88)];

  constructor(map: THREE.Texture) {
    const mat = new THREE.MeshBasicMaterial({ map, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, fog: false });
    const n = Fireworks.SHELLS * (Fireworks.SPARKS + 1);
    this.mesh = new THREE.InstancedMesh(new THREE.PlaneGeometry(1, 1), mat, n);
    this.mesh.frustumCulled = false;
    for (let k = 0; k < n; k++) this.mesh.setColorAt(k, this.c.setRGB(0, 0, 0));
    for (let s = 0; s < Fireworks.SHELLS; s++) {
      const r = rng(9001 + s * 131);
      this.seeds.push(Array.from({ length: Fireworks.SPARKS * 3 }, r));
    }
  }

  update(tl: Timeline, t: number) {
    let any = false;
    const S = Fireworks.SPARKS;
    for (let s = 0; s < Fireworks.SHELLS; s++) {
      const age = t - tl.value(`fw${s}.at`, t, -99);
      const base = s * (S + 1);
      const live = age >= 0 && age < Fireworks.RISE + Fireworks.LIFE;
      if (!live) {
        for (let k = 0; k <= S; k++) this.mesh.setColorAt(base + k, this.c.setRGB(0, 0, 0));
        continue;
      }
      any = true;
      const bx = tl.value(`fw${s}.x`, t, 0), by = STAGE.floor + tl.value(`fw${s}.y`, t, 1.8), bz = tl.value(`fw${s}.z`, t, -3.0);
      const hue = Fireworks.HUES[Math.round(tl.value(`fw${s}.hue`, t, 0)) % 4]!;
      // The shell rising: one spark with a soft tail, easing out as it reaches the top.
      if (age < Fireworks.RISE) {
        const k = age / Fireworks.RISE;
        const y = STAGE.floor - 0.2 + (by - STAGE.floor + 0.2) * (1 - (1 - k) * (1 - k));
        this.m.makeScale(0.07, 0.07, 1).setPosition(bx, y, bz);
        this.mesh.setMatrixAt(base, this.m);
        this.mesh.setColorAt(base, this.c.copy(hue).multiplyScalar(0.9));
        for (let k2 = 1; k2 <= S; k2++) this.mesh.setColorAt(base + k2, this.c.setRGB(0, 0, 0));
        continue;
      }
      this.mesh.setColorAt(base, this.c.setRGB(0, 0, 0));
      const a = age - Fireworks.RISE;
      const fade = Math.pow(Math.max(0, 1 - a / Fireworks.LIFE), 1.4);
      const seed = this.seeds[s]!;
      for (let k = 0; k < S; k++) {
        const ang = (k / S) * Math.PI * 2 + seed[k * 3]! * 0.2;
        const speed = 0.75 + seed[k * 3 + 1]! * 0.45;
        const out = speed * (1 - Math.exp(-a * 2.6));
        const x = bx + Math.cos(ang) * out;
        const y = by + Math.sin(ang) * out - 0.32 * a * a;
        const z = bz + (seed[k * 3 + 2]! - 0.5) * 0.4;
        const twinkle = 0.75 + 0.25 * Math.sin(t * 31 + k * 7.1);
        const size = 0.05 + 0.07 * fade;
        this.m.makeScale(size, size, 1).setPosition(x, y, z);
        this.mesh.setMatrixAt(base + 1 + k, this.m);
        this.mesh.setColorAt(base + 1 + k, this.c.copy(hue).multiplyScalar(1.5 * fade * twinkle * (a < 0.12 ? 1.8 : 1)));
      }
    }
    this.mesh.visible = any;
    this.mesh.instanceMatrix.needsUpdate = true;
    this.mesh.instanceColor!.needsUpdate = true;
  }
}

/** A door of light in the sky: a radiant disc that breathes and turns slowly. */
class Portal {
  readonly mesh: THREE.Mesh;
  private mat: THREE.ShaderMaterial;

  constructor() {
    this.mat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: { level: { value: 0 }, time: { value: 0 }, color: { value: new THREE.Color(0xffe6b0) } },
      vertexShader: 'varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
      fragmentShader: `
        uniform float level, time; uniform vec3 color; varying vec2 vUv;
        void main() {
          vec2 p = vUv - 0.5; float r = length(p) * 2.0; float a = atan(p.y, p.x);
          float core = exp(-r * r * 9.0);
          float ring = exp(-pow((r - 0.55) / 0.08, 2.0)) * 0.35;
          float rays = pow(0.5 + 0.5 * cos(a * 12.0 + time * 0.25), 6.0) * exp(-r * 2.2) * 0.6;
          float k = (core + ring + rays) * smoothstep(1.0, 0.7, r);
          gl_FragColor = vec4(color * k * level, 1.0);
        }`,
    });
    this.mesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), this.mat);
    this.mesh.frustumCulled = false;
  }

  update(tl: Timeline, t: number) {
    const lvl = tl.value('portal.i', t, 0);
    this.mesh.visible = lvl > 0.01;
    if (!this.mesh.visible) return;
    const s = tl.value('portal.s', t, 2.2) * (1 + 0.03 * Math.sin(t * 1.3));
    this.mesh.scale.set(s, s, 1);
    this.mesh.position.set(tl.value('portal.x', t, 0), STAGE.floor + tl.value('portal.y', t, 1.6), -4.4);
    this.mat.uniforms.level!.value = lvl;
    this.mat.uniforms.time!.value = t;
  }
}

export class Effects {
  readonly group = new THREE.Group();
  constructor() {
    this.group.userData.noAO = true;
  }
  private falls: Fall[] = [];
  private dust!: THREE.Points;
  private dustSeeds!: Float32Array;
  private trail?: Trail;
  private portal?: Portal;
  private fireworks?: Fireworks;
  private smoke?: ChimneySmoke;
  /** The fire, once a production brings flame art. A failed build clears it, so the next load tries again. */
  private fire: Promise<void> | null = null;

  private async buildFire(flameUrl: string) {
    const map = await loadTexture(flameUrl);
    const fireMat = new THREE.MeshStandardMaterial({ map, alphaTest: 0.5, side: THREE.DoubleSide, emissive: 0xffffff, emissiveMap: map, emissiveIntensity: 1.6 });
    const img = map.image as { width: number; height: number };
    const fire = new Fall({ name: 'fire', count: 70, size: [0.12, 0.22], speed: [0.7, 1.1], spin: 0.6, z: [-2.2, -0.6] }, fireMat, img.width / img.height);
    this.falls.push(fire);
    this.group.add(fire.mesh);
  }

  async build(flameUrl: string | undefined) {
    // Fire needs a production's flame art. It joins the effects the first time a production brings one.
    if (flameUrl) {
      this.fire ??= this.buildFire(flameUrl).catch((err) => {
        this.fire = null;
        throw err;
      });
      await this.fire;
    }
    if (this.dust) return;
    const glow = glowTexture();
    const glintMat = new THREE.MeshBasicMaterial({ map: glow, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, color: 0xffe0a0, side: THREE.DoubleSide });
    const glints = new Fall({ name: 'glints', count: 260, size: [0.05, 0.11], speed: [0.22, 0.45], spin: 0.4, z: [-2.4, 0.2] }, glintMat);
    this.falls.push(glints);
    this.group.add(glints.mesh);
    this.trail = new Trail(glow);
    this.portal = new Portal();
    this.fireworks = new Fireworks(glow);
    this.smoke = new ChimneySmoke();
    this.group.add(this.trail.mesh, this.portal.mesh, this.fireworks.mesh, this.smoke.group);
    const snowMat = new THREE.MeshStandardMaterial({ map: flakeTexture(), alphaTest: 0.5, side: THREE.DoubleSide, roughness: 0.9 });
    const snow = new Fall({ name: 'snow', count: 420, size: [0.03, 0.06], speed: [0.18, 0.32], spin: 2.5, z: [-2.4, 0.2] }, snowMat);
    this.falls.push(snow);
    this.group.add(snow.mesh);
    const rainMat = new THREE.MeshBasicMaterial({ map: streakTexture(), transparent: true, opacity: 0.5, depthWrite: false, side: THREE.DoubleSide, color: 0xc8d4e2 });
    const rain = new Fall({ name: 'rain', count: 1400, size: [0.006, 0.009], speed: [3.6, 5.2], spin: 0, z: [-2.6, 0.4], straight: true }, rainMat, 0.03);
    this.falls.push(rain);
    this.group.add(rain.mesh);
    const n = 500;
    this.dustSeeds = new Float32Array(n * 3);
    const r = rng(41);
    for (let i = 0; i < n * 3; i++) this.dustSeeds[i] = r();
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(n * 3), 3));
    this.dust = new THREE.Points(geo, new THREE.PointsMaterial({ color: 0xffe6bf, size: 0.012, transparent: true, opacity: 0.6, depthWrite: false, blending: THREE.AdditiveBlending }));
    this.dust.frustumCulled = false;
    this.group.add(this.dust);
  }

  update(tl: Timeline, t: number) {
    if (!this.dust) return;
    for (const f of this.falls) f.update(tl, t);
    this.trail?.update(tl, t);
    this.portal?.update(tl, t);
    this.fireworks?.update(tl, t);
    this.smoke?.update(tl, t);
    const i = tl.value('dust.i', t, 0.6);
    (this.dust.material as THREE.PointsMaterial).opacity = 0.6 * i;
    this.dust.visible = i > 0.01;
    const pos = this.dust.geometry.attributes.position as THREE.BufferAttribute;
    const W = STAGE.openW + 1, H = STAGE.openH + 0.5;
    for (let k = 0; k < pos.count; k++) {
      const a = this.dustSeeds[k * 3]!, b = this.dustSeeds[k * 3 + 1]!, c = this.dustSeeds[k * 3 + 2]!;
      pos.setXYZ(k, -W / 2 + W * a + Math.sin(t * 0.13 + c * 30) * 0.15, STAGE.floor + ((b * H + t * 0.02 * (0.5 + c)) % H), -2.6 + c * 4.5);
    }
    pos.needsUpdate = true;
  }
}
