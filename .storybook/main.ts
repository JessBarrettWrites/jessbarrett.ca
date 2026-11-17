import { readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import type { StorybookConfig } from '@storybook/vue3-vite'
import type { PluginOption } from 'vite'

// Plugins from vite.config.ts that only make sense for the built site: the service worker would
// cache Storybook itself, and image optimisation and the Vue devtools overlay just slow it down
const SITE_ONLY_PLUGINS = ['vite-plugin-pwa', 'vite-plugin-image-optimizer', 'vite-plugin-vue-']

function isSiteOnly(plugin: PluginOption): boolean {
  return (
    !!plugin &&
    typeof plugin === 'object' &&
    'name' in plugin &&
    SITE_ONLY_PLUGINS.some((name) => plugin.name.startsWith(name))
  )
}

const PUBLIC = fileURLToPath(new URL('../public', import.meta.url))

/** Site paths of every image (public/images/...), e.g. `/images/jessica-barrett.jpg` */
function siteImages(): string[] {
  return readdirSync(`${PUBLIC}/images`, { recursive: true, encoding: 'utf8' })
    .filter((path) => /\.(jpe?g|png|webp|gif|svg)$/i.test(path))
    .map((path) => `/images/${path.split('\\').join('/')}`)
    .sort()
}

// DEV NOTE: Stories can't read public/ (Vite won't import from it), so the images are listed here,
//           as `virtual:site-images` (see .storybook/images.ts). The list is read when Storybook
//           starts: restart it to pick up new images.
const IMAGES_MODULE = 'virtual:site-images'

function imagesModule(): PluginOption {
  return {
    name: 'site-images',
    resolveId: (id) => (id === IMAGES_MODULE ? `\0${IMAGES_MODULE}` : undefined),
    load: (id) =>
      id === `\0${IMAGES_MODULE}` ? `export default ${JSON.stringify(siteImages())}` : undefined,
  }
}

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.ts'],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y', '@storybook/addon-themes'],
  framework: {
    name: '@storybook/vue3-vite',
    // Props tables from the components' TypeScript types. tsconfig.json only has references, so
    // point at the one that covers src/
    options: { docgen: { plugin: 'vue-component-meta', tsconfig: 'tsconfig.app.json' } },
  },
  // DEV NOTE: Viewport stories (.storybook/viewports.ts) show every size at once instead
  features: {
    viewport: false,
    // No "Get started" checklist in the sidebar or the menu
    sidebarOnboardingChecklist: false,
    menuOnboardingChecklist: false,
  },
  // Fonts (/fonts), images and favicon.ico
  staticDirs: ['../public'],
  viteFinal(config) {
    config.plugins = (config.plugins ?? []).flat(Infinity as 1).filter((p) => !isSiteOnly(p))
    config.plugins.push(imagesModule())
    return config
  },
}

export default config
