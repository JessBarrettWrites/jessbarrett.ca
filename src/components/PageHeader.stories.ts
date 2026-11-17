import type { Meta, StoryObj } from '@storybook/vue3-vite'

import { viewports } from '../../.storybook/viewports'

import PageHeader from '@/components/PageHeader.vue'
import { MESSAGES } from '@/messages'

const DESCRIPTION = `The banner at the top of an inner page, on teal: its title, with a subtitle
(the \`subtitle\` slot) and an introduction (the default slot) below it when there are any.`

const meta = {
  title: 'Components/PageHeader',
  component: PageHeader,
  parameters: { layout: 'fullscreen', docs: { description: { component: DESCRIPTION } } },
  decorators: [viewports],
  render: (args) => ({
    components: { PageHeader },
    setup: () => ({ args, subtitle: MESSAGES.en.books.description }),
    template: `<PageHeader v-bind="args"><template #subtitle>{{ subtitle }}</template></PageHeader>`,
  }),
} satisfies Meta<typeof PageHeader>

export default meta
type Story = StoryObj<typeof meta>

export const WithSubtitle: Story = {
  args: { title: MESSAGES.en.books.title },
  parameters: { docs: { description: { story: 'A title and its subtitle.' } } },
}

export const TitleOnly: Story = {
  args: { title: MESSAGES.en.books.title },
  render: (args) => ({
    components: { PageHeader },
    setup: () => ({ args }),
    template: '<PageHeader v-bind="args" />',
  }),
  parameters: { docs: { description: { story: 'The title alone, as on the Books page.' } } },
}
