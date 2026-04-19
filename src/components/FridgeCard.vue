<script setup>
import { ref, computed, onMounted } from 'vue'
import { fetchFridge, addFridgeItem, updateFridgeItem } from '../utils/api.js'

const items = ref([])
const loading = ref(true)
const activeTab = ref('冷蔵')

const newName = ref('')
const newQty = ref(1)
const newStorage = ref('冷蔵')

onMounted(async () => {
  try {
    items.value = await fetchFridge()
  } catch {
    items.value = []
  } finally {
    loading.value = false
  }
})

const filteredItems = computed(() =>
  items.value.filter(i => i.storage === activeTab.value)
)

async function addItem() {
  const name = newName.value.trim()
  if (!name) return
  const tempId = String(Date.now())
  items.value.push({ id: tempId, name, quantity: newQty.value, storage: newStorage.value })
  newName.value = ''
  newQty.value = 1
  try {
    await addFridgeItem(name, newQty.value, newStorage.value)
  } catch { /* no-cors */ }
}

async function changeQty(item, delta) {
  const newVal = item.quantity + delta
  if (newVal <= 0) {
    items.value = items.value.filter(i => i.id !== item.id)
    try { await updateFridgeItem(item.id, { delete: true }) } catch {}
    return
  }
  item.quantity = newVal
  try { await updateFridgeItem(item.id, { quantity: newVal }) } catch {}
}

async function removeItem(item) {
  items.value = items.value.filter(i => i.id !== item.id)
  try { await updateFridgeItem(item.id, { delete: true }) } catch {}
}
</script>

<template>
  <div class="card">
    <h2>冷蔵庫</h2>

    <div class="tabs">
      <button
        class="tab" :class="{ active: activeTab === '冷蔵' }"
        @click="activeTab = '冷蔵'"
      >冷蔵</button>
      <button
        class="tab" :class="{ active: activeTab === '冷凍' }"
        @click="activeTab = '冷凍'"
      >冷凍</button>
    </div>

    <form class="add-form" @submit.prevent="addItem">
      <input v-model="newName" type="text" placeholder="食材名" class="input-name" />
      <input v-model.number="newQty" type="number" min="1" class="input-qty" />
      <select v-model="newStorage" class="input-storage">
        <option>冷蔵</option>
        <option>冷凍</option>
      </select>
      <button class="btn btn-primary" type="submit">追加</button>
    </form>

    <div v-if="loading" class="loading">読み込み中...</div>
    <template v-else>
      <div class="fridge-list">
        <div v-for="item in filteredItems" :key="item.id" class="fridge-item">
          <span class="item-name">{{ item.name }}</span>
          <div class="item-controls">
            <button class="qty-btn" @click="changeQty(item, -1)">−</button>
            <span class="item-qty">{{ item.quantity }}</span>
            <button class="qty-btn" @click="changeQty(item, 1)">+</button>
            <button class="btn btn-danger btn-sm" @click="removeItem(item)">削除</button>
          </div>
        </div>
      </div>
      <div v-if="!filteredItems.length" class="empty">食材がありません</div>
    </template>
  </div>
</template>

<style scoped>
.tabs {
  display: flex;
  gap: 0;
  margin-bottom: 12px;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid var(--border);
}

.tab {
  flex: 1;
  padding: 8px;
  font-size: 14px;
  font-weight: 600;
  border: none;
  background: transparent;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s;
}

.tab.active {
  background: var(--accent);
  color: #fff;
}

.add-form {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

.input-name {
  flex: 1;
  min-width: 0;
}

.input-qty {
  width: 50px;
  text-align: center;
}

.input-storage {
  width: 70px;
}

.fridge-list {
  display: flex;
  flex-direction: column;
  max-height: 300px;
  overflow-y: auto;
}

.fridge-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid var(--border);
}

.item-name {
  font-size: 15px;
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.item-controls {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
}

.qty-btn {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 1px solid var(--border);
  background: transparent;
  color: var(--text);
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
}

.qty-btn:active {
  background: var(--border);
}

.item-qty {
  font-size: 15px;
  font-weight: 600;
  min-width: 20px;
  text-align: center;
  font-variant-numeric: tabular-nums;
}

.btn-sm {
  padding: 4px 8px;
  font-size: 12px;
}
</style>
