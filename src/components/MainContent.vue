<template>
  <div class="content">
    <Sidebar></Sidebar>
    <main>
      <div class="content-wrapper">
        <div class="tags">
          <el-icon icon v-if="!otherStore.collapse" @click="otherStore.changeCollapse()"
            ><Fold
          /></el-icon>
          <el-icon icon v-else @click="otherStore.changeCollapse()"><Expand /></el-icon>
          <el-divider direction="vertical" />
          <el-tag
            :closable="index === 0 ? false : true"
            effect="plain"
            v-for="(tag, index) in dynamicTags"
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
        <CompTemp get></CompTemp>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import Sidebar from './Sidebar.vue'
import CompTemp from '@components/CompTemplate.vue'

import { useOtherStore } from '@/stores/other'
import { ref, watch } from 'vue'
import { Meta } from '@/typings/common'
const otherStore = useOtherStore()
type TagSetting = { active: boolean; fullPath: string; meta: Meta }
const dynamicTags = ref<TagSetting[]>([])
const handleClick = (tag: TagSetting) => {
  dynamicTags.value.forEach((item) => (item.active = false))
  tag.active = true
  otherStore.setActiveRoute({ fullPath: tag.fullPath, meta: tag.meta })
  otherStore.setActivePath(tag.fullPath)
}
//监听otherStore仓库中Getter数据
watch(
  () => otherStore.activePath,
  () => {
    //在捕获activePath数据更改之前，此时otherStore.activeRoute已更改
    const newTag: TagSetting = {
      active: false,
      fullPath: otherStore.activeRoute.fullPath,
      meta: otherStore.activeRoute.meta
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
</script>

<style scoped>
.content {
  display: flex;
  height: calc(100% - var(--main-head-height));

  main {
    background-color: #f0f2f5;
    width: 100%;
    padding: 15px;
    .content-wrapper {
      height: 100%;
      /* background-color: var(--main-background-color); */
      .tags {
        height: 30px;
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
