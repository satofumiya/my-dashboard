<script setup>
import { useRouter } from 'vue-router'
import FridgeCard from '../components/FridgeCard.vue'
import RecipeCard from '../components/RecipeCard.vue'

const router = useRouter()
</script>

<template>
  <div class="page-header">
    <button class="btn btn-back" @click="router.push('/')">← 戻る</button>
    <h1>冷蔵庫</h1>
  </div>
  <FridgeCard />
  <RecipeCard />
</template>

<style scoped>
.page-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.page-header h1 {
  font-size: 24px;
}

.btn-back {
  padding: 6px 12px;
  font-size: 14px;
  background: transparent;
  border: 1px solid var(--border);
  border-radius: 8px;
  color: var(--text);
  cursor: pointer;
}

.btn-back:active {
  background: var(--border);
}
</style>
