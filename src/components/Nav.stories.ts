import type { Meta, StoryObj } from '@storybook/vue3-vite'

import { viewports } from '../../.storybook/viewports'

import Nav from '@/components/Nav.vue'
import { AUTHOR_NAME } from '@/constants'
import { MESSAGES } from '@/messages'

const DESCRIPTION = `The frame around every page: the header, with the author's name (a link to the
home page), the menu, the email and Instagram links, the language menu and the theme toggle, then
the page itself below it.

The header stays put while the page scrolls under it. From 1024px the menu is in the header itself,
with the author's title beside her name; below that it folds behind a menu button, which opens it
as a dropdown.`

// Each story shows the header at every viewport size, side by side, over a stand-in page
const meta = {
  title: 'Nav/Nav',
  component: Nav,
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: DESCRIPTION } },
  },
  decorators: [viewports],
  render: (args) => ({
    components: { Nav },
    setup: () => ({ args }),
    template: `
      <Nav v-bind="args">
        <article class="p-6 opacity-50">The page, under the header.</article>
      </Nav>`,
  }),
} satisfies Meta<typeof Nav>

export default meta
type Story = StoryObj<typeof meta>

export const Devices: Story = {
  args: { title: AUTHOR_NAME, subtitle: MESSAGES.en.author },
  parameters: {
    docs: {
      description: {
        story:
          'At each device size: the full menu on desktop, the menu button on tablets and phones.',
      },
    },
  },
}
