const GAS_URL_KEY = 'dashboard_gas_url'

export function getGasUrl() {
  return localStorage.getItem(GAS_URL_KEY) || ''
}

export function setGasUrl(url) {
  localStorage.setItem(GAS_URL_KEY, url)
}

let _cbId = 0

function fetchJsonp(params) {
  const url = getGasUrl()
  if (!url) return Promise.reject(new Error('GAS URLが未設定です'))

  const cbName = '__gasCb' + (++_cbId)
  params.callback = cbName
  const qs = new URLSearchParams(params).toString()

  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    const timeout = setTimeout(() => {
      cleanup()
      reject(new Error('タイムアウトしました'))
    }, 15000)

    function cleanup() {
      clearTimeout(timeout)
      delete window[cbName]
      script.remove()
    }

    window[cbName] = (data) => {
      cleanup()
      resolve(data)
    }

    script.src = `${url}?${qs}`
    script.onerror = () => {
      cleanup()
      reject(new Error('データの取得に失敗しました'))
    }
    document.body.appendChild(script)
  })
}

function postGas(body) {
  const url = getGasUrl()
  if (!url) return Promise.reject(new Error('GAS URLが未設定です'))

  return fetch(url, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'text/plain' },
    body: JSON.stringify(body),
  }).then(() => ({ success: true }))
}

// ─── GET endpoints ───

export function fetchCreditData(year, month) {
  const params = { action: 'credit' }
  if (year) params.year = year
  if (month) params.month = month
  return fetchJsonp(params)
}

export function fetchBudgets() {
  return fetchJsonp({ action: 'budgets' })
}

export function fetchSubscriptions() {
  return fetchJsonp({ action: 'subscriptions' })
}

export function fetchCalendar(days = 7) {
  return fetchJsonp({ action: 'calendar', days })
}

export function fetchTasks() {
  return fetchJsonp({ action: 'tasks' })
}

// ─── POST endpoints ───

export function addTask(text) {
  return postGas({ action: 'addTask', text })
}

export function updateTask(id, updates) {
  return postGas({ action: 'updateTask', id, ...updates })
}
