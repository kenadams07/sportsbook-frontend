export default {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/main.jsx',
    '!src/setupTests.js',
  ],
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(your-esm-module)/)',
  ],
  globals: {
    'import.meta.env.VITE_API_BASE_URL': 'http://localhost:3000/api',
    'import.meta.env.VITE_ADMIN_API_BASE_URL': 'http://localhost:3002'
  },
  setupFiles: ['<rootDir>/src/setupTests.js']
};