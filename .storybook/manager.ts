import { addons } from 'storybook/manager-api'
import { create } from 'storybook/theming'

// Storybook's own interface, in the site's colours (src/main.css). Storybook follows the system's
// light or dark setting as it opens, so the accent does too.
const dark = window.matchMedia('(prefers-color-scheme: dark)').matches

addons.setConfig({
  theme: create({
    base: dark ? 'dark' : 'light',
    brandTitle: 'Jessica Barrett',
    brandUrl: './',
    brandTarget: '_self',
    // The header's orange on dark, its teal on light, for the selected story and active controls
    colorSecondary: dark ? 'rgb(243, 151, 68)' : 'rgb(28, 124, 146)',
  }),
})
