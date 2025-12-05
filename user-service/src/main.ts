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

  // More specific CORS configuration
  app.enableCors({
    origin: [
      'http://localhost:3000', 
      'http://localhost:5002', 
      'https://odds-api.xfair91.com', 
      'http://odds-api.xfair91.com',
      'https://user-api.xfair91.com',
      'http://user-api.xfair91.com'
    ],
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
    credentials: true,
    optionsSuccessStatus: 204,
    preflightContinue: false,
  });

  // Handle OPTIONS requests globally using Express instance
  const expressInstance = app.getHttpAdapter().getInstance();
  expressInstance.options('*', (req, res) => {
    res.header('Access-Control-Allow-Origin', 'https://user-api.xfair91.com');
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.sendStatus(204);
  });

  await app.listen(process.env.PORT ?? 3001);
  console.log(`🚀 User service running on: http://localhost:${process.env.PORT ?? 3001}`);
}
bootstrap();