import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Import from '../views/Import.vue'
import Login from '../views/Login.vue'
import Portfolio from '../views/Portfolio.vue'


const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/import',
    name: 'import',
    component: Import
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/portfolio',
    name: 'portfolio',
    component: Portfolio
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
