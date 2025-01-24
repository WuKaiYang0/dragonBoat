<template>
  <div class="races-management">
    <TreeTable
      ref="treeTableRef"
      :model-value="datas"
      :loading="loading"
      :tree-source="treeSource"
      :table-source="tableSource"
      @change:data-of-tree="getCompsData"
      @update:data-of-tree:current-page="(val: number) => (treeSource.currentPage = val)"
      @update:data-of-tree:page-size="(val: number) => (treeSource.pageSize = val)"
      @change:data-of-table="getEventsData"
      @update:data-of-table:current-page="(val: number) => (tableSource.currentPage = val)"
      @update:data-of-table:page-size="(val: number) => (tableSource.pageSize = val)"
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
          <WrapperElButton btn-type="plus" size="small" theme="blueberry" @click="newHandler"
            >新建</WrapperElButton
          >
          <WrapperElButton btn-type="edit" theme="orange" size="small" @click="editHandler"
            >修改</WrapperElButton
          >
          <WrapperElButton btn-type="del" size="small" theme="rose" @click="deleteComp"
            >删除</WrapperElButton
          >
        </div>
      </template>
      <template #tree-default>
        <el-dialog
          v-model="competitionDialogVisible"
          :title="addOrEdit === 'add' ? '举报比赛' : '修改比赛'"
          align-center
          :before-close="competitionBeforeCloseHandler"
        >
          <ElForm
            ref="competitionFormRef"
            :model="competitionForm"
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
                  <ElInput v-model="competitionForm.name"></ElInput>
                </ElFormItem>
                <ElFormItem
                  label="比赛地区"
                  label-position="top"
                  prop="location"
                  :rules="[{ required: true, message: '请选择举办地点', trigger: 'change' }]"
                >
                  <ElInput v-model="competitionForm.location"></ElInput>
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
                    competitionForm.startDate = startAndEndDate[0]
                    competitionForm.endDate = startAndEndDate[1]
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
                v-model="competitionForm.deadline"
                type="date"
                placeholder="请选择日期"
                :shortcuts="shortcuts"
                style="width: 100%"
                @update:model-value="
                  ($event) =>
                    (competitionForm.deadline = dayjs($event).format('YYYY-MM-DD hh:mm:ss'))
                "
              />
            </ElFormItem>
            <ElFormItem
              label="大赛简介"
              prop="introduction"
              :rules="[{ required: true, message: '请描述大赛简介', trigger: 'change' }]"
            >
              <el-input
                v-model="competitionForm.introduction"
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
      </template>
      <template #table-operation-icons>
        <div style="display: flex; justify-content: flex-end">
          <IconsOperationPanel
            :refresh="{ switch: true, handler: [getEventsData] }"
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
      <template #table-header>
        <div class="competition-container">
          <ElScrollbar :always="true" style="width: 100%; z-index: 0">
            <div class="grid-box">
              <div style="display: flex; gap: 10px; flex-grow: 1">
                <ElImage :src="logo" fit="contain" style="width: 60px"></ElImage>
                <div class="flexbox">
                  <ElText class="text-header">{{ datas.oneInData?.name }}</ElText>
                  <ElText class="text-content">
                    <el-text type="info">{{ datas.oneInData?.introduction }}</el-text>
                  </ElText>
                </div>
              </div>
              <div class="flexbox">
                <ElText>发布人</ElText>
                <!-- <ElText class="text-header"></ElText> -->
                <ElText class="text-content">
                  <el-text type="info">admin</el-text>
                </ElText>
              </div>
              <div class="flexbox">
                <ElText class="text-header">比赛开始时间</ElText
                ><ElText class="text-content">
                  <el-text type="info">{{ datas.oneInData?.startDate }}</el-text></ElText
                >
              </div>
              <div class="flexbox">
                <ElText class="text-header">比赛截止时间</ElText
                ><ElText class="text-content">
                  <el-text type="info">{{ datas.oneInData?.endDate }}</el-text></ElText
                >
              </div>
              <div class="flexbox">
                <ElText class="text-header">报名截止时间</ElText
                ><ElText class="text-content">
                  <el-text type="info">{{ datas.oneInData?.deadline }}</el-text></ElText
                >
              </div>
              <div class="flexbox">
                <ElText class="text-header">状态</ElText>
                <ElText class="text-content">
                  <el-text v-if="datas.oneInData?.status === 0" type="success">{{
                    CompItemStatus[`$${datas.oneInData?.status}`]
                  }}</el-text>
                  <el-text v-else-if="datas.oneInData?.status === 1" type="primary">{{
                    CompItemStatus[`$${datas.oneInData?.status}`]
                  }}</el-text>
                  <el-text v-else-if="datas.oneInData?.status === 2" type="info">{{
                    CompItemStatus[`$${datas.oneInData?.status}`]
                  }}</el-text>
                </ElText>
              </div>
            </div>
          </ElScrollbar>
        </div>
        <div class="search-grid">
          <div class="search-grid-items">
            <label class="search-grid-items-text">赛项名称</label>
            <el-input
              v-model="searchCompItemName"
              size="small"
              placeholder="请输入赛项名称"
              @blur="searchCompItemHandler"
            />
          </div>
          <div class="search-grid-items">
            <label class="search-grid-items-text">赛项性质</label>
            <el-select v-model="categoryTypeId" placeholder="请选择比赛类型" size="small" clearable>
              <el-option v-for="a in categoryType" :key="a.id" :label="a.typeName" :value="a.id" />
            </el-select>
          </div>
          <div class="search-grid-items">
            <label class="search-grid-items-text">赛项距离</label>
            <el-select v-model="lengthTypeId" placeholder="请选择比赛类型" size="small" clearable>
              <el-option v-for="a in lengthType" :key="a.id" :label="a.typeName" :value="a.id" />
            </el-select>
          </div>
          <div class="search-grid-items">
            <ElScrollbar>
              <WrapperElButton
                btn-type="plus"
                size="small"
                :border-color="getColor(WhatColor.ThemeColor)"
                :color="getColor(WhatColor.ThemeColor)"
                theme="blueberry"
                @click="competitionItemDialogVisible = true"
                >新建</WrapperElButton
              >
              <WrapperElButton
                btn-type="search"
                size="small"
                :border-color="getColor(WhatColor.ThemeColor)"
                :color="getColor(WhatColor.ThemeColor)"
                theme="orange"
                @click="getEventsData"
                >查询</WrapperElButton
              >
              <WrapperElButton btn-type="reset" size="small" theme="water" @click="resetHandler"
                >重置</WrapperElButton
              >
            </ElScrollbar>
          </div>
        </div>
      </template>
      <template #table>
        <el-table-column prop="name" label="赛项名称" align="center">
          <template #header>
            <div class="table-header-label">
              <ElText class="label">赛项名称</ElText>
            </div>
          </template>
          <template #default="{ row }">
            {{ row.name }}
          </template>
        </el-table-column>
        <el-table-column prop="category" label="赛项组别" align="center">
          <template #header>
            <div class="table-header-label">
              <ElText class="label">赛项组别</ElText>
            </div>
          </template>
          <template #default="{ row }">
            {{ row.category }}
          </template>
        </el-table-column>
      </template>
      <template #table-default>
        <el-dialog
          v-model="competitionItemDialogVisible"
          title="创建赛项"
          align-center
          :before-close="competitionItemBeforeCloseHandler"
        >
          <div style="margin-bottom: 10px">
            <el-steps :simple="true" :space="'100%'" :active="stepActive" finish-status="success">
              <el-step title="赛项类型" />
              <el-step title="赛项规则" />
            </el-steps>
          </div>
          <ElForm
            v-show="stepActive === 0"
            ref="competitionTypeItemFormRef"
            :model="competitionTypeItemForm"
            label-position="left"
            label-width="auto"
          >
            <el-form-item
              label="比赛赛制"
              prop="competitionCategory"
              :rules="[{ required: true, message: '请选择比赛赛制', trigger: 'change' }]"
            >
              <el-select-v2
                v-model="competitionTypeItemForm.competitionCategory"
                :size="size"
                :options="[
                  { value: '往返赛', label: '往返赛' },
                  { value: '绕标赛', label: '绕标赛' },
                  { value: '追逐赛', label: '追逐赛' },
                  { value: '直道竞速赛', label: '直道竞速赛' }
                ]"
                placeholder="选择赛制"
                style="width: 100%; vertical-align: middle"
                clearable
              />
            </el-form-item>
            <el-form-item
              label="赛道长度"
              prop="competitionLength"
              :rules="[{ required: true, message: '请选择赛道长度', trigger: 'change' }]"
            >
              <el-select-v2
                v-model="competitionTypeItemForm.competitionLength"
                :size="size"
                :options="[
                  { value: '100米', label: '100米' },
                  { value: '200米', label: '200米' },
                  { value: '300米', label: '300米' },
                  { value: '500米', label: '500米' },
                  { value: '800米', label: '800米' },
                  { value: '1000米', label: '1000米' },
                  { value: '1400米', label: '1400米' },
                  { value: '2000米', label: '2000米' },
                  { value: '3000米', label: '3000米' },
                  { value: '5000米', label: '5000米' }
                ]"
                placeholder="选择赛道长度"
                style="width: 100%; vertical-align: middle"
                clearable
              />
            </el-form-item>
            <el-form-item
              label="比赛组别"
              prop="category"
              :rules="[{ required: true, message: '请选择比赛组别', trigger: 'change' }]"
            >
              <el-select-v2
                v-model="competitionTypeItemForm.category"
                :size="size"
                :options="[
                  { value: '男子组', label: '男子组' },
                  { value: '女子组', label: '女子组' },
                  { value: '少年组', label: '少年组' },
                  { value: '青年组', label: '青年组' },
                  { value: '老将组', label: '老将组' },
                  { value: '直道竞速赛', label: '直道竞速赛' }
                ]"
                placeholder="选择比赛组别"
                style="width: 100%; vertical-align: middle"
                clearable
              />
            </el-form-item>
            <el-form-item
              label-position="right"
              label="比赛人数"
              prop="numsType"
              :rules="[
                {
                  required: true,
                  message: 'Please select a location',
                  trigger: 'change'
                }
              ]"
            >
              <el-segmented
                v-model="competitionTypeItemForm.numsType"
                :size="size"
                :options="[
                  { value: 0, label: '5人' },
                  { value: 1, label: '8人' },
                  { value: 2, label: '12人' },
                  { value: 3, label: '18人' },
                  { value: 4, label: '22人' }
                ]"
              />
            </el-form-item>
          </ElForm>
          <ElForm
            v-show="stepActive === 1"
            ref="competitionRulesItemFormRef"
            :model="competitionRulesItemForm"
            label-position="top"
            label-width="auto"
          >
            <el-tabs :tab-position="'left'" class="demo-tabs">
              <el-tab-pane>
                <template #label>
                  <el-badge is-dot class="item" :color="badgeDotIsBadInAge ? '' : 'green'">
                    年龄规则</el-badge
                  >
                </template>
                <template #default>
                  <el-form-item
                    :required="true"
                    prop="minAge"
                    :rules="[{ validator: validateAgePass, trigger: 'change' }]"
                  >
                    <el-input-number
                      v-model="competitionRulesItemForm.minAge"
                      :size="size"
                      controls-position="right"
                    >
                      <template #prefix>
                        <ElText>最低</ElText>
                      </template>
                      <template #suffix>
                        <ElText>岁</ElText>
                      </template>
                    </el-input-number>
                  </el-form-item>
                  <el-form-item
                    :required="true"
                    prop="maxAge"
                    :rules="[{ validator: validateAgePass, trigger: 'change' }]"
                  >
                    <el-input-number
                      v-model="competitionRulesItemForm.maxAge"
                      :size="size"
                      controls-position="right"
                    >
                      <template #prefix>
                        <ElText>最高</ElText>
                      </template>
                      <template #suffix>
                        <ElText>岁</ElText>
                      </template>
                    </el-input-number>
                  </el-form-item>
                </template>
              </el-tab-pane>
              <el-tab-pane>
                <template #label>
                  <el-badge is-dot class="item" :color="badgeDotIsBadInNation ? '' : 'green'"
                    >民族规则</el-badge
                  >
                </template>
                <template #default>
                  <el-form-item
                    prop="nationNums"
                    :rules="[{ validator: validateNationNumsPass, trigger: 'blur' }]"
                  >
                    <el-table :data="competitionRulesItemForm.nationNums">
                      <el-table-column prop="nationId" label="民族">
                        <template #default="{ row }">
                          <el-cascader
                            v-model="row.nationId"
                            :size="size"
                            placeholder="选择民族"
                            :options="nationType"
                            filterable
                          />
                          <!-- <el-input v-model="row." style="width: 240px" placeholder="Please input" /> -->
                        </template>
                      </el-table-column>
                      <el-table-column label="大于（人数）">
                        <template #default="{ row }">
                          <ElInput v-model.number="row.amount.gt" :size="size"> </ElInput>
                        </template>
                      </el-table-column>
                      <el-table-column label="小于（人数）">
                        <template #default="{ row }">
                          <ElInput v-model.number="row.amount.lt" :size="size"> </ElInput>
                        </template>
                      </el-table-column>
                      <el-table-column fixed="right" label="操作">
                        <template #default="scope">
                          <el-button
                            link
                            type="danger"
                            :size="size"
                            @click.prevent="deleteRow(scope.$index)"
                          >
                            删除
                          </el-button>
                        </template>
                      </el-table-column>
                    </el-table>
                    <el-button
                      :icon="Plus"
                      class="mt-4"
                      style="width: 100%"
                      :size="size"
                      @click="onAddItem"
                    >
                      添加
                    </el-button>
                  </el-form-item>
                </template>
              </el-tab-pane>
              <el-tab-pane>
                <template #label>
                  <el-badge is-dot class="item" :color="badgeDotIsBadInGender ? '' : 'green'"
                    >性别规则</el-badge
                  >
                </template>
                <template #default>
                  <el-form-item
                    prop="gendersNums"
                    :rules="[{ validator: validateGendersNumsPass, trigger: 'blur' }]"
                  >
                    <el-table :data="competitionRulesItemForm.gendersNums">
                      <el-table-column prop="gender" label="性别">
                        <template #default="{ row }">
                          <el-select v-model="row.gender" placeholder="性别" :size="size">
                            <el-option label="男" :value="1" />
                            <el-option label="女" :value="0" />
                          </el-select>
                        </template>
                      </el-table-column>
                      <el-table-column prop="type" label="运动员类型">
                        <template #default="{ row }">
                          <el-select v-model="row.type" placeholder="选择运动员类型" :size="size">
                            <el-option
                              v-for="a in athletesType"
                              :key="a.id"
                              :label="a.typeName"
                              :value="a.id"
                            />
                          </el-select>
                        </template>
                      </el-table-column>
                      <el-table-column prop="numsgt" label="大于（人数）">
                        <template #default="{ row }">
                          <ElInput v-model.number="row.numsgt" :size="size"> </ElInput>
                        </template>
                      </el-table-column>
                      <el-table-column prop="numslt" label="小于（人数）">
                        <template #default="{ row }">
                          <ElInput v-model.number="row.numslt" :size="size"> </ElInput>
                        </template>
                      </el-table-column>
                      <el-table-column fixed="right" label="操作">
                        <template #default="scope">
                          <el-button
                            link
                            type="danger"
                            :size="size"
                            @click.prevent="deleteGenderRow(scope.$index)"
                          >
                            删除
                          </el-button>
                        </template>
                      </el-table-column>
                    </el-table>
                    <el-button
                      :size="size"
                      class="mt-4"
                      :icon="Plus"
                      style="width: 100%"
                      @click="onAddGenderItem"
                    >
                      添加
                    </el-button>
                  </el-form-item>
                </template>
              </el-tab-pane>
            </el-tabs>
          </ElForm>
          <template #footer>
            <div class="dialog-footer">
              <template v-if="stepActive === 0">
                <WrapperElButton
                  btn-type="cancel"
                  size="default"
                  theme="water"
                  @click="resetCompItemForm"
                  >取 消</WrapperElButton
                >
                <WrapperElButton
                  btn-type="cancel"
                  size="default"
                  theme="blueberry"
                  @click="nextHandler"
                  >下一步</WrapperElButton
                >
              </template>
              <template v-else>
                <WrapperElButton
                  btn-type="cancel"
                  size="default"
                  theme="water"
                  @click="previousHandler"
                  >上一步</WrapperElButton
                >
                <WrapperElButton
                  btn-type="cancel"
                  size="default"
                  theme="blueberry"
                  @click="submitHandler"
                  >提交</WrapperElButton
                >
              </template>
            </div>
          </template>
        </el-dialog>
      </template>
    </TreeTable>
  </div>
</template>
<script setup lang="ts">
import TreeTable from '@components/TreeTable/index.vue'
import WrapperElButton from '@/components/WrapperElButton.vue'
import {
  dayjs,
  type DialogBeforeCloseFn,
  type FormInstance,
  ElMessageBox,
  ElText,
  ElScrollbar
} from 'element-plus'
import { getCurrentInstance, onMounted, ref, watch } from 'vue'
import { LocalStorageKey, WhatColor } from '@typings/enums/index'
import { getColor } from '@utils/common'
import { Plus } from '@element-plus/icons-vue'
// import logo from '../../../public/statics/logo.png'
import logo from '@assets/svgs/logo-2.svg'
import type { UploadProps, FormValidateCallback } from 'element-plus'
import { getItem } from '@/utils/localStorage'
import router from '@/router'
import type {
  CompetitionInfoData,
  CompetitionItem,
  CreateCompetitionData,
  CreateCompetitionItemData,
  DataInAthletesType,
  UpdateCompetitionData
} from '@/typings/common'
import { CompItemStatus } from '@/typings/enums'
import nationType from '@assets/json/nation.json'
const athletesType = ref<DataInAthletesType[]>([])
const size = 'default'
const badgeDotIsBadInAge = ref(false)
const badgeDotIsBadInNation = ref(false)
const badgeDotIsBadInGender = ref(false)
const resetCompItemForm = () => {
  competitionRulesItemFormRef.value.resetFields()
  competitionTypeItemFormRef.value.resetFields()
  stepActive.value = 0
  competitionItemDialogVisible.value = false
}
const getMemberType = async () => {
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
  }
}
const deleteRow = (index: number) => {
  competitionRulesItemForm.value.nationNums.splice(index, 1)
}
const deleteGenderRow = (index: number) => {
  competitionRulesItemForm.value.gendersNums.splice(index, 1)
}
const onAddItem = () => {
  competitionRulesItemForm.value.nationNums.push({
    amount: { gt: 0, lt: 0 },
    nationId: 0
  })
}
const onAddGenderItem = () => {
  competitionRulesItemForm.value.gendersNums.push({
    gender: 0,
    numsgt: 0,
    numslt: 0,
    type: 0
  })
}
const stepActive = ref(0)
const validateAgePass = (
  rule: { field: string },
  value: number,
  callback: (arg?: unknown) => void
) => {
  if (competitionRulesItemForm.value[rule.field] <= 0) {
    callback(new Error('年龄有误'))
  }
  callback()
}
const validateNationNumsPass = (
  rule: { field: string },
  value: CompetitionRulesItem['nationNums'],
  callback: (arg?: unknown) => void
) => {
  const nationNum = competitionRulesItemForm.value[rule.field] as CompetitionRulesItem['nationNums']
  if (nationNum.length === 0) {
    return callback(new Error('必填项，请添加规则'))
  }
  for (let i = 0; i < nationNum.length; i++) {
    const {
      amount: { gt, lt },
      nationId
    } = nationNum[i]
    if (nationId < 0) {
      return callback(new Error('请选择民族'))
    } else if (lt <= 0 || gt <= 0) {
      return callback(new Error('人数错误'))
    } else if (gt > lt) {
      return callback(new Error('人数错误'))
    }
    callback()
  }
}
const validateGendersNumsPass = (
  rule: { field: string },
  value: CompetitionRulesItem['gendersNums'],
  callback: (arg?: unknown) => void
) => {
  const gendersNums = competitionRulesItemForm.value[
    rule.field
  ] as CompetitionRulesItem['gendersNums']
  if (gendersNums.length === 0) {
    return callback(new Error('必填项，请添加规则'))
  }
  for (let i = 0; i < gendersNums.length; i++) {
    const { gender, numsgt, numslt, type } = gendersNums[i]
    if (gender < 0) {
      badgeDotIsBadInGender.value = true
      return callback(new Error('请选择性别'))
    } else if (!type) {
      badgeDotIsBadInGender.value = true
      return callback(new Error('请选择运动员类型'))
    } else if (numslt <= 0 || numsgt <= 0) {
      badgeDotIsBadInGender.value = true
      return callback(new Error('人数错误'))
    } else if (numsgt > numslt) {
      badgeDotIsBadInGender.value = true
      return callback(new Error('人数错误'))
    } else {
      badgeDotIsBadInGender.value = false
      callback()
    }
  }
}
const submitHandler = () => {
  const validate: FormValidateCallback = async (isVaild, invalidFields) => {
    console.log(isVaild, invalidFields, '@@@')
    if (isVaild) {
      console.log(competitionTypeItemForm.value)
      console.log(competitionRulesItemForm.value)
      console.log(isVaild, invalidFields)
      const token = getItem(LocalStorageKey.TOKEN)
      try {
        const { category, competitionCategory, competitionId, competitionLength, numsType } =
          competitionTypeItemForm.value
        const { gendersNums, maxAge, minAge, nationNums } = competitionRulesItemForm.value
        const res = await $requests.commonAPI.addCompetitionGroupCreate(token, {
          category,
          competitionCategory,
          competitionId,
          competitionLength,
          gendersNums: JSON.stringify(gendersNums),
          maxAge,
          minAge,
          name: `${category}${competitionCategory}${competitionLength}`,
          nationNums: JSON.stringify(nationNums),
          numsType
        })
        const {
          data: { code, message }
        } = res
        if (code === 200) {
          competitionItemDialogVisible.value = false
          $message.success(message)
          getCompsData()
        } else {
          $message.success(message)
        }
      } catch (error) {
        $message.error(error.message)
      }
      if (!token) {
        router.replace({ name: 'Login' })
        return
      }
    }
  }
  competitionRulesItemFormRef.value.validate(validate)
}
const nextHandler = () => {
  competitionTypeItemFormRef.value.validate((isVaild) => {
    if (isVaild) {
      stepActive.value = 1
    }
  })
  // competitionItemDialogVisible.value = false
}
const previousHandler = () => {
  stepActive.value = 0
  // competitionItemDialogVisible.value = false
}
const treeTableRef = ref<InstanceType<typeof TreeTable>>()
onMounted(() => {
  getCompsData()
  getMemberType()
})
const resetHandler = () => {
  searchCompItemName.value = ''
  categoryTypeId.value = ''
  lengthTypeId.value = ''
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
const cancelHandler = () => {
  competitionDialogVisible.value = false
  competitionFormRef.value.resetFields()
}
const searchCompItemHandler = () => {}
let addOrEditCompFunc = null as () => void
const confirmHandler = () => {
  addOrEditCompFunc && addOrEditCompFunc()
  competitionDialogVisible.value = false
  competitionFormRef.value.resetFields()
  getCompsData()
}
const addComp = () => {
  const token = getItem(LocalStorageKey.TOKEN)
  if (!token) {
    router.replace({ name: 'Login' })
    return
  }
  competitionFormRef.value.validate(async (isVaild) => {
    if (isVaild) {
      try {
        const res = await $requests.commonAPI.postCompetitionCreateCom(token, competitionForm.value)
        const {
          data: { message, code }
        } = res
        if (code === 200) {
          $message.success(message)
          getCompsData()
          competitionDialogVisible.value = false
        } else {
          $message.error(message)
        }
      } catch (error) {
        $message.error(error.message)
      }
    }
  })
}
const editComp = () => {
  const token = getItem(LocalStorageKey.TOKEN)
  if (!token) {
    router.replace({ name: 'Login' })
    return
  }
  Object.assign(updateCompetitionListForm.value, competitionForm.value, {
    id: datas.value.oneInData.id
  })
  console.log(updateCompetitionListForm.value)

  competitionFormRef.value.validate(async (isVaild) => {
    if (isVaild) {
      try {
        const res = await $requests.commonAPI.updateCompetition(
          token,
          updateCompetitionListForm.value
        )
        const {
          data: { code, message }
        } = res
        if (code === 200) {
          $message.success(message)
          getCompsData()
          competitionDialogVisible.value = false
        } else {
          $message.error(message)
        }
      } catch (error) {
        $message.error(error.message)
      }
    }
  })
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
const loading = ref(true)
const datas = ref({
  oneInData: {} as CompetitionInfoData
})
const { $message, $requests } = getCurrentInstance().appContext.config.globalProperties
const treeSource = ref({
  dataOfTree: [] as CompetitionInfoData[],
  paginationTotals: 0,
  currentPage: 1,
  pageSizes: [5, 10, 15],
  pageSize: 10
})
const tableSource = ref({
  dataOfTable: [] as CompetitionItem[],
  paginationTotals: 0,
  currentPage: 1,
  pageSizes: [5, 10, 15],
  pageSize: 10
})
const search = ref('')
const getCompsData = async () => {
  try {
    const token = getItem(LocalStorageKey.TOKEN)
    if (!token) {
      router.replace({ name: 'Login' })
      return
    }
    const res = await $requests.commonAPI.getCompetitionQueryCom(token, {
      page: treeSource.value.currentPage,
      row: treeSource.value.pageSize,
      name: search.value
    })
    const {
      data: { code, data }
    } = res
    if (code === 200) {
      treeSource.value.dataOfTree = data
      // treeSource.value.paginationTotals = data
      datas.value.oneInData = data[0]
    }
  } catch (error) {
    $message.error(error.message)
  }
}
const lengthType = [
  { id: 0, typeName: '100米' },
  { id: 1, typeName: '200米' },
  { id: 2, typeName: '300米' },
  { id: 3, typeName: '400米' },
  { id: 4, typeName: '800米' }
]
const categoryType = [
  { id: 0, typeName: '直道赛' },
  { id: 1, typeName: '绕标赛' },
  { id: 2, typeName: '追逐赛' },
  { id: 3, typeName: '往返赛' }
]
const categoryTypeId = ref()
const lengthTypeId = ref()
const searchCompItemName = ref('')
const imageUrl = ref(logo)
const handleAvatarSuccess: UploadProps['onSuccess'] = (response, uploadFile) => {
  imageUrl.value = URL.createObjectURL(uploadFile.raw!)
}
const getEventsData = async () => {
  const token = getItem(LocalStorageKey.TOKEN)
  if (!token) {
    router.replace({ name: 'Login' })
    return
  }
  try {
    loading.value = true
    const res = await $requests.commonAPI.getCompetitionGroupList(token, {
      page: tableSource.value.currentPage,
      competitionId: datas.value.oneInData.id,
      pageSize: tableSource.value.pageSize,
      competitionCategory: categoryType.find((item) => item.id === categoryTypeId.value)?.typeName,
      competitionLength: lengthType.find((item) => item.id === lengthTypeId.value)?.typeName,
      name: searchCompItemName.value
    })
    const {
      data: { code, data }
    } = res
    if (code === 200) {
      tableSource.value.dataOfTable = data.datas
      tableSource.value.paginationTotals = data.totals
    }
  } catch (error) {
    $message.error(error.message)
  } finally {
    loading.value = false
  }
}
const newHandler = () => {
  addOrEdit.value = 'add'
  addOrEditCompFunc = addComp
  competitionDialogVisible.value = true
}
const searchHandler = () => {
  getCompsData()
}
const searchChangeHandler = () => {
  if (!search.value) {
    getCompsData()
  }
}
const competitionFormRef = ref<FormInstance>()
const competitionTypeItemFormRef = ref<FormInstance>()
const competitionRulesItemFormRef = ref<FormInstance>()
const competitionBeforeCloseHandler: DialogBeforeCloseFn = (done) => {
  competitionFormRef.value.resetFields()
  done()
}
const competitionItemBeforeCloseHandler: DialogBeforeCloseFn = (done) => {
  competitionTypeItemFormRef.value.resetFields()
  competitionRulesItemFormRef.value.resetFields()
  done()
}
const addOrEdit = ref<'add' | 'edit'>('add')
const startAndEndDate = ref([])
const competitionDialogVisible = ref(false)
const competitionItemDialogVisible = ref(false)
const competitionForm = ref<CreateCompetitionData>({
  name: '',
  startDate: '',
  endDate: '',
  location: '',
  deadline: '',
  introduction: '',
  photo: ''
})
type CompetitionTypeItem = Omit<
  CreateCompetitionItemData,
  'nationNums' | 'gendersNums' | 'minAge' | 'maxAge'
>
type CompetitionRulesItem = Omit<
  CreateCompetitionItemData,
  'competitionCategory' | 'competitionId' | 'name' | 'competitionLength' | 'category' | 'numsType'
>
const competitionTypeItemForm = ref<CompetitionTypeItem>({
  competitionCategory: '',
  competitionId: 0,
  name: '',
  competitionLength: '',
  category: '',
  numsType: 0
})
const competitionRulesItemForm = ref<CompetitionRulesItem>({
  nationNums: [],
  gendersNums: [],
  minAge: 0,
  maxAge: 0
})
const updateCompetitionListForm = ref<UpdateCompetitionData>({
  id: -1,
  name: '',
  startDate: '',
  endDate: '',
  introduction: '',
  location: '',
  deadline: '',
  photo: ''
})
const editHandler = () => {
  addOrEdit.value = 'edit'
  addOrEditCompFunc = editComp
  startAndEndDate.value = [datas.value.oneInData.startDate, datas.value.oneInData.endDate]
  const { deadline, endDate, introduction, location, name, photo, startDate } =
    datas.value.oneInData
  Object.assign(competitionForm.value, {
    deadline,
    endDate,
    introduction,
    location,
    name,
    photo,
    startDate
  } as CreateCompetitionData)
  competitionDialogVisible.value = true
}
const deleteComp = async () => {
  const token = getItem(LocalStorageKey.TOKEN)
  if (!token) {
    router.replace('/login')
    return
  }
  try {
    await ElMessageBox.confirm(`你确认要删除该比赛“${datas.value.oneInData.name}”吗`, '警告', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning'
    })
    const res = await $requests.commonAPI.deleteCompetitionDeleteCom(
      token,
      datas.value.oneInData.id
    )
    const {
      data: { code, message }
    } = res
    if (code === 200) {
      getCompsData()
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
watch(
  () => datas.value.oneInData,
  (nV) => {
    getEventsData()
    competitionTypeItemForm.value.competitionId = nV.id
  }
)
</script>

<style scoped>
.races-management {
  height: 100%;
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
      }
    }
    label {
      color: #606266;
      font-size: 14px;
      margin-right: 10px;
    }
  }
  .table-header-label {
    display: flex;
    align-items: center;
    .label {
      margin: auto;
    }
  }
  .competition-container {
    display: flex;
    margin-bottom: 10px;
    .grid-box {
      display: flex;
      gap: 10px;
      padding-bottom: 12px;
      width: 100%;
      .flexbox {
        display: flex;
        flex-direction: column;
        gap: 10px;
        flex-grow: 1;
        .text-header {
          font-size: 15px;
          width: max-content;
        }
        .text-content {
          width: max-content;
        }
        :deep(.el-text) {
          align-self: unset;
        }
      }
    }
  }
}
</style>
