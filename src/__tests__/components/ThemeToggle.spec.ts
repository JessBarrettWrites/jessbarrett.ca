import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import ThemeToggle from '@/components/ThemeToggle.vue'
import { lightTheme, darkTheme } from '@/constants'

function mockStorage() {
  const store: Record<string, string> = {}
  return {
    getItem: (k: string) => store[k] ?? null,
    setItem: (k: string, v: string) => {
      store[k] = v
    },
    removeItem: (k: string) => {
      delete store[k]
    },
    clear: () => {
      Object.keys(store).forEach((k) => delete store[k])
    },
    key: (i: number) => Object.keys(store)[i] ?? null,
    get length() {
      return Object.keys(store).length
    },
  }
}

let storage: ReturnType<typeof mockStorage>
let wrapper: VueWrapper

beforeEach(() => {
  storage = mockStorage()
  vi.stubGlobal('localStorage', storage)
  document.documentElement.removeAttribute('data-theme')
})

afterEach(async () => {
  wrapper?.unmount()
  vi.unstubAllGlobals()
})

describe('ThemeToggle', () => {
  it('renders a checkbox toggle', () => {
    wrapper = mount(ThemeToggle)
    expect(wrapper.find('input[type="checkbox"]').exists()).toBe(true)
  })

  it('applies the light theme to the document when theme is stored as light', async () => {
    storage.setItem('theme', lightTheme)
    wrapper = mount(ThemeToggle)
    await new Promise((r) => setTimeout(r, 0))
    expect(document.documentElement.getAttribute('data-theme')).toBe(lightTheme)
  })

  it('applies the dark theme to the document when theme is stored as dark', async () => {
    storage.setItem('theme', darkTheme)
    wrapper = mount(ThemeToggle)
    await new Promise((r) => setTimeout(r, 0))
    expect(document.documentElement.getAttribute('data-theme')).toBe(darkTheme)
  })

  it('toggles from light to dark when checkbox is changed', async () => {
    storage.setItem('theme', lightTheme)
    wrapper = mount(ThemeToggle)
    await wrapper.find('input[type="checkbox"]').trigger('change')
    expect(storage.getItem('theme')).toBe(darkTheme)
  })

  it('toggles from dark to light when checkbox is changed', async () => {
    storage.setItem('theme', darkTheme)
    wrapper = mount(ThemeToggle)
    await wrapper.find('input[type="checkbox"]').trigger('change')
    expect(storage.getItem('theme')).toBe(lightTheme)
  })
})
