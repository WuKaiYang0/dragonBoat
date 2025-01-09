import type { UnitTeamListData } from '@/typings/user/unit'
import { defineStore } from 'pinia'
import $requests from '@http/index'
import router from '@/router'
import { LocalStorageKey } from '@/typings/enums'
import { getItem } from '@/utils/localStorage'
import { toRefs } from 'vue'
import { ElMessage } from 'element-plus'

export const useTeamManagementStore = defineStore('teamManagement', {
  state: () => ({
    teamList: [] as UnitTeamListData['datas'],
    loading: true,
    currentPage: 1,
    pageSize: 10,
    totals: 0,
    search: ''
  }),
  actions: {
    async getUnitTeamList() {
      const token = getItem(LocalStorageKey.TOKEN)
      if (!token) {
        router.replace('/login')
        return
      }
      this.$state.loading = true
      try {
        const { search, currentPage, loading, pageSize, teamList, totals } = toRefs(this.$state)
        const res = await $requests.unitAPI.getUnitTeamList(token, {
          page: currentPage.value,
          pageSize: pageSize.value,
          name: search.value
        })
        const {
          data: { code, data, message }
        } = res
        if (code === 200) {
          loading.value = false
          totals.value = data.totals
          teamList.value = data.datas
        } else {
          loading.value = false
          ElMessage.error({
            message
          })
        }
      } catch (error) {
        ElMessage.error(error.message)
      }
    }
  }
})
