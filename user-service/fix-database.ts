const { Client } = require('pg');

async function fixDatabase() {
  const client = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASS || '1478',
    database: process.env.DB_NAME || 'sportsbook',
  });

  try {
    await client.connect();

    // Check if the currency_id column exists
    const res = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'users' AND column_name = 'currency_id'
    `);

    if (res.rows.length === 0) {
      await client.query(`
        ALTER TABLE users 
        ADD COLUMN currency_id UUID REFERENCES currency(id)
      `);
    }

    await client.end();
  } catch (error) {
    await client.end();
  }
}

fixDatabase();