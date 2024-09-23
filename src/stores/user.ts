import { LocalStorageKey } from '@/typings/enums'
import { TeamData } from '@/typings/team'
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUserStore = defineStore('user', () => {
  const token = ref('')
  const userInfo = ref<TeamData>()
  const setToken = (val: string) => {
    token.value = val
  }
  const setUserInfo = (val: TeamData) => {
    userInfo.value = val
  }
  const user = computed(() => userInfo.value)
  return { setToken, token, setUserInfo, user }
})
