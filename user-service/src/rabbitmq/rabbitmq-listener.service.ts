import { Injectable } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Injectable()
export class RabbitMQListenerService {
  @MessagePattern({ cmd: 'user_to_admin' })
  handleAdminMessage(@Payload() data: any) {
    console.log('Received message from Admin:', data);
    return { status: 'ok', data };
  }
}
