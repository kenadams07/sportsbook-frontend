import { Controller, Post, Body } from '@nestjs/common';
import { QueueTest } from './QueueTest.service';

@Controller('test') // This is the base path for this controller
export class TestController {
  constructor(private readonly queueTest: QueueTest) {}

  @Post('msgqueue') // Full route: POST /test/msgqueue
  async sendMessage(@Body() payload: any) {
    return this.queueTest.notifyAdmin(payload);
  }
}

