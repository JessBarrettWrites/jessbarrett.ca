import { parse } from 'smol-toml'

/** Returns true if the line starts with two or more `+` characters. */
function isDelimiter(line: string): boolean {
  return /^\+{2,}/.test(line)
}

export interface FrontMatterResult<T> {
  frontmatter: T
  body: string
}

/**
 * Parses a document with TOML front matter delimited by `isDelimiter`.
 * Returns the parsed front matter as `data` and the remaining content as `body`.
 * If no valid front matter is found, returns an empty `data` and the full raw string as `body`.
 */
export function frontMatter<T>(raw: string): FrontMatterResult<T> {
  const lines = raw.split('\n')

  if (!isDelimiter(lines[0] ?? '')) {
    // No start of front matter: return full text
    return { frontmatter: {} as T, body: raw }
  }

  const endIdx = lines.findIndex((line, i) => i > 0 && isDelimiter(line))
  if (endIdx === -1) {
    // No end of front matter: return full text
    return { frontmatter: {} as T, body: raw }
  }

  // Extract front matter
  const tomlStr = lines.slice(1, endIdx).join('\n')
  const body = lines
    .slice(endIdx + 1)
    .join('\n')
    .trim()

  // Parse TOML front matter
  const toml = parse(tomlStr) as T

  return { frontmatter: toml, body }
}
