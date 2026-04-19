import { ref, computed, onMounted } from 'vue'
import { fetchSubscriptions } from './api.js'

export function useSubscriptions() {
  const data = ref({ fixed: [], variable: { total: 0, count: 0 } })
  const loading = ref(true)

  onMounted(async () => {
    try {
      data.value = await fetchSubscriptions()
    } catch {
      data.value = { fixed: [], variable: { total: 0, count: 0 } }
    } finally {
      loading.value = false
    }
  })

  const fixedItems = computed(() => data.value.fixed || [])
  const variable = computed(() => data.value.variable || { total: 0, count: 0 })

  const creditUnpaid = computed(() =>
    fixedItems.value.filter((i) => i.payment === 'クレカ' && !i.paid)
  )
  const creditPaid = computed(() =>
    fixedItems.value.filter((i) => i.payment === 'クレカ' && i.paid)
  )
  const bankFixed = computed(() =>
    fixedItems.value.filter((i) => i.payment === '口座引落')
  )

  const creditFixedTotal = computed(() =>
    creditUnpaid.value.reduce((s, i) => s + Number(i.amount || 0), 0)
  )
  const bankFixedTotal = computed(() =>
    bankFixed.value.reduce((s, i) => s + Number(i.amount || 0), 0)
  )
  const grandTotal = computed(() =>
    creditFixedTotal.value + variable.value.total + bankFixedTotal.value
  )

  return {
    data,
    loading,
    variable,
    creditUnpaid,
    creditPaid,
    bankFixed,
    creditFixedTotal,
    bankFixedTotal,
    grandTotal,
  }
}
