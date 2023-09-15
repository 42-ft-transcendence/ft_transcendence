import {
	CanActivate,
	ExecutionContext,
	Inject,
	Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/common/prisma';
import { UserExtendedRequest } from 'src/common/type';

@Injectable()
export class TargetRoleGuard implements CanActivate {
	constructor(@Inject(PrismaService) private prisma: PrismaService) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest<UserExtendedRequest>();
		const targetId = parseInt(
			request.header('transcendence-authorization-user-id'),
		);
		const channelId = parseInt(
			request.header('transcendence-authorization-channel-id'),
		);
		const result = await this.prisma.administrator.findUnique({
			where: { channelId_userId: { channelId: channelId, userId: targetId } },
			select: { id: true },
		});
		return !result;
	}
}
