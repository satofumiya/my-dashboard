<script setup>
import { ref, provide } from 'vue'
import { getGasUrl, setGasUrl } from './utils/api.js'

const gasUrl = ref(getGasUrl())
const showSettings = ref(!getGasUrl())

function openSettings() {
  showSettings.value = true
}

function saveSettings() {
  setGasUrl(gasUrl.value.trim())
  showSettings.value = false
  location.reload()
}

provide('openSettings', openSettings)
</script>

<template>
  <div v-if="showSettings" class="card">
    <h2>API設定</h2>
    <p style="margin-bottom: 12px; color: var(--text-secondary);">
      GAS Web AppのデプロイURLを入力してください
    </p>
    <form @submit.prevent="saveSettings" style="display: flex; gap: 12px;">
      <input v-model="gasUrl" type="url" placeholder="https://script.google.com/macros/s/.../exec" />
      <button class="btn btn-primary" type="submit">保存</button>
    </form>
  </div>
  <template v-else>
    <RouterView />
  </template>
</template>
