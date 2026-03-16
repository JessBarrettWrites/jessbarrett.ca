import { SITE_URL } from '@/constants.ts'

// Generic handler that will reload the page if the routing fails for some reason
function loadRoute(
  loader: () => Promise<{ default: ReturnType<(typeof import('vue'))['defineComponent']> }>,
) {
  return () =>
    loader().catch(() => {
      window.location.reload()
    })
}

export default [
  {
    path: '/',
    name: 'home',
    component: loadRoute(() => import('@/routes/Home.vue')),
  },
  {
    path: '/books',
    name: 'books',
    component: loadRoute(() => import('@/routes/Books.vue')),
  },
  {
    path: '/journalism',
    name: 'journalism',
    component: loadRoute(() => import('@/routes/Journalism.vue')),
  },
  {
    path: '/talks',
    name: 'talks',
    component: loadRoute(() => import('@/routes/Talks.vue')),
  },
  {
    path: '/about',
    name: 'about',
    component: loadRoute(() => import('@/routes/About.vue')),
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
