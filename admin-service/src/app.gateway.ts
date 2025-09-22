import { WebSocketGateway, WebSocketServer, OnGatewayConnection } from '@nestjs/websockets';
import { Server } from 'http';

@WebSocketGateway() // Removed port option
export class AppGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  handleConnection(client: any) {
    console.log('Client connected:', client.id);
    client.send(JSON.stringify({ type: 'connection', message: 'Connected to backend WebSocket!' }));
  }
}