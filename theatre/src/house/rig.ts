import * as THREE from 'three';
import type { Timeline } from '../core/timeline.ts';
import { wobble } from '../core/timeline.ts';
import { STAGE } from '../stage/piece.ts';

// The lighting rig. Every instrument reads its channels each frame:
//   <name>.i              level, 0..1 (multiplies the instrument's full power)
//   <name>.r .g .b        colour, linear 0..1
//   <name>.tx .ty .tz     where a spot points
//   <name>.px .py .pz     where the lamp hangs (spots and practicals)
//   <name>.flicker        0..1, fire flicker on a practical
// Looks set many channels at once. See look() below.

interface Instrument {
  name: string;
  light: THREE.SpotLight | THREE.PointLight | THREE.HemisphereLight | THREE.DirectionalLight;
  power: number;
  color: THREE.Color;
  target?: THREE.Vector3;
  pos?: THREE.Vector3;
  beam?: Beam;
}

/** A visible shaft of light in the haze: an open cone, brightest at the lamp, soft at its edges. */
export class Beam {
  readonly mesh: THREE.Mesh;
  private mat: THREE.ShaderMaterial;

  constructor(angle: number) {
    const geo = new THREE.ConeGeometry(Math.tan(angle), 1, 48, 1, true);
    // Apex at the origin, opening along +z, so lookAt() aims it. Local z runs 0 at the lamp to 1 at the far end.
    geo.translate(0, -0.5, 0);
    geo.rotateX(-Math.PI / 2);
    this.mat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      uniforms: { color: { value: new THREE.Color() }, strength: { value: 0 } },
      vertexShader: `
        varying float vAlong; varying vec3 vN; varying vec3 vView;
        void main() {
          vAlong = clamp(position.z, 0.0, 1.0);
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          vN = normalize(normalMatrix * normal);
          vView = normalize(-mv.xyz);
          gl_Position = projectionMatrix * mv;
        }`,
      fragmentShader: `
        uniform vec3 color; uniform float strength;
        varying float vAlong; varying vec3 vN; varying vec3 vView;
        void main() {
          float edge = pow(abs(dot(normalize(vN), normalize(vView))), 1.6);
          float fall = (1.0 - vAlong) * (1.0 - vAlong) * smoothstep(0.0, 0.08, vAlong);
          gl_FragColor = vec4(color * strength * edge * fall, 1.0);
        }`,
    });
    this.mesh = new THREE.Mesh(geo, this.mat);
    this.mesh.frustumCulled = false;
    this.mesh.renderOrder = 10;
    this.mesh.userData.noAO = true;
  }

  aim(from: THREE.Vector3, to: THREE.Vector3, color: THREE.Color, strength: number) {
    const len = from.distanceTo(to) * 1.15;
    this.mesh.position.copy(from);
    this.mesh.lookAt(to);
    this.mesh.scale.set(len, len, len);
    this.mat.uniforms.color!.value.copy(color);
    this.mat.uniforms.strength!.value = strength;
    this.mesh.visible = strength > 0.002;
  }
}

export class Rig {
  readonly group = new THREE.Group();
  private list: Instrument[] = [];

  constructor() {
    const F = STAGE.floor;
    const spot = (name: string, color: number, power: number, pos: [number, number, number], target: [number, number, number], angle: number, penumbra: number, shadow: boolean, beam = 0) => {
      const l = new THREE.SpotLight(color, power, 0, angle, penumbra, 1.2);
      l.position.set(...pos);
      l.target.position.set(...target);
      l.castShadow = shadow;
      if (shadow) {
        l.shadow.mapSize.set(2048, 2048);
        l.shadow.bias = -0.0004;
        l.shadow.normalBias = 0.02;
        l.shadow.radius = 3;
        l.shadow.camera.near = 0.5;
        l.shadow.camera.far = 30;
      }
      this.group.add(l, l.target);
      const inst: Instrument = { name, light: l, power, color: new THREE.Color(color), target: l.target.position.clone(), pos: l.position.clone() };
      if (beam > 0) {
        inst.beam = new Beam(angle * 0.9);
        (inst as Instrument & { beamPower: number }).beamPower = beam;
        this.group.add(inst.beam.mesh);
      }
      this.list.push(inst);
    };
    const W = STAGE.openW;
    spot('fohL', 0xffe2bd, 15, [-4.2, F + 5.2, 7.2], [-0.4, F + 0.7, -1.2], 0.36, 0.75, true);
    spot('fohR', 0xe9e4ff, 12, [4.2, F + 5.2, 7.2], [0.4, F + 0.7, -1.2], 0.36, 0.75, false);
    spot('follow', 0xfff0d2, 55, [0, F + 5.6, 8.5], [0, F + 0.8, -1], 0.072, 0.28, true, 0.07);
    spot('foot', 0xffb46a, 3.2, [0, F + 0.02, 2.0], [0, F + 1.6, -3.5], 0.85, 0.9, true);
    spot('cyc', 0x4f6bc4, 4, [0, F + 3.8, -1.6], [0, F + 1.0, -4.6], 0.95, 1, false);
    spot('back', 0xa9c2ff, 10, [0, F + 4.4, -4.2], [0, F + 0.4, 0.2], 0.55, 0.8, false, 0.03);
    spot('left', 0xffc58a, 14, [-W * 0.45, F + 4.6, 2.8], [-W * 0.27, F + 0.5, -1.4], 0.32, 0.8, false, 0.035);
    spot('right', 0x9fb8ff, 14, [W * 0.45, F + 4.6, 2.8], [W * 0.27, F + 0.5, -1.4], 0.32, 0.8, false, 0.035);
    // The ray: a beam whose lamp a production can move into the scenery, such as a lantern on stage.
    spot('ray', 0xcfe0ff, 5, [1, F + 1.5, -1.3], [-1, F + 0.6, -0.6], 0.07, 0.5, false, 0.5);

    const hemi = new THREE.HemisphereLight(0x5b6c9e, 0x24160c, 0.2);
    this.group.add(hemi);
    this.list.push({ name: 'ambient', light: hemi, power: 0.2, color: new THREE.Color(0x5b6c9e) });
    const house = new THREE.HemisphereLight(0xffe0b0, 0x3a2410, 1.4);
    this.group.add(house);
    this.list.push({ name: 'house', light: house, power: 1.4, color: new THREE.Color(0xffe0b0) });
    const flash = new THREE.DirectionalLight(0xdfe8ff, 2.2);
    flash.position.set(-2, F + 6, 3);
    this.group.add(flash);
    this.list.push({ name: 'flash', light: flash, power: 2.2, color: new THREE.Color(0xdfe8ff) });

    // Practicals: lamps that live inside the scenery. Productions move them with their channels.
    for (const [name, color, power] of [['lamp', 0xbcd6ff, 0.4], ['spire', 0xbcd6ff, 1.0], ['fire', 0xff8a3a, 1.0], ['glowA', 0xffc070, 1.0], ['glowB', 0xbcd6ff, 1.0]] as const) {
      const p = new THREE.PointLight(color, power, 6, 1.6);
      this.group.add(p);
      this.list.push({ name, light: p, power, color: new THREE.Color(color), pos: new THREE.Vector3(0, F + 1, -1) });
    }
  }

  /** The level each instrument has before any cue: a dark house with the curtain lit. */
  defaults(tl: Timeline) {
    const on: Record<string, number> = { fohL: 0.35, fohR: 0.3, foot: 1, house: 0, ambient: 0.4 };
    for (const inst of this.list) {
      if (!tl.has(`${inst.name}.i`)) tl.base(`${inst.name}.i`, on[inst.name] ?? 0);
    }
  }

  /** Raises one instrument to at least a level on top of its cue. The lobby uses it for the house lights. */
  lift(name: string, level: number) {
    const inst = this.list.find((i) => i.name === name);
    if (inst) inst.light.intensity = Math.max(inst.light.intensity, inst.power * level);
  }

  /** Where a spot points now, in world space. */
  targetOf(name: string): THREE.Vector3 | undefined {
    const inst = this.list.find((i) => i.name === name);
    return inst?.light instanceof THREE.SpotLight ? inst.light.target.position : undefined;
  }

  update(tl: Timeline, t: number) {
    const c = new THREE.Color();
    for (const inst of this.list) {
      const n = inst.name;
      let level = tl.value(`${n}.i`, t, 0);
      const flick = tl.value(`${n}.flicker`, t, 0);
      if (flick > 0) level *= 1 - flick * 0.35 * (0.5 + 0.5 * wobble(t * 3.1, n.length, 2.4));
      c.setRGB(tl.value(`${n}.r`, t, inst.color.r), tl.value(`${n}.g`, t, inst.color.g), tl.value(`${n}.b`, t, inst.color.b));
      inst.light.color.copy(c);
      inst.light.intensity = inst.power * level;
      // A light is never switched off, only dimmed. Changing the number of lights recompiles every material.
      if (inst.target && inst.light instanceof THREE.SpotLight) {
        inst.light.target.position.set(tl.value(`${n}.tx`, t, inst.target.x), tl.value(`${n}.ty`, t, inst.target.y), tl.value(`${n}.tz`, t, inst.target.z));
        inst.light.target.updateMatrixWorld();
        const beam = inst.beam;
        if (beam) {
          const haze = tl.value('haze', t, 1);
          beam.aim(inst.light.position, inst.light.target.position, c, level * haze * (inst as Instrument & { beamPower: number }).beamPower);
        }
      }
      if (inst.pos && !(inst.light instanceof THREE.HemisphereLight)) {
        inst.light.position.set(tl.value(`${n}.px`, t, inst.pos.x), tl.value(`${n}.py`, t, inst.pos.y), tl.value(`${n}.pz`, t, inst.pos.z));
      }
    }
  }
}

/** Set a light colour channel triple from a hex colour, moving over dur seconds. */
export function color(tl: Timeline, name: string, hex: number, t: number, dur = 0) {
  const c = new THREE.Color(hex);
  for (const [k, v] of [['r', c.r], ['g', c.g], ['b', c.b]] as const) {
    if (dur > 0) tl.to(`${name}.${k}`, v, t, dur, 'inOut');
    else tl.set(`${name}.${k}`, v, t);
  }
}
