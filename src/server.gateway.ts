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

  private sockets = new Map();

  @SubscribeMessage('connected')
  handleConnect(client: Socket, data: string): void {
    this.sockets.set(client.id, {
      isResponded: false,
      attempts: 0,
      repeater: null,
    });

    this.checkAndSend(client.id);

    this.sockets.get(client.id).repeater = setInterval(() => {
      if (
        !this.sockets.get(client.id).isResponded &&
        this.sockets.get(client.id).attempts != 3
      ) {
        this.checkAndSend(client.id);
      } else {
        if (this.sockets.get(client.id).isResponded) {
          console.log(
            `client with id: ${client.id} has responded in ${
              this.sockets.get(client.id).attempts
            } attempt(s)!`,
          );
        } else {
          console.log(
            `client with id: ${client.id} has not responded in 3 attempts!`,
          );
        }
        clearInterval(this.sockets.get(client.id).repeater);
      }
    }, 10000);
  }

  @SubscribeMessage('random')
  handleRandomMessage(client: Socket, data: string): void {
    this.sockets.set(client.id, {
      ...this.sockets.get(client.id),
      isResponded: true,
    });
  }

  checkAndSend(socketId) {
    this.server.emit('conn-checked', 'from server');
    this.sockets.set(socketId, {
      ...this.sockets.get(socketId),
      isResponded: false,
      attempts: this.sockets.get(socketId).attempts + 1,
    });
  }
}
