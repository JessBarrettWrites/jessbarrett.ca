import type { Meta, StoryObj } from '@storybook/vue3-vite'

import { viewports } from '../../.storybook/viewports'

import Books from '@/routes/Books.vue'

const DESCRIPTION = `The Books page, at \`/books\`: every book, in order of release, their covers on
alternating sides. Each book can be linked to by its slug (\`/books#no-place-like-home\`).`

const meta = {
  title: 'Pages/Books',
  component: Books,
  parameters: { layout: 'fullscreen', docs: { description: { component: DESCRIPTION } } },
  decorators: [viewports],
} satisfies Meta<typeof Books>

export default meta
type Story = StoryObj<typeof meta>

export const Page: Story = {}
