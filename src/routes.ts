import Home from '@/routes/Home.vue'
import Books from '@/routes/Books.vue'
import Journalism from '@/routes/Journalism.vue'
import About from '@/routes/About.vue'
import Talks from '@/routes/Talks.vue'

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
    path: '/talks',
    name: 'talks',
    component: Talks,
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
  { to: '/talks', label: 'Talks' },
  { to: '/about', label: 'About' },
]
