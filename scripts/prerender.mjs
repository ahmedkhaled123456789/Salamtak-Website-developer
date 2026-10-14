// Prerender the public pages' BODY into dist/<route>/index.html (after `vite build`, which writes the heads).
//
//   npm run build:prerender                # = vite build && node scripts/prerender.mjs
//   CHROME_PATH=/usr/bin/chromium node scripts/prerender.mjs [distDir]
//
// Each route from dist/prerender-routes.json is rendered in headless Chrome from a local copy of dist/ (no
// network besides the API the build points at), with reduced motion so nothing is captured mid-animation.
// The rendered #root and the TanStack Query cache are written into the page; the app then *hydrates* that HTML
// (src/index.tsx) instead of rendering from scratch. Without Chrome the step is skipped (the site still works,
// just without prerendered bodies) unless PRERENDER_REQUIRED=1.
import { existsSync, readFileSync, writeFileSync, statSync } from 'node:fs';
import http from 'node:http';
import path from 'node:path';

const dist = path.resolve(process.argv[2] ?? 'dist');
const required = process.env.PRERENDER_REQUIRED === '1';
const routes = JSON.parse(readFileSync(path.join(dist, 'prerender-routes.json'), 'utf8'));

const CHROME_CANDIDATES = [
  process.env.CHROME_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
].filter(Boolean);
const chrome = CHROME_CANDIDATES.find((p) => existsSync(p));
if (!chrome) {
  const msg = '[prerender] no Chrome/Chromium found (set CHROME_PATH)';
  if (required) throw new Error(msg);
  console.warn(`${msg}: skipped, pages keep their static heads only.`);
  process.exit(0);
}

let chromium;
try {
  ({ chromium } = await import('playwright-core'));
} catch {
  if (required) throw new Error('[prerender] playwright-core is not installed');
  console.warn('[prerender] playwright-core is not installed: skipped.');
  process.exit(0);
}

/* ------------------------------ local static host ------------------------------ */
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.jpg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp', '.json': 'application/json' };
const isFile = (p) => {
  try {
    return statSync(p).isFile();
  } catch {
    return false;
  }
};
// Pages are served from their ORIGINAL (head-only) HTML even after we overwrite the files, so every route renders
// from the same starting point a first-time visitor without prerendering would get.
const original = new Map();
const server = http.createServer((req, res) => {
  const url = decodeURIComponent(req.url.split('?')[0]);
  let file = path.join(dist, path.normalize(url).replace(/^([/\\])+/, ''));
  if (!file.startsWith(dist)) return void res.writeHead(400).end();
  if (!isFile(file)) file = isFile(path.join(file, 'index.html')) ? path.join(file, 'index.html') : path.join(dist, 'app.html');
  const body = file.endsWith('.html') && original.has(file) ? original.get(file) : readFileSync(file);
  res.writeHead(200, { 'content-type': types[path.extname(file)] ?? 'application/octet-stream' });
  res.end(body);
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${server.address().port}`;

const fileFor = (route) => (route === '/' ? path.join(dist, 'index.html') : path.join(dist, route, 'index.html'));
for (const route of routes) original.set(fileFor(route), readFileSync(fileFor(route)));

/* ---------------------------------- render ---------------------------------- */
const browser = await chromium.launch({ executablePath: chrome, headless: true });
const context = await browser.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: 'reduce' });
let done = 0;
const failed = [];
try {
  for (const route of routes) {
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    try {
      await page.goto(`${base}${route}`, { waitUntil: 'networkidle', timeout: 45_000 });
      // rendered = boot loader gone, no route/page skeleton left
      // rendered = boot loader gone, no query loading, no skeleton/fallback left — continuously for 600 ms
      // (data can start loading only after a route chunk arrives, and the demo data source simulates latency)
      await page.waitForFunction(
        () => {
          const ready =
          !document.querySelector('#root .boot') &&
          !document.querySelector('#root .animate-pulse, #root [aria-busy="true"], #root [role="status"][aria-label="Loading"]') &&
          (window.__careflowIdle ? window.__careflowIdle() : true);
          const w = window;
          if (!ready) w.__readySince = 0;else
          if (!w.__readySince) w.__readySince = performance.now();
          return ready && performance.now() - w.__readySince > 600;
        },
        null,
        { timeout: 30_000, polling: 100 }
      );
      if (errors.length) throw new Error(errors[0]);
      const { html, state } = await page.evaluate(() => ({
        html: (() => {
          // Adjacent text nodes ({price} · {label}) would merge when the HTML is parsed again; React's server
          // output separates them with <!-- --> and hydration expects that.
          const root = document.getElementById('root');
          const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
          const texts = [];
          while (walker.nextNode()) texts.push(walker.currentNode);
          for (const t of texts) if (t.nextSibling && t.nextSibling.nodeType === Node.TEXT_NODE) t.after(document.createComment(' '));
          return root.innerHTML;
        })(),
        state: window.__careflowDehydrate ? window.__careflowDehydrate() : null
      }));
      // React's server output marks every <Suspense> boundary with <!--$--> … <!--/$--> and hydration expects them.
      // Public pages have exactly two boundaries: App (around everything) and PublicLayout (inside <main id="main">).
      const mainOpen = html.indexOf('<main id="main"');
      const mainBody = mainOpen < 0 ? -1 : html.indexOf('>', mainOpen) + 1;
      const mainClose = html.lastIndexOf('</main>');
      if (mainOpen < 0 || mainClose < mainBody) throw new Error('page is not rendered inside <main id="main">');
      const marked = `<!--$-->${html.slice(0, mainBody)}<!--$-->${html.slice(mainBody, mainClose)}<!--/$-->${html.slice(mainClose)}<!--/$-->`;
      const file = fileFor(route);
      const template = original.get(file).toString('utf8');
      // replace the boot loader: everything from the root element up to <noscript> (see index.html)
      const rootStart = template.indexOf('<div id="root">');
      const rootEnd = template.indexOf('<noscript>', rootStart);
      if (rootStart < 0 || rootEnd < 0) throw new Error('unexpected index.html structure');
      const json = JSON.stringify(state).replace(/</g, '\\u003c');
      writeFileSync(
        file,
        `${template.slice(0, rootStart)}<div id="root" data-prerendered="1">${marked}</div>\n    <script>window.__CAREFLOW_RQ__=${json}</script>\n    ${template.slice(rootEnd)}`
      );
      done += 1;
    } catch (err) {
      failed.push(`${route}: ${err.message}`);
      writeFileSync(fileFor(route), original.get(fileFor(route))); // keep the head-only page
    } finally {
      await page.close();
    }
  }
} finally {
  await browser.close();
  server.close();
}
console.log(`[prerender] ${done}/${routes.length} pages prerendered${failed.length ? `; failed (kept head-only):\n  ${failed.join('\n  ')}` : ''}`);
if (failed.length && required) process.exit(1);
