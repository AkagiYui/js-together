/**
 * 将毫秒时间戳格式化为带时区偏移的 RFC 3339 字符串
 *
 * @param ms - 毫秒时间戳
 * @param timeZone - IANA 时区名称（如 "Asia/Shanghai"），默认使用运行时环境的本地时区
 * @returns RFC 3339 格式字符串，如 "2026-03-05T18:30:00+08:00"
 */
export function formatTimestamp(ms: number, timeZone?: string): string {
  const date = new Date(ms)
  const tz = timeZone ?? Intl.DateTimeFormat().resolvedOptions().timeZone

  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  })

  const parts: Record<string, string> = {}
  for (const p of fmt.formatToParts(date)) {
    parts[p.type] = p.value
  }

  // 计算目标时区的 UTC 偏移量
  // 仅使用到秒，避免毫秒残留导致出现 `07:59.998...` 之类的非整分钟偏移
  const zonedUtcMs = Date.UTC(Number(parts.year), Number(parts.month) - 1, Number(parts.day), Number(parts.hour), Number(parts.minute), Number(parts.second))
  const utcMs = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds())
  const offsetMin = Math.round((zonedUtcMs - utcMs) / 60_000)
  const sign = offsetMin >= 0 ? "+" : "-"
  const absMin = Math.abs(offsetMin)
  const oh = String(Math.floor(absMin / 60)).padStart(2, "0")
  const om = String(absMin % 60).padStart(2, "0")
  const offset = offsetMin === 0 ? "Z" : `${sign}${oh}:${om}`

  return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}:${parts.second}${offset}`
}

/**
 * 将毫秒时间戳按指定 UTC 偏移（分钟）格式化为 "YYYY/MM/DD HH:mm:ss"
 */
export function formatTimestampCompact(ms: number, utcOffsetMinutes: number): string {
  const date = new Date(ms + utcOffsetMinutes * 60_000)
  const y = date.getUTCFullYear()
  const mo = String(date.getUTCMonth() + 1).padStart(2, "0")
  const d = String(date.getUTCDate()).padStart(2, "0")
  const h = String(date.getUTCHours()).padStart(2, "0")
  const mi = String(date.getUTCMinutes()).padStart(2, "0")
  const s = String(date.getUTCSeconds()).padStart(2, "0")
  return `${y}/${mo}/${d} ${h}:${mi}:${s}`
}

/**
 * 格式化时间戳为日期时间字符串，如果是同一天则只返回时间
 *
 * @param timestamp 时间戳（秒）
 * @param showDate 是否显示日期(默认显示非同一天的日期)
 */
export const formatDateTime = (timestamp: number, showDate?: boolean) => {
  const date = new Date(timestamp < 10000000000 ? timestamp * 1000 : timestamp)
  const today = new Date()

  if (showDate === true) {
    return date.toLocaleString()
  }
  if (showDate === false) {
    return date.toLocaleTimeString()
  }

  // 判断是否是同一天
  const isSameDay = date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear()

  // 如果是同一天只返回时间，否则返回完整日期时间
  if (isSameDay) {
    return date.toLocaleTimeString()
  }
  return date.toLocaleString()
}
