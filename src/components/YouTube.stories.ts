import type { Meta, StoryObj } from '@storybook/vue3-vite'

import YouTube from '@/components/YouTube.vue'
import { MESSAGES } from '@/messages'

const DESCRIPTION = `A YouTube video at 16:9, up to \`maxWidth\` pixels wide: the book trailer on the
home page, which only shows it while the visitor is online.`

const meta = {
  title: 'Components/YouTube',
  component: YouTube,
  parameters: { docs: { description: { component: DESCRIPTION } } },
} satisfies Meta<typeof YouTube>

export default meta
type Story = StoryObj<typeof meta>

export const Trailer: Story = {
  args: { videoId: 'jPS8kGTKric', title: MESSAGES.en.home.trailerTitle, maxWidth: 640 },
  parameters: { docs: { description: { story: 'The book trailer.' } } },
}
