import * as THREE from 'three';
import type { Timeline } from '../core/timeline.ts';
import { rng } from '../core/timeline.ts';
import { STAGE } from '../stage/piece.ts';

// The cyclorama: a plain canvas cloth at the back of the stage, curved at its sides. It has no painting.
// Its colour comes only from its lamps, as in a real theatre:
//   cycTop     a row of lamps above it, strongest at the top edge
//   cycBot     a ground row below it, strongest at the floor
//   cycHz      a band of light across it, at height cycHz.y (0 floor, 1 top). Dawn, dusk, fire on the horizon.
// Each takes .i (level) and .r .g .b (linear colour).
//
// The star cloth hangs in front of it: black gauze with pinholes. Lamps behind it shine through the holes.
//   stars.i    0..1 brightness        stars.out   0 in, 1 flown out

const vertexShader = `
  varying vec2 vUv; varying vec3 vWorld;
  void main() {
    vUv = uv;
    vec4 w = modelMatrix * vec4(position, 1.0);
    vWorld = w.xyz;
    gl_Position = projectionMatrix * viewMatrix * w;
  }`;

const fragmentShader = `
  uniform vec3 top, bot, hz; uniform float hzY;
  varying vec2 vUv; varying vec3 vWorld;
  float hash(vec2 p) { return fract(sin(dot(p, vec2(41.3, 289.1))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1, 0)), f.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), f.x), f.y);
  }
  void main() {
    float v = vUv.y;
    // Canvas weave and the soft unevenness of a cloth lit by a row of separate lamps.
    float weave = 0.97 + 0.03 * sin(vWorld.x * 900.0) * sin(vWorld.y * 900.0);
    float cloth = 0.9 + 0.1 * noise(vWorld.xy * vec2(1.2, 2.0));
    float lamps = 0.93 + 0.07 * cos(vWorld.x * 2.6);
    vec3 c = top * pow(smoothstep(0.05, 1.0, v), 1.3) * lamps
           + bot * pow(1.0 - smoothstep(0.0, 0.62, v), 1.6) * (0.96 + 0.04 * cos(vWorld.x * 3.4))
           + hz * exp(-pow((v - hzY) / 0.11, 2.0));
    gl_FragColor = vec4(c * weave * cloth, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }`;

export class Cyclorama {
  readonly group = new THREE.Group();
  private mat: THREE.ShaderMaterial;
  private stars: THREE.InstancedMesh;
  private starSeeds: { x: number; y: number; s: number; tw: number }[] = [];
  private m = new THREE.Matrix4();

  constructor() {
    const F = STAGE.floor;
    const W = STAGE.openW + 9, H = STAGE.openH + 4;
    // A cloth curved forward at its sides, so no edge shows from any seat.
    const geo = new THREE.CylinderGeometry(9, 9, H, 64, 1, true, Math.PI - W / 18, W / 9);
    geo.translate(0, H / 2, 0);
    this.mat = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: { top: { value: new THREE.Color() }, bot: { value: new THREE.Color() }, hz: { value: new THREE.Color() }, hzY: { value: 0.25 } },
      side: THREE.BackSide,
      fog: false,
    });
    const cloth = new THREE.Mesh(geo, this.mat);
    cloth.position.set(0, F - 0.6, -5.0 + 9);
    this.group.add(cloth);

    // Pinholes: small soft points, a few brighter ones, each with its own slow twinkle.
    const tex = (() => {
      const c = document.createElement('canvas');
      c.width = c.height = 64;
      const g = c.getContext('2d')!;
      const grd = g.createRadialGradient(32, 32, 0, 32, 32, 32);
      grd.addColorStop(0, 'rgba(255,250,235,1)');
      grd.addColorStop(0.18, 'rgba(255,240,210,0.85)');
      grd.addColorStop(0.45, 'rgba(200,210,255,0.12)');
      grd.addColorStop(1, 'rgba(0,0,0,0)');
      g.fillStyle = grd;
      g.fillRect(0, 0, 64, 64);
      return new THREE.CanvasTexture(c);
    })();
    const n = 220;
    const starMat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, color: 0xffffff, fog: false });
    this.stars = new THREE.InstancedMesh(new THREE.PlaneGeometry(1, 1), starMat, n);
    this.stars.frustumCulled = false;
    this.stars.userData.noAO = true;
    const r = rng(1777);
    for (let i = 0; i < n; i++) {
      const big = r() < 0.08;
      this.starSeeds.push({ x: (r() - 0.5) * (STAGE.openW + 3), y: 0.7 + Math.pow(r(), 0.8) * (STAGE.openH + 0.6), s: big ? 0.07 + r() * 0.05 : 0.018 + r() * 0.03, tw: r() * 100 });
    }
    this.group.add(this.stars);
  }

  update(tl: Timeline, t: number) {
    const set = (name: string, c: THREE.Color) => {
      const i = tl.value(`${name}.i`, t, 0);
      c.setRGB(tl.value(`${name}.r`, t, 0.2) * i, tl.value(`${name}.g`, t, 0.3) * i, tl.value(`${name}.b`, t, 0.6) * i);
    };
    const u = this.mat.uniforms;
    set('cycTop', u.top!.value);
    set('cycBot', u.bot!.value);
    set('cycHz', u.hz!.value);
    u.hzY!.value = tl.value('cycHz.y', t, 0.25);

    const lvl = tl.value('stars.i', t, 0);
    const out = tl.value('stars.out', t, 0);
    this.stars.visible = lvl > 0.001 && out < 0.999;
    const F = STAGE.floor;
    this.starSeeds.forEach((s, i) => {
      const tw = 0.65 + 0.35 * Math.sin(t * (0.7 + (s.tw % 1.3)) + s.tw);
      const size = s.s * (0.4 + 0.6 * lvl) * tw;
      this.m.makeScale(size, size, 1).setPosition(s.x, F + s.y + out * (STAGE.openH + 2.5), -4.75);
      this.stars.setMatrixAt(i, this.m);
    });
    this.stars.instanceMatrix.needsUpdate = true;
    (this.stars.material as THREE.MeshBasicMaterial).opacity = Math.min(1, lvl * 1.4);
  }
}
