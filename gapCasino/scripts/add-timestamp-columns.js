const { Client } = require('pg');

// Database configuration from environment variables
const client = new Client({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASS || '1478',
  database: process.env.DB_NAME || 'sportsbook',
});

async function addMissingColumns() {
  try {
    await client.connect();
    console.log('Connected to database');

    // Check if columns exist
    const checkColumnsQuery = `
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'users' 
      AND column_name IN ('createdAt', 'updatedAt', 'currency_id', 'currencyId')
    `;

    const result = await client.query(checkColumnsQuery);
    const existingColumns = result.rows.map(row => row.column_name);

    console.log('Existing columns:', existingColumns);

    // Add createdAt column if missing
    if (!existingColumns.includes('createdAt')) {
      console.log('Adding createdAt column...');
      await client.query(`
        ALTER TABLE users 
        ADD COLUMN "createdAt" TIMESTAMP NOT NULL DEFAULT NOW()
      `);
      console.log('createdAt column added successfully');
    } else {
      console.log('createdAt column already exists');
    }

    // Add updatedAt column if missing
    if (!existingColumns.includes('updatedAt')) {
      console.log('Adding updatedAt column...');
      await client.query(`
        ALTER TABLE users 
        ADD COLUMN "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
      `);
      console.log('updatedAt column added successfully');
    } else {
      console.log('updatedAt column already exists');
    }

    // Check if we have the old currencyId column and need to rename it
    if (existingColumns.includes('currencyId') && !existingColumns.includes('currency_id')) {
      console.log('Renaming currencyId column to currency_id...');
      await client.query(`
        ALTER TABLE users 
        RENAME COLUMN "currencyId" TO "currency_id"
      `);
      console.log('currencyId column renamed to currency_id successfully');
    } else if (existingColumns.includes('currencyId') && existingColumns.includes('currency_id')) {
      // Both columns exist, we need to drop the old one
      console.log('Both currencyId and currency_id columns exist. Dropping old currencyId column...');
      await client.query(`
        ALTER TABLE users 
        DROP COLUMN "currencyId"
      `);
      console.log('Old currencyId column dropped successfully');
    } else if (!existingColumns.includes('currency_id')) {
      console.log('Adding currency_id column...');
      await client.query(`
        ALTER TABLE users 
        ADD COLUMN "currency_id" VARCHAR
      `);
      console.log('currency_id column added successfully');
    } else {
      console.log('currency_id column already exists');
    }

    await client.end();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error:', error);
    await client.end();
    process.exit(1);
  }
}

addMissingColumns();