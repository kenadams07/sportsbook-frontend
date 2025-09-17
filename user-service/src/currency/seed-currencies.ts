import { NestFactory } from '@nestjs/core';
import { CurrencyModule } from './currency.module';
import { CurrencyService } from './currency.service';

async function seedCurrencies() {
  const app = await NestFactory.createApplicationContext(CurrencyModule);
  const currencyService = app.get(CurrencyService);

  const currencies = [
    { name: 'British Pound', code: 'GBP', value: 1.0000 },
    { name: 'US Dollar', code: 'USD', value: 1.2500 },
    { name: 'Euro', code: 'EUR', value: 1.1500 },
  ];

  for (const currency of currencies) {
    try {
      await currencyService.create(currency);
      console.log(`Created currency: ${currency.name} (${currency.code})`);
    } catch (error) {
      console.log(`Currency ${currency.name} might already exist`);
    }
  }

  await app.close();
}

seedCurrencies().catch((error) => {
  console.error('Error seeding currencies:', error);
  process.exit(1);
});