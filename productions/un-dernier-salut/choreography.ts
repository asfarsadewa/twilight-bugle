import type { Master } from '../../theatre/src/core/types.ts';
import type { Timeline } from '../../theatre/src/core/timeline.ts';

// A score of positions and contacts, rather than a repeating hop. Feet retain their world positions until
// their own step. The runtime's two-bone joints solve each planted sole and each reaching palm.
export const GROUND = 0.30;
export const DEPTH = -1.26;
type V = [number, number];
interface Pose { x: number; y: number; z: number; lean: number; pitch: number; lift: number; head: number; nod: number; turn: number; ha: V; hb: V; fa: V; fb: V }
class Actor {
  keys: { t: number; p: Pose }[] = [];
  p: Pose;
  constructor(readonly id: string, x: number) {
    this.p = { x, y: 0, z: DEPTH, lean: 0, pitch: 0, lift: 0, head: 0, nod: 0, turn: 0, ha: [-.23, .63], hb: [.23, .66], fa: [x - .105, 0], fb: [x + .105, 0] };
    this.at(0, {});
  }
  at(t: number, patch: Partial<Pose>) {
    if (t < (this.keys.at(-1)?.t ?? 0) - .0001) throw new Error(`${this.id}: motion written out of order at ${t}`);
    this.p = { ...this.p, ...patch };
    this.keys.push({ t, p: structuredClone(this.p) });
  }
  /** Each stride has two distinct lifted/landing feet. The other foot stays planted. */
  walk(t: number, end: number, x: number) {
    this.at(t, {});
    const from = this.p.x, n = Math.max(1, Math.ceil(Math.abs(x - from) / .34)), d = (end - t) / n;
    for (let i = 0; i < n; i++) {
      const a = from + (x - from) * i / n, b = from + (x - from) * (i + 1) / n, s = t + d * i;
      const first = x > from ? 'fb' : 'fa', second = first === 'fa' ? 'fb' : 'fa';
      const offset = (f: 'fa' | 'fb') => f === 'fa' ? -.105 : .105;
      const old = this.p[first][0];
      this.at(s + d * .23, { x: a + (b - a) * .35, lift: -.025, [first]: [(old + b + offset(first)) / 2, .09] });
      this.at(s + d * .46, { x: a + (b - a) * .58, lift: 0, [first]: [b + offset(first), 0] });
      const trailing = this.p[second][0];
      this.at(s + d * .73, { x: a + (b - a) * .85, lift: -.015, [second]: [(trailing + b + offset(second)) / 2, .075] });
      this.at(s + d, { x: b, lift: 0, [second]: [b + offset(second), 0] });
    }
  }
  spin(t: number, d: number) {
    this.at(t, { lift: -.055, ha: [-.22, .78], hb: [.22, .80] });
    this.at(t + d * .25, { turn: 1, lift: -.02, fa: [this.p.x - .06, .065], hb: [.22, .94] });
    this.at(t + d * .55, { turn: 1, lift: -.065, fa: [this.p.x - .105, 0], head: -6 });
    this.at(t + d * .85, { turn: 0, lift: -.025, fb: [this.p.x + .06, .06] });
    this.at(t + d, { turn: 0, lift: 0, fb: [this.p.x + .105, 0], head: 0 });
  }
  bow(t: number, d: number, dir = 1) {
    this.at(t, {});
    this.at(t + d * .38, { lift: -.11, lean: 0, pitch: 22, nod: 24, head: -4 * dir, ha: [-.12, .52], hb: [.16, .54] });
    this.at(t + d * .66, {});
    this.at(t + d, { lift: 0, lean: 0, pitch: 0, nod: 0, head: -3, ha: [-.22, .66], hb: [.22, .68] });
  }
  sample(t: number): Pose {
    let i = 0;
    while (i + 1 < this.keys.length && this.keys[i + 1]!.t <= t) i++;
    const a = this.keys[i]!, b = this.keys[i + 1];
    if (!b) return a.p;
    const u = Math.max(0, Math.min(1, (t - a.t) / (b.t - a.t))), q = u * u * (3 - 2 * u);
    const mix = (x: number, y: number) => x + (y - x) * q;
    return Object.fromEntries(Object.keys(a.p).map(k => {
      const v = a.p[k as keyof Pose], w = b.p[k as keyof Pose];
      return [k, Array.isArray(v) ? v.map((x, j) => mix(x, (w as V)[j]!)) : mix(v, w as number)];
    })) as unknown as Pose;
  }
}

export function perform(tl: Timeline, master: Master, contactSurfaces: Record<'dancer' | 'clown', Record<'handA' | 'handB' | 'footA' | 'footB', number>>) {
  const L = (n: number) => master.lines[n]!.start;
  const D = new Actor('dancer', -.78), C = new Actor('clown', 1.42);

  // Overture: a last rehearsal, his working route and the little hat that enters her pool of light.
  D.at(2, { ha: [-.36, .88], hb: [.30, 1.06], lift: -.06, head: 7 });
  D.at(5, { ha: [-.29, .98], hb: [.30, .89], lift: 0, fa: [-.94, 0], fb: [-.60, .10] });
  D.at(7.2, { fb: [-.675, 0], ha: [-.25, .67], hb: [.24, .72] });
  D.spin(8, 4.2); D.bow(13, 4, 1);
  D.at(20, { head: 8, ha: [-.32, .95], hb: [.26, 1.02] });
  C.at(1, { hb: [.25, .72], ha: [-.24, .62], lean: 3, head: -8 });
  C.walk(2, 8, .86);
  C.at(9, { hb: [-.15, .65], lean: 7 });
  C.at(11, { hb: [.26, .72], lean: -3 });
  C.walk(12, 15, .51);
  C.at(16.8, { lift: -.16, ha: [-.36, .40], hb: [.25, .72], lean: 0, head: -11 });
  C.at(18.5, { lift: 0, ha: [-.26, .92], head: 8 });
  C.at(21, { ha: [-.30, .99], lean: 4 });

  // Her solo: the perfect bow is continually interrupted by the ordinary work of closing a theatre.
  D.at(L(0), { head: 8, ha: [-.27, .98], hb: [.30, 1.02] });
  D.walk(L(0) + 1, L(1) - .3, -.53);
  D.at(L(1), { head: -11, ha: [-.31, .80], hb: [.30, .94] });
  D.bow(L(2), 3.5, 1);
  D.at(L(3), { hb: [.39, .91], head: 9, ha: [-.18, .66] });
  D.at(41.7, { hb: [.28, .73], head: -5 });
  C.at(24, { ha: [-.22, .87], head: -5 }); C.walk(25, 29, .91);
  C.at(30, { ha: [-.31, .76], hb: [-.14, .64], lift: -.07 });
  C.at(34, { hb: [.26, .71], lift: 0, head: -9 });
  C.walk(38, 42, 1.10);

  // His reply: the broom sweeps on an articulated hand; the hem traps one foot, then releases it.
  C.at(L(4), { hb: [-.17, .66], ha: [-.26, .82], head: 6, lean: 5 });
  C.at(L(4) + 1.5, { hb: [.28, .69], lean: -4 });
  C.walk(48.1, 52.3, .60);
  C.at(L(6), { fa: [.51, .035], fb: [.76, 0], x: .63, lift: -.08, lean: -13, head: -12, ha: [-.24, 1.00] });
  C.at(54.8, { x: .72, fa: [.51, .035], fb: [.86, 0], lean: -17, lift: -.13 });
  C.at(L(7) + .3, { x: .65, fa: [.49, .15], fb: [.80, 0], lean: 7, lift: -.03 });
  C.at(58.8, { x: .59, fa: [.485, 0], fb: [.695, 0], lean: 0, head: -6 });
  D.at(45, { head: -8, ha: [-.15, .66], hb: [.22, .78] });
  D.at(51, { hb: [.32, .90], head: 8 });
  D.at(55, { lift: -.06, hb: [.36, .86], head: 12 });

  // Counting, the disputed stool and an unhelpful hat. Neither voice is played as a cheerful comic song.
  D.walk(L(8), 62.5, -.30);
  D.walk(62.9, 65.7, -.18);
  D.at(67.0, { lift: -.13, hb: [.33, .34], ha: [-.24, .71], head: -9 });
  D.at(69.0, { lift: -.04, hb: [.33, .48], head: 6 });
  D.walk(69.5, 74.2, -1.20);
  D.at(74.8, { lift: -.14, hb: [.30, .34], head: -12 });
  D.at(75.6, { lift: 0, hb: [.27, .72], head: 0 });
  D.walk(75.7, 77.8, -.62);
  C.at(L(8), { ha: [-.25, .96], hb: [.25, .72], lift: -.045 });
  C.at(62.5, { fa: [.48, .10], lift: -.05, head: 8 });
  C.at(65.9, { fa: [.485, 0], head: -5, lift: 0 });
  C.at(69, { ha: [-.26, .80], lift: -.09, hb: [.20, .76] });
  C.at(71.6, { ha: [-.29, 1.02], lift: 0, head: 10 });
  C.at(73.1, { ha: [-.26, .95], head: -4 });
  C.at(75.5, { ha: [-.25, .65], hb: [.25, .72] });

  // Refrain 1: approach, reserve a place, turn, give way, extend, recover. This phrase returns twice.
  D.walk(L(12), 81.4, -.43); C.walk(L(12), 81.4, .48);
  D.at(82, { ha: [-.32, .79], hb: [.36, .94], head: 6 });
  C.at(82, { ha: [-.35, .90], hb: [.23, .71], head: -4 });
  D.spin(85.5, 3.4); C.spin(85.8, 3.0);
  D.walk(89.2, 92.7, -.20); C.walk(89.2, 92.7, .76);
  D.at(93.0, { ha: [-.36, .92], hb: [.34, .92], lift: -.09 });
  C.at(93.0, { ha: [-.35, .91], hb: [.24, .72], lift: -.08 });
  D.at(95.4, { lift: 0, fa: [-.45, .12], hb: [.29, 1.02], head: 9 });
  C.at(95.4, { lift: 0, fb: [1.0, .11], ha: [-.29, .98] });
  D.at(97.6, { fa: [-.305, 0], hb: [.34, .82] }); C.at(97.6, { fb: [.865, 0], ha: [-.27, .80] });
  D.walk(98.1, 100.2, -.57); C.walk(98.1, 100.2, .57);
  D.bow(100.5, 3.4, 1); C.bow(100.5, 3.4, -1);
  D.at(105.6, { head: -12, hb: [.17, .75] }); C.at(105.6, { head: -10, hb: [.25, .72] });
  D.walk(107.4, 111.1, -.88); C.walk(107.4, 111.1, .94);
  D.at(112.0, { ha: [-.33, 1.00], hb: [.30, .93], fa: [-1.08, 0], fb: [-.65, .10], head: 6 });
  D.at(114.8, { fb: [-.775, 0], hb: [.25, .75], ha: [-.23, .68], head: 12 });
  C.at(112.2, { hb: [-.10, .72], ha: [-.27, .72], lean: 6 });
  C.at(114.7, { hb: [.25, .72], lean: 0 });

  // Storm: his actual working route passes ladder, bench and falling upright; her jump saves him first.
  C.walk(L(20), 119.0, 1.46);
  C.at(120.5, { hb: [.25, .72], ha: [-.32, .95], head: 12, lean: -4 });
  C.at(122, { hb: [.05, .87], head: 9 });
  C.walk(123.1, 126.0, .89);
  C.at(126.4, { ha: [-.37, .94], hb: [.27, .93], head: 10 });
  C.walk(127, 129.1, .54);
  C.at(130, { lift: -.16, lean: -9, ha: [-.28, .78], hb: [.27, .87], head: 15 });
  C.at(132.0, { lift: -.19, lean: 8, head: 10 });
  C.at(133.5, { ha: [-.36, .91], hb: [.22, .98], lift: -.05, lean: 0 });
  C.walk(134.2, 136.6, .18);
  C.at(137.5, { lift: -.08, ha: [-.32, .90], hb: [.28, .82], head: -11 });
  C.walk(139.0, 142.3, .67);
  C.at(144.3, { ha: [-.37, .96], hb: [.29, .79], lift: -.06, lean: -5 });
  C.at(146.2, { ha: [-.38, .86], hb: [.35, .56], lift: -.08, head: -7 });
  C.at(148.8, { lean: -8, ha: [-.39, .85], lift: -.09 });
  C.at(151.7, { x: .72, fa: [.56, 0], fb: [.86, 0], lift: -.15, lean: -7, ha: [-.39, .84], head: -8 });
  C.at(154.6, { x: .66, fa: [.56, 0], fb: [.86, 0], lift: -.07, lean: -2 });
  C.at(158.8, { x: .68, lift: -.06, lean: -4, ha: [-.37, .86], head: 5 });
  D.at(115.8, { ha: [-.29, .95], hb: [.31, .97], head: 11, lean: 3 });
  D.walk(119.7, 122.9, -.55);
  D.at(123.3, { hb: [.32, 1.04], ha: [-.29, .90], head: 12 });
  D.walk(126.4, 129.0, -.24);
  D.at(130.0, { lift: -.13, head: 13, hb: [.38, .94], ha: [-.27, .96], lean: 4 });
  D.at(132.6, { lift: -.04, lean: 0 });
  D.at(133.3, { hb: [.38, .91], head: 7 });
  D.at(134.0, { y: .12, lift: -.03, fa: [-.42, .12], fb: [-.06, .18], ha: [-.23, .98] });
  D.at(135.1, { y: .18, fa: [-.36, .18], fb: [-.12, .18], lift: 0 });
  D.at(136.5, { y: .18, hb: [.30, .84], head: -6 });
  D.at(137.7, { x: -.37, y: -.04, lift: -.13, lean: 12, fa: [-.56, .03], fb: [-.16, -.17], hb: [.31, .91], ha: [-.31, .97], head: 12 });
  D.at(139.2, { y: -.10, lean: 14, fb: [-.13, -.23], ha: [-.24, 1.04] });
  D.at(142.7, { x: -.43, y: -.08, lean: 9, lift: -.07, hb: [.30, .91], fa: [-.61, 0], fb: [-.18, -.16] });
  D.at(145.2, { hb: [.33, .91], ha: [-.35, .58], lean: 7 });
  D.at(148.0, { lift: -.10, lean: 10, head: -8 });
  D.at(151.8, { x: -.49, lean: 11, lift: -.13, hb: [.35, .90], fb: [-.19, -.13] });
  D.at(154.7, { x: -.43, lift: -.06, lean: 6 });
  D.at(158.8, { head: 6, lean: 5, hb: [.32, .92] });

  // Refrain 2: same approach/turn/extend/recover, now with reciprocal weight and a taut red sash.
  D.at(162.8, { x: -.40, y: -.045, fa: [-.60, 0], fb: [-.16, -.08], lean: 7, hb: [.33, .91] });
  C.at(162.8, { x: .64, lean: -5, fa: [.52, 0], fb: [.84, 0], ha: [-.37, .87] });
  D.at(166.0, { x: -.35, y: 0, lift: -.09, fb: [-.13, .10], hb: [.31, .89], lean: 4 });
  C.at(166.0, { x: .68, lift: -.12, lean: -8, ha: [-.37, .86] });
  D.at(169.6, { fa: [-.53, 0], fb: [-.13, .14], lift: -.05, ha: [-.38, .73], head: -4 });
  C.at(169.6, { x: .64, lift: -.05, lean: -3, head: -5 });
  D.at(172.6, { x: -.28, fa: [-.53, 0], fb: [.015, .10], hb: [.30, .87], lean: 3 });
  C.at(172.6, { x: .72, fa: [.56, 0], fb: [.88, 0], lift: -.09, ha: [-.37, .84], lean: -6 });
  D.at(175.9, { x: -.34, lift: -.13, lean: 9, fb: [-.13, .12], hb: [.30, .90] });
  C.at(175.9, { x: .67, lift: -.13, lean: -7, ha: [-.36, .84] });
  D.at(178.5, { x: -.24, y: .015, lift: -.04, fb: [.07, .14], lean: 2, hb: [.30, .87] });
  C.at(178.5, { x: .73, lift: -.12, ha: [-.38, .84], lean: -5 });
  D.at(181.9, { x: -.14, y: 0, fa: [-.43, .09], fb: [.07, 0], lift: -.06, lean: 0 });
  C.at(181.9, { x: .76, lift: -.13, ha: [-.36, .85] });
  D.at(185.0, { x: -.12, fa: [-.32, 0], fb: [.07, 0], lift: -.10, hb: [.31, .87] });
  C.at(185.0, { lift: -.09, lean: -3, ha: [-.36, .86], head: -8 });
  D.at(188.5, { x: -.20, fa: [-.32, 0], fb: [-.03, 0], lift: -.055, lean: 3, head: -7 });
  C.at(188.5, { lift: -.06, head: -7 });
  D.at(192.3, { y: 0, lean: 0, lift: 0, hb: [.28, .83], ha: [-.24, .71] });
  C.at(192.3, { lift: 0, lean: 0, ha: [-.30, .83], hb: [.24, .70] });
  D.walk(192.5, 195.2, -.49); C.walk(192.5, 195.2, .53);

  // Bridge: the old perfect solo is recalled in a broken, kneeling phrase. He answers with offered hands.
  D.at(L(40), { ha: [-.32, .96], hb: [.32, .97], head: 7 });
  D.at(198.7, { lift: -.07, head: -7, hb: [.18, .76] });
  D.spin(199, 3.1);
  D.at(203.1, { lift: -.28, lean: 0, ha: [-.10, .49], hb: [.28, .31], head: -12, fa: [-.25, .03], fb: [-.24, 0] });
  D.at(205.5, { head: -9, hb: [.32, .75] });
  D.at(208.7, { lift: -.03, lean: 0, head: 7, ha: [-.22, .70], hb: [.32, .87], fa: [-.595, 0], fb: [-.385, 0] });
  D.at(212.8, { hb: [.31, .86], head: -4 });
  D.at(217.8, { lift: -.10, lean: 5, hb: [.33, .85], head: -10 });
  D.at(223.8, { lift: 0, lean: 0, head: 4, hb: [.34, .88] });
  C.at(196.2, { ha: [-.29, .84], hb: [.26, .78], head: -7 });
  C.at(201.4, { lift: -.06, head: -10, ha: [-.32, .79] });
  C.at(205.4, { ha: [-.34, .81], hb: [.28, .91], lift: -.12, lean: -4 });
  C.at(209.0, { lift: -.04, lean: 0, head: 4 });
  C.at(L(44), { ha: [-.21, .74], hb: [.21, .72], head: -9 });
  C.at(214.6, { lift: -.17, ha: [-.20, .42], hb: [.16, .43], head: -15 });
  C.at(217.5, { lift: -.06, ha: [-.34, .81], hb: [.28, .88], head: 3 });
  C.at(220.0, { lift: -.11, lean: -4, ha: [-.35, .84], head: -6 });
  C.at(224.1, { lift: 0, lean: 0, ha: [-.34, .88], hb: [.25, .85], head: 2 });

  // Refrain 3: the same steps, chosen together, over the only surviving boards. No restoration of the set.
  D.walk(L(48), 230.8, -.40); C.walk(L(48), 230.8, .40);
  D.at(231.2, { ha: [-.35, .92], hb: [.40, .87], lift: -.07, head: 4 });
  C.at(231.2, { ha: [-.40, .87], hb: [.34, .91], lift: -.07, head: -4 });
  D.at(234.3, { lift: 0, fa: [-.60, .09], head: 6 }); C.at(234.3, { lift: 0, fb: [.60, .09], head: -5 });
  D.spin(235.16, 3.10); C.spin(235.35, 3.05);
  D.at(238.7, { ha: [-.33, .90], hb: [.34, .85], lift: -.04, head: 5 });
  C.at(238.7, { ha: [-.34, .85], hb: [.33, .90], lift: -.04, head: -5 });
  D.at(240, { lift: 0, lean: 0 }); C.at(240, { lift: 0, lean: 0 });
  D.walk(242.5, 245.8, -.54); C.walk(242.5, 245.8, .54);
  D.at(246.4, { lift: -.10, ha: [-.34, .93], head: -4 }); C.at(246.4, { lift: -.10, hb: [.34, .93], head: -4 });
  D.at(248.9, { lift: 0, fa: [-.72, .10] }); C.at(248.9, { lift: 0, fb: [.72, .10] });
  D.at(250.6, { fa: [-.645, 0], head: -8 }); C.at(250.6, { fb: [.645, 0], head: -8 });
  D.walk(251.0, 253.6, -.40); C.walk(251.0, 253.6, .40);
  D.at(255.6, { ha: [-.25, .77], lift: -.055, head: -12 }); C.at(255.6, { hb: [.25, .76], lift: -.055, head: -12 });
  D.at(258.5, { lift: -.11, lean: 5, head: -10 }); C.at(258.5, { lift: -.11, lean: -5, head: -10 });
  D.at(261.4, { lift: 0, lean: 0, head: -5, ha: [-.23, .66], hb: [.30, .82] });
  C.at(261.4, { lift: 0, lean: 0, head: -5, ha: [-.30, .82], hb: [.23, .67] });
  D.at(265.6, { hb: [.22, .70], head: -11 });
  C.at(263.3, { ha: [-.22, .64], hb: [.25, .72], head: -10 });
  C.walk(264.0, 270.5, 1.46);
  C.at(271.7, { hb: [.353, .676], head: -12, lift: -.06 });

  // He returns to work automatically. She crosses to him and brings him back for the final, costly bow.
  C.walk(272.8, 279.8, 1.88);
  C.at(281.4, { head: -10, ha: [-.29, .75], hb: [.25, .72], lift: -.04 });
  D.at(272.6, { ha: [-.18, .66], hb: [.28, .79], head: 8 });
  D.walk(277.2, 284.8, 1.00);
  D.at(285.2, { hb: [.38, .85], head: 7 });
  C.at(285.2, { ha: [-.38, .85], head: 5, lift: 0 });
  D.walk(286.2, 292.0, -.38); C.walk(286.2, 292.0, .38);
  D.bow(293.5, 4.4, 1); C.bow(293.5, 4.4, -1);

  // Thirty seconds of minor coda: fold the sash, collect the objects, lift the case, leave the closed house.
  D.at(299.6, { lift: -.17, ha: [.12, .41], hb: [.20, .41], head: -14 });
  D.at(301.0, { lift: -.04, ha: [-.20, .53], hb: [.23, .55], head: -9 });
  D.walk(301.4, 307.0, 1.82);
  D.at(308.0, { lift: -.10, hb: [.30, .50], ha: [-.22, .53], head: -12 });
  D.at(309.6, { lift: 0, hb: [.22, .50], ha: [-.22, .53], head: -9 });
  D.walk(311.0, 316.5, 2.85);
  D.at(317.2, { head: -14, lean: 3, lift: -.04 });
  D.walk(318.2, 323.0, 3.25);
  C.at(299, { hb: [.25, .72], ha: [-.23, .65], head: -11 });
  C.walk(300.0, 304.5, 1.16);
  C.at(306.0, { lift: -.26, hb: [.36, .216], ha: [-.18, .63], head: -12 });
  C.at(308.5, { lift: -.07, hb: [.36, .58], lean: -3, head: -8 });
  C.walk(310.5, 316.8, 2.16);
  C.at(317.4, { head: -13, lean: 2, lift: -.06 });
  C.walk(318.2, 323.0, 2.72);

  // Hand-to-hand constraints are active only for the physical catches and the chosen farewell partnership.
  const joins: [number, number][] = [[133.4, 136.4], [228.0, 234.6], [239.3, 262.0], [285.2, 298.2]];
  // A sole on a damaged board follows its actual tilted top, rather than hovering over the old floor line.
  const deckOffset = (x: number, t: number) => {
    const q = Math.max(0, Math.min(1, (t - L(26)) / 1.6)), f = q < .5 ? 4 * q ** 3 : 1 - (-2 * q + 2) ** 3 / 2;
    const top = (angle: number, centre: number, drop = 0) => {
      const a = angle * f * Math.PI / 180;
      return GROUND / Math.cos(a) + Math.tan(a) * (x - centre) + drop * f - GROUND;
    };
    const smooth = (v: number) => { const a = Math.max(0, Math.min(1, v)); return a * a * (3 - 2 * a); };
    if (Math.abs(x) < .50) return top(-8, 0, -.085) * (1 - smooth((Math.abs(x) - .40) / .10));
    if (x < -1.34 && x > -2.34) return top(5, -1.84) * smooth((-x - 1.34) / .10);
    if (x > 1.34 && x < 2.34) return top(-6, 1.84) * smooth((x - 1.34) / .10);
    return 0;
  };
  const fps = 60, count = Math.ceil((master.duration + 11) * fps) + 1;
  const smooth = (v: number) => { const q = Math.max(0, Math.min(1, v)); return q * q * (3 - 2 * q); };
  // The outside arms lead with the elbow out and the palm below the shoulder. The original high, close
  // targets over-folded them across the chest. Keep their authored sweep while opening that silhouette.
  const relaxed = (v: V, side: number): V => {
    const spread = smooth((v[1] - .65) / .35);
    return [v[0] + (side * .43 - v[0]) * spread, v[1] <= .5 ? v[1] : .5 + (v[1] - .5) * .42];
  };
  for (const a of [D, C]) {
    const data = new Map<string, number[]>();
    const put = (ch: string, v: number) => { if (!data.has(ch)) data.set(ch, []); data.get(ch)!.push(v); };
    for (let f = 0; f < count; f++) {
      const t = f / fps, p = a.sample(t), other = (a === D ? C : D).sample(t);
      let ha: V = [...p.ha], hb: V = [...p.hb];
      if (a === D) {
        ha = relaxed(ha, -1);
        if (t < 298) ha[1] += p.lift;
      }
      else {
        hb = relaxed(hb, 1);
        hb[1] += p.lift * (1 - smooth((t - 304.5) / 1.5));
        // His hat is carried away from the chest, at a comfortable height. Ease both pickup and release.
        if (p.ha[1] < .8) ha[0] = Math.min(ha[0], -.36);
        const hat = smooth((t - 16.8) / 1.7) * (1 - smooth((t - 73.1) / 2.4));
        ha = [ha[0] + (-.40 - ha[0]) * hat, ha[1] + (.65 + .22 * (p.ha[1] - .8) - ha[1]) * hat];
        const broom = (1 - smooth((t - 75.5) / .6)) + smooth((t - 111.6) / .6) * (1 - smooth((t - 120.5) / .6)) + smooth((t - 271.1) / .6) * (1 - smooth((t - 281.6) / .6));
        const w = Math.min(1, broom);
        hb = [hb[0] + (p.hb[0] - hb[0]) * w, hb[1] + (.495 + (p.hb[1] - .72) * .25 - hb[1]) * w];
      }
      put('x', p.x); put('y', p.y); put('z', p.z - DEPTH); put('rz', p.lean); put('rx', p.pitch); put('lift', p.lift); put('head', p.head); put('headPitch', p.nod); put('turn', p.turn);
      for (const [name, v] of [['handA', ha], ['handB', hb], ['footA', p.fa], ['footB', p.fb]] as const) {
        const hand = name.startsWith('hand'), partnerHand = a === D ? name === 'handB' : name === 'handA';
        // Turn contacts with the card. Keeping goals on their original screen sides crossed the arms
        // and legs. The actual face depth also keeps the solve on its painted plane near edge-on.
        const phi = (p.turn < .5 ? p.turn : p.turn - 1) * Math.PI;
        const depth = contactSurfaces[a.id as 'dancer' | 'clown'][name];
        const localX = hand ? v[0] : v[0] - p.x;
        let x = p.x + localX * Math.cos(Math.PI * p.turn) + depth * Math.sin(phi);
        let y = GROUND + (hand ? p.y + v[1] : v[1] + (v[1] >= 0 ? deckOffset(x, t) : 0));
        const z = p.z - localX * Math.sin(Math.PI * p.turn) + depth * Math.cos(phi);
        if (partnerHand) {
          for (const [start, end] of joins) {
            const w = Math.max(0, Math.min(1, (t - start) / .45, (end - t) / .45));
            if (w > 0) { x += ((p.x + other.x) / 2 - x) * w; y += (GROUND + .86 - y) * w; }
          }
        }
        put(`${name}x`, x); put(`${name}y`, y); put(`${name}z`, z);
      }
    }
    for (const [ch, v] of data) tl.signal(`${a.id}.${ch}`, fps, v, true);
    for (const name of ['handA', 'handB', 'footA', 'footB']) tl.base(`${a.id}.${name}`, 1);
    tl.signal(`${a.id}.sing`, master.vox?.fps ?? 30, master.vox?.[a.id] ?? []);
  }
}
