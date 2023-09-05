import {
	CanActivate,
	ExecutionContext,
	Inject,
	Injectable,
} from '@nestjs/common';
import { Request } from 'express';
import { PrismaService } from 'src/common/prisma';

@Injectable()
export class CheckUserInGuard implements CanActivate {
	constructor(@Inject(PrismaService) private prisma: PrismaService) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest<Request>();
		const userId = request.user['id'];
		const channelId = parseInt(request.params['id']);
		return !!(await this.prisma.participant.findUnique({
			where: { channelId_userId: { channelId: channelId, userId: userId } },
		}));
	}
}
