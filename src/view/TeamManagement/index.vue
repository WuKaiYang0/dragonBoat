<template>
  <TreeTable
    ref="treeTableRef"
    v-model:model-value="datas"
    :loading="membersTableLoading"
    :table-source="tableSource"
    :tree-source="treeSource"
    @change:data-of-table="getTeamMembers"
    @update:data-of-table:current-page="(val: number) => (tableSource.currentPage = val)"
    @update:data-of-table:page-size="(val: number) => (tableSource.pageSize = val)"
    @change:data-of-tree="getUnitTeamList"
    @update:data-of-tree:current-page="(val: number) => (teamManagementStore.currentPage = val)"
    @update:data-of-tree:page-size="(val: number) => (teamManagementStore.pageSize = val)"
  >
    <template #tree-header>
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
          theme="water"
          @click="searchHandler"
          >查询</WrapperElButton
        >
      </div>
      <div style="margin-top: 10px">
        <WrapperElButton
          btn-type="plus"
          size="small"
          theme="blueberry"
          @click="addHandler(Behaviour.add)"
          >新建</WrapperElButton
        >
        <WrapperElButton
          btn-type="edit"
          theme="orange"
          size="small"
          @click="editHandler(Behaviour.update)"
          >修改</WrapperElButton
        >
        <WrapperElButton btn-type="del" size="small" theme="rose" @click="deleteTeamName"
          >删除</WrapperElButton
        >
      </div>
    </template>
    <template #tree-default>
      <el-dialog
        v-model="teamListDialogVisible"
        :title="teamListDialogTitle"
        align-center
        :before-close="teamListBeforeCloseHandler"
      >
        <ElForm ref="teamListFormRef" :model="teamListForm">
          <ElFormItem
            label="队伍名称"
            prop="name"
            :rules="[{ required: true, message: '请输入队伍名称', trigger: 'change' }]"
          >
            <ElInput v-model="teamListForm.name"></ElInput>
          </ElFormItem>
        </ElForm>
        <template #footer>
          <div class="dialog-footer">
            <el-button @click="clickCancel()">取消</el-button>
            <el-button type="primary" @click="clickConfirm()"> 确认 </el-button>
          </div>
        </template>
      </el-dialog>
    </template>
    <template #table-header>
      <div class="search-grid">
        <div class="search-grid-items">
          <label class="search-grid-items-text">姓名</label>
          <el-input
            v-model="searchTeamName"
            :size="size"
            placeholder="请输入姓名"
            clearable
            @blur="searchTeamMembersHandler"
          />
        </div>
        <div class="search-grid-items">
          <label class="search-grid-items-text">岗位</label>
          <el-select
            v-model="athletesTypeId"
            placeholder="请选择岗位"
            :size="size"
            :loading="athletesLoading"
            clearable
          >
            <el-option v-for="a in athletesType" :key="a.id" :label="a.typeName" :value="a.id" />
          </el-select>
        </div>
        <div class="search-grid-items" style="flex: 1; display: flex; justify-content: flex-start">
          <!-- <ElButton @click="show = !show">adawdwa</ElButton> -->
          <AleftFadeTransition>
            <WrapperElButton btn-type="search" :size="size" theme="water" @click="searchTeamMember">
              查询
            </WrapperElButton>
          </AleftFadeTransition>
          <WrapperElButton
            btn-type="plus"
            theme="blueberry"
            :size="size"
            @click="newMemberDialogFormVisible = true"
          >
            新建
          </WrapperElButton>
        </div>
      </div>
    </template>
    <template #table-operation-icons>
      <div style="display: flex; justify-content: flex-end">
        <IconsOperationPanel
          :refresh="{ switch: true, handler: [getTeamMembers] }"
          :second-full-screen="{
            switch: true,
            handler: [
              treeTableRef?.rightTableRef?.foldAllExpandedRows,
              treeTableRef?.rightTableRef?.setHeight
            ],
            $el: treeTableRef?.rightTableRef?.rightTable_elcard?.$el
          }"
        ></IconsOperationPanel>
      </div>
    </template>
    <template #table>
      <el-table-column type="expand" label="展开">
        <template #default="{ row }">
          <el-descriptions border size="small">
            <el-descriptions-item :rowspan="2" :width="140" label="照片" align="center">
              <el-image style="width: 100px; height: 100px" :src="row.photo" />
            </el-descriptions-item>
            <el-descriptions-item label="姓名" align="center">
              <template #label>
                <div class="cell-item">
                  <el-icon style="margin-right: 5px">
                    <user />
                  </el-icon>
                  姓名
                </div>
              </template>
              {{ row.name }}
            </el-descriptions-item>
            <el-descriptions-item label="联系电话" align="center">
              <template #label>
                <div class="cell-item">
                  <el-icon style="margin-right: 5px">
                    <iphone />
                  </el-icon>
                  联系电话
                </div>
              </template>
              {{ row.phone }}</el-descriptions-item
            >
            <el-descriptions-item label="性别" align="center">
              {{ row.gender === 0 ? '男' : '女' }}
            </el-descriptions-item>
            <el-descriptions-item label="年龄" align="center">
              {{ row.age }}
            </el-descriptions-item>
            <el-descriptions-item label="民族" align="center">
              {{ nationType.find((item) => item.value === row.nation)?.label }}
            </el-descriptions-item>
            <el-descriptions-item label="上衣尺码" align="center">
              <el-tag size="small">{{ row.coatSize }}</el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="裤子尺码" align="center">
              <el-tag size="small">{{ row.trousersSize }}</el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="证件号码" align="center">
              {{ row.idCard }}
            </el-descriptions-item>
          </el-descriptions>
        </template>
      </el-table-column>
      <el-table-column label="姓名" prop="name" align="center">
        <template #header>
          <div class="table-header-label">
            <span class="label">姓名</span>
          </div>
        </template>
        <template #default="{ row }">
          {{ row.name }}
        </template>
      </el-table-column>
      <el-table-column label="性别" prop="gender" align="center">
        <template #header>
          <div class="table-header-label">
            <!-- <el-divider direction="vertical" /> -->
            <span class="label">性别</span>
          </div>
        </template>
        <template #default="{ row }">
          {{ row.gender === 0 ? '男' : '女' }}
        </template>
      </el-table-column>
      <el-table-column label="岗位" align="center">
        <template #default="{ row }">
          {{ athletesType.find((item) => item.id === row.type)?.typeName }}
        </template>
        <template #header>
          <div class="table-header-label">
            <span class="label">岗位</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" prop="" align="center">
        <template #default="{ row }">
          <WrapperElButton
            btn-type="link"
            theme="blueberry"
            size="default"
            @click="editMemberHandler(row)"
            >修改</WrapperElButton
          >
          <el-divider direction="vertical" />
          <WrapperElButton
            style="width: max-content"
            btn-type="link"
            size="default"
            theme="rose"
            @click="deleteTeamMember(row)"
            >删除</WrapperElButton
          >
        </template>
        <template #header>
          <div class="table-header-label">
            <!-- <el-divider direction="vertical" /> -->
            <span class="label">操作</span>
          </div>
        </template>
      </el-table-column>
    </template>
    <template #table-default>
      <el-dialog
        title="编辑成员"
        :model-value="editMemberDialogFormVisible"
        :before-close="resetEditMemberForm"
        destroy-on-close
        center
        :append-to-body="true"
      >
        <el-form
          ref="editMemberFormRef"
          :model="editMemberForm"
          :rules="editMemberFormRules"
          label-width="80px"
        >
          <el-form-item label="姓名" prop="name">
            <el-input v-model="editMemberForm.name" style="width: 100%" />
          </el-form-item>
          <el-form-item label="性别" prop="gender">
            <el-radio-group v-model="editMemberForm.gender">
              <el-radio :value="0"> 男 </el-radio>
              <el-radio :value="1"> 女 </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="类型" prop="type">
            <el-radio-group v-model="editMemberForm.type">
              <el-radio v-for="t in athletesType" :key="t.id" :value="t.id">
                {{ t.typeName }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="民族" prop="nation">
            <el-select-v2
              v-model="editMemberForm.nation"
              :options="nationType"
              placeholder="选择民族"
              style="width: 100%; vertical-align: middle"
              clearable
            />
          </el-form-item>
          <el-form-item label="上衣尺码" prop="coatSize">
            <el-select-v2
              v-model="editMemberForm.coatSize"
              :options="[
                { value: 'S', label: 'S' },
                { value: 'M', label: 'M' },
                { value: 'L', label: 'L' },
                { value: 'XL', label: 'XL' },
                { value: 'XXL', label: 'XXL' }
              ]"
              placeholder="选择尺码"
              style="width: 100%; vertical-align: middle"
              clearable
            />
          </el-form-item>
          <el-form-item label="裤子尺码" prop="trousersSize">
            <el-select-v2
              v-model="editMemberForm.trousersSize"
              :options="[
                { value: 'S', label: 'S' },
                { value: 'M', label: 'M' },
                { value: 'L', label: 'L' },
                { value: 'XL', label: 'XL' },
                { value: 'XXL', label: 'XXL' }
              ]"
              placeholder="选择尺码"
              style="width: 100%; vertical-align: middle"
              clearable
            />
          </el-form-item>
          <el-form-item label="联系电话" prop="phone">
            <el-input v-model="editMemberForm.phone" style="width: 100%" />
          </el-form-item>
          <el-form-item label="证件号码" prop="idCard">
            <el-input v-model.trim="editMemberForm.idCard" style="width: 100%" />
          </el-form-item>
        </el-form>
        <template #footer>
          <div class="dialog-footer">
            <el-button @click="unEditNewMember"> 取 消 </el-button>
            <el-button type="primary" @click="editNewMember"> 确 定 </el-button>
          </div>
        </template>
      </el-dialog>
      <el-dialog
        title="添加新成员"
        :model-value="newMemberDialogFormVisible"
        :before-close="resetAppendMemberForm"
        destroy-on-close
        :append-to-body="true"
        center
      >
        <el-form
          ref="newMemberFormRef"
          :model="newMemberForm"
          :rules="newMemberFormRules"
          label-width="80px"
        >
          <!-- <el-form-item label="照片" prop="fileList">
          <UploadImage v-model:file-list="newMemberForm.fileList" />
        </el-form-item> -->
          <el-form-item label="姓名" prop="name">
            <el-input v-model="newMemberForm.name" style="width: 100%" />
          </el-form-item>
          <el-form-item label="性别" prop="gender">
            <el-radio-group v-model="newMemberForm.gender">
              <el-radio :value="0"> 男 </el-radio>
              <el-radio :value="1"> 女 </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="类型" prop="type">
            <el-radio-group v-model="newMemberForm.type">
              <el-radio v-for="at in athletesType" :key="at.id" :value="at.id">
                {{ at.typeName }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="民族" prop="nation">
            <el-select-v2
              v-model="newMemberForm.nation"
              :options="nationType"
              placeholder="选择民族"
              style="width: 100%; vertical-align: middle"
              clearable
            />
          </el-form-item>
          <el-form-item label="上衣尺码" prop="coatSize">
            <el-select-v2
              v-model="newMemberForm.coatSize"
              :options="[
                { value: 'S', label: 'S' },
                { value: 'M', label: 'M' },
                { value: 'L', label: 'L' },
                { value: 'XL', label: 'XL' },
                { value: 'XXL', label: 'XXL' }
              ]"
              placeholder="选择尺码"
              style="width: 100%; vertical-align: middle"
              clearable
            />
          </el-form-item>
          <el-form-item label="裤子尺码" prop="trousersSize">
            <el-select-v2
              v-model="newMemberForm.trousersSize"
              :options="[
                { value: 'S', label: 'S' },
                { value: 'M', label: 'M' },
                { value: 'L', label: 'L' },
                { value: 'XL', label: 'XL' },
                { value: 'XXL', label: 'XXL' }
              ]"
              placeholder="选择尺码"
              style="width: 100%; vertical-align: middle"
              clearable
            />
          </el-form-item>
          <el-form-item label="联系电话" prop="phone">
            <el-input v-model="newMemberForm.phone" style="width: 100%" />
          </el-form-item>
          <el-form-item label="证件号码" prop="idCard">
            <el-input v-model.trim="newMemberForm.idCard" style="width: 100%" />
          </el-form-item>
        </el-form>
        <template #footer>
          <div class="dialog-footer">
            <el-button @click="unAppendNewMember"> 取 消 </el-button>
            <el-button type="primary" @click="appendNewMember"> 确 定 </el-button>
          </div>
        </template>
      </el-dialog>
    </template>
  </TreeTable>
</template>

<script setup lang="ts">
import router from '@/router'
import TreeTable from '@/components/TreeTable/index.vue'

import { useUserStore } from '@/stores/user'
import { LocalStorageKey } from '@/typings/enums'
import { getItem } from '@/utils/localStorage'
import {
  type DialogBeforeCloseFn,
  ElMessageBox,
  type FormInstance,
  type FormRules
} from 'element-plus'
import { getCurrentInstance, inject, onMounted, ref, watch, type PropType } from 'vue'
import type { TeamMember, UnitTeamListData } from '@/typings/user/unit'
import WrapperElButton from '@/components/WrapperElButton.vue'
import { storeToRefs } from 'pinia'
import { useTeamManagementStore } from '@/stores/teamManagement'
import AleftFadeTransition from '@/components/transition/AleftFadeTransition.vue'
import { outputAgeAndBirthdayByIdCard } from '@/utils/common'
import type { DataInAthletesType } from '@/typings/common'
import nationType from './nation.json'
import IconsOperationPanel from '@/components/IconsOperationPanel.vue'
const { $message, $requests } = getCurrentInstance().appContext.config.globalProperties
const teamManagementStore = useTeamManagementStore()
const {
  currentPage,
  pageSize,
  search,
  teamList,
  totals: teamListTotals
} = storeToRefs(teamManagementStore)
const getUnitTeamList = teamManagementStore.getUnitTeamList
const tableSource = ref({
  paginationTotals: 0,
  dataOfTable: [] as TeamMember[],
  currentPage: 1,
  pageSize: 5,
  pageSizes: [5, 10, 15]
})
const treeSource = ref({
  paginationTotals: teamListTotals.value,
  dataOfTree: teamList.value,
  currentPage: currentPage.value,
  pageSize: pageSize.value,
  pageSizes: [5, 10, 15]
})
const datas = ref<{ oneInData: UnitTeamListData['datas'][number]; maxHeight: number }>({
  oneInData: {
    name: '',
    id: 0,
    unitId: 0,
    createTime: '',
    updateTime: '',
    deleted: 0
  },
  maxHeight: 0
})
const teamListDialogTitle = ref('')
// const onCurrentChange = (val: number) => {
//   currentPage.value = val
//   getUnitTeamList()
// }
const updateTeamNameForm = ref<{ name: string; id: number }>({ name: '', id: null })
const userStore = useUserStore()
const searchChangeHandler = (val: string | number) => {
  if (val === '') {
    getUnitTeamList()
  }
}
const addTeamList = () => {
  teamListFormRef.value.validate(async (valid, fields) => {
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
          name: teamListForm.value.name,
          unitId: userStore.userInfo.id
        })
        if (code === 200) {
          getUnitTeamList()
          $message.success({ message: '添加成功' })
        } else {
          $message.warning({ message })
        }
        teamListDialogVisible.value = false
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
let verifyTeamFunc: () => void = null
const editHandler = (order: Behaviour) => {
  teamListDialogTitle.value = `${order}队列`
  Object.assign(teamListForm.value, datas.value.oneInData)
  teamListDialogVisible.value = !teamListDialogVisible.value
  verifyTeamFunc = updateTeamName
}
const addHandler = (order: Behaviour) => {
  teamListDialogTitle.value = `${order}队列`
  teamListDialogVisible.value = !teamListDialogVisible.value
  verifyTeamFunc = addTeamList
}
const updateTeamName = () => {
  teamListFormRef.value.validate(async (valid, fields) => {
    if (valid) {
      Object.assign(updateTeamNameForm.value, teamListForm.value)
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
      } catch (error) {
        $message.error({ message: error.message })
      } finally {
        teamListDialogVisible.value = !teamListDialogVisible.value
      }
    } else {
      console.log('error submit!', fields)
    }
  })
}

const clickConfirm = () => {
  verifyTeamFunc && verifyTeamFunc()
}
enum Behaviour {
  add = '添加',
  update = '修改'
}
const clickCancel = () => {
  teamListFormRef.value.resetFields()
  teamListDialogVisible.value = false
  verifyTeamFunc = null
}
const teamListForm = ref<{ name: string }>({ name: '' })
const teamListFormRef = ref<FormInstance>()
const teamListDialogVisible = ref(false)
const teamListBeforeCloseHandler: DialogBeforeCloseFn = (done) => {
  teamListFormRef.value.resetFields()
  done()
}
onMounted(() => {
  getUnitTeamList()
})
const treeTableRef = ref<InstanceType<typeof TreeTable>>()

const size: 'small' | 'default' | 'large' = 'small'
const confirmUpdateTeamName = async (o: { isUpdateName: boolean; n: string; lastName: string }) => {
  const token = getItem(LocalStorageKey.TOKEN)
  if (!token) {
    router.replace('/login')
    return
  }
  const res = await $requests.unitAPI.updateUnitTeamName(token, {
    id: datas.value.oneInData.id,
    name: o.n
  })
  const {
    data: { code, message }
  } = res
  if (code === 200) {
    getUnitTeamList()
    $message.success({ message })
  }
  o.isUpdateName = !o.isUpdateName
}
const cancelUpdateTeamName = (o: { isUpdateName: boolean; n: string }, lastName: string) => {
  o.n = lastName
  o.isUpdateName = !o.isUpdateName
}
const deleteTeamName = () => {
  const token = getItem(LocalStorageKey.TOKEN)
  if (!token) {
    router.replace('/login')
    return
  }
  ElMessageBox.confirm(`你确认要删除该队伍“${datas.value.oneInData.name}”吗`, '警告', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      const res = await $requests.unitAPI.deleteUnitTeamList(token, datas.value.oneInData.id)
      const {
        data: { code, message }
      } = res
      if (code === 200) {
        getUnitTeamList()
        $message({
          type: 'success',
          message: '删除成功'
        })
      } else {
        $message({
          type: 'error',
          message
        })
      }
    })
    .catch(() => {})
}
const athletesType = ref<DataInAthletesType[]>([])
const athletesTypeId = ref()
const searchTeamName = ref('')
const newMemberDialogFormVisible = ref(false)
const newMemberFormRef = ref<FormInstance>()
const newMemberFormRules = {
  name: [
    {
      min: 2,
      message: '姓名至少2个字',
      required: true,
      trigger: 'blur'
    }
  ],
  gender: {
    required: true,
    message: '请选择性别'
  },
  type: {
    required: true,
    message: '请填写选手类型'
  },
  birthday: {
    required: true,
    message: '请填写出生日期'
  },
  nation: {
    required: true,
    message: '请选择民族'
  },
  phone: [{ required: true, message: '请填写联系号码', trigger: 'blur' }],
  idCard: [
    {
      required: true,
      message: '请填写身份证号码',
      trigger: 'blur'
    },
    {
      min: 18,
      max: 18,
      message: '请输入正确的18位身份证',
      trigger: 'blur'
    }
  ],
  coatSize: {
    required: true,
    message: '请填写上衣大小'
  },
  trousersSize: {
    required: true,
    message: '请填写裤子大小'
  }
  // fileList: {
  //   type: 'array',
  //   required: true,
  //   message: '请上传照片',
  //   trigger: 'change'
  // }
} as FormRules<TeamMember>
const newMemberForm = ref<TeamMember>({
  id: 0,
  teamId: 0,
  name: '',
  gender: 0,
  nation: 0,
  age: 0,
  birthday: '',
  phone: '',
  idCard: '',
  type: 0,
  coatSize: '',
  trousersSize: '',
  photo: ''
})
const t = ref({
  n: '',
  newMemberForm: newMemberForm.value,
  isUpdateName: false,
  lastName: ''
})
const appendNewMember = async () => {
  const token = getItem(LocalStorageKey.TOKEN)
  if (!token) {
    router.replace('/login')
    return
  }
  newMemberFormRef.value.validate(async (vaild) => {
    if (vaild) {
      const { age, birthday } = outputAgeAndBirthdayByIdCard(newMemberForm.value.idCard, '-')
      try {
        const token = getItem(LocalStorageKey.TOKEN)
        if (!token) {
          router.replace('/login')
          return
        }
        const res = await $requests.unitAPI.addUnitTeamMember(token, {
          age,
          birthday,
          coatSize: newMemberForm.value.coatSize,
          gender: Number(newMemberForm.value.gender),
          idCard: newMemberForm.value.idCard.toUpperCase(),
          name: newMemberForm.value.name,
          nation: Number(newMemberForm.value.nation),
          phone: newMemberForm.value.phone,
          photo: `https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png`,
          teamId: datas.value.oneInData.id,
          trousersSize: newMemberForm.value.trousersSize,
          type: Number(newMemberForm.value.type)
        })
        const {
          data: { code, message }
        } = res
        if (code === 200) {
          newMemberDialogFormVisible.value = false
          newMemberFormRef.value.resetFields()
          $message.success(message)
          getTeamMembers()
        } else {
          $message.error(message)
        }
      } catch (error) {
        $message.error(error.message)
      }
    }
  })
  // const res = await $requests.unitAPI.addUnitTeamMemberAddMember(token, newMemberForm.value)
}
const unAppendNewMember = () => resetAppendMemberForm()
const searchTeamMembersHandler = () => {
  if (searchTeamName.value) {
    searchTeamMember()
  }
}
const athletesLoading = ref(true)
const getMemberType = async () => {
  athletesLoading.value = true
  const token = getItem(LocalStorageKey.TOKEN)
  if (!token) {
    router.replace('/login')
    return
  }
  const res = await $requests.commonAPI.getUnitTeamMemberType(token)
  const {
    data: { code, data }
  } = res
  if (code === 200) {
    athletesType.value = data
    athletesLoading.value = false
  }
}
const editMemberHandler = (memberInfo: TeamMember) => {
  editMemberDialogFormVisible.value = true
  Object.assign(editMemberForm.value, memberInfo)
}
const deleteTeamMember = (memberInfo: TeamMember) => {
  const token = getItem(LocalStorageKey.TOKEN)
  if (!token) {
    router.replace('/login')
    return
  }
  ElMessageBox.confirm(`你确认要删除该成员“${memberInfo.name}”吗`, '警告', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      const res = await $requests.unitAPI.deleteUnitTeamMember(token, memberInfo.id)
      const {
        data: { code, message }
      } = res
      if (code === 200) {
        getTeamMembers()
        $message({
          type: 'success',
          message: '删除成功'
        })
      } else {
        $message({
          type: 'error',
          message
        })
      }
    })
    .catch(() => {})
}
const editMemberFormRef = ref<FormInstance>()
const membersTableLoading = ref(true)
const editMemberForm = ref<TeamMember>({
  photo: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
  name: '',
  gender: -1,
  type: -1,
  birthday: '',
  nation: -1,
  phone: '',
  idCard: '',
  coatSize: '',
  trousersSize: '',
  teamId: -1,
  age: -1,
  id: -1
})

const editMemberDialogFormVisible = ref(false)
const resetEditMemberForm = () => {
  editMemberDialogFormVisible.value = !editMemberDialogFormVisible.value
  editMemberFormRef.value.resetFields()
}
const resetAppendMemberForm = () => {
  newMemberDialogFormVisible.value = !newMemberDialogFormVisible.value
  newMemberFormRef.value.resetFields()
}

const editMemberFormRules = {
  name: [
    {
      min: 2,
      message: '姓名至少2个字',
      required: true,
      trigger: 'blur'
    }
  ],
  gender: {
    required: true,
    message: '请选择性别'
  },
  type: {
    required: true,
    message: '请填写选手类型'
  },
  birthday: {
    required: true,
    message: '请填写出生日期'
  },
  nation: {
    required: true,
    message: '请选择民族'
  },
  phone: [{ required: true, message: '请填写联系号码', trigger: 'blur' }],
  idCard: [
    {
      required: true,
      message: '请填写身份证号码',
      trigger: 'blur'
    },
    {
      min: 18,
      max: 18,
      message: '请输入正确的18位身份证',
      trigger: 'blur'
    }
  ],
  coatSize: {
    required: true,
    message: '请填写上衣大小'
  },
  trousersSize: {
    required: true,
    message: '请填写裤子大小'
  }
} as FormRules<TeamMember>
const editNewMember = async () => {
  const token = getItem(LocalStorageKey.TOKEN)
  if (!token) {
    router.replace('/login')
    return
  }
  editMemberFormRef.value.validate(async (vaild) => {
    if (vaild) {
      try {
        const token = getItem(LocalStorageKey.TOKEN)
        if (!token) {
          router.replace('/login')
          return
        }
        const { age, birthday } = outputAgeAndBirthdayByIdCard(editMemberForm.value.idCard, '-')
        const res = await $requests.unitAPI.updateUnitTeamMember(token, {
          age,
          birthday,
          coatSize: editMemberForm.value.coatSize,
          gender: Number(editMemberForm.value.gender),
          idCard: editMemberForm.value.idCard,
          name: editMemberForm.value.name,
          nation: Number(editMemberForm.value.nation),
          phone: editMemberForm.value.phone,
          photo: editMemberForm.value.photo,
          teamId: Number(editMemberForm.value.teamId),
          trousersSize: editMemberForm.value.trousersSize,
          type: Number(editMemberForm.value.type),
          id: Number(editMemberForm.value.id)
        })
        const {
          data: { code, message }
        } = res
        if (code === 200) {
          getTeamMembers()
          $message.success(message)
        } else {
          $message.error(message)
        }
        resetEditMemberForm()
      } catch (error) {
        $message.error(error.message)
      }
    }
  })
}
const unEditNewMember = () => resetEditMemberForm()
const getTeamMembers = async () => {
  membersTableLoading.value = true
  const token = getItem(LocalStorageKey.TOKEN)
  if (!token) {
    router.replace('/login')
    return
  }
  const res = await $requests.unitAPI.getUnitTeamMemberQueryMember(token, {
    page: tableSource.value.currentPage,
    pageSize: tableSource.value.pageSize,
    teamId: datas.value.oneInData.id,
    name: searchTeamName.value
  })
  const {
    data: { code, data }
  } = res
  if (code === 200) {
    membersTableLoading.value = false
    tableSource.value.dataOfTable = data.datas
    tableSource.value.paginationTotals = data.totals
  }
}
const searchTeamMember = () => {
  getTeamMembers().then(() => {
    if (athletesTypeId.value) {
      tableSource.value.dataOfTable = tableSource.value.dataOfTable.filter(
        (item) => item.type === athletesTypeId.value
      )
    }
  })
}
watch(
  () => datas.value.oneInData,
  (newVal) => {
    t.value.n = newVal.name
    t.value.lastName = t.value.n
    getMemberType().catch((err) => {
      $message.error(err.message)
    })
    getTeamMembers().catch((err) => {
      $message.error(err.message)
    })
  }
)
watch(teamList, () => {
  datas.value.oneInData = teamList.value[0]
  treeSource.value.dataOfTree = teamList.value
  treeSource.value.paginationTotals = teamListTotals.value
})
</script>
<style scoped>
@import url(@styles/pagination.css);
.dialog-footer {
  display: flex;
  justify-content: center;
}
.search-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100% - 2rem, 240px), 1fr));
  gap: 10px;
  /* padding: 0 20px; */
  :deep(.el-date-editor.el-input__wrapper) {
    width: auto !important;
  }
  .search-grid-items {
    display: flex;
    align-items: center;
    .search-grid-items-text {
      width: max-content;
      word-break: keep-all;
      color: rgb(0 0 0 / 88%);
    }
  }
  label {
    color: #606266;
    font-size: 14px;
    margin-right: 10px;
  }
}
.cell-item {
  display: flex;
  align-items: center;
  justify-content: center;
}
.el-divider--vertical {
}
:deep(.el-table__inner-wrapper)::before {
  content: unset;
}
.dialog-footer {
  display: flex;
  justify-content: center;
}
</style>
