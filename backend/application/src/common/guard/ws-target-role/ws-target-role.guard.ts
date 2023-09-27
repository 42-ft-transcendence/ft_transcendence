import {
	CanActivate,
	ExecutionContext,
	Inject,
	Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/common/prisma';
import { SocketException } from 'src/common/type';

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
		if(!result)
			return true;
		throw new SocketException('Forbidden', '관리자에 대해 해당 요청을 처리할 수 없습니다.');
  }
}
