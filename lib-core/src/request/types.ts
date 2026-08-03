export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "HEAD" | "OPTIONS"

export type BodyType = "json" | "form" | "text" | "url"

export type ResponseType = "blob" | "document" | "json" | "text"

/** 传输进度，单位 byte */
export interface ProgressInfo {
  loaded: number
  total: number
}

export interface RequestConfig {
  url?: string
  method?: HttpMethod

  params?: Record<string, any>
  headers?: Record<string, string>
  body?: Record<string, any> | string | FormData
  /** 请求体类型（默认 json），会影响 Content-Type */
  bodyType?: BodyType

  /** 超时时间，单位毫秒，默认跟随全局配置；传 0 表示不超时 */
  timeout?: number
  /** 是否携带 cookie，默认跟随全局配置 */
  withCredentials?: boolean
  responseType?: ResponseType

  // 回调
  onUploadProgress?: (progress: ProgressInfo) => void
  onDownloadProgress?: (progress: ProgressInfo) => void

  // 透传字段：库不解释，由调用方（如业务请求封装）读取
  showLoading?: boolean
  auth?: boolean
}

export interface KResponse<T> {
  data: T
  status: number
  statusText: string
  headers: Record<string, string>
}

export interface BuildOptions {
  baseUrl?: string
  /** 全局超时时间，单位毫秒，默认 10000（10 秒） */
  timeout?: number
  /** 是否携带 cookie，默认 false */
  withCredentials?: boolean
  headers?: Record<string, string>
  /** 请求前回调：返回 false 取消请求；返回 config 覆盖原配置；返回 void 使用原配置（可原地修改）。等价于注册第一个请求拦截器 */
  onBeforeRequest?: (config: RequestConfig) => RequestConfig | void | false | Promise<RequestConfig | void | false>
  /** 请求完成后回调（无论成功或失败），供解包响应、全局提示等使用 */
  onAfterResponse?: (response: KResponse<any>, config: RequestConfig) => void
  /** 请求失败后回调（网络错误 / 超时 / 被取消）。等价于注册第一个响应失败拦截器 */
  onErrorResponse?: (error: Error, config: RequestConfig) => void | Promise<void>
}

export interface SseEvent {
  data: string
  event?: string
  id?: string
  retry?: number
}

export interface SseOptions {
  url: string
  params?: Record<string, any>
  headers?: Record<string, string>
  onopen?: (response: Response) => void | Promise<void>
  onmessage?: (event: SseEvent) => void
  onclose?: () => void
  /** 出错时调用：返回毫秒数则按该延迟重连；返回其它值则停止 */
  onerror?: (error: Error) => number | null | undefined | void
}

/**
 * 请求拦截器：请求发出前按注册顺序执行。
 * 返回 false 取消请求；返回 config 覆盖原配置；返回 void 使用原配置（可原地修改）。支持 async。
 */
export type RequestInterceptorFn = (
  config: RequestConfig,
) => RequestConfig | void | false | Promise<RequestConfig | void | false>

/**
 * 响应成功拦截器：HTTP 响应已收到（无论 2xx 还是 4xx/5xx）。
 * 可返回新的 response 供后续拦截器使用；抛出异常会使本次请求 reject 并走失败分支。
 */
export type ResponseFulfilledFn = (
  response: KResponse<any>,
  config: RequestConfig,
) => KResponse<any> | void | Promise<KResponse<any> | void>

/** 响应失败拦截器：网络错误 / 超时 / 被取消 / 响应成功拦截器抛错 */
export type ResponseRejectedFn = (error: Error, config: RequestConfig) => void | Promise<void>

/** 请求拦截器管理器 */
export interface RequestInterceptorManager {
  /** 注册请求拦截器，返回 id；请求发出前按注册顺序执行 */
  use: (onFulfilled: RequestInterceptorFn) => number
  /** 按 id 移除已注册的拦截器 */
  eject: (id: number) => void
}

/** 响应拦截器管理器 */
export interface ResponseInterceptorManager {
  /** 注册响应拦截器（成功 / 失败分支），返回 id */
  use: (onFulfilled?: ResponseFulfilledFn, onRejected?: ResponseRejectedFn) => number
  /** 按 id 移除已注册的拦截器 */
  eject: (id: number) => void
}

export interface FetchEventSourceOptions {
  headers?: Record<string, string>
  signal?: AbortSignal
  onopen?: (response: Response) => void | Promise<void>
  onmessage?: (event: SseEvent) => void
  onclose?: () => void
  /** 出错时调用：返回毫秒数则按该延迟重连；返回其它值则停止 */
  onerror?: (error: Error) => number | null | undefined | void
}

export interface Requester {
  get: <T = unknown>(url: string, config?: RequestConfig) => Promise<KResponse<T>>
  post: <T = unknown>(url: string, config?: RequestConfig) => Promise<KResponse<T>>
  put: <T = unknown>(url: string, config?: RequestConfig) => Promise<KResponse<T>>
  delete: <T = unknown>(url: string, config?: RequestConfig) => Promise<KResponse<T>>
  patch: <T = unknown>(url: string, config?: RequestConfig) => Promise<KResponse<T>>
  head: <T = unknown>(url: string, config?: RequestConfig) => Promise<KResponse<T>>
  options: <T = unknown>(url: string, config?: RequestConfig) => Promise<KResponse<T>>
  /** 底层请求方法，与各 verb 方法互通 */
  request: <T = unknown>(config: RequestConfig) => Promise<KResponse<T>>
  /** 使用实例 baseUrl 构造完整 URL（不发请求） */
  buildUrl: (url: string, params?: Record<string, any>) => string
  /** 构造 WebSocket 连接（复用实例 baseUrl，http(s) 自动转为 ws(s)） */
  ws: (url: string, params?: Record<string, any>) => WebSocket
  /** 建立 SSE 连接（可携带自定义 header），返回 close 句柄 */
  sse: (config: SseOptions) => { close: () => void }
  /** 拦截器：请求 / 响应两侧均可注册多个，按注册顺序执行 */
  interceptors: {
    request: RequestInterceptorManager
    response: ResponseInterceptorManager
  }
  /** 构造时传入的配置 */
  config: BuildOptions
}
