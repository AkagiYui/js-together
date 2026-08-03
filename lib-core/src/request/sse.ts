import type { FetchEventSourceOptions, SseEvent } from "./types"

/**
 * 基于 fetch + ReadableStream 的 SSE 客户端。
 *
 * 相比原生 EventSource：可以携带自定义 header（如 Authorization），
 * 并支持 onopen / onclose / onerror 完整生命周期；通过 AbortSignal 关闭连接。
 *
 * 解析遵循 text/event-stream 协议：
 * - 空行触发一次消息分发
 * - `data:` 可多行，以 `\n` 拼接
 * - `event:` / `id:` / `retry:` 会附加到消息上
 * - 以 `:` 开头的行为注释，忽略
 */
export async function fetchEventSource(url: string, options: FetchEventSourceOptions = {}): Promise<void> {
  const { headers, signal, onopen, onmessage, onclose, onerror } = options

  const decoder = new TextDecoder()
  let buffer = ""
  let data = ""
  let event = ""
  let id = ""
  let retry: number | undefined

  function dispatch() {
    if (data) {
      const message: SseEvent = { data: data.replace(/\n$/, "") }
      if (event) message.event = event
      if (id) message.id = id
      if (retry !== undefined) message.retry = retry
      onmessage?.(message)
    }
    data = ""
    event = ""
  }

  function processLine(line: string) {
    if (line === "") {
      dispatch()
      return
    }
    if (line.startsWith(":")) {
      return // 注释
    }
    const colonIndex = line.indexOf(":")
    const field = colonIndex >= 0 ? line.slice(0, colonIndex) : line
    // 规范要求冒号后紧跟一个空格，但实际服务端常省略，这里兼容
    const value = colonIndex >= 0 ? line.slice(colonIndex + 1).replace(/^ /, "") : ""
    switch (field) {
      case "data":
        data += value + "\n"
        break
      case "event":
        event = value
        break
      case "id":
        id = value
        break
      case "retry": {
        const parsed = Number.parseInt(value, 10)
        if (!Number.isNaN(parsed)) retry = parsed
        break
      }
    }
  }

  function feed(chunk: Uint8Array) {
    buffer += decoder.decode(chunk, { stream: true })
    let newlineIndex: number
    while ((newlineIndex = buffer.indexOf("\n")) >= 0) {
      const line = buffer.slice(0, newlineIndex)
      buffer = buffer.slice(newlineIndex + 1)
      processLine(line.replace(/\r$/, ""))
    }
  }

  async function run(): Promise<void> {
    while (true) {
      let response: Response
      try {
        response = await fetch(url, { headers, signal, cache: "no-store" })
      } catch (error) {
        // fetch 抛出的错误（网络中断等），交由下面的重连逻辑统一处理
        return handleError(error as Error)
      }

      try {
        await onopen?.(response)
        // 不按状态码判定成败：HTTP 4xx/5xx 照常交付给 onopen，由调用方决定如何处理
        if (!response.body) {
          return handleError(new Error("SSE 响应体不可读"))
        }
        const reader = response.body.getReader()
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          feed(value)
        }
      } catch (error) {
        return handleError(error as Error)
      }

      // 服务器正常关闭连接
      onclose?.()
      return
    }
  }

  function handleError(error: Error): void {
    if (signal?.aborted) return
    const retryIn = onerror?.(error)
    // 不重连：返回 void / null / undefined
    if (retryIn == null) return
    setTimeout(run, retryIn)
  }

  await run()
}

/** 由 requester.sse 使用的内部接线：统一用内部 AbortController，close 即可关闭连接 */
export function startSse(url: string, options: FetchEventSourceOptions): { close: () => void } {
  const ctrl = new AbortController()
  const externalSignal = options.signal
  if (externalSignal) {
    if (externalSignal.aborted) {
      ctrl.abort()
    } else {
      externalSignal.addEventListener("abort", () => ctrl.abort(), { once: true })
    }
  }
  void fetchEventSource(url, { ...options, signal: ctrl.signal })
  return { close: () => ctrl.abort() }
}
