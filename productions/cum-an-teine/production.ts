// Cùm an Teine · Keep the Fire · Jagalah Api · 守住炉火
// The cue sheet follows the producer's Suno recording (song/master.json). Line numbers below are the sung lines.
// Heights (y) are above the stage floor. The stage opening is about 5.5 wide and 2.4 high. Depth runs to z = -4.
//
// The Scottish Highlands, 1845. The estate clears the glen. Seonag gives her son Ewan the last ember of a hearth fire
// that has burned for two hundred years. She dies on the shore. In the storm at sea the ember goes out. On a cold new
// shore, Ewan and Morag light a new fire with flint and their hands. The cards are printed as hand-tinted Victorian
// wood engravings. Ewan, Morag and Seonag are marionettes. The ember is the theatre's warm practical light.

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
const EWAN = { x: 0, y: 0, z: -1.2 };
const MORAG = { x: 0, y: 0, z: -1.26 };
const SEONAG = { x: 0, y: 0, z: -1.32 };
// The croft stands upstage left. Its thatch sits on the walls.
const CROFT = { x: -1.05, z: -2.4 };
// The hearth burns downstage of the croft, as a cutaway of the house.
const HEARTH = { x: -0.35, z: -1.5 };

const pieces: PieceSpec[] = [
  { id: 'clouds', kind: 'prop', art: art('prop-clouds'), width: 5.6, anchor: 'center', home: { x: 0, y: 2.3, z: -3.45 }, route: 'fly', strings: [[0.15, 0.25], [0.5, 0.2], [0.85, 0.25]], shadow: false },
  { id: 'glen', kind: 'flat', art: art('flat-glen'), width: 6.6, home: { x: 0, y: -0.15, z: -3.3 }, route: 'trap', rod: true, startIn: true },
  { id: 'shore', kind: 'flat', art: art('flat-shore'), width: 6.6, home: { x: 0, y: -0.1, z: -3.0 }, route: 'trap', rod: true },
  { id: 'ship', kind: 'prop', art: art('prop-ship'), height: 1.7, home: { x: 0, y: 0.45, z: -3.15 }, route: 'right', slide: 'right' },
  { id: 'newshore', kind: 'flat', art: art('flat-newshore'), width: 6.4, home: { x: 0, y: -0.2, z: -2.9 }, route: 'trap', rod: true },
  { id: 'waves1', kind: 'prop', art: art('prop-waves'), width: 6.8, anchor: 'center', home: { x: 0, y: 0.15, z: -2.7 }, route: 'trap', rod: true },
  { id: 'folk', kind: 'flat', art: art('flat-folk'), width: 3.0, home: { x: 0, y: 0, z: -2.6 }, route: 'left', slide: 'left' },
  { id: 'croft', kind: 'flat', art: art('flat-croft'), width: 2.2, home: { x: 0, y: 0, z: CROFT.z }, route: 'trap', rod: true },
  { id: 'thatch', kind: 'prop', art: art('prop-thatch'), width: 2.05, home: { x: 0, y: 0.5, z: CROFT.z - 0.04 }, route: 'trap', rod: true },
  { id: 'notice', kind: 'prop', art: art('prop-notice'), height: 0.26, anchor: 'center', home: { x: CROFT.x + 0.32, y: 0.48, z: CROFT.z + 0.06 }, route: 'fly', strings: [[0.5, 0.02]] },
  { id: 'men', kind: 'prop', art: art('prop-men'), width: 1.35, home: { x: 0, y: 0, z: -2.2 }, route: 'left', slide: 'left' },
  { id: 'waulking', kind: 'flat', art: art('flat-waulking'), width: 4.4, home: { x: 0.2, y: -0.1, z: -2.0 }, route: 'trap', rod: true },
  { id: 'cairn', kind: 'prop', art: art('prop-cairn'), width: 1.0, home: { x: -0.55, y: 0, z: -1.45 }, route: 'trap', rod: true },
  { id: 'deck', kind: 'flat', art: art('flat-deck'), width: 6.0, home: { x: 0, y: -0.55, z: -1.7 }, route: 'trap', rod: true },
  { id: 'hearth', kind: 'prop', art: art('prop-hearth'), height: 0.62, home: { x: HEARTH.x, y: 0, z: HEARTH.z }, route: 'trap', rod: true },
  { id: 'sleep', kind: 'prop', art: art('prop-seonag-sleep'), width: 1.15, home: { x: -0.55, y: 0, z: -1.45 }, route: 'trap', rod: true },
  { id: 'kneel', kind: 'prop', art: art('prop-kneel'), width: 1.35, home: { x: 0.1, y: 0, z: -1.25 }, route: 'trap', rod: true },
  { id: 'baby', kind: 'prop', art: art('prop-morag-baby'), height: 0.92, home: { x: 0, y: 0, z: -1.3 }, route: 'left', slide: 'left' },
  {
    id: 'seonag', kind: 'puppet', home: SEONAG, route: 'left',
    puppet: {
      height: 0.86, faces: 'right',
      body: p(part('puppet-seonag', 1), [0.5, 1]),
      head: p(part('puppet-seonag', 0), [0.619, 0.907], { attach: [0.574, 0.04], z: -0.6, string: [0.5, 0.05] }, 0.62),
      // Each arm hangs on the side where the painter drew it. She faces right, so a positive angle reaches forward.
      armA: p(part('puppet-seonag', 3), [0.378, 0.068], { attach: [0.799, 0.11], z: 1, string: [0.55, 0.92] }),
      armB: p(part('puppet-seonag', 2), [0.641, 0.076], { attach: [0.319, 0.109], z: 1.1, string: [0.45, 0.92] }),
    },
  },
  {
    id: 'morag', kind: 'puppet', home: MORAG, route: 'left',
    puppet: {
      height: 0.94, faces: 'left',
      body: p(part('puppet-morag', 1), [0.5, 1]),
      head: p(part('puppet-morag', 0), [0.418, 0.902], { attach: [0.568, 0.041], z: -0.6, string: [0.5, 0.05] }, 0.62),
      // She faces left, so a negative angle reaches forward.
      armA: p(part('puppet-morag', 3), [0.731, 0.071], { attach: [0.308, 0.11], z: 1.1, string: [0.45, 0.92] }),
      armB: p(part('puppet-morag', 2), [0.29, 0.071], { attach: [0.805, 0.108], z: 1, string: [0.55, 0.92] }),
    },
  },
  {
    id: 'ewan', kind: 'puppet', home: EWAN, route: 'right',
    puppet: {
      height: 1.0, faces: 'right',
      body: p(part('puppet-ewan', 1), [0.5, 1]),
      head: p(part('puppet-ewan', 0), [0.6, 0.89], { attach: [0.558, 0.036], z: -0.6, string: [0.5, 0.05] }, 0.62),
      // He faces right, so a positive angle reaches forward. armA is the near arm.
      armA: p(part('puppet-ewan', 3), [0.361, 0.073], { attach: [0.829, 0.093], z: 1.1, string: [0.55, 0.92] }),
      armB: p(part('puppet-ewan', 2), [0.686, 0.077], { attach: [0.281, 0.093], z: 1, string: [0.45, 0.92] }),
    },
  },
  // The ember pot travels in Ewan's near hand: `pot.held` pins its handle to his palm. Its glow is the theatre's warm practical.
  { id: 'pot', kind: 'prop', art: art('prop-pot'), height: 0.2, anchor: 'center', home: { x: 0, y: 0, z: -1.12 }, route: 'right', grip: { piece: 'ewan', part: 'armA', point: [0.5, 0.93], pin: [0.5, 0.12] } },
  { id: 'wave', kind: 'prop', art: art('prop-wave'), height: 2.3, home: { x: 0, y: -0.3, z: -0.95 }, route: 'right', slide: 'right' },
  { id: 'waves2', kind: 'prop', art: art('prop-waves'), width: 7.0, anchor: 'center', home: { x: 0, y: 0.05, z: -0.7 }, route: 'trap', rod: true },
];

// ---------------------------------------------------------------- the cue sheet

function cues({ tl, section, line }: CueContext) {
  const k = cueKit(tl, master);
  const L = (n: number) => line(n).start;
  const E = (id: string) => section(id).end;
  const end = master.duration;
  tl.signal('ewan.sing', master.vox!.fps, master.vox!.ewan ?? []);
  tl.signal('morag.sing', master.vox!.fps, master.vox!.morag ?? []);
  tl.signal('seonag.sing', master.vox!.fps, master.vox!.choir ?? []);

  const sky = (t: number, dur: number, top: number, hz: number, bot: number, levels: [number, number, number] = [0.6, 0.6, 0.45], hzY = 0.16) => {
    k.look(t, dur, { cycTop: [levels[0], top], cycHz: [levels[1], hz], cycBot: [levels[2], bot] });
    k.move('cycHz.y', hzY, t, dur);
  };
  const MIST = [0x5a6470, 0xb8bcb4, 0x7a7c70] as const;
  const DAY = [0x6e7c8a, 0xd8d4c4, 0xa8a490] as const;
  const DUSK = [0x2e3646, 0xb08a70, 0x4a4040] as const;
  const NIGHT = [0x0c121c, 0x26303e, 0x0c1016] as const;
  const DAWN = [0x4a5466, 0xd8c0a8, 0x8a8478] as const;
  const STORM = [0x0a0e14, 0x2a3440, 0x0a0e12] as const;
  const SNOW = [0x2c3644, 0x8a96a4, 0x3a424e] as const;

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
  const grey = (t: number, dur = 2, level = 1, warm = 0xf4f0e4) => k.look(t, dur, {
    fohL: [0.3 * level, warm], fohR: [0.26 * level, 0xffffff], left: [0.14 * level, 0xe0e4e8], right: [0.14 * level, warm],
    back: [0.2 * level, 0xd8dce0], foot: 0.36 * level, ambient: 0.28 * level,
  });
  const night = (t: number, dur = 2, level = 1) => k.look(t, dur, {
    fohL: [0.13 * level, 0x9aa8c8], fohR: [0.11 * level, 0x90a0c0], left: [0.08 * level, 0x8090b8], right: [0.08 * level, 0x8090b8],
    back: [0.26 * level, 0x8aa0c8], foot: 0.18 * level, ambient: 0.15 * level,
  });
  /** The fire: the theatre's warm practical. */
  const fire = (t: number, level: number, x: number, y: number, z: number, dur = 1.4) => {
    k.place('lamp', x, y, z, t);
    k.look(t, dur, { lamp: [level, 0xff9a40] });
  };
  const smoke = (t: number, i: number, x: number, y: number, z: number, dur = 2) => {
    tl.set('smoke.x', x, t).set('smoke.y', y, t).set('smoke.z', z, t);
    k.move('smoke.i', i, t, dur);
  };
  const snow = (t: number, rate: number, dur = 2) => {
    tl.set('snow.x0', -3.2, t).set('snow.x1', 3.2, t);
    k.move('snow.rate', rate, t, dur);
  };

  const pre = L(4), v2 = L(8), c1 = L(12), v3 = L(18), c2 = L(22), st = L(28), brk = E('storm'), v4 = L(34), c3 = L(38), out = L(46);
  const BEAT = 60 / master.bpm;

  // ---- preroll: the house settles. The traveller hangs closed.
  const P = -7;
  tl.set('curtain.style', curtainStyleIndex('traveller'), P);
  k.cam(P, 0.01, { x: 0, y: 0.95, z: 9.4, lx: 0, ly: 1.05, lz: -1, fov: 27 });
  k.look(P + 1, 3.5, { house: 0, fohL: 0.12, fohR: 0.1, foot: 0.9, ambient: 0.25 });
  k.aim('follow', 0, 1.0, -0.14, P);
  k.look(P + 3.5, 1.5, { follow: [0.5, 0xffe4bc] });
  tl.set('surtitles.i', 0, P);
  tl.base('haze', 1.2);

  // ---- intro: mist comes off the glen. The croft rises with its thatch. One chimney smokes.
  k.move('curtain.open', 1, 0.3, 4.5, 'inOut');
  sky(0, 4, ...MIST, [0.55, 0.6, 0.45], 0.16);
  grey(0.4, 4, 0.7);
  k.enter('clouds', 0.5, 4, 'out');
  tl.base('clouds.sway', 0.3);
  tl.set('croft.x', CROFT.x, 0).set('thatch.x', CROFT.x, 0);
  k.enter('croft', 2, 4, 'out');
  k.enter('thatch', 2.2, 4, 'out');
  smoke(5, 0.45, CROFT.x + 0.15, 1.05, CROFT.z, 4);
  k.move('haze', 0.7, 6, 10);
  follow(CROFT.x, CROFT.z, 3, 3, 0.4, 0xf0e8d8, 0.6);
  k.cam(0.3, 18, { z: 8.4, ly: 1.05, x: -0.3, lx: -0.4 });

  // ---- verse 1: the house. Seonag banks the fire. Ewan cuts peat on the hill at the right.
  tl.set('surtitles.i', 1, L(0) - 1);
  k.enter('hearth', L(0) - 3, 2.4, 'out');
  fire(L(0) - 2, 0.6, HEARTH.x, 0.25, HEARTH.z + 0.2);
  set(0, [['seonag.x', -3.2]]);
  k.pop('seonag', true, L(0) - 2.2);
  walk('seonag', L(0) - 2.2, 2.4, HEARTH.x - 0.6, 'out');
  set(0, [['ewan.x', 3.2]]);
  k.pop('ewan', true, L(0) + 0.5);
  walk('ewan', L(0) + 0.5, 2.6, 1.55, 'out');
  face('ewan', L(0) + 3.2, true);
  sky(L(0), 4, ...DAY, [0.6, 0.65, 0.5], 0.17);
  grey(L(0), 3, 0.9);
  // 0–1 he cuts peat: the near arm swings down on every other beat.
  for (let t = L(0) + 3.6, i = 0; t < L(2) - 0.4; t += BEAT, i++) {
    k.move('ewan.armA', i % 2 ? -20 : -95, t, BEAT * 0.8, i % 2 ? 'inOut' : 'in');
    k.move('ewan.rz', i % 2 ? 0 : 6, t, BEAT * 0.8, 'sine');
  }
  k.move('ewan.armA', 0, L(2) - 0.4, 0.8);
  k.move('ewan.rz', 0, L(2) - 0.4, 0.8);
  // 2 My mother banked it every night — she bends to the fire and lays the peats with both hands.
  k.move('seonag.rz', -10, L(2) - 0.4, 1);
  k.move('seonag.head', -14, L(2) - 0.4, 1);
  [0, 1.2, 2.4].forEach((dt, i) => {
    k.move('seonag.armA', i % 2 ? 40 : 65, L(2) + dt, 0.8, 'sine');
    k.move('seonag.armB', i % 2 ? 55 : 30, L(2) + dt + 0.2, 0.8, 'sine');
  });
  k.flash('lamp', L(2) + 1.2, 0.8, 0.6, 0.2, 1.2);
  follow(HEARTH.x - 0.3, HEARTH.z, L(2) - 1, 1.6, 0.55, 0xffe0c0, 0.6);
  // 3 And the smoke went up to the sky — she straightens. The smoke rises. Ewan walks home.
  k.move('seonag.rz', 0, L(3) - 0.2, 1);
  k.move('seonag.head', 6, L(3) - 0.2, 1.2);
  k.move('seonag.armA', 0, L(3), 1);
  k.move('seonag.armB', 0, L(3), 1);
  smoke(L(3), 0.8, CROFT.x + 0.15, 1.05, CROFT.z, 3);
  face('ewan', L(3) - 0.6, true);
  walk('ewan', L(3) - 0.4, 3, 0.6);
  k.cam(L(0), 12, { z: 7.9, ly: 1.0, x: 0, lx: -0.1 });
  k.cam(L(2), 6, { z: 7.2, ly: 0.9, x: -0.6, lx: -0.7 });

  // ---- pre-chorus: the waulking song. The board rises. The women beat the cloth on the beat. Morag beats at the end.
  k.enter('waulking', pre - 2.2, 1.8, 'out');
  k.pop('ewan', false, pre - 1.6);
  k.move('seonag.x', -2.0, pre - 2, 1.6);
  set(0, [['morag.x', 3.2]]);
  k.pop('morag', true, pre - 2.2);
  walk('morag', pre - 2.2, 1.8, 2.15, 'out');
  smoke(pre - 1, 0.3, CROFT.x + 0.15, 1.05, CROFT.z, 1);
  k.downbeats(pre - 0.2, E('pre')).forEach((b) => {
    k.move('waulking.y', -0.16, b - 0.1, 0.2, 'out');
    k.move('waulking.y', -0.1, b + 0.2, 0.5, 'inOut');
  });
  for (let t = pre, i = 0; t < E('pre') + 0.6; t += BEAT, i++) {
    k.move('morag.armA', i % 2 ? -30 : -85, t, BEAT * 0.7, 'sine');
    k.move('morag.armB', i % 2 ? -80 : -35, t, BEAT * 0.7, 'sine');
    k.move('morag.rz', i % 2 ? 0 : 5, t, BEAT * 0.7, 'sine');
  }
  follow(0.6, -1.9, pre - 1, 1.2, 0.6, 0xfff0dc, 0.6);
  k.cam(pre - 1, 6, { z: 8.2, ly: 1.0, x: 0.3, lx: 0.3 });

  // ---- verse 2: the notice. The men pull the rooftree down. The thatch falls. "Take the fire."
  k.leave('waulking', v2 - 0.8, 2, 'in');
  k.move('morag.armA', 0, v2 - 0.6, 0.8);
  k.move('morag.armB', 0, v2 - 0.6, 0.8);
  k.move('morag.rz', 0, v2 - 0.6, 0.8);
  walk('morag', v2 - 0.4, 2.2, 0.9);
  sky(v2 - 1, 3, ...MIST, [0.45, 0.5, 0.38], 0.14);
  grey(v2 - 1, 3, 0.7, 0xe8e8e8);
  // 8 They nailed the paper to the door — it flies in hard. A hammer flash.
  k.enter('notice', v2 - 0.2, 0.8, 'out');
  [v2 + 0.8, v2 + 1.3].forEach((t) => k.flash('back', t, 0.6, 0.2, 0.02, 0.2));
  k.move('morag.head', -10, v2 + 0.6, 0.8);
  follow(CROFT.x + 0.3, CROFT.z, v2, 1, 0.65, 0xf0f0f0, 0.6);
  // 9 They pulled the rooftree to the floor — the men haul in from the left. The thatch tips on each pull.
  set(0, [['men.x', -3.6]]);
  k.pop('men', true, L(9) - 1.4);
  walk('men', L(9) - 1.4, 1.4, -1.95, 'out');
  k.downbeats(L(9) - 0.2, L(10) + 0.4).forEach((b, i) => {
    k.move('men.x', -2.05 - i * 0.06, b, 0.3, 'out');
    k.move('men.rz', 6, b, 0.3, 'out');
    k.move('men.rz', 0, b + 0.4, 0.4);
    k.move('thatch.rz', 4 + i * 3, b + 0.05, 0.35, 'out');
    k.move('thatch.x', CROFT.x - 0.05 - i * 0.05, b + 0.05, 0.35, 'out');
  });
  k.move('seonag.armA', 20, L(9), 0.8);
  k.move('seonag.head', 10, L(9), 0.8);
  k.cam(v2, 9, { z: 7.6, ly: 0.95, x: -0.8, lx: -0.9 });
  // 10 The thatch came down upon the bed — it drops into the walls. Dust. The smoke stops.
  k.move('thatch.y', 0.05, L(10) + 0.4, 0.6, 'in');
  k.move('thatch.rz', 14, L(10) + 0.4, 0.6, 'in');
  k.flash('back', L(10) + 1, 0.8, 0.3, 0.02, 0.4);
  k.move('dust.i', 1, L(10) + 0.9, 0.4);
  k.move('dust.i', 0.2, L(10) + 1.6, 2.4);
  k.move('smoke.i', 0, L(10) + 0.9, 0.8);
  k.leave('thatch', L(10) + 2, 1.6, 'in');
  walk('men', L(10) + 1.8, 2.4, -3.6, 'in');
  k.pop('men', false, L(10) + 4.4);
  k.move('seonag.armA', 0, L(10) + 1.4, 0.6);
  // 11 "Take the fire," my mother said — she lifts the last ember into the pot and holds it out to her son.
  set(L(11) - 1.5, [['ewan.x', 3.2], ['ewan.turn', 1]]);
  k.pop('ewan', true, L(11) - 1.5);
  walk('ewan', L(11) - 1.5, 1.6, 0.35, 'out');
  face('ewan', L(11) + 0.2, true);
  k.move('seonag.x', HEARTH.x - 0.55, L(11) - 1.6, 1.2);
  k.move('seonag.rz', -12, L(11) - 0.6, 0.8);
  k.move('seonag.armA', 60, L(11) - 0.6, 0.8);
  set(L(11) - 0.4, [['pot.x', HEARTH.x - 0.05], ['pot.y', 0.18]]);
  k.pop('pot', true, L(11) - 0.3);
  k.move('pot.x', HEARTH.x - 0.05, L(11) + 0.4, 1.2);
  k.move('pot.y', 0.5, L(11) + 0.4, 1.2, 'out');
  k.move('seonag.rz', 0, L(11) + 0.4, 1);
  k.move('seonag.armA', 80, L(11) + 0.4, 1.2);
  k.move('seonag.armB', 70, L(11) + 0.6, 1.2);
  // He comes to her and takes it in both hands.
  walk('ewan', L(11) + 1.2, 1.2, HEARTH.x - 0.05 - 0.11 - 0.367 * Math.sin(Math.PI / 3), 'out');
  k.move('ewan.armA', 60, L(11) + 1.6, 1);
  k.move('ewan.armB', 50, L(11) + 1.7, 1);
  k.move('ewan.head', -8, L(11) + 1.6, 1);
  tl.set('pot.held', 0, 0).set('pot.glow', 0.35, 0);
  k.move('pot.held', 1, L(11) + 2.2, 0.6);
  k.move('seonag.armA', 0, L(11) + 3.6, 1);
  k.move('seonag.armB', 0, L(11) + 3.6, 1);
  fire(L(11) + 2.4, 0.5, HEARTH.x - 0.05, 0.5, HEARTH.z + 0.4, 1);
  k.leave('hearth', L(11) + 3.4, 1.6, 'in');
  follow(HEARTH.x - 0.2, HEARTH.z, L(11) - 1, 1.2, 0.7, 0xffd8b0, 0.7);
  k.cam(L(11), 5, { z: 6.9, ly: 0.85, x: -0.5, lx: -0.5 });

  // ---- chorus 1: the shore road. The glen walks to the bay. The ship waits.
  const ex1 = 0.6;
  k.leave('notice', c1 - 1.8, 1.4, 'in');
  k.leave('glen', c1 - 1.6, 2.4, 'in');
  k.enter('shore', c1 - 1.2, 2.6, 'out');
  set(0, [['ship.x', 3.8]]);
  k.pop('ship', true, c1 - 1);
  k.move('ship.x', 1.75, c1 - 1, 5, 'out');
  k.move('croft.x', -2.15, c1 - 1.6, 3);
  k.move('croft.s', 0.75, c1 - 1.6, 3);
  sky(c1 - 1.5, 4, ...DAY, [0.6, 0.65, 0.5], 0.15);
  grey(c1 - 1, 3, 0.85);
  // Ewan holds the pot before him. The family walks right, behind the folk on the road.
  k.move('ewan.armA', 55, c1 - 1.4, 0.8);
  k.move('ewan.armB', 50, c1 - 1.4, 0.8);
  k.move('ewan.head', 0, c1 - 1.4, 0.8);
  walk('ewan', c1 - 1.2, 9, ex1, 'inOut');
  fire(c1 - 1.2, 0.55, ex1 + 0.41, 0.6, -1.0, 9);
  k.move('seonag.x', ex1 - 0.75, c1 - 1.2, 9);
  hop('seonag', c1 - 1.2, 9);
  k.pop('morag', false, c1 - 1.5);
  set(c1 - 1.5, [['baby.x', -3.4]]);
  k.pop('baby', true, c1 - 1.4);
  walk('baby', c1 - 1.4, 9, ex1 - 1.4, 'inOut');
  face('baby', c1 - 1.4, true);
  set(0, [['folk.x', -4.4]]);
  k.pop('folk', true, c1 - 1.2);
  k.move('folk.x', 4.2, c1 - 1.2, 15, 'linear');
  hop('folk', c1 - 1.2, 15);
  // 13 and 16 Cùm an teine — the ember brightens on the choir.
  k.flash('lamp', L(13), 0.85, 0.55, 0.2, 1);
  k.flash('lamp', L(16), 0.85, 0.55, 0.2, 1);
  follow(ex1, -1.2, c1, 2, 0.6, 0xffe8d0);
  k.cam(c1, 14, { z: 8.0, ly: 1.05, x: 0.2, lx: 0.2 });

  // ---- the gap and verse 3: dusk, then night on the shore. Seonag lies down by the pot. She does not wake.
  const g3 = E('ch1');
  k.pop('folk', false, g3 + 1);
  k.leave('croft', g3, 3, 'in');
  sky(g3, 6, ...DUSK, [0.5, 0.6, 0.4], 0.13);
  night(g3 + 2, 6, 0.9);
  k.move('seonag.x', -1.1, g3, 3);
  hop('seonag', g3, 3);
  walk('ewan', g3, 3, -0.05);
  fire(g3, 0.55, -0.05 + 0.41, 0.6, -1.0, 3);
  walk('baby', g3, 3, 1.6);
  face('baby', g3 + 3.2, false);
  // She sits, then lies down. The marionette goes. The sleeping card comes up. The pot goes down by her hand.
  k.move('seonag.y', -0.3, g3 + 5, 2);
  k.move('seonag.rz', 20, g3 + 5, 2);
  k.pop('seonag', false, g3 + 7.2);
  k.enter('sleep', g3 + 6.4, 1.6, 'out');
  k.move('ewan.armA', 30, g3 + 6, 1.2);
  k.move('ewan.armB', 20, g3 + 6, 1.2);
  k.move('ewan.y', -0.2, g3 + 6, 1.2);
  k.move('ewan.rz', -8, g3 + 6, 1.2);
  // The sleeping card has the pot under her hand, so the carried pot goes.
  k.pop('pot', false, g3 + 7.2);
  fire(g3 + 6, 0.5, -0.3, 0.2, -1.0, 1.4);
  k.move('ewan.armA', 0, g3 + 8.6, 1);
  k.move('ewan.armB', 0, g3 + 8.6, 1);
  k.move('ewan.y', 0, g3 + 8.6, 1);
  k.move('ewan.rz', 0, g3 + 8.6, 1);
  walk('ewan', g3 + 8.8, 2.4, 0.55);
  k.move('ship.y', 0.34, g3, 6, 'sine');
  k.cam(g3, 12, { z: 7.4, ly: 0.85, x: -0.1, lx: -0.2 });
  follow(-0.4, -1.4, g3 + 4, 3, 0.4, 0xc8d4f0, 0.5);
  // 18–19 She slept the last night by the shore. Her hand upon the iron pot.
  tl.set('surtitles.i', 1, v3 - 1);
  k.flash('lamp', L(19) + 0.6, 0.75, 0.5, 0.3, 1.6);
  k.move('baby.rz', -4, L(18), 4, 'sine');
  k.move('baby.rz', 0, L(19), 4, 'sine');
  // 20 She did not wake to see the sail — grey dawn. Ewan kneels to her. His hand on her shawl.
  sky(L(20) - 2, 6, ...DAWN, [0.5, 0.6, 0.45], 0.15);
  grey(L(20) - 1, 5, 0.6, 0xe0e4f0);
  walk('ewan', L(20) - 1, 1.6, 0.0);
  face('ewan', L(20) - 1, true);
  face('ewan', L(20) + 0.4, false);
  k.move('ewan.y', -0.24, L(20) + 1, 1);
  k.move('ewan.rz', 10, L(20) + 1, 1);
  k.move('ewan.armB', -40, L(20) + 1.4, 1.2);
  k.move('ewan.head', -20, L(20) + 1.2, 1.4);
  walk('baby', L(20), 2.4, 0.85);
  k.move('baby.rz', 6, L(20) + 2.4, 1.2);
  follow(-0.3, -1.4, L(20), 1.4, 0.55, 0xe0e4f0, 0.5);
  k.cam(L(20), 6, { z: 6.9, ly: 0.75, x: -0.3, lx: -0.4 });
  // 21 We laid the hearthstone where she lay — the sleeping card goes down. The cairn rises with the hearthstone.
  k.leave('sleep', L(21) - 0.4, 2.2, 'in');
  k.enter('cairn', L(21) + 0.4, 2.6, 'out');
  // He takes up the pot.
  k.move('ewan.armB', 0, L(21), 0.8);
  k.move('ewan.y', 0, L(21) + 2.6, 1);
  k.move('ewan.rz', 0, L(21) + 2.6, 1);
  k.move('ewan.head', -6, L(21) + 2.6, 1);
  face('ewan', L(21) + 2.6, true);
  k.move('ewan.armA', 55, L(21) + 2.8, 1);
  k.move('ewan.armB', 50, L(21) + 2.8, 1);
  k.pop('pot', true, L(21) + 2.8);
  fire(L(21) + 2.8, 0.55, 0.41, 0.6, -1.0, 1);

  // ---- chorus 2: dawn. They walk to the boat. The cairn stays on the shore.
  sky(c2 - 1, 4, ...DAWN, [0.6, 0.7, 0.5], 0.16);
  grey(c2 - 1, 3, 0.8, 0xfff0e0);
  walk('ewan', c2, 10, 1.35, 'inOut');
  fire(c2, 0.6, 1.35 + 0.41, 0.6, -1.0, 10);
  walk('baby', c2 + 0.4, 10, 2.1, 'inOut');
  face('baby', c2 + 0.4, true);
  // 24 Mother, I carry it over the sea — he turns back once to the cairn and lifts the pot to it.
  face('ewan', L(24) - 0.2, false);
  k.move('ewan.armA', 120, L(24), 1, 'out');
  k.move('ewan.head', 10, L(24), 1);
  k.move('ewan.armA', 55, L(24) + 2, 1);
  k.move('ewan.head', 0, L(24) + 2, 1);
  face('ewan', L(24) + 2.2, true);
  k.flash('lamp', L(23), 0.85, 0.6, 0.2, 1);
  k.flash('lamp', L(26), 0.85, 0.6, 0.2, 1);
  follow(0.8, -1.2, c2, 3, 0.65, 0xfff0e0);
  k.cam(c2, 12, { z: 8.0, ly: 1.0, x: 0.4, lx: 0.4 });

  // ---- the bridge: the storm. The deck rises. The sea heaves. He holds the pot high above the wave. It goes out.
  k.pop('baby', false, st - 1.2);
  k.leave('cairn', st - 1.4, 1.6, 'in');
  k.leave('shore', st - 1.2, 1.8, 'in');
  k.move('ship.x', 3.8, st - 1.2, 1.8, 'in');
  k.pop('ship', false, st + 0.8);
  sky(st - 1, 1.4, ...STORM, [0.45, 0.5, 0.35], 0.1);
  night(st - 1, 1.4, 0.8);
  k.move('haze', 2.4, st - 1, 1.6);
  tl.base('clouds.sway', 1.8);
  k.enter('deck', st - 0.8, 1.6, 'out');
  k.enter('waves1', st - 0.8, 1.8, 'out');
  k.enter('waves2', st - 0.4, 1.8, 'out');
  // Ewan and Morag on the deck. Morag holds the baby at the left.
  set(st - 1, [['ewan.x', 0.35], ['ewan.y', 0.12], ['ewan.turn', 0]]);
  set(st - 1, [['baby.x', -0.85], ['baby.y', 0.12], ['baby.turn', 0], ['baby.rz', 0]]);
  k.pop('baby', true, st - 0.6);
  k.move('ewan.armA', 168, st + 0.4, 1.2, 'out');
  k.move('ewan.armB', 160, st + 0.5, 1.2, 'out');
  k.move('ewan.head', 14, st + 0.4, 1.2);
  fire(st + 0.4, 0.75, 0.54, 1.25, -1.0, 1.2);
  // The sea heaves and the deck rolls on the beat. Spray and lightning.
  k.downbeats(st, L(33) + 1).forEach((b, i) => {
    const roll = i % 2 ? 4 : -4;
    k.move('deck.rz', roll, b, BEAT * 1.8, 'sine');
    k.move('waves1.y', i % 2 ? 0.28 : 0.08, b, BEAT * 1.8, 'sine');
    k.move('waves2.y', i % 2 ? -0.28 : -0.08, b, BEAT * 1.8, 'sine');
    k.move('waves2.x', i % 2 ? 0.15 : -0.15, b, BEAT * 1.8, 'sine');
    k.move('baby.rz', roll * 1.5, b, BEAT * 1.8, 'sine');
    k.move('ewan.rz', -roll, b, BEAT * 1.8, 'sine');
  });
  [st + 1.2, L(29) + 0.4, L(30) - 0.5, L(31) + 2, L(32)].forEach((t) => k.flash('back', t, 1, 0.25, 0.03, 0.5));
  smoke(st, 0.6, 0, 0.3, -0.8, 2);
  follow(0.4, -1.2, st, 1.2, 0.55, 0xc8d4f0, 1.3);
  k.cam(st, 10, { z: 7.6, ly: 1.25, x: 0.1, lx: 0.1 });
  // 30–31 I held it high above the wave — the great wave rolls in from the right and rears over him.
  set(0, [['wave.x', 3.8]]);
  k.pop('wave', true, L(30) - 1);
  k.move('wave.x', 2.0, L(30) - 1, 2.4, 'out');
  k.move('wave.x', 1.4, L(31), 3, 'inOut');
  k.move('wave.y', -0.05, L(31), 3, 'inOut');
  k.flash('lamp', L(31) + 0.4, 1, 0.75, 0.2, 1.2);
  k.cam(L(30), 8, { z: 7.0, ly: 1.35, x: 0.4, lx: 0.5 });
  // 33 And the fire went out — the wave breaks over him. White. Then the ember is dark.
  k.move('wave.x', 0.3, L(33) - 1.2, 1, 'in');
  k.move('wave.y', -0.3, L(33) - 1.2, 1, 'in');
  k.move('smoke.i', 1, L(33) - 0.4, 0.4);
  k.flash('back', L(33) - 0.3, 1, 0.6, 0.05, 1.2);
  k.look(L(33) - 0.2, 0.3, { lamp: 0 });
  tl.set('pot.glow', 0, L(33) - 0.2);
  k.move('wave.x', -3.8, L(33) + 0.2, 2.2, 'out');
  k.pop('wave', false, L(33) + 2.6);
  k.move('ewan.rz', 0, L(33) + 0.6, 1);
  k.move('ewan.armA', 120, L(33) + 1.2, 1.4);
  k.move('ewan.armB', 112, L(33) + 1.2, 1.4);

  // ---- the break: the sea goes quiet. One cold beam. He lowers the dark pot. He looks into it.
  k.move('smoke.i', 0.2, brk, 3);
  k.move('haze', 1.4, brk, 6);
  tl.base('clouds.sway', 0.4);
  k.move('waves1.y', 0.12, brk, 6, 'inOut');
  k.move('waves2.y', -0.2, brk, 6, 'inOut');
  k.move('waves2.x', 0, brk, 6, 'inOut');
  k.move('deck.rz', 0, brk, 4, 'inOut');
  k.move('baby.rz', 0, brk, 4, 'inOut');
  sky(brk, 4, ...NIGHT, [0.35, 0.4, 0.3], 0.1);
  night(brk, 3, 0.5);
  follow(0.35, -1.2, brk, 3, 0.55, 0xb8c8e8, 0.9);
  k.move('ewan.armA', 60, brk + 1, 3);
  k.move('ewan.armB', 52, brk + 1, 3);
  k.move('ewan.head', -22, brk + 2.5, 3);
  k.move('ewan.rz', 6, brk + 3, 3);
  // Morag comes to him. She lays her hand on his arm.
  walk('baby', brk + 6, 3, -0.15);
  k.cam(brk, 14, { z: 6.9, ly: 1.0, x: 0.1, lx: 0.1 });
  k.leave('waves2', v4 - 5, 3, 'in');
  k.leave('deck', v4 - 4.6, 3, 'in');
  k.leave('waves1', v4 - 4.4, 3, 'in');
  k.leave('clouds', v4 - 5, 3, 'in');
  k.pop('baby', false, v4 - 2.2);
  k.pop('ewan', false, v4 - 2.2);
  k.pop('pot', false, v4 - 2.2);

  // ---- verse 4: snow on a shore with no name. Morag strikes the flint again and again. He cups his hands.
  k.enter('newshore', v4 - 3, 3, 'out');
  sky(v4 - 3, 4, ...SNOW, [0.45, 0.5, 0.38], 0.12);
  night(v4 - 2.4, 3, 0.75);
  snow(v4 - 3, 0.5, 3);
  k.move('haze', 1.0, v4 - 3, 4);
  tl.set('surtitles.i', 1, v4 - 1);
  set(v4 - 2.4, [['morag.x', 0.45], ['morag.y', -0.26], ['morag.rz', -8], ['morag.turn', 0], ['morag.head', -14], ['morag.armA', -40], ['morag.armB', -30]]);
  set(v4 - 2.4, [['ewan.x', -0.55], ['ewan.y', -0.24], ['ewan.rz', 10], ['ewan.turn', 0], ['ewan.head', -18], ['ewan.armA', 40], ['ewan.armB', 30]]);
  k.pop('morag', true, v4 - 1.8);
  k.pop('ewan', true, v4 - 1.6);
  follow(0, -1.25, v4 - 1.5, 2, 0.45, 0xb8c4dc, 0.5);
  k.cam(v4 - 2, 8, { z: 7.2, ly: 0.8, x: 0, lx: 0 });
  // 36 I struck the flint, I struck again — her near arm strikes down on each beat. Sparks.
  for (let t = L(35) + 1, i = 0; t < L(37) + 0.6; t += BEAT, i++) {
    k.move('morag.armA', -95, t, BEAT * 0.4, 'out');
    k.move('morag.armA', -40, t + BEAT * 0.45, BEAT * 0.5, 'inOut');
    if (i % 2 === 0) {
      tl.set('lamp.x', 0.0, t).set('lamp.y', 0.2, t).set('lamp.z', -1.1, t);
      k.flash('lamp', t + BEAT * 0.35, 0.18 + i * 0.015, 0.04, 0.02, 0.2);
    }
  }
  k.cam(L(36), 6, { z: 6.6, ly: 0.7, x: 0, lx: 0 });
  // 37 He cupped his hands around the spark — the puppets give way to the kneeling pair. A spark catches.
  k.pop('morag', false, L(37) + 0.6);
  k.pop('ewan', false, L(37) + 0.6);
  k.enter('kneel', L(37) + 0.2, 0.8, 'out');
  fire(L(37) + 1.2, 0.2, 0.15, 0.22, -1.05, 2.4);

  // ---- final chorus: the new fire grows. Snow falls. They kneel at it with the baby.
  fire(c3 - 1, 0.55, 0.15, 0.25, -1.05, 6);
  follow(0.1, -1.25, c3 - 1, 4, 0.6, 0xffc890, 0.5);
  k.look(c3, 6, { fohL: [0.2, 0xffd0a0], fohR: [0.16, 0xffc890] });
  k.flash('lamp', L(38) + 1, 0.8, 0.55, 0.3, 1.4);
  k.flash('lamp', L(40) + 1, 0.85, 0.6, 0.3, 1.4);
  k.flash('lamp', L(42) + 1, 0.9, 0.65, 0.3, 1.4);
  k.cam(c3, 12, { z: 7.0, ly: 0.75, x: 0.1, lx: 0.1 });
  // 43–44 The fire she gave us is gone — the new fire sinks low on the choir, then holds.
  k.look(L(43), 1.4, { lamp: [0.3, 0xff9a40] });
  k.look(L(44) + 1.4, 2, { lamp: [0.55, 0xff9a40] });
  k.cam(L(43), 6, { z: 6.6, ly: 0.7, x: 0.1, lx: 0.1 });
  // 45 Keep the fire — one more time. The new fire burns.
  k.flash('lamp', L(45) + 0.6, 1, 0.7, 0.4, 2);
  k.cam(L(45), 6, { z: 7.2, ly: 0.8, x: 0.1, lx: 0.1 });

  // ---- outro: Cùm an teine, a ghràidh. The new shore goes. The glen across the sea: roofless walls, no smoke.
  k.leave('newshore', out - 2, 4, 'in');
  k.enter('glen', out - 1.5, 4, 'out');
  k.move('croft.s', 1, out - 2, 0.01);
  k.move('croft.x', CROFT.x, out - 2, 0.01);
  k.enter('croft', out - 1.2, 4, 'out');
  sky(out - 2, 6, ...MIST, [0.4, 0.45, 0.35], 0.14);
  grey(out - 1, 5, 0.5, 0xd8dce4);
  snow(out - 2, 0.2, 4);
  k.move('haze', 1.6, out - 2, 6);
  // The kneeling pair stays downstage at their small fire.
  fire(out, 0.5, 0.15, 0.25, -1.05, 4);
  follow(0.1, -1.25, out, 3, 0.5, 0xffc890, 0.5);
  k.cam(out, 18, { z: 8.4, ly: 1.0, x: -0.3, lx: -0.4 });
  // 47 the second call. The far walls darken.
  k.look(L(47), 6, { back: [0.12, 0x6a7890] });
  k.cam(L(47), 10, { z: 7.6, ly: 0.85, x: 0, lx: 0 });

  // ---- the end: the traveller closes on the fire. In the call, Ewan and Morag bow together.
  tl.set('surtitles.i', 0, end - 3.6);
  k.cam(end - 4.8, 4.2, { z: 9.4, x: 0, lx: 0, y: 0.95, ly: 1.05 });
  k.move('curtain.open', 0, end - 3.8, 3.4, 'inOut');
  k.look(end - 1, 2, { follow: 0, house: 0.25, lamp: 0 });
  k.move('snow.rate', 0, end - 1, 0.5);
  k.pop('kneel', false, end - 1.5);
  for (const [ch, v] of [['ewan.x', -0.45], ['ewan.y', 0], ['ewan.z', 0.8], ['ewan.head', 0], ['ewan.armA', 0], ['ewan.armB', 0], ['ewan.turn', 0], ['ewan.rz', 0], ['ewan.s', 1]] as const) k.move(ch, v, end - 1.9, 0.01);
  for (const [ch, v] of [['morag.x', 0.45], ['morag.y', 0], ['morag.z', 0.75], ['morag.head', 0], ['morag.armA', 0], ['morag.armB', 0], ['morag.turn', 0], ['morag.rz', 0], ['morag.s', 1]] as const) k.move(ch, v, end - 1.9, 0.01);
  k.pop('ewan', true, end - 1.8);
  k.pop('morag', true, end - 1.8);
  k.move('curtain.open', 0.5, end + 0.8, 1.6, 'out');
  k.look(end + 0.6, 0.8, { follow: [0.7, 0xffe6c4] });
  k.aim('follow', 0, 1.0, -0.5, end + 0.5, 0.01);
  k.move('ewan.rz', -18, end + 2.4, 0.5);
  k.move('morag.rz', 18, end + 2.4, 0.5);
  k.move('ewan.rz', 0, end + 3, 0.5);
  k.move('morag.rz', 0, end + 3, 0.5);
  k.move('curtain.open', 0, end + 4.2, 1.8, 'inOut');
  k.look(end + 4.6, 1.5, { follow: 0, house: 0.7 });
}

const production: Production = {
  id: 'cum-an-teine',
  no: 15,
  title: { gd: 'Cùm an Teine', en: 'Keep the Fire', id: 'Jagalah Api', zh: '守住炉火' },
  poster: urls['./art/cut/poster.webp']!,
  audio,
  master,
  pieces,
  curtain: { open: 'traveller', close: 'traveller' },
  preroll: 7,
  postroll: 7,
  surtitles: { main: 'en', second: 'id' },
  bill: {
    about: 'The story takes place in the Scottish Highlands in 1845. The estate clears the glen. Seonag gives her son Ewan the last ember of the hearth fire. The family crosses the sea. Ewan and Morag sing in English, with a Gaelic refrain.',
    cast: [['Ewan, the crofter', 'Voice'], ['Morag, his wife', 'Voice'], ['Seonag, his mother', 'On strings'], ['The women of the glen', 'Chorus']],
    scenes: ['The glen', 'The clearance', 'The shore', 'The storm', 'The new shore'],
  },
  voices: {
    ewan: { name: 'Ewan', color: '#e0e4ec' },
    morag: { name: 'Morag', color: '#ecdcd8' },
    choir: { name: 'The women of the glen', color: '#e4dcc8' },
    both: { name: 'Ewan · Morag', color: '#ece2dc' },
  },
  cues,
};

export default production;
