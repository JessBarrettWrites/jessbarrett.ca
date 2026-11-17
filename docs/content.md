# Content Guide

The `/content` folder contains most of the content for the final website, with one folder per
language: `content/en/` (English, the default), `content/fr/` (French) and `content/es/` (Spanish).
`content/contact.toml` is shared by every language.  Files use **TOML frontmatter** (delimited by `+++`) with optional Markdown bodies.

Dates are native TOML dates, written without quotes (`available = 2026-03-03`). This is the format the
CMS (`/admin/`, see [editing.md](editing.md)) writes. Quoted date strings still parse.

## Languages

Pages are served per language: `/en/books`, `/fr/books`, `/es/books`, and so on. The unprefixed paths (`/`,
`/books`, ...) send visitors to the language they last read, or else their browser's language.

A translation only needs the fields it translates. Any field or file missing from `content/fr/` or
`content/es/`, or left empty there, comes from `content/en/`. For example, `content/fr/about.md` has
no `title` or `imageSrc`, so it uses the English ones. Links, dates, images and lists are only kept in English.

Root-relative links in Markdown, such as `[the book](/books#no-place-like-home)`, point to the
page in the reader's language.

The paths below are relative to a language folder (e.g. `content/en/books/*.md`).

## Content Types

### Books (`books/*.md`)

Each `.md` file in `books/` represents a book.

#### Book Frontmatter

| Field           | Type                  | Required | Description                          |
| --------------- |-----------------------| -------- | ------------------------------------ |
| `title`         | string                | yes      | Book title                           |
| `subtitle`      | string                | no       | Book subtitle                        |
| `synopsis`      | string                | no       | Short description for metadata/SEO   |
| `imageSrc`      | string                | yes      | Path to cover image (e.g. `/images/cover.jpg`) |
| `imageAlt`      | string                | yes      | Alt text for the cover image         |
| `url`           | string                | yes      | Link to purchase or info page        |
| `featuredUntil` | TOML date             | no       | Feature the book on the homepage until this date |
| `preorder`      | TOML date             | no       | Date preorders open                  |
| `available`     | TOML date             | no       | Date the book is available           |
| `accolade`      | list of `Accolade`    | no       | Notable mentions or awards           |
| `testimonial`   | list of `Testimonial` | no       | Endorsement quotes                   |

##### Accolade

| Field  | Type   | Required | Description              |
| ------ | ------ | -------- | ------------------------ |
| `text` | string | yes      | Description of the award or mention |
| `url`  | string | yes      | Link to the source       |

##### Testimonial

| Field  | Type   | Required | Description                        |
| ------ | ------ | -------- | ---------------------------------- |
| `quote`| string | yes      | The endorsement quote text         |
| `name` | string | yes      | Name of the person quoted          |
| `role` | string | no       | Title or description of the person |

**Body:** Markdown content displayed as the book description.

**Example:**

```markdown
+++
featuredUntil = 2027-03-03
title = "No Place Like Home"
subtitle = "The Missing Key to Our Housing Crisis"
synopsis = "An honest and urgent look at our housing crisis."
imageSrc = "/images/no-place-like-home.jpg"
imageAlt = "No Place Like Home Book Cover"
url = "https://www.penguinrandomhouse.ca/books/no-place-like-home"
preorder = 2025-10-01
available = 2026-03-03

[[accolade]]
text = "Audible Most Anticipated Audiobooks of 2026"
url = "https://www.audible.ca/example"

[[testimonial]]
quote = "A thoughtful examination of housing in Canada."
name = "Jane Doe"
role = "Author of Example Book"
+++

A longer description of the book goes here. This supports **Markdown**.
```

---

### About Page (`about.md`)

A single file for the About page.

#### About Frontmatter

| Field       | Type   | Required | Description                     |
| ----------- | ------ | -------- | ------------------------------- |
| `title`     | string | yes      | Page title                      |
| `subtitle`  | string | no       | Page subtitle                   |
| `imageSrc`  | string | yes      | Path to author portrait         |
| `imageAlt`  | string | yes      | Alt text for the portrait       |
| `pullQuote` | string | no       | Featured quote displayed on the page |

**Body:** Markdown biography text.

**Example:**

```markdown
+++
title = "Jessica Barrett"
subtitle = "Author, Writer, and Award-Winning Journalist"
imageSrc = "/images/jessica-barrett.jpg"
imageAlt = "Author portrait"
pullQuote = "We cannot solve our housing crisis until we first address our crisis of home."
+++

Jessica Barrett is an award-winning journalist and author...
```

---

### Talks Page (`talks.toml`)

A single TOML file (no Markdown body) for the Talks page introduction.

#### Talks Page Fields

| Field         | Type   | Required | Description                         |
| ------------- | ------ | -------- | ----------------------------------- |
| `title`       | string | yes      | Page title                          |
| `subtitle`    | string | no       | Page subtitle                       |
| `description` | string | no       | Markdown intro text below the title |

**Example:**

```toml
title = "Talks"
subtitle = "Public speaking on housing, home, and community"
description = "Jessica is available for public speaking engagements..."
```

---

### Individual Talks (`talks/*.md`)

Each `.md` file in `talks/` represents a talk.

#### Talk Frontmatter

| Field   | Type   | Required | Description |
| ------- | ------ | -------- | ----------- |
| `title` | string | yes      | Talk title  |

**Body:** Markdown description of the talk.

**Example:**

```markdown
+++
title = "Housing Vs. Home"
+++

After living in Vancouver for her entire adult life, Jessica Barrett packed up
and moved across the country...
```

---

### Journalism (`journalism.toml`)

A single TOML file (no Markdown body) containing a page description and an array of articles.

| Field         | Type               | Required | Description                     |
| ------------- | ------------------ | -------- | ------------------------------- |
| `description` | string             | no       | Shown under the page title      |
| `article`     | list of `Article`  | yes      | Articles, in any order (sorted newest first on the page) |

#### Article

| Field         | Type   | Required | Description                          |
| ------------- | ------ | -------- | ------------------------------------ |
| `title`       | string | yes      | Article title                        |
| `publication` | string | yes      | Publication name                     |
| `date`        | TOML date | yes   | Publication date (e.g. `2026-01-26`, unquoted) |
| `url`         | string | yes      | Link to the article                  |
| `description` | string | no       | Short description                    |

**Example:**

```toml
description = "Selected reporting and essays"

[[article]]
title = "Canada's Housing Supply Is In Crisis. Can Robots Help?"
publication = "Betakit"
date = 2026-01-26
url = "https://betakit.com/example"

[[article]]
title = "Is Calgary's Transit Keeping The City From Moving Forward?"
publication = "Avenue Magazine"
date = 2023-03-02
url = "https://www.avenuecalgary.com/example"
```

### Media (`media.toml`)

A single TOML file (no Markdown body) containing a page description and an array of podcast,
interview and other appearances. Same shape as `journalism.toml`.

| Field         | Type                 | Required | Description                     |
| ------------- | -------------------- | -------- | ------------------------------- |
| `description` | string               | no       | Shown under the page title      |
| `appearance`  | list of `Appearance` | yes      | Appearances, in any order (sorted newest first on the page) |

#### Appearance

| Field         | Type      | Required | Description                                  |
| ------------- | --------- | -------- | -------------------------------------------- |
| `title`       | string    | yes      | Episode or segment title                     |
| `outlet`      | string    | yes      | Show, podcast or outlet name                 |
| `date`        | TOML date | yes      | Air or publication date (e.g. `2026-11-15`, unquoted) |
| `url`         | string    | yes      | Link to the episode                          |
| `description` | string    | no       | Short description                            |

**Example:**

```toml
description = "Podcasts, interviews and other appearances"

[[appearance]]
title = "Why More Housing Isn't the Same as Home"
outlet = "The Strong Towns Podcast"
date = 2026-11-15
url = "https://podcast.strongtowns.org/e/why-more-housing-isnt-the-same-as-home/"
```

## Images

Place images in `public/images/`. They are served at `/images/` (e.g. `public/images/cover.jpg` becomes `/images/cover.jpg`).

---

### User Interface Text (`ui.toml`)

Edited in the CMS under **General → User Interface (UI)**.

The text around the content: navigation labels, buttons ("Get the Book", "Read more"), and page
titles and descriptions used for search engines. `{author}` is replaced with the author's name. The
journalism `description` also takes `{summary}`, which is the description from `journalism.toml`,
or `defaultSummary` when there isn't one; the media `description` does the same with `media.toml`.

Each language's `ui.toml` must have the same keys as `content/en/ui.toml` (a test checks this). A
missing or empty translated text uses the English one.

---

## Adding a language

1. Add its code to `LOCALES` (plus `LOCALE_TAGS` and `LOCALE_NAMES`) in `src/locale.ts`, and to
   `i18n.locales` in `public/admin/config.yml`.
2. Create `content/<code>/ui.toml` with every key from `content/en/ui.toml`.
3. Add translated content files as they're ready; anything missing shows in English.

Routes, the language menu, hreflang links and the sitemap pick up the new language automatically.
`pnpm test` checks the new files against the CMS config.
