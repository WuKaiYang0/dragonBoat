<template>
  <el-descriptions class="margin-top" title="队员信息" :column="3" size="medium" border>
    <el-descriptions-item>
      <template slot="label">
        <i class="el-icon-user"></i>
        姓名
      </template>
      {{ memberInfo.name }}
    </el-descriptions-item>
    <el-descriptions-item>
      <template slot="label">
        <i class="el-icon-mobile-phone"></i>
        岗位
      </template>
      {{ memberInfo.typeName }}
    </el-descriptions-item>
    <el-descriptions-item>
      <template slot="label">
        <i class="el-icon-location-outline"></i>
        性别
      </template>
      {{ memberInfo.genderName }}
    </el-descriptions-item>
    <el-descriptions-item>
      <template slot="label">
        <i class="el-icon-location-outline"></i>
        年龄
      </template>
      {{ memberInfo.age }}
    </el-descriptions-item>
    <el-descriptions-item>
      <template slot="label">
        <i class="el-icon-mobile-phone"></i>
        手机号码
      </template>
      {{ memberInfo.phone }}
    </el-descriptions-item>
    <el-descriptions-item>
      <template slot="label">
        <i class="el-icon-office-building"></i>
        上衣尺码
      </template>
      {{ memberInfo.coatSize }}
    </el-descriptions-item>
    <el-descriptions-item>
      <template slot="label">
        <i class="el-icon-office-building"></i>
        裤子尺码
      </template>
      {{ memberInfo.trousersSize }}
    </el-descriptions-item>
    <el-descriptions-item>
      <template slot="label">
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

<script>
export default {
  props: {
    memberInfo: {
      default: {}
    }
  }
}
</script>

<style></style>
