<script setup>
import { ref, computed, onMounted } from 'vue'
import { fetchCreditData } from '../utils/api.js'
import { useSubscriptions } from '../utils/useSubscriptions.js'

const items = ref([])
const loading = ref(true)

const now = new Date()
const year = now.getFullYear()
const month = now.getMonth() + 1

onMounted(async () => {
  try {
    items.value = await fetchCreditData(year, month)
  } catch {
    items.value = []
  } finally {
    loading.value = false
  }
})

const { grandTotal: paymentForecast } = useSubscriptions()

const totalAmount = computed(() =>
  items.value.reduce((sum, item) => sum + Number(item.amount || 0), 0)
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
