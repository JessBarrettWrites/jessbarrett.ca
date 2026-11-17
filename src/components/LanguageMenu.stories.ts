import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, userEvent } from 'storybook/test'

import { navbarCard } from '../../.storybook/navbar-card'
import { pause } from '../../.storybook/pause'

import LanguageMenu from '@/components/LanguageMenu.vue'
import { MESSAGES } from '@/messages.ts'

const DESCRIPTION = `The globe button in the site header for choosing the language: English, French
or Spanish.

Before a visitor chooses, the page is shown in their browser's language. Their choice is remembered
in a cookie, so they see that language on their next visit. Choosing a language shows the same page
in it, without changing its address. The current language is marked in the menu.

The menu opens when the button is clicked or reached with the keyboard, and closes once a language
is chosen.`

const meta = {
  title: 'Nav/LanguageMenu',
  component: LanguageMenu,
  // On a header-like card, with room for the dropdown, which opens below and to the left
  decorators: [navbarCard({ below: '150px', left: '160px' })],
  parameters: {
    docs: {
      description: {
        component: DESCRIPTION,
      },
    },
  },
} satisfies Meta<typeof LanguageMenu>

export default meta
type Story = StoryObj<typeof meta>

export const Hidden: Story = {
  parameters: { docs: { description: { story: 'Closed, as it first appears in the header.' } } },
}

// Open, as it is while it has focus: daisyUI's `dropdown-open` keeps it open (Vue passes the class on
// to the menu's outer element)
export const Expanded: Story = {
  parameters: {
    docs: { description: { story: 'Open, listing the languages, with the current one marked.' } },
  },
  render: () => ({
    components: { LanguageMenu },
    template: '<LanguageMenu class="dropdown-open" />',
  }),
}

export const ChooseFrench: Story = {
  // An interaction test: in the sidebar, with its steps in the Interactions panel, not on the Docs page
  tags: ['!autodocs'],
  globals: { locale: 'en' },
  play: async ({ canvas, step }) => {
    await step('Open the language menu', async () => {
      await pause()
      await userEvent.click(canvas.getByRole('button', { name: MESSAGES.en.nav.language }))
      await pause()
    })
    await step('Choose Français', async () => {
      await userEvent.click(canvas.getByRole('button', { name: /Français/ }))
      await pause()
    })
    // Choosing closes the dropdown, so open it again to see Français marked as the current language
    await step('Open the menu again: it is in French, with Français chosen', async () => {
      await userEvent.click(canvas.getByRole('button', { name: MESSAGES.fr.nav.language }))
      await pause()
      await expect(canvas.getByRole('button', { name: /Français/ })).toHaveAttribute(
        'aria-current',
        'true',
      )
    })
  },
}
