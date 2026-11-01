// The door of the theatre: an old house on an empty street at night. It is the loading screen. The neon sign above
// the entrance lights one letter at a time as the house loads, and the light between the closed doors grows. When
// the house is ready, a click on the doors lets the light out and the audience walks in.
//
// The gate: on the live site the Worker asks for a Turnstile check before it serves the heavy media. /api/gate tells
// the page whether the gate is on and gives the sitekey. A dev server has no /api/gate, so the door opens at once.

const SIGN = 'Twilight Bugle';
/** The tube that never quite works. */
const BROKEN = 9;

declare global {
  interface Window {
    turnstile?: { render(el: HTMLElement, opts: Record<string, unknown>): string; reset(id: string): void; remove(id: string): void };
  }
}

export class Door {
  private el = document.getElementById('door')!;
  private neon = document.getElementById('neon')!;
  private doors = document.getElementById('enter') as HTMLButtonElement;
  private line = document.getElementById('door-line')!;
  private letters: HTMLElement[] = [];
  private shown = 0;
  private waiting: AbortController | null = null;

  constructor() {
    for (const [i, ch] of [...SIGN].entries()) {
      const s = document.createElement('span');
      s.textContent = ch;
      if (i === BROKEN) s.classList.add('broken');
      this.neon.append(s);
      if (ch !== ' ') this.letters.push(s);
    }
  }

  /** Load progress, 0..1. It never goes back. */
  progress(p: number) {
    this.shown = Math.max(this.shown, Math.min(1, p));
    const lit = Math.floor(this.shown * this.letters.length + 1e-6);
    this.letters.forEach((s, i) => s.classList.toggle('on', i < lit));
    this.el.querySelector<HTMLElement>('.doors')!.style.setProperty('--p', String(this.shown));
    document.getElementById('load-bar')!.style.width = `${Math.round(this.shown * 100)}%`;
    document.getElementById('load-pct')!.textContent = `${Math.round(this.shown * 100)}%`;
  }

  say(text: string) {
    this.line.textContent = text;
  }

  /**
   * After a failure the doors become the retry control: the line says what failed, and a click on the doors
   * (or Enter on them) tries again. Resolves on that click.
   */
  private retry(text: string): Promise<void> {
    this.say(`${text} Click the doors to try again.`);
    this.el.classList.add('retry');
    this.doors.disabled = false;
    const ac = new AbortController();
    this.waiting = ac;
    return new Promise((resolve) => {
      this.doors.addEventListener(
        'click',
        () => {
          this.endRetry();
          resolve();
        },
        { once: true, signal: ac.signal },
      );
    });
  }

  /** Takes the retry off the doors. A retry that nobody clicked never resolves. */
  private endRetry() {
    this.waiting?.abort();
    this.waiting = null;
    this.doors.disabled = true;
    this.el.classList.remove('retry');
  }

  /**
   * The Turnstile gate. Resolves when the Worker accepts a token, or at once if the site has no gate. It never
   * gives up: each failure (network, script, challenge, verification) offers a retry on the doors, and the
   * widget's own later success also lets the visitor in.
   */
  async gate(): Promise<void> {
    let sitekey: string | null = null;
    while (sitekey === null) {
      try {
        const r = await fetch('/api/gate', { headers: { accept: 'application/json' } });
        // No gate endpoint (a dev server) means no gate.
        sitekey = r.ok && (r.headers.get('content-type') ?? '').includes('json') ? (((await r.json()) as { sitekey?: string }).sitekey ?? '') : '';
      } catch {
        await this.retry('The theatre does not answer.');
      }
    }
    if (!sitekey) return;
    this.say('Checking that you are a person.');
    while (!window.turnstile) {
      await loadScript('https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit').catch(() => {});
      if (!window.turnstile) {
        await this.retry('The check did not load.');
        this.say('Checking that you are a person.');
      }
    }
    // Each token the widget gives feeds the current wait, so a success after an error still counts.
    let take: (token: string) => void = () => {};
    let next = new Promise<string>((r) => (take = r));
    let failed: Promise<void> | null = null;
    const fail = (text: string) => {
      failed ??= this.retry(text).then(() => {
        failed = null;
        this.say('Checking that you are a person.');
        window.turnstile!.reset(widget);
      });
    };
    const widget = window.turnstile.render(document.getElementById('gate')!, {
      sitekey,
      action: 'enter',
      theme: 'dark',
      appearance: 'interaction-only',
      callback: (token: string) => take(token),
      'error-callback': () => fail('The check failed.'),
      'timeout-callback': () => fail('The check timed out.'),
      'expired-callback': () => window.turnstile!.reset(widget),
    });
    for (;;) {
      const token = await next;
      next = new Promise<string>((r) => (take = r));
      if (failed) {
        // The widget recovered on its own while the doors offered a retry.
        failed = null;
        this.endRetry();
        this.say('Checking that you are a person.');
      }
      let ok = false;
      try {
        const r = await fetch('/api/enter', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ token }) });
        ok = r.ok;
      } catch {
        ok = false;
      }
      if (ok) break;
      // A token works once. A new attempt needs a fresh challenge.
      fail('The check failed.');
    }
    window.turnstile.remove(widget);
    document.getElementById('gate')!.replaceChildren();
    this.say('The theatre is opening.');
  }

  /** The house is ready: the sign is fully lit, and the doors take a click. */
  ready(): Promise<void> {
    this.progress(1);
    this.neon.classList.add('lit');
    this.el.classList.add('ready');
    this.doors.disabled = false;
    this.say('The doors are open. Click them to go in.');
    return new Promise((resolve) => {
      const go = () => {
        this.doors.disabled = true;
        this.el.classList.add('open');
        this.el.classList.add('gone');
        resolve();
      };
      this.doors.addEventListener('click', go, { once: true });
      addEventListener('keydown', (e) => {
        if (!this.doors.disabled && (e.code === 'Enter' || e.code === 'Space')) go();
      });
    });
  }
}

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = src;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error(`script ${src}`));
    document.head.append(s);
  });
}
