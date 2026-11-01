// Un jour viendra · 终有一天 · Suatu Hari Nanti · A Day Will Come
// The cue sheet follows take 2 (song/master.json). Line numbers below are the sung lines in take order.
// Heights (y) are above the stage floor. The stage opening is about 5.5 wide and 2.4 high. Depth runs to z = -4.
//
// The last show of the repertoire, and the grandest rig. Shan is a marionette: strings from his topknot and both
// hands. The ink dragon flies on four strings; the crane, the moon, the lanterns, the clouds and the plum branch
// hang from the loft. Mei, the officer, the soldiers, the village, the camp and the wall slide in on tin wires. The
// ink army and the dragon banner rise on rods from the trap. Fireworks close the show.

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

// Shan's home is the middle of the stage, in front of the camp and the village.
const SHAN = { x: 0, y: 0, z: -1.3 };
const shan = [0, 1, 2, 3].map((k) => part('puppet-shan', k));

const pieces: PieceSpec[] = [
  { id: 'mountains', kind: 'flat', art: art('flat-mountains'), width: 7.4, home: { x: 0, y: -0.95, z: -3.6 }, route: 'fly', startIn: true },
  { id: 'clouds', kind: 'flat', art: art('flat-clouds'), width: 5.2, anchor: 'center', home: { x: 0.3, y: 2.12, z: -3.25 }, route: 'fly', startIn: true, strings: [[0.25, 0.3], [0.75, 0.3]] },
  // The moon hangs in front of the cloud border and below it, so the clouds never hide it.
  { id: 'moon', kind: 'prop', art: art('prop-moon'), width: 0.7, anchor: 'center', home: { x: 1.6, y: 1.35, z: -3.0 }, route: 'fly', strings: [[0.5, 0.04]], glow: 0.3, shadow: false },
  { id: 'wall', kind: 'flat', art: art('flat-wall'), width: 5.4, home: { x: 0.7, y: -0.8, z: -3.1 }, route: 'right', slide: 'right' },
  { id: 'crane', kind: 'prop', art: art('prop-crane'), width: 0.55, anchor: 'center', home: { x: 0, y: 1.6, z: -2.9 }, route: 'fly', strings: [[0.45, 0.25]], shadow: false },
  {
    id: 'dragon', kind: 'prop', art: art('prop-dragon'), width: 4.2, anchor: 'center', home: { x: 0, y: 1.72, z: -2.7 }, route: 'fly', glow: 0.12,
    strings: [[0.12, 0.35], [0.38, 0.25], [0.64, 0.35], [0.9, 0.18]],
  },
  { id: 'army', kind: 'flat', art: art('flat-army'), width: 4.8, home: { x: 0.1, y: -0.55, z: -2.45 }, route: 'trap', rod: true },
  { id: 'village', kind: 'flat', art: art('flat-village'), width: 2.8, home: { x: -1.6, y: -0.28, z: -2.05 }, route: 'left', slide: 'left', startIn: true },
  { id: 'camp', kind: 'flat', art: art('flat-camp'), width: 2.7, home: { x: 1.45, y: -0.18, z: -2.1 }, route: 'right', slide: 'right' },
  { id: 'lanterns', kind: 'prop', art: art('prop-lanterns'), width: 2.5, anchor: 'center', home: { x: 0.35, y: 1.95, z: -1.85 }, route: 'fly', strings: [[0.02, 0.05], [0.5, 0.06], [0.98, 0.05]], glow: 0.15 },
  { id: 'mei', kind: 'prop', art: art('prop-mei'), width: 0.46, home: { x: -1.2, y: 0, z: -1.6 }, route: 'left', slide: 'left', glow: 0.05 },
  { id: 'soldiers', kind: 'prop', art: art('flat-soldiers'), width: 1.55, home: { x: 1.55, y: 0, z: -1.6 }, route: 'right', slide: 'right' },
  { id: 'officer', kind: 'prop', art: art('prop-officer'), width: 0.66, home: { x: 1.1, y: 0, z: -1.45 }, route: 'right', slide: 'right' },
  { id: 'banner', kind: 'prop', art: art('prop-banner'), width: 0.78, home: { x: -0.45, y: 0.05, z: -1.4 }, route: 'trap', rod: true, glow: 0.1 },
  // The water carrier: a second figure of Shan with the yoke, swapped in for one line, as toy theatres do.
  { id: 'yoke', kind: 'prop', art: art('prop-buckets'), width: 1.15, home: { x: 0, y: 0, z: -1.3 }, route: 'left', slide: 'left' },
  {
    id: 'shan', kind: 'puppet', home: SHAN, route: 'fly',
    puppet: {
      height: 0.95, faces: 'right',
      body: { art: shan[2]!, sheet: sheet(shan[2]!), pivot: [0.5, 1] },
      head: { art: shan[1]!, sheet: sheet(shan[1]!), pivot: [0.7, 0.88], attach: [0.5, 0.02], z: -0.6, string: [0.35, 0.12] },
      armA: { art: shan[0]!, sheet: sheet(shan[0]!), pivot: [0.88, 0.235], attach: [0.28, 0.06], z: 1, rest: 0, string: [0.36, 0.33] },
      // In front of the body, so the pinned shoulder cap overlaps the tunic and the arm never looks cut off.
      armB: { art: shan[3]!, sheet: sheet(shan[3]!), pivot: [0.15, 0.1], attach: [0.74, 0.09], z: 1.1, rest: -10, string: [0.78, 0.9] },
    },
  },
  { id: 'cliffL', kind: 'flat', art: art('flat-cliff'), width: 1.45, home: { x: -2.5, y: -0.3, z: -0.95 }, route: 'left', startIn: true },
  { id: 'cliffR', kind: 'flat', art: art('flat-cliff'), width: 1.3, home: { x: 2.6, y: -0.35, z: -1.0 }, route: 'right', startIn: true, mirror: true },
  { id: 'plum', kind: 'prop', art: art('flat-plum'), width: 2.3, anchor: 'center', home: { x: -1.75, y: 2.02, z: -0.7 }, route: 'fly', startIn: true, strings: [[0.06, 0.12], [0.55, 0.3]], shadow: false },
];

// ---------------------------------------------------------------- the cue sheet

function cues({ tl, section, line }: CueContext) {
  const k = cueKit(tl, master);
  const L = (n: number) => line(n).start;
  const S = (id: string) => section(id).start;
  const E = (id: string) => section(id).end;
  const end = master.duration;
  tl.signal('shan.sing', master.vox!.fps, master.vox!.shan ?? []);

  const sky = (t: number, dur: number, top: number, hz: number, bot: number, levels: [number, number, number] = [0.8, 1.0, 0.6], hzY = 0.16) => {
    k.look(t, dur, { cycTop: [levels[0], top], cycHz: [levels[1], hz], cycBot: [levels[2], bot] });
    k.move('cycHz.y', hzY, t, dur);
  };
  // Rice paper by day, ink by night, vermilion in the dream.
  const DAWN = [0x8a9aa8, 0xf3d9a0, 0xe9dfc8] as const;
  const DAY = [0x9fb0bc, 0xf2ead6, 0xe6dcc6] as const;
  const DUSK = [0x4e5470, 0xe0a070, 0xb88a70] as const;
  const NIGHT = [0x121824, 0x2a3446, 0x0e1219] as const;
  const DREAM = [0x2a1416, 0xc23b22, 0x4a1e18] as const;
  const GLORY = [0x7a8aa0, 0xffcf8a, 0xf0d8b0] as const;
  // Before sunrise the sky is still ink, with fire on the horizon. Fireworks need the dark.
  const PREDAWN = [0x161d30, 0xd8844e, 0x241e2a] as const;

  const at = (t: number) => ({ x: SHAN.x + tl.value('shan.x', t), y: SHAN.y + tl.value('shan.y', t), z: SHAN.z + tl.value('shan.z', t) });
  const follow = (t: number, dur = 0.7, level = 0.95, color = 0xfff0dc) => {
    const p = at(t);
    k.aim('follow', p.x, p.y + 0.85, p.z, t, dur);
    k.look(t, dur, { follow: [level, color] });
  };
  /** Shan goes to a place on stage. A marionette walks with a bob on its strings. */
  const walk = (t: number, dur: number, to: { x?: number; y?: number; z?: number }, e: 'inOut' | 'out' | 'in' = 'inOut') => {
    if (to.x !== undefined) k.move('shan.x', to.x - SHAN.x, t, dur, e);
    if (to.y !== undefined) k.move('shan.y', to.y - SHAN.y, t, dur, e);
    if (to.z !== undefined) k.move('shan.z', to.z - SHAN.z, t, dur, e);
    tl.hold('shan.hop', t).to('shan.hop', 1, t, 0.2).hold('shan.hop', t + dur).to('shan.hop', 0, t + dur, 0.2);
  };
  const face = (t: number, left: boolean) => tl.hold('shan.turn', t).to('shan.turn', left ? 1 : 0, t, 0.6);
  const hop = (id: string, t: number, dur: number) => tl.hold(`${id}.hop`, t).to(`${id}.hop`, 1, t, 0.2).hold(`${id}.hop`, t + dur).to(`${id}.hop`, 0, t + dur, 0.2);
  // Fireworks: one shell. The burst comes 0.75 s after the launch, so a cue launches it early.
  let shell = 0;
  const firework = (burst: number, x: number, y: number, hue: number, z = -3.0) => {
    const s = shell++ % 16;
    const at0 = burst - 0.75;
    tl.base(`fw${s}.at`, -99).set(`fw${s}.at`, at0, at0 - 0.02);
    tl.set(`fw${s}.x`, x, at0 - 0.02).set(`fw${s}.y`, y, at0 - 0.02).set(`fw${s}.z`, z, at0 - 0.02).set(`fw${s}.hue`, hue, at0 - 0.02);
    k.flash('flash', burst, 0.22, 0, 0.03, 0.8);
  };
  const p2 = S('pre2'), sw = S('swell'), swEnd = E('swell');

  // ---- preroll: the house settles. The tableau curtain hangs closed.
  const P = -7;
  tl.set('curtain.style', curtainStyleIndex('tableau'), P);
  k.cam(P, 0.01, { x: 0, y: 0.95, z: 9.4, lx: 0, ly: 1.05, lz: -1, fov: 27 });
  k.look(P + 1, 3.5, { house: 0, fohL: 0.12, fohR: 0.1, foot: 0.9, ambient: 0.25 });
  k.aim('follow', 0, 1.0, -0.14, P);
  k.look(P + 3.5, 1.5, { follow: [0.5, 0xffe4bc] });
  tl.set('surtitles.i', 0, P);
  k.move('dust.i', 1.0, P, 1);

  // ---- intro (0 to 14.3): mist over the mountain village. A crane flies by. Shan comes down at the gate.
  k.move('curtain.open', 1, 0.3, 4.2, 'inOut');
  sky(0, 4, ...DAWN, [0.8, 1.0, 0.65], 0.14);
  k.look(0.3, 3, { fohL: [0.34, 0xfff0dc], fohR: [0.28, 0xe8eef4], foot: 0.45, ambient: 0.35, left: [0.3, 0xffe2c0], right: [0.35, 0xd8e4f0], follow: 0 });
  tl.set('crane.x', -3.4, 0);
  tl.base('crane.sway', 1.4);
  k.enter('crane', 1.5, 1.5, 'out');
  k.move('crane.x', 3.4, 1.6, 11, 'linear');
  k.leave('crane', 11.5, 1.5, 'in');
  walk(0, 0.01, { x: -1.05, y: 0, z: -1.62 });
  k.enter('shan', 4.5, 2.6, 'out');
  follow(5.5, 1.2, 0.75, 0xfff0d8);
  k.cam(0.4, 13, { z: 8.4, ly: 1.15, x: -0.3, lx: -0.35 });

  // ---- verse 1: dawn. He leaves. Mei gives him the plum blossom.
  tl.set('surtitles.i', 1, L(0) - 1);
  // 0 À l'aube, j'ai quitté mon village
  walk(L(0), 2, { x: -0.55, z: -1.45 });
  // 1 La brume dormait sur les rizières
  k.move('mountains.x', -0.25, L(1), 8);
  k.move('clouds.x', 0.6, L(1), 8);
  // 2 Tu m'as donné une fleur de prunier — Mei slides in on her wire. He turns to her.
  k.enter('mei', L(2) - 1.4, 1.8, 'out');
  face(L(2) - 0.2, true);
  k.move('shan.armB', 35, L(2) + 0.4, 0.9);
  k.look(L(2), 1.5, { follow: [0.75, 0xffe4e0] });
  k.aim('follow', -0.85, 0.85, -1.5, L(2), 1);
  // 3 Et ton silence valait mille prières
  tl.base('mei.sway', 0).to('mei.sway', 0.35, L(3), 1);
  k.move('shan.head', -8, L(3), 1);
  k.move('glints.rate', 0.08, L(3), 1);
  tl.set('glints.x0', -1.8, L(3)).set('glints.x1', -0.2, L(3));
  // 4 Je n'avais qu'un bâton et mon courage — he turns to the road and lifts the broom like a staff.
  k.move('shan.armB', 0, L(4), 0.6);
  k.move('shan.head', 6, L(4), 0.6);
  face(L(4), false);
  k.move('shan.armA', 18, L(4) + 0.3, 0.6, 'outBack');
  walk(L(4) + 0.6, 2.4, { x: 0.15, z: -1.3 });
  follow(L(4) + 0.6, 2.4, 0.85);
  k.move('glints.rate', 0, L(4) + 1, 1.5);
  // 5 Et tout l'honneur de mes pères — the village and Mei slide away. The wall comes along the ridge.
  k.leave('mei', L(5) - 0.4, 2.2, 'in');
  k.leave('village', L(5), 3, 'inOut');
  k.enter('wall', L(5), 3.2, 'inOut');
  sky(L(5), 3, ...DAY, [0.85, 1.0, 0.65], 0.18);
  k.cam(L(4), 6, { z: 7.9, ly: 1.1, x: 0.2, lx: 0.25 });

  // ---- pre-chorus 1: the camp. The officer hands him a broom. The soldiers laugh.
  k.enter('camp', L(6) - 1.6, 2.6, 'out');
  // 6 On me donne un balai, pas une épée
  k.enter('officer', L(6) - 0.4, 1.6, 'out');
  k.move('shan.armA', 0, L(6), 0.6);
  k.move('shan.head', -6, L(6) + 0.6, 0.6);
  k.enter('soldiers', L(6) + 1.2, 1.6, 'out');
  hop('soldiers', L(6) + 2.6, 2.6);
  follow(L(6), 1, 0.8, 0xfff0dc);
  // 7 Mais mon cœur, lui, n'a jamais plié — he straightens.
  k.move('shan.head', 10, L(7) + 0.3, 0.8, 'outBack');
  k.move('shan.armA', 10, L(7) + 0.3, 0.8);
  k.flash('fohL', L(7) + 0.4, 0.7, 0.34, 0.05, 1.2);
  k.cam(L(6), 6, { z: 7.4, ly: 1.05, x: 0.45, lx: 0.5 });

  // ---- chorus 1: he raises the broom like a banner. The ink dragon comes down on its strings.
  const c1 = L(8);
  k.leave('soldiers', c1 - 1, 1.6, 'in');
  k.leave('officer', c1 - 0.8, 1.6, 'in');
  k.move('shan.armA', 75, c1, 0.7, 'outBack');
  k.move('shan.head', 14, c1, 0.6);
  k.move('shan.armB', 40, c1 + 0.2, 0.8);
  sky(c1 - 0.5, 2.5, ...GLORY, [0.85, 1.1, 0.7], 0.18);
  k.look(c1, 1.5, { fohL: [0.48, 0xfff0d8], fohR: [0.4, 0xfff4e8], left: [0.45, 0xffd8a8], right: [0.45, 0xffe8c8], foot: 0.7 });
  follow(c1, 0.6, 1.0, 0xfff4e0);
  tl.set('dragon.x', -1.4, 0);
  tl.base('dragon.sway', 1.1);
  k.enter('dragon', c1 - 0.6, 2.6, 'out');
  k.move('dragon.x', 1.2, c1 + 1.5, 14, 'inOut');
  k.move('dragon.glow', 0.5, c1, 1);
  k.move('dragon.glow', 0.18, c1 + 2, 3);
  tl.set('glints.x0', -2.6, c1).set('glints.x1', 2.6, c1);
  k.move('glints.rate', 0.3, c1, 1.5);
  k.cam(c1, 7, { z: 7.9, ly: 1.35, x: 0.1, lx: 0.1 });
  // 10 Pour mon village, pour mes montagnes fières — he looks back toward home.
  face(L(10), true);
  k.move('shan.armB', 0, L(10), 0.8);
  face(L(10) + 3.4, false);
  // 11 Un jour viendra, un jour viendra — the dragon rises away.
  k.move('shan.armA', 60, L(11), 0.6);
  k.leave('dragon', L(11) + 2, 2.4, 'in');
  k.move('glints.rate', 0, L(11) + 2, 2);

  // ---- interlude: the working day begins.
  sky(E('ch1'), 3, ...DAY, [0.85, 1.0, 0.65], 0.2);
  k.look(E('ch1'), 2, { fohL: [0.36, 0xfff4e8], fohR: [0.3, 0xeef2f6], left: [0.3, 0xffe8c8], right: [0.3, 0xe0e8f0], foot: 0.5 });
  k.move('shan.armA', 0, E('ch1'), 1);
  k.move('shan.head', 0, E('ch1'), 1);

  // ---- verse 2: the routine.
  // 12 Je balaie la cour avant le soleil — he sweeps on the beat.
  k.beats(L(12) - 0.5, L(13) - 0.6).forEach((b, i) => {
    k.move('shan.armA', i % 2 ? -22 : 8, b, 0.3, 'sine');
    k.move('shan.rz', i % 2 ? -3 : 3, b, 0.3, 'sine');
  });
  k.move('shan.rz', 0, L(13) - 0.6, 0.3);
  follow(L(12), 1, 0.8);
  k.cam(L(12), 4, { z: 7.2, ly: 1.0, x: 0.1, lx: 0.1 });
  // 13 Je porte l'eau, je lave les armures — he is lifted out, and his double slides in with the yoke.
  k.leave('shan', L(13) - 0.5, 0.6, 'in');
  tl.set('yoke.x', -0.6, 0);
  k.enter('yoke', L(13) - 0.3, 1.4, 'out');
  k.move('yoke.x', 0.7, L(13) + 1.1, 2.6, 'inOut');
  hop('yoke', L(13) - 0.3, 4);
  // 14 On rit de moi, je ne dis rien, je veille — the soldiers slide back and laugh.
  k.enter('soldiers', L(14) - 0.6, 1.4, 'out');
  hop('soldiers', L(14) + 0.6, 2.4);
  k.move('yoke.rz', -4, L(14) + 0.5, 0.6);
  // 15 Mais chaque coup me rend plus dur — the yoke goes; Shan comes down again and stands firm.
  k.leave('yoke', L(15) - 0.6, 0.8, 'in');
  walk(L(15) - 0.6, 0.01, { x: 0.25, y: 0, z: -1.3 });
  k.enter('shan', L(15) - 0.3, 0.9, 'out');
  k.move('shan.head', 10, L(15) + 0.6, 0.6, 'outBack');
  k.move('shan.armA', 25, L(15) + 0.6, 0.6, 'outBack');
  k.flash('fohL', L(15) + 0.6, 0.8, 0.36, 0.05, 1.2);
  k.leave('soldiers', E('v2') + 0.5, 1.8, 'in');

  // ---- dusk: the lanterns come down on their cords and glow.
  const dusk = E('v2') + 0.5;
  sky(dusk, 4, ...DUSK, [0.7, 1.0, 0.55], 0.12);
  k.enter('lanterns', dusk + 0.5, 3, 'out');
  k.place('lamp', 0.35, 1.7, -1.6, dusk);
  k.look(dusk + 1.5, 2.5, { lamp: [0.9, 0xffa060], fohL: [0.2, 0xffc898], fohR: [0.14, 0xb8c0d8], left: [0.22, 0xffa070], right: [0.15, 0x9aa8c8], foot: 0.4 });
  k.move('lanterns.glow', 0.7, dusk + 1.5, 2.5);
  tl.base('lanterns.sway', 0.4);
  k.move('shan.armA', 0, dusk, 1);

  // ---- pre-chorus 2 and chorus 2: alone at dusk, he drills with the broom as a spear.
  follow(p2 - 1, 1, 0.85, 0xffe8cc);
  k.cam(p2 - 1, 5, { z: 7.6, ly: 1.15, x: 0.2, lx: 0.2 });
  const drill = k.downbeats(p2, E('ch2') - 1);
  drill.forEach((b, i) => {
    const thrust = i % 2 === 0;
    k.move('shan.armA', thrust ? -55 : 30, b, 0.25, 'outBack');
    k.move('shan.armA', 5, b + 0.9, 0.5);
    k.move('shan.armB', thrust ? 50 : -10, b, 0.3, 'out');
    if (i % 4 === 3) hop('shan', b, 0.8);
    if (i % 4 === 1) face(b, !(Math.floor(i / 4) % 2 === 0));
  });
  const c2 = L(18);
  sky(c2, 4, ...DUSK, [0.75, 1.2, 0.6], 0.14);
  tl.set('dragon.x', 1.6, c2 - 1);
  tl.set('dragon.s', 0.75, c2 - 1);
  k.enter('dragon', c2, 3, 'out');
  k.move('dragon.x', -1.4, c2 + 2, 14, 'inOut');
  k.move('dragon.glow', 0.25, c2, 2);
  k.leave('dragon', L(21) + 1.5, 2.5, 'in');
  k.move('camp.glow', 0.15, c2, 3);
  follow(c2, 1, 1.0, 0xfff0d8);
  k.cam(c2, 10, { z: 7.8, ly: 1.3, x: 0, lx: 0 });

  // ---- bridge: night. He talks to the moon. Far away, Mei stands under the same moon.
  const br = L(22);
  face(br - 1, false);
  k.move('shan.armA', 0, br - 1, 0.6);
  k.move('shan.armB', 0, br - 1, 0.6);
  k.move('shan.s', 1, br - 1, 0.6);
  sky(br - 1, 3, ...NIGHT, [0.7, 0.55, 0.45], 0.1);
  k.move('stars.i', 0.8, br, 3);
  k.enter('moon', br - 1.2, 3, 'out');
  k.look(br - 0.5, 2.5, { lamp: 0.3, fohL: [0.12, 0x9aa8d8], fohR: [0.14, 0xa0b0e0], left: [0.12, 0x8090c0], right: [0.18, 0x9aa8d8], back: [0.4, 0xa8c0ff], follow: [0.55, 0xd8e4ff] });
  k.leave('camp', br, 3, 'inOut');
  k.leave('lanterns', br + 0.5, 3, 'in');
  k.move('shan.y', -0.1, br, 1);
  k.move('shan.head', 16, br + 0.4, 1);
  k.cam(br, 14, { z: 7.6, ly: 1.25, x: -0.2, lx: -0.3 });
  // 23 Elle éclaire aussi ton visage — the village slides back far off, and Mei with it.
  k.enter('village', L(23) - 1, 3, 'inOut');
  k.move('mei.x', -0.35, L(23) - 1, 0.01);
  k.move('mei.z', -0.4, L(23) - 1, 0.01);
  k.enter('mei', L(23) - 0.6, 2.4, 'out');
  // 24 Je garde ta fleur, ma seule fortune — his hand goes to the blossom at his belt.
  k.move('shan.armB', -40, L(24), 1);
  k.move('shan.head', 0, L(24), 1);
  // 25 Attends-moi au bout du voyage
  k.move('shan.head', 14, L(25), 1);
  k.move('mei.sway', 0.6, L(25), 1);

  // ---- the swell: the dream. An ink army rises on its rods behind him. The broom becomes a banner.
  sky(sw, 3, ...DREAM, [0.75, 1.1, 0.6], 0.14);
  k.move('stars.i', 0, sw, 2);
  k.leave('moon', sw, 2.5, 'in');
  k.leave('mei', sw + 0.3, 2, 'in');
  k.leave('village', sw + 0.6, 2.6, 'in');
  k.move('shan.y', 0, sw, 0.6);
  k.move('shan.armB', 0, sw, 0.6);
  k.enter('army', sw + 0.5, 3.2, 'out');
  k.enter('banner', sw + 2, 1.6, 'outBack');
  k.move('banner.glow', 0.35, sw + 2, 2);
  tl.base('banner.sway', 0.6);
  k.move('shan.armA', 70, sw + 2, 0.8, 'outBack');
  k.move('shan.head', 12, sw + 2, 0.6);
  for (let t = sw + 1, i = 0; t < E('ch3') - 4; t += 0.95, i++) k.move('army.x', (i % 2 ? 1 : -1) * 0.05 + (t > S('ch3') ? 0.3 : 0), t, 0.95, 'sine');
  k.downbeats(sw, swEnd).forEach((b, i) => k.flash('flash', b, i % 2 ? 0.3 : 0.6, 0, 0.03, 0.5));
  k.look(sw + 0.5, 2, { fohL: [0.3, 0xff9070], fohR: [0.22, 0xd06050], left: [0.45, 0xff6040], right: [0.45, 0xff7050], back: [0.5, 0xffb070], follow: [0.95, 0xfff0d8] });
  tl.set('dragon.x', -1.2, sw).set('dragon.s', 1.15, sw);
  k.enter('dragon', sw + 4, 3, 'out');
  k.move('dragon.glow', 0.6, sw + 4, 3);
  k.move('dragon.x', 0.9, sw + 6, 9, 'inOut');
  k.cam(sw, swEnd - sw, { z: 7.2, y: 0.55, ly: 1.5, x: 0, lx: 0 });

  // ---- final chorus, up a step: dawn and fireworks. The army marches; the village is honoured.
  const c3 = L(26);
  sky(c3 - 0.3, 3, ...PREDAWN, [0.75, 0.95, 0.5], 0.12);
  k.move('stars.i', 0.5, c3, 2);
  k.leave('dragon', c3 - 0.8, 2.6, 'in');
  k.look(c3, 1.5, { fohL: [0.5, 0xfff0d8], fohR: [0.42, 0xfff4e8], left: [0.55, 0xffc890], right: [0.55, 0xffd8a8], back: [0.3, 0xffd8a0], foot: 0.8 });
  tl.set('glints.x0', -2.6, c3).set('glints.x1', 2.6, c3);
  k.move('glints.rate', 0.45, c3, 1.5);
  k.move('shan.armB', 60, c3, 0.8, 'out');
  follow(c3, 0.6, 1.0, 0xfff4e0);
  firework(c3, 0, 1.75, 0);
  firework(c3 + 0.8, -1.5, 1.55, 1);
  firework(c3 + 1.5, 1.6, 1.65, 2);
  // 27 Mille soldats marcheront derrière moi
  hop('army', L(27), 3.4);
  firework(L(27) + 0.3, -0.7, 1.85, 3);
  firework(L(27) + 1.6, 1.0, 1.5, 0);
  // 28 Pour mon village, pour mes montagnes fières — the village slides back. Mei lifts the blossom.
  tl.set('mei.x', 0, L(28) - 2).set('mei.z', 0, L(28) - 2);
  k.enter('village', L(28) - 1.2, 2.6, 'out');
  k.enter('mei', L(28) - 0.6, 2, 'out');
  k.move('mei.glow', 0.25, L(28), 1);
  face(L(28), true);
  firework(L(28) + 0.4, -1.8, 1.7, 2);
  firework(L(28) + 1.8, 0.4, 1.95, 1);
  // 29 Un jour viendra, un jour viendra — the great cascade. Then the dream sinks back into the trap.
  face(L(29), false);
  k.move('shan.armA', 80, L(29), 0.6, 'outBack');
  k.move('shan.armB', 100, L(29), 0.6, 'outBack');
  const cascade: [number, number, number, number][] = [[0.2, -1.2, 1.8, 0], [0.9, 1.3, 1.9, 3], [1.6, 0, 2.0, 1], [2.4, -1.9, 1.6, 2], [3.1, 1.9, 1.7, 0], [3.9, -0.6, 1.95, 3], [4.6, 0.8, 1.8, 1], [5.4, 0, 1.7, 0]];
  cascade.forEach(([dt, x, y, hue]) => firework(L(29) + dt, x, y, hue));
  // The dragon comes back, smaller and higher, and circles through the cascade.
  tl.set('dragon.s', 0.72, L(29) - 1.8).set('dragon.x', -2.2, L(29) - 1.8).set('dragon.y', 0.25, L(29) - 1.8);
  k.enter('dragon', L(29) - 1.5, 2, 'out');
  k.move('dragon.x', 1.9, L(29) + 0.5, 7, 'inOut');
  k.move('dragon.glow', 0.9, L(29), 1);
  // After the cascade the sun comes up: the sky turns to gold and rice paper.
  sky(L(29) + 5.8, 3.5, ...GLORY, [0.8, 0.95, 0.6], 0.2);
  k.move('stars.i', 0, L(29) + 5.8, 3);
  k.leave('dragon', E('ch3') - 2, 2.5, 'in');
  k.leave('army', E('ch3') - 2.5, 3, 'in');
  k.leave('banner', E('ch3') - 2.2, 2, 'in');
  k.move('glints.rate', 0.15, E('ch3') - 2, 2);
  k.cam(c3, E('ch3') - c3, { z: 8.2, y: 0.9, ly: 1.45, x: 0, lx: 0 });

  // ---- outro: morning in the camp. He sweeps once more and looks toward home. A crane flies by.
  const out = L(30);
  k.enter('camp', out - 1.5, 3, 'out');
  k.move('camp.glow', 0, out - 1.5, 2);
  sky(out - 1, 4, ...DAWN, [0.8, 1.0, 0.65], 0.16);
  k.look(out - 1, 3, { fohL: [0.36, 0xfff0dc], fohR: [0.3, 0xe8eef4], left: [0.3, 0xffe2c0], right: [0.3, 0xd8e4f0], back: 0.15, foot: 0.5 });
  k.move('shan.armA', 0, out - 1, 1);
  k.move('shan.armB', 0, out - 1, 1);
  k.beats(out, out + 3).forEach((b, i) => k.move('shan.armA', i % 2 ? -22 : 8, b, 0.3, 'sine'));
  k.move('shan.armA', 0, out + 3.2, 0.6);
  face(out + 3.6, true);
  k.move('shan.head', 10, out + 3.8, 1);
  k.move('mei.sway', 0.8, out + 3.8, 1);
  tl.set('crane.x', -3.4, out + 1);
  k.enter('crane', out + 1.5, 1.5, 'out');
  k.move('crane.x', 3.4, out + 1.6, 9, 'linear');
  k.leave('crane', out + 9, 1.4, 'in');
  k.move('glints.rate', 0, out + 3, 3);
  follow(out, 2, 0.8);
  k.cam(out, 6, { z: 8.0, ly: 1.1, x: -0.2, lx: -0.3 });

  // ---- the end: the tableau closes. In the curtain call Shan bows, and the last fireworks go up.
  tl.set('surtitles.i', 0, end - 3.6);
  k.cam(end - 4.8, 4.2, { z: 9.4, x: 0, lx: 0, y: 0.95, ly: 1.05 });
  k.move('curtain.open', 0, end - 3.8, 3.4, 'inOut');
  k.look(end - 1, 2, { follow: 0, house: 0.25 });
  k.leave('mei', end - 2, 0.01);
  k.leave('shan', end - 2, 0.01);
  for (const [ch, v] of [['shan.x', 0], ['shan.y', 0], ['shan.z', -0.5 - SHAN.z], ['shan.rz', 0], ['shan.turn', 0], ['shan.armA', 20], ['shan.armB', 0], ['shan.head', 0]] as const) {
    k.move(ch, v, end - 1.9, 0.01);
  }
  k.move('curtain.open', 0.5, end + 0.8, 1.6, 'out');
  k.enter('shan', end + 1.0, 1.2, 'out');
  k.look(end + 0.6, 0.8, { follow: [0.7, 0xffe6c4] });
  k.aim('follow', 0, 1.0, -0.5, end + 0.5, 0.01);
  k.move('shan.rz', -20, end + 2.4, 0.5);
  k.move('shan.rz', 0, end + 3.0, 0.5);
  firework(end + 2.6, -0.6, 1.05, 0, -1.8);
  firework(end + 3.0, 0.6, 1.1, 1, -1.8);
  firework(end + 3.4, 0, 1.2, 3, -1.8);
  k.move('curtain.open', 0, end + 4.4, 1.8, 'inOut');
  k.look(end + 4.8, 1.5, { follow: 0, house: 0.7 });

  spotlights();

  // ---- the spotlight play. Written last, so at the same moment it wins over the washes above. The washes drop and
  // one hard beam picks out the figure that matters. Haze makes the beams visible.
  function spotlights() {
    const side = 1.47; // the side spots' resting aim, a quarter of the opening from the centre
    const restSides = (t: number) => {
      k.aim('left', -side, 0.5, -1.4, t, 0.8);
      k.aim('right', side, 0.5, -1.4, t, 0.8);
    };
    tl.base('haze', 1);
    // Intro: the house goes dim. A pool waits on the stage, and Shan comes down into it on his strings.
    // The sky dims with the house, or the bright cloth would swallow the beam.
    k.look(3.8, 1.6, { fohL: 0.14, fohR: 0.1, left: 0.12, right: 0.14, cycTop: 0.3, cycHz: 0.42, cycBot: 0.3 });
    k.move('haze', 2.2, 3.8, 1.6);
    k.aim('follow', -1.05, 0.85, -1.62, 3.8, 0.01);
    k.look(4.2, 1.2, { follow: [0.95, 0xfff0d8] });
    k.look(L(0) - 1, 2.5, { fohL: [0.34, 0xfff0dc], fohR: [0.28, 0xe8eef4], left: [0.3, 0xffe2c0], right: [0.35, 0xd8e4f0], cycTop: 0.8, cycHz: 1.0, cycBot: 0.65 });
    k.move('haze', 1.2, L(0) - 1, 2.5);
    // Verse 1: the spot crosses to Mei as she gives him the blossom.
    k.look(L(2) - 0.4, 1.2, { fohL: 0.18, fohR: 0.14, left: 0.16, right: 0.12 });
    k.look(L(4), 1.2, { fohL: 0.34, fohR: 0.28, left: 0.3, right: 0.35 });
    // Pre-chorus 1: the officer in a cold side beam, Shan in shadow. On "n'a jamais plié" the spot snaps to him.
    k.look(L(6) - 0.4, 1, { fohL: 0.14, fohR: 0.1, left: 0.1, right: [0.75, 0xa8c0ff], follow: [0.4, 0xd8e0f0], cycTop: 0.3, cycHz: 0.38, cycBot: 0.28 });
    k.aim('right', 1.1, 0.85, -1.45, L(6) - 0.4, 0.8);
    k.move('haze', 2, L(6) - 0.4, 1);
    k.look(L(7) + 0.3, 0.25, { follow: [1.1, 0xfff4e0], right: 0.25 });
    restSides(L(8) - 0.5);
    k.move('haze', 1.3, L(8), 2);
    // Verse 2: when the soldiers laugh, red light from the side; the spot finds the water carrier.
    k.look(L(14) - 0.4, 0.8, { fohL: 0.16, fohR: 0.12, right: [0.7, 0xff5a3a], left: 0.1, follow: [0.85, 0xfff0d8], cycTop: 0.35, cycHz: 0.42, cycBot: 0.3 });
    k.aim('right', 1.55, 0.8, -1.6, L(14) - 0.4, 0.6);
    k.aim('follow', 0.7, 0.85, -1.3, L(14) - 0.4, 0.6);
    k.aim('follow', 0.25, 0.85, -1.3, L(15) - 0.2, 0.4);
    k.flash('follow', L(15) + 0.6, 1.3, 1.0, 0.04, 0.8);
    restSides(L(15) + 1);
    k.look(L(15) + 1, 1.5, { cycTop: 0.85, cycHz: 1.0, cycBot: 0.65, fohL: 0.36, fohR: 0.3, right: [0.3, 0xe0e8f0] });
    // The night drill: the stage goes dark but for one hard shaft. Each thrust brightens it.
    k.look(p2 - 0.5, 2, { fohL: 0.07, fohR: 0.05, left: 0.08, right: 0.06, foot: 0.25, follow: [0.95, 0xffe8cc] });
    k.move('haze', 2.6, p2 - 0.5, 2);
    drill.forEach((b, i) => i % 2 === 0 && k.flash('follow', b, 1.25, 0.95, 0.03, 0.5));
    k.look(c2, 2, { fohL: 0.16, fohR: 0.12, left: [0.28, 0xffa070], right: [0.22, 0xffa070] });
    // Bridge: a pencil beam of moonlight runs from the moon to Mei, far away on the terraces.
    k.place('ray', 1.55, 1.3, -2.9, L(23) - 1);
    k.aim('ray', -1.55, 0.55, -2.0, L(23) - 1, 0.01);
    tl.set('ray.r', 0.8, L(23) - 1).set('ray.g', 0.88, L(23) - 1).set('ray.b', 1, L(23) - 1);
    k.look(L(23) - 0.4, 1.6, { ray: 0.9 });
    k.move('haze', 2.4, br, 2);
    k.look(sw, 1, { ray: 0 });
    // The dream: red searchlights sweep across the army on the war drums.
    k.move('haze', 3.6, sw, 2);
    k.downbeats(sw, swEnd).forEach((b, i) => {
      k.aim('left', i % 2 ? 1.6 : -0.4, 1.6, -2.4, b, 1.1, 'sine');
      k.aim('right', i % 2 ? -1.6 : 0.4, 1.6, -2.4, b, 1.1, 'sine');
    });
    // The fireworks: the searchlights fan up toward the bursts. A gold shaft falls straight down on Shan.
    k.downbeats(c3, E('ch3') - 2).forEach((b, i) => {
      k.aim('left', [-1.5, 0, -1.9, 0.4][i % 4]!, 2.1, -3.0, b, 1.3, 'sine');
      k.aim('right', [1.6, -0.6, 1.9, 0][i % 4]!, 2.0, -3.0, b, 1.3, 'sine');
    });
    k.look(c3, 1.5, { left: [0.6, 0xffc070], right: [0.6, 0xffd090] });
    k.move('haze', 3, c3, 1.5);
    const shaft = at(L(29));
    k.place('ray', shaft.x, 3.4, shaft.z + 0.2, L(29) - 0.5);
    k.aim('ray', shaft.x, 0, shaft.z, L(29) - 0.5, 0.01);
    tl.set('ray.r', 1, L(29) - 0.5).set('ray.g', 0.78, L(29) - 0.5).set('ray.b', 0.45, L(29) - 0.5);
    k.look(L(29), 1, { ray: 0.7 });
    k.look(E('ch3') - 1.5, 2.5, { ray: 0 });
    restSides(E('ch3') - 1.5);
    k.move('haze', 1.4, E('ch3') - 1, 3);
  }
}

const production: Production = {
  id: 'un-jour-viendra',
  no: 4,
  title: { zh: '终有一天', en: 'A Day Will Come', id: 'Suatu Hari Nanti', fr: 'Un jour viendra' },
  poster: urls['./art/cut/poster.webp']!,
  audio,
  master,
  pieces,
  curtain: { open: 'tableau', close: 'tableau' },
  preroll: 7,
  postroll: 7,
  surtitles: { main: 'id', second: 'zh' },
  bill: {
    about: 'A song in French. A village boy joins the imperial army as its lowest servant. His spirit never goes out.',
    cast: [['Shan, a village boy', 'Voice'], ['Mei', 'On a slide'], ['The ink dragon', 'On strings'], ['The army of his dream', 'On rods']],
    scenes: ['Cloud Brook at dawn', 'The camp below the wall', 'The moon', 'The dream'],
  },
  voices: { shan: { name: 'Shan', color: '#e8d6b0' } },
  cues,
};

export default production;
