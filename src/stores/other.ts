import { defineStore } from 'pinia'
import { menu } from '@router/index'
import { useRouter, type RouteLocationMatched, type RouteRecordNormalized } from 'vue-router'

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
          return state.redirectRoute.meta?.title as string
        } else {
          return item.meta.title as string
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
