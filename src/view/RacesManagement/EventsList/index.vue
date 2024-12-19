<template>
  <div class="events-list">
    <div style="display: flex; flex-direction: column; gap: 1px">
      <ElCard v-if="compListOne" shadow="never">
        <div class="competition-container">
          <div class="grid-box">
            <div style="display: flex; gap: 10px">
              <ElImage :src="logo" fit="contain" style="width: 60px"></ElImage>
              <div class="flexbox">
                <span class="text">{{ compListOne?.name }}</span>
                <el-text type="info">{{ compListOne?.introduction }}</el-text>
              </div>
            </div>
            <div class="flexbox">
              <span class="text">发布人</span>
              <el-text type="info">admin</el-text>
            </div>
            <div class="flexbox">
              <span class="text">比赛开始时间</span>
              <el-text type="info">{{ compListOne?.startDate }}</el-text>
            </div>
            <div class="flexbox">
              <span class="text">比赛截止时间</span>
              <el-text type="info">{{ compListOne?.endDate }}</el-text>
            </div>
            <div class="flexbox">
              <span class="text">报名截止时间</span>
              <el-text type="info">{{ compListOne?.deadline }}</el-text>
            </div>
            <div class="flexbox">
              <span class="text">状态</span>
              <el-text v-if="compListOne?.status === 0" type="success">{{
                CompItemStatus[`$${compListOne?.status}`]
              }}</el-text>
              <el-text v-else-if="compListOne?.status === 1" type="primary">{{
                CompItemStatus[`$${compListOne?.status}`]
              }}</el-text>
              <el-text v-else-if="compListOne?.status === 2" type="info">{{
                CompItemStatus[`$${compListOne?.status}`]
              }}</el-text>
            </div>
          </div>
        </div>
      </ElCard>
      <ElCard style="height: 100%" shadow="never">
        <template #default>
          <div class="search-grid">
            <div class="search-grid-items">
              <label class="search-grid-items-text">赛项名称</label>
              <el-input
                v-model="searchCompItemName"
                size="default"
                placeholder="请输入赛项名称"
                @blur="searchCompItemHandler"
              />
            </div>
            <div class="search-grid-items">
              <label class="search-grid-items-text">赛项性质</label>
              <el-select
                v-model="categoryTypeId"
                placeholder="请选择比赛类型"
                size="default"
                clearable
              >
                <el-option
                  v-for="a in categoryType"
                  :key="a.id"
                  :label="a.typeName"
                  :value="a.id"
                />
              </el-select>
            </div>
            <div class="search-grid-items">
              <label class="search-grid-items-text">赛项距离</label>
              <el-select
                v-model="lengthTypeId"
                placeholder="请选择比赛类型"
                size="default"
                clearable
              >
                <el-option v-for="a in lengthType" :key="a.id" :label="a.typeName" :value="a.id" />
              </el-select>
            </div>
            <div class="search-grid-items">
              <WrapperElButton
                btn-type="search"
                size="default"
                :border-color="getColor(WhatColor.ThemeColor)"
                :color="getColor(WhatColor.ThemeColor)"
                @click="getData"
                >查询</WrapperElButton
              >
              <WrapperElButton btn-type="reset" size="default" @click="resetHandler"
                >重置</WrapperElButton
              >
            </div>
          </div>
          <el-table :data="compItems" style="width: 100%">
            <el-table-column prop="name" label="赛项名称" />
            <el-table-column prop="category" label="赛项组别" />
          </el-table>
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
    </div>
  </div>
</template>
<script setup lang="ts">
import { getCurrentInstance, ref, watch, type PropType } from 'vue'
import WrapperElButton from '@/components/WrapperElButton.vue'
import type { CompetitionInfoData, CompetitionItem } from '@/typings/common'
import logo from '../../../../public/statics/logo.png'
import { CompItemStatus, LocalStorageKey, WhatColor } from '@/typings/enums'
import { getItem } from '@/utils/localStorage'
import router from '@/router'
import { getColor } from '@/utils/common'
const currentPage = ref(1)
const pageSize = ref(5)
const totals = ref(0)
const { $requests } = getCurrentInstance().appContext.config.globalProperties
const onCurrentChange = (val: number) => {
  currentPage.value = val
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
const compItems = ref<CompetitionItem[]>([])
const categoryTypeId = ref()
const lengthTypeId = ref()
const props = defineProps({
  compListOne: {
    required: true,
    type: Object as PropType<CompetitionInfoData>,
    default: () => ({})
  }
})
const resetHandler = () => {
  searchCompItemName.value = ''
  categoryTypeId.value = ''
  lengthTypeId.value = ''
}
watch(
  () => props.compListOne,
  () => {
    getData()
  }
)
const searchCompItemName = ref('')
const searchCompItemHandler = () => {}
const getData = async () => {
  const token = getItem(LocalStorageKey.TOKEN)
  if (!token) {
    router.replace({ name: 'Login' })
    return
  }
  const res = await $requests.commonAPI.getCompetitionGroupList(token, {
    page: currentPage.value,
    competitionId: props.compListOne.id,
    pageSize: pageSize.value,
    competitionCategory: categoryType.find((item) => item.id === categoryTypeId.value)?.typeName,
    competitionLength: lengthType.find((item) => item.id === lengthTypeId.value)?.typeName,
    name: searchCompItemName.value
  })
  const {
    data: { code, data }
  } = res
  if (code === 200) {
    compItems.value = data.datas
    totals.value = data.totals
  }
}
</script>
<style scoped>
@import url(@styles/pagination.css);
.events-list {
  flex-grow: 1;
  :deep(th) {
    background: #f7f7f7 !important;
    font-weight: 600;
    color: #313437;
    border-radius: 4px 4px 0px 0px;
  }
  .competition-container {
    display: flex;
    gap: 80px;
    display: flex;

    .grid-box {
      display: grid;
      grid-template-columns: repeat(6, minmax(min(100% - 2rem, 240px), 1fr));
      .flexbox {
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 10px;
        .text {
          font-size: 15px;
        }
        :deep(.el-text) {
          align-self: unset;
        }
      }
    }
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
</style>
