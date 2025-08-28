import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WsAdapter } from '@nestjs/platform-ws';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable global validation
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  // Enable WebSocket support
  app.useWebSocketAdapter(new WsAdapter(app));

  // Enhanced CORS configuration
  app.enableCors({
    origin: (origin, callback) => {
      // Allow all origins in development
      // In production, you should specify your frontend domain(s)
      callback(null, true);
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Authorization, X-Requested-With, Accept',
    credentials: true,
    optionsSuccessStatus: 204,
    preflightContinue: false,
  });

  console.log('Application is starting...', process.env.PORT);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();