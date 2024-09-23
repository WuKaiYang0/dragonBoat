import { Route } from '@/typings/common'
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
        path: '/Workspace0',
        name: 'Workspace0',
        meta: {
          title: 'Workspace0',
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
export default router
