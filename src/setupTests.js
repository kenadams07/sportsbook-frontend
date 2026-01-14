// Mock import.meta for Jest tests
Object.defineProperty(window, 'import', {
  value: {
    meta: {
      env: {
        VITE_API_BASE_URL: 'http://localhost:3000/api',
        VITE_ADMIN_API_BASE_URL: 'http://localhost:3002'
      }
    }
  },
  writable: true
});

// Alternative approach for import.meta.env
global.import = {
  meta: {
    env: {
      VITE_API_BASE_URL: 'http://localhost:3000/api',
      VITE_ADMIN_API_BASE_URL: 'http://localhost:3002'
    }
  }
};