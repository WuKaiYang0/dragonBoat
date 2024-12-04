import { LocalStorageKey } from '@/typings/enums'
import { UnitData } from '@/typings/unit'
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUnitStore = defineStore('unit', () => {
  const token = ref('')
  const unitInfo = ref<UnitData>()
  const setToken = (val: string) => {
    token.value = val
  }
  const setUnitInfo = (val: UnitData) => {
    unitInfo.value = val
  }
  const unit = computed(() => unitInfo.value)
  return { setToken, token, setUnitInfo, unit }
})
