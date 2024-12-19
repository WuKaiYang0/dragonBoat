<template>
  <el-descriptions class="margin-top" title="队员信息" :column="3" size="small" border>
    <el-descriptions-item>
      <template #label>
        <i class="el-icon-user"></i>
        姓名
      </template>
      {{ memberInfo.name }}
    </el-descriptions-item>
    <el-descriptions-item>
      <template #label>
        <i class="el-icon-mobile-phone"></i>
        岗位
      </template>
      {{ memberInfo.type }}
    </el-descriptions-item>
    <el-descriptions-item>
      <template #label>
        <i class="el-icon-location-outline"></i>
        性别
      </template>
      {{ memberInfo.gender }}
    </el-descriptions-item>
    <el-descriptions-item>
      <template #label>
        <i class="el-icon-location-outline"></i>
        年龄
      </template>
      {{ memberInfo.age }}
    </el-descriptions-item>
    <el-descriptions-item>
      <template #label>
        <i class="el-icon-mobile-phone"></i>
        手机号码
      </template>
      {{ memberInfo.phone }}
    </el-descriptions-item>
    <el-descriptions-item>
      <template #label>
        <i class="el-icon-office-building"></i>
        上衣尺码
      </template>
      {{ memberInfo.coatSize }}
    </el-descriptions-item>
    <el-descriptions-item>
      <template #label>
        <i class="el-icon-office-building"></i>
        裤子尺码
      </template>
      {{ memberInfo.trousersSize }}
    </el-descriptions-item>
    <el-descriptions-item>
      <template #label>
        <i class="el-icon-user"></i>
        相片
      </template>
      <el-image
        fit="contain"
        style="width: 100px"
        :src="memberInfo.photo"
        :preview-src-list="[memberInfo.photo]"
      >
      </el-image>
    </el-descriptions-item>
  </el-descriptions>
</template>

<script setup lang="ts">
import type { TeamMember } from '@/typings/user/unit'
import type { PropType } from 'vue'

defineProps({
  memberInfo: {
    default: () => ({}),
    type: Object as PropType<TeamMember>
  }
})
</script>

<style></style>
