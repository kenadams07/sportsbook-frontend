import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
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