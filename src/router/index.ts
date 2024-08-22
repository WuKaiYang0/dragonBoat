import { createRouter, createWebHistory } from 'vue-router'
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    {
      name: 'register',
      path: '/register',
      component: () => import('@view/Register.vue')
    },
    {
      name: 'login',
      path: '/login',
      component: () => import('@view/Login.vue')
    },
    {
      name: 'home',
      path: '/home',
      component: () => import('@view/Home.vue')
    }
  ]
})

export default router
