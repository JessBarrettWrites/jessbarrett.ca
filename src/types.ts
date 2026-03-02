export interface BookTestimonialToml {
  quote: string
  name: string
  role?: string
}

export interface BookMetaToml {
  featuredUntil?: string
  title: string
  subtitle?: string
  imageSrc: string
  imageAlt: string
  href: string
  preorder?: string
  available?: string
  testimonial?: BookTestimonialToml[]
}

export interface BookMeta {
  featuredUntil?: Date
  title: string
  subtitle?: string
  imageSrc: string
  imageAlt: string
  href: string
  preorder?: Date
  available?: Date
}

export interface Book {
  slug: string
  meta: BookMeta
  testimonials: BookTestimonialToml[]
  body: string
}

export interface Testimonial {
  book: string
  quote: string
  name: string
  role?: string
}

export interface JournalismToml {
  article: JournalismArticle[]
}

export interface JournalismArticle {
  title: string
  publication: string
  date: string
  href: string
  description?: string
}

export interface AboutMeta {
  title: string
  subtitle?: string
  imageSrc: string
  imageAlt: string
  pullQuote?: string
}

export interface About {
  meta: AboutMeta
  body: string
}
