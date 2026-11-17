import type { Meta, StoryObj } from '@storybook/vue3-vite'

import { fields } from '../../.storybook/fields'

import MediaAppearance from '@/components/MediaAppearance.vue'
import { useMediaAppearances } from '@/content'
import { appearanceDateSort } from '@/presentation'

const [latest] = [...useMediaAppearances()].sort(appearanceDateSort)

const DESCRIPTION = `One appearance in the list on the Media page: its title (a link to it, on the
show's or outlet's site, in a new tab), the show or outlet, the date in the page's language, and a
short description when it has one.`

const meta = {
  title: 'Components/MediaAppearance',
  component: MediaAppearance,
  decorators: [() => ({ template: '<div class="max-w-2xl p-6"><story /></div>' })],
  parameters: { docs: { description: { component: DESCRIPTION } } },
} satisfies Meta<typeof MediaAppearance>

export default meta
type Story = StoryObj<typeof meta>

export const Latest: Story = {
  ...fields('appearance', latest!),
  parameters: { docs: { description: { story: 'The latest appearance.' } } },
}

export const WithDescription: Story = {
  ...fields('appearance', {
    ...latest!,
    description: 'A conversation about housing, belonging and what makes a place feel like home.',
  }),
  parameters: { docs: { description: { story: 'An appearance with a description.' } } },
}
