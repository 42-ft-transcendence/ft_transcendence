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
        console.log(err); //TODO: remove
        next(new Error('Invalid credentials.'));
      }
      next();
    });
  }
  @SubscribeMessage('new Message')
  async handleMessage(client: any, payload: MessageEntity) {
    payload.senderId = client.userID;
    const newMesage = await this.messagesService.create(payload);
    this.server.to('/channel/'+payload.channelId).emit('new Message', newMesage);
    return newMesage;
  }

  @SubscribeMessage('join Room')
  handleJoinRoom(client: any, payload: any){
    console.log("join room");
    console.log(payload);
    client.join(payload);
  }

  @SubscribeMessage('leave Room')
  handleLeaveRoom(client: any, payload: any){
    console.log('leave Room');
    console.log(payload);
    client.leave(payload);
  }

  handleConnection(client: any, ...args: any) {
    console.log("connection " + client.userID);
  }
  handleDisconnect(client): any{
    console.log("disconnect " + client.userID);
  }
}