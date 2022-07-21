import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';

@WebSocketGateway(80, { cors: true })
export class ServerGateway {
  @WebSocketServer()
  server;

  @SubscribeMessage('connected')
  handleConnect(client: Socket, data: string): void {
    console.log(client, data);

    this.server.emit('connected', 'from server');
  }
}
