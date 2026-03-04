import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import Book from '@/components/Book.vue'
import type { Book as BookType } from '@/types'

const TEST_ROUTER = createRouter({
  history: createMemoryHistory(),
  routes: [
    { path: '/', component: { template: '<div/>' } },
    { path: '/books', component: { template: '<div/>' } },
  ],
})

const TEST_BOOK_DEFAULTS = {
  slug: 'test-book',
  title: 'Test Book',
  imageSrc: '/images/test.jpg',
  imageAlt: 'Test book cover',
  url: 'https://example.com',
  accolades: [],
  testimonials: [],
  body: '',
}

function mockBook(overrides: object = {}): BookType {
  return {
    ...TEST_BOOK_DEFAULTS,
    ...overrides,
  }
}

// DEV NOTE: 86,400,000 seconds = 1 day
const tomorrow = new Date(Date.now() + 86_400_000)
const yesterday = new Date(Date.now() - 86_400_000)

describe('Book — featured label', () => {
  it('shows "Featured Book" when featuredUntil is in the future', () => {
    const wrapper = mount(Book, {
      props: { book: mockBook({ featuredUntil: tomorrow }) },
      global: { plugins: [TEST_ROUTER] },
    })
    expect(wrapper.text()).toContain('Featured Book')
  })

  it('does not show "Featured Book" when featuredUntil is in the past', () => {
    const wrapper = mount(Book, {
      props: { book: mockBook({ featuredUntil: yesterday }) },
      global: { plugins: [TEST_ROUTER] },
    })
    expect(wrapper.text()).not.toContain('Featured Book')
  })

  it('does not show "Featured Book" when featuredUntil is absent', () => {
    const wrapper = mount(Book, {
      props: { book: mockBook() },
      global: { plugins: [TEST_ROUTER] },
    })
    expect(wrapper.text()).not.toContain('Featured Book')
  })
})

describe('Book — availability status', () => {
  it('shows "Available Now" when available date is today or past', () => {
    const wrapper = mount(Book, {
      props: { book: mockBook({ available: yesterday }) },
      global: { plugins: [TEST_ROUTER] },
    })
    expect(wrapper.text()).toContain('Available Now')
  })

  it('shows "Available for Pre-Order" when preorder is past but available is future', () => {
    const wrapper = mount(Book, {
      props: { book: mockBook({ preorder: yesterday, available: tomorrow }) },
      global: { plugins: [TEST_ROUTER] },
    })
    expect(wrapper.text()).toContain('Available for Pre-Order')
  })

  it('shows no status text when no dates are set', () => {
    const wrapper = mount(Book, {
      props: { book: mockBook() },
      global: { plugins: [TEST_ROUTER] },
    })
    expect(wrapper.text()).not.toContain('Available Now')
    expect(wrapper.text()).not.toContain('Available for Pre-Order')
  })
})

describe('Book — image', () => {
  it('renders the image with the provided src and alt', () => {
    const wrapper = mount(Book, {
      props: { book: mockBook() },
      global: { plugins: [TEST_ROUTER] },
    })
    const img = wrapper.find('img')
    expect(img.exists()).toBe(true)
    expect(img.attributes('src')).toBe('/images/test.jpg')
    expect(img.attributes('alt')).toBe('Test book cover')
  })

  it('renders the image with width and height attributes to prevent layout shift', () => {
    const wrapper = mount(Book, {
      props: { book: mockBook() },
      global: { plugins: [TEST_ROUTER] },
    })
    const img = wrapper.find('img')
    expect(img.attributes('width')).toBe('300')
    expect(img.attributes('height')).toBe('450')
  })
})

describe('Book — content', () => {
  it('renders the book title', () => {
    const wrapper = mount(Book, {
      props: { book: mockBook() },
      global: { plugins: [TEST_ROUTER] },
    })
    expect(wrapper.text()).toContain('Test Book')
  })

  it('renders subtitle when provided', () => {
    const wrapper = mount(Book, {
      props: { book: mockBook({ subtitle: 'A Subtitle' }) },
      global: { plugins: [TEST_ROUTER] },
    })
    expect(wrapper.text()).toContain('A Subtitle')
  })

  it('renders the link text, defaulting to "Get the Book"', () => {
    const wrapper = mount(Book, {
      props: { book: mockBook() },
      global: { plugins: [TEST_ROUTER] },
    })
    expect(wrapper.text()).toContain('Get the Book')
  })

  it('renders custom linkText when provided', () => {
    const wrapper = mount(Book, {
      props: { book: mockBook(), linkText: 'Buy Now' },
      global: { plugins: [TEST_ROUTER] },
    })
    expect(wrapper.text()).toContain('Buy Now')
  })
})
