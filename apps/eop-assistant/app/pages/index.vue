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
                <h1 class="text-lg font-semibold text-highlighted">人人钢琴乐谱下载助手</h1>
                <p class="text-xs text-gray-500">输入人人钢琴歌曲链接，服务器抓取乐谱图片并生成 PDF。</p>
              </div>
            </div>
            <NuxtLink to="/jobs">
              <UButton variant="outline" size="sm">查看任务列表</UButton>
            </NuxtLink>
          </div>
        </template>

        <div class="space-y-4">
          <UFormField
            label="歌曲链接"
            description="例如：https://www.everyonepiano.cn/Music-14118.html"
          >
            <UInput v-model="songUrl" placeholder="粘贴人人钢琴歌曲链接" />
          </UFormField>

          <div class="flex gap-2">
            <UButton :loading="loading" @click="onStart" color="primary">
              {{ currentJob ? '重新生成' : '开始生成 PDF' }}
            </UButton>
            <UButton variant="ghost" @click="onReset" :disabled="!currentJob && !errorMessage">
              重置
            </UButton>
          </div>

          <p v-if="errorMessage" class="text-sm text-red-600">
            {{ errorMessage }}
          </p>

          <div v-if="currentJob" class="space-y-3 pt-4 border-t border-gray-100">
            <div class="space-y-1 text-sm">
              <div class="text-muted">当前任务 ID</div>
              <div class="font-mono text-xs break-all text-highlighted">{{ currentJob.id }}</div>
              <div v-if="currentJob.songTitle">
                <span class="text-muted">歌曲名称：</span>
                <span class="font-medium text-highlighted">{{ currentJob.songTitle }}</span>
              </div>
              <div>
                <span class="text-muted">任务状态：</span>
                <span class="font-medium text-highlighted">{{ humanJobStatus(currentJob.status) }}</span>
              </div>
            </div>

            <div class="space-y-3">
              <h2 class="text-sm font-semibold text-highlighted">乐谱类型</h2>
              <div
                v-for="sheet in currentJob.sheets"
                :key="sheet.id"
                class="flex items-center justify-between gap-2 rounded border border-gray-100 px-3 py-2"
              >
                <div>
                  <div class="font-medium text-highlighted">
                    {{ sheet.name }} <span class="text-xs text-muted">({{ sheet.id }})</span>
                  </div>
                  <div class="text-xs text-muted">
                    状态：{{ humanSheetStatus(sheet) }}
                  </div>
                  <div v-if="sheet.error" class="text-xs text-red-600 mt-1">
                    {{ sheet.error }}
                  </div>
                </div>

                <div class="w-40">
                  <div v-if="sheet.totalImages">
                    <UProgress
                      :model-value="Math.round((sheet.downloadedImages / sheet.totalImages) * 100)"
                      size="xs"
                    />
                    <div class="mt-1 text-[11px] text-muted">
                      {{ sheet.downloadedImages }} / {{ sheet.totalImages }} 张图片
                    </div>
                  </div>
                  <div v-else class="text-[11px] text-dimmed">
                    等待开始下载…
                  </div>

                  <UButton
                    v-if="sheet.status === 'completed'"
                    :href="getDownloadUrl(sheet.id)"
                    variant="outline"
                    color="primary"
                    size="xs"
                    class="mt-2 w-full"
                  >
                    下载 PDF
                  </UButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </UCard>
    </UContainer>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'

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

const songUrl = ref('')
const currentJob = ref<Job | null>(null)
const loading = ref(false)
const errorMessage = ref<string | null>(null)
let pollTimer: ReturnType<typeof setInterval> | null = null

function clearTimer() {
  if (pollTimer) {
    clearInterval(pollTimer)
    pollTimer = null
  }
}

async function onStart() {
  if (!songUrl.value) {
    errorMessage.value = '请先输入歌曲链接'
    return
  }
  loading.value = true
  errorMessage.value = null
  clearTimer()
  try {
    const job = await $fetch<Job>('/api/eop/analyze', {
      method: 'POST',
      body: { url: songUrl.value },
    })
    currentJob.value = job
    startPolling()
  } catch (error: any) {
    const data = error?.data as any
    errorMessage.value =
      (data && (data.message || data.statusMessage)) ||
      error?.message ||
      '请求失败，请稍后重试'
  } finally {
    loading.value = false
  }
}

function startPolling() {
  if (!currentJob.value) return
  pollTimer = setInterval(async () => {
    if (!currentJob.value) return
    try {
      const job = await $fetch<Job>(`/api/eop/jobs/${currentJob.value.id}`)
      currentJob.value = job
      if (job.status === 'completed' || job.status === 'error') clearTimer()
    } catch {
      clearTimer()
    }
  }, 2000)
}

function onReset() {
  clearTimer()
  currentJob.value = null
  errorMessage.value = null
}

function getDownloadUrl(kind: SheetKind) {
  if (!currentJob.value) return '#'
  const params = new URLSearchParams({ kind })
  return `/api/eop/jobs/${currentJob.value.id}/downloadScore?${params.toString()}`
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
      return '分析乐谱页面…'
    case 'downloading':
      return '下载图片中…'
    case 'generating':
      return '生成 PDF 中…'
    case 'completed':
      return '已完成'
    case 'error':
      return '失败'
    default:
      return sheet.status
  }
}

onBeforeUnmount(clearTimer)
</script>


