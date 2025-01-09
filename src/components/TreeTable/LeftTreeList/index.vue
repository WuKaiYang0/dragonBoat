<template>
  <ElCard
    ref="leftTreeCard"
    class="left-tree-inner"
    body-style="padding:0px;flex:1;overflow:auto"
    shadow="always"
  >
    <template #header>
      <slot name="tree-header"></slot>
    </template>
    <template #default>
      <ul ref="ulRef" style="height: 100%">
        <el-scrollbar :always="false">
          <TransitionGroup name="list">
            <li
              v-for="(tl, index) in treeSource.dataOfTree"
              :key="index"
              :class="{ active: currentIndex === index }"
              @click="switchoverActive(index, tl)"
            >
              {{ tl.name }}<span style="font-size: 13px">(队伍名称)</span>
            </li>
          </TransitionGroup>
        </el-scrollbar>
      </ul>
    </template>
    <template #footer>
      <WrapperElPagination
        v-model:current-page="currentPage"
        :page-size="treeSource.pageSize"
        :page-sizes="treeSource.pageSizes"
        layout="total,prev, pager, next,"
        :total="treeSource.paginationTotals"
        size="small"
        @update:page-size="onSizeChange"
        @update:current-page="onCurrentChange"
      ></WrapperElPagination>
    </template>
  </ElCard>
</template>

<script setup lang="ts">
import { getCurrentInstance, onMounted, onUnmounted, ref, watch, type PropType } from 'vue'
import type { CardInstance } from 'element-plus/lib/components/index.js'
import WrapperElPagination from '@components/WrapperElPagination.vue'
type Data = {
  name: string
}
const leftTreeCard = ref<CardInstance>()
const currentIndex = ref(0)
const scrollbarMaxHeight = ref(300)
const emits = defineEmits([
  'change:dataOfTree',
  'update:dataOfTree:currentPage',
  'update:dataOfTree:pageSize'
])
const props = defineProps({
  treeSource: {
    required: true,
    type: Object as PropType<{
      dataOfTree: Data[]
      paginationTotals: number
      currentPage: number
      pageSizes: number[]
      pageSize: number
    }>
  }
})
const currentPage = ref(props.treeSource.currentPage)
const onSizeChange = (val: number) => {
  emits('update:dataOfTree:pageSize', val)
  emits('change:dataOfTree')
}
const onCurrentChange = (val: number) => {
  emits('update:dataOfTree:currentPage', val)
  emits('change:dataOfTree')
}
watch(
  () => props.treeSource.currentPage,
  (nV) => {
    currentPage.value = nV
  }
)
const oneInData = defineModel({
  required: true,
  type: Object as PropType<Data>
})
const switchoverActive = (index: number, tl: Data) => {
  currentIndex.value = index
  oneInData.value = tl
}
const hFunc = () => {
  const el = ulRef.value as HTMLElement
  scrollbarMaxHeight.value = el?.offsetHeight
}
const ulRef = ref()
onMounted(() => {
  window.addEventListener('resize', hFunc)
  const _el = leftTreeCard.value.$el as HTMLElement
  const _parentEl = getCurrentInstance().parent.vnode.el as HTMLElement
  const w = window.getComputedStyle(_el).width
  _parentEl.style.setProperty('--left-tree-inner-width', w)
  hFunc()
})
onUnmounted(() => {
  window.removeEventListener('resize', hFunc)
})
</script>
<style scoped>
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
<style scoped>
.left-tree-inner {
  flex-shrink: 0;
  --left-tree-inner-width: auto;
  width: var(--left-tree-inner-width) !important;
}
.el-card {
  display: flex;
  flex-direction: column;
  ul {
    font-size: 14px;
    padding: 0 15px;
  }
  li {
    height: 37px;
    margin-bottom: 2px;
    padding: 0 10px;
    line-height: 37px;
    cursor: pointer;
    border-radius: 4px;
  }
  li.active {
    background-color: #e8f1ff;
    font-weight: bold;
    color: #1677ff;
  }
  li:not(.active):hover {
    background-color: #f5f5f5;
  }
  li.active:hover {
    background-color: #d0e4ff;
  }
  :deep(.el-card__header) {
    border-bottom: unset;
  }
}
</style>
