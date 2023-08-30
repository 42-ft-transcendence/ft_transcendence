import {
	CanActivate,
	ExecutionContext,
	Inject,
	Injectable,
} from '@nestjs/common';
import { Request } from 'express';
import { PrismaService } from 'src/common/prisma';

@Injectable()
export class CheckBanGuard implements CanActivate {
	constructor(@Inject(PrismaService) private prisma: PrismaService) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest<Request>();
		const userId = request.user['id'];
		const channelId = request.body.channelId;
		const isbanned = await this.prisma.ban.findUnique({
			where: { channelId_userId: { channelId: channelId, userId: userId } },
		});
		return !isbanned;
	}
}
