import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';

export default defineConfig({
  plugins: [
    react(),
    federation({
      remotes: {
        sportsbook: 'http://localhost:5001/assets/remoteEntry.js',
        layout: 'http://localhost:5002/assets/remoteEntry.js',
      },
      shared: ['react', 'react-dom']
    }),
  ],
});
