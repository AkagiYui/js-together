import { H3Event } from 'h3'
import { analyzeSongPage, createJob, createSheet, jobToPublic, saveJob } from '../../utils/eop-core'

interface AnalyzeBody {
  url?: string
}

export default defineEventHandler(async (event: H3Event) => {
  const body = (await readBody(event)) as AnalyzeBody
  const songUrl = body?.url?.trim()
  if (!songUrl) {
    throw createError({ statusCode: 400, statusMessage: '缺少歌曲链接' })
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
    throw createError({ statusCode: 500, statusMessage: job.error })
  }
})

