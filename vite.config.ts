import { loadEnv } from 'vite'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { seoPlugin } from './seo/vite-plugin-seo'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  // Dev only: the browser calls same-origin `/api/v1/...` (also the pictures at `/api/v1/media/:id`)
  // and Vite forwards it to care-backend. Server-side setting, never bundled into the app.
  const apiTarget = env.VITE_DEV_API_TARGET || 'http://localhost:5050'

  return {
    // Per-route <head>, sitemap.xml and robots.txt for the public pages (see seo/vite-plugin-seo.ts).
    plugins: [react(), seoPlugin({ siteUrl: env.VITE_SITE_URL, dataSource: env.VITE_DATA_SOURCE })],
    server: {
      proxy: {
        '/api': { target: apiTarget, changeOrigin: true },
      },
    },
  }
})
