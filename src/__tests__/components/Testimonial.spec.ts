import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import Testimonial from '@/components/Testimonial.vue'
import type { Testimonial as TestimonialType } from '@/types.ts'

const router = createRouter({
  history: createMemoryHistory(),
  routes: [{ path: '/', component: { template: '<div/>' } }],
})

const MOCK_TESTIMONIAL = {
  book: 'test-book',
  quote: 'A wonderful read.',
  name: 'Jane Doe',
}

function mockTestimonial(meta: object = {}): TestimonialType {
  return { ...MOCK_TESTIMONIAL, ...meta }
}

describe('Testimonial', () => {
  it('renders the quote text', () => {
    const wrapper = mount(Testimonial, {
      props: { testimonial: mockTestimonial() },
      global: { plugins: [router] },
    })
    expect(wrapper.text()).toContain('A wonderful read.')
  })

  it('renders the name', () => {
    const wrapper = mount(Testimonial, {
      props: { testimonial: mockTestimonial() },
      global: { plugins: [router] },
    })
    expect(wrapper.text()).toContain('Jane Doe')
  })

  it('renders the role when provided', () => {
    const wrapper = mount(Testimonial, {
      props: { ...{ testimonial: mockTestimonial({ role: 'Author' }) } },
      global: { plugins: [router] },
    })
    expect(wrapper.text()).toContain('Author')
  })

  it('does not render role element when role is absent', () => {
    const wrapper = mount(Testimonial, {
      props: { testimonial: mockTestimonial() },
      global: { plugins: [router] },
    })
    // Only one span should exist for the name; role span should be absent
    const spans = wrapper.findAll('span')
    const roleSpan = spans.find(
      (s) => s.classes().includes('opacity-50') && !s.text().includes(' on '),
    )
    expect(roleSpan).toBeUndefined()
  })

  it('shows " on " and title text when onTitle is provided without a URL', () => {
    const wrapper = mount(Testimonial, {
      props: { ...{ testimonial: mockTestimonial() }, onTitle: 'Some Book' },
      global: { plugins: [router] },
    })
    expect(wrapper.text()).toContain('on')
    expect(wrapper.text()).toContain('Some Book')
    expect(wrapper.find('a').exists()).toBe(false)
  })

  it('renders a RouterLink when both onTitle and onTitleUrl are provided', () => {
    const wrapper = mount(Testimonial, {
      props: {
        ...{ testimonial: mockTestimonial() },
        onTitle: 'Some Book',
        onTitleUrl: '/books#some-book',
      },
      global: { plugins: [router] },
    })
    expect(wrapper.find('a').exists()).toBe(true)
    expect(wrapper.find('a').text()).toBe('Some Book')
  })

  it('does not show " on " when onTitle is absent', () => {
    const wrapper = mount(Testimonial, {
      props: { testimonial: mockTestimonial() },
      global: { plugins: [router] },
    })
    expect(wrapper.text()).not.toContain(' on ')
  })
})
