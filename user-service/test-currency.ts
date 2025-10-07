import { DataSource } from 'typeorm';
import { Users } from './src/users/users.entity';
import { Currency } from './src/currency/currency.entity';

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

    // Try to query users with currency relation
    const userRepository = dataSource.getRepository(Users);
    
    // First, let's try a simple query without relations
    const users = await userRepository.find({
      take: 1
    });
    
    // Now let's try to query with the currency relation
    try {
      const usersWithCurrency = await userRepository.find({
        relations: ['currency'],
        take: 1
      });
    } catch (relationError) {
    }
    
    await dataSource.destroy();
  } catch (error) {
    try {
      await dataSource.destroy();
    } catch (e) {
    }
  }
}

testCurrencyRelation();