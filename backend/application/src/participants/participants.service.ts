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
			const firstAdministrator = channel.administrators.at(1); // 여기선 무조건 현재 사용자는 채널 소유자이므로, 0번째 인덱스 관리자는 현재 사용자고, 1번째 인덱스 관리자부터 다른 사용자다. 소유자는 관리자 중 가장 먼저 관리자로 지정된 사람이니까!
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

	async exitDirect(userId: number, channelId: number) {
		return await this.prisma.$transaction(async (tx) => {
			/**
			 * 대상 사용자와 다이렉트 메시지 채널에 대한 participant 정보를 제거한다.
			 * 만약, 대상 사용자가 소유자라면 대상 다이렉트 메시지 채널의 메시지 중 대상 사용자가 아닌 senderId의 값을 확인해 다음을 처리한다.
			 * 	이 값이 NULL이라면 채널, 관리자, 참여자, 메시지 정보 모두 삭제 ← 채널을 삭제하면 된다
			 * 	NULL이 아니라면 senderId 사용자를 소유자로 만들기 // 다이렉트 메시지 채널에선 관리자는 다루지 않는다.
			 * 적절한 JSON 오브젝트를 반환한다.
			 */
			const channel = await tx.channel.findUniqueOrThrow({
				where: { id: channelId },
				include: {
					messages: {
						where: { senderId: { not: userId } },
						select: { senderId: true },
					},
				},
			});

			await tx.participant.delete({
				where: { channelId_userId: { channelId: channelId, userId: userId } },
			});

			if (channel.ownerId !== userId) return { id: channel.id };

			if (channel.messages.at(0)?.senderId) {
				// channel.messages.at(0)은 무조건 존재할 수 밖에 없음. 다이렉트 메시지 채널 생성 시 내부적으로 생성하는 메시지가 존재하기 때문이다. 따라서 else if로 undefined일 때를 걸러줄 필요가 없음
				await tx.channel.update({
					where: { id: channelId },
					data: { ownerId: channel.messages.at(0).senderId },
				});
			} else await tx.channel.delete({ where: { id: channelId } });

			return { id: channel.id };
		});
	}
}
