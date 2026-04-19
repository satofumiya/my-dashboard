<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { fetchRoutines, toggleRoutine as apiToggle } from '../utils/api.js'

const data = ref({ routines: [], period: 'morning', hour: 0, date: '' })
const loading = ref(true)
const currentHour = ref(new Date().getHours())

let timer = null

onMounted(async () => {
  try {
    data.value = await fetchRoutines()
  } catch {
    data.value = { routines: [], period: 'morning', hour: 0, date: '' }
  } finally {
    loading.value = false
  }
  // 1分ごとに時間帯を更新
  timer = setInterval(() => {
    currentHour.value = new Date().getHours()
  }, 60000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})

const currentPeriod = computed(() => {
  const h = currentHour.value
  if (h < 12) return 'morning'
  if (h >= 17) return 'night'
  return 'afternoon'
})

const sectionTitle = computed(() => {
  if (currentPeriod.value === 'morning') return '朝ルーティン'
  if (currentPeriod.value === 'night') return '夜ルーティン'
  return '今日のタスク'
})

const routineSection = computed(() => {
  const all = data.value.routines || []
  if (currentPeriod.value === 'morning') {
    return all.filter(r => r.type === '朝ルーティン' || r.type === '定期タスク')
  }
  if (currentPeriod.value === 'night') {
    return all.filter(r => r.type === '夜ルーティン' || r.type === '定期タスク')
  }
  return all.filter(r => r.type === '定期タスク')
})

const pendingRoutines = computed(() => routineSection.value.filter(r => !r.done))
const doneRoutines = computed(() => routineSection.value.filter(r => r.done))

const progressPercent = computed(() => {
  const total = routineSection.value.length
  if (!total) return 0
  return Math.round((doneRoutines.value.length / total) * 100)
})

function freqLabel(r) {
  if (r.frequency === '毎週') return '週次'
  if (r.frequency === '隔週') return '隔週'
  if (r.frequency === '毎月') return '月次'
  return ''
}

async function toggle(routine) {
  const newDone = !routine.done
  routine.done = newDone
  try {
    await apiToggle(routine.id, newDone)
  } catch {
    // no-cors
  }
}
</script>

<template>
  <div class="card">
    <h2>{{ sectionTitle }}</h2>
    <div v-if="loading" class="loading">読み込み中...</div>
    <template v-else>
      <div v-if="routineSection.length" class="routine-progress">
        <div class="progress-text">{{ doneRoutines.length }}/{{ routineSection.length }} 完了</div>
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: progressPercent + '%' }"></div>
        </div>
      </div>

      <div class="task-list">
        <div v-for="r in pendingRoutines" :key="r.id" class="task-item">
          <button class="task-check" @click="toggle(r)"></button>
          <span class="task-text">{{ r.title }}</span>
          <span v-if="freqLabel(r)" class="routine-badge">{{ freqLabel(r) }}</span>
        </div>
        <div v-for="r in doneRoutines" :key="r.id" class="task-item done">
          <button class="task-check checked" @click="toggle(r)">✓</button>
          <span class="task-text">{{ r.title }}</span>
        </div>
      </div>
      <div v-if="!routineSection.length" class="empty">ルーティンがありません</div>
    </template>
  </div>
</template>

<style scoped>
.routine-progress {
  margin-bottom: 12px;
}

.progress-text {
  font-size: 13px;
  color: var(--text-secondary);
  margin-bottom: 4px;
}

.progress-bar {
  height: 6px;
  background: var(--border);
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--success, #27ae60);
  border-radius: 3px;
  transition: width 0.3s ease;
}

.task-list {
  display: flex;
  flex-direction: column;
  max-height: 400px;
  overflow-y: auto;
}

.task-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid var(--border);
}

.task-check {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid var(--accent);
  background: transparent;
  color: var(--success);
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
}

.task-check.checked {
  background: var(--success);
  border-color: var(--success);
  color: #fff;
}

.task-text {
  flex: 1;
  font-size: 16px;
}

.task-item.done .task-text {
  text-decoration: line-through;
  color: var(--text-secondary);
}

.routine-badge {
  font-size: 10px;
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: 600;
  white-space: nowrap;
  background: rgba(52, 152, 219, 0.15);
  color: #3498db;
}
</style>
