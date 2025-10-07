import { DataSource } from 'typeorm';
import { Users } from './src/users/users.entity';
import { Currency } from './src/currency/currency.entity';
import { SportBets } from './src/sportBets/sportBets.entity';
import { ResultTransaction } from './src/resultTransaction/resultTransaction.entity';

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASS || '1478',
  database: process.env.DB_NAME || 'sportsbook',
  entities: [Users, Currency, SportBets, ResultTransaction],
  synchronize: false,
  logging: true,
});

async function checkSchema() {
  try {
    await dataSource.initialize();

    // Check if the currency_id column exists in the users table
    const queryRunner = dataSource.createQueryRunner();
    const table = await queryRunner.getTable('users');
    
    if (table) {
      const hasCurrencyId = table.columns.some(col => col.name === 'currency_id');
      
      if (!hasCurrencyId) {
        // Add the missing column
        await queryRunner.addColumn(
          'users',
          new (require('typeorm').TableColumn)({
            name: 'currency_id',
            type: 'uuid',
            isNullable: true,
          })
        );
      }
    }

    await dataSource.destroy();
  } catch (error) {
  }
}

checkSchema();