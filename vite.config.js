import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import packageJson from './package.json';

export default defineConfig(({ mode }) => {
  // 根据 mode 设置 base
  const base = mode === 'deploy' ? 'wsv' : ''; // github pages需要加上项目名
  const outDir = mode === 'deploy' ? 'ghpages' : 'dist'; // github pages放到ghpages目录下

  return {
    base,
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
    },
    define: {
      __APP_VERSION__: JSON.stringify(packageJson.version),
      __REQUIRE_WSNS_VERSION__: JSON.stringify(packageJson.require_wsnv),
    },
    build: {
      outDir,
    }
  }
})
