import type { Meta, StoryObj } from '@storybook/vue3-vite'

import AmDash from '@/components/AmDash.vue'

const DESCRIPTION = `A dash between words. In the site's own fonts (Times New Human and Areal) it's
the [am dash](https://www.theamdash.com/): "am-" drawn as one character, with screen readers still
hearing a dash. In any other font, an em dash.`

const meta = {
  title: 'Components/AmDash',
  component: AmDash,
  parameters: { docs: { description: { component: DESCRIPTION } } },
} satisfies Meta<typeof AmDash>

export default meta
type Story = StoryObj<typeof meta>

export const Serif: Story = {
  render: () => ({
    components: { AmDash },
    template: '<p class="p-6 font-serif text-3xl">Jessica Barrett <AmDash /> Author</p>',
  }),
  parameters: { docs: { description: { story: 'In Times New Human: an am dash.' } } },
}

export const Sans: Story = {
  render: () => ({
    components: { AmDash },
    template: '<p class="p-6 font-sans text-3xl">Jessica Barrett <AmDash /> Author</p>',
  }),
  parameters: { docs: { description: { story: 'In Areal: an am dash.' } } },
}

export const OtherFont: Story = {
  render: () => ({
    components: { AmDash },
    template:
      '<p class="p-6 text-3xl" style="font-family: system-ui">Jessica Barrett <AmDash /> Author</p>',
  }),
  parameters: { docs: { description: { story: 'In another font: an em dash.' } } },
}
