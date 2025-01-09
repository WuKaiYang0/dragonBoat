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
            v-model:current-page="currentPage"
            :page-size="tableSource.pageSize"
            :page-sizes="tableSource.pageSizes"
            :layout="
              triggers.isOverflowX
                ? 'total, prev, pager, next, '
                : 'total, sizes, prev, pager, next, jumper'
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
import {
  getCurrentInstance,
  inject,
  nextTick,
  onMounted,
  onUnmounted,
  ref,
  watch,
  type PropType
} from 'vue'
const tableRef = ref<TableInstance>()
const rightTable_elcard = ref<CardInstance>()
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
const setOverflowX = () => {
  if (judgeIsOverflowX()) {
    triggers.value.isOverflowX = true
  } else {
    triggers.value.isOverflowX = false
  }
}
const judgeIsOverflowX = () => {
  const elCardBodyInner = (rightTable_elcard.value.$el as HTMLElement).querySelector(
    '.el-card__body'
  ).children[0] as HTMLElement
  elCardBodyInner.offsetWidth
  if (elCardBodyInner.classList.contains('el-table--scrollable-x')) {
    return true
  } else {
    return false
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
onMounted(async () => {
  window.addEventListener('resize', setHeight)
  window.addEventListener('resize', setOverflowX)
})
onUnmounted(() => {
  window.removeEventListener('resize', setHeight)
  window.removeEventListener('resize', setOverflowX)
})
nextTick(() => {
  setHeight()
  setOverflowX()
})
defineExpose({
  rightTable_elcard,
  setHeight,
  expandedRows,
  tableRef,
  foldAllExpandedRows,
  judgeIsOverflowX
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
      }
      .table-header-label {
        display: flex;
        align-items: center;
        .label {
          margin: auto;
        }
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
    /* .el-card {
      display: flex;
      flex-direction: column;
      width: 100%;
      :deep(td) {
        padding: 15px 10px;
      }
      :deep(.el-card__header) {
        border-bottom: unset;
        padding-bottom: 5px;
        border-radius: 50%;
      }
      :deep(.el-card__body) {
        padding-top: 0;
      }
      :deep(.el-table tr) {
      }
    } */
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
