<template>
  <div class="unit-team" ref="unitTeamRef">
    <AddTeamList ref="AddTeamListRef" v-model="teamListOne"></AddTeamList>
    <div class="unit-team-wrapper">
      <ElCard>
        <div style="display: flex; align-items: center; gap: 5px">
          <el-input
            v-model="t.n"
            style="width: 240px"
            size="small"
            placeholder="Please Input"
            v-if="t.isUpdateName"
            @click.stop=""
          />
          <span style="font-weight: bolder; font-size: 14px" v-else>{{ teamListOne?.name }}</span>
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
                  :label="a.typeName"
                  :value="a.id"
                  :key="a.id"
                />
              </el-select>
            </div>
            <div
              class="search-grid-items"
              style="flex: 1; display: flex; justify-content: flex-start"
            >
              <!-- <el-button plain :icon="RefreshRight">重置</el-button> -->
              <WrapperElButton size="default" :icon="Search" @click="searchTeamMembersHandler">
                查询
              </WrapperElButton>
              <WrapperElButton
                size="default"
                :icon="Plus"
                :color="getColor(WhatColor.ThemeColor)"
                :border-color="getColor(WhatColor.ThemeColor)"
                @click="newMemberDialogFormVisible = true"
              >
                添加
              </WrapperElButton>
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
              <el-radio :value="t.id" v-for="t in athletesType"> {{ t.typeName }} </el-radio>
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
        <div slot="footer" class="dialog-footer">
          <el-button @click="unaddNewMember"> 取 消 </el-button>
          <el-button type="primary" @click="addNewMember"> 确 定 </el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getCurrentInstance, ref, watch } from 'vue'
import { type FormInstance, type FormRules, type ColInstance, ElMessageBox } from 'element-plus'
import type { TeamMember, UnitTeamListData } from '@/typings/user/unit'
import { Edit, Check, Close, Search, Plus } from '@element-plus/icons-vue'
import { getItem } from '@/utils/localStorage'
import { LocalStorageKey, WhatColor } from '@/typings/enums'
import router from '@/router'
import { getColor, outputAgeAndBirthdayByIdCard } from '@/utils/common'
import WrapperElButton from '@/components/WrapperElButton.vue'
import AddTeamList from './AddTeamList/index.vue'
import AddTeamMember from './AddTeamMember/index.vue'
import type { DataInAthletesType } from '@/typings/common'
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

const collapseRef = ref<ColInstance>()
const activeIndex = ['0']
const handleChange = (activeIndex: string | undefined) => {
  const children = Array.from((collapseRef.value.$el as HTMLElement).children)
  const e = children.find((ele) => ele.classList.contains('box-shadow'))
  Promise.resolve().then(() => e.classList.remove('box-shadow'))
  if (activeIndex && Number(activeIndex) >= 0) {
    const ele = children[Number(activeIndex)]
    Promise.resolve().then(() => ele.classList.add('box-shadow'))
  }
}
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
const teamFormRules = {
  name: { required: true, message: '请填写队伍名称' },
  address: { required: true, message: '请填写联系地址' },
  email: [
    { required: true, message: '请填写联系地址' },
    { type: 'email', message: '邮箱格式错误', trigger: 'blur' }
  ],
  intro: { required: true, message: '请填写队伍介绍' },
  phone: [
    { required: true, message: '请填写联系号码', trigger: 'blur' },
    { min: 10, max: 11, message: '号码长度在10或11位', trigger: 'blur' }
  ],
  situation: { required: true, message: '请填写参赛成绩和队伍训练情况' },
  unit: { required: true, message: '请填写所属单位' }
}
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
    .catch((err) => {})
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
const nationType = [
  {
    value: 0,
    label: '汉族'
  },
  {
    value: 1,
    label: '蒙古族'
  },
  {
    value: 2,
    label: '回族'
  },
  {
    value: 3,
    label: '藏族'
  },
  {
    value: 4,
    label: '维吾尔族'
  },
  {
    value: 5,
    label: '苗族'
  },
  {
    value: 6,
    label: '彝族'
  },
  {
    value: 7,
    label: '壮族'
  },
  {
    value: 8,
    label: '布依族'
  },
  {
    value: 9,
    label: '朝鲜族'
  },
  {
    value: 10,
    label: '满族'
  },
  {
    value: 11,
    label: '侗族'
  },
  {
    value: 12,
    label: '瑶族'
  },
  {
    value: 13,
    label: '白族'
  },
  {
    value: 14,
    label: '土家族'
  },
  {
    value: 15,
    label: '哈尼族'
  },
  {
    value: 16,
    label: '哈萨克族'
  },
  {
    value: 17,
    label: '傣族'
  },
  {
    value: 18,
    label: '黎族'
  },
  {
    value: 19,
    label: '傈僳族'
  },
  {
    value: 20,
    label: '佤族'
  },
  {
    value: 21,
    label: '畲族'
  },
  {
    value: 22,
    label: '高山族'
  },
  {
    value: 23,
    label: '拉祜族'
  },
  {
    value: 24,
    label: '水族'
  },
  {
    value: 25,
    label: '东乡族'
  },
  {
    value: 26,
    label: '纳西族'
  },
  {
    value: 27,
    label: '景颇族'
  },
  {
    value: 28,
    label: '柯尔克孜族'
  },
  {
    value: 29,
    label: '土族'
  },
  {
    value: 30,
    label: '达斡尔族'
  },
  {
    value: 31,
    label: '仫佬族'
  },
  {
    value: 32,
    label: '羌族'
  },
  {
    value: 33,
    label: ' 布朗族'
  },
  {
    value: 34,
    label: ' 撒拉族'
  },
  {
    value: 35,
    label: ' 毛难族'
  },
  {
    value: 36,
    label: ' 仡佬族'
  },
  {
    value: 37,
    label: ' 锡伯族'
  },
  {
    value: 38,
    label: ' 阿昌族'
  },
  {
    value: 39,
    label: ' 普米族'
  },
  {
    value: 40,
    label: ' 塔吉克族'
  },
  {
    value: 41,
    label: ' 怒族'
  },
  {
    value: 42,
    label: ' 乌孜别克族'
  },
  {
    value: 43,
    label: ' 俄罗斯族'
  },
  {
    value: 44,
    label: ' 鄂温克族'
  },
  {
    value: 45,
    label: ' 崩龙族'
  },
  {
    value: 46,
    label: ' 保安族'
  },
  {
    value: 47,
    label: ' 裕固族'
  },
  {
    value: 48,
    label: ' 京族'
  },
  {
    value: 49,
    label: ' 塔塔尔族'
  },
  {
    value: 50,
    label: ' 独龙族'
  },
  {
    value: 51,
    label: ' 鄂伦春族'
  },
  {
    value: 52,
    label: ' 赫哲族'
  },
  {
    value: 53,
    label: ' 门巴族'
  },
  {
    value: 54,
    label: ' 珞巴族'
  },
  {
    value: 55,
    label: ' 基诺族'
  },
  {
    value: 56,
    label: ' 其他'
  }
]
const getMemberType = async () => {
  athletesLoading.value = true
  const token = getItem(LocalStorageKey.TOKEN)
  if (!token) {
    router.replace('/login')
    return
  }
  const res = await $requests.commonAPI.getUnitTeamMemberType(token)
  const {
    data: { code, data, message }
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
      background: #fafafc !important;
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
