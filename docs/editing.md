# Editing the Site (Sveltia CMS)

Site content can be edited in the browser at **https://jessbarrett.ca/admin/**, using
[Sveltia CMS](https://sveltiacms.app/en/docs). Each save is a commit to `main`, which the GitHub Pages
workflow tests, builds and deploys, so **changes go live about 2–3 minutes after saving**.

## Signing in (one-time setup per browser)

1. You need a GitHub account with **Write** access to `JessBarrettWrites/jessbarrett.ca`.
2. Open https://jessbarrett.ca/admin/ and choose **Sign In with Token**. The prompt links to GitHub's
   token page with the permissions pre-filled.
3. Create a **fine-grained** token:
   - Resource owner: `JessBarrettWrites`
   - Repository access: **Only select repositories** → `jessbarrett.ca`
   - Permissions: **Contents: Read and write** (Metadata: read is added automatically)
   - Expiration: pick a date and set a reminder to make a new token before it expires
4. Paste the token into the CMS. It's stored in that browser only. Other browsers and devices need
   the token pasted again, and **Sign Out** forgets it.

## What can be edited

| In the CMS | File(s) | Shown on |
| --- | --- | --- |
| Books | `content/<lang>/books/*.md` | Home (featured), Books |
| Talks | `content/<lang>/talks/*.md` | Talks |
| Pages → About | `content/<lang>/about.md` | About |
| Pages → Talks Page | `content/<lang>/talks.toml` | Talks (title and intro) |
| Pages → Journalism | `content/<lang>/journalism.toml` | Journalism |
| General → User Interface (UI) | `content/<lang>/ui.toml` | Navigation, buttons, page titles |
| Pages → Contact | `content/contact.toml` (shared) | — |

## Languages: English, French and Spanish

Each entry has English, French and Spanish versions; switch between them with the language menu in
the editor. Only text fields can be translated. Links, dates, images and lists are set in English
and shared with the other languages. A translated field left empty shows the English text, so an
entry can be translated a bit at a time. New entries start in English only; turn a language on for
the entry when you're ready to translate it.

The preview pane shows the entry with the site's own components and styles. Talks are listed
alphabetically by their file name, which comes from the title when the talk is created.

## Images

Upload book covers and portraits at a **2:3 ratio** (e.g. 600×900); they're displayed at 300×450.
Uploads go to `public/images/` and are compressed when the site is built.

## For developers

- CMS configuration: `public/admin/config.yml`. Collection and file names (`books-list`,
  `talks-detail`, `talks-list`, `journalism-detail`, `about`) are also the preview template names
  in `src/admin/previews.ts`.
- The Sveltia version is pinned in `public/admin/index.html`. After bumping it, check that the
  previews still render (they rely on `CMS.React` and `registerPreviewTemplate`).
- Previews mount the site's Vue components inside Sveltia's preview iframe (`src/admin/bridge.ts`).
  `pnpm build-admin` builds them into `public/admin/preview/` (gitignored). `pnpm build` and
  `pnpm dev` run it for you.
- Local editing without GitHub: run `pnpm dev`, open http://localhost:5173/admin/index.html in
  **Chrome or Edge**, choose **Work with Local Repository** and pick the project root. Edits are
  written straight to `content/`. Reload the admin page after a preview rebuild or a config change.
