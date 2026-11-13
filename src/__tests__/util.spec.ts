import { describe, it, expect } from 'vitest'
import { uniqueSortedArray } from '@/util'

describe('uniqueSortedArray', () => {
  it('combines the iterables, without duplicates, sorted', () => {
    expect(uniqueSortedArray(['b', 'a'], new Set(['a', 'c']))).toEqual(['a', 'b', 'c'])
  })

  it('accepts map keys', () => {
    expect(uniqueSortedArray(new Map([['z', 1]]).keys(), [])).toEqual(['z'])
  })

  it('is empty without values', () => {
    expect(uniqueSortedArray()).toEqual([])
  })
})
