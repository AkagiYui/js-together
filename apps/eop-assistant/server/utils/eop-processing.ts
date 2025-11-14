import * as cheerio from 'cheerio'
import { PDFDocument } from 'pdf-lib'
import { EopJob, EopSheet, USER_AGENT, extractSongId, fetchText } from './eop-core'

// 处理任务的主入口：遍历每种乐谱类型并生成 PDF

/**
 * 
 * 1. 
 * 2.  HTML
 * 3.  URL
 * 4.  PDF
 */
export async function processJob(job: EopJob) {
  if (!job.sheets.length) return
  job.status = 'processing'
  const songId = extractSongId(job.songUrl)

  for (const sheet of job.sheets) {
    sheet.status = 'analyzing'
    try {
      // pageUrl  (Stave / Number)
      const html = await fetchText(sheet.pageUrl)
      sheet.imageUrls = extractSheetImages(html, sheet.pageUrl, songId)
      sheet.totalImages = sheet.imageUrls.length
      if (!sheet.imageUrls.length) {
        sheet.status = 'error'
        sheet.error = '未找到乐谱图片'
        continue
      }
      await downloadImagesAndGeneratePdf(sheet)
    } catch (error: any) {
      sheet.status = 'error'
      sheet.error = error?.message || String(error)
    }
  }

  if (job.sheets.some((s) => s.status === 'completed')) {
    job.status = 'completed'
  } else if (job.sheets.some((s) => s.status === 'analyzing' || s.status === 'downloading' || s.status === 'generating')) {
    job.status = 'processing'
  } else {
    job.status = 'error'
  }
// 

}

/**
 *  HTML  URL :
 * -  DownMusicPNG  (EOP )
 * -  /pianomusic/  PNG/JPEG/GIF
 * -  logo icon
 */
function extractSheetImages(html: string, baseUrl: string, songId: string | null) {
  const $ = cheerio.load(html)
  const urls: string[] = []

  const addCandidate = (src?: string | null) => {
    if (!src) return
    const abs = new URL(src, baseUrl).href
    if (songId && !abs.includes(songId)) return
    if (!/\.(png|jpe?g|gif)$/i.test(abs)) return
    if (!abs.includes('/pianomusic/')) return
    const lower = abs.toLowerCase()
    if (['logo', 'icon', 'avatar', 'weixin', 'weibo', 'bilibili', 'douyin'].some((k) => lower.includes(k))) return
    urls.push(abs)
  }

  // 1) DownMusicPNG class 
  $('img.DownMusicPNG').each((_, el) => {
    addCandidate($(el).attr('src') || $(el).attr('data-src'))
  })

  // 2) img
  if (!urls.length) {
    $('img').each((_, el) => {
      addCandidate($(el).attr('src') || $(el).attr('data-src'))
    })
  }

  const unique = Array.from(new Set(urls))
  unique.sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
  return unique
}

async function downloadImagesAndGeneratePdf(sheet: EopSheet) {
  sheet.status = 'downloading'
  const images: { bytes: Uint8Array; contentType: string }[] = []
  for (const url of sheet.imageUrls) {
    const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT } })
    if (!res.ok) {
      throw new Error(`下载图片失败(${res.status})：${url}`)
    }
    const arrayBuffer = await res.arrayBuffer()
    images.push({ bytes: new Uint8Array(arrayBuffer), contentType: res.headers.get('content-type') || '' })
    sheet.downloadedImages += 1
  }
  sheet.status = 'generating'
  const pdfDoc = await PDFDocument.create()
  for (const image of images) {
    let embedded
    if (image.contentType.includes('png')) {
      embedded = await pdfDoc.embedPng(image.bytes)
    } else {
      embedded = await pdfDoc.embedJpg(image.bytes)
    }
    const { width, height } = embedded
    const page = pdfDoc.addPage([width, height])
    page.drawImage(embedded, { x: 0, y: 0, width, height })
  }
  sheet.pdfBytes = await pdfDoc.save()
  sheet.status = 'completed'
}

