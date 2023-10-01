import { BroadcastOperator } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { GameStatus } from './type';

export function startGame(
	gameStatus: GameStatus,
	broadcastOp: BroadcastOperator<DefaultEventsMap, any>,
	speedFlag: boolean,
	room:Set<string>,
) {
	let playing = true;
	let booster = 0;
	let waiting = 30 * 60;
	const intervalId = setInterval(() => {
		if (playing) {
			if (speedFlag) gameStatus.moveBall(booster);
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
			if (gameStatus.checkP1Win()) {
				playing = false;
				clearInterval(intervalId);
			} else if (gameStatus.checkP2Win()) {
				playing = false;
				clearInterval(intervalId);
			}
		}
		if (room.size !== 2) {
			waiting -= 1;
			playing = false;
			broadcastOp.emit('pause Game', gameStatus.toJson(), {count:waiting});
		}
		else {
			playing = true;
			broadcastOp.emit('update Game', gameStatus.toJson());
		}
		// }
	}, 1000 / 60);
}
