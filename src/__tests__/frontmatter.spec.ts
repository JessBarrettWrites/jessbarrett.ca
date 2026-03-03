import { describe, it, expect } from 'vitest'
import dedent from 'ts-dedent'
import { frontMatter } from '@/frontmatter'

interface TestDocument {
  title: string
  date: string
}

interface TestDocumentTitle {
  title?: string
}

interface TestDocumentTags {
  tags: string[]
}

// DEV NOTE: Example of the TOML Frontmatter format that this parses
const TEST_DOCUMENT = dedent`
  +++
  title = "Hello"
  date = "2025-01-01"
  +++

  Body content here.
  More body.`

describe('frontMatter', () => {
  it('parses TOML fields between ++ delimiters', () => {
    const two_delim = dedent`
      ++
      title = "Two Delim"
      date = "2022-02-02"
      ++

      I used two delimitters`

    const { frontmatter } = frontMatter<TestDocument>(two_delim)
    expect(frontmatter.title).toBe('Two Delim')
    expect(frontmatter.date).toBe('2022-02-02')
  })

  it('parses TOML fields between +++ delimiters', () => {
    const three_delim = dedent`
      +++
      title = "Three Delim"
      date = "2023-03-03"
      +++

      I used three delimitters`

    const { frontmatter } = frontMatter<TestDocument>(three_delim)
    expect(frontmatter.title).toBe('Three Delim')
    expect(frontmatter.date).toBe('2023-03-03')
  })

  it('extracts the body after the closing delimiter, trimmed', () => {
    const { body } = frontMatter<TestDocument>(TEST_DOCUMENT)
    expect(body).toBe('Body content here.\nMore body.')
  })

  it('returns empty frontmatter and full text when no opening delimiter', () => {
    const raw = 'No front matter here.\nJust body.'
    const { frontmatter, body } = frontMatter<TestDocumentTitle>(raw)
    expect(frontmatter).toEqual({})
    expect(body).toBe(raw)
  })

  it('returns empty frontmatter and full text when opening delimiter has no closing', () => {
    const raw = dedent`
      +++
      title = "Unclosed"`
    const { frontmatter, body } = frontMatter<TestDocumentTitle>(raw)
    expect(frontmatter).toEqual({})
    expect(body).toBe(raw)
  })

  it('accepts ++ as a valid delimiter', () => {
    const twoPlus = dedent`
      ++
      title = "Two"
      ++
      Body.`
    const { frontmatter } = frontMatter<TestDocumentTitle>(twoPlus)
    expect(frontmatter.title).toBe('Two')
  })

  it('handles an empty body after the closing delimiter', () => {
    const noBody = dedent`
      +++
      title = "Empty"
      +++`
    const { body } = frontMatter<TestDocumentTitle>(noBody)
    expect(body).toBe('')
  })

  it('handles multiline TOML arrays', () => {
    const withArray = dedent`
      +++
      tags = ["a", "b", "c"]
      +++
      Body.`
    const { frontmatter } = frontMatter<TestDocumentTags>(withArray)
    expect(frontmatter.tags).toEqual(['a', 'b', 'c'])
  })
})
