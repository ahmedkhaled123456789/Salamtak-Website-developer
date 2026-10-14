/**
 * CareFlow runtime configuration.
 *
 * DATA SOURCE
 * - "demo": every request is served by utils/demoAdapter.ts using the typed
 *   sample data in data/. Nothing is persisted beyond this browser tab.
 * - "live": requests go to care-backend (`/api/v1`) through utils/apiClient.ts and
 *   utils/liveAdapter.ts. VITE_API_BASE_URL is empty in development (Vite proxies
 *   `/api`) and the API origin when the site is served from another origin.
 *
 * Never put database, cache, or payment-provider secrets in frontend env vars.
 */
type EnvShape = {env?: Record<string, string | undefined>;};

const env = (import.meta as unknown as EnvShape).env ?? {};

export type DataSource = 'demo' | 'live';

export const config = {
  apiBaseUrl: env.VITE_API_BASE_URL ?? '',
  /** Public origin of this website (canonical URLs, sitemap, social previews). Falls back to the current origin. */
  siteUrl: (env.VITE_SITE_URL ?? '').replace(/\/+$/, ''),
  dataSource: (env.VITE_DATA_SOURCE === 'live' ? 'live' : 'demo') as DataSource,
  /** Live site backed by a DEMO_MODE API (fictional data, simulated payments): shows the demo badge with that note. */
  portfolioDemo: env.VITE_PORTFOLIO_DEMO === 'true',
  // UAE market: the backend prices everything in AED (demo mode uses the same currency)
  currency: env.VITE_CURRENCY ?? 'AED',
  /** Offset of the backend's platform timezone (`platform.timezone`, default Asia/Dubai) used to turn a date into an instant. */
  platformUtcOffset: env.VITE_PLATFORM_UTC_OFFSET ?? '+04:00',
  sessionTtlMs: 30 * 60 * 1000
} as const;

export const isDemoMode = config.dataSource === 'demo';