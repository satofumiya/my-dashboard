<script setup>
import { useRouter } from 'vue-router'
import { inject } from 'vue'
import ScheduleCard from '../components/ScheduleCard.vue'
import TaskCard from '../components/TaskCard.vue'
import CreditSummaryCard from '../components/CreditSummaryCard.vue'
import BudgetCard from '../components/BudgetCard.vue'

const router = useRouter()
const openSettings = inject('openSettings')
</script>

<template>
  <div class="dashboard-header">
    <h1>ダッシュボード</h1>
    <button class="btn btn-danger" style="font-size: 13px;" @click="openSettings">
      API設定
    </button>
  </div>

  <div class="dashboard-grid">
    <div class="col-left">
      <ScheduleCard />
      <TaskCard />
    </div>
    <div class="col-right">
      <CreditSummaryCard />
      <BudgetCard />
      <div class="card">
        <button class="btn btn-primary" style="width: 100%;" @click="router.push('/credit')">
          履歴詳細を見る →
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.dashboard-header h1 {
  font-size: 24px;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  align-items: start;
}

@media (max-width: 768px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
}

.col-left,
.col-right {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.col-left > :deep(.card),
.col-right > :deep(.card) {
  margin-bottom: 0;
}
</style>
