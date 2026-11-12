import { describe, it, expect } from 'vitest'
import { AUTHOR_NAME } from '@/constants'
import { DEFAULT_LOCALE, LOCALES } from '@/locale'
import { format, MESSAGES, mergeText } from '@/messages'
import { parseTyped } from '@/parse'

const rawUiFiles = import.meta.glob<string>('../../content/*/ui.toml', {
  query: '?raw',
  import: 'default',
  eager: true,
})
const rawUi = (locale: string) => rawUiFiles[`../../content/${locale}/ui.toml`]!

type Tree = { [key: string]: string | Tree }

function keys(tree: Tree, prefix = ''): string[] {
  return Object.entries(tree).flatMap(([key, value]) =>
    typeof value === 'string' ? [prefix + key] : keys(value, `${prefix}${key}.`),
  )
}

describe('ui.toml', () => {
  it.each(LOCALES.filter((l) => l !== DEFAULT_LOCALE))(
    'has a %s text for every English one',
    (l) => {
      const en = keys(parseTyped<Tree>(rawUi(DEFAULT_LOCALE))).sort()
      expect(keys(parseTyped<Tree>(rawUi(l))).sort()).toEqual(en)
    },
  )
})

describe('MESSAGES', () => {
  it('loads each locale', () => {
    expect(MESSAGES.en.nav.books).toBe('Books')
    expect(MESSAGES.fr.nav.books).toBe('Livres')
    expect(MESSAGES.es.nav.books).toBe('Libros')
  })

  it('fills in the author name', () => {
    expect(MESSAGES.en.talks.description).toBe(`Public speaking by ${AUTHOR_NAME}.`)
  })
})

describe('mergeText', () => {
  it('uses the translation key by key, falling back for missing and empty keys', () => {
    const base = { a: 'A', nested: { b: 'B', c: 'C' } }
    expect(mergeText(base, { a: '', nested: { b: 'Bé' } })).toEqual({
      a: 'A',
      nested: { b: 'Bé', c: 'C' },
    })
  })
})

describe('format', () => {
  it('fills known placeholders and leaves unknown ones', () => {
    expect(format('{summary} by {author}', { summary: 'Essays' })).toBe('Essays by {author}')
  })
})
