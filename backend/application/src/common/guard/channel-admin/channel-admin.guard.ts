import {
	CanActivate,
	ExecutionContext,
	Inject,
	Injectable,
} from '@nestjs/common';
import { ChannelType } from '@prisma/client';
import { Request } from 'express';
import { PrismaService } from 'src/common/prisma';

@Injectable()
export class ChannelAdminGuard implements CanActivate {
	constructor(@Inject(PrismaService) private prisma: PrismaService) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest<Request>();
		const userId = parseInt(request.user['id']);
		const channelId = parseInt(
			request.header('transcendence-authorization-channel-id'),
		);
		const result = await this.prisma.administrator.findUnique({
			where: { channelId_userId: { channelId: channelId, userId: userId } },
			select: { channel: { select: { type: true } } },
		});
		if (result && result.channel.type !== ChannelType.ONETOONE) return true;
		return false;
	}
}
