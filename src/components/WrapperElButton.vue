<template>
  <ElButton class="btn" :="groupBtnProp" :btnType>
    <slot></slot>
  </ElButton>
</template>
<script setup lang="ts">
import { WhatColor } from '@/typings/enums'
import { getColor } from '@/utils/common'
import { ElButton, buttonProps, type ButtonProps } from 'element-plus'
import { Delete, Edit, Plus, Search } from '@element-plus/icons-vue'
import { computed, type PropType, ref, watch } from 'vue'
type BtnKeys = 'del' | 'edit' | 'search' | 'plus'
type BtnPropsCustom = {
  [key in BtnKeys]: Partial<{ borderColor: string; backgroundColor: string } & ButtonProps>
}

const btnPropDefault: BtnPropsCustom = {
  del: {
    size: 'default',
    icon: Delete,
    color: getColor(WhatColor.DeleteColor),
    borderColor: getColor(WhatColor.DeleteColor),
    plain: true
  },
  edit: {
    size: 'default',
    icon: Edit,
    color: getColor(WhatColor.ThemeColor),
    borderColor: getColor(WhatColor.ThemeColor),
    plain: true
  },
  search: {
    size: 'default',
    icon: Search,
    plain: true,
    borderColor: getColor(WhatColor.WhiteBorderColor)
  },
  plus: {
    size: 'default',
    icon: Plus,
    borderColor: getColor(WhatColor.ThemeColor),
    color: getColor(WhatColor.ThemeColor),
    plain: true
  }
}
const prop = defineProps({
  btnType: {
    type: String as PropType<BtnKeys>,
    required: true
  },
  color: {
    type: String,
    default: ''
  },
  backgroundColor: {
    type: String,
    default: ''
  },
  borderColor: { type: String, default: '' },
  size: {
    type: buttonProps['size'].type,
    required: true
  }
})
const groupBtnProp = computed(() => {
  const style = {}
  for (let key in prop) {
    if (prop[key]) {
      style[key] = prop[key]
    }
  }
  return Object.assign(btnPropDefault[prop.btnType], style)
})
</script>
<style scoped>
.btn {
  border-color: v-bind('groupBtnProp.borderColor');
  color: v-bind('groupBtnProp.color');
  background-color: v-bind('groupBtnProp.backgroundColor');
}
.el-button:hover {
  color: v-bind('groupBtnProp.color') !important;
  border-color: v-bind('groupBtnProp.borderColor') !important;
}
</style>
