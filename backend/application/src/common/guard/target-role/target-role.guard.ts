import {
	CanActivate,
	ExecutionContext,
	Inject,
	Injectable,
} from '@nestjs/common';
import { Request } from 'express';
import { PrismaService } from 'src/common/prisma';

@Injectable()
export class TargetRoleGuard implements CanActivate {
	constructor(@Inject(PrismaService) private prisma: PrismaService) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest<Request>();
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
