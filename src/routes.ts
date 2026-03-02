import Home from '@/routes/Home.vue'
import Books from '@/routes/Books.vue'
import Journalism from '@/routes/Journalism.vue'
import About from '@/routes/About.vue'
import Portfolio from '@/routes/Portfolio.vue'

export default [
  {
    path: '/',
    name: 'home',
    component: Home,
  },
  {
    path: '/books',
    name: 'books',
    component: Books,
  },
  {
    path: '/journalism',
    name: 'journalism',
    component: Journalism,
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
  { to: '/books', label: 'Books' },
  { to: '/journalism', label: 'Journalism' },
  { to: '/about', label: 'About' },
]