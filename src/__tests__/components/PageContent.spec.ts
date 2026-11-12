import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AboutContent from '@/components/AboutContent.vue'
import JournalismContent from '@/components/JournalismContent.vue'
import TalksContent from '@/components/TalksContent.vue'

describe('AboutContent', () => {
  const about = {
    title: 'Jessica Barrett',
    subtitle: 'Author',
    imageSrc: '/images/me.jpg',
    imageAlt: 'Portrait',
    body: 'Bio text.',
  }

  it('renders the title, portrait, and body', () => {
    const wrapper = mount(AboutContent, { props: { about } })
    expect(wrapper.find('h1').text()).toBe('Jessica Barrett')
    expect(wrapper.find('img').attributes('src')).toBe('/images/me.jpg')
    expect(wrapper.text()).toContain('Bio text.')
  })

  it('renders the pull quote when present', () => {
    const wrapper = mount(AboutContent, { props: { about: { ...about, pullQuote: 'A quote' } } })
    expect(wrapper.find('blockquote').text()).toContain('A quote')
  })
})

describe('TalksContent', () => {
  const talks = [{ slug: 'a-talk', title: 'A Talk', body: 'About the talk.' }]

  it('renders the description and talks', () => {
    const wrapper = mount(TalksContent, {
      props: { page: { title: 'Talks', description: 'Book a talk.' }, talks },
    })
    expect(wrapper.text()).toContain('Book a talk.')
    expect(wrapper.find('h3').text()).toBe('A Talk')
  })
})

describe('JournalismContent', () => {
  const article = (title: string, date: string) => ({
    title,
    publication: 'A Paper',
    date: new Date(`${date}T00:00:00`),
    url: `https://example.com/${title}`,
  })

  it('renders the description as the subtitle', () => {
    const wrapper = mount(JournalismContent, {
      props: { page: { description: 'Selected reporting and essays', articles: [] } },
    })
    expect(wrapper.text()).toContain('Selected reporting and essays')
    expect(wrapper.text()).toContain('Coming soon.')
  })

  it('sorts articles newest first', () => {
    const wrapper = mount(JournalismContent, {
      props: {
        page: { articles: [article('older', '2020-01-01'), article('newer', '2026-01-01')] },
      },
    })
    const links = wrapper.findAll('a').map((a) => a.attributes('href'))
    expect(links).toEqual(['https://example.com/newer', 'https://example.com/older'])
  })
})
