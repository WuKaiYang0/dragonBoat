<template>
  <div class="unit-team-members">
    <ElCard ref="unitTeamMembers_elcard" body-style="flex:1">
      <el-table
        v-loading="membersTableLoading"
        :data="teamListMembers"
        style="width: 100%; height: 100%"
        :max-height="maxHeight"
      >
        <el-table-column type="expand">
          <template #default="{ row }">
            <ElCard shadow="always">
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
                <!-- <el-descriptions-item label="生日" align="center">
                      {{ row.birthday }}
                    </el-descriptions-item> -->
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
            </ElCard>
          </template>
        </el-table-column>
        <el-table-column label="姓名" prop="name" />
        <el-table-column label="岗位">
          <template #default="{ row }">
            {{ athletesType.find((item) => item.id === row.type)?.typeName }}
          </template>
        </el-table-column>
        <el-table-column label="" prop="">
          <template #default="{ row }">
            <WrapperElButton
              style="width: max-content"
              size="small"
              btn-type="edit"
              @click="editMemberHandler(row)"
              >编辑</WrapperElButton
            >
            <!-- <WrapperElButton
              style="width: max-content"
              :icon="Edit"
              size="small"
              :color="getColor(WhatColor.ThemeColor)"
              :border-color="getColor(WhatColor.ThemeColor)"
              @click="editMemberHandler(row)"
              >编辑</WrapperElButton
            > -->
            <WrapperElButton
              style="width: max-content"
              btn-type="del"
              size="small"
              @click="deleteTeamName(row)"
              >删除</WrapperElButton
            >
            <!-- <WrapperElButton
              style="width: max-content"
              :icon="Delete"
              size="small"
              :color="getColor(WhatColor.DeleteColor)"
              :border-color="getColor(WhatColor.DeleteColor)"
              @click="deleteTeamName(row)"
              >删除</WrapperElButton
            > -->
          </template>
        </el-table-column>
      </el-table>
      <template #footer>
        <div class="pagination-wrapper">
          <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :page-sizes="[5, 10, 15]"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totals"
            size="default"
            @size-change="onSizeChange"
            @current-change="onCurrentChange"
          >
          </el-pagination>
        </div>
      </template>
      <!-- <span style="padding-left: 12px">队伍名称：</span> -->
      <!-- <el-table :data="calMemberForm" style="width: 100%">
          <el-table-column fixed prop="name" label="姓名" width="80" />
          <el-table-column prop="typeName" label="岗位" width="80" />
          <el-table-column prop="photo" label="照片" width="80">
            <template #default="scope">
              <img :src="scope.row.photo" alt="图片" style="width: 50px; height: 50px" />
            </template>
          </el-table-column>
          <el-table-column prop="genderName" label="性别" width="60" />
          <el-table-column prop="birthday" label="生日" width="120" />
          <el-table-column prop="age" label="年龄" width="60" />
          <el-table-column prop="phone" label="联系电话" width="120" />
          <el-table-column prop="documentNumber" label="证件号码" />
          <el-table-column prop="coatSize" label="上衣尺码" width="80" />
          <el-table-column prop="trousersSize" label="裤子尺码" width="80" />
          <el-table-column width="210px" fixed="right">
            <template #header>
              <el-input v-model="search" size="small" placeholder="姓名.." />
            </template>
            <template #default="scope">
              <el-button type="primary" size="small" @click="memberCheck(scope.$index, scope.row)">
                查看
              </el-button>
              <el-button type="warning" size="small" @click="memberEdit(scope.$index, scope.row)">
                编辑
              </el-button>
              <el-button size="small" type="danger" @click="memberDelete(scope.$index, scope.row)">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table> -->
      <!-- <el-divider content-position="center" style="width: 30%; margin: 30px auto">
        <el-button
          size="small"
          style="float: right; color: #ffffff"
          @click="onAddNewMemberHandler"
          color="#409eff"
          :dark="true"
        >
          添加成员
          <el-icon><CirclePlus /></el-icon>
        </el-button>
      </el-divider> -->
      <!-- <el-collapse v-model="activeIndex" @change="handleChange" ref="collapseRef" accordion>
        <el-collapse-item
          v-for="(t, i) in team"
          :name="`${i}`"
          :class="{ 'box-shadow': i === 0 ? true : false }"
        >
          <template #title>
            <span style="padding-left: 12px">队伍名称：</span>
            <el-input
              v-model="t.n"
              style="width: 240px"
              size="small"
              placeholder="Please Input"
              v-if="t.isUpdateName"
              @click.stop=""
            />
            <span style="padding-left: 12px; font-weight: bolder; font-size: 14px" v-else>{{
              t.n
            }}</span>
            <el-icon
              v-if="!t.isUpdateName"
              size="16"
              style="margin-left: 5px"
              @click.stop="t.isUpdateName = !t.isUpdateName"
              ><Edit
            /></el-icon>
            <div v-else style="margin-left: 5px; line-height: 100%">
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
            </div>
          </template>
          <template #default>
            <el-table :data="calMemberForm" style="width: 100%">
              <el-table-column fixed prop="name" label="姓名" width="80" />
              <el-table-column prop="typeName" label="岗位" width="80" />
              <el-table-column prop="photo" label="照片" width="80">
                <template #default="scope">
                  <img :src="scope.row.photo" alt="图片" style="width: 50px; height: 50px" />
                </template>
              </el-table-column>
              <el-table-column prop="genderName" label="性别" width="60" />
              <el-table-column prop="birthday" label="生日" width="120" />
              <el-table-column prop="age" label="年龄" width="60" />
              <el-table-column prop="phone" label="联系电话" width="120" />
              <el-table-column prop="documentNumber" label="证件号码" />
              <el-table-column prop="coatSize" label="上衣尺码" width="80" />
              <el-table-column prop="trousersSize" label="裤子尺码" width="80" />
              <el-table-column width="210px" fixed="right">
                <template #header>
                  <el-input v-model="search" size="small" placeholder="姓名.." />
                </template>
                <template #default="scope">
                  <el-button
                    type="primary"
                    size="small"
                    @click="memberCheck(scope.$index, scope.row)"
                  >
                    查看
                  </el-button>
                  <el-button
                    type="warning"
                    size="small"
                    @click="memberEdit(scope.$index, scope.row)"
                  >
                    编辑
                  </el-button>
                  <el-button
                    size="small"
                    type="danger"
                    @click="memberDelete(scope.$index, scope.row)"
                  >
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-divider content-position="center" style="width: 30%; margin: 30px auto">
              <el-button
                size="small"
                style="float: right; color: #ffffff"
                @click="onAddNewMemberHandler"
                color="#409eff"
                :dark="true"
              >
                添加成员
                <el-icon><CirclePlus /></el-icon>
              </el-button>
            </el-divider>

            <el-dialog
              title="编辑成员信息"
              :visible.sync="memberDialogVisible"
              :before-close="resetModifyMemberForm"
              destroy-on-close
              center
            >
              <el-form
                ref="modifyMemberForm"
                :model="modifyMemberForm"
                :rules="editMemberFormRules"
                label-position="left"
                label-width="80px"
              >
                <el-form-item label="照片" prop="fileList">
                  <UploadImage :file-list.sync="modifyMemberForm.fileList" />
                </el-form-item>
                <el-form-item label="姓名" prop="name">
                  <el-input v-model="modifyMemberForm.name" />
                </el-form-item>
                <el-form-item label="性别" prop="gender">
                  <el-radio-group v-model="modifyMemberForm.gender">
                    <el-radio label="0"> 男 </el-radio>
                    <el-radio label="1"> 女 </el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="类型" prop="type">
                  <el-radio-group v-model="modifyMemberForm.type">
                    <el-radio :label="0"> 领队 </el-radio>
                    <el-radio :label="1"> 教练 </el-radio>
                    <el-radio :label="2"> 鼓手 </el-radio>
                    <el-radio :label="3"> 舵手 </el-radio>
                    <el-radio :label="4"> 划手 </el-radio>
                    <el-radio :label="5"> 锣手 </el-radio>
                    <el-radio :label="6"> 替补 </el-radio>
                    <el-radio :label="7"> 队医 </el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="生日" prop="birthday">
                  <el-date-picker
                    v-model="modifyMemberForm.birthday"
                    type="date"
                    placeholder="出生日期"
                    value-format="yyyy-MM-dd"
                  />
                </el-form-item>
                <el-form-item label="联系电话" prop="phone">
                  <el-input v-model="modifyMemberForm.phone" />
                </el-form-item>
                <el-form-item label="证件号码" prop="documentNumber">
                  <el-input v-model="modifyMemberForm.idCard" />
                </el-form-item>
                <el-form-item label="上衣尺码" prop="coatSize">
                  <el-input v-model="modifyMemberForm.coatSize" />
                </el-form-item>
                <el-form-item label="裤子尺码" prop="trousersSize">
                  <el-input v-model="modifyMemberForm.trousersSize" />
                </el-form-item>
              </el-form>
              <span slot="footer" class="dialog-footer">
                <el-button @click="unmodifyMemberMsg">取 消</el-button>
                <el-button type="primary" @click="modifyMemberMsg">确 定</el-button>
              </span>
            </el-dialog>
            <el-dialog :visible.sync="checkMemberDialogFormVisible" destroy-on-close center>
              <MemberDetail :member-info="modifyMemberForm" />
            </el-dialog>
          </template>
          <template #icon="{ isActive }">
            <span class="icon-ele">
              {{ isActive ? 'Expanded' : 'Collapsed' }}
            </span>
          </template>
        </el-collapse-item>
      </el-collapse> -->
    </ElCard>
  </div>
  <el-dialog
    title="编辑成员"
    :model-value="editMemberDialogFormVisible"
    :before-close="resetEditMemberForm"
    destroy-on-close
    center
    width="30%"
    top="5vh"
  >
    <el-form
      ref="editMemberFormRef"
      :model="editMemberForm"
      :rules="editMemberFormRules"
      label-width="80px"
    >
      <!-- <el-form-item label="照片" prop="fileList">
          <UploadImage v-model:file-list="editMemberForm.fileList" />
        </el-form-item> -->
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
</template>
<script setup lang="ts">
import { type TeamMember, type UnitTeamListData } from '@/typings/user/unit'
import { type CardInstance, type FormRules, type FormInstance, ElMessageBox } from 'element-plus'
import {
  getCurrentInstance,
  nextTick,
  onMounted,
  onUnmounted,
  type PropType,
  ref,
  watch
} from 'vue'
import { outputAgeAndBirthdayByIdCard } from '@/utils/common'
import { LocalStorageKey } from '@/typings/enums'
import { getItem } from '@/utils/localStorage'
import router from '@/router'
import type { DataInAthletesType } from '@/typings/common'
import WrapperElButton from '@/components/WrapperElButton.vue'
const { $message, $requests } = getCurrentInstance().appContext.config.globalProperties
const onSizeChange = (val: number) => {
  pageSize.value = val
  getTeamMembers()
}
const onCurrentChange = (val: number) => {
  currentPage.value = val
  getTeamMembers()
}
const editMemberHandler = (memberInfo: TeamMember) => {
  editMemberDialogFormVisible.value = true
  Object.assign(editMemberForm.value, memberInfo)
}
const deleteTeamName = (memberInfo: TeamMember) => {
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
const currentPage = ref(1)
const pageSize = ref(5)
const totals = ref(0)
const teamListMembers = ref<TeamMember[]>([])
const membersTableLoading = ref(true)
const maxHeight = ref(0)
const unitTeamMembers_elcard = ref<CardInstance>()
const props = defineProps({
  nationType: {
    required: true,
    type: Array as PropType<{ value: number; label: string }[]>
  },
  teamListOne: {
    required: true,
    type: Object as PropType<UnitTeamListData['datas'][number]>,
    default: () => ({})
  },
  searchTeamName: {
    required: true,
    type: String
  },
  athletesType: {
    required: true,
    type: Array as PropType<DataInAthletesType[]>
  },
  athletesTypeId: {
    required: true,
    type: Number,
    default: -1
  }
})
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
}
const resetModifyMemberForm = () => {
  editMemberDialogFormVisible.value = !editMemberDialogFormVisible.value
  editMemberFormRef.value.resetFields()
}
const setHeight = () => {
  maxHeight.value = unitTeamMembers_elcard.value.$el.children[0].offsetHeight - 50
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
const unEditNewMember = () => resetModifyMemberForm()
const getTeamMembers = async () => {
  membersTableLoading.value = true
  const token = getItem(LocalStorageKey.TOKEN)
  if (!token) {
    router.replace('/login')
    return
  }
  const res = await $requests.unitAPI.getUnitTeamMemberQueryMember(token, {
    page: currentPage.value,
    pageSize: pageSize.value,
    teamId: props.teamListOne.id,
    name: props.searchTeamName
  })
  const {
    data: { code, data }
  } = res
  if (code === 200) {
    membersTableLoading.value = false
    teamListMembers.value = data.datas
    totals.value = data.totals
  }
}
const searchTeamMember = () => {
  getTeamMembers().then(() => {
    if (props.athletesTypeId !== -1) {
      teamListMembers.value = teamListMembers.value.filter(
        (item) => item.type === props.athletesTypeId
      )
    }
  })
}
watch(
  () => props.teamListOne,
  () => {
    getTeamMembers().catch((err) => {
      $message.error(err.message)
    })
  }
)
defineExpose({ getTeamMembers, searchTeamMember })
onMounted(async () => {
  window.addEventListener('resize', setHeight)
})
onUnmounted(() => {
  window.removeEventListener('resize', setHeight)
})
nextTick(() => {
  setHeight()
})
</script>
<style scoped>
@import url(@styles/pagination.css);
.unit-team-members {
  flex-grow: 1;
  display: flex;
  width: 100%;
  .el-card {
    display: flex;
    flex-direction: column;
    width: 100%;
    :deep(td) {
      padding: 15px 10px;
    }
  }
  :deep(.el-table__inner-wrapper)::before {
    content: unset;
  }
}
.dialog-footer {
  display: flex;
  justify-content: center;
}
</style>
