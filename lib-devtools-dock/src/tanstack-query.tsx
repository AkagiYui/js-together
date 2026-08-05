import { ReactQueryDevtoolsPanel } from "@tanstack/react-query-devtools"
import type { QueryClient } from "@tanstack/react-query"

import { mountDevtoolsPanel, useDevtoolsTheme } from "./mount"
import type { DevtoolsSetupContext } from "./types"

/** 面板组件：QueryClient 实例由页面侧在 DEV 下暴露到 window.__DEVTOOLS_QUERY_CLIENT__。 */
function QueryPanel({ shadowRoot }: { shadowRoot: ShadowRoot }) {
  const { isDark } = useDevtoolsTheme()
  // 优先用消费方注入的组件（版本匹配），回退到包内置
  const Panel = window.__DEVTOOLS_COMPONENTS__?.ReactQueryDevtoolsPanel ?? ReactQueryDevtoolsPanel
  return (
    <Panel
      client={window.__DEVTOOLS_QUERY_CLIENT__ as QueryClient | undefined}
      shadowDOMTarget={shadowRoot}
      style={{ width: "100%", height: "100%" }}
      theme={isDark ? "dark" : "light"}
    />
  )
}

/**
 * Vite DevTools custom-render dock：把 React Query Devtools 面板渲染进 dock。
 * 面板样式通过 shadowDOMTarget 注入到 dock 的 shadow root 内，
 * 主题跟随 Vite DevTools 设置（见 mount.tsx 的 useDevtoolsTheme）。
 */
export default function setupQueryDevtools(ctx: DevtoolsSetupContext): void {
  mountDevtoolsPanel(ctx, (_host, shadowRoot) => <QueryPanel shadowRoot={shadowRoot} />)
}
