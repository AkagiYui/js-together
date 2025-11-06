import { execSync } from 'child_process'
import type { Plugin } from 'vite'

/**
 * 获取 Git commit hash
 */
function getGitCommitHash(): string {
  try {
    return execSync('git rev-parse HEAD').toString().trim()
  } catch (error) {
    console.warn('无法获取 Git commit hash:', error)
    return 'unknown'
  }
}

/**
 * 获取 Git commit 时间
 */
function getGitCommitTime(): string {
  try {
    return execSync('git log -1 --format=%cd --date=iso').toString().trim()
  } catch (error) {
    console.warn('无法获取 Git commit 时间:', error)
    return 'unknown'
  }
}

/**
 * 获取构建时间
 */
function getBuildTime(): string {
  return new Date().toISOString()
}

/**
 * Vite 插件：注入构建信息
 */
export default function buildInfoPlugin(): Plugin {
  const gitCommitHash = getGitCommitHash()
  const gitCommitTime = getGitCommitTime()
  const buildTime = getBuildTime()

  return {
    name: 'vite-plugin-build-info',
    config() {
      return {
        define: {
          __GIT_COMMIT_HASH__: JSON.stringify(gitCommitHash),
          __GIT_COMMIT_TIME__: JSON.stringify(gitCommitTime),
          __BUILD_TIME__: JSON.stringify(buildTime),
        },
      }
    },
  }
}

