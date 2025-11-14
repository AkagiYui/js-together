<template>
  <div class="min-h-screen bg-gray-50 text-gray-900">
    <NuxtRouteAnnouncer />

    <UContainer class="py-10">
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <img src="/favicon.ico" alt="EOP" width="32" height="32" class="rounded" />
              <div>
                <h1 class="text-lg font-semibold text-highlighted">任务列表</h1>
                <p class="text-xs text-gray-500">查看所有乐谱下载任务的状态</p>
              </div>
            </div>
            <NuxtLink to="/">
              <UButton variant="ghost" size="sm">返回首页</UButton>
            </NuxtLink>
          </div>
        </template>

        <div class="space-y-4">
          <div v-if="loading && !jobs.length" class="text-center py-8">
            <p class="text-sm text-gray-500">加载中...</p>
          </div>

          <div v-else-if="errorMessage" class="text-center py-8">
            <p class="text-sm text-red-600">{{ errorMessage }}</p>
            <UButton @click="fetchJobs" variant="outline" size="sm" class="mt-4">
              重试
            </UButton>
          </div>

          <div v-else-if="!jobs.length" class="text-center py-8">
            <p class="text-sm text-gray-500">暂无任务</p>
            <NuxtLink to="/">
              <UButton variant="outline" size="sm" class="mt-4">创建新任务</UButton>
            </NuxtLink>
          </div>

          <div v-else class="space-y-4">
            <div class="flex items-center justify-between">
              <p class="text-sm text-gray-600">共 {{ jobs.length }} 个任务</p>
              <p class="text-xs text-gray-500">
                最后更新: {{ lastUpdateTime }}
              </p>
            </div>

            <UTable :data="jobs" :columns="columns">
              <template #songTitle-cell="{ row }">
                {{ asJob(row.original).songTitle || '未知歌曲' }}
              </template>

              <template #status-cell="{ row }">
                <UBadge
                  size="xs"
                  :color="getStatusColor(asJob(row.original).status)"
                >
                  {{ humanJobStatus(asJob(row.original).status) }}
                </UBadge>
              </template>

              <template #sheets-cell="{ row }">
                <div class="space-y-1">
                  <div
                    v-for="sheet in asJob(row.original).sheets"
                    :key="sheet.id"
                    class="flex items-center gap-2 text-xs"
                  >
                    <span class="text-gray-600">{{ sheet.name }}</span>
                    <UBadge size="xs" :color="getSheetStatusColor(sheet.status)">
                      {{ humanSheetStatus(sheet) }}
                    </UBadge>
                    <span v-if="sheet.totalImages" class="text-gray-400">
                      {{ sheet.downloadedImages }}/{{ sheet.totalImages }}
                    </span>
                    <span v-else class="text-gray-400">
                      {{ sheet.downloadedImages }}
                    </span>
                  </div>
                </div>
              </template>

              <template #createdAt-cell="{ row }">
                {{ formatTime(asJob(row.original).createdAt) }}
              </template>

              <template #actions-cell="{ row }">
                <div class="flex flex-wrap gap-2">
                  <UButton
                    v-for="sheet in asJob(row.original).sheets"
                    :key="sheet.id"
                    size="xs"
                    variant="outline"
                    :disabled="sheet.status !== 'completed'"
                    :to="
                      sheet.status === 'completed'
                        ? getDownloadUrl(asJob(row.original).id, sheet.id)
                        : undefined
                    "
                  >
                    下载{{ sheet.name }}
                  </UButton>
                </div>
              </template>
            </UTable>
          </div>
        </div>
      </UCard>
    </UContainer>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import type { TableColumn } from '@nuxt/ui'

type SheetKind = 'stave' | 'number'

interface Sheet {
  id: SheetKind
  name: string
  pageUrl: string
  status: string
  totalImages: number | null
  downloadedImages: number
  error?: string
}

interface Job {
  id: string
  songUrl: string
  songTitle?: string
  createdAt: number
  status: 'pending' | 'processing' | 'completed' | 'error'
  sheets: Sheet[]
  error?: string
}

const jobs = ref<Job[]>([])
const loading = ref(false)
const errorMessage = ref<string | null>(null)
const lastUpdateTime = ref<string>('')
let refreshTimer: ReturnType<typeof setInterval> | null = null

// 使用 useFetch 加载初始数据
const { data: initialJobs } = await useFetch<Job[]>('/api/eop/jobs')
if (initialJobs.value) {
  jobs.value = initialJobs.value
  lastUpdateTime.value = new Date().toLocaleTimeString('zh-CN')
}

// 正确定义 columns 的类型，使用 Nuxt UI v4 的 TableColumn
const columns: TableColumn<Job>[] = [
  { accessorKey: 'songTitle', header: '歌曲名称' },
  { accessorKey: 'status', header: '状态' },
  { accessorKey: 'sheets', header: '乐谱进度' },
  { accessorKey: 'createdAt', header: '创建时间' },
  { id: 'actions', header: '操作' },
]

// 类型安全的辅助函数，用于将 UTable 的 row 转换为 Job 类型
// 这比直接使用 (row as unknown as Job) 更清晰，并且集中了类型转换逻辑
function asJob(row: unknown): Job {
  return row as Job
}

async function fetchJobs() {
  loading.value = true
  errorMessage.value = null
  try {
    const data = await $fetch<Job[]>('/api/eop/jobs')
    console.log('Fetched jobs:', data)
    jobs.value = data
    lastUpdateTime.value = new Date().toLocaleTimeString('zh-CN')
  } catch (error: unknown) {
    // 类型安全的错误处理
    const errorObj = error as { data?: { message?: string; statusMessage?: string }; message?: string }
    const data = errorObj?.data
    errorMessage.value =
      (data && (data.message || data.statusMessage)) ||
      errorObj?.message ||
      '获取任务列表失败，请稍后重试'
  } finally {
    loading.value = false
  }
}

function startAutoRefresh() {
  // 每 5 分钟刷新一次
  refreshTimer = setInterval(() => {
    fetchJobs()
  }, 5 * 60 * 1000)
}

function clearTimer() {
  if (refreshTimer) {
    clearInterval(refreshTimer)
    refreshTimer = null
  }
}

function getDownloadUrl(jobId: string, kind: SheetKind) {
  const params = new URLSearchParams({ kind })
  return `/api/eop/jobs/${jobId}/downloadScore?${params.toString()}`
}

function humanJobStatus(status: Job['status']) {
  if (status === 'pending') return '待开始'
  if (status === 'processing') return '处理中'
  if (status === 'completed') return '已完成'
  if (status === 'error') return '失败'
  return status
}

function humanSheetStatus(sheet: Sheet) {
  switch (sheet.status) {
    case 'pending':
      return '等待处理'
    case 'analyzing':
      return '分析中'
    case 'downloading':
      return '下载中'
    case 'generating':
      return '生成中'
    case 'completed':
      return '已完成'
    case 'error':
      return '失败'
    default:
      return sheet.status
  }
}

function getStatusColor(status: Job['status']) {
  switch (status) {
    case 'pending':
      return 'neutral'
    case 'processing':
      return 'info'
    case 'completed':
      return 'success'
    case 'error':
      return 'error'
    default:
      return 'neutral'
  }
}

function getSheetStatusColor(status: string) {
  switch (status) {
    case 'pending':
      return 'neutral'
    case 'analyzing':
    case 'downloading':
    case 'generating':
      return 'info'
    case 'completed':
      return 'success'
    case 'error':
      return 'error'
    default:
      return 'neutral'
  }
}

function formatTime(timestamp: number) {
  const date = new Date(timestamp)
  const now = new Date()
  const diff = now.getTime() - date.getTime()

  // 小于 1 分钟
  if (diff < 60 * 1000) {
    return '刚刚'
  }

  // 小于 1 小时
  if (diff < 60 * 60 * 1000) {
    const minutes = Math.floor(diff / (60 * 1000))
    return `${minutes} 分钟前`
  }

  // 小于 1 天
  if (diff < 24 * 60 * 60 * 1000) {
    const hours = Math.floor(diff / (60 * 60 * 1000))
    return `${hours} 小时前`
  }

  // 显示完整日期
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// 页面加载时获取数据并启动自动刷新（仅在客户端执行）
onMounted(async () => {
  await fetchJobs()
  startAutoRefresh()
})

// 组件卸载时清理定时器
onBeforeUnmount(clearTimer)
</script>
