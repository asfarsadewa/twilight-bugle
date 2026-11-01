// Let Me Rise · Biar Aku Terbit · 如日初升
// The cue sheet follows take 2 (song/master.json). Line numbers below are the sung lines in take order.
// Heights (y) are above the stage floor. The stage opening is about 5.5 wide and 2.4 high. Depth runs to z = -4.
//
// The machinery is part of the show. Meret is a marionette: her head and both hands hang on strings from the fly
// loft. The Sky Mother and the ibises fly on strings. The sun, the heroes, the barge, the sailboat and the town ride
// on rods from below. The temple and the mother slide in on tin wires from the wings. The river is a wave machine:
// cut-card rows that rock against each other.

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

// Meret's home is the river bank, a little right of centre, in front of the back waves.
const MERET = { x: 0.35, y: 0, z: -1.3 };
const BARGE = { x: 0.75, y: -0.18, z: -1.6 };
const meret = [0, 1, 2, 3].map((k) => part('puppet-meret', k));

const pieces: PieceSpec[] = [
  // The sun rises on its rod from behind the dunes.
  { id: 'sun', kind: 'prop', art: art('prop-sun'), width: 1.05, anchor: 'center', home: { x: 1.05, y: 1.35, z: -3.8 }, route: 'trap', rod: true, glow: 0.3, shadow: false },
  { id: 'dunes', kind: 'flat', art: art('flat-dunes'), width: 7.2, home: { x: 0, y: -0.62, z: -3.5 }, route: 'fly', startIn: true, silhouette: { color: 0x6c5878 } },
  {
    id: 'skymother', kind: 'flat', art: art('flat-sky-mother'), width: 5.3, home: { x: 0, y: -0.12, z: -3.05 }, route: 'fly', glow: 0.12,
    strings: [[0.22, 0.2], [0.5, 0.04], [0.78, 0.12]],
  },
  ...[0, 1, 2].map((i): PieceSpec => ({
    id: `ibis${i}`, kind: 'prop', art: art('prop-ibis'), width: 0.46 - i * 0.06, anchor: 'center', home: { x: 0, y: 1.5 - i * 0.16, z: -2.9 + i * 0.1 },
    route: 'fly', strings: [[0.42, 0.3]], shadow: false,
  })),
  { id: 'sailboat', kind: 'prop', art: art('prop-sailboat'), width: 1.3, home: { x: 0, y: 0.02, z: -2.1 }, route: 'left', rod: true },
  { id: 'waves0', kind: 'flat', art: art('flat-waves'), width: 5.8, home: { x: -0.3, y: -0.78, z: -2.25 }, route: 'trap', startIn: true },
  { id: 'waves1', kind: 'flat', art: art('flat-waves'), width: 5.8, home: { x: 0.4, y: -0.84, z: -1.95 }, route: 'trap', startIn: true, mirror: true },
  { id: 'temple', kind: 'flat', art: art('flat-temple'), width: 2.9, home: { x: -1.6, y: -0.12, z: -1.78 }, route: 'left', startIn: true, slide: 'left', glow: 0 },
  {
    id: 'mother', kind: 'prop', art: art('prop-mother'), width: 0.4, home: { x: -1.45, y: 0.5, z: -1.7 }, route: 'left', slide: 'left', glow: 0.1,
  },
  ...[[-2.25, false], [-0.95, true]].map(([x, mirror], i): PieceSpec => ({
    id: `hero${i}`, kind: 'prop', art: art('prop-hero'), width: 0.6, home: { x: x as number, y: 0, z: -1.68 }, route: 'trap', rod: true, mirror: mirror as boolean, glow: 0.2,
  })),
  { id: 'jars', kind: 'prop', art: art('prop-jars'), width: 0.34, home: { x: 0.95, y: 0, z: -1.28 }, route: 'trap', rod: true },
  { id: 'barge', kind: 'prop', art: art('prop-barge'), width: 2.3, home: BARGE, route: 'left', rod: true, glow: 0.05 },
  {
    id: 'meret', kind: 'puppet', home: MERET, route: 'fly',
    puppet: {
      height: 0.9, faces: 'right',
      body: { art: meret[2]!, sheet: sheet(meret[2]!), pivot: [0.5, 1] },
      head: { art: meret[0]!, sheet: sheet(meret[0]!), pivot: [0.71, 0.5], attach: [0.5, 0.03], z: -0.6, string: [0.62, 0.04] },
      armA: { art: meret[1]!, sheet: sheet(meret[1]!), pivot: [0.15, 0.4], attach: [0.78, 0.07], z: 1, rest: -10, string: [0.86, 0.33] },
      armB: { art: meret[3]!, sheet: sheet(meret[3]!), pivot: [0.88, 0.12], attach: [0.22, 0.07], z: -1, rest: -12, string: [0.12, 0.92] },
    },
  },
  { id: 'waves2', kind: 'flat', art: art('flat-waves'), width: 6.2, home: { x: 0, y: -1.1, z: -1.15 }, route: 'trap' },
  { id: 'crowd', kind: 'flat', art: art('flat-crowd'), width: 4.0, home: { x: 0.2, y: -0.56, z: -0.78 }, route: 'trap', rod: true },
  { id: 'papyrusL', kind: 'flat', art: art('flat-papyrus'), width: 2.4, home: { x: -2.05, y: -0.22, z: -0.55 }, route: 'left', startIn: true },
  { id: 'papyrusR', kind: 'flat', art: art('flat-papyrus'), width: 1.9, home: { x: 2.25, y: -0.2, z: -0.5 }, route: 'right', startIn: true, mirror: true },
];

// ---------------------------------------------------------------- the cue sheet

function cues({ tl, section, line }: CueContext) {
  const k = cueKit(tl, master);
  const L = (n: number) => line(n).start;
  const S = (id: string) => section(id).start;
  const E = (id: string) => section(id).end;
  const end = master.duration;
  tl.signal('meret.sing', master.vox!.fps, master.vox!.meret ?? []);

  const sky = (t: number, dur: number, top: number, hz: number, bot: number, levels: [number, number, number] = [0.8, 1.0, 0.55], hzY = 0.18) => {
    k.look(t, dur, { cycTop: [levels[0], top], cycHz: [levels[1], hz], cycBot: [levels[2], bot] });
    k.move('cycHz.y', hzY, t, dur);
  };
  const DAWN = [0x3a3f7a, 0xf0a07a, 0xe7a3a8] as const;
  const NOON = [0x3f78c8, 0xf6e4b8, 0xe2c08a] as const;
  const DUSK = [0x2a2d66, 0xe8884a, 0xc0643a] as const;
  const NIGHT = [0x0f1838, 0x26457a, 0x0c1230] as const;
  const FEAST = [0x141a40, 0x9a5236, 0x1a2140] as const;
  const STORM = [0x0a0f20, 0x1c2a4a, 0x070a14] as const;
  const GLORY = [0x2e4a80, 0xf2b070, 0xd99aa0] as const;

  // Where a figure stands now, from its home and the offsets written so far.
  const at = (id: 'meret' | 'barge', t: number) => {
    const h = id === 'meret' ? MERET : BARGE;
    return { x: h.x + tl.value(`${id}.x`, t), y: h.y + tl.value(`${id}.y`, t), z: h.z + tl.value(`${id}.z`, t) };
  };
  const follow = (t: number, dur = 0.7, level = 0.95, color = 0xffe2b8) => {
    const p = at('meret', t);
    k.aim('follow', p.x, p.y + 0.85, p.z, t, dur);
    k.look(t, dur, { follow: [level, color] });
  };
  /** Meret goes to a place on stage: offsets from her home. A marionette walks with a bob on its strings. */
  const walk = (t: number, dur: number, to: { x?: number; y?: number; z?: number }, e: 'inOut' | 'out' | 'in' = 'inOut') => {
    if (to.x !== undefined) k.move('meret.x', to.x - MERET.x, t, dur, e);
    if (to.y !== undefined) k.move('meret.y', to.y - MERET.y, t, dur, e);
    if (to.z !== undefined) k.move('meret.z', to.z - MERET.z, t, dur, e);
    tl.hold('meret.hop', t).to('meret.hop', 1, t, 0.2).hold('meret.hop', t + dur).to('meret.hop', 0, t + dur, 0.2);
  };
  const face = (t: number, left: boolean) => {
    tl.hold('meret.turn', t).to('meret.turn', left ? 1 : 0, t, 0.6);
  };
  // Her lamp: a warm practical that sits at her lamp hand.
  const lamp = (level: number, t: number, dur = 0.8) => {
    const p = at('meret', t);
    const side = tl.value('meret.turn', t) > 0.5 ? -1 : 1;
    k.place('glowA', p.x + side * 0.28, p.y + 0.78, p.z + 0.2, t, dur);
    k.look(t, dur, { glowA: [level, 0xffc070] });
  };
  /** The barge and anyone aboard move together. */
  const sail = (t: number, dur: number, x: number, aboard: boolean, e: 'inOut' | 'out' | 'in' = 'inOut') => {
    const dx = x - at('barge', t).x;
    k.move('barge.x', tl.value('barge.x', t) + dx, t, dur, e);
    k.move('glowB.px', tl.value('glowB.px', t) + dx, t, dur, e);
    if (aboard) k.move('meret.x', tl.value('meret.x', t) + dx, t, dur, e);
  };

  // The wave machine: each row rocks side to side against the row behind it, as a crank turns under the stage.
  const rock = (id: string, from: number, to: number, amp: number, period: number, phase: number) => {
    for (let t = from, i = 0; t < to - 0.01; t += period / 2, i++) {
      tl.to(`${id}.x`, ((i + phase) % 2 ? 1 : -1) * amp, t, Math.min(period / 2, to - t), 'sine');
    }
  };
  const p2 = S('pre2');
  const sw = S('swell'), swEnd = E('swell');

  // ---- preroll: the house settles. The fly curtain hangs closed.
  const P = -7;
  tl.set('curtain.style', curtainStyleIndex('fly'), P);
  k.cam(P, 0.01, { x: 0, y: 0.95, z: 9.4, lx: 0, ly: 1.05, lz: -1, fov: 27 });
  k.look(P + 1, 3.5, { house: 0, fohL: 0.12, fohR: 0.1, foot: 0.9, ambient: 0.25 });
  k.aim('follow', 0, 1.0, -0.14, P);
  k.look(P + 3.5, 1.5, { follow: [0.5, 0xffe4bc] });
  tl.set('surtitles.i', 0, P);

  // The river never stops: the wave machine turns from the first moment the curtain flies. It runs hard on the voyage.
  for (const [id, from, amp, period, phase] of [['waves0', 0, 0.06, 4.2, 0], ['waves1', 0, 0.07, 3.6, 1], ['waves2', p2, 0.05, 3.2, 0]] as const) {
    rock(id, from, sw, amp, period, phase);
    rock(id, sw, swEnd, amp * 2.2, period * 0.55, phase);
    rock(id, swEnd, end + 7, amp, period, phase);
  }

  // ---- intro (0 to 13.2): dawn on the river. The sun climbs on its rod. Meret comes down on her strings.
  k.move('curtain.open', 1, 0.3, 4.2, 'inOut');
  sky(0, 4, ...DAWN, [0.75, 1.0, 0.6], 0.16);
  k.look(0.3, 3, { fohL: [0.32, 0xffd2b0], fohR: [0.24, 0xf0c8d0], foot: 0.5, ambient: 0.3, left: [0.35, 0xffb090], right: [0.45, 0xffc8a0], follow: 0 });
  k.enter('sun', 0.6, 10, 'out');
  k.move('sun.glow', 0.25, 6, 4);
  k.cam(0.4, 12, { z: 8.4, ly: 1.1, x: -0.2, lx: -0.2 });
  // She descends onto the temple platform at the top of the nine steps.
  const STEPS_TOP = { x: -0.78, y: 0.62, z: -1.66 };
  walk(0, 0.01, STEPS_TOP);
  k.enter('meret', 4.0, 2.6, 'out');
  follow(5.0, 1.2, 0.8, 0xffd8b8);

  // ---- verse 1: one day of the routine, from dawn to dusk.
  tl.set('surtitles.i', 1, L(0) - 1);
  // 0 Down the nine stone steps at dawn — she walks down to the bank.
  walk(L(0) - 0.4, 3.2, { x: -0.2, y: 0.05, z: -1.45 });
  walk(L(0) + 2.9, 1.2, { x: 0.55, y: 0, z: -1.3 });
  follow(L(0), 3.6, 0.85);
  // 1 I fill my jars where the river bends — the jars rise through the trap. She kneels and dips her hand.
  k.enter('jars', L(1) - 0.6, 0.9, 'out');
  k.move('meret.y', -0.06, L(1), 0.5);
  k.move('meret.rz', -6, L(1), 0.6);
  k.move('meret.armB', 40, L(1) + 0.2, 0.8);
  k.move('meret.head', -8, L(1) + 0.2, 0.8);
  // 2 I copy hymns till the sun is gone — the day passes: the sun crosses and lowers. She copies by the wall.
  k.leave('jars', L(2), 0.8, 'in');
  k.move('meret.rz', 0, L(2), 0.4);
  k.move('meret.armB', 0, L(2), 0.6);
  k.move('meret.head', -14, L(2) + 1.6, 0.8);
  face(L(2), true);
  walk(L(2) + 0.2, 1.6, { x: -0.25, y: 0.02, z: -1.5 });
  sky(L(2), 3, ...NOON, [0.85, 1.0, 0.6], 0.2);
  k.move('sun.x', 0.5, L(2), 7, 'inOut');
  k.move('sun.y', -0.55, L(2) + 2, 6, 'inOut');
  // 3 I light the lamps when the long day ends — dusk. The temple door glows. Her lamp lights.
  sky(L(3) - 0.6, 3.5, ...DUSK, [0.8, 1.1, 0.6], 0.15);
  k.move('meret.head', 0, L(3), 0.6);
  k.place('lamp', -1.6, 0.45, -1.55, L(3) - 1);
  k.look(L(3), 1.6, { lamp: [0.8, 0xffb060], fohL: [0.26, 0xffc898], fohR: [0.18, 0xd8b8c8], right: [0.5, 0xff9a60], left: [0.25, 0xffa070] });
  k.move('temple.glow', 0.12, L(3), 2);
  k.move('meret.armA', 38, L(3) + 0.3, 0.8);
  lamp(0.9, L(3) + 0.3);
  // 4 I paint the heroes on the temple wall — she lifts her hand to the wall. Gold dust drifts from it.
  k.move('meret.armB', 95, L(4) - 0.2, 0.9);
  k.move('meret.armA', 10, L(4), 0.8);
  tl.set('glints.x0', -2.6, L(4)).set('glints.x1', -0.4, L(4));
  k.move('glints.rate', 0.18, L(4), 1);
  follow(L(4), 1.0, 0.8);
  // 5 I write their names in gold, but never mine — the wall shines. She lowers her hand and her head.
  k.flash('fohL', L(5), 0.6, 0.26, 0.05, 1.2);
  k.move('temple.glow', 0.35, L(5), 0.6);
  k.move('temple.glow', 0.12, L(5) + 1.2, 1.6);
  k.move('meret.armB', 0, L(5) + 1.6, 1.2);
  k.move('meret.head', -12, L(5) + 1.8, 1.2);
  k.move('glints.rate', 0, L(5) + 2, 1.5);
  k.look(L(5) + 1.5, 2, { follow: [0.55, 0xffcfa0] });

  // ---- pre-chorus 1: a white sail glides past on its rod. She turns to the river.
  sky(L(6) - 1, 4, ...DUSK, [0.85, 1.25, 0.6], 0.2);
  tl.set('sailboat.x', -0.4, 0);
  k.enter('sailboat', L(6) - 1.2, 3, 'out');
  k.move('sailboat.x', 3.2, L(6) + 1.8, 12, 'linear');
  face(L(6) - 0.2, false);
  k.move('meret.head', 4, L(6), 0.8);
  walk(L(6) + 0.4, 2.2, { x: 0.35, y: 0, z: -1.3 });
  follow(L(6) + 0.4, 2.4, 0.85, 0xffe0b0);
  // 7 And every sail is calling me — she reaches toward it.
  k.move('meret.armB', 70, L(7), 1.2);
  k.cam(L(6), 9, { z: 7.6, ly: 1.15, x: 0.2, lx: 0.25 });

  // ---- chorus 1: the painted heroes rise on their rods. Ibises fly. The sun blazes.
  const c1 = L(8);
  sky(c1 - 0.4, 2.5, ...GLORY, [0.75, 0.95, 0.55], 0.2);
  k.look(c1 - 0.2, 1.6, { fohL: [0.45, 0xffd6a8], fohR: [0.38, 0xffe4c8], left: [0.55, 0xffb070], right: [0.6, 0xffc080], foot: 0.7, lamp: 0.4 });
  k.move('sun.y', -0.25, c1 - 0.4, 2);
  k.move('sun.glow', 0.7, c1, 0.4);
  k.move('sun.glow', 0.35, c1 + 1, 2);
  k.move('sun.s', 1.12, c1, 1.6, 'outBack');
  k.enter('hero0', c1 - 0.2, 1.2, 'out');
  k.enter('hero1', c1 + 0.2, 1.2, 'out');
  k.move('hero0.glow', 0.6, c1 - 0.2, 0.4);
  k.move('hero1.glow', 0.6, c1 + 0.2, 0.4);
  k.move('hero0.glow', 0.15, c1 + 1.5, 2);
  k.move('hero1.glow', 0.15, c1 + 1.9, 2);
  tl.set('glints.x0', -2.6, c1).set('glints.x1', 2.6, c1);
  k.move('glints.rate', 0.35, c1, 1.5);
  k.move('meret.armA', 50, c1, 0.8, 'out');
  k.move('meret.armB', 110, c1, 0.8, 'out');
  k.move('meret.head', 8, c1, 0.6);
  lamp(1.0, c1, 0.6);
  follow(c1, 0.6, 1.0, 0xffe8c4);
  k.cam(c1, 8, { z: 7.9, ly: 1.35, x: 0, lx: 0 });
  // The ibises fly across on their strings, wings beating.
  [0, 1, 2].forEach((i) => {
    tl.set(`ibis${i}.x`, -3.4 - i * 0.5, 0);
    tl.base(`ibis${i}.sway`, 2.2);
    k.enter(`ibis${i}`, c1 + 0.5 + i * 0.4, 1.2, 'out');
    k.move(`ibis${i}.x`, 3.6, c1 + 0.6 + i * 0.4, 9 + i, 'linear');
    k.leave(`ibis${i}`, c1 + 9 + i * 1.3, 1.2, 'in');
  });
  // 9 Let me sail past the reeds and away — the heroes stride out to flank her.
  tl.hold('hero0.hop', L(9)).to('hero0.hop', 1, L(9), 0.2).hold('hero0.hop', L(9) + 2.2).to('hero0.hop', 0, L(9) + 2.2, 0.2);
  tl.hold('hero1.hop', L(9)).to('hero1.hop', 1, L(9), 0.2).hold('hero1.hop', L(9) + 2.2).to('hero1.hop', 0, L(9) + 2.2, 0.2);
  k.move('hero0.x', -0.45 - (-2.25) + MERET.x - 0.8, L(9), 2.4);
  k.move('hero1.x', 0.95 - (-0.95) + MERET.x, L(9), 2.4);
  k.leave('sailboat', L(9) + 2, 2.5, 'in');
  // 10 I have written in gold every hero's story — they bow to her.
  k.move('hero0.rz', -16, L(10), 0.6);
  k.move('hero1.rz', 16, L(10), 0.6);
  k.move('hero0.rz', 0, L(10) + 1.6, 0.6);
  k.move('hero1.rz', 0, L(10) + 1.6, 0.6);
  k.move('meret.armB', 40, L(10), 0.8);
  // 11 Now it's my turn to take the stage — she steps down to the footlights.
  walk(L(11) - 0.3, 1.6, { x: 0.15, y: 0, z: -0.9 });
  k.move('meret.s', 1.08, L(11), 1.6);
  k.flash('foot', L(11) + 1.2, 1.4, 0.8, 0.05, 1.5);
  k.move('meret.armA', 60, L(11) + 1, 0.8, 'out');
  k.move('meret.armB', 120, L(11) + 1, 0.8, 'out');
  follow(L(11) + 1, 1, 1.0, 0xfff0d0);
  k.cam(L(11), 3.5, { z: 7.2, ly: 1.1, x: 0.1, lx: 0.1 });

  // ---- interlude (64.7 to 76.6): the sun sets on its rod. The heroes sink back. Night comes.
  const il = E('ch1');
  k.move('glints.rate', 0, il, 2);
  k.leave('hero0', il + 1, 1.8, 'in');
  k.leave('hero1', il + 1.4, 1.8, 'in');
  k.move('meret.armA', 30, il, 1.2);
  k.move('meret.armB', 0, il, 1.4);
  k.move('meret.s', 1, il + 2, 1.5);
  k.move('sun.s', 1, il, 2);
  k.leave('sun', il + 1.5, 7, 'inOut');
  sky(il + 1, 4, ...DUSK, [0.8, 1.2, 0.6], 0.14);
  sky(il + 5.5, 5, ...NIGHT, [0.7, 0.5, 0.4], 0.1);
  k.move('stars.i', 0.7, il + 6, 5);
  k.look(il + 5, 4, { fohL: [0.14, 0x9ab0e8], fohR: [0.12, 0x8aa0d8], left: [0.2, 0x8090d0], right: [0.18, 0x7080c0], foot: 0.4, back: [0.35, 0x8aa8ff], follow: [0.6, 0xd8e0ff] });
  face(il + 4, true);
  walk(il + 4.3, 3, { x: -0.3, y: 0.02, z: -1.5 });
  follow(il + 4.3, 3, 0.6, 0xd8e0ff);
  lamp(0.8, il + 7.4, 0.8);
  k.cam(il + 2, 9, { z: 8.2, ly: 1.15, x: -0.4, lx: -0.5 });

  // ---- verse 2: her mother slides in on her wire to the temple door.
  // 12 Mother says the walls will keep me safe
  k.enter('mother', L(12) - 1.4, 2.4, 'out');
  k.look(L(12) - 1, 1.5, { lamp: [1.0, 0xffb060] });
  k.move('mother.glow', 0.25, L(12), 2);
  k.move('meret.head', -6, L(12), 0.8);
  // 13 That a girl should keep the flame instead — her lamp is the flame. She lowers it.
  k.move('meret.armA', 0, L(13), 1);
  k.move('meret.head', -14, L(13) + 0.4, 0.8);
  // 14 But a flame was made to light the dark — she lifts it high and turns to the river.
  k.move('meret.head', 6, L(14), 0.6);
  k.move('meret.armA', 75, L(14), 0.8, 'out');
  face(L(14) + 0.3, false);
  lamp(1.3, L(14) + 0.6, 0.8);
  follow(L(14), 0.8, 0.85, 0xffe0b0);
  // 15 And I was made to find my way — she crosses to the near bank. Her mother goes in.
  walk(L(15) - 0.2, 2.6, { x: 0.25, y: 0, z: -0.95 });
  lamp(1.1, L(15) + 2.5, 0.6);
  k.leave('mother', L(15) + 1.5, 2.6, 'in');
  k.look(L(15) + 2, 2, { lamp: 0.35 });
  k.cam(L(12), 14, { z: 7.8, ly: 1.15, x: -0.1, lx: -0.2 });

  // ---- pre-chorus 2: the festival. The river rises in front. The barge comes in with the temple lamp.
  k.enter('waves2', p2 - 1.5, 3, 'out');
  sky(p2 - 1, 4, ...FEAST, [0.7, 0.9, 0.5], 0.12);
  tl.set('barge.x', -0.2, 0);
  k.enter('barge', p2 - 0.5, 4.5, 'out');
  sail(p2 + 4, 2, BARGE.x, false);
  tl.base('barge.sway', 0.25);
  k.place('glowB', BARGE.x - 0.2 + 0.05, BARGE.y + 0.75, BARGE.z + 0.15, p2);
  k.look(p2 + 3.5, 2.5, { glowB: [1.1, 0xffc070], fohL: [0.22, 0xffb078], fohR: [0.16, 0xd0a0b0], left: [0.3, 0xff9a60], right: [0.25, 0xff8a50], back: [0.25, 0x8aa8ff] });
  k.move('barge.glow', 0.2, p2 + 2, 2);
  face(L(16), false);
  follow(L(16), 1, 0.8, 0xffd8a8);
  k.move('meret.armA', 50, L(17), 1);
  k.cam(p2, 9, { z: 7.6, ly: 1.1, x: 0.3, lx: 0.4 });

  // ---- chorus 2: the feast chorus. The wind rises, the barge pulls at its mooring, the sky turns.
  const c2 = L(18);
  k.move('meret.armB', 100, c2, 0.8, 'out');
  k.move('meret.armA', 60, c2, 0.8, 'out');
  follow(c2, 0.6, 0.95, 0xffe0b8);
  lamp(1.2, c2, 0.6);
  k.move('barge.sway', 0.8, c2 + 6, 6);
  k.move('waves2.y', 0.06, c2 + 6, 8);
  sky(c2 + 8, 8, ...STORM, [0.6, 0.6, 0.4], 0.1);
  k.move('stars.i', 0.15, c2 + 8, 6);
  k.look(c2 + 9, 6, { fohL: [0.16, 0x9aa8d8], fohR: [0.12, 0x8a98c8], left: [0.18, 0x7080b0], right: [0.14, 0x6070a0], back: [0.45, 0x9ab0ff] });
  k.move('meret.armB', 30, L(21), 1);
  k.downbeats(c2 + 10, E('ch2')).forEach((b, i) => i % 2 === 1 && k.flash('flash', b, 0.9, 0, 0.03, 0.4));
  k.cam(c2, 14, { z: 7.9, ly: 1.2, x: 0.2, lx: 0.2 });

  // ---- bridge: the river rises in the night. The Sky Mother bends down on her strings. Meret takes the oar.
  // 22 When the river rises in the night — the waves rise, the barge breaks loose and drifts.
  k.move('waves2.y', 0.2, L(22), 2.5);
  k.move('waves1.y', 0.12, L(22), 2.5);
  sail(L(22) + 0.6, 3.5, 1.35, false);
  k.move('barge.sway', 1.6, L(22), 1);
  k.flash('flash', L(22) + 0.3, 1.2, 0, 0.03, 0.6);
  k.look(L(22), 1, { glowB: [0.7, 0xffb060] });
  tl.base('glowB.flicker', 0).to('glowB.flicker', 1, L(22), 1);
  // 23 And the sky bends low with all her stars
  k.enter('skymother', L(23) - 0.6, 3.6, 'out');
  k.move('skymother.glow', 0.45, L(23) + 2, 3);
  k.move('stars.i', 0.9, L(23), 3);
  sky(L(23), 3, ...NIGHT, [0.75, 0.6, 0.45], 0.1);
  k.look(L(23), 2.5, { back: [0.55, 0x9ab8ff], follow: [0.7, 0xd8e4ff] });
  // 24 I will take the oar and I will go — she leaps onto the barge on her strings and takes the oar.
  const leap = L(24);
  k.move('meret.y', 0.45, leap, 0.45, 'out');
  k.move('meret.y', BARGE.y + 0.42 - MERET.y, leap + 0.45, 0.5, 'in');
  k.move('meret.x', 1.35 - 0.62 - MERET.x, leap, 0.95, 'inOut');
  k.move('meret.z', BARGE.z - 0.06 - MERET.z, leap + 0.2, 0.75);
  k.move('meret.armA', 20, leap + 0.9, 0.5);
  k.move('meret.armB', -20, leap + 0.9, 0.6);
  lamp(0.9, leap + 1.2, 0.4);
  follow(leap + 1, 0.8, 0.85, 0xd8e4ff);
  // 25 And the morning will find me far — the barge carries her off into the dark.
  sail(L(25) - 1, 5, 0.4, true);
  k.cam(L(22), 14, { z: 7.6, ly: 1.35, x: 0.4, lx: 0.4 });

  // ---- the swell: the voyage. The temple slides off on its wire. The wave machine runs hard.
  k.leave('temple', sw, 3.5, 'in');
  k.leave('papyrusL', sw + 0.5, 3, 'in');
  k.move('dunes.x', -0.9, sw, swEnd - sw + 4, 'inOut');
  tl.hold('barge.rz', sw);
  for (let t = sw, i = 0; t < swEnd - 1; t += 1.1, i++) k.move('barge.rz', i % 2 ? 4 : -4, t, 1.1, 'sine');
  k.move('barge.rz', 0, swEnd - 1, 1);
  for (let t = sw, i = 0; t < swEnd - 1; t += 1.1, i++) k.move('meret.rz', i % 2 ? 4 : -4, t, 1.1, 'sine');
  k.move('meret.rz', 0, swEnd - 1, 1);
  k.downbeats(sw, swEnd - 4).forEach((b, i) => i % 2 === 0 && k.flash('flash', b, 1.1, 0, 0.03, 0.5));
  k.move('meret.armA', 70, sw + 1, 1);
  lamp(1.3, sw + 1.5, 0.6);
  follow(sw + 1, swEnd - sw - 1, 0.9, 0xd8e4ff);
  // The Sky Mother rises away on her strings. The sky stays dark to the last half second, then dawn breaks
  // and the sunrise follows on the chorus.
  k.leave('skymother', swEnd - 5, 4.5, 'inOut');
  sky(swEnd - 0.5, 0.5, ...DAWN, [0.75, 1.0, 0.6], 0.14);
  k.move('stars.i', 0, swEnd - 3, 3);
  k.move('waves2.y', 0.06, swEnd - 3, 3);
  k.move('waves1.y', 0, swEnd - 3, 3);
  k.move('barge.sway', 0.3, swEnd - 3, 3);
  k.cam(sw, swEnd - sw, { z: 7.2, ly: 1.25, x: 0.3, lx: 0.35 });

  // ---- final chorus, up a step: sunrise. The sun climbs, she stands at the prow, the town cheers.
  const c3 = L(26);
  k.move('sun.x', 0, c3 - 2, 0.01);
  k.move('sun.y', 0.05, c3 - 2, 0.01);
  k.move('sun.s', 1.35, c3 - 2, 0.01);
  k.enter('sun', c3 - 1.9, 3, 'out');
  k.flash('flash', c3, 0.8, 0, 0.03, 1.2);
  k.move('sun.glow', 0.8, c3, 0.5);
  k.move('sun.glow', 0.4, c3 + 1.2, 2.5);
  sky(c3, 2.5, ...GLORY, [0.8, 1.0, 0.6], 0.2);
  k.look(c3, 1.5, { fohL: [0.5, 0xffd6a8], fohR: [0.42, 0xffe4c8], left: [0.6, 0xffb070], right: [0.65, 0xffc080], back: [0.2, 0xffd8a0], foot: 0.8, glowA: 0.3 });
  tl.set('glints.x0', -2.6, c3).set('glints.x1', 2.6, c3);
  k.move('glints.rate', 0.5, c3, 1);
  // She walks to the prow and raises both arms to the sun.
  k.move('meret.x', tl.value('meret.x', c3) + 1.05, c3 - 1.5, 1.6);
  k.move('meret.armA', 65, c3, 0.8, 'out');
  k.move('meret.armB', 125, c3, 0.8, 'out');
  k.move('meret.head', 10, c3, 0.6);
  follow(c3 + 0.2, 0.6, 1.0, 0xfff0d0);
  k.cam(c3, 6, { z: 7.6, ly: 1.4, x: 0.3, lx: 0.3 });
  // 27 Let me sail past the reeds and away — the temple slides home. The barge brings the lamp back.
  k.enter('temple', L(27) - 1, 3.5, 'out');
  k.enter('papyrusL', L(27) - 0.5, 3, 'out');
  k.move('dunes.x', 0, L(27), 4);
  sail(L(27), 4, 0.95, true);
  // 28 I have written in gold every hero's story — the heroes rise again by the temple.
  k.move('hero0.x', 0, L(28) - 1, 0.01);
  k.move('hero1.x', 0, L(28) - 1, 0.01);
  k.enter('hero0', L(28) - 0.6, 1.2, 'out');
  k.enter('hero1', L(28) - 0.3, 1.2, 'out');
  k.move('hero0.glow', 0.5, L(28), 0.6);
  k.move('hero1.glow', 0.5, L(28), 0.6);
  // 29 Now it's my turn to take the stage — the town rises on its rods, cheering.
  k.enter('crowd', L(29) - 0.6, 1.6, 'out');
  tl.base('crowd.hop', 0).to('crowd.hop', 1, L(29) + 1, 0.4);
  // 30 Let the whole wide world hear my name — her name shines in gold on the temple wall.
  k.move('temple.glow', 0.5, L(30), 0.5);
  k.move('temple.glow', 0.18, L(30) + 1.4, 2);
  k.flash('fohL', L(30), 1.0, 0.5, 0.05, 1.5);
  tl.set('glints.x0', -2.6, L(30)).set('glints.x1', -0.6, L(30));
  k.move('glints.rate', 0.8, L(30), 0.4);
  k.beats(L(29), L(31)).forEach((b, i) => i % 4 === 0 && k.flash('sun.glow', b, 0.75, 0.4, 0.05, 0.6));
  // 31 I am ready, let me rise — she turns to the north, and the barge sails away.
  tl.set('glints.x0', -2.6, L(31)).set('glints.x1', 2.6, L(31));
  k.move('glints.rate', 0.4, L(31), 1);
  sail(L(31) + 1, 7, 2.6, true, 'in');
  follow(L(31) + 1, 6, 0.9, 0xfff0d0);
  k.cam(L(29), 8, { z: 8.0, ly: 1.3, x: 0.2, lx: 0.2 });

  // ---- outro: the barge leaves the stage. The town and the heroes wave her off.
  const out = L(32);
  sail(out, 5, 4.6, true, 'in');
  k.look(out + 2, 3, { follow: 0, glowB: 0, glowA: 0 });
  k.move('glints.rate', 0, out + 2, 3);
  k.move('crowd.hop', 0, out + 4, 1);
  k.move('hero0.rz', -10, out, 1);
  k.move('hero1.rz', 10, out, 1);

  // ---- the end: the fly curtain comes down. Meret comes back on her strings for the curtain call.
  tl.set('surtitles.i', 0, end - 3.6);
  k.cam(end - 4.8, 4.2, { z: 9.4, x: 0, lx: 0, y: 0.95, ly: 1.05 });
  k.move('curtain.open', 0, end - 3.8, 3.4, 'inOut');
  k.look(end - 1, 2, { follow: 0, house: 0.25 });
  // Offstage, she drops back to the bank in front of the curtain line.
  k.leave('meret', end - 2, 0.01);
  for (const [ch, v] of [['meret.x', 0.0 - MERET.x], ['meret.y', 0], ['meret.z', -0.5 - MERET.z], ['meret.rz', 0], ['meret.s', 1], ['meret.armA', 30], ['meret.armB', 0]] as const) {
    k.move(ch, v, end - 1.9, 0.01);
  }
  k.move('curtain.open', 0.45, end + 0.8, 1.6, 'out');
  k.enter('meret', end + 1.0, 1.2, 'out');
  k.look(end + 0.6, 0.8, { follow: [0.7, 0xffe6c4] });
  k.aim('follow', 0, 1.0, -0.5, end + 0.5, 0.01);
  k.move('meret.rz', -20, end + 2.6, 0.5);
  k.move('meret.rz', 0, end + 3.2, 0.5);
  k.move('curtain.open', 0, end + 4.0, 1.8, 'inOut');
  k.look(end + 4.5, 1.5, { follow: 0, house: 0.7 });
}

const production: Production = {
  id: 'let-me-rise',
  no: 3,
  title: { zh: '如日初升', en: 'Let Me Rise', id: 'Biar Aku Terbit' },
  poster: urls['./art/cut/poster.webp']!,
  audio,
  master,
  pieces,
  curtain: { open: 'fly', close: 'fly' },
  preroll: 7,
  postroll: 7,
  surtitles: { main: 'id', second: 'zh' },
  bill: {
    about: 'A young scribe paints the heroes of the temple wall. She wants a story of her own. She sings the song in English.',
    cast: [['Meret, a scribe', 'Voice'], ['Her mother', 'On a slide'], ['The Sky Mother', 'On strings'], ['The heroes of the wall', 'On rods']],
    scenes: ['The temple steps at dawn', 'The river feast', 'The flood', 'Sunrise'],
  },
  voices: { meret: { name: 'Meret', color: '#f2c879' } },
  cues,
};

export default production;
