import {
	CanActivate,
	ExecutionContext,
	Inject,
	Injectable,
} from '@nestjs/common';
import { ChannelType } from '@prisma/client';
import { PrismaService } from 'src/common/prisma';

@Injectable()
export class WsChannelAdminGuard implements CanActivate {
  constructor(@Inject(PrismaService) private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext, ): Promise<boolean> {
    const socket = context.switchToWs().getClient();
    const payload = context.switchToWs().getData();
    const userId = socket.userId;
    const channelId = payload.channelId;
    const result = await this.prisma.administrator.findUnique({
			where: { channelId_userId: { channelId: channelId, userId: userId } },
			select: { channel: { select: { type: true } } },
		});
    if (result && result.channel.type !== ChannelType.ONETOONE) return true;
		return false;
  }
}
