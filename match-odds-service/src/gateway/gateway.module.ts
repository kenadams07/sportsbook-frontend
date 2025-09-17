import { Module } from '@nestjs/common';
import { SocketGateway } from './socket.gateway';
import { OddsModule } from '../odds/odds.module';

@Module({
  imports: [OddsModule],
  providers: [SocketGateway],
})
export class GatewayModule {}
