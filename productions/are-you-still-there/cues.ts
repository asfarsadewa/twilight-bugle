import type { CueContext } from '../../theatre/src/core/types.ts';
import { cueKit } from '../../theatre/src/core/cuekit.ts';
import { curtainStyleIndex } from '../../theatre/src/house/curtain.ts';

// The same left/right geography survives every era. The older brother escaped LEFT;
// Min stayed RIGHT. The developed bank belongs to Chol. Neither side is named.
export const MARKS = {
  old: { x: -1.25, y: 0, z: -0.85 },
  young: { x: -1.25, y: 0, z: -1.25 },
  min: { x: 1.3, y: 0.08, z: -1.7 },
};

export function cues({ tl, line, section, master }: CueContext) {
  const k = cueKit(tl, master);
  const L = (n: number) => line(n).start;
  const E = (id: string) => section(id).end;
  const end = master.duration;
  const { old: OLD, min: MIN } = MARKS;
  const c1 = L(6), v2 = L(12), c2 = L(18), br = L(24), lift = section('lift').start, c3 = L(28), out = L(34);
  tl.signal('elder.sing', master.vox!.fps, master.vox!.cheol ?? []);

  const sky = (t: number, dur: number, top: number, horizon: number, bottom: number, levels: [number, number, number] = [0.65, 0.7, 0.45]) => {
    k.look(t, dur, { cycTop: [levels[0], top], cycHz: [levels[1], horizon], cycBot: [levels[2], bottom] });
    k.move('cycHz.y', 0.15, t, dur);
  };
  const DUSK = [0x444862, 0xe5a366, 0x766268] as const;
  const AMBER = [0x59647c, 0xf2bf85, 0x9a7d67] as const;
  const RAIN = [0x48515e, 0x939ba4, 0x49505b] as const;
  const LATE = [0x252e4a, 0xa96852, 0x343e55] as const;
  const NIGHT = [0x101b34, 0x31415a, 0x15243a] as const;
  const warm = (t: number, dur = 2, amount = 1) => k.look(t, dur, {
    fohL: [0.27 * amount, 0xffdfb7], fohR: [0.21 * amount, 0xd3dff0], left: [0.2 * amount, 0xffc68e], right: [0.12 * amount, 0xc3d6f0], back: [0.27 * amount, 0xe4ae84], foot: 0.27 * amount, ambient: 0.24 * amount,
  });
  const cold = (t: number, dur = 2, amount = 1) => k.look(t, dur, {
    fohL: [0.2 * amount, 0xd8e0e8], fohR: [0.2 * amount, 0xc4d4e6], left: [0.12 * amount, 0xbdccdf], right: [0.13 * amount, 0xc4d8e8], back: [0.23 * amount, 0xa7bcd5], foot: 0.24 * amount, ambient: 0.2 * amount,
  });
  const follow = (x: number, z: number, t: number, dur = 1, level = 0.6, color = 0xffe2bd, y = 0.82) => {
    k.aim('follow', x, y, z, t, dur);
    k.look(t, dur, { follow: [level, color] });
  };
  const face = (id: string, t: number, turned: boolean) => tl.hold(`${id}.turn`, t).to(`${id}.turn`, turned ? 1 : 0, t, 0.65);
  const walk = (id: string, t: number, dur: number, x: number) => {
    k.move(`${id}.x`, x, t, dur);
    tl.hold(`${id}.hop`, t).to(`${id}.hop`, 0.65, t, 0.3).hold(`${id}.hop`, t + dur - 0.3).to(`${id}.hop`, 0, t + dur - 0.3, 0.3);
  };
  const rain = (t: number, rate: number, dur = 2) => {
    tl.set('rain.x0', -3.2, t).set('rain.x1', 3.2, t);
    k.move('rain.rate', rate, t, dur);
  };
  const wave = (id: string, amplitude: number, period: number) => {
    for (let t = 0, i = 0; t + period / 2 < end; t += period / 2, i++) k.move(`${id}.x`, i % 2 ? amplitude : -amplitude, t, period / 2, 'sine');
  };
  const presentSet = (t: number, dur = 3.8) => {
    k.leave('villageThen', t, dur);
    k.enter('farBank', t + 0.1, dur);
    k.enter('city', t + 0.45, dur);
    k.enter('promenade', t + 0.9, dur);
    k.enter('quietRiver', t + 0.3, dur);
    k.move('waves1.y', -0.35, t, dur);
    k.move('waves2.y', -0.35, t, dur);
    k.move('city.glow', 0.18, t + 0.8, dur);
    k.move('farBank.glow', 0.035, t + 0.8, dur);
    rain(t, 0, dur);
    k.move('haze', 1.25, t, dur);
    k.place('lamp', -2.37, 1.25, -0.4, t);
    k.look(t + 1, dur, { lamp: [0.25, 0xffcf91], ray: 0 });
  };
  const warSet = (t: number, dur = 3) => {
    for (const id of ['city', 'farBank', 'promenade']) k.leave(id, t, dur);
    k.enter('villageThen', t + 0.3, dur);
    k.leave('quietRiver', t, dur);
    k.move('waves1.y', 0, t, dur);
    k.move('waves2.y', 0, t, dur);
    k.move('smoke.i', 0, t, 1.5);
    k.look(t, dur, { lamp: 0, ray: 0 });
    sky(t, dur, ...RAIN, [0.6, 0.65, 0.4]);
    cold(t, dur);
    rain(t, 0.78, dur);
    k.move('haze', 2.15, t, dur);
  };
  // The uniform and the white-haired man share a mark. This theatrical substitution
  // is the passage of decades, not somebody crossing the river during peacetime.
  const ageIntoPresent = (t: number, dur = 5.5) => {
    for (const id of ['lineA', 'lineB', 'min']) k.leave(id, t, dur - 1.2);
    k.leave('uniform', t + 1.1, 0.8);
    tl.set('elder.x', 0, t + 1.3).set('elder.head', -8, t + 1.3).set('elder.armA', 0, t + 1.3);
    k.pop('elder', true, t + 1.9);
    presentSet(t + 0.1, dur - 0.3);
    sky(t + 0.1, dur, ...DUSK);
    warm(t + 0.1, dur);
    follow(OLD.x, OLD.z, t + 1.2, 2.5, 0.68);
    k.move('elder.head', 5, t + 3, 2);
  };

  wave('waves1', 0.045, 5.4);
  wave('waves2', 0.035, 6.2);
  wave('quietRiver', 0.03, 7.4);
  tl.base('reedsL.sway', 0.35).base('reedsR.sway', 0.3).base('elder.sway', 0.12);
  tl.base('dust.i', 0.05).base('haze', 2.1).base('min.turn', 1).base('min.s', 0.9);
  // A single dim far-shore cooking plume, never a second city skyline.
  tl.base('smoke.x', 0.83).base('smoke.y', 0.99).base('smoke.z', -3.0);

  const P = -7;
  tl.set('curtain.style', curtainStyleIndex('traveller'), P);
  tl.set('surtitles.i', 0, P);
  k.cam(P, 0.01, { x: 0, y: 0.95, z: 9.4, lx: 0, ly: 1.05, lz: -1, fov: 27 });
  k.look(P + 0.8, 3.8, { house: 0, fohL: 0.12, fohR: 0.1, foot: 0.8, ambient: 0.2 });

  // INTRO: the original Hyeong image. Opposing uniforms and plain banners stand
  // behind the brothers. The crossing has already been cut. This is the cause.
  k.move('curtain.open', 1, 0.4, 4.6);
  sky(0, 3, ...RAIN);
  cold(0.5, 3, 0.85);
  rain(0, 0.6, 3);
  follow(0, -1.7, 3.5, 2, 0.45, 0xdce8f4);
  k.move('min.armB', 35, 3, 2);
  k.cam(1, 8, { x: 0, z: 8.5, ly: 1.08, lx: 0 });
  // War becomes the present without changing either bank.
  ageIntoPresent(10, 7.5);

  // VERSE 1: windows on the two unequal shores. The far window may be home;
  // there is no figure in it, and the observation gate remains closed.
  tl.set('surtitles.i', 1, L(0) - 1);
  k.cam(L(0), 5, { x: -0.05, lx: -0.05, z: 8.1, ly: 1.1 });
  k.move('elder.head', 5, L(0), 2);
  k.move('farBank.glow', 0.085, L(1) - 0.3, 3);
  k.move('smoke.i', 0.35, L(1), 3);
  follow(OLD.x, OLD.z, L(2) - 0.5, 2, 0.7);
  k.move('elder.head', -8, L(2), 1.6);
  // Nineteen is explicitly a memory: the young puppet returns on cold strings,
  // well in front of the far scenery, then is flown away before the question.
  tl.set('min.x', 0.1, L(3) - 1).set('min.y', 0.36, L(3) - 1).set('min.z', -0.8, L(3) - 1).set('min.s', 0.65, L(3) - 1);
  k.enter('min', L(3) - 0.4, 2.5);
  k.move('min.head', 7, L(3), 1.5);
  k.place('ray', 1.6, 3.6, -2.5, L(3));
  k.aim('ray', 1.4, 0.6, -2.5, L(3));
  k.look(L(3), 1.5, { ray: [0.18, 0xd7e2f1] });
  k.move('reedsL.sway', 0.8, L(4), 1.2);
  k.move('reedsR.sway', 0.7, L(4), 1.2);
  k.move('elder.head', 10, L(4), 1.2);
  k.move('elder.armA', 18, L(5), 1.8);
  k.move('min.armA', -20, L(5), 1.4);
  k.leave('min', c1 - 2, 2);
  k.look(c1 - 2, 2, { ray: 0 });

  // CHORUS 1: hold the whole divided geography in the frame.
  k.cam(c1 - 0.5, 4, { x: 0, lx: 0, z: 8.1, ly: 1.1 });
  sky(c1 - 0.5, 3, ...AMBER, [0.68, 0.8, 0.5]);
  warm(c1 - 0.3, 2.5, 1.05);
  follow(OLD.x, OLD.z, c1, 1.5, 0.72);
  k.move('elder.armA', 42, c1, 1.8, 'out');
  k.move('elder.head', 8, c1 + 1, 1.8);
  k.move('smoke.i', 0.55, L(7), 2.5);
  k.move('elder.armA', 15, L(8), 1.6);
  k.move('elder.head', -9, L(9), 1.4);
  k.move('elder.armA', -12, L(10), 1.7);
  k.move('elder.armA', 40, L(11), 1.6);
  k.move('elder.head', 6, L(11), 1.5);

  // VERSE 2: the reason is enacted, not merely suggested by a broken bridge.
  // Refugees escape LEFT; the olive column marches RIGHT against their flow.
  k.leave('elder', v2 - 2.1, 2.8);
  warSet(v2 - 2, 3.1);
  for (const id of ['brokenL', 'brokenR']) k.leave(id, v2 - 1.5, 1.8);
  tl.set('bridge.y', 0, v2 - 2).set('bridge.rz', 0, v2 - 2);
  k.enter('bridge', v2 - 1.4, 2.8);
  k.enter('mother', v2 - 0.5, 2.6);
  tl.set('min.x', 0, v2 - 1.6).set('min.y', 0, v2 - 1.6).set('min.z', 0, v2 - 1.6).set('min.s', 0.9, v2 - 1.6);
  tl.set('min.armA', 0, v2 - 1.6).set('min.armB', 0, v2 - 1.6);
  tl.set('young.x', 1.6, v2 - 1.6).set('young.y', 0.08, v2 - 1.6).set('young.z', -0.25, v2 - 1.6).set('young.turn', 1, v2 - 1.6);
  k.enter('min', v2 - 0.8, 2.6);
  k.enter('young', v2 - 0.4, 2.6);
  tl.set('refugees.x', 3.9, v2 - 1.5);
  k.pop('refugees', true, v2 - 1);
  walk('refugees', v2 - 1, 17.8, -4.8);
  k.pop('refugees', false, v2 + 17);
  tl.set('march.x', -4.6, v2 - 1.5);
  k.pop('march', true, v2 - 1);
  walk('march', v2 - 1, 14.8, 4.6);
  k.pop('march', false, v2 + 14);
  k.cam(v2 - 1.5, 4, { x: 0, lx: 0, z: 8.7, ly: 1.1 });
  follow(0.85, -1.5, v2, 2, 0.52, 0xe8ecf0);
  // The same rice bundle and the same young faces as Hyeong.
  k.move('min.x', -0.1, L(13) - 1, 1.2);
  k.move('min.armA', 110, L(13) - 0.5, 1.2);
  k.move('young.armB', -35, L(13) - 0.5, 1.2);
  k.enter('rice', L(13) - 0.1, 0.7);
  k.move('rice.glow', 0.15, L(13), 1.2);
  k.move('young.head', -9, L(13), 1.5);
  k.move('min.head', 5, L(13), 1.5);
  k.move('rice.x', -0.08, L(13) + 1.7, 1.4);
  k.leave('rice', L(14) - 0.8, 0.8);
  k.leave('mother', L(14), 2.8);
  k.move('min.armA', 0, L(14), 1.5);
  k.move('min.x', 0, L(14), 1.5);
  k.move('young.armB', 0, L(14), 1.5);
  face('young', L(14) - 0.3, false);
  walk('young', L(14), 7.9, 0);
  k.move('young.y', 0, L(14), 7.9);
  k.move('young.z', 0, L(14), 7.9);
  k.move('min.armB', 42, L(14), 1.6);
  k.move('min.head', -13, L(15), 1.6);
  k.enter('lineA', L(15) - 0.8, 3.2);
  k.enter('lineB', L(15) + 0.4, 3.5);

  // PRE-CHORUS 2: young Chol is already on the escape bank. Min holds the
  // crossing as troops close behind him. His rope-cut gesture drops the bridge.
  face('young', L(16) - 0.5, true);
  k.move('young.armB', -35, L(16), 1.2);
  k.move('min.armB', 70, L(17) - 0.65, 0.5, 'out');
  k.move('min.armB', -20, L(17) - 0.1, 0.25, 'in');
  k.move('bridge.rz', 8, L(17) + 0.15, 2.8, 'in');
  k.move('bridge.y', -1.9, L(17) + 0.35, 2.9, 'in');
  k.flash('back', L(17) + 0.2, 0.58, 0.23, 0.08, 1.2);
  k.move('min.armB', 18, L(17) + 2, 1.5);
  k.pop('bridge', false, c2 - 0.9);
  for (const id of ['brokenL', 'brokenR']) k.enter(id, c2 - 1.5, 1.6);
  follow(MIN.x, MIN.z, L(17), 1.4, 0.68, 0xe4edf8);

  // CHORUS 2: no immediate retreat into gentle nostalgia. Hold both armies,
  // both banks and the impossible gap for four lines of the lament.
  k.cam(c2 - 0.5, 4, { x: 0, lx: 0, z: 8.4, ly: 1.1 });
  cold(c2, 3, 1.05);
  rain(c2, 0.9, 2);
  k.move('young.armB', -18, c2, 1.7);
  k.move('min.head', 7, c2, 1.8);
  // Hyeong's uniformed Chol takes the same mark, fixing which side he reaches.
  k.leave('young', L(19) + 0.2, 1.6);
  k.enter('uniform', L(19) + 0.5, 1.8);
  follow(OLD.x, -1.25, L(20), 1.8, 0.7, 0xe0e9f3);
  k.move('min.armB', 42, L(20), 1.5);
  k.move('min.head', -12, L(21), 1.8);
  // "A house without you is no home": one man ages while his bank modernises.
  // Min withdraws into the past; the far bank receives no answering puppet.
  ageIntoPresent(L(22) - 0.2, 6.9);
  k.move('elder.armA', 42, L(23) + 0.3, 1.7);

  // BRIDGE: the ordinary life he kept living cannot undo the closed crossing.
  sky(br, 4, ...LATE, [0.58, 0.62, 0.4]);
  warm(br, 3, 0.68);
  k.move('smoke.i', 0.18, br, 4);
  k.move('elder.armA', 12, br, 2);
  follow(OLD.x, OLD.z, br, 2, 0.64, 0xe3dddc);
  k.cam(br, 6, { x: -0.1, lx: -0.1, z: 7.7, ly: 1.1 });
  k.move('elder.head', 12, L(24), 1.8);
  k.move('elder.armA', 35, L(25), 1.6);
  k.move('elder.head', -6, L(26), 1.8);
  k.move('elder.armA', -14, L(26), 1.8);
  k.move('elder.head', 3, L(27), 1.8);
  k.move('elder.armA', 0, L(27), 1.8);

  // ORCHESTRAL LIFT: the wound returns at full scale. The same opposing lines,
  // the same severed crossing. Then the decades pass in view once more. Modern
  // infrastructure replaces the war set, but no bridge or reunion replaces it.
  k.leave('elder', lift + 0.3, 2.4);
  warSet(lift + 0.3, 3.6);
  for (const id of ['lineA', 'lineB', 'uniform']) k.enter(id, lift + 1.9, 3);
  tl.set('min.x', 0, lift + 1.2).set('min.y', 0, lift + 1.2).set('min.z', 0, lift + 1.2).set('min.s', 0.9, lift + 1.2);
  k.enter('min', lift + 2, 3);
  k.move('min.armB', 48, lift + 4, 2);
  follow(0, -1.7, lift + 2, 3, 0.6, 0xdce8f4);
  k.cam(lift, 6, { x: 0, lx: 0, z: 8.5, ly: 1.1 });
  k.move('min.head', -10, lift + 8, 2);
  ageIntoPresent(lift + 12, 8.8);

  // FINAL CHORUS: only old Chol. The gate remains shut through "let us go home".
  sky(c3 - 0.7, 4, ...LATE, [0.65, 0.72, 0.48]);
  warm(c3 - 0.5, 3, 1.1);
  follow(OLD.x, OLD.z, c3, 1.5, 0.8);
  k.cam(c3 - 0.5, 5, { x: 0, lx: 0, z: 7.9, ly: 1.1 });
  k.move('elder.armA', 45, c3, 1.8);
  k.move('elder.head', 9, c3, 1.8);
  k.move('farBank.glow', 0.065, c3, 2.5);
  // One small step along his own observation rail, never across the barrier.
  walk('elder', L(29), 3.4, 0.2);
  follow(OLD.x + 0.2, OLD.z, L(29), 3.4, 0.8);
  k.move('elder.armA', -12, L(30), 1.7);
  k.move('elder.head', -12, L(30), 1.7);
  k.move('elder.head', 4, L(31), 1.7);
  k.move('elder.armA', 25, L(31), 1.8);
  k.move('elder.armA', 43, L(32), 1.8);
  k.move('elder.head', -2, L(32), 1.8);
  k.move('elder.armA', 30, L(33), 1.7);
  k.move('elder.head', 5, L(33), 1.7);

  // OUTRO/CODA: neither death nor survival is invented for Min. Unequal lights
  // on the two shores remain visible, with the river and locked gate between.
  k.move('elder.armA', 8, out + 0.5, 5);
  k.move('elder.head', -5, out, 3);
  k.move('elder.head', 3, L(35), 2);
  follow(OLD.x + 0.2, OLD.z, out, 4, 0.6, 0xe0d7d1);
  k.move('smoke.i', 0, out, 6);
  k.move('farBank.glow', 0.035, E('outro'), 12);
  k.move('city.glow', 0.15, E('outro'), 12);
  sky(E('outro') + 1, 16, ...NIGHT, [0.5, 0.48, 0.3]);
  cold(E('outro') + 1, 12, 0.45);
  k.move('stars.i', 0.45, E('outro') + 2, 16);
  k.cam(E('outro'), 18, { x: 0, lx: 0, z: 8.8, ly: 1.08 });
  k.move('elder.armA', 0, end - 13, 5);
  k.move('elder.head', 0, end - 10, 4);
  k.look(end - 8, 7, { follow: [0.38, 0xc9d7ec], foot: 0.16, lamp: 0.12 });
  tl.set('surtitles.i', 0, E('outro') + 2);
  k.move('curtain.open', 0, end - 3.8, 3.6);

  // A solo curtain call, with no answering brother smuggled into the ending.
  tl.set('elder.x', 0.65, end + 0.2);
  tl.set('elder.head', 0, end + 0.2).set('elder.armA', 0, end + 0.2).set('elder.armB', 0, end + 0.2);
  k.move('curtain.open', 0.5, end + 0.8, 1.6);
  follow(OLD.x + 0.65, OLD.z, end + 0.7, 1, 0.65);
  k.move('elder.rz', -12, end + 2.6, 0.7);
  k.move('elder.rz', 0, end + 3.6, 0.7);
  k.move('curtain.open', 0, end + 5, 2);
  k.look(end + 5.5, 2.5, { follow: 0, house: 0.7 });
}
