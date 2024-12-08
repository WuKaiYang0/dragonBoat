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
            size="small"
            plain
            :icon="Search"
            style="margin-left: 2px"
            @click="searchHandler"
            >查询</WrapperElButton
          >
          <WrapperElButton
            size="small"
            plain
            :icon="Plus"
            :border-color="getColor(WhatColor.ThemeColor)"
            :color="getColor(WhatColor.ThemeColor)"
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
          <!-- <div style="display: flex; align-items: center; gap: 5px">
            <el-input
              v-model="t.n"
              style="width: 240px"
              size="small"
              placeholder="Please Input"
              v-if="t.isUpdateName"
              @click.stop=""
            />
            <span style="font-weight: bolder; font-size: 14px" v-else>{{ t.n }}</span>
          </div> -->
          {{ tl.name }}<span style="font-size: 13px">(队伍名称)</span>
        </li>
      </ul>
      <template #footer>
        <!-- <el-pagination
          :modelValue:current-page="currentPage"
          :page-size="pageSize"
          size="small"
          :background="false"
          layout="total, prev, pager, next"
          :total="totals"
          @update:current-page="onCurrentChange"
        >
        </el-pagination> -->
        <!-- <WrapperElPagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 30]"
          size="small"
          :layout="'total, prev, pager, next'"
          :total="totals"
          @update:current-page="onCurrentChange"
        ></WrapperElPagination> -->
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
    <ElForm :model="addTeamListForm" ref="addTeamListFormRef">
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
import WrapperElPagination from '@/components/WrapperElPagination.vue'
import router from '@/router'
import { useUserStore } from '@/stores/user'
import { LocalStorageKey, WhatColor } from '@/typings/enums'
import { getItem } from '@/utils/localStorage'
import { type DialogBeforeCloseFn, type FormInstance, vLoading } from 'element-plus'
import { getCurrentInstance, onMounted, type PropType, ref, watch } from 'vue'
import { Search, Plus } from '@element-plus/icons-vue'
import type { UnitTeamListData } from '@/typings/user/unit'
import { getColor } from '@/utils/common'
const { $message, $requests } = getCurrentInstance().appContext.config.globalProperties
const teamListOne = defineModel({
  required: true
})
// defineProps({
//   teamListOne: {
//     type: Object as PropType<UnitTeamListData['datas'][number]>,
//     required: true
//   }
// })
// defineEmits()
// const teamListOne = defineModel<UnitTeamListData['datas'][number]>({ required: true })
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

// const teamList = ref<{ name: string }[]>([{ name: '1' }, { name: '1' }])

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
          data: { code, data, message }
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
          data: { code, message }
        } = res
        if (code === 200) {
          $message.success({ message: '修改成功' })
          getUnitTeamList()
        } else {
          $message.error({ message: '修改失败' })
        }
        // updateTeamNameDialogVisible.value = false
      } catch (error) {
        $message.error({ message: '出错' })
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
  } catch (error) {}
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
  }
  li {
    height: 40px;
    margin-bottom: 5px;
    padding: 0 20px;
    line-height: 40px;
    cursor: pointer;
  }
  li.active {
    background-color: #e8f1ff;
    font-weight: 700;
    color: #1677ff;
  }
}
</style>
