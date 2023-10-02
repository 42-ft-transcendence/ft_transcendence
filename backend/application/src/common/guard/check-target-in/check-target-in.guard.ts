import {
	CanActivate,
	ExecutionContext,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { Request } from 'express';
import { PrismaService } from 'src/common';

@Injectable()
export class CheckTargetInGuard implements CanActivate {
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
		const participant = await this.prisma.participant.findUnique({
			where: { channelId_userId: { channelId: channelId, userId: userId } },
		});
		if (!participant)
			throw new NotFoundException(
				'대상이 채널에 참여중이지 않습니다. 새로고침 후 다시 확인하세요.',
			);
		return true;
	}
}
