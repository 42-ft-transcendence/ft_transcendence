import { Injectable } from '@nestjs/common';
import { CreateBanDto, UpdateBanDto } from './dto';
import { PrismaService } from 'src/common';

@Injectable()
export class BansService {
	constructor(private prisma: PrismaService) {}

	async create(createBanDto: CreateBanDto) {
		const { userId, channelId } = createBanDto;

		return await this.prisma.user.update({
			where: { id: userId },
			data: {
				bans: { create: { channelId: channelId } },
				participants: {
					delete: {
						channelId_userId: { channelId: channelId, userId: userId },
					},
				},
			},
			select: { id: true, nickname: true, avatar: true },
		});
	}

	async findAll() {
		return await this.prisma.ban.findMany();
	}

	async findOne(id: number) {
		return await this.prisma.ban.findUniqueOrThrow({ where: { id } });
	}

	async update(id: number, updateBanDto: UpdateBanDto) {
		return await this.prisma.ban.update({ where: { id }, data: updateBanDto });
	}

	async remove(userId: number, channelId: number) {
		return (
			await this.prisma.ban.delete({
				where: { channelId_userId: { channelId: channelId, userId: userId } },
				select: {
					user: { select: { id: true, nickname: true, avatar: true } },
				},
			})
		).user;
	}
}
