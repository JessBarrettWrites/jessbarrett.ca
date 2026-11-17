/// <reference types="vite-ssg/node" />
import { readdirSync, writeFileSync } from 'node:fs'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'
import { VitePWA } from 'vite-plugin-pwa'
import generateSitemap from 'vite-ssg-sitemap'
import { DEFAULT_LOCALE, LOCALE_NAMES, LOCALES } from './src/locale.ts'

interface RenderedPage {
  title: string
  description: string
  url: string
}

// Each pre-rendered page's title, description and canonical URL, in the order they're listed for
// rendering, for llms.txt (below)
const renderedPages = new Map<string, RenderedPage | undefined>()

/** `/fr/books` → `fr` */
function localeOfPath(path: string): string | undefined {
  return path.split('/')[1]
}

function decodeEntities(text: string): string {
  return text
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
}

function readRenderedPage(html: string): RenderedPage | undefined {
  const title = html.match(/<title>([^<]*)<\/title>/)?.[1]
  const description = html.match(/<meta name="description" content="([^"]*)"/)?.[1]
  const url = html.match(/<link rel="canonical" href="([^"]*)"/)?.[1]
  if (!title || !description || !url) return undefined
  return {
    // Page titles end with ` — <author>` (src/head.ts); the home page's is the author's name alone
    title: decodeEntities(title).replace(/ — [^—]+$/, ''),
    description: decodeEntities(description),
    url: decodeEntities(url),
  }
}

// DEV NOTE: llms.txt (https://llmstxt.org) is a Markdown map of the site for language models, built
//           from the pages' own titles and descriptions so that CMS edits keep it up to date. English
//           is at the plain paths; each translation gets a section of its own (`/fr`, `/fr/books`).
//           The /en copies are left out, as in the sitemap.
function writeLlmsTxt(outDir: string) {
  const pages = [...renderedPages].flatMap(([route, page]) => (page ? [{ route, ...page }] : []))
  const home = pages.find((page) => page.route === '/')
  if (!home) throw new Error('llms.txt: the home page has no title or description')

  const link = (page: RenderedPage) => `- [${page.title}](${page.url}): ${page.description}`
  const section = (heading: string, list: RenderedPage[]) =>
    list.length ? [`## ${heading}`, '', ...list.map(link), ''] : []
  const plain = pages.filter(
    (page) =>
      page.route !== '/' && !(LOCALES as readonly string[]).includes(localeOfPath(page.route)!),
  )
  const translations = LOCALES.filter((locale) => locale !== DEFAULT_LOCALE).flatMap((locale) =>
    section(
      LOCALE_NAMES[locale],
      pages.filter((page) => localeOfPath(page.route) === locale),
    ),
  )

  const lines = [
    `# ${home.title}`,
    '',
    `> ${home.description}`,
    '',
    ...section('Pages', plain),
    ...translations,
  ]
  writeFileSync(`${outDir}/llms.txt`, lines.join('\n'))
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    // Tailwind styling for all components
    tailwindcss(),
    // Ensure that all images are reasonable sizes at runtime. Only for the browser build: vite-ssg's
    // second build, to render the pages, would optimise them all again, into a folder it deletes.
    {
      ...ViteImageOptimizer({
        includePublic: true,
        jpg: { quality: 85 },
        jpeg: { quality: 85 },
        png: { quality: 85 },
        webp: { lossless: false, quality: 85 },
      }),
      applyToEnvironment: (environment) => environment.name === 'client',
    },
    // Use service worker to allow for offline mode
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        // Include all website assets in the pre-cache
        globPatterns: ['**/*.{js,css,html,ico,jpg,png,svg,woff2}'],
        // The CMS loads from the network: never pre-cache it or serve the site shell in its place
        globIgnores: ['admin/**'],
        navigateFallbackDenylist: [/^\/admin/],
        // Take control immediately on activate so new deploys aren't stuck
        // behind a stale worker that references old chunk hashes
        clientsClaim: true,
        // Runtime caching for JS chunks — try cache, but fall back to network
        // so stale-hashed chunks can still be fetched from the origin
        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.destination === 'script',
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'js-chunks',
            },
          },
        ],
      },
    }),
  ],
  ssgOptions: {
    includedRoutes: (paths) => {
      // The /en copies only exist for links from before the plain paths did (src/routes.ts)
      for (const path of paths) {
        if (localeOfPath(path) !== DEFAULT_LOCALE) renderedPages.set(path, undefined)
      }
      return paths
    },
    onPageRendered: (route, html) => {
      if (renderedPages.has(route)) renderedPages.set(route, readRenderedPage(html))
      return html
    },
    onFinished() {
      // DEV NOTE: Exclude all English (en) pages from the sitemap, since they are already at the
      //           root path.  They only exist to be consistent for search indexing.
      //
      const enPages = readdirSync('dist/en').map((file) => `/en/${file.replace(/\.html$/, '')}`)
      generateSitemap({
        hostname: process.env.VITE_SITE_URL ?? 'https://jessbarrett.ca',
        // Not the CMS (public/admin), nor the /en copies: English is indexed at the plain paths
        // (see indexedPath in src/routes.ts)
        exclude: ['/admin', '/en', ...enPages],
      })
      writeLlmsTxt(fileURLToPath(new URL('./dist', import.meta.url)))
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
