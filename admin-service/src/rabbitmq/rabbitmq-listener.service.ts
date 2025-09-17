import { Injectable } from '@nestjs/common';
import { MessagePattern, Payload, Ctx, RmqContext } from '@nestjs/microservices';

@Injectable()
export class RabbitMQListenerService {
  @MessagePattern('user_to_admin')
  handleAdminMessage(@Payload() data: any, @Ctx() context: RmqContext) {
    console.log('[Listener] Received message from User:', data);

    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    // Optional: ack the message manually
    channel.ack(originalMsg);

    const response = { status: 'ok', data };
    console.log('[Listener] Responding with:', response);
    return response; // This is sent back to sender
  }
}
