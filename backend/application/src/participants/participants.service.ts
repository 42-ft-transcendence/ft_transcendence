import { Injectable } from '@nestjs/common';
import { CreateParticipantDto, UpdateParticipantDto } from './dto';
import { PrismaService } from 'src/common';

@Injectable()
export class ParticipantsService {
	constructor(private prisma: PrismaService) {}

	async create(userId: number, createParticipantDto: CreateParticipantDto) {
		const result = await this.prisma.participant.create({
			data: { userId: userId, channelId: createParticipantDto.channelId },
			select: { channel: true },
		});
		return result.channel;
	}

	async findAll() {
		return await this.prisma.participant.findMany();
	}

	async findOne(id: number) {
		return await this.prisma.participant.findUniqueOrThrow({ where: { id } });
	}

	async update(id: number, updateParticipantDto: UpdateParticipantDto) {
		return await this.prisma.participant.update({
			where: { id },
			data: updateParticipantDto,
		});
	}

	async remove(userId: number, channelId: number) {
		return (
			await this.prisma.participant.delete({
				where: { channelId_userId: { channelId: channelId, userId: userId } },
				select: {
					user: {
						select: { id: true, nickname: true, avatar: true },
					},
				},
			})
		).user;
	}

	async exit(userId: number, channelId: number) {
		return this.prisma.$transaction(async (tx) => {
			const channel = await tx.channel.findUniqueOrThrow({
				where: { id: channelId },
				select: {
					id: true,
					name: true,
					ownerId: true,
					administrators: {
						where: { NOT: { userId: userId } },
						select: { userId: true },
						orderBy: { id: 'asc' },
					},
					participants: {
						where: { NOT: { userId: userId } },
						select: { userId: true },
						orderBy: { id: 'asc' },
					},
				},
			});
			// participant 모델에서 JWT 사용자, 현재 채널에 대한 데이터를 제거
			await tx.participant.delete({
				where: { channelId_userId: { channelId: channel.id, userId: userId } },
			});

			// administrator 모델에서 JWT 유저와 현재 채널에 대한 데이터를 제거
			if (channel.administrators?.find((a) => a.userId === userId))
				await tx.administrator.delete({
					where: {
						channelId_userId: { channelId: channel.id, userId: userId },
					},
				});

			if (channel.ownerId !== userId) return { id: channel.id };

			// 관리자가 있다면 관리자 중 가장 먼저 관리자가 된 사람에게 소유권을 넘긴다. 관리자가 없다면 일반 참여자 중 가장 먼저 참여한 사람에게 소유권을 넘긴다. 참여자가 아예 없다면 채널을 제거한다.
			const firstAdministrator = channel.administrators.at(0);
			const firstParticipant = channel.participants.at(0);

			if (firstAdministrator) {
				await tx.channel.update({
					where: { id: channel.id },
					data: { ownerId: firstAdministrator.userId },
				});
			} else if (firstParticipant) {
				await tx.channel.update({
					where: { id: channel.id },
					data: {
						ownerId: firstParticipant.userId,
						administrators: { create: { userId: firstParticipant.userId } },
					},
				});
			} else await tx.channel.delete({ where: { id: channel.id } });

			return { id: channel.id };
		});
	}
}
