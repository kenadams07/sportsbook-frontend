import { Injectable } from '@nestjs/common';
import { RabbitMQTriggerService } from 'src/rabbitmq/rabbitmq-trigger.service';

@Injectable()
export class QueueTest {
  constructor(private readonly triggerService: RabbitMQTriggerService) {}

  async notifyAdmin(payload: any) {
    console.log('[QueueTest] notifyAdmin called with payload:', payload);

    try {
      const result = await this.triggerService.trigger(
        'user_queue',        // Queue name
        payload,              // Payload
        'user_to_admin' // Pattern
      );

      console.log('[QueueTest] Admin response received:', result);
      return result;
    } catch (error) {
      console.error('[QueueTest] Failed to notify admin:', error);
      throw new Error('Admin notification failed');
    }
  }
}

