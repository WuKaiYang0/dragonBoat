import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { menu } from '@router/index'
import { ActiveRoute, Meta, Route } from '@/typings/common'

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
export const useOtherStore = defineStore('other', () => {
  const isCollapse = ref(false)
  const menus = ref(menu)
  const route = ref(activeRouteUtil(menu[0].routes))
  const path = ref(route.value.fullPath)
  const setActiveRoute = (r: ActiveRoute) => (route.value = r)
  const setActivePath = (p: string) => (path.value = p)
  const changeCollapse = () => (isCollapse.value = !isCollapse.value)
  const collapse = computed(() => isCollapse.value)
  const activeRoute = computed(() => route.value)
  const activePath = computed(() => path.value)
  return { changeCollapse, collapse, activeRoute, menus, setActiveRoute, activePath, setActivePath }
})
