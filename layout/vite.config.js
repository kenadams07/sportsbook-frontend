import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'layout',
      filename: 'remoteEntry.js',
      exposes: {
        './LayoutApp': './src/App.jsx',
      },
      shared: ['react', 'react-dom']
    }),
  ],
  build: {
    target: 'esnext',
    minify: false,
    cssCodeSplit: false,
  },
});
