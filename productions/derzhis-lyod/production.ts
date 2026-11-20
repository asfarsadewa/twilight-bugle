// Держись, лёд · Hold, Ice · Bertahanlah, Es · 冰啊，撑住
// The cue sheet follows the producer's Suno recording (song/master.json). Line numbers below are the sung lines.
// Heights (y) are above the stage floor. The stage opening is about 5.5 wide and 2.4 high. Depth runs to z = -4.
//
// The siege of Leningrad, winter 1941 to spring 1942. A road of lanterns crosses the frozen lake. Alyosha drives
// flour in and children out. His mother gives her bread to his little sister Masha and dies. He takes Masha over the
// ice to the train, turns the truck back onto the thawing ice, and in April the ice does not hold. Years later Masha
// stands at the open water. The cards are painted as Palekh lacquer miniatures. Alyosha and the grown Masha are
// marionettes. The truck is a card on a slide wire. Its cab light is the theatre's warm practical.

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
// The truck runs on the ice between the far lake and the near ice row.
const TRUCK_Z = -1.7;
// The room: the table stands at the left, the window behind.
const TABLE = { x: -0.9, z: -1.5 };

const pieces: PieceSpec[] = [
  { id: 'clouds', kind: 'prop', art: art('prop-clouds'), width: 5.6, anchor: 'center', home: { x: 0, y: 2.3, z: -3.45 }, route: 'fly', strings: [[0.15, 0.25], [0.5, 0.2], [0.85, 0.25]], shadow: false },
  { id: 'lake', kind: 'flat', art: art('flat-lake'), width: 6.6, home: { x: 0, y: -0.2, z: -3.3 }, route: 'trap', rod: true, startIn: true },
  { id: 'water', kind: 'flat', art: art('flat-water'), width: 6.6, home: { x: 0, y: -0.2, z: -3.25 }, route: 'trap', rod: true },
  { id: 'city', kind: 'flat', art: art('flat-city'), width: 6.0, home: { x: 0, y: -0.1, z: -3.0 }, route: 'trap', rod: true },
  { id: 'shore', kind: 'flat', art: art('flat-shore'), width: 3.6, home: { x: 0, y: -0.05, z: -2.8 }, route: 'trap', rod: true },
  { id: 'train', kind: 'prop', art: art('prop-train'), width: 3.2, home: { x: 0, y: 0.05, z: -2.6 }, route: 'right', slide: 'right' },
  { id: 'convoy', kind: 'flat', art: art('flat-convoy'), width: 3.4, home: { x: 0, y: 0.05, z: -2.9 }, route: 'left', slide: 'left' },
  { id: 'posts', kind: 'flat', art: art('prop-posts'), width: 6.4, home: { x: 0, y: -0.05, z: -2.5 }, route: 'trap', rod: true },
  { id: 'room', kind: 'flat', art: art('flat-room'), width: 4.6, home: { x: 0, y: 0, z: -2.2 }, route: 'fly' },
  { id: 'children', kind: 'flat', art: art('flat-children'), width: 2.4, home: { x: 0, y: 0, z: -2.0 }, route: 'left', slide: 'left' },
  { id: 'truck', kind: 'prop', art: art('prop-truck'), width: 1.9, home: { x: 0, y: 0, z: TRUCK_Z }, route: 'left', slide: 'left' },
  { id: 'guard', kind: 'prop', art: art('prop-guard'), height: 0.9, home: { x: 0, y: 0, z: -1.45 }, route: 'right', slide: 'right' },
  { id: 'mother', kind: 'prop', art: art('prop-mother'), height: 1.0, home: { x: TABLE.x, y: 0, z: TABLE.z }, route: 'trap', rod: true },
  { id: 'still', kind: 'prop', art: art('prop-mother-still'), height: 1.0, home: { x: TABLE.x, y: 0, z: TABLE.z }, route: 'trap', rod: true },
  { id: 'scale', kind: 'prop', art: art('prop-scale'), height: 0.42, home: { x: 1.4, y: 0.35, z: -1.4 }, route: 'fly', strings: [[0.5, 0.02]] },
  { id: 'masha', kind: 'prop', art: art('prop-masha'), height: 0.62, home: { x: 0, y: 0, z: -1.3 }, route: 'left', slide: 'left' },
  { id: 'carry', kind: 'prop', art: art('prop-carry'), height: 0.98, home: { x: 0, y: 0, z: -1.25 }, route: 'right', slide: 'right' },
  {
    id: 'alyosha', kind: 'puppet', home: { x: 0, y: 0, z: -1.2 }, route: 'right',
    puppet: {
      height: 1.0, faces: 'right',
      body: p(part('puppet-alyosha', 1), [0.5, 1]),
      head: p(part('puppet-alyosha', 0), [0.5, 0.885], { attach: [0.537, 0.038], z: -0.6, string: [0.5, 0.05] }, 0.68),
      // Each arm hangs on the side where the painter drew it. He faces right, so a positive angle reaches forward.
      armA: p(part('puppet-alyosha', 3), [0.34, 0.08], { attach: [0.806, 0.092], z: 1.1, string: [0.55, 0.92] }),
      armB: p(part('puppet-alyosha', 2), [0.68, 0.078], { attach: [0.238, 0.09], z: 1, string: [0.45, 0.92] }),
    },
  },
  {
    id: 'grown', kind: 'puppet', home: { x: 0, y: 0, z: -1.15 }, route: 'left',
    puppet: {
      height: 0.98, faces: 'left',
      body: p(part('puppet-masha', 1), [0.5, 1]),
      head: p(part('puppet-masha', 0), [0.45, 0.875], { attach: [0.544, 0.04], z: -0.6, string: [0.5, 0.05] }, 0.68),
      // She faces left, so a negative angle reaches forward.
      armA: p(part('puppet-masha', 3), [0.72, 0.065], { attach: [0.275, 0.068], z: 1.1, string: [0.45, 0.92] }),
      armB: p(part('puppet-masha', 2), [0.31, 0.07], { attach: [0.77, 0.076], z: 1, string: [0.55, 0.92] }),
    },
  },
  { id: 'ice', kind: 'prop', art: art('prop-ice'), width: 6.8, anchor: 'center', home: { x: 0, y: -0.12, z: -0.9 }, route: 'trap', rod: true },
  { id: 'thaw', kind: 'prop', art: art('prop-thaw'), width: 6.8, anchor: 'center', home: { x: 0, y: -0.15, z: -0.88 }, route: 'trap', rod: true },
];

// ---------------------------------------------------------------- the cue sheet

function cues({ tl, section, line }: CueContext) {
  const k = cueKit(tl, master);
  const L = (n: number) => line(n).start;
  const E = (id: string) => section(id).end;
  const end = master.duration;
  tl.signal('alyosha.sing', master.vox!.fps, master.vox!.alyosha ?? []);
  tl.signal('grown.sing', master.vox!.fps, master.vox!.masha ?? []);

  const sky = (t: number, dur: number, top: number, hz: number, bot: number, levels: [number, number, number] = [0.6, 0.6, 0.45], hzY = 0.16) => {
    k.look(t, dur, { cycTop: [levels[0], top], cycHz: [levels[1], hz], cycBot: [levels[2], bot] });
    k.move('cycHz.y', hzY, t, dur);
  };
  const NIGHT = [0x050a18, 0x1c2c50, 0x080c18] as const;
  const BLIZZARD = [0x101828, 0x4a5a78, 0x101622] as const;
  const ROOM = [0x0a0a10, 0x1a1a24, 0x08080c] as const;
  const THAW = [0x2a3448, 0x8a94a4, 0x3a4250] as const;
  const SUMMER = [0x4a6a90, 0xf0c890, 0x6a6a70] as const;
  const DUSK = [0x1a2440, 0xa88070, 0x2a2a38] as const;

  const hop = (id: string, t: number, dur: number) => tl.hold(`${id}.hop`, t).to(`${id}.hop`, 1, t, 0.2).hold(`${id}.hop`, t + dur).to(`${id}.hop`, 0, t + dur, 0.2);
  const face = (id: string, t: number, turned: boolean) => tl.hold(`${id}.turn`, t).to(`${id}.turn`, turned ? 1 : 0, t, 0.6);
  const walk = (id: string, t: number, dur: number, x: number, e: 'inOut' | 'out' | 'in' | 'linear' = 'inOut') => {
    k.move(`${id}.x`, x, t, dur, e);
    if (dur > 0.1) hop(id, t, dur);
  };
  const set = (t: number, pairs: [string, number][]) => { for (const [ch, v] of pairs) tl.set(ch, v, t); };
  const follow = (x: number, z: number, t: number, dur = 0.8, level = 0.6, color = 0xfff0dc, y = 0.85) => {
    k.aim('follow', x, y, z, t, dur);
    k.look(t, dur, { follow: [level, color] });
  };
  const night = (t: number, dur = 2, level = 1) => k.look(t, dur, {
    fohL: [0.13 * level, 0x9aaee0], fohR: [0.11 * level, 0x90a4d8], left: [0.08 * level, 0x8098d0], right: [0.08 * level, 0x8098d0],
    back: [0.28 * level, 0x9ab4e8], foot: 0.18 * level, ambient: 0.15 * level,
  });
  const day = (t: number, dur = 2, level = 1, warm = 0xfff0dc) => k.look(t, dur, {
    fohL: [0.32 * level, warm], fohR: [0.28 * level, 0xffffff], left: [0.16 * level, 0xffe0c0], right: [0.16 * level, warm],
    back: [0.22 * level, 0xffd8b0], foot: 0.38 * level, ambient: 0.3 * level,
  });
  /** The warm practical: the table lamp, the cab light or one lantern. */
  const lamp = (t: number, level: number, x: number, y: number, z: number, dur = 1.2) => {
    k.place('lamp', x, y, z, t);
    k.look(t, dur, { lamp: [level, 0xffb860] });
  };
  const snow = (t: number, rate: number, dur = 2) => {
    tl.set('snow.x0', -3.2, t).set('snow.x1', 3.2, t);
    k.move('snow.rate', rate, t, dur);
  };
  /** The truck drives: it slides to x and bumps over the ridges of the ice. The cab light rides with it. */
  const drive = (t: number, dur: number, x: number, from: number, back = false) => {
    k.move('truck.x', x, t, dur, 'inOut');
    for (let s = t, i = 0; s < t + dur; s += 0.42, i++) {
      k.move('truck.y', i % 2 ? 0.035 : 0, s, 0.2, 'out');
      k.move('truck.rz', i % 2 ? (back ? -1.5 : 1.5) : 0, s, 0.21, 'sine');
    }
    // The cab sits forward of the middle, on the side the truck faces.
    const cab = back ? -0.28 : 0.28;
    tl.set('lamp.x', from + cab, t).set('lamp.y', 0.55, t).set('lamp.z', TRUCK_Z + 0.1, t);
    k.move('lamp.x', x + cab, t, dur, 'inOut');
  };

  const v2 = L(4), pre = L(8), c1 = L(12), v3 = L(18), c2 = L(24), th = L(31), brk = E('thaw'), v4 = L(38), c3 = L(42), out = L(48);
  const BEAT = 60 / master.bpm;

  // ---- preroll: the house settles. The traveller hangs closed.
  const P = -7;
  tl.set('curtain.style', curtainStyleIndex('traveller'), P);
  k.cam(P, 0.01, { x: 0, y: 0.95, z: 9.4, lx: 0, ly: 1.05, lz: -1, fov: 27 });
  k.look(P + 1, 3.5, { house: 0, fohL: 0.12, fohR: 0.1, foot: 0.9, ambient: 0.25 });
  k.aim('follow', 0, 1.0, -0.14, P);
  k.look(P + 3.5, 1.5, { follow: [0.5, 0xffe4bc] });
  tl.set('surtitles.i', 0, P);
  tl.base('haze', 1.0);

  // ---- intro: night on the frozen lake. The lantern posts rise one road across the ice. A far convoy crosses.
  k.move('curtain.open', 1, 0.3, 4.5, 'inOut');
  sky(0, 3, ...NIGHT, [0.5, 0.55, 0.35], 0.14);
  night(0.3, 3);
  snow(0, 0.4, 3);
  k.enter('clouds', 0.5, 3, 'out');
  tl.base('clouds.sway', 0.5);
  k.enter('posts', 2, 4, 'out');
  k.enter('ice', 1.5, 3, 'out');
  set(0, [['convoy.x', -4.6]]);
  k.pop('convoy', true, 3);
  k.move('convoy.x', 4.6, 3, 16, 'linear');
  hop('convoy', 3, 16);
  // The lantern girl comes out onto the ice and swings her lantern on the beat.
  set(0, [['guard.x', 3.4]]);
  k.pop('guard', true, 6);
  walk('guard', 6, 3, 1.9, 'out');
  k.downbeats(9, L(0) - 1).forEach((b, i) => k.move('guard.rz', i % 2 ? 4 : -4, b, BEAT * 1.8, 'sine'));
  follow(1.9, -1.45, 7, 2, 0.45, 0xc8d4f0, 0.6);
  k.cam(0.3, 19, { z: 8.4, ly: 1.05, x: 0, lx: 0 });

  // ---- verse 1: the cold room. The ration on the scale. Mother cuts the bread in three. Her piece goes to Masha.
  tl.set('surtitles.i', 1, L(0) - 1);
  k.pop('convoy', false, L(0) - 1);
  k.leave('guard', L(0) - 2.4, 1.6, 'in');
  k.leave('posts', L(0) - 2.4, 2, 'in');
  k.leave('ice', L(0) - 2.2, 2, 'in');
  snow(L(0) - 2.5, 0, 1.5);
  sky(L(0) - 2.4, 2, ...ROOM, [0.3, 0.3, 0.25], 0.12);
  night(L(0) - 2, 2, 0.6);
  k.enter('room', L(0) - 2.2, 2.4, 'out');
  k.enter('mother', L(0) - 1.8, 2.2, 'out');
  lamp(L(0) - 1, 0.6, TABLE.x + 0.45, 0.55, TABLE.z + 0.15);
  set(0, [['masha.x', -3.2]]);
  k.pop('masha', true, L(0) - 1.6);
  walk('masha', L(0) - 1.6, 2.2, 0.05, 'out');
  set(0, [['alyosha.x', 3.2]]);
  k.pop('alyosha', true, L(0) - 1.2);
  walk('alyosha', L(0) - 1.2, 2.4, 0.85, 'out');
  face('alyosha', L(0) + 1.4, true);
  // 0 A hundred and twenty-five grams — the scale flies in. Its pans settle.
  k.enter('scale', L(0) - 0.4, 1.4, 'out');
  [0, 0.6, 1.2].forEach((dt, i) => k.move('scale.rz', [6, -4, 2][i]!, L(0) + 1 + dt, 0.5, 'sine'));
  k.move('scale.rz', 0, L(0) + 2.8, 0.6);
  follow(TABLE.x + 0.3, TABLE.z, L(0), 1.4, 0.55, 0xffd8a8, 0.6);
  k.cam(L(0) - 1, 8, { z: 7.4, ly: 0.9, x: -0.3, lx: -0.4 });
  // 1 Mother divides it among three — she cuts: the card dips on each cut.
  [0, 0.7, 1.4].forEach((dt) => {
    k.move('mother.rz', -3, L(1) + dt, 0.25, 'out');
    k.move('mother.rz', 0, L(1) + dt + 0.3, 0.3);
  });
  k.leave('scale', L(1) + 1.6, 1.4, 'in');
  // 2 She gives her own piece to little Masha — Masha comes to the table.
  walk('masha', L(2) - 0.2, 1.4, TABLE.x + 0.62);
  face('masha', L(2) - 0.2, true);
  k.flash('lamp', L(2) + 1, 0.8, 0.6, 0.2, 1);
  // 3 "I am not hungry," she says — Alyosha bends his head.
  k.move('mother.rz', 3, L(3), 0.8, 'sine');
  k.move('mother.rz', 0, L(3) + 1.6, 0.8);
  k.move('alyosha.head', -14, L(3) + 0.6, 1);
  k.cam(L(2), 6, { z: 6.9, ly: 0.8, x: -0.5, lx: -0.6 });
  // He goes out to the ice. He kneels to Masha first and touches her shoulder.
  walk('alyosha', E('v1') + 0.2, 1.2, TABLE.x + 1.1);
  k.move('alyosha.y', -0.2, E('v1') + 1.2, 0.6);
  k.move('alyosha.armB', -30, E('v1') + 1.4, 0.8);
  k.move('alyosha.armA', -40, E('v1') + 1.4, 0.8);

  // ---- verse 2: the ice road. Flour sacks go in. The faces of children come out.
  k.move('alyosha.y', 0, v2 - 1.2, 0.6);
  k.move('alyosha.armA', 0, v2 - 1.2, 0.6);
  k.move('alyosha.armB', 0, v2 - 1.2, 0.6);
  k.move('alyosha.head', 0, v2 - 1.2, 0.6);
  k.pop('alyosha', false, v2 - 0.6);
  k.pop('masha', false, v2 - 0.6);
  k.leave('mother', v2 - 1.4, 1.6, 'in');
  k.leave('room', v2 - 1.2, 1.8, 'in');
  lamp(v2 - 1.2, 0, TABLE.x + 0.45, 0.55, TABLE.z + 0.15, 0.6);
  sky(v2 - 1, 2, ...NIGHT, [0.5, 0.55, 0.35], 0.14);
  night(v2 - 1, 2);
  k.enter('posts', v2 - 1, 1.8, 'out');
  k.enter('ice', v2 - 1, 1.8, 'out');
  snow(v2 - 1, 0.35, 2);
  // 4–5 The convoy moves with no lights. The truck drives out from the left.
  set(0, [['truck.x', -3.8]]);
  k.pop('truck', true, v2 - 0.2);
  drive(v2 - 0.2, 6, 0.3, -3.8);
  lamp(v2 - 0.2, 0.45, -3.5, 0.55, TRUCK_Z + 0.1, 0.8);
  set(v2 - 1, [['convoy.x', -4.6]]);
  k.pop('convoy', true, v2);
  k.move('convoy.x', 3.6, v2, 12, 'linear');
  hop('convoy', v2, 12);
  follow(0, -1.6, v2, 2, 0.5, 0xc8d4f0, 0.6);
  // 7 Coming back, the faces of children — the children's line walks to the truck from the right.
  set(0, [['children.x', 3.8]]);
  k.pop('children', true, L(6));
  k.move('children.x', 1.5, L(6), 4, 'out');
  hop('children', L(6), 4);
  face('children', L(6), true);
  k.cam(v2, 12, { z: 7.9, ly: 1.0, x: 0.2, lx: 0.2 });

  // ---- pre-chorus: the door open, hands on the wheel. The truck bucks on the beat. The lanterns burn.
  k.move('children.x', 0.8, pre - 1.6, 1.2, 'in');
  k.pop('children', false, pre - 0.3);
  k.pop('convoy', false, pre);
  set(pre - 1, [['guard.x', 3.4]]);
  k.pop('guard', true, pre - 1);
  walk('guard', pre - 1, 1.6, 2.1, 'out');
  drive(pre, E('pre') - pre + 2, 0.9, 0.3);
  k.downbeats(pre, E('pre') + 2).forEach((b, i) => {
    k.move('truck.y', 0.07, b - 0.05, 0.15, 'out');
    k.move('truck.y', 0, b + 0.15, 0.4, 'inOut');
    k.move('guard.rz', i % 2 ? 6 : -6, b, BEAT * 0.9, 'sine');
  });
  // 11 Burning, burning — the lanterns flare twice.
  k.flash('lamp', L(11), 0.9, 0.45, 0.1, 0.6);
  k.flash('back', L(11) + 0.7, 0.55, 0.28, 0.1, 0.6);
  follow(0.9, -1.6, pre, 1.4, 0.6, 0xffe8c8, 0.6);
  k.cam(pre, 8, { z: 7.4, ly: 0.95, x: 0.5, lx: 0.6 });

  // ---- chorus 1: Hold, ice. The truck drives on through the snow. The ice ridges heave on the beat.
  snow(c1 - 0.5, 0.6, 2);
  drive(c1, 10, 2.1, 0.9);
  k.downbeats(c1, L(17)).forEach((b, i) => k.move('ice.y', i % 2 ? 0.03 : -0.02, b, BEAT * 1.6, 'sine'));
  k.flash('lamp', L(13), 0.8, 0.45, 0.2, 0.8);
  k.flash('lamp', L(16), 0.8, 0.45, 0.2, 0.8);
  k.leave('guard', c1 + 2, 2, 'in');
  follow(1.4, -1.6, c1, 3, 0.55, 0xd8e0ff, 0.6);
  k.cam(c1, 12, { z: 8.0, ly: 1.05, x: 0.6, lx: 0.6 });
  // 17 I will come back for you, just wait — far at the left, in a cold spot, Masha waits.
  set(L(17) - 1, [['masha.x', -2.1], ['masha.turn', 0], ['masha.z', 0.2]]);
  k.pop('masha', true, L(17) - 0.6);
  k.look(L(17) - 0.6, 1, { left: [0.3, 0xa8b8e0] });
  k.move('truck.turn', 1, L(17) + 0.4, 0.8);
  k.cam(L(17), 5, { z: 8.4, ly: 1.0, x: 0, lx: 0 });

  // ---- the gap and verse 3: the city at night. The room again. The lamp is cold. Mother does not wake.
  const g3 = E('ch1');
  drive(g3, 4, -3.8, 2.1, true);
  lamp(g3 + 3.5, 0, -3.8, 0.55, TRUCK_Z, 0.6);
  k.pop('truck', false, g3 + 4.2);
  k.pop('masha', false, g3 + 1);
  k.leave('posts', g3 + 1, 2.4, 'in');
  k.leave('ice', g3 + 1, 2.4, 'in');
  k.leave('clouds', g3 + 1, 3, 'in');
  k.enter('city', g3 + 2, 4, 'out');
  snow(g3 + 2, 0.3, 3);
  sky(g3 + 2, 4, ...NIGHT, [0.4, 0.45, 0.3], 0.12);
  night(g3 + 2, 3, 0.7);
  follow(0, -2.9, g3 + 3, 3, 0.35, 0xb8c4e0, 1.0);
  k.cam(g3 + 2, 9, { z: 8.6, ly: 1.1, x: 0, lx: 0 });
  // He walks home through the city.
  set(g3 + 5, [['alyosha.x', 3.2], ['alyosha.turn', 1], ['alyosha.head', 0]]);
  k.pop('alyosha', true, g3 + 5.2);
  walk('alyosha', g3 + 5.2, 5, 0.9, 'linear');
  // 18 I came back to our room — the room flies in. The stove is cold. Dark.
  k.leave('city', v3 - 1.6, 2, 'in');
  snow(v3 - 1.6, 0, 1.6);
  k.enter('room', v3 - 1.4, 2, 'out');
  k.enter('still', v3 - 1.2, 2, 'out');
  set(v3 - 1.4, [['masha.x', -0.2], ['masha.z', 0], ['masha.turn', 1], ['masha.y', -0.06], ['masha.rz', 0]]);
  k.pop('masha', true, v3 - 0.6);
  sky(v3 - 1.6, 2, ...ROOM, [0.25, 0.25, 0.2], 0.12);
  night(v3 - 1.2, 2, 0.45);
  follow(TABLE.x + 0.4, TABLE.z, v3 - 0.4, 1.4, 0.45, 0xb8c4e0, 0.6);
  k.cam(v3 - 1, 8, { z: 7.2, ly: 0.85, x: -0.3, lx: -0.4 });
  // 19 The lamp burns no more — he stops. His head turns to the table.
  walk('alyosha', L(19) - 0.6, 1.4, 0.45);
  k.move('alyosha.head', -10, L(19) + 0.6, 1);
  // 20–21 Mother sleeps under her old shawl. Her bread lies untouched — a cold light finds the bread.
  k.look(L(20), 1.6, { follow: [0.6, 0xc8d4f0] });
  k.aim('follow', TABLE.x + 0.1, 0.65, TABLE.z, L(21), 1);
  k.move('alyosha.armA', 40, L(20) + 0.4, 1.2);
  k.move('alyosha.armA', 0, L(21) + 1.8, 1.2);
  k.move('alyosha.head', -22, L(21), 1.4);
  k.cam(L(20), 6, { z: 6.6, ly: 0.75, x: -0.6, lx: -0.8 });
  // 22 I wrapped Masha in a blanket — he goes to her. The puppet and the girl give way to the carry card.
  walk('alyosha', L(22) - 0.4, 1.2, 0.15);
  face('alyosha', L(22) - 0.4, true);
  k.move('alyosha.y', -0.18, L(22) + 0.8, 0.6);
  k.move('alyosha.armA', -60, L(22) + 0.8, 0.8);
  k.pop('alyosha', false, L(22) + 2.2);
  k.pop('masha', false, L(22) + 2.2);
  set(L(22) + 2, [['carry.x', 0.0], ['carry.turn', 0]]);
  k.pop('carry', true, L(22) + 2.2);
  // 23 And drove her over the ice — he carries her out. The room goes. The ice comes up.
  walk('carry', L(23), 3.4, 3.6, 'in');
  k.leave('still', L(23) + 0.4, 2, 'in');
  k.leave('room', L(23) + 0.8, 2, 'in');

  // ---- chorus 2: the blizzard. The truck carries them over the ice. "Masha, do not look back."
  k.pop('carry', false, c2 - 1.6);
  sky(c2 - 1.6, 2, ...BLIZZARD, [0.4, 0.45, 0.3], 0.12);
  night(c2 - 1.4, 2, 0.8);
  k.enter('clouds', c2 - 1.6, 2, 'out');
  tl.base('clouds.sway', 1.4);
  k.enter('posts', c2 - 1.4, 1.8, 'out');
  k.enter('ice', c2 - 1.4, 1.8, 'out');
  snow(c2 - 1.4, 0.95, 1.6);
  k.move('haze', 1.8, c2 - 1.4, 2);
  set(c2 - 1.2, [['truck.x', -3.8], ['truck.turn', 0]]);
  k.pop('truck', true, c2 - 1);
  drive(c2 - 1, 6, -1.6, -3.8);
  lamp(c2 - 1, 0.55, -3.5, 0.55, TRUCK_Z + 0.1, 0.8);
  // The truck fights through: it stops at each hook and pushes on.
  drive(L(26), 6, 0.5, -1.6);
  k.downbeats(c2, L(30)).forEach((b, i) => {
    k.move('ice.y', i % 2 ? 0.04 : -0.03, b, BEAT * 1.6, 'sine');
    k.move('posts.rz', i % 2 ? 0.6 : -0.6, b, BEAT * 1.6, 'sine');
  });
  [L(24) + 1, L(26), L(29)].forEach((t) => k.flash('lamp', t, 0.85, 0.55, 0.2, 0.8));
  follow(-0.6, -1.6, c2, 3, 0.55, 0xd8e0ff, 0.6);
  k.cam(c2, 10, { z: 7.8, ly: 1.05, x: -0.4, lx: -0.4 });
  // 30 Masha, do not look back — the far shore comes up at the right. The train waits.
  drive(L(29) - 0.4, 4, 1.15, 0.5);
  k.enter('shore', L(29) - 1.5, 3, 'out');
  k.leave('posts', L(29) - 1.5, 2.6, 'in');
  set(0, [['shore.x', 1.6], ['train.x', 4.2]]);
  k.pop('train', true, L(29) - 1);
  k.move('train.x', 1.5, L(29) - 1, 4, 'out');
  k.cam(L(29), 6, { z: 7.6, ly: 1.0, x: 0.8, lx: 0.9 });

  // ---- the bridge: the thaw. He brings her to the train. He turns the truck back onto the wet ice.
  snow(th - 1, 0.1, 3);
  k.move('haze', 1.0, th - 1, 3);
  tl.base('clouds.sway', 0.6);
  sky(th - 1, 4, ...THAW, [0.5, 0.55, 0.4], 0.14);
  day(th - 0.5, 3, 0.5, 0xe0e4f0);
  // 31 Water on the ice, spring is coming — the thaw row comes up over the ice.
  k.enter('thaw', th, 2.6, 'out');
  k.leave('ice', th + 0.6, 2, 'in');
  k.flash('back', L(32), 0.6, 0.3, 0.05, 0.4);
  // 33 The ice cracks, and the city waits — a crack: the thaw row jolts.
  k.move('thaw.y', -0.06, L(33) + 0.5, 0.12, 'out');
  k.move('thaw.y', 0, L(33) + 0.7, 0.6);
  k.flash('back', L(33) + 0.5, 0.8, 0.3, 0.03, 0.5);
  // 34 I brought her to the shore — Masha gets down and walks to the train.
  set(L(34) - 0.4, [['masha.x', 0.75], ['masha.turn', 0], ['masha.z', 0.25], ['masha.y', 0]]);
  k.pop('masha', true, L(34) - 0.2);
  walk('masha', L(34), 2.4, 1.55);
  set(L(34) - 0.4, [['alyosha.x', 0.55], ['alyosha.y', 0], ['alyosha.z', 0.3], ['alyosha.turn', 0], ['alyosha.head', 0], ['alyosha.armA', 0], ['alyosha.armB', 0], ['alyosha.rz', 0]]);
  k.pop('alyosha', true, L(34) - 0.2);
  // He lifts his hand to her. She turns once.
  k.move('alyosha.armA', 120, L(34) + 1.4, 1, 'out');
  face('masha', L(34) + 2.6, true);
  face('masha', L(35) + 0.4, false);
  k.move('alyosha.armA', 0, L(35), 0.8);
  follow(1.2, -1.2, L(34), 1.2, 0.6, 0xfff0e0, 0.7);
  k.cam(L(34), 7, { z: 7.0, ly: 0.95, x: 0.9, lx: 1.0 });
  // 35 And turned the truck back — he climbs in. The truck turns and drives out onto the wet ice.
  k.pop('alyosha', false, L(35) + 1);
  k.move('truck.turn', 1, L(35) + 0.8, 0.9);
  drive(L(35) + 1.4, 5, -0.6, 1.15, true);
  k.pop('masha', false, L(36));
  // 37 One more run.
  k.flash('lamp', L(37), 0.85, 0.55, 0.2, 1);
  k.cam(L(35), 6, { z: 7.8, ly: 1.0, x: 0.2, lx: 0.2 });

  // ---- the break: the train goes. The truck on the thawing ice. The ice gives. The cab light goes under.
  k.move('train.x', 4.4, brk, 6, 'in');
  hop('train', brk, 6);
  k.pop('train', false, brk + 6.2);
  k.leave('shore', brk + 1, 3, 'in');
  drive(brk, 4, -1.4, -0.6, true);
  // The nose dips. The truck tilts and sinks behind the thaw row.
  k.move('truck.rz', 9, brk + 5, 1.2, 'in');
  k.move('truck.y', -0.35, brk + 5.6, 2.4, 'in');
  k.move('truck.rz', 16, brk + 6, 2, 'in');
  k.move('lamp.y', 0.1, brk + 5.6, 2.4, 'in');
  k.look(brk + 7.4, 1.4, { lamp: 0 });
  k.move('truck.y', -1.1, brk + 8, 3, 'in');
  k.pop('truck', false, brk + 11.2);
  k.flash('back', brk + 5.2, 0.8, 0.25, 0.03, 0.6);
  follow(-1.3, -1.6, brk + 3, 2, 0.4, 0xb8c4e0, 0.5);
  k.look(brk + 9, 4, { follow: [0.2, 0x8090b0] });
  k.cam(brk, 13, { z: 7.4, ly: 0.8, x: -0.7, lx: -0.9 });

  // ---- verse 4: years later. Open summer water. Masha, grown, stands on the shore. A far cab light.
  k.leave('thaw', v4 - 2.4, 2.4, 'in');
  k.leave('clouds', v4 - 2.4, 2.4, 'in');
  k.leave('lake', v4 - 2.2, 2.4, 'in');
  k.enter('water', v4 - 1.8, 2.8, 'out');
  sky(v4 - 2, 4, ...DUSK, [0.55, 0.65, 0.45], 0.16);
  day(v4 - 1.6, 3, 0.55, 0xffd8b0);
  tl.set('surtitles.i', 1, v4 - 1);
  set(0, [['grown.x', -3.2]]);
  k.pop('grown', true, v4 - 1.6);
  walk('grown', v4 - 1.6, 3, -0.7, 'out');
  face('grown', v4 - 1.6, true);
  face('grown', v4 + 1.6, false);
  follow(-0.7, -1.15, v4 - 1, 2, 0.6, 0xffe0c0, 0.7);
  k.cam(v4 - 1, 10, { z: 7.4, ly: 0.95, x: -0.4, lx: -0.5 });
  // 38 I remember the light of your cab — far on the water, a small gold light, for a moment.
  lamp(L(38) + 0.4, 0.4, 1.6, 0.5, -3.0, 1.6);
  k.look(L(39) + 1, 2, { lamp: 0 });
  // 39 You waved to me from the far side — she lifts her hand to the light.
  k.move('grown.armA', -110, L(39), 1.2, 'out');
  k.move('grown.head', 8, L(39), 1.2);
  // 40–41 In April the ice did not hold — her hand comes down to her heart.
  k.move('grown.armA', -40, L(40) + 0.4, 1.4);
  k.move('grown.head', -12, L(41), 1.4);

  // ---- final chorus: Hold on, brother. He is there on the far side, in the cold light of memory. She sings to him.
  set(c3 - 1.6, [['alyosha.x', 1.9], ['alyosha.y', 0.02], ['alyosha.z', -1.0], ['alyosha.turn', 1], ['alyosha.head', 0], ['alyosha.armA', 0], ['alyosha.armB', 0], ['alyosha.rz', 0], ['alyosha.s', 0.85]]);
  k.pop('alyosha', true, c3 - 1.4);
  k.look(c3 - 1.4, 2, { right: [0.4, 0xa8b8e0], back: [0.35, 0x8aa0d0] });
  k.move('grown.head', 4, c3, 1.2);
  k.move('grown.armA', -95, c3 + 0.4, 1.2, 'out');
  // He lifts his hand as he did from the cab.
  k.move('alyosha.armB', 120, c3 + 1, 1.2, 'out');
  k.move('alyosha.armB', 90, c3 + 3, 1.6, 'sine');
  k.move('alyosha.armB', 125, c3 + 5, 1.6, 'sine');
  // 44 One more run — the far lanterns burn on the water.
  lamp(L(44), 0.5, 1.9, 0.6, -2.0, 1.4);
  follow(0.6, -1.1, c3, 2, 0.6, 0xfff0e0, 0.8);
  k.cam(c3, 8, { z: 7.8, ly: 1.0, x: 0.5, lx: 0.5 });
  // 47 You came back for me, and I wait for you all my life — he lowers his hand and goes. She stays.
  k.move('alyosha.armB', 0, L(47) + 1, 1.4);
  face('alyosha', L(47) + 1.6, false);
  k.move('alyosha.x', 3.6, L(47) + 2, 4, 'in');
  hop('alyosha', L(47) + 2, 4);
  k.look(L(47) + 2, 3, { lamp: 0, right: [0.1, 0xa8b8e0] });
  k.move('grown.armA', -30, L(47) + 2.6, 2);
  k.cam(L(47), 7, { z: 7.0, ly: 0.9, x: -0.4, lx: -0.5 });

  // ---- outro: one more run. She stands at the water. The lantern road comes up across it, one light at a time.
  k.pop('alyosha', false, out - 4);
  sky(out - 3, 8, ...NIGHT, [0.45, 0.5, 0.35], 0.13);
  night(out - 2, 6, 0.7);
  set(out - 3, [['posts.y', -0.25]]);
  k.enter('posts', out - 1, 5, 'out');
  k.downbeats(out, L(50)).forEach((b, i) => { if (i % 2 === 0) k.flash('back', b, 0.4, 0.3, 0.2, 1.2); });
  // 49 Hold — the long held note. She lifts her hand again.
  k.move('grown.armA', -100, L(49) + 1, 2, 'out');
  k.move('grown.head', 6, L(49) + 1, 2);
  k.move('grown.armA', -40, L(49) + 9, 3);
  // 50 One more run — one gold light, far on the water.
  lamp(L(50), 0.45, 1.4, 0.45, -2.6, 2);
  follow(-0.7, -1.15, out, 2, 0.55, 0xffe4c4, 0.7);
  k.cam(out, 14, { z: 8.0, ly: 0.95, x: 0, lx: 0 });
  // 51 Hold — snow begins again. The light stays.
  snow(L(51) - 1, 0.25, 3);
  k.cam(L(51) - 2, 6, { z: 7.2, ly: 0.9, x: -0.2, lx: -0.2 });

  // ---- the end: the traveller closes on the light. In the call, Alyosha and Masha bow together.
  tl.set('surtitles.i', 0, end - 3.6);
  k.cam(end - 4.8, 4.2, { z: 9.4, x: 0, lx: 0, y: 0.95, ly: 1.05 });
  k.move('curtain.open', 0, end - 3.8, 3.4, 'inOut');
  k.look(end - 1, 2, { follow: 0, house: 0.25, lamp: 0 });
  k.move('snow.rate', 0, end - 1, 0.5);
  for (const [ch, v] of [['alyosha.x', -0.45], ['alyosha.y', 0], ['alyosha.z', 0.8], ['alyosha.head', 0], ['alyosha.armA', 0], ['alyosha.armB', 0], ['alyosha.turn', 0], ['alyosha.rz', 0], ['alyosha.s', 1]] as const) k.move(ch, v, end - 1.9, 0.01);
  for (const [ch, v] of [['grown.x', 0.45], ['grown.y', 0], ['grown.z', 0.75], ['grown.head', 0], ['grown.armA', 0], ['grown.armB', 0], ['grown.turn', 0], ['grown.rz', 0], ['grown.s', 1]] as const) k.move(ch, v, end - 1.9, 0.01);
  k.pop('alyosha', true, end - 1.8);
  k.move('curtain.open', 0.5, end + 0.8, 1.6, 'out');
  k.look(end + 0.6, 0.8, { follow: [0.7, 0xffe6c4] });
  k.aim('follow', 0, 1.0, -0.5, end + 0.5, 0.01);
  k.move('alyosha.rz', -18, end + 2.4, 0.5);
  k.move('grown.rz', 18, end + 2.4, 0.5);
  k.move('alyosha.rz', 0, end + 3, 0.5);
  k.move('grown.rz', 0, end + 3, 0.5);
  k.move('curtain.open', 0, end + 4.2, 1.8, 'inOut');
  k.look(end + 4.6, 1.5, { follow: 0, house: 0.7 });
}

const production: Production = {
  id: 'derzhis-lyod',
  no: 16,
  title: { ru: 'Держись, лёд', en: 'Hold, Ice', id: 'Bertahanlah, Es', zh: '冰啊，撑住' },
  poster: urls['./art/cut/poster.webp']!,
  audio,
  master,
  pieces,
  curtain: { open: 'traveller', close: 'traveller' },
  preroll: 7,
  postroll: 7,
  surtitles: { main: 'ru', second: 'id' },
  bill: {
    about: 'The story takes place in the siege of Leningrad, winter 1941. Alyosha drives flour across the frozen lake and brings children out. He takes his little sister Masha to the far shore. Then he turns back onto the thawing ice. They sing in Russian.',
    cast: [['Alyosha, the driver', 'Voice'], ['Masha, his sister', 'Voice'], ['Their mother', 'On a rod'], ['The choir', 'Chorus']],
    scenes: ['The ice road', 'The cold room', 'The blizzard', 'The thaw', 'The open water'],
  },
  voices: {
    alyosha: { name: 'Алёша', color: '#e0e4ec' },
    masha: { name: 'Маша', color: '#ecdcd8' },
    choir: { name: 'Хор', color: '#e4dcc8' },
    both: { name: 'Маша · Алёша', color: '#ece2dc' },
  },
  cues,
};

export default production;
