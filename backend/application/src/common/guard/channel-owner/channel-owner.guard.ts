import {
	CanActivate,
	ExecutionContext,
	Inject,
	Injectable,
} from '@nestjs/common';
import { ChannelType } from '@prisma/client';
import { PrismaService } from 'src/common/prisma';
import { UserExtendedRequest } from 'src/common/type';

@Injectable()
export class ChannelOwnerGuard implements CanActivate {
	constructor(@Inject(PrismaService) private prisma: PrismaService) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest<UserExtendedRequest>();
		const userId = request.user.id;
		const channelId = parseInt(
			request.header('transcendence-authorization-channel-id'),
		);
		const targetId = parseInt(
			request.header('transcendence-authorization-user-id'),
		);
		const channel = await this.prisma.channel.findUnique({
			where: { id: channelId },
			select: {
				ownerId: true,
				type: true,
				participants: { select: { userId: true } },
			},
		});
		if (
			!channel ||
			channel.type === ChannelType.ONETOONE ||
			!channel.participants.find((p) => p.userId === targetId)
		)
			return false;
		return channel.ownerId === userId;
	}
}
