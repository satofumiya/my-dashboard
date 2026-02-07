<script setup>
import { ref, computed, onMounted } from 'vue'
import { fetchTasks, addTask as apiAddTask, updateTask as apiUpdateTask } from '../utils/api.js'

const tasks = ref([])
const newTaskText = ref('')
const loading = ref(true)

const pendingTasks = computed(() => tasks.value.filter((t) => !t.done && t.done !== 'TRUE'))
const doneTasks = computed(() => tasks.value.filter((t) => t.done === true || t.done === 'TRUE'))

onMounted(async () => {
  try {
    tasks.value = await fetchTasks()
  } catch {
    tasks.value = []
  } finally {
    loading.value = false
  }
})

async function addTask() {
  const text = newTaskText.value.trim()
  if (!text) return
  // Optimistically add to UI
  const tempId = String(Date.now())
  tasks.value.unshift({ id: tempId, text, done: false, createdAt: new Date().toISOString() })
  newTaskText.value = ''
  try {
    await apiAddTask(text)
  } catch {
    // POST with no-cors won't return data, task is added server-side
  }
}

async function toggleTask(task) {
  const newDone = !(task.done === true || task.done === 'TRUE')
  task.done = newDone
  try {
    await apiUpdateTask(task.id, { done: newDone })
  } catch {
    // silent
  }
}

async function deleteTask(task) {
  tasks.value = tasks.value.filter((t) => t.id !== task.id)
  try {
    await apiUpdateTask(task.id, { delete: true })
  } catch {
    // silent
  }
}
</script>

<template>
  <div class="card">
    <h2>タスク</h2>
    <form class="task-form" @submit.prevent="addTask">
      <input v-model="newTaskText" type="text" placeholder="新しいタスクを入力..." />
      <button class="btn btn-primary" type="submit">追加</button>
    </form>

    <div v-if="loading" class="loading">読み込み中...</div>
    <template v-else>
      <div class="task-list">
        <div
          v-for="task in pendingTasks"
          :key="task.id"
          class="task-item"
        >
          <button class="task-check" @click="toggleTask(task)"></button>
          <span class="task-text">{{ task.text || '—' }}</span>
          <button class="btn btn-danger task-delete" @click="deleteTask(task)">削除</button>
        </div>
        <div
          v-for="task in doneTasks"
          :key="task.id"
          class="task-item done"
        >
          <button class="task-check checked" @click="toggleTask(task)">✓</button>
          <span class="task-text">{{ task.text || '—' }}</span>
          <button class="btn btn-danger task-delete" @click="deleteTask(task)">削除</button>
        </div>
      </div>
      <div v-if="!tasks.length" class="empty">タスクがありません</div>
    </template>
  </div>
</template>

<style scoped>
.task-form {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.task-form input {
  flex: 1;
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

.task-delete {
  padding: 6px 12px;
  font-size: 13px;
}
</style>
