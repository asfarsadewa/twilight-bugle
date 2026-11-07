// Urip Maneh · 再世相逢 · Alive Again
// The cue sheet follows take A of the film's song (song/master.json). Line numbers below are the sung lines.
// Heights (y) are above the stage floor. The stage opening is about 5.5 wide and 2.4 high. Depth runs to z = -4.
//
// Two souls miss each other across four lives in Java, painted as one wayang beber scroll. The kayon crosses on its
// rod at each change of life. The carver, the clerk and the two people of today are marionettes. The lives between
// are cards on tin wires. In the chorus the two souls are wayang kulit figures on rods against a real lit screen.

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

// The painter drew the heads large on the sheets. A part's sheet size sets its scale, so a head takes a smaller one.
const HEAD = 0.62;
const p = (a: Art, pivot: [number, number], rest: Partial<PartSpec> = {}, scale = 1): PartSpec => ({ art: a, sheet: [a.w * scale, a.h * scale], pivot, ...rest });
const rig = (name: string, k: number) => part(name, k);

const CARVE = { x: -0.62, y: 0, z: -1.3 };
const MEET = { x: 0, y: 0, z: -1.3 };

const pieces: PieceSpec[] = [
  { id: 'sun', kind: 'prop', art: art('prop-sun'), width: 0.95, anchor: 'center', home: { x: 1.15, y: 1.75, z: -3.4 }, route: 'trap', rod: true, glow: 0.35, shadow: false },
  { id: 'candi', kind: 'flat', art: art('flat-candi'), width: 5.8, home: { x: 0, y: -1.5, z: -3.0 }, route: 'fly' },
  { id: 'candiold', kind: 'flat', art: art('flat-candi-old'), width: 5.8, home: { x: 0, y: -1.5, z: -3.0 }, route: 'fly' },
  { id: 'port', kind: 'flat', art: art('flat-port'), width: 5.4, home: { x: 0, y: -0.28, z: -3.05 }, route: 'fly' },
  { id: 'street', kind: 'flat', art: art('flat-street'), width: 5.4, home: { x: 0, y: -0.25, z: -3.05 }, route: 'fly' },
  { id: 'moon', kind: 'prop', art: art('prop-moon'), width: 0.5, anchor: 'center', home: { x: -1.9, y: 1.95, z: -2.8 }, route: 'fly', strings: [[0.5, 0.04]], glow: 0.3, shadow: false },
  { id: 'ship', kind: 'prop', art: art('prop-ship'), width: 3.0, home: { x: -0.8, y: 0.28, z: -2.3 }, route: 'right', slide: 'right', glow: 0.1 },
  { id: 'crowd', kind: 'flat', art: art('flat-crowd'), width: 3.0, home: { x: -1.5, y: 0, z: -2.15 }, route: 'left', slide: 'left', silhouette: { color: 0x1a1226 } },
  { id: 'crowd2', kind: 'flat', art: art('flat-crowd'), width: 3.0, home: { x: 1.5, y: 0, z: -2.1 }, route: 'right', slide: 'right', mirror: true, silhouette: { color: 0x1a1226 } },
  { id: 'waves2', kind: 'flat', art: art('flat-waves'), width: 6.6, home: { x: 0.2, y: -0.95, z: -2.0 }, route: 'trap', rod: true, mirror: true },
  { id: 'noble', kind: 'prop', art: art('prop-noble'), height: 1.3, home: { x: 0, y: 0, z: -1.95 }, route: 'right', slide: 'right' },
  { id: 'relief', kind: 'prop', art: art('prop-relief'), width: 0.86, home: { x: 0.1, y: 0, z: -1.8 }, route: 'trap', rod: true },
  { id: 'reliefold', kind: 'prop', art: art('prop-relief-old'), width: 0.86, home: { x: 0, y: 0, z: -1.8 }, route: 'trap', rod: true },
  { id: 'blank', kind: 'prop', art: art('prop-blank'), width: 0.86, home: { x: 0.1, y: 0, z: -1.76 }, route: 'trap' },
  { id: 'kelir', kind: 'flat', art: art('flat-kelir'), width: 5.0, home: { x: 0, y: 0.02, z: -1.75 }, route: 'fly', startIn: true },
  {
    id: 'shadowhe', kind: 'puppet', home: { x: -1, y: 0.22, z: -1.68 }, route: 'trap', rod: true,
    puppet: {
      height: 1.5, faces: 'right',
      body: p(rig('shadow-he', 0), [0.5, 1]),
      armA: p(rig('shadow-he', 2), [0.06, 0.14], { attach: [0.45, 0.31], z: 1, rest: -30 }, 0.8),
      armB: p(rig('shadow-he', 1), [0.065, 0.46], { attach: [0.45, 0.31], z: 1.1, rest: -8 }, 0.8),
    },
  },
  {
    id: 'shadowshe', kind: 'puppet', home: { x: 1, y: 0.22, z: -1.67 }, route: 'trap', rod: true,
    puppet: {
      height: 1.42, faces: 'left',
      body: p(rig('shadow-she', 0), [0.5, 1]),
      armA: p(rig('shadow-she', 2), [0.13, 0.045], { attach: [0.38, 0.33], z: 1, rest: 40 }, 0.8),
      armB: p(rig('shadow-she', 1), [0.87, 0.045], { attach: [0.38, 0.33], z: 1.1, rest: -42 }, 0.8),
    },
  },
  { id: 'lamps', kind: 'prop', art: art('prop-lamps'), width: 2.5, anchor: 'center', home: { x: 0.5, y: 1.95, z: -1.65 }, route: 'fly', strings: [[0.03, 0.08], [0.5, 0.06], [0.97, 0.08]], glow: 0.08 },
  { id: 'waves1', kind: 'flat', art: art('flat-waves'), width: 6.6, home: { x: -0.2, y: -1.12, z: -1.6 }, route: 'trap', rod: true },
  { id: 'man90', kind: 'prop', art: art('prop-man90'), height: 1.2, home: { x: 0, y: 0, z: -1.42 }, route: 'left', slide: 'left' },
  { id: 'woman90', kind: 'prop', art: art('prop-woman90'), height: 1.15, home: { x: 0, y: 0, z: -1.36 }, route: 'right', slide: 'right' },
  {
    id: 'carver', kind: 'puppet', home: CARVE, route: 'fly',
    puppet: {
      height: 0.98, faces: 'right',
      body: p(rig('puppet-carver', 1), [0.5, 1]),
      head: p(rig('puppet-carver', 0), [0.527, 0.895], { attach: [0.535, 0.05], z: -0.6, string: [0.45, 0.05] }, HEAD),
      armA: p(rig('puppet-carver', 2), [0.189, 0.097], { attach: [0.84, 0.092], z: 1, rest: 25, string: [0.62, 0.8] }),
      armB: p(rig('puppet-carver', 3), [0.37, 0.093], { attach: [0.235, 0.09], z: 1.1, rest: 5, string: [0.62, 0.75] }),
    },
  },
  {
    id: 'clerk', kind: 'puppet', home: { x: 0, y: 0, z: -1.25 }, route: 'left',
    puppet: {
      height: 0.98, faces: 'right',
      body: p(rig('puppet-clerk', 1), [0.5, 1]),
      head: p(rig('puppet-clerk', 0), [0.523, 0.916], { attach: [0.536, 0.035], z: -0.6, string: [0.5, 0.05] }, HEAD),
      armA: p(rig('puppet-clerk', 3), [0.341, 0.07], { attach: [0.346, 0.089], z: 1, string: [0.5, 0.92] }),
      armB: p(rig('puppet-clerk', 2), [0.16, 0.096], { attach: [0.707, 0.089], z: 1.1, rest: 10, string: [0.72, 0.75] }),
    },
  },
  { id: 'kayon', kind: 'prop', art: art('prop-kayon'), height: 2.15, home: { x: 0, y: 0.02, z: -0.72 }, route: 'trap', rod: true, startIn: true },
  { id: 'gamelan', kind: 'flat', art: art('flat-gamelan'), width: 4.6, home: { x: 0, y: -0.86, z: -0.6 }, route: 'trap', rod: true, startIn: true },
  {
    id: 'man', kind: 'puppet', home: MEET, route: 'left',
    puppet: {
      height: 0.98, faces: 'right',
      body: p(rig('puppet-man', 1), [0.5, 1]),
      head: p(rig('puppet-man', 0), [0.415, 0.877], { attach: [0.537, 0.05], z: -0.6, string: [0.45, 0.05] }, HEAD),
      armA: p(rig('puppet-man', 2), [0.303, 0.063], { attach: [0.244, 0.094], z: 1, string: [0.6, 0.9] }),
      armB: p(rig('puppet-man', 3), [0.173, 0.116], { attach: [0.83, 0.094], z: 1.1, rest: 20, string: [0.75, 0.55] }),
    },
  },
  {
    id: 'woman', kind: 'puppet', home: { x: 0, y: 0, z: -1.26 }, route: 'right',
    puppet: {
      height: 0.94, faces: 'left',
      body: p(rig('puppet-woman', 1), [0.5, 1]),
      head: p(rig('puppet-woman', 0), [0.408, 0.908], { attach: [0.545, 0.04], z: -0.6, string: [0.45, 0.05] }, HEAD),
      armA: p(rig('puppet-woman', 3), [0.219, 0.068], { attach: [0.818, 0.083], z: 1, string: [0.6, 0.9] }),
      armB: p(rig('puppet-woman', 2), [0.862, 0.124], { attach: [0.26, 0.083], z: 1.1, rest: -20, string: [0.2, 0.2] }),
    },
  },
];

// ---------------------------------------------------------------- the cue sheet

function cues({ tl, section, line }: CueContext) {
  const k = cueKit(tl, master);
  const L = (n: number) => line(n).start;
  const E = (id: string) => section(id).end;
  const end = master.duration;
  tl.signal('carver.sing', master.vox!.fps, master.vox!.bayu ?? []);
  tl.signal('clerk.sing', master.vox!.fps, master.vox!.bayu ?? []);
  tl.signal('man.sing', master.vox!.fps, master.vox!.bayu ?? []);

  const sky = (t: number, dur: number, top: number, hz: number, bot: number, levels: [number, number, number] = [0.8, 1.0, 0.6], hzY = 0.16) => {
    k.look(t, dur, { cycTop: [levels[0], top], cycHz: [levels[1], hz], cycBot: [levels[2], bot] });
    k.move('cycHz.y', hzY, t, dur);
  };
  // The dark behind the screen, a clear Majapahit morning, a river night, a neon night, the first light of today.
  const DARK = [0x0a0a12, 0x141018, 0x08080c] as const;
  const MORNING = [0x6f93b8, 0xf4dfae, 0xd8c8a0] as const;
  const RIVER = [0x0c1730, 0x24406c, 0x0a1020] as const;
  const NEON = [0x1a0f2c, 0x5a2a58, 0x140c20] as const;
  const DAWN = [0x4a5c80, 0xf2b98a, 0xd8b8a0] as const;
  const SUNUP = [0x7a97b8, 0xffe0a8, 0xf0dcb8] as const;

  const hop = (id: string, t: number, dur: number) => tl.hold(`${id}.hop`, t).to(`${id}.hop`, 1, t, 0.2).hold(`${id}.hop`, t + dur).to(`${id}.hop`, 0, t + dur, 0.2);
  const face = (id: string, t: number, turned: boolean) => tl.hold(`${id}.turn`, t).to(`${id}.turn`, turned ? 1 : 0, t, 0.6);
  const rock = (id: string, from: number, to: number, amp: number, period: number) => {
    for (let t = from, i = 0; t < to - period / 2; t += period / 2, i++) k.move(`${id}.x`, i % 2 ? amp : -amp, t, period / 2, 'sine');
    k.move(`${id}.x`, 0, to - period / 2, period / 2, 'sine');
  };
  const follow = (x: number, z: number, t: number, dur = 0.7, level = 0.9, color = 0xfff0dc, y = 0.8) => {
    k.aim('follow', x, y, z, t, dur);
    k.look(t, dur, { follow: [level, color] });
  };
  /** The kayon crosses the whole stage on its rod. The set behind it changes as it passes. */
  const sweep = (t: number, fromLeft: boolean, dur = 1.5) => {
    const a = fromLeft ? -4.4 : 4.4;
    tl.set('kayon.x', a, t - dur / 2);
    k.pop('kayon', true, t - dur / 2);
    k.move('kayon.x', -a, t - dur / 2, dur, 'linear');
    k.pop('kayon', false, t + dur / 2 + 0.01);
  };
  /** A life crosses in front of the screen on its wire, and goes. */
  const cross = (id: string, t: number, dur: number, from: number, to: number) => {
    tl.set(`${id}.x`, from, t);
    k.pop(id, true, t);
    k.move(`${id}.x`, to, t, dur, 'linear');
    hop(id, t, dur);
    k.pop(id, false, t + dur);
  };

  const T1 = L(0), T1W = L(2), T2 = L(4), T3 = section('pre').start - 0.3, CH = L(10), BR = L(14), NOW = L(17), LAST = L(20);

  // ---- preroll: the house settles. The tableau curtain hangs closed.
  const P = -7;
  tl.set('curtain.style', curtainStyleIndex('tableau'), P);
  k.cam(P, 0.01, { x: 0, y: 0.95, z: 9.4, lx: 0, ly: 1.05, lz: -1, fov: 27 });
  k.look(P + 1, 3.5, { house: 0, fohL: 0.12, fohR: 0.1, foot: 0.9, ambient: 0.25 });
  k.aim('follow', 0, 1.0, -0.14, P);
  k.look(P + 3.5, 1.5, { follow: [0.5, 0xffe4bc] });
  tl.set('surtitles.i', 0, P);
  k.move('dust.i', 0.6, P, 1);
  tl.base('haze', 1.1);

  // ---- intro: the shadow screen glows. The gamelan sits in front. The kayon stands in the middle of the screen.
  k.move('curtain.open', 1, 0.3, 4.2, 'inOut');
  sky(0, 3, ...DARK, [0.3, 0.3, 0.2], 0.1);
  k.look(0.3, 3, { fohL: [0.1, 0xffc890], fohR: [0.08, 0xd8a878], foot: 0.3, ambient: 0.16, back: [0.1, 0xffc890], lamp: [0.9, 0xffb060], follow: 0 });
  k.place('lamp', 0, 1.55, -1.1, 0);
  k.move('kelir.glow', 0.14, 0, 3);
  k.move('kelir.glow', 0.22, 6, 6, 'sine');
  tl.base('kayon.sway', 0.25);
  k.cam(0.4, 11, { z: 8.3, ly: 1.1 });
  follow(0, -0.72, 7, 2.5, 0.5, 0xffe0b0, 1.1);

  // The kayon leaves. The screen flies out. The temple comes in behind it, and morning comes up.
  tl.set('surtitles.i', 1, T1 - 1);
  tl.set('kayon.x', 0, 0);
  k.move('kayon.x', 4.4, T1 - 1.7, 1.5, 'in');
  k.pop('kayon', false, T1 - 0.19);
  k.leave('kelir', T1 - 1.3, 1.4, 'in');
  k.leave('gamelan', T1 - 1.5, 1.4, 'in');
  k.enter('candi', T1 - 1.3, 1.6, 'out');
  k.enter('relief', T1 - 1, 1.2, 'out');
  k.pop('blank', true, T1 - 1);
  tl.set('blank.y', -0.86, T1 - 1);
  k.move('blank.y', 0, T1 - 1, 1.2, 'out');
  k.enter('carver', T1 - 1, 1.4, 'out');
  sky(T1 - 1.4, 2, ...MORNING, [0.6, 0.55, 0.4], 0.2);
  k.look(T1 - 1.4, 1.8, { fohL: [0.3, 0xfff0d8], fohR: [0.26, 0xfff4e8], left: [0.16, 0xffe0b8], right: [0.14, 0xfff0d8], foot: 0.4, back: [0.2, 0xffe0b0], ambient: 0.38, lamp: 0, follow: 0 });
  k.move('dust.i', 0.9, T1 - 1, 2);

  // ---- verse 1: Majapahit. He cuts her face out of the stone on the beat. The blank stone sinks a step at each blow.
  const beats = master.beats.filter((b) => b >= T1 && b < T1W - 0.3);
  const blows = beats.filter((_, i) => i % 2 === 0);
  k.move('carver.armB', -14, T1 - 0.4, 0.3);
  k.move('carver.head', -6, T1 - 0.4, 0.4);
  blows.forEach((b, i) => {
    k.move('carver.armB', 22, b - 0.12, 0.12, 'in');
    k.move('carver.armB', -14, b + 0.05, 0.45, 'out');
    k.move('blank.y', -0.86 * ((i + 1) / blows.length), b, 0.14, 'out');
    k.flash('fohL', b, 0.42, 0.3, 0.02, 0.2);
  });
  k.pop('blank', false, T1W + 0.2);
  k.cam(T1 - 0.4, 6, { z: 7.2, ly: 1.05, x: -0.1, lx: -0.05 });
  follow(CARVE.x + 0.5, CARVE.z, T1, 1, 0.45);
  // 2 Kowe liwat — she passes behind him. He is looking at the stone.
  tl.set('noble.x', 3.4, 0);
  k.pop('noble', true, T1W - 1.4);
  k.move('noble.x', -3.5, T1W - 1.2, 6.6, 'linear');
  hop('noble', T1W - 1.2, 6.6);
  k.pop('noble', false, T1W + 5.4);
  k.move('carver.armB', 5, T1W + 0.6, 0.6);
  // 3 Urip iki ora cukup — he looks up too late. He turns. His hand goes out after her.
  face('carver', L(3) - 0.6, true);
  k.move('carver.head', 8, L(3) - 0.4, 0.8);
  k.move('carver.armA', 40, L(3) + 0.3, 1.2);
  k.cam(T1W + 0.5, 5, { z: 7.6, ly: 1.15, x: -0.3, lx: -0.35 });
  follow(CARVE.x, CARVE.z, L(3) - 0.5, 1, 0.5);

  // ---- verse 2: the kayon crosses. A river port in the 1930s, at night. The ship leaves.
  sweep(T2 - 0.1, true);
  k.leave('carver', T2 - 0.8, 0.8, 'in');
  k.leave('relief', T2 - 0.8, 0.8, 'in');
  k.leave('candi', T2 - 0.6, 0.9, 'in');
  k.enter('port', T2 - 0.4, 1.1, 'out');
  k.enter('waves2', T2 - 0.5, 1, 'out');
  k.enter('waves1', T2 - 0.4, 1, 'out');
  k.enter('moon', T2 - 0.2, 1.4, 'out');
  k.enter('lamps', T2, 1.4, 'out');
  k.pop('ship', true, T2 - 0.2);
  tl.base('ship.sway', 0.25);
  sky(T2 - 0.6, 1.4, ...RIVER, [0.6, 0.65, 0.4], 0.12);
  k.move('stars.i', 0.7, T2 - 0.4, 1.4);
  k.look(T2 - 0.6, 1.2, { fohL: [0.17, 0xa8bce8], fohR: [0.14, 0x9fb0d8], left: [0.14, 0x90a4e0], right: [0.14, 0xffb878], foot: 0.28, ambient: 0.2, back: [0.32, 0x8fa8e0], lamp: [0.9, 0xffa860], follow: 0 });
  k.place('lamp', 0.5, 1.6, -1.55, T2 - 0.6);
  k.move('lamps.glow', 0.12, T2, 1.2);
  tl.base('lamps.sway', 0.4);
  rock('waves1', T2 - 0.4, T3 - 0.6, 0.08, 3.1);
  rock('waves2', T2 - 0.1, T3 - 0.6, 0.07, 3.6);
  k.move('port.glow', 0.06, T2, 2);
  k.cam(T2, 4, { z: 8, ly: 1.1, x: 0, lx: 0 });
  // 5 Kapal budhal, aku mlayu — the ship pulls away. He runs in along the quay.
  k.move('ship.x', 3.7, L(5) - 0.8, 11, 'inOut');
  k.pop('ship', false, L(5) + 10.2);
  tl.set('clerk.x', -3.6, 0);
  k.pop('clerk', true, L(5) - 0.4);
  k.move('clerk.x', 0.75, L(5) - 0.3, 3.5, 'out');
  hop('clerk', L(5) - 0.3, 3.3);
  follow(-1.5, -1.25, L(5), 0.4, 0.85, 0xffe8c8);
  k.aim('follow', 0.75, 0.8, -1.25, L(5) + 0.4, 2.8);
  k.move('clerk.head', 8, L(5) + 1, 1);
  // 6 Tanganku nggayuh — his hand reaches for her. A hard beam on the hand.
  k.move('clerk.armB', 42, L(6) - 0.2, 1.2, 'outBack');
  k.move('clerk.head', 14, L(6), 1);
  k.cam(L(6) - 0.5, 4, { z: 7.2, ly: 1.15, x: 0.55, lx: 0.65 });
  // 7 aku kalah karo wektu — the arm falls. The lamps go down.
  k.move('clerk.armB', 0, L(7) + 0.5, 1.8);
  k.move('clerk.head', -14, L(7) + 0.8, 1.6);
  k.move('lamps.glow', 0.05, L(7), 3);
  k.look(L(7), 3, { fohL: 0.09, fohR: 0.07, lamp: 0.3, follow: 0.65 });
  k.cam(L(7), 4, { z: 7.9, ly: 1.1, x: 0.1, lx: 0.1 });

  // ---- pre-chorus: the kayon crosses the other way. A street in the 1990s. They pass in the crowd.
  sweep(T3, false);
  k.leave('clerk', T3 - 0.7, 0.8, 'in');
  k.leave('port', T3 - 0.6, 0.9, 'in');
  k.leave('waves1', T3 - 0.7, 0.8, 'in');
  k.leave('waves2', T3 - 0.6, 0.8, 'in');
  k.leave('moon', T3 - 0.6, 0.8, 'in');
  k.leave('lamps', T3 - 0.5, 0.8, 'in');
  k.enter('street', T3 - 0.3, 1.1, 'out');
  k.move('stars.i', 0, T3 - 0.5, 1);
  sky(T3 - 0.5, 1.2, ...NEON, [0.55, 0.7, 0.4], 0.12);
  k.look(T3 - 0.5, 1.2, { fohL: [0.22, 0xffc8a0], fohR: [0.2, 0xd8b0ff], left: [0.3, 0xff70a8], right: [0.3, 0x60d0ff], foot: 0.32, ambient: 0.24, back: [0.2, 0xff90c0], lamp: 0, follow: 0 });
  k.move('street.glow', 0.14, T3, 1.5);
  tl.set('crowd.x', -2.2, 0).set('crowd2.x', 2.2, 0);
  k.pop('crowd', true, T3);
  k.pop('crowd2', true, T3);
  k.move('crowd.x', 0.9, T3, CH - T3, 'linear');
  k.move('crowd2.x', -0.9, T3, CH - T3, 'linear');
  hop('crowd', T3, CH - T3);
  hop('crowd2', T3, CH - T3);
  k.pop('crowd', false, CH - 0.2);
  k.pop('crowd2', false, CH - 0.2);
  // 8 Yen iki dudu wektune — he comes from the left. She comes from the right. They pass with their eyes elsewhere.
  tl.set('man90.x', -3.4, 0).set('woman90.x', 3.4, 0);
  k.pop('man90', true, T3 + 0.4);
  k.pop('woman90', true, T3 + 0.4);
  const STOP = L(9) - 0.2;
  k.move('man90.x', 0.62, T3 + 0.5, STOP - T3 - 0.5, 'out');
  k.move('woman90.x', -0.62, T3 + 0.5, STOP - T3 - 0.5, 'out');
  hop('man90', T3 + 0.5, STOP - T3 - 0.7);
  hop('woman90', T3 + 0.5, STOP - T3 - 0.7);
  k.cam(T3 + 1, 4, { z: 7.2, ly: 1, x: 0, lx: 0 });
  follow(0, -1.4, L(8), 1, 0.75, 0xfff0e0);
  // 9 Aku gelem ngenteni maneh — each stops and looks back. The crowd goes on between them. Each walks on.
  k.look(L(9), 1, { fohL: 0.12, fohR: 0.1, follow: 0.95 });
  k.cam(L(9), 3, { z: 6.7, ly: 1 });
  k.move('man90.x', 3.4, E('pre') - 0.2, 2.2, 'in');
  k.move('woman90.x', -3.4, E('pre') - 0.2, 2.2, 'in');
  hop('man90', E('pre') - 0.2, 2);
  hop('woman90', E('pre') - 0.2, 2);
  k.pop('man90', false, E('pre') + 2);
  k.pop('woman90', false, E('pre') + 2);

  // ---- chorus: the kayon crosses. The screen is back. The two souls dance on rods as wayang figures.
  sweep(CH - 0.4, true);
  k.leave('street', CH - 1, 0.8, 'in');
  k.enter('kelir', CH - 0.9, 0.9, 'out');
  k.enter('gamelan', CH - 0.6, 0.9, 'out');
  k.enter('shadowhe', CH - 0.3, 1, 'out');
  k.enter('shadowshe', CH - 0.1, 1, 'out');
  sky(CH - 1, 1, ...DARK, [0.3, 0.3, 0.2], 0.1);
  k.move('kelir.glow', 0.3, CH - 0.9, 1);
  k.look(CH - 1, 1, { fohL: [0.1, 0xffc890], fohR: [0.08, 0xd8a878], left: [0.1, 0xffb070], right: [0.1, 0xffb070], foot: 0.25, ambient: 0.14, back: 0.1, lamp: [1, 0xffb060], follow: 0 });
  k.place('lamp', 0, 1.6, -1.1, CH - 1);
  k.cam(CH, 5, { z: 7.6, ly: 1.1, x: 0, lx: 0 });
  tl.base('shadowhe.sway', 0.4);
  tl.base('shadowshe.sway', 0.4);
  // 10 goleki aku — they come toward each other, on the beat.
  k.move('shadowhe.x', 0.32, L(10) + 0.5, 3, 'inOut');
  k.move('shadowshe.x', -0.32, L(10) + 0.8, 3, 'inOut');
  k.move('shadowhe.armB', 20, L(10) + 0.6, 1.4, 'sine');
  k.move('shadowshe.armB', -20, L(10) + 1, 1.4, 'sine');
  // 11 Ing antarane sewu rai — they know each other. Their hands rise.
  k.move('shadowhe.armB', 38, L(11), 1.2, 'outBack');
  k.move('shadowshe.armB', -38, L(11) + 0.3, 1.2, 'outBack');
  k.move('shadowhe.armA', 18, L(11) + 0.4, 1.2);
  k.move('shadowshe.armA', -14, L(11) + 0.4, 1.2);
  k.move('shadowhe.x', 0.55, L(11) + 0.3, 2.4);
  k.move('shadowshe.x', -0.55, L(11) + 0.5, 2.4);
  k.cam(L(11), 4, { z: 6.9, ly: 1.15 });
  // 12 lintang wis ganti panggonan — they dance. Gold points fall in front of the screen.
  tl.set('glints.x0', -2.2, L(12)).set('glints.x1', 2.2, L(12));
  k.move('glints.rate', 0.55, L(12) - 0.2, 1.2);
  hop('shadowhe', L(12), 4.8);
  hop('shadowshe', L(12), 4.8);
  [0, 1.25, 2.5, 3.75].forEach((dt, i) => {
    k.move('shadowhe.rz', i % 2 ? 5 : -5, L(12) + dt, 1.2, 'sine');
    k.move('shadowshe.rz', i % 2 ? -5 : 5, L(12) + dt, 1.2, 'sine');
    k.move('shadowhe.armB', i % 2 ? 52 : 30, L(12) + dt, 1.2, 'sine');
    k.move('shadowshe.armB', i % 2 ? -52 : -30, L(12) + dt, 1.2, 'sine');
  });
  // 13 ora bakal lali dalan mulih — she goes away along the screen. He keeps one hand out.
  k.move('shadowhe.rz', 0, L(13), 1);
  k.move('shadowshe.rz', 0, L(13), 1);
  k.move('shadowshe.x', 2.6, L(13) + 0.6, 4.8, 'in');
  k.leave('shadowshe', L(13) + 5, 0.9, 'in');
  k.move('shadowshe.armB', -12, L(13) + 2.4, 1.6);
  k.move('shadowhe.armB', 42, L(13) + 1, 1.2);
  k.move('glints.rate', 0.1, L(13) + 2, 2);
  k.cam(L(13), 6, { z: 7.5, ly: 1.1, x: -0.1, lx: -0.1 });

  // ---- bridge: his lives and her lives cross in front of the screen. Then the kayon is planted.
  k.leave('shadowhe', BR - 0.4, 0.9, 'in');
  k.move('glints.rate', 0, BR, 1);
  k.look(BR - 0.5, 1, { fohL: [0.26, 0xffe0b8], fohR: [0.22, 0xffd8b0], foot: 0.3, ambient: 0.2 });
  // 14 Wis kaping telu aku lair — three times born: three of his lives cross, left to right.
  cross('carver', BR - 0.2, 3.2, -3.6, 3.6);
  cross('clerk', BR + 0.8, 3.0, -3.6, 3.6);
  cross('man90', BR + 1.7, 2.6, -3.6, 3.6);
  // 15 Wis kaping telu aku kelangan — three times lost: two of her lives cross the other way, and the ship is gone.
  cross('noble', L(15) - 0.2, 3.2, 3.6, -3.6);
  cross('woman90', L(15) + 0.9, 2.6, 3.6, -3.6);
  tl.set('carver.head', 0, BR - 0.3).set('carver.armA', 0, BR - 0.3).set('carver.armB', 0, BR - 0.3).set('carver.turn', 0, BR - 0.3);
  tl.set('carver.y', -0.0, BR - 0.3);
  tl.set('clerk.head', 0, BR).set('clerk.armB', 0, BR);
  k.cam(BR, 5, { z: 8, ly: 1.05, x: 0, lx: 0 });
  // 16 Kayon ditancepake — the kayon rises in the middle and comes down hard into the banana trunk.
  tl.set('kayon.x', 0, L(16) - 1);
  tl.set('kayon.y', 0.5, L(16) - 1);
  k.enter('kayon', L(16) - 1, 0.7, 'out');
  k.move('kayon.y', 0, L(16) + 0.3, 0.18, 'in');
  k.flash('fohL', L(16) + 0.48, 0.9, 0.26, 0.02, 0.5);
  k.flash('fohR', L(16) + 0.48, 0.8, 0.22, 0.02, 0.5);
  follow(0, -0.72, L(16) + 0.48, 0.1, 0.9, 0xffe0b0, 1.1);
  k.move('kelir.glow', 0.42, L(16) + 0.48, 0.2);
  k.cam(L(16) + 0.4, 4, { z: 7.2, ly: 1.15 });

  // ---- final chorus, up a step: the kayon sweeps off. The same temple, six hundred years older, at dawn.
  k.move('kayon.x', 4.4, NOW - 0.7, 1.2, 'in');
  k.pop('kayon', false, NOW + 0.51);
  k.leave('kelir', NOW - 0.5, 1, 'in');
  k.leave('gamelan', NOW - 0.6, 1, 'in');
  k.enter('candiold', NOW - 0.4, 1.3, 'out');
  k.enter('reliefold', NOW - 0.1, 1.1, 'out');
  sky(NOW - 0.4, 2.5, ...DAWN, [0.6, 0.6, 0.4], 0.16);
  k.look(NOW - 0.3, 2, { fohL: [0.2, 0xffe0c0], fohR: [0.17, 0xffe8d0], left: [0.1, 0xffc898], right: [0.1, 0xffd8b0], foot: 0.3, back: [0.12, 0xffd0a0], ambient: 0.2, lamp: 0, follow: 0 });
  k.move('dust.i', 1.1, NOW, 3);
  k.cam(NOW, 6, { z: 8, ly: 1.1, x: 0, lx: 0 });
  // 17 Saiki aku urip maneh — he comes in from the left.
  tl.set('man.x', -3.4, 0);
  tl.base('man.armB', -35);
  tl.base('woman.armB', 40);
  k.pop('man', true, NOW + 0.2);
  k.move('man.x', -1.1, NOW + 0.3, 3.6, 'out');
  hop('man', NOW + 0.3, 3.4);
  follow(-1.2, -1.3, NOW + 2.2, 1.2, 0.6, 0xfff0dc);
  // She comes in from the right and goes to the stone. He stops. He sees her.
  tl.set('woman.x', 3.4, 0);
  k.pop('woman', true, NOW + 1.6);
  k.move('woman.x', 0.52, NOW + 1.7, 4.2, 'out');
  hop('woman', NOW + 1.7, 4);
  k.move('man.head', 8, NOW + 4.4, 1);
  // 18 Ing ngarepe candhi — she stops at the relief. Her hand goes to her own carved face.
  k.move('woman.armB', 18, L(18) - 0.2, 1.4);
  k.move('woman.head', -6, L(18), 1);
  follow(0.35, -1.4, L(18) - 0.4, 1, 0.6, 0xfff0d8, 0.8);
  k.look(L(18) - 0.4, 1, { fohL: 0.14, fohR: 0.12 });
  k.cam(L(18) - 0.4, 4, { z: 6.7, ly: 0.95, x: 0.2, lx: 0.25 });
  // 19 Sanajan kowe lali — he comes closer. Her hand falls. She looks up.
  k.move('man.x', -0.62, L(19), 3, 'inOut');
  hop('man', L(19), 2.8);
  k.move('woman.armB', 40, L(19) + 2.4, 1.2);
  k.move('woman.head', 6, L(19) + 2.6, 1);
  follow(-0.1, -1.3, L(19), 1.4, 0.55, 0xfff0dc);
  k.cam(L(19), 5, { z: 7.2, ly: 1.05, x: 0, lx: 0 });
  // 20 Iki wektune, aja lunga maneh — he holds out his hand. She answers. The sun comes up behind the temple.
  k.move('man.armB', 0, LAST - 0.4, 1.3, 'outBack');
  k.move('man.head', 4, LAST - 0.4, 1);
  k.move('woman.armB', 15, LAST + 0.8, 1.5, 'out');
  k.move('woman.x', 0.5, LAST + 0.8, 1.5);
  k.move('man.x', -0.5, LAST + 0.8, 1.5);
  k.enter('sun', LAST - 1, 4.5, 'out');
  k.move('sun.glow', 0.6, LAST, 3);
  sky(LAST - 0.5, 3.5, ...SUNUP, [0.62, 0.6, 0.42], 0.22);
  k.look(LAST, 2, { fohL: [0.32, 0xfff0d8], fohR: [0.28, 0xfff4e8], left: [0.18, 0xffd8a8], right: [0.18, 0xffe8c8], foot: 0.4, back: [0.18, 0xffd8a0], ambient: 0.28 });
  tl.set('glints.x0', -2.4, LAST).set('glints.x1', 2.4, LAST);
  k.move('glints.rate', 0.25, LAST, 1.5);
  k.cam(LAST - 0.5, 5, { z: 7.5, y: 0.85, ly: 1.2 });

  // ---- outro: the two stand together. The light stays on them.
  k.move('glints.rate', 0.08, E('ch2'), 3);
  follow(0, -1.3, E('ch2'), 2, 0.55, 0xfff0d0);

  // ---- the end: the curtain closes. In the curtain call the two bow.
  tl.set('surtitles.i', 0, end - 3.6);
  k.cam(end - 4.8, 4.2, { z: 9.4, x: 0, lx: 0, y: 0.95, ly: 1.05 });
  k.move('curtain.open', 0, end - 3.8, 3.4, 'inOut');
  k.look(end - 1, 2, { follow: 0, house: 0.25 });
  k.pop('man', false, end - 2);
  k.pop('woman', false, end - 2);
  for (const id of ['man', 'woman']) for (const [ch, v] of [['head', 0], ['armA', 0], ['armB', 0], ['rz', 0]] as const) k.move(`${id}.${ch}`, v, end - 1.9, 0.01);
  k.move('man.x', -0.45, end - 1.9, 0.01);
  k.move('woman.x', 0.45, end - 1.9, 0.01);
  k.move('man.z', 0.8, end - 1.9, 0.01);
  k.move('woman.z', 0.76, end - 1.9, 0.01);
  k.move('curtain.open', 0.5, end + 0.8, 1.6, 'out');
  k.pop('man', true, end + 1);
  k.pop('woman', true, end + 1);
  k.look(end + 0.6, 0.8, { follow: [0.7, 0xffe6c4] });
  k.aim('follow', 0, 1.0, -0.5, end + 0.5, 0.01);
  k.move('man.rz', -18, end + 2.4, 0.5);
  k.move('woman.rz', 18, end + 2.4, 0.5);
  k.move('man.rz', 0, end + 3, 0.5);
  k.move('woman.rz', 0, end + 3, 0.5);
  k.move('curtain.open', 0, end + 4.2, 1.8, 'inOut');
  k.look(end + 4.6, 1.5, { follow: 0, house: 0.7 });

  spotlights();

  // ---- the spotlight play. Written last, so at the same moment it wins over the washes above.
  function spotlights() {
    // The carving: a narrow beam from high on the left onto the stone.
    k.place('ray', -1.4, 3.2, -1.2, T1 - 0.2);
    k.aim('ray', 0.1, 0.45, -1.78, T1 - 0.2, 0.01);
    tl.set('ray.r', 1, T1 - 0.2).set('ray.g', 0.9, T1 - 0.2).set('ray.b', 0.7, T1 - 0.2);
    k.look(T1, 0.8, { ray: 0.35 });
    k.look(T1W + 0.2, 1, { ray: 0 });
    // The reach on the quay: one cold shaft from the moon over his hand toward the ship.
    k.place('ray', -1.9, 1.95, -2.8, L(6) - 0.6);
    k.aim('ray', 0.9, 0.9, -1.25, L(6) - 0.6, 0.01);
    tl.set('ray.r', 0.78, L(6) - 0.6).set('ray.g', 0.86, L(6) - 0.6).set('ray.b', 1, L(6) - 0.6);
    k.look(L(6) - 0.2, 1.2, { ray: 0.28 });
    k.move('haze', 2.4, L(6) - 0.4, 1.2);
    k.look(L(7) + 1, 2, { ray: 0 });
    k.move('haze', 1.1, L(7) + 1, 2);
    // The street: two side beams cross where they pass.
    k.aim('left', 0.3, 1, -1.4, T3 + 0.5, 0.01);
    k.aim('right', -0.3, 1, -1.4, T3 + 0.5, 0.01);
    k.move('haze', 2, T3, 1);
    k.move('haze', 1.1, CH - 1, 1);
    // The planted kayon: a shaft from straight above.
    k.place('ray', 0, 3.6, -0.72, L(16) - 0.1);
    k.aim('ray', 0, 0.8, -0.72, L(16) - 0.1, 0.01);
    tl.set('ray.r', 1, L(16) - 0.1).set('ray.g', 0.82, L(16) - 0.1).set('ray.b', 0.55, L(16) - 0.1);
    k.look(L(16) + 0.48, 0.2, { ray: 0.45 });
    k.look(NOW - 0.7, 0.6, { ray: 0 });
    // The relief: one narrow warm beam lands on the stone when she touches it.
    k.place('ray', 1.6, 3.4, -1.2, L(18) - 0.8);
    k.aim('ray', 0, 0.45, -1.8, L(18) - 0.8, 0.01);
    tl.set('ray.r', 1, L(18) - 0.8).set('ray.g', 0.84, L(18) - 0.8).set('ray.b', 0.6, L(18) - 0.8);
    k.look(L(18) - 0.3, 1.2, { ray: 0.18 });
    k.move('haze', 2.2, L(18) - 0.4, 1.2);
    k.look(L(19) + 2, 2, { ray: 0 });
    // Their hands: the gold shaft comes down between them.
    k.place('ray', 0, 3.6, -1.2, LAST - 0.6);
    k.aim('ray', 0, 0.5, -1.3, LAST - 0.6, 0.01);
    k.look(LAST + 0.6, 1.4, { ray: 0.16 });
    k.move('haze', 1.3, E('ch2'), 3);
  }
}

const production: Production = {
  id: 'urip-maneh',
  no: 6,
  title: { zh: '再世相逢', en: 'Alive Again', id: 'Hidup Kembali', jv: 'Urip Maneh' },
  poster: urls['./art/cut/poster.webp']!,
  audio,
  master,
  pieces,
  curtain: { open: 'tableau', close: 'tableau' },
  preroll: 7,
  postroll: 7,
  surtitles: { main: 'jv', second: 'zh' },
  bill: {
    about: 'Two souls miss each other across four lives in Java. In the last life, she finds her own face on an old temple wall. Bayu sings the song in Javanese.',
    cast: [['Bayu, in four lives', 'Voice'], ['Laras, in four lives', 'On strings and slides'], ['The two souls', 'Wayang on rods'], ['The kayon', 'On a rod']],
    scenes: ['The shadow screen', 'A Majapahit temple', 'A river port, 1930s', 'A street, 1990s', 'The temple today'],
  },
  voices: { bayu: { name: 'Bayu', color: '#e8d6b0' } },
  cues,
};

export default production;
