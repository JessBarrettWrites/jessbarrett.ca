import { SITE_URL } from '@/constants.ts'

export default [
  {
    path: '/',
    name: 'home',
    component: () => import('@/routes/Home.vue'),
  },
  {
    path: '/books',
    name: 'books',
    component: () => import('@/routes/Books.vue'),
  },
  {
    path: '/journalism',
    name: 'journalism',
    component: () => import('@/routes/Journalism.vue'),
  },
  {
    path: '/talks',
    name: 'talks',
    component: () => import('@/routes/Talks.vue'),
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('@/routes/About.vue'),
  },
]

export const nav = [
  { to: '/', label: 'Home' },
  { to: '/books', label: 'Books' },
  { to: '/journalism', label: 'Journalism' },
  { to: '/talks', label: 'Talks' },
  { to: '/about', label: 'About' },
]

export function pageUrl(path: string): string {
  return `${SITE_URL}${path}`
}
