import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import VueRouter from 'unplugin-vue-router/vite'
import buildInfoPlugin from './vite-plugin-build-info'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    buildInfoPlugin(),
    VueRouter({
      // 配置路由文件夹
      routesFolder: 'src/pages',
      // 生成类型定义文件
      dts: './typed-router.d.ts',
    }),
    // ⚠️ Vue 必须放在 VueRouter() 之后
    vue(),
  ],
})
