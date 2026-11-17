import type { Meta, StoryObj } from '@storybook/vue3-vite'

import { viewports } from '../../.storybook/viewports'

import JournalismContent from '@/components/JournalismContent.vue'
import { useJournalismPage } from '@/content'

const DESCRIPTION = `The Journalism page's content: its title and description, then every article,
newest first (\`content/<language>/journalism.toml\`). With no articles, it says they're coming
soon.`

const meta = {
  title: 'Components/JournalismContent',
  component: JournalismContent,
  parameters: { layout: 'fullscreen', docs: { description: { component: DESCRIPTION } } },
  decorators: [viewports],
} satisfies Meta<typeof JournalismContent>

export default meta
type Story = StoryObj<typeof meta>

export const AllArticles: Story = {
  args: { page: useJournalismPage() },
  parameters: { docs: { description: { story: 'Every article.' } } },
}

export const ComingSoon: Story = {
  args: { page: { ...useJournalismPage(), articles: [] } },
  parameters: { docs: { description: { story: 'No articles yet.' } } },
}
