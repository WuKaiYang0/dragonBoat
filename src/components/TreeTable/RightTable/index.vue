<template>
  <div class="right-table-wrapper">
    <div ref="tableZoomRef" class="right-table-members" :default-expand-all="true">
      <ElCard ref="rightTable_elcard" body-style="flex:1;overflow:auto;z-index:0;">
        <template #header>
          <slot name="table-header"></slot>
          <slot name="table-operation-icons"></slot>
        </template>
        <template #default>
          <el-table
            ref="tableRef"
            v-loading="loading"
            :data="tableSource.dataOfTable"
            :height="height"
            :scrollbar-always-on="true"
            @expand-change="expandChange"
          >
            <slot name="table"></slot>
          </el-table>
        </template>
        <template #footer>
          <WrapperElPagination
            ref="rightTablePaginationRef"
            v-model:current-page="currentPage"
            :page-size="tableSource.pageSize"
            :page-sizes="tableSource.pageSizes"
            :layout="
              isOver ? 'total, prev, pager, next' : 'total, sizes, prev, pager, next, jumper'
            "
            :total="tableSource.paginationTotals"
            size="small"
            @update:page-size="onSizeChange"
            @update:current-page="onCurrentChange"
          ></WrapperElPagination>
        </template>
      </ElCard>
    </div>
    <div v-show="triggers.isShowMask" class="mask" @click="maskClickHandler"></div>
  </div>
</template>

<script setup lang="ts">
import type { CardInstance, TableInstance } from 'element-plus'
import { inject, nextTick, onMounted, onUnmounted, ref, watch, type PropType, type Ref } from 'vue'
import WrapperElPagination from '@components/WrapperElPagination.vue'
import {
  judgeOverXByEls,
  removeObserver,
  computedAllWidthByElOrNum
} from '@/hooks/useJudgeIsOverflowXByels'
const tableRef = ref<TableInstance>()
const rightTable_elcard = ref<CardInstance>()
const rightTablePaginationRef = ref<InstanceType<typeof WrapperElPagination>>()
const fold = inject('foldLeftTreePanelFunc') as () => void
const setHeight = () => {
  const elCardBodyEl = (rightTable_elcard.value.$el as HTMLElement).querySelector(
    '.el-card__body'
  ) as HTMLElement
  height.value = elCardBodyEl.offsetHeight - 25
}
const onSizeChange = (val: number) => {
  emits('update:dataOfTable:pageSize', val)
  emits('change:dataOfTable')
}
const onCurrentChange = (val: number) => {
  emits('update:dataOfTable:currentPage', val)
  emits('change:dataOfTable')
}
// 当观察到变动时执行的回调函数
const callback: MutationCallback = function (mutationsList) {
  if ((mutationsList[0].target as HTMLElement).classList.contains('el-table--scrollable-x')) {
    triggers.value.isOverflowX = true
  } else {
    triggers.value.isOverflowX = false
  }
}
const maskClickHandler = () => {
  fold && fold()
}
const expandedRows = ref([])
const foldAllExpandedRows = () => {
  expandedRows.value.forEach((item) => {
    tableRef.value?.toggleRowExpansion(item, false)
  })
}
const expandChange = (row, _expandedRows) => {
  expandedRows.value = _expandedRows
}
const height = ref(0)
const triggers = defineModel({
  type: Object as PropType<{ isOverflowX: boolean; isShowMask: boolean }>,
  required: true
})
const props = defineProps({
  tableSource: {
    required: true,
    type: Object as PropType<{
      dataOfTable: unknown[]
      paginationTotals: number
      currentPage: number
      pageSizes: number[]
      pageSize: number
    }>
  },
  loading: {
    required: true,
    type: Boolean,
    default: false
  }
})
const currentPage = ref(props.tableSource.currentPage)
watch(
  () => props.tableSource.currentPage,
  (nV) => {
    currentPage.value = nV
  }
)
const emits = defineEmits([
  'change:dataOfTable',
  'update:dataOfTable:currentPage',
  'update:dataOfTable:pageSize'
])
const isOver = ref<boolean>(false)
onMounted(async () => {
  window.addEventListener('resize', setHeight)
})
onUnmounted(() => {
  window.removeEventListener('resize', setHeight)
  // removeObserver(resizeObserver)
  mutationObserver.disconnect()
})
let resizeObserver = null as ResizeObserver[]
let mutationObserver = null as MutationObserver
nextTick(() => {
  setHeight()
  const elCardBodyInner = (rightTable_elcard.value.$el as HTMLElement).querySelector(
    '.el-card__body'
  ).children[0] as HTMLElement
  mutationObserver = new MutationObserver(callback)
  mutationObserver.observe(elCardBodyInner, { attributes: true, attributeFilter: ['class'] })
  // const len = computedAllWidthByElOrNum([
  //   (rightTablePaginationRef.value.$el as HTMLElement)?.children[0] as HTMLElement
  // ])
  // let timer = null
  // const targetObserverCallback: ResizeObserverCallback = (entries) => {
  //   if (entries.length > 1) {
  //     throw new Error('只能监听一个目标元素')
  //   }
  //   const callback = () => {
  //     console.log('@@')

  //     const {
  //       contentRect: { width }
  //     } = entries[0]
  //     if (width < len) {
  //       isOver.value = true
  //     } else {
  //       isOver.value = false
  //     }
  //   }
  //   clearTimeout(timer)
  //   timer = setTimeout(callback, 100)
  // }
  // resizeObserver = new ResizeObserver(targetObserverCallback)
  // resizeObserver.observe(rightTablePaginationRef.value.$el)
  // console.log(rightTablePaginationRef.value.$el)

  resizeObserver = judgeOverXByEls(
    rightTablePaginationRef.value.$el,
    [(rightTablePaginationRef.value.$el as HTMLElement)?.children[0] as HTMLElement],
    isOver
  )
})
defineExpose({
  rightTable_elcard,
  setHeight,
  expandedRows,
  tableRef,
  foldAllExpandedRows
})
</script>
<style>
@keyframes mask0-1 {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>
<style scoped>
.right-table-wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex-grow: 1;
  overflow: hidden;
  .right-table-members {
    flex-grow: 1;
    display: flex;
    width: 100%;
    overflow: auto;
    :deep(.el-table__header-wrapper) {
      border-radius: 6px 6px 0px 0px;
      .cell {
        padding: 0;
      }
      th:hover {
        background-color: #f0f0f0 !important;
      }
      th {
        /* background: #fafafc !important; */
        background: #f7f7f7 !important;
        font-weight: 600;
        color: #313437;
        padding-left: 5px;
        padding-right: 5px;
      }
      .table-header-label::before {
        content: '';
        border-left: 1px var(--el-border-color) var(--el-border-style);
        display: inline-block;
        height: 1em;
        /* margin: 0 8px; */
        position: relative;
        vertical-align: middle;
        width: 1px;
      }
    }
    :deep(.el-table__inner-wrapper)::before {
      content: unset;
    }
    :deep(.el-card__footer) {
      position: relative;
    }
  }
  .mask {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: var(--fold-btn-z-index - 1);
    background: #9e9e9e33;
    cursor: pointer;
    backdrop-filter: blur(6px);
    animation: mask0-1 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  }
}
</style>
