import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AmDashMarkdown from '@/components/AmDashMarkdown.vue'

describe('Markdown', () => {
  it('renders plain text wrapped in a paragraph', () => {
    const wrapper = mount(AmDashMarkdown, { slots: { default: 'Hello world' } })
    expect(wrapper.text()).toContain('Hello world')
  })

  it('converts ***bold*** to <strong>', () => {
    const wrapper = mount(AmDashMarkdown, { slots: { default: '***bold text***' } })
    expect(wrapper.find('strong').exists()).toBe(true)
    expect(wrapper.find('strong').text()).toBe('bold text')
  })

  it('converts **bold** to <strong>', () => {
    const wrapper = mount(AmDashMarkdown, { slots: { default: '**bold text**' } })
    expect(wrapper.find('strong').exists()).toBe(true)
    expect(wrapper.find('strong').text()).toBe('bold text')
  })

  it('converts _italic_ to <em>', () => {
    const wrapper = mount(AmDashMarkdown, { slots: { default: '_italic text_' } })
    expect(wrapper.find('em').exists()).toBe(true)
  })

  it('converts *italic* to <em>', () => {
    const wrapper = mount(AmDashMarkdown, { slots: { default: '*italic text*' } })
    expect(wrapper.find('em').exists()).toBe(true)
  })

  it('renders a markdown link as an <a> tag', () => {
    const wrapper = mount(AmDashMarkdown, {
      slots: { default: '[click here](https://example.com)' },
    })
    const a = wrapper.find('a')
    expect(a.exists()).toBe(true)
    expect(a.attributes('href')).toBe('https://example.com')
    expect(a.text()).toBe('click here')
  })

  it('renders empty slot as empty content', () => {
    const wrapper = mount(AmDashMarkdown, { slots: { default: '' } })
    expect(wrapper.text()).toBe('')
  })
})
