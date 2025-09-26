import { Injectable } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Injectable()
export class RabbitMQListenerService {
  @MessagePattern({ cmd: 'user_to_admin' })
  handleAdminMessage(@Payload() data: any) {
    return { status: 'ok', data };
  }
}