# Keep `@unhead/vue` on vite-ssg's major version

`@unhead/vue` in `package.json` must be on the **same major version that `vite-ssg` depends on**.
Currently that's `vite-ssg@28` with `@unhead/vue@^2`.

## Why

The app calls `useHead()` (from `@unhead/vue`) to set each page's `<title>`, meta description,
Open Graph tags, canonical and hreflang links, `<html lang>`, and JSON-LD. At build time, `vite-ssg`
creates the head instance and renders it into the static HTML using **its own** `@unhead/vue`
dependency.

If the app's `@unhead/vue` is a different major version (e.g. v3 while vite-ssg uses v2), pnpm
installs two copies. The app's `useHead()` calls go to a head instance from one copy, and vite-ssg
renders the other copy's instance. That instance is empty, so every page ships with only the
defaults from `index.html`:

- the title is always `Jessica Barrett — Author`
- there's no description, og/twitter tags, canonical, hreflang or JSON-LD
- `<html lang>` isn't set

**There is no build error or warning.** The site looks normal in the browser. Only the SEO tags
in the generated HTML are missing. This happened in v1.8.9, after `@unhead/vue` was updated to
v3, and was fixed by returning to `^2.1.17`.

## How to check after updating dependencies

```bash
pnpm why @unhead/vue                      # should list exactly one version
pnpm build
grep -o '<title>[^<]*' dist/en/books.html # should be "Books — Jessica Barrett"
grep -o '<html[^>]*>' dist/fr/books.html  # should include lang="fr-CA"
```

## When it's safe to move to a newer major

Once `vite-ssg` itself depends on that version: check `node_modules/vite-ssg/package.json` (or
`pnpm why @unhead/vue`) after updating `vite-ssg`, then update `@unhead/vue` to match and run the
checks above.
