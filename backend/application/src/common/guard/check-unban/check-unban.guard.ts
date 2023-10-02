import {
	BadRequestException,
	CanActivate,
	ExecutionContext,
	Injectable,
} from '@nestjs/common';
import { Request } from 'express';
import { PrismaService } from 'src/common/prisma';

@Injectable()
export class CheckUnbanGuard implements CanActivate {
	constructor(private prisma: PrismaService) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest<Request>();
		const channelId = parseInt(request.params.channelId);
		const userId = parseInt(request.params.userId);
		const isBanned = await this.prisma.ban.findUnique({
			where: { channelId_userId: { channelId: channelId, userId: userId } },
		});
		if (!isBanned)
			throw new BadRequestException(
				'이미 해제한 사용자입니다. 새로고침 후 다시 시도해주세요.',
			);
		return true;
	}
}
