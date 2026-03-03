import { ViteSSG } from 'vite-ssg'

import './fonts.css'
import './main.css'

import App from './App.vue'
import routes from './routes'

export const createApp = ViteSSG(
  // the root component
  App,
  // vue-router options
  { routes },
  // vite-ssg client setup
  ({ router }) => {
    if (import.meta.env.SSR) return
    router.afterEach((to) => {
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
