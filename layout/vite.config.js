import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  // Load environment variables based on the current mode (development, production, etc.)
  const env = loadEnv(mode, process.cwd(), '');
  
  // Load environment variables with fallback defaults
  const EVENTS_API_URL = env.VITE_EVENTS_API_URL || 'http://89.116.20.218:2700';
  const MARKETS_API_URL = env.VITE_MARKETS_API_URL || 'http://89.116.20.218:2700';
  const USERS_API_URL = env.VITE_USERS_API_URL || 'http://localhost:3001';
  const CASINO_API_URL = env.VITE_CASINO_API_URL || 'http://localhost:3003';

  return {
    server: {
      port: 9001, // Changed port to avoid conflict
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
          target: EVENTS_API_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/events/, '/events'),
          configure: (proxy, options) => {
            proxy.on('error', (err, req, res) => {
              console.error('Proxy error for /api/events:', err);
              // Add safety check for res object
              if (res && typeof res.writeHead === 'function') {
                res.writeHead(503, {
                  'Content-Type': 'application/json',
                });
                res.end(JSON.stringify({
                  error: 'Service Unavailable',
                  message: 'Unable to connect to events server'
                }));
              }
            });
            proxy.on('proxyReq', (proxyReq, req, res) => {
              // Add timeout to proxy requests
              proxyReq.setTimeout(10000);
            });
            // Removed proxyRes logging to stop console spam
          }
        },
        // Proxy for the markets API to avoid CORS issues
        '/api/markets': {
          target: MARKETS_API_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/markets/, '/markets'),
          configure: (proxy, options) => {
            proxy.on('error', (err, req, res) => {
              console.error('Proxy error for /api/markets:', err);
              // Add safety check for res object
              if (res && typeof res.writeHead === 'function') {
                res.writeHead(503, {
                  'Content-Type': 'application/json',
                });
                res.end(JSON.stringify({
                  error: 'Service Unavailable',
                  message: 'Unable to connect to markets server'
                }));
              }
            });
            proxy.on('proxyReq', (proxyReq, req, res) => {
              // Add timeout to proxy requests
              proxyReq.setTimeout(10000);
            });
            // Removed proxyRes logging to stop console spam
          }
        },
        // Proxy for user API to avoid CORS issues in development
        '/users': {
          target: USERS_API_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/users/, '/users'),
          configure: (proxy, options) => {
            proxy.on('error', (err, req, res) => {
              console.error('Proxy error for /users:', err);
              // Add safety check for res object
              if (res && typeof res.writeHead === 'function') {
                res.writeHead(503, {
                  'Content-Type': 'application/json',
                });
                res.end(JSON.stringify({
                  error: 'Service Unavailable',
                  message: 'Unable to connect to user server'
                }));
              }
            });
          }
        },
        // Proxy for the casino API to avoid CORS issues
        '/casino-api': {
          target: CASINO_API_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/casino-api/, '/api'),
          configure: (proxy, options) => {
            proxy.on('error', (err, req, res) => {
              console.error('Proxy error for /casino-api:', err);
              // Add safety check for res object
              if (res && typeof res.writeHead === 'function') {
                res.writeHead(503, {
                  'Content-Type': 'application/json',
                });
                res.end(JSON.stringify({
                  error: 'Service Unavailable',
                  message: 'Unable to connect to casino server'
                }));
              }
            });
            proxy.on('proxyReq', (proxyReq, req, res) => {
              // Add timeout to proxy requests
              proxyReq.setTimeout(15000);
            });
            proxy.on('proxyRes', (proxyRes, req, res) => {
       
             
            });
          }
        },
      },
    },
    preview: {
      port: 3003,
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
  };
});