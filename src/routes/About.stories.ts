import type { Meta, StoryObj } from '@storybook/vue3-vite'

import { viewports } from '../../.storybook/viewports'

import About from '@/routes/About.vue'

const DESCRIPTION = `The About page, at \`/about\`: Jessica's portrait and biography, with a pull
quote at its foot.`

const meta = {
  title: 'Pages/About',
  component: About,
  parameters: { layout: 'fullscreen', docs: { description: { component: DESCRIPTION } } },
  decorators: [viewports],
} satisfies Meta<typeof About>

export default meta
type Story = StoryObj<typeof meta>

export const Page: Story = {}
