// The timeline: every animated value on stage is a channel, and a channel is a list of cues in time.
// A frame reads each channel at one time. The same time always gives the same frame, so the live theatre
// and the video renderer show the same show.
//
// A cue moves a channel from the value it has at the cue's start to a target. If a cue starts while an earlier
// cue still moves the channel, the later cue takes over at its start: the earlier move stops there, on its own
// curve. So a cue never changes a channel before its own start.

export type Ease = 'linear' | 'in' | 'out' | 'inOut' | 'step' | 'back' | 'outBack' | 'bounce' | 'sine';

interface Cue {
  t0: number;
  t1: number;
  /** The target. A pin has none: it keeps the value it finds and stops any move in progress. */
  v: number | null;
  ease: Ease;
  order: number;
}

/** A channel compiled: stretch i runs from a[i] at t0[i] toward b[i] at t1[i], until the next stretch starts. */
interface Compiled {
  t0: Float64Array;
  t1: Float64Array;
  a: Float64Array;
  b: Float64Array;
  e: Ease[];
}

/** The value of stretch i at a time at or after its start. */
function along(c: Compiled, i: number, at: number): number {
  const t1 = c.t1[i]!;
  if (at >= t1) return c.b[i]!;
  const t0 = c.t0[i]!;
  return c.a[i]! + (c.b[i]! - c.a[i]!) * ease[c.e[i]!]((at - t0) / (t1 - t0));
}

export const ease: Record<Ease, (k: number) => number> = {
  linear: (k) => k,
  in: (k) => k * k * k,
  out: (k) => 1 - (1 - k) ** 3,
  inOut: (k) => (k < 0.5 ? 4 * k * k * k : 1 - (-2 * k + 2) ** 3 / 2),
  step: (k) => (k < 1 ? 0 : 1),
  back: (k) => {
    const c = 1.70158 * 1.525;
    return k < 0.5 ? ((2 * k) ** 2 * ((c + 1) * 2 * k - c)) / 2 : ((2 * k - 2) ** 2 * ((c + 1) * (k * 2 - 2) + c) + 2) / 2;
  },
  outBack: (k) => 1 + 2.70158 * (k - 1) ** 3 + 1.70158 * (k - 1) ** 2,
  bounce: (k) => {
    const n = 7.5625, d = 2.75;
    if (k < 1 / d) return n * k * k;
    if (k < 2 / d) return n * (k -= 1.5 / d) * k + 0.75;
    if (k < 2.5 / d) return n * (k -= 2.25 / d) * k + 0.9375;
    return n * (k -= 2.625 / d) * k + 0.984375;
  },
  sine: (k) => 0.5 - Math.cos(Math.PI * k) / 2,
};

export class Timeline {
  private cues = new Map<string, Cue[]>();
  private bases = new Map<string, number>();
  private compiled = new Map<string, Compiled>();
  private order = 0;
  /** Time where the show ends. The renderer stops here. */
  end = 0;

  /** The value of a channel before its first cue. */
  base(ch: string, v: number): this {
    this.bases.set(ch, v);
    this.compiled.delete(ch);
    return this;
  }

  /** Jump to a value at time t. A cue written after it at the same time moves on from the new value. */
  set(ch: string, v: number, t: number): this {
    this.push(ch, { t0: t, t1: t, v, ease: 'step', order: this.order++ });
    return this;
  }

  /** Move from the value at time t to v at time t + dur. */
  to(ch: string, v: number, t: number, dur: number, e: Ease = 'inOut'): this {
    this.push(ch, { t0: t, t1: t + Math.max(1e-3, dur), v, ease: e, order: this.order++ });
    this.end = Math.max(this.end, t + dur);
    return this;
  }

  /** Keeps the value the channel has at time t, and stops any move in progress there. */
  hold(ch: string, t: number): this {
    this.push(ch, { t0: t, t1: t, v: null, ease: 'linear', order: this.order++ });
    return this;
  }

  private signals = new Map<string, { fps: number; v: ArrayLike<number> }>();

  /** A channel sampled at a fixed rate, such as the loudness of a voice. It replaces keys on that channel. */
  signal(ch: string, fps: number, v: ArrayLike<number>): this {
    this.signals.set(ch, { fps, v });
    return this;
  }

  has(ch: string): boolean {
    return this.cues.has(ch) || this.bases.has(ch) || this.signals.has(ch);
  }

  private push(ch: string, c: Cue) {
    let list = this.cues.get(ch);
    if (!list) this.cues.set(ch, (list = []));
    list.push(c);
    this.compiled.delete(ch);
  }

  /** The fallback is the value a channel has before its first cue when it has no base. */
  private compile(ch: string, fallback: number): Compiled {
    // By start time. Cues that start together keep the order they were written in, and the last one wins.
    const list = [...(this.cues.get(ch) ?? [])].sort((x, y) => x.t0 - y.t0 || x.order - y.order);
    const n = list.length;
    const c: Compiled = { t0: new Float64Array(n), t1: new Float64Array(n), a: new Float64Array(n), b: new Float64Array(n), e: [] };
    for (let i = 0; i < n; i++) {
      const cue = list[i]!;
      // The cue starts from the value the channel has at its start, on the stretch before it.
      const from = i === 0 ? (this.bases.get(ch) ?? fallback) : along(c, i - 1, cue.t0);
      c.t0[i] = cue.t0;
      c.t1[i] = cue.v === null ? cue.t0 : cue.t1;
      c.a[i] = from;
      c.b[i] = cue.v ?? from;
      c.e.push(cue.ease);
    }
    this.compiled.set(ch, c);
    return c;
  }

  value(ch: string, at: number, fallback = 0): number {
    const sig = this.signals.get(ch);
    if (sig) {
      const f = at * sig.fps;
      const i = Math.floor(f);
      if (i < 0 || i >= sig.v.length - 1) return 0;
      return sig.v[i]! + (sig.v[i + 1]! - sig.v[i]!) * (f - i);
    }
    if (!this.cues.has(ch)) return this.bases.get(ch) ?? fallback;
    const c = this.compiled.get(ch) ?? this.compile(ch, fallback);
    if (at < c.t0[0]!) return c.a[0]!;
    // Binary search for the last stretch that starts at or before `at`. It is the one in force.
    let lo = 0, hi = c.t0.length;
    while (hi - lo > 1) {
      const mid = (lo + hi) >> 1;
      if (c.t0[mid]! <= at) lo = mid;
      else hi = mid;
    }
    return along(c, lo, at);
  }
}

/** Seeded random numbers, so a frame never depends on when it was drawn. */
export function rng(seed: number) {
  let s = seed >>> 0 || 1;
  return () => {
    s ^= s << 13;
    s ^= s >>> 17;
    s ^= s << 5;
    return (s >>> 0) / 4294967296;
  };
}

/** Smooth noise in time for small living motions: breathing, sway, flicker. */
export function wobble(t: number, seed: number, speed = 1): number {
  const a = Math.sin(t * 1.31 * speed + seed * 12.9898) * 0.5;
  const b = Math.sin(t * 2.17 * speed + seed * 78.233) * 0.3;
  const c = Math.sin(t * 3.73 * speed + seed * 37.719) * 0.2;
  return a + b + c;
}
