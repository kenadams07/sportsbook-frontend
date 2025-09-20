const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = 3001;

// Enable CORS for all routes
app.use(cors());

// Proxy middleware for sports API
app.use('/sports-api', createProxyMiddleware({
  target: 'http://89.116.20.218:2700',
  changeOrigin: true,
  pathRewrite: {
    '^/sports-api': '', // remove base path
  },
}));

app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
});