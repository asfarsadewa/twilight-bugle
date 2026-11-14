// 형은 여기 있다 · Your Brother Is Here · Kakak Ada di Sini
// Show X. The user-approved Suno recording drives the clock and all 36 lyric cues.
// War forces the crossing and cuts the bridge. The river stays as the two banks enter an unequal peace.
// Min appears only in memory. Nobody crosses to answer the older Cheol in the present.

import type { Art, Master, PartSpec, PieceSpec, Production, Pt } from '../../theatre/src/core/types.ts';
import { cues, MARKS } from './cues.ts';
import masterJson from './song/master.json';
import audio from './song/master.mp3?url';
import elderCalibration from './art/puppet-elder-rig.json';

const master = masterJson as unknown as Master;
const urls = import.meta.glob('./art/cut/*.webp', { eager: true, query: '?url', import: 'default' }) as Record<string, string>;
type Cut = Art & { file: string; normal?: string };
const metas = import.meta.glob('./art/cut/*.json', { eager: true, import: 'default' }) as Record<string, Cut & { parts?: Cut[] }>;
const withUrls = (m: Cut): Art => ({ ...m, url: urls[`./art/cut/${m.file}`]!, normalUrl: m.normal ? urls[`./art/cut/${m.normal}`] : undefined });
const art = (name: string): Art => withUrls(metas[`./art/cut/${name}.json`]!);
const part = (name: string, i: number): Art => withUrls(metas[`./art/cut/${name}.json`]!.parts![i]!);
const p = (a: Art, pivot: Pt, rest: Partial<PartSpec> = {}, scale = 1): PartSpec => ({ art: a, sheet: [a.w * scale, a.h * scale], pivot, ...rest });

type JointCalibration = { index: number; pivot: Pt; attach?: Pt; z?: number; rest?: number; string?: Pt; scale?: number };
const calibrated = elderCalibration as unknown as Record<'body' | 'head' | 'armA' | 'armB', JointCalibration>;
function elderPart(name: keyof typeof calibrated): PartSpec {
  const { index, pivot, scale, ...rest } = calibrated[name];
  return p(part('puppet-elder', index), pivot, rest, scale ?? 1);
}

const { old: OLD, young: YOUNG, min: MIN } = MARKS;

const pieces: PieceSpec[] = [
  { id: 'hills', kind: 'flat', art: art('flat-hills'), width: 6.6, home: { x: 0, y: -0.35, z: -3.65 }, route: 'fly', startIn: true },
  { id: 'city', kind: 'flat', art: art('flat-city'), width: 2.75, home: { x: -1.7, y: 0.44, z: -3.3 }, route: 'fly', glow: 0.03 },
  { id: 'farBank', kind: 'flat', art: art('flat-far-bank'), width: 3.45, home: { x: 1.35, y: 0.34, z: -3.15 }, route: 'fly', glow: 0.015 },
  { id: 'villageThen', kind: 'flat', art: art('flat-village'), width: 5.5, home: { x: 0, y: -0.2, z: -3.25 }, route: 'fly', startIn: true },
  { id: 'lineA', kind: 'flat', art: art('prop-line-a'), width: 2.0, home: { x: -1.65, y: 0.1, z: -1.9 }, route: 'left', slide: 'left', startIn: true },
  { id: 'lineB', kind: 'flat', art: art('prop-line-b'), width: 2.2, home: { x: 1.65, y: 0.1, z: -1.85 }, route: 'right', slide: 'right', startIn: true },
  { id: 'bridge', kind: 'flat', art: art('flat-bridge'), width: 5.7, home: { x: 0, y: 0.03, z: -2.45 }, route: 'fly' },
  { id: 'waves2', kind: 'flat', art: art('flat-river'), width: 6.7, home: { x: 0.12, y: -1.23, z: -2.3 }, route: 'trap', rod: true, mirror: true, startIn: true },
  { id: 'quietRiver', kind: 'flat', art: art('flat-river-dusk'), width: 6.7, height: 0.6, home: { x: 0, y: -0.18, z: -2.25 }, route: 'trap', rod: true },
  { id: 'refugees', kind: 'flat', art: art('flat-refugees'), width: 3.6, home: { x: 0, y: 0.12, z: -2.1 }, route: 'left', slide: 'left', mirror: true },
  { id: 'march', kind: 'flat', art: art('prop-march-a'), width: 2.8, home: { x: 0, y: 0.18, z: -2.0 }, route: 'right', slide: 'right', mirror: true },
  { id: 'waves1', kind: 'flat', art: art('flat-river'), width: 6.7, home: { x: -0.12, y: -1.47, z: -1.95 }, route: 'trap', rod: true, startIn: true },
  { id: 'uniform', kind: 'prop', art: art('prop-far'), height: 1.32, home: { x: OLD.x, y: 0, z: -1.25 }, route: 'trap', rod: true, startIn: true },
  { id: 'mother', kind: 'prop', art: art('prop-mother'), height: 0.9, home: { x: 2.05, y: 0.12, z: -1.8 }, route: 'right', slide: 'right', mirror: true },
  { id: 'brokenL', kind: 'prop', art: art('prop-bridgehead'), width: 1.2, home: { x: -0.7, y: -0.04, z: -1.75 }, route: 'trap', rod: true, mirror: true, startIn: true },
  { id: 'brokenR', kind: 'prop', art: art('prop-bridgehead'), width: 1.2, home: { x: 1.8, y: 0.0, z: -1.85 }, route: 'trap', rod: true, startIn: true },
  {
    id: 'min', kind: 'puppet', home: MIN, route: 'fly', startIn: true,
    puppet: {
      height: 0.98, faces: 'right',
      body: p(part('puppet-min', 0), [0.5, 1]),
      head: p(part('puppet-min', 1), [0.439, 0.901], { attach: [0.624, 0.045], z: -0.6, string: [0.5, 0.05] }, 0.75),
      armA: p(part('puppet-min', 2), [0.733, 0.08], { attach: [0.352, 0.087], z: 1, string: [0.3, 0.95] }),
      armB: p(part('puppet-min', 3), [0.357, 0.114], { attach: [0.89, 0.087], z: 1.1, mirror: true, string: [0.85, 0.8] }),
    },
  },
  {
    id: 'young', kind: 'puppet', home: YOUNG, route: 'fly',
    puppet: {
      height: 1.04, faces: 'left',
      body: p(part('puppet-cheol', 1), [0.5, 1]),
      head: p(part('puppet-cheol', 0), [0.593, 0.896], { attach: [0.513, 0.05], z: -0.6, string: [0.5, 0.05] }, 0.75),
      armA: p(part('puppet-cheol', 2), [0.332, 0.089], { attach: [0.748, 0.115], z: 1, string: [0.6, 0.93] }),
      armB: p(part('puppet-cheol', 3), [0.871, 0.107], { attach: [0.278, 0.115], z: 1.1, string: [0.1, 0.75] }),
    },
  },
  { id: 'rice', kind: 'prop', art: art('prop-rice'), width: 0.18, anchor: 'center', home: { x: 0.82, y: 0.96, z: -1.25 }, route: 'trap', rod: true },
  { id: 'elder', kind: 'puppet', home: OLD, route: 'left', puppet: { height: 1.0, faces: 'right', body: elderPart('body'), head: elderPart('head'), armA: elderPart('armA'), armB: elderPart('armB') } },
  { id: 'reedsL', kind: 'prop', art: art('prop-reeds'), height: 0.78, home: { x: -2.4, y: -0.06, z: -0.65 }, route: 'left', slide: 'left', startIn: true },
  { id: 'reedsR', kind: 'prop', art: art('prop-reeds'), height: 0.62, home: { x: 2.45, y: -0.06, z: -0.65 }, route: 'right', slide: 'right', mirror: true, startIn: true },
  { id: 'bank', kind: 'flat', art: art('flat-bank'), width: 6.8, home: { x: 0, y: -0.25, z: -0.5 }, route: 'left', slide: 'left', startIn: true },
  { id: 'promenade', kind: 'flat', art: art('flat-promenade'), width: 4.3, home: { x: -1.05, y: 0, z: -0.48 }, route: 'left', slide: 'left', glow: 0.02 },
];

const production: Production = {
  id: 'are-you-still-there',
  no: 10,
  title: { ko: '형은 여기 있다', en: 'Your Brother Is Here', id: 'Kakak Ada di Sini', zh: '哥在这里' },
  poster: urls['./art/cut/poster.webp']!,
  audio,
  master,
  pieces,
  curtain: { open: 'traveller', close: 'traveller' },
  preroll: 7,
  postroll: 9,
  surtitles: { main: 'ko', second: 'id' },
  bill: {
    about: 'War drove Chol across a refugee bridge; Min stayed and cut the crossing. Decades later, Chol calls from a developed bank towards the dim rural shore. The river and a locked gate still divide them.',
    cast: [['Older Chol', 'Voice · strings'], ['Min at nineteen', 'Memory · strings'], ['Young Chol', 'Memory · strings'], ['Their mother', 'Slide'], ['Refugees & troops', 'Slide wires']],
    scenes: ['Two armies, a broken crossing', 'Unequal shores at dusk', 'Refugees against the marching column', 'Min severs the bridge', 'War becomes a divided peace', 'The unanswered river'],
  },
  voices: { cheol: { name: 'Chol', color: '#eed7b6' } },
  cues,
};

export default production;
