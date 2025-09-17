import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  
  server: {
    port: 5002,
    strictPort: true,
    cors: true,
    fs: {
      strict: true,
    },
    hmr: {
      port: 5002,
    },
    proxy: {
      // Proxy for the backup events API to avoid CORS issues
      '/api/events': {
        target: 'http://89.116.20.218:2700',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/events/, '/events'),
      },
      '/users': {
        target: 'http://localhost:4001',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/users/, '/users'),
      },
    },
  },
  preview: {
    port: 5002,
    strictPort: true,
  },
  plugins: [
    react(),
    tailwindcss(),
    federation({
      name: 'layout',
      filename: 'remoteEntry.js',
      exposes: {
        './LayoutApp': './src/App.jsx',
      },
      shared: {
        react: { eager: true, singleton: true },
        'react-dom': { eager: true, singleton: true },
      },
      dev:true,
    }),
  ],
  build: {
    target: 'esnext',
    minify: false,
    cssCodeSplit: false,
    modulePreload: false,
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name].js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name].[ext]',
      },
    },
  },
});