import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
    port: 3000,
    // 代理配置：开发时若 VITE_API_BASE=/api 则转发到 cpolar
    proxy: {
      '/api': {
        target: 'https://campusdocai.cpolar.top',
        changeOrigin: true,
        secure: false,
        timeout: 30000,
      }
    }
  },
})
