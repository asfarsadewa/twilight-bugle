// Show XI: a coal miner gives his daughter a sky; she brings it into his hands.
import type { Art, Master, PartSpec, PieceSpec, Production, Pt } from '../../theatre/src/core/types.ts';
import { cues, MARKS } from './cues.ts';
import masterJson from './song/master.json';
import audio from './song/master.mp3?url';
import rigJson from './art/rig.json';

const master = masterJson as unknown as Master;
const urls = import.meta.glob('./art/cut/*.webp', { eager: true, query: '?url', import: 'default' }) as Record<string, string>;
type Cut = Art & { file: string; normal?: string };
const metas = import.meta.glob('./art/cut/*.json', { eager: true, import: 'default' }) as Record<string, Cut & { parts?: Cut[] }>;
const withUrls = (m: Cut): Art => ({ ...m, url: urls[`./art/cut/${m.file}`]!, normalUrl: m.normal ? urls[`./art/cut/${m.normal}`] : undefined });
const art = (name: string): Art => withUrls(metas[`./art/cut/${name}.json`]!);
const part = (name: string, i: number): Art => withUrls(metas[`./art/cut/${name}.json`]!.parts![i]!);
const p = (a: Art, pivot: Pt, rest: Partial<PartSpec> = {}, scale = 1): PartSpec => ({ art: a, sheet: [a.w * scale, a.h * scale], pivot, ...rest });
type Joint = { index: number; pivot: Pt; attach?: Pt; z?: number; rest?: number; string?: Pt; scale?: number };
type Name = 'body' | 'head' | 'armA' | 'armB';
const rig = rigJson as unknown as {
  daughter: Record<Name, Joint>; father: Record<Name, Joint>;
  daughterSeat: { reused_part_scale: number; head_attach: Pt; armA_attach: Pt; armB_attach: Pt };
  body_heights: { daughter: number; father: number; daughterSeat: number };
};
function joint(person: 'daughter' | 'father', name: Name): PartSpec {
  const { index, pivot, scale, ...rest } = rig[person][name];
  return p(part(`puppet-${person === 'father' ? 'father-seat' : 'daughter'}`, index), pivot, rest, scale ?? 1);
}
function seated(name: 'head' | 'armA' | 'armB'): PartSpec {
  const j = joint('daughter', name);
  return { ...j, sheet: j.sheet.map(v => v * rig.daughterSeat.reused_part_scale) as Pt, attach: rig.daughterSeat[`${name}_attach`] };
}

const pieces: PieceSpec[] = [
  { id: 'town', kind: 'flat', art: art('flat-town'), width: 6.1, home: { x: 0, y: -0.35, z: -3.45 }, route: 'fly', startIn: true, glow: 0.02 },
  { id: 'dome', kind: 'flat', art: art('flat-dome'), width: 5.9, home: { x: 0, y: -0.6, z: -3.35 }, route: 'fly' },
  { id: 'mine', kind: 'flat', art: art('flat-mine'), width: 4.5, home: { x: -0.4, y: -0.3, z: -2.85 }, route: 'fly' },
  { id: 'beam', kind: 'prop', art: art('prop-beam'), width: 2.1, home: { x: -0.65, y: 1.23, z: -2.3 }, route: 'fly' },
  { id: 'miner', kind: 'prop', art: art('prop-miner'), height: 1.4, home: { x: -1.3, y: 0, z: -1.95 }, route: 'left', slide: 'left', rod: true },
  { id: 'projector', kind: 'prop', art: art('prop-projector'), height: 0.55, home: { x: 0, y: 0.15, z: -2.3 }, route: 'trap', rod: true, glow: 0.08 },
  { id: 'childhood', kind: 'prop', art: art('prop-childhood'), width: 2.5, home: { x: -0.8, y: 0, z: -2.2 }, route: 'left', slide: 'left' },
  { id: 'telescope', kind: 'prop', art: art('prop-telescope'), height: 1.15, home: { x: 1.7, y: 0, z: -1.55 }, route: 'trap', rod: true },
  { id: 'fatherCane', kind: 'prop', art: art('prop-father-cane'), height: 1.35, home: { x: -1.2, y: 0, z: -1.2 }, route: 'left', slide: 'left', rod: true },
  { id: 'father', kind: 'puppet', home: MARKS.father, route: 'left', puppet: { height: rig.body_heights.father, faces: 'right', body: joint('father', 'body'), head: joint('father', 'head'), armA: joint('father', 'armA'), armB: joint('father', 'armB') } },
  { id: 'daughter', kind: 'puppet', home: MARKS.daughter, route: 'right', puppet: { height: rig.body_heights.daughter, faces: 'left', body: joint('daughter', 'body'), head: joint('daughter', 'head'), armA: joint('daughter', 'armA'), armB: joint('daughter', 'armB') } },
  { id: 'daughterSeat', kind: 'puppet', home: MARKS.daughterSeat, route: 'right', puppet: { height: rig.body_heights.daughterSeat, faces: 'left', body: p(art('body-daughter-seat'), [0.5, 1]), head: seated('head'), armA: seated('armA'), armB: seated('armB') } },
  { id: 'letter', kind: 'prop', art: art('prop-letter'), width: 0.3, anchor: 'center', home: { x: 0.7, y: 0.85, z: -1.16 }, route: 'trap', rod: true },
  { id: 'certificate', kind: 'prop', art: art('prop-certificate'), width: 0.44, anchor: 'center', home: { x: 0, y: 0.975, z: -1.23 }, route: 'trap', rod: true },
  { id: 'audienceL', kind: 'flat', art: art('flat-audience'), width: 2.6, home: { x: -1.8, y: -0.18, z: -0.45 }, route: 'left', slide: 'left' },
  { id: 'audienceR', kind: 'flat', art: art('flat-audience'), width: 2.6, home: { x: 1.8, y: -0.18, z: -0.5 }, route: 'right', slide: 'right', mirror: true },
  { id: 'hands', kind: 'prop', art: art('prop-hands'), width: 1.9, home: { x: -0.15, y: 0.12, z: -0.25 }, route: 'trap', rod: true },
];

const production: Production = {
  id: 'the-sky-you-gave-me', no: 11,
  title: { zh: '你给我的星空', en: 'The Sky You Gave Me', id: 'Langit yang Kauberikan' },
  poster: urls['./art/cut/poster.webp']!, audio, master, pieces,
  curtain: { open: 'tableau', close: 'traveller' }, preroll: 7, postroll: 9,
  surtitles: { main: 'zh', second: 'id' },
  bill: {
    about: 'A coal miner traces stars into his little daughter’s palm. A mine collapse takes his sight. Years later, she reserves the best seat in her planetarium for him, then switches off its stars and brings their stories into his hands.',
    cast: [['The daughter', 'Voice · strings'], ['Her father', 'Strings · cane'], ['Father & child', 'Memory · slide'], ['The audience', 'Slide wires']],
    scenes: ['The kitchen lamp', 'His road into the mountain', 'The fallen mine support', 'A telescope and a white cane', 'The best seat under the stars', 'The sky in his palm'],
  },
  voices: { daughter: { name: '女儿 · Daughter', color: '#eee1c8' } },
  cues,
};
export default production;
