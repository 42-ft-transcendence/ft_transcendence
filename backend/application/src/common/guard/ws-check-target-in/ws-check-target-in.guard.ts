import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma';
import { SocketException } from 'src/common/type';

@Injectable()
export class WsCheckTargetInGuard implements CanActivate {
	constructor(private prisma: PrismaService) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const payload = context.switchToWs().getData();
		const participant = await this.prisma.participant.findUnique({
			where: {
				channelId_userId: {
					channelId: Number(payload.channelId),
					userId: Number(payload.targetId),
				},
			},
		});
		if (!participant)
			throw new SocketException(
				'NotFound',
				'대상이 채널에 참여중이지 않습니다. 새로고침 후 다시 확인하세요.',
			);
		return true;
	}
}
