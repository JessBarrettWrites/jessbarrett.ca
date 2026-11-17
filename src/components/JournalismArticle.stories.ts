import type { Meta, StoryObj } from '@storybook/vue3-vite'

import { fields } from '../../.storybook/fields'

import JournalismArticle from '@/components/JournalismArticle.vue'
import { useJournalismArticles } from '@/content'
import { articleDateSort } from '@/presentation'

const [latest] = [...useJournalismArticles()].sort(articleDateSort)

const DESCRIPTION = `One article in the list on the Journalism page: its title (a link to it, on the
publication's site, in a new tab), the publication, the date in the page's language, and a short
description when it has one.`

const meta = {
  title: 'Components/JournalismArticle',
  component: JournalismArticle,
  decorators: [() => ({ template: '<div class="max-w-2xl p-6"><story /></div>' })],
  parameters: { docs: { description: { component: DESCRIPTION } } },
} satisfies Meta<typeof JournalismArticle>

export default meta
type Story = StoryObj<typeof meta>

export const Latest: Story = {
  ...fields('article', latest!),
  parameters: { docs: { description: { story: 'The latest article.' } } },
}

export const WithoutDescription: Story = {
  ...fields('article', { ...latest!, description: undefined }),
  parameters: { docs: { description: { story: 'An article with no description.' } } },
}
