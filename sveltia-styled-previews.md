# Plan: Styled Sveltia Previews

> **Status: implemented (2026-11-12)** in `src/admin/` and `vite.admin.config.ts`. Findings that
> differ from the plan below:
> - Sveltia exposes its bundled React as `CMS.React`, and templates may be plain function components.
>   So the bridge (`src/admin/bridge.ts`) uses `useRef`/`useLayoutEffect` from it rather than
>   `createClass`. The spike (step 0) was settled by reading the Sveltia source.
> - The site's SFC `<style>` blocks are all empty, so the only preview CSS is `main.css` + `fonts.css`,
>   emitted as `public/admin/preview/previews.css`.
> - Template names follow the CMS names: `books-list`, `talks-detail`, `talks-list`,
>   `journalism-detail`, `about`. `contact` has its preview disabled.
> - Checked with a harness that renders each template into a blob-URL iframe the same way Sveltia does,
>   including a simulated edit. Not yet checked inside a live Sveltia session.

Follows [`sveltia-integration.md`](sveltia-integration.md). The goal is for the CMS preview pane to look like
the real site, rendered by **the same Vue components** so the preview can never drift from production.

## How Sveltia previews work

From [preview templates](https://sveltiacms.app/en/docs/api/preview-templates) and
[preview styles](https://sveltiacms.app/en/docs/api/preview-styles):

- `CMS.registerPreviewTemplate(name, component)`. `name` is the collection name (`books`, `talks`) or the
  file name for file collections (`about`, `talks-page`, `journalism`). The component is a **React-style**
  component (`createClass`, `h()`, or HTM).
- Props: `entry` (Immutable Map: `data`, `slug`, `path`, …), `widgetFor(key)`, `widgetsFor(name)`,
  `getAsset(path)`, `getCollection(name, slug?)`, and the preview iframe's `document`/`window`.
- `CMS.registerPreviewStyle(url)` or `CMS.registerPreviewStyle(css, { raw: true })` injects CSS into the
  sandboxed preview **iframe**. Admin-page styles never reach it.
- Caveat from the docs: "may not be fully compatible with existing preview templates… does not include any
  undocumented component props."

## Approach: mount Vue inside the React template

Each preview template is a thin React wrapper. It renders one empty `<div>`, mounts a small Vue app into it
(inside the iframe), and pushes fresh props into that app whenever `entry` changes.

```ts
// sketch: src/admin/bridge.ts
export function vuePreview(component: Component, toProps: (p: PreviewProps) => object) {
  return createClass({
    componentDidMount() {
      this.state$ = shallowRef(toProps(this.props))
      this.app = createApp({ render: () => h(component, this.state$.value) })
      this.app.use(previewRouter()).use(createHead())
      this.app.mount(this.el)
    },
    componentDidUpdate() { this.state$.value = toProps(this.props) },
    componentWillUnmount() { this.app.unmount() },
    render() { return reactH('div', { ref: (el) => (this.el = el) }) },
  })
}
```

Rejected alternative: hand-write HTM templates that copy each component's markup. It's quicker to start, but
every component change has to be made twice, and that's exactly the drift we want to avoid. We'll only fall
back to it if the spike (step 0) fails.

## Steps

### 0. Spike (time-box: ~2 hours)

Before refactoring anything, prove the bridge works with `Talk.vue` (the simplest component):

- Does Sveltia's `createClass` support lifecycle methods (`componentDidMount`/`DidUpdate`/`WillUnmount`) and
  callback `ref`s? If refs don't work, find the node with `this.props.document.querySelector` on a unique id
  instead.
- Does a Vue app mount correctly into a node owned by the iframe's document while running in the parent
  window's JS context? Check reactivity on every keystroke, and that `onMounted` measuring works. `Book.vue`
  measures image/body height, so that needs testing.
- Are `createClass` and `h` exposed as globals (as in the docs' examples)? The API overview page wasn't
  checked during planning.

If any of these fail, switch to the HTM fallback and stop here to re-plan.

### 1. Separate presentation from data loading

Several routes read bundled content directly (`useAboutPage()`, `useTalksPage()`, `useTalks()`, …), so they
can't render CMS entry data. Split them:

| Today | Extract | Props |
| --- | --- | --- |
| `routes/About.vue` | `components/AboutContent.vue` | `about: AboutPage` |
| `routes/Talks.vue` | `components/TalksContent.vue` | `page: TalksPage`, `talks: Talk[]` |
| `routes/Journalism.vue` | `components/JournalismContent.vue` | `articles: JournalismArticle[]` |
| `routes/Books.vue` | already uses `Book.vue` per item | `book: Book` |

The routes keep `useHead`, `useRoute` and the `use*()` calls, and render the new content components. Their
existing tests should pass unchanged. Add a small render test for each new component.

### 2. Share the TOML → model transforms

`src/content.ts` currently mixes "read the raw files" with "turn TOML into models". Pull the transforms out
into pure functions that both the site and the previews use:

```ts
export function toBook(slug: string, toml: BookToml, body: string): Book
export function toTalk(slug: string, toml: TalkToml, body: string): Talk
export function toJournalismArticle(toml: JournalismArticleToml): JournalismArticle
// about/talks pages are already just { ...frontmatter, body }
```

`useBooks()` etc. become `Object.entries(raw).map(... toBook(...))`. In the CMS, `entry.get('data').toJS()`
gives plain values (dates as `YYYY-MM-DD` strings), which `parseDate` already handles.

### 3. Build the previews bundle

The previews must **not** pollute the Sveltia UI. Tailwind preflight plus the SFC `<style>` blocks (Book,
ProfileBlock, PageHeader, Talk, Testimonial, About, Talks, Journalism, …) would restyle the admin app if
they were injected into the admin document. Vite's dev server injects SFC CSS into `document.head`, so we
**build** the previews as a library even during development, and hand the CSS to the iframe only:

- `src/admin/previews.ts` is the entry point. It imports `fonts.css` + `main.css` and registers all templates.
- `vite.admin.config.ts` uses library mode (`build.lib`, `formats: ['es']`) with
  `outDir: 'public/admin/preview'` and `emptyOutDir: true`. Output: `previews.js` + `previews.css` with
  stable names (`fileName`, `cssFileName`). Reuse the `@` alias, `vue()` and `tailwindcss()` plugins.
  Vue is bundled in, since the admin page has no Vue.
- `.gitignore`: add `public/admin/preview/`.
- `package.json` scripts:
  - `"build-admin": "vite build --config vite.admin.config.ts"`
  - `build`: run `build-admin` **before** `build-only`, so vite-ssg copies it out of `public/`
  - `"dev": "run-p dev:*"` with `dev:site` = `vite` and `dev:admin` = `vite build --config vite.admin.config.ts --watch`
- `public/admin/index.html`: after the Sveltia script, add
  `<script type="module" src="/admin/preview/previews.js"></script>`.
- In `previews.ts`: `CMS.registerPreviewStyle('/admin/preview/previews.css')`.
- Tailwind v4 content detection: make sure the admin build scans `src/**/*.vue` (it should, since the root
  is the project). Check for missing utility classes in the preview, and add `@source` if needed.
- Fonts: `fonts.css` uses absolute `/fonts/...` URLs, which resolve against the admin origin inside the
  iframe. Nothing extra is needed.
- `type-check`/lint: add `src/admin/**` to the app tsconfig. Declare `window.CMS` / `createClass` / `h`
  globals in `env.d.ts`.

### 4. Preview environment

Components assume things the iframe doesn't give them:

- **Router:** `Book.vue`, `Testimonial.vue` and others use `RouterLink`. Install a
  `createRouter({ history: createMemoryHistory(), routes })` built from the real `src/routes.ts`. Block
  navigation (`router.beforeEach(() => false)`) so clicks don't change the preview.
- **Head:** install `createHead()` in case a component calls `useHead`. It does nothing inside the preview.
- **Theme:** set `data-theme="lofi"` on the iframe `<html>` via `props.document`. Optional: a light/dark
  toggle so Jess can check the `black` theme as well.
- **Layout:** wrap each preview in the same page container and padding as `App.vue` (minus NavBar and
  Footer), so widths and line lengths match the real page.
- **Images:** `imageSrc` for a freshly uploaded, uncommitted image isn't served yet. Map it with
  `getAsset(imageSrc)?.toString()` (blob URL) before passing it to the component, and fall back to the raw
  path.
- **`Book.vue` clamp:** in the preview, show the body expanded, or re-run `measure()` on update. Otherwise
  editing the description leaves a stale clamp height. Add an `expanded`/`preview` prop if needed.
- **Featured/status logic:** `Book.vue` compares dates with `new Date()`. That's fine, but it means a
  future `preorder` date shows no status text, which is correct behaviour.

### 5. Register templates

| CMS name | Component | Data |
| --- | --- | --- |
| `books` | `Book.vue` | `toBook(slug, data, data.body)` |
| `talks` | `Talk.vue` | `toTalk(slug, data, data.body)` |
| `about` | `AboutContent.vue` | `{ ...data, body }` |
| `talks-page` | `TalksContent.vue` | `page` from entry, `talks` from `getCollection('talks')` (async: render once it resolves) |
| `journalism` | `JournalismContent.vue` | `data.article.map(toJournalismArticle)` sorted like the route |
| `contact` | none | Set `editor: { preview: false }` on this file in `config.yml` (two strings, a preview adds nothing) |

Optional extra: a book preview could also render its testimonials with `Testimonial.vue`, the way they appear
on the home page.

### 6. Verification

- [ ] Admin UI looks unchanged: no Tailwind/DaisyUI bleed into Sveltia's chrome.
- [ ] Each collection/file preview matches the live page side by side, including fonts, colours and widths.
- [ ] Typing in any field updates the preview immediately, with no remounting flicker or lost scroll.
- [ ] A newly uploaded image appears in the preview before it's saved.
- [ ] Links in the preview don't navigate.
- [ ] `pnpm build` in a clean checkout produces `dist/admin/preview/previews.{js,css}`, and production
      `/admin/` loads them.
- [ ] `pnpm dev` rebuilds previews when a component changes (refresh the admin page to pick it up).
- [ ] Tests, type-check and lint pass, and the existing route tests pass unchanged after the refactor.

## Risks

- **Sveltia's React-compat surface is undocumented in places.** The spike covers this, and HTM templates are
  the fallback.
- **Sveltia upgrades may change preview internals.** Pin the version (already done) and re-run the preview
  checks whenever we bump it.
- **Bundle size:** the previews bundle includes Vue, marked and the components (~100–150 KB gzipped). It only
  loads on `/admin/` and is ignored by the service worker, so the public site is unaffected.
