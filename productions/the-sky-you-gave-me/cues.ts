import type { CueContext } from '../../theatre/src/core/types.ts';
import { cueKit } from '../../theatre/src/core/cuekit.ts';
import { curtainStyleIndex } from '../../theatre/src/house/curtain.ts';

export const MARKS = {
  daughter: { x: 1.35, y: 0, z: -0.85 },
  father: { x: -0.9, y: 0, z: -0.85 },
  daughterSeat: { x: 0.175, y: 0, z: -0.85 },
};

// Show seconds are the unchanged recording's clock. The estimated beat grid is
// deliberately unused: the words, the mine interlude and the hands lead.
export function cues({ tl, line, master }: CueContext) {
  const k = cueKit(tl, master);
  const L = (n: number) => line(n).start;
  const E = (n: number) => line(n).end;
  const end = master.duration;
  // These transitions belong to the selected take's phrases and instrumental
  // gaps. Replacing a recording must not leave the mine or pose swap on an old
  // absolute clock, even when its lyrics and overall duration look similar.
  const road = L(6) - 4;
  const mineGap = L(16) - E(15);
  const mine = (fraction: number) => E(15) + mineGap * fraction;
  const tremor = mine(0.755), collapse = mine(0.8);
  const planet = L(34) - 5.6;
  const sit = L(39) + 1.5, swap = sit + 0.97;
  const liftStart = E(39), liftGap = L(40) - liftStart;
  const lift = (fraction: number) => liftStart + liftGap * fraction;
  const coda = E(51) + 0.2;
  for (const id of ['daughter', 'daughterSeat']) tl.signal(`${id}.sing`, master.vox!.fps, master.vox!.daughter ?? []);

  const sky = (t: number, dur: number, top: number, horizon: number, bottom: number, level = 0.55) => {
    k.look(t, dur, { cycTop: [level, top], cycHz: [level * 0.8, horizon], cycBot: [level * 0.6, bottom] });
    k.move('cycHz.y', 0.18, t, dur);
  };
  const cold = (t: number, dur = 2, a = 1) => k.look(t, dur, {
    fohL: [0.23 * a, 0xc6d4e1], fohR: [0.23 * a, 0xbacdde],
    left: [0.15 * a, 0x9bb1c4], right: [0.13 * a, 0xcbd7e6],
    back: [0.23 * a, 0x9ab3d0], foot: 0.23 * a, ambient: 0.24 * a,
  });
  const warm = (t: number, dur = 2, a = 1) => k.look(t, dur, {
    fohL: [0.25 * a, 0xffd5a0], fohR: [0.19 * a, 0xe4dfd4],
    left: [0.2 * a, 0xffc58b], right: [0.1 * a, 0xc7d5e6],
    back: [0.22 * a, 0xd5b28c], foot: 0.26 * a, ambient: 0.25 * a,
  });
  const follow = (x: number, y: number, z: number, t: number, dur = 1.5, level = 0.65) => {
    k.aim('follow', x, y, z, t, dur);
    k.look(t, dur, { follow: [level, 0xffe0b5] });
  };
  const walk = (id: string, x: number, t: number, dur: number, hop = 0.4) => {
    k.move(`${id}.x`, x, t, dur);
    k.move(`${id}.hop`, hop, t, 0.4);
    k.move(`${id}.hop`, 0, t + dur - 0.4, 0.4);
  };
  const reach = (t: number, firstLine: number) => {
    k.move('daughter.head', 6, t, 1.7);
    k.move('daughter.armA', -32, t, 2);
    k.move('daughter.armB', 9, t, 1.8);
    k.move('daughter.head', -8, L(firstLine + 2), 1.5);
    k.move('daughter.armA', -48, L(firstLine + 4), 1.7);
    k.move('daughter.head', -6, L(firstLine + 4), 1.7);
    k.move('daughter.armA', -26, L(firstLine + 6), 1.8);
    k.move('daughter.head', 2, L(firstLine + 7), 1.7);
  };

  tl.base('dust.i', 0.045).base('haze', 1.15);
  tl.base('daughter.sway', 0.08).base('father.sway', 0.015).base('daughterSeat.sway', 0.015);
  tl.base('daughter.armB', 6).base('father.armA', 0).base('father.armB', -8);
  tl.base('daughterSeat.armA', -51).base('daughterSeat.armB', -15);
  tl.base('smoke.x', -0.65).base('smoke.y', 0.5).base('smoke.z', -2.5);
  tl.base('stars.i', 0).base('stars.out', 0);

  const P = -7;
  tl.set('curtain.style', curtainStyleIndex('tableau'), P).set('surtitles.i', 0, P);
  k.cam(P, 0.01, { x: 0, y: 0.95, z: 9.4, lx: 0, ly: 1.05, lz: -1, fov: 27 });
  k.look(P + 0.8, 3.8, { house: 0, fohL: 0.12, fohR: 0.1, foot: 0.75, ambient: 0.2 });

  // A household lamp in a coal town. A small, connected memory card lets the
  // father's original finger actually meet the child's palm before her song.
  sky(0, 3, 0x24303e, 0x65717a, 0x38434b);
  cold(0, 3, 0.6);
  k.move('curtain.open', 1, 0.5, 4.5);
  k.enter('childhood', 4, 3.2);
  k.place('lamp', -0.9, 1.38, -1.8, 4);
  k.look(4, 3, { lamp: [0.85, 0xffbf74] });
  k.move('childhood.glow', 0.06, 5, 3);
  k.enter('daughter', 11, 3.2);
  follow(-0.65, 0.85, -2.0, 6, 2.8, 0.62);
  k.cam(5, 10, { x: 0, lx: -0.1, z: 8.5, ly: 1.08 });
  tl.set('surtitles.i', 1, L(0) - 0.7);
  warm(L(0), 3, 0.8);
  k.move('daughter.head', -9, L(1), 1.6);
  k.move('daughter.armA', -17, L(2), 1.5);
  k.move('stars.i', 0.11, L(3), 5);
  k.move('daughter.head', 8, L(4), 1.8);
  k.move('daughter.armA', -28, L(4), 2);
  k.move('daughter.head', -6, L(5), 2);

  // His road goes into the mountain. The lamp is moved to a town window; it
  // will survive the mine lamp's failure in the following instrumental scene.
  k.leave('childhood', road, 3.5);
  k.place('lamp', -2.2, 1.0, -2.8, road + 1, 2.5);
  k.look(road + 1, 2, { lamp: [0.4, 0xffc285] });
  k.enter('mine', road + 1, 3.6);
  k.enter('miner', L(6) - 1.5, 3);
  k.place('ray', -1.25, 1.25, -1.9, L(6));
  k.aim('ray', -0.6, 0.75, -2.84, L(6));
  k.look(L(6), 2, { ray: [0.35, 0xe1e9ec] });
  follow(1.15, 0.83, -0.85, L(7), 2, 0.62);
  k.move('daughter.armA', 32, L(7), 1.6);
  k.move('daughter.head', 9, L(7), 1.6);

  // The offered hand becomes the title refrain's recurring physical phrase.
  sky(L(8) - 1, 4, 0x1a2b46, 0x526575, 0x34414f, 0.58);
  warm(L(8), 3, 1.02);
  walk('daughter', -0.3, L(8) - 1, 3.4);
  k.move('stars.i', 0.38, L(8), 5);
  k.cam(L(8) - 1, 5, { x: 0, lx: 0, z: 8.2, ly: 1.1 });
  reach(L(8), 8);
  k.move('miner.rz', -3, L(10), 2);
  k.move('miner.rz', 0, L(12), 2);
  k.move('daughter.armA', 0, E(15) + 0.4, mineGap * 0.14);

  // No generic disappearance: he walks INTO the mine in view, the support
  // falls across its mouth, and the work lamp fails. The kitchen light stays.
  k.move('stars.i', 0, mine(0.05), mineGap * 0.18);
  sky(mine(0.05), mineGap * 0.18, 0x202c37, 0x46515b, 0x2e3941, 0.48);
  cold(mine(0.09), mineGap * 0.14, 0.8);
  follow(-0.9, 0.85, -2, mine(0.16), mineGap * 0.11, 0.6);
  walk('daughter', 0.15, mine(0.09), mineGap * 0.14);
  k.enter('beam', mine(0.3), mineGap * 0.11);
  walk('miner', 0.67, mine(0.37), mineGap * 0.25, 0.35);
  k.move('miner.z', -1.12, mine(0.5), mineGap * 0.14);
  k.move('miner.s', 0.7, mine(0.5), mineGap * 0.14);
  k.place('ray', -0.65, 0.98, -2.82, mine(0.37), mineGap * 0.25);
  k.aim('ray', -0.62, 0.72, -3.4, mine(0.37), mineGap * 0.25);
  k.move('beam.rz', -2, tremor, 0.3);
  k.move('beam.rz', 3, tremor + 0.3, 0.3);
  k.move('beam.rz', -3, tremor + 0.6, 0.25);
  k.move('beam.rz', 29, collapse, 0.85, 'in');
  k.move('beam.y', -0.73, collapse + 0.1, 0.85, 'in');
  k.flash('back', collapse + 0.3, 0.6, 0.2, 0.06, 0.65);
  k.look(collapse + 0.4, 0.15, { ray: 0 });
  k.move('dust.i', 0.65, collapse + 0.3, 0.2);
  k.move('dust.i', 0.05, collapse + 2, 2.4);
  k.move('smoke.i', 1.4, collapse + 0.3, 0.6);
  k.move('smoke.i', 0, collapse + 2.3, 2.1);
  k.pop('miner', false, collapse + 1.3);
  k.move('daughter.head', -15, collapse + 0.4, 0.8);
  k.move('daughter.armA', -42, collapse + 0.4, 0.8);
  k.move('daughter.armB', 24, collapse + 0.4, 0.8);

  // Recovery. The letter goes from her to him, then back into her hand.
  k.enter('fatherCane', L(16) + 0.1, 3);
  k.enter('town', L(16), 3);
  k.leave('beam', L(17) - 0.4, 2.8);
  k.leave('mine', L(17) - 0.3, 3);
  warm(L(16), 4, 0.82);
  follow(-0.3, 0.8, -1.1, L(16), 3, 0.72);
  walk('daughter', -0.75, L(17), 2.8);
  k.move('daughter.armA', -35, L(18), 1.3);
  k.enter('letter', L(18) - 0.2, 0.8);
  k.move('letter.x', -1.42, L(18), 1.4);
  k.move('letter.y', 0.14, L(18), 1.4);
  k.move('daughter.head', -16, L(18), 1.4);
  k.move('letter.x', -0.37, L(19), 1.8);
  k.move('letter.y', -0.02, L(19), 1.8);
  k.move('daughter.armA', -48, L(19), 1.5);
  k.move('daughter.head', -2, L(19), 2);

  // Two new instruments of learning: her telescope and his white cane are
  // held simultaneously in a wide composition. Neither is a cure for him.
  k.leave('letter', L(20) - 0.5, 1);
  k.enter('telescope', L(20) - 0.8, 1.6);
  walk('daughter', 0.68, L(20) - 0.8, 2.9);
  k.move('daughter.armA', -5, L(20), 1.6);
  k.move('daughter.head', 8, L(20), 1.5);
  walk('fatherCane', 0.32, L(21) - 0.5, 2.7, 0.18);
  k.cam(L(20) - 1, 3, { x: 0, lx: 0, z: 8.2, ly: 1.08 });
  follow(0, 0.8, -1.2, L(20), 2, 0.55);
  walk('daughter', -0.58, L(22) - 0.7, 2.2);
  k.enter('certificate', L(22), 1);
  k.move('certificate.x', -0.62, L(23) - 0.5, 1.2);
  k.move('daughter.armA', -44, L(23), 1.5);
  k.move('daughter.head', -7, L(23), 1.5);
  k.move('certificate.glow', 0.08, L(23), 1);
  k.leave('certificate', L(24) - 0.3, 1.2);
  k.move('stars.i', 0.36, L(24), 5);
  k.move('daughter.head', 9, L(24), 1.8);
  k.move('daughter.armA', 26, L(24), 1.8);
  k.move('daughter.head', -4, L(25), 1.8);

  sky(L(26) - 1, 5, 0x142644, 0x40546b, 0x26364d, 0.55);
  warm(L(26), 3, 1.05);
  k.move('stars.i', 0.66, L(26), 5);
  walk('daughter', -0.3, L(26) - 0.6, 2.8);
  follow(0.6, 0.85, -0.85, L(26), 2, 0.68);
  reach(L(26), 26);
  walk('daughter', -0.78, L(30) - 1, 2.2);
  k.move('daughter.armA', -54, L(30), 1.8);

  // Years pass through a visible set change. The best seat is for the same
  // living father. The elderly face has closed, listening eyes, not healed ones.
  k.leave('telescope', planet, 2.2);
  k.leave('fatherCane', planet + 0.5, 3);
  k.leave('town', planet + 1, 4);
  k.enter('dome', planet + 0.5, 5);
  k.enter('projector', planet + 2.5, 2.8);
  k.enter('audienceL', planet + 3, 4);
  k.enter('audienceR', planet + 3.6, 4);
  walk('daughter', 0.15, planet + 1, 4);
  k.move('daughter.armA', -10, planet + 2, 3);
  k.move('daughter.armB', 15, planet + 2, 3);
  sky(planet + 2, 4, 0x0c1836, 0x263b60, 0x152644, 0.48);
  cold(planet + 2, 4, 0.8);
  k.look(planet + 2, 3, { lamp: 0 });
  k.move('stars.i', 1.15, L(34) - 1, 4);
  k.place('ray', 0, 0.7, -2.3, planet + 3);
  k.aim('ray', 0.5, 2.8, -4.6, planet + 3);
  k.look(L(34) - 0.5, 2, { ray: [0.35, 0xb4cce9] });
  k.move('projector.glow', 0.16, L(34), 2);
  k.cam(planet + 2, 5, { x: 0, lx: 0, z: 8.65, ly: 1.15 });
  k.enter('father', L(35) - 1.7, 2.5);
  follow(-0.9, 0.82, -0.85, L(35) - 0.8, 2, 0.72);
  k.move('father.head', 5, L(35), 1.4);
  k.move('daughter.head', -8, L(35), 1.6);
  for (const id of ['audienceL', 'audienceR']) {
    k.move(`${id}.sway`, 0.22, L(36), 0.6);
    k.move(`${id}.hop`, 0.15, L(36), 0.6);
    k.move(`${id}.hop`, 0, L(37), 0.6);
    k.move(`${id}.sway`, 0, L(37), 1.2);
  }
  k.move('father.head', 12, L(37), 1.7);
  k.move('daughter.armA', -23, L(37), 1.7);
  k.move('daughter.head', -12, L(37), 1.7);
  k.leave('audienceL', L(38), 4.5);
  k.leave('audienceR', L(38) + 0.3, 4.5);

  // She switches the projected sky OFF, and it never returns. The pose swap
  // happens edge-on while her head descends to the seated height, not in flight.
  k.move('stars.i', 0, L(39), 4.2);
  k.look(L(39), 3.8, { ray: 0 });
  k.move('projector.glow', -0.08, L(39), 3.8);
  k.leave('projector', L(39) + 4.5, 1.8);
  walk('daughter', -1.15, L(38) + 2.2, 4.0, 0.2);
  k.move('daughter.y', -0.22, sit, 0.97);
  k.move('daughter.turn', 0.5, sit + 0.52, 0.45, 'linear');
  k.pop('daughter', false, swap);
  tl.set('daughterSeat.turn', 0.5, swap);
  k.pop('daughterSeat', true, swap);
  k.move('daughterSeat.turn', 0, swap, 0.45, 'linear');
  k.move('father.head', -1, L(39), 3);
  k.move('father.armA', -12, L(39), 3);
  k.enter('hands', sit - 0.1, 3);
  warm(L(39), 4, 0.64);
  sky(L(39), 5, 0x101929, 0x263041, 0x1e2935, 0.35);
  follow(-0.4, 0.79, -0.85, sit - 0.1, 4, 0.82);
  k.place('lamp', -0.4, 1.1, -0.45, sit - 0.1);
  k.look(sit - 0.1, 4, { lamp: [0.38, 0xffc385] });
  k.cam(sit - 0.1, 6, { x: 0, lx: -0.3, z: 7.6, ly: 0.9 });

  // The orchestral scale grows around a tiny tactile event. An upstage memory
  // of the childhood lamp answers it once, with the projector still off.
  tl.set('childhood.s', 0.55, lift(0.08)).set('childhood.x', -1.15, lift(0.08)).set('childhood.y', 0.28, lift(0.08));
  k.enter('childhood', lift(0.12), liftGap * 0.2);
  k.move('childhood.glow', 0.1, lift(0.12), liftGap * 0.2);
  k.move('daughterSeat.head', -8, lift(0.08), liftGap * 0.2);
  k.move('father.head', 5, lift(0.45), liftGap * 0.2);
  k.leave('childhood', lift(0.64), liftGap * 0.3);
  k.move('hands.glow', 0.025, lift(0.5), liftGap * 0.35);
  k.move('daughterSeat.head', -2, L(40), 2);
  warm(L(40), 4, 0.95);
  follow(-0.4, 0.8, -0.85, L(40), 2, 0.92);
  k.cam(L(40) - 1, 6, { x: 0, lx: -0.28, z: 7.55, ly: 0.93 });
  k.move('father.head', 7, L(42), 1.8);
  k.move('daughterSeat.head', -9, L(44), 1.8);
  k.move('father.armB', -13, L(44), 2);
  k.move('father.head', -2, L(45), 1.8);
  k.move('daughterSeat.head', -4, L(46), 1.8);
  k.move('father.head', 5, L(47), 1.8);

  // Two living people. The hands remain joined, with small tracing strokes
  // rather than a broad wave that would pull the fingertip away from his palm.
  for (const [n, angle] of [[48, -50.5], [49, -52], [50, -50], [51, -51]] as const) {
    k.move('daughterSeat.armA', angle, L(n), 1.7);
    k.move('daughterSeat.head', n % 2 ? -3 : -8, L(n), 1.7);
  }
  k.move('father.head', -1, L(50), 2);
  k.move('father.head', 4, L(51) + 1, 2.5);
  k.cam(coda, 14, { x: 0, lx: -0.2, z: 8.6, ly: 1.0 });
  warm(coda + 0.5, 10, 0.58);
  follow(-0.4, 0.78, -0.85, coda + 0.5, 8, 0.58);
  tl.set('surtitles.i', 0, line(51).end + 2);
  // Style changes while the cloth is fully open, then the travellers close.
  tl.set('curtain.style', curtainStyleIndex('traveller'), end - 4.1);
  k.move('curtain.open', 0, end - 3.8, 3.6);

  // Her bow and his seated nod acknowledge the audience without making him
  // stand unsupported or suggesting that the final gesture restored his sight.
  k.pop('daughterSeat', false, end + 0.1);
  k.pop('hands', false, end + 0.1);
  tl.set('daughter.x', -0.9, end + 0.1).set('daughter.y', 0, end + 0.1).set('daughter.turn', 0, end + 0.1);
  tl.set('daughter.head', 0, end + 0.1).set('daughter.armA', 0, end + 0.1).set('daughter.armB', 0, end + 0.1);
  k.pop('daughter', true, end + 0.1);
  k.move('curtain.open', 0.65, end + 0.8, 1.6);
  follow(-0.3, 0.85, -0.85, end + 0.8, 1.5, 0.7);
  k.move('daughter.rz', 13, end + 2.6, 0.7);
  k.move('father.head', -12, end + 2.6, 0.7);
  k.move('daughter.rz', 0, end + 3.6, 0.7);
  k.move('father.head', 0, end + 3.6, 0.7);
  k.move('curtain.open', 0, end + 5, 2);
  k.look(end + 5.5, 2.5, { follow: 0, lamp: 0, house: 0.7 });
}
