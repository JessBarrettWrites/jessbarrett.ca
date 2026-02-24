import Home from '@/routes/Home.vue'
import About from '@/routes/About.vue'
import Portfolio from '@/routes/Portfolio.vue'

export default [
  {
    path: '/',
    name: 'home',
    component: Home,
  },
  {
    path: '/portfolio',
    name: 'portfolio',
    component: Portfolio,
  },
  {
    path: '/about',
    name: 'about',
    component: About,
  },
]

export const nav = [
  { to: '/', label: 'Home' },
  // { to: '/portfolio', label: 'Portfolio' },
  { to: '/about', label: 'About' },
]
