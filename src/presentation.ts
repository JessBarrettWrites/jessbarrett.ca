import type { JournalismArticle, Book } from '@/types.ts'

// Sort Books by preorder and availability date
export function bookDateSort(left: Book, right: Book): number {
  const leftKey = (left.preorder ?? left.available)?.getTime() ?? Infinity
  const rightKey = (right.preorder ?? right.available)?.getTime() ?? Infinity
  return leftKey - rightKey
}

// Sort Articles by date
export function articleDateSort(left: JournalismArticle, right: JournalismArticle): number {
  return right.date.getTime() - left.date.getTime()
}

// Display for article date
export function articleDateString(article: JournalismArticle, locale: string | undefined): string {
  return article.date.toLocaleDateString(locale, {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

// Filter books by featured
export function featuredBookFilter(today: Date) {
  return (book: Book) => {
    return !!book.featuredUntil && today <= book.featuredUntil
  }
}
