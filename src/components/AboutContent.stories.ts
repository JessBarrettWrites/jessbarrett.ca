import type { Meta, StoryObj } from '@storybook/vue3-vite'

import { fields } from '../../.storybook/fields'
import { imagesIn } from '../../.storybook/images'
import { viewports } from '../../.storybook/viewports'

import AboutContent from '@/components/AboutContent.vue'
import { useAboutPage } from '@/content'

const DESCRIPTION = `The About page's content (\`content/<language>/about.md\`): the portrait beside
the title, subtitle and biography, and the pull quote below them, when there is one.`

const meta = {
  title: 'Components/AboutContent',
  component: AboutContent,
  parameters: { layout: 'fullscreen', docs: { description: { component: DESCRIPTION } } },
  decorators: [viewports],
} satisfies Meta<typeof AboutContent>

export default meta
type Story = StoryObj<typeof meta>

export const About: Story = {
  ...fields('about', useAboutPage(), {
    controls: { imageSrc: { control: 'select', options: imagesIn() } },
  }),
  parameters: { docs: { description: { story: 'The About page.' } } },
}

export const WithoutPullQuote: Story = {
  ...fields('about', { ...useAboutPage(), pullQuote: undefined }),
  parameters: { docs: { description: { story: 'No pull quote.' } } },
}
