import {
	CanActivate,
	ExecutionContext,
	Inject,
	Injectable,
} from '@nestjs/common';
import { ChannelType } from '@prisma/client';
import { Request } from 'express';
import { PrismaService } from 'src/common/prisma';
import { compare } from 'src/common';

@Injectable()
export class CheckPasswordGuard implements CanActivate {
	constructor(@Inject(PrismaService) private prisma: PrismaService) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest<Request>();
		const { channelId, channelPassword } = request.body;
		const channel = await this.prisma.channel.findUniqueOrThrow({
			where: { id: channelId },
			select: { type: true, password: { select: { password: true } } },
		});
		return (
			channel.type !== ChannelType.PROTECTED ||
			(channelPassword &&
				(await compare(channelPassword, channel.password.password)))
		);
	}
}