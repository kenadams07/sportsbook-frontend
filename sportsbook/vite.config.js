import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'sportsbook',
      filename: 'remoteEntry.js',
      exposes: {
        './SportsbookApp': './src/App.jsx',
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
