/**
 * 构造 URL
 *
 * @param url 请求路径
 * @param params 请求参数
 * @param baseURL 基础 URL
 * @param useLocation 为 true 时，相对 baseURL 会拼接当前页面的 origin
 * @returns 完整 URL
 *
 * @example
 * buildUrl("/api", { id: 1 }, "http://localhost:8080") => "http://localhost:8080/api?id=1"
 * buildUrl("/api", { id: 1 }) => "/api?id=1"
 * buildUrl("/api", { id: 1 }, "/base", true) => "http://localhost:8080/base/api?id=1"
 */
export function buildUrl(url: string, params?: Record<string, any>, baseURL?: string, useLocation: boolean = false): string {
  // 处理基础 URL（绝对路径直接使用，相对路径按需拼接 origin）
  let fullBaseUrl = ""
  if (baseURL && !baseURL.startsWith("/")) {
    fullBaseUrl = baseURL
  } else if (useLocation && typeof window !== "undefined") {
    fullBaseUrl = window.location.origin + (baseURL || "")
  } else {
    fullBaseUrl = baseURL || ""
  }
  // 去除 baseURL 尾部的斜杠
  fullBaseUrl = fullBaseUrl.replace(/\/+$/, "")

  // 确保 url 以 "/" 开头
  if (!url.startsWith("/")) {
    url = `/${url}`
  }
  // 构建完整的 URL
  let fullUrl = fullBaseUrl + url

  // 添加查询参数
  if (params && Object.keys(params).length > 0) {
    const queryString = Object.entries(params)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
      .join("&")
    fullUrl += (fullUrl.includes("?") ? "&" : "?") + queryString
  }
  return fullUrl
}
