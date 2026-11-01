import { DefaultLoadingManager } from 'three';
import { Theatre } from './theatre.ts';
import { Door } from './ui/door.ts';
import { roman } from './house/posters.ts';
import { repertoire } from './productions.ts';
import type { Production } from './core/types.ts';

// Two modes.
//   live    the house: one poster for each show hangs on the wall beside the arch, under the house lights.
//           A poster opens its programme. The seal on the programme raises the curtain, and the camera takes
//           its seat. If another show is on stage, the crew changes the set in view first.
//   render  ?render=1&p=<id>. No house wall. tools/render.mjs steps frames through window.__theatre.

const params = new URLSearchParams(location.search);
const RENDER = params.has('render');
document.body.classList.toggle('render', RENDER);

const $ = (id: string) => document.getElementById(id)!;
const frame = $('frame');
// Render mode draws twice the pixels and the browser scales the frame down: 2x supersampling.
const subs = { en: params.get('en') === '1', py: params.get('py') === '1' };
// A phone draws fewer pixels, so the depth, light and grain passes keep their frame rate.
const PHONE = matchMedia('(pointer: coarse)').matches && Math.min(screen.width, screen.height) < 820;
const ratio = RENDER ? Number(params.get('ssaa') ?? 2) : PHONE ? 0.5 : Math.min(2, devicePixelRatio || 1);
// A phone starts on the lighter tier. Renders always use the full one.
const theatre = new Theatre(frame, 1920, 1080, ratio, subs, PHONE && !RENDER);
const audio = new Audio();
audio.preload = 'auto';

declare global {
  interface Window {
    __theatre?: { ready: boolean; start: number; end: number; fps: number; renderAt(t: number): Promise<void>; audio: string };
  }
}

async function boot() {
  await document.fonts.ready;

  if (RENDER) {
    await theatre.init('/house/house.glb');
    const entry = repertoire.find((r) => r.id === params.get('p')) ?? repertoire[0];
    if (!entry) throw new Error('No production in productions/.');
    const p = await entry.load();
    await theatre.load(p);
    window.__theatre = {
      ready: true,
      start: theatre.start,
      end: theatre.end,
      fps: 30,
      audio: p.audio,
      renderAt: async (t: number) => {
        theatre.frame(t);
        await new Promise((r) => requestAnimationFrame(() => r(null)));
      },
    };
    return;
  }

  // The door is the loading screen. The gate comes first: the Worker serves the heavy media only after it.
  const door = new Door();
  try {
    await door.gate();
  } catch {
    return;
  }
  // Progress: the house model by its bytes, the shows, the posters, the shaders. The first frame completes it.
  const span = (from: number, to: number) => (k: number) => door.progress(from + (to - from) * k);
  try {
    await theatre.init('/house/house.glb', span(0, 0.6));
    shows = (await Promise.all(repertoire.map((r) => r.load()))).sort((a, b) => a.no - b.no);
    door.progress(0.65);
    await theatre.hang(shows, span(0.65, 0.95));
  } catch (err) {
    console.error(err);
    door.say('The theatre did not load. Reload the page to try again.');
    return;
  }
  for (const p of shows) wallButton(p);
  theatre.view = 1;
  // One frame warms the house behind the door. The render loop waits for the doors, so the street stays smooth.
  theatre.frame(0);
  // From now on, the files of a show that the crew loads count on its programme.
  DefaultLoadingManager.onProgress = (_url, loaded, all) => {
    if (busy && all) $('opening').textContent = `The crew is setting the stage · ${Math.round((100 * loaded) / all)}%`;
  };
  await door.ready();
  raf = requestAnimationFrame(tick);
  setWall();
  // /show/<id> (or ?p=<id>) opens that show's programme as the audience comes in.
  const id = location.pathname.match(/^\/show\/([a-z0-9-]+)/)?.[1] ?? params.get('p');
  const wanted = shows.find((p) => p.id === id);
  if (wanted) setTimeout(() => openProgramme(wanted), 1800);
}

// ---------------------------------------------------------------- the house

let shows: Production[] = [];
/** The show set on stage, and where it stands. */
let current: Production | null = null;
let state: 'set' | 'playing' | 'paused' | 'ended' = 'set';
/** The show whose programme is open. */
let chosen: Production | null = null;
/** True while the crew changes the set. Nothing else starts until it ends. */
let busy = false;
/** True after the crew failed to set the chosen show. The seal then offers another attempt. */
let failed = false;
/** The control that had focus before the programme opened. Focus goes back to it when the programme closes. */
let before: HTMLElement | null = null;
let clock = { wallStart: 0, showStart: 0, paused: true, pausedAt: 0 };
/** The camera between the show (0) and the house wall (1). */
let move = { from: 1, to: 1, t0: 0, dur: 1 };
let raf = 0;

function toView(to: number, dur: number) {
  move = { from: theatre.view, to, t0: performance.now(), dur };
  setWall();
}

/** The wall is live when the camera is on it and no programme is open. Otherwise its posters take no focus. */
function setWall() {
  const live = move.to === 1 && !chosen;
  document.body.classList.toggle('at-wall', live);
  $('wall').inert = !live;
}

function showTime(): number {
  if (clock.paused) return clock.pausedAt;
  // While the song plays, the audio is the clock.
  if (!audio.paused && !audio.ended && audio.currentTime > 0) return audio.currentTime;
  return theatre.start + clock.showStart + (performance.now() - clock.wallStart) / 1000;
}

/**
 * The pace of the play. If frames come slower than about 28 a second for 60 frames in a row, the theatre makes
 * each frame one step cheaper. After a step it waits 2 s, so the new setting is measured on its own.
 */
const pace = { last: 0, sum: 0, n: 0, quietUntil: 0 };
function watchPace(now: number) {
  const dt = now - pace.last;
  pace.last = now;
  // Only a running play counts. A long gap is a hidden tab, not a slow frame.
  if (state !== 'playing' || move.to !== 0 || clock.paused || now < pace.quietUntil || dt > 250) {
    pace.sum = pace.n = 0;
    return;
  }
  pace.sum += dt;
  if (++pace.n < 60) return;
  const slow = pace.sum / pace.n > 36;
  pace.sum = pace.n = 0;
  if (slow && theatre.degrade()) pace.quietUntil = now + 2000;
}

function tick(now: number) {
  raf = requestAnimationFrame(tick);
  // While the crew loads a show, the stage keeps its last frame. A frame now would show the new set too early.
  if (busy) return;
  watchPace(now);
  const k = Math.min(1, (performance.now() - move.t0) / (move.dur * 1000));
  theatre.view = move.from + (move.to - move.from) * k;
  const t = current ? showTime() : 0;
  if (current && state === 'playing') {
    if (t >= 0 && t < current.master.duration && audio.paused && !clock.paused && !audio.ended) {
      audio.currentTime = t;
      void audio.play();
    }
    if (audio.ended && !clock.paused && clock.showStart < current.master.duration - theatre.start) {
      // After the song the wall clock runs the curtain call.
      clock.showStart = current.master.duration - theatre.start;
      clock.wallStart = performance.now();
    }
    if (t >= theatre.end + 1.5) toWall(true);
  }
  theatre.frame(current ? Math.min(t, theatre.end) : 0);
  if (theatre.view > 0.01) placeWallButtons();
}

// ---------------------------------------------------------------- posters and programmes

const LANG = { zh: 'Mandarin', id: 'Bahasa Indonesia', en: 'English' } as const;

/** An invisible button over each poster, so a poster takes clicks, hover and keyboard focus. */
function wallButton(p: Production) {
  const b = document.createElement('button');
  b.className = 'poster';
  b.dataset.id = p.id;
  b.setAttribute('aria-label', `${p.title.en} · ${p.title.zh} · ${p.title.id}`);
  const hover = (on: boolean) => {
    if (theatre.posters) theatre.posters.hovered = on ? p.id : theatre.posters.hovered === p.id ? null : theatre.posters.hovered;
  };
  b.onpointerenter = () => hover(true);
  b.onpointerleave = () => hover(false);
  b.onfocus = () => hover(true);
  b.onblur = () => hover(false);
  // The programme takes focus from the poster, and gives it back when it closes.
  b.onclick = () => openProgramme(p);
  $('wall').append(b);
}

function placeWallButtons() {
  for (const r of theatre.posterRects()) {
    const b = $('wall').querySelector<HTMLElement>(`[data-id="${r.id}"]`);
    if (!b) continue;
    b.style.left = `${r.x * 100}%`;
    b.style.top = `${r.y * 100}%`;
    b.style.width = `${r.w * 100}%`;
    b.style.height = `${r.h * 100}%`;
  }
}

function fillBill(p: Production) {
  $('bill-no').textContent = `Programme ${roman(p.no)}`;
  $('bill-zh').textContent = p.title.zh;
  // A French song leads with its French title. The English title then joins the Indonesian one.
  $('bill-en').textContent = p.title.fr ?? p.title.en;
  $('bill-id').textContent = p.title.fr ? `${p.title.id} · ${p.title.en}` : p.title.id;
  $('bill-about').textContent = p.bill.about;
  $('bill-cast').innerHTML = p.bill.cast.map(([who, part]) => `<div><b>${who}</b><i></i><span>${part}</span></div>`).join('');
  $('bill-scenes').innerHTML = `<em>Scenery</em>${p.bill.scenes.join(' · ')}`;
  const s = p.surtitles ?? { main: 'zh', second: 'id' };
  $('bill-subs').textContent = `The surtitles are in ${LANG[s.main]} and ${LANG[s.second]}.`;
  // A show with English surtitles needs no English button.
  $('bill-en-toggle').hidden = s.main === 'en' || s.second === 'en';
}

/** The seal says what it does for this show: raise, resume or encore. */
function updateSeal() {
  if (!chosen) return;
  const seal = $('raise') as HTMLButtonElement;
  const here = current?.id === chosen.id;
  const [label, line] = busy
    ? ['Raise the Curtain', 'The crew is setting the stage.']
    : failed
      ? ['Raise the Curtain', 'The crew could not set the stage. Click the seal to try again.']
      : here && state === 'paused'
      ? ['Resume the Play', 'The play is paused.']
      : here && state === 'ended'
        ? ['Encore', 'The company takes its bow.']
        : ['Raise the Curtain', 'The orchestra is ready.'];
  seal.textContent = label;
  seal.disabled = busy;
  $('opening').textContent = line;
}

/** A programme opens only at the house wall. It never opens over a running performance. */
function openProgramme(p: Production) {
  if (busy || move.to !== 1) return;
  if (chosen?.id !== p.id) failed = false;
  chosen = p;
  if (theatre.posters) theatre.posters.chosen = p.id;
  fillBill(p);
  updateSeal();
  // The address bar holds the link to this show, so it can be shared as it is.
  history.replaceState(null, '', `/show/${p.id}`);
  $('lobby').classList.remove('away');
  fitBill();
  setWall();
  // Focus moves onto the programme, to its seal.
  before = document.activeElement instanceof HTMLElement && document.activeElement !== document.body ? document.activeElement : null;
  ($('raise') as HTMLButtonElement).focus({ preventScroll: true });
  // The crew starts to fetch the show's art while the audience reads the programme.
  theatre.prefetch(p);
}

/** Scales the programme down so all of it fits the window. */
function fitBill() {
  const wrap = document.querySelector<HTMLElement>('.billwrap')!;
  wrap.style.zoom = '1';
  const k = Math.min(1, (innerHeight * 0.94) / wrap.offsetHeight, (innerWidth * 0.94) / wrap.offsetWidth);
  wrap.style.zoom = String(k);
}
addEventListener('resize', fitBill);

/** Puts the programme down. Focus goes back to the poster that opened it, if the wall stays live. */
function closeProgramme() {
  if (chosen) history.replaceState(null, '', '/');
  chosen = null;
  failed = false;
  if (theatre.posters) theatre.posters.chosen = null;
  $('lobby').classList.add('away');
  setWall();
  const back = before;
  before = null;
  if (move.to === 1 && back?.isConnected) back.focus({ preventScroll: true });
  else ($('raise') as HTMLButtonElement).blur();
}

/**
 * Loads a show onto the stage: art and shaders. With `from`, the changeover starts from that show.
 * The song loads during the preroll. If it is late, the stage waits for it at the first note: the song is the clock.
 */
async function prepare(p: Production, from?: { production: Production; at: number }) {
  audio.pause();
  setSong(p);
  try {
    await theatre.load(p, from);
  } catch (err) {
    // The stage still holds the old show, so the old show keeps its song.
    if (current) setSong(current);
    throw err;
  }
  current = p;
  state = 'set';
  clock = { wallStart: 0, showStart: 0, paused: true, pausedAt: theatre.start };
}

/**
 * Phone browsers play sound only after a tap, and only when play() runs inside that tap. The song starts seconds
 * later, after the preroll. A silent play and pause inside the tap lets the later play() through.
 */
function setSong(p: Production) {
  const url = new URL(p.audio, location.href).href;
  if (audio.src === url) return;
  audio.src = url;
  audio.load();
}

function unlockAudio() {
  audio.muted = true;
  void audio.play().then(() => {
    audio.pause();
    audio.muted = false;
  }, () => (audio.muted = false));
}

/** The seal on the programme. */
async function onSeal() {
  const p = chosen;
  if (!p || busy) return;
  ($('raise') as HTMLButtonElement).blur();
  const here = current?.id === p.id;
  // Resume plays the song inside this tap, so it needs no unlock.
  if (here && state === 'paused') return resume();
  if (!here) setSong(p);
  unlockAudio();
  if (here && state === 'set') return raise();
  // Another show, or an encore: the crew strikes the set on stage and builds this one, in view.
  busy = true;
  failed = false;
  updateSeal();
  try {
    await prepare(p, current ? { production: current, at: clock.pausedAt } : undefined);
  } catch (err) {
    // A file did not load. The stage keeps the old show, and the seal offers another attempt.
    console.error(err);
    busy = false;
    failed = true;
    updateSeal();
    ($('raise') as HTMLButtonElement).focus({ preventScroll: true });
    return;
  }
  busy = false;
  raise();
}

/** The programme lifts, the camera takes its seat, and the performance starts. */
function raise() {
  // The camera leaves the wall, so focus does not go back to a poster.
  before = null;
  closeProgramme();
  toView(0, 2.6);
  state = 'playing';
  // The first seconds upload textures and settle the stage. They do not count toward the pace.
  pace.quietUntil = performance.now() + 4000;
  clock = { wallStart: performance.now(), showStart: 0, paused: false, pausedAt: 0 };
  audio.currentTime = 0;
}

function resume() {
  before = null;
  closeProgramme();
  toView(0, 2.0);
  state = 'playing';
  intermission(false);
}

/** Back to the house wall: the play stops and the house lights come up. After the curtain call, `ended` is true. */
function toWall(ended: boolean) {
  if (!current) return;
  clock.pausedAt = showTime();
  clock.paused = true;
  audio.pause();
  state = ended ? 'ended' : 'paused';
  $('interval').classList.remove('on');
  $('interval').inert = true;
  toView(1, 1.8);
}

function setEnglish(on: boolean) {
  theatre.subtitles.setLanguages({ ...theatre.subtitles.languages, en: on });
  $('bill-en-toggle').setAttribute('aria-pressed', String(on));
}

/** Intermission: the clock and the song stop, the stage dims, a printed slip says how to go on. */
function intermission(on: boolean) {
  if (!current || state !== 'playing') return;
  if (!on && clock.paused) {
    clock.paused = false;
    clock.wallStart = performance.now();
    clock.showStart = clock.pausedAt - theatre.start;
    if (clock.pausedAt >= 0 && clock.pausedAt < current.master.duration) {
      audio.currentTime = clock.pausedAt;
      void audio.play();
    }
  } else if (on && !clock.paused) {
    clock.pausedAt = showTime();
    clock.paused = true;
    audio.pause();
  }
  $('interval').classList.toggle('on', clock.paused);
  // The slip's button takes focus only while the slip shows.
  $('interval').inert = !clock.paused;
}

$('raise').onclick = () => void onSeal();
$('bill-share').onclick = async (e) => {
  (e.currentTarget as HTMLElement).blur();
  if (!chosen) return;
  const url = `${location.origin}/show/${chosen.id}`;
  try {
    await navigator.clipboard.writeText(url);
    $('opening').textContent = 'The link to this show is copied.';
  } catch {
    $('opening').textContent = url;
  }
};
$('to-wall').onclick = (e) => {
  (e.currentTarget as HTMLElement).blur();
  toWall(false);
};
$('bill-en-toggle').onclick = (e) => {
  (e.currentTarget as HTMLElement).blur();
  setEnglish(!theatre.subtitles.languages.en);
};
// A click outside the programme puts it down.
$('lobby').addEventListener('click', (e) => {
  if (e.target === e.currentTarget && !busy) closeProgramme();
});
frame.addEventListener('click', (e) => {
  if (state === 'playing' && move.to === 0 && !(e.target as HTMLElement).closest('#wall')) intermission(!clock.paused);
});
addEventListener('keydown', (e) => {
  if (e.code === 'Space') {
    // Space presses a focused control as usual. With no control in focus, it pauses the play.
    if ((e.target as HTMLElement).closest?.('button, a[href], input, select, textarea, [tabindex]')) return;
    e.preventDefault();
    if (state === 'playing' && move.to === 0) intermission(!clock.paused);
  } else if (e.code === 'Escape') {
    if (chosen && !busy) closeProgramme();
    else if (state === 'playing' && move.to === 0) toWall(false);
  } else if (e.code === 'KeyE') {
    setEnglish(!theatre.subtitles.languages.en);
  }
});

void boot();
