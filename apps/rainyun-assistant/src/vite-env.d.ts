/// <reference types="vite/client" />

/**
 * 构建信息全局变量
 * 包含当前构建的 Git commit 信息和构建时间戳
 *
 * @example
 * ```typescript
 * // 获取构建信息
 * console.log(`Build ${__BUILD_INFO__.commitHash} at ${new Date(__BUILD_INFO__.buildTimestamp).toLocaleString()}`)
 *
 * // 格式化时间
 * const formatDate = (timestamp: number) => new Date(timestamp).toLocaleString()
 * console.log(`Commit time: ${formatDate(__BUILD_INFO__.commitTimestamp)}`)
 * ```
 */
declare const __BUILD_INFO__: {
  /**
   * Git commit 哈希值（短格式）
   * @example "a1b2c3d"
   */
  commitHash: string

  /**
   * 最新 commit 的时间戳
   * @remarks Unix 时间戳（毫秒）
   * @example 1703116800000 // 2023-12-21 00:00:00 UTC
   */
  commitTimestamp: number

  /**
   * 构建开始的时间戳
   * @remarks Unix 时间戳（毫秒）
   * @example 1703116800000 // 2023-12-21 00:00:00 UTC
   */
  buildTimestamp: number
}

declare const __PACKAGE_VERSION__: string

type ThemeValue = 0 | 1 | 2 // 0: light, 1: dark, 2: system
