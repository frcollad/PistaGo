import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globIgnores: ['**/pistas.json'],
        cacheId: 'pistago-v2',
        runtimeCaching: [
          {
            urlPattern: /\/pistas\.json$/,
            handler: 'NetworkOnly',
          },
        ],
      },
      manifest: {
        name: 'PistaGo',
        short_name: 'PistaGo',
        description: 'Encuentra pista o partido sin entrar en mil apps',
        theme_color: '#061321',
        background_color: '#f4f7f8',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        lang: 'es',
        icons: [
          {
            src: '/pwa-icon.svg',
            sizes: '192x192',
            type: 'image/svg+xml',
          },
          {
            src: '/pwa-icon.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'any maskable',
          },
        ],
      },
    }),
  ],
})
