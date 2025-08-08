import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';

export default defineConfig({
  server: {
    port: 5173,
    strictPort: true,
    cors: true,
  },
  preview: {
    port: 5173,
    strictPort: true,
  },
  plugins: [
    react(),
    federation({
      name: 'host',
      remotes: {
        layout: 'http://localhost:5002/assets/remoteEntry.js',
      },
      shared: ['react', 'react-dom', 'react-router-dom']
    }),
  ],
  build: {
    target: 'esnext',
    minify: false,
    cssCodeSplit: false,
    modulePreload: false,
  },
});
