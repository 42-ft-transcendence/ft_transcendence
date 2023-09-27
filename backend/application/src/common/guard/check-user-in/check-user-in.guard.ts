import {
	CanActivate,
	ExecutionContext,
	ForbiddenException,
	Inject,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/common/prisma';
import { UserExtendedRequest } from 'src/common/type';

@Injectable()
export class CheckUserInGuard implements CanActivate {
	constructor(@Inject(PrismaService) private prisma: PrismaService) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest<UserExtendedRequest>();
		const userId = request.user.id;
		const channelId = parseInt(request.params['channelId']);
		// return !!(await this.prisma.participant.findUnique({
		// 	where: { channelId_userId: { channelId: channelId, userId: userId } },
		// }));
		const channel = await this.prisma.channel.findUnique({
			where: { id: channelId },
			select: { participants: { where: { userId: userId } } },
		});
		if (!channel) throw new NotFoundException('채널이 존재하지 않습니다.');
		if (channel.participants.length === 0)
			throw new ForbiddenException('채널에 참여하고있지 않습니다.');
		return true;
	}
}
