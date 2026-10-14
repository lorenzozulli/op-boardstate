import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,woff2}'],
      },
      manifest: {
        name: 'OP Boardstate',
        short_name: 'OP Boardstate',
        theme_color: '#191919',
        icons: [
          {
            src: 'assets/manifest-icons/pwa-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'assets/manifest-icons/pwa-512.png',
            sizes: '512x512',
            type: 'image/png',
          }
        ]
      }
    }) ],
})
