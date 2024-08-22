import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    port: 9093,
    host: true, // 监听所有的网卡地址
    cors: true, // 允许跨域
    // cors: {
    //   origin: "*",
    //   methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    //   preflightContinue: false, // 是否继续预检请求, 默认为 false
    //   optionsSuccessStatus: 204, // 对于预检请求的响应, 允许的值
    //   credentials: true, // 是否允许发送Cookie
    // }, // 通过允许跨域来访问远程服务器
    proxy: { // 通过代理访问远程服务器
      '/origin': {
        target: 'http://121.40.92.198:9090/',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/origin/, '')
      }
    }
  }
})
