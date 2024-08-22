<template>
  <div class="content">
    <Sidebar></Sidebar>
    <main>
      <div class="content-wrapper">
        <div class="tags">
          <el-icon icon v-if="!store.collapse" @click="store.changeCollapse()"><Fold /></el-icon>
          <el-icon icon v-else @click="store.changeCollapse()"><Expand /></el-icon>
          <el-divider direction="vertical" />
          <el-check-tag
            :checked="tag.status"
            tag
            v-for="tag in dynamicTags"
            :key="tag.val"
            closable
            :disable-transitions="false"
            @close="handleClose(tag)"
            @change="onChange(tag)"
          >
            {{ tag.val }}
          </el-check-tag>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import Sidebar from './Sidebar.vue'
import { Fold, Expand } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'
import { ref } from 'vue'
const store = useUserStore()
const dynamicTags = ref([
  { val: 'tag 1', status: true },
  { val: 'tag 2', status: false },
  { val: 'tag 3', status: false }
])
const handleClose = (tag: any) => {
  dynamicTags.value.splice(dynamicTags.value.indexOf(tag), 1)
}
const onChange = (tag: { val: string; status: boolean }) => {
  dynamicTags.value.forEach((item) => (item.status = false))
  tag.status = true
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
        [tag] {
          box-sizing: border-box;
          height: 100%;
          color: var(--main-tag-color);
          font-weight: unset;
          margin-right: 10px;
          border: 1px solid var(--main-tag-basic-color);
          background-color: var(--main-tag-basic-backgroundColor);
        }
      }
    }
  }
}
</style>
