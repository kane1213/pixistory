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
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
