import Home from '@/components/Home.vue'
import About from '@/components/About.vue'
import Portfolio from '@/components/Portfolio.vue'

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
