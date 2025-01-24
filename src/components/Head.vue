<template>
  <div class="head">
    <div ref="headWrapperRef" class="head-wrapper">
      <div ref="headLeftRef" class="head-left" @click="router.replace({ name: 'home' })">
        <div ref="logoWrapperRef" class="logo-wrapper">
          <i class="logo-box">
            <DragonBoatLogo></DragonBoatLogo>
          </i>
          <ElText>Dragon Boat</ElText>
        </div>
        <div v-show="!breadOverX" ref="breadWrapperRef" class="bread-wrapper">
          <el-divider direction="vertical" />
          <el-breadcrumb separator="/">
            <el-breadcrumb-item
              v-for="(p, index) in otherStore.getMatchedRoutesTitle"
              :key="index"
              >{{ p }}</el-breadcrumb-item
            >
          </el-breadcrumb>
        </div>
      </div>
      <div class="head-right">
        <div ref="infoIconsWrapperRef" class="info-icons-wrapper">
          <IconsOperationPanel
            v-show="!iconsOverX"
            :refresh="{
              switch: true,
              handler: [refreshHandler]
            }"
          >
            <el-icon icon><Bell /></el-icon>
            <el-icon @click="toggleFullScreen"
              ><FullScreen v-if="!isFullScreen"></FullScreen> <OffScreen v-else></OffScreen
            ></el-icon>
          </IconsOperationPanel>
          <div class="info">
            <el-divider direction="vertical" />
            <el-switch
              ref="switchRef"
              v-model="darkSwitch"
              :active-action-icon="Sunrise"
              :inactive-action-icon="MoonNight"
              :before-change="beforeChange"
            />
            <el-divider direction="vertical" />
            <i class="avatar">
              <Avatar></Avatar>
            </i>
            <ElText>{{ userStore.userInfo?.name }}</ElText>
            <el-popover
              ref="popoverRef"
              placement="bottom-end"
              trigger="click"
              :virtual-ref="buttonRef"
              :hide-after="0"
            >
              <template #reference>
                <div ref="buttonRef" v-click-outside="onClickOutside" style="margin: 0 10px">
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
                    <ElText>退出登录</ElText>
                  </li>
                </ul>
              </template>
            </el-popover>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import DragonBoatLogo from '@components/svgs/DragonBoatLogo2.vue'
import Avatar from '@components/svgs/Avatar.vue'
import { ArrowUpBold, ArrowDownBold } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'
import { useOtherStore } from '@/stores/other'
import { getCurrentInstance, onMounted, ref, onUnmounted, nextTick } from 'vue'
import { delItem, getItem } from '@/utils/localStorage'
import { LocalStorageKey } from '@/typings/enums'
import router from '@/router'
import { ClickOutside as vClickOutside, ElLoading, type SwitchInstance } from 'element-plus'
import IconsOperationPanel from './IconsOperationPanel.vue'
import { Sunrise, MoonNight } from '@element-plus/icons-vue'
import { darkTheme } from '@hooks/useDarkTheme'
import {
  judgeOverXByEls as judgeBreadOverX,
  removeObserver
} from '@/hooks/useJudgeIsOverflowXByels'
import { judgeOverXByEls as judgeIconsOverX } from '@/hooks/useJudgeIsOverflowXByels'
const iconsOverX = ref<boolean>(false)
const breadOverX = ref<boolean>(false)
let breadResizeObserver = null
let iconsResizeObserver = null
nextTick(() => {
  breadResizeObserver = judgeBreadOverX(
    headWrapperRef.value,
    [headLeftRef.value, infoIconsWrapperRef.value],
    breadOverX
  )
  iconsResizeObserver = judgeIconsOverX(
    headWrapperRef.value,
    [logoWrapperRef.value, infoIconsWrapperRef.value],
    iconsOverX
  )
})
const headWrapperRef = ref<HTMLElement>()
const headLeftRef = ref<HTMLElement>()
const breadWrapperRef = ref<HTMLElement>()
const infoIconsWrapperRef = ref<HTMLElement>()
const logoWrapperRef = ref<HTMLElement>()
const switchRef = ref<SwitchInstance>()
const beforeChange = async () => {
  await darkTheme(switchRef.value.$el)
  return true
}
const darkSwitch = ref(true)

const { $requests, $message } = getCurrentInstance()!.appContext.config.globalProperties
const userStore = useUserStore()
const otherStore = useOtherStore()
const isFullScreen = ref(false)
const refreshHandler = () => {
  router.go(0)
}
const toggleFullScreen = () => {
  if (!document.fullscreenElement) {
    //关闭全屏
    document.documentElement.requestFullscreen()
  } else {
    //全屏状态
    document.exitFullscreen()
  }
}
const onfullscreenchange = () => {
  if (!document.fullscreenElement) {
    //关闭全屏
    isFullScreen.value = false
  } else {
    //全屏状态
    isFullScreen.value = true
  }
}

document.addEventListener('fullscreenchange', onfullscreenchange)
//页面刷新的情况下
const getData = async () => {
  const loadingInstance = ElLoading.service({
    text: '正在初始化'
  })
  userStore.fetchUserInfo().finally(() => {
    setTimeout(() => {
      loadingInstance?.close()
    }, 1000)
  })
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
      userStore.$reset()
      $message.success(message)
      router.replace('/login')
    } else {
      $message.error(message)
    }
  } catch (error) {
    $message.error(error.message)
  }
}
onUnmounted(() => {
  document.removeEventListener('fullscreenchange', onfullscreenchange)
  removeObserver([...breadResizeObserver, ...iconsResizeObserver])
})
onMounted(() => {
  getData()
})
</script>

<style scoped>
.head {
  height: var(--main-head-height);
  width: 100%;
  display: flex;
  .head-wrapper {
    width: 100%;
    display: flex;
    .head-left {
      height: 100%;
      display: flex;
      align-items: center;
      color: rgba(0, 0, 0, 0.6);
      .logo-wrapper {
        display: flex;
        cursor: pointer;
        box-sizing: border-box;
        padding-left: var(--el-menu-base-level-padding);

        .logo-box {
          font-size: 32px;
          margin-right: 5px;
          display: flex;
          align-items: center;
        }
      }

      .bread-wrapper {
        height: 100%;
        display: flex;
        align-items: center;
      }
    }
    .head-right {
      width: 100%;
      display: flex;
      justify-content: flex-end;

      .info-icons-wrapper {
        display: flex;
        .info {
          display: flex;
          align-items: center;
          height: 100%;
          .avatar {
            font-size: 32px;
            display: flex;
            align-items: center;
            margin: 0 10px;
          }
        }
      }
    }
    .el-text {
      width: max-content;
      flex-shrink: 0;
    }
    .el-breadcrumb {
      width: max-content;
      flex-shrink: 0;
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
