import { ViteSSG } from 'vite-ssg'

import './fonts.css'
import './main.css'

import App from './App.vue'
import routes from './routes'
import { nextPage } from './transition'

export const createApp = ViteSSG(
  // the root component
  App,
  // vue-router options
  { routes },
  // vite-ssg client setup
  ({ router }) => {
    if (import.meta.env.SSR) return

    // Register the service worker ourselves (instead of the injected registerSW.js) so that, with
    // registerType 'autoUpdate', the page reloads as soon as a newly deployed worker takes control.
    // Otherwise the old worker keeps serving the previous precached HTML until a forced reload.
    import('virtual:pwa-register').then(({ registerSW }) => registerSW({ immediate: true }))

    // If a dynamically imported chunk fails to load (e.g. stale service worker
    // serving old hashed filenames after a deploy), unregister the worker and reload.
    router.onError((error) => {
      if (
        error.message.includes('Failed to fetch dynamically imported module') ||
        error.message.includes('Loading chunk')
      ) {
        navigator.serviceWorker?.getRegistrations().then((registrations) => {
          registrations.forEach((reg) => reg.unregister())
        })
        window.location.reload()
      }
    })

    // DEV NOTE: The page scrolls inside #main (src/components/Nav.vue), not the window, so this
    //           stands in for the router's scrollBehavior. Once the old page has faded out (App.vue).
    router.afterEach(async (to, from) => {
      await nextPage(to, from)
      const main = document.querySelector('#main')
      if (!main) return
      if (to.hash) {
        const target = main.querySelector(to.hash)
        target?.scrollIntoView({ behavior: 'smooth' })
      } else {
        main.scrollTop = 0
      }
    })
  },
)
