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
  const isSameDay =
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()

  // 如果是同一天只返回时间，否则返回完整日期时间
  if (isSameDay) {
    return date.toLocaleTimeString()
  }
  return date.toLocaleString()
}
