import router from '@/router'
import { LocalStorageKey } from '@/typings/enums'
import type { unit, referee } from '@/typings/user'
import { delItem, getItem } from '@/utils/localStorage'
import { defineStore } from 'pinia'
import $requests from '@http/index'
import { ElMessage as $message } from 'element-plus'
export const useUserStore = defineStore('user', {
  state: () => ({
    token: '' as string,
    userInfo: {} as unit.UnitData | referee.RefereeBaseInfo
  }),
  getters: {
    getUserInfo(state) {
      return state.userInfo
    }
  },
  actions: {
    setToken(token: string) {
      this.$state.token = token
    },
    setuserInfo(val: unit.UnitData) {
      this.$state.userInfo = val
    },
    async fetchUserInfo() {
      if (!this.$state.userInfo.id || !this.$state.token) {
        try {
          const token = getItem(LocalStorageKey.TOKEN)
          if (!token) {
            router.replace('/login')
            return
          }
          if (token) {
            const {
              data: { data, code, message }
            } = await $requests.unitAPI.getUserInfo(token)
            if (code == 200) {
              this.setuserInfo(data)
              return true
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
      } else {
        return true
      }
    },
    logoIn() {
      this
    }
  }
})
