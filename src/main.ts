import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WsAdapter } from '@nestjs/platform-ws';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable WebSocket support
  app.useWebSocketAdapter(new WsAdapter(app));

  app.enableCors({
    origin: (origin, callback) => {
      // allow all origins, including tools like Postman (no origin)
      callback(null, true);
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true,
    optionsSuccessStatus: 204,  // useful for legacy browsers
    preflightContinue: false,
  });

  console.log('Application is starting...', process.env.PORT);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
