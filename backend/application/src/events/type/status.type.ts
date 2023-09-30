import {
	resolveWidth,
	resolveHeight,
	paddleBackSideMargin,
	paddleHeight,
} from './constant.type';

export class Ball {
	x: number;
	y: number;
	dx: number;
	dy: number;

	constructor() {
		this.x = resolveWidth / 2;
		this.y = resolveHeight / 2;
		this.dx = 1;
		this.dy = 0;
	}

	move = () => {
		this.x += this.dx;
		this.y += this.dy;
	};

	reset = () => {
		this.x = resolveWidth / 2;
		this.y = resolveHeight / 2;
		this.dx = 1;
		this.dy = 0;
	};
}

export class Player {
	uid: number;
	x: number;
	y: number;
	score: number;

	constructor(uid: number) {
		this.uid = uid;
		this.x = paddleBackSideMargin;
		this.y = resolveHeight / 2 - paddleHeight / 2;
		this.score = 0;
	}

	move = (dir: 'up' | 'down') => {
		if (dir === 'up') {
			const dest = this.y - 15;
			this.y = dest - paddleHeight / 2 < 0 ? 0 : dest;
		} else {
			const dest = this.y + 15;
			this.y =
				dest + paddleHeight / 2 > resolveHeight
					? resolveHeight - paddleHeight / 2
					: dest;
		}
	};

	reset = () => {
		this.x = paddleBackSideMargin;
		this.y = resolveHeight / 2 - paddleHeight / 2;
	};
}

export class GameStatus {
	constructor(uid1: number, uid2: number, roomTitle: string) {
		this.roomTitle = roomTitle;
		this.ball = new Ball();
		this.player1 = new Player(uid1);
		this.player2 = new Player(uid2);
	}

	roomTitle: string;
	ball: Ball;
	player1: Player;
	player2: Player;
}

export type UserState = 'waiting' | GameStatus;
