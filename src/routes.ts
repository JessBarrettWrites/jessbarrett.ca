import type { RouteRecordRaw } from 'vue-router'

import { SITE_URL } from '@/constants.ts'
import { LOCALES, localePath, type Locale } from '@/locale'

// Generic handler that will reload the page if the routing fails for some reason
function loadRoute(
  loader: () => Promise<{ default: ReturnType<(typeof import('vue'))['defineComponent']> }>,
) {
  return () =>
    loader().catch(() => {
      window.location.reload()
    })
}

export const PAGES = {
  home: { path: '/', component: () => import('@/routes/Home.vue') },
  books: { path: '/books', component: () => import('@/routes/Books.vue') },
  journalism: { path: '/journalism', component: () => import('@/routes/Journalism.vue') },
  talks: { path: '/talks', component: () => import('@/routes/Talks.vue') },
  about: { path: '/about', component: () => import('@/routes/About.vue') },
}

export type PageName = keyof typeof PAGES

declare module 'vue-router' {
  interface RouteMeta {
    /** Locale of a localized page; unset on the unprefixed redirect pages */
    locale?: Locale
    page?: PageName
  }
}

const pageNames = Object.keys(PAGES) as PageName[]

export default [
  // Every page in every locale: /en, /en/books, ..., /fr, /fr/books, ...
  ...LOCALES.flatMap((locale) =>
    pageNames.map((page) => ({
      path: localePath(locale, PAGES[page].path),
      name: `${page}-${locale}`,
      component: loadRoute(PAGES[page].component),
      meta: { locale, page },
    })),
  ),
  // The unprefixed paths (/, /books, ...) send visitors to their preferred locale, so the original
  // URLs and root-relative links keep working
  ...pageNames.map((page) => ({
    path: PAGES[page].path,
    name: page,
    component: loadRoute(() => import('@/routes/LocaleRedirect.vue')),
    meta: { page },
  })),
] satisfies RouteRecordRaw[]

export const NAV_PAGES: PageName[] = ['home', 'books', 'journalism', 'talks', 'about']

export function pagePath(page: PageName, locale: Locale): string {
  return localePath(locale, PAGES[page].path)
}

export function pageUrl(path: string): string {
  return `${SITE_URL}${path}`
}
