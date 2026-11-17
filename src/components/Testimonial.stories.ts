import type { Meta, StoryObj } from '@storybook/vue3-vite'

import { fields } from '../../.storybook/fields'

import Testimonial from '@/components/Testimonial.vue'
import { useBooks, useTestimonials } from '@/content'

const [testimonial] = useTestimonials()
const book = useBooks().find((b) => b.slug === testimonial?.book)

const DESCRIPTION = `A quote about a book, on the home page: the quote, who said it, their role, and
the book it's about (a link to it on the Books page). Testimonials are a book's, in
\`content/<language>/books/\`; only the role is translated.`

const meta = {
  title: 'Components/Testimonial',
  component: Testimonial,
  decorators: [() => ({ template: '<div class="max-w-md p-6"><story /></div>' })],
  parameters: { docs: { description: { component: DESCRIPTION } } },
} satisfies Meta<typeof Testimonial>

export default meta
type Story = StoryObj<typeof meta>

const testimonialFields = fields('testimonial', testimonial!)

export const OnTheHomePage: Story = {
  ...testimonialFields,
  args: {
    ...testimonialFields.args,
    onTitle: book?.title,
    onTitleUrl: `/books#${testimonial?.book}`,
  },
  parameters: { docs: { description: { story: 'A testimonial and the book it is about.' } } },
}

export const WithoutRole: Story = {
  ...fields('testimonial', { ...testimonial!, role: undefined }),
  parameters: { docs: { description: { story: 'Who said it, without a role or a book.' } } },
}
