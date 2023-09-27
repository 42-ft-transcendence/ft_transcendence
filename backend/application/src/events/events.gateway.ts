import { UseFilters, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import {
	ConnectedSocket,
	MessageBody,
	OnGatewayConnection,
	OnGatewayDisconnect,
	OnGatewayInit,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
} from '@nestjs/websockets';
import { ChannelType } from '@prisma/client';
import { Server } from 'socket.io';
import {
	PrismaService,
	SocketException,
	WsChannelAdminGuard,
	WsCheckBlockGuard,
	WsCheckUserInGuard,
	WsTargetRoleGuard,
} from 'src/common';
import { MessagesService } from 'src/messages/messages.service';
import { UsersService } from 'src/users/users.service';
import { SocketExceptionFilter } from './filter';

@WebSocketGateway()
export class EventsGateway
	implements OnGatewayConnection, OnGatewayInit, OnGatewayDisconnect
{
	constructor(
		private configService: ConfigService,
		private jwtService: JwtService,
		private usersService: UsersService,
		private prisma: PrismaService,
		private readonly messagesService: MessagesService,
	) {}

	private mutedUser = new Map<number, Map<string, Date>>();
	private userState = new Set<number>();

	@WebSocketServer()
	server: Server;

	afterInit(server: any) {
		server.use(async (socket, next) => {
			const token = socket.handshake.auth.token;
			const secret = this.configService.get<string>('JWT_SECRET_KEY');
			try {
				const payload = this.jwtService.verify(token, { secret });
				if (this.usersService.findOne(payload.user.id))
					socket.userId = payload.user.id;
			} catch (err) {
				next(new Error('Invalid credentials.'));
			}
			next();
		});
	}

	@SubscribeMessage('create Channel')
	handleCreateChannel(@ConnectedSocket() client, @MessageBody() payload: any) {
		this.server.to('/channel/' + payload.id).emit('someone has joined', {
			channelId: payload.id,
			targetId: client.userId,
		});
		this.server.to('private/' + client.userId).emit('create Channel', payload);
	}

	@SubscribeMessage('create DMChannel')
	async handleCreateDMChannel(
		@ConnectedSocket() client,
		@MessageBody()
		payload: { id: number; userName: string; avatar: string; userId: number },
	) {
		this.server
			.to('private/' + client.userId)
			.emit('create DMChannel', payload);
		// 상대에 dm채널을 만들어줘야한다. 상대방이 해당 채널에 들어와 있는 지 확인 후 내정보를 채널 정보와 함께 같이 보내준다.
		// 상대방이 이미 참여하고 있는 채널이였다면 채널날려줘도 상관없음.
		if (
			!!(await this.prisma.participant.findUnique({
				where: {
					channelId_userId: { channelId: payload.id, userId: payload.userId },
				},
			}))
		) {
			const participant = await this.prisma.participant.findUnique({
				where: {
					channelId_userId: { channelId: payload.id, userId: client.userId },
				},
				select: {
					user: { select: { avatar: true, nickname: true } },
				},
			});
			this.server.to('private/' + payload.userId).emit('create DMChannel', {
				id: payload.id,
				userName: participant.user.nickname,
				avatar: participant.user.avatar,
				userId: client.userId,
			});
		}
	}

	@SubscribeMessage('create Followee')
	handleCreateFollowee(@ConnectedSocket() client, @MessageBody() payload: any) {
		this.server.to('private/' + client.userId).emit('create Followee', payload);
	}

	@SubscribeMessage('remove Channel')
	handleRemoveChannel(
		@ConnectedSocket() client,
		@MessageBody('channelId') channelId: number,
	) {
		// TODO: 악성 유저가 remove channel event를 보내는 경우 연결되어 있는 유저에게는 음수까지 떨어질 수 있음. 새로고침하면 다시 문제 없음.
		this.server.to('/channel/' + channelId).emit('someone has left', {
			channelId: channelId,
			targetId: client.userId,
		});
		this.server
			.to('private/' + client.userId)
			.emit('remove Channel', { channelId: channelId });
	}

	@SubscribeMessage('remove DMChannel')
	handleRemoveDMChannel(
		@ConnectedSocket() client,
		@MessageBody('channelId') channelId: number,
	) {
		this.server
			.to('private/' + client.userId)
			.emit('remove DMChannel', { channelId: channelId });
	}

	@SubscribeMessage('remove Followee')
	handleRemoveFollowee(
		@ConnectedSocket() client,
		@MessageBody('followeeId') followeeId,
	) {
		this.server
			.to('private/' + client.userId)
			.emit('remove Followee', { id: followeeId });
	}

	@SubscribeMessage('new Message')
	@UseGuards(WsCheckUserInGuard)
	async handleMessage(client: any, payload: any) {
		payload.senderId = client.userId;
		if (this.mutedUser.has(client.userId)) {
			const rooms = this.mutedUser.get(client.userId);
			if (rooms.has('/channel/' + payload.channelId)) {
				const cuurentTime = new Date();
				if (rooms.get('/channel/' + payload.channelId) > cuurentTime)
					return {
						errorMessage:
							'관리자에 의해 메시지가 차단되었습니다. 잠시 후 다시 시도해주세요.',
					};
			}
		}
		const newMesage = await this.messagesService.create(payload);
		console.log(newMesage);
		this.server
			.to('/channel/' + payload.channelId)
			.emit('new Message', newMesage);
		return newMesage;
	}

	@SubscribeMessage('new Direct Message')
	@UseGuards(WsCheckBlockGuard)
	async handleNewDirectMessage(
		@ConnectedSocket() client,
		@MessageBody() payload,
	) {
		const newMesage = await this.messagesService.create({
			content: payload.content,
			channelId: payload.channelId,
			senderId: client.userId,
		});
		const channel = await this.prisma.participant.findUnique({
			where: {
				channelId_userId: {
					channelId: payload.channelId,
					userId: payload.interlocatorId,
				},
			},
		});
		if (channel === null) {
			const result = await this.prisma.participant.create({
				data: { userId: payload.interlocatorId, channelId: payload.channelId },
			});
			this.server
				.to('private/' + payload.interlocatorId)
				.emit('create DMChannel', {
					id: payload.channelId,
					userId: newMesage.sender.id,
					userName: newMesage.sender.nickname,
					avatar: newMesage.sender.avatar,
				});
		}
		this.server
			.to('/channel/directChannel/' + payload.channelId)
			.emit('new Message', newMesage);
		return newMesage;
	}

	@SubscribeMessage('join Room')
	handleJoinRoom(client: any, payload: string) {
		console.log('join room');
		console.log(payload);
		if (payload.includes('/channel/'))
			return { errorMessage: '유효하지 않은 접근.' };
		client.join(payload);
	}

	@SubscribeMessage('join Channel')
	@UseGuards(WsCheckUserInGuard)
	async handleJoinChannel(
		@ConnectedSocket() client,
		@MessageBody('channelId') channelId: string,
	) {
		const channel = await this.prisma.channel.findUnique({
			where: { id: Number(channelId) },
			select: { type: true },
		});
		if (channel === null) return { errorMessage: '유효하지 않은 채널.' };
		if (channel.type !== ChannelType.ONETOONE) {
			console.log('join room: /channel/' + channelId);
			client.join('/channel/' + channelId);
		} else {
			console.log('join room: /channel/directChannel/' + channelId);
			client.join('/channel/directChannel/' + channelId);
		}
	}

	@SubscribeMessage('leave Room')
	async handleLeaveRoom(client: any, payload: string) {
		console.log(`leave Room: ${payload}`);
		if (payload.includes('/channel/')) {
			const id = payload.substring(9);
			const channel = await this.prisma.channel.findUnique({
				where: { id: Number(id) },
				select: { type: true },
			});
			if (channel.type !== ChannelType.ONETOONE) client.leave(payload);
			else client.leave('/channel/directChannel/' + id);
		} else client.leave(payload);
	}

	@SubscribeMessage('kick User')
	@UseGuards(WsChannelAdminGuard, WsTargetRoleGuard)
	handleKickUser(
		@MessageBody('channelId') channelId: number,
		@MessageBody('targetId') targetId: number,
		@MessageBody('channelName') channelName: string,
	) {
		this.server.to('private/' + targetId).emit('kick User', {
			channelId: channelId,
			targetId: targetId,
			channelName: channelName,
		});
		this.server
			.to('/channel/' + channelId)
			.emit('someone has left', { channelId: channelId, targetId: targetId });
	}

	@SubscribeMessage('mute User')
	@UseGuards(WsChannelAdminGuard, WsTargetRoleGuard)
	handleMuteUser(client: any, payload: any) {
		this.server.to('private/' + payload.targetId).emit('mute User', payload);
		if (!this.mutedUser.has(payload.targetId))
			this.mutedUser.set(payload.targetId, new Map<string, Date>());
		const rooms = this.mutedUser.get(payload.targetId);
		const currentTime = new Date();
		const destTime = new Date(currentTime.getTime() + 3 * 60 * 1000);
		rooms.set('/channel/' + payload.channelId, destTime);
		return destTime;
	}

	@SubscribeMessage('subscribe userState')
	handleSubscribeUserState(
		@ConnectedSocket() client,
		@MessageBody('targetId') targetId: number,
	) {
		client.join('follower/' + targetId);
		if (client.adapter.rooms.has('private/' + targetId))
			this.server
				.to('private/' + client.userId)
				.emit('change followeeState', { userId: targetId, state: true });
		else
			this.server
				.to('private/' + client.userId)
				.emit('change followeeState', { userId: targetId, state: false });
	}

	@SubscribeMessage('invite')
	@UseFilters(SocketExceptionFilter)
	async handleInvitation(
		@ConnectedSocket() client: any,
		@MessageBody()
		payload: { userName: string; mapType: string; opponentId: number },
	) {
		// 1. 상대방이 로그인 중인지 확인하고 로그인 중이 아니라면 취소
		if (!client.adapter.rooms.has(`private/${payload.opponentId}`))
			//상대방이 로그인 상태가 아니어서 게임을 진행할 수 없다고 사용자에게 알리기
			throw new SocketException('Forbidden', '상대방이 로그아웃 상태입니다.');
		// 2. 상대방과 자기 자신이 초대 가능 상태인지 확인하고 초대 가능 상태가 아니라면 취소
		if (this.userState.has(client.userId))
			//사용자가 초대를 보낼 수 있는 상태가 아니라고 알리기
			throw new SocketException(
				'Forbidden',
				'당신은 초대를 보낼 수 있는 상태가 아닙니다.',
			);
		if (this.userState.has(payload.opponentId))
			//상대방이 초대를 받을 수 있는 상태가 아니라고 알리기
			throw new SocketException(
				'Forbidden',
				'상대방이 초대를 받을 수 있는 상태가 아닙니다.',
			);
		this.userState.add(payload.opponentId);
		this.userState.add(client.userId);
		// 3. 어떤 맵에 대해 누가 초대했는지 대상 사용자에게 알림을 보내 수락/거절을 요청하기
		try {
			const response: { answer: boolean } = await this.server
				.to(`private/${payload.opponentId}`)
				.timeout(15000)
				.emitWithAck('show Invitation', payload);
			console.log(response);
			if (response[0].answer) {
				//TODO: 게임 실행 로직 구현
			} else
				throw new SocketException('Forbidden', '상대방이 초대를 거절했습니다');
		} catch (e) {
			this.userState.delete(payload.opponentId);
			this.userState.delete(client.userId);
			throw new SocketException('Forbidden', '상대방이 초대를 거절했습니다');
		}
	}

	handleConnection(client: any, ...args: any) {
		console.log('connection ' + client.userId);
		if (!client.adapter.rooms.has('private/' + client.userId))
			this.server
				.to('follower/' + client.userId)
				.emit('change followeeState', { userId: client.userId, state: true });
		client.join('private/' + client.userId);
	}

	handleDisconnect(client: any): any {
		console.log('disconnect ' + client.userId);
		const _this = this;
		if (
			this.mutedUser.has(client.userId) &&
			!client.adapter.rooms.has('private/' + client.userId)
		) {
			setTimeout(() => {
				if (!client.adapter.rooms.has('private/' + client.userId))
					_this.mutedUser.delete(client.userId);
			}, 3 * 60 * 1000);
		}
		if (!client.adapter.rooms.has('private/' + client.userId))
			this.server
				.to('follower/' + client.userId)
				.emit('change followeeState', { userId: client.userId, state: false });
	}
}
