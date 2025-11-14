import { randomUUID } from 'node:crypto'
import * as cheerio from 'cheerio'

export type EopSheetKind = 'stave' | 'number'
export type EopJobStatus = 'pending' | 'processing' | 'completed' | 'error'
export type EopSheetStatus = 'pending' | 'analyzing' | 'downloading' | 'generating' | 'completed' | 'error'

export interface EopSheet {
  id: EopSheetKind
  name: string
  pageUrl: string
  status: EopSheetStatus
  imageUrls: string[]
  totalImages: number | null
  downloadedImages: number
  pdfBytes?: Uint8Array
  error?: string
}

export interface EopJob {
  id: string
  songUrl: string
  songTitle?: string
  createdAt: number
  status: EopJobStatus
  sheets: EopSheet[]
  error?: string
}

export interface EopJobPublicSheet {
  id: EopSheetKind
  name: string
  pageUrl: string
  status: EopSheetStatus
  totalImages: number | null
  downloadedImages: number
  error?: string
}

export interface EopJobPublic {
  id: string
  songUrl: string
  songTitle?: string
  createdAt: number
  status: EopJobStatus
  sheets: EopJobPublicSheet[]
  error?: string
}

const jobStore = new Map<string, EopJob>()

const JOB_TTL_MS = 60 * 60 * 1000 // 1 个小时

const EOP_HOST = 'www.everyonepiano.cn'
export const USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36'

function isJobExpired(job: EopJob, now = Date.now()) {
  return now - job.createdAt > JOB_TTL_MS
}

export function purgeExpiredJobs(now = Date.now()) {
  for (const [id, job] of jobStore) {
    if (isJobExpired(job, now)) {
      jobStore.delete(id)
    }
  }
}

export function createJob(songUrl: string): EopJob {
  return { id: randomUUID(), songUrl, createdAt: Date.now(), status: 'pending', sheets: [] }
}

export function saveJob(job: EopJob) {
  jobStore.set(job.id, job)
}

export function getJob(id: string) {
  purgeExpiredJobs()
  return jobStore.get(id)
}

// 
export function findReusableJobBySongUrl(songUrl: string): EopJob | undefined {
  const now = Date.now()
  purgeExpiredJobs(now)
  const targetId = extractSongId(songUrl)
  if (!targetId) return undefined

  let latest: EopJob | undefined
  for (const job of jobStore.values()) {
    if (isJobExpired(job, now)) continue
    if (job.status === 'error') continue

    const jobSongId = extractSongId(job.songUrl)
    if (jobSongId !== targetId) continue

    if (!latest || job.createdAt > latest.createdAt) {
      latest = job
    }
  }

  return latest
}

export function jobToPublic(job: EopJob): EopJobPublic {
  return {
    id: job.id,
    songUrl: job.songUrl,
    songTitle: job.songTitle,
    createdAt: job.createdAt,
    status: job.status,
    error: job.error,
    sheets: job.sheets.map((s) => ({
      id: s.id,
      name: s.name,
      pageUrl: s.pageUrl,
      status: s.status,
      totalImages: s.totalImages,
      downloadedImages: s.downloadedImages,
      error: s.error,
    })),
  }
}

// 从任意人人钢琴相关链接中提取歌曲编号，例如：Music-14118.html / Stave-14118.html / Number-14118.html
export function extractSongId(url: string): string | null {
  const match = url.match(/(Music|Stave|Number)-(\d+)\.html/i)
  return match ? match[2] : null
}

// 根据歌曲编号构造“歌曲详情页”地址（总是以 Music- 开头）
export function buildMusicUrl(id: string) {
  return `https://${EOP_HOST}/Music-${id}.html`
}

// 通用的文本抓取工具，会带上浏览器 User-Agent，避免被网站拦截
export async function fetchText(url: string) {
  const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT } })
  if (!res.ok) {
    throw new Error(`请求失败(${res.status})：${url}`)
  }
  return await res.text()
}

/**
 * 解析歌曲详情页：
 * 1. 始终先访问 Music-{id}.html
 * 2. 从页面中查找指向乐谱预览页的链接：
 *    - 五线谱：Stave-{id}.html
 *    - 双手简谱：Number-{id}.html
 * 3. 返回每种乐谱类型对应的预览页 URL
 */
export async function analyzeSongPage(songUrl: string): Promise<{ title?: string; sheets: EopSheet[] }> {
  const id = extractSongId(songUrl)
  if (!id) {
    throw new Error('无法从链接中解析歌曲编号，请确认链接类似 Music-XXXX.html')
  }

  const musicUrl = buildMusicUrl(id)
  const html = await fetchText(musicUrl)
  const $ = cheerio.load(html)

  const pageTitle = $('title').first().text().trim()
  let title = pageTitle
  if (title) {
    // 页面 title 通常类似于：【谱】富士山下-简单好听版-人人钢琴网
    title = title.replace(/-?\s*人人钢琴网.*$/u, '')
    title = title.replace(/^【谱】/u, '').trim()
  }

  const sheets: EopSheet[] = []

  // 优先：根据 href 中的 Stave-{id}.html / Number-{id}.html 精确匹配乐谱预览页
  const staveHref = findSheetPageHrefByPattern($, id, 'Stave')
  if (staveHref) {
    sheets.push(createSheet('stave', '五线谱', new URL(staveHref, musicUrl).href))
  }

  const numberHref = findSheetPageHrefByPattern($, id, 'Number')
  if (numberHref) {
    sheets.push(createSheet('number', '双手简谱', new URL(numberHref, musicUrl).href))
  }

  return { title: title || undefined, sheets }
}

/**
 * 在歌曲详情页中查找指向乐谱预览页的链接。
 * 示例：
 *   <a href="/Stave-14118.html" ...>
 *   <a href="/Number-14118.html" ...>
 */
function findSheetPageHrefByPattern($: cheerio.CheerioAPI, id: string, prefix: 'Stave' | 'Number') {
  const selector = `a[href*='${prefix}-${id}.html']`
  const el = $(selector).first()
  const href = el.attr('href')
  return href || undefined
}

// 创建单个乐谱任务，pageUrl 必须指向具体的乐谱预览页（Stave/Number 页面）
export function createSheet(id: EopSheetKind, name: string, pageUrl: string): EopSheet {
  return { id, name, pageUrl, status: 'pending', imageUrls: [], totalImages: null, downloadedImages: 0 }
}

