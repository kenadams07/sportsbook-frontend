export default () => ({
  port: parseInt(process.env.PORT || '3001', 10),
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    user: process.env.DB_USER || 'user',
    pass: process.env.DB_PASS || 'pass',
    name: process.env.DB_NAME || 'admindb',
  },
});