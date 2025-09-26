import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'ws';

@WebSocketGateway()
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    client.send(JSON.stringify({ type: 'connection', message: 'Connected to backend WebSocket!' }));
  }

  handleDisconnect(client: Socket) {
  }

  emitExposureUpdate(userId: string, exposure: number) {
    if (this.server) {
      const eventData = JSON.stringify({
        type: 'exposureUpdate',
        userId: userId,
        exposure: exposure
      });

      this.server.clients.forEach(client => {
        if (client.readyState === client.OPEN) {
          client.send(eventData);
        }
      });
    }
  }
}