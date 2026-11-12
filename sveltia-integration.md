# Plan: Sveltia CMS Integration

> **Status: implemented (2026-11-12).** The plan below is kept for reference. Changes made during
> implementation:
> - CMS names: `books-list` (content/books), `talks-detail` (content/talks), `talks-list`
>   (content/talks.toml), `journalism-detail` (content/journalism.toml), `about`, `contact`.
> - `content/talks.md` became `content/talks.toml`, with the intro text as a `description` entry.
> - `journalism.toml` gained a top-level `description` ("Selected reporting and essays"), which
>   replaces the hard-coded subtitle.
> - `backend.auth_methods: [token]` hides the unused OAuth button. Entries have `preview_path` links
>   to the live pages.
> - The config validates against the JSON schema shipped in `@sveltia/cms@0.265.0`. The "first save
>   normalization" (step 5) and the production sign-in checks (step 8) still need a real CMS
>   session.
> - The current guide is [`docs/editing.md`](docs/editing.md).

Add [Sveltia CMS](https://sveltiacms.app/en/docs) at `/admin/` so content in `content/` can be edited in a
browser. Each save commits to `main`, and the existing Pages workflow tests, builds and deploys it.

Decisions:

- **Auth:** GitHub personal access token ("Sign In with Token"). No OAuth app and no Cloudflare Worker.
- **Dates:** move to Sveltia's native TOML date format (see step 1).
- **Publishing:** every save publishes the site. No editorial workflow or content branch.
- **Styled previews:** a follow-up, planned in [`sveltia-styled-previews.md`](sveltia-styled-previews.md).
  This plan ships with Sveltia's default (unstyled) preview.

---

## 1. Migrate dates to native TOML dates

Sveltia's `datetime` field with `type: date` writes dates in TOML files as **unquoted, native TOML local
dates**, e.g. `available = 2026-03-03`. This happens unless a custom `format` is set, which makes it fall back
to a quoted string.
([docs](https://sveltiacms.app/en/docs/fields/datetime): *"If the output format is TOML, the date-time string
will be represented as a native, unquoted TOML date value"*.) An optional date that is left empty is saved as
`""`.

All of our dates are currently quoted strings (`available = "2026-03-03"`). We'll align with Sveltia rather
than force `format` (forcing it would make the CMS fight its own defaults):

1. **Content:** unquote every date value:
   - `content/books/no-place-like-home.md`: `featuredUntil`, `preorder`, `available`
   - `content/journalism.toml`: every `[[article]]` `date`
2. **Types (`src/types.ts`):** `smol-toml` parses native dates as `TomlDate` (a `Date` subclass). Change the
   raw TOML types to `featuredUntil?: Date | string`, `preorder?: Date | string`, `available?: Date | string`,
   and `JournalismArticleToml.date: Date | string`. Keep `string`, because `""` (cleared field) and any
   not-yet-migrated quoted values are still strings.
3. **`parseDate` (`src/parse.ts`):** accept `Date | string | undefined`.
   - A `TomlDate` holding a *local date* (`isDate()` true, no time) has to become **local midnight** of that
     calendar day, the same result we get from strings today (`T00:00:00` appended). Don't trust
     `getTime()` here: smol-toml may store local dates as UTC midnight, which would show as the previous day
     in Pacific time. Rebuild it from the date text instead, e.g. `parseDate(value.toISOString().slice(0, 10))`
     when `value.isDate()`. Confirm this with a test before relying on it.
   - Plain strings keep the current behaviour. `""` → `undefined`.
4. **Tests (`src/__tests__/parse.spec.ts`, `content.spec.ts`):** add cases for:
   - `parseFront` with an unquoted date, where `parseDate` returns local midnight of that day (check with
     `getFullYear/getMonth/getDate`, not the ISO string)
   - an empty string `""`, which returns `undefined`
   - a mixed file containing both quoted and unquoted dates
5. **Docs (`docs/content.md`):** change the date field types from "string (ISO date)" to "TOML date
   (e.g. `2026-03-03`, unquoted)" and update the examples.

Do this step first, as its own commit. It's a standalone refactor that the tests can check before any CMS code
lands.

## 2. Add the admin page

### `public/admin/index.html`

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="robots" content="noindex" />
    <title>Content Manager · jessbarrett.ca</title>
  </head>
  <body>
    <script src="https://unpkg.com/@sveltia/cms@0.265.0/dist/sveltia-cms.js"></script>
  </body>
</html>
```

Pin an exact version. Sveltia is pre-1.0 (latest is v0.265.0), so its documented `@^1` pin wouldn't resolve
to anything yet. Bump the pin on purpose, alongside the regular `pnpm update` work.

### `public/admin/config.yml`

```yaml
backend:
  name: github
  repo: JessBarrettWrites/jessbarrett.ca
  branch: main
  commit_messages:
    create: 'Create {{collection}} “{{slug}}”'
    update: 'Update {{collection}} “{{slug}}”'
    delete: 'Delete {{collection}} “{{slug}}”'
    uploadMedia: 'Upload “{{path}}”'
    deleteMedia: 'Delete “{{path}}”'

site_url: https://jessbarrett.ca
display_url: https://jessbarrett.ca

media_folder: public/images
public_folder: /images

media_libraries:
  default:
    config:
      max_file_size: 5242880 # 5 MB
      slugify_filename: true

collections:
  - name: books
    label: Books
    label_singular: Book
    folder: content/books
    format: toml-frontmatter
    extension: md
    create: true
    slug: '{{slug}}'
    identifier_field: title
    summary: '{{title}}'
    fields:
      - { name: title, label: Title, widget: string }
      - { name: subtitle, label: Subtitle, widget: string, required: false }
      - { name: synopsis, label: Synopsis, widget: text, required: false,
          hint: 'Short description used for search engines and link previews' }
      - { name: imageSrc, label: Cover Image, widget: image,
          hint: 'Upload at a 2:3 ratio (e.g. 600×900). Displayed at 300×450.' }
      - { name: imageAlt, label: Cover Image Alt Text, widget: string }
      - { name: url, label: Purchase / Info Link, widget: string }
      - { name: featuredUntil, label: Featured Until, widget: datetime, type: date, required: false,
          hint: 'Feature on the home page until this date' }
      - { name: preorder, label: Pre-Order Date, widget: datetime, type: date, required: false }
      - { name: available, label: Available Date, widget: datetime, type: date, required: false }
      - name: accolade
        label: Accolades
        label_singular: Accolade
        widget: list
        required: false
        summary: '{{text}}'
        fields:
          - { name: text, label: Text, widget: string }
          - { name: url, label: Link, widget: string }
      - name: testimonial
        label: Testimonials
        label_singular: Testimonial
        widget: list
        required: false
        summary: '{{name}}'
        fields:
          - { name: quote, label: Quote, widget: text }
          - { name: name, label: Name, widget: string }
          - { name: role, label: Role, widget: string, required: false }
      - { name: body, label: Description, widget: markdown }

  - name: talks
    label: Talks
    label_singular: Talk
    folder: content/talks
    format: toml-frontmatter
    extension: md
    create: true
    slug: '{{slug}}'
    fields:
      - { name: title, label: Title, widget: string }
      - { name: body, label: Description, widget: markdown }

  - name: pages
    label: Pages
    files:
      - name: about
        label: About Page
        file: content/about.md
        format: toml-frontmatter
        fields:
          - { name: title, label: Title, widget: string }
          - { name: subtitle, label: Subtitle, widget: string, required: false }
          - { name: imageSrc, label: Portrait, widget: image,
              hint: 'Upload at a 2:3 ratio (e.g. 600×900). Displayed at 300×450.' }
          - { name: imageAlt, label: Portrait Alt Text, widget: string }
          - { name: pullQuote, label: Pull Quote, widget: text, required: false }
          - { name: body, label: Body, widget: markdown }
      - name: talks-page
        label: Talks Page
        file: content/talks.md
        format: toml-frontmatter
        fields:
          - { name: title, label: Title, widget: string }
          - { name: subtitle, label: Subtitle, widget: string, required: false }
          - { name: body, label: Body, widget: markdown }
      - name: journalism
        label: Journalism
        file: content/journalism.toml
        format: toml
        fields:
          - name: article
            label: Articles
            label_singular: Article
            widget: list
            summary: '{{publication}}: {{title}}'
            fields:
              - { name: title, label: Title, widget: string }
              - { name: publication, label: Publication, widget: string }
              - { name: date, label: Date, widget: datetime, type: date }
              - { name: url, label: Link, widget: string }
              - { name: description, label: Description, widget: text, required: false }
      - name: contact
        label: Contact
        file: content/contact.toml
        format: toml
        fields:
          - { name: email, label: Email, widget: string, required: false }
          - { name: instagram, label: Instagram URL, widget: string, required: false }
```

Notes on the config:

- **Field order matches the current files**, because Sveltia writes keys in config order. That keeps the
  first-save diff small.
- **`journalism.toml`:** a list field named `article` with `fields:` (plural) serializes as `[[article]]`
  array-of-tables. That's the shape we already use. Don't use `root: true`, which doesn't work with TOML.
- **Image format:** we're *not* enabling Sveltia's `transformations` (webp-only) for now. Uploads stay
  jpg/png and `vite-plugin-image-optimizer` already compresses them at build time. If we enable it later,
  add `webp` to the PWA `globPatterns`.
- **Ordering:** `useBooks()`/`useJournalismArticles()` already sort by date. Talks follow glob (filename)
  order, so new talks show up alphabetically by slug. Add an `order` field later if Jess needs to control it.

## 3. Keep the service worker away from `/admin/`

`VitePWA` (Workbox `generateSW`) falls back to `index.html` for navigation requests. For visitors who already
have the worker installed, `/admin/` could be served as the Vue app. In `vite.config.ts`, under `workbox`:

```ts
// Let the CMS load from the network; never serve the SPA shell for it
navigateFallbackDenylist: [/^\/admin/],
globIgnores: ['admin/**'],
```

## 4. Keep `/admin/` out of search

- `public/robots.txt`: add `Disallow: /admin/`.
- `vite-ssg-sitemap`: check whether `dist/admin/index.html` ends up in `sitemap.xml` (it scans built HTML).
  If it does, add `exclude: ['/admin']` (or the equivalent) to the `generateSitemap` call.
- The `noindex` meta tag in `admin/index.html` also covers this.

## 5. One-time "first save" normalization

Sveltia rewrites the whole frontmatter block on save. Before Jess's first edit, open and save each existing
entry once from the CMS ourselves, using the local workflow (step 7). Review the diff and commit it, so her
own edits produce clean diffs. Watch for:

- quoting/escaping changes in long strings (curly quotes, `’`)
- `+++` delimiters (already what we use; `parseFront` accepts them)
- empty optional fields written as `""`. These are handled by `parseDate`, and `?? []` covers lists. Check
  whether `subtitle = ""` renders as an empty element anywhere and guard with `v-if` if it does.

## 6. Onboarding Jess (personal access token)

1. Jess needs a GitHub account with **Write** access to `JessBarrettWrites/jessbarrett.ca`.
2. She goes to `https://jessbarrett.ca/admin/` → **Sign In with Token**. The prompt links to GitHub's token
   page with permissions pre-filled.
3. Fine-grained token settings:
   - Resource owner: `JessBarrettWrites`. Repository access: **only** `jessbarrett.ca`.
   - Permissions: **Contents: Read and write** (Metadata: read is added automatically).
   - Expiration: the longest she's comfortable with. Put a calendar reminder to rotate it.
   - If the org restricts fine-grained tokens, an org owner has to approve it.
4. The token is stored in that browser's local storage. Each new browser or device needs the token pasted
   again. Signing out clears it.

Write a short `docs/editing.md` for Jess covering the steps above, plus "saves go live in ~2–3 minutes" and
"image uploads should be 2:3".

## 7. Local development workflow

No proxy server is needed. Add to `DEV.md`:

- `pnpm dev`, then open `http://localhost:5173/admin/index.html` in **Chrome or Edge** (the File System
  Access API isn't available in Firefox/Safari).
- Click **Work with Local Repository** and pick the project root. Edits write straight to `content/`, and
  Vite hot-reloads the site in another tab.
- Reload the admin page after changing `config.yml`.

## 8. Verification

- [ ] `pnpm test`, `pnpm type-check` and `pnpm lint` pass after step 1, and again after step 2.
- [ ] Local workflow: edit and save a book, a talk, each page file, and a journalism article, and confirm the
      site renders the change.
- [ ] Dates: set and clear `preorder` in the CMS. The file shows `preorder = 2025-10-01` / `preorder = ""`,
      and Book status text is correct in Pacific time.
- [ ] Journalism save keeps `[[article]]` tables (not an inline array).
- [ ] Image upload lands in `public/images/` and renders at `/images/...`.
- [ ] Production: after deploy, a token sign-in works, a save creates a commit on `main`, and the Pages
      workflow redeploys.
- [ ] With the service worker already installed (visit the site first), `/admin/` loads the CMS, not the SPA.
- [ ] `sitemap.xml` doesn't list `/admin`.

## Files touched

| File | Change |
| --- | --- |
| `content/books/*.md`, `content/journalism.toml` | Unquote dates |
| `src/types.ts`, `src/parse.ts`, `src/__tests__/*` | Native TOML date support |
| `docs/content.md` | Date type docs |
| `public/admin/index.html`, `public/admin/config.yml` | New |
| `vite.config.ts` | Workbox denylist/ignores, maybe sitemap exclude |
| `public/robots.txt` | Disallow `/admin/` |
| `DEV.md`, `docs/editing.md` | Local workflow, editor guide |
