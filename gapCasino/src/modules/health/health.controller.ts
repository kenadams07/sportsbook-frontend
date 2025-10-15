import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Get()
  healthCheck(): { status: string; timestamp: number; service: string } {
    return {
      status: 'ok',
      timestamp: Date.now(),
      service: 'gap-casino',
    };
  }
}