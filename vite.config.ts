/// <reference types="vite-ssg/node" />
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'
import { VitePWA } from 'vite-plugin-pwa'
import generateSitemap from 'vite-ssg-sitemap'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    // Tailwind styling for all components
    tailwindcss(),
    // Ensure that all images are reasonable sizes at runtime
    ViteImageOptimizer({
      includePublic: true,
      jpg: { quality: 85 },
      jpeg: { quality: 85 },
      png: { quality: 85 },
      webp: { lossless: false, quality: 85 },
    }),
    // Use service worker to allow for offline mode
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        // Include all website assets in the pre-cache
        globPatterns: ['**/*.{js,css,html,ico,jpg,png,svg,woff2}'],
      },
    }),
  ],
  ssgOptions: {
    onFinished() {
      generateSitemap({ hostname: process.env.VITE_SITE_URL ?? 'https://jessbarrett.ca' })
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
