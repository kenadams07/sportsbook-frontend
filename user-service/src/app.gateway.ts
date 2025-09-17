import { WebSocketGateway, WebSocketServer, OnGatewayConnection } from '@nestjs/websockets';
import { Server, Socket } from 'ws';

@WebSocketGateway() // Removed port option
export class AppGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log('Client connected:', client._socket.remoteAddress);
    client.send(JSON.stringify({ type: 'connection', message: 'Connected to backend WebSocket!' }));
  }
}
