import { MapType } from "@prisma/client";
import Deque = require("double-ended-queue");

type SocketInfo = { socketId: string, userId: number };
export class GameQueue {
	constructor() {
		this.gameQueue.set(MapType.NORMAL, new Deque<SocketInfo>());
		this.gameQueue.set(MapType.FAST, new Deque<SocketInfo>());
	}
	private gameQueue = new Map<string, Deque<SocketInfo>>();
	push(mapType: MapType, socketInfo: SocketInfo) {
		const queue = this.gameQueue.get(mapType);
		return queue.push(socketInfo);
	}
	
	legnth(mapType: MapType): number {
		const queue = this.gameQueue.get(mapType);
		return queue.length;
	}

	shift(mapType: MapType): SocketInfo | undefined {
		const queue = this.gameQueue.get(mapType);
		return queue.shift();
	}

	has(socketId:string) {
		for (let socketinfo of this.gameQueue.get(MapType.NORMAL).toArray()){
			if (socketinfo.socketId === socketId)
				return true;
		}
		for (let socketinfo of this.gameQueue.get(MapType.FAST).toArray()){
			if (socketinfo.socketId === socketId)
				return true;
		}
		return false;
	}
};