# js-together

个人开源项目集合（pnpm workspace monorepo）。

## 目录结构

| 目录 | 类型 | 说明 |
| --- | --- | --- |
| `app-eop-assistant` | Nuxt | EOP 助手，everyonepiano 简谱抓取与 PDF 生成 |
| `app-wasm` | Vite | WebAssembly 实验项目 |

`app-*` 为应用项目，`package-*` 为可共享的库（暂无）。

## 工具链

使用 [Vite+ (`vp`)](https://viteplus.dev) 作为统一工具链入口，底层包管理器为 pnpm。

```sh
vp install        # 安装依赖
vp run -r dev     # 递归运行 dev 脚本
vp run -r build   # 递归构建
```

要求 Node.js >= 24。
