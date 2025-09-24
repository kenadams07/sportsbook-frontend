import { DataSource } from 'typeorm';
import { Currency } from './src/currency/currency.entity';
import * as dotenv from 'dotenv';
import { config as dotenvConfig } from 'dotenv';
import { resolve } from 'path';

// Load environment variables
dotenvConfig({ path: resolve(__dirname, '../.env') });
dotenvConfig({ path: resolve(__dirname, '.env') });

async function seedCurrencies() {
  // Create a new DataSource instance
  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST === 'postgres' ? 'postgres' : (process.env.DB_HOST || 'localhost'),
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASS || '1478',
    database: process.env.DB_NAME || 'sportsbook',
    entities: [Currency],
    synchronize: false,
    logging: false,
  });

  try {
    // Initialize the data source
    await dataSource.initialize();
    console.log('Data Source has been initialized!');

    // Get the currency repository
    const currencyRepository = dataSource.getRepository(Currency);

    // Define currencies to seed
    const currencies = [
      { name: 'British Pound', code: 'GBP', value: 1.0000 },
      { name: 'US Dollar', code: 'USD', value: 1.2500 },
      { name: 'Euro', code: 'EUR', value: 1.1500 },
    ];

    // Seed currencies
    for (const currencyData of currencies) {
      // Check if currency already exists
      const existingCurrency = await currencyRepository.findOne({
        where: { code: currencyData.code }
      });

      if (!existingCurrency) {
        const currency = currencyRepository.create(currencyData);
        await currencyRepository.save(currency);
        console.log(`Created currency: ${currency.name} (${currency.code})`);
      } else {
        console.log(`Currency ${currencyData.name} (${currencyData.code}) already exists`);
      }
    }

    console.log('Currencies seeded successfully!');
  } catch (error) {
    console.error('Error seeding currencies:', error);
  } finally {
    // Close the data source
    await dataSource.destroy();
  }
}

seedCurrencies().catch((error) => {
  console.error('Error in seedCurrencies:', error);
  process.exit(1);
});