/** The distinct values of all the iterables, sorted, e.g. `uniqueSortedArray(['b', 'a'], ['a', 'c'])` →
 *  `['a', 'b', 'c']` */
export function uniqueSortedArray<T>(...iterables: Iterable<T>[]): T[] {
  return [...new Set(iterables.flatMap((iterable) => [...iterable]))].sort()
}
