// 山河为证 · Biar Tanah Air Menjadi Saksi · Let the Land Bear Witness
// The cue sheet follows take 3 (song/master.json). Line numbers below are the sung lines in take order.
// Heights (y) are above the stage floor. The stage opening is about 5.5 wide and 2.4 high. Depth runs to z = -4.
//
// The Long March, 1934 to 1935, printed as 1930s woodcuts. Shitou is a marionette: strings from his cap and both
// hands. The moon, the geese and the lanterns hang from the loft. The village, the villagers, the floating bridge,
// his mother, Old Zhao, the column, the climbers and the loess hills slide in on tin wires. The snow peak, the
// grassland, the fallen and the sun rise on rods from the trap. The river is a wave machine of two rocking rows.

import type { Art, CueContext, Master, PieceSpec, Production } from '../../theatre/src/core/types.ts';
import { cueKit } from '../../theatre/src/core/cuekit.ts';
import { curtainStyleIndex } from '../../theatre/src/house/curtain.ts';
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

// Shitou's home is the middle of the stage, between the river rows.
const SHITOU = { x: 0, y: 0, z: -1.3 };
// Parts of the sheet: 0 the head with the starred cap, 1 the arm with the rifle, 2 the body, 3 the open arm.
const shitou = [0, 1, 2, 3].map((k) => part('puppet-shitou', k));

const pieces: PieceSpec[] = [
  // Two ranges side by side, the second mirrored. At the back of the stage one flat looks narrower than the opening.
  { id: 'mountains', kind: 'flat', art: art('flat-mountains'), width: 5.6, home: { x: -2.3, y: -0.45, z: -3.6 }, route: 'fly' },
  { id: 'mountains2', kind: 'flat', art: art('flat-mountains'), width: 5.6, home: { x: 2.4, y: -0.5, z: -3.55 }, route: 'fly', mirror: true },
  { id: 'sun', kind: 'prop', art: art('prop-sun'), width: 1.0, anchor: 'center', home: { x: -1.25, y: 1.4, z: -3.35 }, route: 'trap', rod: true, glow: 0.35, shadow: false },
  { id: 'loess', kind: 'flat', art: art('flat-loess'), width: 5.4, home: { x: 0.4, y: -0.95, z: -3.0 }, route: 'right', slide: 'right' },
  { id: 'snowpeak', kind: 'flat', art: art('flat-snowpeak'), width: 2.9, home: { x: 0.9, y: -0.55, z: -3.2 }, route: 'trap', rod: true },
  { id: 'moon', kind: 'prop', art: art('prop-moon'), width: 0.58, anchor: 'center', home: { x: 1.75, y: 1.6, z: -2.95 }, route: 'fly', strings: [[0.5, 0.04]], glow: 0.3, shadow: false },
  { id: 'geese', kind: 'prop', art: art('prop-geese'), width: 1.25, anchor: 'center', home: { x: 0, y: 1.85, z: -2.85 }, route: 'fly', strings: [[0.18, 0.35], [0.82, 0.3]], shadow: false },
  { id: 'chainbridge', kind: 'flat', art: art('flat-chainbridge'), width: 5.6, home: { x: 0, y: -0.85, z: -2.7 }, route: 'fly' },
  { id: 'climbers', kind: 'prop', art: art('prop-climbers'), width: 1.15, home: { x: -1.5, y: 0.72, z: -2.62 }, route: 'left', slide: 'left' },
  { id: 'fallen', kind: 'flat', art: art('prop-fallen'), width: 2.2, home: { x: 0.35, y: -0.08, z: -2.55 }, route: 'trap', rod: true },
  { id: 'column', kind: 'flat', art: art('flat-column'), width: 3.0, home: { x: 0.2, y: -0.04, z: -2.3 }, route: 'left', slide: 'left' },
  { id: 'village', kind: 'flat', art: art('flat-village'), width: 2.6, home: { x: -1.75, y: -0.2, z: -2.2 }, route: 'left', slide: 'left', startIn: true },
  { id: 'grassland', kind: 'flat', art: art('flat-grassland'), width: 6.6, home: { x: 0, y: -0.78, z: -1.9 }, route: 'trap', rod: true },
  { id: 'lanterns', kind: 'prop', art: art('prop-lanterns'), width: 2.0, anchor: 'center', home: { x: 0.25, y: 1.78, z: -1.8 }, route: 'fly', strings: [[0.03, 0.08], [0.5, 0.06], [0.97, 0.08]], glow: 0.55, startIn: true },
  { id: 'villagers', kind: 'flat', art: art('flat-villagers'), width: 2.3, home: { x: 0.4, y: 0, z: -1.75 }, route: 'left', slide: 'left' },
  { id: 'waves2', kind: 'flat', art: art('flat-waves'), width: 6.6, home: { x: 0.2, y: -0.98, z: -1.62 }, route: 'trap', rod: true, mirror: true, startIn: true },
  { id: 'mother', kind: 'prop', art: art('prop-mother'), width: 0.55, home: { x: -1.15, y: 0, z: -1.55 }, route: 'left', slide: 'left' },
  { id: 'zhao', kind: 'prop', art: art('prop-zhao'), width: 0.66, home: { x: 0.85, y: 0, z: -1.5 }, route: 'right', slide: 'right' },
  { id: 'pontoon', kind: 'flat', art: art('flat-pontoon'), width: 4.8, home: { x: 0.1, y: -0.62, z: -1.45 }, route: 'left', slide: 'left' },
  {
    id: 'shitou', kind: 'puppet', home: SHITOU, route: 'fly',
    puppet: {
      height: 0.95, faces: 'right',
      body: { art: shitou[2]!, sheet: sheet(shitou[2]!), pivot: [0.5, 1] },
      head: { art: shitou[0]!, sheet: sheet(shitou[0]!), pivot: [0.62, 0.9], attach: [0.5, 0.03], z: -0.6, string: [0.52, 0.07] },
      armA: { art: shitou[1]!, sheet: sheet(shitou[1]!), pivot: [0.62, 0.355], attach: [0.13, 0.08], z: 1, rest: 0, string: [0.42, 0.45] },
      armB: { art: shitou[3]!, sheet: sheet(shitou[3]!), pivot: [0.2, 0.12], attach: [0.83, 0.08], z: 1.1, rest: -20, string: [0.84, 0.9] },
    },
  },
  { id: 'waves1', kind: 'flat', art: art('flat-waves'), width: 6.6, home: { x: -0.2, y: -1.06, z: -0.95 }, route: 'trap', rod: true, startIn: true },
  // A front row of grass, mirrored so its tall reeds stand on the right, where Old Zhao lies down.
  { id: 'grassfront', kind: 'flat', art: art('flat-grassland'), width: 6.6, home: { x: 0.3, y: -1.12, z: -1.05 }, route: 'trap', rod: true, mirror: true },
];

// ---------------------------------------------------------------- the cue sheet

function cues({ tl, section, line }: CueContext) {
  const k = cueKit(tl, master);
  const L = (n: number) => line(n).start;
  const S = (id: string) => section(id).start;
  const E = (id: string) => section(id).end;
  const end = master.duration;
  tl.signal('shitou.sing', master.vox!.fps, master.vox!.shitou ?? []);

  const sky = (t: number, dur: number, top: number, hz: number, bot: number, levels: [number, number, number] = [0.8, 1.0, 0.6], hzY = 0.16) => {
    k.look(t, dur, { cycTop: [levels[0], top], cycHz: [levels[1], hz], cycBot: [levels[2], bot] });
    k.move('cycHz.y', hzY, t, dur);
  };
  // Night on the river, dawn on the mountains, a red river, white snow, grey marsh, gold loess.
  const NIGHT = [0x0e1424, 0x23304c, 0x0a0d16] as const;
  const DAWN = [0x5e6e88, 0xf0c890, 0xd8c8b0] as const;
  const BLOOD = [0x2a0e0c, 0xb3261e, 0x3a1410] as const;
  const SNOW = [0x9aa8ba, 0xf2eee4, 0xd6d8dc] as const;
  const MARSH = [0x3e4450, 0xa8844a, 0x3e3a30] as const;
  const STORM = [0x323846, 0x7e8288, 0x2a2c34] as const;
  const PREDAWN = [0x161d30, 0xd8844e, 0x241e2a] as const;
  const GLORY = [0x7a8aa0, 0xffcf8a, 0xf0d8b0] as const;

  const at = (t: number) => ({ x: SHITOU.x + tl.value('shitou.x', t), y: SHITOU.y + tl.value('shitou.y', t), z: SHITOU.z + tl.value('shitou.z', t) });
  const follow = (t: number, dur = 0.7, level = 0.95, color = 0xfff0dc) => {
    const p = at(t);
    k.aim('follow', p.x, p.y + 0.8, p.z, t, dur);
    k.look(t, dur, { follow: [level, color] });
  };
  /** Shitou goes to a place on stage. A marionette walks with a bob on its strings. */
  const walk = (t: number, dur: number, to: { x?: number; y?: number; z?: number }, e: 'inOut' | 'out' | 'in' = 'inOut') => {
    if (to.x !== undefined) k.move('shitou.x', to.x - SHITOU.x, t, dur, e);
    if (to.y !== undefined) k.move('shitou.y', to.y - SHITOU.y, t, dur, e);
    if (to.z !== undefined) k.move('shitou.z', to.z - SHITOU.z, t, dur, e);
    if (dur > 0.1) tl.hold('shitou.hop', t).to('shitou.hop', 1, t, 0.2).hold('shitou.hop', t + dur).to('shitou.hop', 0, t + dur, 0.2);
  };
  const face = (t: number, left: boolean) => tl.hold('shitou.turn', t).to('shitou.turn', left ? 1 : 0, t, 0.6);
  const hop = (id: string, t: number, dur: number) => tl.hold(`${id}.hop`, t).to(`${id}.hop`, 1, t, 0.2).hold(`${id}.hop`, t + dur).to(`${id}.hop`, 0, t + dur, 0.2);
  /** The wave machine: a row rocks from side to side on its crank. */
  const rock = (id: string, from: number, to: number, amp: number, period: number) => {
    for (let t = from, i = 0; t < to - period / 2; t += period / 2, i++) k.move(`${id}.x`, i % 2 ? amp : -amp, t, period / 2, 'sine');
    k.move(`${id}.x`, 0, to - period / 2, period / 2, 'sine');
  };
  const c1 = L(8), c2 = L(20), br = L(24), sw = S('swell'), c3 = L(28), out = L(32);

  // ---- preroll: the house settles. The traveller hangs closed.
  const P = -7;
  tl.set('curtain.style', curtainStyleIndex('traveller'), P);
  k.cam(P, 0.01, { x: 0, y: 0.95, z: 9.4, lx: 0, ly: 1.05, lz: -1, fov: 27 });
  k.look(P + 1, 3.5, { house: 0, fohL: 0.12, fohR: 0.1, foot: 0.9, ambient: 0.25 });
  k.aim('follow', 0, 1.0, -0.14, P);
  k.look(P + 3.5, 1.5, { follow: [0.5, 0xffe4bc] });
  tl.set('surtitles.i', 0, P);
  k.move('dust.i', 0.8, P, 1);

  // ---- intro (0 to 14.2): night on the Yudu River. Lanterns burn in the village. Shitou comes down on his strings.
  k.move('curtain.open', 1, 0.3, 4.2, 'inOut');
  sky(0, 4, ...NIGHT, [0.55, 0.5, 0.35], 0.1);
  k.move('stars.i', 0.7, 0, 4);
  k.enter('moon', 0.4, 3.6, 'out');
  k.look(0.3, 3, { fohL: [0.16, 0xaab8e0], fohR: [0.14, 0x9fb0d8], foot: 0.3, ambient: 0.22, back: [0.35, 0x8fa8e0], lamp: [0.8, 0xffa860] });
  k.place('lamp', 0.25, 1.55, -1.7, 0);
  k.move('lanterns.glow', 0.75, 0, 2);
  tl.base('lanterns.sway', 0.35);
  rock('waves1', 0, 40, 0.07, 3.4);
  rock('waves2', 0.8, 40, 0.06, 3.9);
  walk(0, 0.01, { x: -0.55, y: 0, z: -1.3 });
  k.enter('shitou', 4.5, 2.8, 'out');
  follow(5.5, 1.2, 0.7, 0xfff0d8);
  k.cam(0.4, 13, { z: 8.5, ly: 1.12, x: -0.25, lx: -0.3 });

  // ---- verse 1: his mother, the sandals, the red star. The lamps go out. The villagers bring their doors.
  tl.set('surtitles.i', 1, L(0) - 1);
  // 0 十六岁那年 秋风吹过村庄 — the autumn wind: the lanterns swing.
  k.move('lanterns.sway', 1.1, L(0), 1.5);
  k.move('shitou.head', 8, L(0) + 0.5, 1.2);
  // 1 娘连夜为我 编好草鞋一双 — his mother slides in. He turns to her.
  k.enter('mother', L(1) - 1.4, 1.8, 'out');
  face(L(1) - 0.2, true);
  k.move('shitou.head', 0, L(1), 0.8);
  k.look(L(1), 1.5, { follow: [0.8, 0xffe0c0] });
  k.aim('follow', -0.9, 0.85, -1.45, L(1), 1);
  // 2 她说孩子 走吧 莫回头望 — he takes the sandals. "Do not look back": he turns away from her.
  k.move('shitou.armB', 50, L(2) - 0.4, 0.9);
  tl.base('mother.sway', 0).to('mother.sway', 0.3, L(2), 1);
  k.move('shitou.armB', 0, L(2) + 1.8, 0.8);
  face(L(2) + 1.6, false);
  k.move('shitou.head', -8, L(2) + 2, 1);
  // 3 我把红星 缝在帽檐上 — his hand goes to the star on his cap. A hard spot on his face.
  k.move('shitou.armB', 130, L(3) - 0.3, 1, 'out');
  k.move('shitou.head', 10, L(3), 0.8);
  k.move('shitou.armB', 0, L(3) + 2.4, 0.8);
  // 4 于都河边 不点一盏灯光 — the lanterns go out. His mother slides away.
  k.move('lanterns.glow', 0, L(4) - 0.2, 2.6, 'in');
  k.look(L(4), 2.6, { lamp: 0, fohL: [0.1, 0x9aa8d8], fohR: [0.08, 0x8f9fd0], ambient: 0.16 });
  k.leave('mother', L(4) + 0.4, 2.4, 'in');
  k.leave('lanterns', L(4) + 2.6, 2.4, 'in');
  // 5 乡亲拆下门板 为我们搭桥梁 — the villagers carry their doors to the river. The floating bridge goes in.
  tl.set('villagers.x', -1.6, 0);
  k.enter('villagers', L(5) - 1.6, 1.8, 'out');
  k.move('villagers.x', 1.4, L(5) - 0.2, 5.5, 'inOut');
  hop('villagers', L(5) - 1.6, 7);
  k.leave('villagers', L(5) + 5, 1.6, 'in');
  k.enter('pontoon', L(5) + 0.6, 3.4, 'out');
  k.cam(L(4), 8, { z: 7.9, ly: 1.05, x: 0, lx: 0 });

  // ---- pre-chorus 1: the army crosses in the dark and turns north.
  // 6 一步一步 走向北方 — he steps onto the bridge and crosses.
  walk(L(6) - 0.6, 5.4, { x: 1.0, y: 0.18, z: -1.42 });
  k.leave('village', L(6), 3.4, 'inOut');
  follow(L(6), 5, 0.8, 0xdde4ff);
  // 7 千山万水 路还很长 — the column follows over the river. The mountains come in behind.
  tl.set('column.x', -1.8, 0);
  k.enter('column', L(7) - 1.6, 2, 'out');
  k.move('column.x', 0.2, L(7) - 1, 6, 'inOut');
  k.enter('mountains', L(7) - 1, 3.6, 'out');
  k.enter('mountains2', L(7) - 0.8, 3.6, 'out');
  k.leave('moon', L(7), 3, 'in');
  k.move('stars.i', 0, L(7), 3);
  sky(L(7) - 0.5, 4, ...DAWN, [0.75, 0.95, 0.6], 0.14);

  // ---- chorus 1: dawn over the mountains. He stands firm and lifts the rifle. The geese fly north.
  k.leave('pontoon', c1 - 1.6, 2.4, 'in');
  k.leave('waves1', c1 - 1.2, 2.4, 'in');
  k.leave('waves2', c1 - 0.9, 2.4, 'in');
  walk(c1 - 1.4, 1.4, { x: 0, y: 0, z: -1.3 });
  k.move('shitou.armA', 35, c1, 0.9, 'out');
  k.move('shitou.head', 12, c1, 0.9);
  k.look(c1, 1.6, { fohL: [0.45, 0xfff0d8], fohR: [0.38, 0xfff4e8], left: [0.4, 0xffd8a8], right: [0.4, 0xffe8c8], foot: 0.65, back: [0.25, 0xffd8a0], ambient: 0.32 });
  sky(c1, 3, ...GLORY, [0.8, 0.78, 0.6], 0.2);
  follow(c1, 0.6, 1.0, 0xfff4e0);
  k.move('column.x', 1.1, c1 + 1, 16, 'linear');
  hop('column', c1, 17);
  tl.set('glints.x0', -2.4, c1).set('glints.x1', 2.4, c1);
  k.move('glints.rate', 0.25, c1, 1.5);
  k.cam(c1, 8, { z: 7.9, ly: 1.3, x: 0.15, lx: 0.15 });
  // 10 哪怕倒在风雪中 我也望着北方 — the geese fly north above him.
  tl.set('geese.x', -2.6, 0);
  tl.base('geese.sway', 0.8);
  k.enter('geese', L(10) - 1.2, 1.6, 'out');
  k.move('geese.x', 2.4, L(10) - 0.6, 7.5, 'linear');
  k.leave('geese', L(10) + 6.4, 1.2, 'in');
  k.move('shitou.armA', 60, L(10), 0.9, 'outBack');
  // 11 我的祖国 我的爹娘 — he looks back toward home, his hand on his heart.
  face(L(11), true);
  k.move('shitou.armA', 10, L(11), 1);
  k.move('shitou.armB', 75, L(11), 1);
  k.move('shitou.head', 4, L(11), 1);
  face(L(11) + 2.8, false);
  k.move('shitou.armB', 0, L(11) + 3, 1);
  k.move('glints.rate', 0, E('ch1'), 2);

  // ---- verse 2: the Xiang River runs red. The chain bridge under fire. The snow mountain. Old Zhao.
  // 12 湘江的水 染红了衣裳
  const v2 = L(12);
  k.leave('column', E('ch1') + 0.5, 2.2, 'in');
  sky(v2 - 3, 3.5, ...BLOOD, [0.7, 0.95, 0.5], 0.12);
  k.look(v2 - 2.5, 2.5, { fohL: [0.2, 0xff8a70], fohR: [0.18, 0xd06050], left: [0.35, 0xff5040], right: [0.3, 0xff6048], foot: 0.35, back: [0.4, 0xff5030], ambient: 0.2 });
  tl.set('waves1.x', 0, v2 - 3).set('waves2.x', 0, v2 - 3);
  k.enter('waves2', v2 - 3, 2.4, 'out');
  k.enter('waves1', v2 - 2.6, 2.4, 'out');
  rock('waves1', v2 - 2.6, L(13) + 1, 0.1, 2.4);
  rock('waves2', v2 - 2.2, L(13) + 1, 0.09, 2.8);
  k.move('waves1.glow', 0.25, v2 - 2, 2);
  k.move('shitou.armA', 0, v2 - 2, 1);
  k.move('shitou.head', -10, v2, 1.2);
  k.move('shitou.armB', 60, v2 + 0.4, 1);
  k.downbeats(v2 - 2, L(13)).forEach((b, i) => k.flash('flash', b + 0.35, i % 2 ? 0.25 : 0.45, 0, 0.02, 0.4));
  k.cam(v2 - 2, 5, { z: 7.6, ly: 1.1, x: -0.1, lx: -0.1 });
  // 13 铁索桥上 枪声在回响 — the chain bridge flies in. Men cross on the bare chains. Gunfire flashes.
  k.enter('chainbridge', L(13) - 2.6, 2.4, 'out');
  k.leave('waves1', L(13) + 0.4, 1.6, 'in');
  k.leave('waves2', L(13) + 0.6, 1.6, 'in');
  k.move('shitou.armB', 0, L(13) - 1, 0.8);
  k.move('shitou.head', 14, L(13) - 0.6, 0.8);
  walk(L(13) - 0.8, 1.2, { x: -0.6, z: -1.25 });
  k.enter('climbers', L(13) - 0.8, 1.2, 'out');
  k.move('climbers.x', 1.3, L(13) - 0.2, 4.2, 'inOut');
  k.move('climbers.y', 0.1, L(13) - 0.2, 2.1, 'out');
  k.move('climbers.y', 0, L(13) + 1.9, 2.1, 'in');
  k.leave('climbers', L(14) + 1.6, 1.2, 'in');
  [0, 0.35, 0.6, 1.1, 1.3, 1.7, 2.2, 2.4, 2.9].forEach((dt, i) => k.flash('flash', L(13) - 0.4 + dt, i % 3 ? 0.5 : 0.9, 0, 0.02, 0.25));
  k.flash('left', L(13) + 0.3, 0.9, 0.35, 0.02, 0.3);
  k.flash('right', L(13) + 1.2, 0.9, 0.3, 0.02, 0.3);
  // 14 雪山顶上 风像刀一样 — the bridge flies out, the snow peak rises, and the snow comes on the wind.
  k.leave('chainbridge', L(14) + 1.2, 2.2, 'in');
  k.enter('snowpeak', L(14) - 0.8, 2.6, 'out');
  sky(L(14) - 1, 2.5, ...SNOW, [0.75, 0.9, 0.6], 0.2);
  k.look(L(14) - 1, 2, { fohL: [0.32, 0xdce6ff], fohR: [0.3, 0xd0dcf0], left: [0.25, 0xc8d8ff], right: [0.22, 0xc0d0f0], back: [0.3, 0xe0ecff], foot: 0.4, ambient: 0.3 });
  tl.set('snow.x0', -2.6, L(14) - 1).set('snow.x1', 2.6, L(14) - 1);
  k.move('snow.rate', 0.95, L(14) - 0.6, 1.2);
  tl.base('shitou.sway', 0);
  k.move('shitou.sway', 1.2, L(14), 1);
  k.move('shitou.head', -14, L(14) + 0.4, 1);
  k.move('shitou.armB', 95, L(14) + 0.4, 1);
  walk(L(14) + 1, 3, { x: 0.15, z: -1.3 });
  k.cam(L(14) - 1, 6, { z: 7.4, ly: 1.2, x: 0.25, lx: 0.3 });
  // The grassland: the snow peak sinks and the marsh rises. The wind dies down.
  const marsh = L(15) - 3.4;
  k.leave('snowpeak', marsh, 2.6, 'in');
  k.enter('grassland', marsh + 0.2, 2.8, 'out');
  k.enter('grassfront', marsh + 0.5, 2.6, 'out');
  k.leave('mountains', marsh, 3, 'in');
  k.leave('mountains2', marsh + 0.2, 3, 'in');
  k.move('snow.rate', 0, marsh, 3);
  k.move('shitou.sway', 0, marsh, 2);
  k.move('shitou.armB', 0, marsh, 1);
  k.move('shitou.head', 0, marsh, 1);
  sky(marsh, 3, ...MARSH, [0.65, 0.8, 0.5], 0.12);
  k.look(marsh, 3, { fohL: [0.26, 0xffd8a8], fohR: [0.22, 0xe0d0b8], left: [0.2, 0xd8b080], right: [0.18, 0xc8b090], back: [0.2, 0xd0a870], foot: 0.4, ambient: 0.25 });
  k.move('haze', 1.8, marsh, 3);
  // 15 老班长把最后的干粮 — Old Zhao comes along the wire and holds out his last food.
  k.enter('zhao', L(15) - 2, 2, 'out');
  tl.base('zhao.sway', 0).to('zhao.sway', 0.25, L(15), 1);
  follow(L(15) - 0.4, 1, 0.85, 0xffe8c8);
  k.cam(L(15) - 1, 5, { z: 7.2, ly: 1.05, x: 0.45, lx: 0.5 });
  // 16 悄悄塞进我的行囊 — Shitou takes it.
  k.move('shitou.armB', 45, L(16) - 0.4, 0.9);
  k.move('shitou.head', -6, L(16), 0.8);
  k.move('shitou.armB', 0, L(16) + 1.8, 0.8);
  // 17 他睡在草地 再没等到天亮 — Zhao lies down in the grass and does not rise. Shitou kneels.
  k.move('zhao.rz', -78, L(17) + 0.2, 3.4, 'inOut');
  k.move('zhao.y', -0.42, L(17) + 0.6, 3.2, 'inOut');
  k.move('zhao.x', 0.25, L(17) + 0.6, 3.2, 'inOut');
  sky(L(17), 3, ...NIGHT, [0.5, 0.4, 0.3], 0.1);
  k.look(L(17), 3, { fohL: [0.1, 0x9aa8d8], fohR: [0.08, 0x8f9fd0], left: 0.06, right: 0.06, back: [0.3, 0x8fa8e0], foot: 0.25, ambient: 0.16, follow: [0.6, 0xc8d4ff] });
  k.move('stars.i', 0.55, L(17) + 1, 3);
  walk(L(17) + 1.2, 1.6, { y: -0.14 });
  k.move('shitou.head', -18, L(17) + 1.6, 1.4);
  k.move('shitou.armA', -15, L(17) + 1.6, 1.4);
  // "never saw the dawn": a thin warm line comes up on the horizon, too late for him.
  k.look(L(17) + 3.4, 2.4, { cycHz: [0.55, 0xd8844e] });

  // ---- pre-chorus 2: Shitou rises and walks on. The column comes back across the marsh.
  k.leave('zhao', S('pre2') - 1, 0.01);
  k.move('stars.i', 0, S('pre2') - 0.5, 2);
  sky(S('pre2') - 0.5, 3, ...MARSH, [0.65, 0.85, 0.5], 0.12);
  k.look(S('pre2') - 0.5, 2, { fohL: [0.28, 0xffd8a8], fohR: [0.24, 0xe0d0b8], left: [0.22, 0xd8b080], right: [0.2, 0xc8b090], back: [0.2, 0xd0a870], foot: 0.45, ambient: 0.25 });
  // 18 一步一步 走向北方
  walk(L(18) - 0.4, 1.2, { y: 0 });
  k.move('shitou.head', 6, L(18) - 0.2, 1);
  k.move('shitou.armA', 0, L(18) - 0.2, 1);
  walk(L(18) + 1, 4.4, { x: 0.45, z: -1.3 });
  // 19 千山万水 路还很长
  tl.set('column.x', -1.8, S('pre2'));
  k.enter('column', L(19) - 1.6, 2, 'out');
  k.move('column.x', 0.2, L(19) - 1, 5, 'inOut');
  follow(L(18), 4, 0.85);

  // ---- chorus 2: the march across the marsh in a storm. He falls in the wind and gets up again.
  sky(c2, 3, ...STORM, [0.65, 0.8, 0.5], 0.12);
  k.look(c2, 1.6, { fohL: [0.4, 0xeef0ff], fohR: [0.34, 0xe0e4f0], left: [0.35, 0xc8d0e8], right: [0.35, 0xd8dcf0], foot: 0.55, back: [0.3, 0xb0bcd8], ambient: 0.28 });
  walk(c2 - 0.6, 1, { x: 0, z: -1.3 });
  k.move('shitou.armA', 35, c2, 0.9, 'out');
  k.move('shitou.head', 12, c2, 0.9);
  follow(c2, 0.6, 1.0, 0xfff4e0);
  k.move('column.x', 1.0, c2 + 1, 16, 'linear');
  hop('column', c2, 17);
  tl.set('snow.x0', -2.6, c2).set('snow.x1', 2.6, c2);
  k.move('snow.rate', 0.35, c2, 2);
  k.cam(c2, 9, { z: 7.8, ly: 1.25, x: 0, lx: 0 });
  // 22 哪怕倒在风雪中 我也望着北方 — the snow thickens. He goes down on one knee, then stands and looks north.
  k.move('snow.rate', 0.95, L(22) - 0.5, 1);
  k.move('shitou.sway', 1.3, L(22) - 0.5, 1);
  walk(L(22) + 0.2, 0.8, { y: -0.16 }, 'in');
  k.move('shitou.rz', 8, L(22) + 0.2, 0.8, 'in');
  k.move('shitou.armA', -10, L(22) + 0.2, 0.8);
  k.move('shitou.head', -14, L(22) + 0.2, 0.8);
  walk(L(22) + 2.2, 1.4, { y: 0 }, 'out');
  k.move('shitou.rz', 0, L(22) + 2.2, 1.4, 'out');
  k.move('shitou.armA', 60, L(22) + 2.6, 1, 'outBack');
  k.move('shitou.head', 14, L(22) + 2.6, 1);
  k.move('shitou.sway', 0, L(22) + 3.5, 1.5);
  k.move('snow.rate', 0.3, L(22) + 3.5, 1.5);
  // 23 我的祖国 我的爹娘
  face(L(23), true);
  k.move('shitou.armA', 10, L(23), 1);
  k.move('shitou.armB', 75, L(23), 1);
  face(L(23) + 2.6, false);
  k.move('shitou.armB', 0, L(23) + 2.8, 1);
  k.move('snow.rate', 0, E('ch2'), 2);

  // ---- bridge: night in the grassland. The fallen stand in the mist behind him. He speaks to them.
  k.leave('column', br - 2.2, 2, 'in');
  sky(br - 1.6, 3, ...NIGHT, [0.55, 0.45, 0.35], 0.1);
  k.move('stars.i', 0.8, br - 1, 3);
  k.enter('moon', br - 1.8, 3, 'out');
  k.look(br - 1, 2.5, { fohL: [0.1, 0x9aa8d8], fohR: [0.12, 0xa0b0e0], left: [0.1, 0x8090c0], right: [0.14, 0x9aa8d8], back: [0.45, 0xa8c0ff], foot: 0.25, ambient: 0.16, follow: [0.55, 0xd8e4ff] });
  k.move('shitou.armA', 0, br - 1, 0.8);
  k.move('shitou.head', 0, br - 1, 0.8);
  k.move('dust.i', 1.6, br - 1, 3);
  // 24 战友啊 你们留在了路旁 — the fallen rise out of the mist. He turns to them.
  k.enter('fallen', br + 0.3, 3.4, 'out');
  k.move('fallen.glow', 0.2, br + 0.3, 3);
  face(br + 0.6, true);
  k.move('shitou.head', 6, br + 1, 1);
  k.cam(br, 9, { z: 7.5, ly: 1.15, x: 0.1, lx: 0.15 });
  // 25 我替你们 去看黄河的模样 — he turns north and points the way.
  face(L(25), false);
  k.move('shitou.armB', 70, L(25) + 0.4, 1.2);
  k.move('shitou.head', 12, L(25) + 0.4, 1.2);
  k.move('shitou.armB', 0, L(25) + 3.6, 1);
  // 26 等到春风 吹绿了山冈 — a breath of spring green on the horizon.
  k.look(L(26) - 0.4, 2.5, { cycBot: [0.45, 0x6a8a58], cycHz: [0.5, 0x9ab878] });
  // 27 我把你们的名字 轻轻地唱 — he salutes them.
  face(L(27) - 0.4, true);
  k.move('shitou.armB', 140, L(27), 1.2, 'out');
  k.move('shitou.head', 0, L(27), 1);
  k.move('fallen.glow', 0.4, L(27), 1.5);

  // ---- the swell: the march climbs out of the marsh. The fallen sink back. The loess hills come in.
  k.move('shitou.armB', 0, sw, 1);
  face(sw + 0.4, false);
  k.leave('fallen', sw + 0.3, 2.8, 'in');
  k.leave('moon', sw, 2.6, 'in');
  k.move('stars.i', 0.3, sw, 2);
  k.move('dust.i', 0.8, sw, 2);
  k.leave('grassland', sw + 1.2, 2.8, 'in');
  k.leave('grassfront', sw + 0.9, 2.6, 'in');
  k.enter('loess', sw + 2, 3.4, 'out');
  sky(sw, 3, ...PREDAWN, [0.75, 0.95, 0.5], 0.12);
  tl.set('column.x', -1.8, sw);
  k.enter('column', sw + 2.6, 2.2, 'out');
  k.move('column.x', 0, sw + 3, 4.2, 'inOut');
  k.downbeats(sw, c3).forEach((b, i) => k.flash('back', b, i % 2 ? 0.5 : 0.8, 0.3, 0.04, 0.6));
  k.look(sw + 0.5, 2, { fohL: [0.3, 0xffb890], fohR: [0.24, 0xd08870], left: [0.3, 0xff9060], right: [0.3, 0xffa070], follow: [0.95, 0xfff0d8], foot: 0.5 });
  k.cam(sw, c3 - sw, { z: 7.4, y: 0.7, ly: 1.4, x: 0, lx: 0 });

  // ---- final chorus, up a step: dawn over the loess hills. The sun rises. The column reaches the north.
  k.enter('sun', c3 - 1, 4, 'out');
  k.move('sun.glow', 0.6, c3, 3);
  sky(c3, 3, ...GLORY, [0.8, 0.82, 0.62], 0.22);
  k.move('stars.i', 0, c3, 2);
  k.look(c3, 1.5, { fohL: [0.5, 0xfff0d8], fohR: [0.42, 0xfff4e8], left: [0.55, 0xffc890], right: [0.55, 0xffd8a8], back: [0.35, 0xffd8a0], foot: 0.8, ambient: 0.35 });
  k.move('shitou.armA', 60, c3, 0.9, 'outBack');
  k.move('shitou.head', 14, c3, 0.9);
  follow(c3, 0.6, 1.0, 0xfff4e0);
  tl.set('glints.x0', -2.6, c3).set('glints.x1', 2.6, c3);
  k.move('glints.rate', 0.45, c3, 1.5);
  k.move('column.x', 1.6, c3 + 1, 14, 'linear');
  hop('column', c3, 15);
  // 30 哪怕倒在风雪中 我也望着北方 — the geese fly north again, over the hills.
  tl.set('geese.x', -2.6, c3);
  k.enter('geese', L(30) - 1.2, 1.6, 'out');
  k.move('geese.x', 2.4, L(30) - 0.6, 7.5, 'linear');
  k.leave('geese', L(30) + 6.4, 1.2, 'in');
  k.move('shitou.armB', 60, L(30), 1, 'out');
  // 31 我的祖国 我的爹娘
  k.move('shitou.armA', 15, L(31), 1);
  k.move('shitou.armB', 75, L(31), 1);
  k.leave('column', E('ch3') - 1, 2.4, 'in');
  k.move('glints.rate', 0.12, E('ch3') - 1, 2);
  k.cam(c3, E('ch3') - c3, { z: 8.0, y: 0.9, ly: 1.4, x: 0, lx: 0 });

  // ---- outro: the north. He looks back along the road, then faces the land ahead.
  // 32 走过了二万五千里路长
  face(out - 0.4, true);
  k.move('shitou.armB', 0, out - 0.4, 1);
  k.move('shitou.armA', 0, out - 0.4, 1);
  k.move('shitou.head', 6, out, 1);
  // 33 山河为证 我们到了北方
  face(L(33) - 0.2, false);
  k.move('shitou.head', 12, L(33), 1);
  k.move('shitou.armB', 75, L(33) + 0.4, 1);
  k.look(out, 3, { fohL: [0.3, 0xffe8c8], fohR: [0.24, 0xfff0dc], left: 0.2, right: 0.2, foot: 0.45, follow: [0.9, 0xfff0d0] });
  follow(out, 2, 0.9, 0xfff0d0);
  k.move('glints.rate', 0, out + 3, 3);
  k.cam(out, 6, { z: 7.6, ly: 1.15, x: 0, lx: 0 });

  // ---- the end: the traveller closes. In the curtain call Shitou bows.
  tl.set('surtitles.i', 0, end - 3.6);
  k.cam(end - 4.8, 4.2, { z: 9.4, x: 0, lx: 0, y: 0.95, ly: 1.05 });
  k.move('curtain.open', 0, end - 3.8, 3.4, 'inOut');
  k.look(end - 1, 2, { follow: 0, house: 0.25 });
  k.leave('shitou', end - 2, 0.01);
  for (const [ch, v] of [['shitou.x', 0], ['shitou.y', 0], ['shitou.z', -0.5 - SHITOU.z], ['shitou.rz', 0], ['shitou.turn', 0], ['shitou.armA', 0], ['shitou.armB', 0], ['shitou.head', 0]] as const) {
    k.move(ch, v, end - 1.9, 0.01);
  }
  k.move('curtain.open', 0.5, end + 0.8, 1.6, 'out');
  k.enter('shitou', end + 1.0, 1.2, 'out');
  k.look(end + 0.6, 0.8, { follow: [0.7, 0xffe6c4] });
  k.aim('follow', 0, 1.0, -0.5, end + 0.5, 0.01);
  k.move('shitou.rz', -20, end + 2.4, 0.5);
  k.move('shitou.rz', 0, end + 3.0, 0.5);
  k.move('curtain.open', 0, end + 4.2, 1.8, 'inOut');
  k.look(end + 4.6, 1.5, { follow: 0, house: 0.7 });

  spotlights();

  // ---- the spotlight play. Written last, so at the same moment it wins over the washes above. The washes drop and
  // one hard beam picks out the figure that matters. Haze makes the beams visible.
  function spotlights() {
    tl.base('haze', 1.2);
    // The red star: the washes drop. One hard beam on his face as his hand goes to the cap.
    k.look(L(3) - 0.4, 0.8, { fohL: 0.06, fohR: 0.05, back: 0.15, follow: [1.1, 0xfff0e0] });
    k.move('haze', 2.4, L(3) - 0.4, 0.8);
    k.look(L(3) + 2.6, 1.2, { fohL: 0.16, fohR: 0.14, back: 0.35 });
    // The chain bridge: two side beams cross over the gorge on the gunfire.
    k.aim('left', 1.2, 1.1, -2.6, L(13) - 0.6, 0.01);
    k.aim('right', -1.2, 1.1, -2.6, L(13) - 0.6, 0.01);
    k.move('haze', 3.0, L(13) - 0.8, 1);
    k.aim('left', -0.4, 1.0, -2.6, L(13) + 2.5, 1.6, 'sine');
    k.aim('right', 0.4, 1.0, -2.6, L(13) + 2.5, 1.6, 'sine');
    // Old Zhao lies down: one cold beam stays on the place in the grass.
    const p = { x: 0.85 + 0.25, z: -1.5 };
    k.place('ray', 1.6, 3.2, -1.2, L(17) + 1);
    k.aim('ray', p.x, 0.1, p.z, L(17) + 1, 0.01);
    tl.set('ray.r', 0.75, L(17) + 1).set('ray.g', 0.85, L(17) + 1).set('ray.b', 1, L(17) + 1);
    k.look(L(17) + 1.4, 2, { ray: 0.55 });
    k.look(S('pre2') - 0.5, 1.6, { ray: 0 });
    // The bridge: a pencil beam of moonlight falls from the moon onto the fallen.
    k.place('ray', 1.75, 1.6, -2.95, br);
    k.aim('ray', 0.2, 0.6, -2.55, br, 0.01);
    tl.set('ray.r', 0.78, br).set('ray.g', 0.86, br).set('ray.b', 1, br);
    k.look(br + 1, 2, { ray: 0.85 });
    k.move('haze', 2.8, br, 2);
    k.look(sw, 1.4, { ray: 0 });
    // The swell: the side beams sweep up out of the marsh on the downbeats.
    k.move('haze', 3.2, sw, 2);
    k.downbeats(sw, c3).forEach((b, i) => {
      k.aim('left', i % 2 ? 1.2 : -0.6, 1.8, -2.6, b, 1.2, 'sine');
      k.aim('right', i % 2 ? -1.2 : 0.6, 1.8, -2.6, b, 1.2, 'sine');
    });
    // The final chorus: both beams rise toward the sun. A gold shaft falls on Shitou.
    k.aim('left', -1.25, 1.4, -3.3, c3, 2.4);
    k.aim('right', -1.0, 1.6, -3.3, c3 + 0.4, 2.4);
    const shaft = at(c3);
    k.place('ray', shaft.x, 3.4, shaft.z + 0.2, c3 - 0.4);
    k.aim('ray', shaft.x, 0, shaft.z, c3 - 0.4, 0.01);
    tl.set('ray.r', 1, c3 - 0.4).set('ray.g', 0.8, c3 - 0.4).set('ray.b', 0.5, c3 - 0.4);
    k.look(c3, 1.2, { ray: 0.6 });
    k.look(E('ch3') - 1.5, 2.5, { ray: 0 });
    k.move('haze', 1.4, E('ch3') - 1, 3);
  }
}

const production: Production = {
  id: 'shanhe-wei-zheng',
  no: 5,
  title: { zh: '山河为证', en: 'Let the Land Bear Witness', id: 'Biar Tanah Air Menjadi Saksi' },
  poster: urls['./art/cut/poster.webp']!,
  audio,
  master,
  pieces,
  curtain: { open: 'traveller', close: 'traveller' },
  preroll: 7,
  postroll: 7,
  surtitles: { main: 'id', second: 'en' },
  bill: {
    about: 'A boy of sixteen joins the Long March of 1934 to 1935. He loses his comrades on the road. He sings the song in Mandarin.',
    cast: [['Shitou, a boy soldier', 'Voice'], ['His mother', 'On a slide'], ['Old Zhao, the squad leader', 'On a slide'], ['The fallen', 'On rods']],
    scenes: ['The Yudu River at night', 'The chain bridge', 'The snow mountain', 'The grassland', 'The north'],
  },
  voices: { shitou: { name: 'Shitou', color: '#e8d6b0' } },
  cues,
};

export default production;
