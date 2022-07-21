import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';

@WebSocketGateway()
export class ServerGateway {
  @WebSocketServer()
  server;

  @SubscribeMessage('message')
  handleMessage(client: Socket, data: string): void {
    this.server.emit('message', data);
  }
}
