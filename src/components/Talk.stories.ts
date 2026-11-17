import type { Meta, StoryObj } from '@storybook/vue3-vite'

import AmDashMarkdown from '@/components/AmDashMarkdown.vue'
import Talk from '@/components/Talk.vue'
import { useTalks } from '@/content'

const talks = useTalks()

const DESCRIPTION = `One talk, as a card in the grid on the Talks page: its title and description. A
long description is cut short with a "Read more" button that opens the rest. Talks come from
\`content/<language>/talks/\`.`

const meta = {
  title: 'Components/Talk',
  component: Talk,
  // About as wide as a card in the Talks grid (two columns on desktop)
  decorators: [() => ({ template: '<div class="max-w-xl p-6"><story /></div>' })],
  render: (args) => ({
    components: { Talk, AmDashMarkdown },
    setup: () => ({ args }),
    template: `<Talk v-bind="args"><AmDashMarkdown>{{ args.talk.body }}</AmDashMarkdown></Talk>`,
  }),
  argTypes: { talk: { control: 'object' } },
  parameters: { docs: { description: { component: DESCRIPTION } } },
} satisfies Meta<typeof Talk>

export default meta
type Story = StoryObj<typeof meta>

export const Card: Story = {
  args: { talk: talks[0]! },
  parameters: { docs: { description: { story: 'A talk, with its description cut short.' } } },
}

export const Expanded: Story = {
  args: { talk: talks[0]!, expanded: true },
  parameters: {
    docs: { description: { story: 'The whole description showing, as in the CMS preview.' } },
  },
}
