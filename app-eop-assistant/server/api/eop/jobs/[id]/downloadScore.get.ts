import { H3Event } from 'h3'
import { getJob } from '../../../../utils/eop-core'

export default defineEventHandler(async (event: H3Event) => {
  const id = getRouterParam(event, 'id')
  const query = getQuery(event)
  const kind = (query.kind as 'stave' | 'number' | undefined) || null

  if (!id || !kind) {
    throw createError({ statusCode: 400, message: '缺少任务 id 或乐谱类型(kind)' })
  }

  const job = getJob(id)
  if (!job) {
    throw createError({ statusCode: 404, message: '任务不存在或已过期' })
  }

  const sheet = job.sheets.find((s) => s.id === kind)
  if (!sheet || !sheet.pdfBytes) {
    throw createError({ statusCode: 404, message: 'PDF 尚未生成或乐谱类型不存在' })
  }

  const filename = `${job.songTitle || 'score'}-${sheet.name}.pdf`
  setResponseHeaders(event, {
    'Content-Type': 'application/pdf',
    'Content-Disposition': `attachment; filename*=UTF-8''${encodeURIComponent(filename)}`,
  })

  return new Uint8Array(sheet.pdfBytes)
})

