import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, flushPromises, type VueWrapper } from '@vue/test-utils'
import AmDash from '@/components/AmDash.vue'

let wrapper: VueWrapper
let getComputedStyleSpy: { mockRestore: () => void } | undefined

beforeEach(() => {
  Object.defineProperty(document, 'fonts', {
    value: { ready: Promise.resolve() },
    configurable: true,
  })
})

afterEach(() => {
  wrapper?.unmount()
  getComputedStyleSpy?.mockRestore()
})

function mockFontFamily(fontFamily: string) {
  getComputedStyleSpy = vi
    .spyOn(window, 'getComputedStyle')
    .mockReturnValue({ fontFamily } as CSSStyleDeclaration)
}

describe('AmDash', () => {
  it('renders an em dash by default before fonts load', () => {
    Object.defineProperty(document, 'fonts', {
      value: { ready: new Promise(() => {}) },
      configurable: true,
    })
    wrapper = mount(AmDash)
    expect(wrapper.text()).toBe('—')
  })

  it('renders am- ligature when TimesNewHuman is the computed font', async () => {
    mockFontFamily('"TimesNewHuman", serif')
    wrapper = mount(AmDash)
    await flushPromises()
    expect(wrapper.find('[aria-hidden="true"]').text()).toBe('am-')
    expect(wrapper.find('.sr-only').text()).toBe('—')
  })

  it('renders am- ligature when Areal is the computed font', async () => {
    mockFontFamily('"Areal", sans-serif')
    wrapper = mount(AmDash)
    await flushPromises()
    expect(wrapper.find('[aria-hidden="true"]').text()).toBe('am-')
    expect(wrapper.find('.sr-only').text()).toBe('—')
  })

  it('keeps em dash when a non-amdash font is used', async () => {
    mockFontFamily('"Montserrat", sans-serif')
    wrapper = mount(AmDash)
    await flushPromises()
    expect(wrapper.find('[aria-hidden="true"]').exists()).toBe(false)
    expect(wrapper.text()).toBe('—')
  })
})