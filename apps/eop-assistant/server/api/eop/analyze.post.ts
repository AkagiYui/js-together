import { H3Event } from 'h3'
import {
  analyzeSongPage,
  createJob,
  createSheet,
  jobToPublic,
  saveJob,
  findReusableJobBySongUrl,
  resetFailedJob,
} from '../../utils/eop-core'

interface AnalyzeBody {
  url?: string
}

export default defineEventHandler(async (event: H3Event) => {
  const body = (await readBody(event)) as AnalyzeBody
  const songUrl = body?.url?.trim()
  if (!songUrl) {
    throw createError({ statusCode: 400, message: '缺少歌曲链接' })
  }

  // 查找可复用的任务（包括失败的任务）
  const existingJob = findReusableJobBySongUrl(songUrl)
  if (existingJob) {
    // 如果任务已完成，直接返回
    if (existingJob.status === 'completed') {
      return jobToPublic(existingJob)
    }

    // 如果任务正在处理中，直接返回
    if (existingJob.status === 'processing') {
      return jobToPublic(existingJob)
    }

    // 如果任务失败了，自动重置并重新处理
    if (existingJob.status === 'error') {
      resetFailedJob(existingJob)
      // 重置后继续使用这个任务，不创建新任务
      return jobToPublic(existingJob)
    }

    // 如果任务是 pending 状态，直接返回
    return jobToPublic(existingJob)
  }

  // 没有找到可复用的任务，创建新任务
  const job = createJob(songUrl)

  try {
    const { title, sheets } = await analyzeSongPage(songUrl)
    job.songTitle = title
    job.sheets = sheets.map((s) => createSheet(s.id, s.name, s.pageUrl))
    saveJob(job)
    return jobToPublic(job)
  } catch (error: any) {
    job.status = 'error'
    job.error = error?.message || String(error)
    saveJob(job)
    throw createError({ statusCode: 500, message: job.error })
  }
})

