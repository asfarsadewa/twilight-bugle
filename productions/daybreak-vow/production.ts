// 天明之约 · The Daybreak Vow · Janji Fajar
// The cue sheet follows take 6 (song/master.json). Line numbers below are the sung lines in take order.
// Heights (y) are above the stage floor. The stage opening is about 5.1 wide and 2.1 high. Depth runs to z = -4.

import type { Art, CueContext, Master, PieceSpec, Production } from '../../theatre/src/core/types.ts';
import { cueKit } from '../../theatre/src/core/cuekit.ts';
import masterJson from './song/master.json';
import audio from './song/master.mp3?url';

const master = masterJson as unknown as Master;
const urls = import.meta.glob('./art/cut/*.webp', { eager: true, query: '?url', import: 'default' }) as Record<string, string>;
type Cut = Art & { file: string; normal?: string };
const metas = import.meta.glob('./art/cut/*.json', { eager: true, import: 'default' }) as Record<string, Cut & { parts?: Cut[] }>;

const withUrls = (m: Cut): Art => ({ ...m, url: urls[`./art/cut/${m.file}`]!, normalUrl: m.normal ? urls[`./art/cut/${m.normal}`] : undefined });
const art = (name: string): Art => withUrls(metas[`./art/cut/${name}.json`]!);
const part = (name: string, k: number): Art => withUrls(metas[`./art/cut/${name}.json`]!.parts![k]!);
const sheet = (a: Art): [number, number] => [a.w, a.h];

// ---------------------------------------------------------------- cast and scenery

const AUREL = { x: -1.4, z: -0.55 };
const ILUNE = { x: 1.15, y: 0.4, z: -1.32 };
const SPIRE = { x: 1.12, y: 1.78, z: -2.5 };

const aurelParts = [0, 1, 2, 3].map((k) => part('puppet-aurel', k));
const iluneParts = [0, 1, 2, 3].map((k) => part('puppet-ilune', k));
const armourParts = [0, 1, 2, 3].map((k) => part('puppet-ilune-armour', k));

const pieces: PieceSpec[] = [
  // The sky is the theatre's cyclorama, lit by its own lamps. Far scenery is cut as silhouettes against it,
  // lighter with distance, as haze would make it.

  { id: 'sun', kind: 'prop', art: art('prop-sun'), width: 0.95, anchor: 'center', home: { x: -1.5, y: 1.2, z: -3.6 }, route: 'trap', rod: true, glow: 0.35 },
  { id: 'moon', kind: 'prop', art: art('prop-moon'), width: 0.62, anchor: 'center', home: { x: 2.1, y: 1.75, z: -2.9 }, route: 'fly', strings: [[0.62, 0.03]], glow: 0.12 },
  { id: 'mountains', kind: 'flat', art: art('flat-mountains'), width: 7.6, home: { x: -0.6, y: -1.0, z: -3.45 }, route: 'fly', startIn: true, silhouette: { color: 0x58668a } },
  { id: 'clouds', kind: 'flat', art: art('flat-clouds'), width: 6.6, home: { x: 0, y: 0.95, z: -3.1 }, route: 'fly', silhouette: { color: 0x1d2236 } },
  { id: 'city', kind: 'flat', art: art('flat-city'), width: 4.2, home: { x: 1.05, y: -0.45, z: -2.6 }, route: 'right', startIn: true, silhouette: { color: 0x262c44 } },
  { id: 'crown', kind: 'prop', art: art('prop-hollow-crown'), width: 2.3, anchor: 'center', home: { x: 0.05, y: 1.55, z: -2.0 }, route: 'fly', strings: [[0.18, 0.15], [0.5, 0.03], [0.82, 0.15]] },
  { id: 'pines', kind: 'flat', art: art('flat-pines'), width: 1.95, home: { x: -2.35, y: -0.05, z: -1.85 }, route: 'left', silhouette: { color: 0x182033 } },
  { id: 'hills', kind: 'flat', art: art('flat-snow-hills'), width: 4.1, home: { x: -1.45, y: -0.2, z: -1.55 }, route: 'left', silhouette: { color: 0x8592b0 } },
  { id: 'rampart', kind: 'flat', art: art('flat-rampart'), width: 3.4, home: { x: 1.2, y: -0.1, z: -1.2 }, route: 'right' },
  ...[-2.45, -2.0, -0.8, -0.35].map((x, i): PieceSpec => ({
    id: `knight${i}`, kind: 'prop', art: art('prop-umbral-knight'), width: 0.5, home: { x, y: 0.06, z: -1.0 - i * 0.08 },
    route: 'fly', strings: [[0.36, 0.04], [0.66, 0.06]], mirror: i >= 2,
  })),
  { id: 'army', kind: 'flat', art: art('flat-army'), width: 3.4, home: { x: -0.4, y: -0.05, z: -0.85 }, route: 'right' },
  { id: 'campfire', kind: 'prop', art: art('prop-campfire'), width: 0.46, home: { x: -2.0, y: 0, z: -0.95 }, route: 'trap', glow: 0.5 },
  {
    id: 'ilune', kind: 'puppet', home: { x: ILUNE.x, y: ILUNE.y, z: ILUNE.z }, route: 'trap', rod: true,
    puppet: {
      height: 0.8, faces: 'left',
      body: { art: iluneParts[1]!, sheet: sheet(iluneParts[1]!), pivot: [0.5, 1] },
      head: { art: iluneParts[0]!, sheet: sheet(iluneParts[0]!), pivot: [0.63, 0.73], attach: [0.54, 0.02], z: -0.6 },
      armA: { art: iluneParts[2]!, sheet: sheet(iluneParts[2]!), pivot: [0.89, 0.3], attach: [0.455, 0.04], z: 1 },
      armB: { art: iluneParts[3]!, sheet: sheet(iluneParts[3]!), pivot: [0.27, 0.16], attach: [0.63, 0.04], z: -1 },
    },
  },
  {
    id: 'armour', kind: 'puppet', home: { x: ILUNE.x, y: ILUNE.y, z: ILUNE.z }, route: 'trap', rod: true, strings: [[0.3, 0.02], [0.72, 0.02]],
    puppet: {
      height: 0.8, faces: 'left',
      body: { art: armourParts[1]!, sheet: sheet(armourParts[1]!), pivot: [0.5, 1] },
      head: { art: armourParts[0]!, sheet: sheet(armourParts[0]!), pivot: [0.58, 0.67], attach: [0.52, 0.01], z: -0.6 },
      armA: { art: armourParts[2]!, sheet: sheet(armourParts[2]!), pivot: [0.87, 0.55], attach: [0.4, 0.07], z: 1 },
      armB: { art: armourParts[3]!, sheet: sheet(armourParts[3]!), pivot: [0.32, 0.08], attach: [0.62, 0.07], z: -1 },
    },
  },
  {
    id: 'aurel', kind: 'puppet', home: { x: AUREL.x, y: 0, z: AUREL.z }, route: 'left', rod: true,
    puppet: {
      height: 0.86, faces: 'right',
      body: { art: aurelParts[2]!, sheet: sheet(aurelParts[2]!), pivot: [0.5, 1] },
      head: { art: aurelParts[0]!, sheet: sheet(aurelParts[0]!), pivot: [0.53, 0.88], attach: [0.5, 0.035], z: -0.6 },
      armA: { art: aurelParts[1]!, sheet: sheet(aurelParts[1]!), pivot: [0.89, 0.55], attach: [0.33, 0.12], z: -1 },
      armB: { art: aurelParts[3]!, sheet: sheet(aurelParts[3]!), pivot: [0.18, 0.12], attach: [0.67, 0.12], z: 1 },
    },
  },
  { id: 'horse', kind: 'prop', art: art('prop-horse-aurel'), width: 1.25, home: { x: -1.5, y: 0, z: -0.6 }, route: 'left', rod: true },
];

// ---------------------------------------------------------------- the cue sheet

function cues({ tl, section, line }: CueContext) {
  const k = cueKit(tl, master);
  const L = (n: number) => line(n).start;
  const S = (id: string) => section(id).start;
  const vox = master.vox!;
  tl.signal('aurel.sing', vox.fps, vox.prince ?? []);
  tl.signal('ilune.sing', vox.fps, vox.princess ?? []);
  tl.signal('armour.sing', vox.fps, vox.princess ?? []);
  tl.base('armour.strings', 0);
  tl.base('aurel.turn', 1); // Aurel starts facing north, to stage left.

  // Where the follow spot looks for each figure, as heights above the floor.
  const onAurel = (t: number, dur = 0.7) => {
    k.aim('follow', AUREL.x + tl.value('aurel.x', t), 0.9 + tl.value('aurel.y', t), AUREL.z, t, dur);
    k.look(t, dur, { left: 0.95, right: 0.22 });
  };
  const onIlune = (t: number, dur = 0.7) => {
    k.aim('follow', ILUNE.x + tl.value('armour.x', t) + tl.value('ilune.x', t), ILUNE.y + 0.95 + tl.value('armour.y', t), ILUNE.z, t, dur);
    k.look(t, dur, { right: 0.95, left: 0.22 });
  };

  // ---- preroll: the house settles, the lights go down, the title glows on the arch.
  const P = -7;
  k.cam(P, 0.01, { x: 0, y: 0.95, z: 9.4, lx: 0, ly: 1.05, lz: -1, fov: 27 });
  k.look(P + 1, 3.5, { house: 0, fohL: 0.12, fohR: 0.1, foot: 0.9, ambient: 0.25 });
  k.aim('follow', 0, 1.0, -0.14, P);
  k.look(P + 3.5, 1.5, { follow: [0.55, 0xffe4bc] });
  tl.set('surtitles.i', 0, P);

  // ---- intro (0 to 28.96): shadow play. The realm stands in evening light. The Hollow Crown comes and eats the sun.
  tl.set('curtain.style', 1, 0);
  k.move('curtain.open', 1, 0.6, 4.2, 'inOut');
  tl.base('cycHz.y', 0.2);
  k.look(0.2, 3.5, { cycTop: [0.85, 0x5f7fc8], cycHz: [1.3, 0xffb469], cycBot: [0.7, 0xff9a5a], follow: 0, fohL: [0.3, 0xffd2a0], fohR: [0.25, 0xffd8b0], foot: 0.6, ambient: 0.3 });
  k.cam(0.5, 15, { z: 8.3, ly: 1.1 });
  // The sun rises from behind the mountains.
  k.move('sun.x', 0.55, 0, 0.01);
  k.move('sun.y', 0.45, 0, 0.01);
  k.enter('sun', 1.6, 3.6, 'out');
  k.place('glowB', -0.95, 1.65, -3.0, 0);
  k.look(1.6, 3.6, { glowB: [1.2, 0xffc070] });
  // The Hollow Crown comes down on its strings. Its eyes kindle.
  k.move('crown.s', 0.62, 0, 0.01);
  k.move('crown.y', 0.25, 0, 0.01);
  k.enter('crown', 5.6, 2.8, 'out');
  k.place('glowA', 0.05, 1.8, -1.6, 0);
  k.look(7.4, 1.4, { glowA: [1.0, 0xff2a1a] });
  // The sun drifts into the crown and goes out. The Long Night falls on the cyclorama.
  k.move('sun.x', 1.55, 8.8, 2.8, 'inOut');
  k.move('sun.y', 0.62, 8.8, 2.8, 'inOut');
  k.move('sun.s', 0.01, 11.0, 1.1, 'in');
  k.flash('flash', 12.0, 0.9, 0, 0.04, 0.7);
  k.look(12.0, 3.2, { cycTop: [0.75, 0x16245e], cycHz: [0.35, 0x2b3c8a], cycBot: [0.45, 0x0f1638], glowB: 0, fohL: [0.22, 0x9db0ff], fohR: [0.2, 0x8fa8ff], foot: 0.4 });
  k.move('cycHz.y', 0.12, 12, 3.2);
  k.move('stars.i', 1, 12.6, 4.5, 'inOut');
  k.leave('sun', 12.2, 0.01);
  k.move('sun.s', 1, 12.3, 0.01);
  k.leave('crown', 13.4, 2.2, 'in');
  k.look(13.4, 1.2, { glowA: 0 });
  // The crown is back in the loft. It returns full size in the bridge.
  k.move('crown.s', 1, 16, 0.01);
  k.move('crown.y', 0, 16, 0.01);
  // Night in Ilvara: windows light, the moon comes down on its wire, the rampart slides on.
  k.move('city.glow', 1.4, 14.5, 3.5);
  k.enter('moon', 14.2, 3.0, 'out');
  k.enter('rampart', 15.2, 2.2, 'out');
  k.look(14.4, 3, { back: [0.55, 0xa8c0ff], right: [0.55, 0x9fb8ff], left: [0.2, 0xffc58a], spire: 0.45, ambient: 0.28 });
  k.place('spire', SPIRE.x, SPIRE.y - 0.1, SPIRE.z + 0.6, 0);
  // The army marches in from the right wing and halts before the gate. Aurel walks in from the left.
  k.enter('army', 17, 6.5, 'linear');
  tl.hold('army.hop', 17).to('army.hop', 0.5, 17, 0.4).hold('army.hop', 23).to('army.hop', 0, 23, 0.4);
  k.enter('aurel', 21, 3.2, 'out');
  tl.hold('aurel.hop', 21).to('aurel.hop', 1, 21, 0.3).hold('aurel.hop', 23.8).to('aurel.hop', 0, 23.8, 0.4);
  k.cam(17, 11, { z: 7.2, y: 0.85, ly: 0.95 });
  tl.set('audience.i', 0, 17.5);
  k.look(22, 3, { fohL: [0.5, 0xffd8b0], left: 0.45 });

  // ---- verse 1: the parting at the north gate.
  tl.set('surtitles.i', 1, L(0) - 1);
  // 0 Ilune: 号角吹响 — she rises onto the rampart.
  k.enter('ilune', L(0) - 1.2, 1.6, 'outBack');
  onIlune(L(0) - 0.8, 0.01);
  k.look(L(0) - 0.6, 0.8, { follow: [0.85, 0xdbe6ff] });
  // 1 to 3 Aurel. He looks back on 我回头望.
  onAurel(L(1) - 0.3, 0.9);
  k.look(L(1) - 0.3, 0.9, { follow: [0.9, 0xffe6c0] });
  tl.hold('aurel.turn', L(2)).to('aurel.turn', 0, L(2), 0.7, 'inOut');
  k.move('aurel.head', 8, L(2) + 0.6, 1.2);
  k.cam(L(2), 3.5, { x: 0.35, lx: 0.3 });
  onIlune(L(3) - 0.2, 1.0);
  tl.hold('ilune.sway', L(3)).to('ilune.sway', 1.4, L(3), 0.8).to('ilune.sway', 0.3, L(3) + 3, 1);
  // 4 both: 你把剑 指向遥远的前线 — wide, both lit.
  k.look(L(4) - 0.2, 0.8, { follow: 0.25, left: 0.75, right: 0.75 });
  k.cam(L(4) - 0.4, 3, { x: 0, lx: 0, z: 7.6 });
  k.move('aurel.armA', -95, L(4) + 0.3, 1.0, 'outBack');
  // 5 Aurel: 九门的钥匙 系在我胸前 — his hand to his heart.
  onAurel(L(5) - 0.3);
  k.look(L(5) - 0.3, 0.6, { follow: 0.9 });
  k.move('aurel.armA', -10, L(5), 1.0);
  k.move('aurel.armB', 70, L(5) + 0.2, 1.1);
  // 6 and 7 Aurel: 别回头 … 这座城 有我守到春天 — he turns to the north and marches out with the army.
  k.move('ilune.head', -8, L(6), 1);
  k.move('aurel.armB', 0, L(7) - 0.4, 0.8);
  tl.hold('aurel.turn', L(7)).to('aurel.turn', 1, L(7), 0.6);
  k.move('army.x', -6.5, L(7) + 0.4, 3.0, 'in');
  tl.hold('army.hop', L(7) + 0.4).to('army.hop', 0.5, L(7) + 0.4, 0.3);
  // He marches a few steps after the army, then turns back for the pre-chorus.
  k.move('aurel.x', -1.4, L(7) + 1, 1.0, 'inOut');
  tl.hold('aurel.hop', L(7) + 1).to('aurel.hop', 1, L(7) + 1, 0.3);

  // ---- pre-chorus 1: the stage splits. The front is on the left, the city on the right.
  const pre1 = S('pre1');
  k.leave('army', pre1 - 0.2, 0.01);
  k.enter('hills', pre1 - 0.9, 1.6, 'out');
  k.enter('pines', pre1 - 0.6, 1.6, 'out');
  k.enter('campfire', pre1 - 0.2, 1.0, 'outBack');
  k.move('aurel.x', 0, pre1 - 0.8, 1.0, 'out');
  tl.hold('aurel.hop', pre1 + 0.1).to('aurel.hop', 0, pre1 + 0.1, 0.2);
  tl.hold('aurel.turn', pre1).to('aurel.turn', 0, pre1, 0.6);
  k.place('fire', -1.9, 0.35, -0.85, 0);
  k.look(pre1 - 0.5, 1.2, { left: [0.95, 0xffa060], right: [0.85, 0x8fb0ff], fire: 0.9, fohL: 0.18, fohR: 0.18, follow: 0.6 });
  tl.base('fire.flicker', 0.8);
  tl.base('lamp.flicker', 0);
  k.place('lamp', ILUNE.x - 0.3, ILUNE.y + 0.95, ILUNE.z + 0.45, 0);
  k.look(pre1, 1, { lamp: [0.5, 0xbcd6ff] });
  k.cam(pre1 - 0.5, 2.5, { z: 7.3, x: 0, lx: 0 });
  // 8 Ilune sings of him. 9 both: of her. 10 Ilune: the same stars. 11 Ilune: the same vow.
  onAurel(L(8) - 0.3);
  onIlune(L(9) - 0.3);
  k.move('aurel.head', 12, L(10), 1.2);
  k.move('ilune.head', 12, L(10), 1.2);
  k.cam(L(10) - 0.3, 2.2, { ly: 1.6, y: 0.75 });
  k.move('stars.i', 1.6, L(10), 1.0);
  k.move('stars.i', 1, L(11), 1.5);
  k.cam(L(11) - 0.2, 1.6, { ly: 0.95, y: 0.85 });
  k.move('aurel.head', 0, L(11), 1);
  k.move('ilune.head', 0, L(11), 1);
  k.move('ilune.armA', 25, L(11), 1.0);

  // ---- chorus 1: the vow.
  const chorus = (start: number, n: number, big: boolean) => {
    // n: Aurel, 等我到天明 — Daybrand rises.
    onAurel(L(n) - 0.3);
    k.look(L(n) - 0.3, 0.5, { follow: [1, 0xffe0a8], fohL: [big ? 0.7 : 0.55, 0xffd9a8], back: 0.85, cyc: [1, 0x4a48b0] });
    k.move('aurel.armA', -130, L(n), 0.9, 'outBack');
    k.flash('fohL', L(n) + 0.75, 1.1, big ? 0.7 : 0.55, 0.05, 0.9);
    // n+1: 等你到天明 — the Moonlamp rises and the spire answers.
    onIlune(L(n + 1) - 0.3);
    k.move('ilune.armA', 55, L(n + 1), 0.9, 'outBack');
    k.move('armour.armA', 55, L(n + 1), 0.9, 'outBack');
    k.look(L(n + 1), 0.6, { lamp: 0.9, spire: 0.8, follow: [1, 0xdce8ff] });
    // n+2: 纵然万里烽火 — the clouds come between them, lit from below like fires.
    if (!big) k.enter('clouds', L(n + 2) - 0.3, 2.2, 'out');
    k.look(L(n + 2), 1, { follow: 0.3, glowB: [0.8, 0xff7040], left: 0.8, right: 0.8 });
    k.place('glowB', 0, 1.0, -2.8, 0);
    k.cam(L(n + 2) - 0.2, 4, { z: big ? 6.6 : 6.9, ly: 1.15 });
    // n+3: 日与月 终会在晨光里相逢 — the moon swings to the sun, and the sun peeks over the mountains.
    k.move('moon.x', -1.2, L(n + 3), 3.2, 'inOut');
    // The sun only peeks over the far ridge: a promise, not yet the dawn.
    k.move('sun.x', -0.75, L(n + 3) + 0.1, 0.01);
    k.move('sun.y', -0.42, L(n + 3) + 0.1, 0.01);
    k.enter('sun', L(n + 3) + 0.2, 2.2, 'out');
    k.leave('sun', L(n + 3) + 3.4, 1.6, 'in');
    k.move('moon.x', 0, L(n + 3) + 3.6, 2.4, 'inOut');
    k.look(L(n + 3), 1.2, { follow: 0, glowB: 0.3, fohL: 0.5, fohR: 0.5 });
    k.move('aurel.armA', -10, L(n + 3) + 2, 1.5);
    k.move('ilune.armA', 0, L(n + 3) + 2, 1.5);
    k.move('armour.armA', 0, L(n + 3) + 2, 1.5);
    k.cam(L(n + 3) + 2.5, 4, { z: 7.4, ly: 1.0 });
  };
  chorus(S('ch1'), 12, false);

  // ---- interlude: the Umbral Host comes down on its strings at the front.
  const inter = section('ch1').end + 0.5;
  [0, 1, 2, 3].forEach((i) => {
    k.enter(`knight${i}`, inter + i * 0.55, 1.6, 'outBack');
    tl.base(`knight${i}.sway`, 1.6);
  });
  k.look(inter, 2, { left: [0.85, 0xff5a3a], glowB: [0.9, 0xff4020], cyc: [0.85, 0x4a2448] });
  k.move('aurel.armA', -60, inter + 1.5, 0.6, 'outBack');
  k.cam(inter, 4, { x: -0.6, lx: -0.6, z: 7.0 });

  // ---- verse 2a: fire on the city, and Ilune's armour.
  // 16 both: 火雨落下 夜空在燃烧
  tl.set('fire.x0', 0, 0).set('fire.x1', 2.6, 0);
  k.move('fire.rate', 0.85, L(16) - 0.4, 1.2);
  k.look(L(16) - 0.3, 1.2, { right: [0.95, 0xff6a3a], glowA: [0.9, 0xff6a2a], cyc: [0.8, 0x5a2030], cycHz: [0.9, 0xff5a2a] });
  k.place('glowA', 1.1, 1.0, -2.0, L(16) - 0.4);
  tl.base('glowA.flicker', 0.9);
  k.cam(L(16) - 0.5, 3, { x: 0.6, lx: 0.6, z: 6.9 });
  // 17 Ilune: 我摘下王冠 披上了战袍 — she turns edge-on and comes round in armour.
  const sw = L(17) + 0.4;
  tl.hold('ilune.turn', sw).to('ilune.turn', 0.499, sw, 0.35, 'in');
  k.pop('ilune', false, sw + 0.35);
  k.pop('armour', true, sw + 0.35);
  tl.set('armour.turn', 0.499, sw + 0.35);
  tl.to('armour.turn', 0, sw + 0.35, 0.35, 'out');
  k.flash('follow', sw + 0.35, 1.3, 0.9, 0.04, 0.8);
  onIlune(L(17) - 0.2);

  // ---- verse 2b: snow at the front.
  // 18 Ilune: 雪落满了 战士的肩头
  tl.set('snow.x0', -2.7, 0).set('snow.x1', -0.1, 0);
  k.move('fire.rate', 0.1, L(18) - 0.5, 1.5);
  k.move('snow.rate', 0.9, L(18) - 0.6, 1.5);
  k.look(L(18) - 0.3, 1.2, { left: [0.85, 0x9fb8ff], right: [0.6, 0xff8a5a], follow: 0.4, cycHz: [0.45, 0x3a3c80] });
  k.cam(L(18) - 0.6, 3, { x: -0.7, lx: -0.7 });
  onAurel(L(18));
  // 19 Aurel: 那一点光 告诉我 别回头 — he looks to the far spire. The spire answers.
  tl.hold('aurel.turn', L(19)).to('aurel.turn', 0, L(19), 0.6);
  k.flash('spire', L(19) + 1.0, 2.2, 1.0, 0.3, 1.6);
  k.cam(L(19), 3, { x: 0, lx: 0.3 });
  k.move('aurel.head', 10, L(19) + 0.5, 1);

  // ---- pre-chorus 2: the battle at the front, the lamp on the wall.
  const pre2 = S('pre2');
  k.move('snow.rate', 0.35, pre2, 2);
  k.move('aurel.head', 0, pre2, 1);
  const hits = k.downbeats(pre2, section('pre2').end);
  hits.forEach((b, i) => {
    tl.hold('aurel.armA', b).to('aurel.armA', i % 2 ? -140 : -30, b, 0.18, 'out');
    k.move(`knight${i % 4}.rz`, i % 2 ? 14 : -14, b + 0.05, 0.3, 'outBack');
    k.move(`knight${i % 4}.x`, (i % 2 ? 1 : -1) * 0.12, b + 0.05, 0.4, 'out');
    k.flash('fohL', b, 0.9, 0.3, 0.03, 0.4);
  });
  onAurel(L(20) - 0.3);
  onIlune(L(21) - 0.3);
  k.move('armour.head', 12, L(22), 1);
  k.move('aurel.head', 12, L(22), 1);
  k.cam(L(22) - 0.3, 2, { ly: 1.5 });
  k.cam(L(23) - 0.2, 1.6, { ly: 1.0, z: 7.3 });
  k.move('armour.head', 0, L(23), 1);
  k.move('aurel.head', 0, L(23), 1);
  k.move('armour.armA', 30, L(23), 1);

  // ---- chorus 2: the army returns behind the prince. The knights are driven up into the dark.
  const ch2 = S('ch2');
  k.move('army.x', 0, ch2 - 1.5, 0.01);
  k.enter('army', ch2 - 1.4, 2.6, 'out');
  tl.hold('army.hop', ch2 - 1.4).to('army.hop', 0, ch2 - 1.4, 0.3);
  [0, 1, 2, 3].forEach((i) => k.leave(`knight${i}`, ch2 + 0.4 + i * 0.25, 1.4, 'in'));
  k.move('snow.rate', 0, ch2, 3);
  k.leave('clouds', ch2 - 0.5, 3, 'inOut');
  chorus(ch2, 24, true);
  k.move('fire.rate', 0.5, L(26), 0.8);
  k.move('fire.rate', 0, L(27) + 1.5, 2);

  // ---- bridge: the Long Night closes in. The Hollow Crown takes Ilune on its strings.
  const br = S('bridge');
  k.leave('army', br - 1.0, 2, 'in');
  k.flash('flash', L(28) - 0.1, 1.2, 0, 0.04, 0.7);
  k.enter('crown', L(28), 3.2, 'out');
  k.look(L(28), 3, { cycTop: [0.5, 0x140818], cycHz: [0.65, 0x7a1020], cycBot: [0.3, 0x1a0610], stars: 0.25 });
  k.move('cycHz.y', 0.3, L(28), 3);
  k.enter('clouds', L(28) - 0.3, 2.4, 'out');
  k.look(L(28) + 0.2, 2.4, { fohL: 0.06, fohR: 0.06, foot: 0.12, cyc: [0.4, 0x2a0a18], back: [0.35, 0x803040], left: 0.1, right: 0.1, spire: 0, lamp: 0.4, glowB: 0, glowA: [1, 0xff1a10], ambient: 0.12, follow: 0 });
  k.place('glowA', 0.05, 1.45, -1.7, L(28));
  tl.base('glowA.flicker', 0.5);
  k.move('city.glow', 0, L(28), 2);
  k.cam(L(28), 6, { z: 6.6, ly: 1.25, x: 0, lx: 0.2 });
  // 29: 我就把灯 举向更高的天际 — the strings drop onto her and lift her toward the crown, lamp held high.
  k.move('armour.strings', 1, L(29) - 0.6, 1.0);
  k.move('armour.armA', 70, L(29), 1.2);
  k.move('armour.y', 0.85, L(29) + 0.4, 3.6, 'inOut');
  k.move('armour.x', -0.55, L(29) + 0.4, 3.6, 'inOut');
  tl.base('armour.sway', 0).to('armour.sway', 1.2, L(29), 1);
  k.place('lamp', ILUNE.x - 0.25, ILUNE.y + 0.8, ILUNE.z + 0.15, L(29) - 0.1);
  k.place('lamp', ILUNE.x - 0.55 - 0.3, ILUNE.y + 0.85 + 0.85, ILUNE.z + 0.15, L(29) + 0.4, 3.6);
  k.look(L(29) + 0.5, 3, { lamp: [2.2, 0xd8e8ff] });
  // 30 Aurel: 如果我 没能回到你那里 — alone in a narrow cold spot.
  onAurel(L(30) - 0.3, 0.6);
  k.look(L(30) - 0.3, 0.6, { follow: [0.8, 0xbfd4ff] });
  k.move('aurel.rz', 8, L(30), 0.8);
  k.move('aurel.y', -0.08, L(30), 0.8);
  // 31 both: 我就把剑 刺穿黑暗的心底 — he rises and points Daybrand at the star.
  k.move('aurel.rz', 0, L(31) + 0.4, 0.6);
  k.move('aurel.y', 0, L(31) + 0.4, 0.6);
  k.move('aurel.armA', -150, L(31) + 0.5, 0.9, 'outBack');
  // 32: 让光 穿过你我之间的距离 — a ray of light falls from her lamp onto his sword.
  const lampAt = { x: ILUNE.x - 0.85, y: ILUNE.y + 1.6, z: ILUNE.z + 0.2 };
  k.place('ray', lampAt.x, lampAt.y, lampAt.z, L(32) - 1);
  k.aim('ray', AUREL.x + 0.1, 1.0, AUREL.z, L(32) - 1, 0.01);
  k.look(L(32), 1.6, { ray: [1, 0xd8e8ff] });
  k.cam(L(32), 3, { z: 7.0, ly: 1.1, lx: 0 });

  // ---- the instrumental duel: Aurel rides at the crown. Blue for her wind synth, ember for his guitar.
  const solo = S('solo'), soloEnd = section('solo').end;
  k.look(solo, 0.8, { ray: 0.25, follow: 0 });
  k.leave('aurel', solo, 0.01);
  k.move('horse.x', 0, solo, 0.01);
  tl.set('horse.turn', 1, solo);
  k.enter('horse', solo + 0.1, 2.0, 'out');
  k.move('horse.x', 1.1, solo + 2.2, soloEnd - solo - 2.6, 'inOut');
  tl.hold('horse.hop', solo).to('horse.hop', 1, solo, 0.3);
  [0, 1, 2, 3].forEach((i) => {
    k.move(`knight${i}.x`, 0, solo, 0.01);
    k.move(`knight${i}.rz`, 0, solo, 0.01);
    k.enter(`knight${i}`, solo + 0.3 + i * 0.4, 1.0, 'out');
    // Each knight falls as the rider reaches it.
    const fall = solo + 3 + i * 2.4;
    k.move(`knight${i}.rz`, i % 2 ? 80 : -80, fall, 0.5, 'in');
    k.leave(`knight${i}`, fall + 0.3, 0.8, 'in');
  });
  const bars = k.downbeats(solo, soloEnd);
  bars.forEach((b, i) => {
    const hisTurn = Math.floor(i / 2) % 2 === 1;
    k.look(b, 0.25, hisTurn ? { left: [0.95, 0xff7a3a], right: 0.15, back: [0.7, 0xff9050], cycHz: [0.8, 0xff6a30] } : { right: [0.95, 0x8fb0ff], left: 0.15, back: [0.7, 0x9fb8ff], cycHz: [0.7, 0x5a78ff] });
    if (i % 2 === 0) k.flash('flash', b, 0.45, 0, 0.03, 0.35);
  });
  k.move('armour.rz', 10, solo, 1.2);
  k.move('armour.rz', -10, solo + 4, 1.2);
  k.move('armour.rz', 6, solo + 8, 1.2);
  k.cam(solo, 4, { z: 6.4, x: -0.6, lx: -0.4, ly: 1.0 });
  k.cam(solo + 6, soloEnd - solo - 6, { x: 0.4, lx: 0.3, z: 6.8 });

  // ---- final chorus, up a step: the strings are cut, the crown falls, the sun rises.
  // 33 Aurel: 等我到天明 — he leaps from the saddle; the ray lights Daybrand; the strings break.
  const c3 = L(33);
  k.leave('horse', c3 - 0.6, 0.8, 'in');
  k.move('aurel.x', 1.35, c3 - 0.6, 0.01);
  tl.set('aurel.turn', 0, c3 - 0.6);
  k.enter('aurel', c3 - 0.5, 0.01);
  k.move('aurel.y', 0.9, c3 - 0.4, 0.5, 'out');
  k.move('aurel.armA', -175, c3 - 0.4, 0.4, 'out');
  k.aim('ray', AUREL.x + 1.35 + 0.1, 1.9, AUREL.z, c3 - 0.4, 0.4);
  k.look(c3 - 0.4, 0.3, { ray: 1.4 });
  k.flash('flash', c3 + 0.15, 1.6, 0, 0.03, 1.0);
  k.flash('fohL', c3 + 0.15, 1.6, 0.6, 0.03, 1.2);
  k.move('armour.strings', 0, c3 + 0.15, 0.05);
  k.move('crown.strings', 0, c3 + 0.15, 0.05);
  k.move('crown.y', -1.6, c3 + 0.2, 1.6, 'in');
  k.move('crown.rz', -35, c3 + 0.2, 1.6, 'in');
  k.leave('crown', c3 + 1.7, 0.4);
  k.look(c3 + 0.2, 1.2, { glowA: 0, ray: 0, lamp: 1.2 });
  k.move('aurel.y', 0, c3 + 0.6, 0.7, 'in');
  // 34 both: 等你到天明 — Ilune floats down to his arms at the centre front.
  k.move('armour.x', -0.7, L(34) - 1.2, 2.2, 'inOut');
  k.move('armour.y', 0.1 - ILUNE.y, L(34) - 1.2, 2.2, 'inOut');
  k.move('armour.z', 0.45, L(34) - 1.2, 2.2, 'inOut');
  k.move('armour.sway', 0, L(34), 1);
  k.move('armour.rz', 0, L(34), 1);
  k.move('aurel.x', 1.45, L(34) - 0.6, 1.6);
  k.move('aurel.armA', -20, L(34), 1);
  k.move('aurel.armB', 45, L(34) + 0.6, 1);
  k.place('lamp', ILUNE.x - 0.95, 0.85, ILUNE.z + 0.6, L(34) - 1.2, 2.2);
  // 35 both: the night flies out. Dawn is behind it.
  k.look(L(35), 5, { cycTop: [0.75, 0x86a6e6], cycHz: [0.8, 0xffa66a], cycBot: [0.55, 0xffb48a] });
  k.move('cycHz.y', 0.22, L(35), 5);
  k.move('stars.i', 0, L(35), 4);
  k.move('stars.out', 1, L(35) + 1, 4, 'in');
  k.leave('clouds', L(35) + 0.5, 3.5, 'in');
  k.look(L(35), 4, { cyc: [1, 0xffb38a], back: [0.9, 0xffcf90], fohL: [0.75, 0xffdcae], fohR: [0.7, 0xffe9cc], foot: 0.9, ambient: 0.55, left: 0.25, right: 0.25 });
  k.move('city.glow', 0.15, L(35), 3);
  k.cam(L(35), 6, { z: 7.6, ly: 1.15, x: 0, lx: 0 });
  // 36 Ilune: 日与月 终会在晨光里相逢 — the sun rises over the mountains. The moon is still up.
  k.move('sun.y', 0, L(36) - 1, 0.01);
  k.move('sun.x', 0, L(36) - 1, 0.01);
  k.enter('sun', L(36) - 0.8, 5, 'out');
  k.move('moon.x', 0.2, L(36) - 0.8, 0.01);
  k.move('moon.y', 0.15, L(36), 5);
  k.look(L(36), 3, { glowB: [1.2, 0xffc070] });
  k.place('glowB', -1.3, 1.1, -3.2, L(36));
  tl.base('glowB.flicker', 0);
  // 37 both: 天明之约 永不凋零 — the title glows on the arch.
  k.cam(L(37) - 0.5, 5, { z: 8.2, ly: 1.15 });
  k.flash('fohR', L(37), 1.1, 0.7, 0.2, 2.0);

  // ---- outro: 天亮了 … 我回来了
  k.move('armour.head', 14, L(38), 1.4);
  k.move('armour.rz', -6, L(39), 1.6);
  k.move('aurel.head', -6, L(39), 1.6);
  k.cam(L(38) - 1, 6, { z: 6.6, ly: 0.75, x: 0.9, lx: 1.0 });
  onIlune(L(38) - 0.5, 1.2);
  k.look(L(38) - 0.5, 1.2, { follow: [0.6, 0xffe2c0], fohL: 0.45, fohR: 0.45 });

  // ---- the end: the curtain comes down, then a curtain call.
  const end = master.duration;
  tl.set('surtitles.i', 0, end - 3.4);
  tl.set('audience.i', 1, end - 4.5);
  k.cam(end - 4.5, 4, { z: 9.4, x: 0, lx: 0, y: 0.95, ly: 1.05 });
  k.move('curtain.open', 0, end - 3.6, 3.4, 'inOut');
  k.look(end - 1, 2, { follow: 0, house: 0.25 });
  // Curtain call: the traveller parts a little, the two bow, it closes.
  tl.set('curtain.style', 0, end + 0.5);
  k.move('curtain.open', 0.5, end + 0.8, 1.6, 'out');
  k.look(end + 0.6, 0.8, { follow: [0.7, 0xffe6c4] });
  k.aim('follow', 1.2, 0.5, -0.4, end + 0.5, 0.01);
  k.move('armour.rz', 22, end + 2.4, 0.5);
  k.move('armour.rz', -6, end + 3.0, 0.5);
  k.move('aurel.rz', -22, end + 2.5, 0.5);
  k.move('aurel.rz', 0, end + 3.1, 0.5);
  k.move('curtain.open', 0, end + 4.0, 1.8, 'inOut');
  k.look(end + 4.5, 1.5, { follow: 0, house: 0.7 });
}

const production: Production = {
  id: 'daybreak-vow',
  no: 1,
  title: { zh: '天明之约', en: 'The Daybreak Vow', id: 'Janji Fajar' },
  poster: urls['./art/cut/poster.webp']!,
  audio,
  master,
  pieces,
  curtain: { open: 'tableau', close: 'tableau' },
  preroll: 7,
  postroll: 7,
  fx: { flame: urls['./art/cut/prop-flame.webp']! },
  bill: {
    about: 'A war keeps a prince and a princess apart until daybreak. They sing the song as a duet in Mandarin.',
    cast: [['Prince Aurel', 'Tenor'], ['Princess Ilune', 'Soprano'], ['The Hollow Crown', 'On strings'], ['The Umbral Host', 'On strings']],
    scenes: ['Ilvara under the Long Night', 'The snows of the Sunward Marches', 'Daybreak'],
  },
  surtitles: { main: 'zh', second: 'id' },
  voices: {
    prince: { name: 'Aurel', color: '#f0be5a' },
    princess: { name: 'Ilune', color: '#b9cdf5' },
    both: { name: 'Aurel · Ilune', color: '#e6d6b8' },
  },
  cues,
};

export default production;
