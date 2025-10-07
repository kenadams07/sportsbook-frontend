import { DataSource } from 'typeorm';
import { Users } from './src/users/users.entity';
import { Currency } from './src/currency/currency.entity';

// Create a minimal version of Users entity without complex relationships
class MinimalUsers {
  id: string;
  email: string;
  password: string;
  currency: Currency;
}

// Simple test to check if we can query users with currency relationship
async function testCurrencyRelation() {
  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASS || '1478',
    database: process.env.DB_NAME || 'sportsbook',
    entities: [Users, Currency],
    synchronize: false,
    logging: true,
  });

  try {
    await dataSource.initialize();

    // Try to directly query the database to check if the column exists
    const queryRunner = dataSource.createQueryRunner();
    const table = await queryRunner.getTable('users');
    
    if (table) {
      const hasCurrencyId = table.columns.some(col => col.name === 'currency_id');
    }
    
    await dataSource.destroy();
  } catch (error) {
  }
}

testCurrencyRelation();