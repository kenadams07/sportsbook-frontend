import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    proxy: {
      '/sports-api': {
        target: 'http://89.116.20.218:2700',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/sports-api/, ''),
      },
      '/api': {
        target: 'http://localhost:3002',
        changeOrigin: true,
      },
    },
  },
})
