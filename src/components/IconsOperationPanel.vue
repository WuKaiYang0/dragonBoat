<template>
  <div class="operations">
    <div class="operation">
      <template v-if="refresh.switch">
        <el-tooltip effect="dark" content="刷新" placement="top" :auto-close="500" trigger="click">
          <el-icon icon @click="refreshClickHandler"><Refresh /></el-icon>
        </el-tooltip>
      </template>
      <template v-if="secondFullScreen.switch">
        <el-tooltip
          effect="dark"
          :content="isFullScreen ? '还原' : '全屏'"
          placement="top"
          :auto-close="500"
          trigger="click"
        >
          <el-icon ref="screenIconRef" @click="screenClickHandler(secondFullScreen)"
            ><SecondFullScreen v-if="!isFullScreen"></SecondFullScreen>
            <SecondOffScreen v-else></SecondOffScreen
          ></el-icon>
        </el-tooltip>
      </template>
      <slot></slot>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { onMounted, onUnmounted, ref, type PropType } from 'vue'
import { toggleFullScreen, isFullScreen } from '@hooks/useFullScreen'
import { ElMessage } from 'element-plus'
import SecondFullScreen from './svgs/SecondFullScreen.vue'
const refreshClickHandler = () => {
  props.refresh?.handler.forEach((func) => func())
}
const screenClickHandler = (_props: FullScreen) => {
  toggleFullScreen(_props.$el)
    .then(() => {
      isFullScreen.value = !isFullScreen.value
      _props?.handler.reduce((prevPromise, currentPromise) => {
        return prevPromise.then(() => currentPromise())
      }, Promise.resolve())
    })
    .catch((err) => {
      ElMessage.error('请稍后再试')
    })
}
type FullScreen = {
  switch: boolean
  $el: HTMLElement
  handler: (() => void)[]
}
const props = defineProps({
  refresh: {
    type: Object as PropType<{
      switch: boolean
      handler: (() => void)[]
    }>,
    default: () => ({})
  },
  secondFullScreen: {
    type: Object as PropType<FullScreen>,
    default: () => ({})
  }
})
const escapeExitEvent = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && event.code === 'Escape' && isFullScreen.value) {
    screenClickHandler(props.secondFullScreen)
  }
}
onMounted(() => {
  if (props.secondFullScreen.switch) {
    window.addEventListener('keydown', escapeExitEvent)
  }
})
onUnmounted(() => {
  if (props.secondFullScreen.switch) {
    window.removeEventListener('keydown', escapeExitEvent)
  }
})
</script>
<style scoped>
.operations {
  height: 100%;
  display: flex;
  align-items: center;
  .operation {
    display: flex;
    justify-content: flex-end;
    /* width: calc(var(--main-head-icon-size) * 2); */
    padding: 0 5px;
    font-size: 20px;
    gap: 10px;
  }
}
</style>
