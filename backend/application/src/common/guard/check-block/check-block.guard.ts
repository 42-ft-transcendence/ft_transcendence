import {
	CanActivate,
	ExecutionContext,
	Inject,
	Injectable,
} from '@nestjs/common';
import { Request } from 'express';
import { PrismaService } from 'src/common/prisma';

@Injectable()
export class CheckBlockGuard implements CanActivate {
	constructor(@Inject(PrismaService) private prisma: PrismaService) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest<Request>();
		const userId = request.user['id'];
		const interlocatorId = request.body.interlocatorId;
		const isBlocked = await this.prisma.block.findMany({
			where: {
				OR: [
					{ AND: [{ blockerId: userId }, { blockeeId: interlocatorId }] },
					{ AND: [{ blockerId: interlocatorId }, { blockeeId: userId }] },
				],
			},
		});
		return isBlocked.length === 0;
	}
}
