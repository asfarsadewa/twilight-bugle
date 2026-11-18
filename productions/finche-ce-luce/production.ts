// Finché c'è luce · As Long as There Is Light · Selama Masih Ada Cahaya · 只要还有光
// The cue sheet follows the producer's Suno recording (song/master.json). Line numbers below are the sung lines.
// Heights (y) are above the stage floor. The stage opening is about 5.5 wide and 2.4 high. Depth runs to z = -4.
//
// A fishing village builds a lighthouse. Its beam brings the boats home for twenty years. On the night of the great
// storm it brings every boat home except their son's. The cards are painted as Italian maritime ex-votos. Matteo and
// Lucia are marionettes. The tower rises in four drums from the trap, one course at a time. The beam is the
// theatre's real spot, swept from the lantern through the haze. The sea is a wave machine of three rocking rows.

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

// The tower: one painting cut into four drums (art/prepare.py). World units per tower pixel.
const TX = 1.6, TZ = -2.55;
const K = 1.45 / 1412;
const DRUMS = [{ h: 368, w: 796 }, { h: 338, w: 679 }, { h: 325, w: 593 }, { h: 381, w: 644 }];
const drumY = DRUMS.map((_, i) => DRUMS.slice(0, i).reduce((s, d) => s + d.h, 0) * K);
const TOP = DRUMS.reduce((s, d) => s + d.h, 0) * K;
// The lantern room sits on the top drum. The beam comes from its lens.
const LENS = { x: TX, y: TOP + 0.36, z: TZ + 0.05 };

const MATTEO = { x: -0.9, y: 0, z: -1.2 };
const LUCIA = { x: 0.15, y: 0, z: -1.22 };

const boat = (id: string, z: number, width: number, extra: Partial<PieceSpec> = {}): PieceSpec =>
  ({ id, kind: 'prop', art: art('prop-boat'), width, home: { x: 0, y: -0.08, z }, route: 'left', slide: 'left', ...extra });

const pieces: PieceSpec[] = [
  { id: 'moon', kind: 'prop', art: art('prop-moon'), width: 0.5, anchor: 'center', home: { x: -1.8, y: 1.95, z: -3.5 }, route: 'fly', strings: [[0.5, 0.04]], glow: 0.25, shadow: false, startIn: true },
  { id: 'sun', kind: 'prop', art: art('prop-sun'), width: 0.75, anchor: 'center', home: { x: -1.6, y: 1.8, z: -3.5 }, route: 'trap', rod: true, glow: 0.3, shadow: false },
  { id: 'clouds', kind: 'prop', art: art('prop-clouds'), width: 5.2, anchor: 'center', home: { x: -0.4, y: 2.0, z: -3.4 }, route: 'fly', strings: [[0.15, 0.25], [0.5, 0.2], [0.85, 0.25]], shadow: false },
  { id: 'village', kind: 'flat', art: art('flat-village'), width: 4.6, home: { x: -1.2, y: -0.55, z: -3.25 }, route: 'fly' },
  { id: 'cliff', kind: 'flat', art: art('flat-cliff'), width: 5.6, home: { x: 0.9, y: -0.95, z: -2.8 }, route: 'trap', rod: true, startIn: true },
  ...DRUMS.map((d, i): PieceSpec => ({ id: `drum${i + 1}`, kind: 'prop', art: art(`tower-${i + 1}`), width: d.w * K, home: { x: TX, y: drumY[i]!, z: TZ }, route: 'trap', rod: true })),
  { id: 'lantern', kind: 'prop', art: art('prop-lantern'), width: 0.72, home: { x: TX, y: TOP - 0.03, z: TZ + 0.04 }, route: 'fly', strings: [[0.5, 0.02]], glow: 0.15 },
  { id: 'weight', kind: 'prop', art: art('prop-weight'), height: 1.3, anchor: 'center', home: { x: TX - 0.52, y: 1.05, z: TZ + 0.08 }, route: 'fly', strings: [[0.5, 0.01]] },
  // The scaffold stands beside the tower and behind it, so each new course shows as it rises.
  { id: 'scaffold', kind: 'prop', art: art('prop-scaffold'), height: 1.9, home: { x: TX - 0.85, y: 0, z: TZ - 0.08 }, route: 'fly' },
  { id: 'stone', kind: 'prop', art: art('prop-stone'), width: 0.42, anchor: 'center', home: { x: TX - 0.75, y: 0.4, z: TZ + 0.18 }, route: 'fly', strings: [[0.5, 0.01]] },
  { id: 'stair', kind: 'flat', art: art('flat-stair'), height: 2.25, home: { x: TX, y: 0, z: TZ + 0.2 }, route: 'fly' },
  { id: 'waves3', kind: 'flat', art: art('flat-waves'), width: 6.8, home: { x: -0.3, y: -1.0, z: -2.25 }, route: 'trap', rod: true, startIn: true },
  boat('boat1', -2.12, 0.95),
  boat('boat2', -2.1, 0.8),
  { id: 'ninoboat', kind: 'prop', art: art('prop-ninoboat'), width: 0.95, home: { x: 0, y: -0.08, z: -2.08 }, route: 'right', slide: 'right' },
  { id: 'waves2', kind: 'flat', art: art('flat-waves'), width: 6.8, home: { x: 0.2, y: -1.05, z: -1.98 }, route: 'trap', rod: true, mirror: true, startIn: true },
  boat('boat3', -1.86, 1.05),
  boat('boat4', -1.84, 0.9),
  { id: 'haulers', kind: 'flat', art: art('flat-haulers'), width: 2.8, home: { x: -0.5, y: 0, z: -1.78 }, route: 'left', slide: 'left' },
  { id: 'women', kind: 'flat', art: art('flat-women'), width: 3.2, home: { x: -0.4, y: 0, z: -1.72 }, route: 'trap', rod: true, glow: 0.12 },
  { id: 'waves1', kind: 'flat', art: art('flat-waves'), width: 6.8, home: { x: -0.2, y: -1.22, z: -1.62 }, route: 'trap', rod: true, startIn: true },
  { id: 'quay', kind: 'flat', art: art('flat-quay'), width: 4.2, home: { x: -0.7, y: -0.98, z: -1.5 }, route: 'trap', rod: true },
  { id: 'boy', kind: 'prop', art: art('prop-boy'), height: 0.62, home: { x: 0.4, y: 0, z: -1.42 }, route: 'right', slide: 'right' },
  { id: 'baby', kind: 'prop', art: art('prop-baby'), width: 0.34, home: { x: 0.85, y: 0.95, z: -1.45 }, route: 'fly', strings: [[0.5, 0.02]] },
  { id: 'wheel', kind: 'prop', art: art('prop-wheel'), width: 0.85, anchor: 'center', home: { x: -1.75, y: 0.72, z: -1.05 }, route: 'fly', strings: [[0.5, 0.02]] },
  { id: 'empty', kind: 'prop', art: art('prop-empty'), width: 1.3, home: { x: 0.4, y: 0, z: -1.0 }, route: 'right', slide: 'right' },
  {
    id: 'matteo', kind: 'puppet', home: MATTEO, route: 'fly',
    puppet: {
      height: 1.0, faces: 'right',
      body: p(part('puppet-matteo', 1), [0.5, 1]),
      head: p(part('puppet-matteo', 0), [0.553, 0.903], { attach: [0.56, 0.045], z: -0.6, string: [0.5, 0.05] }, 0.7),
      // His right arm with the gripping fist hangs on the far side. His left arm has the open hand.
      armA: p(part('puppet-matteo', 3), [0.69, 0.085], { attach: [0.256, 0.108], z: 1, string: [0.45, 0.92] }),
      armB: p(part('puppet-matteo', 2), [0.32, 0.08], { attach: [0.86, 0.108], z: 1.1, string: [0.55, 0.92] }),
    },
  },
  {
    id: 'lucia', kind: 'puppet', home: LUCIA, route: 'left',
    puppet: {
      height: 0.95, faces: 'left',
      body: p(part('puppet-lucia', 1), [0.5, 1]),
      head: p(part('puppet-lucia', 0), [0.48, 0.9], { attach: [0.54, 0.04], z: -0.6, string: [0.5, 0.05] }, 0.7),
      // Her right arm carries the oil can. Her left arm has the open hand.
      armA: p(part('puppet-lucia', 3), [0.51, 0.062], { attach: [0.30, 0.1], z: 1, string: [0.5, 0.75] }),
      armB: p(part('puppet-lucia', 2), [0.33, 0.074], { attach: [0.78, 0.1], z: 1.1, string: [0.6, 0.92] }),
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
  tl.signal('matteo.sing', master.vox!.fps, master.vox!.matteo ?? []);
  tl.signal('lucia.sing', master.vox!.fps, master.vox!.lucia ?? []);

  const sky = (t: number, dur: number, top: number, hz: number, bot: number, levels: [number, number, number] = [0.6, 0.6, 0.45], hzY = 0.16) => {
    k.look(t, dur, { cycTop: [levels[0], top], cycHz: [levels[1], hz], cycBot: [levels[2], bot] });
    k.move('cycHz.y', hzY, t, dur);
  };
  const NIGHT = [0x0a1220, 0x1a2a3c, 0x08101a] as const;
  const DAWN = [0x4a5e78, 0xe8b88a, 0xc8a890] as const;
  const DAY = [0x6a8eb0, 0xf0dcb8, 0xd8c8a8] as const;
  const DUSK = [0x2e3050, 0xe08a5a, 0x5a4048] as const;
  const STORM = [0x141a22, 0x2c343c, 0x0c1014] as const;
  const GREY = [0x5a6470, 0xb8b4a8, 0x7a7a74] as const;

  const hop = (id: string, t: number, dur: number) => tl.hold(`${id}.hop`, t).to(`${id}.hop`, 1, t, 0.2).hold(`${id}.hop`, t + dur).to(`${id}.hop`, 0, t + dur, 0.2);
  const face = (id: string, t: number, turned: boolean) => tl.hold(`${id}.turn`, t).to(`${id}.turn`, turned ? 1 : 0, t, 0.6);
  const walk = (id: string, t: number, dur: number, x: number, e: 'inOut' | 'out' | 'in' | 'linear' = 'inOut') => {
    k.move(`${id}.x`, x, t, dur, e);
    if (dur > 0.1) hop(id, t, dur);
  };
  /** The wave machine: a row rocks from side to side on its crank. */
  const rock = (id: string, from: number, to: number, amp: number, period: number) => {
    for (let t = from, i = 0; t < to - period / 2; t += period / 2, i++) k.move(`${id}.x`, i % 2 ? amp : -amp, t, period / 2, 'sine');
    k.move(`${id}.x`, 0, to - period / 2, period / 2, 'sine');
  };
  /** A boat pitches on the swell: its bow rises and falls. */
  const pitch = (id: string, from: number, to: number, deg: number, period: number) => {
    for (let t = from, i = 0; t < to - period / 2; t += period / 2, i++) k.move(`${id}.rz`, i % 2 ? deg : -deg, t, period / 2, 'sine');
    k.move(`${id}.rz`, 0, to - period / 2, period / 2, 'sine');
  };
  /** A boat sails across on its wire, pitching as it goes. */
  const sail = (id: string, t: number, dur: number, from: number, to: number, deg = 5, period = 2.2) => {
    tl.set(`${id}.x`, from, t - 0.01);
    k.pop(id, true, t);
    k.move(`${id}.x`, to, t, dur, 'linear');
    pitch(id, t, t + dur, deg, period);
  };
  /** The lens turns: the beam sweeps across the sea and back. */
  const sweep = (from: number, to: number, period: number, wide = 3.4) => {
    for (let t = from, i = 0; t < to - period / 2; t += period / 2, i++) k.aim('ray', i % 2 ? wide : -wide, 0.2, -1.4, t, period / 2, 'sine');
  };
  const follow = (x: number, z: number, t: number, dur = 0.8, level = 0.6, color = 0xfff0dc, y = 0.85) => {
    k.aim('follow', x, y, z, t, dur);
    k.look(t, dur, { follow: [level, color] });
  };
  const night = (t: number, dur = 2, level = 1) => k.look(t, dur, {
    fohL: [0.12 * level, 0x9aa8d8], fohR: [0.1 * level, 0x8f9fd0], left: [0.06 * level, 0x8090c0], right: [0.06 * level, 0x8090c0],
    back: [0.26 * level, 0x8fa8e0], foot: 0.2 * level, ambient: 0.14 * level,
  });
  const day = (t: number, dur = 2, level = 1) => k.look(t, dur, {
    fohL: [0.34 * level, 0xfff0d8], fohR: [0.3 * level, 0xfff4e8], left: [0.16 * level, 0xffe0b8], right: [0.16 * level, 0xfff0d8],
    back: [0.18 * level, 0xffe0b0], foot: 0.4 * level, ambient: 0.3 * level,
  });
  const beam = (t: number, level: number, dur = 0.6) => k.look(t, dur, { ray: level });

  const pre1 = L(8), c1 = L(10), v3 = L(18), v4 = L(22), pre2 = L(26), c2 = L(28), st = L(36), brk = L(42), c3 = L(44), c4 = L(52), wh = L(56);

  // ---- preroll: the house settles. The traveller hangs closed.
  const P = -7;
  tl.set('curtain.style', curtainStyleIndex('traveller'), P);
  k.cam(P, 0.01, { x: 0, y: 0.95, z: 9.4, lx: 0, ly: 1.05, lz: -1, fov: 27 });
  k.look(P + 1, 3.5, { house: 0, fohL: 0.12, fohR: 0.1, foot: 0.9, ambient: 0.25 });
  k.aim('follow', 0, 1.0, -0.14, P);
  k.look(P + 3.5, 1.5, { follow: [0.5, 0xffe4bc] });
  tl.set('surtitles.i', 0, P);
  tl.base('haze', 1.6);
  k.place('ray', LENS.x, LENS.y, LENS.z, P);
  tl.set('ray.r', 1, P).set('ray.g', 0.86, P).set('ray.b', 0.6, P);

  // ---- intro: night, a black sea. A boat pitches on the swell and goes down. The women hold up their lanterns.
  k.move('curtain.open', 1, 0.3, 4.5, 'inOut');
  sky(0, 3, ...NIGHT, [0.45, 0.45, 0.3], 0.1);
  night(0.3, 3);
  k.move('stars.i', 0.6, 0, 3);
  rock('waves1', 0, 72, 0.09, 3.0);
  rock('waves2', 0.6, 72, 0.08, 3.5);
  rock('waves3', 1.1, 72, 0.06, 4.1);
  tl.set('boat1.x', -0.6, 0);
  k.pop('boat1', true, 1);
  pitch('boat1', 1, 12, 10, 1.8);
  k.move('boat1.x', 0.4, 1, 10, 'linear');
  // The swell takes it: the boat sinks behind the far row.
  k.move('boat1.rz', -28, 9.5, 2, 'in');
  k.move('boat1.y', -0.75, 9.8, 2.4, 'in');
  k.pop('boat1', false, 12.4);
  follow(0.2, -2.1, 3, 2, 0.45, 0xc8d4f0, 0.3);
  // The women come up onto the rock with their lanterns once the boat has gone.
  k.enter('women', 11.5, 2.4, 'out');
  k.move('women.glow', 0.5, 12, 2);
  k.look(12, 2.4, { lamp: [0.5, 0xffb060] });
  k.place('lamp', -0.4, 0.55, -1.6, 0);
  k.leave('women', 16.5, 2.6, 'in');
  k.cam(0.3, 18, { z: 8.4, ly: 1.0, x: 0, lx: 0 });

  // ---- verse 1: the building. The village hauls the stones. The tower rises one course a line.
  tl.set('surtitles.i', 1, L(0) - 1);
  sky(L(0) - 2, 4, ...DAWN, [0.7, 0.75, 0.5], 0.18);
  day(L(0) - 1.5, 3, 0.85);
  k.look(L(0) - 1, 2, { lamp: 0 });
  k.move('stars.i', 0, L(0) - 2, 3);
  k.leave('moon', L(0) - 2, 3, 'in');
  k.enter('scaffold', L(0) - 2, 3, 'out');
  k.enter('matteo', L(0) - 1.5, 2.4, 'out');
  tl.set('haulers.x', -2.6, 0);
  k.enter('haulers', L(0) - 1.4, 1.8, 'out');
  k.move('haulers.x', -0.6, L(0) - 1.4, 2, 'out');
  // The haulers lean back on the rope in time with the beat, all through the building.
  k.downbeats(L(0), L(7) + 1).forEach((b, i) => {
    k.move('haulers.rz', 3.5, b - 0.15, 0.35, 'out');
    k.move('haulers.rz', 0, b + 0.4, 0.8, 'inOut');
    k.move('haulers.x', -0.6 - (i % 2 ? 0.06 : 0), b, 0.6, 'inOut');
  });
  // Each line, a stone swings up on the pulley and a course of the tower rises from the trap.
  for (let n = 0; n < 4; n++) {
    const t = L(n);
    tl.set('stone.y', 0, t - 1.2);
    k.enter('stone', t - 1.2, 0.4, 'out');
    k.move('stone.y', 1.25 + n * 0.15, t - 0.8, 2.6, 'inOut');
    k.move('stone.rz', 6, t - 0.4, 1.2, 'sine');
    k.move('stone.rz', 0, t + 0.8, 1.2, 'sine');
    k.leave('stone', t + 2.2, 0.5, 'in');
    k.enter(`drum${n + 1}`, t + 1.6, 2.4, 'out');
    // Matteo hauls: the fist arm pulls down, then reaches again.
    k.move('matteo.armA', 40, t - 1, 0.8, 'out');
    k.move('matteo.armA', -10, t + 0.2, 1.2, 'inOut');
    k.move('matteo.armA', 30, t + 2.4, 1, 'inOut');
  }
  follow(MATTEO.x, MATTEO.z, L(0) - 0.5, 1.2, 0.55);
  k.move('matteo.head', 10, L(1), 1.2);
  // 2 Ogni inverno il mare prendeva un figlio — he looks out to sea.
  k.move('matteo.head', -8, L(2) + 0.4, 1.2);
  face('matteo', L(2) + 0.2, true);
  face('matteo', L(3) - 0.2, false);
  k.cam(L(0), 12, { z: 8.0, ly: 1.15, x: 0.4, lx: 0.45 });
  k.move('dust.i', 1.2, L(0), 3);

  // ---- verse 2: Lucia brings water and bread. The baby sleeps in the rope basket. The first flame.
  k.move('matteo.armA', 0, L(4) - 1, 1);
  tl.set('lucia.x', -3.4, 0);
  k.pop('lucia', true, L(4) - 1.6);
  walk('lucia', L(4) - 1.6, 2.4, 0.15, 'out');
  k.move('lucia.armA', 30, L(4) + 0.2, 1, 'out');
  follow(LUCIA.x, LUCIA.z, L(4) - 0.4, 1.2, 0.6);
  // 5 tu cantavi piano contro il freddo — she looks up at him.
  k.move('lucia.head', 10, L(5), 1);
  k.move('matteo.head', 4, L(5) + 0.4, 1);
  // 6 Nostro figlio dormiva in una cesta di corda — the basket swings down on its cords.
  k.enter('baby', L(6) - 0.8, 1.8, 'out');
  tl.base('baby.sway', 0.6);
  k.move('lucia.armB', 40, L(6) + 0.4, 1.2);
  follow(0.85, -1.45, L(6), 1, 0.6, 0xffe8c8, 1.0);
  // 7 sotto la prima fiamma accesa — the lantern room comes down onto the tower, and the first flame is lit.
  k.enter('lantern', L(7) - 1.6, 2.2, 'out');
  k.move('lantern.glow', 0.9, L(7) + 0.6, 1);
  k.look(L(7) + 0.6, 1, { lamp: [0.9, 0xffc070] });
  k.place('lamp', LENS.x, LENS.y, LENS.z + 0.25, L(7));
  k.cam(L(4), 10, { z: 7.6, ly: 1.15, x: 0.2, lx: 0.25 });

  // ---- pre-chorus 1: the scaffold flies out. Dusk falls. "Gira la lanterna": the lens begins to turn.
  k.leave('scaffold', pre1 - 1.6, 2.6, 'in');
  k.leave('haulers', pre1 - 1.4, 2, 'in');
  k.leave('baby', pre1 + 2, 2, 'in');
  k.move('lucia.armA', 0, pre1, 1);
  k.move('lucia.armB', 0, pre1, 1);
  k.move('dust.i', 0.5, pre1, 3);
  sky(pre1 - 1, 4, ...DUSK, [0.6, 0.75, 0.45], 0.14);
  k.look(pre1 - 1, 3, { fohL: [0.22, 0xffb890], fohR: [0.18, 0xd8a0c0], left: [0.2, 0xff9060], back: [0.26, 0xff9050], foot: 0.3, ambient: 0.2 });
  beam(pre1 + 0.4, 0.5, 2);
  k.aim('ray', -3.4, 0.2, -1.4, pre1, 0.01);
  sweep(pre1 + 0.4, c1 + 1, 4.6);
  face('matteo', pre1, false);
  k.move('matteo.head', 16, pre1, 1.4);
  k.move('lucia.head', 16, L(9), 1.4);

  // ---- chorus 1: night. The beam sweeps the sea. The boats come home one by one. The women lift their lanterns.
  sky(c1 - 1, 2, ...NIGHT, [0.5, 0.5, 0.35], 0.12);
  night(c1 - 0.6, 1.6);
  k.move('stars.i', 0.5, c1 - 1, 2);
  k.enter('moon', c1 - 1, 2.6, 'out');
  k.enter('quay', c1 - 1.6, 2, 'out');
  k.enter('women', c1 - 1.2, 2.2, 'out');
  k.move('women.glow', 0.55, c1, 1.5);
  sweep(c1 + 1, E('ch1') + 2, 3.6);
  // Each boat comes in from the left along its row of waves and makes the quay.
  sail('boat1', c1 - 0.4, 7.5, -3.6, -0.9);
  tl.set('boat1.y', 0, c1 - 0.5).set('boat1.rz', 0, c1 - 0.5);
  sail('boat3', L(12) - 0.4, 7, -3.8, -1.6);
  sail('boat2', L(14) - 0.6, 6.5, -3.6, -0.2);
  // The choir answers "torna a casa!": the women lift their lanterns high.
  for (const n of [11, 17]) {
    k.move('women.y', 0.1, L(n) - 0.2, 0.3, 'out');
    k.move('women.y', 0, L(n) + 0.9, 0.6);
    k.flash('lamp', L(n), 0.9, 0.5, 0.05, 0.8);
  }
  k.move('matteo.armB', 60, L(10), 1, 'outBack');
  k.move('matteo.armB', 20, L(13), 1);
  k.move('lucia.armB', 50, L(16), 1);
  follow(-0.2, -1.2, c1, 1, 0.55, 0xffe8c8);
  k.cam(c1, 6, { z: 8.4, ly: 1.15, x: 0, lx: 0 });

  // ---- interlude: twenty years. The moon and the sun cross. The boy waves on the quay. Then Nino sails at dawn.
  const yr = E('ch1') + 0.5;
  for (const id of ['boat1', 'boat2', 'boat3']) k.pop(id, false, yr + 1);
  k.move('matteo.armB', 0, yr, 1);
  k.move('lucia.armB', 0, yr, 1);
  k.leave('moon', yr, 3, 'in');
  k.enter('sun', yr + 2, 3, 'out');
  k.move('sun.x', 3.2, yr + 2, 10, 'linear');
  sky(yr + 1, 3, ...DAY, [0.7, 0.75, 0.5], 0.2);
  day(yr + 1, 3);
  beam(yr + 1, 0, 2);
  k.move('women.glow', 0, yr, 2);
  k.leave('women', yr + 1, 2.4, 'in');
  k.enter('village', yr + 1, 3, 'out');
  tl.set('boy.x', 2.6, 0);
  k.pop('boy', true, yr + 2);
  walk('boy', yr + 2, 2.4, 0.95, 'out');
  k.move('boy.rz', -6, yr + 5, 0.5, 'sine');
  k.move('boy.rz', 4, yr + 5.5, 0.5, 'sine');
  k.move('boy.rz', 0, yr + 6, 0.5, 'sine');
  k.pop('boy', false, yr + 8.8);
  sky(yr + 8, 4, ...DAWN, [0.7, 0.8, 0.5], 0.16);
  // The boy is grown: Nino's red sail goes out at dawn, with the others.
  sail('ninoboat', yr + 9, 9, -1.6, 3.6, 6, 2.4);
  k.cam(yr, 14, { z: 8.6, ly: 1.15, x: 0, lx: 0 });

  // ---- verse 3: Lucia on the quay counts the sails, one by one.
  sail('boat3', v3 - 1, 8.5, -0.8, 3.8);
  sail('boat4', v3 + 1.2, 8, -1.2, 3.8);
  face('lucia', v3 - 0.6, true);
  walk('lucia', v3 - 0.6, 1.4, -0.2);
  k.move('lucia.armB', 70, L(21), 0.5, 'out');
  [0, 0.8, 1.6].forEach((dt, i) => k.move('lucia.armB', i % 2 ? 40 : 70, L(21) + dt, 0.4, 'sine'));
  k.move('lucia.armB', 0, L(21) + 2.6, 1);
  follow(LUCIA.x - 0.35, LUCIA.z, v3, 1, 0.65, 0xfff0d8);

  // ---- verse 4: Matteo winds the clockwork. The iron weight sinks slowly down the tower on its chain.
  face('lucia', v4 - 0.4, false);
  k.enter('weight', v4 - 1.4, 1.6, 'out');
  k.move('weight.y', -0.55, v4, (pre2 - v4) + 8, 'linear');
  walk('matteo', v4 - 1, 1.6, 1.05);
  for (let t = v4, i = 0; t < L(25) + 2; t += 1.1, i++) k.move('matteo.armA', i % 2 ? -20 : 45, t, 1.1, 'sine');
  k.move('matteo.armA', 0, L(25) + 2.2, 1);
  k.move('matteo.head', 12, L(24), 1);
  follow(MATTEO.x + 1.05, MATTEO.z, v4, 1, 0.6);
  k.leave('village', L(24), 3, 'in');
  sky(L(24), 4, ...DUSK, [0.6, 0.7, 0.45], 0.14);
  k.cam(v4, 8, { z: 7.8, ly: 1.2, x: 0.3, lx: 0.4 });

  // ---- pre-chorus 2: night. Storm clouds come in. The lens turns again.
  sky(pre2 - 1, 3, ...NIGHT, [0.45, 0.45, 0.3], 0.1);
  night(pre2 - 1, 2.4, 0.9);
  k.enter('clouds', pre2 - 1, 3, 'out');
  tl.base('clouds.sway', 0.5);
  beam(pre2, 0.5, 1.6);
  k.aim('ray', -3.4, 0.2, -1.4, pre2, 0.01);
  sweep(pre2, st, 3.2);
  rock('waves1', pre2, c3 + 2, 0.12, 2.4);
  rock('waves2', pre2 + 0.4, c3 + 2, 0.11, 2.8);
  rock('waves3', pre2 + 0.8, c3 + 2, 0.09, 3.2);
  walk('matteo', pre2, 1.4, 0);

  // ---- chorus 2: rain. The women on the quay, the beam, the boats out on a rising sea.
  tl.set('rain.x0', -3.2, c2 - 1).set('rain.x1', 3.2, c2 - 1);
  k.move('rain.rate', 0.45, c2 - 1, 3);
  k.enter('women', c2 - 1, 2, 'out');
  k.move('women.glow', 0.55, c2, 1.5);
  tl.set('boat1.y', 0, c2 - 1).set('boat1.rz', 0, c2 - 1);
  sail('boat1', c2, 14, 3.6, -3.6, 9, 1.8);
  sail('ninoboat', c2 + 2, 12, 3.6, -1.2, 10, 1.6);
  for (const n of [29, 35]) {
    k.move('women.y', 0.1, L(n) - 0.2, 0.3, 'out');
    k.move('women.y', 0, L(n) + 0.9, 0.6);
  }
  k.move('matteo.armB', 60, L(28), 1, 'outBack');
  k.move('matteo.armB', 20, L(31), 1);
  k.move('lucia.armB', 50, L(34), 1);
  k.cam(c2, 8, { z: 8.6, ly: 1.15, x: 0, lx: 0 });

  // ---- the storm. The chain snaps. Matteo turns the lens by hand. Lucia carries the oil up the stair.
  sky(st - 0.5, 0.8, ...STORM, [0.4, 0.45, 0.3], 0.1);
  k.move('rain.rate', 1, st - 0.4, 0.8);
  k.move('haze', 2.8, st - 0.5, 1);
  // 36 la catena si spezza — a crack of lightning. The weight drops through the trap. The beam stops dead.
  k.flash('fohL', st, 1.1, 0.4, 0.02, 0.3);
  k.flash('fohR', st + 0.15, 0.9, 0.35, 0.02, 0.3);
  k.move('weight.y', -2.2, st + 0.1, 0.5, 'in');
  k.pop('weight', false, st + 0.7);
  beam(st + 0.1, 0.05, 0.2);
  // He runs to the great wheel. It comes down in front of him, and he throws his weight on it.
  k.enter('wheel', st - 0.2, 0.8, 'out');
  walk('matteo', st, 0.9, -0.55);
  face('matteo', st, true);
  // The wheel turns as he hauls, a quarter turn a beat, all through the storm and the last choruses.
  const turnFrom = st + 0.9, turnTo = wh - 2;
  for (let t = turnFrom, i = 0; t < turnTo; t += 0.9, i++) {
    k.move('wheel.rz', -(i + 1) * 45, t, 0.9, 'inOut');
    k.move('matteo.armA', i % 2 ? -25 : 50, t, 0.9, 'sine');
    k.move('matteo.armB', i % 2 ? 70 : 30, t, 0.9, 'sine');
  }
  beam(st + 1, 0.6, 0.4);
  sweep(st + 1, brk - 2, 2.2);
  // 37 / 39 Gira, gira, gira! — the lightning on the choir.
  [L(37), L(37) + 0.5, L(39), L(39) + 0.4].forEach((t, i) => k.flash(i % 2 ? 'fohR' : 'fohL', t, 0.9, 0.35, 0.02, 0.25));
  k.flash('back', L(41) - 0.5, 1, 0.4, 0.02, 0.4);
  // 38 Lucia porta l'olio — the tower opens: the stair inside. Lucia climbs with the oil can.
  k.enter('stair', L(38) - 1, 0.9, 'out');
  for (const [ch, v] of [['lucia.x', TX - 0.35 - LUCIA.x], ['lucia.z', TZ + 0.3 - LUCIA.z], ['lucia.s', 0.55], ['lucia.armA', 0], ['lucia.armB', 0]] as const) tl.set(ch, v, L(38) - 0.2);
  face('lucia', L(38) - 0.2, false);
  k.move('lucia.y', 1.35, L(38) - 0.1, 7, 'inOut');
  [0, 1.2, 2.4, 3.6, 4.8, 6].forEach((dt, i) => k.move('lucia.x', TX - LUCIA.x + (i % 2 ? 0.25 : -0.3), L(38) + dt, 1.2, 'sine'));
  hop('lucia', L(38), 7);
  // 40 Una vela, due vele, dieci vele tornano — the boats come home, fast, on the beam.
  sail('boat3', L(40) - 1, 4, -3.8, -0.4, 12, 1.2);
  sail('boat2', L(40) - 0.2, 3.8, -3.8, 0.4, 12, 1.2);
  sail('boat4', L(40) + 0.8, 3.6, -3.8, -1.3, 12, 1.2);
  // 41 ma la vela di Nino non si vede — one cold beam on the empty mooring. The red sail never comes.
  follow(-0.2, -1.5, L(41), 0.6, 0.85, 0xc8d8ff, 0.2);
  k.cam(st, 10, { z: 7.8, ly: 1.15, x: 0, lx: 0 });

  // ---- the break: grey dawn. The rain stops. The empty boat slides in onto the sand. Lucia kneels beside it.
  for (const id of ['boat1', 'boat2', 'boat3', 'boat4', 'ninoboat']) k.pop(id, false, brk - 2);
  k.move('rain.rate', 0, brk - 3, 3);
  k.leave('clouds', brk - 2, 3, 'in');
  k.leave('stair', brk - 1.6, 2, 'in');
  k.leave('women', brk - 2, 2, 'in');
  sky(brk - 2, 4, ...GREY, [0.6, 0.65, 0.45], 0.16);
  day(brk - 2, 3, 0.7);
  beam(brk - 2, 0, 2);
  // Lucia comes down to the shore.
  for (const [ch, v] of [['lucia.x', 0.45], ['lucia.y', 0], ['lucia.z', 0.05], ['lucia.s', 1]] as const) tl.set(ch, v, brk - 1.7);
  face('lucia', brk - 1.7, true);
  tl.set('empty.x', 3, 0);
  k.pop('empty', true, brk - 1.2);
  k.move('empty.x', 0.2, brk - 1.2, 4.5, 'out');
  k.move('empty.rz', -4, brk + 2.4, 1.6, 'out');
  // 43 vuota, leggera, sulla sabbia — she kneels and lays her hand on its side.
  k.move('lucia.y', -0.2, L(43) - 0.6, 1.4, 'inOut');
  k.move('lucia.rz', 8, L(43) - 0.6, 1.4, 'inOut');
  k.move('lucia.armB', 40, L(43), 1.2);
  k.move('lucia.head', -14, L(43), 1.2);
  k.move('matteo.armA', 0, brk, 1);
  k.move('matteo.armB', 0, brk, 1);
  k.move('matteo.head', -16, L(43), 1.4);
  follow(0.35, -1.1, brk - 0.6, 1.4, 0.75, 0xe8ecf4, 0.5);
  k.cam(brk - 1, 8, { z: 7.0, ly: 0.95, x: 0.2, lx: 0.3 });

  // ---- final chorus: night again. The women line the quay with lanterns for other boats. The wheel turns again.
  sky(E('break') + 1, 4, ...NIGHT, [0.45, 0.45, 0.3], 0.1);
  night(E('break') + 1, 3);
  k.move('stars.i', 0.5, E('break') + 1, 3);
  k.enter('moon', E('break') + 1.5, 3, 'out');
  k.enter('women', c3 - 1.5, 2.4, 'out');
  k.move('women.glow', 0.6, c3, 1.5);
  k.move('lucia.y', 0, c3 - 3, 1.6);
  k.move('lucia.rz', 0, c3 - 3, 1.6);
  k.move('lucia.armB', 0, c3 - 3, 1);
  k.leave('empty', c3 - 2.6, 3, 'in');
  beam(c3 - 0.5, 0.65, 1.4);
  sweep(c3, c4, 3.2);
  sail('boat3', c3, 9, -3.8, -0.6);
  sail('boat1', L(48) - 1, 8.5, -3.8, 0.4);
  // 48 Anche se il mio / 49 non torna più — Matteo stops at the wheel. His head goes down. Then he turns it again.
  k.move('matteo.head', -18, L(48), 0.8);
  k.move('matteo.head', 8, L(50), 1.2);
  // Lucia climbs again, carrying the oil, as she will every night.
  k.enter('stair', L(46) - 1, 1.2, 'out');
  for (const [ch, v] of [['lucia.x', TX - 0.35 - LUCIA.x], ['lucia.z', TZ + 0.3 - LUCIA.z], ['lucia.s', 0.55], ['lucia.head', 0]] as const) tl.set(ch, v, L(46) - 0.6);
  face('lucia', L(46) - 0.6, false);
  k.move('lucia.y', 1.35, L(46), 9, 'inOut');
  [0, 1.5, 3, 4.5, 6, 7.5].forEach((dt, i) => k.move('lucia.x', TX - LUCIA.x + (i % 2 ? 0.25 : -0.3), L(46) + dt, 1.5, 'sine'));
  hop('lucia', L(46), 9);
  follow(-0.55, -1.2, c3, 1, 0.7);
  k.cam(c3, 8, { z: 8.2, ly: 1.2, x: 0.1, lx: 0.2 });

  // ---- the held hook: the beam turns out over the house, across the audience, and back to the sea.
  beam(c4 + 0.6, 0.3, 1.4);
  k.move('haze', 1.2, c4, 2);
  k.aim('ray', 0, 1.2, 9, c4 + 1, 2.6, 'inOut');
  k.aim('ray', -3, 0.6, 6, c4 + 4, 2.4, 'inOut');
  k.aim('ray', 3, 0.6, 6, c4 + 7, 3, 'inOut');
  beam(c4 + 9.6, 0.6, 1.4);
  sweep(c4 + 10, wh, 3.6);
  k.move('women.y', 0.1, L(53) - 0.2, 0.3, 'out');
  k.move('women.y', 0, L(53) + 0.9, 0.6);
  k.cam(c4, 10, { z: 8.8, ly: 1.15, x: 0, lx: 0 });

  // ---- the whisper: "Accendi, Matteo. È sera." The lamp burns. The traveller closes while the beam turns on.
  k.leave('stair', wh - 2.6, 2, 'in');
  for (const [ch, v] of [['lucia.x', 0.5], ['lucia.y', 0], ['lucia.z', 0], ['lucia.s', 1]] as const) tl.set(ch, v, wh - 0.8);
  face('lucia', wh - 0.8, true);
  k.move('lucia.armB', 30, wh, 1.2);
  k.move('matteo.head', 10, wh + 0.6, 1);
  k.move('lantern.glow', 1.2, wh + 2, 0.4);
  follow(0.1, -1.2, wh - 0.6, 1, 0.65, 0xffe8c8);
  k.cam(wh - 1, 8, { z: 7.6, ly: 1.1, x: 0, lx: 0 });

  // ---- the end: the traveller closes. The beam keeps turning on the curtain. In the call, the two bow together.
  tl.set('surtitles.i', 0, end - 3.6);
  k.cam(end - 4.8, 4.2, { z: 9.4, x: 0, lx: 0, y: 0.95, ly: 1.05 });
  k.move('curtain.open', 0, end - 3.8, 3.4, 'inOut');
  k.look(end - 1, 2, { follow: 0, house: 0.25 });
  for (const [ch, v] of [['matteo.x', 0.45], ['matteo.z', 0.75], ['matteo.head', 0], ['matteo.armA', 0], ['matteo.armB', 0], ['matteo.turn', 0], ['lucia.x', -0.5], ['lucia.z', 0.8], ['lucia.head', 0], ['lucia.armA', 0], ['lucia.armB', 0], ['lucia.turn', 0], ['lucia.rz', 0]] as const) k.move(ch, v, end - 1.9, 0.01);
  k.pop('wheel', false, end - 2);
  k.move('curtain.open', 0.5, end + 0.8, 1.6, 'out');
  k.look(end + 0.6, 0.8, { follow: [0.7, 0xffe6c4] });
  k.aim('follow', 0, 1.0, -0.5, end + 0.5, 0.01);
  k.move('matteo.rz', -18, end + 2.4, 0.5);
  k.move('lucia.rz', 18, end + 2.4, 0.5);
  k.move('matteo.rz', 0, end + 3, 0.5);
  k.move('lucia.rz', 0, end + 3, 0.5);
  k.move('curtain.open', 0, end + 4.2, 1.8, 'inOut');
  k.look(end + 4.6, 1.5, { follow: 0, house: 0.7, ray: 0 });
}

const production: Production = {
  id: 'finche-ce-luce',
  no: 13,
  title: { it: 'Finché c\'è luce', en: 'As Long as There Is Light', id: 'Selama Masih Ada Cahaya', zh: '只要还有光' },
  poster: urls['./art/cut/poster.webp']!,
  audio,
  master,
  pieces,
  curtain: { open: 'traveller', close: 'traveller' },
  preroll: 7,
  postroll: 7,
  surtitles: { main: 'it', second: 'id' },
  bill: {
    about: 'A fishing village builds a lighthouse. On the night of the great storm, its beam brings every boat home except their son\'s. Matteo and Lucia light it again the next evening. They sing in Italian.',
    cast: [['Matteo, the keeper', 'Voice'], ['Lucia, his wife', 'Voice'], ['Nino, their son', 'On slides'], ['The village', 'Chorus']],
    scenes: ['The black sea', 'The building of the tower', 'The first light', 'The storm', 'The empty boat'],
  },
  voices: {
    matteo: { name: 'Matteo', color: '#e8dcc0' },
    lucia: { name: 'Lucia', color: '#f0d0c0' },
    choir: { name: 'Il paese', color: '#c8d4e4' },
    both: { name: 'Matteo · Lucia', color: '#f0e4c8' },
  },
  cues,
};

export default production;
