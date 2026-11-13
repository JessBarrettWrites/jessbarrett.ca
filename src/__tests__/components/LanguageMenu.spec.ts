import { describe, it, expect, vi } from 'vitest'
import { ref } from 'vue'
import { mount } from '@vue/test-utils'
import LanguageMenu from '@/components/LanguageMenu.vue'
import { LOCALE_KEY, SELECT_LOCALE_KEY, type Locale } from '@/locale'

function mountIn(locale: Locale, selectLocale = vi.fn()) {
  return mount(LanguageMenu, {
    global: {
      provide: {
        [LOCALE_KEY as symbol]: ref(locale),
        [SELECT_LOCALE_KEY as symbol]: selectLocale,
      },
    },
  })
}

describe('LanguageMenu', () => {
  it('offers every language, each labelled in itself', () => {
    const wrapper = mountIn('fr')
    const options = wrapper.findAll('button').map((b) => [b.attributes('lang'), b.text()])
    expect(options).toEqual([
      ['en-CA', 'ENEnglish'],
      ['fr-CA', 'FRFrançais'],
      ['es', 'ESEspañol'],
    ])
  })

  it('chooses the clicked language', async () => {
    const selectLocale = vi.fn()
    const wrapper = mountIn('fr', selectLocale)
    await wrapper.find('button[lang="es"]').trigger('click')
    expect(selectLocale).toHaveBeenCalledWith('es')
  })

  it('marks the current language', () => {
    const wrapper = mountIn('fr')
    const current = wrapper.findAll('button').filter((b) => b.attributes('aria-current') === 'true')
    expect(current.map((b) => b.text())).toEqual(['FRFrançais'])
  })

  it('labels the button in the current language', () => {
    const wrapper = mountIn('fr')
    expect(wrapper.find('[role="button"]').attributes('aria-label')).toBe('Langue')
  })
})
