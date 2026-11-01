import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { Timeline } from './core/timeline.ts';
import type { CueContext, Production } from './core/types.ts';
import { CURTAIN_STYLES, curtainStyleIndex } from './house/curtain.ts';
import { buildHouse, type HouseParts } from './house/house.ts';
import { Cyclorama } from './house/cyc.ts';
import { PosterWall } from './house/posters.ts';
import { Rig } from './house/rig.ts';
import { planChangeover } from './changeover.ts';
import { Effects } from './stage/fx.ts';
import { makePiece, type Piece, STAGE, stringMaterial } from './stage/piece.ts';
import { Post } from './render/post.ts';
import { Surtitles } from './ui/surtitles.ts';

/** Channels every piece reads, used to carry a piece's last pose into a changeover. */
const POSE = ['out', 'x', 'y', 'z', 'rz', 's', 'turn', 'head', 'armA', 'armB', 'glow', 'strings'];

export class Theatre {
  readonly renderer: THREE.WebGLRenderer;
  readonly scene = new THREE.Scene();
  readonly camera = new THREE.PerspectiveCamera(27, 16 / 9, 0.05, 80);
  private post!: Post;
  private house!: HouseParts;
  private rig!: Rig;
  private cyc!: Cyclorama;
  private fx = new Effects();
  private surtitles: Surtitles;
  pieces = new Map<string, Piece>();
  production: Production | null = null;
  tl = new Timeline();
  /** First show time of the performance: negative, before the song. */
  start = 0;
  /** Last show time: the song end plus the curtain call. */
  end = 0;
  get subtitles() {
    return this.surtitles;
  }

  private titles = { from: { zh: '', en: '' }, to: { zh: '', en: '' } };
  private frameNo = 0;

  /** The repertoire on the house wall. Only the live theatre hangs it. */
  posters: PosterWall | null = null;
  /** 0 is the show's own camera. 1 is the lobby view of the house wall with the house lights up. */
  view = 0;
  private wall = { pos: new THREE.Vector3(), look: new THREE.Vector3(), fov: 27 };

  constructor(readonly container: HTMLElement, private w = 1920, private h = 1080, pixelRatio = 1, subs = { en: false, py: false }) {
    this.renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(pixelRatio);
    this.renderer.setSize(w, h, false);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.0;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.append(this.renderer.domElement);
    this.surtitles = new Surtitles(container, subs);
    const pmrem = new THREE.PMREMGenerator(this.renderer);
    this.scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    this.scene.environmentIntensity = 0.18;
    this.scene.background = new THREE.Color(0x020203);
    this.scene.fog = new THREE.FogExp2(0x05060a, 0.018);
  }

  async init(houseUrl: string) {
    this.house = await buildHouse(houseUrl, this.renderer);
    this.scene.add(this.house.root);
    this.rig = new Rig();
    this.scene.add(this.rig.group);
    this.cyc = new Cyclorama();
    this.scene.add(this.cyc.group);
    this.post = new Post(this.renderer, this.scene, this.camera, this.w, this.h);
    this.setLineResolution();
  }

  /** Hangs one poster for each show on the house wall and frames the lobby view to fit them all. */
  async hang(shows: Production[]) {
    this.posters = new PosterWall(this.house.width / 2, this.house.height / 2);
    await this.posters.build(shows);
    this.scene.add(this.posters.group);
    const half = Math.tan(THREE.MathUtils.degToRad(this.wall.fov / 2)) * (this.w / this.h);
    const d = (this.posters.reach + 0.45) / half;
    this.wall.look.set(0, this.posters.y - 0.05, this.posters.z);
    this.wall.pos.set(0, this.posters.y + 0.25, this.posters.z + d);
    await this.renderer.compileAsync(this.scene, this.camera);
  }

  /** Each poster's outline on screen, as fractions of the frame. */
  posterRects() {
    return this.posters?.rects(this.camera) ?? [];
  }

  /**
   * Builds a performance of a production. With `from`, the old production's pieces stay on stage in their last
   * pose, and the changeover planner strikes them and sets the new show before its own preroll.
   */
  async load(p: Production, from?: { production: Production; at: number }) {
    const tl = new Timeline();
    const old = new Map(this.pieces);
    const oldTl = this.tl;
    this.pieces = new Map();
    // Old pieces in view that the new show does not reuse stay until the strike. Each keeps its last pose.
    // The rest go at once, so pieces never pile up from show to show.
    let changeover = 0;
    if (from) {
      for (const [id, piece] of old) {
        const out = oldTl.value(`${id}.out`, from.at, piece.spec.startIn ? 0 : 1);
        if (p.pieces.some((s) => s.id === id) || out >= 0.99) {
          piece.dispose();
          continue;
        }
        for (const ch of POSE) tl.base(`${id}.${ch}`, oldTl.value(`${id}.${ch}`, from.at, ch === 's' ? 1 : ch === 'out' ? out : 0));
        this.pieces.set(id, piece);
      }
    } else {
      for (const piece of old.values()) piece.dispose();
    }
    for (const spec of p.pieces) {
      const piece = makePiece(spec);
      await piece.build(this.renderer);
      this.scene.add(piece.root);
      piece.attachStrings(this.scene);
      this.pieces.set(spec.id, piece);
    }
    await this.fx.build(p.fx?.flame);
    if (!this.fx.group.parent) this.scene.add(this.fx.group);

    this.rig.defaults(tl);
    this.houseDefaults(tl, p);
    const ctx: CueContext = {
      tl,
      master: p.master,
      section: (id) => p.master.sections.find((s) => s.id === id) ?? { start: 0, end: 0 },
      line: (n) => p.master.lines[n]!,
    };
    p.cues(ctx);
    if (from) {
      // The changeover starts from the room as the old show left it.
      for (const ch of ['curtain.open', 'curtain.style', 'house.i', 'foot.i']) tl.base(ch, oldTl.value(ch, from.at));
      changeover = planChangeover(tl, {
        // The old pieces still here are the ones the audience can see.
        oldPieces: [...this.pieces.values()].filter((x) => !p.pieces.some((s) => s.id === x.id)),
        was: (ch) => (oldTl.has(ch) ? oldTl.value(ch, from.at) : undefined),
        newPieces: p.pieces.map((s) => this.pieces.get(s.id)!),
        oldClose: from.production.curtain.close,
        startAt: -p.preroll,
      });
    }
    this.titles = { from: from ? { zh: from.production.title.zh, en: from.production.title.en } : { zh: p.title.zh, en: p.title.en }, to: { zh: p.title.zh, en: p.title.en } };
    this.production = p;
    this.tl = tl;
    this.start = -p.preroll - changeover;
    this.end = p.master.duration + p.postroll;
    this.surtitles.load(p);
    this.setLineResolution();
    await this.compile();
  }

  /** The house state before any production cue: curtain shut, house lights up, footlights on. */
  private houseDefaults(tl: Timeline, p: Production) {
    tl.base('curtain.open', 0).base('curtain.style', curtainStyleIndex(p.curtain.open));
    tl.base('house.i', 0.7).base('cam.x', 0).base('cam.y', STAGE.floor + 0.95).base('cam.z', 9.4);
    tl.base('cam.lx', 0).base('cam.ly', STAGE.floor + 1.05).base('cam.lz', -1).base('cam.fov', 27);
    tl.base('audience.i', 1).base('surtitles.i', 1).base('programme.flip', 1);
  }

  /** Upload every texture and compile every shader before the first frame, so playback does not stall. */
  private async compile() {
    // Show everything once, so every shader compiles and every texture uploads before the curtain rises.
    this.frame(this.start);
    const shown: THREE.Object3D[] = [];
    this.scene.traverse((o) => {
      if (!o.visible) {
        o.visible = true;
        shown.push(o);
      }
      const mats = (o as THREE.Mesh).material;
      for (const m of Array.isArray(mats) ? mats : mats ? [mats] : []) {
        for (const tex of [(m as THREE.MeshStandardMaterial).map, (m as THREE.MeshStandardMaterial).normalMap, (m as THREE.MeshStandardMaterial).emissiveMap]) {
          if (tex) this.renderer.initTexture(tex);
        }
      }
    });
    await this.renderer.compileAsync(this.scene, this.camera);
    this.post.render(0);
    for (const o of shown) o.visible = false;
    this.frame(this.start);
  }

  /** Draws the show at time t (seconds, 0 is the start of the song). */
  frame(t: number) {
    const tl = this.tl;
    // The show's camera, eased toward the lobby view of the house wall by `view`.
    const v = this.view * this.view * (3 - 2 * this.view);
    const pos = new THREE.Vector3(tl.value('cam.x', t), tl.value('cam.y', t), tl.value('cam.z', t)).lerp(this.wall.pos, v);
    const look = new THREE.Vector3(tl.value('cam.lx', t), tl.value('cam.ly', t), tl.value('cam.lz', t)).lerp(this.wall.look, v);
    this.camera.position.copy(pos);
    this.camera.lookAt(look);
    const fov = THREE.MathUtils.lerp(tl.value('cam.fov', t, 27), this.wall.fov, v);
    if (fov !== this.camera.fov) {
      this.camera.fov = fov;
      this.camera.updateProjectionMatrix();
    }
    this.rig.update(tl, t);
    // In the lobby the house lights come up, whatever the show's cue says.
    const houseUp = 0.85 * v;
    this.rig.lift('house', houseUp);
    if (this.posters) {
      // The show's camera can see the inner edge of the nearest frames, so the wall hangs only for the lobby.
      this.posters.group.visible = v > 0.001;
      this.posters.update(Math.max(tl.value('house.i', t, 0), houseUp));
    }
    this.cyc.update(tl, t);
    for (const piece of this.pieces.values()) piece.update(tl, t);
    this.fx.update(tl, t);

    const style = CURTAIN_STYLES[Math.round(tl.value('curtain.style', t, 0))] ?? 'traveller';
    this.house.curtain.update(tl.value('curtain.open', t, 0), style, t);
    const foot = tl.value('foot.i', t, 1);
    for (const b of this.house.footBulbs) (b.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.2 + foot * 2.4;
    this.house.audience.visible = tl.value('audience.i', t, 1) > 0.5;
    const flip = tl.value('programme.flip', t, 1);
    this.house.programme.mesh.rotation.x = Math.PI * (flip < 0.5 ? flip : flip - 1);
    const title = flip < 0.5 ? this.titles.from : this.titles.to;
    this.house.programme.show(title.zh, title.en);

    // Focus on the look point unless a cue sets cam.focus. cam.aperture 0 makes the frame pin sharp.
    // When the follow spot is up, the eye follows it: focus moves to whatever the spot lights.
    const lookDist = this.camera.position.distanceTo(look);
    const spot = this.rig.targetOf('follow');
    const k = Math.min(1, tl.value('follow.i', t, 0) * 1.5) * (1 - v);
    const focus = (tl.value('cam.focus', t, 0) * (1 - v)) || (spot ? lookDist + (this.camera.position.distanceTo(spot) - lookDist) * k : lookDist);
    this.post.focus(focus, tl.value('cam.aperture', t, 0.0008));
    this.surtitles.update(t, tl.value('surtitles.i', t, 1) * (1 - v));
    this.post.render(this.frameNo++);
  }

  private setLineResolution() {
    const pr = this.renderer.getPixelRatio();
    stringMaterial.resolution.set(this.w * pr, this.h * pr);
    for (const p of this.pieces.values()) p.lineResolution(this.w * pr, this.h * pr, 1.6 * pr);
  }

  resize(w: number, h: number) {
    this.w = w;
    this.h = h;
    this.renderer.setSize(w, h, false);
    this.post.setSize(w, h);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
  }
}
