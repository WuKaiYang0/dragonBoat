<template>
  <div class="content">
    <Sidebar></Sidebar>
    <main style="overflow: auto">
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
          <FadeShiftTransition>
            <component :is="Component" style="overflow: auto" />
          </FadeShiftTransition>
        </router-view>
      </div>
      <div style="display: flex; flex-direction: column; margin-top: var(--main-padding)">
        <ElText type="info" size="small">
          <ElLink
            type="info"
            href="https://github.com/WuKaiYang0/dragonBoat"
            :target="Target._blank"
            style="font-size: inherit"
          >
            GitHub
          </ElLink>
        </ElText>
        <ElText type="info" size="small">Copyright © 2024 SCNU Students</ElText>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import Sidebar from './Sidebar.vue'
import { useOtherStore } from '@/stores/other'
import { onMounted, ref, watch } from 'vue'
import type { TagSetting } from '@/typings/common'
import router from '@/router'
import { useRoute } from 'vue-router'
import FadeShiftTransition from './transition/FadeShiftTransition.vue'
const otherStore = useOtherStore()
const rootRoute = router.getRoutes().find((item) => item.path === '/')
const redirectRoute = router.getRoutes().find((item) => item.path === rootRoute.redirect)
enum Target {
  '_blank' = '_blank',
  '_parent' = '_parent',
  '_self' = '_self',
  '_top' = '_top'
}
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
<style scoped>
.content {
  display: flex;
  flex: 1;
  height: calc(100% - var(--main-head-height));

  main {
    background-color: #f0f2f5;
    width: 100%;
    padding: 10px 15px 15px 15px;
    .content-wrapper {
      height: 100%;
      display: flex;
      flex-direction: column;
      gap: 10px;
      .tags {
        height: var(--main-tags-height);
        background-color: var(--main-background-color);
        display: flex;
        align-items: center;
        padding-left: 5px;
        flex-shrink: 0;
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
