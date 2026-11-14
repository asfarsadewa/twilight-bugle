// 형 먼저 가 · Kak, Pergilah Dulu · Brother, Go First
// The cue sheet follows the take in song/master.json. Line numbers below are the sung lines.
// Heights (y) are above the stage floor. The stage opening is about 5.5 wide and 2.4 high. Depth runs to z = -4.
//
// June 1950, the monsoon. Two brothers walk south. At a bridge the younger one stays. Min and Cheol are
// marionettes. The village, the hills, the bridge and the gate fly in. The river is a wave machine of two rows.
// The refugees, the soldiers in the fog and Mother are cards on tin wires. Rain falls through the whole show.

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

const MIN = { x: -0.7, y: 0, z: -1.25 };
const CHEOL = { x: 0.55, y: 0, z: -1.3 };

const pieces: PieceSpec[] = [
  { id: 'sun', kind: 'prop', art: art('prop-sun'), width: 1.0, anchor: 'center', home: { x: 1.2, y: 1.55, z: -3.45 }, route: 'trap', rod: true, glow: 0.25, shadow: false },
  { id: 'hills', kind: 'flat', art: art('flat-hills'), width: 6.6, home: { x: 0, y: -0.2, z: -3.3 }, route: 'fly', startIn: true },
  { id: 'village', kind: 'flat', art: art('flat-village'), width: 5.6, home: { x: 0, y: -0.3, z: -3.0 }, route: 'fly', startIn: true },
  // The two sides, as in the film: told apart by their clothes, each line with one plain banner. No violence.
  { id: 'march', kind: 'flat', art: art('prop-march-a'), width: 3.2, home: { x: 0, y: 0, z: -1.7 }, route: 'right', slide: 'right' },
  { id: 'march2', kind: 'flat', art: art('prop-march-a'), width: 2.6, home: { x: 0, y: 0.32, z: -2.62 }, route: 'left', slide: 'left', mirror: true },
  { id: 'linea', kind: 'flat', art: art('prop-line-a'), width: 2.0, home: { x: 1.55, y: 0.12, z: -2.45 }, route: 'trap', rod: true },
  { id: 'gate', kind: 'flat', art: art('flat-gate'), width: 2.9, home: { x: 0.2, y: -0.05, z: -2.6 }, route: 'fly' },
  { id: 'boys', kind: 'prop', art: art('prop-boys'), height: 0.8, home: { x: 0.2, y: 0, z: -2.5 }, route: 'left', slide: 'left' },
  { id: 'bridge', kind: 'flat', art: art('flat-bridge'), width: 6.0, home: { x: 0.2, y: 0.15, z: -2.4 }, route: 'fly' },
  { id: 'far', kind: 'prop', art: art('prop-far'), height: 0.98, home: { x: 1.3, y: 0.1, z: -2.3 }, route: 'trap', rod: true },
  { id: 'waves2', kind: 'flat', art: art('flat-river'), width: 6.8, home: { x: 0.2, y: -1.05, z: -2.15 }, route: 'trap', rod: true, mirror: true },
  { id: 'refugees', kind: 'flat', art: art('flat-refugees'), width: 4.2, home: { x: 0, y: 0, z: -1.95 }, route: 'left', slide: 'left' },
  { id: 'lineb', kind: 'flat', art: art('prop-line-b'), width: 2.6, home: { x: -1.25, y: 0, z: -1.75 }, route: 'trap', rod: true },
  { id: 'mother', kind: 'prop', art: art('prop-mother'), height: 0.98, home: { x: -1.75, y: 0, z: -1.55 }, route: 'left', slide: 'left', startIn: true },
  { id: 'fire', kind: 'prop', art: art('prop-fire'), width: 1.0, home: { x: -1.55, y: 0, z: -1.6 }, route: 'trap', rod: true, glow: 0.3 },
  { id: 'waves1', kind: 'flat', art: art('flat-river'), width: 6.8, home: { x: -0.2, y: -1.42, z: -1.0 }, route: 'trap', rod: true },
  {
    id: 'cheol', kind: 'puppet', home: CHEOL, route: 'fly',
    puppet: {
      height: 1.04, faces: 'left',
      body: p(part('puppet-cheol', 1), [0.5, 1]),
      head: p(part('puppet-cheol', 0), [0.593, 0.896], { attach: [0.513, 0.05], z: -0.6, string: [0.5, 0.05] }, 0.75),
      armA: p(part('puppet-cheol', 2), [0.332, 0.089], { attach: [0.748, 0.115], z: 1, string: [0.6, 0.93] }),
      armB: p(part('puppet-cheol', 3), [0.871, 0.107], { attach: [0.278, 0.115], z: 1.1, string: [0.1, 0.75] }),
    },
  },
  {
    id: 'min', kind: 'puppet', home: MIN, route: 'fly',
    puppet: {
      height: 0.98, faces: 'right',
      body: p(part('puppet-min', 0), [0.5, 1]),
      head: p(part('puppet-min', 1), [0.439, 0.901], { attach: [0.624, 0.045], z: -0.6, string: [0.5, 0.05] }, 0.75),
      // The sheet has two left arms. The open arm hangs from the left shoulder. The fist arm is mirrored into a right
      // arm and hangs from the right shoulder, with the fist across his waist.
      armA: p(part('puppet-min', 2), [0.733, 0.08], { attach: [0.352, 0.087], z: 1, string: [0.3, 0.95] }),
      armB: p(part('puppet-min', 3), [0.357, 0.114], { attach: [0.89, 0.087], z: 1.1, mirror: true, string: [0.85, 0.8] }),
    },
  },
];

// ---------------------------------------------------------------- the cue sheet

function cues({ tl, section, line }: CueContext) {
  const k = cueKit(tl, master);
  const L = (n: number) => line(n).start;
  const S = (id: string) => section(id).start;
  const E = (id: string) => section(id).end;
  const end = master.duration;
  tl.signal('min.sing', master.vox!.fps, master.vox!.min ?? []);
  tl.signal('cheol.sing', master.vox!.fps, master.vox!.cheol ?? []);

  const sky = (t: number, dur: number, top: number, hz: number, bot: number, levels: [number, number, number] = [0.55, 0.55, 0.4], hzY = 0.16) => {
    k.look(t, dur, { cycTop: [levels[0], top], cycHz: [levels[1], hz], cycBot: [levels[2], bot] });
    k.move('cycHz.y', hzY, t, dur);
  };
  const PREDAWN = [0x161c26, 0x3a4450, 0x10141a] as const;
  const RAIN = [0x4a525c, 0x8a929a, 0x3a4048] as const;
  const FOG = [0x6a7078, 0xa8adb2, 0x5a6066] as const;
  const NIGHT = [0x0a0e16, 0x1a2230, 0x080a10] as const;
  const DAWN = [0x5a6472, 0xc8b8a0, 0x7a7a78] as const;
  const CLEAR = [0x6a86a8, 0xf2d6a6, 0xd8ccb8] as const;
  const HOME = [0x2a2c3a, 0xd89a6a, 0x3a3236] as const;

  const hop = (id: string, t: number, dur: number) => tl.hold(`${id}.hop`, t).to(`${id}.hop`, 1, t, 0.2).hold(`${id}.hop`, t + dur).to(`${id}.hop`, 0, t + dur, 0.2);
  const face = (id: string, t: number, turned: boolean) => tl.hold(`${id}.turn`, t).to(`${id}.turn`, turned ? 1 : 0, t, 0.6);
  const walk = (id: string, t: number, dur: number, x: number, e: 'inOut' | 'out' | 'in' | 'linear' = 'inOut') => {
    k.move(`${id}.x`, x, t, dur, e);
    if (dur > 0.1) hop(id, t, dur);
  };
  const rock = (id: string, from: number, to: number, amp: number, period: number) => {
    for (let t = from, i = 0; t < to - period / 2; t += period / 2, i++) k.move(`${id}.x`, i % 2 ? amp : -amp, t, period / 2, 'sine');
    k.move(`${id}.x`, 0, to - period / 2, period / 2, 'sine');
  };
  const follow = (x: number, z: number, t: number, dur = 0.8, level = 0.6, color = 0xe8eef4, y = 0.85) => {
    k.aim('follow', x, y, z, t, dur);
    k.look(t, dur, { follow: [level, color] });
  };
  const grey = (t: number, dur = 2, level = 1) => k.look(t, dur, {
    fohL: [0.2 * level, 0xd8e0e8], fohR: [0.18 * level, 0xc8d2dc], left: [0.1 * level, 0xb8c4d0], right: [0.1 * level, 0xc0c8d2],
    foot: 0.26 * level, back: [0.22 * level, 0xa8b8cc], ambient: 0.22 * level,
  });
  const rainAll = (t: number, rate: number, dur = 2) => {
    tl.set('rain.x0', -3.2, t).set('rain.x1', 3.2, t);
    k.move('rain.rate', rate, t, dur);
  };

  const c1 = L(6), v2 = L(10), br = L(14), c2 = L(18), ans = L(22), both = L(24), out = E('ch2');

  // ---- preroll: the house settles. The traveller hangs closed. The rain is already falling behind it.
  const P = -7;
  tl.set('curtain.style', curtainStyleIndex('traveller'), P);
  k.cam(P, 0.01, { x: 0, y: 0.95, z: 9.4, lx: 0, ly: 1.05, lz: -1, fov: 27 });
  k.look(P + 1, 3.5, { house: 0, fohL: 0.12, fohR: 0.1, foot: 0.9, ambient: 0.25 });
  k.aim('follow', 0, 1.0, -0.14, P);
  k.look(P + 3.5, 1.5, { follow: [0.5, 0xffe4bc] });
  tl.set('surtitles.i', 0, P);
  tl.base('haze', 1.6);
  tl.base('dust.i', 0);

  // ---- intro: rain before dawn. The village. Mother waits with the rice balls. The two come down on their strings.
  k.move('curtain.open', 1, 0.4, 4.6, 'inOut');
  sky(0, 3, ...PREDAWN, [0.35, 0.35, 0.25], 0.12);
  grey(0.4, 3, 0.55);
  k.look(0.4, 3, { lamp: [0.5, 0xffb070], follow: 0 });
  k.place('lamp', -1.75, 1.2, -1.45, 0);
  rainAll(0, 0.55, 3);
  k.enter('min', 3.5, 3, 'out');
  k.enter('cheol', 4.3, 3, 'out');
  follow(-1.4, -1.45, 6, 2, 0.45, 0xffe0c0);
  // Mother holds out the bundle. Min takes it.
  k.move('min.armB', 30, 10, 1.4);
  face('min', 7, true);
  k.move('min.head', -8, 10.5, 1.2);
  tl.base('mother.sway', 0).to('mother.sway', 0.3, 11, 1.4);
  k.cam(0.4, 16, { z: 8.0, ly: 1.05, x: -0.5, lx: -0.55 });

  // ---- verse 1: the road south. Refugees in the rain. Soldiers pass in the fog. Cheol takes Min's hand.
  tl.set('surtitles.i', 1, L(0) - 1);
  // 0 장마비 내리던 6월의 아침 — the morning comes up grey. Min turns from his mother.
  sky(L(0) - 1, 3, ...RAIN, [0.6, 0.6, 0.45], 0.16);
  grey(L(0) - 1, 3);
  k.look(L(0), 2, { lamp: 0 });
  k.move('min.armB', 0, L(0) + 0.5, 1.2);
  face('min', L(0) + 1.4, false);
  k.move('min.head', 6, L(0) + 2, 1.2);
  rainAll(L(0), 0.75, 2);
  // 1 우린 같은 길을 걸어 나서지 — the village goes. Mother stays behind. The refugees come along the road.
  k.leave('mother', L(1) - 0.6, 3.2, 'in');
  k.leave('village', L(1) - 0.2, 3.4, 'in');
  tl.set('refugees.x', -3.6, 0);
  k.enter('refugees', L(1) - 0.4, 1.6, 'out');
  k.move('refugees.x', 0.8, L(1) - 0.4, 15, 'linear');
  hop('refugees', L(1) - 0.4, 15);
  hop('min', L(1), 5);
  hop('cheol', L(1), 5);
  k.cam(L(1), 6, { z: 8.4, ly: 1.1, x: 0, lx: 0 });
  // 2 누가 친구고 누가 남인지 — a column of soldiers marches north through them, against the refugees.
  tl.set('march.x', 3.8, 0);
  k.enter('march', L(2) - 1, 1.4, 'out');
  k.move('march.x', -3.8, L(2) - 1, 16, 'linear');
  hop('march', L(2) - 1, 16);
  k.move('min.head', -6, L(2), 1);
  face('min', L(2) + 0.6, true);
  // 3 아무도 모르는 안개 속에서 — the fog comes down. Everything greys out.
  sky(L(3) - 0.5, 3, ...FOG, [0.6, 0.65, 0.5], 0.2);
  k.move('haze', 3.4, L(3) - 0.5, 3);
  grey(L(3), 3, 0.7);
  k.pop('march', false, L(2) + 15);
  face('min', L(3) + 1.6, false);
  // 4 떨리는 내 손을 네가 잡아줬지 — Cheol reaches out. Min's hand meets his.
  k.leave('refugees', L(4) - 1, 3, 'in');
  k.move('haze', 2, L(4), 3);
  grey(L(4), 2.5, 0.9);
  walk('cheol', L(4) - 0.6, 1.6, -0.2);
  k.move('cheol.armB', -38, L(4), 1.4, 'out');
  k.move('min.armB', 30, L(4) + 0.6, 1.2);
  k.move('min.head', 8, L(4) + 0.4, 1);
  follow(-0.1, -1.28, L(4), 1.2, 0.55, 0xf0e8dc);
  k.cam(L(4), 6, { z: 7.0, ly: 1.05, x: -0.1, lx: -0.1 });
  // 5 괜찮아 우린 형제니까
  k.move('cheol.head', -8, L(5), 1);
  k.move('min.head', 0, L(5) + 1, 1);

  // ---- chorus 1: the bridge over the swollen river. Min sends his hyung across. Cheol looks back once.
  k.move('cheol.armB', 0, c1 - 3, 1.2);
  k.move('min.armB', 0, c1 - 3, 1.2);
  k.enter('bridge', c1 - 3.2, 3.4, 'out');
  k.enter('waves2', c1 - 2.8, 2.6, 'out');
  k.enter('waves1', c1 - 2.6, 2.6, 'out');
  rock('waves1', c1 - 2.6, E('v2') + 2, 0.09, 2.6);
  rock('waves2', c1 - 2.2, E('v2') + 2, 0.08, 3.1);
  sky(c1 - 3, 3, ...RAIN, [0.6, 0.6, 0.45], 0.16);
  rainAll(c1 - 2, 0.9, 2);
  grey(c1 - 2, 2, 1.1);
  k.cam(c1 - 2, 6, { z: 8.2, ly: 1.1, x: 0, lx: 0 });
  // 6 형 먼저 가 — Min puts his hand on Cheol's back and pushes him on.
  k.move('min.armB', 45, L(6) - 0.2, 0.8, 'outBack');
  walk('min', L(6) - 0.4, 1, -0.45);
  follow(-0.25, -1.28, L(6) - 0.3, 0.6, 0.85, 0xfff0e0);
  // 7 이 다리는 내가 지키게 — Min takes the rope at the bridgehead. Cheol goes up onto the bridge.
  k.move('min.armB', 20, L(7) - 0.2, 1);
  walk('cheol', L(7), 5.5, 1.1);
  k.move('cheol.z', -0.75, L(7), 5.5);
  k.move('cheol.y', 0.32, L(7), 5.5);
  k.move('cheol.s', 0.82, L(7), 5.5);
  // The far-bank column marches past behind the crossing.
  tl.set('march2.x', -3.8, 0);
  k.pop('march2', true, L(7) - 1);
  k.move('march2.x', 3.8, L(7) - 1, 18, 'linear');
  hop('march2', L(7) - 1, 18);
  k.pop('march2', false, L(7) + 17);
  // 8 뒤돌아보지 말고 가 — Cheol looks back. Min waves him on.
  face('cheol', L(8) - 0.2, true);
  k.move('cheol.armB', -40, L(8), 1);
  k.move('min.armB', 70, L(8) + 0.6, 0.8, 'outBack');
  k.move('min.armB', 40, L(8) + 1.6, 0.6, 'sine');
  k.move('min.armB', 70, L(8) + 2.4, 0.6, 'sine');
  k.cam(L(8) - 0.5, 5, { z: 7.4, ly: 1.15, x: 0.2, lx: 0.25 });
  // 9 꼭 살아서 집에 가 — Cheol turns away and goes into the rain.
  face('cheol', L(9) - 0.4, false);
  k.move('cheol.armB', 0, L(9) - 0.4, 1);
  walk('cheol', L(9), 4, 2.6, 'in');
  k.leave('cheol', L(9) + 3.4, 1.6, 'in');
  k.move('min.armB', 20, L(9) + 1, 1.2);
  k.move('min.head', -10, L(9) + 2, 1.6);
  follow(-0.95, -1.25, L(9) + 1, 2, 0.6);

  // ---- interlude and verse 2: night. A small fire. Min remembers. Shapes in the fog. He cuts the bridge down.
  sky(E('ch1') + 1, 4, ...NIGHT, [0.4, 0.35, 0.25], 0.1);
  grey(E('ch1') + 1, 4, 0.45);
  rainAll(E('ch1') + 1, 0.6, 3);
  k.enter('fire', E('ch1') + 2, 2.4, 'out');
  k.move('fire.glow', 0.6, E('ch1') + 3, 2);
  k.look(E('ch1') + 2.5, 2.5, { lamp: [0.8, 0xff9a50] });
  k.place('lamp', -1.55, 0.35, -1.45, E('ch1') + 2);
  walk('min', E('ch1') + 2.5, 2.4, -0.25);
  face('min', E('ch1') + 2.2, true);
  k.cam(E('ch1') + 3, 6, { z: 7.4, ly: 0.95, x: -0.6, lx: -0.7 });
  // 10 엄마가 싸 준 주먹밥 한쪽 — he holds his hand to his chest by the fire.
  k.move('min.armB', -30, v2, 1.4);
  k.move('min.head', -12, v2 + 0.4, 1.4);
  follow(-1.1, -1.4, v2, 1.2, 0.5, 0xffc890, 0.6);
  // 11 너에게 건네던 그 밤을 기억해 — the memory: the two as boys, side by side, behind him in the firelight.
  tl.set('boys.x', -1.0, 0);
  k.enter('boys', L(11) - 0.4, 2, 'out');
  k.move('boys.glow', 0.15, L(11), 2);
  k.leave('boys', L(12) - 0.6, 2, 'in');
  // 12 누군가는 남아야 한다면 — a line of soldiers rises out of the fog behind him, on his side of the river.
  k.move('haze', 3.2, L(12) - 1, 2);
  k.enter('lineb', L(12) - 0.4, 4.5, 'out');
  k.downbeats(L(12), L(13) + 3).forEach((b, i) => k.flash('back', b + 0.3, i % 2 ? 0.5 : 0.85, 0.3, 0.03, 0.6));
  face('min', L(12), false);
  walk('min', L(12), 1.4, -0.4);
  k.move('min.armB', 0, L(12), 1);
  k.move('min.head', 8, L(12) + 0.4, 1);
  k.leave('fire', L(12) + 1, 2, 'in');
  k.cam(L(12), 6, { z: 7.8, ly: 1.1, x: 0, lx: 0 });
  // 13 그게 나라서 다행이야 — he cuts the rope. The bridge falls into the river.
  k.move('min.armB', 70, L(13) - 0.6, 0.5, 'out');
  k.move('min.armB', -20, L(13) - 0.1, 0.25, 'in');
  k.flash('fohL', L(13) + 0.1, 0.9, 0.25, 0.02, 0.4);
  k.move('bridge.rz', -7, L(13) + 0.1, 2.8, 'in');
  k.move('bridge.y', -1.7, L(13) + 0.4, 3, 'in');
  k.move('min.armB', 0, L(13) + 2, 1.4);
  k.move('min.head', -14, L(13) + 2.4, 1.6);

  // ---- bridge: Min alone at the broken bridgehead, in one cold beam. Far off, his hyung crosses the dawn.
  k.pop('bridge', false, br - 1);
  tl.set('bridge.y', 0, br - 0.9).set('bridge.rz', 0, br - 0.9);
  k.look(br - 1, 2, { fohL: 0.05, fohR: 0.04, left: 0.03, right: 0.03, back: 0.14, ambient: 0.1, lamp: 0 });
  follow(MIN.x + -0.4, MIN.z, br - 1, 2, 0.6, 0xd8e2f0);
  k.cam(br - 1, 8, { z: 7.0, ly: 1.05, x: -0.8, lx: -0.9 });
  // 14 비에 젖은 이름을 가슴에 품고 — his hand goes to his heart.
  k.move('min.armB', -30, br, 1.6);
  k.move('min.head', -12, br + 0.4, 1.4);
  // 15 한 걸음씩 새벽을 건너가 — far upstage, small against the hills, Cheol walks on into the first grey light.
  // He walks in front of the hills and high above the far wave row, so nothing hides him.
  sky(L(15) - 1, 4, ...PREDAWN, [0.45, 0.55, 0.3], 0.13);
  k.look(L(15) - 0.5, 3, { cycHz: [0.6, 0x8a8a90], back: [0.22, 0xb8c4d8] });
  for (const [ch, v] of [['cheol.x', -2.7], ['cheol.y', 0.82], ['cheol.z', -1.55], ['cheol.s', 0.5], ['cheol.armA', 0], ['cheol.armB', 0], ['cheol.head', 0]] as const) tl.set(ch, v, L(15) - 2);
  face('cheol', L(15) - 2, true);
  k.enter('cheol', L(15) - 1, 1.6, 'out');
  walk('cheol', L(15) - 0.6, 13, 2.2, 'linear');
  k.leave('cheol', L(17) + 1, 1.8, 'in');
  k.move('min.armB', 0, L(15), 1.4);
  k.move('min.head', 10, L(15) + 0.4, 1.4);
  k.cam(L(15) - 0.5, 9, { z: 8.2, ly: 1.15, x: 0, lx: 0 });
  // 16 네가 돌아올 길을 남겨둘게 — the gate of home comes down in the mist behind the river, its lantern lit.
  // Small and far, a vision in the mist. The outro brings it back full size.
  tl.set('gate.s', 0.55, L(16) - 2).set('gate.x', 1.25, L(16) - 2).set('gate.y', 0.55, L(16) - 2).set('gate.z', -0.6, L(16) - 2);
  k.enter('gate', L(16) - 1, 4, 'out');
  k.move('gate.glow', 0.25, L(16), 3);
  k.look(L(16), 3, { lamp: [0.6, 0xffb060] });
  k.place('lamp', 1.2, 1.3, -2.45, L(16) - 1);
  // 17 고향의 문은 열려 있으니 — he looks at it a long time. Then the mist takes it.
  k.move('min.head', 4, L(17), 1.4);
  k.leave('gate', c2 - 2.6, 2.6, 'in');
  k.look(c2 - 2.4, 2, { lamp: 0 });

  // ---- final chorus: grey dawn. Cheol stands on the far bank in olive drab. Min stands before the khaki line.
  sky(c2 - 1.5, 3, ...DAWN, [0.6, 0.65, 0.45], 0.16);
  grey(c2 - 1, 2.4, 1.05);
  rainAll(c2 - 1, 0.95, 1.6);
  k.move('haze', 2.6, c2 - 1, 2);
  face('min', c2 - 1, false);
  k.cam(c2, 6, { z: 8.4, ly: 1.1, x: 0, lx: 0 });
  // 18 형 먼저 가 / 19 이 다리는 내가 지키게
  k.move('min.armB', 55, L(18), 1, 'outBack');
  follow(-0.4, -1.25, L(18), 0.8, 0.75);
  k.move('min.armB', 20, L(19), 1);
  // 20 뒤돌아보지 말고 가 — the far bank: a line in olive drab rises out of the river mist. Cheol stands with them.
  k.enter('linea', L(20) - 1.2, 3.6, 'out');
  k.enter('far', L(20) - 0.8, 3.2, 'out');
  k.move('min.head', 12, L(20) + 1, 1.2);
  // 21 꼭 살아서 집에 가
  k.move('min.armB', 70, L(21), 1.2, 'outBack');
  k.cam(L(21), 4, { z: 7.6, ly: 1.15, x: 0.3, lx: 0.4 });
  // 22 비가 그치면 날 찾아줘 — Cheol answers from across the river.
  follow(1.3, -2.3, ans - 0.4, 1, 0.75, 0xe8eef8);
  k.move('far.glow', 0.12, ans, 2);
  k.move('min.armB', 30, ans + 1, 1.2);
  k.cam(ans - 0.5, 6, { z: 7.4, ly: 1.2, x: 0.6, lx: 0.8 });
  // 23 우린 다시 고향에서 만나
  k.move('min.head', 6, L(23), 1);
  // 24 both — the rain stops. One shaft of light falls across the river onto both of them.
  rainAll(both - 0.5, 0, 3.5);
  k.move('haze', 1.6, both, 3);
  sky(both, 4, ...CLEAR, [0.7, 0.85, 0.55], 0.2);
  k.enter('sun', both - 0.5, 4, 'out');
  k.look(both, 3, { fohL: [0.3, 0xfff0d8], fohR: [0.26, 0xfff4e8], left: [0.18, 0xffd8a8], right: [0.18, 0xffe8c8], foot: 0.4, back: [0.2, 0xffd8a0], ambient: 0.3 });
  follow(0.4, -1.8, both, 2, 0.55, 0xfff0d8, 0.8);
  k.move('min.armB', 0, both + 2, 1.6);
  k.cam(both, 6, { z: 8.4, ly: 1.15, x: 0, lx: 0 });

  // ---- outro: home. The gate stands open with its lantern. Mother waits. Two boys walk in, hand in hand.
  k.leave('far', out + 1, 3, 'in');
  k.leave('linea', out + 1.3, 3, 'in');
  k.leave('lineb', out + 1.6, 3, 'in');
  k.leave('min', out + 2, 3, 'in');
  k.leave('waves1', out + 1.5, 2.6, 'in');
  k.leave('waves2', out + 1.8, 2.6, 'in');
  k.leave('sun', out + 2, 3, 'in');
  k.leave('hills', out + 3, 3, 'in');
  k.enter('village', out + 3.5, 3.4, 'out');
  tl.set('gate.s', 1, out).set('gate.x', 0, out).set('gate.y', 0, out).set('gate.z', 0, out).set('gate.glow', 0, out);
  k.enter('gate', out + 4, 3.4, 'out');
  sky(out + 3, 5, ...HOME, [0.5, 0.65, 0.4], 0.12);
  k.look(out + 3, 4, { fohL: [0.14, 0xffd8b0], fohR: [0.12, 0xe8c8b0], left: 0.06, right: 0.06, foot: 0.2, back: [0.14, 0xffb880], ambient: 0.16, follow: 0, lamp: [0.8, 0xffb060] });
  k.place('lamp', 1.2, 1.3, -2.45, out + 3);
  k.move('gate.glow', 0.18, out + 5, 3);
  tl.set('mother.x', 1.0, out);
  k.enter('mother', out + 6, 3, 'out');
  face('mother', out + 5, true);
  tl.set('boys.x', -3.4, out).set('boys.glow', 0, out);
  k.pop('boys', true, out + 9);
  walk('boys', out + 9, 12, 0.2, 'out');
  follow(0.2, -2.5, out + 12, 4, 0.55, 0xffe0c0, 0.6);
  k.move('boys.s', 0.85, out + 16, 6);
  k.cam(out + 3, 14, { z: 8.0, ly: 1.05, x: 0.2, lx: 0.25 });

  // ---- the end: the traveller closes. In the curtain call Min and Cheol bow together.
  tl.set('surtitles.i', 0, end - 3.6);
  k.cam(end - 4.8, 4.2, { z: 9.4, x: 0, lx: 0, y: 0.95, ly: 1.05 });
  k.move('curtain.open', 0, end - 3.8, 3.4, 'inOut');
  k.look(end - 1, 2, { follow: 0, house: 0.25, lamp: 0 });
  for (const [ch, v] of [['min.x', 0.25], ['min.z', 0.75], ['min.head', 0], ['min.armA', 0], ['min.armB', 0], ['min.turn', 0], ['cheol.x', -0.95], ['cheol.y', 0], ['cheol.s', 1], ['cheol.z', 0.8], ['cheol.head', 0], ['cheol.armA', 0], ['cheol.armB', 0], ['cheol.turn', 0]] as const) k.move(ch, v, end - 1.9, 0.01);
  k.pop('min', true, end + 1);
  k.pop('cheol', true, end + 1);
  k.move('curtain.open', 0.5, end + 0.8, 1.6, 'out');
  k.look(end + 0.6, 0.8, { follow: [0.7, 0xffe6c4] });
  k.aim('follow', 0, 1.0, -0.5, end + 0.5, 0.01);
  k.move('min.rz', -18, end + 2.4, 0.5);
  k.move('cheol.rz', 18, end + 2.4, 0.5);
  k.move('min.rz', 0, end + 3, 0.5);
  k.move('cheol.rz', 0, end + 3, 0.5);
  k.move('curtain.open', 0, end + 4.2, 1.8, 'inOut');
  k.look(end + 4.6, 1.5, { follow: 0, house: 0.7 });

  spotlights();

  // ---- the spotlight play. Written last, so at the same moment it wins over the washes above.
  function spotlights() {
    // The fog on the road: two pale side beams cut through it.
    k.aim('left', 0.6, 1.1, -2.2, L(2), 0.01);
    k.aim('right', -0.4, 1.1, -2.2, L(2), 0.01);
    // The bridge: a cold shaft on the bridgehead where Min stands.
    k.place('ray', -1.4, 3.4, -1.0, c1 - 1);
    k.aim('ray', -0.5, 0, -1.3, c1 - 1, 0.01);
    tl.set('ray.r', 0.8, c1 - 1).set('ray.g', 0.88, c1 - 1).set('ray.b', 1, c1 - 1);
    k.look(L(7), 1.5, { ray: 0.3 });
    k.look(E('ch1') + 1, 2, { ray: 0 });
    // The bridge section: one beam straight down on him.
    k.place('ray', -1.1, 3.6, -1.25, br - 1.2);
    k.aim('ray', -1.1, 0, -1.25, br - 1.2, 0.01);
    k.look(br - 0.6, 1.6, { ray: 0.38 });
    k.move('haze', 2.8, br - 1, 2);
    k.look(c2 - 0.8, 1.4, { ray: 0 });
    // The last line: the shaft falls between the two banks.
    k.place('ray', 0.4, 3.6, -1.6, both - 0.5);
    k.aim('ray', 0.4, 0, -1.8, both - 0.5, 0.01);
    tl.set('ray.r', 1, both - 0.5).set('ray.g', 0.88, both - 0.5).set('ray.b', 0.66, both - 0.5);
    k.look(both + 0.5, 2.4, { ray: 0.32 });
    k.look(out + 2, 3, { ray: 0 });
  }
}

const production: Production = {
  id: 'hyeong',
  no: 8,
  title: { zh: '哥，你先走', en: 'Brother, Go First', id: 'Kak, Pergilah Dulu', ko: '형 먼저 가' },
  poster: urls['./art/cut/poster.webp']!,
  audio,
  master,
  pieces,
  curtain: { open: 'traveller', close: 'traveller' },
  preroll: 7,
  postroll: 7,
  surtitles: { main: 'ko', second: 'id' },
  bill: {
    about: 'June 1950, in the monsoon rain. Two brothers walk south with the refugees. At a bridge, the younger one stays to hold it. Min sings the song in Korean.',
    cast: [['Min', 'Voice'], ['Cheol, his hyung', 'Voice'], ['Their mother', 'On a slide'], ['The road', 'On slides']],
    scenes: ['The village at dawn', 'The road south', 'The bridge', 'The night fire', 'The open gate'],
  },
  voices: { min: { name: 'Min', color: '#e8e0d0' }, cheol: { name: 'Cheol', color: '#c8d4e4' }, both: { name: 'Min · Cheol', color: '#f0e4c8' } },
  cues,
};

export default production;
