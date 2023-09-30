import {
	resolveWidth,
	resolveHeight,
	paddleBackSideMargin,
	paddleHeight,
	ballRadius,
	ballSpeed,
	paddleWidth,
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
		this.x += this.dx * ballSpeed;
		this.y += this.dy * ballSpeed;
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

	constructor(uid: number, x: number) {
		this.uid = uid;
		this.x = x;
		this.y = resolveHeight / 2;
		this.score = 0;
	}

	move = (dir: 'up' | 'down') => {
		if (dir === 'up') {
			const dest = this.y - 15;
			this.y = dest < paddleHeight / 2 ? paddleHeight / 2 : dest;
		} else {
			const dest = this.y + 15;
			this.y =
				dest + paddleHeight / 2 > resolveHeight
					? resolveHeight - paddleHeight / 2
					: dest;
		}
	};

	increaseScore = () => {
		this.score += 1;
	};

	reset = (x: number) => {
		this.x = x;
		this.y = resolveHeight / 2;
	};
}

export class GameStatus {
	roomTitle: string;
	ball: Ball;
	player1: Player;
	player2: Player;

	constructor(uid1: number, uid2: number, roomTitle: string) {
		this.roomTitle = roomTitle;
		this.ball = new Ball();
		this.player1 = new Player(uid1, paddleBackSideMargin + paddleWidth / 2);
		this.player2 = new Player(
			uid2,
			resolveWidth - paddleBackSideMargin - paddleWidth / 2,
		);
	}

	reset = () => {
		this.ball.reset();
		this.player1.reset(paddleBackSideMargin + paddleWidth / 2);
		this.player2.reset(resolveWidth - paddleBackSideMargin - paddleWidth / 2);
	};

	moveBall = () => {
		this.ball.move();
	};

	movePlayer = (userId: number, key: string) => {
		const player = this.player1.uid === userId ? this.player1 : this.player2;
		if (key === 'up') player.move('up');
		else if (key === 'down') player.move('down');
	};

	leftWallHit = () => {
		return this.ball.x - ballRadius < 0;
	};

	rightWallHit = () => {
		return this.ball.x + ballRadius > resolveWidth;
	};

	paddleOrUpDownWallHit = () => {
		const player =
			this.ball.x - ballRadius < resolveWidth / 2 ? this.player1 : this.player2;

		const playerPos = {
			top: player.y - paddleHeight / 2,
			bottom: player.y + paddleHeight / 2,
			left: player.x - paddleWidth / 2,
			right: player.x + paddleWidth / 2,
			center: player.y,
		};

		const ballPos = {
			top: this.ball.y - ballRadius,
			bottom: this.ball.y + ballRadius,
			left: this.ball.x - ballRadius,
			right: this.ball.x + ballRadius,
			center: this.ball.y,
		};

		if (
			ballPos.right > playerPos.left &&
			ballPos.bottom > playerPos.top &&
			ballPos.left < playerPos.right &&
			ballPos.top < playerPos.bottom
		) {
			const heightDiff = ballPos.center - playerPos.center;
			const ratio = heightDiff / (paddleHeight / 2);
			const angle = (ratio * Math.PI) / 4;
			const direction = this.ball.x < resolveWidth / 2 ? 1 : -1;
			this.ball.dx = direction * Math.cos(angle);
			this.ball.dy = Math.sin(angle);
		} else if (ballPos.top < 0 || ballPos.bottom > resolveHeight) {
			this.ball.dy = -this.ball.dy;
		}
	};

	scoreP1 = () => {
		this.player1.increaseScore();
	};

	scoreP2 = () => {
		this.player2.increaseScore();
	};

	checkP1Win = () => {
		return this.player1.score === 10;
	};

	checkP2Win = () => {
		return this.player2.score === 10;
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
