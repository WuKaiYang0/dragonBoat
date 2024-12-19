<template>
  <div class="pagination-wrapper">
    <el-pagination
      :model-value="currentPage"
      :page-size="pageSize"
      size="small"
      :background="false"
      :layout="layout"
      :total="total"
      @update:current-page="['onCurrent-change', 'a']"
    >
    </el-pagination>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { paginationProps, paginationEmits } from 'element-plus'
import { getColor } from '@/utils/common'
import { WhatColor } from '@/typings/enums'
defineProps(paginationProps)
defineEmits(paginationEmits)
const theme = ref(getColor(WhatColor.ThemeColor))
</script>

<style scoped>
.pagination-wrapper {
  margin-top: 15px;
  display: flex;
  justify-content: flex-end;
  color: v-bind('theme') !important;
  :deep(.el-pager li.is-active, .el-pager li:hover) {
    color: v-bind('theme');
  }
}
</style>
