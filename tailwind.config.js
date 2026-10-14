export default {
  content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}'
],
  theme: {
    extend: {
      colors: {
        brand: { DEFAULT: '#0F766E', dark: '#115E59', deep: '#0B3F3B' },
        mint: { DEFAULT: '#DDF5EC', soft: '#EEF9F4' },
        ivory: '#FAFAF7',
        ink: '#172B2A',
        muted: '#5F706E', // AA contrast (≥4.5:1) on ivory, white and mint; was #6B7C7A (4.19:1 on ivory)
        line: '#E5ECE9',
        coral: { DEFAULT: '#D9694A', soft: '#FCEDE7', dark: '#A94A2E' }, // dark: coral TEXT (AA ≥4.5:1 on white/ivory/coral-soft)
      },
      fontFamily: {
        // self-hosted (src/fonts.ts); the plain names stay as fallbacks
        sans: ['Manrope Variable', 'Manrope', 'IBM Plex Sans Arabic', 'system-ui', 'sans-serif'],
        display: ['Newsreader Variable', 'Newsreader', 'IBM Plex Sans Arabic', 'Georgia', 'serif'],
        arabic: ['IBM Plex Sans Arabic', 'system-ui', 'sans-serif'], // logo wordmark (سلامتك) in both languages
      },
      boxShadow: {
        soft: '0 1px 2px rgba(23,43,42,0.04), 0 10px 30px -14px rgba(23,43,42,0.16)',
        lift: '0 2px 6px rgba(23,43,42,0.05), 0 28px 56px -28px rgba(23,43,42,0.30)',
      },
      transitionTimingFunction: {
        out: 'cubic-bezier(0.23, 1, 0.32, 1)',
      },
    },
  },
  plugins: [],
};
