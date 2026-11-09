// 少年回声 · Gema Masa Remaja · Echoes of Youth
// The cue sheet follows the take in song/master.json. Line numbers below are the sung lines.
// Heights (y) are above the stage floor. The stage opening is about 5.5 wide and 2.4 high. Depth runs to z = -4.
//
// A grown man comes back to the court of his old school with the tin box he and his friends buried at fourteen.
// The cards look like a schoolboy's ballpoint and coloured pencil drawing on exercise paper. Xiaoyu and the boy he
// was are marionettes. The city, the school, the corridor and the station fly in. The court, the plane tree, the
// desk and the floodlight rise on rods. The friends, the bicycles and the green train are cards on tin wires.

import type { Art, CueContext, Master, PartSpec, PieceSpec, Production } from '../../theatre/src/core/types.ts';
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

// ---------------------------------------------------------------- cast and scenery

// A part's sheet size sets its scale. The painter drew the heads large, so a head takes a smaller one.
const p = (a: Art, pivot: [number, number], rest: Partial<PartSpec> = {}, scale = 1): PartSpec => ({ art: a, sheet: [a.w * scale, a.h * scale], pivot, ...rest });

const MAN = { x: -0.35, y: 0, z: -1.15 };
const TREE = { x: -1.75, z: -2.55 };

const pieces: PieceSpec[] = [
  { id: 'sun', kind: 'prop', art: art('prop-sun'), width: 0.85, anchor: 'center', home: { x: 1.7, y: 1.7, z: -3.45 }, route: 'trap', rod: true, glow: 0.3, shadow: false },
  { id: 'clouds', kind: 'prop', art: art('prop-clouds'), width: 4.2, anchor: 'center', home: { x: 0, y: 1.95, z: -3.35 }, route: 'fly', strings: [[0.2, 0.2], [0.8, 0.2]], shadow: false },
  { id: 'city', kind: 'flat', art: art('flat-city'), width: 5.8, home: { x: 0, y: -0.2, z: -3.2 }, route: 'fly', glow: 0.1, startIn: true },
  { id: 'school', kind: 'flat', art: art('flat-school'), width: 5.8, home: { x: 0, y: -0.15, z: -3.1 }, route: 'fly' },
  { id: 'station', kind: 'flat', art: art('flat-station'), width: 5.8, home: { x: 0, y: -0.15, z: -3.05 }, route: 'fly' },
  { id: 'corridor', kind: 'flat', art: art('flat-corridor'), width: 5.8, home: { x: 0, y: -0.15, z: -3.0 }, route: 'fly' },
  // The court is painted with the school and the plane trees behind it, so it is the backdrop of the court scenes.
  { id: 'court', kind: 'flat', art: art('flat-court'), width: 6.8, home: { x: 0, y: -0.5, z: -2.95 }, route: 'trap', rod: true },
  { id: 'tree', kind: 'flat', art: art('flat-tree'), width: 2.4, home: { x: TREE.x, y: -0.05, z: TREE.z }, route: 'trap', rod: true },
  { id: 'tin', kind: 'prop', art: art('prop-tin'), width: 0.42, home: { x: TREE.x + 0.45, y: 0, z: TREE.z + 0.15 }, route: 'trap', rod: true },
  { id: 'train', kind: 'prop', art: art('prop-train'), width: 4.2, home: { x: 0, y: 0, z: -2.3 }, route: 'right', slide: 'right', glow: 0.1 },
  { id: 'bikes', kind: 'prop', art: art('prop-bikes'), width: 2.3, home: { x: 0, y: 0, z: -2.1 }, route: 'left', slide: 'left' },
  { id: 'light', kind: 'prop', art: art('prop-light'), height: 2.0, home: { x: 2.15, y: 0, z: -2.0 }, route: 'trap', rod: true, glow: 0.3, startIn: true, shadow: false },
  { id: 'boysrun', kind: 'prop', art: art('prop-boys-run'), width: 1.9, home: { x: 0, y: 0, z: -1.9 }, route: 'left', slide: 'left' },
  { id: 'fall', kind: 'prop', art: art('prop-fall'), height: 0.62, home: { x: 0.6, y: 0, z: -1.75 }, route: 'trap', rod: true },
  { id: 'girl', kind: 'prop', art: art('prop-girl'), height: 0.95, home: { x: -0.6, y: 0, z: -1.6 }, route: 'left', slide: 'left' },
  { id: 'reunion', kind: 'prop', art: art('prop-reunion'), height: 1.15, home: { x: 1.0, y: 0, z: -1.55 }, route: 'right', slide: 'right' },
  {
    id: 'boy', kind: 'puppet', home: { x: 0.6, y: 0, z: -1.3 }, route: 'left',
    puppet: {
      height: 0.74, faces: 'right',
      body: p(part('puppet-boy', 1), [0.5, 1]),
      head: p(part('puppet-boy', 0), [0.51, 0.912], { attach: [0.541, 0.05], z: -0.6, string: [0.5, 0.05] }, 0.7),
      armA: p(part('puppet-boy', 3), [0.83, 0.065], { attach: [0.283, 0.1], z: 1, string: [0.3, 0.85] }, 0.85),
      armB: p(part('puppet-boy', 2), [0.132, 0.45], { attach: [0.816, 0.106], z: 1.1, rest: -40, string: [0.65, 0.1] }, 0.85),
    },
  },
  { id: 'desk', kind: 'prop', art: art('prop-desk'), width: 1.05, home: { x: -1.05, y: 0, z: -1.05 }, route: 'trap', rod: true },
  {
    id: 'man', kind: 'puppet', home: MAN, route: 'fly',
    puppet: {
      height: 1.02, faces: 'right',
      body: p(part('puppet-man', 1), [0.5, 1]),
      head: p(part('puppet-man', 0), [0.577, 0.907], { attach: [0.494, 0.045], z: -0.6, string: [0.5, 0.05] }, 0.72),
      // His right arm with the open hand hangs on the far side. His left arm holds the old tin.
      armA: p(part('puppet-man', 3), [0.813, 0.063], { attach: [0.135, 0.094], z: 1, string: [0.3, 0.95] }),
      armB: p(part('puppet-man', 2), [0.27, 0.09], { attach: [0.875, 0.095], z: 1.1, string: [0.5, 0.9] }),
    },
  },
];

// ---------------------------------------------------------------- the cue sheet

function cues({ tl, section, line }: CueContext) {
  const k = cueKit(tl, master);
  const L = (n: number) => line(n).start;
  const E = (id: string) => section(id).end;
  const end = master.duration;
  tl.signal('man.sing', master.vox!.fps, master.vox!.xiaoyu ?? []);

  const sky = (t: number, dur: number, top: number, hz: number, bot: number, levels: [number, number, number] = [0.7, 0.75, 0.5], hzY = 0.16) => {
    k.look(t, dur, { cycTop: [levels[0], top], cycHz: [levels[1], hz], cycBot: [levels[2], bot] });
    k.move('cycHz.y', hzY, t, dur);
  };
  const CITY = [0x0a0e1e, 0x1e2a48, 0x0a0c16] as const;
  const NOON = [0x6e9cc4, 0xf0e0b0, 0xd8c8a0] as const;
  const GOLD = [0x7a8fb0, 0xf6c070, 0xe0b880] as const;
  const DEEP = [0x2a4a88, 0x8fb4cf, 0xd8c098] as const;
  const DUSK = [0x3a3a6a, 0xf08a50, 0x8a5a50] as const;
  const NIGHT = [0x0c1430, 0x1c2a4c, 0x0a0e1a] as const;
  const DAWN = [0x5a78a8, 0xffd08a, 0xf0d0a0] as const;

  const hop = (id: string, t: number, dur: number) => tl.hold(`${id}.hop`, t).to(`${id}.hop`, 1, t, 0.2).hold(`${id}.hop`, t + dur).to(`${id}.hop`, 0, t + dur, 0.2);
  const face = (id: string, t: number, turned: boolean) => tl.hold(`${id}.turn`, t).to(`${id}.turn`, turned ? 1 : 0, t, 0.6);
  const walk = (id: string, t: number, dur: number, x: number, e: 'inOut' | 'out' | 'in' | 'linear' = 'inOut') => {
    k.move(`${id}.x`, x, t, dur, e);
    if (dur > 0.1) hop(id, t, dur);
  };
  /** A card crosses the stage on its wire and goes. */
  const cross = (id: string, t: number, dur: number, from: number, to: number) => {
    tl.set(`${id}.x`, from, t);
    k.pop(id, true, t);
    k.move(`${id}.x`, to, t, dur, 'linear');
    hop(id, t, dur);
    k.pop(id, false, t + dur);
  };
  const follow = (x: number, z: number, t: number, dur = 0.8, level = 0.6, color = 0xfff0dc, y = 0.85) => {
    k.aim('follow', x, y, z, t, dur);
    k.look(t, dur, { follow: [level, color] });
  };
  const day = (t: number, dur = 1.6, level = 1) => k.look(t, dur, {
    fohL: [0.34 * level, 0xfff0d8], fohR: [0.3 * level, 0xfff4e8], left: [0.16 * level, 0xffe0b8], right: [0.16 * level, 0xfff0d8],
    foot: 0.4 * level, back: [0.18 * level, 0xffe0b0], ambient: 0.3 * level,
  });
  const night = (t: number, dur = 2) => k.look(t, dur, { fohL: [0.08, 0x9aa8d8], fohR: [0.07, 0x8f9fd0], left: 0.04, right: 0.04, back: [0.22, 0x8fa8e0], foot: 0.15, ambient: 0.12 });

  const c1 = L(8), v2 = L(16), c2 = L(24), br = L(32), c3 = L(36), out = E('ch3');

  // ---- preroll: the house settles. The traveller hangs closed.
  const P = -7;
  tl.set('curtain.style', curtainStyleIndex('traveller'), P);
  k.cam(P, 0.01, { x: 0, y: 0.95, z: 9.4, lx: 0, ly: 1.05, lz: -1, fov: 27 });
  k.look(P + 1, 3.5, { house: 0, fohL: 0.12, fohR: 0.1, foot: 0.9, ambient: 0.25 });
  k.aim('follow', 0, 1.0, -0.14, P);
  k.look(P + 3.5, 1.5, { follow: [0.5, 0xffe4bc] });
  tl.set('surtitles.i', 0, P);
  tl.base('haze', 1.2);

  // ---- intro: night in the city. One floodlight flickers on over the dark court. Xiaoyu comes down with the tin.
  k.move('curtain.open', 1, 0.4, 4.4, 'inOut');
  sky(0, 3, ...CITY, [0.4, 0.4, 0.3], 0.1);
  night(0.4, 3);
  k.move('stars.i', 0.5, 0, 3);
  k.move('city.glow', 0.25, 0, 3);
  k.place('lamp', 2.15, 2.0, -1.9, 0);
  [5.2, 5.5, 5.65, 6.4].forEach((t, i) => k.flash('lamp', t, i === 3 ? 0.9 : 0.6, 0, 0.02, i === 3 ? 0.01 : 0.12));
  k.look(6.5, 1, { lamp: [0.9, 0xfff0d8] });
  k.move('light.glow', 0.35, 6.4, 0.2);
  k.enter('man', 7, 3, 'out');
  follow(MAN.x, MAN.z, 9, 2, 0.45, 0xe8ecff);
  k.move('man.head', -10, 12, 1.5);
  k.cam(0.4, 16, { z: 8.0, ly: 1.05, x: 0.2, lx: 0.2 });

  // ---- verse 1: the desk. The school and the gold court. Sweets fall from a torn pocket. Tomorrow's homework.
  tl.set('surtitles.i', 1, L(0) - 1);
  // 0 木头课桌 — the old desk rises beside him.
  k.enter('desk', L(0) - 1, 1.6, 'out');
  face('man', L(0) - 0.6, true);
  // 1 刻满我们乱写的名字 — the scratched names catch the light.
  k.move('desk.glow', 0.22, L(1), 2);
  follow(-1.05, -1.05, L(1), 1, 0.5, 0xffe8c8, 0.5);
  // 2 放学以后 — the city goes. The school comes in. Afternoon.
  k.leave('city', L(2) - 1, 2.4, 'in');
  k.enter('school', L(2) - 0.6, 2.4, 'out');
  k.move('stars.i', 0, L(2) - 1, 2);
  sky(L(2) - 1, 2.4, ...NOON, [0.7, 0.75, 0.5], 0.18);
  day(L(2) - 0.6, 2);
  k.look(L(2), 1.5, { lamp: 0 });
  k.move('light.glow', 0, L(2), 1.5);
  k.move('desk.glow', 0, L(2), 1.5);
  face('man', L(2), false);
  k.move('man.head', 8, L(2) + 0.4, 1.2);
  // 3 球场尘土飞成一片金色 — the court comes up in gold dust. The plane tree rises.
  k.enter('court', L(3) - 0.8, 2.6, 'out');
  k.enter('tree', L(3) - 0.4, 2.6, 'out');
  k.enter('sun', L(3), 3.5, 'out');
  k.leave('school', L(3) + 1, 2.6, 'in');
  k.leave('desk', L(3) + 0.4, 2.2, 'in');
  sky(L(3), 3, ...GOLD, [0.75, 0.85, 0.55], 0.18);
  k.look(L(3), 2.5, { fohL: [0.34, 0xffd8a0], fohR: [0.28, 0xffe0b0], left: [0.24, 0xffc070], back: [0.24, 0xffb060] });
  k.move('dust.i', 1.4, L(3), 3);
  k.cam(L(3), 6, { z: 8.4, ly: 1.12, x: 0, lx: 0 });
  // 4 口袋破了 — the boy he was runs in.
  tl.set('boy.x', -3.8, 0);
  k.pop('boy', true, L(4) - 1.4);
  walk('boy', L(4) - 1.3, 2.2, 0.15, 'out');
  follow(0.75, -1.3, L(4) - 0.2, 1, 0.55);
  // 5 糖纸和小小的梦掉了一地 — sweet wrappers and small dreams fall around him.
  tl.set('glints.x0', 0.3, L(5)).set('glints.x1', 1.3, L(5));
  k.move('glints.rate', 0.45, L(5) - 0.2, 0.8);
  k.move('glints.rate', 0, L(5) + 3.2, 1.2);
  k.move('boy.head', -10, L(5), 0.8);
  // 6 那时以为 / 7 长大就在明天的习题里 — the boy looks up at the sky. The man watches him.
  k.move('boy.head', 12, L(6), 1);
  k.move('man.head', -4, L(7), 1.2);

  // ---- chorus 1: the boys run with the ball. Ah Hao falls and laughs. Morning to dusk. The tin goes into the earth.
  day(c1, 1.2);
  sky(c1, 2, ...GOLD, [0.8, 0.9, 0.6], 0.2);
  // 8 少年的回声在胸口翻腾
  cross('boysrun', c1 - 0.3, 4.4, -3.6, 3.8);
  k.move('man.head', 10, c1, 1);
  // 9 一喊你的名字 天空都变得更深 — he calls a name. The sky deepens.
  k.move('man.armA', -50, L(9), 1.1, 'outBack');
  sky(L(9), 3, ...DEEP, [0.85, 0.85, 0.55], 0.24);
  k.move('man.armA', 0, L(9) + 3, 1.2);
  // 10 奔跑的我们从不问远近 — the boys run again, the boy with them.
  cross('boysrun', L(10) - 0.4, 4.2, -3.6, 3.8);
  walk('boy', L(10) - 0.2, 2.8, 2.0, 'in');
  // 11 摔伤了膝盖 却笑着说不疼 — Ah Hao falls, holds his knee, and laughs.
  k.enter('fall', L(11) - 0.2, 0.7, 'out');
  k.move('fall.rz', -6, L(11) + 0.5, 0.35, 'sine');
  k.move('fall.rz', 5, L(11) + 0.85, 0.35, 'sine');
  k.move('fall.rz', 0, L(11) + 1.2, 0.35, 'sine');
  follow(0.6, -1.75, L(11), 0.6, 0.65, 0xfff0d8, 0.4);
  k.leave('fall', L(12) - 0.3, 1, 'in');
  // 12 那些没有答案的清晨黄昏 — morning, then dusk, in one breath.
  sky(L(12), 1.6, ...NOON, [0.8, 0.8, 0.55], 0.22);
  sky(L(12) + 1.8, 2.4, ...DUSK, [0.7, 0.8, 0.5], 0.14);
  k.look(L(12) + 1.8, 2.4, { fohL: [0.26, 0xffb890], fohR: [0.2, 0xd8a0c0], left: [0.24, 0xff9060], back: [0.3, 0xff9050] });
  k.leave('sun', L(12) + 1.6, 2.4, 'in');
  // 13 原来是给未来的自己一封信 — the boy buries the tin of letters at the foot of the plane tree.
  tl.set('boy.x', -2.2, L(13) - 2);
  face('boy', L(13) - 2, false);
  walk('boy', L(13) - 1.2, 1.6, -1.6);
  k.enter('tin', L(13), 0.6, 'out');
  k.move('tin.glow', 0.3, L(13), 0.6);
  k.leave('tin', L(13) + 1.4, 1.4, 'in');
  k.move('boy.head', -14, L(13), 0.8);
  follow(TREE.x + 0.4, TREE.z, L(13) - 0.3, 0.8, 0.7, 0xffd8a8, 0.4);
  // 14 少年的回声 — the man's hand goes to his chest.
  k.move('man.armA', 34, L(14) - 0.3, 1.2);
  k.move('man.head', 0, L(14), 1);
  follow(MAN.x, MAN.z, L(14) - 0.3, 1, 0.7);
  k.cam(L(14) - 0.5, 5, { z: 7.2, ly: 1.12, x: -0.2, lx: -0.25 });
  // 15 还在心里合唱不停
  k.move('man.armA', 0, E('ch1') + 0.4, 1.4);
  walk('boy', E('ch1'), 3, -3.8, 'in');
  k.pop('boy', false, E('ch1') + 3);

  // ---- verse 2: the old corridor. Chalk dust into the clouds. Lin Na at the window. The blank envelope. Jiayou.
  k.leave('court', v2 - 3, 2.4, 'in');
  k.leave('tree', v2 - 3.2, 2.4, 'in');
  k.enter('corridor', v2 - 2.6, 2.6, 'out');
  // The floodlight belongs to the court. It sinks while the scene is elsewhere.
  k.leave('light', v2 - 3, 2.2, 'in');
  sky(v2 - 3, 3, ...NOON, [0.55, 0.6, 0.4], 0.18);
  k.look(v2 - 3, 3, { fohL: [0.26, 0xf0f0ff], fohR: [0.24, 0xe8ecff], left: [0.12, 0xe0e8ff], right: [0.18, 0xfff0d8], back: [0.16, 0xd8e4ff], foot: 0.34, ambient: 0.26 });
  walk('man', v2 - 2.4, 2.4, -1.5);
  k.cam(v2 - 2, 5, { z: 8, ly: 1.1, x: 0, lx: 0 });
  // 17 脚步踏出回荡的节奏 — the boy walks the corridor on the beat.
  tl.set('boy.x', -3.8, v2 - 1);
  face('boy', v2 - 1, false);
  k.pop('boy', true, v2 - 0.4);
  walk('boy', L(17) - 1.2, 4, -0.1, 'linear');
  follow(-0.3, -1.3, L(17) - 0.5, 3, 0.55);
  // 18 黑板粉尘 — white chalk dust drifts down.
  tl.set('snow.x0', -2.4, L(18) - 1).set('snow.x1', 2.4, L(18) - 1);
  k.move('snow.rate', 0.4, L(18) - 0.6, 1.2);
  // 19 飞在窗外柔软的云后 — the clouds come down and take the dust.
  k.enter('clouds', L(19) - 0.4, 2.6, 'out');
  tl.base('clouds.sway', 0.3);
  k.move('snow.rate', 0, L(19) + 3, 2.4);
  // 20 偷偷喜欢 — Lin Na comes in and stands by the window. He turns to her.
  tl.set('girl.x', -3.2, 0);
  k.enter('girl', L(20) - 1.4, 1.8, 'out');
  k.move('girl.x', 0, L(20) - 1.4, 2, 'out');
  hop('girl', L(20) - 1.4, 1.8);
  face('boy', L(20) - 0.2, true);
  k.move('boy.x', 0.15, L(20), 0.8);
  follow(-0.2, -1.45, L(20), 1, 0.7, 0xffe8d8);
  k.cam(L(20), 4, { z: 7.1, ly: 1.0, x: -0.2, lx: -0.25 });
  // 21 连信封都不敢写完整 — he holds out the blank envelope, then takes it back.
  k.move('boy.armA', -48, L(21) - 0.2, 1.1, 'out');
  k.move('boy.head', -10, L(21) + 0.4, 0.8);
  k.move('boy.armA', -10, L(21) + 2.4, 1);
  // 22 一句“加油” — one word. He lifts his hand.
  k.move('boy.armB', 55, L(22) - 0.1, 0.7, 'outBack');
  k.move('boy.head', 8, L(22), 0.7);
  tl.base('girl.sway', 0).to('girl.sway', 0.4, L(22), 0.8);
  // 23 就当成永远的约定
  k.move('boy.armB', 0, L(23) + 1.6, 1);
  k.move('boy.armA', 0, L(23) + 1.6, 1);
  k.look(L(23), 2.4, { cycHz: [0.75, 0xf6c070] });

  // ---- chorus 2: the three ride their bicycles home at dusk, past the court.
  k.leave('corridor', c2 - 1.8, 2.2, 'in');
  k.leave('clouds', c2 - 1.4, 2, 'in');
  k.leave('girl', c2 - 1.4, 1.6, 'in');
  k.enter('court', c2 - 1.4, 2.4, 'out');
  k.enter('tree', c2 - 1, 2.4, 'out');
  k.enter('light', c2 - 1, 2.2, 'out');
  face('boy', c2 - 1.4, false);
  walk('boy', c2 - 1.4, 2, 3.6, 'in');
  k.pop('boy', false, c2 + 0.6);
  walk('man', c2 - 1, 2.2, 0.1);
  sky(c2 - 1.4, 2.4, ...GOLD, [0.8, 0.9, 0.6], 0.2);
  day(c2 - 1, 2);
  k.cam(c2, 6, { z: 8.4, ly: 1.15, x: 0, lx: 0 });
  // 24 / 25 — the bicycles come by.
  cross('bikes', L(24) - 0.2, 6.5, -3.8, 3.9);
  k.move('man.head', 10, L(25), 1);
  // 26 奔跑的我们 / 27 摔伤了膝盖 — the boys run once more.
  cross('boysrun', L(26) - 0.4, 4.2, -3.6, 3.8);
  // 28 清晨黄昏 — the dusk comes and stays.
  sky(L(28), 3.5, ...DUSK, [0.75, 0.85, 0.5], 0.13);
  k.look(L(28), 3, { fohL: [0.24, 0xffb890], fohR: [0.18, 0xd8a0c0], left: [0.24, 0xff9060], right: 0.1, back: [0.32, 0xff9050], foot: 0.3, ambient: 0.22 });
  // 29 一封信 — the bicycles ride back the other way, smaller, going home.
  cross('bikes', L(29) - 0.6, 6.5, 3.9, -3.8);
  // 30 少年的回声 — he steps into the last light.
  walk('man', L(30) - 0.4, 1.6, 0.3);
  k.move('man.armA', 34, L(30), 1.2);
  follow(MAN.x + 0.3, MAN.z, L(30), 1, 0.7);
  k.move('man.armA', 0, E('ch2'), 1.4);
  k.cam(L(30), 5, { z: 7.4, ly: 1.15, x: 0, lx: 0 });

  // ---- bridge: night at the station. The green train takes Ah Hao away. The court lights up in the dark.
  k.leave('court', br - 2.4, 2.2, 'in');
  k.leave('tree', br - 2.2, 2.2, 'in');
  k.enter('station', br - 2, 2.6, 'out');
  k.leave('light', br - 2.4, 2, 'in');
  sky(br - 2.2, 3, ...NIGHT, [0.45, 0.4, 0.3], 0.1);
  k.move('stars.i', 0.7, br - 1.6, 3);
  night(br - 2.2, 2.4);
  k.move('station.glow', 0.25, br - 1, 2);
  k.place('lamp', 0, 1.8, -2.6, br - 2);
  k.look(br - 1, 2, { lamp: [0.6, 0xffc070] });
  walk('man', br - 2, 2.2, -1.5);
  // 32 是谁先学会 不再轻易流泪 — the boy waits on the platform, his head down.
  tl.set('boy.x', 0.1, br - 2).set('boy.head', 0, br - 2).set('boy.armA', 0, br - 2).set('boy.armB', 0, br - 2);
  face('boy', br - 2, false);
  k.pop('boy', true, br - 1);
  k.move('boy.head', -16, br, 1.4);
  follow(0.7, -1.3, br, 1.2, 0.55, 0xd8e0ff);
  k.cam(br, 6, { z: 7.6, ly: 1.05, x: 0.3, lx: 0.35 });
  // 33 是谁先走远 连背影都追不回 — the green train pulls out with Ah Hao at the window. The boy runs after it.
  tl.set('train.x', -1.2, 0);
  k.enter('train', L(33) - 1.6, 1.4, 'out');
  k.move('train.x', 4.6, L(33) - 0.2, 6.4, 'in');
  hop('train', L(33) - 0.2, 6.2);
  k.pop('train', false, L(33) + 6.2);
  k.move('boy.head', 10, L(33), 0.8);
  walk('boy', L(33) + 0.4, 3.2, 2.0, 'out');
  k.move('boy.armB', 70, L(33) + 0.8, 1, 'outBack');
  k.move('boy.armB', 0, L(34) - 0.8, 1.2);
  k.move('boy.head', -14, L(34) - 0.4, 1.2);
  // 34 但你看 每当夜太黑 — the darkest moment. Only the boy is lit, far off.
  k.leave('station', L(34) - 0.6, 2.4, 'in');
  k.look(L(34), 1.6, { fohL: 0.03, fohR: 0.03, back: 0.12, ambient: 0.07, lamp: 0 });
  follow(2.6, -1.3, L(34), 1.2, 0.5, 0xd0d8ff);
  // 35 心里却亮起 一整片操场的光辉 — the court rises out of the dark and shines. The floodlight blazes.
  k.enter('court', L(35) - 0.8, 2.6, 'out');
  k.move('court.glow', 0.42, L(35), 2.4);
  k.enter('light', L(35) - 1, 1.6, 'out');
  k.move('light.glow', 0.4, L(35), 0.6);
  k.look(L(35), 2.4, { foot: 0.5, back: [0.4, 0xffd890], lamp: [1, 0xfff0d8] });
  k.place('lamp', 2.15, 2.0, -1.9, L(35) - 1);
  tl.set('glints.x0', -2.6, L(35)).set('glints.x1', 2.6, L(35));
  k.move('glints.rate', 0.35, L(35) + 0.4, 2);
  walk('boy', L(35), 2.4, 3.8, 'in');
  k.pop('boy', false, L(35) + 2.4);
  face('man', L(35), false);
  walk('man', L(35), 2, 0);
  k.move('man.head', 14, L(35) + 0.4, 1.2);

  // ---- final chorus: the gold court. He opens the tin. The boys run round him. The boy he was walks on beside him.
  k.move('court.glow', 0, c3 + 1, 2.6);
  k.move('stars.i', 0, c3, 2);
  k.enter('tree', c3 - 1, 2.4, 'out');
  k.enter('sun', c3 - 0.8, 3.5, 'out');
  sky(c3 - 0.6, 2.6, ...GOLD, [0.85, 0.95, 0.62], 0.22);
  day(c3 - 0.6, 2.2, 1.15);
  k.look(c3, 2, { lamp: 0 });
  k.move('light.glow', 0, c3, 2);
  k.cam(c3, 5, { z: 8.4, ly: 1.15, x: 0, lx: 0 });
  // 36 此刻被唤醒 — the tin rises open at the foot of the tree, its letters glowing.
  k.enter('tin', c3 - 0.4, 1.4, 'out');
  k.move('tin.glow', 0.45, c3, 2);
  follow(TREE.x + 0.45, TREE.z, c3, 1, 0.75, 0xffe8c0, 0.35);
  tl.set('glints.x0', -2.4, c3).set('glints.x1', -0.8, c3);
  k.move('glints.rate', 0.5, c3, 1.6);
  cross('boysrun', c3 + 0.4, 4.2, -3.6, 3.8);
  // 37 一路上的伤疤都盛开成风景 — Ah Hao falls and laughs, once more.
  k.enter('fall', L(37) - 0.2, 0.7, 'out');
  k.move('fall.rz', -6, L(37) + 0.5, 0.35, 'sine');
  k.move('fall.rz', 0, L(37) + 0.85, 0.35, 'sine');
  k.leave('fall', L(38) - 0.3, 1, 'in');
  // 38 跌跌撞撞唱成一首歌 — Lin Na waves from the edge of the court.
  tl.set('girl.x', -0.9, L(38) - 1);
  k.enter('girl', L(38) - 0.4, 1.4, 'out');
  // 39 唱给那个倔强又莽撞的自己 — the boy he was comes to him. They look at each other.
  tl.set('boy.x', 3.6, L(39) - 2).set('boy.head', 0, L(39) - 2).set('boy.armA', 0, L(39) - 2).set('boy.armB', 0, L(39) - 2);
  face('boy', L(39) - 2, true);
  k.pop('boy', true, L(39) - 1.6);
  walk('boy', L(39) - 1.6, 2.4, 0.1, 'out');
  face('man', L(39) + 0.4, false);
  follow(0.3, -1.25, L(39), 1, 0.7);
  k.cam(L(39), 4, { z: 7, ly: 1.05, x: 0.2, lx: 0.2 });
  // 40 就算世界再喧哗忧郁 — the light goes grey for a moment.
  k.look(L(40), 1.4, { fohL: 0.16, fohR: 0.14, left: 0.08, right: 0.08 });
  sky(L(40), 1.6, ...DUSK, [0.6, 0.6, 0.45], 0.14);
  // 41 我仍听见最初那一声回应 — the boy calls to him. The gold comes back.
  k.move('boy.armB', 60, L(41), 0.8, 'outBack');
  k.move('boy.armB', 20, L(41) + 1, 0.5, 'sine');
  k.move('boy.armB', 60, L(41) + 1.5, 0.5, 'sine');
  sky(L(41), 2, ...DAWN, [0.85, 0.95, 0.62], 0.22);
  day(L(41), 1.8, 1.15);
  // 42 少年的回声 — side by side.
  face('boy', L(42) - 0.5, false);
  walk('boy', L(42) - 0.5, 1.2, -0.3);
  k.move('boy.armB', -10, L(42), 0.8);
  k.move('man.armA', -18, L(42), 0.8);
  // 43 带我向前 一步又一步前行 — the two walk forward together, step by step.
  k.move('man.z', 0.45, L(43), 3.4, 'inOut');
  k.move('boy.z', 0.45, L(43), 3.4, 'inOut');
  hop('man', L(43), 3.4);
  hop('boy', L(43), 3.4);
  follow(0, -0.75, L(43), 2.4, 0.8);
  k.cam(L(43), 4, { z: 7.6, ly: 1.1, x: 0, lx: 0 });

  // ---- outro: the memory goes. Night. The floodlight. His old friends walk onto the court, grown up.
  k.leave('girl', out, 2, 'in');
  face('boy', out + 1, true);
  walk('boy', out + 1, 2.6, 3.6, 'in');
  k.pop('boy', false, out + 3.6);
  k.move('glints.rate', 0, out, 2.4);
  k.leave('tin', out + 1.6, 2, 'in');
  k.leave('sun', out + 1.6, 2.6, 'in');
  sky(out + 1.6, 4, ...CITY, [0.45, 0.45, 0.32], 0.1);
  night(out + 1.6, 4);
  k.move('stars.i', 0.6, out + 2, 3);
  k.look(out + 2.4, 2, { lamp: [1, 0xfff0d8] });
  k.place('lamp', 2.15, 2.0, -1.9, out + 2);
  k.move('light.glow', 0.35, out + 2.4, 1);
  k.move('man.z', 0, out + 2, 2.4);
  walk('man', out + 2, 2.4, -0.4);
  k.move('man.armA', 0, out + 2, 1);
  follow(MAN.x - 0.4, MAN.z, out + 3, 1.6, 0.6, 0xe8ecff);
  // Two grown men walk on from the right. One holds a basketball. He turns to them, and they wave.
  tl.set('reunion.x', 3.6, 0);
  k.pop('reunion', true, out + 6);
  k.move('reunion.x', 0.35, out + 6, 6, 'out');
  hop('reunion', out + 6, 5.8);
  face('man', out + 7, false);
  k.move('man.head', 10, out + 8, 1.2);
  k.move('man.armA', -60, out + 11.5, 1.2, 'outBack');
  k.move('man.armA', -30, out + 13, 0.6, 'sine');
  k.move('man.armA', -60, out + 13.6, 0.6, 'sine');
  follow(0.3, -1.35, out + 8, 3, 0.8, 0xfff0dc);
  k.move('reunion.glow', 0.12, out + 12, 3);
  k.cam(out + 3, 14, { z: 7.8, ly: 1.1, x: 0.25, lx: 0.3 });

  // ---- the end: the traveller closes. In the curtain call Xiaoyu and the boy bow.
  tl.set('surtitles.i', 0, end - 3.6);
  k.cam(end - 4.8, 4.2, { z: 9.4, x: 0, lx: 0, y: 0.95, ly: 1.05 });
  k.move('curtain.open', 0, end - 3.8, 3.4, 'inOut');
  k.look(end - 1, 2, { follow: 0, house: 0.25, lamp: 0 });
  k.pop('man', false, end - 2);
  k.pop('reunion', false, end - 2);
  for (const [ch, v] of [['man.x', -0.15], ['man.z', 0.65], ['man.head', 0], ['man.armA', 0], ['man.armB', 0], ['man.turn', 0], ['boy.x', -0.6], ['boy.z', 0.75], ['boy.head', 0], ['boy.armA', 0], ['boy.armB', 0], ['boy.turn', 1]] as const) k.move(ch, v, end - 1.9, 0.01);
  k.move('curtain.open', 0.5, end + 0.8, 1.6, 'out');
  k.pop('man', true, end + 1);
  k.pop('boy', true, end + 1);
  k.look(end + 0.6, 0.8, { follow: [0.7, 0xffe6c4] });
  k.aim('follow', 0, 1.0, -0.5, end + 0.5, 0.01);
  k.move('man.rz', -18, end + 2.4, 0.5);
  k.move('boy.rz', 18, end + 2.4, 0.5);
  k.move('man.rz', 0, end + 3, 0.5);
  k.move('boy.rz', 0, end + 3, 0.5);
  k.move('curtain.open', 0, end + 4.2, 1.8, 'inOut');
  k.look(end + 4.6, 1.5, { follow: 0, house: 0.7 });

  spotlights();

  // ---- the spotlight play. Written last, so at the same moment it wins over the washes above.
  function spotlights() {
    // The floodlight's beam falls on the dark court.
    k.place('ray', 2.15, 2.0, -1.9, 0);
    k.aim('ray', 0.2, 0, -1.4, 0, 0.01);
    tl.set('ray.r', 1, 0).set('ray.g', 0.96, 0).set('ray.b', 0.86, 0);
    k.look(6.4, 0.3, { ray: 0.32 });
    k.look(L(2), 1.5, { ray: 0 });
    // The gold court: two side beams cross through the dust.
    k.aim('left', 0.8, 0.9, -2.2, L(3), 0.01);
    k.aim('right', -0.6, 0.9, -2.2, L(3), 0.01);
    k.move('haze', 2.2, L(3), 3);
    k.move('haze', 1.2, c1 - 1, 3);
    // The station: one cold shaft on the boy.
    k.place('ray', 0.7, 3.4, -1.0, br - 0.6);
    k.aim('ray', 0.7, 0, -1.3, br - 0.6, 0.01);
    tl.set('ray.r', 0.78, br - 0.6).set('ray.g', 0.86, br - 0.6).set('ray.b', 1, br - 0.6);
    k.look(br, 1.2, { ray: 0.3 });
    k.move('haze', 2.6, br, 2);
    k.look(L(35), 1, { ray: 0 });
    // The night court lights up: the floodlight's beam again.
    k.place('ray', 2.15, 2.0, -1.9, L(35) - 0.5);
    k.aim('ray', 0.2, 0, -1.4, L(35) - 0.5, 0.01);
    tl.set('ray.r', 1, L(35) - 0.5).set('ray.g', 0.96, L(35) - 0.5).set('ray.b', 0.86, L(35) - 0.5);
    k.look(L(35), 0.3, { ray: 0.35 });
    k.look(c3, 1.6, { ray: 0 });
    k.move('haze', 1.3, c3, 2);
    // The outro: the floodlight again, over the reunion.
    k.look(out + 2.4, 0.3, { ray: 0.32 });
    k.look(end - 1, 1.4, { ray: 0 });
  }
}

const production: Production = {
  id: 'shaonian-huisheng',
  no: 9,
  title: { zh: '少年回声', en: 'Echoes of Youth', id: 'Gema Masa Remaja' },
  poster: urls['./art/cut/poster.webp']!,
  audio,
  master,
  pieces,
  curtain: { open: 'traveller', close: 'traveller' },
  preroll: 7,
  postroll: 7,
  surtitles: { main: 'zh', second: 'id' },
  bill: {
    about: 'A grown man comes back to the basketball court of his old school. He opens the tin box of letters he and his friends buried at fourteen. Xiaoyu sings the song in Mandarin.',
    cast: [['Xiaoyu', 'Voice'], ['Young Xiaoyu', 'On strings'], ['Ah Hao, Da Wei', 'On slides'], ['Lin Na', 'On a slide']],
    scenes: ['The city at night', 'The school court', 'The old corridor', 'The station', 'The court lights'],
  },
  voices: { xiaoyu: { name: 'Xiaoyu', color: '#e8e0c8' } },
  cues,
};

export default production;
