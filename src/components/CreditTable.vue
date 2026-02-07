<script setup>
defineProps({
  items: Array,
})

function formatAmount(amount) {
  return Number(amount).toLocaleString('ja-JP')
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return `${d.getMonth() + 1}/${d.getDate()}`
}
</script>

<template>
  <div class="table-wrap">
    <table>
      <thead>
        <tr>
          <th>日付</th>
          <th>利用先</th>
          <th>カテゴリ</th>
          <th class="text-right">金額</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in items" :key="item.unique_id">
          <td>{{ formatDate(item.date) }}</td>
          <td>{{ item.merchant }}</td>
          <td>{{ item.category || '—' }}</td>
          <td class="text-right amount">¥{{ formatAmount(item.amount) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.table-wrap {
  overflow-x: auto;
}

.text-right {
  text-align: right;
}
</style>
