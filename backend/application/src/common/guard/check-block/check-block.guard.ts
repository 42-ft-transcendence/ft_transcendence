import {
	CanActivate,
	ExecutionContext,
	Inject,
	Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/common/prisma';
import { UserExtendedRequest } from 'src/common/type';

/**
 * 다음 중 하나에 해당하면 요청을 처리하지 않는다.
 * 1. 현재 사용자가 대화 상대를 차단( block )했을 때.
 * 2. 대화 상대가 현재 사용자를 차단했을 때.
 */
@Injectable()
export class CheckBlockGuard implements CanActivate {
	constructor(@Inject(PrismaService) private prisma: PrismaService) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest<UserExtendedRequest>();
		const userId = request.user.id;
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
