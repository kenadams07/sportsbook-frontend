import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WsAdapter } from '@nestjs/platform-ws';
import { ValidationPipe } from '@nestjs/common';
import { Transport, RmqOptions  } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  app.useWebSocketAdapter(new WsAdapter(app));

  // Configure CORS for specific domains including user-api.xfair91.com
  app.enableCors({
    origin: [
      'https://user-api.xfair91.com',
      'http://user-api.xfair91.com',
      'https://xfair91.com',
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:5002'
    ],
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
    credentials: true,
    optionsSuccessStatus: 204,  
    preflightContinue: false
  });

  const port = process.env.PORT ?? 3001;
  await app.listen(port);
  console.log(`🚀 User service running on port ${port}`);
}
bootstrap();