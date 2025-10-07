const { Client } = require('pg');

async function testDatabase() {
  const client = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASS || '1478',
    database: process.env.DB_NAME || 'sportsbook',
  });

  try {
    await client.connect();

    // Check if users table exists
    const tableCheck = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_name = 'users'
    `);
    
    if (tableCheck.rows.length === 0) {
      await client.end();
      return;
    }
    
    // Get column information
    const columns = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'users' 
      ORDER BY ordinal_position
    `);
    
    // Check specifically for currency_id column
    const currencyColumn = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'users' AND column_name = 'currency_id'
    `);
    
    // Check if currency table exists
    const currencyTableCheck = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_name = 'currency'
    `);
    
    // Check if there are any users
    const userCount = await client.query(`
      SELECT COUNT(*) as count FROM users
    `);
    
    if (userCount.rows[0].count > 0) {
      // Get first user
      const firstUser = await client.query(`
        SELECT * FROM users LIMIT 1
      `);
    }
    
    await client.end();
  } catch (error) {
    try {
      await client.end();
    } catch (e) {
    }
  }
}

testDatabase();