export type Status =
	| 'waiting'
	| {
			ball: {
				x: number;
				y: number;
				dx: number;
				dy: number;
			};

			player1: {
				x: number;
				y: number;
				score: number;
			};

			player2: {
				x: number;
				y: number;
				score: number;
			};

			
	  };
