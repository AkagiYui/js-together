# AGENTS.md — @akagiyui/ui-react

`lib-ui-react`（包名 `@akagiyui/ui-react`）是本仓库的核心子项目。所有 AI 代理在本目录或 `app-ui-docs` 协作时，须先理解以下项目意义与用途，并遵守其中的约定。

> 工具链规则（必须用 `vp`、禁止直接 `pnpm`）见仓库根 [`../AGENTS.md`](../AGENTS.md)，此处不重复。

## 项目意义

这是一个**个人 React 组件库**，作为作者后续所有 React 项目的**统一 UI 基线**。

- 以 [shadcn](https://ui.shadcn.com) 的 `new-york` 风格为起点，把官方全部组件拷入 `src/components/ui/` 作为**定制基线**——作者会在此基础上对每个组件做定制修改，而不是直接消费 shadcn。
- 组件代码风格统一为 shadcn 新版：函数声明组件 + `data-slot` 属性 + 统一的 `radix-ui` 包 + `@/lib/utils` 别名导入。新增/改动组件请保持这一风格。
- 定位是「拿过来、改出自己的」，因此组件源码随库走，可自由修改；不追求与 shadcn 上游保持同步。

## 用途与消费方式

支持**双模消费**：

1. **npm 包**：作为 workspace 依赖 `@akagiyui/ui-react: workspace:*` 引入，从 barrel（`@akagiyui/ui-react`）或子路径（`@akagiyui/ui-react/button` 等）导入。
2. **shadcn registry**：`npx shadcn@latest add @akagiyui/<组件名>` 把组件源码拉进消费方项目。registry 产物由 `registry.json` 经 `vp run -F @akagiyui/ui-react registry:build` 构建到 `../app-ui-docs/public/r/`。

配套的 `app-ui-docs` 是该组件库的**文档站 + 开发预览环境 + registry 浏览器**：每个组件一个页面，含实时预览、源码、安装命令。

## 目录结构

```
lib-ui-react/
  src/
    components/ui/   全部 shadcn 组件 + 自定义 block（card-counter）
    hooks/           自定义 hook（use-counter）+ shadcn hook（use-mobile）
    lib/utils.ts     cn() 工具
    styles.css       shadcn 标准 token（neutral baseColor, new-york），components.json 指向
    index.ts         【自动生成】barrel re-exports
  registry.json      【自动生成】shadcn registry 清单
  scripts/gen.mjs    代码生成脚本（幂等）
  components.json    shadcn CLI 配置（style: new-york）
  tsdown.config.ts   构建配置（glob entry，unbundle）
```

## 关键约定

- **不要手动编辑自动生成的文件**：`src/index.ts`、`registry.json`、`package.json` 的 `exports` 字段，以及 `app-ui-docs` 下的 `src/App.tsx`、`src/routes/*.tsx`、`src/routes/index.tsx`、`src/demos/registry.ts`、`src/components/component-groups.ts`。这些由 `scripts/gen.mjs` 生成。
- **改组件/增删组件后必须重新生成**：`vp run -F @akagiyui/ui-react gen`。该脚本幂等，二次运行无 diff 即正确。
- **组件分组规则**：文档站侧栏/首页按「已定制 / 自定义 / 原版」三组展示，判定逻辑在 `scripts/gen.mjs` 的 `classifyGroup()`：
  - `已定制`＝导入 `./icons`（Iconify 图标封装，与官方 `lucide-react` 不同）自动识别，外加手动清单 `CUSTOMIZED_OVERRIDES`（当前仅 `button`，因基类追加了 `cursor-pointer`）；
  - `自定义`＝`CUSTOM_COMPONENTS` 清单（`card-counter`、`icons`，均为 shadcn 批量导入之后自研）；
  - 其余为 `原版`。改出实质差异但无法被自动识别时，把组件名加进 `CUSTOMIZED_OVERRIDES`。
- **`card-counter.tsx` 与 `use-counter.ts` 是自定义产物**，不在自动 ui 扫描内，registry 中作为特殊 block/hook 项保留，可手动维护。
- **新增组件预览**：在 `app-ui-docs/src/demos/<组件名>.tsx` 写默认导出的 demo，再跑一次 `gen`，文档页即出现该预览；未提供 demo 的组件文档页显示「预览待补充」占位，不影响构建。
- **依赖**：组件所需的外部依赖（radix-ui、lucide-react、cmdk、vaul 等）由 `shadcn add` 自动写入 `package.json`；动画工具类依赖 `tw-animate-css`，主题相关依赖 `next-themes`/`sonner`。

## 常用命令

| 用途 | 命令 |
| --- | --- |
| 重新生成导出/注册/文档路由 | `vp run -F @akagiyui/ui-react gen` |
| 构建库（tsdown，产出 dist + dts） | `vp run -F @akagiyui/ui-react build` |
| 构建 registry 产物到 app-ui-docs/public/r | `vp run -F @akagiyui/ui-react registry:build` |
| 起文档/预览站 | `vp run -F ui-docs dev` |
| 构建文档站 | `vp run -F ui-docs build` |