import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, userEvent } from 'storybook/test'

import { navbarCard } from '../../.storybook/navbar-card'
import { pause } from '../../.storybook/pause'

import ThemeToggle from '@/components/ThemeToggle.vue'
import { DARK_THEME, LIGHT_THEME, type Theme } from '@/constants.ts'

/** An in-memory stand-in for localStorage, holding `theme` */
function themeStorage(theme: Theme): Storage {
  const store = new Map<string, string>([['theme', theme]])
  return {
    getItem: (key) => store.get(key) ?? null,
    setItem: (key, value) => void store.set(key, String(value)),
    removeItem: (key) => void store.delete(key),
    clear: () => store.clear(),
    key: (i) => [...store.keys()][i] ?? null,
    get length() {
      return store.size
    },
  }
}

const DESCRIPTION = `The switch in the site header between the light theme (\`${LIGHT_THEME}\`, on
cream) and the dark theme (\`${DARK_THEME}\`, on deep teal).

Switching changes the whole site's colours straight away, and the choice is remembered for the
visitor's next visit. Before a visitor has chosen, the site follows their device's light or dark
setting. The sun and moon on either side show which way is which.`

// DEV NOTE: ThemeToggle saves the theme in localStorage and sets it on <html> (overriding the
//           toolbar's theme). Each story starts it in the story's `theme` parameter instead, kept in
//           memory, so stories don't share or save a theme, and the toolbar's theme switcher is set to
//           match (`themeOverride`), since it sets <html>'s theme after the toggle does. On the Docs
//           page each story is in its own frame, with its own <html>, so Light and Dark show together.
const meta = {
  title: 'Nav/ThemeToggle',
  component: ThemeToggle,
  // On a header-like card
  decorators: [navbarCard()],
  parameters: {
    docs: {
      story: { inline: false, height: '150px' },
      description: {
        component: DESCRIPTION,
      },
    },
  },
  beforeEach: ({ parameters }) => {
    Object.defineProperty(window, 'localStorage', {
      value: themeStorage(parameters.theme as Theme),
      configurable: true,
    })
    // Back to the browser's own localStorage (on Window's prototype)
    return () => {
      delete (window as { localStorage?: Storage }).localStorage
    }
  },
} satisfies Meta<typeof ThemeToggle>

export default meta
type Story = StoryObj<typeof meta>

export const Light: Story = {
  parameters: {
    theme: LIGHT_THEME,
    themes: { themeOverride: 'light' },
    docs: { description: { story: 'Off: the light theme.' } },
  },
}

export const Dark: Story = {
  parameters: {
    theme: DARK_THEME,
    themes: { themeOverride: 'dark' },
    docs: { description: { story: 'On: the dark theme.' } },
  },
}

export const Toggle: Story = {
  // An interaction test: in the sidebar, with its steps in the Interactions panel, not on the Docs page
  tags: ['!autodocs'],
  parameters: { theme: LIGHT_THEME, themes: { themeOverride: 'light' } },
  play: async ({ canvas, step }) => {
    const toggle = canvas.getByRole('checkbox')
    await expect(toggle).not.toBeChecked()

    await step('Switch to the dark theme', async () => {
      await pause()
      await userEvent.click(toggle)
      await expect(toggle).toBeChecked()
      await expect(document.documentElement).toHaveAttribute('data-theme', DARK_THEME)
      await pause()
    })
    await step('Switch back to the light theme', async () => {
      await userEvent.click(toggle)
      await expect(document.documentElement).toHaveAttribute('data-theme', LIGHT_THEME)
    })
  },
}
