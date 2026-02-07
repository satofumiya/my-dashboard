<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { fetchCreditData } from '../utils/api.js'
import CreditTable from '../components/CreditTable.vue'
import SubscriptionCard from '../components/SubscriptionCard.vue'

const router = useRouter()
const items = ref([])
const loading = ref(false)
const error = ref('')

const now = new Date()
const selectedYear = ref(now.getFullYear())
const selectedMonth = ref(now.getMonth() + 1)

const years = computed(() => {
  const curr = now.getFullYear()
  return Array.from({ length: 5 }, (_, i) => curr - i)
})
const months = Array.from({ length: 12 }, (_, i) => i + 1)

const totalAmount = computed(() =>
  items.value.reduce((sum, item) => sum + Number(item.amount || 0), 0)
)

const categoryBreakdown = computed(() => {
  const map = {}
  items.value.forEach((item) => {
    const cat = item.category || 'その他'
    if (!map[cat]) map[cat] = { category: cat, amount: 0, count: 0 }
    map[cat].amount += Number(item.amount || 0)
    map[cat].count++
  })
  return Object.values(map).sort((a, b) => b.amount - a.amount)
})

async function loadData() {
  loading.value = true
  error.value = ''
  try {
    items.value = await fetchCreditData(selectedYear.value, selectedMonth.value)
  } catch (e) {
    error.value = e.message
    items.value = []
  } finally {
    loading.value = false
  }
}

onMounted(loadData)
watch([selectedYear, selectedMonth], loadData)
</script>

<template>
  <div class="page-header">
    <button class="btn btn-danger" @click="router.push('/')">← 戻る</button>
    <h1>クレジット使用履歴</h1>
  </div>

  <div class="card">
    <div class="filter-bar">
      <select v-model="selectedYear">
        <option v-for="y in years" :key="y" :value="y">{{ y }}年</option>
      </select>
      <select v-model="selectedMonth">
        <option v-for="m in months" :key="m" :value="m">{{ m }}月</option>
      </select>
    </div>

    <div class="summary">
      <div class="summary-item">
        <div class="label">件数</div>
        <div class="value">{{ items.length }}</div>
      </div>
      <div class="summary-item">
        <div class="label">合計金額</div>
        <div class="value">¥{{ totalAmount.toLocaleString('ja-JP') }}</div>
      </div>
    </div>
  </div>

  <div class="card" v-if="loading">
    <div class="loading">読み込み中...</div>
  </div>

  <div class="card" v-else-if="error">
    <div class="empty" style="color: var(--accent);">{{ error }}</div>
  </div>

  <template v-else-if="items.length">
    <div class="card">
      <h2>カテゴリ別</h2>
      <div class="category-list">
        <div v-for="cat in categoryBreakdown" :key="cat.category" class="category-row">
          <div class="category-info">
            <span class="category-name">{{ cat.category }}</span>
            <span class="category-count">{{ cat.count }}件</span>
          </div>
          <div class="category-bar-wrap">
            <div
              class="category-bar"
              :style="{ width: (cat.amount / totalAmount * 100) + '%' }"
            ></div>
          </div>
          <div class="category-amount">¥{{ cat.amount.toLocaleString('ja-JP') }}</div>
        </div>
      </div>
    </div>

    <div class="card">
      <CreditTable :items="items" />
    </div>
  </template>

  <div class="card" v-else>
    <div class="empty">データがありません</div>
  </div>

  <SubscriptionCard />
</template>

<style scoped>
.page-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
}

.page-header h1 {
  font-size: 24px;
}

.category-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 12px;
}

.category-row {
  display: grid;
  grid-template-columns: 120px 1fr auto;
  align-items: center;
  gap: 12px;
}

.category-info {
  display: flex;
  align-items: baseline;
  gap: 6px;
  min-width: 0;
}

.category-name {
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.category-count {
  font-size: 12px;
  color: var(--text-secondary);
  white-space: nowrap;
}

.category-bar-wrap {
  height: 20px;
  background: var(--bg-secondary, #2a2a3e);
  border-radius: 4px;
  overflow: hidden;
}

.category-bar {
  height: 100%;
  background: var(--accent, #e74c3c);
  border-radius: 4px;
  min-width: 2px;
  transition: width 0.3s ease;
}

.category-amount {
  font-weight: 600;
  text-align: right;
  white-space: nowrap;
  min-width: 90px;
}
</style>
