<script setup lang="ts">
import { ref, onMounted } from 'vue'

// 定义构建信息的类型
interface BuildInfo {
  version?: string
  buildTime?: string
  gitCommit?: string
  [key: string]: any
}

// 获取环境变量
const backendBaseUrl = import.meta.env.VITE_BACKEND_BASE_URL

// 响应式数据
const buildInfo = ref<BuildInfo | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

// 获取构建信息
const fetchBuildInfo = async () => {
  loading.value = true
  error.value = null

  try {
    const response = await fetch(`${backendBaseUrl}/healthz`)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    buildInfo.value = data
  } catch (err) {
    error.value = err instanceof Error ? err.message : '获取构建信息失败'
    console.error('获取构建信息时出错:', err)
  } finally {
    loading.value = false
  }
}

// 组件挂载时获取数据
onMounted(() => {
  fetchBuildInfo()
})

// 重新加载数据
const reload = () => {
  fetchBuildInfo()
}
</script>

<template>
  <div class="about-page">
    <h1>关于页面</h1>

    <div class="navigation">
      <RouterLink to="/">返回首页</RouterLink>
    </div>

    <div class="build-info-section">
      <h2>后端构建信息</h2>

      <!-- 加载状态 -->
      <div v-if="loading" class="loading">
        <div class="spinner"></div>
        <p>正在加载构建信息...</p>
      </div>

      <!-- 错误状态 -->
      <div v-else-if="error" class="error">
        <p>❌ {{ error }}</p>
        <button @click="reload" class="retry-button">重试</button>
      </div>
      
      <!-- 成功状态 - 显示构建信息 -->
      <div v-else-if="buildInfo" class="build-info">
        <div class="info-grid">
          <template v-for="(value, key) in buildInfo" :key="key">
            <div class="info-item">
              <span class="info-label">{{ key }}:</span>
              <span class="info-value">{{ 
                typeof value === 'object' ? JSON.stringify(value, null, 2) : value 
              }}</span>
            </div>
          </template>
        </div>
        
        <button @click="reload" class="reload-button">刷新数据</button>
      </div>
      
      <!-- 无数据状态 -->
      <div v-else class="no-data">
        <p>暂无构建信息</p>
        <button @click="reload" class="retry-button">重试</button>
      </div>
    </div>


  </div>
</template>

<style scoped>
.about-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

h1 {
  color: #42b983;
  margin-bottom: 1rem;
}

h2 {
  color: #2c3e50;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
}

.navigation {
  margin-bottom: 2rem;
}

.navigation a {
  color: #42b983;
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border: 1px solid #42b983;
  border-radius: 4px;
  transition: all 0.3s;
}

.navigation a:hover {
  background-color: #42b983;
  color: white;
}

.build-info-section {
  background-color: #f5f5f5;
  padding: 2rem;
  border-radius: 8px;
  margin-bottom: 2rem;
}

/* 加载状态 */
.loading {
  text-align: center;
  padding: 2rem;
}

.spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #42b983;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 错误状态 */
.error {
  text-align: center;
  padding: 2rem;
  color: #e74c3c;
}

.error p {
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

/* 构建信息展示 */
.build-info {
  animation: fadeIn 0.5s;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.info-grid {
  display: grid;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.info-item {
  background-color: white;
  padding: 1rem;
  border-radius: 4px;
  border-left: 4px solid #42b983;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 1rem;
  align-items: start;
}

.info-label {
  font-weight: 600;
  color: #2c3e50;
  text-transform: capitalize;
}

.info-value {
  color: #555;
  word-break: break-all;
  white-space: pre-wrap;
  font-family: 'Courier New', monospace;
}

/* 按钮样式 */
.retry-button,
.reload-button {
  padding: 0.75rem 1.5rem;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: background-color 0.3s;
}

.retry-button:hover,
.reload-button:hover {
  background-color: #359268;
}

.retry-button:active,
.reload-button:active {
  transform: scale(0.98);
}

/* 无数据状态 */
.no-data {
  text-align: center;
  padding: 2rem;
  color: #7f8c8d;
}

</style>

