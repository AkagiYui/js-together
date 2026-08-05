import { useEffect } from "react"
import { getDefaultStore } from "jotai"
import { DevTools } from "jotai-devtools"

import { mountDevtoolsPanel, useDevtoolsTheme } from "./mount"
import type { DevtoolsSetupContext } from "./types"

// jotai-devtools 的 Mantine 样式是静态编译的（约 1MB，dev only），
// 但注入到 document.head，在 dock 的 shadow root 内无法命中。
// 这里整体内联并注入到 shadow root。
import jotaiDevtoolsCss from "jotai-devtools/styles.css?inline"

/**
 * jotai DevTools 的 Shell 是 fixed 浮层设计（默认 bottom-left），内嵌进 dock 面板后
 * 不会填满面板容器，四周留下大片空隙。这里用覆盖样式把它改为 absolute 填满面板
 * （relative 定位上下文是 dock 的 pane 容器，见 mount.tsx 注释）。
 */
const jotaiEmbedCss = `
.internal-jotai-devtools-shell.jotai-devtools-shell {
  position: absolute !important;
  inset: 0 !important;
  width: 100% !important;
  height: 100% !important;
  max-height: none !important;
  min-height: 0 !important;
  /* Mantine 浮层残留的 translateX 偏移（浮层设计遗留）会打乱绝对定位 */
  transform: none !important;
}
/* 顶部大标题行（👻 Jōtai DevTools ALPHA）占空间，隐藏；
   tab 切换行（Atom Viewer / Time travel）保留，否则无法切换视图。
   注意：不要用 > div:has(h1) 这类宽泛选择器——atom 详情面板里也可能渲染 h1，
   会把整个 atom-viewer panel 误隐藏导致白屏。 */
.internal-jotai-devtools-shell > div:has(> div > div > h1) {
  display: none !important;
}
/* 选中 atom 的高亮。判别实验确认：Mantine 的 --nl-bg 变量链在 shadow DOM 里
   不生效（原始规则 .m_f0824112:where([data-active]) 读不到背景值），
   只能 !important 强制。背景与前景跟随主题（data-mantine-color-scheme 在
   #jotai-devtools-root 上，即 navlink 的祖先）：
   - 深色模式：深灰背景 + 浅灰前景（可读）
   - 浅色模式：浅灰背景 + 近黑前景
   hover 时背景再加深一级。 */
.internal-jotai-devtools-shell .internal-jotai-devtools-navlink[data-active],
.internal-jotai-devtools-shell .internal-jotai-devtools-navlink[aria-current="page"] {
  background-color: var(--mantine-color-dark-7, #1a1b1e) !important;
  color: var(--mantine-color-dark-0, #c1c2c5) !important;
}
:where([data-mantine-color-scheme="light"]) .internal-jotai-devtools-shell .internal-jotai-devtools-navlink[data-active],
:where([data-mantine-color-scheme="light"]) .internal-jotai-devtools-shell .internal-jotai-devtools-navlink[aria-current="page"] {
  background-color: var(--mantine-color-gray-2, #eaecf0) !important;
  color: var(--mantine-color-dark-9, #101113) !important;
}
.internal-jotai-devtools-shell .internal-jotai-devtools-navlink[data-active]:hover,
.internal-jotai-devtools-shell .internal-jotai-devtools-navlink[aria-current="page"]:hover {
  background-color: var(--mantine-color-dark-6, #2c2e33) !important;
}
:where([data-mantine-color-scheme="light"]) .internal-jotai-devtools-shell .internal-jotai-devtools-navlink[data-active]:hover,
:where([data-mantine-color-scheme="light"]) .internal-jotai-devtools-shell .internal-jotai-devtools-navlink[aria-current="page"]:hover {
  background-color: var(--mantine-color-gray-1, #f1f3f5) !important;
}
`

/** jotai DevTools 支持 theme prop，跟随 Vite DevTools 设置（见 mount.tsx 的 useDevtoolsTheme）。 */
function JotaiPanel({ shadowRoot }: { shadowRoot: ShadowRoot }) {
  const { isDark } = useDevtoolsTheme()
  // 优先用消费方注入的组件（版本匹配），回退到包内置
  const DevToolsComponent = window.__DEVTOOLS_COMPONENTS__?.JotaiDevTools ?? DevTools

  // Mantine 的颜色方案管理（setColorSchemeAttribute）会把 data-mantine-color-scheme
  // 写到 getRootElement() 返回的元素上；而 jotai-devtools 的 getRootElement 用
  // document.getElementById("jotai-devtools-root") 在 light DOM 里查找，我们的 root
  // 在 shadow DOM 内查不到，属性从未被设置，导致依赖 [data-mantine-color-scheme=...]
  // 前缀的 CSS 变量规则（--input-bg / --input-bd 等）全部失效，输入框边框背景等样式丢失。
  // 这里手动补齐属性。
  useEffect(() => {
    shadowRoot.getElementById("jotai-devtools-root")?.setAttribute(
      "data-mantine-color-scheme",
      isDark ? "dark" : "light",
    )
  }, [isDark, shadowRoot])

  return <DevToolsComponent store={getDefaultStore()} isInitialOpen={true} theme={isDark ? "dark" : "light"} />
}

export default function setupJotaiDevtools(ctx: DevtoolsSetupContext): void {
  mountDevtoolsPanel(ctx, (host) => {
    const root = host.getRootNode() as ShadowRoot
    if (!root.querySelector("style[data-jotai-devtools]")) {
      const style = document.createElement("style")
      style.setAttribute("data-jotai-devtools", "")
      style.textContent = jotaiDevtoolsCss
      root.prepend(style)
    }
    if (!root.querySelector("style[data-jotai-embed]")) {
      const style = document.createElement("style")
      style.setAttribute("data-jotai-embed", "")
      style.textContent = jotaiEmbedCss
      root.append(style)
    }
    return <JotaiPanel shadowRoot={root} />
  })
}
