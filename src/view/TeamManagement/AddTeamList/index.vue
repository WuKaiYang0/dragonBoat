<template>
  <div class="team-list">
    <ElCard body-style="padding:0px;flex:1">
      <template #header>
        <div style="display: flex; justify-content: center">
          <el-input
            v-model="search"
            size="small"
            placeholder="模糊搜索"
            @change="searchChangeHandler"
          />
          <WrapperElButton
            btn-type="search"
            size="small"
            style="margin-left: 2px"
            @click="searchHandler"
            >查询</WrapperElButton
          >
          <WrapperElButton
            btn-type="plus"
            size="small"
            @click="addTeamListDialogVisible = !addTeamListDialogVisible"
            >新增</WrapperElButton
          >
        </div>
      </template>
      <ul v-loading="loading" style="height: 100%">
        <li
          v-for="(tl, index) in teamList"
          :key="index"
          :class="{ active: currentIndex === index }"
          @click="switchoverActive(index, tl)"
        >
          {{ tl.name }}<span style="font-size: 13px">(队伍名称)</span>
        </li>
      </ul>
      <template #footer>
        <div class="pagination-wrapper">
          <el-pagination
            v-model="currentPage"
            :page-size="pageSize"
            size="default"
            :background="false"
            layout="total,prev, pager, next"
            :total="totals"
            @update:current-page="onCurrentChange"
          >
          </el-pagination>
        </div>
      </template>
    </ElCard>
  </div>

  <el-dialog
    v-model="addTeamListDialogVisible"
    title="添加队列"
    width="500"
    align-center
    :before-close="addTeamListBeforeCloseHandler"
  >
    <ElForm ref="addTeamListFormRef" :model="addTeamListForm">
      <ElFormItem
        label="队伍名称"
        prop="name"
        :rules="[{ required: true, message: '请输入队伍名称', trigger: 'change' }]"
      >
        <ElInput v-model="addTeamListForm.name"></ElInput>
      </ElFormItem>
    </ElForm>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="clickCancel(Behaviour['add'])">取消</el-button>
        <el-button type="primary" @click="clickConfirm(Behaviour['add'])"> 确认 </el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
import router from '@/router'
import { useUserStore } from '@/stores/user'
import { LocalStorageKey } from '@/typings/enums'
import { getItem } from '@/utils/localStorage'
import { type DialogBeforeCloseFn, type FormInstance, vLoading } from 'element-plus'
import { getCurrentInstance, onMounted, ref, type PropType } from 'vue'
import type { UnitTeamListData } from '@/typings/user/unit'
import WrapperElButton from '@/components/WrapperElButton.vue'
const { $message, $requests } = getCurrentInstance().appContext.config.globalProperties
const teamListOne = defineModel({
  required: true,
  type: Object as PropType<UnitTeamListData['datas'][number]>
})
const loading = ref(true)
const search = ref('')
const currentPage = ref(1)
const pageSize = ref(5)
const totals = ref(0)
const onCurrentChange = (val: number) => {
  currentPage.value = val
  getUnitTeamList()
}
const teamList = ref<UnitTeamListData['datas']>([])
const updateTeamNameForm = ref<{ name: string; id: number }>({ name: '', id: null })
const userStore = useUserStore()
const searchChangeHandler = (val: string | number) => {
  if (val === '') {
    getUnitTeamList()
  }
}
const addTeamList = () => {
  addTeamListFormRef.value.validate(async (valid, fields) => {
    if (valid) {
      const token = getItem(LocalStorageKey.TOKEN)
      if (!token) {
        router.replace('/login')
        return
      }
      try {
        const {
          data: { code, message }
        } = await $requests.unitAPI.addTeamListByUnitId(token, {
          name: addTeamListForm.value.name,
          unitId: userStore.userInfo.id
        })
        if (code === 200) {
          getUnitTeamList()
          $message.success({ message: '添加成功' })
        } else {
          $message.warning({ message })
        }
        addTeamListDialogVisible.value = false
      } catch (error) {
        $message.error({ message: error.message })
      }
    } else {
      console.log('error submit!', fields)
    }
  })
}
const searchHandler = () => {
  getUnitTeamList()
}
const currentIndex = ref(0)
const switchoverActive = (index: number, tl: UnitTeamListData['datas'][number]) => {
  currentIndex.value = index
  teamListOne.value = tl
}
const updateTeamName = () => {
  updateTeamNameFormRef.value.validate(async (valid, fields) => {
    if (valid) {
      const token = getItem(LocalStorageKey.TOKEN)
      if (!token) {
        router.replace('/login')
        return
      }
      try {
        const res = await $requests.unitAPI.updateUnitTeamList(token, {
          id: updateTeamNameForm.value.id,
          name: updateTeamNameForm.value.name
        })
        const {
          data: { code }
        } = res
        if (code === 200) {
          $message.success({ message: '修改成功' })
          getUnitTeamList()
        } else {
          $message.error({ message: '修改失败' })
        }
        // updateTeamNameDialogVisible.value = false
      } catch (error) {
        $message.error({ message: error.message })
      }
    } else {
      console.log('error submit!', fields)
    }
  })
}
const clickConfirm = (order: Behaviour, id?: number) => {
  console.log(id)
  if (order === Behaviour['add']) {
    addTeamList()
  } else if (order === Behaviour['update']) {
    updateTeamName()
  }
}
enum Behaviour {
  add = '添加',
  update = '修改'
}
const clickCancel = (order: Behaviour) => {
  if (order === Behaviour['add']) {
    addTeamListFormRef.value.resetFields()
    addTeamListDialogVisible.value = false
  } else if (order === Behaviour['update']) {
    updateTeamNameFormRef.value.resetFields()
  }
}
const addTeamListForm = ref<{ name: string }>({ name: '' })
const addTeamListFormRef = ref<FormInstance>()
const updateTeamNameFormRef = ref<FormInstance>()
const addTeamListDialogVisible = ref(false)
const addTeamListBeforeCloseHandler: DialogBeforeCloseFn = (done) => {
  addTeamListFormRef.value.resetFields()
  done()
}
const getUnitTeamList = async () => {
  const token = getItem(LocalStorageKey.TOKEN)
  if (!token) {
    router.replace('/login')
    return
  }
  loading.value = true
  try {
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
      teamListOne.value = data.datas[0]
    } else {
      loading.value = false
      $message.error({
        message
      })
    }
  } catch (error) {
    $message.error(error.message)
  }
}
defineExpose({ getUnitTeamList })
onMounted(() => {
  getUnitTeamList()
})
</script>
<style scoped>
@import url(@styles/pagination.css);
.team-list {
  display: flex;
  .el-card {
    display: flex;
    flex-direction: column;
    ul {
      font-size: 14px;
      padding: 0 15px;
    }
    li {
      height: 37px;
      margin-bottom: 2px;
      padding: 0 10px;
      line-height: 37px;
      cursor: pointer;
      border-radius: 4px;
    }
    li.active {
      background-color: #e8f1ff;
      font-weight: bold;
      color: #1677ff;
    }
    li:not(.active):hover {
      background-color: #f5f5f5;
    }
    li.active:hover {
      background-color: #d0e4ff;
    }
    :deep(.el-card__header) {
      border-bottom: unset;
      padding-top: 15px;
    }
  }
}
</style>
