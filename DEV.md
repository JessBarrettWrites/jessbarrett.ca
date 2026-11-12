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
* `pnpm update` to update dependencies

## Content

All content is in Markdown and TOML files in the `content` folder (see [docs/content.md](docs/content.md)).  It is loaded at build time, so that the final build output is just static content.

Content can also be edited in the browser with Sveltia CMS at `/admin/`. See [docs/editing.md](docs/editing.md).
