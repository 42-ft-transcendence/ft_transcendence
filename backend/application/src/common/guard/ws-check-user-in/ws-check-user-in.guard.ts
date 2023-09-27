import {
	CanActivate,
	ExecutionContext,
	Inject,
	Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/common/prisma';
import { SocketException } from 'src/common/type';

@Injectable()
export class WsCheckUserInGuard implements CanActivate {
	constructor(@Inject(PrismaService) private prisma: PrismaService) {}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
		const socket = context.switchToWs().getClient();
		const payload = context.switchToWs().getData();
		const userId = socket.userId;
		const channelId = Number(payload.channelId);
		if (!!(await this.prisma.participant.findUnique({
			where: { channelId_userId: { channelId: channelId, userId: userId } },
		})))
			return true;
		throw new SocketException('Forbidden', '해당 채널에 참여하고 있지 않습니다.');
	}
}
