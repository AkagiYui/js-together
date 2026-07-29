# AGENTS.md

本仓库（js-together monorepo）的工作约定。所有 AI 代理与本仓库协作时须遵守。

## 工具链：必须用 `vp`，禁止直接用 `pnpm`/`npm`/`yarn`

本仓库以 [Vite+ (`vp`)](https://viteplus.dev) 为统一工具链入口，底层包管理器是 pnpm。
**所有依赖管理、脚本执行、构建等操作都必须通过 `vp` 代管，不得直接调用 `pnpm`/`npm`/`yarn`。**

`vp` 在 pnpm 之上提供了任务依赖编排、缓存、递归执行等能力。直接用 `pnpm` 会绕过这些能力，且违反项目约定。

### 命令对照（用左边的，不要用右边的）

| 用途 | ✅ 用 `vp` | ❌ 不要用 |
| --- | --- | --- |
| 安装全部依赖 | `vp install` | `pnpm install` |
| 添加依赖 | `vp add -F <pkg> <dep>` | `pnpm --filter <pkg> add <dep>` |
| 移除依赖 | `vp remove -F <pkg> <dep>` | `pnpm --filter <pkg> remove <dep>` |
| 运行某个包的脚本 | `vp run -F <pkg> <task>` | `pnpm --filter <pkg> run <task>` |
| 递归运行某脚本 | `vp run -r <task>` | `pnpm -r run <task>` |
| 递归构建 | `vp run -r build` | `pnpm -r build` |
| 单包构建（vite） | `vp build` | `vite build` |
| 格式化 / lint / 类型检查 | `vp check` / `vp lint` / `vp fmt` | 直接调 eslint/prettier/tsc |
| 临时执行本地二进制 | `vp exec <bin>` | `pnpm exec <bin>` / npx |
| 临时跑远端包 | `vp dlx <pkg>` | `pnpm dlx` / npx |

说明：
- `-F <pkg>` / `--filter <pkg>`：按包名筛选；支持 `@scope/*`、`./<dir>`、`...<pattern>`（含依赖方）、`<pattern>...`（含被依赖方）等。
- `vp run` 会按任务 `dependsOn` 排序、带缓存；`-r` 递归到 workspace 全部包。
- 例：构建文档站会自动先构建其依赖的 `@akagiyui/ui-react`：
  `vp run -F ui-docs build`

当 `vp` 本身不可用、或某操作 `vp` 明确不支持时，拒绝执行，并在回复中说明原因。

## 子包与工作区

- `app-*` 为应用，`lib-*` 为可共享库。
- 新增/修改组件库 `lib-ui-react` 后，同步导出/注册/文档用：
  `vp run -F @akagiyui/ui-react gen`
- 库构建：`vp run -F @akagiyui/ui-react build`
- registry 产物构建：`vp run -F @akagiyui/ui-react registry:build`

## 其它
- Node.js >= 24。
- 提交 git 前需经用户明确同意；不要擅自 commit/push。
- `dist/`、`*.tsbuildinfo` 已被 gitignore；`app-ui-docs/public/r/*.json`（registry 产物）纳入版本管理。