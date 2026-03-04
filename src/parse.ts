import { parse } from 'smol-toml'

interface FrontmatterDoc<T> {
  frontmatter: T
  body: string
}

/** Parses a TOML string and casts the result to the given type to save on type errors in other
 *  places
 */
export function parseTyped<T>(input: string): T {
  return parse(input) as unknown as T
}

/** Check that a line has 2+ of the delimiter character and ignore leading whitespace
 */
function isDelimiter(line: string): boolean {
  return /^\s*\+{2,}/.test(line)
}

/** Splits a document into TOML frontmatter and a markdown body.
 *  Frontmatter is delimited by lines of two or more `+` characters (e.g. `++` or `+++`).
 */
export function parseFront<T>(raw: string): FrontmatterDoc<T> {
  const lines = raw.split('\n')

  if (!isDelimiter(lines[0] ?? '')) {
    return { frontmatter: {} as T, body: raw }
  }

  const endIdx = lines.findIndex((line, i) => i > 0 && isDelimiter(line))
  if (endIdx === -1) {
    return { frontmatter: {} as T, body: raw }
  }

  const tomlStr = lines.slice(1, endIdx).join('\n')
  const body = lines
    .slice(endIdx + 1)
    .join('\n')
    .trim()

  return { frontmatter: parseTyped<T>(tomlStr), body }
}

export function getSlug(path: string) {
  return path.split('/').pop()!.replace(/\.md$/, '')
}

/** Parses a date string, returning undefined if the value is missing or invalid.
 *  Appends T0:00:00 to date-only strings so they are parsed as local time rather than UTC. */
export function parseDate(value: string | undefined): Date | undefined {
  if (!value) return undefined
  const local = value.includes('T') ? value : `${value}T00:00:00`
  const d = new Date(local)
  return isNaN(d.getTime()) ? undefined : d
}
