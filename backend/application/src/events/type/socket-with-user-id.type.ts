import { Socket } from 'socket.io';

export interface SocketWithUserId extends Socket {
	userId: number;
}
