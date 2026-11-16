// Show XII. Two living marionettes perform the last night of a travelling theatre. The same phrase changes
// from rivalry to reciprocal balance to farewell. The score is the producer's supplied, unchanged recording.
import type { Art, CueContext, Master, PartSpec, PieceSpec, Production, Pt, PuppetJoint, PuppetSpec } from '../../theatre/src/core/types.ts';
import { cueKit } from '../../theatre/src/core/cuekit.ts';
import { curtainStyleIndex } from '../../theatre/src/house/curtain.ts';
import masterJson from './song/master.json';
import audio from './song/master.mp3?url';
import rigJson from './art/rig.json';
import { DEPTH, GROUND, perform } from './choreography.ts';

const master = masterJson as unknown as Master;
const urls = import.meta.glob('./art/cut/*.webp', { eager: true, query: '?url', import: 'default' }) as Record<string, string>;
type Cut = Art & { file: string; normal?: string };
const metas = import.meta.glob('./art/cut/*.json', { eager: true, import: 'default' }) as Record<string, Cut & { parts?: Cut[] }>;
const withUrls = (m: Cut): Art => ({ ...m, url: urls[`./art/cut/${m.file}`]!, normalUrl: m.normal ? urls[`./art/cut/${m.normal}`] : undefined });
const art = (n: string) => withUrls(metas[`./art/cut/${n}.json`]!);
const part = (n: string, i: number) => withUrls(metas[`./art/cut/${n}.json`]!.parts![i]!);
interface Calibrated { sheet: string; index: number; height: number; pivot: Pt; attach?: Pt; z?: number; parent?: PuppetJoint; string?: Pt; end?: Pt }
interface CastRig { height: number; bodyOffset: number; parts: Record<string, Calibrated> }
const rigs = rigJson as unknown as Record<'dancer' | 'clown', CastRig>;
const CAST_THICKNESS = .02;
const contactSurface = (who: 'dancer' | 'clown', upper: string, lower: string, side: 'A' | 'B') =>
  (rigs[who].parts[`${upper}${side}`]!.z! + rigs[who].parts[`${lower}${side}`]!.z!) * CAST_THICKNESS * 2.2 + .016;
function puppet(who: 'dancer' | 'clown'): PuppetSpec {
  const r = rigs[who], body = r.parts.body!, b = part(body.sheet, body.index);
  const pieces = Object.fromEntries(Object.entries(r.parts).map(([name, p]) => {
    const a = part(p.sheet, p.index), h = p.height / r.height * b.h;
    return [name, { art: a, sheet: [h * a.aspect, h] as Pt, pivot: p.pivot, attach: p.attach, z: p.z, parent: p.parent, string: p.string, mirror: name === 'head' && who === 'clown' } satisfies PartSpec];
  }));
  return {
    ...pieces, body: pieces.body!, height: r.height, bodyOffset: r.bodyOffset, faces: who === 'clown' ? 'left' : 'right', life: 0,
    chains: [
      { upper: 'armA', lower: 'foreA', end: r.parts.foreA!.end!, target: 'handA', bend: who === 'dancer' ? 1 : -1 },
      { upper: 'armB', lower: 'foreB', end: r.parts.foreB!.end!, target: 'handB', bend: who === 'clown' ? -1 : 1 },
      { upper: 'thighA', lower: 'shinA', end: r.parts.shinA!.end!, target: 'footA', bend: 1 },
      { upper: 'thighB', lower: 'shinB', end: r.parts.shinB!.end!, target: 'footB', bend: -1 },
    ],
  };
}
const palm = (who: 'dancer' | 'clown', side: 'A' | 'B') => rigs[who].parts[`fore${side}`]!.end!;
const grip = (who: 'dancer' | 'clown', side: 'A' | 'B', pin: Pt) => ({ piece: who, part: `fore${side}`, point: palm(who, side), pin });

const pieces: PieceSpec[] = [
  { id: 'cloudL', kind: 'flat', art: art('cloud-wing'), height: 1.8, width: .65, home: { x: -2.08, y: GROUND, z: -2.1 }, route: 'left', slide: 'left', startIn: true },
  { id: 'cloudR', kind: 'flat', art: art('cloud-wing'), height: 1.8, width: .65, mirror: true, home: { x: 2.08, y: GROUND, z: -2.12 }, route: 'right', slide: 'right', startIn: true },
  { id: 'canopy', kind: 'flat', art: art('canopy'), width: 5.4, height: .52, anchor: 'center', home: { x: 0, y: 2.08, z: -2.05 }, route: 'fly', startIn: true, strings: [[.08, .12], [.5, .08], [.92, .12]] },
  { id: 'crossbar', kind: 'prop', art: art('support'), height: 3.2, anchor: 'center', home: { x: .12, y: 1.90, z: -2.25 }, route: 'fly', startIn: true, strings: [[.5, .04], [.5, .96]] },
  { id: 'support', kind: 'prop', art: art('support'), height: 1.65, home: { x: 1.20, y: GROUND, z: -1.8 }, route: 'fly', startIn: true, strings: [[.5, .03]] },
  { id: 'ladder', kind: 'prop', art: art('ladder'), height: 1.05, home: { x: 1.55, y: GROUND, z: -1.64 }, route: 'right', startIn: true, slide: 'right' },
  ...[-1.84, -.92, 0, .92, 1.84].map((x, i): PieceSpec => ({ id: `board${i}`, kind: 'flat', art: art('platform'), width: .93, height: GROUND, thick: .80, home: { x, y: 0, z: -1.12 }, route: i < 2 ? 'left' : 'right', slide: i < 2 ? 'left' : 'right', startIn: true })),
  { id: 'step', kind: 'prop', art: art('platform'), width: .62, height: .18, thick: .55, home: { x: -.22, y: GROUND, z: -1.05 }, route: 'trap', startIn: true, rod: true },
  { id: 'hem', kind: 'prop', art: art('canopy'), width: .80, height: .08, home: { x: .58, y: GROUND + .01, z: -1.18 }, route: 'right', startIn: true, shadow: false },
  { id: 'dancer', kind: 'puppet', home: { x: 0, y: GROUND, z: DEPTH }, route: 'right', startIn: true, thick: CAST_THICKNESS, puppet: puppet('dancer') },
  { id: 'clown', kind: 'puppet', home: { x: 0, y: GROUND, z: DEPTH }, route: 'right', startIn: true, thick: CAST_THICKNESS, puppet: puppet('clown') },
  { id: 'stool', kind: 'prop', art: art('stool'), height: .32, home: { x: 0, y: GROUND, z: -1.14 }, route: 'left', startIn: true, grip: grip('dancer', 'B', [.5, .10]) },
  { id: 'broom', kind: 'prop', art: art('broom'), height: .90, home: { x: 0, y: GROUND, z: -1.12 }, route: 'right', startIn: true, grip: grip('clown', 'B', [.5, .45]) },
  { id: 'broomD', kind: 'prop', art: art('broom'), height: .90, home: { x: 0, y: GROUND, z: -1.12 }, route: 'right', grip: grip('dancer', 'B', [.5, .45]) },
  { id: 'trunk', kind: 'prop', art: art('trunk'), width: .75, height: .36, home: { x: 0, y: GROUND, z: -1.12 }, route: 'right', startIn: true, grip: { ...grip('clown', 'B', [.05, .40]), z: -.025 } },
  { id: 'hat', kind: 'prop', art: art('hat'), height: .15, anchor: 'center', home: { x: 0, y: GROUND, z: -1.08 }, route: 'right', startIn: true, grip: grip('clown', 'A', [.5, .55]) },
  { id: 'hatParked', kind: 'prop', art: art('hat'), height: .15, anchor: 'center', home: { x: 0, y: GROUND, z: -1.05 }, route: 'right', grip: { piece: 'trunk', part: 'body', point: [.52, .03], pin: [.5, .8], z: .03 } },
  { id: 'fold', kind: 'prop', art: art('ribbon-fold'), width: .22, home: { x: 0, y: GROUND, z: -1.10 }, route: 'right', grip: grip('dancer', 'A', [.5, .5]) },
  { id: 'sash', kind: 'ribbon', home: { x: 0, z: 0 }, route: 'fly', startIn: true, tether: { from: { piece: 'dancer', part: 'body', point: [.64, .46] }, to: { piece: 'dancer', part: 'foreB', point: palm('dancer', 'B') }, color: 0x86352d, width: .055, sag: .20 } },
  { id: 'safety', kind: 'ribbon', home: { x: 0, z: 0 }, route: 'fly', tether: { from: { piece: 'dancer', part: 'foreB', point: palm('dancer', 'B') }, to: { piece: 'clown', part: 'foreA', point: palm('clown', 'A') }, color: 0x983c31, width: .055, sag: .04 } },
];

function cues({ tl, line }: CueContext) {
  const k = cueKit(tl, master), L = (n: number) => line(n).start, end = master.duration;
  perform(tl, master, {
    dancer: { handA: contactSurface('dancer', 'arm', 'fore', 'A'), handB: contactSurface('dancer', 'arm', 'fore', 'B'), footA: contactSurface('dancer', 'thigh', 'shin', 'A'), footB: contactSurface('dancer', 'thigh', 'shin', 'B') },
    clown: { handA: contactSurface('clown', 'arm', 'fore', 'A'), handB: contactSurface('clown', 'arm', 'fore', 'B'), footA: contactSurface('clown', 'thigh', 'shin', 'A'), footB: contactSurface('clown', 'thigh', 'shin', 'B') },
  });
  tl.base('crossbar.rz', 90).base('stool.x', .15).base('hat.x', .15).base('hat.y', .395).base('trunk.x', 1.86);
  tl.base('broom.held', 1).base('broomD.held', 1).base('hatParked.held', 1);
  tl.base('stars.i', 0).base('stars.out', 1);

  // Quiet opening. Broad, uninterrupted framing leaves the hands and the footwork legible.
  tl.set('curtain.style', curtainStyleIndex('traveller'), -7);
  k.cam(-7, .01, { x: 0, y: 1.0, z: 8.8, lx: 0, ly: 1.03, lz: -1.4, fov: 26 });
  k.look(-6.5, 4, { house: 0, fohL: [.48, 0xffe4bf], fohR: [.40, 0xd1ddea], foot: [.54, 0xffd8a8], left: [.25, 0xffd6af], right: [.30, 0xb4c5df], back: [.24, 0x879aba], ambient: .32 });
  k.look(-5, 3, { cycTop: [.34, 0x172331], cycHz: [.38, 0x6c5a57], cycBot: [.28, 0x272d38] });
  k.move('curtain.open', 1, -.1, 4.6);
  k.move('dust.i', .30, 0, 3);
  k.cam(5, 14, { z: 8.15, ly: .98 });
  k.aim('follow', -.55, 1.05, DEPTH, L(0), 2);
  k.look(L(0), 2, { follow: [.32, 0xffe5bd] });
  k.aim('follow', .70, 1.05, DEPTH, L(4), 2);
  k.look(L(8), 2, { follow: 0 });

  // Hat, broom and stool are attached to physical palms while held. Release keys match the pin positions.
  tl.set('hat.held', 1, 16.8);
  tl.set('hat.held', 0, 73.1).set('hat.x', .19, 73.1).set('hat.y', .6905, 73.1);
  tl.to('hat.x', 1.08, 73.1, 1.2, 'linear').to('hat.y', 1.23, 73.1, 1.2, 'out').to('hat.rz', -23, 73.1, 1.2);
  tl.to('hat.x', 1.875, 74.3, 1.4, 'linear').to('hat.y', .40, 74.3, 1.4, 'in').to('hat.rz', 0, 74.3, 1.4);
  k.pop('hat', false, 75.7); k.pop('hatParked', true, 75.7);
  tl.set('broom.held', 0, 75.5).set('broom.x', .84, 75.5).set('broom.y', 0, 75.5);
  tl.set('broom.held', 1, 112.2);
  tl.set('stool.held', 1, 67.0);
  tl.set('stool.held', 0, 74.8).set('stool.x', -.90, 74.8).set('stool.y', .052, 74.8).to('stool.y', 0, 74.8, .7, 'out');
  tl.to('hem.x', .12, L(6), 1.4).to('hem.rz', -11, L(6), 1.3).to('hem.rz', 0, 56.2, 1.8);

  // A gust catches real loose objects, then breaks the step. Damaged scenery is never restored.
  k.cam(113.5, 3, { z: 8.7, ly: 1.0 });
  k.look(L(20), 3, { cycTop: [.40, 0x101d31], cycHz: [.38, 0x304662], cycBot: [.28, 0x202d41], fohL: [.44, 0xc9d7e7], fohR: [.43, 0xa9c5e2], back: [.55, 0x7e9abb], foot: [.38, 0xe7cdb3] });
  tl.to('canopy.rz', -3, 115.8, 1.0).to('canopy.rz', 4, 117, 1.4).to('canopy.rz', -5, 119, 1.6).to('canopy.y', -.14, 120, 3);
  tl.to('cloudL.x', .30, 119.5, 2).to('cloudL.rz', -8, 119.5, 2);
  tl.to('cloudR.x', -.35, 119.5, 2).to('cloudR.rz', 9, 119.5, 2);
  tl.set('broom.held', 0, 120.5).set('broom.x', 1.71, 120.5).set('broom.y', 0, 120.5);
  tl.to('broom.rz', -12, 120.5, 1.2);
  tl.to('ladder.x', -.50, L(22), 2.4).to('ladder.rz', 61, L(22), 2.4).to('ladder.y', -.12, L(22), 2.4);
  tl.to('stool.x', 1.15, L(22), 3.6, 'in').to('stool.rz', -26, L(22), 3.6).to('stool.y', -.06, L(22), 3.6);
  tl.to('support.rz', 72, L(24), 3.5, 'in').to('crossbar.rz', 107, L(24), 3.5, 'in').to('crossbar.y', -.40, L(24), 3.5, 'in');
  tl.to('canopy.rz', 7, L(24), 3.5).to('canopy.y', -.30, L(24), 3.5);
  tl.to('step.rz', -27, L(26), 1.1, 'in').to('step.y', -.27, L(26), 1.1, 'in').to('step.x', .12, L(26), 1.1);
  tl.to('board2.rz', -8, L(26), 1.6).to('board2.y', -.085, L(26), 1.6);
  tl.to('board0.rz', 5, L(26), 1.9).to('board4.rz', -6, L(26), 1.9);
  k.pop('safety', true, 144.0);
  tl.set('safety.sag', .16, 144.0).to('safety.sag', .025, 145.6, 1.0);
  tl.to('safety.sag', .07, 151.7, 1.6).to('safety.sag', .025, 155.9, 1.4);
  k.cam(144.0, 4, { z: 7.85, ly: .99 });
  k.look(145, 4, { fohL: [.56, 0xe7d7c2], fohR: [.48, 0xc6d3e2], foot: [.48, 0xe3c4a4] });
  tl.to('cloudR.rz', 17, 177.8, 3).to('cloudR.x', -.53, 177.8, 3);
  tl.to('canopy.y', -.40, 189.2, 4).to('canopy.rz', 8, 189.2, 4);
  tl.to('safety.sag', .20, 192.4, 2.6); k.pop('safety', false, 195.3);

  // The grieving bridge and final duet keep the ruin in the picture. Warmth comes from action, not victory.
  k.look(195.6, 5, { fohL: [.49, 0xe9d4b6], fohR: [.42, 0xbacadd], back: [.26, 0x6d819c], foot: [.46, 0xe9c7a4], cycHz: [.27, 0x4d4851] });
  k.cam(210, 8, { z: 7.95, ly: .98 });
  k.look(227, 5, { fohL: [.60, 0xf1ddbd], fohR: [.49, 0xc8d7e5], foot: [.53, 0xf1cfa6], back: [.30, 0x798da6] });
  tl.set('broom.held', 1, 271.7);
  tl.set('broom.held', 0, 281.6).set('broom.x', 2.13, 281.6).set('broom.y', 0, 281.6).set('broom.rz', 0, 281.6);
  k.cam(274, 5, { z: 8.65, lx: .40, ly: 1.01 });
  k.cam(286, 6, { z: 8.0, lx: 0, ly: 1.0 });
  k.look(293.4, 3, { fohL: [.49, 0xe9d9c1], fohR: [.40, 0xbbcbdc], foot: [.45, 0xdeb991] });

  // No extra triumphant curtain call: the remaining coda belongs to the closing work.
  k.pop('sash', false, 300); k.pop('fold', true, 300); tl.set('fold.held', 1, 300);
  tl.set('trunk.held', 1, 306.0);
  k.pop('broom', false, 308.0); k.pop('broomD', true, 308.0);
  k.cam(302, 8, { z: 8.8, lx: .30, ly: 1.0 });
  k.look(304, 12, { fohL: [.30, 0xcabda9], fohR: [.25, 0x9baaba], foot: .22, back: .12, cycHz: [.16, 0x333541], cycTop: [.17, 0x111a28], ambient: .24 });
  for (const id of ['dancer', 'clown', 'trunk', 'hatParked', 'fold', 'broomD']) k.leave(id, 323, 2.3);
  k.move('curtain.open', 0, 320.5, 6.0);
  k.move('surtitles.i', 0, 300, 1.2);
  k.move('dust.i', 0, 321, 6);
  k.look(end - 2, 4, { house: .14, foot: .07, fohL: 0, fohR: 0, back: 0, left: 0, right: 0, ambient: .10 });
}

const production: Production = {
  id: 'un-dernier-salut', no: 12,
  title: { fr: 'Un dernier salut', zh: '最后的谢幕', en: 'One Last Bow', id: 'Salam Terakhir' },
  poster: urls['./art/cut/poster.webp']!, audio, master, pieces,
  curtain: { open: 'traveller', close: 'traveller' }, preroll: 7, postroll: 9,
  surtitles: { main: 'fr', second: 'id' },
  voices: { dancer: { name: 'La danseuse · Dancer', color: '#e9d8bb' }, clown: { name: 'Le clown · Clown', color: '#bfd0de' }, both: { name: 'Ensemble', color: '#ead6bc' } },
  bill: {
    about: 'The last night of a travelling theatre. A dancer guards her perfect farewell; a backstage clown keeps getting in the way. When the roof gives and a step breaks, their rival steps become a means of holding one another up. Their theatre will close. They still have to finish the dance, pack the case and go.',
    cast: [['La danseuse', 'Mezzo · strings'], ['Le clown', 'Baritone · strings']],
    scenes: ['The last rehearsal', 'A broom inside the solo', 'Each in our own place', 'The roof gives', 'A red sash over a broken step', 'One last bow', 'Closing work'],
  },
  cues,
};
export default production;
