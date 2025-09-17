import { Injectable, OnModuleInit } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
  RmqOptions,
} from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RabbitPublisher implements OnModuleInit {
  private client: ClientProxy;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    const rabbitUrl = this.configService.get<string>('RABBITMQ_URL');
    const rabbitQueue = this.configService.get<string>('RABBITMQ_QUEUE');

    if (!rabbitUrl || !rabbitQueue) {
      throw new Error('RabbitMQ configuration is missing in environment variables');
    }

    const rmqOptions: RmqOptions = {
      transport: Transport.RMQ,
      options: {
        urls: [rabbitUrl],
        queue: rabbitQueue,
        queueOptions: { durable: true },
      },
    };

    this.client = ClientProxyFactory.create(rmqOptions);
  }

  async sendMessage(pattern: string, data: any) {
    if (!this.client) {
      throw new Error('RabbitMQ client not initialized');
    }
    return lastValueFrom(this.client.emit(pattern, data));
  }
}
