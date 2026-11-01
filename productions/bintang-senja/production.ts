// Bintang Senja · 暮星 · The Evening Star
// The cue sheet follows take 2 (song/master.json). Line numbers below are the sung lines in take order.
// Heights (y) are above the stage floor. The stage opening is about 5.5 wide and 2.4 high. Depth runs to z = -4.

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

// Bayu's home is the wall walk of Emberhill. Kirana's home is the reeds of the valley.
const BAYU = { x: 1.05, y: 0.5, z: -1.68 };
const KIRANA = { x: -0.8, y: 0.0, z: -0.85 };
const bayu = [0, 1, 2, 3].map((k) => part('puppet-bayu', k));
const kirana = [0, 1, 2, 3].map((k) => part('puppet-kirana', k));

const pieces: PieceSpec[] = [
  { id: 'range', kind: 'flat', art: art('flat-mountains'), width: 7.8, home: { x: -0.4, y: -1.05, z: -3.5 }, route: 'fly', startIn: true, silhouette: { color: 0x4a5478 } },
  { id: 'star', kind: 'prop', art: art('prop-star'), width: 0.3, anchor: 'center', home: { x: -1.5, y: 1.95, z: -3.3 }, route: 'fly', glow: 0.9, shadow: false, strings: [[0.5, 0.06]] },
  { id: 'peak', kind: 'flat', art: art('flat-peak'), width: 2.5, home: { x: -1.25, y: -0.65, z: -3.2 }, route: 'trap', silhouette: { color: 0x2f3758 } },
  { id: 'clouds', kind: 'flat', art: art('flat-clouds'), width: 6.6, home: { x: 0, y: 1.0, z: -3.0 }, route: 'fly', silhouette: { color: 0x1d2236 }, strings: [[0.28, 0.25], [0.72, 0.25]] },
  { id: 'pines', kind: 'flat', art: art('flat-pines'), width: 2.0, home: { x: -2.3, y: -0.05, z: -2.2 }, route: 'left', slide: 'left', silhouette: { color: 0x1f2840 } },
  { id: 'fort', kind: 'flat', art: art('flat-fort'), width: 2.6, home: { x: 1.45, y: -0.25, z: -1.6 }, route: 'right', slide: 'right', startIn: true },
  ...[[-2.3, -1.05, false], [-1.75, -1.2, false], [1.7, -1.1, true], [2.25, -1.25, true]].map(([x, z, mirror], i): PieceSpec => ({
    id: `hound${i}`, kind: 'prop', art: art('prop-hound'), width: 0.9, home: { x: x as number, y: 0, z: z as number },
    route: (mirror ? 'right' : 'left'), slide: (mirror ? 'right' : 'left'), mirror: !mirror, silhouette: { color: 0x0c0c12 }, glow: 1.6,
  })),
  { id: 'summit', kind: 'flat', art: art('flat-summit'), width: 4.4, home: { x: 0.15, y: -0.62, z: -0.95 }, route: 'trap' },
  {
    id: 'bayu', kind: 'puppet', home: BAYU, route: 'trap', rod: true, startIn: true,
    puppet: {
      height: 0.92, faces: 'right',
      body: { art: bayu[2]!, sheet: sheet(bayu[2]!), pivot: [0.5, 1] },
      head: { art: bayu[0]!, sheet: sheet(bayu[0]!), pivot: [0.45, 0.88], attach: [0.5, 0.025], z: -0.6 },
      // The bugle was painted pointing back. Mirrored about its pin, it points forward from the near shoulder.
      armA: { art: bayu[1]!, sheet: sheet(bayu[1]!), pivot: [0.88, 0.62], attach: [0.64, 0.1], z: 1, mirror: true, rest: -40 },
      armB: { art: bayu[3]!, sheet: sheet(bayu[3]!), pivot: [0.16, 0.13], attach: [0.36, 0.1], z: -1, rest: -30 },
    },
  },
  {
    // A marionette: strings from her crown and both hands. She comes down from the loft on them, and rises on them.
    id: 'kirana', kind: 'puppet', home: KIRANA, route: 'fly',
    puppet: {
      height: 0.86, faces: 'left',
      body: { art: kirana[1]!, sheet: sheet(kirana[1]!), pivot: [0.5, 1] },
      head: { art: kirana[0]!, sheet: sheet(kirana[0]!), pivot: [0.15, 0.82], attach: [0.47, 0.02], z: -0.6, string: [0.17, 0.12] },
      armA: { art: kirana[2]!, sheet: sheet(kirana[2]!), pivot: [0.91, 0.12], attach: [0.34, 0.05], z: 1, rest: -35, string: [0.12, 0.3] },
      armB: { art: kirana[3]!, sheet: sheet(kirana[3]!), pivot: [0.12, 0.08], attach: [0.66, 0.05], z: 1, string: [0.25, 0.3] },
    },
  },
  { id: 'reeds', kind: 'flat', art: art('flat-reeds'), width: 4.2, home: { x: -0.7, y: -0.55, z: -0.7 }, route: 'left', slide: 'left', startIn: true },
];

// ---------------------------------------------------------------- the cue sheet

function cues({ tl, section, line }: CueContext) {
  const k = cueKit(tl, master);
  const L = (n: number) => line(n).start;
  const S = (id: string) => section(id).start;
  const E = (id: string) => section(id).end;
  tl.signal('kirana.sing', master.vox!.fps, master.vox!.kirana ?? []);
  tl.base('kirana.rz', 0);

  const sky = (t: number, dur: number, top: number, hz: number, bot: number, levels: [number, number, number] = [0.8, 1.0, 0.55], hzY = 0.18) => {
    k.look(t, dur, { cycTop: [levels[0], top], cycHz: [levels[1], hz], cycBot: [levels[2], bot] });
    k.move('cycHz.y', hzY, t, dur);
  };
  const DUSK = [0x2e3a66, 0xe89b4a, 0xe9a7a0] as const;
  const NIGHT = [0x14204a, 0x2a3a7a, 0x0f1638] as const;
  const MORNING = [0x7fa3e0, 0xffc79a, 0xffd3b0] as const;
  const STORM = [0x1a1e30, 0x3a4060, 0x10131e] as const;
  const LAST = [0x3a2f6a, 0xffb06a, 0xe98a7a] as const;
  const GLORY = [0x2e3a66, 0xffc070, 0xe9a7a0] as const;

  // Where the follow spot looks for each figure. Offsets come from the timeline as written so far.
  const at = (id: 'bayu' | 'kirana', t: number) => {
    const h = id === 'bayu' ? BAYU : KIRANA;
    return { x: h.x + tl.value(`${id}.x`, t), y: (h.y ?? 0) + tl.value(`${id}.y`, t), z: h.z + tl.value(`${id}.z`, t) };
  };
  const follow = (id: 'bayu' | 'kirana', t: number, dur = 0.7, level = 0.95, color = id === 'bayu' ? 0xffdcae : 0xfff0c8) => {
    const p = at(id, t);
    k.aim('follow', p.x, p.y + 0.9, p.z, t, dur);
    k.look(t, dur, { follow: [level, color] });
  };
  const playBugle = (t: number, dur = 2.4) => {
    tl.hold('bayu.armA', t).to('bayu.armA', 62, t, 0.45, 'outBack').hold('bayu.armA', t + dur).to('bayu.armA', 0, t + dur, 0.6);
    k.move('bayu.head', 6, t, 0.4);
    k.move('bayu.head', 0, t + dur, 0.6);
  };
  // Her light: a gentle glow in her paint and a warm lamp beside her. Strong light belongs to the sky door.
  const kiranaLight = (level: number, t: number, dur = 1.5) => {
    k.move('kirana.glow', level * 0.3, t, dur);
    k.look(t, dur, { glowA: [level * 0.9, 0xffe0a0] });
  };
  const lightAt = (id: 'bayu' | 'kirana', name: string, t: number, dur = 0.01) => {
    const p = at(id, t);
    k.place(name, p.x - 0.1, p.y + 0.7, p.z + 0.35, t, dur);
  };

  // ---- preroll: the house settles. The traveller hangs closed.
  const P = -7;
  k.cam(P, 0.01, { x: 0, y: 0.95, z: 9.4, lx: 0, ly: 1.05, lz: -1, fov: 27 });
  k.look(P + 1, 3.5, { house: 0, fohL: 0.12, fohR: 0.1, foot: 0.9, ambient: 0.25 });
  k.aim('follow', 0, 1.0, -0.14, P);
  k.look(P + 3.5, 1.5, { follow: [0.5, 0xffe4bc] });
  tl.set('surtitles.i', 0, P);
  tl.set('curtain.style', 0, P);

  // ---- intro (0 to 11.3): dusk over Emberhill. Bayu sounds the call. A star falls into the valley.
  k.move('curtain.open', 1, 0.3, 3.6, 'inOut');
  sky(0, 3, ...DUSK, [0.8, 1.1, 0.55]);
  k.look(0.3, 2.5, { fohL: [0.32, 0xffcf9a], fohR: [0.22, 0xe8c8b0], foot: 0.55, ambient: 0.28, left: [0.3, 0xffb070], right: [0.55, 0xffc890] });
  k.cam(0.4, 11, { z: 8.0, ly: 1.15, x: 0.3, lx: 0.3 });
  follow('bayu', 0.4, 0.01, 0.85);
  playBugle(1.0, 5.2);
  // The meteor: from high on the left down into the reeds.
  tl.set('meteor.x', -3.0, 6.0).set('meteor.y', 2.4, 6.0).set('meteor.z', -3.3, 6.0);
  k.move('meteor.i', 1, 6.0, 0.3);
  k.move('meteor.x', -0.85, 6.1, 3.0, 'in');
  k.move('meteor.y', 0.45, 6.1, 3.0, 'in');
  k.move('meteor.z', -1.0, 6.1, 3.0, 'in');
  k.move('meteor.i', 0, 9.15, 0.5);
  k.place('glowB', -0.85, 0.5, -0.6, 0);
  k.flash('glowB', 9.1, 2.2, 0.5, 0.05, 1.6);
  tl.set('glowB.r', 1, 0).set('glowB.g', 0.86, 0).set('glowB.b', 0.6, 0);
  tl.set('bayu.turn', 0, 0);
  tl.hold('bayu.turn', 9.4).to('bayu.turn', 1, 9.4, 0.7);
  k.cam(9.3, 2.5, { x: -0.3, lx: -0.4 });

  // ---- verse 1: the finding, and the days at the fort.
  tl.set('surtitles.i', 1, L(0) - 1);
  // 0 Aku jatuh di ujung senja — Kirana lies in the reeds, glowing faintly.
  tl.base('kirana.rz', 78);
  k.enter('kirana', L(0) - 1.6, 1.4, 'out');
  kiranaLight(0.7, L(0) - 1.6);
  lightAt('kirana', 'glowA', L(0) - 1.6);
  follow('kirana', L(0) - 0.6, 0.6, 0.8);
  sky(L(0), 4, ...NIGHT, [0.7, 0.5, 0.4], 0.12);
  k.move('stars.i', 0.6, L(0), 4);
  // 1 Ke lembah sepi tanpa nama — Bayu leaves the wall and comes down into the valley.
  k.leave('bayu', L(1), 0.9, 'in');
  k.move('bayu.x', -1.45, L(1) + 1.0, 0.01);
  k.move('bayu.y', -0.5, L(1) + 1.0, 0.01);
  k.move('bayu.z', 0.83, L(1) + 1.0, 0.01);
  k.move('bayu.x', -1.0, L(1) + 1.1, 0.01);
  k.enter('bayu', L(1) + 1.2, 1.2, 'out');
  k.move('bayu.x', -1.55, L(1) + 2.4, 2.2, 'out');
  tl.hold('bayu.hop', L(1) + 2.4).to('bayu.hop', 1, L(1) + 2.4, 0.2).hold('bayu.hop', L(1) + 4.4).to('bayu.hop', 0, L(1) + 4.4, 0.2);
  tl.hold('bayu.turn', L(1) + 1.1).to('bayu.turn', 0, L(1) + 1.1, 0.01);
  k.cam(L(1), 4, { x: -0.6, lx: -0.7, z: 7.2, ly: 0.9 });
  // 2 Kau angkat cahaya yang hampir padam — he kneels. She sits up and reaches for him.
  follow('bayu', L(2) - 0.4, 0.6, 0.6);
  k.move('bayu.y', -0.58, L(2), 0.6);
  k.move('bayu.armB', 60, L(2) + 0.2, 0.9);
  k.move('kirana.rz', 18, L(2) + 0.3, 1.6, 'inOut');
  k.move('kirana.armA', 40, L(2) + 0.8, 1.0);
  kiranaLight(0.85, L(2) + 0.3);
  // 3 Kau bawa pulang dalam genggam — they rise and walk toward the fort.
  k.move('bayu.y', -0.5, L(3), 0.5);
  k.move('kirana.rz', 0, L(3), 0.8);
  k.move('bayu.armB', 0, L(3) + 0.5, 0.8);
  k.move('kirana.armA', 0, L(3) + 0.5, 0.8);
  // 4 Kau tiup terompet dari menara — morning on the wall. Both appear on the walk; he plays.
  k.leave('bayu', L(4) - 1.2, 0.5, 'in');
  k.leave('kirana', L(4) - 1.2, 0.5, 'in');
  for (const [ch, v] of [['bayu.x', 0], ['bayu.y', 0], ['bayu.z', 0], ['kirana.x', 2.65], ['kirana.y', 0.5], ['kirana.z', -0.86]] as const) k.move(ch, v, L(4) - 0.65, 0.01);
  k.enter('bayu', L(4) - 0.6, 0.8, 'out');
  k.enter('kirana', L(4) - 0.45, 0.8, 'out');
  tl.hold('kirana.turn', L(4) - 0.6).to('kirana.turn', 0, L(4) - 0.6, 0.01);
  sky(L(4) - 0.8, 3, ...MORNING, [0.85, 0.9, 0.6], 0.22);
  k.move('stars.i', 0, L(4) - 0.8, 2);
  k.look(L(4) - 0.8, 2, { fohL: [0.5, 0xffe2c0], fohR: [0.45, 0xfff0dc], right: [0.7, 0xffe0b0], left: 0.2 });
  k.cam(L(4) - 0.6, 3, { x: 0.8, lx: 0.9, z: 7.0, ly: 1.2 });
  lightAt('kirana', 'glowA', L(4) - 0.4);
  playBugle(L(4) + 0.2, 3.6);
  follow('bayu', L(4), 0.5, 0.8, 0xfff0d8);
  // 6 Namun cahayaku memudar setiap hari — days pass on the sky. Her light fades.
  const d0 = L(6) - 0.4;
  [0, 1].forEach((n) => {
    sky(d0 + n * 2.4, 1.1, ...DUSK, [0.75, 1.0, 0.5]);
    sky(d0 + n * 2.4 + 1.2, 1.1, ...MORNING, [0.8, 0.85, 0.55], 0.22);
  });
  kiranaLight(0.4, L(6), 4.5);
  k.move('kirana.head', -10, L(6) + 1, 2);
  follow('kirana', L(6) - 0.2, 0.6, 0.75);
  // 7 Bintang tak bisa lama tinggal di sini — night again. She looks up at the stars.
  sky(L(7) - 0.4, 2.5, ...NIGHT, [0.7, 0.45, 0.4], 0.12);
  k.move('stars.i', 1, L(7) - 0.4, 2.5);
  k.move('kirana.head', 14, L(7) + 0.2, 1.4);
  k.look(L(7) - 0.4, 2, { fohL: [0.22, 0x9db0ff], fohR: [0.2, 0x8fa8ff], right: [0.45, 0x9fb8ff] });
  k.cam(L(7), 4, { ly: 1.5, z: 7.4 });

  // ---- pre-chorus 1: she asks him to take her to the highest peak. The Stair of Winds rises in the north.
  // 8 Jangan menangis, wahai pemberani
  k.move('kirana.head', 0, L(8) - 0.3, 1);
  tl.hold('kirana.turn', L(8) - 0.2).to('kirana.turn', 0, L(8) - 0.2, 0.01);
  k.move('kirana.armB', 25, L(8), 1.0);
  k.move('bayu.head', -10, L(8) + 0.4, 1.2);
  follow('kirana', L(8) - 0.3, 0.7, 0.9);
  k.cam(L(8) - 0.3, 3, { ly: 1.2, z: 6.9, x: 1.0, lx: 1.1 });
  // 9 Antar aku ke puncak tertinggi — she points north. The peak rises; its path glows.
  k.move('kirana.armA', 50, L(9), 0.9, 'outBack');
  k.enter('peak', L(9) - 0.2, 2.8, 'out');
  k.move('peak.glow', 0.3, L(9) + 1.5, 2.5);
  sky(L(9), 3, NIGHT[0], 0x7a6ab8, NIGHT[2], [0.7, 0.7, 0.4], 0.15);
  k.cam(L(9), 3.5, { x: -0.2, lx: -0.6, z: 7.6, ly: 1.3 });
  k.move('bayu.head', 0, L(9) + 1, 1);

  // ---- chorus 1: they set out at dusk.
  // 10 Bawa aku pulang ke langit senja — the fort slides away. They walk north; the hills drift past.
  const c1 = L(10);
  k.leave('fort', c1 - 0.4, 3.2, 'inOut');
  k.leave('bayu', c1 - 0.6, 0.5, 'in');
  k.leave('kirana', c1 - 0.6, 0.5, 'in');
  for (const [ch, v] of [['bayu.x', -0.4], ['bayu.y', -0.5], ['bayu.z', 0.83], ['kirana.x', 0.6], ['kirana.y', 0], ['kirana.z', 0]] as const) k.move(ch, v, c1 - 0.05, 0.01);
  k.move('kirana.armA', 0, c1, 0.01);
  k.move('kirana.armB', 0, c1, 0.01);
  tl.hold('bayu.turn', c1).to('bayu.turn', 1, c1, 0.01);
  k.enter('bayu', c1 + 0.1, 1.0, 'out');
  k.enter('kirana', c1 + 0.25, 1.0, 'out');
  k.move('bayu.x', -1.0, c1 + 1.2, 4.0, 'inOut');
  k.move('kirana.x', 0.0, c1 + 1.2, 4.0, 'inOut');
  for (const id of ['bayu', 'kirana']) tl.hold(`${id}.hop`, c1 + 1.2).to(`${id}.hop`, 1, c1 + 1.2, 0.2).hold(`${id}.hop`, c1 + 5).to(`${id}.hop`, 0, c1 + 5, 0.2);
  k.leave('reeds', c1 + 0.5, 4, 'inOut');
  k.move('range.x', 0.5, c1, 14, 'linear');
  k.move('peak.x', 0.35, c1, 14, 'linear');
  sky(c1 - 0.3, 3, ...DUSK, [0.85, 1.15, 0.6]);
  k.move('stars.i', 0.25, c1, 3);
  kiranaLight(0.6, c1);
  k.look(c1, 1.5, { fohL: [0.35, 0xffcf9a], fohR: [0.28, 0xe8c8b0], left: [0.55, 0xffb070], right: [0.45, 0xffc890] });
  follow('kirana', c1 + 1.2, 1.2, 0.8);
  k.cam(c1, 6, { x: -0.3, lx: -0.4, z: 7.2, ly: 1.05 });
  // 11 Walau esok kita tak lagi bersama — they stop. He takes her hand.
  k.move('bayu.armB', 55, L(11) + 0.2, 1);
  k.move('kirana.armA', 35, L(11) + 0.2, 1);
  tl.hold('kirana.turn', L(11)).to('kirana.turn', 0, L(11), 0.01);
  // 12 Tiuplah terompetmu saat petang tiba — he answers on the bugle.
  k.move('bayu.armB', 0, L(12) - 0.3, 0.5);
  playBugle(L(12), 2.8);
  follow('bayu', L(12) - 0.2, 0.5, 1, 0xffd89a);
  k.move('glints.rate', 0.25, L(12), 1);
  tl.set('glints.x0', -2.4, 0).set('glints.x1', 2.4, 0);
  // 13 Akulah bintang yang menjawab namamu — the evening star kindles faintly in the sky.
  k.enter('star', L(13) - 0.4, 2, 'out');
  k.move('star.glow', 0.6, L(13), 2);
  k.move('kirana.head', 14, L(13), 1);
  follow('kirana', L(13) - 0.2, 0.6, 0.85);
  k.move('glints.rate', 0, E('ch1') + 1, 2);
  k.leave('star', E('ch1') + 1.5, 2, 'in');
  k.move('kirana.head', 0, E('ch1'), 1);
  k.move('kirana.armA', 0, E('ch1'), 1);

  // ---- interlude: the mountain road. Pines pass, the light cools, snow begins.
  const road = E('ch1') + 0.4;
  k.enter('pines', road, 3, 'out');
  k.move('pines.x', 1.4, road, 10, 'linear');
  for (const id of ['bayu', 'kirana']) tl.hold(`${id}.hop`, road).to(`${id}.hop`, 1, road, 0.2).hold(`${id}.hop`, road + 7).to(`${id}.hop`, 0, road + 7, 0.3);
  tl.set('snow.x0', -2.8, 0).set('snow.x1', 2.8, 0);
  k.move('snow.rate', 0.4, road + 3, 4);
  sky(road + 1, 6, ...STORM, [0.6, 0.35, 0.4], 0.14);
  k.look(road + 1, 4, { fohL: [0.22, 0xb8c4e8], fohR: [0.18, 0xa8b8e0], left: [0.4, 0x9fb0e0], right: [0.35, 0x9fb0e0], follow: 0.3 });
  k.cam(road, 8, { x: 0, lx: -0.1, z: 7.6, ly: 1.1 });

  // ---- verse 2: the storm and the Hollow Hounds.
  // 14 Badai turun di jalan gunung
  k.enter('clouds', L(14) - 0.6, 2.4, 'out');
  k.move('snow.rate', 1, L(14), 2);
  k.downbeats(L(14), L(15)).forEach((b, i) => i % 2 === 0 && k.flash('flash', b, 0.9, 0, 0.03, 0.4));
  // 15 Serigala bayang datang mengepung — the hounds slink in from both wings, eyes burning.
  [0, 1, 2, 3].forEach((i) => k.enter(`hound${i}`, L(15) - 0.3 + i * 0.35, 2.2, 'out'));
  [0, 1, 2, 3].forEach((i) => tl.base(`hound${i}.sway`, 0.8));
  k.look(L(15), 1.2, { left: [0.6, 0xc05030], right: [0.55, 0xc05030] });
  k.cam(L(15), 3, { z: 7.0, ly: 0.95 });
  // 16 Kau berdiri tegak di depanku — Bayu steps in front of her.
  k.move('bayu.x', -0.55, L(16), 0.8, 'out');
  k.move('bayu.z', 0.95, L(16), 0.8);
  follow('bayu', L(16) - 0.2, 0.5, 1);
  // 17 Dengan lagu yang tak pernah ragu — he plays. The hounds fall back on every beat.
  playBugle(L(17), 3.2);
  k.beats(L(17), L(17) + 3.2).forEach((b, i) => {
    k.flash('fohL', b, 0.9, 0.25, 0.03, 0.35);
    [0, 1, 2, 3].forEach((h) => k.move(`hound${h}.x`, (h < 2 ? -1 : 1) * 0.12 * (i + 1), b, 0.25, 'out'));
  });
  [0, 1, 2, 3].forEach((i) => k.leave(`hound${i}`, L(17) + 3.4 + i * 0.2, 1.4, 'in'));

  // ---- pre-chorus 2: the climb. The storm clears. The summit rises under the last twilight.
  // 18 Jangan menangis, wahai pemberani
  const climb = L(18) - 0.5;
  k.leave('clouds', climb, 3, 'inOut');
  k.leave('pines', climb, 3, 'in');
  k.move('snow.rate', 0.15, climb, 3);
  k.enter('summit', climb + 0.6, 3.2, 'out');
  k.move('range.y', -0.5, climb, 9, 'inOut');
  k.move('peak.y', -0.3, climb, 9, 'inOut');
  sky(climb + 0.5, 6, ...LAST, [0.8, 1.15, 0.55], 0.2);
  k.look(climb + 0.5, 4, { fohL: [0.38, 0xffc898], fohR: [0.3, 0xffd8b8], left: [0.5, 0xffb070], right: [0.5, 0xffa070] });
  // Offsets are from home: Bayu's home is the wall walk, 0.5 up, so his summit offset is 0.42 - 0.5.
  k.move('bayu.y', -0.08, climb + 1.2, 3.4, 'inOut');
  k.move('kirana.y', 0.42, climb + 1.2, 3.4, 'inOut');
  k.move('bayu.x', -0.6, climb + 1.2, 3.4, 'inOut');
  k.move('bayu.z', 0.63, climb + 1.2, 3.4);
  k.move('kirana.z', -0.2, climb + 1.2, 3.4);
  k.move('kirana.x', 0.15, climb + 1.2, 3.4, 'inOut');
  tl.hold('bayu.turn', climb + 1.2).to('bayu.turn', 0, climb + 1.2, 0.6);
  follow('kirana', L(18) - 0.2, 0.6, 0.85);
  // 19 Antar aku ke puncak tertinggi
  follow('bayu', L(19) - 0.2, 0.6, 0.85);
  k.cam(climb, 9, { z: 7.0, ly: 1.25, x: -0.2, lx: -0.2 });

  // ---- chorus 2: on the summit under the last twilight.
  const c2 = L(20);
  follow('kirana', c2 - 0.2, 0.6, 0.95);
  kiranaLight(0.55, c2);
  lightAt('kirana', 'glowA', c2 - 0.2);
  k.move('kirana.armA', 30, L(21), 1);
  k.move('bayu.armB', 50, L(21), 1);
  k.move('bayu.armB', 0, L(22) - 0.3, 0.5);
  playBugle(L(22), 2.8);
  follow('bayu', L(22) - 0.2, 0.5, 1, 0xffd89a);
  k.move('glints.rate', 0.35, L(22), 1);
  k.enter('star', L(23) - 0.5, 2, 'out');
  k.move('star.glow', 0.9, L(23), 2);
  k.move('kirana.head', 14, L(23), 1);
  follow('kirana', L(23) - 0.2, 0.6, 0.9);
  k.cam(c2, 10, { z: 6.6, ly: 1.4 });
  k.move('glints.rate', 0, E('ch2'), 1.5);
  k.leave('star', E('ch2'), 1.6, 'in');

  // ---- bridge: the sky opens at the summit.
  // 24 Di puncak dunia kau lepas tanganku — the door of light opens. Their hands part.
  const door = { x: -0.25, y: 1.85 };
  tl.set('portal.x', door.x, 0).set('portal.y', door.y, 0).set('portal.s', 0.4, 0);
  k.move('portal.i', 0.6, L(24) - 0.5, 3, 'out');
  k.move('portal.s', 2.6, L(24) - 0.5, 4, 'out');
  k.move('kirana.head', 20, L(24), 1);
  k.move('kirana.armA', 0, L(24) + 0.8, 1.4);
  k.move('bayu.armB', 0, L(24) + 0.8, 1.4);
  k.look(L(24), 2, { fohL: 0.2, fohR: 0.16, left: 0.3, right: 0.3, follow: 0.5 });
  sky(L(24), 3, LAST[0], 0xffd2a0, LAST[2], [0.8, 0.6, 0.5], 0.34);
  k.cam(L(24) - 0.5, 4, { ly: 1.6, z: 7.0 });
  // 25 Air matamu jatuh jadi hujan cahaya — a rain of light.
  k.move('glints.rate', 0.9, L(25) - 0.2, 1.5);
  // 26 Jangan lupakan aku — her hand to her heart. He kneels.
  k.move('kirana.armB', 25, L(26), 1);
  k.move('bayu.y', -0.16, L(26), 0.8);
  follow('kirana', L(26) - 0.2, 0.6, 1);
  // 27 Aku takkan pernah jauh — she begins to rise.
  k.move('kirana.y', 0.7, L(27), 1.6, 'in');
  kiranaLight(0.9, L(27), 2);

  // ---- the trumpet solo: she rises into the door. The hounds return. Bayu plays them back into the dark.
  const solo = S('solo'), soloEnd = E('solo');
  k.move('glints.rate', 0.3, solo, 2);
  k.move('kirana.x', door.x - KIRANA.x - 0.05, solo, soloEnd - solo - 1, 'inOut');
  k.move('kirana.y', door.y - 0.35, solo, soloEnd - solo - 1, 'inOut');
  k.move('kirana.z', -1.2, solo, soloEnd - solo - 1, 'inOut');
  tl.base('kirana.sway', 0).to('kirana.sway', 0.8, solo, 2);
  kiranaLight(1.3, solo, soloEnd - solo);
  k.move('portal.i', 0.85, solo, soloEnd - solo);
  k.move('bayu.y', -0.08, solo, 0.6);
  [0, 1, 2, 3].forEach((i) => {
    k.move(`hound${i}.x`, 0, solo, 0.01);
    k.enter(`hound${i}`, solo + 1.5 + i * 0.5, 1.8, 'out');
  });
  const bars = k.downbeats(solo + 3.5, soloEnd - 1);
  bars.forEach((b, i) => {
    if (i % 2 === 0) playBugle(b, 2.2);
    k.flash('fohL', b, 1.0, 0.25, 0.03, 0.5);
    [0, 1, 2, 3].forEach((h) => k.move(`hound${h}.x`, (h < 2 ? -1 : 1) * 0.35 * (i + 1), b, 0.4, 'out'));
  });
  [0, 1, 2, 3].forEach((i) => k.leave(`hound${i}`, soloEnd - 3 + i * 0.25, 1.2, 'in'));
  follow('kirana', solo, soloEnd - solo, 0.9);
  k.cam(solo, soloEnd - solo, { ly: 1.9, z: 7.4, x: -0.1, lx: -0.2 }, 'inOut');

  // ---- final chorus, up a step: she becomes the evening star.
  // 28 Bawa aku pulang ke langit senja
  const c3 = L(28);
  k.move('kirana.s', 0.05, c3 - 0.6, 1.2, 'in');
  k.leave('kirana', c3 + 0.7, 0.01);
  tl.set('star.x', door.x + 1.5, 0).set('star.y', door.y - 1.95, 0);
  k.flash('flash', c3, 1.4, 0, 0.03, 1.2);
  k.enter('star', c3 - 0.1, 0.01);
  k.move('star.glow', 2.4, c3 - 0.1, 0.3);
  k.move('star.s', 1.4, c3 - 0.1, 0.6, 'outBack');
  k.move('star.glow', 1.4, c3 + 0.6, 2);
  k.move('portal.i', 0.25, c3, 3);
  k.move('portal.s', 1.4, c3, 3);
  k.move('glints.rate', 0.6, c3, 1);
  sky(c3, 4, ...GLORY, [0.9, 1.0, 0.6], 0.2);
  k.look(c3, 2, { fohL: [0.45, 0xffd0a0], fohR: [0.38, 0xffe0c0], left: [0.5, 0xffb070], right: [0.5, 0xffb070], glowA: 0 });
  follow('bayu', c3 + 0.6, 1, 0.95, 0xffd8a0);
  k.cam(c3, 6, { ly: 1.45, z: 7.8, x: 0, lx: -0.2 });
  // 29 to 31 — Bayu alone on the summit. He raises the bugle to her.
  k.move('bayu.y', -0.08, L(29), 0.6);
  playBugle(L(31), 3.0);
  k.beats(L(29), L(32)).forEach((b, i) => i % 4 === 0 && k.flash('star.glow', b, 2.2, 1.4, 0.05, 0.6));
  // 32 Akulah bintang yang menjawab namamu — the star answers.
  k.flash('star.glow', L(32), 3, 1.6, 0.1, 1.5);
  k.move('glints.rate', 0, E('ch3'), 2);
  k.move('portal.i', 0, E('ch3'), 3);

  // ---- outro: years later. Bayu on the wall at dusk. The evening star shines brightest.
  const out = L(33) - 4.5;
  k.leave('summit', out, 2.4, 'in');
  k.leave('bayu', out, 0.5, 'in');
  k.move('range.y', 0, out, 3);
  k.move('peak.y', 0, out, 3);
  k.move('range.x', 0, out, 3);
  k.move('peak.x', 0, out, 3);
  k.enter('fort', out + 0.4, 2.6, 'out');
  for (const [ch, v] of [['bayu.x', 0], ['bayu.y', 0], ['bayu.z', 0]] as const) k.move(ch, v, out + 0.6, 0.01);
  tl.hold('bayu.turn', out + 0.6).to('bayu.turn', 1, out + 0.6, 0.01);
  k.enter('bayu', out + 2.8, 0.9, 'out');
  playBugle(out + 3.6, 4.2);
  sky(out, 4, ...DUSK, [0.8, 1.0, 0.55]);
  k.move('star.x', -0.4 + 1.5, out, 0.01);
  k.move('star.glow', 2.2, out + 3.6, 3);
  follow('bayu', out + 3, 1, 0.8);
  k.cam(out, 6, { x: 0.4, lx: 0.3, z: 7.6, ly: 1.3 });

  // ---- the end: the traveller closes, then a curtain call.
  const end = master.duration;
  tl.set('surtitles.i', 0, end - 3.6);
  tl.set('audience.i', 1, end - 4.5);
  k.cam(end - 4.8, 4.2, { z: 9.4, x: 0, lx: 0, y: 0.95, ly: 1.05 });
  k.move('curtain.open', 0, end - 3.8, 3.4, 'inOut');
  k.look(end - 1, 2, { follow: 0, house: 0.25 });
  k.move('curtain.open', 0.45, end + 0.8, 1.6, 'out');
  k.look(end + 0.6, 0.8, { follow: [0.7, 0xffe6c4] });
  k.aim('follow', BAYU.x, 1.2, BAYU.z, end + 0.5, 0.01);
  k.move('bayu.rz', -22, end + 2.4, 0.5);
  k.move('bayu.rz', 0, end + 3.0, 0.5);
  k.move('curtain.open', 0, end + 4.0, 1.8, 'inOut');
  k.look(end + 4.5, 1.5, { follow: 0, house: 0.7 });
}

const production: Production = {
  id: 'bintang-senja',
  no: 2,
  title: { zh: '暮星', en: 'The Evening Star', id: 'Bintang Senja' },
  poster: urls['./art/cut/poster.webp']!,
  audio,
  master,
  pieces,
  curtain: { open: 'traveller', close: 'traveller' },
  preroll: 7,
  postroll: 7,
  surtitles: { main: 'id', second: 'zh' },
  bill: {
    about: 'A star falls at twilight. A young bugler carries her back to the sky. She sings the song in Indonesian.',
    cast: [['Kirana, a fallen star', 'Voice'], ['Bayu, a bugler', 'Trumpet'], ['The Hollow Hounds', 'On rods']],
    scenes: ['Emberhill at dusk', 'The reeds of the valley', 'The Stair of Winds'],
  },
  voices: { kirana: { name: 'Kirana', color: '#f2d27a' } },
  cues,
};

export default production;
