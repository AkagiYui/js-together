interface BuildOptions {
  baseUrl?: string // 基础URL，默认为空
  timeout?: number // 全局超时时间，单位毫秒，默认 10000（10秒）
  withCredentials?: boolean // 是否携带 cookie，默认 false
  headers?: Record<string, string> // 全局请求头
  onBeforeRequest?: (config: RequestConfig) => RequestConfig // 请求前的回调
}

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "HEAD" | "OPTIONS"

// 传输进度, 单位 byte
interface ProgressInfo {
  loaded: number // 已加载字节
  total: number // 总大小
}

interface RequestConfig {
  url?: string // 请求地址
  method?: HttpMethod // 请求方法（默认 GET）

  params?: Record<string, any> // URL 参数
  headers?: Record<string, string> // 额外的请求头
  body?: Record<string, any> | string // 请求体
  bodyType?: "json" | "form" | "text" | "url" // 请求体类型（默认 json），会影响 Content-Type

  // 请求配置
  timeout?: number // 超时时间，单位毫秒，默认跟随全局配置
  withCredentials?: boolean // 是否携带 cookie，默认跟随全局配置
  responseType?: "blob" | "document" | "json" | "text" // 响应类型（默认 json）

  // 回调
  onUploadProgress?: (progress: ProgressInfo) => void
  onDownloadProgress?: (progress: ProgressInfo) => void
}

interface KResponse<T> {
  data: T
  status: number
  statusText: string
  headers: Record<string, string>
}
