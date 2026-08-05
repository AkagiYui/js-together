import { fileURLToPath } from "node:url"

import type { ViteDevToolsNodeContext } from "@vitejs/devtools-kit"
import type { Plugin } from "vite"

// ---- Vite DevTools dock 面板注册插件 ----
//
// 用法：在项目的 vite.config.ts 里
//   import { devtoolsDockPlugin } from "@akagiyui/devtools-dock"
//   plugins: [devtoolsDockPlugin({ query: {}, router: {}, jotai: {} }), DevTools({ visibility: "passive" })]
//
// 每个面板采用 custom-render 型 dock：renderer 脚本（本包 src/*.tsx）在用户页面
// main frame 上下文内动态 import 后执行，因此能直接拿到页面侧运行时实例
// （window.__DEVTOOLS_QUERY_CLIENT__ / __DEVTOOLS_ROUTER__），再配合 shadowDOMTarget
// 把面板样式注入 dock 的 shadow root。

export interface DockPanelOptions {
  /** Iconify 图标名，如 "ph:database-duotone" */
  icon?: string
  /** dock 栏排序，越大越靠前 */
  order?: number
  /** 是否在 dock 中展示（默认 true） */
  enabled?: boolean
}

export interface DevtoolsDockOptions {
  query?: DockPanelOptions
  router?: DockPanelOptions
  jotai?: DockPanelOptions
}

const DEFAULT_ICONS = {
  query: "ph:database-duotone",
  router: "ph:tree-structure-duotone",
  jotai: "ph:atom-duotone",
} as const

const DEFAULT_ORDERS = {
  query: 10,
  router: 9,
  jotai: 8,
} as const

type PanelKey = keyof DevtoolsDockOptions

const PANELS: Array<{ key: PanelKey; title: string; file: string }> = [
  { key: "query", title: "TanStack Query", file: "tanstack-query" },
  { key: "router", title: "TanStack Router", file: "tanstack-router" },
  { key: "jotai", title: "Jotai", file: "jotai" },
]

interface DockRegisterEntry {
  type: "custom-render"
  id: string
  title: string
  icon: string
  category: string
  defaultOrder: number
  renderer: { importFrom: string }
}

export function devtoolsDockPlugin(options: DevtoolsDockOptions = {}): Plugin {
  return {
    name: "akagiyui:devtools-dock",
    apply: "serve",
    devtools: {
      setup(ctx: ViteDevToolsNodeContext) {
        for (const panel of PANELS) {
          const cfg = options[panel.key]
          if (cfg?.enabled === false) continue
          const icon = cfg?.icon ?? DEFAULT_ICONS[panel.key]
          const order = cfg?.order ?? DEFAULT_ORDERS[panel.key]
          const entry: DockRegisterEntry = {
            type: "custom-render",
            id: `akagiyui-devtools-${panel.key}`,
            title: panel.title,
            icon,
            category: "app",
            defaultOrder: order,
            renderer: {
              importFrom: fileURLToPath(new URL(`./${panel.file}.tsx`, import.meta.url)),
            },
          }
          ctx.docks.register(entry)
        }
      },
    },
  }
}
