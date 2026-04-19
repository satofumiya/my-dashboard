import { createRouter, createWebHashHistory } from 'vue-router'
import DashboardPage from './pages/DashboardPage.vue'
import CreditDetailPage from './pages/CreditDetailPage.vue'
import FridgePage from './pages/FridgePage.vue'

const routes = [
  { path: '/', component: DashboardPage },
  { path: '/credit', component: CreditDetailPage },
  { path: '/fridge', component: FridgePage },
]

export default createRouter({
  history: createWebHashHistory(),
  routes,
})
