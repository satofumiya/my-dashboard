<script setup>
import { ref, computed, onMounted } from 'vue'
import { fetchBudgets, fetchCreditData } from '../utils/api.js'

const budgets = ref([])
const creditItems = ref([])
const loading = ref(true)

const now = new Date()
const year = now.getFullYear()
const month = now.getMonth() + 1

onMounted(async () => {
  try {
    const [b, c] = await Promise.all([
      fetchBudgets(),
      fetchCreditData(year, month),
    ])
    budgets.value = b
    creditItems.value = c
  } catch {
    budgets.value = []
    creditItems.value = []
  } finally {
    loading.value = false
  }
})

const categorySpending = computed(() => {
  const map = {}
  creditItems.value.forEach((item) => {
    const cat = item.category || '未分類'
    map[cat] = (map[cat] || 0) + Number(item.amount || 0)
  })
  return map
})

const budgetRows = computed(() =>
  budgets.value.map((b) => {
    const spent = categorySpending.value[b.category] || 0
    const budget = Number(b.budget) || 0
    const pct = budget > 0 ? Math.min((spent / budget) * 100, 100) : 0
    return { category: b.category, budget, spent, pct }
  })
)
</script>

<template>
  <div class="card">
    <h2>カテゴリ別予算</h2>
    <div v-if="loading" class="loading">読み込み中...</div>
    <div v-else-if="!budgetRows.length" class="empty">予算データがありません</div>
    <div v-else class="budget-list">
      <div v-for="row in budgetRows" :key="row.category" class="budget-row">
        <div class="budget-header">
          <span class="budget-category">{{ row.category }}</span>
          <span class="budget-amount">
            ¥{{ row.spent.toLocaleString('ja-JP') }} / ¥{{ row.budget.toLocaleString('ja-JP') }}
          </span>
        </div>
        <div class="progress-bar">
          <div
            class="progress-fill"
            :class="{ over: row.pct >= 90 }"
            :style="{ width: row.pct + '%' }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.budget-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.budget-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.budget-category {
  font-size: 15px;
  font-weight: 600;
}

.budget-amount {
  font-size: 13px;
  color: var(--text-secondary);
  font-variant-numeric: tabular-nums;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: var(--bg-card);
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--success);
  border-radius: 4px;
  transition: width 0.3s;
}

.progress-fill.over {
  background: var(--accent);
}
</style>
