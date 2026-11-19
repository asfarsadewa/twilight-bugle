// ふるさとが見える · I Can See Home · Kampung Halaman Terlihat · 看得见故乡
// The cue sheet follows the producer's Suno recording (song/master.json). Line numbers below are the sung lines.
// Heights (y) are above the stage floor. The stage opening is about 5.5 wide and 2.4 high. Depth runs to z = -4.
//
// Meiji Japan. Hana crosses the snowy pass at twelve to reel silk in the valley mill. At sixteen the cough comes and
// the mill sends her home on a door board. Her brother Kichi carries her up the pass through the night. At dawn on the
// summit she sees home, and she dies there. In spring the youngest sister crosses the same pass. The cards are printed
// as Meiji nishiki-e woodblocks. Hana and Kichi are marionettes. The pair on the pass is one puppet with two heads.

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

// Pieces that travel have their home at x = 0 and y = 0, so their x and y moves read as stage positions.
const HANA = { x: 0, y: 0, z: -1.2 };
const KICHI = { x: 0, y: 0, z: -1.16 };
const CARRY = { x: 0, y: 0, z: -1.3 };
// The slope of the pass climbs from the left to the summit at the right. SUMMIT is where the pair stands at the top.
const SUMMIT = { x: 1.9, y: 1.04 };
// The path up the slope, from the foot to the summit, as painted on flat-slope.
const PATH: [number, number][] = [[1.26, 0.21], [0.97, 0.36], [1.4, 0.57], [1.74, 0.78], [SUMMIT.x, SUMMIT.y]];
// Hana's reel at the mill. Her thread runs from its hub to her hand.
const REEL = { x: 0.6, y: 1.0, z: -1.45 };

const reel = (id: string, x: number, y: number, z: number, width: number): PieceSpec =>
  ({ id, kind: 'prop', art: art('prop-reel'), width, anchor: 'center', home: { x, y, z }, route: 'fly', strings: [[0.5, 0.02]] });

const pieces: PieceSpec[] = [
  { id: 'sun', kind: 'prop', art: art('prop-sun'), width: 0.7, anchor: 'center', home: { x: -1.7, y: 1.75, z: -3.55 }, route: 'trap', rod: true, glow: 0.35, shadow: false },
  { id: 'clouds', kind: 'prop', art: art('prop-clouds'), width: 5.4, anchor: 'center', home: { x: 0, y: 2.05, z: -3.45 }, route: 'fly', strings: [[0.15, 0.25], [0.5, 0.2], [0.85, 0.25]], shadow: false },
  { id: 'range', kind: 'flat', art: art('flat-range'), width: 6.4, home: { x: 0, y: -0.2, z: -3.3 }, route: 'trap', rod: true, startIn: true },
  { id: 'girls', kind: 'flat', art: art('flat-girls'), width: 2.6, home: { x: 0, y: 0, z: -3.0 }, route: 'left', slide: 'left' },
  { id: 'cedars', kind: 'flat', art: art('flat-cedars'), width: 6.8, home: { x: 0, y: -1.72, z: -2.78 }, route: 'trap', rod: true },
  { id: 'farmhouse', kind: 'flat', art: art('flat-farmhouse'), width: 1.9, home: { x: -1.45, y: 0, z: -2.6 }, route: 'trap', rod: true },
  { id: 'mother', kind: 'prop', art: art('prop-mother'), height: 0.86, home: { x: 0, y: 0, z: -1.32 }, route: 'left', slide: 'left' },
  { id: 'mill', kind: 'flat', art: art('flat-mill'), width: 6.2, home: { x: 0, y: 0, z: -2.75 }, route: 'fly' },
  reel('reel1', -2.0, 1.75, -2.5, 0.5),
  reel('reel2', -1.0, 1.75, -2.5, 0.5),
  reel('reel3', 1.0, 1.75, -2.5, 0.5),
  reel('reel4', 2.0, 1.75, -2.5, 0.5),
  { id: 'reelers', kind: 'flat', art: art('flat-reelers'), width: 4.6, home: { x: 0, y: -0.12, z: -2.25 }, route: 'trap', rod: true },
  { id: 'bell', kind: 'prop', art: art('prop-bell'), height: 0.75, home: { x: 0, y: 0, z: -2.0 }, route: 'right', slide: 'right' },
  { id: 'slope', kind: 'flat', art: art('flat-slope'), width: 4.8, home: { x: 0.2, y: -0.6, z: -1.9 }, route: 'trap', rod: true },
  // The home valley comes up in front at the lower left: seen from the summit, it lies below.
  { id: 'valley', kind: 'flat', art: art('flat-valley'), width: 2.8, home: { x: -1.25, y: -0.05, z: -1.55 }, route: 'trap', rod: true },
  { id: 'gate', kind: 'flat', art: art('flat-gate'), height: 2.0, home: { x: -1.3, y: 0, z: -1.7 }, route: 'fly' },
  {
    id: 'myreel', kind: 'puppet', home: REEL, route: 'fly',
    puppet: { height: 0.5, faces: 'right', life: 0, body: p(art('prop-reel'), [0.5, 0.5]) },
  },
  { id: 'thread', kind: 'ribbon', home: { x: 0, z: 0 }, route: 'fly', tether: { from: { piece: 'myreel', part: 'body', point: [0.5, 0.5] }, to: { piece: 'hana', part: 'armA', point: [0.5, 0.93] }, color: 0xf2efe6, width: 0.012, sag: 0.04 } },
  { id: 'redthread', kind: 'ribbon', home: { x: 0, z: 0 }, route: 'fly', tether: { from: { piece: 'myreel', part: 'body', point: [0.5, 0.5] }, to: { piece: 'hana', part: 'armA', point: [0.5, 0.93] }, color: 0xc8283a, width: 0.016, sag: 0.1 } },
  { id: 'lamp', kind: 'prop', art: art('prop-lamp'), height: 0.42, home: { x: 0, y: 0, z: -1.05 }, route: 'right', slide: 'right', glow: 0.3 },
  { id: 'porters', kind: 'prop', art: art('prop-porters'), width: 1.7, home: { x: 0, y: 0, z: -1.28 }, route: 'right', slide: 'right' },
  { id: 'yuki', kind: 'prop', art: art('prop-yuki'), height: 0.62, home: { x: 0, y: 0, z: -1.1 }, route: 'left', slide: 'left' },
  { id: 'hanasit', kind: 'prop', art: art('prop-hana-sit'), height: 0.6, home: { x: SUMMIT.x - 0.42, y: SUMMIT.y - 0.02, z: -1.24 }, route: 'fly', strings: [[0.5, 0.05]], mirror: true },
  {
    id: 'carry', kind: 'puppet', home: CARRY, route: 'right',
    puppet: {
      height: 1.05, faces: 'right',
      body: p(part('puppet-carry', 1), [0.5, 1]),
      // His head turns. Her head rests on his shoulder and lifts a little: it rides in the arm slot.
      head: p(part('puppet-carry', 0), [0.454, 0.894], { attach: [0.739, 0.088], z: 0.6, string: [0.5, 0.05] }, 0.62),
      armA: p(part('puppet-carry', 2), [0.375, 0.876], { attach: [0.473, 0.051], z: 0.5, string: [0.5, 0.05] }, 0.58),
    },
  },
  {
    id: 'kichi', kind: 'puppet', home: KICHI, route: 'right',
    puppet: {
      height: 0.9, faces: 'left',
      body: p(part('puppet-kichi', 1), [0.5, 1]),
      head: p(part('puppet-kichi', 0), [0.514, 0.897], { attach: [0.56, 0.036], z: -0.6, string: [0.5, 0.05] }, 0.72),
      // Each arm hangs on the side where the painter drew it. He faces left, so a negative angle reaches forward.
      armA: p(part('puppet-kichi', 3), [0.71, 0.081], { attach: [0.314, 0.127], z: 1.1, string: [0.4, 0.92] }),
      armB: p(part('puppet-kichi', 2), [0.322, 0.081], { attach: [0.793, 0.127], z: 1, string: [0.6, 0.92] }),
    },
  },
  {
    id: 'hana', kind: 'puppet', home: HANA, route: 'left',
    puppet: {
      height: 0.9, faces: 'right',
      body: p(part('puppet-hana', 1), [0.5, 1]),
      head: p(part('puppet-hana', 0), [0.442, 0.88], { attach: [0.527, 0.028], z: -0.6, string: [0.5, 0.05] }, 0.7),
      // Each arm hangs on the side where the painter drew it. armA is the far arm, which draws the thread.
      armA: p(part('puppet-hana', 2), [0.308, 0.064], { attach: [0.817, 0.068], z: 1, string: [0.55, 0.92] }),
      armB: p(part('puppet-hana', 3), [0.701, 0.067], { attach: [0.236, 0.068], z: 1.1, string: [0.45, 0.92] }),
    },
  },
];

// ---------------------------------------------------------------- the cue sheet

function cues({ tl, section, line }: CueContext) {
  const k = cueKit(tl, master);
  const L = (n: number) => line(n).start;
  const E = (id: string) => section(id).end;
  const end = master.duration;
  tl.signal('hana.sing', master.vox!.fps, master.vox!.hana ?? []);
  tl.signal('kichi.sing', master.vox!.fps, master.vox!.kichi ?? []);
  tl.signal('carry.sing', master.vox!.fps, master.vox!.kichi ?? []);

  const sky = (t: number, dur: number, top: number, hz: number, bot: number, levels: [number, number, number] = [0.6, 0.6, 0.45], hzY = 0.16) => {
    k.look(t, dur, { cycTop: [levels[0], top], cycHz: [levels[1], hz], cycBot: [levels[2], bot] });
    k.move('cycHz.y', hzY, t, dur);
  };
  const NIGHT = [0x0a1428, 0x1c2c4a, 0x0a1020] as const;
  const SNOWNIGHT = [0x1a2440, 0x44567a, 0x1a2236] as const;
  const DAWN = [0x4a5a80, 0xf0c8a0, 0xd8c0b0] as const;
  const DAY = [0x7a9cc0, 0xeef0f0, 0xd8dce0] as const;
  const SPRING = [0x86a8c8, 0xf4e8d8, 0xe0d8c8] as const;
  const MILL = [0x2a2018, 0x5a4030, 0x201810] as const;
  const DREAM = [0x2a3458, 0xc89870, 0x3a3048] as const;

  const hop = (id: string, t: number, dur: number) => tl.hold(`${id}.hop`, t).to(`${id}.hop`, 1, t, 0.2).hold(`${id}.hop`, t + dur).to(`${id}.hop`, 0, t + dur, 0.2);
  const face = (id: string, t: number, turned: boolean) => tl.hold(`${id}.turn`, t).to(`${id}.turn`, turned ? 1 : 0, t, 0.6);
  const walk = (id: string, t: number, dur: number, x: number, e: 'inOut' | 'out' | 'in' | 'linear' = 'inOut') => {
    k.move(`${id}.x`, x, t, dur, e);
    if (dur > 0.1) hop(id, t, dur);
  };
  /** Climb: x and y together along the path, in short steps with a stagger. */
  const climb = (id: string, t: number, steps: [number, number][], each: number) => {
    steps.forEach(([x, y], i) => {
      k.move(`${id}.x`, x, t + i * each, each * 0.9, 'inOut');
      k.move(`${id}.y`, y, t + i * each, each * 0.9, 'inOut');
      k.move(`${id}.rz`, i % 2 ? -3 : 3, t + i * each, each * 0.5, 'sine');
    });
    k.move(`${id}.rz`, 0, t + steps.length * each, 0.6);
    hop(id, t, steps.length * each);
  };
  const follow = (x: number, z: number, t: number, dur = 0.8, level = 0.6, color = 0xfff0dc, y = 0.85) => {
    k.aim('follow', x, y, z, t, dur);
    k.look(t, dur, { follow: [level, color] });
  };
  const night = (t: number, dur = 2, level = 1) => k.look(t, dur, {
    fohL: [0.14 * level, 0x9aaee0], fohR: [0.12 * level, 0x90a4d8], left: [0.08 * level, 0x8098d0], right: [0.08 * level, 0x8098d0],
    back: [0.28 * level, 0x9ab4e8], foot: 0.2 * level, ambient: 0.16 * level,
  });
  const day = (t: number, dur = 2, level = 1, warm = 0xfff4e8) => k.look(t, dur, {
    fohL: [0.34 * level, warm], fohR: [0.3 * level, 0xffffff], left: [0.16 * level, 0xffe8d0], right: [0.16 * level, warm],
    back: [0.2 * level, 0xffe8c8], foot: 0.4 * level, ambient: 0.3 * level,
  });
  const mill = (t: number, dur = 2) => k.look(t, dur, {
    fohL: [0.26, 0xffd8a8], fohR: [0.22, 0xffc890], left: [0.18, 0xffb070], right: [0.14, 0xffc890],
    back: [0.2, 0xff9850], foot: 0.36, ambient: 0.22,
  });
  const snow = (t: number, rate: number, dur = 2, x0 = -3.2, x1 = 3.2) => {
    tl.set('snow.x0', x0, t).set('snow.x1', x1, t);
    k.move('snow.rate', rate, t, dur);
  };
  /** The far farmhouse lamp: the theatre's warm practical in the valley. */
  const homeLamp = (t: number, level: number, x = -1.35, y = 0.45, z = -2.45, dur = 1.6) => {
    k.place('lamp', x, y, z, t);
    k.look(t, dur, { lamp: [level, 0xffb860] });
  };
  /** The reels turn: a sixth of a turn a beat. */
  const spin = (from: number, to: number, beat: number, ids = ['reel1', 'reel2', 'reel3', 'reel4', 'myreel']) => {
    for (let t = from, i = 0; t < to; t += beat, i++) for (const id of ids) k.move(`${id}.rz`, -(i + 1) * 60, t, beat * 0.8, 'inOut');
  };
  /** A cough: the body jerks forward, the head drops. */
  const cough = (id: string, t: number) => {
    k.move(`${id}.rz`, -7, t, 0.12, 'out');
    k.move(`${id}.head`, -16, t, 0.12, 'out');
    k.move(`${id}.rz`, 0, t + 0.25, 0.5);
    k.move(`${id}.head`, -6, t + 0.25, 0.6);
  };

  const v2 = L(4), pre1 = L(8), c1 = L(10), v3 = L(15), v4 = L(20), pre2 = L(24), c2 = L(26), st = L(31), brk = L(37), c3 = L(39), c4 = L(44), out = L(47);
  const BEAT = 60 / master.bpm;

  // ---- preroll: the house settles. The traveller hangs closed.
  const P = -7;
  tl.set('curtain.style', curtainStyleIndex('traveller'), P);
  k.cam(P, 0.01, { x: 0, y: 0.95, z: 9.4, lx: 0, ly: 1.05, lz: -1, fov: 27 });
  k.look(P + 1, 3.5, { house: 0, fohL: 0.12, fohR: 0.1, foot: 0.9, ambient: 0.25 });
  k.aim('follow', 0, 1.0, -0.14, P);
  k.look(P + 3.5, 1.5, { follow: [0.5, 0xffe4bc] });
  tl.set('surtitles.i', 0, P);
  tl.base('haze', 0.9);

  // ---- intro: night on the pass. Snow falls. The roped line of small girls climbs across the range.
  k.move('curtain.open', 1, 0.3, 4.5, 'inOut');
  sky(0, 3, ...SNOWNIGHT, [0.5, 0.55, 0.35], 0.14);
  night(0.3, 3);
  snow(0, 0.55, 3);
  k.enter('clouds', 0.5, 3, 'out');
  tl.base('clouds.sway', 0.4);
  k.enter('cedars', 0.5, 3, 'out');
  k.enter('farmhouse', 1, 3, 'out');
  homeLamp(2.5, 0.55);
  tl.set('girls.x', -3.6, 0).set('girls.y', 0.15, 0);
  k.pop('girls', true, 3);
  k.move('girls.x', 3.6, 3, 15, 'linear');
  k.move('girls.y', 0.6, 3, 15, 'linear');
  hop('girls', 3, 15);
  follow(-1.35, -2.5, 2, 2, 0.35, 0xc8d4f0, 0.5);
  k.cam(0.3, 17, { z: 8.4, ly: 1.05, x: 0, lx: 0 });

  // ---- verse 1: spring at twelve. Hana ties her sandals at the door. Mother gives her a rice ball. She goes.
  tl.set('surtitles.i', 1, L(0) - 1);
  k.pop('girls', false, L(0) - 0.5);
  snow(L(0) - 3, 0, 3);
  sky(L(0) - 3, 4, ...SPRING, [0.7, 0.75, 0.55], 0.18);
  day(L(0) - 2.5, 3, 0.9);
  homeLamp(L(0) - 2, 0);
  k.leave('clouds', L(0) - 3, 3, 'in');
  k.leave('cedars', L(0) - 3, 3, 'in');
  tl.set('hana.x', -3.4, 0).set('hana.s', 0.85, 0);
  k.pop('hana', true, L(0) - 1.6);
  walk('hana', L(0) - 1.6, 2, -0.4, 'out');
  tl.set('mother.x', -3.2, 0);
  k.pop('mother', true, L(0) - 1.2);
  walk('mother', L(0) - 1.2, 2.2, -1.0, 'out');
  // 1 わらじの紐を きつく結んで — she bends to tie her sandals: head and arms down.
  k.move('hana.rz', -10, L(1) - 0.2, 0.8);
  k.move('hana.head', -18, L(1) - 0.2, 0.8);
  k.move('hana.armA', -30, L(1), 0.8);
  k.move('hana.armB', -25, L(1) + 0.2, 0.8);
  [0.9, 1.6, 2.3].forEach((dt, i) => k.move('hana.armA', i % 2 ? -30 : -15, L(1) + dt, 0.6, 'sine'));
  k.move('hana.rz', 0, L(1) + 3.6, 0.8);
  k.move('hana.head', 0, L(1) + 3.6, 0.8);
  k.move('hana.armA', 0, L(1) + 3.6, 0.8);
  k.move('hana.armB', 0, L(1) + 3.6, 0.8);
  // 2 糸を引く手は まだ小さくて — Mother puts the rice ball into her small hands.
  walk('mother', L(2) - 0.6, 1, -0.75);
  k.move('hana.armA', 35, L(2) + 0.4, 1);
  k.move('hana.armB', 30, L(2) + 0.5, 1);
  k.move('hana.head', -8, L(2) + 0.4, 1);
  k.move('hana.armB', 0, L(2) + 3.4, 1);
  follow(-0.6, -1.4, L(0) - 0.5, 1.2, 0.55);
  // 3 ふるさとの山を 何度も振り返った — she walks away to the right, and turns back, again and again.
  k.move('hana.armA', 10, L(3) - 1.2, 1);
  walk('hana', L(3) - 1, 4.6, 1.9, 'inOut');
  face('hana', L(3) + 0.4, true);
  face('hana', L(3) + 1.4, false);
  face('hana', L(3) + 2.8, true);
  face('hana', L(3) + 3.8, false);
  k.move('mother.rz', 4, L(3), 1);
  follow(0.6, -1.3, L(3), 3, 0.55);
  tl.set('girls.x', -3.6, L(3) - 2).set('girls.y', 0.2, L(3) - 2);
  k.pop('girls', true, L(3) - 1.5);
  k.move('girls.x', 2.4, L(3) - 1.5, 7, 'linear');
  k.move('girls.y', 0.55, L(3) - 1.5, 7, 'linear');
  hop('girls', L(3) - 1.5, 7);
  k.cam(L(0), 12, { z: 7.9, ly: 1.05, x: -0.3, lx: -0.3 });
  k.cam(L(3), 5, { z: 8.4, ly: 1.05, x: 0.2, lx: 0.2 });

  // ---- verse 2: the mill flies in. The reels turn. Steam rises from the basins. Hana reels at her wheel.
  const gap = E('v1');
  k.pop('girls', false, gap + 1.5);
  k.leave('mother', gap - 0.5, 2, 'in');
  k.leave('farmhouse', gap, 2.4, 'in');
  k.leave('range', gap, 2.4, 'in');
  k.move('hana.armA', 0, gap, 1);
  for (const [ch, v] of [['hana.x', 3.2], ['hana.s', 1], ['hana.turn', 0]] as const) tl.set(ch, v, gap + 0.4);
  k.pop('hana', false, gap + 0.3);
  sky(gap, 3, ...MILL, [0.45, 0.5, 0.35], 0.12);
  mill(gap + 0.4, 2.6);
  k.enter('mill', gap + 0.2, 3, 'out');
  k.enter('reelers', gap + 0.8, 2.6, 'out');
  for (const [i, id] of ['reel1', 'reel2', 'reel3', 'reel4'].entries()) k.enter(id, gap + 0.6 + i * 0.25, 2.2, 'out');
  k.enter('myreel', gap + 1.2, 2.2, 'out');
  tl.set('hana.x', -3.4, gap + 0.5).set('hana.s', 1, gap + 0.5);
  k.pop('hana', true, gap + 0.8);
  walk('hana', gap + 0.8, 2.4, 0.05, 'out');
  k.pop('thread', true, v2 - 0.2);
  k.move('hana.armA', 55, v2 - 0.4, 0.8);
  k.move('hana.head', 8, v2, 1);
  k.move('smoke.i', 0.7, v2 - 1, 2);
  tl.set('smoke.x', -0.6, v2 - 1).set('smoke.y', 0.45, v2 - 1).set('smoke.z', -2.15, v2 - 1);
  k.move('dust.i', 0.8, v2 - 1, 3);
  spin(v2, L(6), BEAT * 2);
  // She draws the thread: her hand works up and down in time.
  for (let t = v2, i = 0; t < L(6) - 0.5; t += BEAT, i++) k.move('hana.armA', i % 2 ? 40 : 62, t, BEAT, 'sine');
  // 5 指が割れても — she looks at her split fingers, and goes on.
  k.move('hana.head', -12, L(5) + 0.3, 0.8);
  k.move('hana.head', 6, L(5) + 2.6, 1);
  follow(0.15, -1.25, v2 - 0.5, 1.2, 0.6, 0xffe0b8);
  k.cam(v2 - 1, 10, { z: 7.7, ly: 1.15, x: 0, lx: 0 });
  // 6–7 the letter: night shift ends. The mill dims. A paper lamp. She writes, sitting low.
  mill(L(6) - 1, 2);
  k.look(L(6) - 1, 2, { fohL: 0.08, fohR: 0.06, left: 0.04, right: 0.04, back: 0.1, ambient: 0.1 });
  k.pop('thread', false, L(6) - 0.8);
  k.move('hana.armA', 0, L(6) - 1, 0.8);
  tl.set('lamp.x', 2.8, 0);
  k.pop('lamp', true, L(6) - 1.4);
  k.move('lamp.x', -0.55, L(6) - 1.4, 1.6, 'out');
  walk('hana', L(6) - 1.2, 1.4, -0.15);
  k.move('hana.y', -0.18, L(6) - 0.2, 1);
  k.move('hana.head', -14, L(6), 1);
  for (let t = L(6) + 0.6, i = 0; t < L(7) + 4; t += 0.7, i++) k.move('hana.armA', i % 2 ? 22 : 32, t, 0.7, 'sine');
  homeLamp(L(6) - 0.4, 0.6, -0.55, 0.3, -0.9);
  follow(-0.3, -1.1, L(6), 1.2, 0.35, 0xffc070, 0.5);
  k.move('hana.head', 4, L(7), 1);
  k.cam(L(6), 8, { z: 7.0, ly: 0.9, x: -0.3, lx: -0.3 });

  // ---- pre-chorus 1: the mill song. Every reel turns on the beat. The bell rings. The girls bend in time.
  k.leave('lamp', pre1 - 1.4, 1.4, 'in');
  homeLamp(pre1 - 1.2, 0, -0.55, 0.3, -0.9, 0.6);
  k.move('hana.y', 0, pre1 - 1.2, 0.8);
  k.move('hana.head', 6, pre1 - 1.2, 0.8);
  k.pop('thread', true, pre1 - 0.6);
  mill(pre1 - 1, 1);
  k.flash('back', pre1, 1, 0.5, 0.02, 0.3);
  tl.set('bell.x', 3.4, 0);
  k.pop('bell', true, pre1 - 1.2);
  k.move('bell.x', 2.2, pre1 - 1.2, 1, 'out');
  spin(pre1, c1 - 1, BEAT);
  k.downbeats(pre1 - 0.2, c1 - 1).forEach((b) => {
    k.move('reelers.y', 0.06, b - 0.1, 0.18, 'out');
    k.move('reelers.y', 0, b + 0.15, 0.5, 'inOut');
    k.move('bell.rz', 9, b - 0.1, 0.18, 'out');
    k.move('bell.rz', -6, b + 0.15, 0.3, 'sine');
    k.move('bell.rz', 0, b + 0.5, 0.3, 'sine');
  });
  for (let t = pre1, i = 0; t < c1 - 1; t += BEAT / 2, i++) k.move('hana.armA', i % 2 ? 38 : 68, t, BEAT / 2, 'sine');
  k.move('smoke.i', 1, pre1, 1.4);
  k.cam(pre1, 6, { z: 8.3, ly: 1.15, x: 0, lx: 0 });

  // ---- chorus 1: the dream. The mill fades. Beyond the steam: the pass, and the farmhouse lamp. She reaches for it.
  k.leave('bell', c1 - 1.6, 1.4, 'in');
  k.pop('thread', false, c1 - 1.2);
  k.move('smoke.i', 0.35, c1 - 1, 2);
  for (const id of ['reel1', 'reel2', 'reel3', 'reel4']) k.leave(id, c1 - 1.4, 2.2, 'in');
  k.leave('mill', c1 - 1.2, 2.6, 'in');
  sky(c1 - 1.5, 3, ...DREAM, [0.55, 0.7, 0.4], 0.14);
  night(c1 - 1.2, 2.4, 0.8);
  k.enter('range', c1 - 1, 2.6, 'out');
  k.enter('farmhouse', c1 - 0.6, 2.6, 'out');
  homeLamp(c1, 0.7);
  // The reeling floor sinks into the steam, so the farmhouse shows.
  k.move('reelers.y', -0.6, c1 - 1, 2.4, 'inOut');
  snow(c1, 0.25, 3);
  // Hana stands at her reel. She lets go of the thread. Her hand reaches out to the lamp.
  k.move('hana.armA', 0, c1 - 1, 0.8);
  face('hana', c1 - 0.4, true);
  k.move('hana.armB', 95, c1 + 0.2, 1.6, 'out');
  k.move('hana.head', 10, c1 + 0.2, 1.4);
  walk('hana', c1 + 2, 2, -0.35);
  // 11 見える 見える — the lamp brightens on the choir.
  k.flash('lamp', L(11), 1.0, 0.7, 0.2, 0.9);
  k.move('hana.armB', 120, L(12), 1.2, 'out');
  k.move('hana.armA', 40, L(12) + 0.4, 1.2);
  k.flash('lamp', L(13) + 0.3, 1.0, 0.7, 0.2, 0.9);
  follow(-0.5, -1.2, c1, 1.4, 0.65, 0xffe0c0);
  k.cam(c1, 9, { z: 7.6, ly: 1.1, x: -0.4, lx: -0.5 });
  k.cam(L(13), 4, { z: 8.2, ly: 1.1, x: -0.2, lx: -0.2 });
  // 14 帰ろう 帰ろう — the steam closes in. The dream goes.
  k.move('smoke.i', 1, L(14) - 0.5, 1);
  homeLamp(L(14) + 1, 0, -1.35, 0.45, -2.45, 1.2);
  snow(L(14), 0, 1.4);
  k.leave('farmhouse', L(14) + 0.2, 1.8, 'in');
  k.leave('range', L(14) + 0.4, 1.8, 'in');

  // ---- verse 3: back at the reel. The cough. The thread runs red. The gate. The door board.
  k.move('hana.armA', 55, v3 - 1, 0.8);
  k.move('hana.armB', 0, v3 - 1.2, 0.8);
  face('hana', v3 - 1.2, false);
  walk('hana', v3 - 1.2, 0.8, 0.05);
  k.enter('mill', v3 - 1.8, 1.6, 'out');
  k.move('reelers.y', 0, v3 - 1.8, 1.6, 'inOut');
  for (const id of ['reel1', 'reel2', 'reel3', 'reel4']) k.enter(id, v3 - 1.6, 1.4, 'out');
  sky(v3 - 1.6, 2, ...MILL, [0.4, 0.45, 0.3], 0.12);
  mill(v3 - 1.4, 1.6);
  k.pop('thread', true, v3 - 0.8);
  spin(v3, L(17) - 1, BEAT * 2);
  [v3 + 0.4, v3 + 2.2, v3 + 3.0, v3 + 5.4].forEach((t) => cough('hana', t));
  // The thread turns red: the white one goes, and a red one runs from the reel to her hand.
  k.pop('thread', false, v3 + 3.4);
  k.pop('redthread', true, v3 + 3.4);
  follow(0.1, -1.25, v3, 1, 0.75, 0xffd8c8);
  k.look(v3 + 3.4, 2, { fohL: [0.2, 0xffb0a0], left: [0.24, 0xc8283a] });
  // The gap: the red thread runs off her reel, long and slack, while the reels around her keep turning.
  tl.hold('redthread.sag', v3 + 3.4).to('redthread.sag', 0.5, L(15) + 7, 4);
  k.move('hana.y', -0.2, L(16) - 4, 2);
  k.move('hana.rz', -12, L(16) - 4, 2);
  k.move('hana.armA', 20, L(16) - 4, 2);
  cough('hana', L(16) - 1.5);
  cough('hana', L(16) + 2);
  k.cam(v3, 14, { z: 7.2, ly: 1.0, x: 0.1, lx: 0.1 });
  // 17 工場の門で 名前を消された — the gate flies in. She is put out through it. The reels stop.
  k.pop('redthread', false, L(17) - 0.8);
  k.move('hana.armA', 0, L(17) - 1, 0.6);
  k.move('hana.y', 0, L(17) - 1, 0.8);
  k.move('hana.rz', 0, L(17) - 1, 0.8);
  k.enter('gate', L(17) - 0.6, 1.6, 'out');
  face('hana', L(17) + 0.4, true);
  walk('hana', L(17) + 0.4, 3.2, -1.3, 'linear');
  k.move('hana.head', -14, L(17) + 1, 1);
  k.move('hana.s', 0.85, L(17) + 0.4, 3.2);
  k.pop('hana', false, L(17) + 3.8);
  follow(-1.1, -1.4, L(17), 1.4, 0.55, 0xd8dcf0);
  k.look(L(17) + 1.6, 2, { left: [0.1, 0x8090c0] });
  for (const id of ['reel1', 'reel2', 'reel3', 'reel4', 'myreel']) k.leave(id, L(17) + 2, 2, 'in');
  k.leave('reelers', L(17) + 2.4, 2.2, 'in');
  // 18 戸板に乗せられ — snow, night and the foot of the pass. The porters carry her on a door board.
  k.leave('mill', L(18) - 1.6, 2, 'in');
  k.leave('gate', L(18) - 1.2, 2, 'in');
  sky(L(18) - 1.6, 2.6, ...SNOWNIGHT, [0.5, 0.55, 0.35], 0.14);
  night(L(18) - 1.4, 2.4);
  k.enter('range', L(18) - 1.2, 2.4, 'out');
  k.enter('slope', L(18) - 1, 2.6, 'out');
  snow(L(18) - 1, 0.5, 2);
  k.move('smoke.i', 0, L(18) - 1.5, 1);
  k.move('dust.i', 0, L(18) - 1.5, 1);
  tl.set('porters.x', 3.4, 0);
  k.pop('porters', true, L(18) - 0.2);
  k.move('porters.x', -0.9, L(18) - 0.2, 6.4, 'linear');
  hop('porters', L(18) - 0.2, 6.4);
  follow(0.4, -1.3, L(18), 1.4, 0.45, 0xc8d4f0);
  k.cam(L(18) - 1, 8, { z: 8.3, ly: 1.1, x: 0, lx: 0 });
  // 19 兄さんの声が 雪の中で聞こえた — a figure on the slope: Kichi, running down to meet them.
  tl.set('kichi.x', SUMMIT.x, 0).set('kichi.y', SUMMIT.y, 0).set('kichi.s', 0.8, 0);
  k.pop('kichi', true, L(19) - 0.5);
  k.move('porters.rz', 3, L(19) + 0.4, 1);
  follow(2.2, -1.5, L(19), 1, 0.5, 0xd8e0f8, 1.3);

  // ---- verse 4: Kichi runs down through the blizzard. He kneels. He takes her on his back.
  snow(v4 - 3, 0.85, 3);
  k.move('kichi.x', 0.2, L(19) + 1, E('v3') - L(19) + 2, 'in');
  k.move('kichi.y', 0, L(19) + 1, E('v3') - L(19) + 2, 'in');
  k.move('kichi.s', 1, L(19) + 1, E('v3') - L(19) + 2);
  hop('kichi', L(19) + 1, E('v3') - L(19) + 2);
  follow(0, -1.3, v4 - 1, 1.2, 0.6, 0xe0e8ff);
  k.move('kichi.armA', -50, v4, 0.8);
  k.move('kichi.armB', -35, v4 + 0.2, 0.8);
  // 21 吹雪の中で 妹を背負った — he kneels to the board. The porters go. The pair rises.
  k.move('kichi.y', -0.25, L(21) - 0.6, 0.6);
  k.move('kichi.rz', 10, L(21) - 0.6, 0.6);
  k.pop('kichi', false, L(21) + 0.5);
  k.move('porters.x', 3.4, L(21) + 0.5, 3, 'in');
  k.pop('porters', false, L(21) + 3.5);
  for (const [ch, v] of [['kichi.y', 0], ['kichi.rz', 0], ['kichi.armA', 0], ['kichi.armB', 0]] as const) tl.set(ch, v, L(21) + 0.6);
  tl.set('carry.x', 0.15, 0).set('carry.y', -0.25, 0);
  k.pop('carry', true, L(21) + 0.5);
  k.move('carry.y', 0, L(21) + 0.6, 1.2, 'out');
  // 22 「軽くなったな」 — his head turns back to her. Her head lifts a little.
  k.move('carry.head', -18, L(22), 1);
  k.move('carry.armA', 8, L(22) + 0.6, 1.2);
  k.move('carry.head', 0, L(22) + 2.6, 1);
  // 23 泣いたら足が 止まりそうだった — he sets off up the slope.
  climb('carry', L(23), [[0.5, 0], [0.85, 0], [1.1, 0.08]], 1);
  follow(0.6, -1.3, L(21), 1, 0.65, 0xe8ecff);
  k.cam(v4, 13, { z: 7.4, ly: 1.05, x: 0.2, lx: 0.2 });

  // ---- pre-chorus 2 and chorus 2: the climb. The choir drives him on. He climbs the zigzag path to the right.
  k.enter('clouds', pre2 - 1, 2.6, 'out');
  tl.base('clouds.sway', 0.8);
  // The path zigzags: up to the right, a turn, up to the left, a turn, up to the right again.
  climb('carry', pre2, [[1.18, 0.15], PATH[0]!], 2.4);
  face('carry', c2 - 2.6, true);
  climb('carry', c2 - 2.4, [[1.15, 0.27], [1.05, 0.32], PATH[1]!], 2.6);
  face('carry', L(29) - 0.6, false);
  climb('carry', L(29) - 0.4, [[1.15, 0.45], [1.3, 0.53]], 2);
  // On the hook, the far lamp burns: he sees it too.
  homeLamp(c2, 0.45, -2.2, 0.15, -3.0);
  k.flash('lamp', L(27), 0.8, 0.45, 0.2, 0.8);
  k.move('carry.head', -10, c2 + 0.4, 1.2);
  k.move('carry.head', 4, L(28) + 2, 1.2);
  follow(1.0, -1.3, pre2, 2, 0.6, 0xe0e8ff, 1.0);
  k.cam(pre2, 8, { z: 8.0, ly: 1.2, x: 0.6, lx: 0.6 });
  k.cam(c2, 18, { z: 7.9, ly: 1.35, x: 0.3, lx: 0.3 });

  // ---- the bridge: the blizzard. Wind, dark, the snow at its thickest. He slips and gets up. Then grey in the east.
  homeLamp(st - 1, 0, -2.2, 0.15, -3.0, 1);
  snow(st - 1, 1, 1.2, -3.4, 3.4);
  k.move('haze', 2.2, st - 1, 1.4);
  sky(st - 1, 1.4, ...NIGHT, [0.4, 0.45, 0.3], 0.1);
  night(st - 1, 1.4, 0.75);
  tl.base('clouds.sway', 1.6);
  k.downbeats(st, L(36)).forEach((b, i) => k.move('cedars.x', i % 2 ? 0.05 : -0.05, b, 1.4, 'sine'));
  climb('carry', st, [PATH[2]!, [1.55, 0.66]], 1.6);
  // 33 背中の妹が 小さく笑う — he slips. He goes down on one knee. Her head rises. He gets up.
  k.move('carry.y', 0.56, L(33) - 0.4, 0.3, 'in');
  k.move('carry.rz', 14, L(33) - 0.4, 0.3, 'in');
  k.move('carry.armA', 16, L(33) + 0.4, 1);
  k.move('carry.y', 0.7, L(33) + 1.6, 0.9, 'out');
  k.move('carry.rz', 0, L(33) + 1.6, 0.9, 'out');
  k.move('carry.armA', 0, L(33) + 3, 1);
  // 35 一歩 また一歩 — the last steps to the summit.
  climb('carry', L(35) - 0.6, [PATH[3]!, PATH[4]!], 2.2);
  follow(SUMMIT.x - 0.2, -1.3, st, 1.6, 0.55, 0xd8e0ff, 1.5);
  k.cam(st, 12, { z: 7.3, ly: 1.5, x: 0.9, lx: 1.0 });
  // 36 東の空が 白くなる — the snow eases. Grey, then white, in the east.
  snow(L(36), 0.2, 4);
  k.move('haze', 1.0, L(36), 4);
  tl.base('clouds.sway', 0.4);
  k.leave('clouds', L(36) + 1, 5, 'in');
  sky(L(36), 6, ...DAWN, [0.6, 0.75, 0.5], 0.14);
  day(L(36) + 1, 6, 0.6, 0xffe0c8);

  // ---- the break: the top of the pass at dawn. "兄さん 降ろして." He sets her down. The valley comes up below.
  snow(brk - 2, 0, 3);
  k.move('carry.head', -16, brk - 0.4, 1);
  k.move('carry.y', SUMMIT.y - 0.2, brk + 1.4, 1, 'inOut');
  k.pop('carry', false, brk + 2.4);
  for (const [ch, v] of [['kichi.x', SUMMIT.x + 0.12], ['kichi.y', SUMMIT.y - 0.16], ['kichi.z', -0.06], ['kichi.rz', 6], ['kichi.s', 1], ['kichi.turn', 0], ['kichi.head', -10]] as const) tl.set(ch, v, brk + 2.3);
  k.pop('kichi', true, brk + 2.4);
  k.pop('hanasit', true, brk + 2.4);
  k.move('kichi.armA', -45, brk + 2.6, 1);
  follow(SUMMIT.x - 0.2, -1.24, brk, 1.4, 0.7, 0xfff0e0, 1.3);
  k.enter('valley', brk + 3, 6, 'out');
  // The farmhouse lamp burns in the valley below.
  homeLamp(brk + 6, 0.65, -1.55, 0.35, -1.4, 3);
  // 38 ああ… 見える — she lifts her head to it.
  k.move('hanasit.rz', 3, L(38) - 0.6, 1.2);
  k.flash('lamp', L(38) + 0.2, 0.9, 0.65, 0.3, 1.2);
  k.cam(brk, 13, { z: 7.0, ly: 1.4, x: 0.5, lx: 0.4 });

  // ---- final chorus: the sun comes up over the valley. She is still. He sits beside her. He carries her down.
  k.enter('sun', c3 - 1, 9, 'out');
  sky(c3, 8, ...DAY, [0.75, 0.8, 0.6], 0.2);
  day(c3, 6, 0.95);
  homeLamp(c3 + 4, 0.25, -1.55, 0.35, -1.4, 4);
  // She goes still. Her head drops slowly to her shoulder.
  k.move('hanasit.rz', -6, L(41), 4);
  k.move('hanasit.y', -0.03, L(41), 4);
  k.move('kichi.armA', -30, L(41), 1.2);
  // 43 妹は そこで 眠った — his head goes down to hers.
  k.move('kichi.head', -24, L(42), 1.4);
  k.move('kichi.rz', 14, L(43), 1.6);
  k.move('kichi.armA', -60, L(43) + 0.4, 1.4);
  follow(SUMMIT.x - 0.1, -1.24, c3, 2, 0.75, 0xfff4e4, 1.2);
  k.cam(c3, 9, { z: 7.6, ly: 1.4, x: 0.4, lx: 0.4 });
  k.cam(L(43), 4, { z: 6.8, ly: 1.35, x: 1.1, lx: 1.2 });
  // 44–46 he lifts her once more and carries her down the slope, towards the lamp.
  k.move('kichi.rz', 0, c4 - 0.4, 0.8);
  k.move('kichi.y', SUMMIT.y, c4 - 0.4, 0.8);
  k.pop('kichi', false, c4 + 0.6);
  k.pop('hanasit', false, c4 + 0.6);
  for (const [ch, v] of [['carry.x', SUMMIT.x], ['carry.y', SUMMIT.y], ['carry.rz', 0], ['carry.head', -8], ['carry.armA', 30], ['carry.turn', 1]] as const) tl.set(ch, v, c4 + 0.5);
  k.pop('carry', true, c4 + 0.6);
  climb('carry', L(45) - 0.6, [PATH[3]!, PATH[2]!, PATH[1]!, PATH[0]!, [0.9, 0], [0.2, 0], [-0.6, 0]], 1.5);
  follow(0.2, -1.3, c4, 2, 0.6, 0xfff0e0, 1.0);
  k.cam(c4, 10, { z: 8.2, ly: 1.2, x: 0, lx: 0 });

  // ---- outro: spring. The snow on the pass is still white. Yuki ties her sandals. Kichi walks her to the top.
  k.pop('carry', false, out - 1.2);
  k.leave('valley', out - 2, 3, 'in');
  k.leave('sun', out - 2, 3, 'in');
  homeLamp(out - 2, 0, -1.55, 0.35, -1.4, 2);
  sky(out - 2, 4, ...SPRING, [0.75, 0.8, 0.6], 0.2);
  day(out - 1.6, 3, 0.9);
  // The farmhouse comes up in front of the foot of the slope, at the left.
  tl.set('farmhouse.z', 1.0, out - 2).set('farmhouse.x', -0.2, out - 2);
  k.enter('farmhouse', out - 1.6, 3, 'out');
  tl.set('yuki.x', -3.4, 0);
  k.pop('yuki', true, out - 0.6);
  k.move('yuki.x', -1.0, out - 0.6, 2, 'out');
  hop('yuki', out - 0.6, 2);
  // 47 末の妹が わらじを結ぶ — she bends to her sandals, twice.
  [out + 2, out + 3.4].forEach((t) => {
    k.move('yuki.rz', -12, t, 0.5, 'out');
    k.move('yuki.rz', 0, t + 0.7, 0.6);
  });
  for (const [ch, v] of [['kichi.x', -0.4], ['kichi.y', 0], ['kichi.z', 0], ['kichi.rz', 0], ['kichi.head', 0], ['kichi.armA', 0], ['kichi.armB', 0], ['kichi.turn', 1]] as const) tl.set(ch, v, out);
  k.pop('kichi', true, out + 0.4);
  k.move('kichi.armA', -50, out + 4.4, 1);
  follow(-0.7, -1.2, out, 1.4, 0.6, 0xfff4e4);
  k.cam(out, 6, { z: 7.6, ly: 1.05, x: -0.5, lx: -0.6 });
  // 48 峠の雪は まだ白い — they climb together. At the top he stops. She goes on over the pass with the line of girls.
  k.leave('farmhouse', L(48) - 1, 3, 'in');
  // Yuki leads. He follows a step behind her.
  climb('kichi', L(48) - 2.2, [[0.5, 0], [1.1, 0.05], ...PATH.slice(0, 4), [SUMMIT.x - 0.12, SUMMIT.y]], 1.2);
  climb('yuki', L(48) - 3.4, [[0.25, 0], [0.9, 0.03], [1.2, 0.18], [0.92, 0.33], [1.36, 0.55], [1.72, 0.76], [SUMMIT.x + 0.12, SUMMIT.y]], 1.2);
  k.move('kichi.armA', 0, L(48) + 6.4, 0.8);
  // She goes on over the summit and down the far side, out of sight.
  climb('yuki', L(48) + 6.0, [[2.25, SUMMIT.y - 0.05], [2.45, SUMMIT.y - 0.2], [2.55, SUMMIT.y - 0.45]], 1.8);
  k.pop('yuki', false, L(48) + 11.4);
  // He watches her go. He lifts a hand. The snow begins again.
  k.move('kichi.armA', -110, L(48) + 9.5, 1.4, 'out');
  k.move('kichi.head', 8, L(48) + 9.5, 1.4);
  k.move('kichi.armA', -30, L(48) + 14, 2);
  snow(L(48) + 12, 0.3, 4);
  sky(L(48) + 10, 8, ...DAWN, [0.55, 0.6, 0.4], 0.14);
  follow(SUMMIT.x, -1.2, L(48) + 4, 3, 0.6, 0xfff0e0, 1.3);
  k.cam(L(48), 10, { z: 7.8, ly: 1.3, x: 0.7, lx: 0.8 });

  // ---- the end: the traveller closes on him at the summit. In the call, Hana and Kichi bow together.
  tl.set('surtitles.i', 0, end - 3.6);
  k.cam(end - 4.8, 4.2, { z: 9.4, x: 0, lx: 0, y: 0.95, ly: 1.05 });
  k.move('curtain.open', 0, end - 3.8, 3.4, 'inOut');
  k.look(end - 1, 2, { follow: 0, house: 0.25, lamp: 0 });
  k.move('snow.rate', 0, end - 1, 0.5);
  k.pop('yuki', false, end - 1.5);
  for (const [ch, v] of [['kichi.x', 0.45], ['kichi.y', 0], ['kichi.z', 0.75], ['kichi.head', 0], ['kichi.armA', 0], ['kichi.armB', 0], ['kichi.turn', 0], ['kichi.rz', 0], ['kichi.s', 1]] as const) k.move(ch, v, end - 1.9, 0.01);
  for (const [ch, v] of [['hana.x', -0.5], ['hana.y', 0], ['hana.z', 0.8], ['hana.head', 0], ['hana.armA', 0], ['hana.armB', 0], ['hana.turn', 0], ['hana.rz', 0], ['hana.s', 1]] as const) k.move(ch, v, end - 1.9, 0.01);
  k.pop('hana', true, end - 1.8);
  k.move('curtain.open', 0.5, end + 0.8, 1.6, 'out');
  k.look(end + 0.6, 0.8, { follow: [0.7, 0xffe6c4] });
  k.aim('follow', 0, 1.0, -0.5, end + 0.5, 0.01);
  k.move('kichi.rz', 18, end + 2.4, 0.5);
  k.move('hana.rz', -18, end + 2.4, 0.5);
  k.move('kichi.rz', 0, end + 3, 0.5);
  k.move('hana.rz', 0, end + 3, 0.5);
  k.move('curtain.open', 0, end + 4.2, 1.8, 'inOut');
  k.look(end + 4.6, 1.5, { follow: 0, house: 0.7 });
}

const production: Production = {
  id: 'furusato-ga-mieru',
  no: 14,
  title: { ja: 'ふるさとが見える', en: 'I Can See Home', id: 'Kampung Halaman Terlihat', zh: '看得见故乡' },
  poster: urls['./art/cut/poster.webp']!,
  audio,
  master,
  pieces,
  curtain: { open: 'traveller', close: 'traveller' },
  preroll: 7,
  postroll: 7,
  surtitles: { main: 'ja', second: 'id' },
  bill: {
    about: 'The story takes place in Meiji Japan. Hana crosses the snowy pass to reel silk in the valley mill. The cough comes. The mill sends her home. Her brother Kichi carries her up the pass through the night. They sing in Japanese.',
    cast: [['Hana, the reeler', 'Voice'], ['Kichi, her brother', 'Voice'], ['Yuki, the youngest', 'On slides'], ['The mill girls', 'Chorus']],
    scenes: ['The pass in snow', 'The silk mill', 'The red thread', 'The blizzard climb', 'The summit at dawn'],
  },
  voices: {
    hana: { name: 'Hana', color: '#f0d8d8' },
    kichi: { name: 'Kichi', color: '#d8e0f0' },
    choir: { name: '女工たち', color: '#e8dcc8' },
    both: { name: 'Hana · Kichi', color: '#f0e4e0' },
  },
  cues,
};

export default production;
