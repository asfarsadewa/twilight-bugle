// The Worker in front of the Twilight Bugle. The built theatre (dist/) is its static assets.
//
//   /show/<id>    the theatre, with that show's share card in the page head: title, line, image and link
//   /api/gate     tells the page if the Turnstile gate is on, and gives the sitekey
//   /api/enter    checks a Turnstile token with Cloudflare, then sets a signed pass cookie for 12 hours
//   media         songs, the house model and the art need the pass while the gate is on
//
// The gate is on only when TURNSTILE_SITEKEY, TURNSTILE_SECRET and PASS_KEY are all set.

import shows from './shows.json';

interface Env {
  ASSETS: { fetch(req: Request): Promise<Response> };
  TURNSTILE_SITEKEY?: string;
  TURNSTILE_SECRET?: string;
  /** Frontend hostnames that a Turnstile token may come from, comma separated. */
  TURNSTILE_HOSTNAMES?: string;
  /** The key that signs the pass cookie. */
  PASS_KEY?: string;
}

type Show = (typeof shows)[number];

const PASS = 'tb_pass';
const PASS_SECONDS = 12 * 60 * 60;
const MEDIA = /\.(mp3|glb|webp|png|jpe?g)$/i;

export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    const url = new URL(req.url);
    const gateOn = Boolean(env.TURNSTILE_SITEKEY && env.TURNSTILE_SECRET && env.PASS_KEY);

    if (url.pathname === '/api/gate') {
      return json({ sitekey: gateOn ? env.TURNSTILE_SITEKEY : '' });
    }
    if (url.pathname === '/api/enter') {
      if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 });
      return gateOn ? enter(req, env) : new Response(null, { status: 204 });
    }
    if (gateOn && (url.pathname.startsWith('/assets/') || url.pathname.startsWith('/house/')) && MEDIA.test(url.pathname)) {
      if (!(await hasPass(req, env.PASS_KEY!))) return new Response('The doors are closed. Open the theatre from its front page.', { status: 403 });
    }
    const m = url.pathname.match(/^\/show\/([a-z0-9-]+)\/?$/);
    if (m) {
      const show = (shows as Show[]).find((s) => s.id === m[1]);
      if (!show) return Response.redirect(`${url.origin}/`, 302);
      const page = await env.ASSETS.fetch(new Request(`${url.origin}/`, { headers: req.headers }));
      return card(page, show);
    }
    return env.ASSETS.fetch(req);
  },
};

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json', 'cache-control': 'no-store' } });
}

/** Siteverify: the token must succeed, come from the "enter" action and from one of our hostnames. */
async function enter(req: Request, env: Env): Promise<Response> {
  let token: unknown;
  try {
    token = ((await req.json()) as { token?: unknown }).token;
  } catch {
    return new Response('forbidden', { status: 403 });
  }
  const hostnames = new Set((env.TURNSTILE_HOSTNAMES ?? '').split(',').map((h) => h.trim()).filter(Boolean));
  if (typeof token !== 'string' || token.length === 0 || token.length > 2048 || hostnames.size === 0) {
    return new Response('forbidden', { status: 403 });
  }
  let result: { success?: boolean; action?: string; hostname?: string };
  try {
    const r = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      signal: AbortSignal.timeout(10_000),
      body: new URLSearchParams({ secret: env.TURNSTILE_SECRET!, response: token, remoteip: req.headers.get('CF-Connecting-IP') ?? '' }),
    });
    if (!r.ok) throw new Error(`siteverify ${r.status}`);
    result = await r.json();
  } catch {
    return new Response('forbidden', { status: 403 });
  }
  if (!result.success || result.action !== 'enter' || !hostnames.has(result.hostname ?? '')) {
    return new Response('forbidden', { status: 403 });
  }
  const expires = Math.floor(Date.now() / 1000) + PASS_SECONDS;
  const value = `${expires}.${await sign(env.PASS_KEY!, String(expires))}`;
  return new Response(null, {
    status: 204,
    headers: { 'set-cookie': `${PASS}=${value}; Path=/; Max-Age=${PASS_SECONDS}; HttpOnly; Secure; SameSite=Lax`, 'cache-control': 'no-store' },
  });
}

async function key(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify']);
}

async function sign(secret: string, data: string): Promise<string> {
  const mac = await crypto.subtle.sign('HMAC', await key(secret), new TextEncoder().encode(data));
  return btoa(String.fromCharCode(...new Uint8Array(mac))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

async function hasPass(req: Request, secret: string): Promise<boolean> {
  const cookie = (req.headers.get('cookie') ?? '').split(/;\s*/).find((c) => c.startsWith(`${PASS}=`));
  const [expires, mac] = (cookie?.slice(PASS.length + 1) ?? '').split('.');
  if (!expires || !mac || Number(expires) < Date.now() / 1000) return false;
  const bytes = Uint8Array.from(atob(mac.replace(/-/g, '+').replace(/_/g, '/')), (c) => c.charCodeAt(0));
  return crypto.subtle.verify('HMAC', await key(secret), bytes, new TextEncoder().encode(expires));
}

/** The theatre page with one show's share card in its head. */
function card(page: Response, s: Show): Response {
  const title = `${s.title} · The Twilight Bugle`;
  const set = (attr: string, value: string) => ({ element: (el: Element) => el.setAttribute(attr, value) });
  return new HTMLRewriter()
    .on('title', { element: (el) => el.setInnerContent(title) })
    .on('meta[name="description"]', set('content', s.description))
    .on('link[rel="canonical"]', set('href', s.url))
    .on('meta[property="og:title"]', set('content', title))
    .on('meta[property="og:description"]', set('content', s.description))
    .on('meta[property="og:url"]', set('content', s.url))
    .on('meta[property="og:image"]', set('content', s.image))
    .on('meta[property="og:image:alt"]', set('content', `The poster of ${s.title}`))
    .on('meta[name="twitter:title"]', set('content', title))
    .on('meta[name="twitter:description"]', set('content', s.description))
    .on('meta[name="twitter:image"]', set('content', s.image))
    .transform(page);
}
