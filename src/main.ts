import { createPinia } from 'pinia'
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
  // function to have custom setups
  // ({ app }) => {
  // },
)
