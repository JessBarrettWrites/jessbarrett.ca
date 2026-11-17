import type { Meta, StoryObj } from '@storybook/vue3-vite'

import AmDashMarkdown from '@/components/AmDashMarkdown.vue'

const DESCRIPTION = `Markdown from \`content/\` (its default slot) as HTML, with each em dash (—, or
\`--\`) as an am dash where the site's fonts are used (see AmDash).`

const MARKDOWN = `A **paragraph** of Markdown — with a [link](https://jessbarrett.ca) and a dash.

A second paragraph -- with another.`

const meta = {
  title: 'Components/AmDashMarkdown',
  component: AmDashMarkdown,
  parameters: { docs: { description: { component: DESCRIPTION } } },
  render: () => ({
    components: { AmDashMarkdown },
    setup: () => ({ markdown: MARKDOWN }),
    template: `<AmDashMarkdown class="max-w-xl p-6 font-serif text-lg [&_p+p]:mt-4 [&_a]:underline">{{ markdown }}</AmDashMarkdown>`,
  }),
} satisfies Meta<typeof AmDashMarkdown>

export default meta
type Story = StoryObj<typeof meta>

export const Paragraphs: Story = {}
