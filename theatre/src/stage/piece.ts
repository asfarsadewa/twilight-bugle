import * as THREE from 'three';
import type { PartSpec, PieceSpec, Pt, PuppetJoint } from '../core/types.ts';
import type { Timeline } from '../core/timeline.ts';
import { wobble } from '../core/timeline.ts';
import { LineSegments2 } from 'three/examples/jsm/lines/LineSegments2.js';
import { LineSegmentsGeometry } from 'three/examples/jsm/lines/LineSegmentsGeometry.js';
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial.js';
import { cardboardMesh } from './cardboard.ts';

// A piece on stage. Its channels on the timeline, all optional:
//   <id>.out    0 in place, 1 gone by its route (flown out, slid into a wing, dropped through the trap)
//   <id>.x .y .z      offset from home        <id>.rz   tilt in degrees     <id>.s  scale
//   <id>.turn   0..1, a half turn about the upright axis. At the edge-on point the figure flips to its mirror,
//               so a toy-theatre figure turns to face the other way and never shows its back. 1 back to 0 turns again.
//   <id>.glow   extra glow on the paint
//   <id>.hop    a walking hop: the figure bobs on its rod while it moves
// Puppets add <id>.head, <id>.armA, <id>.armB (degrees) and <id>.sing (0..1, loudness of its voice).

export const STAGE = {
  /** The house sets these from the proscenium opening. */
  floor: 0,
  openW: 4.6,
  openH: 2.0,
  flyHeight: 4.2,
  wing: 4.2,
};

/**
 * The value of each pose channel when no cue sets it. The renderer and the changeover's pose capture both read
 * this table, so a piece never looks different in the changeover than it did in the show.
 */
export const POSE = {
  x: 0, y: 0, z: 0, rx: 0, rz: 0, s: 1, turn: 0, head: 0, headPitch: 0, armA: 0, armB: 0, glow: 0, strings: 1,
  foreA: 0, foreB: 0, thighA: 0, thighB: 0, shinA: 0, shinB: 0, lift: 0, held: 0,
  handA: 0, handAx: 0, handAy: 0, handAz: 0, handB: 0, handBx: 0, handBy: 0, handBz: 0,
  footA: 0, footAx: 0, footAy: 0, footAz: 0, footB: 0, footBx: 0, footBy: 0, footBz: 0,
} as const;

const rodMaterial = new THREE.MeshStandardMaterial({ color: 0x7a5534, roughness: 0.7 });
const wireMaterial = new THREE.MeshStandardMaterial({ color: 0x9c8b66, metalness: 0.8, roughness: 0.35 });
/** Marionette strings: dark thread that catches a little light. Width is in pixels at the render size. */
export const stringMaterial = new LineMaterial({ color: 0x4a4650, linewidth: 2.2, transparent: true, opacity: 0.9, worldUnits: false });

export class Piece {
  readonly root = new THREE.Group();
  readonly body = new THREE.Group();
  protected turnHolder = new THREE.Group();
  protected strings?: LineSegments2;
  private stringPos: number[] = [];
  protected stringTops: THREE.Vector3[] = [];
  /** Where each string is tied: a point in the local space of the body or of a puppet part. */
  protected stringTies: { obj: THREE.Object3D; local: THREE.Vector3 }[] = [];
  protected faceMeshes: THREE.Mesh[] = [];
  protected painted = new Map<string, { mesh: THREE.Mesh; part: PartSpec; w: number; h: number }>();
  w = 1;
  h = 1;
  /** The name of the piece's channels. It starts as the spec id. */
  private key: string;

  constructor(readonly spec: PieceSpec) {
    this.key = spec.id;
    this.root.name = spec.id;
    this.root.add(this.turnHolder);
    this.turnHolder.add(this.body);
  }

  get id() {
    return this.key;
  }

  /** Gives the piece new channel names. A piece on its way out takes one, so an incoming piece with the same id never moves it. */
  rename(key: string) {
    this.key = key;
  }

  async build(renderer: THREE.WebGLRenderer): Promise<void> {
    const s = this.spec;
    const art = s.art!;
    this.w = s.width ?? (s.height ?? 1) * art.aspect;
    this.h = s.height ?? this.w / art.aspect;
    const mesh = await cardboardMesh(art, this.w, this.h, {
      thick: s.thick ?? (s.kind === 'drop' ? 0.01 : 0.025),
      anchor: s.anchor ?? 'bottom',
      glow: s.glow,
      renderer,
      silhouette: s.silhouette,
    });
    if (s.mirror) mesh.scale.x = -1;
    if (s.kind === 'drop') mesh.castShadow = false;
    if (s.shadow === false) mesh.castShadow = false;
    this.faceMeshes.push(mesh);
    this.body.add(mesh);
    this.painted.set('body', { mesh, part: { art, sheet: [art.w, art.h], pivot: s.anchor === 'center' ? [0.5, 0.5] : [0.5, 1] }, w: this.w, h: this.h });
    this.addRigging();
  }

  protected addRigging() {
    const s = this.spec;
    const bottomY = s.anchor === 'center' ? -this.h / 2 : 0;
    if (s.rod) {
      const len = 3;
      const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, len, 6), rodMaterial);
      rod.position.set(0, bottomY + this.h * 0.35 - len / 2, -0.03);
      rod.castShadow = true;
      this.body.add(rod);
    }
    if (s.slide) {
      // The wire runs along the foot of the piece and on into the wing. It stays put when the figure turns.
      const len = 6;
      const wire = new THREE.Mesh(new THREE.CylinderGeometry(0.0055, 0.0055, len, 6), wireMaterial);
      wire.rotation.z = Math.PI / 2;
      wire.position.set(((s.slide === 'left' ? -1 : 1) * len) / 2, bottomY + 0.03, -0.02);
      wire.castShadow = true;
      this.root.add(wire);
    }
    for (const [u, v] of s.strings ?? []) {
      const ay = s.anchor === 'center' ? 0.5 : 1;
      this.stringTies.push({ obj: this.body, local: new THREE.Vector3((u - 0.5) * this.w, (ay - v) * this.h, 0.015) });
    }
    if (this.stringTies.length) {
      this.strings = new LineSegments2(new LineSegmentsGeometry(), stringMaterial.clone());
      this.strings.frustumCulled = false;
      this.strings.userData.noAO = true;
    }
  }

  lineResolution(w: number, h: number, width: number) {
    if (!this.strings) return;
    const m = this.strings.material as LineMaterial;
    m.resolution.set(w, h);
    m.linewidth = width;
  }

  /** Strings hang in world space from the fly loft, so they belong to the scene, not to the piece. */
  attachStrings(scene: THREE.Object3D) {
    if (this.strings) scene.add(this.strings);
  }

  home(): THREE.Vector3 {
    const h = this.spec.home;
    return new THREE.Vector3(h.x, STAGE.floor + (h.y ?? 0), h.z);
  }

  /** Where the piece sits when it is out, by its route. */
  outOffset(): THREE.Vector3 {
    switch (this.spec.route) {
      case 'fly':
        return new THREE.Vector3(0, STAGE.flyHeight + this.h - (this.spec.home.y ?? 0), 0);
      case 'left':
        return new THREE.Vector3(-(STAGE.wing + this.w / 2 + Math.abs(this.spec.home.x)), 0, 0);
      case 'right':
        return new THREE.Vector3(STAGE.wing + this.w / 2 + Math.abs(this.spec.home.x), 0, 0);
      case 'trap':
        return new THREE.Vector3(0, -(this.h + 0.3), 0);
      default:
        return new THREE.Vector3();
    }
  }

  update(tl: Timeline, t: number) {
    const id = this.id;
    const out = tl.value(`${id}.out`, t, this.spec.startIn ? 0 : 1);
    this.root.visible = out < 0.999;
    if (!this.root.visible) {
      if (this.strings) this.strings.visible = false;
      return;
    }
    const p = this.home().add(this.outOffset().multiplyScalar(out));
    const hop = tl.value(`${id}.hop`, t, 0);
    p.x += tl.value(`${id}.x`, t, POSE.x);
    p.y += tl.value(`${id}.y`, t, POSE.y) + hop * Math.abs(Math.sin(t * Math.PI * 2.2)) * 0.05;
    p.z += tl.value(`${id}.z`, t, POSE.z);
    this.root.position.copy(p);
    const sway = tl.value(`${id}.sway`, t, 0);
    this.root.rotation.x = THREE.MathUtils.degToRad(tl.value(`${id}.rx`, t, POSE.rx));
    this.root.rotation.z = THREE.MathUtils.degToRad(tl.value(`${id}.rz`, t, POSE.rz) + sway * wobble(t, this.spec.id.length, 0.8) * 3);
    const s = tl.value(`${id}.s`, t, POSE.s);
    this.root.scale.setScalar(s);

    // The turn: rotate to edge-on, swap to the mirror image, rotate back to face front.
    // 0 faces as painted, 1 faces the other way. Animate back to 0 to turn again.
    const turn = THREE.MathUtils.clamp(tl.value(`${id}.turn`, t, POSE.turn), 0, 1);
    this.turnHolder.rotation.y = turn < 0.5 ? turn * Math.PI : (turn - 1) * Math.PI;
    this.body.scale.x = turn < 0.5 ? 1 : -1;

    const glow = tl.value(`${id}.glow`, t, POSE.glow);
    for (const m of this.faceMeshes) {
      const face = (m.material as THREE.Material[])[1] as THREE.MeshStandardMaterial;
      face.emissiveIntensity = (this.spec.glow ?? 0) + glow;
    }
    this.updateStrings(tl, t);
  }

  protected updateStrings(tl: Timeline, t: number) {
    if (!this.strings) return;
    const show = tl.value(`${this.id}.strings`, t, POSE.strings);
    this.strings.visible = show > 0.01;
    (this.strings.material as LineMaterial).opacity = 0.9 * show;
    this.root.updateMatrixWorld(true);
    const pos = this.stringPos;
    pos.length = 0;
    for (const { obj, local } of this.stringTies) {
      const a = local.clone().applyMatrix4(obj.matrixWorld);
      pos.push(a.x, a.y, a.z, a.x * 0.9, STAGE.floor + STAGE.flyHeight + 3, a.z);
    }
    (this.strings.geometry as LineSegmentsGeometry).setPositions(pos);
  }

  /** A physical point of the painted card, after all joints and turns. Used by grips and cloth. */
  point(part: string, uv: Pt): THREE.Vector3 | undefined {
    const p = this.painted.get(part);
    if (!p) return undefined;
    this.root.updateMatrixWorld(true);
    return p.mesh.localToWorld(new THREE.Vector3((uv[0] - p.part.pivot[0]) * p.w, (p.part.pivot[1] - uv[1]) * p.h, 0.016));
  }

  /** Resolve contacts only after every actor has posed, so piece ordering cannot add a frame of lag. */
  updateLinks(pieces: Map<string, Piece>, tl: Timeline, t: number) {
    const g = this.spec.grip;
    if (!g || !this.root.visible) return;
    const held = tl.value(`${this.id}.held`, t, 0);
    if (held <= 0) return;
    const prefix = this.id.slice(0, -this.spec.id.length);
    const target = pieces.get(prefix + g.piece)?.point(g.part, g.point);
    const pin = this.point('body', g.pin);
    if (!target || !pin) return;
    target.z += g.z ?? 0.025;
    this.root.position.add(target.sub(pin).multiplyScalar(held));
    this.updateStrings(tl, t);
  }

  /**
   * Frees what this piece owns: its geometry, its strings, and the painted-face and shadow materials of each
   * cutout. The back, edge, rod and wire materials are shared by every piece, and the texture cache owns the art.
   */
  /** Takes the piece and its strings off the stage. It keeps its resources until `dispose`. */
  detach() {
    this.root.removeFromParent();
    this.strings?.removeFromParent();
  }

  dispose() {
    this.detach();
    if (this.strings) {
      // The strings hang in the scene, outside the root, so the traversal below never reaches them.
      this.strings.geometry.dispose();
      (this.strings.material as LineMaterial).dispose();
    }
    this.root.traverse((o) => {
      const m = o as THREE.Mesh;
      if (m.geometry) m.geometry.dispose();
    });
    for (const mesh of this.faceMeshes) {
      (mesh.material as THREE.Material[])[1]?.dispose();
      mesh.customDepthMaterial?.dispose();
    }
  }
}

/** A jointed rod puppet: a body with a head and two arms on brass pins. */
export class Puppet extends Piece {
  private joints: Partial<Record<PuppetJoint, THREE.Group>> = {};
  private rests: Partial<Record<PuppetJoint, number>> = {};

  override async build(renderer: THREE.WebGLRenderer): Promise<void> {
    const P = this.spec.puppet!;
    const bodyPart = P.body;
    // Parts from one sheet share a scale: world units per sheet pixel.
    const k = P.height / bodyPart.sheet[1];
    this.h = P.height;
    this.w = bodyPart.sheet[0] * k;
    const thick = this.spec.thick ?? 0.02;
    const mountBody = async () => {
      const body = await cardboardMesh(bodyPart.art, this.w, this.h, { thick, anchor: 'bottom', renderer });
      this.faceMeshes.push(body);
      this.body.add(body);
      this.painted.set('body', { mesh: body, part: bodyPart, w: this.w, h: this.h });
    };

    const mount = async (key: PuppetJoint, part: PartSpec | undefined, defaultZ: number) => {
      if (!part) return;
      const pw = part.sheet[0] * k, ph = part.sheet[1] * k;
      const mesh = await cardboardMesh(part.art, pw, ph, { thick, anchor: part.pivot, renderer });
      if (part.mirror) mesh.scale.x = -1;
      if (part.string) {
        // The mesh origin is the pin, so a point of the part sits at its offset from the pin.
        const [su, sv] = part.string;
        this.stringTies.push({ obj: mesh, local: new THREE.Vector3((su - part.pivot[0]) * pw, (part.pivot[1] - sv) * ph, 0.015) });
      }
      const joint = new THREE.Group();
      const [ux, uy] = part.attach ?? [0.5, 0];
      const parent = part.parent ? this.painted.get(part.parent)! : this.painted.get('body')!;
      joint.position.set((ux - parent.part.pivot[0]) * parent.w, (parent.part.pivot[1] - uy) * parent.h, (part.z ?? defaultZ) * thick * 2.2);
      joint.add(mesh);
      this.rests[key] = part.rest ?? 0;
      this.joints[key] = joint;
      this.painted.set(key, { mesh, part, w: pw, h: ph });
      this.faceMeshes.push(mesh);
      (part.parent ? this.joints[part.parent]! : this.body).add(joint);
    };
    // The body and the parts load at once. Each part's place comes from its spec, so the order does not matter.
    await mountBody();
    await Promise.all([mount('head', P.head, -0.6), mount('armA', P.armA, 1), mount('armB', P.armB, 1.1), mount('thighA', P.thighA, -0.3), mount('thighB', P.thighB, -0.4)]);
    await Promise.all([mount('foreA', P.foreA, 0.3), mount('foreB', P.foreB, 0.3), mount('shinA', P.shinA, 0.3), mount('shinB', P.shinB, 0.3)]);
    this.addRigging();
  }

  override update(tl: Timeline, t: number) {
    super.update(tl, t);
    if (!this.root.visible) return;
    const id = this.id;
    const sing = tl.value(`${id}.sing`, t, 0);
    // The breath follows the spec id, so a piece that is renamed on its way out keeps the same breath.
    const life = wobble(t, this.spec.id.charCodeAt(0), 0.9);
    const rad = THREE.MathUtils.degToRad;
    // Breath on the rod, and a lift of the head on loud notes.
    const breathing = PUPPET_LIFE(this.spec);
    this.body.position.y = (this.spec.puppet!.bodyOffset ?? 0) + tl.value(`${id}.lift`, t, 0) + (0.006 * life + sing * 0.012) * breathing;
    for (const [key, joint] of Object.entries(this.joints) as [PuppetJoint, THREE.Group][]) {
      const extra = key === 'head' ? life * 1.5 + sing * 6 : key === 'armA' ? life * 1.2 : key === 'armB' ? -life * 1.2 + sing * 4 : 0;
      joint.rotation.z = rad((this.rests[key] ?? 0) + tl.value(`${id}.${key}`, t, 0) + extra * breathing);
      if (key === 'head') joint.rotation.x = rad(tl.value(`${id}.headPitch`, t, 0));
    }
    this.solveChains(tl, t);
    // Strings tied to a head or a hand follow the joint, so they are drawn again after the pose.
    this.updateStrings(tl, t);
  }

  private solveChains(tl: Timeline, t: number) {
    // Contacts are authored for the in-position actor. A fly/slide carries the whole posed marionette,
    // including its world-space targets; this also preserves the captured pose during a set change.
    const route = this.outOffset().multiplyScalar(tl.value(`${this.id}.out`, t, this.spec.startIn ? 0 : 1));
    const targetInPlane = (parent: THREE.Object3D, target: string, planeZ: number) => {
      const x = tl.value(`${this.id}.${target}x`, t) + route.x, y = STAGE.floor + tl.value(`${this.id}.${target}y`, t) + route.y;
      const e = parent.matrixWorld.elements;
      const dx = x - e[12]! - e[8]! * planeZ, dy = y - e[13]! - e[9]! * planeZ, det = e[0]! * e[5]! - e[4]! * e[1]!;
      // Solve in the puppet's painted plane, including a forward bow. At edge-on turns use the projected
      // 3D target while the silhouette passes through zero width.
      if (Math.abs(det) > .05) return new THREE.Vector3((dx * e[5]! - dy * e[4]!) / det, (dy * e[0]! - dx * e[1]!) / det, 0);
      return parent.worldToLocal(new THREE.Vector3(x, y, tl.value(`${this.id}.${target}z`, t, this.root.position.z) + route.z));
    };
    // A planted sole wins over the planned pelvis height. Lower the body just enough for the longest stride;
    // this is recomputed from the authored pose on every frame, including when seeking backwards.
    let lowerBody = 0;
    for (const c of this.spec.puppet!.chains ?? []) {
      if (!c.target.startsWith('foot') || tl.value(`${this.id}.${c.target}`, t, 0) < .99) continue;
      const upper = this.joints[c.upper]!, lower = this.joints[c.lower]!, card = this.painted.get(c.lower)!;
      this.root.updateMatrixWorld(true);
      const q = targetInPlane(upper.parent!, c.target, upper.position.z + lower.position.z + .016);
      const dx = q.x - upper.position.x, down = upper.position.y - q.y;
      const length = Math.hypot(lower.position.x, lower.position.y) + Math.hypot((c.end[0] - card.part.pivot[0]) * card.w, (card.part.pivot[1] - c.end[1]) * card.h) - .0001;
      if (down > 0) lowerBody = Math.max(lowerBody, down - Math.sqrt(Math.max(.0001, length * length - dx * dx)));
    }
    this.body.position.y -= Math.min(.15, Math.max(0, lowerBody));
    for (const chain of this.spec.puppet!.chains ?? []) {
      const weight = THREE.MathUtils.clamp(tl.value(`${this.id}.${chain.target}`, t, 0), 0, 1);
      if (!weight) continue;
      const upper = this.joints[chain.upper]!, lower = this.joints[chain.lower]!;
      const card = this.painted.get(chain.lower)!;
      this.root.updateMatrixWorld(true);
      const q = targetInPlane(upper.parent!, chain.target, upper.position.z + lower.position.z + .016);
      const dx = q.x - upper.position.x, dy = q.y - upper.position.y;
      const u = lower.position;
      const vx = (chain.end[0] - card.part.pivot[0]) * card.w, vy = (card.part.pivot[1] - chain.end[1]) * card.h;
      const a = Math.hypot(u.x, u.y), b = Math.hypot(vx, vy);
      const reach = Math.min(a + b - 0.00001, Math.max(Math.abs(a - b) + 0.00001, Math.hypot(dx, dy)));
      const alpha = Math.acos(THREE.MathUtils.clamp((a * a + reach * reach - b * b) / (2 * a * reach), -1, 1));
      const beta = Math.acos(THREE.MathUtils.clamp((reach * reach - a * a - b * b) / (2 * a * b), -1, 1));
      const direction = Math.atan2(dy, dx) - chain.bend * alpha;
      const theta = direction - Math.atan2(u.y, u.x);
      const phi = direction + chain.bend * beta - theta - Math.atan2(vy, vx);
      const blend = (from: number, to: number) => from + Math.atan2(Math.sin(to - from), Math.cos(to - from)) * weight;
      upper.rotation.z = blend(upper.rotation.z, theta);
      lower.rotation.z = blend(lower.rotation.z, phi);
    }
  }
}

const PUPPET_LIFE = (spec: PieceSpec) => spec.puppet?.life ?? 1;

/** Cloth uses the actual post-pose hand positions, including elbow bends and mirrored turns. */
class Ribbon extends Piece {
  private cloth!: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshStandardMaterial>;
  override async build(): Promise<void> {
    const r = this.spec.tether!;
    this.w = 1; this.h = 0.1;
    this.cloth = new THREE.Mesh(new THREE.PlaneGeometry(1, r.width, 40, 1), new THREE.MeshStandardMaterial({ color: r.color, roughness: 0.92, side: THREE.DoubleSide }));
    this.cloth.castShadow = true;
    this.body.add(this.cloth);
  }
  override updateLinks(pieces: Map<string, Piece>, tl: Timeline, t: number) {
    if (!this.root.visible) return;
    const r = this.spec.tether!;
    const prefix = this.id.slice(0, -this.spec.id.length);
    const a = pieces.get(prefix + r.from.piece)?.point(r.from.part, r.from.point), b = pieces.get(prefix + r.to.piece)?.point(r.to.part, r.to.point);
    if (!a || !b) return;
    const sag = tl.value(`${this.id}.sag`, t, r.sag);
    const attr = this.cloth.geometry.attributes.position!;
    this.root.updateMatrixWorld(true);
    for (let i = 0; i <= 40; i++) {
      const u = i / 40;
      const p = a.clone().lerp(b, u);
      p.y -= Math.sin(Math.PI * u) * sag;
      p.z += 0.035 + Math.sin(Math.PI * u) * 0.025;
      const tangent = new THREE.Vector2(b.x - a.x, b.y - a.y - Math.PI * Math.cos(Math.PI * u) * sag).normalize();
      for (let row = 0; row < 2; row++) {
        const side = (row ? -0.5 : 0.5) * r.width;
        const q = this.cloth.worldToLocal(new THREE.Vector3(p.x - tangent.y * side, p.y + tangent.x * side, p.z));
        attr.setXYZ(row * 41 + i, q.x, q.y, q.z);
      }
    }
    attr.needsUpdate = true;
    this.cloth.geometry.computeVertexNormals();
    this.cloth.geometry.computeBoundingSphere();
  }
  override dispose() { this.cloth.material.dispose(); super.dispose(); }
}

export function makePiece(spec: PieceSpec): Piece {
  return spec.kind === 'puppet' ? new Puppet(spec) : spec.kind === 'ribbon' ? new Ribbon(spec) : new Piece(spec);
}
