import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from 'vue-router/auto-routes'
import './style.css'
import App from './App.vue'

// 创建路由实例
const router = createRouter({
  history: createWebHistory(),
  routes,
})

// 创建应用实例并使用路由
const app = createApp(App)
app.use(router)
app.mount('#app')
