// Gema Masa Muda · 青春回声 · Echo of Our Youth
// The cue sheet follows the take in song/master.json. Line numbers below are the sung lines.
// Heights (y) are above the stage floor. The stage opening is about 5.5 wide and 2.4 high. Depth runs to z = -4.
//
// A grown man remembers his school friends, printed like an old school textbook. Dimas and the boy he was are
// marionettes. The school, the corridor and the blackboard fly in. The field, the class and the flame tree rise on
// rods from the trap. The friends, the running children and the night bus are cards on tin wires.

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

// Dimas stands to the right of the old desk. Each pivot is the brass pin painted on the part.
const DIMAS = { x: -0.3, y: 0, z: -1.15 };
const DESK = { x: -0.95, z: -1.05 };

const pieces: PieceSpec[] = [
  { id: 'sun', kind: 'prop', art: art('prop-sun'), width: 0.9, anchor: 'center', home: { x: 1.6, y: 1.7, z: -3.45 }, route: 'trap', rod: true, glow: 0.3, shadow: false },
  { id: 'clouds', kind: 'prop', art: art('prop-clouds'), width: 4.2, anchor: 'center', home: { x: 0, y: 1.9, z: -3.35 }, route: 'fly', strings: [[0.2, 0.2], [0.8, 0.2]], shadow: false },
  { id: 'school', kind: 'flat', art: art('flat-school'), width: 5.6, home: { x: 0, y: -0.1, z: -3.1 }, route: 'fly' },
  { id: 'corridor', kind: 'flat', art: art('flat-corridor'), width: 5.8, home: { x: 0, y: -0.15, z: -3.0 }, route: 'fly' },
  // The field is painted with the school and the trees behind it, so it is the backdrop of the field scenes.
  { id: 'field', kind: 'flat', art: art('flat-field'), width: 6.8, home: { x: 0, y: -0.55, z: -3.2 }, route: 'trap', rod: true },
  { id: 'flametree', kind: 'flat', art: art('flat-flametree'), width: 2.4, home: { x: 1.85, y: -0.1, z: -2.5 }, route: 'trap', rod: true },
  { id: 'blackboard', kind: 'flat', art: art('flat-blackboard'), width: 2.3, home: { x: 0.45, y: 0.45, z: -2.3 }, route: 'fly' },
  { id: 'bus', kind: 'prop', art: art('prop-bus'), width: 2.2, home: { x: 0, y: 0, z: -2.2 }, route: 'left', slide: 'left' },
  { id: 'class', kind: 'flat', art: art('prop-class'), width: 2.9, home: { x: 0.35, y: 0, z: -2.05 }, route: 'trap', rod: true },
  { id: 'kidsrun', kind: 'prop', art: art('prop-kids-run'), width: 1.9, home: { x: 0, y: 0, z: -1.9 }, route: 'left', slide: 'left' },
  { id: 'ardifall', kind: 'prop', art: art('prop-ardi-fall'), height: 0.62, home: { x: 0.55, y: 0, z: -1.75 }, route: 'trap', rod: true },
  { id: 'sari', kind: 'prop', art: art('prop-sari'), height: 0.95, home: { x: -0.55, y: 0, z: -1.6 }, route: 'left', slide: 'left' },
  { id: 'ardi', kind: 'prop', art: art('prop-ardi'), height: 0.98, home: { x: 1.5, y: 0, z: -1.58 }, route: 'right', slide: 'right' },
  { id: 'planes', kind: 'prop', art: art('prop-planes'), width: 2.0, anchor: 'center', home: { x: 0, y: 1.75, z: -1.5 }, route: 'fly', strings: [[0.1, 0.4], [0.5, 0.35], [0.9, 0.3]], shadow: false },
  {
    id: 'kid', kind: 'puppet', home: { x: 0.6, y: 0, z: -1.3 }, route: 'left',
    puppet: {
      height: 0.72, faces: 'right',
      body: p(part('puppet-kid', 1), [0.5, 1]),
      head: p(part('puppet-kid', 0), [0.535, 0.905], { attach: [0.587, 0.06], z: -0.6, string: [0.5, 0.05] }, 0.68),
      armA: p(part('puppet-kid', 3), [0.807, 0.135], { attach: [0.303, 0.097], z: 1, string: [0.25, 0.85] }, 0.85),
      armB: p(part('puppet-kid', 2), [0.193, 0.468], { attach: [0.821, 0.096], z: 1.1, rest: -35, string: [0.6, 0.1] }, 0.85),
    },
  },
  { id: 'lamp', kind: 'prop', art: art('prop-lamp'), width: 0.55, anchor: 'center', home: { x: DESK.x, y: 2.05, z: DESK.z }, route: 'fly', strings: [[0.5, 0.02]], glow: 0.35, startIn: true, shadow: false },
  { id: 'desk', kind: 'prop', art: art('prop-desk'), width: 1.05, home: { x: DESK.x, y: 0, z: DESK.z }, route: 'trap', rod: true, startIn: true },
  {
    id: 'dimas', kind: 'puppet', home: DIMAS, route: 'fly',
    puppet: {
      height: 1.02, faces: 'right',
      body: p(part('puppet-dimas', 0), [0.5, 1]),
      head: p(part('puppet-dimas', 1), [0.472, 0.895], { attach: [0.559, 0.045], z: -0.6, string: [0.5, 0.05] }, 0.72),
      // The open hand belongs on his left side, so the open arm hangs from the left shoulder.
      armA: p(part('puppet-dimas', 2), [0.441, 0.091], { attach: [0.263, 0.097], z: 1, string: [0.75, 0.93] }),
      armB: p(part('puppet-dimas', 3), [0.367, 0.079], { attach: [0.836, 0.097], z: 1.1, string: [0.55, 0.95] }),
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
  tl.signal('dimas.sing', master.vox!.fps, master.vox!.dimas ?? []);

  const sky = (t: number, dur: number, top: number, hz: number, bot: number, levels: [number, number, number] = [0.7, 0.75, 0.5], hzY = 0.16) => {
    k.look(t, dur, { cycTop: [levels[0], top], cycHz: [levels[1], hz], cycBot: [levels[2], bot] });
    k.move('cycHz.y', hzY, t, dur);
  };
  const DARK = [0x07080e, 0x10121a, 0x06070a] as const;
  const NOON = [0x6e9cc4, 0xf0e0b0, 0xd8c8a0] as const;
  const GOLD = [0x7a8fb0, 0xf6c070, 0xe0b880] as const;
  const DEEP = [0x2a4a88, 0x8fb4cf, 0xd8c098] as const;
  const DUSK = [0x3a3a6a, 0xf08a50, 0x8a5a50] as const;
  const NIGHT = [0x0c1430, 0x1c2a4c, 0x0a0e1a] as const;
  const DAWN = [0x5a78a8, 0xffd08a, 0xf0d0a0] as const;

  const hop = (id: string, t: number, dur: number) => tl.hold(`${id}.hop`, t).to(`${id}.hop`, 1, t, 0.2).hold(`${id}.hop`, t + dur).to(`${id}.hop`, 0, t + dur, 0.2);
  const face = (id: string, t: number, turned: boolean) => tl.hold(`${id}.turn`, t).to(`${id}.turn`, turned ? 1 : 0, t, 0.6);
  /** A figure walks to a place. Its x and z are offsets from its home. */
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

  const c1 = L(8), v2 = L(16), c2 = L(24), br = L(32), c3 = L(38), out = E('ch3');

  // ---- preroll: the house settles. The traveller hangs closed.
  const P = -7;
  tl.set('curtain.style', curtainStyleIndex('traveller'), P);
  k.cam(P, 0.01, { x: 0, y: 0.95, z: 9.4, lx: 0, ly: 1.05, lz: -1, fov: 27 });
  k.look(P + 1, 3.5, { house: 0, fohL: 0.12, fohR: 0.1, foot: 0.9, ambient: 0.25 });
  k.aim('follow', 0, 1.0, -0.14, P);
  k.look(P + 3.5, 1.5, { follow: [0.5, 0xffe4bc] });
  tl.set('surtitles.i', 0, P);
  tl.base('haze', 1.2);
  tl.base('lamp.sway', 0.25);

  // ---- intro: dark. One lamp hangs over the old desk. Dimas comes down on his strings and stops beside it.
  k.move('curtain.open', 1, 0.5, 4.5, 'inOut');
  sky(0, 3, ...DARK, [0.2, 0.2, 0.15], 0.1);
  k.look(0.5, 3, { fohL: 0.05, fohR: 0.04, foot: 0.12, ambient: 0.1, back: 0.05, lamp: [0.9, 0xffc070], follow: 0 });
  k.place('lamp', DESK.x, 1.7, DESK.z, 0);
  k.move('lamp.glow', 0.35, 0, 3);
  k.move('dust.i', 0.5, 0, 3);
  follow(DESK.x, DESK.z, 2, 3, 0.35, 0xffe0b0, 0.5);
  k.enter('dimas', 6, 3.2, 'out');
  k.move('dimas.head', -8, 9.5, 1.5);
  k.cam(0.5, 14, { z: 7.4, ly: 1.0, x: -0.6, lx: -0.6 });

  // ---- verse 1: the desk and the names. The school, then the gold field. Sweets fall. The blackboard.
  tl.set('surtitles.i', 1, L(0) - 1);
  // 0 Meja kayu tua — his hand goes to the desk.
  k.move('dimas.armA', -24, L(0), 1.6);
  k.move('dimas.head', -14, L(0) + 0.4, 1.4);
  // 1 Penuh coretan nama kita berdua — the scratched names catch the light.
  k.move('desk.glow', 0.22, L(1), 2.5);
  follow(DESK.x, DESK.z, L(1), 1.2, 0.55, 0xffe8c8, 0.55);
  // 2 Pulang sekolah — the school comes in behind him. Afternoon comes up.
  k.move('desk.glow', 0, L(2), 2);
  k.enter('school', L(2) - 1.5, 3, 'out');
  sky(L(2) - 1.2, 3, ...NOON, [0.7, 0.75, 0.5], 0.18);
  day(L(2) - 1, 2.5);
  k.look(L(2), 2, { lamp: 0 });
  k.leave('lamp', L(2) + 0.5, 2.2, 'in');
  k.leave('desk', L(2) + 0.8, 2.4, 'in');
  k.move('dimas.armA', 0, L(2), 1.2);
  k.move('dimas.head', 8, L(2) + 0.2, 1.4);
  k.cam(L(2), 4, { z: 8.2, ly: 1.1, x: 0, lx: 0 });
  // 3 Lapangan berdebu keemasan — the field rises. The light turns gold and the dust hangs in it.
  k.enter('field', L(3) - 0.6, 3, 'out');
  k.enter('flametree', L(3), 3, 'out');
  k.enter('sun', L(3) + 0.5, 4, 'out');
  k.leave('school', L(3) + 2, 3, 'in');
  sky(L(3), 4, ...GOLD, [0.75, 0.85, 0.55], 0.18);
  k.look(L(3), 3, { fohL: [0.34, 0xffd8a0], fohR: [0.28, 0xffe0b0], left: [0.24, 0xffc070], back: [0.24, 0xffb060] });
  k.move('dust.i', 1.4, L(3), 3);
  // 4 Saku yang sobek — the boy runs in with his torn pocket. Dimas sees him.
  tl.set('kid.x', -3.8, 0);
  k.pop('kid', true, L(4) - 1.4);
  walk('kid', L(4) - 1.3, 2.4, 0.1, 'out');
  face('dimas', L(4) - 0.4, false);
  follow(0.7, -1.3, L(4) - 0.2, 1, 0.6);
  // 5 Bungkus permen dan mimpi kecil berjatuhan — sweets and small dreams fall around him.
  tl.set('glints.x0', 0.2, L(5)).set('glints.x1', 1.2, L(5));
  k.move('glints.rate', 0.45, L(5) - 0.2, 1);
  k.move('glints.rate', 0, L(5) + 5, 1.5);
  k.move('kid.head', -10, L(5), 1);
  k.move('kid.armB', 30, L(5) + 1, 1.2);
  k.move('kid.armB', 0, L(5) + 4.5, 1);
  k.move('kid.head', 0, L(5) + 4.5, 1);
  // 6 Saat itu kira — the blackboard comes down.
  k.enter('blackboard', L(6) - 1.5, 2.6, 'out');
  face('kid', L(6) - 0.5, true);
  k.move('kid.head', 10, L(6), 1);
  // 7 Dewasa tersimpan di soal esok hari — the boy looks at tomorrow's test. Dimas looks at the boy.
  k.move('dimas.head', -4, L(7), 1.5);
  k.cam(L(6), 8, { z: 7.6, ly: 1.05, x: 0.15, lx: 0.2 });

  // ---- chorus 1: the children run across the field. Ardi falls and laughs. Morning to dusk. Paper planes.
  k.leave('blackboard', c1 - 1.6, 2.4, 'in');
  face('kid', c1 - 1.2, false);
  walk('kid', c1 - 1, 2.6, 3.4, 'in');
  k.pop('kid', false, c1 + 1.7);
  day(c1, 1.4);
  sky(c1, 2, ...GOLD, [0.8, 0.9, 0.6], 0.2);
  // 8 gema masa muda bergulung di dada
  cross('kidsrun', c1 - 0.3, 6, -3.6, 3.8);
  follow(0, -1.9, c1, 1, 0.5);
  k.move('dimas.head', 10, c1, 1);
  k.cam(c1, 6, { z: 8.4, ly: 1.15, x: 0, lx: 0 });
  // 9 Saat kupanggil namamu langit pun makin dalam — he calls a name. The sky deepens.
  k.move('dimas.armB', 48, L(9), 1.3, 'outBack');
  sky(L(9), 4, ...DEEP, [0.85, 0.85, 0.55], 0.24);
  k.move('dimas.armB', 0, L(9) + 4.5, 1.4);
  // 10 Ah kita berlari tak bertanya jarak — the children run again.
  cross('kidsrun', L(10) - 0.6, 5.6, -3.6, 3.8);
  // 11 Lutut pun terluka tetap tertawa — Ardi falls, holds his knee and laughs.
  k.enter('ardifall', L(11) - 0.2, 0.8, 'out');
  k.move('ardifall.rz', -6, L(11) + 0.6, 0.4, 'sine');
  k.move('ardifall.rz', 5, L(11) + 1.0, 0.4, 'sine');
  k.move('ardifall.rz', 0, L(11) + 1.4, 0.4, 'sine');
  follow(0.55, -1.75, L(11), 0.8, 0.7, 0xfff0d8, 0.4);
  k.leave('ardifall', L(12) - 0.5, 1.2, 'in');
  // 12 semua pagi dan senja — morning, then dusk, in one breath.
  sky(L(12), 2, ...NOON, [0.8, 0.8, 0.55], 0.22);
  sky(L(12) + 2.4, 3, ...DUSK, [0.7, 0.8, 0.5], 0.14);
  k.look(L(12) + 2.4, 3, { fohL: [0.26, 0xffb890], fohR: [0.2, 0xd8a0c0], left: [0.24, 0xff9060], back: [0.3, 0xff9050] });
  k.leave('sun', L(12) + 2, 3, 'in');
  // 13 Ternyata surat untuk diriku di masa depan — the paper planes fly over.
  tl.set('planes.x', -3.4, 0);
  k.pop('planes', true, L(13) - 0.6);
  k.move('planes.x', 3.6, L(13) - 0.6, 7, 'linear');
  tl.base('planes.sway', 0.6);
  k.pop('planes', false, L(13) + 6.4);
  k.move('dimas.head', 14, L(13), 1.2);
  // 14 gema masa muda — his hand goes to his chest.
  k.move('dimas.armB', -38, L(14) - 0.3, 1.4);
  k.move('dimas.head', 0, L(14), 1.2);
  follow(DIMAS.x, DIMAS.z, L(14) - 0.3, 1, 0.75);
  k.cam(L(14) - 0.5, 6, { z: 7.2, ly: 1.15, x: -0.2, lx: -0.25 });
  // 15 Masih bernyanyi dalam hati
  k.move('dimas.armB', 0, E('ch1') + 0.5, 1.6);

  // ---- verse 2: the worn corridor. Chalk dust into the clouds. Sari at the window. The blank envelope.
  k.leave('field', v2 - 3, 2.6, 'in');
  k.leave('flametree', v2 - 3.2, 2.6, 'in');
  k.enter('corridor', v2 - 2.6, 2.8, 'out');
  sky(v2 - 3, 3, ...NOON, [0.55, 0.6, 0.4], 0.18);
  k.look(v2 - 3, 3, { fohL: [0.26, 0xf0f0ff], fohR: [0.24, 0xe8ecff], left: [0.12, 0xe0e8ff], right: [0.18, 0xfff0d8], back: [0.16, 0xd8e4ff], foot: 0.34, ambient: 0.26 });
  walk('dimas', v2 - 2.4, 2.6, -1.5);
  k.cam(v2 - 2, 5, { z: 8, ly: 1.1, x: 0, lx: 0 });
  // 17 Jejak langkah jadi irama menggema — the boy walks the corridor on the beat.
  tl.set('kid.x', -3.8, v2 - 1);
  k.pop('kid', true, v2 - 0.4);
  walk('kid', L(17) - 1.4, 5.2, -0.1, 'linear');
  follow(-0.4, -1.3, L(17) - 0.5, 4, 0.55);
  // 18 Debu kapur putih — white chalk dust drifts down.
  tl.set('snow.x0', -2.4, L(18) - 1).set('snow.x1', 2.4, L(18) - 1);
  k.move('snow.rate', 0.4, L(18) - 0.8, 1.6);
  // 19 Tersapu ke balik awan yang begitu lembut — the clouds come down and take the dust.
  k.enter('clouds', L(19) - 0.6, 3.2, 'out');
  tl.base('clouds.sway', 0.3);
  k.move('snow.rate', 0, L(19) + 4, 3);
  // 20 Diam menyimpan rasa — Sari comes in and waits. He turns to her.
  tl.set('sari.x', -3.2, 0);
  k.enter('sari', L(20) - 1.6, 2.2, 'out');
  k.move('sari.x', 0, L(20) - 1.6, 2.4, 'out');
  hop('sari', L(20) - 1.6, 2.2);
  face('kid', L(20) - 0.2, true);
  k.move('kid.x', 0.15, L(20), 1);
  follow(-0.2, -1.45, L(20), 1.2, 0.7, 0xffe8d8);
  k.cam(L(20), 5, { z: 7.1, ly: 1.0, x: -0.2, lx: -0.25 });
  // 21 Sampul surat pun tak berani kutulis lengkap — he holds out the blank envelope, then takes it back.
  k.move('kid.armA', -48, L(21) - 0.2, 1.3, 'out');
  k.move('kid.head', -10, L(21) + 0.4, 1);
  k.move('kid.armA', -10, L(21) + 3, 1.2);
  // 22 Satu kata "semangat" — one word. He lifts his hand.
  k.move('kid.armB', 55, L(22) - 0.1, 0.8, 'outBack');
  k.move('kid.head', 8, L(22), 0.8);
  tl.base('sari.sway', 0).to('sari.sway', 0.4, L(22), 0.8);
  // 23 Kita anggap janji yang tak akan berakhir
  k.move('kid.armB', 0, L(23) + 2.5, 1.2);
  k.move('kid.armA', 0, L(23) + 2.5, 1.2);
  k.look(L(23), 3, { cycHz: [0.75, 0xf6c070] });

  // ---- chorus 2: the field again. The class lines up for the photo. The flash. Then the dusk.
  k.leave('corridor', c2 - 1.8, 2.4, 'in');
  k.leave('clouds', c2 - 1.4, 2.2, 'in');
  k.leave('sari', c2 - 1.4, 1.8, 'in');
  k.enter('field', c2 - 1.4, 2.6, 'out');
  k.enter('flametree', c2 - 1, 2.6, 'out');
  face('kid', c2 - 1.4, false);
  walk('kid', c2 - 1.4, 2.4, 1.4, 'in');
  k.pop('kid', false, c2 + 1);
  walk('dimas', c2 - 1, 2.4, 0);
  sky(c2 - 1.4, 2.4, ...GOLD, [0.8, 0.9, 0.6], 0.2);
  day(c2 - 1, 2);
  k.cam(c2, 6, { z: 8.4, ly: 1.15, x: 0, lx: 0 });
  // 24 gema masa muda — the class rises out of the trap.
  k.enter('class', L(24) - 0.2, 2.6, 'out');
  follow(0.35, -2.05, L(24), 1.2, 0.55);
  // 25 Saat kupanggil namamu — the photo is taken. The flash.
  [L(25) + 1.2, L(25) + 1.45].forEach((t, i) => k.flash('fohL', t, i ? 0.7 : 1.1, 0.34, 0.02, 0.35));
  k.flash('fohR', L(25) + 1.2, 1, 0.3, 0.02, 0.4);
  k.move('dimas.head', 10, L(25), 1);
  // 26 berlari — the children break away from the photo and run.
  k.leave('class', L(26) - 0.4, 2.4, 'in');
  cross('kidsrun', L(26) - 0.6, 5.6, -3.6, 3.8);
  // 27 tetap tertawa — Ardi waves from the edge of the field.
  k.enter('ardi', L(27) - 0.4, 1.8, 'out');
  tl.base('ardi.sway', 0.4);
  k.leave('ardi', L(28) - 0.2, 1.6, 'in');
  // 28 pagi dan senja — the dusk comes and stays.
  sky(L(28), 4, ...DUSK, [0.75, 0.85, 0.5], 0.13);
  k.look(L(28), 3, { fohL: [0.24, 0xffb890], fohR: [0.18, 0xd8a0c0], left: [0.24, 0xff9060], right: 0.1, back: [0.32, 0xff9050], foot: 0.3, ambient: 0.22 });
  // 29 surat untuk diriku — the planes again.
  tl.set('planes.x', -3.4, L(29) - 1);
  k.pop('planes', true, L(29) - 0.6);
  k.move('planes.x', 3.6, L(29) - 0.6, 7, 'linear');
  k.pop('planes', false, L(29) + 6.4);
  // 30 gema masa muda — he steps forward into the last light.
  walk('dimas', L(30) - 0.4, 2, 0.3);
  k.move('dimas.armB', -38, L(30), 1.4);
  follow(0, -1.15, L(30), 1.2, 0.7);
  k.move('dimas.armB', 0, E('ch2'), 1.6);
  k.cam(L(30), 6, { z: 7.4, ly: 1.15, x: 0, lx: 0 });

  // ---- bridge: night. Sari cries first. Ardi leaves on the bus. Dimas runs after its shadow. The field lights up.
  sky(br - 2.2, 3, ...NIGHT, [0.45, 0.4, 0.3], 0.1);
  k.move('stars.i', 0.75, br - 1.6, 3);
  k.look(br - 2.2, 2.4, { fohL: [0.08, 0x9aa8d8], fohR: [0.07, 0x8f9fd0], left: 0.04, right: 0.04, back: [0.24, 0x8fa8e0], foot: 0.15, ambient: 0.12, follow: 0 });
  k.leave('flametree', br - 2, 2.4, 'in');
  k.leave('field', br - 1.6, 2.4, 'in');
  k.enter('school', br - 1.4, 2.6, 'out');
  // 32 Siapa lebih dulu / 33 Belajar menahan air mata — Sari alone, her head down.
  tl.set('sari.x', 1.6, br - 2);
  k.enter('sari', br - 1.2, 1.8, 'out');
  follow(1.05, -1.6, br - 0.6, 1.2, 0.55, 0xd8e0ff);
  tl.base('sari.rz', 0).to('sari.rz', -5, L(33), 1.6);
  k.leave('sari', L(34) - 0.4, 1.6, 'in');
  // 34 Siapa yang pergi jauh — the bus pulls away with Ardi at the window.
  tl.set('bus.x', -1.4, 0);
  k.enter('bus', L(34) - 0.8, 1.4, 'out');
  k.move('bus.x', 3.8, L(34) + 0.4, 5.2, 'in');
  hop('bus', L(34) + 0.4, 5);
  k.pop('bus', false, L(34) + 5.6);
  follow(0.4, -2.2, L(34) - 0.4, 1, 0.55, 0xffe8c8);
  k.aim('follow', 2.6, 0.7, -2.2, L(34) + 0.6, 4.6, 'in');
  // 35 Bahkan bayangannya pun tak dapat kukejar — he runs after it. His hand reaches. He stops.
  walk('dimas', L(35) - 0.3, 2.4, 1.3, 'out');
  k.move('dimas.armB', 70, L(35), 1.2, 'outBack');
  k.move('dimas.head', 12, L(35), 1);
  k.move('dimas.armB', 0, L(36) - 0.4, 1.6);
  k.move('dimas.head', -12, L(36), 1.2);
  // 36 Namun lihatlah saat malam pekat — the darkest moment. Only he is lit.
  k.look(L(36), 1.6, { fohL: 0.03, fohR: 0.03, back: 0.12, ambient: 0.07 });
  follow(1, -1.15, L(36), 1.2, 0.55, 0xd0d8ff);
  k.cam(L(34), 8, { z: 7.6, ly: 1.1, x: 0.5, lx: 0.55 });
  // 37 Di dalam hati terang satu lapangan bersinar — the field rises out of the dark and shines.
  k.leave('school', L(37) - 1, 2.4, 'in');
  k.enter('field', L(37) - 0.8, 2.8, 'out');
  k.move('field.glow', 0.42, L(37), 2.5);
  k.look(L(37), 2.5, { foot: 0.5, back: [0.4, 0xffd890] });
  tl.set('glints.x0', -2.6, L(37)).set('glints.x1', 2.6, L(37));
  k.move('glints.rate', 0.4, L(37) + 0.5, 2);
  face('dimas', L(37), true);
  k.move('dimas.head', 14, L(37) + 0.4, 1.4);

  // ---- final chorus, up a step: the gold field. The flame tree drops its flowers. The children call him on.
  k.move('field.glow', 0, c3 + 1, 3);
  k.move('stars.i', 0, c3, 2);
  k.enter('flametree', c3 - 1, 2.6, 'out');
  k.enter('sun', c3 - 0.8, 4, 'out');
  sky(c3 - 0.6, 3, ...GOLD, [0.85, 0.95, 0.62], 0.22);
  day(c3 - 0.6, 2.4, 1.15);
  face('dimas', c3 - 0.4, false);
  walk('dimas', c3 - 0.4, 2.2, -0.2);
  k.cam(c3, 6, { z: 8.4, ly: 1.15, x: 0, lx: 0 });
  // 38 kini pun terbangun — the children run again.
  cross('kidsrun', c3 - 0.2, 5.6, -3.6, 3.8);
  tl.set('glints.x0', 0.9, c3).set('glints.x1', 2.8, c3);
  k.move('glints.rate', 0.6, c3, 2);
  k.move('flametree.glow', 0.2, c3, 2);
  // 39 Setiap luka di jalan bermekaran — Ardi falls and laughs, once more.
  k.enter('ardifall', L(39) - 0.2, 0.8, 'out');
  k.move('ardifall.rz', -6, L(39) + 0.6, 0.4, 'sine');
  k.move('ardifall.rz', 0, L(39) + 1.0, 0.4, 'sine');
  k.leave('ardifall', L(40) - 0.4, 1.2, 'in');
  // 40 jatuh dan terbentur jadi sebuah lagu — Ardi stands up at the edge and waves.
  tl.set('ardi.x', 0, 0);
  k.enter('ardi', L(40) - 0.2, 1.6, 'out');
  // 41 Kunyanyikan untuk diriku yang keras kepala — the boy comes to him. They look at each other.
  tl.set('kid.x', 3.6, L(41) - 2);
  tl.set('kid.head', 0, L(41) - 2).set('kid.armA', 0, L(41) - 2).set('kid.armB', 0, L(41) - 2);
  face('kid', L(41) - 2, true);
  k.pop('kid', true, L(41) - 1.6);
  walk('kid', L(41) - 1.6, 3, 0.05, 'out');
  face('dimas', L(41) + 0.4, false);
  follow(0.3, -1.25, L(41), 1.2, 0.7);
  k.cam(L(41), 5, { z: 7, ly: 1.05, x: 0.2, lx: 0.2 });
  // 42 meski dunia riuh sendu kelam — the light goes grey for a moment.
  k.look(L(42), 1.8, { fohL: 0.16, fohR: 0.14, left: 0.08, right: 0.08 });
  sky(L(42), 2, ...DUSK, [0.6, 0.6, 0.45], 0.14);
  // 43 Tetap kudengar jawaban pertama yang memanggil — Sari and Ardi call to him. The gold comes back.
  tl.set('sari.x', -1.2, L(43) - 1);
  k.enter('sari', L(43) - 0.8, 1.6, 'out');
  k.move('kid.armB', 60, L(43), 0.9, 'outBack');
  k.move('kid.armB', 20, L(43) + 1.2, 0.6, 'sine');
  k.move('kid.armB', 60, L(43) + 1.8, 0.6, 'sine');
  sky(L(43), 2.4, ...DAWN, [0.85, 0.95, 0.62], 0.22);
  day(L(43), 2, 1.15);
  // 44 gema masa muda — side by side. The boy's hand goes to his.
  face('kid', L(44) - 0.6, false);
  walk('kid', L(44) - 0.6, 1.4, -0.35);
  k.move('kid.armB', -10, L(44), 1);
  k.move('dimas.armB', 18, L(44), 1);
  // 45 Menuntunku maju satu demi satu langkah — the two walk forward together, step by step.
  k.move('dimas.z', 0.45, L(45), 6, 'inOut');
  k.move('kid.z', 0.45, L(45), 6, 'inOut');
  hop('dimas', L(45), 6);
  hop('kid', L(45), 6);
  follow(0, -0.75, L(45), 4, 0.8);
  k.cam(L(45), 6, { z: 7.6, ly: 1.1, x: 0, lx: 0 });

  // ---- outro: the memory goes down. The lamp and the desk come back. He smiles, and he walks on.
  k.leave('ardi', out, 2, 'in');
  k.leave('sari', out + 0.2, 2, 'in');
  face('kid', out + 1.2, true);
  walk('kid', out + 1.4, 3, 3.6, 'in');
  k.pop('kid', false, out + 4.4);
  k.move('glints.rate', 0, out, 3);
  k.leave('flametree', out + 2, 3, 'in');
  k.leave('field', out + 2.4, 3, 'in');
  k.leave('sun', out + 2, 3, 'in');
  sky(out + 2, 5, ...DARK, [0.2, 0.2, 0.15], 0.1);
  k.look(out + 2, 5, { fohL: 0.05, fohR: 0.04, left: 0, right: 0, foot: 0.12, back: 0.05, ambient: 0.1, lamp: [0.9, 0xffc070] });
  k.enter('lamp', out + 3, 3, 'out');
  k.enter('desk', out + 2.6, 3, 'out');
  k.move('lamp.glow', 0.35, out + 4, 2);
  k.move('dimas.z', 0, out + 3, 3);
  walk('dimas', out + 3, 3, 0);
  k.move('dimas.armB', 0, out + 3, 1.5);
  follow(DIMAS.x - 0.3, DIMAS.z, out + 5, 2, 0.5, 0xffe8c8);
  k.move('dimas.armA', -24, out + 7, 1.6);
  k.move('dimas.head', -10, out + 7, 1.4);
  k.move('dimas.head', 10, out + 11, 2);
  k.move('dimas.armA', 0, out + 12.5, 1.4);
  k.cam(out + 3, 8, { z: 7.4, ly: 1.0, x: -0.6, lx: -0.6 });

  // ---- the end: the traveller closes. In the curtain call Dimas and the boy bow.
  tl.set('surtitles.i', 0, end - 3.6);
  k.cam(end - 4.8, 4.2, { z: 9.4, x: 0, lx: 0, y: 0.95, ly: 1.05 });
  k.move('curtain.open', 0, end - 3.8, 3.4, 'inOut');
  k.look(end - 1, 2, { follow: 0, house: 0.25, lamp: 0 });
  k.pop('dimas', false, end - 2);
  for (const [ch, v] of [['dimas.x', -0.1], ['dimas.z', 0.65], ['dimas.head', 0], ['dimas.armA', 0], ['dimas.armB', 0], ['dimas.turn', 0], ['kid.x', -0.15], ['kid.z', 0.75], ['kid.head', 0], ['kid.armA', 0], ['kid.armB', 0], ['kid.turn', 1]] as const) k.move(ch, v, end - 1.9, 0.01);
  k.move('curtain.open', 0.5, end + 0.8, 1.6, 'out');
  k.pop('dimas', true, end + 1);
  k.pop('kid', true, end + 1);
  k.look(end + 0.6, 0.8, { follow: [0.7, 0xffe6c4] });
  k.aim('follow', 0, 1.0, -0.5, end + 0.5, 0.01);
  k.move('dimas.rz', -18, end + 2.4, 0.5);
  k.move('kid.rz', 18, end + 2.4, 0.5);
  k.move('dimas.rz', 0, end + 3, 0.5);
  k.move('kid.rz', 0, end + 3, 0.5);
  k.move('curtain.open', 0, end + 4.2, 1.8, 'inOut');
  k.look(end + 4.6, 1.5, { follow: 0, house: 0.7 });

  spotlights();

  // ---- the spotlight play. Written last, so at the same moment it wins over the washes above.
  function spotlights() {
    // The desk in the dark: a narrow shaft straight down from the lamp.
    k.place('ray', DESK.x, 1.75, DESK.z, 0);
    k.aim('ray', DESK.x, 0, DESK.z, 0, 0.01);
    tl.set('ray.r', 1, 0).set('ray.g', 0.85, 0).set('ray.b', 0.6, 0);
    k.look(1, 3, { ray: 0.3 });
    k.look(L(2), 1.5, { ray: 0 });
    // The gold field: two side beams cross through the dust.
    k.aim('left', 0.8, 0.9, -2.2, L(3), 0.01);
    k.aim('right', -0.6, 0.9, -2.2, L(3), 0.01);
    k.move('haze', 2.2, L(3), 3);
    k.move('haze', 1.2, c1 - 2, 3);
    // The flash of the photo.
    k.move('haze', 2, L(25), 1);
    k.move('haze', 1.2, L(26), 2);
    // The bridge: one cold shaft on Sari, then on Dimas.
    k.place('ray', 1.2, 3.4, -1.3, br - 0.8);
    k.aim('ray', 1.05, 0, -1.6, br - 0.8, 0.01);
    tl.set('ray.r', 0.78, br - 0.8).set('ray.g', 0.86, br - 0.8).set('ray.b', 1, br - 0.8);
    k.look(br, 1.4, { ray: 0.32 });
    k.aim('ray', 1, 0, -1.15, L(35) + 1, 1.6);
    k.move('haze', 2.6, br, 2);
    k.look(L(37) + 1, 2, { ray: 0 });
    // The field shines: a warm beam rises from the floor.
    k.move('haze', 1.4, c3, 2);
    // The desk at the end.
    k.place('ray', DESK.x, 1.75, DESK.z, out + 4);
    k.aim('ray', DESK.x, 0, DESK.z, out + 4, 0.01);
    tl.set('ray.r', 1, out + 4).set('ray.g', 0.85, out + 4).set('ray.b', 0.6, out + 4);
    k.look(out + 5, 2, { ray: 0.3 });
    k.look(end - 1, 1.5, { ray: 0 });
  }
}

const production: Production = {
  id: 'gema-masa-muda',
  no: 7,
  title: { zh: '青春回声', en: 'Echo of Our Youth', id: 'Gema Masa Muda' },
  poster: urls['./art/cut/poster.webp']!,
  audio,
  master,
  pieces,
  curtain: { open: 'traveller', close: 'traveller' },
  preroll: 7,
  postroll: 7,
  surtitles: { main: 'id', second: 'zh' },
  bill: {
    about: 'A grown man remembers his school friends. The old school field still shines in his heart. Dimas sings the song in Indonesian.',
    cast: [['Dimas', 'Voice'], ['Young Dimas', 'On strings'], ['Sari', 'On a slide'], ['Ardi', 'On a slide'], ['The class', 'On rods']],
    scenes: ['The old desk', 'The school field', 'The corridor', 'The class photo', 'The night bus'],
  },
  voices: { dimas: { name: 'Dimas', color: '#f0dcb0' } },
  cues,
};

export default production;
