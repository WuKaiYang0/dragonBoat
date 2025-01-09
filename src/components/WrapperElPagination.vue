<template>
  <div class="pagination-wrapper">
    <ElConfigProvider :locale="zhCn">
      <el-pagination
        :model-value="currentPage"
        :page-sizes="pageSizes"
        :size="size"
        :background="false"
        :layout="layout"
        :total="total"
        :default-current-page="1"
        :page-size="pageSize"
        @current-change="(val: number) => emits('update:current-page', val)"
        @size-change="(val: number) => emits('update:page-size', val)"
      >
      </el-pagination>
    </ElConfigProvider>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { paginationProps, paginationEmits } from 'element-plus'
import { getColor } from '@/utils/common'
import { WhatColor } from '@/typings/enums'
import { ElConfigProvider } from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
const props = defineProps(paginationProps)
const emits = defineEmits(paginationEmits)
const theme = ref(getColor(WhatColor.ThemeColor))
// console.log(emits, 'emits')
// 修改分页器默认文字
zhCn.el.pagination.total = '共 {total} 条'
zhCn.el.pagination.goto = '跳至'
zhCn.el.pagination.pagesize = '条/页'
</script>

<style scoped>
@import url(@styles/pagination.css);
/* .pagination-wrapper {
  margin-top: 15px;
  display: flex;
  justify-content: flex-end;
  color: v-bind('theme') !important;
  :deep(.el-pager li.is-active, .el-pager li:hover) {
    color: v-bind('theme');
  }
} */
</style>
