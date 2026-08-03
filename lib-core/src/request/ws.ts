import { buildUrl } from "./buildUrl"

/**
 * 构造 WebSocket URL：复用 buildUrl 拼接逻辑，并将 http(s) 协议替换为 ws(s)。
 *
 * @example
 * buildWebSocketUrl("/ws", undefined, "https://example.com") => "wss://example.com/ws"
 * buildWebSocketUrl("/ws", undefined, "http://example.com") => "ws://example.com/ws"
 */
export function buildWebSocketUrl(url: string, params?: Record<string, any>, baseURL?: string, useLocation: boolean = false): string {
  const httpUrl = buildUrl(url, params, baseURL, useLocation)
  return httpUrl.replace(/^http:/, "ws:").replace(/^https:/, "wss:")
}
