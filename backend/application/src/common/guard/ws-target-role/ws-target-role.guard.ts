import {
	CanActivate,
	ExecutionContext,
	Inject,
	Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/common/prisma';

@Injectable()
export class WsTargetRoleGuard implements CanActivate {
  constructor(@Inject(PrismaService) private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext,): Promise<boolean> {
    const payload = context.switchToWs().getData();
    const targetId = payload.targetId;
    const channelId = payload.channelId;
    const result = await this.prisma.administrator.findUnique({
			where: { channelId_userId: { channelId: channelId, userId: targetId } },
			select: { id: true },
		});
		return !result;
  }
}
