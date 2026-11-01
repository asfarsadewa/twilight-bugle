// The timeline: every animated value on stage is a channel, and a channel is a list of keys in time.
// A frame reads each channel at one time. The same time always gives the same frame, so the live theatre
// and the video renderer show the same show.

export type Ease = 'linear' | 'in' | 'out' | 'inOut' | 'step' | 'back' | 'outBack' | 'bounce' | 'sine';

const HOLD = Symbol('hold');

interface Key {
  t: number;
  v: number | typeof HOLD;
  ease: Ease;
  order: number;
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
  private keys = new Map<string, Key[]>();
  private bases = new Map<string, number>();
  private compiled = new Map<string, { t: Float64Array; v: Float64Array; e: Ease[] }>();
  private order = 0;
  /** Time where the show ends. The renderer stops here. */
  end = 0;

  /** The value of a channel before its first key. */
  base(ch: string, v: number): this {
    this.bases.set(ch, v);
    return this;
  }

  /** Jump to a value at time t. */
  set(ch: string, v: number, t: number): this {
    this.push(ch, { t, v: HOLD, ease: 'step', order: this.order++ });
    this.push(ch, { t: t + 1e-4, v, ease: 'step', order: this.order++ });
    return this;
  }

  /** Move from the value at time t to v at time t + dur. */
  to(ch: string, v: number, t: number, dur: number, e: Ease = 'inOut'): this {
    this.push(ch, { t, v: HOLD, ease: 'linear', order: this.order++ });
    this.push(ch, { t: t + Math.max(1e-3, dur), v, ease: e, order: this.order++ });
    this.end = Math.max(this.end, t + dur);
    return this;
  }

  /** A key at time t with no move before it. Use it to pin a value before a later move. */
  hold(ch: string, t: number): this {
    this.push(ch, { t, v: HOLD, ease: 'linear', order: this.order++ });
    return this;
  }

  private signals = new Map<string, { fps: number; v: ArrayLike<number> }>();

  /** A channel sampled at a fixed rate, such as the loudness of a voice. It replaces keys on that channel. */
  signal(ch: string, fps: number, v: ArrayLike<number>): this {
    this.signals.set(ch, { fps, v });
    return this;
  }

  has(ch: string): boolean {
    return this.keys.has(ch) || this.bases.has(ch) || this.signals.has(ch);
  }

  private push(ch: string, k: Key) {
    let list = this.keys.get(ch);
    if (!list) this.keys.set(ch, (list = []));
    list.push(k);
    this.compiled.delete(ch);
  }

  /** The fallback is the value a channel has before its first key when it has no base. */
  private compile(ch: string, fallback: number) {
    const list = [...(this.keys.get(ch) ?? [])].sort((a, b) => a.t - b.t || a.order - b.order);
    const base = this.bases.get(ch) ?? fallback;
    const t = new Float64Array(list.length), v = new Float64Array(list.length), e: Ease[] = [];
    // A hold key takes the value the channel has at its time.
    for (let i = 0; i < list.length; i++) {
      const k = list[i]!;
      t[i] = k.t;
      e.push(k.ease);
      v[i] = k.v === HOLD ? (i === 0 ? base : this.sample(t, v, e, i, k.t)) : k.v;
    }
    const c = { t, v, e };
    this.compiled.set(ch, c);
    return c;
  }

  /** Value at time `at` using only the first n keys. */
  private sample(t: Float64Array, v: Float64Array, e: Ease[], n: number, at: number): number {
    let i = n - 1;
    while (i > 0 && t[i]! > at) i--;
    if (i === n - 1 || t[i + 1]! <= at) return v[i]!;
    const k = (at - t[i]!) / (t[i + 1]! - t[i]!);
    return v[i]! + (v[i + 1]! - v[i]!) * ease[e[i + 1]!](k);
  }

  value(ch: string, at: number, fallback = 0): number {
    const sig = this.signals.get(ch);
    if (sig) {
      const f = at * sig.fps;
      const i = Math.floor(f);
      if (i < 0 || i >= sig.v.length - 1) return 0;
      return sig.v[i]! + (sig.v[i + 1]! - sig.v[i]!) * (f - i);
    }
    if (!this.keys.has(ch)) return this.bases.get(ch) ?? fallback;
    const c = this.compiled.get(ch) ?? this.compile(ch, fallback);
    const n = c.t.length;
    if (at <= c.t[0]!) return c.v[0]!;
    if (at >= c.t[n - 1]!) return c.v[n - 1]!;
    // Binary search for the last key at or before `at`.
    let lo = 0, hi = n - 1;
    while (hi - lo > 1) {
      const mid = (lo + hi) >> 1;
      if (c.t[mid]! <= at) lo = mid;
      else hi = mid;
    }
    const k = (at - c.t[lo]!) / (c.t[hi]! - c.t[lo]!);
    return c.v[lo]! + (c.v[hi]! - c.v[lo]!) * ease[c.e[hi]!](k);
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
