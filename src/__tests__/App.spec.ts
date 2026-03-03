import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import App from '../App.vue'
import routes from '@/routes'

// DEV NOTE: Unhead fails in tests, so just mock it out
vi.mock('@unhead/vue', () => ({
  useHead: vi.fn(),
}))

const router = createRouter({ history: createMemoryHistory(), routes })

describe('App', () => {
  it('renders the site title', async () => {
    const wrapper = mount(App, { global: { plugins: [router] } })
    await router.isReady()
    expect(wrapper.text()).toContain('Jessica Barrett')
  })
})
