import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { gilt } from '../stage/cardboard.ts';
import { STAGE } from '../stage/piece.ts';
import { Curtain } from './curtain.ts';

// The permanent house: proscenium, stage floor, masking, footlights, audience. Productions come and go inside it.

/** The title board in the cartouche of the arch. It shows the programme and flips between productions. */
class Programme {
  readonly mesh: THREE.Mesh;
  private canvas = document.createElement('canvas');
  private texture: THREE.CanvasTexture;
  private shown = '';

  constructor(w: number, h: number) {
    this.canvas.width = 640;
    this.canvas.height = 320;
    this.texture = new THREE.CanvasTexture(this.canvas);
    this.texture.colorSpace = THREE.SRGBColorSpace;
    const mat = new THREE.MeshStandardMaterial({ map: this.texture, transparent: true, roughness: 0.5, metalness: 0.2, emissive: 0xffffff, emissiveMap: this.texture, emissiveIntensity: 0.35 });
    this.mesh = new THREE.Mesh(new THREE.PlaneGeometry(w, h), mat);
  }

  show(zh: string, en: string) {
    const key = zh + en;
    if (key === this.shown) return;
    this.shown = key;
    const g = this.canvas.getContext('2d')!;
    g.clearRect(0, 0, 640, 320);
    g.save();
    g.beginPath();
    g.ellipse(320, 160, 312, 152, 0, 0, Math.PI * 2);
    g.clip();
    const grd = g.createRadialGradient(320, 150, 20, 320, 160, 320);
    grd.addColorStop(0, '#2b2f48');
    grd.addColorStop(1, '#141626');
    g.fillStyle = grd;
    g.fillRect(0, 0, 640, 320);
    g.fillStyle = '#e8c06a';
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.font = '700 108px "Noto Serif SC", "Songti SC", serif';
    g.fillText(zh, 320, 138);
    g.font = 'italic 40px "Cormorant Garamond", Georgia, serif';
    g.fillStyle = '#d9c8a4';
    g.fillText(en, 320, 236);
    g.restore();
    this.texture.needsUpdate = true;
  }
}

/** A tile of dark oxblood damask: a repeating lotus-and-scroll figure over fine stripes. */
function wallpaper(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = c.height = 256;
  const g = c.getContext('2d')!;
  g.fillStyle = '#3b1417';
  g.fillRect(0, 0, 256, 256);
  g.fillStyle = 'rgba(0,0,0,0.12)';
  for (let x = 0; x < 256; x += 8) g.fillRect(x, 0, 1, 256);
  const figure = (cx: number, cy: number) => {
    g.save();
    g.translate(cx, cy);
    g.fillStyle = 'rgba(120,48,44,0.38)';
    g.beginPath();
    g.ellipse(0, -18, 10, 26, 0, 0, Math.PI * 2);
    g.fill();
    for (const s of [-1, 1]) {
      g.beginPath();
      g.ellipse(s * 20, -6, 8, 20, s * 0.6, 0, Math.PI * 2);
      g.fill();
      g.beginPath();
      g.strokeStyle = 'rgba(120,48,44,0.38)';
      g.lineWidth = 4;
      g.arc(s * 22, 26, 16, s < 0 ? -0.2 : Math.PI * 0.2, s < 0 ? Math.PI * 0.8 : Math.PI * 1.2);
      g.stroke();
    }
    g.fillRect(-2, 8, 4, 30);
    g.restore();
  };
  figure(64, 64);
  figure(192, 192);
  figure(192, -64);
  figure(64, 320);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

export interface HouseParts {
  root: THREE.Group;
  curtain: Curtain;
  programme: Programme;
  footBulbs: THREE.Mesh[];
  audience: THREE.Group;
  /** Proscenium height. */
  height: number;
  /** Proscenium width. */
  width: number;
}

/**
 * Loads the house that theatre/blender/build_house.py builds and bakes: the carved arch, the stage boards, the
 * footlight lip and fender, and the orchestra rail. Its `opening` marker gives the stage opening and floor height.
 */
export async function buildHouse(url: string, renderer: THREE.WebGLRenderer): Promise<HouseParts> {
  const root = new THREE.Group();
  root.name = 'house';
  const gltf = await new GLTFLoader().loadAsync(url);
  const house = gltf.scene;
  const u = house.getObjectByName('opening')!.userData as { floor: number; openW: number; openH: number; prosceniumW: number; prosceniumH: number };
  STAGE.floor = u.floor;
  STAGE.openW = u.openW;
  STAGE.openH = u.openH;
  STAGE.wing = STAGE.openW / 2 + 1.2;
  STAGE.flyHeight = STAGE.openH + 0.6;
  const F = STAGE.floor;
  const PW = u.prosceniumW, PH = u.prosceniumH;
  house.traverse((o) => {
    const mesh = o as THREE.Mesh;
    if (!mesh.isMesh) return;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    for (const m of (Array.isArray(mesh.material) ? mesh.material : [mesh.material]) as THREE.MeshStandardMaterial[]) {
      // The bake already holds the occlusion. The paint is cut by its alpha, never blended.
      m.transparent = false;
      m.depthWrite = true;
      if (m.map) m.map.anisotropy = renderer.capabilities.getMaxAnisotropy();
      if (m.name === 'arch_paint') {
        m.alphaTest = 0.5;
        gilt(m);
      }
    }
  });
  root.add(house);

  // Masking: black legs at the sides and borders above, so the audience never sees the wings or the loft.
  const black = new THREE.MeshStandardMaterial({ color: 0x07070a, roughness: 1 });
  // Each leg stands just outside the sightline from the centre seat through the edge of the arch.
  for (const z of [-0.8, -1.7, -2.6, -3.5]) {
    for (const side of [-1, 1]) {
      const leg = new THREE.Mesh(new THREE.PlaneGeometry(1.4, STAGE.openH + 2), black);
      const inner = STAGE.openW / 2 + 0.15 + Math.abs(z) * 0.38;
      leg.position.set(side * (inner + 0.7), F + (STAGE.openH + 2) / 2 - 0.1, z);
      root.add(leg);
    }
    const border = new THREE.Mesh(new THREE.PlaneGeometry(STAGE.openW + 3, 1.2), black);
    border.position.set(0, F + STAGE.openH + 0.55, z - 0.05);
    root.add(border);
  }
  // The proscenium wall around the arch, just behind it. Past the columns the audience sees wall: never the top or
  // the wrapped ends of the cyclorama, and never a piece that waits in the wings.
  // The wall is papered in dark damask. The posters of the repertoire hang on it.
  const paper = wallpaper();
  const papered = (w: number, h: number) => {
    const map = paper.clone();
    map.repeat.set(w / 0.9, h / 0.9);
    map.needsUpdate = true;
    return new THREE.MeshStandardMaterial({ map, roughness: 0.92 });
  };
  const header = new THREE.Mesh(new THREE.PlaneGeometry(PW + 16, 8), papered(PW + 16, 8));
  header.position.set(0, F + STAGE.openH + 0.1 + 4, -0.22);
  root.add(header);
  const sideH = STAGE.openH + 3.2;
  const panel = new THREE.MeshStandardMaterial({ color: 0x1c100b, roughness: 0.55 });
  const rail = new THREE.MeshStandardMaterial({ color: 0xc8963e, metalness: 0.9, roughness: 0.32 });
  for (const side of [-1, 1]) {
    const jamb = new THREE.Mesh(new THREE.PlaneGeometry(8, sideH), papered(8, sideH));
    jamb.position.set(side * (PW / 2 - 0.15 + 4), F - 3 + sideH / 2, -0.22);
    root.add(jamb);
    // A dark wood dado below the posters, capped by a brass rail.
    const dado = new THREE.Mesh(new THREE.BoxGeometry(8, 3.05, 0.03), panel);
    dado.position.set(side * (PW / 2 - 0.15 + 4), F - 3 + 1.525, -0.205);
    const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 8, 12), rail);
    cap.rotation.z = Math.PI / 2;
    cap.position.set(side * (PW / 2 - 0.15 + 4), F + 0.05, -0.185);
    root.add(dado, cap);
  }
  // The understage: a dark void below the boards. A piece waiting in the trap, the foot of a rod and the sunk half
  // of a ground row stay hidden from a low camera that looks under the lip of the stage.
  const under = new THREE.Mesh(new THREE.BoxGeometry(STAGE.openW + 8, 3, 6), black);
  under.position.set(0, F - 0.012 - 1.5, 0.05 - 3);
  root.add(under);
  const back = new THREE.Mesh(new THREE.PlaneGeometry(STAGE.openW + 8, STAGE.openH + 6), black);
  back.position.set(0, F + 1.5, -6.2);
  root.add(back);
  // The auditorium: a dark box around the audience so nothing shows past the arch.
  // Its back wall stands behind the cyclorama, so the hall never hides the stage.
  const hall = new THREE.Mesh(new THREE.BoxGeometry(24, 14, 32), new THREE.MeshStandardMaterial({ color: 0x0c0708, roughness: 1, side: THREE.BackSide }));
  hall.position.set(0, 5, 5);
  root.add(hall);

  // Footlights: brass shells with warm bulbs along the front edge.
  const shellMat = new THREE.MeshStandardMaterial({ color: 0xb8893a, roughness: 0.35, metalness: 0.9 });
  const footBulbs: THREE.Mesh[] = [];
  const n = 13;
  for (let i = 0; i < n; i++) {
    const x = -STAGE.openW / 2 + 0.2 + (i * (STAGE.openW - 0.4)) / (n - 1);
    const shell = new THREE.Mesh(new THREE.SphereGeometry(0.075, 20, 10, 0, Math.PI * 2, 0, Math.PI / 2), shellMat);
    shell.rotation.x = -Math.PI / 2 - 0.5;
    shell.position.set(x, F + 0.03, 0.12);
    const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.03, 12, 8), new THREE.MeshStandardMaterial({ color: 0x331a00, emissive: 0xffc070, emissiveIntensity: 2 }));
    bulb.position.set(x, F + 0.05, 0.1);
    footBulbs.push(bulb);
    root.add(shell, bulb);
  }

  // The house curtain hangs just behind the arch.
  const curtain = new Curtain(STAGE.openW + 0.3, STAGE.openH + 0.5, -0.14, F);
  root.add(curtain.group);

  // The programme board sits in the cartouche at the top of the arch (centre, about 7.6 % down the art).
  const programme = new Programme(PW * 0.13, PW * 0.13 * 0.5);
  // The carving stands up to 6 cm proud of the arch. The board sits just in front of it.
  programme.mesh.position.set(0, PH * (1 - 0.077), 0.075);
  root.add(programme.mesh);

  // A row of audience heads in front of the camera, cut from black card.
  const audience = new THREE.Group();
  const headMat = new THREE.MeshBasicMaterial({ color: 0x050405 });
  let s = 3;
  const r = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  for (let i = 0; i < 11; i++) {
    const shape = new THREE.Shape();
    const w = 0.42 + r() * 0.12, hh = 0.32 + r() * 0.08;
    shape.moveTo(-w, 0);
    shape.quadraticCurveTo(-w * 0.95, hh * 0.7, -w * 0.35, hh * 0.8);
    shape.absarc(0, hh * 1.25, w * 0.32, Math.PI * 1.15, -Math.PI * 0.15, true);
    shape.quadraticCurveTo(w * 0.95, hh * 0.7, w, 0);
    shape.lineTo(-w, 0);
    const head = new THREE.Mesh(new THREE.ShapeGeometry(shape), headMat);
    head.position.set(-4.6 + i * 0.92 + r() * 0.2, 0.2 + r() * 0.1, 4.2 + r() * 0.3);
    audience.add(head);
  }
  root.add(audience);

  return { root, curtain, programme, footBulbs, audience, height: PH, width: PW };
}
