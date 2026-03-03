import { describe, it, expect } from 'vitest'
import { parseDate } from '@/util'

describe('parseDate', () => {
  it('returns undefined for undefined input', () => {
    expect(parseDate(undefined)).toBeUndefined()
  })

  it('returns undefined for empty string', () => {
    expect(parseDate('')).toBeUndefined()
  })

  it('returns undefined for an invalid date string', () => {
    expect(parseDate('not-a-date')).toBeUndefined()
    expect(parseDate('2025-99-99')).toBeUndefined()
  })

  it('returns a Date for a valid ISO date string', () => {
    const result = parseDate('2025-01-15')
    expect(result).toBeInstanceOf(Date)
    expect(isNaN(result!.getTime())).toBe(false)
  })

  it('preserves the correct year, month, and day in local time', () => {
    const result = parseDate('2026-03-03')!
    expect(result.getFullYear()).toBe(2026)
    expect(result.getMonth()).toBe(2) // 0-indexed
    expect(result.getDate()).toBe(3)
  })
})