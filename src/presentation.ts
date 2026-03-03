import type { JournalismArticle, Book } from '@/types.ts'

// Sort Books by preorder and availability date
export function bookDateSort(left: Book, right: Book): number {
  const leftKey = (left.meta.preorder ?? left.meta.available)?.getTime() ?? Infinity
  const rightKey = (right.meta.preorder ?? right.meta.available)?.getTime() ?? Infinity
  return leftKey - rightKey
}

// Sort Articles by date
export function articleDateSort(left: JournalismArticle, right: JournalismArticle): number {
  return right.date.getTime() - left.date.getTime()
}

// Display for article date
export function articleDateString(article: JournalismArticle, locale: string): string {
  return article.date.toLocaleDateString(locale, {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}
