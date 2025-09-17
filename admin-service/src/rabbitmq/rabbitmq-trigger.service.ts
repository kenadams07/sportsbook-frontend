import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport, RmqOptions } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class RabbitMQTriggerService implements OnModuleDestroy {
  private clients: Record<string, ClientProxy> = {};

  private getClient(queue: string): ClientProxy {
    if (!this.clients[queue]) {
      const url = process.env.RABBITMQ_URL;
      console.log(url, "RABBITMQ URL is not defined");
      if (!url) throw new Error('RABBITMQ_URL is not defined');

      const clientOptions: RmqOptions = {
        transport: Transport.RMQ,
        options: {
          urls: [url],
          queue,
          queueOptions: { durable: true },
        },
      };

      this.clients[queue] = ClientProxyFactory.create(clientOptions);
    }
    return this.clients[queue];
  }

  async trigger<T = any, R = any>(queue: string, payload: T, pattern: any = {}): Promise<R> {
    const client = this.getClient(queue);
    return firstValueFrom(client.send<R>(pattern, payload));
  }

  async onModuleDestroy() {
    await Promise.all(Object.values(this.clients).map(client => client.close()));
  }
}
