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
        <el-breadcrumb separator="/">
          <el-breadcrumb-item v-for="p in path">{{ p }}</el-breadcrumb-item>
        </el-breadcrumb>
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
        <span style="font-size: 15px">{{ userStore.unit?.name }}</span>
        <el-popover
          placement="bottom-end"
          trigger="click"
          ref="popoverRef"
          :virtual-ref="buttonRef"
          :hide-after="0"
        >
          <template #reference>
            <div style="margin: 0 10px" ref="buttonRef" v-click-outside="onClickOutside">
              <el-icon v-if="arrowTrigger" @click="arrowTrigger = !arrowTrigger"
                ><ArrowUpBold
              /></el-icon>
              <el-icon v-else @click="arrowTrigger = !arrowTrigger"><ArrowDownBold /></el-icon>
            </div>
          </template>
          <template #default>
            <ul>
              <li @click="logout">
                <el-icon><SwitchButton /></el-icon>
                <span>退出登录</span>
              </li>
            </ul>
          </template>
        </el-popover>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import DragonBoatLogo from '@components/svgs/DragonBoatLogo.vue'
import Avatar from '@components/svgs/Avatar.vue'
import { Refresh, Bell, FullScreen, ArrowUpBold, ArrowDownBold } from '@element-plus/icons-vue'
import { useUnitStore } from '@/stores/unit'
import { useOtherStore } from '@/stores/other'
import { getCurrentInstance, onMounted, watch, ref, unref } from 'vue'
import { delItem, getItem } from '@/utils/localStorage'
import { LocalStorageKey } from '@/typings/enums'
import router from '@/router'
import { ClickOutside as vClickOutside } from 'element-plus'
const { $requests, $message } = getCurrentInstance().appContext.config.globalProperties
const userStore = useUnitStore()
const otherStore = useOtherStore()
const path = ref<string[]>([])
watch(
  () => otherStore.activePath,
  (p) => {
    path.value = p.replace('/', '').split('/')
  },
  {
    immediate: true
  }
)
//页面刷新的情况下
const getData = async () => {
  console.log('getData')
  try {
    const token = getItem(LocalStorageKey.TOKEN)
    if (!token) return router.replace('/login')
    if (token) {
      const {
        data: { data, code, message }
      } = await $requests.unitAPI.getUnitInfo(token)
      if (code == 200) {
        userStore.setUnitInfo(data)
      } else {
        delItem(LocalStorageKey.TOKEN)
        $message.warning({ message })
        router.replace('/login')
      }
    } else {
      router.replace('/login')
    }
  } catch (error) {
    $message.error({ message: error.message })
    delItem(LocalStorageKey.TOKEN)
    router.replace('/login')
  }
}
const arrowTrigger = ref(true)
const buttonRef = ref()
const popoverRef = ref()
const onClickOutside = () => {
  arrowTrigger.value = true
}
const logout = async () => {
  try {
    const token = getItem(LocalStorageKey.TOKEN)
    if (!token) {
      router.replace('/login')
      return
    }
    const res = await $requests.commonAPI.logout(token)
    const {
      data: { code, message }
    } = res
    if (code) {
      delItem(LocalStorageKey.TOKEN)
      $message.success(message)
      router.replace('/login')
    } else {
      $message.error(message)
    }
  } catch (error) {
    $message.error(error.message)
  }
}
onMounted(() => {
  getData()
})
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
li {
  display: flex;
  align-items: center;
  gap: 5px;
}
li:hover {
  color: #1677ff;
  cursor: pointer;
}
</style>
