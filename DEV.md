# README (DEV)

## Helpful commands:

* `pnpm run test-watch`: Continually run tests as changes are made
* `pnpm run type-watch`: Continually run type checks while changes are made
* `pnpm run lint`: Run all lint checks
* `pnpm run format`: Run all automatic code formatting
* `pnpm run dev`: Run dev server (and rebuild the CMS previews on change)
* `pnpm run build`: Build static page output
* `pnpm run build-admin`: Build the CMS previews only (`public/admin/preview`)
* `pnpm run preview`: Run server to server whatever was built with `pnpm run build`
* `pnpm run storybook`: Run Storybook at http://localhost:6006 to view and try out components on their own
* `pnpm run build-storybook`: Build a static Storybook (`storybook-static/`)
* `pnpm update` to update dependencies

## Content

All content is in Markdown and TOML files in the `content` folder (see [docs/content.md](docs/content.md)).  It is loaded at build time, so that the final build output is just static content.

Content can also be edited in the browser with Sveltia CMS at `/admin/`. See [docs/editing.md](docs/editing.md).

The build also writes `llms.txt` (a map of the site for language models, https://llmstxt.org) from
each page's title and description, beside the sitemap. Pages set those with `usePageHead`
(`src/head.ts`).

## Storybook

Each component in `src/components/` (and each page in `src/routes/`) has a `<Name>.stories.ts` beside
it, describing it in a few states. Storybook's toolbar switches the theme (`lofi` / `black`) and the
language, and its panels show the component's props (Controls), accessibility checks
(Accessibility) and the steps of any `play` function (Interactions), which clicks through the
component and checks the result.

Storybook's viewport menu is turned off. Instead, page stories use the `viewports` decorator from
`.storybook/viewports.ts`, so each story shows the page in a frame per screen size (Small mobile to
Desktop), side by side and scaled to fit the pane. A story can show some sizes only, e.g.
`parameters: { frames: ['desktop'] }`.

`fields()` (`.storybook/fields.ts`) gives an object prop (a book, an article) a control per value
instead of one JSON box. Image controls choose from `public/images/` (`imagesIn()` in
`.storybook/images.ts`). Header controls sit on a header-like card (`navbarCard()` in
`.storybook/navbar-card.ts`).
