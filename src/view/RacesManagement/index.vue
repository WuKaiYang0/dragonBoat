<template>
  <div class="races-management">
    <CompetitionsList v-model:model-value="compListOne"></CompetitionsList>
    <EventsList :comp-list-one="compListOne"></EventsList>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import CompetitionsList from './CompetitonsList/index.vue'
import EventsList from './EventsList/index.vue'
import type { CompetitionInfoData } from '@/typings/common'
const compListOne = ref<CompetitionInfoData>({
  filePath: '',
  createTime: '',
  updateTime: '',
  deleted: 0,
  id: 0,
  name: '',
  startDate: '',
  endDate: '',
  introduction: '',
  location: '',
  deadline: '',
  photo: '',
  status: 0
})
</script>

<style scoped>
.races-management {
  display: flex;
  flex: 1;
  gap: 1px;
}
</style>
