import type { Meta, StoryObj } from '@storybook/vue3-vite'

import { viewports } from '../../.storybook/viewports'

import TalksContent from '@/components/TalksContent.vue'
import { useTalks, useTalksPage } from '@/content'

const DESCRIPTION = `The Talks page's content: its title, subtitle and description
(\`content/<language>/talks.toml\`), then a card for each talk, two to a row on wider screens.`

const meta = {
  title: 'Components/TalksContent',
  component: TalksContent,
  parameters: { layout: 'fullscreen', docs: { description: { component: DESCRIPTION } } },
  decorators: [viewports],
} satisfies Meta<typeof TalksContent>

export default meta
type Story = StoryObj<typeof meta>

export const AllTalks: Story = {
  args: { page: useTalksPage(), talks: useTalks() },
  parameters: { docs: { description: { story: 'Every talk.' } } },
}
