import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { menu } from '@router/index'
import type { ActiveRoute, Meta, Route } from '@/typings/common'
import { useRouter, type RouteLocationMatched, type RouteRecordNormalized } from 'vue-router'

const activeRouteUtil = (routes: Route[]) => {
  let lastPath: Array<string> = []
  let route = routes[0]
  return (function active(r?: Route) {
    const activeRoute = r || route
    const path = activeRoute.path
    lastPath.push(path)
    if (activeRoute.children) {
      return active(activeRoute.children[0])
    } else {
      return { fullPath: lastPath.join('/'), meta: activeRoute.meta } as ActiveRoute
    }
  })()
}
export const useOtherStore = defineStore('other', {
  state: () => ({
    isCollapse: false,
    menus: menu,
    redirectRoute: {} as RouteRecordNormalized,
    matchedRoutes: [] as RouteLocationMatched[]
  }),
  getters: {
    collapse(state) {
      return state.isCollapse
    },
    getMatchedRoutesTitle(state) {
      const matchedRoutes = state.matchedRoutes.map((item) => {
        if (item.path === '/') {
          return state.redirectRoute.meta?.title
        } else {
          return item.meta.title
        }
      })
      return [...new Set(matchedRoutes)]
    }
  },
  actions: {
    setCollapse(bool: boolean) {
      this.$state.isCollapse = bool
    },
    toggleCollapse() {
      this.$state.isCollapse = !this.$state.isCollapse
    },
    setRedirectRoute() {
      if (!this.$state.redirectRoute.path) {
        const router = useRouter()
        const rootRoute = router.getRoutes().find((item) => item.path === '/')
        this.$state.redirectRoute = router
          .getRoutes()
          .find((item) => item.path === rootRoute.redirect)
      }
    }
  }
})
