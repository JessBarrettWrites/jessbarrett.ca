import { setup, type Decorator, type Preview } from '@storybook/vue3-vite'
import { withThemeByDataAttribute } from '@storybook/addon-themes'
import { createHead } from '@unhead/vue/client'
import { useGlobals } from 'storybook/preview-api'
import { provide, readonly, ref } from 'vue'
import { createMemoryHistory, createRouter } from 'vue-router'

import '../src/fonts.css'
import '../src/main.css'
import './preview.css'

import { DARK_THEME, LIGHT_THEME } from '../src/constants'
import {
  DEFAULT_LOCALE,
  LOCALE_KEY,
  LOCALE_NAMES,
  LOCALES,
  type Locale,
  SELECT_LOCALE_KEY,
} from '../src/locale'
import routes from '../src/routes'

// Components link with RouterLink and pages set their <head>, as in the app (src/main.ts). Links
// change the router's place in memory only, so they don't leave the story.
setup((app) => {
  app.use(createRouter({ history: createMemoryHistory(), routes }))
  app.use(createHead())
})

// DEV NOTE: Stands in for App.vue, which provides the locale being shown. The toolbar's language
//           picker sets it, and so does choosing a language in a story (e.g. LanguageMenu)
const locale = ref<Locale>(DEFAULT_LOCALE)

const withLocale: Decorator = (story, context) => {
  const [globals, updateGlobals] = useGlobals()
  locale.value = globals.locale ?? DEFAULT_LOCALE
  // A story that sets its own `globals: { locale }` (e.g. LanguageMenu's ChooseFrench) locks it: the
  // toolbar can't change it, and Storybook ignores updates to it
  const locked = 'locale' in (context.storyGlobals ?? {})
  return {
    components: { story },
    setup() {
      provide(LOCALE_KEY, readonly(locale))
      // DEV NOTE: Switch the shown locale directly, as App.vue does, and show it in the toolbar
      //           unless the story locks it (updating it then would only re-render the locked one)
      provide(SELECT_LOCALE_KEY, (l: Locale) => {
        locale.value = l
        if (!locked) updateGlobals({ locale: l })
      })
      return { locale }
    },
    // The canvas behind it is a checkerboard (preview.css), so the story has no background of its own.
    // DEV NOTE: Pages read the locale once as they start, so key by it to remount them in a new
    //           language, as App.vue does
    template: '<div class="story text-base-content" :key="locale"><story /></div>',
  }
}

const preview: Preview = {
  // A Docs page per component: its props, and each of its stories
  tags: ['autodocs'],
  globalTypes: {
    locale: {
      description: 'Language of the interface text',
      toolbar: {
        title: 'Language',
        icon: 'globe',
        items: LOCALES.map((l) => ({ value: l, title: LOCALE_NAMES[l] })),
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { locale: DEFAULT_LOCALE },
  decorators: [
    withLocale,
    // Sets data-theme on <html>, as ThemeToggle does on the site
    withThemeByDataAttribute({
      themes: { light: LIGHT_THEME, dark: DARK_THEME },
      defaultTheme: 'light',
      attributeName: 'data-theme',
    }),
  ],
  parameters: {
    // The themes decorator handles backgrounds
    backgrounds: { disable: true },
    controls: {
      // DEV NOTE: The files (content/, the stories) are the source of truth: edits in the Controls
      //           panel are only for trying things out, so there's no "Update story" to write them back
      disableSaveFromUI: true,
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    // 'todo' shows accessibility violations in the panel; 'error' would also fail story tests
    a11y: { test: 'todo' },
  },
}

export default preview
