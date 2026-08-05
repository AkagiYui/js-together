/**
 * devframe 传给 custom-render 脚本的 context 的窄化类型。
 * 完整结构见 @vitejs/devtools 运行时（runtime-DxwmjAOb.js 的 executeSetupScript）：
 * reactive({ ...toRefs(docksContext), current, messages, logs })，
 * 其中 current 是 entry state（含 entryMeta / domElements.panel / events）。
 */
export interface DevtoolsPanelMount {
  entryMeta?: {
    id?: string
    title?: string
  }
  domElements?: {
    panel?: HTMLElement
    iframe?: HTMLIFrameElement
  }
  events?: {
    /** 订阅 entry 生命周期事件，panel DOM 挂载完成会 emit `dom:panel:mounted` */
    on: (event: string, listener: (el: HTMLElement) => void) => () => void
  }
  isActive?: boolean
}

export interface DevtoolsSetupContext {
  current?: DevtoolsPanelMount
}

/**
 * 页面侧在 DEV 下暴露给 renderer 的运行时实例（全局命名契约）。
 * 渲染器是独立模块，只能通过固定全局名拿到页面实例。
 *
 * 类型故意用宽松的 unknown：消费方可能用不同版本的 tanstack/jotai，
 * 全局契约不应绑定具体版本，renderer 内部按自己的版本 cast。
 */
export interface DevtoolsWindowGlobals {
  __DEVTOOLS_QUERY_CLIENT__?: unknown
  __DEVTOOLS_ROUTER__?: unknown
}

/**
 * devtools 组件注册表：消费项目把自己的 devtools 组件挂到全局，
 * 渲染器优先用注册表组件（版本与消费方完全匹配），取不到才回退到包内置的 devtools。
 *
 * 原因：tanstack devtools 组件强绑定对应 tanstack 库的内部版本（尤其 router），
 * 包内置的版本只对使用同版本 tanstack 的项目成立；由消费方注入则彻底版本无关。
 *
 * 类型用宽松的 any props：消费方的组件 props 因版本而异，且跨版本 devtools 类型
 * 无法互通，这里是动态注册边界，交给渲染器运行时对接。
 */
export interface DevtoolsComponents {
  ReactQueryDevtoolsPanel?: import("react").ComponentType<any>
  TanStackRouterDevtoolsPanel?: import("react").ComponentType<any>
  JotaiDevTools?: import("react").ComponentType<any>
}

declare global {
  interface Window extends DevtoolsWindowGlobals {
    __DEVTOOLS_COMPONENTS__?: DevtoolsComponents
  }
}
