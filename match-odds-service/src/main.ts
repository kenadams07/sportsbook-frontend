import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 9000);
  console.log(`Match Odds Service running on http://localhost:${process.env.PORT ?? 9000}`);
}
bootstrap();
