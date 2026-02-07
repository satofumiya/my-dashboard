<script setup>
import { ref, onMounted } from 'vue'
import { fetchCalendar } from '../utils/api.js'

const events = ref([])
const loading = ref(true)
const error = ref('')

onMounted(async () => {
  try {
    events.value = await fetchCalendar(7)
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
})

function formatEventDate(dateStr) {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  if (isNaN(d)) return '—'
  const month = d.getMonth() + 1
  const day = d.getDate()
  const weekdays = ['日', '月', '火', '水', '木', '金', '土']
  return `${month}/${day}(${weekdays[d.getDay()]})`
}

function formatEventTime(start, end, allDay) {
  if (allDay) return '終日'
  const s = new Date(start)
  const e = new Date(end)
  if (isNaN(s) || isNaN(e)) return ''
  const fmt = (d) => `${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`
  return `${fmt(s)} - ${fmt(e)}`
}

function isToday(dateStr) {
  const d = new Date(dateStr)
  const now = new Date()
  return d.toDateString() === now.toDateString()
}
</script>

<template>
  <div class="card">
    <h2>スケジュール</h2>
    <div v-if="loading" class="loading">読み込み中...</div>
    <div v-else-if="error" class="empty" style="color: var(--accent);">{{ error }}</div>
    <div v-else-if="!events.length" class="empty">予定はありません</div>
    <div v-else class="schedule-list">
      <div
        v-for="(ev, i) in events.slice(0, 10)"
        :key="i"
        class="schedule-item"
        :class="{ today: isToday(ev.start) }"
      >
        <div class="schedule-date">{{ formatEventDate(ev.start) }}</div>
        <div class="schedule-detail">
          <div class="schedule-title">{{ ev.title || '(タイトルなし)' }}</div>
          <div class="schedule-time">{{ formatEventTime(ev.start, ev.end, ev.allDay) }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.schedule-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
  max-height: 400px;
  overflow-y: auto;
}

.schedule-item {
  display: flex;
  gap: 12px;
  align-items: center;
  padding: 10px 12px;
  border-radius: 8px;
  border-left: 3px solid var(--border);
}

.schedule-item.today {
  border-left-color: var(--accent);
  background: rgba(233, 69, 96, 0.08);
}

.schedule-date {
  font-size: 13px;
  color: var(--text-secondary);
  min-width: 72px;
  flex-shrink: 0;
}

.schedule-title {
  font-size: 15px;
}

.schedule-time {
  font-size: 12px;
  color: var(--text-secondary);
  margin-top: 2px;
}
</style>
