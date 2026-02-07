import { createRouter, createWebHashHistory } from 'vue-router'
import DashboardPage from './pages/DashboardPage.vue'
import CreditDetailPage from './pages/CreditDetailPage.vue'

const routes = [
  { path: '/', component: DashboardPage },
  { path: '/credit', component: CreditDetailPage },
]

export default createRouter({
  history: createWebHashHistory(),
  routes,
})
