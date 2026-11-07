#!/usr/bin/env node
// Share cards: one Open Graph image for the site and one for each show, 1200 x 630, plus the show list the Worker
// uses to write each show page's card tags.
//
//   node tools/og.mjs
//
// Writes public/og/site.jpg, public/og/<id>.jpg and worker/shows.json. Run it again after a new show joins.

import { chromium } from 'playwright-core';
import { createServer } from 'vite';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const ROOT = resolve(import.meta.dirname, '..');
const SITE = 'https://twilightbugle.asfarlab.fun';
mkdirSync(join(ROOT, 'public/og'), { recursive: true });

const server = await createServer({ root: ROOT, configFile: join(ROOT, 'vite.config.ts'), server: { port: 0, hmr: false, watch: null }, logLevel: 'error' });
await server.listen();
const origin = `http://localhost:${server.httpServer.address().port}`;
const browser = await chromium.launch({ channel: 'chrome' });
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });

await page.goto(`${origin}/?render=1`);
const shows = await page.evaluate(async () => {
  const m = await import('/src/productions.ts');
  const { printPoster } = await import('/src/house/posters.ts');
  const list = await Promise.all(m.repertoire.map(async (r) => {
    const p = await r.load();
    // The poster as it hangs on the house wall, with its printed titles.
    const printed = (await printPoster(p)).toDataURL('image/jpeg', 0.9);
    return { id: p.id, no: p.no, title: p.title, about: p.bill.about, poster: printed, sung: p.master.sung ?? 'zh' };
  }));
  return list.sort((a, b) => a.no - b.no);
});

const FONTS = 'https://fonts.googleapis.com/css2?family=Abril+Fatface&family=Cormorant+Garamond:ital,wght@1,500&family=Cormorant+SC:wght@600&family=IM+Fell+English:ital@0;1&family=Neonderthaw&family=Noto+Serif+SC:wght@900&family=Playfair+Display+SC:wght@700&display=block';
const roman = (n) => ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'][n] ?? String(n);
const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const UNDER = { zh: ['en', 'id'], id: ['en', 'zh'], en: ['id', 'zh'], fr: ['zh', 'id'], jv: ['zh', 'en'] };

async function shoot(html, file) {
  await page.setContent(html, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(300);
  await page.screenshot({ path: join(ROOT, 'public/og', file), type: 'jpeg', quality: 88 });
  console.log('og', file);
}

// The site: the theatre on its empty street, the sign lit.
await shoot(`<!doctype html><html><head><link rel="stylesheet" href="${FONTS}"><style>
  html, body { margin: 0; width: 1200px; height: 630px; overflow: hidden; background: #07080f; }
  .scene { position: absolute; left: 0; top: -22.5px; width: 1200px; height: 675px; container-type: size; }
  .scene img { width: 100%; height: 100%; display: block; }
  .sign { position: absolute; left: 40.1%; top: 26.8%; width: 19.8%; height: 10.7%; display: grid; place-items: center; }
  .neon { font: 400 3.15cqw/1 'Neonderthaw', cursive; color: #ffe3ee; white-space: nowrap;
    text-shadow: 0 0 0.04em #fff, 0 0 0.12em #ff9ec4, 0 0 0.3em #ff4f93, 0 0 0.7em #ff2f7d, 0 0 1.4em rgba(255,47,125,0.55); }
  .glow { position: absolute; left: 49.7%; top: 47%; width: 0.6%; height: 28%; background: linear-gradient(#ffc47800, #ffbe6e 30%, #ffd28c);
    filter: blur(2px); box-shadow: 0 0 40px #ffaa50; }
  .cap { position: absolute; left: 0; right: 0; bottom: 28px; text-align: center; color: #efe3cd; text-shadow: 0 2px 10px #000; }
  .cap b { display: block; font: 700 22px/1 'Playfair Display SC', serif; letter-spacing: 0.5em; padding-left: 0.5em; color: #e9c98e; }
  .cap span { display: block; margin-top: 10px; font: italic 26px/1.2 'IM Fell English', serif; }
</style></head><body>
  <div class="scene"><img src="${origin}/lobby/facade-wide.webp"><div class="sign"><div class="neon">Twilight Bugle</div></div><div class="glow"></div></div>
  <div class="cap"><b>The Twilight Bugle</b><span>A cardboard puppet theatre of songs</span></div>
</body></html>`, 'site.jpg');

// Each show: its poster in a gilt frame on the damask wall, with its titles and its line from the programme.
for (const s of shows) {
  const lead = s.sung === 'zh' ? s.title.zh : (s.title[s.sung] ?? s.title.en);
  const [a, b] = UNDER[s.sung] ?? ['en', 'id'];
  const leadCss = s.sung === 'zh' ? "font: 900 92px/1.05 'Noto Serif SC', serif; letter-spacing: 0.08em;" : "font: 400 70px/1.02 'Abril Fatface', serif; text-transform: uppercase; letter-spacing: 0.01em;";
  await shoot(`<!doctype html><html><head><link rel="stylesheet" href="${FONTS}"><style>
    html, body { margin: 0; width: 1200px; height: 630px; overflow: hidden; }
    body { background: radial-gradient(ellipse at 70% 50%, #4a1a1e 0%, #2a0d10 55%, #12060a 100%); font-family: 'IM Fell English', serif; color: #efe3cd; position: relative; }
    body::before { content: ''; position: absolute; inset: 0; opacity: 0.18;
      background: radial-gradient(circle at 25% 25%, #8a3a3a 0 7px, transparent 8px) 0 0 / 64px 64px, radial-gradient(circle at 75% 75%, #8a3a3a 0 7px, transparent 8px) 0 0 / 64px 64px; }
    .frame { position: absolute; right: 70px; top: 36px; height: 558px; padding: 12px; background: linear-gradient(135deg, #f3d48a, #a8792e 40%, #f0cf86 60%, #8a6224);
      box-shadow: 0 30px 60px rgba(0,0,0,0.7); }
    .frame img { height: 558px; display: block; }
    .text { position: absolute; left: 72px; top: 70px; width: 610px; }
    .kick { font: 700 19px/1 'Playfair Display SC', serif; letter-spacing: 0.32em; color: #e3bd6a; }
    .lead { margin-top: 30px; ${leadCss} color: #fbf1dc; text-shadow: 0 3px 18px rgba(0,0,0,0.6); }
    .sub { margin-top: 18px; font: italic 30px/1.25 'IM Fell English', serif; color: #e9c98e; }
    .about { margin-top: 30px; font: italic 500 27px/1.35 'Cormorant Garamond', serif; color: #efe3cd; }
    .site { position: absolute; left: 72px; bottom: 44px; font: 600 18px/1 'Cormorant SC', serif; letter-spacing: 0.22em; color: #c9a970; }
  </style></head><body>
    <div class="text">
      <div class="kick">The Twilight Bugle · Programme ${roman(s.no)}</div>
      <div class="lead">${esc(lead)}</div>
      <div class="sub">${esc(s.title[a] ?? '')} · ${esc(s.title[b] ?? '')}</div>
      <div class="about">${esc(s.about)}</div>
    </div>
    <div class="frame"><img src="${s.poster}"></div>
    <div class="site">twilightbugle.asfarlab.fun</div>
  </body></html>`, `${s.id}.jpg`);
}

// The show list for the Worker: the tags of each show page.
const meta = shows.map((s) => {
  const lead = s.sung === 'zh' ? s.title.zh : (s.title[s.sung] ?? s.title.en);
  const others = (UNDER[s.sung] ?? ['en', 'id']).map((k) => s.title[k]).filter(Boolean).join(' · ');
  return { id: s.id, no: s.no, title: `${lead} · ${others}`, description: s.about, image: `${SITE}/og/${s.id}.jpg`, url: `${SITE}/show/${s.id}` };
});
writeFileSync(join(ROOT, 'worker/shows.json'), JSON.stringify(meta, null, 1) + '\n');
console.log('worker/shows.json', meta.length, 'shows');

await browser.close();
await server.close();
