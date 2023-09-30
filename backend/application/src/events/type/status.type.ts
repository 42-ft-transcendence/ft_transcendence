import { Constant } from './constant.type';

let constant: Constant;

export class Ball {
	x: number;
	y: number;
	dx: number;
	dy: number;

	constructor() {
		this.x = constant.getCanvasWidth() / 2;
		this.y = constant.getCanvasHeight() / 2;
		this.dx = 1;
		this.dy = 0;
	}

	move = (booster?: number) => {
		this.x += this.dx * (constant.getBallSpeed() + (booster ? booster : 0));
		this.y += this.dy * (constant.getBallSpeed() + (booster ? booster : 0));
	};

	reset = () => {
		this.x = constant.getCanvasWidth() / 2;
		this.y = constant.getCanvasHeight() / 2;
		this.dx = 1;
		this.dy = 0;
	};
}

export class Player {
	uid: number;
	x: number;
	y: number;
	score: number;

	constructor(uid: number, x: number) {
		this.uid = uid;
		this.x = x;
		this.y = constant.getCanvasHeight() / 2;
		this.score = 0;
	}

	move = (dir: 'up' | 'down') => {
		if (dir === 'up') {
			const dest = this.y - 15;
			this.y =
				dest < constant.getPaddleHeight() / 2
					? constant.getPaddleHeight() / 2
					: dest;
		} else {
			const dest = this.y + 15;
			this.y =
				dest + constant.getPaddleHeight() / 2 > constant.getCanvasHeight()
					? constant.getCanvasHeight() - constant.getPaddleHeight() / 2
					: dest;
		}
	};

	increaseScore = () => {
		this.score += 1;
	};

	reset = (x: number) => {
		this.x = x;
		this.y = constant.getCanvasHeight() / 2;
	};
}

export class GameStatus {
	roomTitle: string;
	private ball: Ball;
	private player1: Player;
	private player2: Player;

	constructor(uid1: number, uid2: number, mapType: string, roomTitle: string) {
		constant = new Constant(20, 150, 15, 10);
		this.roomTitle = roomTitle;
		this.ball = new Ball();
		this.player1 = new Player(
			uid1,
			constant.getPaddleMargin() + constant.getPaddleWidth() / 2,
		);
		this.player2 = new Player(
			uid2,
			constant.getCanvasWidth() -
				constant.getPaddleMargin() -
				constant.getPaddleWidth() / 2,
		);
	}

	reset = () => {
		this.ball.reset();
		this.player1.reset(
			constant.getPaddleMargin() + constant.getPaddleWidth() / 2,
		);
		this.player2.reset(
			constant.getCanvasWidth() -
				constant.getPaddleMargin() -
				constant.getPaddleWidth() / 2,
		);
	};

	moveBall = (booster?: number) => {
		this.ball.move(booster);
	};

	movePlayer = (userId: number, key: string) => {
		const player = this.player1.uid === userId ? this.player1 : this.player2;
		if (key === 'up') player.move('up');
		else if (key === 'down') player.move('down');
	};

	leftWallHit = () => {
		return this.ball.x - constant.getBallRadius() < 0;
	};

	rightWallHit = () => {
		return this.ball.x + constant.getBallRadius() > constant.getCanvasWidth();
	};

	paddleOrUpDownWallHit = () => {
		const player =
			this.ball.x - constant.getBallRadius() < constant.getCanvasWidth() / 2
				? this.player1
				: this.player2;

		const playerPos = {
			top: player.y - constant.getPaddleHeight() / 2,
			bottom: player.y + constant.getPaddleHeight() / 2,
			left: player.x - constant.getPaddleWidth() / 2,
			right: player.x + constant.getPaddleWidth() / 2,
			center: player.y,
		};

		const ballPos = {
			top: this.ball.y - constant.getBallRadius(),
			bottom: this.ball.y + constant.getBallRadius(),
			left: this.ball.x - constant.getBallRadius(),
			right: this.ball.x + constant.getBallRadius(),
			center: this.ball.y,
		};

		if (
			ballPos.right > playerPos.left &&
			ballPos.bottom > playerPos.top &&
			ballPos.left < playerPos.right &&
			ballPos.top < playerPos.bottom
		) {
			const heightDiff = ballPos.center - playerPos.center;
			const ratio = heightDiff / (constant.getPaddleHeight() / 2);
			const angle = (ratio * Math.PI) / 4;
			const direction = this.ball.x < constant.getCanvasWidth() / 2 ? 1 : -1;
			this.ball.dx = direction * Math.cos(angle);
			this.ball.dy = Math.sin(angle);
			return true;
		}
		if (ballPos.top < 0 || ballPos.bottom > constant.getCanvasHeight()) {
			this.ball.dy = -this.ball.dy;
		}
		return false;
	};

	scoreP1 = () => {
		this.player1.increaseScore();
	};

	scoreP2 = () => {
		this.player2.increaseScore();
	};

	checkP1Win = () => {
		return this.player1.score === constant.getWinningScore();
	};

	checkP2Win = () => {
		return this.player2.score === constant.getWinningScore();
	};

	toJson = () => {
		return {
			ball: {
				x: this.ball.x,
				y: this.ball.y,
			},
			player1: {
				y: this.player1.y,
				score: this.player1.score,
			},
			player2: {
				y: this.player2.y,
				score: this.player2.score,
			},
		};
	};
}

export type UserState = 'waiting' | GameStatus;
