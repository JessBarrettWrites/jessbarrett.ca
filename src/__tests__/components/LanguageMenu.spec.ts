import { describe, it, expect } from 'vitest'
import { computed } from 'vue'
import { mount } from '@vue/test-utils'
import { createMemoryHistory, createRouter } from 'vue-router'
import LanguageMenu from '@/components/LanguageMenu.vue'
import { LOCALE_KEY } from '@/locale'

const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    { path: '/fr/books', component: { template: '<div/>' }, meta: { locale: 'fr', page: 'books' } },
    { path: '/en/books', component: { template: '<div/>' }, meta: { locale: 'en', page: 'books' } },
  ],
})

async function mountAt(path: string) {
  await router.push(path)
  await router.isReady()
  return mount(LanguageMenu, {
    global: {
      plugins: [router],
      provide: { [LOCALE_KEY as symbol]: computed(() => router.currentRoute.value.meta.locale) },
    },
  })
}

describe('LanguageMenu', () => {
  it('links to the current page in every language, keeping the hash', async () => {
    const wrapper = await mountAt('/fr/books#no-place-like-home')
    const links = wrapper.findAll('a').map((a) => [a.attributes('hreflang'), a.attributes('href')])
    expect(links).toEqual([
      ['en-CA', '/en/books#no-place-like-home'],
      ['fr-CA', '/fr/books#no-place-like-home'],
      ['es', '/es/books#no-place-like-home'],
    ])
  })

  it('marks the current language', async () => {
    const wrapper = await mountAt('/fr/books')
    const current = wrapper.findAll('a').filter((a) => a.attributes('aria-current') === 'true')
    expect(current.map((a) => a.text())).toEqual(['FRFrançais'])
  })

  it('labels the button in the current language', async () => {
    const wrapper = await mountAt('/fr/books')
    expect(wrapper.find('[role="button"]').attributes('aria-label')).toBe('Langue')
  })
})
