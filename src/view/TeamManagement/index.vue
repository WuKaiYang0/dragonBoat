<template>
  <div ref="unitTeamRef" class="unit-team">
    <AddTeamList ref="AddTeamListRef" v-model="teamListOne"></AddTeamList>
    <div class="unit-team-wrapper">
      <ElCard>
        <div style="display: flex; align-items: center; gap: 5px">
          <el-input
            v-if="t.isUpdateName"
            v-model="t.n"
            style="width: 240px"
            size="small"
            placeholder="Please Input"
            @click.stop=""
          />
          <span v-else style="font-weight: bolder; font-size: 14px">{{ teamListOne?.name }}</span>
          <template v-if="!t.isUpdateName">
            <ElTooltip content="编辑队伍名" placement="top">
              <el-icon size="16" style="" @click.stop="t.isUpdateName = !t.isUpdateName"
                ><Edit
              /></el-icon>
            </ElTooltip>
          </template>
          <template v-else>
            <el-icon
              size="16"
              style="margin-left: 5px; color: #67c23a"
              @click.stop="confirmUpdateTeamName(t)"
              ><Check
            /></el-icon>
            <el-icon
              size="16"
              style="margin-left: 5px; color: #f56c6c"
              @click.stop="cancelUpdateTeamName(t, t.lastName)"
              ><Close
            /></el-icon>
          </template>
          <ElTooltip content="删除队伍" placement="top">
            <el-icon v-if="!t.isUpdateName" @click="deleteTeamName"><DeleteFilled /></el-icon>
          </ElTooltip>
        </div>
      </ElCard>
      <ElCard>
        <template #default>
          <div class="search-grid">
            <div class="search-grid-items">
              <label class="search-grid-items-text">姓名</label>
              <el-input
                v-model="searchTeamName"
                size="default"
                placeholder="请输入姓名"
                @blur="searchTeamMembersHandler"
              />
            </div>
            <div class="search-grid-items">
              <label class="search-grid-items-text">岗位</label>
              <el-select
                v-model="athletesTypeId"
                placeholder="请选择岗位"
                size="default"
                :loading="athletesLoading"
                clearable
              >
                <el-option
                  v-for="a in athletesType"
                  :key="a.id"
                  :label="a.typeName"
                  :value="a.id"
                />
              </el-select>
            </div>
            <div
              class="search-grid-items"
              style="flex: 1; display: flex; justify-content: flex-start"
            >
              <!-- <el-button plain :icon="RefreshRight">重置</el-button> -->
              <!-- <WrapperElButton size="default" :icon="Search" @click="searchTeamMembersHandler">
                查询
              </WrapperElButton> -->
              <WrapperElButton btn-type="search" size="default" @click="searchTeamMembersHandler">
                查询
              </WrapperElButton>
              <WrapperElButton
                btn-type="plus"
                size="default"
                @click="newMemberDialogFormVisible = true"
              >
                添加
              </WrapperElButton>
              <!-- <WrapperElButton
                size="default"
                :icon="Plus"
                :color="getColor(WhatColor.ThemeColor)"
                :border-color="getColor(WhatColor.ThemeColor)"
                @click="newMemberDialogFormVisible = true"
              >
                添加
              </WrapperElButton> -->
            </div>
          </div>
        </template>
      </ElCard>
      <AddTeamMember
        ref="AddTeamMemberRef"
        :nation-type="nationType"
        :search-team-name="searchTeamName"
        :team-list-one="teamListOne"
        :athletes-type="athletesType"
        :athletes-type-id="athletesTypeId"
      ></AddTeamMember>
      <el-dialog
        title="添加新成员"
        :model-value="newMemberDialogFormVisible"
        :before-close="resetNewMemberForm"
        destroy-on-close
        center
        width="30%"
        top="5vh"
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
            <el-button @click="unaddNewMember"> 取 消 </el-button>
            <el-button type="primary" @click="addNewMember"> 确 定 </el-button>
          </div>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getCurrentInstance, ref, watch } from 'vue'
import { type FormInstance, type FormRules, ElMessageBox } from 'element-plus'
import type { TeamMember, UnitTeamListData } from '@/typings/user/unit'
import { Edit, Check, Close } from '@element-plus/icons-vue'
import { getItem } from '@/utils/localStorage'
import { LocalStorageKey } from '@/typings/enums'
import router from '@/router'
import { outputAgeAndBirthdayByIdCard } from '@/utils/common'
import WrapperElButton from '@/components/WrapperElButton.vue'
import AddTeamList from './AddTeamList/index.vue'
import AddTeamMember from './AddTeamMember/index.vue'
import type { DataInAthletesType } from '@/typings/common'
import nationType from './nation.json'
const { $message, $requests } = getCurrentInstance().appContext.config.globalProperties
const athletesType = ref<DataInAthletesType[]>([])
const searchTeamName = ref('')
const athletesTypeId = ref()
const teamListOne = ref<UnitTeamListData['datas'][number]>()
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
const AddTeamListRef = ref<InstanceType<typeof AddTeamList>>()
const AddTeamMemberRef = ref<InstanceType<typeof AddTeamMember>>()
const unitTeamRef = ref<HTMLDivElement>()

const searchTeamMembersHandler = () => {
  AddTeamMemberRef.value.searchTeamMember()
}
watch(teamListOne, (newVal) => {
  t.value.n = newVal.name
  t.value.lastName = t.value.n
  getMemberType().catch((err) => {
    $message.error(err.message)
  })
  // Promise.all([getMemberType(), AddTeamMemberRef.value.getTeamMembers()]).catch((err) => {
  //   $message.error(err.message)
  // })
})
const t = ref({
  n: '',
  newMemberForm: newMemberForm.value,
  isUpdateName: false,
  lastName: ''
})

const athletesLoading = ref(true)

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
const newMemberDialogFormVisible = ref(false)

const resetModifyMemberForm = () => {
  newMemberFormRef.value.resetFields()
  newMemberDialogFormVisible.value = !newMemberDialogFormVisible.value
}
const confirmUpdateTeamName = async (o: { isUpdateName: boolean; n: string; lastName: string }) => {
  const token = getItem(LocalStorageKey.TOKEN)
  if (!token) {
    router.replace('/login')
    return
  }
  const res = await $requests.unitAPI.updateUnitTeamName(token, {
    id: teamListOne.value.id,
    name: o.n
  })
  const {
    data: { code, message }
  } = res
  if (code === 200) {
    AddTeamListRef.value.getUnitTeamList()
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
  ElMessageBox.confirm(`你确认要删除该队伍“${teamListOne.value.name}”吗`, '警告', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      const res = await $requests.unitAPI.deleteUnitTeamList(token, teamListOne.value.id)
      const {
        data: { code, message }
      } = res
      if (code === 200) {
        AddTeamListRef.value.getUnitTeamList()
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
const addNewMember = async () => {
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
          teamId: teamListOne.value.id,
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
          AddTeamMemberRef.value.getTeamMembers()
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
const unaddNewMember = () => resetModifyMemberForm()
const resetNewMemberForm = () => {
  newMemberFormRef.value.resetFields()
  newMemberDialogFormVisible.value = !newMemberDialogFormVisible.value
}
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
// onBeforeRouteLeave((to, from, next) => {
//   setTimeout(() => {
//     next((vm)=>{})
//   }, 500)
// })
</script>
<style scoped>
.unit-team {
  display: flex;
  flex: 1;
  gap: 10px;
  .unit-team-wrapper {
    display: flex;
    flex-direction: column;
    gap: 10px;
    flex-grow: 1;
    overflow: hidden;
    :deep(th) {
      /* background: #fafafc !important; */
      background: #f7f7f7 !important;
      font-weight: 600;
      color: #313437;
    }
    .dialog-footer {
      display: flex;
      justify-content: center;
    }
    .icon-ele {
      margin: 0 8px 0 auto;
      color: #409eff;
    }
    .box-shadow {
      box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.3);
    }

    .cell-item {
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .search-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(min(100% - 2rem, 240px), 1fr));
      gap: 20px;
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
        }
      }
      label {
        color: #606266;
        font-size: 14px;
        margin-right: 10px;
      }
    }
  }
}
</style>
