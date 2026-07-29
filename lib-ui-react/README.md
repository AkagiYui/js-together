# @akagiyui/ui-react

基于 [shadcn](https://ui.shadcn.com)（`new-york` 风格）的个人 React 组件库，作为作者后续所有 React 项目的统一 UI 基线。

> 本仓库（`js-together` monorepo）以 [Vite+ (`vp`)](https://viteplus.dev) 为统一工具链入口。所有依赖管理、脚本执行、构建都必须走 `vp`，**禁止直接调用 `pnpm`/`npm`/`yarn`**。规则见仓库根 [`../AGENTS.md`](../AGENTS.md)。

## 项目定位

- 以 shadcn 的 `new-york` 风格为起点，把官方全部组件拷入 `src/components/ui/` 作为**定制基线**——作者会在此基础上对每个组件做定制修改，而不是直接消费 shadcn。
- 组件源码随库走，可自由修改；不追求与 shadcn 上游保持同步。
- 定位是「拿过来、改出自己的」。

## 消费方式

支持双模消费：

1. **npm 包**：作为 workspace 依赖 `@akagiyui/ui-react: workspace:*` 引入，从 barrel（`@akagiyui/ui-react`）或子路径（`@akagiyui/ui-react/button` 等）导入。
2. **shadcn registry**：`npx shadcn@latest add @akagiyui/<组件名>` 把组件源码拉进消费方项目。registry 产物由 `registry.json` 经 `registry:build` 构建到 `../app-ui-docs/public/r/`。

配套的 `app-ui-docs` 是该组件库的文档站 + 开发预览环境 + registry 浏览器。

## 目录结构

```
lib-ui-react/
  src/
    components/ui/   全部 shadcn 组件 + 自定义 block（card-counter）+ 图标封装（icons.tsx）
    hooks/           自定义 hook（use-counter）+ shadcn hook（use-mobile）
    lib/utils.ts     cn() 工具
    styles.css       shadcn 标准 token（neutral baseColor, new-york），components.json 指向
    index.ts         【自动生成】barrel re-exports
  registry.json      【自动生成】shadcn registry 清单
  scripts/gen.mjs    代码生成脚本（幂等）
  components.json    shadcn CLI 配置（style: new-york）
  tsdown.config.ts   构建配置（glob entry，unbundle）
```

## 与官方 shadcn 库的差异

本库以 shadcn 为起点，但在以下方面做了调整：

### 1. 图标方案：Iconify 的 lucide，而非 lucide-react

这是最显著的差异。

| 维度 | 官方 shadcn | 本库 |
| --- | --- | --- |
| 图标来源 | [`lucide-react`](https://lucide.dev)（按图标导出 React 组件） | [Iconify](https://iconify.design) 的 lucide 图标集 |
| 依赖包 | `lucide-react` | `@iconify/react` + `@iconify-icons/lucide` |
| 渲染方式 | 每个 lucide 图标即一个独立 React 组件 | `@iconify/react` 的 `<Icon icon={data} />`，按数据对象渲染 |
| 运行时依赖 | 直接打包 SVG 组件 | 图标数据随包静态打入，**不依赖运行时 API 拉取** |
| 封装位置 | 各组件文件直接 `import { XIcon } from "lucide-react"` | 统一封装于 `src/components/ui/icons.tsx` |

为了做到「调用方零感知」，`icons.tsx` 按 `lucide-react` 的既有命名导出同名组件（如 `CheckIcon`、`ChevronDownIcon`、`XIcon` 等），组件内部用 Iconify 数据渲染。各组件源码与消费方只需把 `from "lucide-react"` 改成 `from "@/components/ui/icons"`，JSX 用法不变。

> 图标重命名：lucide 上游有少量图标更名，本库沿用旧名做兼容映射：
> - `Loader2Icon` → `loader-circle`（原 `loader-2`）
> - `MoreHorizontal` / `MoreHorizontalIcon` → `ellipsis`（原 `more-horizontal`）

选择 Iconify 而非直接用 `lucide-react` 的动机：统一图标管理入口、可在同一渲染层接其它图标集、避免 lucide-react 版本与组件库绑死。

### 2. 依赖声明

官方 `shadcn add` 会把 `lucide-react` 写入消费方 `package.json`。本库组件的图标依赖统一为 `@iconify/react` + `@iconify-icons/lucide`（见 `registry.json` 中各组件的 `dependencies` 与 `icons` registry 依赖）。

### 3. 工具链：强制 `vp`

官方默认走 pnpm。本仓库强制用 [Vite+ (`vp`)](https://viteplus.dev) 代管全部依赖与脚本，直接调用 `pnpm` 会绕过任务编排与缓存，违反项目约定。

### 4. 构建产物

官方不打包组件（拷源码即用）。本库用 `tsdown` 产出 `dist/`（含 `.mjs` 与 `.d.mts`），并通过 `package.json` 的 `exports` 字段提供 barrel 与子路径两种导入。

### 5. 自动生成机制

`src/index.ts`、`registry.json`、`package.json` 的 `exports` 字段，以及 `app-ui-docs` 下的路由/文档页，均由 `scripts/gen.mjs` 幂等生成，**禁止手动编辑**。改组件或增删组件后须重新跑 `gen`。官方无此机制。

### 6. 组件基线

直接拷 shadcn 全套组件作为定制起点，不追上游同步。另外包含自定义产物：

- `card-counter.tsx`：自定义 block（Button + useCounter），不在自动 ui 扫描内。
- `use-counter.ts`：自定义 hook。

## 常用命令

| 用途 | 命令 |
| --- | --- |
| 重新生成导出/注册/文档路由 | `vp run --filter @akagiyui/ui-react gen` |
| 构建库（tsdown，产出 dist + dts） | `vp run --filter @akagiyui/ui-react build` |
| 构建 registry 产物到 app-ui-docs/public/r | `vp run --filter @akagiyui/ui-react registry:build` |
| 起文档/预览站 | `vp run --filter ui-docs dev` |
| 构建文档站 | `vp run --filter ui-docs build` |

> 工具链规则（必须用 `vp`、禁止直接 `pnpm`）见仓库根 [`../AGENTS.md`](../AGENTS.md)。
