<template>
  <Transition name="aleft">
    <slot></slot>
  </Transition>
  <!-- <Transition
    name="aleft"
    @before-enter="beforeEnter"
    @enter="enter"
    @after-enter="afterEnter"
    @before-leave="beforeLeave"
    @leave="leave"
    @after-leave="afterLeave"
    @enter-cancelled="enterCancelled"
    @leave-cancelled="leaveCancelled"
  >
    <slot></slot>
  </Transition> -->
</template>
<script setup lang="ts"></script>
<style scoped>
@import 'https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css';
/* .aleft-leave-active {
  overflow: hidden;
  max-width: 0px;
  padding-left: 0px;
  padding-right: 0px;
} */
.aleft-leave-to,
.aleft-enter-from {
  overflow: hidden;
  max-width: 0px;
  padding-left: 0px;
  padding-right: 0px;
}
.aleft-leave-active,
.aleft-enter-active {
  transition: all 0.3s;
  /* max-width: var(--aleft-transition-maxWidth);
  padding-left: var(--aleft-transition-paddingLeft);
  padding-right: var(--aleft-transition-paddingRight); */
}
/* .aleft-enter */
/* .aleft-transition {
} */
</style>
