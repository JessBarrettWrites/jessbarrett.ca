/** Parses a date string, returning undefined if the value is missing or invalid. */
export function parseDate(value: string | undefined): Date | undefined {
  if (!value) return undefined
  const d = new Date(value)
  return isNaN(d.getTime()) ? undefined : d
}
