import { ConsoleLogger, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { WsChannelAdminGuard } from 'src/common/guard/ws-channel-admin/ws-channel-admin.guard';
import { WsTargetRoleGuard } from 'src/common/guard/ws-target-role/ws-target-role.guard';
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
    private mutedUser = new Map<number, Map<string, Date>>();
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
          socket.userId = payload.sub;
      } catch (err) {
        next(new Error('Invalid credentials.'));
      }
      next();
    });
  }
  
  @SubscribeMessage('new Message')
  async handleMessage(client: any, payload: any) {
    payload.senderId = client.userId;
    if (this.mutedUser.has(client.userId)){
      const rooms = this.mutedUser.get(client.userId);
      if (rooms.has('/channel/' + payload.channelId)){
        const cuurentTime = new Date();
        if (rooms.get('/channel/' + payload.channelId) > cuurentTime)
          return {errorMessage:'관리자에 의해 메시지가 차단되었습니다. 잠시 후 다시 시도해주세요.'};
      }
    }
    const newMesage = await this.messagesService.create(payload);
    this.server.to('/channel/' + payload.channelId).emit('new Message', newMesage);
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

  @SubscribeMessage('kick User')
  @UseGuards(WsChannelAdminGuard, WsTargetRoleGuard)
  handleKickUser(@MessageBody('channelId') channelId: number, @MessageBody('targetId') targetId: number, @MessageBody('channelName') channelName: string){
    this.server.to('private/' + targetId).emit('kick User', {channelId: channelId, targetId: targetId, channelName: channelName});
    this.server.to('/channel/' + channelId).emit('leave Channel', {channelId: channelId, targetId: targetId});
  }

  @SubscribeMessage('mute User')
  @UseGuards(WsChannelAdminGuard, WsTargetRoleGuard)
  handleMuteUser(client: any, payload: any){
    this.server.to('private/' + payload.targetId).emit('mute User', payload);
    if (!this.mutedUser.has(payload.targetId))
      this.mutedUser.set(payload.targetId, new Map<string, Date>());
    const rooms = this.mutedUser.get(payload.targetId);
    const currentTime = new Date()
    rooms.set('/channel/' + payload.channelId, new Date(currentTime.getTime() + 3 * 60 * 1000));
  }

  handleConnection(client: any, ...args: any) {
    console.log("connection " + client.userId);
    client.join('private/' + client.userId);
  }

  handleDisconnect(client: any): any{
    console.log("disconnect " + client.userId);
    const _this = this;
    if (this.mutedUser.has(client.userId) && !client.adapter.rooms.has('private/' + client.userId)){
      setTimeout(()=>{
        if (!client.adapter.rooms.has('private/' + client.userId))
          _this.mutedUser.delete(client.userId);
      }, 3 * 60 * 1000)
    }
  }
}