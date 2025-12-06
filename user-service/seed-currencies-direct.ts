import { DataSource } from 'typeorm';
import { Currency } from './src/currency/currency.entity';
import * as dotenv from 'dotenv';
import { config as dotenvConfig } from 'dotenv';
import { resolve } from 'path';

// Load environment variables
dotenvConfig({ path: resolve(__dirname, '../.env') });
dotenvConfig({ path: resolve(__dirname, '.env') });
dotenvConfig({ path: resolve(__dirname, '.env.local') });

async function seedCurrencies() {
  // Create a new DataSource instance
  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASS || '1478',
    database: process.env.DB_NAME || 'sportsbook',
    entities: [Currency],
    synchronize: false,
    logging: true,
  });

  try {
    // Initialize the data source
    console.log('Connecting to database...');
    console.log(`Host: ${process.env.DB_HOST}`);
    console.log(`Port: ${process.env.DB_PORT}`);
    console.log(`Database: ${process.env.DB_NAME}`);
    await dataSource.initialize();
    console.log('Database connected successfully');

    // Get the currency repository
    const currencyRepository = dataSource.getRepository(Currency);

    // Define currencies to seed
    const currencies = [
      { name: 'British Pound', code: 'GBP', value: 1.0000 },
      { name: 'US Dollar', code: 'USD', value: 1.2500 },
      { name: 'Euro', code: 'EUR', value: 1.1500 },
    ];

    console.log('Seeding currencies...');
    // Seed currencies
    for (const currencyData of currencies) {
      // Check if currency already exists
      const existingCurrency = await currencyRepository.findOne({
        where: { code: currencyData.code }
      });

      if (!existingCurrency) {
        console.log(`Creating currency: ${currencyData.code}`);
        const currency = currencyRepository.create(currencyData);
        await currencyRepository.save(currency);
        console.log(`Currency ${currencyData.code} created successfully`);
      } else {
        console.log(`Currency ${currencyData.code} already exists`);
      }
    }
    
    console.log('Currency seeding completed successfully');

  } catch (error) {
    console.error('Error seeding currencies:', error);
  } finally {
    // Close the data source
    if (dataSource.isInitialized) {
      await dataSource.destroy();
      console.log('Database connection closed');
    }
  }
}

seedCurrencies().catch((error) => {
  console.error('Unhandled error:', error);
  process.exit(1);
});