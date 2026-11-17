import type { Meta, StoryObj } from '@storybook/vue3-vite'

import { viewports } from '../../.storybook/viewports'

import Home from '@/routes/Home.vue'

const DESCRIPTION = `The home page, at \`/\`: the book trailer (while the visitor is online), the
featured book (or the latest, when none is featured), and the testimonials for every book.`

// Each page story shows the page at every viewport size, side by side. Pages read the language as
// they start, so the toolbar's language picker shows each one in a new language.
const meta = {
  title: 'Pages/Home',
  component: Home,
  parameters: { layout: 'fullscreen', docs: { description: { component: DESCRIPTION } } },
  decorators: [viewports],
} satisfies Meta<typeof Home>

export default meta
type Story = StoryObj<typeof meta>

export const Page: Story = {}
