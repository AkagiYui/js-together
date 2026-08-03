import { buildUrl } from "./buildUrl"
import { buildWebSocketUrl } from "./ws"
import { startSse } from "./sse"
import type {
  BuildOptions,
  KResponse,
  RequestConfig,
  RequestInterceptorFn,
  ResponseFulfilledFn,
  ResponseRejectedFn,
  Requester,
  SseOptions,
} from "./types"

interface RegisteredRequestInterceptor {
  id: number
  onFulfilled: RequestInterceptorFn
}

interface RegisteredResponseInterceptor {
  id: number
  onFulfilled?: ResponseFulfilledFn
  onRejected?: ResponseRejectedFn
}

/**
 * 构造一个请求器实例。
 *
 * 支持两类扩展方式：
 * - 构造时传入生命周期钩子（onBeforeRequest / onAfterResponse / onErrorResponse），等价于注册第一个拦截器
 * - 构造后通过 `interceptors.request.use(...)` / `interceptors.response.use(...)` 注册任意多个拦截器
 *
 * @example
 * const http = buildRequester({ baseUrl: "https://api.example.com" })
 *
 * http.interceptors.request.use((config) => {
 *   const token = localStorage.getItem("token")
 *   if (token) config.headers = { ...config.headers, Authorization: `Bearer ${token}` }
 *   return config
 * })
 *
 * await http.get("/user")
 */
export function buildRequester(options: BuildOptions = {}): Requester {
  const baseUrl = options.baseUrl ?? ""
  const baseTimeout = options.timeout ?? 10000
  const baseWithCredentials = options.withCredentials ?? false
  const baseHeaders = options.headers ?? {}

  const requestInterceptors: RegisteredRequestInterceptor[] = []
  const responseInterceptors: RegisteredResponseInterceptor[] = []
  let nextId = 1

  // 向后兼容：构造时传入的生命周期钩子等价于注册第一个拦截器
  if (options.onBeforeRequest) {
    requestInterceptors.push({ id: nextId++, onFulfilled: options.onBeforeRequest })
  }
  if (options.onAfterResponse) {
    responseInterceptors.push({ id: nextId++, onFulfilled: options.onAfterResponse })
  }
  if (options.onErrorResponse) {
    responseInterceptors.push({ id: nextId++, onRejected: options.onErrorResponse })
  }

  /** 响应失败链：按注册顺序执行，单个拦截器抛错不中断链 */
  async function runRejectedChain(error: Error, config: RequestConfig): Promise<void> {
    for (const interceptor of responseInterceptors) {
      if (!interceptor.onRejected) continue
      try {
        await interceptor.onRejected(error, config)
      } catch {
        // 失败拦截器自身抛错，忽略
      }
    }
  }

  async function request<T = unknown>(config: RequestConfig): Promise<KResponse<T>> {
    // 请求拦截器链：按注册顺序执行；返回 false 取消；返回 config 覆盖；返回 void 使用原配置（可原地修改）
    let prepared = config
    for (const interceptor of requestInterceptors) {
      const result = await interceptor.onFulfilled(prepared)
      if (result === false) {
        throw new Error("request canceled")
      }
      if (result) {
        prepared = result
      }
    }

    // 构造请求头
    const headers = { ...baseHeaders, ...prepared.headers }

    // 判断请求体类型
    let bodyType = prepared.bodyType
    if (prepared.body instanceof FormData) {
      bodyType = "form" // 强制请求体类型为 form
    }
    if (bodyType === undefined) {
      bodyType = "json"
    }
    switch (bodyType) {
      case "json":
        headers["Content-Type"] = "application/json"
        break
      case "form":
        // 此处不可设置 Content-Type，否则会覆盖 boundary，导致表单数据无法解析
        break
      case "text":
        headers["Content-Type"] = "text/plain"
        break
      case "url":
        headers["Content-Type"] = "application/x-www-form-urlencoded"
        break
      default:
        return Promise.reject(new Error(`未知的 bodyType: ${bodyType}`))
    }

    // 构造 URL
    const url = buildUrl(prepared.url ?? "", prepared.params, baseUrl, true)
    const method = prepared.method ?? "GET"

    // 构造请求体
    let body: XMLHttpRequestBodyInit | null = null
    if (bodyType === "text") {
      body = (typeof prepared.body === "object" ? JSON.stringify(prepared.body) : prepared.body) ?? ""
    } else if (bodyType === "url") {
      body = new URLSearchParams(prepared.body as Record<string, string>)
    } else if (bodyType === "form") {
      if (prepared.body instanceof FormData) {
        body = prepared.body
      } else if (prepared.body && typeof prepared.body === "object") {
        const formData = new FormData()
        Object.entries(prepared.body).forEach(([key, value]) => {
          formData.append(key, String(value))
        })
        body = formData
      }
    } else if (bodyType === "json") {
      body = JSON.stringify(prepared.body) ?? ""
    }

    // 发送请求
    const timeout = prepared.timeout ?? baseTimeout
    const withCredentials = prepared.withCredentials ?? baseWithCredentials
    const xhr = new XMLHttpRequest()
    xhr.open(method, url, true)
    xhr.timeout = timeout
    xhr.withCredentials = withCredentials
    xhr.responseType = prepared.responseType ?? "json"
    Object.entries(headers).forEach(([key, value]) => {
      xhr.setRequestHeader(key, value)
    })
    if (prepared.onUploadProgress) {
      xhr.upload.onprogress = (e) => {
        prepared.onUploadProgress?.({ loaded: e.loaded, total: e.total })
      }
    }
    if (prepared.onDownloadProgress) {
      xhr.onprogress = (e) => {
        prepared.onDownloadProgress?.({ loaded: e.loaded, total: e.total })
      }
    }

    xhr.send(body)

    return new Promise<KResponse<T>>((resolve, reject) => {
      xhr.onload = async () => {
        const responseHeaders: Record<string, string> = {}
        xhr
          .getAllResponseHeaders()
          .split("\r\n")
          .forEach((header) => {
            const [key, value] = header.split(": ")
            if (key) responseHeaders[key.toLowerCase()] = value ?? ""
          })

        const responseBody = xhr.responseType === "" || xhr.responseType === "text" ? xhr.responseText : xhr.response
        const response: KResponse<T> = {
          data: responseBody,
          status: xhr.status,
          statusText: xhr.statusText,
          headers: responseHeaders,
        }
        try {
          // 响应成功链：按注册顺序执行，可返回新的 response 供后续拦截器使用
          let result: KResponse<any> = response
          for (const interceptor of responseInterceptors) {
            if (!interceptor.onFulfilled) continue
            const next = await interceptor.onFulfilled(result, prepared)
            if (next) result = next
          }
          resolve(result as KResponse<T>)
        } catch (error) {
          await runRejectedChain(error as Error, prepared)
          reject(error)
        }
      }
      const fail = (reason: string) => {
        const error = new Error(reason)
        void runRejectedChain(error, prepared).then(() => reject(error))
      }
      xhr.onerror = () => fail(`请求失败: ${method} ${url}`)
      xhr.ontimeout = () => fail(`请求超时: ${method} ${url}`)
    })
  }

  const interceptors = {
    request: {
      use: (onFulfilled: RequestInterceptorFn) => {
        requestInterceptors.push({ id: nextId, onFulfilled })
        return nextId++
      },
      eject: (id: number) => {
        const index = requestInterceptors.findIndex((interceptor) => interceptor.id === id)
        if (index >= 0) requestInterceptors.splice(index, 1)
      },
    },
    response: {
      use: (onFulfilled?: ResponseFulfilledFn, onRejected?: ResponseRejectedFn) => {
        responseInterceptors.push({ id: nextId, onFulfilled, onRejected })
        return nextId++
      },
      eject: (id: number) => {
        const index = responseInterceptors.findIndex((interceptor) => interceptor.id === id)
        if (index >= 0) responseInterceptors.splice(index, 1)
      },
    },
  }

  return {
    get: <T = unknown>(url: string, config?: RequestConfig) => request<T>({ ...config, url, method: "GET" }),
    post: <T = unknown>(url: string, config?: RequestConfig) => request<T>({ ...config, url, method: "POST" }),
    put: <T = unknown>(url: string, config?: RequestConfig) => request<T>({ ...config, url, method: "PUT" }),
    delete: <T = unknown>(url: string, config?: RequestConfig) => request<T>({ ...config, url, method: "DELETE" }),
    patch: <T = unknown>(url: string, config?: RequestConfig) => request<T>({ ...config, url, method: "PATCH" }),
    head: <T = unknown>(url: string, config?: RequestConfig) => request<T>({ ...config, url, method: "HEAD" }),
    options: <T = unknown>(url: string, config?: RequestConfig) => request<T>({ ...config, url, method: "OPTIONS" }),

    request,
    buildUrl: (url: string, params?: Record<string, any>) => buildUrl(url, params, baseUrl, true),
    ws: (url: string, params?: Record<string, any>) => new WebSocket(buildWebSocketUrl(url, params, baseUrl, true)),
    sse: (config: SseOptions) => startSse(buildUrl(config.url, config.params, baseUrl, true), {
      headers: config.headers,
      onopen: config.onopen,
      onmessage: config.onmessage,
      onclose: config.onclose,
      onerror: config.onerror,
    }),
    config: options,
    interceptors,
  }
}
