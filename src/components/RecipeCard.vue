<script setup>
import { ref, computed, onMounted } from 'vue'
import { fetchRecipes } from '../utils/api.js'

const recipes = ref([])
const loading = ref(true)
const expandedIdx = ref(null)

onMounted(async () => {
  try {
    recipes.value = await fetchRecipes()
  } catch {
    recipes.value = []
  } finally {
    loading.value = false
  }
})

// 作れるものを上に、マッチ率高い順
const sorted = computed(() =>
  [...recipes.value].sort((a, b) => {
    if (a.canMake !== b.canMake) return a.canMake ? -1 : 1
    const rateA = a.totalIngredients ? a.matchCount / a.totalIngredients : 0
    const rateB = b.totalIngredients ? b.matchCount / b.totalIngredients : 0
    return rateB - rateA
  })
)

function toggleExpand(idx) {
  expandedIdx.value = expandedIdx.value === idx ? null : idx
}
</script>

<template>
  <div class="card">
    <h2>レシピ</h2>
    <div v-if="loading" class="loading">読み込み中...</div>
    <div v-else-if="!recipes.length" class="empty">レシピがありません</div>
    <div v-else class="recipe-list">
      <div
        v-for="(r, idx) in sorted"
        :key="idx"
        class="recipe-item"
        :class="{ expanded: expandedIdx === idx }"
      >
        <div class="recipe-header" @click="toggleExpand(idx)">
          <div class="recipe-title-wrap">
            <span class="recipe-name">{{ r.name }}</span>
            <span v-if="r.canMake" class="badge can-make">作れる</span>
            <span v-else class="badge partial">{{ r.matchCount }}/{{ r.totalIngredients }}</span>
          </div>
          <span class="expand-icon">{{ expandedIdx === idx ? '▲' : '▼' }}</span>
        </div>

        <div v-if="expandedIdx === idx" class="recipe-detail">
          <div class="detail-section">
            <div class="detail-label">材料</div>
            <div v-for="(ing, i) in r.ingredients" :key="'i' + i" class="ingredient-item">
              <span :class="{ 'in-fridge': ing.inFridge, 'not-in-fridge': !ing.inFridge }">
                {{ ing.name }}
              </span>
              <span class="ing-amount">{{ ing.amount }}</span>
            </div>
          </div>

          <div v-if="r.seasonings.length" class="detail-section">
            <div class="detail-label">調味料</div>
            <div v-for="(s, i) in r.seasonings" :key="'s' + i" class="ingredient-item">
              <span>{{ s.name }}</span>
              <span class="ing-amount">{{ s.amount }}</span>
            </div>
          </div>

          <div v-if="r.steps.length" class="detail-section">
            <div class="detail-label">手順</div>
            <ol class="steps-list">
              <li v-for="(step, i) in r.steps" :key="'st' + i">{{ step }}</li>
            </ol>
          </div>

          <div v-if="r.note" class="detail-section">
            <div class="detail-label">メモ</div>
            <p class="recipe-note">{{ r.note }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.recipe-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.recipe-item {
  border: 1px solid var(--border);
  border-radius: 8px;
  overflow: hidden;
}

.recipe-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

.recipe-header:active {
  background: rgba(255, 255, 255, 0.03);
}

.recipe-title-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.recipe-name {
  font-size: 15px;
  font-weight: 600;
}

.expand-icon {
  font-size: 11px;
  color: var(--text-secondary);
  flex-shrink: 0;
}

.badge {
  font-size: 10px;
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: 600;
  white-space: nowrap;
}

.badge.can-make {
  background: rgba(39, 174, 96, 0.2);
  color: #27ae60;
}

.badge.partial {
  background: rgba(243, 156, 18, 0.2);
  color: #f39c12;
}

.recipe-detail {
  padding: 0 12px 12px;
}

.detail-section {
  margin-top: 10px;
}

.detail-label {
  font-size: 11px;
  font-weight: 600;
  color: var(--text-secondary);
  letter-spacing: 0.5px;
  margin-bottom: 4px;
}

.ingredient-item {
  display: flex;
  justify-content: space-between;
  padding: 4px 0;
  font-size: 14px;
}

.in-fridge {
  color: #27ae60;
}

.not-in-fridge {
  color: var(--text-secondary);
}

.ing-amount {
  color: var(--text-secondary);
  font-size: 13px;
}

.steps-list {
  margin: 0;
  padding-left: 20px;
  font-size: 14px;
}

.steps-list li {
  padding: 3px 0;
}

.recipe-note {
  font-size: 13px;
  color: var(--text-secondary);
  margin: 0;
}
</style>
