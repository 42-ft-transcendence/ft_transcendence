export class Constant {
	private paddleWidth: number;
	private paddleHeight: number;
	private paddleMargin: number;
	private canvasWidth: number;
	private canvasHeight: number;
	private ballSpeed: number;
	private ballRadius: number;
	private winningScore: number;

	constructor(pw: number, ph: number, br: number, ws: number) {
		this.paddleWidth = pw;
		this.paddleHeight = ph;
		this.paddleMargin = 100;
		this.canvasWidth = 1920;
		this.canvasHeight = 1080;
		this.ballSpeed = 10;
		this.ballRadius = br;
		this.winningScore = ws;
	}

	getPaddleWidth = () => {
		return this.paddleWidth;
	};

	getPaddleHeight = () => {
		return this.paddleHeight;
	};

	getPaddleMargin = () => {
		return this.paddleMargin;
	};

	getCanvasWidth = () => {
		return this.canvasWidth;
	};

	getCanvasHeight = () => {
		return this.canvasHeight;
	};

	getBallSpeed = () => {
		return this.ballSpeed;
	};

	getBallRadius = () => {
		return this.ballRadius;
	};

	getWinningScore = () => {
		return this.winningScore;
	};
}
