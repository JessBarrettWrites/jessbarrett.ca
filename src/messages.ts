import { computed } from 'vue'

import { AUTHOR_NAME } from '@/constants'
import { DEFAULT_LOCALE, LOCALES, useLocale, type Locale } from '@/locale'
import { parseTyped } from '@/parse'

// UI text (navigation, buttons, page metadata) lives in `content/<locale>/ui.toml`. A translation
// that's missing a key, or leaves it empty, falls back to the default locale's text.

export interface Messages {
  author: string
  readMore: string
  showLess: string
  testimonialOn: string
  nav: {
    home: string
    books: string
    journalism: string
    talks: string
    about: string
    openMenu: string
    toggleDarkMode: string
    email: string
    language: string
  }
  book: {
    featured: string
    getTheBook: string
    availableNow: string
    preorder: string
  }
  home: { description: string; trailerTitle: string }
  books: { title: string; description: string }
  journalism: { title: string; comingSoon: string; description: string; defaultSummary: string }
  talks: { title: string; description: string }
  about: { title: string; description: string; jobTitle: string; personDescription: string }
  redirect: { title: string }
}

const rawUiFiles = import.meta.glob<string>('../content/*/ui.toml', {
  query: '?raw',
  import: 'default',
  eager: true,
})

type Tree = { [key: string]: string | Tree }

function rawUi(locale: Locale): Tree {
  const raw = Object.entries(rawUiFiles).find(([path]) => path.split('/')[2] === locale)?.[1]
  return raw ? parseTyped<Tree>(raw) : {}
}

/** Translated text over the default text, key by key, ignoring empty translations */
export function mergeText(base: Tree, translation: Tree): Tree {
  const merged: Tree = { ...base }
  for (const [key, value] of Object.entries(translation)) {
    const baseValue = base[key]
    if (typeof value === 'object' && typeof baseValue === 'object') {
      merged[key] = mergeText(baseValue, value)
    } else if (value !== '') {
      merged[key] = value
    }
  }
  return merged
}

function withAuthor(tree: Tree): Tree {
  return Object.fromEntries(
    Object.entries(tree).map(([key, value]) => [
      key,
      typeof value === 'string' ? format(value, { author: AUTHOR_NAME }) : withAuthor(value),
    ]),
  )
}

/** Fill `{name}` placeholders, leaving unknown ones as they are */
export function format(template: string, values: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (match, name: string) => values[name] ?? match)
}

export const MESSAGES = Object.fromEntries(
  LOCALES.map((locale) => [
    locale,
    withAuthor(mergeText(rawUi(DEFAULT_LOCALE), rawUi(locale))) as unknown as Messages,
  ]),
) as Record<Locale, Messages>

/** UI text for the current locale */
export function useMessages() {
  const locale = useLocale()
  return computed(() => MESSAGES[locale.value])
}
