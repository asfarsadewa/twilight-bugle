// Render a production with headless Chrome: stills for review, or the whole show as an MP4 with its song.
//
//   node tools/render.mjs --p daybreak-vow --stills -6,3,20 [--out ../productions/daybreak-vow/render/stills]
//   node tools/render.mjs --p daybreak-vow --video [--from -7 --to 185] [--fps 30] [--out ../productions/daybreak-vow/render]
//
// The script starts its own Vite server. Each frame is drawn by window.__theatre.renderAt(t), so the video
// shows exactly what the live theatre shows at the same show time.

import { chromium } from 'playwright-core';
import { createServer } from 'vite';
import { spawn } from 'node:child_process';
import { mkdirSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';

const args = Object.fromEntries(
  process.argv.slice(2).reduce((acc, a, i, all) => {
    if (a.startsWith('--')) acc.push([a.slice(2), all[i + 1] && !all[i + 1].startsWith('--') ? all[i + 1] : true]);
    return acc;
  }, []),
);
const ROOT = resolve(import.meta.dirname, '..');
const id = args.p ?? 'daybreak-vow';
const fps = Number(args.fps ?? 30);
const out = resolve(ROOT, args.out ?? `../productions/${id}/render${args.stills ? '/stills' : ''}`);
mkdirSync(out, { recursive: true });

// No watcher and no HMR: an edit to the repository during a render must not reload the page mid-run.
const server = await createServer({ root: ROOT, configFile: join(ROOT, 'vite.config.ts'), server: { port: 0, hmr: false, watch: null }, logLevel: 'error' });
await server.listen();
const port = server.httpServer.address().port;

const browser = await chromium.launch({
  channel: 'chrome',
  headless: true,
  args: ['--ignore-gpu-blocklist', '--enable-gpu-rasterization', '--use-angle=d3d11', '--autoplay-policy=no-user-gesture-required'],
});
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
page.on('console', (m) => m.type() === 'error' && console.error('[page]', m.text()));
page.on('pageerror', (e) => console.error('[page]', e.message));
await page.goto(`http://localhost:${port}/?render=1&p=${id}`);
await page.waitForFunction(() => window.__theatre?.ready, null, { timeout: 120000 });
const info = await page.evaluate(() => ({ start: window.__theatre.start, end: window.__theatre.end, gl: (() => {
  const gl = document.querySelector('canvas').getContext('webgl2');
  const ext = gl.getExtension('WEBGL_debug_renderer_info');
  return ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : 'unknown';
})() }));
console.log(`show ${info.start}..${info.end} s, GPU: ${info.gl}`);

const draw = (t) => page.evaluate((t) => window.__theatre.renderAt(t), t);

if (args.stills) {
  const times = String(args.stills).split(',').map(Number);
  for (const t of times) {
    // Draw the second before too, so anything that settles over time (shadows, particles) is in place.
    await draw(t - 1 / fps);
    await draw(t);
    const file = join(out, `t${t.toFixed(1).replace('-', 'm')}.png`);
    await page.screenshot({ path: file, type: 'png' });
    console.log(file);
  }
} else if (args.video) {
  const from = Number(args.from ?? info.start), to = Number(args.to ?? info.end);
  const audio = resolve(ROOT, `../productions/${id}/song/master.mp3`);
  const file = join(out, `${id}${args.from || args.to ? `-${from}-${to}` : ''}.mp4`);
  const delay = Math.max(0, -from) * 1000;
  const skip = Math.max(0, from);
  const ff = spawn('ffmpeg', [
    '-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(fps), '-c:v', 'mjpeg', '-i', '-',
    ...(existsSync(audio) ? ['-ss', String(skip), '-i', audio, '-filter_complex', `[1:a]adelay=${delay}|${delay},apad[a]`, '-map', '0:v', '-map', '[a]', '-shortest', '-c:a', 'aac', '-b:a', '256k'] : []),
    // The haze, grain and halftone print eat bits. A cap at 8 Mbps keeps a 1080p show at about 60 MB a minute.
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '21', '-maxrate', '8M', '-bufsize', '16M', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', file,
  ], { stdio: ['pipe', 'inherit', 'inherit'] });
  const n = Math.round((to - from) * fps);
  const t0 = Date.now();
  for (let i = 0; i < n; i++) {
    await draw(from + i / fps);
    const jpg = await page.screenshot({ type: 'jpeg', quality: 93 });
    if (!ff.stdin.write(jpg)) await new Promise((r) => ff.stdin.once('drain', r));
    if (i % (fps * 5) === 0) {
      const rate = (i + 1) / ((Date.now() - t0) / 1000);
      console.log(`frame ${i}/${n}  show ${(from + i / fps).toFixed(1)} s  ${rate.toFixed(1)} fps  eta ${((n - i) / rate / 60).toFixed(1)} min`);
    }
  }
  ff.stdin.end();
  await new Promise((r) => ff.on('close', r));
  console.log(file);
}

await browser.close();
await server.close();
