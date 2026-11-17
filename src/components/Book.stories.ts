import type { Meta, StoryObj } from '@storybook/vue3-vite'

import AmDashMarkdown from '@/components/AmDashMarkdown.vue'
import Book from '@/components/Book.vue'
import { useBooks } from '@/content'

const [book] = useBooks()

const DESCRIPTION = `A book, as on the home page (the featured book) and the Books page (every book):
its cover beside its title, subtitle and accolades, whether it's out yet, a button to get it, its
synopsis and its description.

A long description is cut short with a "Read more" button that opens the rest. "Featured Book"
shows above the title until the book's *Featured Until* date. The book's text comes from
\`content/<language>/books/\`.`

const meta = {
  title: 'Components/Book',
  component: Book,
  argTypes: { book: { control: 'object' } },
  // The description goes in the default slot, as on the Books page (src/routes/Books.vue)
  render: (args) => ({
    components: { Book, AmDashMarkdown },
    setup: () => ({ args }),
    template: `
      <Book v-bind="args">
        <AmDashMarkdown class="[&_p]:leading-relaxed [&_p]:opacity-75 [&_p+p]:mt-4">{{ args.book.body }}</AmDashMarkdown>
      </Book>`,
  }),
  parameters: { docs: { description: { component: DESCRIPTION } } },
} satisfies Meta<typeof Book>

export default meta
type Story = StoryObj<typeof meta>

export const OnTheBooksPage: Story = {
  args: { book: book! },
  parameters: {
    docs: { description: { story: 'The latest book, with its description cut short.' } },
  },
}

export const Reversed: Story = {
  args: { book: book!, reverse: true },
  parameters: {
    docs: {
      description: { story: 'The cover on the right, as every other book is on the Books page.' },
    },
  },
}

export const Expanded: Story = {
  args: { book: book!, expanded: true },
  parameters: {
    docs: { description: { story: 'The whole description showing, as in the CMS preview.' } },
  },
}

export const Featured: Story = {
  args: {
    book: { ...book!, featuredUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) },
    titleLink: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Featured, as on the home page: "Featured Book" above a title linking to the Books page.',
      },
    },
  },
}

export const WithoutCover: Story = {
  args: { book: { ...book!, imageSrc: undefined, imageAlt: undefined } },
  parameters: {
    docs: { description: { story: 'A book without a cover yet: the text alone.' } },
  },
}
