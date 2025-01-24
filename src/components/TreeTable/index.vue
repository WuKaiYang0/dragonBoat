<template>
  <div class="tree-table-container">
    <div ref="leftTreeWrapperRef" class="left-tree-container">
      <LeftTreeList
        v-model:model-value="datas.oneInData"
        :tree-source="treeSource"
        @change:data-of-tree="emits('change:dataOfTree')"
        @update:data-of-tree:current-page="
          (val: number) => emits('update:dataOfTree:currentPage', val)
        "
        @update:data-of-tree:page-size="(val: number) => emits('update:dataOfTree:pageSize', val)"
      >
        <template #tree-header>
          <slot name="tree-header"></slot>
        </template>
      </LeftTreeList>
      <slot name="tree-default"></slot>
    </div>
    <div class="left-tree-icon-control">
      <ElButton
        ref="foldBtnRef"
        class="fold-btn"
        :icon="isFold ? ArrowRightBold : ArrowLeftBold"
        size="small"
        circle
        @click="fold"
      ></ElButton>
    </div>
    <div class="right-table-container">
      <RightTable
        ref="rightTableRef"
        v-model:model-value="triggers"
        :loading="loading"
        :table-source="tableSource"
        @change:data-of-table="emits('change:dataOfTable')"
        @update:data-of-table:current-page="
          (val: number) => emits('update:dataOfTable:currentPage', val)
        "
        @update:data-of-table:page-size="(val: number) => emits('update:dataOfTable:pageSize', val)"
      >
        <template #table-header>
          <slot name="table-header"></slot>
        </template>
        <template #table-operation-icons>
          <slot name="table-operation-icons"></slot>
        </template>
        <template #table>
          <slot name="table"></slot>
        </template>
      </RightTable>
    </div>
    <slot name="table-default"></slot>
  </div>
</template>
<script setup lang="ts">
import { onMounted, provide, ref, watch, type PropType } from 'vue'
import LeftTreeList from './LeftTreeList/index.vue'
import RightTable from './RightTable/index.vue'
import { ArrowLeftBold, ArrowRightBold } from '@element-plus/icons-vue'
import type { ButtonInstance } from 'element-plus'
const rightTableRef = ref<InstanceType<typeof RightTable>>()
const leftTreeWrapperRef = ref<HTMLElement>()
const foldBtnRef = ref<ButtonInstance>()
const isFold = ref(false)
const triggers = ref({
  isOverflowX: false,
  isShowMask: false
})
const fold = () => {
  const btnEl = foldBtnRef.value.$el as HTMLElement
  if (isFold.value) {
    leftTreeWrapperRef.value.style.width = ''
    btnEl.style.setProperty('--fold-offset', '-50%')
  } else {
    leftTreeWrapperRef.value.style.width = '0px'
    btnEl.style.setProperty('--fold-offset', '15%')
  }
  isFold.value = !isFold.value
  leftTreeWrapperRef.value.addEventListener('transitionend', () => {
    if (triggers.value.isOverflowX && !isFold.value) {
      triggers.value.isShowMask = true
    } else {
      triggers.value.isShowMask = false
    }
  })
}
provide('foldLeftTreePanelFunc', fold)
defineExpose({ rightTableRef })
type OneInData = {
  name: string
}
const props = defineProps({
  loading: {
    required: true,
    type: Boolean,
    default: false
  },
  treeSource: {
    required: true,
    type: Object as PropType<{
      dataOfTree: { name: string }[]
      paginationTotals: number
      currentPage: number
      pageSizes: number[]
      pageSize: number
    }>
  },
  tableSource: {
    required: true,
    type: Object as PropType<{
      dataOfTable: unknown[]
      paginationTotals: number
      currentPage: number
      pageSizes: number[]
      pageSize: number
    }>
  }
})
const emits = defineEmits([
  'change:dataOfTable',
  'update:dataOfTable:currentPage',
  'update:dataOfTable:pageSize',
  'change:dataOfTree',
  'update:dataOfTree:currentPage',
  'update:dataOfTree:pageSize'
])
const datas = defineModel({
  required: true,
  type: Object as PropType<{ oneInData: { name: string } }>
})
watch(
  () => triggers.value.isOverflowX,
  (isOverflowX) => {
    if (isOverflowX) {
      if (!isFold.value) {
        fold()
      }
    }
  },
  { once: true }
)
</script>
<style scoped>
.tree-table-container {
  height: 100%;
  display: flex;
  position: relative;
  flex: 1;
  gap: 0px;
  --fold-btn-z-index: 2003;
  .left-tree-container {
    display: flex;
    justify-content: flex-end;
    flex-shrink: 0;
    width: var(--left-tree-inner-width);
    overflow: hidden;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    ul {
      font-size: 14px;
      padding: 0 15px;
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
    }
  }
  .right-table-container {
    display: flex;
    flex-grow: 1;
    overflow: hidden;
  }
  .fold-btn {
    position: absolute;
    top: 45%;
    transform: translateX(var(--fold-offset));
    z-index: var(--fold-btn-z-index);
    --fold-offset: -50%;
  }
  .left-tree-icon-control {
    position: relative;
  }
}
</style>
<style scoped>
:deep(.el-card) {
  display: flex;
  flex-direction: column;
  width: 100%;
  .el-card__header {
    border-bottom: unset;
    padding-bottom: 5px;
    border-radius: 50%;
  }
  .el-card__body {
    padding-top: 0;
  }
  .el-table tr {
    /* background-color: #1677ff; */
  }
}
:deep(td) {
  padding: 15px 10px;
}
</style>
