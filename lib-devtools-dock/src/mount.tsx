import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { createRoot, type Root } from "react-dom/client"

import type { DevtoolsSetupContext } from "./types"

// ---- Vite DevTools 主题桥接 ----
//
// Vite DevTools 的 dock 面板位于 shadow root 内，主题由 shadow root 里的
// `.vite-devtools-color-root` 元素（class: light | dark）表达。
// 面板组件通过 useDevtoolsTheme() 读取，并在 Settings 里切换主题时实时更新。

interface DevtoolsTheme {
  isDark: boolean
}

const DevtoolsThemeContext = createContext<DevtoolsTheme>({ isDark: true })

export function useDevtoolsTheme(): DevtoolsTheme {
  return useContext(DevtoolsThemeContext)
}

function DevtoolsThemeBridge({ host, children }: { host: HTMLElement; children: ReactNode }) {
  const [isDark, setIsDark] = useState(() => {
    const colorRoot = host.closest(".vite-devtools-color-root")
    return colorRoot?.classList.contains("dark") ?? true
  })

  useEffect(() => {
    const colorRoot = host.closest(".vite-devtools-color-root")
    if (!colorRoot) return
    const update = () => setIsDark(colorRoot.classList.contains("dark"))
    const observer = new MutationObserver(update)
    observer.observe(colorRoot, { attributes: true, attributeFilter: ["class"] })
    update()
    return () => observer.disconnect()
  }, [host])

  return <DevtoolsThemeContext.Provider value={{ isDark }}>{children}</DevtoolsThemeContext.Provider>
}

// ---- 每个 dock 入口对应一个常驻 React Root ----
//
// 为什么不能像普通嵌入式组件那样「每次挂载建 root、切换时卸载」：
// Vite DevTools 的 custom-render 面板有几个关键时序特征：
// 1. setup 脚本（renderer）**每个入口只执行一次**（runtime 用 _setupPromises 缓存）；
// 2. 面板容器元素（pane.element）在多次激活间是**同一个 DOM 节点**（Pane 构造时创建，
//    ViewCustomRenderer 复用），切走再切回来时 `dom:panel:mounted` 事件不会再次触发
//    （Vue watch 只在引用变化时 emit）；
// 3. 因此「切走时卸载 root、切回时重建」是行不通的——切回时没有任何事件/回调
//    来触发重建，面板就白屏了。
//
// 所以这里按 entry id 维护常驻 root：root 存活在面板元素上，切走时元素被 dock
// 从视图里摘除（内容不可见但 root 仍在），切回来时元素重新挂载、内容自然恢复。
// 仅当面板元素被 dock 重建（pane 被 LRU 回收后重建）时，才替换 root。
const rootsByEntry = new Map<string, { root: Root; element: HTMLElement }>()

/**
 * 把 React 面板挂载到 devtools custom-render dock 提供的面板容器上。
 *
 * 处理两种时机（见上面注释）：
 * 1. setup 脚本执行时 panel 已就绪 → 直接挂载；
 * 2. 订阅 `dom:panel:mounted` 事件，待面板挂载后再挂载（首次/面板元素重建时）。
 */
export function mountDevtoolsPanel(
  ctx: DevtoolsSetupContext,
  render: (host: HTMLElement, shadowRoot: ShadowRoot) => ReactNode,
): void {
  const entryId = ctx.current?.entryMeta?.id ?? "unknown"

  const mount = (panel: HTMLElement) => {
    const existing = rootsByEntry.get(entryId)
    if (existing?.element === panel) {
      // 同一元素再次激活：root 仍存活，随 pane 重新挂载内容自然恢复
      return
    }
    // 面板元素被 dock 重建（pane 回收后重建），替换旧 root
    existing?.root.unmount()
    const shadowRoot = panel.getRootNode() as ShadowRoot
    const root = createRoot(panel)
    rootsByEntry.set(entryId, { root, element: panel })
    try {
      root.render(<DevtoolsThemeBridge host={panel}>{render(panel, shadowRoot)}</DevtoolsThemeBridge>)
    } catch (error) {
      console.error("[devtools-dock] panel render failed", error)
      root.render(
        <pre style={{ color: "#f87171", padding: "12px", fontSize: 12, whiteSpace: "pre-wrap" }}>
          {String(error instanceof Error ? error.stack ?? error.message : error)}
        </pre>,
      )
    }
  }

  const panel = ctx.current?.domElements?.panel
  if (panel) {
    mount(panel)
  }
  ctx.current?.events?.on("dom:panel:mounted", mount)
}
