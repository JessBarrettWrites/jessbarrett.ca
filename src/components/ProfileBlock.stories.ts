import type { Meta, StoryObj } from '@storybook/vue3-vite'

import ProfileBlock from '@/components/ProfileBlock.vue'

const DESCRIPTION = `Two columns: an image (the \`image\` slot) beside text (the default slot), the
image above the text on phones. \`reverse\` puts the image on the right. Books and the About page
are laid out with it.`

const meta = {
  title: 'Components/ProfileBlock',
  component: ProfileBlock,
  render: (args) => ({
    components: { ProfileBlock },
    setup: () => ({ args }),
    template: `
      <ProfileBlock v-bind="args">
        <template #image>
          <img src="/images/jessica-barrett.jpg" alt="Jessica Barrett" width="300" height="450" />
        </template>
        <h2 class="font-serif text-4xl font-bold">A heading</h2>
        <p class="leading-relaxed opacity-75">The text beside the image.</p>
      </ProfileBlock>`,
  }),
  parameters: { docs: { description: { component: DESCRIPTION } } },
} satisfies Meta<typeof ProfileBlock>

export default meta
type Story = StoryObj<typeof meta>

export const ImageLeft: Story = {
  parameters: { docs: { description: { story: 'The image on the left.' } } },
}

export const ImageRight: Story = {
  args: { reverse: true },
  parameters: { docs: { description: { story: 'Reversed: the image on the right.' } } },
}
