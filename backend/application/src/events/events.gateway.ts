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
import { ChannelType, MapType } from '@prisma/client';
import { Server } from 'socket.io';
import {
	PrismaService,
	SocketException,
	WsChannelAdminGuard,
	WsCheckBlockGuard,
	WsCheckTargetInGuard,
	WsCheckUserInGuard,
	WsTargetRoleGuard,
} from 'src/common';
import { MessagesService } from 'src/messages/messages.service';
import { UsersService } from 'src/users/users.service';
import { SocketExceptionFilter } from './filter';
import { GameStatus, SocketWithUserId, UserState } from './type';
import { PongService } from './pong/pong.service';
import { GameQueue } from './type/game-queue';

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
		private pongService: PongService,
	) {}

	private mutedUser = new Map<number, Map<string, Date>>();
	private userState = new Map<number, UserState>();
	private gameQueue = new GameQueue();

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
	handleCreateChannel(
		@ConnectedSocket() client: SocketWithUserId,
		@MessageBody() payload: any,
	) {
		this.server.to('/channel/' + payload.id).emit('someone has joined', {
			channelId: payload.id,
			targetId: client.userId,
		});
		this.server.to('private/' + client.userId).emit('create Channel', payload);
	}

	@SubscribeMessage('create DMChannel')
	async handleCreateDMChannel(
		@ConnectedSocket() client: SocketWithUserId,
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
	handleCreateFollowee(
		@ConnectedSocket() client: SocketWithUserId,
		@MessageBody() payload: any,
	) {
		this.server.to('private/' + client.userId).emit('create Followee', payload);
	}

	@SubscribeMessage('remove Channel')
	handleRemoveChannel(
		@ConnectedSocket() client: SocketWithUserId,
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
		@ConnectedSocket() client: SocketWithUserId,
		@MessageBody('channelId') channelId: number,
	) {
		this.server
			.to('private/' + client.userId)
			.emit('remove DMChannel', { channelId: channelId });
	}

	@SubscribeMessage('remove Followee')
	handleRemoveFollowee(
		@ConnectedSocket() client: SocketWithUserId,
		@MessageBody('followeeId') followeeId,
	) {
		this.server
			.to('private/' + client.userId)
			.emit('remove Followee', { id: followeeId });
	}

	@SubscribeMessage('new Message')
	@UseFilters(SocketExceptionFilter)
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
		this.server
			.to('/channel/' + payload.channelId)
			.emit('new Message', newMesage);
		return newMesage;
	}

	@SubscribeMessage('new Direct Message')
	@UseFilters(SocketExceptionFilter)
	@UseGuards(WsCheckBlockGuard)
	async handleNewDirectMessage(
		@ConnectedSocket() client: SocketWithUserId,
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
	@UseFilters(SocketExceptionFilter)
	@UseGuards(WsCheckUserInGuard)
	async handleJoinChannel(
		@ConnectedSocket() client: SocketWithUserId,
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
		const id = payload.substring(9);
		client.leave(payload);
		client.leave('/channel/directChannel/' + id);
	}

	@SubscribeMessage('kick User')
	@UseFilters(SocketExceptionFilter)
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
	@UseFilters(SocketExceptionFilter)
	@UseGuards(WsChannelAdminGuard, WsTargetRoleGuard, WsCheckTargetInGuard)
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
		@ConnectedSocket() client: SocketWithUserId,
		@MessageBody('targetId') targetId: number,
	) {
		client.join('follower/' + targetId);
		if (this.server.sockets.adapter.rooms.has('private/' + targetId))
			this.server
				.to('private/' + client.userId)
				.emit('change followeeState', { userId: targetId, state: true });
		else
			this.server
				.to('private/' + client.userId)
				.emit('change followeeState', { userId: targetId, state: false });
	}

	@SubscribeMessage('join GameQueue')
	handleJoinGameQueue(@ConnectedSocket() client: SocketWithUserId, @MessageBody('mapType') mapType: MapType) {
		// user가 등록가능한 상태인지 확인
		if (this.userState.has(client.userId)){
			return {errorMessage: '게임 중이거나 상대방을 찾고 있습니다.'};
		}
		this.userState.set(client.userId, 'waiting');
		this.server.to(client.id).emit('get UserState', 'waiting');
		// 게임큐 넣기 전에 확인
		// 1명 대기하고 온라인 상태인지 확인 => 대기하고 있는 사람이 나갈 수 있음.
		let legnth = this.gameQueue.legnth(mapType);
		if (legnth === 0){
			this.gameQueue.push(mapType, { socketId:client.id, userId:client.userId });
			return ;
		}
		let opponentInfo = undefined;
		while (this.gameQueue.legnth(mapType) !== 0) {
			const socketInfo = this.gameQueue.shift(mapType);
			// 상대방이 온라인인지 확인 및 예정에 등록했던 자신이 아닐때 => 대기큐에 있다가 tab을 종료한 경우
			if (this.server.sockets.adapter.rooms.has(socketInfo.socketId)) {
				opponentInfo = socketInfo;
				break;
			}
		}
		if (opponentInfo === undefined){
			this.gameQueue.push(mapType, { socketId:client.id, userId:client.userId });
			return ;
		};
		const userIds = [client.userId, opponentInfo.userId].sort(
			(a, b) => a - b,
		);
		const roomTitle = `${userIds[0]}_${userIds[1]}`;
		this.server.sockets.sockets.get(client.id).join(roomTitle);
		this.server.sockets.sockets
					.get(opponentInfo.socketId)
					.join(roomTitle);
		const gameStatus = new GameStatus(
			userIds[0],
			userIds[1],
			mapType,
			roomTitle,
		);
		this.userState.set(opponentInfo.userId, gameStatus);
		this.userState.set(client.userId, gameStatus);
		this.server.to(roomTitle).emit('goto Url', '/game');
		this.server.to(roomTitle).emit('get UserState', 'gamming');
		setTimeout(() => {
			this.pongService.startGame(
				gameStatus,
				this.server.to(roomTitle),
				mapType,
				this.userState,
				this.server,
			);
		}, 3000);
	}

	@SubscribeMessage('invite')
	@UseFilters(SocketExceptionFilter)
	async handleInvitation(
		@ConnectedSocket() client: SocketWithUserId,
		@MessageBody()
		payload: {
			userName: string;
			mapType: string;
			opponentId: number;
			socketId: string;
		},
	) {
		// 1. 상대방이 로그인 중인지 확인하고 로그인 중이 아니라면 취소
		if (!this.server.sockets.adapter.rooms.has(`private/${payload.opponentId}`))
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
		this.userState.set(payload.opponentId, 'waiting');
		this.userState.set(client.userId, 'waiting');
		// 3. 어떤 맵에 대해 누가 초대했는지 대상 사용자에게 알림을 보내 수락/거절을 요청하기
		try {
			const response: { answer: boolean; socketId: string }[] =
				await this.server
					.to(`private/${payload.opponentId}`)
					.timeout(15000)
					.emitWithAck('show Invitation', payload);
			const trueIndex = response.findIndex((res) => res.answer);
			if (trueIndex !== -1) {
				//TODO: 게임 실행 로직 구현
				// 두 사용자가 게임을 하기 위한 소켓 룸 생성
				const userIds = [client.userId, payload.opponentId].sort(
					(a, b) => a - b,
				);
				const roomTitle = `${userIds[0]}_${userIds[1]}`;
				this.server.sockets.sockets.get(client.id).join(roomTitle);
				this.server.sockets.sockets
					.get(response[trueIndex].socketId)
					.join(roomTitle);
				// 두 사용자가 참여하는 게임 룸에 대한 정보 생성
				const gameStatus = new GameStatus(
					userIds[0],
					userIds[1],
					payload.mapType,
					roomTitle,
				);
				this.userState.set(payload.opponentId, gameStatus);
				this.userState.set(client.userId, gameStatus);
				this.server.to(roomTitle).emit('goto Url', '/game');
				this.server.to(roomTitle).emit('deactivate Sidebars');
				this.server.to(roomTitle).emit('get UserState', 'gamming');
				setTimeout(() => {
					this.pongService.startGame(
						gameStatus,
						this.server.to(roomTitle),
						payload.mapType,
						this.userState,
						this.server,
					);
				}, 3000);
			} else
				throw new SocketException('Forbidden', '상대방이 초대를 거절했습니다');
		} catch (e) {
			this.userState.delete(payload.opponentId);
			this.userState.delete(client.userId);
			throw new SocketException('Forbidden', '상대방이 초대를 거절했습니다');
		}
	}

	@SubscribeMessage('move Player')
	movePlayer(
		@ConnectedSocket() client: SocketWithUserId,
		@MessageBody() payload,
	) {
		const userState = this.userState.get(client.userId);
		if (userState && userState !== 'waiting') {
			(userState as GameStatus).movePlayer(client.userId, payload.direction);
		}
	}

	// @SubscribeMessage('update WinCount')
	// updateWinCount(@ConnectedSocket() client: SocketWithUserId) {
	// 	this.prisma.user.update({
	// 		where: { id: client.userId },
	// 		data: { winCount: { increment: 1 } },
	// 	});
	// }

	// @SubscribeMessage('update LoseCount')
	// updateLoseCount(@ConnectedSocket() client: SocketWithUserId) {
	// 	this.prisma.user.update({
	// 		where: { id: client.userId },
	// 		data: { loseCount: { increment: 1 } },
	// 	});
	// }

	@SubscribeMessage('get UserState')
	getUserState(@ConnectedSocket() client: SocketWithUserId) {
		const state = this.userState.get(client.userId);
		if (state === undefined) return '';
		if (state === 'waiting') return state;
		const room = this.server.sockets.adapter.rooms.get(state.roomTitle);
		if (room.size !== 2) {
			const socket: any = this.server.sockets.sockets.get([...room][0]);
			if (client.userId !== socket.userId) {
				client.join(state.roomTitle);
				return 'gamming';
			}
		}
		if (room.has(client.id))
			return 'gamming';
		return '';
	}

	handleConnection(client: SocketWithUserId, ...args: any) {
		console.log('connection ' + client.userId);
		if (!this.server.sockets.adapter.rooms.has('private/' + client.userId))
			this.server
				.to('follower/' + client.userId)
				.emit('change followeeState', { userId: client.userId, state: true });
		client.join('private/' + client.userId);
	}

	handleDisconnect(client: SocketWithUserId): any {
		console.log('disconnect ' + client.userId);
		const _this = this;
		if (
			this.mutedUser.has(client.userId) &&
			!this.server.sockets.adapter.rooms.has('private/' + client.userId)
		) {
			setTimeout(() => {
				if (!this.server.sockets.adapter.rooms.has('private/' + client.userId))
					_this.mutedUser.delete(client.userId);
			}, 3 * 60 * 1000);
		}
		if (!this.server.sockets.adapter.rooms.has('private/' + client.userId))
			this.server
				.to('follower/' + client.userId)
				.emit('change followeeState', { userId: client.userId, state: false });
		const state = this.userState.get(client.userId);
		if (state === "waiting" && this.gameQueue.has(client.id)){
			this.userState.delete(client.userId);
		}
	}
}
