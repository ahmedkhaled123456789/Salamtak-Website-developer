const hasControlChar = (s: string) => [...s].some((c) => c.charCodeAt(0) < 0x20 || c.charCodeAt(0) === 0x7f);

/**
 * Post-sign-in destination from the `?redirect=` query parameter, accepted only when it is a path on this site.
 * Rejects protocol-relative (`//host`), backslash (`/\host`, see GHSA-wrjc-x8rr-h8h6) and encoded variants,
 * so the parameter can never send a user to another origin.
 */
export function safeRedirect(value: string | null, fallback = '/account'): string {
  if (!value) return fallback;
  let decoded = value;
  try {
    decoded = decodeURIComponent(value);
  } catch {
    return fallback;
  }
  if (!decoded.startsWith('/') || decoded.startsWith('//') || /[\\\s]/.test(decoded) || hasControlChar(decoded)) return fallback;
  return value;
}
