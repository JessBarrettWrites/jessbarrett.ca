export interface BookTestimonial {
  quote: string
  name: string
  role?: string
}

export interface BookAccolade {
  text: string
  url: string
}

export interface BookMetaToml {
  featuredUntil?: string
  title: string
  subtitle?: string
  synopsis?: string
  imageSrc: string
  imageAlt: string
  url: string
  preorder?: string
  available?: string
  testimonial?: BookTestimonial[]
  accolade?: BookAccolade[]
}

export interface BookMeta {
  featuredUntil?: Date
  title: string
  subtitle?: string
  synopsis?: string
  imageSrc: string
  imageAlt: string
  url: string
  preorder?: Date
  available?: Date
  accolades?: BookAccolade[]
}

export interface Book {
  slug: string
  meta: BookMeta
  testimonials: BookTestimonial[]
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
  url: string
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

export interface TalksPageMeta {
  title: string
  subtitle?: string
}

export interface TalksPage {
  meta: TalksPageMeta
  body: string
}

export interface TalkMeta {
  title: string
}

export interface Talk {
  slug: string
  meta: TalkMeta
  body: string
}
