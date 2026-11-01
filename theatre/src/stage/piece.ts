import * as THREE from 'three';
import type { PartSpec, PieceSpec } from '../core/types.ts';
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
export const POSE = { x: 0, y: 0, z: 0, rz: 0, s: 1, turn: 0, head: 0, armA: 0, armB: 0, glow: 0, strings: 1 } as const;

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

  /**
   * Frees what this piece owns: its geometry, its strings, and the painted-face and shadow materials of each
   * cutout. The back, edge, rod and wire materials are shared by every piece, and the texture cache owns the art.
   */
  dispose() {
    this.root.removeFromParent();
    if (this.strings) {
      // The strings hang in the scene, outside the root, so the traversal below never reaches them.
      this.strings.removeFromParent();
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
  private joints: Record<'head' | 'armA' | 'armB', THREE.Group | undefined> = { head: undefined, armA: undefined, armB: undefined };
  private rests: Record<'head' | 'armA' | 'armB', number> = { head: 0, armA: 0, armB: 0 };

  override async build(renderer: THREE.WebGLRenderer): Promise<void> {
    const P = this.spec.puppet!;
    const bodyPart = P.body;
    // Parts from one sheet share a scale: world units per sheet pixel.
    const k = P.height / bodyPart.sheet[1];
    this.h = P.height;
    this.w = bodyPart.sheet[0] * k;
    const thick = this.spec.thick ?? 0.02;
    const body = await cardboardMesh(bodyPart.art, this.w, this.h, { thick, anchor: 'bottom', renderer });
    this.faceMeshes.push(body);
    this.body.add(body);

    const mount = async (key: 'head' | 'armA' | 'armB', part: PartSpec | undefined, defaultZ: number) => {
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
      joint.position.set((ux - 0.5) * this.w, (1 - uy) * this.h, (part.z ?? defaultZ) * thick * 2.2);
      joint.add(mesh);
      this.rests[key] = part.rest ?? 0;
      this.joints[key] = joint;
      this.faceMeshes.push(mesh);
      this.body.add(joint);
    };
    await mount('head', P.head, -0.6);
    await mount('armA', P.armA, 1);
    await mount('armB', P.armB, 1.1);
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
    this.body.position.y = 0.006 * life + sing * 0.012;
    if (this.joints.head) this.joints.head.rotation.z = rad(this.rests.head + tl.value(`${id}.head`, t, POSE.head) + life * 1.5 + sing * 6);
    if (this.joints.armA) this.joints.armA.rotation.z = rad(this.rests.armA + tl.value(`${id}.armA`, t, POSE.armA) + life * 1.2);
    if (this.joints.armB) this.joints.armB.rotation.z = rad(this.rests.armB + tl.value(`${id}.armB`, t, POSE.armB) - life * 1.2 + sing * 4);
    // Strings tied to a head or a hand follow the joint, so they are drawn again after the pose.
    this.updateStrings(tl, t);
  }
}

export function makePiece(spec: PieceSpec): Piece {
  return spec.kind === 'puppet' ? new Puppet(spec) : new Piece(spec);
}
