const { Client } = require('pg');

async function testUserFetch() {
  const client = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASS || '1478',
    database: process.env.DB_NAME || 'sportsbook',
  });

  try {
    await client.connect();
    
    // Try to fetch a user
    const result = await client.query('SELECT * FROM users LIMIT 1');
    
    if (result.rows.length > 0) {
    } else {
    }
    
    await client.end();
  } catch (error) {
  }
}

testUserFetch();