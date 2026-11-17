import type { Meta, StoryObj } from '@storybook/vue3-vite'

import { navbarCard } from '../../.storybook/navbar-card'

import SocialMedia from '@/nav/SocialMedia.vue'

const DESCRIPTION = `The email and Instagram links in the site header (and at the foot of its menu on
phones). The address and the profile come from \`content/contact.toml\`, shared by every language.`

const meta = {
  title: 'Nav/SocialMedia',
  component: SocialMedia,
  decorators: [navbarCard()],
  parameters: { docs: { description: { component: DESCRIPTION } } },
} satisfies Meta<typeof SocialMedia>

export default meta
type Story = StoryObj<typeof meta>

export const Links: Story = {}
