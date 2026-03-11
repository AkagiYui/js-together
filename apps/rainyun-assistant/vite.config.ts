import { defineConfig } from "vite"
import react from "@vitejs/plugin-react-swc"
import { TanStackRouterVite } from "@tanstack/router-plugin/vite"
import { fileURLToPath, URL } from "node:url"
import AutoImport from "unplugin-auto-import/vite"
import { generateBuildInfo } from "./plugins/buildInfo"
import { preloadImages } from "./plugins/preloadImages"
import tailwindcss from '@tailwindcss/vite'

const env = process.env

// https://vite.dev/config/
export default defineConfig({
  define: {
    __BUILD_INFO__: JSON.stringify(generateBuildInfo()),
    __PACKAGE_VERSION__: JSON.stringify(env.npm_package_version),
  },
  plugins: [
    TanStackRouterVite(),
    tailwindcss(),
    react(),
    // AutoImport({
    //   imports: ["react", "jotai"],
    //   dirs: ["./src/api", "./src/hooks", "./src/utils", "./src/stores", "./src/types"],
    // }),
    preloadImages({
      dir: "img/*.{png,jpg,jpeg,gif,svg,webp,ico}",
    }),
  ],
  server: {
    host: "0.0.0.0",
    proxy: {
      "^/api/rainyun/.*": {
        target: "https://api.v2.rainyun.com",
        changeOrigin: true,
        configure: (proxy) => {
          proxy.on("proxyReq", (proxyReq, req) => {
            if (req.url) {
              proxyReq.path = proxyReq.path.replace(/^\/api\/rainyun/, "")
            }
            const timeStr = new Date().toLocaleString()
            const requestStr = `[${proxyReq.method}] ${proxyReq.protocol}//${proxyReq.host}${proxyReq.path}`
            console.debug(timeStr, requestStr)
          })
        },
      },
    },
  },
  preview: {
    host: "0.0.0.0",
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  build: {
    manifest: true,
    rollupOptions: {
      output: {
        manualChunks: (id: string): string | undefined => {
          // 从 node_modules 中引入的模块，按模块名称拆分
          if (id.includes("node_modules")) {
            const packagePath = id.split("node_modules/")[1].split("/")
            const first = packagePath[0]
            let name = first === ".pnpm" ? packagePath[1] : first
            if (name.startsWith("@")) {
              name = name.substring(1)
            }
            name = name.replace(".", "_")
            return "module-" + name.split("@")[0]
          }
        },
        entryFileNames: "js/[name]-[hash].js",
        chunkFileNames: "js/[name]-[hash].js",
        assetFileNames: (chunkInfo: any) => {
          if (chunkInfo.name.endsWith(".css")) {
            return "css/[name]-[hash][extname]"
          }
          if (chunkInfo.name.endsWith(".js")) {
            return "js/[name]-[hash][extname]"
          }
          const imgExts = [".png", ".jpg", ".jpeg", ".gif", ".svg", ".webp", ".ico"]
          if (imgExts.some((ext) => chunkInfo.name.endsWith(ext))) {
            return "img/[name]-[hash][extname]"
          }
          return "assets/[name]-[hash][extname]"
        },
      },
    },
  },
})
