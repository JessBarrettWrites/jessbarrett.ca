import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import App from '../App.vue'
import routes from '@/routes'

const router = createRouter({ history: createMemoryHistory(), routes })

describe('App', () => {
  it('renders the site title', async () => {
    const wrapper = mount(App, { global: { plugins: [router] } })
    await router.isReady()
    expect(wrapper.text()).toContain('Jessica Barrett')
  })
})