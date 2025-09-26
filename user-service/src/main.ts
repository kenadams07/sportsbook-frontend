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

  app.enableCors({
    origin: (origin, callback) => {
      callback(null, true);
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Authorization, X-Requested-With, Accept',
    credentials: true,
    optionsSuccessStatus: 204,
    preflightContinue: false,
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();