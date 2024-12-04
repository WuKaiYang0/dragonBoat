<template>
  <ElButton type="default" :size="size" :plain="true" :icon="icon" class="btn">
    <slot></slot>
  </ElButton>
</template>
<script setup lang="ts">
import { WhatColor } from '@/typings/enums'
import { getColor } from '@/utils/common'
import { ElButton, ButtonInstance, buttonProps, ButtonType, ButtonProps } from 'element-plus'
import { PropType, ref } from 'vue'
const prop = defineProps(
  Object.assign(buttonProps, {
    borderColor: { type: String, default: getColor(WhatColor.InitialColor) },
    color: { type: String },
    backgroundColor: { type: String }
  })
)
// defineProps({
//   // type: {
//   //   required: true,
//   //   // type: String as PropType<'1' | '2'>
//   //   type: String as PropType<ButtonType>
//   // },
//   type: buttonProps.type,
//   size: buttonProps.size,
//   plain:buttonProps.plain,
//   icon:buttonProps.icon
// })
</script>
<style scoped>
.btn {
  border-color: v-bind('prop.borderColor');
  color: v-bind('prop.color');
  background-color: v-bind('prop.backgroundColor');
}
.el-button:hover {
  color: v-bind('prop.color') !important;
  border-color: v-bind('prop.borderColor') !important;
}
</style>
