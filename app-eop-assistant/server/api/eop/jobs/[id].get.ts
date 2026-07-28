import { H3Event } from 'h3'
import { getJob, jobToPublic } from '../../../utils/eop-core'
import { processJob } from '../../../utils/eop-processing'

export default defineEventHandler(async (event: H3Event) => {
  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, message: '缺少任务 id' })
  }

  let job = getJob(id)
  if (!job) {
    throw createError({ statusCode: 404, message: '任务不存在或已过期' })
  }

  if (job.status === 'pending') {
    processJob(job).catch((error) => {
      job!.status = 'error'
      job!.error = (error as any)?.message || String(error)
    })
  }

  job = getJob(id)
  if (!job) {
    throw createError({ statusCode: 500, message: '任务状态异常' })
  }

  return jobToPublic(job)
})

