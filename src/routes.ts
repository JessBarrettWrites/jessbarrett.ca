import Books from '@/routes/Books.vue'
import About from '@/routes/About.vue'
import Portfolio from '@/routes/Portfolio.vue'

export default [
  {
    path: '/',
    name: 'books',
    component: Books,
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
  { to: '/', label: 'Books' },
  // TODO: Add content // { to: '/portfolio', label: 'Portfolio' },
  { to: '/about', label: 'About' },
]
