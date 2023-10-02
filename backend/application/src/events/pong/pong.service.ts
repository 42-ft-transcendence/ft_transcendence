import { HttpException, Injectable } from '@nestjs/common';
import { BroadcastOperator } from 'socket.io';
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
	) {
		let playing = true;
		let booster = 0;
		const matchAt: number = Date.now();
		const intervalId = setInterval(async () => {
			if (playing) {
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
			room.emit('update Game', gameStatus.toJson());
			// }
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
