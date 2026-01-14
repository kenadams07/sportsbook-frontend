import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';
import { WsAdapter } from '@nestjs/platform-ws';
import * as net from 'net';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for frontend development
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  });

  // Enable WebSocket support
  app.useWebSocketAdapter(new WsAdapter(app));

  const rabbitUrl = process.env.RABBITMQ_URL;
  const canConnectToBroker = async (url?: string) => {
    if (!url) return false;
    try {
      const parsed = new URL(url);
      const host = parsed.hostname;
      const port = parseInt(parsed.port || '5672', 10);
      return await new Promise<boolean>((resolve) => {
        const socket = new net.Socket();
        const timeout = 3000;
        socket.setTimeout(timeout);
        socket.once('connect', () => {
          socket.destroy();
          resolve(true);
        });
        socket.once('timeout', () => {
          socket.destroy();
          resolve(false);
        });
        socket.once('error', () => {
          socket.destroy();
          resolve(false);
        });
        socket.connect(port, host);
      });
    } catch {
      return false;
    }
  };

  if (await canConnectToBroker(rabbitUrl)) {
    app.connectMicroservice({
      transport: Transport.RMQ,
      options: {
        urls: [rabbitUrl as string],
        queue: 'user_queue',
        queueOptions: { durable: true },
        noAck: false,
      },
    });
    await app.startAllMicroservices();
    console.log('✅ Connected to RabbitMQ microservice');
  } else {
    console.warn(
      '⚠️ RabbitMQ not reachable or RABBITMQ_URL not set. Skipping microservice connection.',
    );
  }

  const port = process.env.PORT ?? 3002;
  await app.listen(port);
  console.log(`🚀 Admin service running on: http://localhost:${port}`);
}
bootstrap();
