import {
	CanActivate,
	ExecutionContext,
	Inject,
	Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/common/prisma';

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
		return !!(await this.prisma.participant.findUnique({
			where: { channelId_userId: { channelId: channelId, userId: userId } },
		}));
	}
}
