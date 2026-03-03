# Content Guide

The `/content` folder contains most of the content for the final website.  Files use **TOML frontmatter** (delimited by `+++`) with optional Markdown bodies.

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
| `featuredUntil` | string (ISO date)     | no       | Feature the book on the homepage until this date |
| `preorder`      | string (ISO date)     | no       | Date preorders open                  |
| `available`     | string (ISO date)     | no       | Date the book is available           |
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
featuredUntil = "2027-03-03"
title = "No Place Like Home"
subtitle = "The Missing Key to Our Housing Crisis"
synopsis = "An honest and urgent look at our housing crisis."
imageSrc = "/images/no-place-like-home.jpg"
imageAlt = "No Place Like Home Book Cover"
url = "https://www.penguinrandomhouse.ca/books/no-place-like-home"
preorder = "2025-10-01"
available = "2026-03-03"

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

### Talks Page (`talks.md`)

A single file for the Talks page introduction.

#### Talks Page Frontmatter

| Field      | Type   | Required | Description    |
| ---------- | ------ | -------- | -------------- |
| `title`    | string | yes      | Page title     |
| `subtitle` | string | no       | Page subtitle  |

**Body:** Markdown intro text for the talks page.

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

A single TOML file (no Markdown body) containing an array of articles.

#### Article

| Field         | Type   | Required | Description                          |
| ------------- | ------ | -------- | ------------------------------------ |
| `title`       | string | yes      | Article title                        |
| `publication` | string | yes      | Publication name                     |
| `date`        | string | yes      | Publication date (e.g. "January 2026") |
| `url`         | string | yes      | Link to the article                  |
| `description` | string | no       | Short description                    |

**Example:**

```toml
[[article]]
title = "Canada's Housing Supply Is In Crisis. Can Robots Help?"
publication = "Betakit"
date = "January 2026"
url = "https://betakit.com/example"

[[article]]
title = "Is Calgary's Transit Keeping The City From Moving Forward?"
publication = "Avenue Magazine"
date = "March 2023"
url = "https://www.avenuecalgary.com/example"
```

## Images

Place images in `public/images/`. They are served at `/images/` (e.g. `public/images/cover.jpg` becomes `/images/cover.jpg`).
