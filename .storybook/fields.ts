import type { ArgTypes, StoryContext } from '@storybook/vue3-vite'
import { computed, h, type Component } from 'vue'

// DEV NOTE: Storybook gives an object prop (a book, a talk, the About page) a single JSON control.
//           `fields()` spreads one into a typed control per value instead (text, date, number, a
//           checkbox), grouped by where they sit in the object, and builds the object back for the
//           component. Lists get a group per item.

type Path = (string | number)[]

// DEV NOTE: Loosely typed, since the fields stand in for the component's props: Storybook's story
//           types expect the props themselves as args
interface StoryFields {
  args: any
  argTypes: ArgTypes
  render: any
}

interface FieldsOptions {
  /** Controls to use instead of the inferred ones, by path within the object, e.g.
   *  `{ imageSrc: { control: 'select', options: [...] } }` or `{ 'cards.0.body': ... }` */
  controls?: ArgTypes
}

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !(value instanceof Date)

/** `(Path) → group` in the Controls panel: `book`, `book › testimonials 1` */
function group(prop: string, path: Path): string {
  const parts = path.slice(0, -1).map((part) => (typeof part === 'number' ? `${part + 1}` : part))
  return [prop, ...parts].join(' › ').replace(/ › (\d+)/g, ' $1')
}

function setPath(target: Record<string, any>, path: Path, value: unknown) {
  const last = path[path.length - 1]!
  const parent = path.slice(0, -1).reduce((node, key) => node[key], target)
  parent[last] = value
}

/**
 * Story settings that edit the `prop` object (starting from `value`) with a typed control per value.
 * Spread them into a story: `{ ...fields('book', book) }`.
 */
export function fields<T extends object>(
  prop: string,
  value: T,
  { controls = {} }: FieldsOptions = {},
): StoryFields {
  const args: Record<string, unknown> = {}
  // The object itself is built from the fields, so it has no control of its own
  const argTypes: ArgTypes = { [prop]: { table: { disable: true } } }
  const paths = new Map<string, { path: Path; isDate: boolean }>()

  const walk = (node: unknown, path: Path) => {
    if (Array.isArray(node)) return node.forEach((item, i) => walk(item, [...path, i]))
    if (isObject(node)) return Object.entries(node).forEach(([key, v]) => walk(v, [...path, key]))
    if (node === undefined || node === null) return

    const relative = path.join('.')
    const key = `${prop}.${relative}`
    const isDate = node instanceof Date
    paths.set(key, { path, isDate })
    // The date control holds a timestamp
    args[key] = isDate ? node.getTime() : node
    argTypes[key] = {
      name: String(path[path.length - 1]),
      control: isDate
        ? 'date'
        : typeof node === 'number'
          ? 'number'
          : typeof node === 'boolean'
            ? 'boolean'
            : 'text',
      // A date is held as a timestamp, so say it's a date rather than a number
      table: { category: group(prop, path), ...(isDate && { type: { summary: 'date' } }) },
      ...controls[relative],
    }
  }
  walk(value, [])

  /** The object, with the fields' current values */
  const build = (current: Record<string, unknown>): T => {
    const built = structuredClone(value) as Record<string, any>
    for (const [key, { path, isDate }] of paths) {
      const field = current[key]
      // A cleared date keeps the original one
      if (isDate && field == null) continue
      setPath(built, path, isDate ? new Date(field as number) : field)
    }
    return built as T
  }

  return {
    args,
    argTypes,
    render: (current: Record<string, any>, context: StoryContext) => ({
      setup() {
        const props = computed(() => {
          const others = Object.entries(current).filter(([key]) => !paths.has(key) && key !== prop)
          return { ...Object.fromEntries(others), [prop]: build(current) }
        })
        return () => h(context.component as Component, props.value)
      },
    }),
  }
}
