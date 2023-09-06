import {
	CanActivate,
	ExecutionContext,
	Inject,
	Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/common/prisma';
import { UserExtendedRequest } from 'src/common/type';

@Injectable()
export class CheckBanGuard implements CanActivate {
	constructor(@Inject(PrismaService) private prisma: PrismaService) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest<UserExtendedRequest>();
		const userId = request.user.id;
		const channelId = request.body.channelId;
		const isBanned = await this.prisma.ban.findUnique({
			where: { channelId_userId: { channelId: channelId, userId: userId } },
		});
		return !isBanned;
	}
}
