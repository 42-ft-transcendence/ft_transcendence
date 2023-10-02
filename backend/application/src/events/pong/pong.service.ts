import { HttpException, Injectable } from '@nestjs/common';
import { BroadcastOperator, Server } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { GameStatus, UserState } from '../type';
import { MapType, MatchType } from '@prisma/client';
import { PrismaService } from 'src/common';

@Injectable()
export class PongService {
	constructor(private prisma: PrismaService) {}
	async startGame(
		gameStatus: GameStatus,
		room: BroadcastOperator<DefaultEventsMap, any>,
		mapType: string,
		userState: Map<number, UserState>,
		server: Server,
	) {
		let playing = true;
		let booster = 0;
		let waiting = 30 * 60;
		const users = server.sockets.adapter.rooms.get(gameStatus.roomTitle);
		const matchAt: number = Date.now();
		const intervalId = setInterval(async () => {
			if (playing && users.size === 2) {
				if (mapType === MapType.FAST) gameStatus.moveBall(booster);
				else gameStatus.moveBall();
				if (gameStatus.paddleOrUpDownWallHit() && booster < 20) booster++;
				if (gameStatus.leftWallHit()) {
					gameStatus.scoreP2();
					gameStatus.reset();
					playing = false;
					setTimeout(() => {
						playing = true;
					}, 3000);
				} else if (gameStatus.rightWallHit()) {
					gameStatus.scoreP1();
					gameStatus.reset();
					playing = false;
					setTimeout(() => {
						playing = true;
					}, 3000);
				}
				if (gameStatus.checkGameEnd()) {
					playing = false;
					await this.updateGameResult(
						gameStatus.winnerId(),
						gameStatus.loserId(),
						matchAt,
						mapType,
					);
					room.emit('end Game', {
						winner:
							gameStatus.winnerId() < gameStatus.loserId()
								? 'PLAYER1'
								: 'PLAYER2',
					});
					room.disconnectSockets();
					userState.delete(gameStatus.winnerId());
					userState.delete(gameStatus.loserId());
					clearInterval(intervalId);
				}
			}
			if (users.size === 1) {
				waiting -= 1;
				if (waiting === 0) {
					// 누가 남아있는 지 확인
					const socket: any = server.sockets.sockets.get([...users][0]);
					let opponentId: number;
					if (socket.userId === gameStatus.getPlayer1UserId())
						opponentId = gameStatus.getPlayer2UserId();
					else
						opponentId = gameStatus.getPlayer1UserId();
					await this.updateGameResult(
						socket.userId,
						opponentId,
						matchAt,
						mapType,
					);
					room.emit('end Game', {
						winner: socket.userId === gameStatus.getPlayer1UserId()
						? 'PLAYER1'
						: 'PLAYER2',
					});
					userState.delete(gameStatus.getPlayer1UserId());
					userState.delete(gameStatus.getPlayer2UserId());
					room.disconnectSockets();
					clearInterval(intervalId);
				}
				room.emit('pause Game', gameStatus.toJson(), {count:waiting});
			}
			else if (users.size === 0) {
				userState.delete(gameStatus.getPlayer1UserId());
				userState.delete(gameStatus.getPlayer2UserId());
				room.disconnectSockets();
				clearInterval(intervalId);
			}
			else {
				room.emit('update Game', gameStatus.toJson());
			}
		}, 1000 / 60);
	}

	async updateGameResult(
		winnerId: number,
		loserId: number,
		matchAt: number,
		mapType: string,
	) {
		return await this.prisma.$transaction(async (tx) => {
			await tx.user.update({
				where: { id: winnerId },
				data: { winCount: { increment: 1 } },
			});
			await tx.user.update({
				where: { id: loserId },
				data: { loseCount: { increment: 1 } },
			});
			await tx.match.create({
				data: {
					matchAt: new Date(matchAt),
					mapType: mapType === MapType.NORMAL ? MapType.NORMAL : MapType.FAST,
					type: MatchType.NORMAL,
					winnerId: winnerId,
					loserId: loserId,
				},
			});
		});
	}
}
