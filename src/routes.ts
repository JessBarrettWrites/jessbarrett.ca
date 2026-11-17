import type { RouteRecordRaw } from 'vue-router'

import { SITE_URL } from '@/constants.ts'
import { DEFAULT_LOCALE, LOCALES, localePath, type Locale } from '@/locale'

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
  media: { path: '/media', component: () => import('@/routes/Media.vue') },
  talks: { path: '/talks', component: () => import('@/routes/Talks.vue') },
  about: { path: '/about', component: () => import('@/routes/About.vue') },
}

export type PageName = keyof typeof PAGES

declare module 'vue-router' {
  interface RouteMeta {
    /** Locale of a search engine copy of a page; unset on the plain paths */
    locale?: Locale
    page?: PageName
  }
}

const pageNames = Object.keys(PAGES) as PageName[]

export default [
  // Every page, in the visitor's preferred locale: /, /books, ...
  ...pageNames.map((page) => ({
    path: PAGES[page].path,
    name: page,
    component: loadRoute(PAGES[page].component),
    meta: { page },
  })),
  // A copy of every page in every locale for search engines, which don't keep a language choice:
  // /fr, /fr/books, ... Visitors arriving on one see the page at its plain path instead (App.vue).
  // English is indexed at the plain paths; /en/... stays for links from before they existed.
  ...LOCALES.flatMap((locale) =>
    pageNames.map((page) => ({
      path: localePath(locale, PAGES[page].path),
      name: `${page}-${locale}`,
      component: loadRoute(PAGES[page].component),
      meta: { locale, page },
    })),
  ),
] satisfies RouteRecordRaw[]

export const NAV_PAGES: PageName[] = ['home', 'books', 'journalism', 'media', 'talks', 'about']

export function pagePath(page: PageName): string {
  return PAGES[page].path
}

/** Path search engines index a page at in a locale: the plain path for the default locale */
export function indexedPath(page: PageName, locale: Locale): string {
  return locale === DEFAULT_LOCALE ? pagePath(page) : localePath(locale, pagePath(page))
}

/** Simple helper for producing a full URL within the site, given a Path **/
export function pageUrl(path: string): string {
  return `${SITE_URL}${path}`
}
