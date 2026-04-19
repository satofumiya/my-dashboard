<script setup>
import { useRouter } from 'vue-router'
import { inject } from 'vue'
import ScheduleCard from '../components/ScheduleCard.vue'
import RoutineCard from '../components/RoutineCard.vue'
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
    <div class="item item-credit"><CreditSummaryCard /></div>
    <div class="item item-history card">
      <button class="btn btn-primary" style="width: 100%;" @click="router.push('/credit')">
        履歴詳細を見る →
      </button>
    </div>
    <div class="item item-schedule"><ScheduleCard /></div>
    <div class="item item-fridge card">
      <button class="btn btn-primary" style="width: 100%;" @click="router.push('/fridge')">
        冷蔵庫を見る →
      </button>
    </div>
    <div class="item item-budget"><BudgetCard /></div>
    <div class="item item-routine"><RoutineCard /></div>
    <div class="item item-task"><TaskCard /></div>
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

/* デスクトップ: 左列・右列に配置 */
.item-schedule, .item-routine, .item-task { grid-column: 1; }
.item-credit, .item-history, .item-fridge, .item-budget { grid-column: 2; }

/* タブレット: 1列で指定順に並べる */
@media (max-width: 768px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
  .item { grid-column: 1 !important; }
  .item-credit  { order: 1; }
  .item-history { order: 2; }
  .item-schedule { order: 3; }
  .item-fridge  { order: 4; }
  .item-routine { order: 5; }
  .item-task    { order: 6; }
  .item-budget  { order: 7; }
}
</style>
