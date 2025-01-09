<template>
  <ElButton class="btn" :="groupBtnProp" :btn-type>
    <slot></slot>
  </ElButton>
</template>
<script setup lang="ts">
import { WhatColor } from '@/typings/enums'
import { getColor } from '@/utils/common'
import { ElButton, buttonProps, type ButtonProps } from 'element-plus'
import { Delete, Edit, Plus, Search, Refresh } from '@element-plus/icons-vue'
import { computed, type PropType } from 'vue'
type BtnKeys = 'del' | 'edit' | 'search' | 'plus' | 'cancel' | 'confirm' | 'reset' | 'link'
type ThemeColor = 'rose' | 'orange' | 'water' | 'blueberry'
type ColorAttr = { color: string; backgroundColor: string; borderColor: string }
type BtnBasePropCustom = {
  [key in BtnKeys]: Partial<ColorAttr & ButtonProps>
}
type BtnColorPropCustom = {
  [key in ThemeColor]: Partial<{ color: string; borderColor: string; backgroundColor: string }>
}
const btnBasePropDefault: BtnBasePropCustom = {
  link: {
    link: true,
    type: 'primary',
    borderColor: 'transparent'
  },
  del: {
    icon: Delete,
    plain: true
  },
  edit: {
    icon: Edit,
    plain: true
  },
  search: {
    icon: Search,
    plain: true
  },
  plus: {
    icon: Plus,
    plain: true
  },
  cancel: {
    plain: true
  },
  confirm: {
    plain: true
  },
  reset: {
    icon: Refresh,
    plain: true
  }
}
const themeColor: BtnColorPropCustom = {
  rose: {
    color: getColor(WhatColor.DeleteColor),
    borderColor: getColor(WhatColor.DeleteColor)
  },
  blueberry: {
    color: getColor(WhatColor.ThemeColor),
    borderColor: getColor(WhatColor.ThemeColor)
  },
  orange: {
    color: getColor(WhatColor.orangeColor),
    borderColor: getColor(WhatColor.orangeColor)
  },
  water: {
    borderColor: getColor(WhatColor.InitialColor)
  }
}

const prop = defineProps({
  btnType: {
    type: String as PropType<BtnKeys>,
    required: true
  },
  customTheme: {
    type: Object as PropType<ColorAttr>,
    default: () => ({ color: '', backgroundColor: '', borderColor: '' })
  },
  theme: {
    type: String as PropType<ThemeColor>,
    required: true
  },
  size: {
    type: buttonProps['size'].type,
    required: true
  }
})
const groupBtnProp = computed(() => {
  const customThemeStyle = {}
  const customTheme = prop.customTheme
  for (const key in customTheme) {
    if (customTheme[key]) {
      customThemeStyle[key] = customTheme[key]
    }
  }
  return Object.assign(
    {},
    themeColor[prop.theme],
    btnBasePropDefault[prop.btnType],
    customThemeStyle,
    { size: prop.size }
  )
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
