<template>
  <!-- <div> -->
  <el-menu
    :default-active="otherStore.activePath"
    class="el-menu-vertical-demo"
    :collapse="otherStore.collapse"
    @open="handleOpen"
    @close="handleClose"
    v-for="wrapper in otherStore.menus"
  >
    <template v-for="rs in wrapper.routes">
      <el-menu-item
        v-if="!rs.children"
        :index="rs.path"
        @click="menuItemClickHandler({ fullPath: rs.path, meta: rs.meta }, rs.name)"
      >
        <el-icon v-if="rs.meta.icon"><component :is="rs.meta.icon" /></el-icon>
        <span>{{ rs.meta.title }}</span>
      </el-menu-item>
      <template v-else="rs.children">
        <el-sub-menu :index="rs.path">
          <template #title>
            <el-icon v-if="rs.meta.icon"><component :is="rs.meta.icon" /></el-icon>
            <span>{{ rs.meta.title }}</span>
          </template>
          <!-- <template #title>{{ rs.name }}</template> -->
          <el-menu-item
            v-for="r in rs.children"
            :index="rs.path + '/' + r.path"
            @click="
              menuItemClickHandler({ fullPath: rs.path + '/' + r.path, meta: r.meta }, r.name)
            "
          >
            <template #title>
              <el-icon v-if="r.meta.icon"><component :is="r.meta.icon" /></el-icon>
              <span>{{ r.name }}</span>
            </template>
          </el-menu-item>
        </el-sub-menu>
      </template>
    </template>
  </el-menu>
  <!-- </div> -->
</template>

<script lang="ts" setup>
import { useOtherStore } from '@/stores/other'
import { ActiveRoute } from '@/typings/common'
import { locateRoute } from '@/utils/common'
import { onMounted, onUnmounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
const router = useRouter()
const route = useRoute()
const otherStore = useOtherStore()

const handleOpen = (key: string, keyPath: string[]) => {
  // console.log(key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
  // console.log(key, keyPath)
}
const menuItemClickHandler = (activeRoute: ActiveRoute, name: string) => {
  router.push({ path: activeRoute.fullPath })
  //先setActiveRoute
  //因为MainContent组件内watch->activePath,需要捕获更新后拿到 meta 数据
  otherStore.setActiveRoute(activeRoute)
  otherStore.setActivePath(activeRoute.fullPath)
}
const setSideBarAuto = () => {
  if (document.documentElement.offsetWidth <= 1160) {
    if (!otherStore.collapse) {
      otherStore.setCollapse(true)
    }
  }
}
watch(
  () => route.fullPath,
  (fullPath) => {
    const routes = otherStore.menus[0].routes
    const _pathNameArr = fullPath.replace('/', '').split('/')
    const { _currentRoute } = locateRoute(routes, _pathNameArr)
    otherStore.setActiveRoute({ fullPath, meta: _currentRoute.meta })
    otherStore.setActivePath(fullPath)
  }
)
onMounted(() => {
  window.addEventListener('resize', setSideBarAuto)
})
onUnmounted(() => {
  window.removeEventListener('resize', setSideBarAuto)
})
</script>

<style scoped>
:deep(.el-menu-vertical-demo:not(.el-menu--collapse)) {
  flex-basis: 200px;
  height: 100%;
}
</style>
