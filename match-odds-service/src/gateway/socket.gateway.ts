import {
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway()
export class SocketGateway {
  @WebSocketServer()
  server: Server;

  sendOddsUpdate(data: any) {
    this.server.emit('oddsUpdate', data);
  }
}
