import {
	CanActivate,
	ConflictException,
	ExecutionContext,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { Request } from 'express';
import { PrismaService } from 'src/common/prisma';

@Injectable()
export class CheckTargetAdminGuard implements CanActivate {
	constructor(private prisma: PrismaService) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest<Request>();
		let channelId: number, userId: number;

		if (request.method === 'POST') {
			channelId = request.body.channelId;
			userId = request.body.userId;
		} else if (request.method === 'DELETE') {
			channelId = parseInt(request.params.channelId);
			userId = parseInt(request.params.userId);
		}
		const hasAdmin = await this.prisma.administrator.findUnique({
			where: { channelId_userId: { channelId: channelId, userId: userId } },
		});
		if (!hasAdmin && request.method === 'DELETE')
			throw new NotFoundException(
				'관리자가 아닌 사용자입니다. 새로고침 후 다시 이용해주세요.',
			);
		return true;
	}
}
