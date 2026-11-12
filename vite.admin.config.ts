import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'

// Builds the Sveltia CMS preview templates (`src/admin/previews.ts`) into `public/admin/preview/`,
// which the site build then copies like any other public file.
//
// DEV NOTE: Built as a library even during development (`--watch`), because the dev server injects
//           CSS into the page, which would restyle the CMS itself. Library mode emits the CSS as its
//           own file, which the previews hand to the preview iframe only.
export default defineConfig(({ mode }) => ({
  plugins: [vue(), tailwindcss()],
  define: {
    // Library mode leaves `process.env.NODE_ENV` for the consumer; there is none, so set it here
    'process.env.NODE_ENV': JSON.stringify(mode === 'development' ? 'development' : 'production'),
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    outDir: 'public/admin/preview',
    emptyOutDir: true,
    // Output lives inside `public/`; reading it is fine (it resolves /fonts), copying it is not
    copyPublicDir: false,
    lib: {
      entry: fileURLToPath(new URL('./src/admin/previews.ts', import.meta.url)),
      formats: ['es'],
      fileName: () => 'previews.js',
      cssFileName: 'previews',
    },
  },
}))
