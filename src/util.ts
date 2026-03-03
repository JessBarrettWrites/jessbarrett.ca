/** Parses a date string, returning undefined if the value is missing or invalid.
 *  Appends T0:00:00 to date-only strings so they are parsed as local time rather than UTC. */
export function parseDate(value: string | undefined): Date | undefined {
  if (!value) return undefined
  const local = value.includes('T') ? value : `${value}T00:00:00`
  const d = new Date(local)
  return isNaN(d.getTime()) ? undefined : d
}
