import type { Meta, StoryObj } from '@storybook/vue3-vite'

import { viewports } from '../../.storybook/viewports'

import Journalism from '@/routes/Journalism.vue'

const DESCRIPTION = `The Journalism page, at \`/journalism\`: selected articles, newest first, each a
link to the publication's site.`

const meta = {
  title: 'Pages/Journalism',
  component: Journalism,
  parameters: { layout: 'fullscreen', docs: { description: { component: DESCRIPTION } } },
  decorators: [viewports],
} satisfies Meta<typeof Journalism>

export default meta
type Story = StoryObj<typeof meta>

export const Page: Story = {}
