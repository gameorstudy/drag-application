import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/problem-solving',
    name: 'match',
    component: () => import('@/views/BoardMatch.vue')
  },
  {
    path: '/problem-solving/confirm',
    name: 'confirm',
    component: () => import('@/views/Confirm.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
