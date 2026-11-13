import { afterEach, describe, it, expect, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import App from '../App.vue'
import { LOCALE_COOKIE, selectedLocale } from '@/locale'
import routes from '@/routes'

// DEV NOTE: Unhead fails in tests, so just mock it out
vi.mock('@unhead/vue', () => ({
  useHead: vi.fn(),
}))

async function mountAt(path: string) {
  const router = createRouter({ history: createMemoryHistory(), routes })
  await router.push(path)
  await router.isReady()
  const wrapper = mount(App, { global: { plugins: [router] } })
  await flushPromises()
  return { router, wrapper }
}

describe('App', () => {
  afterEach(() => {
    document.cookie = `${LOCALE_COOKIE}=; path=/; max-age=0`
    vi.restoreAllMocks()
  })

  it('renders the site title', async () => {
    const { wrapper } = await mountAt('/')
    expect(wrapper.text()).toContain('Jessica Barrett')
  })

  it('shows the plain paths in the browser language', async () => {
    vi.spyOn(navigator, 'languages', 'get').mockReturnValue(['fr-CA'])
    const { wrapper } = await mountAt('/books')
    expect(wrapper.text()).toContain('Livres')
  })

  it('moves visitors off the search engine copies, in their own language', async () => {
    vi.spyOn(navigator, 'languages', 'get').mockReturnValue(['en-US'])
    const { router, wrapper } = await mountAt('/fr/books#no-place-like-home')
    expect(router.currentRoute.value.fullPath).toBe('/books#no-place-like-home')
    expect(wrapper.text()).toContain('Books')
  })

  it('leaves crawlers on the search engine copies', async () => {
    vi.spyOn(navigator, 'userAgent', 'get').mockReturnValue('Mozilla/5.0 (compatible; Googlebot/2.1)')
    const { router, wrapper } = await mountAt('/fr/books')
    expect(router.currentRoute.value.path).toBe('/fr/books')
    expect(wrapper.text()).toContain('Livres')
  })

  it('switches language in place and remembers the choice', async () => {
    vi.spyOn(navigator, 'languages', 'get').mockReturnValue(['en-US'])
    const { router, wrapper } = await mountAt('/books')
    await wrapper.find('button[lang="es"]').trigger('click')
    expect(router.currentRoute.value.path).toBe('/books')
    expect(wrapper.text()).toContain('Libros')
    expect(selectedLocale()).toBe('es')
  })
})
