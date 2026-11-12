// @vitest-environment node
import { describe, it, expect } from 'vitest'
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parse as parseYaml } from 'yaml'

import { DEFAULT_LOCALE, LOCALES } from '@/locale'
import { parseFront, parseTyped } from '@/parse'
import previewsSource from '@/admin/previews.ts?raw'

// DEV NOTE: Checks that the CMS configuration (public/admin/config.yml) still describes the files in
//           content/, so that every field can be edited and the CMS doesn't write fields the site
//           doesn't read (or drop ones it does)

const ROOT = fileURLToPath(new URL('../../', import.meta.url))

interface Field {
  name: string
  widget: string
  required?: boolean
  i18n?: boolean | string
  fields?: Field[]
}

interface CmsFile {
  name: string
  file: string
  format: string
  i18n?: boolean
  editor?: { preview?: boolean }
  fields: Field[]
}

interface CmsCollection {
  name: string
  folder?: string
  extension?: string
  format?: string
  i18n?: boolean
  editor?: { preview?: boolean }
  files?: CmsFile[]
  fields?: Field[]
}

const config = parseYaml(readFileSync(join(ROOT, 'public/admin/config.yml'), 'utf8')) as {
  i18n: { locales: string[]; default_locale: string }
  media_folder: string
  public_folder: string
  collections: CmsCollection[]
}

/** Something the CMS edits: one collection folder, or one file of a file collection */
interface Target {
  name: string
  /** Path with an optional `{{locale}}` placeholder */
  path: string
  isFolder: boolean
  extension: string
  format: string
  fields: Field[]
  preview: boolean
}

const targets: Target[] = config.collections.flatMap((collection): Target[] => {
  if (collection.folder) {
    return [
      {
        name: collection.name,
        path: collection.folder,
        isFolder: true,
        extension: collection.extension ?? 'md',
        format: collection.format ?? 'frontmatter',
        fields: collection.fields ?? [],
        preview: collection.editor?.preview !== false,
      },
    ]
  }
  return (collection.files ?? []).map((file) => ({
    name: file.name,
    path: file.file,
    isFolder: false,
    extension: file.file.split('.').pop()!,
    format: file.format,
    fields: file.fields,
    preview: file.editor?.preview !== false && collection.editor?.preview !== false,
  }))
})

const isLocalized = (target: Target) => target.path.includes('{{locale}}')

/** Content files for a target in a locale (the default locale for unlocalized targets) */
function filesFor(target: Target, locale: string): string[] {
  const path = target.path.replace('{{locale}}', locale)
  if (!target.isFolder) return existsSync(join(ROOT, path)) ? [path] : []
  const folder = join(ROOT, path)
  if (!existsSync(folder)) return []
  return readdirSync(folder)
    .filter((name) => name.endsWith(`.${target.extension}`))
    .map((name) => `${path}/${name}`)
}

function read(path: string, format: string): Record<string, unknown> {
  const raw = readFileSync(join(ROOT, path), 'utf8')
  if (format === 'toml') return parseTyped(raw)
  const { frontmatter, body } = parseFront<Record<string, unknown>>(raw)
  return { ...frontmatter, body }
}

const isTranslatable = (field: Field) =>
  field.i18n === true || field.i18n === 'translate' || field.i18n === 'duplicate_if_empty'

// Copied from the default locale and locked in translations (e.g. a testimonial's quote and name)
const isMirrored = (field: Field) => field.i18n === 'duplicate' || field.i18n === 'sync'

type Data = Record<string, unknown>

/** Problems with `data` against `fields`, as readable strings. For a translation, `base` is the
 *  default locale's data at the same place, if there is any. */
function checkFields(
  data: Data,
  fields: Field[],
  { path, translation, base }: { path: string; translation: boolean; base?: Data },
): string[] {
  const errors: string[] = []
  const byName = new Map(fields.map((field) => [field.name, field]))

  for (const key of Object.keys(data)) {
    if (!byName.has(key)) errors.push(`${path}: \`${key}\` isn't a field in config.yml`)
  }

  for (const field of fields) {
    const where = `${path}: \`${field.name}\``
    const value = data[field.name]

    if (value === undefined) {
      // Translations only hold the fields they translate
      if (!translation && field.required !== false) errors.push(`${where} is required but missing`)
      continue
    }
    if (translation && isMirrored(field)) {
      if (base && JSON.stringify(value) !== JSON.stringify(base[field.name])) {
        errors.push(`${where} is copied from ${DEFAULT_LOCALE} (i18n: ${field.i18n}) but differs`)
      }
    } else if (translation && !isTranslatable(field)) {
      errors.push(
        `${where} isn't translatable (i18n: true), so it belongs in ${DEFAULT_LOCALE} only`,
      )
    }
    // A cleared optional field is saved as an empty string, whatever its type
    if (value === '' && field.required === false) continue

    switch (field.widget) {
      case 'string':
      case 'text':
      case 'markdown':
        if (typeof value !== 'string') errors.push(`${where} should be a string`)
        break
      case 'datetime':
        if (!(value instanceof Date)) {
          errors.push(`${where} should be an unquoted TOML date (e.g. 2026-03-03)`)
        }
        break
      case 'image':
        if (typeof value !== 'string' || !value.startsWith(`${config.public_folder}/`)) {
          errors.push(`${where} should be a path under ${config.public_folder}/`)
        } else {
          const file = join(config.media_folder, value.slice(config.public_folder.length))
          if (!existsSync(join(ROOT, file)))
            errors.push(`${where} points to a missing file: ${file}`)
        }
        break
      case 'list':
        if (!Array.isArray(value)) {
          errors.push(`${where} should be a list`)
        } else if (field.fields) {
          // Translated items line up with the default locale's by position (see mergeLocalized)
          const baseItems = base?.[field.name] as Data[] | undefined
          if (translation && baseItems && value.length > baseItems.length) {
            errors.push(`${where} has more items than in ${DEFAULT_LOCALE} (${baseItems.length})`)
          }
          value.forEach((item, i) => {
            errors.push(
              ...checkFields(item, field.fields!, {
                path: `${path} ${field.name}[${i}]`,
                translation,
                base: baseItems?.[i],
              }),
            )
          })
        }
        break
      case 'object':
        if (typeof value !== 'object' || value === null || Array.isArray(value)) {
          errors.push(`${where} should be a table`)
        } else {
          errors.push(
            ...checkFields(value as Data, field.fields ?? [], {
              path: `${path} ${field.name}`,
              translation,
              base: base?.[field.name] as Data | undefined,
            }),
          )
        }
        break
      default:
        errors.push(
          `${where} uses the \`${field.widget}\` widget, which this test doesn't check yet`,
        )
    }
  }
  return errors
}

describe('CMS config i18n', () => {
  it('has the same locales as the site', () => {
    expect(config.i18n.locales).toEqual([...LOCALES])
    expect(config.i18n.default_locale).toBe(DEFAULT_LOCALE)
  })

  it('only has content folders for supported locales', () => {
    const folders = readdirSync(join(ROOT, 'content')).filter((name) =>
      statSync(join(ROOT, 'content', name)).isDirectory(),
    )
    expect(folders.filter((name) => !LOCALES.includes(name as never))).toEqual([])
  })
})

describe('CMS config coverage', () => {
  it('can edit every content file', () => {
    const editable = new Set(
      targets.flatMap((target) =>
        (isLocalized(target) ? LOCALES : [DEFAULT_LOCALE]).flatMap((l) => filesFor(target, l)),
      ),
    )
    const all = (dir: string): string[] =>
      readdirSync(join(ROOT, dir)).flatMap((name) => {
        const path = `${dir}/${name}`
        return statSync(join(ROOT, path)).isDirectory() ? all(path) : [path]
      })
    const content = all('content').filter((path) => !path.endsWith('.DS_Store'))
    expect(content.filter((path) => !editable.has(path))).toEqual([])
  })

  it('has a styled preview for every entry with the preview pane on', () => {
    const registered = [...previewsSource.matchAll(/registerPreviewTemplate\(\s*'([^']+)'/g)].map(
      (match) => match[1],
    )
    const names = targets.map((target) => target.name)
    expect(registered.filter((name) => !names.includes(name!))).toEqual([])
    expect(targets.filter((target) => target.preview && !registered.includes(target.name))).toEqual(
      [],
    )
  })
})

describe.each(targets)('CMS config: $name ($path)', (target) => {
  it('has content in the default locale', () => {
    expect(filesFor(target, DEFAULT_LOCALE).length).toBeGreaterThan(0)
  })

  it.each(isLocalized(target) ? LOCALES : [DEFAULT_LOCALE])('matches the %s files', (locale) => {
    const translation = locale !== DEFAULT_LOCALE
    const errors = filesFor(target, locale).flatMap((path) => {
      if (target.format.endsWith('frontmatter')) {
        const raw = readFileSync(join(ROOT, path), 'utf8')
        if (!raw.startsWith('+++')) return [`${path}: should start with +++ (TOML frontmatter)`]
      }
      const basePath = path.replace(`/${locale}/`, `/${DEFAULT_LOCALE}/`)
      const base =
        translation && existsSync(join(ROOT, basePath)) ? read(basePath, target.format) : undefined
      return checkFields(read(path, target.format), target.fields, { path, translation, base })
    })
    expect(errors).toEqual([])
  })
})
