import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import store from '../store/index'

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
  },
  {
    path: '/add',
    name: 'CardAdd',
    component: () => import('../views/Cards/add.vue'),
  },
  {
    path: '/categoryItems',
    name: 'Categories',
    component: () => import('../views/Categories/index.vue')
  },
  ,
  {
    path: '/categoryItem',
    name: 'CategoryItem',
    component: () => import('../views/Categories/item.vue'),
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  if (to.name !== 'CategoryItem' && !!store.state.editingItem) store.commit('setEditingItem')
  next()
})

export default router
