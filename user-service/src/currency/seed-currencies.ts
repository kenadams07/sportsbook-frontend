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
    } catch (error) {
    }
  }

  await app.close();
}

seedCurrencies().catch((error) => {
  process.exit(1);
});