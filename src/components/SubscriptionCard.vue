<script setup>
import { computed } from 'vue'
import { useSubscriptions } from '../utils/useSubscriptions.js'

const now = new Date()
const month = now.getMonth() + 1

const { loading, variable, creditUnpaid, creditPaid, bankFixed, creditFixedTotal, bankFixedTotal, grandTotal } = useSubscriptions()

const hasData = computed(() =>
  (creditUnpaid.value.length + creditPaid.value.length + bankFixed.value.length) > 0 || variable.value.count > 0
)
</script>

<template>
  <div class="card">
    <h2>{{ month }}月の支払い見込み</h2>
    <div v-if="loading" class="loading">読み込み中...</div>
    <div v-else-if="!hasData" class="empty">データがありません</div>
    <template v-else>
      <div class="sub-total grand">
        <span class="label">合計見込み</span>
        <span class="value">¥{{ grandTotal.toLocaleString('ja-JP') }}</span>
      </div>

      <!-- クレカ払い -->
      <div class="payment-section">
        <div class="section-header">
          <span>クレカ払い</span>
          <span class="section-subtotal">
            ¥{{ (creditFixedTotal + variable.total).toLocaleString('ja-JP') }}
          </span>
        </div>

        <div class="sub-label">固定費（未請求）</div>
        <div v-for="(item, idx) in creditUnpaid" :key="'cu' + idx" class="sub-item">
          <div class="sub-name-wrap">
            <span class="sub-name">{{ item.name }}</span>
            <span v-if="item.freq === '年1'" class="badge yearly">年1</span>
          </div>
          <span class="sub-amount">¥{{ Number(item.amount || 0).toLocaleString('ja-JP') }}</span>
        </div>
        <div v-if="!creditUnpaid.length" class="sub-empty">—</div>

        <template v-if="creditPaid.length">
          <div class="sub-label">固定費（請求済）</div>
          <div v-for="(item, idx) in creditPaid" :key="'cp' + idx" class="sub-item paid-item">
            <div class="sub-name-wrap">
              <span class="sub-name paid-name">{{ item.name }}</span>
              <span v-if="item.freq === '年1'" class="badge yearly">年1</span>
            </div>
            <span class="sub-amount paid-amount">¥{{ Number(item.amount || 0).toLocaleString('ja-JP') }} ✓</span>
          </div>
        </template>

        <div class="sub-label">変動費</div>
        <div class="sub-item">
          <span class="sub-name">クレカ利用 ({{ variable.count }}件)</span>
          <span class="sub-amount">¥{{ variable.total.toLocaleString('ja-JP') }}</span>
        </div>
      </div>

      <!-- 口座引落 -->
      <div v-if="bankFixed.length" class="payment-section">
        <div class="section-header">
          <span>口座引落</span>
          <span class="section-subtotal">
            ¥{{ bankFixedTotal.toLocaleString('ja-JP') }}
          </span>
        </div>
        <div v-for="(item, idx) in bankFixed" :key="'bf' + idx" class="sub-item">
          <div class="sub-name-wrap">
            <span class="sub-name">{{ item.name }}</span>
            <span v-if="item.freq === '年1'" class="badge yearly">年1</span>
          </div>
          <span class="sub-amount">¥{{ Number(item.amount || 0).toLocaleString('ja-JP') }}</span>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.sub-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: var(--bg-card);
  border-radius: 10px;
  margin-bottom: 16px;
}

.sub-total.grand {
  background: var(--accent, #e74c3c);
  color: #fff;
}

.sub-total.grand .label {
  color: rgba(255, 255, 255, 0.8);
}

.sub-total .label {
  font-size: 13px;
  color: var(--text-secondary);
}

.sub-total .value {
  font-size: 20px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}

.payment-section {
  margin-bottom: 16px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  font-weight: 700;
  padding: 8px 0;
  border-bottom: 2px solid var(--border);
  margin-bottom: 4px;
}

.section-subtotal {
  font-variant-numeric: tabular-nums;
  color: var(--text-secondary);
}

.sub-label {
  font-size: 11px;
  color: var(--text-secondary);
  font-weight: 600;
  letter-spacing: 0.5px;
  margin-top: 8px;
  margin-bottom: 2px;
  padding-left: 4px;
}

.sub-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 4px;
  font-size: 14px;
}

.sub-name-wrap {
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
}

.sub-name {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.sub-amount {
  font-variant-numeric: tabular-nums;
  font-weight: 600;
  white-space: nowrap;
}

.sub-empty {
  padding: 4px;
  color: var(--text-secondary);
  font-size: 13px;
}

.badge {
  font-size: 10px;
  padding: 1px 6px;
  border-radius: 4px;
  font-weight: 600;
  white-space: nowrap;
}

.badge.yearly {
  background: rgba(52, 152, 219, 0.2);
  color: #3498db;
}

.paid-item {
  opacity: 0.5;
}

.paid-name {
  text-decoration: line-through;
}

.paid-amount {
  color: var(--text-secondary);
}
</style>
