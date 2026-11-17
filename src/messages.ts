import { computed, inject, type InjectionKey, type Ref } from 'vue'

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

export type Tree = { [key: string]: string | Tree | Tree[] }

function rawUi(locale: Locale): Tree {
  const raw = Object.entries(rawUiFiles).find(([path]) => path.split('/')[2] === locale)?.[1]
  return raw ? parseTyped<Tree>(raw) : {}
}

/** Translated text over the default text, key by key, ignoring empty translations. Lists are
 *  taken whole from the translation when it has them. */
export function mergeText(base: Tree, translation: Tree): Tree {
  const merged: Tree = { ...base }
  for (const [key, value] of Object.entries(translation)) {
    const baseValue = base[key]
    if (Array.isArray(value)) {
      if (value.length > 0) merged[key] = value
    } else if (
      typeof value === 'object' &&
      typeof baseValue === 'object' &&
      !Array.isArray(baseValue)
    ) {
      merged[key] = mergeText(baseValue, value)
    } else if (value !== '') {
      merged[key] = value
    }
  }
  return merged
}

/** The text with `{author}` filled in, including in lists */
export function withAuthor(tree: Tree): Tree {
  return Object.fromEntries(
    Object.entries(tree).map(([key, value]) => [
      key,
      typeof value === 'string'
        ? format(value, { author: AUTHOR_NAME })
        : Array.isArray(value)
          ? value.map(withAuthor)
          : withAuthor(value),
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

// DEV NOTE: The CMS preview of ui.toml (src/admin/previews.ts) provides the text being edited, which
//           every component then shows in place of the saved text
export const MESSAGES_KEY: InjectionKey<Readonly<Ref<Partial<Messages>>>> = Symbol('messages')

/** UI text for the current locale */
export function useMessages() {
  const locale = useLocale()
  const draft = inject(MESSAGES_KEY, undefined)
  return computed<Messages>(() => ({ ...MESSAGES[locale.value], ...draft?.value }))
}
