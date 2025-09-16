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
      // Removed /events proxy since we're now using the direct API
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