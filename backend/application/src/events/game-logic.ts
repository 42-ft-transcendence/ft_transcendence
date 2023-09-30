import {
	Ball,
	GameStatus,
	Player,
	ballRadius,
	ballSpeed,
	paddleHeight,
	paddleWidth,
	resolveHeight,
	resolveWidth,
} from './type';

export function startGame(gameStatus: GameStatus) {
	const { ball, player1, player2 } = gameStatus;
	let playing = true;
	setInterval(() => {
		if (playing) {
			ball.move();
			const player = ball.x - ballRadius < resolveWidth / 2 ? player2 : player1;
			checkCollision(player, ball);
			if (ball.x - ballRadius < 0) {
				player1.score += 1;
				ball.reset();
				player1.reset();
				player2.reset();
				playing = false;
				setTimeout(() => {
					playing = true;
				}, 3000);
			} else if (ball.x + ballRadius > resolveWidth) {
				player2.score += 1;
				ball.reset();
				player1.reset();
				player2.reset();
				playing = false;
				setTimeout(() => {
					playing = true;
				}, 3000);
			}
			if (player1.score === 10 || player2.score === 10) {
				playing = false;
			} else if (player2.score === 5) {
				playing = false;
			}
		}
	}, 1000 / 60);
}

function checkCollision(player: Player, ball: Ball) {
	const playerPos = {
		top: player.y - paddleHeight / 2,
		bottom: player.y + paddleHeight / 2,
		left: player.x - paddleWidth / 2,
		right: player.y - paddleWidth / 2,
		center: player.y,
	};

	const ballPos = {
		top: ball.y - ballRadius,
		bottom: ball.y + ballRadius,
		left: ball.x - ballRadius,
		right: ball.y - ballRadius,
		center: ball.y,
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
		const direction = ball.x < resolveWidth / 2 ? 1 : -1;
		ball.dx = direction * ballSpeed * Math.cos(angle);
		ball.dy = ballSpeed * Math.sin(angle);
	} else if (ballPos.top < 0 || ballPos.bottom > resolveHeight) {
		ball.dy = -ball.dy;
	}
}
