import {
	BadRequestException,
	CanActivate,
	ExecutionContext,
	Inject,
	Injectable,
} from '@nestjs/common';
import { ChannelType } from '@prisma/client';
import { PrismaService, UserExtendedRequest, compare } from 'src/common';

@Injectable()
export class CheckPasswordGuard implements CanActivate {
	constructor(@Inject(PrismaService) private prisma: PrismaService) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest<UserExtendedRequest>();
		const { channelId, channelPassword } = request.body;
		const channel = await this.prisma.channel.findUniqueOrThrow({
			where: { id: channelId },
			select: { type: true, password: { select: { password: true } } },
		});
		// return (
		// 	channel.type !== ChannelType.PROTECTED ||
		// 	(channelPassword &&
		// 		(await compare(channelPassword, channel.password.password)))
		// );
		if (
			channel.type === ChannelType.PROTECTED &&
			(!channelPassword ||
				typeof channelPassword != 'string' ||
				!(await compare(channelPassword, channel.password.password)))
		)
			throw new BadRequestException('유효하지 않은 비밀번호입니다.');
		return true;
	}
}
