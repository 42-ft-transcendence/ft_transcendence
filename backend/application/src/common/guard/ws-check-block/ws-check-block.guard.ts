import {
	CanActivate,
	ExecutionContext,
	Inject,
	Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/common/prisma';

@Injectable()
export class WsCheckBlockGuard implements CanActivate {
	constructor(@Inject(PrismaService) private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
		const socket = context.switchToWs().getClient();
    const payload = context.switchToWs().getData();
		const interlocator = await this.prisma.message.findFirst({
			where: {
				channelId: payload.channelId,
				senderId: {
					not: socket.userId
				}
			},
			select: {
				senderId: true
			}
		});
		if (interlocator === null)
			return false;
		const isBlocked = await this.prisma.block.findMany({
			where: {
				OR: [
					{ AND: [{ blockerId: socket.userId }, { blockeeId: interlocator.senderId }]},
					{ AND: [{ blockerId: interlocator.senderId }, { blockeeId: socket.userId }]},
				],
			},
		});
		payload.interlocatorId = interlocator.senderId;
    return isBlocked.length === 0;
  }
}
