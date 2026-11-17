import type { Meta, StoryObj } from '@storybook/vue3-vite'

import { viewports } from '../../.storybook/viewports'

import MediaContent from '@/components/MediaContent.vue'
import { useMediaPage } from '@/content'

const DESCRIPTION = `The Media page's content: its title and description, then every podcast,
interview or other appearance, newest first (\`content/<language>/media.toml\`). With no
appearances, it says they're coming soon.`

const meta = {
  title: 'Components/MediaContent',
  component: MediaContent,
  parameters: { layout: 'fullscreen', docs: { description: { component: DESCRIPTION } } },
  decorators: [viewports],
} satisfies Meta<typeof MediaContent>

export default meta
type Story = StoryObj<typeof meta>

export const AllAppearances: Story = {
  args: { page: useMediaPage() },
  parameters: { docs: { description: { story: 'Every appearance.' } } },
}

export const ComingSoon: Story = {
  args: { page: { ...useMediaPage(), appearances: [] } },
  parameters: { docs: { description: { story: 'No appearances yet.' } } },
}
