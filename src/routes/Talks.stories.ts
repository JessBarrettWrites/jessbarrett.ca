import type { Meta, StoryObj } from '@storybook/vue3-vite'

import { viewports } from '../../.storybook/viewports'

import Talks from '@/routes/Talks.vue'

const DESCRIPTION = `The Talks page, at \`/talks\`: the talks Jessica gives, as cards.`

const meta = {
  title: 'Pages/Talks',
  component: Talks,
  parameters: { layout: 'fullscreen', docs: { description: { component: DESCRIPTION } } },
  decorators: [viewports],
} satisfies Meta<typeof Talks>

export default meta
type Story = StoryObj<typeof meta>

export const Page: Story = {}
