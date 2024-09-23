<template>
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
        @click="menuItemClickHandler({ fullPath: rs.path, meta: rs.meta })"
      >
        <el-icon v-if="rs.meta.icon"><component :is="rs.meta.icon" /></el-icon>
        <span>{{ rs.name }}</span>
      </el-menu-item>
      <template v-else="rs.children">
        <el-sub-menu :index="rs.path">
          <template #title>
            <el-icon v-if="rs.meta.icon"><component :is="rs.meta.icon" /></el-icon>
            <span>{{ rs.name }}</span>
          </template>
          <!-- <template #title>{{ rs.name }}</template> -->
          <el-menu-item
            v-for="r in rs.children"
            :index="rs.path + '/' + r.path"
            @click="menuItemClickHandler({ fullPath: rs.path + '/' + r.path, meta: r.meta })"
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
  <!-- <el-menu
    :collapse="store.collapse"
    default-active="2"
    class="el-menu-vertical-demo"
    @open="handleOpen"
    @close="handleClose"
  >
    <el-sub-menu index="1">
      <template #title>
        <el-icon><location /></el-icon>
        <span>Navigator One</span>
      </template>
      <el-menu-item-group title="Group One">
        <el-menu-item index="1-1">item one</el-menu-item>
        <el-menu-item index="1-2">item two</el-menu-item>
      </el-menu-item-group>
      <el-menu-item-group title="Group Two">
        <el-menu-item index="1-3">item three</el-menu-item>
      </el-menu-item-group>
      <el-sub-menu index="1-4">
        <template #title>item four</template>
        <el-menu-item index="1-4-1">item one</el-menu-item>
      </el-sub-menu>
    </el-sub-menu>
    <el-menu-item index="2">
      <el-icon><icon-menu /></el-icon>
      <span>Navigator Two</span>
    </el-menu-item>
    <el-menu-item index="3" disabled>
      <el-icon><document /></el-icon>
      <span>Navigator Three</span>
    </el-menu-item>
    <el-menu-item index="4">
      <el-icon><setting /></el-icon>
      <span>Navigator Four</span>
    </el-menu-item>
  </el-menu> -->
</template>

<script lang="ts" setup>
import { Document, Menu as IconMenu, Location, Setting } from '@element-plus/icons-vue'
import { ref } from 'vue'
import { useOtherStore } from '@/stores/other'
import { MenuItemRegistered } from 'element-plus'
import { ActiveRoute } from '@/typings/common'
const otherStore = useOtherStore()

const handleOpen = (key: string, keyPath: string[]) => {
  // console.log(key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
  // console.log(key, keyPath)
}
const menuItemClickHandler = (activeRoute: ActiveRoute) => {
  //先setActiveRoute
  //因为MainContent组件内watch->activePath,需要捕获更新后拿到 meta 数据
  otherStore.setActiveRoute(activeRoute)
  otherStore.setActivePath(activeRoute.fullPath)
}
</script>

<style>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
}
</style>
