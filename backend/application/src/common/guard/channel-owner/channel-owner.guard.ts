import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { ChannelType } from '@prisma/client';
import { Request } from 'express';
import { PrismaService } from 'src/common/prisma';

@Injectable()
export class ChannelOwnerGuard implements CanActivate {
  constructor(@Inject(PrismaService) private prisma: PrismaService) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const userId = parseInt(request.user['id']);
    const channelId = parseInt(request.header('transcendence-authorization'));
    const channel = await this.prisma.channel.findUnique({
      where: { id: channelId },
      select: { ownerId: true, type: true },
    });
    if (channel.type === ChannelType.ONETOONE) return false;
    return channel.ownerId === userId;
  }
}
