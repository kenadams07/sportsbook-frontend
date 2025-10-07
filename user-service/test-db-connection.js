const { Client } = require('pg');

async function testDbConnection() {
  const client = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASS || '1478',
    database: process.env.DB_NAME || 'sportsbook',
  });

  try {
    await client.connect();
    
    // Try a simple query
    const result = await client.query('SELECT 1 as test');
    
    await client.end();
  } catch (error) {
  }
}

testDbConnection();