export function buildRequester<N = any>(options: BuildOptions = {}) {
  const baseUrl = options.baseUrl || ""
  const baseTimeout = options.timeout || 10000
  const baseWithCredentials = options.withCredentials || false
  const baseHeaders = options.headers || {}

  function request<T = N>(config: RequestConfig): Promise<KResponse<T>> {
    // 请求前的回调
    if (options.onBeforeRequest) {
      config = options.onBeforeRequest(config)
    }

    // 构造请求头
    const headers = { ...baseHeaders, ...(config.headers || {}) }

    // 判断请求体类型
    if (config.body instanceof FormData) {
      // 如果请求体是 FormData 类型
      config.bodyType = "form" // 强制请求体类型为 form
    }
    if (config.bodyType === undefined) {
      // 如果请求体类型未定义
      config.bodyType = "json" // 默认请求体类型为 json
    }
    if (config.bodyType === "json") {
      // 如果请求体类型是 json
      headers["Content-Type"] = "application/json" // 设置 Content-Type 为 application/json
    } else if (config.bodyType === "form") {
      // 此处不可设置Content-Type，否则会覆盖boundary，导致表单数据无法解析
    } else if (config.bodyType === "text") {
      // 如果请求体类型是 text
      headers["Content-Type"] = "text/plain" // 设置 Content-Type 为 text/plain
    } else if (config.bodyType === "url") {
      // 如果请求体类型是 url
      headers["Content-Type"] = "application/x-www-form-urlencoded" // 设置 Content-Type 为 application/x-www-form-urlencoded
    } else {
      // 如果请求体类型未知
      throw new Error(`Unknown bodyType: ${config.bodyType}`) // 抛出错误
    }

    // 构造URL
    const url = buildUrl(config.url || "", config.params, baseUrl, true)
    console.debug(`[Request] ${config.method || "GET"} ${url}`)

    // 构造请求体
    let body: any = config.body
    if (config.bodyType === "text") {
      // 如果请求体类型是 text
      body = typeof config.body === "object" ? JSON.stringify(config.body) : config.body // 如果请求体是对象，则转为 JSON 字符串，否则直接使用
    } else if (config.bodyType === "url") {
      // 如果请求体类型是 url
      body = new URLSearchParams(config.body) // 使用 URLSearchParams 构造请求体
    } else if (config.bodyType === "form") {
      // 如果请求体类型是 form
      if (config.body instanceof FormData) {
        // 且请求体是 FormData 类型
        body = config.body // 直接使用请求体
      } else if (config.body && typeof config.body === "object") {
        // 否则如果请求体是对象
        const formData = new FormData() // 创建 FormData
        Object.entries(config.body).forEach(([key, value]) => {
          formData.append(key, String(value)) // 将对象的每个键值对添加到 FormData
        })
        body = formData // 使用 FormData 作为请求体
      }
    } else if (config.bodyType === "json") {
      // 如果请求体类型是 json
      body = JSON.stringify(config.body) // 使用 JSON.stringify 将请求体转为 JSON 字符串
    }

    // 发送请求
    const timeout = config.timeout || baseTimeout
    const withCredentials = config.withCredentials || baseWithCredentials
    const xhr = new XMLHttpRequest()
    xhr.open(config.method || "GET", url, true)
    xhr.timeout = timeout
    xhr.withCredentials = withCredentials
    xhr.responseType = config.responseType || "json"
    Object.entries(headers).forEach(([key, value]) => {
      xhr.setRequestHeader(key, value)
    })
    if (config.onUploadProgress) {
      xhr.upload.onprogress = (e) => {
        config.onUploadProgress?.({ loaded: e.loaded, total: e.total })
      }
    }
    if (config.onDownloadProgress) {
      xhr.onprogress = (e) => {
        config.onDownloadProgress?.({ loaded: e.loaded, total: e.total })
      }
    }

    xhr.send(body)

    return new Promise((resolve, reject) => {
      xhr.onload = () => {
        const headers: Record<string, string> = {}
        xhr
          .getAllResponseHeaders()
          .split("\r\n")
          .forEach((header) => {
            const [key, value] = header.split(": ")
            headers[key.toLowerCase()] = value
          })

        const contentType = headers["content-type"] || ""
        if (xhr.responseType === "json" && !contentType.includes("json")) {
          console.log(`responseType is json, but Content-Type is ${contentType}`)
        }
        const body = xhr.responseType === "" || xhr.responseType === "text" ? xhr.responseText : xhr.response
        const response: KResponse<T> = {
          data: body,
          status: xhr.status,
          statusText: xhr.statusText,
          headers: headers,
        }
        console.debug(`[Response] ${config.method || "GET"} ${url}`, response)
        resolve(response)
      }
      xhr.onerror = (ev) => {
        console.log("xhr.onerror", ev)
        reject(xhr.statusText)
      }
      xhr.ontimeout = () => {
        reject("timeout")
      }
    })
  }

  return {
    get: <T = void>(url: string, config?: RequestConfig) => request<T>({ ...config, url, method: "GET" }),
    post: <T = void>(url: string, config?: RequestConfig) => request<T>({ ...config, url, method: "POST" }),
    put: <T = void>(url: string, config?: RequestConfig) => request<T>({ ...config, url, method: "PUT" }),
    delete: <T = void>(url: string, config?: RequestConfig) => request<T>({ ...config, url, method: "DELETE" }),
    patch: <T = void>(url: string, config?: RequestConfig) => request<T>({ ...config, url, method: "PATCH" }),
    head: <T = void>(url: string, config?: RequestConfig) => request<T>({ ...config, url, method: "HEAD" }),
    options: <T = void>(url: string, config?: RequestConfig) => request<T>({ ...config, url, method: "OPTIONS" }),

    request,
    buildUrl: (url: string, params?: Record<string, any>) => buildUrl(url, params, baseUrl, true),
    config: options,
  }
}

/**
 * 构造URL
 * @param url 请求路径
 * @param params 请求参数
 * @param baseURL 基础URL
 * @param useLocation 是否使用当前页面的origin
 * @returns 完整URL
 *
 * @example
 * buildUrl("/api", {id: 1}, "http://localhost:8080") => "http://localhost:8080/api?id=1"
 * buildUrl("/api", {id: 1}) => "/api?id=1"
 * buildUrl("/api") => "/api"
 * buildUrl("/api", {id: 1}, "/") => "/api?id=1"
 * buildUrl("/api", {id: 1}, "/base") => "/base/api?id=1"
 * buildUrl("/api", {id: 1}, "/base", true) => "http://localhost:8080/base/api?id=1"
 */
export function buildUrl(
  url: string,
  params?: Record<string, any>,
  baseURL?: string,
  useLocation: boolean = false,
): string {
  // 处理基础 URL(没有尾随斜杠/)
  let fullBaseUrl = ""
  if (baseURL && !baseURL.startsWith("/")) {
    // 如果 baseURL 是绝对路径，直接使用
    fullBaseUrl = baseURL
  } else if (useLocation) {
    // 如果 baseURL 是相对路径，且 useLocation 为 true，则使用当前页面的 origin 加上 baseURL
    fullBaseUrl = window.location.origin + (baseURL || "")
  } else {
    // 否则使用 baseURL
    fullBaseUrl = baseURL || ""
  }
  // 去除 baseURL 尾部的斜杠
  fullBaseUrl = fullBaseUrl.replace(/\/+$/, "")

  // 确保 url 以 "/" 开头
  if (!url.startsWith("/")) {
    url = "/" + url
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
