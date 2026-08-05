import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools"
import type { AnyRouter } from "@tanstack/react-router"

import { mountDevtoolsPanel, useDevtoolsTheme } from "./mount"
import type { DevtoolsSetupContext } from "./types"

/**
 * Router devtools 面板内部硬编码深色（defaultTheme 无 light 变体，且不暴露 theme prop）。
 * 这里用 CSS filter 反转作为 light 主题的变通：dark 模式原样，light 模式套 invert。
 */
function RouterPanel({ shadowRoot }: { shadowRoot: ShadowRoot }) {
  const { isDark } = useDevtoolsTheme()
  // 优先用消费方注入的组件（版本匹配），回退到包内置
  const Panel = window.__DEVTOOLS_COMPONENTS__?.TanStackRouterDevtoolsPanel ?? TanStackRouterDevtoolsPanel
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        // 反转深色面板近似浅色；hue-rotate 抵消反转对色相的翻转，让品牌蓝不跑偏
        filter: isDark ? "none" : "invert(0.9) hue-rotate(180deg)",
      }}
    >
      <Panel router={window.__DEVTOOLS_ROUTER__ as AnyRouter | undefined} shadowDOMTarget={shadowRoot} />
    </div>
  )
}

export default function setupRouterDevtools(ctx: DevtoolsSetupContext): void {
  mountDevtoolsPanel(ctx, (_host, shadowRoot) => <RouterPanel shadowRoot={shadowRoot} />)
}
