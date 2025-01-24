<template>
  <Transition name="fade-shift" mode="out-in" @enter="enter">
    <slot></slot>
  </Transition>
</template>
<script setup lang="ts">
const enter = () => {
  emits('enter')
}
const emits = defineEmits(['enter'])
</script>
<style scoped>
.fade-shift-enter-active {
  transition: all 0.2s ease-out;
  transform: translate(0px);
}
.fade-shift-leave-active {
  transform: translate(-60px);
  transition: all 0.2s ease-out;
}
.fade-shift-enter-from {
  opacity: 0;
  transform: translateX(-60px);
}
.fade-shift-leave-to {
  opacity: 0;
  transform: translateX(60px);
}
</style>
