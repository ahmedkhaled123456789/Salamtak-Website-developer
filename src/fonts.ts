/**
 * Self-hosted web fonts — the same families, weights and Newsreader optical sizing the Magic Patterns design used from
 * Google Fonts, bundled with the site: no render-blocking third-party stylesheet, cached with the build, and
 * `unicode-range` subsets so Arabic/Latin files download only when needed. (Visitors' IPs no longer go to Google.)
 */
import '@fontsource-variable/manrope';
// Newsreader limited to the design's weights 400..600 (≈30 % smaller files): scripts/instance-fonts.py
import './assets/fonts/newsreader.css';
import '@fontsource/ibm-plex-sans-arabic/400.css';
import '@fontsource/ibm-plex-sans-arabic/500.css';
import '@fontsource/ibm-plex-sans-arabic/600.css';
import '@fontsource/ibm-plex-sans-arabic/700.css';
