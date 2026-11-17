import type { Meta, StoryObj } from '@storybook/vue3-vite'

import { viewports } from '../../.storybook/viewports'

import Media from '@/routes/Media.vue'

const DESCRIPTION = `The Media page, at \`/media\`: podcasts, interviews and other appearances,
newest first, each a link to the show's or outlet's site.`

const meta = {
  title: 'Pages/Media',
  component: Media,
  parameters: { layout: 'fullscreen', docs: { description: { component: DESCRIPTION } } },
  decorators: [viewports],
} satisfies Meta<typeof Media>

export default meta
type Story = StoryObj<typeof meta>

export const Page: Story = {}
