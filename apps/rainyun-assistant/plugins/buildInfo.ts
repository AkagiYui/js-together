/**
 * 生成构建信息，使用最新的commit信息
 */
import { execSync } from "child_process"

function generateBuildInfo() {
  const commitHash = execSync("git rev-parse --short HEAD").toString().trim()
  // 获取commit的时间戳
  const commitTimestamp = parseInt(execSync("git log -1 --format=%ct").toString().trim()) * 1000 // 转换为毫秒

  return {
    commitHash,
    commitTimestamp,
    buildTimestamp: Date.now(), // 当前时间戳
  }
}

export { generateBuildInfo }
