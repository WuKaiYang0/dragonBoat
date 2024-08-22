import { LocalStorageKey } from '@/typings/enums'
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUserStore = defineStore('user', () => {
  const token = ref('')
  const isCollapse = ref(false)
  const setToken = (val: string) => {
    token.value = val
  }
  const changeCollapse = () => {
    isCollapse.value = !isCollapse.value
  }
  const collapse = computed(() => isCollapse.value)
  return { setToken, token, changeCollapse, collapse }
})
