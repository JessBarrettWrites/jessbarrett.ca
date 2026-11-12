/** A date as it appears in TOML: a native TOML date (parsed as a `Date`), or a quoted string. The
 *  CMS writes native dates, and an empty string for a cleared optional date. */
export type TomlDateValue = Date | string

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
  featuredUntil?: TomlDateValue
  title: string
  subtitle?: string
  synopsis?: string
  imageSrc?: string
  imageAlt?: string
  url: string
  preorder?: TomlDateValue
  available?: TomlDateValue
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

export interface Contact {
  email?: string
  instagram?: string
}

export interface Testimonial extends BookTestimonial {
  book: string
}

export interface JournalismToml {
  description?: string
  article: JournalismArticleToml[]
}

export interface JournalismArticleToml {
  title: string
  publication: string
  date: TomlDateValue
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

export interface JournalismPage {
  description?: string
  articles: JournalismArticle[]
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
  description?: string
}

export type TalksPage = TalksPageToml

export interface TalkToml {
  title: string
}

export interface Talk extends TalkToml {
  slug: string
  body: string
}
