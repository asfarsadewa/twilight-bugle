import type { Line, Production } from '../core/types.ts';

// Surtitles under the stage. Each production names its main line (the sung language) and its second line.
//   The Daybreak Vow   main Mandarin, second Indonesian
//   Bintang Senja      main Indonesian, second Mandarin
// English and pinyin are off by default. setLanguages() turns them on.
// A line fades in a beat before it is sung and stays until the next line or a little after its end.

const LEAD = 0.25;
const TAIL = 1.4;
const FADE = 0.3;

type Lang = 'zh' | 'id' | 'en' | 'py' | 'jv' | 'ko';

export class Surtitles {
  private el: HTMLElement;
  private current = -2;
  private lines: Line[] = [];
  private voices: Production['voices'] | null = null;
  private order: { main: Lang; second: Lang } = { main: 'zh', second: 'id' };

  constructor(parent: HTMLElement, langs: { en: boolean; py: boolean }) {
    this.el = document.createElement('div');
    this.el.className = 'surtitles';
    this.setLanguages(langs);
    this.el.innerHTML = '<div class="who"></div><div class="main"></div><div class="py"></div><div class="tr"><span class="second"></span><span class="en"></span></div>';
    parent.append(this.el);
  }

  setLanguages(langs: { en: boolean; py: boolean }) {
    this.el.dataset.en = langs.en ? '1' : '0';
    this.el.dataset.py = langs.py ? '1' : '0';
  }

  get languages() {
    return { en: this.el.dataset.en === '1', py: this.el.dataset.py === '1' };
  }

  load(p: Production | null) {
    this.lines = p?.master.lines ?? [];
    this.voices = p?.voices ?? null;
    this.order = p?.surtitles ?? { main: 'zh', second: 'id' };
    this.el.dataset.main = this.order.main;
    this.el.dataset.second = this.order.second;
    this.current = -2;
    this.el.style.opacity = '0';
  }

  /** t is song time. enabled is 0..1 from the timeline, so a cue can hide the surtitles. */
  update(t: number, enabled: number) {
    let i = -1;
    for (let k = 0; k < this.lines.length; k++) {
      const l = this.lines[k]!;
      const next = this.lines[k + 1]?.start ?? Infinity;
      if (t >= l.start - LEAD && t < Math.min(next - LEAD, l.end + TAIL)) i = k;
    }
    if (i !== this.current) {
      this.current = i;
      if (i >= 0) {
        const l = this.lines[i]!;
        const v = this.voices?.[l.who];
        const q = (s: string) => this.el.querySelector(s) as HTMLElement;
        q('.who').textContent = v?.name ?? '';
        this.el.style.setProperty('--voice', v?.color ?? '#e9dcc0');
        q('.main').textContent = l[this.order.main] ?? '';
        q('.py').textContent = l.py ?? '';
        q('.second').textContent = l[this.order.second] ?? '';
        q('.en').textContent = l.en ?? '';
      }
    }
    let alpha = 0;
    if (i >= 0) {
      const l = this.lines[i]!;
      const next = this.lines[i + 1]?.start ?? Infinity;
      const end = Math.min(next - LEAD, l.end + TAIL);
      alpha = Math.min(1, (t - (l.start - LEAD)) / FADE, (end - t) / FADE);
    }
    this.el.style.opacity = String(Math.max(0, alpha) * enabled);
  }
}
