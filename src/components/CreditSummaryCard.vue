<script setup>
import { ref, computed, onMounted } from 'vue'
import { fetchCreditData, fetchSubscriptions } from '../utils/api.js'

const items = ref([])
const subData = ref({ fixed: [], variable: { total: 0, count: 0 } })
const loading = ref(true)

const now = new Date()
const year = now.getFullYear()
const month = now.getMonth() + 1

onMounted(async () => {
  try {
    const [credit, subs] = await Promise.all([
      fetchCreditData(year, month),
      fetchSubscriptions(),
    ])
    items.value = credit
    subData.value = subs
  } catch {
    items.value = []
    subData.value = { fixed: [], variable: { total: 0, count: 0 } }
  } finally {
    loading.value = false
  }
})

const totalAmount = computed(() =>
  items.value.reduce((sum, item) => sum + Number(item.amount || 0), 0)
)

const fixedTotal = computed(() =>
  (subData.value.fixed || []).reduce((s, i) => s + Number(i.amount || 0), 0)
)

const paymentForecast = computed(() =>
  fixedTotal.value + (subData.value.variable?.total || 0)
)
</script>

<template>
  <div class="card">
    <h2>{{ month }}月の使用状況</h2>
    <div v-if="loading" class="loading">読み込み中...</div>
    <template v-else>
      <div class="summary">
        <div class="summary-item">
          <div class="label">今月の支払い見込み</div>
          <div class="value">¥{{ paymentForecast.toLocaleString('ja-JP') }}</div>
        </div>
        <div class="summary-item">
          <div class="label">クレカ利用額</div>
          <div class="value">¥{{ totalAmount.toLocaleString('ja-JP') }}</div>
        </div>
      </div>
    </template>
  </div>
</template>
