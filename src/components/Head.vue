<template>
  <div class="head">
    <div class="head-left">
      <i class="logo-box">
        <DragonBoatLogo></DragonBoatLogo>
      </i>
      Dragon Boat
    </div>
    <div class="head-right">
      <div class="bread">
        <el-divider direction="vertical" />

        <HeadBreadcrumb></HeadBreadcrumb>
      </div>
      <div class="operations">
        <div class="operation">
          <el-icon icon><Refresh /></el-icon>
          <el-icon icon><Bell /></el-icon>
          <el-icon icon><FullScreen /></el-icon>
        </div>
        <el-divider direction="vertical" />
        <i class="avatar">
          <Avatar></Avatar>
        </i>
        <span style="font-size: 15px">华南师范大学教育科学学院网工男子队-南3栋-503</span>
        <el-icon><ArrowUpBold /></el-icon>
        <el-icon><ArrowDownBold /></el-icon>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import HeadBreadcrumb from './HeadBreadcrumb.vue'
import DragonBoatLogo from '@components/svgs/DragonBoatLogo.vue'
import Avatar from '@components/svgs/Avatar.vue'
import { Refresh, Bell, FullScreen, ArrowUpBold, ArrowDownBold } from '@element-plus/icons-vue'
</script>

<style scoped>
.head {
  height: var(--main-head-height);
  width: 100%;
  display: flex;
  .head-left {
    width: var(--main-side-width);
    height: calc(100% - var(--main-head-height));
    height: 100%;
    display: flex;
    align-items: center;
    color: rgba(0, 0, 0, 0.6);
    padding-left: var(--el-menu-base-level-padding);

    .logo-box {
      font-size: 32px;
      margin-right: 5px;
    }
  }
  .head-right {
    width: 100%;
    display: flex;
    justify-content: space-between;
    .bread {
      height: 100%;
      display: flex;
      align-items: center;
    }
    .operations {
      height: 100%;
      display: flex;
      align-items: center;
      .operation {
        display: flex;
        justify-content: space-between;
        width: calc(var(--main-head-icon-size) * 4);
        padding: 0 5px;
      }
      .avatar {
        font-size: 32px;
        display: flex;
        align-items: center;
        margin: 0 10px;
      }
    }
  }
}
</style>
