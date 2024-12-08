import { useOtherStore } from '@/stores/other'
import { useUserStore } from '@/stores/user'
import type { Route } from '@/typings/common'
import { locateRoute } from '@/utils/common'
import { watch } from 'vue'
import { createRouter, createWebHistory, useRoute } from 'vue-router'
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      meta: {},
      component: () => import('@view/Home.vue'),
      redirect: '/home',
      children: [
        {
          name: 'Home',
          path: '/home',
          meta: { title: '首页', icon: 'Location' },
          // component: () => import('@view/Home.vue')
          component: () => import('@components/CompTemplate.vue')
        },
        {
          name: 'TeamManagement',
          path: 'teamManagement',
          meta: { title: '队伍管理', icon: 'Location' },
          component: () => import('@/view/TeamManagement/index.vue')
        }
      ]
    },
    {
      name: 'Register',
      path: '/register',
      component: () => import('@view/Register.vue')
    },
    {
      name: 'Login',
      path: '/login',
      component: () => import('@view/Login.vue')
    },
    {
      name: '404',
      path: '/404',
      component: () => import('@view/404.vue')
    },
    {
      path: '/:pathMatch(.*)*',
      component: () => import('@view/404.vue')
    }
  ]
})
export const menu: [{ routes: Route[] }] = [
  {
    routes: [
      {
        path: '/home',
        name: 'Home',
        meta: {
          title: '首页',
          icon: 'Location'
        }
      },
      {
        path: '/teamManagement',
        name: 'TeamManagement',
        meta: {
          title: '队伍管理',
          icon: 'Location'
        }
      },
      {
        path: '/Workspace1',
        name: 'Workspace1',
        meta: {
          title: 'Workspace1',
          icon: 'Bicycle'
        },
        children: [
          {
            path: 'item one',
            name: 'item one',
            meta: {
              icon: 'Setting',
              title: 'item one'
            }
          },
          {
            path: 'item two',
            name: 'item two',
            meta: {
              title: 'item two',
              icon: 'Aim'
            }
          },
          {
            path: 'item three',
            name: 'item three',
            meta: {
              title: 'item three',
              icon: 'Brush'
            }
          }
        ]
      },
      {
        path: '/Workspace2',
        name: 'Workspace2',
        meta: {
          title: 'Workspace2',
          icon: 'Watermelon'
        }
      },
      {
        path: '/Workspace3',
        name: 'Workspace3',
        meta: {
          title: 'Workspace3',
          icon: 'Basketball'
        }
      },
      {
        path: '/Workspace4',
        name: 'Workspace4',
        meta: {
          title: 'Workspace4',
          icon: 'CaretLeft'
        }
      }
    ]
  }
]
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  if (to.name === 'Login' && userStore.getUserInfo.id) {
    next({ name: from.name })
  } else {
    next()
  }
})
export default router
