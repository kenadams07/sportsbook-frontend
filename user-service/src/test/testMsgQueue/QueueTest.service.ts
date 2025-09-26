import { Injectable } from '@nestjs/common';
import { RabbitMQTriggerService } from 'src/rabbitmq/rabbitmq-trigger.service';

@Injectable()
export class QueueTest {
  constructor(private readonly triggerService: RabbitMQTriggerService) {}

  async notifyAdmin(payload: any) {
    try {
      const result = await this.triggerService.trigger(
        'user_queue',
        payload,
        'user_to_admin'
      );

      return result;
    } catch (error) {
      throw new Error('Admin notification failed');
    }
  }
}