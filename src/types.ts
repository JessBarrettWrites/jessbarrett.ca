export interface BookTestimonial {
  quote: string
  name: string
  role?: string
}

export interface BookAccolade {
  text: string
  url: string
}

export interface BookToml {
  featuredUntil?: string
  title: string
  subtitle?: string
  synopsis?: string
  imageSrc?: string
  imageAlt?: string
  url: string
  preorder?: string
  available?: string
  testimonial?: BookTestimonial[]
  accolade?: BookAccolade[]
}

export interface Book {
  slug: string
  featuredUntil?: Date
  title: string
  subtitle?: string
  synopsis?: string
  imageSrc?: string
  imageAlt?: string
  url: string
  preorder?: Date
  available?: Date
  accolades?: BookAccolade[]
  testimonials: BookTestimonial[]
  body: string
}

export interface Testimonial extends BookTestimonial {
  book: string
}

export interface JournalismToml {
  article: JournalismArticleToml[]
}

export interface JournalismArticleToml {
  title: string
  publication: string
  date: string
  url: string
  description?: string
}

export interface JournalismArticle {
  title: string
  publication: string
  date: Date
  url: string
  description?: string
}

export interface AboutPageToml {
  title: string
  subtitle?: string
  imageSrc: string
  imageAlt: string
  pullQuote?: string
}

export interface AboutPage extends AboutPageToml {
  body: string
}

export interface TalksPageToml {
  title: string
  subtitle?: string
}

export interface TalksPage extends TalksPageToml {
  body: string
}

export interface TalkToml {
  title: string
}

export interface Talk extends TalkToml {
  slug: string
  body: string
}
