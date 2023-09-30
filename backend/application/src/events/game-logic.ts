import { BroadcastOperator } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { GameStatus } from './type';

export function startGame(
	gameStatus: GameStatus,
	broadcastOp: BroadcastOperator<DefaultEventsMap, any>,
) {
	let playing = true;
	const intervalId = setInterval(() => {
		if (playing) {
			gameStatus.moveBall();
			gameStatus.paddleOrUpDownWallHit();
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
			if (gameStatus.checkP1Win()) {
				playing = false;
				clearInterval(intervalId);
			} else if (gameStatus.checkP2Win()) {
				playing = false;
				clearInterval(intervalId);
			}
		}
		broadcastOp.emit('update Game', gameStatus.toJson());
		// }
	}, 1000 / 60);
}
