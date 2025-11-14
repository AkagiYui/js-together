import { H3Event } from 'h3'
import {
  analyzeSongPage,
  createJob,
  createSheet,
  jobToPublic,
  saveJob,
  findReusableJobBySongUrl,
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

  const existingJob = findReusableJobBySongUrl(songUrl)
  if (existingJob) {
    return jobToPublic(existingJob)
  }

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

