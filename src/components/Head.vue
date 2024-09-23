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
        <span style="font-size: 15px">{{ userStore.user?.name }}</span>
        <el-icon><ArrowUpBold /></el-icon>
        <el-icon><ArrowDownBold /></el-icon>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import DragonBoatLogo from '@components/svgs/DragonBoatLogo.vue'
import Avatar from '@components/svgs/Avatar.vue'
import { Refresh, Bell, FullScreen, ArrowUpBold, ArrowDownBold } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'
import { useOtherStore } from '@/stores/other'
import { getCurrentInstance, onMounted, watch, ref } from 'vue'
import { delItem, getItem } from '@/utils/localStorage'
import { LocalStorageKey } from '@/typings/enums'
import router from '@/router'
const { $requests, $message } = getCurrentInstance().appContext.config.globalProperties
const userStore = useUserStore()
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
  console.log('@@@@')
  try {
    const token = getItem(LocalStorageKey.TOKEN)
    if (token) {
      const {
        data: { data, code, message }
      } = await $requests.teamAPI.getTeamInfo(token)
      if (code == 200) {
        userStore.setUserInfo(data)
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
</style>
