import {
	CanActivate,
	ExecutionContext,
	ForbiddenException,
	Injectable,
} from '@nestjs/common';
import { Request } from 'express';
import { PrismaService } from 'src/common';

@Injectable()
export class CheckTargetOwnerGuard implements CanActivate {
	constructor(private prisma: PrismaService) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest<Request>();
		const targetId = request.body.userId;
		const channelId = request.body.channelId;

		const { ownerId } = await this.prisma.channel.findUnique({
			where: { id: channelId },
			select: { ownerId: true },
		});
		if (ownerId === targetId)
			throw new ForbiddenException(
				'소유자에 대해 해당 작업을 처리할 수 없습니다.',
			);
		return true;
	}
}
