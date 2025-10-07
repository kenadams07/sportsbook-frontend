import { DataSource } from 'typeorm';
import { Users } from './src/users/users.entity';

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASS || '1478',
  database: process.env.DB_NAME || 'sportsbook',
  entities: [
    Users,
  ],
  synchronize: false,
  logging: false,
});

async function testUserFetch() {
  try {
    await AppDataSource.initialize();
    
    // Try to fetch a user with raw query to avoid relation issues
    const result = await AppDataSource.query('SELECT * FROM users LIMIT 1');
    
    if (result.length > 0) {
    } else {
    }
    
    await AppDataSource.destroy();
  } catch (error) {
    try {
    } catch (e) {
    }
  }
}

testUserFetch();