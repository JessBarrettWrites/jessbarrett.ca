import { afterEach, describe, it, expect, vi } from 'vitest'
import { nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import Talk from '@/components/Talk.vue'

const TALK = { slug: 'a-talk', title: 'A Talk', body: '' }

// DEV NOTE: jsdom has no layout, so make the description taller than the collapsed height
const tallBody = () => vi.spyOn(Element.prototype, 'scrollHeight', 'get').mockReturnValue(400)

describe('Talk', () => {
  afterEach(() => vi.restoreAllMocks())

  const body = (wrapper: ReturnType<typeof mount>) => wrapper.find('.overflow-hidden')

  it('collapses a long description by default', async () => {
    tallBody()
    const wrapper = mount(Talk, { props: { talk: TALK }, slots: { default: 'Long description' } })
    await nextTick() // overflow is measured once mounted
    expect(body(wrapper).attributes('style')).toContain('max-height: 200px')
    expect(wrapper.find('button').text()).toBe('Read more')
  })

  it('does not offer to expand a short description', () => {
    const wrapper = mount(Talk, { props: { talk: TALK }, slots: { default: 'Short' } })
    expect(wrapper.find('button').exists()).toBe(false)
  })

  it('shows the whole description when expanded, and can still collapse', async () => {
    tallBody()
    const wrapper = mount(Talk, {
      props: { talk: TALK, expanded: true },
      slots: { default: 'Long description' },
    })
    await nextTick() // overflow is measured once mounted
    expect(body(wrapper).attributes('style') ?? '').not.toContain('max-height')
    expect(wrapper.find('button').text()).toBe('Show less')
    expect(wrapper.find('button').attributes('aria-expanded')).toBe('true')

    await wrapper.find('button').trigger('click')
    expect(body(wrapper).attributes('style')).toContain('max-height: 200px')
    expect(wrapper.find('button').text()).toBe('Read more')
  })
})
