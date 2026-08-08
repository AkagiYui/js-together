# @akagiyui/ui-react

基于 [shadcn](https://ui.shadcn.com)（`new-york` 风格）的个人 React 组件库，作为作者后续所有 React 项目的统一 UI 基线。

> 本仓库（`js-together` monorepo）以 [Vite+ (`vp`)](https://viteplus.dev) 为统一工具链入口。所有依赖管理、脚本执行、构建都必须走 `vp`，**禁止直接调用 `pnpm`/`npm`/`yarn`**。规则见仓库根 [`../AGENTS.md`](../AGENTS.md)。

## 项目定位

- 以 shadcn 的 `new-york` 风格为起点，把官方全部组件拷入 `src/components/ui/` 作为**定制基线**——作者会在此基础上对每个组件做定制修改，而不是直接消费 shadcn。
- 组件源码随库走，可自由修改；不追求与 shadcn 上游保持同步。
- 定位是「拿过来、改出自己的」。

## 快速开始

### 1. 安装

在消费方项目的 `package.json` 里声明依赖（workspace 内直接 link）：

```jsonc
"dependencies": {
  "@akagiyui/ui-react": "link:../js-together/lib-ui-react"
}
```

> `vp` 工具链统一管理依赖，安装用 `vp install`，不要直接 `pnpm add`。

### 2. 样式配置（关键，缺了组件会"没样式"）

组件样式依赖 **Tailwind CSS v4** + shadcn token。在项目入口 CSS（如 `src/styles/app.css`）里做三步：

```css
@import "tailwindcss";
@import "tw-animate-css";

@custom-variant dark (&:is(.dark *));

/* ① 让 Tailwind 扫描本库源码中的工具类字符串（路径相对当前 CSS 文件解析） */
@source "../../../js-together/lib-ui-react/src";

/* ② shadcn 标准 token（neutral baseColor, new-york），完整变量见 src/styles.css */
:root { --radius: 0.625rem; --background: oklch(1 0 0); /* … */ }
.dark { --background: oklch(0.145 0 0); /* … */ }

/* ③ 关键：把 CSS 变量映射成 Tailwind 颜色 token，使 bg-background / text-muted-foreground 等类生效 */
@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --color-chart-1: var(--chart-1);
  --color-chart-2: var(--chart-2);
  --color-chart-3: var(--chart-3);
  --color-chart-4: var(--chart-4);
  --color-chart-5: var(--chart-5);
  --color-sidebar: var(--sidebar);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-ring: var(--sidebar-ring);
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
}

@layer base {
  * { border-color: var(--border); }
  body { background-color: var(--background); color: var(--foreground); }
}
```

vite 侧启用 Tailwind 插件（TanStack Start 示例）：

```ts
import tailwindcss from "@tailwindcss/vite"
// plugins: [ tailwindcss(), tanstackStart({...}), ... ]
```

在根布局引入 CSS 并把 `<body>` 挂上基础类：

```tsx
import appCss from "~/styles/app.css?url"
// head.links: [{ rel: "stylesheet", href: appCss }]
// <body className="min-h-screen bg-background text-foreground antialiased">
```

> 变量完整清单以 [`src/styles.css`](./src/styles.css) 为准，直接拷走即可（已含 `@theme inline` 与 `@layer base`）。

### 3. 引入组件

```tsx
import { Button } from "@akagiyui/ui-react/button"                    // 子路径（推荐，tree-shaking 友好）
import { Card, CardContent } from "@akagiyui/ui-react/card"
// 或从 barrel 一次引入：import { Button, Card } from "@akagiyui/ui-react"

export function Demo() {
  return (
    <Card>
      <CardContent className="space-y-4">
        <Button variant="default" size="lg">点我</Button>
        <Button variant="outline" disabled>禁用</Button>
      </CardContent>
    </Card>
  )
}
```

## 组件清单

全部组件在 `src/components/ui/`，均可通过 `@akagiyui/ui-react/<组件名>` 子路径导入：

| 分组 | 组件 |
| --- | --- |
| 布局 | `card` `separator` `aspect-ratio` `resizable` `scroll-area` `sheet` `sidebar` `drawer` `collapsible` |
| 导航 | `tabs` `breadcrumb` `navigation-menu` `menubar` `pagination` `dropdown-menu` `context-menu` `hover-card` `tooltip` `accordion` |
| 表单 | `button` `button-group` `input` `input-group` `input-otp` `textarea` `label` `field` `form` `select` `native-select` `combobox` `command` `checkbox` `radio-group` `switch` `slider` `toggle` `toggle-group` `calendar` |
| 数据展示 | `table` `badge` `avatar` `skeleton` `progress` `card-counter` `chart` `carousel` `marker` `message` `message-scroller` `empty` `bubble` `item` `kbd` `alert` `alert-dialog` `dialog` |
| 工具 | `sonner`（toast）`spinner` `direction` `icons` |
| Hooks | `use-counter` `use-mobile` |
| 工具函数 | `utils`（`cn()`） |

> 完整可导入子路径见 `package.json` 的 `exports` 字段（`styles.css`、`icons`、`utils` 等均可用子路径导入）。

## 常用组件用法

### Button

```tsx
import { Button } from "@akagiyui/ui-react/button"
import { SearchIcon } from "@akagiyui/ui-react/icons"

<Button variant="default" size="sm">默认</Button>
<Button variant="secondary">次要</Button>
<Button variant="outline">描边</Button>
<Button variant="ghost">幽灵</Button>
<Button variant="link">链接样式</Button>
<Button variant="destructive">危险</Button>

<Button size="xs">极小</Button>
<Button size="sm">小</Button>
<Button size="default">默认</Button>
<Button size="lg">大</Button>
<Button size="icon"><SearchIcon /></Button>
{/* asChild 用其它元素渲染（如 <a> 链接） */}
<Button asChild><a href="/x">链接按钮</a></Button>
```

> 本库 Button 默认 `cursor-pointer`（官方 shadcn 不设置），可用 `className="cursor-default"` 覆盖。

### Card

```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, CardAction } from "@akagiyui/ui-react/card"

<Card>
  <CardHeader>
    <CardTitle>标题</CardTitle>
    <CardDescription>描述</CardDescription>
    <CardAction>右上角操作区</CardAction>
  </CardHeader>
  <CardContent>内容</CardContent>
  <CardFooter>底部</CardFooter>
</Card>
```

### 表单（react-hook-form 集成）

```tsx
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@akagiyui/ui-react/form"
import { Input } from "@akagiyui/ui-react/input"
import { useForm } from "react-hook-form"

const form = useForm({ defaultValues: { email: "" } })

<Form form={form}>
  <FormField
    control={form.control}
    name="email"
    render={({ field }) => (
      <FormItem>
        <FormLabel>邮箱</FormLabel>
        <FormControl><Input placeholder="you@example.com" {...field} /></FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
</Form>
```

### 轻量表单（Field，无 RHF 依赖）

```tsx
import { Field, FieldLabel, FieldDescription, FieldError, FieldContent } from "@akagiyui/ui-react/field"
import { Input } from "@akagiyui/ui-react/input"

<Field error="必填">
  <FieldLabel>用户名</FieldLabel>
  <FieldContent><Input /></FieldContent>
  <FieldDescription>只能包含字母</FieldDescription>
  <FieldError />
</Field>
```

### 原生 Select（NativeSelect，最轻量）

```tsx
import { NativeSelect, NativeSelectOption } from "@akagiyui/ui-react/native-select"

<NativeSelect value={lang} onChange={(e) => setLang(e.target.value)}>
  <NativeSelectOption value="zh">中文</NativeSelectOption>
  <NativeSelectOption value="en">English</NativeSelectOption>
</NativeSelect>
```

### shadcn Select（Radix 风格）

```tsx
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@akagiyui/ui-react/select"

<Select value={v} onValueChange={setV}>
  <SelectTrigger><SelectValue placeholder="选择" /></SelectTrigger>
  <SelectContent>
    <SelectItem value="a">选项 A</SelectItem>
    <SelectItem value="b">选项 B</SelectItem>
  </SelectContent>
</Select>
```

### Tabs

```tsx
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@akagiyui/ui-react/tabs"

<Tabs value={active} onValueChange={setActive}>
  <TabsList>
    <TabsTrigger value="a">A</TabsTrigger>
    <TabsTrigger value="b">B</TabsTrigger>
  </TabsList>
  <TabsContent value="a">内容 A</TabsContent>
  <TabsContent value="b">内容 B</TabsContent>
</Tabs>
```

### 表格

```tsx
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell, TableCaption, TableFooter } from "@akagiyui/ui-react/table"

<Table>
  <TableCaption>说明</TableCaption>
  <TableHeader>
    <TableRow><TableHead>列 1</TableHead><TableHead>列 2</TableHead></TableRow>
  </TableHeader>
  <TableBody>
    <TableRow><TableCell>值</TableCell><TableCell>值</TableCell></TableRow>
  </TableBody>
  <TableFooter><TableRow><TableCell colSpan={2}>合计</TableCell></TableRow></TableFooter>
</Table>
```

### Toast（sonner）

```tsx
import { Toaster } from "@akagiyui/ui-react/sonner"
import { toast } from "sonner"

// 根布局挂一次 <Toaster richColors position="top-center" />
<Toaster />
<Button onClick={() => toast.success("已保存")}>保存</Button>
```

### Dialog

```tsx
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@akagiyui/ui-react/dialog"
import { Button } from "@akagiyui/ui-react/button"

<Dialog>
  <DialogTrigger asChild><Button>打开</Button></DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>确认</DialogTitle>
      <DialogDescription>要执行此操作吗？</DialogDescription>
    </DialogHeader>
    内容
    <DialogFooter>
      <DialogClose asChild><Button variant="outline">取消</Button></DialogClose>
      <Button>确定</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

### Switch / Checkbox / Radio

```tsx
import { Switch } from "@akagiyui/ui-react/switch"
import { Checkbox } from "@akagiyui/ui-react/checkbox"
import { RadioGroup, RadioGroupItem } from "@akagiyui/ui-react/radio-group"

<Switch checked={on} onCheckedChange={setOn} />
<Checkbox checked={checked} onCheckedChange={setChecked} />
<RadioGroup value={v} onValueChange={setV}>
  <RadioGroupItem value="a" id="a" /><label htmlFor="a">A</label>
</RadioGroup>
```

### 图标

```tsx
import { CheckIcon, Loader2Icon, MoreHorizontalIcon, SearchIcon } from "@akagiyui/ui-react/icons"

<CheckIcon className="size-4" />
<Loader2Icon className="size-4 animate-spin" />
```

> 图标由 Iconify 提供（lucide 数据），导出名沿用 `lucide-react` 命名。完整清单见 `src/components/ui/icons.tsx`。

### Hooks 与工具

```tsx
import { useCounter } from "@akagiyui/ui-react/use-counter"
import { useIsMobile } from "@akagiyui/ui-react/use-mobile"
import { cn } from "@akagiyui/ui-react/utils"

const { count, increment, decrement, reset } = useCounter(0)
const isMobile = useIsMobile()
const cls = cn("px-4", isMobile && "px-2")  // clsx + tailwind-merge
```

## 主题与暗色模式

- 全部 token 定义在 `src/styles.css` 的 `:root`（亮色）与 `.dark`（暗色）两套 CSS 变量中。
- 组件内部通过 `@theme inline` 映射的 `bg-background` / `text-foreground` 等工具类取色，**切主题只需切换 `<html>` 的 `.dark` class**。
- 若要支持主题切换 UI，可搭配 `next-themes`（`ThemeProvider`）——本库的 `sonner` Toaster 已内置读取 `useTheme()`。

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

### 7. Button 默认 `cursor: pointer`

官方 shadcn 的 Button 不显式设置光标，渲染出的 `<button>` 在多数浏览器下走 UA 默认样式（通常即 `cursor: default`，受 `[type]`/祖先元素影响，行为不统一）。本库在 `buttonVariants` 的基类中直接加上 `cursor-pointer`，使所有 variant/size 的 Button 默认呈现手型指针，免去消费方逐个补样式。`disabled` 状态因基类已有的 `disabled:pointer-events-none` 不会触发悬停，故光标不会误导。

> 若消费方需要还原为不强制指针，可通过 `className` 覆盖：`className="cursor-default"`（或其它 `cursor-*`）。

## 常用命令

| 用途 | 命令 |
| --- | --- |
| 重新生成导出/注册/文档路由 | `vp run --filter @akagiyui/ui-react gen` |
| 构建库（tsdown，产出 dist + dts） | `vp run --filter @akagiyui/ui-react build` |
| 构建 registry 产物到 app-ui-docs/public/r | `vp run --filter @akagiyui/ui-react registry:build` |
| 起文档/预览站 | `vp run --filter ui-docs dev` |
| 构建文档站 | `vp run --filter ui-docs build` |

> 工具链规则（必须用 `vp`、禁止直接 `pnpm`）见仓库根 [`../AGENTS.md`](../AGENTS.md)。
