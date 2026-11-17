import type { Meta, StoryObj } from '@storybook/vue3-vite'

import FooterQuote from '@/components/FooterQuote.vue'

const DESCRIPTION = `A quote across the foot of a page, on teal: the About page's pull quote. Its
text (the default slot) is Markdown, with am dashes.`

const meta = {
  title: 'Components/FooterQuote',
  component: FooterQuote,
  parameters: { layout: 'fullscreen', docs: { description: { component: DESCRIPTION } } },
  render: () => ({
    components: { FooterQuote },
    template: '<FooterQuote>Home is where the heart is — and so much more.</FooterQuote>',
  }),
} satisfies Meta<typeof FooterQuote>

export default meta
type Story = StoryObj<typeof meta>

export const Quote: Story = {}
