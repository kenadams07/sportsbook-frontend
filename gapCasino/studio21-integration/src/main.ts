import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  await app.listen(3001);
  console.log(`Studio 21 Integration API is running on: http://localhost:3001`);
}
bootstrap();