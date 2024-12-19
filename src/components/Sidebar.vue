<template>
  <el-menu
    v-for="(wrapper, index) in otherStore.$state.menus"
    :key="index"
    :default-active="useRoute().fullPath"
    class="el-menu-vertical-demo"
    :collapse="otherStore.collapse"
    @open="handleOpen"
    @close="handleClose"
  >
    <template v-for="rs in wrapper.routes">
      <el-menu-item
        v-if="!rs.children"
        :key="rs.name"
        :index="rs.path"
        @click="menuItemClickHandler({ fullPath: rs.path, meta: rs.meta, name: rs.name })"
      >
        <el-icon v-if="rs.meta.icon"><component :is="rs.meta.icon" /></el-icon>
        <span>{{ rs.meta.title }}</span>
      </el-menu-item>
      <template v-else>
        <el-sub-menu :key="rs.name" :index="rs.path">
          <template #title>
            <el-icon v-if="rs.meta.icon"><component :is="rs.meta.icon" /></el-icon>
            <span>{{ rs.meta.title }}</span>
          </template>
          <!-- <template #title>{{ rs.name }}</template> -->
          <el-menu-item
            v-for="r in rs.children"
            :key="r.name"
            :index="rs.path + '/' + r.path"
            @click="
              menuItemClickHandler({ fullPath: rs.path + '/' + r.path, meta: r.meta, name: r.name })
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
</template>

<script lang="ts" setup>
import { useOtherStore } from '@/stores/other'
import type { ActiveRoute } from '@/typings/common'
import { onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
const router = useRouter()
const otherStore = useOtherStore()

const handleOpen = () => {
  // console.log(key, keyPath)
}
const handleClose = () => {
  // console.log(key, keyPath)
}
const menuItemClickHandler = (activeRoute: ActiveRoute) => {
  router.push({ path: activeRoute.fullPath })
}
const setSideBarAuto = () => {
  if (document.documentElement.offsetWidth <= 1160) {
    if (!otherStore.collapse) {
      otherStore.setCollapse(true)
    }
  }
}
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
