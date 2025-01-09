<template>
  <div class="competition-list">
    <ElCard style="height: 100%" body-style="padding:0px;flex:1" shadow="never">
      <template #header>
        <div class="operation">
          <div class="search-box">
            <el-input
              v-model="search"
              size="default"
              placeholder="模糊搜索"
              @change="searchChangeHandler"
            />
            <WrapperElButton btn-type="search" size="default" theme="water" @click="searchHandler"
              >查询</WrapperElButton
            >
          </div>
          <div class="btns">
            <WrapperElButton btn-type="plus" size="default" theme="blueberry" @click="newHandler"
              >新建</WrapperElButton
            >
            <WrapperElButton
              btn-type="edit"
              theme="orange"
              size="default"
              :border-color="'#faad14'"
              :color="'#faad14'"
              @click="editHandler"
              >修改</WrapperElButton
            >
            <WrapperElButton btn-type="del" size="default" theme="rose" @click="deleteComp"
              >删除</WrapperElButton
            >
          </div>
        </div>
      </template>
      <template #default>
        <div class="list">
          <ul v-loading="loading" style="height: 100%">
            <li
              v-for="(comp, index) in competitionInfoData"
              :key="index"
              :class="{ active: currentIndex === index }"
              @click="switchoverActive(index, comp)"
            >
              {{ comp.name }}<span style="font-size: 13px"></span>
            </li>
          </ul>
        </div>
      </template>
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
    <el-dialog
      v-model="addCompetitionListDialogVisible"
      title="举报大赛"
      width="500"
      align-center
      :before-close="addCompetitionListBeforeCloseHandler"
    >
      <ElForm
        ref="addCompetitionListFormRef"
        :model="addCompetitionListForm"
        label-position="left"
        label-width="auto"
      >
        <div style="display: flex; gap: 20px">
          <div style="flex: 1">
            <ElFormItem
              label="大赛名称"
              label-position="top"
              prop="name"
              :rules="[{ required: true, message: '请填写大赛名称', trigger: 'change' }]"
            >
              <ElInput v-model="addCompetitionListForm.name"></ElInput>
            </ElFormItem>
            <ElFormItem
              label="比赛地区"
              label-position="top"
              prop="location"
              :rules="[{ required: true, message: '请选择举办地点', trigger: 'change' }]"
            >
              <ElInput v-model="addCompetitionListForm.location"></ElInput>
              <!-- <div style="display: flex; flex-wrap: wrap; gap: 5px">
                <ElCascader
                  ref="elCascaderRef"
                  :options="regions"
                  @update:model-value="
                    ($event) =>
                      (addCompetitionListForm.location = elCascaderRef.presentText
                        .split(' / ')
                        .join(''))
                  "
                  placeholder="请选择省市区"
                  size="default"
                  style="width: 100%"
                />
                <ElInput
                  size="default"
                  v-model:model-value="detailAddress"
                  placeholder="详细地址"
                  :disabled="addCompetitionListForm.location ? false : true"
                  @input="
                    ($event) => {
                      addCompetitionListForm.location =
                        elCascaderRef.presentText.split(' / ').join('') + $event
                      return $event
                    }
                  "
                ></ElInput>
              </div> -->
            </ElFormItem>
          </div>

          <ElFormItem style="width: 33%" label="宣传照片" label-position="top" prop="photo">
            <el-upload
              class="avatar-uploader"
              :show-file-list="true"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
              :auto-upload="false"
            >
              <img v-if="imageUrl" :src="imageUrl" class="avatar" />
              <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
            </el-upload>
          </ElFormItem>
        </div>
        <ElFormItem
          label="比赛起止日期"
          prop="startDate"
          :rules="[{ required: true, message: '请选择日期', trigger: 'change' }]"
        >
          <el-date-picker
            v-model="startAndEndDate"
            type="daterange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-value="[new Date(), new Date()]"
            @update:model-value="
              ($event) => {
                startAndEndDate = $event.map((d) => dayjs(d).format('YYYY-MM-DD hh:mm:ss'))
                addCompetitionListForm.startDate = startAndEndDate[0]
                addCompetitionListForm.endDate = startAndEndDate[1]
                return startAndEndDate
              }
            "
          />
        </ElFormItem>
        <ElFormItem
          label="报名截止日期"
          prop="name"
          :rules="[{ required: true, message: '请选择日期', trigger: 'change' }]"
        >
          <el-date-picker
            v-model="addCompetitionListForm.deadline"
            type="date"
            placeholder="请选择日期"
            :shortcuts="shortcuts"
            style="width: 100%"
            @update:model-value="
              ($event) =>
                (addCompetitionListForm.deadline = dayjs($event).format('YYYY-MM-DD hh:mm:ss'))
            "
          />
        </ElFormItem>
        <ElFormItem
          label="大赛简介"
          prop="introduction"
          :rules="[{ required: true, message: '请描述大赛简介', trigger: 'change' }]"
        >
          <el-input
            v-model="addCompetitionListForm.introduction"
            :autosize="{ minRows: 3, maxRows: 5 }"
            type="textarea"
            placeholder="大赛简介"
          />
        </ElFormItem>
      </ElForm>
      <template #footer>
        <div class="dialog-footer">
          <WrapperElButton btn-type="cancel" size="default" theme="water" @click="cancelHandler"
            >取消</WrapperElButton
          >
          <WrapperElButton
            btn-type="confirm"
            theme="blueberry"
            size="default"
            :background-color="getColor(WhatColor.ThemeColor)"
            :color="getColor(WhatColor.WhiteColor)"
            @click="confirmHandler"
            >{{ addOrEdit === 'add' ? '举办' : '修改' }}</WrapperElButton
          >
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import WrapperElButton from '@/components/WrapperElButton.vue'
import { dayjs, type DialogBeforeCloseFn, type FormInstance, ElMessageBox } from 'element-plus'
import { getCurrentInstance, onMounted, ref, watch, type PropType } from 'vue'
import { LocalStorageKey, WhatColor } from '@typings/enums/index'
import { getColor } from '@utils/common'
import { Plus } from '@element-plus/icons-vue'
import logo from '../../../../public/statics/logo.png'
import type { UploadProps } from 'element-plus'
import { getItem } from '@/utils/localStorage'
import router from '@/router'
import type { CompetitionInfoData, CreateCompetitionData } from '@/typings/common'
const { $message, $requests } = getCurrentInstance().appContext.config.globalProperties
const loading = ref(true)
const competitionInfoData = ref<CompetitionInfoData[]>([])
const search = ref('')
const currentPage = ref(1)
const pageSize = ref(5)
const totals = ref(0)
const onCurrentChange = (val: number) => {
  currentPage.value = val
}
const addOrEdit = ref<'add' | 'edit'>('add')
const compListOne = defineModel({ required: true, type: Object as PropType<CompetitionInfoData> })
const currentIndex = ref(0)
const addCompetitionListDialogVisible = ref(false)
// const addCompetitionListForm = ref<{ name: string }>({ name: '' })
const addCompetitionListFormRef = ref<FormInstance>()
const addCompetitionListBeforeCloseHandler: DialogBeforeCloseFn = (done) => {
  addCompetitionListFormRef.value.resetFields()
  done()
}
const startAndEndDate = ref([])
const detailAddress = ref('')
const addCompetitionListForm = ref<CreateCompetitionData>({
  name: '',
  startDate: '',
  endDate: '',
  location: '',
  deadline: '',
  introduction: '',
  photo: ''
})
const cancelHandler = () => {
  addCompetitionListDialogVisible.value = false
  addCompetitionListFormRef.value.resetFields()
}
const confirmHandler = () => {
  const token = getItem(LocalStorageKey.TOKEN)
  if (!token) {
    router.replace({ name: 'Login' })
    return
  }
  addCompetitionListFormRef.value.validate(async (isVaild) => {
    if (isVaild) {
      try {
        const res = await $requests.commonAPI.postCompetitionCreateCom(
          token,
          addCompetitionListForm.value
        )
        const {
          data: { message, code }
        } = res
        if (code === 200) {
          $message.success(message)
          getData()
          addCompetitionListDialogVisible.value = false
        } else {
          $message.error(message)
        }
      } catch (error) {
        $message.error(error.message)
      }
    }
  })
  // addCompetitionListDialogVisible.value = false
  // addCompetitionListFormRef.value.resetFields()
  console.log(addCompetitionListForm.value)
}
const newHandler = () => {
  addOrEdit.value = 'add'
  addCompetitionListDialogVisible.value = true
}
const editHandler = () => {
  addOrEdit.value = 'edit'
  startAndEndDate.value = [compListOne.value.startDate, compListOne.value.endDate]
  Object.assign(addCompetitionListForm.value, compListOne.value)
  addCompetitionListDialogVisible.value = true
}
watch(
  () => addCompetitionListForm.value.location,
  (newV) => {
    if (!newV) {
      detailAddress.value = ''
    }
  }
)
const searchChangeHandler = () => {
  if (!search.value) {
    getData()
  }
}
const searchHandler = () => {
  getData()
}
const switchoverActive = (index: number, comp: CompetitionInfoData) => {
  currentIndex.value = index
  compListOne.value = comp
}
const shortcuts = [
  {
    text: 'Today',
    value: new Date()
  },
  {
    text: 'Yesterday',
    value: () => {
      const date = new Date()
      date.setTime(date.getTime() - 3600 * 1000 * 24)
      return date
    }
  },
  {
    text: 'A week ago',
    value: () => {
      const date = new Date()
      date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
      return date
    }
  }
]

const imageUrl = ref(logo)

const handleAvatarSuccess: UploadProps['onSuccess'] = (response, uploadFile) => {
  imageUrl.value = URL.createObjectURL(uploadFile.raw!)
}

const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  if (rawFile.type !== 'image/jpeg') {
    // ElMessage.error('Avatar picture must be JPG format!')
    return false
  } else if (rawFile.size / 1024 / 1024 > 2) {
    // ElMessage.error('Avatar picture size can not exceed 2MB!')
    return false
  }
  return true
}
const getData = async () => {
  try {
    const token = getItem(LocalStorageKey.TOKEN)
    if (!token) {
      router.replace({ name: 'Login' })
      return
    }
    loading.value = true
    const res = await $requests.commonAPI.getCompetitionQueryCom(token, {
      page: currentPage.value,
      row: pageSize.value,
      name: search.value
    })
    const {
      data: { code, data }
    } = res
    if (code === 200) {
      competitionInfoData.value = data
      compListOne.value = data[0]
    }
  } catch (error) {
    $message.error(error.message)
  } finally {
    loading.value = false
  }
}
const deleteComp = async () => {
  const token = getItem(LocalStorageKey.TOKEN)
  if (!token) {
    router.replace('/login')
    return
  }
  try {
    await ElMessageBox.confirm(`你确认要删除该比赛“${compListOne.value.name}”吗`, '警告', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning'
    })
    const res = await $requests.commonAPI.deleteCompetitionDeleteCom(token, compListOne.value.id)
    const {
      data: { code, message }
    } = res
    if (code === 200) {
      getData()
      $message({
        type: 'success',
        message
      })
    } else {
      $message({
        type: 'error',
        message
      })
    }
  } catch (error) {
    console.log(error)
    $message.error(error.message)
  }
}
onMounted(() => {
  getData()
})
</script>
<style scoped>
@import url(@styles/pagination.css);
.competition-list {
  :deep(.el-dialog__title) {
    font-size: 16px;
    font-weight: bold;
  }
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
  .operation {
    .search-box {
      display: flex;
    }
    .btns {
      margin-top: 10px;
    }
  }
  .list {
  }
}
</style>
<style>
.avatar-uploader {
  display: flex;
  flex-wrap: wrap;
  min-width: 0;
  width: 100%;
  height: 100%;
  .el-upload {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
    flex: 1;
    aspect-ratio: 1/1;
    :deep(.el-form-item) {
      margin-bottom: unset;
    }
  }
  .el-upload-list {
    display: flex;
    flex-direction: column;
    min-width: 0;
  }
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  text-align: center;
}
</style>
