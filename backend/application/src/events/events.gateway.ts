import { ConfigService } from '@nestjs/config';
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer, WsException } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { MessageEntity } from 'src/messages/entities';
import { MessagesService } from 'src/messages/messages.service';
import { UsersService } from 'src/users/users.service';

@WebSocketGateway()
export class EventsGateway implements OnGatewayConnection, OnGatewayInit, OnGatewayDisconnect{
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
    private readonly messagesService: MessagesService,
  ){}
  @WebSocketServer()
    server: Server;
  
  afterInit(server: any) {
    server.use(async (socket, next) => {
      const jwt = require('jsonwebtoken');
      const token = socket.handshake.auth.token;
      const secretOrKey = this.configService.get<string>('JWT_SECRET_KEY');
      try {
        const payload = jwt.verify(token, secretOrKey);
        if (this.usersService.findOne(payload.sub))
          socket.userID = payload.sub;
      } catch (err) {
        console.log(err);
        next(new Error('Invalid credentials.'));
      }
      next();
    });
  }
  @SubscribeMessage('new Message')
  async handleMessage(client: any, payload: MessageEntity) {
    // TODO:  payload 검증하기
      const newMesage = await this.messagesService.create(payload);
      this.server.emit('new Message', newMesage);
      return newMesage;
    }
  handleConnection(client: any, ...args: any) {
    console.log("connection");
  }
  handleDisconnect(client): any{
    console.log("disconnect")
  }
}