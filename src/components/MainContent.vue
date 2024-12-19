<template>
  <div class="content">
    <Sidebar></Sidebar>
    <main style="overflow: hidden">
      <div class="content-wrapper">
        <div class="tags">
          <el-icon v-if="!otherStore.collapse" icon @click="otherStore.toggleCollapse()"
            ><Fold
          /></el-icon>
          <el-icon v-else icon @click="otherStore.toggleCollapse()"><Expand /></el-icon>
          <el-divider direction="vertical" />
          <el-tag
            v-for="(tag, index) in dynamicTags"
            :key="tag.name"
            :closable="index === 0 ? false : true"
            effect="plain"
            class="default"
            :class="{ active: tag.active }"
            @close="handleClose(tag, index)"
            @click="handleClick(tag)"
          >
            <ElIcon>
              <component :is="tag.meta.icon"></component>
            </ElIcon>
            <span>{{ tag.meta.title }}</span>
          </el-tag>
        </div>
        <router-view v-slot="{ Component }">
          <component
            :is="Component"
            ref="comp"
            :class="{ fadeOut: fadeOutToggle, fadeIn: fadeInToggle, off: offToggle }"
          />
        </router-view>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import Sidebar from './Sidebar.vue'
import { useOtherStore } from '@/stores/other'
import { type ComponentPublicInstance, onMounted, ref, watch } from 'vue'
import type { TagSetting } from '@/typings/common'
import router from '@/router'
import { useRoute, type NavigationGuardNext } from 'vue-router'
import NProgress from 'nprogress'
const otherStore = useOtherStore()
const rootRoute = router.getRoutes().find((item) => item.path === '/')
const redirectRoute = router.getRoutes().find((item) => item.path === rootRoute.redirect)

const rootTag: TagSetting = {
  active: true,
  fullPath: redirectRoute.path,
  meta: redirectRoute.meta,
  name: redirectRoute.name
}
const dynamicTags = ref<TagSetting[]>([rootTag])
const handleClick = (tag: TagSetting) => {
  dynamicTags.value.forEach((item) => (item.active = false))
  tag.active = true
  router.push(tag.fullPath)
}
const comp = ref<ComponentPublicInstance>()
const fadeOutToggle = ref(false)
const fadeInToggle = ref(false)
const offToggle = ref(false)
let _next: null | NavigationGuardNext = null
let _el: HTMLElement | null = null
const _fadeOutFunc = () => {
  _el?.removeEventListener('animationend', _fadeOutFunc)
  if (fadeOutToggle.value) {
    fadeOutToggle.value = false
    offToggle.value = true
    NProgress.done()
    if (_next) {
      _next()
    }
    _next = null
    _el = null
  }
}
let leavingComp = null
router.beforeEach((to, from, next) => {
  leavingComp = null
  leavingComp = comp.value
  _el = leavingComp?.$el
  _next = next
  if (_el && !fadeOutToggle.value) {
    NProgress.configure({ showSpinner: false })
    NProgress.start()
    fadeOutToggle.value = true
    offToggle.value = false
    _el?.addEventListener('animationend', _fadeOutFunc)
  } else {
    next()
  }
})
router.afterEach(() => {
  if (!leavingComp) {
    leavingComp = comp.value
  }
  const comingComp = comp.value
  let el: HTMLElement | null = comingComp?.$el
  fadeInToggle.value = true
  offToggle.value = false
  const _fadeInFunc = () => {
    fadeInToggle.value = false
    el.removeEventListener('animationend', _fadeInFunc)
    el = null
  }
  el.addEventListener('animationend', _fadeInFunc)
})
watch(
  useRoute(),
  (currnetRoute) => {
    const r = currnetRoute
    otherStore.$state.matchedRoutes = r.matched
    const newTag: TagSetting = {
      active: false,
      fullPath: r.fullPath,
      meta: r.meta,
      name: r.name
    }
    //看是否存在，存在就取
    const currentTag = dynamicTags.value.find((t) => t.fullPath === newTag.fullPath)
    if (!currentTag) {
      //说明不存在
      dynamicTags.value.push(newTag)
      handleClick(newTag)
    } else {
      //存在
      handleClick(currentTag)
    }
  },
  { immediate: true }
)
const handleClose = (tag: TagSetting, index: number) => {
  //第一个是首页，不能被del
  if (index > 0) {
    //查找当前Tag在dynamicTags的索引值
    const currentTagIndex = dynamicTags.value.findIndex((tag) => tag.active === true)
    console.log(currentTagIndex)
    //del Tag
    dynamicTags.value.splice(dynamicTags.value.indexOf(tag), 1)
    if (currentTagIndex >= index) {
      handleClick(dynamicTags.value[currentTagIndex - 1])
    }
    //若前面条件不满足，只删除了没有选择的标签...
  }
}
onMounted(() => {
  otherStore.setRedirectRoute()
})
</script>

<style>
@keyframes opacity_fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
@keyframes opacity_fadeOut {
  100% {
    opacity: 0;
  }
}
@keyframes translateX_fadeIn {
  0% {
    transform: translateX(-60px);
  }
  100% {
    transform: translateX(0px);
  }
}
@keyframes translateX_fadeOut {
  100% {
    transform: translateX(60px);
  }
}
.off {
  display: none;
}
.fadeIn {
  animation:
    opacity_fadeIn 0.2s ease-out forwards,
    translateX_fadeIn 0.25s ease-out forwards;
}
.fadeOut {
  animation:
    opacity_fadeOut 0.25s ease-out forwards,
    translateX_fadeOut 0.2s ease-out forwards;
}
</style>

<style scoped>
.content {
  display: flex;
  flex: 1;
  /* height: calc(100% - var(--main-head-height)); */

  main {
    background-color: #f0f2f5;
    width: 100%;
    padding: 15px;
    .content-wrapper {
      height: 100%;
      display: flex;
      flex-direction: column;
      gap: 20px;
      /* background-color: var(--main-background-color); */
      .tags {
        height: var(--main-tags-height);
        background-color: var(--main-background-color);
        display: flex;
        align-items: center;
        padding-left: 5px;
        .default {
          box-sizing: border-box;
          height: calc(100% - 3px);
          color: #4060c7;
          margin-right: 10px;
          border: 1px solid #4060c7;
          --el-color-primary: #4060c7;
        }
        .active {
          color: #ffffff !important;
          background-color: #4060c7 !important;
          --el-color-primary: #4060c7 !important;
        }
      }
    }
  }
}
</style>
