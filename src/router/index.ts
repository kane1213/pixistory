import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    meta: {
      title: 'home page',
      keepAlive: true
    },
    component: () => import('../views/Home/index.vue')
  },
  {
    path: '/home',
    redirect: { name: 'Home' }
  },
  {
    path: '/about',
    name: 'About',
    meta: {
      title: 'about page',
      keepAlive: true
    },
    component: () => import('../views/About/index.vue')
  },
  {
    path: '/story/:id',
    name: 'Story',
    meta: {
      title: 'story page',
      keepAlive: true
    },
    component: () => import('../views/Story/index.vue')
  },
  {
    path: '/roulette',
    name: 'Roulette',
    meta: {
      title: 'roulette page',
      keepAlive: true
    },
    component: () => import('../views/Roulette/index.vue')
  },
  {
    path: '/cardItems',
    name: 'CardItems',
    meta: {
      title: 'card items page',
      keepAlive: true
    },
    component: () => import('../views/Cards/index.vue'),
  },
  {
    path: '/item',
    name: 'CardItem',
    component: () => import('../views/Cards/item.vue'),
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
