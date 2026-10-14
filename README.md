# CareFlow — public website

Vite · React 18 · TypeScript · Tailwind · TanStack Query · React Router 7. Design generated with
[Magic Patterns](https://www.magicpatterns.com/c/6scq5q2ybqayuakgxtrie6) and wired to `care-backend`
(see `../docs/website-integration.md`). Market: **United Arab Emirates** (AED, Asia/Dubai, emirates list in `src/data/emirates.ts`).

## Run

```bash
npm install
cp .env.example .env.local     # VITE_DATA_SOURCE=live needs care-backend; demo works without it
npm run dev                    # http://localhost:5173, proxies /api to VITE_DEV_API_TARGET
```

## Checks and build

```bash
npm run typecheck
npm run lint
VITE_SITE_URL=https://www.your-domain.ae npm run build              # heads, sitemap, robots (no Chrome needed)
VITE_SITE_URL=https://www.your-domain.ae npm run build:prerender    # + prerendered page bodies (needs Chrome)
```

`VITE_SITE_URL` (public origin, no trailing slash) is **required for production**: canonical/hreflang URLs, `og:url`/`og:image`
and `sitemap.xml` are only written when it is set. `build:prerender` finds Chrome automatically (or `CHROME_PATH=…`); without it
the step is skipped unless `PRERENDER_REQUIRED=1`. In live mode the API (`VITE_API_BASE_URL`) must be reachable during the build.

## Languages and URLs

English lives at `/…`, Arabic at `/ar/…` (same pages; `src/utils/localeRoute.ts`). The router runs with `basename="/ar"` for
Arabic, so in-app links stay in the current language. The language switch opens the paired URL and remembers the choice;
a remembered Arabic preference sends an English URL to its Arabic twin on a fresh visit (crawlers have no preference).

## SEO and prerendering (what the build produces)

| Step | Output |
| --- | --- |
| `seo/vite-plugin-seo.ts` (every build) | `dist/<route>/index.html` and `dist/ar/<route>/index.html` for 26 public routes: title, description, canonical, hreflang en/ar/x-default, Open Graph, JSON-LD, hero-image preload, `lang`/`dir`; `dist/app.html` (generic fallback), `sitemap.xml` (52 URLs with alternates), `robots.txt` |
| `scripts/prerender.mjs` (`build:prerender`) | renders each of those 52 pages in headless Chrome and writes the page body + the TanStack Query cache into the HTML |

On a prerendered page `src/index.tsx` **hydrates** the existing HTML (`hydrateRoot` + the embedded query cache) instead of
rendering from scratch: content is visible before any JavaScript runs and there is no loading flash. Rules that keep
hydration exact (verified on all 52 pages at two widths signed out, and spot-checked signed in): Suspense-boundary and text-separator markers are
added like React's server output; first-page intro animations are skipped (`src/utils/hydration.ts`); the auth provider
starts signed-out and restores the session right after hydration (only public pages are prerendered).

Private and transactional pages (`/account`, `/checkout`, `/book`, sign-in/up, newsletter links, legal drafts, nurse
profiles, 404) are `noindex` (`src/seo/meta.ts` → `NOINDEX_PREFIXES`) and never prerendered.

**Hosting rule** (any static host / CDN): serve the file if it exists, else `<path>/index.html`, else `/app.html` with status 200.

```nginx
location / { try_files $uri $uri/index.html /app.html; }
location /assets/ { add_header Cache-Control "public, max-age=31536000, immutable"; }
```

Services created in the backend after a build are served through `app.html` (rendered in the browser, correct tags at
runtime) until the next build; schedule a rebuild when the catalogue changes.

## Images

Photos in `public/*.jpg` have WebP variants (`<name>.webp`, `<name>-640.webp`) and a width manifest (`src/data/imageWidths.ts`)
used by `SmartImage` for `srcset`. After adding or replacing a photo run `python scripts/optimize-images.py` (needs Pillow).

## Forms

Contact (`POST /public/contact`) and newsletter (`POST /public/newsletter`, double opt-in; confirm/unsubscribe pages at
`/newsletter/confirm` and `/newsletter/unsubscribe`) use the backend in live mode; demo mode says plainly that nothing was sent.
Both include a hidden honeypot field.
