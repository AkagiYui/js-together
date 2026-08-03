# @akagiyui/core/request

基于 `XMLHttpRequest` 的请求器工厂，附带 SSE 与 WebSocket 支持，不依赖任何第三方库。

- 构造时传入 `baseUrl` / 超时 / 全局请求头 / 生命周期钩子，得到一个请求器实例
- 通过实例发起 `get` / `post` / … 请求、建立 `sse` / `ws` 连接，或只构造 URL 不发请求
- 支持请求体 `json` / `form` / `text` / `url` 四种类型与上传/下载进度回调（XHR 原生支持）

```ts
import { buildRequester } from "@akagiyui/core/request"
```

## 构造请求器

```ts
const http = buildRequester({
  baseUrl: import.meta.env.DEV ? "/api" : "https://api.example.com",
  timeout: 10000,               // 全局超时，毫秒；默认 10000
  withCredentials: false,       // 是否携带 cookie；默认 false
  headers: { "Content-Type": "application/json" },

  onBeforeRequest(config) {
    // 请求前回调：返回 false 取消请求；返回 config 覆盖原配置；返回 void 则使用原配置（可原地修改）
    const token = localStorage.getItem("token")
    if (token) config.headers = { ...config.headers, Authorization: `Bearer ${token}` }
    return config
  },

  onAfterResponse(response, config) {
    // 请求完成后调用（无论成功或失败），供解包响应、全局提示等使用
  },

  onErrorResponse(config, error) {
    // 请求失败时调用（网络错误 / 超时 / 被取消）
  },
})
```

## 发起请求

```ts
// 基本用法
const res = await http.get<MyData>("/user", { params: { page: 1 } })
res.data // 响应体（默认按 json 解析）

// 全部 verb 方法：get / post / put / delete / patch / head / options
await http.post("/login", { body: { username, password } })
await http.patch(`/order/${id}/status`, { body: { status: "done" } })
await http.delete(`/order/${id}`)

// 底层方法（与 verb 方法互通），可自定义 method
await http.request<MyData>({ url: "/x", method: "GET", params: { a: 1 } })

// 上传进度 / 下载进度（单位 byte）
await http.post("/upload", {
  body: formData,               // FormData 会自动按 form 处理，无需手动设置 bodyType
  onUploadProgress: ({ loaded, total }) => console.log(`${(loaded / total) * 100}%`),
})
```

### RequestConfig 字段

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `url` | `string` | 请求路径 |
| `method` | `HttpMethod` | 请求方法，默认 `GET` |
| `params` | `Record<string, any>` | 查询参数，拼到 URL 上 |
| `headers` | `Record<string, string>` | 额外请求头，与全局请求头合并 |
| `body` | `any` | 请求体 |
| `bodyType` | `"json" \| "form" \| "text" \| "url"` | 请求体类型，默认 `json`；传 `FormData` 时自动按 `form` |
| `timeout` | `number` | 本次超时，覆盖全局；传 `0` 表示不超时 |
| `withCredentials` | `boolean` | 本次是否携带 cookie，覆盖全局 |
| `responseType` | `"blob" \| "document" \| "json" \| "text"` | 响应类型，默认 `json` |
| `onUploadProgress` / `onDownloadProgress` | `(p: ProgressInfo) => void` | 传输进度回调 |
| `showLoading` / `auth` | `boolean` | 透传字段，库不解释，供业务封装读取 |

## 生命周期钩子

构造时传入，等价于注册第一个拦截器（见下节）：

| 钩子 | 时机 | 返回值 |
| --- | --- | --- |
| `onBeforeRequest(config)` | 请求发出前 | 返回 `false` 取消（reject）；返回 `config` 覆盖原配置；返回 `void` 用原配置 |
| `onAfterResponse(response, config)` | 请求完成（HTTP 响应已收到，无论 2xx/4xx/5xx） | 抛出异常会使本次请求 reject |
| `onErrorResponse(config, error)` | 请求失败（网络错误 / 超时 / 取消） | 无 |

## 拦截器（interceptors）

当需要**多个**回调，或需要**构造后才注册**处理逻辑时，用拦截器。同一套机制解决了两个问题：

- **多回调**：请求 / 响应两侧均可注册任意多个，按注册顺序执行
- **动态 header**：登录后设置鉴权头，不必改构造时的配置，见下方示例

### 请求拦截器

请求发出前执行。常用于注入鉴权头、打日志、控制 loading。

```ts
const http = buildRequester({ baseUrl: "https://api.example.com" })

// 登录后动态注入鉴权头：每次请求时读取当前 token，登录/登出/换账号/刷新都无需重注册
http.interceptors.request.use((config) => {
  const token = authStore.token
  if (token) config.headers = { ...config.headers, Authorization: `Bearer ${token}` }
  return config // 返回 config 覆盖；返回 false 取消；返回 void 用原配置
})

// 第二个请求拦截器：打日志（多个拦截器按注册顺序依次执行）
http.interceptors.request.use(async (config) => {
  console.debug(config.method, config.url)
  return config // 也支持 async，如在这里等待 token 刷新
})
```

**登录后设置鉴权头的正确姿势**：不要在构造后手动改 `headers`，而是在请求拦截器里**每次请求时读取**当前 token（localStorage / 状态管理均可）。这样 token 何时生效、何时失效都由存储状态决定，请求方无感知。

### 响应拦截器

HTTP 响应收到后执行（无论 2xx 还是 4xx/5xx），成功 / 失败两个分支都可注册：

```ts
const id = http.interceptors.response.use(
  (response, config) => {
    // 成功分支：解包 {code,msg,data}、全局提示等；抛出异常会使本次请求 reject 并走失败分支
    if (response.data?.code !== undefined && response.data?.data !== undefined) {
      response.data = response.data.data
    }
    return response // 可返回新的 response 供后续拦截器使用
  },
  (error, config) => {
    // 失败分支：网络错误 / 超时 / 取消 / 成功分支抛错
    window.$message.error(error.message)
  },
)

// 不再需要时按 id 移除
http.interceptors.response.eject(id)
```

### 与 axios 的差异

- 请求拦截器按**注册顺序**执行（axios 是后注册的先执行，容易踩坑）
- 取消请求用返回 `false`，不需要 cancelToken / AbortController
- `onAfterResponse` 挂在响应拦截器**成功分支**（HTTP 响应均触发，与 axios 一致）

## SSE

基于 `fetch` + `ReadableStream` 自实现，**可以携带自定义 header**（原生 `EventSource` 做不到，适合 token 认证场景）。

```ts
const sse = http.sse({
  url: "/events",
  params: { topic: "order" },
  // 注意：SSE/WS 连接不经过拦截器链，需要鉴权头时必须在 options 里显式传入
  headers: { Authorization: `Bearer ${token}` },
  onopen: async (response) => {
    // 连接建立（或收到响应头）。库不做状态码判定，需要时自行检查 response.status / response.ok
    if (!response.ok) return // 例如：401 时停止
  },
  onmessage: (ev) => {
    console.log(ev.data)       // 消息体（多行 data 会以 \n 拼接）
    console.log(ev.event)      // 可选，event: 字段
    console.log(ev.id)         // 可选，id: 字段
    console.log(ev.retry)      // 可选，retry: 字段
  },
  onerror: (error) => {
    // 返回毫秒数则按该延迟重连；返回其它值（void/null/undefined）则停止
    return 3000
  },
  onclose: () => { /* 服务器正常关闭连接 */ },
})
sse.close()  // 主动关闭
```

底层能力 `fetchEventSource(url, options)` 也可独立使用（`options.signal` 用于关闭）。

## WebSocket

```ts
const ws = http.ws("/ws", { token })  // 复用实例 baseUrl，http(s) 自动转为 ws(s)
ws.onmessage = (event) => console.log(event.data)
ws.send(JSON.stringify({ hello: "world" }))
```

## 只构造 URL，不发请求

```ts
// 实例方法：携带构造时的 baseUrl
http.buildUrl("/order", { id: 1 })  // => "https://api.example.com/order?id=1"

// 纯函数
import { buildUrl, buildWebSocketUrl } from "@akagiyui/core/request"

buildUrl("/api", { id: 1 }, "http://localhost:8080") // => "http://localhost:8080/api?id=1"
buildUrl("/api", undefined, "/base", true)            // => "http://localhost:8080/base/api"（拼接当前 origin）
buildWebSocketUrl("/ws", undefined, "https://api.example.com") // => "wss://api.example.com/ws"
```

## 设计原则

**请求库不做基于状态码的成功/失败判定。** 失败只发生在传输层：网络错误、超时、被取消。HTTP 4xx/5xx 同样算「响应已收到」，照常 resolve（或照常交付给 SSE 的 `onopen`），由调用方根据 `response.status` 自行决定如何处理。

## 注意事项

- 底层是 `XMLHttpRequest`，仅适用于浏览器环境（SSE / WS 同理）
- 请求失败（网络错误、超时、取消）会 `reject` 一个带上下文的 `Error`；HTTP 4xx/5xx **不会** reject，需自行检查 `response.status`
- `bodyType: "form"` 时不要手动设置 `Content-Type`，否则会覆盖 `boundary` 导致表单无法解析
